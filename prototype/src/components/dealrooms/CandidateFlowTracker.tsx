import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Lock, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  Send, 
  Check, 
  AlertCircle,
  Activity,
  Layers,
  FileText,
  Video,
  DollarSign,
  Users,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Flame,
  Calendar
} from 'lucide-react';
import { DealRoom, DealRoomStage, DealRoomWidget } from '../../data/dealRoomsData';
import { cn } from '../../lib/utils';

interface CandidateFlowTrackerProps {
  dealRoom: DealRoom;
  activeStageId: string;
  onSelectStage: (stageId: string) => void;
  onAdvanceStage?: (nextStageId: string) => void;
  onUpdateDealRoom?: (updated: DealRoom) => void;
}

export function CandidateFlowTracker({
  dealRoom,
  activeStageId,
  onSelectStage,
  onAdvanceStage,
  onUpdateDealRoom
}: CandidateFlowTrackerProps) {
  const [isFullFlowExpanded, setIsFullFlowExpanded] = useState(false);
  const [selectedMilestoneInfo, setSelectedMilestoneInfo] = useState<string | null>(null);

  // Identify current stage of candidate in the configured flow
  const currentStageIndex = dealRoom.stages.findIndex(s => s.id === dealRoom.currentStageId);
  const currentStage = currentStageIndex >= 0 ? dealRoom.stages[currentStageIndex] : dealRoom.stages[0];

  // Calculate overall progress across all stages and widgets
  const totalStages = dealRoom.stages.length;
  const completedStagesCount = dealRoom.stages.filter(s => s.status === 'completed').length;
  
  const allWidgets = dealRoom.stages.flatMap(s => s.widgets);
  const totalWidgets = allWidgets.length;
  const completedWidgets = allWidgets.filter(w => w.isCompleted).length;
  const percentComplete = totalWidgets > 0 ? Math.round((completedWidgets / totalWidgets) * 100) : 0;

  // Handler to advance candidate to next stage
  const handleAdvanceToNextStage = () => {
    if (!onUpdateDealRoom) return;
    const nextIndex = currentStageIndex + 1;
    if (nextIndex >= dealRoom.stages.length) return;

    const nextStage = dealRoom.stages[nextIndex];
    const updatedStages: DealRoomStage[] = dealRoom.stages.map((stage, idx) => {
      if (idx < nextIndex) {
        return { ...stage, status: 'completed' as const };
      } else if (idx === nextIndex) {
        return { ...stage, status: 'current' as const };
      } else {
        return { ...stage, status: 'locked' as const };
      }
    });

    const updated: DealRoom = {
      ...dealRoom,
      currentStageId: nextStage.id,
      stages: updatedStages,
      status: nextIndex === dealRoom.stages.length - 1 ? 'Offer Stage' : dealRoom.status
    };

    onUpdateDealRoom(updated);
    onSelectStage(nextStage.id);
  };

  // Handler to mark active stage widgets completed
  const handleToggleWidgetCompleted = (widgetId: string) => {
    if (!onUpdateDealRoom) return;
    const updatedStages = dealRoom.stages.map(stage => ({
      ...stage,
      widgets: stage.widgets.map(w => {
        if (w.id === widgetId) {
          return { ...w, isCompleted: !w.isCompleted };
        }
        return w;
      })
    }));

    const updated: DealRoom = {
      ...dealRoom,
      stages: updatedStages
    };
    onUpdateDealRoom(updated);
  };

  const getWidgetIcon = (type: DealRoomWidget['type']) => {
    switch (type) {
      case 'nda_agreement':
        return <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />;
      case 'ceo_welcome_video':
        return <Video className="w-3.5 h-3.5 text-rose-600" />;
      case 'opportunity_strategic':
        return <FileText className="w-3.5 h-3.5 text-purple-600" />;
      case 'equity_calculator':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-600" />;
      case 'deal_team':
        return <Users className="w-3.5 h-3.5 text-amber-600" />;
      case 'document_attachments':
        return <FileText className="w-3.5 h-3.5 text-indigo-600" />;
      case 'executive_qna':
        return <MessageSquare className="w-3.5 h-3.5 text-teal-600" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Top Banner: Where the candidate is in the flow */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Candidate Position Spotlight */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <img 
                src={dealRoom.candidateAvatarUrl} 
                alt={dealRoom.candidateName} 
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-400/40 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse text-purple-400" />
                  Candidate Flow Status
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-[11px] font-bold">
                  Step {currentStageIndex + 1} of {totalStages}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold">
                  {percentComplete}% Journey Completed
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                <span>{dealRoom.candidateName}</span>
                <span className="text-slate-400 font-normal text-sm sm:text-base">is currently in:</span>
                <span className="text-purple-300 bg-purple-900/60 px-2.5 py-0.5 rounded-lg border border-purple-500/40">
                  {currentStage?.name || 'Configured Flow'}
                </span>
              </h2>

              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                <span>Target Mandate: <strong className="text-white">{dealRoom.targetRole}</strong></span>
                <span>•</span>
                <span>Current: {dealRoom.candidateCurrentRole} at {dealRoom.candidateCurrentCompany}</span>
              </p>
            </div>
          </div>

          {/* Real-time Recruiter Engagement Signals */}
          <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-between sm:justify-start bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Last Candidate Activity
              </span>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{dealRoom.lastActive}</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {dealRoom.deliveryConfig.lastAccessedIpLocation || 'Secure Link'}
              </span>
            </div>

            <div className="h-9 w-px bg-white/15" />

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Engagement Volume
              </span>
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                <Eye className="w-3.5 h-3.5" />
                <span>{dealRoom.deliveryConfig.viewsCount} visits</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {dealRoom.deliveryConfig.totalTimeMinutes} mins time in room
              </span>
            </div>
          </div>
        </div>

        {/* Global Journey Progress Bar */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
            <span className="font-semibold text-slate-200">
              Configured Executive Sequence ({completedWidgets} of {totalWidgets} milestones satisfied)
            </span>
            <span className="font-bold text-purple-300">
              {completedStagesCount} of {totalStages} Stages Completed
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Step-by-Step Flow Pipeline (Recruiter can see full sequence) */}
      <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Configured Candidate Flow
            </span>
            <span className="text-xs text-slate-500">
              (Click any step to inspect stage content or advance candidate)
            </span>
          </div>

          {currentStageIndex < totalStages - 1 && onUpdateDealRoom && (
            <button
              type="button"
              onClick={handleAdvanceToNextStage}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <span>Advance Candidate to Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Stepper Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dealRoom.stages.map((stage, idx) => {
            const isCurrent = stage.id === dealRoom.currentStageId;
            const isCompleted = stage.status === 'completed' || idx < currentStageIndex;
            const isSelected = stage.id === activeStageId;
            const stageWidgets = stage.widgets;
            const completedCount = stageWidgets.filter(w => w.isCompleted).length;

            return (
              <div
                key={stage.id}
                onClick={() => onSelectStage(stage.id)}
                className={cn(
                  "p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between",
                  isCurrent 
                    ? "bg-purple-50/90 border-purple-300 ring-2 ring-purple-400/40 shadow-xs" 
                    : isCompleted
                      ? "bg-emerald-50/60 border-emerald-200 hover:bg-emerald-50"
                      : "bg-white border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-300",
                  isSelected && "ring-2 ring-slate-800"
                )}
              >
                {/* Step indicator header */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={cn(
                      "w-6 h-6 rounded-full text-xs font-black flex items-center justify-center",
                      isCompleted 
                        ? "bg-emerald-600 text-white" 
                        : isCurrent 
                          ? "bg-purple-600 text-white animate-pulse" 
                          : "bg-slate-200 text-slate-600"
                    )}>
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </span>

                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                      isCurrent 
                        ? "bg-purple-200 text-purple-900 border border-purple-300"
                        : isCompleted 
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                    )}>
                      {isCurrent ? 'Current Step' : isCompleted ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                    {stage.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                {/* Milestone pills footer */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">
                    {stageWidgets.length} milestones
                  </span>
                  <span className={cn(
                    "font-bold",
                    completedCount === stageWidgets.length && stageWidgets.length > 0 
                      ? "text-emerald-700" 
                      : isCurrent 
                        ? "text-purple-700" 
                        : "text-slate-500"
                  )}>
                    {completedCount}/{stageWidgets.length} done
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recruiter Status Dossier for Active Stage */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Recruiter Inspection: Active Stage
              </span>
              <span className="text-xs font-extrabold text-slate-900">
                — {currentStage?.name}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Review where {dealRoom.candidateName} stands on specific deliverables and milestones configured in this phase.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFullFlowExpanded(!isFullFlowExpanded)}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>{isFullFlowExpanded ? 'Hide Milestone Breakdown' : 'View Full Flow Milestone Audit'}</span>
            {isFullFlowExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Milestone checklist cards for current stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentStage?.widgets.map((widget, idx) => (
            <div 
              key={widget.id}
              className={cn(
                "p-3.5 rounded-xl border transition-all flex flex-col justify-between",
                widget.isCompleted 
                  ? "bg-emerald-50/50 border-emerald-200" 
                  : "bg-white border-slate-200 hover:border-purple-300"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-slate-100">
                      {getWidgetIcon(widget.type)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {widget.type.replace('_', ' ')}
                    </span>
                  </div>

                  {widget.isRequiredMilestone && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                      Required
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {widget.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {widget.description}
                </p>
              </div>

              {/* Status toggle for recruiter */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className={cn(
                  "text-[11px] font-semibold flex items-center gap-1",
                  widget.isCompleted ? "text-emerald-700" : "text-amber-700"
                )}>
                  {widget.isCompleted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Candidate Completed</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Awaiting Candidate Action</span>
                    </>
                  )}
                </span>

                {onUpdateDealRoom && (
                  <button
                    type="button"
                    onClick={() => handleToggleWidgetCompleted(widget.id)}
                    className="text-[10px] font-bold text-slate-500 hover:text-purple-600 hover:underline cursor-pointer"
                  >
                    {widget.isCompleted ? 'Mark Pending' : 'Mark Completed'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Full Flow Milestone Audit Drawer if expanded */}
        {isFullFlowExpanded && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                End-to-End Configured Flow Audit (All {totalStages} Stages)
              </h4>
              <span className="text-xs text-slate-500">
                {totalWidgets} total configured milestones
              </span>
            </div>

            <div className="space-y-3">
              {dealRoom.stages.map((stage, sIdx) => (
                <div key={stage.id} className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        Stage {sIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {stage.name}
                      </span>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                      stage.id === dealRoom.currentStageId ? "bg-purple-100 text-purple-800" :
                      stage.status === 'completed' ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                    )}>
                      {stage.id === dealRoom.currentStageId ? 'Current Candidate Stage' : stage.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {stage.widgets.map((w) => (
                      <div key={w.id} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2 truncate">
                          {getWidgetIcon(w.type)}
                          <span className="truncate font-medium text-slate-700">{w.title}</span>
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold shrink-0 ml-2",
                          w.isCompleted ? "text-emerald-600" : "text-amber-600"
                        )}>
                          {w.isCompleted ? '✓ Completed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recruiter Strategy Advisory Callout */}
        <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-600 text-white shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-purple-900">
              Recruiter Next Action Strategy for {dealRoom.candidateName}
            </h4>
            <p className="text-purple-800/90 mt-0.5 leading-relaxed">
              {currentStageIndex === 0 
                ? `${dealRoom.candidateName} has executed the Confidential Mutual NDA. Next step: confirm candidate reviewed CEO Welcome Video and advance to Stage 2.`
                : currentStageIndex === 1
                  ? `${dealRoom.candidateName} has logged ${dealRoom.deliveryConfig.viewsCount} visits exploring the 3-Year Strategic Mandate and Deal Team. Recommended: trigger private conversation or unlock Stage 3 Executive Interviews.`
                  : currentStageIndex === 2
                    ? `Interview panel is configured. After debrief, advance candidate to Stage 4 to deliver the Executive Financial Equity & Offer Package.`
                    : `Elena is currently in Stage 4: Formal Offer. Awaiting digital review of the 4-year cumulative compensation model and formal signing.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
