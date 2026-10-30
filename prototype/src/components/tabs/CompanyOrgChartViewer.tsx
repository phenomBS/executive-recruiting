import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Network, 
  ShieldAlert, 
  ChevronRight, 
  Sparkles, 
  Check, 
  ExternalLink,
  Flame,
  ArrowRight,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { MappedCompany, OrgNodeData, getCompanyOrgChart } from '../../data/projectMarketMapData';
import { useRouter } from '../../context/RouterContext';
import { cn } from '../../lib/utils';

interface CompanyOrgChartViewerProps {
  companies: MappedCompany[];
  initialSelectedCompanyId?: string;
  showAllMode?: boolean;
}

export function CompanyOrgChartViewer({ 
  companies, 
  initialSelectedCompanyId,
  showAllMode = false 
}: CompanyOrgChartViewerProps) {
  const router = useRouter();
  
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    initialSelectedCompanyId || companies[0]?.id || ''
  );

  const activeCompanyId = (selectedCompanyId && companies.some(c => c.id === selectedCompanyId))
    ? selectedCompanyId
    : (companies[0]?.id || '');
  const selectedCompany = companies.find(c => c.id === activeCompanyId) || companies[0];

  // Render an individual Node in the Tree
  const renderOrgNode = (node: OrgNodeData, isRoot = false) => {
    const isMapped = node.isMappedCandidate;

    return (
      <div className="flex flex-col items-center">
        {/* Node Card */}
        <div 
          className={cn(
            "relative z-10 rounded-xl p-3.5 transition-all text-left w-[240px] shadow-xs border",
            isRoot 
              ? "bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-slate-800/20"
              : isMapped 
                ? "bg-white text-slate-900 border-purple-300 ring-2 ring-purple-500/20 shadow-md hover:border-purple-500" 
                : "bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-2xs"
          )}
        >
          {/* Level Pill */}
          <div className="flex items-center justify-between mb-2">
            <span className={cn(
              "text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded",
              isRoot 
                ? "bg-slate-800 text-slate-300 border border-slate-700" 
                : isMapped 
                  ? "bg-purple-100 text-purple-800 font-black" 
                  : "bg-slate-100 text-slate-600"
            )}>
              {node.level}
            </span>

            {/* Candidate Match Score */}
            {isMapped && typeof node.matchScore === 'number' && (
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 fill-purple-300" />
                {node.matchScore}% Match
              </span>
            )}
          </div>

          {/* Node Avatar & Info */}
          <div className="flex items-start gap-2.5">
            {node.avatarUrl ? (
              <img 
                src={node.avatarUrl} 
                alt={node.name} 
                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" 
              />
            ) : (
              <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0",
                isRoot 
                  ? "bg-slate-800 text-white border border-slate-700" 
                  : isMapped 
                    ? "bg-purple-100 text-purple-700 border border-purple-200" 
                    : "bg-slate-100 text-slate-600 border border-slate-200"
              )}>
                {node.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className={cn(
                "font-bold text-xs truncate leading-snug",
                isRoot ? "text-white" : isMapped ? "text-slate-900 font-extrabold" : "text-slate-800"
              )}>
                {node.name}
              </div>
              <div className={cn(
                "text-[11px] truncate leading-tight mt-0.5",
                isRoot ? "text-slate-300" : isMapped ? "text-purple-700 font-semibold" : "text-slate-500"
              )}>
                {node.title}
              </div>
            </div>
          </div>

          {/* Candidate Mapped Tag & Mobility Pill */}
          {isMapped && (
            <div className="mt-2.5 pt-2 border-t border-purple-100 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1 text-emerald-700 font-bold">
                <Flame className="w-3 h-3 text-amber-500" />
                <span>{node.mobilityScore}% EMI</span>
              </div>
              
              {node.candidateId ? (
                <button
                  type="button"
                  onClick={() => router.navigateToView('candidates', { candidateId: node.candidateId })}
                  className="text-purple-700 hover:text-purple-900 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Profile</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              ) : (
                <span className="text-purple-600 font-medium">Mapped</span>
              )}
            </div>
          )}
        </div>

        {/* Children Branching */}
        {node.children && node.children.length > 0 && (
          <div className="flex flex-col items-center w-full">
            {/* Vertical connector from parent */}
            <div className="w-px h-6 bg-slate-300"></div>

            {/* Horizontal connector bar across children */}
            {node.children.length > 1 ? (
              <div className="relative flex justify-center w-full">
                <div 
                  className="absolute top-0 h-px bg-slate-300" 
                  style={{ 
                    width: `${Math.max(60, 100 - (100 / node.children.length))}%` 
                  }}
                />
                
                <div className="flex justify-center gap-6 sm:gap-8 pt-0 relative z-10 flex-wrap sm:flex-nowrap">
                  {node.children.map((childNode) => (
                    <div key={childNode.id} className="flex flex-col items-center">
                      <div className="w-px h-6 bg-slate-300"></div>
                      {renderOrgNode(childNode)}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-slate-300"></div>
                {renderOrgNode(node.children[0])}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Org Chart for a specific company
  const renderCompanyTree = (company: MappedCompany) => {
    const orgData = getCompanyOrgChart(company);
    const mappedExecsCount = company.executives.length;

    return (
      <div key={company.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col mb-8 last:mb-0">
        
        {/* Company Org Chart Top Banner */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {company.tier}
              </span>
              <h3 className="font-extrabold text-base text-slate-900">{company.name}</h3>
              {company.poachStatus === 'Clear Target' ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Clear Target
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                  {company.poachStatus}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
              <span>{company.industry}</span>
              <span>·</span>
              <span>HQ: {company.headquarters}</span>
              <span>·</span>
              <span>{company.stage}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
            <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-purple-700 font-bold">
              {mappedExecsCount} Calibrated {mappedExecsCount === 1 ? 'Leader' : 'Leaders'} on Map
            </span>
          </div>
        </div>

        {/* Tree Container with horizontal scroll */}
        <div className="p-8 sm:p-12 overflow-x-auto min-h-[380px] bg-radial from-slate-50 via-white to-slate-50 flex justify-center items-start">
          <div className="inline-block min-w-max mx-auto">
            {renderOrgNode(orgData, true)}
          </div>
        </div>

        {/* Legend Footer */}
        <div className="px-5 py-2.5 bg-slate-50/60 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-purple-100 border border-purple-400"></div>
              <span className="font-semibold text-slate-700">Calibrated Mandate Leader</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-white border border-slate-300"></div>
              <span>Executive Peer / Functional Bench</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-slate-900 border border-slate-800"></div>
              <span>Chief Executive Officer</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 italic">
            Reporting lines indexed by Phenom Executive Research
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* If not in showAllMode, show company switcher buttons */}
      {!showAllMode && companies.length > 1 && (
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0 font-medium">
            <Network className="w-4 h-4 text-purple-600" />
            <span>Select Target Enterprise:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {companies.map(comp => (
              <button
                key={comp.id}
                onClick={() => setSelectedCompanyId(comp.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5",
                  activeCompanyId === comp.id
                    ? "bg-purple-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                <span>{comp.name}</span>
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px]",
                  activeCompanyId === comp.id ? "bg-purple-700 text-purple-100" : "bg-white text-slate-600"
                )}>
                  {comp.executives.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Render selected company or all companies */}
      {showAllMode ? (
        <div className="space-y-6">
          {companies.map(company => renderCompanyTree(company))}
        </div>
      ) : selectedCompany ? (
        renderCompanyTree(selectedCompany)
      ) : (
        <div className="text-center py-12 text-slate-400 text-xs">
          No company org chart available.
        </div>
      )}

    </div>
  );
}
