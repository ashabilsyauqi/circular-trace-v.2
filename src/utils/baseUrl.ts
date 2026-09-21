// Single source of truth for the public URL that gets baked into every QR / barcode link in the
// app (farmer, processor, warehouse, roaster, cafe stickers + the product detail QR).
//
// Resolution order, first match wins:
//   1. VITE_PUBLIC_BASE_URL — set this in the VPS's .env (or the hosting platform's env vars)
//      when you deploy, e.g. VITE_PUBLIC_BASE_URL=https://sangrai.yourdomain.com — every QR
//      code will then always point at that domain, regardless of what URL the app is actually
//      loaded from (useful behind a reverse proxy / CDN where window.location isn't the public
//      address).
//   2. The browser's own origin (window.location.origin) — once the build is deployed to a VPS
//      or any real domain, this already resolves to that domain automatically with zero config,
//      because a live site is never loaded from "localhost".
//   3. A manually-set LAN host (saved in localStorage under 'cct_network_host') — only kicks in
//      during local dev (hostname is localhost/127.0.0.1), so a phone on the same Wi-Fi can
//      still scan a QR code pointed at the dev machine's LAN IP instead of "localhost".

const NETWORK_HOST_STORAGE_KEY = 'cct_network_host';

export function isLoopbackHost(): boolean {
  return (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  );
}

/** The dev-only LAN host override (e.g. "192.168.1.23:5173"), saved from the barcode modal's
 * "Ubah IP / Host" field. Falls back to the current host as a starting placeholder. */
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
    // Deployed (VPS / custom domain / preview URL) — window.location.origin IS the public URL.
    return window.location.origin;
  }

  const protocol = window.location.protocol;
  const host = networkHostOverride || getNetworkHost();
  return `${protocol}//${host}`;
}
