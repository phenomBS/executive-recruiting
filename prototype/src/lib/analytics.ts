import type { RoleSuccessionItem } from '../data/rolesSuccessionData';
import { hashString } from './calibrationBrief';
import { mockProjects } from '../data/mockData';
import { isProjectLive, projectStatusLabel } from './projectStatus';

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
export const STAGE_COLORS = [
  'var(--color-secondary-50)',
  'var(--color-secondary-75)',
  'var(--color-secondary-100)',
  'var(--color-secondary-200)',
  'var(--color-secondary-300)',
  'var(--color-secondary-500)',
];
/** Same palette as hex, for the PDF writer */
export const STAGE_HEX = ['#cac1f2', '#a391f2', '#7571e0', '#4d3ee0', '#2927b2', '#0c0b3b'];
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export type ProjectState = 'active' | 'filled' | 'lost';

interface SearchRecord {
  id: string;
  /** Used when the search is not one of the live projects */
  title: string;
  /** Function the role sits in, used to scope bench coverage */
  department: string;
  /** Days since the project was created */
  age: number;
  /** Day the first slate was presented, if it has been */
  slateDay: number | null;
  /** Days spent in each stage so far (Identified through Offer) */
  stageDays: number[];
  state: ProjectState;
  filledInHouse?: boolean;
  /** Day an offer was extended, and whether it was accepted */
  offerDay?: number;
  accepted?: boolean;
  /** Candidates reaching each funnel step: identified, contacted, engaged, interviewed, slate, offer, hired */
  funnel: number[];
  /** Hours from slate shared to hiring manager feedback submitted */
  feedback: number[];
  profiles: number;
  orgMaps: number;
  /** First month (0 = Jun) the agent worked on this search */
  startMonth: number;
}

const SEARCHES: SearchRecord[] = [
  { id: 'p-1', title: 'CFO', department: 'Finance & Corporate', age: 82, slateDay: null, stageDays: [15, 20, 22, 25, 0, 0], state: 'active', funnel: [142, 70, 28, 9, 0, 0, 0], feedback: [], profiles: 310, orgMaps: 9, startMonth: 2 },
  { id: 'p-2', title: 'VP of Engineering', department: 'Engineering & AI', age: 65, slateDay: 44, stageDays: [10, 9, 10, 15, 12, 9], state: 'active', offerDay: 56, funnel: [168, 84, 31, 10, 4, 1, 0], feedback: [13, 29, 63, 118], profiles: 360, orgMaps: 11, startMonth: 3 },
  { id: 'p-3', title: 'Senior Product Manager', department: 'Product & Growth', age: 56, slateDay: null, stageDays: [12, 19, 25, 0, 0, 0], state: 'active', funnel: [120, 52, 17, 0, 0, 0, 0], feedback: [], profiles: 240, orgMaps: 6, startMonth: 3 },
  { id: 'p-4', title: 'CISO', department: 'Security & Infrastructure', age: 51, slateDay: 36, stageDays: [8, 10, 8, 10, 9, 6], state: 'active', offerDay: 45, funnel: [176, 81, 29, 11, 5, 1, 0], feedback: [31, 70, 96], profiles: 420, orgMaps: 12, startMonth: 3 },
  { id: 'f-1', title: 'EVP, Operations', department: 'Executive Leadership', age: 96, slateDay: 36, stageDays: [8, 9, 8, 11, 15, 17], state: 'filled', filledInHouse: true, offerDay: 79, accepted: true, funnel: [118, 60, 24, 8, 3, 1, 1], feedback: [4, 11, 26], profiles: 260, orgMaps: 8, startMonth: 0 },
  { id: 'f-2', title: 'EVP, General Counsel', department: 'Executive Leadership', age: 101, slateDay: 42, stageDays: [9, 10, 11, 12, 20, 13], state: 'filled', filledInHouse: true, offerDay: 88, accepted: true, funnel: [96, 47, 19, 7, 3, 1, 1], feedback: [18, 33, 52], profiles: 250, orgMaps: 7, startMonth: 0 },
  { id: 'f-3', title: 'Chief Revenue Officer', department: 'Executive Leadership', age: 84, slateDay: 31, stageDays: [7, 8, 7, 9, 22, 12], state: 'filled', filledInHouse: true, offerDay: 74, accepted: true, funnel: [110, 55, 22, 8, 3, 1, 1], feedback: [6, 15, 41], profiles: 270, orgMaps: 8, startMonth: 1 },
  { id: 'f-4', title: 'Chief Marketing Officer', department: 'Product & Growth', age: 92, slateDay: 39, stageDays: [8, 10, 9, 12, 18, 14], state: 'filled', filledInHouse: true, offerDay: 81, accepted: true, funnel: [104, 52, 21, 8, 3, 1, 1], feedback: [19, 44], profiles: 280, orgMaps: 9, startMonth: 1 },
  { id: 'f-5', title: 'Chief People Officer', department: 'Executive Leadership', age: 124, slateDay: 58, stageDays: [12, 15, 14, 17, 28, 22], state: 'filled', filledInHouse: false, offerDay: 112, accepted: true, funnel: [128, 62, 24, 7, 3, 1, 1], feedback: [58, 79, 9], profiles: 290, orgMaps: 10, startMonth: 0 },
  { id: 'f-6', title: 'VP, Sales', department: 'Executive Leadership', age: 118, slateDay: 40, stageDays: [9, 12, 10, 13, 30, 24], state: 'lost', offerDay: 98, accepted: false, funnel: [78, 37, 15, 5, 3, 1, 0], feedback: [22, 36, 150], profiles: 145, orgMaps: 4, startMonth: 0 },
];

const FUNNEL_LABELS = ['Identified', 'Contacted', 'Engaged', 'Interviewed', 'Slate', 'Offer', 'Hired'];
const FEEDBACK_IN_BOOK_PCT = 62;
const RESEARCH_MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov (to date)'];
/** Share of a full month the current month represents (Nov 5) */
const CURRENT_MONTH_WEIGHT = 0.45;

export const MANUAL_BASELINE_DAYS = 62;
export const SLATE_TARGET: [number, number] = [30, 45];
export const OFFER_GOAL_DAYS = 120;
export const STALL_DAYS = 13;

/* ------------------------------------------------------------------ */
/* Projects available in the selector                                   */
/* ------------------------------------------------------------------ */

export const ALL_PROJECTS = 'all';

export interface AnalyticsProject {
  id: string;
  title: string;
  status: string;
  group: 'Open and in progress' | 'Closed';
}

const liveProject = (id: string) => mockProjects.find(p => p.id === id);

export const ANALYTICS_PROJECTS: AnalyticsProject[] = SEARCHES.map(s => {
  const live = liveProject(s.id);
  const status = live ? projectStatusLabel(live.status) : 'Closed';
  return { id: s.id, title: live?.title ?? s.title, status, group: live && isProjectLive(live.status) ? 'Open and in progress' : 'Closed' };
});

export const isKnownProject = (id: string | null | undefined): id is string => !!id && SEARCHES.some(s => s.id === id);

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

export type Tone = 'good' | 'warn' | 'bad' | 'neutral';

export interface AnalyticsModel {
  inputs: AnalyticsInputs;
  scope: { id: string; title: string; status: string; single: boolean };
  searchCount: number;
  slate: {
    median: number;
    baseline: number;
    improvementPct: number;
    target: [number, number];
    withinTarget: number;
    slated: number;
    portfolioMedian: number;
    /** Bars to draw: one per search, plus reference rows when a single project is selected */
    rows: { label: string; days: number; slated: boolean; kind: 'search' | 'reference'; band: 'under' | 'within' | 'over' }[];
  };
  stages: {
    names: readonly string[];
    medians: number[];
    portfolioMedians: number[];
    slowestIndex: number;
    searches: { title: string; days: number[]; current: number; stalled: boolean; total: number; active: boolean }[];
    stalledCount: number;
  };
  funnel: { label: string; count: number; stepPct: number | null; portfolioStepPct: number | null; overallPct: number }[];
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
    label: string;
    coveredPct: number;
    freshPct: number;
    roles: number;
    heat: { dept: string; cells: ({ covered: number; total: number } | null)[] }[];
  };
  agency: {
    inHouse: number;
    feePct: number;
    avgComp: number;
    perSearch: number;
    avoided: number;
    /** What an open project would avoid if it fills in-house */
    projected: number;
    note: string | null;
  };
  offers: {
    decided: number;
    accepted: number;
    acceptancePct: number;
    medianDaysToOffer: number;
    goal: number;
    withinGoal: number;
    pending: number;
    /** Single project: where it stands */
    status: 'accepted' | 'declined' | 'pending' | 'none' | null;
    markerDay: number;
  };
  takeaways: string;
}

export const formatMoney = (n: number) => (n === 0 ? '$0' : n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000).toLocaleString()}K`);

function currentStage(s: SearchRecord) {
  let current = 0;
  s.stageDays.forEach((d, i) => {
    if (d > 0) current = i;
  });
  return current;
}

const bandOf = (days: number): 'under' | 'within' | 'over' => (days < SLATE_TARGET[0] ? 'under' : days <= SLATE_TARGET[1] ? 'within' : 'over');

export function buildAnalytics(roles: RoleSuccessionItem[], inputs: AnalyticsInputs = DEFAULT_INPUTS, projectId: string = ALL_PROJECTS): AnalyticsModel {
  const single = isKnownProject(projectId) ? SEARCHES.find(s => s.id === projectId)! : null;
  const set = single ? [single] : SEARCHES;
  const meta = single ? ANALYTICS_PROJECTS.find(p => p.id === single.id)! : null;
  const scope = {
    id: single ? single.id : ALL_PROJECTS,
    title: meta ? meta.title : 'All projects',
    status: meta ? meta.status : '',
    single: !!single,
  };

  /* 1. Time to slate */
  const slatedAll = SEARCHES.filter(s => s.slateDay !== null).map(s => s.slateDay as number);
  const portfolioMedian = Math.round(median(slatedAll));
  const slatedDays = set.filter(s => s.slateDay !== null).map(s => s.slateDay as number);
  const slateMedian = Math.round(median(slatedDays));
  const rows: AnalyticsModel['slate']['rows'] = set.map(s => {
    const slated = s.slateDay !== null;
    const days = s.slateDay ?? s.age;
    return { label: ANALYTICS_PROJECTS.find(p => p.id === s.id)!.title, days, slated, kind: 'search', band: bandOf(days) };
  });
  if (single) {
    rows.push({ label: 'All projects (median)', days: portfolioMedian, slated: true, kind: 'reference', band: bandOf(portfolioMedian) });
    rows.push({ label: 'Baseline before Phenom', days: MANUAL_BASELINE_DAYS, slated: true, kind: 'reference', band: bandOf(MANUAL_BASELINE_DAYS) });
  }
  const slate = {
    median: slateMedian,
    baseline: MANUAL_BASELINE_DAYS,
    improvementPct: slatedDays.length ? Math.round(((MANUAL_BASELINE_DAYS - slateMedian) / MANUAL_BASELINE_DAYS) * 100) : 0,
    target: SLATE_TARGET,
    withinTarget: slatedDays.filter(d => d <= SLATE_TARGET[1]).length,
    slated: slatedDays.length,
    portfolioMedian,
    rows,
  };

  /* 2. Time in stage */
  const portfolioMedians = PIPELINE_STAGES.map((_, i) => Math.round(median(SEARCHES.filter(s => s.stageDays[i] > 0).map(s => s.stageDays[i]))));
  const stageMedians = single ? single.stageDays.slice() : portfolioMedians;
  const stageSet = single ? [single] : SEARCHES.filter(s => s.state === 'active');
  const stageSearches = stageSet.map(s => {
    const current = currentStage(s);
    return {
      title: ANALYTICS_PROJECTS.find(p => p.id === s.id)!.title,
      days: s.stageDays,
      current,
      stalled: s.state === 'active' && s.stageDays[current] >= STALL_DAYS,
      total: s.stageDays.reduce((a, b) => a + b, 0),
      active: s.state === 'active',
    };
  });
  const stages = {
    names: PIPELINE_STAGES,
    medians: stageMedians,
    portfolioMedians,
    slowestIndex: stageMedians.indexOf(Math.max(...stageMedians)),
    searches: stageSearches,
    stalledCount: stageSearches.filter(s => s.stalled).length,
  };

  /* 3. Funnel */
  const sumFunnel = (list: SearchRecord[]) => FUNNEL_LABELS.map((_, i) => list.reduce((a, s) => a + s.funnel[i], 0));
  const counts = sumFunnel(set);
  const portfolioCounts = sumFunnel(SEARCHES);
  const funnel = counts.map((count, i) => ({
    label: FUNNEL_LABELS[i],
    count,
    stepPct: i === 0 ? null : counts[i - 1] ? Math.round((count / counts[i - 1]) * 1000) / 10 : 0,
    portfolioStepPct: i === 0 ? null : Math.round((portfolioCounts[i] / portfolioCounts[i - 1]) * 1000) / 10,
    overallPct: counts[0] ? Math.round((count / counts[0]) * 10000) / 100 : 0,
  }));

  /* 4. Feedback turnaround */
  const hours = set.flatMap(s => s.feedback);
  const edges: [string, number, number][] = [
    ['Under 24h', 0, 24],
    ['24 to 48h', 24, 48],
    ['48 to 72h', 48, 72],
    ['3 to 5 days', 72, 120],
    ['Over 5 days', 120, Infinity],
  ];
  const feedback = {
    medianHours: Math.round(median(hours)),
    n: hours.length,
    inBookPct: FEEDBACK_IN_BOOK_PCT,
    within48Pct: hours.length ? Math.round((hours.filter(h => h < 48).length / hours.length) * 100) : 0,
    buckets: edges.map(([label, lo, hi]) => ({ label, count: hours.filter(h => h >= lo && h < hi).length })),
  };

  /* 5. Research hours: spread each search's work across the months it has been active */
  const monthly = RESEARCH_MONTHS.map((_, mi) =>
    set.reduce((hoursInMonth, s) => {
      if (mi < s.startMonth) return hoursInMonth;
      const weights = RESEARCH_MONTHS.map((__, k) => (k < s.startMonth ? 0 : (1 + 0.15 * (k - s.startMonth)) * (k === RESEARCH_MONTHS.length - 1 ? CURRENT_MONTH_WEIGHT : 1)));
      const total = weights.reduce((a, b) => a + b, 0);
      const share = weights[mi] / total;
      return hoursInMonth + (s.profiles * share * inputs.minutesPerProfile + s.orgMaps * share * inputs.minutesPerOrgMap) / 60;
    }, 0)
  );
  let running = 0;
  const cumulativeHours = monthly.map(h => {
    running += h;
    return Math.round(running);
  });
  const profiles = set.reduce((a, s) => a + s.profiles, 0);
  const orgMaps = set.reduce((a, s) => a + s.orgMaps, 0);
  const research = {
    months: RESEARCH_MONTHS,
    cumulativeHours,
    totalHours: cumulativeHours[cumulativeHours.length - 1],
    profiles,
    orgMaps,
    fteWeeks: Math.round((cumulativeHours[cumulativeHours.length - 1] / 40) * 10) / 10,
  };

  /* 6. Bench readiness (from tracked roles; a single project looks at roles in its function) */
  const scopedRoles = single ? roles.filter(r => r.department === single.department) : roles;
  const depts = Array.from(new Set(scopedRoles.map(r => r.department)));
  const heat = depts.map(dept => ({
    dept,
    cells: LEVELS.map(level => {
      const inCell = scopedRoles.filter(r => r.department === dept && r.level === level);
      if (inCell.length === 0) return null;
      return { covered: inCell.filter(r => r.candidates.length >= 2).length, total: inCell.length };
    }),
  }));
  const coveredRoles = scopedRoles.filter(r => r.candidates.length >= 2).length;
  const allCands = scopedRoles.flatMap(r => r.candidates);
  const fresh = allCands.filter(c => hashString(c.id) % 100 < 82).length;
  const bench = {
    label: single ? `${single.department} roles` : 'Critical roles',
    coveredPct: scopedRoles.length ? Math.round((coveredRoles / scopedRoles.length) * 100) : 0,
    freshPct: allCands.length ? Math.round((fresh / allCands.length) * 100) : 0,
    roles: scopedRoles.length,
    heat,
  };

  /* 7. Agency spend avoided */
  const perSearch = Math.round(inputs.avgComp * (inputs.feePct / 100));
  const inHouse = set.filter(s => s.state === 'filled' && s.filledInHouse).length;
  let agencyNote: string | null = null;
  if (single) {
    if (single.state === 'active') agencyNote = 'Not filled yet. The projected figure is realized once this search fills in-house.';
    else if (single.state === 'lost') agencyNote = 'This search closed without a hire, so no agency spend was avoided.';
    else if (!single.filledInHouse) agencyNote = 'This search was filled through an agency, so no agency spend was avoided.';
  }
  const agency = { inHouse, feePct: inputs.feePct, avgComp: inputs.avgComp, perSearch, avoided: perSearch * inHouse, projected: perSearch, note: agencyNote };

  /* 8. Offers */
  const decided = set.filter(s => s.accepted !== undefined);
  const decidedDays = decided.map(s => s.offerDay as number);
  const singleStatus: AnalyticsModel['offers']['status'] = single
    ? single.accepted === true
      ? 'accepted'
      : single.accepted === false
        ? 'declined'
        : single.offerDay !== undefined
          ? 'pending'
          : 'none'
    : null;
  const offerDays = set.filter(s => s.offerDay !== undefined).map(s => s.offerDay as number);
  const offers = {
    decided: decided.length,
    accepted: decided.filter(s => s.accepted).length,
    acceptancePct: decided.length ? Math.round((decided.filter(s => s.accepted).length / decided.length) * 100) : 0,
    medianDaysToOffer: Math.round(median(single ? offerDays : decidedDays)),
    goal: OFFER_GOAL_DAYS,
    withinGoal: (single ? offerDays : decidedDays).filter(d => d <= OFFER_GOAL_DAYS).length,
    pending: set.filter(s => s.offerDay !== undefined && s.accepted === undefined).length,
    status: singleStatus,
    markerDay: single ? (single.offerDay ?? single.age) : Math.round(median(decidedDays)),
  };

  const model: AnalyticsModel = {
    inputs,
    scope,
    searchCount: set.length,
    slate,
    stages,
    funnel,
    feedback,
    research,
    bench,
    agency,
    offers,
    takeaways: '',
  };
  model.takeaways = buildTakeaways(model, single);
  return model;
}

function buildTakeaways(m: AnalyticsModel, single: SearchRecord | null): string {
  const slowest = m.stages.names[m.stages.slowestIndex];
  if (!single) {
    return (
      `Searches reach a first slate in a median of ${m.slate.median} days, ${m.slate.improvementPct}% faster than the ${m.slate.baseline}-day baseline, and ${m.slate.withinTarget} of ${m.slate.slated} landed inside the ${SLATE_TARGET[0]} to ${SLATE_TARGET[1]} day target. ` +
      `Agents returned ${m.research.totalHours.toLocaleString()} research hours and ${m.agency.inHouse} in-house fills avoided an estimated ${formatMoney(m.agency.avoided)} in agency fees, while the ${slowest} stage remains the slowest at a median of ${m.stages.medians[m.stages.slowestIndex]} days.`
    );
  }
  const title = m.scope.title;
  const first =
    single.slateDay !== null
      ? `${title} reached its first slate on day ${single.slateDay}, ${single.slateDay <= SLATE_TARGET[1] ? 'inside' : `${single.slateDay - SLATE_TARGET[1]} days past`} the ${SLATE_TARGET[0]} to ${SLATE_TARGET[1]} day target and against a portfolio median of ${m.slate.portfolioMedian} days.`
      : `${title} is on day ${single.age} with no slate presented yet; the target is day ${SLATE_TARGET[1]}.`;
  let second = `Agents returned ${m.research.totalHours.toLocaleString()} research hours across ${m.funnel[0].count} identified candidates`;
  if (single.state === 'active') {
    const s = m.stages.searches[0];
    second += `, and the search is in the ${m.stages.names[s.current]} stage for ${s.days[s.current]} days${s.stalled ? ', which is stalled against the portfolio pace' : ''}.`;
  } else if (single.state === 'filled') {
    second += single.filledInHouse ? `. It filled in-house, avoiding about ${formatMoney(m.agency.perSearch)} in agency fees.` : '. It was filled through an agency.';
  } else {
    second += '. The search closed after the offer was declined.';
  }
  return `${first} ${second}`;
}

/* ------------------------------------------------------------------ */
/* Headlines shared by the page and the PDF                             */
/* ------------------------------------------------------------------ */

export interface Headline {
  value: string;
  unit: string;
  tone: Tone;
}

export function kpiHeadlines(m: AnalyticsModel): Record<KpiMeta['id'], Headline> {
  const single = m.scope.single;
  const [, hi] = SLATE_TARGET;
  const s = m.slate;

  const searchRow = s.rows.find(r => r.kind === 'search');
  let slateH: Headline;
  if (!single) {
    slateH = {
      value: `${s.median} days`,
      unit: `${s.improvementPct}% faster than the ${s.baseline}-day baseline · ${s.withinTarget} of ${s.slated} slates inside the target`,
      tone: s.median <= hi ? 'good' : 'bad',
    };
  } else if (searchRow?.slated) {
    const d = searchRow.days;
    slateH = {
      value: `${d} days`,
      unit: d <= hi ? `Inside the ${SLATE_TARGET[0]} to ${hi} day target · ${Math.round(((s.baseline - d) / s.baseline) * 100)}% faster than the baseline` : `${d - hi} days past the ${SLATE_TARGET[0]} to ${hi} day target`,
      tone: d <= hi ? 'good' : 'bad',
    };
  } else {
    const d = searchRow?.days ?? 0;
    slateH = { value: `Day ${d}`, unit: d > hi ? `No slate yet · ${d - hi} days past the day-${hi} target` : `No slate yet · target is day ${hi}`, tone: d > hi ? 'bad' : 'warn' };
  }

  const slowest = m.stages.names[m.stages.slowestIndex];
  let stageH: Headline;
  if (!single) {
    stageH = { value: slowest, unit: `Slowest stage, median ${m.stages.medians[m.stages.slowestIndex]} days · ${m.stages.stalledCount} searches stalled`, tone: 'warn' };
  } else {
    const row = m.stages.searches[0];
    stageH = row.active
      ? { value: m.stages.names[row.current], unit: `Current stage, day ${row.days[row.current]} · ${row.stalled ? 'stalled against the portfolio pace' : 'on pace'}`, tone: row.stalled ? 'bad' : 'good' }
      : { value: slowest, unit: `Slowest stage for this search, ${m.stages.medians[m.stages.slowestIndex]} days`, tone: 'neutral' };
  }

  const last = [...m.funnel].reverse().find(f => f.count > 0) ?? m.funnel[0];
  const convH: Headline = {
    value: `${last.overallPct}%`,
    unit: `${last.count.toLocaleString()} reached ${last.label} of ${m.funnel[0].count.toLocaleString()} identified`,
    tone: 'neutral',
  };

  const f = m.feedback;
  const feedH: Headline =
    f.n === 0
      ? { value: 'None yet', unit: 'No slate feedback has been requested', tone: 'neutral' }
      : { value: `${f.medianHours} hours`, unit: `Median feedback turnaround · ${f.within48Pct}% within 48 hours`, tone: f.medianHours <= 48 ? 'good' : 'warn' };

  const resH: Headline = {
    value: m.research.totalHours.toLocaleString(),
    unit: `Research hours returned · about ${m.research.fteWeeks} full-time weeks`,
    tone: 'good',
  };

  const benchH: Headline = {
    value: `${m.bench.coveredPct}%`,
    unit: `${m.bench.label} with 2 or more benchmarked successors`,
    tone: m.bench.coveredPct >= 80 ? 'good' : 'warn',
  };

  let agencyH: Headline;
  if (!single) agencyH = { value: formatMoney(m.agency.avoided), unit: `Agency spend avoided on ${m.agency.inHouse} in-house fills`, tone: 'good' };
  else if (m.agency.inHouse === 1) agencyH = { value: formatMoney(m.agency.avoided), unit: 'Agency fee avoided on this in-house fill', tone: 'good' };
  else agencyH = { value: '$0', unit: m.agency.note?.startsWith('Not filled') ? `Not filled yet · ${formatMoney(m.agency.projected)} projected if filled in-house` : 'No agency spend avoided on this search', tone: 'neutral' };

  const o = m.offers;
  let offerH: Headline;
  if (!single) offerH = { value: `${o.acceptancePct}% accepted`, unit: `Median ${o.medianDaysToOffer} days to offer · goal is ${o.goal} days`, tone: 'good' };
  else if (o.status === 'accepted') offerH = { value: 'Accepted', unit: `Offer extended on day ${o.markerDay} · ${o.markerDay <= o.goal ? 'inside' : 'past'} the ${o.goal}-day goal`, tone: 'good' };
  else if (o.status === 'declined') offerH = { value: 'Declined', unit: `Offer extended on day ${o.markerDay} was not accepted`, tone: 'bad' };
  else if (o.status === 'pending') offerH = { value: 'Pending', unit: `Offer extended on day ${o.markerDay} · goal is day ${o.goal}`, tone: 'warn' };
  else offerH = { value: 'No offer yet', unit: `Day ${o.markerDay} of the ${o.goal}-day goal`, tone: 'neutral' };

  return {
    'time-to-slate': slateH,
    'time-in-stage': stageH,
    conversion: convH,
    feedback: feedH,
    'research-hours': resH,
    bench: benchH,
    agency: agencyH,
    offers: offerH,
  };
}
