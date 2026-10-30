import React, { useState } from 'react';
import { 
  User, 
  Building, 
  ShieldAlert, 
  Handshake, 
  Check, 
  Search, 
  Sparkles,
  BrainCircuit,
  ChevronDown,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Candidate, Project } from '../../types';
import { mockCandidates, mockRecommendedCandidates } from '../../data/mockData';
import { initialDealRooms } from '../../data/dealRoomsData';
import { useRestricted } from '../../context/RestrictedContext';
import { AddCandidateModal } from '../AddCandidateModal';
import { cn } from '../../lib/utils';
import { useRouter } from '../../context/RouterContext';

export const PIPELINE_STAGES = ['Identified', 'Contacted', 'Interviewing', 'Offer', 'Hired'];

// Intelligent Shortlist: candidates at or above this EMI score, ranked highest first
const SHORTLIST_ID = 'Shortlist';
const SHORTLIST_MIN_EMI = 80;

export interface ProjectPipelineCandidate extends Candidate {
  projectStatus: string;
  dateAdded: string;
}

// Initial mapped version of mock candidates to represent the project pipeline
export const initialProjectPipeline: ProjectPipelineCandidate[] = mockCandidates.map((c, index) => {
  const status = PIPELINE_STAGES[index % PIPELINE_STAGES.length];
  return {
    ...c,
    projectStatus: status,
    dateAdded: '2026-09-01'
  };
});

interface ProjectCandidatesTabProps {
  project?: Project;
  /** Optional shared pipeline state (lifted so other project dialogs see the same candidates) */
  pipeline?: ProjectPipelineCandidate[];
  onPipelineChange?: React.Dispatch<React.SetStateAction<ProjectPipelineCandidate[]>>;
}

export function ProjectCandidatesTab({ project, pipeline: pipelineProp, onPipelineChange }: ProjectCandidatesTabProps = {}) {
  const router = useRouter();
  const { restrictedCompanies } = useRestricted();
  const [localPipeline, setLocalPipeline] = useState<ProjectPipelineCandidate[]>(initialProjectPipeline);
  const pipeline = pipelineProp ?? localPipeline;
  const setPipeline = onPipelineChange ?? setLocalPipeline;
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [emiFilter, setEmiFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const isRestricted = (companyName: string) => 
    restrictedCompanies.some(rc => rc.name.trim().toLowerCase() === companyName?.trim().toLowerCase());

  // Determine if candidate has an active opportunity room
  const getOpportunityRoomForCandidate = (c: Candidate) => {
    if (c.hasOpportunityRoom) {
      return {
        title: c.opportunityRoomTitle || 'Opportunity Room',
        status: c.opportunityRoomStatus || 'In Review'
      };
    }
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase().trim();
    const match = initialDealRooms.find(dr => 
      dr.candidateId === c.id ||
      (dr.candidateEmail && c.email && dr.candidateEmail.toLowerCase() === c.email.toLowerCase()) ||
      dr.candidateName.toLowerCase().includes(fullName) ||
      fullName.includes(dr.candidateName.toLowerCase().replace('dr. ', ''))
    );
    if (match) {
      return {
        title: match.title,
        status: match.status
      };
    }
    return null;
  };

  // Add candidates from modal
  const handleAddCandidatesFromModal = (candidatesToAdd: Candidate[]) => {
    if (candidatesToAdd.length === 0) return;

    const existingNames = new Set(pipeline.map(c => `${c.firstName} ${c.lastName}`.toLowerCase().trim()));
    const brandNewCandidates: ProjectPipelineCandidate[] = candidatesToAdd
      .filter(c => !existingNames.has(`${c.firstName} ${c.lastName}`.toLowerCase().trim()))
      .map(c => ({
        ...c,
        projectStatus: 'Identified',
        dateAdded: new Date().toISOString().split('T')[0]
      }));

    if (brandNewCandidates.length === 0) {
      triggerToast('Selected candidate(s) are already in this project pipeline.');
      setIsAddCandidateModalOpen(false);
      return;
    }

    setPipeline(prev => [...brandNewCandidates, ...prev]);
    setIsAddCandidateModalOpen(false);
    triggerToast(
      brandNewCandidates.length === 1
        ? `Added ${brandNewCandidates[0].firstName} ${brandNewCandidates[0].lastName} to Project Pipeline!`
        : `Added ${brandNewCandidates.length} executives to Project Pipeline successfully!`
    );
  };

  // Create custom candidate from modal
  const handleCreateCandidateFromModal = (newCandidate: Candidate) => {
    const formatted: ProjectPipelineCandidate = {
      ...newCandidate,
      projectStatus: 'Identified',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setPipeline(prev => [formatted, ...prev]);
    setIsAddCandidateModalOpen(false);
    triggerToast(`Created and pipelined ${newCandidate.firstName} ${newCandidate.lastName} successfully!`);
  };

  // Handle stage change
  const handleUpdateCandidateStage = (candidateId: string, newStage: string) => {
    setPipeline(prev => prev.map(c => c.id === candidateId ? { ...c, projectStatus: newStage } : c));
    triggerToast(`Updated stage to ${newStage}`);
  };

  // Strict exclusion: Restricted candidates cannot be displayed in a Project candidate list
  const nonRestrictedPipeline = pipeline.filter(c => !isRestricted(c.company) && !(c as any).isRestricted && !(c as any).restricted);
  const excludedCount = pipeline.length - nonRestrictedPipeline.length;

  const isShortlistTab = selectedStageFilter === SHORTLIST_ID;

  const displayedPipeline = nonRestrictedPipeline.filter(c => {
    if (isShortlistTab) {
      if (!(c.emiScore >= SHORTLIST_MIN_EMI)) return false;
    } else if (selectedStageFilter !== 'All' && c.projectStatus !== selectedStageFilter) {
      return false;
    }
    if (emiFilter === 'high' && !(c.emiScore >= 80)) return false;
    if (emiFilter === 'mid' && !(c.emiScore >= 60 && c.emiScore < 80)) return false;
    if (emiFilter === 'low' && !(c.emiScore < 60)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = `${c.firstName} ${c.lastName}`.toLowerCase().includes(q);
      const matchRole = c.role.toLowerCase().includes(q);
      const matchCompany = c.company.toLowerCase().includes(q);
      const matchLoc = c.location.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchCompany && !matchLoc) return false;
    }
    return true;
  });
  const rankedPipeline = isShortlistTab
    ? [...displayedPipeline].sort((a, b) => b.emiScore - a.emiScore)
    : displayedPipeline;

  const getStatusSelect = (status: string, candidateId: string, candidateName: string) => (
    <div className="relative inline-block w-40">
      <label className="sr-only" htmlFor={`stage-${candidateId}`}>Project stage for {candidateName}</label>
      <select
        id={`stage-${candidateId}`}
        value={status}
        onChange={(e) => handleUpdateCandidateStage(candidateId, e.target.value)}
        className="appearance-none w-full pl-3 pr-8 py-1.5 rounded-md text-xs font-medium text-slate-800 bg-white border border-slate-300 hover:border-slate-400 transition-colors cursor-pointer focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200)"
      >
        {PIPELINE_STAGES.map(stg => (
          <option key={stg} value={stg}>{stg}</option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
    </div>
  );

  const allSelected = rankedPipeline.length > 0 && rankedPipeline.every(c => selectedIds.includes(c.id));
  const someSelected = rankedPipeline.some(c => selectedIds.includes(c.id)) && !allSelected;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : rankedPipeline.map(c => c.id));
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  const handleBulkMove = (stage: string) => {
    if (!stage || selectedIds.length === 0) return;
    setPipeline(prev => prev.map(c => (selectedIds.includes(c.id) ? { ...c, projectStatus: stage } : c)));
    triggerToast(
      selectedIds.length === 1
        ? `Moved 1 candidate to ${stage}`
        : `Moved ${selectedIds.length} candidates to ${stage}`
    );
    setSelectedIds([]);
  };

  const stageTabs = [
    { id: 'All', label: 'All Candidates', count: nonRestrictedPipeline.length },
    {
      id: SHORTLIST_ID,
      label: 'Intelligent Shortlist',
      count: nonRestrictedPipeline.filter(c => c.emiScore >= SHORTLIST_MIN_EMI).length,
    },
    ...PIPELINE_STAGES.map(stg => ({
      id: stg,
      label: stg,
      count: nonRestrictedPipeline.filter(c => c.projectStatus === stg).length,
    })),
  ];

  const formatCreated = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    return Number.isNaN(d.getTime())
      ? iso
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const initials = (c: Candidate) => `${c.firstName[0] ?? ''}${c.lastName[0] ?? ''}`.toUpperCase();

  return (
    <div className="flex flex-col h-full min-h-[560px] relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-slideUp">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2 cursor-pointer" aria-label="Dismiss notification">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Toolbar: search + filter on the left, add candidates on the right */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search candidates"
              aria-label="Search candidates"
              className="w-56 pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200) bg-white text-slate-700 placeholder:text-slate-500"
            />
          </div>
          <div className="w-px h-7 bg-slate-300"></div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen(o => !o)}
              aria-expanded={isFilterOpen}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border text-(--color-secondary-200) font-semibold text-sm hover:bg-slate-50 bg-white transition-colors cursor-pointer",
                emiFilter !== 'all' ? "border-(--color-secondary-200)" : "border-slate-300"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filter
              {emiFilter !== 'all' && <span className="w-1.5 h-1.5 rounded-full bg-(--color-secondary-200)" />}
            </button>
            {isFilterOpen && (
              <div className="absolute left-0 top-full mt-2 z-30 w-60 bg-white rounded-xl border border-slate-200 shadow-lg p-4">
                <label htmlFor="emi-filter" className="block text-xs font-semibold text-slate-600 mb-1.5">EMI score</label>
                <select
                  id="emi-filter"
                  value={emiFilter}
                  onChange={e => { setEmiFilter(e.target.value as typeof emiFilter); setSelectedIds([]); }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-800 cursor-pointer"
                >
                  <option value="all">All scores</option>
                  <option value="high">80 and above</option>
                  <option value="mid">60 to 79</option>
                  <option value="low">Below 60</option>
                </select>
                <div className="flex justify-between mt-3">
                  <button type="button" onClick={() => setEmiFilter('all')} className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer">Clear</button>
                  <button type="button" onClick={() => setIsFilterOpen(false)} className="text-xs font-semibold text-(--color-secondary-200) hover:underline cursor-pointer">Done</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddCandidateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-slate-300 text-(--color-secondary-200) font-semibold text-sm hover:bg-slate-50 bg-white transition-colors cursor-pointer"
          >
            <span className="text-lg leading-none mb-[2px]">+</span> Add Candidates
          </button>
          <button type="button" aria-label="More options" className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 flex flex-col flex-1 min-h-0 overflow-hidden rounded-sm">
        {/* Stage tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar bg-slate-50" role="tablist" aria-label="Pipeline stages">
          <div className="flex whitespace-nowrap min-w-max">
            {stageTabs.map(tab => {
              const active = selectedStageFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => { setSelectedStageFilter(tab.id); setSelectedIds([]); }}
                  className={cn(
                    "px-4 py-2.5 text-sm border-r border-slate-200 transition-colors cursor-pointer",
                    active
                      ? "bg-white text-slate-900 font-semibold border-t-2 border-t-(--color-secondary-200) -mb-px"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-t-2 border-t-transparent"
                  )}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {tab.id === SHORTLIST_ID && <Sparkles className="w-4 h-4 text-purple-600 fill-purple-100" />}
                    {tab.label}
                    <span className={cn("ml-0.5", active ? "font-semibold" : "font-normal")}>{tab.count}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bulk action bar */}
        {selectedIds.length > 0 && (
          <div className="bg-purple-50/80 border-b border-purple-200 px-6 py-2.5 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-purple-900 bg-purple-200/70 px-2.5 py-1 rounded-md">
                {selectedIds.length} candidate{selectedIds.length > 1 ? 's' : ''} selected
              </span>
              <span className="text-xs text-purple-700">Choose an action for selected executives:</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="sr-only" htmlFor="bulk-stage-move">Move selected candidates to stage</label>
              <select
                id="bulk-stage-move"
                value=""
                onChange={e => handleBulkMove(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white border border-(--color-secondary-200) text-(--color-secondary-200) font-semibold text-xs cursor-pointer"
              >
                <option value="" disabled>Move to stage…</option>
                {PIPELINE_STAGES.map(stg => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 cursor-pointer"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}

        {/* Intelligent Shortlist context banner */}
        {isShortlistTab && selectedIds.length === 0 && (
          <div className="bg-purple-50/50 border-b border-purple-100 px-6 py-2.5 flex items-center gap-2 text-xs text-purple-900">
            <BrainCircuit className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              <strong>Intelligent Shortlist:</strong> pipeline candidates with an EMI score of {SHORTLIST_MIN_EMI} or higher, ranked from highest to lowest.
            </span>
          </div>
        )}

        {/* Restricted candidates banner */}
        {excludedCount > 0 && selectedIds.length === 0 && (
          <div className="bg-amber-50/60 border-b border-amber-100 px-6 py-2.5 flex items-center gap-2 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{excludedCount} restricted candidate{excludedCount > 1 ? 's' : ''} auto-removed (Off-Limits):</strong>{' '}
              restricted companies are excluded from every project pipeline.
            </span>
          </div>
        )}

        <div className="flex-1 min-h-0 relative">
          <div className="absolute inset-0 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-slate-700 font-semibold sticky top-0 z-10 border-b border-slate-200 text-xs">
                <tr>
                  <th className="w-12 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={el => {
                        if (el) el.indeterminate = someSelected;
                      }}
                      onChange={toggleSelectAll}
                      aria-label="Select all candidates"
                      className="w-4 h-4 rounded border-slate-300 text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Project Stage</th>
                  <th className="px-3 py-3">Email Address</th>
                  <th className="px-3 py-3">EMI Score</th>
                  <th className="px-3 py-3">Projects</th>
                  <th className="px-3 py-3">Created Date</th>
                  <th className="px-3 py-3">Location</th>
                  <th className="px-3 py-3">Profile Source</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {rankedPipeline.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-500 text-sm">
                      {searchQuery || selectedStageFilter !== 'All' || emiFilter !== 'all'
                        ? 'No candidates match the selected stage, filter, or search query.'
                        : 'No candidates have been added to this project pipeline yet.'}
                    </td>
                  </tr>
                ) : (
                  rankedPipeline.map(candidate => {
                    const oppRoom = getOpportunityRoomForCandidate(candidate);
                    const isSelected = selectedIds.includes(candidate.id);
                    const fullName = `${candidate.firstName} ${candidate.lastName}`;
                    const projectCount = candidate.projects?.length || 1;

                    return (
                      <tr
                        key={candidate.id}
                        onClick={() => router.navigateToView('candidates', { candidateId: candidate.id })}
                        className={cn(
                          "hover:bg-slate-50/80 cursor-pointer transition-colors group",
                          isSelected && "bg-purple-50/40"
                        )}
                      >
                        <td className="w-12 px-4 py-3 text-center" onClick={e => toggleSelectRow(candidate.id, e)}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            aria-label={`Select ${fullName}`}
                            className="w-4 h-4 rounded border-slate-300 text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                          />
                        </td>

                        <td className="px-3 py-3 min-w-[220px]">
                          <div className="flex items-center gap-3">
                            {candidate.avatarUrl ? (
                              <img
                                src={candidate.avatarUrl}
                                alt={candidate.firstName}
                                className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center justify-center shrink-0">
                                {initials(candidate) || <User className="w-4 h-4" />}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-(--color-secondary-200) group-hover:underline">
                                  {fullName}
                                </span>
                                {oppRoom && (
                                  <span
                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/90 shrink-0"
                                    title={`Currently active in ${oppRoom.title} (${oppRoom.status})`}
                                  >
                                    <Handshake className="w-3 h-3 text-purple-600" />
                                    <span>Opportunity Room</span>
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <span className="truncate">{candidate.role}</span>
                                <span className="text-slate-300">·</span>
                                <Building className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{candidate.company}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                          {getStatusSelect(candidate.projectStatus, candidate.id, fullName)}
                        </td>

                        <td className="px-3 py-3 text-xs text-slate-700 max-w-[220px] truncate" title={candidate.email}>
                          {candidate.email || '--'}
                        </td>

                        <td className="px-3 py-3">
                          <span className={cn(
                            "px-2.5 py-1 text-xs font-bold rounded-md border inline-flex items-center justify-center min-w-[36px]",
                            candidate.emiScore >= 80
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : candidate.emiScore >= 60
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          )}>
                            {candidate.emiScore || '88'}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-xs font-semibold text-(--color-secondary-200)">
                          {projectCount}
                        </td>

                        <td className="px-3 py-3 text-xs text-slate-700 whitespace-nowrap">
                          {formatCreated(candidate.dateAdded)}
                        </td>

                        <td className="px-3 py-3 text-xs text-slate-700 min-w-[140px]">
                          {candidate.location || '--'}
                        </td>

                        <td className="px-3 py-3 text-xs font-semibold text-(--color-secondary-200) whitespace-nowrap">
                          {candidate.trafficSource || '--'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddCandidateModal
        isOpen={isAddCandidateModalOpen}
        onOpenChange={setIsAddCandidateModalOpen}
        existingCandidates={pipeline}
        recommendedCandidates={mockRecommendedCandidates}
        onAddCandidates={handleAddCandidatesFromModal}
        onCreateCandidate={handleCreateCandidateFromModal}
      />
    </div>
  );
}
