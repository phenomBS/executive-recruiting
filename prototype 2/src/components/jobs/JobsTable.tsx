import React, { useMemo, useState } from 'react';
import { Search, Filter, Briefcase, MapPin, User, Sparkles } from 'lucide-react';
import { RoleSuccessionItem } from '../../data/rolesSuccessionData';
import { cn } from '../../lib/utils';

type JobTab = 'all' | 'recommendations' | 'open' | 'vp' | 'executive' | 'fulltime' | 'contract';

function jobCode(id: string) {
  let n = 0;
  for (const ch of id) n = (n * 33 + ch.charCodeAt(0)) % 90000;
  return `P-${100000 + n}`;
}

export function JobsTable({
  jobs,
  onOpen,
  onCreate,
}: {
  jobs: RoleSuccessionItem[];
  onOpen: (id: string) => void;
  onCreate: () => void;
}) {
  const [activeTab, setActiveTab] = useState<JobTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [department, setDepartment] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const departments = useMemo(() => Array.from(new Set(jobs.map(job => job.department))), [jobs]);
  const recommended = jobs.filter(job => job.priorityLevel.startsWith('P0') || job.highFlightRiskCount > 0);

  const displayed = jobs.filter(job => {
    if (activeTab === 'recommendations' && !recommended.some(item => item.id === job.id)) return false;
    if (activeTab === 'open' && job.type !== 'active_requisition') return false;
    if (activeTab === 'vp' && job.level !== 'VP') return false;
    if (activeTab === 'executive' && job.level !== 'C-Suite' && job.level !== 'SVP') return false;
    if (activeTab === 'fulltime' && job.type !== 'active_requisition') return false;
    if (activeTab === 'contract' && job.type !== 'succession_bench') return false;
    if (department !== 'all' && job.department !== department) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      job.roleTitle.toLowerCase().includes(q) ||
      job.hiringManager.toLowerCase().includes(q) ||
      job.department.toLowerCase().includes(q) ||
      jobCode(job.id).toLowerCase().includes(q)
    );
  });

  const isAllSelected = displayed.length > 0 && displayed.every(job => selectedIds.includes(job.id));
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  const tabs: { id: JobTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Jobs', count: jobs.length },
    { id: 'recommendations', label: 'Recommendations', count: recommended.length },
    { id: 'open', label: 'Open Jobs', count: jobs.filter(job => job.type === 'active_requisition').length },
    { id: 'vp', label: 'VP Jobs', count: jobs.filter(job => job.level === 'VP').length },
    { id: 'executive', label: 'Executive Jobs', count: jobs.filter(job => job.level === 'C-Suite' || job.level === 'SVP').length },
    { id: 'fulltime', label: 'Full-Time', count: jobs.filter(job => job.type === 'active_requisition').length },
    { id: 'contract', label: 'Contract', count: jobs.filter(job => job.type === 'succession_bench').length },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-(--text-strong)">Jobs</h1>
          <p className="text-xs text-slate-500 mt-1">Executive and VP roles with live leads and hiring managers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, manager, category..."
              className="w-64 pl-9 pr-8 py-2 rounded-full border border-slate-300 text-sm focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200) transition-shadow bg-white text-slate-700 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setFiltersOpen(open => !open)}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-slate-300 text-(--color-secondary-200) font-semibold text-sm hover:bg-slate-50 bg-white transition-colors"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
            {filtersOpen && (
              <div className="absolute right-0 top-12 z-20 w-64 rounded-xl border border-slate-200 bg-white shadow-md p-3">
                <label className="text-xs font-semibold text-slate-500 block mb-1">Job category</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-700"
                >
                  <option value="all">All categories</option>
                  {departments.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="w-px h-6 bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={onCreate}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-slate-300 text-(--color-secondary-200) font-semibold text-sm hover:bg-slate-50 bg-white transition-colors cursor-pointer"
          >
            <span className="text-lg leading-none mb-[2px]">+</span> Create Job
          </button>
          <button
            type="button"
            className="p-2 text-slate-500 hover:text-slate-700 ml-1 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="More job actions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar bg-slate-50/50">
          <div className="flex whitespace-nowrap min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); setSelectedIds([]); }}
                className={cn(
                  "px-5 py-3 text-sm font-semibold border-r border-slate-200 transition-colors flex items-center gap-1.5",
                  activeTab === tab.id
                    ? tab.id === 'recommendations'
                      ? "bg-white text-(--color-secondary-200) border-b-2 border-b-(--color-secondary-200)"
                      : "bg-white text-slate-900 border-b-2 border-b-(--color-secondary-200)"
                    : "bg-transparent text-slate-600 hover:bg-slate-100 font-medium"
                )}
              >
                {tab.id === 'recommendations' && <Sparkles className="w-4 h-4 text-purple-600 fill-purple-100" />}
                {tab.label}
                {tab.id === 'recommendations' ? (
                  <span className={cn(
                    "px-1.5 py-0.2 rounded-full text-xs font-bold ml-1",
                    activeTab === 'recommendations' ? "bg-purple-100 text-purple-700" : "bg-purple-50 text-purple-600 border border-purple-200"
                  )}>
                    {tab.count}
                  </span>
                ) : (
                  <span className="text-slate-500 font-normal ml-1">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="bg-purple-50/80 border-b border-purple-200 px-6 py-2.5 flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900 bg-purple-200/70 px-2.5 py-1 rounded-md">
              {selectedIds.length} job{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <button type="button" onClick={() => setSelectedIds([])} className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1">
              Deselect All
            </button>
          </div>
        )}

        {activeTab === 'recommendations' && selectedIds.length === 0 && (
          <div className="bg-purple-50/50 border-b border-purple-100 px-6 py-2.5 flex items-center gap-2 text-xs text-purple-900">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>
              <strong>Aura Agent Recommendations:</strong> Critical executive and VP jobs with active mobility on the bench.
            </span>
          </div>
        )}

        <div className="flex-1 min-h-0 relative">
          <div className="absolute inset-0 overflow-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 z-10 shadow-2xs border-b border-slate-200">
                <tr>
                  <th className="w-12 px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={el => { if (el) el.indeterminate = isSomeSelected; }}
                      onChange={() => setSelectedIds(isAllSelected ? [] : displayed.map(job => job.id))}
                      aria-label="Select all jobs"
                      className="w-4 h-4 rounded border-slate-300 text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4">Job</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Days Open</th>
                  <th className="px-6 py-4">Leads</th>
                  <th className="px-6 py-4">Hiring Manager</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Type</th>
                  {activeTab === 'recommendations' && (
                    <>
                      <th className="px-6 py-4">Recommendation Reason</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === 'recommendations' ? 10 : 8} className="px-6 py-12 text-center text-slate-500 text-sm">
                      No jobs match the selected filters or search query.
                    </td>
                  </tr>
                ) : displayed.map(job => {
                  const isSelected = selectedIds.includes(job.id);
                  const place = job.candidates.find(candidate => candidate.location.includes(','))?.location || job.anchors.geographicFlexibility;
                  return (
                    <tr
                      key={job.id}
                      onClick={() => onOpen(job.id)}
                      className={cn(
                        "hover:bg-slate-50/80 cursor-pointer transition-colors group",
                        isSelected && "bg-purple-50/40"
                      )}
                    >
                      <td className="w-12 px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => setSelectedIds(prev => prev.includes(job.id) ? prev.filter(id => id !== job.id) : [...prev, job.id])}
                          aria-label={`Select ${job.roleTitle}`}
                          className="w-4 h-4 rounded border-slate-300 text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-(--color-secondary-200) shrink-0 ring-1 ring-slate-200">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.roleTitle}</span>
                            <div className="text-xs text-slate-500 font-medium truncate mt-0.5">{job.level} · {jobCode(job.id)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{place.split(',')[0]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={cn(
                          "px-2.5 py-1 text-xs font-bold rounded-md border inline-flex items-center justify-center",
                          job.daysOpenOrMonitored > 90
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        )}>
                          {job.daysOpenOrMonitored}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-md border inline-flex items-center justify-center min-w-[36px] bg-purple-50 text-purple-700 border-purple-200">
                          {job.candidates.length}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-700">
                        <div className="flex items-center gap-2 font-medium">
                          <User className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{job.hiringManager}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">{job.department}</td>
                      <td className="px-6 py-3.5 text-slate-600">{job.type === 'active_requisition' ? 'Full-Time' : 'Contract'}</td>
                      {activeTab === 'recommendations' && (
                        <>
                          <td className="px-6 py-3.5 text-xs max-w-sm truncate text-slate-600">
                            <div className="flex items-center gap-1.5" title={job.riskSummary}>
                              <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span className="truncate">{job.riskSummary}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => onOpen(job.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-(--color-secondary-200) text-(--color-secondary-200) hover:bg-(--color-secondary-200) hover:text-white text-xs font-semibold transition-colors shadow-2xs"
                            >
                              Open
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
