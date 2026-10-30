export interface LiveSignalAlert {
  type: 'sec_filing' | 'news_event' | 'board_change' | 'restructuring' | 'earnings_call';
  text: string;
  source: string; // e.g. 'SEC Edgar Form 4', 'Bloomberg News', 'Event Registry', 'SEC 8-K'
  date: string;
  severity: 'urgent' | 'elevated' | 'standard';
  filingUrl?: string;
  details?: string;
}

export interface ShadowBenchCandidate {
  id: string;
  name: string;
  currentTitle: string;
  company: string;
  avatarUrl: string;
  location: string;
  tenureInRole: string;
  currentCompEst: string;
  
  // AI Scores
  emiScore: number; // 0-100 Composite Executive Match Index
  sfaScore: number; // 0-100 Structural Fit Analysis
  cmaScore: number; // 0-100 Candidate Motivation Alignment
  ptmScore: number; // 0-100 Propensity to Move
  ptmLevel: 'High' | 'Medium' | 'Low';
  
  // Real-time market signal alert
  liveSignalAlert: LiveSignalAlert;
  
  // Status & AI Insights
  stage: 'Identified' | 'Calibrated' | 'Warm Outreach' | 'Ready to Engage';
  benchReadiness: 'Ready Now (0-30d)' | 'Ready in 3-6mo' | 'Evergreen Watchlist';
  sfaReason: string;
  cmaReason: string;
  ptmReason: string;
  linkedInUrl?: string;
  notesCount: number;
}

export interface MathematicalAnchors {
  targetRevenueScale: string; // e.g. "$500M - $1.5B ARR"
  targetHeadcountScope: string; // e.g. "250 - 600 Engineers"
  priorityLevel: 'P0 - Critical' | 'P1 - High' | 'P2 - Medium' | 'P3 - Strategic';
  sfaWeight: number; // e.g. 35
  cmaWeight: number; // e.g. 35
  ptmWeight: number; // e.g. 30
  orgComplexityScore: number; // 1-10
  geographicFlexibility: 'Local Required' | 'Hybrid (2-3 days)' | 'Remote Flexible';
}

export interface RoleSuccessionItem {
  id: string;
  roleTitle: string;
  type: 'active_requisition' | 'succession_bench';
  department: 'Engineering & AI' | 'Product & Growth' | 'Executive Leadership' | 'Security & Infrastructure' | 'Finance & Corporate';
  level: 'C-Suite' | 'SVP' | 'VP' | 'Head of';
  priorityLevel: 'P0 - Critical' | 'P1 - High' | 'P2 - Medium' | 'P3 - Strategic';
  status: 'Active Sourcing' | 'Interviewing' | 'Calibrating Slate' | 'Bench Monitoring' | 'Risk Mitigation';
  hiringManager: string;
  hiringManagerTitle: string;
  hiringManagerAvatar: string;
  targetDate: string;
  daysOpenOrMonitored: number;
  
  // Mathematical Anchors
  anchors: MathematicalAnchors;
  
  // Aggregated Bench Metrics
  totalCandidatesTracked: number;
  highFlightRiskCount: number;
  avgEmiMatch: number;
  benchReadinessRate: number; // percentage
  
  // Roster of tracked executives
  candidates: ShadowBenchCandidate[];
  
  description: string;
  riskSummary: string;
}

export const initialRolesSuccessionData: RoleSuccessionItem[] = [
  // ==========================================
  // ACTIVE REQUISITIONS (Immediate Hiring Needs)
  // ==========================================
  {
    id: 'role-req-1',
    roleTitle: 'VP of Artificial Intelligence',
    type: 'active_requisition',
    department: 'Engineering & AI',
    level: 'VP',
    priorityLevel: 'P0 - Critical',
    status: 'Calibrating Slate',
    hiringManager: 'Satya Nadella',
    hiringManagerTitle: 'Chief Executive Officer',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
    targetDate: 'Nov 30, 2026',
    daysOpenOrMonitored: 28,
    anchors: {
      targetRevenueScale: '$1B+ Enterprise AI',
      targetHeadcountScope: '300 - 800 Research & Systems Engineers',
      priorityLevel: 'P0 - Critical',
      sfaWeight: 40,
      cmaWeight: 35,
      ptmWeight: 25,
      orgComplexityScore: 9,
      geographicFlexibility: 'Hybrid (2-3 days)'
    },
    totalCandidatesTracked: 18,
    highFlightRiskCount: 6,
    avgEmiMatch: 92,
    benchReadinessRate: 88,
    description: 'Lead foundation model engineering, distributed GPU compute clusters, and generative AI platform architecture across core products.',
    riskSummary: 'Critical P0 requisition: Need candidate with proven experience deploying multi-million dollar compute budgets under rapid release cadence.',
    candidates: [
      {
        id: 'cand-ai-1',
        name: 'Elena Rostova',
        currentTitle: 'VP of AI Research & Platforms',
        company: 'Meta',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
        location: 'Menlo Park, CA (Open to Seattle)',
        tenureInRole: '3 yrs 4 mos',
        currentCompEst: '$1.45M TC ($650k Base + RSUs)',
        emiScore: 96,
        sfaScore: 97,
        cmaScore: 95,
        ptmScore: 94,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'sec_filing',
          text: '⚠️ SEC Form 4: $2.1M final 4-year grant cliff vesting in 28 days',
          source: 'SEC Edgar Form 4',
          date: 'Yesterday at 4:15 PM',
          severity: 'urgent',
          details: 'Final tranche of 2022 performance RSU tranche vesting Oct 31. Low refresh multiple reported in proxy filing.'
        },
        stage: 'Calibrated',
        benchReadiness: 'Ready Now (0-30d)',
        sfaReason: 'Oversees 420+ research engineers on LLaMA infrastructure; 100% headcount & compute scope match.',
        cmaReason: 'Expressed motivation to take full P&L ownership of applied enterprise AI rather than pure research lab.',
        ptmReason: 'Equity cliff coupled with restructuring rumors in generative compute group.',
        notesCount: 4
      },
      {
        id: 'cand-ai-2',
        name: 'Dr. Marcus Vance',
        currentTitle: 'Head of Foundation Models & Distributed Systems',
        company: 'Anthropic',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
        location: 'San Francisco, CA',
        tenureInRole: '2 yrs 1 mo',
        currentCompEst: '$1.25M TC',
        emiScore: 93,
        sfaScore: 92,
        cmaScore: 94,
        ptmScore: 88,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'news_event',
          text: '📰 Event Registry: Structural reorg announced in core training alignment group',
          source: 'Event Registry Intelligence',
          date: '2 days ago',
          severity: 'elevated',
          details: 'Internal reporting structure shift after latest commercial enterprise partnerships.'
        },
        stage: 'Warm Outreach',
        benchReadiness: 'Ready Now (0-30d)',
        sfaReason: 'Managed high-throughput distributed model training across 30,000+ clusters.',
        cmaReason: 'Seeking enterprise platform scale and governance exposure beyond venture-backed lab.',
        ptmReason: 'Reporting line change to new VP of Engineering limits autonomy.',
        notesCount: 6
      },
      {
        id: 'cand-ai-3',
        name: 'Sofia Rodriguez',
        currentTitle: 'VP of Data Intelligence & ML Systems',
        company: 'Databricks',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
        location: 'San Francisco, CA',
        tenureInRole: '3 yrs 8 mos',
        currentCompEst: '$1.35M TC',
        emiScore: 91,
        sfaScore: 93,
        cmaScore: 89,
        ptmScore: 91,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'restructuring',
          text: '📰 Bloomberg: Tabular & MosaicML acquisition integration creating overlapping exec tier',
          source: 'Bloomberg Tech',
          date: '3 days ago',
          severity: 'urgent',
          details: 'Overlapping engineering leadership ranks post-merger; 92% executive mobility indicator.'
        },
        stage: 'Ready to Engage',
        benchReadiness: 'Ready Now (0-30d)',
        sfaReason: 'Pioneered lakehouse ML training runtime with $120M annual cloud infrastructure budget.',
        cmaReason: 'Ready for primary C-suite successor track; constrained by overlapping internal SVPs.',
        ptmReason: 'Merger integration friction and executive redundancy.',
        notesCount: 3
      },
      {
        id: 'cand-ai-4',
        name: 'Arjun Mehta',
        currentTitle: 'Senior Director of Applied Deep Learning',
        company: 'Google DeepMind',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
        location: 'Mountain View, CA',
        tenureInRole: '4 yrs 2 mos',
        currentCompEst: '$1.1M TC',
        emiScore: 87,
        sfaScore: 89,
        cmaScore: 86,
        ptmScore: 68,
        ptmLevel: 'Medium',
        liveSignalAlert: {
          type: 'sec_filing',
          text: '⚠️ SEC Form 144: Planned sale of 8,500 shares filed under Rule 10b5-1',
          source: 'SEC Edgar Form 144',
          date: '5 days ago',
          severity: 'standard',
          details: 'Quarterly liquidity event completed; indicates ongoing planned financial diversification.'
        },
        stage: 'Calibrated',
        benchReadiness: 'Ready in 3-6mo',
        sfaReason: 'Deep scientific acumen in multimodal representations and reasoning engines.',
        cmaReason: 'High compensation retention hooks; open to conversation if given C-suite reporting line.',
        ptmReason: 'Tenure stagnation in research track without direct P&L accountability.',
        notesCount: 2
      },
      {
        id: 'cand-ai-5',
        name: 'Claire Chen',
        currentTitle: 'VP of Machine Learning Engineering',
        company: 'Snowflake',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80',
        location: 'Bellevue, WA',
        tenureInRole: '1 yr 9 mos',
        currentCompEst: '$1.2M TC',
        emiScore: 85,
        sfaScore: 88,
        cmaScore: 82,
        ptmScore: 52,
        ptmLevel: 'Low',
        liveSignalAlert: {
          type: 'earnings_call',
          text: '📰 10-Q filing: R&D expansion highlighted in annual shareholder conference',
          source: 'SEC 10-Q Filing',
          date: '1 week ago',
          severity: 'standard',
          details: 'Snowflake expanding Seattle AI hub; candidate recently granted 2-year retention bonus.'
        },
        stage: 'Identified',
        benchReadiness: 'Evergreen Watchlist',
        sfaReason: 'Excellent enterprise data warehouse integration experience.',
        cmaReason: 'Recently promoted; high switching barrier in next 6 months.',
        ptmReason: 'Retention refresh keeps flight risk low in short term.',
        notesCount: 1
      }
    ]
  },
  {
    id: 'role-req-2',
    roleTitle: 'Chief Information Security Officer (CISO)',
    type: 'active_requisition',
    department: 'Security & Infrastructure',
    level: 'C-Suite',
    priorityLevel: 'P0 - Critical',
    status: 'Interviewing',
    hiringManager: 'Amy Hood',
    hiringManagerTitle: 'Chief Financial Officer & EVP',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
    targetDate: 'Dec 15, 2026',
    daysOpenOrMonitored: 42,
    anchors: {
      targetRevenueScale: '$2B+ Global Enterprise',
      targetHeadcountScope: '120 - 300 SecOps & Governance Engineers',
      priorityLevel: 'P0 - Critical',
      sfaWeight: 45,
      cmaWeight: 30,
      ptmWeight: 25,
      orgComplexityScore: 10,
      geographicFlexibility: 'Local Required'
    },
    totalCandidatesTracked: 14,
    highFlightRiskCount: 5,
    avgEmiMatch: 89,
    benchReadinessRate: 79,
    description: 'Direct global cyber defense, zero-trust architecture, FedRAMP High compliance, and Board audit committee reporting.',
    riskSummary: 'High compliance exposure: Current interim CISO departing end of Q4; SEC disclosure timelines require experienced public company leader.',
    candidates: [
      {
        id: 'cand-sec-1',
        name: 'David Sterling',
        currentTitle: 'Global CISO & Head of Trust',
        company: 'CrowdStrike',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80',
        location: 'Austin, TX (Willing to relocate)',
        tenureInRole: '4 yrs 6 mos',
        currentCompEst: '$1.6M TC',
        emiScore: 95,
        sfaScore: 96,
        cmaScore: 94,
        ptmScore: 92,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'sec_filing',
          text: '⚠️ SEC Form 4: $3.4M cumulative vesting event reached; unvested balance at 4-year low',
          source: 'SEC Edgar Form 4',
          date: 'Yesterday',
          severity: 'urgent',
          details: 'Significant equity rollover complete. No new long-term performance grant filed in DEF 14A.'
        },
        stage: 'Calibrated',
        benchReadiness: 'Ready Now (0-30d)',
        sfaReason: 'Managed global cyber ops through enterprise incident response; Board audit committee liaison.',
        cmaReason: 'Seeking enterprise platform security role outside pure-play security vendor space.',
        ptmReason: 'Equity overhang ended; executive open to final career transformation before retirement.',
        notesCount: 5
      },
      {
        id: 'cand-sec-2',
        name: 'Kavita Patel',
        currentTitle: 'VP of Information Security & Cyber Defense',
        company: 'Palo Alto Networks',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
        location: 'Santa Clara, CA',
        tenureInRole: '3 yrs 1 mo',
        currentCompEst: '$1.3M TC',
        emiScore: 92,
        sfaScore: 94,
        cmaScore: 90,
        ptmScore: 86,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'news_event',
          text: '📰 Event Registry: Executive reorganization in Cloud Security Group',
          source: 'Event Registry Intelligence',
          date: '4 days ago',
          severity: 'elevated',
          details: 'Platform consolidation announced by CEO Nikesh Arora; changes in divisional reporting lines.'
        },
        stage: 'Warm Outreach',
        benchReadiness: 'Ready Now (0-30d)',
        sfaReason: 'FedRAMP High & Zero-Trust implementation across multi-cloud environments.',
        cmaReason: 'Ready for full CISO seat with Board reporting autonomy.',
        ptmReason: 'Internal reporting restructuring and blocked path to primary CISO title.',
        notesCount: 4
      }
    ]
  },
  {
    id: 'role-req-3',
    roleTitle: 'VP of Product, Developer Platform',
    type: 'active_requisition',
    department: 'Product & Growth',
    level: 'VP',
    priorityLevel: 'P1 - High',
    status: 'Active Sourcing',
    hiringManager: 'Scott Guthrie',
    hiringManagerTitle: 'EVP Cloud & AI Group',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
    targetDate: 'Jan 15, 2027',
    daysOpenOrMonitored: 19,
    anchors: {
      targetRevenueScale: '$500M - $1B ARR',
      targetHeadcountScope: '60 - 150 PMs & Developer Advocates',
      priorityLevel: 'P1 - High',
      sfaWeight: 35,
      cmaWeight: 40,
      ptmWeight: 25,
      orgComplexityScore: 8,
      geographicFlexibility: 'Remote Flexible'
    },
    totalCandidatesTracked: 16,
    highFlightRiskCount: 4,
    avgEmiMatch: 88,
    benchReadinessRate: 75,
    description: 'Drive API ecosystem, developer onboarding, CLI tooling, and SDK monetization across global developer ecosystem.',
    riskSummary: 'Direct impact on API consumption metrics: Mandate requires strong bottoms-up product-led growth (PLG) track record.',
    candidates: [
      {
        id: 'cand-prod-1',
        name: 'Jordan Rivera',
        currentTitle: 'VP of Product, Developer Experience',
        company: 'Stripe',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        location: 'Seattle, WA',
        tenureInRole: '3 yrs 2 mos',
        currentCompEst: '$1.15M TC',
        emiScore: 94,
        sfaScore: 95,
        cmaScore: 93,
        ptmScore: 87,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'sec_filing',
          text: '⚠️ Tender Offer Notice: Stripe private secondary share repurchase window closing',
          source: 'Market Liquidity Filing',
          date: '3 days ago',
          severity: 'urgent',
          details: 'Secondary tender finalized allowing substantial vested equity monetization without IPO wait.'
        },
        stage: 'Calibrated',
        benchReadiness: 'Ready Now (0-30d)',
        sfaReason: 'Architected world-class developer documentation, API versioning, and SDK ecosystem.',
        cmaReason: 'Seeking enterprise developer platform scope and cloud integration leadership.',
        ptmReason: 'Monetized substantial secondary equity; IPO timing delays encouraging external exploration.',
        notesCount: 3
      }
    ]
  },
  {
    id: 'role-req-4',
    roleTitle: 'VP of Global Enterprise Sales',
    type: 'active_requisition',
    department: 'Executive Leadership',
    level: 'VP',
    priorityLevel: 'P1 - High',
    status: 'Active Sourcing',
    hiringManager: 'Judson Althoff',
    hiringManagerTitle: 'Chief Commercial Officer',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
    targetDate: 'Feb 1, 2027',
    daysOpenOrMonitored: 14,
    anchors: {
      targetRevenueScale: '$300M - $800M Quota Territory',
      targetHeadcountScope: '80 - 200 Enterprise AEs & SEs',
      priorityLevel: 'P1 - High',
      sfaWeight: 40,
      cmaWeight: 30,
      ptmWeight: 30,
      orgComplexityScore: 8,
      geographicFlexibility: 'Hybrid (2-3 days)'
    },
    totalCandidatesTracked: 22,
    highFlightRiskCount: 7,
    avgEmiMatch: 86,
    benchReadinessRate: 70,
    description: 'Scale Fortune 500 enterprise quota carrying team, channel partnerships, and multi-million dollar annual contract values.',
    riskSummary: 'Revenue delivery requirement for FY27: Candidate must possess immediate C-suite Rolodex across financial services & healthcare.',
    candidates: [
      {
        id: 'cand-sales-1',
        name: 'Rachel Zimmerman',
        currentTitle: 'SVP of Enterprise Sales - North America',
        company: 'ServiceNow',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
        location: 'New York, NY',
        tenureInRole: '4 yrs 1 mo',
        currentCompEst: '$1.8M OTE',
        emiScore: 92,
        sfaScore: 94,
        cmaScore: 90,
        ptmScore: 89,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'sec_filing',
          text: '⚠️ SEC Form 4: $1.9M performance shares vested; 100% target quota milestone achieved',
          source: 'SEC Edgar Form 4',
          date: 'Yesterday',
          severity: 'urgent',
          details: 'Closed FY multi-year accelerator plan; quota reset in next fiscal cycle driving exploration.'
        },
        stage: 'Calibrated',
        benchReadiness: 'Ready Now (0-30d)',
        sfaReason: 'Managed $650M recurring ACV portfolio with 120+ enterprise reps.',
        cmaReason: 'Desires Chief Revenue Officer promotion track not currently open internally.',
        ptmReason: 'Annual quota reset creates optimal recruiting inflection window.',
        notesCount: 4
      }
    ]
  },

  // ==========================================
  // SUCCESSION BENCHES (Evergreen Talent Pools for Risk Mitigation)
  // ==========================================
  {
    id: 'role-bench-1',
    roleTitle: 'Chief Technology Officer (CTO) Bench',
    type: 'succession_bench',
    department: 'Engineering & AI',
    level: 'C-Suite',
    priorityLevel: 'P0 - Critical',
    status: 'Bench Monitoring',
    hiringManager: 'Board Governance Committee',
    hiringManagerTitle: 'Board of Directors Lead',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
    targetDate: 'Evergreen (6-12 mo trigger)',
    daysOpenOrMonitored: 180,
    anchors: {
      targetRevenueScale: '$5B+ Public Tech Enterprise',
      targetHeadcountScope: '2,000 - 8,000 Global Engineering Org',
      priorityLevel: 'P0 - Critical',
      sfaWeight: 45,
      cmaWeight: 30,
      ptmWeight: 25,
      orgComplexityScore: 10,
      geographicFlexibility: 'Local Required'
    },
    totalCandidatesTracked: 12,
    highFlightRiskCount: 4,
    avgEmiMatch: 94,
    benchReadinessRate: 92,
    description: 'Succession bench for incumbent CTO. Active shadow calibration of tier-1 technology executives capable of driving next-decade infrastructure.',
    riskSummary: 'Succession risk mitigation: Incumbent CTO indicated planned transition within 12-18 months. Need 3 battle-tested successors ready to step in immediately.',
    candidates: [
      {
        id: 'cand-cto-1',
        name: 'Alexander Wright',
        currentTitle: 'Chief Technology Officer',
        company: 'Cloudflare',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
        location: 'San Francisco, CA',
        tenureInRole: '5 yrs 4 mos',
        currentCompEst: '$2.8M TC',
        emiScore: 97,
        sfaScore: 98,
        cmaScore: 96,
        ptmScore: 91,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'sec_filing',
          text: '⚠️ SEC Form 4: $6.2M unvested equity cliff expiring in 45 days',
          source: 'SEC Edgar Form 4',
          date: 'Yesterday at 5:00 PM',
          severity: 'urgent',
          details: 'Final milestone grant executed; historical vesting schedule concludes Q4.'
        },
        stage: 'Calibrated',
        benchReadiness: 'Ready Now (0-30d)',
        sfaReason: 'Runs planet-scale edge network, DDoS mitigation, and worker platform across 330 cities.',
        cmaReason: 'Looking for generational enterprise AI challenge at 10x market cap scale.',
        ptmReason: 'Equity vesting completion and desire for top-tier enterprise platform governance.',
        notesCount: 7
      },
      {
        id: 'cand-cto-2',
        name: 'Dr. Evelyn Morales',
        currentTitle: 'VP & Technical Fellow, Systems Architecture',
        company: 'Amazon Web Services (AWS)',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
        location: 'Seattle, WA',
        tenureInRole: '6 yrs 2 mos',
        currentCompEst: '$2.2M TC',
        emiScore: 95,
        sfaScore: 96,
        cmaScore: 94,
        ptmScore: 89,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'news_event',
          text: '📰 Event Registry: AWS senior leadership reorganization following new CEO appointment',
          source: 'Event Registry Intelligence',
          date: '3 days ago',
          severity: 'elevated',
          details: 'Matt Garman leadership restructuring announced across compute and core virtualization services.'
        },
        stage: 'Warm Outreach',
        benchReadiness: 'Ready Now (0-30d)',
        sfaReason: 'Designed hyper-scale cloud virtualization layers, EC2 architectures, and custom silicon.',
        cmaReason: 'Ready to transition from technical fellow into primary public company CTO chair.',
        ptmReason: 'Executive reshuffle has unblocked mobility for top AWS fellows.',
        notesCount: 6
      },
      {
        id: 'cand-cto-3',
        name: 'Julian Thorne',
        currentTitle: 'SVP of Core Engineering & Infrastructure',
        company: 'Uber',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
        location: 'San Francisco, CA',
        tenureInRole: '3 yrs 9 mos',
        currentCompEst: '$1.9M TC',
        emiScore: 91,
        sfaScore: 93,
        cmaScore: 89,
        ptmScore: 78,
        ptmLevel: 'Medium',
        liveSignalAlert: {
          type: 'board_change',
          text: '⚠️ SEC 8-K: Corporate governance charter update & Board tech committee rotation',
          source: 'SEC Edgar 8-K',
          date: '1 week ago',
          severity: 'standard',
          details: 'New board oversight committee formed around autonomous fleets and infra capex.'
        },
        stage: 'Identified',
        benchReadiness: 'Ready in 3-6mo',
        sfaReason: 'Massive real-time marketplace routing, geospatial data platforms, and high-concurrency microservices.',
        cmaReason: 'High compensation retention; motivated by primary board-facing executive leadership.',
        ptmReason: 'Satisfied currently but will engage if presented with immediate CTO succession slot.',
        notesCount: 3
      }
    ]
  },
  {
    id: 'role-bench-2',
    roleTitle: 'Chief Product Officer (CPO) Bench',
    type: 'succession_bench',
    department: 'Product & Growth',
    level: 'C-Suite',
    priorityLevel: 'P0 - Critical',
    status: 'Risk Mitigation',
    hiringManager: 'CEO & Compensation Committee',
    hiringManagerTitle: 'Executive Leadership Team',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
    targetDate: 'Evergreen (Mitigation active)',
    daysOpenOrMonitored: 120,
    anchors: {
      targetRevenueScale: '$2B - $10B Enterprise Software',
      targetHeadcountScope: '400 - 1,200 Product, Design & Research Org',
      priorityLevel: 'P0 - Critical',
      sfaWeight: 40,
      cmaWeight: 35,
      ptmWeight: 25,
      orgComplexityScore: 9,
      geographicFlexibility: 'Hybrid (2-3 days)'
    },
    totalCandidatesTracked: 15,
    highFlightRiskCount: 5,
    avgEmiMatch: 91,
    benchReadinessRate: 85,
    description: 'Succession bench for CPO position. Monitoring tier-1 product executives combining consumer-grade UX with deep enterprise AI workflows.',
    riskSummary: 'Flight risk tracking: Incumbent CPO approached by external private equity portfolio; maintaining warm calibrated shadow bench prevents disruption.',
    candidates: [
      {
        id: 'cand-cpo-1',
        name: 'Maya Lin-Hastings',
        currentTitle: 'Chief Product Officer',
        company: 'Figma',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
        location: 'San Francisco, CA',
        tenureInRole: '4 yrs 3 mos',
        currentCompEst: '$2.1M TC',
        emiScore: 96,
        sfaScore: 97,
        cmaScore: 95,
        ptmScore: 93,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'sec_filing',
          text: '⚠️ S-1 Filing Preparation: IPO lockup timeline & vesting schedule filed',
          source: 'SEC S-1 / Market Intelligence',
          date: '2 days ago',
          severity: 'urgent',
          details: 'Pre-IPO liquidity restructuring completed; strategic window opening prior to public debut lockup.'
        },
        stage: 'Calibrated',
        benchReadiness: 'Ready Now (0-30d)',
        sfaReason: 'Multiplayer collaboration, design systems leadership, $700M+ ARR scaling.',
        cmaReason: 'Ready for enterprise platform scale with massive installed base.',
        ptmReason: 'Post-Adobe merger termination reset career ambitions toward public enterprise suite.',
        notesCount: 6
      },
      {
        id: 'cand-cpo-2',
        name: 'Benjamin Cole',
        currentTitle: 'VP of Product Management, Cloud Applications',
        company: 'Oracle',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80',
        location: 'Austin, TX',
        tenureInRole: '5 yrs 1 mo',
        currentCompEst: '$1.7M TC',
        emiScore: 90,
        sfaScore: 92,
        cmaScore: 88,
        ptmScore: 85,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'restructuring',
          text: '📰 Bloomberg: Oracle shifts engineering resource allocation toward AI infrastructure',
          source: 'Bloomberg Tech',
          date: '5 days ago',
          severity: 'elevated',
          details: 'Application PM headcount frozen to fund GPU supercluster expansion.'
        },
        stage: 'Warm Outreach',
        benchReadiness: 'Ready in 3-6mo',
        sfaReason: 'Massive ERP and HCM SaaS product suites across 40,000+ enterprise customers.',
        cmaReason: 'Frustrated by prioritization pivots away from application user experience.',
        ptmReason: 'Headcount restrictions and reallocation of R&D budgets.',
        notesCount: 4
      }
    ]
  },
  {
    id: 'role-bench-3',
    roleTitle: 'Chief Financial Officer (CFO) Bench',
    type: 'succession_bench',
    department: 'Finance & Corporate',
    level: 'C-Suite',
    priorityLevel: 'P1 - High',
    status: 'Bench Monitoring',
    hiringManager: 'Board Audit Committee',
    hiringManagerTitle: 'Audit Committee Chair',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80',
    targetDate: 'Evergreen (Succession roadmap)',
    daysOpenOrMonitored: 90,
    anchors: {
      targetRevenueScale: '$3B - $15B Public Revenue',
      targetHeadcountScope: '150 - 400 Corporate Finance & IR Team',
      priorityLevel: 'P1 - High',
      sfaWeight: 50,
      cmaWeight: 25,
      ptmWeight: 25,
      orgComplexityScore: 9,
      geographicFlexibility: 'Local Required'
    },
    totalCandidatesTracked: 11,
    highFlightRiskCount: 3,
    avgEmiMatch: 92,
    benchReadinessRate: 90,
    description: 'Succession bench for public company CFO. Monitoring battle-tested finance leaders with deep Wall Street investor relations and M&A experience.',
    riskSummary: 'Long-term planned succession: Current CFO planning retirement at conclusion of fiscal year 2027.',
    candidates: [
      {
        id: 'cand-cfo-1',
        name: 'Victoria Vance',
        currentTitle: 'SVP of Corporate Finance & Investor Relations',
        company: 'Autodesk',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80',
        location: 'San Francisco, CA',
        tenureInRole: '4 yrs 8 mos',
        currentCompEst: '$1.9M TC',
        emiScore: 95,
        sfaScore: 97,
        cmaScore: 93,
        ptmScore: 90,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'sec_filing',
          text: '⚠️ SEC Form 4: $1.8M 4-year grant fully realized; proxy indicates blocked #2 succession',
          source: 'SEC Edgar DEF 14A',
          date: '3 days ago',
          severity: 'urgent',
          details: 'Incumbent CFO extended contract for 3 additional years, blocking upward advancement.'
        },
        stage: 'Calibrated',
        benchReadiness: 'Ready Now (0-30d)',
        sfaReason: 'Managed Wall Street earnings calls, $4B+ debt refinancing, and 12 acquisitions.',
        cmaReason: 'Blocked #2 succession candidate with immediate desire for primary CFO chair.',
        ptmReason: 'Vesting cliff and extended incumbent tenure create zero internal promotion path.',
        notesCount: 5
      }
    ]
  },
  {
    id: 'role-bench-4',
    roleTitle: 'VP of Infrastructure Engineering Bench',
    type: 'succession_bench',
    department: 'Security & Infrastructure',
    level: 'VP',
    priorityLevel: 'P1 - High',
    status: 'Bench Monitoring',
    hiringManager: 'CTO & Head of Engineering',
    hiringManagerTitle: 'Executive Staff',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
    targetDate: 'Evergreen (High retention risk)',
    daysOpenOrMonitored: 75,
    anchors: {
      targetRevenueScale: '$1B+ Cloud Operations',
      targetHeadcountScope: '200 - 500 SRE, Kubernetes & Hardware Ops',
      priorityLevel: 'P1 - High',
      sfaWeight: 40,
      cmaWeight: 30,
      ptmWeight: 30,
      orgComplexityScore: 9,
      geographicFlexibility: 'Hybrid (2-3 days)'
    },
    totalCandidatesTracked: 13,
    highFlightRiskCount: 4,
    avgEmiMatch: 89,
    benchReadinessRate: 82,
    description: 'Succession bench for core site reliability, global data center presence, zero-downtime upgrades, and cost-of-compute optimization.',
    riskSummary: 'Critical continuity pillar: Cloud spend optimization and GPU cluster availability require pre-qualified replacements.',
    candidates: [
      {
        id: 'cand-infra-1',
        name: 'Nathaniel Drake',
        currentTitle: 'VP of Core Infrastructure & Cloud Fleet',
        company: 'Stripe',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
        location: 'Seattle, WA',
        tenureInRole: '3 yrs 6 mos',
        currentCompEst: '$1.4M TC',
        emiScore: 94,
        sfaScore: 95,
        cmaScore: 93,
        ptmScore: 88,
        ptmLevel: 'High',
        liveSignalAlert: {
          type: 'sec_filing',
          text: '⚠️ SEC Form 4: Vesting cliff in 30 days ($850k value)',
          source: 'SEC Edgar Form 4',
          date: 'Yesterday',
          severity: 'urgent',
          details: 'Significant vesting cliff milestone on upcoming monthly anniversary.'
        },
        stage: 'Calibrated',
        benchReadiness: 'Ready Now (0-30d)',
        sfaReason: 'Managed five-nines financial infrastructure reliability for millions of transactions.',
        cmaReason: 'Excited by AI hyper-compute infrastructure scaling challenges.',
        ptmReason: 'Equity grant cliff and market appetite for infrastructure leaders.',
        notesCount: 4
      }
    ]
  }
];

function recommendedCandidate(
  partial: Pick<ShadowBenchCandidate, 'id' | 'name' | 'currentTitle' | 'company' | 'location' | 'emiScore' | 'sfaScore' | 'cmaScore' | 'ptmScore' | 'ptmLevel' | 'liveSignalAlert' | 'sfaReason' | 'cmaReason' | 'ptmReason'> &
    Partial<ShadowBenchCandidate>
): ShadowBenchCandidate {
  return {
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80',
    tenureInRole: '4 yrs 1 mo',
    currentCompEst: '$1.3M TC',
    stage: 'Identified',
    benchReadiness: partial.ptmLevel === 'High' ? 'Ready Now (0-30d)' : 'Ready in 3-6mo',
    notesCount: 0,
    ...partial,
  };
}

/** Agent-suggested successors who are not yet on the bench. */
const successionRecommendationsByRole: Record<string, ShadowBenchCandidate[]> = {
  'role-req-1': [
    recommendedCandidate({
      id: 'rec-ai-1',
      name: 'Lena Okonkwo',
      currentTitle: 'VP of Applied AI',
      company: 'OpenAI',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80',
      location: 'San Francisco, CA',
      emiScore: 94,
      sfaScore: 93,
      cmaScore: 96,
      ptmScore: 90,
      ptmLevel: 'High',
      liveSignalAlert: {
        type: 'news_event',
        text: 'Product org split announced; applied-AI leadership seat is newly open to external moves',
        source: 'Event Registry Intelligence',
        date: 'Yesterday',
        severity: 'urgent',
      },
      sfaReason: 'Runs applied model deployment at a scale that matches the VP of AI anchor.',
      cmaReason: 'Public comments point to wanting an enterprise P&L, not a research lab.',
      ptmReason: 'Org split and a finished vesting year make a move to this role likely.',
    }),
    recommendedCandidate({
      id: 'rec-ai-2',
      name: 'Tomas Berg',
      currentTitle: 'Head of AI Platform',
      company: 'NVIDIA',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80',
      location: 'Santa Clara, CA (Open to Seattle)',
      emiScore: 91,
      sfaScore: 92,
      cmaScore: 88,
      ptmScore: 86,
      ptmLevel: 'High',
      liveSignalAlert: {
        type: 'sec_filing',
        text: 'SEC Form 4: final 48-month grant cliff vests in 40 days',
        source: 'SEC Edgar Form 4',
        date: '2 days ago',
        severity: 'elevated',
      },
      sfaReason: 'Platform scope covers GPU clusters and inference systems at the target headcount.',
      cmaReason: 'Blocked behind a recently hired SVP, so the next step is external.',
      ptmReason: 'Vesting cliff plus a blocked #2 seat.',
    }),
    recommendedCandidate({
      id: 'rec-ai-3',
      name: 'Helen Cho',
      currentTitle: 'Senior Director, Model Infrastructure',
      company: 'Google',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
      location: 'Mountain View, CA',
      emiScore: 88,
      sfaScore: 90,
      cmaScore: 86,
      ptmScore: 71,
      ptmLevel: 'Medium',
      liveSignalAlert: {
        type: 'board_change',
        text: 'Reporting line moved under a new SVP; autonomy is narrower than last year',
        source: 'Event Registry Intelligence',
        date: '4 days ago',
        severity: 'elevated',
      },
      sfaReason: 'Infrastructure scope is close to the VP of AI headcount anchor.',
      cmaReason: 'Open to a conversation if the seat reports to the CEO.',
      ptmReason: 'Worth nurturing while the new reporting line settles.',
    }),
    recommendedCandidate({
      id: 'rec-ai-4',
      name: 'Owen Blake',
      currentTitle: 'VP of Machine Learning',
      company: 'Apple',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
      location: 'Cupertino, CA',
      emiScore: 84,
      sfaScore: 85,
      cmaScore: 80,
      ptmScore: 48,
      ptmLevel: 'Low',
      liveSignalAlert: {
        type: 'earnings_call',
        text: 'Two-year retention grant filed; short-term mobility is low',
        source: 'SEC Edgar Form 4',
        date: '1 week ago',
        severity: 'standard',
      },
      sfaReason: 'On-device ML leadership matches part of the applied-AI scope.',
      cmaReason: 'Recently refreshed; keep on the watchlist until the grant ages.',
      ptmReason: 'Retention package holds them through the next two quarters.',
    }),
  ],
};

export function getSuccessionRecommendations(role: RoleSuccessionItem): ShadowBenchCandidate[] {
  const specific = successionRecommendationsByRole[role.id];
  if (specific) return specific;

  return [
    recommendedCandidate({
      id: `rec-${role.id}-1`,
      name: 'Maya Ellison',
      currentTitle: role.level === 'C-Suite' ? `Chief successor, ${role.department}` : `VP, ${role.department}`,
      company: 'Microsoft',
      location: 'Redmond, WA',
      emiScore: 90,
      sfaScore: 91,
      cmaScore: 89,
      ptmScore: 84,
      ptmLevel: 'High',
      liveSignalAlert: {
        type: 'restructuring',
        text: 'Leadership bench reshuffle opened a window to move into this seat',
        source: 'Event Registry Intelligence',
        date: '3 days ago',
        severity: 'elevated',
      },
      sfaReason: `Scope lines up with ${role.anchors.targetHeadcountScope}.`,
      cmaReason: 'Looking for the step-up this requisition offers.',
      ptmReason: 'Reporting-line change removed the internal path.',
    }),
    recommendedCandidate({
      id: `rec-${role.id}-2`,
      name: 'Chris Dalton',
      currentTitle: `SVP, ${role.department}`,
      company: 'Salesforce',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
      location: 'San Francisco, CA',
      emiScore: 87,
      sfaScore: 88,
      cmaScore: 86,
      ptmScore: 79,
      ptmLevel: 'Medium',
      liveSignalAlert: {
        type: 'earnings_call',
        text: 'Tenure past four years with no title change',
        source: 'Proxy tenure review',
        date: '1 week ago',
        severity: 'standard',
      },
      sfaReason: `Revenue scale is inside ${role.anchors.targetRevenueScale}.`,
      cmaReason: 'Will engage if the seat reports to the executive sponsor.',
      ptmReason: 'Tenure stagnation without an internal promotion.',
    }),
    recommendedCandidate({
      id: `rec-${role.id}-3`,
      name: 'Priya Nandakumar',
      currentTitle: `Director, ${role.department}`,
      company: 'Adobe',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
      location: 'San Jose, CA',
      emiScore: 82,
      sfaScore: 84,
      cmaScore: 79,
      ptmScore: 44,
      ptmLevel: 'Low',
      liveSignalAlert: {
        type: 'earnings_call',
        text: 'Fresh retention grant keeps a move unlikely this quarter',
        source: 'Proxy tenure review',
        date: '2 weeks ago',
        severity: 'standard',
      },
      sfaReason: `Adjacent scope for ${role.roleTitle}, not a ready-now match.`,
      cmaReason: 'Content where they are until the grant cliffs.',
      ptmReason: 'Hold on the watchlist and revisit after the retention window.',
    }),
  ];
}
