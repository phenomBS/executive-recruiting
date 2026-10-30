import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Candidate } from '../types';
import { SummaryTab } from './tabs/SummaryTab';
import { InterviewPrepTab } from './tabs/InterviewPrepTab';
import { InterviewFeedbackTab } from './tabs/InterviewFeedbackTab';
import { useInterviewFeedback } from '../context/InterviewFeedbackContext';
import { useRouter } from '../context/RouterContext';

const tabsList = [
  'Summary', 'Related', 'Activity', 'Category', 'Assessment', 'Evaluations', 'Screening', 'Interview Prep', 'Job related fields', '>>'
];

export function CandidateTabs({ candidate }: { candidate: Candidate }) {
  const router = useRouter();
  const activeTab = (router.activeTab && tabsList.includes(router.activeTab))
    ? router.activeTab
    : 'Summary';
  const handleTabChange = (tab: string) => {
    router.setTab(tab === 'Summary' ? null : tab);
  };
  const { getFeedbackForCandidate } = useInterviewFeedback();
  const feedbackCount = getFeedbackForCandidate(candidate.id).length;

  return (
    <Tabs.Root value={activeTab} onValueChange={handleTabChange} className="flex flex-col w-full h-full">
      <div className="px-6 border-b border-slate-200">
        <Tabs.List className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
          {tabsList.map(tab => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className={`py-4 text-sm font-medium whitespace-nowrap transition-colors relative flex items-center gap-1.5
                ${activeTab === tab ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'}
              `}
            >
              <span>{tab}</span>
              {tab === 'Evaluations' && feedbackCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  {feedbackCount}
                </span>
              )}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700" />
              )}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-(--bg-neutral-minimal)">
        <Tabs.Content value="Summary" className="outline-none">
          <SummaryTab 
            candidate={candidate} 
            onNavigateToEvaluations={() => handleTabChange('Evaluations')} 
          />
        </Tabs.Content>

        <Tabs.Content value="Evaluations" className="outline-none h-full">
          <InterviewFeedbackTab candidate={candidate} />
        </Tabs.Content>

        <Tabs.Content value="Interview Prep" className="outline-none h-full">
          <InterviewPrepTab candidate={candidate} />
        </Tabs.Content>

        {/* Placeholder for other tabs */}
        {['Related', 'Activity', 'Category', 'Assessment', 'Screening', 'Job related fields'].map(tab => (
          <Tabs.Content key={tab} value={tab} className="outline-none">
            <div className="text-slate-500 text-sm">Content for {tab} is not implemented in this prototype.</div>
          </Tabs.Content>
        ))}
      </div>
    </Tabs.Root>
  );
}
