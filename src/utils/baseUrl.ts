// Single source of truth for public and domain URLs across CircularTrace:
// 1. System ERP: sangrai-circulartrace.circulartrace.id & sangrai-circulartrace.dutaglobaltech.com
// 2. Marketplace: marketplace-circulartrace.circulartrace.id & marketplace-circulartrace.dutaglobaltech.com

export const CANONICAL_DOMAINS = {
  SYSTEM: 'https://sangrai-circulartrace.circulartrace.id',
  MARKETPLACE: 'https://marketplace-circulartrace.circulartrace.id',
  SYSTEM_SHORT: 'https://sangrai.circulartrace.id',
  MARKETPLACE_SHORT: 'https://marketplace.circulartrace.id',
  SYSTEM_LEGACY: 'https://sangrai-circulartrace.dutaglobaltech.com',
  MARKETPLACE_LEGACY: 'https://marketplace-circulartrace.dutaglobaltech.com',
};

const NETWORK_HOST_STORAGE_KEY = 'cct_network_host';

export function isLoopbackHost(): boolean {
  return (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  );
}

/** The dev-only LAN host override (e.g. "192.168.1.23:5173"), saved from barcode modal */
export function getNetworkHost(): string {
  if (typeof window === 'undefined') return 'localhost:5173';
  const saved = localStorage.getItem(NETWORK_HOST_STORAGE_KEY);
  if (saved) return saved;
  return window.location.host;
}

export function saveNetworkHost(host: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(NETWORK_HOST_STORAGE_KEY, host);
  }
}

/** Resolves the base URL (no trailing slash) that QR/barcode links should be built on top of. */
export function getPublicBaseUrl(networkHostOverride?: string): string {
  const envBaseUrl = (import.meta.env?.VITE_PUBLIC_BASE_URL as string | undefined)?.trim();
  if (envBaseUrl) {
    return envBaseUrl.replace(/\/+$/, '');
  }

  if (typeof window === 'undefined') return 'http://localhost:5173';

  if (!isLoopbackHost()) {
    // Deployed (cPanel / custom domain / preview URL) — window.location.origin IS the public URL.
    return window.location.origin;
  }

  const protocol = window.location.protocol;
  const host = networkHostOverride || getNetworkHost();
  return `${protocol}//${host}`;
}

/**
 * Resolves the base URL for the System ERP & Traceability platform.
 * Supports circulartrace.id, dutaglobaltech.com, and local dev.
 */
export function getSystemBaseUrl(): string {
  const envUrl = (import.meta.env?.VITE_SYSTEM_URL as string | undefined)?.trim();
  if (envUrl) return envUrl.replace(/\/+$/, '');
  if (typeof window !== 'undefined') {
    const host = window.location.host.toLowerCase();
    if (host.includes('circulartrace.id')) {
      if (host.includes('marketplace')) {
        return host.includes('marketplace-circulartrace')
          ? CANONICAL_DOMAINS.SYSTEM
          : CANONICAL_DOMAINS.SYSTEM_SHORT;
      }
      return window.location.origin;
    }
    if (host.includes('dutaglobaltech.com')) {
      return CANONICAL_DOMAINS.SYSTEM_LEGACY;
    }
    if (!isLoopbackHost()) {
      return window.location.origin;
    }
  }
  return CANONICAL_DOMAINS.SYSTEM;
}

/**
 * Resolves the base URL for the dedicated external Marketplace.
 * Supports circulartrace.id, dutaglobaltech.com, and local dev.
 */
export function getMarketplaceBaseUrl(): string {
  const envMarketplaceUrl = (import.meta.env?.VITE_MARKETPLACE_URL as string | undefined)?.trim();
  if (envMarketplaceUrl) {
    return envMarketplaceUrl.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    const host = window.location.host.toLowerCase();
    if (host.includes('circulartrace.id')) {
      if (host.includes('sangrai')) {
        return host.includes('sangrai-circulartrace')
          ? CANONICAL_DOMAINS.MARKETPLACE
          : CANONICAL_DOMAINS.MARKETPLACE_SHORT;
      }
      return window.location.origin;
    }
    if (host.includes('dutaglobaltech.com')) {
      return CANONICAL_DOMAINS.MARKETPLACE_LEGACY;
    }
  }
  return '/marketplace';
}

export function isExternalMarketplace(): boolean {
  const envMarketplaceUrl = (import.meta.env?.VITE_MARKETPLACE_URL as string | undefined)?.trim();
  if (!envMarketplaceUrl || typeof window === 'undefined') {
    return Boolean(
      typeof window !== 'undefined' &&
        (window.location.host.includes('dutaglobaltech.com') || window.location.host.includes('circulartrace.id'))
    );
  }
  return !envMarketplaceUrl.includes(window.location.host);
}
