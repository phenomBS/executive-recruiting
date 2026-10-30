import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Search, ChevronDown, Monitor, Smartphone, MessageSquare, Bot, FileText, Clock, Mail, UserCheck, Play, GitBranch, Megaphone, LayoutTemplate, Newspaper, Eye } from 'lucide-react';
import { cn } from '../lib/utils';
import { Candidate } from '../types';

interface AgentConfigurationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate;
}

export function AgentConfigurationModal({ isOpen, onOpenChange, candidate }: AgentConfigurationModalProps) {
  const [currentView, setCurrentView] = useState<'workflow' | 'campaigns' | 'templates' | 'builder'>('workflow');

  const renderWorkflowView = () => (
    <div className="flex flex-col h-full bg-(--bg-surface-base) overflow-y-auto">
      <div className="h-[72px] border-b border-slate-200 bg-white flex items-center px-8 flex-shrink-0 justify-between">
        <h1 className="text-xl font-bold text-slate-800">Agent Nurturing Strategy</h1>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors">Edit Workflow</button>
          <button className="bg-(--bg-brand-primary-default) text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-(--bg-brand-primary-hover) shadow-sm transition-colors"><Play className="w-4 h-4"/> Activate Strategy</button>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 w-full shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Bot className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider border border-blue-500/30">Strategy Assigned</span>
              <h2 className="text-xl font-bold text-white">Keep Warm <span className="text-slate-400 font-medium">(EMI Tier: n/a)</span></h2>
            </div>
            <div className="text-slate-300 text-sm leading-relaxed max-w-2xl">
              <span className="font-semibold text-slate-200">Reasoning:</span> Current mobility signals indicate active pursuit is premature. The agent will monitor for relevant publications referencing the executive or their company, automatically crafting thoughtful analysis to maintain a warm relationship without pushing for a formal interview.
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center py-4 relative">
          
          {/* Box 1 */}
          <div className="bg-white border-2 border-(--color-secondary-200) rounded-xl p-5 shadow-sm w-[460px] relative z-10 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg text-(--color-secondary-200)"><Newspaper className="w-5 h-5" /></div>
              <h3 className="font-bold text-slate-800 text-base">Trigger: Publication Discovered</h3>
            </div>
            <p className="text-sm text-slate-600 ml-[44px] leading-relaxed">Agent detects a new publication, press release, or news article referencing the executive or their company.</p>
          </div>
          
          <div className="w-px h-10 bg-blue-300 relative z-0"></div>
          
          {/* Box 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm w-[460px] relative z-10 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700"><FileText className="w-5 h-5" /></div>
              <h3 className="font-bold text-slate-800 text-base">Action: Analyze & Draft Commentary</h3>
            </div>
            <p className="text-sm text-slate-600 ml-[44px] leading-relaxed">Agent automatically researches the publication and crafts highly personalized, thoughtful commentary.</p>
          </div>

          <div className="w-px h-10 bg-slate-300 relative z-0"></div>

          {/* Box 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm w-[460px] relative z-10 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-amber-100 p-2 rounded-lg text-amber-700"><Clock className="w-5 h-5" /></div>
              <h3 className="font-bold text-slate-800 text-base">Wait: Recruiter Review (1 Day)</h3>
            </div>
            <p className="text-sm text-slate-600 ml-[44px] leading-relaxed">Hold draft for 24 hours to allow recruiter review, ensuring commentary aligns perfectly with firm brand voice.</p>
          </div>

          <div className="w-px h-10 bg-slate-300 relative z-0"></div>

          {/* Box 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm w-[460px] relative z-10 flex items-center justify-between transition-transform hover:-translate-y-0.5">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <div className="bg-blue-100 p-2 rounded-lg text-(--color-secondary-200)"><Mail className="w-5 h-5" /></div>
                <h3 className="font-bold text-slate-800 text-base">Send: Acknowledgment</h3>
              </div>
              <p className="text-sm text-slate-600 ml-[44px]">Dispatch the personalized commentary email.</p>
            </div>
            <button onClick={() => setCurrentView('builder')} className="text-sm text-(--color-secondary-200) font-semibold hover:bg-blue-100 px-4 py-2 bg-blue-50 rounded-lg transition-colors border border-blue-100 shadow-sm">View Template</button>
          </div>

          <div className="w-px h-10 bg-slate-300 relative z-0"></div>

          {/* Branching Logic */}
          <div className="flex justify-center w-full relative">
              <div className="absolute top-0 w-[420px] h-px bg-slate-300"></div>
              
              {/* Branch Left */}
              <div className="flex flex-col items-center w-[300px] -mt-px relative pr-12">
                <div className="w-px h-12 bg-slate-300 absolute right-[162px] top-0"></div>
                <div className="mt-12 bg-white border border-slate-200 rounded-xl p-5 shadow-sm w-full relative z-10 transition-transform hover:-translate-y-0.5">
                  <h4 className="font-bold text-slate-800 mb-1.5 text-center">If: No Reply</h4>
                  <p className="text-xs text-slate-500 text-center mb-4 leading-relaxed">Agent logs the interaction and resumes passive monitoring.</p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-2 justify-center shadow-sm">
                    <Eye className="w-4 h-4 text-slate-500" /> Monitor Mode
                  </div>
                </div>
              </div>

              {/* Branch Right */}
              <div className="flex flex-col items-center w-[300px] -mt-px relative pl-12">
                <div className="w-px h-12 bg-slate-300 absolute left-[162px] top-0"></div>
                <div className="mt-12 bg-white border border-slate-200 rounded-xl p-5 shadow-sm w-full relative z-10 transition-transform hover:-translate-y-0.5">
                  <h4 className="font-bold text-slate-800 mb-1.5 text-center">If: Reply Received</h4>
                  <p className="text-xs text-slate-500 text-center mb-4 leading-relaxed">Agent pauses workflow and hands off.</p>
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-xs font-semibold text-emerald-800 flex items-center gap-2 justify-center shadow-sm">
                    <UserCheck className="w-4 h-4 text-emerald-600" /> Notify Recruiter
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCampaignsView = () => (
    <div className="flex flex-col h-full bg-(--bg-surface-base) overflow-y-auto">
      <div className="bg-white border-b border-slate-200">
        <div className="h-[72px] flex items-center px-8 pb-0 pt-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Campaigns</h2>
        </div>
        <div className="flex items-center gap-8 px-8">
          <button className="text-(--color-secondary-200) border-b-2 border-(--color-secondary-200) py-3 text-sm font-semibold">Email Campaigns</button>
          <button className="text-slate-600 py-3 text-sm font-medium hover:text-slate-900 transition-colors">SMS Campaigns</button>
          <button className="text-slate-600 py-3 text-sm font-medium hover:text-slate-900 transition-colors" onClick={() => setCurrentView('templates')}>Templates</button>
          <button className="text-slate-600 py-3 text-sm font-medium hover:text-slate-900 transition-colors">Subscriptions</button>
        </div>
      </div>

      <div className="p-8 max-w-[1200px] mx-auto w-full flex-1">
          <div className="flex items-center gap-4 mb-8">
            <select className="border border-slate-300 rounded-full px-4 py-1.5 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-(--color-secondary-200)"><option>Most Recent</option></select>
            <select className="border border-slate-300 rounded-full px-4 py-1.5 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-(--color-secondary-200)"><option>All Statuses</option></select>
            <select className="border border-slate-300 rounded-full px-4 py-1.5 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-(--color-secondary-200)"><option>All Types</option></select>
            <select className="border border-slate-300 rounded-full px-4 py-1.5 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-(--color-secondary-200)"><option>Created by All</option></select>
            
            <div className="relative ml-2 w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Type campaigns name" 
                className="w-full pl-10 pr-4 py-1.5 rounded-full border border-slate-300 text-sm focus:outline-none focus:border-(--color-secondary-200)"
              />
            </div>

            <button className="bg-(--bg-brand-primary-default) text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ml-auto hover:bg-(--bg-brand-primary-hover) transition-colors shadow-sm">
              Create Campaign <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Row 1 */}
            <div className="grid grid-cols-[100px_320px_120px_1fr_1fr_1fr_1fr_1fr_1fr] items-center p-6 border-b border-slate-100 gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Mail className="w-8 h-8 stroke-1 mb-1" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Regular</span>
                </div>
                <div>
                  <h4 className="text-slate-800 font-bold text-sm leading-relaxed mb-1 pr-4">The Weekly Wire Revenue Newsletter | Week of September 7, 2026</h4>
                  <div className="text-xs font-medium text-slate-500 mb-0.5">Sep 8, 2026</div>
                  <div className="text-xs text-slate-400">Maggie Allen</div>
                </div>
                <div className="text-emerald-600 text-sm font-semibold">Completed</div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Sent</div><div className="text-(--color-secondary-200) font-bold text-[15px]">418</div><div className="text-(--color-secondary-200) font-medium text-xs">100%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Delivered</div><div className="text-(--color-secondary-200) font-bold text-[15px]">394</div><div className="text-(--color-secondary-200) font-medium text-xs">94%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Opened</div><div className="text-(--color-secondary-200) font-bold text-[15px]">144</div><div className="text-(--color-secondary-200) font-medium text-xs">36%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Clicked</div><div className="text-(--color-secondary-200) font-bold text-[15px]">9</div><div className="text-(--color-secondary-200) font-medium text-xs">2%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Apply Clicks</div><div className="text-(--color-secondary-200) font-bold text-[15px]">0</div><div className="text-(--color-secondary-200) font-medium text-xs">0%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Applied</div><div className="text-(--color-secondary-200) font-bold text-[15px]">0</div><div className="text-(--color-secondary-200) font-medium text-xs">0%</div></div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-[100px_320px_120px_1fr_1fr_1fr_1fr_1fr_1fr] items-center p-6 border-b border-slate-100 gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <FileText className="w-8 h-8 stroke-1 mb-1" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Always-On</span>
                </div>
                <div>
                  <h4 className="text-slate-800 font-bold text-sm mb-1 pr-4">test123 mh</h4>
                  <div className="text-xs font-medium text-slate-500 mb-0.5">Sep 3, 2026 - Sep 15, 2026</div>
                  <div className="text-xs text-slate-400">Madeline Hendricks</div>
                </div>
                <div className="text-rose-600 text-sm font-semibold">Ongoing</div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Sent</div><div className="text-(--color-secondary-200) font-bold text-[15px]">0</div><div className="text-(--color-secondary-200) font-medium text-xs">0%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Delivered</div><div className="text-(--color-secondary-200) font-bold text-[15px]">0</div><div className="text-(--color-secondary-200) font-medium text-xs">0%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Opened</div><div className="text-(--color-secondary-200) font-bold text-[15px]">0</div><div className="text-(--color-secondary-200) font-medium text-xs">0%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Clicked</div><div className="text-(--color-secondary-200) font-bold text-[15px]">0</div><div className="text-(--color-secondary-200) font-medium text-xs">0%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Apply Clicks</div><div className="text-(--color-secondary-200) font-bold text-[15px]">0</div><div className="text-(--color-secondary-200) font-medium text-xs">0%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Applied</div><div className="text-(--color-secondary-200) font-bold text-[15px]">0</div><div className="text-(--color-secondary-200) font-medium text-xs">0%</div></div>
            </div>
            
            {/* Row 3 */}
            <div className="grid grid-cols-[100px_320px_120px_1fr_1fr_1fr_1fr_1fr_1fr] items-center p-6 gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Mail className="w-8 h-8 stroke-1 mb-1" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Drip</span>
                </div>
                <div>
                  <h4 className="text-slate-800 font-bold text-sm mb-1 pr-4">- draft -</h4>
                  <div className="text-xs font-medium text-slate-500 mb-0.5">-</div>
                  <div className="text-xs text-slate-400">Patrik Magitteri</div>
                </div>
                <div className="text-slate-600 text-sm font-semibold">Draft</div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Sent</div><div className="text-(--color-secondary-200) font-bold text-[15px]">0</div><div className="text-(--color-secondary-200) font-medium text-xs">0%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Delivered</div><div className="text-(--color-secondary-200) font-bold text-[15px]">0</div><div className="text-(--color-secondary-200) font-medium text-xs">0%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Opened</div><div className="text-(--color-secondary-200) font-bold text-[15px]">0</div><div className="text-(--color-secondary-200) font-medium text-xs">0%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Clicked</div><div className="text-(--color-secondary-200) font-bold text-[15px]">0</div><div className="text-(--color-secondary-200) font-medium text-xs">0%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Apply Clicks</div><div className="text-(--color-secondary-200) font-bold text-[15px]">0</div><div className="text-(--color-secondary-200) font-medium text-xs">0%</div></div>
                <div className="text-center"><div className="text-slate-500 text-xs font-medium mb-1">Applied</div><div className="text-(--color-secondary-200) font-bold text-[15px]">0</div><div className="text-(--color-secondary-200) font-medium text-xs">0%</div></div>
            </div>
          </div>
      </div>
    </div>
  );

  const renderTemplatesView = () => (
    <div className="flex flex-col h-full bg-(--bg-surface-base) overflow-y-auto">
      <div className="bg-white border-b border-slate-200">
        <div className="h-[72px] flex items-center px-8 pb-0 pt-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Campaigns</h2>
        </div>
        <div className="flex items-center gap-8 px-8">
          <button className="text-slate-600 py-3 text-sm font-medium hover:text-slate-900 transition-colors" onClick={() => setCurrentView('campaigns')}>Email Campaigns</button>
          <button className="text-slate-600 py-3 text-sm font-medium hover:text-slate-900 transition-colors">SMS Campaigns</button>
          <button className="text-(--color-secondary-200) border-b-2 border-(--color-secondary-200) py-3 text-sm font-semibold">Templates</button>
          <button className="text-slate-600 py-3 text-sm font-medium hover:text-slate-900 transition-colors">Subscriptions</button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto w-full flex-1">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex border border-slate-300 rounded-full overflow-hidden bg-white shadow-sm">
            <button className="px-5 py-2 text-sm font-semibold text-slate-800 border-r border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors">Email Templates</button>
            <button className="px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">SMS Templates</button>
          </div>

          <div className="relative w-[300px] ml-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Template" 
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 text-sm focus:outline-none focus:border-(--color-secondary-200) shadow-sm"
            />
          </div>

          <button className="bg-(--bg-brand-primary-default) text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-(--bg-brand-primary-hover) transition-colors shadow-sm">
            Create Template
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => setCurrentView('builder')}>
            <div className="h-40 bg-slate-50 border-b border-slate-100 p-6 flex flex-col justify-center gap-2 group-hover:bg-blue-50/50 transition-colors">
               <div className="h-3 bg-slate-200 rounded w-3/4"></div>
               <div className="h-3 bg-slate-200 rounded w-full"></div>
               <div className="h-3 bg-slate-200 rounded w-5/6"></div>
               <div className="h-8 bg-blue-100 rounded w-1/3 mt-2"></div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-1 truncate">Congrats - {candidate.firstName} {candidate.lastName}</h3>
              <p className="text-xs text-slate-500 mb-3 truncate">Nurturing outreach to congratulate {candidate.firstName}...</p>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                 <span className="flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5" /> Desktop</span>
                 <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> Mobile</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
            <div className="h-40 bg-slate-50 border-b border-slate-100 p-6 flex flex-col justify-center items-center group-hover:bg-blue-50/50 transition-colors">
               <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
               <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SMS ONLY</div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-1">Q3 Engineering Outreach</h3>
              <p className="text-xs text-slate-500 mb-3">Quick check-in for passive SWE talent.</p>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                 <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> Mobile</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
            <div className="h-40 bg-slate-50 border-b border-slate-100 p-6 flex flex-col justify-center gap-2 group-hover:bg-blue-50/50 transition-colors">
               <div className="h-32 bg-slate-200 rounded-md w-full flex items-center justify-center">
                 <Monitor className="w-8 h-8 text-slate-400" />
               </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-1">Company Newsletter - Sept</h3>
              <p className="text-xs text-slate-500 mb-3">Monthly digest template with hero image.</p>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                 <span className="flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5" /> Desktop</span>
                 <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> Mobile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBuilderView = () => (
    <div className="flex h-full bg-(--bg-surface-base)">
      <div className="flex-1 flex flex-col relative h-full">
        <div className="h-[72px] bg-white border-b border-slate-200 flex items-center px-6 justify-between flex-shrink-0 relative z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('workflow')} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2">
              <ChevronDown className="w-4 h-4 rotate-90" /> Back
            </button>
            <h2 className="text-lg font-bold text-slate-800">Email Template Builder</h2>
          </div>
          <div className="flex items-center gap-3">
             <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">Save Draft</button>
             <button className="bg-(--bg-brand-primary-default) text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-(--bg-brand-primary-hover) transition-colors shadow-sm">Save Template</button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Canvas */}
          <div className="flex-1 p-8 bg-slate-100 overflow-y-auto flex justify-center">
             <div className="w-[600px] h-fit bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden flex flex-col">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                   <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-slate-500 w-16">To:</span>
                      <span className="text-sm font-medium text-slate-800 px-2 py-1 bg-white border border-slate-200 rounded-md shadow-sm">{candidate.firstName} {candidate.lastName}</span>
                   </div>
                   <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-slate-500 w-16">From:</span>
                      <span className="text-sm font-medium text-slate-800 px-2 py-1 bg-white border border-slate-200 rounded-md shadow-sm">Brian Stepan</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 w-16">Subject:</span>
                      <span className="text-sm font-medium text-slate-800 px-2 py-1 bg-white border border-slate-200 rounded-md flex-1 shadow-sm">Congratulations on your new role at {candidate.company}</span>
                   </div>
                </div>
                <div className="p-8 text-sm text-slate-700 leading-relaxed min-h-[400px]">
                   <p className="mb-4">Hi {candidate.firstName},</p>
                   <p className="mb-4">I saw the recent news about your appointment at {candidate.company}. Congratulations! It is an impressive milestone, and I've been following your work closely.</p>
                   <p className="mb-4">I know you're likely settling into the new position, but when the dust settles, I'd love to connect. I specialize in placing executive leaders and would welcome the chance to learn more about your long-term goals.</p>
                   <p className="mb-8">Wishing you all the best in the new chapter.</p>
                   <p>Best regards,<br/>Brian Stepan<br/>Executive Search Partner</p>
                </div>
             </div>
          </div>

          {/* Settings Panel */}
          <div className="w-[320px] bg-white border-l border-slate-200 flex flex-col flex-shrink-0 shadow-[-4px_0_12px_rgba(0,0,0,0.02)] z-10">
            <div className="h-[60px] border-b border-slate-200 flex items-center px-6 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Properties</h3>
            </div>
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Name</label>
                <input type="text" defaultValue={`Congrats - ${candidate.firstName} ${candidate.lastName}`} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:border-(--color-secondary-200) focus:outline-none shadow-sm transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                <textarea rows={3} defaultValue={`Nurturing outreach to congratulate ${candidate.firstName} ${candidate.lastName} on his new role at ${candidate.company}.`} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:border-(--color-secondary-200) focus:outline-none resize-none shadow-sm transition-colors"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Subject Line</label>
                <input type="text" defaultValue={`Congratulations on your new role at ${candidate.company}`} className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:border-(--color-secondary-200) focus:outline-none shadow-sm transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md border border-blue-100">Executive</span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-100">Nurture</span>
                  <button className="px-2.5 py-1 bg-slate-50 text-slate-500 text-xs font-semibold rounded-md border border-slate-200 border-dashed hover:bg-slate-100 transition-colors">+ Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed inset-4 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col focus:outline-none ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex h-full w-full bg-(--bg-surface-base)">
            
            {/* Sidebar */}
            <div className="w-[260px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 relative z-20 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
               <div className="h-[72px] border-b border-slate-200 flex items-center px-6">
                  <div className="flex items-center gap-2">
                    <svg width="28" height="28" viewBox="0 0 100 100" className="shrink-0 text-(--icon-strong)">
                      <g transform="translate(0, -2)" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round">
                        <circle cx="55" cy="42" r="14" />
                        <line x1="41" y1="28" x2="41" y2="65" />
                        <path d="M32,82 Q50,92 68,82" />
                      </g>
                    </svg>
                    <span className="font-medium text-(--text-strong) text-xl tracking-wide">phenom</span>
                  </div>
               </div>
               <div className="p-4 flex flex-col gap-1.5 flex-1 mt-2">
                 <button onClick={() => setCurrentView('workflow')} className={cn("flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors", currentView === 'workflow' ? "bg-blue-50 text-(--color-secondary-200)" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
                   <GitBranch className="w-[18px] h-[18px]" /> Agent Strategy
                 </button>
                 <button onClick={() => setCurrentView('campaigns')} className={cn("flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors", currentView === 'campaigns' ? "bg-blue-50 text-(--color-secondary-200)" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
                   <Megaphone className="w-[18px] h-[18px]" /> Campaigns
                 </button>
                 <button onClick={() => setCurrentView('templates')} className={cn("flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors", (currentView === 'templates' || currentView === 'builder') ? "bg-blue-50 text-(--color-secondary-200)" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
                   <LayoutTemplate className="w-[18px] h-[18px]" /> Templates
                 </button>
               </div>
               <div className="p-4 border-t border-slate-200">
                 <button onClick={() => onOpenChange(false)} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200 hover:text-slate-900 shadow-sm">
                   <X className="w-4 h-4" /> Close Planner
                 </button>
               </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative flex flex-col">
              {currentView === 'workflow' && renderWorkflowView()}
              {currentView === 'campaigns' && renderCampaignsView()}
              {currentView === 'templates' && renderTemplatesView()}
              {currentView === 'builder' && renderBuilderView()}
            </div>
            
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
