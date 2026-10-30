import React from 'react';
import { RecommendedCompany } from '../types';
import { 
  Building2, 
  MapPin, 
  Users, 
  LineChart, 
  Globe, 
  Sparkles, 
  Check, 
  PlusCircle, 
  ArrowLeft, 
  TrendingUp, 
  CheckCircle2, 
  Compass, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { useRestricted } from '../context/RestrictedContext';
import { cn } from '../lib/utils';

interface RecommendedCompanyDetailProps {
  company: RecommendedCompany;
  onBack: () => void;
  onAddToCrm?: () => void;
}

export function RecommendedCompanyDetail({ company, onBack, onAddToCrm }: RecommendedCompanyDetailProps) {
  const isAdded = company.addedToCrm;
  const { restrictedCompanies } = useRestricted();
  const isRestricted = restrictedCompanies.some(rc => rc.name === company.name);

  return (
    <div className="flex flex-col h-full bg-(--bg-surface-base) overflow-y-auto w-full">
      {/* Top Header Navigation */}
      <div className="bg-white border-b border-slate-200 shrink-0 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto w-full px-8 py-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Companies
          </button>

          {/* Aura Agent Recommendation Alert Banner */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-purple-200">
                <Sparkles className="w-5 h-5 fill-purple-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-200/80 px-2 py-0.5 rounded">
                    Aura Agent Recommended Target
                  </span>
                  <span className="text-xs text-purple-700 font-medium">
                    High Mobility & Leadership Transition Signal
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {company.recommendationReason}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
              {isAdded ? (
                <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 w-full md:w-auto">
                  <Check className="w-4 h-4 stroke-[3]" /> In Your CRM
                </span>
              ) : (
                <button 
                  onClick={onAddToCrm}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all w-full md:w-auto hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4" /> Add Company to CRM
                </button>
              )}
            </div>
          </div>

          {/* Company Identity Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center shrink-0 shadow-inner">
                <Building2 className="w-10 h-10 text-purple-700" />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-bold text-slate-900">{company.name}</h1>
                  {isRestricted && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-md">
                      RESTRICTED
                    </span>
                  )}
                </div>
                
                {/* Baseline Details Only */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mt-2">
                  <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-slate-400"/> {company.industry}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400"/> {company.headquarters}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400"/> {company.size}</span>
                  <span className="flex items-center gap-1.5"><LineChart className="w-4 h-4 text-slate-400"/> {company.revenue}</span>
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-slate-400"/> {company.website}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Baseline Data + Agent Reasons (No internal jobs or recruiter notes) */}
      <div className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Strategic Rationale & Baseline Overview */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Why Recommended Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Why Aura Agent Recommends Targeting {company.name}</h3>
              </div>

              <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800">Mobility Opportunity</span>
                <p className="text-sm font-medium text-slate-800 mt-1 leading-relaxed">
                  "{company.recommendationReason}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-600" /> Growth & Market Shifts
                  </span>
                  <ul className="mt-2 flex flex-col gap-1.5 text-xs text-slate-700">
                    {company.growthIndicators?.map((g, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                        <span>{g}</span>
                      </li>
                    )) || <li>Rapid enterprise scaling across core lines of business.</li>}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-blue-600" /> Strategic Initiatives
                  </span>
                  <ul className="mt-2 flex flex-col gap-1.5 text-xs text-slate-700">
                    {company.strategicInitiatives?.map((init, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                        <span>{init}</span>
                      </li>
                    )) || <li>Platform infrastructure scaling and generative expansion.</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Baseline Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <Building2 className="w-5 h-5 text-slate-600" />
                <h3 className="text-base font-bold text-slate-900">Baseline Company Profile</h3>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {company.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100 text-xs">
                <div>
                  <span className="font-semibold text-slate-400 uppercase tracking-wider block">Headquarters</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{company.headquarters}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 uppercase tracking-wider block">Industry</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{company.industry}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 uppercase tracking-wider block">Size</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{company.size}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 uppercase tracking-wider block">Est. Revenue</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{company.revenue}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Recruiter Action Panel */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recruiter Evaluation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                This organization is surfaced as an active talent hunting ground. Internal searches, CRM associations, and organization mapping will unlock upon adding this company to your CRM.
              </p>

              <div className="pt-2">
                {isAdded ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <span className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> In Your Company CRM
                    </span>
                    <p className="text-[11px] text-emerald-700 mt-1">
                      Available in All Companies with full mapping tools enabled.
                    </p>
                  </div>
                ) : (
                  <button 
                    onClick={onAddToCrm}
                    className="w-full py-3 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Company to CRM
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500">Autonomous Talent Sourcing</span>
              <div className="flex justify-between">
                <span className="text-slate-500">Source:</span>
                <span className="font-semibold text-purple-700">Aura Agent Intelligence</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold text-slate-700">Recommended Target</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
