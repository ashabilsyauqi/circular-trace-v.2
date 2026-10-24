export type AppView = 'landing' | 'dashboard' | 'marketplace' | 'transactions' | 'scan';

export interface RouteState {
  view: AppView;
  subRoute?: string;     // e.g. 'dashboard' | 'approvals' | 'directory' | 'logs'
  service?: string;      // e.g. 'petani' | 'pengolah' | 'gudang' | 'roaster' | 'cafe' | 'verifikator' | 'all'
  userId?: string;       // ID of selected user for deep master data inspection
  batchId?: string;      // ID of selected processing batch
  lotId?: string;        // ID of coffee lot for QR scan / modal focus
  cupId?: string;        // ID of cup for QR trace
  rawPath: string;
  searchParams: Record<string, string>;
}

export interface NavigationTarget {
  view?: AppView;
  subRoute?: string;
  service?: string;
  userId?: string | null;
  batchId?: string | null;
  lotId?: string | null;
  cupId?: string | null;
  replace?: boolean;
}

/**
 * Parses the current window location into a strongly-typed RouteState.
 */
export function parseRouteFromLocation(): RouteState {
  if (typeof window === 'undefined') {
    return {
      view: 'landing',
      rawPath: '/',
      searchParams: {},
    };
  }

  const pathname = window.location.pathname.toLowerCase();
  const search = window.location.search;
  const urlParams = new URLSearchParams(search);
  const searchParamsRecord: Record<string, string> = {};
  urlParams.forEach((val, key) => {
    searchParamsRecord[key] = val;
  });

  const queryView = urlParams.get('view')?.toLowerCase();
  const hash = window.location.hash.toLowerCase().replace('#', '');

  const lotId = urlParams.get('lotId') || urlParams.get('scan') || undefined;
  const cupId = urlParams.get('cupId') || undefined;
  const userId = urlParams.get('userId') || undefined;
  const batchId = urlParams.get('batchId') || undefined;
  const tabParam = urlParams.get('tab') || undefined;
  const serviceParam = urlParams.get('service') || undefined;

  // 1. Direct QR Trace / Scan Check
  if (
    pathname.includes('/trace') ||
    pathname.includes('/scan') ||
    (pathname === '/' && (lotId || cupId))
  ) {
    if (lotId || cupId) {
      return {
        view: 'scan',
        lotId,
        cupId,
        rawPath: pathname,
        searchParams: searchParamsRecord,
      };
    }
  }

  // 2. Marketplace Check
  if (
    pathname.includes('/marketplace') ||
    pathname.includes('/katalog') ||
    queryView === 'marketplace' ||
    hash === 'marketplace' ||
    hash === 'katalog'
  ) {
    return {
      view: 'marketplace',
      lotId,
      rawPath: pathname,
      searchParams: searchParamsRecord,
    };
  }

  // 3. Transactions / Ledger Check
  if (
    pathname.includes('/transactions') ||
    pathname.includes('/ledger') ||
    pathname.includes('/buku-besar') ||
    pathname.includes('/history') ||
    queryView === 'transactions' ||
    queryView === 'ledger' ||
    hash === 'transactions' ||
    hash === 'ledger'
  ) {
    return {
      view: 'transactions',
      rawPath: pathname,
      searchParams: searchParamsRecord,
    };
  }

  // 4. Dashboard / Admin Panel Check
  if (
    pathname.includes('/dashboard') ||
    pathname.includes('/admin') ||
    pathname.includes('/panel') ||
    pathname.includes('/login') ||
    queryView === 'dashboard' ||
    queryView === 'panel' ||
    queryView === 'login' ||
    hash === 'dashboard' ||
    hash === 'panel' ||
    userId !== undefined ||
    batchId !== undefined ||
    serviceParam !== undefined
  ) {
    return {
      view: 'dashboard',
      subRoute: tabParam || (serviceParam ? 'directory' : 'dashboard'),
      service: serviceParam,
      userId,
      batchId,
      rawPath: pathname,
      searchParams: searchParamsRecord,
    };
  }

  // 5. Fallback to localStorage saved view if not root
  const savedView = localStorage.getItem('cct_active_view');
  if (
    (savedView === 'marketplace' || savedView === 'dashboard' || savedView === 'transactions') &&
    pathname !== '/' &&
    pathname !== ''
  ) {
    return {
      view: savedView as AppView,
      rawPath: pathname,
      searchParams: searchParamsRecord,
    };
  }

  // 6. Default: Landing Page
  return {
    view: 'landing',
    rawPath: pathname,
    searchParams: searchParamsRecord,
  };
}

/**
 * Builds the canonical path & query string from a navigation target.
 */
export function buildUrlFromTarget(
  target: NavigationTarget,
  currentRoute?: RouteState
): string {
  const effectiveView = target.view || currentRoute?.view || 'landing';

  if (effectiveView === 'landing') {
    return '/';
  }

  if (effectiveView === 'marketplace') {
    if (target.lotId) {
      return `/marketplace?lotId=${encodeURIComponent(target.lotId)}`;
    }
    return '/marketplace';
  }

  if (effectiveView === 'transactions') {
    return '/transactions';
  }

  if (effectiveView === 'scan') {
    if (target.cupId) {
      return `/trace?cupId=${encodeURIComponent(target.cupId)}`;
    }
    if (target.lotId) {
      return `/trace?lotId=${encodeURIComponent(target.lotId)}`;
    }
    return '/';
  }

  if (effectiveView === 'dashboard') {
    const params = new URLSearchParams();

    // 1. If explicit userId is given, this is a deep detail page
    if (target.userId) {
      params.set('userId', target.userId);
      return `/dashboard?${params.toString()}`;
    }

    // 2. If target.userId is explicitly null, don't inherit previous userId
    const currentUserId = target.userId === null ? null : currentRoute?.userId;
    if (currentUserId && !target.subRoute && !target.service) {
      params.set('userId', currentUserId);
      return `/dashboard?${params.toString()}`;
    }

    // 3. SubRoute / Tab
    const effectiveSubRoute = target.subRoute || (target.service ? 'directory' : currentRoute?.subRoute);
    if (effectiveSubRoute && effectiveSubRoute !== 'dashboard') {
      params.set('tab', effectiveSubRoute);
    }

    // 4. Service filter
    const effectiveService = target.service !== undefined ? target.service : currentRoute?.service;
    if (effectiveService && effectiveService !== 'all') {
      params.set('service', effectiveService);
      if (!params.has('tab')) {
        params.set('tab', 'directory');
      }
    }

    // 5. Batch ID
    if (target.batchId) {
      params.set('batchId', target.batchId);
    }

    const qs = params.toString();
    return `/dashboard${qs ? `?${qs}` : ''}`;
  }

  return '/';
}

/**
 * Navigates to the specified target, updating browser history, localStorage, and firing unified events.
 */
export function navigateTo(target: NavigationTarget): RouteState {
  if (typeof window === 'undefined') {
    return {
      view: target.view || 'landing',
      rawPath: '/',
      searchParams: {},
    };
  }

  const currentRoute = parseRouteFromLocation();
  const targetUrl = buildUrlFromTarget(target, currentRoute);

  // Update browser history
  if (target.replace) {
    window.history.replaceState({ path: targetUrl }, '', targetUrl);
  } else {
    window.history.pushState({ path: targetUrl }, '', targetUrl);
  }

  // Update localStorage persistence
  const effectiveView = target.view || currentRoute.view || 'landing';
  try {
    localStorage.setItem('cct_active_view', effectiveView);
  } catch {
    // Ignore storage quota errors
  }

  const newRoute = parseRouteFromLocation();

  // Dispatch unified custom event and popstate event
  window.dispatchEvent(new CustomEvent('cct_route_change', { detail: newRoute }));
  window.dispatchEvent(new PopStateEvent('popstate'));

  return newRoute;
}

/**
 * Backwards-compatible helper returning the active view string.
 */
export function getViewFromUrl(): AppView {
  const route = parseRouteFromLocation();
  return route.view;
}

/**
 * Backwards-compatible helper synchronizing URL with active view.
 */
export function syncUrlWithView(
  view: AppView,
  isAuthenticated: boolean = false,
  replace: boolean = false
): void {
  navigateTo({ view, replace });
}
