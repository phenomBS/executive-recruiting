import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Download, ExternalLink, MapPin, Plus, Sparkles, Trash2, Users } from 'lucide-react';
import type { Project } from '../../types';
import { useRouter } from '../../context/RouterContext';
import { useRestricted } from '../../context/RestrictedContext';
import {
  TargetCompany,
  getProjectTargetCompanies,
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

export function ProjectTargetCompaniesTab({ project, onCountChange }: ProjectTargetCompaniesTabProps) {
  const router = useRouter();
  const { restrictedCompanies } = useRestricted();
  const [companies, setCompanies] = useState<TargetCompany[]>(() => getProjectTargetCompanies(project));
  const [showAdd, setShowAdd] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [notice, setNotice] = useState<{ message: string; undo?: () => void } | null>(null);

  const visible = useMemo(
    () => companies.filter(c => !restrictedCompanies.some(r => r.name.trim().toLowerCase() === c.name.trim().toLowerCase())),
    [companies, restrictedCompanies]
  );

  const commit = (next: TargetCompany[]) => {
    setCompanies(next);
    saveProjectTargetCompanies(project.id, next);
  };

  useEffect(() => {
    onCountChange?.(visible.length);
  }, [visible.length]);

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
      downloadBlob(buildTargetCompaniesCsv(visible), `${fileSlug(`${project.title} target companies`)}.csv`);
    } else {
      downloadBlob(
        buildTargetCompaniesPdf(visible, { title: name, projectTitle: project.title, clientLogo, companyLogo }),
        `${fileSlug(name)}.pdf`
      );
    }
    flash(`Exported ${visible.length} ${visible.length === 1 ? 'company' : 'companies'} as ${format.toUpperCase()}.`);
  };

  const p = project.parameters;
  const criteria = [p?.primaryTitle || project.title, p?.roleLevel, p?.functionalDomain?.split(',')[0], p?.targetCompanyStage].filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-20">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-(--text-strong)">Target Companies</h2>
          <p className="text-base text-(--text-default) mt-1 max-w-3xl">
            Companies that fit this project&apos;s details. The agent matched these to the search, and you can add or remove any of them.
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
            disabled={visible.length === 0}
          >
            <Download className="w-4 h-4" aria-hidden="true" /> Export
          </button>
          <button type="button" className="phx-btn" data-variant="primary" data-size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" aria-hidden="true" /> Add company
          </button>
        </div>
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

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-(--border-light) bg-white p-10 text-center">
          <Building2 className="w-8 h-8 text-(--text-subtle) mx-auto mb-3" aria-hidden="true" />
          <p className="text-base font-bold text-(--text-strong)">No target companies yet</p>
          <p className="text-sm text-(--text-default) mt-1">Add companies you track, create a new one, or describe what you want and let the agent find them.</p>
          <button type="button" className="phx-btn mt-4" data-variant="primary" data-size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" aria-hidden="true" /> Add company
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.map(c => (
            <li
              key={c.id}
              className="relative rounded-2xl border border-(--border-light) bg-white p-5 flex flex-col gap-4 cursor-pointer transition-colors hover:border-(--color-secondary-100) hover:bg-(--bg-neutral-soft) focus-within:outline-2 focus-within:outline-offset-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-(--bg-neutral-soft) text-(--text-strong) font-bold flex items-center justify-center text-base shrink-0" aria-hidden="true">
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-(--text-strong) mb-0 leading-tight">
                      {/* The ::after layer stretches this button over the whole card so the card opens the profile */}
                      <button
                        type="button"
                        onClick={() => openProfile(c)}
                        aria-label={`Open ${c.name} company profile`}
                        className="text-left font-bold hover:underline focus:outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                      >
                        {c.name}
                      </button>
                    </h3>
                    <p className="text-sm text-(--text-default)">{c.industry}</p>
                  </div>
                </div>
                <span className="phx-tag shrink-0">
                  {c.source === 'agent' && <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />}
                  {SOURCE_LABEL[c.source]}
                </span>
              </div>

              <p className="text-base text-(--text-strong)">
                <span className="font-semibold">Why it fits: </span>
                {c.matchReason}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-(--text-default)">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" aria-hidden="true" /> {c.headquarters}
                </span>
                <span>{c.size}</span>
                {c.stage && <span>{c.stage}</span>}
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-xl bg-(--bg-neutral-soft) p-3 text-center">
                <div>
                  <div className="text-lg font-bold text-(--text-strong)">{c.relevantCandidatesCount}</div>
                  <div className="text-sm text-(--text-default)">Relevant executives</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-(--text-strong)">{c.activeLeadershipChanges}</div>
                  <div className="text-sm text-(--text-default)">Leadership changes</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-(--text-strong)">{c.activeSearchesCount}</div>
                  <div className="text-sm text-(--text-default)">Open searches</div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                {c.website ? (
                  <a
                    href={`https://${c.website.replace(/^https?:\/\//, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 text-sm text-(--text-default) hover:text-(--color-secondary-200) inline-flex items-center gap-1.5"
                  >
                    {c.website} <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm text-(--text-default)">
                    <Users className="w-4 h-4" aria-hidden="true" /> No website listed
                  </span>
                )}
                <button
                  type="button"
                  className="phx-btn relative z-10"
                  data-variant="secondary"
                  data-size="sm"
                  onClick={() => remove(c)}
                  aria-label={`Remove ${c.name} from this project`}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ExportTargetCompaniesModal
        isOpen={showExport}
        onOpenChange={setShowExport}
        defaultName={`${project.title}: Target Companies`}
        companyCount={visible.length}
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
