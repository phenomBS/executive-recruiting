import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { View } from '../components/Sidebar';

export interface RouteState {
  view: View;
  candidateId: string | null;
  projectId: string | null;
  companyId: string | null;
  roleId: string | null;
  dealRoomId: string | null;
  activeTab: string | null;
  agentTab: string | null;
  fullPath: string;
}

export interface RouterContextType extends RouteState {
  navigate: (path: string, options?: { replace?: boolean }) => void;
  navigateToView: (
    view: View, 
    params?: { 
      candidateId?: string | null; 
      projectId?: string | null; 
      companyId?: string | null; 
      roleId?: string | null; 
      roomId?: string | null; 
      dealRoomId?: string | null;
      tab?: string | null; 
      agentTab?: string | null;
    }, 
    options?: { replace?: boolean }
  ) => void;
  setCandidateId: (id: string | null, tab?: string | null) => void;
  setProjectId: (id: string | null, tab?: string | null) => void;
  setCompanyId: (id: string | null, tab?: string | null) => void;
  setRoleId: (id: string | null) => void;
  setDealRoomId: (id: string | null) => void;
  setTab: (tab: string | null) => void;
  setAgentTab: (agentTab: string | null) => void;
  copyCurrentUrl: () => Promise<boolean>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

/** Vite BASE_URL (e.g. `/executive-recruiting/` on GitHub Pages, `/` locally). */
function viteBaseNoSlash(): string {
  const base = import.meta.env.BASE_URL || '/';
  if (!base || base === '/') return '';
  return base.replace(/\/$/, '');
}

/** Strip deploy base so path parsing stays app-relative (`/candidates/...`). */
export function stripBasePath(pathname: string): string {
  const baseNoSlash = viteBaseNoSlash();
  if (baseNoSlash && (pathname === baseNoSlash || pathname.startsWith(`${baseNoSlash}/`))) {
    const rest = pathname.slice(baseNoSlash.length) || '/';
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return pathname;
}

/** Prefix deploy base for history / share URLs. Idempotent if base already present. */
export function withBasePath(path: string): string {
  const baseNoSlash = viteBaseNoSlash();
  const match = path.match(/^([^?#]*)(.*)$/);
  const pathname = match?.[1] || '/';
  const suffix = match?.[2] || '';

  if (!baseNoSlash) return path;
  if (pathname === baseNoSlash || pathname.startsWith(`${baseNoSlash}/`)) {
    return path;
  }
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${baseNoSlash}${normalized}${suffix}`;
}

function parseLocation(pathname: string, search: string, hash: string): RouteState {
  // If hash routing is used (e.g. #/candidates/c-1 or #/projects/p-1), parse hash
  let cleanPath = stripBasePath(pathname);
  let searchStr = search;

  if (hash && hash.startsWith('#/')) {
    const hashWithoutHash = hash.slice(1); // e.g. /candidates/c-1?tab=eval
    const hashParts = hashWithoutHash.split('?');
    cleanPath = hashParts[0] || '/';
    if (hashParts[1]) {
      searchStr = '?' + hashParts[1];
    }
  }

  const searchParams = new URLSearchParams(searchStr);

  // Normalize path segments: remove trailing slash and split
  const trimmed = cleanPath.replace(/^\/+|\/+$/g, '');
  const segments = trimmed ? trimmed.split('/') : [];

  let view: View = 'home';
  let candidateId: string | null = searchParams.get('candidateId');
  let projectId: string | null = searchParams.get('projectId');
  let companyId: string | null = searchParams.get('companyId');
  let roleId: string | null = searchParams.get('roleId');
  let dealRoomId: string | null = searchParams.get('roomId') || searchParams.get('dealRoomId');
  let activeTab: string | null = searchParams.get('tab');
  let agentTab: string | null = searchParams.get('agentTab');

  // Query parameter view override if present
  const queryView = searchParams.get('view') as View | null;
  if (queryView) {
    view = queryView;
  }

  // Parse path-based routes:
  // /candidates or /candidates/:id
  // /projects or /projects/:id
  // /companies or /companies/:id
  // /roles or /roles/:id
  // /dealrooms or /opportunity-rooms or /opportunity-rooms/:id or /dealrooms/:id
  // /agents or /agents/:agentTab
  // /overview or /home or /
  if (segments.length > 0) {
    const rootSegment = segments[0].toLowerCase();

    switch (rootSegment) {
      case 'candidates':
      case 'candidate':
        view = 'candidates';
        if (segments[1]) {
          candidateId = decodeURIComponent(segments[1]);
        }
        if (segments[2]) {
          activeTab = decodeURIComponent(segments[2]);
        }
        break;

      case 'projects':
      case 'project':
        view = 'projects';
        if (segments[1]) {
          projectId = decodeURIComponent(segments[1]);
        }
        if (segments[2]) {
          activeTab = decodeURIComponent(segments[2]);
        }
        break;

      case 'companies':
      case 'company':
        view = 'companies';
        if (segments[1]) {
          companyId = decodeURIComponent(segments[1]);
        }
        if (segments[2]) {
          activeTab = decodeURIComponent(segments[2]);
        }
        break;

      case 'roles':
      case 'role':
        view = 'roles';
        if (segments[1]) {
          roleId = decodeURIComponent(segments[1]);
        }
        break;

      case 'jobs':
      case 'job':
        view = 'jobs';
        if (segments[1]) {
          roleId = decodeURIComponent(segments[1]);
        }
        break;

      case 'dealrooms':
      case 'dealroom':
      case 'opportunity-rooms':
      case 'opportunity-room':
        view = 'dealrooms';
        if (segments[1]) {
          dealRoomId = decodeURIComponent(segments[1]);
        }
        break;

      case 'agents':
      case 'agent':
        view = 'agents';
        if (segments[1]) {
          agentTab = decodeURIComponent(segments[1]);
        }
        break;

      case 'analytics':
        view = 'analytics';
        break;

      case 'workspace':
      case 'overview':
      case 'home':
        view = 'home';
        break;

      default:
        // Default to home if unknown root segment
        view = 'home';
        break;
    }
  }

  const fullPath = window.location.pathname + window.location.search + window.location.hash;

  return {
    view,
    candidateId,
    projectId,
    companyId,
    roleId,
    dealRoomId,
    activeTab,
    agentTab,
    fullPath,
  };
}

export function buildUrlForView(
  view: View,
  params?: {
    candidateId?: string | null;
    projectId?: string | null;
    companyId?: string | null;
    roleId?: string | null;
    roomId?: string | null;
    dealRoomId?: string | null;
    tab?: string | null;
    agentTab?: string | null;
  }
): string {
  switch (view) {
    case 'home':
      return '/';

    case 'candidates': {
      if (params?.candidateId) {
        const tabQuery = params.tab ? `?tab=${encodeURIComponent(params.tab)}` : '';
        return `/candidates/${encodeURIComponent(params.candidateId)}${tabQuery}`;
      }
      return '/candidates';
    }

    case 'projects': {
      if (params?.projectId) {
        const tabQuery = params.tab ? `?tab=${encodeURIComponent(params.tab)}` : '';
        return `/projects/${encodeURIComponent(params.projectId)}${tabQuery}`;
      }
      return '/projects';
    }

    case 'companies': {
      if (params?.companyId) {
        const tabQuery = params.tab ? `?tab=${encodeURIComponent(params.tab)}` : '';
        return `/companies/${encodeURIComponent(params.companyId)}${tabQuery}`;
      }
      return '/companies';
    }

    case 'roles': {
      if (params?.roleId) {
        return `/roles/${encodeURIComponent(params.roleId)}`;
      }
      return '/roles';
    }

    case 'jobs': {
      if (params?.roleId) {
        return `/jobs/${encodeURIComponent(params.roleId)}`;
      }
      return '/jobs';
    }

    case 'dealrooms': {
      const targetRoomId = params?.roomId || params?.dealRoomId;
      if (targetRoomId) {
        const tabQuery = params?.tab ? `?tab=${encodeURIComponent(params.tab)}` : '';
        return `/opportunity-rooms/${encodeURIComponent(targetRoomId)}${tabQuery}`;
      }
      return '/opportunity-rooms';
    }

    case 'analytics':
      return '/analytics';

    case 'agents': {
      if (params?.agentTab && params.agentTab !== 'all') {
        return `/agents/${encodeURIComponent(params.agentTab)}`;
      }
      return '/agents';
    }

    default:
      return '/';
  }
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [routeState, setRouteState] = useState<RouteState>(() => {
    return parseLocation(window.location.pathname, window.location.search, window.location.hash);
  });

  // Listen to browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      setRouteState(parseLocation(window.location.pathname, window.location.search, window.location.hash));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string, options?: { replace?: boolean }) => {
    const resolved = withBasePath(path);
    if (options?.replace) {
      window.history.replaceState(null, '', resolved);
    } else {
      window.history.pushState(null, '', resolved);
    }
    setRouteState(parseLocation(window.location.pathname, window.location.search, window.location.hash));
  }, []);

  const navigateToView = useCallback(
    (
      view: View,
      params?: {
        candidateId?: string | null;
        projectId?: string | null;
        companyId?: string | null;
        roleId?: string | null;
        roomId?: string | null;
        dealRoomId?: string | null;
        tab?: string | null;
        agentTab?: string | null;
      },
      options?: { replace?: boolean }
    ) => {
      const url = buildUrlForView(view, params);
      navigate(url, options);
    },
    [navigate]
  );

  const setCandidateId = useCallback(
    (id: string | null, tab?: string | null) => {
      navigateToView('candidates', { candidateId: id, tab });
    },
    [navigateToView]
  );

  const setProjectId = useCallback(
    (id: string | null, tab?: string | null) => {
      navigateToView('projects', { projectId: id, tab });
    },
    [navigateToView]
  );

  const setCompanyId = useCallback(
    (id: string | null, tab?: string | null) => {
      navigateToView('companies', { companyId: id, tab });
    },
    [navigateToView]
  );

  const setRoleId = useCallback(
    (id: string | null) => {
      navigateToView('roles', { roleId: id });
    },
    [navigateToView]
  );

  const setDealRoomId = useCallback(
    (id: string | null) => {
      navigateToView('dealrooms', { roomId: id });
    },
    [navigateToView]
  );

  const setTab = useCallback(
    (tab: string | null) => {
      // Keep current path, update or remove ?tab parameter
      const url = new URL(window.location.href);
      if (tab) {
        url.searchParams.set('tab', tab);
      } else {
        url.searchParams.delete('tab');
      }
      const newPath = url.pathname + url.search + url.hash;
      navigate(newPath, { replace: true });
    },
    [navigate]
  );

  const setAgentTab = useCallback(
    (agentTab: string | null) => {
      navigateToView('agents', { agentTab });
    },
    [navigateToView]
  );

  const copyCurrentUrl = useCallback(async (): Promise<boolean> => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      ...routeState,
      navigate,
      navigateToView,
      setCandidateId,
      setProjectId,
      setCompanyId,
      setRoleId,
      setDealRoomId,
      setTab,
      setAgentTab,
      copyCurrentUrl,
    }),
    [
      routeState,
      navigate,
      navigateToView,
      setCandidateId,
      setProjectId,
      setCompanyId,
      setRoleId,
      setDealRoomId,
      setTab,
      setAgentTab,
      copyCurrentUrl,
    ]
  );

  return <RouterContext.Provider value={contextValue}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
