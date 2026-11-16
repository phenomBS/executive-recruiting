import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Download, ExternalLink, MapPin, Plus, Sparkles, Trash2, Users } from 'lucide-react';
import type { Project } from '../../types';
import { useRouter } from '../../context/RouterContext';
import { useRestricted } from '../../context/RestrictedContext';
import {
  TargetCompany,
  getProjectTargetCompanies,
  recommendCompaniesForProject,
  saveProjectTargetCompanies,
} from '../../data/projectTargetCompanies';
import { AddTargetCompanyModal } from './AddTargetCompanyModal';
import { ExportTargetCompaniesModal, TargetCompaniesExportChoices } from './ExportTargetCompaniesModal';
import { buildTargetCompaniesCsv } from '../../lib/targetCompaniesCsv';
import { buildTargetCompaniesPdf } from '../../lib/targetCompaniesPdf';
import { downloadBlob } from '../../lib/simplePdf';

interface ProjectTargetCompaniesTabProps {
  project: Project;
  /** Lets the page header keep its count in step with this list */
  onCountChange?: (count: number) => void;
}

const SOURCE_LABEL: Record<TargetCompany['source'], string> = {
  agent: 'Agent match',
  added: 'Added by you',
  created: 'Created by you',
};

type CompanyView = 'list' | 'recommendations';

function CompanyCard({
  company,
  tone,
  onOpen,
  onAdd,
  onRemove,
}: {
  company: TargetCompany;
  /** added is on the list; pending is a gray recommendation on that list; review is the recommendations view */
  tone: 'added' | 'pending' | 'review';
  onOpen: () => void;
  onAdd?: () => void;
  onRemove?: () => void;
}) {
  const pending = tone === 'pending';
  const suggestion = tone !== 'added';
  return (
    <li
      className="relative rounded-2xl border p-5 flex flex-col gap-4 focus-within:outline-2 focus-within:outline-offset-2"
      style={
        pending
          ? { background: 'var(--bg-neutral-soft)', borderStyle: 'dashed', borderColor: 'var(--border-default)' }
          : { background: 'var(--bg-default)', borderColor: 'var(--border-light)' }
      }
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl font-bold flex items-center justify-center text-base shrink-0"
            style={{
              background: pending ? 'var(--bg-default)' : 'var(--bg-neutral-soft)',
              color: pending ? 'var(--text-subtle)' : 'var(--text-strong)',
            }}
            aria-hidden="true"
          >
            {company.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="m-0! text-lg! leading-6! font-bold mb-0">
              <button
                type="button"
                onClick={onOpen}
                aria-label={`Open ${company.name} company profile`}
                className="text-left font-bold hover:underline focus:outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                style={{ color: pending ? 'var(--text-default)' : 'var(--text-strong)' }}
              >
                {company.name}
              </button>
            </h3>
            <p className="m-0! text-sm" style={{ color: pending ? 'var(--text-subtle)' : 'var(--text-default)' }}>{company.industry}</p>
          </div>
        </div>
        <span className="phx-tag shrink-0 relative z-10">
          {(suggestion || company.source === 'agent') && <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />}
          {suggestion ? 'Recommendation' : SOURCE_LABEL[company.source]}
        </span>
      </div>

      <p className="m-0! text-sm" style={{ color: pending ? 'var(--text-default)' : 'var(--text-strong)' }}>
        <span className="font-semibold">Why it fits: </span>
        {company.matchReason}
      </p>

      <div
        className="grid grid-cols-3 gap-3 rounded-xl p-3 text-center"
        style={{ background: pending ? 'var(--bg-default)' : 'var(--bg-neutral-soft)' }}
      >
        <div>
          <div className="text-lg font-bold" style={{ color: pending ? 'var(--text-default)' : 'var(--text-strong)' }}>{company.relevantCandidatesCount}</div>
          <div className="text-sm text-(--text-subtle)">Relevant executives</div>
        </div>
        <div>
          <div className="text-lg font-bold" style={{ color: pending ? 'var(--text-default)' : 'var(--text-strong)' }}>{company.activeLeadershipChanges}</div>
          <div className="text-sm text-(--text-subtle)">Leadership changes</div>
        </div>
        <div>
          <div className="text-lg font-bold" style={{ color: pending ? 'var(--text-default)' : 'var(--text-strong)' }}>{company.activeSearchesCount}</div>
          <div className="text-sm text-(--text-subtle)">Open searches</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-(--text-subtle)">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="w-4 h-4" aria-hidden="true" /> {company.headquarters}
        </span>
        <span>{company.size}</span>
        {company.stage && <span>{company.stage}</span>}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        {company.website ? (
          <a
            href={`https://${company.website.replace(/^https?:\/\//, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 text-sm text-(--text-default) hover:underline inline-flex items-center gap-1.5"
          >
            {company.website} <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm text-(--text-subtle)">
            <Users className="w-4 h-4" aria-hidden="true" /> No website listed
          </span>
        )}
        {suggestion ? (
          <button
            type="button"
            className="phx-btn relative z-10"
            data-variant="secondary"
            data-size="sm"
            onClick={onAdd}
            aria-label={`Add ${company.name} to target companies`}
          >
            <Plus className="w-4 h-4" aria-hidden="true" /> Add
          </button>
        ) : (
          <button
            type="button"
            className="phx-btn relative z-10"
            data-variant="secondary"
            data-size="sm"
            onClick={onRemove}
            aria-label={`Remove ${company.name} from this project`}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" /> Remove
          </button>
        )}
      </div>
    </li>
  );
}

export function ProjectTargetCompaniesTab({ project, onCountChange }: ProjectTargetCompaniesTabProps) {
  const router = useRouter();
  const { restrictedCompanies } = useRestricted();
  const [companies, setCompanies] = useState<TargetCompany[]>(() => getProjectTargetCompanies(project));
  const [view, setView] = useState<CompanyView>('list');
  const [showAdd, setShowAdd] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [notice, setNotice] = useState<{ message: string; undo?: () => void } | null>(null);

  const isRestricted = (name: string) =>
    restrictedCompanies.some(r => r.name.trim().toLowerCase() === name.trim().toLowerCase());

  const added = useMemo(() => companies.filter(c => !isRestricted(c.name)), [companies, restrictedCompanies]);

  const recommendations = useMemo(
    () => recommendCompaniesForProject(project, companies.map(c => c.name)).filter(c => !isRestricted(c.name)),
    [project, companies, restrictedCompanies]
  );

  const commit = (next: TargetCompany[]) => {
    setCompanies(next);
    saveProjectTargetCompanies(project.id, next);
  };

  useEffect(() => {
    onCountChange?.(added.length);
  }, [added.length]);

  const flash = (message: string, undo?: () => void) => {
    setNotice({ message, undo });
    window.setTimeout(() => setNotice(n => (n?.message === message ? null : n)), 6000);
  };

  const add = (incoming: TargetCompany[]) => {
    const have = new Set(companies.map(c => c.name.toLowerCase()));
    const fresh = incoming.filter(c => !have.has(c.name.toLowerCase()));
    if (fresh.length === 0) return;
    commit([...fresh, ...companies]);
    flash(fresh.length === 1 ? `Added ${fresh[0].name} to this project.` : `Added ${fresh.length} companies to this project.`);
  };

  const addRecommendation = (c: TargetCompany) => add([{ ...c, source: 'agent' }]);

  const remove = (c: TargetCompany) => {
    const before = companies;
    commit(companies.filter(x => x.id !== c.id));
    flash(`Removed ${c.name} from this project.`, () => {
      commit(before);
      setNotice(null);
    });
  };

  const openProfile = (c: TargetCompany) => router.navigateToView('companies', { companyId: c.id });

  const fileSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'target-companies';

  const exportCompanies = ({ format, name, clientLogo, companyLogo }: TargetCompaniesExportChoices) => {
    if (format === 'csv') {
      downloadBlob(buildTargetCompaniesCsv(added), `${fileSlug(`${project.title} target companies`)}.csv`);
    } else {
      downloadBlob(
        buildTargetCompaniesPdf(added, { title: name, projectTitle: project.title, clientLogo, companyLogo }),
        `${fileSlug(name)}.pdf`
      );
    }
    flash(`Exported ${added.length} ${added.length === 1 ? 'company' : 'companies'} as ${format.toUpperCase()}.`);
  };

  const p = project.parameters;
  const criteria = [p?.primaryTitle || project.title, p?.roleLevel, p?.functionalDomain?.split(',')[0], p?.targetCompanyStage].filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-20">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-(--text-strong)">Target Companies</h2>
          <p className="text-base text-(--text-default) mt-1 max-w-3xl">
            Companies on this search. Recommendations stay on the list until you add them, and they are not part of the search until then.
          </p>
          {criteria.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-sm font-semibold text-(--text-default)">Matched to</span>
              {criteria.map(c => (
                <span key={c} className="phx-tag">{c}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="phx-btn"
            data-variant="secondary"
            data-size="sm"
            onClick={() => setShowExport(true)}
            disabled={added.length === 0}
          >
            <Download className="w-4 h-4" aria-hidden="true" /> Export
          </button>
          <button type="button" className="phx-btn" data-variant="primary" data-size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" aria-hidden="true" /> Add company
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div role="tablist" aria-label="Target company views">
          <button
            type="button"
            role="tab"
            id="target-companies-list-tab"
            aria-selected={view === 'list'}
            aria-controls="target-companies-panel"
            onClick={() => setView('list')}
          >
            Target companies
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-(--bg-neutral-soft) text-(--text-default) border border-(--border-light)">{added.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            id="target-companies-recommendations-tab"
            aria-selected={view === 'recommendations'}
            aria-controls="target-companies-panel"
            onClick={() => setView('recommendations')}
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Recommendations
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-(--bg-neutral-soft) text-(--text-default) border border-(--border-light)">{recommendations.length}</span>
          </button>
        </div>
        {view === 'recommendations' && recommendations.length > 0 && (
          <button
            type="button"
            className="phx-btn mb-2"
            data-variant="secondary"
            data-size="sm"
            onClick={() => add(recommendations.map(c => ({ ...c, source: 'agent' as const })))}
          >
            <Plus className="w-4 h-4" aria-hidden="true" /> Add all
          </button>
        )}
      </div>

      {notice && (
        <div className="phx-feedback flex items-center justify-between gap-3" data-tone="success" role="status">
          <span>{notice.message}</span>
          {notice.undo && (
            <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" onClick={notice.undo}>
              Undo
            </button>
          )}
        </div>
      )}

      <div role="tabpanel" id="target-companies-panel" aria-labelledby={view === 'list' ? 'target-companies-list-tab' : 'target-companies-recommendations-tab'}>
        {view === 'list' && added.length === 0 && recommendations.length === 0 && (
          <div className="rounded-2xl border border-(--border-light) bg-(--bg-default) p-10 text-center">
            <Building2 className="w-8 h-8 text-(--text-subtle) mx-auto mb-3" aria-hidden="true" />
            <p className="text-base font-bold text-(--text-strong)">No target companies yet</p>
            <p className="text-sm text-(--text-default) mt-1">Add companies you track, create a new one, or describe what you want and let the agent find them.</p>
            <button type="button" className="phx-btn mt-4" data-variant="primary" data-size="sm" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4" aria-hidden="true" /> Add company
            </button>
          </div>
        )}

        {view === 'list' && (added.length > 0 || recommendations.length > 0) && (
          <div className="flex flex-col gap-4">
            {added.length === 0 && (
              <p className="phx-feedback m-0!" data-tone="info">
                No companies added yet. Recommendations appear below until you add them.
              </p>
            )}
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {added.map(c => (
                <CompanyCard key={c.id} company={c} tone="added" onOpen={() => openProfile(c)} onRemove={() => remove(c)} />
              ))}
              {recommendations.map(c => (
                <CompanyCard key={c.id} company={c} tone="pending" onOpen={() => openProfile(c)} onAdd={() => addRecommendation(c)} />
              ))}
            </ul>
          </div>
        )}

        {view === 'recommendations' && recommendations.length === 0 && (
          <div className="rounded-2xl border border-(--border-light) bg-(--bg-default) p-10 text-center">
            <Sparkles className="w-8 h-8 text-(--text-subtle) mx-auto mb-3" aria-hidden="true" />
            <p className="text-base font-bold text-(--text-strong)">No recommendations left</p>
            <p className="text-sm text-(--text-default) mt-1">Every company the agent matched is already on your target list.</p>
          </div>
        )}

        {view === 'recommendations' && recommendations.length > 0 && (
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recommendations.map(c => (
              <CompanyCard key={`rec-${c.id}`} company={c} tone="review" onOpen={() => openProfile(c)} onAdd={() => addRecommendation(c)} />
            ))}
          </ul>
        )}
      </div>

      <ExportTargetCompaniesModal
        isOpen={showExport}
        onOpenChange={setShowExport}
        defaultName={`${project.title}: Target Companies`}
        companyCount={added.length}
        onExport={exportCompanies}
      />

      <AddTargetCompanyModal
        isOpen={showAdd}
        onOpenChange={setShowAdd}
        projectCompanyNames={companies.map(c => c.name)}
        onAdd={add}
      />
    </div>
  );
}
