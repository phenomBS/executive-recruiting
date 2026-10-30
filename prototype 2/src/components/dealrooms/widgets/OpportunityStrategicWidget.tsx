import React from 'react';
import { 
  Building2, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Globe, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface OpportunityStrategicWidgetProps {
  targetRole: string;
  department: string;
  companyName?: string;
  isRecruiterPreview?: boolean;
}

export function OpportunityStrategicWidget({
  targetRole,
  department,
  companyName = 'Phenom Inc.',
  isRecruiterPreview = false
}: OpportunityStrategicWidgetProps) {
  const pillars = [
    {
      title: 'Global Enterprise Scale',
      desc: 'Orchestrating platform growth across 1,200+ enterprise customers with 99.98% SLA reliability.',
      metric: '$340M+ ARR',
      badge: 'Current Run Rate'
    },
    {
      title: 'Autonomous AI Architecture',
      desc: 'Deploying multi-agent reasoning graphs that automate mission-critical talent workflows at Fortune 500 scale.',
      metric: '4.8M Interactions/Day',
      badge: 'Core Engine'
    },
    {
      title: 'Board Capital & Runway',
      desc: 'Fully capitalized with tier-one venture syndicates; sovereign governance structure preparing for IPO readiness.',
      metric: '$12.0B Valuation',
      badge: 'Recent Round'
    }
  ];

  const strategicMandates = [
    'Direct P&L and organizational leadership over 140+ world-class engineers, product strategists, and researchers.',
    'Reporting directly to the Chief Executive Officer with quarterly presentations to the Board of Directors Audit & Compensation committees.',
    'Full discretion over annual discretionary capital deployment budget exceeding $48M.',
    'Architecting the flagship multi-tenant infrastructure to expand into EMEA and APAC defense and healthcare compliance boundaries.'
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0 shadow-2xs">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                The Executive Mandate & Strategic Context
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800">
                Confidential Brief
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Role: <strong className="text-slate-800">{targetRole}</strong> · Division: <strong className="text-slate-800">{department}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 self-start sm:self-auto shadow-2xs">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Strategic Alignment Index: 98%</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Executive Summary Narrative */}
        <div className="prose max-w-none text-slate-700 text-sm leading-relaxed">
          <p>
            As our <strong className="text-slate-900">{targetRole}</strong>, you will assume operational and technical ownership over the highest-impact inflection vector within {companyName}. With the enterprise AI ecosystem transitioning from speculative prototypes to mission-critical infrastructure, our leadership team requires an executive capable of uniting engineering rigor with board-level commercial execution.
          </p>
        </div>

        {/* 3 Pillars of Scale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillars.map((p, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                  {p.badge}
                </span>
                <span className="text-xs font-extrabold text-slate-900">
                  {p.metric}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                {p.title}
              </h4>
              <p className="text-xs text-slate-600 leading-normal">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Strategic Mandates & Scope of Authority */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Charter & Scope of Executive Authority
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {strategicMandates.map((m, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reporting Chain & Peer Governance */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-purple-50/50 border border-purple-200/80 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
              L1
            </div>
            <div>
              <span className="font-bold text-purple-950 block">Direct C-Suite Reporting Line</span>
              <span className="text-purple-800">Reports directly to Chief Executive Officer with Board visibility</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-purple-900 font-bold">
            <span>Primary Office: Executive Floor / Hybrid Flexibility</span>
          </div>
        </div>
      </div>
    </div>
  );
}
