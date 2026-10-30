import React, { useMemo, useState } from 'react';
import { Project } from '../types';
import { Search, Filter, FolderKanban, Calendar, User, Sparkles, CalendarPlus } from 'lucide-react';
import { cn } from '../lib/utils';
import { IntakeMeetingModal } from './IntakeMeetingModal';
import { ProjectParametersModal } from './ProjectParametersModal';

interface ProjectsListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onAddProject?: (project: Project) => void;
}

type ProjectTab = 'all' | 'recommendations' | 'open' | 'mine' | 'closed' | 'executive';

function projectCode(id: string) {
  const n = Number(id.replace(/\D/g, '')) || 1;
  return `Pr-${10220 + n}`;
}

function endDate(project: Project) {
  const raw = project.parameters?.targetStartDate;
  if (!raw) return '—';
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ProjectsList({ projects, onSelectProject, onAddProject }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ProjectTab>('all');
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [recruiterFilter, setRecruiterFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const recruiters = useMemo(
    () => Array.from(new Set(projects.map(project => project.leadRecruiter).filter(Boolean))),
    [projects]
  );

  const recommended = projects.filter(project => Boolean(project.nextAction));

  const displayed = projects.filter(project => {
    if (activeTab === 'recommendations' && !project.nextAction) return false;
    if (activeTab === 'open' && project.status !== 'Active') return false;
    if (activeTab === 'mine' && !(project.leadRecruiter === 'Brian Stepan' && project.status === 'Active')) return false;
    if (activeTab === 'closed' && project.status === 'Active') return false;
    if (activeTab === 'executive' && project.type !== 'Executive Search') return false;
    if (recruiterFilter !== 'all' && project.leadRecruiter !== recruiterFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(q) ||
      project.leadRecruiter.toLowerCase().includes(q) ||
      (project.stage || '').toLowerCase().includes(q) ||
      project.type.toLowerCase().includes(q) ||
      projectCode(project.id).toLowerCase().includes(q)
    );
  });

  const isAllSelected = displayed.length > 0 && displayed.every(project => selectedIds.includes(project.id));
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  const tabs: { id: ProjectTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Projects', count: projects.length },
    { id: 'recommendations', label: 'Recommendations', count: recommended.length },
    { id: 'open', label: 'Open Projects', count: projects.filter(p => p.status === 'Active').length },
    { id: 'mine', label: 'My Projects', count: projects.filter(p => p.leadRecruiter === 'Brian Stepan' && p.status === 'Active').length },
    { id: 'closed', label: 'Closed Projects', count: projects.filter(p => p.status !== 'Active').length },
    { id: 'executive', label: 'Executive Search', count: projects.filter(p => p.type === 'Executive Search').length },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full h-full flex flex-col relative">
      <ProjectParametersModal
        isOpen={showNewProjectModal}
        onOpenChange={setShowNewProjectModal}
        onSave={(newProj) => {
          if (onAddProject) onAddProject(newProj);
        }}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-(--text-strong)">Projects</h1>
          <p className="text-xs text-slate-500 mt-1">Executive search mandates, pipelines, and ownership</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, recruiter, stage..."
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
              <div className="absolute right-0 top-12 z-20 w-56 rounded-xl border border-slate-200 bg-white shadow-md p-3">
                <label className="text-xs font-semibold text-slate-500 block mb-1">Assigned to</label>
                <select
                  value={recruiterFilter}
                  onChange={(e) => setRecruiterFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-700"
                >
                  <option value="all">Anyone</option>
                  {recruiters.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="w-px h-6 bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-slate-300 text-(--color-secondary-200) font-semibold text-sm hover:bg-slate-50 bg-white transition-colors cursor-pointer"
          >
            <span className="text-lg leading-none mb-[2px]">+</span> Create New Project
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(open => !open)}
              className="p-2 text-slate-500 hover:text-slate-700 ml-1 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="More project actions"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 z-20 w-56 rounded-xl border border-slate-200 bg-white shadow-md py-1">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowIntakeModal(true);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4 text-slate-400" />
                  Schedule intake meeting
                </button>
              </div>
            )}
          </div>
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
              {selectedIds.length} project{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1"
            >
              Deselect All
            </button>
          </div>
        )}

        {activeTab === 'recommendations' && selectedIds.length === 0 && (
          <div className="bg-purple-50/50 border-b border-purple-100 px-6 py-2.5 flex items-center gap-2 text-xs text-purple-900">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>
              <strong>Aura Agent Recommendations:</strong> Projects with a suggested next step. Open one to continue the mandate.
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
                      onChange={() => setSelectedIds(isAllSelected ? [] : displayed.map(project => project.id))}
                      aria-label="Select all projects"
                      className="w-4 h-4 rounded border-slate-300 text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Project id</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Leads</th>
                  <th className="px-6 py-4">Assigned To</th>
                  <th className="px-6 py-4">Target Date</th>
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
                    <td colSpan={activeTab === 'recommendations' ? 9 : 7} className="px-6 py-12 text-center text-slate-500 text-sm">
                      No projects match the selected filters or search query.
                    </td>
                  </tr>
                ) : displayed.map(project => {
                  const isSelected = selectedIds.includes(project.id);
                  return (
                    <tr
                      key={project.id}
                      onClick={() => onSelectProject(project)}
                      className={cn(
                        "hover:bg-slate-50/80 cursor-pointer transition-colors group",
                        isSelected && "bg-purple-50/40"
                      )}
                    >
                      <td className="w-12 px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => setSelectedIds(prev => prev.includes(project.id) ? prev.filter(id => id !== project.id) : [...prev, project.id])}
                          aria-label={`Select ${project.title}`}
                          className="w-4 h-4 rounded border-slate-300 text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-(--color-secondary-200) shrink-0 ring-1 ring-slate-200">
                            <FolderKanban className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{project.title}</span>
                            <div className="text-xs text-slate-500 font-medium truncate mt-0.5">{project.stage || project.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">{projectCode(project.id)}</td>
                      <td className="px-6 py-3.5">
                        <span className={cn(
                          "px-2.5 py-1 text-xs font-bold rounded-md border inline-flex items-center justify-center",
                          project.status === 'Active'
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        )}>
                          {project.status === 'Active' ? 'Open' : project.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-md border inline-flex items-center justify-center min-w-[36px] bg-purple-50 text-purple-700 border-purple-200">
                          {project.candidatesCount ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-700">
                        <div className="flex items-center gap-2 font-medium">
                          <User className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{project.leadRecruiter}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {endDate(project)}
                        </div>
                      </td>
                      {activeTab === 'recommendations' && (
                        <>
                          <td className="px-6 py-3.5 text-xs max-w-sm truncate text-slate-600">
                            <div className="flex items-center gap-1.5" title={project.nextAction?.action}>
                              <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span className="truncate">{project.nextAction?.action}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => onSelectProject(project)}
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

      {showIntakeModal && <IntakeMeetingModal onClose={() => setShowIntakeModal(false)} />}
    </div>
  );
}
