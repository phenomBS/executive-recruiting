export type StakeholderType = 
  | 'Company CEO'
  | 'Hiring Manager'
  | 'Executive Assistant'
  | 'Board Member'
  | 'Lead Recruiter'
  | 'General Counsel';

export interface DealRoomStakeholder {
  id: string;
  name: string;
  roleTitle: string;
  stakeholderType: StakeholderType;
  avatarUrl: string;
  email: string;
  phone?: string;
  isPrimaryContact?: boolean;
}

export type DealRoomWidgetType = 
  | 'nda_agreement'
  | 'equity_calculator'
  | 'ceo_welcome_video'
  | 'opportunity_strategic'
  | 'deal_team'
  | 'document_attachments'
  | 'executive_qna';

export interface DealRoomWidget {
  id: string;
  type: DealRoomWidgetType;
  title: string;
  description: string;
  stageId: string;
  order: number;
  isRequiredMilestone: boolean;
  isCompleted?: boolean;
  config?: Record<string, any>;
}

export interface DealRoomStage {
  id: string;
  name: string;
  order: number;
  status: 'completed' | 'current' | 'locked';
  description: string;
  widgets: DealRoomWidget[];
}

export type DealRoomDeliveryChannel = 
  | 'secure_email_link'
  | 'executive_sms_direct'
  | 'linkedin_inmail_private'
  | 'ea_confidential_dispatch';

export interface DealRoomAttachment {
  id: string;
  fileName: string;
  fileSize: string;
  category: 'Strategic Brief' | 'Legal & NDA' | 'Offer Package' | 'Benefits & Compensation' | 'Board Deck';
  uploadedAt: string;
  isConfidential: boolean;
  downloadCount: number;
}

export interface FinancialOfferModel {
  baseSalary: number; // e.g. 450000
  targetBonusPercent: number; // e.g. 50
  equityGrantValue: number; // e.g. 1200000
  sharesCount: number; // e.g. 45000
  currentStrikePrice: number; // e.g. 24.50
  currentSharePrice: number; // e.g. 26.67
  currentCompanyValuationBillion: number; // e.g. 12 ($12B)
  bullCaseValuationMultiplier: number; // e.g. 3.5x ($42B)
  vestingYears: number; // 4
  vestingSchedule: '4-Year Monthly (25% 1-Yr Cliff)' | '4-Year Pure Monthly' | 'Performance Milestones';
  signingBonus: number; // e.g. 100000
  relocationAllowance: number; // e.g. 50000
}

export interface DealRoom {
  id: string;
  title: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateCurrentRole: string;
  candidateCurrentCompany: string;
  candidateAvatarUrl: string;
  candidateLocation: string;
  targetRole: string;
  department: string;
  status: 'Draft' | 'Live / Sent' | 'In Review' | 'NDA Signed' | 'Offer Stage' | 'Offer Accepted';
  templateId: string;
  templateName: string;
  createdAt: string;
  lastActive: string;
  leadRecruiter: string;
  currentStageId: string;
  stages: DealRoomStage[];
  stakeholders: DealRoomStakeholder[];
  attachments: DealRoomAttachment[];
  financialModel: FinancialOfferModel;
  deliveryConfig: {
    channels: DealRoomDeliveryChannel[];
    sentAt?: string;
    expiresAt?: string;
    accessCodeRequired: boolean;
    viewsCount: number;
    totalTimeMinutes: number;
    ndaSignedAt?: string;
    lastAccessedIpLocation?: string;
  };
  designConfig?: DealRoomDesignConfig;
}

export interface DealRoomDesignConfig {
  accentColor: string; // hex code
  bannerTheme: 'modern_gradient' | 'midnight' | 'corporate_indigo' | 'emerald_growth' | 'minimal_slate' | 'custom';
  bannerCustomUrl?: string;
  headerStyle: 'standard' | 'spotlight' | 'compact';
  welcomeNote?: string;
  recruiterIntroNote?: string;
  showExecutiveSponsorsBar: boolean;
  showEngagementBadge: boolean;
  ctaButtonText: string;
}

export const DEFAULT_DEAL_ROOM_DESIGN: DealRoomDesignConfig = {
  accentColor: 'var(--color-secondary-200)',
  bannerTheme: 'modern_gradient',
  bannerCustomUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
  headerStyle: 'standard',
  welcomeNote: 'We are thrilled to present this private executive exploration workspace prepared exclusively for your review.',
  recruiterIntroNote: 'This executive portal provides end-to-end transparency into our search mandate, strategic growth horizon, leadership deal team, and comprehensive rewards package.',
  showExecutiveSponsorsBar: true,
  showEngagementBadge: true,
  ctaButtonText: 'Schedule Confidential Discussion'
};

export interface DealRoomTemplate {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'Flagship Executive' | 'Confidential Technical' | 'Offer Closing' | 'Early Exploration';
  recommendedFor: string;
  stageNames: string[];
  widgetCount: number;
}

export const dealRoomTemplates: DealRoomTemplate[] = [
  {
    id: 'tpl-flagship-csuite',
    name: 'C-Suite & Executive Flagship Experience',
    tagline: 'Comprehensive journey from CEO greeting to final board offer closing',
    description: 'Pre-loaded with CEO Welcome Video, Mutual NDA Gate, Strategic 3-Year Vision, Deal Team Cards, and Executive Equity Modeler.',
    category: 'Flagship Executive',
    recommendedFor: 'Chief Technology Officer, Chief Financial Officer, Chief Product Officer, CISO',
    stageNames: ['Introduction & Mutual NDA', 'Strategic Vision & Opportunity', 'Executive Diligence', 'Formal Offer & Equity Exploration'],
    widgetCount: 7
  },
  {
    id: 'tpl-confidential-tech',
    name: 'Confidential Technical Leadership Suite',
    tagline: 'High-trust architecture vision and compute infrastructure mandate',
    description: 'Structured for elite VP & Fellow engineering executives. Includes technical roadmap deck, compute scaling P&L overview, and vesting cliff comparison.',
    category: 'Confidential Technical',
    recommendedFor: 'VP of AI Research, VP Infrastructure, Head of Distributed Systems',
    stageNames: ['Confidentiality & NDA', 'Technical Architecture & Mandate', 'Panel Intros', 'Offer & Equity Calculator'],
    widgetCount: 6
  },
  {
    id: 'tpl-offer-closing',
    name: 'Executive Offer & Equity Closing Room',
    tagline: 'High-impact decision center for final candidate evaluation & closing',
    description: 'Focused directly on financial upside, tax optimization, health/family executive perks, and interactive 4-year valuation multiplier calculator.',
    category: 'Offer Closing',
    recommendedFor: 'Late-stage finalists ready for compensation deliberation and term sheet review',
    stageNames: ['Formal Term Sheet Review', 'Financial & Equity Modeler', 'Executive Benefits Deck', 'Digital Signature & Onboarding'],
    widgetCount: 5
  },
  {
    id: 'tpl-early-calibration',
    name: 'Opportunity Teaser & Mutual Calibration',
    tagline: 'Discreet low-friction portal for passive leaders exploring external timing',
    description: 'Lightweight overview for passive executives with CEO personal greeting, market opportunity brief, and asynchronous private Q&A.',
    category: 'Early Exploration',
    recommendedFor: 'Passive tier-1 executives with high propensity to move requiring discreet vetting',
    stageNames: ['Confidential Opportunity Overview', 'Strategic Vision Teaser', 'Executive Private Dialogue'],
    widgetCount: 4
  }
];

export const initialDealRooms: DealRoom[] = [
  {
    id: 'dr-1',
    title: 'Executive Opportunity Room: Elena Rostova — VP of Artificial Intelligence',
    candidateId: 'cand-ai-1',
    candidateName: 'Elena Rostova',
    candidateEmail: 'elena.rostova@meta.example.com',
    candidateCurrentRole: 'VP of AI Research & Platforms',
    candidateCurrentCompany: 'Meta',
    candidateAvatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
    candidateLocation: 'Menlo Park, CA (Open to Seattle)',
    targetRole: 'VP of Artificial Intelligence',
    department: 'Engineering & AI',
    status: 'In Review',
    templateId: 'tpl-flagship-csuite',
    templateName: 'C-Suite & Executive Flagship Experience',
    createdAt: 'Sep 28, 2026',
    lastActive: 'Today at 9:42 AM',
    leadRecruiter: 'Brian Stepan',
    currentStageId: 'stg-1-2',
    financialModel: {
      baseSalary: 475000,
      targetBonusPercent: 55,
      equityGrantValue: 1850000,
      sharesCount: 65000,
      currentStrikePrice: 28.50,
      currentSharePrice: 32.00,
      currentCompanyValuationBillion: 14.5,
      bullCaseValuationMultiplier: 3.2,
      vestingYears: 4,
      vestingSchedule: '4-Year Monthly (25% 1-Yr Cliff)',
      signingBonus: 125000,
      relocationAllowance: 60000
    },
    deliveryConfig: {
      channels: ['secure_email_link', 'executive_sms_direct'],
      sentAt: 'Oct 01, 2026 at 4:30 PM',
      expiresAt: 'Oct 21, 2026',
      accessCodeRequired: true,
      viewsCount: 14,
      totalTimeMinutes: 52,
      ndaSignedAt: 'Oct 02, 2026 at 11:14 AM',
      lastAccessedIpLocation: 'Menlo Park, California (Secure Token)'
    },
    designConfig: {
      ...DEFAULT_DEAL_ROOM_DESIGN,
      accentColor: 'var(--color-secondary-200)',
      bannerTheme: 'modern_gradient',
      headerStyle: 'standard'
    },
    stakeholders: [
      {
        id: 'stk-1',
        name: 'Satya Nadella',
        roleTitle: 'Chief Executive Officer',
        stakeholderType: 'Company CEO',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        email: 'satya@enterprise.example.com',
        isPrimaryContact: true
      },
      {
        id: 'stk-2',
        name: 'Scott Guthrie',
        roleTitle: 'EVP Cloud & AI Platform',
        stakeholderType: 'Hiring Manager',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
        email: 'scottg@enterprise.example.com',
        isPrimaryContact: true
      },
      {
        id: 'stk-3',
        name: 'Clara Higgins',
        roleTitle: 'Executive Operations & Chief of Staff',
        stakeholderType: 'Executive Assistant',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
        email: 'clara.h@enterprise.example.com'
      },
      {
        id: 'stk-4',
        name: 'Reid Hoffman',
        roleTitle: 'Board of Directors & AI Strategy Lead',
        stakeholderType: 'Board Member',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
        email: 'reid@greylock.example.com'
      },
      {
        id: 'stk-5',
        name: 'Brian Stepan',
        roleTitle: 'Lead In-House Executive Recruiter',
        stakeholderType: 'Lead Recruiter',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        email: 'brian.stepan@phenom.com',
        isPrimaryContact: true
      }
    ],
    attachments: [
      {
        id: 'att-1',
        fileName: 'Enterprise_AI_Vision_3Year_Master_Roadmap.pdf',
        fileSize: '14.2 MB',
        category: 'Strategic Brief',
        uploadedAt: 'Sep 29, 2026',
        isConfidential: true,
        downloadCount: 3
      },
      {
        id: 'att-2',
        fileName: 'Mutual_Executive_NDA_Executed.pdf',
        fileSize: '840 KB',
        category: 'Legal & NDA',
        uploadedAt: 'Oct 02, 2026',
        isConfidential: true,
        downloadCount: 2
      },
      {
        id: 'att-3',
        fileName: 'Executive_Total_Rewards_Perks_Health_Overview.pdf',
        fileSize: '6.8 MB',
        category: 'Benefits & Compensation',
        uploadedAt: 'Oct 01, 2026',
        isConfidential: false,
        downloadCount: 4
      }
    ],
    stages: [
      {
        id: 'stg-1-1',
        name: 'Stage 1: Welcome & Mutual NDA',
        order: 1,
        status: 'completed',
        description: 'Personalized executive greeting and digital execution of mutual non-disclosure agreement.',
        widgets: [
          {
            id: 'w-101',
            type: 'nda_agreement',
            title: 'Mutual Executive Confidentiality Agreement (NDA)',
            description: 'Digital execution gate protecting strategic IP, organizational charts, and candidate discussions.',
            stageId: 'stg-1-1',
            order: 1,
            isRequiredMilestone: true,
            isCompleted: true,
            config: {
              signedDate: 'Oct 02, 2026 at 11:14 AM PDT',
              signerIp: '198.51.100.44 (Menlo Park, CA)',
              documentVersion: 'v2.4 Enterprise Clean'
            }
          },
          {
            id: 'w-102',
            type: 'ceo_welcome_video',
            title: 'Welcome Video from CEO Satya Nadella',
            description: 'Personal greeting welcoming Elena to explore our in-house enterprise AI platform mandate.',
            stageId: 'stg-1-1',
            order: 2,
            isRequiredMilestone: false,
            isCompleted: true,
            config: {
              videoLength: '2m 45s',
              videoThumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
              highlightQuote: 'We are architecting the foundational intelligence layer for hundreds of millions of knowledge workers.'
            }
          }
        ]
      },
      {
        id: 'stg-1-2',
        name: 'Stage 2: Strategic Vision & Opportunity',
        order: 2,
        status: 'current',
        description: 'Deep dive into 3-year AI compute architecture, organizational scale, and core leadership deliverables.',
        widgets: [
          {
            id: 'w-201',
            type: 'opportunity_strategic',
            title: 'Strategic Mandate: Scaling Enterprise Foundation Models',
            description: 'Org chart scope (450+ engineers), $120M annual compute infrastructure budget, and P&L autonomy.',
            stageId: 'stg-1-2',
            order: 1,
            isRequiredMilestone: false,
            isCompleted: false,
            config: {
              headcountScope: '450+ Research & Infrastructure Engineers',
              arrScale: '$1.4B Recurring Annual Run-Rate',
              reportingLine: 'Direct to CEO / EVP of Cloud & AI Platform'
            }
          },
          {
            id: 'w-202',
            type: 'deal_team',
            title: 'Your Dedicated Executive Search & Leadership Deal Team',
            description: 'Tagged executives, board sponsors, and executive assistants supporting this exploration.',
            stageId: 'stg-1-2',
            order: 2,
            isRequiredMilestone: false,
            isCompleted: true
          },
          {
            id: 'w-203',
            type: 'document_attachments',
            title: 'Confidential Strategic Architecture Attachments',
            description: 'Approved board decks, 3-year compute scaling whitepaper, and executive benefits guide.',
            stageId: 'stg-1-2',
            order: 3,
            isRequiredMilestone: false,
            isCompleted: false
          }
        ]
      },
      {
        id: 'stg-1-3',
        name: 'Stage 3: Executive Interviews & Panel',
        order: 3,
        status: 'locked',
        description: 'Interview itinerary, executive panel bios, and private confidential inquiry hub.',
        widgets: [
          {
            id: 'w-301',
            type: 'executive_qna',
            title: 'Confidential Executive Q&A Channel',
            description: 'Direct asynchronous private channel between Elena and CEO Satya Nadella / Lead Recruiter.',
            stageId: 'stg-1-3',
            order: 1,
            isRequiredMilestone: false,
            isCompleted: false
          }
        ]
      },
      {
        id: 'stg-1-4',
        name: 'Stage 4: Formal Offer & Equity Modeler',
        order: 4,
        status: 'locked',
        description: 'Interactive financial calculator, equity upside scenarios, relocation package, and formal term sheet.',
        widgets: [
          {
            id: 'w-401',
            type: 'equity_calculator',
            title: 'Executive Financial & Equity Upside Modeler',
            description: 'Simulate 4-year cumulative net compensation across base, bonus, and multi-billion valuation scenarios.',
            stageId: 'stg-1-4',
            order: 1,
            isRequiredMilestone: true,
            isCompleted: false
          }
        ]
      }
    ]
  },
  {
    id: 'dr-2',
    title: 'Executive Opportunity Room: Dr. Marcus Vance — CTO Succession Bench',
    candidateId: 'cand-ai-2',
    candidateName: 'Dr. Marcus Vance',
    candidateEmail: 'm.vance@anthropic.example.com',
    candidateCurrentRole: 'Head of Foundation Models & Distributed Systems',
    candidateCurrentCompany: 'Anthropic',
    candidateAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
    candidateLocation: 'San Francisco, CA',
    targetRole: 'Chief Technology Officer (CTO)',
    department: 'Engineering & AI',
    status: 'NDA Signed',
    templateId: 'tpl-confidential-tech',
    templateName: 'Confidential Technical Leadership Suite',
    createdAt: 'Oct 02, 2026',
    lastActive: 'Yesterday at 4:10 PM',
    leadRecruiter: 'Brian Stepan',
    currentStageId: 'stg-2-2',
    financialModel: {
      baseSalary: 520000,
      targetBonusPercent: 60,
      equityGrantValue: 2400000,
      sharesCount: 90000,
      currentStrikePrice: 32.00,
      currentSharePrice: 36.50,
      currentCompanyValuationBillion: 16.0,
      bullCaseValuationMultiplier: 3.5,
      vestingYears: 4,
      vestingSchedule: '4-Year Monthly (25% 1-Yr Cliff)',
      signingBonus: 150000,
      relocationAllowance: 0
    },
    deliveryConfig: {
      channels: ['secure_email_link', 'linkedin_inmail_private'],
      sentAt: 'Oct 03, 2026 at 1:15 PM',
      expiresAt: 'Oct 24, 2026',
      accessCodeRequired: true,
      viewsCount: 9,
      totalTimeMinutes: 38,
      ndaSignedAt: 'Oct 04, 2026 at 2:20 PM',
      lastAccessedIpLocation: 'San Francisco, California (Encrypted Link)'
    },
    stakeholders: [
      {
        id: 'stk-21',
        name: 'Satya Nadella',
        roleTitle: 'Chief Executive Officer',
        stakeholderType: 'Company CEO',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        email: 'satya@enterprise.example.com',
        isPrimaryContact: true
      },
      {
        id: 'stk-22',
        name: 'Brian Stepan',
        roleTitle: 'Lead In-House Executive Recruiter',
        stakeholderType: 'Lead Recruiter',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        email: 'brian.stepan@phenom.com',
        isPrimaryContact: true
      }
    ],
    attachments: [
      {
        id: 'att-201',
        fileName: 'NextGen_Virtualization_HyperCompute_Brief.pdf',
        fileSize: '18.4 MB',
        category: 'Strategic Brief',
        uploadedAt: 'Oct 02, 2026',
        isConfidential: true,
        downloadCount: 4
      }
    ],
    stages: [
      {
        id: 'stg-2-1',
        name: 'Stage 1: Confidentiality & NDA',
        order: 1,
        status: 'completed',
        description: 'Mutual non-disclosure execution for confidential CTO succession bench mandate.',
        widgets: [
          {
            id: 'w-210',
            type: 'nda_agreement',
            title: 'Confidential Succession Non-Disclosure Agreement',
            description: 'Executed bilateral confidentiality covering board governance discussions.',
            stageId: 'stg-2-1',
            order: 1,
            isRequiredMilestone: true,
            isCompleted: true
          }
        ]
      },
      {
        id: 'stg-2-2',
        name: 'Stage 2: Technical Architecture & Mandate',
        order: 2,
        status: 'current',
        description: 'Review of planetary edge compute topology and GPU cluster infrastructure.',
        widgets: [
          {
            id: 'w-220',
            type: 'opportunity_strategic',
            title: 'CTO Mandate: Planet-Scale Distributed Compute',
            description: 'Direct leadership of 1,200+ engineers, patent portfolio, and core virtualization runtime.',
            stageId: 'stg-2-2',
            order: 1,
            isRequiredMilestone: false,
            isCompleted: false
          },
          {
            id: 'w-221',
            type: 'equity_calculator',
            title: 'Equity Upside & Valuation Modeling',
            description: 'Interactive calculator projecting value at $20B, $35B, and $50B market cap milestones.',
            stageId: 'stg-2-2',
            order: 2,
            isRequiredMilestone: false,
            isCompleted: false
          }
        ]
      }
    ]
  },
  {
    id: 'dr-3',
    title: 'Executive Opportunity Room: David Sterling — Global CISO',
    candidateId: 'cand-sec-1',
    candidateName: 'David Sterling',
    candidateEmail: 'david.sterling@crowdstrike.example.com',
    candidateCurrentRole: 'Global CISO & Head of Trust',
    candidateCurrentCompany: 'CrowdStrike',
    candidateAvatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80',
    candidateLocation: 'Austin, TX (Willing to Relocate)',
    targetRole: 'Chief Information Security Officer (CISO)',
    department: 'Security & Infrastructure',
    status: 'Offer Stage',
    templateId: 'tpl-offer-closing',
    templateName: 'Executive Offer & Equity Closing Room',
    createdAt: 'Sep 15, 2026',
    lastActive: 'Today at 8:15 AM',
    leadRecruiter: 'Brian Stepan',
    currentStageId: 'stg-3-2',
    financialModel: {
      baseSalary: 420000,
      targetBonusPercent: 50,
      equityGrantValue: 1450000,
      sharesCount: 50000,
      currentStrikePrice: 26.00,
      currentSharePrice: 29.00,
      currentCompanyValuationBillion: 12.0,
      bullCaseValuationMultiplier: 2.8,
      vestingYears: 4,
      vestingSchedule: '4-Year Monthly (25% 1-Yr Cliff)',
      signingBonus: 100000,
      relocationAllowance: 75000
    },
    deliveryConfig: {
      channels: ['secure_email_link', 'ea_confidential_dispatch'],
      sentAt: 'Sep 20, 2026',
      expiresAt: 'Oct 18, 2026',
      accessCodeRequired: true,
      viewsCount: 22,
      totalTimeMinutes: 74,
      ndaSignedAt: 'Sep 21, 2026',
      lastAccessedIpLocation: 'Austin, Texas'
    },
    stakeholders: [
      {
        id: 'stk-31',
        name: 'Satya Nadella',
        roleTitle: 'Chief Executive Officer',
        stakeholderType: 'Company CEO',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        email: 'satya@enterprise.example.com',
        isPrimaryContact: true
      },
      {
        id: 'stk-32',
        name: 'Amy Hood',
        roleTitle: 'Chief Financial Officer & EVP',
        stakeholderType: 'Hiring Manager',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
        email: 'amy.hood@enterprise.example.com',
        isPrimaryContact: true
      },
      {
        id: 'stk-33',
        name: 'Brian Stepan',
        roleTitle: 'Lead In-House Executive Recruiter',
        stakeholderType: 'Lead Recruiter',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        email: 'brian.stepan@phenom.com',
        isPrimaryContact: true
      }
    ],
    attachments: [
      {
        id: 'att-301',
        fileName: 'Formal_Executive_Offer_Letter_TermSheet_DavidSterling.pdf',
        fileSize: '1.2 MB',
        category: 'Offer Package',
        uploadedAt: 'Oct 04, 2026',
        isConfidential: true,
        downloadCount: 6
      }
    ],
    stages: [
      {
        id: 'stg-3-1',
        name: 'Stage 1: Term Sheet Review',
        order: 1,
        status: 'completed',
        description: 'Executed term sheet overview with Board audit committee reporting stipulations.',
        widgets: [
          {
            id: 'w-310',
            type: 'nda_agreement',
            title: 'Board Non-Disclosure Agreement',
            description: 'Signed compliance confidentiality protocol.',
            stageId: 'stg-3-1',
            order: 1,
            isRequiredMilestone: true,
            isCompleted: true
          }
        ]
      },
      {
        id: 'stg-3-2',
        name: 'Stage 2: Financial Calculator & Equity Scenario',
        order: 2,
        status: 'current',
        description: 'Comprehensive financial modeler with Austin-to-HQ relocation analysis.',
        widgets: [
          {
            id: 'w-320',
            type: 'equity_calculator',
            title: 'Executive Total Compensation & Equity Scenario Modeler',
            description: 'Interact with base salary ($420k), target bonus ($210k), and projected RSU upside.',
            stageId: 'stg-3-2',
            order: 1,
            isRequiredMilestone: true,
            isCompleted: false
          },
          {
            id: 'w-321',
            type: 'deal_team',
            title: 'Deal Team & Executive Sponsors',
            description: 'Direct contact lines to CEO, CFO, and Lead In-House Recruiter.',
            stageId: 'stg-3-2',
            order: 2,
            isRequiredMilestone: false,
            isCompleted: true
          }
        ]
      }
    ]
  },
  {
    id: 'dr-4',
    title: 'Executive Opportunity Room: Sarah Sandberg — Chief Marketing Officer',
    candidateId: 'c-2',
    candidateName: 'Sarah Sandberg',
    candidateEmail: 'sarahs@meta.example.com',
    candidateCurrentRole: 'Chief Marketing Officer',
    candidateCurrentCompany: 'Meta',
    candidateAvatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&h=120&fit=crop&q=80',
    candidateLocation: 'Menlo Park, CA',
    targetRole: 'Chief Marketing Officer (CMO)',
    department: 'Marketing & Brand Strategy',
    status: 'In Review',
    templateId: 'tpl-flagship-csuite',
    templateName: 'C-Suite & Executive Flagship Experience',
    createdAt: 'Oct 04, 2026',
    lastActive: 'Today at 10:15 AM',
    leadRecruiter: 'Brian Stepan',
    currentStageId: 'stg-4-1',
    financialModel: {
      baseSalary: 450000,
      targetBonusPercent: 50,
      equityGrantValue: 1600000,
      sharesCount: 55000,
      currentStrikePrice: 28.50,
      currentSharePrice: 32.00,
      currentCompanyValuationBillion: 14.5,
      bullCaseValuationMultiplier: 3.0,
      vestingYears: 4,
      vestingSchedule: '4-Year Monthly (25% 1-Yr Cliff)',
      signingBonus: 100000,
      relocationAllowance: 40000
    },
    deliveryConfig: {
      channels: ['secure_email_link', 'executive_sms_direct'],
      sentAt: 'Oct 04, 2026 at 2:00 PM',
      expiresAt: 'Oct 25, 2026',
      accessCodeRequired: true,
      viewsCount: 8,
      totalTimeMinutes: 34,
      ndaSignedAt: 'Oct 05, 2026 at 9:30 AM',
      lastAccessedIpLocation: 'Menlo Park, California (Secure Token)'
    },
    stakeholders: [
      {
        id: 'stk-401',
        name: 'Brian Stepan',
        roleTitle: 'Managing Partner & Executive Lead',
        stakeholderType: 'Lead Recruiter',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
        email: 'bstepan@firm.example.com',
        phone: '+1 415-555-0199',
        isPrimaryContact: true
      }
    ],
    attachments: [
      {
        id: 'att-401',
        fileName: 'Executive Brand & Growth Mandate 2027.pdf',
        fileSize: '4.2 MB',
        category: 'Strategic Brief',
        uploadedAt: 'Oct 04, 2026',
        isConfidential: true,
        downloadCount: 3
      }
    ],
    stages: [
      {
        id: 'stg-4-1',
        name: 'Introduction & Mutual NDA',
        order: 1,
        status: 'completed',
        description: 'Bilateral confidentiality gate and preliminary mandate briefing',
        widgets: [
          {
            id: 'w-401',
            type: 'nda_agreement',
            title: 'Mutual Bilateral Non-Disclosure Agreement',
            description: 'Executed bilateral confidentiality and trade secret protocol.',
            stageId: 'stg-4-1',
            order: 1,
            isRequiredMilestone: true,
            isCompleted: true
          }
        ]
      },
      {
        id: 'stg-4-2',
        name: 'Strategic Vision & Marketing Opportunity',
        order: 2,
        status: 'current',
        description: 'Comprehensive financial, equity modeling, and brand leadership vision',
        widgets: [
          {
            id: 'w-402',
            type: 'equity_calculator',
            title: 'Executive Equity & Compensation Modeler',
            description: 'Interactive modeling tool projecting base, bonus, and multi-year valuation equity.',
            stageId: 'stg-4-2',
            order: 1,
            isRequiredMilestone: true,
            isCompleted: false
          }
        ]
      }
    ]
  }
];
