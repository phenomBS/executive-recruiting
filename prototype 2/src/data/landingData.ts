import { Candidate, Company } from '../types';

export interface PendingFeedbackItem {
  id: string;
  hiringManagerName: string;
  hiringManagerTitle: string;
  hiringManagerEmail: string;
  hiringManagerAvatar: string;
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  candidateAvatar?: string;
  projectId: string;
  projectName: string;
  clientCompany: string;
  requestedDate: string;
  daysPending: number;
  remindersSent: number;
  lastReminderDate?: string;
  interviewStage: string;
}

export interface FeedbackSummaryItem {
  id: string;
  projectName: string;
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  candidateAvatar?: string;
  hiringManagerName: string;
  hiringManagerTitle: string;
  hiringManagerAvatar: string;
  score: number; // 0 to 10
  decision: 'accepted' | 'rejected' | 'pending';
  receivedDate: string;
  notesTags: string[]; // e.g. "Follow up required", "Check references", "Clarify experience", "Strong cultural fit"
  additionalNotes: string;
  sharedWithReviewers: boolean;
}

export interface MarketInsightItem {
  id: string;
  companyName: string;
  companyLogo?: string;
  category: 'realtime_slack' | 'weekly_digest';
  sourceTag: string; // e.g. "Real-time Slack Update" or "Weekly Email Digest"
  headline: string;
  triggerEvent: string;
  timeAgo: string;
  growthType: 'headcount' | 'funding' | 'traffic' | 'leadership' | 'milestone';
  affectedExecutivesCount: number;
  affectedExecutives: {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
    mobilityScore: number;
  }[];
  nurtureStatus: 'pending' | 'nurturing' | 'completed';
}

export interface AgentNurtureActivity {
  id: string;
  agentName: 'Phenom Aura Agent' | 'Aura Agent' | 'Prime Agent' | 'Talent Intelligence Bot';
  candidateName: string;
  candidateRole: string;
  candidateCompany: string;
  candidateAvatar?: string;
  actionType: 'sent' | 'opened' | 'replied' | 'meeting_booked';
  timestamp: string;
  subject: string;
  preview: string;
  replySnippet?: string;
  sentiment?: 'positive' | 'neutral' | 'inquiry';
}

export interface RecruiterFollowupItem {
  id: string;
  priority: 'urgent' | 'high' | 'medium';
  title: string;
  description: string;
  candidateOrContact: string;
  candidateAvatar?: string;
  associatedProject: string;
  dueDate: string;
  actionLabel: string;
  actionType: 'reply_email' | 'schedule_call' | 'adjust_spec' | 'review_counter';
}

// Initial Mock Pending Feedback (Waiting on Hiring Managers)
export const initialPendingFeedback: PendingFeedbackItem[] = [
  {
    id: 'pf-1',
    hiringManagerName: 'Satya Nadella',
    hiringManagerTitle: 'Chief Executive Officer',
    hiringManagerEmail: 'snadella@clientcorp.example.com',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
    candidateId: 'rc-1',
    candidateName: 'Elena Rostova',
    candidateRole: 'VP of Artificial Intelligence',
    candidateAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
    projectId: 'p-2',
    projectName: 'VP Product - AI Systems',
    clientCompany: 'Vertex AI Systems',
    requestedDate: 'Sep 30, 2026',
    daysPending: 3,
    remindersSent: 1,
    lastReminderDate: 'Yesterday at 9:15 AM',
    interviewStage: 'Final Round Panel Calibration'
  },
  {
    id: 'pf-2',
    hiringManagerName: 'David Chen',
    hiringManagerTitle: 'Board Audit Committee Chair',
    hiringManagerEmail: 'dchen@boardgovernance.example.com',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
    candidateId: 'c-1',
    candidateName: 'John Ternus',
    candidateRole: 'Chief Executive Officer candidate',
    candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
    projectId: 'p-1',
    projectName: 'Chief Executive Officer',
    clientCompany: 'Acme Corporation',
    requestedDate: 'Oct 1, 2026',
    daysPending: 2,
    remindersSent: 0,
    interviewStage: 'Board Slate Review & Governance Vetting'
  },
  {
    id: 'pf-3',
    hiringManagerName: 'Marcus Vance',
    hiringManagerTitle: 'Chief Technology Officer',
    hiringManagerEmail: 'mvance@techcorp.example.com',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80',
    candidateId: 'rc-2',
    candidateName: 'Marcus Vance',
    candidateRole: 'VP of Engineering',
    candidateAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&q=80',
    projectId: 'p-3',
    projectName: 'Chief Technology Officer Search',
    clientCompany: 'Global FinTech Corp',
    requestedDate: 'Sep 29, 2026',
    daysPending: 4,
    remindersSent: 2,
    lastReminderDate: 'Oct 1, 2026 at 4:30 PM',
    interviewStage: 'Technical Architecture Defense'
  },
  {
    id: 'pf-4',
    hiringManagerName: 'Dr. Sarah Jenkins',
    hiringManagerTitle: 'Search Committee Lead',
    hiringManagerEmail: 'sjenkins@execsearch.example.com',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
    candidateId: 'c-2',
    candidateName: 'Sarah Sandberg',
    candidateRole: 'Chief Marketing Officer',
    candidateAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&h=120&fit=crop&q=80',
    projectId: 'p-1',
    projectName: 'Chief Marketing Officer Mandate',
    clientCompany: 'Enterprise Cloud Corp',
    requestedDate: 'Sep 28, 2026',
    daysPending: 5,
    remindersSent: 1,
    lastReminderDate: 'Sep 30, 2026',
    interviewStage: 'Initial Competency Alignment'
  }
];

// Feedback Received (Matching Screenshot 2 & 3 Feedback Model)
export const initialReceivedFeedback: FeedbackSummaryItem[] = [
  {
    id: 'rf-1',
    projectName: 'VP of Artificial Intelligence (Vertex AI Systems)',
    candidateId: 'rc-1',
    candidateName: 'Elena Rostova',
    candidateRole: 'VP of Artificial Intelligence',
    candidateAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
    hiringManagerName: 'Dr. Sarah Jenkins',
    hiringManagerTitle: 'VP of Executive Talent & Search Committee Lead',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
    score: 8.5,
    decision: 'accepted',
    receivedDate: '2 hours ago',
    notesTags: ['Follow up required', 'Check references', 'High P&L Scale Experience'],
    additionalNotes: 'Exceptional depth in frontier models and autonomous infrastructure. Elena clearly demonstrated executive command over distributed engineering teams. We should verify her non-compete window.',
    sharedWithReviewers: true
  },
  {
    id: 'rf-2',
    projectName: 'Chief Technology Officer (Global FinTech Corp)',
    candidateId: 'c-1',
    candidateName: 'John Ternus',
    candidateRole: 'SVP Systems & Engineering',
    candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
    hiringManagerName: 'Marcus Vance',
    hiringManagerTitle: 'CTO & Technical Search Sponsor',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80',
    score: 9.0,
    decision: 'accepted',
    receivedDate: 'Yesterday at 4:15 PM',
    notesTags: ['Clarify experience', 'Strategic Thinker', 'Executive Presence'],
    additionalNotes: 'Outstanding technical vision and global hardware/software integration background. Handled high-pressure supply chain scenario with absolute clarity. Highest recommendation for Board slate.',
    sharedWithReviewers: true
  },
  {
    id: 'rf-3',
    projectName: 'CFO Retained Search (Acme Corporation)',
    candidateId: 'rc-3',
    candidateName: 'Timothy Teter',
    candidateRole: 'General Counsel & Corporate Secretary',
    candidateAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
    hiringManagerName: 'Elena Rostova',
    hiringManagerTitle: 'Chief People & Culture Officer',
    hiringManagerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
    score: 5.0,
    decision: 'pending',
    receivedDate: 'Sep 30, 2026',
    notesTags: ['Follow up required', 'Check references', 'Clarify experience', 'Other'],
    additionalNotes: 'Solid governance background, but may need more public company SEC filing velocity. Recommend conducting deeper 360 reference audit before scheduling full panel.',
    sharedWithReviewers: false
  }
];

// Market Insights & Affected Executives (Exact visual format of Screenshot 1)
export const initialMarketInsights: MarketInsightItem[] = [
  {
    id: 'mi-1',
    companyName: 'Canal',
    category: 'realtime_slack',
    sourceTag: 'Real-time slack update',
    headline: 'Passive pipeline',
    triggerEvent: 'Engineering headcount grew 50% in last three months',
    timeAgo: '15 min ago',
    growthType: 'headcount',
    affectedExecutivesCount: 8,
    affectedExecutives: [
      { id: 'ae-1', name: 'Darren Vance', role: 'VP of Platform Engineering', mobilityScore: 92 },
      { id: 'ae-2', name: 'Sofia Rodriguez', role: 'Head of Infrastructure Reliability', mobilityScore: 89 },
      { id: 'ae-3', name: 'Liam Sterling', role: 'Director of Machine Learning', mobilityScore: 85 }
    ],
    nurtureStatus: 'pending'
  },
  {
    id: 'mi-2',
    companyName: 'Sapient.ai',
    category: 'realtime_slack',
    sourceTag: 'Real-time slack update',
    headline: 'Passive pipeline',
    triggerEvent: 'Just raised a Series A, with participation from top-tier seed investors',
    timeAgo: '1 hour ago',
    growthType: 'funding',
    affectedExecutivesCount: 5,
    affectedExecutives: [
      { id: 'ae-4', name: 'Alexander Wright', role: 'Co-Founder & VP Engineering', mobilityScore: 91 },
      { id: 'ae-5', name: 'Chloe Kim', role: 'Head of Product Design', mobilityScore: 88 }
    ],
    nurtureStatus: 'pending'
  },
  {
    id: 'mi-3',
    companyName: 'TableTalk',
    category: 'realtime_slack',
    sourceTag: 'Real-time slack update',
    headline: 'Passive pipeline',
    triggerEvent: 'Saw a 115% increase in web traffic in the last month',
    timeAgo: '3 hours ago',
    growthType: 'traffic',
    affectedExecutivesCount: 12,
    affectedExecutives: [
      { id: 'ae-6', name: 'Rachel Green', role: 'Chief Growth Officer', mobilityScore: 94 },
      { id: 'ae-7', name: 'Michael Scott', role: 'VP of Sales & Alliances', mobilityScore: 86 }
    ],
    nurtureStatus: 'pending'
  },
  {
    id: 'mi-4',
    companyName: 'Clearify',
    category: 'weekly_digest',
    sourceTag: 'Weekly email digest',
    headline: 'New opportunities',
    triggerEvent: 'Hired a new CFO from Goldman Sachs',
    timeAgo: 'Yesterday',
    growthType: 'leadership',
    affectedExecutivesCount: 6,
    affectedExecutives: [
      { id: 'ae-8', name: 'David Miller', role: 'VP Finance & Controller', mobilityScore: 93 },
      { id: 'ae-9', name: 'Jessica Taylor', role: 'Director of Strategic Planning', mobilityScore: 90 }
    ],
    nurtureStatus: 'pending'
  },
  {
    id: 'mi-5',
    companyName: 'Brightpath',
    category: 'weekly_digest',
    sourceTag: 'Weekly email digest',
    headline: 'New opportunities',
    triggerEvent: 'Headcount grew by 100% year-over-year',
    timeAgo: '2 days ago',
    growthType: 'headcount',
    affectedExecutivesCount: 14,
    affectedExecutives: [
      { id: 'ae-10', name: 'Brian Gallagher', role: 'Chief Technology Officer', mobilityScore: 95 },
      { id: 'ae-11', name: 'Nadia Petrov', role: 'VP of People Operations', mobilityScore: 87 }
    ],
    nurtureStatus: 'pending'
  },
  {
    id: 'mi-6',
    companyName: 'Medstats',
    category: 'weekly_digest',
    sourceTag: 'Weekly email digest',
    headline: 'New opportunities',
    triggerEvent: 'Startup from 2nd time founder entering healthcare enterprise space',
    timeAgo: '3 days ago',
    growthType: 'milestone',
    affectedExecutivesCount: 4,
    affectedExecutives: [
      { id: 'ae-12', name: 'Dr. Kevin Zhao', role: 'Chief Medical Officer', mobilityScore: 89 }
    ],
    nurtureStatus: 'pending'
  },
  {
    id: 'mi-7',
    companyName: 'GreenSignal',
    category: 'weekly_digest',
    sourceTag: 'Weekly email digest',
    headline: 'New opportunities',
    triggerEvent: '$3M seed round just raised for clean tech logistics',
    timeAgo: '4 days ago',
    growthType: 'funding',
    affectedExecutivesCount: 3,
    affectedExecutives: [
      { id: 'ae-13', name: 'Eric Thorne', role: 'Head of Operations & Supply Chain', mobilityScore: 91 }
    ],
    nurtureStatus: 'pending'
  }
];

// Agent Nurture Outbound & Responses
export const initialAgentActivities: AgentNurtureActivity[] = [
  {
    id: 'ana-1',
    agentName: 'Phenom Aura Agent',
    candidateName: 'Elena Rostova',
    candidateRole: 'VP of Artificial Intelligence',
    candidateCompany: 'Meta',
    candidateAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
    actionType: 'replied',
    timestamp: '25 min ago',
    subject: 'Re: Confidential leadership conversation — Chief AI Architect mandate',
    preview: 'I received your note regarding the confidential initiative. I am open to a discreet introductory conversation next Tuesday after 4 PM PT.',
    replySnippet: '"Open to a discreet conversation next Tuesday after 4 PM PT."',
    sentiment: 'positive'
  },
  {
    id: 'ana-2',
    agentName: 'Phenom Aura Agent',
    candidateName: 'John Ternus',
    candidateRole: 'SVP Systems & Engineering',
    candidateCompany: 'Apple',
    candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
    actionType: 'opened',
    timestamp: '1 hour ago',
    subject: 'Executive Advisory Council & Governance Opportunity',
    preview: 'Candidate opened the confidential board opportunity teaser for the 3rd time in 48 hours.'
  },
  {
    id: 'ana-3',
    agentName: 'Phenom Aura Agent',
    candidateName: 'Marcus Vance',
    candidateRole: 'Chief Technology Officer',
    candidateCompany: 'Stripe',
    candidateAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&q=80',
    actionType: 'meeting_booked',
    timestamp: '3 hours ago',
    subject: 'Introductory Calibration Call Confirmed',
    preview: 'Meeting scheduled for Oct 8 at 10:00 AM PT via Phenom Executive Calendar.'
  },
  {
    id: 'ana-4',
    agentName: 'Phenom Aura Agent',
    candidateName: 'Colette Kress',
    candidateRole: 'Chief Financial Officer',
    candidateCompany: 'NVIDIA',
    candidateAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
    actionType: 'sent',
    timestamp: '4 hours ago',
    subject: 'Confidential Leadership Mandate — Audit Committee & Advisory',
    preview: 'Outbound sequence Step 1 dispatched: Tailored benchmark briefing on Board composition trends.'
  }
];

// Recruiter Follow-up Required
export const initialRecruiterFollowups: RecruiterFollowupItem[] = [
  {
    id: 'rfu-1',
    priority: 'urgent',
    title: 'Candidate replied with scheduling availability',
    description: 'Elena Rostova is ready for a confidential briefing call next Tuesday at 4 PM PT.',
    candidateOrContact: 'Elena Rostova (Meta)',
    candidateAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
    associatedProject: 'VP Product - AI Systems (Vertex AI)',
    dueDate: 'Today by 5:00 PM',
    actionLabel: 'Confirm Calendar Invite',
    actionType: 'schedule_call'
  },
  {
    id: 'rfu-2',
    priority: 'high',
    title: 'Hiring Manager requested 2 more candidates with public market P&L',
    description: 'Satya Nadella reviewed slate and requested 2 additional candidates with $500M+ P&L track record.',
    candidateOrContact: 'Satya Nadella (Hiring Manager)',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
    associatedProject: 'VP Product - AI Systems',
    dueDate: 'Tomorrow at 12:00 PM',
    actionLabel: 'Calibrate Search Filters',
    actionType: 'adjust_spec'
  },
  {
    id: 'rfu-3',
    priority: 'high',
    title: 'Overdue Board feedback reminder pending',
    description: 'David Chen has not submitted evaluation for candidate John Ternus (2 days overdue).',
    candidateOrContact: 'David Chen (Board Director)',
    candidateAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
    associatedProject: 'Chief Executive Officer (Acme)',
    dueDate: 'Overdue by 2 days',
    actionLabel: 'Send 1-Click Reminder',
    actionType: 'reply_email'
  },
  {
    id: 'rfu-4',
    priority: 'medium',
    title: 'Market trigger alert: Canal leadership expansion',
    description: 'Canal grew engineering headcount 50%. 8 tracked executives have spiked mobility indicators.',
    candidateOrContact: '8 Executives at Canal',
    associatedProject: 'Executive Talent Network',
    dueDate: 'This Week',
    actionLabel: 'Review & Nurture',
    actionType: 'reply_email'
  }
];
