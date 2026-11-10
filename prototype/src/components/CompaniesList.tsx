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
  BrainCircuit,
  MoreVertical
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

  const errTag = { background: 'var(--feedback-error-bg-light)', color: 'var(--feedback-error-text-strong)' };
  const okTag = { background: 'var(--feedback-success-bg-light)', color: 'var(--feedback-success-text-strong)' };

  const tabBtn = (id: string, label: React.ReactNode, count: React.ReactNode, onSelect?: () => void) => (
    <button
      key={id}
      type="button"
      role="tab"
      aria-selected={activeTab === id}
      onClick={onSelect}
    >
      {label}
      <span className="font-normal text-(--text-default)">{count}</span>
    </button>
  );

  const select = (id: string) => () => { setActiveTab(id); setSelectedIds([]); };

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full h-full flex flex-col relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="phx-feedback fixed bottom-6 right-6 z-50 flex items-center gap-3 shadow-lg" data-tone="success" role="status">
          <Check className="w-4 h-4" aria-hidden="true" />
          <span>{toastMessage}</span>
          <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" onClick={() => setToastMessage(null)} aria-label="Dismiss message">
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-(--text-strong)">Companies</h1>
          <p className="text-sm text-(--text-default) mt-1">Enterprise organizational charts, market maps, and executive mobility intelligence</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={() => setIsRestrictedModalOpen(true)}>
            <ShieldAlert className="w-4 h-4" aria-hidden="true" /> Restricted Companies
          </button>

          <div className="phx-input-icon">
            <Search aria-hidden="true" />
            <input
              type="search"
              aria-label="Search companies"
              placeholder="Search companies"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 256 }}
            />
          </div>
          <button type="button" className="phx-btn" data-variant="secondary" data-size="sm">
            <Filter className="w-4 h-4" aria-hidden="true" /> Filters
          </button>
          <button type="button" className="phx-btn" data-variant="primary" data-size="sm" onClick={() => setIsAddCompanyModalOpen(true)}>
            <PlusCircle className="w-4 h-4" aria-hidden="true" /> Add Company
          </button>
          <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" aria-label="More actions">
            <MoreVertical className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="bg-(--bg-default) rounded-2xl border border-(--border-light) flex flex-col flex-1 min-h-0 overflow-hidden">
        <div role="tablist" aria-label="Company lists" className="px-4 gap-2">
          {tabBtn('all', 'All Companies', currentComps.length, select('all'))}
          {tabBtn(
            'recommendations',
            <>
              <Sparkles className="w-4 h-4 text-(--color-secondary-200)" aria-hidden="true" /> Recommendations
            </>,
            currentRecs.length,
            select('recommendations')
          )}
          {tabBtn(
            'restricted',
            <>
              <ShieldAlert className="w-4 h-4" style={{ color: 'var(--feedback-error-text-strong)' }} aria-hidden="true" /> Restricted Companies
            </>,
            restrictedCompanies.length,
            select('restricted')
          )}
          {tabBtn('target-list', 'Target List', 42)}
          {tabBtn('enterprise', 'Enterprise', 315)}
          {tabBtn('recent-funding', 'Recent Funding', 89)}
          {tabBtn('competitors', 'Competitors', 24)}
        </div>

        {/* Bulk Action Toolbar when checkboxes are selected */}
        {selectedIds.length > 0 && (
          <div className="bg-(--bg-brand-secondary-subtle) border-b border-(--border-light) px-6 py-2.5 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-(--text-strong)">
                {selectedIds.length} {selectedIds.length > 1 ? 'companies' : 'company'} selected
              </span>
              <span className="text-sm text-(--text-default)">Choose an action for the selected organizations.</span>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={(e) => handleAddToCrm(selectedIds, e)}>
                <PlusCircle className="w-4 h-4" aria-hidden="true" /> Add to CRM ({selectedIds.length})
              </button>
              <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" onClick={() => setSelectedIds([])}>
                Deselect all
              </button>
            </div>
          </div>
        )}

        {/* Recommendations Context Banner */}
        {activeTab === 'recommendations' && selectedIds.length === 0 && (
          <div className="phx-feedback flex items-center justify-between gap-3 m-4" data-tone="progressive">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                <strong>Agent recommended companies:</strong> peer organizations with elevated executive mobility signals and leadership transitions.
              </span>
            </div>
            {unaddedRecsCount > 0 && (
              <button
                type="button"
                className="phx-btn shrink-0"
                data-variant="secondary"
                data-size="sm"
                onClick={(e) => handleAddToCrm(currentRecs.filter(r => !r.addedToCrm).map(r => r.id), e)}
              >
                <PlusCircle className="w-4 h-4" aria-hidden="true" /> Add all {unaddedRecsCount} to CRM
              </button>
            )}
          </div>
        )}

        <div className="flex-1 min-h-0 relative">
          <div className="absolute inset-0 overflow-auto">
            <table className="phx-table whitespace-nowrap">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={el => {
                        if (el) el.indeterminate = isSomeSelected;
                      }}
                      onChange={handleToggleSelectAll}
                      aria-label="Select all companies"
                      className="w-4 h-4 accent-(--color-secondary-200) cursor-pointer"
                    />
                  </th>
                  <th aria-sort="none">
                    <span className="inline-flex items-center gap-2">Company Name <ArrowUpDown className="w-4 h-4" aria-hidden="true" /></span>
                  </th>
                  <th>Industry</th>
                  <th>Size</th>
                  <th>Revenue</th>
                  <th>Headquarters</th>

                  {activeTab === 'recommendations' ? (
                    <>
                      <th>Recommendation Reason</th>
                      <th className="text-right">Action</th>
                    </>
                  ) : (
                    <>
                      <th className="text-right">Executives</th>
                      <th className="text-right">Relevant Candidates</th>
                      <th className="text-right">In CRM</th>
                      <th className="text-right">Leadership Changes</th>
                      <th className="text-right">Active Searches</th>
                      <th>Last Updated</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {displayedCompanies.map((company) => {
                  const isSelected = selectedIds.includes(company.id);
                  const isRec = 'recommendationReason' in company;
                  const isAddedToCrm = (company as RecommendedCompany).addedToCrm;

                  return (
                    <tr
                      key={company.id}
                      onClick={() => onSelectCompany(company)}
                      aria-selected={isSelected}
                      className="cursor-pointer"
                    >
                      <td className="w-12 text-center" onClick={(e) => handleToggleSelectRow(company.id, e)}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          aria-label={`Select ${company.name}`}
                          className="w-4 h-4 accent-(--color-secondary-200) cursor-pointer"
                        />
                      </td>

                      <td>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-(--text-subtle)" aria-hidden="true" />
                          <span className="font-semibold text-(--text-strong)">{company.name}</span>
                          {isRestricted(company.name) && (
                            <span className="phx-tag" data-size="sm" style={errTag}>
                              <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" /> Restricted
                            </span>
                          )}
                          {isRec && isAddedToCrm && (
                            <span className="phx-tag" data-size="sm" style={okTag}>
                              <Check className="w-3.5 h-3.5" aria-hidden="true" /> In CRM
                            </span>
                          )}
                        </div>
                      </td>

                      <td>{company.industry}</td>
                      <td>{company.size}</td>
                      <td>{company.revenue}</td>
                      <td>{company.headquarters}</td>

                      {activeTab === 'recommendations' ? (
                        <>
                          <td className="max-w-sm truncate" title={(company as RecommendedCompany).recommendationReason}>
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-(--color-secondary-200) shrink-0" aria-hidden="true" />
                              <span className="truncate">{(company as RecommendedCompany).recommendationReason}</span>
                            </div>
                          </td>
                          <td className="text-right" onClick={(e) => e.stopPropagation()}>
                            {isAddedToCrm ? (
                              <span className="phx-tag" style={okTag}>
                                <Check className="w-3.5 h-3.5" aria-hidden="true" /> In CRM
                              </span>
                            ) : (
                              <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={(e) => handleAddToCrm([company.id], e)}>
                                <PlusCircle className="w-4 h-4" aria-hidden="true" /> Add to CRM
                              </button>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="text-right">{company.executivesCount}</td>
                          <td className="text-right">{company.relevantCandidatesCount}</td>
                          <td className="text-right">{company.crmCandidatesCount}</td>
                          <td className="text-right">{company.activeLeadershipChanges}</td>
                          <td className="text-right">{company.activeSearchesCount}</td>
                          <td className="phx-subtle">{company.lastUpdated}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {displayedCompanies.length === 0 && (
              <div className="p-8 text-center text-sm text-(--text-default)">No companies found matching your search.</div>
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
