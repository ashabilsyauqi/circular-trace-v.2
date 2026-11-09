export type AppView =
  | 'landing'
  | 'dashboard'
  | 'marketplace'
  | 'transactions'
  | 'scan'
  | 'ct4ci'
  | 'subscription'
  | 'buyer'
  | 'product'
  | 'cart'
  | 'login';

export type ServiceDomain =
  | 'petani'
  | 'pengolah'
  | 'gudang'
  | 'roaster'
  | 'cafe'
  | 'verifikator'
  | 'admin'
  | 'superadmin'
  | 'all';

export interface RouteState {
  view: AppView;
  subRoute?: string;     // Canonical subpage / tab key (e.g. 'farms', 'upload', 'batches')
  actualPath?: string;   // Human-readable slug in URL (e.g. 'lahan', 'panen', 'batch')
  service?: ServiceDomain | string; // e.g. 'petani', 'pengolah', 'gudang', 'roaster', 'cafe', 'verifikator', 'admin'
  userId?: string;       // ID of selected user for master data inspection
  batchId?: string;      // ID of selected processing / roasting batch
  lotId?: string;        // ID of coffee lot
  cupId?: string;        // ID of cup
  rawPath: string;
  searchParams: Record<string, string>;
}

export interface NavigationTarget {
  view?: AppView;
  subRoute?: string;
  service?: ServiceDomain | string;
  userId?: string | null;
  batchId?: string | null;
  lotId?: string | null;
  cupId?: string | null;
  replace?: boolean;
}

// ---------------------------------------------------------------------------
// TAB <-> PATH SLUG MAPPINGS FOR HIERARCHICAL ROUTING:
// URL / <service> / <subpage> / <subitem>
// ---------------------------------------------------------------------------

export const SERVICE_TAB_SLUG_MAP: Record<string, { toSlug: Record<string, string>; toTab: Record<string, string>; defaultTab: string }> = {
  petani: {
    toSlug: {
      farms: 'lahan',
      upload: 'panen',
      catalog: 'katalog',
      history: 'ledger',
    },
    toTab: {
      lahan: 'farms',
      kebun: 'farms',
      farms: 'farms',
      panen: 'upload',
      upload: 'upload',
      katalog: 'catalog',
      catalog: 'catalog',
      ceri: 'catalog',
      ledger: 'history',
      history: 'history',
      kas: 'history',
    },
    defaultTab: 'farms',
  },
  pengolah: {
    toSlug: {
      sourcing: 'sourcing',
      batches: 'batch',
      inventory: 'stok',
      selling: 'katalog',
      history: 'ledger',
    },
    toTab: {
      sourcing: 'sourcing',
      beli: 'sourcing',
      ceri: 'sourcing',
      batch: 'batches',
      batches: 'batches',
      olahan: 'batches',
      stok: 'inventory',
      inventory: 'inventory',
      greenbean: 'inventory',
      katalog: 'selling',
      selling: 'selling',
      marketplace: 'selling',
      ledger: 'history',
      history: 'history',
    },
    defaultTab: 'sourcing',
  },
  gudang: {
    toSlug: {
      inventory: 'stok',
      marketplace: 'sourcing',
      history: 'ledger',
    },
    toTab: {
      stok: 'inventory',
      inventory: 'inventory',
      sourcing: 'marketplace',
      marketplace: 'marketplace',
      beli: 'marketplace',
      ledger: 'history',
      history: 'history',
    },
    defaultTab: 'inventory',
  },
  roaster: {
    toSlug: {
      purchasing: 'purchasing',
      inventory: 'inventory',
      work_orders: 'batch',
      production: 'profiles',
      qc: 'qc',
      selling: 'products',
      history: 'ledger',
    },
    toTab: {
      purchasing: 'purchasing',
      po: 'purchasing',
      pengadaan: 'purchasing',
      inventory: 'inventory',
      stok: 'inventory',
      batch: 'work_orders',
      batches: 'work_orders',
      work_orders: 'work_orders',
      roasting: 'work_orders',
      spk: 'work_orders',
      profiles: 'production',
      production: 'production',
      kurva: 'production',
      qc: 'qc',
      cupping: 'qc',
      sensori: 'qc',
      products: 'selling',
      selling: 'selling',
      b2b: 'selling',
      ledger: 'history',
      history: 'history',
    },
    defaultTab: 'purchasing',
  },
  cafe: {
    toSlug: {
      inventory: 'inventory',
      calculator: 'pos',
      my_products: 'menu',
      create_product: 'cup',
      history: 'ledger',
    },
    toTab: {
      inventory: 'inventory',
      stok: 'inventory',
      pos: 'calculator',
      calculator: 'calculator',
      hpp: 'calculator',
      menu: 'my_products',
      katalog: 'my_products',
      my_products: 'my_products',
      cup: 'create_product',
      create_product: 'create_product',
      tambah: 'create_product',
      ledger: 'history',
      history: 'history',
    },
    defaultTab: 'inventory',
  },
  verifikator: {
    toSlug: {
      petani: 'petani',
      pengolah: 'pengolah',
      gudang: 'gudang',
      roaster: 'roaster',
      cafe: 'cafe',
      history: 'stamps',
    },
    toTab: {
      petani: 'petani',
      kebun: 'petani',
      pengolah: 'pengolah',
      mill: 'pengolah',
      gudang: 'gudang',
      roaster: 'roaster',
      cafe: 'cafe',
      kafe: 'cafe',
      stamps: 'history',
      history: 'history',
      riwayat: 'history',
    },
    defaultTab: 'petani',
  },
  admin: {
    toSlug: {
      approvals: 'approvals',
      directory: 'directory',
      subscriptions: 'subscriptions',
      logs: 'logs',
    },
    toTab: {
      approvals: 'approvals',
      antrean: 'approvals',
      directory: 'directory',
      mitra: 'directory',
      users: 'directory',
      user: 'directory',
      subscriptions: 'subscriptions',
      langganan: 'subscriptions',
      billing: 'subscriptions',
      logs: 'logs',
      audit: 'logs',
    },
    defaultTab: 'approvals',
  },
};

/**
 * Parses the current window location into a strongly-typed hierarchical RouteState:
 * URL / <service> / <subpage> / <subitem>
 */
export function parseRouteFromLocation(): RouteState {
  if (typeof window === 'undefined') {
    return {
      view: 'landing',
      rawPath: '/',
      searchParams: {},
    };
  }

  const pathname = window.location.pathname;
  const lowerPath = pathname.toLowerCase();
  const search = window.location.search;
  const urlParams = new URLSearchParams(search);
  const searchParamsRecord: Record<string, string> = {};
  urlParams.forEach((val, key) => {
    searchParamsRecord[key] = val;
  });

  const segments = pathname.split('/').filter(Boolean);
  const seg0 = segments[0]?.toLowerCase() || '';
  const seg1 = segments[1] ? decodeURIComponent(segments[1]) : '';
  const seg2 = segments[2] ? decodeURIComponent(segments[2]) : '';

  // 1. Digital Trace / QR Scan Check: /trace, /trace/:lotId, /trace/cup/:cupId
  if (seg0 === 'trace' || seg0 === 'scan') {
    let lotId = urlParams.get('lotId') || urlParams.get('scan') || undefined;
    let cupId = urlParams.get('cupId') || undefined;

    if (seg1 === 'cup' && seg2) {
      cupId = seg2;
    } else if (seg1 && seg1 !== 'cup') {
      lotId = seg1;
    }

    return {
      view: 'scan',
      lotId: lotId || (cupId ? undefined : 'LOT-PTN-001'),
      cupId,
      rawPath: pathname,
      searchParams: searchParamsRecord,
    };
  }

  // 2. Marketplace & Product Detail: /marketplace, /marketplace/:lotId, /product/:lotId
  if (seg0 === 'marketplace' || seg0 === 'katalog') {
    const lotId = seg1 || urlParams.get('lotId') || undefined;
    if (lotId) {
      return {
        view: 'product',
        lotId,
        rawPath: pathname,
        searchParams: searchParamsRecord,
      };
    }
    return {
      view: 'marketplace',
      rawPath: pathname,
      searchParams: searchParamsRecord,
    };
  }

  if (seg0 === 'product' || seg0 === 'produk') {
    const lotId = seg1 || urlParams.get('lotId') || undefined;
    return {
      view: 'product',
      lotId,
      rawPath: pathname,
      searchParams: searchParamsRecord,
    };
  }

  // 3. Standalone Pages
  if (seg0 === 'login' || seg0 === 'masuk') {
    return { view: 'login', rawPath: pathname, searchParams: searchParamsRecord };
  }
  if (seg0 === 'landing' || seg0 === 'beranda' || seg0 === 'home') {
    return { view: 'landing', rawPath: pathname, searchParams: searchParamsRecord };
  }
  if (seg0 === 'cart' || seg0 === 'keranjang') {
    return { view: 'cart', rawPath: pathname, searchParams: searchParamsRecord };
  }
  if (seg0 === 'subscription' || seg0 === 'langganan' || seg0 === 'billing') {
    return { view: 'subscription', rawPath: pathname, searchParams: searchParamsRecord };
  }
  if (seg0 === 'transactions' || seg0 === 'ledger' || seg0 === 'buku-besar') {
    return { view: 'transactions', rawPath: pathname, searchParams: searchParamsRecord };
  }
  if (seg0 === 'ct4ci' || seg0 === '4c' || seg0 === 'sertifikasi') {
    return { view: 'ct4ci', rawPath: pathname, searchParams: searchParamsRecord };
  }
  if (seg0 === 'buyer' || seg0 === 'pembeli') {
    return { view: 'buyer', rawPath: pathname, searchParams: searchParamsRecord };
  }

  // 4. Hierarchical Service Routing: /<service>/<subpage>/<subitem>
  const serviceKey = seg0 === 'superadmin' ? 'admin' : seg0;
  if (SERVICE_TAB_SLUG_MAP[serviceKey]) {
    const config = SERVICE_TAB_SLUG_MAP[serviceKey];
    const subSlug = (seg1 || '').toLowerCase();
    const subTab = config.toTab[subSlug] || config.defaultTab;
    const subItem = seg2 || undefined;

    let lotId = urlParams.get('lotId') || undefined;
    let batchId = urlParams.get('batchId') || undefined;
    let cupId = urlParams.get('cupId') || undefined;
    let userId = urlParams.get('userId') || undefined;

    // Subitem extraction based on context
    if (subItem) {
      if (serviceKey === 'petani' && (subTab === 'catalog' || subSlug === 'katalog')) {
        lotId = subItem;
      } else if (serviceKey === 'pengolah' && (subTab === 'batches' || subSlug === 'batch')) {
        batchId = subItem;
      } else if (serviceKey === 'pengolah' && (subTab === 'inventory' || subSlug === 'stok')) {
        lotId = subItem;
      } else if (serviceKey === 'gudang' && (subTab === 'inventory' || subSlug === 'stok')) {
        lotId = subItem;
      } else if (serviceKey === 'roaster' && (subTab === 'work_orders' || subSlug === 'batch')) {
        batchId = subItem;
      } else if (serviceKey === 'roaster' && (subTab === 'inventory' || subSlug === 'inventory')) {
        lotId = subItem;
      } else if (serviceKey === 'cafe' && (subTab === 'create_product' || subSlug === 'cup')) {
        cupId = subItem;
      } else if (serviceKey === 'admin') {
        if (subSlug === 'user' || subSlug === 'users') {
          userId = subItem;
        }
      }
    }

    return {
      view: 'dashboard',
      service: serviceKey === 'admin' ? 'superadmin' : (serviceKey as ServiceDomain),
      subRoute: subTab,
      actualPath: subSlug || config.toSlug[config.defaultTab] || 'default',
      batchId,
      lotId,
      cupId,
      userId,
      rawPath: pathname,
      searchParams: searchParamsRecord,
    };
  }

  // 5. Legacy /dashboard with query parameters support
  if (seg0 === 'dashboard' || seg0 === 'panel') {
    const queryService = urlParams.get('service')?.toLowerCase();
    const queryTab = urlParams.get('tab') || urlParams.get('subRoute') || undefined;
    const lotId = urlParams.get('lotId') || undefined;
    const batchId = urlParams.get('batchId') || undefined;
    const cupId = urlParams.get('cupId') || undefined;
    const userId = urlParams.get('userId') || undefined;

    return {
      view: 'dashboard',
      service: queryService || undefined,
      subRoute: queryTab || undefined,
      lotId,
      batchId,
      cupId,
      userId,
      rawPath: pathname,
      searchParams: searchParamsRecord,
    };
  }

  // 6. Hostname-specific default routing & Landing Page fallback
  const host = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';

  // Marketplace Domain: default to unified marketplace catalog
  if (host.includes('marketplace')) {
    return {
      view: 'marketplace',
      rawPath: pathname,
      searchParams: searchParamsRecord,
    };
  }

  // Sangrai ERP Domain:
  // If user has saved session, directly open their personal dashboard workstation
  const savedUser = typeof window !== 'undefined' ? localStorage.getItem('cct_live_auth_user') : null;
  if (host.includes('sangrai') && savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);
      return {
        view: 'dashboard',
        service: parsedUser.role === 'superadmin' ? 'admin' : parsedUser.role,
        rawPath: pathname,
        searchParams: searchParamsRecord,
      };
    } catch {
      // Ignore parse error
    }
  }

  // Fallback Default: Landing Page (/) with Petani, Pengolah, Roaster ecosystem showcase
  return {
    view: 'landing',
    rawPath: pathname,
    searchParams: searchParamsRecord,
  };
}

/**
 * Builds canonical hierarchical URL from target:
 * URL / <actual-halaman> / <subhalaman> / <subitem>
 */
export function buildUrlFromTarget(
  target: NavigationTarget,
  currentRoute?: RouteState
): string {
  const effectiveView = target.view || currentRoute?.view || 'landing';

  if (effectiveView === 'landing') {
    return '/';
  }

  if (effectiveView === 'product') {
    const lotId = target.lotId || currentRoute?.lotId;
    return lotId ? `/marketplace/${encodeURIComponent(lotId)}` : '/marketplace';
  }

  if (effectiveView === 'marketplace') {
    if (target.lotId) {
      return `/marketplace/${encodeURIComponent(target.lotId)}`;
    }
    return '/marketplace';
  }

  if (effectiveView === 'login') return '/login';
  if (effectiveView === 'cart') return '/cart';
  if (effectiveView === 'subscription') return '/subscription';
  if (effectiveView === 'transactions') return '/transactions';
  if (effectiveView === 'ct4ci') return '/ct4ci';
  if (effectiveView === 'buyer') return '/buyer';

  if (effectiveView === 'scan') {
    if (target.cupId) {
      return `/trace/cup/${encodeURIComponent(target.cupId)}`;
    }
    if (target.lotId) {
      return `/trace/${encodeURIComponent(target.lotId)}`;
    }
    return '/trace';
  }

  if (effectiveView === 'dashboard') {
    const rawService = target.service || currentRoute?.service;
    const serviceKey = rawService === 'superadmin' ? 'admin' : (rawService || '').toLowerCase();

    // Check if this service is registered in hierarchical routing
    if (SERVICE_TAB_SLUG_MAP[serviceKey]) {
      const config = SERVICE_TAB_SLUG_MAP[serviceKey];
      const targetSub = target.subRoute || currentRoute?.subRoute || config.defaultTab;
      // Get human-friendly slug from tab key, or fallback to tab key itself
      const subSlug = config.toSlug[targetSub] || targetSub;

      // Check subitem (batchId, lotId, cupId, userId)
      const batchId = target.batchId !== undefined ? target.batchId : currentRoute?.batchId;
      const lotId = target.lotId !== undefined ? target.lotId : currentRoute?.lotId;
      const cupId = target.cupId !== undefined ? target.cupId : currentRoute?.cupId;
      const userId = target.userId !== undefined ? target.userId : currentRoute?.userId;

      let subItem = '';
      if (serviceKey === 'admin' && userId) {
        return `/admin/user/${encodeURIComponent(userId)}`;
      }
      if (batchId && (subSlug === 'batch' || targetSub === 'batches' || targetSub === 'work_orders')) {
        subItem = `/${encodeURIComponent(batchId)}`;
      } else if (lotId && (subSlug === 'katalog' || subSlug === 'stok' || targetSub === 'catalog' || targetSub === 'inventory')) {
        subItem = `/${encodeURIComponent(lotId)}`;
      } else if (cupId && (subSlug === 'cup' || targetSub === 'create_product')) {
        subItem = `/${encodeURIComponent(cupId)}`;
      }

      return `/${serviceKey}/${subSlug}${subItem}`;
    }

    // Fallback query string for dashboard
    return '/dashboard';
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
