import React, { useState } from 'react';
import { Candidate, RecommendedCandidate } from '../types';
import { mockCandidates, mockRecommendedCandidates } from '../data/mockData';
import { initialDealRooms } from '../data/dealRoomsData';
import { recommendedCandidateMatches } from '../data/recommendedCandidateMatches';
import { CandidateDetail } from './CandidateDetail';
import { RecommendedCandidateDetail } from './RecommendedCandidateDetail';
import { AddCandidateModal } from './AddCandidateModal';
import { 
  Search, 
  Filter, 
  User, 
  Building, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  UserPlus,
  Check,
  BrainCircuit,
  Handshake,
  FolderKanban,
  Briefcase,
  X
} from 'lucide-react';
import { useRestricted } from '../context/RestrictedContext';
import { cn } from '../lib/utils';

interface CandidatesViewProps {
  candidateId: string | null;
  onSelectCandidate: (id: string | null) => void;
}

export function CandidatesView({ candidateId, onSelectCandidate }: CandidatesViewProps) {
  const { restrictedCompanies } = useRestricted();
  const [activeTab, setActiveTab] = useState<'all' | 'recommendations' | 'projects' | 'subscribed' | 'restricted' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for candidates and recommendations so Add to CRM mutates dynamically
  const [candidatesList, setCandidatesList] = useState<Candidate[]>(mockCandidates);
  const [recommendedList, setRecommendedList] = useState<RecommendedCandidate[]>(mockRecommendedCandidates);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);

  const isRestricted = (companyName: string) => 
    restrictedCompanies.some(rc => rc.name.trim().toLowerCase() === companyName?.trim().toLowerCase());

  // Determine if candidate has an active opportunity room
  const getOpportunityRoomForCandidate = (c: Candidate | RecommendedCandidate) => {
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

  // Helper to determine active project associations for a candidate
  const getCandidateProjects = (candidate: Candidate | RecommendedCandidate): string[] => {
    if (candidate.projects && candidate.projects.length > 0) {
      return candidate.projects;
    }
    const projects: string[] = [];

    // Associate based on active deal/opportunity room
    const opp = getOpportunityRoomForCandidate(candidate);
    if (opp?.title) {
      const trimmed = opp.title.replace(' Opportunity Room', '').replace(' Deal Room', '').trim();
      if (trimmed) projects.push(trimmed);
    }

    // Associate based on role & function matching active searches
    const r = (candidate.role || '').toLowerCase();
    const f = (candidate.executiveData?.function || '').toLowerCase();

    if (r.includes('cfo') || f.includes('finance') || r.includes('finance') || r.includes('financial')) {
      projects.push('CFO');
    } else if (r.includes('engineering') || r.includes('cto') || r.includes('technology') || f.includes('engineering')) {
      projects.push('VP of Engineering');
    } else if (r.includes('security') || r.includes('ciso') || f.includes('security')) {
      projects.push('CISO Search');
    } else if (r.includes('product') || f.includes('product')) {
      projects.push('Senior Product Manager');
    } else if (r.includes('operations') || r.includes('coo') || f.includes('operations')) {
      projects.push('COO Mandate');
    } else if (r.includes('ceo') || r.includes('president') || f.includes('general management')) {
      projects.push('Executive Succession');
    } else {
      projects.push('Leadership Pipeline');
    }

    return Array.from(new Set(projects));
  };

  // Show toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Determine current list to display based on activeTab
  const getBaseList = (): (Candidate | RecommendedCandidate)[] => {
    if (activeTab === 'recommendations') {
      return recommendedList;
    }
    return candidatesList;
  };

  const displayedCandidates = getBaseList().filter(c => {
    const restricted = isRestricted(c.company);
    if (activeTab === 'restricted') return restricted;
    if (activeTab === 'projects') return getCandidateProjects(c).length > 0;
    if (activeTab === 'subscribed') return c.isSubscribed !== false;
    if (activeTab === 'all' && restricted) return false;
    if (activeTab === 'recommendations') return true;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = `${c.firstName} ${c.lastName}`.toLowerCase().includes(q);
      const roleMatch = c.role.toLowerCase().includes(q);
      const companyMatch = c.company.toLowerCase().includes(q);
      const locationMatch = c.location.toLowerCase().includes(q);
      if (!nameMatch && !roleMatch && !companyMatch && !locationMatch) {
        return false;
      }
    }

    return true;
  });

  // Checkbox handlers
  const isAllSelected = displayedCandidates.length > 0 && displayedCandidates.every(c => selectedIds.includes(c.id));
  const isSomeSelected = displayedCandidates.some(c => selectedIds.includes(c.id)) && !isAllSelected;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedCandidates.map(c => c.id));
    }
  };

  const handleToggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Add to CRM logic
  const handleAddToCrm = (targetIds: string[] = selectedIds, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (targetIds.length === 0) return;

    // Find recommended candidates being added
    const toAddFromRecs = recommendedList.filter(rc => targetIds.includes(rc.id));
    
    // Mark them as added in recommendedList
    setRecommendedList(prev => prev.map(rc => {
      if (targetIds.includes(rc.id)) {
        return { ...rc, addedToCrm: true };
      }
      return rc;
    }));

    // Add new ones to candidatesList if not already present
    setCandidatesList(prev => {
      const existingIds = new Set(prev.map(c => c.id));
      const newCandidates: Candidate[] = toAddFromRecs.filter(rc => !existingIds.has(rc.id));
      return [...prev, ...newCandidates];
    });

    const count = targetIds.length;
    setSelectedIds([]);
    triggerToast(
      count === 1 
        ? `Added 1 executive to CRM successfully!`
        : `Added ${count} executives to CRM successfully!`
    );
  };

  const handleAddCandidatesFromModal = (candidatesToAdd: Candidate[]) => {
    if (candidatesToAdd.length === 0) return;

    const existingNames = new Set(candidatesList.map(c => `${c.firstName} ${c.lastName}`.toLowerCase().trim()));
    const brandNewCandidates = candidatesToAdd.filter(c => !existingNames.has(`${c.firstName} ${c.lastName}`.toLowerCase().trim()));
    const updatedCandidates = [...brandNewCandidates, ...candidatesList];

    // Mark any matching recommended candidates as added
    const targetNames = new Set(candidatesToAdd.map(c => `${c.firstName} ${c.lastName}`.toLowerCase().trim()));
    setRecommendedList(prev => prev.map(rc => {
      if (targetNames.has(`${rc.firstName} ${rc.lastName}`.toLowerCase().trim())) {
        return { ...rc, addedToCrm: true };
      }
      return rc;
    }));

    setCandidatesList(updatedCandidates);
    triggerToast(
      candidatesToAdd.length === 1
        ? `Added 1 executive to CRM workspace!`
        : `Added ${candidatesToAdd.length} executives to CRM workspace!`
    );
  };

  const handleCreateCandidateFromModal = (newCandidate: Candidate) => {
    setCandidatesList(prev => [newCandidate, ...prev]);
    triggerToast(`Created profile for "${newCandidate.firstName} ${newCandidate.lastName}" and added to workspace!`);
  };

  if (candidateId) {
    const allKnown = [...candidatesList, ...recommendedList];
    const candidateToShow = allKnown.find(c => c.id === candidateId) || candidatesList[0];
    const isRecommended = recommendedList.some(r => r.id === candidateId) || ('recommendationReason' in candidateToShow);

    return (
      <div className="max-w-[1300px] mx-auto p-6 h-full overflow-y-auto">
        <button 
          onClick={() => onSelectCandidate(null)}
          className="text-slate-500 hover:text-slate-800 font-medium text-sm mb-6 flex items-center gap-2"
        >
          &larr; Back to Candidates
        </button>
        {isRecommended ? (
          <RecommendedCandidateDetail 
            candidate={candidateToShow as RecommendedCandidate} 
            onAddToCrm={() => handleAddToCrm([candidateToShow.id])}
          />
        ) : (
          <CandidateDetail candidate={candidateToShow} />
        )}
      </div>
    );
  }

  const unaddedRecsCount = recommendedList.filter(r => !r.addedToCrm).length;

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full h-full flex flex-col relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-slideUp">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-(--text-strong)">Candidates</h1>
          <p className="text-xs text-slate-500 mt-1">Executive talent pool with autonomous agent sourcing & assessment scoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, company..." 
              className="w-64 pl-9 pr-8 py-2 rounded-full border border-slate-300 text-sm focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200) transition-shadow bg-white text-slate-700 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
          <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-slate-300 text-(--color-secondary-200) font-semibold text-sm hover:bg-slate-50 bg-white transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <div className="w-px h-6 bg-slate-300 mx-1"></div>
          <button 
            onClick={() => setIsAddCandidateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-slate-300 text-(--color-secondary-200) font-semibold text-sm hover:bg-slate-50 bg-white transition-colors cursor-pointer"
          >
            <span className="text-lg leading-none mb-[2px]">+</span> Add Candidates
          </button>
          <button className="p-2 text-slate-500 hover:text-slate-700 ml-1 hover:bg-slate-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Phenom-style Horizontal Tabs with Recommendations placed directly to the right of All Candidates */}
        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar bg-slate-50/50">
          <div className="flex whitespace-nowrap min-w-max">
            {/* 1. All Candidates Tab */}
            <button 
              onClick={() => { setActiveTab('all'); setSelectedIds([]); }}
              className={cn(
                "px-5 py-3 text-sm font-semibold border-r border-slate-200 transition-colors",
                activeTab === 'all' ? "bg-white text-slate-900 border-b-2 border-b-(--color-secondary-200)" : "bg-transparent text-slate-600 hover:bg-slate-100 font-medium"
              )}
            >
              All Candidates <span className="text-slate-500 font-normal ml-1">{candidatesList.length}</span>
            </button>

            {/* 2. Recommendations Tab - DIRECTLY TO THE RIGHT OF ALL TAB */}
            <button 
              onClick={() => { setActiveTab('recommendations'); setSelectedIds([]); }}
              className={cn(
                "px-5 py-3 text-sm font-semibold border-r border-slate-200 flex items-center gap-1.5 transition-colors relative",
                activeTab === 'recommendations' 
                  ? "bg-white text-(--color-secondary-200) border-b-2 border-b-(--color-secondary-200)" 
                  : "bg-transparent text-slate-700 hover:bg-purple-50/50 font-medium"
              )}
            >
              <Sparkles className="w-4 h-4 text-purple-600 fill-purple-100" />
              Recommendations 
              <span className={cn(
                "px-1.5 py-0.2 rounded-full text-xs font-bold ml-1",
                activeTab === 'recommendations' ? "bg-purple-100 text-purple-700" : "bg-purple-50 text-purple-600 border border-purple-200"
              )}>
                {recommendedList.length}
              </span>
            </button>

            {/* 3. Projects Tab */}
            <button 
              onClick={() => { setActiveTab('projects'); setSelectedIds([]); }}
              className={cn(
                "px-5 py-3 text-sm font-semibold border-r border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer",
                activeTab === 'projects' ? "bg-white text-(--color-secondary-200) border-b-2 border-b-(--color-secondary-200)" : "bg-transparent text-slate-600 hover:bg-slate-100 font-medium"
              )}
            >
              <FolderKanban className="w-3.5 h-3.5 text-(--color-secondary-200)" /> Projects <span className="text-slate-500 font-normal ml-1">
                {candidatesList.length}
              </span>
            </button>

            {/* 4. Restricted Candidates Tab */}
            <button 
              onClick={() => { setActiveTab('restricted'); setSelectedIds([]); }}
              className={cn(
                "px-5 py-3 text-sm font-semibold border-r border-slate-200 flex items-center gap-1.5 transition-colors",
                activeTab === 'restricted' ? "bg-white text-red-700 border-b-2 border-b-red-600" : "bg-transparent text-slate-600 hover:bg-slate-100 font-medium"
              )}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Restricted Candidates <span className="text-slate-500 font-normal ml-1">1</span>
            </button>

            <button className="px-5 py-3 text-sm font-medium text-slate-600 border-r border-slate-200 hover:bg-slate-100">
              FDA Debarred <span className="text-slate-500 font-normal ml-1">1</span>
            </button>
            <button className="px-5 py-3 text-sm font-medium text-slate-600 border-r border-slate-200 hover:bg-slate-100">
              Employees <span className="text-slate-500 font-normal ml-1">85</span>
            </button>
            <button className="px-5 py-3 text-sm font-medium text-slate-600 border-r border-slate-200 hover:bg-slate-100">
              Google and Python S... <span className="text-slate-500 font-normal ml-1">17</span>
            </button>
            <button className="px-5 py-3 text-sm font-medium text-slate-600 border-r border-slate-200 hover:bg-slate-100">
              Followed Candidates <span className="text-slate-500 font-normal ml-1">152K+</span>
            </button>
            <button className="px-5 py-3 text-sm font-medium text-slate-600 border-r border-slate-200 hover:bg-slate-100">
              Referrals <span className="text-slate-500 font-normal ml-1">26</span>
            </button>
            <button className="px-5 py-3 text-sm font-medium text-slate-600 border-r border-slate-200 hover:bg-slate-100">
              Philadelphia CSM Lea... <span className="text-slate-500 font-normal ml-1">5</span>
            </button>
          </div>
        </div>

        {/* Bulk Action Bar when checkboxes are selected */}
        {selectedIds.length > 0 && (
          <div className="bg-purple-50/80 border-b border-purple-200 px-6 py-2.5 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-purple-900 bg-purple-200/70 px-2.5 py-1 rounded-md">
                {selectedIds.length} candidate{selectedIds.length > 1 ? 's' : ''} selected
              </span>
              <span className="text-xs text-purple-700">Choose an action for selected executives:</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => handleAddToCrm(selectedIds, e)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add to CRM ({selectedIds.length})
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}

        {/* Recommendations Context Banner */}
        {activeTab === 'recommendations' && selectedIds.length === 0 && (
          <div className="bg-purple-50/50 border-b border-purple-100 px-6 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-purple-900">
              <BrainCircuit className="w-4 h-4 text-purple-600" />
              <span>
                <strong>Aura Agent Recommendations:</strong> Curated high-potential executive profiles showing active mobility inflections. Check any candidates to add directly to your CRM.
              </span>
            </div>
            {unaddedRecsCount > 0 && (
              <button 
                onClick={(e) => handleAddToCrm(recommendedList.filter(r => !r.addedToCrm).map(r => r.id), e)}
                className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 text-xs"
              >
                + Add All {unaddedRecsCount} to CRM
              </button>
            )}
          </div>
        )}

        <div className="flex-1 min-h-0 relative">
          <div className="absolute inset-0 overflow-auto">
            
          <table className="w-full text-left text-sm whitespace-nowrap">
            
            <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 z-10 shadow-2xs border-b border-slate-200">
              <tr>
                {/* Checkbox Column Header */}
                <th className="w-12 px-4 py-4 text-center">
                  <input 
                    type="checkbox"
                    checked={isAllSelected}
                    ref={el => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={handleToggleSelectAll}
                    aria-label="Select all candidates"
                    className="w-4 h-4 rounded border-slate-300 text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                  />
                </th>
                {/* Combined Name & Current Role */}
                <th className="px-6 py-4">Name & Current Role</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Location</th>
                {activeTab === 'recommendations' && <th className="px-6 py-4">Projects/Jobs Match</th>}
                
                {/* Score columns ONLY in standard tabs, NOT in recommendations */}
                {activeTab !== 'recommendations' && (
                  <>
                    <th className="px-6 py-4">EMI Score</th>
                    <th className="px-6 py-4">Assessment Score</th>
                  </>
                )}

                {/* Projects and Last Contact: recommended candidates are not in the CRM yet, so neither applies */}
                {activeTab !== 'recommendations' && (
                  <>
                    <th className="px-6 py-4">Projects</th>
                    <th className="px-6 py-4">Last Contact</th>
                  </>
                )}

                {/* Special Columns for Recommendations tab: Reason & Action (NO score columns) */}
                {activeTab === 'recommendations' && (
                  <>
                    <th className="px-6 py-4">Recommendation Reason</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {displayedCandidates.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'recommendations' ? 7 : 8} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No candidates match the selected filters or search query.
                  </td>
                </tr>
              ) : (
                displayedCandidates.map((candidate) => {
                  const assessmentScore = candidate.assessmentScore ?? candidate.behavioralScore ?? 85;
                  const candidateProjects = getCandidateProjects(candidate);
                  const isSelected = selectedIds.includes(candidate.id);
                  const isRec = 'recommendationReason' in candidate;
                  const isAddedToCrm = (candidate as RecommendedCandidate).addedToCrm;
                  const oppRoom = getOpportunityRoomForCandidate(candidate);

                  return (
                    <tr 
                      key={candidate.id} 
                      onClick={() => onSelectCandidate(candidate.id)}
                      className={cn(
                        "hover:bg-slate-50/80 cursor-pointer transition-colors group",
                        isSelected && "bg-purple-50/40"
                      )}
                    >
                      {/* Checkbox Column */}
                      <td className="w-12 px-4 py-3.5 text-center" onClick={(e) => handleToggleSelectRow(candidate.id, e)}>
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          aria-label={`Select ${candidate.firstName} ${candidate.lastName}`}
                          className="w-4 h-4 rounded border-slate-300 text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                        />
                      </td>

                      {/* Combined Name & Current Role Cell */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          {candidate.avatarUrl ? (
                            <img 
                              src={candidate.avatarUrl} 
                              alt={candidate.firstName} 
                              className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200 shadow-2xs" 
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {candidate.firstName} {candidate.lastName}
                              </span>
                              {/* Recommended candidates are not in the CRM until added, so they cannot be in an opportunity room yet */}
                              {oppRoom && !(isRec && !isAddedToCrm) && (
                                <span 
                                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/90 shadow-2xs hover:bg-purple-100 transition-colors shrink-0"
                                  title={`Currently active in ${oppRoom.title} (${oppRoom.status})`}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                                  <Handshake className="w-3 h-3 text-purple-600" />
                                  <span>Opportunity Room</span>
                                  <span className="text-[9px] font-semibold text-purple-500 hidden xl:inline">· {oppRoom.status}</span>
                                </span>
                              )}
                              {isRestricted(candidate.company) && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                                  <ShieldAlert className="w-3 h-3" /> RESTRICTED
                                </span>
                              )}
                              {isRec && isAddedToCrm && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <Check className="w-3 h-3" /> In CRM
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                              {candidate.role}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-6 py-3.5 text-slate-700">
                        <div className="flex items-center gap-2 font-medium">
                          <Building className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{candidate.company}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-3.5 text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{candidate.location.split(',')[0]}</span>
                        </div>
                      </td>

                      {/* Projects/Jobs Match: where this recommendation would fit today */}
                      {activeTab === 'recommendations' && (
                        <td className="px-6 py-3.5">
                          <ul className="flex flex-col items-start gap-1.5" aria-label={`Projects and jobs that fit ${candidate.firstName} ${candidate.lastName}`}>
                            {(recommendedCandidateMatches[candidate.id] ?? []).map(m => (
                              <li key={`${m.kind}-${m.title}`}>
                                <span
                                  className="phx-tag"
                                  tabIndex={0}
                                  data-tooltip={`${m.kind === 'project' ? 'Project' : 'Job'}: ${m.reason}`}
                                  aria-label={`${m.kind === 'project' ? 'Project' : 'Job'} ${m.title}, ${m.fit} percent fit. ${m.reason}`}
                                >
                                  {m.kind === 'project' ? <FolderKanban className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> : <Briefcase className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                                  <span className="truncate max-w-[200px]">{m.title}</span>
                                  <span className="font-bold tabular-nums">{m.fit}%</span>
                                </span>
                              </li>
                            ))}
                            {!(recommendedCandidateMatches[candidate.id]?.length) && <span className="text-xs text-slate-400 italic">No match yet</span>}
                          </ul>
                        </td>
                      )}

                      {/* Score Columns - ONLY in non-recommendations tabs */}
                      {activeTab !== 'recommendations' && (
                        <>
                          {/* EMI Score */}
                          <td className="px-6 py-3.5">
                            <span className={cn(
                              "px-2.5 py-1 text-xs font-bold rounded-md border inline-flex items-center justify-center min-w-[36px]",
                              candidate.emiScore >= 80 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                : candidate.emiScore >= 60
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            )}>
                              {candidate.emiScore}
                            </span>
                          </td>

                          {/* Assessment Score Column (Score number only, without /100) */}
                          <td className="px-6 py-3.5">
                            <span className={cn(
                              "px-2.5 py-1 text-xs font-bold rounded-md border inline-flex items-center justify-center min-w-[36px]",
                              assessmentScore >= 90
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : assessmentScore >= 80
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            )}>
                              {assessmentScore}
                            </span>
                          </td>
                        </>
                      )}

                      {activeTab !== 'recommendations' && (
                        <>
                      {/* Projects Column */}
                      <td className="px-6 py-3.5">
                        <div className="flex flex-wrap items-center gap-1.5 max-w-[260px]">
                          {candidateProjects.length > 0 ? (
                            candidateProjects.map((proj, idx) => (
                              <span 
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100/90 text-slate-800 border border-slate-200 group-hover:border-purple-300 group-hover:bg-purple-50 group-hover:text-(--color-secondary-200) transition-colors"
                                title={`Associated Project: ${proj}`}
                              >
                                <FolderKanban className="w-3 h-3 text-(--color-secondary-200) shrink-0" />
                                <span className="truncate max-w-[130px]">{proj}</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">Unassigned</span>
                          )}
                        </div>
                      </td>

                      {/* Last Contact Date Column */}
                      <td className="px-6 py-3.5 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className={cn(
                            candidate.lastContactDate === 'Never' 
                              ? "text-slate-400 italic" 
                              : "text-slate-700 font-medium"
                          )}>
                            {candidate.lastContactDate || 'Never'}
                          </span>
                        </div>
                      </td>
                        </>
                      )}

                      {/* Recommendations Extras: NO scores, just Recommendation Reason & Action */}
                      {activeTab === 'recommendations' && (
                        <>
                          <td className="px-6 py-3.5 text-xs max-w-sm truncate text-slate-600">
                            <div className="flex items-center gap-1.5" title={(candidate as RecommendedCandidate).recommendationReason}>
                              <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span className="truncate">{(candidate as RecommendedCandidate).recommendationReason}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                            {isAddedToCrm ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 px-3 py-1 bg-emerald-50 rounded-lg">
                                <Check className="w-3.5 h-3.5" /> Added
                              </span>
                            ) : (
                              <button 
                                onClick={(e) => handleAddToCrm([candidate.id], e)}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-(--color-secondary-200) text-(--color-secondary-200) hover:bg-(--color-secondary-200) hover:text-white text-xs font-semibold transition-colors shadow-2xs"
                              >
                                <UserPlus className="w-3 h-3" /> Add to CRM
                              </button>
                            )}
                          </td>
                        </>
                      )}
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
        existingCandidates={candidatesList}
        recommendedCandidates={recommendedList}
        onAddCandidates={handleAddCandidatesFromModal}
        onCreateCandidate={handleCreateCandidateFromModal}
      />
    </div>
  );
}
