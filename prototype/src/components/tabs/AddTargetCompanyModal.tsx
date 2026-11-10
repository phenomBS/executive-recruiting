import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Building2, Check, Lock, PlusCircle, Search, Sparkles, X } from 'lucide-react';
import { useRestricted } from '../../context/RestrictedContext';
import {
  TargetCompany,
  findCompanyByName,
  listExistingCompanies,
  masterRepositorySize,
  registerCreatedCompany,
  searchMasterRepository,
} from '../../data/projectTargetCompanies';
import { cn } from '../../lib/utils';

type Mode = 'existing' | 'create' | 'ai';

const MODES: { id: Mode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'existing', label: 'Existing companies', icon: Building2 },
  { id: 'create', label: 'Create new', icon: PlusCircle },
  { id: 'ai', label: 'Find with AI', icon: Sparkles },
];

const INDUSTRIES = [
  'Enterprise B2B SaaS',
  'Cybersecurity & Network Defense',
  'Cloud Infrastructure & DevOps',
  'Data & Analytics',
  'Financial Technology & Payments',
  'Advanced Computing & Systems',
  'Semiconductors & Systems',
  'HealthTech & Digital Health',
  'E-Commerce & Marketplaces',
  'Other',
];

const SIZES = ['1-500 employees', '501-1,000 employees', '1,001-5,000 employees', '5,001-10,000 employees', '10,000+ employees'];

const EXAMPLE_PROMPTS = [
  'Pre-IPO fintech companies with leadership turnover',
  'Cybersecurity companies in the Bay Area that are hiring',
  'Large public cloud infrastructure companies',
];

interface AddTargetCompanyModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Names already on the project, so they are not offered again */
  projectCompanyNames: string[];
  onAdd: (companies: TargetCompany[]) => void;
}

export function AddTargetCompanyModal({ isOpen, onOpenChange, projectCompanyNames, onAdd }: AddTargetCompanyModalProps) {
  const { restrictedCompanies } = useRestricted();
  const [mode, setMode] = useState<Mode>('existing');

  // shared selection (by company id) for the two list modes
  const [selected, setSelected] = useState<Record<string, TargetCompany>>({});

  // existing
  const [query, setQuery] = useState('');

  // create
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [headquarters, setHeadquarters] = useState('');
  const [size, setSize] = useState(SIZES[2]);
  const [note, setNote] = useState('');

  // ai
  const [prompt, setPrompt] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<TargetCompany[] | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setMode('existing');
    setSelected({});
    setQuery('');
    setName('');
    setWebsite('');
    setIndustry(INDUSTRIES[0]);
    setHeadquarters('');
    setSize(SIZES[2]);
    setNote('');
    setPrompt('');
    setSearching(false);
    setResults(null);
  }, [isOpen]);

  const onProject = useMemo(() => new Set(projectCompanyNames.map(n => n.toLowerCase())), [projectCompanyNames]);
  const isRestricted = (n: string) => restrictedCompanies.find(r => r.name.toLowerCase() === n.toLowerCase());

  const existing = useMemo(
    () => (isOpen ? listExistingCompanies() : []).filter(c => !onProject.has(c.name.toLowerCase())),
    [isOpen, onProject]
  );
  const existingShown = existing.filter(c => {
    const q = query.trim().toLowerCase();
    return !q || `${c.name} ${c.industry} ${c.headquarters}`.toLowerCase().includes(q);
  });

  const toggle = (c: TargetCompany) =>
    setSelected(prev => {
      const next = { ...prev };
      if (next[c.id]) delete next[c.id];
      else next[c.id] = c;
      return next;
    });

  const selectedList = Object.values(selected);

  const switchMode = (m: Mode) => {
    setMode(m);
    setSelected({});
  };

  const runSearch = () => {
    if (!prompt.trim()) return;
    setSearching(true);
    setResults(null);
    setSelected({});
    window.setTimeout(() => {
      setResults(searchMasterRepository(prompt, [...onProject]));
      setSearching(false);
    }, 700);
  };

  // create
  const trimmed = name.trim();
  const duplicateOnProject = trimmed && onProject.has(trimmed.toLowerCase());
  const duplicateExisting = trimmed && !duplicateOnProject && findCompanyByName(trimmed);
  const restrictedHit = trimmed ? isRestricted(trimmed) : undefined;
  const canCreate = !!trimmed && !duplicateOnProject && !duplicateExisting && !restrictedHit;

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;
    const company: TargetCompany = {
      id: `new-${Date.now()}`,
      name: trimmed,
      industry,
      headquarters: headquarters.trim() || 'Not specified',
      size,
      revenue: 'Not specified',
      website: website.trim(),
      description: note.trim(),
      relevantCandidatesCount: 0,
      activeLeadershipChanges: 0,
      activeSearchesCount: 0,
      matchReason: note.trim() || 'Added by you for this search.',
      source: 'created',
    };
    registerCreatedCompany(company);
    onAdd([company]);
    onOpenChange(false);
  };

  const addSelected = () => {
    if (selectedList.length === 0) return;
    onAdd(selectedList);
    onOpenChange(false);
  };

  const companyRow = (c: TargetCompany, showReason: boolean) => {
    const restricted = isRestricted(c.name);
    const checked = !!selected[c.id];
    return (
      <li key={c.id}>
        <label
          className={cn(
            'flex items-start gap-3 p-3 rounded-xl border cursor-pointer mb-0',
            checked ? 'border-(--color-secondary-200) bg-(--bg-brand-secondary-subtle)' : 'border-(--border-light) hover:bg-(--bg-neutral-soft)',
            restricted && 'opacity-60 cursor-not-allowed'
          )}
        >
          <input
            type="checkbox"
            checked={checked}
            disabled={!!restricted}
            onChange={() => toggle(c)}
            className="mt-1 w-4 h-4 accent-(--color-secondary-200)"
          />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-(--text-strong)">{c.name}</span>
              {restricted && (
                <span className="phx-tag">
                  <Lock className="w-3.5 h-3.5" aria-hidden="true" /> Off-limits
                </span>
              )}
            </span>
            <span className="block text-sm text-(--text-default)">
              {c.industry} · {c.headquarters} · {c.size}
            </span>
            {showReason && c.matchReason && <span className="block text-sm text-(--text-strong) mt-1">{c.matchReason}</span>}
            {restricted && <span className="block text-sm text-(--text-default) mt-1">{restricted.reason}</span>}
          </span>
        </label>
      </li>
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-(--border-light) w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col z-50 animate-scaleIn">
          <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-(--border-light) shrink-0">
            <div>
              <Dialog.Title className="text-xl font-bold text-(--text-strong)">Add target companies</Dialog.Title>
              <Dialog.Description className="text-sm text-(--text-default) mt-1">
                Pick companies you already track, create a new one, or describe what you want and let the agent search the master repository.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" aria-label="Close">
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <div role="tablist" aria-label="How to add a company" className="flex border-b border-(--border-light) px-6 shrink-0">
            {MODES.map(m => {
              const Icon = m.icon;
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  id={`add-co-tab-${m.id}`}
                  aria-selected={active}
                  aria-controls="add-co-panel"
                  onClick={() => switchMode(m.id)}
                  className={cn(
                    'px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer -mb-px',
                    active
                      ? 'border-(--color-secondary-200) text-(--text-strong)'
                      : 'border-transparent text-(--text-default) hover:text-(--text-strong)'
                  )}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {m.label}
                </button>
              );
            })}
          </div>

          <div id="add-co-panel" role="tabpanel" aria-labelledby={`add-co-tab-${mode}`} className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
            {mode === 'existing' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-(--text-subtle) absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    type="search"
                    aria-label="Search existing companies"
                    placeholder="Search companies you already track"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full pl-9"
                  />
                </div>
                {existingShown.length === 0 ? (
                  <p className="text-sm text-(--text-default) py-6 text-center">
                    {existing.length === 0 ? 'Every company you track is already on this project.' : 'No companies match that search.'}
                  </p>
                ) : (
                  <ul className="space-y-2">{existingShown.map(c => companyRow(c, false))}</ul>
                )}
              </div>
            )}

            {mode === 'create' && (
              <form id="create-company-form" onSubmit={submitCreate} className="space-y-4">
                <div>
                  <label className="phx-label" htmlFor="new-co-name">Company name *</label>
                  <input id="new-co-name" type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full" autoComplete="off" />
                </div>
                {duplicateOnProject && (
                  <div className="phx-feedback" data-tone="warning" role="alert">{trimmed} is already a target company on this project.</div>
                )}
                {duplicateExisting && (
                  <div className="phx-feedback" data-tone="warning" role="alert">
                    {trimmed} already exists. Add it from Existing companies or Find with AI instead of creating a duplicate.
                  </div>
                )}
                {restrictedHit && (
                  <div className="phx-feedback" data-tone="error" role="alert">
                    {trimmed} is off-limits: {restrictedHit.reason}. It cannot be added to a search.
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="phx-label" htmlFor="new-co-website">Website</label>
                    <input id="new-co-website" type="text" placeholder="company.com" value={website} onChange={e => setWebsite(e.target.value)} className="w-full" />
                  </div>
                  <div>
                    <label className="phx-label" htmlFor="new-co-hq">Headquarters</label>
                    <input id="new-co-hq" type="text" placeholder="City, State" value={headquarters} onChange={e => setHeadquarters(e.target.value)} className="w-full" />
                  </div>
                  <div>
                    <label className="phx-label" htmlFor="new-co-industry">Industry</label>
                    <select id="new-co-industry" value={industry} onChange={e => setIndustry(e.target.value)} className="w-full">
                      {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="phx-label" htmlFor="new-co-size">Company size</label>
                    <select id="new-co-size" value={size} onChange={e => setSize(e.target.value)} className="w-full">
                      {SIZES.map(i => <option key={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="phx-label" htmlFor="new-co-note">Why it fits this search (optional)</label>
                  <textarea id="new-co-note" rows={3} value={note} onChange={e => setNote(e.target.value)} className="w-full" />
                </div>
              </form>
            )}

            {mode === 'ai' && (
              <div className="space-y-4">
                <div>
                  <label className="phx-label" htmlFor="ai-company-prompt">Describe the companies you want</label>
                  <textarea
                    id="ai-company-prompt"
                    rows={3}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) runSearch();
                    }}
                    placeholder="e.g. Pre-IPO fintech companies with leadership turnover"
                    className="w-full"
                  />
                  <div className="flex flex-wrap gap-2 mt-2" aria-label="Example prompts">
                    {EXAMPLE_PROMPTS.map(ex => (
                      <button key={ex} type="button" className="phx-btn" data-variant="tertiary" data-size="sm" onClick={() => setPrompt(ex)}>
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-(--text-default)">Searches {masterRepositorySize()} companies in the master repository.</span>
                  <button type="button" className="phx-btn" data-variant="primary" data-size="sm" onClick={runSearch} disabled={!prompt.trim() || searching}>
                    <Sparkles className="w-4 h-4" aria-hidden="true" /> {searching ? 'Searching…' : 'Find companies'}
                  </button>
                </div>

                <div aria-live="polite">
                  {searching && <p className="text-sm text-(--text-default) py-4 text-center">The agent is searching the master repository…</p>}
                  {results && results.length === 0 && (
                    <div className="phx-feedback" data-tone="info">
                      No companies matched that description. Try naming an industry, a company stage or a location.
                    </div>
                  )}
                  {results && results.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-(--text-strong)">
                        {results.length} match{results.length === 1 ? '' : 'es'} found
                      </p>
                      <ul className="space-y-2">{results.map(c => companyRow(c, true))}</ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-(--border-light) bg-(--bg-neutral-soft) shrink-0">
            <span className="text-sm text-(--text-default)">
              {mode === 'create' ? 'The new company is added to this project.' : `${selectedList.length} selected`}
            </span>
            <div className="flex items-center gap-3">
              <Dialog.Close asChild>
                <button type="button" className="phx-btn" data-variant="secondary" data-size="sm">Cancel</button>
              </Dialog.Close>
              {mode === 'create' ? (
                <button type="submit" form="create-company-form" className="phx-btn" data-variant="primary" data-size="sm" disabled={!canCreate}>
                  <Check className="w-4 h-4" aria-hidden="true" /> Create and add
                </button>
              ) : (
                <button type="button" className="phx-btn" data-variant="primary" data-size="sm" onClick={addSelected} disabled={selectedList.length === 0}>
                  <Check className="w-4 h-4" aria-hidden="true" /> Add {selectedList.length > 0 ? `${selectedList.length} ` : ''}to project
                </button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
