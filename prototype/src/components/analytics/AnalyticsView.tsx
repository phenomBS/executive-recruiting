import React, { useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Download, ImagePlus, Info, Sparkles, X } from 'lucide-react';
import { initialRolesSuccessionData } from '../../data/rolesSuccessionData';
import {
  DEFAULT_INPUTS,
  KPI_META,
  LEVELS,
  MANUAL_BASELINE_DAYS,
  OFFER_GOAL_DAYS,
  SLATE_TARGET,
  STAGE_COLORS,
  buildAnalytics,
  formatMoney,
  type AnalyticsInputs,
  type AnalyticsModel,
  type KpiMeta,
  type Reliability,
} from '../../lib/analytics';
import { buildAnalyticsReportPdf } from '../../lib/analyticsReportPdf';
import type { ClientLogo } from '../../lib/calibrationBriefPdf';
import { readClientLogo } from '../../lib/clientLogo';
import { downloadBlob } from '../../lib/simplePdf';
import { cn } from '../../lib/utils';

const GOOD = '#00875a';
const WARN = '#b07400';
const BAD = '#c0262d';
const INDIGO = '#4d3ee0';

const RELIABILITY: Record<Reliability, { color: string; soft: string; border: string }> = {
  High: { color: '#00875a', soft: '#e6f6ef', border: '#9fd8c0' },
  Medium: { color: '#b07400', soft: '#fff6dc', border: '#efd48b' },
  'Low to medium': { color: '#ba4800', soft: '#fdeee3', border: '#f0bb96' },
};

const meta = (id: KpiMeta['id']) => KPI_META.find(k => k.id === id)!;

/* ------------------------------------------------------------------ */
/* Card shell                                                           */
/* ------------------------------------------------------------------ */

function KpiCard({
  id,
  headline,
  unit,
  tone = GOOD,
  wide,
  children,
}: {
  id: KpiMeta['id'];
  headline: string;
  unit: string;
  tone?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const k = meta(id);
  const r = RELIABILITY[k.reliability];
  const [open, setOpen] = useState(false);
  return (
    <article
      aria-labelledby={`kpi-${id}`}
      data-kpi={id}
      className={cn('bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-w-0', wide && 'xl:col-span-2')}
    >
      <header className="p-5 pb-0 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-7 h-7 rounded-full bg-(--bg-brand-secondary-subtle) text-(--color-secondary-200) text-xs font-bold flex items-center justify-center shrink-0">
            {k.number}
          </span>
          <div className="min-w-0">
            <h3 id={`kpi-${id}`} className="text-sm font-bold text-slate-900">{k.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{k.roi}</p>
          </div>
        </div>
        <span
          className="px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap shrink-0"
          style={{ background: r.soft, color: r.color, borderColor: r.border }}
          data-tooltip={k.reliabilityNote}
          tabIndex={0}
        >
          {k.reliability} reliability
        </span>
      </header>

      <div className="px-5 pt-4">
        <div className="text-4xl font-black text-slate-900 tabular-nums leading-none">{headline}</div>
        <div className="text-xs font-semibold mt-1.5" style={{ color: tone }}>{unit}</div>
      </div>

      <div className="p-5 flex-1">{children}</div>

      <footer className="border-t border-slate-100 px-5 py-3">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className="flex items-center gap-1.5 text-xs font-semibold text-(--color-secondary-200) cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" /> How this is measured
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
        </button>
        {open && (
          <dl className="mt-2.5 space-y-1.5 text-xs text-slate-600">
            <div><dt className="inline font-bold text-slate-800">Measured: </dt><dd className="inline">{k.measured}</dd></div>
            <div><dt className="inline font-bold text-slate-800">Reliability: </dt><dd className="inline">{k.reliabilityNote}</dd></div>
          </dl>
        )}
      </footer>
    </article>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-2">{children}</h2>;
}

/* ------------------------------------------------------------------ */
/* Visuals                                                              */
/* ------------------------------------------------------------------ */

function SlateBars({ m }: { m: AnalyticsModel }) {
  const max = 80;
  const [lo, hi] = SLATE_TARGET;
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
        <span>Baseline before Phenom: <b className="text-slate-800">{MANUAL_BASELINE_DAYS} days</b></span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: '#d4efe0' }} /> Target {lo} to {hi} days
        </span>
      </div>
      <ul className="space-y-1.5" aria-label="Days to first slate by search">
        {m.slate.searches.map(s => {
          const color = !s.slated ? '#b9bce0' : s.band === 'over' ? BAD : s.band === 'within' ? GOOD : '#7571e0';
          return (
            <li key={s.title} className="grid grid-cols-[130px_minmax(0,1fr)_72px] items-center gap-3">
              <span className="text-xs text-slate-700 truncate" title={s.title}>{s.title}</span>
              <div className="relative h-4 rounded bg-slate-50">
                <div className="absolute inset-y-0 rounded-sm" style={{ left: `${(lo / max) * 100}%`, width: `${((hi - lo) / max) * 100}%`, background: '#d4efe0' }} aria-hidden="true" />
                <div
                  className="absolute inset-y-0.5 left-0 rounded-sm"
                  style={{
                    width: `${Math.min(100, (s.days / max) * 100)}%`,
                    background: s.slated ? color : `repeating-linear-gradient(135deg, ${color}, ${color} 4px, #e6e8f6 4px, #e6e8f6 8px)`,
                  }}
                />
              </div>
              <span className="text-xs font-bold tabular-nums text-right" style={{ color: s.slated ? color : '#626780' }}>
                {s.days}d{!s.slated && <span className="font-normal text-slate-400"> so far</span>}
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
  return (
    <div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3" aria-label="Stage legend">
        {m.stages.names.map((n, i) => (
          <span key={n} className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: STAGE_COLORS[i] }} />
            {n}
            <span className="text-slate-400">median {m.stages.medians[i]}d</span>
          </span>
        ))}
      </div>
      <ul className="space-y-2" aria-label="Active search timelines">
        {m.stages.searches.map(s => (
          <li key={s.title} className="grid grid-cols-[150px_minmax(0,1fr)_150px] items-center gap-3">
            <span className="text-xs text-slate-700 truncate" title={s.title}>{s.title}</span>
            <div className="flex h-5 rounded overflow-hidden bg-slate-50" style={{ width: `${(s.total / max) * 100}%`, minWidth: 40 }}>
              {s.days.map((d, i) =>
                d > 0 ? (
                  <div
                    key={i}
                    title={`${m.stages.names[i]}: ${d} days`}
                    className={cn('h-full', i === s.current && 'ring-2 ring-inset ring-white/70')}
                    style={{ width: `${(d / s.total) * 100}%`, background: STAGE_COLORS[i] }}
                  />
                ) : null
              )}
            </div>
            <span className="text-[11px] text-right whitespace-nowrap" style={{ color: s.stalled ? WARN : '#626780' }}>
              {m.stages.names[s.current]} · {s.days[s.current]}d{s.stalled && <b> · stalled</b>}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-600 mt-3">
        {m.stages.stalledCount} of {m.stages.searches.length} active searches are stalled in their current stage. {m.stages.names[m.stages.slowestIndex]} is the slowest stage across all searches.
      </p>
    </div>
  );
}

function Funnel({ m }: { m: AnalyticsModel }) {
  const max = m.funnel[0].count;
  return (
    <ul className="space-y-2" aria-label="Pipeline conversion funnel">
      {m.funnel.map((f, i) => (
        <li key={f.label}>
          <div className="flex items-baseline justify-between text-xs mb-1">
            <span className="text-slate-700">{f.label}</span>
            <span className="font-bold text-slate-900 tabular-nums">
              {f.count.toLocaleString()}
              {f.stepPct !== null && <span className="ml-2 font-semibold text-slate-500">{f.stepPct}% of previous</span>}
            </span>
          </div>
          <div className="h-5 rounded bg-slate-50 flex justify-center" aria-hidden="true">
            <div className="h-full rounded" style={{ width: `${Math.max(2, (f.count / max) * 100)}%`, background: STAGE_COLORS[Math.min(i, 5)] }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function FeedbackHistogram({ m }: { m: AnalyticsModel }) {
  const max = Math.max(...m.feedback.buckets.map(b => b.count));
  return (
    <div>
      <div className="flex items-end gap-3 h-36" role="img" aria-label="Distribution of hiring manager feedback turnaround">
        {m.feedback.buckets.map((b, i) => (
          <div key={b.label} className="flex-1 flex flex-col items-center justify-end h-full">
            <span className="text-xs font-bold text-slate-800 mb-1">{b.count}</span>
            <div className="w-full rounded-t" style={{ height: `${(b.count / max) * 100}%`, background: i < 2 ? GOOD : i === 2 ? '#f5a623' : BAD, minHeight: 4 }} />
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-1.5">
        {m.feedback.buckets.map(b => (
          <span key={b.label} className="flex-1 text-center text-[10px] text-slate-500">{b.label}</span>
        ))}
      </div>
      <p className="text-xs text-slate-600 mt-3">
        {m.feedback.within48Pct}% of {m.feedback.n} slates received feedback within 48 hours. {m.feedback.inBookPct}% of feedback is captured in the Digital Search Book today; the rest arrives by email and is not measured.
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
  const max = Math.ceil((vals[vals.length - 1] * 1.1) / 100) * 100;
  const px = (i: number) => padL + (i / (vals.length - 1)) * (W - padL - 12);
  const py = (v: number) => padT + (1 - v / max) * (H - padT - padB);
  const line = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
  const area = `${line} L ${px(vals.length - 1)} ${H - padB} L ${px(0)} ${H - padB} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round((max * t) / 10) * 10);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Cumulative research hours returned">
        {ticks.map(t => (
          <g key={t}>
            <line x1={padL} x2={W - 12} y1={py(t)} y2={py(t)} stroke="#e6e8f2" />
            <text x={padL - 6} y={py(t) + 3} fontSize="9" fill="#626780" textAnchor="end">{t.toLocaleString()}</text>
          </g>
        ))}
        <path d={area} fill="#4d3ee0" fillOpacity={0.12} />
        <path d={line} fill="none" stroke={INDIGO} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {vals.map((v, i) => (
          <circle key={i} cx={px(i)} cy={py(v)} r={3.5} fill="#fff" stroke={INDIGO} strokeWidth={2} />
        ))}
        {m.research.months.map((mo, i) => (
          <text key={mo} x={px(i)} y={H - 10} fontSize="9" fill="#626780" textAnchor={i === m.research.months.length - 1 ? 'end' : 'middle'}>{mo}</text>
        ))}
        <text x={px(vals.length - 1)} y={py(vals[vals.length - 1]) - 9} fontSize="10" fontWeight="700" fill="#1b1d2e" textAnchor="end">
          {vals[vals.length - 1].toLocaleString()} hours
        </text>
      </svg>
      <div className="mt-2 rounded-xl border border-(--color-secondary-50) bg-(--bg-brand-secondary-subtle) p-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-700">
        <span className="font-bold text-(--color-secondary-200)">Assumption</span>
        <label className="flex items-center gap-2">
          Minutes per profile
          <input
            type="number"
            min={1}
            max={120}
            value={inputs.minutesPerProfile}
            onChange={e => setInputs({ ...inputs, minutesPerProfile: Math.max(1, Number(e.target.value) || 1) })}
            className="w-16 px-2 py-1 rounded-lg border border-slate-300 bg-white text-sm"
          />
        </label>
        <label className="flex items-center gap-2">
          Minutes per org map
          <input
            type="number"
            min={1}
            max={240}
            value={inputs.minutesPerOrgMap}
            onChange={e => setInputs({ ...inputs, minutesPerOrgMap: Math.max(1, Number(e.target.value) || 1) })}
            className="w-16 px-2 py-1 rounded-lg border border-slate-300 bg-white text-sm"
          />
        </label>
        <span className="text-slate-500">{m.research.profiles.toLocaleString()} profiles and {m.research.orgMaps} org maps created or updated</span>
      </div>
    </div>
  );
}

function BenchHeatmap({ m }: { m: AnalyticsModel }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-2xl font-black text-slate-900 tabular-nums">{m.bench.coveredPct}%</div>
          <div className="text-[11px] text-slate-500">of {m.bench.roles} critical roles have 2 or more benchmarked successors</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-2xl font-black text-slate-900 tabular-nums">{m.bench.freshPct}%</div>
          <div className="text-[11px] text-slate-500">of target executives have a profile updated in the last 90 days</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-separate border-spacing-1" aria-label="Bench coverage by function and level">
          <thead>
            <tr>
              <th className="text-left font-semibold text-slate-500 w-40">Function</th>
              {LEVELS.map(l => (
                <th key={l} className="font-semibold text-slate-500 text-center">{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.bench.heat.map(row => (
              <tr key={row.dept}>
                <th scope="row" className="text-left font-semibold text-slate-700 pr-2">{row.dept}</th>
                {row.cells.map((c, i) => {
                  if (!c) return <td key={i} className="h-9 rounded-md bg-slate-50 text-center text-slate-300">·</td>;
                  const f = c.covered / c.total;
                  const bg = f >= 1 ? GOOD : f > 0 ? '#e09b1a' : BAD;
                  return (
                    <td key={i} className="h-9 rounded-md text-center font-bold text-white tabular-nums" style={{ background: bg }} title={`${c.covered} of ${c.total} roles covered`}>
                      {c.covered}/{c.total}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4 mt-2 text-[11px] text-slate-500">
        {[
          ['Fully covered', GOOD],
          ['Partly covered', '#e09b1a'],
          ['No bench', BAD],
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
      <div className="rounded-xl border border-slate-200 p-4 space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Searches filled in-house</span>
          <b className="tabular-nums">{m.agency.inHouse}</b>
        </div>
        <label className="flex items-center justify-between gap-3">
          <span className="text-slate-600">x Average agency fee</span>
          <span className="flex items-center gap-1.5">
            <input
              type="number"
              min={5}
              max={40}
              aria-label="Average agency fee percent"
              value={inputs.feePct}
              onChange={e => setInputs({ ...inputs, feePct: Math.min(40, Math.max(1, Number(e.target.value) || 1)) })}
              className="w-16 px-2 py-1 rounded-lg border border-slate-300 bg-white text-sm text-right"
            />
            %
          </span>
        </label>
        <label className="flex items-center justify-between gap-3">
          <span className="text-slate-600">x Average compensation</span>
          <span className="flex items-center gap-1.5">
            $
            <input
              type="number"
              min={50000}
              step={10000}
              aria-label="Average executive compensation"
              value={inputs.avgComp}
              onChange={e => setInputs({ ...inputs, avgComp: Math.max(0, Number(e.target.value) || 0) })}
              className="w-28 px-2 py-1 rounded-lg border border-slate-300 bg-white text-sm text-right"
            />
          </span>
        </label>
        <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between">
          <span className="font-bold text-(--color-secondary-200)">= Agency spend avoided</span>
          <b className="text-lg tabular-nums text-(--color-secondary-200)">{formatMoney(m.agency.avoided)}</b>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-3">
        About {formatMoney(m.agency.perSearch)} per search. Inputs are customer assumptions; confirm the fee and average compensation with Finance before sharing externally.
      </p>
    </div>
  );
}

function OfferGoal({ m }: { m: AnalyticsModel }) {
  const max = 150;
  const o = m.offers;
  return (
    <div>
      <div className="relative mt-6 mb-9">
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${(o.medianDaysToOffer / max) * 100}%`, background: GOOD }} />
        </div>
        <div className="absolute -top-5 -translate-x-1/2 text-[11px] font-bold text-slate-800 whitespace-nowrap" style={{ left: `${(o.goal / max) * 100}%` }}>
          Goal {OFFER_GOAL_DAYS} days
        </div>
        <span className="absolute -top-1 bottom-[-4px] w-0.5 bg-(--color-secondary-400)" style={{ left: `${(o.goal / max) * 100}%` }} aria-hidden="true" />
        <div className="absolute top-5 -translate-x-1/2 text-[11px] font-bold whitespace-nowrap" style={{ left: `${(o.medianDaysToOffer / max) * 100}%`, color: GOOD }}>
          Median {o.medianDaysToOffer} days
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xl font-black tabular-nums">{o.accepted} of {o.decided}</div>
          <div className="text-[11px] text-slate-500">offers accepted</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xl font-black tabular-nums">{o.withinGoal} of {o.decided}</div>
          <div className="text-[11px] text-slate-500">signed inside {OFFER_GOAL_DAYS} days</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xl font-black tabular-nums">{o.pending}</div>
          <div className="text-[11px] text-slate-500">offers pending</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* View                                                                 */
/* ------------------------------------------------------------------ */

export function AnalyticsView() {
  const [inputs, setInputs] = useState<AnalyticsInputs>(DEFAULT_INPUTS);
  const m = useMemo(() => buildAnalytics(initialRolesSuccessionData, inputs), [inputs]);
  const [downloaded, setDownloaded] = useState(false);
  const [clientLogo, setClientLogo] = useState<{ preview: string; logo: ClientLogo } | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const logoInput = useRef<HTMLInputElement>(null);

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
    downloadBlob(buildAnalyticsReportPdf(m, clientLogo?.logo ?? null), 'Executive-Search-Analytics-Report.pdf');
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-(--text-strong)">Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">Proof of ROI for executive search: speed, pipeline quality, productivity and cost avoided</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input ref={logoInput} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="sr-only" aria-label="Upload client logo" onChange={onLogo} />
          {clientLogo ? (
            <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white pl-3 pr-1.5 py-1">
              <img src={clientLogo.preview} alt="Client logo for the report" className="h-6 max-w-24 object-contain" />
              <button type="button" onClick={() => setClientLogo(null)} aria-label="Remove client logo" className="p-1 rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => logoInput.current?.click()}
              className="px-4 py-2 rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
            >
              <ImagePlus className="w-4 h-4" /> Add client logo
            </button>
          )}
          <button
            type="button"
            onClick={download}
            className="px-4 py-2 rounded-full bg-(--color-secondary-200) hover:bg-(--color-secondary-300) text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            Download Analytics Report (PDF)
          </button>
        </div>
      </div>
      {logoError && <p role="alert" className="text-xs text-red-700 mb-3">{logoError}</p>}

      <div className="rounded-2xl border border-(--color-secondary-50) bg-(--bg-brand-secondary-subtle) p-5 flex items-start gap-3 mb-6">
        <Sparkles className="w-5 h-5 text-(--color-secondary-200) shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-(--color-secondary-200)">Key takeaways · last 6 months</div>
          <p className="text-sm text-slate-800 mt-1 leading-relaxed" aria-live="polite">{m.takeaways}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="xl:col-span-2"><SectionTitle>Speed</SectionTitle></div>
        <KpiCard id="time-to-slate" headline={`${m.slate.median} days`} unit={`${m.slate.improvementPct}% faster than the ${m.slate.baseline}-day baseline · ${m.slate.withinTarget} of ${m.slate.slated} slates inside the target`}>
          <SlateBars m={m} />
        </KpiCard>
        <KpiCard
          id="time-in-stage"
          headline={m.stages.names[m.stages.slowestIndex]}
          unit={`Slowest stage, median ${m.stages.medians[m.stages.slowestIndex]} days · ${m.stages.stalledCount} searches stalled`}
          tone={WARN}
        >
          <StageTimeline m={m} />
        </KpiCard>

        <div className="xl:col-span-2"><SectionTitle>Pipeline quality</SectionTitle></div>
        <KpiCard id="conversion" headline={`${m.funnel[m.funnel.length - 1].overallPct}%`} unit={`Identified to hired · ${m.funnel[m.funnel.length - 1].count} hires from ${m.funnel[0].count.toLocaleString()} identified`} tone={INDIGO}>
          <Funnel m={m} />
        </KpiCard>
        <KpiCard id="feedback" headline={`${m.feedback.medianHours} hours`} unit={`Median feedback turnaround · ${m.feedback.within48Pct}% within 48 hours`} tone={WARN}>
          <FeedbackHistogram m={m} />
        </KpiCard>

        <div className="xl:col-span-2"><SectionTitle>Productivity and coverage</SectionTitle></div>
        <KpiCard id="research-hours" headline={m.research.totalHours.toLocaleString()} unit={`Research hours returned · about ${m.research.fteWeeks} full-time weeks`}>
          <ResearchChart m={m} inputs={inputs} setInputs={setInputs} />
        </KpiCard>
        <KpiCard id="bench" headline={`${m.bench.coveredPct}%`} unit="Critical roles with 2 or more benchmarked successors" tone={m.bench.coveredPct >= 80 ? GOOD : WARN}>
          <BenchHeatmap m={m} />
        </KpiCard>

        <div className="xl:col-span-2"><SectionTitle>Financial and outcomes</SectionTitle></div>
        <KpiCard id="agency" headline={formatMoney(m.agency.avoided)} unit={`Agency spend avoided on ${m.agency.inHouse} in-house fills`}>
          <AgencyTile m={m} inputs={inputs} setInputs={setInputs} />
        </KpiCard>
        <KpiCard id="offers" headline={`${m.offers.acceptancePct}% accepted`} unit={`Median ${m.offers.medianDaysToOffer} days to offer · goal is ${OFFER_GOAL_DAYS} days`}>
          <OfferGoal m={m} />
        </KpiCard>
      </div>
    </div>
  );
}
