import React, { useState, useEffect, useRef } from 'react';
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
import type { SearchAgentDraft } from '../lib/searchAgentDraft';
import {
  PROJECT_METRO_OPTIONS,
  PipelineSeedCandidate,
  cleanRoleTitle,
  findTrackedRole,
  roleToProjectDraft,
  trackedRoles,
} from '../lib/roleProject';
import {
  COMPANY_HEADQUARTERS,
  COMPANY_INDUSTRIES,
  COMPANY_OWNERSHIP,
  EMPTY_COMPANY_PROFILE,
  GROWTH_POSTURES,
  HEADCOUNT_BANDS,
  REVENUE_BANDS,
} from '../lib/companyProfile';
import type { CompanyProfile } from '../types';

interface ProjectParametersModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null; // If provided, edit mode; otherwise, create mode
  onSave: (project: Project) => void;
  /** Create mode only: start pre-filled from this tracked role, with its bench as the pipeline */
  initialRoleId?: string | null;
  /** Create mode only: fields the Phenom Search Agent filled from the mandate */
  draft?: SearchAgentDraft | null;
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

export function ProjectParametersModal({ isOpen, onOpenChange, project, onSave, initialRoleId, draft }: ProjectParametersModalProps) {
  const isEdit = !!project;

  // Active parameter block tab for quick jumping
  const [activeBlock, setActiveBlock] = useState<number>(6);
  const formRef = useRef<HTMLFormElement>(null);

  const showBlock = (id: number) => {
    setActiveBlock(id);
    const scroller = formRef.current;
    const target = document.getElementById(`block-${id}`);
    if (!scroller || !target) return;
    const top = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    scroller.scrollTo({ top: Math.max(0, top - 12), behavior: 'smooth' });
  };

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
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(
    project?.parameters?.companyProfile ?? EMPTY_COMPANY_PROFILE
  );

  const setProfile = (patch: Partial<CompanyProfile>) => setCompanyProfile(prev => ({ ...prev, ...patch }));
  const toggleProfileValue = (key: 'industries' | 'ownership' | 'headquarters', value: string) => {
    setCompanyProfile(prev => {
      const list = prev[key];
      return { ...prev, [key]: list.includes(value) ? list.filter(item => item !== value) : [...list, value] };
    });
  };

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
        setCompanyProfile(project.parameters.companyProfile ?? EMPTY_COMPANY_PROFILE);
      }
    } else if (draft) {
      const prm = draft.parameters;
      setSourceRoleId('');
      setIncludeBench(false);
      setBenchSeed([]);
      setTitle(draft.title);
      setCompany('In-House Executive Search');
      setLeadRecruiter('Brian Stepan');
      setProjectType('Executive Search');
      setStatus('Active');
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
      setCompanyProfile(prm.companyProfile ?? EMPTY_COMPANY_PROFILE);
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
      setCompanyProfile(EMPTY_COMPANY_PROFILE);
      if (isOpen && initialRoleId) applyRole(initialRoleId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, isOpen, initialRoleId, draft]);

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
      confidentialityProtocol,
      companyProfile,
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
        <Dialog.Overlay
          className="fixed inset-0 z-(--z-overlay) animate-fadeIn"
          style={{ background: 'var(--bg-overlay-blanket)' }}
        />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-(--bg-default) rounded-2xl shadow-2xl border border-(--border-light) w-full max-w-4xl h-[92vh] max-h-[92vh] overflow-hidden flex flex-col z-(--z-modal) animate-scaleIn">
          <div className="px-6 py-5 border-b border-(--border-light) flex items-start justify-between gap-4 shrink-0">
            <div>
              <span className="phx-tag">{isEdit ? 'Project parameters' : 'New executive project'}</span>
              <Dialog.Title className="m-0! mt-2! text-xl! font-bold text-(--text-strong)">
                {isEdit ? 'Edit project search parameters' : 'Create executive search project'}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-(--text-default) m-0! mt-1!">
                {isEdit ? project?.title : 'In-house executive search setup'}. These inputs feed scoring, filtering, and market calibration.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" aria-label="Close">
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <div role="tablist" aria-label="Project inputs" className="px-6 shrink-0 sticky top-0 z-10 bg-(--bg-default) flex-wrap!">
            {[
              { id: 6, label: 'Project Details', icon: FolderKanban },
              { id: 7, label: 'Company profile', icon: Building2 },
              { id: 1, label: 'Role & Leveling', icon: Briefcase },
              { id: 2, label: 'Compensation', icon: DollarSign },
              { id: 3, label: 'Scope & Scale', icon: Scale },
              { id: 4, label: 'Location & Work', icon: MapPin },
              { id: 5, label: 'Timeline & Notice', icon: Calendar }
            ].map(b => {
              const Icon = b.icon;
              return (
                <button
                  key={b.id}
                  type="button"
                  role="tab"
                  aria-selected={activeBlock === b.id}
                  onClick={() => showBlock(b.id)}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {b.label}
                </button>
              );
            })}
          </div>

          {/* Form Body */}
          <form id="project-parameters-form" ref={formRef} onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-8 bg-(--bg-neutral-minimal)">
            
            {/* ================================================================= */}
            {/* BLOCK 6: Project Details (shown first) */}
            {/* ================================================================= */}
            <div id="block-6" className="bg-white rounded-2xl border border-(--border-light) p-5 space-y-4">
              <div className="border-b border-(--border-faint) pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold shrink-0" style={{ background: 'var(--bg-brand-secondary-subtle)', color: 'var(--text-brand-secondary-default)' }}>
                    1
                  </div>
                  <div>
                    <h3 className="m-0! text-base! leading-6! font-bold text-(--text-strong)">Project Details</h3>
                    <p className="text-sm text-(--text-default) m-0!">
                      The role being searched, the recruiter assignment and the search strategy notes.
                    </p>
                  </div>
                </div>
                <span className="phx-tag shrink-0">
                  Project Record
                </span>
              </div>


              {/* Role / Title: pick a role tracked in Roles & Succession, or type one */}
              <div>
                <label htmlFor="role-select" className="phx-label">
                  Role / Title *
                </label>
                {!isEdit && (
                  <select
                    id="role-select"
                    value={sourceRoleId}
                    onChange={e => (e.target.value ? applyRole(e.target.value) : clearRole())}
                    className="w-full"
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
                    className={`w-full ${isEdit ? '' : 'mt-2'}`}
                  />
                )}
                <span className="text-sm text-(--text-default) mt-1 block">
                  {isEdit
                    ? 'The core benchmark title for the search.'
                    : 'Pick a role you already track to fill this project in and carry over its succession bench, or enter the role yourself.'}
                </span>
              </div>

              {sourceRole && (
                <div className="phx-feedback flex flex-col gap-3" data-tone="info" role="status">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="m-0! text-base! leading-6! font-bold text-(--text-strong)">
                        Populated from {cleanRoleTitle(sourceRole.roleTitle)}
                      </div>
                      <div className="text-sm text-(--text-default) mt-0.5">
                        Hiring manager: {sourceRole.hiringManager}, {sourceRole.hiringManagerTitle} · Target date: {sourceRole.targetDate}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearRole}
                      className="phx-btn shrink-0" data-variant="tertiary" data-size="sm"
                    >
                      Clear role
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[sourceRole.department, sourceRole.level, sourceRole.priorityLevel, sourceRole.anchors.targetRevenueScale, sourceRole.anchors.geographicFlexibility].map(chip => (
                      <span key={chip} className="phx-tag">
                        {chip}
                      </span>
                    ))}
                  </div>
                  <label className="flex items-start gap-2.5 text-sm text-(--text-strong) cursor-pointer">
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
                      <span className="block text-sm text-(--text-default) mt-0.5">
                        Bench candidates are added to the project pipeline with their EMI scores, and warm outreach stages carry over.
                      </span>
                    </span>
                  </label>
                  <p className="text-sm text-(--text-default) m-0!">
                    Review and adjust any populated field below before creating the project.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="phx-label">
                    Project Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Financial Officer or VP of Engineering"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="phx-label">
                    Hiring Department / Function
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Engineering & AI, Product, or Finance"
                    value={company === 'Client Corporation' ? 'Engineering & AI' : company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                <div>
                  <label className="phx-label">
                    Lead Executive Recruiter
                  </label>
                  <input
                    type="text"
                    value={leadRecruiter}
                    onChange={e => setLeadRecruiter(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="phx-label">
                    Project Type
                  </label>
                  <select
                    value={projectType}
                    onChange={e => setProjectType(e.target.value)}
                    className="w-full"
                  >
                    <option value="Executive Search">Executive Search</option>
                    <option value="Standard Search">Standard Search</option>
                    <option value="Confidential Pipeline">Confidential Pipeline</option>
                  </select>
                </div>

                <div>
                  <label className="phx-label">
                    Stage
                  </label>
                  <select
                    value={stage}
                    onChange={e => setStage(e.target.value)}
                    className="w-full"
                  >
                    <option value="Calibration">Calibration</option>
                    <option value="Slate Review">Slate Review</option>
                    <option value="Client Interview">Client Interview</option>
                    <option value="Offer & Closing">Offer & Closing</option>
                  </select>
                </div>

                <div>
                  <label className="phx-label">
                    Search Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full"
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
                <label className="phx-label">
                  Search Strategy & Overview Narrative
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Outline the core objective, organizational context, and key milestones for this retained mandate..."
                  className="w-full"
                />
              </div>
            </div>

            <div id="block-7" className="bg-white rounded-2xl border border-(--border-light) p-5 space-y-4">
              <div className="border-b border-(--border-faint) pb-3">
                <h3 className="m-0! text-base! leading-6! font-bold text-(--text-strong)">Target company profile</h3>
                <p className="text-sm text-(--text-default) m-0! mt-1!">
                  Describe the kind of company to source from. Named companies are added later, on the Companies tab.
                </p>
              </div>

              <ProfileChoices
                label="Industries"
                options={COMPANY_INDUSTRIES}
                selected={companyProfile.industries}
                onToggle={value => toggleProfileValue('industries', value)}
              />
              <ProfileChoices
                label="Ownership"
                options={COMPANY_OWNERSHIP}
                selected={companyProfile.ownership}
                onToggle={value => toggleProfileValue('ownership', value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="phx-label" htmlFor="co-revenue">Revenue</label>
                  <select id="co-revenue" className="w-full" value={companyProfile.revenueBand} onChange={e => setProfile({ revenueBand: e.target.value })}>
                    <option value="">Select a revenue band</option>
                    {REVENUE_BANDS.map(band => <option key={band}>{band}</option>)}
                  </select>
                </div>
                <div>
                  <label className="phx-label" htmlFor="co-headcount">Headcount</label>
                  <select id="co-headcount" className="w-full" value={companyProfile.headcountBand} onChange={e => setProfile({ headcountBand: e.target.value })}>
                    <option value="">Select a headcount band</option>
                    {HEADCOUNT_BANDS.map(band => <option key={band}>{band}</option>)}
                  </select>
                </div>
                <div>
                  <label className="phx-label" htmlFor="co-growth">Growth posture</label>
                  <select id="co-growth" className="w-full" value={companyProfile.growthPosture} onChange={e => setProfile({ growthPosture: e.target.value })}>
                    <option value="">Select a growth posture</option>
                    {GROWTH_POSTURES.map(band => <option key={band}>{band}</option>)}
                  </select>
                </div>
                <div>
                  <label className="phx-label" htmlFor="co-model">Business model</label>
                  <input
                    id="co-model"
                    type="text"
                    value={companyProfile.businessModel}
                    onChange={e => setProfile({ businessModel: e.target.value })}
                    placeholder="For example, multi-product B2B software"
                    className="w-full"
                  />
                </div>
              </div>

              <ProfileChoices
                label="Where the company is based"
                options={COMPANY_HEADQUARTERS}
                selected={companyProfile.headquarters}
                onToggle={value => toggleProfileValue('headquarters', value)}
              />

              <div>
                <label className="phx-label" htmlFor="co-characteristics">What must be true of the company</label>
                <textarea
                  id="co-characteristics"
                  rows={3}
                  value={companyProfile.characteristics}
                  onChange={e => setProfile({ characteristics: e.target.value })}
                  placeholder="For example, a product company whose finance leader has taken a business through an audit or a fundraise."
                  className="w-full"
                />
              </div>
              <div>
                <label className="phx-label" htmlFor="co-exclusions">Company types to leave out</label>
                <textarea
                  id="co-exclusions"
                  rows={2}
                  value={companyProfile.exclusions}
                  onChange={e => setProfile({ exclusions: e.target.value })}
                  placeholder="For example, agencies, consultancies, and staffing firms."
                  className="w-full"
                />
              </div>
            </div>

            {/* ================================================================= */}
            {/* BLOCK 1: Role & Leveling Baseline */}
            {/* ================================================================= */}
            <div id="block-1" className="bg-white rounded-2xl border border-(--border-light) p-5 space-y-4">
              <div className="border-b border-(--border-faint) pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold shrink-0" style={{ background: 'var(--bg-brand-secondary-subtle)', color: 'var(--text-brand-secondary-default)' }}>
                    2
                  </div>
                  <div>
                    <h3 className="m-0! text-base! leading-6! font-bold text-(--text-strong)">Role & Leveling Baseline</h3>
                    <p className="text-sm text-(--text-default) m-0!">
                      Feeds the CMA "Step-Up Delta" and initial Master Graph search filters.
                    </p>
                  </div>
                </div>
                <span className="phx-tag shrink-0">
                  CMA Core
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="phx-label">
                    Executive Role Level *
                  </label>
                  <select
                    value={roleLevel}
                    onChange={e => setRoleLevel(e.target.value as ProjectRoleLevel)}
                    className="w-full"
                  >
                    <option value="C-Suite">C-Suite (CEO, CFO, CTO, CISO, CMO, CPO)</option>
                    <option value="Executive Vice President">Executive Vice President (EVP)</option>
                    <option value="Senior Vice President">Senior Vice President (SVP)</option>
                    <option value="Vice President">Vice President (VP)</option>
                    <option value="Senior Director">Senior Director / Head of</option>
                  </select>
                  <span className="text-sm text-(--text-subtle) mt-1 block">
                    Used to calculate step-up delta vs. candidate current level.
                  </span>
                </div>
              </div>

              {/* Acceptable Equivalent Titles */}
              <div>
                <label className="phx-label">
                  Acceptable Equivalent Titles (Chips)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {equivalentTitles.map(eq => (
                    <span
                      key={eq}
                      className="phx-tag"
                    >
                      {eq}
                      <button
                        type="button"
                        onClick={() => removeEquivalentTitle(eq)}
                        className="phx-btn" data-variant="tertiary" data-size="sm" aria-label={`Remove ${eq}`}
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
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={addEquivalentTitle}
                    className="phx-btn shrink-0" data-variant="secondary" data-size="sm"
                  >
                    + Add Title
                  </button>
                </div>
              </div>

              {/* Functional Domain & Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-(--border-faint)">
                <div>
                  <label className="phx-label">
                    Core Functional Domain *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Infrastructure, B2B SaaS, Platform Security"
                    value={functionalDomain}
                    onChange={e => setFunctionalDomain(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {COMMON_DOMAINS.slice(0, 3).map(dom => (
                      <button
                        key={dom}
                        type="button"
                        onClick={() => setFunctionalDomain(dom)}
                        className="phx-btn" data-variant="tertiary" data-size="sm"
                      >
                        {dom}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="phx-label">
                    Required Tech Stack & Domain Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {domainKeywords.map(kw => (
                      <span
                        key={kw}
                        className="phx-tag"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => removeKeyword(kw)}
                          className="phx-btn" data-variant="tertiary" data-size="sm" aria-label={`Remove ${kw}`}
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
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="phx-btn shrink-0" data-variant="secondary" data-size="sm"
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
            <div id="block-2" className="bg-white rounded-2xl border border-(--border-light) p-5 space-y-4">
              <div className="border-b border-(--border-faint) pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold shrink-0" style={{ background: 'var(--bg-brand-secondary-subtle)', color: 'var(--text-brand-secondary-default)' }}>
                    3
                  </div>
                  <div>
                    <h3 className="m-0! text-base! leading-6! font-bold text-(--text-strong)">Compensation & Financial Framework</h3>
                    <p className="text-sm text-(--text-default) m-0!">
                      Feeds the SFA "Compensation Parity" scoring rule and Market Calibration salary benchmarks.
                    </p>
                  </div>
                </div>
                <span className="phx-tag shrink-0">
                  SFA Parity
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="phx-label">
                    Target Base Salary (Midpoint) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-(--text-subtle)">$</span>
                    <input
                      type="number"
                      step={5000}
                      value={targetBaseSalary}
                      onChange={e => setTargetBaseSalary(Number(e.target.value))}
                      className="w-full pl-8"
                      required
                    />
                  </div>
                  <span className="text-sm text-(--text-subtle) mt-1 block">Expected target hire base salary.</span>
                </div>

                <div>
                  <label className="phx-label">
                    Max Base Budget (Ceiling) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-(--text-subtle)">$</span>
                    <input
                      type="number"
                      step={5000}
                      value={maxBaseBudget}
                      onChange={e => setMaxBaseBudget(Number(e.target.value))}
                      className="w-full pl-8"
                      required
                    />
                  </div>
                  <span className="text-sm text-(--text-subtle) mt-1 block">Absolute maximum base budget approved by CFO/Board.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-(--border-faint)">
                <div>
                  <label className="phx-label">
                    Variable / OTE (On-Target Earnings)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $180,000 (50% bonus)"
                    value={variableOTE}
                    onChange={e => setVariableOTE(e.target.value)}
                    className="w-full"
                  />
                  <span className="text-sm text-(--text-subtle) mt-1 block">Annual target incentive / commission structure.</span>
                </div>

                <div>
                  <label className="phx-label">
                    Equity / LTI Grant Value
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $450,000 / 0.50% ownership"
                    value={equityGrantValue}
                    onChange={e => setEquityGrantValue(e.target.value)}
                    className="w-full"
                  />
                  <span className="text-sm text-(--text-subtle) mt-1 block">Allocated long-term incentive or shares.</span>
                </div>

                <div>
                  <label className="phx-label">
                    Max Total Comp Package Ceiling *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-(--text-subtle)">$</span>
                    <input
                      type="number"
                      step={10000}
                      value={maxTotalCompensationCeiling}
                      onChange={e => setMaxTotalCompensationCeiling(Number(e.target.value))}
                      className="w-full pl-8"
                      required
                    />
                  </div>
                  <span className="text-sm text-(--text-subtle) mt-1 block">
                    If candidate comp exceeds this by &gt;15%, SFA triggers a red friction flag.
                  </span>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* BLOCK 3: Scope & Scale Requirements */}
            {/* ================================================================= */}
            <div id="block-3" className="bg-white rounded-2xl border border-(--border-light) p-5 space-y-4">
              <div className="border-b border-(--border-faint) pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold shrink-0" style={{ background: 'var(--bg-brand-secondary-subtle)', color: 'var(--text-brand-secondary-default)' }}>
                    4
                  </div>
                  <div>
                    <h3 className="m-0! text-base! leading-6! font-bold text-(--text-strong)">Scope & Scale Requirements</h3>
                    <p className="text-sm text-(--text-default) m-0!">
                      Feeds the CMA "Scale Expansion" calculation (comparing past P&L/headcount to open position).
                    </p>
                  </div>
                </div>
                <span className="phx-tag shrink-0">
                  Scale Fit
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="phx-label">
                    Target Co. Stage / Revenue *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Series B–D ($20M–$100M ARR)"
                    value={targetCompanyStage}
                    onChange={e => setTargetCompanyStage(e.target.value)}
                    className="w-full"
                  />
                  <span className="text-sm text-(--text-subtle) mt-1 block">Expected target company maturity.</span>
                </div>

                <div>
                  <label className="phx-label">
                    Required P&L Scope *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $10M+ ARR / $50M Budget"
                    value={requiredPandLScope}
                    onChange={e => setRequiredPandLScope(e.target.value)}
                    className="w-full"
                  />
                  <span className="text-sm text-(--text-subtle) mt-1 block">Minimum financial responsibility managed.</span>
                </div>

                <div>
                  <label className="phx-label">
                    Team / Headcount Scale *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50+ engineers / 4 Directors"
                    value={teamHeadcountScale}
                    onChange={e => setTeamHeadcountScale(e.target.value)}
                    className="w-full"
                  />
                  <span className="text-sm text-(--text-subtle) mt-1 block">Direct + indirect organizational scale.</span>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* BLOCK 4: Location & Work Model */}
            {/* ================================================================= */}
            <div id="block-4" className="bg-white rounded-2xl border border-(--border-light) p-5 space-y-4">
              <div className="border-b border-(--border-faint) pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold shrink-0" style={{ background: 'var(--bg-brand-secondary-subtle)', color: 'var(--text-brand-secondary-default)' }}>
                    5
                  </div>
                  <div>
                    <h3 className="m-0! text-base! leading-6! font-bold text-(--text-strong)">Location & Work Model</h3>
                    <p className="text-sm text-(--text-default) m-0!">
                      Feeds the CMA "Geo/Lifestyle" match and Market Calibration geographic heatmaps.
                    </p>
                  </div>
                </div>
                <span className="phx-tag shrink-0">
                  Geo & Lifestyle
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="phx-label">
                    Work Model *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Remote', 'Hybrid', 'On-Site'] as ProjectWorkModel[]).map(wm => (
                      <button
                        key={wm}
                        type="button"
                        onClick={() => setWorkModel(wm)}
                        className="phx-btn"
                        data-variant="secondary"
                        data-size="sm"
                        aria-pressed={workModel === wm}
                        style={workModel === wm ? { background: 'var(--bg-brand-secondary-subtle)', color: 'var(--text-brand-secondary-default)', borderColor: 'var(--text-brand-secondary-default)' } : undefined}
                      >
                        {wm}
                      </button>
                    ))}
                  </div>

                  {workModel === 'Hybrid' && (
                    <div className="mt-3 p-3 rounded-xl border border-(--border-light) bg-(--bg-neutral-soft) flex items-center justify-between">
                      <span className="text-sm font-semibold text-(--text-strong)">Required days per week on site</span>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map(days => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => setHybridDaysPerWeek(days)}
                            className="phx-btn"
                            data-variant="secondary"
                            data-size="sm"
                            aria-pressed={hybridDaysPerWeek === days}
                            aria-label={`${days} days on site`}
                            style={hybridDaysPerWeek === days ? { background: 'var(--bg-brand-secondary-subtle)', color: 'var(--text-brand-secondary-default)', borderColor: 'var(--text-brand-secondary-default)' } : undefined}
                          >
                            {days}d
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Relocation Willingness Toggle */}
                  <div className="mt-4 p-3 rounded-xl border border-(--border-light) bg-(--bg-neutral-soft) flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-(--text-strong) block">
                        Relocation support
                      </span>
                      <span className="text-sm text-(--text-default) m-0!">
                        Client is open to paying relocation or considering candidates willing to move.
                      </span>
                    </div>
                    <Switch.Root
                      checked={relocationWillingness}
                      onCheckedChange={setRelocationWillingness}
                      className="w-10 h-6 rounded-full relative"
                      style={{ background: relocationWillingness ? 'var(--bg-brand-secondary-default)' : 'var(--color-neutrals-100)' }}
                      aria-label="Relocation support"
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
                    <label className="phx-label">
                      Target Metropolitan Markets *
                    </label>
                    <span className="text-sm text-(--text-subtle)">
                      {targetMetropolitanMarkets.length} selected
                    </span>
                  </div>
                  <p className="text-sm text-(--text-default) mb-2">
                    Click to select primary metro clusters where candidate sourcing is authorized.
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-(--bg-neutral-soft) rounded-xl border border-(--border-light)">
                    {[...DEFAULT_METROS, ...targetMetropolitanMarkets.filter(metro => !DEFAULT_METROS.includes(metro))].map(metro => {
                      const isSelected = targetMetropolitanMarkets.includes(metro);
                      return (
                        <button
                          key={metro}
                          type="button"
                          onClick={() => toggleMetro(metro)}
                          className="phx-btn"
                          data-variant="secondary"
                          data-size="sm"
                          aria-pressed={isSelected}
                          style={isSelected ? { background: 'var(--bg-brand-secondary-subtle)', color: 'var(--text-brand-secondary-default)', borderColor: 'var(--text-brand-secondary-default)' } : undefined}
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
            <div id="block-5" className="bg-white rounded-2xl border border-(--border-light) p-5 space-y-4">
              <div className="border-b border-(--border-faint) pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold shrink-0" style={{ background: 'var(--bg-brand-secondary-subtle)', color: 'var(--text-brand-secondary-default)' }}>
                    6
                  </div>
                  <div>
                    <h3 className="m-0! text-base! leading-6! font-bold text-(--text-strong)">Timeline & Operational Constraints</h3>
                    <p className="text-sm text-(--text-default) m-0!">
                      Feeds the SFA "Notice Period & Availability" match and confidentiality protocols.
                    </p>
                  </div>
                </div>
                <span className="phx-tag shrink-0">
                  SFA Availability
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="phx-label">
                    Target Hiring / Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={targetStartDate}
                    onChange={e => setTargetStartDate(e.target.value)}
                    className="w-full"
                  />
                  <span className="text-sm text-(--text-subtle) mt-1 block">Target placement onboarding date.</span>
                </div>

                <div>
                  <label className="phx-label">
                    Max Notice Period / Garden Leave Tolerance *
                  </label>
                  <select
                    value={maxNoticePeriodTolerance}
                    onChange={e => setMaxNoticePeriodTolerance(e.target.value)}
                    className="w-full"
                  >
                    <option value="30 days">30 days (Standard US)</option>
                    <option value="60 days">60 days (VP / Executive)</option>
                    <option value="90 days">90 days (C-Suite / Enterprise)</option>
                    <option value="6 months">6 months (Garden Leave / Board Approval)</option>
                  </select>
                  <span className="text-sm text-(--text-subtle) mt-1 block">Maximum acceptable transition window.</span>
                </div>

                <div>
                  <label className="phx-label">
                    Confidentiality Protocol
                  </label>
                  <select
                    value={confidentialityProtocol}
                    onChange={e => setConfidentialityProtocol(e.target.value)}
                    className="w-full"
                  >
                    <option value="Named Enterprise Search">Named Enterprise Search</option>
                    <option value="Strictly Confidential Blind Teaser">Strictly Confidential Blind Teaser</option>
                    <option value="Board-Authorized Retained Mandate">Board-Authorized Retained Mandate</option>
                  </select>
                  <span className="text-sm text-(--text-subtle) mt-1 block">Governs outreach voice & branding disclosure.</span>
                </div>
              </div>
            </div>

          </form>

          <div className="shrink-0 flex items-center justify-between gap-3 px-6 py-4 border-t border-(--border-light) bg-(--bg-default)">
            <span className="text-sm text-(--text-default)">
              All inputs feed autonomous agent scoring and intake calibration.
            </span>
            <div className="flex items-center gap-3">
              <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </button>
              <button type="submit" form="project-parameters-form" className="phx-btn" data-variant="primary" data-size="sm">
                <Check className="w-4 h-4" aria-hidden="true" />
                {isEdit ? 'Save parameters' : 'Create project'}
              </button>
            </div>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ProfileChoices({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <span className="phx-label">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {[...options, ...selected.filter(item => item && !options.includes(item))].map(option => {
          const on = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              className="phx-btn"
              data-variant="secondary"
              data-size="sm"
              aria-pressed={on}
              onClick={() => onToggle(option)}
              style={on ? { background: 'var(--bg-brand-secondary-subtle)', color: 'var(--text-brand-secondary-default)', borderColor: 'var(--text-brand-secondary-default)' } : undefined}
            >
              {option}
              {on && <Check className="w-3 h-3" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
