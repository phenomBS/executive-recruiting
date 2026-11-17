/** Where a company profile should return when it was opened from a project. */
export function projectReturn(fullPath: string): { to: string; label: string } | null {
  const query = fullPath.includes('?') ? fullPath.slice(fullPath.indexOf('?') + 1).split('#')[0] : '';
  const params = new URLSearchParams(query);
  const to = params.get('returnTo');
  if (!to || !to.startsWith('/')) return null;
  const label = params.get('returnLabel')?.trim() || 'project';
  return { to, label };
}
