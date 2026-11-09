import React, { useEffect, useRef, useState } from 'react';
import { Plus, Flame, CheckCircle2, ChevronRight, Bot, Sparkles, Briefcase, Eye, Check } from 'lucide-react';
import {
  RoleSuccessionItem,
  ShadowBenchCandidate,
  initialRolesSuccessionData,
  getSuccessionRecommendations,
} from '../../data/rolesSuccessionData';
import { RecommendedRole, initialRecommendedRoles } from '../../data/recommendedRolesData';
import { ShadowBenchDetailView } from './ShadowBenchDetailView';
import { CreateRoleModal } from './CreateRoleModal';
import { cn } from '../../lib/utils';
import { useRouter } from '../../context/RouterContext';
import { registerTrackedRole } from '../../lib/roleProject';

interface RolesSuccessionViewProps {
  initialRoleId?: string | null;
  onNavigateCandidate?: (candidateId: string) => void;
}

type ListTab = 'tracked' | 'recommended';

/** Agent suggestions not yet on the role's bench (matches the count in the role detail view) */
const recommendationCount = (role: RoleSuccessionItem) =>
  getSuccessionRecommendations(role).filter(c => !role.candidates.some(existing => existing.id === c.id)).length;

function AvatarStack({ role }: { role: RoleSuccessionItem }) {
  return (
    <div className="flex items-center -space-x-2 shrink-0">
      {role.candidates.slice(0, 4).map(c => (
        <div key={c.id} className="relative">
          <img
            src={c.avatarUrl}
            alt={c.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white ring-1 ring-slate-200"
            title={`${c.name} (${c.company}) - ${c.ptmLevel} PTM`}
          />
          {c.ptmLevel === 'High' && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-(--feedback-error-bg-default) ring-2 ring-white" aria-label="High propensity to move" />
          )}
        </div>
      ))}
      {role.candidates.length > 4 && (
        <div className="w-10 h-10 rounded-full bg-(--bg-neutral-soft) border-2 border-white ring-1 ring-slate-200 flex items-center justify-center text-sm font-semibold text-(--text-default)">
          +{role.candidates.length - 4}
        </div>
      )}
    </div>
  );
}

function BenchStats({ role }: { role: RoleSuccessionItem }) {
  return (
    <dl className="flex items-center gap-8">
      <div>
        <dt className="text-sm text-(--text-default)">Tracked</dt>
        <dd className="text-2xl font-bold text-(--text-strong) tabular-nums">{role.totalCandidatesTracked}</dd>
      </div>
      <div>
        <dt className="text-sm text-(--feedback-error-text-strong) flex items-center gap-1">
          <Flame className="w-4 h-4" aria-hidden="true" /> High flight risk
        </dt>
        <dd className="text-2xl font-bold text-(--feedback-error-text-strong) tabular-nums">{role.highFlightRiskCount}</dd>
      </div>
      <div>
        <dt className="text-sm text-(--text-default)">Avg EMI</dt>
        <dd className="text-2xl font-bold text-(--feedback-success-text-strong) tabular-nums">{role.avgEmiMatch}%</dd>
      </div>
    </dl>
  );
}

const cardShell =
  'bg-(--bg-default) rounded-2xl border border-(--border-light) shadow-2xs hover:shadow-md hover:border-(--color-secondary-200)/40 transition-all p-7 flex flex-col gap-5 group';

export function RolesSuccessionView({ initialRoleId }: RolesSuccessionViewProps) {
  const router = useRouter();
  // Tracked roles (the main Roles screen) and roles the agent recommends tracking
  const [roles, setRoles] = useState<RoleSuccessionItem[]>(initialRolesSuccessionData);
  const [recommendedRoles, setRecommendedRoles] = useState<RecommendedRole[]>(initialRecommendedRoles);

  const [activeTab, setActiveTab] = useState<'active_requisition' | 'succession_bench'>('active_requisition');
  const [listTab, setListTab] = useState<ListTab>('tracked');
  const [justActivatedId, setJustActivatedId] = useState<string | null>(null);

  // Selected role for the shadow bench detail view (tracked or recommended preview)
  const selectedRoleId = router.roleId || initialRoleId || null;
  const setSelectedRoleId = (id: string | null) => {
    router.setRoleId(id);
  };

  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 4000);
  };
  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    roles.forEach(registerTrackedRole);
  }, [roles]);

  const trackedRole = roles.find(r => r.id === selectedRoleId) || null;
  const previewRole = trackedRole ? null : recommendedRoles.find(r => r.id === selectedRoleId) || null;
  const selectedRole = trackedRole ?? previewRole;

  const handleUpdateRole = (updatedRole: RoleSuccessionItem) => {
    if (roles.some(r => r.id === updatedRole.id)) {
      setRoles(prev => prev.map(r => (r.id === updatedRole.id ? updatedRole : r)));
    } else {
      setRecommendedRoles(prev => prev.map(r => (r.id === updatedRole.id ? { ...r, ...updatedRole } : r)));
    }
    showToast(`Updated shadow bench for ${updatedRole.roleTitle}`);
  };

  const handleCreateRole = (newRole: RoleSuccessionItem) => {
    setRoles(prev => [newRole, ...prev]);
    showToast(`Created ${newRole.roleTitle} with AI-calibrated anchors!`);
    setActiveTab(newRole.type);
    setListTab('tracked');
    setSelectedRoleId(newRole.id);
  };

  /** Move a recommended role (with its bench) onto the main Roles screen */
  const activateRecommended = (id: string) => {
    const rec = recommendedRoles.find(r => r.id === id);
    if (!rec) return;
    const { recommendation: _recommendation, ...role } = rec;
    setRecommendedRoles(prev => prev.filter(r => r.id !== id));
    setRoles(prev => [role, ...prev]);
    setActiveTab(role.type);
    setListTab('tracked');
    setSelectedRoleId(null);
    setJustActivatedId(id);
    setTimeout(() => setJustActivatedId(null), 5000);
    showToast(`${role.roleTitle} is now tracked in Roles, with its ${role.candidates.length}-person bench.`);
  };

  const viewRecommended = (id: string) => {
    setListTab('recommended');
    setSelectedRoleId(id);
  };

  const handleCandidateOutreach = (candidate: ShadowBenchCandidate) => {
    showToast(`Dispatched Phenom Aura Agent outreach sequence to ${candidate.name}!`);
  };

  const filteredRoles = roles.filter(r => r.type === activeTab);

  if (selectedRole) {
    return (
      <ShadowBenchDetailView
        role={selectedRole}
        recommendation={previewRole ? previewRole.recommendation : undefined}
        onActivate={previewRole ? () => activateRecommended(previewRole.id) : undefined}
        onBack={() => setSelectedRoleId(null)}
        onUpdateRole={handleUpdateRole}
        onTriggerCandidateOutreach={handleCandidateOutreach}
      />
    );
  }

  const tabs: { id: ListTab; label: string; count: number }[] = [
    { id: 'tracked', label: 'Roles', count: filteredRoles.length },
    { id: 'recommended', label: 'Recommended roles', count: recommendedRoles.length },
  ];

  return (
    <div className="min-h-full bg-(--bg-surface-base) pb-16">
      {toastMessage && (
        <div role="status" className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-semibold animate-slideUp max-w-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-bold text-(--text-strong)">Roles & Succession</h1>
            <p className="text-sm text-(--text-default) mt-1">
              Real-time predictive Propensity to Move (PTM), Structural Fit (SFA), and Motivation Alignment (CMA) talent mapping.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateRoleModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2.5 shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Role</span>
          </button>
        </div>

        {/* Tabs: tracked roles and roles the agent recommends */}
        <div className="flex items-center gap-1 border-b border-(--border-light)" role="tablist" aria-label="Roles views">
          {tabs.map(tab => {
            const active = listTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`roles-tab-${tab.id}`}
                aria-selected={active}
                aria-controls={`roles-panel-${tab.id}`}
                onClick={() => setListTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px cursor-pointer transition-colors',
                  active
                    ? 'border-(--color-secondary-200) text-(--color-secondary-200)'
                    : 'border-transparent text-(--text-default) hover:text-(--text-strong)'
                )}
              >
                {tab.id === 'recommended' && <Sparkles className="w-4 h-4" aria-hidden="true" />}
                {tab.label}
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-md text-xs font-semibold tabular-nums',
                    active ? 'bg-(--bg-brand-secondary-subtle) text-(--color-secondary-200)' : 'bg-(--bg-neutral-soft) text-(--text-default)'
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {listTab === 'tracked' && (
          <div id="roles-panel-tracked" role="tabpanel" aria-labelledby="roles-tab-tracked" className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredRoles.map(role => (
              <div
                key={role.id}
                role="button"
                tabIndex={0}
                aria-label={`Open shadow bench for ${role.roleTitle}`}
                onClick={() => setSelectedRoleId(role.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedRoleId(role.id);
                  }
                }}
                className={cn(cardShell, 'cursor-pointer', justActivatedId === role.id && 'ring-2 ring-(--color-secondary-200)')}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-(--text-strong) group-hover:text-(--color-secondary-200) transition-colors">{role.roleTitle}</h3>
                  <span className="phx-tag shrink-0" data-tooltip="Executives the Aura agent suggests adding to this bench">
                    <Bot className="w-4 h-4" aria-hidden="true" />
                    {recommendationCount(role)} {recommendationCount(role) === 1 ? 'recommendation' : 'recommendations'}
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-4 py-4 border-y border-(--border-faint)">
                  <div>
                    <dt className="text-sm text-(--text-default)">Revenue scale</dt>
                    <dd className="text-base font-semibold text-(--text-strong) mt-0.5">{role.anchors.targetRevenueScale}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-(--text-default)">Headcount</dt>
                    <dd className="text-base font-semibold text-(--text-strong) mt-0.5">{role.anchors.targetHeadcountScope}</dd>
                  </div>
                </dl>

                <div className="flex items-center justify-between gap-4">
                  <BenchStats role={role} />
                  <AvatarStack role={role} />
                </div>

                <div className="flex items-center justify-end text-sm text-(--color-secondary-200) font-semibold mt-auto">
                  <span className="flex items-center gap-1">
                    Open Shadow Bench <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
            ))}

            {filteredRoles.length === 0 && (
              <div className="md:col-span-2 p-12 bg-(--bg-default) rounded-2xl border border-dashed border-(--border-default) text-center space-y-3">
                <Briefcase className="w-8 h-8 text-(--text-subtle) mx-auto" />
                <h4 className="text-base font-bold text-(--text-strong)">No roles yet</h4>
                <p className="text-sm text-(--text-default) max-w-sm mx-auto">Create a role, or activate one the agent recommends.</p>
                <div className="flex justify-center gap-2">
                  <button type="button" onClick={() => setIsCreateRoleModalOpen(true)} className="phx-btn" data-variant="primary-blue" data-size="sm">
                    Create Role
                  </button>
                  <button type="button" onClick={() => setListTab('recommended')} className="phx-btn" data-variant="secondary" data-size="sm">
                    See recommended roles
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {listTab === 'recommended' && (
          <div id="roles-panel-recommended" role="tabpanel" aria-labelledby="roles-tab-recommended" className="space-y-5">
            <div className="phx-feedback" data-tone="progressive">
              <Sparkles className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">
                The agent analyzed your past projects and jobs, found seats that keep coming up, and started a shadow bench for each. Review a role and its bench, then activate it to track it in Roles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recommendedRoles.map(role => (
                <div
                  key={role.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`View recommended role ${role.roleTitle}`}
                  onClick={() => viewRecommended(role.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      viewRecommended(role.id);
                    }
                  }}
                  className={cn(cardShell, 'cursor-pointer')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-(--text-strong) group-hover:text-(--color-secondary-200) transition-colors">{role.roleTitle}</h3>
                    <span className="phx-tag shrink-0">
                      <Sparkles className="w-4 h-4" aria-hidden="true" /> Recommended
                    </span>
                  </div>

                  <div>
                    <p className="text-base text-(--text-strong) leading-relaxed">{role.recommendation.basis}</p>
                    <p className="text-sm text-(--text-default) mt-2">
                      Based on {role.recommendation.sourceProjects.length} past projects: {role.recommendation.sourceProjects.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-4 border-y border-(--border-faint)">
                    <dl className="flex items-center gap-8">
                      <div>
                        <dt className="text-sm text-(--text-default)">Bench</dt>
                        <dd className="text-2xl font-bold text-(--text-strong) tabular-nums">{role.totalCandidatesTracked}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-(--text-default)">Avg EMI</dt>
                        <dd className="text-2xl font-bold text-(--feedback-success-text-strong) tabular-nums">{role.avgEmiMatch}%</dd>
                      </div>
                    </dl>
                    <AvatarStack role={role} />
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-auto">
                    <button
                      type="button"
                      className="phx-btn"
                      data-variant="secondary"
                      data-size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        viewRecommended(role.id);
                      }}
                    >
                      <Eye className="w-4 h-4" aria-hidden="true" /> View details
                    </button>
                    <button
                      type="button"
                      className="phx-btn"
                      data-variant="primary"
                      data-size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        activateRecommended(role.id);
                      }}
                    >
                      <Check className="w-4 h-4" aria-hidden="true" /> Activate role
                    </button>
                  </div>
                </div>
              ))}

              {recommendedRoles.length === 0 && (
                <div className="md:col-span-2 p-12 bg-(--bg-default) rounded-2xl border border-dashed border-(--border-default) text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-(--text-subtle) mx-auto" />
                  <h4 className="text-base font-bold text-(--text-strong)">No recommendations right now</h4>
                  <p className="text-sm text-(--text-default) max-w-md mx-auto">
                    The agent keeps analyzing new projects and hires, and will propose roles here as it finds them.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onOpenChange={setIsCreateRoleModalOpen}
        defaultType={activeTab}
        onCreateRole={handleCreateRole}
        recommendedRoles={recommendedRoles}
        onActivateRecommended={id => {
          setIsCreateRoleModalOpen(false);
          activateRecommended(id);
        }}
        onViewRecommended={id => {
          setIsCreateRoleModalOpen(false);
          viewRecommended(id);
        }}
      />
    </div>
  );
}
