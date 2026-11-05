import type { SearchIntelligenceData } from '../data/projectSearchIntelligenceData';

/**
 * Hire Difficulty Score (1-10), a composite index computed during intake:
 *
 *   (Talent Scarcity x 35%) + (Compensation Parity Gap x 25%) +
 *   (Market Competition & Posting Duration x 25%) + (Geographic / Work Model Restriction x 15%)
 *
 * plus a hub-restriction surcharge (+2 to +3) for strict on-site mandates in non-hub markets.
 */

export const DIFFICULTY_WEIGHTS = {
  scarcity: 0.35,
  compensation: 0.25,
  competition: 0.25,
  geography: 0.15,
} as const;

export type PillarId = keyof typeof DIFFICULTY_WEIGHTS;
export type TitleScope = 'exact' | 'equivalents' | 'stepups';
export type IndustryScope = 'any' | 'peer' | 'subvertical';

export const SECONDARY_MARKET = 'Secondary market (e.g. Columbus, OH)';
/** Share of the national executive pool living in a secondary / non-hub market. */
export const SECONDARY_MARKET_DENSITY = 3;

export const TITLE_SCOPE_OPTIONS: { id: TitleScope; label: string; description: string; multiplier: number }[] = [
  { id: 'exact', label: 'Exact title only', description: 'Only people currently holding the exact title', multiplier: 0.55 },
  { id: 'equivalents', label: 'Title + equivalents', description: 'Accepts equivalent titles at the same level', multiplier: 1 },
  { id: 'stepups', label: 'Include step-ups', description: 'Also considers the level below (step-up candidates)', multiplier: 1.6 },
];

export const INDUSTRY_SCOPE_OPTIONS: { id: IndustryScope; label: string; description: string; multiplier: number }[] = [
  { id: 'subvertical', label: 'Same sub-vertical only', description: 'Direct competitors and adjacent products only', multiplier: 0.5 },
  { id: 'peer', label: 'Peer sectors', description: 'Comparable industries and business models', multiplier: 1 },
  { id: 'any', label: 'Any industry', description: 'Industry-agnostic, function and scale matter most', multiplier: 1.25 },
];

export interface CalibrationScenario {
  /** Client approved base salary budget */
  baseBudget: number;
  /** Ids of "unyielding" requirement filters currently applied */
  filterIds: string[];
  /** Days per week on-site (0 = fully remote / national search) */
  onsiteDays: number;
  relocationOpen: boolean;
  /** Primary office metro, or SECONDARY_MARKET */
  locationMetro: string;
  titleScope: TitleScope;
  industryScope: IndustryScope;
  /** Minimum years in a comparable seat */
  minYears: number;
}

export interface CompetitionSnapshot {
  activePostings: number;
  avgDaysOpen: number;
  peers: { name: string; postings: number; daysOpen: number }[];
}

export type DifficultyTone = 'green' | 'lime' | 'amber' | 'orange' | 'red';

export interface PillarResult {
  id: PillarId;
  label: string;
  weight: number;
  /** 1-10 sub-score */
  sub: number;
  /** weighted contribution to the final score */
  points: number;
  detail: string;
  sources: string;
}

export interface PoolStep {
  label: string;
  pool: number;
}

export interface DifficultyResult {
  score: number;
  label: string;
  tone: DifficultyTone;
  pillars: PillarResult[];
  surcharge: { points: number; reason: string } | null;
  pool: number;
  poolSteps: PoolStep[];
  drivers: string[];
  timeToFillDays: number;
  supplyPerPosting: number;
  localDensity: number;
}

export interface Sensitivity {
  id: string;
  label: string;
  /** Short imperative phrase used in generated summaries */
  phrase: string;
  next: CalibrationScenario;
  deltaScore: number;
  deltaPool: number;
  /** Unrealistic for most executive searches (e.g. fully remote); never auto-recommended */
  drastic?: boolean;
}

/** Estimated search duration: competitor posting duration scaled by how hard this profile is to land. */
export const estimateSearchDays = (score: number, avgDaysOpen: number) => Math.round(avgDaysOpen * (0.6 + 0.08 * score));

/** Average concurrent open searches for a comparable executive role, used to express competitor demand. */
export const MARKET_AVG_POSTINGS = 10;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round1 = (n: number) => Math.round(n * 10) / 10;
const money = (n: number) => `$${Math.round(n / 1000)}K`;

/* ------------------------------------------------------------------ */
/* Scenario defaults & competition snapshot                            */
/* ------------------------------------------------------------------ */

/** Intake baseline: the requirements as submitted by the hiring manager. */
export function initialScenario(data: SearchIntelligenceData): CalibrationScenario {
  const req = data.geography.clientRequirement.toLowerCase();
  const daysMatch = req.match(/(\d)(?:\s*-\s*(\d))?[\s-]*day/);
  let onsiteDays = 3;
  if (/remote/.test(req) && !/hybrid/.test(req)) onsiteDays = 0;
  else if (daysMatch) onsiteDays = Number(daysMatch[2] ?? daysMatch[1]);
  const hq = data.geography.topHubs.find(h => h.isClientHQ) ?? data.geography.topHubs[0];

  return {
    baseBudget: data.compensation.clientBudgetBase,
    // The first two "unyielding" requirements are what the hiring manager asked for at intake.
    filterIds: data.talentPool.interactiveFilters.slice(0, 2).map(f => f.id),
    onsiteDays,
    relocationOpen: false,
    locationMetro: hq?.metro ?? SECONDARY_MARKET,
    titleScope: 'equivalents',
    industryScope: 'peer',
    minYears: 5,
  };
}

const COMPETITION_OVERRIDES: Record<string, { activePostings: number; avgDaysOpen: number }> = {
  'p-1': { activePostings: 31, avgDaysOpen: 82 },
  'p-2': { activePostings: 38, avgDaysOpen: 68 },
  'p-3': { activePostings: 54, avgDaysOpen: 58 },
  'p-4': { activePostings: 22, avgDaysOpen: 91 },
  'role-req-1': { activePostings: 47, avgDaysOpen: 76 },
};

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Competitor posting snapshot (modeled on SerpApi / Google Jobs live posting counts and days online). */
export function getCompetitionSnapshot(data: SearchIntelligenceData): CompetitionSnapshot {
  const seed = hashString(`${data.projectId}:${data.roleTitle}`);
  const base = COMPETITION_OVERRIDES[data.projectId] ?? {
    activePostings: 16 + (seed % 44),
    avgDaysOpen: 46 + ((seed >> 4) % 44),
  };
  const peerNames = data.sourceCompanies.topTen.slice(0, 5).map(c => c.name);
  const weights = [0.32, 0.24, 0.2, 0.14, 0.1];
  const peers = peerNames.map((name, i) => ({
    name,
    postings: Math.max(1, Math.round(base.activePostings * weights[i])),
    daysOpen: clamp(base.avgDaysOpen + ((seed >> (i + 2)) % 25) - 12, 21, 140),
  }));
  return { ...base, peers };
}

/* ------------------------------------------------------------------ */
/* Scoring                                                              */
/* ------------------------------------------------------------------ */

export function localDensityFor(data: SearchIntelligenceData, metro: string): number {
  if (metro === SECONDARY_MARKET) return SECONDARY_MARKET_DENSITY;
  return data.geography.topHubs.find(h => h.metro === metro)?.percentage ?? SECONDARY_MARKET_DENSITY;
}

/** Talent Scarcity sub-score: TAM > 500 -> 1-3 pts, TAM < 50 -> 8-10 pts (log scale in between). */
export function scarcitySubScore(pool: number): number {
  return clamp(3 + 5 * Math.log10(500 / Math.max(pool, 1)), 1, 10);
}

/** Compensation Parity Gap sub-score: >= P75 low (-20%), 25th-50th moderate, <= P25 high penalty. */
export function compensationSubScore(budget: number, p25: number, median: number, p75: number): number {
  if (budget >= p75) return 1.5;
  if (budget >= median) return 1.5 + ((p75 - budget) / (p75 - median)) * 2.5;
  if (budget >= p25) return 4 + ((median - budget) / (median - p25)) * 3;
  return 7 + clamp(((p25 - budget) / p25) * 15, 0, 3);
}

/** Market Competition sub-score from competitor posting duration (primary) and requisition volume. */
export function competitionSubScore(c: CompetitionSnapshot): number {
  const days = clamp(3 + ((c.avgDaysOpen - 45) / 40) * 5, 1, 10);
  const volume = clamp((c.activePostings - 20) / 30, -1, 1);
  return clamp(days + volume, 1, 10);
}

export function difficultyLabel(score: number): { label: string; tone: DifficultyTone } {
  if (score < 3) return { label: 'Accessible', tone: 'green' };
  if (score < 5) return { label: 'Moderate', tone: 'lime' };
  if (score < 7) return { label: 'Difficult', tone: 'amber' };
  if (score < 9) return { label: 'Very Difficult', tone: 'orange' };
  return { label: 'Extreme', tone: 'red' };
}

export function computeDifficulty(
  data: SearchIntelligenceData,
  scenario: CalibrationScenario,
  competition: CompetitionSnapshot = getCompetitionSnapshot(data)
): DifficultyResult {
  const { baseSalary, totalCashOTE } = data.compensation;

  /* --- 1. Talent pool (TAM compression) --- */
  const steps: PoolStep[] = [{ label: 'National addressable market', pool: data.talentPool.baselineTAM }];
  let pool = data.talentPool.baselineTAM;
  const shrink = (label: string, multiplier: number) => {
    pool = Math.max(1, Math.round(pool * multiplier));
    steps.push({ label, pool });
  };

  data.talentPool.interactiveFilters
    .filter(f => scenario.filterIds.includes(f.id))
    .forEach(f => shrink(f.label, Math.max((100 + f.impactPercent) / 100, 0.05)));

  const titleOpt = TITLE_SCOPE_OPTIONS.find(o => o.id === scenario.titleScope)!;
  if (titleOpt.multiplier !== 1) shrink(`Title scope: ${titleOpt.label}`, titleOpt.multiplier);
  const industryOpt = INDUSTRY_SCOPE_OPTIONS.find(o => o.id === scenario.industryScope)!;
  if (industryOpt.multiplier !== 1) shrink(`Industry: ${industryOpt.label}`, industryOpt.multiplier);
  const yearsMultiplier = clamp(1.15 - 0.07 * scenario.minYears, 0.35, 1.15);
  if (Math.abs(yearsMultiplier - 1) > 0.001) shrink(`Minimum ${scenario.minYears} yrs in a comparable seat`, yearsMultiplier);

  const density = localDensityFor(data, scenario.locationMetro);
  const restrictiveness = clamp(scenario.onsiteDays / 5, 0, 1);
  const local = density / 100;
  const reachable = scenario.relocationOpen ? local + 0.55 * (1 - local) : local;
  const geoShare = 1 - restrictiveness * (1 - reachable);
  if (geoShare < 0.995) {
    const where = scenario.onsiteDays === 0 ? 'Remote' : `${scenario.onsiteDays}d on-site in ${scenario.locationMetro}`;
    shrink(`Location reach: ${where}${scenario.relocationOpen ? ' (relocation open)' : ''}`, geoShare);
  }

  /* --- 2. Pillar sub-scores --- */
  const scarcity = scarcitySubScore(pool);
  const oteBudget = data.compensation.clientBudgetOTE * (scenario.baseBudget / data.compensation.clientBudgetBase);
  const compBase = compensationSubScore(scenario.baseBudget, baseSalary.p25, baseSalary.median, baseSalary.p75);
  const compOte = compensationSubScore(oteBudget, totalCashOTE.p25, totalCashOTE.median, totalCashOTE.p75);
  const compensation = clamp(compBase * 0.6 + compOte * 0.4, 1, 10);
  const competitionScore = competitionSubScore(competition);

  // How much of the national pool the on-site requirement locks out
  const geography = scenario.onsiteDays === 0 ? 1.5 : clamp(1.5 + 8.5 * restrictiveness * (1 - reachable), 1.5, 10);

  let surcharge: DifficultyResult['surcharge'] = null;
  if (scenario.onsiteDays >= 4 && density < 5) {
    const points = round1(2 + clamp((5 - density) / 5, 0, 1));
    surcharge = {
      points,
      reason: `Strict on-site (${scenario.onsiteDays} days/week) in a non-hub market holding only ${density}% of national executive density`,
    };
  }

  const subs: Record<PillarId, number> = { scarcity, compensation, competition: competitionScore, geography };
  const weighted = (Object.keys(DIFFICULTY_WEIGHTS) as PillarId[]).reduce((sum, id) => sum + subs[id] * DIFFICULTY_WEIGHTS[id], 0);
  const score = round1(clamp(weighted + (surcharge?.points ?? 0), 1, 10));
  const { label, tone } = difficultyLabel(score);

  /* --- 3. Narrative drivers --- */
  const budgetPos =
    scenario.baseBudget >= baseSalary.p75
      ? 'at or above the 75th percentile'
      : scenario.baseBudget >= baseSalary.median
        ? 'between the 50th and 75th percentile'
        : scenario.baseBudget >= baseSalary.p25
          ? 'between the 25th and 50th percentile'
          : 'below the 25th market percentile';
  const scarcityText =
    pool < 50
      ? `Addressable supply is limited to ${pool.toLocaleString()} candidates (under 50 is extreme scarcity)`
      : pool <= 500
        ? `Addressable supply is ${pool.toLocaleString()} candidates (a constrained pool)`
        : `Addressable supply is healthy at ${pool.toLocaleString()} candidates`;
  const compText = `Client target base of ${money(scenario.baseBudget)} is ${budgetPos} (P25 ${money(baseSalary.p25)}, median ${money(baseSalary.median)}, P75 ${money(baseSalary.p75)})`;
  const compeText = `${competition.activePostings} competing searches have been open an average of ${competition.avgDaysOpen} days`;
  const where = scenario.onsiteDays === 0 ? 'Remote / national search' : `${scenario.onsiteDays} day${scenario.onsiteDays === 1 ? '' : 's'} on-site in ${scenario.locationMetro} (${density}% of talent)`;
  const geoText = `${where}${scenario.relocationOpen && scenario.onsiteDays > 0 ? ', relocation open' : ''}`;

  const pillars: PillarResult[] = [
    { id: 'scarcity', label: 'Talent Scarcity / TAM Compression', weight: 35, sub: round1(scarcity), points: round1(scarcity * 0.35), detail: scarcityText, sources: 'People Data Labs talent pool + BLS occupational density' },
    { id: 'compensation', label: 'Compensation Parity Gap', weight: 25, sub: round1(compensation), points: round1(compensation * 0.25), detail: compText, sources: 'SEC DEF 14A filings + SerpApi / Google Jobs salary disclosures' },
    { id: 'competition', label: 'Market Competition & Posting Duration', weight: 25, sub: round1(competitionScore), points: round1(competitionScore * 0.25), detail: compeText, sources: 'SerpApi (Google Jobs posting count and days online)' },
    { id: 'geography', label: 'Geographic & Work Model Constraints', weight: 15, sub: round1(geography), points: round1(geography * 0.15), detail: geoText, sources: 'People Data Labs location clustering + The Org executive hubs' },
  ];

  const drivers = [scarcityText, compText, compeText, geoText];
  if (surcharge) drivers.push(`${surcharge.reason} (+${surcharge.points} pts)`);

  return {
    score,
    label,
    tone,
    pillars,
    surcharge,
    pool,
    poolSteps: steps,
    drivers,
    timeToFillDays: estimateSearchDays(score, competition.avgDaysOpen),
    supplyPerPosting: round1(pool / Math.max(competition.activePostings, 1)),
    localDensity: density,
  };
}

/* ------------------------------------------------------------------ */
/* Recalibration: what loosening each requirement is worth              */
/* ------------------------------------------------------------------ */

export function getSensitivities(
  data: SearchIntelligenceData,
  scenario: CalibrationScenario,
  competition: CompetitionSnapshot = getCompetitionSnapshot(data)
): Sensitivity[] {
  const current = computeDifficulty(data, scenario, competition);
  const candidates: { id: string; label: string; phrase: string; next: CalibrationScenario; drastic?: boolean }[] = [];

  data.talentPool.interactiveFilters
    .filter(f => scenario.filterIds.includes(f.id))
    .forEach(f =>
      candidates.push({
        id: `drop-${f.id}`,
        label: `Make "${f.label}" preferred instead of mandatory`,
        phrase: `relax the "${f.label}" requirement`,
        next: { ...scenario, filterIds: scenario.filterIds.filter(id => id !== f.id) },
      })
    );

  const { median } = data.compensation.baseSalary;
  if (scenario.baseBudget < median) {
    candidates.push({
      id: 'budget-median',
      label: `Raise base budget to the market median (${money(median)})`,
      phrase: `raise base compensation to the P50 median (${money(median)})`,
      next: { ...scenario, baseBudget: median },
    });
  }
  if (!scenario.relocationOpen && scenario.onsiteDays > 0) {
    candidates.push({ id: 'relocation', label: 'Open the search to relocation', phrase: 'open the search to relocation', next: { ...scenario, relocationOpen: true } });
  }
  if (scenario.onsiteDays > 3) {
    candidates.push({ id: 'days-3', label: 'Reduce on-site requirement to 3 days/week', phrase: 'reduce the on-site mandate to three days a week', next: { ...scenario, onsiteDays: 3 } });
  }
  if (scenario.onsiteDays > 0) {
    candidates.push({ id: 'remote', label: 'Allow fully remote / national search', phrase: 'allow a fully remote search', next: { ...scenario, onsiteDays: 0 }, drastic: true });
  }
  if (scenario.titleScope !== 'stepups') {
    candidates.push({
      id: 'title',
      label: scenario.titleScope === 'exact' ? 'Accept equivalent titles' : 'Include step-up candidates from the level below',
      phrase: scenario.titleScope === 'exact' ? 'accept equivalent titles' : 'consider step-up candidates from the level below',
      next: { ...scenario, titleScope: scenario.titleScope === 'exact' ? 'equivalents' : 'stepups' },
    });
  }
  if (scenario.industryScope !== 'any') {
    candidates.push({
      id: 'industry',
      label: scenario.industryScope === 'subvertical' ? 'Widen to peer sectors' : 'Open to any industry',
      phrase: scenario.industryScope === 'subvertical' ? 'widen the industry scope to peer sectors' : 'open the search to any industry',
      next: { ...scenario, industryScope: scenario.industryScope === 'subvertical' ? 'peer' : 'any' },
    });
  }
  if (scenario.minYears > 3) {
    candidates.push({ id: 'years', label: 'Lower minimum seat experience to 3 years', phrase: 'lower the minimum seat experience to three years', next: { ...scenario, minYears: 3 } });
  }

  return candidates
    .map(c => {
      const result = computeDifficulty(data, c.next, competition);
      return { ...c, deltaScore: round1(current.score - result.score), deltaPool: result.pool - current.pool };
    })
    .filter(s => s.deltaScore >= 0.1)
    .sort((a, b) => b.deltaScore - a.deltaScore);
}

/** Greedy "path to a realistic search": apply the most effective levers until the score is workable. */
export function recommendedPath(
  data: SearchIntelligenceData,
  scenario: CalibrationScenario,
  targetScore = 5
): { scenario: CalibrationScenario; steps: Sensitivity[] } {
  const competition = getCompetitionSnapshot(data);
  let current = scenario;
  const steps: Sensitivity[] = [];
  for (let i = 0; i < 4; i++) {
    if (computeDifficulty(data, current, competition).score <= targetScore) break;
    const best = getSensitivities(data, current, competition).find(x => !x.drastic);
    if (!best) break;
    steps.push(best);
    current = best.next;
  }
  return { scenario: current, steps };
}
