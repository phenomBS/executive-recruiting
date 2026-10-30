import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { 
  ArrowLeft, 
  Briefcase, 
  Map, 
  Users, 
  Network, 
  Mail, 
  Sparkles, 
  Building2, 
  UserCircle, 
  Target, 
  Edit3, 
  DollarSign, 
  Scale, 
  MapPin, 
  Clock, 
  Sliders,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ProjectCandidatesTab, ProjectPipelineCandidate, initialProjectPipeline, PIPELINE_STAGES } from './tabs/ProjectCandidatesTab';
import { GenerateSearchBookModal, SearchBookSendSummary } from './GenerateSearchBookModal';
import { useRestricted } from '../context/RestrictedContext';
import { ProjectRecommendationsTab } from './tabs/ProjectRecommendationsTab';
import { ProjectRelationshipsTab } from './tabs/ProjectRelationshipsTab';
import { ProjectMarketMapTab } from './tabs/ProjectMarketMapTab';
import { ProjectParametersModal } from './ProjectParametersModal';
import { getRecommendationsForProject } from '../data/projectRecommendationsData';
import { useRouter } from '../context/RouterContext';

interface ExecutiveSearchProjectDetailProps {
  project: Project;
  onBack: () => void;
  onUpdateProject?: (project: Project) => void;
}

type TabType = 'overview' | 'recommendations' | 'candidates' | 'market-map' | 'relationships' | 'nurture';

export function ExecutiveSearchProjectDetail({ project, onBack, onUpdateProject }: ExecutiveSearchProjectDetailProps) {
  const router = useRouter();
  const validTabs: TabType[] = ['overview', 'recommendations', 'candidates', 'market-map', 'relationships', 'nurture'];
  const activeTab: TabType = (router.activeTab && validTabs.includes(router.activeTab as TabType))
    ? (router.activeTab as TabType)
    : 'overview';
  const setActiveTab = (tab: TabType) => {
    router.setTab(tab === 'overview' ? null : tab);
  };
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSearchBookModal, setShowSearchBookModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<ProjectPipelineCandidate[]>(initialProjectPipeline);
  const { restrictedCompanies } = useRestricted();

  // Restricted (off-limits) candidates never appear in a project's search book
  const searchBookCandidates = useMemo(
    () =>
      pipeline.filter(
        c =>
          !restrictedCompanies.some(rc => rc.name.trim().toLowerCase() === c.company?.trim().toLowerCase()) &&
          !(c as any).isRestricted &&
          !(c as any).restricted
      ),
    [pipeline, restrictedCompanies]
  );

  const handleSendSearchBook = (summary: SearchBookSendSummary) => {
    setShowSearchBookModal(false);
    const n = summary.recipients.length;
    setToastMessage(
      `Search book (${summary.templateName}, ${summary.candidateCount} candidate${summary.candidateCount === 1 ? '' : 's'}) sent to ${n} recipient${n === 1 ? '' : 's'}.`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Compute master graph recommendations dynamically for this project
  const recommendationsData = useMemo(() => getRecommendationsForProject(project), [project]);
  const recommendationsCount = recommendationsData.totalCount;

  const tabs: { id: TabType; label: string; icon: any; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'recommendations', label: 'Recommendations', icon: Sparkles, count: recommendationsCount },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'market-map', label: 'Market Map', icon: Map },
    { id: 'relationships', label: 'Relationships', icon: Network },
    { id: 'nurture', label: 'Nurture', icon: Mail },
  ];

  const params = project.parameters;

  return (
    <div className="flex flex-col h-full bg-(--bg-surface-base) overflow-y-auto w-full">
      <ProjectParametersModal
        isOpen={showSettingsModal}
        onOpenChange={setShowSettingsModal}
        project={project}
        onSave={(updated) => {
          if (onUpdateProject) onUpdateProject(updated);
        }}
      />

      {showSearchBookModal && (
        <GenerateSearchBookModal
          projectTitle={project.title}
          leadRecruiter={project.leadRecruiter}
          candidates={searchBookCandidates}
          stages={PIPELINE_STAGES}
          onClose={() => setShowSearchBookModal(false)}
          onSend={handleSendSearchBook}
        />
      )}

      {toastMessage && (
        <div role="status" className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-slideUp">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="bg-slate-900 border-b border-slate-800 shrink-0 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="px-8 py-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Projects
            </button>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl border border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/30 uppercase tracking-wider">
                      {project.type || 'Executive Search'}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
                      {project.status || 'Active'}
                    </span>
                    {params?.roleLevel && (
                      <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-wider">
                        {params.roleLevel}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5"><UserCircle className="w-4 h-4"/> Lead: {project.leadRecruiter}</span>
                    {params?.workModel && (
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {params.workModel} {params.hybridDaysPerWeek ? `(${params.hybridDaysPerWeek}d/wk)` : ''}</span>
                    )}
                    {params?.targetBaseSalary && (
                      <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4"/> Target Base: ${(params.targetBaseSalary / 1000).toFixed(0)}K</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowSettingsModal(true)}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-semibold text-white hover:bg-slate-700 shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-purple-400" />
                  Project Settings & Parameters
                </button>
                <button
                  type="button"
                  onClick={() => setShowSearchBookModal(true)}
                  className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-semibold text-white hover:bg-purple-500 shadow-sm transition-colors inline-block text-center cursor-pointer"
                >
                  Generate Search Book
                </button>
              </div>
            </div>
          </div>

          <div className="px-8 flex gap-8 overflow-x-auto no-scrollbar">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer",
                    activeTab === tab.id 
                      ? "border-purple-400 text-purple-400" 
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {typeof tab.count === 'number' && (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-bold transition-colors",
                      activeTab === tab.id 
                        ? "bg-purple-500/30 text-purple-200 border border-purple-400/40" 
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto h-full">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-6">
                  {/* Search Strategy & Overview */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                        <h3 className="text-base font-bold text-slate-900">Search Strategy & Retained Mandate</h3>
                      </div>
                      <button
                        onClick={() => setShowSettingsModal(true)}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Parameters
                      </button>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                      {project.description || 'Targeting exceptional executive leadership to drive organizational transformation and scaling.'}
                    </p>
                  </div>

                  {/* The Six Core Parameter Blocks Overview */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Configured Search Parameter Blocks</h3>
                        <p className="text-xs text-slate-500">Autonomous agent scoring rules & calibration baselines.</p>
                      </div>
                      <button
                        onClick={() => setShowSettingsModal(true)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5" /> Configure All Blocks
                      </button>
                    </div>

                    <div className="p-6 space-y-6 divide-y divide-slate-100">
                      
                      {/* Block 1: Role & Leveling Baseline */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">1</span>
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Role & Leveling Baseline</h4>
                          </div>
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Feeds CMA Step-Up Delta & Master Graph
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Primary Title</span>
                            <span className="font-bold text-slate-800">{params?.primaryTitle || project.title}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Role Level</span>
                            <span className="font-bold text-blue-700">{params?.roleLevel || 'Vice President'}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Functional Domain</span>
                            <span className="font-medium text-slate-700">{params?.functionalDomain || 'Enterprise SaaS'}</span>
                          </div>
                        </div>

                        {params?.equivalentTitles && params.equivalentTitles.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap text-xs">
                            <span className="text-[11px] text-slate-400 font-semibold">Equivalent Titles:</span>
                            {params.equivalentTitles.map(eq => (
                              <span key={eq} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                                {eq}
                              </span>
                            ))}
                          </div>
                        )}

                        {params?.domainKeywords && params.domainKeywords.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap text-xs">
                            <span className="text-[11px] text-slate-400 font-semibold">Tech & Domain Tags:</span>
                            {params.domainKeywords.map(kw => (
                              <span key={kw} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Block 2: Compensation & Financial Framework */}
                      <div className="pt-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">2</span>
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Compensation & Financial Framework</h4>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Feeds SFA Compensation Parity
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Base (Midpoint)</span>
                            <span className="font-bold text-slate-900">${((params?.targetBaseSalary || 380000) / 1000).toFixed(0)}K Base</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Max Base Budget</span>
                            <span className="font-bold text-slate-900">${((params?.maxBaseBudget || 450000) / 1000).toFixed(0)}K Ceiling</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Variable / OTE</span>
                            <span className="font-medium text-slate-700">{params?.variableOTE || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Max Total Package</span>
                            <span className="font-bold text-rose-700">${((params?.maxTotalCompensationCeiling || 680000) / 1000).toFixed(0)}K Max</span>
                          </div>
                        </div>
                        {params?.equityGrantValue && (
                          <div className="text-xs text-slate-600 flex items-center gap-2">
                            <span className="text-slate-400 font-medium">Equity / LTI Grant:</span>
                            <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[11px]">
                              {params.equityGrantValue}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Block 3: Scope & Scale Requirements */}
                      <div className="pt-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">3</span>
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Scope & Scale Requirements</h4>
                          </div>
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            Feeds CMA Scale Expansion
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Stage / Valuation</span>
                            <span className="font-bold text-slate-800">{params?.targetCompanyStage || 'Scaleup'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Required P&L Scope</span>
                            <span className="font-bold text-slate-800">{params?.requiredPandLScope || '$20M+ P&L'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Team / Headcount Scale</span>
                            <span className="font-bold text-slate-800">{params?.teamHeadcountScale || '50+ headcount'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Block 4: Location & Work Model */}
                      <div className="pt-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">4</span>
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Location & Work Model</h4>
                          </div>
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Feeds CMA Geo/Lifestyle Match
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Work Model Policy</span>
                            <span className="font-bold text-slate-900">
                              {params?.workModel || 'Hybrid'} {params?.hybridDaysPerWeek ? `(${params.hybridDaysPerWeek} Days/Wk)` : ''}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Relocation Policy</span>
                            <span className="font-semibold text-emerald-700">
                              {params?.relocationWillingness ? 'Open to Relocation Packages' : 'Strictly Local Candidates'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Metro Markets</span>
                            <span className="font-medium text-slate-700 truncate block">
                              {params?.targetMetropolitanMarkets?.join(', ') || 'All Major Tech Hubs'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Block 5: Timeline & Operational Constraints */}
                      <div className="pt-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">5</span>
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Timeline & Operational Constraints</h4>
                          </div>
                          <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Feeds SFA Notice Period & Availability
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Start Date</span>
                            <span className="font-bold text-slate-800">{params?.targetStartDate || 'Q4 2026'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Max Notice / Garden Leave</span>
                            <span className="font-bold text-slate-800">{params?.maxNoticePeriodTolerance || '60 days'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Confidentiality Protocol</span>
                            <span className="font-medium text-purple-700">{params?.confidentialityProtocol || 'Named Search'}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Funnel Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Target Companies</span>
                        <span className="font-bold text-slate-900">42</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Identified Candidates</span>
                        <span className="font-bold text-slate-900">128</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">In Outreach</span>
                        <span className="font-bold text-slate-900">45</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Active Dialogues</span>
                        <span className="font-bold text-slate-900">12</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Presented</span>
                        <span className="font-bold text-slate-900">3</span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}
          
          {activeTab === 'market-map' && (
            <ProjectMarketMapTab project={project} />
          )}

          {activeTab === 'recommendations' && (
            <ProjectRecommendationsTab project={project} />
          )}

          {activeTab === 'candidates' && (
            <ProjectCandidatesTab project={project} pipeline={pipeline} onPipelineChange={setPipeline} />
          )}

          {activeTab === 'relationships' && (
            <ProjectRelationshipsTab projectTitle={project.title} />
          )}

          {activeTab === 'nurture' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <Target className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 capitalize">Executive Nurture Workspace</h3>
              <p className="max-w-md text-center text-sm">Automated and high-touch executive nurture sequences for this mandate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
