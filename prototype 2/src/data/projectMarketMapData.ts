import { Project } from '../types';

export interface MappedExecutive {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: string;
  companyId: string;
  companyName: string;
  location: string;
  metroArea: string;
  tenureYears: number;
  tenureFormatted: string;
  previousPedigree: string;
  mobilityScore: number; // 0-100 (Executive Mobility Indicator / PTM)
  mobilityLevel: 'High' | 'Moderate' | 'Low';
  mobilityCatalyst: string;
  matchScore: number; // 0-100
  archetypeMatch: string;
  estimatedComp: {
    baseSalary: string;
    totalCash: string;
    equity: string;
  };
  outreachStatus: 'Clear Target' | 'Pipelined' | 'Approached' | 'In Dialogue' | 'Benchmark Only' | 'Off-Limits';
  confidentialNotes: string;
  reportsTo?: string;
  candidateId?: string; // Link to candidate in CRM if exists
}

export interface OrgNodeData {
  id: string;
  name: string;
  title: string;
  level: 'CEO' | 'C-Suite' | 'EVP' | 'SVP' | 'VP' | 'Director' | 'Board';
  avatarUrl?: string;
  isMappedCandidate?: boolean;
  candidateId?: string;
  mobilityScore?: number;
  matchScore?: number;
  tenure?: string;
  department?: string;
  reportsTo?: string;
  status?: string;
  children?: OrgNodeData[];
}

export interface MappedCompany {
  id: string;
  name: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
  tierLabel: string;
  tierDescription: string;
  industry: string;
  stage: string;
  headquarters: string;
  employeeCount: string;
  revenueScale: string;
  poachStatus: 'Clear Target' | 'Restricted (Board)' | 'Do Not Poach (Client)' | 'Caution (Commercial Partner)';
  poachReason?: string;
  executivesCount: number;
  executives: MappedExecutive[];
  strategicRationale: string;
  companyId?: string; // Link to company in CRM if exists
  orgChart?: OrgNodeData;
}

export interface ProjectMarketMapData {
  projectId: string;
  mandateTitle: string;
  clientName: string;
  leadRecruiter: string;
  lastUpdated: string;
  calibrationDate: string;
  scopeSummary: {
    totalCompaniesMapped: number;
    totalExecutivesMapped: number;
    clearTargetsCount: number;
    offLimitsCount: number;
    averageMobilityScore: number;
    averageMatchScore: number;
    primaryGeography: string;
    targetARRRange: string;
    targetBaseBenchmark: string;
  };
  tiers: {
    tierId: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
    name: string;
    description: string;
    companiesCount: number;
    executivesCount: number;
  }[];
  companies: MappedCompany[];
}

// -------------------------------------------------------------
// CFO Search Market Map Data (Project p-1)
// -------------------------------------------------------------
const cfoMarketMapCompanies: MappedCompany[] = [
  // --- TIER 1: Direct Scale Competitors & Pre-IPO Financial Peers ---
  {
    id: 'mm-comp-stripe',
    name: 'Stripe',
    companyId: 'comp-stripe',
    tier: 'Tier 1',
    tierLabel: 'Tier 1 — Direct Scale Competitors & Pre-IPO Peers',
    tierDescription: 'High-growth fintech & enterprise infrastructure leaders operating at comparable scale and technical complexity.',
    industry: 'Financial Technology & Cloud Infrastructure',
    stage: 'Late Stage / Pre-IPO ($1.8B+ ARR)',
    headquarters: 'South San Francisco, CA',
    employeeCount: '8,000+ FTEs',
    revenueScale: '$1.8B+ ARR',
    poachStatus: 'Clear Target',
    executivesCount: 3,
    strategicRationale: 'Gold standard capital markets discipline; recent leadership transition discussions create opportune timing for executive outreach.',
    executives: [
      {
        id: 'mm-exec-1',
        name: 'Sarah Sandberg',
        firstName: 'Sarah',
        lastName: 'Sandberg',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80',
        role: 'Chief Financial Officer',
        companyId: 'mm-comp-stripe',
        companyName: 'Stripe',
        location: 'South San Francisco, CA',
        metroArea: 'San Francisco Bay Area',
        tenureYears: 4.2,
        tenureFormatted: '4.2 yrs',
        previousPedigree: 'Ex-Morgan Stanley TMT, ex-Google Corporate Finance',
        mobilityScore: 95,
        mobilityLevel: 'High',
        mobilityCatalyst: 'Initial 4-year equity vesting cliff reached Q3; public listing timeline postponed creating executive friction.',
        matchScore: 98,
        archetypeMatch: 'Pre-IPO Capital Markets & Multi-Product Scale',
        estimatedComp: {
          baseSalary: '$480,000',
          totalCash: '$780,000',
          equity: '$550,000 / yr'
        },
        outreachStatus: 'In Dialogue',
        confidentialNotes: 'Discreet initial coffee completed. Highly receptive to standalone pre-IPO mandates with significant board exposure and governance authority.',
        reportsTo: 'CEO & Board Audit Committee',
        candidateId: 'c-1'
      },
      {
        id: 'mm-exec-2',
        name: 'Michael Chang',
        firstName: 'Michael',
        lastName: 'Chang',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
        role: 'VP of Global Financial Operations & Treasury',
        companyId: 'mm-comp-stripe',
        companyName: 'Stripe',
        location: 'San Francisco, CA',
        metroArea: 'San Francisco Bay Area',
        tenureYears: 3.5,
        tenureFormatted: '3.5 yrs',
        previousPedigree: 'Ex-Goldman Sachs, ex-Adyen Head of Finance',
        mobilityScore: 84,
        mobilityLevel: 'Moderate',
        mobilityCatalyst: 'Seeking first-time CFO chair; passed over for external COO hire.',
        matchScore: 91,
        archetypeMatch: 'Operational Scale & Global Liquidity Architect',
        estimatedComp: {
          baseSalary: '$410,000',
          totalCash: '$620,000',
          equity: '$380,000 / yr'
        },
        outreachStatus: 'Clear Target',
        confidentialNotes: 'Exceptional technical accounting and balance sheet scale. Needs seasoned IR coach for investor roadshow readiness.',
        reportsTo: 'CFO (Sarah Sandberg)'
      },
      {
        id: 'mm-exec-3',
        name: 'Elena Cruz',
        firstName: 'Elena',
        lastName: 'Cruz',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80',
        role: 'Chief Accounting Officer & VP Tax',
        companyId: 'mm-comp-stripe',
        companyName: 'Stripe',
        location: 'San Francisco, CA',
        metroArea: 'San Francisco Bay Area',
        tenureYears: 2.8,
        tenureFormatted: '2.8 yrs',
        previousPedigree: 'Ex-PwC Partner, ex-Workday Corporate Controller',
        mobilityScore: 78,
        mobilityLevel: 'Moderate',
        mobilityCatalyst: 'Stable in seat; open to advisory or CFO progression in 12-18 months.',
        matchScore: 86,
        archetypeMatch: 'Technical SOX & SEC Reporting Authority',
        estimatedComp: {
          baseSalary: '$385,000',
          totalCash: '$540,000',
          equity: '$320,000 / yr'
        },
        outreachStatus: 'Benchmark Only',
        confidentialNotes: 'Valuable calibration benchmark for SOX readiness and S-1 preparation timeline.',
        reportsTo: 'CFO'
      }
    ]
  },
  {
    id: 'mm-comp-datadog',
    name: 'Datadog',
    companyId: 'comp-datadog',
    tier: 'Tier 1',
    tierLabel: 'Tier 1 — Direct Scale Competitors & Pre-IPO Peers',
    tierDescription: 'High-growth fintech & enterprise infrastructure leaders operating at comparable scale and technical complexity.',
    industry: 'Cloud Monitoring & Observability',
    stage: 'Public Enterprise ($40B Market Cap)',
    headquarters: 'New York, NY',
    employeeCount: '5,500+ FTEs',
    revenueScale: '$2.5B+ ARR',
    poachStatus: 'Clear Target',
    executivesCount: 2,
    strategicRationale: 'Best-in-class multi-product enterprise SaaS metrics; proven Wall Street credibility in software subscription economics.',
    executives: [
      {
        id: 'mm-exec-4',
        name: 'David Sterling',
        firstName: 'David',
        lastName: 'Sterling',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&q=80',
        role: 'SVP of Strategic Finance & Investor Relations',
        companyId: 'mm-comp-datadog',
        companyName: 'Datadog',
        location: 'New York, NY',
        metroArea: 'New York Metro Area',
        tenureYears: 5.1,
        tenureFormatted: '5.1 yrs',
        previousPedigree: 'Ex-Twilio VP Finance, ex-Morgan Stanley Equity Research',
        mobilityScore: 92,
        mobilityLevel: 'High',
        mobilityCatalyst: 'Completed post-IPO transformation; actively evaluating venture-backed pre-IPO CFO chairs.',
        matchScore: 96,
        archetypeMatch: 'Public Market Communicator & Wall Street Anchor',
        estimatedComp: {
          baseSalary: '$440,000',
          totalCash: '$700,000',
          equity: '$500,000 / yr'
        },
        outreachStatus: 'Pipelined',
        confidentialNotes: 'Currently in Opportunity Room discussions. Deeply calibrated on SaaS retention and gross margin expansion.',
        reportsTo: 'CFO',
        candidateId: 'c-3'
      },
      {
        id: 'mm-exec-5',
        name: 'Rachel Weiss',
        firstName: 'Rachel',
        lastName: 'Weiss',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
        role: 'VP of Financial Planning & Analysis (FP&A)',
        companyId: 'mm-comp-datadog',
        companyName: 'Datadog',
        location: 'New York, NY',
        metroArea: 'New York Metro Area',
        tenureYears: 3.1,
        tenureFormatted: '3.1 yrs',
        previousPedigree: 'Ex-McKinsey Principal, ex-Salesforce Director Strategic Finance',
        mobilityScore: 82,
        mobilityLevel: 'Moderate',
        mobilityCatalyst: 'Ready for enterprise CFO step-up; relocation to West Coast feasible.',
        matchScore: 89,
        archetypeMatch: 'Quantitative SaaS Modeler & Unit Economics Specialist',
        estimatedComp: {
          baseSalary: '$375,000',
          totalCash: '$560,000',
          equity: '$310,000 / yr'
        },
        outreachStatus: 'Clear Target',
        confidentialNotes: 'High strategic pedigree. Built Datadog real-time pricing and consumption revenue models.',
        reportsTo: 'SVP Finance'
      }
    ]
  },
  {
    id: 'mm-comp-snowflake',
    name: 'Snowflake',
    companyId: 'comp-snowflake',
    tier: 'Tier 1',
    tierLabel: 'Tier 1 — Direct Scale Competitors & Pre-IPO Peers',
    tierDescription: 'High-growth fintech & enterprise infrastructure leaders operating at comparable scale and technical complexity.',
    industry: 'Cloud Data Platform & Analytics',
    stage: 'Public Enterprise ($55B Market Cap)',
    headquarters: 'Bozeman, MT / San Mateo, CA',
    employeeCount: '7,000+ FTEs',
    revenueScale: '$3.2B+ ARR',
    poachStatus: 'Clear Target',
    executivesCount: 2,
    strategicRationale: 'World-class consumption model finance playbook; seasoned executive bench trained under premier leadership.',
    executives: [
      {
        id: 'mm-exec-6',
        name: 'David Vance',
        firstName: 'David',
        lastName: 'Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
        role: 'SVP of Global Finance & Strategy',
        companyId: 'mm-comp-snowflake',
        companyName: 'Snowflake',
        location: 'San Mateo, CA',
        metroArea: 'San Francisco Bay Area',
        tenureYears: 4.8,
        tenureFormatted: '4.8 yrs',
        previousPedigree: 'Ex-ServiceNow VP Finance, ex-Goldman Sachs Executive Director',
        mobilityScore: 94,
        mobilityLevel: 'High',
        mobilityCatalyst: 'Executive retention package fully amortized; keen to lead enterprise search into public debut.',
        matchScore: 97,
        archetypeMatch: 'Hypergrowth Scale Operator & Consumption Economics Architect',
        estimatedComp: {
          baseSalary: '$460,000',
          totalCash: '$750,000',
          equity: '$600,000 / yr'
        },
        outreachStatus: 'Approached',
        confidentialNotes: 'First confidential screening call held. Highly impressed by our unit economics and enterprise pipeline.',
        reportsTo: 'Chief Financial Officer'
      },
      {
        id: 'mm-exec-7',
        name: 'Marcus Vance',
        firstName: 'Marcus',
        lastName: 'Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&q=80',
        role: 'VP of Corporate FP&A & Revenue Operations',
        companyId: 'mm-comp-snowflake',
        companyName: 'Snowflake',
        location: 'San Mateo, CA',
        metroArea: 'San Francisco Bay Area',
        tenureYears: 3.2,
        tenureFormatted: '3.2 yrs',
        previousPedigree: 'Ex-VMware Director Corporate Planning, Harvard MBA',
        mobilityScore: 88,
        mobilityLevel: 'High',
        mobilityCatalyst: 'Strong flight risk due to recent organizational realignment in RevOps.',
        matchScore: 90,
        archetypeMatch: 'RevOps Integration & Capital Allocator',
        estimatedComp: {
          baseSalary: '$395,000',
          totalCash: '$590,000',
          equity: '$350,000 / yr'
        },
        outreachStatus: 'Clear Target',
        confidentialNotes: 'Proven ability to partner closely with CRO and Go-To-Market field teams.',
        reportsTo: 'SVP Global Finance'
      }
    ]
  },

  // --- TIER 2: Adjacent Industry & Ecosystem Leaders ---
  {
    id: 'mm-comp-servicenow',
    name: 'ServiceNow',
    companyId: 'comp-servicenow',
    tier: 'Tier 2',
    tierLabel: 'Tier 2 — Adjacent Industry & Ecosystem Leaders',
    tierDescription: 'Proven enterprise SaaS platforms with mature operational rigor, robust cash flow, and public governance discipline.',
    industry: 'Enterprise Cloud Workflow Platform',
    stage: 'Mega-Cap Public ($160B Market Cap)',
    headquarters: 'Santa Clara, CA',
    employeeCount: '22,000+ FTEs',
    revenueScale: '$10B+ ARR',
    poachStatus: 'Clear Target',
    executivesCount: 2,
    strategicRationale: 'Phenomenal leadership academy; executives carry deep enterprise selling metrics, margin discipline, and board presentation excellence.',
    executives: [
      {
        id: 'mm-exec-8',
        name: 'Jennifer Wu',
        firstName: 'Jennifer',
        lastName: 'Wu',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80',
        role: 'VP of Finance, Enterprise Cloud Solutions',
        companyId: 'mm-comp-servicenow',
        companyName: 'ServiceNow',
        location: 'Santa Clara, CA',
        metroArea: 'San Francisco Bay Area',
        tenureYears: 5.6,
        tenureFormatted: '5.6 yrs',
        previousPedigree: 'Ex-Cisco Finance Director, Stanford GSB',
        mobilityScore: 91,
        mobilityLevel: 'High',
        mobilityCatalyst: 'Tenure exceeds company average; ready to transition from business-unit finance to enterprise CFO chair.',
        matchScore: 94,
        archetypeMatch: 'Enterprise Profitability & Governance Specialist',
        estimatedComp: {
          baseSalary: '$430,000',
          totalCash: '$680,000',
          equity: '$450,000 / yr'
        },
        outreachStatus: 'Approached',
        confidentialNotes: 'Peer-recommended by board member. Stellar reputation for operational efficiency and cross-functional leadership.',
        reportsTo: 'EVP Corporate Controller'
      },
      {
        id: 'mm-exec-9',
        name: 'Robert Vance',
        firstName: 'Robert',
        lastName: 'Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80',
        role: 'EVP & Global Corporate Controller',
        companyId: 'mm-comp-servicenow',
        companyName: 'ServiceNow',
        location: 'Santa Clara, CA',
        metroArea: 'San Francisco Bay Area',
        tenureYears: 6.2,
        tenureFormatted: '6.2 yrs',
        previousPedigree: 'Ex-Deloitte Audit Partner, ex-Oracle VP Accounting',
        mobilityScore: 65,
        mobilityLevel: 'Low',
        mobilityCatalyst: 'Highly compensated in current seat; would require transformative equity package to dislodge.',
        matchScore: 88,
        archetypeMatch: 'Institutional Fiduciary & SOX Controller',
        estimatedComp: {
          baseSalary: '$490,000',
          totalCash: '$820,000',
          equity: '$650,000 / yr'
        },
        outreachStatus: 'Benchmark Only',
        confidentialNotes: 'Valuable reference source for tier-2 direct reports; low probability of mobility.',
        reportsTo: 'Chief Financial Officer'
      }
    ]
  },
  {
    id: 'mm-comp-workday',
    name: 'Workday',
    companyId: 'comp-workday',
    tier: 'Tier 2',
    tierLabel: 'Tier 2 — Adjacent Industry & Ecosystem Leaders',
    tierDescription: 'Proven enterprise SaaS platforms with mature operational rigor, robust cash flow, and public governance discipline.',
    industry: 'Enterprise Cloud ERP & Human Capital',
    stage: 'Large-Cap Public ($70B Market Cap)',
    headquarters: 'Pleasanton, CA',
    employeeCount: '18,000+ FTEs',
    revenueScale: '$7.5B+ ARR',
    poachStatus: 'Clear Target',
    executivesCount: 2,
    strategicRationale: 'Direct understanding of Human Capital and Financial Management enterprise customer psychology.',
    executives: [
      {
        id: 'mm-exec-10',
        name: 'Thomas Klein',
        firstName: 'Thomas',
        lastName: 'Klein',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80',
        role: 'SVP of Corporate Finance & Treasury',
        companyId: 'mm-comp-workday',
        companyName: 'Workday',
        location: 'Pleasanton, CA',
        metroArea: 'San Francisco Bay Area',
        tenureYears: 4.1,
        tenureFormatted: '4.1 yrs',
        previousPedigree: 'Ex-SAP VP Finance, Wharton MBA',
        mobilityScore: 87,
        mobilityLevel: 'High',
        mobilityCatalyst: 'Desires smaller, agile organization with aggressive pre-IPO upside.',
        matchScore: 93,
        archetypeMatch: 'ERP Scaler & Capital Structure Engineer',
        estimatedComp: {
          baseSalary: '$420,000',
          totalCash: '$670,000',
          equity: '$420,000 / yr'
        },
        outreachStatus: 'Clear Target',
        confidentialNotes: 'Deep network with major institutional debt lenders and rating agencies.',
        reportsTo: 'Chief Financial Officer'
      },
      {
        id: 'mm-exec-11',
        name: 'Karen Patel',
        firstName: 'Karen',
        lastName: 'Patel',
        avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&q=80',
        role: 'VP of Commercial Finance & GTM Strategy',
        companyId: 'mm-comp-workday',
        companyName: 'Workday',
        location: 'San Francisco, CA',
        metroArea: 'San Francisco Bay Area',
        tenureYears: 2.9,
        tenureFormatted: '2.9 yrs',
        previousPedigree: 'Ex-Boston Consulting Group, ex-Box Director Finance',
        mobilityScore: 80,
        mobilityLevel: 'Moderate',
        mobilityCatalyst: 'Seeking strategic seat with broad portfolio authority.',
        matchScore: 87,
        archetypeMatch: 'GTM Strategy & Commercial Pricing Innovator',
        estimatedComp: {
          baseSalary: '$370,000',
          totalCash: '$540,000',
          equity: '$290,000 / yr'
        },
        outreachStatus: 'Clear Target',
        confidentialNotes: 'Dynamic communicator; excels at field alignment with sales leadership.',
        reportsTo: 'SVP Corporate Finance'
      }
    ]
  },

  // --- TIER 3: High-Growth Scale-Ups & Disruptors ---
  {
    id: 'mm-comp-scaleai',
    name: 'Scale AI',
    companyId: 'comp-scaleai',
    tier: 'Tier 3',
    tierLabel: 'Tier 3 — High-Growth Scale-Up Disruptors',
    tierDescription: 'Fast-moving, high-valuation scale-ups navigating extreme revenue velocity, multi-tiered capital rounds, and modern AI unit economics.',
    industry: 'Artificial Intelligence Infrastructure',
    stage: 'Late Stage Unicorn ($14B Valuation)',
    headquarters: 'San Francisco, CA',
    employeeCount: '1,200+ FTEs',
    revenueScale: '$800M ARR',
    poachStatus: 'Clear Target',
    executivesCount: 2,
    strategicRationale: 'Cutting-edge AI operational infrastructure and complex government/enterprise contract structuring.',
    executives: [
      {
        id: 'mm-exec-12',
        name: 'Brian Miller',
        firstName: 'Brian',
        lastName: 'Miller',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&q=80',
        role: 'Head of Strategic Finance & Capital Markets',
        companyId: 'mm-comp-scaleai',
        companyName: 'Scale AI',
        location: 'San Francisco, CA',
        metroArea: 'San Francisco Bay Area',
        tenureYears: 2.7,
        tenureFormatted: '2.7 yrs',
        previousPedigree: 'Ex-Goldman Sachs TMT VP, ex-Uber Strategic Finance',
        mobilityScore: 89,
        mobilityLevel: 'High',
        mobilityCatalyst: 'High work intensity; looking for established pre-IPO environment with mature work-life balance.',
        matchScore: 92,
        archetypeMatch: 'Modern AI Unit Economics & Venture Capital Syndicator',
        estimatedComp: {
          baseSalary: '$390,000',
          totalCash: '$610,000',
          equity: '$450,000 / yr'
        },
        outreachStatus: 'Clear Target',
        confidentialNotes: 'Orchestrated recent $1B financing round. Incredible financial modeling prowess.',
        reportsTo: 'CEO'
      },
      {
        id: 'mm-exec-13',
        name: 'Sophia Chen',
        firstName: 'Sophia',
        lastName: 'Chen',
        avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&h=150&fit=crop&q=80',
        role: 'VP of Finance & Operations',
        companyId: 'mm-comp-scaleai',
        companyName: 'Scale AI',
        location: 'San Francisco, CA',
        metroArea: 'San Francisco Bay Area',
        tenureYears: 3.4,
        tenureFormatted: '3.4 yrs',
        previousPedigree: 'Ex-Bain & Company, ex-Airbnb FP&A Lead',
        mobilityScore: 93,
        mobilityLevel: 'High',
        mobilityCatalyst: 'Approaching complete initial grant vesting; open to top-tier search conversation.',
        matchScore: 95,
        archetypeMatch: 'Hypergrowth Operator & S-1 Ready Builder',
        estimatedComp: {
          baseSalary: '$415,000',
          totalCash: '$650,000',
          equity: '$480,000 / yr'
        },
        outreachStatus: 'Pipelined',
        confidentialNotes: 'Dual background in corporate strategy and financial engineering. Highly polished executive presence.',
        reportsTo: 'CEO'
      }
    ]
  },
  {
    id: 'mm-comp-rippling',
    name: 'Rippling',
    companyId: 'comp-rippling',
    tier: 'Tier 3',
    tierLabel: 'Tier 3 — High-Growth Scale-Up Disruptors',
    tierDescription: 'Fast-moving, high-valuation scale-ups navigating extreme revenue velocity, multi-tiered capital rounds, and modern AI unit economics.',
    industry: 'Unified Workforce & Payroll Platform',
    stage: 'Late Stage Unicorn ($13.5B Valuation)',
    headquarters: 'San Francisco, CA',
    employeeCount: '2,500+ FTEs',
    revenueScale: '$500M+ ARR',
    poachStatus: 'Clear Target',
    executivesCount: 1,
    strategicRationale: 'Compound software architecture and rigorous financial operating rhythm.',
    executives: [
      {
        id: 'mm-exec-14',
        name: 'Alex Rivera',
        firstName: 'Alex',
        lastName: 'Rivera',
        avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&h=150&fit=crop&q=80',
        role: 'VP of Financial Planning & Strategic Capital',
        companyId: 'mm-comp-rippling',
        companyName: 'Rippling',
        location: 'San Francisco, CA',
        metroArea: 'San Francisco Bay Area',
        tenureYears: 3.8,
        tenureFormatted: '3.8 yrs',
        previousPedigree: 'Ex-Zenefits Director Finance, ex-KPMG M&A Advisor',
        mobilityScore: 86,
        mobilityLevel: 'High',
        mobilityCatalyst: 'Seeking autonomous CFO mantle with public board exposure.',
        matchScore: 89,
        archetypeMatch: 'Compound Software Metrology & Efficiency Driver',
        estimatedComp: {
          baseSalary: '$385,000',
          totalCash: '$590,000',
          equity: '$380,000 / yr'
        },
        outreachStatus: 'Clear Target',
        confidentialNotes: 'Mastery over compound customer acquisition economics and multi-product CAC/LTV.',
        reportsTo: 'Chief Financial Officer'
      }
    ]
  },

  // --- TIER 4: Leadership Academies & Operational Incubators ---
  {
    id: 'mm-comp-alphabet',
    name: 'Alphabet (Google)',
    companyId: 'comp-google',
    tier: 'Tier 4',
    tierLabel: 'Tier 4 — Leadership Academies & Corporate Incubators',
    tierDescription: 'Institutional technology titans where executives develop supreme governance, global treasury scale, and fiduciary mastery.',
    industry: 'Hyperscale Cloud & Digital Services',
    stage: 'Mega-Cap Public ($2.1T Market Cap)',
    headquarters: 'Mountain View, CA',
    employeeCount: '180,000+ FTEs',
    revenueScale: '$300B+ Revenue',
    poachStatus: 'Restricted (Board)',
    poachReason: 'Active commercial alliance & board relationship covenant requires confidential audit committee approval prior to formal interview.',
    executivesCount: 2,
    strategicRationale: 'Unrivaled depth of capital allocation and fiduciary governance; source for audit committee advisor or calibrated candidate.',
    executives: [
      {
        id: 'mm-exec-15',
        name: 'Lisa Martinez',
        firstName: 'Lisa',
        lastName: 'Martinez',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
        role: 'Senior Director, Corporate Finance & Alphabet Capital',
        companyId: 'mm-comp-alphabet',
        companyName: 'Alphabet (Google)',
        location: 'Mountain View, CA',
        metroArea: 'San Francisco Bay Area',
        tenureYears: 7.2,
        tenureFormatted: '7.2 yrs',
        previousPedigree: 'Ex-Morgan Stanley Managing Director, Stanford MBA',
        mobilityScore: 74,
        mobilityLevel: 'Moderate',
        mobilityCatalyst: 'Board-restricted; would require written protocol waiver.',
        matchScore: 92,
        archetypeMatch: 'Hyperscale Capital Allocator & Treasury Commander',
        estimatedComp: {
          baseSalary: '$490,000',
          totalCash: '$850,000',
          equity: '$800,000 / yr'
        },
        outreachStatus: 'Off-Limits',
        confidentialNotes: 'Candidate flagged as RESTRICTED due to board commercial partnership covenant. Kept on map for market calibration benchmark only.',
        reportsTo: 'VP Alphabet Finance'
      },
      {
        id: 'mm-exec-16',
        name: 'Daniel Morgan',
        firstName: 'Daniel',
        lastName: 'Morgan',
        avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&q=80',
        role: 'Finance Director, Google Cloud Enterprise',
        companyId: 'mm-comp-alphabet',
        companyName: 'Alphabet (Google)',
        location: 'Sunnyvale, CA',
        metroArea: 'San Francisco Bay Area',
        tenureYears: 4.5,
        tenureFormatted: '4.5 yrs',
        previousPedigree: 'Ex-AWS Finance Manager, Harvard Business School',
        mobilityScore: 81,
        mobilityLevel: 'Moderate',
        mobilityCatalyst: 'Board covenant review pending.',
        matchScore: 88,
        archetypeMatch: 'Cloud Infrastructure P&L Operator',
        estimatedComp: {
          baseSalary: '$410,000',
          totalCash: '$660,000',
          equity: '$520,000 / yr'
        },
        outreachStatus: 'Off-Limits',
        confidentialNotes: 'Flagged for client legal clearance before initiating direct recruiter contact.',
        reportsTo: 'Senior Director Cloud Finance'
      }
    ]
  },
  {
    id: 'mm-comp-microsoft',
    name: 'Microsoft',
    companyId: 'comp-microsoft',
    tier: 'Tier 4',
    tierLabel: 'Tier 4 — Leadership Academies & Corporate Incubators',
    tierDescription: 'Institutional technology titans where executives develop supreme governance, global treasury scale, and fiduciary mastery.',
    industry: 'Enterprise Software & Hyperscale Cloud',
    stage: 'Mega-Cap Public ($3.1T Market Cap)',
    headquarters: 'Redmond, WA',
    employeeCount: '220,000+ FTEs',
    revenueScale: '$240B+ Revenue',
    poachStatus: 'Clear Target',
    executivesCount: 1,
    strategicRationale: 'Institutional financial discipline and enterprise subscription monetization.',
    executives: [
      {
        id: 'mm-exec-17',
        name: 'Andrew Bennett',
        firstName: 'Andrew',
        lastName: 'Bennett',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
        role: 'General Manager & VP, Global Commercial Finance',
        companyId: 'mm-comp-microsoft',
        companyName: 'Microsoft',
        location: 'Bellevue, WA',
        metroArea: 'Seattle-Bellevue',
        tenureYears: 6.8,
        tenureFormatted: '6.8 yrs',
        previousPedigree: 'Ex-Arthur Andersen Senior Manager, Northwestern Kellogg MBA',
        mobilityScore: 85,
        mobilityLevel: 'High',
        mobilityCatalyst: 'Looking for pre-IPO breakout opportunity before retirement phase; open to Bay Area hybrid rhythm.',
        matchScore: 91,
        archetypeMatch: 'Global Enterprise Deal Desk & Fiduciary Dean',
        estimatedComp: {
          baseSalary: '$440,000',
          totalCash: '$730,000',
          equity: '$550,000 / yr'
        },
        outreachStatus: 'Clear Target',
        confidentialNotes: 'Exceptional enterprise contracting experience; oversaw $5B+ multi-year Azure commercial commitments.',
        reportsTo: 'Corporate VP Finance'
      }
    ]
  }
];

// Helper to calculate summary metrics
function computeScopeSummary(companies: MappedCompany[], project: Project) {
  let totalExecs = 0;
  let clearTargets = 0;
  let offLimits = 0;
  let sumMobility = 0;
  let sumMatch = 0;

  companies.forEach(comp => {
    totalExecs += comp.executives.length;
    if (comp.poachStatus === 'Clear Target') clearTargets++;
    if (comp.poachStatus.includes('Restricted') || comp.poachStatus.includes('Do Not Poach')) offLimits++;

    comp.executives.forEach(exec => {
      sumMobility += exec.mobilityScore;
      sumMatch += exec.matchScore;
    });
  });

  const avgMobility = totalExecs > 0 ? Math.round(sumMobility / totalExecs) : 85;
  const avgMatch = totalExecs > 0 ? Math.round(sumMatch / totalExecs) : 92;

  const targetBase = project.parameters?.targetBaseSalary 
    ? `$${Math.round(project.parameters.targetBaseSalary / 1000)}k Base / $${Math.round((project.parameters.maxTotalCompensationCeiling || 900000) / 1000)}k OTE`
    : '$435k Base / $725k OTE';

  return {
    totalCompaniesMapped: companies.length,
    totalExecutivesMapped: totalExecs,
    clearTargetsCount: clearTargets,
    offLimitsCount: offLimits,
    averageMobilityScore: avgMobility,
    averageMatchScore: avgMatch,
    primaryGeography: project.parameters?.targetMetropolitanMarkets?.join(', ') || 'SF Bay Area · New York · Seattle',
    targetARRRange: project.parameters?.targetCompanyStage || '$150M – $1B ARR',
    targetBaseBenchmark: targetBase
  };
}

function computeTiers(companies: MappedCompany[]) {
  const tierConfigs = [
    {
      tierId: 'Tier 1' as const,
      name: 'Tier 1 — Direct Scale Competitors & Peers',
      description: 'Exact domain and scale peers with proven ARR velocity and business model parallels.'
    },
    {
      tierId: 'Tier 2' as const,
      name: 'Tier 2 — Adjacent Industry & Ecosystem Leaders',
      description: 'Established enterprise SaaS leaders with proven operational rigor and multi-product maturity.'
    },
    {
      tierId: 'Tier 3' as const,
      name: 'Tier 3 — High-Growth Scale-Up Disruptors',
      description: 'High-velocity unicorns with pre-IPO rigor, disruptive business models, and agile leadership.'
    },
    {
      tierId: 'Tier 4' as const,
      name: 'Tier 4 — Leadership Academies & Incubators',
      description: 'Institutional technology titans where executives develop supreme governance and fiduciary discipline.'
    }
  ];

  return tierConfigs.map(tc => {
    const matchedComps = companies.filter(c => c.tier === tc.tierId);
    const execsCount = matchedComps.reduce((acc, c) => acc + c.executives.length, 0);
    return {
      tierId: tc.tierId,
      name: tc.name,
      description: tc.description,
      companiesCount: matchedComps.length,
      executivesCount: execsCount
    };
  });
}

// -------------------------------------------------------------
// Dynamic Generator for any project
// -------------------------------------------------------------
export function getMarketMapForProject(project: Project): ProjectMarketMapData {
  const isCFO = (project.title || '').toLowerCase().includes('cfo') || (project.title || '').toLowerCase().includes('finance');

  // If p-1 or CFO, return rich CFO dataset
  if (isCFO || project.id === 'p-1') {
    const scopeSummary = computeScopeSummary(cfoMarketMapCompanies, project);
    const tiers = computeTiers(cfoMarketMapCompanies);
    return {
      projectId: project.id,
      mandateTitle: project.title,
      clientName: project.company || 'Executive Search Practice',
      leadRecruiter: project.leadRecruiter || 'Brian Stepan',
      lastUpdated: 'October 12, 2026',
      calibrationDate: 'Q3/Q4 2026 Mandate Calibration',
      scopeSummary,
      tiers,
      companies: cfoMarketMapCompanies
    };
  }

  // Dynamic Generator for Engineering / Product / Other searches (e.g. VP of Engineering)
  const isEng = (project.title || '').toLowerCase().includes('engineer') || (project.title || '').toLowerCase().includes('tech');
  
  const targetRoleName = project.title || 'Executive Mandate';
  const roleKeywords = isEng ? 'Engineering & Systems' : 'Product & Strategy';

  const generatedCompanies: MappedCompany[] = [
    {
      id: `mm-comp-${project.id}-1`,
      name: 'Datadog',
      tier: 'Tier 1',
      tierLabel: 'Tier 1 — Direct Scale Competitors & Peers',
      tierDescription: 'Direct market peers operating at comparable scale and technical complexity.',
      industry: 'Cloud Infrastructure & Observability',
      stage: 'Public Enterprise ($40B Market Cap)',
      headquarters: 'New York, NY',
      employeeCount: '5,500+ FTEs',
      revenueScale: '$2.5B+ ARR',
      poachStatus: 'Clear Target',
      executivesCount: 2,
      strategicRationale: 'Direct architectural alignment with high-concurrency streaming infrastructure.',
      executives: [
        {
          id: `mm-exec-${project.id}-1`,
          name: isEng ? 'Dr. Marcus Vance' : 'David Sterling',
          firstName: isEng ? 'Marcus' : 'David',
          lastName: isEng ? 'Vance' : 'Sterling',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
          role: isEng ? 'VP of Infrastructure Engineering' : 'VP of Product Management',
          companyId: `mm-comp-${project.id}-1`,
          companyName: 'Datadog',
          location: 'New York, NY',
          metroArea: 'New York Metro Area',
          tenureYears: 4.1,
          tenureFormatted: '4.1 yrs',
          previousPedigree: 'Ex-Google Brain, MIT PhD',
          mobilityScore: 94,
          mobilityLevel: 'High',
          mobilityCatalyst: 'Initial equity grant vesting cliff reached Q3; actively exploring next leadership step.',
          matchScore: 96,
          archetypeMatch: isEng ? 'Distributed Systems Architect' : 'Product Scale Executive',
          estimatedComp: {
            baseSalary: '$440,000',
            totalCash: '$660,000',
            equity: '$520,000 / yr'
          },
          outreachStatus: 'In Dialogue',
          confidentialNotes: 'Exceptional domain depth. Highly rated by engineering peers.',
          reportsTo: 'CTO'
        },
        {
          id: `mm-exec-${project.id}-2`,
          name: 'Sarah Chen',
          firstName: 'Sarah',
          lastName: 'Chen',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80',
          role: isEng ? 'Senior Director of Platform Reliability' : 'Director of Enterprise Product',
          companyId: `mm-comp-${project.id}-1`,
          companyName: 'Datadog',
          location: 'San Francisco, CA',
          metroArea: 'San Francisco Bay Area',
          tenureYears: 3.2,
          tenureFormatted: '3.2 yrs',
          previousPedigree: 'Ex-AWS Principal Engineer, Stanford MS',
          mobilityScore: 88,
          mobilityLevel: 'High',
          mobilityCatalyst: 'Passed over for VP promotion; receptive to external advancement.',
          matchScore: 92,
          archetypeMatch: isEng ? 'High-Availability Scaler' : 'Enterprise Solutions Driver',
          estimatedComp: {
            baseSalary: '$390,000',
            totalCash: '$570,000',
            equity: '$380,000 / yr'
          },
          outreachStatus: 'Clear Target',
          confidentialNotes: 'Architected Datadog multi-region failover network.',
          reportsTo: 'VP Infrastructure'
        }
      ]
    },
    {
      id: `mm-comp-${project.id}-2`,
      name: 'Snowflake',
      tier: 'Tier 1',
      tierLabel: 'Tier 1 — Direct Scale Competitors & Peers',
      tierDescription: 'Direct market peers operating at comparable scale and technical complexity.',
      industry: 'Cloud Data Platform',
      stage: 'Public Enterprise ($55B Market Cap)',
      headquarters: 'San Mateo, CA',
      employeeCount: '7,000+ FTEs',
      revenueScale: '$3.2B+ ARR',
      poachStatus: 'Clear Target',
      executivesCount: 2,
      strategicRationale: 'Proven scalability under high compute workloads and distributed query engines.',
      executives: [
        {
          id: `mm-exec-${project.id}-3`,
          name: 'Alexei Rostov',
          firstName: 'Alexei',
          lastName: 'Rostov',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
          role: isEng ? 'VP of Distributed Systems Core' : 'VP of Query Optimization Products',
          companyId: `mm-comp-${project.id}-2`,
          companyName: 'Snowflake',
          location: 'San Mateo, CA',
          metroArea: 'San Francisco Bay Area',
          tenureYears: 4.8,
          tenureFormatted: '4.8 yrs',
          previousPedigree: 'Ex-Microsoft Azure Core, CMU CS',
          mobilityScore: 92,
          mobilityLevel: 'High',
          mobilityCatalyst: 'Executive retention vesting complete; open to pre-IPO executive equity.',
          matchScore: 95,
          archetypeMatch: 'Distributed Infrastructure Pioneer',
          estimatedComp: {
            baseSalary: '$430,000',
            totalCash: '$680,000',
            equity: '$490,000 / yr'
          },
          outreachStatus: 'Approached',
          confidentialNotes: 'Led 150+ engineers in building core execution engine.',
          reportsTo: 'SVP Engineering'
        },
        {
          id: `mm-exec-${project.id}-4`,
          name: 'Priya Sharma',
          firstName: 'Priya',
          lastName: 'Sharma',
          avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80',
          role: isEng ? 'Head of Cloud Data Infrastructure' : 'Director of Data Cloud Products',
          companyId: `mm-comp-${project.id}-2`,
          companyName: 'Snowflake',
          location: 'Seattle, WA',
          metroArea: 'Seattle-Bellevue',
          tenureYears: 2.9,
          tenureFormatted: '2.9 yrs',
          previousPedigree: 'Ex-AWS S3 Team Lead, Berkeley EECS',
          mobilityScore: 84,
          mobilityLevel: 'Moderate',
          mobilityCatalyst: 'Looking for broader organizational mandate.',
          matchScore: 89,
          archetypeMatch: 'Cloud Storage & Query Optimization Specialist',
          estimatedComp: {
            baseSalary: '$380,000',
            totalCash: '$560,000',
            equity: '$350,000 / yr'
          },
          outreachStatus: 'Clear Target',
          confidentialNotes: 'High technical credibility and published patents in distributed storage.',
          reportsTo: 'VP Distributed Systems'
        }
      ]
    },
    {
      id: `mm-comp-${project.id}-3`,
      name: 'Stripe',
      tier: 'Tier 2',
      tierLabel: 'Tier 2 — Adjacent Industry & Ecosystem Leaders',
      tierDescription: 'Proven enterprise technology platforms with high reliability and mature operating culture.',
      industry: 'Financial Infrastructure',
      stage: 'Pre-IPO ($1.8B+ ARR)',
      headquarters: 'South San Francisco, CA',
      employeeCount: '8,000+ FTEs',
      revenueScale: '$1.8B+ ARR',
      poachStatus: 'Clear Target',
      executivesCount: 2,
      strategicRationale: 'Gold-standard developer experience and 99.999% platform availability.',
      executives: [
        {
          id: `mm-exec-${project.id}-5`,
          name: 'James Harrington',
          firstName: 'James',
          lastName: 'Harrington',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80',
          role: isEng ? 'Head of Global Payments Infrastructure' : 'Head of Enterprise Payments Product',
          companyId: `mm-comp-${project.id}-3`,
          companyName: 'Stripe',
          location: 'San Francisco, CA',
          metroArea: 'San Francisco Bay Area',
          tenureYears: 3.7,
          tenureFormatted: '3.7 yrs',
          previousPedigree: 'Ex-Google Payments, Stanford CS',
          mobilityScore: 90,
          mobilityLevel: 'High',
          mobilityCatalyst: 'Pre-IPO liquidity delays making external opportunities attractive.',
          matchScore: 93,
          archetypeMatch: 'Mission-Critical Availability Operator',
          estimatedComp: {
            baseSalary: '$410,000',
            totalCash: '$630,000',
            equity: '$420,000 / yr'
          },
          outreachStatus: 'Pipelined',
          confidentialNotes: 'Top 1% technical communicator in developer ecosystem.',
          reportsTo: 'CTO'
        },
        {
          id: `mm-exec-${project.id}-6`,
          name: 'Elena Rostova',
          firstName: 'Elena',
          lastName: 'Rostova',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80',
          role: isEng ? 'VP of Artificial Intelligence & Machine Learning' : 'VP of AI Product Strategy',
          companyId: `mm-comp-${project.id}-3`,
          companyName: 'Stripe',
          location: 'San Francisco, CA',
          metroArea: 'San Francisco Bay Area',
          tenureYears: 3.5,
          tenureFormatted: '3.5 yrs',
          previousPedigree: 'Ex-DeepMind, Oxford PhD',
          mobilityScore: 96,
          mobilityLevel: 'High',
          mobilityCatalyst: 'Active in Opportunity Room review; high interest in enterprise leadership seat.',
          matchScore: 97,
          archetypeMatch: 'Frontier AI & Autonomous Systems Leader',
          estimatedComp: {
            baseSalary: '$450,000',
            totalCash: '$700,000',
            equity: '$550,000 / yr'
          },
          outreachStatus: 'In Dialogue',
          confidentialNotes: 'Exceptional candidate. Currently in active executive evaluation.',
          reportsTo: 'Head of Engineering',
          candidateId: 'c-rec-1'
        }
      ]
    },
    {
      id: `mm-comp-${project.id}-4`,
      name: 'Anthropic',
      tier: 'Tier 3',
      tierLabel: 'Tier 3 — High-Growth Scale-Up Disruptors',
      tierDescription: 'Fast-moving frontier AI scale-ups with world-class engineering density.',
      industry: 'Advanced AI Systems',
      stage: 'Pre-IPO Unicorn ($1.2B ARR)',
      headquarters: 'San Francisco, CA',
      employeeCount: '1,500+ FTEs',
      revenueScale: '$1.2B ARR',
      poachStatus: 'Clear Target',
      executivesCount: 1,
      strategicRationale: 'Pioneers in high-parameter inference infrastructure and safety governance.',
      executives: [
        {
          id: `mm-exec-${project.id}-7`,
          name: 'Nicholas Ward',
          firstName: 'Nicholas',
          lastName: 'Ward',
          avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&q=80',
          role: isEng ? 'Head of Inference Infrastructure' : 'Director of Foundation Model Product',
          companyId: `mm-comp-${project.id}-4`,
          companyName: 'Anthropic',
          location: 'San Francisco, CA',
          metroArea: 'San Francisco Bay Area',
          tenureYears: 2.4,
          tenureFormatted: '2.4 yrs',
          previousPedigree: 'Ex-OpenAI Scaling Lead, MIT MS',
          mobilityScore: 89,
          mobilityLevel: 'High',
          mobilityCatalyst: 'High organizational churn creating window for executive recruitment.',
          matchScore: 94,
          archetypeMatch: 'High-Density GPU Cluster & Inference Specialist',
          estimatedComp: {
            baseSalary: '$425,000',
            totalCash: '$660,000',
            equity: '$500,000 / yr'
          },
          outreachStatus: 'Clear Target',
          confidentialNotes: 'Deep relationships across frontier labs; stellar technical acumen.',
          reportsTo: 'Head of Systems'
        }
      ]
    },
    {
      id: `mm-comp-${project.id}-5`,
      name: 'Alphabet (Google Cloud)',
      tier: 'Tier 4',
      tierLabel: 'Tier 4 — Leadership Academies & Incubators',
      tierDescription: 'Institutional hyperscalers providing foundational engineering discipline.',
      industry: 'Hyperscale Cloud Platform',
      stage: 'Mega-Cap Public ($2.1T Market Cap)',
      headquarters: 'Mountain View, CA',
      employeeCount: '180,000+ FTEs',
      revenueScale: '$35B+ Cloud ARR',
      poachStatus: 'Restricted (Board)',
      poachReason: 'Board-level commercial covenant restricts active unsolicited outreach; review required.',
      executivesCount: 1,
      strategicRationale: 'Unmatched scale in distributed storage, Borg orchestrators, and network fabric.',
      executives: [
        {
          id: `mm-exec-${project.id}-8`,
          name: 'Dmitri Volkov',
          firstName: 'Dmitri',
          lastName: 'Volkov',
          avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80',
          role: isEng ? 'Distinguished Engineer & Director, Cloud Core' : 'Director of Cloud Systems Product',
          companyId: `mm-comp-${project.id}-5`,
          companyName: 'Alphabet (Google Cloud)',
          location: 'Sunnyvale, CA',
          metroArea: 'San Francisco Bay Area',
          tenureYears: 7.5,
          tenureFormatted: '7.5 yrs',
          previousPedigree: 'Ex-Bell Labs, Stanford PhD',
          mobilityScore: 72,
          mobilityLevel: 'Moderate',
          mobilityCatalyst: 'Board-restricted covenant; reference benchmark only.',
          matchScore: 91,
          archetypeMatch: 'Hyperscale Reliability & Distributed Systems Fellow',
          estimatedComp: {
            baseSalary: '$480,000',
            totalCash: '$820,000',
            equity: '$750,000 / yr'
          },
          outreachStatus: 'Off-Limits',
          confidentialNotes: 'Kept on market map for calibration and architectural benchmarking.',
          reportsTo: 'VP Google Cloud Infrastructure'
        }
      ]
    }
  ];

  const scopeSummary = computeScopeSummary(generatedCompanies, project);
  const tiers = computeTiers(generatedCompanies);

  return {
    projectId: project.id,
    mandateTitle: project.title,
    clientName: project.company || 'Executive Search Practice',
    leadRecruiter: project.leadRecruiter || 'Brian Stepan',
    lastUpdated: 'October 12, 2026',
    calibrationDate: 'Active Mandate Market Map',
    scopeSummary,
    tiers,
    companies: generatedCompanies
  };
}

// -------------------------------------------------------------
// CSV Generator
// -------------------------------------------------------------
export function generateMarketMapCsv(data: ProjectMarketMapData): string {
  const headers = [
    'Target Company',
    'Tier',
    'Industry',
    'Company Stage / ARR',
    'Headquarters',
    'Poach / Compliance Status',
    'Executive Name',
    'Current Role / Title',
    'Reports To',
    'Location',
    'Tenure (Years)',
    'Previous Pedigree',
    'Mobility Indicator (EMI)',
    'Mobility Catalyst',
    'Match Score',
    'Archetype Match',
    'Estimated Base Comp',
    'Estimated Total Comp',
    'Outreach Status',
    'Confidential Recruiter Notes'
  ];

  const rows: string[][] = [];

  data.companies.forEach(company => {
    company.executives.forEach(exec => {
      rows.push([
        company.name,
        company.tier,
        company.industry,
        company.stage,
        company.headquarters,
        company.poachStatus + (company.poachReason ? ` (${company.poachReason})` : ''),
        exec.name,
        exec.role,
        exec.reportsTo || '',
        exec.location,
        exec.tenureFormatted,
        exec.previousPedigree,
        `${exec.mobilityScore}% (${exec.mobilityLevel})`,
        exec.mobilityCatalyst,
        `${exec.matchScore}%`,
        exec.archetypeMatch,
        exec.estimatedComp.baseSalary,
        exec.estimatedComp.totalCash,
        exec.outreachStatus,
        exec.confidentialNotes
      ]);
    });
  });

  // Escape quotes and build CSV
  const formatCell = (val: string) => {
    const stringVal = (val || '').toString();
    if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
      return `"${stringVal.replace(/"/g, '""')}"`;
    }
    return stringVal;
  };

  const csvContent = [
    `# Executive Search Market Map: ${data.mandateTitle} (${data.clientName})`,
    `# Lead Recruiter: ${data.leadRecruiter} | Generated: ${data.lastUpdated}`,
    `# Scope: ${data.scopeSummary.totalCompaniesMapped} Companies | ${data.scopeSummary.totalExecutivesMapped} Executives | ${data.scopeSummary.clearTargetsCount} Clear Targets | ${data.scopeSummary.offLimitsCount} Off-Limits`,
    '',
    headers.map(formatCell).join(','),
    ...rows.map(row => row.map(formatCell).join(','))
  ].join('\n');

  return csvContent;
}

// -------------------------------------------------------------
// Company Org Chart Hierarchy Generator
// -------------------------------------------------------------
export function getCompanyOrgChart(company: MappedCompany): OrgNodeData {
  if (company.orgChart) {
    return company.orgChart;
  }

  const nameLower = company.name.toLowerCase();

  // Helper to find mapped executive in this company
  const findExec = (query: string): MappedExecutive | undefined => {
    return company.executives.find(e => 
      e.name.toLowerCase().includes(query.toLowerCase()) || 
      e.role.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Convert MappedExecutive to OrgNodeData
  const toCandidateNode = (exec: MappedExecutive, defaultLevel: OrgNodeData['level'] = 'C-Suite', children?: OrgNodeData[]): OrgNodeData => ({
    id: `node-${exec.id}`,
    name: exec.name,
    title: exec.role,
    level: exec.role.toLowerCase().includes('chief') || exec.role.toLowerCase().includes('cfo') ? 'C-Suite' :
           exec.role.toLowerCase().includes('evp') ? 'EVP' :
           exec.role.toLowerCase().includes('svp') ? 'SVP' : 'VP',
    avatarUrl: exec.avatarUrl,
    isMappedCandidate: true,
    candidateId: exec.candidateId,
    mobilityScore: exec.mobilityScore,
    matchScore: exec.matchScore,
    tenure: exec.tenureFormatted,
    department: 'Finance & Strategy',
    reportsTo: exec.reportsTo,
    status: exec.outreachStatus,
    children: children || []
  });

  // 1. STRIPE ORG CHART
  if (nameLower.includes('stripe')) {
    const sarah = findExec('Sarah') || findExec('Sandberg') || findExec('CFO');
    const chang = findExec('Chang') || findExec('Operations');
    const cruz = findExec('Cruz') || findExec('Accounting');

    const financeChildren: OrgNodeData[] = [];
    if (chang) financeChildren.push(toCandidateNode(chang, 'VP'));
    if (cruz) financeChildren.push(toCandidateNode(cruz, 'VP'));
    financeChildren.push({
      id: 'node-stripe-fpna',
      name: 'David Kim',
      title: 'Director of Strategic FP&A & Revenue Modeling',
      level: 'Director',
      department: 'Finance'
    });

    const sarahNode: OrgNodeData = sarah 
      ? toCandidateNode(sarah, 'C-Suite', financeChildren)
      : {
          id: 'node-stripe-cfo',
          name: 'Sarah Sandberg',
          title: 'Chief Financial Officer',
          level: 'C-Suite',
          isMappedCandidate: true,
          matchScore: 98,
          mobilityScore: 95,
          children: financeChildren
        };

    return {
      id: 'node-stripe-ceo',
      name: 'Patrick Collison',
      title: 'Co-Founder & Chief Executive Officer',
      level: 'CEO',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
      children: [
        sarahNode,
        {
          id: 'node-stripe-pres',
          name: 'Will Gaybrick',
          title: 'President of Technology & Product',
          level: 'C-Suite',
          department: 'Product & Eng',
          children: [
            {
              id: 'node-stripe-payments',
              name: 'James Harrington',
              title: 'Head of Global Payments Infrastructure',
              level: 'VP',
              department: 'Engineering'
            },
            {
              id: 'node-stripe-platform',
              name: 'Claire Hughes',
              title: 'VP of Core Platform Systems',
              level: 'VP',
              department: 'Engineering'
            }
          ]
        },
        {
          id: 'node-stripe-cro',
          name: 'Eileen O\'Mara',
          title: 'Chief Revenue Officer',
          level: 'C-Suite',
          department: 'Commercial',
          children: [
            {
              id: 'node-stripe-sales',
              name: 'Arthur Vance',
              title: 'VP of Global Enterprise Sales',
              level: 'VP',
              department: 'Commercial'
            }
          ]
        }
      ]
    };
  }

  // 2. DATADOG ORG CHART
  if (nameLower.includes('datadog')) {
    const sterling = findExec('Sterling') || findExec('Strategic');
    const weiss = findExec('Weiss') || findExec('FP&A');

    const financeChildren: OrgNodeData[] = [];
    if (sterling) financeChildren.push(toCandidateNode(sterling, 'SVP'));
    if (weiss) financeChildren.push(toCandidateNode(weiss, 'VP'));
    financeChildren.push({
      id: 'node-dd-controller',
      name: 'Marc Fontanella',
      title: 'VP & Corporate Controller',
      level: 'VP',
      department: 'Finance'
    });

    return {
      id: 'node-datadog-ceo',
      name: 'Olivier Pomel',
      title: 'Chief Executive Officer & Co-Founder',
      level: 'CEO',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
      children: [
        {
          id: 'node-datadog-cfo',
          name: 'David Obstler',
          title: 'Chief Financial Officer',
          level: 'C-Suite',
          department: 'Finance',
          children: financeChildren
        },
        {
          id: 'node-datadog-cto',
          name: 'Alexis Lê-Quôc',
          title: 'Chief Technology Officer & Co-Founder',
          level: 'C-Suite',
          department: 'Technology',
          children: [
            {
              id: 'node-dd-infra',
              name: 'Dr. Marcus Vance',
              title: 'VP of Distributed Infrastructure',
              level: 'VP',
              department: 'Engineering'
            },
            {
              id: 'node-dd-cloud',
              name: 'Emilio Rossi',
              title: 'VP of Cloud Telemetry & Networks',
              level: 'VP',
              department: 'Engineering'
            }
          ]
        },
        {
          id: 'node-datadog-cro',
          name: 'Sean Walters',
          title: 'Chief Revenue Officer',
          level: 'C-Suite',
          department: 'Sales & GTM',
          children: [
            {
              id: 'node-dd-sales',
              name: 'Natalie Wood',
              title: 'VP of Strategic Enterprise Accounts',
              level: 'VP',
              department: 'Sales'
            }
          ]
        }
      ]
    };
  }

  // 3. SNOWFLAKE ORG CHART
  if (nameLower.includes('snowflake')) {
    const dvance = findExec('David Vance') || findExec('Global Finance');
    const mvance = findExec('Marcus Vance') || findExec('RevOps');

    const financeChildren: OrgNodeData[] = [];
    if (dvance) financeChildren.push(toCandidateNode(dvance, 'SVP'));
    if (mvance) financeChildren.push(toCandidateNode(mvance, 'VP'));
    financeChildren.push({
      id: 'node-snow-audit',
      name: 'Jennifer Harris',
      title: 'VP of Internal Audit & Global SOX',
      level: 'VP',
      department: 'Finance'
    });

    return {
      id: 'node-snowflake-ceo',
      name: 'Sridhar Ramaswamy',
      title: 'Chief Executive Officer',
      level: 'CEO',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
      children: [
        {
          id: 'node-snowflake-cfo',
          name: 'Mike Scarpelli',
          title: 'Chief Financial Officer',
          level: 'C-Suite',
          department: 'Finance',
          children: financeChildren
        },
        {
          id: 'node-snowflake-product',
          name: 'Christian Kleinerman',
          title: 'EVP of Product Management',
          level: 'EVP',
          department: 'Product',
          children: [
            {
              id: 'node-snow-core',
              name: 'Alexei Rostov',
              title: 'VP of Distributed Systems Core',
              level: 'VP',
              department: 'Engineering'
            }
          ]
        },
        {
          id: 'node-snowflake-cro',
          name: 'Chris Degnan',
          title: 'Chief Revenue Officer',
          level: 'C-Suite',
          department: 'GTM'
        }
      ]
    };
  }

  // 4. SERVICENOW ORG CHART
  if (nameLower.includes('servicenow')) {
    const wu = findExec('Wu') || findExec('Enterprise Cloud');
    const rvance = findExec('Robert Vance') || findExec('Controller');

    const financeChildren: OrgNodeData[] = [];
    if (wu) financeChildren.push(toCandidateNode(wu, 'VP'));
    if (rvance) financeChildren.push(toCandidateNode(rvance, 'EVP'));
    financeChildren.push({
      id: 'node-snow-pricing',
      name: 'Kevin Thompson',
      title: 'VP of Global Deal Desk & Strategic Pricing',
      level: 'VP',
      department: 'Finance'
    });

    return {
      id: 'node-servicenow-ceo',
      name: 'Bill McDermott',
      title: 'Chairman & Chief Executive Officer',
      level: 'CEO',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80',
      children: [
        {
          id: 'node-servicenow-cfo',
          name: 'Gina Mastantuono',
          title: 'Chief Financial Officer',
          level: 'C-Suite',
          department: 'Finance',
          children: financeChildren
        },
        {
          id: 'node-servicenow-coo',
          name: 'CJ Desai',
          title: 'President & Chief Operating Officer',
          level: 'C-Suite',
          department: 'Operations',
          children: [
            {
              id: 'node-now-ops',
              name: 'Amy Lok',
              title: 'VP of Commercial Operations',
              level: 'VP',
              department: 'Operations'
            }
          ]
        }
      ]
    };
  }

  // 5. SCALE AI ORG CHART
  if (nameLower.includes('scale ai') || nameLower.includes('scale')) {
    const miller = findExec('Miller') || findExec('Strategic Finance');
    const chen = findExec('Sophia') || findExec('Chen');

    const financeChildren: OrgNodeData[] = [];
    if (chen) financeChildren.push(toCandidateNode(chen, 'VP'));
    if (miller) financeChildren.push(toCandidateNode(miller, 'VP'));
    financeChildren.push({
      id: 'node-scale-rev',
      name: 'Jason Lee',
      title: 'Director of Enterprise Revenue Accounting',
      level: 'Director',
      department: 'Finance'
    });

    return {
      id: 'node-scale-ceo',
      name: 'Alexandr Wang',
      title: 'Founder & Chief Executive Officer',
      level: 'CEO',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&q=80',
      children: [
        {
          id: 'node-scale-finance-branch',
          name: 'Executive Finance & Strategy',
          title: 'Office of Capital & Financial Operations',
          level: 'EVP',
          department: 'Finance',
          children: financeChildren
        },
        {
          id: 'node-scale-eng',
          name: 'Vijay Karunamurthy',
          title: 'Head of Engineering',
          level: 'EVP',
          department: 'Engineering',
          children: [
            {
              id: 'node-scale-infra',
              name: 'Nicholas Ward',
              title: 'Head of Inference Infrastructure',
              level: 'VP',
              department: 'Engineering'
            }
          ]
        }
      ]
    };
  }

  // 6. ALPHABET / GOOGLE ORG CHART
  if (nameLower.includes('alphabet') || nameLower.includes('google')) {
    const martinez = findExec('Martinez') || findExec('Alphabet Capital');
    const morgan = findExec('Morgan') || findExec('Cloud Enterprise');

    const financeChildren: OrgNodeData[] = [];
    if (martinez) financeChildren.push(toCandidateNode(martinez, 'SVP'));
    if (morgan) financeChildren.push(toCandidateNode(morgan, 'VP'));

    return {
      id: 'node-google-ceo',
      name: 'Sundar Pichai',
      title: 'Chief Executive Officer, Alphabet & Google',
      level: 'CEO',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80',
      children: [
        {
          id: 'node-google-cfo',
          name: 'Anat Ashkenazi',
          title: 'Chief Financial Officer, Alphabet',
          level: 'C-Suite',
          department: 'Finance',
          children: financeChildren
        },
        {
          id: 'node-google-cloud-ceo',
          name: 'Thomas Kurian',
          title: 'Chief Executive Officer, Google Cloud',
          level: 'C-Suite',
          department: 'Google Cloud',
          children: [
            {
              id: 'node-google-cloud-eng',
              name: 'Dmitri Volkov',
              title: 'Distinguished Engineer & Director, Cloud Core',
              level: 'Director',
              department: 'Engineering'
            }
          ]
        }
      ]
    };
  }

  // 7. GENERIC / DYNAMIC FALLBACK ORG CHART FOR ANY OTHER COMPANY
  const mappedChildren = company.executives.map(e => toCandidateNode(e, 'VP'));
  const firstExec = company.executives[0];
  const functionDomain = firstExec?.role.toLowerCase().includes('engineer') || firstExec?.role.toLowerCase().includes('tech')
    ? 'Engineering & Systems'
    : 'Finance & Strategy';

  return {
    id: `node-${company.id}-ceo`,
    name: `Chief Executive Officer`,
    title: `President & Chief Executive Officer`,
    level: 'CEO',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80',
    children: [
      {
        id: `node-${company.id}-dept-lead`,
        name: `${functionDomain} Leadership`,
        title: `EVP / Executive Leadership, ${functionDomain}`,
        level: 'C-Suite',
        department: functionDomain,
        children: mappedChildren.length > 0 ? mappedChildren : [
          {
            id: `node-${company.id}-vp-placeholder`,
            name: 'Senior Vice President',
            title: `Head of ${functionDomain}`,
            level: 'SVP',
            department: functionDomain
          }
        ]
      },
      {
        id: `node-${company.id}-operations`,
        name: 'Chief Operating Officer',
        title: 'EVP of Global Operations & Business Strategy',
        level: 'C-Suite',
        department: 'Operations'
      },
      {
        id: `node-${company.id}-gtm`,
        name: 'Chief Revenue Officer',
        title: 'EVP of Worldwide Go-To-Market',
        level: 'C-Suite',
        department: 'Commercial'
      }
    ]
  };
}
