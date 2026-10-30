import React, { useState, useMemo } from 'react';
import { Project } from '../../types';
import { 
  getRecommendationsForProject, 
  ProjectExecutiveRecommendation, 
  ProjectCompanyRecommendation 
} from '../../data/projectRecommendationsData';
import { 
  Sparkles, 
  Users, 
  Building2, 
  Search, 
  Filter, 
  Check, 
  UserPlus, 
  PlusCircle, 
  Flame, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  ShieldAlert, 
  ArrowUpRight, 
  TrendingUp, 
  CheckSquare, 
  Square, 
  X, 
  SlidersHorizontal,
  ChevronRight,
  Info,
  Clock,
  ExternalLink,
  Target
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useRestricted } from '../../context/RestrictedContext';

interface ProjectRecommendationsTabProps {
  project: Project;
  onCandidateAdded?: (candidate: ProjectExecutiveRecommendation) => void;
  onCompanyAdded?: (company: ProjectCompanyRecommendation) => void;
}

export function ProjectRecommendationsTab({ 
  project, 
  onCandidateAdded, 
  onCompanyAdded 
}: ProjectRecommendationsTabProps) {
  const { restrictedCompanies } = useRestricted();
  
  // Get recommendations computed from master graph for this project
  const initialData = useMemo(() => getRecommendationsForProject(project), [project]);

  // Local state for tracking added status and bulk actions
  const [executivesList, setExecutivesList] = useState<ProjectExecutiveRecommendation[]>(initialData.executives);
  const [companiesList, setCompaniesList] = useState<ProjectCompanyRecommendation[]>(initialData.companies);
  const [pipelinedExecIds, setPipelinedExecIds] = useState<Set<string>>(new Set());
  const [mappedCompanyIds, setMappedCompanyIds] = useState<Set<string>>(new Set());
  
  // Selection state for bulk operations
  const [selectedExecIds, setSelectedExecIds] = useState<Set<string>>(new Set());
  const [selectedCompIds, setSelectedCompIds] = useState<Set<string>>(new Set());

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'executives' | 'companies'>('all');
  const [minFitScore, setMinFitScore] = useState<number>(0); // 0 = all, 95 = top fit
  const [mobilityOnly, setMobilityOnly] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isCompanyRestricted = (name: string) => {
    return restrictedCompanies.some(rc => rc.name.trim().toLowerCase() === name.trim().toLowerCase());
  };

  // Filtered lists
  const filteredExecutives = useMemo(() => {
    return executivesList.filter(exec => {
      if (isCompanyRestricted(exec.company)) return false;
      if (minFitScore > 0 && exec.matchScore < minFitScore) return false;
      if (mobilityOnly && !exec.mobilitySignal.toLowerCase().includes('high') && !exec.mobilitySignal.includes('9')) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = exec.name.toLowerCase().includes(q);
        const matchesRole = exec.role.toLowerCase().includes(q);
        const matchesComp = exec.company.toLowerCase().includes(q);
        const matchesLoc = exec.location.toLowerCase().includes(q);
        const matchesRationale = exec.fitRationale.toLowerCase().includes(q);
        if (!matchesName && !matchesRole && !matchesComp && !matchesLoc && !matchesRationale) return false;
      }
      return true;
    });
  }, [executivesList, minFitScore, mobilityOnly, searchQuery, restrictedCompanies]);

  const filteredCompanies = useMemo(() => {
    return companiesList.filter(comp => {
      if (isCompanyRestricted(comp.name)) return false;
      if (minFitScore > 0 && comp.matchScore < minFitScore) return false;
      if (mobilityOnly && !comp.mobilitySignal.toLowerCase().includes('high') && !comp.mobilitySignal.includes('9')) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = comp.name.toLowerCase().includes(q);
        const matchesInd = comp.industry.toLowerCase().includes(q);
        const matchesHQ = comp.headquarters.toLowerCase().includes(q);
        const matchesRationale = comp.fitRationale.toLowerCase().includes(q);
        if (!matchesName && !matchesInd && !matchesHQ && !matchesRationale) return false;
      }
      return true;
    });
  }, [companiesList, minFitScore, mobilityOnly, searchQuery, restrictedCompanies]);

  // Handlers for single adds
  const handleAddExecutiveToPipeline = (exec: ProjectExecutiveRecommendation, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPipelinedExecIds(prev => new Set(prev).add(exec.id));
    if (onCandidateAdded) onCandidateAdded(exec);
    showToast(`Added ${exec.name} (${exec.role} at ${exec.company}) to Project Candidate Pipeline!`);
  };

  const handleAddCompanyToMarketMap = (comp: ProjectCompanyRecommendation, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMappedCompanyIds(prev => new Set(prev).add(comp.id));
    if (onCompanyAdded) onCompanyAdded(comp);
    showToast(`Added ${comp.name} to Project Market Map targets!`);
  };

  // Toggle selection
  const toggleSelectExec = (id: string) => {
    setSelectedExecIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectComp = (id: string) => {
    setSelectedCompIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Bulk actions
  const totalSelectedCount = selectedExecIds.size + selectedCompIds.size;

  const handleBulkAddToProject = () => {
    if (selectedExecIds.size > 0) {
      setPipelinedExecIds(prev => {
        const next = new Set(prev);
        selectedExecIds.forEach(id => next.add(id));
        return next;
      });
    }
    if (selectedCompIds.size > 0) {
      setMappedCompanyIds(prev => {
        const next = new Set(prev);
        selectedCompIds.forEach(id => next.add(id));
        return next;
      });
    }

    const execCount = selectedExecIds.size;
    const compCount = selectedCompIds.size;
    setSelectedExecIds(new Set());
    setSelectedCompIds(new Set());

    showToast(`Successfully added ${execCount} executive${execCount === 1 ? '' : 's'} and ${compCount} target compan${compCount === 1 ? 'y' : 'ies'} to project!`);
  };

  const handleSelectAllVisible = () => {
    if (activeFilter === 'all' || activeFilter === 'executives') {
      const allExecIds = new Set(filteredExecutives.map(e => e.id));
      setSelectedExecIds(allExecIds);
    }
    if (activeFilter === 'all' || activeFilter === 'companies') {
      const allCompIds = new Set(filteredCompanies.map(c => c.id));
      setSelectedCompIds(allCompIds);
    }
  };

  const handleClearSelection = () => {
    setSelectedExecIds(new Set());
    setSelectedCompIds(new Set());
  };

  const totalVisibleCount = (activeFilter === 'all' ? filteredExecutives.length + filteredCompanies.length : activeFilter === 'executives' ? filteredExecutives.length : filteredCompanies.length);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-28 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-8 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slideUp">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Intelligence Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl p-6 lg:p-8 text-white shadow-xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Master Graph AI Match Engine
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-300 font-medium">
              Calibrated against: <span className="text-white font-bold">{project.title}</span>
            </span>
            {project.parameters?.roleLevel && (
              <>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-purple-300 font-semibold bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">
                  {project.parameters.roleLevel}
                </span>
              </>
            )}
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Master Graph Recommendations for this Mandate
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Autonomous discovery across the master graph matching target functional scope, level step-up deltas, compensation parity, and real-time propensity-to-move (PTM) inflection points.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 shrink-0 text-center">
          <div className="px-3 py-1">
            <div className="text-2xl font-black text-purple-400">{initialData.totalCount}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total Recs</div>
          </div>
          <div className="px-3 py-1 border-x border-slate-800">
            <div className="text-2xl font-black text-emerald-400">{initialData.executives.length}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Executives</div>
          </div>
          <div className="px-3 py-1">
            <div className="text-2xl font-black text-blue-400">{initialData.companies.length}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Target Orgs</div>
          </div>
        </div>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Subtabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-xl w-fit">
          <button
            onClick={() => setActiveFilter('all')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
              activeFilter === 'all'
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>All Recommendations</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-extrabold",
              activeFilter === 'all' ? "bg-purple-100 text-purple-700" : "bg-slate-200 text-slate-600"
            )}>
              {executivesList.length + companiesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('executives')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
              activeFilter === 'executives'
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Executives</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-extrabold",
              activeFilter === 'executives' ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
            )}>
              {executivesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('companies')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
              activeFilter === 'companies'
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Target Companies</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-extrabold",
              activeFilter === 'companies' ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"
            )}>
              {companiesList.length}
            </span>
          </button>
        </div>

        {/* Right: Search, Fit Score Filter & Selection Toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search recommendations..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-48 lg:w-60 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Fit Score Dropdown */}
          <select
            value={minFitScore}
            onChange={e => setMinFitScore(Number(e.target.value))}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-500"
          >
            <option value="0">All Match Scores</option>
            <option value="95">95%+ Strong Fit Only</option>
            <option value="90">90%+ High Fit</option>
          </select>

          <button
            type="button"
            onClick={() => setMobilityOnly(!mobilityOnly)}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer",
              mobilityOnly
                ? "bg-amber-50 border-amber-300 text-amber-800"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            )}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>High Mobility Only</span>
          </button>

          <button
            onClick={handleSelectAllVisible}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
            <span>Select All</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* ========================================================================= */}
        {/* EXECUTIVES SECTION */}
        {/* ========================================================================= */}
        {(activeFilter === 'all' || activeFilter === 'executives') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Recommended Executives in Master Graph
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {filteredExecutives.length} Matches
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Executives determined to possess high step-up delta, structural domain overlap, and active mobility inflection timing.
                  </p>
                </div>
              </div>

              {filteredExecutives.length > 0 && (
                <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
                  Sorted by Match Score & PTM Index
                </span>
              )}
            </div>

            {filteredExecutives.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">No executives match current filter criteria</p>
                <p className="text-xs text-slate-400 mt-1">Try clearing search terms or resetting the minimum fit threshold.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredExecutives.map(exec => {
                  const isPipelined = pipelinedExecIds.has(exec.id) || exec.status === 'pipelined';
                  const isSelected = selectedExecIds.has(exec.id);

                  return (
                    <div
                      key={exec.id}
                      className={cn(
                        "bg-white rounded-xl border transition-all p-5 shadow-xs hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative group",
                        isSelected ? "border-purple-500 bg-purple-50/20 ring-1 ring-purple-500" : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {/* Checkbox + Avatar + Executive Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <button
                          type="button"
                          onClick={() => toggleSelectExec(exec.id)}
                          className="mt-1 text-slate-400 hover:text-purple-600 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-purple-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </button>

                        <div className="relative shrink-0">
                          <img
                            src={exec.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80'}
                            alt={exec.name}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Active Sourcing Signal" />
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                              {exec.name}
                            </h4>

                            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-purple-600" />
                              {exec.matchScore}% Match
                            </span>

                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                              {exec.fitTier}
                            </span>

                            <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-amber-600" />
                              {exec.mobilitySignal}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                            <span className="font-semibold text-slate-800 flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                              {exec.role} • <span className="text-purple-600 font-bold">{exec.company}</span>
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {exec.location}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              Tenure: {exec.tenure}
                            </span>
                            {exec.estimatedComp && (
                              <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                {exec.estimatedComp}
                              </span>
                            )}
                          </div>

                          {/* Fit Rationale Highlight Box */}
                          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 mt-2 text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                            <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-slate-900 font-bold">Master Graph Fit Rationale: </strong>
                              <span>{exec.fitRationale}</span>
                            </div>
                          </div>

                          {/* Fit dimension pills */}
                          <div className="flex items-center gap-2 flex-wrap pt-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                              CMA: {exec.fitSignals.levelMatch}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                              Comp: {exec.fitSignals.compParity}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              Scope: {exec.currentPandL}
                            </span>
                            {exec.keyHighlights.map((tag, idx) => (
                              <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-200">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0 flex items-center lg:flex-col lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {isPipelined ? (
                          <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 shadow-2xs">
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>In Project Pipeline</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleAddExecutiveToPipeline(exec, e)}
                            className="px-4 py-2 bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-purple-500/20 hover:scale-[1.02]"
                          >
                            <UserPlus className="w-4 h-4" />
                            <span>+ Add to Project Pipeline</span>
                          </button>
                        )}
                        <a 
                          href={`?view=candidates`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-slate-500 hover:text-(--color-secondary-200) flex items-center gap-1"
                        >
                          View Full Dossier <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TARGET COMPANIES SECTION */}
        {/* ========================================================================= */}
        {(activeFilter === 'all' || activeFilter === 'companies') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Recommended Target Companies in Master Graph
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      {filteredCompanies.length} Target Sources
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Organizations mapped with dense executive benches, active leadership departures, and scale similarity for this mandate.
                  </p>
                </div>
              </div>

              {filteredCompanies.length > 0 && (
                <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
                  Target Talent Incubators
                </span>
              )}
            </div>

            {filteredCompanies.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">No companies match current filter criteria</p>
                <p className="text-xs text-slate-400 mt-1">Try clearing search terms or resetting the minimum fit threshold.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCompanies.map(comp => {
                  const isMapped = mappedCompanyIds.has(comp.id) || comp.status === 'added_to_map';
                  const isSelected = selectedCompIds.has(comp.id);

                  return (
                    <div
                      key={comp.id}
                      className={cn(
                        "bg-white rounded-xl border transition-all p-5 shadow-xs hover:shadow-md flex flex-col justify-between gap-4 relative group",
                        isSelected ? "border-purple-500 bg-purple-50/20 ring-1 ring-purple-500" : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => toggleSelectComp(comp.id)}
                              className="mt-1 text-slate-400 hover:text-purple-600 cursor-pointer"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-purple-600" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300" />
                              )}
                            </button>

                            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-base shrink-0 shadow-xs">
                              {comp.name.charAt(0)}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                  {comp.name}
                                </h4>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                                  {comp.matchScore}% Target Match
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                <span>{comp.industry}</span>
                                <span>•</span>
                                <span>{comp.stage}</span>
                              </div>
                            </div>
                          </div>

                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider shrink-0">
                            {comp.tier}
                          </span>
                        </div>

                        {/* Mobility & Talent Density Signals */}
                        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Graph Talent Pool</span>
                            <span className="font-extrabold text-purple-700 flex items-center gap-1 mt-0.5">
                              <Users className="w-3.5 h-3.5" />
                              {comp.relevantCandidatesCount} Relevant Execs
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mobility Signal</span>
                            <span className="font-bold text-amber-700 flex items-center gap-1 mt-0.5 truncate" title={comp.mobilitySignal}>
                              <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              {comp.mobilitySignal}
                            </span>
                          </div>
                        </div>

                        {/* Fit Rationale */}
                        <p className="text-xs text-slate-600 leading-relaxed">
                          <strong className="text-slate-800 font-semibold">Mandate Fit: </strong>
                          {comp.fitRationale}
                        </p>

                        {/* Highlights */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {comp.keyHighlights.map((h, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {comp.headquarters}
                        </span>

                        {isMapped ? (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>In Market Map</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleAddCompanyToMarketMap(comp, e)}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-blue-500/25"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>+ Add to Market Map</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Bulk Action Drawer when checkboxes selected */}
      {totalSelectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-5 animate-slideUp">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center">
              {totalSelectedCount}
            </span>
            <span className="text-sm font-bold">
              {totalSelectedCount} item{totalSelectedCount === 1 ? '' : 's'} selected
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <button
            type="button"
            onClick={handleBulkAddToProject}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Add Selected to Project</span>
          </button>

          <button
            type="button"
            onClick={handleClearSelection}
            className="text-xs text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
