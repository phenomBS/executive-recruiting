import React from 'react';
import { Company } from '../../types';
import { mockMarketActivity } from '../../data/mockData';
import { UserPlus, UserMinus, Building, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

export function CompanyMarketActivityTab({ company }: { company: Company }) {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-xl font-bold text-slate-900 mb-8">Executive & Market Intelligence Timeline</h2>
      
      <div className="relative border-l-2 border-slate-200 ml-6 space-y-12 pb-12">
        {mockMarketActivity.map((activity, index) => (
          <div key={activity.id} className="relative pl-8 group cursor-default">
            <div className={cn(
              "absolute -left-[21px] w-10 h-10 rounded-full border-4 border-(--bg-surface-base) flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
              activity.type === 'Appointment' ? "bg-emerald-100 text-emerald-600" :
              activity.type === 'Departure' ? "bg-amber-100 text-amber-600" :
              "bg-blue-100 text-blue-600"
            )}>
              {activity.type === 'Appointment' ? <UserPlus className="w-4 h-4" /> :
               activity.type === 'Departure' ? <UserMinus className="w-4 h-4" /> :
               <Building className="w-4 h-4" />}
            </div>
            
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  "text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider",
                  activity.type === 'Appointment' ? "bg-emerald-50 text-emerald-700" :
                  activity.type === 'Departure' ? "bg-amber-50 text-amber-700" :
                  "bg-blue-50 text-blue-700"
                )}>
                  {activity.type}
                </span>
                <span className="text-sm font-semibold text-slate-500">{activity.date}</span>
              </div>
              <p className="text-slate-800 text-base mt-3 leading-relaxed">{activity.description}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors">
                  View full brief <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
