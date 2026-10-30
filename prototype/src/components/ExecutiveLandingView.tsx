import React, { useState } from 'react';
import { 
  Plus, 
  Send, 
  Calendar, 
  Bell, 
  Sparkles, 
  TrendingUp, 
  Building2, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Search,
  Check,
  Share2,
  CalendarPlus,
  Handshake,
  FolderKanban,
  Target,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { View } from './Sidebar';
import { RoleHealthBreakdownWidget } from './landing/RoleHealthBreakdownWidget';
import { OpportunityRoomsWorkflowWidget } from './landing/OpportunityRoomsWorkflowWidget';
import { ProjectsWorkflowWidget } from './landing/ProjectsWorkflowWidget';
import { RecommendationsWidget } from './landing/RecommendationsWidget';
import { PhenomAuraPromptBar } from './landing/PhenomAuraPromptBar';
import { 
  FeedbackReminderModal, 
  StartSearchModal, 
  SendSlateReviewModal, 
  NurtureAffectedModal 
} from './landing/QuickActionModals';
import { IntakeMeetingModal } from './IntakeMeetingModal';
import { 
  initialPendingFeedback, 
  initialReceivedFeedback, 
  initialMarketInsights, 
  initialAgentActivities, 
  initialRecruiterFollowups,
  PendingFeedbackItem,
  MarketInsightItem,
  RecruiterFollowupItem
} from '../data/landingData';
import { mockRecommendedCandidates, mockRecommendedCompanies, mockCompanies, mockProjects } from '../data/mockData';
import { initialDealRooms } from '../data/dealRoomsData';
import { Company, Project, RecommendedCandidate } from '../types';

interface ExecutiveLandingViewProps {
  onNavigateView: (view: View, params?: { candidateId?: string; dealRoomId?: string; projectId?: string; roleId?: string; companyId?: string }) => void;
}

export function ExecutiveLandingView({ onNavigateView }: ExecutiveLandingViewProps) {
  // State for landing interactive workflows
  const [pendingFeedback, setPendingFeedback] = useState<PendingFeedbackItem[]>(initialPendingFeedback);
  const [marketInsights, setMarketInsights] = useState<MarketInsightItem[]>(initialMarketInsights);
  const [recruiterFollowups, setRecruiterFollowups] = useState<RecruiterFollowupItem[]>(initialRecruiterFollowups);
  
  // Modals state
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isStartSearchModalOpen, setIsStartSearchModalOpen] = useState(false);
  const [isSlateReviewModalOpen, setIsSlateReviewModalOpen] = useState(false);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [selectedNurtureInsight, setSelectedNurtureInsight] = useState<MarketInsightItem | null>(null);

  // Toast / notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers for quick action modals
  const handleSendReminder = (itemId: string, channel: 'email' | 'slack') => {
    setPendingFeedback(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            remindersSent: item.remindersSent + 1,
            lastReminderDate: 'Just now'
          };
        }
        return item;
      })
    );
    showToast(`Reminder sent via ${channel === 'slack' ? 'Slack' : 'Email'} successfully!`);
  };

  const handleSendAllReminders = () => {
    setPendingFeedback(prev => 
      prev.map(item => ({
        ...item,
        remindersSent: item.remindersSent + 1,
        lastReminderDate: 'Just now'
      }))
    );
    showToast(`Sent reminders to all ${pendingFeedback.length} hiring managers!`);
    setIsReminderModalOpen(false);
  };

  const handleCreateProject = (projectData: Partial<Project>) => {
    showToast(`Started new search: "${projectData.title}" for ${projectData.company}!`);
    onNavigateView('projects');
  };

  const handleSlateSent = (projectName: string, hiringManager: string, count: number) => {
    showToast(`Dispatched slate review link with ${count} candidate(s) to ${hiringManager}!`);
  };

  const handleNurtureDispatched = (insightId: string) => {
    setMarketInsights(prev => 
      prev.map(item => {
        if (item.id === insightId) {
          return { ...item, nurtureStatus: 'nurturing' };
        }
        return item;
      })
    );
    showToast(`Initiated automated executive nurture sequences!`);
  };

  const handleAddCompanyToCrm = (company: Company) => {
    showToast(`Added ${company.name} to CRM & Active Workspace!`);
  };

  const handleAddCandidateToWorkspace = (candidate: RecommendedCandidate) => {
    showToast(`Added ${candidate.firstName} ${candidate.lastName} to Active Talent Workspace!`);
  };

  return (
    <div className="min-h-full bg-(--bg-surface-base) pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
        
        {/* Workspace Title & Workflow Description Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-(--text-strong) tracking-tight">
                Executive Talent Workspace
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase tracking-wider">
                Workflow View
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              End-to-end talent workflow: monitor open opportunity rooms, search mandate progress, talent recommendations, and leadership succession health.
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsStartSearchModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Start Search</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSlateReviewModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-purple-600" />
              <span>Send Slate</span>
            </button>

            <button
              type="button"
              onClick={() => setIsIntakeModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4 text-blue-600" />
              <span>Schedule Intake</span>
            </button>

            <button
              type="button"
              onClick={() => setIsReminderModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer relative"
            >
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Reminders</span>
              {pendingFeedback.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Workflow Metric Status Pills (Top-level pipeline KPI cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. Opportunity Rooms */}
          <div 
            onClick={() => onNavigateView('dealrooms')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                Opportunity Rooms
              </span>
              <Handshake className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {initialDealRooms.length} Open Rooms
            </div>
            <p className="text-[11px] text-purple-700 font-semibold mt-1 flex items-center gap-1">
              <span>1 Offer · 1 NDA Signed · 2 In Review</span>
            </p>
          </div>

          {/* 2. Active Projects */}
          <div 
            onClick={() => onNavigateView('projects')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                Projects Pipeline
              </span>
              <FolderKanban className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {mockProjects.length} Search Mandates
            </div>
            <p className="text-[11px] text-blue-700 font-semibold mt-1">
              100% on schedule · 77 candidates mapped
            </p>
          </div>

          {/* 3. Role Health Bench */}
          <div 
            onClick={() => onNavigateView('roles')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                Role Health
              </span>
              <Briefcase className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              83% Succession Health
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              10 of 12 roles calibrated with warm talent
            </p>
          </div>

          {/* 4. Recommendations To Add */}
          <div 
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                Recommendations
              </span>
              <Sparkles className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {mockRecommendedCandidates.length + mockRecommendedCompanies.length} Suggested to Add
            </div>
            <p className="text-[11px] text-indigo-700 font-semibold mt-1">
              {mockRecommendedCandidates.length} executives · {mockRecommendedCompanies.length} source orgs
            </p>
          </div>
        </div>

        {/* WORKFLOW SECTION 1: RECOMMENDED CANDIDATE & COMPANIES TO ADD (Top-priority workflow recommendations) */}
        <div>
          <RecommendationsWidget 
            recommendedCandidates={mockRecommendedCandidates}
            recommendedCompanies={mockRecommendedCompanies}
            onSelectCandidate={(candidateId) => onNavigateView('candidates', { candidateId })}
            onAddCandidateToWorkspace={handleAddCandidateToWorkspace}
            onAddCompanyToCrm={handleAddCompanyToCrm}
            onViewAllCandidates={() => onNavigateView('candidates')}
            onViewAllCompanies={() => onNavigateView('companies')}
          />
        </div>

        {/* WORKFLOW SECTION 2: ROLE HEALTH BENCH (Keep the Role Health section) */}
        <div>
          <RoleHealthBreakdownWidget 
            onSelectCandidate={(candidateId) => onNavigateView('candidates', { candidateId })}
            onNavigateToProjects={() => onNavigateView('projects')}
            onNavigateToRoles={() => onNavigateView('roles')}
            onNurtureRoleWarmPool={(roleTitle) => {
              showToast(`Initiated Phenom Aura Agent nurture sequences for ${roleTitle} warm leads!`);
            }}
          />
        </div>

        {/* WORKFLOW SECTION 3: OPPORTUNITY ROOMS */}
        {/* The open rooms and what stage the executive is currently in */}
        <div>
          <OpportunityRoomsWorkflowWidget 
            onNavigateView={onNavigateView}
            onShowToast={showToast}
          />
        </div>

        {/* WORKFLOW SECTION 4: PROJECTS PIPELINE */}
        {/* What stage each project is in, what action was taken last, and what action should come next */}
        <div>
          <ProjectsWorkflowWidget 
            projects={mockProjects}
            onNavigateView={onNavigateView}
            onOpenStartSearch={() => setIsStartSearchModalOpen(true)}
            onOpenSlateReview={() => setIsSlateReviewModalOpen(true)}
            onOpenReminderModal={() => setIsReminderModalOpen(true)}
            onShowToast={showToast}
          />
        </div>

        {/* AURA COPILOT PROMPT BAR (Preserved for autonomous intelligence queries) */}
        <div>
          <PhenomAuraPromptBar 
            onSelectCandidate={(name) => {
              const cand = mockRecommendedCandidates.find(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(name.toLowerCase()));
              if (cand) onNavigateView('candidates', { candidateId: cand.id });
              else onNavigateView('candidates');
            }}
            onNavigateToProjects={() => onNavigateView('projects')}
          />
        </div>

      </div>

      {/* Quick Action Modals */}
      <FeedbackReminderModal 
        isOpen={isReminderModalOpen}
        onOpenChange={setIsReminderModalOpen}
        pendingItems={pendingFeedback}
        onSendReminder={handleSendReminder}
        onSendAllReminders={handleSendAllReminders}
      />

      <StartSearchModal 
        isOpen={isStartSearchModalOpen}
        onOpenChange={setIsStartSearchModalOpen}
        onCreateProject={handleCreateProject}
      />

      <SendSlateReviewModal 
        isOpen={isSlateReviewModalOpen}
        onOpenChange={setIsSlateReviewModalOpen}
        onSlateSent={handleSlateSent}
      />

      {isIntakeModalOpen && (
        <IntakeMeetingModal 
          onClose={() => setIsIntakeModalOpen(false)}
        />
      )}

      <NurtureAffectedModal 
        isOpen={!!selectedNurtureInsight}
        onOpenChange={(open) => !open && setSelectedNurtureInsight(null)}
        insight={selectedNurtureInsight}
        onNurtureDispatched={handleNurtureDispatched}
      />

    </div>
  );
}
