import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Sparkles, 
  Info, 
  Sliders, 
  ShieldCheck, 
  ArrowUpRight,
  Layers,
  ChevronDown,
  Building
} from 'lucide-react';
import { FinancialOfferModel } from '../../../data/dealRoomsData';
import { cn } from '../../../lib/utils';

interface FinancialEquityCalculatorWidgetProps {
  model: FinancialOfferModel;
  onUpdateModel?: (updatedModel: FinancialOfferModel) => void;
  candidateName?: string;
  isRecruiterPreview?: boolean;
}

export function FinancialEquityCalculatorWidget({
  model: initialModel,
  onUpdateModel,
  candidateName = 'Candidate',
  isRecruiterPreview = false
}: FinancialEquityCalculatorWidgetProps) {
  const [model, setModel] = useState<FinancialOfferModel>(initialModel);
  const [activeScenario, setActiveScenario] = useState<'conservative' | 'baseline' | 'bull' | 'hyper'>('baseline');
  const [customMultiplier, setCustomMultiplier] = useState<number>(initialModel.bullCaseValuationMultiplier || 3.5);
  const [selectedYear, setSelectedYear] = useState<number>(4);
  const [showTaxEstimator, setShowTaxEstimator] = useState<boolean>(false);
  const [taxRate, setTaxRate] = useState<number>(37); // Default top federal + blended state

  // Multiplier map
  const scenarioMultipliers = {
    conservative: 1.25,
    baseline: 2.2,
    bull: 3.5,
    hyper: 6.0
  };

  const currentMultiplier = activeScenario === 'bull' ? customMultiplier : scenarioMultipliers[activeScenario];

  // Derived Financial Calculations
  const annualBaseSalary = model.baseSalary;
  const annualTargetBonus = Math.round(model.baseSalary * (model.targetBonusPercent / 100));
  const annualTotalCash = annualBaseSalary + annualTargetBonus;

  // Equity Growth Modeling
  const initialEquityGrant = model.equityGrantValue;
  const sharesCount = model.sharesCount;
  const currentSharePrice = model.currentSharePrice;
  const projectedSharePrice = currentSharePrice * currentMultiplier;
  const projectedEquityGrantTotal = Math.round(sharesCount * projectedSharePrice);
  const projectedGain = projectedEquityGrantTotal - Math.round(sharesCount * model.currentStrikePrice);

  // 4-Year Breakdown
  const annualVestedEquityProjected = Math.round(projectedEquityGrantTotal / model.vestingYears);
  const annualTotalProjectedComp = annualTotalCash + annualVestedEquityProjected;
  const fourYearTotalComp = (annualTotalCash * model.vestingYears) + projectedEquityGrantTotal + model.signingBonus;

  const estimatedTaxLiability = Math.round(fourYearTotalComp * (taxRate / 100));
  const estimatedNetRealized = fourYearTotalComp - estimatedTaxLiability;

  const handleBaseSalaryChange = (val: number) => {
    const updated = { ...model, baseSalary: val };
    setModel(updated);
    if (onUpdateModel) onUpdateModel(updated);
  };

  const handleBonusPercentChange = (val: number) => {
    const updated = { ...model, targetBonusPercent: val };
    setModel(updated);
    if (onUpdateModel) onUpdateModel(updated);
  };

  const handleGrantValueChange = (val: number) => {
    const updated = { ...model, equityGrantValue: val };
    setModel(updated);
    if (onUpdateModel) onUpdateModel(updated);
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amt);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 shadow-2xs">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Executive Compensation & Equity Upside Modeler
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800">
                Interactive Model
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate cash compensation, milestone incentives, and enterprise valuation growth for {candidateName}.
            </p>
          </div>
        </div>

        {/* Milestone badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Board Comp Committee Approved</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Scenario Selector Tabs */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              Company Enterprise Valuation Multiplier
            </label>
            <span className="text-xs font-medium text-slate-500">
              Current Valuation: ${model.currentCompanyValuationBillion}B → Projected: ${(model.currentCompanyValuationBillion * currentMultiplier).toFixed(1)}B
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveScenario('conservative')}
              className={cn(
                "py-2.5 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer",
                activeScenario === 'conservative' 
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200" 
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <div className="text-[11px] text-slate-500 font-medium">Conservative</div>
              <div className="text-sm font-extrabold text-slate-800">1.25x (${(model.currentCompanyValuationBillion * 1.25).toFixed(1)}B)</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveScenario('baseline')}
              className={cn(
                "py-2.5 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer",
                activeScenario === 'baseline' 
                  ? "bg-white text-blue-700 shadow-xs border border-blue-200" 
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <div className="text-[11px] text-blue-600 font-semibold">Baseline Plan</div>
              <div className="text-sm font-extrabold text-blue-700">2.2x (${(model.currentCompanyValuationBillion * 2.2).toFixed(1)}B)</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveScenario('bull')}
              className={cn(
                "py-2.5 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer",
                activeScenario === 'bull' 
                  ? "bg-white text-emerald-700 shadow-xs border border-emerald-200" 
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <div className="text-[11px] text-emerald-600 font-semibold">Bull Market</div>
              <div className="text-sm font-extrabold text-emerald-700">{customMultiplier.toFixed(1)}x (${(model.currentCompanyValuationBillion * customMultiplier).toFixed(1)}B)</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveScenario('hyper')}
              className={cn(
                "py-2.5 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer",
                activeScenario === 'hyper' 
                  ? "bg-white text-purple-700 shadow-xs border border-purple-200" 
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <div className="text-[11px] text-purple-600 font-semibold">Hypergrowth / IPO</div>
              <div className="text-sm font-extrabold text-purple-700">6.0x (${(model.currentCompanyValuationBillion * 6).toFixed(1)}B)</div>
            </button>
          </div>

          {activeScenario === 'bull' && (
            <div className="mt-3 flex items-center gap-4 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/70 text-xs">
              <span className="font-bold text-emerald-900 shrink-0">Fine-tune Bull Multiplier:</span>
              <input 
                type="range"
                min="2.5"
                max="5.0"
                step="0.1"
                value={customMultiplier}
                onChange={(e) => setCustomMultiplier(parseFloat(e.target.value))}
                className="flex-1 accent-emerald-600 cursor-pointer"
              />
              <span className="font-extrabold text-emerald-700 text-sm">{customMultiplier.toFixed(1)}x</span>
            </div>
          )}
        </div>

        {/* Primary Metrics Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Annual Total Cash (Base + Bonus)
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatCurrency(annualTotalCash)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Base: {formatCurrency(annualBaseSalary)}</span>
              <span>Bonus ({model.targetBonusPercent}%): {formatCurrency(annualTargetBonus)}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block flex items-center justify-between">
              <span>Projected Equity Value</span>
              <span className="text-[10px] bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded font-black">
                {currentMultiplier}x UPSIDE
              </span>
            </span>
            <div className="text-2xl font-black text-blue-700 mt-1">
              {formatCurrency(projectedEquityGrantTotal)}
            </div>
            <div className="text-xs text-blue-700/80 mt-1 flex items-center justify-between">
              <span>Grant: {formatCurrency(initialEquityGrant)}</span>
              <span>Gain: +{formatCurrency(projectedGain)}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              4-Year Total Compensation Package
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {formatCurrency(fourYearTotalComp)}
            </div>
            <div className="text-xs text-emerald-800 mt-1 flex items-center justify-between">
              <span>Avg Annual: {formatCurrency(Math.round(fourYearTotalComp / 4))}</span>
              <span>Sign-on: {formatCurrency(model.signingBonus)}</span>
            </div>
          </div>
        </div>

        {/* Vesting Schedule Timeline & Progression */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              <h4 className="text-sm font-bold text-slate-900">
                4-Year Cumulative Realized Value Projection
              </h4>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Vesting: {model.vestingSchedule}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            {[1, 2, 3, 4].map((year) => {
              const cumCash = annualTotalCash * year + model.signingBonus;
              const cumEquity = Math.round((projectedEquityGrantTotal / 4) * year);
              const totalVal = cumCash + cumEquity;
              const isSelected = selectedYear === year;

              return (
                <div 
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={cn(
                    "p-3 rounded-xl border transition-all cursor-pointer text-left",
                    isSelected 
                      ? "bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/20 shadow-xs" 
                      : "bg-slate-50 hover:bg-slate-100/80 border-slate-200"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Year {year}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{year * 25}% Vested</span>
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-1">
                    {formatCurrency(totalVal)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    +{formatCurrency(cumEquity)} equity
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recruiter / Candidate Parameter Controls */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              Explore Compensation Levers
            </span>
            <span className="text-[11px] text-slate-500">
              Changes reflect live in opportunity room preview
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Base Salary</span>
                <span className="font-bold text-slate-900">{formatCurrency(model.baseSalary)}</span>
              </div>
              <input 
                type="range"
                min="300000"
                max="650000"
                step="10000"
                value={model.baseSalary}
                onChange={(e) => handleBaseSalaryChange(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Annual Performance Bonus</span>
                <span className="font-bold text-slate-900">{model.targetBonusPercent}% ({formatCurrency(annualTargetBonus)})</span>
              </div>
              <input 
                type="range"
                min="30"
                max="80"
                step="5"
                value={model.targetBonusPercent}
                onChange={(e) => handleBonusPercentChange(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Equity Grant Baseline</span>
                <span className="font-bold text-slate-900">{formatCurrency(model.equityGrantValue)}</span>
              </div>
              <input 
                type="range"
                min="800000"
                max="2500000"
                step="50000"
                value={model.equityGrantValue}
                onChange={(e) => handleGrantValueChange(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Tax Exploration Toggle */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowTaxEstimator(!showTaxEstimator)}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              {showTaxEstimator ? 'Hide Net After-Tax Modeling' : 'View Estimated Net After-Tax Realization'}
            </button>
            <span className="text-[11px] text-slate-400">
              For directional executive financial planning
            </span>
          </div>

          {showTaxEstimator && (
            <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Estimated Blended Effective Tax Rate:</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min="25" 
                    max="50" 
                    value={taxRate} 
                    onChange={(e) => setTaxRate(parseInt(e.target.value))} 
                    className="w-28 accent-slate-700" 
                  />
                  <span className="font-bold text-slate-900">{taxRate}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Estimated 4-Year Gross: {formatCurrency(fourYearTotalComp)}</span>
                <span>Estimated Net Realized: <strong className="text-emerald-700 font-bold">{formatCurrency(estimatedNetRealized)}</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
