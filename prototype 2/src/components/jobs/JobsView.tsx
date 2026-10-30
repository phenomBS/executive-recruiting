import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Plus,
  Search,
  SlidersHorizontal,
  TriangleAlert,
} from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import {
  getSuccessionRecommendations,
  initialRolesSuccessionData,
  RoleSuccessionItem,
  ShadowBenchCandidate,
} from '../../data/rolesSuccessionData';
import { CreateRoleModal } from '../roles/CreateRoleModal';
import { JobsTable } from './JobsTable';
import { cn } from '../../lib/utils';
type DetailTab = 'leads' | 'applicants' | 'discovery' | 'screening' | 'assessments' | 'interviews' | 'description' | 'details' | 'analytics';
type LeadSlice = 'all' | 'ai' | 'approved' | 'company';
type StageKey = 'all' | 'Identified' | 'Calibrated' | 'Warm Outreach' | 'Ready to Engage';

const EXECUTIVE_LEVELS = new Set(['C-Suite', 'SVP', 'VP', 'Head of']);

function jobCode(id: string) {
  let n = 0;
  for (const ch of id) n = (n * 33 + ch.charCodeAt(0)) % 90000;
  return `P-${100000 + n}`;
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase() || '').join('');
}

function fitGrade(score: number) {
  if (score >= 93) return { letter: 'A', className: 'text-(--color-green-500) font-semibold' };
  if (score >= 85) return { letter: 'B', className: 'text-(--color-yellow-400) font-semibold' };
  return { letter: 'C', className: 'text-(--color-red-400) font-semibold' };
}

function hiringLabel(stage: ShadowBenchCandidate['stage']) {
  if (stage === 'Identified') return 'Lead (New Lead)';
  if (stage === 'Calibrated') return 'Lead (Screening)';
  if (stage === 'Warm Outreach') return 'Lead (Contacted)';
  return 'Lead (Invited to Apply)';
}

function stageFromLabel(label: string): ShadowBenchCandidate['stage'] {
  if (label.includes('Screening')) return 'Calibrated';
  if (label.includes('Contacted')) return 'Warm Outreach';
  if (label.includes('Invited')) return 'Ready to Engage';
  return 'Identified';
}

function isApplicant(candidate: ShadowBenchCandidate) {
  return candidate.stage === 'Warm Outreach' || candidate.stage === 'Ready to Engage';
}

export function JobsView() {
  const router = useRouter();
  const [jobs, setJobs] = useState<RoleSuccessionItem[]>(() =>
    initialRolesSuccessionData.filter(role => EXECUTIVE_LEVELS.has(role.level))
  );
  const [createOpen, setCreateOpen] = useState(false);
  const selected = jobs.find(role => role.id === router.roleId) || null;

  const updateJob = (next: RoleSuccessionItem) => {
    setJobs(prev => prev.map(job => job.id === next.id ? next : job));
  };

  if (selected) {
    const index = jobs.findIndex(job => job.id === selected.id);
    return (
      <JobDetail
        job={selected}
        onChange={updateJob}
        onBack={() => router.navigateToView('jobs')}
        onPrevious={index > 0 ? () => router.navigateToView('jobs', { roleId: jobs[index - 1].id }) : undefined}
        onNext={index < jobs.length - 1 ? () => router.navigateToView('jobs', { roleId: jobs[index + 1].id }) : undefined}
        onOpenBench={() => router.navigateToView('roles', { roleId: selected.id })}
      />
    );
  }

  return (
    <>
      <JobsTable
        jobs={jobs}
        onOpen={(id) => router.navigateToView('jobs', { roleId: id })}
        onCreate={() => setCreateOpen(true)}
      />
      <CreateRoleModal
        isOpen={createOpen}
        onOpenChange={setCreateOpen}
        defaultType="active_requisition"
        onCreateRole={(role) => {
          setJobs(prev => [role, ...prev]);
          router.navigateToView('jobs', { roleId: role.id });
        }}
      />
    </>
  );
}

function JobDetail({
  job,
  onChange,
  onBack,
  onPrevious,
  onNext,
  onOpenBench,
}: {
  job: RoleSuccessionItem;
  onChange: (job: RoleSuccessionItem) => void;
  onBack: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onOpenBench: () => void;
}) {
  const [tab, setTab] = useState<DetailTab>('leads');
  const [query, setQuery] = useState('');
  const [slice, setSlice] = useState<LeadSlice>('all');
  const [stage, setStage] = useState<StageKey>('all');
  const [checked, setChecked] = useState<string[]>([]);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', title: '', company: '' });

  const suggestions = getSuccessionRecommendations(job).filter(
    candidate => !job.candidates.some(existing => existing.id === candidate.id)
  );
  const leads = tab === 'discovery' ? suggestions : job.candidates;
  const applicants = job.candidates.filter(isApplicant);

  const stageCounts = {
    all: job.candidates.length,
    Identified: job.candidates.filter(c => c.stage === 'Identified').length,
    Calibrated: job.candidates.filter(c => c.stage === 'Calibrated').length,
    'Warm Outreach': job.candidates.filter(c => c.stage === 'Warm Outreach').length,
    'Ready to Engage': job.candidates.filter(c => c.stage === 'Ready to Engage').length,
  };

  const rows = leads.filter(candidate => {
    if (tab === 'applicants' && !isApplicant(candidate)) return false;
    if (tab === 'screening' && candidate.stage !== 'Calibrated') return false;
    if (tab === 'interviews' && candidate.stage !== 'Warm Outreach' && candidate.stage !== 'Ready to Engage') return false;
    if (stage !== 'all' && candidate.stage !== stage && tab === 'leads') return false;
    if (slice === 'ai' && candidate.emiScore < 90) return false;
    if (slice === 'approved' && candidate.stage !== 'Ready to Engage') return false;
    if (slice === 'company' && candidate.sfaScore < 93) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return candidate.name.toLowerCase().includes(q) || candidate.currentTitle.toLowerCase().includes(q) || candidate.company.toLowerCase().includes(q);
  });

  const updateStage = (id: string, next: ShadowBenchCandidate['stage']) => {
    onChange({
      ...job,
      candidates: job.candidates.map(candidate => candidate.id === id ? { ...candidate, stage: next } : candidate),
    });
  };

  const addCandidate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim()) return;
    const created: ShadowBenchCandidate = {
      id: `lead-${Date.now()}`,
      name: draft.name.trim(),
      currentTitle: draft.title.trim() || job.roleTitle,
      company: draft.company.trim() || 'Not specified',
      avatarUrl: '',
      location: job.anchors.geographicFlexibility,
      tenureInRole: '—',
      currentCompEst: '—',
      emiScore: 80,
      sfaScore: 80,
      cmaScore: 80,
      ptmScore: 70,
      ptmLevel: 'Medium',
      liveSignalAlert: {
        type: 'news_event',
        text: 'Added by recruiter',
        source: 'Recruiter',
        date: 'Today',
        severity: 'standard',
      },
      stage: 'Identified',
      benchReadiness: 'Ready in 3-6mo',
      sfaReason: 'Added from the job page.',
      cmaReason: 'Pending calibration.',
      ptmReason: 'Pending calibration.',
      notesCount: 0,
    };
    onChange({ ...job, candidates: [created, ...job.candidates] });
    setDraft({ name: '', title: '', company: '' });
    setAdding(false);
    setTab('leads');
  };

  const pipeline: { key: StageKey; label: string; value: number }[] = [
    { key: 'all', label: 'All Leads', value: stageCounts.all },
    { key: 'Identified', label: 'New Lead', value: stageCounts.Identified },
    { key: 'Warm Outreach', label: 'Contacted', value: stageCounts['Warm Outreach'] },
    { key: 'Calibrated', label: 'Screening', value: stageCounts.Calibrated },
    { key: 'Ready to Engage', label: 'Invited to Apply', value: stageCounts['Ready to Engage'] },
    { key: 'all', label: 'Rejected', value: 0 },
  ];

  const detailTabs: { id: DetailTab; label: string; badge?: string; warn?: boolean }[] = [
    { id: 'leads', label: 'Leads' },
    { id: 'applicants', label: 'Applicants' },
    { id: 'discovery', label: 'AI discovery', badge: suggestions.length > 0 ? String(suggestions.length) : undefined },
    { id: 'screening', label: 'Screening' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'interviews', label: 'Interviews' },
    { id: 'description', label: 'Description', warn: true },
    { id: 'details', label: 'Details' },
    { id: 'analytics', label: 'Analytics' },
  ];

  const showTable = tab === 'leads' || tab === 'applicants' || tab === 'discovery' || tab === 'screening' || tab === 'interviews';

  return (
    <div className="min-h-full bg-white flex flex-col">
      <div className="px-6 pt-4">
        <div className="flex items-center justify-between">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-[13px] text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Jobs
          </button>
          <div className="flex items-center gap-4 text-[13px]">
            <button type="button" onClick={onPrevious} disabled={!onPrevious} className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 disabled:opacity-40">
              <ArrowLeft className="w-3.5 h-3.5" /> Previous Job
            </button>
            <button type="button" onClick={onNext} disabled={!onNext} className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 disabled:opacity-40">
              Next Job <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[13px] font-medium text-(--color-green-500)">
                {job.type === 'active_requisition' ? 'Open 1/1' : 'Monitoring'}
              </span>
              <h1 className="text-[22px] font-semibold text-(--text-strong) leading-tight">{job.roleTitle}</h1>
              <span className="text-[16px] text-slate-400">| {jobCode(job.id)}</span>
            </div>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {job.candidates.find(candidate => candidate.location.includes(','))?.location || job.anchors.geographicFlexibility}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 rounded-full bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark) text-[11px] font-semibold inline-flex items-center justify-center">
              {initials(job.hiringManager)}
            </span>
            <button
              type="button"
              onClick={() => setAdding(open => !open)}
              className="h-9 px-3.5 rounded-full border border-(--color-secondary-100) bg-white text-[13px] font-medium text-(--color-secondary-200) inline-flex items-center gap-1.5 hover:bg-(--bg-brand-secondary-subtle)"
            >
              <Plus className="w-4 h-4" />
              Add Candidates
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setActionsOpen(open => !open)}
                className="h-9 px-3.5 rounded-full bg-(--color-primary-300) hover:bg-(--bg-brand-primary-default) text-white text-[13px] font-medium inline-flex items-center gap-1"
              >
                Actions
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {actionsOpen && (
                <div className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-slate-200 bg-white shadow-md py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActionsOpen(false);
                      onOpenBench();
                    }}
                    className="w-full px-3 py-2 text-left text-[13px] text-slate-700 hover:bg-slate-50"
                  >
                    Open shadow bench
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {adding && (
          <form onSubmit={addCandidate} className="mt-3 flex flex-wrap items-center gap-2">
            <input value={draft.name} onChange={(e) => setDraft(prev => ({ ...prev, name: e.target.value }))} placeholder="Name" className="h-9 px-3 rounded-lg border border-slate-200 text-[13px]" />
            <input value={draft.title} onChange={(e) => setDraft(prev => ({ ...prev, title: e.target.value }))} placeholder="Title" className="h-9 px-3 rounded-lg border border-slate-200 text-[13px]" />
            <input value={draft.company} onChange={(e) => setDraft(prev => ({ ...prev, company: e.target.value }))} placeholder="Company" className="h-9 px-3 rounded-lg border border-slate-200 text-[13px]" />
            <button type="submit" className="h-9 px-3 rounded-full bg-(--color-secondary-200) text-white text-[13px] font-medium">Add</button>
          </form>
        )}

        <div className="mt-4 flex items-end justify-between gap-4 border-b border-slate-200">
          <div className="flex items-end gap-5 overflow-x-auto">
            {detailTabs.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  'pb-2.5 text-[13px] whitespace-nowrap border-b-2 -mb-px inline-flex items-center gap-1',
                  tab === item.id
                    ? 'border-(--color-secondary-200) text-(--text-strong) font-medium'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}
              >
                {item.label}
                {item.badge && <span className="text-[11px] font-semibold text-rose-500">{item.badge}</span>}
                {item.warn && <TriangleAlert className="w-3.5 h-3.5 text-amber-500" />}
              </button>
            ))}
          </div>
          <p className="pb-2.5 text-[12px] text-slate-400 whitespace-nowrap">
            Visits 0 · Leads {job.candidates.length} · Applicants {applicants.length}
          </p>
        </div>
      </div>

      <div className="px-6 py-4 flex-1">
        {showTable && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border border-slate-200 rounded-md overflow-hidden">
              {pipeline.map((cell, index) => {
                const active = index === 0 ? stage === 'all' : stage === cell.key && cell.label !== 'Rejected';
                return (
                  <button
                    key={`${cell.label}-${index}`}
                    type="button"
                    onClick={() => {
                      if (cell.label === 'Rejected') return;
                      setStage(cell.key);
                      setTab('leads');
                    }}
                    className={cn(
                      'px-3 py-2.5 text-left border-r border-slate-200 last:border-r-0',
                      active ? 'bg-white border-t-2 border-t-(--color-green-500)' : 'bg-slate-50'
                    )}
                  >
                    <div className="text-[18px] font-semibold text-(--text-strong) leading-none">{cell.value}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{cell.label}</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Leads"
                  className="w-56 h-9 pl-9 pr-3 rounded-full border border-slate-200 text-[13px] focus:outline-none focus:border-(--color-secondary-200)"
                />
              </div>
              <span className="w-px h-6 bg-slate-200" />
              <button
                type="button"
                onClick={() => setSlice('ai')}
                className="h-9 px-3 rounded-full border border-slate-200 text-[13px] font-medium text-(--color-secondary-200) inline-flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filter
              </button>
            </div>

            <div className="mt-4 flex items-end gap-5 border-b border-slate-100">
              {([
                ['all', `All Leads ${job.candidates.length}`],
                ['ai', `Top A.I. Suggestions ${job.candidates.filter(c => c.emiScore >= 90).length}`],
                ['approved', `Manager Approved ${job.candidates.filter(c => c.stage === 'Ready to Engage').length}`],
                ['company', `Top Company (AI) ${job.candidates.filter(c => c.sfaScore >= 93).length}`],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSlice(id)}
                  className={cn(
                    'pb-2 text-[13px] border-b-2 -mb-px',
                    slice === id ? 'border-(--color-secondary-200) text-(--text-strong) font-medium' : 'border-transparent text-slate-500'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <table className="w-full text-left mt-1">
              <thead>
                <tr className="text-[12px] font-medium text-slate-500 border-b border-slate-100">
                  <th className="w-10 py-2 font-medium">
                    <input
                      type="checkbox"
                      checked={rows.length > 0 && rows.every(row => checked.includes(row.id))}
                      onChange={() => setChecked(rows.every(row => checked.includes(row.id)) ? [] : rows.map(row => row.id))}
                      className="w-3.5 h-3.5 accent-(--color-secondary-200)"
                      aria-label="Select all leads"
                    />
                  </th>
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Hiring Status</th>
                  <th className="py-2 font-medium">Fit</th>
                  <th className="py-2 font-medium">Email Address</th>
                  <th className="py-2 font-medium">Created Date</th>
                  <th className="py-2 font-medium">Profile Source</th>
                  <th className="py-2 font-medium">Lead Source</th>
                  <th className="py-2 font-medium">FDA Debarment Check</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(candidate => {
                  const fit = fitGrade(candidate.emiScore);
                  const onBench = job.candidates.some(existing => existing.id === candidate.id);
                  return (
                    <tr key={candidate.id} className="border-b border-slate-100">
                      <td className="py-3 align-top">
                        <input
                          type="checkbox"
                          checked={checked.includes(candidate.id)}
                          onChange={() => setChecked(prev => prev.includes(candidate.id) ? prev.filter(id => id !== candidate.id) : [...prev, candidate.id])}
                          className="w-3.5 h-3.5 mt-1 accent-(--color-secondary-200)"
                          aria-label={`Select ${candidate.name}`}
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark) text-[11px] font-semibold inline-flex items-center justify-center shrink-0">
                            {initials(candidate.name)}
                          </span>
                          <div>
                            <p className="text-[14px] font-medium text-(--color-secondary-200)">{candidate.name}</p>
                            <p className="text-[12px] text-slate-400">{candidate.currentTitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        {onBench ? (
                          <select
                            value={hiringLabel(candidate.stage)}
                            onChange={(e) => updateStage(candidate.id, stageFromLabel(e.target.value))}
                            className="bg-transparent text-[13px] text-slate-700 focus:outline-none"
                          >
                            <option>Lead (New Lead)</option>
                            <option>Lead (Screening)</option>
                            <option>Lead (Contacted)</option>
                            <option>Lead (Invited to Apply)</option>
                          </select>
                        ) : (
                          <span className="text-[13px] text-slate-500">Suggestion</span>
                        )}
                      </td>
                      <td className={cn('py-3 pr-3 text-[14px]', fit.className)}>{fit.letter}</td>
                      <td className="py-3 pr-3 text-[13px] text-slate-400">--</td>
                      <td className="py-3 pr-3 text-[13px] text-slate-600">{candidate.liveSignalAlert.date}</td>
                      <td className="py-3 pr-3 text-[13px] text-(--color-secondary-200)">1 Source</td>
                      <td className="py-3 pr-3 text-[13px] text-slate-600">{onBench ? 'Recruiter' : 'Aura'}</td>
                      <td className="py-3 text-[13px] text-slate-400">--</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {rows.length === 0 && (
              <p className="py-10 text-center text-[13px] text-slate-500">No leads in this view.</p>
            )}
            <div className="pt-3 flex items-center justify-between text-[12px] text-slate-500">
              <span>Showing {rows.length === 0 ? 0 : 1} - {rows.length} of {rows.length}</span>
              <span className="w-6 h-6 rounded-full bg-(--color-secondary-200) text-white inline-flex items-center justify-center text-[12px]">1</span>
            </div>
          </>
        )}

        {tab === 'assessments' && (
          <div className="divide-y divide-slate-100">
            {job.candidates.map(candidate => (
              <div key={candidate.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[14px] font-medium text-(--color-secondary-200)">{candidate.name}</p>
                  <p className="text-[12px] text-slate-500">{candidate.sfaReason}</p>
                </div>
                <p className="text-[13px] text-slate-600 whitespace-nowrap">EMI {candidate.emiScore} · SFA {candidate.sfaScore}% · CMA {candidate.cmaScore}%</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'description' && (
          <div className="max-w-3xl space-y-3 text-[14px] text-slate-700 leading-relaxed">
            <p>{job.description}</p>
            <p className="text-slate-500">{job.riskSummary}</p>
          </div>
        )}

        {tab === 'details' && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
            <DetailItem label="Hiring manager" value={`${job.hiringManager}, ${job.hiringManagerTitle}`} />
            <DetailItem label="Level" value={job.level} />
            <DetailItem label="Category" value={job.department} />
            <DetailItem label="Priority" value={job.priorityLevel} />
            <DetailItem label="Revenue scale" value={job.anchors.targetRevenueScale} />
            <DetailItem label="Headcount" value={job.anchors.targetHeadcountScope} />
            <DetailItem label="Location" value={job.anchors.geographicFlexibility} />
            <DetailItem label="Target date" value={job.targetDate} />
          </dl>
        )}

        {tab === 'analytics' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl">
            <DetailItem label="Leads" value={String(job.candidates.length)} />
            <DetailItem label="Applicants" value={String(applicants.length)} />
            <DetailItem label="Average EMI" value={String(job.avgEmiMatch)} />
            <DetailItem label="Bench ready" value={`${job.benchReadinessRate}%`} />
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 px-3 py-2.5">
      <dt className="text-[11px] text-slate-400">{label}</dt>
      <dd className="text-[14px] font-medium text-(--text-strong) mt-0.5">{value}</dd>
    </div>
  );
}
