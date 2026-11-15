export interface SharedLotEntry {
  id: string;
  category: 'cherry' | 'green_bean_processor' | 'green_bean_warehouse' | 'roasted_bean';
  marketplaceTitle?: string;
  marketplaceDescription?: string;
  price?: number;
  availableStock?: number;
  photoUrl?: string;
  tastingNotes?: string[];
  updatedAt: number;
}

const COOKIE_NAME = 'cct_shared_marketplace_lots';

export function saveSharedLotToCookie(entry: SharedLotEntry): void {
  if (typeof document === 'undefined') return;
  try {
    const existing = getSharedLotsFromCookie();
    const filtered = existing.filter((l) => l.id !== entry.id);
    const updated = [entry, ...filtered].slice(0, 10);

    const hostname = window.location.hostname;
    let domainClause = '';
    if (hostname.includes('circulartrace.id')) {
      domainClause = '; domain=.circulartrace.id';
    } else if (hostname.includes('dutaglobaltech.com')) {
      domainClause = '; domain=.dutaglobaltech.com';
    }

    const value = encodeURIComponent(JSON.stringify(updated));
    document.cookie = `${COOKIE_NAME}=${value}${domainClause}; path=/; max-age=2592000; SameSite=Lax`;
  } catch (err) {
    console.warn('Failed to save shared lot cookie', err);
  }
}

export function getSharedLotsFromCookie(): SharedLotEntry[] {
  if (typeof document === 'undefined') return [];
  try {
    const prefix = `${COOKIE_NAME}=`;
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      c = c.trim();
      if (c.startsWith(prefix)) {
        const raw = decodeURIComponent(c.substring(prefix.length));
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to read shared lot cookie', err);
  }
  return [];
}
