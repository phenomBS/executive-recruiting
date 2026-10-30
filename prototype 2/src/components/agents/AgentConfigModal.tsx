import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Bot, 
  Sparkles, 
  ShieldAlert, 
  Sliders, 
  MessageSquare, 
  Clock, 
  Volume2, 
  FileText, 
  Check, 
  RotateCcw, 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Target,
  BrainCircuit,
  Lock,
  Plus,
  Trash2,
  Briefcase,
  Layers,
  Flame,
  Network,
  Info,
  Scale,
  PlusCircle,
  Copy,
  PenTool,
  Wand2,
  BookOpen
} from 'lucide-react';
import { useAgentConfig, DEFAULT_ARCHETYPES } from '../../context/AgentConfigContext';
import { AuraAgentConfig, PrimeAgentConfig, EmiSubWeights, SearchVoiceArchetype } from '../../types';
import { cn } from '../../lib/utils';

export function AgentConfigModal() {
  const { 
    isConfigModalOpen, 
    configModalAgent, 
    closeConfigModal, 
    auraConfig, 
    updateAuraConfig, 
    primeConfig, 
    updatePrimeConfig, 
    resetToDefaults 
  } = useAgentConfig();

  const [currentAgent, setCurrentAgent] = useState<'aura' | 'prime'>('aura');
  const [activeTab, setActiveTab] = useState<string>('emi');
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Local draft states
  const [draftAura, setDraftAura] = useState<AuraAgentConfig>(auraConfig);
  const [draftPrime, setDraftPrime] = useState<PrimeAgentConfig>(primeConfig);
  const [newProhibitedWord, setNewProhibitedWord] = useState('');
  const [newExcludedTitle, setNewExcludedTitle] = useState('');

  // Archetype customization states
  const [isCreatingArchetype, setIsCreatingArchetype] = useState(false);
  const [newArchTitle, setNewArchTitle] = useState('');
  const [newArchDesc, setNewArchDesc] = useState('');
  const [newArchFormality, setNewArchFormality] = useState(4);
  const [newArchDirectness, setNewArchDirectness] = useState(3);
  const [newArchWordCount, setNewArchWordCount] = useState(135);
  const [newArchProtocol, setNewArchProtocol] = useState<'Strictly Confidential Blind Teaser' | 'Named Enterprise Search' | 'Board-Authorized Retained Mandate'>('Strictly Confidential Blind Teaser');
  const [newArchInstructions, setNewArchInstructions] = useState('');
  const [newArchSignature, setNewArchSignature] = useState('Managing Director, Executive Search Practice');

  const activeArchetypesList: SearchVoiceArchetype[] = draftPrime.archetypes && draftPrime.archetypes.length > 0 
    ? draftPrime.archetypes 
    : DEFAULT_ARCHETYPES;

  const activeArchetypeId = draftPrime.selectedArchetypeId || activeArchetypesList[0]?.id || 'executive-search-partner';
  const activeArchetype = activeArchetypesList.find(a => a.id === activeArchetypeId) || activeArchetypesList[0];

  const handleSelectArchetype = (archId: string) => {
    const target = activeArchetypesList.find(a => a.id === archId);
    if (!target) return;
    setDraftPrime(prev => ({
      ...prev,
      selectedArchetypeId: archId,
      projectVoice: {
        ...prev.projectVoice,
        archetype: target.title,
        toneFormality: target.toneFormality,
        toneDirectness: target.toneDirectness,
        confidentialityProtocol: target.confidentialityProtocol,
        targetWordCount: target.targetWordCount,
        customInstructions: target.customInstructions,
        prohibitedPhrases: [...target.prohibitedPhrases],
        signatureFormat: target.signatureFormat,
      },
    }));
  };

  const updateActiveArchetype = (updates: Partial<SearchVoiceArchetype>) => {
    setDraftPrime(prev => {
      const currentList = prev.archetypes && prev.archetypes.length > 0 ? prev.archetypes : DEFAULT_ARCHETYPES;
      const updatedList = currentList.map(arch => {
        if (arch.id === activeArchetypeId) {
          return { ...arch, ...updates };
        }
        return arch;
      });
      const updatedActive = updatedList.find(a => a.id === activeArchetypeId) || updatedList[0];
      return {
        ...prev,
        archetypes: updatedList,
        projectVoice: {
          ...prev.projectVoice,
          archetype: updatedActive.title,
          toneFormality: updatedActive.toneFormality,
          toneDirectness: updatedActive.toneDirectness,
          confidentialityProtocol: updatedActive.confidentialityProtocol,
          targetWordCount: updatedActive.targetWordCount,
          customInstructions: updatedActive.customInstructions,
          prohibitedPhrases: [...updatedActive.prohibitedPhrases],
          signatureFormat: updatedActive.signatureFormat,
        },
      };
    });
  };

  const handleCreateArchetypeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newArchTitle.trim()) return;

    const newId = `custom-arch-${Date.now()}`;
    const newArch: SearchVoiceArchetype = {
      id: newId,
      title: newArchTitle.trim(),
      description: newArchDesc.trim() || 'Custom executive search persona archetype tailored for specific mandate criteria.',
      isCustom: true,
      toneFormality: newArchFormality,
      toneDirectness: newArchDirectness,
      confidentialityProtocol: newArchProtocol,
      targetWordCount: newArchWordCount || 135,
      customInstructions: newArchInstructions.trim() || 'Engage executive talent with peer-level gravitas, discreet institutional authority, and clear strategic alignment.',
      prohibitedPhrases: ['rockstar', 'urgent opening', 'resume', 'quick chat', 'hiring manager'],
      signatureFormat: newArchSignature.trim() || 'Managing Director, Executive Search Practice',
    };

    setDraftPrime(prev => {
      const currentList = prev.archetypes && prev.archetypes.length > 0 ? prev.archetypes : DEFAULT_ARCHETYPES;
      return {
        ...prev,
        selectedArchetypeId: newId,
        archetypes: [...currentList, newArch],
        projectVoice: {
          ...prev.projectVoice,
          archetype: newArch.title,
          toneFormality: newArch.toneFormality,
          toneDirectness: newArch.toneDirectness,
          confidentialityProtocol: newArch.confidentialityProtocol,
          targetWordCount: newArch.targetWordCount,
          customInstructions: newArch.customInstructions,
          prohibitedPhrases: [...newArch.prohibitedPhrases],
          signatureFormat: newArch.signatureFormat,
        },
      };
    });

    setNewArchTitle('');
    setNewArchDesc('');
    setNewArchFormality(4);
    setNewArchDirectness(3);
    setNewArchWordCount(135);
    setNewArchInstructions('');
    setIsCreatingArchetype(false);
  };

  const handleDeleteArchetype = (archId: string) => {
    setDraftPrime(prev => {
      const currentList = prev.archetypes && prev.archetypes.length > 0 ? prev.archetypes : DEFAULT_ARCHETYPES;
      const remaining = currentList.filter(a => a.id !== archId);
      const fallbackId = remaining[0]?.id || 'executive-search-partner';
      const fallbackArch = remaining.find(a => a.id === fallbackId) || DEFAULT_ARCHETYPES[0];
      return {
        ...prev,
        selectedArchetypeId: fallbackId,
        archetypes: remaining,
        projectVoice: {
          ...prev.projectVoice,
          archetype: fallbackArch.title,
          toneFormality: fallbackArch.toneFormality,
          toneDirectness: fallbackArch.toneDirectness,
          confidentialityProtocol: fallbackArch.confidentialityProtocol,
          targetWordCount: fallbackArch.targetWordCount,
          customInstructions: fallbackArch.customInstructions,
          prohibitedPhrases: [...fallbackArch.prohibitedPhrases],
          signatureFormat: fallbackArch.signatureFormat,
        },
      };
    });
  };

  // Sync draft when modal opens
  useEffect(() => {
    const targetAgent = configModalAgent === 'prime' ? 'prime' : 'aura';
    setCurrentAgent(targetAgent);
    setDraftAura(auraConfig);
    setDraftPrime(primeConfig);
    if (targetAgent === 'aura') {
      setActiveTab('emi');
    } else {
      setActiveTab('project-voice');
    }
  }, [configModalAgent, isConfigModalOpen, auraConfig, primeConfig]);

  if (!isConfigModalOpen) return null;

  const handleSave = () => {
    if (currentAgent === 'aura') {
      updateAuraConfig(draftAura);
    } else {
      updatePrimeConfig(draftPrime);
    }
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      closeConfigModal();
    }, 600);
  };

  const handleMacroWeightChange = (key: 'cma' | 'ptm' | 'sfa', val: number) => {
    setDraftAura(prev => ({
      ...prev,
      emiWeights: {
        ...prev.emiWeights,
        [key]: val,
      },
    }));
  };

  const handleSubWeightChange = (subKey: keyof EmiSubWeights, val: number) => {
    setDraftAura(prev => ({
      ...prev,
      emiWeights: {
        ...prev.emiWeights,
        subWeights: {
          ...prev.emiWeights.subWeights,
          [subKey]: val,
        },
      },
    }));
  };

  const weightsSum = draftAura.emiWeights.cma + draftAura.emiWeights.ptm + draftAura.emiWeights.sfa;

  const addProhibitedPhrase = () => {
    if (!newProhibitedWord.trim()) return;
    const phrase = newProhibitedWord.trim().toLowerCase();
    const currentList = activeArchetype?.prohibitedPhrases || draftPrime.projectVoice?.prohibitedPhrases || [];
    if (!currentList.includes(phrase)) {
      updateActiveArchetype({
        prohibitedPhrases: [...currentList, phrase],
      });
    }
    setNewProhibitedWord('');
  };

  const removeProhibitedPhrase = (phrase: string) => {
    const currentList = activeArchetype?.prohibitedPhrases || draftPrime.projectVoice?.prohibitedPhrases || [];
    updateActiveArchetype({
      prohibitedPhrases: currentList.filter(p => p !== phrase),
    });
  };

  const addExcludedTitle = () => {
    if (!newExcludedTitle.trim()) return;
    const kw = newExcludedTitle.trim();
    if (!draftAura.research.excludedTitleKeywords.includes(kw)) {
      setDraftAura(prev => ({
        ...prev,
        research: {
          ...prev.research,
          excludedTitleKeywords: [...prev.research.excludedTitleKeywords, kw],
        },
      }));
    }
    setNewExcludedTitle('');
  };

  const removeExcludedTitle = (kw: string) => {
    setDraftAura(prev => ({
      ...prev,
      research: {
        ...prev.research,
        excludedTitleKeywords: prev.research.excludedTitleKeywords.filter(k => k !== kw),
      },
    }));
  };

  const sub = draftAura.emiWeights.subWeights;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shadow-xs",
              currentAgent === 'aura' ? "bg-purple-600 text-white" : "bg-blue-600 text-white"
            )}>
              {currentAgent === 'aura' ? <BrainCircuit className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {currentAgent === 'aura' ? 'Aura Agent Configuration' : 'Prime Agent Configuration'}
                </h2>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase",
                  (currentAgent === 'aura' ? draftAura.status : draftPrime.status) === 'active' 
                    ? "bg-emerald-100 text-emerald-800" 
                    : "bg-amber-100 text-amber-800"
                )}>
                  {currentAgent === 'aura' ? draftAura.status : draftPrime.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentAgent === 'aura' 
                  ? 'Executive research, warming nurture campaigns, and comprehensive EMI mobility scoring engine.'
                  : 'Executive search project agent: high-level project voice, candidate calibration, and project governance.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Agent Switcher Tabs */}
            <div className="bg-slate-200/80 p-1 rounded-lg flex items-center gap-1 text-xs font-semibold">
              <button
                onClick={() => {
                  setCurrentAgent('aura');
                  setActiveTab('emi');
                }}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5",
                  currentAgent === 'aura' ? "bg-white text-purple-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                )}
              >
                <BrainCircuit className="w-3.5 h-3.5" /> Aura Agent
              </button>
              <button
                onClick={() => {
                  setCurrentAgent('prime');
                  setActiveTab('project-voice');
                }}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5",
                  currentAgent === 'prime' ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Briefcase className="w-3.5 h-3.5" /> Prime Agent
              </button>
            </div>

            <button
              onClick={closeConfigModal}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Secondary Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-white flex gap-6 overflow-x-auto no-scrollbar shrink-0 text-sm font-semibold">
          {currentAgent === 'aura' ? (
            <>
              <button
                onClick={() => setActiveTab('emi')}
                className={cn(
                  "py-3 border-b-2 transition-colors flex items-center gap-2",
                  activeTab === 'emi' ? "border-purple-600 text-purple-700" : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Sliders className="w-4 h-4" /> EMI Scoring Logic Breakdown
              </button>
              <button
                onClick={() => setActiveTab('warming')}
                className={cn(
                  "py-3 border-b-2 transition-colors flex items-center gap-2",
                  activeTab === 'warming' ? "border-purple-600 text-purple-700" : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Flame className="w-4 h-4" /> Executive Warming & Nurturing
              </button>
              <button
                onClick={() => setActiveTab('research')}
                className={cn(
                  "py-3 border-b-2 transition-colors flex items-center gap-2",
                  activeTab === 'research' ? "border-purple-600 text-purple-700" : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Network className="w-4 h-4" /> Research & Org Chart Sync
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('project-voice')}
                className={cn(
                  "py-3 border-b-2 transition-colors flex items-center gap-2",
                  activeTab === 'project-voice' ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Sliders className="w-4 h-4" /> Search Project Voice & Rules
              </button>
              <button
                onClick={() => setActiveTab('project-calibration')}
                className={cn(
                  "py-3 border-b-2 transition-colors flex items-center gap-2",
                  activeTab === 'project-calibration' ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Target className="w-4 h-4" /> Candidate Calibration & SLAs
              </button>
              <button
                onClick={() => setActiveTab('project-governance')}
                className={cn(
                  "py-3 border-b-2 transition-colors flex items-center gap-2",
                  activeTab === 'project-governance' ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <ShieldAlert className="w-4 h-4" /> Client Off-Limits & Gates
              </button>
            </>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-(--bg-neutral-minimal)">
          
          {/* ========================================================================= */}
          {/* AURA AGENT TABS */}
          {/* ========================================================================= */}

          {/* TAB 1: EMI SCORING LOGIC BREAKDOWN (from attached screenshot) */}
          {currentAgent === 'aura' && activeTab === 'emi' && (
            <div className="space-y-6">
              
              {/* Macro Pillar Sliders with Sum Indicator */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Macro Category Allocation</h3>
                    <p className="text-xs text-slate-500">
                      Standard allocation: CMA (40%), PTM (35%), SFA (25%). Adjust sliders below to modify weighting.
                    </p>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5",
                    weightsSum === 100 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                  )}>
                    {weightsSum === 100 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    Total: {weightsSum}% (Target: 100%)
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                  <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-purple-900">
                      <span>CMA (Motivation Alignment)</span>
                      <span className="font-mono text-purple-700">{draftAura.emiWeights.cma}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={70}
                      value={draftAura.emiWeights.cma}
                      onChange={e => handleMacroWeightChange('cma', parseInt(e.target.value))}
                      className="w-full accent-purple-600 h-2 bg-purple-200 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block">Title, scale, and lifestyle motivation delta</span>
                  </div>

                  <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-indigo-900">
                      <span>PTM (Propensity to Move)</span>
                      <span className="font-mono text-indigo-700">{draftAura.emiWeights.ptm}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={70}
                      value={draftAura.emiWeights.ptm}
                      onChange={e => handleMacroWeightChange('ptm', parseInt(e.target.value))}
                      className="w-full accent-indigo-600 h-2 bg-indigo-200 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block">Stock turmoil, vesting cliffs, blocked VP status</span>
                  </div>

                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-blue-900">
                      <span>SFA (Structural Fit)</span>
                      <span className="font-mono text-blue-700">{draftAura.emiWeights.sfa}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={70}
                      value={draftAura.emiWeights.sfa}
                      onChange={e => handleMacroWeightChange('sfa', parseInt(e.target.value))}
                      className="w-full accent-blue-600 h-2 bg-blue-200 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block">Comp parity, legal off-limits, notice period</span>
                  </div>
                </div>
              </div>

              {/* DETAILED SUB-WEIGHT BREAKDOWNS (Exactly from discussion image) */}
              <div className="space-y-6">
                
                {/* 1. CMA SUB-WEIGHTS */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                        CMA (Motivation Alignment) Sub-Weights & Logic
                      </h4>
                      <p className="text-xs text-slate-500">Overall Category Weight: {draftAura.emiWeights.cma}%</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded">
                      Sub-total: {sub.cmaStepUpDelta + sub.cmaScaleExpansion + sub.cmaProfileMatch + sub.cmaGeoLifestyle}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>"Step-Up" Delta (title promotion)</span>
                        <span className="font-mono text-purple-700">{sub.cmaStepUpDelta}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={60}
                        value={sub.cmaStepUpDelta}
                        onChange={e => handleSubWeightChange('cmaStepUpDelta', parseInt(e.target.value))}
                        className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-500">
                        <strong>Logic:</strong> Comparing current title to open req (e.g. Director &rarr; VP, VP &rarr; C-Suite).
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Scale Expansion</span>
                        <span className="font-mono text-purple-700">{sub.cmaScaleExpansion}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={50}
                        value={sub.cmaScaleExpansion}
                        onChange={e => handleSubWeightChange('cmaScaleExpansion', parseInt(e.target.value))}
                        className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-500">
                        <strong>Logic:</strong> Comparing current P&L and Company Size to open req ($500M+ revenue jump).
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Profile Match</span>
                        <span className="font-mono text-purple-700">{sub.cmaProfileMatch}%</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={40}
                        value={sub.cmaProfileMatch}
                        onChange={e => handleSubWeightChange('cmaProfileMatch', parseInt(e.target.value))}
                        className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-500">
                        <strong>Logic:</strong> Matching career experience data, tech stack, and sector track record to req.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Geo / Lifestyle</span>
                        <span className="font-mono text-purple-700">{sub.cmaGeoLifestyle}%</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={30}
                        value={sub.cmaGeoLifestyle}
                        onChange={e => handleSubWeightChange('cmaGeoLifestyle', parseInt(e.target.value))}
                        className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-500">
                        <strong>Logic:</strong> Matching location, work model (hybrid/on-site), and relocation willingness to open req.
                      </p>
                    </div>

                  </div>
                </div>

                {/* 2. PTM SUB-WEIGHTS */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                        PTM (Propensity to Move) Sub-Weights & Logic
                      </h4>
                      <p className="text-xs text-slate-500">Overall Category Weight: {draftAura.emiWeights.ptm}%</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
                      Sub-total: {sub.ptmOrgInstability + sub.ptmEquityVestingCliffs + sub.ptmBlockedNumberTwo + sub.ptmTenureStagnation}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Organizational Instability</span>
                        <span className="font-mono text-indigo-700">{sub.ptmOrgInstability}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={60}
                        value={sub.ptmOrgInstability}
                        onChange={e => handleSubWeightChange('ptmOrgInstability', parseInt(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-500">
                        <strong>Logic:</strong> Looking at company stock drops, leadership departures, news events, transformation.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Equity Vesting Cliffs</span>
                        <span className="font-mono text-indigo-700">{sub.ptmEquityVestingCliffs}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={50}
                        value={sub.ptmEquityVestingCliffs}
                        onChange={e => handleSubWeightChange('ptmEquityVestingCliffs', parseInt(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-500">
                        <strong>Logic:</strong> Calculates distance to 36-mo and 48-mo marks (standard 4-yr cliff). Scores spike 60 days prior.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>"Blocked #2" Status</span>
                        <span className="font-mono text-indigo-700">{sub.ptmBlockedNumberTwo}%</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={40}
                        value={sub.ptmBlockedNumberTwo}
                        onChange={e => handleSubWeightChange('ptmBlockedNumberTwo', parseInt(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-500">
                        <strong>Logic:</strong> If candidate is VP, and the SVP above them has a start date &lt; 2 yrs ago, candidate is flagged as structurally blocked.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Tenure Stagnation</span>
                        <span className="font-mono text-indigo-700">{sub.ptmTenureStagnation}%</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={30}
                        value={sub.ptmTenureStagnation}
                        onChange={e => handleSubWeightChange('ptmTenureStagnation', parseInt(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-500">
                        <strong>Logic:</strong> Scores scale linearly as this integer surpasses 48 months (4 years) without a title promotion.
                      </p>
                    </div>

                  </div>
                </div>

                {/* 3. SFA SUB-WEIGHTS */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        SFA (Structural Fit) Sub-Weights & Logic
                      </h4>
                      <p className="text-xs text-slate-500">Overall Category Weight: {draftAura.emiWeights.sfa}%</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                      Sub-total: {sub.sfaCompensationParity + sub.sfaOperationalScope + sub.sfaOffLimitsLegal + sub.sfaNoticePeriod}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Compensation Parity</span>
                        <span className="font-mono text-blue-700">{sub.sfaCompensationParity}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={60}
                        value={sub.sfaCompensationParity}
                        onChange={e => handleSubWeightChange('sfaCompensationParity', parseInt(e.target.value))}
                        className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-500">
                        <strong>Logic:</strong> If candidate estimated comp &gt; requisition max budget by &gt;15%, SFA drops drastically.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Operational Scope Match</span>
                        <span className="font-mono text-blue-700">{sub.sfaOperationalScope}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={50}
                        value={sub.sfaOperationalScope}
                        onChange={e => handleSubWeightChange('sfaOperationalScope', parseInt(e.target.value))}
                        className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-500">
                        <strong>Logic:</strong> Keyword, technical entity, and organizational overlap percentage against req mandate.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Off-Limits & Legal Constraints</span>
                        <span className="font-mono text-blue-700">{sub.sfaOffLimitsLegal}%</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={40}
                        value={sub.sfaOffLimitsLegal}
                        onChange={e => handleSubWeightChange('sfaOffLimitsLegal', parseInt(e.target.value))}
                        className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-500">
                        <strong>Logic:</strong> Do Not Poach agreements, non-compete, garden leave (kill switch if company is off-limits).
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Notice Period</span>
                        <span className="font-mono text-blue-700">{sub.sfaNoticePeriod}%</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={30}
                        value={sub.sfaNoticePeriod}
                        onChange={e => handleSubWeightChange('sfaNoticePeriod', parseInt(e.target.value))}
                        className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-500">
                        <strong>Logic:</strong> Comparing notice period / contractual release with req target start date.
                      </p>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: EXECUTIVE WARMING & NURTURING */}
          {currentAgent === 'aura' && activeTab === 'warming' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Automated Executive Warming Campaigns</h3>
                    <p className="text-xs text-slate-500">
                      Discreet thought-leadership distribution to build goodwill without pushy headhunt inquiries.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftAura.nurturing.warmingCampaignsActive}
                      onChange={e => setDraftAura(prev => ({
                        ...prev,
                        nurturing: { ...prev.nurturing, warmingCampaignsActive: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Warming Touchpoint Cadence</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={7}
                        max={60}
                        value={draftAura.nurturing.cadenceDays}
                        onChange={e => setDraftAura(prev => ({
                          ...prev,
                          nurturing: { ...prev.nurturing, cadenceDays: parseInt(e.target.value) || 14 }
                        }))}
                        className="w-24 p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center font-bold"
                      />
                      <span className="text-slate-500">days between research briefing touches</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Quarterly Touchpoint Cap</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={6}
                        value={draftAura.nurturing.touchpointCapQuarterly}
                        onChange={e => setDraftAura(prev => ({
                          ...prev,
                          nurturing: { ...prev.nurturing, touchpointCapQuarterly: parseInt(e.target.value) || 3 }
                        }))}
                        className="w-24 p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center font-bold"
                      />
                      <span className="text-slate-500">max touches / quarter per executive</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategy Tiers Breakdown */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">EMI Nurture Posture Tiers</h3>
                
                <div className="p-3 bg-purple-50/60 rounded-lg border border-purple-100 space-y-1">
                  <div className="flex items-center justify-between font-bold text-purple-950">
                    <span>High EMI Tier (80 - 100)</span>
                    <span className="text-[11px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Stealth Peer Mode</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Candidate exhibits impending mobility. Agent monitors publications and delivers discreet thought leadership to maintain top-of-mind prestige without pushing interview requests.
                  </p>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 space-y-1">
                  <div className="flex items-center justify-between font-bold text-blue-950">
                    <span>Moderate EMI Tier (50 - 79)</span>
                    <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Strategic Briefing Mode</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Candidate stable but receptive. Agent delivers quarterly industry landscape reports and invites to exclusive peer advisory roundtables.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Low EMI Tier (&lt; 50)</span>
                    <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded">VIP Preservation Mode</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Deeply anchored executive. Agent preserves institutional relationship via annual milestone greetings and long-term ecosystem intelligence.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: RESEARCH & ORG CHART SYNC */}
          {currentAgent === 'aura' && activeTab === 'research' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Talent Research & Org Chart Cadence</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Market Map Sync Cadence</label>
                    <select
                      value={draftAura.research.syncCadence}
                      onChange={e => setDraftAura(prev => ({
                        ...prev,
                        research: { ...prev.research, syncCadence: e.target.value as any }
                      }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800"
                    >
                      <option value="realtime">Real-Time (Event Driven / SEC Filings)</option>
                      <option value="daily">Daily Batch Sync (Phenom Recommended)</option>
                      <option value="weekly">Weekly Rollup Sync</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Auto-Pipeline Minimum EMI Gate</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={50}
                        max={95}
                        value={draftAura.research.minEmiToPipeline}
                        onChange={e => setDraftAura(prev => ({
                          ...prev,
                          research: { ...prev.research, minEmiToPipeline: parseInt(e.target.value) || 75 }
                        }))}
                        className="w-24 p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center font-bold"
                      />
                      <span className="text-slate-500">score required to auto-stage in pipeline</span>
                    </div>
                  </div>
                </div>

                {/* Excluded Titles */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <label className="font-semibold text-slate-700">Excluded Title Keywords</label>
                  <div className="flex flex-wrap gap-2">
                    {draftAura.research.excludedTitleKeywords.map(kw => (
                      <span key={kw} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium flex items-center gap-1.5">
                        {kw}
                        <button onClick={() => removeExcludedTitle(kw)} className="text-slate-400 hover:text-red-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 max-w-sm pt-1">
                    <input
                      type="text"
                      placeholder="Add keyword (e.g. Interim, Advisory)..."
                      value={newExcludedTitle}
                      onChange={e => setNewExcludedTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addExcludedTitle()}
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                    <button
                      onClick={addExcludedTitle}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* PRIME AGENT TABS (Executive Search Project Agent - High Level) */}
          {/* ========================================================================= */}

          {/* TAB 1: SEARCH PROJECT VOICE & RULES (High-level, not tied to Sarah Sandberg) */}
          {currentAgent === 'prime' && activeTab === 'project-voice' && (
            <div className="space-y-6">
              
              {/* Archetype Selector Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Global Search Project Persona Archetypes</h3>
                    <p className="text-xs text-slate-500">
                      Select an archetype to customize its tone, length, prompt instructions, and guardrails, or create custom archetypes.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsCreatingArchetype(prev => !prev)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    {isCreatingArchetype ? 'Close Builder' : 'Create New Archetype'}
                  </button>
                </div>

                {/* Inline Creation Form */}
                {isCreatingArchetype && (
                  <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-200 space-y-4 animate-in fade-in duration-200 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-200/60">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-slate-900">Define New Search Voice Archetype</span>
                      </div>
                      <span className="text-[11px] text-blue-700 font-medium">Custom Persona</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700">Archetype Title <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          placeholder="e.g. Venture Capital Growth Partner..."
                          value={newArchTitle}
                          onChange={e => setNewArchTitle(e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700">Confidentiality Protocol</label>
                        <select
                          value={newArchProtocol}
                          onChange={e => setNewArchProtocol(e.target.value as any)}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 text-xs"
                        >
                          <option value="Strictly Confidential Blind Teaser">Strictly Confidential Blind Teaser (Anonymized)</option>
                          <option value="Named Enterprise Search">Named Enterprise Search (Disclose Client Upfront)</option>
                          <option value="Board-Authorized Retained Mandate">Board-Authorized Retained Mandate (Governance Level)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700">Description / Mandate Scope</label>
                      <input
                        type="text"
                        placeholder="e.g. High-velocity narrative tailored for Series B/C executive scaling and equity upside."
                        value={newArchDesc}
                        onChange={e => setNewArchDesc(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between font-semibold text-slate-700">
                          <span>Formality</span>
                          <span className="font-mono text-blue-700 font-bold">{newArchFormality}/5</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={newArchFormality}
                          onChange={e => setNewArchFormality(parseInt(e.target.value))}
                          className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-semibold text-slate-700">
                          <span>Directness</span>
                          <span className="font-mono text-blue-700 font-bold">{newArchDirectness}/5</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={newArchDirectness}
                          onChange={e => setNewArchDirectness(parseInt(e.target.value))}
                          className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-semibold text-slate-700">
                          <span>Word Count</span>
                          <span className="font-mono text-blue-700 font-bold">{newArchWordCount} words</span>
                        </div>
                        <input
                          type="number"
                          min={80}
                          max={260}
                          value={newArchWordCount}
                          onChange={e => setNewArchWordCount(parseInt(e.target.value) || 135)}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-center font-mono font-bold text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700">Custom Agent Instructions for this Archetype</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Approach with entrepreneurial vigor, referencing technology scaling challenges and venture milestones..."
                        value={newArchInstructions}
                        onChange={e => setNewArchInstructions(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingArchetype(false)}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={!newArchTitle.trim()}
                        onClick={handleCreateArchetypeSubmit}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold text-xs shadow-xs"
                      >
                        Save & Select Archetype
                      </button>
                    </div>
                  </div>
                )}

                {/* Archetypes List Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {activeArchetypesList.map(arch => {
                    const isSelected = activeArchetypeId === arch.id;
                    return (
                      <div
                        key={arch.id}
                        onClick={() => handleSelectArchetype(arch.id)}
                        className={cn(
                          "p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 relative group",
                          isSelected 
                            ? "border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-600/30" 
                            : "border-slate-200 bg-white hover:border-slate-300"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{arch.title}</span>
                              {arch.isCustom ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                                  Custom
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{arch.description}</p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {arch.isCustom && (
                              <button
                                title="Delete custom archetype"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Delete custom archetype "${arch.title}"?`)) {
                                    handleDeleteArchetype(arch.id);
                                  }
                                }}
                                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quick attributes pills */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-slate-600">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                            Formality: {arch.toneFormality}/5
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                            Directness: {arch.toneDirectness}/5
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-medium font-mono">
                            ~{arch.targetWordCount} words
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Archetype Deep Customization Studio */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Customizing Voice for: <span className="text-blue-700">{activeArchetype?.title}</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Adjust tone sliders, word length, prompt instructions, and confidentiality protocol specific to this archetype.
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full self-start sm:self-auto border border-blue-100">
                    Live Active Archetype
                  </span>
                </div>

                {/* 1. Tone Formality & Directness for this Archetype */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1 text-xs">
                  <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>Tone Formality</span>
                      <span className="font-mono font-bold text-blue-700">{activeArchetype?.toneFormality || 4}/5</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={activeArchetype?.toneFormality || 4}
                      onChange={e => updateActiveArchetype({ toneFormality: parseInt(e.target.value) })}
                      className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Casual & Conversational (1)</span>
                      <span>Boardroom Gravitas (5)</span>
                    </div>
                  </div>

                  <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>Tone Directness</span>
                      <span className="font-mono font-bold text-blue-700">{activeArchetype?.toneDirectness || 3}/5</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={activeArchetype?.toneDirectness || 3}
                      onChange={e => updateActiveArchetype({ toneDirectness: parseInt(e.target.value) })}
                      className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Discreet Inquiry (1)</span>
                      <span>Direct Retained Mandate (5)</span>
                    </div>
                  </div>
                </div>

                {/* 2. Message Length Presets & Target Word Count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-semibold text-slate-700">Message Length Guardrail</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Concise', words: 95, desc: '~95 words' },
                        { label: 'Standard', words: 135, desc: '~135 words' },
                        { label: 'Detailed', words: 180, desc: '~180 words' },
                      ].map(preset => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => updateActiveArchetype({ targetWordCount: preset.words })}
                          className={cn(
                            "py-2 px-2 rounded-lg border text-center font-semibold transition-all",
                            activeArchetype?.targetWordCount === preset.words
                              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          <div>{preset.label}</div>
                          <div className="text-[10px] opacity-75 font-normal">{preset.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-slate-700">Specific Word Count Target</label>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="number"
                        min={70}
                        max={300}
                        value={activeArchetype?.targetWordCount || 135}
                        onChange={e => updateActiveArchetype({ targetWordCount: parseInt(e.target.value) || 135 })}
                        className="w-28 p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center font-bold text-sm"
                      />
                      <span className="text-slate-500 text-xs">words per executive communication</span>
                    </div>
                  </div>
                </div>

                {/* 3. Confidentiality Protocol & Signature */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Mandate Confidentiality Protocol</label>
                    <select
                      value={activeArchetype?.confidentialityProtocol || 'Strictly Confidential Blind Teaser'}
                      onChange={e => updateActiveArchetype({ confidentialityProtocol: e.target.value as any })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 text-xs"
                    >
                      <option value="Strictly Confidential Blind Teaser">Strictly Confidential Blind Teaser (Anonymized)</option>
                      <option value="Named Enterprise Search">Named Enterprise Search (Disclose Client Upfront)</option>
                      <option value="Board-Authorized Retained Mandate">Board-Authorized Retained Mandate (Governance Level)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Recruiter Signature Format</label>
                    <input
                      type="text"
                      value={activeArchetype?.signatureFormat || 'Managing Director, Executive Search Practice'}
                      onChange={e => updateActiveArchetype({ signatureFormat: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 text-xs"
                    />
                  </div>
                </div>

                {/* 4. Instructions Specific to this Archetype */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="font-semibold text-slate-700 flex items-center justify-between">
                    <span>Prompt Instructions for "{activeArchetype?.title}"</span>
                    <span className="text-[11px] text-slate-400 font-normal">Directly guides Prime Agent's generation tone</span>
                  </label>
                  <textarea
                    rows={3}
                    value={activeArchetype?.customInstructions || ''}
                    onChange={e => updateActiveArchetype({ customInstructions: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed font-sans"
                    placeholder="Enter explicit voice directives, framing guidelines, or narrative constraints for this archetype..."
                  />
                </div>

                {/* 5. Prohibited Language & Banned Clichés */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="font-semibold text-slate-700">
                    Prohibited Phrases for this Archetype ({activeArchetype?.prohibitedPhrases?.length || 0})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(activeArchetype?.prohibitedPhrases || []).map(p => (
                      <span key={p} className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-medium flex items-center gap-1.5 border border-red-200 text-xs">
                        {p}
                        <button 
                          onClick={() => removeProhibitedPhrase(p)} 
                          className="text-red-400 hover:text-red-700 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 max-w-sm pt-1">
                    <input
                      type="text"
                      placeholder="Add banned phrase (e.g. rockstar)..."
                      value={newProhibitedWord}
                      onChange={e => setNewProhibitedWord(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addProhibitedPhrase()}
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                    <button
                      onClick={addProhibitedPhrase}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Live Preview Box for Selected Archetype */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 text-blue-700">
                      <Sparkles className="w-3.5 h-3.5" /> Live Archetype Preview ({activeArchetype?.title})
                    </span>
                    <span className="text-slate-400 font-mono">Target: ~{activeArchetype?.targetWordCount} words</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 text-xs italic space-y-1 leading-relaxed">
                    <p>
                      {activeArchetype?.confidentialityProtocol === 'Board-Authorized Retained Mandate'
                        ? 'Subject: Privileged & Confidential // Retained Mandate Briefing: VP Engineering'
                        : activeArchetype?.confidentialityProtocol === 'Named Enterprise Search'
                        ? 'Subject: Retained Search Mandate // Enterprise Systems Corp Leadership Appointment'
                        : 'Subject: Private Briefing // Confidential Executive Search Mandate'}
                    </p>
                    <p className="not-italic text-slate-800 text-[11px]">
                      "Dear [Executive Name], our search practice has been retained to conduct a discreet mandate. {activeArchetype?.customInstructions?.slice(0, 140)}... We welcome an exploratory dialogue."
                    </p>
                    <div className="not-italic text-[11px] text-slate-500 pt-1 font-medium">
                      — {activeArchetype?.signatureFormat}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CANDIDATE CALIBRATION & SLAS */}
          {currentAgent === 'prime' && activeTab === 'project-calibration' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Project Calibration Rules & Velocity SLAs</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Minimum Fit Calibration Score</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={65}
                        max={95}
                        value={draftPrime.projectRules?.minCalibrationScore || 80}
                        onChange={e => setDraftPrime(prev => ({
                          ...prev,
                          projectRules: { ...prev.projectRules, minCalibrationScore: parseInt(e.target.value) || 80 }
                        }))}
                        className="w-24 p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center font-bold"
                      />
                      <span className="text-slate-500">% match required for longlist placement</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Target Days to First Slate (SLA)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={5}
                        max={30}
                        value={draftPrime.projectRules?.targetDaysToFirstSlate || 14}
                        onChange={e => setDraftPrime(prev => ({
                          ...prev,
                          projectRules: { ...prev.projectRules, targetDaysToFirstSlate: parseInt(e.target.value) || 14 }
                        }))}
                        className="w-24 p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center font-bold"
                      />
                      <span className="text-slate-500">days SLA to deliver calibrated slate</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Auto-Add Calibrated Candidates to Project Longlist</span>
                    <span className="text-slate-500 text-[11px]">When candidate meets or exceeds the calibration score threshold</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={draftPrime.projectRules?.autoAddToProjectLonglist ?? true}
                    onChange={e => setDraftPrime(prev => ({
                      ...prev,
                      projectRules: { ...prev.projectRules, autoAddToProjectLonglist: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLIENT OFF-LIMITS & GATES */}
          {currentAgent === 'prime' && activeTab === 'project-governance' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Search Project Governance & Off-Limits</h3>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-700" />
                    Restricted Companies ("Do Not Contact" / Hands-Off Agreements)
                  </div>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    Prime Agent automatically validates candidate current company against your firm's Restricted Clients list. Sourcing, outreach drafting, and contact dispatch are strictly suppressed for restricted clients.
                  </p>
                  <label className="flex items-center gap-2 pt-1 font-semibold text-emerald-900">
                    <input
                      type="checkbox"
                      checked={draftPrime.projectRules?.enforceRestrictedCompanies ?? true}
                      onChange={e => setDraftPrime(prev => ({
                        ...prev,
                        projectRules: { ...prev.projectRules, enforceRestrictedCompanies: e.target.checked }
                      }))}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    Strictly enforce across all active executive search projects
                  </label>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-700" />
                    Partner Sign-Off for C-Suite Candidates
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Require lead recruiter or search partner manual review before any autonomous outreach sequence is dispatched to C-level executives (CEO, CFO, CTO, CMO, CPO).
                  </p>
                  <label className="flex items-center gap-2 pt-1 font-semibold text-amber-900">
                    <input
                      type="checkbox"
                      checked={draftPrime.projectRules?.requirePartnerSignOffForCSuite ?? true}
                      onChange={e => setDraftPrime(prev => ({
                        ...prev,
                        projectRules: { ...prev.projectRules, requirePartnerSignOffForCSuite: e.target.checked }
                      }))}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    Enable mandatory partner review gate
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <button
            onClick={resetToDefaults}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Recommended Baselines
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={closeConfigModal}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={weightsSum !== 100 && currentAgent === 'aura'}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all",
                weightsSum !== 100 && currentAgent === 'aura'
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : savedFeedback
                  ? "bg-emerald-600 text-white"
                  : currentAgent === 'aura'
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              {savedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Changes Saved!
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Save Configuration
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
