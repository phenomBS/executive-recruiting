import type { TargetCompany } from '../data/projectTargetCompanies';

const SOURCE: Record<TargetCompany['source'], string> = {
  agent: 'Agent match',
  added: 'Added by recruiter',
  created: 'Created by recruiter',
};

const cell = (v: string | number | undefined) => {
  const s = String(v ?? '');
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** A spreadsheet-ready list of a project's target companies. */
export function buildTargetCompaniesCsv(companies: TargetCompany[]): Blob {
  const header = [
    'Company',
    'Industry',
    'Headquarters',
    'Company size',
    'Revenue',
    'Stage',
    'Website',
    'Relevant executives',
    'Leadership changes',
    'Open searches',
    'Source',
    'Why it fits',
  ];
  const rows = companies.map(c => [
    c.name,
    c.industry,
    c.headquarters,
    c.size,
    c.revenue,
    c.stage,
    c.website,
    c.relevantCandidatesCount,
    c.activeLeadershipChanges,
    c.activeSearchesCount,
    SOURCE[c.source],
    c.matchReason,
  ]);
  const body = [header, ...rows].map(r => r.map(cell).join(',')).join('\r\n');
  // The byte order mark lets Excel read accented characters correctly.
  return new Blob([`\ufeff${body}\r\n`], { type: 'text/csv;charset=utf-8' });
}
