import React, { useState } from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Users, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Filter, 
  ArrowUpRight,
  Flame,
  UserCheck,
  Zap,
  ExternalLink,
  MessageSquare,
  Bot
} from 'lucide-react';
import { RoleHealthBreakdown, CandidateLeadSummary, initialRoleHealthData } from '../../data/roleHealthData';
import { cn } from '../../lib/utils';

interface RoleHealthBreakdownWidgetProps {
  onSelectCandidate?: (candidateId: string) => void;
  onNavigateToProjects?: () => void;
  onNavigateToRoles?: (roleTitle?: string) => void;
  onNurtureRoleWarmPool?: (roleTitle: string) => void;
}

export function RoleHealthBreakdownWidget({
  onSelectCandidate,
  onNavigateToProjects,
  onNavigateToRoles,
  onNurtureRoleWarmPool
}: RoleHealthBreakdownWidgetProps) {
  const [roleList, setRoleList] = useState<RoleHealthBreakdown[]>(initialRoleHealthData);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [healthFilter, setHealthFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);

  // Aggregate Metrics
  const totalRoles = roleList.length;
  const totalReadyToMove = roleList.reduce((acc, r) => acc + r.readyToMoveCount, 0);
  const totalQualified = roleList.reduce((acc, r) => acc + r.qualifiedLeadsCount, 0);
  const totalWarm = roleList.reduce((acc, r) => acc + r.warmLeadsCount, 0);
  const avgHealthScore = Math.round(roleList.reduce((acc, r) => acc + r.healthScore, 0) / (totalRoles || 1));

  // Filtered Roles
  const filteredRoles = roleList.filter(role => {
    if (departmentFilter !== 'all' && role.department !== departmentFilter) return false;
    if (healthFilter !== 'all' && role.healthStatus !== healthFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = role.roleTitle.toLowerCase().includes(q);
      const matchHM = role.hiringManager.toLowerCase().includes(q);
      const matchDept = role.department.toLowerCase().includes(q);
      return matchTitle || matchHM || matchDept;
    }
    return true;
  });

  const departments = ['all', 'Engineering & AI', 'Executive Leadership', 'Product & Growth', 'Security & Infrastructure', 'Finance & Corporate'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col w-full">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--color-secondary-200)/10 text-(--color-secondary-200) flex items-center justify-center font-bold shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Role Pipeline Health & Lead Velocity
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark)">
                {totalRoles} Active Mandates
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live breakdown of open executive searches across warm, qualified, and ready-to-move talent pools
            </p>
          </div>
        </div>

        {/* Global Pipeline Health Badge & Link */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0 flex-wrap">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-500 font-medium">Org Pipeline Health:</span>
            <strong className="text-xs font-black text-slate-900">{avgHealthScore}% Strong</strong>
          </div>
          
          {onNavigateToRoles && (
            <button
              type="button"
              onClick={() => onNavigateToRoles()}
              className="px-3 py-1.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Roles & Succession</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Summary Banner across the 3 Lead Tiers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 border-b border-slate-200">
        
        {/* Tier 1: Ready to Move Leads */}
        <div className="p-4 sm:p-5 bg-white space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              Ready to Move
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
              Immediate Slate
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {totalReadyToMove} <span className="text-xs font-semibold text-slate-400">executives</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            High mobility indicator (90%+), actively interested, calibrated for immediate HM presentation.
          </p>
        </div>

        {/* Tier 2: Qualified Leads */}
        <div className="p-4 sm:p-5 bg-white space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-(--color-secondary-200) flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <UserCheck className="w-3.5 h-3.5 text-(--color-secondary-200)" />
              Qualified Leads
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-purple-100 text-(--text-brand-secondary-dark)">
              Vetted Core
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {totalQualified} <span className="text-xs font-semibold text-slate-400">executives</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Screened against role scope, verified public/enterprise scale, and compensation benchmarks.
          </p>
        </div>

        {/* Tier 3: Warm Leads */}
        <div className="p-4 sm:p-5 bg-white space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Flame className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
              Warm Engagements
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark)">
              In Dialogue
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {totalWarm} <span className="text-xs font-semibold text-slate-400">executives</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Responsive to Phenom Aura Agent nurture sequences, opened teasers, active in dialogue.
          </p>
        </div>

        {/* Total Active Mandates */}
        <div className="p-4 sm:p-5 bg-white space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Briefcase className="w-3.5 h-3.5 text-slate-600" />
              Active Searches
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
              Avg 26d Open
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {totalRoles} <span className="text-xs font-semibold text-slate-400">mandates</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Across 5 functional departments with calibrated search committee and executive sponsors.
          </p>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="px-6 py-3.5 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Department Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setDepartmentFilter(dept)}
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all",
                departmentFilter === dept
                  ? "bg-(--color-secondary-200) text-white shadow-2xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              )}
            >
              {dept === 'all' ? 'All Roles' : dept}
            </button>
          ))}
        </div>

        {/* Health status filter & search input */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search role or hiring manager..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 text-xs focus:outline-none focus:border-(--color-secondary-200) w-48 sm:w-56"
            />
          </div>

          <select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-(--color-secondary-200)"
          >
            <option value="all">All Health</option>
            <option value="healthy">Healthy Only</option>
            <option value="calibrating">Calibrating</option>
            <option value="attention_needed">Attention Needed</option>
          </select>
        </div>
      </div>

      {/* Roles Breakdown Cards List */}
      <div className="divide-y divide-slate-100">
        {filteredRoles.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No roles match the selected filter criteria.
          </div>
        ) : (
          filteredRoles.map((role) => {
            const isExpanded = expandedRoleId === role.id;
            const totalLeads = role.warmLeadsCount + role.qualifiedLeadsCount + role.readyToMoveCount;
            
            // Percentage weights for segmented bar
            const readyPct = totalLeads > 0 ? (role.readyToMoveCount / totalLeads) * 100 : 0;
            const qualPct = totalLeads > 0 ? (role.qualifiedLeadsCount / totalLeads) * 100 : 0;
            const warmPct = totalLeads > 0 ? (role.warmLeadsCount / totalLeads) * 100 : 0;

            const isHealthy = role.healthStatus === 'healthy';
            const isAttention = role.healthStatus === 'attention_needed';

            return (
              <div 
                key={role.id}
                className={cn(
                  "p-5 transition-all hover:bg-slate-50/50",
                  isExpanded ? "bg-slate-50/70" : "bg-white"
                )}
              >
                {/* Main Role Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Role Info & Hiring Manager */}
                  <div className="space-y-1.5 min-w-[280px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {role.level}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 hover:text-(--color-secondary-200) transition-colors">
                        {role.roleTitle}
                      </h4>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {role.department}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <img 
                        src={role.hiringManagerAvatar} 
                        alt={role.hiringManager} 
                        className="w-5 h-5 rounded-full object-cover border border-slate-200" 
                      />
                      <span>HM: <strong className="text-slate-800">{role.hiringManager}</strong> ({role.hiringManagerTitle})</span>
                      <span>·</span>
                      <span className="text-slate-400">{role.daysOpen}d Open (Target: {role.targetDate})</span>
                    </div>
                  </div>

                  {/* Middle: Clean Linear Graph with Interactive Hover Tooltips */}
                  <div className="flex-1 max-w-md py-1">
                    <div className="w-full h-3 rounded-full bg-slate-100 flex relative border border-slate-200/90 shadow-2xs">
                      {/* Segment 1: Ready to Move */}
                      {role.readyToMoveCount > 0 && (
                        <div 
                          style={{ width: `${readyPct}%` }} 
                          className="h-full bg-emerald-500 first:rounded-l-full last:rounded-r-full transition-all duration-300 hover:brightness-110 cursor-pointer relative group/segment"
                          title={`Ready to Move: ${role.readyToMoveCount} leads (${Math.round(readyPct)}%)`}
                        >
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover/segment:flex flex-col items-center pointer-events-none z-30 whitespace-nowrap">
                            <div className="bg-slate-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-xl flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                              <span>Ready to Move · {role.readyToMoveCount} leads ({Math.round(readyPct)}%)</span>
                            </div>
                            <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
                          </div>
                        </div>
                      )}

                      {/* Segment 2: Qualified */}
                      {role.qualifiedLeadsCount > 0 && (
                        <div 
                          style={{ width: `${qualPct}%` }} 
                          className="h-full bg-(--color-secondary-200) first:rounded-l-full last:rounded-r-full transition-all duration-300 hover:brightness-110 cursor-pointer relative group/segment"
                          title={`Qualified: ${role.qualifiedLeadsCount} leads (${Math.round(qualPct)}%)`}
                        >
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover/segment:flex flex-col items-center pointer-events-none z-30 whitespace-nowrap">
                            <div className="bg-slate-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-xl flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-indigo-300 shrink-0" />
                              <span>Qualified · {role.qualifiedLeadsCount} leads ({Math.round(qualPct)}%)</span>
                            </div>
                            <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
                          </div>
                        </div>
                      )}

                      {/* Segment 3: Warm */}
                      {role.warmLeadsCount > 0 && (
                        <div 
                          style={{ width: `${warmPct}%` }} 
                          className="h-full bg-purple-400 first:rounded-l-full last:rounded-r-full transition-all duration-300 hover:brightness-110 cursor-pointer relative group/segment"
                          title={`Warm: ${role.warmLeadsCount} leads (${Math.round(warmPct)}%)`}
                        >
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover/segment:flex flex-col items-center pointer-events-none z-30 whitespace-nowrap">
                            <div className="bg-slate-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-xl flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-purple-300 shrink-0" />
                              <span>Warm · {role.warmLeadsCount} leads ({Math.round(warmPct)}%)</span>
                            </div>
                            <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
                          </div>
                        </div>
                      )}

                      {/* Fallback if 0 leads */}
                      {totalLeads === 0 && (
                        <div 
                          className="w-full h-full rounded-full bg-slate-200 cursor-pointer"
                          title="No active leads recorded yet"
                        />
                      )}
                    </div>
                  </div>

                  {/* Right: Health Status Indicator & Action Triggers */}
                  <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                    
                    {/* Health Pill */}
                    <div className={cn(
                      "px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold",
                      isHealthy ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                      isAttention ? "bg-rose-50 text-rose-800 border-rose-200" :
                      "bg-amber-50 text-amber-800 border-amber-200"
                    )}>
                      {isHealthy ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : isAttention ? (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span>{role.healthScore}% · {role.healthLabel}</span>
                    </div>

                    {/* Toggle Leads Details Button */}
                    <button
                      type="button"
                      onClick={() => setExpandedRoleId(isExpanded ? null : role.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Leads' : 'Inspect Leads'}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {onNavigateToRoles && (
                      <button
                        type="button"
                        onClick={() => onNavigateToRoles(role.roleTitle)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-(--color-secondary-200) hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Open in Roles & Succession Shadow Bench"
                      >
                        <span>Shadow Bench</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                  </div>

                </div>

                {/* Subtext Strategic Insight */}
                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-(--color-secondary-200) shrink-0" />
                    <span className="font-semibold text-slate-800">Recruiting Calibration:</span>
                    <span>{role.strategicInsight}</span>
                  </div>

                  {role.recentMobilityEvent && (
                    <span className="hidden xl:inline text-[11px] text-(--color-secondary-200) font-medium bg-(--color-secondary-200)/5 px-2 py-0.5 rounded-md border border-(--color-secondary-200)/10 shrink-0">
                      {role.recentMobilityEvent}
                    </span>
                  )}
                </div>

                {/* Expanded Leads Inspection Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-(--color-secondary-200)" />
                        <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Key Calibrated Leads for {role.roleTitle}
                        </h5>
                      </div>

                      <div className="flex items-center gap-2">
                        {onNurtureRoleWarmPool && (
                          <button
                            type="button"
                            onClick={() => onNurtureRoleWarmPool(role.roleTitle)}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Bot className="w-3.5 h-3.5" />
                            <span>Nurture {role.warmLeadsCount} Warm Leads</span>
                          </button>
                        )}

                        {onNavigateToProjects && (
                          <button
                            type="button"
                            onClick={onNavigateToProjects}
                            className="px-2.5 py-1 rounded-lg bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>Open Search Pipeline</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Candidate Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {role.topLeads.map((lead) => {
                        const isReady = lead.status === 'ready_to_move';
                        const isQual = lead.status === 'qualified';

                        return (
                          <div 
                            key={lead.id}
                            className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-(--color-secondary-200)/30 hover:shadow-2xs transition-all space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <img 
                                  src={lead.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80'} 
                                  alt={lead.name}
                                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" 
                                />
                                <div>
                                  <h6 className="text-xs font-bold text-slate-900">{lead.name}</h6>
                                  <div className="text-[11px] text-slate-500">
                                    {lead.currentRole} at <strong className="text-slate-700">{lead.company}</strong>
                                  </div>
                                </div>
                              </div>

                              <span className={cn(
                                "px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0",
                                isReady ? "bg-emerald-100 text-emerald-800" :
                                isQual ? "bg-purple-100 text-(--text-brand-secondary-dark)" :
                                "bg-amber-100 text-amber-800"
                              )}>
                                {isReady ? 'Ready to Move' : isQual ? 'Qualified' : 'Warm'}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 leading-relaxed">
                              {lead.fitSummary}
                            </p>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                              <span>Mobility: <strong className="text-(--color-secondary-200) font-bold">{lead.mobilityScore}%</strong></span>
                              <span>Touchpoint: {lead.lastTouchpoint}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
