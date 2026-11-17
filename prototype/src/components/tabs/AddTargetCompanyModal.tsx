import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Building2, Check, Lock, Search, Sparkles, X } from 'lucide-react';
import { useRestricted } from '../../context/RestrictedContext';
import type { Project } from '../../types';
import { mockCandidates } from '../../data/mockData';
import {
  TargetCompany,
  findCompanyByName,
  companyLists,
  listExistingCompanies,
  masterRepositorySize,
  recommendCompaniesForProject,
  registerCreatedCompany,
  searchMasterRepository,
} from '../../data/projectTargetCompanies';
import { cn } from '../../lib/utils';

type Mode = 'mine' | 'recommended' | 'ai' | 'create';

const MODES: { id: Exclude<Mode, 'create'>; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'mine', icon: Building2 },
  { id: 'recommended', icon: Sparkles },
  { id: 'ai', icon: Sparkles },
];

export interface PickedCandidate {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  location: string;
  reason?: string;
}

type Subject = 'companies' | 'candidates';

function candidatePick(c: (typeof mockCandidates)[number], reason?: string): PickedCandidate {
  return {
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    role: c.role,
    company: c.company,
    location: c.location,
    reason,
  };
}

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
  project: Project;
  /** Names already on the project, shown in the list and not offered again */
  projectCompanyNames: string[];
  /** Candidate names already on the project or market map */
  projectCandidateNames?: string[];
  onAdd: (companies: TargetCompany[]) => void;
  onAddCandidates?: (candidates: PickedCandidate[]) => void;
}

export function AddTargetCompanyModal({ isOpen, onOpenChange, project, projectCompanyNames, projectCandidateNames = [], onAdd, onAddCandidates }: AddTargetCompanyModalProps) {
  const { restrictedCompanies } = useRestricted();
  const [subject, setSubject] = useState<Subject>('companies');
  const [mode, setMode] = useState<Mode>('mine');

  // shared selection (by company id) for the two list modes
  const [selected, setSelected] = useState<Record<string, TargetCompany>>({});
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, PickedCandidate>>({});

  // existing
  const [query, setQuery] = useState('');
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);

  // create
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [headquarters, setHeadquarters] = useState('');
  const [size, setSize] = useState(SIZES[2]);
  const [note, setNote] = useState('');
  const [candidateFirst, setCandidateFirst] = useState('');
  const [candidateLast, setCandidateLast] = useState('');
  const [candidateRole, setCandidateRole] = useState('');
  const [candidateCompany, setCandidateCompany] = useState('');

  // ai
  const [prompt, setPrompt] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<TargetCompany[] | null>(null);
  const [candidateHits, setCandidateHits] = useState<PickedCandidate[] | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSubject('companies');
    setMode('mine');
    setSelected({});
    setSelectedCandidates({});
    setCandidateFirst('');
    setCandidateLast('');
    setCandidateRole('');
    setCandidateCompany('');
    setQuery('');
    setSelectedListIds([]);
    setName('');
    setWebsite('');
    setIndustry(INDUSTRIES[0]);
    setHeadquarters('');
    setSize(SIZES[2]);
    setNote('');
    setPrompt('');
    setSearching(false);
    setResults(null);
    setCandidateHits(null);
  }, [isOpen]);

  const onProject = useMemo(() => new Set(projectCompanyNames.map(n => n.toLowerCase())), [projectCompanyNames]);
  const isRestricted = (n: string) => restrictedCompanies.find(r => r.name.toLowerCase() === n.toLowerCase());

  const existing = useMemo(() => (isOpen ? listExistingCompanies() : []), [isOpen]);
  const lists = useMemo(() => (isOpen ? companyLists() : []), [isOpen]);
  const listsShown = lists.filter(list => {
    const q = query.trim().toLowerCase();
    return !q || `${list.name} ${list.detail}`.toLowerCase().includes(q);
  });
  const companiesFromLists = useMemo(() => {
    const seen = new Set<string>();
    const picked: TargetCompany[] = [];
    lists.filter(list => selectedListIds.includes(list.id)).forEach(list => {
      list.companies.forEach(company => {
        const key = company.name.toLowerCase();
        if (seen.has(key) || onProject.has(key)) return;
        seen.add(key);
        picked.push(company);
      });
    });
    return picked;
  }, [lists, selectedListIds, onProject]);
  const recommended = useMemo(
    () => (isOpen ? recommendCompaniesForProject(project, projectCompanyNames) : []).filter(c => !onProject.has(c.name.toLowerCase())),
    [isOpen, project, projectCompanyNames, onProject]
  );
  const toggle = (c: TargetCompany) => {
    if (onProject.has(c.name.toLowerCase())) return;
    setSelected(prev => {
      const next = { ...prev };
      if (next[c.id]) delete next[c.id];
      else next[c.id] = c;
      return next;
    });
  };

  const toggleCandidate = (c: PickedCandidate) => {
    if (onCandidates.has(`${c.firstName} ${c.lastName}`.toLowerCase())) return;
    setSelectedCandidates(prev => {
      const next = { ...prev };
      if (next[c.id]) delete next[c.id];
      else next[c.id] = c;
      return next;
    });
  };

  const selectedList = Object.values(selected).filter(c => !onProject.has(c.name.toLowerCase()));
  const onCandidates = useMemo(() => new Set(projectCandidateNames.map(n => n.toLowerCase())), [projectCandidateNames]);
  const myCandidates = useMemo(() => (isOpen ? mockCandidates.map(c => candidatePick(c)) : []), [isOpen]);
  const recommendedCandidates = useMemo(() => {
    if (!isOpen) return [];
    const words = `${project.title} ${project.parameters?.primaryTitle || ''} ${project.parameters?.functionalDomain || ''}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(word => word.length > 3);
    return mockCandidates
      .map(c => {
        const hay = `${c.role} ${c.company} ${c.executiveData.function} ${c.executiveData.areasOfExpertise}`.toLowerCase();
        const hits = words.filter(word => hay.includes(word));
        return { c, hits };
      })
      .filter(item => item.hits.length > 0)
      .sort((a, b) => b.hits.length - a.hits.length || b.c.emiScore - a.c.emiScore)
      .slice(0, 6)
      .map(item => candidatePick(item.c, `Matches ${item.hits.slice(0, 2).join(' and ')}`));
  }, [isOpen, project]);
  const selectedCandidateList = Object.values(selectedCandidates).filter(c => !onCandidates.has(`${c.firstName} ${c.lastName}`.toLowerCase()));
  const modeLabel = (id: Exclude<Mode, 'create'>) => {
    if (id === 'ai') return 'Find with AI';
    if (id === 'mine') return subject === 'companies' ? 'My target companies' : 'My target candidates';
    return subject === 'companies' ? 'Recommended companies' : 'Recommended candidates';
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setSelected({});
    setSelectedCandidates({});
    setSelectedListIds([]);
  };

  const switchSubject = (next: Subject) => {
    setSubject(next);
    setMode('mine');
    setSelected({});
    setSelectedCandidates({});
    setResults(null);
    setCandidateHits(null);
  };

  const runSearch = () => {
    if (!prompt.trim()) return;
    setSearching(true);
    setResults(null);
    setCandidateHits(null);
    setSelected({});
    setSelectedCandidates({});
    window.setTimeout(() => {
      if (subject === 'companies') {
        setResults(searchMasterRepository(prompt, [...onProject]));
      } else {
        const words = prompt.toLowerCase().split(/[^a-z0-9]+/).filter(word => word.length > 2);
        setCandidateHits(
          mockCandidates
            .map(c => candidatePick(c))
            .filter(c => {
              const hay = `${c.firstName} ${c.lastName} ${c.role} ${c.company} ${c.location}`.toLowerCase();
              return words.some(word => hay.includes(word));
            })
        );
      }
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

  const addSelectedCandidates = () => {
    if (selectedCandidateList.length === 0) return;
    onAddCandidates?.(selectedCandidateList);
    onOpenChange(false);
  };

  const canCreateCandidate = candidateFirst.trim().length > 0 && candidateLast.trim().length > 0 && candidateRole.trim().length > 0;

  const submitCandidate = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canCreateCandidate) return;
    onAddCandidates?.([{
      id: `new-cand-${Date.now()}`,
      firstName: candidateFirst.trim(),
      lastName: candidateLast.trim(),
      role: candidateRole.trim(),
      company: candidateCompany.trim() || 'Not specified',
      location: 'Not specified',
      reason: 'Added by you for this search.',
    }]);
    onOpenChange(false);
  };

  const candidateRow = (c: PickedCandidate) => {
    const label = `${c.firstName} ${c.lastName}`;
    const already = onCandidates.has(label.toLowerCase());
    const checked = !!selectedCandidates[c.id];
    return (
      <li key={c.id}>
        <label
          className={cn(
            'flex items-start gap-3 p-3 rounded-xl border cursor-pointer mb-0',
            checked ? 'border-(--color-secondary-200) bg-(--bg-brand-secondary-subtle)' : 'border-(--border-light) hover:bg-(--bg-neutral-soft)',
            already && 'opacity-60 cursor-not-allowed'
          )}
        >
          <input
            type="checkbox"
            checked={checked || already}
            disabled={already}
            onChange={() => toggleCandidate(c)}
            className="mt-1 w-4 h-4 accent-(--color-secondary-200)"
          />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-(--text-strong)">{label}</span>
              {already && <span className="phx-tag">On this search</span>}
            </span>
            <span className="block text-sm text-(--text-default)">{c.role} · {c.company}</span>
            {c.reason && <span className="block text-sm text-(--text-strong) mt-1">{c.reason}</span>}
          </span>
        </label>
      </li>
    );
  };

  const companyRow = (c: TargetCompany, showReason: boolean) => {
    const restricted = isRestricted(c.name);
    const already = onProject.has(c.name.toLowerCase());
    const checked = !!selected[c.id];
    return (
      <li key={c.id}>
        <label
          className={cn(
            'flex items-start gap-3 p-3 rounded-xl border cursor-pointer mb-0',
            checked ? 'border-(--color-secondary-200) bg-(--bg-brand-secondary-subtle)' : 'border-(--border-light) hover:bg-(--bg-neutral-soft)',
            (restricted || already) && 'opacity-60 cursor-not-allowed'
          )}
        >
          <input
            type="checkbox"
            checked={checked || already}
            disabled={!!restricted || already}
            onChange={() => toggle(c)}
            className="mt-1 w-4 h-4 accent-(--color-secondary-200)"
          />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-(--text-strong)">{c.name}</span>
              {already && <span className="phx-tag">On this search</span>}
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
              <Dialog.Title className="m-0! text-xl! font-bold text-(--text-strong)">Add companies or candidates</Dialog.Title>
              <Dialog.Description className="text-sm text-(--text-default) m-0! mt-1!">
                My target companies is the lists saved on the Companies tab. The same choices are available for candidates.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" aria-label="Close">
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <div role="tablist" aria-label="Companies or candidates" className="px-6 shrink-0">
            <button type="button" role="tab" aria-selected={subject === 'companies'} onClick={() => switchSubject('companies')}>Companies</button>
            <button type="button" role="tab" aria-selected={subject === 'candidates'} onClick={() => switchSubject('candidates')}>Candidates</button>
          </div>

          <div role="tablist" aria-label="How to add" className="flex items-center border-b border-(--border-light) px-6 shrink-0">
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
                  {modeLabel(m.id)}
                </button>
              );
            })}
            <button
              type="button"
              aria-pressed={mode === 'create'}
              onClick={() => switchMode('create')}
              className="ml-auto bg-transparent border-0 cursor-pointer text-sm"
              style={{ color: 'var(--text-subtle)', fontWeight: 400, textDecoration: mode === 'create' ? 'underline' : 'none', padding: '12px 0' }}
            >
              Create new
            </button>
          </div>

          <div id="add-co-panel" role="tabpanel" aria-labelledby={`add-co-tab-${mode}`} className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
            {mode === 'mine' && subject === 'candidates' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-(--text-subtle) absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    type="search"
                    aria-label="Search target candidates"
                    placeholder="Search candidates you already track"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full pl-9"
                  />
                </div>
                <ul className="space-y-2">
                  {myCandidates
                    .filter(c => {
                      const q = query.trim().toLowerCase();
                      return !q || `${c.firstName} ${c.lastName} ${c.role} ${c.company}`.toLowerCase().includes(q);
                    })
                    .map(candidateRow)}
                </ul>
              </div>
            )}

            {mode === 'mine' && subject === 'companies' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-(--text-subtle) absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    type="search"
                    aria-label="Search company lists"
                    placeholder="Search company lists"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full pl-9"
                  />
                </div>
                {listsShown.length === 0 ? (
                  <p className="text-sm text-(--text-default) py-6 text-center">No lists match that search.</p>
                ) : (
                  <ul className="space-y-2">
                    {listsShown.map(list => {
                      const fresh = list.companies.filter(company => !onProject.has(company.name.toLowerCase()));
                      const onSearch = fresh.length === 0;
                      const checked = selectedListIds.includes(list.id);
                      return (
                        <li key={list.id}>
                          <label className={cn('flex items-start gap-3 rounded-xl border border-(--border-light) p-3', onSearch ? 'opacity-60' : 'cursor-pointer')}>
                            <input
                              type="checkbox"
                              className="mt-1 w-4 h-4 accent-(--color-secondary-200)"
                              checked={checked || onSearch}
                              disabled={onSearch}
                              aria-label={`Select ${list.name}`}
                              onChange={() => {
                                setSelectedListIds(prev => prev.includes(list.id) ? prev.filter(id => id !== list.id) : [...prev, list.id]);
                              }}
                            />
                            <span className="min-w-0">
                              <span className="flex items-center gap-2 text-sm font-semibold text-(--text-strong)">
                                {list.name}
                                <span className="phx-tag">{list.companies.length}</span>
                                {onSearch && <span className="phx-tag">On this search</span>}
                              </span>
                              <span className="block text-sm text-(--text-default) mt-1">{list.detail}</span>
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            {mode === 'recommended' && subject === 'candidates' && (
              <ul className="space-y-2">
                {recommendedCandidates.length === 0 ? (
                  <li className="text-sm text-(--text-default) py-6 text-center">No recommended candidates for this search yet.</li>
                ) : recommendedCandidates.map(candidateRow)}
              </ul>
            )}

            {mode === 'recommended' && subject === 'companies' && (
              <div className="space-y-3">
                {recommended.length === 0 ? (
                  <p className="text-sm text-(--text-default) py-6 text-center">
                    Every recommended company is already on this project.
                  </p>
                ) : (
                  <ul className="space-y-2">{recommended.map(c => companyRow(c, true))}</ul>
                )}
              </div>
            )}

            {mode === 'create' && subject === 'candidates' && (
              <form id="create-candidate-form" onSubmit={submitCandidate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="phx-label" htmlFor="new-cand-first">First name *</label>
                    <input id="new-cand-first" value={candidateFirst} onChange={e => setCandidateFirst(e.target.value)} className="w-full" autoComplete="off" />
                  </div>
                  <div>
                    <label className="phx-label" htmlFor="new-cand-last">Last name *</label>
                    <input id="new-cand-last" value={candidateLast} onChange={e => setCandidateLast(e.target.value)} className="w-full" autoComplete="off" />
                  </div>
                  <div>
                    <label className="phx-label" htmlFor="new-cand-role">Current title *</label>
                    <input id="new-cand-role" value={candidateRole} onChange={e => setCandidateRole(e.target.value)} className="w-full" />
                  </div>
                  <div>
                    <label className="phx-label" htmlFor="new-cand-co">Current company</label>
                    <input id="new-cand-co" value={candidateCompany} onChange={e => setCandidateCompany(e.target.value)} className="w-full" />
                  </div>
                </div>
              </form>
            )}

            {mode === 'create' && subject === 'companies' && (
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
                    {trimmed} already exists. Add it from My target companies or Find with AI instead of creating a duplicate.
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
                  <label className="phx-label" htmlFor="ai-company-prompt">{subject === 'companies' ? 'Describe the companies you want' : 'Describe the candidates you want'}</label>
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
                  <span className="text-sm text-(--text-default)">
                    {subject === 'companies'
                      ? `Searches ${masterRepositorySize()} companies in the master repository.`
                      : `Searches ${mockCandidates.length} candidates you already track.`}
                  </span>
                  <button type="button" className="phx-btn" data-variant="primary" data-size="sm" onClick={runSearch} disabled={!prompt.trim() || searching}>
                    <Sparkles className="w-4 h-4" aria-hidden="true" /> {searching ? 'Searching…' : subject === 'companies' ? 'Find companies' : 'Find candidates'}
                  </button>
                </div>

                <div aria-live="polite">
                  {searching && <p className="text-sm text-(--text-default) py-4 text-center">The agent is searching the master repository…</p>}
                  {subject === 'companies' && results && results.length === 0 && (
                    <div className="phx-feedback" data-tone="info">
                      No companies matched that description. Try naming an industry, a company stage or a location.
                    </div>
                  )}
                  {subject === 'candidates' && candidateHits && candidateHits.length === 0 && (
                    <div className="phx-feedback" data-tone="info">
                      No candidates matched that description. Try a title, a company, or a location.
                    </div>
                  )}
                  {subject === 'candidates' && candidateHits && candidateHits.length > 0 && (
                    <ul className="space-y-2">{candidateHits.map(candidateRow)}</ul>
                  )}
                  {subject === 'companies' && results && results.length > 0 && (
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
              {mode === 'create'
                ? subject === 'companies' ? 'The new company is added to this project.' : 'The new candidate is added to this project.'
                : `${subject === 'candidates' ? selectedCandidateList.length : mode === 'mine' ? companiesFromLists.length : selectedList.length} selected`}
            </span>
            <div className="flex items-center gap-3">
              <Dialog.Close asChild>
                <button type="button" className="phx-btn" data-variant="secondary" data-size="sm">Cancel</button>
              </Dialog.Close>
              {mode === 'create' ? (
                subject === 'candidates' ? (
                  <button type="submit" form="create-candidate-form" className="phx-btn" data-variant="primary" data-size="sm" disabled={!canCreateCandidate}>
                    <Check className="w-4 h-4" aria-hidden="true" /> Create and add
                  </button>
                ) : (
                  <button type="submit" form="create-company-form" className="phx-btn" data-variant="primary" data-size="sm" disabled={!canCreate}>
                    <Check className="w-4 h-4" aria-hidden="true" /> Create and add
                  </button>
                )
              ) : (
                <button
                  type="button"
                  className="phx-btn"
                  data-variant="primary"
                  data-size="sm"
                  onClick={subject === 'candidates' ? addSelectedCandidates : mode === 'mine' ? () => { if (companiesFromLists.length) { onAdd(companiesFromLists); onOpenChange(false); } } : addSelected}
                  disabled={subject === 'candidates' ? selectedCandidateList.length === 0 : (mode === 'mine' ? companiesFromLists.length === 0 : selectedList.length === 0)}
                >
                  <Check className="w-4 h-4" aria-hidden="true" /> Add {(subject === 'candidates' ? selectedCandidateList.length : mode === 'mine' ? companiesFromLists.length : selectedList.length) || ''} to project
                </button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
