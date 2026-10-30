import React, { useState } from 'react';
import { 
  Handshake, 
  ArrowRight, 
  Check, 
  Clock, 
  Lock, 
  Eye, 
  ExternalLink, 
  Flame, 
  Sparkles, 
  Users, 
  Copy, 
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { DealRoom, initialDealRooms } from '../../data/dealRoomsData';
import { View } from '../Sidebar';
import { cn } from '../../lib/utils';

interface OpportunityRoomsWorkflowWidgetProps {
  onNavigateView: (view: View, params?: { dealRoomId?: string }) => void;
  onShowToast: (msg: string) => void;
}

export function OpportunityRoomsWorkflowWidget({
  onNavigateView,
  onShowToast
}: OpportunityRoomsWorkflowWidgetProps) {
  const [dealRooms, setDealRooms] = useState<DealRoom[]>(initialDealRooms);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (e: React.MouseEvent, room: DealRoom) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(`https://exec.phenom.example.com/rooms/${room.id}?auth=secure`);
    setCopiedId(room.id);
    onShowToast(`Copied secure executive link for ${room.candidateName}!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAdvanceStage = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    setDealRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const currentIdx = room.stages.findIndex(s => s.id === room.currentStageId);
      if (currentIdx >= room.stages.length - 1) {
        onShowToast(`${room.candidateName} is already in final stage (${room.stages[currentIdx].name})`);
        return room;
      }
      const nextIdx = currentIdx + 1;
      const nextStage = room.stages[nextIdx];
      const updatedStages = room.stages.map((stg, i) => {
        if (i < nextIdx) return { ...stg, status: 'completed' as const };
        if (i === nextIdx) return { ...stg, status: 'current' as const };
        return { ...stg, status: 'locked' as const };
      });
      onShowToast(`Advanced ${room.candidateName} to ${nextStage.name}!`);
      return {
        ...room,
        currentStageId: nextStage.id,
        stages: updatedStages
      };
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Widget Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900">
                Opportunity Rooms Workflow
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
                {dealRooms.length} Open Rooms
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live executive candidate deal rooms and real-time stage progression across configured flows
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onNavigateView('dealrooms')}
            className="px-3 py-1.5 rounded-xl border border-slate-300 hover:border-purple-500 hover:bg-purple-50/60 text-slate-700 hover:text-purple-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All Opportunity Rooms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Rooms Workflow Cards */}
      <div className="p-5 sm:p-6 space-y-4">
        {dealRooms.map((room) => {
          const currentStageIndex = room.stages.findIndex(s => s.id === room.currentStageId);
          const currentStage = currentStageIndex >= 0 ? room.stages[currentStageIndex] : room.stages[0];
          const totalStages = room.stages.length;
          const completedCount = room.stages.filter(s => s.status === 'completed').length;
          const isCopied = copiedId === room.id;

          return (
            <div
              key={room.id}
              onClick={() => onNavigateView('dealrooms', { dealRoomId: room.id })}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-purple-400 bg-white hover:bg-slate-50/50 shadow-2xs hover:shadow-xs transition-all cursor-pointer group space-y-4"
            >
              {/* Top Row: Candidate details & current status */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img 
                      src={room.candidateAvatarUrl} 
                      alt={room.candidateName}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500/20 shadow-xs" 
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px] font-bold">
                      ✓
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                        {room.candidateName}
                      </h3>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                        room.status === 'Draft' ? "bg-amber-100 text-amber-800 border border-amber-200" :
                        room.status === 'Live / Sent' ? "bg-blue-100 text-blue-800 border border-blue-200" :
                        room.status === 'NDA Signed' ? "bg-purple-100 text-purple-800 border border-purple-200" :
                        "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      )}>
                        {room.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-purple-700">
                        Target: {room.targetRole}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">
                        Current: {room.candidateCurrentRole} at {room.candidateCurrentCompany}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Candidate activity & stats */}
                <div className="flex items-center gap-3 shrink-0 self-start md:self-auto bg-slate-50 p-2 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Active {room.lastActive}</span>
                  </div>
                  <div className="h-4 w-px bg-slate-200" />
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{room.deliveryConfig.viewsCount} visits</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: WHAT STAGE THE EXECUTIVE IS CURRENTLY IN */}
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-xs shrink-0 animate-pulse">
                    {currentStageIndex + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                        Current Candidate Stage:
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">
                        {currentStage?.name || 'Configured Stage'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-200/80 text-purple-800 font-bold">
                        Step {currentStageIndex + 1} of {totalStages}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-900/80 mt-0.5 line-clamp-1">
                      {currentStage?.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  {currentStageIndex < totalStages - 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleAdvanceStage(e, room.id)}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                      title="Advance candidate to next stage"
                    >
                      <span>Advance Stage</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(e, room)}
                    className="p-1.5 rounded-lg border border-purple-300 hover:bg-purple-100 text-purple-700 text-xs transition-colors cursor-pointer"
                    title="Copy candidate direct link"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Bottom Row: Visual Stepper showing all configured stages in the flow */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {room.stages.map((stage, idx) => {
                  const isCurrent = stage.id === room.currentStageId;
                  const isCompleted = stage.status === 'completed' || idx < currentStageIndex;

                  return (
                    <div
                      key={stage.id}
                      className={cn(
                        "p-2 rounded-lg border text-left transition-all",
                        isCurrent 
                          ? "bg-purple-100/70 border-purple-400 ring-1 ring-purple-400/50" 
                          : isCompleted 
                            ? "bg-emerald-50/70 border-emerald-200" 
                            : "bg-slate-50 border-slate-200 opacity-60"
                      )}
                    >
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={cn(
                          "w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center",
                          isCompleted ? "bg-emerald-600 text-white" : isCurrent ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-600"
                        )}>
                          {isCompleted ? '✓' : idx + 1}
                        </span>
                        <span className={cn(
                          "text-[9px] font-bold uppercase",
                          isCurrent ? "text-purple-700" : isCompleted ? "text-emerald-700" : "text-slate-500"
                        )}>
                          {isCurrent ? 'Current' : isCompleted ? 'Completed' : 'Locked'}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 truncate" title={stage.name}>
                        {stage.name.replace(/^Stage \d+:\s*/, '')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
