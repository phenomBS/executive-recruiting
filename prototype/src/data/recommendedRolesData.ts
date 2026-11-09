import type { LiveSignalAlert, RoleSuccessionItem, ShadowBenchCandidate } from './rolesSuccessionData';

/**
 * Roles the agent proposes to track. It analyzed past projects and jobs, spotted a seat that keeps
 * coming up, and started a shadow bench for it. Nothing here is on the main Roles screen until the
 * user activates it.
 */
export interface RoleRecommendation {
  /** One sentence on why the agent proposes this role */
  basis: string;
  /** Past projects and jobs the agent analyzed to reach the recommendation */
  sourceProjects: string[];
  /** Short evidence line, for example how often the seat opened */
  evidence: string;
  recommendedOn: string;
  /** Other names for the same seat, used to catch duplicates in Create Role */
  aliases: string[];
}

export interface RecommendedRole extends RoleSuccessionItem {
  recommendation: RoleRecommendation;
}

const AVATARS = [
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80',
];

interface CandidateSeed {
  name: string;
  title: string;
  company: string;
  location: string;
  tenure: string;
  comp: string;
  emi: number;
  sfa: number;
  cma: number;
  ptm: number;
  signal: Pick<LiveSignalAlert, 'type' | 'text' | 'source' | 'date' | 'severity'>;
  sfaReason: string;
  cmaReason: string;
  ptmReason: string;
}

function bench(roleKey: string, seeds: CandidateSeed[]): ShadowBenchCandidate[] {
  return seeds.map((s, i) => {
    const ptmLevel: ShadowBenchCandidate['ptmLevel'] = s.ptm >= 80 ? 'High' : s.ptm >= 60 ? 'Medium' : 'Low';
    return {
      id: `rb-${roleKey}-${i + 1}`,
      name: s.name,
      currentTitle: s.title,
      company: s.company,
      avatarUrl: AVATARS[(i + roleKey.length) % AVATARS.length],
      location: s.location,
      tenureInRole: s.tenure,
      currentCompEst: s.comp,
      emiScore: s.emi,
      sfaScore: s.sfa,
      cmaScore: s.cma,
      ptmScore: s.ptm,
      ptmLevel,
      liveSignalAlert: s.signal,
      stage: 'Identified',
      benchReadiness: ptmLevel === 'High' ? 'Ready Now (0-30d)' : ptmLevel === 'Medium' ? 'Ready in 3-6mo' : 'Evergreen Watchlist',
      sfaReason: s.sfaReason,
      cmaReason: s.cmaReason,
      ptmReason: s.ptmReason,
      notesCount: 0,
    };
  });
}

function summarize(candidates: ShadowBenchCandidate[]) {
  return {
    totalCandidatesTracked: candidates.length,
    highFlightRiskCount: candidates.filter(c => c.ptmLevel === 'High').length,
    avgEmiMatch: Math.round(candidates.reduce((a, c) => a + c.emiScore, 0) / (candidates.length || 1)),
    benchReadinessRate: Math.round((candidates.filter(c => c.benchReadiness.startsWith('Ready Now')).length / (candidates.length || 1)) * 100),
  };
}

const productBench = bench('cpo', [
  {
    name: 'Priya Raman',
    title: 'SVP, Product',
    company: 'Atlassian',
    location: 'San Francisco, CA',
    tenure: '3 yrs 6 mos',
    comp: '$1.4M TC',
    emi: 93,
    sfa: 94,
    cma: 91,
    ptm: 87,
    signal: { type: 'restructuring', text: 'Product org consolidated under a new Chief Product Officer', source: 'Event Registry Intelligence', date: '2 days ago', severity: 'urgent' },
    sfaReason: 'Runs a multi-product portfolio at the revenue scale of the target seat.',
    cmaReason: 'Wants the top product seat and a board-facing role.',
    ptmReason: 'Consolidation removed the path to the top seat internally.',
  },
  {
    name: 'Daniel Okafor',
    title: 'VP, Platform Product',
    company: 'Datadog',
    location: 'New York, NY',
    tenure: '4 yrs 1 mo',
    comp: '$1.1M TC',
    emi: 90,
    sfa: 91,
    cma: 88,
    ptm: 82,
    signal: { type: 'sec_filing', text: 'SEC Form 4: final grant cliff vests in 45 days', source: 'SEC Edgar Form 4', date: '4 days ago', severity: 'elevated' },
    sfaReason: 'Owns developer platform roadmap and pricing for a public company.',
    cmaReason: 'Looking for an enterprise-wide mandate beyond one platform.',
    ptmReason: 'Vesting cliff and a long stretch without a title change.',
  },
  {
    name: 'Grace Lindholm',
    title: 'Chief Product Officer',
    company: 'Twilio',
    location: 'Denver, CO',
    tenure: '2 yrs 9 mos',
    comp: '$1.6M TC',
    emi: 86,
    sfa: 90,
    cma: 78,
    ptm: 64,
    signal: { type: 'earnings_call', text: 'Management commentary points to a platform reorganization', source: 'Earnings call transcript', date: '1 week ago', severity: 'standard' },
    sfaReason: 'Already holds the title at a comparable company.',
    cmaReason: 'Open to a larger company, not to a lateral move.',
    ptmReason: 'Worth nurturing while the reorganization settles.',
  },
]);

const dataBench = bench('cdo', [
  {
    name: 'Naveen Iyer',
    title: 'VP, Data Platform',
    company: 'Snowflake',
    location: 'Bellevue, WA',
    tenure: '3 yrs 2 mos',
    comp: '$1.25M TC',
    emi: 92,
    sfa: 93,
    cma: 90,
    ptm: 85,
    signal: { type: 'news_event', text: 'Data platform leadership split into two groups after an acquisition', source: 'Bloomberg Tech', date: '3 days ago', severity: 'urgent' },
    sfaReason: 'Runs the data platform used by both engineering and analytics teams.',
    cmaReason: 'Wants a single owner role for data and AI governance.',
    ptmReason: 'The split leaves two leaders for one seat.',
  },
  {
    name: 'Rebecca Tan',
    title: 'Head of Data & Analytics',
    company: 'Uber',
    location: 'San Francisco, CA',
    tenure: '4 yrs 5 mos',
    comp: '$1.05M TC',
    emi: 89,
    sfa: 90,
    cma: 87,
    ptm: 76,
    signal: { type: 'board_change', text: 'Reporting line moved from the CEO to the CFO', source: 'Event Registry Intelligence', date: '1 week ago', severity: 'elevated' },
    sfaReason: 'Owns data strategy for a company with the target engineering scale.',
    cmaReason: 'Looking for a seat that reports at the executive level.',
    ptmReason: 'The new reporting line narrows her mandate.',
  },
  {
    name: 'Marcus Hale',
    title: 'Senior Director, Data Engineering',
    company: 'Stripe',
    location: 'Seattle, WA',
    tenure: '2 yrs 4 mos',
    comp: '$900K TC',
    emi: 84,
    sfa: 86,
    cma: 83,
    ptm: 62,
    signal: { type: 'earnings_call', text: 'Hiring push for data governance leaders', source: 'Job posting analysis', date: '2 weeks ago', severity: 'standard' },
    sfaReason: 'Scope is one level below the target seat with the right headcount.',
    cmaReason: 'Ready for a step-up to the top data role.',
    ptmReason: 'Moderate flight risk based on career velocity.',
  },
]);

const cioBench = bench('cio', [
  {
    name: 'Alana Whitfield',
    title: 'VP, Enterprise Technology',
    company: 'Adobe',
    location: 'San Jose, CA',
    tenure: '3 yrs 8 mos',
    comp: '$1.2M TC',
    emi: 91,
    sfa: 92,
    cma: 89,
    ptm: 83,
    signal: { type: 'restructuring', text: 'IT and security merged into one organization with a new head', source: 'Event Registry Intelligence', date: 'Yesterday', severity: 'urgent' },
    sfaReason: 'Runs enterprise systems and security operations at the target scale.',
    cmaReason: 'Wants to lead technology across the whole company.',
    ptmReason: 'The merger put a new leader above her.',
  },
  {
    name: 'Victor Almeida',
    title: 'SVP, IT Infrastructure',
    company: 'Cisco',
    location: 'Raleigh, NC',
    tenure: '5 yrs 2 mos',
    comp: '$1.3M TC',
    emi: 88,
    sfa: 90,
    cma: 85,
    ptm: 72,
    signal: { type: 'sec_filing', text: 'SEC Form 144: planned share sale under Rule 10b5-1', source: 'SEC Edgar Form 144', date: '5 days ago', severity: 'standard' },
    sfaReason: 'Leads a global infrastructure team at the target headcount.',
    cmaReason: 'Open to a CIO title at a company of similar size.',
    ptmReason: 'Long tenure with no title change.',
  },
  {
    name: 'Joanna Pruitt',
    title: 'VP, Digital Workplace',
    company: 'Intuit',
    location: 'Mountain View, CA',
    tenure: '2 yrs 11 mos',
    comp: '$980K TC',
    emi: 85,
    sfa: 86,
    cma: 84,
    ptm: 58,
    signal: { type: 'news_event', text: 'Intuit announced a leadership refresh across shared services', source: 'Bloomberg Tech', date: '2 weeks ago', severity: 'standard' },
    sfaReason: 'Runs shared enterprise services with a strong delivery record.',
    cmaReason: 'Looking for the step to a top technology seat.',
    ptmReason: 'Watchlist while the refresh plays out.',
  },
]);

const financeBench = bench('vpfin', [
  {
    name: 'Samuel Brooks',
    title: 'VP, Corporate Finance',
    company: 'Workday',
    location: 'Pleasanton, CA',
    tenure: '3 yrs 3 mos',
    comp: '$950K TC',
    emi: 90,
    sfa: 91,
    cma: 88,
    ptm: 81,
    signal: { type: 'sec_filing', text: 'SEC Form 4: final grant cliff vests in 30 days', source: 'SEC Edgar Form 4', date: '3 days ago', severity: 'elevated' },
    sfaReason: 'Leads planning, treasury and investor reporting at a public company.',
    cmaReason: 'Wants a bigger seat on the finance leadership team.',
    ptmReason: 'Vesting cliff and a blocked path to the top finance role.',
  },
  {
    name: 'Anita Desai',
    title: 'Corporate Controller',
    company: 'ServiceNow',
    location: 'Santa Clara, CA',
    tenure: '4 yrs 7 mos',
    comp: '$870K TC',
    emi: 87,
    sfa: 89,
    cma: 84,
    ptm: 69,
    signal: { type: 'board_change', text: 'CFO transition announced; finance org under review', source: 'Event Registry Intelligence', date: '1 week ago', severity: 'elevated' },
    sfaReason: 'Owns close, audit and compliance across a global entity structure.',
    cmaReason: 'Ready for a step-up if the scope covers planning.',
    ptmReason: 'Leadership transition creates a window.',
  },
]);

function recommended(
  id: string,
  base: Omit<RoleSuccessionItem, 'id' | 'type' | 'status' | 'hiringManagerAvatar' | 'daysOpenOrMonitored' | 'totalCandidatesTracked' | 'highFlightRiskCount' | 'avgEmiMatch' | 'benchReadinessRate'>,
  recommendation: RoleRecommendation
): RecommendedRole {
  return {
    ...base,
    id,
    type: 'active_requisition',
    status: 'Active Sourcing',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
    daysOpenOrMonitored: 0,
    ...summarize(base.candidates),
    recommendation,
  };
}

export const initialRecommendedRoles: RecommendedRole[] = [
  recommended(
    'role-rec-cpo',
    {
      roleTitle: 'Chief Product Officer',
      department: 'Product & Growth',
      level: 'C-Suite',
      priorityLevel: 'P1 - High',
      hiringManager: 'Satya Nadella',
      hiringManagerTitle: 'Chief Executive Officer',
      targetDate: 'Jan 31, 2027',
      anchors: {
        targetRevenueScale: '$2B+ Global Enterprise',
        targetHeadcountScope: '400 - 900 Product, Design & Research',
        priorityLevel: 'P1 - High',
        sfaWeight: 40,
        cmaWeight: 35,
        ptmWeight: 25,
        orgComplexityScore: 9,
        geographicFlexibility: 'Hybrid (2-3 days)',
      },
      description: 'Own product strategy and the portfolio roadmap across platform, applications and developer experience.',
      riskSummary: 'No single owner for product strategy; recent searches for product leaders all reported into the same open seat.',
      candidates: productBench,
    },
    {
      basis: 'Three recent searches for product leaders landed at the same gap: nobody owns portfolio-wide product strategy.',
      sourceProjects: ['Senior Product Manager', 'VP, Product Developer Platform', 'Chief Revenue Officer'],
      evidence: '3 product leadership searches in 9 months',
      recommendedOn: 'Nov 3, 2026',
      aliases: ['CPO', 'Head of Product', 'Chief Product Officer'],
    }
  ),
  recommended(
    'role-rec-cdo',
    {
      roleTitle: 'Chief Data & AI Officer',
      department: 'Engineering & AI',
      level: 'C-Suite',
      priorityLevel: 'P1 - High',
      hiringManager: 'Satya Nadella',
      hiringManagerTitle: 'Chief Executive Officer',
      targetDate: 'Feb 28, 2027',
      anchors: {
        targetRevenueScale: '$1B+ Enterprise AI',
        targetHeadcountScope: '200 - 500 Data & ML Engineers',
        priorityLevel: 'P1 - High',
        sfaWeight: 40,
        cmaWeight: 35,
        ptmWeight: 25,
        orgComplexityScore: 8,
        geographicFlexibility: 'Hybrid (2-3 days)',
      },
      description: 'Lead enterprise data strategy, governance and the platform that feeds every AI initiative.',
      riskSummary: 'Data and AI ownership is split across engineering and security; open searches keep asking for the same missing leader.',
      candidates: dataBench,
    },
    {
      basis: 'The VP of Engineering and CISO searches both listed data governance and AI platform ownership as unmet needs.',
      sourceProjects: ['VP of Engineering', 'Chief Information Security Officer (CISO)', 'VP of Artificial Intelligence'],
      evidence: '3 searches named the same gap',
      recommendedOn: 'Nov 3, 2026',
      aliases: ['CDO', 'Chief Data Officer', 'Chief AI Officer', 'CAIO', 'Head of Data'],
    }
  ),
  recommended(
    'role-rec-cio',
    {
      roleTitle: 'Chief Information Officer',
      department: 'Security & Infrastructure',
      level: 'C-Suite',
      priorityLevel: 'P2 - Medium',
      hiringManager: 'Amy Hood',
      hiringManagerTitle: 'Chief Financial Officer',
      targetDate: 'Mar 31, 2027',
      anchors: {
        targetRevenueScale: '$2B+ Global Enterprise',
        targetHeadcountScope: '300 - 700 IT & Infrastructure',
        priorityLevel: 'P2 - Medium',
        sfaWeight: 40,
        cmaWeight: 30,
        ptmWeight: 30,
        orgComplexityScore: 8,
        geographicFlexibility: 'Hybrid (2-3 days)',
      },
      description: 'Run enterprise systems, infrastructure and internal technology, in step with the security organization.',
      riskSummary: 'The CISO search surfaced overlap with enterprise IT; the agent expects a CIO seat to open as the two organizations align.',
      candidates: cioBench,
    },
    {
      basis: 'The CISO search surfaced reporting-line overlap with enterprise IT, and two past IT leadership hires left within two years.',
      sourceProjects: ['Chief Information Security Officer (CISO)', 'EVP, Operations'],
      evidence: '2 IT leaders departed within 24 months',
      recommendedOn: 'Nov 4, 2026',
      aliases: ['CIO', 'Head of IT', 'VP Enterprise Technology'],
    }
  ),
  recommended(
    'role-rec-fin',
    {
      roleTitle: 'VP of Financial Planning & Analysis',
      department: 'Finance & Corporate',
      level: 'VP',
      priorityLevel: 'P2 - Medium',
      hiringManager: 'Amy Hood',
      hiringManagerTitle: 'Chief Financial Officer',
      targetDate: 'Feb 15, 2027',
      anchors: {
        targetRevenueScale: '$1B+ Public Company',
        targetHeadcountScope: '40 - 120 Finance Team Members',
        priorityLevel: 'P2 - Medium',
        sfaWeight: 40,
        cmaWeight: 35,
        ptmWeight: 25,
        orgComplexityScore: 7,
        geographicFlexibility: 'Hybrid (2-3 days)',
      },
      description: 'Lead planning, forecasting and business partnering for the finance organization.',
      riskSummary: 'The CFO search left the planning seat under-resourced; the agent expects a hire here to follow.',
      candidates: financeBench,
    },
    {
      basis: 'The CFO search showed a thin planning team, and past finance searches routinely backfilled this seat within a quarter.',
      sourceProjects: ['CFO', 'Chief People Officer'],
      evidence: 'Seat backfilled within 90 days after 2 finance searches',
      recommendedOn: 'Nov 5, 2026',
      aliases: ['VP FP&A', 'Head of FP&A', 'VP Finance', 'FP&A'],
    }
  ),
];

const normalize = (s: string) => s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();

/** The recommended role a typed title duplicates, or null. Matches on title, alias, or one containing the other. */
export function findRecommendedMatch(title: string, roles: RecommendedRole[]): RecommendedRole | null {
  const t = normalize(title);
  if (t.length < 3) return null;
  for (const r of roles) {
    const names = [r.roleTitle, ...r.recommendation.aliases].map(normalize);
    if (names.some(n => n === t)) return r;
    const full = normalize(r.roleTitle);
    if (t.length >= 6 && (full.includes(t) || t.includes(full))) return r;
  }
  return null;
}
