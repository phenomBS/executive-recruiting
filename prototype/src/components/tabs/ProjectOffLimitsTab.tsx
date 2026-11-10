import React, { useEffect, useMemo, useState } from 'react';
import { Plus, ShieldAlert, Trash2 } from 'lucide-react';
import type { Project } from '../../types';
import { useRestricted } from '../../context/RestrictedContext';
import { getOffLimitsRows } from '../../data/projectOffLimits';
import { AddOffLimitsCompanyModal } from './AddOffLimitsCompanyModal';

interface ProjectOffLimitsTabProps {
  project: Project;
  /** Lets the page header keep its count in step with this list */
  onCountChange?: (count: number) => void;
}

const formatDate = (iso?: string) => {
  if (!iso) return 'Not recorded';
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export function ProjectOffLimitsTab({ project, onCountChange }: ProjectOffLimitsTabProps) {
  const { restrictedCompanies, addRestrictedCompany, removeRestrictedCompany } = useRestricted();
  const [showAdd, setShowAdd] = useState(false);
  const [notice, setNotice] = useState<{ message: string; undo?: () => void } | null>(null);

  const rows = useMemo(() => getOffLimitsRows(project, restrictedCompanies), [project, restrictedCompanies]);

  useEffect(() => {
    onCountChange?.(rows.length);
  }, [rows.length]);

  const flash = (message: string, undo?: () => void) => {
    setNotice({ message, undo });
    window.setTimeout(() => setNotice(n => (n?.message === message ? null : n)), 6000);
  };

  const add = (name: string, reason: string) => {
    addRestrictedCompany({ name, reason, dateAdded: new Date().toISOString().split('T')[0] });
    flash(`${name} is now off-limits.`);
  };

  const remove = (name: string) => {
    const entry = restrictedCompanies.find(c => c.name === name);
    removeRestrictedCompany(name);
    flash(
      `Removed ${name} from the off-limits list.`,
      entry
        ? () => {
            addRestrictedCompany(entry);
            setNotice(null);
          }
        : undefined
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-20">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-(--text-strong)">Off-Limits Companies</h2>
          <p className="text-base text-(--text-default) mt-1 max-w-3xl">
            Companies this search cannot recruit from because of client, non-compete or non-solicit agreements. They never appear in target companies, the pipeline or the search book.
          </p>
        </div>
        <button type="button" className="phx-btn shrink-0" data-variant="primary" data-size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" aria-hidden="true" /> Add company
        </button>
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

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-(--border-light) bg-white p-10 text-center">
          <ShieldAlert className="w-8 h-8 text-(--text-subtle) mx-auto mb-3" aria-hidden="true" />
          <p className="text-base font-bold text-(--text-strong)">No off-limits companies</p>
          <p className="text-sm text-(--text-default) mt-1">Add a company when an agreement keeps you from recruiting there.</p>
          <button type="button" className="phx-btn mt-4" data-variant="primary" data-size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" aria-hidden="true" /> Add company
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-(--border-light) bg-white overflow-hidden">
          <table className="phx-table w-full">
            <caption className="sr-only">Off-limits companies for {project.title}</caption>
            <thead>
              <tr>
                <th scope="col">Company</th>
                <th scope="col">Reason</th>
                <th scope="col">Applies to</th>
                <th scope="col">Date added</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.name}>
                  <th scope="row" className="text-left">
                    <span className="inline-flex items-center gap-2 font-bold text-(--text-strong)">
                      <ShieldAlert className="w-4 h-4" style={{ color: 'var(--feedback-error-text-strong)' }} aria-hidden="true" />
                      {r.name}
                    </span>
                  </th>
                  <td>{r.reason}</td>
                  <td>
                    <span className="phx-tag">{r.scope === 'firm' ? 'All searches' : 'This search'}</span>
                    {r.scope === 'search' && <span className="block text-sm text-(--text-subtle) mt-1">{r.source}</span>}
                  </td>
                  <td>{formatDate(r.dateAdded)}</td>
                  <td className="text-right">
                    {r.scope === 'firm' ? (
                      <button
                        type="button"
                        className="phx-btn"
                        data-variant="secondary"
                        data-size="sm"
                        onClick={() => remove(r.name)}
                        aria-label={`Remove ${r.name} from the off-limits list`}
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" /> Remove
                      </button>
                    ) : (
                      <span className="text-sm text-(--text-subtle)">Set by search agreement</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddOffLimitsCompanyModal
        isOpen={showAdd}
        onOpenChange={setShowAdd}
        existingNames={rows.map(r => r.name)}
        onAdd={add}
      />
    </div>
  );
}
