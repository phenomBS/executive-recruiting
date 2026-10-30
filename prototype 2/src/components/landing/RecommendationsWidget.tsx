import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Sparkles, 
  Plus, 
  Check, 
  TrendingUp, 
  ExternalLink, 
  MapPin, 
  Award,
  ChevronRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { RecommendedCandidate, RecommendedCompany, Company, Candidate } from '../../types';
import { cn } from '../../lib/utils';

interface RecommendationsWidgetProps {
  recommendedCandidates: RecommendedCandidate[];
  recommendedCompanies: RecommendedCompany[];
  onSelectCandidate: (candidateId: string) => void;
  onAddCandidateToWorkspace?: (candidate: RecommendedCandidate) => void;
  onAddCompanyToCrm: (company: Company) => void;
  onViewAllCandidates: () => void;
  onViewAllCompanies: () => void;
}

export function RecommendationsWidget({
  recommendedCandidates,
  recommendedCompanies,
  onSelectCandidate,
  onAddCandidateToWorkspace,
  onAddCompanyToCrm,
  onViewAllCandidates,
  onViewAllCompanies
}: RecommendationsWidgetProps) {
  const [activeTab, setActiveTab] = useState<'candidates' | 'companies'>('candidates');
  const [addedCompanyIds, setAddedCompanyIds] = useState<string[]>([]);
  const [addedCandidateIds, setAddedCandidateIds] = useState<string[]>([]);

  const handleAddCompany = (company: Company) => {
    onAddCompanyToCrm(company);
    setAddedCompanyIds(prev => [...prev, company.id]);
  };

  const handleAddCandidate = (e: React.MouseEvent, candidate: RecommendedCandidate) => {
    e.stopPropagation();
    onAddCandidateToWorkspace?.(candidate);
    setAddedCandidateIds(prev => [...prev, candidate.id]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-(--color-secondary-200) to-(--color-secondary-100) text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recommended Candidate & Companies to Add
            </h3>
            <p className="text-xs text-slate-500">
              AI-calibrated executive candidates and strategic source organizations ready to add to active searches
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('candidates')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'candidates'
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Users className="w-3.5 h-3.5 text-(--color-secondary-200)" />
            <span>Executives ({recommendedCandidates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('companies')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'companies'
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Building2 className="w-3.5 h-3.5 text-purple-700" />
            <span>Source Companies ({recommendedCompanies.length})</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[340px]">
        {activeTab === 'candidates' ? (
          /* EXECUTIVE CANDIDATE RECOMMENDATIONS */
          <>
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
              <span>Top calibrated executive matches based on active search parameters</span>
              <button
                type="button"
                onClick={onViewAllCandidates}
                className="text-xs font-bold text-(--color-secondary-200) hover:text-(--bg-brand-secondary-hover) hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Master Slate <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedCandidates.map(cand => (
                <div
                  key={cand.id}
                  onClick={() => onSelectCandidate(cand.id)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-(--color-secondary-200)/40 bg-white hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    {/* Header: Candidate Info & Single EMI Score */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <img 
                          src={cand.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80'} 
                          alt={`${cand.firstName} ${cand.lastName}`}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs" 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-(--color-secondary-200) transition-colors truncate">
                              {cand.firstName} {cand.lastName}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark)">
                              {cand.matchScore}% Match
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5 truncate">
                            {cand.role}
                          </div>
                          <div className="text-xs text-slate-500 font-medium truncate">
                            at <span className="font-semibold text-slate-800">{cand.company}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="relative group/ptm">
                          <div
                            tabIndex={0}
                            aria-describedby={`ptm-tip-${cand.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-(--color-secondary-200) border border-purple-200/80 text-xs font-bold tabular-nums shadow-2xs cursor-help"
                          >
                            <span className="text-[10px] uppercase font-semibold text-purple-600">PTM</span>
                            <span>{cand.emiScore}</span>
                          </div>
                          <div
                            id={`ptm-tip-${cand.id}`}
                            role="tooltip"
                            className="pointer-events-none absolute right-0 top-full z-30 mt-1.5 hidden w-64 rounded-lg border border-slate-200 bg-white p-3 text-left shadow-md group-hover/ptm:block group-focus-within/ptm:block"
                          >
                            <p className="text-[11px] font-semibold text-slate-900 normal-case">Propensity to Move (PTM)</p>
                            <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-600 normal-case">
                              How likely this executive is to move. The score weighs organizational instability (stock changes, executive turnover, news, and transformation), equity vesting cliffs (distance to the 36- and 48-month marks, spiking 60 days prior), blocked #2 status (a VP whose leader above started less than 2 years ago), and tenure stagnation (past 48 months without a promotion or title change).
                            </p>
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{cand.location.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation fit analysis */}
                    <div className="p-3 rounded-lg bg-slate-50/90 border border-slate-200/70 text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-(--color-secondary-200)">Fit Analysis: </span>
                      {cand.recommendationReason}
                    </div>
                  </div>

                  {/* Footer: Level metadata and prominent CTAs */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 gap-2">
                    <span className="font-medium text-slate-600 text-xs truncate">
                      Level: <strong className="text-slate-800">{cand.executiveData.executiveLevel}</strong> · <span className="text-slate-500">{cand.executiveData.function || 'Executive'}</span>
                    </span>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCandidate(cand.id);
                        }}
                        className="px-2 py-1 text-xs font-bold text-slate-600 hover:text-(--color-secondary-200) hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        Profile <ExternalLink className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        disabled={addedCandidateIds.includes(cand.id)}
                        onClick={(e) => handleAddCandidate(e, cand)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer",
                          addedCandidateIds.includes(cand.id)
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                            : "bg-(--color-secondary-200) text-white hover:bg-(--bg-brand-secondary-hover) hover:shadow-xs active:scale-95"
                        )}
                      >
                        {addedCandidateIds.includes(cand.id) ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* SOURCE COMPANY RECOMMENDATIONS */
          <>
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
              <span>Organizations with high executive churn and leadership reorganization</span>
              <button
                type="button"
                onClick={onViewAllCompanies}
                className="text-xs font-bold text-(--color-secondary-200) hover:text-(--bg-brand-secondary-hover) hover:underline flex items-center gap-1 cursor-pointer"
              >
                Browse All Companies <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedCompanies.map(comp => {
                const isAdded = addedCompanyIds.includes(comp.id);

                return (
                  <div
                    key={comp.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-(--color-secondary-200)/40 bg-white hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-(--color-secondary-200) to-(--color-secondary-100) text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                            {comp.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {comp.name}
                              </h4>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark)">
                                {comp.mobilitySignal || '92% Mobility'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 truncate">
                              {comp.industry} · {comp.headquarters}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddCompany(comp)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer",
                            isAdded 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                              : "bg-(--color-secondary-200) text-white hover:bg-(--bg-brand-secondary-hover) hover:shadow-xs active:scale-95"
                          )}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Company</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Recommendation reason */}
                      <div className="p-3 rounded-lg bg-slate-50/90 border border-slate-200/70 text-xs text-slate-700 leading-relaxed">
                        <span className="font-bold text-(--color-secondary-200)">Intelligence Trigger: </span>
                        {comp.recommendationReason}
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="truncate">
                        Tracked Execs: <strong className="text-slate-800">{comp.executivesCount}</strong> · Relevant: <strong className="text-(--color-secondary-200)">{comp.relevantCandidatesCount}</strong>
                      </span>
                      <span className="shrink-0 text-slate-600 font-medium">Scale: {comp.size}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
