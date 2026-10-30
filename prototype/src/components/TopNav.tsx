import React, { useState } from 'react';
import { Search, Plus, Bell, HelpCircle, Settings, Grid, Link2, Check } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export function TopNav() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const ok = await router.copyCurrentUrl();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getPageTitle = () => {
    switch (router.view) {
      case 'home':
        return 'Workspace';
      case 'candidates':
        return router.candidateId ? `Candidate Profile (${router.candidateId})` : 'Candidates';
      case 'projects':
        return router.projectId ? `Project Mandate (${router.projectId})` : 'Projects';
      case 'companies':
        return router.companyId ? `Company Intelligence (${router.companyId})` : 'Companies';
      case 'roles':
        return router.roleId ? `Shadow Bench (${router.roleId})` : 'Roles';
      case 'jobs':
        return router.roleId ? `Job (${router.roleId})` : 'Jobs';
      case 'dealrooms':
        return router.dealRoomId ? `Opportunity Room (${router.dealRoomId})` : 'Opportunity Rooms';
      case 'agents':
        return router.agentTab ? `Agent: ${router.agentTab.toUpperCase()}` : 'Agents';
      default:
        return 'Workspace';
    }
  };

  const currentDisplayPath = window.location.pathname + (window.location.search || '');

  return (
    <header className="h-(--shell-topbar-height) bg-(--components-top-navigation-bg-default) border-b border-(--components-top-navigation-border-default) flex items-center justify-between px-6 flex-shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="font-medium text-(--text-strong) text-sm tracking-tight flex items-center gap-1.5">
          <span className="text-base font-medium text-(--text-strong)">
            Phenom
          </span>
          <span className="text-slate-400 font-normal">/</span>
          <span className="text-slate-700 text-xs font-semibold">{getPageTitle()}</span>
        </div>

        {/* Current URL Path Pill & Copy Deep Link Button */}
        <button
          onClick={handleCopyLink}
          title="Click to copy page unique deep link"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-[11px] font-mono text-slate-500 hover:text-purple-700 transition-all cursor-pointer group"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
              <span className="text-emerald-700 font-sans font-semibold">Deep link copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-3 h-3 text-slate-400 group-hover:text-purple-600 transition-colors" />
              <span className="text-slate-600 group-hover:text-purple-700 truncate max-w-[200px]">
                {currentDisplayPath}
              </span>
              <span className="text-[10px] text-slate-400 font-sans font-normal ml-0.5 group-hover:text-purple-600">
                (Copy)
              </span>
            </>
          )}
        </button>
      </div>
      
      <div className="flex-1 max-w-md mx-6 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="w-4 h-4 stroke-[2]" />
        </div>
        <input 
          type="text"
          placeholder="Search candidates, roles, projects..."
          className="w-full h-8.5 bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 text-xs focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-1 focus:ring-purple-500 transition-all text-slate-800 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-3 text-slate-500">
        <button
          onClick={handleCopyLink}
          title="Copy Deep Link"
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4 text-purple-600" />}
        </button>

        <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
          <Plus className="w-4 h-4 stroke-[2] text-slate-600" />
        </button>
        <button className="hover:text-slate-800 transition-colors">
          <Bell className="w-4.5 h-4.5 stroke-[1.5]" />
        </button>
        <button className="hover:text-slate-800 transition-colors hidden sm:block">
          <HelpCircle className="w-4.5 h-4.5 stroke-[1.5]" />
        </button>
        <button className="hover:text-slate-800 transition-colors hidden sm:block">
          <Settings className="w-4.5 h-4.5 stroke-[1.5]" />
        </button>
        <button className="hover:text-slate-800 transition-colors hidden sm:block">
          <Grid className="w-4.5 h-4.5 stroke-[1.5]" />
        </button>
        <div className="w-8 h-8 rounded-full bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-dark) font-semibold text-xs flex items-center justify-center ml-1 cursor-pointer border border-(--color-secondary-50)">
          BS
        </div>
      </div>
    </header>
  );
}
