/**
 * Where each agent-recommended candidate (mockRecommendedCandidates) would fit today:
 * open projects (Projects) and jobs (tracked roles in Roles & Succession).
 */
export interface CandidateMatch {
  kind: 'project' | 'job';
  /** Matches a project title in Projects or a role title in Roles & Succession */
  title: string;
  /** 0-100 fit between the candidate and this project or job */
  fit: number;
  reason: string;
}

export const recommendedCandidateMatches: Record<string, CandidateMatch[]> = {
  // Elena Rostova, VP of Artificial Intelligence
  'rc-1': [
    { kind: 'job', title: 'VP of Artificial Intelligence', fit: 96, reason: 'Runs applied model deployment at the scale of the target seat' },
    { kind: 'project', title: 'VP of Engineering', fit: 91, reason: 'Leads 300+ engineers across research and platform' },
  ],
  // Marcus Vance, Chief Product Officer
  'rc-2': [
    { kind: 'job', title: 'Chief Product Officer (CPO) Bench', fit: 95, reason: 'Already holds the title at a comparable company' },
    { kind: 'job', title: 'VP of Product, Developer Platform', fit: 93, reason: 'Owned developer platform roadmap and pricing' },
    { kind: 'project', title: 'Senior Product Manager', fit: 88, reason: 'Overqualified for the level, useful as a sourcing reference' },
  ],
  // Aria Sterling, SVP Global Operations & Infrastructure
  'rc-3': [
    { kind: 'job', title: 'VP of Infrastructure Engineering Bench', fit: 90, reason: 'Operates global infrastructure at a larger scope' },
    { kind: 'project', title: 'VP of Engineering', fit: 82, reason: 'Strong delivery record, lighter on product engineering' },
  ],
  // David Chen, EVP & Head of Engineering
  'rc-4': [
    { kind: 'project', title: 'VP of Engineering', fit: 94, reason: 'Direct match on scope, headcount and public-company experience' },
    { kind: 'job', title: 'Chief Technology Officer (CTO) Bench', fit: 89, reason: 'On the path to a CTO seat with board exposure' },
  ],
  // Rachel Thorne, Chief Information Security Officer
  'rc-5': [
    { kind: 'project', title: 'Chief Information Security Officer (CISO)', fit: 97, reason: 'Federal compliance and board reporting match the brief' },
    { kind: 'job', title: 'Chief Information Security Officer (CISO)', fit: 97, reason: 'Matches the tracked requisition and its bench anchors' },
  ],
  // Kavita Patel, VP of Product Engineering
  'rc-6': [
    { kind: 'job', title: 'VP of Product, Developer Platform', fit: 91, reason: 'Product engineering leader for a developer-facing platform' },
    { kind: 'project', title: 'Senior Product Manager', fit: 84, reason: 'Understands the product bar; a step down in level' },
  ],
};
