import React, { useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Download, ImagePlus, Info, Sparkles, X } from 'lucide-react';
import { initialRolesSuccessionData } from '../../data/rolesSuccessionData';
import { useRouter } from '../../context/RouterContext';
import {
  ALL_PROJECTS,
  ANALYTICS_PROJECTS,
  DEFAULT_INPUTS,
  KPI_META,
  LEVELS,
  OFFER_GOAL_DAYS,
  SLATE_TARGET,
  STAGE_COLORS,
  buildAnalytics,
  formatMoney,
  isKnownProject,
  kpiHeadlines,
  type AnalyticsInputs,
  type AnalyticsModel,
  type KpiMeta,
  type Reliability,
  type Tone,
} from '../../lib/analytics';
import { buildAnalyticsReportPdf } from '../../lib/analyticsReportPdf';
import type { ClientLogo } from '../../lib/calibrationBriefPdf';
import { readClientLogo } from '../../lib/clientLogo';
import { downloadBlob } from '../../lib/simplePdf';
import { cn } from '../../lib/utils';

/* Design-system tokens (Phenom kit). Status colors come from the feedback families. */
const TONE_COLOR: Record<Tone, string> = {
  good: 'var(--color-green-400)',
  warn: 'var(--color-brown-400)',
  bad: 'var(--color-red-500)',
  neutral: 'var(--color-secondary-300)',
};
const TRACK = 'var(--bg-neutral-soft)';
const ACCENT = 'var(--color-secondary-200)';

const RELIABILITY: Record<Reliability, { bg: string; fg: string; border: string }> = {
  High: { bg: 'var(--feedback-success-bg-light)', fg: 'var(--feedback-success-text-strong)', border: 'var(--feedback-success-bg-default)' },
  Medium: { bg: 'var(--bg-neutral-soft)', fg: 'var(--text-default)', border: 'var(--border-default)' },
  'Low to medium': { bg: 'var(--feedback-warning-bg-light)', fg: 'var(--feedback-warning-text-strong)', border: 'var(--feedback-warning-bg-default)' },
};

const meta = (id: KpiMeta['id']) => KPI_META.find(k => k.id === id)!;

/* ------------------------------------------------------------------ */
/* Card shell                                                           */
/* ------------------------------------------------------------------ */

function KpiCard({ id, model, children }: { id: KpiMeta['id']; model: AnalyticsModel; children: React.ReactNode }) {
  const k = meta(id);
  const r = RELIABILITY[k.reliability];
  const h = kpiHeadlines(model)[id];
  const [open, setOpen] = useState(false);
  return (
    <article
      aria-labelledby={`kpi-${id}`}
      data-kpi={id}
      className="bg-(--bg-default) rounded-2xl border border-(--border-light) shadow-(--shadow-sm) flex flex-col min-w-0"
    >
      <header className="p-5 pb-0 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-7 h-7 rounded-full bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-default) text-xs font-semibold flex items-center justify-center shrink-0">
            {k.number}
          </span>
          <div className="min-w-0">
            <h3 id={`kpi-${id}`} className="text-sm font-semibold text-(--text-strong)">{k.name}</h3>
            <p className="text-xs text-(--text-default) mt-0.5">{k.roi}</p>
          </div>
        </div>
        <span
          className="phx-tag shrink-0"
          style={{ background: r.bg, color: r.fg, borderColor: r.border }}
          data-tooltip={k.reliabilityNote}
          tabIndex={0}
        >
          {k.reliability} reliability
        </span>
      </header>

      <div className="px-5 pt-4">
        <div className="text-4xl font-bold text-(--text-strong) tabular-nums leading-none">{h.value}</div>
        <div className="text-xs font-medium mt-1.5" style={{ color: TONE_COLOR[h.tone] }}>{h.unit}</div>
      </div>

      <div className="p-5 flex-1">{children}</div>

      <footer className="border-t border-(--border-faint) px-5 py-3">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className="flex items-center gap-1.5 text-xs font-medium text-(--text-brand-secondary-default) cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" /> How this is measured
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
        </button>
        {open && (
          <dl className="mt-2.5 space-y-1.5 text-xs text-(--text-default)">
            <div><dt className="inline font-semibold text-(--text-strong)">Measured: </dt><dd className="inline">{k.measured}</dd></div>
            <div><dt className="inline font-semibold text-(--text-strong)">Reliability: </dt><dd className="inline">{k.reliabilityNote}</dd></div>
          </dl>
        )}
      </footer>
    </article>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="xl:col-span-2 text-xs font-semibold uppercase tracking-wider text-(--text-default) mt-2">{children}</h2>;
}

/* ------------------------------------------------------------------ */
/* Visuals                                                              */
/* ------------------------------------------------------------------ */

function SlateBars({ m }: { m: AnalyticsModel }) {
  const max = 80;
  const [lo, hi] = SLATE_TARGET;
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-(--text-default) mb-2">
        <span>Baseline before Phenom: <b className="text-(--text-strong)">{m.slate.baseline} days</b></span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-(--color-green-100) border border-(--color-green-200)" /> Target {lo} to {hi} days
        </span>
      </div>
      <ul className="space-y-1.5" aria-label="Days to first slate">
        {m.slate.rows.map(s => {
          const color =
            s.kind === 'reference'
              ? 'var(--color-secondary-50)'
              : !s.slated
                ? 'var(--color-secondary-50)'
                : s.band === 'over'
                  ? 'var(--color-red-400)'
                  : s.band === 'within'
                    ? 'var(--color-green-400)'
                    : 'var(--color-secondary-100)';
          const text = s.kind === 'reference' ? 'var(--text-default)' : !s.slated ? 'var(--text-default)' : s.band === 'over' ? 'var(--color-red-500)' : 'var(--color-green-400)';
          return (
            <li key={s.label} className="grid grid-cols-[150px_minmax(0,1fr)_84px] items-center gap-3">
              <span className={cn('text-xs truncate', s.kind === 'reference' ? 'text-(--text-default)' : 'text-(--text-strong)')} title={s.label}>{s.label}</span>
              <div className="relative h-4 rounded-sm" style={{ background: TRACK }}>
                <div
                  className="absolute inset-y-0 bg-(--color-green-100)"
                  style={{ left: `${(lo / max) * 100}%`, width: `${((hi - lo) / max) * 100}%` }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-y-0.5 left-0 rounded-sm"
                  style={{
                    width: `${Math.min(100, (s.days / max) * 100)}%`,
                    background: s.slated ? color : `repeating-linear-gradient(135deg, var(--color-secondary-75), var(--color-secondary-75) 4px, var(--color-secondary-40) 4px, var(--color-secondary-40) 8px)`,
                  }}
                />
              </div>
              <span className="text-xs font-semibold tabular-nums text-right" style={{ color: text }}>
                {s.days}d{!s.slated && <span className="font-normal text-(--text-subtle)"> so far</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StageTimeline({ m }: { m: AnalyticsModel }) {
  const max = Math.max(...m.stages.searches.map(s => s.total), 1);
  const single = m.scope.single;
  return (
    <div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3" aria-label="Stage legend">
        {m.stages.names.map((n, i) => (
          <span key={n} className="flex items-center gap-1.5 text-xs text-(--text-default)">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: STAGE_COLORS[i] }} />
            {n}
            {!single && <span className="text-(--text-subtle)">median {m.stages.medians[i]}d</span>}
          </span>
        ))}
      </div>
      <ul className="space-y-2" aria-label="Search timelines">
        {m.stages.searches.map(s => (
          <li key={s.title} className="grid grid-cols-[150px_minmax(0,1fr)_160px] items-center gap-3">
            <span className="text-xs text-(--text-strong) truncate" title={s.title}>{s.title}</span>
            <div className="flex h-5 rounded-sm overflow-hidden" style={{ width: `${(s.total / max) * 100}%`, minWidth: 40, background: TRACK }}>
              {s.days.map((d, i) =>
                d > 0 ? (
                  <div
                    key={i}
                    title={`${m.stages.names[i]}: ${d} days`}
                    className={cn('h-full', s.active && i === s.current && 'ring-2 ring-inset ring-white/70')}
                    style={{ width: `${(d / s.total) * 100}%`, background: STAGE_COLORS[i] }}
                  />
                ) : null
              )}
            </div>
            <span className="text-xs text-right whitespace-nowrap" style={{ color: s.stalled ? TONE_COLOR.warn : 'var(--text-default)' }}>
              {s.active ? `${m.stages.names[s.current]} · ${s.days[s.current]}d` : `${s.total} days total`}
              {s.stalled && <b> · stalled</b>}
            </span>
          </li>
        ))}
      </ul>

      {single ? (
        <div className="mt-4">
          <div className="text-xs font-semibold text-(--text-default) mb-2">Days in each stage against the portfolio median</div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {m.stages.names.map((n, i) => {
              const days = m.stages.medians[i];
              const med = m.stages.portfolioMedians[i];
              const delta = days - med;
              return (
                <div key={n} className="rounded-lg bg-(--bg-neutral-soft) p-2.5">
                  <div className="text-xs text-(--text-default)">{n}</div>
                  <div className="text-base font-semibold tabular-nums text-(--text-strong)">{days > 0 ? `${days}d` : '·'}</div>
                  <div className="text-xs tabular-nums" style={{ color: days === 0 ? 'var(--text-subtle)' : delta > 2 ? TONE_COLOR.bad : delta < -2 ? TONE_COLOR.good : 'var(--text-default)' }}>
                    {days === 0 ? 'not reached' : `${delta > 0 ? '+' : ''}${delta}d vs ${med}d`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-xs text-(--text-default) mt-3">
          {m.stages.stalledCount} of {m.stages.searches.length} active searches are stalled in their current stage. {m.stages.names[m.stages.slowestIndex]} is the slowest stage across all searches.
        </p>
      )}
    </div>
  );
}

function Funnel({ m }: { m: AnalyticsModel }) {
  const max = Math.max(m.funnel[0].count, 1);
  return (
    <ul className="space-y-2" aria-label="Pipeline conversion funnel">
      {m.funnel.map((f, i) => (
        <li key={f.label}>
          <div className="flex items-baseline justify-between text-xs mb-1">
            <span className="text-(--text-strong)">{f.label}</span>
            <span className="font-semibold text-(--text-strong) tabular-nums">
              {f.count.toLocaleString()}
              {f.stepPct !== null && (
                <span className="ml-2 font-medium text-(--text-default)">
                  {f.stepPct}% of previous{m.scope.single && f.portfolioStepPct !== null && <span className="text-(--text-subtle)"> · portfolio {f.portfolioStepPct}%</span>}
                </span>
              )}
            </span>
          </div>
          <div className="h-5 rounded-sm flex justify-center" style={{ background: TRACK }} aria-hidden="true">
            <div className="h-full rounded-sm" style={{ width: `${f.count === 0 ? 0 : Math.max(2, (f.count / max) * 100)}%`, background: STAGE_COLORS[Math.min(i, 5)] }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function FeedbackHistogram({ m }: { m: AnalyticsModel }) {
  if (m.feedback.n === 0) {
    return (
      <div className="rounded-xl bg-(--bg-neutral-soft) p-4 text-xs text-(--text-default)">
        No slate has been shared with the hiring manager on this search yet, so there is no feedback turnaround to measure.
      </div>
    );
  }
  const max = Math.max(...m.feedback.buckets.map(b => b.count), 1);
  const fills = ['var(--color-green-400)', 'var(--color-green-400)', 'var(--color-brown-200)', 'var(--color-red-300)', 'var(--color-red-400)'];
  return (
    <div>
      <div className="flex items-end gap-3 h-36" role="img" aria-label="Distribution of hiring manager feedback turnaround">
        {m.feedback.buckets.map((b, i) => (
          <div key={b.label} className="flex-1 flex flex-col items-center justify-end h-full">
            <span className="text-xs font-semibold text-(--text-strong) mb-1">{b.count}</span>
            <div className="w-full rounded-t-sm" style={{ height: `${(b.count / max) * 100}%`, background: fills[i], minHeight: b.count ? 4 : 2, opacity: b.count ? 1 : 0.25 }} />
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-1.5">
        {m.feedback.buckets.map(b => (
          <span key={b.label} className="flex-1 text-center text-xs text-(--text-default)">{b.label}</span>
        ))}
      </div>
      <p className="text-xs text-(--text-default) mt-3">
        {m.feedback.within48Pct}% of {m.feedback.n} feedback responses arrived within 48 hours.
        {!m.scope.single && ` ${m.feedback.inBookPct}% of feedback is captured in the Digital Search Book today; the rest arrives by email and is not measured.`}
      </p>
    </div>
  );
}

function ResearchChart({ m, inputs, setInputs }: { m: AnalyticsModel; inputs: AnalyticsInputs; setInputs: (i: AnalyticsInputs) => void }) {
  const vals = m.research.cumulativeHours;
  const W = 520;
  const H = 190;
  const padL = 40;
  const padB = 28;
  const padT = 14;
  const top = Math.max(vals[vals.length - 1], 10);
  const max = Math.ceil((top * 1.1) / 10) * 10;
  const px = (i: number) => padL + (i / (vals.length - 1)) * (W - padL - 12);
  const py = (v: number) => padT + (1 - v / max) * (H - padT - padB);
  const line = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
  const area = `${line} L ${px(vals.length - 1)} ${H - padB} L ${px(0)} ${H - padB} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(max * t));
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Cumulative research hours returned">
        {ticks.map(t => (
          <g key={t}>
            <line x1={padL} x2={W - 12} y1={py(t)} y2={py(t)} stroke="var(--border-faint)" />
            <text x={padL - 6} y={py(t) + 3} fontSize="9" fill="var(--text-default)" textAnchor="end">{t.toLocaleString()}</text>
          </g>
        ))}
        <path d={area} fill="var(--color-secondary-200)" fillOpacity={0.12} />
        <path d={line} fill="none" stroke="var(--color-secondary-200)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {vals.map((v, i) => (
          <circle key={i} cx={px(i)} cy={py(v)} r={3.5} fill="var(--bg-default)" stroke="var(--color-secondary-200)" strokeWidth={2} />
        ))}
        {m.research.months.map((mo, i) => (
          <text key={mo} x={px(i)} y={H - 10} fontSize="9" fill="var(--text-default)" textAnchor={i === m.research.months.length - 1 ? 'end' : 'middle'}>{mo}</text>
        ))}
        <text x={px(vals.length - 1)} y={py(vals[vals.length - 1]) - 9} fontSize="10" fontWeight="600" fill="var(--text-strong)" textAnchor="end">
          {vals[vals.length - 1].toLocaleString()} hours
        </text>
      </svg>
      <div className="mt-2 rounded-xl border border-(--color-secondary-50) bg-(--bg-brand-secondary-subtle) p-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-(--text-default)">
        <span className="font-semibold text-(--text-brand-secondary-default)">Assumption</span>
        <label className="flex items-center gap-2 mb-0">
          Minutes per profile
          <input
            type="number"
            min={1}
            max={120}
            value={inputs.minutesPerProfile}
            onChange={e => setInputs({ ...inputs, minutesPerProfile: Math.max(1, Number(e.target.value) || 1) })}
            className="!w-20 !py-1"
          />
        </label>
        <label className="flex items-center gap-2 mb-0">
          Minutes per org map
          <input
            type="number"
            min={1}
            max={240}
            value={inputs.minutesPerOrgMap}
            onChange={e => setInputs({ ...inputs, minutesPerOrgMap: Math.max(1, Number(e.target.value) || 1) })}
            className="!w-20 !py-1"
          />
        </label>
        <span>{m.research.profiles.toLocaleString()} profiles and {m.research.orgMaps} org maps created or updated</span>
      </div>
    </div>
  );
}

function BenchHeatmap({ m }: { m: AnalyticsModel }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-(--bg-neutral-soft) p-3">
          <div className="text-2xl font-bold text-(--text-strong) tabular-nums">{m.bench.coveredPct}%</div>
          <div className="text-xs text-(--text-default)">of {m.bench.roles} {m.bench.label.toLowerCase()} have 2 or more benchmarked successors</div>
        </div>
        <div className="rounded-xl bg-(--bg-neutral-soft) p-3">
          <div className="text-2xl font-bold text-(--text-strong) tabular-nums">{m.bench.freshPct}%</div>
          <div className="text-xs text-(--text-default)">of target executives have a profile updated in the last 90 days</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-separate border-spacing-1" aria-label="Bench coverage by function and level">
          <thead>
            <tr>
              <th className="text-left font-semibold text-(--text-default) w-40">Function</th>
              {LEVELS.map(l => (
                <th key={l} className="font-semibold text-(--text-default) text-center">{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.bench.heat.map(row => (
              <tr key={row.dept}>
                <th scope="row" className="text-left font-medium text-(--text-strong) pr-2">{row.dept}</th>
                {row.cells.map((c, i) => {
                  if (!c) return <td key={i} className="h-9 rounded-md text-center text-(--text-subtle)" style={{ background: TRACK }}>·</td>;
                  const f = c.covered / c.total;
                  const bg = f >= 1 ? 'var(--color-green-400)' : f > 0 ? 'var(--color-brown-300)' : 'var(--color-red-400)';
                  return (
                    <td key={i} className="h-9 rounded-md text-center font-semibold text-white tabular-nums" style={{ background: bg }} title={`${c.covered} of ${c.total} roles covered`}>
                      {c.covered}/{c.total}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4 mt-2 text-xs text-(--text-default)">
        {[
          ['Fully covered', 'var(--color-green-400)'],
          ['Partly covered', 'var(--color-brown-300)'],
          ['No bench', 'var(--color-red-400)'],
        ].map(([n, c]) => (
          <span key={n} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{n}</span>
        ))}
      </div>
    </div>
  );
}

function AgencyTile({ m, inputs, setInputs }: { m: AnalyticsModel; inputs: AnalyticsInputs; setInputs: (i: AnalyticsInputs) => void }) {
  return (
    <div>
      <div className="rounded-xl border border-(--border-light) p-4 space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-(--text-default)">{m.scope.single ? 'Filled in-house' : 'Searches filled in-house'}</span>
          <b className="tabular-nums text-(--text-strong)">{m.scope.single ? (m.agency.inHouse ? 'Yes' : 'No') : m.agency.inHouse}</b>
        </div>
        <label className="flex items-center justify-between gap-3 mb-0">
          <span className="text-(--text-default) font-normal">x Average agency fee</span>
          <span className="flex items-center gap-1.5">
            <input
              type="number"
              min={5}
              max={40}
              aria-label="Average agency fee percent"
              value={inputs.feePct}
              onChange={e => setInputs({ ...inputs, feePct: Math.min(40, Math.max(1, Number(e.target.value) || 1)) })}
              className="!w-20 !py-1 text-right"
            />
            %
          </span>
        </label>
        <label className="flex items-center justify-between gap-3 mb-0">
          <span className="text-(--text-default) font-normal">x Average compensation</span>
          <span className="flex items-center gap-1.5">
            $
            <input
              type="number"
              min={50000}
              step={10000}
              aria-label="Average executive compensation"
              value={inputs.avgComp}
              onChange={e => setInputs({ ...inputs, avgComp: Math.max(0, Number(e.target.value) || 0) })}
              className="!w-32 !py-1 text-right"
            />
          </span>
        </label>
        <div className="border-t border-(--border-faint) pt-2.5 flex items-center justify-between">
          <span className="font-semibold text-(--text-brand-secondary-default)">= Agency spend avoided</span>
          <b className="text-lg tabular-nums text-(--text-brand-secondary-default)">{formatMoney(m.agency.avoided)}</b>
        </div>
      </div>
      <p className="text-xs text-(--text-default) mt-3">
        {m.agency.note ?? `About ${formatMoney(m.agency.perSearch)} per search.`} Inputs are customer assumptions; confirm the fee and average compensation with Finance before sharing externally.
      </p>
    </div>
  );
}

function OfferGoal({ m }: { m: AnalyticsModel }) {
  const max = 150;
  const o = m.offers;
  const single = m.scope.single;
  const markerLabel = single ? (o.status === 'none' ? `Day ${o.markerDay} so far` : `Offer on day ${o.markerDay}`) : `Median ${o.markerDay} days`;
  const settled = o.status === 'accepted' || o.status === 'declined';
  const goalNote = o.markerDay <= o.goal ? (settled ? `inside the ${o.goal}-day goal` : `left in the ${o.goal}-day goal`) : `past the ${o.goal}-day goal`;
  const barColor = o.status === 'declined' ? 'var(--color-red-400)' : o.status === 'none' || o.status === 'pending' ? 'var(--color-secondary-100)' : 'var(--color-green-400)';
  return (
    <div>
      <div className="relative mt-6 mb-9">
        <div className="h-3 rounded-full overflow-hidden" style={{ background: TRACK }}>
          <div className="h-full rounded-full" style={{ width: `${Math.min(100, (o.markerDay / max) * 100)}%`, background: barColor }} />
        </div>
        <div className="absolute -top-5 -translate-x-1/2 text-xs font-semibold text-(--text-strong) whitespace-nowrap" style={{ left: `${(o.goal / max) * 100}%` }}>
          Goal {OFFER_GOAL_DAYS} days
        </div>
        <span className="absolute -top-1 bottom-[-4px] w-0.5 bg-(--color-secondary-400)" style={{ left: `${(o.goal / max) * 100}%` }} aria-hidden="true" />
        <div className="absolute top-5 -translate-x-1/2 text-xs font-semibold whitespace-nowrap" style={{ left: `${Math.min(100, (o.markerDay / max) * 100)}%`, color: 'var(--text-strong)' }}>
          {markerLabel}
        </div>
      </div>
      {single ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-(--bg-neutral-soft) p-3">
            <div className="text-xl font-bold tabular-nums text-(--text-strong)">{o.status === 'none' ? 'No offer yet' : o.status === 'accepted' ? 'Accepted' : o.status === 'declined' ? 'Declined' : 'Pending'}</div>
            <div className="text-xs text-(--text-default)">offer status</div>
          </div>
          <div className="rounded-xl bg-(--bg-neutral-soft) p-3">
            <div className="text-xl font-bold tabular-nums text-(--text-strong)">{Math.abs(o.goal - o.markerDay)} days</div>
            <div className="text-xs text-(--text-default)">{goalNote}</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-(--bg-neutral-soft) p-3">
            <div className="text-xl font-bold tabular-nums text-(--text-strong)">{o.accepted} of {o.decided}</div>
            <div className="text-xs text-(--text-default)">offers accepted</div>
          </div>
          <div className="rounded-xl bg-(--bg-neutral-soft) p-3">
            <div className="text-xl font-bold tabular-nums text-(--text-strong)">{o.withinGoal} of {o.decided}</div>
            <div className="text-xs text-(--text-default)">signed inside {OFFER_GOAL_DAYS} days</div>
          </div>
          <div className="rounded-xl bg-(--bg-neutral-soft) p-3">
            <div className="text-xl font-bold tabular-nums text-(--text-strong)">{o.pending}</div>
            <div className="text-xs text-(--text-default)">offers pending</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* View                                                                 */
/* ------------------------------------------------------------------ */

function initialProjectId(): string {
  const p = new URLSearchParams(window.location.search).get('project');
  return isKnownProject(p) ? p : ALL_PROJECTS;
}

export function AnalyticsView() {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string>(initialProjectId);
  const [inputs, setInputs] = useState<AnalyticsInputs>(DEFAULT_INPUTS);
  const m = useMemo(() => buildAnalytics(initialRolesSuccessionData, inputs, projectId), [inputs, projectId]);
  const [downloaded, setDownloaded] = useState(false);
  const [clientLogo, setClientLogo] = useState<{ preview: string; logo: ClientLogo } | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const logoInput = useRef<HTMLInputElement>(null);

  const selectProject = (id: string) => {
    setProjectId(id);
    router.navigate(id === ALL_PROJECTS ? '/analytics' : `/analytics?project=${encodeURIComponent(id)}`, { replace: true });
  };

  const onLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setClientLogo(await readClientLogo(file));
      setLogoError(null);
    } catch {
      setLogoError('That file could not be read as an image. Try a PNG, JPG or SVG.');
    }
  };

  const download = () => {
    const slug = m.scope.single ? `-${m.scope.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '')}` : '';
    downloadBlob(buildAnalyticsReportPdf(m, clientLogo?.logo ?? null), `Executive-Search-Analytics-Report${slug}.pdf`);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const groups = (['Open and in progress', 'Closed'] as const).map(g => ({ g, items: ANALYTICS_PROJECTS.filter(p => p.group === g) }));
  const isLiveProject = m.scope.single && ANALYTICS_PROJECTS.find(p => p.id === m.scope.id)?.group === 'Open and in progress';

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full pb-20">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-(--text-strong)">Analytics</h1>
        <p className="text-xs text-(--text-default) mt-1">Proof of ROI for executive search: speed, pipeline quality, productivity and cost avoided</p>
      </div>
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div className="w-full sm:w-80">
          <label htmlFor="analytics-project" className="phx-label">Project</label>
          <select id="analytics-project" value={projectId} onChange={e => selectProject(e.target.value)}>
            <option value={ALL_PROJECTS}>All projects</option>
            {groups.map(({ g, items }) => (
              <optgroup key={g} label={g}>
                {items.map(p => (
                  <option key={p.id} value={p.id}>{p.title} · {p.status}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input ref={logoInput} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="sr-only" aria-label="Upload client logo" onChange={onLogo} />
          {clientLogo ? (
            <div className="flex items-center gap-2 rounded-xl border border-(--border-default) bg-(--bg-default) pl-3 pr-1.5 py-1.5">
              <img src={clientLogo.preview} alt="Client logo for the report" className="h-6 max-w-24 object-contain" />
              <button type="button" onClick={() => setClientLogo(null)} aria-label="Remove client logo" className="p-1 rounded-md text-(--text-default) hover:bg-(--bg-neutral-soft) cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => logoInput.current?.click()} className="phx-btn" data-variant="secondary">
              <ImagePlus className="w-4 h-4" /> Add client logo
            </button>
          )}
          <button type="button" onClick={download} className="phx-btn" data-variant="primary">
            {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            Download Analytics Report (PDF)
          </button>
        </div>
      </div>
      {logoError && <p role="alert" className="text-xs text-(--feedback-error-text-strong) mb-3">{logoError}</p>}

      {m.scope.single && (
        <div className="flex items-center gap-3 mb-4 text-sm text-(--text-default)">
          <span>Showing analytics for <b className="text-(--text-strong)">{m.scope.title}</b></span>
          <span className="phx-tag" data-tone="informational">{m.scope.status}</span>
          <button type="button" onClick={() => selectProject(ALL_PROJECTS)} className="text-xs font-medium text-(--text-brand-secondary-default) underline cursor-pointer">
            View all projects
          </button>
          {isLiveProject && (
            <button type="button" onClick={() => router.navigateToView('projects', { projectId: m.scope.id })} className="text-xs font-medium text-(--text-brand-secondary-default) underline cursor-pointer">
              Open project
            </button>
          )}
        </div>
      )}

      <div className="phx-feedback mb-6" data-tone="progressive" role="status">
        <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider">Key takeaways · {m.scope.single ? m.scope.title : `all ${m.searchCount} projects`}</div>
          <p className="mt-1 leading-relaxed">{m.takeaways}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionTitle>Speed</SectionTitle>
        <KpiCard id="time-to-slate" model={m}><SlateBars m={m} /></KpiCard>
        <KpiCard id="time-in-stage" model={m}><StageTimeline m={m} /></KpiCard>

        <SectionTitle>Pipeline quality</SectionTitle>
        <KpiCard id="conversion" model={m}><Funnel m={m} /></KpiCard>
        <KpiCard id="feedback" model={m}><FeedbackHistogram m={m} /></KpiCard>

        <SectionTitle>Productivity and coverage</SectionTitle>
        <KpiCard id="research-hours" model={m}><ResearchChart m={m} inputs={inputs} setInputs={setInputs} /></KpiCard>
        <KpiCard id="bench" model={m}><BenchHeatmap m={m} /></KpiCard>

        <SectionTitle>Financial and outcomes</SectionTitle>
        <KpiCard id="agency" model={m}><AgencyTile m={m} inputs={inputs} setInputs={setInputs} /></KpiCard>
        <KpiCard id="offers" model={m}><OfferGoal m={m} /></KpiCard>
      </div>
    </div>
  );
}
