import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { requestSnapToken, triggerSnapCheckout } from '../../services/midtransService';
import {
  Lock,
  CreditCard,
  Zap,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const SubscriptionPaywallModal: React.FC = () => {
  const { currentUser, activateUserSubscription, logout } = useCoffee();
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    currentUser?.subscriptionBillingCycle || 'monthly'
  );

  if (!currentUser) return null;

  const role = currentUser.role;
  const roleNames: Record<string, { name: string; monthly: number; yearly: number }> = {
    admin_kelompok_tani: {
      name: 'Kelompok Tani / Gapoktan (Bundle 3-in-1)',
      monthly: 250000,
      yearly: 2500000,
    },
    gudang: {
      name: 'Gudang & QA Logistik Green Bean',
      monthly: 450000,
      yearly: 4500000,
    },
    roaster: {
      name: 'Artisan Roastery & Lab Cupping',
      monthly: 650000,
      yearly: 6500000,
    },
    cafe: {
      name: 'Coffee Shop & Kafe Specialty',
      monthly: 350000,
      yearly: 3500000,
    },
  };

  const currentInfo = roleNames[role] || {
    name: 'Paket Layanan Operasional',
    monthly: 450000,
    yearly: 4500000,
  };

  const price = billingCycle === 'yearly' ? currentInfo.yearly : currentInfo.monthly;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePayWithMidtrans = async () => {
    setIsProcessing(true);
    try {
      const snapRes = await requestSnapToken({
        userId: currentUser.id,
        userEmail: currentUser.email || 'user@circulartrace.id',
        userName: currentUser.name,
        userPhone: currentUser.phone,
        serviceRole: currentUser.role,
        billingCycle: billingCycle,
      });

      await triggerSnapCheckout(snapRes.snapToken, {
        onSuccess: async () => {
          if (activateUserSubscription && currentUser.email) {
            await activateUserSubscription(currentUser.email, snapRes.orderId);
          }
        },
        onClose: () => {
          console.log('User closed Snap popup');
        },
      });
    } catch (err) {
      console.warn('Gagal memicu pembayaran Midtrans:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      if (activateUserSubscription && currentUser.email) {
        await activateUserSubscription(currentUser.email);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6 text-stone-900 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Icon & Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Aktivasi Layanan Diperlukan</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            Selesaikan Pembayaran Layanan
          </h3>

          <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
            Akun Anda terdaftar untuk <strong>{currentUser.organization || currentUser.name}</strong>. Silakan lakukan pembayaran langganan melalui Midtrans Sandbox untuk mengaktifkan akses dashboard operasional.
          </p>
        </div>

        {/* Plan & Cycle Switcher */}
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#E6DFD5] p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 text-xs">
            <span className="text-stone-500 font-medium">Layanan Dipilih:</span>
            <span className="font-bold text-stone-900 text-right">{currentInfo.name}</span>
          </div>

          {/* Billing Cycle Switch */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">Pilihan Siklus:</span>
            <div className="bg-stone-200/80 p-0.5 rounded-xl flex items-center gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  billingCycle === 'yearly'
                    ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>Tahunan</span>
                <span className="text-[9px] bg-stone-900 text-amber-400 px-1 py-0.2 rounded font-extrabold uppercase">
                  -2 Bln
                </span>
              </button>
            </div>
          </div>

          {/* Price display */}
          <div className="flex items-baseline justify-between pt-2 border-t border-stone-200">
            <span className="text-xs text-stone-500 font-medium">Total Tagihan:</span>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-700 tracking-tight">
                {formatRupiah(price)}
              </span>
              <span className="text-xs text-stone-500 ml-1">
                /{billingCycle === 'yearly' ? 'tahun' : 'bulan'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePayWithMidtrans}
            className="w-full py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-sm shadow-md shadow-amber-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Membuka Midtrans Snap...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Bayar Sekarang (Midtrans Snap Sandbox)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Sandbox Demo Quick Bypass Button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSimulatePayment}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            title="Klik untuk langsung mensimulasikan pembayaran lunas di Sandbox demo"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulasi Bayar Sukses (Sandbox Demo)</span>
          </button>
        </div>

        {/* Footer with logout option */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 font-semibold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
          <span>Midtrans Sandbox Mode Active</span>
        </div>
      </div>
    </div>
  );
};
