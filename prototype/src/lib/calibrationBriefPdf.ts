import { escapePdf, textWidth, toWinAnsi, wrap } from './simplePdf';
import { fmtK, type BriefModel } from './calibrationBrief';

/**
 * One-page, landscape vector executive brief ("Executive Search Calibration Brief").
 * Drawn directly with PDF path operators so every chart is crisp and data driven.
 */

export type RGB = [number, number, number];

export interface ClientLogo {
  /** JPEG bytes as a binary string */
  jpeg: string;
  width: number;
  height: number;
}

export const hex = (h: string): RGB => {
  const n = parseInt(h.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export const C = {
  navy: hex('#0c0b3b'),
  navy2: hex('#1c1876'),
  indigo: hex('#4d3ee0'),
  indigoSoft: hex('#7571e0'),
  lavender: hex('#eae8fb'),
  page: hex('#f3f4f9'),
  card: hex('#ffffff'),
  border: hex('#dcdeea'),
  ink: hex('#1b1d2e'),
  muted: hex('#626780'),
  white: hex('#ffffff'),
  green: hex('#16a34a'),
  amber: hex('#d97706'),
  red: hex('#dc2626'),
  amberFill: hex('#f59e0b'),
};

const PDF_KPI_LABEL: Record<string, string> = {
  tam: 'Addressable market',
  demand: 'Competitor demand',
  duration: 'Est. search duration',
  budget: 'Target base budget',
};

export const TONE_COLOR = { good: C.green, warn: C.amber, bad: C.red, neutral: C.navy2 };

const DIAL_STOPS: { at: number; c: RGB }[] = [
  { at: 0, c: hex('#22c55e') },
  { at: 0.25, c: hex('#84cc16') },
  { at: 0.5, c: hex('#f5b301') },
  { at: 0.75, c: hex('#f97316') },
  { at: 1, c: hex('#ef4444') },
];

const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

export function dialColor(f: number): RGB {
  const x = Math.min(1, Math.max(0, f));
  for (let i = 0; i < DIAL_STOPS.length - 1; i++) {
    const a = DIAL_STOPS[i];
    const b = DIAL_STOPS[i + 1];
    if (x <= b.at) return mix(a.c, b.c, (x - a.at) / (b.at - a.at));
  }
  return DIAL_STOPS[DIAL_STOPS.length - 1].c;
}

const n2 = (n: number) => (Math.round(n * 100) / 100).toString();
const rg = (c: RGB) => `${n2(c[0])} ${n2(c[1])} ${n2(c[2])}`;

export class Canvas {
  ops: string[] = [];
  constructor(readonly W: number, readonly H: number) {}

  private y(top: number) {
    return this.H - top;
  }

  rect(x: number, top: number, w: number, h: number, fill: RGB) {
    this.ops.push(`${rg(fill)} rg ${n2(x)} ${n2(this.y(top + h))} ${n2(w)} ${n2(h)} re f`);
  }

  rrect(x: number, top: number, w: number, h: number, r: number, o: { fill?: RGB; stroke?: RGB; lw?: number; dash?: number[] }) {
    const k = 0.5523 * r;
    const b = this.y(top + h);
    const t = b + h;
    const p = [
      `${n2(x + r)} ${n2(b)} m`,
      `${n2(x + w - r)} ${n2(b)} l`,
      `${n2(x + w - r + k)} ${n2(b)} ${n2(x + w)} ${n2(b + r - k)} ${n2(x + w)} ${n2(b + r)} c`,
      `${n2(x + w)} ${n2(t - r)} l`,
      `${n2(x + w)} ${n2(t - r + k)} ${n2(x + w - r + k)} ${n2(t)} ${n2(x + w - r)} ${n2(t)} c`,
      `${n2(x + r)} ${n2(t)} l`,
      `${n2(x + r - k)} ${n2(t)} ${n2(x)} ${n2(t - r + k)} ${n2(x)} ${n2(t - r)} c`,
      `${n2(x)} ${n2(b + r)} l`,
      `${n2(x)} ${n2(b + r - k)} ${n2(x + r - k)} ${n2(b)} ${n2(x + r)} ${n2(b)} c`,
      'h',
    ].join(' ');
    const parts = ['q'];
    if (o.fill) parts.push(`${rg(o.fill)} rg`);
    if (o.stroke) parts.push(`${rg(o.stroke)} RG ${n2(o.lw ?? 0.6)} w`);
    if (o.dash) parts.push(`[${o.dash.join(' ')}] 0 d`);
    parts.push(p, o.fill && o.stroke ? 'B' : o.fill ? 'f' : 'S', 'Q');
    this.ops.push(parts.join(' '));
  }

  line(x1: number, t1: number, x2: number, t2: number, c: RGB, lw = 0.6, cap = 0, dash?: number[]) {
    this.ops.push(
      `q ${rg(c)} RG ${n2(lw)} w ${cap} J ${dash ? `[${dash.join(' ')}] 0 d ` : ''}${n2(x1)} ${n2(this.y(t1))} m ${n2(x2)} ${n2(this.y(t2))} l S Q`
    );
  }

  polygon(points: [number, number][], fill: RGB) {
    const [first, ...rest] = points;
    this.ops.push(
      `${rg(fill)} rg ${n2(first[0])} ${n2(this.y(first[1]))} m ${rest.map(p => `${n2(p[0])} ${n2(this.y(p[1]))} l`).join(' ')} h f`
    );
  }

  circle(cx: number, top: number, r: number, o: { fill?: RGB; stroke?: RGB; lw?: number }) {
    const k = 0.5523 * r;
    const cy = this.y(top);
    const p = `${n2(cx + r)} ${n2(cy)} m ${n2(cx + r)} ${n2(cy + k)} ${n2(cx + k)} ${n2(cy + r)} ${n2(cx)} ${n2(cy + r)} c ${n2(cx - k)} ${n2(cy + r)} ${n2(cx - r)} ${n2(cy + k)} ${n2(cx - r)} ${n2(cy)} c ${n2(cx - r)} ${n2(cy - k)} ${n2(cx - k)} ${n2(cy - r)} ${n2(cx)} ${n2(cy - r)} c ${n2(cx + k)} ${n2(cy - r)} ${n2(cx + r)} ${n2(cy - k)} ${n2(cx + r)} ${n2(cy)} c h`;
    const parts = ['q'];
    if (o.fill) parts.push(`${rg(o.fill)} rg`);
    if (o.stroke) parts.push(`${rg(o.stroke)} RG ${n2(o.lw ?? 0.6)} w`);
    parts.push(p, o.fill && o.stroke ? 'B' : o.fill ? 'f' : 'S', 'Q');
    this.ops.push(parts.join(' '));
  }

  gradientBar(x: number, top: number, w: number, h: number, colorAt: (t: number) => RGB, steps = 60) {
    const sw = w / steps;
    for (let i = 0; i < steps; i++) this.rect(x + i * sw, top, sw + 0.6, h, colorAt((i + 0.5) / steps));
  }

  text(
    x: number,
    baseline: number,
    str: string,
    size: number,
    o: { bold?: boolean; color?: RGB; align?: 'left' | 'center' | 'right' } = {}
  ) {
    const s = toWinAnsi(str);
    const w = textWidth(s, size, !!o.bold);
    const px = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    this.ops.push(
      `BT /${o.bold ? 'F2' : 'F1'} ${n2(size)} Tf ${rg(o.color ?? C.ink)} rg ${n2(px)} ${n2(this.y(baseline))} Td (${escapePdf(s)}) Tj ET`
    );
  }

  /** Text clipped with an ellipsis to fit a width. */
  fit(x: number, baseline: number, str: string, size: number, maxW: number, o: { bold?: boolean; color?: RGB; align?: 'left' | 'center' | 'right' } = {}) {
    let s = toWinAnsi(str);
    if (textWidth(s, size, !!o.bold) > maxW) {
      while (s.length > 1 && textWidth(`${s}...`, size, !!o.bold) > maxW) s = s.slice(0, -1);
      s = `${s.trimEnd()}...`;
    }
    this.text(x, baseline, s, size, o);
  }

  paragraph(x: number, baseline: number, str: string, size: number, maxW: number, lead: number, o: { bold?: boolean; color?: RGB } = {}) {
    const lines = wrap(toWinAnsi(str), size, !!o.bold, maxW);
    lines.forEach((l, i) => this.text(x, baseline + i * lead, l, size, o));
    return lines.length;
  }

  image(x: number, top: number, w: number, h: number) {
    this.ops.push(`q ${n2(w)} 0 0 ${n2(h)} ${n2(x)} ${n2(this.y(top + h))} cm /Im1 Do Q`);
  }
}

/* ------------------------------------------------------------------ */

function card(cv: Canvas, x: number, top: number, w: number, h: number) {
  cv.rrect(x, top, w, h, 6, { fill: C.card, stroke: C.border, lw: 0.6 });
}

function cardTitle(cv: Canvas, x: number, top: number, title: string, sub?: string) {
  cv.text(x + 12, top + 15, title.toUpperCase(), 7.5, { bold: true, color: C.indigo });
  if (sub) cv.text(x + 12, top + 25, sub, 6.5, { color: C.muted });
}

export function drawPhenomMark(cv: Canvas, x: number, top: number, size: number, c: RGB) {
  const s = size / 100;
  const X = (v: number) => x + v * s;
  const Y = (v: number) => top + (v - 2) * s;
  cv.circle(X(55), Y(42), 14 * s, { stroke: c, lw: 10 * s });
  cv.line(X(41), Y(28), X(41), Y(65), c, 10 * s, 1);
  // Quadratic curve M32,82 Q50,92 68,82 as a cubic
  const p0 = [32, 82];
  const q = [50, 92];
  const p2 = [68, 82];
  const c1 = [p0[0] + (2 / 3) * (q[0] - p0[0]), p0[1] + (2 / 3) * (q[1] - p0[1])];
  const c2 = [p2[0] + (2 / 3) * (q[0] - p2[0]), p2[1] + (2 / 3) * (q[1] - p2[1])];
  cv.ops.push(
    `q ${rg(c)} RG ${n2(10 * s)} w 1 J ${n2(X(p0[0]))} ${n2(cv.H - Y(p0[1]))} m ${n2(X(c1[0]))} ${n2(cv.H - Y(c1[1]))} ${n2(X(c2[0]))} ${n2(cv.H - Y(c2[1]))} ${n2(X(p2[0]))} ${n2(cv.H - Y(p2[1]))} c S Q`
  );
}

function drawDial(cv: Canvas, cx: number, cy: number, R: number, score: number, label: string) {
  const SEG = 72;
  for (let i = 0; i < SEG; i++) {
    const f0 = i / SEG;
    const f1 = (i + 1) / SEG;
    const a0 = Math.PI * (1 - f0);
    const a1 = Math.PI * (1 - f1);
    cv.line(
      cx + R * Math.cos(a0),
      cy - R * Math.sin(a0),
      cx + R * Math.cos(a1),
      cy - R * Math.sin(a1),
      dialColor((f0 + f1) / 2),
      13,
      0
    );
  }
  // tick marks
  for (let s = 1; s <= 10; s++) {
    const a = Math.PI * (1 - (s - 1) / 9);
    const r1 = R - 10;
    const r2 = R - 14;
    cv.line(cx + r1 * Math.cos(a), cy - r1 * Math.sin(a), cx + r2 * Math.cos(a), cy - r2 * Math.sin(a), hex('#8c90b3'), 0.6);
  }
  // needle
  const f = (Math.min(10, Math.max(1, score)) - 1) / 9;
  const na = Math.PI * (1 - f);
  cv.line(cx, cy, cx + (R - 18) * Math.cos(na), cy - (R - 18) * Math.sin(na), C.white, 2.2, 1);
  cv.circle(cx, cy, 5.5, { fill: C.white });
  cv.circle(cx, cy, 2.2, { fill: C.navy });

  cv.text(cx, cy + 31, score.toFixed(1), 26, { bold: true, color: C.white, align: 'center' });
  cv.text(cx + 28, cy + 31, '/ 10', 8, { color: hex('#b9bce0') });
  const chipW = textWidth(toWinAnsi(label.toUpperCase()), 8, true) + 18;
  cv.rrect(cx - chipW / 2, cy + 36, chipW, 15, 7.5, { fill: dialColor(f) });
  cv.text(cx, cy + 46.5, label.toUpperCase(), 8, { bold: true, color: C.navy, align: 'center' });

  cv.text(cx - R - 6, cy + 14, '1 Easy', 7, { color: hex('#b9bce0') });
  cv.text(cx + R + 6, cy + 14, '10 Very Difficult', 7, { color: hex('#b9bce0'), align: 'right' });
}

/* ------------------------------------------------------------------ */

export function buildCalibrationBriefPdf(model: BriefModel, clientLogo?: ClientLogo | null): Blob {
  const W = 792;
  const H = 612;
  const M = 28;
  const CW = W - M * 2;
  const cv = new Canvas(W, H);
  const { data, scenario, result } = model;

  // Page background
  cv.rect(0, 0, W, H, C.page);

  /* ---------------- Header ---------------- */
  cv.rect(0, 0, W, 72, C.navy);
  cv.rect(0, 72, W, 2.5, C.indigo);

  drawPhenomMark(cv, M, 17, 36, C.white);
  cv.text(M + 42, 36, 'Phenom', 16, { bold: true, color: C.white });
  cv.text(M + 43, 48, 'Market Intelligence', 7, { color: hex('#a9acd6') });

  const logoW = 128;
  const logoH = 46;
  const logoX = W - M - logoW;
  const logoTop = 13;
  if (clientLogo) {
    cv.rrect(logoX, logoTop, logoW, logoH, 5, { fill: C.white });
    const scale = Math.min((logoW - 12) / clientLogo.width, (logoH - 10) / clientLogo.height);
    const iw = clientLogo.width * scale;
    const ih = clientLogo.height * scale;
    cv.image(logoX + (logoW - iw) / 2, logoTop + (logoH - ih) / 2, iw, ih);
  } else {
    cv.rrect(logoX, logoTop, logoW, logoH, 5, { stroke: hex('#6f73a8'), lw: 0.8, dash: [3, 2.5] });
    cv.text(logoX + logoW / 2, logoTop + logoH / 2 + 2.5, 'CLIENT LOGO', 7.5, { bold: true, color: hex('#8f93c4'), align: 'center' });
  }

  const title = `Executive Search Calibration Brief: ${data.roleTitle}`;
  const titleLines = wrap(toWinAnsi(title), 15, true, 440);
  const titleTop = titleLines.length > 1 ? 30 : 38;
  titleLines.slice(0, 2).forEach((l, i) => cv.text(W / 2, titleTop + i * 17, l, 15, { bold: true, color: C.white, align: 'center' }));
  cv.text(
    W / 2,
    titleTop + Math.min(titleLines.length, 2) * 17 + 2,
    `Calibrated ${data.lastCalibratedDate}  |  ${data.benchmarkSource}`,
    6.8,
    { color: hex('#a9acd6'), align: 'center' }
  );

  /* ---------------- Row A: dial, KPI cards, drivers ---------------- */
  const rowA = 86;
  const dialW = 252;
  const rowAH = 160;
  cv.rrect(M, rowA, dialW, rowAH, 6, { fill: C.navy });
  cv.text(M + 12, rowA + 15, 'HIRING DIFFICULTY SCORE', 7.5, { bold: true, color: hex('#a391f2') });
  drawDial(cv, M + dialW / 2, rowA + 104, 70, result.score, result.label);

  const rightX = M + dialW + 10;
  const rightW = W - M - rightX;
  const kpiGap = 8;
  const kpiW = (rightW - kpiGap * 3) / 4;
  const kpiH = 84;
  model.kpis.forEach((k, i) => {
    const x = rightX + i * (kpiW + kpiGap);
    card(cv, x, rowA, kpiW, kpiH);
    cv.rect(x + 6, rowA + 0.4, kpiW - 12, 2.4, TONE_COLOR[k.tone]);
    cv.fit(x + 10, rowA + 18, (PDF_KPI_LABEL[k.id] ?? k.label).toUpperCase(), 6.3, kpiW - 16, { bold: true, color: C.muted });
    const valueSize = k.value.length > 7 ? 17 : 22;
    cv.text(x + 10, rowA + 42, k.value, valueSize, { bold: true, color: C.ink });
    if (k.unit) cv.fit(x + 10, rowA + 54, k.unit, 8, kpiW - 16, { bold: true, color: TONE_COLOR[k.tone] });
    cv.paragraph(x + 10, rowA + 68, k.sub, 6.5, kpiW - 18, 8, { color: C.muted });
  });

  const driversTop = rowA + kpiH + 8;
  const driversH = rowAH - kpiH - 8;
  card(cv, rightX, driversTop, rightW, driversH);
  cv.text(rightX + 12, driversTop + 14, 'DIFFICULTY DRIVERS', 7.5, { bold: true, color: C.indigo });
  const short: Record<string, string> = {
    scarcity: 'Talent scarcity',
    compensation: 'Compensation parity',
    competition: 'Market competition',
    geography: 'Geography & work model',
  };
  const barX = rightX + 128;
  const barW = rightW - 128 - 62;
  result.pillars.forEach((p, i) => {
    const t = driversTop + 24 + i * 11;
    cv.text(rightX + 12, t + 3, `${short[p.id]} (${p.weight}%)`, 7, { color: C.ink });
    cv.rrect(barX, t - 3, barW, 6, 3, { fill: hex('#e6e8f2') });
    const fw = Math.max(6, (barW * p.sub) / 10);
    cv.rrect(barX, t - 3, fw, 6, 3, { fill: dialColor((p.sub - 1) / 9) });
    cv.text(rightX + rightW - 12, t + 3, `${p.sub.toFixed(1)} / 10`, 7, { bold: true, color: C.ink, align: 'right' });
  });

  /* ---------------- Row B: waterfall + compensation ---------------- */
  const rowB = 256;
  const rowBH = 168;
  const halfW = (CW - 10) / 2;

  // Waterfall
  card(cv, M, rowB, halfW, rowBH);
  cardTitle(cv, M, rowB, 'Scarcity simulator', 'Executive pool lost to each requested constraint');
  const steps = result.poolSteps;
  const rows = steps.length + 1;
  const rowsTop = rowB + 34;
  const rowsAreaH = rowBH - 34 - 28;
  const rowH = Math.min(19, rowsAreaH / rows);
  const labelW = 138;
  const wfX = M + 12 + labelW + 6;
  const wfW = halfW - 12 - labelW - 6 - 62;
  const total = steps[0].pool;
  const scale = (n: number) => (wfW * n) / total;
  steps.forEach((s, i) => {
    const t = rowsTop + i * rowH;
    const label = i === 0 ? 'National supply' : s.label;
    cv.fit(M + 12, t + rowH / 2 + 2.3, label, 6.8, labelW, { color: C.ink, bold: i === 0 });
    const barTop = t + 2;
    const bh = rowH - 4;
    if (i === 0) {
      cv.rect(wfX, barTop, scale(s.pool), bh, C.navy2);
      cv.text(wfX + wfW + 6, t + rowH / 2 + 2.3, `${s.pool.toLocaleString()}  (100%)`, 6.8, { bold: true, color: C.ink });
    } else {
      const prev = steps[i - 1].pool;
      cv.rect(wfX, barTop, Math.max(0.8, scale(s.pool)), bh, C.indigoSoft);
      cv.rect(wfX + scale(s.pool), barTop, Math.max(0.8, scale(prev - s.pool)), bh, hex('#f08a8a'));
      const drop = Math.round((1 - s.pool / prev) * 100);
      cv.text(wfX + wfW + 6, t + rowH / 2 + 2.3, `-${drop}%`, 6.8, { bold: true, color: C.red });
      cv.text(wfX + wfW + 32, t + rowH / 2 + 2.3, s.pool.toLocaleString(), 6.8, { color: C.muted });
    }
  });
  // final viable pool row
  {
    const t = rowsTop + steps.length * rowH;
    cv.text(M + 12, t + rowH / 2 + 2.3, 'Viable pool', 6.8, { bold: true, color: C.indigo });
    cv.rect(wfX, t + 2, Math.max(1.5, scale(result.pool)), rowH - 4, C.indigo);
    cv.text(wfX + wfW + 6, t + rowH / 2 + 2.3, `${result.pool.toLocaleString()}  (${((result.pool / total) * 100).toFixed(1)}%)`, 6.8, { bold: true, color: C.indigo });
  }
  cv.rect(M + 12, rowB + rowBH - 25, halfW - 24, 0.5, C.border);
  cv.text(M + 12, rowB + rowBH - 11, `Viable Pool Remaining: ${result.pool.toLocaleString()} Executives`, 9.5, { bold: true, color: C.ink });
  cv.text(M + halfW - 12, rowB + rowBH - 11, `${result.supplyPerPosting} per competing search`, 7, { color: C.muted, align: 'right' });

  // Compensation
  const compX = M + halfW + 10;
  card(cv, compX, rowB, halfW, rowBH);
  cardTitle(cv, compX, rowB, 'Compensation reality check', 'Target base budget against the market percentile bands');
  const { p25, median, p75 } = data.compensation.baseSalary;
  const budget = scenario.baseBudget;
  const lo = Math.min(p25 * 0.82, budget * 0.94);
  const hi = Math.max(p75 * 1.1, budget * 1.06);
  const sx = compX + 22;
  const sw = halfW - 44;
  const px = (v: number) => sx + ((v - lo) / (hi - lo)) * sw;
  const barTop = rowB + 56;
  const segs: [number, number, RGB][] = [
    [lo, p25, hex('#f6c4c4')],
    [p25, median, hex('#fbe3a6')],
    [median, p75, hex('#bfe8cb')],
    [p75, hi, hex('#cfd2f5')],
  ];
  segs.forEach(([a, b, c]) => cv.rect(px(a), barTop, px(b) - px(a), 13, c));
  [
    [p25, 'P25'],
    [median, 'Median'],
    [p75, 'P75'],
  ].forEach(([v, name]) => {
    cv.line(px(v as number), barTop - 2, px(v as number), barTop + 15, C.navy2, 1);
    cv.text(px(v as number), barTop + 25, name as string, 6.8, { bold: true, color: C.muted, align: 'center' });
    cv.text(px(v as number), barTop + 33, fmtK(v as number), 6.8, { color: C.ink, align: 'center' });
  });
  // target marker
  const tc = TONE_COLOR[model.position.tone];
  const tx = px(budget);
  cv.polygon(
    [
      [tx - 4.5, barTop - 8],
      [tx + 4.5, barTop - 8],
      [tx, barTop - 1],
    ],
    tc
  );
  cv.rect(tx - 1, barTop - 1, 2, 15, tc);
  const flag = `Target: ${fmtK(budget)} (${model.position.label})`;
  const flagW = textWidth(toWinAnsi(flag), 7.2, true) + 14;
  const flagX = Math.min(Math.max(tx - flagW / 2, compX + 8), compX + halfW - 8 - flagW);
  cv.rrect(flagX, barTop - 25, flagW, 13, 3, { fill: tc });
  cv.text(flagX + flagW / 2, barTop - 15.8, flag, 7.2, { bold: true, color: C.white, align: 'center' });
  // delta
  const sign = model.position.delta >= 0 ? '+' : '-';
  cv.text(
    compX + halfW - 12,
    rowB + 25,
    `${sign}${fmtK(Math.abs(model.position.delta))} (${sign}${Math.abs(model.position.deltaPct)}%) vs median ${fmtK(median)}`,
    8,
    { bold: true, color: tc, align: 'right' }
  );

  // equity stacked bars
  const eqTop = rowB + 104;
  cv.rect(compX + 12, eqTop - 5, halfW - 24, 0.5, C.border);
  cv.text(compX + 12, eqTop + 6, '4-YEAR EQUITY MODEL', 6.8, { bold: true, color: C.indigo });
  cv.text(compX + 12, eqTop + 15, `Valuation at ${model.equity.multiple}x`, 6.8, { color: C.muted });
  const maxTotal = Math.max(...model.equity.years.map(y => y.total));
  const chartH = 36;
  const chartBase = eqTop + 50;
  const bw = 26;
  model.equity.years.forEach((y, i) => {
    const bx = compX + 100 + i * (bw + 14);
    const hBase = (y.base / maxTotal) * chartH;
    const hBonus = (y.bonus / maxTotal) * chartH;
    const hEq = (y.equity / maxTotal) * chartH;
    cv.rect(bx, chartBase - hBase, bw, hBase, C.navy2);
    cv.rect(bx, chartBase - hBase - hBonus, bw, hBonus, C.indigoSoft);
    cv.rect(bx, chartBase - hBase - hBonus - hEq, bw, hEq, C.amberFill);
    cv.text(bx + bw / 2, chartBase - hBase - hBonus - hEq - 3, fmtK(y.total), 6.3, { bold: true, color: C.ink, align: 'center' });
    cv.text(bx + bw / 2, chartBase + 7.5, `Yr ${y.year}`, 6.3, { color: C.muted, align: 'center' });
  });
  const lx = compX + 12;
  [
    ['Base', C.navy2],
    ['Target bonus', C.indigoSoft],
    ['Annual equity vesting', C.amberFill],
  ].forEach(([name, c], i) => {
    cv.rect(lx, eqTop + 24 + i * 11, 6, 6, c as RGB);
    cv.text(lx + 10, eqTop + 29.5 + i * 11, name as string, 6.5, { color: C.ink });
  });
  const statX = compX + 100 + 4 * (bw + 14) + 4;
  cv.text(statX, eqTop + 14, '4-yr total cost', 6.3, { color: C.muted });
  cv.text(statX, eqTop + 25, fmtK(model.equity.fourYearTotal), 11, { bold: true, color: C.ink });
  cv.text(statX, eqTop + 38, 'Unvested buy-out', 6.3, { color: C.muted });
  cv.text(statX, eqTop + 49, fmtK(model.equity.unvestedBuyout), 11, { bold: true, color: C.red });

  /* ---------------- Row C: hunting grounds ---------------- */
  const rowC = 434;
  const rowCH = 92;
  const colW = (CW - 20) / 3;
  const hubs = [...data.geography.topHubs].sort((a, b) => b.percentage - a.percentage).slice(0, 5);
  const maxHub = Math.max(...hubs.map(h => h.percentage));

  card(cv, M, rowC, colW, rowCH);
  cardTitle(cv, M, rowC, 'Top hunting grounds');
  hubs.forEach((h, i) => {
    const t = rowC + 26 + i * 12.2;
    cv.fit(M + 12, t + 3, h.metro, 6.8, 88, { color: C.ink, bold: !!h.isClientHQ });
    cv.rrect(M + 104, t - 2, colW - 104 - 44, 6, 3, { fill: hex('#e6e8f2') });
    cv.rrect(M + 104, t - 2, Math.max(5, ((colW - 104 - 44) * h.percentage) / maxHub), 6, 3, { fill: C.indigo });
    cv.text(M + colW - 12, t + 3, `${h.percentage}%`, 7, { bold: true, color: C.ink, align: 'right' });
  });

  const c2 = M + colW + 10;
  card(cv, c2, rowC, colW, rowCH);
  cardTitle(cv, c2, rowC, 'Top employers');
  model.hunting.topEmployers.forEach((e, i) => {
    const t = rowC + 26 + i * 12.2;
    cv.text(c2 + 12, t + 3, `${i + 1}`, 6.8, { bold: true, color: C.muted });
    cv.fit(c2 + 24, t + 3, e.name, 7, colW - 24 - 70, { color: C.ink });
    cv.text(c2 + colW - 12, t + 3, `${e.candidateCount.toLocaleString()} execs`, 6.8, { color: C.muted, align: 'right' });
  });

  const c3 = c2 + colW + 10;
  card(cv, c3, rowC, colW, rowCH);
  cardTitle(cv, c3, rowC, 'Fastest growing competitors', 'Actively poaching');
  cv.text(c3 + colW - 12, rowC + 15, 'Q/Q hiring', 6.3, { color: C.muted, align: 'right' });
  model.hunting.fastestGrowing.forEach((e, i) => {
    const t = rowC + 33 + i * 11.2;
    cv.fit(c3 + 12, t + 3, e.name, 7, colW - 12 - 90, { color: C.ink });
    cv.text(c3 + colW - 62, t + 3, `${e.openSearches} open`, 6.8, { color: C.muted, align: 'right' });
    cv.text(c3 + colW - 12, t + 3, `+${e.growthPct}%`, 7, { bold: true, color: C.green, align: 'right' });
  });

  /* ---------------- Executive summary ---------------- */
  const sumTop = 534;
  const sumH = 50;
  cv.rrect(M, sumTop, CW, sumH, 6, { fill: C.lavender });
  cv.rect(M, sumTop + 4, 3.5, sumH - 8, C.indigo);
  cv.text(M + 16, sumTop + 13, 'EXECUTIVE SUMMARY', 7.2, { bold: true, color: C.indigo });
  cv.paragraph(M + 16, sumTop + 25, model.summary, 8.6, CW - 32, 10.4, { color: C.ink });

  /* ---------------- Footer ---------------- */
  cv.text(M, 598, 'Phenom Market Intelligence  |  Confidential: prepared for the executive search intake', 6.5, { color: C.muted });
  cv.text(W - M, 598, 'Sources: People Data Labs, BLS, SEC DEF 14A, SerpApi, The Org', 6.5, { color: C.muted, align: 'right' });

  return assemble(cv, clientLogo ?? null);
}

export function assemble(cv: Canvas, logo: ClientLogo | null): Blob {
  const objects: string[] = [];
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = '<< /Type /Pages /Kids [6 0 R] /Count 1 >>';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
  const stream = cv.ops.join('\n');
  objects[5] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  objects[6] =
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${cv.W} ${cv.H}] ` +
    `/Resources << /Font << /F1 3 0 R /F2 4 0 R >>${logo ? ' /XObject << /Im1 7 0 R >>' : ''} >> /Contents 5 0 R >>`;
  if (logo) {
    objects[7] =
      `<< /Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceRGB ` +
      `/BitsPerComponent 8 /Filter /DCTDecode /Length ${logo.jpeg.length} >>\nstream\n${logo.jpeg}\nendstream`;
  }

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  for (let id = 1; id < objects.length; id++) {
    offsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id++) pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return new Blob([bytes], { type: 'application/pdf' });
}
