import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  X, 
  Send, 
  Clock, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  User, 
  Briefcase, 
  Search, 
  Mail, 
  MessageSquare, 
  Sparkles, 
  FileText, 
  DollarSign, 
  Check, 
  ChevronRight,
  TrendingUp,
  Share2
} from 'lucide-react';
import { PendingFeedbackItem, MarketInsightItem } from '../../data/landingData';
import { mockProjects, mockCandidates } from '../../data/mockData';
import { Project, Candidate } from '../../types';
import { cn } from '../../lib/utils';

// ----------------------------------------------------
// 1. Send Feedback Reminder Modal
// ----------------------------------------------------
interface FeedbackReminderModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pendingItems: PendingFeedbackItem[];
  onSendReminder: (itemId: string, channel: 'email' | 'slack') => void;
  onSendAllReminders: () => void;
}

export function FeedbackReminderModal({
  isOpen,
  onOpenChange,
  pendingItems,
  onSendReminder,
  onSendAllReminders
}: FeedbackReminderModalProps) {
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'slack'>('email');

  const handleSingleSend = (id: string) => {
    onSendReminder(id, selectedChannel);
    setSentMap(prev => ({ ...prev, [id]: true }));
  };

  const handleBatchSend = () => {
    onSendAllReminders();
    const updated: Record<string, boolean> = {};
    pendingItems.forEach(item => {
      updated[item.id] = true;
    });
    setSentMap(updated);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/50 via-white to-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900">
                  Pending Hiring Manager Feedback
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500 mt-0.5">
                  Currently requested evaluation feedback that has not yet been received
                </Dialog.Description>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedChannel('email')}
                  className={cn(
                    "px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors",
                    selectedChannel === 'email' ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedChannel('slack')}
                  className={cn(
                    "px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors",
                    selectedChannel === 'slack' ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  Slack
                </button>
              </div>

              <Dialog.Close asChild>
                <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors ml-1">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Pending Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3.5 min-h-[300px]">
            {pendingItems.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">All feedback is up to date!</h4>
                <p className="text-xs text-slate-500 mt-1">There are no outstanding hiring manager evaluations at this moment.</p>
              </div>
            ) : (
              pendingItems.map(item => {
                const isSent = sentMap[item.id];

                return (
                  <div 
                    key={item.id}
                    className={cn(
                      "p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                      isSent 
                        ? "bg-slate-50/70 border-slate-200 opacity-80" 
                        : "bg-white border-slate-200 hover:border-amber-300 hover:shadow-xs"
                    )}
                  >
                    <div className="flex items-start gap-3.5">
                      <img 
                        src={item.hiringManagerAvatar} 
                        alt={item.hiringManagerName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {item.hiringManagerName}
                          </h4>
                          <span className="text-xs text-slate-500">
                            ({item.hiringManagerTitle})
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-slate-800">Candidate:</span>
                          <span className="text-(--color-secondary-200) font-medium">{item.candidateName}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">{item.projectName}</span>
                        </div>

                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                          <span className={cn(
                            "px-2 py-0.5 rounded-md font-semibold",
                            item.daysPending >= 3 ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-slate-100 text-slate-600"
                          )}>
                            Requested {item.daysPending} days ago
                          </span>
                          {item.remindersSent > 0 && (
                            <span className="text-slate-500">
                              {item.remindersSent} reminder{item.remindersSent > 1 ? 's' : ''} previously sent
                              {item.lastReminderDate && ` (${item.lastReminderDate})`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        disabled={isSent}
                        onClick={() => handleSingleSend(item.id)}
                        className={cn(
                          "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs",
                          isSent 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                            : "bg-(--color-secondary-200) text-white hover:bg-(--bg-brand-secondary-hover) cursor-pointer"
                        )}
                      >
                        {isSent ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            Reminder Sent
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Send Reminder
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500">
              {pendingItems.length} hiring managers awaiting feedback
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleBatchSend}
                disabled={pendingItems.length === 0}
                className="px-4 py-2 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                Remind All ({pendingItems.length})
              </button>
            </div>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ----------------------------------------------------
// 2. Start A New Search Modal
// ----------------------------------------------------
interface StartSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (project: Partial<Project>) => void;
}

export function StartSearchModal({
  isOpen,
  onOpenChange,
  onCreateProject
}: StartSearchModalProps) {
  const [roleTitle, setRoleTitle] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [functionDomain, setFunctionDomain] = useState('Engineering & Technology');
  const [roleLevel, setRoleLevel] = useState('C-Suite');
  const [targetCompCeiling, setTargetCompCeiling] = useState('$650,000');
  const [workModel, setWorkModel] = useState('Hybrid');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim() || !clientCompany.trim()) return;

    onCreateProject({
      title: roleTitle,
      company: clientCompany,
      type: 'Executive Search',
      status: 'Active',
      createdAt: 'Just now',
      leadRecruiter: 'You (Lead Partner)'
    });

    onOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-(--color-secondary-200)/10 border border-(--color-secondary-200)/20 text-(--color-secondary-200) flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900">
                  Start New Executive Search
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500 mt-0.5">
                  Initialize a retained mandate with tailored calibration parameters
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Target Role Title <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Chief Information Security Officer (CISO)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Client / Target Company <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  placeholder="e.g. Horizon Cloud Infrastructure"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Functional Domain
                </label>
                <select 
                  value={functionDomain}
                  onChange={(e) => setFunctionDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) bg-white"
                >
                  <option value="Engineering & Technology">Engineering & Technology</option>
                  <option value="Product Leadership">Product Leadership</option>
                  <option value="Information Security">Information Security</option>
                  <option value="Finance & Administration">Finance & Administration</option>
                  <option value="Go-to-Market & Commercial">Go-to-Market & Commercial</option>
                  <option value="People & Human Resources">People & Human Resources</option>
                  <option value="General Management & Board">General Management & Board</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Role Level</label>
                <select 
                  value={roleLevel}
                  onChange={(e) => setRoleLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) bg-white"
                >
                  <option value="C-Suite">C-Suite</option>
                  <option value="SVP">SVP</option>
                  <option value="VP">VP</option>
                  <option value="Managing Director">Managing Director</option>
                  <option value="Board Director">Board Director</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Comp Target</label>
                <input 
                  type="text"
                  value={targetCompCeiling}
                  onChange={(e) => setTargetCompCeiling(e.target.value)}
                  placeholder="$500,000+"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Work Model</label>
                <select 
                  value={workModel}
                  onChange={(e) => setWorkModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) bg-white"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-Site">On-Site</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Initialize Search Project
              </button>
            </div>
          </form>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ----------------------------------------------------
// 3. Send Slate Review Modal
// ----------------------------------------------------
interface SendSlateReviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSlateSent: (projectName: string, hiringManager: string, count: number) => void;
}

export function SendSlateReviewModal({
  isOpen,
  onOpenChange,
  onSlateSent
}: SendSlateReviewModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0]?.id || 'p-1');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>(['c-1', 'c-2']);
  const [hiringManagerName, setHiringManagerName] = useState('Satya Nadella');
  const [hiringManagerEmail, setHiringManagerEmail] = useState('snadella@client.example.com');
  const [reviewNote, setReviewNote] = useState('Here is our calibrated initial executive slate for your review. Please review the attached leadership metrics and leave initial scoring.');

  const handleToggleCandidate = (id: string) => {
    if (selectedCandidates.includes(id)) {
      setSelectedCandidates(selectedCandidates.filter(c => c !== id));
    } else {
      setSelectedCandidates([...selectedCandidates, id]);
    }
  };

  const handleSend = () => {
    const proj = mockProjects.find(p => p.id === selectedProjectId);
    onSlateSent(proj?.title || 'Executive Search', hiringManagerName, selectedCandidates.length);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 via-white to-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-600/20 text-purple-700 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900">
                  Send Candidate Slate Review
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500 mt-0.5">
                  Share an interactive evaluation link with the hiring manager
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Select Search Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) bg-white"
              >
                {mockProjects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} · {p.company} ({p.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Candidates to Include on Slate ({selectedCandidates.length})
                </label>
                <span className="text-[11px] text-slate-500">Click to select/deselect</span>
              </div>

              <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50 max-h-44 overflow-y-auto">
                {mockCandidates.slice(0, 6).map(cand => {
                  const isSelected = selectedCandidates.includes(cand.id);

                  return (
                    <div 
                      key={cand.id}
                      onClick={() => handleToggleCandidate(cand.id)}
                      className={cn(
                        "p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer",
                        isSelected 
                          ? "bg-white border-(--color-secondary-200) shadow-2xs" 
                          : "bg-white/80 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {cand.firstName} {cand.lastName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {cand.role} at {cand.company}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded-full font-bold bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark)">
                          EMI {cand.emiScore}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Hiring Manager Recipient
                </label>
                <input 
                  type="text"
                  value={hiringManagerName}
                  onChange={(e) => setHiringManagerName(e.target.value)}
                  placeholder="e.g. Satya Nadella"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Recipient Email
                </label>
                <input 
                  type="email"
                  value={hiringManagerEmail}
                  onChange={(e) => setHiringManagerEmail(e.target.value)}
                  placeholder="name@client.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200)"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Evaluation Context Note
              </label>
              <textarea 
                rows={2}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200)"
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={selectedCandidates.length === 0}
              className="px-5 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Slate Review Link ({selectedCandidates.length})
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ----------------------------------------------------
// 4. Nurture Affected Executives Modal
// ----------------------------------------------------
interface NurtureAffectedModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  insight: MarketInsightItem | null;
  onNurtureDispatched: (insightId: string) => void;
}

export function NurtureAffectedModal({
  isOpen,
  onOpenChange,
  insight,
  onNurtureDispatched
}: NurtureAffectedModalProps) {
  const [sequenceTemplate, setSequenceTemplate] = useState('congratulatory');
  const [isSent, setIsSent] = useState(false);

  if (!insight) return null;

  const handleDispatch = () => {
    setIsSent(true);
    setTimeout(() => {
      onNurtureDispatched(insight.id);
      setIsSent(false);
      onOpenChange(false);
    }, 1200);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-white to-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-600/20 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900">
                  Nurture Executives at {insight.companyName}
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500 mt-0.5">
                  Market Trigger: {insight.triggerEvent}
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">
                Affected Executives Tracked in CRM ({insight.affectedExecutives.length})
              </h4>
              <div className="space-y-2">
                {insight.affectedExecutives.map(exec => (
                  <div key={exec.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{exec.name}</div>
                      <div className="text-[11px] text-slate-500">{exec.role}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark)">
                      {exec.mobilityScore}% Mobility Signal
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Outbound Nurture Sequence Template
              </label>
              <select
                value={sequenceTemplate}
                onChange={(e) => setSequenceTemplate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) bg-white"
              >
                <option value="congratulatory">Leadership Congratulatory Note & Discreet Calibration</option>
                <option value="advisory">Confidential Advisory Council Invitation</option>
                <option value="market_briefing">Executive Market Intel & Comp Benchmarking Brief</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-(--color-secondary-200)/[0.03] border border-(--color-secondary-200)/15 text-xs text-slate-700">
              <span className="font-bold text-(--color-secondary-200)">Sequence Preview: </span>
              "Hi [Name], congratulations on {insight.companyName}'s recent {insight.growthType} milestone ({insight.triggerEvent}). Given these market developments, our in-house executive talent team is reaching out for a confidential introductory exchange regarding strategic leadership directions..."
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDispatch}
              disabled={isSent}
              className="px-5 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              {isSent ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  Sequences Initiated!
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Initiate Nurture Sequences ({insight.affectedExecutives.length})
                </>
              )}
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
