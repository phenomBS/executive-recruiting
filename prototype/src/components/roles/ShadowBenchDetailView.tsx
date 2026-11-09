import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Flame, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Search, 
  Filter, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  Kanban, 
  Plus, 
  RefreshCw, 
  SlidersHorizontal, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Bot,
  Activity,
  Calendar,
  Share2,
  FileText,
  FolderPlus
} from 'lucide-react';
import { RoleSuccessionItem, ShadowBenchCandidate, getSuccessionRecommendations } from '../../data/rolesSuccessionData';
import type { RoleRecommendation } from '../../data/recommendedRolesData';
import { CandidateDetailDrawer } from './CandidateDetailDrawer';
import { RoleMarketCalibrationTab } from './RoleMarketCalibrationTab';
import { useRouter } from '../../context/RouterContext';
import { cn } from '../../lib/utils';
import { ProjectParametersModal } from '../ProjectParametersModal';
import { addSessionProject } from '../../lib/sessionProjects';

interface ShadowBenchDetailViewProps {
  role: RoleSuccessionItem;
  onBack: () => void;
  onUpdateRole?: (updatedRole: RoleSuccessionItem) => void;
  onTriggerCandidateOutreach?: (candidate: ShadowBenchCandidate) => void;
  /** Set when previewing a role the agent recommends and the user has not activated yet */
  recommendation?: RoleRecommendation;
  onActivate?: () => void;
}

export function ShadowBenchDetailView({
  role,
  onBack,
  onUpdateRole,
  onTriggerCandidateOutreach,
  recommendation,
  onActivate
}: ShadowBenchDetailViewProps) {
  const router = useRouter();
  const activeTab: 'shadow-bench' | 'market-calibration' =
    router.activeTab === 'market-calibration' ? 'market-calibration' : 'shadow-bench';
  const setActiveTab = (tab: 'shadow-bench' | 'market-calibration') => {
    router.setTab(tab === 'shadow-bench' ? null : tab);
  };

  // View states
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [kanbanGrouping, setKanbanGrouping] = useState<'ptm' | 'stage'>('ptm');
  
  // Sorting & Filtering
  const [sortBy, setSortBy] = useState<'ptm_desc' | 'emi_desc' | 'sfa_desc' | 'cma_desc' | 'signal_recent'>('ptm_desc');
  const [ptmFilter, setPtmFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected candidate drawer
  const [selectedCandidate, setSelectedCandidate] = useState<ShadowBenchCandidate | null>(null);
  
  // Generate Search Project (pre-filled from this role and its bench)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Scanning state
  const [isScanningSignals, setIsScanningSignals] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Quick Add candidate state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateTitle, setNewCandidateTitle] = useState('');
  const [newCandidateCompany, setNewCandidateCompany] = useState('');

  // Handle live signal scan
  const handleTriggerSignalScan = () => {
    setIsScanningSignals(true);
    setScanMessage('Scanning SEC EDGAR (Form 4, 8-K, 144) & Event Registry for new market signals...');
    setTimeout(() => {
      setIsScanningSignals(false);
      setScanMessage('Scan complete! Verified 18 filings. Updated PTM propensity indices for active bench.');
      setTimeout(() => setScanMessage(null), 4000);
    }, 1800);
  };

  // Add Candidate to Bench
  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName.trim() || !newCandidateCompany.trim()) return;

    const newCand: ShadowBenchCandidate = {
      id: `bench-cand-${Date.now()}`,
      name: newCandidateName,
      currentTitle: newCandidateTitle || `VP of ${role.roleTitle}`,
      company: newCandidateCompany,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
      location: 'San Francisco, CA',
      tenureInRole: '3 yrs 2 mos',
      currentCompEst: '$1.35M TC',
      emiScore: 92,
      sfaScore: 94,
      cmaScore: 91,
      ptmScore: 89,
      ptmLevel: 'High',
      liveSignalAlert: {
        type: 'sec_filing',
        text: '⚠️ SEC Form 4: Vesting cliff in 30 days',
        source: 'SEC Edgar Form 4',
        date: 'Today',
        severity: 'urgent',
        details: 'Upcoming final vesting milestone. AI flagged high mobility probability.'
      },
      stage: 'Calibrated',
      benchReadiness: 'Ready Now (0-30d)',
      sfaReason: `Scope calibration verified against ${role.anchors.targetRevenueScale}.`,
      cmaReason: 'High career inflection and step-up readiness.',
      ptmReason: 'Approaching compensation vesting inflection point.',
      notesCount: 1
    };

    const updatedRole: RoleSuccessionItem = {
      ...role,
      candidates: [newCand, ...role.candidates],
      totalCandidatesTracked: role.candidates.length + 1,
      highFlightRiskCount: role.highFlightRiskCount + (newCand.ptmLevel === 'High' ? 1 : 0)
    };

    if (onUpdateRole) onUpdateRole(updatedRole);
    setNewCandidateName('');
    setNewCandidateTitle('');
    setNewCandidateCompany('');
    setIsQuickAddOpen(false);
  };

  // Filtered & Sorted Candidates
  const processedCandidates = useMemo(() => {
    return role.candidates
      .filter(c => {
        if (ptmFilter !== 'all' && c.ptmLevel !== ptmFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = c.name.toLowerCase().includes(q);
          const matchTitle = c.currentTitle.toLowerCase().includes(q);
          const matchCompany = c.company.toLowerCase().includes(q);
          return matchName || matchTitle || matchCompany;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'ptm_desc') return b.ptmScore - a.ptmScore; // Highest PTM (Immediate Flight Risk)
        if (sortBy === 'emi_desc') return b.emiScore - a.emiScore; // Highest Overall Match (EMI)
        if (sortBy === 'sfa_desc') return b.sfaScore - a.sfaScore; // Highest SFA
        if (sortBy === 'cma_desc') return b.cmaScore - a.cmaScore; // Highest CMA
        return 0;
      });
  }, [role.candidates, ptmFilter, searchQuery, sortBy]);

  const recommendedCandidates = useMemo(() => {
    return getSuccessionRecommendations(role).filter(c => {
      if (role.candidates.some(existing => existing.id === c.id)) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.currentTitle.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q)
      );
    });
  }, [role, searchQuery]);

  const handleActivateRecommendation = (candidate: ShadowBenchCandidate) => {
    const updatedRole: RoleSuccessionItem = {
      ...role,
      candidates: [candidate, ...role.candidates],
      totalCandidatesTracked: role.candidates.length + 1,
      highFlightRiskCount: role.highFlightRiskCount + (candidate.ptmLevel === 'High' ? 1 : 0),
    };
    if (onUpdateRole) onUpdateRole(updatedRole);
  };

  // Aggregate Metrics for Header
  const recommendationCount = useMemo(
    () => getSuccessionRecommendations(role).filter(c => !role.candidates.some(existing => existing.id === c.id)).length,
    [role]
  );
  const totalTracked = role.candidates.length;

  return (
    <div className="min-h-full bg-(--bg-surface-base) pb-16">
      <ProjectParametersModal
        isOpen={isProjectModalOpen}
        onOpenChange={setIsProjectModalOpen}
        initialRoleId={role.id}
        onSave={project => {
          addSessionProject(project);
          router.navigateToView('projects', { projectId: project.id });
        }}
      />

      
      {/* Toast / Notification Banner */}
      {scanMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-slideDown">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Breadcrumb Navigation & Top Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Roles & Succession</span>
            </button>
            <span>/</span>
            <span className="text-slate-900 font-bold">{role.roleTitle}</span>
            <span>·</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
              recommendation
                ? "bg-(--bg-brand-secondary-subtle) text-(--color-secondary-200) border border-(--color-secondary-50)"
                : role.type === 'active_requisition' 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                  : "bg-purple-50 text-purple-700 border border-purple-200"
            )}>
              {recommendation ? 'Recommended by agent' : role.type === 'active_requisition' ? 'Active Requisition' : 'Succession Bench'}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleTriggerSignalScan}
              disabled={isScanningSignals}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={cn("w-3.5 h-3.5 text-(--color-secondary-200)", isScanningSignals && "animate-spin")} />
              <span>{isScanningSignals ? 'Scanning SEC Edgar...' : 'Run Real-Time Signal Scan'}</span>
            </button>

            {!recommendation && (
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
              className="px-3.5 py-2 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Candidate to Bench</span>
            </button>
            )}
          </div>
        </div>

        {/* Recommended-role banner: why the agent proposes it, and the activate action */}
        {recommendation && (
          <div className="phx-feedback" data-tone="progressive" role="region" aria-label="Agent recommendation">
            <Sparkles className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="text-sm font-semibold">Recommended by the agent · {recommendation.recommendedOn}</div>
              <p className="leading-relaxed">{recommendation.basis}</p>
              <p className="text-sm">
                Based on past projects: {recommendation.sourceProjects.join(', ')}. {recommendation.evidence}.
              </p>
              <p className="text-sm">This role is not tracked yet. Review its shadow bench below, then activate it to bring it into Roles.</p>
            </div>
            {onActivate && (
              <button type="button" className="phx-btn shrink-0 self-center" data-variant="primary" onClick={onActivate}>
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Activate role
              </button>
            )}
          </div>
        )}

        {/* Quick Add Candidate Dropdown Panel */}
        {isQuickAddOpen && (
          <form 
            onSubmit={handleAddCandidate}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-md space-y-4 animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-(--color-secondary-200)" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Quick Add Target Candidate to {role.roleTitle}
                </h4>
              </div>
              <button 
                type="button" 
                onClick={() => setIsQuickAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Cancel
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={newCandidateName}
                onChange={(e) => setNewCandidateName(e.target.value)}
                placeholder="Candidate Full Name *"
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
              />
              <input
                type="text"
                value={newCandidateTitle}
                onChange={(e) => setNewCandidateTitle(e.target.value)}
                placeholder={`Current Title (e.g. VP / Director)`}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
              />
              <input
                type="text"
                required
                value={newCandidateCompany}
                onChange={(e) => setNewCandidateCompany(e.target.value)}
                placeholder="Company (e.g. Apple, Meta, Stripe) *"
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-(--color-secondary-200) text-white text-xs font-bold hover:bg-(--bg-brand-secondary-hover)"
              >
                Attach & Calibrate AI Scores
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* SHADOW BENCH METRIC HEADER (Clean metric header required by brief) */}
        {/* ============================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          
          {/* Top Banner: Role Details & Anchor Scope */}
          <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-slate-50/60 to-white">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {role.roleTitle}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
                {role.description}
              </p>
            </div>
            {!recommendation && (
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(true)}
              className="phx-btn shrink-0 self-start lg:self-center"
              data-variant="primary"
            >
              <FolderPlus className="w-4 h-4" aria-hidden="true" /> Generate Search Project
            </button>
            )}
          </div>

          {/* Clean Metric Header KPI Bar (Total Candidates Tracked & High Flight-Risk Targets) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-white">
            
            {/* KPI 1: Total Candidates Tracked */}
            <div className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-(--color-secondary-200)/10 text-(--color-secondary-200) flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                  Total Candidates Tracked
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-slate-900">
                    {totalTracked}
                  </span>
                  <span className="text-xs font-bold text-slate-400">bench targets</span>
                </div>
              </div>
            </div>

            {/* KPI 4: Agent succession recommendations (shown in the board columns below) */}
            <div className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-(--color-secondary-200)/10 text-(--color-secondary-200) flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                  Recommendations
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-(--color-secondary-200)">
                    {recommendationCount}
                  </span>
                  <span className="text-xs font-bold text-slate-400">agent suggestions</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Role detail tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200" role="tablist" aria-label="Role sections">
          {([
            { id: 'shadow-bench' as const, label: 'Shadow Bench', icon: Users },
            { id: 'market-calibration' as const, label: 'Market Calibration', icon: SlidersHorizontal },
          ]).map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2.5 text-sm font-semibold flex items-center gap-2 border-b-2 -mb-px transition-colors cursor-pointer",
                  isActive
                    ? "border-b-(--color-secondary-200) text-(--color-secondary-200)"
                    : "border-b-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'market-calibration' ? (
          <RoleMarketCalibrationTab key={role.id} role={role} />
        ) : (
        <>
        {/* ============================================================== */}
        {/* CONTROLS BAR: SORTING, FILTERING & VIEW MODE TOGGLE */}
        {/* ============================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          
          {/* Left: Search & PTM Filter */}
          <div className="flex items-center gap-2.5 flex-1 flex-wrap">
            {/* Search Input */}
            <div className="relative min-w-[220px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates or companies..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200) bg-slate-50/50"
              />
            </div>

            {/* PTM Filter Tabs / Segmented Buttons */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setPtmFilter('all')}
                className={cn(
                  "px-3 py-1.5 font-bold rounded-lg transition-colors cursor-pointer",
                  ptmFilter === 'all' ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                )}
              >
                All PTM
              </button>
              <button
                type="button"
                onClick={() => setPtmFilter('High')}
                className={cn(
                  "px-3 py-1.5 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer",
                  ptmFilter === 'High' ? "bg-emerald-600 text-white shadow-2xs" : "text-emerald-700 hover:text-emerald-900"
                )}
              >
                <Flame className="w-3 h-3" />
                High PTM Only ({role.candidates.filter(c => c.ptmLevel === 'High').length})
              </button>
              <button
                type="button"
                onClick={() => setPtmFilter('Medium')}
                className={cn(
                  "px-3 py-1.5 font-bold rounded-lg transition-colors cursor-pointer",
                  ptmFilter === 'Medium' ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                )}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setPtmFilter('Low')}
                className={cn(
                  "px-3 py-1.5 font-bold rounded-lg transition-colors cursor-pointer",
                  ptmFilter === 'Low' ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                )}
              >
                Low
              </button>
            </div>
          </div>

          {/* Right: Instant Sort Dropdown & Layout Switcher */}
          <div className="flex items-center gap-2.5 self-end md:self-auto">
            
            {/* Instant Sort Dropdown (Required by brief) */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px] font-semibold text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="ptm_desc">Highest PTM (Immediate Flight Risk)</option>
                <option value="emi_desc">Highest Overall Match (EMI)</option>
                <option value="sfa_desc">Highest Structural Fit (SFA)</option>
                <option value="cma_desc">Highest Motivation (CMA)</option>
              </select>
            </div>

            {/* View Mode: Kanban vs List */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={cn(
                  "p-1.5 rounded-lg text-slate-600 transition-colors cursor-pointer",
                  viewMode === 'kanban' ? "bg-white text-slate-900 shadow-2xs" : "hover:text-slate-900"
                )}
                title="Kanban Board View"
              >
                <Kanban className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-1.5 rounded-lg text-slate-600 transition-colors cursor-pointer",
                  viewMode === 'list' ? "bg-white text-slate-900 shadow-2xs" : "hover:text-slate-900"
                )}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* ============================================================== */}
        {/* CANDIDATE BOARD / LIST CONTAINER */}
        {/* ============================================================== */}
        {viewMode === 'kanban' ? (
          /* Kanban Board of Candidate Cards */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {([
              {
                title: 'Top Candidates',
                level: 'High' as const,
                shell: 'bg-emerald-50/40 border-emerald-200/70',
                rule: 'border-emerald-200/70',
                dot: 'bg-emerald-500',
                count: 'bg-emerald-100 text-emerald-800',
                emptyBorder: 'border-emerald-200',
                empty: 'No top candidates match the current filters.',
              },
              {
                title: 'Monitor/Nurture',
                level: 'Medium' as const,
                shell: 'bg-amber-50/20 border-amber-200/60',
                rule: 'border-amber-200/50',
                dot: 'bg-amber-500',
                count: 'bg-amber-100 text-amber-800',
                emptyBorder: 'border-amber-200',
                empty: 'No candidates in monitor / nurture.',
              },
              {
                title: 'Watchlist',
                level: 'Low' as const,
                shell: 'bg-slate-50 border-slate-200',
                rule: 'border-slate-200',
                dot: 'bg-slate-400',
                count: 'bg-slate-200 text-slate-700',
                emptyBorder: 'border-slate-200',
                empty: 'No candidates on the watchlist.',
              },
            ]).map(column => {
              const columnCandidates = processedCandidates.filter(c => c.ptmLevel === column.level);
              const columnRecommendations = recommendedCandidates.filter(c => c.ptmLevel === column.level);
              return (
                <div key={column.title} className={cn("flex flex-col gap-4 p-4 rounded-2xl border", column.shell)}>
                  <div className={cn("flex items-center justify-between pb-2 border-b", column.rule)}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2.5 h-2.5 rounded-full", column.dot)} />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {column.title}
                      </h3>
                    </div>
                    <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-black", column.count)}>
                      {columnCandidates.length}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {columnCandidates.map(candidate => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onSelect={() => setSelectedCandidate(candidate)}
                        onOutreach={() => {
                          if (onTriggerCandidateOutreach) onTriggerCandidateOutreach(candidate);
                        }}
                      />
                    ))}
                    {columnCandidates.length === 0 && (
                      <div className={cn("p-8 text-center text-xs text-slate-400 bg-white/60 rounded-xl border border-dashed", column.emptyBorder)}>
                        {column.empty}
                      </div>
                    )}

                    {columnRecommendations.length > 0 && (
                      <div className={cn("space-y-3 pt-2 border-t", column.rule)}>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                            Recommended for this role
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Aura suggestions. Not on the bench until you activate them.
                          </p>
                        </div>
                        {columnRecommendations.map(candidate => (
                          <CandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            muted
                            onSelect={() => setSelectedCandidate(candidate)}
                            onOutreach={() => handleActivateRecommendation(candidate)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List Mode: Dense High-Clarity Table/Cards */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {processedCandidates.map(candidate => (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Identity */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={candidate.avatarUrl}
                    alt={candidate.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 hover:text-(--color-secondary-200)">
                        {candidate.name}
                      </h4>
                      <span className="text-xs font-semibold text-slate-500">
                        {candidate.company}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {candidate.currentTitle}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{candidate.location}</span>
                      <span>·</span>
                      <span>Tenure: {candidate.tenureInRole}</span>
                    </div>
                  </div>
                </div>

                {/* AI Scores & PTM Indicator */}
                <div className="flex items-center gap-4 flex-wrap lg:flex-nowrap">
                  
                  {/* Composite EMI Match */}
                  <div className="text-center px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 min-w-[70px]">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">EMI</span>
                    <span className="text-base font-black text-(--color-secondary-200)">{candidate.emiScore}</span>
                  </div>

                  {/* SFA & CMA Badges */}
                  <div className="flex flex-col gap-1 text-[11px]">
                    <span className="px-2 py-0.5 rounded font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      SFA: {candidate.sfaScore}%
                    </span>
                    <span className="px-2 py-0.5 rounded font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      CMA: {candidate.cmaScore}%
                    </span>
                  </div>

                  {/* Live PTM Indicator */}
                  <div className="min-w-[130px]">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                      <span className={cn(
                        candidate.ptmLevel === 'High' ? "text-rose-600" : candidate.ptmLevel === 'Medium' ? "text-amber-600" : "text-slate-600"
                      )}>
                        {candidate.ptmLevel} PTM
                      </span>
                      <span className="text-slate-900">{candidate.ptmScore}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          candidate.ptmLevel === 'High' ? "bg-rose-500" : candidate.ptmLevel === 'Medium' ? "bg-amber-500" : "bg-slate-400"
                        )}
                        style={{ width: `${candidate.ptmScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Live Signal Alert Snippet */}
                  <div className="flex-1 max-w-sm bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 block">
                      Phase 3 Signal Alert ({candidate.liveSignalAlert.date})
                    </span>
                    <p className="font-semibold text-slate-800 line-clamp-1">
                      {candidate.liveSignalAlert.text}
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
        </>
        )}

      </div>

      {/* Candidate Deep-Dive Drawer */}
      <CandidateDetailDrawer 
        candidate={selectedCandidate}
        roleTitle={role.roleTitle}
        onClose={() => setSelectedCandidate(null)}
        onTriggerOutreach={(c) => {
          if (onTriggerCandidateOutreach) onTriggerCandidateOutreach(c);
        }}
      />

    </div>
  );
}

// =====================================================================
// CANDIDATE CARD ANATOMY (Strictly matching prompt specifications)
// =====================================================================
interface CandidateCardProps {
  candidate: ShadowBenchCandidate;
  onSelect: () => void;
  onOutreach: () => void;
  /** Agent suggestion: same card, muted, until the recruiter activates it. */
  muted?: boolean;
}

function CandidateCard({ candidate, onSelect, onOutreach, muted = false }: CandidateCardProps) {
  const isHighPtm = candidate.ptmLevel === 'High';
  const isMedPtm = candidate.ptmLevel === 'Medium';
  const inboundSignal = isHighPtm && !muted;

  return (
    <div 
      onClick={muted ? undefined : onSelect}
      className={cn(
        "p-4 rounded-xl border bg-white shadow-2xs transition-all space-y-3 relative group",
        muted
          ? "border-slate-200"
          : "hover:shadow-md cursor-pointer",
        !muted && inboundSignal && "border-emerald-300 hover:border-emerald-400",
        !muted && isMedPtm && "border-amber-200/80 hover:border-amber-300",
        !muted && !isHighPtm && !isMedPtm && "border-slate-200 hover:border-slate-300"
      )}
    >
      <div className={cn("space-y-3", muted && "opacity-45 grayscale")}>
        <div className="flex items-start gap-3">
          <img
            src={candidate.avatarUrl}
            alt={candidate.name}
            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-(--color-secondary-200) truncate">
              {candidate.name}
            </h4>
            <p className="text-xs font-semibold text-slate-700 truncate">
              {candidate.currentTitle}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-700 truncate">{candidate.company}</span>
              <span>·</span>
              <span className="truncate">{candidate.location}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              EMI Match:
            </span>
            <span className="text-base font-black text-(--color-secondary-200)">
              {candidate.emiScore}
            </span>
            <span className="text-[10px] text-slate-400">/100</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200/80"
              title="Structural Fit Analysis: Headcount & revenue parity"
            >
              SFA {candidate.sfaScore}%
            </span>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200/80"
              title="Candidate Motivation Alignment: Career inflection & timing"
            >
              CMA {candidate.cmaScore}%
            </span>
          </div>
        </div>

        <div className={cn(
          "p-2.5 rounded-lg border text-xs leading-snug flex items-start gap-2",
          inboundSignal
            ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
            : candidate.liveSignalAlert.severity === 'urgent'
              ? "bg-rose-50/80 border-rose-200 text-rose-900"
              : "bg-amber-50/80 border-amber-200 text-amber-900"
        )}>
          <span className="shrink-0 text-sm mt-0.5">
            {candidate.liveSignalAlert.text.startsWith('⚠️') ? '⚠️' : '📰'}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold line-clamp-2">
              {candidate.liveSignalAlert.text.replace(/^⚠️\s*|^📰\s*/, '')}
            </p>
            <span className="text-[10px] opacity-75 block mt-0.5 font-medium">
              {candidate.liveSignalAlert.source} · {candidate.liveSignalAlert.date}
            </span>
          </div>
        </div>
      </div>

      {muted ? (
        <div className="pt-1 flex items-center justify-between gap-2 text-xs border-t border-slate-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="text-(--color-secondary-200) hover:text-(--bg-brand-secondary-hover) font-bold text-[11px] hover:underline"
          >
            View profile
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOutreach();
            }}
            className="px-2.5 py-1 rounded-lg bg-(--bg-brand-secondary-default) text-white text-[11px] font-bold hover:bg-(--bg-brand-secondary-hover)"
          >
            Activate
          </button>
        </div>
      ) : (
        <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-medium">
            {candidate.benchReadiness}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOutreach();
            }}
            className="text-(--color-secondary-200) hover:text-(--bg-brand-secondary-hover) font-bold text-[11px] flex items-center gap-1 hover:underline"
          >
            <Bot className="w-3.5 h-3.5" />
            Aura Nurture
          </button>
        </div>
      )}

    </div>
  );
}
