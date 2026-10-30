import React, { useState } from 'react';
import { Candidate } from '../../types';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';

export function InterviewPrepTab({ candidate }: { candidate: Candidate }) {
  const [prepData, setPrepData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePrep = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          candidateName: `${candidate.firstName} ${candidate.lastName}`,
          role: candidate.role,
          company: candidate.company,
          recentNews: `Coverage focuses on John Ternus beginning his tenure as Apple Chief Executive Officer, succeeding Tim Cook, and stepping into an immediate public test around Apple's September product launch.`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate interview prep');
      }

      const data = await response.json();
      setPrepData(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI Interview Preparation</h2>
          <p className="text-slate-500 text-sm mt-1">Generate tailored questions based on profile and recent news.</p>
        </div>
        <button 
          onClick={generatePrep}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {prepData ? 'Regenerate Prep' : 'Generate Prep'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 text-sm">
          {error}
        </div>
      )}

      {prepData ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm overflow-y-auto">
          <div className="prose prose-slate prose-sm max-w-none prose-headings:text-slate-900 prose-headings:font-semibold prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-800">
            <Markdown>{prepData}</Markdown>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 min-h-[400px]">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to prepare?</h3>
          <p className="text-slate-500 text-center max-w-md text-sm mb-6">
            Click generate to synthesize candidate data, recent news, and mobility scores into a targeted interview guide.
          </p>
        </div>
      )}
    </div>
  );
}
