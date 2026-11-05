/**
 * Project lifecycle statuses.
 *
 * `Active` is the stored value for an open project (shown to users as "Open"); `In Progress`
 * is a live project that has moved past intake; anything else (Closed, Filled, On Hold…) is closed.
 */
export type ProjectLifecycle = 'open' | 'in-progress' | 'closed';

export const PROJECT_STATUS_OPEN = 'Active';
export const PROJECT_STATUS_IN_PROGRESS = 'In Progress';
export const PROJECT_STATUS_CLOSED = 'Closed';

export function getProjectLifecycle(status: string | undefined): ProjectLifecycle {
  const s = (status ?? PROJECT_STATUS_OPEN).trim().toLowerCase();
  if (s === 'active' || s === 'open') return 'open';
  if (s === 'in progress' || s === 'in-progress') return 'in-progress';
  return 'closed';
}

export const isProjectOpen = (status: string | undefined) => getProjectLifecycle(status) === 'open';
export const isProjectLive = (status: string | undefined) => getProjectLifecycle(status) !== 'closed';

export function projectStatusLabel(status: string | undefined): string {
  const lifecycle = getProjectLifecycle(status);
  if (lifecycle === 'open') return 'Open';
  if (lifecycle === 'in-progress') return 'In Progress';
  return status && status.trim() ? status : 'Closed';
}
