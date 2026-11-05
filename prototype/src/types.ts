export type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  trafficSource: string;
  avatarUrl?: string;
  linkedinUrl: string;
  emiScore: number;
  behavioralScore: number;
  assessmentScore?: number;
  isSubscribed?: boolean;
  projects?: string[];
  lastContactDate?: string;
  executiveData: {
    executiveLevel: string;
    function: string;
    currentCompanyTenure: string;
    currentRoleTenure: string;
    careerVelocity: string;
    industryExperience: string;
    companySizeExperience: string;
    publicCompanyExperience: string;
    peBackedExperience: string;
    geographicExperience: string;
    globalExperience: string;
    boardExperience: string;
    education: string;
    certifications: string;
    areasOfExpertise: string;
    currentCompensation: string;
    currentEquityType: string;
    currentEquityShares: string;
    mobilityIndicator: string;
    careerTrajectory: string;
    executiveArchetype: string;
    likelyNextRole: string;
    candidatePandL: string;
    relocationWillingness: string;
    noticePeriod: string;
    nonCompete: string;
    gardenLeave: string;
  };
  hasOpportunityRoom?: boolean;
  opportunityRoomTitle?: string;
  opportunityRoomStatus?: string;
};

export type RecommendedCandidate = Candidate & {
  recommendationReason: string;
  matchScore: number;
  addedToCrm?: boolean;
};

export type RecommendedCompany = Company & {
  recommendationReason: string;
  mobilitySignal: string;
  addedToCrm?: boolean;
};

export type NewsItem = {
  id: string;
  source: string;
  title: string;
  date: string;
  url: string;
};

export type EMIScore = {
  total: number;
  cma: {
    score: number; // 40% weight
    stepUpDelta: number;
    scaleExpansion: number;
    profileMatch: number;
    geoLifestyle: number;
  };
  ptm: {
    score: number; // 35% weight
    orgInstability: number;
    equityVesting: number;
    blockedNumber2: number;
    tenureStagnation: number;
  };
  sfa: {
    score: number; // 25% weight
    compensationParity: number;
    operationalScope: number;
    offLimits: number;
    noticePeriod: number;
  };
};

export type Company = {
  id: string;
  name: string;
  logoUrl?: string;
  industry: string;
  size: string;
  revenue: string;
  headquarters: string;
  website: string;
  description: string;
  executivesCount: number;
  relevantCandidatesCount: number;
  crmCandidatesCount: number;
  activeLeadershipChanges: number;
  activeSearchesCount: number;
  lastUpdated: string;
  growthIndicators: string[];
  recentAcquisitions: string[];
  activeOpenings: string[];
  strategicInitiatives: string[];
};

export type Executive = {
  id: string;
  name: string;
  title: string;
  function: string;
  location: string;
  tenure: string;
  previousCompany: string;
  previousTitle: string;
  emiScore: number;
  openJobsFit: number;
  crmStatus: string;
  relationshipStatus: string;
  readinessScore: number;
  reportsTo?: string; // ID of the executive they report to
  isFormer?: boolean;
};

export type MarketActivity = {
  id: string;
  date: string;
  type: string;
  description: string;
};

export type SearchAssociation = {
  id: string;
  title: string;
  status: string;
  role: string;
  candidatesIdentified: number;
};

export type ProjectRoleLevel = 'C-Suite' | 'Executive Vice President' | 'Senior Vice President' | 'Vice President' | 'Senior Director';
export type ProjectWorkModel = 'Remote' | 'Hybrid' | 'On-Site';

export type ProjectParameters = {
  // 1. Role & Leveling Baseline (feeds CMA Step-Up Delta & initial Master Graph search filters)
  primaryTitle: string;
  equivalentTitles: string[];
  roleLevel: ProjectRoleLevel;
  functionalDomain: string;
  domainKeywords: string[];

  // 2. Compensation & Financial Framework (feeds SFA Compensation Parity & salary benchmarks)
  targetBaseSalary: number;
  maxBaseBudget: number;
  variableOTE: string;
  equityGrantValue: string;
  maxTotalCompensationCeiling: number;

  // 3. Scope & Scale Requirements (feeds CMA Scale Expansion calculation)
  targetCompanyStage: string;
  requiredPandLScope: string;
  teamHeadcountScale: string;

  // 4. Location & Work Model (feeds CMA Geo/Lifestyle match & geographic heatmaps)
  workModel: ProjectWorkModel;
  hybridDaysPerWeek?: number;
  targetMetropolitanMarkets: string[];
  relocationWillingness: boolean;

  // 5. Timeline & Operational Constraints (feeds SFA Notice Period & Availability match)
  targetStartDate: string;
  maxNoticePeriodTolerance: string;
  confidentialityProtocol?: string;
};

export type ProjectAction = {
  action: string;
  timestamp: string;
  actor?: string;
  type?: 'slate_sent' | 'calibration' | 'intake' | 'offer' | 'interview' | 'market_map';
};

export type ProjectNextAction = {
  action: string;
  dueDate: string;
  urgency: 'high' | 'medium' | 'normal';
  suggestedActionType?: 'send_slate' | 'reminder' | 'calibrate' | 'interview' | 'view_candidates';
  actionLabel?: string;
};

export type Project = {
  id: string;
  title: string;
  company?: string;
  type: string;
  stage?: string;
  status: string;
  createdAt: string;
  leadRecruiter: string;
  description?: string;
  parameters?: ProjectParameters;
  candidatesCount?: number;
  lastAction?: ProjectAction;
  nextAction?: ProjectNextAction;
  /** Role (Roles & Succession) this project was created from, if any */
  sourceRoleId?: string;
  sourceRoleTitle?: string;
  /** Candidates carried over from the source role's succession bench */
  seedPipeline?: Array<Candidate & { projectStatus: string; dateAdded: string }>;
};

export type EmiSubWeights = {
  // CMA (Motivation Alignment) 40%
  cmaStepUpDelta: number; // 40% - Comparing current title to open req
  cmaScaleExpansion: number; // 30% - Comparing current P&L and Company Size to open req
  cmaProfileMatch: number; // 20% - Matching experience data to open req
  cmaGeoLifestyle: number; // 10% - Matching location, work model, relocation willingness to open req

  // PTM (Propensity to Move) 35%
  ptmOrgInstability: number; // 40% - Looking at company stock changes, news events, transformation
  ptmEquityVestingCliffs: number; // 30% - Distance to 36-mo & 48-mo marks (scores spike 60d prior)
  ptmBlockedNumberTwo: number; // 20% - VP with SVP start date < 2 years ago structurally blocked
  ptmTenureStagnation: number; // 10% - Scores scale linearly as tenure surpasses 48 months without title change

  // SFA (Structural Fit) 25%
  sfaCompensationParity: number; // 40% - If candidate estimated comp > req budget by >15%, SFA drops drastically
  sfaOperationalScope: number; // 35% - Keyword and entity overlap percentage
  sfaOffLimitsLegal: number; // 15% - Do Not Poach agreements, non-compete, garden leave (kill switch)
  sfaNoticePeriod: number; // 10% - Comparing notice period with req target start date
};

export type AuraAgentConfig = {
  status: 'active' | 'paused' | 'learning';
  emiWeights: {
    cma: number; // Candidate Motivation Alignment % (default 40)
    ptm: number; // Propensity to Move % (default 35)
    sfa: number; // Structural Fit Alignment % (default 25)
    subWeights: EmiSubWeights;
  };
  research: {
    syncCadence: 'realtime' | 'daily' | 'weekly';
    autoOrgChartMapping: boolean;
    orgChartDepthLevels: number; // e.g. 3 (C-Suite, VP, Director)
    autoEnrichment: boolean;
    minRoleTenureMonths: number;
    excludedTitleKeywords: string[];
    minEmiToPipeline: number;
    maxAutoAddPerMap: number;
  };
  nurturing: {
    warmingCampaignsActive: boolean;
    cadenceDays: number;
    touchpointCapQuarterly: number;
    cooldownDays: number;
    emiTiers: {
      high: { min: number; strategy: string };
      moderate: { min: number; strategy: string };
      low: { min: number; strategy: string };
    };
  };
  // Backwards compatibility convenience fields
  minEmiToPipeline?: number;
  minRoleTenureMonths?: number;
  autoEnrichment?: boolean;
  syncCadence?: 'realtime' | 'daily' | 'weekly';
  maxAutoAddPerMap?: number;
  excludedTitleKeywords?: string[];
};

export type SearchAgentConfig = AuraAgentConfig;

export type SearchVoiceArchetype = {
  id: string;
  title: string;
  description: string;
  isCustom?: boolean;
  toneFormality: number; // 1 to 5
  toneDirectness: number; // 1 to 5
  confidentialityProtocol: 'Strictly Confidential Blind Teaser' | 'Named Enterprise Search' | 'Board-Authorized Retained Mandate';
  targetWordCount: number;
  lengthPreset?: 'concise' | 'standard' | 'indepth';
  customInstructions: string;
  prohibitedPhrases: string[];
  signatureFormat: string;
};

export type PrimeAgentConfig = {
  status: 'active' | 'paused' | 'standby';
  selectedArchetypeId: string;
  archetypes: SearchVoiceArchetype[];
  // High-Level Search Project Voice & Rules (not tied to any specific candidate)
  projectVoice: {
    archetype: string;
    toneFormality: number; // 1 to 5
    toneDirectness: number; // 1 to 5
    confidentialityProtocol: 'Strictly Confidential Blind Teaser' | 'Named Enterprise Search' | 'Board-Authorized Retained Mandate';
    targetWordCount: number;
    customInstructions: string;
    prohibitedPhrases: string[];
    signatureFormat: string;
  };
  projectRules: {
    minCalibrationScore: number; // e.g. 78%
    autoAddToProjectLonglist: boolean;
    requirePartnerSignOffForCSuite: boolean;
    targetDaysToFirstSlate: number; // SLA benchmark e.g. 14 days
    maxOutreachSequences: number; // max contact attempts per project (e.g. 3)
    cooldownDaysBetweenSequences: number; // e.g. 21 days
    enforceRestrictedCompanies: boolean; // Do Not Poach / Off-Limits list
    enforceGardenLeaveProtection: boolean;
  };
  // Backwards compatibility legacy fields
  useEmiScores?: boolean;
  emiDecisionDegree?: number;
  triggerOnEmiJump?: boolean;
  emiJumpThreshold?: number;
  emiTiers?: {
    high: { min: number; strategy: string };
    moderate: { min: number; strategy: string };
    low: { min: number; strategy: string };
  };
  brandVoice?: {
    archetype: 'Discreet Trusted Advisor' | 'C-Suite Peer Partner' | 'Formal Executive Search Partner' | 'Visionary Industry Insider';
    toneFormality: number;
    toneDirectness: number;
    customInstructions: string;
    prohibitedPhrases: string[];
  };
  messaging?: {
    lengthPreset: 'concise' | 'standard' | 'indepth';
    targetWordCount: number;
    channels: ('email' | 'inmail' | 'assistant')[];
    signatureFormat: string;
    includeMarketIntelSnippet: boolean;
  };
  guardrails?: {
    maxTouchpointsPerQuarter: number;
    cooldownDays: number;
    maxNonResponseAttempts: number;
    nonResponsePauseDays: number;
    requireHumanSignOffForCSuite: boolean;
    highCompSignOffThreshold: string;
    enforceRestrictedCompanies: boolean;
  };
};

export type AgentTelemetryItem = {
  id: string;
  timestamp: string;
  agentId: 'aura' | 'prime' | 'search';
  type: 'discovery' | 'scoring' | 'draft' | 'guardrail_block' | 'outreach' | 'config_change' | 'org_chart' | 'nurture';
  title: string;
  details: string;
  targetCandidate?: string;
  targetCompany?: string;
  severity?: 'normal' | 'warning' | 'success' | 'blocked';
};

export type FeedbackGiver = {
  id: string;
  name: string;
  title: string;
  department: string;
  avatarUrl?: string;
  email?: string;
};

export type CompetencyRating = {
  competency: string;
  score: number; // 1 to 10
  benchmark?: string;
  notes?: string;
};

export type InterviewFeedback = {
  id: string;
  candidateId: string;
  giver: FeedbackGiver;
  stage: string;
  date: string;
  rating: number; // 1 to 10
  recommendation: 'strong_hire' | 'hire' | 'neutral' | 'do_not_hire';
  quickTags: string[];
  competencyRatings: CompetencyRating[];
  strengths: string[];
  risksOrConcerns: string[];
  summaryNotes: string;
  transcriptHighlights?: string[];
};

