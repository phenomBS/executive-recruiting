import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Settings, 
  Play, 
  Pause, 
  Sliders, 
  Target, 
  Clock, 
  TrendingUp, 
  Building2, 
  ShieldAlert, 
  CheckCircle2, 
  User, 
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  Layers,
  Network,
  Send,
  Mail,
  Flame,
  ChevronRight,
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAgentConfig } from '../../context/AgentConfigContext';
import { mockCandidates, mockCompanies } from '../../data/mockData';
import { useRestricted } from '../../context/RestrictedContext';
import { cn } from '../../lib/utils';

export function AuraAgentIsolatedView() {
  const { auraConfig, updateAuraConfig, openConfigModal, telemetry } = useAgentConfig();
  const { restrictedCompanies } = useRestricted();
  const [selectedEmiCategory, setSelectedEmiCategory] = useState<'all' | 'cma' | 'ptm' | 'sfa'>('all');
  const [selectedCandidatePreview, setSelectedCandidatePreview] = useState<string>(mockCandidates[0]?.id || 'c-1');

  const isRestricted = (comp: string) => restrictedCompanies.some(rc => rc.name === comp);
  const auraTelemetry = telemetry.filter(t => t.agentId === 'aura' || t.agentId === 'search');
  const candidate = mockCandidates.find(c => c.id === selectedCandidatePreview) || mockCandidates[0];

  const sub = auraConfig.emiWeights.subWeights;

  return (
    <div className="space-y-8">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-purple-900/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-purple-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-inner">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-extrabold tracking-tight">Aura Agent</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Research · Nurturing · EMI Scoring
                  </span>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
                    auraConfig.status === 'active' ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  )}>
                    {auraConfig.status}
                  </span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                  Continuous executive talent research, automated org chart generation, warming nurture campaigns, and comprehensive EMI mobility scoring.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => updateAuraConfig({ status: auraConfig.status === 'active' ? 'paused' : 'active' })}
              className={cn(
                "px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all",
                auraConfig.status === 'active' 
                  ? "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800" 
                  : "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700"
              )}
            >
              {auraConfig.status === 'active' ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause Aura
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Resume Aura
                </>
              )}
            </button>

            <button
              onClick={() => openConfigModal('aura')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 shadow-sm transition-all"
            >
              <Settings className="w-4 h-4" /> Configure Aura & EMI
            </button>
          </div>
        </div>

        {/* Quick Config Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-purple-900/60 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">EMI Macro Calibration</span>
            <span className="font-bold text-white mt-0.5 block">
              CMA {auraConfig.emiWeights.cma}% · PTM {auraConfig.emiWeights.ptm}% · SFA {auraConfig.emiWeights.sfa}%
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Warming Campaigns</span>
            <span className="font-bold text-purple-300 mt-0.5 block flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              {auraConfig.nurturing.warmingCampaignsActive ? 'Active (Every 14d)' : 'Paused'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Research Sync Cadence</span>
            <span className="font-bold text-white mt-0.5 block capitalize">
              {auraConfig.research.syncCadence} (Level 3 Depth)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Auto-Pipeline Gate</span>
            <span className="font-bold text-emerald-400 mt-0.5 block">
              {auraConfig.research.minEmiToPipeline}+ EMI Threshold
            </span>
          </div>
        </div>
      </div>

      {/* SECTION: Comprehensive EMI Scoring Logic Breakdown (from Discussion) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
              <h2 className="text-lg font-bold text-slate-900">EMI Scoring Logic Breakdown</h2>
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded">
                Executive Mobility Indicator (EMI)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active algorithmic scoring matrix driving executive mobility signals, push-to-move factors, and requisition fit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openConfigModal('aura')}
              className="text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" /> Adjust EMI Weights
            </button>
          </div>
        </div>

        {/* 3 Macro Pillars Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PILLAR 1: CMA (Motivation Alignment) 40% */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-5 space-y-4 hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Category 1</span>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  CMA (Motivation Alignment)
                  <span className="text-xs font-black bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    {auraConfig.emiWeights.cma}%
                  </span>
                </h3>
              </div>
            </div>

            {/* Sub-weights list */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">"Step-Up" Delta (title promotion)</span>
                  <span className="font-mono font-bold text-purple-700">{sub.cmaStepUpDelta}%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Comparing current title to open req (e.g. VP to SVP / C-Suite scope increase).
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Scale Expansion</span>
                  <span className="font-mono font-bold text-purple-700">{sub.cmaScaleExpansion}%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Comparing current P&L and Company Size to open req ($500M+ revenue, headcounts).
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Profile Match</span>
                  <span className="font-mono font-bold text-purple-700">{sub.cmaProfileMatch}%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Matching career experience data, accomplishments, and domain depth to req.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Geo / Lifestyle</span>
                  <span className="font-mono font-bold text-purple-700">{sub.cmaGeoLifestyle}%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Matching location, work model (hybrid/remote), and relocation willingness.
                </p>
              </div>
            </div>
          </div>

          {/* PILLAR 2: PTM (Propensity to Move) 35% */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-5 space-y-4 hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Category 2</span>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  PTM (Propensity to Move)
                  <span className="text-xs font-black bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                    {auraConfig.emiWeights.ptm}%
                  </span>
                </h3>
              </div>
            </div>

            {/* Sub-weights list */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Organizational Instability</span>
                  <span className="font-mono font-bold text-indigo-700">{sub.ptmOrgInstability}%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Looking at company stock changes, executive turnover, news events, and corporate transformation.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Equity Vesting Cliffs</span>
                  <span className="font-mono font-bold text-indigo-700">{sub.ptmEquityVestingCliffs}%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Calculates distance to 36-month and 48-month marks (standard 4-year cliffs). Scores spike 60 days prior.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">"Blocked #2" Status</span>
                  <span className="font-mono font-bold text-indigo-700">{sub.ptmBlockedNumberTwo}%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  If candidate is a VP, and the SVP above has start date &lt; 2 yrs ago, candidate is flagged as structurally blocked.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Tenure Stagnation</span>
                  <span className="font-mono font-bold text-indigo-700">{sub.ptmTenureStagnation}%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Scores scale linearly as tenure surpasses 48 months (4 years) without an internal promotion or title change.
                </p>
              </div>
            </div>
          </div>

          {/* PILLAR 3: SFA (Structural Fit) 25% */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-5 space-y-4 hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Category 3</span>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  SFA (Structural Fit)
                  <span className="text-xs font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {auraConfig.emiWeights.sfa}%
                  </span>
                </h3>
              </div>
            </div>

            {/* Sub-weights list */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Compensation Parity</span>
                  <span className="font-mono font-bold text-blue-700">{sub.sfaCompensationParity}%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  If candidate estimated comp &gt; requisition max budget by more than 15%, SFA score drops drastically.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Operational Scope Match</span>
                  <span className="font-mono font-bold text-blue-700">{sub.sfaOperationalScope}%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Technical keyword, organizational entity, and engineering architecture overlap percentage.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Off-Limits & Legal Constraints</span>
                  <span className="font-mono font-bold text-blue-700">{sub.sfaOffLimitsLegal}%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Do Not Poach agreements, non-competes, and garden leave status (kill switch if company is off-limits).
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Notice Period</span>
                  <span className="font-mono font-bold text-blue-700">{sub.sfaNoticePeriod}%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Comparing candidate availability notice period with requisition target search launch date.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION: Executive Research & Warming Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Executive Warming Campaigns Running */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Executive Warming Campaigns Running</h3>
                <p className="text-xs text-slate-500">Aura Agent autonomous thought-leadership and peer touches</p>
              </div>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
              42 Active Cadences
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  Enterprise Semiconductor & Systems Leaders
                </div>
                <p className="text-slate-500 text-[11px]">
                  Delivering quarterly research memos on 2nm silicon packaging · 34 Executives Enrolled
                </p>
              </div>
              <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                78.2% Open Rate
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Global Cloud Infrastructure VPs
                </div>
                <p className="text-slate-500 text-[11px]">
                  Peer analysis on GPU cluster topology & capital expense shifts · 28 Executives Enrolled
                </p>
              </div>
              <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                71.5% Open Rate
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  Fintech & Cyber Security C-Suite VIPs
                </div>
                <p className="text-slate-500 text-[11px]">
                  Discreet regulatory compliance briefings & peer roundtables · 19 Executives Enrolled
                </p>
              </div>
              <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                68.0% Open Rate
              </span>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
            <span className="text-purple-800">
              <strong>Aura Warming Governance:</strong> Max 3 touchpoints/quarter, 21-day cooling period, zero recruiter spam.
            </span>
            <button
              onClick={() => openConfigModal('aura')}
              className="text-purple-700 font-bold hover:underline shrink-0 ml-2"
            >
              Configure Nurture
            </button>
          </div>
        </div>

        {/* Dynamic Org Charts & Talent Research */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Org Charts Generated & Indexed</h3>
                <p className="text-xs text-slate-500">Autonomous corporate reporting hierarchy synthesis</p>
              </div>
            </div>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-full">
              348 Live Org Trees
            </span>
          </div>

          {/* Org Chart Visualization Preview */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-600" /> NVIDIA Corporation (Enterprise Systems)
              </span>
              <span className="text-slate-500 text-[11px]">Depth: C-Suite &rarr; SVP &rarr; VP</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-purple-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold">
                    CEO
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Jensen Huang</span>
                    <span className="text-slate-500 ml-1.5 text-[11px]">President & CEO</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  EMI 94
                </span>
              </div>

              <div className="ml-6 pl-4 border-l-2 border-purple-200 space-y-2">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                      EVP
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Debora Shoquist</span>
                      <span className="text-slate-500 ml-1.5 text-[11px]">EVP Operations</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    EMI 89
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                      SVP
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Jonah Alben</span>
                      <span className="text-slate-500 ml-1.5 text-[11px]">SVP GPU Engineering</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    EMI 82
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Market coverage: 14 target companies mapped</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 14,820 Executives Indexed
            </span>
          </div>
        </div>

      </div>

      {/* SECTION: Recent Aura Agent Telemetry Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Aura Agent Research & Scoring Stream</h3>
          </div>
          <span className="text-xs text-slate-400">Live background sync</span>
        </div>

        <div className="divide-y divide-slate-100">
          {auraTelemetry.slice(0, 5).map(item => (
            <div key={item.id} className="py-3.5 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{item.title}</span>
                  {item.targetCompany && (
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {item.targetCompany}
                    </span>
                  )}
                  {item.targetCandidate && (
                    <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                      {item.targetCandidate}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{item.details}</p>
              </div>
              <span className="text-slate-400 text-[11px] whitespace-nowrap shrink-0">{item.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
