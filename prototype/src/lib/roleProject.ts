import type { Candidate, Project, ProjectParameters, ProjectRoleLevel, ProjectWorkModel } from '../types';
import { initialRolesSuccessionData, RoleSuccessionItem, ShadowBenchCandidate } from '../data/rolesSuccessionData';
import { getSearchIntelligenceForRole } from '../data/projectSearchIntelligenceData';

/** Metro markets selectable in the project parameters form. */
export const PROJECT_METRO_OPTIONS = [
  'San Francisco Bay Area',
  'New York Metro Area',
  'Seattle-Bellevue',
  'Austin Metro',
  'Boston-Cambridge',
  'Washington DC Metro',
  'Chicago Metro',
  'London / UK',
  'Remote (US / Global)',
];

export type PipelineSeedCandidate = Candidate & { projectStatus: string; dateAdded: string };

/** Everything in Roles & Succession can seed a new project (active requisitions and succession benches). */
export const trackedRoles: RoleSuccessionItem[] = initialRolesSuccessionData;

export const findTrackedRole = (id: string | null | undefined) => trackedRoles.find(r => r.id === id);

export const cleanRoleTitle = (title: string) => title.replace(/\s+Bench$/i, '').trim();

const LEVEL_MAP: Record<RoleSuccessionItem['level'], ProjectRoleLevel> = {
  'C-Suite': 'C-Suite',
  SVP: 'Senior Vice President',
  VP: 'Vice President',
  'Head of': 'Senior Director',
};

const STAGE_MAP: Partial<Record<RoleSuccessionItem['status'], string>> = {
  'Calibrating Slate': 'Slate Review',
  Interviewing: 'Client Interview',
};

const BENCH_STAGE_MAP: Record<ShadowBenchCandidate['stage'], string> = {
  Identified: 'Identified',
  Calibrated: 'Identified',
  'Warm Outreach': 'Contacted',
  'Ready to Engage': 'Contacted',
};

const k = (n: number) => `$${Math.round(n / 1000)}K`;

function toIsoDate(text: string, fallback: string): string {
  const t = Date.parse(text);
  if (Number.isNaN(t)) return fallback;
  return new Date(t).toISOString().slice(0, 10);
}

export function benchCandidateToPipeline(c: ShadowBenchCandidate, role: RoleSuccessionItem): PipelineSeedCandidate {
  const [firstName, ...rest] = c.name.trim().split(/\s+/);
  return {
    id: c.id,
    firstName,
    lastName: rest.join(' '),
    role: c.currentTitle,
    company: c.company,
    email: '',
    phone: '',
    location: c.location,
    trafficSource: 'Succession Bench',
    avatarUrl: c.avatarUrl,
    linkedinUrl: c.linkedInUrl ?? '',
    emiScore: c.emiScore,
    behavioralScore: c.cmaScore,
    assessmentScore: c.sfaScore,
    executiveData: {
      executiveLevel: role.level,
      function: role.department,
      currentCompanyTenure: c.tenureInRole,
      currentRoleTenure: c.tenureInRole,
      careerVelocity: '—',
      industryExperience: '—',
      companySizeExperience: '—',
      publicCompanyExperience: '—',
      peBackedExperience: '—',
      geographicExperience: '—',
      globalExperience: '—',
      boardExperience: '—',
      education: '—',
      certifications: '—',
      areasOfExpertise: role.department,
      currentCompensation: c.currentCompEst,
      currentEquityType: '—',
      currentEquityShares: '—',
      mobilityIndicator: c.ptmLevel,
      careerTrajectory: c.sfaReason,
      executiveArchetype: c.benchReadiness,
      likelyNextRole: cleanRoleTitle(role.roleTitle),
      candidatePandL: '—',
      relocationWillingness: '—',
      noticePeriod: '—',
      nonCompete: '—',
      gardenLeave: '—',
    },
    projectStatus: BENCH_STAGE_MAP[c.stage] ?? 'Identified',
    dateAdded: new Date().toISOString().split('T')[0],
  };
}

export interface RoleProjectDraft {
  title: string;
  stage: string;
  description: string;
  parameters: ProjectParameters;
  /** Candidates on the role's succession bench, ready to seed the project pipeline */
  bench: PipelineSeedCandidate[];
}

/** Derive the project's details (title, narrative, six parameter blocks, bench) from a tracked role. */
export function roleToProjectDraft(role: RoleSuccessionItem): RoleProjectDraft {
  const title = cleanRoleTitle(role.roleTitle);
  const intel = getSearchIntelligenceForRole(role);
  const comp = intel.compensation;

  const workModel: ProjectWorkModel =
    role.anchors.geographicFlexibility === 'Local Required'
      ? 'On-Site'
      : role.anchors.geographicFlexibility === 'Remote Flexible'
        ? 'Remote'
        : 'Hybrid';

  const hubs = intel.geography.topHubs
    .map(h => h.metro)
    .filter(m => PROJECT_METRO_OPTIONS.includes(m))
    .slice(0, 3);

  const equivalentTitles = Array.from(new Set(role.candidates.map(c => c.currentTitle)))
    .filter(t => t.toLowerCase() !== title.toLowerCase())
    .slice(0, 4);

  const parameters: ProjectParameters = {
    primaryTitle: title,
    equivalentTitles,
    roleLevel: LEVEL_MAP[role.level],
    functionalDomain: role.department,
    domainKeywords: [role.department],

    targetBaseSalary: comp.clientBudgetBase,
    maxBaseBudget: comp.baseSalary.median,
    variableOTE: `${k(Math.max(comp.clientBudgetOTE - comp.clientBudgetBase, 0))} target incentive`,
    equityGrantValue: `${k(comp.equityAnnualMedian)} annual equity (market median)`,
    maxTotalCompensationCeiling: comp.totalCashOTE.p75,

    targetCompanyStage: role.anchors.targetRevenueScale,
    requiredPandLScope: `${role.anchors.targetRevenueScale} scope`,
    teamHeadcountScale: role.anchors.targetHeadcountScope,

    workModel,
    hybridDaysPerWeek: workModel === 'Hybrid' ? 3 : undefined,
    targetMetropolitanMarkets: hubs.length ? hubs : ['San Francisco Bay Area'],
    relocationWillingness: role.anchors.geographicFlexibility !== 'Local Required',

    targetStartDate: toIsoDate(role.targetDate, '2026-12-01'),
    maxNoticePeriodTolerance: '60 days',
    confidentialityProtocol: 'Named Enterprise Search',
  };

  return {
    title,
    stage: STAGE_MAP[role.status] ?? 'Calibration',
    description: `${role.description} Hiring manager: ${role.hiringManager}, ${role.hiringManagerTitle}.`,
    parameters,
    bench: role.candidates.map(c => benchCandidateToPipeline(c, role)),
  };
}

/** Whether a project was created from a tracked role and carries its bench. */
export const hasSeededPipeline = (project: Project) => Boolean(project.seedPipeline && project.seedPipeline.length > 0);
