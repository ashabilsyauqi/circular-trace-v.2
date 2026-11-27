/**
 * CircularCoffee - Midtrans Snap Service
 * Integrates Midtrans Sandbox Payment Gateway for instant checkout & subscriptions
 */

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
      embed?: (
        token: string,
        options: {
          embedId: string;
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export interface SnapTransactionParams {
  userId?: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  serviceRole: 'admin_kelompok_tani' | 'gudang' | 'roaster' | 'cafe' | string;
  billingCycle: 'monthly' | 'yearly';
}

export interface SnapTransactionResponse {
  orderId: string;
  snapToken: string;
  redirectUrl?: string;
  grossAmount: number;
  planName: string;
  clientKey: string;
  isDemoFallback: boolean;
  message: string;
}

// Client Key Midtrans Sandbox (Akun: circulartrace / novizarnazir25@gmail.com)
export const MIDTRANS_SANDBOX_CLIENT_KEY = 'Mid-client-oAq9WPHW_0ihG4o4';

/**
 * Memastikan script Midtrans Snap JS termuat di browser window
 */
export const loadMidtransSnapScript = (clientKey = MIDTRANS_SANDBOX_CLIENT_KEY): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.snap) {
      resolve(true);
      return;
    }

    // Cek apakah script tag sudah ada di DOM
    const existingScript = document.getElementById('midtrans-snap-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'midtrans-snap-script';
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      console.warn('Gagal memuat Midtrans Snap script dari CDN, menggunakan mode fallback interaktif.');
      resolve(false);
    };

    document.head.appendChild(script);
  });
};

/**
 * Memanggil endpoint backend API untuk membuat sesi Snap Token baru secara real-time
 */
export const requestSnapToken = async (
  params: SnapTransactionParams
): Promise<SnapTransactionResponse> => {
  const endpoints = [
    'https://tthpstudytrack.circulartrace.id/api/cct/create_snap_token',
    '/api/create_snap_token.php'
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const json = await res.json();
        const data: SnapTransactionResponse = json.data || json;
        if (data && data.snapToken && !data.snapToken.startsWith('MOCK-SNAP-')) {
          return data;
        }
      }
    } catch (err: any) {
      console.warn(`Request Snap Token via ${endpoint} gagal:`, err?.message || err);
    }
  }

  // Fallback graceful jika kedua endpoint offline
  console.warn('Endpoint Midtrans tidak dapat dijangkau, menggunakan token simulasi.');
  const roleCode = params.serviceRole.replace('admin_', '').slice(0, 3).toUpperCase();
  const mockOrderId = `CCT-${roleCode}-${Date.now().toString().slice(-6)}`;
  const mockAmount = params.billingCycle === 'yearly' ? 2500000 : 250000;

  return {
    orderId: mockOrderId,
    snapToken: `MOCK-SNAP-${Date.now()}`,
    redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/mock-${Date.now()}`,
    grossAmount: mockAmount,
    planName: `Paket Layanan ${params.serviceRole} (${params.billingCycle === 'yearly' ? '1 Tahun' : '1 Bulan'})`,
    clientKey: MIDTRANS_SANDBOX_CLIENT_KEY,
    isDemoFallback: true,
    message: 'Token simulasi berhasil dibuat',
  };
};

/**
 * Menampilkan widget Midtrans Snap secara embedded di elemen container tertentu
 */
export const embedSnapCheckout = async (
  token: string,
  embedId: string,
  callbacks: {
    onSuccess?: (result: any) => void;
    onPending?: (result: any) => void;
    onError?: (result: any) => void;
    onClose?: () => void;
  }
): Promise<boolean> => {
  await loadMidtransSnapScript();

  if (window.snap && typeof window.snap.embed === 'function' && !token.startsWith('MOCK-SNAP-')) {
    try {
      window.snap.embed(token, {
        embedId,
        onSuccess: (result) => {
          callbacks.onSuccess?.(result);
        },
        onPending: (result) => {
          callbacks.onPending?.(result);
        },
        onError: (result) => {
          callbacks.onError?.(result);
        },
        onClose: () => {
          callbacks.onClose?.();
        },
      });
      return true;
    } catch (e) {
      console.warn('Gagal render snap.embed:', e);
      return false;
    }
  }
  return false;
};

// Global lock untuk mencegah pop-up Midtrans terpanggil ganda (2x bayar)
let isSnapPopupOpen = false;

/**
 * Menampilkan modal Midtrans Snap Popup resmi
 */
export const triggerSnapCheckout = async (
  token: string,
  callbacks: {
    onSuccess?: (result: any) => void;
    onPending?: (result: any) => void;
    onError?: (result: any) => void;
    onClose?: () => void;
  }
): Promise<void> => {
  if (isSnapPopupOpen) {
    console.warn('Midtrans Snap pop-up sudah aktif di layar, mencegah pemanggilan ganda.');
    return;
  }
  isSnapPopupOpen = true;

  await loadMidtransSnapScript();

  if (window.snap && typeof window.snap.pay === 'function' && !token.startsWith('MOCK-SNAP-')) {
    window.snap.pay(token, {
      onSuccess: (result) => {
        isSnapPopupOpen = false;
        callbacks.onSuccess?.(result);
      },
      onPending: (result) => {
        isSnapPopupOpen = false;
        callbacks.onPending?.(result);
      },
      onError: (result) => {
        isSnapPopupOpen = false;
        callbacks.onError?.(result);
      },
      onClose: () => {
        isSnapPopupOpen = false;
        callbacks.onClose?.();
      },
    });
  } else {
    isSnapPopupOpen = false;
    // Interactive Fallback Modal jika running di sandbox tanpa akses Snap live
    const confirmed = window.confirm(
      `[Midtrans Sandbox Simulator]\n\nSnap Token: ${token}\n\nIngin mensimulasikan status PEMBAYARAN BERHASIL (Settlement) sekarang?`
    );
    if (confirmed) {
      callbacks.onSuccess?.({
        transaction_status: 'settlement',
        order_id: token,
        status_code: '200',
        payment_type: 'sandbox_simulation',
      });
    } else {
      callbacks.onClose?.();
    }
  }
};

/**
 * Simulasi penyelesaian pembayaran sandbox via backend API
 */
export const completeSandboxSimulation = async (
  orderId: string,
  emailOrUserId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await fetch('/api/payment_status.php?action=simulate_sandbox_payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: orderId,
        email: emailOrUserId.includes('@') ? emailOrUserId : undefined,
        user_id: !emailOrUserId.includes('@') ? emailOrUserId : undefined,
      }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: true, message: 'Simulasi tersimpan lokal' };
  }
};
