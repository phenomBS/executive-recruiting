import React, { useState } from 'react';
import { Search, Plus, Bell, HelpCircle, Settings, Grid, Link2, Check, ChevronRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

type Crumb = { label: string; onClick?: () => void };

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

  /** Section crumb (a link when a detail page is open) plus the current page. */
  const getCrumbs = (): Crumb[] => {
    const toList = (view: Parameters<typeof router.navigateToView>[0]) => () => router.navigateToView(view);
    switch (router.view) {
      case 'candidates':
        return router.candidateId
          ? [{ label: 'Candidates', onClick: toList('candidates') }, { label: `Candidate Profile (${router.candidateId})` }]
          : [{ label: 'Candidates' }];
      case 'projects':
        return router.projectId
          ? [{ label: 'Projects', onClick: toList('projects') }, { label: `Project Mandate (${router.projectId})` }]
          : [{ label: 'Projects' }];
      case 'companies':
        return router.companyId
          ? [{ label: 'Companies', onClick: toList('companies') }, { label: `Company Intelligence (${router.companyId})` }]
          : [{ label: 'Companies' }];
      case 'roles':
        return router.roleId
          ? [{ label: 'Roles', onClick: toList('roles') }, { label: `Shadow Bench (${router.roleId})` }]
          : [{ label: 'Roles' }];
      case 'jobs':
        return router.roleId
          ? [{ label: 'Jobs', onClick: toList('jobs') }, { label: `Job (${router.roleId})` }]
          : [{ label: 'Jobs' }];
      case 'dealrooms':
        return router.dealRoomId
          ? [{ label: 'Opportunity Rooms', onClick: toList('dealrooms') }, { label: `Opportunity Room (${router.dealRoomId})` }]
          : [{ label: 'Opportunity Rooms' }];
      case 'agents':
        return router.agentTab
          ? [{ label: 'Agents', onClick: toList('agents') }, { label: router.agentTab.toUpperCase() }]
          : [{ label: 'Agents' }];
      default:
        return [{ label: 'Workspace' }];
    }
  };

  const crumbs = getCrumbs();
  const currentDisplayPath = window.location.pathname + (window.location.search || '');

  return (
    <header className="phx-topbar h-(--shell-topbar-height) shrink-0 z-10">
      <nav aria-label="Breadcrumb">
        <ol className="phx-breadcrumb">
          <li className="phx-topbar-brand-name">Phenom</li>
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <React.Fragment key={c.label}>
                <li className="phx-crumb-sep" aria-hidden="true">
                  <ChevronRight className="w-4 h-4" />
                </li>
                <li>
                  {last ? (
                    <span className="phx-crumb" aria-current="page">{c.label}</span>
                  ) : (
                    <button type="button" className="phx-crumb" onClick={c.onClick}>{c.label}</button>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </nav>

      <button
        type="button"
        onClick={handleCopyLink}
        className="phx-btn hidden md:inline-flex"
        data-variant="tertiary"
        data-size="sm"
        data-tooltip="Copy a link to this page"
        aria-label={`Copy link to this page: ${currentDisplayPath}`}
      >
        {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Link2 className="w-4 h-4" aria-hidden="true" />}
        <span className="truncate max-w-[220px]">{copied ? 'Link copied' : currentDisplayPath}</span>
      </button>

      <span className="phx-topbar-spacer" />

      <div className="phx-input-icon">
        <Search aria-hidden="true" />
        <input
          type="search"
          aria-label="Search candidates, roles and projects"
          placeholder="Search candidates, roles, projects..."
          className="phx-search"
          style={{ width: 360 }}
        />
      </div>

      <div className="flex items-center gap-1">
        <button type="button" onClick={handleCopyLink} className="phx-topbar-action md:hidden" aria-label="Copy link to this page">
          {copied ? <Check className="w-5 h-5" aria-hidden="true" /> : <Link2 className="w-5 h-5" aria-hidden="true" />}
        </button>
        <button type="button" className="phx-topbar-action" aria-label="Create new">
          <Plus className="w-5 h-5" aria-hidden="true" />
        </button>
        <button type="button" className="phx-topbar-action" aria-label="Notifications">
          <Bell className="w-5 h-5" aria-hidden="true" />
        </button>
        <button type="button" className="phx-topbar-action hidden sm:inline-flex" aria-label="Help">
          <HelpCircle className="w-5 h-5" aria-hidden="true" />
        </button>
        <button type="button" className="phx-topbar-action hidden sm:inline-flex" aria-label="Settings">
          <Settings className="w-5 h-5" aria-hidden="true" />
        </button>
        <button type="button" className="phx-topbar-action hidden sm:inline-flex" aria-label="Apps">
          <Grid className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Account: Brian Stepan"
          className="ml-2 w-8 h-8 rounded-full bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-default) font-semibold text-sm flex items-center justify-center border border-(--border-light) cursor-pointer"
        >
          BS
        </button>
      </div>
    </header>
  );
}
