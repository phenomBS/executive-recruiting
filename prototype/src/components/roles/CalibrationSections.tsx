import React, { useMemo, useState } from 'react';
import {
  Gauge,
  Calculator,
  Scale,
  Map as MapIcon,
  RotateCcw,
  Wand2,
  Sparkles,
  Check,
  Users,
  Swords,
  TrendingUp,
  Building2,
  ChevronDown,
} from 'lucide-react';
import type { SearchIntelligenceData } from '../../data/projectSearchIntelligenceData';
import {
  CalibrationScenario,
  CompetitionSnapshot,
  DifficultyResult,
  DifficultyTone,
  INDUSTRY_SCOPE_OPTIONS,
  SECONDARY_MARKET,
  SECONDARY_MARKET_DENSITY,
  TITLE_SCOPE_OPTIONS,
  computeDifficulty,
  getSensitivities,
  recommendedPath,
  type Sensitivity,
} from '../../lib/hireDifficulty';
import {
  EQUITY_MULTIPLES,
  buildEquityModel,
  fmtK,
  type BriefModel,
  type KpiTone,
} from '../../lib/calibrationBrief';
import { cn } from '../../lib/utils';

/* ------------------------------------------------------------------ */
/* Tokens                                                               */
/* ------------------------------------------------------------------ */

const TONE: Record<DifficultyTone, { color: string; soft: string; border: string }> = {
  green: { color: '#00875a', soft: '#e6f6ef', border: '#9fd8c0' },
  lime: { color: '#5f8a00', soft: '#f1f8dc', border: '#c9de8a' },
  amber: { color: '#b07400', soft: '#fff6dc', border: '#efd48b' },
  orange: { color: '#ba4800', soft: '#fdeee3', border: '#f0bb96' },
  red: { color: '#c0262d', soft: '#fdecec', border: '#f2b3b6' },
};

const KPI_TONE: Record<KpiTone, { color: string; soft: string; border: string }> = {
  good: { color: '#00875a', soft: '#e6f6ef', border: '#9fd8c0' },
  warn: { color: '#b07400', soft: '#fff6dc', border: '#efd48b' },
  bad: { color: '#c0262d', soft: '#fdecec', border: '#f2b3b6' },
  neutral: { color: '#1c1876', soft: '#eae8fb', border: '#cac1f2' },
};

const DIAL_STOPS: { at: number; c: [number, number, number] }[] = [
  { at: 0, c: [34, 197, 94] },
  { at: 0.25, c: [132, 204, 22] },
  { at: 0.5, c: [245, 179, 1] },
  { at: 0.75, c: [249, 115, 22] },
  { at: 1, c: [239, 68, 68] },
];

/** Green (easy) to red (very difficult) gradient lookup, f in 0..1 */
function dialColor(f: number): string {
  const x = Math.min(1, Math.max(0, f));
  for (let i = 0; i < DIAL_STOPS.length - 1; i++) {
    const a = DIAL_STOPS[i];
    const b = DIAL_STOPS[i + 1];
    if (x <= b.at) {
      const t = (x - a.at) / (b.at - a.at);
      const c = a.c.map((v, k) => Math.round(v + (b.c[k] - v) * t));
      return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    }
  }
  return 'rgb(239, 68, 68)';
}

const cardClass = 'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden';

export interface SectionProps {
  data: SearchIntelligenceData;
  scenario: CalibrationScenario;
  baseline: CalibrationScenario;
  competition: CompetitionSnapshot;
  result: DifficultyResult;
  baselineResult: DifficultyResult;
  setScenario: React.Dispatch<React.SetStateAction<CalibrationScenario>>;
  model: BriefModel;
  equityMultiple: number;
  setEquityMultiple: (n: number) => void;
}

function SectionShell({
  step,
  icon: Icon,
  kicker,
  title,
  subtitle,
  right,
  children,
}: {
  step: number;
  icon: React.ElementType;
  kicker: string;
  title: string;
  subtitle: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`cal-section-${step}`} className={cardClass}>
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--bg-brand-secondary-subtle) text-(--color-secondary-200) flex items-center justify-center shrink-0 border border-(--color-secondary-50)">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-(--color-secondary-200)">
              Section {step} · {kicker}
            </div>
            <h3 id={`cal-section-${step}`} className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">{subtitle}</p>
          </div>
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

const eyebrow = 'text-xs font-bold uppercase tracking-wider text-slate-500';

/* ------------------------------------------------------------------ */
/* Section 1: Executive Scorecard                                       */
/* ------------------------------------------------------------------ */

const CX = 130;
const CY = 124;
const R = 100;

const polar = (value: number, radius = R) => {
  const angle = Math.PI * (1 - (value - 1) / 9);
  return { x: CX + radius * Math.cos(angle), y: CY - radius * Math.sin(angle) };
};

export function DifficultyDial({ score, label, tone }: { score: number; label: string; tone: DifficultyTone }) {
  const SEG = 90;
  const needle = polar(score, R - 22);
  return (
    <svg viewBox="0 0 260 176" className="w-full max-w-[340px]" role="img" aria-label={`Hiring difficulty ${score} out of 10, ${label}`}>
      {Array.from({ length: SEG }).map((_, i) => {
        const v0 = 1 + (9 * i) / SEG;
        const v1 = 1 + (9 * (i + 1)) / SEG;
        const a = polar(v0);
        const b = polar(v1);
        return (
          <path
            key={i}
            d={`M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${R} ${R} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`}
            fill="none"
            stroke={dialColor((i + 0.5) / SEG)}
            strokeWidth={20}
          />
        );
      })}
      {Array.from({ length: 10 }).map((_, i) => {
        const o = polar(i + 1, R - 14);
        const inn = polar(i + 1, R - 19);
        return <line key={i} x1={o.x} y1={o.y} x2={inn.x} y2={inn.y} stroke="#ffffff" strokeOpacity={0.7} strokeWidth={1} />;
      })}
      <line x1={CX} y1={CY} x2={needle.x} y2={needle.y} stroke="#0c0b3b" strokeWidth={3.5} strokeLinecap="round" style={{ transition: 'all 300ms ease' }} />
      <circle cx={CX} cy={CY} r={8} fill="#0c0b3b" />
      <circle cx={CX} cy={CY} r={3} fill="#ffffff" />
      <text x={CX - R - 10} y={CY + 18} fontSize="9" fontWeight="600" fill="#626780" textAnchor="start">1 · Easy</text>
      <text x={CX + R + 10} y={CY + 18} fontSize="9" fontWeight="600" fill="#626780" textAnchor="end">10 · Very Difficult</text>
      <text x={CX} y={CY + 40} fontSize="30" fontWeight="800" fill={TONE[tone].color} textAnchor="middle" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {score.toFixed(1)}
      </text>
      <text x={CX + 40} y={CY + 40} fontSize="10" fill="#626780">/ 10</text>
    </svg>
  );
}

export function ExecutiveScorecard({ data, scenario, baseline, competition, result, baselineResult, setScenario, model }: SectionProps) {
  const t = TONE[result.tone];
  const delta = Math.round((baselineResult.score - result.score) * 10) / 10;
  const [appliedPath, setAppliedPath] = useState<Sensitivity[] | null>(null);
  const changed = JSON.stringify(scenario) !== JSON.stringify(baseline);

  const showPath = () => {
    const rec = recommendedPath(data, scenario);
    setScenario(rec.scenario);
    setAppliedPath(rec.steps);
  };
  const reset = () => {
    setScenario(baseline);
    setAppliedPath(null);
  };

  return (
    <SectionShell
      step={1}
      icon={Gauge}
      kicker="The Reality Check"
      title="Executive Scorecard"
      subtitle="How hard this search really is, before the intake meeting. The score combines regional supply density, competitor posting intensity and wage pressure."
    >
      <div className="p-6 grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6">
        {/* Dial */}
        <div className="rounded-2xl border p-5 flex flex-col items-center text-center" style={{ background: t.soft, borderColor: t.border }}>
          <div className={eyebrow}>Hiring Difficulty Dial</div>
          <DifficultyDial score={result.score} label={result.label} tone={result.tone} />
          <div className="mt-1 px-3 py-1 rounded-full text-xs font-bold border bg-white" style={{ color: t.color, borderColor: t.border }} aria-live="polite">
            {result.label}
          </div>
          {Math.abs(delta) >= 0.1 && (
            <p className="text-[11px] text-slate-600 mt-2">
              {delta > 0 ? `${delta.toFixed(1)} easier` : `${Math.abs(delta).toFixed(1)} harder`} than the intake baseline of {baselineResult.score.toFixed(1)}
            </p>
          )}
          {result.surcharge && (
            <p className="text-[11px] mt-2 rounded-lg bg-white/70 border px-2 py-1.5 text-left" style={{ borderColor: t.border, color: t.color }}>
              +{result.surcharge.points} pts: {result.surcharge.reason}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={showPath}
              className="px-3.5 py-2 rounded-full bg-(--color-secondary-200) hover:bg-(--color-secondary-300) text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" /> Show path to a realistic search
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={!changed}
              className="px-3.5 py-2 rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to intake baseline
            </button>
          </div>
          {appliedPath && (
            <div className="mt-3 w-full text-left rounded-xl bg-white border border-slate-200 p-3" aria-live="polite">
              {appliedPath.length === 0 ? (
                <p className="text-[11px] text-slate-600">Requirements are already as open as they reasonably get.</p>
              ) : (
                <>
                  <div className="text-[11px] font-bold text-slate-800 mb-1.5">Recommended changes applied</div>
                  <ol className="list-decimal ml-4 space-y-1 text-[11px] text-slate-600">
                    {appliedPath.map(s => (
                      <li key={s.id}>{s.label}</li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          )}
        </div>

        {/* KPI banner + drivers */}
        <div className="space-y-5 min-w-0">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {model.kpis.map(k => {
              const c = KPI_TONE[k.tone];
              return (
                <div key={k.id} className="rounded-xl border border-slate-200 p-4 flex flex-col relative overflow-hidden" data-kpi={k.id}>
                  <span className="absolute inset-x-0 top-0 h-1" style={{ background: c.color }} aria-hidden="true" />
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{k.label}</div>
                  <div className="text-3xl font-black text-slate-900 mt-2 tabular-nums leading-none">{k.value}</div>
                  {k.unit && <div className="text-xs font-bold mt-1.5" style={{ color: c.color }}>{k.unit}</div>}
                  <div className="text-[11px] text-slate-500 mt-2 leading-snug">{k.sub}</div>
                </div>
              );
            })}
          </div>

          <div>
            <div className={cn(eyebrow, 'mb-2')}>What is driving the score</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.pillars.map(p => (
                <div key={p.id} className="rounded-xl border border-slate-200 p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-900">{p.label}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: dialColor((p.sub - 1) / 9) }}>{p.sub.toFixed(1)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden" aria-hidden="true">
                    <div className="h-full rounded-full transition-all" style={{ width: `${p.sub * 10}%`, background: dialColor((p.sub - 1) / 9) }} />
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 leading-snug">{p.detail}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Weight {p.weight}% · {p.sources}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Competitor demand compares {competition.activePostings} open searches to a market average of 10. Search duration scales peer posting time ({competition.avgDaysOpen} days) by difficulty.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2: Scarcity Calculator                                       */
/* ------------------------------------------------------------------ */

const shortMetro = (m: string) => m.replace(/\s+(Metro Area|Metro|Bay Area)\b.*$/, '');

function outlookFor(result: DifficultyResult): { label: string; tone: DifficultyTone; text: string } {
  if (result.pool < 50) {
    return { label: 'At risk: severe scarcity', tone: 'red', text: 'Expect a stalled search unless at least one requirement moves from mandatory to preferred.' };
  }
  if (result.pool <= 150) {
    return { label: 'Constrained market', tone: 'orange', text: 'Workable but thin: plan for a long, high-touch search and strong compensation positioning.' };
  }
  if (result.pool <= 500) {
    return { label: 'Competitive market', tone: 'amber', text: 'Achievable, but competing searches will contest the best candidates.' };
  }
  return { label: 'Healthy market', tone: 'green', text: 'The search has room to be selective.' };
}

export function ScarcityCalculator({ data, scenario, baseline, competition, result, baselineResult, setScenario }: SectionProps) {
  const outlook = outlookFor(result);
  const o = TONE[outlook.tone];
  const total = result.poolSteps[0].pool;
  const sensitivities = useMemo(() => getSensitivities(data, scenario, competition).slice(0, 3), [data, scenario, competition]);
  const [advanced, setAdvanced] = useState(false);

  const dropOf = (withS: CalibrationScenario, withoutS: CalibrationScenario) => {
    const a = computeDifficulty(data, withS, competition).pool;
    const b = computeDifficulty(data, withoutS, competition).pool;
    return b > 0 ? Math.round((1 - a / b) * 100) : 0;
  };

  const toggleFilter = (id: string) =>
    setScenario(s => ({ ...s, filterIds: s.filterIds.includes(id) ? s.filterIds.filter(x => x !== id) : [...s.filterIds, id] }));

  const onSiteOn = scenario.onsiteDays > 0;
  const radiusDays = onSiteOn ? scenario.onsiteDays : baseline.onsiteDays || 3;
  const radiusDrop = dropOf({ ...scenario, onsiteDays: radiusDays }, { ...scenario, onsiteDays: 0 });
  const toggleOnSite = () => setScenario(s => ({ ...s, onsiteDays: s.onsiteDays > 0 ? 0 : radiusDays }));

  const locations = [
    ...data.geography.topHubs.map(h => ({ id: h.metro, label: `${h.metro} (${h.percentage}% of talent)` })),
    { id: SECONDARY_MARKET, label: `${SECONDARY_MARKET} (${SECONDARY_MARKET_DENSITY}% of talent)` },
  ];

  const requirementsChanged =
    scenario.filterIds.join() !== baseline.filterIds.join() ||
    scenario.titleScope !== baseline.titleScope ||
    scenario.industryScope !== baseline.industryScope ||
    scenario.minYears !== baseline.minYears ||
    scenario.locationMetro !== baseline.locationMetro ||
    scenario.onsiteDays !== baseline.onsiteDays ||
    scenario.relocationOpen !== baseline.relocationOpen;

  const nationalShare = Math.round((result.pool / total) * 1000) / 10;
  const poolChange = result.pool - baselineResult.pool;

  return (
    <SectionShell
      step={2}
      icon={Calculator}
      kicker={'The "Purple Squirrel" Simulator'}
      title="Scarcity Calculator"
      subtitle="Toggle each hiring manager requirement and watch the national supply of executives shrink. Every checkbox shows what that single requirement costs the search."
      right={
        <button
          type="button"
          onClick={() =>
            setScenario(s => ({
              ...s,
              filterIds: baseline.filterIds,
              titleScope: baseline.titleScope,
              industryScope: baseline.industryScope,
              minYears: baseline.minYears,
              locationMetro: baseline.locationMetro,
              onsiteDays: baseline.onsiteDays,
              relocationOpen: baseline.relocationOpen,
            }))
          }
          disabled={!requirementsChanged}
          className="px-4 py-2 rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset requirements
        </button>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-[420px_minmax(0,1fr)]">
        {/* Requirements */}
        <div className="p-6 space-y-3 border-b xl:border-b-0 xl:border-r border-slate-100">
          <div className={eyebrow}>Hiring manager requirements</div>

          {data.talentPool.interactiveFilters.map(f => {
            const checked = scenario.filterIds.includes(f.id);
            return (
              <label
                key={f.id}
                className={cn(
                  'flex items-start gap-2.5 rounded-xl border p-3 cursor-pointer transition-colors',
                  checked ? 'border-(--color-secondary-200) bg-(--bg-brand-secondary-subtle)' : 'border-slate-200 hover:border-slate-300 bg-white'
                )}
              >
                <input type="checkbox" checked={checked} onChange={() => toggleFilter(f.id)} className="mt-0.5 w-4 h-4 accent-(--color-secondary-200)" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{f.label}</span>
                    <DropChip pct={Math.abs(f.impactPercent)} active={checked} />
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">{f.description}</span>
                </span>
              </label>
            );
          })}

          {/* On-site radius */}
          <div
            className={cn(
              'rounded-xl border p-3 transition-colors',
              onSiteOn ? 'border-(--color-secondary-200) bg-(--bg-brand-secondary-subtle)' : 'border-slate-200 bg-white'
            )}
          >
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={onSiteOn} onChange={toggleOnSite} className="mt-0.5 w-4 h-4 accent-(--color-secondary-200)" />
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900">On-Site Radius: {shortMetro(scenario.locationMetro)}</span>
                  <DropChip pct={radiusDrop} active={onSiteOn} />
                </span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  Requires candidates to work from the {shortMetro(scenario.locationMetro)} office, which only {data.geography.topHubs.find(h => h.metro === scenario.locationMetro)?.percentage ?? SECONDARY_MARKET_DENSITY}% of the talent calls home.
                </span>
              </span>
            </label>
            {onSiteOn && (
              <div className="mt-3 pl-6 space-y-2.5">
                <div role="radiogroup" aria-label="On-site days per week" className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500 mr-1">Days on-site</span>
                  {[1, 2, 3, 4, 5].map(d => (
                    <button
                      key={d}
                      type="button"
                      role="radio"
                      aria-checked={scenario.onsiteDays === d}
                      onClick={() => setScenario(s => ({ ...s, onsiteDays: d }))}
                      className={cn(
                        'w-8 h-8 rounded-lg border text-xs font-bold cursor-pointer',
                        scenario.onsiteDays === d ? 'bg-(--color-secondary-200) text-white border-(--color-secondary-200)' : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    role="switch"
                    checked={scenario.relocationOpen}
                    onChange={e => setScenario(s => ({ ...s, relocationOpen: e.target.checked }))}
                    className="w-4 h-4 accent-(--color-secondary-200)"
                  />
                  Open to relocation (reaches about half of the talent outside the metro)
                </label>
              </div>
            )}
          </div>

          {/* Advanced */}
          <button
            type="button"
            onClick={() => setAdvanced(a => !a)}
            aria-expanded={advanced}
            className="w-full flex items-center justify-between text-xs font-semibold text-(--color-secondary-200) px-1 py-1.5 cursor-pointer"
          >
            Advanced requirements
            <ChevronDown className={cn('w-4 h-4 transition-transform', advanced && 'rotate-180')} />
          </button>
          {advanced && (
            <div className="space-y-5 pt-1">
              <fieldset className="space-y-2">
                <legend className={cn(eyebrow, 'mb-2')}>Title scope</legend>
                <div role="radiogroup" aria-label="Title scope" className="space-y-2">
                  {TITLE_SCOPE_OPTIONS.map(opt => (
                    <OptionCard key={opt.id} checked={scenario.titleScope === opt.id} label={opt.label} description={opt.description} onSelect={() => setScenario(s => ({ ...s, titleScope: opt.id }))} />
                  ))}
                </div>
              </fieldset>
              <fieldset className="space-y-2">
                <legend className={cn(eyebrow, 'mb-2')}>Industry experience</legend>
                <div role="radiogroup" aria-label="Industry experience" className="space-y-2">
                  {INDUSTRY_SCOPE_OPTIONS.map(opt => (
                    <OptionCard key={opt.id} checked={scenario.industryScope === opt.id} label={opt.label} description={opt.description} onSelect={() => setScenario(s => ({ ...s, industryScope: opt.id }))} />
                  ))}
                </div>
              </fieldset>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="sc-years" className={eyebrow}>Minimum years in a comparable seat</label>
                  <span className="text-sm font-bold text-slate-900">{scenario.minYears} yrs</span>
                </div>
                <input
                  id="sc-years"
                  type="range"
                  min={0}
                  max={12}
                  step={1}
                  value={scenario.minYears}
                  onChange={e => setScenario(s => ({ ...s, minYears: Number(e.target.value) }))}
                  className="w-full accent-(--color-secondary-200) cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="sc-location" className={eyebrow}>Primary office location</label>
                <select
                  id="sc-location"
                  value={scenario.locationMetro}
                  onChange={e => setScenario(s => ({ ...s, locationMetro: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-800"
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Funnel + bottom line */}
        <div className="p-6 space-y-6 min-w-0">
          <div>
            <div className={cn(eyebrow, 'mb-3')}>Attrition funnel: national supply to viable pool</div>
            <ul className="space-y-2.5" aria-label="Talent pool attrition funnel">
              {result.poolSteps.map((step, i) => {
                const pct = (step.pool / total) * 100;
                const prev = i === 0 ? null : result.poolSteps[i - 1].pool;
                const drop = prev ? Math.round((1 - step.pool / prev) * 100) : null;
                return (
                  <li key={`${step.label}-${i}`}>
                    <div className="flex items-baseline justify-between gap-3 mb-1">
                      <span className="text-xs text-slate-700 truncate" title={step.label}>
                        {i === 0 ? 'National supply' : step.label}
                      </span>
                      <span className="text-xs font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        {step.pool.toLocaleString()} · {pct >= 10 ? Math.round(pct) : pct.toFixed(1)}%
                        {drop !== null && <span className="ml-2" style={{ color: TONE.red.color }}>−{drop}%</span>}
                      </span>
                    </div>
                    <div className="h-7 rounded-md bg-slate-50 flex justify-center" aria-hidden="true">
                      <div
                        className="h-full rounded-md transition-all duration-300"
                        style={{
                          width: `${Math.max(pct, 2)}%`,
                          background: i === 0 ? '#2927b2' : dialColor(0.35 + 0.65 * (1 - Math.max(pct, 0) / 100)),
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className="rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4"
            style={{ background: 'linear-gradient(135deg, var(--color-secondary-400), var(--color-secondary-200))' }}
            aria-live="polite"
          >
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/70">Bottom line</div>
              <div className="text-2xl font-black mt-1">
                Viable Pool Remaining: <span data-testid="viable-pool">{result.pool.toLocaleString()}</span> Executives
              </div>
              <div className="text-xs text-white/80 mt-1">
                {nationalShare}% of the national pool
                {poolChange !== 0 && ` · ${poolChange > 0 ? '+' : ''}${poolChange.toLocaleString()} vs intake`}
                {` · ${result.supplyPerPosting} executives per competing search`}
              </div>
            </div>
            <div className="rounded-xl bg-white p-3 md:max-w-xs" style={{ color: o.color }}>
              <div className="text-xs font-bold">{outlook.label}</div>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{outlook.text}</p>
            </div>
          </div>

          <div>
            <div className={cn(eyebrow, 'mb-3')}>What would move the needle</div>
            {sensitivities.length === 0 ? (
              <p className="text-xs text-slate-600 rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-2">
                <Check className="w-4 h-4" style={{ color: TONE.green.color }} /> No further single change meaningfully lowers the difficulty.
              </p>
            ) : (
              <ul className="space-y-2">
                {sensitivities.map(s => (
                  <li key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900">{s.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Pool {s.deltaPool >= 0 ? '+' : ''}{s.deltaPool.toLocaleString()} executives · difficulty −{s.deltaScore.toFixed(1)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScenario(s.next)}
                      className="shrink-0 px-3 py-1.5 rounded-full border border-slate-300 bg-white text-xs font-semibold text-(--color-secondary-200) hover:bg-slate-50 cursor-pointer"
                    >
                      Apply
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function DropChip({ pct, active }: { pct: number; active: boolean }) {
  return (
    <span
      className="px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shrink-0"
      style={{ background: active ? TONE.red.soft : '#f1f2f7', color: active ? TONE.red.color : '#626780' }}
    >
      {active ? 'Drops' : 'Would drop'} {pct}%
    </span>
  );
}

function OptionCard({ checked, label, description, onSelect }: { checked: boolean; label: string; description: string; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cn(
        'w-full text-left rounded-xl border p-3 flex items-start gap-2.5 transition-colors cursor-pointer',
        checked ? 'border-(--color-secondary-200) bg-(--bg-brand-secondary-subtle)' : 'border-slate-200 hover:border-slate-300 bg-white'
      )}
    >
      <span className={cn('mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0', checked ? 'border-(--color-secondary-200)' : 'border-slate-300')} aria-hidden="true">
        {checked && <span className="w-2 h-2 rounded-full bg-(--color-secondary-200)" />}
      </span>
      <span>
        <span className="block text-xs font-bold text-slate-900">{label}</span>
        <span className="block text-[11px] text-slate-500 mt-0.5">{description}</span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3: Compensation & Equity Reality Check                       */
/* ------------------------------------------------------------------ */

const EQ_COLORS = { base: '#1c1876', bonus: '#7571e0', equity: '#f5a623' };

export function CompensationEquity({ data, scenario, setScenario, model, equityMultiple, setEquityMultiple }: SectionProps) {
  const { p25, median, p75 } = data.compensation.baseSalary;
  const lo = Math.round((p25 * 0.8) / 5000) * 5000;
  const hi = Math.round((p75 * 1.2) / 5000) * 5000;
  const pct = (v: number) => Math.min(100, Math.max(0, ((v - lo) / (hi - lo)) * 100));
  const budget = scenario.baseBudget;
  const pos = model.position;
  const posColor = KPI_TONE[pos.tone];
  const sign = pos.delta >= 0 ? '+' : '−';
  const oteMedian = data.compensation.totalCashOTE.median;
  const oteBudget = model.equity.years[0].base + model.equity.bonusTarget;

  const maxTotal = useMemo(
    () => Math.max(...buildEquityModel(data, budget, Math.max(...EQUITY_MULTIPLES)).years.map(y => y.total)),
    [data, budget]
  );
  const chartH = 168;

  const flagLeft = Math.min(86, Math.max(14, pct(budget)));

  return (
    <SectionShell
      step={3}
      icon={Scale}
      kicker="Pay Reality"
      title="Compensation & Equity Reality Check"
      subtitle="Test the hiring manager's budget against live market percentiles, then see what the offer costs over four years and what it takes to buy out a candidate's unvested stock."
    >
      <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Percentile slider */}
        <div className="rounded-2xl border border-slate-200 p-5 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className={eyebrow}>Percentile slider · base salary</div>
              <p className="text-[11px] text-slate-500 mt-1">Drag to model a different target base budget.</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold tabular-nums" style={{ color: posColor.color }}>
                {sign}{fmtK(Math.abs(pos.delta))} ({sign}{Math.abs(pos.deltaPct)}%)
              </div>
              <div className="text-[10px] text-slate-500">vs {fmtK(median)} median</div>
            </div>
          </div>

          <div className="relative mt-12 mb-14 focus-within:ring-2 focus-within:ring-(--color-secondary-200)/40 rounded-full">
            {/* target flag */}
            <div className="absolute -top-11 z-10 -translate-x-1/2 transition-all duration-150" style={{ left: `${flagLeft}%` }}>
              <div className="px-2.5 py-1 rounded-md text-[11px] font-bold text-white whitespace-nowrap shadow-sm" style={{ background: posColor.color }}>
                Target: {fmtK(budget)} ({pos.label})
              </div>
            </div>
            {/* bands */}
            <div className="relative h-4 rounded-full overflow-hidden flex" aria-hidden="true">
              <div style={{ width: `${pct(p25)}%`, background: '#f6c4c4' }} />
              <div style={{ width: `${pct(median) - pct(p25)}%`, background: '#fbe3a6' }} />
              <div style={{ width: `${pct(p75) - pct(median)}%`, background: '#bfe8cb' }} />
              <div className="flex-1" style={{ background: '#cfd2f5' }} />
            </div>
            {/* markers */}
            {[
              { v: p25, name: 'P25' },
              { v: median, name: 'Median' },
              { v: p75, name: 'P75' },
            ].map(m => (
              <div key={m.name} className="absolute top-0 -translate-x-1/2 flex flex-col items-center" style={{ left: `${pct(m.v)}%` }} aria-hidden="true">
                <span className="w-px h-5 bg-(--color-secondary-400)" />
                <span className="text-[10px] font-bold text-slate-500 mt-1">{m.name}</span>
                <span className="text-[11px] font-semibold text-slate-800 tabular-nums">{fmtK(m.v)}</span>
              </div>
            ))}
            {/* pin */}
            <div
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-[3px] border-white shadow-md transition-all duration-150 pointer-events-none"
              style={{ left: `${pct(budget)}%`, background: posColor.color }}
              aria-hidden="true"
            />
            <input
              id="comp-budget"
              type="range"
              aria-label="Hiring manager target base budget"
              aria-valuetext={`${fmtK(budget)}, ${pos.label}`}
              min={lo}
              max={hi}
              step={5000}
              value={Math.min(hi, Math.max(lo, budget))}
              onChange={e => setScenario(s => ({ ...s, baseBudget: Number(e.target.value) }))}
              className="absolute inset-x-0 -top-2 h-8 w-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4" aria-label="Gap between target budget and market percentiles">
            {[
              { name: 'P25', v: p25 },
              { name: 'Median', v: median },
              { name: 'P75', v: p75 },
            ].map(g => {
              const gap = g.v - budget;
              return (
                <div key={g.name} className="rounded-xl bg-slate-50 p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">To reach {g.name}</div>
                  <div className="text-base font-black tabular-nums" style={{ color: gap > 0 ? KPI_TONE.bad.color : KPI_TONE.good.color }}>
                    {gap > 0 ? `+${fmtK(gap)}` : 'Above'}
                  </div>
                  <div className="text-[10px] text-slate-500">{g.name} is {fmtK(g.v)}</div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-slate-200 p-3 mb-4 flex items-center justify-between gap-3 text-xs">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total target cash (base plus bonus)</div>
              <div className="font-black text-slate-900 text-base tabular-nums">{fmtK(oteBudget)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500">Market median total cash</div>
              <div className="font-bold tabular-nums" style={{ color: oteBudget >= oteMedian ? KPI_TONE.good.color : KPI_TONE.bad.color }}>
                {fmtK(oteMedian)} ({oteBudget >= oteMedian ? '+' : '−'}{Math.abs(Math.round(((oteBudget - oteMedian) / oteMedian) * 100))}%)
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-auto">
            {[
              { label: 'Set to P25', v: p25 },
              { label: 'Set to Median', v: median },
              { label: 'Set to P75', v: p75 },
              { label: 'Intake budget', v: data.compensation.clientBudgetBase },
            ].map(c => (
              <button
                key={c.label}
                type="button"
                onClick={() => setScenario(s => ({ ...s, baseBudget: c.v }))}
                className={cn(
                  'px-3 py-1.5 rounded-full border text-[11px] font-semibold cursor-pointer',
                  budget === c.v ? 'border-(--color-secondary-200) bg-(--bg-brand-secondary-subtle) text-(--color-secondary-200)' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                )}
              >
                {c.label} · {fmtK(c.v)}
              </button>
            ))}
          </div>
        </div>

        {/* Equity model */}
        <div className="rounded-2xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className={eyebrow}>4-year equity model</div>
              <p className="text-[11px] text-slate-500 mt-1">Annual cash plus equity vesting at market-median grant size.</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900 tabular-nums">{fmtK(model.equity.fourYearTotal)}</div>
              <div className="text-[10px] text-slate-500">4-year total cost</div>
            </div>
          </div>

          <div className="flex items-end gap-3 mt-4" style={{ height: chartH + 36 }} role="img" aria-label={`Four year compensation at ${equityMultiple}x enterprise valuation`}>
            {model.equity.years.map(y => (
              <div key={y.year} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[11px] font-bold text-slate-800 tabular-nums mb-1">{fmtK(y.total)}</span>
                <div className="w-full max-w-16 flex flex-col-reverse rounded-t-md overflow-hidden transition-all duration-200" style={{ height: (y.total / maxTotal) * chartH }}>
                  <div title={`Base ${fmtK(y.base)}`} style={{ flex: y.base, background: EQ_COLORS.base }} />
                  <div title={`Target bonus ${fmtK(y.bonus)}`} style={{ flex: y.bonus, background: EQ_COLORS.bonus }} />
                  <div title={`Equity vesting ${fmtK(y.equity)}`} style={{ flex: y.equity, background: EQ_COLORS.equity }} />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 mt-1.5">Year {y.year}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {[
              ['Base', EQ_COLORS.base],
              ['Target bonus', EQ_COLORS.bonus],
              ['Annual equity vesting', EQ_COLORS.equity],
            ].map(([n, c]) => (
              <span key={n} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} /> {n}
              </span>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="eq-multiple" className={eyebrow}>Enterprise valuation at year 4</label>
              <span className="text-sm font-black text-slate-900">{equityMultiple}x</span>
            </div>
            <input
              id="eq-multiple"
              type="range"
              min={1}
              max={5}
              step={2}
              value={equityMultiple}
              onChange={e => setEquityMultiple(Number(e.target.value))}
              className="w-full mt-2 accent-(--color-secondary-200) cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-500 px-1">
              {EQUITY_MULTIPLES.map(m => (
                <span key={m} className={cn(m === equityMultiple && 'text-(--color-secondary-200)')}>{m}x</span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Unvested stock buy-out</div>
                <div className="text-lg font-black tabular-nums" style={{ color: TONE.red.color }}>{fmtK(model.equity.unvestedBuyout)}</div>
                <div className="text-[10px] text-slate-500">Typical in-seat executive forfeits</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Suggested sign-on LTI</div>
                <div className="text-lg font-black tabular-nums text-slate-900">{fmtK(model.equity.signOnLti)}</div>
                <div className="text-[10px] text-slate-500">Covers 60% of the cliff</div>
              </div>
            </div>
          </div>
        </div>

        {/* Talk track */}
        <div className="xl:col-span-2 rounded-2xl border border-(--color-secondary-50) bg-(--bg-brand-secondary-subtle) p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--color-secondary-200)">
            <Sparkles className="w-4 h-4" /> Recruiter talk-track · generated from this scenario
          </div>
          <ul className="mt-3 space-y-2.5" aria-label="Recruiter talk-track" aria-live="polite">
            {model.talkTrack.map((line, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-800 leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-(--color-secondary-200) shrink-0" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}

/* ------------------------------------------------------------------ */
/* Section 4: Target Hunting Grounds & Geographic Heatmap               */
/* ------------------------------------------------------------------ */

// Simplified continental US outline as [longitude, latitude]
const US_OUTLINE: [number, number][] = [
  [-124.7, 48.4], [-122.8, 49.0], [-95.2, 49.0], [-94.6, 48.7], [-93.0, 48.6], [-89.6, 48.0], [-88.4, 48.3], [-84.8, 46.5],
  [-83.5, 45.9], [-82.4, 45.3], [-82.6, 43.0], [-83.1, 42.1], [-82.5, 41.7], [-79.0, 42.8], [-76.5, 43.6], [-75.0, 45.0],
  [-71.5, 45.0], [-70.8, 45.4], [-69.2, 47.4], [-67.8, 47.1], [-67.0, 44.8], [-70.2, 43.6], [-70.7, 42.7], [-70.0, 41.8],
  [-71.5, 41.3], [-73.7, 40.9], [-74.0, 40.4], [-74.9, 38.9], [-75.5, 38.0], [-76.0, 37.0], [-75.5, 35.3], [-77.5, 34.5],
  [-79.0, 33.4], [-80.9, 32.0], [-81.4, 30.7], [-80.2, 28.0], [-80.2, 25.7], [-81.1, 25.1], [-82.0, 26.5], [-82.8, 28.0],
  [-83.6, 29.9], [-85.3, 29.7], [-87.5, 30.3], [-89.0, 30.3], [-89.4, 29.0], [-91.0, 29.2], [-93.8, 29.7], [-95.0, 29.2],
  [-97.1, 27.8], [-97.2, 25.9], [-99.1, 26.4], [-100.5, 28.7], [-101.4, 29.8], [-102.4, 29.8], [-103.1, 29.0], [-104.5, 29.6],
  [-106.5, 31.8], [-108.2, 31.8], [-108.2, 31.3], [-111.0, 31.3], [-114.8, 32.5], [-117.1, 32.5], [-118.5, 34.0], [-120.6, 34.6],
  [-121.9, 36.6], [-122.5, 37.8], [-123.8, 39.4], [-124.4, 40.4], [-124.1, 42.0], [-124.5, 43.0], [-124.0, 46.2],
];

const MAP_W = 540;
const MAP_H = 270;
const projX = (lon: number) => (lon + 125.5) * 7.52 + 34;
const projY = (lat: number) => (49.5 - lat) * 9.8 + 8;

const METRO_COORDS: { test: RegExp; lon: number; lat: number; short: string; side: 'r' | 'l'; dy: number }[] = [
  { test: /san francisco|bay area/i, lon: -122.2, lat: 37.6, short: 'SF Bay Area', side: 'r', dy: 0 },
  { test: /new york/i, lon: -74.0, lat: 40.7, short: 'New York', side: 'r', dy: 13 },
  { test: /seattle/i, lon: -122.3, lat: 47.6, short: 'Seattle', side: 'r', dy: 0 },
  { test: /boston/i, lon: -71.1, lat: 42.4, short: 'Boston', side: 'r', dy: -6 },
  { test: /austin/i, lon: -97.7, lat: 30.3, short: 'Austin', side: 'r', dy: 0 },
  { test: /chicago/i, lon: -87.6, lat: 41.9, short: 'Chicago', side: 'l', dy: -2 },
  { test: /washington/i, lon: -77.0, lat: 38.9, short: 'Washington DC', side: 'l', dy: 8 },
  { test: /los angeles/i, lon: -118.2, lat: 34.0, short: 'Los Angeles', side: 'r', dy: 0 },
  { test: /dallas/i, lon: -96.8, lat: 32.8, short: 'Dallas', side: 'r', dy: 0 },
  { test: /atlanta/i, lon: -84.4, lat: 33.7, short: 'Atlanta', side: 'r', dy: 0 },
  { test: /denver/i, lon: -105.0, lat: 39.7, short: 'Denver', side: 'r', dy: 0 },
  { test: /miami/i, lon: -80.2, lat: 25.8, short: 'Miami', side: 'r', dy: 0 },
  { test: /phoenix/i, lon: -112.1, lat: 33.4, short: 'Phoenix', side: 'r', dy: 0 },
];

const heatColor = (p: number, max: number) => dialColor(0.15 + 0.85 * Math.min(1, p / Math.max(max, 1)) * 1);

export function GeographicHeatmap({ hubs }: { hubs: SearchIntelligenceData['geography']['topHubs'] }) {
  const sorted = [...hubs].sort((a, b) => b.percentage - a.percentage).slice(0, 5);
  const max = sorted[0]?.percentage ?? 1;
  const placed = sorted
    .map(h => ({ hub: h, geo: METRO_COORDS.find(m => m.test.test(h.metro)) }))
    .filter((x): x is { hub: typeof sorted[number]; geo: (typeof METRO_COORDS)[number] } => !!x.geo);
  const offMap = sorted.filter(h => !METRO_COORDS.some(m => m.test.test(h.metro)));
  const outline = US_OUTLINE.map(([lon, lat]) => `${projX(lon).toFixed(1)},${projY(lat).toFixed(1)}`).join(' ');

  return (
    <div>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full rounded-xl bg-slate-50 border border-slate-200" role="img" aria-label="Map of top executive talent metros by density">
        <defs>
          {placed.map(({ hub }, i) => (
            <radialGradient key={hub.metro} id={`heat-${i}`}>
              <stop offset="0%" stopColor={heatColor(hub.percentage, max)} stopOpacity={0.85} />
              <stop offset="55%" stopColor={heatColor(hub.percentage, max)} stopOpacity={0.35} />
              <stop offset="100%" stopColor={heatColor(hub.percentage, max)} stopOpacity={0} />
            </radialGradient>
          ))}
        </defs>
        <polygon points={outline} fill="#ffffff" stroke="#c9cce0" strokeWidth={1.2} strokeLinejoin="round" />
        {placed.map(({ hub, geo }, i) => {
          const x = projX(geo.lon);
          const y = projY(geo.lat);
          const r = 16 + hub.percentage * 1.1;
          return <circle key={`g-${hub.metro}`} cx={x} cy={y} r={r} fill={`url(#heat-${i})`} />;
        })}
        {placed.map(({ hub, geo }) => {
          const x = projX(geo.lon);
          const y = projY(geo.lat);
          const anchor = geo.side === 'r' ? 'start' : 'end';
          const tx = geo.side === 'r' ? x + 9 : x - 9;
          return (
            <g key={`m-${hub.metro}`}>
              <circle cx={x} cy={y} r={4} fill="#0c0b3b" stroke="#ffffff" strokeWidth={1.5} />
              {hub.isClientHQ && <circle cx={x} cy={y} r={8} fill="none" stroke="#0c0b3b" strokeWidth={1.2} strokeDasharray="2 2" />}
              <text x={tx} y={y + 3 + geo.dy} fontSize="10.5" fontWeight="700" fill="#1b1d2e" textAnchor={anchor} stroke="#ffffff" strokeWidth={3} paintOrder="stroke">
                {geo.short} {hub.percentage}%
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          Lower density
          <span className="w-24 h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${dialColor(0.15)}, ${dialColor(0.55)}, ${dialColor(1)})` }} aria-hidden="true" />
          Higher density
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border border-dashed border-slate-700" aria-hidden="true" /> Client HQ
        </span>
        {offMap.length > 0 && <span>Also: {offMap.map(h => `${h.metro} ${h.percentage}%`).join(', ')} (outside map)</span>}
      </div>
    </div>
  );
}

export function HuntingGrounds({ data, scenario, model }: SectionProps) {
  const hubs = [...data.geography.topHubs].sort((a, b) => b.percentage - a.percentage).slice(0, 5);
  const maxHub = hubs[0]?.percentage ?? 1;
  const hq = data.geography.topHubs.find(h => h.isClientHQ) ?? data.geography.topHubs.find(h => h.metro === scenario.locationMetro);
  const { topEmployers, fastestGrowing } = model.hunting;
  const wm = data.geography.workModel;

  return (
    <SectionShell
      step={4}
      icon={MapIcon}
      kicker="Where to Source"
      title="Target Hunting Grounds & Geographic Heatmap"
      subtitle="Where the viable executives live and work today, and which companies employ them or are competing to hire them."
    >
      <div className="p-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-6">
        <div className="space-y-4 min-w-0">
          <div className={eyebrow}>Top metros by executive density</div>
          <GeographicHeatmap hubs={data.geography.topHubs} />

          <ul className="space-y-2" aria-label="Top metros by density">
            {hubs.map(h => (
              <li key={h.metro} className="grid grid-cols-[150px_minmax(0,1fr)_auto] items-center gap-3">
                <span className="text-xs font-semibold text-slate-800 truncate" title={h.metro}>
                  {h.metro}
                  {h.isClientHQ && <span className="ml-1.5 text-[9px] font-bold text-(--color-secondary-200) uppercase">HQ</span>}
                </span>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden" aria-hidden="true">
                  <div className="h-full rounded-full" style={{ width: `${(h.percentage / maxHub) * 100}%`, background: heatColor(h.percentage, maxHub) }} />
                </div>
                <span className="text-xs font-bold text-slate-900 tabular-nums text-right w-16">
                  {h.percentage}% <span className="font-normal text-slate-400">· {h.candidateCount.toLocaleString()}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
              <span>Work model mix of the cohort</span>
              <span className="text-slate-500">Client requirement: {data.geography.clientRequirement}</span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden" aria-hidden="true">
              <div style={{ width: `${wm.remote}%`, background: '#7571e0' }} />
              <div style={{ width: `${wm.hybrid}%`, background: '#4d3ee0' }} />
              <div style={{ width: `${wm.inOffice}%`, background: '#1c1876' }} />
            </div>
            <div className="flex gap-4 text-[11px] text-slate-600">
              <span>Remote {wm.remote}%</span>
              <span>Hybrid {wm.hybrid}%</span>
              <span>In office {wm.inOffice}%</span>
            </div>
          </div>
          {hq && scenario.onsiteDays > 0 && (
            <p className="text-xs text-slate-700 rounded-xl border border-amber-200 bg-amber-50 p-3 leading-relaxed">
              Only {hq.percentage}% of this talent lives in {shortMetro(hq.metro)}. A {scenario.onsiteDays}-day on-site mandate excludes the other {100 - hq.percentage}% unless relocation is offered.
            </p>
          )}
        </div>

        {/* Sourcing competitors matrix */}
        <div className="min-w-0">
          <div className={cn(eyebrow, 'mb-3')}>Sourcing competitors matrix</div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-800">
                <Building2 className="w-4 h-4 text-(--color-secondary-200)" /> Top Employers
              </div>
              <ol className="divide-y divide-slate-100">
                {topEmployers.map((c, i) => (
                  <li key={c.name} className="px-3.5 py-2.5 flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-slate-400 tabular-nums">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-900 truncate">{c.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{c.industry}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold tabular-nums text-slate-900">{c.candidateCount.toLocaleString()}</div>
                      {c.status !== 'Clear Target' && <div className="text-[10px] font-semibold" style={{ color: TONE.red.color }}>{c.status.split(' (')[0]}</div>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2 text-xs font-bold text-slate-800">
                <span className="flex items-center gap-2"><Swords className="w-4 h-4 text-(--color-secondary-200)" /> Fastest Growing</span>
                <span className="text-[10px] font-semibold text-slate-500">Actively poaching</span>
              </div>
              <ol className="divide-y divide-slate-100">
                {fastestGrowing.map((c, i) => (
                  <li key={c.name} className="px-3.5 py-2.5 flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-slate-400 tabular-nums">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-900 truncate">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.openSearches} open executive searches</div>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-1 text-xs font-bold tabular-nums" style={{ color: TONE.green.color }}>
                      <TrendingUp className="w-3.5 h-3.5" /> +{c.growthPct}%
                    </div>
                  </li>
                ))}
              </ol>
              <p className="px-3.5 py-2 text-[10px] text-slate-400 border-t border-slate-100">Quarter-over-quarter growth in executive requisitions (modeled).</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 flex items-start gap-1.5">
            <Users className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Top five employers hold {data.sourceCompanies.topFiveConcentrationPercent}% of the cohort. {data.sourceCompanies.intakeTakeaway}
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
