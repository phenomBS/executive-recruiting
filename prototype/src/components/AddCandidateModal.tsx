import React, { useState, useMemo, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  X, 
  Search, 
  Filter, 
  ShieldAlert, 
  Sparkles, 
  User, 
  Check, 
  Plus, 
  Lock, 
  TrendingUp, 
  Globe, 
  MapPin, 
  Building2, 
  DollarSign, 
  Layers, 
  ChevronDown,
  Info,
  ChevronUp,
  CheckSquare,
  Square,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  Flame,
  UserCheck,
  Tag,
  AlertTriangle,
  RotateCcw,
  Target,
  ArrowRight
} from 'lucide-react';
import { Candidate, RecommendedCandidate } from '../types';
import { initialDirectoryCandidates, DirectoryCandidate } from '../data/candidateDirectoryData';
import { useRestricted } from '../context/RestrictedContext';
import { cn } from '../lib/utils';

interface AddCandidateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  existingCandidates: Candidate[];
  recommendedCandidates?: RecommendedCandidate[];
  onAddCandidates: (candidatesToAdd: Candidate[]) => void;
  onCreateCandidate: (newCandidate: Candidate) => void;
}

const FUNCTION_OPTIONS = [
  'Engineering & AI',
  'Product & Design',
  'Marketing & Growth',
  'Finance & Strategy',
  'People & Operations',
  'Sales & Revenue'
];

const LEVEL_OPTIONS = [
  { label: 'C-Suite / CEO / CTO / CPO / CFO', value: 'C-Suite' },
  { label: 'EVP / Senior Vice President', value: 'EVP' },
  { label: 'Vice President (VP)', value: 'VP' },
  { label: 'General Manager / Director', value: 'Director' }
];

const METRO_OPTIONS = [
  'San Francisco Bay Area',
  'New York Metro Area',
  'Austin Metro',
  'Seattle-Bellevue',
  'Boston-Cambridge',
  'Remote (US / Global)'
];

const MOBILITY_OPTIONS = [
  { label: 'High Flight Risk (>90% EMI Score)', value: 'High Flight Risk' },
  { label: 'Moderate / Calibrating', value: 'Moderate / Calibrating' },
  { label: 'Stable / Passive', value: 'Stable / Passive' }
];

const COMPLIANCE_OPTIONS = [
  { label: 'Available (Unrestricted)', value: 'available' },
  { label: 'Restricted / Poach Agreement', value: 'restricted' }
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&q=80'
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
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer",
          selectedValues.length > 0
            ? "border-(--color-secondary-200) bg-(--color-secondary-200)/5 text-(--color-secondary-200)"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        )}
      >
        <span>{label}</span>
        {selectedValues.length > 0 && (
          <span className="w-4 h-4 rounded-full bg-(--color-secondary-200) text-white text-[10px] flex items-center justify-center font-bold">
            {selectedValues.length}
          </span>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-2 animate-fadeIn">
          <div className="px-3 pb-2 mb-1 border-b border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-600 uppercase tracking-wider">{label}</span>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={selectAll}
                className="text-(--color-secondary-200) hover:underline font-semibold cursor-pointer"
              >
                Select all
              </button>
              <span className="text-slate-300">|</span>
              <button 
                type="button" 
                onClick={clearAll}
                className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto px-1 py-1 space-y-0.5 no-scrollbar">
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

export function AddCandidateModal({
  isOpen,
  onOpenChange,
  existingCandidates,
  recommendedCandidates = [],
  onAddCandidates,
  onCreateCandidate
}: AddCandidateModalProps) {
  const { restrictedCompanies } = useRestricted();

  // Mode: 'browse' (Directory & Recommendations) or 'create' (Create New Candidate Profile)
  const [activeMode, setActiveMode] = useState<'browse' | 'create'>('browse');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Multi-select filters
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedMetros, setSelectedMetros] = useState<string[]>([]);
  const [selectedMobility, setSelectedMobility] = useState<string[]>([]);
  const [selectedCompliance, setSelectedCompliance] = useState<string[]>([]);

  // Open dropdown tracker
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Recommendations collapsed state
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Multi-selection state (list of candidate IDs selected for adding)
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(null);
  const [restrictedAlertMessage, setRestrictedAlertMessage] = useState<string | null>(null);
  const [selectedCandidateForInsights, setSelectedCandidateForInsights] = useState<DirectoryCandidate | null>(null);

  // -------------------------------------------------------------
  // Create New Candidate Form State
  // -------------------------------------------------------------
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0]);
  const [customAvatar, setCustomAvatar] = useState(false);
  
  // Executive level & domain
  const [executiveLevel, setExecutiveLevel] = useState('C-Suite');
  const [functionDomain, setFunctionDomain] = useState('Engineering & AI');
  const [currentCompanyTenure, setCurrentCompanyTenure] = useState('3.5 years');
  const [currentRoleTenure, setCurrentRoleTenure] = useState('2 years');
  const [careerVelocity, setCareerVelocity] = useState('High');
  
  // Compensation & Mobility
  const [currentCompensation, setCurrentCompensation] = useState('$2.5M');
  const [equityShares, setEquityShares] = useState('50,000');
  const [candidatePandL, setCandidatePandL] = useState('$150M');
  const [mobilityIndicator, setMobilityIndicator] = useState('High');
  const [relocationWillingness, setRelocationWillingness] = useState('Yes');
  const [noticePeriod, setNoticePeriod] = useState('60 days');

  // Archetype & Background
  const [executiveArchetype, setExecutiveArchetype] = useState('Strategic Growth Operator');
  const [education, setEducation] = useState('BS Computer Science, Stanford; MBA Harvard');
  const [boardExperience, setBoardExperience] = useState('Advisory Board Member');
  const [likelyNextRole, setLikelyNextRole] = useState('Chief Executive Officer / CTO');

  // Tags for expertise
  const [areasOfExpertise, setAreasOfExpertise] = useState<string[]>([
    'Enterprise Scale', 'Executive Leadership', 'System Architecture'
  ]);
  const [newExpertiseInput, setNewExpertiseInput] = useState('');

  // Check if a company is restricted
  const getRestrictedInfo = (companyName: string) => {
    return restrictedCompanies.find(
      rc => rc.name.toLowerCase() === companyName.trim().toLowerCase()
    );
  };

  // Check if candidate is already in CRM
  const existingCandidateNames = useMemo(() => {
    return new Set(existingCandidates.map(c => `${c.firstName} ${c.lastName}`.toLowerCase().trim()));
  }, [existingCandidates]);

  const isAlreadyInCrm = (cand: DirectoryCandidate) => {
    return existingCandidateNames.has(`${cand.firstName} ${cand.lastName}`.toLowerCase().trim());
  };

  // Available directory candidates
  const availableDirectoryCandidates = useMemo(() => {
    return initialDirectoryCandidates;
  }, []);

  // Top recommendations from autonomous agent
  const recommendedCandidatesList = useMemo(() => {
    return availableDirectoryCandidates.filter(c => c.isRecommended);
  }, [availableDirectoryCandidates]);

  // Compute option counts for filters
  const functionOptions = useMemo(() => {
    return FUNCTION_OPTIONS.map(f => ({
      label: f,
      value: f,
      count: availableDirectoryCandidates.filter(c => c.functionCategory === f).length
    }));
  }, [availableDirectoryCandidates]);

  const levelOptions = useMemo(() => {
    return LEVEL_OPTIONS.map(l => ({
      label: l.label,
      value: l.value,
      count: availableDirectoryCandidates.filter(c => c.executiveData?.executiveLevel?.includes(l.value)).length
    }));
  }, [availableDirectoryCandidates]);

  const metroOptions = useMemo(() => {
    return METRO_OPTIONS.map(m => ({
      label: m,
      value: m,
      count: availableDirectoryCandidates.filter(c => c.metroMarket?.toLowerCase().includes(m.toLowerCase()) || c.location.toLowerCase().includes(m.toLowerCase())).length
    }));
  }, [availableDirectoryCandidates]);

  const mobilityOptions = useMemo(() => {
    return MOBILITY_OPTIONS.map(m => ({
      label: m.label,
      value: m.value,
      count: availableDirectoryCandidates.filter(c => c.flightRiskLevel === m.value).length
    }));
  }, [availableDirectoryCandidates]);

  const complianceOptions = useMemo(() => {
    return COMPLIANCE_OPTIONS.map(opt => ({
      label: opt.label,
      value: opt.value,
      count: availableDirectoryCandidates.filter(c => {
        const restricted = !!getRestrictedInfo(c.company);
        return opt.value === 'restricted' ? restricted : !restricted;
      }).length
    }));
  }, [availableDirectoryCandidates, restrictedCompanies]);

  // Filtered candidate list for display in table
  const displayedCandidates = useMemo(() => {
    return availableDirectoryCandidates.filter(cand => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${cand.firstName} ${cand.lastName}`.toLowerCase();
        const role = cand.role.toLowerCase();
        const comp = cand.company.toLowerCase();
        const loc = cand.location.toLowerCase();
        const expertise = cand.executiveData?.areasOfExpertise.toLowerCase() || '';
        const match = fullName.includes(q) || role.includes(q) || comp.includes(q) || loc.includes(q) || expertise.includes(q);
        if (!match) return false;
      }

      // 2. Function Filter
      if (selectedFunctions.length > 0) {
        if (!cand.functionCategory || !selectedFunctions.includes(cand.functionCategory)) {
          return false;
        }
      }

      // 3. Level Filter
      if (selectedLevels.length > 0) {
        const cLevel = cand.executiveData?.executiveLevel || '';
        const hasLevel = selectedLevels.some(l => cLevel.includes(l));
        if (!hasLevel) return false;
      }

      // 4. Metro Filter
      if (selectedMetros.length > 0) {
        const hasMetro = selectedMetros.some(m => 
          (cand.metroMarket && cand.metroMarket.toLowerCase().includes(m.toLowerCase())) ||
          cand.location.toLowerCase().includes(m.toLowerCase())
        );
        if (!hasMetro) return false;
      }

      // 5. Mobility / Flight Risk Filter
      if (selectedMobility.length > 0) {
        if (!cand.flightRiskLevel || !selectedMobility.includes(cand.flightRiskLevel)) {
          return false;
        }
      }

      // 6. Compliance Filter
      if (selectedCompliance.length > 0) {
        const isRestricted = !!getRestrictedInfo(cand.company);
        const matchesComp = selectedCompliance.some(val => 
          val === 'restricted' ? isRestricted : !isRestricted
        );
        if (!matchesComp) return false;
      }

      return true;
    });
  }, [
    availableDirectoryCandidates, 
    searchQuery, 
    selectedFunctions, 
    selectedLevels, 
    selectedMetros, 
    selectedMobility, 
    selectedCompliance,
    restrictedCompanies
  ]);

  // Handle row selection
  const handleToggleCandidate = (candidate: DirectoryCandidate, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Check if poach restricted
    const restrictedInfo = getRestrictedInfo(candidate.company);
    if (restrictedInfo) {
      setRestrictedAlertMessage(
        `Poach Alert: "${candidate.company}" is currently on the Off-Limits Compliance list (${restrictedInfo.reason}). Adding ${candidate.firstName} ${candidate.lastName} requires legal approval.`
      );
    }

    if (selectedCandidateIds.includes(candidate.id)) {
      setSelectedCandidateIds(prev => prev.filter(id => id !== candidate.id));
    } else {
      setSelectedCandidateIds(prev => [...prev, candidate.id]);
    }
  };

  const handleSelectAllDisplayed = () => {
    const selectable = displayedCandidates.filter(c => !isAlreadyInCrm(c)).map(c => c.id);
    if (selectable.length === 0) return;

    const allSelected = selectable.every(id => selectedCandidateIds.includes(id));
    if (allSelected) {
      setSelectedCandidateIds(prev => prev.filter(id => !selectable.includes(id)));
    } else {
      setSelectedCandidateIds(prev => Array.from(new Set([...prev, ...selectable])));
    }
  };

  const handleSelectAllRecommendations = () => {
    const recIds = recommendedCandidatesList.filter(c => !isAlreadyInCrm(c)).map(c => c.id);
    setSelectedCandidateIds(prev => Array.from(new Set([...prev, ...recIds])));
  };

  // Add selected candidates
  const handleAddSelected = () => {
    if (selectedCandidateIds.length === 0) return;
    const candidatesToAdd = availableDirectoryCandidates.filter(c => 
      selectedCandidateIds.includes(c.id) && !isAlreadyInCrm(c)
    );
    if (candidatesToAdd.length > 0) {
      onAddCandidates(candidatesToAdd);
      setSelectedCandidateIds([]);
      onOpenChange(false);
    }
  };

  const handleAddSingleCandidate = (candidate: DirectoryCandidate) => {
    onAddCandidates([candidate]);
    setSelectedCandidateIds(prev => prev.filter(id => id !== candidate.id));
    setSelectedCandidateForInsights(null);
  };

  // Handle custom candidate creation
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !role.trim() || !company.trim()) return;

    const newCandidate: Candidate = {
      id: `c-custom-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: role.trim(),
      company: company.trim(),
      email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.example.com`,
      phone: phone.trim() || '+1 555-0100',
      location: location.trim() || 'San Francisco, CA',
      trafficSource: 'Executive Recruiter Sourced',
      linkedinUrl: linkedinUrl.trim() || `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      avatarUrl: avatarUrl,
      emiScore: mobilityIndicator === 'Very High' ? 95 : mobilityIndicator === 'High' ? 88 : mobilityIndicator === 'Medium' ? 75 : 55,
      behavioralScore: 92,
      assessmentScore: 91,
      isSubscribed: true,
      lastContactDate: 'Just now',
      executiveData: {
        executiveLevel: executiveLevel || 'C-Suite',
        function: functionDomain || 'Engineering & AI',
        currentCompanyTenure: currentCompanyTenure || '3 years',
        currentRoleTenure: currentRoleTenure || '2 years',
        careerVelocity: careerVelocity || 'High',
        industryExperience: 'Technology, Enterprise Scale',
        companySizeExperience: '5,000+ employees',
        publicCompanyExperience: 'Yes',
        peBackedExperience: 'No',
        geographicExperience: 'Global',
        globalExperience: 'Global Executive Leadership',
        boardExperience: boardExperience || 'N/A',
        education: education || 'BS, Stanford University',
        certifications: 'N/A',
        areasOfExpertise: areasOfExpertise.join(', '),
        currentCompensation: currentCompensation || '$2.5M',
        currentEquityType: 'RSU & Options',
        currentEquityShares: equityShares || '50,000',
        mobilityIndicator: mobilityIndicator || 'High',
        careerTrajectory: `${role} -> ${likelyNextRole}`,
        executiveArchetype: executiveArchetype || 'Strategic Growth Operator',
        likelyNextRole: likelyNextRole || 'Chief Executive Officer',
        candidatePandL: candidatePandL || '$150M',
        relocationWillingness: relocationWillingness || 'Yes',
        noticePeriod: noticePeriod || '60 days',
        nonCompete: 'Yes',
        gardenLeave: 'No'
      }
    };

    onCreateCandidate(newCandidate);
    onOpenChange(false);
  };

  const addExpertiseTag = () => {
    if (newExpertiseInput.trim() && !areasOfExpertise.includes(newExpertiseInput.trim())) {
      setAreasOfExpertise([...areasOfExpertise, newExpertiseInput.trim()]);
      setNewExpertiseInput('');
    }
  };

  const removeExpertiseTag = (tag: string) => {
    setAreasOfExpertise(areasOfExpertise.filter(t => t !== tag));
  };

  // Active filters count
  const activeFiltersCount = 
    selectedFunctions.length +
    selectedLevels.length +
    selectedMetros.length +
    selectedMobility.length +
    selectedCompliance.length;

  const resetAllFilters = () => {
    setSelectedFunctions([]);
    setSelectedLevels([]);
    setSelectedMetros([]);
    setSelectedMobility([]);
    setSelectedCompliance([]);
    setSearchQuery('');
  };

  // Check if live company in create form is restricted
  const formCompanyRestricted = getRestrictedInfo(company);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 animate-fadeIn" />
        
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] max-w-[1280px] h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-scaleIn">
          
          {/* Header */}
          <div className="px-8 py-5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
            <div>
              <Dialog.Title className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                <span>Add Candidates</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-(--color-secondary-200)/10 text-(--color-secondary-200)">
                  Executive Sourcing
                </span>
              </Dialog.Title>
              <Dialog.Description className="text-xs text-slate-500 mt-0.5">
                Explore prospective executive talent across market directories and agent recommendations, or manually add an executive profile.
              </Dialog.Description>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveMode('browse')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer",
                    activeMode === 'browse'
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Search className="w-3.5 h-3.5 text-blue-600" />
                  Directory & Recommendations
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('create')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer",
                    activeMode === 'create'
                      ? "bg-white text-(--color-secondary-200) shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Plus className="w-3.5 h-3.5 text-(--color-secondary-200)" />
                  Create New Candidate
                </button>
              </div>

              <Dialog.Close asChild>
                <button 
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors ml-2 cursor-pointer"
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
                className="text-red-500 hover:text-red-800 font-semibold text-xs ml-4 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-slate-50/50">
            
            {/* ------------------------------------------------------------- */}
            {/* MODE 1: DIRECTORY & RECOMMENDATIONS */}
            {/* ------------------------------------------------------------- */}
            {activeMode === 'browse' && (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                
                {/* Search & Multi-Filter Controls */}
                <div className="p-6 bg-white border-b border-slate-200 shrink-0 space-y-4 shadow-2xs">
                  
                  {/* Top Search Input & Count */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-xl">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by executive name, role, company, location, or expertise..."
                        className="w-full pl-10 pr-9 py-2.5 rounded-full border border-slate-300 text-xs focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200) transition-shadow bg-white text-slate-800 placeholder:text-slate-400 font-medium"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-medium">
                        Showing <strong className="text-slate-900">{displayedCandidates.length}</strong> verified executive candidates
                      </span>
                      {activeFiltersCount > 0 && (
                        <button
                          type="button"
                          onClick={resetAllFilters}
                          className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reset Filters ({activeFiltersCount})
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Multi-Select Filter Pills Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                      <Filter className="w-3 h-3" /> Filters:
                    </span>

                    {/* 1. Function / Domain */}
                    <MultiSelectDropdown
                      label="Function & Domain"
                      options={functionOptions}
                      selectedValues={selectedFunctions}
                      onChange={setSelectedFunctions}
                      isOpen={openDropdown === 'function'}
                      onToggle={() => setOpenDropdown(openDropdown === 'function' ? null : 'function')}
                      onClose={() => setOpenDropdown(null)}
                    />

                    {/* 2. Executive Level */}
                    <MultiSelectDropdown
                      label="Executive Level"
                      options={levelOptions}
                      selectedValues={selectedLevels}
                      onChange={setSelectedLevels}
                      isOpen={openDropdown === 'level'}
                      onToggle={() => setOpenDropdown(openDropdown === 'level' ? null : 'level')}
                      onClose={() => setOpenDropdown(null)}
                    />

                    {/* 3. Metro Market */}
                    <MultiSelectDropdown
                      label="Metropolitan Location"
                      options={metroOptions}
                      selectedValues={selectedMetros}
                      onChange={setSelectedMetros}
                      isOpen={openDropdown === 'metro'}
                      onToggle={() => setOpenDropdown(openDropdown === 'metro' ? null : 'metro')}
                      onClose={() => setOpenDropdown(null)}
                    />

                    {/* 4. EMI Score / Flight Risk */}
                    <MultiSelectDropdown
                      label="EMI Score"
                      options={mobilityOptions}
                      selectedValues={selectedMobility}
                      onChange={setSelectedMobility}
                      isOpen={openDropdown === 'mobility'}
                      onToggle={() => setOpenDropdown(openDropdown === 'mobility' ? null : 'mobility')}
                      onClose={() => setOpenDropdown(null)}
                    />

                    {/* 5. Poach / Compliance Status */}
                    <MultiSelectDropdown
                      label="Poach Compliance"
                      options={complianceOptions}
                      selectedValues={selectedCompliance}
                      onChange={setSelectedCompliance}
                      isOpen={openDropdown === 'compliance'}
                      onToggle={() => setOpenDropdown(openDropdown === 'compliance' ? null : 'compliance')}
                      onClose={() => setOpenDropdown(null)}
                    />
                  </div>
                </div>

                {/* Main Scrollable Candidates List */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                  
                  {/* Aura Agent Recommendations Strip */}
                  {recommendedCandidatesList.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-purple-50 border border-purple-200 rounded-2xl p-4 shadow-xs">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
                            <Sparkles className="w-4 h-4 fill-purple-200" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-950">
                                Aura Agent Top Sourcing Recommendations
                              </h3>
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-purple-200/80 text-purple-800">
                                Autonomous Match
                              </span>
                            </div>
                            <p className="text-[11px] text-purple-700">
                              Autonomous market intelligence detected high mobility inflection points and structural fit alignments.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSelectAllRecommendations}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckSquare className="w-3.5 h-3.5" />
                            Select All Recommendations ({recommendedCandidatesList.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowRecommendations(!showRecommendations)}
                            className="p-1.5 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                          >
                            {showRecommendations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {showRecommendations && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-purple-200/60">
                          {recommendedCandidatesList.map(cand => {
                            const isSelected = selectedCandidateIds.includes(cand.id);
                            const inCrm = isAlreadyInCrm(cand);
                            const restricted = !!getRestrictedInfo(cand.company);

                            return (
                              <div
                                key={`rec-${cand.id}`}
                                onClick={(e) => !inCrm && handleToggleCandidate(cand, e)}
                                className={cn(
                                  "p-3.5 rounded-xl border transition-all flex flex-col justify-between text-left",
                                  inCrm 
                                    ? "bg-slate-100/80 border-slate-200 opacity-60 cursor-default" 
                                    : isSelected
                                      ? "bg-white border-(--color-secondary-200) shadow-sm ring-2 ring-(--color-secondary-200)/20 cursor-pointer"
                                      : "bg-white/90 hover:bg-white border-purple-200/70 hover:border-purple-300 shadow-2xs cursor-pointer"
                                )}
                              >
                                <div className="flex items-start gap-3">
                                  <img
                                    src={cand.avatarUrl}
                                    alt={`${cand.firstName} ${cand.lastName}`}
                                    className="w-11 h-11 rounded-full object-cover border border-purple-200 shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                      <h4 className="text-xs font-bold text-slate-900 truncate">
                                        {cand.firstName} {cand.lastName}
                                      </h4>
                                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                                        {cand.matchScore}% Match
                                      </span>
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-600 truncate">{cand.role}</p>
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span className="truncate font-semibold">{cand.company}</span>
                                      <span>•</span>
                                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span className="truncate">{cand.location.split(',')[0]}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-2.5 pt-2 border-t border-purple-100 flex items-center justify-between text-[10px]">
                                  <span className="text-purple-900 font-medium truncate max-w-[180px]">
                                    {cand.mobilitySignal}
                                  </span>
                                  {inCrm ? (
                                    <span className="text-slate-500 font-bold flex items-center gap-1">
                                      <Check className="w-3 h-3 text-emerald-600" /> In CRM
                                    </span>
                                  ) : isSelected ? (
                                    <span className="text-(--color-secondary-200) font-bold flex items-center gap-1">
                                      <CheckSquare className="w-3.5 h-3.5" /> Selected
                                    </span>
                                  ) : (
                                    <span className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1">
                                      <Plus className="w-3 h-3" /> Select
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Candidate Directory Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    
                    {/* Table Header Bar */}
                    <div className="px-6 py-3.5 bg-slate-100 border-b border-slate-300 flex items-center justify-between text-xs font-bold text-slate-700">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleSelectAllDisplayed}
                          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={
                              displayedCandidates.length > 0 &&
                              displayedCandidates.filter(c => !isAlreadyInCrm(c)).every(c => selectedCandidateIds.includes(c.id))
                            }
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                          />
                          <span>Executive ({displayedCandidates.filter(c => !isAlreadyInCrm(c)).length} Available)</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-6 text-xs text-slate-600 font-bold">
                        <span className="w-20 text-center hidden md:inline-block">EMI Score</span>
                        <span className="w-64 text-left">Why Recommended</span>
                        <span className="w-7"></span>
                      </div>
                    </div>

                    {/* Table List */}
                    <div className="divide-y divide-slate-100">
                      {displayedCandidates.map(candidate => {
                        const isSelected = selectedCandidateIds.includes(candidate.id);
                        const inCrm = isAlreadyInCrm(candidate);
                        const isExpanded = expandedCandidateId === candidate.id;
                        const restricted = getRestrictedInfo(candidate.company);

                        return (
                          <div 
                            key={candidate.id}
                            className={cn(
                              "transition-colors",
                              inCrm ? "bg-slate-50/70" : isSelected ? "bg-(--color-secondary-200)/3" : "hover:bg-slate-50/80"
                            )}
                          >
                            <div 
                              onClick={() => setExpandedCandidateId(isExpanded ? null : candidate.id)}
                              className="px-6 py-4 flex items-center justify-between gap-4 cursor-pointer"
                            >
                              {/* Left Checkbox & Candidate Info */}
                              <div className="flex items-center gap-4 min-w-0 flex-1">
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!inCrm) handleToggleCandidate(candidate);
                                  }}
                                  className="shrink-0 p-1 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    disabled={inCrm}
                                    checked={isSelected || inCrm}
                                    onChange={() => {}}
                                    className="w-4 h-4 rounded text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer disabled:opacity-40"
                                  />
                                </div>

                                <img
                                  src={candidate.avatarUrl}
                                  alt={`${candidate.firstName} ${candidate.lastName}`}
                                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                                />

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                                      {candidate.firstName} {candidate.lastName}
                                    </h4>
                                    {inCrm && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                                        Already in CRM
                                      </span>
                                    )}
                                    {candidate.isRecommended && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
                                        <Sparkles className="w-2.5 h-2.5" /> Aura Pick
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs font-semibold text-slate-700">
                                      {candidate.role}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                      {candidate.company}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                      {candidate.location}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Right Badges & Indicators */}
                              <div className="flex items-center gap-5 shrink-0">
                                
                                {/* EMI Score */}
                                <div className="text-center px-1 hidden md:block w-20">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">EMI Score</span>
                                  <span className={cn(
                                    "text-xs font-black px-2 py-0.5 rounded-full inline-block mt-0.5",
                                    candidate.emiScore >= 90 ? "bg-emerald-100 text-emerald-800" :
                                    candidate.emiScore >= 80 ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                                  )}>
                                    {candidate.emiScore} / 100
                                  </span>
                                </div>

                                {/* Why Recommended Reason (Clickable to open Insights Dialog) */}
                                <div className="w-64 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedCandidateForInsights(candidate);
                                    }}
                                    className="w-full text-left p-2.5 rounded-xl bg-purple-50/70 hover:bg-purple-100/90 border border-purple-200/80 hover:border-purple-300 transition-all group/rec cursor-pointer shadow-2xs hover:shadow-xs"
                                  >
                                    <div className="flex items-start gap-2">
                                      <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-800 line-clamp-2 leading-relaxed">
                                          {candidate.recommendationReason || `${candidate.firstName} demonstrates strong executive trajectory with ${candidate.mobilitySignal || '90%+ mobility'} and high step-up readiness.`}
                                        </p>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 group-hover/rec:text-purple-900 group-hover/rec:translate-x-0.5 transition-all mt-1">
                                          <span>View Insights & Why Recommended</span>
                                          <ArrowRight className="w-3 h-3" />
                                        </span>
                                      </div>
                                    </div>
                                  </button>
                                </div>

                                {/* Expand Details Button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedCandidateId(isExpanded ? null : candidate.id);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  title="Toggle quick overview drawer"
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {/* Expanded Candidate Intelligence Drawer */}
                            {isExpanded && (
                              <div className="px-16 py-4 bg-slate-50/90 border-t border-slate-100 animate-fadeIn text-xs space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 bg-white rounded-xl border border-slate-200">
                                  <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                                      Executive Archetype
                                    </span>
                                    <span className="font-bold text-slate-800">
                                      {candidate.executiveData?.executiveArchetype || 'Strategic Leader'}
                                    </span>
                                  </div>

                                  <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                                      Tenure & Stability
                                    </span>
                                    <span className="font-semibold text-slate-700">
                                      {candidate.executiveData?.currentRoleTenure} in role ({candidate.executiveData?.currentCompanyTenure} at company)
                                    </span>
                                  </div>

                                  <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                                      Current Compensation Est.
                                    </span>
                                    <span className="font-bold text-emerald-700">
                                      {candidate.executiveData?.currentCompensation} ({candidate.executiveData?.currentEquityType})
                                    </span>
                                  </div>

                                  <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                                      Education & Pedigree
                                    </span>
                                    <span className="font-medium text-slate-700 truncate block">
                                      {candidate.executiveData?.education}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                                      Expertise:
                                    </span>
                                    {candidate.executiveData?.areasOfExpertise.split(',').map((exp, idx) => (
                                      <span key={idx} className="px-2 py-0.5 bg-slate-200/80 text-slate-700 rounded text-[11px] font-medium">
                                        {exp.trim()}
                                      </span>
                                    ))}
                                  </div>

                                  {candidate.linkedinUrl && (
                                    <a
                                      href={candidate.linkedinUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1"
                                    >
                                      <span>LinkedIn Profile</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>

                                {candidate.recommendationReason && (
                                  <div className="p-2.5 bg-purple-50/70 rounded-lg border border-purple-200 text-purple-900 text-[11px] flex items-start gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                                    <div>
                                      <strong>Aura Sourcing Signal:</strong> {candidate.recommendationReason}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {displayedCandidates.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                          <User className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                          <p className="font-semibold text-slate-700 text-sm">No executive candidates found</p>
                          <p className="text-xs mt-1">Try resetting or broadening your search queries and filter criteria.</p>
                          <button
                            type="button"
                            onClick={resetAllFilters}
                            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Reset All Filters
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Sticky Bottom Action Bar for Bulk Adding */}
                <div className="px-8 py-4 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">
                      {selectedCandidateIds.length} candidate{selectedCandidateIds.length === 1 ? '' : 's'} selected
                    </span>
                    {selectedCandidateIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedCandidateIds([])}
                        className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline cursor-pointer"
                      >
                        Clear selection
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenChange(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleAddSelected}
                      disabled={selectedCandidateIds.length === 0}
                      className="px-6 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add {selectedCandidateIds.length} Candidate{selectedCandidateIds.length === 1 ? '' : 's'} to CRM</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* MODE 2: CREATE NEW CANDIDATE FORM */}
            {/* ------------------------------------------------------------- */}
            {activeMode === 'create' && (
              <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                
                {/* Form Header Info */}
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900 leading-relaxed">
                    <strong>Custom Executive Candidate Profile:</strong> Fill in the candidate details below. The system will automatically calibrate their initial Structural Fit (SFA), Propensity to Move (PTM), and executive market benchmarking.
                  </div>
                </div>

                {/* Live Poach Warning if Form Company is Restricted */}
                {formCompanyRestricted && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3 animate-fadeIn">
                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-red-900">
                      <strong>Compliance Alert:</strong> "{company}" is currently on the active Off-Limits / Poach Restriction list ({formCompanyRestricted.reason}). Sourcing candidates from this organization requires managing director review.
                    </div>
                  </div>
                )}

                {/* Section 1: Core Candidate Identity */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-(--color-secondary-200)" /> Core Candidate Identity
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        placeholder="e.g. Rachel"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        placeholder="e.g. Morrison"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Current Role / Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        placeholder="e.g. Chief Technology Officer or VP of AI"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Current Company *
                      </label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="e.g. Stripe, Anthropic, or OpenAI"
                        className={cn(
                          "w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-1",
                          formCompanyRestricted 
                            ? "border-red-400 focus:border-red-500 focus:ring-red-400 bg-red-50/20"
                            : "border-slate-300 focus:border-(--color-secondary-200) focus:ring-(--color-secondary-200)"
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Direct Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="e.g. rachel.m@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="e.g. +1 555-0199"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Location / Metro Market
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="e.g. San Francisco Bay Area"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        value={linkedinUrl}
                        onChange={e => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/rachelmorrison"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-(--color-secondary-200) focus:ring-1 focus:ring-(--color-secondary-200)"
                      />
                    </div>

                    {/* Avatar Selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Profile Avatar Preset
                      </label>
                      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                        {AVATAR_PRESETS.slice(0, 7).map((preset, idx) => (
                          <img
                            key={idx}
                            src={preset}
                            alt={`Preset ${idx}`}
                            onClick={() => setAvatarUrl(preset)}
                            className={cn(
                              "w-8 h-8 rounded-full object-cover cursor-pointer border-2 transition-all",
                              avatarUrl === preset ? "border-(--color-secondary-200) scale-110 shadow-xs" : "border-transparent opacity-70 hover:opacity-100"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Executive Level & Functional Domain */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-(--color-secondary-200)" /> Executive Level & Functional Domain
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Executive Level
                      </label>
                      <select
                        value={executiveLevel}
                        onChange={e => setExecutiveLevel(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                      >
                        <option value="C-Suite">C-Suite (CEO / CTO / CPO / CFO / CRO)</option>
                        <option value="EVP">Executive Vice President (EVP)</option>
                        <option value="SVP">Senior Vice President (SVP)</option>
                        <option value="VP">Vice President (VP)</option>
                        <option value="Director">Managing Director / General Manager</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Functional Domain
                      </label>
                      <select
                        value={functionDomain}
                        onChange={e => setFunctionDomain(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                      >
                        {FUNCTION_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Career Velocity
                      </label>
                      <select
                        value={careerVelocity}
                        onChange={e => setCareerVelocity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                      >
                        <option value="Very High">Very High (Multiple rapid promotions)</option>
                        <option value="High">High (Consistent upward trajectory)</option>
                        <option value="Moderate">Moderate / Seasoned Enterprise Scale</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Current Company Tenure
                      </label>
                      <input
                        type="text"
                        value={currentCompanyTenure}
                        onChange={e => setCurrentCompanyTenure(e.target.value)}
                        placeholder="e.g. 3.5 years"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Current Role Tenure
                      </label>
                      <input
                        type="text"
                        value={currentRoleTenure}
                        onChange={e => setCurrentRoleTenure(e.target.value)}
                        placeholder="e.g. 2 years"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Compensation & Mobility Expectations */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" /> Compensation & Mobility Dynamics
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Current Compensation Est.
                      </label>
                      <input
                        type="text"
                        value={currentCompensation}
                        onChange={e => setCurrentCompensation(e.target.value)}
                        placeholder="e.g. $2.5M OTE"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Equity Shares / Grant
                      </label>
                      <input
                        type="text"
                        value={equityShares}
                        onChange={e => setEquityShares(e.target.value)}
                        placeholder="e.g. 50,000 RSUs"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        P&L / Revenue Scope
                      </label>
                      <input
                        type="text"
                        value={candidatePandL}
                        onChange={e => setCandidatePandL(e.target.value)}
                        placeholder="e.g. $150M ARR"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        EMI Score
                      </label>
                      <select
                        value={mobilityIndicator}
                        onChange={e => setMobilityIndicator(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                      >
                        <option value="Very High">Very High (90-99 EMI Score • Active In-Flight Risk)</option>
                        <option value="High">High (80-89 EMI Score • Receptive to Strategic Mandate)</option>
                        <option value="Medium">Medium (65-79 EMI Score • Calibrating Step-Up)</option>
                        <option value="Low">Low (&lt;65 EMI Score • Long-Term Retention)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Relocation Willingness
                      </label>
                      <select
                        value={relocationWillingness}
                        onChange={e => setRelocationWillingness(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                      >
                        <option value="Yes">Yes (Open to Relocation)</option>
                        <option value="No">No (Local Metro Only)</option>
                        <option value="Hybrid">Hybrid / Commuter Agreement</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Notice Period
                      </label>
                      <input
                        type="text"
                        value={noticePeriod}
                        onChange={e => setNoticePeriod(e.target.value)}
                        placeholder="e.g. 60 days"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Archetype & Executive Background */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" /> Executive Archetype & Pedigree
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Executive Archetype
                      </label>
                      <input
                        type="text"
                        value={executiveArchetype}
                        onChange={e => setExecutiveArchetype(e.target.value)}
                        placeholder="e.g. AI Visionary & Scaler or Enterprise GTM Commander"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Likely Next Role
                      </label>
                      <input
                        type="text"
                        value={likelyNextRole}
                        onChange={e => setLikelyNextRole(e.target.value)}
                        placeholder="e.g. Chief Executive Officer or Group CTO"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Education & Pedigree
                      </label>
                      <input
                        type="text"
                        value={education}
                        onChange={e => setEducation(e.target.value)}
                        placeholder="e.g. BS Computer Science, MIT; MBA Wharton"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Board & Advisory Experience
                      </label>
                      <input
                        type="text"
                        value={boardExperience}
                        onChange={e => setBoardExperience(e.target.value)}
                        placeholder="e.g. Independent Director, Series C B2B SaaS"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Areas of Expertise Tags */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Areas of Expertise
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {areasOfExpertise.map(tag => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeExpertiseTag(tag)}
                            className="hover:text-purple-900 font-bold cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newExpertiseInput}
                        onChange={e => setNewExpertiseInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addExpertiseTag(); } }}
                        placeholder="Add expertise keyword (e.g. LLM Orchestration, IPO Readiness)..."
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={addExpertiseTag}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Submit Footer */}
                <div className="pt-2 flex items-center justify-end gap-3 pb-6">
                  <button
                    type="button"
                    onClick={() => setActiveMode('browse')}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Back to Directory
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create & Add Candidate to Pipeline</span>
                  </button>
                </div>

              </form>
            )}

          </div>

        </Dialog.Content>
      </Dialog.Portal>

      {/* Dedicated Recommendation Insights Modal for Candidate */}
      {selectedCandidateForInsights && (
        <Dialog.Root 
          open={!!selectedCandidateForInsights} 
          onOpenChange={(open) => !open && setSelectedCandidateForInsights(null)}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[60] animate-fadeIn" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[720px] max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 z-[60] flex flex-col overflow-hidden animate-scaleIn">
              
              {/* Header */}
              <div className="px-7 py-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between shrink-0">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img 
                      src={selectedCandidateForInsights.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80'} 
                      alt={`${selectedCandidateForInsights.firstName} ${selectedCandidateForInsights.lastName}`}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Active Sourcing Signal" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Dialog.Title className="text-xl font-extrabold text-slate-900 tracking-tight">
                        {selectedCandidateForInsights.firstName} {selectedCandidateForInsights.lastName}
                      </Dialog.Title>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        Aura Executive Pick • {selectedCandidateForInsights.matchScore || 96}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold mt-1 flex items-center gap-2 flex-wrap">
                      <span className="text-slate-900 font-bold">{selectedCandidateForInsights.role}</span>
                      <span>at</span>
                      <span className="text-(--color-secondary-200) font-bold">{selectedCandidateForInsights.company}</span>
                      <span>•</span>
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {selectedCandidateForInsights.location}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Tenure: {selectedCandidateForInsights.executiveData?.currentRoleTenure || '2.5 years'} in role ({selectedCandidateForInsights.executiveData?.currentCompanyTenure || '3.5 years'} at company)
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
                        Strategic Candidate Recommendation Thesis
                      </h4>
                      <p className="text-slate-700 text-xs leading-relaxed">
                        {selectedCandidateForInsights.recommendationReason || `${selectedCandidateForInsights.firstName} ${selectedCandidateForInsights.lastName} is at an optimal career inflection point. With high career velocity, demonstrated scale leadership, and a strong step-up delta, they represent a prime candidate for senior executive placement.`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Key Assessment Scores Grid */}
                <div>
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5">
                    Assessment & Mobility Scoring
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">EMI Score</span>
                      <span className="text-base font-black text-emerald-600 mt-0.5 block">
                        {selectedCandidateForInsights.emiScore} / 100
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Executive Match</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assessment</span>
                      <span className="text-base font-black text-(--color-secondary-200) mt-0.5 block">
                        {selectedCandidateForInsights.assessmentScore} / 100
                      </span>
                      <span className="text-[10px] text-purple-700 font-semibold">Leadership Index</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Behavioral Fit</span>
                      <span className="text-base font-black text-indigo-700 mt-0.5 block">
                        {selectedCandidateForInsights.behavioralScore} / 100
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Culture Alignment</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">EMI Score</span>
                      <span className="text-base font-black text-amber-600 mt-0.5 block flex items-center justify-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        {selectedCandidateForInsights.mobilitySignal?.replace(/[^0-9%]/g, '') || '94%'}
                      </span>
                      <span className="text-[10px] text-amber-700 font-semibold">{selectedCandidateForInsights.flightRiskLevel || 'High Flight Risk'}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Motivation Alignment (CMA) & Career Velocity */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                    Motivation Alignment (CMA) & Step-Up Delta
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Executive Archetype</span>
                      <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                        {selectedCandidateForInsights.executiveData?.executiveArchetype || 'Strategic Visionary'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Career Trajectory</span>
                      <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
                        {selectedCandidateForInsights.executiveData?.careerTrajectory || 'VP -> C-Suite Step-Up'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Likely Next Role</span>
                      <span className="text-xs font-bold text-(--color-secondary-200) mt-0.5 block">
                        {selectedCandidateForInsights.executiveData?.likelyNextRole || 'Chief Officer / SVP'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Scale, Scope & Compensation Benchmarks */}
                <div className="space-y-3">
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Scale, Scope & Operational Calibration
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">P&L Responsibility</span>
                      <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                        {selectedCandidateForInsights.executiveData?.candidatePandL || '$150M+'}
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Scale Experience</span>
                      <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
                        {selectedCandidateForInsights.executiveData?.companySizeExperience || '5,000+ employees'}
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Comp</span>
                      <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                        {selectedCandidateForInsights.executiveData?.currentCompensation || '$2.8M'} ({selectedCandidateForInsights.executiveData?.currentEquityType || 'RSU'})
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Notice & Relocation</span>
                      <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
                        {selectedCandidateForInsights.executiveData?.noticePeriod || '2 months'} • {selectedCandidateForInsights.executiveData?.relocationWillingness ? 'Relo Open' : 'Local'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. Areas of Expertise */}
                {selectedCandidateForInsights.executiveData?.areasOfExpertise && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">Core Leadership & Domain Competencies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidateForInsights.executiveData.areasOfExpertise.split(',').map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-7 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedCandidateForInsights(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Close Insights
                </button>

                <button
                  type="button"
                  onClick={() => handleAddSingleCandidate(selectedCandidateForInsights)}
                  className="px-5 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:shadow-purple-500/25"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Candidate to Talent Workspace</span>
                </button>
              </div>

            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </Dialog.Root>
  );
}
