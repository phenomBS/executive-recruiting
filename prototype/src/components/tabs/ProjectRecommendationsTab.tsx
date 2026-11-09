import React, { useState, useMemo } from 'react';
import { Project } from '../../types';
import { 
  getRecommendationsForProject, 
  ProjectExecutiveRecommendation
} from '../../data/projectRecommendationsData';
import { 
  Sparkles, 
  Users, 
  Check, 
  UserPlus, 
  Flame, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  ShieldAlert, 
  ArrowUpRight, 
  TrendingUp, 
  CheckSquare, 
  Square, 
  X, 
  ChevronRight,
  Info,
  Clock,
  ExternalLink,
  Target
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useRestricted } from '../../context/RestrictedContext';

interface ProjectRecommendationsTabProps {
  project: Project;
  onCandidateAdded?: (candidate: ProjectExecutiveRecommendation) => void;
}

export function ProjectRecommendationsTab({ 
  project, 
  onCandidateAdded
}: ProjectRecommendationsTabProps) {
  const { restrictedCompanies } = useRestricted();
  
  // Get recommendations computed from master graph for this project
  const initialData = useMemo(() => getRecommendationsForProject(project), [project]);

  // Local state for tracking added status and bulk actions
  const [executivesList, setExecutivesList] = useState<ProjectExecutiveRecommendation[]>(initialData.executives);
  const [pipelinedExecIds, setPipelinedExecIds] = useState<Set<string>>(new Set());
  
  // Selection state for bulk operations
  const [selectedExecIds, setSelectedExecIds] = useState<Set<string>>(new Set());

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isCompanyRestricted = (name: string) => {
    return restrictedCompanies.some(rc => rc.name.trim().toLowerCase() === name.trim().toLowerCase());
  };

  // Visible recommendations (executives at restricted companies are never shown)
  const filteredExecutives = useMemo(
    () => executivesList.filter(exec => !isCompanyRestricted(exec.company)),
    [executivesList, restrictedCompanies]
  );

  // Handlers for single adds
  const handleAddExecutiveToPipeline = (exec: ProjectExecutiveRecommendation, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPipelinedExecIds(prev => new Set(prev).add(exec.id));
    if (onCandidateAdded) onCandidateAdded(exec);
    showToast(`Added ${exec.name} (${exec.role} at ${exec.company}) to Project Candidate Pipeline!`);
  };

  // Toggle selection
  const toggleSelectExec = (id: string) => {
    setSelectedExecIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Bulk actions
  const totalSelectedCount = selectedExecIds.size;

  const handleBulkAddToProject = () => {
    const count = selectedExecIds.size;
    setPipelinedExecIds(prev => {
      const next = new Set(prev);
      selectedExecIds.forEach(id => next.add(id));
      return next;
    });
    setSelectedExecIds(new Set());
    showToast(`Added ${count} candidate${count === 1 ? '' : 's'} to the project pipeline.`);
  };

  const handleSelectAllVisible = () => {
    setSelectedExecIds(new Set(filteredExecutives.map(e => e.id)));
  };

  const handleClearSelection = () => {
    setSelectedExecIds(new Set());
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-28 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-8 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slideUp">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Intelligence Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl p-6 lg:p-8 text-white shadow-xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Agent Discovery
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-300 font-medium">
              Calibrated against: <span className="text-white font-bold">{project.title}</span>
            </span>
            {project.parameters?.roleLevel && (
              <>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-purple-300 font-semibold bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">
                  {project.parameters.roleLevel}
                </span>
              </>
            )}
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-(--text-inverse)!">
            Agent-Discovered Candidates for this Mandate
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            While researching market data, the agent found these profiles and matched them to this project's scope, level and compensation. Review each profile and add the right people to the project pipeline.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* ========================================================================= */}
        {/* EXECUTIVES SECTION */}
        {/* ========================================================================= */}
        {(
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Candidates Found by the Agent
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {filteredExecutives.length} Candidates
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Profiles the agent surfaced from market research that fit this project's details.
                  </p>
                </div>
              </div>

              {filteredExecutives.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
                    Best fit first
                  </span>
                  <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={handleSelectAllVisible}>
                    <CheckSquare className="w-4 h-4" aria-hidden="true" /> Select all
                  </button>
                </div>
              )}
            </div>

            {filteredExecutives.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">No candidate recommendations yet</p>
                <p className="text-xs text-slate-400 mt-1">The agent adds candidates here as the master graph finds matches for this project.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredExecutives.map(exec => {
                  const isPipelined = pipelinedExecIds.has(exec.id) || exec.status === 'pipelined';
                  const isSelected = selectedExecIds.has(exec.id);

                  return (
                    <div
                      key={exec.id}
                      className={cn(
                        "bg-white rounded-xl border transition-all p-5 shadow-xs hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative group",
                        isSelected ? "border-purple-500 bg-purple-50/20 ring-1 ring-purple-500" : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {/* Checkbox + Avatar + Executive Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <button
                          type="button"
                          onClick={() => toggleSelectExec(exec.id)}
                          className="mt-1 text-slate-400 hover:text-purple-600 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-purple-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </button>

                        <div className="relative shrink-0">
                          <img
                            src={exec.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80'}
                            alt={exec.name}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Active Sourcing Signal" />
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                              {exec.name}
                            </h4>

                            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-purple-600" />
                              {exec.matchScore}% Match
                            </span>

                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                              {exec.fitTier}
                            </span>

                            <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-amber-600" />
                              {exec.mobilitySignal}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                            <span className="font-semibold text-slate-800 flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                              {exec.role} • <span className="text-purple-600 font-bold">{exec.company}</span>
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {exec.location}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              Tenure: {exec.tenure}
                            </span>
                            {exec.estimatedComp && (
                              <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                {exec.estimatedComp}
                              </span>
                            )}
                          </div>

                          {/* Fit Rationale Highlight Box */}
                          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 mt-2 text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                            <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-slate-900 font-bold">Master Graph Fit Rationale: </strong>
                              <span>{exec.fitRationale}</span>
                            </div>
                          </div>

                          {/* Fit dimension pills */}
                          <div className="flex items-center gap-2 flex-wrap pt-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                              CMA: {exec.fitSignals.levelMatch}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                              Comp: {exec.fitSignals.compParity}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              Scope: {exec.currentPandL}
                            </span>
                            {exec.keyHighlights.map((tag, idx) => (
                              <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-200">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0 flex items-center lg:flex-col lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {isPipelined ? (
                          <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 shadow-2xs">
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>In Project Pipeline</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleAddExecutiveToPipeline(exec, e)}
                            className="px-4 py-2 bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-purple-500/20 hover:scale-[1.02]"
                          >
                            <UserPlus className="w-4 h-4" />
                            <span>+ Add to Project Pipeline</span>
                          </button>
                        )}
                        <a 
                          href={`?view=candidates`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-slate-500 hover:text-(--color-secondary-200) flex items-center gap-1"
                        >
                          View Full Dossier <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Floating Bulk Action Drawer when checkboxes selected */}
      {totalSelectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-5 animate-slideUp">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center">
              {totalSelectedCount}
            </span>
            <span className="text-sm font-bold">
              {totalSelectedCount} item{totalSelectedCount === 1 ? '' : 's'} selected
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <button
            type="button"
            onClick={handleBulkAddToProject}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Add Selected to Project</span>
          </button>

          <button
            type="button"
            onClick={handleClearSelection}
            className="text-xs text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
