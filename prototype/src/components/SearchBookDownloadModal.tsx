import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { BookOpen, Check, Copy, Download, GripVertical, Link2, Mail, Phone, Share2, Users, X } from 'lucide-react';
import type { Project } from '../types';
import { useRestricted } from '../context/RestrictedContext';
import { downloadBlob } from '../lib/simplePdf';
import {
  REPORTS,
  ReportId,
  PipelineRow,
  SearchBookContext,
  buildSearchBookPdf,
  describeReport,
} from '../lib/searchBookPdf';
import { LogoField, LogoState, getSavedCompanyLogo, setSavedCompanyLogo } from './roles/DownloadBriefModal';

interface SearchBookDownloadModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  /** Pipeline candidates, already without off-limits companies. */
  pipeline: PipelineRow[];
  onDownloaded: (message: string) => void;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'search-book';

type Delivery = 'download' | 'share' | 'digital';
type Step = 'choose' | 'people' | 'template' | 'links' | 'sections';
type ContactChannel = 'email' | 'phone';

interface Recipient {
  id: string;
  channel: ContactChannel;
  value: string;
}

const EMAIL_TEMPLATES: {
  id: string;
  name: string;
  description: string;
  subject: (title: string) => string;
  body: (title: string, recruiter: string) => string;
}[] = [
  {
    id: 'confidential',
    name: 'Confidential slate',
    description: 'A short note for the hiring committee, with a private link.',
    subject: title => `Confidential candidate slate: ${title}`,
    body: (title, recruiter) =>
      `I'm sharing the candidate slate for ${title}. The link below opens only for you.\n\nPlease keep this confidential and reply if you want a walkthrough.\n\n${recruiter}`,
  },
  {
    id: 'board',
    name: 'Board review',
    description: 'Asks stakeholders to review the slate before the next meeting.',
    subject: title => `For review: ${title} slate`,
    body: (title, recruiter) =>
      `The slate for ${title} is ready for your review. Open the link to see the candidates and the sections selected for this search.\n\nComments before the next committee meeting are welcome.\n\n${recruiter}`,
  },
  {
    id: 'brief',
    name: 'Short introduction',
    description: 'A one-paragraph note when the recipient is new to the search.',
    subject: title => `${title}: candidate slate`,
    body: (title, recruiter) =>
      `You've been invited to the ${title} search. Use the link to open the slate. Reply to this note if you need a different view of the candidates.\n\n${recruiter}`,
  },
];

function contactErrorFor(channel: ContactChannel, raw: string): string | null {
  const value = raw.trim();
  if (!value) return channel === 'email' ? 'Enter an email address.' : 'Enter a phone number.';
  if (channel === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? null : 'Enter a valid email address, such as name@company.com.';
  }
  const digits = value.replace(/\D/g, '');
  if (!/^[+\d\s().-]+$/.test(value) || digits.length < 7 || digits.length > 15) {
    return 'Enter a valid phone number, such as +1 415 555 0142.';
  }
  return null;
}

function magicLink(projectId: string, value: string): string {
  let hash = 2166136261;
  const raw = `${projectId}:${value.trim().toLowerCase()}`;
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `${window.location.origin}/slate/${encodeURIComponent(projectId)}/${(hash >>> 0).toString(36)}`;
}

export function SearchBookDownloadModal({ isOpen, onOpenChange, project, pipeline, onDownloaded }: SearchBookDownloadModalProps) {
  const { restrictedCompanies } = useRestricted();
  const defaultName = `Executive Search Book: ${project.title}`;

  const [order, setOrder] = useState<ReportId[]>(() => REPORTS.map(r => r.id));
  const [checked, setChecked] = useState<Set<ReportId>>(() => new Set(REPORTS.map(r => r.id)));
  const [name, setName] = useState(defaultName);
  const [clientLogo, setClientLogo] = useState<LogoState>(null);
  const [companyLogo, setCompanyLogo] = useState<LogoState>(getSavedCompanyLogo());
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [announce, setAnnounce] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<ReportId | null>(null);
  const [step, setStep] = useState<Step>('choose');
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [channel, setChannel] = useState<ContactChannel>('email');
  const [contact, setContact] = useState('');
  const [contactError, setContactError] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState(EMAIL_TEMPLATES[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleRefs = useRef<Partial<Record<ReportId, HTMLButtonElement | null>>>({});
  const parentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
      setError(null);
      setStep('choose');
      setDelivery(null);
      setRecipients([]);
      setChannel('email');
      setContact('');
      setContactError(null);
      setTemplateId(EMAIL_TEMPLATES[0].id);
      setCopiedId(null);
    }
  }, [isOpen, defaultName]);

  const ctx: SearchBookContext = useMemo(
    () => ({ project, pipeline, restricted: restrictedCompanies }),
    [project, pipeline, restrictedCompanies]
  );
  const info = useMemo(() => Object.fromEntries(REPORTS.map(r => [r.id, describeReport(r.id, ctx)])) as Record<ReportId, ReturnType<typeof describeReport>>, [ctx]);

  // Reports with nothing to print cannot be selected
  const usable = (id: ReportId) => info[id].available;
  const selectedInOrder = order.filter(id => checked.has(id) && usable(id));
  const selectable = REPORTS.filter(r => usable(r.id)).length;
  const allSelected = selectable > 0 && selectedInOrder.length === selectable;
  const someSelected = selectedInOrder.length > 0 && !allSelected;

  useEffect(() => {
    if (parentRef.current) parentRef.current.indeterminate = someSelected;
  }, [someSelected]);

  // Keep keyboard focus on the handle that was just moved
  useEffect(() => {
    if (focusId) {
      handleRefs.current[focusId]?.focus();
      setFocusId(null);
    }
  }, [focusId, order]);

  const toggleAll = () => setChecked(allSelected ? new Set() : new Set(REPORTS.filter(r => usable(r.id)).map(r => r.id)));
  const toggle = (id: ReportId) =>
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const label = (id: ReportId) => REPORTS.find(r => r.id === id)!.label;

  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= order.length) return;
    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setOrder(next);
    setAnnounce(`${label(item)} moved to position ${to + 1} of ${next.length}.`);
    return item;
  };

  const updateCompanyLogo = (next: LogoState) => {
    setSavedCompanyLogo(next);
    setCompanyLogo(next);
  };

  const logos = { clientLogo: clientLogo?.logo ?? null, companyLogo: companyLogo?.logo ?? null };

  const run = (ids: ReportId[], title: string, file: string, done: string) => {
    try {
      downloadBlob(buildSearchBookPdf(ids, ctx, { title, ...logos }), `${file}.pdf`);
      setError(null);
      onDownloaded(done);
      return true;
    } catch {
      setError('The PDF could not be built. Try again, and remove the logos if the problem continues.');
      return false;
    }
  };

  const downloadOne = (id: ReportId) =>
    run([id], label(id), `${slug(project.title)}-${slug(label(id))}`, `${label(id)} downloaded.`);

  const downloadBook = () => {
    if (selectedInOrder.length === 0 || (selectedInOrder.length > 1 && !name.trim())) return false;
    return selectedInOrder.length === 1
      ? downloadOne(selectedInOrder[0])
      : run(
          selectedInOrder,
          name.trim(),
          slug(name),
          `Search book downloaded with ${selectedInOrder.length} reports.`
        );
  };

  const canDownload = selectedInOrder.length > 0 && (selectedInOrder.length === 1 || name.trim().length > 0);
  const hasEmail = recipients.some(r => r.channel === 'email');
  const template = EMAIL_TEMPLATES.find(t => t.id === templateId) ?? EMAIL_TEMPLATES[0];

  const goForward = () => {
    if (step === 'choose') setStep(delivery === 'download' ? 'sections' : 'people');
    else if (step === 'people') setStep(hasEmail ? 'template' : delivery === 'digital' ? 'links' : 'sections');
    else if (step === 'template') setStep(delivery === 'digital' ? 'links' : 'sections');
    else if (step === 'links') setStep('sections');
  };

  const goBack = () => {
    if (step === 'people') setStep('choose');
    else if (step === 'template') setStep('people');
    else if (step === 'links') setStep(hasEmail ? 'template' : 'people');
    else if (step === 'sections') {
      if (delivery === 'download') setStep('choose');
      else if (delivery === 'digital') setStep('links');
      else setStep(hasEmail ? 'template' : 'people');
    }
  };

  const addRecipient = () => {
    const problem = contactErrorFor(channel, contact);
    if (problem) {
      setContactError(problem);
      return;
    }
    const value = contact.trim();
    if (recipients.some(r => r.value.toLowerCase() === value.toLowerCase())) {
      setContactError('That contact is already on the list.');
      return;
    }
    setRecipients(prev => [...prev, { id: `${channel}-${value.toLowerCase()}`, channel, value }]);
    setContact('');
    setContactError(null);
  };

  const copyLink = async (id: string, value: string) => {
    const link = magicLink(project.id, value);
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(link);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(current => (current === id ? null : current)), 2000);
    } catch {
      setCopiedId(null);
    }
  };

  const finish = (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 'sections' || !canDownload) return;
    if (delivery === 'download') {
      if (downloadBook()) onOpenChange(false);
      return;
    }
    if (delivery === 'share') {
      try {
        buildSearchBookPdf(selectedInOrder, ctx, { title: name.trim() || defaultName, ...logos });
        setError(null);
        onDownloaded(`Sent the slate PDF to ${recipients.length} ${recipients.length === 1 ? 'person' : 'people'}.`);
        onOpenChange(false);
      } catch {
        setError('The PDF could not be built. Try again, and remove the logos if the problem continues.');
      }
      return;
    }
    onDownloaded(`Invited ${recipients.length} ${recipients.length === 1 ? 'stakeholder' : 'stakeholders'} to the digital slate.`);
    onOpenChange(false);
  };

  const stepTitle =
    step === 'choose'
      ? 'Generate Search Book'
      : step === 'people'
        ? 'Who receives the slate'
        : step === 'template'
          ? 'Email template'
          : step === 'links'
            ? 'Magic links'
            : 'Sections in the slate';

  const stepDescription =
    step === 'choose'
      ? 'Download the candidate slate, share the PDF, or invite stakeholders into the digital slate.'
      : step === 'people'
        ? 'Add an email or a phone number. Each person receives a magic link.'
        : step === 'template'
          ? 'Choose the note that goes out with the link, and preview it before you continue.'
          : step === 'links'
            ? 'Each invited person has a link. Copy one if you want to send it yourself.'
            : delivery === 'digital'
              ? 'Choose which sections stakeholders see in the digital slate.'
              : 'Choose which sections appear in the PDF.';

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-(--border-light) w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col z-50 animate-scaleIn">
          <form onSubmit={finish} className="flex flex-col min-h-0 flex-1 overflow-hidden">
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-(--border-light) shrink-0">
              <div>
                <Dialog.Title className="m-0! text-xl! font-bold text-(--text-strong)">{stepTitle}</Dialog.Title>
                <Dialog.Description className="text-sm text-(--text-default) m-0! mt-1!">
                  {stepDescription}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" aria-label="Close">
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <div className="px-6 py-5 space-y-6 overflow-y-auto flex-1 min-h-0">
              {step === 'choose' && (
                <div className="grid grid-cols-1 gap-3" role="radiogroup" aria-label="How to share the slate">
                  {([
                    { id: 'download' as const, title: 'Download a candidate slate PDF', description: 'Save the slate as a PDF on this computer.', icon: Download },
                    { id: 'share' as const, title: 'Share the PDF', description: 'Send the PDF by email or text with a magic link.', icon: Share2 },
                    { id: 'digital' as const, title: 'Invite stakeholders to the digital slate', description: 'Open the slate in the browser. Each person gets a magic link you can also copy.', icon: Users },
                  ]).map(option => {
                    const Icon = option.icon;
                    const selected = delivery === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setDelivery(option.id)}
                        className="text-left rounded-2xl border p-4 flex items-start gap-3"
                        style={{
                          borderColor: selected ? 'var(--color-secondary-200)' : 'var(--border-light)',
                          background: selected ? 'var(--color-secondary-40)' : 'var(--bg-default)',
                        }}
                      >
                        <span className="w-9 h-9 rounded-xl bg-(--bg-neutral-soft) flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-(--text-default)" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-base font-bold text-(--text-strong)">{option.title}</span>
                          <span className="block mt-1 text-sm text-(--text-default)">{option.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 'people' && (
                <div className="space-y-4">
                  <div className="flex gap-2" role="radiogroup" aria-label="How to reach them">
                    {([
                      { id: 'email' as const, label: 'Email', icon: Mail },
                      { id: 'phone' as const, label: 'Phone', icon: Phone },
                    ]).map(option => {
                      const Icon = option.icon;
                      const selected = channel === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => { setChannel(option.id); setContactError(null); }}
                          className="phx-btn"
                          data-variant={selected ? 'primary' : 'secondary'}
                          data-size="sm"
                        >
                          <Icon className="w-4 h-4" aria-hidden="true" /> {option.label}
                        </button>
                      );
                    })}
                  </div>
                  <div>
                    <label className="phx-label" htmlFor="slate-contact">
                      {channel === 'email' ? 'Email address' : 'Phone number'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="slate-contact"
                        type={channel === 'email' ? 'email' : 'tel'}
                        value={contact}
                        onChange={e => { setContact(e.target.value); setContactError(null); }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addRecipient();
                          }
                        }}
                        placeholder={channel === 'email' ? 'name@company.com' : '+1 415 555 0142'}
                        className="w-full"
                        autoComplete="off"
                      />
                      <button type="button" className="phx-btn shrink-0" data-variant="secondary" data-size="sm" onClick={addRecipient}>
                        Add
                      </button>
                    </div>
                    {contactError && <p className="text-sm mt-1.5" style={{ color: 'var(--feedback-error-text-default)' }}>{contactError}</p>}
                  </div>
                  {recipients.length > 0 && (
                    <ul className="flex flex-col gap-2" aria-label="People who will receive the slate">
                      {recipients.map(person => (
                        <li key={person.id} className="flex items-center justify-between gap-3 rounded-xl border border-(--border-light) px-3 py-2">
                          <span className="text-sm text-(--text-strong)">
                            <span className="text-(--text-subtle)">{person.channel === 'email' ? 'Email' : 'Phone'}: </span>
                            {person.value}
                          </span>
                          <button
                            type="button"
                            className="phx-btn"
                            data-variant="tertiary"
                            data-size="sm"
                            onClick={() => setRecipients(prev => prev.filter(r => r.id !== person.id))}
                            aria-label={`Remove ${person.value}`}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {step === 'template' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2" role="radiogroup" aria-label="Email template">
                    {EMAIL_TEMPLATES.map(item => {
                      const selected = templateId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setTemplateId(item.id)}
                          className="text-left rounded-2xl border p-4"
                          style={{
                            borderColor: selected ? 'var(--color-secondary-200)' : 'var(--border-light)',
                            background: selected ? 'var(--color-secondary-40)' : 'var(--bg-default)',
                          }}
                        >
                          <span className="block text-base font-bold text-(--text-strong)">{item.name}</span>
                          <span className="block mt-1 text-sm text-(--text-default)">{item.description}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="rounded-2xl border border-(--border-light) bg-(--bg-default) p-4" aria-label="Email preview">
                    <p className="text-sm text-(--text-subtle) m-0!">To: {recipients.filter(r => r.channel === 'email').map(r => r.value).join(', ') || 'name@company.com'}</p>
                    <p className="text-sm text-(--text-subtle) m-0! mt-1!">From: {project.leadRecruiter}</p>
                    <p className="text-base font-bold text-(--text-strong) m-0! mt-3!">{template.subject(project.title)}</p>
                    <p className="text-sm text-(--text-default) m-0! mt-3! whitespace-pre-wrap">{template.body(project.title, project.leadRecruiter)}</p>
                    <p className="text-sm m-0! mt-3!" style={{ color: 'var(--text-brand-secondary-default)' }}>
                      {magicLink(project.id, recipients.find(r => r.channel === 'email')?.value || 'preview')}
                    </p>
                  </div>
                </div>
              )}

              {step === 'links' && (
                <ul className="flex flex-col gap-3" aria-label="Magic links">
                  {recipients.map(person => {
                    const link = magicLink(project.id, person.value);
                    return (
                      <li key={person.id} className="rounded-2xl border border-(--border-light) p-4 flex flex-col gap-2">
                        <span className="text-sm font-semibold text-(--text-strong)">{person.value}</span>
                        <span className="text-sm text-(--text-default) break-all">{link}</span>
                        <div>
                          <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={() => copyLink(person.id, person.value)}>
                            {copiedId === person.id ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                            {copiedId === person.id ? 'Copied' : 'Copy link'}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {step === 'sections' && (
              <>
              {/* Report tree: the search book is the parent, each report a child */}
              <div className="rounded-2xl border border-(--border-light) overflow-hidden">
                <label className="flex items-center gap-3 px-4 py-3 bg-(--bg-neutral-soft) border-b border-(--border-light) cursor-pointer">
                  <input
                    ref={parentRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 cursor-pointer"
                    style={{ accentColor: 'var(--text-brand-secondary-default)' }}
                    aria-label="Select all reports"
                  />
                  <BookOpen className="w-5 h-5 text-(--color-secondary-200)" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-(--text-strong)">Search Book</span>
                    <span className="block text-sm text-(--text-default)">
                      {selectedInOrder.length} of {selectable} reports selected
                    </span>
                  </span>
                </label>

                <ul className="py-2" aria-label="Reports in the search book">
                  {order.map((id, index) => {
                    const def = REPORTS.find(r => r.id === id)!;
                    const can = usable(id);
                    const on = checked.has(id) && can;
                    const position = on ? selectedInOrder.indexOf(id) + 1 : null;
                    const isOver = overIndex === index && dragIndex !== null && dragIndex !== index;
                    return (
                      <li
                        key={id}
                        draggable
                        onDragStart={e => {
                          setDragIndex(index);
                          e.dataTransfer.effectAllowed = 'move';
                          e.dataTransfer.setData('text/plain', id);
                        }}
                        onDragOver={e => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          setOverIndex(index);
                        }}
                        onDrop={e => {
                          e.preventDefault();
                          if (dragIndex !== null) move(dragIndex, index);
                          setDragIndex(null);
                          setOverIndex(null);
                        }}
                        onDragEnd={() => {
                          setDragIndex(null);
                          setOverIndex(null);
                        }}
                        className="relative ml-6 pl-5 pr-4"
                        style={{
                          borderLeft: '2px solid var(--border-light)',
                          opacity: dragIndex === index ? 0.5 : 1,
                          boxShadow: isOver
                            ? `inset 0 ${dragIndex! < index ? '-' : ''}3px 0 var(--text-brand-secondary-default)`
                            : undefined,
                        }}
                      >
                        {/* Branch connector to the parent line */}
                        <span aria-hidden="true" className="absolute left-0 top-1/2 w-4 h-0.5 bg-(--border-light)" />
                        <div className="flex items-center gap-3 py-2.5">
                          <button
                            type="button"
                            ref={el => {
                              handleRefs.current[id] = el;
                            }}
                            className="phx-btn cursor-grab"
                            data-variant="tertiary"
                            data-size="sm"
                            aria-label={`Reorder ${def.label}, position ${index + 1} of ${order.length}. Use the up and down arrow keys to move it.`}
                            onKeyDown={e => {
                              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                e.preventDefault();
                                const to = e.key === 'ArrowUp' ? index - 1 : index + 1;
                                if (move(index, to)) setFocusId(id);
                              }
                            }}
                          >
                            <GripVertical className="w-4 h-4" aria-hidden="true" />
                          </button>

                          <input
                            id={`sb-report-${id}`}
                            type="checkbox"
                            checked={on}
                            disabled={!can}
                            onChange={() => toggle(id)}
                            className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                            style={{ accentColor: 'var(--text-brand-secondary-default)' }}
                          />

                          <label htmlFor={`sb-report-${id}`} className="min-w-0 flex-1 cursor-pointer">
                            <span className="flex items-center gap-2 flex-wrap">
                              <span className="text-base font-bold text-(--text-strong)">{def.label}</span>
                              {position && <span className="phx-tag" data-size="sm">Position {position}</span>}
                            </span>
                            <span className="block text-sm text-(--text-default)">{def.description}</span>
                            <span className="block text-sm text-(--text-subtle)">{info[id].detail}</span>
                          </label>

                          {delivery === 'download' && (
                            <button
                              type="button"
                              className="phx-btn shrink-0"
                              data-variant="secondary"
                              data-size="sm"
                              disabled={!can}
                              onClick={() => downloadOne(id)}
                              aria-label={`Download ${def.label} as a PDF`}
                            >
                              <Download className="w-4 h-4" aria-hidden="true" /> Download
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <p className="sr-only" role="status" aria-live="polite">{announce}</p>

              <div>
                <label className="phx-label" htmlFor="sb-book-name">Search book name</label>
                <input
                  id="sb-book-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={120}
                  autoComplete="off"
                  className="w-full"
                />
                <p className="text-sm text-(--text-default) mt-1.5">Printed on the cover and used for the file name when you download several reports together.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <LogoField
                  id="sb-client-logo"
                  label="Client logo"
                  help="Appears at the top right of every page."
                  value={clientLogo}
                  onChange={setClientLogo}
                />
                <LogoField
                  id="sb-company-logo"
                  label="Your company logo"
                  help="Appears at the top left of every page. Saved for next time."
                  value={companyLogo}
                  onChange={updateCompanyLogo}
                />
              </div>

              {error && (
                <div className="phx-feedback" data-tone="error" role="alert">{error}</div>
              )}
              </>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-(--border-light) bg-(--bg-default) shrink-0">
              <span className="text-sm text-(--text-default)">
                {step === 'sections'
                  ? selectedInOrder.length === 0
                    ? 'Select at least one section.'
                    : `${selectedInOrder.length} ${selectedInOrder.length === 1 ? 'section' : 'sections'} included.`
                  : step === 'people'
                    ? recipients.length === 0
                      ? 'Add at least one email or phone number.'
                      : `${recipients.length} ${recipients.length === 1 ? 'person' : 'people'} will receive a magic link.`
                    : ''}
              </span>
              <div className="flex items-center gap-3">
                {step === 'choose' ? (
                  <Dialog.Close asChild>
                    <button type="button" className="phx-btn" data-variant="secondary" data-size="sm">Cancel</button>
                  </Dialog.Close>
                ) : (
                  <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={goBack}>Back</button>
                )}
                {step === 'sections' ? (
                  <button type="submit" className="phx-btn" data-variant="primary" data-size="sm" disabled={!canDownload}>
                    {delivery === 'download' ? <Download className="w-4 h-4" aria-hidden="true" /> : <Link2 className="w-4 h-4" aria-hidden="true" />}
                    {delivery === 'download' ? 'Download slate PDF' : delivery === 'share' ? 'Send PDF' : 'Send invitations'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="phx-btn"
                    data-variant="primary"
                    data-size="sm"
                    disabled={step === 'choose' ? delivery === null : step === 'people' ? recipients.length === 0 : false}
                    onClick={goForward}
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
