import React, { createContext, useContext, useState } from 'react';
import { AuraAgentConfig, SearchAgentConfig, PrimeAgentConfig, AgentTelemetryItem, SearchVoiceArchetype } from '../types';

export const DEFAULT_ARCHETYPES: SearchVoiceArchetype[] = [
  {
    id: 'executive-search-partner',
    title: 'Executive Search Partner',
    description: 'Direct, peer-level authority; frames mandates around corporate strategy, scale, and board governance.',
    isCustom: false,
    toneFormality: 4,
    toneDirectness: 3,
    confidentialityProtocol: 'Strictly Confidential Blind Teaser',
    targetWordCount: 135,
    customInstructions: 'Represent the executive search project with peer-level gravitas, discreet institutional authority, and clear value proposition. Never use transactional recruiting slogans.',
    prohibitedPhrases: [
      'exciting opportunity',
      'rockstar',
      'quick chat',
      'jump on a call',
      'resume',
      'hiring manager',
      'urgent opening',
      'need someone yesterday',
    ],
    signatureFormat: 'Managing Director, Executive Search Practice',
  },
  {
    id: 'managing-director-retained',
    title: 'Managing Director / Retained Search',
    description: 'Institutional gravitas; board-level representation with discreet positioning and fiduciary focus.',
    isCustom: false,
    toneFormality: 5,
    toneDirectness: 4,
    confidentialityProtocol: 'Board-Authorized Retained Mandate',
    targetWordCount: 150,
    customInstructions: 'Speak with supreme institutional gravitas on behalf of the Nominating & Governance Committee. Focus on enterprise trajectory, fiduciary leadership, and high-impact mandate milestones.',
    prohibitedPhrases: ['rockstar', 'great gig', 'ping me', 'resume', 'synergy', 'urgent opening'],
    signatureFormat: 'Senior Partner & Managing Director, Global Retained Practice',
  },
  {
    id: 'discreet-trusted-advisor',
    title: 'Discreet Trusted Advisor',
    description: 'Consultative tone focusing on career horizons, capital backing, and confidentiality.',
    isCustom: false,
    toneFormality: 3,
    toneDirectness: 2,
    confidentialityProtocol: 'Strictly Confidential Blind Teaser',
    targetWordCount: 120,
    customInstructions: 'Position as a seasoned executive career advisor. Inquire gently about their current long-term horizon and willingness to evaluate off-market leadership opportunities.',
    prohibitedPhrases: ['hiring manager', 'job opening', 'apply here', 'urgent need', 'competitive package'],
    signatureFormat: 'Executive Advisor, Leadership Advisory Practice',
  },
  {
    id: 'csuite-peer-partner',
    title: 'C-Suite Peer Partner',
    description: 'Conversational executive tone referencing specific market developments and technology milestones.',
    isCustom: false,
    toneFormality: 4,
    toneDirectness: 4,
    confidentialityProtocol: 'Named Enterprise Search',
    targetWordCount: 140,
    customInstructions: 'Communicate as an industry peer with deep domain fluency. Reference recent macro industry shifts, distributed technology architecture scale, and competitive landscape.',
    prohibitedPhrases: ['recruiting for', 'staffing', 'reach out on LinkedIn', 'rockstar', 'ninja'],
    signatureFormat: 'Practice Lead & Executive Partner',
  },
];

export const DEFAULT_AURA_CONFIG: AuraAgentConfig = {
  status: 'active',
  emiWeights: {
    cma: 40,
    ptm: 35,
    sfa: 25,
    subWeights: {
      // CMA (Motivation Alignment) 40%
      cmaStepUpDelta: 40, // Comparing current title to open req
      cmaScaleExpansion: 30, // Comparing current P&L and Company Size to open req
      cmaProfileMatch: 20, // Matching experience data to open req
      cmaGeoLifestyle: 10, // Matching location, work model, relocation willingness to open req

      // PTM (Propensity to Move) 35%
      ptmOrgInstability: 40, // Looking at company stock changes, news events, transformation
      ptmEquityVestingCliffs: 30, // Distance to 36-mo & 48-mo marks (spike 60d prior)
      ptmBlockedNumberTwo: 20, // VP where SVP start date < 2 years ago structurally blocked
      ptmTenureStagnation: 10, // Scores scale linearly as tenure surpasses 48 months

      // SFA (Structural Fit) 25%
      sfaCompensationParity: 40, // If candidate comp > req budget by >15%, drops drastically
      sfaOperationalScope: 35, // Keyword and entity overlap percentage
      sfaOffLimitsLegal: 15, // Do Not Poach, non-compete, garden leave (kill switch)
      sfaNoticePeriod: 10, // Notice period vs req target start date
    },
  },
  research: {
    syncCadence: 'daily',
    autoOrgChartMapping: true,
    orgChartDepthLevels: 3,
    autoEnrichment: true,
    minRoleTenureMonths: 18,
    excludedTitleKeywords: ['Interim', 'Acting', 'Consultant', 'Advisor', 'Contract'],
    minEmiToPipeline: 75,
    maxAutoAddPerMap: 25,
  },
  nurturing: {
    warmingCampaignsActive: true,
    cadenceDays: 14,
    touchpointCapQuarterly: 3,
    cooldownDays: 21,
    emiTiers: {
      high: { min: 80, strategy: 'Direct thought-leadership commentary & board briefings' },
      moderate: { min: 60, strategy: 'Macro-industry trend reports & periodic quarterly pulse' },
      low: { min: 0, strategy: 'Passive monitoring only (no automated outreach touches)' },
    },
  },
  // Convenience aliases
  minEmiToPipeline: 75,
  minRoleTenureMonths: 18,
  autoEnrichment: true,
  syncCadence: 'daily',
  maxAutoAddPerMap: 25,
  excludedTitleKeywords: ['Interim', 'Acting', 'Consultant', 'Advisor', 'Contract'],
};

export const DEFAULT_SEARCH_CONFIG: SearchAgentConfig = DEFAULT_AURA_CONFIG;

export const DEFAULT_PRIME_CONFIG: PrimeAgentConfig = {
  status: 'active',
  selectedArchetypeId: 'executive-search-partner',
  archetypes: DEFAULT_ARCHETYPES,
  // High-Level Search Project Voice & Rules (not tied to any specific candidate)
  projectVoice: {
    archetype: DEFAULT_ARCHETYPES[0].title,
    toneFormality: DEFAULT_ARCHETYPES[0].toneFormality,
    toneDirectness: DEFAULT_ARCHETYPES[0].toneDirectness,
    confidentialityProtocol: DEFAULT_ARCHETYPES[0].confidentialityProtocol,
    targetWordCount: DEFAULT_ARCHETYPES[0].targetWordCount,
    customInstructions: DEFAULT_ARCHETYPES[0].customInstructions,
    prohibitedPhrases: [...DEFAULT_ARCHETYPES[0].prohibitedPhrases],
    signatureFormat: DEFAULT_ARCHETYPES[0].signatureFormat,
  },
  projectRules: {
    minCalibrationScore: 80, // Minimum % calibration to auto-longlist
    autoAddToProjectLonglist: true,
    requirePartnerSignOffForCSuite: true,
    targetDaysToFirstSlate: 14, // 14-day SLA target
    maxOutreachSequences: 3,
    cooldownDaysBetweenSequences: 21,
    enforceRestrictedCompanies: true,
    enforceGardenLeaveProtection: true,
  },
  // Legacy fields for backward compatibility
  useEmiScores: true,
  emiDecisionDegree: 85,
  triggerOnEmiJump: true,
  emiJumpThreshold: 15,
  brandVoice: {
    archetype: 'Formal Executive Search Partner',
    toneFormality: 4,
    toneDirectness: 3,
    customInstructions: 'Represent the executive search project with peer-level gravitas and discretion.',
    prohibitedPhrases: ['rockstar', 'quick chat', 'urgent opening'],
  },
  messaging: {
    lengthPreset: 'standard',
    targetWordCount: 135,
    channels: ['email', 'inmail'],
    signatureFormat: 'Managing Director, Executive Search Practice',
    includeMarketIntelSnippet: true,
  },
  guardrails: {
    maxTouchpointsPerQuarter: 3,
    cooldownDays: 21,
    maxNonResponseAttempts: 2,
    nonResponsePauseDays: 60,
    requireHumanSignOffForCSuite: true,
    highCompSignOffThreshold: '$2.0M+',
    enforceRestrictedCompanies: true,
  },
};

const INITIAL_TELEMETRY: AgentTelemetryItem[] = [
  {
    id: 'tel-1',
    timestamp: '5 mins ago',
    agentId: 'prime',
    type: 'discovery',
    title: 'Executive Search Book Generated',
    details: 'Prime Agent compiled and bound the 34-page calibrated Search Book for mandate "VP Engineering - AI Systems", indexing 14 shortlist profiles and market comp analyses.',
    targetCompany: 'Enterprise Systems Corp',
    severity: 'success',
  },
  {
    id: 'tel-2',
    timestamp: '12 mins ago',
    agentId: 'aura',
    type: 'discovery',
    title: 'Executive Market Map Created',
    details: 'Aura Agent created new market map "Tier-1 Autonomous Driving Systems VPs" covering 42 competitor firms and tracking 68 C-Suite/VP profiles.',
    targetCompany: 'Autonomous Mobility Map',
    severity: 'success',
  },
  {
    id: 'tel-3',
    timestamp: '24 mins ago',
    agentId: 'prime',
    type: 'guardrail_block',
    title: 'Project Off-Limits Enforcement',
    details: 'Auto-suppressed outreach to candidate from Meta for "VP Engineering - AI Systems". Reason: Client on Do Not Poach List (Active Retained Agreement).',
    targetCandidate: 'Sarah Sandberg',
    targetCompany: 'Meta',
    severity: 'blocked',
  },
  {
    id: 'tel-4',
    timestamp: '38 mins ago',
    agentId: 'aura',
    type: 'org_chart',
    title: 'Company Org Chart Created & Updated',
    details: 'Aura Agent synthesized quarterly leadership reorg data for NVIDIA, mapping 28 reporting hierarchy nodes across VP & SVP Engineering layers.',
    targetCompany: 'NVIDIA',
    severity: 'success',
  },
  {
    id: 'tel-5',
    timestamp: '52 mins ago',
    agentId: 'aura',
    type: 'nurture',
    title: 'Executive Warming Campaign Dispatched',
    details: 'Dispatched peer market briefing on enterprise semiconductor scaling to 14 Tier-1 Chief Technology Officers under Campaign "Silicon Tech Leaders 2026".',
    severity: 'success',
  },
  {
    id: 'tel-6',
    timestamp: '1 hour ago',
    agentId: 'aura',
    type: 'scoring',
    title: 'EMI Scoring Recalculation (CMA: 40%, PTM: 35%, SFA: 25%)',
    details: 'Recalculated Jensen Huang EMI from 90 -> 94 after stock transformation signals, 48-month tenure stagnation check, and +$15M P&L scale match.',
    targetCandidate: 'Jensen Huang',
    targetCompany: 'NVIDIA',
    severity: 'normal',
  },
  {
    id: 'tel-7',
    timestamp: '2 hours ago',
    agentId: 'prime',
    type: 'discovery',
    title: 'Calibrated Project Shortlist Formed',
    details: 'Prime Agent qualified 6 tier-1 candidates surpassing the 80% calibration threshold for Executive Search Project "Chief Revenue Officer - SaaS".',
    targetCompany: 'Global SaaS Leaders',
    severity: 'success',
  },
];

interface AgentConfigContextType {
  auraConfig: AuraAgentConfig;
  updateAuraConfig: (updates: Partial<AuraAgentConfig>) => void;
  searchConfig: AuraAgentConfig; // Alias
  updateSearchConfig: (updates: Partial<AuraAgentConfig>) => void; // Alias
  primeConfig: PrimeAgentConfig;
  updatePrimeConfig: (updates: Partial<PrimeAgentConfig>) => void;
  selectArchetype: (archetypeId: string) => void;
  updateArchetype: (archetypeId: string, updates: Partial<SearchVoiceArchetype>) => void;
  createArchetype: (newArch: Omit<SearchVoiceArchetype, 'id'>) => string;
  deleteArchetype: (archetypeId: string) => void;
  telemetry: AgentTelemetryItem[];
  addTelemetry: (item: Omit<AgentTelemetryItem, 'id' | 'timestamp'>) => void;
  activeAgentTab: 'all' | 'aura' | 'prime' | 'search';
  setActiveAgentTab: (tab: 'all' | 'aura' | 'prime' | 'search') => void;
  isConfigModalOpen: boolean;
  configModalAgent: 'aura' | 'prime' | 'search';
  openConfigModal: (agent: 'aura' | 'prime' | 'search') => void;
  closeConfigModal: () => void;
  resetToDefaults: () => void;
}

const AgentConfigContext = createContext<AgentConfigContextType | undefined>(undefined);

export function AgentConfigProvider({ children }: { children: React.ReactNode }) {
  const [auraConfig, setAuraConfig] = useState<AuraAgentConfig>(DEFAULT_AURA_CONFIG);
  const [primeConfig, setPrimeConfig] = useState<PrimeAgentConfig>(DEFAULT_PRIME_CONFIG);
  const [telemetry, setTelemetry] = useState<AgentTelemetryItem[]>(INITIAL_TELEMETRY);
  const [activeAgentTab, setActiveAgentTab] = useState<'all' | 'aura' | 'prime' | 'search'>('all');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configModalAgent, setConfigModalAgent] = useState<'aura' | 'prime' | 'search'>('aura');

  const updateAuraConfig = (updates: Partial<AuraAgentConfig>) => {
    setAuraConfig(prev => {
      const updated = { ...prev, ...updates };
      return updated;
    });
    addTelemetry({
      agentId: 'aura',
      type: 'config_change',
      title: 'Aura Agent EMI & Nurture Configuration Updated',
      details: 'Recruiter updated EMI scoring weights (CMA/PTM/SFA), research cadences, or warming rules.',
      severity: 'success',
    });
  };

  const updateSearchConfig = updateAuraConfig; // backward compatible alias

  const updatePrimeConfig = (updates: Partial<PrimeAgentConfig>) => {
    setPrimeConfig(prev => {
      const updated = { ...prev, ...updates };
      return updated;
    });
    addTelemetry({
      agentId: 'prime',
      type: 'config_change',
      title: 'Prime Agent Search Project Rules Updated',
      details: 'Recruiter adjusted high-level executive search voice, candidate calibration, or off-limits governance.',
      severity: 'success',
    });
  };

  const selectArchetype = (archetypeId: string) => {
    setPrimeConfig(prev => {
      const targetArch = (prev.archetypes || DEFAULT_ARCHETYPES).find(a => a.id === archetypeId);
      if (!targetArch) return prev;
      return {
        ...prev,
        selectedArchetypeId: archetypeId,
        projectVoice: {
          ...prev.projectVoice,
          archetype: targetArch.title,
          toneFormality: targetArch.toneFormality,
          toneDirectness: targetArch.toneDirectness,
          confidentialityProtocol: targetArch.confidentialityProtocol,
          targetWordCount: targetArch.targetWordCount,
          customInstructions: targetArch.customInstructions,
          prohibitedPhrases: [...targetArch.prohibitedPhrases],
          signatureFormat: targetArch.signatureFormat,
        },
      };
    });
  };

  const updateArchetype = (archetypeId: string, updates: Partial<SearchVoiceArchetype>) => {
    setPrimeConfig(prev => {
      const updatedList = (prev.archetypes || DEFAULT_ARCHETYPES).map(arch => {
        if (arch.id === archetypeId) {
          return { ...arch, ...updates };
        }
        return arch;
      });

      const activeArch = updatedList.find(a => a.id === (prev.selectedArchetypeId || archetypeId));
      return {
        ...prev,
        archetypes: updatedList,
        projectVoice: activeArch && activeArch.id === archetypeId
          ? {
              ...prev.projectVoice,
              archetype: activeArch.title,
              toneFormality: activeArch.toneFormality,
              toneDirectness: activeArch.toneDirectness,
              confidentialityProtocol: activeArch.confidentialityProtocol,
              targetWordCount: activeArch.targetWordCount,
              customInstructions: activeArch.customInstructions,
              prohibitedPhrases: [...activeArch.prohibitedPhrases],
              signatureFormat: activeArch.signatureFormat,
            }
          : prev.projectVoice,
      };
    });
  };

  const createArchetype = (newArch: Omit<SearchVoiceArchetype, 'id'>): string => {
    const newId = `custom-arch-${Date.now()}`;
    const completeArch: SearchVoiceArchetype = {
      ...newArch,
      id: newId,
      isCustom: true,
    };

    setPrimeConfig(prev => ({
      ...prev,
      selectedArchetypeId: newId,
      archetypes: [...(prev.archetypes || DEFAULT_ARCHETYPES), completeArch],
      projectVoice: {
        ...prev.projectVoice,
        archetype: completeArch.title,
        toneFormality: completeArch.toneFormality,
        toneDirectness: completeArch.toneDirectness,
        confidentialityProtocol: completeArch.confidentialityProtocol,
        targetWordCount: completeArch.targetWordCount,
        customInstructions: completeArch.customInstructions,
        prohibitedPhrases: [...completeArch.prohibitedPhrases],
        signatureFormat: completeArch.signatureFormat,
      },
    }));

    addTelemetry({
      agentId: 'prime',
      type: 'config_change',
      title: `New Search Voice Archetype Created: "${newArch.title}"`,
      details: `Created custom persona archetype with formality ${newArch.toneFormality}/5, directness ${newArch.toneDirectness}/5, and dedicated search teaser instructions.`,
      severity: 'success',
    });

    return newId;
  };

  const deleteArchetype = (archetypeId: string) => {
    setPrimeConfig(prev => {
      const filtered = (prev.archetypes || DEFAULT_ARCHETYPES).filter(a => a.id !== archetypeId);
      const nextSelected = prev.selectedArchetypeId === archetypeId
        ? filtered[0]?.id || 'executive-search-partner'
        : prev.selectedArchetypeId;
      const targetArch = filtered.find(a => a.id === nextSelected) || DEFAULT_ARCHETYPES[0];

      return {
        ...prev,
        selectedArchetypeId: nextSelected,
        archetypes: filtered,
        projectVoice: {
          ...prev.projectVoice,
          archetype: targetArch.title,
          toneFormality: targetArch.toneFormality,
          toneDirectness: targetArch.toneDirectness,
          confidentialityProtocol: targetArch.confidentialityProtocol,
          targetWordCount: targetArch.targetWordCount,
          customInstructions: targetArch.customInstructions,
          prohibitedPhrases: [...targetArch.prohibitedPhrases],
          signatureFormat: targetArch.signatureFormat,
        },
      };
    });

    addTelemetry({
      agentId: 'prime',
      type: 'config_change',
      title: 'Custom Archetype Removed',
      details: 'Custom search project archetype deleted and reverted to default executive search voice.',
      severity: 'normal',
    });
  };

  const addTelemetry = (item: Omit<AgentTelemetryItem, 'id' | 'timestamp'>) => {
    const newItem: AgentTelemetryItem = {
      ...item,
      id: `tel-${Date.now()}`,
      timestamp: 'Just now',
    };
    setTelemetry(prev => [newItem, ...prev.slice(0, 30)]);
  };

  const openConfigModal = (agent: 'aura' | 'prime' | 'search' = 'aura') => {
    setConfigModalAgent(agent === 'search' ? 'aura' : agent);
    setIsConfigModalOpen(true);
  };

  const closeConfigModal = () => {
    setIsConfigModalOpen(false);
  };

  const resetToDefaults = () => {
    setAuraConfig(DEFAULT_AURA_CONFIG);
    setPrimeConfig(DEFAULT_PRIME_CONFIG);
    addTelemetry({
      agentId: configModalAgent,
      type: 'config_change',
      title: 'Settings Reset to Phenom Recommended Baselines',
      details: 'Default Aura EMI logic, executive warming cadences, and Prime search project rules restored.',
      severity: 'normal',
    });
  };

  return (
    <AgentConfigContext.Provider
      value={{
        auraConfig,
        updateAuraConfig,
        searchConfig: auraConfig,
        updateSearchConfig,
        primeConfig,
        updatePrimeConfig,
        selectArchetype,
        updateArchetype,
        createArchetype,
        deleteArchetype,
        telemetry,
        addTelemetry,
        activeAgentTab,
        setActiveAgentTab,
        isConfigModalOpen,
        configModalAgent,
        openConfigModal,
        closeConfigModal,
        resetToDefaults,
      }}
    >
      {children}
    </AgentConfigContext.Provider>
  );
}

export function useAgentConfig() {
  const context = useContext(AgentConfigContext);
  if (!context) {
    throw new Error('useAgentConfig must be used within an AgentConfigProvider');
  }
  return context;
}
