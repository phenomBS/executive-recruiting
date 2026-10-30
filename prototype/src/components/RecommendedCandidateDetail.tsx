import React from 'react';
import { RecommendedCandidate } from '../types';
import { 
  Sparkles, 
  UserPlus, 
  Check, 
  Building, 
  MapPin, 
  Mail, 
  Phone, 
  Linkedin, 
  GraduationCap, 
  Briefcase, 
  Globe, 
  TrendingUp, 
  Compass, 
  CheckCircle2, 
  BrainCircuit, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import * as Avatar from '@radix-ui/react-avatar';
import { cn } from '../lib/utils';

interface RecommendedCandidateDetailProps {
  candidate: RecommendedCandidate;
  onAddToCrm?: () => void;
}

export function RecommendedCandidateDetail({ candidate, onAddToCrm }: RecommendedCandidateDetailProps) {
  const isAdded = candidate.addedToCrm;
  const execData = candidate.executiveData;

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Aura Recommendation Alert Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-purple-200">
            <Sparkles className="w-5 h-5 fill-purple-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-200/80 px-2 py-0.5 rounded">
                Aura Agent Recommendation
              </span>
              <span className="text-xs text-purple-700 font-medium">
                Autonomous Executive Sourcing Signal
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800 mt-1">
              {candidate.recommendationReason}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
          {isAdded ? (
            <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 w-full md:w-auto">
              <Check className="w-4 h-4 stroke-[3]" /> Added to CRM
            </span>
          ) : (
            <button 
              onClick={onAddToCrm}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all w-full md:w-auto hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" /> Add to CRM
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Header Card (Baseline facts only, NO score circular meters) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Avatar.Root className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100 shadow-inner flex items-center justify-center">
            <Avatar.Image
              src={candidate.avatarUrl}
              className="w-full h-full object-cover"
            />
            <Avatar.Fallback className="text-2xl font-bold text-purple-700 bg-purple-50 w-full h-full flex items-center justify-center">
              {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
            </Avatar.Fallback>
          </Avatar.Root>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                {candidate.firstName} {candidate.lastName}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-600" /> Executive Candidate
              </span>
            </div>

            <div className="text-base text-slate-700 font-semibold mt-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{candidate.role}</span>
              <span className="text-slate-300">•</span>
              <span className="text-(--color-secondary-200) font-bold">{candidate.company}</span>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 mt-3 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {candidate.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" /> {execData?.companySizeExperience || '5,000+ employees'}
              </span>
              <span className="flex items-center gap-1.5 text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded">
                <TrendingUp className="w-3.5 h-3.5" /> Mobility: {execData?.mobilityIndicator || 'High'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Baseline Actions & Contact */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            {candidate.linkedinUrl && (
              <a 
                href={candidate.linkedinUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" /> LinkedIn
              </a>
            )}
            <a 
              href={`mailto:${candidate.email}`} 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500" /> {candidate.email.split('@')[0]}@...
            </a>
          </div>

          <div className="text-[11px] text-slate-400 text-right">
            Discovered via Aura Agent Executive Radar
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recommendation Details & Baseline Data */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Card 1: Why This Executive Is Recommended */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">Why Aura Agent Recommends This Candidate</h3>
            </div>

            <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800">Recommendation Rationale</span>
              <p className="text-sm font-medium text-slate-800 mt-1 leading-relaxed">
                "{candidate.recommendationReason}"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-purple-600" /> Executive Archetype
                </span>
                <span className="text-sm font-bold text-slate-900 mt-1">
                  {execData?.executiveArchetype || 'Executive Leader'}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Target profile calibrated for fast-scaling enterprise tech
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Likely Next Step
                </span>
                <span className="text-sm font-bold text-slate-900 mt-1">
                  {execData?.likelyNextRole || 'C-Suite / SVP Elevation'}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Ready for step-up responsibility
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Tenure Inflection
                </span>
                <span className="text-sm font-bold text-slate-900 mt-1">
                  {execData?.currentCompanyTenure} at {candidate.company}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  {execData?.currentRoleTenure} in current role ({execData?.careerVelocity} velocity)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Public / Scale Experience
                </span>
                <span className="text-sm font-bold text-slate-900 mt-1">
                  {execData?.publicCompanyExperience === 'Yes' ? 'Public Enterprise Pedigree' : 'High-Growth Tech Scale'}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Board exposure: {execData?.boardExperience || 'Industry Advisory'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Baseline Executive Facts & Pedigree (No recruiter notes or internal job logs) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <Building className="w-5 h-5 text-slate-600" />
              <h3 className="text-base font-bold text-slate-900">Baseline Executive Background</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Function / Domain</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{execData?.function || 'Engineering & Product'}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Executive Level</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{execData?.executiveLevel || 'VP / C-Suite'}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Industry</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{execData?.industryExperience || 'Enterprise SaaS / AI'}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Company Size Scale</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{execData?.companySizeExperience || '5,000+ employees'}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Relocation</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{execData?.relocationWillingness || 'Open'}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Notice Period</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{execData?.noticePeriod || '2 months'}</span>
              </div>
            </div>

            {/* Education */}
            {execData?.education && (
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Education & Credentials</span>
                  <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{execData.education}</span>
                </div>
              </div>
            )}

            {/* Core Areas of Expertise */}
            {execData?.areasOfExpertise && (
              <div className="mt-5 pt-5 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Core Functional Expertise
                </span>
                <div className="flex flex-wrap gap-2">
                  {execData.areasOfExpertise.split(',').map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Recruiter Action Panel */}
        <div className="flex flex-col gap-6">
          {/* Action Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recruiter Evaluation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              This executive has been surfaced by autonomous talent monitoring. Recruiter notes, internal job pipelines, and assessment batteries will unlock once added to your active CRM.
            </p>

            <div className="pt-2">
              {isAdded ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <span className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> In Your Candidate CRM
                  </span>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Available in All Candidates for pipeline assignment and outreach.
                  </p>
                </div>
              ) : (
                <button 
                  onClick={onAddToCrm}
                  className="w-full py-3 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Add Executive to CRM
                </button>
              )}
            </div>
          </div>

          {/* Sourcing Channel Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Autonomous Sourcing Context</span>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Sourcing Agent:</span>
                <span className="font-semibold text-purple-700">Aura Agent</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Signal Date:</span>
                <span className="font-semibold text-slate-700">{candidate.lastContactDate || 'Recent'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Search Strategy:</span>
                <span className="font-semibold text-slate-700">Mobility Inflection Monitor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
