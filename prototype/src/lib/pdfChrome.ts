import { Canvas, C, ClientLogo, RGB, drawPhenomMark, hex } from './calibrationBriefPdf';
import { toWinAnsi, wrap } from './simplePdf';
import type { OrgChartNode } from '../data/companyOrgCharts';

/** Shared page furniture for the landscape US-Letter reports (target companies, search book). */
export const PAGE_W = 792;
export const PAGE_H = 612;
export const MARGIN = 28;
export const MUTED_ON_NAVY = hex('#a9acd6');

export interface ChromeOptions {
  title: string;
  subtitle?: string;
  clientLogo?: ClientLogo | null;
  companyLogo?: ClientLogo | null;
}

export function newPage(): Canvas {
  const cv = new Canvas(PAGE_W, PAGE_H);
  cv.rect(0, 0, PAGE_W, PAGE_H, C.page);
  return cv;
}

/** Navy header band: your logo (or the Phenom mark) left, report title centre, client logo right. */
export function drawHeader(cv: Canvas, o: ChromeOptions) {
  cv.rect(0, 0, PAGE_W, 72, C.navy);
  cv.rect(0, 72, PAGE_W, 2.5, C.indigo);

  const logoW = 128;
  const logoH = 46;
  const logoTop = 13;
  const clientLogo = o.clientLogo ?? null;
  const companyLogo = o.companyLogo ?? null;

  if (companyLogo) {
    cv.rrect(MARGIN, logoTop, logoW, logoH, 5, { fill: C.white });
    const s = Math.min((logoW - 12) / companyLogo.width, (logoH - 10) / companyLogo.height);
    const w = companyLogo.width * s;
    const h = companyLogo.height * s;
    cv.image(MARGIN + (logoW - w) / 2, logoTop + (logoH - h) / 2, w, h, clientLogo ? 'Im2' : 'Im1');
  } else {
    drawPhenomMark(cv, MARGIN, 17, 36, C.white);
    cv.text(MARGIN + 42, 36, 'Phenom', 16, { bold: true, color: C.white });
    cv.text(MARGIN + 43, 48, 'Market Intelligence', 7, { color: MUTED_ON_NAVY });
  }
  if (clientLogo) {
    const x = PAGE_W - MARGIN - logoW;
    cv.rrect(x, logoTop, logoW, logoH, 5, { fill: C.white });
    const s = Math.min((logoW - 12) / clientLogo.width, (logoH - 10) / clientLogo.height);
    const w = clientLogo.width * s;
    const h = clientLogo.height * s;
    cv.image(x + (logoW - w) / 2, logoTop + (logoH - h) / 2, w, h);
  }

  const lines = wrap(toWinAnsi(o.title), 15, true, 440).slice(0, 2);
  const top = lines.length > 1 ? 30 : 38;
  lines.forEach((l, i) => cv.text(PAGE_W / 2, top + i * 17, l, 15, { bold: true, color: C.white, align: 'center' }));
  if (o.subtitle) cv.fit(PAGE_W / 2, top + lines.length * 17 + 2, o.subtitle, 6.8, 440, { color: MUTED_ON_NAVY, align: 'center' });
}

export function drawFooter(cv: Canvas, hasCompanyLogo: boolean, right?: string) {
  const left = hasCompanyLogo ? 'Confidential. Prepared for the client search team.' : 'Prepared with Phenom Market Intelligence. Confidential.';
  cv.text(MARGIN, PAGE_H - 14, left, 6.8, { color: C.muted });
  if (right) cv.text(PAGE_W - MARGIN, PAGE_H - 14, right, 6.8, { color: C.muted, align: 'right' });
}

/** Centred "Page n of N" on every page, added once the final page count is known. */
export function stampPageNumbers(pages: Canvas[]) {
  pages.forEach((cv, i) => cv.text(PAGE_W / 2, PAGE_H - 14, `Page ${i + 1} of ${pages.length}`, 6.8, { color: C.muted, align: 'center' }));
}

export function drawCard(cv: Canvas, x: number, top: number, w: number, h: number, title?: string) {
  cv.rrect(x, top, w, h, 6, { fill: C.card, stroke: C.border, lw: 0.6 });
  if (title) cv.text(x + 12, top + 17, title.toUpperCase(), 7.5, { bold: true, color: C.indigo });
}

const MAX_CHILDREN = 6;
const MAX_REPORTS = 6;

/** Org chart: CEO on top, direct reports in a row, and each one's reports stacked beneath. */
export function drawOrgChart(cv: Canvas, tree: OrgChartNode, x: number, top: number, w: number, h: number) {
  drawCard(cv, x, top, w, h, 'Organization chart');
  cv.text(x + w - 12, top + 17, 'Executive leadership reporting lines', 6.8, { color: C.muted, align: 'right' });

  const kids = (tree.children ?? []).slice(0, MAX_CHILDREN);
  const hidden = (tree.children?.length ?? 0) - kids.length;
  const inner = w - 24;
  const gap = 8;
  const colW = Math.min(150, (inner - gap * (kids.length - 1)) / Math.max(kids.length, 1));
  const rowW = colW * kids.length + gap * Math.max(kids.length - 1, 0);
  const rowX = x + 12 + (inner - rowW) / 2;
  let anyMapped = false;

  const box = (bx: number, bt: number, bw: number, bh: number, node: OrgChartNode, style: 'root' | 'lead' | 'report') => {
    const root = style === 'root';
    cv.rrect(bx, bt, bw, bh, 4, {
      fill: root ? C.navy : C.card,
      stroke: root ? undefined : style === 'lead' ? C.indigoSoft : C.border,
      lw: style === 'lead' ? 1 : 0.7,
    });
    const nameColor: RGB = root ? C.white : C.ink;
    const titleColor: RGB = root ? MUTED_ON_NAVY : C.muted;
    const textW = bw - 14 - (node.mapped ? 8 : 0);
    cv.fit(bx + 7, bt + bh / 2 - 2, node.name, 8.6, textW, { bold: true, color: nameColor });
    cv.fit(bx + 7, bt + bh / 2 + 9, node.title, 7, bw - 14, { color: titleColor });
    if (node.mapped) {
      anyMapped = true;
      cv.circle(bx + bw - 9, bt + 9, 3, { fill: root ? C.white : C.indigo });
    }
  };

  const rootW = 190;
  const rootH = 44;
  const rootTop = top + 34;
  const rootX = x + (w - rootW) / 2;
  box(rootX, rootTop, rootW, rootH, tree, 'root');

  if (kids.length) {
    const leadTop = rootTop + rootH + 34;
    const leadH = 44;
    const busY = rootTop + rootH + 17;

    cv.line(x + w / 2, rootTop + rootH, x + w / 2, busY, C.indigoSoft, 0.9);
    const firstC = rowX + colW / 2;
    const lastC = rowX + (kids.length - 1) * (colW + gap) + colW / 2;
    cv.line(Math.min(firstC, x + w / 2), busY, Math.max(lastC, x + w / 2), busY, C.indigoSoft, 0.9);

    kids.forEach((kid, i) => {
      const kx = rowX + i * (colW + gap);
      const cx = kx + colW / 2;
      cv.line(cx, busY, cx, leadTop, C.indigoSoft, 0.9);
      box(kx, leadTop, colW, leadH, kid, 'lead');

      // Everyone below this leader, depth first, indented by level
      const reports: { node: OrgChartNode; depth: number }[] = [];
      const walk = (n: OrgChartNode, depth: number) =>
        (n.children ?? []).forEach(c => {
          reports.push({ node: c, depth });
          walk(c, depth + 1);
        });
      walk(kid, 1);

      const shown = reports.slice(0, MAX_REPORTS);
      const spineX = kx + 7;
      const firstTop = leadTop + leadH + 14;
      const rowH = 36;
      const rowGap = 12;
      shown.forEach((r, j) => {
        const indent = 14 + (r.depth - 1) * 8;
        const rt = firstTop + j * (rowH + rowGap);
        cv.line(spineX, j === 0 ? leadTop + leadH : rt - rowGap, spineX, rt + rowH / 2, C.border, 0.8);
        cv.line(spineX, rt + rowH / 2, kx + indent, rt + rowH / 2, C.border, 0.8);
        box(kx + indent, rt, colW - indent, rowH, r.node, 'report');
      });
      if (reports.length > shown.length) {
        const t = firstTop + shown.length * (rowH + rowGap) - rowGap + 12;
        cv.text(kx + 14, t, `+${reports.length - shown.length} more`, 6.5, { color: C.muted });
      }
    });
  }

  if (anyMapped) {
    cv.circle(x + 18, top + h - 13, 3, { fill: C.indigo });
    cv.text(x + 25, top + h - 10.5, 'Mapped candidate in this search', 6.5, { color: C.muted });
  }
  if (hidden > 0) cv.text(x + w - 12, top + h - 10, `+${hidden} more direct reports not shown`, 6.5, { color: C.muted, align: 'right' });
}
