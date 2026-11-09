import { mockCandidates } from './mockData';
import type { Candidate } from '../types';

/**
 * Profile changes the agent found for people already in the CRM. Each one carries the field,
 * its current value and the proposed value, so a recruiter can review it before it is written.
 */
export type ProfileField = 'role' | 'location' | 'currentCompensation' | 'mobilityIndicator' | 'noticePeriod';

export interface ProfileFieldChange {
  field: ProfileField;
  label: string;
  before: string;
  after: string;
}

export interface ProfileUpdate {
  id: string;
  candidateId: string;
  /** What the agent found, in one sentence */
  statement: string;
  source: string;
  detectedOn: string;
  changes: ProfileFieldChange[];
}

export const initialProfileUpdates: ProfileUpdate[] = [
  {
    id: 'pu-1',
    candidateId: 'c-2',
    statement: 'Relocation and a leadership reshuffle point to a likelier move.',
    source: 'Event Registry and public profile',
    detectedOn: 'Nov 8, 2026',
    changes: [
      { field: 'location', label: 'Location', before: 'Menlo Park, California, United States', after: 'New York, New York, United States' },
      { field: 'mobilityIndicator', label: 'Mobility indicator', before: 'Medium', after: 'High' },
    ],
  },
  {
    id: 'pu-2',
    candidateId: 'e-2',
    statement: 'A new proxy filing shows a larger pay package and a looser retention hold.',
    source: 'SEC proxy filing',
    detectedOn: 'Nov 7, 2026',
    changes: [
      { field: 'currentCompensation', label: 'Current compensation', before: '$12M', after: '$13.4M' },
      { field: 'mobilityIndicator', label: 'Mobility indicator', before: 'Low', after: 'Medium' },
    ],
  },
  {
    id: 'pu-3',
    candidateId: 'e-3',
    statement: 'An announced title change widens the scope of the role.',
    source: 'Company press release',
    detectedOn: 'Nov 6, 2026',
    changes: [
      { field: 'role', label: 'Current role', before: 'EVP, Operations', after: 'EVP, Operations & Supply Chain' },
      { field: 'noticePeriod', label: 'Notice period', before: '6 months', after: '3 months' },
    ],
  },
  {
    id: 'pu-4',
    candidateId: 'e-4',
    statement: 'Public records show a new title and a different office.',
    source: 'Public profile and company directory',
    detectedOn: 'Nov 5, 2026',
    changes: [
      { field: 'role', label: 'Current role', before: 'EVP, General Counsel', after: 'EVP, General Counsel & Corporate Secretary' },
      { field: 'location', label: 'Location', before: 'Santa Clara, CA', after: 'San Jose, CA' },
    ],
  },
  {
    id: 'pu-5',
    candidateId: 'c-1',
    statement: 'A refreshed grant and a shorter notice window appeared in recent filings.',
    source: 'SEC Form 4',
    detectedOn: 'Nov 4, 2026',
    changes: [
      { field: 'currentCompensation', label: 'Current compensation', before: '$15.5M', after: '$17.2M' },
      { field: 'noticePeriod', label: 'Notice period', before: '12 months', after: '9 months' },
    ],
  },
];

/** Session state that outlives the widget: which updates were written, and the auto-update choice. */
const applied = new Set<string>();
let autoUpdate = false;

export const isProfileUpdateApplied = (id: string) => applied.has(id);
export const getAutoUpdate = () => autoUpdate;
export const setAutoUpdate = (on: boolean) => {
  autoUpdate = on;
};

function writeField(c: Candidate, change: ProfileFieldChange) {
  switch (change.field) {
    case 'role':
      c.role = change.after;
      break;
    case 'location':
      c.location = change.after;
      break;
    case 'currentCompensation':
      if (c.executiveData) c.executiveData.currentCompensation = change.after;
      break;
    case 'mobilityIndicator':
      if (c.executiveData) c.executiveData.mobilityIndicator = change.after;
      break;
    case 'noticePeriod':
      if (c.executiveData) c.executiveData.noticePeriod = change.after;
      break;
  }
}

/** Write an update to the candidate's profile so the Candidates screen shows the new values. */
export function applyProfileUpdate(update: ProfileUpdate) {
  if (applied.has(update.id)) return;
  const candidate = mockCandidates.find(c => c.id === update.candidateId);
  if (candidate) update.changes.forEach(ch => writeField(candidate, ch));
  applied.add(update.id);
}
