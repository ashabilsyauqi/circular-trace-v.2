import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { triggerSnapCheckout } from '../../services/midtransService';

interface InlineSandboxPaymentSectionProps {
  userEmail: string;
  userName: string;
  organizationName: string;
  orderId: string;
  snapToken?: string;
  redirectUrl?: string;
  planRole: string;
  planName: string;
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  onPaymentSuccess: () => Promise<void> | void;
  onBackToForm?: () => void;
}

export const InlineSandboxPaymentSection: React.FC<InlineSandboxPaymentSectionProps> = ({
  userEmail,
  userName,
  organizationName,
  orderId,
  snapToken,
  redirectUrl,
  planRole,
  planName,
  billingCycle,
  amount,
  onPaymentSuccess,
  onBackToForm,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const autoTriggeredRef = useRef(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      try {
        await fetch('https://tthpstudytrack.circulartrace.id/api/cct/payment_status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: orderId,
            email: userEmail,
            role: planRole,
          }),
        });
      } catch (e) {
        console.warn('Backend payment status sync warning:', e);
      }

      try {
        sessionStorage.setItem('cct_show_welcome_modal', 'true');
      } catch (_) {}

      await onPaymentSuccess();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal memproses pembayaran.');
      setIsProcessing(false);
    }
  };

  const handleOpenSnapPopup = async () => {
    if (!snapToken) {
      setErrorMessage('Snap token belum tersedia. Silakan gunakan simulasi cepat.');
      return;
    }
    try {
      await triggerSnapCheckout(snapToken, {
        onSuccess: async (res) => {
          console.log('Midtrans Snap Success:', res);
          await handleSimulatePayment();
        },
        onPending: (res) => {
          console.log('Midtrans Snap Pending:', res);
        },
        onError: (err) => {
          console.warn('Midtrans Snap Error:', err);
          setErrorMessage('Terjadi kendala pada sesi Snap Midtrans.');
        },
        onClose: () => {
          console.log('Midtrans Snap popup closed by user');
        },
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal membuka pop-up Midtrans.');
    }
  };

  // Otomatis buka pop-up Snap Midtrans bawaan saat komponen pertama kali dimuat
  useEffect(() => {
    if (snapToken && !autoTriggeredRef.current) {
      autoTriggeredRef.current = true;
      const timer = setTimeout(() => {
        handleOpenSnapPopup();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [snapToken]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Step Indicator Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-[#07130C] text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Langkah 2 dari 2: Pembayaran Midtrans Sandbox</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Selesaikan Pembayaran Akun
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Akun <strong className="text-emerald-300">{organizationName}</strong> telah terdaftar. Bayar melalui pop-up Midtrans untuk membuka akses penuh ke panel admin.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-right min-w-[170px]">
            <span className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block">Total Tagihan</span>
            <div className="text-xl sm:text-2xl font-black text-amber-300">
              Rp {amount.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-stone-400 font-medium">
              Siklus: {billingCycle === 'yearly' ? 'Tahunan' : 'Bulanan'}
            </span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Kendala Pembayaran</p>
            <p className="text-rose-700 text-xs">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Payment Card */}
      <div className="bg-white rounded-3xl border border-[#E6DFD5] shadow-lg overflow-hidden">
        {/* Invoice Header */}
        <div className="p-5 sm:p-6 bg-[#FAF7F2] border-b border-[#E6DFD5] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-md shadow-emerald-700/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-stone-900 text-sm">{organizationName}</div>
              <div className="text-stone-500 text-[11px]">PIC: {userName} ({userEmail})</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium">Order ID:</span>
            <code className="px-2.5 py-1 rounded-lg bg-white font-mono text-stone-900 font-bold border border-stone-200 text-xs shadow-sm">
              {orderId}
            </code>
            <button
              type="button"
              onClick={() => copyToClipboard(orderId)}
              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              title="Salin Order ID"
            >
              {copiedOrderId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Center Prompt */}
        <div className="p-6 sm:p-8 space-y-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-inner animate-pulse">
            <CreditCard className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Menunggu Pembayaran di Pop-up Midtrans</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-stone-900">
              Pop-up Pembayaran Midtrans Sedang Aktif
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Jendela pop-up resmi Midtrans telah terbuka di layar Anda. Silakan selesaikan pembayaran menggunakan QRIS (GoPay/ShopeePay) atau Virtual Account Sandbox.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2 max-w-md mx-auto">
            {/* Tombol Buka Pop-up Snap */}
            <button
              type="button"
              onClick={handleOpenSnapPopup}
              className="w-full py-4 px-6 rounded-2xl bg-stone-900 hover:bg-emerald-900 text-white font-extrabold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Maximize2 className="w-5 h-5 text-amber-300" />
              <span>Buka Pop-up Midtrans Snap</span>
            </button>

            {/* Tombol Simulasi Instan untuk demo/testing */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSimulatePayment}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mengaktifkan Akun &amp; Membuka Panel Admin...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>⚡ Selesaikan Pembayaran (Simulasi Cepat)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {redirectUrl && (
              <div className="pt-1">
                <a
                  href={redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-emerald-700 font-semibold underline transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Jika pop-up tidak muncul, klik di sini untuk buka di Tab Baru</span>
                </a>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-6 border-t border-stone-200">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Midtrans Sandbox Payment Gateway</span>
            </span>
            {onBackToForm && (
              <button
                type="button"
                onClick={onBackToForm}
                className="text-stone-600 hover:text-stone-900 underline font-semibold cursor-pointer"
              >
                Kembali ke Formulir
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
