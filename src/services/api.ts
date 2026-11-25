/**
 * Circular Coffee Trace (CircularCoffee)
 * Central API Service Layer for MySQL Database Integration
 */

const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') return '/api';
  const custom = import.meta.env?.VITE_API_BASE_URL as string | undefined;
  if (custom) return custom.replace(/\/+$/, '');
  // Default to relative /api on current domain (ideal for cPanel deployment)
  return '/api';
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; message?: string }> {
  const url = `${getApiBaseUrl()}${endpoint}`;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cct_auth_token') : null;
    const authHeaders: Record<string, string> = {};
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...authHeaders,
        ...(options.headers || {}),
      },
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: json?.message || `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    return {
      success: true,
      data: json?.data !== undefined ? json.data : json,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Network request failed';
    return {
      success: false,
      message: msg,
    };
  }
}

export const cctApi = {
  // 1. Auth & Users
  auth: {
    login: (email: string, password: string) =>
      request<{ user: any; token: string; message: string }>('/auth.php?action=login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (userData: any) =>
      request<any>('/auth.php?action=register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    getUsers: () => request<any[]>('/auth.php?action=users'),
    getPendingApprovals: () => request<any[]>('/auth.php?action=pending-approvals'),
    verifyUser: (userId: string, status: 'verified' | 'rejected' | 'pending', notes?: string) =>
      request<any>('/auth.php?action=verify-user', {
        method: 'POST',
        body: JSON.stringify({ userId, status, notes }),
      }),
    forgotPassword: (email: string) =>
      request<{ message: string }>('/auth.php?action=forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    resetPassword: (payload: { email: string; otp: string; newPassword: string }) =>
      request<{ message: string }>('/auth.php?action=reset-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  // 2. Coffee Farms & Geolocation
  farms: {
    getAll: (farmerId?: string) =>
      request<any[]>(farmerId ? `/farms.php?farmer_id=${encodeURIComponent(farmerId)}` : '/farms.php'),
    save: (farm: any) =>
      request<{ id: string; message: string }>('/farms.php', {
        method: 'POST',
        body: JSON.stringify(farm),
      }),
  },

  // 3. Farmer Harvest Lots
  harvests: {
    getAll: (farmerId?: string) =>
      request<any[]>(farmerId ? `/harvests.php?farmer_id=${encodeURIComponent(farmerId)}` : '/harvests.php'),
    save: (lot: any) =>
      request<{ id: string; message: string }>('/harvests.php', {
        method: 'POST',
        body: JSON.stringify(lot),
      }),
  },

  // 4. Processing Batches
  batches: {
    getAll: (processorId?: string) =>
      request<any[]>(processorId ? `/batches.php?processor_id=${encodeURIComponent(processorId)}` : '/batches.php'),
    save: (batch: any) =>
      request<{ id: string; message: string }>('/batches.php', {
        method: 'POST',
        body: JSON.stringify(batch),
      }),
  },

  // 5. Warehouse Lots
  warehouse: {
    getAll: (warehouseId?: string) =>
      request<any[]>(warehouseId ? `/warehouse.php?warehouse_id=${encodeURIComponent(warehouseId)}` : '/warehouse.php'),
    save: (lot: any) =>
      request<{ id: string; message: string }>('/warehouse.php', {
        method: 'POST',
        body: JSON.stringify(lot),
      }),
  },

  // 6. Roastery & QC Cupping
  roastery: {
    getLots: (roasterId?: string) =>
      request<any[]>(roasterId ? `/roastery.php?type=lots&roaster_id=${encodeURIComponent(roasterId)}` : '/roastery.php?type=lots'),
    saveLot: (lot: any) =>
      request<{ id: string; message: string }>('/roastery.php?type=lots', {
        method: 'POST',
        body: JSON.stringify(lot),
      }),
    getCupping: () => request<any[]>('/roastery.php?type=cupping'),
    saveCupping: (session: any) =>
      request<{ id: string; message: string }>('/roastery.php?type=cupping', {
        method: 'POST',
        body: JSON.stringify(session),
      }),
  },

  // 7. Cafe Inventory & Products
  cafe: {
    getProducts: (cafeId?: string) =>
      request<any[]>(cafeId ? `/cafe.php?type=products&cafe_id=${encodeURIComponent(cafeId)}` : '/cafe.php?type=products'),
    saveProduct: (product: any) =>
      request<{ id: string; message: string }>('/cafe.php?type=products', {
        method: 'POST',
        body: JSON.stringify(product),
      }),
    getInventory: (cafeId?: string) =>
      request<any[]>(cafeId ? `/cafe.php?type=inventory&cafe_id=${encodeURIComponent(cafeId)}` : '/cafe.php?type=inventory'),
    saveInventory: (item: any) =>
      request<{ id: string; message: string }>('/cafe.php?type=inventory', {
        method: 'POST',
        body: JSON.stringify(item),
      }),
  },

  // 8. Supply Chain Transactions
  transactions: {
    getAll: () => request<any[]>('/transactions.php'),
    save: (tx: any) =>
      request<{ id: string; message: string }>('/transactions.php', {
        method: 'POST',
        body: JSON.stringify(tx),
      }),
  },

  // 9. Public QR Code Trace Lookup
  trace: {
    lookup: (code: string) => request<any>(`/trace.php?code=${encodeURIComponent(code)}`),
  },

  // 10. Service Packages (Super Admin SaaS Management)
  packages: {
    getAll: (params?: { target_role?: string; status?: string }) => {
      const q = new URLSearchParams();
      if (params?.target_role) q.append('target_role', params.target_role);
      if (params?.status) q.append('status', params.status);
      const qs = q.toString() ? `?${q.toString()}` : '';
      return request<any[]>(`/packages.php${qs}`);
    },
    getById: (id: string) => request<any>(`/packages.php?id=${encodeURIComponent(id)}`),
    save: (pkg: any) =>
      request<{ package: any; message: string }>('/packages.php', {
        method: 'POST',
        body: JSON.stringify(pkg),
      }),
    update: (pkg: any) =>
      request<{ package: any; message: string }>('/packages.php', {
        method: 'PUT',
        body: JSON.stringify(pkg),
      }),
    delete: (id: string, permanent: boolean = false) =>
      request<{ message: string }>(`/packages.php?id=${encodeURIComponent(id)}${permanent ? '&permanent=1' : ''}`, {
        method: 'DELETE',
      }),
  },
};

export default cctApi;
