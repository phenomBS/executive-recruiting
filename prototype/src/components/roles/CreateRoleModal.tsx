import React, { useEffect, useMemo, useState } from 'react';
import { 
  X, 
  Sparkles, 
  Target, 
  Building2, 
  Users, 
  DollarSign, 
  Layers, 
  Sliders, 
  ShieldAlert, 
  HelpCircle,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Flame,
  Info,
  Eye,
  Check
} from 'lucide-react';
import { RoleSuccessionItem, MathematicalAnchors, ShadowBenchCandidate } from '../../data/rolesSuccessionData';
import { RecommendedRole, findRecommendedMatch } from '../../data/recommendedRolesData';
import { cn } from '../../lib/utils';

interface CreateRoleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: 'active_requisition' | 'succession_bench';
  onCreateRole: (role: RoleSuccessionItem) => void;
  /** Roles the agent already recommends; shown first, and a matching title blocks creation */
  recommendedRoles?: RecommendedRole[];
  onActivateRecommended?: (roleId: string) => void;
  onViewRecommended?: (roleId: string) => void;
}

export function CreateRoleModal({
  isOpen,
  onOpenChange,
  defaultType = 'active_requisition',
  onCreateRole,
  recommendedRoles = [],
  onActivateRecommended,
  onViewRecommended
}: CreateRoleModalProps) {
  const [roleTitle, setRoleTitle] = useState('');
  const [roleType, setRoleType] = useState<'active_requisition' | 'succession_bench'>(defaultType);
  const [department, setDepartment] = useState<'Engineering & AI' | 'Product & Growth' | 'Executive Leadership' | 'Security & Infrastructure' | 'Finance & Corporate'>('Engineering & AI');
  const [level, setLevel] = useState<'C-Suite' | 'SVP' | 'VP' | 'Head of'>('VP');
  const [priorityLevel, setPriorityLevel] = useState<'P0 - Critical' | 'P1 - High' | 'P2 - Medium' | 'P3 - Strategic'>('P0 - Critical');
  
  // Mathematical Anchors
  const [targetRevenueScale, setTargetRevenueScale] = useState('$500M - $1.5B ARR');
  const [targetHeadcountScope, setTargetHeadcountScope] = useState('250 - 600 Engineers');
  const [sfaWeight, setSfaWeight] = useState(40);
  const [cmaWeight, setCmaWeight] = useState(35);
  const [ptmWeight, setPtmWeight] = useState(25);
  
  // Operational details
  const [hiringManager, setHiringManager] = useState('Executive Hiring Committee');
  const [targetDate, setTargetDate] = useState('Nov 30, 2026');
  const [description, setDescription] = useState('');

  const duplicate = useMemo(() => findRecommendedMatch(roleTitle, recommendedRoles), [roleTitle, recommendedRoles]);

  // Bring the duplicate warning into view when it appears
  useEffect(() => {
    if (duplicate) document.getElementById('create-role-duplicate')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [duplicate?.id]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim() || duplicate) return;

    const newAnchors: MathematicalAnchors = {
      targetRevenueScale,
      targetHeadcountScope,
      priorityLevel,
      sfaWeight,
      cmaWeight,
      ptmWeight,
      orgComplexityScore: 9,
      geographicFlexibility: 'Hybrid (2-3 days)'
    };

    // Generate initial shadow bench candidates with realistic live signal events
    const initialCandidates: ShadowBenchCandidate[] = [
      {
        id: `cand-${Date.now()}-1`,
        name: 'Alexandra Hayes',
        currentTitle: `${level} of ${department === 'Engineering & AI' ? 'Engineering Systems' : 'Strategic Operations'}`,
        company: 'Salesforce',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
        location: 'San Francisco, CA',
        tenureInRole: '3 yrs 10 mos',
        currentCompEst: '$1.3M TC',
        emiScore: 95,
        sfaScore: 96,
        cmaScore: 93,
        ptmScore: 92,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'sec_filing',
          text: '⚠️ SEC Form 4: Vesting cliff in 30 days ($1.4M tranche)',
          source: 'SEC Edgar Form 4',
          date: 'Yesterday at 4:30 PM',
          severity: 'urgent',
          details: 'Final milestone vest on initial executive hire grant. Low unvested balance.'
        },
        stage: 'Calibrated',
        benchReadiness: 'Ready Now (0-30d)',
        sfaReason: `Proven scope scaling past ${targetRevenueScale} with ${targetHeadcountScope} oversight.`,
        cmaReason: 'Seeking primary ownership mandate and accelerated leadership scope.',
        ptmReason: 'Equity grant cliff expiring and restructuring rumors.',
        notesCount: 2
      },
      {
        id: `cand-${Date.now()}-2`,
        name: 'David K. Lawson',
        currentTitle: `${level} of Core Systems`,
        company: 'Stripe',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
        location: 'Seattle, WA',
        tenureInRole: '4 yrs 2 mos',
        currentCompEst: '$1.45M TC',
        emiScore: 92,
        sfaScore: 94,
        cmaScore: 90,
        ptmScore: 89,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'restructuring',
          text: '📰 Event Registry: Executive reorganization in infrastructure operations',
          source: 'Event Registry Intelligence',
          date: '3 days ago',
          severity: 'urgent',
          details: 'Internal leadership reporting structure realignment announced.'
        },
        stage: 'Warm Outreach',
        benchReadiness: 'Ready Now (0-30d)',
        sfaReason: 'High parity with target revenue scale and operational velocity.',
        cmaReason: 'Ready for full C-suite / VP seat with board reporting exposure.',
        ptmReason: 'Blocked #2 succession position behind long-tenured incumbent.',
        notesCount: 3
      },
      {
        id: `cand-${Date.now()}-3`,
        name: 'Rachel Sterling',
        currentTitle: `Senior Director of ${roleTitle}`,
        company: 'Snowflake',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
        location: 'Bellevue, WA',
        tenureInRole: '2 yrs 6 mos',
        currentCompEst: '$1.1M TC',
        emiScore: 88,
        sfaScore: 90,
        cmaScore: 87,
        ptmScore: 72,
        ptmLevel: 'Medium',
        liveSignalAlert: {
          type: 'sec_filing',
          text: '⚠️ SEC Form 144: Routine Rule 10b5-1 stock plan liquidation',
          source: 'SEC Edgar Form 144',
          date: '5 days ago',
          severity: 'standard',
          details: 'Quarterly liquidity diversification executed.'
        },
        stage: 'Identified',
        benchReadiness: 'Ready in 3-6mo',
        sfaReason: 'Strong architectural discipline and enterprise scale experience.',
        cmaReason: 'Seeking step-up to primary executive title.',
        ptmReason: 'Moderate flight risk based on career velocity.',
        notesCount: 1
      }
    ];

    const newRole: RoleSuccessionItem = {
      id: `role-user-${Date.now()}`,
      roleTitle,
      type: roleType,
      department,
      level,
      priorityLevel,
      status: roleType === 'active_requisition' ? 'Active Sourcing' : 'Bench Monitoring',
      hiringManager,
      hiringManagerTitle: 'Executive Leadership',
      hiringManagerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
      targetDate: roleType === 'active_requisition' ? targetDate : 'Evergreen (Continuous)',
      daysOpenOrMonitored: 1,
      anchors: newAnchors,
      totalCandidatesTracked: initialCandidates.length,
      highFlightRiskCount: initialCandidates.filter(c => c.ptmLevel === 'High').length,
      avgEmiMatch: Math.round(initialCandidates.reduce((acc, c) => acc + c.emiScore, 0) / initialCandidates.length),
      benchReadinessRate: 85,
      description: description.trim() || `Executive mandate for ${roleTitle} with AI-calibrated anchors.`,
      riskSummary: `Priority ${priorityLevel} mandate. AI anchors calibrated for ${targetRevenueScale} and ${targetHeadcountScope}.`,
      candidates: initialCandidates
    };

    onCreateRole(newRole);
    onOpenChange(false);
  };

  const revenuePresets = [
    '$100M - $500M ARR',
    '$500M - $1.5B ARR',
    '$2B+ Global Enterprise',
    '$5B+ Public Market Scale'
  ];

  const headcountPresets = [
    '50 - 150 Team Members',
    '250 - 600 Engineers',
    '600 - 1,500 Org Scope',
    '2,000+ Global R&D'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-(--color-secondary-200) text-white flex items-center justify-center font-bold shadow-sm">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Create Role
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Establish the mathematical parameters required for real-time PTM, SFA & CMA matching
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Recommended by the agent: activate one of these instead of creating a new role */}
            {recommendedRoles.length > 0 && (
              <section aria-labelledby="create-role-recs" className="rounded-2xl border border-(--border-light) bg-(--bg-brand-secondary-subtle) p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-(--color-secondary-200) shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 id="create-role-recs" className="text-sm font-semibold text-(--text-strong)">Recommended by the agent</h3>
                    <p className="text-sm text-(--text-default) mt-0.5">The agent already built a shadow bench for these roles. Activate one instead of starting from scratch.</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {recommendedRoles.map(r => (
                    <li
                      key={r.id}
                      className={cn(
                        'flex items-center justify-between gap-3 rounded-xl border bg-(--bg-default) p-3',
                        duplicate?.id === r.id ? 'border-(--feedback-warning-bg-default) ring-1 ring-(--feedback-warning-bg-default)' : 'border-(--border-light)'
                      )}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-(--text-strong)">{r.roleTitle}</div>
                        <div className="text-sm text-(--text-default)">{r.totalCandidatesTracked} on the bench · Avg EMI {r.avgEmiMatch}%</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={() => onViewRecommended?.(r.id)}>
                          <Eye className="w-4 h-4" aria-hidden="true" /> View
                        </button>
                        <button type="button" className="phx-btn" data-variant="primary" data-size="sm" onClick={() => onActivateRecommended?.(r.id)}>
                          <Check className="w-4 h-4" aria-hidden="true" /> Activate
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 1. SECTION TYPE TOGGLE (Active Requisition vs Succession Bench) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Role Pipeline Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRoleType('active_requisition')}
                  className={cn(
                    "p-3.5 rounded-xl border text-left transition-all",
                    roleType === 'active_requisition'
                      ? "border-(--color-secondary-200) bg-(--color-secondary-200)/5 ring-1 ring-(--color-secondary-200)"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Active Requisition</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Immediate hiring need with active interview slate & target close date
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRoleType('succession_bench')}
                  className={cn(
                    "p-3.5 rounded-xl border text-left transition-all",
                    roleType === 'succession_bench'
                      ? "border-(--color-secondary-200) bg-(--color-secondary-200)/5 ring-1 ring-(--color-secondary-200)"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Succession Bench</span>
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Evergreen shadow talent pool for future executive flight risk mitigation
                  </p>
                </button>
              </div>
            </div>

            {/* 2. ROLE TITLE & BASIC META */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Role Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Chief Technology Officer or VP of Artificial Intelligence"
                  aria-invalid={Boolean(duplicate)}
                  aria-describedby={duplicate ? 'create-role-duplicate' : undefined}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200) focus:border-transparent"
                />
                {duplicate && (
                  <div id="create-role-duplicate" role="alert" className="phx-feedback mt-3" data-tone="warning">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="text-sm font-semibold">The agent already recommends this role</p>
                      <p className="text-sm leading-relaxed">
                        {duplicate.roleTitle} is recommended, with a shadow bench of {duplicate.totalCandidatesTracked}. {duplicate.recommendation.basis} Activate it instead of creating a duplicate.
                      </p>
                      <div className="flex items-center gap-2">
                        <button type="button" className="phx-btn" data-variant="primary" data-size="sm" onClick={() => onActivateRecommended?.(duplicate.id)}>
                          <Check className="w-4 h-4" aria-hidden="true" /> Activate {duplicate.roleTitle}
                        </button>
                        <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={() => onViewRecommended?.(duplicate.id)}>
                          <Eye className="w-4 h-4" aria-hidden="true" /> View details
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Department / Function
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
                  >
                    <option value="Engineering & AI">Engineering & AI</option>
                    <option value="Product & Growth">Product & Growth</option>
                    <option value="Executive Leadership">Executive Leadership</option>
                    <option value="Security & Infrastructure">Security & Infrastructure</option>
                    <option value="Finance & Corporate">Finance & Corporate</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Executive Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
                  >
                    <option value="C-Suite">C-Suite (CXO)</option>
                    <option value="SVP">Senior Vice President (SVP)</option>
                    <option value="VP">Vice President (VP)</option>
                    <option value="Head of">Head of / General Manager</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. MATHEMATICAL ANCHORS REQUIRED BY AI (Prompt Fields) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
                <Sparkles className="w-4 h-4 text-(--color-secondary-200)" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  AI Mathematical Anchors
                </h3>
                <span className="text-[11px] text-slate-500 ml-auto">
                  Configures SFA & CMA Algorithms
                </span>
              </div>

              {/* Priority Level */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Priority Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['P0 - Critical', 'P1 - High', 'P2 - Medium', 'P3 - Strategic'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriorityLevel(p)}
                      className={cn(
                        "py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all",
                        priorityLevel === p
                          ? p.startsWith('P0') 
                            ? "bg-rose-50 border-rose-300 text-rose-700 ring-1 ring-rose-400"
                            : "bg-(--color-secondary-200)/10 border-(--color-secondary-200) text-(--color-secondary-200) ring-1 ring-(--color-secondary-200)"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      {p.split(' - ')[0]}
                      <span className="block text-[10px] font-normal opacity-80">{p.split(' - ')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Revenue Scale */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Target Revenue Scale Anchor
                  </label>
                  <span className="text-[11px] font-medium text-(--color-secondary-200)">
                    Structural Fit (SFA)
                  </span>
                </div>
                <input
                  type="text"
                  value={targetRevenueScale}
                  onChange={(e) => setTargetRevenueScale(e.target.value)}
                  placeholder="e.g. $500M - $1.5B ARR"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {revenuePresets.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTargetRevenueScale(preset)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-600"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Headcount Scope */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Target Headcount Scope Anchor
                  </label>
                  <span className="text-[11px] font-medium text-(--color-secondary-200)">
                    Org Hierarchy Calibration
                  </span>
                </div>
                <input
                  type="text"
                  value={targetHeadcountScope}
                  onChange={(e) => setTargetHeadcountScope(e.target.value)}
                  placeholder="e.g. 250 - 600 Engineers"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {headcountPresets.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTargetHeadcountScope(preset)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-600"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Mathematical Model Weightings */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">
                  AI Weight Calibration
                </span>
                
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">SFA Weight</span>
                    <div className="flex items-center justify-between font-bold text-indigo-600">
                      <span>Structural Fit</span>
                      <span>{sfaWeight}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="20" 
                      max="60" 
                      value={sfaWeight} 
                      onChange={(e) => setSfaWeight(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">CMA Weight</span>
                    <div className="flex items-center justify-between font-bold text-purple-600">
                      <span>Motivation</span>
                      <span>{cmaWeight}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="20" 
                      max="60" 
                      value={cmaWeight} 
                      onChange={(e) => setCmaWeight(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">PTM Weight</span>
                    <div className="flex items-center justify-between font-bold text-rose-600">
                      <span>Flight Risk</span>
                      <span>{ptmWeight}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="50" 
                      value={ptmWeight} 
                      onChange={(e) => setPtmWeight(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600" 
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* 4. Operational Context */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Hiring Manager / Sponsor
                </label>
                <input
                  type="text"
                  value={hiringManager}
                  onChange={(e) => setHiringManager(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target Close / Trigger Date
                </label>
                <input
                  type="text"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Executive Mandate Scope & Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide strategic context on target executive archetype, key deliverables, and organizational charter..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
              />
            </div>

          </form>

          {/* Footer Actions */}
          <div className="p-5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!roleTitle.trim() || Boolean(duplicate)}
              className="px-5 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Role & Shadow Bench
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
