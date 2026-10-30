import { InterviewFeedback } from '../types';

export const initialMockFeedback: InterviewFeedback[] = [
  {
    id: 'fb-1',
    candidateId: 'c-1', // John Ternus
    giver: {
      id: 'g-1',
      name: 'Dr. Sarah Jenkins',
      title: 'VP of Executive Talent & Search Committee Lead',
      department: 'Executive Search & Governance',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
      email: 'sjenkins@execsearch.example.com'
    },
    stage: 'Round 1: Executive Competency & Vision',
    date: 'Sep 28, 2026',
    rating: 10,
    recommendation: 'strong_hire',
    quickTags: [
      '+ Strategic Thinker',
      '+ High P&L Scale Experience',
      '+ Executive Presence',
      '+ Articulate Communicator',
      '+ Talent Magnet'
    ],
    competencyRatings: [
      { competency: 'Strategic Vision & P&L Scale', score: 10, notes: 'Commanding grasp of 100K+ headcount enterprise operations and multi-billion margin structures.' },
      { competency: 'Executive Presence & Communication', score: 10, notes: 'Compelling boardroom presence; answers directly with quantitative data.' },
      { competency: 'People Leadership & Cultural Impact', score: 9, notes: 'Deep track record of developing VP and SVP leaders over 10+ years.' },
      { competency: 'Operational Resilience & Agility', score: 10, notes: 'Demonstrated exceptional calm and structured thinking under regulatory pressure.' },
      { competency: 'Innovation & Disruption Mindset', score: 9, notes: 'Laser-focused on hardware-AI convergence without losing product quality discipline.' }
    ],
    strengths: [
      'Mastery of global hardware supply chains and cross-functional hardware/software matrix environments.',
      'Exceptional clarity of vision: outlined an actionable 3-year product roadmap within 15 minutes of discussion.',
      'Natural executive gravitas; commands high respect from peer C-suite officers and engineering fellows.'
    ],
    risksOrConcerns: [
      'Very high baseline compensation expectation ($8.5M+ total target comp); equity package needs Compensation Committee sign-off.',
      'Strict confidentiality requirements around transition announcement timing.'
    ],
    summaryNotes: 'John is unequivocally the top tier candidate for this retained search. He combines deep engineering credibility with refined C-level governance. His answers during the scenario analysis on supply chain reallocation were world-class. Strongest possible recommendation to proceed to the Board slate.',
    transcriptHighlights: [
      '"Our focus has never been to ship first; it is to ship the defining category standard at unmatched operating scale."',
      '"When leading 30,000 engineers, clarity of interface between hardware architecture and AI silicon is paramount."'
    ]
  },
  {
    id: 'fb-2',
    candidateId: 'c-1', // John Ternus
    giver: {
      id: 'g-2',
      name: 'Marcus Vance',
      title: 'Chief Technology Officer',
      department: 'Engineering & Technology',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
      email: 'mvance@techcorp.example.com'
    },
    stage: 'Round 2: Technical Architecture & Systems Deep Dive',
    date: 'Sep 25, 2026',
    rating: 9,
    recommendation: 'strong_hire',
    quickTags: [
      '+ Deep Technical Mastery',
      '+ Decisive Leadership',
      '+ Visionary Product Mind',
      '+ Cross-Functional Driver'
    ],
    competencyRatings: [
      { competency: 'Strategic Vision & P&L Scale', score: 9, notes: 'Understands technology investments in the context of capital efficiency.' },
      { competency: 'Executive Presence & Communication', score: 9, notes: 'Speaks engineering fluently without getting trapped in weeds.' },
      { competency: 'People Leadership & Cultural Impact', score: 9, notes: 'Inspires deep technical confidence among principal architects.' },
      { competency: 'Operational Resilience & Agility', score: 9, notes: 'Solid playbook for handling silicon shortages and geopolitical constraints.' },
      { competency: 'Innovation & Disruption Mindset', score: 10, notes: 'Brilliant perspective on on-device neural processing.' }
    ],
    strengths: [
      'Rare executive who can toggle seamlessly from board-level capital allocation to nanometer chip architecture.',
      'Refused buzzwords; focused on latency, thermal efficiency, and developer ecosystem cohesion.',
      'Strong proponent of vertical integration where margins justify R&D intensity.'
    ],
    risksOrConcerns: [
      'Accustomed to near-limitless R&D capital expenditure; may need to calibrate expectations if cash reserves require strict pacing.'
    ],
    summaryNotes: 'Technically flawless. He probed our existing architectural bottlenecks with surgeon-like precision within the first ten minutes. He is not just an administrator; he is an engineer at heart who understands how modern compute pipelines function. Absolute hire.',
    transcriptHighlights: [
      '"If the hardware substrate cannot support single-watt model inference, the cloud cost will degrade unit economics at scale."'
    ]
  },
  {
    id: 'fb-3',
    candidateId: 'c-1', // John Ternus
    giver: {
      id: 'g-3',
      name: 'Elena Rostova',
      title: 'Chief People & Culture Officer',
      department: 'Human Resources & Executive Talent',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
      email: 'erostova@peoplesolutions.example.com'
    },
    stage: 'Round 3: Leadership Philosophy & Culture Alignment',
    date: 'Sep 23, 2026',
    rating: 9,
    recommendation: 'hire',
    quickTags: [
      '+ Cultural Catalyst',
      '+ Talent Magnet',
      '+ Decisive Leadership',
      '~ High Comp Expectation'
    ],
    competencyRatings: [
      { competency: 'Strategic Vision & P&L Scale', score: 8, notes: 'Focuses heavily on people accountability and leadership bench strength.' },
      { competency: 'Executive Presence & Communication', score: 10, notes: 'Calm, thoughtful, listens actively before offering synthesized responses.' },
      { competency: 'People Leadership & Cultural Impact', score: 10, notes: 'Exceptional retention metrics across his direct and indirect reports.' },
      { competency: 'Operational Resilience & Agility', score: 9, notes: 'Fosters high psychological safety paired with demanding excellence.' },
      { competency: 'Innovation & Disruption Mindset', score: 8, notes: 'Prefers steady compounding evolution over chaotic restructuring.' }
    ],
    strengths: [
      'Deep commitment to talent development; multiple former subordinates now lead major industry divisions.',
      'Zero ego in collaborative discussions; demonstrated genuine curiosity about our team dynamics.',
      'High alignment with our values of transparency and disciplined execution.'
    ],
    risksOrConcerns: [
      'Candidate is currently in a 25-year tenure environment; cultural change management will require conscious onboarding support.'
    ],
    summaryNotes: 'John showed great emotional intelligence and values alignment. His perspective on navigating high-scrutiny leadership transitions was inspiring. He would be an exemplary culture champion for the executive team.',
    transcriptHighlights: [
      '"Culture is what happens when the CEO isn\'t in the room; standardizing our values into daily engineering habits is what sustains decades of trust."'
    ]
  },
  {
    id: 'fb-4',
    candidateId: 'c-1', // John Ternus
    giver: {
      id: 'g-4',
      name: 'David Chen',
      title: 'Independent Board Director & Audit Committee Chair',
      department: 'Board of Directors',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
      email: 'dchen@boardgovernance.example.com'
    },
    stage: 'Round 4: Board Governance & Fiduciary Alignment',
    date: 'Sep 20, 2026',
    rating: 8,
    recommendation: 'hire',
    quickTags: [
      '+ High P&L Scale Experience',
      '+ Strategic Thinker',
      '~ 6-Month Notice Period',
      '~ High Comp Expectation'
    ],
    competencyRatings: [
      { competency: 'Strategic Vision & P&L Scale', score: 9, notes: 'Thoroughly grasps shareholder return mechanisms and earnings call nuances.' },
      { competency: 'Executive Presence & Communication', score: 9, notes: 'Very comfortable presenting to seasoned board directors.' },
      { competency: 'People Leadership & Cultural Impact', score: 8, notes: 'Good grasp of compensation committee governance.' },
      { competency: 'Operational Resilience & Agility', score: 8, notes: 'Pragmatic risk management perspective.' },
      { competency: 'Innovation & Disruption Mindset', score: 8, notes: 'Understands risk-adjusted capital deployment.' }
    ],
    strengths: [
      'Prudent fiduciary stewardship; answered our working capital questions with precision.',
      'Strong understanding of board reporting cycles and investor relations strategy.'
    ],
    risksOrConcerns: [
      '6-month notice period and non-solicitation parameters need legal clearance before offer finalization.'
    ],
    summaryNotes: 'Solid governance acumen. John demonstrated that he can manage external analyst scrutiny while protecting core operational investments. I am in favor of proceeding to final board ratification.',
    transcriptHighlights: [
      '"Fiduciary duty is not about avoiding risk; it is about choosing which risks create disproportionate long-term shareholder value."'
    ]
  },
  {
    id: 'fb-5',
    candidateId: 'c-2', // Sarah Sandberg
    giver: {
      id: 'g-1',
      name: 'Dr. Sarah Jenkins',
      title: 'VP of Executive Talent & Search Committee Lead',
      department: 'Executive Search & Governance',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
      email: 'sjenkins@execsearch.example.com'
    },
    stage: 'Round 1: Executive Competency & Global GTM',
    date: 'Sep 26, 2026',
    rating: 9,
    recommendation: 'strong_hire',
    quickTags: [
      '+ Strategic Thinker',
      '+ High P&L Scale Experience',
      '+ Articulate Communicator',
      '+ Visionary Product Mind'
    ],
    competencyRatings: [
      { competency: 'Strategic Vision & P&L Scale', score: 10, notes: 'Global marketing scale across billions of daily active users.' },
      { competency: 'Executive Presence & Communication', score: 9, notes: 'Charismatic, articulate, exceptional public speaker.' },
      { competency: 'People Leadership & Cultural Impact', score: 9, notes: 'Scaled teams across 4 continents.' },
      { competency: 'Operational Resilience & Agility', score: 8, notes: 'Navigated intense international regulatory scrutiny.' },
      { competency: 'Innovation & Disruption Mindset', score: 9, notes: 'Pioneered AI-driven performance marketing systems.' }
    ],
    strengths: [
      'Peerless brand strategy pedigree; knows how to drive product adoption at planetary scale.',
      'High energy, decisive strategic direction.'
    ],
    risksOrConcerns: [
      'Notice period and equity clawback windows need structured buyout guarantee.'
    ],
    summaryNotes: 'Outstanding candidate with unmatched global consumer branding credentials. Recommended for immediate slate inclusion.',
    transcriptHighlights: [
      '"A brand is an enduring operating promise, not an ad campaign."'
    ]
  }
];
