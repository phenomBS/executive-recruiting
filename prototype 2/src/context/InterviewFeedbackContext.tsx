import React, { createContext, useContext, useState } from 'react';
import { InterviewFeedback } from '../types';
import { initialMockFeedback } from '../data/mockInterviewFeedback';

interface InterviewFeedbackContextType {
  feedbacks: InterviewFeedback[];
  getFeedbackForCandidate: (candidateId: string) => InterviewFeedback[];
  addFeedback: (feedback: Omit<InterviewFeedback, 'id'>) => void;
  deleteFeedback: (feedbackId: string) => void;
}

const InterviewFeedbackContext = createContext<InterviewFeedbackContextType | undefined>(undefined);

export function InterviewFeedbackProvider({ children }: { children: React.ReactNode }) {
  const [feedbacks, setFeedbacks] = useState<InterviewFeedback[]>(initialMockFeedback);

  const getFeedbackForCandidate = (candidateId: string): InterviewFeedback[] => {
    const list = feedbacks.filter(f => f.candidateId === candidateId);
    if (list.length > 0) return list;

    // Fallback: If a candidate has no feedback yet, return a realistic base interview entry
    return [
      {
        id: `fb-auto-${candidateId}`,
        candidateId,
        giver: {
          id: 'g-default',
          name: 'Dr. Sarah Jenkins',
          title: 'VP of Executive Talent & Search Committee Lead',
          department: 'Executive Search & Governance',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
          email: 'sjenkins@execsearch.example.com'
        },
        stage: 'Executive Sourcing Calibration & Initial Assessment',
        date: 'Oct 1, 2026',
        rating: 9,
        recommendation: 'strong_hire',
        quickTags: [
          '+ Strategic Thinker',
          '+ High P&L Scale Experience',
          '+ Executive Presence'
        ],
        competencyRatings: [
          { competency: 'Strategic Vision & P&L Scale', score: 9, notes: 'Strong leadership background and proven business impact.' },
          { competency: 'Executive Presence & Communication', score: 9, notes: 'Articulate, confident, well-structured communication.' },
          { competency: 'People Leadership & Cultural Impact', score: 8, notes: 'Demonstrated team building capability.' },
          { competency: 'Operational Resilience & Agility', score: 9, notes: 'Adaptable to market disruptions.' }
        ],
        strengths: [
          'Strong domain expertise and proven leadership credentials.',
          'Articulate communicator with strong strategic clarity.'
        ],
        risksOrConcerns: [
          'Initial assessment; full panel feedback pending.'
        ],
        summaryNotes: 'Very promising candidate profile. Recommended to proceed through the executive interviewing process.'
      }
    ];
  };

  const addFeedback = (newFeedback: Omit<InterviewFeedback, 'id'>) => {
    const created: InterviewFeedback = {
      ...newFeedback,
      id: `fb-${Date.now()}`
    };
    setFeedbacks(prev => [created, ...prev]);
  };

  const deleteFeedback = (feedbackId: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== feedbackId));
  };

  return (
    <InterviewFeedbackContext.Provider
      value={{
        feedbacks,
        getFeedbackForCandidate,
        addFeedback,
        deleteFeedback
      }}
    >
      {children}
    </InterviewFeedbackContext.Provider>
  );
}

export function useInterviewFeedback() {
  const context = useContext(InterviewFeedbackContext);
  if (!context) {
    throw new Error('useInterviewFeedback must be used within an InterviewFeedbackProvider');
  }
  return context;
}
