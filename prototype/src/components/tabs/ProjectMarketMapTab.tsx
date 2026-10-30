import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Link2, 
  FileText, 
  FileSpreadsheet, 
  Printer, 
  Eye, 
  Plus, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  Flame, 
  ArrowRight, 
  X, 
  ChevronDown, 
  Layers, 
  Briefcase,
  SlidersHorizontal,
  Table,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Network
} from 'lucide-react';
import { Project } from '../../types';
import { 
  ProjectMarketMapData, 
  MappedCompany, 
  MappedExecutive, 
  getMarketMapForProject, 
  generateMarketMapCsv 
} from '../../data/projectMarketMapData';
import { CompanyOrgChartViewer } from './CompanyOrgChartViewer';
import { useRouter } from '../../context/RouterContext';
import { cn } from '../../lib/utils';

interface ProjectMarketMapTabProps {
  project: Project;
}

type ViewMode = 'matrix' | 'table' | 'orgcharts' | 'insights';
type TierFilter = 'All' | 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
type MobilityFilter = 'All' | 'High' | 'Moderate';
type StatusFilter = 'All' | 'Clear Target' | 'Pipelined' | 'Approached' | 'In Dialogue' | 'Off-Limits';

export function ProjectMarketMapTab({ project }: ProjectMarketMapTabProps) {
  const router = useRouter();

  // Load initial data
  const initialData = useMemo(() => getMarketMapForProject(project), [project]);
  const [marketMapData, setMarketMapData] = useState<ProjectMarketMapData>(initialData);

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('matrix');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<TierFilter>('All');
  const [mobilityFilter, setMobilityFilter] = useState<MobilityFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  // Modals & Popovers
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<'dossier' | 'orgcharts' | 'matrix'>('dossier');
  const [previewExpandAllOrgs, setPreviewExpandAllOrgs] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [isAddExecutiveModalOpen, setIsAddExecutiveModalOpen] = useState(false);
  const [selectedCompanyForExec, setSelectedCompanyForExec] = useState<string>('');
  
  // Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Auto-open presentation preview if URL has mode=presentation or preview=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'presentation' || params.get('preview') === 'true') {
      setIsPreviewOpen(true);
    }
    if (params.get('view') === 'orgcharts') {
      setViewMode('orgcharts');
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add Company Form State
  const [newCompany, setNewCompany] = useState({
    name: '',
    tier: 'Tier 1' as 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4',
    industry: 'Enterprise Software & Cloud Platforms',
    stage: 'Pre-IPO Unicorn ($500M+ ARR)',
    headquarters: 'San Francisco, CA',
    employeeCount: '2,500+ FTEs',
    revenueScale: '$500M+ ARR',
    poachStatus: 'Clear Target' as const,
    poachReason: '',
    strategicRationale: ''
  });

  // Add Executive Form State
  const [newExecutive, setNewExecutive] = useState({
    name: '',
    role: project.parameters?.primaryTitle || project.title || 'Executive Lead',
    companyId: '',
    location: 'San Francisco, CA',
    tenureYears: '3.5',
    previousPedigree: '',
    mobilityScore: '88',
    mobilityCatalyst: 'Initial equity grant fully vested; open to pre-IPO executive mandate.',
    matchScore: '92',
    archetypeMatch: 'Scale Operator & Growth Leader',
    baseSalary: '$420,000',
    totalCash: '$680,000',
    equity: '$450,000 / yr',
    outreachStatus: 'Clear Target' as const,
    confidentialNotes: 'Identified via market intelligence graph.'
  });

  // Filtered companies & executives
  const filteredCompanies = useMemo(() => {
    return marketMapData.companies
      .filter(company => {
        if (tierFilter !== 'All' && company.tier !== tierFilter) return false;
        if (statusFilter === 'Off-Limits' && !company.poachStatus.includes('Restricted') && !company.poachStatus.includes('Do Not Poach')) {
          // If searching for off-limits, only show if company or exec is off-limits
          const hasOffLimitsExec = company.executives.some(e => e.outreachStatus === 'Off-Limits');
          if (!hasOffLimitsExec) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const compMatches = company.name.toLowerCase().includes(q) ||
            company.industry.toLowerCase().includes(q) ||
            company.headquarters.toLowerCase().includes(q);
          const execMatches = company.executives.some(e => 
            e.name.toLowerCase().includes(q) ||
            e.role.toLowerCase().includes(q) ||
            e.previousPedigree.toLowerCase().includes(q)
          );
          if (!compMatches && !execMatches) return false;
        }

        return true;
      })
      .map(company => {
        // Filter executives inside company
        const filteredExecs = company.executives.filter(exec => {
          if (mobilityFilter === 'High' && exec.mobilityScore < 85) return false;
          if (mobilityFilter === 'Moderate' && (exec.mobilityScore >= 85 || exec.mobilityScore < 70)) return false;
          
          if (statusFilter !== 'All') {
            if (statusFilter === 'Clear Target' && exec.outreachStatus !== 'Clear Target') return false;
            if (statusFilter === 'Pipelined' && exec.outreachStatus !== 'Pipelined') return false;
            if (statusFilter === 'Approached' && exec.outreachStatus !== 'Approached') return false;
            if (statusFilter === 'In Dialogue' && exec.outreachStatus !== 'In Dialogue') return false;
            if (statusFilter === 'Off-Limits' && exec.outreachStatus !== 'Off-Limits') return false;
          }

          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const execMatches = exec.name.toLowerCase().includes(q) ||
              exec.role.toLowerCase().includes(q) ||
              exec.previousPedigree.toLowerCase().includes(q) ||
              company.name.toLowerCase().includes(q);
            if (!execMatches) return false;
          }

          return true;
        });

        return {
          ...company,
          executives: filteredExecs
        };
      })
      .filter(company => company.executives.length > 0 || !searchQuery.trim());
  }, [marketMapData, tierFilter, mobilityFilter, statusFilter, searchQuery]);

  // Total visible executives
  const visibleExecutivesCount = useMemo(() => {
    return filteredCompanies.reduce((acc, c) => acc + c.executives.length, 0);
  }, [filteredCompanies]);

  // Flattened executives list for Table View
  const allFlattenedExecutives = useMemo(() => {
    const list: (MappedExecutive & { companyTier: string; companyStage: string; companyPoachStatus: string })[] = [];
    filteredCompanies.forEach(comp => {
      comp.executives.forEach(exec => {
        list.push({
          ...exec,
          companyTier: comp.tier,
          companyStage: comp.stage,
          companyPoachStatus: comp.poachStatus
        });
      });
    });
    return list;
  }, [filteredCompanies]);

  // -------------------------------------------------------------
  // Handlers for Export & Preview
  // -------------------------------------------------------------
  const handleCopyShareUrl = async () => {
    const shareUrl = `${window.location.origin}/projects/${project.id}?tab=market-map&mode=presentation`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setLinkCopied(true);
        triggerToast('Confidential presentation URL copied to clipboard!');
        setTimeout(() => setLinkCopied(false), 2500);
      }
    } catch {
      triggerToast('Presentation URL ready: ' + shareUrl);
    }
  };

  const handleDownloadCsv = () => {
    const csvContent = generateMarketMapCsv(marketMapData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanTitle = (project.title || 'Market_Map').replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('download', `Market_Map_${cleanTitle}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`Market map CSV export downloaded successfully!`);
    setIsExportMenuOpen(false);
  };

  const handlePrintPdf = () => {
    setIsExportMenuOpen(false);
    setIsPreviewOpen(true);
    triggerToast('Preparing board-ready PDF dossier layout...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Add Company Submit
  const handleAddCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name.trim()) return;

    const newCompanyObj: MappedCompany = {
      id: `mm-custom-comp-${Date.now()}`,
      name: newCompany.name.trim(),
      tier: newCompany.tier,
      tierLabel: `${newCompany.tier} — ${newCompany.tier === 'Tier 1' ? 'Direct Scale Competitors' : newCompany.tier === 'Tier 2' ? 'Adjacent Industry Leaders' : newCompany.tier === 'Tier 3' ? 'Scale-Up Disruptors' : 'Leadership Academies'}`,
      tierDescription: 'Target organization calibrated for executive talent extraction.',
      industry: newCompany.industry,
      stage: newCompany.stage,
      headquarters: newCompany.headquarters,
      employeeCount: newCompany.employeeCount,
      revenueScale: newCompany.revenueScale,
      poachStatus: newCompany.poachStatus,
      poachReason: newCompany.poachReason,
      executivesCount: 0,
      strategicRationale: newCompany.strategicRationale || 'Strategic source organization calibrated for leadership search parameters.',
      executives: []
    };

    setMarketMapData(prev => ({
      ...prev,
      companies: [newCompanyObj, ...prev.companies],
      scopeSummary: {
        ...prev.scopeSummary,
        totalCompaniesMapped: prev.scopeSummary.totalCompaniesMapped + 1
      }
    }));

    triggerToast(`Added "${newCompany.name}" to ${newCompany.tier}!`);
    setIsAddCompanyModalOpen(false);
    setNewCompany({
      name: '',
      tier: 'Tier 1',
      industry: 'Enterprise Software & Cloud Platforms',
      stage: 'Pre-IPO Unicorn ($500M+ ARR)',
      headquarters: 'San Francisco, CA',
      employeeCount: '2,500+ FTEs',
      revenueScale: '$500M+ ARR',
      poachStatus: 'Clear Target',
      poachReason: '',
      strategicRationale: ''
    });
  };

  // Add Executive Submit
  const handleAddExecutiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExecutive.name.trim() || !newExecutive.companyId) return;

    const parts = newExecutive.name.trim().split(' ');
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ') || firstName;

    const targetCompany = marketMapData.companies.find(c => c.id === newExecutive.companyId);
    if (!targetCompany) return;

    const newExecObj: MappedExecutive = {
      id: `mm-custom-exec-${Date.now()}`,
      name: newExecutive.name.trim(),
      firstName,
      lastName,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80`,
      role: newExecutive.role.trim(),
      companyId: targetCompany.id,
      companyName: targetCompany.name,
      location: newExecutive.location,
      metroArea: newExecutive.location.split(',')[0],
      tenureYears: parseFloat(newExecutive.tenureYears) || 3.0,
      tenureFormatted: `${newExecutive.tenureYears} yrs`,
      previousPedigree: newExecutive.previousPedigree || 'Proven enterprise leadership pedigree',
      mobilityScore: parseInt(newExecutive.mobilityScore, 10) || 85,
      mobilityLevel: parseInt(newExecutive.mobilityScore, 10) >= 85 ? 'High' : 'Moderate',
      mobilityCatalyst: newExecutive.mobilityCatalyst,
      matchScore: parseInt(newExecutive.matchScore, 10) || 92,
      archetypeMatch: newExecutive.archetypeMatch,
      estimatedComp: {
        baseSalary: newExecutive.baseSalary,
        totalCash: newExecutive.totalCash,
        equity: newExecutive.equity
      },
      outreachStatus: newExecutive.outreachStatus,
      confidentialNotes: newExecutive.confidentialNotes,
      reportsTo: 'Executive Committee'
    };

    setMarketMapData(prev => ({
      ...prev,
      companies: prev.companies.map(c => {
        if (c.id === targetCompany.id) {
          return {
            ...c,
            executivesCount: c.executivesCount + 1,
            executives: [newExecObj, ...c.executives]
          };
        }
        return c;
      }),
      scopeSummary: {
        ...prev.scopeSummary,
        totalExecutivesMapped: prev.scopeSummary.totalExecutivesMapped + 1
      }
    }));

    triggerToast(`Added ${newExecutive.name} to ${targetCompany.name}!`);
    setIsAddExecutiveModalOpen(false);
  };

  const handleUpdateExecStatus = (execId: string, companyId: string, newStatus: MappedExecutive['outreachStatus']) => {
    setMarketMapData(prev => ({
      ...prev,
      companies: prev.companies.map(c => {
        if (c.id === companyId) {
          return {
            ...c,
            executives: c.executives.map(e => {
              if (e.id === execId) {
                return { ...e, outreachStatus: newStatus };
              }
              return e;
            })
          };
        }
        return c;
      })
    }));
    triggerToast(`Updated status to "${newStatus}"`);
  };

  return (
    <div className="flex flex-col h-full bg-(--bg-surface-base) w-full min-h-[600px] relative pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slideUp text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. EXECUTIVE HEADER & ACTIONS */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-slate-200 px-6 sm:px-8 py-5 shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Executive Search Mandate</span>
              <span>·</span>
              <span className="text-purple-700 font-semibold">{project.title}</span>
              <span>·</span>
              <span>{marketMapData.calibrationDate}</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Market Talent Map & Sourcing Universe
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                Board Presentation Format
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Calibrated market mapping across direct scale competitors, adjacent ecosystem leaders, high-growth disruptors, and executive academies for {project.company || 'this search mandate'}.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* Preview Presentation Option (Requirement 2) */}
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-purple-700" />
              <span>Preview Presentation</span>
            </button>

            {/* Export Menu Dropdown (Requirement 2) */}
            <div className="relative">
              <button
                onClick={() => setIsExportMenuOpen(prev => !prev)}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export / Share</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-2 divide-y divide-slate-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Client & Board Deliverables
                  </div>
                  
                  {/* Shareable URL */}
                  <button
                    onClick={() => {
                      handleCopyShareUrl();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-start gap-2.5 transition-colors cursor-pointer"
                  >
                    <Link2 className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-800">Copy Presentation URL</div>
                      <div className="text-[11px] text-slate-400">Deep link for hiring committee</div>
                    </div>
                  </button>

                  {/* Printable PDF */}
                  <button
                    onClick={handlePrintPdf}
                    className="w-full px-4 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-start gap-2.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-800">Print / Save as PDF</div>
                      <div className="text-[11px] text-slate-400">Board-ready dossier layout</div>
                    </div>
                  </button>

                  {/* CSV Export */}
                  <button
                    onClick={handleDownloadCsv}
                    className="w-full px-4 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-start gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-800">Export CSV Ledger</div>
                      <div className="text-[11px] text-slate-400">Full executive dataset (.csv)</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Add Target Company */}
            <button
              onClick={() => setIsAddCompanyModalOpen(true)}
              className="px-3.5 py-2 bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Company</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. RECRUITER SCOPE & CALIBRATION METRICS STRIP */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Target Enterprises</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-slate-900">{marketMapData.scopeSummary.totalCompaniesMapped}</span>
              <span className="text-[11px] text-slate-500">mapped</span>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Total Executives</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-slate-900">{marketMapData.scopeSummary.totalExecutivesMapped}</span>
              <span className="text-[11px] text-purple-700 font-semibold">{visibleExecutivesCount} active view</span>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">High Mobility Cohort</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-emerald-700">
                {marketMapData.companies.reduce((acc, c) => acc + c.executives.filter(e => e.mobilityScore >= 85).length, 0)}
              </span>
              <span className="text-[11px] text-slate-500">vesting cliffs</span>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Clear Targets</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-blue-700">{marketMapData.scopeSummary.clearTargetsCount}</span>
              <span className="text-[11px] text-slate-500">unrestricted</span>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Off-Limits / Board Caution</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-amber-700">{marketMapData.scopeSummary.offLimitsCount}</span>
              <span className="text-[11px] text-slate-500">covenants</span>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Target Comp Benchmark</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-bold text-slate-900 truncate" title={marketMapData.scopeSummary.targetBaseBenchmark}>
                {marketMapData.scopeSummary.targetBaseBenchmark.split('/')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TOOLBAR CONTROLS & FILTERS */}
      {/* ========================================================================= */}
      <div className="px-6 sm:px-8 py-4 bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        
        {/* Left: Search & Filters */}
        <div className="flex items-center gap-3 flex-wrap flex-1">
          {/* Search */}
          <div className="relative min-w-[220px] max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies, executives, pedigree..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Tier Segmented Buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {(['All', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'] as TierFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap",
                  tierFilter === t 
                    ? "bg-white text-slate-900 shadow-2xs" 
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Mobility Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-[11px] font-semibold text-slate-400">Mobility:</span>
            <select
              value={mobilityFilter}
              onChange={(e) => setMobilityFilter(e.target.value as MobilityFilter)}
              className="py-1 px-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Flight Risks</option>
              <option value="High">High Mobility (PTM ≥ 85%)</option>
              <option value="Moderate">Moderate / Stable</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-[11px] font-semibold text-slate-400">Outreach:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="py-1 px-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Clear Target">Clear Targets</option>
              <option value="In Dialogue">In Dialogue</option>
              <option value="Pipelined">Pipelined</option>
              <option value="Approached">Approached</option>
              <option value="Off-Limits">Off-Limits Only</option>
            </select>
          </div>
        </div>

        {/* Right: View Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
          <button
            onClick={() => setViewMode('matrix')}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer",
              viewMode === 'matrix' 
                ? "bg-white text-slate-900 shadow-2xs font-bold" 
                : "text-slate-600 hover:text-slate-900"
            )}
            title="Matrix View (Grouped by Company & Tier)"
          >
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Matrix</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer",
              viewMode === 'table' 
                ? "bg-white text-slate-900 shadow-2xs font-bold" 
                : "text-slate-600 hover:text-slate-900"
            )}
            title="Talent Ledger (Full Sortable Table)"
          >
            <Table className="w-3.5 h-3.5 text-blue-600" />
            <span>Ledger</span>
          </button>

          <button
            onClick={() => setViewMode('orgcharts')}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer",
              viewMode === 'orgcharts' 
                ? "bg-white text-slate-900 shadow-2xs font-bold" 
                : "text-slate-600 hover:text-slate-900"
            )}
            title="Company Org Charts & Reporting Hierarchy"
          >
            <Network className="w-3.5 h-3.5 text-purple-600" />
            <span>Org Charts</span>
          </button>

          <button
            onClick={() => setViewMode('insights')}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer",
              viewMode === 'insights' 
                ? "bg-white text-slate-900 shadow-2xs font-bold" 
                : "text-slate-600 hover:text-slate-900"
            )}
            title="Market Analytics & Comp Insights"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
        
        {/* EMPTY STATE */}
        {filteredCompanies.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm my-8">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Target Companies Matched</h3>
            <p className="text-xs text-slate-500 mt-1">
              Adjust your search keywords, tier filters, or flight risk settings to see mapped enterprise talent.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setTierFilter('All');
                setMobilityFilter('All');
                setStatusFilter('All');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: MATRIX VIEW (COMPANY & TIER GROUPED PRESENTATION) */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'matrix' && filteredCompanies.length > 0 && (
          <div className="space-y-8">
            {marketMapData.tiers.map(tier => {
              if (tierFilter !== 'All' && tier.tierId !== tierFilter) return null;

              const companiesInTier = filteredCompanies.filter(c => c.tier === tier.tierId);
              if (companiesInTier.length === 0) return null;

              return (
                <div key={tier.tierId} className="space-y-4">
                  
                  {/* Tier Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">
                        {tier.name}
                      </h3>
                      <span className="text-xs font-medium text-slate-500">
                        ({companiesInTier.length} {companiesInTier.length === 1 ? 'company' : 'companies'} · {companiesInTier.reduce((acc, c) => acc + c.executives.length, 0)} leaders)
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-normal max-w-md text-right hidden sm:inline">
                      {tier.description}
                    </span>
                  </div>

                  {/* Grid of Company Containers */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {companiesInTier.map(company => (
                      <div 
                        key={company.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col transition-all hover:border-slate-300"
                      >
                        {/* Company Card Header */}
                        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-2.5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-bold text-slate-900">{company.name}</h4>
                                {company.poachStatus === 'Clear Target' ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Clear Target
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                                    <ShieldAlert className="w-3 h-3 text-amber-600" />
                                    {company.poachStatus}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                                <span>{company.industry}</span>
                                <span>·</span>
                                <span>{company.headquarters}</span>
                                <span>·</span>
                                <span className="font-medium text-slate-700">{company.stage}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedCompanyForExec(company.id);
                                setNewExecutive(prev => ({ ...prev, companyId: company.id }));
                                setIsAddExecutiveModalOpen(true);
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors cursor-pointer shrink-0"
                            >
                              + Add Leader
                            </button>
                          </div>

                          {/* Recruiter Strategic Rationale */}
                          <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                            <span className="font-semibold text-slate-800">Sourcing Rationale: </span>
                            {company.strategicRationale}
                            {company.poachReason && (
                              <div className="mt-1 text-amber-800 font-medium flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                                <span>Governance Note: {company.poachReason}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Mapped Executives Roster within Company */}
                        <div className="p-4 sm:p-5 flex-1 divide-y divide-slate-100 space-y-4">
                          {company.executives.length === 0 ? (
                            <div className="text-center py-6 text-xs text-slate-400">
                              No executives mapped under this company yet. Click "+ Add Leader" above.
                            </div>
                          ) : (
                            company.executives.map((exec, idx) => (
                              <div key={exec.id} className={cn("pt-4 first:pt-0 space-y-2.5", idx > 0 ? "pt-4" : "")}>
                                
                                {/* Exec Top Row */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    {exec.avatarUrl ? (
                                      <img 
                                        src={exec.avatarUrl} 
                                        alt={exec.name} 
                                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" 
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs shrink-0">
                                        {exec.firstName[0]}{exec.lastName[0]}
                                      </div>
                                    )}
                                    <div>
                                      <div className="flex items-center gap-2">
                                        {exec.candidateId ? (
                                          <button
                                            onClick={() => router.navigateToView('candidates', { candidateId: exec.candidateId })}
                                            className="font-bold text-slate-900 text-sm hover:text-purple-700 hover:underline transition-colors text-left cursor-pointer"
                                          >
                                            {exec.name}
                                          </button>
                                        ) : (
                                          <span className="font-bold text-slate-900 text-sm">{exec.name}</span>
                                        )}
                                        <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                                          {exec.matchScore}% Match
                                        </span>
                                      </div>
                                      <div className="text-xs font-medium text-slate-700">{exec.role}</div>
                                      <div className="text-[11px] text-slate-400 mt-0.5">
                                        Reports to: {exec.reportsTo || 'Executive Leadership'}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Outreach Status Selector */}
                                  <select
                                    value={exec.outreachStatus}
                                    onChange={(e) => handleUpdateExecStatus(exec.id, company.id, e.target.value as any)}
                                    className={cn(
                                      "text-[10px] font-bold px-2 py-1 rounded-md border focus:outline-none cursor-pointer",
                                      exec.outreachStatus === 'Clear Target' ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                                      exec.outreachStatus === 'In Dialogue' ? "bg-purple-50 text-purple-800 border-purple-200" :
                                      exec.outreachStatus === 'Pipelined' ? "bg-blue-50 text-blue-800 border-blue-200" :
                                      exec.outreachStatus === 'Off-Limits' ? "bg-red-50 text-red-800 border-red-200" :
                                      "bg-slate-50 text-slate-700 border-slate-200"
                                    )}
                                  >
                                    <option value="Clear Target">Clear Target</option>
                                    <option value="In Dialogue">In Dialogue</option>
                                    <option value="Pipelined">Pipelined</option>
                                    <option value="Approached">Approached</option>
                                    <option value="Benchmark Only">Benchmark Only</option>
                                    <option value="Off-Limits">Off-Limits</option>
                                  </select>
                                </div>

                                {/* Exec Pedigree & Compensation Details */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                                  <div>
                                    <span className="text-[10px] text-slate-400 block font-semibold">TENURE</span>
                                    <span className="text-slate-800 font-medium">{exec.tenureFormatted} in role</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block font-semibold">MOBILITY INDICATOR</span>
                                    <span className="text-emerald-700 font-bold">{exec.mobilityScore}% ({exec.mobilityLevel})</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block font-semibold">LOCATION</span>
                                    <span className="text-slate-800 font-medium truncate block">{exec.location}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block font-semibold">EST. COMP</span>
                                    <span className="text-slate-800 font-medium">{exec.estimatedComp.baseSalary}</span>
                                  </div>
                                </div>

                                {/* Mobility Catalyst & Recruiter Confidential Note */}
                                <div className="text-[11px] space-y-1">
                                  <div className="text-slate-700 flex items-start gap-1.5">
                                    <Flame className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                                    <span><strong>Flight Risk Catalyst:</strong> {exec.mobilityCatalyst}</span>
                                  </div>
                                  <div className="text-slate-500 pl-4 italic">
                                    "{exec.confidentialNotes}"
                                  </div>
                                </div>

                                {/* Quick Action Bar */}
                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-[10px] font-semibold text-purple-800 bg-purple-50/60 px-2 py-0.5 rounded">
                                    Archetype: {exec.archetypeMatch}
                                  </span>

                                  <div className="flex items-center gap-2">
                                    {exec.candidateId && (
                                      <button
                                        onClick={() => router.navigateToView('candidates', { candidateId: exec.candidateId })}
                                        className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 transition-colors flex items-center gap-1 cursor-pointer"
                                      >
                                        <span>Full Profile</span>
                                        <ArrowRight className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: TALENT LEDGER (DENSE GRANULAR EXECUTIVE TABLE) */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Full Market Talent Ledger</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Granular listing of all {allFlattenedExecutives.length} calibrated executives across target organizations.
                </p>
              </div>
              <button
                onClick={handleDownloadCsv}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export to CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Executive Leader</th>
                    <th className="py-3 px-4">Target Company</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4">Current Role</th>
                    <th className="py-3 px-4">Tenure</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Mobility (EMI)</th>
                    <th className="py-3 px-4">Fit Match</th>
                    <th className="py-3 px-4">Est. Comp</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allFlattenedExecutives.map(exec => (
                    <tr key={exec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          {exec.avatarUrl ? (
                            <img src={exec.avatarUrl} alt={exec.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                              {exec.firstName[0]}{exec.lastName[0]}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900">{exec.name}</div>
                            <div className="text-[10px] text-slate-400">{exec.previousPedigree.split(',')[0]}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-800">
                        <div>{exec.companyName}</div>
                        <div className="text-[10px] text-slate-400">{exec.companyStage}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700 text-[11px]">{exec.companyTier}</span>
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">
                        <div>{exec.role}</div>
                        <div className="text-[10px] text-purple-700 font-semibold">{exec.archetypeMatch}</div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {exec.tenureFormatted}
                      </td>

                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {exec.location}
                      </td>

                      <td className="py-3 px-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-bold",
                          exec.mobilityScore >= 85 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"
                        )}>
                          {exec.mobilityScore}%
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-purple-700">
                        {exec.matchScore}%
                      </td>

                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {exec.estimatedComp.baseSalary}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold",
                          exec.outreachStatus === 'Clear Target' ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                          exec.outreachStatus === 'In Dialogue' ? "bg-purple-50 text-purple-800 border border-purple-200" :
                          exec.outreachStatus === 'Pipelined' ? "bg-blue-50 text-blue-800 border border-blue-200" :
                          exec.outreachStatus === 'Off-Limits' ? "bg-red-50 text-red-800 border border-red-200" :
                          "bg-slate-100 text-slate-700"
                        )}>
                          {exec.outreachStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {exec.candidateId ? (
                          <button
                            onClick={() => router.navigateToView('candidates', { candidateId: exec.candidateId })}
                            className="text-purple-700 hover:text-purple-900 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            Profile &rarr;
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: COMPANY ORG CHARTS & REPORTING HIERARCHIES */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'orgcharts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 uppercase tracking-wider">
                    Organizational Intelligence
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {filteredCompanies.length} Target Enterprises Visualized
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mt-1 flex items-center gap-2">
                  <Network className="w-5 h-5 text-purple-600" />
                  Target Company Org Charts & Reporting Lines
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                  Visual corporate hierarchies mapping reporting lines directly to the CEO, peer C-Suite, and VP-level successor benches. Calibrated mandate candidates are highlighted in purple with match scores.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    setSelectedCompanyForExec(filteredCompanies[0]?.id || '');
                    setIsAddExecutiveModalOpen(true);
                  }}
                  className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-700" />
                  <span>Map Leader to Tree</span>
                </button>
                <button
                  onClick={() => {
                    setPreviewTab('orgcharts');
                    setIsPreviewOpen(true);
                  }}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-300" />
                  <span>Preview in Dossier</span>
                </button>
              </div>
            </div>

            <CompanyOrgChartViewer companies={filteredCompanies} />
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 4: MARKET INSIGHTS & COMPENSATION REALITY CHECK */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'insights' && (
          <div className="space-y-6">
            
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Compensation Spread */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Compensation Reality Check
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Market Calibrated</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">25th Percentile Base</span>
                      <span className="font-bold text-slate-900">$380,000</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[40%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Median Market Base</span>
                      <span className="font-bold text-slate-900">$435,000</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full w-[65%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">75th Percentile Base</span>
                      <span className="font-bold text-slate-900">$510,000</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-700 h-2 rounded-full w-[90%]" />
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  Client budget ceiling of {project.parameters?.maxBaseBudget ? `$${Math.round(project.parameters.maxBaseBudget / 1000)}k` : '$500k'} provides sufficient head-room to attract top Tier-1 talent.
                </div>
              </div>

              {/* Mobility Catalyst Distribution */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    Mobility Catalysts & Flight Risk
                  </h4>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Q3/Q4 Pulse</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-700">4-Year Equity Vesting Cliffs</span>
                    <span className="font-bold text-emerald-700">62% of cohort</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-700">IPO Postponement Fatigue</span>
                    <span className="font-bold text-amber-700">24% of cohort</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-700">Executive Reorg / Transition</span>
                    <span className="font-bold text-blue-700">14% of cohort</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  Ideal timing window: 70% of mapped leaders have exceeded 3.2 years of continuous tenure in current chair.
                </div>
              </div>

              {/* Governance & Off-Limits Exposure */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-blue-600" />
                    Off-Limits & Governance Cleanliness
                  </h4>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Compliance Check</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-700">Clear Target Organizations</span>
                    <span className="font-bold text-emerald-700">{marketMapData.scopeSummary.clearTargetsCount} of {marketMapData.companies.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-700">Board / Partner Restrictions</span>
                    <span className="font-bold text-amber-700">{marketMapData.scopeSummary.offLimitsCount} organizations</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-700">Sourcing Clearance Rate</span>
                    <span className="font-bold text-slate-900">82% Clear Run-Rate</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  Alphabet (Google) flagged for confidential board review prior to direct approaches. All Tier-1 and Tier-2 targets clear of poach covenants.
                </div>
              </div>

            </div>

            {/* Recruiter Strategy Synthesis */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm mb-3">Executive Recruiter Mandate Synthesis</h4>
              <div className="prose prose-sm text-slate-600 text-xs leading-relaxed space-y-2">
                <p>
                  <strong>Mandate Overview:</strong> Sourcing for <strong>{project.title}</strong> at {project.company || 'Executive Search Practice'} is calibrated across {marketMapData.scopeSummary.totalCompaniesMapped} target enterprises representing $150M to $10B+ revenue scale. The core focus centers on leaders who have navigated high-growth capital rounds, modern enterprise operational metrics, and public market governance.
                </p>
                <p>
                  <strong>Recommended Approach:</strong> Lead outreach sequence with Tier-1 targets (Stripe, Datadog, Snowflake) where compensation benchmarks align with client budget parameters and vesting cliff catalysts offer immediate conversational openings. Leverage confidential blind teasers to protect market discretion.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 5. PREVIEW PRESENTATION MODAL ("See what it will look like before sharing") */}
      {/* ========================================================================= */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
            
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    Client Presentation Preview
                    <span className="text-[10px] font-semibold bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded border border-purple-400/30">
                      Read-Only Board View
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Executive dossier and target company org charts for the hiring committee and board of directors.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyShareUrl}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  {linkCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5 text-purple-400" />}
                  <span>{linkCopied ? 'Link Copied' : 'Copy Link'}</span>
                </button>

                <button
                  onClick={handlePrintPdf}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print to PDF</span>
                </button>

                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Presentation Navigation Tabs */}
            <div className="px-6 sm:px-8 py-2.5 bg-slate-800 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 shrink-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium mr-1.5">View Section:</span>
                <button
                  onClick={() => setPreviewTab('dossier')}
                  className={cn(
                    "px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer",
                    previewTab === 'dossier' 
                      ? "bg-purple-600 text-white shadow-2xs" 
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                  )}
                >
                  Full Board Dossier
                </button>
                <button
                  onClick={() => setPreviewTab('orgcharts')}
                  className={cn(
                    "px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5",
                    previewTab === 'orgcharts' 
                      ? "bg-purple-600 text-white shadow-2xs" 
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                  )}
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Company Org Charts</span>
                </button>
                <button
                  onClick={() => setPreviewTab('matrix')}
                  className={cn(
                    "px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer",
                    previewTab === 'matrix' 
                      ? "bg-purple-600 text-white shadow-2xs" 
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                  )}
                >
                  Market Tiers Matrix
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewExpandAllOrgs(prev => !prev)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer flex items-center gap-1",
                    previewExpandAllOrgs 
                      ? "bg-purple-900/60 text-purple-200 border-purple-500/50" 
                      : "bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700"
                  )}
                  title="Toggle all target company org charts simultaneously"
                >
                  <Layers className="w-3 h-3 text-purple-400" />
                  <span>{previewExpandAllOrgs ? 'Showing All Org Charts' : 'Single Org Chart View'}</span>
                </button>
              </div>
            </div>

            {/* Modal Body - The High-Fidelity Presentation Document */}
            <div className="p-8 sm:p-10 overflow-y-auto space-y-8 bg-slate-50/50 flex-1">
              
              {/* Document Banner */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">
                    PHENOM EXECUTIVE SEARCH · CONFIDENTIAL CALIBRATION DOSSIER
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                    Market Talent Map: {project.title}
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>Client: <strong>{project.company || 'In-House Search'}</strong></span>
                    <span>·</span>
                    <span>Lead Recruiter: <strong>{marketMapData.leadRecruiter}</strong></span>
                    <span>·</span>
                    <span>Date: <strong>{marketMapData.lastUpdated}</strong></span>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6 shrink-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Target Universe Scope</div>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    {marketMapData.scopeSummary.totalCompaniesMapped} Companies · {marketMapData.scopeSummary.totalExecutivesMapped} Leaders
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                    {marketMapData.scopeSummary.clearTargetsCount} Unrestricted Target Enterprises
                  </div>
                </div>
              </div>

              {/* VIEW 1: COMPLETE DOSSIER (Tiers + Org Charts + Highlights) */}
              {previewTab === 'dossier' && (
                <>
                  {/* Tiers Presentation */}
                  <div className="space-y-6">
                    <div className="pb-2 border-b border-slate-200">
                      <div className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">
                        SECTION 1: TARGET ENTERPRISE TIERS
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">
                        Target Ecosystem & Competitor Landscape
                      </h3>
                      <p className="text-xs text-slate-500">
                        Multi-tiered categorization of comparable scale enterprises, high-growth disruptors, and executive academies.
                      </p>
                    </div>

                    {marketMapData.tiers.map(tier => {
                      const comps = marketMapData.companies.filter(c => c.tier === tier.tierId);
                      if (comps.length === 0) return null;

                      return (
                        <div key={tier.tierId} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                              <h4 className="font-bold text-slate-900 text-base">{tier.name}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">{tier.description}</p>
                            </div>
                            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                              {comps.length} Companies
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {comps.map(comp => (
                              <div key={comp.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900 text-sm">{comp.name}</span>
                                  <span className={cn(
                                    "text-[10px] font-semibold px-2 py-0.5 rounded",
                                    comp.poachStatus === 'Clear Target' ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                  )}>
                                    {comp.poachStatus}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500">
                                  {comp.stage} · {comp.headquarters}
                                </div>
                                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200/80">
                                  <span className="font-semibold text-slate-700">Rationale: </span>
                                  {comp.strategicRationale}
                                </div>

                                {/* Mapped Execs summary list */}
                                <div className="space-y-1.5 pt-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calibrated Leaders</span>
                                  {comp.executives.map(e => (
                                    <div key={e.id} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white border border-slate-200/60">
                                      <div>
                                        <span className="font-semibold text-slate-800">{e.name}</span>
                                        <span className="text-[11px] text-slate-500 ml-1.5">({e.role})</span>
                                      </div>
                                      <span className="font-bold text-purple-700 text-[11px]">{e.matchScore}% Match</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Section 2: COMPANY ORG CHARTS IN PREVIEW (Requirement 5) */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                      <div>
                        <div className="text-[10px] font-bold text-purple-700 uppercase tracking-widest flex items-center gap-1.5">
                          <Network className="w-3.5 h-3.5" />
                          SECTION 2: ORGANIZATIONAL HIERARCHIES & REPORTING BENCH
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">
                          Target Enterprise Org Charts
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Executive reporting structures directly to the CEO and senior functional peers. Calibrated mandate leaders are highlighted in purple with match scores and mobility indicators.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewExpandAllOrgs(prev => !prev)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Layers className="w-3.5 h-3.5 text-purple-600" />
                          <span>{previewExpandAllOrgs ? 'Tabbed Company View' : 'Expand All Org Charts'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Embedded CompanyOrgChartViewer inside Preview Dossier */}
                    <CompanyOrgChartViewer 
                      companies={filteredCompanies} 
                      showAllMode={previewExpandAllOrgs}
                    />
                  </div>
                </>
              )}

              {/* VIEW 2: DEDICATED COMPANY ORG CHARTS PREVIEW */}
              {previewTab === 'orgcharts' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-bold text-purple-700 uppercase tracking-widest flex items-center gap-1.5">
                        <Network className="w-3.5 h-3.5" />
                        EXECUTIVE PRESENTATION VIEW
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-xl mt-0.5">
                        Target Enterprise Organizational Hierarchies
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Examine complete reporting lines to Chief Executive Officer and senior functional benches for {filteredCompanies.length} target enterprises.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewExpandAllOrgs(prev => !prev)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5 text-purple-600" />
                        <span>{previewExpandAllOrgs ? 'Tabbed Company View' : 'Expand All Org Charts'}</span>
                      </button>
                    </div>
                  </div>

                  <CompanyOrgChartViewer 
                    companies={filteredCompanies} 
                    showAllMode={previewExpandAllOrgs}
                  />
                </div>
              )}

              {/* VIEW 3: DEDICATED MATRIX PREVIEW */}
              {previewTab === 'matrix' && (
                <div className="space-y-6">
                  {marketMapData.tiers.map(tier => {
                    const comps = marketMapData.companies.filter(c => c.tier === tier.tierId);
                    if (comps.length === 0) return null;

                    return (
                      <div key={tier.tierId} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <h4 className="font-bold text-slate-900 text-base">{tier.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{tier.description}</p>
                          </div>
                          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                            {comps.length} Companies
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {comps.map(comp => (
                            <div key={comp.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 text-sm">{comp.name}</span>
                                <span className={cn(
                                  "text-[10px] font-semibold px-2 py-0.5 rounded",
                                  comp.poachStatus === 'Clear Target' ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                  )}>
                                  {comp.poachStatus}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500">
                                {comp.stage} · {comp.headquarters}
                              </div>
                              <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200/80">
                                <span className="font-semibold text-slate-700">Rationale: </span>
                                {comp.strategicRationale}
                              </div>

                              <div className="space-y-1.5 pt-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calibrated Leaders</span>
                                {comp.executives.map(e => (
                                  <div key={e.id} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white border border-slate-200/60">
                                    <div>
                                      <span className="font-semibold text-slate-800">{e.name}</span>
                                      <span className="text-[11px] text-slate-500 ml-1.5">({e.role})</span>
                                    </div>
                                    <span className="font-bold text-purple-700 text-[11px]">{e.matchScore}% Match</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Confidential Disclaimer */}
              <div className="text-center text-[11px] text-slate-400 py-4 border-t border-slate-200">
                STRICTLY CONFIDENTIAL · Prepared by {marketMapData.leadRecruiter} for the Search Committee and Board of Directors. Do not distribute without authorization.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-500">
                Export options: Shareable Presentation URL, PDF Dossier (with Org Charts), or CSV Spreadsheet.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadCsv}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Download CSV</span>
                </button>
                <button
                  onClick={handlePrintPdf}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print to PDF</span>
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ADD TARGET COMPANY MODAL */}
      {/* ========================================================================= */}
      {isAddCompanyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Add Target Company to Market Map</h3>
                <p className="text-xs text-slate-500 mt-0.5">Calibrate a new organization for executive extraction</p>
              </div>
              <button onClick={() => setIsAddCompanyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCompanySubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Figma, Canva, Databricks..."
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Tier</label>
                  <select
                    value={newCompany.tier}
                    onChange={(e) => setNewCompany({ ...newCompany, tier: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="Tier 1">Tier 1 — Direct Scale Peer</option>
                    <option value="Tier 2">Tier 2 — Adjacent Industry</option>
                    <option value="Tier 3">Tier 3 — High-Growth Scale-Up</option>
                    <option value="Tier 4">Tier 4 — Leadership Academy</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Poach / Compliance</label>
                  <select
                    value={newCompany.poachStatus}
                    onChange={(e) => setNewCompany({ ...newCompany, poachStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="Clear Target">Clear Target (Unrestricted)</option>
                    <option value="Restricted (Board)">Restricted (Board Covenant)</option>
                    <option value="Do Not Poach (Client)">Do Not Poach (Client Relationship)</option>
                    <option value="Caution (Commercial Partner)">Caution (Partner Relationship)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Headquarters</label>
                  <input
                    type="text"
                    placeholder="San Francisco, CA"
                    value={newCompany.headquarters}
                    onChange={(e) => setNewCompany({ ...newCompany, headquarters: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stage / Revenue Scale</label>
                  <input
                    type="text"
                    placeholder="Pre-IPO ($500M ARR)"
                    value={newCompany.stage}
                    onChange={(e) => setNewCompany({ ...newCompany, stage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Strategic Sourcing Rationale</label>
                <textarea
                  rows={2}
                  placeholder="Explain why this enterprise has high relevance for this mandate..."
                  value={newCompany.strategicRationale}
                  onChange={(e) => setNewCompany({ ...newCompany, strategicRationale: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCompanyModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Add to Map
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. ADD EXECUTIVE TO COMPANY MODAL */}
      {/* ========================================================================= */}
      {isAddExecutiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Map Executive Leader</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adding to {marketMapData.companies.find(c => c.id === (newExecutive.companyId || selectedCompanyForExec))?.name || 'Target Company'}
                </p>
              </div>
              <button onClick={() => setIsAddExecutiveModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExecutiveSubmit} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Executive Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amanda Vance"
                    value={newExecutive.name}
                    onChange={(e) => setNewExecutive({ ...newExecutive, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Current Title / Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SVP of Finance"
                    value={newExecutive.role}
                    onChange={(e) => setNewExecutive({ ...newExecutive, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Company</label>
                  <select
                    value={newExecutive.companyId || selectedCompanyForExec}
                    onChange={(e) => setNewExecutive({ ...newExecutive, companyId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  >
                    {marketMapData.companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.tier})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tenure in Seat</label>
                  <input
                    type="text"
                    placeholder="e.g. 3.8 years"
                    value={newExecutive.tenureYears}
                    onChange={(e) => setNewExecutive({ ...newExecutive, tenureYears: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobility Indicator (EMI %)</label>
                  <input
                    type="number"
                    min="10"
                    max="99"
                    value={newExecutive.mobilityScore}
                    onChange={(e) => setNewExecutive({ ...newExecutive, mobilityScore: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Outreach Status</label>
                  <select
                    value={newExecutive.outreachStatus}
                    onChange={(e) => setNewExecutive({ ...newExecutive, outreachStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="Clear Target">Clear Target</option>
                    <option value="In Dialogue">In Dialogue</option>
                    <option value="Pipelined">Pipelined</option>
                    <option value="Approached">Approached</option>
                    <option value="Benchmark Only">Benchmark Only</option>
                    <option value="Off-Limits">Off-Limits</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobility Catalyst / Flight Risk Driver</label>
                <input
                  type="text"
                  placeholder="e.g. 4-year vesting cliff; postponed IPO timeline"
                  value={newExecutive.mobilityCatalyst}
                  onChange={(e) => setNewExecutive({ ...newExecutive, mobilityCatalyst: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Previous Leadership Pedigree</label>
                <input
                  type="text"
                  placeholder="e.g. Ex-Goldman Sachs, ex-Twilio Finance Director"
                  value={newExecutive.previousPedigree}
                  onChange={(e) => setNewExecutive({ ...newExecutive, previousPedigree: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddExecutiveModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Map Executive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
