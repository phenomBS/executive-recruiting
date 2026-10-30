import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Star, 
  Check, 
  X, 
  ChevronRight, 
  Send, 
  UserCheck, 
  AlertCircle,
  Sparkles,
  ExternalLink,
  Tag
} from 'lucide-react';
import { PendingFeedbackItem, FeedbackSummaryItem } from '../../data/landingData';
import { cn } from '../../lib/utils';

interface HiringManagerFeedbackWidgetProps {
  pendingList: PendingFeedbackItem[];
  receivedList: FeedbackSummaryItem[];
  onOpenReminderModal: () => void;
  onSendSingleReminder: (id: string) => void;
  onViewCandidate?: (candidateId: string) => void;
}

export function HiringManagerFeedbackWidget({
  pendingList,
  receivedList,
  onOpenReminderModal,
  onSendSingleReminder,
  onViewCandidate
}: HiringManagerFeedbackWidgetProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'received'>('pending');
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(receivedList[0]?.id || null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-(--color-secondary-200)/10 text-(--color-secondary-200) flex items-center justify-center font-bold">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Hiring Manager Feedback
            </h3>
            <p className="text-[11px] text-slate-500">
              Calibrated review cycles and pending decision status
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={cn(
              "px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5",
              activeTab === 'pending'
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <span>Waiting On</span>
            <span className={cn(
              "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
              pendingList.length > 0 ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"
            )}>
              {pendingList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('received')}
            className={cn(
              "px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5",
              activeTab === 'received'
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <span>Feedback Received</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark)">
              {receivedList.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3.5 min-h-[340px]">
        {activeTab === 'pending' ? (
          /* TAB 1: WAITING ON FEEDBACK */
          pendingList.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">All reviews caught up</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">No pending hiring manager evaluations.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                <span>{pendingList.length} reviews overdue or awaiting decision</span>
                <button
                  type="button"
                  onClick={onOpenReminderModal}
                  className="text-xs font-bold text-(--color-secondary-200) hover:underline flex items-center gap-1"
                >
                  Manage Reminders <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingList.map(item => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-amber-300 bg-white hover:shadow-2xs transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.hiringManagerAvatar} 
                          alt={item.hiringManagerName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" 
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {item.hiringManagerName}
                            </h4>
                            <span className="text-[11px] text-slate-500 font-normal">
                              · {item.hiringManagerTitle}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Waiting on feedback for <strong className="text-slate-800">{item.candidateName}</strong> ({item.candidateRole})
                          </div>
                        </div>
                      </div>

                      <span className={cn(
                        "px-2.5 py-1 rounded-md text-[10px] font-bold shrink-0",
                        item.daysPending >= 3 
                          ? "bg-amber-50 text-amber-800 border border-amber-200" 
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      )}>
                        {item.daysPending}d Overdue
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Search: <strong className="text-slate-700">{item.projectName}</strong>
                      </span>

                      <button
                        type="button"
                        onClick={() => onSendSingleReminder(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-(--color-secondary-200)/10 hover:bg-(--color-secondary-200) hover:text-white text-(--color-secondary-200) text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send Reminder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )
        ) : (
          /* TAB 2: FEEDBACK RECEIVED (Matching Screenshot 2 & 3 Feedback Model) */
          receivedList.map(item => {
            const isExpanded = expandedFeedbackId === item.id;
            const fullStars = Math.floor(item.score);
            const totalStars = 10;

            return (
              <div 
                key={item.id}
                className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs transition-all"
              >
                {/* Header Callout */}
                <div 
                  onClick={() => setExpandedFeedbackId(isExpanded ? null : item.id)}
                  className="px-4 py-3 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={item.hiringManagerAvatar} 
                      alt={item.hiringManagerName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200" 
                    />
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>Feedback received for</span>
                        <span className="text-(--color-secondary-200)">{item.projectName}</span>
                        <span>and</span>
                        <span className="underline decoration-slate-300">{item.candidateName}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.2">
                        By {item.hiringManagerName} ({item.hiringManagerTitle}) · {item.receivedDate}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-400">
                    {isExpanded ? 'Collapse' : 'Details'}
                  </span>
                </div>

                {/* Feedback Model Container (Matches Screenshot 2 & Screenshot 3) */}
                <div className="p-4 space-y-3.5">
                  
                  {/* Rating Bar Model (Screenshot 2: Red X, 10-Star Rating Bar with score, Comment Icon, Green Check) */}
                  <div className="flex items-center justify-center p-3 rounded-2xl bg-(--color-neutrals-500) text-white shadow-sm gap-3">
                    {/* Pass / Reject Button */}
                    <div 
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center transition-all",
                        item.decision === 'rejected'
                          ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                          : "bg-rose-950/60 text-rose-400 border border-rose-900/40"
                      )}
                      title="Pass / Reject"
                    >
                      <X className="w-4 h-4 stroke-[3]" />
                    </div>

                    {/* Star Rating Bar with Numeric Score */}
                    <div className="flex flex-col items-center justify-center px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 shadow-inner">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalStars }).map((_, i) => (
                          <Star 
                            key={i}
                            className={cn(
                              "w-3.5 h-3.5",
                              i < fullStars 
                                ? "fill-amber-400 text-amber-400" 
                                : "fill-slate-700 text-slate-700"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-extrabold text-amber-400 mt-0.5 tracking-wider">
                        {item.score.toFixed(1)} / 10
                      </span>
                    </div>

                    {/* Comment Icon Button */}
                    <div className="w-9 h-9 rounded-full bg-slate-800/70 border border-slate-700 flex items-center justify-center text-slate-300">
                      <MessageSquare className="w-4 h-4" />
                    </div>

                    {/* Accept / Advance Button */}
                    <div 
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center transition-all",
                        item.decision === 'accepted'
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : "bg-emerald-950/60 text-emerald-400 border border-emerald-900/40"
                      )}
                      title="Advance to Slate"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  </div>

                  {/* Notes Card Model (Screenshot 3: "NOTES ON [CANDIDATE]", Tags, Additional Context, Save/Share) */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5">
                    <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Notes on {item.candidateName}
                    </div>

                    {/* Quick Tags from Screenshot 3 */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.notesTags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3 text-(--color-secondary-200)" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Additional Context Note */}
                    {item.additionalNotes && (
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                        <span className="font-bold text-slate-900">Hiring Manager Context: </span>
                        {item.additionalNotes}
                      </div>
                    )}

                    {/* Share note & candidate action */}
                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                        <span>Shared with search committee & reviewers</span>
                      </div>

                      {onViewCandidate && (
                        <button
                          type="button"
                          onClick={() => onViewCandidate(item.candidateId)}
                          className="font-bold text-(--color-secondary-200) hover:underline flex items-center gap-1"
                        >
                          Review Profile <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
