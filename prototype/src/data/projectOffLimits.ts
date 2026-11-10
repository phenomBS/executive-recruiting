import type { Project } from '../types';
import type { RestrictedCompany } from '../context/RestrictedContext';
import { getMarketMapForProject } from './projectMarketMapData';

/** A company this search cannot recruit from, and why. */
export interface OffLimitsRow {
  name: string;
  reason: string;
  /** firm: on the firm-wide list and removable here. search: set by this search's agreements. */
  scope: 'firm' | 'search';
  /** ISO date, for firm-wide entries */
  dateAdded?: string;
  /** Short label for where the restriction comes from */
  source: string;
}

const norm = (s: string) => s.trim().toLowerCase();

/** Off-limits companies for a project: its own restrictions from the market map, plus the firm-wide list. */
export function getOffLimitsRows(project: Project, firmWide: RestrictedCompany[]): OffLimitsRow[] {
  const rows = new Map<string, OffLimitsRow>();

  getMarketMapForProject(project)
    .companies.filter(c => c.poachStatus === 'Restricted (Board)' || c.poachStatus === 'Do Not Poach (Client)')
    .forEach(c =>
      rows.set(norm(c.name), {
        name: c.name,
        reason: c.poachReason || c.poachStatus,
        scope: 'search',
        source: c.poachStatus,
      })
    );

  firmWide.forEach(r => {
    if (!rows.has(norm(r.name))) {
      rows.set(norm(r.name), { name: r.name, reason: r.reason, scope: 'firm', dateAdded: r.dateAdded, source: 'Firm-wide list' });
    }
  });

  return [...rows.values()];
}
