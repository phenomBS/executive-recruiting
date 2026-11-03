import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Check,
  Search,
  Mail,
  MessageSquare,
  MessageCircle,
  Send,
  ListFilter,
  UserSearch,
  User,
  Plus,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { ProjectPipelineCandidate } from './tabs/ProjectCandidatesTab';
import { SEARCH_BOOK_TEMPLATES, SearchBookTemplate, TemplateContext } from './searchBookTemplates';

export type RecipientChannel = 'email' | 'sms' | 'whatsapp';

export interface SearchBookRecipient {
  id: string;
  channel: RecipientChannel;
  value: string;
  name: string;
}

export interface SearchBookSendSummary {
  candidateCount: number;
  templateName: string;
  subject: string;
  message: string;
  recipients: SearchBookRecipient[];
}

interface GenerateSearchBookModalProps {
  projectTitle: string;
  leadRecruiter: string;
  candidates: ProjectPipelineCandidate[];
  stages: string[];
  onClose: () => void;
  onSend: (summary: SearchBookSendSummary) => void;
}

const TEMPLATE_EDITOR_URL =
  'https://ai.studio/apps/0cd932cc-5c25-4ea8-b34d-1b7d6d4a90a8?fullscreenApplet=true';

const CHANNELS: { id: RecipientChannel; label: string; icon: typeof Mail; placeholder: string }[] = [
  { id: 'email', label: 'Email', icon: Mail, placeholder: 'name@company.com' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, placeholder: '+1 415 555 0142' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, placeholder: '+1 415 555 0142' },
];

const STEPS = ['Candidates', 'Template', 'Recipients'];

const EMI_OPTIONS = [
  { value: 0, label: 'Any EMI score' },
  { value: 60, label: '60 and above' },
  { value: 80, label: '80 and above (Intelligent Shortlist)' },
];

function validateContact(channel: RecipientChannel, raw: string): string | null {
  const value = raw.trim();
  if (!value) return channel === 'email' ? 'Enter an email address.' : 'Enter a phone number.';
  if (channel === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? null : 'Enter a valid email address, such as name@company.com.';
  }
  const digits = value.replace(/\D/g, '');
  if (!/^[+\d\s().-]+$/.test(value) || digits.length < 7 || digits.length > 15) {
    return 'Enter a valid phone number with country code, such as +1 415 555 0142.';
  }
  return null;
}

function Avatar({ candidate, size = 'w-8 h-8' }: { candidate: ProjectPipelineCandidate; size?: string }) {
  return candidate.avatarUrl ? (
    <img
      src={candidate.avatarUrl}
      alt=""
      className={cn(size, 'rounded-full object-cover shrink-0 ring-1 ring-slate-200')}
    />
  ) : (
    <div className={cn(size, 'rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0')}>
      <User className="w-4 h-4" />
    </div>
  );
}

function EmiBadge({ score }: { score: number }) {
  return (
    <span
      className={cn(
        'px-2 py-0.5 text-xs font-bold rounded-md border inline-flex items-center justify-center min-w-[32px]',
        score >= 80
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : score >= 60
          ? 'bg-blue-50 text-blue-700 border-blue-200'
          : 'bg-amber-50 text-amber-700 border-amber-200'
      )}
    >
      {score}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Template thumbnail: the real page layout, scaled down               */
/* ------------------------------------------------------------------ */

const THUMB_W = 76;
const THUMB_MAX_H = 104;

function TemplateThumb({ template, ctx }: { template: SearchBookTemplate; ctx: TemplateContext }) {
  const page = template.pages[Math.min(template.thumbnailPage, template.pages.length - 1)];
  const scale = THUMB_W / template.size.w;
  const height = Math.min(THUMB_MAX_H, template.size.h * scale);
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden shrink-0 rounded-md border border-slate-300 bg-white shadow-xs pointer-events-none select-none"
      style={{ width: THUMB_W, height }}
    >
      <div style={{ width: template.size.w, height: template.size.h, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {page.render(ctx)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Template preview                                                    */
/* ------------------------------------------------------------------ */

function TemplatePreview({ template, ctx }: { template: SearchBookTemplate; ctx: TemplateContext }) {
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex(0);
  }, [template.id]);

  const total = template.pages.length;
  const index = Math.min(pageIndex, total - 1);
  const page = template.pages[index];
  const scale = Math.min(440 / template.size.h, 400 / template.size.w);

  return (
    <div className="flex flex-col items-center gap-4">
      <div role="tablist" aria-label={`${template.name} pages`} className="flex flex-wrap justify-center gap-1.5">
        {template.pages.map((pg, i) => (
          <button
            key={pg.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => setPageIndex(i)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer',
              i === index
                ? 'bg-(--color-secondary-200) text-white border-(--color-secondary-200)'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            )}
          >
            {pg.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPageIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          aria-label="Previous page"
          className="p-1.5 rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div
          className="relative overflow-hidden bg-white border border-slate-300 shadow-lg shrink-0"
          style={{ width: template.size.w * scale, height: template.size.h * scale }}
          role="img"
          aria-label={`${template.name}, page ${index + 1} of ${total}: ${page.label}`}
        >
          <div
            style={{
              width: template.size.w,
              height: template.size.h,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {page.render(ctx)}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPageIndex(Math.min(total - 1, index + 1))}
          disabled={index === total - 1}
          aria-label="Next page"
          className="p-1.5 rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="text-xs text-slate-500">
        Page {index + 1} of {total}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

export function GenerateSearchBookModal({
  projectTitle,
  leadRecruiter,
  candidates,
  stages,
  onClose,
  onSend,
}: GenerateSearchBookModalProps) {
  const [step, setStep] = useState(0);

  // Step 1: candidates
  const [mode, setMode] = useState<'filter' | 'search'>('filter');
  const [stageFilter, setStageFilter] = useState<string[]>([]);
  const [minEmi, setMinEmi] = useState(0);
  const [query, setQuery] = useState('');
  const [manualIds, setManualIds] = useState<string[]>([]);

  // Step 2: template
  const [templateId, setTemplateId] = useState<string>(SEARCH_BOOK_TEMPLATES[0].id);
  const [templateChosen, setTemplateChosen] = useState(false);

  // Step 3: recipients
  const [recipients, setRecipients] = useState<SearchBookRecipient[]>([]);
  const [channel, setChannel] = useState<RecipientChannel>('email');
  const [contact, setContact] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactError, setContactError] = useState<string | null>(null);
  const [subject, setSubject] = useState(`Executive Search Book: ${projectTitle}`);
  const [note, setNote] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const filterMatches = useMemo(
    () =>
      candidates
        .filter(c => (stageFilter.length === 0 ? true : stageFilter.includes(c.projectStatus)))
        .filter(c => c.emiScore >= minEmi)
        .sort((a, b) => b.emiScore - a.emiScore),
    [candidates, stageFilter, minEmi]
  );

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter(c =>
      `${c.firstName} ${c.lastName} ${c.role} ${c.company} ${c.location}`.toLowerCase().includes(q)
    );
  }, [candidates, query]);

  const selectedCandidates = useMemo(
    () => (mode === 'filter' ? filterMatches : candidates.filter(c => manualIds.includes(c.id))),
    [mode, filterMatches, candidates, manualIds]
  );

  const template = SEARCH_BOOK_TEMPLATES.find(t => t.id === templateId) ?? SEARCH_BOOK_TEMPLATES[0];

  const toggleStage = (stage: string) =>
    setStageFilter(prev => (prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]));

  const toggleManual = (id: string) =>
    setManualIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const allResultsSelected = searchResults.length > 0 && searchResults.every(c => manualIds.includes(c.id));

  const toggleAllResults = () => {
    if (allResultsSelected) {
      const ids = new Set(searchResults.map(c => c.id));
      setManualIds(prev => prev.filter(id => !ids.has(id)));
    } else {
      setManualIds(prev => Array.from(new Set([...prev, ...searchResults.map(c => c.id)])));
    }
  };

  const addRecipient = () => {
    const error = validateContact(channel, contact);
    if (error) {
      setContactError(error);
      return;
    }
    const value = contact.trim();
    const duplicate = recipients.some(r => r.channel === channel && r.value.toLowerCase() === value.toLowerCase());
    if (duplicate) {
      setContactError('This recipient is already added for that channel.');
      return;
    }
    setRecipients(prev => [
      ...prev,
      { id: `${channel}-${Date.now()}-${prev.length}`, channel, value, name: contactName.trim() },
    ]);
    setContact('');
    setContactName('');
    setContactError(null);
  };

  const canAdvance = step === 0 ? selectedCandidates.length > 0 : true;
  const canSend = selectedCandidates.length > 0 && recipients.length > 0 && subject.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    onSend({
      candidateCount: selectedCandidates.length,
      templateName: template.name,
      subject: subject.trim(),
      message: note.trim(),
      recipients,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-book-title"
        className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-start justify-between border-b border-slate-200 shrink-0">
          <div>
            <h2 id="search-book-title" className="text-xl font-bold text-(--text-strong)">
              Generate Search Book
            </h2>
            <p className="text-sm text-slate-500 mt-1">{projectTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper */}
        <ol className="px-6 py-3 flex items-center gap-3 border-b border-slate-200 bg-slate-50 shrink-0 overflow-x-auto">
          {STEPS.map((label, index) => {
            const done = index < step;
            const active = index === step;
            return (
              <li key={label} className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => (index <= step || selectedCandidates.length > 0) && setStep(index)}
                  aria-current={active ? 'step' : undefined}
                  className="flex items-center gap-2 text-sm font-semibold cursor-pointer"
                >
                  <span
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border',
                      active
                        ? 'bg-(--color-secondary-200) text-white border-(--color-secondary-200)'
                        : done
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-white text-slate-500 border-slate-300'
                    )}
                  >
                    {done ? <Check className="w-3.5 h-3.5" /> : index + 1}
                  </span>
                  <span className={active ? 'text-slate-900' : 'text-slate-500'}>{label}</span>
                </button>
                {index < STEPS.length - 1 && <span className="w-8 h-px bg-slate-300" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[420px]">
          {step === 0 && (
            <div className="space-y-5">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                role="radiogroup"
                aria-label="How to choose candidates"
              >
                {[
                  {
                    id: 'filter' as const,
                    icon: ListFilter,
                    title: 'Select a filtered list',
                    text: 'Include every candidate that matches stage and EMI score filters.',
                  },
                  {
                    id: 'search' as const,
                    icon: UserSearch,
                    title: 'Search and select',
                    text: 'Search the project pipeline and pick individual candidates.',
                  },
                ].map(option => {
                  const Icon = option.icon;
                  const active = mode === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setMode(option.id)}
                      className={cn(
                        'text-left rounded-xl border p-4 flex gap-3 transition-all cursor-pointer',
                        active
                          ? 'border-(--color-secondary-200) ring-1 ring-(--color-secondary-200) bg-purple-50/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      )}
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                          active ? 'bg-(--color-secondary-200) text-white' : 'bg-slate-100 text-slate-600'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{option.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{option.text}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {mode === 'filter' ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-2" id="stage-filter-label">
                      Pipeline stage
                    </div>
                    <div className="flex flex-wrap gap-2" role="group" aria-labelledby="stage-filter-label">
                      <button
                        type="button"
                        onClick={() => setStageFilter([])}
                        aria-pressed={stageFilter.length === 0}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer',
                          stageFilter.length === 0
                            ? 'bg-(--color-secondary-200) text-white border-(--color-secondary-200)'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        )}
                      >
                        All stages ({candidates.length})
                      </button>
                      {stages.map(stage => {
                        const active = stageFilter.includes(stage);
                        return (
                          <button
                            key={stage}
                            type="button"
                            onClick={() => toggleStage(stage)}
                            aria-pressed={active}
                            className={cn(
                              'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer',
                              active
                                ? 'bg-(--color-secondary-200) text-white border-(--color-secondary-200)'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                            )}
                          >
                            {stage} ({candidates.filter(c => c.projectStatus === stage).length})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="max-w-xs">
                    <label htmlFor="sb-emi" className="block text-xs font-semibold text-slate-600 mb-1.5">
                      EMI score
                    </label>
                    <select
                      id="sb-emi"
                      value={minEmi}
                      onChange={e => setMinEmi(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-800 cursor-pointer"
                    >
                      {EMI_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                      {filterMatches.length} matching candidate{filterMatches.length === 1 ? '' : 's'}, ranked by EMI score
                    </div>
                    {filterMatches.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-slate-500">
                        No candidates match these filters. Widen the stage or EMI score filter.
                      </div>
                    ) : (
                      <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                        {filterMatches.map(c => (
                          <li key={c.id} className="px-4 py-2.5 flex items-center gap-3">
                            <Avatar candidate={c} />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-slate-900 truncate">
                                {c.firstName} {c.lastName}
                              </div>
                              <div className="text-xs text-slate-500 truncate">
                                {c.role}, {c.company}
                              </div>
                            </div>
                            <span className="text-xs text-slate-500 hidden sm:inline">{c.projectStatus}</span>
                            <EmiBadge score={c.emiScore} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[220px] max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search by name, role, company, location"
                        aria-label="Search candidates in this project"
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200) bg-white text-slate-700 placeholder:text-slate-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={toggleAllResults}
                      disabled={searchResults.length === 0}
                      className="text-sm font-semibold text-(--color-secondary-200) hover:underline disabled:opacity-40 cursor-pointer"
                    >
                      {allResultsSelected ? 'Clear these results' : `Select all ${searchResults.length} results`}
                    </button>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    {searchResults.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-slate-500">
                        No candidates in this project match your search. Try a different name or company.
                      </div>
                    ) : (
                      <ul className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                        {searchResults.map(c => {
                          const checked = manualIds.includes(c.id);
                          return (
                            <li key={c.id}>
                              <label
                                className={cn(
                                  'px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-slate-50',
                                  checked && 'bg-purple-50/40'
                                )}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleManual(c.id)}
                                  className="w-4 h-4 rounded border-slate-300 text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                                />
                                <Avatar candidate={c} />
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-semibold text-slate-900 truncate">
                                    {c.firstName} {c.lastName}
                                  </div>
                                  <div className="text-xs text-slate-500 truncate">
                                    {c.role}, {c.company}
                                  </div>
                                </div>
                                <span className="text-xs text-slate-500 hidden sm:inline">{c.projectStatus}</span>
                                <EmiBadge score={c.emiScore} />
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
              <div role="radiogroup" aria-label="Search book template" className="space-y-2.5">
                {SEARCH_BOOK_TEMPLATES.map(t => {
                  const active = t.id === templateId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        setTemplateId(t.id);
                        setTemplateChosen(true);
                      }}
                      className={cn(
                        'w-full text-left rounded-xl border p-3 flex gap-3 transition-all cursor-pointer',
                        active
                          ? 'border-(--color-secondary-200) ring-1 ring-(--color-secondary-200) bg-purple-50/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      )}
                    >
                      <TemplateThumb template={t} ctx={{ candidates: selectedCandidates, projectTitle, leadRecruiter }} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">{t.name}</span>
                          {t.badge && (
                            <span
                              className={cn(
                                'px-1.5 py-0.5 rounded text-[10px] font-bold',
                                'bg-slate-100 text-slate-600'
                              )}
                            >
                              {t.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{t.description}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{t.pages.length} pages</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="bg-slate-100 rounded-xl p-5 border border-slate-200 min-w-0 lg:sticky lg:top-0" aria-live="polite">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 mb-0.5">{template.name}</div>
                    <div className="text-xs text-slate-500">
                      Preview built from your {selectedCandidates.length} selected candidate
                      {selectedCandidates.length === 1 ? '' : 's'}.
                    </div>
                  </div>
                </div>
                <TemplatePreview
                  template={template}
                  ctx={{ candidates: selectedCandidates, projectTitle, leadRecruiter }}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-6">
              <div className="space-y-5 min-w-0">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add recipients</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose how each person receives the search book: email, SMS, or WhatsApp.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,1fr)] gap-3">
                  <div>
                    <label htmlFor="sb-channel" className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Delivery method
                    </label>
                    <select
                      id="sb-channel"
                      value={channel}
                      onChange={e => {
                        setChannel(e.target.value as RecipientChannel);
                        setContactError(null);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-800 cursor-pointer"
                    >
                      {CHANNELS.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sb-contact" className="block text-xs font-semibold text-slate-600 mb-1.5">
                      {channel === 'email' ? 'Email address' : channel === 'sms' ? 'Mobile number' : 'WhatsApp number'}
                    </label>
                    <input
                      id="sb-contact"
                      type={channel === 'email' ? 'email' : 'tel'}
                      value={contact}
                      onChange={e => {
                        setContact(e.target.value);
                        setContactError(null);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRecipient();
                        }
                      }}
                      placeholder={CHANNELS.find(c => c.id === channel)?.placeholder}
                      aria-invalid={Boolean(contactError)}
                      aria-describedby={contactError ? 'sb-contact-error' : undefined}
                      className={cn(
                        'w-full px-3 py-2 rounded-lg border text-sm bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1',
                        contactError
                          ? 'border-red-400 focus:ring-red-400'
                          : 'border-slate-300 focus:border-(--color-secondary-200) focus:ring-(--color-secondary-200)'
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-3 items-end">
                  <div>
                    <label htmlFor="sb-name" className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Recipient name (optional)
                    </label>
                    <input
                      id="sb-name"
                      type="text"
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      placeholder="Hiring manager name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addRecipient}
                    className="flex items-center justify-center gap-2 px-5 py-2 rounded-full border border-slate-300 text-(--color-secondary-200) font-semibold text-sm hover:bg-slate-50 bg-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add recipient
                  </button>
                </div>
                {contactError && (
                  <p id="sb-contact-error" role="alert" className="text-xs text-red-600 -mt-2">
                    {contactError}
                  </p>
                )}

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    {recipients.length} recipient{recipients.length === 1 ? '' : 's'}
                  </div>
                  {recipients.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-500">
                      Add at least one email address or phone number to send the search book.
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {recipients.map(r => {
                        const meta = CHANNELS.find(c => c.id === r.channel)!;
                        const Icon = meta.icon;
                        return (
                          <li key={r.id} className="px-4 py-2.5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-50 text-(--color-secondary-200) flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-slate-900 truncate">{r.name || r.value}</div>
                              <div className="text-xs text-slate-500 truncate">
                                {meta.label}
                                {r.name ? `: ${r.value}` : ''}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setRecipients(prev => prev.filter(x => x.id !== r.id))}
                              aria-label={`Remove ${r.name || r.value}`}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div>
                  <label htmlFor="sb-subject" className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Subject line
                  </label>
                  <input
                    id="sb-subject"
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Subject of the message"
                    aria-required="true"
                    aria-invalid={subject.trim().length === 0}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200)"
                  />
                  {subject.trim().length === 0 && (
                    <p className="text-xs text-red-600 mt-1">Enter a subject line to send the search book.</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">Used as the email subject; SMS and WhatsApp recipients see it as the first line.</p>
                </div>

                <div>
                  <label htmlFor="sb-note" className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Message (optional)
                  </label>
                  <textarea
                    id="sb-note"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={3}
                    placeholder="Add a short note to include with the search book"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200) resize-none"
                  />
                </div>
              </div>

              <aside className="bg-slate-50 border border-slate-200 rounded-xl p-4 h-fit space-y-3 text-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Summary</div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Candidates</span>
                  <span className="font-semibold text-slate-900">{selectedCandidates.length}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Template</span>
                  <span className="font-semibold text-slate-900 text-right">{template.name}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Recipients</span>
                  <span className="font-semibold text-slate-900">{recipients.length}</span>
                </div>
              </aside>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{selectedCandidates.length}</span> candidate
            {selectedCandidates.length === 1 ? '' : 's'} selected
          </div>
          <div className="flex items-center gap-3">
            {step === 0 ? (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 bg-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step === 1 && templateChosen && (
              <a
                href={TEMPLATE_EDITOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Edit ${template.name} template (opens in a new tab)`}
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-slate-300 text-(--color-secondary-200) font-semibold text-sm hover:bg-slate-50 bg-white transition-colors cursor-pointer"
              >
                <Pencil className="w-4 h-4" /> Edit
              </a>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => canAdvance && setStep(step + 1)}
                disabled={!canAdvance}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send search book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
