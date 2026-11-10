import { C, ClientLogo, assemblePages } from './calibrationBriefPdf';
import { textWidth, toWinAnsi, wrap } from './simplePdf';
import { MARGIN, PAGE_H, PAGE_W, drawCard, drawFooter, drawHeader, drawOrgChart, newPage } from './pdfChrome';
import type { TargetCompany } from '../data/projectTargetCompanies';
import { OrgChartNode, getCompanyOrgChartTree } from '../data/companyOrgCharts';

export interface TargetCompaniesPdfOptions {
  /** Title printed in each page header. */
  title: string;
  /** Mandate the companies were matched to. */
  projectTitle: string;
  clientLogo?: ClientLogo | null;
  companyLogo?: ClientLogo | null;
}

const W = PAGE_W;
const H = PAGE_H;
const M = MARGIN;

/** Rows of text on the left card. */
function profileRows(co: TargetCompany): [string, string][] {
  return [
    ['Industry', co.industry],
    ['Headquarters', co.headquarters],
    ['Company size', co.size],
    ['Revenue', co.revenue],
    ['Stage', co.stage ?? 'Not specified'],
    ['Website', co.website],
  ];
}

function drawProfile(cv: ReturnType<typeof newPage>, co: TargetCompany, x: number, top: number, w: number, h: number) {
  drawCard(cv, x, top, w, h, 'Company profile');
  let y = top + 38;
  for (const [label, value] of profileRows(co)) {
    cv.text(x + 12, y, label.toUpperCase(), 6.3, { bold: true, color: C.muted });
    cv.fit(x + 12, y + 11, value, 8.5, w - 24, { color: C.ink });
    y += 27;
  }

  // Divider and agent rationale
  cv.line(x + 12, y - 4, x + w - 12, y - 4, C.border, 0.6);
  cv.text(x + 12, y + 10, 'WHY IT FITS THIS MANDATE', 6.3, { bold: true, color: C.muted });
  const room = Math.floor((top + h - 78 - (y + 22)) / 10.5);
  const lines = wrap(toWinAnsi(co.matchReason), 8, false, w - 24);
  const shown = lines.slice(0, Math.max(room, 1));
  if (lines.length > shown.length) shown[shown.length - 1] = `${shown[shown.length - 1].replace(/[ .,;:]+$/, '')}...`;
  shown.forEach((l, i) => cv.text(x + 12, y + 24 + i * 10.5, l, 8, { color: C.ink }));

  // Stat trio pinned to the bottom of the card
  const stats: [number, string][] = [
    [co.relevantCandidatesCount, 'Relevant execs'],
    [co.activeLeadershipChanges, 'Leadership changes'],
    [co.activeSearchesCount, 'Active searches'],
  ];
  const gap = 6;
  const sw = (w - 24 - gap * 2) / 3;
  const sTop = top + h - 62;
  stats.forEach(([n, label], i) => {
    const sx = x + 12 + i * (sw + gap);
    cv.rrect(sx, sTop, sw, 50, 5, { fill: C.page });
    cv.text(sx + sw / 2, sTop + 25, String(n), 18, { bold: true, color: C.navy2, align: 'center' });
    cv.fit(sx + sw / 2, sTop + 40, label, 6.2, sw - 8, { color: C.muted, align: 'center' });
  });
}

/** One landscape page per company: profile on the left, leadership org chart on the right. */
export function buildTargetCompaniesPdf(companies: TargetCompany[], o: TargetCompaniesPdfOptions): Blob {
  const clientLogo = o.clientLogo ?? null;
  const companyLogo = o.companyLogo ?? null;

  const pages = companies.map((co, i) => {
    const cv = newPage();
    drawHeader(cv, {
      title: o.title,
      subtitle: `Mandate: ${o.projectTitle}  |  Company ${i + 1} of ${companies.length}`,
      clientLogo,
      companyLogo,
    });

    // Company title row
    cv.fit(M, 108, co.name, 22, 560, { bold: true, color: C.ink });
    cv.fit(M, 124, `${co.industry}  |  ${co.headquarters}`, 8.5, 560, { color: C.muted });
    const tag = co.source === 'agent' ? 'Matched by agent' : co.source === 'created' ? 'Created for this project' : 'Added by recruiter';
    const tw = textWidth(toWinAnsi(tag), 7.2, true) + 18;
    cv.rrect(W - M - tw, 94, tw, 20, 5, { fill: C.lavender });
    cv.text(W - M - tw / 2, 107.5, tag, 7.2, { bold: true, color: C.navy2, align: 'center' });

    const top = 138;
    const bottom = H - 28;
    const leftW = 252;
    drawProfile(cv, co, M, top, leftW, bottom - top);
    drawOrgChart(cv, getCompanyOrgChartTree(co.name), M + leftW + 10, top, W - M * 2 - leftW - 10, bottom - top);
    drawFooter(cv, !!companyLogo, `Page ${i + 1} of ${companies.length}`);
    return cv;
  });

  // Image names follow `assemble`: Im1 is the client logo when present, otherwise the company logo.
  return assemblePages(pages, clientLogo ?? companyLogo, clientLogo && companyLogo ? companyLogo : null);
}
