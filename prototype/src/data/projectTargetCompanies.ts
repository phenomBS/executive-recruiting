import type { Company, Project } from '../types';
import { initialDirectoryCompanies, DirectoryCompany } from './companyDirectoryData';
import { mockCompanies } from './mockData';

/** A company targeted by a project, plus why it fits. */
export interface TargetCompany {
  id: string;
  name: string;
  industry: string;
  headquarters: string;
  size: string;
  revenue: string;
  website: string;
  description: string;
  stage?: string;
  relevantCandidatesCount: number;
  activeLeadershipChanges: number;
  activeSearchesCount: number;
  matchReason: string;
  /** agent: matched to the project's details; added: picked from the CRM or master repository; created: new record */
  source: 'agent' | 'added' | 'created';
}

type Source = DirectoryCompany | Company;

function toTarget(c: Source, matchReason: string, source: TargetCompany['source']): TargetCompany {
  const d = c as DirectoryCompany;
  return {
    id: c.id,
    name: c.name,
    industry: c.industry,
    headquarters: c.headquarters,
    size: c.size,
    revenue: c.revenue,
    website: c.website,
    description: c.description,
    stage: d.stage,
    relevantCandidatesCount: c.relevantCandidatesCount,
    activeLeadershipChanges: c.activeLeadershipChanges,
    activeSearchesCount: c.activeSearchesCount,
    matchReason,
    source,
  };
}

/* ------------------------------------------------------------------ */
/* Session state                                                       */
/* ------------------------------------------------------------------ */

const createdCompanies: TargetCompany[] = [];
const byProject = new Map<string, TargetCompany[]>();

/** Companies created in this session join the pool so they can be found and picked again. */
export function registerCreatedCompany(c: TargetCompany) {
  if (!createdCompanies.some(x => x.name.toLowerCase() === c.name.toLowerCase())) createdCompanies.push(c);
}

/** Every company the app knows about: the master repository plus the CRM plus anything created this session. */
function masterRepository(): Source[] {
  const seen = new Set<string>();
  const all: Source[] = [];
  [...initialDirectoryCompanies, ...mockCompanies, ...(createdCompanies as unknown as Source[])].forEach(c => {
    const k = c.name.toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    all.push(c);
  });
  return all;
}

/** Every known company name, for pickers that also accept free text. */
export const listMasterCompanyNames = () => masterRepository().map(c => c.name).sort((a, b) => a.localeCompare(b));

export const masterRepositorySize = () => masterRepository().length;

/** Companies already in the CRM, for the "existing companies" picker. */
export function listExistingCompanies(): TargetCompany[] {
  const crm: TargetCompany[] = mockCompanies.map(c =>
    toTarget(c, `In your CRM with ${c.crmCandidatesCount} candidates tracked.`, 'added')
  );
  const seen = new Set(crm.map(c => c.name.toLowerCase()));
  return [...crm, ...createdCompanies.filter(c => !seen.has(c.name.toLowerCase()))];
}

/** The full company record behind a target company, so its profile page can open from any project. */
export function findCompanyProfile(id: string): Company | null {
  const known = [...mockCompanies, ...initialDirectoryCompanies].find(c => c.id === id);
  if (known) return known;
  const made = createdCompanies.find(c => c.id === id);
  if (!made) return null;
  return {
    id: made.id,
    name: made.name,
    industry: made.industry,
    size: made.size,
    revenue: made.revenue,
    headquarters: made.headquarters,
    website: made.website,
    description: made.description,
    executivesCount: 0,
    relevantCandidatesCount: made.relevantCandidatesCount,
    crmCandidatesCount: 0,
    activeLeadershipChanges: made.activeLeadershipChanges,
    activeSearchesCount: made.activeSearchesCount,
    lastUpdated: 'Just now',
    growthIndicators: [],
    recentAcquisitions: [],
    activeOpenings: [],
    strategicInitiatives: [],
  };
}

export function findCompanyByName(name: string): boolean {
  const n = name.trim().toLowerCase();
  return masterRepository().some(c => c.name.toLowerCase() === n);
}

export function getProjectTargetCompanies(project: Project): TargetCompany[] {
  const hit = byProject.get(project.id);
  if (hit) return hit;
  const initial = matchCompaniesToProject(project, 6);
  byProject.set(project.id, initial);
  return initial;
}

export function saveProjectTargetCompanies(projectId: string, list: TargetCompany[]) {
  byProject.set(projectId, list);
}

/* ------------------------------------------------------------------ */
/* Topic vocabulary shared by project matching and natural language    */
/* ------------------------------------------------------------------ */

const TOPICS: { industry: string; label: string; words: string[] }[] = [
  { industry: 'Financial Technology & Payments', label: 'fintech and payments', words: ['fintech', 'financial', 'finance', 'cfo', 'payments', 'payment', 'banking', 'treasury', 'capital markets', 'fp&a', 'billing'] },
  { industry: 'Cybersecurity & Network Defense', label: 'cybersecurity', words: ['security', 'cyber', 'cybersecurity', 'ciso', 'secops', 'fedramp', 'threat', 'zero trust', 'identity'] },
  { industry: 'Advanced Computing & Systems', label: 'AI and advanced computing', words: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'llms', 'inference', 'generative', 'foundation model'] },
  { industry: 'Cloud Infrastructure & DevOps', label: 'cloud infrastructure', words: ['cloud', 'devops', 'infrastructure', 'distributed systems', 'platform engineering', 'kubernetes', 'observability'] },
  { industry: 'Data & Analytics', label: 'data and analytics', words: ['data', 'analytics', 'warehouse', 'lakehouse', 'database'] },
  { industry: 'Enterprise B2B SaaS', label: 'enterprise SaaS', words: ['saas', 'software', 'b2b', 'enterprise software', 'developer platform', 'api', 'product', 'collaboration'] },
  { industry: 'Semiconductors & Systems', label: 'semiconductors', words: ['semiconductor', 'semiconductors', 'chip', 'chips', 'silicon', 'hardware'] },
  { industry: 'HealthTech & Digital Health', label: 'digital health', words: ['health', 'healthcare', 'healthtech', 'clinical', 'life sciences'] },
  { industry: 'E-Commerce & Marketplaces', label: 'e-commerce', words: ['e-commerce', 'ecommerce', 'marketplace', 'marketplaces', 'retail'] },
];

const has = (text: string, word: string) =>
  new RegExp(`(^|[^a-z0-9])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z0-9])`, 'i').test(text);

function topicsIn(text: string) {
  const t = text.toLowerCase();
  return TOPICS.filter(tp => tp.words.some(w => has(t, w)));
}

/** Phrases people use for places, mapped to the headquarters text they should match. */
const PLACES: { phrases: string[]; hq: string[]; label: string }[] = [
  { phrases: ['bay area', 'silicon valley', 'sf bay'], hq: ['san francisco', 'palo alto', 'mountain view', 'san jose', 'santa clara', 'sunnyvale', 'menlo park', 'redwood', 'cupertino', 'oakland', 'south san francisco', 'san mateo'], label: 'the Bay Area' },
  { phrases: ['san francisco', 'sf'], hq: ['san francisco'], label: 'San Francisco' },
  { phrases: ['new york', 'nyc'], hq: ['new york', 'brooklyn'], label: 'New York' },
  { phrases: ['seattle'], hq: ['seattle', 'bellevue', 'redmond'], label: 'Seattle' },
  { phrases: ['austin', 'texas'], hq: ['austin', 'tx'], label: 'Austin' },
  { phrases: ['boston'], hq: ['boston', 'cambridge, ma'], label: 'Boston' },
  { phrases: ['washington', 'dc'], hq: ['washington', 'mclean', 'reston', 'va'], label: 'the Washington DC area' },
];

const STOP = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'are', 'who', 'have', 'has', 'companies', 'company', 'find', 'show',
  'me', 'get', 'any', 'all', 'some', 'good', 'best', 'top', 'based', 'in', 'of', 'to', 'a', 'an', 'on', 'at', 'or', 'like',
  'similar', 'big', 'large', 'small', 'growing', 'fast', 'hiring', 'leaders', 'leadership', 'executive', 'executives',
]);

/* ------------------------------------------------------------------ */
/* Match a project to companies                                        */
/* ------------------------------------------------------------------ */

export function matchCompaniesToProject(project: Project, limit = 6): TargetCompany[] {
  const p = project.parameters;
  // Title and functional domain say what the search is; keywords and equivalent titles only refine it
  const core = [project.title, p?.primaryTitle, p?.functionalDomain].filter(Boolean).join(' ');
  const fine = [...(p?.domainKeywords ?? []), ...(p?.equivalentTitles ?? [])].join(' ');
  const weights = new Map<string, number>();
  topicsIn(core).forEach(t => weights.set(t.industry, (weights.get(t.industry) ?? 0) + 2));
  topicsIn(fine).forEach(t => weights.set(t.industry, (weights.get(t.industry) ?? 0) + 1));
  const top = Math.max(0, ...weights.values());
  const topics = TOPICS.filter(t => (weights.get(t.industry) ?? 0) >= Math.max(1, top * 0.5));
  const industries = new Set(topics.map(t => t.industry));
  const stageText = (p?.targetCompanyStage ?? '').toLowerCase();
  const senior = p?.roleLevel === 'C-Suite' || p?.roleLevel === 'Executive Vice President' || p?.roleLevel === 'Senior Vice President';
  const keywords = [...(p?.domainKeywords ?? [])].map(k => k.toLowerCase());

  const scored = masterRepository().map(c => {
    const d = c as DirectoryCompany;
    let score = 0;
    const reasons: string[] = [];

    const topic = topics.find(t => t.industry === c.industry);
    if (topic) {
      score += 40;
      reasons.push(`Operates in ${topic.label}, the domain of this search`);
    }

    if (d.stage) {
      const fitsStage =
        (stageText.includes('series') && d.stage === 'Series B-D') ||
        ((stageText.includes('pre-ipo') || stageText.includes('unicorn')) && d.stage === 'Pre-IPO Unicorn') ||
        (stageText.includes('public') && d.stage.startsWith('Public')) ||
        (stageText.includes('mega') && d.stage.startsWith('Mega'));
      if (fitsStage) {
        score += 15;
        reasons.push(`${d.stage} matches the target company stage`);
      } else if (senior && (d.stage.startsWith('Mega') || d.stage.startsWith('Public'))) {
        score += 8;
        reasons.push(`${d.stage} scale suits a ${p?.roleLevel} hire`);
      } else if (!senior && (d.stage === 'Pre-IPO Unicorn' || d.stage === 'Series B-D')) {
        score += 8;
        reasons.push(`${d.stage} growth fits this level`);
      }
    }

    const hay = [c.description, ...c.activeOpenings, ...c.strategicInitiatives, ...c.growthIndicators].join(' ').toLowerCase();
    const kwHits = keywords.filter(k => k.length > 3 && hay.includes(k)).slice(0, 2);
    if (kwHits.length) {
      score += kwHits.length * 6;
      reasons.push(`Mentions ${kwHits.join(' and ')} in its strategy`);
    }

    if (c.activeLeadershipChanges >= 5) {
      score += 10;
      reasons.push(`${c.activeLeadershipChanges} recent leadership changes`);
    }
    score += Math.min(15, Math.round(c.relevantCandidatesCount * 0.3));
    if (c.relevantCandidatesCount >= 25) reasons.push(`${c.relevantCandidatesCount} relevant executives in the master graph`);

    const known = industries.size > 0;
    return { c, score: known && !topic ? score * 0.4 : score, reasons };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => toTarget(s.c, `${s.reasons.slice(0, 3).join('. ') || 'Strong executive bench for this search'}.`, 'agent'));
}

/* ------------------------------------------------------------------ */
/* Natural language search of the master repository                    */
/* ------------------------------------------------------------------ */

export function searchMasterRepository(prompt: string, excludeNames: string[], limit = 8): TargetCompany[] {
  const q = prompt.toLowerCase();
  const exclude = new Set(excludeNames.map(n => n.toLowerCase()));
  const topics = topicsIn(q);

  const wantsUnicorn = /pre-?ipo|unicorn|late[- ]stage/.test(q);
  const wantsPublic = /\bpublic\b|publicly traded/.test(q);
  const wantsMega = /mega|fortune|\blarge\b|\bbig\b|enterprise-scale|global/.test(q);
  const wantsGrowth = /series|startup|early|high-growth|scale-?up|scaleup/.test(q);
  const wantsChurn = /churn|departure|leadership change|mobility|poach|turnover|reorg|restructur/.test(q);
  const wantsHiring = /hiring|openings|expanding|growing|open role/.test(q);

  const words = q
    .replace(/[^a-z0-9&\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 4 && !STOP.has(w));

  const scored = masterRepository()
    .filter(c => !exclude.has(c.name.toLowerCase()))
    .map(c => {
      const d = c as DirectoryCompany;
      let score = 0;
      const why: string[] = [];

      const topic = topics.find(t => t.industry === c.industry);
      if (topic) {
        score += 40;
        why.push(`Operates in ${topic.label}`);
      }
      if (d.stage) {
        if (wantsUnicorn && d.stage === 'Pre-IPO Unicorn') { score += 20; why.push('Pre-IPO stage'); }
        if (wantsPublic && d.stage.startsWith('Public')) { score += 20; why.push('Publicly traded'); }
        if (wantsMega && d.stage.startsWith('Mega')) { score += 20; why.push('Mega-cap scale'); }
        if (wantsGrowth && d.stage === 'Series B-D') { score += 20; why.push('Growth stage'); }
      }
      if (wantsChurn && c.activeLeadershipChanges >= 4) { score += 15; why.push(`${c.activeLeadershipChanges} recent leadership changes`); }
      if (wantsHiring && c.activeOpenings.length > 0) { score += 10; why.push(`${c.activeOpenings.length} open leadership roles`); }

      const hq = c.headquarters.toLowerCase();
      const placeHit = PLACES.find(pl => pl.phrases.some(ph => has(q, ph)) && pl.hq.some(h => hq.includes(h)));
      const place = placeHit ? placeHit.label : words.find(w => w.length >= 5 && hq.includes(w));
      if (place) { score += 18; why.push(`Based in ${placeHit ? placeHit.label : c.headquarters}`); }

      const hay = [c.name, c.description, c.industry, ...c.growthIndicators, ...c.strategicInitiatives, ...c.activeOpenings].join(' ').toLowerCase();
      const hits = words.filter(w => hay.includes(w) && !topics.some(t => t.words.includes(w))).slice(0, 2);
      if (hits.length) { score += hits.length * 8; why.push(`Mentions ${hits.join(' and ')}`); }

      return { c, score, why };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score || b.c.relevantCandidatesCount - a.c.relevantCandidatesCount)
    .slice(0, limit);

  return scored.map(s => toTarget(s.c, `${s.why.slice(0, 3).join('. ')}.`, 'added'));
}
