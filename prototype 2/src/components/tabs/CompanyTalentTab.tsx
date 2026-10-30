import React from 'react';
import { Company } from '../../types';
import { mockExecutives } from '../../data/mockData';
import { Filter, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export function CompanyTalentTab({ company }: { company: Company }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center bg-slate-50 justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search talent..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-white">
            <option>Level: All</option>
            <option>C-Suite</option>
            <option>EVP</option>
            <option>SVP</option>
            <option>VP</option>
          </select>
          <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-white">
            <option>Function: All</option>
            <option>Engineering</option>
            <option>Finance</option>
            <option>Operations</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" /> More Filters
          </button>
        </div>
        <div className="flex bg-slate-200 p-0.5 rounded-lg">
          <button className="px-4 py-1.5 bg-white text-slate-800 text-sm font-semibold rounded-md shadow-sm">Current</button>
          <button className="px-4 py-1.5 text-slate-600 hover:text-slate-800 text-sm font-semibold rounded-md transition-colors">Former</button>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 z-10 border-b border-slate-200 shadow-sm">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Current Title</th>
              <th className="px-6 py-4">Function</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-center">Tenure</th>
              <th className="px-6 py-4">CRM Status</th>
              <th className="px-6 py-4">Relationship</th>
              <th className="px-6 py-4 text-right">Readiness Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockExecutives.map(exec => (
              <tr key={exec.id} className="hover:bg-slate-50 cursor-pointer transition-colors group">
                <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-blue-600">{exec.name}</td>
                <td className="px-6 py-4 text-slate-700">{exec.title}</td>
                <td className="px-6 py-4 text-slate-600">{exec.function}</td>
                <td className="px-6 py-4 text-slate-600">{exec.location}</td>
                <td className="px-6 py-4 text-slate-600 text-center">{exec.tenure}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-md",
                    exec.crmStatus === 'Active' ? "bg-emerald-50 text-emerald-700" :
                    exec.crmStatus === 'Passive' ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"
                  )}>{exec.crmStatus}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-md",
                    exec.relationshipStatus === 'Strong' ? "bg-emerald-50 text-emerald-700" :
                    exec.relationshipStatus === 'Moderate' ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                  )}>{exec.relationshipStatus}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full", exec.readinessScore > 70 ? "bg-emerald-500" : exec.readinessScore > 40 ? "bg-amber-500" : "bg-slate-300")} 
                        style={{ width: `${exec.readinessScore}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-700 w-8">{exec.readinessScore}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
