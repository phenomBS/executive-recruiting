/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sidebar, View } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { CompaniesView } from './components/CompaniesView';
import { ProjectsView } from './components/ProjectsView';
import { CandidatesView } from './components/CandidatesView';
import { AgentCommandCenter } from './components/agents/AgentCommandCenter';
import { ExecutiveLandingView } from './components/ExecutiveLandingView';
import { RolesSuccessionView } from './components/roles/RolesSuccessionView';
import { JobsView } from './components/jobs/JobsView';
import { DealRoomsDashboard } from './components/dealrooms/DealRoomsDashboard';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { TooltipLayer } from './components/TooltipLayer';
import { RestrictedProvider } from './context/RestrictedContext';
import { AgentConfigProvider } from './context/AgentConfigContext';
import { InterviewFeedbackProvider } from './context/InterviewFeedbackContext';
import { RouterProvider, useRouter } from './context/RouterContext';

function AppContent() {
  const router = useRouter();

  const handleNavigateView = (view: View, params?: { candidateId?: string; roleId?: string; projectId?: string; companyId?: string; dealRoomId?: string; roomId?: string }) => {
    router.navigateToView(view, params);
  };

  const renderContent = () => {
    switch (router.view) {
      case 'home':
        return <ExecutiveLandingView onNavigateView={handleNavigateView} />;
      case 'companies':
        return <CompaniesView />;
      case 'candidates':
        return (
          <CandidatesView 
            candidateId={router.candidateId} 
            onSelectCandidate={(id) => router.setCandidateId(id)} 
          />
        );
      case 'projects':
        return <ProjectsView />;
      case 'agents':
        return <AgentCommandCenter />;
      case 'roles':
        return (
          <RolesSuccessionView 
            initialRoleId={router.roleId} 
            onNavigateCandidate={(candId) => router.setCandidateId(candId)} 
          />
        );
      case 'jobs':
        return <JobsView />;
      case 'dealrooms':
        return (
          <DealRoomsDashboard 
            initialDealRoomId={router.dealRoomId} 
            onNavigateCandidate={(candId) => router.setCandidateId(candId)} 
          />
        );
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <ExecutiveLandingView onNavigateView={handleNavigateView} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-(--bg-surface-base) text-slate-900 font-sans overflow-hidden">
      <Sidebar 
        currentView={router.view} 
        onViewChange={(view) => router.navigateToView(view)} 
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {renderContent()}
        </main>
      </div>
      <TooltipLayer />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <RestrictedProvider>
        <AgentConfigProvider>
          <InterviewFeedbackProvider>
            <AppContent />
          </InterviewFeedbackProvider>
        </AgentConfigProvider>
      </RestrictedProvider>
    </RouterProvider>
  );
}
