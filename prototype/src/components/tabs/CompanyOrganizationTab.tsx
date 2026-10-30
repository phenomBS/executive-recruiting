import React from 'react';
import { Company } from '../../types';
import { Network, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export function CompanyOrganizationTab({ company }: { company: Company }) {
  const OrgNode = ({ name, title, level, isRoot = false }: { name: string, title: string, level: string, isRoot?: boolean }) => (
    <div className={cn(
      "bg-white border rounded-xl p-4 shadow-sm w-[260px] relative z-10",
      isRoot ? "border-blue-600 border-2" : "border-slate-200 hover:border-blue-300 transition-colors"
    )}>
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm truncate">{name}</h4>
          <p className="text-xs font-medium text-slate-600 truncate">{title}</p>
        </div>
      </div>
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
        {level}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center py-12 relative">
      <div className="absolute top-0 right-0 flex items-center gap-2 mb-8 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm">
        <Network className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-semibold text-slate-700">Filter by Function</span>
      </div>

      <div className="flex flex-col items-center">
        <OrgNode name="Jensen Huang" title="Chief Executive Officer" level="C-Suite" isRoot />
        
        <div className="w-px h-8 bg-slate-300 relative z-0"></div>
        
        <div className="relative flex justify-center w-full mt-[-1px]">
          <div className="absolute top-0 h-px bg-slate-300" style={{ width: '80%' }}></div>
          
          <div className="flex justify-center gap-12 relative z-10 w-full px-12">
            
            {/* Branch 1 */}
            <div className="flex flex-col items-center">
              <div className="w-px h-8 bg-slate-300"></div>
              <OrgNode name="Colette Kress" title="Chief Financial Officer" level="C-Suite" />
              
              <div className="w-px h-8 bg-slate-300"></div>
              <div className="relative flex justify-center w-full mt-[-1px]">
                <div className="absolute top-0 h-px bg-slate-300" style={{ width: '50%' }}></div>
                <div className="flex justify-center gap-6 relative z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-8 bg-slate-300"></div>
                    <OrgNode name="Michael Johnson" title="SVP, Finance" level="SVP" />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-px h-8 bg-slate-300"></div>
                    <OrgNode name="Sarah Chen" title="SVP, Corporate Controller" level="SVP" />
                  </div>
                </div>
              </div>
            </div>

            {/* Branch 2 */}
            <div className="flex flex-col items-center">
              <div className="w-px h-8 bg-slate-300"></div>
              <OrgNode name="Debora Shoquist" title="EVP, Operations" level="EVP" />
              
              <div className="w-px h-8 bg-slate-300"></div>
              <div className="flex flex-col items-center">
                <OrgNode name="David Clark" title="VP, Supply Chain" level="VP" />
              </div>
            </div>

            {/* Branch 3 */}
            <div className="flex flex-col items-center">
              <div className="w-px h-8 bg-slate-300"></div>
              <OrgNode name="Timothy Teter" title="EVP, General Counsel" level="EVP" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

