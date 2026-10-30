import React from 'react';
import { 
  FolderKanban, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Share2, 
  Bell, 
  UserCheck, 
  Plus, 
  Users, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Project } from '../../types';
import { View } from '../Sidebar';
import { cn } from '../../lib/utils';

interface ProjectsWorkflowWidgetProps {
  projects: Project[];
  onNavigateView: (view: View, params?: { projectId?: string }) => void;
  onOpenStartSearch: () => void;
  onOpenSlateReview: () => void;
  onOpenReminderModal: () => void;
  onShowToast: (msg: string) => void;
}

const SEARCH_STAGES = [
  { id: 'Intake', label: '1. Intake' },
  { id: 'Market Mapping', label: '2. Market Map' },
  { id: 'Calibration', label: '3. Calibration' },
  { id: 'Slate Review', label: '4. Slate Review' },
  { id: 'Offer & Close', label: '5. Offer' }
];

export function ProjectsWorkflowWidget({
  projects,
  onNavigateView,
  onOpenStartSearch,
  onOpenSlateReview,
  onOpenReminderModal,
  onShowToast
}: ProjectsWorkflowWidgetProps) {
  const getStageStepNumber = (stageName?: string) => {
    switch (stageName?.toLowerCase()) {
      case 'intake':
      case 'scoping':
        return 1;
      case 'market mapping':
      case 'sourcing':
        return 2;
      case 'calibration':
        return 3;
      case 'slate review':
      case 'interview':
        return 4;
      case 'offer':
      case 'offer stage':
      case 'close':
        return 5;
      default:
        return 3;
    }
  };

  const handleNextActionClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    const actionType = project.nextAction?.suggestedActionType;
    if (actionType === 'send_slate') {
      onOpenSlateReview();
    } else if (actionType === 'reminder') {
      onOpenReminderModal();
    } else {
      onNavigateView('projects', { projectId: project.id });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Widget Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--color-secondary-200) text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900">
                Projects Workflow
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                {projects.length} Active Searches
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Active search mandates, workflow stages, last actions taken, and next required steps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onOpenStartSearch}
            className="px-3.5 py-1.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Start New Search</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateView('projects')}
            className="px-3 py-1.5 rounded-xl border border-slate-300 hover:border-purple-500 hover:bg-purple-50/60 text-slate-700 hover:text-purple-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="p-5 sm:p-6 space-y-4">
        {projects.map((project) => {
          const currentStep = getStageStepNumber(project.stage);

          return (
            <div
              key={project.id}
              onClick={() => onNavigateView('projects', { projectId: project.id })}
              className="p-5 rounded-2xl border border-slate-200 hover:border-purple-400 bg-white hover:bg-slate-50/40 shadow-2xs hover:shadow-xs transition-all cursor-pointer group space-y-4"
            >
              {/* Row 1: Title, Stage Badge, Lead Recruiter */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {project.title}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black uppercase tracking-wider">
                      Stage: {project.stage || 'Calibration'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                      {project.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                    <span>Lead Recruiter: <strong className="text-slate-700">{project.leadRecruiter}</strong></span>
                    <span>•</span>
                    <span>Candidates identified: <strong className="text-purple-700">{project.candidatesCount || 18}</strong></span>
                    <span>•</span>
                    <span>Launched {project.createdAt}</span>
                  </p>
                </div>

                {/* Open Project CTA */}
                <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
                  <span className="text-xs font-bold text-purple-600 group-hover:text-purple-700 flex items-center gap-1">
                    <span>Open Mandate</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Row 2: Search Pipeline Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 pb-1">
                {SEARCH_STAGES.map((stg, sIdx) => {
                  const stepNumber = sIdx + 1;
                  const isCurrent = stepNumber === currentStep;
                  const isCompleted = stepNumber < currentStep;

                  return (
                    <div
                      key={stg.id}
                      className={cn(
                        "p-2 rounded-xl border text-center transition-all",
                        isCurrent 
                          ? "bg-purple-100/80 border-purple-400 ring-2 ring-purple-400/40 font-bold" 
                          : isCompleted 
                            ? "bg-emerald-50/70 border-emerald-200 font-semibold" 
                            : "bg-slate-50 border-slate-200 opacity-60 font-medium"
                      )}
                    >
                      <div className="flex items-center justify-center gap-1 text-[11px]">
                        <span className={cn(
                          "w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center",
                          isCompleted ? "bg-emerald-600 text-white" : isCurrent ? "bg-purple-600 text-white animate-pulse" : "bg-slate-200 text-slate-600"
                        )}>
                          {isCompleted ? '✓' : stepNumber}
                        </span>
                        <span className={cn(
                          "truncate text-[10px]",
                          isCurrent ? "text-purple-900" : isCompleted ? "text-emerald-800" : "text-slate-500"
                        )}>
                          {stg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Row 3: Dual Workflow Actions: LAST ACTION TAKEN vs NEXT ACTION TO COME */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
                {/* 1. What action was taken last */}
                <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Last Action Taken
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {project.lastAction?.timestamp || 'Recently'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {project.lastAction?.action || `Updated candidate calibrations and criteria baseline.`}
                    </p>
                    {project.lastAction?.actor && (
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Completed by {project.lastAction.actor}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. What action should come next */}
                <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200/90 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-600 text-white shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                        Next Action Required
                      </span>
                      {project.nextAction?.dueDate && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                          {project.nextAction.dueDate}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-purple-950 font-semibold leading-relaxed">
                      {project.nextAction?.action || `Review and calibrate next tier of candidate recommendations.`}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => handleNextActionClick(e, project)}
                        className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{project.nextAction?.actionLabel || 'Take Action'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
