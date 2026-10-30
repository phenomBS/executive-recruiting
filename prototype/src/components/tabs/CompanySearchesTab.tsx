import React from 'react';
import { Company } from '../../types';
import { mockSearches } from '../../data/mockData';
import { Briefcase, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export function CompanySearchesTab({ company }: { company: Company }) {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Associated Executive Searches</h2>
          <p className="text-sm text-slate-500 mt-1">Active and historical searches referencing {company.name}</p>
        </div>
        <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
          Link to Search
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {mockSearches.map(search => (
          <div key={search.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{search.title}</h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-md",
                    search.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  )}>{search.status}</span>
                  <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    Role: <span className="text-slate-800 font-bold">{search.role}</span>
                  </span>
                  <span className="text-sm text-slate-500">{search.candidatesIdentified} candidates identified from {company.name}</span>
                </div>
              </div>
            </div>
            <div className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
