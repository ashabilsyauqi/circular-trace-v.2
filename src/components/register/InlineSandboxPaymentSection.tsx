import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard,
  QrCode,
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
import { triggerSnapCheckout, embedSnapCheckout } from '../../services/midtransService';

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
  const [activeTab, setActiveTab] = useState<'midtrans_embed' | 'quick_simulate' | 'manual_va'>('midtrans_embed');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEmbedLoaded, setIsEmbedLoaded] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedVaNumber, setCopiedVaNumber] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const embedAttemptedRef = useRef(false);

  const vaNumber = `80777${userEmail.replace(/[^0-9]/g, '').padEnd(10, '1234567890').slice(0, 10)}`;

  const copyToClipboard = (text: string, type: 'order' | 'va') => {
    navigator.clipboard.writeText(text);
    if (type === 'order') {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    } else {
      setCopiedVaNumber(true);
      setTimeout(() => setCopiedVaNumber(false), 2000);
    }
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      // 1. Sinkronisasi status pembayaran ke backend / session
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

      // 2. Tandai session modal selamat datang
      try {
        sessionStorage.setItem('cct_show_welcome_modal', 'true');
      } catch (_) {}

      // 3. Jalankan callback sukses (auto-login dan redirect ke panel admin)
      await onPaymentSuccess();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal memproses pembayaran.');
      setIsProcessing(false);
    }
  };

  const handleOpenSnapPopup = async () => {
    if (!snapToken) {
      setErrorMessage('Snap token belum tersedia. Silakan gunakan simulasi Sandbox.');
      return;
    }
    try {
      await triggerSnapCheckout(snapToken, {
        onSuccess: async (res) => {
          console.log('Snap Popup Success:', res);
          await handleSimulatePayment();
        },
        onPending: (res) => {
          console.log('Snap pending:', res);
        },
        onError: (err) => {
          console.warn('Snap error:', err);
          setErrorMessage('Terjadi kendala pada sesi Snap. Anda dapat menggunakan Simulasi Sandbox di bawah.');
        },
        onClose: () => {
          console.log('Snap popup closed by user');
        },
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal membuka Midtrans Snap.');
    }
  };

  // Embed Midtrans Snap UI secara otomatis saat snapToken tersedia
  useEffect(() => {
    let timer: any;
    if (snapToken && !embedAttemptedRef.current && activeTab === 'midtrans_embed') {
      embedAttemptedRef.current = true;
      timer = setTimeout(async () => {
        const success = await embedSnapCheckout(snapToken, 'midtrans-snap-container', {
          onSuccess: async (res) => {
            console.log('Embedded Snap Success:', res);
            await handleSimulatePayment();
          },
          onPending: (res) => {
            console.log('Embedded Snap Pending:', res);
          },
          onError: (err) => {
            console.warn('Embedded Snap Error:', err);
          },
          onClose: () => {
            console.log('Embedded Snap Closed');
          },
        });
        setIsEmbedLoaded(success);
      }, 300);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [snapToken, activeTab]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Step Indicator Header */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Langkah 2 dari 2: Sesi Pembayaran Sandbox</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Selesaikan Pembayaran Akun
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Akun <strong className="text-emerald-300">{organizationName}</strong> telah terdaftar. Bayar tagihan berikut untuk membuka akses penuh ke panel admin.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-right min-w-[180px]">
            <span className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block">Total Tagihan</span>
            <div className="text-xl sm:text-2xl font-black text-amber-300">
              Rp {amount.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-stone-400 font-medium">
              Siklus: {billingCycle === 'yearly' ? 'Tahunan (Diskon 2 Bln)' : 'Bulanan'}
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

      {/* Main Payment Layout */}
      <div className="bg-white rounded-3xl border border-[#E6DFD5] shadow-lg overflow-hidden">
        {/* Invoice Summary Header */}
        <div className="p-5 sm:p-6 bg-[#FAF7F2] border-b border-[#E6DFD5] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-stone-900 text-sm">{organizationName}</div>
              <div className="text-stone-500 text-[11px]">PIC: {userName} ({userEmail})</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500">Order ID:</span>
            <code className="px-2 py-0.5 rounded-md bg-stone-100 font-mono text-stone-800 font-bold border border-stone-200">
              {orderId}
            </code>
            <button
              type="button"
              onClick={() => copyToClipboard(orderId, 'order')}
              className="p-1 rounded-md hover:bg-stone-200 text-stone-600 transition-colors"
              title="Salin Order ID"
            >
              {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Tabs: Midtrans Official Checkout vs Instant Sandbox Controls */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('midtrans_embed')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'midtrans_embed'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Portal Checkout Midtrans Sandbox (Resmi)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('quick_simulate')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'quick_simulate'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Instruksi VA &amp; QR Manual</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {redirectUrl && (
                <a
                  href={redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Buka halaman pembayaran Midtrans di tab baru"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Tab Baru</span>
                </a>
              )}
              <button
                type="button"
                onClick={handleOpenSnapPopup}
                className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                title="Buka dialog popup Midtrans"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Buka Pop-up Snap</span>
              </button>
            </div>
          </div>

          {/* TAB 1: EMBEDDED REAL MIDTRANS SNAP */}
          {activeTab === 'midtrans_embed' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Terhubung ke <strong>Midtrans Sandbox</strong> (Merchant: <code className="font-mono font-bold">circulartrace</code>).
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-stone-500">Token Snap:</span>
                  <code className="px-2 py-0.5 rounded bg-white font-mono text-[11px] font-bold border border-amber-300">
                    {snapToken ? `${snapToken.slice(0, 8)}...` : 'Memuat...'}
                  </code>
                </div>
              </div>

              {/* Midtrans Snap Target Container */}
              <div className="relative min-h-[540px] w-full rounded-2xl bg-[#FCFAF7] border border-stone-200 overflow-hidden shadow-inner flex flex-col items-center justify-center p-2">
                <div id="midtrans-snap-container" className="w-full h-full min-h-[520px] flex items-center justify-center z-10" />

                {!isEmbedLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#FCFAF7]/95 z-0 p-6 text-center">
                    <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <div className="space-y-1">
                      <p className="font-extrabold text-stone-900 text-sm">Menghubungkan ke Widget Midtrans Sandbox...</p>
                      <p className="text-xs text-stone-500 max-w-sm">
                        Memuat pilihan pembayaran (QRIS GoPay, ShopeePay, Virtual Account BCA/BNI/Mandiri/BRI).
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleOpenSnapPopup}
                        className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4 text-amber-300" />
                        <span>Buka via Dialog Pop-up</span>
                      </button>
                      {redirectUrl && (
                        <a
                          href={redirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-bold text-xs flex items-center gap-2 transition-all"
                        >
                          <ExternalLink className="w-4 h-4 text-emerald-600" />
                          <span>Halaman Resmi Midtrans</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL VA & QR DETAILS */}
          {activeTab === 'quick_simulate' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#F8F5F0] border border-[#E6DFD5] space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm text-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MIDTRANS-SANDBOX-${orderId}-RP${amount}`}
                      alt="QRIS Midtrans Sandbox"
                      className="w-36 h-36 object-contain mx-auto"
                    />
                    <div className="mt-2 text-[10px] font-extrabold text-stone-500 uppercase tracking-wider">
                      QRIS Midtrans Sandbox
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-stone-700 flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      <Clock className="w-3 h-3" />
                      <span>Menunggu Pembayaran</span>
                    </div>
                    <h4 className="font-extrabold text-stone-900 text-sm">Nomor Virtual Account &amp; QRIS</h4>
                    <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-bold block">Nomor VA Sandbox (BCA/Mandiri/BNI):</span>
                        <span className="font-mono text-sm font-black text-stone-900">{vaNumber}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(vaNumber, 'va')}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedVaNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedVaNumber ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Anda dapat menguji transaksi ini dengan simulator resmi Midtrans di{' '}
                      <a
                        href="https://simulator.sandbox.midtrans.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-bold underline hover:text-emerald-900"
                      >
                        simulator.sandbox.midtrans.com
                      </a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Simulation & Instant Activation Action Bar */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-[#FAF7F2] to-amber-50/50 border border-emerald-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>Akselerasi Pengujian Sandbox</span>
                </div>
                <h4 className="font-black text-stone-900 text-sm mt-1">
                  Selesaikan Pembayaran &amp; Buka Akses Panel Admin
                </h4>
                <p className="text-stone-600 text-xs">
                  Klik tombol di samping untuk langsung mensimulasikan status <em>Settlement</em>, mengaktifkan akun, dan membuka panel admin dengan ucapan selamat datang.
                </p>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mengaktifkan Akun...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>⚡ Selesaikan Pembayaran (Simulasi Cepat)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Midtrans Sandbox Payment Gateway v1</span>
            </span>
            {onBackToForm && (
              <button
                type="button"
                onClick={onBackToForm}
                className="text-stone-600 hover:text-stone-900 underline font-semibold cursor-pointer"
              >
                Kembali ke Formulir Pendaftaran
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
