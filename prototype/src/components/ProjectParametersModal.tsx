import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import { 
  X, 
  Check, 
  Sparkles, 
  Briefcase, 
  DollarSign, 
  Scale, 
  MapPin, 
  Calendar, 
  FolderKanban, 
  Plus, 
  AlertCircle,
  HelpCircle,
  Building2,
  Users
} from 'lucide-react';
import { Project, ProjectParameters, ProjectRoleLevel, ProjectWorkModel } from '../types';
import {
  PROJECT_METRO_OPTIONS,
  PipelineSeedCandidate,
  cleanRoleTitle,
  findTrackedRole,
  roleToProjectDraft,
  trackedRoles,
} from '../lib/roleProject';

interface ProjectParametersModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null; // If provided, edit mode; otherwise, create mode
  onSave: (project: Project) => void;
  /** Create mode only: start pre-filled from this tracked role, with its bench as the pipeline */
  initialRoleId?: string | null;
}

const DEFAULT_METROS = PROJECT_METRO_OPTIONS;

const COMMON_DOMAINS = [
  'Infrastructure & Cloud Computing',
  'Enterprise B2B SaaS',
  'Platform Security & Identity',
  'Artificial Intelligence / ML Systems',
  'Financial Technology & Payments',
  'Corporate Governance & Capital Markets',
  'Hardware & Systems Architecture'
];

export function ProjectParametersModal({ isOpen, onOpenChange, project, onSave, initialRoleId }: ProjectParametersModalProps) {
  const isEdit = !!project;

  // Active parameter block tab for quick jumping
  const [activeBlock, setActiveBlock] = useState<number>(6);

  // Start from a tracked role (Roles & Succession): populates details and carries over the succession bench
  const [sourceRoleId, setSourceRoleId] = useState<string>('');
  const [includeBench, setIncludeBench] = useState(true);
  const [benchSeed, setBenchSeed] = useState<PipelineSeedCandidate[]>([]);
  const sourceRole = findTrackedRole(sourceRoleId);

  // Block 0: Project Basics
  const [title, setTitle] = useState(project?.title || '');
  const [company, setCompany] = useState(project?.company || '');
  const [leadRecruiter, setLeadRecruiter] = useState(project?.leadRecruiter || 'Brian Stepan');
  const [projectType, setProjectType] = useState(project?.type || 'Executive Search');
  const [stage, setStage] = useState(project?.stage || 'Calibration');
  const [status, setStatus] = useState(project?.status || 'Active');
  const [description, setDescription] = useState(project?.description || '');

  // Block 1: Role & Leveling Baseline
  const [primaryTitle, setPrimaryTitle] = useState(project?.parameters?.primaryTitle || project?.title || '');
  const [equivalentTitles, setEquivalentTitles] = useState<string[]>(
    project?.parameters?.equivalentTitles || []
  );
  const [newEquivInput, setNewEquivInput] = useState('');
  const [roleLevel, setRoleLevel] = useState<ProjectRoleLevel>(
    project?.parameters?.roleLevel || 'Vice President'
  );
  const [functionalDomain, setFunctionalDomain] = useState(
    project?.parameters?.functionalDomain || ''
  );
  const [domainKeywords, setDomainKeywords] = useState<string[]>(
    project?.parameters?.domainKeywords || []
  );
  const [newKeywordInput, setNewKeywordInput] = useState('');

  // Block 2: Compensation & Financial Framework
  const [targetBaseSalary, setTargetBaseSalary] = useState<number>(
    project?.parameters?.targetBaseSalary || 380000
  );
  const [maxBaseBudget, setMaxBaseBudget] = useState<number>(
    project?.parameters?.maxBaseBudget || 450000
  );
  const [variableOTE, setVariableOTE] = useState(
    project?.parameters?.variableOTE || '$180,000 (50% bonus)'
  );
  const [equityGrantValue, setEquityGrantValue] = useState(
    project?.parameters?.equityGrantValue || '$400,000 / 0.50% ownership'
  );
  const [maxTotalCompensationCeiling, setMaxTotalCompensationCeiling] = useState<number>(
    project?.parameters?.maxTotalCompensationCeiling || 680000
  );

  // Block 3: Scope & Scale Requirements
  const [targetCompanyStage, setTargetCompanyStage] = useState(
    project?.parameters?.targetCompanyStage || 'Series C–D ($50M–$150M ARR)'
  );
  const [requiredPandLScope, setRequiredPandLScope] = useState(
    project?.parameters?.requiredPandLScope || '$30M+ Enterprise P&L Scope'
  );
  const [teamHeadcountScale, setTeamHeadcountScale] = useState(
    project?.parameters?.teamHeadcountScale || '50+ headcount / 3-5 Director direct reports'
  );

  // Block 4: Location & Work Model
  const [workModel, setWorkModel] = useState<ProjectWorkModel>(
    project?.parameters?.workModel || 'Hybrid'
  );
  const [hybridDaysPerWeek, setHybridDaysPerWeek] = useState<number>(
    project?.parameters?.hybridDaysPerWeek || 3
  );
  const [targetMetropolitanMarkets, setTargetMetropolitanMarkets] = useState<string[]>(
    project?.parameters?.targetMetropolitanMarkets || ['San Francisco Bay Area', 'New York Metro Area']
  );
  const [relocationWillingness, setRelocationWillingness] = useState<boolean>(
    project?.parameters?.relocationWillingness ?? true
  );

  // Block 5: Timeline & Operational Constraints
  const [targetStartDate, setTargetStartDate] = useState(
    project?.parameters?.targetStartDate || '2026-12-01'
  );
  const [maxNoticePeriodTolerance, setMaxNoticePeriodTolerance] = useState(
    project?.parameters?.maxNoticePeriodTolerance || '60 days'
  );
  const [confidentialityProtocol, setConfidentialityProtocol] = useState(
    project?.parameters?.confidentialityProtocol || 'Named Enterprise Search'
  );

  // Reset or initialize state when project prop changes
  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setCompany(project.company);
      setLeadRecruiter(project.leadRecruiter);
      setProjectType(project.type);
      setStatus(project.status);
      setDescription(project.description || '');

      if (project.parameters) {
        setPrimaryTitle(project.parameters.primaryTitle);
        setEquivalentTitles(project.parameters.equivalentTitles);
        setRoleLevel(project.parameters.roleLevel);
        setFunctionalDomain(project.parameters.functionalDomain);
        setDomainKeywords(project.parameters.domainKeywords);
        setTargetBaseSalary(project.parameters.targetBaseSalary);
        setMaxBaseBudget(project.parameters.maxBaseBudget);
        setVariableOTE(project.parameters.variableOTE);
        setEquityGrantValue(project.parameters.equityGrantValue);
        setMaxTotalCompensationCeiling(project.parameters.maxTotalCompensationCeiling);
        setTargetCompanyStage(project.parameters.targetCompanyStage);
        setRequiredPandLScope(project.parameters.requiredPandLScope);
        setTeamHeadcountScale(project.parameters.teamHeadcountScale);
        setWorkModel(project.parameters.workModel);
        setHybridDaysPerWeek(project.parameters.hybridDaysPerWeek || 3);
        setTargetMetropolitanMarkets(project.parameters.targetMetropolitanMarkets);
        setRelocationWillingness(project.parameters.relocationWillingness);
        setTargetStartDate(project.parameters.targetStartDate);
        setMaxNoticePeriodTolerance(project.parameters.maxNoticePeriodTolerance);
        setConfidentialityProtocol(project.parameters.confidentialityProtocol || 'Named Enterprise Search');
      }
    } else {
      // Defaults for new project
      setSourceRoleId('');
      setIncludeBench(true);
      setBenchSeed([]);
      setTitle('');
      setCompany('');
      setLeadRecruiter('Brian Stepan');
      setProjectType('Executive Search');
      setStatus('Active');
      setDescription('');
      setPrimaryTitle('');
      setEquivalentTitles([]);
      setRoleLevel('Vice President');
      setFunctionalDomain('Enterprise B2B SaaS');
      setDomainKeywords(['Enterprise SaaS', 'Scaleup']);
      setTargetBaseSalary(375000);
      setMaxBaseBudget(450000);
      setVariableOTE('$175,000 (45% bonus)');
      setEquityGrantValue('$350,000 / 0.50% equity');
      setMaxTotalCompensationCeiling(650000);
      setTargetCompanyStage('Series B–D ($20M–$100M ARR)');
      setRequiredPandLScope('$20M+ P&L / Revenue Scope');
      setTeamHeadcountScale('40+ team members');
      setWorkModel('Hybrid');
      setHybridDaysPerWeek(3);
      setTargetMetropolitanMarkets(['San Francisco Bay Area']);
      setRelocationWillingness(true);
      setTargetStartDate('2026-12-01');
      setMaxNoticePeriodTolerance('60 days');
      setConfidentialityProtocol('Named Enterprise Search');
      if (isOpen && initialRoleId) applyRole(initialRoleId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, isOpen, initialRoleId]);

  const applyRole = (roleId: string) => {
    setSourceRoleId(roleId);
    const role = findTrackedRole(roleId);
    if (!role) {
      setBenchSeed([]);
      return;
    }
    const draft = roleToProjectDraft(role);
    const prm = draft.parameters;
    setTitle(draft.title);
    setStage(draft.stage);
    setDescription(draft.description);
    setPrimaryTitle(prm.primaryTitle);
    setEquivalentTitles(prm.equivalentTitles);
    setRoleLevel(prm.roleLevel);
    setFunctionalDomain(prm.functionalDomain);
    setDomainKeywords(prm.domainKeywords);
    setTargetBaseSalary(prm.targetBaseSalary);
    setMaxBaseBudget(prm.maxBaseBudget);
    setVariableOTE(prm.variableOTE);
    setEquityGrantValue(prm.equityGrantValue);
    setMaxTotalCompensationCeiling(prm.maxTotalCompensationCeiling);
    setTargetCompanyStage(prm.targetCompanyStage);
    setRequiredPandLScope(prm.requiredPandLScope);
    setTeamHeadcountScale(prm.teamHeadcountScale);
    setWorkModel(prm.workModel);
    setHybridDaysPerWeek(prm.hybridDaysPerWeek || 3);
    setTargetMetropolitanMarkets(prm.targetMetropolitanMarkets);
    setRelocationWillingness(prm.relocationWillingness);
    setTargetStartDate(prm.targetStartDate);
    setMaxNoticePeriodTolerance(prm.maxNoticePeriodTolerance);
    setConfidentialityProtocol(prm.confidentialityProtocol || 'Named Enterprise Search');
    setBenchSeed(draft.bench);
    setIncludeBench(true);
  };

  const clearRole = () => {
    setSourceRoleId('');
    setBenchSeed([]);
  };

  // Tag helper
  const addEquivalentTitle = () => {
    if (newEquivInput.trim() && !equivalentTitles.includes(newEquivInput.trim())) {
      setEquivalentTitles([...equivalentTitles, newEquivInput.trim()]);
      setNewEquivInput('');
    }
  };

  const removeEquivalentTitle = (titleToRemove: string) => {
    setEquivalentTitles(equivalentTitles.filter(t => t !== titleToRemove));
  };

  const addKeyword = () => {
    if (newKeywordInput.trim() && !domainKeywords.includes(newKeywordInput.trim())) {
      setDomainKeywords([...domainKeywords, newKeywordInput.trim()]);
      setNewKeywordInput('');
    }
  };

  const removeKeyword = (kwToRemove: string) => {
    setDomainKeywords(domainKeywords.filter(k => k !== kwToRemove));
  };

  const toggleMetro = (metro: string) => {
    if (targetMetropolitanMarkets.includes(metro)) {
      setTargetMetropolitanMarkets(targetMetropolitanMarkets.filter(m => m !== metro));
    } else {
      setTargetMetropolitanMarkets([...targetMetropolitanMarkets, metro]);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalParameters: ProjectParameters = {
      primaryTitle: primaryTitle.trim() || title.trim(),
      equivalentTitles,
      roleLevel,
      functionalDomain,
      domainKeywords,
      targetBaseSalary: Number(targetBaseSalary),
      maxBaseBudget: Number(maxBaseBudget),
      variableOTE,
      equityGrantValue,
      maxTotalCompensationCeiling: Number(maxTotalCompensationCeiling),
      targetCompanyStage,
      requiredPandLScope,
      teamHeadcountScale,
      workModel,
      hybridDaysPerWeek: workModel === 'Hybrid' ? Number(hybridDaysPerWeek) : undefined,
      targetMetropolitanMarkets,
      relocationWillingness,
      targetStartDate,
      maxNoticePeriodTolerance,
      confidentialityProtocol
    };

    const finalProject: Project = {
      id: project?.id || `p-${Date.now()}`,
      title: title.trim() || primaryTitle.trim() || 'Executive Search',
      company: 'In-House Executive Search',
      type: projectType,
      stage: stage || 'Calibration',
      status: status,
      createdAt: project?.createdAt || 'Oct 01, 2026',
      leadRecruiter: leadRecruiter,
      candidatesCount: !isEdit && sourceRole && includeBench ? benchSeed.length : project?.candidatesCount || 18,
      description: description.trim() || `In-house executive mandate for ${primaryTitle}.`,
      parameters: finalParameters,
      ...(isEdit
        ? {
            sourceRoleId: project?.sourceRoleId,
            sourceRoleTitle: project?.sourceRoleTitle,
            seedPipeline: project?.seedPipeline,
          }
        : sourceRole
          ? {
              sourceRoleId: sourceRole.id,
              sourceRoleTitle: cleanRoleTitle(sourceRole.roleTitle),
              seedPipeline: includeBench ? benchSeed : undefined,
            }
          : {}),
    };

    onSave(finalProject);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col z-50 animate-scaleIn">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  {isEdit ? 'Project Parameters & Setup' : 'New Executive Project'}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-300">
                  {isEdit ? project?.title : 'In-House Executive Search Setup'}
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-1">
                {isEdit ? 'Edit In-House Project Search Parameters' : 'Create In-House Executive Search Project'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure the six inputs feeding CMA, SFA, Master Graph filtering, and Market Calibration benchmarks.
              </p>
            </div>

            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Input Jump Nav */}
          <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Inputs:</span>
            {[
              { id: 6, label: '1. Project Details', icon: FolderKanban },
              { id: 1, label: '2. Role & Leveling', icon: Briefcase },
              { id: 2, label: '3. Compensation', icon: DollarSign },
              { id: 3, label: '4. Scope & Scale', icon: Scale },
              { id: 4, label: '5. Location & Work', icon: MapPin },
              { id: 5, label: '6. Timeline & Notice', icon: Calendar }
            ].map(b => {
              const Icon = b.icon;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setActiveBlock(b.id);
                    document.getElementById(`block-${b.id}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                    activeBlock === b.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {b.label}
                </button>
              );
            })}
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 bg-(--bg-neutral-minimal)">
            
            {/* ================================================================= */}
            {/* BLOCK 6: Project Details (shown first) */}
            {/* ================================================================= */}
            <div id="block-6" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Project Details</h3>
                    <p className="text-[11px] text-slate-500">
                      The role being searched, the recruiter assignment and the search strategy notes.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Project Record
                </span>
              </div>


              {/* Role / Title: pick a role tracked in Roles & Succession, or type one */}
              <div>
                <label htmlFor="role-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Role / Title *
                </label>
                {!isEdit && (
                  <select
                    id="role-select"
                    value={sourceRoleId}
                    onChange={e => (e.target.value ? applyRole(e.target.value) : clearRole())}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white text-slate-800"
                  >
                    <option value="">Enter a role manually</option>
                    <optgroup label="Active requisitions (Roles & Succession)">
                      {trackedRoles
                        .filter(r => r.type === 'active_requisition')
                        .map(r => (
                          <option key={r.id} value={r.id}>
                            {cleanRoleTitle(r.roleTitle)} · {r.department} · {r.candidates.length} on bench
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Succession benches (Roles & Succession)">
                      {trackedRoles
                        .filter(r => r.type === 'succession_bench')
                        .map(r => (
                          <option key={r.id} value={r.id}>
                            {cleanRoleTitle(r.roleTitle)} · {r.department} · {r.candidates.length} on bench
                          </option>
                        ))}
                    </optgroup>
                  </select>
                )}
                {(isEdit || !sourceRoleId) && (
                  <input
                    id="role-title"
                    type="text"
                    required
                    aria-label="Role / Title"
                    placeholder="e.g. Chief Financial Officer or VP of Engineering"
                    value={primaryTitle}
                    onChange={e => {
                      const v = e.target.value;
                      if (!title || title === primaryTitle) setTitle(v);
                      setPrimaryTitle(v);
                    }}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold outline-none ${isEdit ? '' : 'mt-2'}`}
                  />
                )}
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {isEdit
                    ? 'The core benchmark title for the search.'
                    : 'Pick a role you already track to fill this project in and carry over its succession bench, or enter the role yourself.'}
                </span>
              </div>

              {sourceRole && (
                <div className="rounded-lg border border-purple-200 bg-purple-50/60 p-4 space-y-3" role="status">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900">
                        Populated from {cleanRoleTitle(sourceRole.roleTitle)}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Hiring manager: {sourceRole.hiringManager}, {sourceRole.hiringManagerTitle} · Target date: {sourceRole.targetDate}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearRole}
                      className="text-xs font-semibold text-purple-700 hover:text-purple-900 shrink-0 cursor-pointer"
                    >
                      Clear role
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
                    {[sourceRole.department, sourceRole.level, sourceRole.priorityLevel, sourceRole.anchors.targetRevenueScale, sourceRole.anchors.geographicFlexibility].map(chip => (
                      <span key={chip} className="px-2 py-0.5 rounded bg-white border border-purple-200 text-purple-800">
                        {chip}
                      </span>
                    ))}
                  </div>
                  <label className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeBench}
                      onChange={e => setIncludeBench(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-(--color-secondary-200)"
                    />
                    <span>
                      <span className="font-semibold">
                        Add the succession bench to this project ({benchSeed.length} candidate{benchSeed.length === 1 ? '' : 's'})
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        Bench candidates are added to the project pipeline with their EMI scores, and warm outreach stages carry over.
                      </span>
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Review and adjust any populated field below before creating the project.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Project Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Financial Officer or VP of Engineering"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Hiring Department / Function
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Engineering & AI, Product, or Finance"
                    value={company === 'Client Corporation' ? 'Engineering & AI' : company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Lead Executive Recruiter
                  </label>
                  <input
                    type="text"
                    value={leadRecruiter}
                    onChange={e => setLeadRecruiter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Project Type
                  </label>
                  <select
                    value={projectType}
                    onChange={e => setProjectType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium bg-white"
                  >
                    <option value="Executive Search">Executive Search</option>
                    <option value="Standard Search">Standard Search</option>
                    <option value="Confidential Pipeline">Confidential Pipeline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Stage
                  </label>
                  <select
                    value={stage}
                    onChange={e => setStage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold bg-white text-purple-700"
                  >
                    <option value="Calibration">Calibration</option>
                    <option value="Slate Review">Slate Review</option>
                    <option value="Client Interview">Client Interview</option>
                    <option value="Offer & Closing">Offer & Closing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Search Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Intake Calibration">Intake Calibration</option>
                    <option value="Sourcing / Slate Building">Sourcing / Slate Building</option>
                    <option value="Client Interviews">Client Interviews</option>
                    <option value="Final Offer">Final Offer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Search Strategy & Overview Narrative
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Outline the core objective, organizational context, and key milestones for this retained mandate..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-purple-600 outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* ================================================================= */}
            {/* BLOCK 1: Role & Leveling Baseline */}
            {/* ================================================================= */}
            <div id="block-1" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Role & Leveling Baseline</h3>
                    <p className="text-[11px] text-slate-500">
                      Feeds the CMA "Step-Up Delta" and initial Master Graph search filters.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  CMA Core
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Executive Role Level *
                  </label>
                  <select
                    value={roleLevel}
                    onChange={e => setRoleLevel(e.target.value as ProjectRoleLevel)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white text-slate-800"
                  >
                    <option value="C-Suite">C-Suite (CEO, CFO, CTO, CISO, CMO, CPO)</option>
                    <option value="Executive Vice President">Executive Vice President (EVP)</option>
                    <option value="Senior Vice President">Senior Vice President (SVP)</option>
                    <option value="Vice President">Vice President (VP)</option>
                    <option value="Senior Director">Senior Director / Head of</option>
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Used to calculate step-up delta vs. candidate current level.
                  </span>
                </div>
              </div>

              {/* Acceptable Equivalent Titles */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Acceptable Equivalent Titles (Chips)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {equivalentTitles.map(eq => (
                    <span
                      key={eq}
                      className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium border border-slate-200 flex items-center gap-1.5"
                    >
                      {eq}
                      <button
                        type="button"
                        onClick={() => removeEquivalentTitle(eq)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add equivalent title (e.g. Head of Engineering, Senior Director of Engineering)"
                    value={newEquivInput}
                    onChange={e => setNewEquivInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addEquivalentTitle();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={addEquivalentTitle}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700"
                  >
                    + Add Title
                  </button>
                </div>
              </div>

              {/* Functional Domain & Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Core Functional Domain *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Infrastructure, B2B SaaS, Platform Security"
                    value={functionalDomain}
                    onChange={e => setFunctionalDomain(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {COMMON_DOMAINS.slice(0, 3).map(dom => (
                      <button
                        key={dom}
                        type="button"
                        onClick={() => setFunctionalDomain(dom)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded cursor-pointer"
                      >
                        {dom}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Required Tech Stack & Domain Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {domainKeywords.map(kw => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-medium flex items-center gap-1"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => removeKeyword(kw)}
                          className="text-blue-400 hover:text-blue-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add tag (e.g. Kubernetes, S-1, SOC2, Zero Trust)"
                      value={newKeywordInput}
                      onChange={e => setNewKeywordInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addKeyword();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700"
                    >
                      + Add Tag
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* BLOCK 2: Compensation & Financial Framework */}
            {/* ================================================================= */}
            <div id="block-2" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Compensation & Financial Framework</h3>
                    <p className="text-[11px] text-slate-500">
                      Feeds the SFA "Compensation Parity" scoring rule and Market Calibration salary benchmarks.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  SFA Parity
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Base Salary (Midpoint) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                    <input
                      type="number"
                      step={5000}
                      value={targetBaseSalary}
                      onChange={e => setTargetBaseSalary(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Expected target hire base salary.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Max Base Budget (Ceiling) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                    <input
                      type="number"
                      step={5000}
                      value={maxBaseBudget}
                      onChange={e => setMaxBaseBudget(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Absolute maximum base budget approved by CFO/Board.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Variable / OTE (On-Target Earnings)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $180,000 (50% bonus)"
                    value={variableOTE}
                    onChange={e => setVariableOTE(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none font-medium"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Annual target incentive / commission structure.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Equity / LTI Grant Value
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $450,000 / 0.50% ownership"
                    value={equityGrantValue}
                    onChange={e => setEquityGrantValue(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none font-medium"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Allocated long-term incentive or shares.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Max Total Comp Package Ceiling *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                    <input
                      type="number"
                      step={10000}
                      value={maxTotalCompensationCeiling}
                      onChange={e => setMaxTotalCompensationCeiling(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-rose-700 outline-none"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    If candidate comp exceeds this by &gt;15%, SFA triggers a red friction flag.
                  </span>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* BLOCK 3: Scope & Scale Requirements */}
            {/* ================================================================= */}
            <div id="block-3" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Scope & Scale Requirements</h3>
                    <p className="text-[11px] text-slate-500">
                      Feeds the CMA "Scale Expansion" calculation (comparing past P&L/headcount to open position).
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  Scale Fit
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Co. Stage / Revenue *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Series B–D ($20M–$100M ARR)"
                    value={targetCompanyStage}
                    onChange={e => setTargetCompanyStage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Expected target company maturity.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Required P&L Scope *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $10M+ ARR / $50M Budget"
                    value={requiredPandLScope}
                    onChange={e => setRequiredPandLScope(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Minimum financial responsibility managed.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Team / Headcount Scale *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50+ engineers / 4 Directors"
                    value={teamHeadcountScale}
                    onChange={e => setTeamHeadcountScale(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Direct + indirect organizational scale.</span>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* BLOCK 4: Location & Work Model */}
            {/* ================================================================= */}
            <div id="block-4" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                    5
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Location & Work Model</h3>
                    <p className="text-[11px] text-slate-500">
                      Feeds the CMA "Geo/Lifestyle" match and Market Calibration geographic heatmaps.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Geo & Lifestyle
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Work Model *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Remote', 'Hybrid', 'On-Site'] as ProjectWorkModel[]).map(wm => (
                      <button
                        key={wm}
                        type="button"
                        onClick={() => setWorkModel(wm)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                          workModel === wm
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {wm}
                      </button>
                    ))}
                  </div>

                  {workModel === 'Hybrid' && (
                    <div className="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between">
                      <span className="text-xs text-blue-900 font-semibold">Required Days Per Week On-Site:</span>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map(days => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => setHybridDaysPerWeek(days)}
                            className={`w-7 h-7 rounded text-xs font-bold ${
                              hybridDaysPerWeek === days
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-slate-700 border border-slate-200'
                            }`}
                          >
                            {days}d
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Relocation Willingness Toggle */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Relocation Support / Willingness Filter
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Client is open to paying relocation or considering candidates willing to move.
                      </span>
                    </div>
                    <Switch.Root
                      checked={relocationWillingness}
                      onCheckedChange={setRelocationWillingness}
                      className={`w-10 h-6 rounded-full relative transition-colors ${
                        relocationWillingness ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <Switch.Thumb
                        className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-xs ${
                          relocationWillingness ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </Switch.Root>
                  </div>
                </div>

                {/* Target Metropolitan Markets */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Target Metropolitan Markets *
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {targetMetropolitanMarkets.length} selected
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Click to select primary metro clusters where candidate sourcing is authorized.
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                    {DEFAULT_METROS.map(metro => {
                      const isSelected = targetMetropolitanMarkets.includes(metro);
                      return (
                        <button
                          key={metro}
                          type="button"
                          onClick={() => toggleMetro(metro)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {metro}
                          {isSelected && <Check className="w-3 h-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* BLOCK 5: Timeline & Operational Constraints */}
            {/* ================================================================= */}
            <div id="block-5" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                    6
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Timeline & Operational Constraints</h3>
                    <p className="text-[11px] text-slate-500">
                      Feeds the SFA "Notice Period & Availability" match and confidentiality protocols.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                  SFA Availability
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Hiring / Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={targetStartDate}
                    onChange={e => setTargetStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Target placement onboarding date.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Max Notice Period / Garden Leave Tolerance *
                  </label>
                  <select
                    value={maxNoticePeriodTolerance}
                    onChange={e => setMaxNoticePeriodTolerance(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white text-slate-800"
                  >
                    <option value="30 days">30 days (Standard US)</option>
                    <option value="60 days">60 days (VP / Executive)</option>
                    <option value="90 days">90 days (C-Suite / Enterprise)</option>
                    <option value="6 months">6 months (Garden Leave / Board Approval)</option>
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">Maximum acceptable transition window.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confidentiality Protocol
                  </label>
                  <select
                    value={confidentialityProtocol}
                    onChange={e => setConfidentialityProtocol(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white text-slate-800"
                  >
                    <option value="Named Enterprise Search">Named Enterprise Search</option>
                    <option value="Strictly Confidential Blind Teaser">Strictly Confidential Blind Teaser</option>
                    <option value="Board-Authorized Retained Mandate">Board-Authorized Retained Mandate</option>
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">Governs outreach voice & branding disclosure.</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between sticky bottom-0 bg-white/95 backdrop-blur-xs py-3 px-2">
              <span className="text-xs text-slate-500">
                All inputs feed autonomous agent scoring and intake calibration.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-purple-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  {isEdit ? 'Save Project Parameters' : 'Create & Calibrate Project'}
                </button>
              </div>
            </div>

          </form>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
