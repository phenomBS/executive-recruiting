export interface CandidateLeadSummary {
  id: string;
  name: string;
  currentRole: string;
  company: string;
  avatarUrl?: string;
  mobilityScore: number;
  status: 'warm' | 'qualified' | 'ready_to_move';
  lastTouchpoint: string;
  fitSummary: string;
}

export interface RoleHealthBreakdown {
  id: string;
  roleTitle: string;
  department: 'Engineering & AI' | 'Executive Leadership' | 'Product & Growth' | 'Finance & Corporate' | 'Security & Infrastructure';
  level: 'C-Suite' | 'VP' | 'SVP' | 'Head of';
  hiringManager: string;
  hiringManagerTitle: string;
  hiringManagerAvatar: string;
  targetDate: string;
  daysOpen: number;
  healthStatus: 'healthy' | 'calibrating' | 'attention_needed';
  healthScore: number; // 0-100%
  healthLabel: string;
  
  // Three Core Lead Breakdowns
  warmLeadsCount: number;
  qualifiedLeadsCount: number;
  readyToMoveCount: number;
  targetBenchmarkCount: number;

  // Active highlighted leads for expansion
  topLeads: CandidateLeadSummary[];

  // Strategic insight for in-house recruiting team
  strategicInsight: string;
  recentMobilityEvent?: string;
}

export const initialRoleHealthData: RoleHealthBreakdown[] = [
  {
    id: 'rh-1',
    roleTitle: 'VP of Artificial Intelligence',
    department: 'Engineering & AI',
    level: 'VP',
    hiringManager: 'Satya Nadella',
    hiringManagerTitle: 'Chief Executive Officer',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
    targetDate: 'Nov 15, 2026',
    daysOpen: 28,
    healthStatus: 'healthy',
    healthScore: 92,
    healthLabel: 'High Velocity Slate',
    warmLeadsCount: 24,
    qualifiedLeadsCount: 11,
    readyToMoveCount: 5,
    targetBenchmarkCount: 30,
    strategicInsight: '5 ready-to-move leaders from Meta and Anthropic completed preliminary technical vetting. 1 introductory HM interview scheduled.',
    recentMobilityEvent: 'Meta infrastructure restructuring created 3 new high-mobility VP leads.',
    topLeads: [
      {
        id: 'tl-1',
        name: 'Elena Rostova',
        currentRole: 'VP of Artificial Intelligence',
        company: 'Meta',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
        mobilityScore: 96,
        status: 'ready_to_move',
        lastTouchpoint: 'Yesterday (Call confirmed)',
        fitSummary: 'Distributed models leadership, 300+ research engineers, top cultural calibration score.'
      },
      {
        id: 'tl-2',
        name: 'Liam Sterling',
        currentRole: 'Director of Machine Learning',
        company: 'Canal',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
        mobilityScore: 89,
        status: 'qualified',
        lastTouchpoint: '2 days ago',
        fitSummary: 'High velocity models deployment, $80M compute budget oversight.'
      },
      {
        id: 'tl-3',
        name: 'Sofia Rodriguez',
        currentRole: 'Head of Infrastructure Reliability',
        company: 'Databricks',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        mobilityScore: 92,
        status: 'ready_to_move',
        lastTouchpoint: '3 days ago',
        fitSummary: 'GPU cluster orchestration and high-concurrency scaleup experience.'
      }
    ]
  },
  {
    id: 'rh-2',
    roleTitle: 'Chief Information Security Officer (CISO)',
    department: 'Security & Infrastructure',
    level: 'C-Suite',
    hiringManager: 'David Chen',
    hiringManagerTitle: 'Board Audit Committee Chair',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
    targetDate: 'Dec 01, 2026',
    daysOpen: 42,
    healthStatus: 'calibrating',
    healthScore: 74,
    healthLabel: 'Calibrating Security Clearances',
    warmLeadsCount: 18,
    qualifiedLeadsCount: 8,
    readyToMoveCount: 3,
    targetBenchmarkCount: 25,
    strategicInsight: 'Solid qualified core; need 2 additional ready-to-move leaders with FedRAMP High and global zero-trust governance background.',
    recentMobilityEvent: 'Recent cybersecurity leadership reshuffle across Fortune 100 enterprise software.',
    topLeads: [
      {
        id: 'tl-4',
        name: 'Alexander Wright',
        currentRole: 'VP Security Architecture',
        company: 'CrowdStrike',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
        mobilityScore: 91,
        status: 'ready_to_move',
        lastTouchpoint: '4 hours ago',
        fitSummary: 'Enterprise detection and response, SOX audit defense, 120-person SecOps team.'
      },
      {
        id: 'tl-5',
        name: 'Darren Vance',
        currentRole: 'Chief Trust Officer',
        company: 'Okta',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80',
        mobilityScore: 88,
        status: 'qualified',
        lastTouchpoint: 'Oct 1',
        fitSummary: 'Zero-trust architecture pioneer, deep board-level risk reporting expertise.'
      }
    ]
  },
  {
    id: 'rh-3',
    roleTitle: 'Chief Financial Officer (CFO)',
    department: 'Finance & Corporate',
    level: 'C-Suite',
    hiringManager: 'Brian Stepan',
    hiringManagerTitle: 'Executive Search Lead',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&q=80',
    targetDate: 'Nov 30, 2026',
    daysOpen: 35,
    healthStatus: 'healthy',
    healthScore: 89,
    healthLabel: 'Pre-IPO Bench Primed',
    warmLeadsCount: 21,
    qualifiedLeadsCount: 9,
    readyToMoveCount: 4,
    targetBenchmarkCount: 25,
    strategicInsight: 'Excellent coverage of public-readiness CFOs with $500M+ ARR scaling credentials. 4 candidates in final panel calibration.',
    recentMobilityEvent: 'Goldman Sachs fintech investment banking departures creating senior advisory candidates.',
    topLeads: [
      {
        id: 'tl-6',
        name: 'Colette Kress',
        currentRole: 'EVP & Chief Financial Officer',
        company: 'NVIDIA',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
        mobilityScore: 94,
        status: 'ready_to_move',
        lastTouchpoint: 'Yesterday at 3 PM',
        fitSummary: 'Multi-billion capital allocation, investor relations, SEC audit committee veteran.'
      },
      {
        id: 'tl-7',
        name: 'David Miller',
        currentRole: 'VP Finance & Controller',
        company: 'Clearify',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
        mobilityScore: 90,
        status: 'qualified',
        lastTouchpoint: 'Oct 2',
        fitSummary: 'Built global treasury and FP&A organizations from Series C through public scale.'
      }
    ]
  },
  {
    id: 'rh-4',
    roleTitle: 'VP Product - AI Systems',
    department: 'Product & Growth',
    level: 'VP',
    hiringManager: 'Satya Nadella',
    hiringManagerTitle: 'Chief Executive Officer',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
    targetDate: 'Dec 10, 2026',
    daysOpen: 19,
    healthStatus: 'healthy',
    healthScore: 94,
    healthLabel: 'Full Slate Calibrated',
    warmLeadsCount: 29,
    qualifiedLeadsCount: 14,
    readyToMoveCount: 6,
    targetBenchmarkCount: 30,
    strategicInsight: 'Phenom Aura Agent engaged 14 tier-1 AI product leaders. HM feedback received on first 3 candidates with 9.2 avg score.',
    recentMobilityEvent: 'Snowflake leadership shifts opening up enterprise data & product management SVPs.',
    topLeads: [
      {
        id: 'tl-8',
        name: 'Chloe Kim',
        currentRole: 'Head of Product Design & AI UX',
        company: 'Sapient.ai',
        avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&h=120&fit=crop&q=80',
        mobilityScore: 93,
        status: 'ready_to_move',
        lastTouchpoint: 'Oct 2 at 11 AM',
        fitSummary: 'Enterprise AI generative agents workflow, product-led expansion, $120M ARR influence.'
      },
      {
        id: 'tl-9',
        name: 'Rachel Green',
        currentRole: 'Chief Growth Officer',
        company: 'TableTalk',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
        mobilityScore: 87,
        status: 'qualified',
        lastTouchpoint: 'Sep 30',
        fitSummary: 'Deep enterprise monetization expertise, AI copilot adoption playbooks.'
      }
    ]
  },
  {
    id: 'rh-5',
    roleTitle: 'Chief Technology Officer (CTO)',
    department: 'Engineering & AI',
    level: 'C-Suite',
    hiringManager: 'Dr. Sarah Jenkins',
    hiringManagerTitle: 'Search Committee Lead',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
    targetDate: 'Dec 15, 2026',
    daysOpen: 51,
    healthStatus: 'attention_needed',
    healthScore: 58,
    healthLabel: 'Requires Expanded Reach',
    warmLeadsCount: 14,
    qualifiedLeadsCount: 5,
    readyToMoveCount: 2,
    targetBenchmarkCount: 25,
    strategicInsight: 'Ready-to-move pool is currently below target threshold (2 vs target 5). Recommending Aura Agent multi-channel outreach to payments & FinTech CTOs.',
    recentMobilityEvent: 'Stripe and Adyen leadership reorganizations presenting fresh candidate availability.',
    topLeads: [
      {
        id: 'tl-10',
        name: 'Marcus Vance',
        currentRole: 'Chief Technology Officer',
        company: 'Stripe',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&q=80',
        mobilityScore: 95,
        status: 'ready_to_move',
        lastTouchpoint: '3 hours ago (Meeting booked)',
        fitSummary: 'High-throughput core transaction ledger, engineering excellence across 1,200 directs.'
      },
      {
        id: 'tl-11',
        name: 'Brian Gallagher',
        currentRole: 'Chief Technology Officer',
        company: 'Brightpath',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
        mobilityScore: 86,
        status: 'warm',
        lastTouchpoint: 'Oct 1',
        fitSummary: 'Scaled engineering headcount 100% YoY, multi-region database architect.'
      }
    ]
  },
  {
    id: 'rh-6',
    roleTitle: 'Chief Marketing Officer (CMO)',
    department: 'Product & Growth',
    level: 'C-Suite',
    hiringManager: 'Marcus Vance',
    hiringManagerTitle: 'Chief Technology Officer',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80',
    targetDate: 'Jan 15, 2027',
    daysOpen: 14,
    healthStatus: 'healthy',
    healthScore: 86,
    healthLabel: 'Early Warm Traction',
    warmLeadsCount: 19,
    qualifiedLeadsCount: 7,
    readyToMoveCount: 4,
    targetBenchmarkCount: 20,
    strategicInsight: 'Recently launched mandate. High interest from B2B SaaS CMOs with global account-based marketing track records.',
    recentMobilityEvent: 'Salesforce executive realignments accelerating CMO mobility.',
    topLeads: [
      {
        id: 'tl-12',
        name: 'Sarah Sandberg',
        currentRole: 'Chief Marketing Officer',
        company: 'Enterprise Cloud Corp',
        avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&h=120&fit=crop&q=80',
        mobilityScore: 92,
        status: 'ready_to_move',
        lastTouchpoint: 'Yesterday',
        fitSummary: 'Enterprise demand gen, category creator, scaled brand from $200M to $1.2B ARR.'
      }
    ]
  },
  {
    id: 'rh-7',
    roleTitle: 'VP Engineering - Cloud Platform',
    department: 'Engineering & AI',
    level: 'VP',
    hiringManager: 'Marcus Vance',
    hiringManagerTitle: 'Chief Technology Officer',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80',
    targetDate: 'Dec 20, 2026',
    daysOpen: 24,
    healthStatus: 'healthy',
    healthScore: 90,
    healthLabel: 'Robust Technical Bench',
    warmLeadsCount: 22,
    qualifiedLeadsCount: 10,
    readyToMoveCount: 4,
    targetBenchmarkCount: 25,
    strategicInsight: 'Strong engineering pipeline across AWS, Google Cloud, and Azure leadership alumni.',
    recentMobilityEvent: 'Google Cloud organizational updates triggering senior director departures.',
    topLeads: [
      {
        id: 'tl-13',
        name: 'John Ternus',
        currentRole: 'SVP Systems & Engineering',
        company: 'Apple',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
        mobilityScore: 94,
        status: 'ready_to_move',
        lastTouchpoint: '2 hours ago',
        fitSummary: 'Massive distributed infrastructure, world-class hardware/software integration.'
      }
    ]
  },
  {
    id: 'rh-8',
    roleTitle: 'VP People & Executive Talent',
    department: 'Executive Leadership',
    level: 'VP',
    hiringManager: 'Elena Rostova',
    hiringManagerTitle: 'Search Committee Sponsor',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
    targetDate: 'Jan 30, 2027',
    daysOpen: 12,
    healthStatus: 'calibrating',
    healthScore: 78,
    healthLabel: 'Calibrating Talent Spec',
    warmLeadsCount: 15,
    qualifiedLeadsCount: 6,
    readyToMoveCount: 2,
    targetBenchmarkCount: 20,
    strategicInsight: 'Intake calibration complete. Priority on leaders who have driven executive compensation reform and board succession.',
    recentMobilityEvent: 'Tech industry HR leadership changes creating active dialogue.',
    topLeads: [
      {
        id: 'tl-14',
        name: 'Nadia Petrov',
        currentRole: 'VP of People Operations',
        company: 'Brightpath',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
        mobilityScore: 89,
        status: 'qualified',
        lastTouchpoint: '3 days ago',
        fitSummary: 'Executive coaching, board compensation committee governance, global remote orgs.'
      }
    ]
  }
];
