import React, { useState, useMemo, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  X, 
  Search, 
  Filter, 
  ShieldAlert, 
  Sparkles, 
  Building2, 
  Check, 
  Plus, 
  Lock, 
  TrendingUp, 
  Globe, 
  MapPin, 
  Users, 
  DollarSign, 
  Layers, 
  PlusCircle, 
  ChevronDown,
  Info,
  ChevronUp,
  CheckSquare,
  Square,
  Target,
  Flame,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Company, RecommendedCompany } from '../types';
import { initialDirectoryCompanies, DirectoryCompany } from '../data/companyDirectoryData';
import { useRestricted } from '../context/RestrictedContext';
import { cn } from '../lib/utils';

interface AddCompanyModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  existingCompanies: Company[];
  recommendedCompanies?: RecommendedCompany[];
  onAddCompanies: (companiesToAdd: Company[]) => void;
  onCreateCompany: (newCompany: Company) => void;
}

const COMMON_INDUSTRIES = [
  'Enterprise B2B SaaS',
  'Cybersecurity & Network Defense',
  'Cloud Infrastructure & DevOps',
  'Data & Analytics',
  'Financial Technology & Payments',
  'Semiconductors & Systems',
  'Consumer Electronics & Hardware',
  'HealthTech & Digital Health',
  'E-Commerce & Marketplaces',
  'Advanced Computing & Systems'
];

const STAGE_OPTIONS = [
  { label: 'Series B–D ($20M–$100M ARR)', value: 'Series B-D' },
  { label: 'Pre-IPO Unicorn', value: 'Pre-IPO Unicorn' },
  { label: 'Public Enterprise ($1B–$10B)', value: 'Public Enterprise ($1B-$10B)' },
  { label: 'Mega-Cap ($10B+)', value: 'Mega-Cap ($10B+)' }
];

const SIZE_OPTIONS = [
  { label: '1,001–5,000 employees', value: '1,001-5,000 employees' },
  { label: '5,001–10,000 employees', value: '5,001-10,000 employees' },
  { label: '10,001+ employees', value: '10,001+ employees' }
];

const MOBILITY_OPTIONS = [
  { label: 'High Mobility (>88% Index)', value: 'high_mobility' },
  { label: 'High Leadership Churn (4+ changes)', value: 'high_churn' }
];

const COMPLIANCE_OPTIONS = [
  { label: 'Available (Unrestricted)', value: 'available' },
  { label: 'Restricted / Off-Limits', value: 'restricted' }
];

// Reusable Multi-Select Dropdown Component
interface MultiSelectDropdownProps {
  label: string;
  options: { label: string; value: string; count?: number }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onChange,
  isOpen,
  onToggle,
  onClose
}: MultiSelectDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const toggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter(v => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const selectAll = () => {
    onChange(options.map(o => o.value));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 select-none",
          selectedValues.length > 0
            ? "bg-(--color-secondary-200)/5 border-(--color-secondary-200) text-(--color-secondary-200) shadow-2xs"
            : "bg-white border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
        )}
      >
        <span>{label}</span>
        {selectedValues.length > 0 && (
          <span className="px-1.5 py-0.2 bg-(--color-secondary-200) text-white rounded-full text-[10px] font-bold">
            {selectedValues.length}
          </span>
        )}
        <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-2 animate-fadeIn">
          <div className="px-3 pb-2 mb-1 border-b border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-600 uppercase tracking-wider">{label}</span>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={selectAll}
                className="text-(--color-secondary-200) hover:underline font-semibold"
              >
                Select all
              </button>
              <span className="text-slate-300">|</span>
              <button 
                type="button" 
                onClick={clearAll}
                className="text-slate-500 hover:text-slate-800 font-semibold"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto px-1 py-1 space-y-0.5">
            {options.map(option => {
              const checked = selectedValues.includes(option.value);
              return (
                <div
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer select-none transition-colors",
                    checked ? "bg-(--color-secondary-200)/5 text-(--color-secondary-200) font-medium" : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 rounded text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                    />
                    <span className="truncate">{option.label}</span>
                  </div>
                  {typeof option.count === 'number' && (
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      {option.count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function AddCompanyModal({
  isOpen,
  onOpenChange,
  existingCompanies,
  recommendedCompanies = [],
  onAddCompanies,
  onCreateCompany
}: AddCompanyModalProps) {
  const { restrictedCompanies } = useRestricted();

  // Mode: 'browse' (Directory & Recommendations) or 'create' (Create New Company)
  const [activeMode, setActiveMode] = useState<'browse' | 'create'>('browse');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Multi-select filter arrays
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMobility, setSelectedMobility] = useState<string[]>([]);
  const [selectedCompliance, setSelectedCompliance] = useState<string[]>([]);

  // Open dropdown tracker
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Recommendations collapsed state
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Multi-selection state (list of company IDs selected for adding)
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [restrictedAlertMessage, setRestrictedAlertMessage] = useState<string | null>(null);
  const [selectedCompanyForInsights, setSelectedCompanyForInsights] = useState<DirectoryCompany | null>(null);

  // Create form state
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Enterprise B2B SaaS');
  const [headquarters, setHeadquarters] = useState('');
  const [size, setSize] = useState('1,001-5,000 employees');
  const [revenue, setRevenue] = useState('$50M ARR');
  const [description, setDescription] = useState('');
  const [executivesCount, setExecutivesCount] = useState<number>(35);
  const [relevantCandidatesCount, setRelevantCandidatesCount] = useState<number>(12);
  const [activeLeadershipChanges, setActiveLeadershipChanges] = useState<number>(2);
  const [activeSearchesCount, setActiveSearchesCount] = useState<number>(1);

  // Tags for custom creation
  const [growthIndicators, setGrowthIndicators] = useState<string[]>(['30% YoY Revenue Growth', 'Expanding R&D Division']);
  const [newGrowthInput, setNewGrowthInput] = useState('');
  const [recentAcquisitions, setRecentAcquisitions] = useState<string[]>([]);
  const [newAcqInput, setNewAcqInput] = useState('');
  const [activeOpenings, setActiveOpenings] = useState<string[]>(['VP of Engineering', 'Head of Product']);
  const [newOpeningInput, setNewOpeningInput] = useState('');
  const [strategicInitiatives, setStrategicInitiatives] = useState<string[]>(['Next-Gen Platform Migration']);
  const [newInitiativeInput, setNewInitiativeInput] = useState('');

  // Check if a company is restricted
  const getRestrictedInfo = (companyName: string) => {
    return restrictedCompanies.find(
      rc => rc.name.toLowerCase() === companyName.toLowerCase()
    );
  };

  // ONLY NEW COMPANIES: Exclude all companies already present in existingCompanies!
  const availableNewCompanies: DirectoryCompany[] = useMemo(() => {
    const existingNames = new Set(existingCompanies.map(c => c.name.toLowerCase()));
    return initialDirectoryCompanies.filter(
      c => !existingNames.has(c.name.toLowerCase())
    );
  }, [existingCompanies]);

  // Recommended companies that are NOT yet added
  const recommendationsList = useMemo(() => {
    return availableNewCompanies.filter(c => c.isRecommended || c.recommendationReason);
  }, [availableNewCompanies]);

  // Industry filter options with counts
  const industryOptions = useMemo(() => {
    return COMMON_INDUSTRIES.map(ind => ({
      label: ind,
      value: ind,
      count: availableNewCompanies.filter(c => c.industry.toLowerCase().includes(ind.toLowerCase())).length
    }));
  }, [availableNewCompanies]);

  // Stage filter options with counts
  const stageOptions = useMemo(() => {
    return STAGE_OPTIONS.map(st => ({
      label: st.label,
      value: st.value,
      count: availableNewCompanies.filter(c => c.stage === st.value).length
    }));
  }, [availableNewCompanies]);

  // Size filter options with counts
  const sizeOptions = useMemo(() => {
    return SIZE_OPTIONS.map(sz => ({
      label: sz.label,
      value: sz.value,
      count: availableNewCompanies.filter(c => c.size.toLowerCase().includes(sz.value.toLowerCase())).length
    }));
  }, [availableNewCompanies]);

  // Compliance filter options with counts
  const complianceOptions = useMemo(() => {
    const restrictedCount = availableNewCompanies.filter(c => !!getRestrictedInfo(c.name)).length;
    const availableCount = availableNewCompanies.length - restrictedCount;
    return [
      { label: 'Available (Unrestricted)', value: 'available', count: availableCount },
      { label: 'Restricted / Off-Limits', value: 'restricted', count: restrictedCount }
    ];
  }, [availableNewCompanies, restrictedCompanies]);

  // Filtered companies based on search & multi-select filters
  const filteredCompanies = useMemo(() => {
    return availableNewCompanies.filter(comp => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = comp.name.toLowerCase().includes(query);
        const matchesInd = comp.industry.toLowerCase().includes(query);
        const matchesHq = comp.headquarters.toLowerCase().includes(query);
        const matchesDesc = comp.description.toLowerCase().includes(query);
        const matchesReason = comp.recommendationReason?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesInd && !matchesHq && !matchesDesc && !matchesReason) {
          return false;
        }
      }

      // 2. Multi-Select Industry Filter
      if (selectedIndustries.length > 0) {
        const matchesAnyIndustry = selectedIndustries.some(ind =>
          comp.industry.toLowerCase().includes(ind.toLowerCase())
        );
        if (!matchesAnyIndustry) return false;
      }

      // 3. Multi-Select Size Filter
      if (selectedSizes.length > 0) {
        const matchesAnySize = selectedSizes.some(sz =>
          comp.size.toLowerCase().includes(sz.toLowerCase())
        );
        if (!matchesAnySize) return false;
      }

      // 4. Multi-Select Stage Filter
      if (selectedStages.length > 0) {
        if (!comp.stage || !selectedStages.includes(comp.stage)) {
          return false;
        }
      }

      // 5. Multi-Select Mobility Filter
      if (selectedMobility.length > 0) {
        const matchesAnyMobility = selectedMobility.some(mob => {
          if (mob === 'high_mobility') {
            const mobVal = parseInt(comp.mobilitySignal?.replace(/\D/g, '') || '0', 10);
            return mobVal >= 88;
          }
          if (mob === 'high_churn') {
            return comp.activeLeadershipChanges >= 4;
          }
          return false;
        });
        if (!matchesAnyMobility) return false;
      }

      // 6. Multi-Select Compliance Filter
      if (selectedCompliance.length > 0) {
        const isRestricted = !!getRestrictedInfo(comp.name);
        const matchAvailable = selectedCompliance.includes('available') && !isRestricted;
        const matchRestricted = selectedCompliance.includes('restricted') && isRestricted;
        if (!matchAvailable && !matchRestricted) return false;
      }

      return true;
    });
  }, [
    availableNewCompanies, 
    searchQuery, 
    selectedIndustries, 
    selectedSizes, 
    selectedStages, 
    selectedMobility, 
    selectedCompliance, 
    restrictedCompanies
  ]);

  // Selection handlers
  const handleToggleSelect = (comp: DirectoryCompany) => {
    const restricted = getRestrictedInfo(comp.name);
    if (restricted) {
      setRestrictedAlertMessage(`"${comp.name}" is on the Restricted / Off-Limits list (${restricted.reason}). Executive recruiting from this company is prohibited.`);
      setTimeout(() => setRestrictedAlertMessage(null), 5000);
      return;
    }

    setSelectedCompanyIds(prev => 
      prev.includes(comp.id) ? prev.filter(id => id !== comp.id) : [...prev, comp.id]
    );
  };

  const handleRemoveSelectedId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedCompanyIds(prev => prev.filter(item => item !== id));
  };

  const handleSelectAllFiltered = () => {
    const selectableFilteredIds = filteredCompanies
      .filter(c => !getRestrictedInfo(c.name))
      .map(c => c.id);
    
    const allSelected = selectableFilteredIds.length > 0 && selectableFilteredIds.every(id => selectedCompanyIds.includes(id));
    if (allSelected) {
      setSelectedCompanyIds(prev => prev.filter(id => !selectableFilteredIds.includes(id)));
    } else {
      setSelectedCompanyIds(prev => Array.from(new Set([...prev, ...selectableFilteredIds])));
    }
  };

  const handleSaveSelected = () => {
    if (selectedCompanyIds.length === 0) return;

    const companiesToAdd = availableNewCompanies
      .filter(c => selectedCompanyIds.includes(c.id))
      .filter(c => !getRestrictedInfo(c.name))
      .map(c => {
        const { isRecommended, tier, stage, ...baseCompany } = c;
        return baseCompany as Company;
      });

    onAddCompanies(companiesToAdd);
    setSelectedCompanyIds([]);
    onOpenChange(false);
  };

  const handleAddSingleCompany = (comp: DirectoryCompany) => {
    const restricted = getRestrictedInfo(comp.name);
    if (restricted) {
      setRestrictedAlertMessage(`Cannot add "${comp.name}": it is currently on the Restricted / Off-Limits list (${restricted.reason}).`);
      setTimeout(() => setRestrictedAlertMessage(null), 5000);
      return;
    }

    const { isRecommended, tier, stage, ...baseCompany } = comp;
    onAddCompanies([baseCompany as Company]);
    setSelectedCompanyIds(prev => prev.filter(id => id !== comp.id));
    setSelectedCompanyForInsights(null);
  };

  // Custom company creation handler
  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const restricted = getRestrictedInfo(name.trim());
    if (restricted) {
      setRestrictedAlertMessage(`Cannot create "${name.trim()}": it is an active restricted/off-limits entity (${restricted.reason}).`);
      setTimeout(() => setRestrictedAlertMessage(null), 5000);
      return;
    }

    const newComp: Company = {
      id: `comp-custom-${Date.now()}`,
      name: name.trim(),
      industry: industry.trim() || 'Enterprise B2B SaaS',
      size: size || '1,001-5,000 employees',
      revenue: revenue.trim() || '$50M ARR',
      headquarters: headquarters.trim() || 'San Francisco, CA',
      website: website.trim() ? website.trim().replace(/^https?:\/\//, '') : `${name.trim().toLowerCase().replace(/\s+/g, '')}.com`,
      description: description.trim() || `${name.trim()} operates in the ${industry} space, innovating across core cloud and executive operational capabilities.`,
      executivesCount: Number(executivesCount) || 30,
      relevantCandidatesCount: Number(relevantCandidatesCount) || 10,
      crmCandidatesCount: 0,
      activeLeadershipChanges: Number(activeLeadershipChanges) || 1,
      activeSearchesCount: Number(activeSearchesCount) || 1,
      lastUpdated: 'Just now',
      growthIndicators: growthIndicators.length > 0 ? growthIndicators : ['Recent expansion', 'Strategic hiring'],
      recentAcquisitions: recentAcquisitions,
      activeOpenings: activeOpenings.length > 0 ? activeOpenings : ['VP of Engineering'],
      strategicInitiatives: strategicInitiatives.length > 0 ? strategicInitiatives : ['Core Platform Modernization']
    };

    onCreateCompany(newComp);
    onOpenChange(false);
  };

  // Tags add/remove helpers
  const addTag = (
    currentList: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    inputVal: string,
    setInputVal: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (inputVal.trim() && !currentList.includes(inputVal.trim())) {
      setList([...currentList, inputVal.trim()]);
      setInputVal('');
    }
  };

  const removeTag = (
    currentList: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    tagToRemove: string
  ) => {
    setList(currentList.filter(t => t !== tagToRemove));
  };

  // Selected companies details
  const selectedCompaniesList = useMemo(() => {
    return availableNewCompanies.filter(c => selectedCompanyIds.includes(c.id));
  }, [availableNewCompanies, selectedCompanyIds]);

  // Active filters count
  const activeFiltersCount = 
    selectedIndustries.length +
    selectedStages.length +
    selectedSizes.length +
    selectedMobility.length +
    selectedCompliance.length;

  const resetAllFilters = () => {
    setSelectedIndustries([]);
    setSelectedStages([]);
    setSelectedSizes([]);
    setSelectedMobility([]);
    setSelectedCompliance([]);
    setSearchQuery('');
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 animate-fadeIn" />
        
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] max-w-[1240px] h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-scaleIn">
          
          {/* Header */}
          <div className="px-8 py-5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
            <div>
              <Dialog.Title className="text-xl font-bold text-slate-900 tracking-tight">
                Add Companies
              </Dialog.Title>
              <Dialog.Description className="text-xs text-slate-500 mt-0.5">
                Explore prospective organizations to add to your pipeline, or create a new company profile.
              </Dialog.Description>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveMode('browse')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2",
                    activeMode === 'browse'
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Search className="w-3.5 h-3.5" />
                  Directory & Recommendations
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('create')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2",
                    activeMode === 'create'
                      ? "bg-white text-(--color-secondary-200) shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create New Company
                </button>
              </div>

              <Dialog.Close asChild>
                <button 
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors ml-2"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Compliance Notice Banner (if poach restriction is triggered) */}
          {restrictedAlertMessage && (
            <div className="bg-red-50 border-b border-red-200 px-8 py-3 flex items-center justify-between text-red-800 text-xs font-medium animate-fadeIn shrink-0">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>{restrictedAlertMessage}</span>
              </div>
              <button 
                onClick={() => setRestrictedAlertMessage(null)}
                className="text-red-500 hover:text-red-800 font-semibold text-xs ml-4"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* MAIN CONTENT AREA */}
          {activeMode === 'browse' ? (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50/30">
              
              {/* Recommended Source Companies Highlight (Phenom Brand Colors & Styling) */}
              {recommendationsList.length > 0 && (
                <div className="px-8 py-4 border-b border-(--color-secondary-200)/20 bg-gradient-to-r from-(--color-secondary-200)/[0.07] via-purple-500/[0.04] to-indigo-50/30 shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-(--color-secondary-200) to-(--color-secondary-100) flex items-center justify-center text-white shadow-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                          Recommended Source Companies
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark) border border-(--color-secondary-50)">
                          {recommendationsList.length} Targets
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-normal hidden sm:inline">
                        — High executive mobility and leadership transitions
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowRecommendations(!showRecommendations)}
                      className="text-xs text-slate-600 hover:text-(--color-secondary-200) font-semibold flex items-center gap-1 transition-colors"
                    >
                      {showRecommendations ? 'Hide recommendations' : 'Show recommendations'}
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform text-(--color-secondary-200)", showRecommendations && "rotate-180")} />
                    </button>
                  </div>

                  {showRecommendations && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {recommendationsList.slice(0, 4).map(rec => {
                        const isSelected = selectedCompanyIds.includes(rec.id);
                        const isRestricted = !!getRestrictedInfo(rec.name);

                        return (
                          <div 
                            key={rec.id}
                            onClick={() => !isRestricted && handleToggleSelect(rec)}
                            className={cn(
                              "rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer relative overflow-hidden group shadow-2xs",
                              isSelected 
                                ? "bg-gradient-to-b from-(--color-secondary-200)/[0.08] to-purple-50/60 border-(--color-secondary-200) ring-2 ring-(--color-secondary-200)/30 shadow-md shadow-(--color-secondary-200)/10" 
                                : "bg-white border-(--color-secondary-200)/20 hover:border-(--color-secondary-200) hover:shadow-md hover:shadow-(--color-secondary-200)/15"
                            )}
                          >
                            {/* Phenom Brand Accent Top Border */}
                            <div className="h-1 w-full bg-gradient-to-r from-(--color-secondary-200) via-(--color-secondary-100) to-(--color-primary-200)" />

                            <div className="p-3.5 flex flex-col flex-1 justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-1.5 mb-2">
                                  <div>
                                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-(--color-secondary-200) transition-colors leading-tight">
                                      {rec.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[145px]">
                                      {rec.industry} • {rec.headquarters}
                                    </p>
                                  </div>
                                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark) border border-(--color-secondary-50) shrink-0">
                                    {rec.mobilitySignal || '90% Mobility'}
                                  </span>
                                </div>

                                <div className="bg-(--color-secondary-200)/[0.04] border border-(--color-secondary-200)/15 rounded-lg p-2 mb-2.5">
                                  <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed">
                                    <span className="font-bold text-(--color-secondary-200)">Context: </span>
                                    {rec.recommendationReason}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                                <span className="text-slate-600 font-medium">
                                  <strong className="text-slate-900">{rec.executivesCount}</strong> execs · <strong className="text-(--color-secondary-200)">{rec.relevantCandidatesCount}</strong> relevant
                                </span>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleSelect(rec);
                                  }}
                                  className={cn(
                                    "px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1",
                                    isSelected
                                      ? "bg-(--color-secondary-200) text-white shadow-2xs"
                                      : "bg-(--color-secondary-200)/10 hover:bg-(--color-secondary-200) hover:text-white text-(--color-secondary-200)"
                                  )}
                                >
                                  {isSelected ? (
                                    <>
                                      <Check className="w-3 h-3 stroke-[3]" />
                                      Selected
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3 h-3" />
                                      Select
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Multi-Select Filter Bar */}
              <div className="px-8 py-3.5 border-b border-slate-200 bg-white shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  
                  {/* Search and Dropdowns */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-[340px] flex-wrap">
                    
                    {/* Search Field */}
                    <div className="relative w-64">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Search company, sector, location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-7 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200) bg-white transition-colors placeholder:text-slate-400"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* 1. Sector Multi-Select */}
                    <MultiSelectDropdown
                      label="Sector"
                      options={industryOptions}
                      selectedValues={selectedIndustries}
                      onChange={setSelectedIndustries}
                      isOpen={openDropdown === 'industry'}
                      onToggle={() => setOpenDropdown(openDropdown === 'industry' ? null : 'industry')}
                      onClose={() => setOpenDropdown(null)}
                    />

                    {/* 2. Stage Multi-Select */}
                    <MultiSelectDropdown
                      label="Stage"
                      options={stageOptions}
                      selectedValues={selectedStages}
                      onChange={setSelectedStages}
                      isOpen={openDropdown === 'stage'}
                      onToggle={() => setOpenDropdown(openDropdown === 'stage' ? null : 'stage')}
                      onClose={() => setOpenDropdown(null)}
                    />

                    {/* 3. Company Size Multi-Select */}
                    <MultiSelectDropdown
                      label="Size"
                      options={sizeOptions}
                      selectedValues={selectedSizes}
                      onChange={setSelectedSizes}
                      isOpen={openDropdown === 'size'}
                      onToggle={() => setOpenDropdown(openDropdown === 'size' ? null : 'size')}
                      onClose={() => setOpenDropdown(null)}
                    />

                    {/* 4. Mobility Multi-Select */}
                    <MultiSelectDropdown
                      label="Mobility"
                      options={MOBILITY_OPTIONS}
                      selectedValues={selectedMobility}
                      onChange={setSelectedMobility}
                      isOpen={openDropdown === 'mobility'}
                      onToggle={() => setOpenDropdown(openDropdown === 'mobility' ? null : 'mobility')}
                      onClose={() => setOpenDropdown(null)}
                    />

                    {/* 5. Compliance Multi-Select */}
                    <MultiSelectDropdown
                      label="Compliance"
                      options={complianceOptions}
                      selectedValues={selectedCompliance}
                      onChange={setSelectedCompliance}
                      isOpen={openDropdown === 'compliance'}
                      onToggle={() => setOpenDropdown(openDropdown === 'compliance' ? null : 'compliance')}
                      onClose={() => setOpenDropdown(null)}
                    />
                  </div>

                  {/* Results Count & Reset */}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={resetAllFilters}
                        className="text-rose-600 hover:text-rose-800 font-semibold transition-colors"
                      >
                        Reset filters ({activeFiltersCount})
                      </button>
                    )}
                    <span className="font-medium text-slate-600">
                      Showing <strong className="text-slate-900">{filteredCompanies.length}</strong> new companies
                    </span>
                  </div>
                </div>

                {/* Active Filter Tags */}
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 mr-1">Active filters:</span>
                    
                    {selectedIndustries.map(ind => (
                      <span key={ind} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        Sector: {ind}
                        <button onClick={() => setSelectedIndustries(selectedIndustries.filter(i => i !== ind))} className="hover:text-rose-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {selectedStages.map(st => (
                      <span key={st} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        Stage: {st}
                        <button onClick={() => setSelectedStages(selectedStages.filter(s => s !== st))} className="hover:text-rose-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {selectedSizes.map(sz => (
                      <span key={sz} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        Size: {sz}
                        <button onClick={() => setSelectedSizes(selectedSizes.filter(s => s !== sz))} className="hover:text-rose-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {selectedMobility.map(mob => (
                      <span key={mob} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-xs font-medium">
                        {mob === 'high_mobility' ? 'High Mobility' : 'Leadership Churn'}
                        <button onClick={() => setSelectedMobility(selectedMobility.filter(m => m !== mob))} className="hover:text-rose-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {selectedCompliance.map(comp => (
                      <span key={comp} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        {comp === 'available' ? 'Available' : 'Restricted'}
                        <button onClick={() => setSelectedCompliance(selectedCompliance.filter(c => c !== comp))} className="hover:text-rose-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Table of Companies */}
              <div className="flex-1 overflow-y-auto min-h-0 relative bg-white border-t border-slate-200">
                <table className="w-full text-left text-xs whitespace-nowrap border-separate border-spacing-0">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-slate-100">
                      <th className="sticky top-0 z-20 bg-slate-100 text-slate-700 font-bold border-b border-slate-300 py-3.5 pl-8 pr-3 w-12 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.06)]">
                        <input
                          type="checkbox"
                          checked={
                            filteredCompanies.filter(c => !getRestrictedInfo(c.name)).length > 0 &&
                            filteredCompanies
                              .filter(c => !getRestrictedInfo(c.name))
                              .every(c => selectedCompanyIds.includes(c.id))
                          }
                          onChange={handleSelectAllFiltered}
                          className="w-4 h-4 rounded text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                        />
                      </th>
                      <th className="sticky top-0 z-20 bg-slate-100 text-slate-700 font-bold border-b border-slate-300 py-3.5 px-4 w-[34%] shadow-[0_2px_4px_-1px_rgba(0,0,0,0.06)]">Company & Sector</th>
                      <th className="sticky top-0 z-20 bg-slate-100 text-slate-700 font-bold border-b border-slate-300 py-3.5 px-4 w-[24%] shadow-[0_2px_4px_-1px_rgba(0,0,0,0.06)]">Location & Scale</th>
                      <th className="sticky top-0 z-20 bg-slate-100 text-slate-700 font-bold border-b border-slate-300 py-3.5 px-4 text-center w-[16%] shadow-[0_2px_4px_-1px_rgba(0,0,0,0.06)]">Talent Pool</th>
                      <th className="sticky top-0 z-20 bg-slate-100 text-slate-700 font-bold border-b border-slate-300 py-3.5 pl-4 pr-8 text-left w-[26%] shadow-[0_2px_4px_-1px_rgba(0,0,0,0.06)]">Why Recommended</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center pl-8 pr-8">
                          <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                              <Building2 className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">No new companies match your criteria</h4>
                            <p className="text-xs text-slate-500 mt-1 mb-4">
                              Adjust your multi-select filters, clear search terms, or create a new company.
                            </p>
                            <button
                              onClick={() => setActiveMode('create')}
                              className="px-4 py-2 rounded-xl bg-(--color-secondary-200) text-white text-xs font-semibold hover:bg-blue-800 transition-colors shadow-xs flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Create New Company
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCompanies.map(comp => {
                        const restricted = getRestrictedInfo(comp.name);
                        const isSelected = selectedCompanyIds.includes(comp.id);

                        return (
                          <tr 
                            key={comp.id}
                            onClick={() => !restricted && handleToggleSelect(comp)}
                            className={cn(
                              "transition-colors group",
                              restricted 
                                ? "bg-red-50/30 opacity-80 cursor-not-allowed" 
                                : isSelected 
                                  ? "bg-(--color-secondary-200)/[0.06] hover:bg-(--color-secondary-200)/[0.09] cursor-pointer" 
                                  : "hover:bg-slate-50 cursor-pointer"
                            )}
                          >
                            {/* Checkbox */}
                            <td className="py-4 pl-8 pr-3 border-b border-slate-100">
                              {restricted ? (
                                <div className="w-4 h-4 flex items-center justify-center text-red-500" title="Restricted / Off-Limits">
                                  <Lock className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleSelect(comp)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-4 h-4 rounded text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                                />
                              )}
                            </td>

                            {/* Company & Sector */}
                            <td className="py-4 px-4 border-b border-slate-100">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
                                  restricted 
                                    ? "bg-red-100 text-red-700" 
                                    : comp.isRecommended 
                                      ? "bg-gradient-to-br from-(--color-secondary-200) to-(--color-secondary-100) text-white shadow-xs" 
                                      : "bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark) font-bold border border-(--color-secondary-50)"
                                )}>
                                  {comp.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900 text-sm group-hover:text-(--color-secondary-200) transition-colors">
                                      {comp.name}
                                    </span>
                                    {comp.isRecommended && (
                                      <span className="px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark) border border-(--color-secondary-50)">
                                        Top Match
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5">
                                    {comp.industry} • <span className="text-slate-400">{comp.website}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Location & Scale */}
                            <td className="py-4 px-4 border-b border-slate-100">
                              <div className="text-slate-800 font-medium text-xs">{comp.headquarters}</div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {comp.size} • <span className="font-semibold text-slate-700">{comp.revenue}</span>
                              </div>
                            </td>

                            {/* Talent Pool & Mobility */}
                            <td className="py-4 px-4 text-center border-b border-slate-100">
                              <div className="text-xs text-slate-800 font-semibold">
                                {comp.executivesCount} tracked · <span className="text-(--color-secondary-200) font-bold">{comp.relevantCandidatesCount} relevant</span>
                              </div>
                              {comp.mobilitySignal && (
                                <div className="text-[11px] text-(--text-brand-secondary-dark) font-semibold mt-0.5">
                                  {comp.mobilitySignal}
                                </div>
                              )}
                            </td>

                            {/* Why Recommended Reason (Clickable to open Insights Dialog) */}
                            <td className="py-3 px-4 pl-4 pr-8 border-b border-slate-100">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCompanyForInsights(comp);
                                }}
                                className="w-full text-left p-2.5 rounded-xl bg-purple-50/70 hover:bg-purple-100/90 border border-purple-200/80 hover:border-purple-300 transition-all group/rec cursor-pointer shadow-2xs hover:shadow-xs"
                              >
                                <div className="flex items-start gap-2">
                                  <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-800 line-clamp-2 leading-relaxed">
                                      {comp.recommendationReason || `${comp.name} exhibits an active executive mobility indicator (${comp.mobilitySignal || '90%+'}) with ${comp.relevantCandidatesCount} relevant executive candidates in the master graph.`}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 group-hover/rec:text-purple-900 group-hover/rec:translate-x-0.5 transition-all mt-1">
                                      <span>View Insights & Why Recommended</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </span>
                                  </div>
                                </div>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="px-8 py-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg">
                <div className="flex items-center gap-3 flex-1 overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
                      Selected Companies:
                    </span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-extrabold",
                      selectedCompanyIds.length > 0 
                        ? "bg-(--color-secondary-200) text-white" 
                        : "bg-slate-100 text-slate-600"
                    )}>
                      {selectedCompanyIds.length}
                    </span>
                  </div>

                  {/* Active selection pills */}
                  {selectedCompaniesList.length > 0 ? (
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-[55vw]">
                      {selectedCompaniesList.slice(0, 5).map(item => (
                        <span 
                          key={item.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium shadow-2xs whitespace-nowrap"
                        >
                          <span className="font-semibold text-slate-900">{item.name}</span>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveSelectedId(item.id, e)}
                            className="text-slate-400 hover:text-rose-600 ml-1 p-0.5 rounded-full hover:bg-slate-200"
                            title={`Remove ${item.name}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      {selectedCompaniesList.length > 5 && (
                        <span className="text-xs text-slate-500 font-semibold px-1">
                          +{selectedCompaniesList.length - 5} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Select companies from the list above to add them to your workspace.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {selectedCompanyIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedCompanyIds([])}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Clear Selection
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={selectedCompanyIds.length === 0}
                    onClick={handleSaveSelected}
                    className={cn(
                      "px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2",
                      selectedCompanyIds.length > 0
                        ? "bg-(--color-secondary-200) hover:bg-blue-800 text-white cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add {selectedCompanyIds.length > 0 ? `${selectedCompanyIds.length} ` : ''}Companies
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* MODE 2: CREATE NEW COMPANY */
            <form onSubmit={handleCreateCustom} className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50/40">
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                
                {/* Intro Callout */}
                <div className="bg-(--color-secondary-200)/[0.04] border border-(--color-secondary-200)/20 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-800">
                  <Info className="w-5 h-5 text-(--color-secondary-200) shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Create New Company Profile</h4>
                    <p className="mt-0.5 text-slate-600 leading-relaxed">
                      Only the <strong>Company Name</strong> is required. All other organizational scale and strategic intelligence fields can be enriched now or calibrated later.
                    </p>
                  </div>
                </div>

                {/* Section 1: Core Company Profile */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Building2 className="w-4 h-4 text-(--color-secondary-200)" />
                    1. Organization Profile
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Name - REQUIRED */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Anthropic, Databricks, Acme Cyber Systems"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200) bg-white shadow-2xs"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">Official corporate or business entity name.</span>
                    </div>

                    {/* Website */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Website Domain
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input 
                          type="text"
                          placeholder="e.g. acme-tech.com"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200) bg-white"
                        />
                      </div>
                    </div>

                    {/* Industry */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Industry / Sector
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) bg-white"
                      >
                        {COMMON_INDUSTRIES.map(ind => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    {/* Headquarters */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Headquarters Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input 
                          type="text"
                          placeholder="e.g. San Francisco, CA or Austin, TX"
                          value={headquarters}
                          onChange={(e) => setHeadquarters(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) bg-white"
                        />
                      </div>
                    </div>

                    {/* Size */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Company Headcount
                      </label>
                      <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) bg-white"
                      >
                        <option value="1-50 employees">1–50 employees</option>
                        <option value="51-200 employees">51–200 employees</option>
                        <option value="201-500 employees">201–500 employees</option>
                        <option value="501-1,000 employees">501–1,000 employees</option>
                        <option value="1,001-5,000 employees">1,001–5,000 employees</option>
                        <option value="5,001-10,000 employees">5,001–10,000 employees</option>
                        <option value="10,001+ employees">10,001+ employees</option>
                      </select>
                    </div>

                    {/* Revenue / Valuation */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Annual Revenue / Valuation Stage
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input 
                          type="text"
                          placeholder="e.g. $85M ARR or Series C ($1.5B Valuation)"
                          value={revenue}
                          onChange={(e) => setRevenue(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Overview & Executive Summary
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Brief synopsis of core business model, key market differentiators, and operational scale..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-normal focus:outline-none focus:border-(--color-secondary-200) bg-white"
                    />
                  </div>
                </div>

                {/* Section 2: Talent Baseline */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Users className="w-4 h-4 text-(--color-secondary-200)" />
                    2. Talent Pool Baseline
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Total Tracked Execs
                      </label>
                      <input 
                        type="number"
                        min={0}
                        value={executivesCount}
                        onChange={(e) => setExecutivesCount(parseInt(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Relevant Candidates
                      </label>
                      <input 
                        type="number"
                        min={0}
                        value={relevantCandidatesCount}
                        onChange={(e) => setRelevantCandidatesCount(parseInt(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Leadership Changes (12mo)
                      </label>
                      <input 
                        type="number"
                        min={0}
                        value={activeLeadershipChanges}
                        onChange={(e) => setActiveLeadershipChanges(parseInt(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Open Executive Searches
                      </label>
                      <input 
                        type="number"
                        min={0}
                        value={activeSearchesCount}
                        onChange={(e) => setActiveSearchesCount(parseInt(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Strategic Signals */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    3. Strategic Growth & Intelligence Signals
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                    {/* Growth Indicators */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Growth Indicators
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="e.g. 40% YoY ARR Growth"
                          value={newGrowthInput}
                          onChange={(e) => setNewGrowthInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag(growthIndicators, setGrowthIndicators, newGrowthInput, setNewGrowthInput);
                            }
                          }}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-(--color-secondary-200)"
                        />
                        <button
                          type="button"
                          onClick={() => addTag(growthIndicators, setGrowthIndicators, newGrowthInput, setNewGrowthInput)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                        >
                          + Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                        {growthIndicators.map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                            {tag}
                            <button 
                              type="button" 
                              onClick={() => removeTag(growthIndicators, setGrowthIndicators, tag)}
                              className="text-emerald-500 hover:text-emerald-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Active Openings */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Active Executive Openings
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="e.g. VP of Engineering"
                          value={newOpeningInput}
                          onChange={(e) => setNewOpeningInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag(activeOpenings, setActiveOpenings, newOpeningInput, setNewOpeningInput);
                            }
                          }}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-(--color-secondary-200)"
                        />
                        <button
                          type="button"
                          onClick={() => addTag(activeOpenings, setActiveOpenings, newOpeningInput, setNewOpeningInput)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                        >
                          + Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                        {activeOpenings.map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                            {tag}
                            <button 
                              type="button" 
                              onClick={() => removeTag(activeOpenings, setActiveOpenings, tag)}
                              className="text-amber-500 hover:text-amber-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Strategic Initiatives */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Strategic Initiatives
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="e.g. Enterprise Platform Automation"
                          value={newInitiativeInput}
                          onChange={(e) => setNewInitiativeInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag(strategicInitiatives, setStrategicInitiatives, newInitiativeInput, setNewInitiativeInput);
                            }
                          }}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-(--color-secondary-200)"
                        />
                        <button
                          type="button"
                          onClick={() => addTag(strategicInitiatives, setStrategicInitiatives, newInitiativeInput, setNewInitiativeInput)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                        >
                          + Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                        {strategicInitiatives.map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium">
                            {tag}
                            <button 
                              type="button" 
                              onClick={() => removeTag(strategicInitiatives, setStrategicInitiatives, tag)}
                              className="text-blue-500 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recent Acquisitions */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Recent Acquisitions
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="e.g. DataFabric (2025)"
                          value={newAcqInput}
                          onChange={(e) => setNewAcqInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag(recentAcquisitions, setRecentAcquisitions, newAcqInput, setNewAcqInput);
                            }
                          }}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-(--color-secondary-200)"
                        />
                        <button
                          type="button"
                          onClick={() => addTag(recentAcquisitions, setRecentAcquisitions, newAcqInput, setNewAcqInput)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                        >
                          + Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                        {recentAcquisitions.map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 text-purple-800 text-xs font-medium">
                            {tag}
                            <button 
                              type="button" 
                              onClick={() => removeTag(recentAcquisitions, setRecentAcquisitions, tag)}
                              className="text-purple-500 hover:text-purple-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Form Footer */}
              <div className="px-8 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => setActiveMode('browse')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  ← Back to Directory
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    Create & Add Company
                  </button>
                </div>
              </div>
            </form>
          )}

        </Dialog.Content>
      </Dialog.Portal>

      {/* Dedicated Recommendation Insights Modal for Company */}
      {selectedCompanyForInsights && (
        <Dialog.Root 
          open={!!selectedCompanyForInsights} 
          onOpenChange={(open) => !open && setSelectedCompanyForInsights(null)}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[60] animate-fadeIn" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[720px] max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 z-[60] flex flex-col overflow-hidden animate-scaleIn">
              
              {/* Header */}
              <div className="px-7 py-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between shrink-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-(--color-secondary-200) to-(--color-secondary-100) text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0">
                    {selectedCompanyForInsights.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Dialog.Title className="text-xl font-extrabold text-slate-900 tracking-tight">
                        {selectedCompanyForInsights.name}
                      </Dialog.Title>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        Master Graph Recommendation
                      </span>
                      {selectedCompanyForInsights.stage && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                          {selectedCompanyForInsights.stage}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                      <span>{selectedCompanyForInsights.industry}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {selectedCompanyForInsights.headquarters}
                      </span>
                      <span>•</span>
                      <span>{selectedCompanyForInsights.size}</span>
                      {selectedCompanyForInsights.website && (
                        <>
                          <span>•</span>
                          <span className="text-(--color-secondary-200) font-medium">{selectedCompanyForInsights.website}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <Dialog.Close asChild>
                  <button 
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>

              {/* Body */}
              <div className="p-7 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {/* 1. Core Recommendation Thesis */}
                <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-xl p-4 border border-purple-200 shadow-2xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-bold text-slate-900 text-sm">
                        Strategic Recommendation Thesis
                      </h4>
                      <p className="text-slate-700 text-xs leading-relaxed">
                        {selectedCompanyForInsights.recommendationReason || `${selectedCompanyForInsights.name} represents a high-priority executive talent incubator with an exceptional ${selectedCompanyForInsights.mobilitySignal || '90%+'} mobility indicator. The organization is undergoing scaling milestones that create a high-yield window for executive outreach.`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Key Metrics Grid */}
                <div>
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5">
                    Talent Bench & Mobility Dynamics
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tracked Execs</span>
                      <span className="text-base font-black text-slate-900 mt-0.5 block">
                        {selectedCompanyForInsights.executivesCount}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">In Master Graph</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Relevant Leaders</span>
                      <span className="text-base font-black text-(--color-secondary-200) mt-0.5 block">
                        {selectedCompanyForInsights.relevantCandidatesCount}
                      </span>
                      <span className="text-[10px] text-purple-700 font-semibold">Ready for Step-Up</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mobility Indicator</span>
                      <span className="text-base font-black text-amber-600 mt-0.5 block flex items-center justify-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        {selectedCompanyForInsights.mobilitySignal?.replace(/[^0-9%]/g, '') || '92%'}
                      </span>
                      <span className="text-[10px] text-amber-700 font-semibold">High Propensity</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Leadership Churn</span>
                      <span className="text-base font-black text-purple-700 mt-0.5 block">
                        {selectedCompanyForInsights.activeLeadershipChanges} Exits
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Past 90 Days</span>
                    </div>
                  </div>
                </div>

                {/* 3. Why Outbound Outreach Works Now */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-purple-600" />
                    Why Sourcing From This Company Succeeds Now
                  </h5>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Our master graph models predict a prime outreach window: leadership changes and recent organizational alignment at {selectedCompanyForInsights.name} have created structurally blocked vice presidents and senior directors who are receptive to confidential discussions. Compensation packages match current market parity benchmarks.
                  </p>
                </div>

                {/* 4. Strategic Growth & Active Signals */}
                {(selectedCompanyForInsights.growthIndicators?.length > 0 || selectedCompanyForInsights.activeOpenings?.length > 0) && (
                  <div className="space-y-3">
                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                      Strategic Momentum & Market Signals
                    </h5>
                    
                    {selectedCompanyForInsights.growthIndicators?.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-500">Growth & Expansion Indicators:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCompanyForInsights.growthIndicators.map((item, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedCompanyForInsights.activeOpenings?.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] font-semibold text-slate-500">Active Senior Openings (Indicating Expansion):</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCompanyForInsights.activeOpenings.map((opening, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-medium">
                              {opening}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Compliance Alert if Restricted */}
                {getRestrictedInfo(selectedCompanyForInsights.name) && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-800 text-xs">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block">Compliance Warning (Off-Limits Entity)</strong>
                      <span>{selectedCompanyForInsights.name} is subject to a non-solicitation or client off-limits agreement ({getRestrictedInfo(selectedCompanyForInsights.name)?.reason}). Adding requires managing partner approval.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-7 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedCompanyForInsights(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Close Insights
                </button>

                <button
                  type="button"
                  onClick={() => handleAddSingleCompany(selectedCompanyForInsights)}
                  className="px-5 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:shadow-purple-500/25"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Company to Workspace</span>
                </button>
              </div>

            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </Dialog.Root>
  );
}
