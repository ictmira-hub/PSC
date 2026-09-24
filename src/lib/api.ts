import { AssetItem, AdminUser } from '../types';

const LOCAL_STORAGE_KEY = 'packsify_assets_cache';

export function getLocalCachedAssets(): AssetItem[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load assets from localStorage:', e);
  }
  return [];
}

function saveLocalCachedAssets(assets: AssetItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(assets));
  } catch (e) {
    console.warn('Failed to save assets to localStorage:', e);
  }
}

export async function fetchAssets(): Promise<AssetItem[]> {
  const res = await fetch('/api/assets');
  if (!res.ok) throw new Error(`Failed to fetch assets (${res.status})`);
  const data: AssetItem[] = await res.json();
  saveLocalCachedAssets(data);
  return data;
}

/**
 * Firestore's onSnapshot gave real-time push updates; a plain Postgres
 * table doesn't. This polls on an interval instead, which is a fair
 * trade-off for an internal team tool. Swap for a websocket/SSE
 * endpoint later if live multi-user editing becomes a real need.
 */
export function subscribeToAssets(
  onData: (assets: AssetItem[]) => void,
  onError?: (err: Error) => void,
  intervalMs = 15000
): () => void {
  let cancelled = false;

  const tick = async () => {
    try {
      const data = await fetchAssets();
      if (!cancelled) onData(data);
    } catch (e) {
      console.warn('Asset fetch failed, falling back to local cache:', e);
      if (onError) onError(e as Error);
      if (!cancelled) onData(getLocalCachedAssets());
    }
  };

  tick();
  const interval = setInterval(tick, intervalMs);
  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}

export async function createAssetDoc(asset: AssetItem): Promise<void> {
  const res = await fetch('/api/assets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(asset),
  });
  if (!res.ok) throw new Error(`Failed to create asset (${res.status})`);
  const current = getLocalCachedAssets();
  saveLocalCachedAssets([asset, ...current.filter((a) => a.id !== asset.id)]);
}

export async function updateAssetDoc(id: string, updates: Partial<AssetItem>): Promise<void> {
  const res = await fetch(`/api/assets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(`Failed to update asset (${res.status})`);
  const current = getLocalCachedAssets();
  saveLocalCachedAssets(
    current.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item))
  );
}

export async function deleteAssetDoc(id: string): Promise<void> {
  const res = await fetch(`/api/assets/${id}`, { method: 'DELETE', credentials: 'same-origin' });
  if (!res.ok) throw new Error(`Failed to delete asset (${res.status})`);
  saveLocalCachedAssets(getLocalCachedAssets().filter((item) => item.id !== id));
}

export async function trackCopyClick(id: string, team: 'CS' | 'Growth'): Promise<void> {
  try {
    await fetch(`/api/assets/${id}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team }),
    });
  } catch (e) {
    console.warn('Track copy click failed:', e);
  }
  const current = getLocalCachedAssets();
  saveLocalCachedAssets(
    current.map((item) =>
      item.id === id
        ? {
            ...item,
            copyCountCS: team === 'CS' ? (item.copyCountCS || 0) + 1 : item.copyCountCS || 0,
            copyCountGrowth: team === 'Growth' ? (item.copyCountGrowth || 0) + 1 : item.copyCountGrowth || 0,
          }
        : item
    )
  );
}

// --- Admin auth: replaces the old client-side hardcoded-password check.
// The real check happens server-side in /api/auth/login against the
// ADMIN_PASSWORD env var; the client only ever sees the resulting cookie.

export async function loginAdmin(password: string, email?: string): Promise<AdminUser | null> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ password, email }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return { isAuthenticated: true, role: 'admin', email: data.email };
}

export async function logoutAdmin(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
}

export async function fetchSession(): Promise<AdminUser> {
  try {
    const res = await fetch('/api/auth/session', { credentials: 'same-origin' });
    if (!res.ok) return { isAuthenticated: false, role: 'viewer' };
    return await res.json();
  } catch (e) {
    console.warn('Session check failed:', e);
    return { isAuthenticated: false, role: 'viewer' };
  }
}
