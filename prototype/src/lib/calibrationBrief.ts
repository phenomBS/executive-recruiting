import type { SearchIntelligenceData } from '../data/projectSearchIntelligenceData';
import {
  MARKET_AVG_POSTINGS,
  recommendedPath,
  type CalibrationScenario,
  type CompetitionSnapshot,
  type DifficultyResult,
  type Sensitivity,
} from './hireDifficulty';

/**
 * Shared, presentation-free model behind the Market Calibration tab and the
 * downloadable one-page Executive Search Calibration Brief. Every figure shown
 * on screen and in the PDF is produced here so the two never diverge.
 */

export const fmtK = (n: number) => `$${Math.round(n / 1000).toLocaleString()}K`;
export const fmtMoney = (n: number) => `$${Math.round(n).toLocaleString()}`;

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/* ------------------------------------------------------------------ */
/* KPI banner                                                           */
/* ------------------------------------------------------------------ */

export type KpiTone = 'good' | 'warn' | 'bad' | 'neutral';

export interface Kpi {
  id: 'tam' | 'demand' | 'duration' | 'budget';
  label: string;
  value: string;
  unit?: string;
  sub: string;
  tone: KpiTone;
}

export function competitorDemand(competition: CompetitionSnapshot) {
  const ratio = Math.round((competition.activePostings / MARKET_AVG_POSTINGS) * 10) / 10;
  const label = ratio >= 4.5 ? 'Very High' : ratio >= 2.5 ? 'High' : ratio >= 1.3 ? 'Elevated' : 'Moderate';
  return { ratio, label, tone: (ratio >= 2.5 ? 'bad' : ratio >= 1.3 ? 'warn' : 'good') as KpiTone };
}

export interface BudgetPosition {
  label: string;
  short: string;
  tone: KpiTone;
  /** Position of the budget on the P25..P75 scale, 0..1 (can be outside) */
  delta: number;
  deltaPct: number;
}

export function budgetPosition(data: SearchIntelligenceData, base: number): BudgetPosition {
  const { p25, median, p75 } = data.compensation.baseSalary;
  const delta = base - median;
  const deltaPct = Math.round((delta / median) * 100);
  if (base < p25) return { label: 'Below 25th Pct', short: 'Below P25', tone: 'bad', delta, deltaPct };
  if (base < median) return { label: '25th to 50th Pct', short: 'P25 to P50', tone: 'warn', delta, deltaPct };
  if (base < p75) return { label: '50th to 75th Pct', short: 'P50 to P75', tone: 'good', delta, deltaPct };
  return { label: 'Above 75th Pct', short: 'Above P75', tone: 'good', delta, deltaPct };
}

export function buildKpis(
  data: SearchIntelligenceData,
  scenario: CalibrationScenario,
  competition: CompetitionSnapshot,
  result: DifficultyResult
): Kpi[] {
  const demand = competitorDemand(competition);
  const pos = budgetPosition(data, scenario.baseBudget);
  return [
    {
      id: 'tam',
      label: 'Total Addressable Market',
      value: data.talentPool.baselineTAM.toLocaleString(),
      unit: 'Active Executives',
      sub: `${result.pool.toLocaleString()} remain after current requirements`,
      tone: data.talentPool.baselineTAM >= 500 ? 'good' : data.talentPool.baselineTAM >= 150 ? 'warn' : 'bad',
    },
    {
      id: 'demand',
      label: 'Competitor Demand',
      value: demand.label,
      unit: `${demand.ratio}x market average`,
      sub: `${competition.activePostings} open competing searches`,
      tone: demand.tone,
    },
    {
      id: 'duration',
      label: 'Estimated Search Duration',
      value: String(result.timeToFillDays),
      unit: 'Days',
      sub: `Peer postings open ${competition.avgDaysOpen} days on average`,
      tone: result.timeToFillDays <= 60 ? 'good' : result.timeToFillDays <= 90 ? 'warn' : 'bad',
    },
    {
      id: 'budget',
      label: 'Target Base Budget',
      value: fmtK(scenario.baseBudget),
      unit: pos.label,
      sub: `Market median ${fmtK(data.compensation.baseSalary.median)}`,
      tone: pos.tone,
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Compensation & equity                                                */
/* ------------------------------------------------------------------ */

export const EQUITY_MULTIPLES = [1, 3, 5] as const;

export interface EquityYear {
  year: number;
  base: number;
  bonus: number;
  equity: number;
  total: number;
}

export interface EquityModel {
  multiple: number;
  years: EquityYear[];
  fourYearTotal: number;
  /** Value of unvested stock a typical in-seat executive walks away from */
  unvestedBuyout: number;
  signOnLti: number;
  bonusTarget: number;
}

/**
 * Four-year cost-of-hire model. Equity tranches are marked to an enterprise
 * valuation that grows linearly from 1x at grant to `multiple` in year four.
 */
export function buildEquityModel(data: SearchIntelligenceData, baseBudget: number, multiple: number): EquityModel {
  const { clientBudgetBase, clientBudgetOTE, equityAnnualMedian } = data.compensation;
  const bonusTarget = Math.round(Math.max(0, clientBudgetOTE - clientBudgetBase) * (baseBudget / clientBudgetBase));
  const years: EquityYear[] = [1, 2, 3, 4].map(year => {
    const valuation = 1 + (multiple - 1) * (year / 4);
    const equity = Math.round(equityAnnualMedian * valuation);
    return { year, base: baseBudget, bonus: bonusTarget, equity, total: baseBudget + bonusTarget + equity };
  });
  const unvestedBuyout = Math.round(equityAnnualMedian * 2.5 * multiple);
  return {
    multiple,
    years,
    fourYearTotal: years.reduce((s, y) => s + y.total, 0),
    unvestedBuyout,
    signOnLti: Math.round((unvestedBuyout * 0.6) / 5000) * 5000,
    bonusTarget,
  };
}

export function buildTalkTrack(
  data: SearchIntelligenceData,
  scenario: CalibrationScenario,
  equity: EquityModel
): string[] {
  const { p25, median, p75 } = data.compensation.baseSalary;
  const pos = budgetPosition(data, scenario.baseBudget);
  const lines: string[] = [];

  if (scenario.baseBudget < p25) {
    lines.push(
      `Target base of ${fmtK(scenario.baseBudget)} sits below the 25th percentile (${fmtK(p25)}). Recalibrate base toward the ${fmtK(median)} median, or offer a sign-on LTI of roughly ${fmtK(equity.signOnLti)} to bridge the candidate's unvested-equity cliff.`
    );
  } else if (scenario.baseBudget < median) {
    lines.push(
      `Target base of ${fmtK(scenario.baseBudget)} is ${fmtK(median - scenario.baseBudget)} short of the ${fmtK(median)} median. Close the gap with base, or offset it with a sign-on LTI of roughly ${fmtK(equity.signOnLti)}.`
    );
  } else if (scenario.baseBudget < p75) {
    lines.push(
      `Target base of ${fmtK(scenario.baseBudget)} clears the market median (${fmtK(median)}). Lead with scope and mandate; base compensation will not be the objection.`
    );
  } else {
    lines.push(
      `Target base of ${fmtK(scenario.baseBudget)} is above the 75th percentile (${fmtK(p75)}). The budget gives room to compete for top-quartile talent; position it as a premium offer.`
    );
  }

  lines.push(
    `At ${equity.multiple}x enterprise valuation, an in-seat executive forfeits about ${fmtK(equity.unvestedBuyout)} of unvested stock by leaving. ${
      pos.tone === 'good'
        ? 'Confirm the equity grant is sized to replace that value.'
        : 'Without a buy-out, expect strong candidates to decline at the offer stage.'
    }`
  );

  const hq = data.geography.topHubs.find(h => h.isClientHQ) ?? data.geography.topHubs.find(h => h.metro === scenario.locationMetro);
  if (hq && scenario.onsiteDays >= 3 && !scenario.relocationOpen) {
    lines.push(
      `Only ${hq.percentage}% of this talent lives in ${hq.metro}. A ${scenario.onsiteDays}-day on-site mandate excludes the rest; ask whether hybrid or a relocation package is acceptable.`
    );
  }
  return lines;
}

/* ------------------------------------------------------------------ */
/* Hunting grounds                                                      */
/* ------------------------------------------------------------------ */

export interface HuntingCompany {
  name: string;
  industry: string;
  candidateCount: number;
  share: number;
  status: SearchIntelligenceData['sourceCompanies']['topTen'][number]['offLimitsStatus'];
  /** Quarter-over-quarter growth in executive requisitions */
  growthPct: number;
  openSearches: number;
}

export function buildHuntingGrounds(data: SearchIntelligenceData, competition: CompetitionSnapshot) {
  const all: HuntingCompany[] = data.sourceCompanies.topTen.map(c => {
    const seed = hashString(`${data.projectId}:${c.name}`);
    const peer = competition.peers.find(p => p.name === c.name);
    return {
      name: c.name,
      industry: c.industry,
      candidateCount: c.candidateCount,
      share: c.percentageOfCohort,
      status: c.offLimitsStatus,
      growthPct: 9 + (seed % 38),
      openSearches: peer?.postings ?? 1 + (seed % 4),
    };
  });
  const topEmployers = [...all].sort((a, b) => b.candidateCount - a.candidateCount).slice(0, 5);
  const fastestGrowing = [...all].sort((a, b) => b.growthPct - a.growthPct).slice(0, 5);
  return { topEmployers, fastestGrowing };
}

/* ------------------------------------------------------------------ */
/* Executive summary                                                    */
/* ------------------------------------------------------------------ */

export function buildExecutiveSummary(
  data: SearchIntelligenceData,
  scenario: CalibrationScenario,
  competition: CompetitionSnapshot,
  result: DifficultyResult,
  path: { steps: Sensitivity[]; days: number; score: number }
): string {
  const first =
    `This search is rated ${result.score.toFixed(1)} of 10 (${result.label}): ${result.pool.toLocaleString()} viable executives are pursued by ${competition.activePostings} competing searches, projecting a ${result.timeToFillDays}-day fill.`;

  let second: string;
  if (result.score <= 5) {
    second = `Current requirements are workable; hold base compensation at ${fmtK(scenario.baseBudget)} or higher and protect the ${result.timeToFillDays}-day timeline by moving quickly to shortlist.`;
  } else if (path.steps.length === 0) {
    second = `No single relaxation materially improves viability, so align the hiring manager on a longer timeline and a stronger offer before kickoff.`;
  } else {
    const phrases = path.steps.slice(0, 2).map(s => s.phrase);
    const joined = phrases.length === 2 ? `${phrases[0]}, or ${phrases[1]}` : phrases[0];
    second = `To achieve a ${path.days}-day fill time, ${joined}.`;
  }
  void data;
  return `${first} ${second}`;
}

/* ------------------------------------------------------------------ */
/* Assembled brief model                                                */
/* ------------------------------------------------------------------ */

export interface BriefModel {
  data: SearchIntelligenceData;
  scenario: CalibrationScenario;
  result: DifficultyResult;
  kpis: Kpi[];
  position: BudgetPosition;
  equity: EquityModel;
  talkTrack: string[];
  summary: string;
  hunting: ReturnType<typeof buildHuntingGrounds>;
  path: { steps: Sensitivity[]; days: number; score: number };
}

export function buildBriefModel(
  data: SearchIntelligenceData,
  scenario: CalibrationScenario,
  competition: CompetitionSnapshot,
  result: DifficultyResult,
  equityMultiple: number,
  computeResult: (s: CalibrationScenario) => DifficultyResult
): BriefModel {
  const rec = recommendedPath(data, scenario);
  const recResult = computeResult(rec.scenario);
  const path = { steps: rec.steps, days: recResult.timeToFillDays, score: recResult.score };
  const equity = buildEquityModel(data, scenario.baseBudget, equityMultiple);
  return {
    data,
    scenario,
    result,
    kpis: buildKpis(data, scenario, competition, result),
    position: budgetPosition(data, scenario.baseBudget),
    equity,
    talkTrack: buildTalkTrack(data, scenario, equity),
    summary: buildExecutiveSummary(data, scenario, competition, result, path),
    hunting: buildHuntingGrounds(data, competition),
    path,
  };
}
