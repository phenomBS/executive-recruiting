import React, { useState } from 'react';
import { Company, RecommendedCompany } from '../types';
import { mockRecommendedCompanies } from '../data/mockData';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ShieldAlert, 
  Sparkles, 
  Building2, 
  PlusCircle, 
  Check, 
  X, 
  BrainCircuit
} from 'lucide-react';
import { RestrictedCompaniesModal } from './RestrictedCompaniesModal';
import { AddCompanyModal } from './AddCompanyModal';
import { useRestricted } from '../context/RestrictedContext';
import { cn } from '../lib/utils';

interface CompaniesListProps {
  companies: Company[];
  recommendedCompanies?: RecommendedCompany[];
  onUpdateRecommendedCompanies?: (recs: RecommendedCompany[]) => void;
  onUpdateCompanies?: (comps: Company[]) => void;
  onSelectCompany: (company: Company | RecommendedCompany) => void;
}

export function CompaniesList({ 
  companies, 
  recommendedCompanies = mockRecommendedCompanies,
  onUpdateRecommendedCompanies,
  onUpdateCompanies,
  onSelectCompany 
}: CompaniesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState(false);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'recommendations' | 'restricted' | string>('all');
  
  // Local state for companies & recommended companies if parent doesn't provide updates
  const [companiesList, setCompaniesList] = useState<Company[]>(companies);
  const [recommendedCompaniesList, setRecommendedCompaniesList] = useState<RecommendedCompany[]>(recommendedCompanies);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { restrictedCompanies } = useRestricted();

  const isRestricted = (companyName: string) => restrictedCompanies.some(rc => rc.name === companyName);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const currentRecs = onUpdateRecommendedCompanies ? recommendedCompanies : recommendedCompaniesList;
  const currentComps = onUpdateCompanies ? companies : companiesList;

  const getBaseList = (): (Company | RecommendedCompany)[] => {
    if (activeTab === 'recommendations') {
      return currentRecs;
    }
    return currentComps;
  };

  const displayedCompanies = getBaseList().filter(c => {
    const restricted = isRestricted(c.name);
    if (activeTab === 'restricted') return restricted;
    if (activeTab === 'all' && restricted) return false;
    if (activeTab === 'recommendations') return true;
    return !restricted;
  }).filter(c => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(term) || 
           c.industry.toLowerCase().includes(term) || 
           c.headquarters.toLowerCase().includes(term);
  });

  // Checkbox selection logic
  const isAllSelected = displayedCompanies.length > 0 && displayedCompanies.every(c => selectedIds.includes(c.id));
  const isSomeSelected = displayedCompanies.some(c => selectedIds.includes(c.id)) && !isAllSelected;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedCompanies.map(c => c.id));
    }
  };

  const handleToggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Add to CRM action
  const handleAddToCrm = (targetIds: string[] = selectedIds, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (targetIds.length === 0) return;

    // Mark as added in recommended list
    const toAddFromRecs = currentRecs.filter(rc => targetIds.includes(rc.id));

    const updatedRecs = currentRecs.map(rc => {
      if (targetIds.includes(rc.id)) {
        return { ...rc, addedToCrm: true, crmCandidatesCount: rc.crmCandidatesCount + 5 };
      }
      return rc;
    });

    if (onUpdateRecommendedCompanies) {
      onUpdateRecommendedCompanies(updatedRecs);
    } else {
      setRecommendedCompaniesList(updatedRecs);
    }

    // Add to companiesList so they appear under All Companies
    const existingNames = new Set(currentComps.map(c => c.name.toLowerCase()));
    const newItems: Company[] = toAddFromRecs.filter(rc => !existingNames.has(rc.name.toLowerCase()));
    const updatedComps = [...currentComps, ...newItems];

    if (onUpdateCompanies) {
      onUpdateCompanies(updatedComps);
    } else {
      setCompaniesList(updatedComps);
    }

    const count = targetIds.length;
    setSelectedIds([]);
    triggerToast(
      count === 1
        ? `Added 1 company to CRM successfully!`
        : `Added ${count} companies to CRM successfully!`
    );
  };

  const handleAddCompaniesFromModal = (companiesToAdd: Company[]) => {
    if (companiesToAdd.length === 0) return;

    const existingNames = new Set(currentComps.map(c => c.name.toLowerCase()));
    const brandNewComps = companiesToAdd.filter(c => !existingNames.has(c.name.toLowerCase()));
    const updatedComps = [...currentComps, ...brandNewComps];

    // Mark any matching recommended companies as added
    const targetNames = new Set(companiesToAdd.map(c => c.name.toLowerCase()));
    const updatedRecs = currentRecs.map(rc => {
      if (targetNames.has(rc.name.toLowerCase())) {
        return { ...rc, addedToCrm: true };
      }
      return rc;
    });

    if (onUpdateRecommendedCompanies) {
      onUpdateRecommendedCompanies(updatedRecs);
    } else {
      setRecommendedCompaniesList(updatedRecs);
    }

    if (onUpdateCompanies) {
      onUpdateCompanies(updatedComps);
    } else {
      setCompaniesList(updatedComps);
    }

    triggerToast(`Added ${companiesToAdd.length} ${companiesToAdd.length === 1 ? 'company' : 'companies'} to CRM workspace!`);
  };

  const handleCreateCompanyFromModal = (newCompany: Company) => {
    const updatedComps = [newCompany, ...currentComps];
    if (onUpdateCompanies) {
      onUpdateCompanies(updatedComps);
    } else {
      setCompaniesList(updatedComps);
    }
    triggerToast(`Created "${newCompany.name}" and added to workspace!`);
  };

  const unaddedRecsCount = currentRecs.filter(r => !r.addedToCrm).length;

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
          <h1 className="text-2xl font-bold text-(--text-strong)">Companies</h1>
          <p className="text-xs text-slate-500 mt-1">Enterprise organizational charts, market maps, and executive mobility intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsRestrictedModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 bg-white transition-colors mr-2"
          >
            <ShieldAlert className="w-4 h-4" /> Restricted Companies
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search companies" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-9 pr-4 py-2 rounded-full border border-slate-300 text-sm focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200) transition-shadow bg-white text-slate-700 placeholder:text-slate-500"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-slate-300 text-(--color-secondary-200) font-semibold text-sm hover:bg-slate-50 bg-white transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <div className="w-px h-6 bg-slate-300 mx-1"></div>
          <button 
            onClick={() => setIsAddCompanyModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-slate-300 text-(--color-secondary-200) font-semibold text-sm hover:bg-slate-50 bg-white transition-colors"
          >
            <span className="text-lg leading-none mb-[2px]">+</span> Add Company
          </button>
          <button className="p-2 text-slate-500 hover:text-slate-700 ml-1 hover:bg-slate-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Phenom-style Horizontal Tabs with Recommendations placed DIRECTLY TO THE RIGHT of All Companies */}
        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar bg-slate-50/50">
          <div className="flex whitespace-nowrap min-w-max">
            {/* 1. All Companies Tab */}
            <button 
              onClick={() => { setActiveTab('all'); setSelectedIds([]); }}
              className={cn(
                "px-5 py-3 text-sm font-semibold border-r border-slate-200 transition-colors",
                activeTab === 'all' ? "bg-white text-slate-900 border-b-2 border-b-(--color-secondary-200)" : "bg-transparent text-slate-600 hover:bg-slate-100 font-medium"
              )}
            >
              All Companies <span className="text-slate-500 font-normal ml-1">{currentComps.length}</span>
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
                {currentRecs.length}
              </span>
            </button>

            {/* 3. Restricted Companies Tab */}
            <button 
              onClick={() => { setActiveTab('restricted'); setSelectedIds([]); }}
              className={cn(
                "px-5 py-3 text-sm font-semibold border-r border-slate-200 flex items-center gap-1",
                activeTab === 'restricted' ? "bg-white text-red-700 border-b-2 border-b-red-600" : "bg-transparent text-slate-600 hover:bg-slate-100 font-medium"
              )}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Restricted Companies <span className="text-slate-500 font-normal ml-1">{restrictedCompanies.length}</span>
            </button>

            <button className="px-5 py-3 text-sm font-medium text-slate-600 border-r border-slate-200 hover:bg-slate-100">
              Target List <span className="text-slate-500 font-normal ml-1">42</span>
            </button>
            <button className="px-5 py-3 text-sm font-medium text-slate-600 border-r border-slate-200 hover:bg-slate-100">
              Enterprise <span className="text-slate-500 font-normal ml-1">315</span>
            </button>
            <button className="px-5 py-3 text-sm font-medium text-slate-600 border-r border-slate-200 hover:bg-slate-100">
              Recent Funding <span className="text-slate-500 font-normal ml-1">89</span>
            </button>
            <button className="px-5 py-3 text-sm font-medium text-slate-600 border-r border-slate-200 hover:bg-slate-100">
              Competitors <span className="text-slate-500 font-normal ml-1">24</span>
            </button>
          </div>
        </div>

        {/* Bulk Action Toolbar when checkboxes are selected */}
        {selectedIds.length > 0 && (
          <div className="bg-purple-50/80 border-b border-purple-200 px-6 py-2.5 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-purple-900 bg-purple-200/70 px-2.5 py-1 rounded-md">
                {selectedIds.length} {selectedIds.length > 1 ? 'companies' : 'company'} selected
              </span>
              <span className="text-xs text-purple-700">Choose an action for selected organizations:</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => handleAddToCrm(selectedIds, e)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
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
                <strong>Aura Agent Recommended Companies:</strong> High-yield peer organizations identified with elevated executive mobility signals and leadership transitions.
              </span>
            </div>
            {unaddedRecsCount > 0 && (
              <button 
                onClick={(e) => handleAddToCrm(currentRecs.filter(r => !r.addedToCrm).map(r => r.id), e)}
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
                  {/* Checkbox Header */}
                  <th className="w-12 px-4 py-4 text-center">
                    <input 
                      type="checkbox"
                      checked={isAllSelected}
                      ref={el => {
                        if (el) el.indeterminate = isSomeSelected;
                      }}
                      onChange={handleToggleSelectAll}
                      aria-label="Select all companies"
                      className="w-4 h-4 rounded border-slate-300 text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-slate-100">
                    <div className="flex items-center gap-2">Company Name <ArrowUpDown className="w-3.5 h-3.5"/></div>
                  </th>
                  <th className="px-6 py-4">Industry</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4">Headquarters</th>

                  {/* NO score columns in Recommendations tab! */}
                  {activeTab === 'recommendations' ? (
                    <>
                      <th className="px-6 py-4">Recommendation Reason</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-right">Executives</th>
                      <th className="px-6 py-4 text-right">Relevant Candidates</th>
                      <th className="px-6 py-4 text-right">In CRM</th>
                      <th className="px-6 py-4 text-right">Leadership Changes</th>
                      <th className="px-6 py-4 text-right">Active Searches</th>
                      <th className="px-6 py-4">Last Updated</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedCompanies.map((company) => {
                  const isSelected = selectedIds.includes(company.id);
                  const isRec = 'recommendationReason' in company;
                  const isAddedToCrm = (company as RecommendedCompany).addedToCrm;

                  return (
                    <tr 
                      key={company.id} 
                      onClick={() => onSelectCompany(company)}
                      className={cn(
                        "hover:bg-slate-50/80 cursor-pointer transition-colors group",
                        isSelected && "bg-purple-50/40"
                      )}
                    >
                      {/* Checkbox Column */}
                      <td className="w-12 px-4 py-4 text-center" onClick={(e) => handleToggleSelectRow(company.id, e)}>
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          aria-label={`Select ${company.name}`}
                          className="w-4 h-4 rounded border-slate-300 text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                        />
                      </td>

                      {/* Company Name */}
                      <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span>{company.name}</span>
                          {isRestricted(company.name) && (
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
                      </td>

                      <td className="px-6 py-4 text-slate-600">{company.industry}</td>
                      <td className="px-6 py-4 text-slate-600">{company.size}</td>
                      <td className="px-6 py-4 text-slate-600">{company.revenue}</td>
                      <td className="px-6 py-4 text-slate-600">{company.headquarters}</td>

                      {/* Recommendations View Columns: Baseline data ONLY + Recommendation Reason & Action (NO score index) */}
                      {activeTab === 'recommendations' ? (
                        <>
                          <td className="px-6 py-4 text-xs text-slate-600 max-w-sm truncate" title={(company as RecommendedCompany).recommendationReason}>
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span className="truncate">{(company as RecommendedCompany).recommendationReason}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                            {isAddedToCrm ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 px-3 py-1 bg-emerald-50 rounded-lg">
                                <Check className="w-3.5 h-3.5" /> In CRM
                              </span>
                            ) : (
                              <button 
                                onClick={(e) => handleAddToCrm([company.id], e)}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-(--color-secondary-200) text-(--color-secondary-200) hover:bg-(--color-secondary-200) hover:text-white text-xs font-semibold transition-colors shadow-2xs"
                              >
                                <PlusCircle className="w-3 h-3" /> Add to CRM
                              </button>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 text-right font-medium text-slate-700">{company.executivesCount}</td>
                          <td className="px-6 py-4 text-right font-medium text-slate-700">{company.relevantCandidatesCount}</td>
                          <td className="px-6 py-4 text-right font-medium text-slate-700">{company.crmCandidatesCount}</td>
                          <td className="px-6 py-4 text-right font-medium text-amber-600">{company.activeLeadershipChanges}</td>
                          <td className="px-6 py-4 text-right font-medium text-blue-600">{company.activeSearchesCount}</td>
                          <td className="px-6 py-4 text-slate-500 text-xs">{company.lastUpdated}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {displayedCompanies.length === 0 && (
              <div className="p-8 text-center text-slate-500">No companies found matching your search.</div>
            )}
          </div>
        </div>
      </div>
      
      {isRestrictedModalOpen && (
        <RestrictedCompaniesModal onClose={() => setIsRestrictedModalOpen(false)} />
      )}

      <AddCompanyModal
        isOpen={isAddCompanyModalOpen}
        onOpenChange={setIsAddCompanyModalOpen}
        existingCompanies={currentComps}
        recommendedCompanies={currentRecs}
        onAddCompanies={handleAddCompaniesFromModal}
        onCreateCompany={handleCreateCompanyFromModal}
      />
    </div>
  );
}
