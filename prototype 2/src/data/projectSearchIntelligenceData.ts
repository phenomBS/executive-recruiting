import type { RoleSuccessionItem } from './rolesSuccessionData';

export interface SearchIntelligenceData {
  projectId: string;
  roleTitle: string;
  companyName: string;
  lastCalibratedDate: string;
  benchmarkSource: string;
  
  // 1. Compensation Reality Check
  compensation: {
    baseSalary: {
      p25: number;
      median: number;
      p75: number;
    };
    totalCashOTE: {
      p25: number;
      median: number;
      p75: number;
    };
    equityAnnualMedian: number;
    clientBudgetBase: number;
    clientBudgetOTE: number;
    intakeTakeaway: string;
  };

  // 2. Talent Pool Scarcity (TAM)
  talentPool: {
    baselineTAM: number;
    titleBreakdown: { title: string; percentage: number; count: number }[];
    interactiveFilters: {
      id: string;
      label: string;
      impactPercent: number; // percentage reduction e.g. -72
      description: string;
      applied: boolean;
    }[];
    intakeTakeaway: string;
  };

  // 3. Geographic Heatmap & Work Model
  geography: {
    topHubs: {
      metro: string;
      region: string;
      candidateCount: number;
      percentage: number;
      isClientHQ?: boolean;
    }[];
    workModel: {
      remote: number;
      hybrid: number;
      inOffice: number;
    };
    clientRequirement: string;
    intakeTakeaway: string;
  };

  // 4. Source Company Concentration
  sourceCompanies: {
    topTen: {
      rank: number;
      name: string;
      industry: string;
      candidateCount: number;
      percentageOfCohort: number;
      offLimitsStatus: 'Clear Target' | 'Do Not Poach (Client)' | 'Restricted (Board)' | 'Caution (Partner)';
      cultureType: string;
    }[];
    topFiveConcentrationPercent: number;
    intakeTakeaway: string;
  };

  // 5. Macro Tenure & Flight Risk (Baseline PTM)
  macroTenure: {
    averageTenureYears: number;
    historicalCliffExitPercent: number;
    vestingCliffWindowMonths: string;
    flightRiskDistribution: {
      tenureRange: string;
      percentage: number;
      riskLevel: 'Low' | 'Moderate' | 'High' | 'Peak Opportunity';
      description: string;
    }[];
    intakeTakeaway: string;
  };
}

export const projectSearchIntelligenceMap: Record<string, SearchIntelligenceData> = {
  // Project 1: CFO @ Acme Corporation
  'p-1': {
    projectId: 'p-1',
    roleTitle: 'Chief Financial Officer (CFO)',
    companyName: 'Acme Corporation',
    lastCalibratedDate: 'October 1, 2026',
    benchmarkSource: 'Phenom Market Intel & Executive Compensation Pulse (Q3 2026)',
    
    compensation: {
      baseSalary: {
        p25: 360000,
        median: 435000,
        p75: 520000
      },
      totalCashOTE: {
        p25: 580000,
        median: 725000,
        p75: 940000
      },
      equityAnnualMedian: 450000,
      clientBudgetBase: 340000,
      clientBudgetOTE: 550000,
      intakeTakeaway: 'The hiring manager\'s initial $340,000 base budget sits below the 20th percentile ($360K). To attract seasoned pre-IPO SaaS CFOs who have executed S-1 filings, the budget must be recalibrated to $425,000+ Base or sweetened with an additional 0.45% in non-dilutive equity grants.'
    },

    talentPool: {
      baselineTAM: 2840,
      titleBreakdown: [
        { title: 'Chief Financial Officer (CFO)', percentage: 48, count: 1363 },
        { title: 'SVP / VP of Finance', percentage: 38, count: 1079 },
        { title: 'VP Corporate Controller & Treasurer', percentage: 14, count: 398 }
      ],
      interactiveFilters: [
        {
          id: 'filter-ipo',
          label: 'Direct S-1 & Public IPO Execution Track Record',
          impactPercent: -68,
          description: 'Requires candidate to have led an active IPO bell-ringing in last 5 years',
          applied: false
        },
        {
          id: 'filter-saas-scale',
          label: 'Scale Experience: $150M+ to $500M+ ARR Expansion',
          impactPercent: -55,
          description: 'Requires multi-product recurring revenue model scaling',
          applied: false
        },
        {
          id: 'filter-hardware',
          label: 'Hybrid Hardware & Enterprise Cloud Billing Domain',
          impactPercent: -78,
          description: 'Shrinks cohort down to rare crossover infrastructure CFOs',
          applied: false
        },
        {
          id: 'filter-pedigree',
          label: 'Tier-1 Investment Banking / Big-4 Audit Roots',
          impactPercent: -42,
          description: 'Strict pedigree requirement requested by Audit Committee Chair',
          applied: false
        }
      ],
      intakeTakeaway: 'Starting TAM is healthy at 2,840 executives. However, stacking the requirement for "Direct S-1 IPO Execution" with "Hardware + SaaS hybrid billing" immediately contracts the viable global talent pool from 2,840 down to just 64 individuals. Recommend positioning hardware as preferred rather than mandatory.'
    },

    geography: {
      topHubs: [
        { metro: 'San Francisco Bay Area', region: 'California', candidateCount: 1120, percentage: 39, isClientHQ: true },
        { metro: 'New York Metro Area', region: 'New York / NJ', candidateCount: 740, percentage: 26 },
        { metro: 'Boston Metro', region: 'Massachusetts', candidateCount: 370, percentage: 13 },
        { metro: 'Seattle-Bellevue', region: 'Washington', candidateCount: 340, percentage: 12 },
        { metro: 'Austin Metro', region: 'Texas', candidateCount: 270, percentage: 10 }
      ],
      workModel: {
        remote: 28,
        hybrid: 58,
        inOffice: 14
      },
      clientRequirement: '5-Day In-Office Mandatory (San Francisco HQ)',
      intakeTakeaway: '86% of the target CFO cohort currently operates under flexible hybrid or remote models. Enforcing an uncompromising 5-day on-site requirement eliminates 86% of qualified candidates in market and eliminates out-of-market talent unless executive relocation packages ($100k+) are explicitly authorized.'
    },

    sourceCompanies: {
      topTen: [
        { rank: 1, name: 'Salesforce', industry: 'Enterprise Cloud', candidateCount: 84, percentageOfCohort: 7.2, offLimitsStatus: 'Clear Target', cultureType: 'Tier-1 SaaS Public' },
        { rank: 2, name: 'Snowflake', industry: 'Data Cloud Infrastructure', candidateCount: 68, percentageOfCohort: 5.8, offLimitsStatus: 'Clear Target', cultureType: 'High Velocity Growth' },
        { rank: 3, name: 'Workday', industry: 'Financial Management Software', candidateCount: 62, percentageOfCohort: 5.3, offLimitsStatus: 'Do Not Poach (Client)', cultureType: 'Enterprise Standard' },
        { rank: 4, name: 'Oracle', industry: 'Database & Enterprise Systems', candidateCount: 55, percentageOfCohort: 4.7, offLimitsStatus: 'Clear Target', cultureType: 'Mature Corporate Matrix' },
        { rank: 5, name: 'ServiceNow', industry: 'Digital Workflow SaaS', candidateCount: 51, percentageOfCohort: 4.4, offLimitsStatus: 'Caution (Partner)', cultureType: 'Enterprise Scale' },
        { rank: 6, name: 'Datadog', industry: 'Monitoring & Cloud Security', candidateCount: 42, percentageOfCohort: 3.6, offLimitsStatus: 'Clear Target', cultureType: 'Engineering-Led Public' },
        { rank: 7, name: 'Intuit', industry: 'Financial & Business Tech', candidateCount: 38, percentageOfCohort: 3.3, offLimitsStatus: 'Clear Target', cultureType: 'Operational Discipline' },
        { rank: 8, name: 'Stripe', industry: 'Financial Infrastructure', candidateCount: 36, percentageOfCohort: 3.1, offLimitsStatus: 'Restricted (Board)', cultureType: 'Pre-IPO Scaling' },
        { rank: 9, name: 'Palo Alto Networks', industry: 'Cybersecurity Enterprise', candidateCount: 33, percentageOfCohort: 2.8, offLimitsStatus: 'Clear Target', cultureType: 'High Accountability' },
        { rank: 10, name: 'HubSpot', industry: 'CRM & Marketing Platform', candidateCount: 29, percentageOfCohort: 2.5, offLimitsStatus: 'Clear Target', cultureType: 'Product-Led Growth' }
      ],
      topFiveConcentrationPercent: 27.4,
      intakeTakeaway: 'Over 27% of matching financial executives sit inside the top 5 companies. Crucially, Workday is flagged as Do Not Poach due to client agreements, and Stripe has board affiliation restrictions. Sourcing must primarily penetrate Salesforce, Snowflake, and ServiceNow alumni.'
    },

    macroTenure: {
      averageTenureYears: 3.4,
      historicalCliffExitPercent: 71,
      vestingCliffWindowMonths: 'Months 32 to 44',
      flightRiskDistribution: [
        { tenureRange: '< 1.5 Years', percentage: 22, riskLevel: 'Low', description: 'Recently settled in seat; unvested golden handcuffs make poaching cost prohibitive' },
        { tenureRange: '1.5 - 2.8 Years', percentage: 26, riskLevel: 'Moderate', description: 'Mid-cycle; will only evaluate exceptional transformational C-level step-ups' },
        { tenureRange: '2.8 - 4.0 Years', percentage: 38, riskLevel: 'Peak Opportunity', description: 'Approaching standard 48-month cliff; peak receptivity to outreach' },
        { tenureRange: '4.0+ Years', percentage: 14, riskLevel: 'High', description: 'Fully vested; evaluating next chapter or advisory board positions' }
      ],
      intakeTakeaway: 'Average CFO tenure in enterprise SaaS is 3.4 years. 71% of this cohort transitions between months 32 and 44 as their initial stock grant approaches full vest. The recruiter should target the 38% sitting in this prime vesting window rather than demanding candidates with 5+ years of continuous seat tenure.'
    }
  },

  // Project 2: VP of Engineering @ TechFlow Inc.
  'p-2': {
    projectId: 'p-2',
    roleTitle: 'VP of Engineering',
    companyName: 'TechFlow Inc.',
    lastCalibratedDate: 'October 1, 2026',
    benchmarkSource: 'Phenom Technical Leadership Benchmark & Comp Intelligence (Q3 2026)',

    compensation: {
      baseSalary: {
        p25: 340000,
        median: 410000,
        p75: 485000
      },
      totalCashOTE: {
        p25: 480000,
        median: 610000,
        p75: 760000
      },
      equityAnnualMedian: 520000,
      clientBudgetBase: 310000,
      clientBudgetOTE: 440000,
      intakeTakeaway: 'Client budget ($310K Base / $440K OTE) is significantly below market for modern VP of Engineering roles leading distributed AI/systems teams (Median: $410K Base / $610K OTE). Without adjusting base to at least $380K, the search will be limited to Director step-ups.'
    },

    talentPool: {
      baselineTAM: 3260,
      titleBreakdown: [
        { title: 'VP of Engineering', percentage: 55, count: 1793 },
        { title: 'Senior Director of Engineering', percentage: 35, count: 1141 },
        { title: 'Head of Infrastructure / Platform', percentage: 10, count: 326 }
      ],
      interactiveFilters: [
        {
          id: 'filter-distributed-ai',
          label: 'Distributed Systems & Real-time AI Inference Infrastructure',
          impactPercent: -72,
          description: 'High-concurrency streaming, GPU compute clustering, low latency',
          applied: false
        },
        {
          id: 'filter-scale-250',
          label: 'Scaled 200+ Global Engineers in High-Growth Environment',
          impactPercent: -64,
          description: 'Multi-tiered director management and global time-zone coordination',
          applied: false
        },
        {
          id: 'filter-fullstack-cloud',
          label: 'Both Proprietary Datacenter Hardware & Multi-Cloud Experience',
          impactPercent: -81,
          description: 'Extremely rare hybrid infrastructure pedigree',
          applied: false
        }
      ],
      intakeTakeaway: 'The baseline TAM of 3,260 candidates drops by 81% if the hiring manager insists on both proprietary datacenter and multi-cloud expertise. Framing the search around pure distributed systems will preserve a 900+ person addressable market.'
    },

    geography: {
      topHubs: [
        { metro: 'San Francisco Bay Area', region: 'California', candidateCount: 1420, percentage: 44 },
        { metro: 'Seattle-Bellevue', region: 'Washington', candidateCount: 780, percentage: 24 },
        { metro: 'New York Metro Area', region: 'New York', candidateCount: 420, percentage: 13 },
        { metro: 'Austin Metro', region: 'Texas', candidateCount: 360, percentage: 11, isClientHQ: true },
        { metro: 'Boston Metro', region: 'Massachusetts', candidateCount: 280, percentage: 8 }
      ],
      workModel: {
        remote: 46,
        hybrid: 44,
        inOffice: 10
      },
      clientRequirement: '5 Days/Week On-site in Austin, Texas',
      intakeTakeaway: 'Only 11% of the qualified VP of Engineering talent pool lives in Austin, and 90% of all target engineers are remote or hybrid. Requiring 5 days on-site in Austin without remote flexibility shrinks the candidate universe to ~36 local individuals.'
    },

    sourceCompanies: {
      topTen: [
        { rank: 1, name: 'Google / Alphabet', industry: 'Cloud & Infrastructure', candidateCount: 96, percentageOfCohort: 6.8, offLimitsStatus: 'Clear Target', cultureType: 'Hyperscale Distributed' },
        { rank: 2, name: 'Amazon / AWS', industry: 'Cloud Compute & Systems', candidateCount: 91, percentageOfCohort: 6.4, offLimitsStatus: 'Clear Target', cultureType: 'High Accountability Matrix' },
        { rank: 3, name: 'Meta', industry: 'AI Infrastructure & Platforms', candidateCount: 75, percentageOfCohort: 5.3, offLimitsStatus: 'Clear Target', cultureType: 'Fast-Paced Engineering' },
        { rank: 4, name: 'Microsoft / Azure', industry: 'Enterprise Cloud Infrastructure', candidateCount: 68, percentageOfCohort: 4.8, offLimitsStatus: 'Caution (Partner)', cultureType: 'Scale & Process' },
        { rank: 5, name: 'Uber', industry: 'Marketplace & Distributed Systems', candidateCount: 52, percentageOfCohort: 3.7, offLimitsStatus: 'Clear Target', cultureType: 'High Concurrency Ops' },
        { rank: 6, name: 'Cloudflare', industry: 'Edge Networks & Security', candidateCount: 44, percentageOfCohort: 3.1, offLimitsStatus: 'Clear Target', cultureType: 'Systems-First Culture' },
        { rank: 7, name: 'Databricks', industry: 'Data & AI Infrastructure', candidateCount: 41, percentageOfCohort: 2.9, offLimitsStatus: 'Do Not Poach (Client)', cultureType: 'Rapid Engineering Expansion' },
        { rank: 8, name: 'Stripe', industry: 'Reliability & Financial Compute', candidateCount: 38, percentageOfCohort: 2.7, offLimitsStatus: 'Restricted (Board)', cultureType: 'Exceptional Bar' },
        { rank: 9, name: 'Airbnb', industry: 'Consumer & Platform Architecture', candidateCount: 34, percentageOfCohort: 2.4, offLimitsStatus: 'Clear Target', cultureType: 'Collaborative Excellence' },
        { rank: 10, name: 'DoorDash', industry: 'Logistics & Real-time Dispatch', candidateCount: 31, percentageOfCohort: 2.2, offLimitsStatus: 'Clear Target', cultureType: 'Execution Speed' }
      ],
      topFiveConcentrationPercent: 27.0,
      intakeTakeaway: 'The top 5 hyperscalers house 27% of all qualified VPs. Databricks is off-limits due to current enterprise services agreements. Sourcing should aggressively target AWS, Google Cloud, and Cloudflare alumni where equity re-pricing creates strong push factors.'
    },

    macroTenure: {
      averageTenureYears: 2.9,
      historicalCliffExitPercent: 74,
      vestingCliffWindowMonths: 'Months 28 to 40',
      flightRiskDistribution: [
        { tenureRange: '< 1 Year', percentage: 24, riskLevel: 'Low', description: 'Ramping up projects; non-viable for immediate recruitment' },
        { tenureRange: '1.0 - 2.2 Years', percentage: 28, riskLevel: 'Moderate', description: 'Product roadmap in flight; high inertia' },
        { tenureRange: '2.2 - 3.5 Years', percentage: 36, riskLevel: 'Peak Opportunity', description: 'Approaching equity vesting milestones; high receptivity' },
        { tenureRange: '3.5+ Years', percentage: 12, riskLevel: 'High', description: 'Architectural fatigue or seeking founding VP roles' }
      ],
      intakeTakeaway: 'Engineering leadership turnover is accelerating, with average tenure at 2.9 years. Demanding a VP with 5+ years tenure in their current role filters out 88% of the modern technical leadership market.'
    }
  },

  // Project 3: Senior Product Manager @ Acme Corporation
  'p-3': {
    projectId: 'p-3',
    roleTitle: 'Senior Product Manager',
    companyName: 'Acme Corporation',
    lastCalibratedDate: 'October 1, 2026',
    benchmarkSource: 'Phenom Product Management Market Pulse (Q3 2026)',

    compensation: {
      baseSalary: {
        p25: 185000,
        median: 225000,
        p75: 265000
      },
      totalCashOTE: {
        p25: 220000,
        median: 275000,
        p75: 340000
      },
      equityAnnualMedian: 95000,
      clientBudgetBase: 210000,
      clientBudgetOTE: 250000,
      intakeTakeaway: 'Client budget ($210K Base / $250K OTE) is within striking distance of the 45th percentile ($225K Base). A modest $15K adjustment or a $25K signing bonus will achieve full parity with top-tier product talent.'
    },

    talentPool: {
      baselineTAM: 6850,
      titleBreakdown: [
        { title: 'Senior Product Manager', percentage: 62, count: 4247 },
        { title: 'Staff Product Manager', percentage: 24, count: 1644 },
        { title: 'Lead Product Manager', percentage: 14, count: 959 }
      ],
      interactiveFilters: [
        {
          id: 'filter-developer-platform',
          label: 'Developer Platform & API-First Product Architecture',
          impactPercent: -62,
          description: 'Deep technical PM experience with SDKs, APIs, and dev ecosystems',
          applied: false
        },
        {
          id: 'filter-enterprise-security',
          label: 'Enterprise Identity, RBAC & SOC2 Compliance Experience',
          impactPercent: -58,
          description: 'Mission-critical enterprise governance workflows',
          applied: false
        },
        {
          id: 'filter-0-to-1',
          label: 'Proven 0-to-1 Product Incubation Track Record',
          impactPercent: -45,
          description: 'Shipped net new products from whiteboard to $10M+ ARR',
          applied: false
        }
      ],
      intakeTakeaway: 'With a broad TAM of 6,850 candidates, the recruiter can afford reasonable filtering. However, requiring both Developer Platform APIs and Enterprise SOC2 Compliance cuts the pool to 840 candidates—still highly viable.'
    },

    geography: {
      topHubs: [
        { metro: 'San Francisco Bay Area', region: 'California', candidateCount: 2850, percentage: 42, isClientHQ: true },
        { metro: 'New York Metro Area', region: 'New York', candidateCount: 1640, percentage: 24 },
        { metro: 'Seattle-Bellevue', region: 'Washington', candidateCount: 890, percentage: 13 },
        { metro: 'Austin Metro', region: 'Texas', candidateCount: 780, percentage: 11 },
        { metro: 'Boston Metro', region: 'Massachusetts', candidateCount: 690, percentage: 10 }
      ],
      workModel: {
        remote: 38,
        hybrid: 52,
        inOffice: 10
      },
      clientRequirement: 'Hybrid 3 Days On-site (San Francisco)',
      intakeTakeaway: 'The hybrid 3-day model aligns well with market reality (52% hybrid). 42% of the national talent pool sits in the SF Bay Area, making local sourcing highly realistic.'
    },

    sourceCompanies: {
      topTen: [
        { rank: 1, name: 'Atlassian', industry: 'Collaboration & Dev Tools', candidateCount: 142, percentageOfCohort: 5.8, offLimitsStatus: 'Clear Target', cultureType: 'Product-Led Growth' },
        { rank: 2, name: 'Twilio', industry: 'Developer Communications API', candidateCount: 128, percentageOfCohort: 5.2, offLimitsStatus: 'Clear Target', cultureType: 'API-First Engineering' },
        { rank: 3, name: 'Okta', industry: 'Identity & Access Management', candidateCount: 115, percentageOfCohort: 4.7, offLimitsStatus: 'Clear Target', cultureType: 'Enterprise Security' },
        { rank: 4, name: 'Stripe', industry: 'Developer Infrastructure', candidateCount: 98, percentageOfCohort: 4.0, offLimitsStatus: 'Restricted (Board)', cultureType: 'Rigorous Craft' },
        { rank: 5, name: 'HubSpot', industry: 'Enterprise SaaS', candidateCount: 92, percentageOfCohort: 3.8, offLimitsStatus: 'Clear Target', cultureType: 'Customer-Centric PLG' },
        { rank: 6, name: 'Datadog', industry: 'Cloud Observability', candidateCount: 84, percentageOfCohort: 3.4, offLimitsStatus: 'Clear Target', cultureType: 'High Output Speed' },
        { rank: 7, name: 'Figma', industry: 'Design & Collaboration', candidateCount: 76, percentageOfCohort: 3.1, offLimitsStatus: 'Clear Target', cultureType: 'Design-Driven Tech' },
        { rank: 8, name: 'Shopify', industry: 'Commerce Platforms', candidateCount: 71, percentageOfCohort: 2.9, offLimitsStatus: 'Clear Target', cultureType: 'Merchant Focus' },
        { rank: 9, name: 'ZoomInfo', industry: 'GTM Data Software', candidateCount: 65, percentageOfCohort: 2.7, offLimitsStatus: 'Clear Target', cultureType: 'Data Pipeline PM' },
        { rank: 10, name: 'HashiCorp', industry: 'Cloud Infrastructure Tools', candidateCount: 58, percentageOfCohort: 2.4, offLimitsStatus: 'Clear Target', cultureType: 'Open Source Ecosystem' }
      ],
      topFiveConcentrationPercent: 23.5,
      intakeTakeaway: 'Top 10 targets represent prime product-led SaaS institutions. Okta and Twilio are the exact archetype fits for developer-facing security products.'
    },

    macroTenure: {
      averageTenureYears: 2.4,
      historicalCliffExitPercent: 62,
      vestingCliffWindowMonths: 'Months 24 to 36',
      flightRiskDistribution: [
        { tenureRange: '< 1 Year', percentage: 28, riskLevel: 'Low', description: 'Recent onboarding; unlikely to jump' },
        { tenureRange: '1.0 - 2.0 Years', percentage: 34, riskLevel: 'Moderate', description: 'Delivering feature milestones' },
        { tenureRange: '2.0 - 3.2 Years', percentage: 26, riskLevel: 'Peak Opportunity', description: 'Seeking promo to Staff / Lead PM elsewhere' },
        { tenureRange: '3.2+ Years', percentage: 12, riskLevel: 'High', description: 'Tenure fatigue; ready for immediate conversation' }
      ],
      intakeTakeaway: 'Product managers move frequently (2.4 year average tenure). Targeting PMs approaching their 2-year anniversary with the prospect of owning a dedicated product suite will generate high response rates.'
    }
  },

  // Project 4: CISO @ CyberShield Systems (Direct Match to User Prompt Example)
  'p-4': {
    projectId: 'p-4',
    roleTitle: 'Chief Information Security Officer (CISO)',
    companyName: 'CyberShield Systems',
    lastCalibratedDate: 'October 1, 2026',
    benchmarkSource: 'Phenom Cybersecurity & Executive Risk Pulse (Q3 2026)',

    compensation: {
      baseSalary: {
        p25: 295000,
        median: 360000,
        p75: 440000
      },
      totalCashOTE: {
        p25: 420000,
        median: 540000,
        p75: 680000
      },
      equityAnnualMedian: 380000,
      clientBudgetBase: 225000,
      clientBudgetOTE: 320000,
      intakeTakeaway: 'Critical friction point: The hiring manager wants a Chief Information Security Officer for $225,000 Base. The market median for the requested criteria is $360,000 (and 25th percentile is $295,000). The recruiter must use this widget to force an immediate adjustment to the budget ($350K+ Base) or recalibrate the search to a Senior Manager/Director step-up.'
    },

    talentPool: {
      baselineTAM: 2500,
      titleBreakdown: [
        { title: 'Chief Information Security Officer (CISO)', percentage: 58, count: 1450 },
        { title: 'VP / Head of Information Security', percentage: 32, count: 800 },
        { title: 'Senior Director of Product Security & SecOps', percentage: 10, count: 250 }
      ],
      interactiveFilters: [
        {
          id: 'filter-hw-sw-sales',
          label: 'Must have BOTH Hardware AND Software Enterprise Security Experience',
          impactPercent: -78,
          description: 'Drastically contracts pool to rare crossover infrastructure leaders',
          applied: false
        },
        {
          id: 'filter-fedramp',
          label: 'Direct FedRAMP High & DoD IL5/IL6 Authorization Experience',
          impactPercent: -62,
          description: 'Specialized federal compliance and sovereign cloud architecture',
          applied: false
        },
        {
          id: 'filter-sec-board',
          label: 'Direct Public Board Audit & Cyber Committee Reporting Track Record',
          impactPercent: -54,
          description: 'Boardroom-tested executive with SEC Form 8-K disclosure experience',
          applied: false
        }
      ],
      intakeTakeaway: 'Prevents the "purple squirrel" problem. If the hiring manager adds a requirement like "must have hardware AND software enterprise sales/security experience," the talent pool instantly shrinks from 2,500 down to just 42 people globally, proving the search is statistically unviable as written.'
    },

    geography: {
      topHubs: [
        { metro: 'San Francisco Bay Area', region: 'California', candidateCount: 850, percentage: 34 },
        { metro: 'Washington DC Metro (NoVA / MD)', region: 'DC / Virginia', candidateCount: 700, percentage: 28 },
        { metro: 'New York Metro Area', region: 'New York', candidateCount: 400, percentage: 16 },
        { metro: 'Austin Metro', region: 'Texas', candidateCount: 300, percentage: 12, isClientHQ: true },
        { metro: 'Boston Metro', region: 'Massachusetts', candidateCount: 250, percentage: 10 }
      ],
      workModel: {
        remote: 36,
        hybrid: 52,
        inOffice: 12
      },
      clientRequirement: '5 Days/Week On-Site Mandatory in Austin, Texas',
      intakeTakeaway: 'Pushes back on strict relocation or in-office mandates. If the client demands five days a week in Austin, Texas, but the Market Calibration tab shows that 88% of target talent is entrenched in San Francisco, DC, and New York under hybrid policies, the client must either authorize remote work or pay a massive relocation premium.'
    },

    sourceCompanies: {
      topTen: [
        { rank: 1, name: 'Cisco Systems', industry: 'Enterprise Networking & Security', candidateCount: 88, percentageOfCohort: 7.2, offLimitsStatus: 'Clear Target', cultureType: 'Established Tech Matrix' },
        { rank: 2, name: 'Palo Alto Networks', industry: 'Next-Gen Cybersecurity', candidateCount: 74, percentageOfCohort: 6.0, offLimitsStatus: 'Clear Target', cultureType: 'Aggressive High Growth' },
        { rank: 3, name: 'Fortinet', industry: 'Network Security & Firewalls', candidateCount: 65, percentageOfCohort: 5.3, offLimitsStatus: 'Clear Target', cultureType: 'Engineering Heavy' },
        { rank: 4, name: 'CrowdStrike', industry: 'Endpoint Security & XDR', candidateCount: 58, percentageOfCohort: 4.7, offLimitsStatus: 'Caution (Partner)', cultureType: 'Cloud-Native Security' },
        { rank: 5, name: 'Zscaler', industry: 'Zero Trust Cloud Architecture', candidateCount: 52, percentageOfCohort: 4.2, offLimitsStatus: 'Clear Target', cultureType: 'Enterprise Cloud' },
        { rank: 6, name: 'Cloudflare', industry: 'Edge Infrastructure & DDoS', candidateCount: 44, percentageOfCohort: 3.6, offLimitsStatus: 'Clear Target', cultureType: 'Systems-First' },
        { rank: 7, name: 'Microsoft Security', industry: 'Defender & Cloud Governance', candidateCount: 38, percentageOfCohort: 3.1, offLimitsStatus: 'Do Not Poach (Client)', cultureType: 'Enterprise Scale' },
        { rank: 8, name: 'Okta', industry: 'Identity & Access Management', candidateCount: 35, percentageOfCohort: 2.8, offLimitsStatus: 'Clear Target', cultureType: 'Enterprise Identity' },
        { rank: 9, name: 'SentinelOne', industry: 'Autonomous Endpoint Sec', candidateCount: 29, percentageOfCohort: 2.4, offLimitsStatus: 'Clear Target', cultureType: 'High Output Speed' },
        { rank: 10, name: 'Mandiant / Google', industry: 'Threat Intelligence & Response', candidateCount: 26, percentageOfCohort: 2.1, offLimitsStatus: 'Restricted (Board)', cultureType: 'Elite Threat Ops' }
      ],
      topFiveConcentrationPercent: 27.4,
      intakeTakeaway: 'Instantly aligns the hiring manager and recruiter on the target landscape. It allows the recruiter to ask: "Over 50% of our viable talent pool sits inside Cisco, Palo Alto Networks, Fortinet, CrowdStrike, and Zscaler. Are any of these off-limits, and do you feel their enterprise corporate culture translates well to our high-agility environment?"'
    },

    macroTenure: {
      averageTenureYears: 3.8,
      historicalCliffExitPercent: 66,
      vestingCliffWindowMonths: 'Months 34 to 44',
      flightRiskDistribution: [
        { tenureRange: '< 1.5 Years', percentage: 20, riskLevel: 'Low', description: 'Just built the initial security posture roadmap; unvested equity lock' },
        { tenureRange: '1.5 - 2.8 Years', percentage: 26, riskLevel: 'Moderate', description: 'Completing SOC2/FedRAMP audits; high focus in-seat' },
        { tenureRange: '2.8 - 4.0 Years', percentage: 40, riskLevel: 'Peak Opportunity', description: 'Approaching 4-year vesting cliff; primary hunting window' },
        { tenureRange: '4.0+ Years', percentage: 14, riskLevel: 'High', description: 'Tenure stagnation; looking for transformational step or CISO to Board seats' }
      ],
      intakeTakeaway: 'Sets timeline expectations. The average tenure for this specific VP/CISO cohort is 3.8 years. If the client demands candidates who have been in their seat for 5+ years, the recruiter can demonstrate that the target market is inherently volatile and adjust the targeting strategy toward executives in months 34-44 approaching standard vesting cliffs.'
    }
  }
};

/**
 * Market calibration for a role. Roles that map to an existing calibrated mandate reuse that
 * benchmark set; VP of Artificial Intelligence has its own figures; everything else falls back
 * to the generic executive benchmark set titled for the role.
 */
const roleCalibrationSource: Record<string, string> = {
  'role-req-2': 'p-4',
  'role-req-3': 'p-3',
  'role-bench-3': 'p-1',
};

function cleanRoleTitle(title: string) {
  return title.replace(/\s+Bench$/i, '');
}

export function getSearchIntelligenceForRole(role: RoleSuccessionItem): SearchIntelligenceData {
  const title = cleanRoleTitle(role.roleTitle);

  if (role.id === 'role-req-1') {
    const base = projectSearchIntelligenceMap['p-2'];
    return {
      ...base,
      projectId: role.id,
      roleTitle: title,
      companyName: 'Microsoft',
      benchmarkSource: 'Phenom AI Leadership Benchmark & Executive Compensation Pulse (Q3 2026)',
      compensation: {
        baseSalary: { p25: 380000, median: 455000, p75: 540000 },
        totalCashOTE: { p25: 560000, median: 690000, p75: 850000 },
        equityAnnualMedian: 780000,
        clientBudgetBase: 360000,
        clientBudgetOTE: 520000,
        intakeTakeaway:
          'The $360K base budget sits below the 25th percentile ($380K) for AI platform VPs who run GPU compute budgets. Competing labs pay a median of $455K base with $780K in annual equity. Move base to $430K+ or add equity to keep the slate beyond Director step-ups.',
      },
      talentPool: {
        baselineTAM: 2140,
        titleBreakdown: [
          { title: 'VP of AI / Machine Learning', percentage: 46, count: 984 },
          { title: 'Head of Foundation Models / Research Platforms', percentage: 34, count: 728 },
          { title: 'Senior Director of Applied AI', percentage: 20, count: 428 },
        ],
        interactiveFilters: [
          {
            id: 'filter-foundation',
            label: 'Foundation Model Training on 10,000+ GPU Clusters',
            impactPercent: -76,
            description: 'Has owned large-scale pretraining or distributed training runs',
            applied: false,
          },
          {
            id: 'filter-enterprise-ai',
            label: 'Enterprise AI Product P&L Ownership',
            impactPercent: -58,
            description: 'Shipped generative AI products with revenue accountability',
            applied: false,
          },
          {
            id: 'filter-research-org',
            label: 'Led 300+ Researchers and Systems Engineers',
            impactPercent: -66,
            description: 'Manages multi-tier research and systems engineering organizations',
            applied: false,
          },
        ],
        intakeTakeaway:
          'The baseline pool is 2,140 AI leaders. Requiring foundation model training at 10,000+ GPU scale cuts it by 76%, to roughly 510. Pairing it with enterprise P&L ownership leaves under 150 executives globally.',
      },
      geography: {
        topHubs: [
          { metro: 'San Francisco Bay Area', region: 'California', candidateCount: 980, percentage: 46 },
          { metro: 'Seattle-Bellevue', region: 'Washington', candidateCount: 470, percentage: 22, isClientHQ: true },
          { metro: 'New York Metro Area', region: 'New York', candidateCount: 280, percentage: 13 },
          { metro: 'London', region: 'United Kingdom', candidateCount: 210, percentage: 10 },
          { metro: 'Boston Metro', region: 'Massachusetts', candidateCount: 200, percentage: 9 },
        ],
        workModel: { remote: 22, hybrid: 61, inOffice: 17 },
        clientRequirement: 'Hybrid, 2-3 days on-site in the Seattle area',
        intakeTakeaway:
          'Only 22% of qualified AI leaders live in the Seattle area, but 83% work remote or hybrid today. A hybrid policy with relocation support keeps the Bay Area cohort (46%) in play.',
      },
      sourceCompanies: {
        ...base.sourceCompanies,
        intakeTakeaway:
          'The top five labs and hyperscalers hold 27% of qualified AI VPs. Meta, Google DeepMind, and Anthropic are the richest clear targets. Verify non-solicitation terms for OpenAI before outbound sequencing.',
      },
      macroTenure: {
        ...base.macroTenure,
        averageTenureYears: 2.7,
        historicalCliffExitPercent: 71,
        vestingCliffWindowMonths: 'Months 30 to 42',
        intakeTakeaway:
          'AI leadership tenure averages 2.7 years. Prioritize leaders in months 30-42, where equity cliffs and reorganizations create the strongest openness to a move.',
      },
    };
  }

  const sourceId = roleCalibrationSource[role.id];
  if (sourceId && projectSearchIntelligenceMap[sourceId]) {
    return { ...projectSearchIntelligenceMap[sourceId], projectId: role.id, roleTitle: title };
  }

  return getSearchIntelligenceForProject(role.id, title);
}

// Fallback generator for any custom project
export function getSearchIntelligenceForProject(projectId: string, defaultTitle: string = 'Executive Search', company: string = 'Enterprise Target'): SearchIntelligenceData {
  if (projectSearchIntelligenceMap[projectId]) {
    return projectSearchIntelligenceMap[projectId];
  }

  // Sensible default calibrated for executive leadership searches
  return {
    projectId,
    roleTitle: defaultTitle,
    companyName: company,
    lastCalibratedDate: 'October 1, 2026',
    benchmarkSource: 'Phenom Market Intel & Executive Talent Analytics',

    compensation: {
      baseSalary: {
        p25: 325000,
        median: 395000,
        p75: 470000
      },
      totalCashOTE: {
        p25: 490000,
        median: 620000,
        p75: 780000
      },
      equityAnnualMedian: 350000,
      clientBudgetBase: 310000,
      clientBudgetOTE: 480000,
      intakeTakeaway: 'Market median base salary for this caliber is $395,000. Client budget at $310,000 creates a 22% friction point that will hinder conversion without equity adjustment.'
    },

    talentPool: {
      baselineTAM: 2450,
      titleBreakdown: [
        { title: defaultTitle, percentage: 58, count: 1421 },
        { title: `Senior Director`, percentage: 30, count: 735 },
        { title: `C-Level / Head of`, percentage: 12, count: 294 }
      ],
      interactiveFilters: [
        {
          id: 'filter-scale',
          label: 'Proven Public Enterprise Matrix Experience',
          impactPercent: -65,
          description: 'Must have managed 100+ headcount and multi-million P&L',
          applied: false
        },
        {
          id: 'filter-hybrid-domain',
          label: 'Domain Specific Hardware & Cloud Integration',
          impactPercent: -74,
          description: 'Narrows search to rare hybrid domain leaders',
          applied: false
        },
        {
          id: 'filter-pedigree',
          label: 'Top Tier Tier-1 Tech Background',
          impactPercent: -50,
          description: 'Prefers candidates from top 20 tech giants',
          applied: false
        }
      ],
      intakeTakeaway: 'Total addressable market starts at 2,450 leaders. Applying multiple restrictive filters reduces the viable pool to under 75 executives globally.'
    },

    geography: {
      topHubs: [
        { metro: 'San Francisco Bay Area', region: 'California', candidateCount: 980, percentage: 40, isClientHQ: true },
        { metro: 'New York Metro Area', region: 'New York', candidateCount: 590, percentage: 24 },
        { metro: 'Seattle-Bellevue', region: 'Washington', candidateCount: 340, percentage: 14 },
        { metro: 'Boston Metro', region: 'Massachusetts', candidateCount: 290, percentage: 12 },
        { metro: 'Austin Metro', region: 'Texas', candidateCount: 250, percentage: 10 }
      ],
      workModel: {
        remote: 32,
        hybrid: 54,
        inOffice: 14
      },
      clientRequirement: 'Hybrid 3 Days On-Site',
      intakeTakeaway: '86% of the talent pool is accustomed to hybrid or remote work. Preserving hybrid flexibility keeps 86% of the market accessible.'
    },

    sourceCompanies: {
      topTen: [
        { rank: 1, name: 'Salesforce', industry: 'Enterprise SaaS', candidateCount: 78, percentageOfCohort: 6.5, offLimitsStatus: 'Clear Target', cultureType: 'Tier-1 SaaS Public' },
        { rank: 2, name: 'Microsoft', industry: 'Cloud & Enterprise', candidateCount: 72, percentageOfCohort: 6.0, offLimitsStatus: 'Caution (Partner)', cultureType: 'Scale & Governance' },
        { rank: 3, name: 'Amazon / AWS', industry: 'Cloud Infrastructure', candidateCount: 65, percentageOfCohort: 5.4, offLimitsStatus: 'Clear Target', cultureType: 'High Accountability' },
        { rank: 4, name: 'Oracle', industry: 'Enterprise Systems', candidateCount: 58, percentageOfCohort: 4.8, offLimitsStatus: 'Clear Target', cultureType: 'Mature Corporate' },
        { rank: 5, name: 'Google', industry: 'Cloud Platforms', candidateCount: 52, percentageOfCohort: 4.3, offLimitsStatus: 'Clear Target', cultureType: 'Engineering Excellence' },
        { rank: 6, name: 'Snowflake', industry: 'Data Cloud', candidateCount: 45, percentageOfCohort: 3.8, offLimitsStatus: 'Clear Target', cultureType: 'High Growth' },
        { rank: 7, name: 'ServiceNow', industry: 'Workflows', candidateCount: 42, percentageOfCohort: 3.5, offLimitsStatus: 'Do Not Poach (Client)', cultureType: 'Enterprise Cloud' },
        { rank: 8, name: 'Cisco', industry: 'Networking & Security', candidateCount: 38, percentageOfCohort: 3.2, offLimitsStatus: 'Clear Target', cultureType: 'Enterprise Hardware' },
        { rank: 9, name: 'Palo Alto Networks', industry: 'Security Systems', candidateCount: 35, percentageOfCohort: 2.9, offLimitsStatus: 'Clear Target', cultureType: 'High Velocity' },
        { rank: 10, name: 'Workday', industry: 'HCM & Financials', candidateCount: 30, percentageOfCohort: 2.5, offLimitsStatus: 'Clear Target', cultureType: 'Enterprise Systems' }
      ],
      topFiveConcentrationPercent: 27.0,
      intakeTakeaway: 'Top 5 institutions hold 27% of available candidates. Verify any non-solicitation restrictions before initiating outbound sequencing.'
    },

    macroTenure: {
      averageTenureYears: 3.3,
      historicalCliffExitPercent: 69,
      vestingCliffWindowMonths: 'Months 32 to 44',
      flightRiskDistribution: [
        { tenureRange: '< 1 Year', percentage: 22, riskLevel: 'Low', description: 'Settling in role' },
        { tenureRange: '1.0 - 2.5 Years', percentage: 28, riskLevel: 'Moderate', description: 'Executing in seat' },
        { tenureRange: '2.5 - 3.8 Years', percentage: 36, riskLevel: 'Peak Opportunity', description: 'Vesting cliff approach window' },
        { tenureRange: '3.8+ Years', percentage: 14, riskLevel: 'High', description: 'Vested and highly mobile' }
      ],
      intakeTakeaway: 'Average tenure is 3.3 years. Prioritize outreach to the 36% of leaders who entered their 3rd year in seat.'
    }
  };
}
