import React, { useState } from 'react';
import { 
  TrendingUp, 
  Mail, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles, 
  Send, 
  Users, 
  Building2, 
  ChevronRight,
  Bot,
  Filter,
  Check
} from 'lucide-react';
import { 
  MarketInsightItem, 
  AgentNurtureActivity, 
  RecruiterFollowupItem 
} from '../../data/landingData';
import { cn } from '../../lib/utils';

interface ActivityTrackersHubProps {
  marketInsights: MarketInsightItem[];
  agentActivities: AgentNurtureActivity[];
  recruiterFollowups: RecruiterFollowupItem[];
  onOpenNurtureModal: (insight: MarketInsightItem) => void;
  onFollowupAction: (item: RecruiterFollowupItem) => void;
}

export function ActivityTrackersHub({
  marketInsights,
  agentActivities,
  recruiterFollowups,
  onOpenNurtureModal,
  onFollowupAction
}: ActivityTrackersHubProps) {
  const [activeTracker, setActiveTracker] = useState<'market_insights' | 'agent_nurture' | 'recruiter_followups'>('market_insights');
  const [marketFilter, setMarketFilter] = useState<'all' | 'realtime_slack' | 'weekly_digest'>('all');

  const filteredMarketInsights = marketInsights.filter(item => {
    if (marketFilter === 'all') return true;
    return item.category === marketFilter;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
      {/* Header with 3 Activity Tracker Modes */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/40">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-(--color-secondary-200)" />
            Executive Intelligence & Activity Stream
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Real-time market milestones, agent sequences, and priority recruiter follow-ups
          </p>
        </div>

        {/* 3 Stream Switchers */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTracker('market_insights')}
            className={cn(
              "px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5",
              activeTracker === 'market_insights'
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Market Insights & Triggers</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              {marketInsights.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTracker('agent_nurture')}
            className={cn(
              "px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5",
              activeTracker === 'agent_nurture'
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Bot className="w-3.5 h-3.5 text-purple-600" />
            <span>Phenom Aura Agent Nurturing</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark)">
              {agentActivities.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTracker('recruiter_followups')}
            className={cn(
              "px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5",
              activeTracker === 'recruiter_followups'
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Recruiter Follow-ups</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
              {recruiterFollowups.length}
            </span>
          </button>
        </div>
      </div>

      {/* TRACKER 1: MARKET INSIGHTS THAT AFFECTED EXECUTIVES */}
      {activeTracker === 'market_insights' && (
        <div className="p-6 space-y-6">
          {/* In-House Executive Recruiting Talent Tracking Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Track talent movement & leadership milestones across target companies
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Monitor organizational shifts, executive departures, and growth milestones across industry talent sources.
                Proactively nurture high-caliber passive executives when market events create prime transition opportunities for your in-house leadership searches.
              </p>
            </div>

            {/* Sub-filters for Real-time Slack vs Weekly Digest */}
            <div className="flex items-center gap-1.5 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setMarketFilter('all')}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-semibold transition-colors",
                  marketFilter === 'all' ? "bg-(--color-secondary-200) text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                All Milestones
              </button>
              <button
                type="button"
                onClick={() => setMarketFilter('realtime_slack')}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1",
                  marketFilter === 'realtime_slack' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <MessageSquare className="w-3 h-3 text-emerald-500" />
                Real-time Slack Updates
              </button>
              <button
                type="button"
                onClick={() => setMarketFilter('weekly_digest')}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1",
                  marketFilter === 'weekly_digest' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <Mail className="w-3 h-3 text-blue-500" />
                Weekly Digest
              </button>
            </div>
          </div>

          {/* Cards Grid Matching Screenshot 1 Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMarketInsights.map(item => {
              const isSlack = item.category === 'realtime_slack';

              return (
                <div 
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-white p-4.5 hover:shadow-xs hover:border-(--color-secondary-200)/30 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header line with badge and time */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {isSlack ? (
                          <div className="w-6 h-6 rounded-lg bg-[#4A154B]/10 flex items-center justify-center text-[#4A154B]">
                            <MessageSquare className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                            <Mail className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className="font-extrabold text-slate-800 text-[11px]">
                          {item.sourceTag}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.timeAgo}
                      </span>
                    </div>

                    {/* Milestone Item Card */}
                    <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          {item.companyName}
                        </span>
                        <span className="text-[10px] font-bold text-(--color-secondary-200) bg-(--color-secondary-200)/5 px-2 py-0.5 rounded-full border border-(--color-secondary-200)/10">
                          {item.headline}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {item.triggerEvent}
                      </p>
                    </div>

                    {/* Affected Executives Intelligence Preview */}
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Affected Talent Impact:</span>
                        <strong className="text-(--color-secondary-200)">
                          {item.affectedExecutivesCount} Tracked Executives
                        </strong>
                      </div>
                      <div className="flex items-center gap-1 overflow-hidden">
                        {item.affectedExecutives.map((exec, idx) => (
                          <span key={exec.id} className="text-[10px] text-slate-600 truncate max-w-[120px]">
                            {exec.name} ({exec.role}){idx < item.affectedExecutives.length - 1 ? ' · ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Nurture Trigger Button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Mobility Score: 90%+
                    </span>

                    <button
                      type="button"
                      onClick={() => onOpenNurtureModal(item)}
                      className="px-3 py-1.5 rounded-lg bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      Nurture Affected Executives
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TRACKER 2: AGENT NURTURING EMAILS AND RESPONSES */}
      {activeTracker === 'agent_nurture' && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500">
            <span>Automated executive touchpoints and candidate responses managed by Phenom Aura Agent for in-house leadership mandates</span>
            <span className="font-bold text-(--color-secondary-200) bg-(--color-secondary-200)/5 px-2.5 py-1 rounded-lg border border-(--color-secondary-200)/10">4 Active Sequences Running</span>
          </div>

          <div className="space-y-3">
            {agentActivities.map(activity => {
              const isReply = activity.actionType === 'replied' || activity.actionType === 'meeting_booked';

              return (
                <div 
                  key={activity.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                    isReply ? "bg-purple-50/30 border-purple-200" : "bg-white border-slate-200"
                  )}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                      isReply ? "bg-(--color-secondary-200) text-white" : "bg-slate-100 text-slate-700"
                    )}>
                      {isReply ? <MessageSquare className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">
                          {activity.agentName}
                        </span>
                        <span className="text-slate-400 text-xs">→</span>
                        <span className="text-xs font-bold text-(--color-secondary-200)">
                          {activity.candidateName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ({activity.candidateRole} at {activity.candidateCompany})
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-800">
                        {activity.subject}
                      </div>

                      {activity.replySnippet ? (
                        <div className="p-2.5 rounded-lg bg-white border border-purple-200 text-xs text-purple-900 font-medium italic">
                          {activity.replySnippet}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">
                          {activity.preview}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3 self-end sm:self-center">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {activity.timestamp}
                    </span>

                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider",
                      activity.actionType === 'replied' ? "bg-emerald-100 text-emerald-800" :
                      activity.actionType === 'meeting_booked' ? "bg-blue-100 text-blue-800" :
                      activity.actionType === 'opened' ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                    )}>
                      {activity.actionType.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TRACKER 3: RECRUITER FOLLOW-UP REQUIRED */}
      {activeTracker === 'recruiter_followups' && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500">
            <span>High-priority communications and calibrations requiring immediate human recruiter action</span>
            <span className="font-bold text-rose-700">{recruiterFollowups.length} Action Items</span>
          </div>

          <div className="space-y-3">
            {recruiterFollowups.map(item => (
              <div 
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider",
                      item.priority === 'urgent' ? "bg-rose-100 text-rose-800" :
                      item.priority === 'high' ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                    )}>
                      {item.priority}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      {item.title}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-600">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>Target: <strong className="text-slate-800">{item.candidateOrContact}</strong></span>
                    <span>·</span>
                    <span>Project: <strong className="text-slate-700">{item.associatedProject}</strong></span>
                    <span>·</span>
                    <span className="text-rose-600 font-semibold">{item.dueDate}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => onFollowupAction(item)}
                    className="px-3.5 py-1.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
