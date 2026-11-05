import type { RoleSuccessionItem } from '../data/rolesSuccessionData';
import { hashString } from './calibrationBrief';

/**
 * Analytics model for the executive search ROI scorecard.
 * The eight KPIs, their ROI story, how each is measured and how reliable it is
 * follow the Analytics KPI table; the figures are modeled sample data.
 */

export type Reliability = 'High' | 'Medium' | 'Low to medium';

export interface KpiMeta {
  id: 'time-to-slate' | 'time-in-stage' | 'conversion' | 'feedback' | 'research-hours' | 'bench' | 'agency' | 'offers';
  number: number;
  name: string;
  roi: string;
  measured: string;
  reliability: Reliability;
  reliabilityNote: string;
  visual: string;
}

export const KPI_META: KpiMeta[] = [
  {
    id: 'time-to-slate',
    number: 1,
    name: 'Time to slate',
    roi: "The POV's headline value metric (target 30 to 45 days).",
    measured: 'Project created date to the date the first slate is presented.',
    reliability: 'High',
    reliabilityNote: 'High once "Slate presented" is a defined stage or Digital Search Book event.',
    visual: 'Big number vs. baseline, plus a bar per search against the 30 to 45 day target band.',
  },
  {
    id: 'time-in-stage',
    number: 2,
    name: 'Time in stage / search velocity',
    roi: 'Shows where searches stall.',
    measured: 'Candidate stage history with dates. The Projects report already captures stage, updated date, who updated it, and whether it was a bulk import.',
    reliability: 'High',
    reliabilityNote: 'High today.',
    visual: 'Timeline of active searches, colored by stage.',
  },
  {
    id: 'conversion',
    number: 3,
    name: 'Pipeline conversion',
    roi: 'Proves market-map quality and efficient outreach.',
    measured: 'Identified, contacted, engaged, interviewed, slate, offer, hired.',
    reliability: 'High',
    reliabilityNote: 'High today, if stages are standardized.',
    visual: 'Funnel, the standard executive-search pipeline view.',
  },
  {
    id: 'feedback',
    number: 4,
    name: 'Hiring manager feedback turnaround',
    roi: 'Removes the biggest hidden delay.',
    measured: 'Slate shared to feedback submitted.',
    reliability: 'Medium',
    reliabilityNote: 'Reliable only once feedback happens in the Digital Search Book instead of email.',
    visual: 'Median-hours number plus a distribution.',
  },
  {
    id: 'research-hours',
    number: 5,
    name: 'Recruiter research hours returned',
    roi: 'Productivity ROI.',
    measured: 'Profiles and org maps the agent creates or updates, multiplied by an agreed minutes-per-profile figure.',
    reliability: 'High',
    reliabilityNote: 'The count is high; the hours figure depends on an assumption the customer agrees to.',
    visual: 'Cumulative line, with the assumption shown on the chart.',
  },
  {
    id: 'bench',
    number: 6,
    name: 'Bench readiness and market coverage',
    roi: 'Succession and always-on value.',
    measured: '% of critical roles with 2 or more benchmarked successors; % of target executives with a profile updated in the last 90 days.',
    reliability: 'High',
    reliabilityNote: 'High today (profile update dates).',
    visual: 'Role by function coverage heatmap.',
  },
  {
    id: 'agency',
    number: 7,
    name: 'Agency spend avoided',
    roi: 'The dollar figure a CFO asks for.',
    measured: "Searches filled in-house x customer's average fee % x average compensation.",
    reliability: 'Low to medium',
    reliabilityNote: 'Needs an in-house vs. agency flag and customer inputs.',
    visual: 'Dollar tile with the formula and inputs visible.',
  },
  {
    id: 'offers',
    number: 8,
    name: 'Offer acceptance and time to offer',
    roi: 'Closes the loop (POV goal: offer signed within 120 days).',
    measured: 'Offer and hire status.',
    reliability: 'Medium',
    reliabilityNote: 'Needs applicant tracking system (ATS) integration.',
    visual: 'Number vs. the 120-day goal.',
  },
];

/* ------------------------------------------------------------------ */
/* Sample data                                                          */
/* ------------------------------------------------------------------ */

export const PIPELINE_STAGES = ['Identified', 'Contacted', 'Engaged', 'Interviewed', 'Slate', 'Offer'] as const;
export const STAGE_COLORS = ['#cac1f2', '#a391f2', '#7571e0', '#4d3ee0', '#2927b2', '#0c0b3b'];
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

interface SearchRecord {
  id: string;
  title: string;
  /** Days since the project was created */
  age: number;
  /** Day the first slate was presented, if it has been */
  slateDay: number | null;
  /** Days spent in each stage so far (Identified through Offer) */
  stageDays: number[];
  state: 'active' | 'filled' | 'lost';
  filledInHouse?: boolean;
  /** Day an offer was extended, and whether it was accepted */
  offerDay?: number;
  accepted?: boolean;
}

const SEARCHES: SearchRecord[] = [
  { id: 'p-1', title: 'CFO', age: 52, slateDay: 38, stageDays: [8, 9, 9, 12, 14, 0], state: 'active' },
  { id: 'p-2', title: 'VP of Engineering', age: 71, slateDay: 44, stageDays: [10, 9, 10, 15, 15, 12], state: 'active', offerDay: 59 },
  { id: 'p-3', title: 'Senior Product Manager', age: 29, slateDay: null, stageDays: [7, 9, 13, 0, 0, 0], state: 'active' },
  { id: 'p-4', title: 'CISO', age: 88, slateDay: 61, stageDays: [12, 14, 15, 20, 17, 10], state: 'active', offerDay: 78 },
  { id: 's-3', title: 'Chief AI Officer', age: 35, slateDay: 33, stageDays: [6, 8, 9, 10, 2, 0], state: 'active' },
  { id: 's-2', title: 'VP, Hardware Supply Chain', age: 60, slateDay: 47, stageDays: [9, 11, 12, 15, 13, 0], state: 'active' },
  { id: 'f-1', title: 'EVP, Operations', age: 96, slateDay: 36, stageDays: [8, 9, 8, 11, 15, 17], state: 'filled', filledInHouse: true, offerDay: 79, accepted: true },
  { id: 'f-2', title: 'EVP, General Counsel', age: 101, slateDay: 42, stageDays: [9, 10, 11, 12, 20, 13], state: 'filled', filledInHouse: true, offerDay: 88, accepted: true },
  { id: 'f-3', title: 'Chief Revenue Officer', age: 84, slateDay: 31, stageDays: [7, 8, 7, 9, 22, 12], state: 'filled', filledInHouse: true, offerDay: 74, accepted: true },
  { id: 'f-4', title: 'Chief Marketing Officer', age: 92, slateDay: 39, stageDays: [8, 10, 9, 12, 18, 14], state: 'filled', filledInHouse: true, offerDay: 81, accepted: true },
  { id: 'f-5', title: 'Chief People Officer', age: 124, slateDay: 58, stageDays: [12, 15, 14, 17, 28, 22], state: 'filled', filledInHouse: false, offerDay: 112, accepted: true },
  { id: 'f-6', title: 'VP, Sales', age: 118, slateDay: 40, stageDays: [9, 12, 10, 13, 30, 24], state: 'lost', offerDay: 98, accepted: false },
];

const FUNNEL_COUNTS = [1240, 612, 238, 74, 31, 9, 5];
const FUNNEL_LABELS = ['Identified', 'Contacted', 'Engaged', 'Interviewed', 'Slate', 'Offer', 'Hired'];

const FEEDBACK_HOURS = [4, 6, 9, 11, 13, 15, 18, 19, 22, 26, 29, 31, 33, 36, 41, 44, 52, 58, 63, 70, 79, 96, 118, 150];
const FEEDBACK_IN_BOOK_PCT = 62;

const RESEARCH_MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov (to date)'];
const RESEARCH_PROFILES = [210, 340, 455, 610, 780, 430];
const RESEARCH_ORG_MAPS = [6, 11, 15, 22, 28, 16];

export const MANUAL_BASELINE_DAYS = 62;
export const SLATE_TARGET: [number, number] = [30, 45];
export const OFFER_GOAL_DAYS = 120;
export const STALL_DAYS = 13;

/* ------------------------------------------------------------------ */
/* Derived model                                                        */
/* ------------------------------------------------------------------ */

export interface AnalyticsInputs {
  minutesPerProfile: number;
  minutesPerOrgMap: number;
  feePct: number;
  avgComp: number;
}

export const DEFAULT_INPUTS: AnalyticsInputs = {
  minutesPerProfile: 12,
  minutesPerOrgMap: 45,
  feePct: 30,
  avgComp: 420000,
};

const median = (values: number[]) => {
  const s = [...values].sort((a, b) => a - b);
  if (s.length === 0) return 0;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export const LEVELS = ['C-Suite', 'SVP', 'VP', 'Head of'] as const;

export interface AnalyticsModel {
  inputs: AnalyticsInputs;
  searchCount: number;
  slate: {
    median: number;
    baseline: number;
    improvementPct: number;
    target: [number, number];
    withinTarget: number;
    slated: number;
    searches: { title: string; days: number; slated: boolean; band: 'under' | 'within' | 'over' }[];
  };
  stages: {
    names: readonly string[];
    medians: number[];
    slowestIndex: number;
    searches: { title: string; days: number[]; current: number; stalled: boolean; total: number }[];
    stalledCount: number;
  };
  funnel: { label: string; count: number; stepPct: number | null; overallPct: number }[];
  feedback: {
    medianHours: number;
    n: number;
    inBookPct: number;
    within48Pct: number;
    buckets: { label: string; count: number }[];
  };
  research: {
    months: string[];
    cumulativeHours: number[];
    totalHours: number;
    profiles: number;
    orgMaps: number;
    fteWeeks: number;
  };
  bench: {
    coveredPct: number;
    freshPct: number;
    roles: number;
    heat: { dept: string; cells: ({ covered: number; total: number } | null)[] }[];
  };
  agency: { inHouse: number; feePct: number; avgComp: number; perSearch: number; avoided: number };
  offers: {
    decided: number;
    accepted: number;
    acceptancePct: number;
    medianDaysToOffer: number;
    goal: number;
    withinGoal: number;
    pending: number;
    offerDays: number[];
  };
  takeaways: string;
}

const money = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000).toLocaleString()}K`);

export function buildAnalytics(roles: RoleSuccessionItem[], inputs: AnalyticsInputs = DEFAULT_INPUTS): AnalyticsModel {
  /* 1. Time to slate */
  const slateSearches = SEARCHES.map(s => {
    const slated = s.slateDay !== null;
    const days = s.slateDay ?? s.age;
    const band = days < SLATE_TARGET[0] ? 'under' : days <= SLATE_TARGET[1] ? 'within' : 'over';
    return { title: s.title, days, slated, band } as const;
  });
  const slatedDays = SEARCHES.filter(s => s.slateDay !== null).map(s => s.slateDay as number);
  const slateMedian = Math.round(median(slatedDays));
  const slate = {
    median: slateMedian,
    baseline: MANUAL_BASELINE_DAYS,
    improvementPct: Math.round(((MANUAL_BASELINE_DAYS - slateMedian) / MANUAL_BASELINE_DAYS) * 100),
    target: SLATE_TARGET,
    withinTarget: slatedDays.filter(d => d <= SLATE_TARGET[1]).length,
    slated: slatedDays.length,
    searches: slateSearches.map(s => ({ ...s })),
  };

  /* 2. Time in stage */
  const active = SEARCHES.filter(s => s.state === 'active');
  const stageMedians = PIPELINE_STAGES.map((_, i) => Math.round(median(SEARCHES.filter(s => s.stageDays[i] > 0).map(s => s.stageDays[i]))));
  const stageSearches = active.map(s => {
    let current = 0;
    s.stageDays.forEach((d, i) => {
      if (d > 0) current = i;
    });
    return {
      title: s.title,
      days: s.stageDays,
      current,
      stalled: s.stageDays[current] >= STALL_DAYS,
      total: s.stageDays.reduce((a, b) => a + b, 0),
    };
  });
  const stages = {
    names: PIPELINE_STAGES,
    medians: stageMedians,
    slowestIndex: stageMedians.indexOf(Math.max(...stageMedians)),
    searches: stageSearches,
    stalledCount: stageSearches.filter(s => s.stalled).length,
  };

  /* 3. Funnel */
  const funnel = FUNNEL_COUNTS.map((count, i) => ({
    label: FUNNEL_LABELS[i],
    count,
    stepPct: i === 0 ? null : Math.round((count / FUNNEL_COUNTS[i - 1]) * 1000) / 10,
    overallPct: Math.round((count / FUNNEL_COUNTS[0]) * 10000) / 100,
  }));

  /* 4. Feedback turnaround */
  const edges: [string, number, number][] = [
    ['Under 24h', 0, 24],
    ['24 to 48h', 24, 48],
    ['48 to 72h', 48, 72],
    ['3 to 5 days', 72, 120],
    ['Over 5 days', 120, Infinity],
  ];
  const feedback = {
    medianHours: Math.round(median(FEEDBACK_HOURS)),
    n: FEEDBACK_HOURS.length,
    inBookPct: FEEDBACK_IN_BOOK_PCT,
    within48Pct: Math.round((FEEDBACK_HOURS.filter(h => h < 48).length / FEEDBACK_HOURS.length) * 100),
    buckets: edges.map(([label, lo, hi]) => ({ label, count: FEEDBACK_HOURS.filter(h => h >= lo && h < hi).length })),
  };

  /* 5. Research hours */
  let running = 0;
  const cumulativeHours = RESEARCH_PROFILES.map((p, i) => {
    running += (p * inputs.minutesPerProfile + RESEARCH_ORG_MAPS[i] * inputs.minutesPerOrgMap) / 60;
    return Math.round(running);
  });
  const research = {
    months: RESEARCH_MONTHS,
    cumulativeHours,
    totalHours: cumulativeHours[cumulativeHours.length - 1],
    profiles: RESEARCH_PROFILES.reduce((a, b) => a + b, 0),
    orgMaps: RESEARCH_ORG_MAPS.reduce((a, b) => a + b, 0),
    fteWeeks: Math.round((cumulativeHours[cumulativeHours.length - 1] / 40) * 10) / 10,
  };

  /* 6. Bench readiness (from tracked roles) */
  const depts = Array.from(new Set(roles.map(r => r.department)));
  const heat = depts.map(dept => ({
    dept,
    cells: LEVELS.map(level => {
      const inCell = roles.filter(r => r.department === dept && r.level === level);
      if (inCell.length === 0) return null;
      return { covered: inCell.filter(r => r.candidates.length >= 2).length, total: inCell.length };
    }),
  }));
  const coveredRoles = roles.filter(r => r.candidates.length >= 2).length;
  const allCands = roles.flatMap(r => r.candidates);
  const fresh = allCands.filter(c => hashString(c.id) % 100 < 82).length;
  const bench = {
    coveredPct: roles.length ? Math.round((coveredRoles / roles.length) * 100) : 0,
    freshPct: allCands.length ? Math.round((fresh / allCands.length) * 100) : 0,
    roles: roles.length,
    heat,
  };

  /* 7. Agency spend avoided */
  const inHouse = SEARCHES.filter(s => s.state === 'filled' && s.filledInHouse).length;
  const perSearch = Math.round(inputs.avgComp * (inputs.feePct / 100));
  const agency = { inHouse, feePct: inputs.feePct, avgComp: inputs.avgComp, perSearch, avoided: perSearch * inHouse };

  /* 8. Offers */
  const decided = SEARCHES.filter(s => s.accepted !== undefined);
  const offerDays = decided.map(s => s.offerDay as number);
  const offers = {
    decided: decided.length,
    accepted: decided.filter(s => s.accepted).length,
    acceptancePct: decided.length ? Math.round((decided.filter(s => s.accepted).length / decided.length) * 100) : 0,
    medianDaysToOffer: Math.round(median(offerDays)),
    goal: OFFER_GOAL_DAYS,
    withinGoal: offerDays.filter(d => d <= OFFER_GOAL_DAYS).length,
    pending: SEARCHES.filter(s => s.offerDay !== undefined && s.accepted === undefined).length,
    offerDays,
  };

  const takeaways =
    `Searches reach a first slate in a median of ${slate.median} days, ${slate.improvementPct}% faster than the ${slate.baseline}-day baseline, and ${slate.withinTarget} of ${slate.slated} landed inside the ${SLATE_TARGET[0]} to ${SLATE_TARGET[1]} day target. ` +
    `Agents returned ${research.totalHours.toLocaleString()} research hours and ${agency.inHouse} in-house fills avoided an estimated ${money(agency.avoided)} in agency fees, while the ${stages.names[stages.slowestIndex]} stage remains the slowest at a median of ${stageMedians[stages.slowestIndex]} days.`;

  return { inputs, searchCount: SEARCHES.length, slate, stages, funnel, feedback, research, bench, agency, offers, takeaways };
}

export { money as formatMoney };
