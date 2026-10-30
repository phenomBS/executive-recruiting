export interface RecruiterContactEvent {
  id: string;
  recruiterName: string;
  recruiterTitle: string;
  recruiterAvatar: string;
  contactDate: string;
  channel: 'Phone Call' | 'Video Meeting' | 'Executive Coffee' | 'Email' | 'LinkedIn InMail' | 'Aura AI Outreach' | 'Slate Calibration';
  whyContacted: string; // Specific reason why the recruiter initiated this contact
  summaryNotes: string; // Detailed interaction notes
  candidateSentiment: 'Highly Receptive' | 'Warm & Engaged' | 'Evaluating Timing' | 'Passive / Monitoring' | 'Compensation Sensitive';
  nextAction?: string;
  nextActionDate?: string;
}

export interface CandidateRelationshipRecord {
  id: string;
  name: string;
  currentRole: string;
  currentTitle?: string;
  company: string;
  avatarUrl: string;
  location: string;
  email: string;
  phone: string;
  relationshipStatus: 'Active Dialogue' | 'Warm Nurture' | 'Calibrating Slate' | 'Initial Outreach' | 'Executive Referrals';
  leadRecruiterOwner: string;
  firstContactDate: string;
  lastContactDate: string;
  totalTouchpoints: number;
  executiveSummary: string;
  timeline: RecruiterContactEvent[];
}

export const initialProjectRelationships: CandidateRelationshipRecord[] = [
  {
    id: 'rel-cand-1',
    name: 'Elena Rostova',
    currentRole: 'VP of AI Research & Platforms',
    currentTitle: 'VP of AI Research & Platforms',
    company: 'Meta',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
    location: 'Menlo Park, CA (Open to Seattle)',
    email: 'elena.rostova@meta.example.com',
    phone: '+1 (415) 890-2341',
    relationshipStatus: 'Active Dialogue',
    leadRecruiterOwner: 'Brian Stepan',
    firstContactDate: 'Sep 12, 2026',
    lastContactDate: 'Yesterday at 3:15 PM',
    totalTouchpoints: 4,
    executiveSummary: 'Tier-1 AI platform leader currently overseeing 400+ research engineers. Receptive to in-house mandate following Meta organizational reorganization.',
    timeline: [
      {
        id: 'evt-101',
        recruiterName: 'Brian Stepan',
        recruiterTitle: 'Lead In-House Executive Recruiter',
        recruiterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        contactDate: 'Yesterday at 3:15 PM',
        channel: 'Phone Call',
        whyContacted: 'Market Signal Follow-Up: SEC Form 4 showed upcoming 30-day vesting cliff ($2.1M grant tranche); probed timing for executive transition.',
        summaryNotes: 'Held 35-minute calibration call. Elena confirmed her multi-year initial grant cliff completes next month. Very enthusiastic about our in-house enterprise AI platform vision and autonomous agent roadmap.',
        candidateSentiment: 'Highly Receptive',
        nextAction: 'Deliver confidential executive search briefing dossier and schedule CEO alignment session.',
        nextActionDate: 'Oct 10, 2026'
      },
      {
        id: 'evt-102',
        recruiterName: 'Sarah Jenkins',
        recruiterTitle: 'Senior Executive Talent Partner',
        recruiterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
        contactDate: 'Sep 26, 2026',
        channel: 'Executive Coffee',
        whyContacted: 'In-Person Calibration: Met during San Francisco AI Hardware Summit to build relationship and discuss organizational scaling culture.',
        summaryNotes: 'Discussed engineering retention dynamics, GPU cluster procurement autonomy, and our in-house culture. Elena indicated she desires true P&L accountability rather than pure research publishing.',
        candidateSentiment: 'Warm & Engaged',
        nextAction: 'Connect with Brian Stepan for formal compensation benchmarking overview.',
        nextActionDate: 'Oct 02, 2026'
      },
      {
        id: 'evt-103',
        recruiterName: 'Phenom Aura Agent (on behalf of Brian Stepan)',
        recruiterTitle: 'AI Executive Search Intelligence Partner',
        recruiterAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
        contactDate: 'Sep 18, 2026',
        channel: 'Aura AI Outreach',
        whyContacted: 'Strategic Market Reorg Touchpoint: Congratulated Elena on published LLaMA infrastructure whitepaper and initiated confidential warm connection.',
        summaryNotes: 'Dispatched personalized research-backed outreach referencing her distributed training work. Candidate responded in 4 hours expressing openness to confidential dialogue.',
        candidateSentiment: 'Warm & Engaged',
        nextAction: 'Convert warm reply to direct call with Lead Recruiter Brian Stepan.',
        nextActionDate: 'Sep 19, 2026'
      },
      {
        id: 'evt-104',
        recruiterName: 'Brian Stepan',
        recruiterTitle: 'Lead In-House Executive Recruiter',
        recruiterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        contactDate: 'Sep 12, 2026',
        channel: 'LinkedIn InMail',
        whyContacted: 'Initial Talent Intelligence Mapping: Identified Elena through internal talent graph matching our role scope.',
        summaryNotes: 'Sent high-touch executive InMail referencing our strategic hiring priorities and mutuality through Stanford AI lab alumni.',
        candidateSentiment: 'Evaluating Timing',
        nextAction: 'Queue automated Aura thought leadership follow-up.',
        nextActionDate: 'Sep 18, 2026'
      }
    ]
  },
  {
    id: 'rel-cand-2',
    name: 'Dr. Marcus Vance',
    currentRole: 'Head of Foundation Models & Distributed Systems',
    currentTitle: 'Head of Foundation Models & Distributed Systems',
    company: 'Anthropic',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
    location: 'San Francisco, CA',
    email: 'm.vance@anthropic.example.com',
    phone: '+1 (415) 345-9812',
    relationshipStatus: 'Active Dialogue',
    leadRecruiterOwner: 'Brian Stepan',
    firstContactDate: 'Sep 05, 2026',
    lastContactDate: '3 days ago',
    totalTouchpoints: 3,
    executiveSummary: 'Architected distributed model training on 30,000+ clusters. Seeking commercial scale and governance exposure beyond venture-backed lab.',
    timeline: [
      {
        id: 'evt-201',
        recruiterName: 'Brian Stepan',
        recruiterTitle: 'Lead In-House Executive Recruiter',
        recruiterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        contactDate: '3 days ago',
        channel: 'Video Meeting',
        whyContacted: 'Intake Calibration & Deep-Dive: Reviewed target headcount scope (300-800 engineers) and compensation parity ceiling.',
        summaryNotes: 'Conducted 45-minute video discussion. Marcus shared that reporting line changes in Anthropic commercial group created an inflection point. Very aligned with our target base salary and equity structure.',
        candidateSentiment: 'Highly Receptive',
        nextAction: 'Schedule confidential introductory calibration with CTO & Hiring Committee.',
        nextActionDate: 'Oct 14, 2026'
      },
      {
        id: 'evt-202',
        recruiterName: 'Michael Chang',
        recruiterTitle: 'Executive Search Director',
        recruiterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
        contactDate: 'Sep 15, 2026',
        channel: 'Phone Call',
        whyContacted: 'Referral Verification & Screening: Followed up on backchannel endorsement from mutual former OpenAI engineering director.',
        summaryNotes: 'Spoke regarding technical leadership style and organizational retention. Marcus was receptive to an in-house leadership transition.',
        candidateSentiment: 'Warm & Engaged',
        nextAction: 'Hand off to Lead Recruiter Brian Stepan for mandate calibration.',
        nextActionDate: 'Sep 22, 2026'
      },
      {
        id: 'evt-203',
        recruiterName: 'Michael Chang',
        recruiterTitle: 'Executive Search Director',
        recruiterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
        contactDate: 'Sep 05, 2026',
        channel: 'Email',
        whyContacted: 'Initial Outreach: Contacted Marcus regarding executive succession and our strategic AI leadership search.',
        summaryNotes: 'Outlined mandate scope and requested brief confidential chat. Response received within 24 hours.',
        candidateSentiment: 'Warm & Engaged',
        nextAction: 'Set up screening call.',
        nextActionDate: 'Sep 15, 2026'
      }
    ]
  },
  {
    id: 'rel-cand-3',
    name: 'Sofia Rodriguez',
    currentRole: 'VP of Data Intelligence & ML Systems',
    currentTitle: 'VP of Data Intelligence & ML Systems',
    company: 'Databricks',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
    location: 'San Francisco, CA',
    email: 'sofia.rodriguez@databricks.example.com',
    phone: '+1 (415) 782-9011',
    relationshipStatus: 'Calibrating Slate',
    leadRecruiterOwner: 'Sarah Jenkins',
    firstContactDate: 'Aug 28, 2026',
    lastContactDate: '5 days ago',
    totalTouchpoints: 3,
    executiveSummary: 'Overlapping engineering leadership ranks post-merger at Databricks created high mobility. Strong infrastructure reliability background.',
    timeline: [
      {
        id: 'evt-301',
        recruiterName: 'Sarah Jenkins',
        recruiterTitle: 'Senior Executive Talent Partner',
        recruiterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
        contactDate: '5 days ago',
        channel: 'Phone Call',
        whyContacted: 'M&A Restructuring Follow-Up: Reached out following Bloomberg report on Tabular/MosaicML leadership consolidation.',
        summaryNotes: 'Sofia acknowledged organizational redundancy at the VP level. Open to exploring a primary in-house leadership chair where she owns all data platforms end-to-end.',
        candidateSentiment: 'Warm & Engaged',
        nextAction: 'Prepare formal slate submission for hiring manager review.',
        nextActionDate: 'Oct 12, 2026'
      },
      {
        id: 'evt-302',
        recruiterName: 'Sarah Jenkins',
        recruiterTitle: 'Senior Executive Talent Partner',
        recruiterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
        contactDate: 'Sep 10, 2026',
        channel: 'Email',
        whyContacted: 'Compensation Calibration: Shared preliminary compensation bands ($410k-$460k Base + Equity) to confirm expectations.',
        summaryNotes: 'Candidate reviewed the band and confirmed it meets expectations given our equity growth trajectory.',
        candidateSentiment: 'Warm & Engaged',
        nextAction: 'Schedule deeper dive post-merger integration announcements.',
        nextActionDate: 'Oct 01, 2026'
      },
      {
        id: 'evt-303',
        recruiterName: 'Sarah Jenkins',
        recruiterTitle: 'Senior Executive Talent Partner',
        recruiterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
        contactDate: 'Aug 28, 2026',
        channel: 'LinkedIn InMail',
        whyContacted: 'Talent Sourcing Introduction: Noted Sofia speaking at Databricks Data+AI Summit and introduced our in-house executive mandate.',
        summaryNotes: 'High-touch message congratulating her on keynote presentation.',
        candidateSentiment: 'Passive / Monitoring',
        nextAction: 'Follow up with compensation overview.',
        nextActionDate: 'Sep 10, 2026'
      }
    ]
  },
  {
    id: 'rel-cand-4',
    name: 'David Sterling',
    currentRole: 'Global CISO & Head of Trust',
    currentTitle: 'Global CISO & Head of Trust',
    company: 'CrowdStrike',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80',
    location: 'Austin, TX (Willing to Relocate)',
    email: 'david.sterling@crowdstrike.example.com',
    phone: '+1 (512) 674-1290',
    relationshipStatus: 'Warm Nurture',
    leadRecruiterOwner: 'Brian Stepan',
    firstContactDate: 'Aug 20, 2026',
    lastContactDate: '1 week ago',
    totalTouchpoints: 2,
    executiveSummary: 'Veteran public company security leader. Reached 4-year cumulative equity vest. Open to enterprise platform governance challenges.',
    timeline: [
      {
        id: 'evt-401',
        recruiterName: 'Brian Stepan',
        recruiterTitle: 'Lead In-House Executive Recruiter',
        recruiterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        contactDate: '1 week ago',
        channel: 'Phone Call',
        whyContacted: 'SEC Vesting Verification: Checked in as David approached 4-year equity rollover milestone to test relocation appetite.',
        summaryNotes: 'David confirmed readiness to relocate to headquarters. Interested in board audit committee visibility and enterprise scale.',
        candidateSentiment: 'Evaluating Timing',
        nextAction: 'Queue next touchpoint following Q3 earnings quiet period.',
        nextActionDate: 'Nov 04, 2026'
      },
      {
        id: 'evt-402',
        recruiterName: 'Brian Stepan',
        recruiterTitle: 'Lead In-House Executive Recruiter',
        recruiterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        contactDate: 'Aug 20, 2026',
        channel: 'Email',
        whyContacted: 'Executive Network Re-engagement: Prior colleague connection re-opening dialogue on security leadership mandate.',
        summaryNotes: 'Warm exchange. David agreed to reconnect quarterly.',
        candidateSentiment: 'Warm & Engaged',
        nextAction: 'Monitor SEC Edgar filings for vesting milestones.',
        nextActionDate: 'Sep 25, 2026'
      }
    ]
  },
  {
    id: 'rel-cand-5',
    name: 'Jordan Rivera',
    currentRole: 'VP of Product, Developer Experience',
    currentTitle: 'VP of Product, Developer Experience',
    company: 'Stripe',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
    location: 'Seattle, WA',
    email: 'jordan.rivera@stripe.example.com',
    phone: '+1 (206) 459-8812',
    relationshipStatus: 'Active Dialogue',
    leadRecruiterOwner: 'Sarah Jenkins',
    firstContactDate: 'Sep 01, 2026',
    lastContactDate: '4 days ago',
    totalTouchpoints: 3,
    executiveSummary: 'Product-led growth specialist with deep API platform experience. Secondary equity monetization completed; seeking broader enterprise scope.',
    timeline: [
      {
        id: 'evt-501',
        recruiterName: 'Sarah Jenkins',
        recruiterTitle: 'Senior Executive Talent Partner',
        recruiterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
        contactDate: '4 days ago',
        channel: 'Video Meeting',
        whyContacted: 'Strategic Slate Review: Conducted detailed review of developer API monetization deliverables and organizational chart design.',
        summaryNotes: 'Very productive session. Jordan walked through scaling developer documentation and self-serve onboarding. Ready to meet our Chief Product Officer.',
        candidateSentiment: 'Highly Receptive',
        nextAction: 'Submit formal candidate debrief to hiring committee.',
        nextActionDate: 'Oct 09, 2026'
      },
      {
        id: 'evt-502',
        recruiterName: 'Sarah Jenkins',
        recruiterTitle: 'Senior Executive Talent Partner',
        recruiterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
        contactDate: 'Sep 14, 2026',
        channel: 'Phone Call',
        whyContacted: 'Liquidity Tender Check-In: Reached out following Stripe private secondary window to gauge liquidity and tenure motivation.',
        summaryNotes: 'Jordan confirmed secondary tender allowed monetization of early grant. Looking for new career milestone with enterprise AI platform.',
        candidateSentiment: 'Warm & Engaged',
        nextAction: 'Schedule deep-dive video session on organizational mandate.',
        nextActionDate: 'Oct 02, 2026'
      },
      {
        id: 'evt-503',
        recruiterName: 'Phenom Aura Agent (on behalf of Sarah Jenkins)',
        recruiterTitle: 'AI Executive Search Intelligence Partner',
        recruiterAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
        contactDate: 'Sep 01, 2026',
        channel: 'Aura AI Outreach',
        whyContacted: 'Initial Sourcing Signal: AI flagged high propensity to move after 38 months in role without title expansion.',
        summaryNotes: 'Discreet leadership outreach inquiring about appetite for leading a global developer platform.',
        candidateSentiment: 'Warm & Engaged',
        nextAction: 'Follow up with recruiter call.',
        nextActionDate: 'Sep 14, 2026'
      }
    ]
  },
  {
    id: 'rel-cand-6',
    name: 'Alexander Wright',
    currentRole: 'Chief Technology Officer',
    currentTitle: 'Chief Technology Officer',
    company: 'Cloudflare',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
    location: 'San Francisco, CA',
    email: 'awright@cloudflare.example.com',
    phone: '+1 (415) 912-4401',
    relationshipStatus: 'Executive Referrals',
    leadRecruiterOwner: 'Brian Stepan',
    firstContactDate: 'Aug 10, 2026',
    lastContactDate: '2 weeks ago',
    totalTouchpoints: 2,
    executiveSummary: 'Proven CTO managing planet-scale edge systems. Unvested cliff expiring Q4. Looking for next-decade generational infrastructure mandate.',
    timeline: [
      {
        id: 'evt-601',
        recruiterName: 'Brian Stepan',
        recruiterTitle: 'Lead In-House Executive Recruiter',
        recruiterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        contactDate: '2 weeks ago',
        channel: 'Executive Coffee',
        whyContacted: 'Long-Horizon Succession Relationship: Calibrated long-term alignment for executive succession bench planning.',
        summaryNotes: 'Met in downtown San Francisco. Alexander was generous with time. Discussed AI edge computing transformations and Board committee reporting.',
        candidateSentiment: 'Warm & Engaged',
        nextAction: 'Maintain monthly confidential check-ins.',
        nextActionDate: 'Oct 28, 2026'
      },
      {
        id: 'evt-602',
        recruiterName: 'Brian Stepan',
        recruiterTitle: 'Lead In-House Executive Recruiter',
        recruiterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
        contactDate: 'Aug 10, 2026',
        channel: 'Phone Call',
        whyContacted: 'Confidential Executive Outreach: Initiated dialogue on in-house engineering succession roadmap.',
        summaryNotes: 'Established mutual rapport. Agreed to in-person coffee calibration.',
        candidateSentiment: 'Warm & Engaged',
        nextAction: 'Book coffee meeting during tech conference.',
        nextActionDate: 'Sep 20, 2026'
      }
    ]
  }
];
