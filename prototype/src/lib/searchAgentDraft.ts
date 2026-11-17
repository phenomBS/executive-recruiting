import type { ProjectParameters, ProjectRoleLevel, ProjectWorkModel } from '../types';
import { mockCandidates } from '../data/mockData';
import type { PipelineSeedCandidate } from './roleProject';

export type SearchAgentDraft = {
  title: string;
  description: string;
  parameters: ProjectParameters;
  seedPipeline: PipelineSeedCandidate[];
};

const ACRONYMS = new Set(['ai', 'ceo', 'cfo', 'chro', 'ciso', 'cio', 'cmo', 'coo', 'cto', 'evp', 'svp', 'vp']);

function titleCase(value: string) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => {
      const bare = word.replace(/[^a-z]/gi, '').toLowerCase();
      if (ACRONYMS.has(bare)) return word.replace(/[a-z]+/gi, match => match.toUpperCase());
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function roleLevel(text: string): ProjectRoleLevel {
  const lower = text.toLowerCase();
  if (/\b(chief|cfo|ceo|coo|ciso|cio|cto|cmo|chro)\b/.test(lower)) return 'C-Suite';
  if (/\b(evp|executive vice president)\b/.test(lower)) return 'Executive Vice President';
  if (/\b(svp|senior vice president)\b/.test(lower)) return 'Senior Vice President';
  if (/\b(vp|vice president)\b/.test(lower)) return 'Vice President';
  if (/\bdirector\b/.test(lower)) return 'Senior Director';
  return 'Vice President';
}

function domain(text: string) {
  const lower = text.toLowerCase();
  if (/financ|cfo|controller|treasury/.test(lower)) return { name: 'Corporate Finance', keywords: ['Finance', 'Financial leadership', 'Stewardship'] };
  if (/security|ciso|cyber/.test(lower)) return { name: 'Platform Security & Identity', keywords: ['Security', 'Identity', 'Risk'] };
  if (/engineer|infrastructure|technology/.test(lower)) return { name: 'Infrastructure & Cloud Computing', keywords: ['Engineering', 'Infrastructure', 'Technology'] };
  if (/product/.test(lower)) return { name: 'Enterprise B2B SaaS', keywords: ['Product', 'SaaS', 'Platform'] };
  if (/market/.test(lower)) return { name: 'Enterprise B2B SaaS', keywords: ['Marketing', 'Growth', 'Brand'] };
  if (/operation|\bcoo\b/.test(lower)) return { name: 'Enterprise B2B SaaS', keywords: ['Operations', 'Scale', 'Execution'] };
  return { name: 'Enterprise B2B SaaS', keywords: ['Executive leadership'] };
}

const METROS: { test: RegExp; market: string }[] = [
  { test: /bay area|san francisco|silicon valley/i, market: 'San Francisco Bay Area' },
  { test: /new york|nyc/i, market: 'New York Metro Area' },
  { test: /seattle/i, market: 'Seattle-Bellevue' },
  { test: /austin/i, market: 'Austin Metro' },
  { test: /boston/i, market: 'Boston-Cambridge' },
  { test: /washington|d\.?c\.?/i, market: 'Washington DC Metro' },
  { test: /chicago/i, market: 'Chicago Metro' },
  { test: /london|united kingdom|\buk\b/i, market: 'London / UK' },
  { test: /remote/i, market: 'Remote (US / Global)' },
];

function marketsFor(location: string, full: string) {
  const known = METROS.filter(item => item.test.test(full)).map(item => item.market);
  if (known.length > 0) return known;
  if (location) return [titleCase(location)];
  return ['San Francisco Bay Area'];
}

function compensation(level: ProjectRoleLevel) {
  if (level === 'C-Suite') return { base: 420000, max: 483000, ceiling: 756000, ote: '40% bonus', equity: 'To be calibrated' };
  if (level === 'Executive Vice President' || level === 'Senior Vice President') return { base: 360000, max: 414000, ceiling: 648000, ote: '35% bonus', equity: 'To be calibrated' };
  return { base: 280000, max: 322000, ceiling: 504000, ote: '30% bonus', equity: 'To be calibrated' };
}

function slateFor(title: string, location: string): PipelineSeedCandidate[] {
  const words = title.toLowerCase().split(/[^a-z0-9]+/).filter(word => word.length > 2);
  const place = location.toLowerCase();
  const ranked = mockCandidates
    .map(candidate => {
      const hay = `${candidate.role} ${candidate.executiveData.function} ${candidate.executiveData.areasOfExpertise} ${candidate.location}`.toLowerCase();
      let score = words.reduce((total, word) => total + (hay.includes(word) ? 2 : 0), 0);
      if (place && hay.includes(place)) score += 3;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || b.candidate.emiScore - a.candidate.emiScore);
  const matched = ranked.filter(item => item.score > 0);
  const chosen = (matched.length > 0 ? matched : ranked).slice(0, 8);
  return chosen.map(item => ({
    ...item.candidate,
    projectStatus: 'Identified',
    dateAdded: '2026-11-17',
  }));
}

/** Turn a recruiter's mandate, notes, and document text into a filled project draft. */
export function draftFromMandate(mandate: string, documentNotes: string): SearchAgentDraft {
  const combined = [mandate.trim(), documentNotes.trim()].filter(Boolean).join('\n\n');
  const locationMatch = combined.match(/\bin\s+([A-Za-z][A-Za-z .'-]{1,40})/i);
  const location = locationMatch ? locationMatch[1].replace(/[.,]$/, '').trim() : '';
  const roleSource = locationMatch ? combined.slice(0, locationMatch.index).trim() : combined.split(/[.\n]/)[0].trim();
  const title = titleCase(roleSource || 'Executive Search');
  const level = roleLevel(combined);
  const area = domain(combined);
  const pay = compensation(level);
  const remote = /remote/i.test(combined);
  const parameters: ProjectParameters = {
    primaryTitle: title,
    equivalentTitles: [],
    roleLevel: level,
    functionalDomain: area.name,
    domainKeywords: [...area.keywords, location].filter(Boolean),
    targetBaseSalary: pay.base,
    maxBaseBudget: pay.max,
    variableOTE: pay.ote,
    equityGrantValue: pay.equity,
    maxTotalCompensationCeiling: pay.ceiling,
    targetCompanyStage: level === 'C-Suite' ? 'Growth to public' : 'Series B–D ($20M–$100M ARR)',
    requiredPandLScope: level === 'C-Suite' ? 'Executive scope matching the mandate' : 'Functional leadership scope',
    teamHeadcountScale: 'Leadership team',
    workModel: (remote ? 'Remote' : 'Hybrid') as ProjectWorkModel,
    hybridDaysPerWeek: remote ? undefined : 3,
    targetMetropolitanMarkets: marketsFor(location, combined),
    relocationWillingness: !/no relocation|will not relocate/i.test(combined),
    targetStartDate: '2027-03-01',
    maxNoticePeriodTolerance: level === 'C-Suite' ? '90 days' : '60 days',
    confidentialityProtocol: /confidential/i.test(combined) ? 'Strictly Confidential Blind Teaser' : 'Named Enterprise Search',
  };
  const description = documentNotes.trim()
    ? `${mandate.trim()}\n\nFrom the attached notes: ${documentNotes.trim()}`
    : mandate.trim();
  return {
    title,
    description,
    parameters,
    seedPipeline: slateFor(title, location),
  };
}
