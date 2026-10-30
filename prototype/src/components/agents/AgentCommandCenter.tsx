import React, { useState } from 'react';
import { 
  Bot, 
  BrainCircuit, 
  Sparkles, 
  Settings, 
  Sliders, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Activity, 
  Users, 
  Building2, 
  TrendingUp, 
  Filter, 
  Check, 
  AlertTriangle,
  Play,
  Pause,
  Layers,
  ArrowUpRight,
  Flame,
  Network,
  MailCheck,
  Percent,
  Briefcase,
  BookOpen,
  Compass,
  BarChart3,
  Target,
  Award
} from 'lucide-react';
import { useAgentConfig } from '../../context/AgentConfigContext';
import { AuraAgentIsolatedView } from './AuraAgentIsolatedView';
import { PrimeAgentIsolatedView } from './PrimeAgentIsolatedView';
import { AgentConfigModal } from './AgentConfigModal';
import { cn } from '../../lib/utils';
import { useRouter } from '../../context/RouterContext';

export function AgentCommandCenter() {
  const router = useRouter();
  const { 
    activeAgentTab, 
    setActiveAgentTab, 
    openConfigModal, 
    auraConfig, 
    updateAuraConfig, 
    primeConfig, 
    updatePrimeConfig, 
    telemetry 
  } = useAgentConfig();

  // Sync tab with router if URL specifies agentTab
  React.useEffect(() => {
    if (router.agentTab === 'aura' || router.agentTab === 'search') {
      setActiveAgentTab('aura');
    } else if (router.agentTab === 'prime') {
      setActiveAgentTab('prime');
    }
  }, [router.agentTab, setActiveAgentTab]);

  const handleTabClick = (tab: 'all' | 'aura' | 'prime') => {
    setActiveAgentTab(tab);
    router.setAgentTab(tab === 'all' ? null : tab);
  };

  const [telemetryFilter, setTelemetryFilter] = useState<'all' | 'aura' | 'prime'>('all');

  const filteredTelemetry = telemetry.filter(item => {
    if (telemetryFilter === 'all') return true;
    if (telemetryFilter === 'aura') return item.agentId === 'aura' || item.agentId === 'search';
    return item.agentId === 'prime';
  });

  return (
    <div className="p-6 sm:p-8 max-w-[1600px] mx-auto w-full flex flex-col space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-(--text-strong)">Agent Command Center</h1>
            <span className="bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full text-xs tracking-wide">
              Dual Executive Agents
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure, govern, and monitor autonomous executive intelligence agents across candidate research, warming nurturing, and executive search project delivery.
          </p>
        </div>

        {/* Global Quick Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openConfigModal(activeAgentTab === 'prime' ? 'prime' : 'aura')}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Configure Agents</span>
          </button>
        </div>
      </div>

      {/* Phenom Horizontal View Switcher Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl shadow-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleTabClick('all')}
          className={cn(
            "px-6 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2",
            activeAgentTab === 'all' 
              ? "border-purple-600 text-purple-700 bg-purple-50/20" 
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <Layers className="w-4 h-4" />
          <span>Combined Overview (Dual Agents)</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold ml-1">2 Active</span>
        </button>

        <button
          onClick={() => handleTabClick('aura')}
          className={cn(
            "px-6 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2",
            activeAgentTab === 'aura' || activeAgentTab === 'search'
              ? "border-purple-600 text-purple-700 bg-purple-50/20" 
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <BrainCircuit className="w-4 h-4 text-purple-600" />
          <span>Aura Agent</span>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold ml-1">
            Research · Nurturing · EMI
          </span>
        </button>

        <button
          onClick={() => handleTabClick('prime')}
          className={cn(
            "px-6 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2",
            activeAgentTab === 'prime' 
              ? "border-blue-600 text-blue-700 bg-blue-50/20" 
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <Briefcase className="w-4 h-4 text-blue-600" />
          <span>Prime Agent</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold ml-1">
            Search Project Agent
          </span>
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      {(activeAgentTab === 'aura' || activeAgentTab === 'search') && <AuraAgentIsolatedView />}
      {activeAgentTab === 'prime' && <PrimeAgentIsolatedView />}

      {activeAgentTab === 'all' && (
        <div className="space-y-8">
          
          {/* CUSTOMER VALUE KPIS BAR (ALL REQUESTED METRICS) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Agent Actions & Value Analytics
              </span>
              <span className="text-xs text-slate-400 font-medium">Real-time enterprise metrics & predictive intelligence</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5">
              
              {/* Metric 1: Executives Indexed or Updated */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Executives Indexed</span>
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="text-xl font-black text-slate-900">14,820</div>
                <div className="text-[10px] text-slate-500 truncate">
                  +1,240 updated this mo.
                </div>
              </div>

              {/* Metric 2: Company Org Charts Created */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Org Charts Created</span>
                  <Network className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="text-xl font-black text-purple-700">348</div>
                <div className="text-[10px] text-slate-500 truncate">
                  Hierarchy trees mapped
                </div>
              </div>

              {/* Metric 3: Market Maps Created */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Market Maps Created</span>
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="text-xl font-black text-indigo-700">86</div>
                <div className="text-[10px] text-slate-500 truncate">
                  Competitor talent maps
                </div>
              </div>

              {/* Metric 4: Search Books Generated */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Search Books</span>
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-xl font-black text-blue-700">124</div>
                <div className="text-[10px] text-slate-500 truncate">
                  Client pitch dossiers
                </div>
              </div>

              {/* Metric 5: Executive Campaigns Running */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Campaigns Running</span>
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-xl font-black text-amber-600">42 Active</div>
                <div className="text-[10px] text-slate-500 truncate">
                  Warming & nurturing
                </div>
              </div>

              {/* Metric 6: Executive Open Rate */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Exec Open Rate</span>
                  <Percent className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-emerald-600">71.4%</div>
                <div className="text-[10px] text-emerald-700 font-semibold truncate">
                  +28% vs benchmark
                </div>
              </div>

              {/* Metric 7: EMI to Hire Correlation */}
              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-1 bg-emerald-50/20">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">EMI → Hire Ratio</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-emerald-700">4.2x</div>
                <div className="text-[10px] text-emerald-800 font-semibold truncate">
                  Higher for EMI ≥ 80
                </div>
              </div>

            </div>
          </div>

          {/* EMI TO HIRE CORRELATION & VALUE ANALYTICS DEEP DIVE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">EMI to Hire Correlation Analysis</h3>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Predictive Research
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Analyzing whether higher Executive Mobility Indicator (EMI) candidates correlate with higher placement rates
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Correlation: <strong>+0.78 (Strong Positive)</strong></span>
              </div>
            </div>

            {/* Answer Callout Banner */}
            <div className="my-5 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Key Finding: Are higher EMI candidates hired more than low EMI?
                </div>
                <p className="text-sm font-semibold text-emerald-950">
                  Yes. Candidates with an EMI score ≥ 80 are <span className="underline decoration-emerald-500 font-black">4.2x more likely to be hired</span> than those with EMI &lt; 60, with a 38% faster time-to-offer.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-6 border-t md:border-t-0 md:border-l border-emerald-200 pt-3 md:pt-0 md:pl-6 text-xs">
                <div>
                  <div className="text-slate-500 text-[11px]">Avg. Days to Hire</div>
                  <div className="font-bold text-slate-900 text-base">44 Days <span className="text-emerald-700 text-xs font-normal">(-41%)</span></div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Offer Acceptance</div>
                  <div className="font-bold text-slate-900 text-base">91.4% <span className="text-emerald-700 text-xs font-normal">(vs 41%)</span></div>
                </div>
              </div>
            </div>

            {/* 3-Tier Conversion Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tier 1: High EMI */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">High EMI (80–100)</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">148 Hired</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-700">43.8%</div>
                  <div className="text-xs text-slate-600 mt-0.5">Interview-to-Hire Conversion Rate</div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '43.8%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Cycle: <strong>44 days</strong></span>
                  <span>Response: <strong>68.2%</strong></span>
                </div>
              </div>

              {/* Tier 2: Moderate EMI */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Moderate EMI (60–79)</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">65 Hired</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-800">19.2%</div>
                  <div className="text-xs text-slate-600 mt-0.5">Interview-to-Hire Conversion Rate</div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '19.2%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Cycle: <strong>72 days</strong></span>
                  <span>Response: <strong>34.5%</strong></span>
                </div>
              </div>

              {/* Tier 3: Low EMI */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Low EMI (&lt;60)</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600">14 Hired</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-600">10.4%</div>
                  <div className="text-xs text-slate-600 mt-0.5">Interview-to-Hire Conversion Rate</div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-400 h-2 rounded-full" style={{ width: '10.4%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Cycle: <strong>118 days</strong></span>
                  <span>Response: <strong>14.1%</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* SUMMARIZED AGENT ACTIVITY (LAST 30 DAYS) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Summarized Agent Activity (Last 30 Days)</h3>
                  <p className="text-xs text-slate-500">Autonomous milestones and enterprise output across Aura and Prime agents</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                Active Governance: Strict
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aura Agent Activity Summary */}
              <div className="p-5 rounded-xl border border-purple-100 bg-purple-50/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-purple-900">Aura Agent Activity Summary</span>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    Research · Nurturing · EMI
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                    <span><strong>14,820 executive profiles indexed:</strong> Continuous mobility tracking across 14 target competitor markets.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                    <span><strong>348 org charts generated:</strong> Dynamic reporting line trees updated with C-suite and VP structural shifts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                    <span><strong>86 market maps created:</strong> Tier 1 & adjacent talent pools mapped across technology and enterprise domains.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                    <span><strong>42 warming campaigns active:</strong> 71.4% executive open rate maintained with zero recruiter spam complaints.</span>
                  </li>
                </ul>
              </div>

              {/* Prime Agent Activity Summary */}
              <div className="p-5 rounded-xl border border-blue-100 bg-blue-50/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-blue-900">Prime Agent Activity Summary</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Search Project Delivery
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span><strong>124 search books assembled:</strong> Comprehensive executive candidate dossiers and client presentations.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span><strong>92 active search requisitions served:</strong> High-level brand voice and calibration gates enforced.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span><strong>18 client off-limits guardrails enforced:</strong> 84 restricted contacts auto-suppressed to safeguard client relationships.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span><strong>812 partner-authorized inquiries dispatched:</strong> Custom archetype voice adherence verified before transmission.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Side-by-Side Dual Agent Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* AGENT 1: Aura Agent Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-purple-300 transition-all">
              <div>
                <div className="p-6 border-b border-slate-100 flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <BrainCircuit className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">Aura Agent</h3>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-purple-100 text-purple-800">
                          Research · Nurturing · EMI
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-bold uppercase",
                          auraConfig.status === 'active' ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        )}>
                          {auraConfig.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Executive research, talent market mapping, warming campaigns & EMI mobility scoring
                      </p>
                    </div>
                  </div>

                  {/* Gear Icon Quick Launch */}
                  <button
                    onClick={() => openConfigModal('aura')}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                    title="Configure Aura Agent"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {/* Key Highlights */}
                  <div className="grid grid-cols-3 gap-3 text-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">CMA Weight</span>
                      <div className="text-sm font-extrabold text-purple-700">{auraConfig.emiWeights.cma}%</div>
                      <span className="text-[9px] text-slate-400 block">Step-Up & Scale</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">PTM Weight</span>
                      <div className="text-sm font-extrabold text-indigo-700">{auraConfig.emiWeights.ptm}%</div>
                      <span className="text-[9px] text-slate-400 block">Cliffs & Turmoil</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">SFA Weight</span>
                      <div className="text-sm font-extrabold text-blue-700">{auraConfig.emiWeights.sfa}%</div>
                      <span className="text-[9px] text-slate-400 block">Comp & Off-Limits</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Auto-Pipeline Threshold:</span>
                      <span className="font-bold text-slate-800">EMI ≥ {auraConfig.research.minEmiToPipeline}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Warming Campaigns:</span>
                      <span className="font-bold text-amber-600 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        {auraConfig.nurturing.warmingCampaignsActive ? '42 Active (14d interval)' : 'Paused'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Market Research Sync:</span>
                      <span className="font-bold text-slate-800 capitalize">{auraConfig.research.syncCadence} Cycle</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Org Chart Depth:</span>
                      <span className="font-bold text-slate-800">Level {auraConfig.research.orgChartDepthLevels} (C-Suite &rarr; VP)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs text-purple-900 leading-relaxed">
                    <strong>Aura Focus:</strong> Sourcing candidate pools from live competitor maps, synthesizing reporting hierarchies, and tracking mobility inflection points.
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <button
                  onClick={() => openConfigModal('aura')}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" /> Configure Aura & EMI
                </button>

                <button
                  onClick={() => setActiveAgentTab('aura')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>View Aura Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* AGENT 2: Prime Agent Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-blue-300 transition-all">
              <div>
                <div className="p-6 border-b border-slate-100 flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">Prime Agent</h3>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-blue-100 text-blue-800">
                          Search Project Agent
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-bold uppercase",
                          primeConfig.status === 'active' ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        )}>
                          {primeConfig.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Executive search project execution, candidate calibration & retained outreach
                      </p>
                    </div>
                  </div>

                  {/* Gear Icon Quick Launch */}
                  <button
                    onClick={() => openConfigModal('prime')}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    title="Configure Prime Agent"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {/* Key Highlights */}
                  <div className="grid grid-cols-3 gap-3 text-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Search Persona</span>
                      <div className="text-xs font-extrabold text-blue-700 truncate mt-0.5">
                        {primeConfig.projectVoice?.archetype || 'Search Partner'}
                      </div>
                      <span className="text-[9px] text-slate-400 block">Formality: {primeConfig.projectVoice?.toneFormality || 4}/5</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Calibration Gate</span>
                      <div className="text-sm font-extrabold text-blue-700">
                        {primeConfig.projectRules?.minCalibrationScore || 80}%+
                      </div>
                      <span className="text-[9px] text-slate-400 block">Auto-Longlist</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Target SLA</span>
                      <div className="text-sm font-extrabold text-emerald-600">
                        {primeConfig.projectRules?.targetDaysToFirstSlate || 14} Days
                      </div>
                      <span className="text-[9px] text-slate-400 block">First Slate Delivery</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Confidentiality Protocol:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[220px]">
                        {primeConfig.projectVoice?.confidentialityProtocol || 'Strictly Confidential Blind Teaser'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Client Off-Limits:</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        100% Policy Enforced
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Active Search Mandates:</span>
                      <span className="font-bold text-slate-800">3 Retained Searches in Progress</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">C-Suite Governance Gate:</span>
                      <span className="font-bold text-amber-700">Partner Sign-Off Required</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                    <strong>Prime Focus:</strong> Delivering active retained searches, calibrating candidate slates against client requirements, and managing confidential executive inquiries.
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <button
                  onClick={() => openConfigModal('prime')}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" /> Adjust Voice & Rules
                </button>

                <button
                  onClick={() => setActiveAgentTab('prime')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>View Prime Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Unified Real-Time Telemetry Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Combined Dual Agent Telemetry Stream</h3>
                  <p className="text-xs text-slate-500">Real-time decisions, research mapping, and governance blocks</p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setTelemetryFilter('all')}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-all",
                    telemetryFilter === 'all' ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  All Events ({telemetry.length})
                </button>
                <button
                  onClick={() => setTelemetryFilter('aura')}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-all",
                    telemetryFilter === 'aura' ? "bg-white text-purple-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Aura Research & Scoring
                </button>
                <button
                  onClick={() => setTelemetryFilter('prime')}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-all",
                    telemetryFilter === 'prime' ? "bg-white text-blue-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Prime Project Execution
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredTelemetry.map(item => (
                <div key={item.id} className="py-3.5 flex items-start justify-between gap-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold mt-0.5",
                      item.agentId === 'prime' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    )}>
                      {item.agentId === 'prime' ? 'P' : 'A'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.title}</span>
                        {item.targetCompany && (
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            {item.targetCompany}
                          </span>
                        )}
                        {item.targetCandidate && (
                          <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                            {item.targetCandidate}
                          </span>
                        )}
                        {item.severity === 'blocked' && (
                          <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Blocked
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed max-w-4xl">{item.details}</p>
                    </div>
                  </div>

                  <span className="text-slate-400 text-[11px] whitespace-nowrap shrink-0">{item.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Global Config Modal */}
      <AgentConfigModal />
    </div>
  );
}
