import { Project } from '../types';
import { initialDirectoryCandidates, DirectoryCandidate } from './candidateDirectoryData';
import { mockCandidates } from './mockData';

export interface ProjectExecutiveRecommendation {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  location: string;
  avatarUrl?: string;
  matchScore: number; // 0-100
  fitTier: 'Strong Fit' | 'High Fit' | 'Calibration Match';
  fitRationale: string;
  fitSignals: {
    cmaScore: number; // Candidate Motivation Alignment
    sfaScore: number; // Structural Fit
    ptmScore: number; // Propensity to Move
    levelMatch: string;
    compParity: string;
    geoMatch: string;
    domainOverlap: string;
  };
  mobilitySignal: string;
  tenure: string;
  keyHighlights: string[];
  estimatedComp?: string;
  currentPandL?: string;
  isRestricted?: boolean;
  status: 'recommended' | 'pipelined' | 'contacted';
  originalCandidate?: any;
}

export interface ProjectRecommendationsResult {
  executives: ProjectExecutiveRecommendation[];
  totalCount: number;
  highFitCount: number;
  averageMatchScore: number;
}

/**
 * Calculates master graph recommendations for a given project based on its parameters & title
 */
export function getRecommendationsForProject(project: Project): ProjectRecommendationsResult {
  const title = (project.title || '').toLowerCase();
  const params = project.parameters;
  const functionalDomain = (params?.functionalDomain || '').toLowerCase();
  const domainKeywords = (params?.domainKeywords || []).map(k => k.toLowerCase());
  const roleLevel = params?.roleLevel || 'Vice President';
  const targetMarkets = (params?.targetMetropolitanMarkets || ['San Francisco Bay Area']).map(m => m.toLowerCase());
  const maxBaseBudget = params?.maxBaseBudget || 450000;

  const isFinance = title.includes('cfo') || title.includes('finance') || functionalDomain.includes('finance') || functionalDomain.includes('capital markets');
  const isEngineering = title.includes('engineer') || title.includes('tech') || title.includes('infrastructure') || functionalDomain.includes('distributed') || functionalDomain.includes('infrastructure') || functionalDomain.includes('ai');
  const isProduct = title.includes('product') || functionalDomain.includes('product');

  // 1. GENERATE EXECUTIVE RECOMMENDATIONS
  let executives: ProjectExecutiveRecommendation[] = [];

  if (isFinance) {
    executives = [
      {
        id: 'rec-exec-fin-1',
        name: 'Sarah Sandberg',
        firstName: 'Sarah',
        lastName: 'Sandberg',
        role: 'Chief Financial Officer',
        company: 'Stripe',
        location: 'South San Francisco, CA',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80',
        matchScore: 98,
        fitTier: 'Strong Fit',
        fitRationale: 'Proven Pre-IPO capital markets & multi-product scale. Led Series I debt-equity facilities; compensation parity aligns with $480K base target.',
        fitSignals: {
          cmaScore: 97,
          sfaScore: 98,
          ptmScore: 95,
          levelMatch: 'Exact C-Suite Match',
          compParity: '100% Budget Parity ($460K current base)',
          geoMatch: 'SF Bay Area (Hybrid 3d ready)',
          domainOverlap: 'S-1 Filings, SaaS Metrics, FP&A'
        },
        mobilitySignal: '95% Mobility Indicator • Vesting Cliff in 60 Days',
        tenure: '4.2 years',
        keyHighlights: ['Pre-IPO Corporate Governance', 'Scalable Global Treasury', '45+ direct & indirect team'],
        estimatedComp: '$460K Base • $900K Total',
        currentPandL: '$500M+ ARR Scope',
        status: 'recommended'
      },
      {
        id: 'rec-exec-fin-2',
        name: 'David Vance',
        firstName: 'David',
        lastName: 'Vance',
        role: 'SVP of Global Finance & Strategy',
        company: 'Snowflake',
        location: 'San Mateo, CA',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
        matchScore: 96,
        fitTier: 'Strong Fit',
        fitRationale: 'Ideal Step-Up Candidate from public cloud giant. Ready for first-time CFO seat; strong SOX compliance and enterprise margin expansion track record.',
        fitSignals: {
          cmaScore: 99,
          sfaScore: 94,
          ptmScore: 93,
          levelMatch: 'High Step-Up Delta (SVP to CFO)',
          compParity: 'Within Target Ceiling ($440K base)',
          geoMatch: 'San Francisco Bay Area',
          domainOverlap: 'Capital Markets, Public SaaS Metrics'
        },
        mobilitySignal: '92% Mobility Indicator • Structurally Blocked by Tenured CFO',
        tenure: '3.8 years',
        keyHighlights: ['Public Company FP&A', 'Enterprise Investor Relations', 'Stanford MBA'],
        estimatedComp: '$440K Base • $820K Total',
        currentPandL: '$300M+ Scope',
        status: 'recommended'
      },
      {
        id: 'rec-exec-fin-3',
        name: 'Elena Rostova',
        firstName: 'Elena',
        lastName: 'Rostova',
        role: 'VP of Finance & Corporate Controller',
        company: 'Databricks',
        location: 'San Francisco, CA',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80',
        matchScore: 94,
        fitTier: 'High Fit',
        fitRationale: 'Deep technical accounting and S-1 readiness leader. Built pre-IPO SOX internal controls and unified enterprise revenue accounting.',
        fitSignals: {
          cmaScore: 93,
          sfaScore: 95,
          ptmScore: 91,
          levelMatch: 'VP to CFO Expansion',
          compParity: 'Under Target Budget ($420K base)',
          geoMatch: 'San Francisco Bay Area',
          domainOverlap: 'SOX Compliance, Multi-Product ARR'
        },
        mobilitySignal: '89% Mobility Indicator • Recent Equity Acceleration Point',
        tenure: '4.5 years',
        keyHighlights: ['Pre-IPO S-1 Readiness', 'Revenue Recognition Audit', 'Big 4 Alum'],
        estimatedComp: '$420K Base • $780K Total',
        currentPandL: '$200M+ Scope',
        status: 'recommended'
      },
      {
        id: 'rec-exec-fin-4',
        name: 'Michael Sterling',
        firstName: 'Michael',
        lastName: 'Sterling',
        role: 'Chief Financial Officer',
        company: 'Plaid',
        location: 'New York, NY',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
        matchScore: 92,
        fitTier: 'High Fit',
        fitRationale: 'Fintech capital structures & strategic M&A expert. Led multi-asset acquisitions and debt refinancings with top-tier venture backers.',
        fitSignals: {
          cmaScore: 91,
          sfaScore: 93,
          ptmScore: 88,
          levelMatch: 'Exact C-Suite Match',
          compParity: 'Near Target Ceiling ($485K base)',
          geoMatch: 'New York Metro (Relocation / Hybrid)',
          domainOverlap: 'Capital Markets, M&A, S-1 Filings'
        },
        mobilitySignal: '88% Mobility Indicator • 4-Year Cliff Exit Phase',
        tenure: '4.1 years',
        keyHighlights: ['M&A Integration', 'Global Debt Facilities', 'Columbia Business School'],
        estimatedComp: '$485K Base • $920K Total',
        currentPandL: '$350M+ Scope',
        status: 'recommended'
      },
      {
        id: 'rec-exec-fin-5',
        name: 'Rachel Kim',
        firstName: 'Rachel',
        lastName: 'Kim',
        role: 'Head of Strategic Finance & FP&A',
        company: 'Figma',
        location: 'San Francisco, CA',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
        matchScore: 91,
        fitTier: 'High Fit',
        fitRationale: 'High-growth SaaS metrics driver. Superb business partner to product and sales engineering with top investor communications skills.',
        fitSignals: {
          cmaScore: 94,
          sfaScore: 90,
          ptmScore: 92,
          levelMatch: 'High Step-Up (Head to CFO/VP)',
          compParity: 'Well Within Budget ($395K base)',
          geoMatch: 'San Francisco Bay Area',
          domainOverlap: 'SaaS Metrics, Corporate Modeling'
        },
        mobilitySignal: '93% Mobility Indicator • Post-Acquisition Departure Wave',
        tenure: '3.2 years',
        keyHighlights: ['High Net Retention Modeling', 'Board-Level Reporting', 'Wharton MBA'],
        estimatedComp: '$395K Base • $710K Total',
        currentPandL: '$150M+ Scope',
        status: 'recommended'
      },
      {
        id: 'rec-exec-fin-6',
        name: 'Jonathan Miller',
        firstName: 'Jonathan',
        lastName: 'Miller',
        role: 'VP of Finance & Operations',
        company: 'Brex',
        location: 'Seattle, WA',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80',
        matchScore: 89,
        fitTier: 'Calibration Match',
        fitRationale: 'Operational scaling veteran with multi-entity tax, international treasury, and rapid headcount ramp management experience.',
        fitSignals: {
          cmaScore: 89,
          sfaScore: 90,
          ptmScore: 86,
          levelMatch: 'VP Level Match',
          compParity: 'Under Budget ($410K base)',
          geoMatch: 'Seattle Metro / Remote Friendly',
          domainOverlap: 'FP&A, International Treasury'
        },
        mobilitySignal: '86% Mobility Indicator • Org Restructuring Signal',
        tenure: '3.0 years',
        keyHighlights: ['International Expansion', 'Corporate Treasury', 'Audit Committee Lead'],
        estimatedComp: '$410K Base • $750K Total',
        currentPandL: '$180M+ Scope',
        status: 'recommended'
      }
    ];
  } else if (isEngineering) {
    executives = [
      {
        id: 'rec-exec-eng-1',
        name: 'Elena Rostova',
        firstName: 'Elena',
        lastName: 'Rostova',
        role: 'VP of Artificial Intelligence',
        company: 'Snowflake',
        location: 'San Mateo, CA',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80',
        matchScore: 98,
        fitTier: 'Strong Fit',
        fitRationale: 'High mobility inflection point; 3.5 yr tenure post-acquisition with direct alignment to high-concurrency streaming and AI platform scale.',
        fitSignals: {
          cmaScore: 98,
          sfaScore: 97,
          ptmScore: 96,
          levelMatch: 'Exact VP Level Match',
          compParity: 'Within Target Base ($420K current base)',
          geoMatch: 'San Francisco Bay Area (Hybrid ready)',
          domainOverlap: 'Distributed Systems, GPU Clusters, Multi-Cloud'
        },
        mobilitySignal: '96% Mobility Indicator • Vesting Cliff in 45 Days',
        tenure: '3.5 years',
        keyHighlights: ['120+ Engineer Scale', 'Kubernetes Core Contributor', 'Stanford PhD CS'],
        estimatedComp: '$420K Base • $850K Total',
        currentPandL: '$180M R&D Budget',
        status: 'recommended'
      },
      {
        id: 'rec-exec-eng-2',
        name: 'Devon Chen',
        firstName: 'Devon',
        lastName: 'Chen',
        role: 'SVP of Infrastructure Engineering',
        company: 'Stripe',
        location: 'South San Francisco, CA',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
        matchScore: 96,
        fitTier: 'Strong Fit',
        fitRationale: 'Global platform resilience executive overseeing 99.999% uptime for multi-trillion processing scale. Built distributed storage and streaming clusters.',
        fitSignals: {
          cmaScore: 94,
          sfaScore: 98,
          ptmScore: 92,
          levelMatch: 'High-Level Peer Match (SVP)',
          compParity: 'At Target Base Ceiling ($455K base)',
          geoMatch: 'San Francisco Bay Area',
          domainOverlap: 'Kubernetes, High-Concurrency Streaming'
        },
        mobilitySignal: '92% Mobility Indicator • 4-Year Stock Grant Vest Complete',
        tenure: '4.8 years',
        keyHighlights: ['200+ Global Engineers', 'High Concurrency Streaming', 'Berkeley EECS'],
        estimatedComp: '$455K Base • $920K Total',
        currentPandL: '$90M R&D Scope',
        status: 'recommended'
      },
      {
        id: 'rec-exec-eng-3',
        name: 'Marcus Sterling',
        firstName: 'Marcus',
        lastName: 'Sterling',
        role: 'Senior Director of Platform Engineering',
        company: 'Datadog',
        location: 'Austin, TX',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
        matchScore: 95,
        fitTier: 'Strong Fit',
        fitRationale: 'Prime VP Step-Up Candidate. Currently managing core telemetry streaming engines; proven team builder scaling org from 30 to 110 engineers.',
        fitSignals: {
          cmaScore: 99,
          sfaScore: 93,
          ptmScore: 95,
          levelMatch: 'Senior Director to VP Step-Up Delta',
          compParity: 'Under Target Budget ($380K base)',
          geoMatch: 'Austin Metro (Target Market match)',
          domainOverlap: 'Multi-Cloud, DevOps, High-Concurrency'
        },
        mobilitySignal: '95% Mobility Indicator • Blocked for VP Promotion Internally',
        tenure: '3.6 years',
        keyHighlights: ['Telemetry Ingestion Scale', 'Austin Tech Hub Leader', 'MIT Computer Engineering'],
        estimatedComp: '$380K Base • $740K Total',
        currentPandL: '$35M R&D Budget',
        status: 'recommended'
      },
      {
        id: 'rec-exec-eng-4',
        name: 'Priya Patel',
        firstName: 'Priya',
        lastName: 'Patel',
        role: 'VP of Systems & Cloud Infrastructure',
        company: 'Cloudflare',
        location: 'Seattle, WA',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
        matchScore: 93,
        fitTier: 'High Fit',
        fitRationale: 'Edge computing and global routing infrastructure veteran. Superb operational rigor and multi-region failover architecture track record.',
        fitSignals: {
          cmaScore: 92,
          sfaScore: 94,
          ptmScore: 91,
          levelMatch: 'Exact VP Level Match',
          compParity: 'Within Budget ($430K base)',
          geoMatch: 'Seattle-Bellevue (Target Market)',
          domainOverlap: 'GPU Clusters, Distributed Networks'
        },
        mobilitySignal: '91% Mobility Indicator • Org Reorganization Underway',
        tenure: '4.1 years',
        keyHighlights: ['Edge Compute Global Nodes', '99.999% Reliability SLA', 'Carnegie Mellon Alum'],
        estimatedComp: '$430K Base • $830K Total',
        currentPandL: '$50M R&D Scope',
        status: 'recommended'
      },
      {
        id: 'rec-exec-eng-5',
        name: 'Julian Hayes',
        firstName: 'Julian',
        lastName: 'Hayes',
        role: 'Director of AI Infrastructure',
        company: 'Anthropic',
        location: 'San Francisco, CA',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&q=80',
        matchScore: 91,
        fitTier: 'High Fit',
        fitRationale: 'Deep GPU cluster orchestration and distributed training infrastructure lead. Hands-on experience optimizing Slurm, RoCE, and multi-cloud AI fabrics.',
        fitSignals: {
          cmaScore: 95,
          sfaScore: 89,
          ptmScore: 93,
          levelMatch: 'Director to VP Step-Up',
          compParity: 'Within Budget ($395K base)',
          geoMatch: 'San Francisco Bay Area',
          domainOverlap: 'GPU Clusters, Real-Time AI Inference'
        },
        mobilitySignal: '94% Mobility Indicator • High Churn in Research Infrastructure',
        tenure: '2.8 years',
        keyHighlights: ['GPU Cluster Scaling', 'Multi-Cloud Fabric', 'Caltech PhD'],
        estimatedComp: '$395K Base • $820K Total',
        currentPandL: '$40M Compute Budget',
        status: 'recommended'
      },
      {
        id: 'rec-exec-eng-6',
        name: 'Aisha Al-Mansoor',
        firstName: 'Aisha',
        lastName: 'Al-Mansoor',
        role: 'VP of Platform Engineering',
        company: 'Twilio',
        location: 'San Francisco, CA',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80',
        matchScore: 89,
        fitTier: 'Calibration Match',
        fitRationale: 'Developer API platform scale & high-throughput communications architecture executive with proven enterprise security compliance.',
        fitSignals: {
          cmaScore: 88,
          sfaScore: 91,
          ptmScore: 89,
          levelMatch: 'Exact VP Level Match',
          compParity: 'Under Budget ($415K base)',
          geoMatch: 'San Francisco Bay Area',
          domainOverlap: 'Distributed Systems, DevOps'
        },
        mobilitySignal: '89% Mobility Indicator • 4-Year Tenure Transition',
        tenure: '4.4 years',
        keyHighlights: ['High-Throughput Messaging', 'Global Developer API Platform', 'Harvard CS'],
        estimatedComp: '$415K Base • $780K Total',
        currentPandL: '$60M Budget',
        status: 'recommended'
      }
    ];
  } else {
    // Product or general executive search
    executives = [
      {
        id: 'rec-exec-prod-1',
        name: 'Marcus Vance',
        firstName: 'Marcus',
        lastName: 'Vance',
        role: 'Chief Product Officer',
        company: 'Databricks',
        location: 'San Francisco, CA',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
        matchScore: 97,
        fitTier: 'Strong Fit',
        fitRationale: 'Pre-IPO enterprise scaling veteran; structurally blocked for CEO seat, primed for external leadership move across enterprise platforms.',
        fitSignals: {
          cmaScore: 96,
          sfaScore: 98,
          ptmScore: 94,
          levelMatch: 'C-Suite / Executive Match',
          compParity: 'Aligned with Executive Compensation',
          geoMatch: 'San Francisco Bay Area',
          domainOverlap: 'Developer Platforms, Enterprise SaaS'
        },
        mobilitySignal: '94% Mobility Indicator • Structurally Blocked Executive',
        tenure: '5.0 years',
        keyHighlights: ['Product-Led Growth', 'Enterprise Monetization', 'UC Berkeley EECS / Wharton'],
        estimatedComp: '$450K Base • $950K Total',
        currentPandL: '$500M ARR Scope',
        status: 'recommended'
      },
      {
        id: 'rec-exec-prod-2',
        name: 'Sophia Lin',
        firstName: 'Sophia',
        lastName: 'Lin',
        role: 'VP of Product Management',
        company: 'Figma',
        location: 'San Francisco, CA',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80',
        matchScore: 95,
        fitTier: 'Strong Fit',
        fitRationale: 'Exceptional product velocity & enterprise collaborative software background. Led design systems and enterprise admin controls.',
        fitSignals: {
          cmaScore: 97,
          sfaScore: 93,
          ptmScore: 92,
          levelMatch: 'VP Level Match',
          compParity: 'Under Target Budget ($410K base)',
          geoMatch: 'San Francisco Bay Area',
          domainOverlap: 'Collaboration, Enterprise Security'
        },
        mobilitySignal: '92% Mobility Indicator • Post-Acquisition Horizon Transition',
        tenure: '3.9 years',
        keyHighlights: ['Enterprise Tiering', 'Product-Led Viral Growth', 'Stanford CS'],
        estimatedComp: '$410K Base • $820K Total',
        currentPandL: '$200M Scope',
        status: 'recommended'
      },
      {
        id: 'rec-exec-prod-3',
        name: 'David Reynolds',
        firstName: 'David',
        lastName: 'Reynolds',
        role: 'Head of Enterprise Product',
        company: 'Anthropic',
        location: 'San Francisco, CA',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
        matchScore: 93,
        fitTier: 'High Fit',
        fitRationale: 'Pioneered developer APIs and enterprise compliance for frontier AI foundation models with 300% adoption velocity.',
        fitSignals: {
          cmaScore: 94,
          sfaScore: 92,
          ptmScore: 91,
          levelMatch: 'Step-Up to VP Product',
          compParity: 'Within Target Budget ($390K base)',
          geoMatch: 'San Francisco Bay Area',
          domainOverlap: 'API Platforms, Developer Ecosystems'
        },
        mobilitySignal: '91% Mobility Indicator • Org Scaling Reallocation',
        tenure: '2.5 years',
        keyHighlights: ['Developer Ecosystems', 'Security & SOC-2 Compliance', 'MIT Media Lab'],
        estimatedComp: '$390K Base • $760K Total',
        currentPandL: '$100M Scope',
        status: 'recommended'
      },
      {
        id: 'rec-exec-prod-4',
        name: 'Claire Beauchamp',
        firstName: 'Claire',
        lastName: 'Beauchamp',
        role: 'VP of Product',
        company: 'Canva',
        location: 'New York, NY',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80',
        matchScore: 90,
        fitTier: 'High Fit',
        fitRationale: 'SaaS consumer-to-enterprise motion pioneer with extensive experience building generative editing workflows.',
        fitSignals: {
          cmaScore: 90,
          sfaScore: 91,
          ptmScore: 89,
          levelMatch: 'VP Level Match',
          compParity: 'Within Budget ($405K base)',
          geoMatch: 'New York Metro Area',
          domainOverlap: 'SaaS Monetization, Product Growth'
        },
        mobilitySignal: '89% Mobility Indicator • 4-Year Cliff Exit Phase',
        tenure: '4.2 years',
        keyHighlights: ['Enterprise Land & Expand', 'Viral Product Loops', 'Oxford Alum'],
        estimatedComp: '$405K Base • $780K Total',
        currentPandL: '$150M Scope',
        status: 'recommended'
      }
    ];
  }


  const totalCount = executives.length;
  const highFitCount = executives.filter(e => e.matchScore >= 95).length;
  const totalScore = executives.reduce((sum, e) => sum + e.matchScore, 0);
  const averageMatchScore = Math.round(totalScore / (totalCount || 1));

  return {
    executives,
    totalCount,
    highFitCount,
    averageMatchScore
  };
}
