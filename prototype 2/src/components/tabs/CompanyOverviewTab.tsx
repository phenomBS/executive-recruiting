import React from 'react';
import { Company } from '../../types';
import { Sparkles, TrendingUp, Target, Briefcase, Zap, GitCommit } from 'lucide-react';

export function CompanyOverviewTab({ company }: { company: Company }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col gap-8">
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">About {company.name}</h2>
          <p className="text-slate-700 leading-relaxed text-sm">
            {company.description}
          </p>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Strategic Intelligence</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-slate-800">Growth Indicators</h3>
              </div>
              <ul className="space-y-2">
                {company.growthIndicators.map((indicator, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <span>{indicator}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800">Strategic Initiatives</h3>
              </div>
              <ul className="space-y-2">
                {company.strategicInitiatives.map((init, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <span>{init}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GitCommit className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-slate-800">Recent Acquisitions</h3>
              </div>
              <ul className="space-y-2">
                {company.recentAcquisitions.map((acq, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <span>{acq}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-slate-800">Active Executive Openings</h3>
              </div>
              <ul className="space-y-2">
                {company.activeOpenings.map((open, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <span>{open}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-md relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
             <Sparkles className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Zap className="w-5 h-5 text-blue-300" />
            </div>
            <h2 className="text-lg font-bold text-white">AI Insights</h2>
          </div>
          <div className="space-y-4 relative z-10">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 backdrop-blur-sm">
               <p className="text-sm text-slate-200">3 senior executives have changed roles in the last 12 months, signaling organizational restructuring.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 backdrop-blur-sm">
               <p className="text-sm text-slate-200">Two executives may be potential successors for the CFO role based on recent tenure and operational scope expansion.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 backdrop-blur-sm">
               <p className="text-sm text-slate-200">This company is a strong talent source for your current CFO search due to compensation parity and market performance.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-4">Talent Snapshot</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-sm text-slate-500">Total Executives</span>
                 <span className="font-bold text-slate-900">{company.executivesCount}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm text-slate-500">Relevant Candidates</span>
                 <span className="font-bold text-slate-900">{company.relevantCandidatesCount}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm text-slate-500">Already in CRM</span>
                 <span className="font-bold text-slate-900">{company.crmCandidatesCount}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm text-slate-500">Leadership Changes</span>
                 <span className="font-bold text-amber-600">{company.activeLeadershipChanges}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
