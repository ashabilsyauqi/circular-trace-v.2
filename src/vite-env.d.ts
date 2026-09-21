/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public base URL baked into every QR/barcode link at build time. Set this in the VPS's
   * .env (or hosting platform env vars) so QR codes always point at the real domain, e.g.
   * VITE_PUBLIC_BASE_URL=https://sangrai.yourdomain.com — leave unset to auto-detect from
   * window.location.origin instead (works fine for most deployments). */
  readonly VITE_PUBLIC_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
