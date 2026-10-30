import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Briefcase, 
  TrendingUp, 
  Flame, 
  Users, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Building2, 
  Clock, 
  Target, 
  Layers, 
  Activity, 
  ShieldCheck,
  Bot
} from 'lucide-react';
import { 
  RoleSuccessionItem, 
  ShadowBenchCandidate, 
  initialRolesSuccessionData 
} from '../../data/rolesSuccessionData';
import { ShadowBenchDetailView } from './ShadowBenchDetailView';
import { CreateRoleModal } from './CreateRoleModal';
import { cn } from '../../lib/utils';
import { useRouter } from '../../context/RouterContext';

interface RolesSuccessionViewProps {
  initialRoleId?: string | null;
  onNavigateCandidate?: (candidateId: string) => void;
}

export function RolesSuccessionView({ 
  initialRoleId, 
  onNavigateCandidate 
}: RolesSuccessionViewProps) {
  const router = useRouter();
  // Roles Data State
  const [roles, setRoles] = useState<RoleSuccessionItem[]>(initialRolesSuccessionData);
  
  // Top-Level Toggle/Tabs (Required: Active Requisitions vs Succession Benches)
  const [activeTab, setActiveTab] = useState<'active_requisition' | 'succession_bench'>('active_requisition');
  
  // Selected Role for Shadow Bench detail view
  const selectedRoleId = router.roleId || initialRoleId || null;
  const setSelectedRoleId = (id: string | null) => {
    router.setRoleId(id);
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Create Role Modal
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Selected Role Object
  const selectedRole = roles.find(r => r.id === selectedRoleId) || null;

  // Handle role updates
  const handleUpdateRole = (updatedRole: RoleSuccessionItem) => {
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
    showToast(`Updated shadow bench for ${updatedRole.roleTitle}`);
  };

  // Handle role creation
  const handleCreateRole = (newRole: RoleSuccessionItem) => {
    setRoles(prev => [newRole, ...prev]);
    showToast(`Created ${newRole.roleTitle} with AI-calibrated anchors!`);
    // Automatically switch tab and open the new role's shadow bench
    setActiveTab(newRole.type);
    setSelectedRoleId(newRole.id);
  };

  const handleCandidateOutreach = (candidate: ShadowBenchCandidate) => {
    showToast(`Dispatched Phenom Aura Agent outreach sequence to ${candidate.name}!`);
  };

  // Aggregate Metrics across the entire executive landscape
  const activeRequisitionsCount = roles.filter(r => r.type === 'active_requisition').length;
  const successionBenchesCount = roles.filter(r => r.type === 'succession_bench').length;
  
  const totalTrackedOverall = roles.reduce((acc, r) => acc + r.totalCandidatesTracked, 0);
  const totalHighFlightRiskOverall = roles.reduce((acc, r) => acc + r.highFlightRiskCount, 0);
  const avgOverallEmi = Math.round(
    roles.reduce((acc, r) => acc + r.avgEmiMatch, 0) / (roles.length || 1)
  );

  // Filtered Roles for Active Tab
  const filteredRoles = roles
    .filter(r => r.type === activeTab)
    .filter(r => {
      if (departmentFilter !== 'all' && r.department !== departmentFilter) return false;
      if (priorityFilter !== 'all' && !r.priorityLevel.startsWith(priorityFilter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.roleTitle.toLowerCase().includes(q);
        const matchDept = r.department.toLowerCase().includes(q);
        const matchHM = r.hiringManager.toLowerCase().includes(q);
        return matchTitle || matchDept || matchHM;
      }
      return true;
    });

  // If a role is selected, render the Shadow Bench Detail View!
  if (selectedRole) {
    return (
      <ShadowBenchDetailView
        role={selectedRole}
        onBack={() => setSelectedRoleId(null)}
        onUpdateRole={handleUpdateRole}
        onTriggerCandidateOutreach={handleCandidateOutreach}
      />
    );
  }

  return (
    <div className="min-h-full bg-(--bg-surface-base) pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Workspace Title & Create Role Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-bold text-(--text-strong)">
              Roles & Succession
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time predictive Propensity to Move (PTM), Structural Fit (SFA), and Motivation Alignment (CMA) talent mapping.
            </p>
          </div>

          {/* "+ Create Role" Modal Button */}
          <button
            type="button"
            onClick={() => setIsCreateRoleModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2.5 shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Role</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* GLOBAL INTELLIGENCE METRIC BAR */}
        {/* ============================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                Monitored Mandates
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-slate-900">
                  {roles.length}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  ({activeRequisitionsCount} active / {successionBenchesCount} benches)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                Candidates Tracked
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-slate-900">
                  {totalTrackedOverall}
                </span>
                <span className="text-xs font-medium text-slate-400">executives</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-2xs flex items-center gap-4 bg-rose-50/20">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 relative">
              <Flame className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 ring-2 ring-white" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-700 block uppercase tracking-wider">
                High Flight-Risk Targets
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-rose-600">
                  {totalHighFlightRiskOverall}
                </span>
                <span className="text-xs font-medium text-rose-500/80">high PTM targets</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                Avg EMI Composite Fit
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-emerald-600">
                  {avgOverallEmi}%
                </span>
                <span className="text-xs font-medium text-slate-400">calibrated</span>
              </div>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* TOP-LEVEL TOGGLE/TABS (Required by brief) */}
        {/* ============================================================== */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Segmented Top-Level Toggle: Active Requisitions vs Succession Benches */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            
            {/* Tab 1: Active Requisitions */}
            <button
              type="button"
              onClick={() => setActiveTab('active_requisition')}
              className={cn(
                "px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
                activeTab === 'active_requisition'
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <div className={cn(
                "w-2 h-2 rounded-full",
                activeTab === 'active_requisition' ? "bg-emerald-500" : "bg-slate-400"
              )} />
              <span>Active Requisitions</span>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-black",
                activeTab === 'active_requisition' ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
              )}>
                {activeRequisitionsCount} Immediate Needs
              </span>
            </button>

            {/* Tab 2: Succession Benches */}
            <button
              type="button"
              onClick={() => setActiveTab('succession_bench')}
              className={cn(
                "px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
                activeTab === 'succession_bench'
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <div className={cn(
                "w-2 h-2 rounded-full",
                activeTab === 'succession_bench' ? "bg-purple-500" : "bg-slate-400"
              )} />
              <span>Succession Benches</span>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-black",
                activeTab === 'succession_bench' ? "bg-purple-100 text-purple-800" : "bg-slate-200 text-slate-600"
              )}>
                {successionBenchesCount} Evergreen Pools
              </span>
            </button>

          </div>

          {/* Filter & Search Bar */}
          <div className="flex items-center gap-2.5 flex-wrap px-2">
            
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roles or leaders..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
              />
            </div>

            {/* Department Select */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">All Departments</option>
              <option value="Engineering & AI">Engineering & AI</option>
              <option value="Product & Growth">Product & Growth</option>
              <option value="Executive Leadership">Executive Leadership</option>
              <option value="Security & Infrastructure">Security & Infrastructure</option>
              <option value="Finance & Corporate">Finance & Corporate</option>
            </select>

            {/* Priority Select */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="P0">P0 - Critical</option>
              <option value="P1">P1 - High</option>
              <option value="P2">P2 - Medium</option>
            </select>

          </div>

        </div>

        {/* Section Explainer Banner */}
        <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-(--color-secondary-200)" />
            {activeTab === 'active_requisition' ? (
              <span>
                <strong>Active Requisitions:</strong> High-priority open searches calibrated for immediate hiring velocity and active interview slates.
              </span>
            ) : (
              <span>
                <strong>Succession Benches:</strong> Proactive evergreen talent pools calibrated to mitigate unplanned C-suite flight risks and planned retirements.
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-slate-500 shrink-0">
            Click into any role to inspect its live Shadow Bench
          </span>
        </div>

        {/* ============================================================== */}
        {/* ROLE CARDS GRID */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRoles.map(role => (
            <div
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-(--color-secondary-200)/40 transition-all p-6 space-y-4 cursor-pointer flex flex-col justify-between group"
            >
              {/* Card Top: Title, Level, Priority & Department */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-(--color-secondary-200) transition-colors">
                        {role.roleTitle}
                      </h3>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase",
                        role.priorityLevel.startsWith('P0') ? "bg-rose-100 text-rose-800" : "bg-blue-100 text-blue-800"
                      )}>
                        {role.priorityLevel.split(' - ')[0]}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                      <span className="font-medium text-slate-700">{role.department}</span>
                      <span>·</span>
                      <span>{role.level}</span>
                      <span>·</span>
                      <span className="text-slate-400">Target: {role.targetDate}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 shrink-0">
                    {role.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {role.description}
                </p>
              </div>

              {/* Mathematical Anchors Mini-Box */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Calibrated Mathematical Anchors
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Revenue Scale:</span>
                    <span className="text-slate-900">{role.anchors.targetRevenueScale}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Headcount:</span>
                    <span className="text-slate-900">{role.anchors.targetHeadcountScope}</span>
                  </div>
                </div>
              </div>

              {/* Bench Metrics & Candidate Avatar Roster */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
                
                {/* Metric Summary */}
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Tracked</span>
                    <strong className="text-sm font-black text-slate-900">
                      {role.totalCandidatesTracked}
                    </strong>
                  </div>
                  
                  <div className="w-px h-6 bg-slate-200" />
                  
                  <div>
                    <span className="text-[10px] text-rose-500 block font-semibold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-rose-500" /> High Flight Risk
                    </span>
                    <strong className="text-sm font-black text-rose-600">
                      {role.highFlightRiskCount}
                    </strong>
                  </div>

                  <div className="w-px h-6 bg-slate-200" />

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Avg EMI</span>
                    <strong className="text-sm font-black text-emerald-600">
                      {role.avgEmiMatch}%
                    </strong>
                  </div>
                </div>

                {/* Candidate Avatars with PTM dots */}
                <div className="flex items-center -space-x-2 shrink-0">
                  {role.candidates.slice(0, 4).map(c => (
                    <div key={c.id} className="relative group/avatar">
                      <img
                        src={c.avatarUrl}
                        alt={c.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white ring-1 ring-slate-200"
                        title={`${c.name} (${c.company}) - ${c.ptmLevel} PTM`}
                      />
                      {c.ptmLevel === 'High' && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-1 ring-white" />
                      )}
                    </div>
                  ))}
                  {role.candidates.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white ring-1 ring-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      +{role.candidates.length - 4}
                    </div>
                  )}
                </div>

              </div>

              {/* Card Footer: CTA */}
              <div className="flex items-center justify-between text-xs pt-1 text-(--color-secondary-200) font-bold group-hover:translate-x-0.5 transition-transform">
                <span className="flex items-center gap-1.5 text-slate-500 font-normal">
                  Sponsor: {role.hiringManager}
                </span>
                <span className="flex items-center gap-1">
                  Open Shadow Bench <ChevronRight className="w-4 h-4" />
                </span>
              </div>

            </div>
          ))}

          {filteredRoles.length === 0 && (
            <div className="col-span-2 p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
              <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">No roles matched your filters</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Adjust your search query or department filters, or create a new role to establish the AI mathematical anchors.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateRoleModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-(--color-secondary-200) text-white text-xs font-bold"
              >
                + Create Role
              </button>
            </div>
          )}
        </div>

      </div>

      {/* "Create Role" Modal/Slide-out */}
      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onOpenChange={setIsCreateRoleModalOpen}
        defaultType={activeTab}
        onCreateRole={handleCreateRole}
      />

    </div>
  );
}
