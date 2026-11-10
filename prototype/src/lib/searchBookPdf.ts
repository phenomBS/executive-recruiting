import { Canvas, C, ClientLogo, assemblePages, drawCalibrationBrief, hex } from './calibrationBriefPdf';
import { textWidth, toWinAnsi, wrap } from './simplePdf';
import {
  MARGIN as M,
  PAGE_H as H,
  PAGE_W as W,
  drawCard,
  drawFooter,
  drawHeader,
  drawOrgChart,
  newPage,
  stampPageNumbers,
} from './pdfChrome';
import type { Candidate, Project } from '../types';
import type { RestrictedCompany } from '../context/RestrictedContext';
import { buildBriefModel } from './calibrationBrief';
import { computeDifficulty, getCompetitionSnapshot, initialScenario } from './hireDifficulty';
import { getSearchIntelligenceForProject, getSearchIntelligenceForRole } from '../data/projectSearchIntelligenceData';
import { initialRolesSuccessionData } from '../data/rolesSuccessionData';
import { getMarketMapForProject, getCompanyOrgChart, MappedCompany } from '../data/projectMarketMapData';
import { fromMarketMap } from '../data/companyOrgCharts';
import { getProjectTargetCompanies } from '../data/projectTargetCompanies';
import { getOffLimitsRows } from '../data/projectOffLimits';

/* ------------------------------------------------------------------ */
/* Report catalogue                                                    */
/* ------------------------------------------------------------------ */

export type ReportId = 'calibration' | 'target-companies' | 'market-map' | 'pipeline' | 'slate';

export interface ReportDef {
  id: ReportId;
  label: string;
  description: string;
}

/** Default order. The dialog lets the user change it. */
export const REPORTS: ReportDef[] = [
  {
    id: 'calibration',
    label: 'Market Calibration',
    description: 'How hard this hire is: talent scarcity, compensation parity, competition and where to hunt.',
  },
  {
    id: 'target-companies',
    label: 'Target Companies',
    description: 'The target universe by relevance tier, plus the off-limits list of companies you cannot approach.',
  },
  {
    id: 'market-map',
    label: 'Market Map',
    description: 'The target universe populated with people: org charts and the seat-holders at each company.',
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    description: 'The candidate long list with outreach status and stage for each person.',
  },
  {
    id: 'slate',
    label: 'Slate',
    description: 'The shortlist of vetted candidates with compensation, notice period and a profile write-up.',
  },
];

export interface SearchBookContext {
  project: Project;
  /** Pipeline candidates with off-limits companies already removed. */
  pipeline: PipelineRow[];
  restricted: RestrictedCompany[];
}

export type PipelineRow = Candidate & { projectStatus: string; dateAdded: string };

export interface SearchBookOptions {
  /** Cover title for the book. */
  title: string;
  clientLogo?: ClientLogo | null;
  companyLogo?: ClientLogo | null;
}

const SLATE_STAGES = ['Interviewing', 'Offer', 'Hired'];
const SLATE_MAX = 5;

const norm = (s: string) => s.trim().toLowerCase();

function isOffLimits(name: string, restricted: RestrictedCompany[]) {
  return restricted.some(r => norm(r.name) === norm(name));
}

function marketMapCompanies(ctx: SearchBookContext) {
  const all = getMarketMapForProject(ctx.project).companies;
  const open = all.filter(c => c.poachStatus !== 'Restricted (Board)' && c.poachStatus !== 'Do Not Poach (Client)' && !isOffLimits(c.name, ctx.restricted));
  const closed = all.filter(c => !open.includes(c));
  return { all, open, closed };
}

function slateCandidates(ctx: SearchBookContext): PipelineRow[] {
  return ctx.pipeline
    .filter(c => SLATE_STAGES.includes(c.projectStatus))
    .sort((a, b) => b.emiScore - a.emiScore)
    .slice(0, SLATE_MAX);
}

/** Short line shown in the dialog under each report, and whether the report has anything to print. */
export function describeReport(id: ReportId, ctx: SearchBookContext): { detail: string; available: boolean } {
  const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
  switch (id) {
    case 'calibration':
      return { detail: '1 page', available: true };
    case 'target-companies': {
      const { open, closed } = marketMapCompanies(ctx);
      const extra = targetOnlyCompanies(ctx).length;
      const off = offLimitsRows(ctx).length;
      return { detail: `${plural(open.length + extra, 'company', 'companies')}, ${off} off-limits`, available: open.length + extra + off > 0 || closed.length > 0 };
    }
    case 'market-map': {
      const { open } = marketMapCompanies(ctx);
      const people = open.reduce((n, c) => n + c.executives.length, 0);
      return { detail: `${plural(open.length, 'company', 'companies')}, ${plural(people, 'executive')} mapped`, available: open.length > 0 };
    }
    case 'pipeline':
      return { detail: plural(ctx.pipeline.length, 'candidate'), available: ctx.pipeline.length > 0 };
    case 'slate': {
      const n = slateCandidates(ctx).length;
      return { detail: n ? plural(n, 'vetted candidate') : 'No candidates at interview stage yet', available: n > 0 };
    }
  }
}

/* ------------------------------------------------------------------ */
/* Generic paginated table                                             */
/* ------------------------------------------------------------------ */

interface Col {
  label: string;
  w: number;
}

type Item =
  | { kind: 'group'; title: string; note?: string; tone?: 'neutral' | 'bad' }
  | { kind: 'cols'; cols: Col[] }
  | { kind: 'row'; cells: string[]; tone?: 'bad' }
  | { kind: 'stats'; stats: [string, string][] };

const ROW_H = 28;
const COLS_H = 20;
const GROUP_H = 32;
const STATS_H = 58;
const BODY_TOP = 92;
const BODY_BOTTOM = H - 30;

const BAD_FILL = hex('#fdecec');
const BAD_INK = hex('#b42318');

function cellLines(text: string, size: number, w: number, maxLines: number, bold = false): string[] {
  const lines = wrap(toWinAnsi(text || '-'), size, bold, w);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[ .,;:]+$/, '')}...`;
  return kept;
}

function drawColsHeader(cv: Canvas, cols: Col[], top: number) {
  cv.rect(M, top, W - M * 2, COLS_H, C.navy2);
  let x = M;
  cols.forEach(col => {
    cv.fit(x + 8, top + 13, col.label.toUpperCase(), 6.4, col.w - 12, { bold: true, color: C.white });
    x += col.w;
  });
}

/** Lay items out top to bottom, starting a new page (with the column header repeated) when one fills up. */
function paginate(items: Item[], newTablePage: () => Canvas): Canvas[] {
  const pages: Canvas[] = [];
  let cv: Canvas | null = null;
  let y = BODY_TOP;
  let cols: Col[] | null = null;
  let rowIndex = 0;

  const start = (repeatCols: boolean) => {
    cv = newTablePage();
    pages.push(cv);
    y = BODY_TOP;
    if (repeatCols && cols) {
      drawColsHeader(cv, cols, y);
      y += COLS_H;
    }
  };

  items.forEach((item, i) => {
    if (!cv) start(false);
    const need =
      item.kind === 'row' ? ROW_H : item.kind === 'group' ? GROUP_H + COLS_H + ROW_H : item.kind === 'stats' ? STATS_H + 10 : COLS_H + ROW_H;
    if (y + need > BODY_BOTTOM) start(item.kind === 'row');
    const page = cv as Canvas;

    if (item.kind === 'stats') {
      const gap = 8;
      const w = (W - M * 2 - gap * (item.stats.length - 1)) / item.stats.length;
      item.stats.forEach(([value, label], k) => {
        const x = M + k * (w + gap);
        page.rrect(x, y, w, STATS_H, 6, { fill: C.card, stroke: C.border, lw: 0.6 });
        page.text(x + w / 2, y + 28, value, 20, { bold: true, color: C.navy2, align: 'center' });
        page.fit(x + w / 2, y + 45, label, 7, w - 10, { color: C.muted, align: 'center' });
      });
      y += STATS_H + 10;
    } else if (item.kind === 'group') {
      y += i === 0 ? 0 : 6;
      const bad = item.tone === 'bad';
      page.rect(M, y, W - M * 2, GROUP_H - 6, bad ? BAD_FILL : C.lavender);
      page.text(M + 8, y + 12, item.title, 8.6, { bold: true, color: bad ? BAD_INK : C.navy2 });
      if (item.note) page.fit(M + 8, y + 22, item.note, 6.8, W - M * 2 - 16, { color: C.muted });
      y += GROUP_H - 6;
    } else if (item.kind === 'cols') {
      cols = item.cols;
      drawColsHeader(page, cols, y);
      y += COLS_H;
      rowIndex = 0;
    } else if (cols) {
      page.rect(M, y, W - M * 2, ROW_H, item.tone === 'bad' ? BAD_FILL : rowIndex % 2 ? hex('#f8f8fc') : C.white);
      page.line(M, y + ROW_H, W - M, y + ROW_H, C.border, 0.4);
      let x = M;
      item.cells.forEach((cell, k) => {
        const col = cols![k];
        const bold = k === 0;
        const size = 7.4;
        const lines = cellLines(cell, size, col.w - 14, 2, bold);
        const baseline = lines.length === 1 ? y + 17 : y + 11;
        lines.forEach((l, li) =>
          page.text(x + 8, baseline + li * 9, l, size, { bold, color: item.tone === 'bad' && k === 0 ? BAD_INK : C.ink })
        );
        x += col.w;
      });
      y += ROW_H;
      rowIndex += 1;
    }
  });
  return pages;
}

/* ------------------------------------------------------------------ */
/* 1. Market Calibration                                               */
/* ------------------------------------------------------------------ */

function calibrationPages(ctx: SearchBookContext, o: SearchBookOptions): Canvas[] {
  const { project } = ctx;
  const sourceRole = project.sourceRoleId ? initialRolesSuccessionData.find(r => r.id === project.sourceRoleId) : undefined;
  const data = sourceRole
    ? { ...getSearchIntelligenceForRole(sourceRole), projectId: project.id }
    : getSearchIntelligenceForProject(project.id, project.title, project.company);
  const scenario = initialScenario(data);
  const competition = getCompetitionSnapshot(data);
  const result = computeDifficulty(data, scenario, competition);
  const model = buildBriefModel(data, scenario, competition, result, 3, s => computeDifficulty(data, s, competition));
  return [drawCalibrationBrief(model, { clientLogo: o.clientLogo, companyLogo: o.companyLogo })];
}

/* ------------------------------------------------------------------ */
/* 2. Target Companies (target universe and off-limits)                */
/* ------------------------------------------------------------------ */

const TIER_COLS: Col[] = [
  { label: 'Company', w: 104 },
  { label: 'Industry', w: 120 },
  { label: 'Headquarters', w: 96 },
  { label: 'Scale', w: 118 },
  { label: 'Status', w: 62 },
  { label: 'Why it is on the list', w: 236 },
];

const OFF_COLS: Col[] = [
  { label: 'Company', w: 140 },
  { label: 'Why it is off-limits', w: 400 },
  { label: 'Source', w: 196 },
];

function offLimitsRows(ctx: SearchBookContext): { name: string; reason: string; source: string }[] {
  return getOffLimitsRows(ctx.project, ctx.restricted).map(r => ({
    name: r.name,
    reason: r.reason,
    source: r.scope === 'search' ? `Search restriction: ${r.source}` : `Firm-wide restricted list, added ${r.dateAdded}`,
  }));
}

/** Target companies on the Target Companies tab that the market map does not already cover. */
function targetOnlyCompanies(ctx: SearchBookContext) {
  const inMap = new Set(getMarketMapForProject(ctx.project).companies.map(c => norm(c.name)));
  return getProjectTargetCompanies(ctx.project).filter(c => !inMap.has(norm(c.name)) && !isOffLimits(c.name, ctx.restricted));
}

function targetCompaniesPages(ctx: SearchBookContext, chrome: (sub: string) => Canvas): Canvas[] {
  const mm = getMarketMapForProject(ctx.project);
  const { open } = marketMapCompanies(ctx);
  const items: Item[] = [];

  mm.tiers.forEach(tier => {
    const rows = open.filter(c => c.tier === tier.tierId);
    if (!rows.length) return;
    items.push({ kind: 'group', title: tier.name, note: tier.description });
    items.push({ kind: 'cols', cols: TIER_COLS });
    rows.forEach(c =>
      items.push({
        kind: 'row',
        cells: [
          c.name,
          c.industry,
          c.headquarters,
          `${c.employeeCount}, ${c.revenueScale}`,
          c.poachStatus === 'Clear Target' ? 'Clear target' : 'Use caution',
          c.poachReason ? `${c.strategicRationale} ${c.poachReason}` : c.strategicRationale,
        ],
      })
    );
  });

  const extra = targetOnlyCompanies(ctx);
  if (extra.length) {
    items.push({ kind: 'group', title: 'Additional target companies', note: 'Added from the Target Companies tab, not yet placed in a tier.' });
    items.push({ kind: 'cols', cols: TIER_COLS });
    extra.forEach(c =>
      items.push({
        kind: 'row',
        cells: [c.name, c.industry, c.headquarters, `${c.size}, ${c.revenue}`, 'Clear target', c.matchReason],
      })
    );
  }

  const off = offLimitsRows(ctx);
  if (off.length) {
    items.push({
      kind: 'group',
      tone: 'bad',
      title: 'Off-limits: do not approach',
      note: 'Non-compete, non-solicit or client agreements prevent recruiting from these companies.',
    });
    items.push({ kind: 'cols', cols: OFF_COLS });
    off.forEach(r => items.push({ kind: 'row', tone: 'bad', cells: [r.name, r.reason, r.source] }));
  }

  if (!items.length) items.push({ kind: 'group', title: 'No target companies yet', note: 'Add companies on the Target Companies tab.' });
  return paginate(items, () => chrome(`${open.length + extra.length} target companies, ${off.length} off-limits`));
}

/* ------------------------------------------------------------------ */
/* 3. Market Map                                                       */
/* ------------------------------------------------------------------ */

function marketMapPages(ctx: SearchBookContext, chrome: (sub: string) => Canvas): Canvas[] {
  const mm = getMarketMapForProject(ctx.project);
  const { open } = marketMapCompanies(ctx);
  const people = open.reduce((n, c) => n + c.executives.length, 0);
  const avg = (pick: (e: MappedCompany['executives'][number]) => number) => {
    const all = open.flatMap(c => c.executives);
    return all.length ? Math.round(all.reduce((s, e) => s + pick(e), 0) / all.length) : 0;
  };

  const summary: Item[] = [
    {
      kind: 'stats',
      stats: [
        [String(open.length), 'Companies mapped'],
        [String(people), 'Executives mapped'],
        [String(avg(e => e.mobilityScore)), 'Average mobility score'],
        [String(avg(e => e.matchScore)), 'Average match score'],
      ],
    },
    {
      kind: 'cols',
      cols: [
        { label: 'Tier', w: 210 },
        { label: 'What it covers', w: 306 },
        { label: 'Companies', w: 100 },
        { label: 'Executives', w: 120 },
      ],
    },
    ...mm.tiers
      .map(t => ({ t, cs: open.filter(c => c.tier === t.tierId) }))
      .filter(({ cs }) => cs.length)
      .map(({ t, cs }): Item => ({
        kind: 'row',
        cells: [t.name, t.description, String(cs.length), String(cs.reduce((n, c) => n + c.executives.length, 0))],
      })),
  ];
  const pages = paginate(summary, () => chrome(`${open.length} companies, ${people} executives mapped`));

  open.forEach((co, i) => {
    const cv = chrome(`Company ${i + 1} of ${open.length}`);
    pages.push(cv);

    cv.fit(M, 108, co.name, 22, 560, { bold: true, color: C.ink });
    cv.fit(M, 124, `${co.industry}  |  ${co.headquarters}`, 8.5, 560, { color: C.muted });
    const tag = co.tier;
    const tw = textWidth(toWinAnsi(tag), 7.2, true) + 18;
    cv.rrect(W - M - tw, 94, tw, 20, 5, { fill: C.lavender });
    cv.text(W - M - tw / 2, 107.5, tag, 7.2, { bold: true, color: C.navy2, align: 'center' });

    const top = 138;
    const bottom = H - 28;
    const leftW = 252;
    drawCard(cv, M, top, leftW, bottom - top, 'Mapped executives');
    const execs = co.executives.slice(0, 7);
    execs.forEach((e, k) => {
      const y = top + 30 + k * 58;
      cv.fit(M + 12, y + 8, e.name, 8.8, leftW - 24, { bold: true, color: C.ink });
      cv.fit(M + 12, y + 19, e.role, 7.2, leftW - 24, { color: C.muted });
      cv.fit(M + 12, y + 30, `Tenure ${e.tenureFormatted}  |  Mobility ${e.mobilityScore}  |  Match ${e.matchScore}`, 7, leftW - 24, { color: C.ink });
      cv.fit(M + 12, y + 41, `Status: ${e.outreachStatus}`, 7, leftW - 24, { bold: true, color: C.navy2 });
      if (k < execs.length - 1) cv.line(M + 12, y + 49, M + leftW - 12, y + 49, C.border, 0.5);
    });
    if (co.executives.length > execs.length) cv.text(M + 12, bottom - 10, `+${co.executives.length - execs.length} more mapped executives`, 6.8, { color: C.muted });
    if (!execs.length) cv.text(M + 12, top + 40, 'No executives mapped yet.', 8, { color: C.muted });

    drawOrgChart(cv, fromMarketMap(getCompanyOrgChart(co)), M + leftW + 10, top, W - M * 2 - leftW - 10, bottom - top);
  });
  return pages;
}

/* ------------------------------------------------------------------ */
/* 4. Pipeline (candidate long list)                                   */
/* ------------------------------------------------------------------ */

const OUTREACH: Record<string, string> = {
  Identified: 'Not yet contacted',
  Contacted: 'Outreach sent',
  Interviewing: 'In interviews',
  Offer: 'Offer stage',
  Hired: 'Hired',
};

const STAGE_ORDER = ['Identified', 'Contacted', 'Interviewing', 'Offer', 'Hired'];

function pipelinePages(ctx: SearchBookContext, chrome: (sub: string) => Canvas): Canvas[] {
  const rows = [...ctx.pipeline].sort((a, b) => b.emiScore - a.emiScore);
  const count = (stage: string) => rows.filter(c => c.projectStatus === stage).length;
  const items: Item[] = [
    { kind: 'stats', stats: STAGE_ORDER.map(s => [String(count(s)), s] as [string, string]) },
    {
      kind: 'cols',
      cols: [
        { label: 'Candidate', w: 112 },
        { label: 'Current role', w: 140 },
        { label: 'Company', w: 100 },
        { label: 'Location', w: 118 },
        { label: 'Stage', w: 70 },
        { label: 'Outreach status', w: 84 },
        { label: 'EMI', w: 42 },
        { label: 'Last contact', w: 70 },
      ],
    },
    ...rows.map((c): Item => ({
      kind: 'row',
      cells: [
        `${c.firstName} ${c.lastName}`,
        c.role,
        c.company,
        c.location.replace(/, United States$/, ''),
        c.projectStatus,
        OUTREACH[c.projectStatus] ?? c.projectStatus,
        String(c.emiScore),
        c.lastContactDate ?? 'None yet',
      ],
    })),
  ];
  return paginate(items, () => chrome(`${rows.length} candidates ranked by EMI score`));
}

/* ------------------------------------------------------------------ */
/* 5. Slate (shortlist)                                                */
/* ------------------------------------------------------------------ */

const known = (s?: string) => (s && s.trim() && s.trim().toUpperCase() !== 'N/A' ? s.trim() : undefined);

function slateWriteUp(c: PipelineRow): string {
  const e = c.executiveData;
  const parts: string[] = [];
  const tenure = [known(e.currentRoleTenure) && `${e.currentRoleTenure} in the role`, known(e.currentCompanyTenure) && `${e.currentCompanyTenure} at the company`].filter(Boolean);
  parts.push(`${c.firstName} is ${c.role} at ${c.company}${tenure.length ? `, with ${tenure.join(' and ')}` : ''}. Based in ${c.location.replace(/, United States$/, '')}.`);
  const profile = [
    known(e.executiveArchetype) && `a ${e.executiveArchetype} profile`,
    known(e.careerTrajectory) && `a career path of ${e.careerTrajectory}`,
    known(e.areasOfExpertise) && `expertise in ${e.areasOfExpertise}`,
  ].filter(Boolean);
  if (profile.length) parts.push(`${c.firstName} brings ${profile.join(', ')}.`);
  const reach = [
    known(e.industryExperience) && `${e.industryExperience}`,
    known(e.companySizeExperience) && `at ${e.companySizeExperience} scale`,
  ].filter(Boolean);
  if (reach.length) {
    parts.push(
      `Experience spans ${reach.join(' ')}${e.publicCompanyExperience === 'Yes' ? ', including public company exposure' : ''}${known(e.geographicExperience) ? `, with ${e.geographicExperience.toLowerCase()} geographic reach` : ''}.`
    );
  }
  const scores = `EMI ${c.emiScore}, behavioral ${c.behavioralScore}${c.assessmentScore ? `, assessment ${c.assessmentScore}` : ''}`;
  const move = [
    known(e.mobilityIndicator) && `Mobility is ${e.mobilityIndicator.toLowerCase()}`,
    known(e.noticePeriod) && `notice period is ${e.noticePeriod}`,
    e.nonCompete === 'Yes' && 'a non-compete applies',
  ].filter(Boolean);
  parts.push(`Scores: ${scores}.${move.length ? ` ${move.join('; ')}.` : ''}`);
  return parts.join(' ');
}

function competencyRows(project: Project, c: PipelineRow): [string, string, string][] {
  const e = c.executiveData;
  const p = project.parameters;
  const k$ = (n?: number) => (n ? `$${Math.round(n / 1000).toLocaleString('en-US')}K` : 'per brief');
  return [
    [
      'Role and level',
      p ? `${p.primaryTitle || project.title}, ${p.roleLevel}` : project.title,
      `${c.role}; ${e.executiveLevel}${known(e.careerVelocity) ? `; ${e.careerVelocity.toLowerCase()} career velocity` : ''}`,
    ],
    [
      'Functional domain',
      p?.functionalDomain || 'Per project brief',
      `${e.function}${known(e.areasOfExpertise) ? `: ${e.areasOfExpertise}` : ''}`,
    ],
    [
      'Scope and scale',
      p ? `${p.requiredPandLScope}; team of ${p.teamHeadcountScale}` : 'Per project brief',
      `P&L: ${known(e.candidatePandL) ?? 'not reported'}; ${known(e.companySizeExperience) ?? 'company size not reported'}`,
    ],
    [
      'Company context',
      p?.targetCompanyStage || 'Per project brief',
      `Public company: ${known(e.publicCompanyExperience) ?? 'unknown'}; PE-backed: ${known(e.peBackedExperience) ?? 'unknown'}; board: ${known(e.boardExperience) ?? 'none'}`,
    ],
    [
      'Compensation and availability',
      p ? `Base to ${k$(p.maxBaseBudget)}, total to ${k$(p.maxTotalCompensationCeiling)}; start ${p.targetStartDate}, notice up to ${p.maxNoticePeriodTolerance}` : 'Per project brief',
      `Current ${known(e.currentCompensation) ?? 'unknown'}; notice ${known(e.noticePeriod) ?? 'unknown'}; garden leave ${known(e.gardenLeave) ?? 'unknown'}`,
    ],
  ];
}

function slatePages(ctx: SearchBookContext, chrome: (sub: string) => Canvas): Canvas[] {
  const list = slateCandidates(ctx);
  return list.map((c, i) => {
    const e = c.executiveData;
    const cv = chrome(`Candidate ${i + 1} of ${list.length}`);

    cv.fit(M, 108, `${c.firstName} ${c.lastName}`, 22, 560, { bold: true, color: C.ink });
    cv.fit(M, 124, `${c.role}, ${c.company}  |  ${c.location.replace(/, United States$/, '')}`, 8.5, 560, { color: C.muted });
    const tag = c.projectStatus;
    const tw = textWidth(toWinAnsi(tag), 7.2, true) + 18;
    cv.rrect(W - M - tw, 94, tw, 20, 5, { fill: C.lavender });
    cv.text(W - M - tw / 2, 107.5, tag, 7.2, { bold: true, color: C.navy2, align: 'center' });

    const top = 138;
    const bottom = H - 28;
    const leftW = 252;
    drawCard(cv, M, top, leftW, bottom - top, 'Candidate facts');
    const facts: [string, string][] = [
      ['Current compensation', known(e.currentCompensation) ?? 'Not reported'],
      ['Equity', [known(e.currentEquityType), known(e.currentEquityShares) && `${e.currentEquityShares} shares`].filter(Boolean).join(', ') || 'Not reported'],
      ['Notice period', known(e.noticePeriod) ?? 'Not reported'],
      ['Non-compete / garden leave', `${known(e.nonCompete) ?? 'Unknown'} / ${known(e.gardenLeave) ?? 'Unknown'}`],
      ['Relocation', known(e.relocationWillingness) ?? 'Unknown'],
      ['Mobility', known(e.mobilityIndicator) ?? 'Unknown'],
      ['Education', known(e.education) ?? 'Not reported'],
    ];
    facts.forEach(([label, value], k) => {
      const y = top + 38 + k * 27;
      cv.text(M + 12, y, label.toUpperCase(), 6.3, { bold: true, color: C.muted });
      cv.fit(M + 12, y + 11, value, 8.5, leftW - 24, { color: C.ink });
    });

    const stats: [string, string][] = [
      [String(c.emiScore), 'EMI score'],
      [String(c.behavioralScore), 'Behavioral'],
      [c.assessmentScore ? String(c.assessmentScore) : '-', 'Assessment'],
    ];
    const gap = 6;
    const sw = (leftW - 24 - gap * 2) / 3;
    const sTop = bottom - 62;
    stats.forEach(([n, label], k) => {
      const sx = M + 12 + k * (sw + gap);
      cv.rrect(sx, sTop, sw, 50, 5, { fill: C.page });
      cv.text(sx + sw / 2, sTop + 25, n, 18, { bold: true, color: C.navy2, align: 'center' });
      cv.fit(sx + sw / 2, sTop + 40, label, 6.2, sw - 8, { color: C.muted, align: 'center' });
    });

    const rx = M + leftW + 10;
    const rw = W - M - rx;
    drawCard(cv, rx, top, rw, bottom - top, 'Candidate profile write-up');
    const used = cv.paragraph(rx + 12, top + 34, slateWriteUp(c), 8.4, rw - 24, 11.5, { color: C.ink });

    let y = top + 34 + used * 11.5 + 12;
    cv.text(rx + 12, y, 'COMPETENCY MAP', 7.5, { bold: true, color: C.indigo });
    y += 8;
    const cols = [92, 168, rw - 24 - 92 - 168];
    cv.rect(rx + 12, y, rw - 24, 18, C.navy2);
    ['Competency', 'The role needs', 'The candidate shows'].forEach((l, k) => {
      const x = rx + 12 + cols.slice(0, k).reduce((a, b) => a + b, 0);
      cv.text(x + 6, y + 12, l.toUpperCase(), 6.3, { bold: true, color: C.white });
    });
    y += 18;
    const rows = competencyRows(ctx.project, c);
    const rowH = Math.min(52, Math.floor((bottom - 10 - y) / rows.length));
    rows.forEach((r, k) => {
      cv.rect(rx + 12, y, rw - 24, rowH, k % 2 ? hex('#f8f8fc') : C.white);
      cv.line(rx + 12, y + rowH, rx + rw - 12, y + rowH, C.border, 0.4);
      r.forEach((cell, j) => {
        const x = rx + 12 + cols.slice(0, j).reduce((a, b) => a + b, 0);
        const lines = cellLines(cell, 7.4, cols[j] - 12, Math.max(2, Math.floor((rowH - 8) / 9)), j === 0);
        lines.forEach((l, li) => cv.text(x + 6, y + 12 + li * 9, l, 7.4, { bold: j === 0, color: C.ink }));
      });
      y += rowH;
    });
    return cv;
  });
}

/* ------------------------------------------------------------------ */
/* Cover and assembly                                                  */
/* ------------------------------------------------------------------ */

function coverPage(ctx: SearchBookContext, o: SearchBookOptions, toc: { label: string; page: number }[]): Canvas {
  const cv = newPage();
  drawHeader(cv, { title: 'Executive Search Book', subtitle: ctx.project.title, clientLogo: o.clientLogo, companyLogo: o.companyLogo });

  const lines = wrap(toWinAnsi(o.title), 26, true, W - M * 2).slice(0, 2);
  lines.forEach((l, i) => cv.text(M, 140 + i * 30, l, 26, { bold: true, color: C.ink }));
  let y = 140 + lines.length * 30 + 4;
  cv.fit(M, y, ctx.project.title, 13, W - M * 2, { color: C.navy2, bold: true });
  y += 18;
  const meta = [
    ctx.project.company && `Client: ${ctx.project.company}`,
    ctx.project.leadRecruiter && `Lead recruiter: ${ctx.project.leadRecruiter}`,
    `Prepared ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
  ].filter(Boolean);
  cv.fit(M, y, meta.join('   |   '), 8.5, W - M * 2, { color: C.muted });

  const cardTop = y + 22;
  const rowH = 40;
  const cardH = 40 + toc.length * rowH;
  drawCard(cv, M, cardTop, W - M * 2, cardH, 'Contents');
  toc.forEach((t, i) => {
    const ry = cardTop + 32 + i * rowH;
    const def = REPORTS.find(r => r.label === t.label);
    cv.circle(M + 24, ry + 14, 10, { fill: C.lavender });
    cv.text(M + 24, ry + 17.5, String(i + 1), 9, { bold: true, color: C.navy2, align: 'center' });
    cv.text(M + 46, ry + 12, t.label, 10.5, { bold: true, color: C.ink });
    if (def) cv.fit(M + 46, ry + 24, def.description, 7.4, W - M * 2 - 140, { color: C.muted });
    cv.text(W - M - 16, ry + 17, `Page ${t.page}`, 8.5, { bold: true, color: C.navy2, align: 'right' });
    if (i < toc.length - 1) cv.line(M + 14, ry + rowH - 6, W - M - 14, ry + rowH - 6, C.border, 0.4);
  });
  drawFooter(cv, !!o.companyLogo);
  return cv;
}

function sectionPages(id: ReportId, ctx: SearchBookContext, o: SearchBookOptions, bookLabel: string): Canvas[] {
  const label = REPORTS.find(r => r.id === id)!.label;
  const chrome = (sub: string) => {
    const cv = newPage();
    drawHeader(cv, {
      title: label,
      subtitle: `${bookLabel}  |  ${sub}`,
      clientLogo: o.clientLogo,
      companyLogo: o.companyLogo,
    });
    drawFooter(cv, !!o.companyLogo);
    return cv;
  };
  const mandate = `Mandate: ${ctx.project.title}`;
  const withMandate = (sub: string) => chrome(`${mandate}  |  ${sub}`);
  switch (id) {
    case 'calibration':
      return calibrationPages(ctx, o);
    case 'target-companies':
      return targetCompaniesPages(ctx, () => withMandate('Target universe'));
    case 'market-map':
      return marketMapPages(ctx, () => withMandate('Talent map'));
    case 'pipeline':
      return pipelinePages(ctx, () => withMandate('Candidate long list'));
    case 'slate':
      return slatePages(ctx, () => withMandate('Shortlist'));
  }
}

/** Build a PDF of the chosen reports in the given order. One report gives a stand-alone report; several give a search book with a cover. */
export function buildSearchBookPdf(order: ReportId[], ctx: SearchBookContext, o: SearchBookOptions): Blob {
  const asBook = order.length > 1;
  const sections = order.map(id => ({
    id,
    label: REPORTS.find(r => r.id === id)!.label,
    pages: sectionPages(id, ctx, o, asBook ? o.title : ctx.project.title),
  }));

  const pages: Canvas[] = [];
  if (asBook) {
    let page = 2;
    const toc = sections.map(s => {
      const entry = { label: s.label, page };
      page += s.pages.length;
      return entry;
    });
    pages.push(coverPage(ctx, o, toc));
  }
  sections.forEach(s => pages.push(...s.pages));
  stampPageNumbers(pages);

  const client = o.clientLogo ?? null;
  const company = o.companyLogo ?? null;
  return assemblePages(pages, client ?? company, client && company ? company : null);
}
