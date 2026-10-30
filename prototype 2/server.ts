import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini
  app.post('/api/interview-prep', async (req, res) => {
    try {
      const { candidateName, role, company, recentNews } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        You are an expert executive recruiter preparing for an interview with ${candidateName}, who is currently a ${role} at ${company}.
        Here is some recent news about the candidate:
        ${recentNews}

        Generate a concise Interview Prep guide containing:
        1. 3 Key Icebreaker questions based on their recent news/role.
        2. 3 Deep-dive behavioral questions assessing their executive mobility and motivations.
        3. 2 Potential red flags or areas to probe based on standard executive transitions.

        Format the output clearly using Markdown. Use H3 headers (###) for the sections.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('Error generating interview prep:', error);
      res.status(500).json({ error: error.message || 'Failed to generate content.' });
    }
  });

  // API Route for Phenom Aura Agent with Document Analysis
  const handleAuraRequest = async (req: express.Request, res: express.Response) => {
    try {
      const { prompt, attachedFiles } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const promptContent = `
        You are Phenom Aura Agent, an elite AI partner for an in-house executive recruiting team.
        User query: ${prompt}
        Attached documents: ${attachedFiles && attachedFiles.length > 0 ? attachedFiles.join(', ') : 'None'}

        Provide a structured executive talent analysis with:
        - Executive Summary (2-3 sentences oriented toward in-house leadership search parameters)
        - Recommended Executive Talent profiles (3 candidates)
        - Target Source Companies (3 companies with active executive mobility signals)
        - Next Steps for in-house recruiters and hiring manager calibration

        Return valid JSON with keys:
        {
          "summary": string,
          "recommendedCandidates": [
            { "name": string, "role": string, "company": string, "matchScore": number, "reason": string }
          ],
          "recommendedCompanies": [
            { "name": string, "reason": string, "mobilitySignal": string }
          ],
          "nextSteps": string[]
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContent,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({
        result: {
          query: prompt,
          attachedDocs: (attachedFiles || []).map((f: string, idx: number) => ({ id: `doc-${idx}`, name: f, size: 'Uploaded', type: 'doc' })),
          ...parsed
        }
      });
    } catch (error: any) {
      console.error('Error generating Phenom Aura Agent response:', error);
      res.status(500).json({ error: error.message || 'Failed to generate Phenom Aura Agent response.' });
    }
  };

  app.post('/api/aura', handleAuraRequest);
  app.post('/api/copilot', handleAuraRequest);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
