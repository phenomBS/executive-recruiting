import React from 'react';
import { 
  X, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  ExternalLink, 
  Mail, 
  Share2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Flame, 
  ShieldCheck, 
  Bot,
  Activity,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { ShadowBenchCandidate } from '../../data/rolesSuccessionData';
import { cn } from '../../lib/utils';

interface CandidateDetailDrawerProps {
  candidate: ShadowBenchCandidate | null;
  roleTitle: string;
  onClose: () => void;
  onTriggerOutreach?: (candidate: ShadowBenchCandidate) => void;
}

export function CandidateDetailDrawer({
  candidate,
  roleTitle,
  onClose,
  onTriggerOutreach
}: CandidateDetailDrawerProps) {
  if (!candidate) return null;

  const isHighPtm = candidate.ptmLevel === 'High';
  const isMedPtm = candidate.ptmLevel === 'Medium';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <img 
                src={candidate.avatarUrl} 
                alt={candidate.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0" 
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-900">{candidate.name}</h2>
                  {candidate.ptmLevel === 'High' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                      High Flight Risk ({candidate.ptmScore}% PTM)
                    </span>
                  )}
                  {candidate.ptmLevel === 'Medium' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Medium PTM ({candidate.ptmScore}%)
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                  {candidate.currentTitle}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {candidate.company}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {candidate.location}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Tenure: {candidate.tenureInRole}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Live Signal Alert Banner (Phase 3 Market Intelligence) */}
            <div className={cn(
              "p-4 rounded-xl border flex items-start gap-3.5",
              candidate.liveSignalAlert.severity === 'urgent' 
                ? "bg-rose-50/70 border-rose-200 text-rose-900" 
                : "bg-amber-50/70 border-amber-200 text-amber-900"
            )}>
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                candidate.liveSignalAlert.severity === 'urgent' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
              )}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Live Signal Event · {candidate.liveSignalAlert.source}
                  </span>
                  <span className="text-[11px] opacity-80">{candidate.liveSignalAlert.date}</span>
                </div>
                <p className="text-sm font-bold mt-1">
                  {candidate.liveSignalAlert.text}
                </p>
                {candidate.liveSignalAlert.details && (
                  <p className="text-xs mt-1.5 opacity-90 leading-relaxed">
                    {candidate.liveSignalAlert.details}
                  </p>
                )}
              </div>
            </div>

            {/* AI Fit Calibration & Match Scores */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-(--color-secondary-200)" />
                  <h3 className="text-sm font-bold text-slate-900">
                    AI Match Index for {roleTitle}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Target Anchors Calibrated
                </span>
              </div>

              {/* Three AI Pillar Scores */}
              <div className="grid grid-cols-3 gap-3">
                {/* Composite EMI Score */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Composite EMI
                  </span>
                  <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="text-2xl font-black text-(--color-secondary-200)">
                      {candidate.emiScore}
                    </span>
                    <span className="text-xs font-bold text-slate-400">/100</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">
                    Tier-1 Strong Fit
                  </span>
                </div>

                {/* SFA Score */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    SFA (Structural)
                  </span>
                  <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="text-2xl font-black text-indigo-600">
                      {candidate.sfaScore}%
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">
                    Org Scale & Scope
                  </span>
                </div>

                {/* CMA Score */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    CMA (Motivation)
                  </span>
                  <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="text-2xl font-black text-purple-600">
                      {candidate.cmaScore}%
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">
                    Career Inflection
                  </span>
                </div>
              </div>

              {/* PTM Meter Detail */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-rose-500" />
                    Propensity to Move (PTM) Predictive Gauge
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[11px]",
                    isHighPtm ? "bg-rose-100 text-rose-700 font-extrabold" : "bg-amber-100 text-amber-700"
                  )}>
                    {candidate.ptmScore}% Flight Probability
                  </span>
                </div>
                
                {/* Visual Bar */}
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isHighPtm ? "bg-gradient-to-r from-amber-500 to-rose-600" : "bg-amber-500"
                    )}
                    style={{ width: `${candidate.ptmScore}%` }}
                  />
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  <strong>AI Mobility Model Reason:</strong> {candidate.ptmReason}
                </p>
              </div>

            </div>

            {/* In-Depth AI Analysis Breakdown */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Structural & Motivation Deep-Dive
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {/* SFA Reasoning */}
                <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-indigo-800">
                      SFA ({candidate.sfaScore}%)
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Structural Scope & Execution Parity
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {candidate.sfaReason}
                  </p>
                </div>

                {/* CMA Reasoning */}
                <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/40 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-purple-800">
                      CMA ({candidate.cmaScore}%)
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Candidate Motivation Alignment
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {candidate.cmaReason}
                  </p>
                </div>
              </div>
            </div>

            {/* Compensation & Stage Meta */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-slate-400 block font-medium">Estimated Current Comp</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {candidate.currentCompEst}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-slate-400 block font-medium">Bench Readiness Stage</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {candidate.benchReadiness}
                </span>
              </div>
            </div>

          </div>

          {/* Drawer Actions */}
          <div className="p-5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onTriggerOutreach) onTriggerOutreach(candidate);
                }}
                className="px-5 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                Dispatch Phenom Aura Nurture
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
