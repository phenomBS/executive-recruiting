import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { BookOpen, Download, GripVertical, X } from 'lucide-react';
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

  const handleRefs = useRef<Partial<Record<ReportId, HTMLButtonElement | null>>>({});
  const parentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
      setError(null);
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

  const downloadBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInOrder.length === 0 || (selectedInOrder.length > 1 && !name.trim())) return;
    const ok =
      selectedInOrder.length === 1
        ? downloadOne(selectedInOrder[0])
        : run(
            selectedInOrder,
            name.trim(),
            slug(name),
            `Search book downloaded with ${selectedInOrder.length} reports.`
          );
    if (ok) onOpenChange(false);
  };

  const canDownload = selectedInOrder.length > 0 && (selectedInOrder.length === 1 || name.trim().length > 0);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-(--border-light) w-full max-w-3xl max-h-[92vh] overflow-y-auto flex flex-col z-50 animate-scaleIn">
          <form onSubmit={downloadBook} className="flex flex-col">
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-(--border-light)">
              <div>
                <Dialog.Title className="text-xl font-bold text-(--text-strong)">Generate Search Book</Dialog.Title>
                <Dialog.Description className="text-sm text-(--text-default) mt-1">
                  Download one report on its own, or combine the reports you select into a single search book. Drag reports to set their order.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" aria-label="Close">
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <div className="px-6 py-5 space-y-6">
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
            </div>

            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-(--border-light) bg-(--bg-neutral-soft)">
              <span className="text-sm text-(--text-default)">
                {selectedInOrder.length === 0
                  ? 'Select at least one report.'
                  : selectedInOrder.length === 1
                    ? `${label(selectedInOrder[0])} downloads as its own report.`
                    : `${selectedInOrder.length} reports in one PDF, with a cover and contents page.`}
              </span>
              <div className="flex items-center gap-3">
                <Dialog.Close asChild>
                  <button type="button" className="phx-btn" data-variant="secondary" data-size="sm">Cancel</button>
                </Dialog.Close>
                <button type="submit" className="phx-btn" data-variant="primary" data-size="sm" disabled={!canDownload}>
                  <Download className="w-4 h-4" aria-hidden="true" /> Download Search Book
                </button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
