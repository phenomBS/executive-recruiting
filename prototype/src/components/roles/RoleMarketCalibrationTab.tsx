import React, { useState } from 'react';
import { RoleSuccessionItem } from '../../data/rolesSuccessionData';
import { getSearchIntelligenceForRole, SearchIntelligenceData } from '../../data/projectSearchIntelligenceData';
import { buildPdf, downloadBlob, PdfBlock } from '../../lib/simplePdf';
import { 
  DollarSign, 
  Users, 
  MapPin, 
  Building2, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Sliders, 
  Compass, 
  FileSpreadsheet, 
  CalendarPlus, 
  ChevronRight, 
  Layers, 
  Briefcase, 
  ShieldAlert, 
  ArrowUpRight, 
  Info, 
  Download, 
  Check 
} from 'lucide-react';
import { IntakeMeetingModal } from '../IntakeMeetingModal';

interface RoleMarketCalibrationTabProps {
  role: RoleSuccessionItem;
}

export function RoleMarketCalibrationTab({ role }: RoleMarketCalibrationTabProps) {
  const data: SearchIntelligenceData = getSearchIntelligenceForRole(role);

  const [appliedFilterIds, setAppliedFilterIds] = useState<string[]>([]);
  const [clientBaseBudget, setClientBaseBudget] = useState<number>(data.compensation.clientBudgetBase);
  const [showIntakeModal, setShowIntakeModal] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  // Toggle filter
  const toggleFilter = (filterId: string) => {
    if (appliedFilterIds.includes(filterId)) {
      setAppliedFilterIds(appliedFilterIds.filter(id => id !== filterId));
    } else {
      setAppliedFilterIds([...appliedFilterIds, filterId]);
    }
  };

  // Calculate dynamic TAM based on applied filters
  const calculateDynamicTAM = () => {
    let currentPool = data.talentPool.baselineTAM;
    appliedFilterIds.forEach(filterId => {
      const filter = data.talentPool.interactiveFilters.find(f => f.id === filterId);
      if (filter) {
        // e.g. -68% means 32% remains
        const multiplier = (100 + filter.impactPercent) / 100;
        currentPool = Math.round(currentPool * Math.max(multiplier, 0.05));
      }
    });
    return Math.max(currentPool, 18);
  };

  const dynamicTAM = calculateDynamicTAM();
  const poolDropPercentage = Math.round(((data.talentPool.baselineTAM - dynamicTAM) / data.talentPool.baselineTAM) * 100);

  // Compute budget percentile indicator
  const getBudgetPercentileLabel = (budget: number) => {
    const { p25, median, p75 } = data.compensation.baseSalary;
    if (budget < p25) {
      const pct = Math.max(Math.round((budget / p25) * 25), 5);
      return {
        label: `< 25th Percentile (~${pct}th)`,
        status: 'high_risk',
        color: 'text-rose-700 bg-rose-50 border-rose-200',
        message: 'Severe rejection risk: 24%+ below market median.'
      };
    } else if (budget < median) {
      const pct = Math.round(25 + ((budget - p25) / (median - p25)) * 25);
      return {
        label: `${pct}th Percentile (Below Median)`,
        status: 'caution',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        message: 'Constrained tier: mostly step-up directors or candidates from lower-comp geos.'
      };
    } else if (budget <= p75) {
      const pct = Math.round(50 + ((budget - median) / (p75 - median)) * 25);
      return {
        label: `${pct}th Percentile (Market Competitive)`,
        status: 'healthy',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        message: 'Healthy sweet spot: unlocks experienced in-seat lateral movers.'
      };
    } else {
      return {
        label: `> 75th Percentile (Premium)`,
        status: 'premium',
        color: 'text-purple-700 bg-purple-50 border-purple-200',
        message: 'Top-of-market offer: guarantees high conversion of tier-1 executives.'
      };
    }
  };

  const budgetEvaluation = getBudgetPercentileLabel(clientBaseBudget);

  const handleDownloadReport = () => {
    const k = (n: number) => `$${(n / 1000).toFixed(0)}K`;
    const appliedFilters = data.talentPool.interactiveFilters.filter(f => appliedFilterIds.includes(f.id));

    const blocks: PdfBlock[] = [
      { type: 'meta', text: 'PRE-INTAKE MARKET CALIBRATION REPORT' },
      { type: 'title', text: `Market Calibration: ${data.roleTitle}` },
      { type: 'meta', text: `${data.companyName}  |  Calibrated: ${data.lastCalibratedDate}` },
      { type: 'meta', text: data.benchmarkSource },
      { type: 'spacer', height: 4 },
      {
        type: 'paragraph',
        text: 'Insights for the executive recruiter ahead of the hiring manager intake meeting: push back on unrealistic criteria, align compensation budgets, and establish search viability before kickoff.',
        color: [0.39, 0.44, 0.52],
      },

      { type: 'heading', text: '1. Compensation Reality Check' },
      {
        type: 'table',
        columns: [
          { header: 'Benchmark', width: 3 },
          { header: '25th Pct', width: 2, align: 'right' },
          { header: 'Median', width: 2, align: 'right' },
          { header: '75th Pct', width: 2, align: 'right' },
        ],
        rows: [
          ['Base salary', k(data.compensation.baseSalary.p25), k(data.compensation.baseSalary.median), k(data.compensation.baseSalary.p75)],
          ['Total target cash (OTE)', k(data.compensation.totalCashOTE.p25), k(data.compensation.totalCashOTE.median), k(data.compensation.totalCashOTE.p75)],
          ['Annual equity (median)', '', k(data.compensation.equityAnnualMedian), ''],
        ],
      },
      { type: 'spacer', height: 4 },
      { type: 'paragraph', text: `Hiring manager base budget: ${k(clientBaseBudget)} (${budgetEvaluation.label}). ${budgetEvaluation.message}` },
      { type: 'label', text: 'Intake takeaway' },
      { type: 'paragraph', text: data.compensation.intakeTakeaway },

      { type: 'heading', text: '2. Talent Pool Scarcity (TAM)' },
      {
        type: 'paragraph',
        text: `Baseline addressable market: ${data.talentPool.baselineTAM.toLocaleString()} executives. Active pool with selected requirements: ${dynamicTAM.toLocaleString()} executives (${poolDropPercentage}% reduction).`,
      },
      {
        type: 'table',
        columns: [
          { header: 'Title cohort', width: 5 },
          { header: 'Share', width: 1.5, align: 'right' },
          { header: 'Executives', width: 2, align: 'right' },
        ],
        rows: data.talentPool.titleBreakdown.map(t => [t.title, `${t.percentage}%`, t.count.toLocaleString()]),
      },
      { type: 'spacer', height: 4 },
      {
        type: 'table',
        columns: [
          { header: 'Client requirement filter', width: 6 },
          { header: 'Pool impact', width: 1.8, align: 'right' },
          { header: 'Applied', width: 1.4, align: 'right' },
        ],
        rows: data.talentPool.interactiveFilters.map(f => [
          `${f.label}. ${f.description}`,
          `${f.impactPercent}%`,
          appliedFilterIds.includes(f.id) ? 'Yes' : 'No',
        ]),
      },
      ...(appliedFilters.length === 0
        ? [{ type: 'paragraph', text: 'No client requirement filters are applied in this view.', color: [0.39, 0.44, 0.52] } as PdfBlock]
        : []),
      { type: 'label', text: 'Intake takeaway' },
      { type: 'paragraph', text: data.talentPool.intakeTakeaway },

      { type: 'heading', text: '3. Geographic Concentration & Work Model' },
      {
        type: 'table',
        columns: [
          { header: 'Metro', width: 4 },
          { header: 'Region', width: 3 },
          { header: 'Executives', width: 2, align: 'right' },
          { header: 'Share', width: 1.5, align: 'right' },
        ],
        rows: data.geography.topHubs.map(h => [
          `${h.metro}${h.isClientHQ ? ' (client HQ)' : ''}`,
          h.region,
          h.candidateCount.toLocaleString(),
          `${h.percentage}%`,
        ]),
      },
      { type: 'spacer', height: 4 },
      {
        type: 'paragraph',
        text: `Work model today: ${data.geography.workModel.hybrid}% hybrid, ${data.geography.workModel.remote}% remote, ${data.geography.workModel.inOffice}% in-office. Client requirement: ${data.geography.clientRequirement}.`,
      },
      { type: 'label', text: 'Intake takeaway' },
      { type: 'paragraph', text: data.geography.intakeTakeaway },

      { type: 'heading', text: '4. Source Company Concentration' },
      {
        type: 'table',
        columns: [
          { header: '#', width: 0.8 },
          { header: 'Company', width: 3.2 },
          { header: 'Industry', width: 3.4 },
          { header: 'Execs', width: 1.3, align: 'right' },
          { header: 'Status', width: 3 },
        ],
        rows: data.sourceCompanies.topTen.map(c => [
          String(c.rank),
          c.name,
          c.industry,
          String(c.candidateCount),
          c.offLimitsStatus,
        ]),
      },
      { type: 'spacer', height: 4 },
      { type: 'paragraph', text: `Top five companies hold ${data.sourceCompanies.topFiveConcentrationPercent}% of the cohort.` },
      { type: 'label', text: 'Intake takeaway' },
      { type: 'paragraph', text: data.sourceCompanies.intakeTakeaway },

      { type: 'heading', text: '5. Macro Tenure & Flight Risk (Baseline PTM)' },
      {
        type: 'paragraph',
        text: `Average tenure: ${data.macroTenure.averageTenureYears} years. ${data.macroTenure.historicalCliffExitPercent}% of moves land in ${data.macroTenure.vestingCliffWindowMonths}.`,
      },
      {
        type: 'table',
        columns: [
          { header: 'Tenure', width: 2.2 },
          { header: 'Share', width: 1.2, align: 'right' },
          { header: 'Risk', width: 2.4 },
          { header: 'Signal', width: 6 },
        ],
        rows: data.macroTenure.flightRiskDistribution.map(r => [
          r.tenureRange,
          `${r.percentage}%`,
          r.riskLevel,
          r.description,
        ]),
      },
      { type: 'label', text: 'Intake takeaway' },
      { type: 'paragraph', text: data.macroTenure.intakeTakeaway },
    ];

    const slug = data.roleTitle.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');
    downloadBlob(
      buildPdf(blocks, `Market Calibration - ${data.roleTitle}`),
      `Market-Calibration-${slug}.pdf`
    );
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-20">
      
      {showIntakeModal && (
        <IntakeMeetingModal onClose={() => setShowIntakeModal(false)} />
      )}

      {/* Top Banner: Intake Preparation Intelligence Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl p-6 lg:p-8 text-white shadow-xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Pre-Intake Market Calibration
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-300 font-medium">
              Calibrated: {data.lastCalibratedDate}
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-400">
              {data.benchmarkSource}
            </span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Market Calibration: {data.roleTitle}
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Market calibration insights designed for the executive recruiter prior to the hiring manager intake meeting. Push back on unrealistic criteria, align compensation budgets, and establish statistical search viability before kickoff.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            {downloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-slate-400" />}
            Download Market Calibration Report
          </button>

          <button
            onClick={() => setShowIntakeModal(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md hover:shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 stroke-[2.5]" />
            Schedule Intake Meeting
          </button>
        </div>
      </div>

      {/* 5 Core Calibration Widgets */}
      <div className="space-y-8">
        
        {/* ========================================================================= */}
        {/* 1. COMPENSATION REALITY CHECK WIDGET */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <DollarSign className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">1. Compensation Reality Check</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    P25 • Median • P75 Benchmarks
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-intake market compensation percentiles for Base Salary & Total Target Cash (OTE).
                </p>
              </div>
            </div>

            {/* Client Budget Status Pill */}
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${budgetEvaluation.color}`}>
              {budgetEvaluation.status === 'high_risk' && <AlertTriangle className="w-4 h-4 shrink-0" />}
              {budgetEvaluation.status === 'healthy' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>Hiring Manager Budget: {budgetEvaluation.label}</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Interactive Benchmark Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left: Base Salary Percentiles */}
              <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Estimated Base Salary</h4>
                    <span className="text-[11px] text-slate-400">Fixed executive cash compensation</span>
                  </div>
                  <span className="text-xs font-black text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">
                    Median: ${(data.compensation.baseSalary.median / 1000).toFixed(0)}K
                  </span>
                </div>

                {/* Visual Distribution Bars */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">25th Percentile</span>
                    <span className="font-bold text-slate-800">${(data.compensation.baseSalary.p25 / 1000).toFixed(0)},000</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                    <div style={{ width: '25%' }} className="bg-emerald-400 h-full"></div>
                    <div style={{ width: '50%' }} className="bg-emerald-600 h-full"></div>
                    <div style={{ width: '25%' }} className="bg-emerald-800 h-full"></div>
                  </div>

                  <div className="grid grid-cols-3 text-[11px] pt-1 text-center font-semibold">
                    <div className="text-left text-slate-600">
                      <span className="block text-[10px] text-slate-400 uppercase">25th Pct</span>
                      ${(data.compensation.baseSalary.p25 / 1000).toFixed(0)}K
                    </div>
                    <div className="text-center text-emerald-800 font-bold">
                      <span className="block text-[10px] text-emerald-600 uppercase">Market Median</span>
                      ${(data.compensation.baseSalary.median / 1000).toFixed(0)}K
                    </div>
                    <div className="text-right text-slate-600">
                      <span className="block text-[10px] text-slate-400 uppercase">75th Pct</span>
                      ${(data.compensation.baseSalary.p75 / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>

                {/* Interactive Client Budget Slider for Recruiter in Meeting */}
                <div className="mt-5 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-blue-600" />
                      Client Target Budget (Interactive Recruiter Sandbox):
                    </label>
                    <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      ${(clientBaseBudget / 1000).toFixed(0)},000 Base
                    </span>
                  </div>
                  <input
                    type="range"
                    min={data.compensation.baseSalary.p25 * 0.75}
                    max={data.compensation.baseSalary.p75 * 1.25}
                    step={5000}
                    value={clientBaseBudget}
                    onChange={(e) => setClientBaseBudget(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>${(data.compensation.baseSalary.p25 * 0.75 / 1000).toFixed(0)}K (Extreme Underpay)</span>
                    <span>Median: ${(data.compensation.baseSalary.median / 1000).toFixed(0)}K</span>
                    <span>${(data.compensation.baseSalary.p75 * 1.25 / 1000).toFixed(0)}K (Top Decile)</span>
                  </div>
                </div>
              </div>

              {/* Right: Total Target Cash (OTE) & Equity */}
              <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Target Cash (OTE)</h4>
                      <span className="text-[11px] text-slate-400">Base Salary + Annual Executive Incentive / Bonus</span>
                    </div>
                    <span className="text-xs font-black text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">
                      Median: ${(data.compensation.totalCashOTE.median / 1000).toFixed(0)}K
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Target Cash Range (25th - 75th)</span>
                      <span className="font-bold text-slate-800">
                        ${(data.compensation.totalCashOTE.p25 / 1000).toFixed(0)}K – ${(data.compensation.totalCashOTE.p75 / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                      <div style={{ width: '25%' }} className="bg-blue-400 h-full"></div>
                      <div style={{ width: '50%' }} className="bg-blue-600 h-full"></div>
                      <div style={{ width: '25%' }} className="bg-blue-800 h-full"></div>
                    </div>

                    <div className="grid grid-cols-3 text-[11px] pt-1 text-center font-semibold">
                      <div className="text-left text-slate-600">
                        <span className="block text-[10px] text-slate-400 uppercase">25th Pct OTE</span>
                        ${(data.compensation.totalCashOTE.p25 / 1000).toFixed(0)}K
                      </div>
                      <div className="text-center text-blue-800 font-bold">
                        <span className="block text-[10px] text-blue-600 uppercase">Median OTE</span>
                        ${(data.compensation.totalCashOTE.median / 1000).toFixed(0)}K
                      </div>
                      <div className="text-right text-slate-600">
                        <span className="block text-[10px] text-slate-400 uppercase">75th Pct OTE</span>
                        ${(data.compensation.totalCashOTE.p75 / 1000).toFixed(0)}K
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-medium">Estimated Annual Equity Grant (LTI):</span>
                  </div>
                  <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    ~${(data.compensation.equityAnnualMedian / 1000).toFixed(0)},000 / yr value
                  </span>
                </div>
              </div>

            </div>

            {/* The Intake Value Callout */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    The Intake Value & Negotiation Talk Track
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed font-normal">
                    {data.compensation.intakeTakeaway}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TALENT POOL SCARCITY (TAM) WIDGET */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">2. Talent Pool Scarcity (TAM) & The "Purple Squirrel" Calculator</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 uppercase tracking-wider">
                    Market Availability
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Total Addressable Market dynamically updated as restrictive intake criteria are applied.
                </p>
              </div>
            </div>

            {/* Live TAM Counter */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calibrated TAM</span>
                <span className="text-xl font-black text-purple-900">
                  {dynamicTAM.toLocaleString()} <span className="text-xs font-normal text-slate-500">executives</span>
                </span>
              </div>
              {appliedFilterIds.length > 0 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-200">
                  -{poolDropPercentage}% Pool Shrink
                </span>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Title Distribution Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Current Title Composition Across Target Market
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {data.talentPool.titleBreakdown.map((t, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block truncate max-w-[180px]">{t.title}</span>
                      <span className="text-[11px] text-slate-500">{t.count.toLocaleString()} matching profiles</span>
                    </div>
                    <span className="text-base font-black text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-100">
                      {t.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive "Purple Squirrel" Filter Simulator */}
            <div className="bg-purple-50/40 rounded-xl p-5 border border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Intake Meeting Filter Simulator ("The Purple Squirrel Test")
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Check client requirement criteria below to see how each filter shrinks the viable candidate pool in real time.
                  </p>
                </div>
                {appliedFilterIds.length > 0 && (
                  <button
                    onClick={() => setAppliedFilterIds([])}
                    className="text-xs font-semibold text-purple-700 hover:text-purple-900 underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {data.talentPool.interactiveFilters.map(filter => {
                  const isChecked = appliedFilterIds.includes(filter.id);
                  return (
                    <div
                      key={filter.id}
                      onClick={() => toggleFilter(filter.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-white border-purple-400 shadow-sm ring-1 ring-purple-400'
                          : 'bg-white/80 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent onClick
                          className="mt-0.5 w-4 h-4 accent-purple-600 rounded cursor-pointer"
                        />
                        <div>
                          <span className={`text-xs font-bold block ${isChecked ? 'text-purple-950' : 'text-slate-800'}`}>
                            {filter.label}
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            {filter.description}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          isChecked ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {filter.impactPercent}% Pool
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Warning Alert if pool is too small */}
              {dynamicTAM < 150 && (
                <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 animate-fadeIn">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div className="text-xs leading-relaxed">
                    <strong>Critical Search Risk:</strong> Active candidate pool has shrunk to only <strong>{dynamicTAM} individuals globally</strong>. This search has an estimated &gt;75% risk of stall or failure unless at least one restrictive filter is relaxed to a "preferred" rather than "mandatory" qualification.
                  </div>
                </div>
              )}
            </div>

            {/* The Intake Value Callout */}
            <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                    The Intake Value & Recruiter Strategy
                  </div>
                  <p className="text-xs text-purple-950 leading-relaxed font-normal">
                    {data.talentPool.intakeTakeaway}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. GEOGRAPHIC HEATMAP & WORK MODEL WIDGET */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <MapPin className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">3. Geographic Heatmap & Work Model Reality</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                    Location & Remote Feasibility
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Top 5 metropolitan clusters vs. firmographic work model expectations.
                </p>
              </div>
            </div>

            {/* Client Mandate Callout */}
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Client Stated Requirement</span>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 inline-block mt-0.5">
                {data.geography.clientRequirement}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left 7 cols: Top 5 Metropolitan Hubs */}
              <div className="lg:col-span-7 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Top 5 Metropolitan Talent Hubs
                </h4>
                {data.geography.topHubs.map((hub, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-800">{hub.metro}</span>
                        <span className="text-slate-400">({hub.region})</span>
                        {hub.isClientHQ && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                            Client HQ
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{hub.candidateCount.toLocaleString()} candidates</span>
                        <span className="font-black text-slate-900 w-10 text-right">{hub.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${hub.percentage * 2}%` }} 
                        className={`h-full rounded-full ${hub.isClientHQ ? 'bg-purple-600' : 'bg-blue-600'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Right 5 cols: Work Model Breakdown */}
              <div className="lg:col-span-5 bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Current Work Model Distribution
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-4">
                    Based on live telemetry & firmographic corporate policy data for this executive cohort.
                  </p>

                  <div className="space-y-4">
                    {/* Hybrid */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                        <span>Hybrid (1-3 Days In-Office)</span>
                        <span className="font-black text-blue-700">{data.geography.workModel.hybrid}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${data.geography.workModel.hybrid}%` }} className="bg-blue-600 h-full rounded-full"></div>
                      </div>
                    </div>

                    {/* Remote */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                        <span>Flexible / Fully Remote</span>
                        <span className="font-black text-emerald-700">{data.geography.workModel.remote}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${data.geography.workModel.remote}%` }} className="bg-emerald-500 h-full rounded-full"></div>
                      </div>
                    </div>

                    {/* In-Office */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                        <span>Full On-Site (4-5 Days)</span>
                        <span className="font-black text-amber-700">{data.geography.workModel.inOffice}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${data.geography.workModel.inOffice}%` }} className="bg-amber-500 h-full rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 bg-white p-3 rounded-lg border border-slate-100 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-900 block mb-0.5">Market Mobility Friction:</span>
                  {(data.geography.workModel.hybrid + data.geography.workModel.remote)}% of candidates hold hybrid or remote autonomy. A 5-day on-site mandate eliminates &gt;80% of candidates unless relocation incentives ($75K+) are guaranteed.
                </div>
              </div>

            </div>

            {/* The Intake Value Callout */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    The Intake Value & Recruiter Talk Track
                  </div>
                  <p className="text-xs text-blue-950 leading-relaxed font-normal">
                    {data.geography.intakeTakeaway}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. SOURCE COMPANY CONCENTRATION WIDGET */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <Building2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">4. Source Company Concentration & Off-Limits Audit</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                    Top 10 Employer Landscape
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ranked top 10 companies employing this exact executive cohort, with off-limits and culture translations.
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Top 5 Concentration</span>
              <span className="text-base font-black text-indigo-900">
                {data.sourceCompanies.topFiveConcentrationPercent}% <span className="text-xs font-normal text-slate-500">of all candidates</span>
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Top 10 Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">Rank</th>
                    <th className="px-4 py-3">Company & Domain</th>
                    <th className="px-4 py-3 text-right">Matching Leaders</th>
                    <th className="px-4 py-3 text-right">% of Cohort</th>
                    <th className="px-4 py-3">Off-Limits Status</th>
                    <th className="px-4 py-3">Culture / Scale Fit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.sourceCompanies.topTen.map((comp) => (
                    <tr key={comp.rank} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 text-center font-bold text-slate-400">
                        #{comp.rank}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 text-xs">{comp.name}</div>
                        <div className="text-[10px] text-slate-400">{comp.industry}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-black text-slate-800">
                        {comp.candidateCount}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-600">
                        {comp.percentageOfCohort}%
                      </td>
                      <td className="px-4 py-3">
                        {comp.offLimitsStatus === 'Clear Target' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Clear Target
                          </span>
                        )}
                        {comp.offLimitsStatus === 'Do Not Poach (Client)' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <ShieldAlert className="w-3 h-3 text-rose-600" /> Do Not Poach
                          </span>
                        )}
                        {comp.offLimitsStatus === 'Restricted (Board)' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Board Restricted
                          </span>
                        )}
                        {comp.offLimitsStatus === 'Caution (Partner)' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Info className="w-3 h-3 text-blue-600" /> Caution (Partner)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {comp.cultureType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* The Intake Value Callout */}
            <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                    The Intake Value & Recruiter Alignment Question
                  </div>
                  <p className="text-xs text-indigo-950 leading-relaxed font-normal">
                    {data.sourceCompanies.intakeTakeaway}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. MACRO TENURE & FLIGHT RISK (BASELINE PTM) WIDGET */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Clock className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">5. Macro Tenure & Flight Risk (Baseline PTM)</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                    Propensity to Move (PTM)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cohort tenure velocity, equity vesting cliff milestones, and prime outbound sourcing windows.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Role Tenure</span>
                <span className="text-xl font-black text-slate-900">
                  {data.macroTenure.averageTenureYears} <span className="text-xs font-normal text-slate-500">years</span>
                </span>
              </div>
              <div className="text-right border-l border-slate-200 pl-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vesting Cliff Exits</span>
                <span className="text-xl font-black text-rose-700">
                  {data.macroTenure.historicalCliffExitPercent}%
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Timeline Horizon Visualization */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tenure Horizon & Propensity to Move Distribution
                </h4>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Peak Mobility Window: {data.macroTenure.vestingCliffWindowMonths}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.macroTenure.flightRiskDistribution.map((item, idx) => {
                  const isPeak = item.riskLevel === 'Peak Opportunity';
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                        isPeak
                          ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/40 shadow-sm'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800">{item.tenureRange}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isPeak
                              ? 'bg-amber-200 text-amber-950 font-black'
                              : item.riskLevel === 'Low'
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.riskLevel}
                          </span>
                        </div>
                        <span className="text-2xl font-black text-slate-900 block mb-2">
                          {item.percentage}%
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {isPeak && (
                        <div className="mt-3 pt-2 border-t border-amber-200/80 text-[10px] font-bold text-amber-900 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-700" /> Sourcing Focus Window
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* The Intake Value Callout */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    The Intake Value & Recruiter Reality Check
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed font-normal">
                    {data.macroTenure.intakeTakeaway}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
