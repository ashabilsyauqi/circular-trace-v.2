import React, { useState } from 'react';
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
} from 'lucide-react';
import { triggerSnapCheckout } from '../../services/midtransService';

interface InlineSandboxPaymentSectionProps {
  userEmail: string;
  userName: string;
  organizationName: string;
  orderId: string;
  snapToken?: string;
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
  planRole,
  planName,
  billingCycle,
  amount,
  onPaymentSuccess,
  onBackToForm,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'va' | 'snap'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedVaNumber, setCopiedVaNumber] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      // 1. Panggil backend simulasi payment_status.php
      try {
        await fetch('/api/payment_status.php?action=simulate_sandbox_payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: orderId,
            email: userEmail,
            role: planRole,
          }),
        });
      } catch (e) {
        console.warn('Backend payment status update warning:', e);
      }

      // 2. Jalankan callback sukses (auto-login dan redirect ke panel admin)
      await onPaymentSuccess();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal memproses simulasi pembayaran.');
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
        onSuccess: async () => {
          await handleSimulatePayment();
        },
        onPending: (res) => {
          console.log('Snap pending:', res);
        },
        onError: (err) => {
          console.warn('Snap error:', err);
          setErrorMessage('Terjadi kendala pada sesi Snap. Anda dapat menggunakan Simulasi Sandbox.');
        },
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal membuka Midtrans Snap.');
    }
  };

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

        {/* Payment Methods Tabs */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              Pilih Metode Pembayaran (Midtrans Sandbox)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMethod('qris')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  selectedMethod === 'qris'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedMethod === 'qris' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-stone-900 text-xs">QRIS Instant</div>
                  <div className="text-[10px] text-stone-500">GoPay / ShopeePay / Semua Bank</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('va')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  selectedMethod === 'va'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedMethod === 'va' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-stone-900 text-xs">Virtual Account</div>
                  <div className="text-[10px] text-stone-500">BCA, BNI, Mandiri, BRI</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('snap')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  selectedMethod === 'snap'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedMethod === 'snap' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-stone-900 text-xs">Midtrans Snap</div>
                  <div className="text-[10px] text-stone-500">Pop-up Resmi Midtrans</div>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Method Details View */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#F8F5F0] border border-[#E6DFD5] space-y-4">
            {selectedMethod === 'qris' && (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm text-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MIDTRANS-SANDBOX-${orderId}-RP${amount}`}
                    alt="QRIS Midtrans Sandbox"
                    className="w-40 h-40 object-contain mx-auto"
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
                  <h4 className="font-extrabold text-stone-900 text-sm">Instruksi Pembayaran QRIS</h4>
                  <ol className="list-decimal list-inside space-y-1 text-stone-600 leading-relaxed text-[11px]">
                    <li>Scan kode QR di samping melalui aplikasi e-wallet simulator (GoPay/ShopeePay/BCA).</li>
                    <li>Pastikan nominal yang tertera sesuai: <strong>Rp {amount.toLocaleString('id-ID')}</strong>.</li>
                    <li>Atau langsung klik tombol hijau <strong>"Selesaikan Pembayaran (Simulasi)"</strong> di bawah untuk demo instan.</li>
                  </ol>
                </div>
              </div>
            )}

            {selectedMethod === 'va' && (
              <div className="space-y-3 text-xs">
                <h4 className="font-extrabold text-stone-900 text-sm">Nomor Virtual Account Sandbox (BCA / Mandiri)</h4>
                <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Nomor Virtual Account:</span>
                    <span className="font-mono text-base font-black text-stone-900 tracking-wider">{vaNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(vaNumber, 'va')}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedVaNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedVaNumber ? 'Tersalin' : 'Salin VA'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Gunakan simulator transfer ATM Sandbox Midtrans dengan memasukkan nomor VA di atas atau selesaikan secara otomatis dengan tombol di bawah.
                </p>
              </div>
            )}

            {selectedMethod === 'snap' && (
              <div className="space-y-3 text-xs">
                <h4 className="font-extrabold text-stone-900 text-sm">Midtrans Snap Checkout Resmi</h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Jika Anda ingin membuka jendela dialog checkout resmi dari Midtrans Sandbox dengan Client Key Anda:
                </p>
                <button
                  type="button"
                  onClick={handleOpenSnapPopup}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Buka Midtrans Snap Popup</span>
                </button>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSimulatePayment}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mengonfirmasi Pembayaran &amp; Membuka Akses...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-amber-300" />
                  <span>⚡ Selesaikan Pembayaran (Simulasi Midtrans Sandbox)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Simulasi Sandbox Terenkripsi &amp; Aman</span>
              </span>
              {onBackToForm && (
                <button
                  type="button"
                  onClick={onBackToForm}
                  className="text-stone-600 hover:text-stone-900 underline font-semibold cursor-pointer"
                >
                  Ubah Data Organisasi
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
