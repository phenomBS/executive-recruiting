import React, { useState } from 'react';
import { Company } from '../types';
import { ArrowLeft, Building2, MapPin, Users, Globe, LineChart, Sparkles, Plus, Star, Map, X, Send, AlertTriangle } from 'lucide-react';
import { useRestricted } from '../context/RestrictedContext';
import { cn } from '../lib/utils';
import { CompanyOverviewTab } from './tabs/CompanyOverviewTab';
import { CompanyExecutiveTeamTab } from './tabs/CompanyExecutiveTeamTab';
import { CompanyOrganizationTab } from './tabs/CompanyOrganizationTab';
import { CompanyTalentTab } from './tabs/CompanyTalentTab';
import { CompanyMarketActivityTab } from './tabs/CompanyMarketActivityTab';
import { CompanyRelationshipsTab } from './tabs/CompanyRelationshipsTab';
import { CompanySearchesTab } from './tabs/CompanySearchesTab';
import { useRouter } from '../context/RouterContext';

interface CompanyDetailProps {
  company: Company;
  onBack: () => void;
}

type TabType = 'overview' | 'executive-team' | 'organization' | 'talent' | 'market-activity' | 'relationships' | 'searches';

export function CompanyDetail({ company, onBack }: CompanyDetailProps) {
  const router = useRouter();
  const validTabs: TabType[] = ['overview', 'executive-team', 'organization', 'talent', 'market-activity', 'relationships', 'searches'];
  const activeTab: TabType = (router.activeTab && validTabs.includes(router.activeTab as TabType))
    ? (router.activeTab as TabType)
    : 'overview';
  const setActiveTab = (tab: TabType) => {
    router.setTab(tab === 'overview' ? null : tab);
  };
  const { restrictedCompanies } = useRestricted();
  const restrictedInfo = restrictedCompanies.find(rc => rc.name === company.name);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: `Hi! I'm your Executive Talent AI. I've analyzed the intelligence workspace for ${company.name}. What would you like to know?` }
  ]);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'executive-team', label: 'Executive Team' },
    { id: 'organization', label: 'Organization' },
    { id: 'talent', label: 'Talent' },
    { id: 'market-activity', label: 'Market Activity' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'searches', label: 'Searches' },
  ];

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    
    const newUserMsg = { role: 'user', text: aiInput };
    setChatHistory(prev => [...prev, newUserMsg]);
    setAiInput('');
    
    // Simulate AI response based on the prompt examples
    setTimeout(() => {
      let aiResponse = "I've reviewed the intelligence for this company. ";
      
      const query = newUserMsg.text.toLowerCase();
      if (query.includes("who reports directly to the ceo")) {
        aiResponse = `At ${company.name}, Colette Kress (CFO), Debora Shoquist (EVP, Operations), and Timothy Teter (EVP, General Counsel) report directly to the CEO, Jensen Huang.`;
      } else if (query.includes("ready to move")) {
        aiResponse = "Based on our readiness scores, Colette Kress has a readiness score of 65. Debora Shoquist has a score of 40 and might need a stronger value proposition to move.";
      } else if (query.includes("already in my crm")) {
        aiResponse = `You currently have ${company.crmCandidatesCount} candidates from ${company.name} in your CRM.`;
      } else {
        aiResponse = "Based on the current talent snapshot, NVIDIA has 142 executives tracked, and we've mapped 38 as highly relevant for your active searches. The CFO role might be a good target given recent organizational changes.";
      }
      
      setChatHistory(prev => [...prev, { role: 'assistant', text: aiResponse }]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-(--bg-surface-base) overflow-y-auto w-full relative">
      <div className="bg-(--bg-default) border-b border-(--border-light) shrink-0 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="px-8 py-4">
            
            <button type="button" onClick={onBack} className="phx-crumb mb-4">
              <ArrowLeft aria-hidden="true" /> Back to Companies
            </button>
            
            {restrictedInfo && (
              <div className="phx-feedback mb-6" data-tone="error" role="alert">
                <strong>Restricted: Do not contact.</strong> This company is on the restricted list. Reason: {restrictedInfo.reason}
              </div>
            )}


            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-(--bg-neutral-soft) rounded-2xl border border-(--border-light) flex items-center justify-center shrink-0">
                  <Building2 className="w-10 h-10 text-(--color-secondary-200)" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-(--text-strong) mb-2">{company.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-(--text-default)">
                    <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-(--text-subtle)" aria-hidden="true"/> {company.industry}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-(--text-subtle)" aria-hidden="true"/> {company.headquarters}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-(--text-subtle)" aria-hidden="true"/> {company.size}</span>
                    <span className="flex items-center gap-1.5"><LineChart className="w-4 h-4 text-(--text-subtle)" aria-hidden="true"/> {company.revenue}</span>
                    <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-(--text-subtle)" aria-hidden="true"/> {company.website}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
                <button type="button" className="phx-btn" data-variant="secondary">
                  <Map className="w-4 h-4" aria-hidden="true" /> Add to Market Map
                </button>
                <button type="button" className="phx-btn" data-variant="secondary">
                  <Plus className="w-4 h-4" aria-hidden="true" /> Add to Search
                </button>
                <button type="button" className="phx-btn" data-variant="secondary">
                  <Star className="w-4 h-4" aria-hidden="true" /> Follow
                </button>
                <button type="button" className="phx-btn" data-variant="primary" onClick={() => setIsAiOpen(true)}>
                  <Sparkles className="w-4 h-4" aria-hidden="true" /> Ask AI
                </button>
              </div>
            </div>
          </div>

          <div role="tablist" aria-label="Company sections" className="px-8 gap-8 border-t border-(--border-faint)">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto h-full">
          {activeTab === 'overview' && <CompanyOverviewTab company={company} />}
          {activeTab === 'executive-team' && <CompanyExecutiveTeamTab company={company} />}
          {activeTab === 'organization' && <CompanyOrganizationTab company={company} />}
          {activeTab === 'talent' && <CompanyTalentTab company={company} />}
          {activeTab === 'market-activity' && <CompanyMarketActivityTab company={company} />}
          {activeTab === 'relationships' && <CompanyRelationshipsTab company={company} />}
          {activeTab === 'searches' && <CompanySearchesTab company={company} />}
        </div>
      </div>

      {/* AI Side Panel */}
      {isAiOpen && (
        <div className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col transform transition-transform">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold text-lg">Talent Intelligence AI</h2>
            </div>
            <button onClick={() => setIsAiOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-slate-50">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={cn(
                "p-4 rounded-xl max-w-[85%] text-sm leading-relaxed shadow-sm",
                msg.role === 'assistant' 
                  ? "bg-white border border-slate-200 text-slate-800 self-start rounded-tl-none" 
                  : "bg-blue-600 text-white self-end rounded-tr-none"
              )}>
                {msg.text}
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleAiSubmit} className="relative">
              <input 
                type="text" 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask about executives, relationships..."
                className="w-full pl-4 pr-12 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setAiInput('Who reports directly to the CEO?')} className="text-[11px] font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors border border-slate-200">Who reports to the CEO?</button>
              <button onClick={() => setAiInput('Which executives are likely to be ready to move?')} className="text-[11px] font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors border border-slate-200">Who is ready to move?</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

