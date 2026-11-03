import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, FileText, Check, X, MessageSquare, Star, Users, Filter, CircleCheck, LayoutGrid, MessageCircle, Download } from 'lucide-react';
import { PIPELINE_STAGES } from './tabs/ProjectCandidatesTab';
import type { ProjectPipelineCandidate } from './tabs/ProjectCandidatesTab';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface TemplateContext {
  candidates: ProjectPipelineCandidate[];
  projectTitle: string;
  leadRecruiter: string;
}

export interface TemplatePage {
  id: string;
  label: string;
  render: (ctx: TemplateContext) => React.ReactNode;
}

export interface SearchBookTemplate {
  id: string;
  name: string;
  description: string;
  badge?: string;
  /** Design size in px; the preview scales the page to fit */
  size: { w: number; h: number };
  /** Index of the page rendered as the template thumbnail (the most representative layout) */
  thumbnailPage: number;
  pages: TemplatePage[];
}

type C = ProjectPipelineCandidate;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const fullName = (c: C) => `${c.firstName} ${c.lastName}`;
const initials = (c: C) => `${c.firstName?.[0] ?? ''}${c.lastName?.[0] ?? ''}`.toUpperCase();
const ed = (c: C) => (c.executiveData ?? {}) as Partial<C['executiveData']>;
const stageIndex = (c: C) => PIPELINE_STAGES.indexOf(c.projectStatus);
const atLeast = (list: C[], stage: string) => list.filter(c => stageIndex(c) >= PIPELINE_STAGES.indexOf(stage)).length;
const countStage = (list: C[], stage: string) => list.filter(c => c.projectStatus === stage).length;
const average = (nums: number[]) => (nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0);
const pick = (list: C[], i: number): C | undefined => (list.length ? list[i % list.length] : undefined);

const today = () => new Date();
const longDate = () => today().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const shortDate = () => {
  const d = today();
  const mon = d.toLocaleDateString('en-US', { month: 'short' });
  return `${d.getDate()}-${mon}-${String(d.getFullYear()).slice(2)}`;
};

const letterGrade = (emi: number) => (emi >= 90 ? 'A' : emi >= 80 ? 'B' : emi >= 65 ? 'C' : 'D');

function Photo({
  c,
  className = '',
  style,
  tone = 'light',
}: {
  c?: C;
  className?: string;
  style?: React.CSSProperties;
  tone?: 'light' | 'dark';
}) {
  if (c?.avatarUrl) {
    return <img src={c.avatarUrl} alt="" className={`object-cover ${className}`} style={style} />;
  }
  return (
    <div
      className={`flex items-center justify-center font-semibold ${className}`}
      style={{
        background: tone === 'dark' ? '#23262e' : '#c9ced6',
        color: tone === 'dark' ? '#9aa3b2' : '#6b7280',
        ...style,
      }}
    >
      {c ? initials(c) : ''}
    </div>
  );
}

function Ring({ value, size = 120, stroke = 7, color = '#7c3aed', track = 'rgba(255,255,255,0.1)', children }: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(circ * Math.min(value, 100)) / 100} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

const SERIF = 'Georgia, "Times New Roman", serif';

/* ================================================================== */
/* 1. Classic Executive Search Report                                   */
/* ================================================================== */

const CLASSIC_NAVY = '#00005c';
const CLASSIC_TITLE = '#1f4e79';
const CLASSIC_GRAY = '#d9d9d6';
const FIRM = 'Executive Search';

function ClassicFooter() {
  return (
    <div className="absolute left-0 right-0 bottom-3 px-7 flex justify-between text-[7px] text-[#4b5563]">
      <span>Proprietary and confidential — do not distribute</span>
      <span>
        {FIRM} | {shortDate()}
      </span>
    </div>
  );
}

function ClassicCover({ projectTitle }: TemplateContext) {
  return (
    <div
      className="w-full h-full relative overflow-hidden text-white"
      style={{
        background:
          'linear-gradient(180deg,#27406b 0%,#5b8fc0 30%,#c9dcec 46%,#2a3d5c 62%,#0a1730 100%)',
      }}
    >
      {[
        { l: 40, r: -28, h: 250, o: 0.55 },
        { l: 60, r: -14, h: 220, o: 0.5 },
        { l: 70, r: 4, h: 260, o: 0.6 },
        { l: 80, r: 16, h: 210, o: 0.45 },
        { l: 30, r: 30, h: 190, o: 0.4 },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${s.l}%`,
            top: 20,
            width: 2,
            height: s.h,
            transform: `rotate(${s.r}deg)`,
            transformOrigin: 'top',
            background: `linear-gradient(180deg, rgba(255,140,60,${s.o}), rgba(255,140,60,0))`,
          }}
        />
      ))}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: 120,
          height: 110,
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%)',
        }}
      />
      <div className="absolute left-0 right-0 flex items-end justify-around px-3" style={{ bottom: 150 }}>
        {[34, 44, 38, 50, 42, 54, 40, 48, 36, 46, 40, 52].map((h, i) => (
          <div key={i} className="flex flex-col items-center" style={{ opacity: 0.9 }}>
            <div className="rounded-full bg-[#0a1730]" style={{ width: 9, height: 9 }} />
            <div className="bg-[#0a1730]" style={{ width: 13, height: h, borderRadius: '6px 6px 2px 2px' }} />
          </div>
        ))}
      </div>
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: 40,
          height: 90,
          background: 'radial-gradient(ellipse at 40% 20%, rgba(80,170,210,0.55), rgba(10,23,48,0) 70%)',
        }}
      />
      <div className="absolute left-7 top-7 w-[52px] h-[52px] rounded-xl border-2 border-white/90 flex items-center justify-center text-[9px] font-bold tracking-wider">
        LOGO
      </div>
      <div className="absolute left-7 right-7" style={{ top: 214 }}>
        <div className="text-[11px] font-bold tracking-[0.12em] uppercase">{FIRM}</div>
        <div className="mt-3 leading-[1.1]" style={{ fontFamily: SERIF, fontSize: 29 }}>
          {projectTitle}
        </div>
      </div>
      <div className="absolute left-7 right-7 bottom-9">
        <div className="text-[10px] font-bold tracking-[0.1em] uppercase">Executive Search Report</div>
        <div className="text-[10px] mt-1">{longDate()}</div>
      </div>
      <div className="absolute left-7 bottom-3 text-[7px] text-white/90">Proprietary and confidential — do not distribute</div>
    </div>
  );
}

function ClassicActivity({ candidates }: TemplateContext) {
  const contacted = candidates.length;
  const responded = atLeast(candidates, 'Contacted');
  const submitted = atLeast(candidates, 'Interviewing');
  const stages = [
    `${contacted} Prospects Contacted`,
    `${responded} Prospects Responded`,
    `${responded} Resumes Received`,
    `${submitted} Candidates Submitted`,
    `${submitted} Manager IV`,
    `${atLeast(candidates, 'Offer')} Panel IV`,
    `${countStage(candidates, 'Hired')} Final IV`,
  ];
  const widths = [100, 88, 76, 64, 52, 40, 30];
  return (
    <div className="w-full h-full bg-white relative text-[#1f2937]">
      <div className="px-7 pt-8">
        <div className="font-bold" style={{ fontFamily: SERIF, fontSize: 22, color: CLASSIC_TITLE }}>
          Recruitment Activity to Date
        </div>
      </div>
      <div className="px-7 mt-6 relative">
        <div className="space-y-[5px]">
          {stages.map((label, i) => (
            <div key={label} className="mx-auto relative" style={{ width: `${widths[i]}%` }}>
              <div
                className="h-[31px] flex items-center justify-center text-white text-[10.5px] font-bold"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 94% 100%, 6% 100%)',
                  background: 'linear-gradient(100deg,#15153f 0%,#3a2478 55%,#2b78b8 100%)',
                }}
              >
                {label}
              </div>
              <span
                className="absolute w-[9px] h-[9px] rounded-full bg-[#4a1670] border border-white"
                style={{ [i % 2 === 0 ? 'left' : 'right']: -2, bottom: -2 }}
              />
            </div>
          ))}
        </div>
        <div className="absolute text-[7px] leading-tight text-[#111]" style={{ left: 28, top: 150, width: 78 }}>
          Identified by {FIRM}
        </div>
        <div className="absolute text-[7px] leading-tight text-[#111] text-right" style={{ right: 28, top: 150, width: 78 }}>
          Dis-qualified by {FIRM} or self selected out due to KSF or location, etc.
        </div>
        <div className="absolute text-[7px] leading-tight text-[#111]" style={{ left: 28, top: 196, width: 100 }}>
          Dis-qualified by {FIRM} if not meeting KSF or doesn’t fit compensation, etc.
        </div>
      </div>
      <div className="px-7 mt-7">
        <div className="text-white text-[10px] font-bold px-3 py-2" style={{ background: CLASSIC_NAVY }}>
          Key Success Factors (KSF)
        </div>
        <div className="px-3 py-2 text-[9px] space-y-1" style={{ background: CLASSIC_GRAY }}>
          {['KSF 1', 'KSF 2', 'KSF 3'].map(k => (
            <div key={k} className="flex gap-2">
              <span className="font-semibold w-8">{k}</span>
              <span className="flex-1 h-[7px] mt-[3px] bg-white/70 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
      <ClassicFooter />
    </div>
  );
}

function ClassicProfile({ candidates }: TemplateContext) {
  const c = pick(candidates, 0);
  const d = c ? ed(c) : {};
  const ksf = [
    d.areasOfExpertise,
    d.executiveArchetype,
    d.careerTrajectory,
    d.currentCompensation ? `Current compensation ${d.currentCompensation}` : undefined,
    d.relocationWillingness ? `Relocation willingness: ${d.relocationWillingness}` : undefined,
  ];
  return (
    <div className="w-full h-full bg-white relative text-[#1f2937]">
      <div className="px-7 pt-7">
        <div className="font-bold uppercase leading-none" style={{ fontFamily: SERIF, fontSize: 20, color: CLASSIC_TITLE }}>
          {c ? fullName(c) : '[FULL NAME]'}
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 15, color: CLASSIC_TITLE }} className="mt-1">
          {c ? `${c.role}, ${c.company}` : '[Title at Employer]'}
        </div>
      </div>
      <div className="px-7 mt-3 flex gap-4">
        <Photo c={c} className="w-[92px] h-[100px] shrink-0" />
        <div className="flex-1">
          <div className="text-white text-[10px] font-bold px-3 py-1.5" style={{ background: CLASSIC_NAVY }}>
            Key Information
          </div>
          <div className="px-3 py-2 text-[9px] leading-[1.5] h-[70px] overflow-hidden" style={{ background: CLASSIC_GRAY }}>
            <div>• <b>Education:</b> {d.education ?? '—'}</div>
            <div>• <b>Location:</b> {c?.location ?? '—'}</div>
            <div>• <b>Motivation:</b> {d.mobilityIndicator ? `${d.mobilityIndicator} mobility; next role ${d.likelyNextRole ?? '—'}` : '—'}</div>
          </div>
        </div>
      </div>
      <div className="px-7 mt-3">
        <div className="text-white text-[10px] font-bold px-3 py-1.5" style={{ background: CLASSIC_NAVY }}>
          Key Success Factors
        </div>
        {ksf.map((v, i) => (
          <div key={i} className="grid grid-cols-[48px_1fr] text-[8.5px] border-b border-white" style={{ background: CLASSIC_GRAY }}>
            <div className="px-3 py-1 font-medium">KSF {i + 1}</div>
            <div className="px-2 py-1 border-l border-white truncate">{v ?? ''}</div>
          </div>
        ))}
      </div>
      <div className="px-7 mt-3">
        <div className="text-white text-[10px] font-bold px-3 py-1.5" style={{ background: CLASSIC_NAVY }}>
          Interviewer Feedback
        </div>
        {['IV 1', 'IV 2', 'IV 3', 'IV 4'].map(v => (
          <div key={v} className="grid grid-cols-[48px_1fr] text-[8.5px] border-b border-white" style={{ background: CLASSIC_GRAY }}>
            <div className="px-3 py-1 font-medium">{v}</div>
            <div className="px-2 py-1 border-l border-white text-[#6b7280] italic">Awaiting feedback</div>
          </div>
        ))}
      </div>
      <ClassicFooter />
    </div>
  );
}

function ClassicSlate({ candidates }: TemplateContext) {
  const rows = candidates.slice(0, 6);
  return (
    <div className="w-full h-full bg-white relative text-[#1f2937]">
      <div className="px-7 pt-8">
        <div className="font-bold" style={{ fontFamily: SERIF, fontSize: 22, color: CLASSIC_TITLE }}>
          Status of Candidate Slate
        </div>
      </div>
      <div className="px-7 mt-5 space-y-[9px]">
        {rows.map(c => (
          <div key={c.id} className="flex gap-3">
            <Photo c={c} className="w-[46px] h-[56px] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-white text-[9.5px] font-bold px-2.5 py-1 truncate" style={{ background: CLASSIC_NAVY }}>
                {fullName(c)} ({c.company})
              </div>
              <div className="px-2.5 py-1.5 text-[8.5px] h-[30px]" style={{ background: CLASSIC_GRAY }}>
                <b>Status:</b> {c.projectStatus}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ClassicFooter />
    </div>
  );
}

/* ================================================================== */
/* 2. Dark Executive Review (matches the dark screenshots)             */
/* ================================================================== */

const D_BG = '#0b0d12';
const D_CARD = 'rgba(255,255,255,0.045)';
const D_LINE = 'rgba(255,255,255,0.1)';
const D_BLUE = '#4f8cff';
const D_MUTED = '#8a93a6';

function DarkHeader({ ctx, c, index }: { ctx: TemplateContext; c?: C; index: number }) {
  return (
    <div className="px-4 py-3 border-b" style={{ borderColor: D_LINE, background: '#0d0f15' }}>
      <div className="text-[8px] tracking-[0.14em] font-bold uppercase text-center" style={{ color: D_MUTED }}>
        {ctx.projectTitle}
      </div>
      <div className="flex items-center justify-between mt-1.5 gap-2">
        <ChevronLeft className="w-4 h-4 shrink-0" style={{ color: D_MUTED }} />
        <div className="text-[10px] leading-tight flex-1 min-w-0">
          <span className="text-white font-semibold">Phenom</span>{' '}
          <span style={{ color: D_BLUE }}>• {c ? ed(c).currentCompensation ?? '' : ''}</span>
        </div>
        <ChevronLeft className="w-3.5 h-3.5" style={{ color: D_MUTED }} />
        <span
          className="text-[8px] font-bold tracking-wider rounded-full px-2.5 py-1 border"
          style={{ borderColor: D_LINE, background: D_CARD, color: '#d7dbe5' }}
        >
          {index + 1} OF {ctx.candidates.length}
        </span>
        <ChevronRight className="w-3.5 h-3.5" style={{ color: D_MUTED }} />
      </div>
    </div>
  );
}

function DarkOverview(ctx: TemplateContext) {
  const { candidates, projectTitle } = ctx;
  const pills = [
    { label: 'Sourced', n: countStage(candidates, 'Identified'), icon: Users },
    { label: 'Recruiter Screen', n: countStage(candidates, 'Contacted'), icon: Filter },
    { label: 'Executive Review', n: countStage(candidates, 'Interviewing'), icon: CircleCheck, active: true },
    { label: 'Interviews', n: countStage(candidates, 'Offer') + countStage(candidates, 'Hired'), icon: Users },
  ];
  const widths = [100, 91, 82, 73];
  return (
    <div className="w-full h-full text-white flex flex-col px-5 pt-7" style={{ background: D_BG }}>
      <div className="text-center">
        <div className="text-[27px] font-medium leading-tight">Executive Search Report</div>
        <div className="text-[11px] mt-2 flex items-center justify-center gap-1.5" style={{ color: D_MUTED }}>
          <span>{projectTitle}</span>
          <span>•</span>
          <span className="font-medium" style={{ color: D_BLUE }}>Phenom</span>
          <FileText className="w-3 h-3" />
        </div>
        <div className="text-[8.5px] tracking-[0.2em] font-bold mt-6" style={{ color: D_MUTED }}>
          VIEW ALL CANDIDATES
        </div>
      </div>
      <div className="mt-5 space-y-2">
        {pills.map((p, i) => {
          const Icon = p.icon;
          return (
            <div
              key={p.label}
              className="mx-auto h-[42px] rounded-full border flex items-center gap-3 px-2.5"
              style={{
                width: `${widths[i]}%`,
                borderColor: p.active ? 'rgba(79,140,255,0.55)' : D_LINE,
                background: p.active ? 'linear-gradient(90deg,#0c1d44,#0a1530)' : D_CARD,
                boxShadow: p.active ? '0 0 18px rgba(79,140,255,0.25)' : undefined,
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: p.active ? 'rgba(79,140,255,0.2)' : 'rgba(255,255,255,0.07)' }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: p.active ? D_BLUE : D_MUTED }} />
              </div>
              <span className="text-[11px] font-semibold flex-1" style={{ color: p.active ? '#cfe0ff' : D_MUTED }}>
                {p.label}
              </span>
              <span className="text-[14px] font-bold" style={{ color: p.active ? D_BLUE : D_MUTED }}>{p.n}</span>
              {p.active && (
                <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: D_BLUE }}>
                  <ArrowRight className="w-3 h-3 text-white" />
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-baseline justify-between border-b pb-2" style={{ borderColor: D_LINE }}>
        <div className="text-[14px]">Executive Review Candidates</div>
        <div className="text-[8px] tracking-[0.14em] font-bold" style={{ color: D_MUTED }}>{candidates.length} TOTAL</div>
      </div>
      <div className="mt-3 space-y-2 overflow-hidden">
        {candidates.slice(0, 4).map(c => (
          <div key={c.id} className="rounded-xl border flex items-center gap-3 px-3 py-2" style={{ background: D_CARD, borderColor: D_LINE }}>
            <Photo c={c} tone="dark" className="w-10 h-10 rounded-full shrink-0 text-[10px]" />
            <div className="min-w-0 flex-1">
              <div className="text-[11.5px] font-semibold truncate">{fullName(c)}</div>
              <div className="text-[9px] truncate" style={{ color: '#c1c8d6' }}>{c.role}</div>
              <div className="text-[8px] truncate" style={{ color: D_MUTED }}>{c.company}</div>
            </div>
            <div className="flex items-center gap-1 text-[7px] font-bold tracking-wider" style={{ color: D_MUTED }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" /> {c.projectStatus.toUpperCase()}
            </div>
            <span className="text-[7.5px] font-bold tracking-wider rounded-full px-2 py-1 border" style={{ color: D_BLUE, borderColor: 'rgba(79,140,255,0.5)', background: 'rgba(79,140,255,0.12)' }}>
              PENDING
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DarkProfile(ctx: TemplateContext) {
  const c = pick(ctx.candidates, 0);
  const d = c ? ed(c) : {};
  const facts = [
    ['EDUCATION', d.education],
    ['LOCATION', c?.location],
    ['MOBILITY', d.mobilityIndicator],
    ['NOTICE PERIOD', d.noticePeriod],
    ['NON-COMPETE', d.nonCompete],
    ['SALARY EXP.', d.currentCompensation ? `Current: ${d.currentCompensation}` : undefined],
  ];
  return (
    <div className="w-full h-full text-white flex flex-col" style={{ background: D_BG }}>
      <DarkHeader ctx={ctx} c={c} index={0} />
      <div className="relative h-[300px] shrink-0">
        <Photo c={c} tone="dark" className="w-full h-full text-[48px]" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(11,13,18,0) 40%, ${D_BG} 100%)` }} />
        <div className="absolute left-5 bottom-3 right-5">
          <div className="text-[30px] font-medium leading-none">{c ? fullName(c) : ''}</div>
          <div className="text-[13px] mt-2" style={{ color: '#c1c8d6' }}>{c?.role}</div>
          <span className="inline-block mt-2 text-[8px] font-bold tracking-wider uppercase px-2 py-1 border rounded" style={{ borderColor: D_LINE, background: D_CARD }}>
            {c?.company}
          </span>
        </div>
      </div>
      <div className="px-5 flex flex-wrap gap-2 mt-2">
        {[
          { t: `FIT SCORE: ${c ? letterGrade(c.emiScore) : ''}`, c: '#f59e0b', b: 'rgba(245,158,11,0.15)' },
          { t: `BEHAVIORAL: ${c?.behavioralScore ?? '—'}/100`, c: '#8b93ff', b: 'rgba(99,102,241,0.18)' },
          { t: `EMI: ${c?.emiScore ?? '—'}%`, c: '#c084fc', b: 'rgba(168,85,247,0.18)' },
        ].map(chip => (
          <span key={chip.t} className="text-[8px] font-bold tracking-wider px-2 py-1 rounded border" style={{ color: chip.c, background: chip.b, borderColor: `${chip.c}55` }}>
            {chip.t}
          </span>
        ))}
      </div>
      <div className="px-5 mt-4">
        <div className="text-[9px] font-bold tracking-[0.16em] pb-1.5 border-b" style={{ color: D_BLUE, borderColor: D_LINE }}>
          EXECUTIVE CANDIDATE KEY INSIGHTS
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {facts.map(([k, v]) => (
            <div key={k as string} className="rounded-xl border px-3 py-2" style={{ background: D_CARD, borderColor: D_LINE }}>
              <div className="text-[7px] tracking-[0.14em] font-bold" style={{ color: D_MUTED }}>{k}</div>
              <div className="text-[10.5px] font-medium mt-1 leading-snug line-clamp-2">{v ?? '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DarkInsights(ctx: TemplateContext) {
  const c = pick(ctx.candidates, 0);
  const d = c ? ed(c) : {};
  const trajectory = (d.careerTrajectory ?? '').split(/->|→/).map(s => s.trim()).filter(Boolean);
  const bullets = (d.areasOfExpertise ?? '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 3);
  const emi = c?.emiScore ?? 0;
  const cards = [
    { title: 'Why they will move (Push)', color: '#4f8cff', items: [d.mobilityIndicator ? `Mobility indicator: ${d.mobilityIndicator}` : '', d.currentCompensation ? `Current compensation: ${d.currentCompensation}` : ''] },
    { title: 'Why they want this role (Pull)', color: '#22c55e', items: [d.likelyNextRole ? `Likely next role: ${d.likelyNextRole}` : '', d.careerTrajectory ? `Career trajectory: ${d.careerTrajectory}` : ''] },
    { title: 'Known Friction (Structural)', color: '#ef4444', items: [d.relocationWillingness ? `Relocation willingness: ${d.relocationWillingness}` : '', d.noticePeriod ? `Notice period: ${d.noticePeriod}` : ''] },
  ];
  return (
    <div className="w-full h-full text-white flex flex-col" style={{ background: D_BG }}>
      <DarkHeader ctx={ctx} c={c} index={0} />
      <div className="px-5 pt-4 overflow-hidden">
        <div className="text-[8.5px] tracking-[0.16em] font-bold" style={{ color: D_MUTED }}>CAREER HISTORY</div>
        <div className="mt-2 space-y-3 border-l pl-3 ml-1" style={{ borderColor: D_LINE }}>
          <div>
            <div className="text-[12px] font-semibold">{c?.role}</div>
            <div className="text-[10px]" style={{ color: D_BLUE }}>{c?.company}</div>
            <div className="text-[8px] tracking-wider font-mono" style={{ color: D_MUTED }}>CURRENT ROLE</div>
          </div>
          {trajectory.length > 1 && (
            <div>
              <div className="text-[12px] font-semibold">{trajectory[0]}</div>
              <div className="text-[8px] tracking-wider font-mono" style={{ color: D_MUTED }}>PRIOR ROLE</div>
            </div>
          )}
        </div>
        <div className="text-[9px] font-bold tracking-[0.16em] mt-4 pb-1.5 border-b" style={{ color: D_BLUE, borderColor: D_LINE }}>
          EXECUTIVE CANDIDATE SUMMARY
        </div>
        <div className="text-[8px] tracking-[0.14em] font-bold mt-2" style={{ color: D_MUTED }}>AI PROFILE SUMMARY</div>
        <ul className="mt-1.5 space-y-1.5">
          {bullets.map(b => (
            <li key={b} className="flex gap-2 text-[10.5px] leading-snug" style={{ color: '#d7dbe5' }}>
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: D_BLUE }} />
              Deep experience in {b.toLowerCase()}.
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-center mt-4">
          <Ring value={emi} size={96} stroke={4} color="#7c3aed" track="rgba(255,255,255,0.08)">
            <span className="text-[26px] font-light" style={{ color: '#c4b5fd' }}>{emi}%</span>
          </Ring>
          <div className="text-[12px] font-semibold mt-2">Executive Mobility Index</div>
          <div className="text-[9px]" style={{ color: D_MUTED }}>AI Executive Search Agent Assessment</div>
        </div>
        <div className="mt-3 space-y-2">
          {cards.map(card => (
            <div key={card.title} className="rounded-xl border px-3 py-2" style={{ background: D_CARD, borderColor: D_LINE }}>
              <div className="text-[10px] font-semibold">{card.title}</div>
              {card.items.filter(Boolean).map(item => (
                <div key={item} className="flex gap-2 text-[9px] mt-1" style={{ color: '#c1c8d6' }}>
                  <span className="w-1 h-1 rounded-full mt-[5px] shrink-0" style={{ background: card.color }} />
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DarkAssessment(ctx: TemplateContext) {
  const c = pick(ctx.candidates, 0);
  const d = c ? ed(c) : {};
  const bars = [
    { label: 'EMI Match', v: c?.emiScore ?? 0 },
    { label: 'Behavioral', v: c?.behavioralScore ?? 0 },
    { label: 'Assessment', v: c?.assessmentScore ?? c?.behavioralScore ?? 0 },
  ];
  const tone = (v: number) => (v >= 80 ? { t: 'STRONG', c: '#10b981' } : v >= 60 ? { t: 'NEUTRAL', c: '#f59e0b' } : { t: 'GAP', c: '#ef4444' });
  return (
    <div className="w-full h-full text-white flex flex-col" style={{ background: D_BG }}>
      <DarkHeader ctx={ctx} c={c} index={0} />
      <div className="px-5 pt-4 flex-1 overflow-hidden">
        {[
          ['KEY ACHIEVEMENTS', d.areasOfExpertise],
          ['MOTIVATION', d.mobilityIndicator ? `${d.mobilityIndicator} mobility; likely next role ${d.likelyNextRole ?? '—'}` : undefined],
          ['BEHAVIORAL FACTORS', d.executiveArchetype],
        ].map(([k, v]) => (
          <div key={k as string} className="mb-3">
            <div className="text-[8px] tracking-[0.16em] font-bold mb-1.5" style={{ color: D_MUTED }}>{k}</div>
            <div className="rounded-xl border px-3 py-2 text-[10.5px]" style={{ background: D_CARD, borderColor: D_LINE }}>{v ?? '—'}</div>
          </div>
        ))}
        <div className="text-[8.5px] tracking-[0.16em] font-bold mb-1.5" style={{ color: D_BLUE }}>INTERVIEW FEEDBACK</div>
        {[0, 1].map(i => (
          <div key={i} className="rounded-xl border border-dashed px-3 py-2 text-[10px] italic mb-1.5" style={{ borderColor: D_LINE, color: D_MUTED }}>
            + Add Interview Feedback…
          </div>
        ))}
        <div className="text-[8px] tracking-[0.16em] font-bold mt-3 mb-1.5" style={{ color: D_MUTED }}>ALIGNMENT MATRIX</div>
        <div className="space-y-1.5">
          {bars.map(b => {
            const t = tone(b.v);
            return (
              <div key={b.label} className="rounded-xl border px-3 py-1.5" style={{ background: D_CARD, borderColor: D_LINE }}>
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: '#c1c8d6' }}>{b.label}</span>
                  <span className="font-bold tracking-wider text-[8px]" style={{ color: t.c }}>{t.t}</span>
                </div>
                <div className="h-[3px] rounded-full mt-1.5" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(b.v, 100)}%`, background: t.c }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-[8px] tracking-[0.16em] font-bold mt-3 mb-1.5" style={{ color: D_MUTED }}>PEER EXECUTIVE FEEDBACK</div>
        <div className="rounded-xl border border-dashed px-3 py-2 text-[10px] text-center" style={{ borderColor: D_LINE, color: D_MUTED }}>
          No peer feedback available yet.
        </div>
      </div>
      <div className="px-4 py-2.5 flex items-center justify-center gap-2 border-t" style={{ borderColor: D_LINE }}>
        <span className="w-9 h-9 rounded-full border flex items-center justify-center" style={{ borderColor: 'rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.12)' }}>
          <X className="w-4 h-4 text-[#ef4444]" />
        </span>
        <span className="flex items-center gap-0.5 rounded-full border px-3 py-1.5" style={{ borderColor: D_LINE, background: D_CARD }}>
          {[0, 1, 2, 3, 4].map(i => (
            <Star key={i} className="w-3.5 h-3.5" style={{ color: '#f59e0b', fill: i < 4 ? '#f59e0b' : 'none' }} />
          ))}
        </span>
        <span className="w-9 h-9 rounded-full border flex items-center justify-center" style={{ borderColor: D_LINE, background: D_CARD }}>
          <MessageSquare className="w-4 h-4" style={{ color: D_MUTED }} />
        </span>
        <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#10b981', boxShadow: '0 0 16px rgba(16,185,129,0.4)' }}>
          <Check className="w-5 h-5 text-white" />
        </span>
      </div>
      <div className="grid grid-cols-3 text-center py-2 border-t text-[7px] font-bold tracking-wider" style={{ borderColor: D_LINE, color: D_MUTED, background: '#0d0f15' }}>
        <div className="flex flex-col items-center gap-1"><LayoutGrid className="w-3.5 h-3.5" />DASHBOARD</div>
        <div className="flex flex-col items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />MY FEEDBACK</div>
        <div className="flex flex-col items-center gap-1"><Download className="w-3.5 h-3.5" />EXPORT PDF</div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 3. Modern Dossier (light, indigo)                                   */
/* ================================================================== */

const M_INDIGO = '#4d3ee0';
const M_INK = '#1e2330';
const M_MUTED = '#667085';

function ModernCover({ projectTitle, leadRecruiter, candidates }: TemplateContext) {
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: 'linear-gradient(160deg,#f5f3ff 0%,#ffffff 55%)' }}>
      <div
        className="absolute -right-24 -top-20 w-[320px] h-[320px] rounded-full"
        style={{ background: 'radial-gradient(circle at 30% 30%, #7c6cf0, #4d3ee0 60%, #2927b2)' }}
      />
      <div className="absolute right-10 top-[230px] w-[120px] h-[120px] rounded-full" style={{ background: 'rgba(77,62,224,0.12)' }} />
      <div className="absolute left-8 top-8 text-[10px] font-semibold tracking-[0.18em]" style={{ color: M_INDIGO }}>EXECUTIVE SEARCH</div>
      <div className="absolute left-8 right-8" style={{ top: 250 }}>
        <div className="text-[34px] leading-[1.05] font-semibold" style={{ color: M_INK }}>{projectTitle}</div>
        <div className="text-[15px] mt-3" style={{ color: M_MUTED }}>Candidate dossier and slate review</div>
        <div className="flex gap-2 mt-6 flex-wrap">
          {[`${candidates.length} candidates`, `Avg EMI ${average(candidates.map(c => c.emiScore))}`].map(t => (
            <span key={t} className="text-[10px] font-semibold px-3 py-1.5 rounded-full border bg-white" style={{ color: M_INDIGO, borderColor: '#cac1f2' }}>{t}</span>
          ))}
        </div>
      </div>
      <div className="absolute left-8 right-8 bottom-8 flex justify-between text-[9px]" style={{ color: M_MUTED }}>
        <span>Prepared by {leadRecruiter}</span>
        <span>{longDate()} · Confidential</span>
      </div>
    </div>
  );
}

function ModernSlate({ candidates }: TemplateContext) {
  const kpis = [
    ['Candidates', String(candidates.length)],
    ['Avg EMI', String(average(candidates.map(c => c.emiScore)))],
    ['EMI 80+', String(candidates.filter(c => c.emiScore >= 80).length)],
    ['In interview', String(atLeast(candidates, 'Interviewing'))],
  ];
  return (
    <div className="w-full h-full bg-white p-7">
      <div className="text-[22px] font-semibold" style={{ color: M_INK }}>Slate at a glance</div>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {kpis.map(([k, v]) => (
          <div key={k} className="rounded-xl border p-2.5" style={{ borderColor: '#e4e7ec', background: '#fafafe' }}>
            <div className="text-[8px] uppercase tracking-wider font-semibold" style={{ color: M_MUTED }}>{k}</div>
            <div className="text-[20px] font-semibold mt-0.5" style={{ color: M_INDIGO }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 mt-4">
        {candidates.slice(0, 6).map((c, i) => (
          <div key={c.id} className="rounded-xl border p-2.5 flex items-center gap-2.5" style={{ borderColor: '#e4e7ec' }}>
            <span className="text-[9px] font-bold w-3" style={{ color: M_MUTED }}>{i + 1}</span>
            <Photo c={c} className="w-10 h-10 rounded-full shrink-0 text-[10px]" />
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-semibold truncate" style={{ color: M_INK }}>{fullName(c)}</div>
              <div className="text-[8.5px] truncate" style={{ color: M_MUTED }}>{c.role} · {c.company}</div>
            </div>
            <Ring value={c.emiScore} size={34} stroke={4} color={c.emiScore >= 80 ? '#00875a' : c.emiScore >= 60 ? M_INDIGO : '#ba4800'} track="#eceef3">
              <span className="text-[9px] font-bold" style={{ color: M_INK }}>{c.emiScore}</span>
            </Ring>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModernDossier({ candidates }: TemplateContext) {
  const c = pick(candidates, 0);
  const d = c ? ed(c) : {};
  const tags = (d.areasOfExpertise ?? '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);
  const bars = [
    ['EMI score', c?.emiScore ?? 0],
    ['Behavioral', c?.behavioralScore ?? 0],
    ['Assessment', c?.assessmentScore ?? c?.behavioralScore ?? 0],
  ] as const;
  return (
    <div className="w-full h-full bg-white">
      <div className="h-[92px] relative" style={{ background: 'linear-gradient(120deg,#2927b2,#4d3ee0 60%,#7c6cf0)' }}>
        <div className="absolute left-7 bottom-[-38px] flex items-end gap-4">
          <Photo c={c} className="w-[84px] h-[84px] rounded-2xl border-4 border-white shadow-md text-[26px]" />
        </div>
      </div>
      <div className="px-7 pt-12">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[22px] font-semibold leading-tight" style={{ color: M_INK }}>{c ? fullName(c) : ''}</div>
            <div className="text-[11px] mt-1" style={{ color: M_MUTED }}>{c?.role} · {c?.company}</div>
          </div>
          <Ring value={c?.emiScore ?? 0} size={52} stroke={5} color={M_INDIGO} track="#eceef3">
            <span className="text-[13px] font-bold" style={{ color: M_INK }}>{c?.emiScore}</span>
          </Ring>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {[
            ['Education', d.education],
            ['Location', c?.location],
            ['Compensation', d.currentCompensation],
            ['Notice period', d.noticePeriod],
          ].map(([k, v]) => (
            <div key={k as string} className="rounded-lg px-3 py-2" style={{ background: '#f6f7fb' }}>
              <div className="text-[7.5px] uppercase tracking-wider font-semibold" style={{ color: M_MUTED }}>{k}</div>
              <div className="text-[10px] font-medium mt-0.5 truncate" style={{ color: M_INK }}>{v ?? '—'}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map(t => (
            <span key={t} className="text-[8.5px] font-semibold px-2 py-1 rounded-full" style={{ background: '#eae8fb', color: '#2927b2' }}>{t}</span>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {bars.map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between text-[9px]" style={{ color: M_MUTED }}>
                <span>{k}</span><span className="font-semibold" style={{ color: M_INK }}>{v}</span>
              </div>
              <div className="h-1.5 rounded-full mt-1" style={{ background: '#eceef3' }}>
                <div className="h-full rounded-full" style={{ width: `${Math.min(v, 100)}%`, background: M_INDIGO }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl border p-3 text-[9.5px] leading-relaxed" style={{ borderColor: '#cac1f2', background: '#faf9ff', color: M_INK }}>
          <b style={{ color: M_INDIGO }}>Why consider:</b> {d.executiveArchetype ?? 'Strong profile'}; likely next role {d.likelyNextRole ?? '—'}; mobility {d.mobilityIndicator ?? '—'}.
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 4. Executive Brief                                                  */
/* ================================================================== */

function BriefCover({ projectTitle, leadRecruiter, candidates }: TemplateContext) {
  return (
    <div className="w-full h-full bg-white p-9 flex flex-col">
      <div className="h-1.5 w-14 rounded-full" style={{ background: M_INDIGO }} />
      <div className="mt-[150px]">
        <div className="text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: M_MUTED }}>Executive brief</div>
        <div className="text-[34px] leading-[1.05] font-semibold mt-3" style={{ color: M_INK }}>{projectTitle}</div>
        <div className="text-[13px] mt-4" style={{ color: M_MUTED }}>
          Ranked summary of {candidates.length} candidate{candidates.length === 1 ? '' : 's'}
        </div>
      </div>
      <div className="mt-auto text-[9px]" style={{ color: M_MUTED }}>
        Prepared by {leadRecruiter} · {longDate()}
      </div>
    </div>
  );
}

function BriefTable({ candidates }: TemplateContext) {
  const ranked = [...candidates].sort((a, b) => b.emiScore - a.emiScore).slice(0, 8);
  return (
    <div className="w-full h-full bg-white p-7">
      <div className="text-[22px] font-semibold" style={{ color: M_INK }}>Candidate summary</div>
      <div className="text-[9px] mt-1" style={{ color: M_MUTED }}>Ranked by EMI score</div>
      <div className="mt-4 text-[9px]">
        <div className="grid grid-cols-[14px_minmax(0,1.5fr)_minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_24px] gap-2 pb-1.5 border-b font-semibold uppercase tracking-wider text-[7.5px]" style={{ color: M_MUTED, borderColor: '#e4e7ec' }}>
          <span>#</span><span>Candidate</span><span>Role</span><span>Location</span><span>Stage</span><span className="text-right tracking-normal">EMI</span>
        </div>
        {ranked.map((c, i) => (
          <div key={c.id} className="grid grid-cols-[14px_minmax(0,1.5fr)_minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_24px] gap-2 py-2 border-b items-center" style={{ borderColor: '#f0f1f5', color: M_INK }}>
            <span className="font-bold" style={{ color: M_MUTED }}>{i + 1}</span>
            <span className="flex items-center gap-1.5 min-w-0">
              <Photo c={c} className="w-6 h-6 rounded-full shrink-0 text-[8px]" />
              <span className="font-semibold truncate">{fullName(c)}</span>
            </span>
            <span className="truncate">{c.role}</span>
            <span className="truncate">{c.location.split(',')[0]}</span>
            <span className="truncate">{c.projectStatus}</span>
            <span className="text-right font-bold" style={{ color: c.emiScore >= 80 ? '#00875a' : c.emiScore >= 60 ? M_INDIGO : '#ba4800' }}>{c.emiScore}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BriefPipeline({ candidates }: TemplateContext) {
  const max = Math.max(1, ...PIPELINE_STAGES.map(s => countStage(candidates, s)));
  return (
    <div className="w-full h-full bg-white p-7">
      <div className="text-[22px] font-semibold" style={{ color: M_INK }}>Pipeline snapshot</div>
      <div className="mt-6 space-y-3">
        {PIPELINE_STAGES.map(stage => {
          const n = countStage(candidates, stage);
          return (
            <div key={stage} className="flex items-center gap-3 text-[10px]">
              <span className="w-[72px]" style={{ color: M_MUTED }}>{stage}</span>
              <div className="flex-1 h-5 rounded-md" style={{ background: '#f1f2f6' }}>
                <div className="h-full rounded-md" style={{ width: `${(n / max) * 100}%`, background: M_INDIGO, minWidth: n ? 8 : 0 }} />
              </div>
              <span className="w-4 text-right font-bold" style={{ color: M_INK }}>{n}</span>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-8">
        {[
          ['Average EMI', String(average(candidates.map(c => c.emiScore)))],
          ['Top EMI', String(Math.max(0, ...candidates.map(c => c.emiScore)))],
          ['Offer or hired', String(atLeast(candidates, 'Offer'))],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl p-3" style={{ background: '#f6f7fb' }}>
            <div className="text-[8px] uppercase tracking-wider font-semibold" style={{ color: M_MUTED }}>{k}</div>
            <div className="text-[22px] font-semibold" style={{ color: M_INDIGO }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* 5. Candidate Profile Pack                                           */
/* ================================================================== */

function ProfilePack({ candidates, index }: TemplateContext & { index: number }) {
  const c = pick(candidates, index);
  const d = c ? ed(c) : {};
  return (
    <div className="w-full h-full bg-white p-7">
      <div className="flex items-center gap-4">
        <Photo c={c} className="w-[72px] h-[72px] rounded-2xl shrink-0 text-[20px]" />
        <div className="min-w-0 flex-1">
          <div className="text-[22px] font-semibold leading-tight truncate" style={{ color: M_INK }}>{c ? fullName(c) : ''}</div>
          <div className="text-[11px]" style={{ color: M_MUTED }}>{c?.role}</div>
          <div className="text-[10px]" style={{ color: M_MUTED }}>{c?.company} · {c?.location}</div>
        </div>
        <div className="text-center">
          <div className="text-[26px] font-semibold leading-none" style={{ color: M_INDIGO }}>{c?.emiScore}</div>
          <div className="text-[7.5px] uppercase tracking-wider font-semibold mt-1" style={{ color: M_MUTED }}>EMI</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          ['Stage', c?.projectStatus],
          ['Behavioral', c?.behavioralScore !== undefined ? `${c.behavioralScore}/100` : undefined],
          ['Mobility', d.mobilityIndicator],
        ].map(([k, v]) => (
          <div key={k as string} className="rounded-lg px-3 py-2" style={{ background: '#f6f7fb' }}>
            <div className="text-[7.5px] uppercase tracking-wider font-semibold" style={{ color: M_MUTED }}>{k}</div>
            <div className="text-[11px] font-semibold mt-0.5" style={{ color: M_INK }}>{v ?? '—'}</div>
          </div>
        ))}
      </div>
      {[
        ['Executive summary', `${d.executiveArchetype ?? 'Executive leader'} with expertise in ${d.areasOfExpertise ?? '—'}.`],
        ['Career trajectory', d.careerTrajectory ?? '—'],
        ['Education', d.education ?? '—'],
        ['Compensation and availability', `Current compensation ${d.currentCompensation ?? '—'}. Notice period ${d.noticePeriod ?? '—'}. Non-compete: ${d.nonCompete ?? '—'}. Relocation willingness: ${d.relocationWillingness ?? '—'}.`],
      ].map(([k, v]) => (
        <div key={k} className="mt-4">
          <div className="text-[8.5px] uppercase tracking-[0.14em] font-semibold pb-1 border-b" style={{ color: M_INDIGO, borderColor: '#e4e7ec' }}>{k}</div>
          <div className="text-[10.5px] leading-relaxed mt-1.5" style={{ color: M_INK }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/* 6. Side-by-Side Comparison                                          */
/* ================================================================== */

function CompareCover(ctx: TemplateContext) {
  return (
    <div className="w-full h-full p-9 flex flex-col text-white" style={{ background: 'linear-gradient(150deg,#0f172a,#1e1b4b 70%,#312e81)' }}>
      <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#cac1f2]">Comparison report</div>
      <div className="text-[32px] leading-[1.05] font-semibold mt-[150px]">{ctx.projectTitle}</div>
      <div className="text-[13px] mt-4 text-[#cac1f2]">Side-by-side view of {ctx.candidates.length} candidates</div>
      <div className="mt-auto text-[9px] text-[#cac1f2]">{ctx.leadRecruiter} · {longDate()}</div>
    </div>
  );
}

function CompareMatrix({ candidates }: TemplateContext) {
  const cols = candidates.slice(0, 4);
  const rows: [string, (c: C) => React.ReactNode][] = [
    ['Current role', c => c.role],
    ['Company', c => c.company],
    ['Location', c => c.location.split(',')[0]],
    ['Stage', c => c.projectStatus],
    ['Education', c => ed(c).education ?? '—'],
    ['Compensation', c => ed(c).currentCompensation ?? '—'],
    ['Notice period', c => ed(c).noticePeriod ?? '—'],
    ['Mobility', c => ed(c).mobilityIndicator ?? '—'],
    [
      'EMI score',
      c => (
        <span className="font-bold" style={{ color: c.emiScore >= 80 ? '#00875a' : c.emiScore >= 60 ? M_INDIGO : '#ba4800' }}>{c.emiScore}</span>
      ),
    ],
  ];
  return (
    <div className="w-full h-full bg-white p-6">
      <div className="text-[22px] font-semibold" style={{ color: M_INK }}>Comparison matrix</div>
      <div className="mt-4 border rounded-xl overflow-hidden text-[8.5px]" style={{ borderColor: '#e4e7ec' }}>
        <div className="grid" style={{ gridTemplateColumns: `64px repeat(${cols.length}, minmax(0,1fr))` }}>
          <div style={{ background: '#f6f7fb' }} />
          {cols.map(c => (
            <div key={c.id} className="p-2 border-l text-center" style={{ background: '#f6f7fb', borderColor: '#e4e7ec' }}>
              <Photo c={c} className="w-8 h-8 rounded-full mx-auto text-[9px]" />
              <div className="font-semibold mt-1 leading-tight" style={{ color: M_INK }}>{fullName(c)}</div>
            </div>
          ))}
          {rows.map(([k, fn]) => (
            <React.Fragment key={k}>
              <div className="p-2 border-t font-semibold" style={{ color: M_MUTED, borderColor: '#eef0f4' }}>{k}</div>
              {cols.map(c => (
                <div key={c.id} className="p-2 border-t border-l text-center leading-tight" style={{ color: M_INK, borderColor: '#eef0f4' }}>{fn(c)}</div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompareScores({ candidates }: TemplateContext) {
  const cols = candidates.slice(0, 4);
  const metrics: [string, (c: C) => number, string][] = [
    ['EMI score', c => c.emiScore, M_INDIGO],
    ['Behavioral', c => c.behavioralScore ?? 0, '#00875a'],
    ['Assessment', c => c.assessmentScore ?? c.behavioralScore ?? 0, '#ba4800'],
  ];
  return (
    <div className="w-full h-full bg-white p-7">
      <div className="text-[22px] font-semibold" style={{ color: M_INK }}>Score comparison</div>
      <div className="flex gap-4 mt-3 text-[8.5px]" style={{ color: M_MUTED }}>
        {metrics.map(([k, , col]) => (
          <span key={k} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: col }} />{k}</span>
        ))}
      </div>
      <div className="mt-5 space-y-4">
        {cols.map(c => (
          <div key={c.id}>
            <div className="text-[10px] font-semibold mb-1.5" style={{ color: M_INK }}>{fullName(c)}</div>
            {metrics.map(([k, fn, col]) => (
              <div key={k} className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2.5 rounded-sm" style={{ background: '#f1f2f6' }}>
                  <div className="h-full rounded-sm" style={{ width: `${Math.min(fn(c), 100)}%`, background: col }} />
                </div>
                <span className="w-6 text-[9px] font-semibold text-right" style={{ color: M_INK }}>{fn(c)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* 7. Board Slate Deck (16:9 slides)                                   */
/* ================================================================== */

const S_BG = 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)';

function SlideTitle({ projectTitle, leadRecruiter, candidates }: TemplateContext) {
  return (
    <div className="w-full h-full text-white relative overflow-hidden p-10 flex flex-col" style={{ background: S_BG }}>
      <div className="absolute -right-16 -bottom-24 w-[320px] h-[320px] rounded-full" style={{ background: 'radial-gradient(circle,#4d3ee0,rgba(77,62,224,0))' }} />
      <div className="text-[10px] font-semibold tracking-[0.2em] text-[#cac1f2]">BOARD SLATE REVIEW</div>
      <div className="text-[38px] leading-[1.05] font-semibold mt-auto max-w-[360px]">{projectTitle}</div>
      <div className="text-[12px] mt-3 text-[#cac1f2]">{candidates.length} candidates · {leadRecruiter} · {longDate()}</div>
    </div>
  );
}

function SlidePipeline({ candidates }: TemplateContext) {
  const max = Math.max(1, ...PIPELINE_STAGES.map(s => countStage(candidates, s)));
  return (
    <div className="w-full h-full text-white p-8 flex gap-8" style={{ background: S_BG }}>
      <div className="w-[170px] shrink-0">
        <div className="text-[10px] font-semibold tracking-[0.2em] text-[#cac1f2]">PIPELINE</div>
        <div className="text-[56px] font-semibold leading-none mt-4">{candidates.length}</div>
        <div className="text-[11px] text-[#cac1f2] mt-1">candidates in play</div>
        <div className="text-[28px] font-semibold mt-5">{average(candidates.map(c => c.emiScore))}</div>
        <div className="text-[11px] text-[#cac1f2]">average EMI</div>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-3">
        {PIPELINE_STAGES.map(stage => {
          const n = countStage(candidates, stage);
          return (
            <div key={stage} className="flex items-center gap-3 text-[11px]">
              <span className="w-[76px] text-[#cac1f2]">{stage}</span>
              <div className="flex-1 h-4 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded" style={{ width: `${(n / max) * 100}%`, minWidth: n ? 6 : 0, background: 'linear-gradient(90deg,#7c6cf0,#4d3ee0)' }} />
              </div>
              <span className="w-4 text-right font-semibold">{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SlideSpotlight({ candidates }: TemplateContext) {
  const c = pick(candidates, 0);
  const d = c ? ed(c) : {};
  return (
    <div className="w-full h-full text-white flex" style={{ background: S_BG }}>
      <div className="w-[190px] shrink-0 relative">
        <Photo c={c} tone="dark" className="w-full h-full text-[40px]" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(15,23,42,0) 60%,#141a3c 100%)' }} />
      </div>
      <div className="flex-1 p-7">
        <div className="text-[10px] font-semibold tracking-[0.2em] text-[#cac1f2]">CANDIDATE SPOTLIGHT</div>
        <div className="text-[24px] font-semibold mt-2 leading-tight">{c ? fullName(c) : ''}</div>
        <div className="text-[11px] text-[#cac1f2]">{c?.role} · {c?.company}</div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {[
            ['EMI score', String(c?.emiScore ?? '—')],
            ['Stage', c?.projectStatus ?? '—'],
            ['Education', d.education ?? '—'],
            ['Compensation', d.currentCompensation ?? '—'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="text-[8px] uppercase tracking-wider text-[#cac1f2]">{k}</div>
              <div className="text-[12px] font-semibold mt-0.5 truncate">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideRecommend({ candidates }: TemplateContext) {
  const top = [...candidates].sort((a, b) => b.emiScore - a.emiScore).slice(0, 3);
  return (
    <div className="w-full h-full text-white p-8" style={{ background: S_BG }}>
      <div className="text-[10px] font-semibold tracking-[0.2em] text-[#cac1f2]">RECOMMENDATION</div>
      <div className="text-[22px] font-semibold mt-1">Top candidates to advance</div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        {top.map((c, i) => (
          <div key={c.id} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#cac1f2]">#{i + 1}</span>
              <span className="text-[16px] font-semibold">{c.emiScore}</span>
            </div>
            <Photo c={c} tone="dark" className="w-10 h-10 rounded-full mt-2 text-[11px]" />
            <div className="text-[11.5px] font-semibold mt-2 leading-tight">{fullName(c)}</div>
            <div className="text-[9px] text-[#cac1f2] mt-0.5 truncate">{c.role}</div>
            <div className="text-[9px] text-[#cac1f2] truncate">{c.company}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Registry                                                            */
/* ================================================================== */

const LETTER = { w: 420, h: 572 };

export const SEARCH_BOOK_TEMPLATES: SearchBookTemplate[] = [
  {
    id: 'classic',
    name: 'Classic Executive Search Report',
    description:
      'A traditional search report: photo cover, recruitment activity funnel with KSFs, candidate profiles with interviewer feedback, and slate status.',
    badge: 'Classic',
    size: LETTER,
    thumbnailPage: 1,
    pages: [
      { id: 'cover', label: 'Cover', render: ctx => <ClassicCover {...ctx} /> },
      { id: 'activity', label: 'Recruitment activity', render: ctx => <ClassicActivity {...ctx} /> },
      { id: 'profile', label: 'Candidate profile', render: ctx => <ClassicProfile {...ctx} /> },
      { id: 'slate', label: 'Slate status', render: ctx => <ClassicSlate {...ctx} /> },
    ],
  },
  {
    id: 'dark',
    name: 'Dark Executive Review',
    description:
      'A dark, mobile-first report with pipeline funnel, candidate hero, mobility index, push and pull analysis, and reviewer actions.',
    badge: 'Dark',
    size: { w: 390, h: 760 },
    thumbnailPage: 0,
    pages: [
      { id: 'overview', label: 'Overview', render: ctx => DarkOverview(ctx) },
      { id: 'profile', label: 'Candidate', render: ctx => DarkProfile(ctx) },
      { id: 'insights', label: 'Insights', render: ctx => DarkInsights(ctx) },
      { id: 'assessment', label: 'Assessment', render: ctx => DarkAssessment(ctx) },
    ],
  },
  {
    id: 'dossier',
    name: 'Modern Dossier',
    description: 'A bright, editorial dossier with an indigo cover, slate dashboard, and rich candidate pages with score rings.',
    badge: 'Modern',
    size: LETTER,
    thumbnailPage: 1,
    pages: [
      { id: 'cover', label: 'Cover', render: ctx => <ModernCover {...ctx} /> },
      { id: 'slate', label: 'Slate', render: ctx => <ModernSlate {...ctx} /> },
      { id: 'dossier', label: 'Dossier', render: ctx => <ModernDossier {...ctx} /> },
    ],
  },
  {
    id: 'brief',
    name: 'Executive Brief',
    description: 'A concise board-ready summary: ranked candidate table and a pipeline snapshot with key figures.',
    size: LETTER,
    thumbnailPage: 1,
    pages: [
      { id: 'cover', label: 'Cover', render: ctx => <BriefCover {...ctx} /> },
      { id: 'table', label: 'Ranked summary', render: ctx => <BriefTable {...ctx} /> },
      { id: 'pipeline', label: 'Pipeline', render: ctx => <BriefPipeline {...ctx} /> },
    ],
  },
  {
    id: 'profiles',
    name: 'Candidate Profile Pack',
    description: 'One full profile page per candidate with scores, career trajectory, education, and availability.',
    size: LETTER,
    thumbnailPage: 1,
    pages: [
      { id: 'cover', label: 'Cover', render: ctx => <BriefCover {...ctx} /> },
      { id: 'p1', label: 'Profile 1', render: ctx => <ProfilePack {...ctx} index={0} /> },
      { id: 'p2', label: 'Profile 2', render: ctx => <ProfilePack {...ctx} index={1} /> },
    ],
  },
  {
    id: 'comparison',
    name: 'Side-by-Side Comparison',
    description: 'A comparison matrix across key fields plus grouped score bars for up to four candidates.',
    size: LETTER,
    thumbnailPage: 1,
    pages: [
      { id: 'cover', label: 'Cover', render: ctx => <CompareCover {...ctx} /> },
      { id: 'matrix', label: 'Matrix', render: ctx => <CompareMatrix {...ctx} /> },
      { id: 'scores', label: 'Scores', render: ctx => <CompareScores {...ctx} /> },
    ],
  },
  {
    id: 'deck',
    name: 'Board Slate Deck',
    description: 'Presentation-style 16:9 slides: title, pipeline, candidate spotlight, and recommendation.',
    badge: 'Slides',
    size: { w: 640, h: 360 },
    thumbnailPage: 1,
    pages: [
      { id: 'title', label: 'Title', render: ctx => <SlideTitle {...ctx} /> },
      { id: 'pipeline', label: 'Pipeline', render: ctx => <SlidePipeline {...ctx} /> },
      { id: 'spotlight', label: 'Spotlight', render: ctx => <SlideSpotlight {...ctx} /> },
      { id: 'recommend', label: 'Recommendation', render: ctx => <SlideRecommend {...ctx} /> },
    ],
  },
];
