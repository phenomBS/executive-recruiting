import React from 'react';
import { Company } from '../../types';
import { mockExecutives } from '../../data/mockData';
import { User, MapPin, Clock, Building, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

export function CompanyExecutiveTeamTab({ company }: { company: Company }) {
  const ceo = mockExecutives.find(e => e.title === 'Chief Executive Officer');
  const directReports = mockExecutives.filter(e => e.reportsTo === ceo?.id);

  const ExecutiveCard = ({ exec, isCeo = false }: { exec: any, isCeo?: boolean }) => (
    <a href={`?view=candidates&candidateId=${exec.id}`} target="_blank" rel="noopener noreferrer" className={cn(
      "bg-white border rounded-xl p-4 shadow-sm relative transition-all hover:shadow-md cursor-pointer group block",
      isCeo ? "border-blue-600 border-2 w-[340px]" : "border-slate-200 w-[300px]"
    )}>
      {exec.relationshipStatus === 'Strong' && (
        <div className="absolute -top-3 -right-3 bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm z-10">
          <ShieldAlert className="w-3 h-3" /> Strong Tie
        </div>
      )}
      <div className="flex gap-4 items-start">
        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
          <User className="w-6 h-6 text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 group-hover:text-blue-600 truncate">{exec.name}</h4>
          <p className="text-sm font-medium text-slate-600 mb-2 truncate">{exec.title}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5" /> {exec.location}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" /> {exec.tenure}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
              <Building className="w-3.5 h-3.5 shrink-0" /> Prev: {exec.previousCompany}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">EMI Score</span>
              <span className={cn(
                "text-sm font-bold",
                exec.emiScore >= 80 ? "text-emerald-600" :
                exec.emiScore >= 60 ? "text-amber-600" : "text-slate-600"
              )}>{exec.emiScore}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Open Jobs Fit</span>
              <span className={cn(
                "text-sm font-bold",
                exec.openJobsFit > 0 ? "text-blue-600" : "text-slate-500"
              )}>{exec.openJobsFit} {exec.openJobsFit === 1 ? 'Job' : 'Jobs'}</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );

  return (
    <div className="flex flex-col items-center py-8">
      {ceo && (
        <div className="flex flex-col items-center">
          <ExecutiveCard exec={ceo} isCeo={true} />
          <div className="w-px h-12 bg-slate-300"></div>
          
          <div className="relative flex justify-center w-full mt-[-1px]">
            {directReports.length > 1 && (
              <div className="absolute top-0 h-px bg-slate-300" style={{ 
                width: `calc(100% - ${100 / directReports.length}%)` 
              }}></div>
            )}
            
            <div className="flex justify-center gap-8 px-4 relative z-10 w-full">
              {directReports.map((report, i) => (
                <div key={report.id} className="flex flex-col items-center relative">
                  <div className="w-px h-12 bg-slate-300"></div>
                  <ExecutiveCard exec={report} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
