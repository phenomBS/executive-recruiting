import { textWidth, toWinAnsi, wrap } from './simplePdf';
import { Canvas, C, assemble, drawPhenomMark, hex, type ClientLogo, type RGB } from './calibrationBriefPdf';
import { KPI_META, OFFER_GOAL_DAYS, SLATE_TARGET, STAGE_COLORS, formatMoney, type AnalyticsModel, type Reliability } from './analytics';

/**
 * One-page landscape Analytics ROI report: eight KPI cards, each with its headline number,
 * a small data-driven visual, the ROI story and how it is measured, plus a generated takeaway.
 */

const REL_COLOR: Record<Reliability, RGB> = {
  High: C.green,
  Medium: C.amber,
  'Low to medium': hex('#c2410c'),
};

const stageRgb = STAGE_COLORS.map(hex);

export function buildAnalyticsReportPdf(m: AnalyticsModel, clientLogo?: ClientLogo | null): Blob {
  const W = 792;
  const H = 612;
  const M = 28;
  const CW = W - M * 2;
  const cv = new Canvas(W, H);

  cv.rect(0, 0, W, H, C.page);

  /* Header */
  cv.rect(0, 0, W, 72, C.navy);
  cv.rect(0, 72, W, 2.5, C.indigo);
  drawPhenomMark(cv, M, 17, 36, C.white);
  cv.text(M + 42, 36, 'Phenom', 16, { bold: true, color: C.white });
  cv.text(M + 43, 48, 'Executive Search Analytics', 7, { color: hex('#a9acd6') });

  const logoW = 128;
  const logoH = 46;
  const logoX = W - M - logoW;
  if (clientLogo) {
    cv.rrect(logoX, 13, logoW, logoH, 5, { fill: C.white });
    const scale = Math.min((logoW - 12) / clientLogo.width, (logoH - 10) / clientLogo.height);
    const iw = clientLogo.width * scale;
    const ih = clientLogo.height * scale;
    cv.image(logoX + (logoW - iw) / 2, 13 + (logoH - ih) / 2, iw, ih);
  } else {
    cv.rrect(logoX, 13, logoW, logoH, 5, { stroke: hex('#6f73a8'), lw: 0.8, dash: [3, 2.5] });
    cv.text(logoX + logoW / 2, 13 + logoH / 2 + 2.5, 'CLIENT LOGO', 7.5, { bold: true, color: hex('#8f93c4'), align: 'center' });
  }

  cv.text(W / 2, 36, 'Executive Search Analytics Report', 17, { bold: true, color: C.white, align: 'center' });
  cv.text(W / 2, 52, 'Proof of ROI: speed, pipeline quality, productivity and cost avoided', 8, { color: hex('#c9cbeb'), align: 'center' });
  cv.text(W / 2, 63, `Reporting period: last 6 months to Nov 5, 2026  |  ${m.searchCount} searches analyzed`, 6.8, {
    color: hex('#a9acd6'),
    align: 'center',
  });

  /* Cards */
  const gap = 10;
  const cardW = (CW - gap * 3) / 4;
  const cardH = 212;
  const top1 = 86;
  const top2 = top1 + cardH + 10;

  const headline: Record<string, { value: string; unit: string; tone: RGB }> = {
    'time-to-slate': { value: `${m.slate.median}`, unit: `days median, ${m.slate.improvementPct}% faster than ${m.slate.baseline}-day baseline`, tone: C.green },
    'time-in-stage': {
      value: m.stages.names[m.stages.slowestIndex],
      unit: `slowest stage, median ${m.stages.medians[m.stages.slowestIndex]} days`,
      tone: C.amber,
    },
    conversion: {
      value: `${m.funnel[m.funnel.length - 1].overallPct}%`,
      unit: `identified to hired, ${m.funnel[m.funnel.length - 1].count} hires`,
      tone: C.navy2,
    },
    feedback: { value: `${m.feedback.medianHours}h`, unit: `median turnaround, ${m.feedback.within48Pct}% within 48 hours`, tone: C.amber },
    'research-hours': { value: m.research.totalHours.toLocaleString(), unit: `hours returned, about ${m.research.fteWeeks} FTE-weeks`, tone: C.green },
    bench: { value: `${m.bench.coveredPct}%`, unit: `of roles with 2+ successors, ${m.bench.freshPct}% profiles fresh`, tone: C.green },
    agency: { value: formatMoney(m.agency.avoided), unit: `agency fees avoided on ${m.agency.inHouse} in-house fills`, tone: C.green },
    offers: { value: `${m.offers.acceptancePct}%`, unit: `acceptance, median ${m.offers.medianDaysToOffer} days to offer`, tone: C.green },
  };

  KPI_META.forEach((k, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = M + col * (cardW + gap);
    const top = row === 0 ? top1 : top2;

    cv.rrect(x, top, cardW, cardH, 6, { fill: C.card, stroke: C.border, lw: 0.6 });

    // Number badge + name
    cv.circle(x + 16, top + 17, 7, { fill: C.lavender });
    cv.text(x + 16, top + 19.8, String(k.number), 7.5, { bold: true, color: C.indigo, align: 'center' });
    const nameLines = wrap(toWinAnsi(k.name), 8, true, cardW - 42).slice(0, 2);
    nameLines.forEach((l, li) => cv.text(x + 29, top + 15 + li * 9.5, l, 8, { bold: true, color: C.ink }));

    // Headline
    const h = headline[k.id];
    const vSize = h.value.length > 8 ? 15 : 22;
    cv.text(x + 12, top + 50, h.value, vSize, { bold: true, color: C.ink });
    cv.paragraph(x + 12, top + 60, h.unit, 6.5, cardW - 22, 7.6, { bold: true, color: h.tone });

    // Visual region
    const vx = x + 12;
    const vTop = top + 76;
    const vw = cardW - 24;
    const vh = 66;
    drawVisual(cv, k.id, m, vx, vTop, vw, vh);

    // ROI story + measured
    cv.paragraph(x + 12, top + 156, k.roi, 6.6, cardW - 22, 8, { color: C.ink, bold: true });
    cv.paragraph(x + 12, top + 175, `Measured: ${k.measured}`, 5.6, cardW - 22, 6.7, { color: C.muted });

    // Reliability chip
    const rc = REL_COLOR[k.reliability];
    const label = `Reliability: ${k.reliability}`;
    const cw = textWidth(toWinAnsi(label), 6, true) + 12;
    cv.rrect(x + 12, top + cardH - 17, cw, 11, 5.5, { fill: C.card, stroke: rc, lw: 0.8 });
    cv.text(x + 12 + cw / 2, top + cardH - 9.3, label, 6, { bold: true, color: rc, align: 'center' });
  });

  /* Takeaways */
  const sumTop = top2 + cardH + 8;
  const sumH = 612 - sumTop - 24;
  cv.rrect(M, sumTop, CW, sumH, 6, { fill: C.lavender });
  cv.rect(M, sumTop + 4, 3.5, sumH - 8, C.indigo);
  cv.text(M + 16, sumTop + 12, 'KEY TAKEAWAYS', 7.2, { bold: true, color: C.indigo });
  cv.paragraph(M + 16, sumTop + 23, m.takeaways, 7.6, CW - 32, 9.2, { color: C.ink });

  cv.text(M, 603, 'Phenom Executive Search Analytics  |  Confidential', 6.5, { color: C.muted });
  cv.text(W - M, 603, 'Hours and agency figures use the customer-agreed assumptions shown in the Analytics tab', 6.5, { color: C.muted, align: 'right' });

  return assemble(cv, clientLogo ?? null);
}

/* ------------------------------------------------------------------ */

function drawVisual(cv: Canvas, id: string, m: AnalyticsModel, x: number, top: number, w: number, h: number) {
  switch (id) {
    case 'time-to-slate': {
      const max = 80;
      const sx = (d: number) => x + (d / max) * w;
      cv.rect(sx(SLATE_TARGET[0]), top, sx(SLATE_TARGET[1]) - sx(SLATE_TARGET[0]), h - 9, hex('#d4efe0'));
      const n = m.slate.searches.length;
      const rh = (h - 9) / n;
      m.slate.searches.forEach((s, i) => {
        const color = !s.slated ? hex('#b9bce0') : s.band === 'over' ? C.red : s.band === 'within' ? C.green : C.indigoSoft;
        cv.rect(x, top + i * rh + 0.8, Math.max(2, sx(Math.min(s.days, max)) - x), rh - 1.6, color);
      });
      cv.text(sx(SLATE_TARGET[0]), top + h, `${SLATE_TARGET[0]}`, 5.8, { color: C.muted, align: 'center' });
      cv.text(sx(SLATE_TARGET[1]), top + h, `${SLATE_TARGET[1]}`, 5.8, { color: C.muted, align: 'center' });
      cv.text(x + w, top + h, `${max}d`, 5.8, { color: C.muted, align: 'right' });
      break;
    }
    case 'time-in-stage': {
      const max = Math.max(...m.stages.searches.map(s => s.total));
      const n = m.stages.searches.length;
      const rh = (h - 10) / n;
      m.stages.searches.forEach((s, i) => {
        let cx = x;
        s.days.forEach((d, si) => {
          const dw = (d / max) * w;
          if (d > 0) cv.rect(cx, top + i * rh + 1, dw, rh - 2, stageRgb[si]);
          cx += dw;
        });
      });
      stageRgb.forEach((c, si) => {
        cv.rect(x + si * (w / 6), top + h - 5, 5, 5, c);
        cv.text(x + si * (w / 6) + 7, top + h - 0.3, m.stages.names[si].slice(0, 5), 4.8, { color: C.muted });
      });
      break;
    }
    case 'conversion': {
      const n = m.funnel.length;
      const rh = h / n;
      const labelW = 36;
      const bw = w - labelW - 28;
      const max = m.funnel[0].count;
      m.funnel.forEach((f, i) => {
        const t = top + i * rh;
        cv.text(x, t + rh - 1.6, f.label, 5.8, { color: C.ink });
        const width = Math.max(2, (f.count / max) * bw);
        cv.rect(x + labelW + (bw - width) / 2, t + 0.8, width, rh - 1.8, stageRgb[Math.min(i, 5)]);
        cv.text(x + w, t + rh - 1.6, f.count.toLocaleString(), 5.8, { bold: true, color: C.ink, align: 'right' });
      });
      break;
    }
    case 'feedback': {
      const b = m.feedback.buckets;
      const max = Math.max(...b.map(v => v.count));
      const bw = w / b.length;
      b.forEach((v, i) => {
        const bh = ((h - 18) * v.count) / max;
        cv.rect(x + i * bw + 3, top + h - 9 - bh, bw - 6, bh, i < 2 ? C.green : i === 2 ? C.amberFill : C.red);
        cv.text(x + i * bw + bw / 2, top + h - 11 - bh, String(v.count), 6, { bold: true, color: C.ink, align: 'center' });
        cv.text(x + i * bw + bw / 2, top + h - 1, v.label.replace(' days', 'd').replace('Under ', '<').replace('Over ', '>'), 5, { color: C.muted, align: 'center' });
      });
      break;
    }
    case 'research-hours': {
      const vals = m.research.cumulativeHours;
      const max = vals[vals.length - 1] * 1.05;
      const px = (i: number) => x + (i / (vals.length - 1)) * w;
      const py = (v: number) => top + (h - 14) - (v / max) * (h - 18);
      const pts: [number, number][] = [[px(0), top + h - 14], ...vals.map((v, i) => [px(i), py(v)] as [number, number]), [px(vals.length - 1), top + h - 14]];
      cv.polygon(pts, hex('#e2defa'));
      vals.forEach((v, i) => {
        if (i > 0) cv.line(px(i - 1), py(vals[i - 1]), px(i), py(v), C.indigo, 1.6, 1);
      });
      vals.forEach((v, i) => cv.circle(px(i), py(v), 1.8, { fill: C.indigo }));
      cv.text(px(vals.length - 1), py(vals[vals.length - 1]) - 4, `${vals[vals.length - 1].toLocaleString()} h`, 6.2, { bold: true, color: C.ink, align: 'right' });
      cv.text(x, top + h - 4, `${m.research.months[0]}`, 5.4, { color: C.muted });
      cv.text(x + w, top + h - 4, 'Nov', 5.4, { color: C.muted, align: 'right' });
      cv.text(x + w / 2, top + h + 4, `Assumes ${m.inputs.minutesPerProfile} min per profile, ${m.inputs.minutesPerOrgMap} per org map`, 5.2, { color: C.muted, align: 'center' });
      break;
    }
    case 'bench': {
      const rows = m.bench.heat;
      const labelW = 50;
      const cw = (w - labelW) / 4;
      const rh = (h - 8) / rows.length;
      ['C-Suite', 'SVP', 'VP', 'Head of'].forEach((l, i) => cv.text(x + labelW + i * cw + cw / 2, top + 4.5, l, 5, { color: C.muted, align: 'center' }));
      rows.forEach((r, ri) => {
        const t = top + 8 + ri * rh;
        cv.fit(x, t + rh / 2 + 2, r.dept.replace(' & ', ' & '), 5.4, labelW - 3, { color: C.ink });
        r.cells.forEach((cell, ci) => {
          const cx = x + labelW + ci * cw;
          if (!cell) {
            cv.rect(cx + 1, t + 1, cw - 2, rh - 2, hex('#eef0f6'));
            return;
          }
          const f = cell.covered / cell.total;
          cv.rect(cx + 1, t + 1, cw - 2, rh - 2, f >= 1 ? C.green : f > 0 ? C.amberFill : C.red);
          cv.text(cx + cw / 2, t + rh / 2 + 2, `${cell.covered}/${cell.total}`, 5.6, { bold: true, color: C.white, align: 'center' });
        });
      });
      break;
    }
    case 'agency': {
      const lines: [string, string][] = [
        ['In-house fills', String(m.agency.inHouse)],
        ["x Average fee", `${m.agency.feePct}%`],
        ['x Average compensation', formatMoney(m.agency.avgComp)],
      ];
      lines.forEach(([l, v], i) => {
        const t = top + 8 + i * 13;
        cv.text(x, t, l, 6.6, { color: C.muted });
        cv.text(x + w, t, v, 7.4, { bold: true, color: C.ink, align: 'right' });
        cv.rect(x, t + 3.5, w, 0.4, C.border);
      });
      cv.rrect(x, top + 46, w, 18, 4, { fill: C.lavender });
      cv.text(x + 8, top + 58, '= Agency spend avoided', 6.4, { bold: true, color: C.indigo });
      cv.text(x + w - 8, top + 58, formatMoney(m.agency.avoided), 9.5, { bold: true, color: C.indigo, align: 'right' });
      break;
    }
    case 'offers': {
      const max = 150;
      const sx = (d: number) => x + (d / max) * w;
      cv.rrect(x, top + 10, w, 9, 4.5, { fill: hex('#e6e8f2') });
      cv.rrect(x, top + 10, Math.max(8, sx(m.offers.medianDaysToOffer) - x), 9, 4.5, { fill: C.green });
      cv.line(sx(OFFER_GOAL_DAYS), top + 5, sx(OFFER_GOAL_DAYS), top + 24, C.navy, 1.2);
      cv.text(sx(OFFER_GOAL_DAYS), top + 3, `Goal ${OFFER_GOAL_DAYS}d`, 5.8, { bold: true, color: C.navy, align: 'center' });
      cv.text(sx(m.offers.medianDaysToOffer), top + 33, `Median ${m.offers.medianDaysToOffer}d`, 5.8, { bold: true, color: C.green, align: 'center' });
      cv.text(x, top + 48, `${m.offers.accepted} of ${m.offers.decided} offers accepted`, 6.8, { bold: true, color: C.ink });
      cv.text(x, top + 58, `${m.offers.withinGoal} of ${m.offers.decided} signed inside the goal, ${m.offers.pending} pending`, 5.8, { color: C.muted });
      break;
    }
  }
}
