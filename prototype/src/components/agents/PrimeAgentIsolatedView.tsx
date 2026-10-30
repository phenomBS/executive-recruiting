import React, { useState } from 'react';
import { 
  Sparkles, 
  Settings, 
  Play, 
  Pause, 
  Sliders, 
  MessageSquare, 
  ShieldAlert, 
  User, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Volume2, 
  Lock, 
  AlertTriangle,
  Mail,
  Send,
  Eye,
  Check,
  Briefcase,
  Layers,
  Building2,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useAgentConfig } from '../../context/AgentConfigContext';
import { useRestricted } from '../../context/RestrictedContext';
import { cn } from '../../lib/utils';

export function PrimeAgentIsolatedView() {
  const { primeConfig, updatePrimeConfig, openConfigModal, telemetry } = useAgentConfig();
  const { restrictedCompanies } = useRestricted();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');
  const [previewTemplateType, setPreviewTemplateType] = useState<'blind_teaser' | 'named_search' | 'board_mandate'>('blind_teaser');

  const primeTelemetry = telemetry.filter(t => t.agentId === 'prime');

  const activeProjects = [
    {
      id: 'proj-1',
      title: 'VP Engineering - NextGen AI Systems',
      company: 'Enterprise Systems Corp',
      status: 'Active Search',
      slaDaysRemaining: 9,
      calibratedCount: 8,
      shortlistedCount: 4,
      targetCompensation: '$650K - $850K Base + Carry',
      scope: 'Leading 300+ systems engineers across distributed clusters',
      benchmarkCandidate: 'Tier 1 Enterprise Systems EVP/VP',
    },
    {
      id: 'proj-2',
      title: 'Chief Revenue Officer (CRO)',
      company: 'CloudScale SaaS',
      status: 'Active Search',
      slaDaysRemaining: 12,
      calibratedCount: 6,
      shortlistedCount: 3,
      targetCompensation: '$700K OTE + Equity',
      scope: 'Global Go-to-Market, $120M ARR acceleration',
      benchmarkCandidate: 'Proven Enterprise B2B SaaS CRO',
    },
    {
      id: 'proj-3',
      title: 'SVP Global Hardware & Operations',
      company: 'Robotics Dynamics',
      status: 'Calibrating Slate',
      slaDaysRemaining: 15,
      calibratedCount: 5,
      shortlistedCount: 2,
      targetCompensation: '$600K - $750K + RSUs',
      scope: 'Overseeing global supply chain and tier-1 fabrication',
      benchmarkCandidate: 'Semiconductor / Hardware Ops Leader',
    },
  ];

  const selectedProject = activeProjects.find(p => p.id === selectedProjectId) || activeProjects[0];

  return (
    <div className="space-y-8">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-blue-900/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-extrabold tracking-tight">Prime Agent</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Executive Search Project Agent
                  </span>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
                    primeConfig.status === 'active' ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  )}>
                    {primeConfig.status}
                  </span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                  Autonomous project delivery for active executive searches: project-level brand voice, candidate calibration, outreach protocols, and client off-limits governance.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => updatePrimeConfig({ status: primeConfig.status === 'active' ? 'paused' : 'active' })}
              className={cn(
                "px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all",
                primeConfig.status === 'active' 
                  ? "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800" 
                  : "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700"
              )}
            >
              {primeConfig.status === 'active' ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause Prime
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Resume Prime
                </>
              )}
            </button>

            <button
              onClick={() => openConfigModal('prime')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-sm transition-all"
            >
              <Sliders className="w-4 h-4" /> Adjust Voice & Rules
            </button>
          </div>
        </div>

        {/* Global Search Rules Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-900/60 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Global Search Voice Archetype</span>
            <span className="font-bold text-white mt-0.5 block">
              {primeConfig.projectVoice?.archetype || 'Executive Search Partner'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Tone Formality & Directness</span>
            <span className="font-bold text-blue-300 mt-0.5 block">
              Formality: {primeConfig.projectVoice?.toneFormality || 4}/5 · Directness: {primeConfig.projectVoice?.toneDirectness || 3}/5
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Candidate Calibration Gate</span>
            <span className="font-bold text-white mt-0.5 block">
              {primeConfig.projectRules?.minCalibrationScore || 80}%+ Match Required
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Search Project Governance</span>
            <span className="font-bold text-emerald-400 mt-0.5 block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Client Off-Limits Enforced
            </span>
          </div>
        </div>
      </div>

      {/* SECTION: High-Level Voice & Rules Governance Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Executive Search Project Voice & Rules</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded">
                Global Project Level
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Defines the executive search tone, confidentiality protocols, and recruiter approval gates across all active search assignments.
            </p>
          </div>

          <button
            onClick={() => openConfigModal('prime')}
            className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Sliders className="w-3.5 h-3.5" /> Adjust Voice & Rules
          </button>
        </div>

        {/* 3 Governance Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
              Institutional Gravitas & Tone
            </span>
            <p className="text-slate-600 leading-relaxed">
              Prime Agent represents your search projects with peer-level executive authority. Prohibits transactional buzzwords like "urgent opening" or "rockstar", focusing on strategic corporate mandates.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['No Transactional Pitch', 'Peer-to-Peer Gravitas', 'Concise Executive Memo'].map(t => (
                <span key={t} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-600">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
              Confidentiality & Teaser Protocol
            </span>
            <p className="text-slate-600 leading-relaxed">
              Configurable blind teaser disclosure: maintains client anonymity during initial executive headhunt until mutual NDA or partner calibration is cleared.
            </p>
            <div className="text-[11px] font-semibold text-blue-700 pt-1">
              Current: {primeConfig.projectVoice?.confidentialityProtocol || 'Strictly Confidential Blind Teaser'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
              C-Suite Review & Off-Limits Gates
            </span>
            <p className="text-slate-600 leading-relaxed">
              Mandatory partner sign-off for C-Suite candidates. Strict automated suppression for candidates currently employed at client off-limits companies (e.g. Meta, Alphabet).
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 pt-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
              100% Policy Enforced Across Projects
            </div>
          </div>
        </div>

        {/* Live Retained Search Mandate Preview (Dissociated from Sarah Sandberg) */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-800">
                High-Level Search Mandate Outreach Preview (Autonomous Project Voice)
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[11px]">Protocol:</span>
              <div className="bg-white border border-slate-200 rounded-lg p-0.5 flex text-[11px]">
                <button
                  onClick={() => setPreviewTemplateType('blind_teaser')}
                  className={cn(
                    "px-2.5 py-1 rounded-md font-medium transition-colors",
                    previewTemplateType === 'blind_teaser' ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Blind Teaser
                </button>
                <button
                  onClick={() => setPreviewTemplateType('named_search')}
                  className={cn(
                    "px-2.5 py-1 rounded-md font-medium transition-colors",
                    previewTemplateType === 'named_search' ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Named Retained
                </button>
                <button
                  onClick={() => setPreviewTemplateType('board_mandate')}
                  className={cn(
                    "px-2.5 py-1 rounded-md font-medium transition-colors",
                    previewTemplateType === 'board_mandate' ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Board Mandate
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 text-xs text-slate-800 leading-relaxed space-y-3 font-sans max-w-3xl">
            <p className="text-slate-500 font-mono text-[11px]">
              Subject: Private Briefing // Confidential Executive Search Mandate: {selectedProject.title}
            </p>
            <p>Dear <span className="bg-blue-50 text-blue-700 px-1 py-0.5 rounded font-mono font-semibold">[Executive First Name]</span>,</p>
            
            {previewTemplateType === 'blind_teaser' && (
              <>
                <p>
                  I hope this note finds you well. I am reaching out discreetly regarding a confidential, board-authorized executive search our firm is conducting for a <strong>{selectedProject.title}</strong> at a high-growth enterprise technology leader backed by premier institutional capital.
                </p>
                <p>
                  In calibrating the market for executives who have navigated {selectedProject.scope}, your professional trajectory and leadership scale were highlighted by our search practice. The scope encompasses executive oversight of strategic engineering architecture with total compensation structured around {selectedProject.targetCompensation}.
                </p>
                <p>
                  This initiative is held in the strictest professional confidence. No formal CV or active application is required—we would simply welcome a discreet, confidential introductory discussion to determine mutual alignment.
                </p>
              </>
            )}

            {previewTemplateType === 'named_search' && (
              <>
                <p>
                  I am writing on behalf of the Board of Directors at <strong>{selectedProject.company}</strong> regarding the retained search mandate for their next <strong>{selectedProject.title}</strong>.
                </p>
                <p>
                  Given {selectedProject.company}'s capital deployment and your proven background steering enterprise transformation, our search committee identified your profile as uniquely suited to spearhead their next phase of expansion.
                </p>
                <p>
                  I would welcome an exploratory conversation at your convenience to share the comprehensive role prospectus and strategic roadmap.
                </p>
              </>
            )}

            {previewTemplateType === 'board_mandate' && (
              <>
                <p>
                  Our executive search practice has been retained by the Governance & Search Committee to lead the appointment of a <strong>{selectedProject.title}</strong>.
                </p>
                <p>
                  Given your executive tenure as a recognized leader in enterprise systems, the committee asked that we reach out directly to explore whether this mandate aligns with your long-term career horizons.
                </p>
                <p>
                  We are conducting preliminary partner conversations over the next ten days and would be glad to coordinate a private briefing.
                </p>
              </>
            )}

            <div className="pt-2 border-t border-slate-100 text-slate-600">
              Best regards,<br />
              <span className="font-bold text-slate-800">
                {primeConfig.projectVoice?.signatureFormat || 'Managing Director, Executive Search Practice'}
              </span><br />
              <span className="text-slate-400 text-[11px]">Phenom Executive Search Practice · Confidential & Privileged</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Active Executive Search Projects Pipeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Search Projects Delivered by Prime Agent</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live requisition calibration, candidate pipeline progression, and SLA delivery tracking.
            </p>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full">
            3 Active Mandates
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeProjects.map(proj => (
            <div
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-3",
                selectedProjectId === proj.id 
                  ? "border-blue-600 bg-blue-50/20 shadow-xs ring-1 ring-blue-600/30" 
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{proj.title}</h3>
                  <span className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-400" /> {proj.company}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  {proj.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Calibrated Slate</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{proj.calibratedCount} Executives</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">SLA Window</span>
                  <span className="font-bold text-blue-700 text-sm mt-0.5 block">{proj.slaDaysRemaining}d remaining</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <strong>Benchmark:</strong> {proj.benchmarkCandidate}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: Recent Prime Agent Project Telemetry Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Prime Agent Search Project Execution Log</h3>
          </div>
          <span className="text-xs text-slate-400">Autonomous search actions</span>
        </div>

        <div className="divide-y divide-slate-100">
          {primeTelemetry.slice(0, 5).map(item => (
            <div key={item.id} className="py-3.5 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{item.title}</span>
                  {item.targetCompany && (
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {item.targetCompany}
                    </span>
                  )}
                  {item.severity === 'blocked' && (
                    <span className="text-[10px] font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Blocked
                    </span>
                  )}
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{item.details}</p>
              </div>
              <span className="text-slate-400 text-[11px] whitespace-nowrap shrink-0">{item.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
