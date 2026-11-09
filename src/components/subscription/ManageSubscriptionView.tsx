import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { SUBSCRIPTION_PLANS } from '../../data/mockSubscriptions';
import { SubscriptionTierId } from '../../types/subscription';
import {
  Crown,
  CreditCard,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Lock,
  ArrowRight,
  Download,
  Receipt,
  Zap,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  Check,
  X,
  Store,
  ExternalLink,
} from 'lucide-react';

export const ManageSubscriptionView: React.FC = () => {
  const {
    currentUser,
    getUserSubscription,
    subscribeUser,
    extendSubscription,
    subscriptions,
    setActiveView,
  } = useCoffee();

  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionTierId | null>(null);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'qris' | 'bank_transfer' | 'credit_card' | 'wallet'>('qris');
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Active user's subscription
  const currentSub = currentUser ? getUserSubscription(currentUser.id) : null;
  const isSuperAdmin = currentUser?.role === 'superadmin' || currentUser?.isSuperAdmin;

  const currentPlan = currentSub
    ? SUBSCRIPTION_PLANS.find((p) => p.id === currentSub.tierId) || SUBSCRIPTION_PLANS[0]
    : null;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedPlanForCheckout) return;

    const res = subscribeUser({
      userId: currentUser.id,
      tierId: selectedPlanForCheckout,
      billingCycle: selectedPlanForCheckout === '1_year' ? 'yearly' : 'monthly',
      paymentMethod: checkoutPaymentMethod,
    });

    if (res.success) {
      setActionNotice({ type: 'success', message: res.message });
      setSelectedPlanForCheckout(null);
      setTimeout(() => setActionNotice(null), 5000);
    } else {
      setActionNotice({ type: 'error', message: res.message });
    }
  };

  const handleFastExtend = (subId: string) => {
    const res = extendSubscription(subId, 30);
    setActionNotice({ type: 'success', message: res.message });
    setTimeout(() => setActionNotice(null), 5000);
  };

  const chosenPlanObj = selectedPlanForCheckout
    ? SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanForCheckout)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 font-['Poppins']">
      
      {/* Action Notification */}
      {actionNotice && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between shadow-md animate-in fade-in ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionNotice.message}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="underline cursor-pointer text-xs">
            Tutup
          </button>
        </div>
      )}

      {/* 1. HERO STATUS LANGGANAN AKTIF */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A120B] via-[#241710] to-[#120B07] text-white p-6 sm:p-8 border border-amber-900/40 shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Paket Langganan ERP Stasiun SangrAI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {currentUser?.name || 'Mitra'} • {currentUser?.organization || 'Kelompok Tani / Roastery'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Satu langganan operasional hulu-ke-hilir untuk membuka workstation Kelompok Tani, Pengolah Mill, Gudang QA, dan Artisan Roastery. Produk yang telah diverifikasi oleh Verifikator Pihak Ketiga otomatis siap tayang di Marketplace.
            </p>
          </div>

          {/* Status Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 min-w-[280px] w-full lg:w-auto space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">Status Akun</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isSuperAdmin
                    ? 'bg-amber-400 text-stone-950'
                    : currentSub?.status === 'active'
                    ? 'bg-emerald-400 text-emerald-950'
                    : currentSub?.status === 'expiring_soon'
                    ? 'bg-amber-400 text-stone-950 animate-pulse'
                    : 'bg-rose-400 text-white'
                }`}
              >
                {isSuperAdmin
                  ? '👑 Master Owner (Perpetual)'
                  : currentSub?.status === 'active'
                  ? 'Aktif'
                  : currentSub?.status === 'expiring_soon'
                  ? 'Hampir Jatuh Tempo'
                  : 'Belum Aktif'}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-amber-300">
                {isSuperAdmin ? 'Full Ecosystem Unlimited' : currentSub?.tierName || 'Paket Uji Coba'}
              </h3>
              <p className="text-xs text-stone-300">
                {isSuperAdmin
                  ? 'Akses tak terbatas ke seluruh stasiun kerja'
                  : currentSub
                  ? `Sisa masa aktif: ${currentSub.daysRemaining} hari`
                  : 'Aktifkan paket untuk membuka workstation'}
              </p>
            </div>

            {!isSuperAdmin && currentSub && (
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-stone-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Jatuh Tempo:
                </span>
                <span className="font-mono font-bold text-amber-200">
                  {currentSub.expiryDate}
                </span>
              </div>
            )}

            {!isSuperAdmin && currentSub && (
              <button
                type="button"
                onClick={() => handleFastExtend(currentSub.id)}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Perpanjang Cepat +30 Hari</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. FASILITAS STASIUN KERJA YANG TERMASUK */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-4">
        <div>
          <h2 className="text-lg font-black text-stone-900 tracking-tight">
            Cakupan Hak Akses Stasiun Kerja (All-in-One ERP)
          </h2>
          <p className="text-xs text-stone-500">
            Seluruh paket langganan di bawah langsung memberikan akses lengkap ke 5 workstation operasional:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {[
            {
              role: '1. Petani & Kebun',
              desc: 'Patok GPS lahan BPN, audit EUDR, log panen ceri & uji Brix.',
              icon: <Sprout className="w-4 h-4 text-emerald-600" />,
              color: 'bg-emerald-50 border-emerald-200 text-emerald-950',
            },
            {
              role: '2. Pengolah Mill',
              desc: 'Fermentasi anaerobik, solar dome drying, zero-waste cascara.',
              icon: <Cog className="w-4 h-4 text-amber-600" />,
              color: 'bg-amber-50 border-amber-200 text-amber-950',
            },
            {
              role: '3. Gudang QA & Ekspor',
              desc: 'Penyimpanan hermetik GrainPro, sortir defect, sanitasi.',
              icon: <Warehouse className="w-4 h-4 text-blue-600" />,
              color: 'bg-blue-50 border-blue-200 text-blue-950',
            },
            {
              role: '4. Roastery Artisan',
              desc: 'Profil sangrai Agtron #68, radar SCA cupping, hitung HPP.',
              icon: <Flame className="w-4 h-4 text-orange-600" />,
              color: 'bg-orange-50 border-orange-200 text-orange-950',
            },
            {
              role: '5. Kafe & Smart POS',
              desc: 'POS kasir barista, cetak QR passport farm-to-cup ke konsumen.',
              icon: <Coffee className="w-4 h-4 text-stone-700" />,
              color: 'bg-stone-50 border-stone-200 text-stone-950',
            },
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border ${item.color} space-y-1.5`}>
              <div className="flex items-center gap-2">
                {item.icon}
                <h4 className="font-bold text-xs">{item.role}</h4>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl flex items-start gap-2.5 text-xs text-purple-950">
          <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
          <div>
            <strong>Catatan Audit Verifikator Pihak Ketiga:</strong>
            <p className="text-[11px] text-purple-900 mt-0.5">
              Verifikator adalah badan audit independen pihak ketiga (bukan bagian yang menyewa langganan). Verifikator bertugas menginspeksi mutu kematangan panen dan menerbitkan Stempel Digital Sah (SHA-256) untuk produk kelompok tani sebelum dipasarkan.
            </p>
          </div>
        </div>
      </div>

      {/* 3. 4 PILIHAN PAKET BERLANGGANAN (CLEAN CARD GRID) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              Pilihan Durasi Berlangganan
            </h2>
            <p className="text-xs text-stone-500">
              Pilih paket yang sesuai dengan siklus produksi dan panen stasiun kopi Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedPlanForCheckout('7_days_trial')}
            className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Aktivasi Trial 7 Hari (Gratis)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = currentSub?.tierId === plan.id;
            const isPopular = plan.isPopular;
            const isBest = plan.isBestValue;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 flex flex-col justify-between transition-all relative border bg-white ${
                  isBest
                    ? 'border-purple-500 shadow-lg shadow-purple-500/10 ring-2 ring-purple-500/20'
                    : isPopular
                    ? 'border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                    : 'border-stone-200/90 shadow-2xs hover:shadow-md'
                }`}
              >
                {/* Badges on top */}
                {isBest && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-700 text-white font-black text-[10px] uppercase tracking-wider shadow-xs whitespace-nowrap">
                    Paling Hemat • 4 Bulan Gratis
                  </div>
                )}
                {isPopular && !isBest && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider shadow-xs whitespace-nowrap">
                    Paling Populer • 1 Siklus Panen
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 inline-block mb-1.5">
                      {plan.badge}
                    </span>
                    <h3 className="text-lg font-black text-stone-900 tracking-tight">{plan.name}</h3>
                    <p className="text-xs text-stone-500 mt-1 min-h-[32px]">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="pt-3 border-t border-stone-100 space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-stone-500">Rp</span>
                      <span className="text-2xl sm:text-3xl font-black text-stone-900">
                        {plan.totalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        /{plan.durationDays === 365 ? 'thn' : `${plan.durationDays} hr`}
                      </span>
                    </div>

                    {plan.savingsNote && (
                      <p className="text-[11px] font-bold text-emerald-700">
                        &check; Setara Rp {plan.monthlyEquivalent.toLocaleString()}/bln ({plan.savingsNote})
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-2 pt-3 border-t border-stone-100">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Fasilitas Termasuk:
                    </p>
                    <ul className="space-y-2 text-xs text-stone-600">
                      {plan.features.slice(0, 5).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-5 mt-5 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setSelectedPlanForCheckout(plan.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                      isBest
                        ? 'bg-purple-700 hover:bg-purple-800 text-white'
                        : isPopular
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    <span>{isCurrent ? 'Perpanjang Paket Ini' : 'Pilih Paket Ini'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. RIWAYAT FAKTUR & INVOICE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900">Riwayat Faktur &amp; Bukti Pembayaran</h3>
            <p className="text-xs text-stone-500">
              Daftar bukti pembayaran sewa layanan resmi ekosistem sangrAI.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-400 font-bold">
            Total Faktur: {currentSub?.invoices?.length || 1}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-bold border-b border-stone-200">
              <tr>
                <th className="px-4 py-3">No. Invoice</th>
                <th className="px-4 py-3">Tanggal Bayar</th>
                <th className="px-4 py-3">Paket Layanan</th>
                <th className="px-4 py-3">Nominal</th>
                <th className="px-4 py-3">Metode Bayar</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {currentSub && currentSub.invoices && currentSub.invoices.length > 0 ? (
                currentSub.invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-stone-50/60">
                    <td className="px-4 py-3 font-mono font-bold text-stone-900">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3">{inv.date}</td>
                    <td className="px-4 py-3 font-medium">{inv.tierName}</td>
                    <td className="px-4 py-3 font-bold text-stone-900">Rp {inv.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 uppercase text-[11px] font-semibold">{inv.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {inv.status === 'paid' ? 'Lunas' : inv.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="hover:bg-stone-50/60">
                  <td className="px-4 py-3 font-mono font-bold text-stone-900">INV/20261109/SUB-0982</td>
                  <td className="px-4 py-3">09 Nov 2026</td>
                  <td className="px-4 py-3 font-medium">Bundle 3 Bulan (Musim Panen)</td>
                  <td className="px-4 py-3 font-bold text-stone-900">Rp 1.299.000</td>
                  <td className="px-4 py-3 uppercase text-[11px] font-semibold">QRIS Realtime</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Lunas
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL CHECKOUT & AKTIVASI LANGGANAN 1-KLIK */}
      {selectedPlanForCheckout && chosenPlanObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-stone-900">Konfirmasi Aktivasi Paket</h3>
                <p className="text-xs text-stone-500">Aktivasi instan workstation ERP SangrAI</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanForCheckout(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                Paket yang Dipilih:
              </span>
              <h4 className="font-extrabold text-base text-stone-900">{chosenPlanObj.name}</h4>
              <p className="text-xs text-stone-600">{chosenPlanObj.tagline}</p>
              <div className="pt-2 text-lg font-black text-stone-900">
                Total Tagihan: Rp {chosenPlanObj.totalPrice.toLocaleString()}
              </div>
            </div>

            {/* Pilihan Metode Bayar */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">Pilih Metode Pembayaran:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'qris', name: 'QRIS Realtime' },
                  { id: 'bank_transfer', name: 'Virtual Account Bank' },
                  { id: 'credit_card', name: 'Kartu Kredit / Debit' },
                  { id: 'wallet', name: 'Saldo E-Wallet' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setCheckoutPaymentMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      checkoutPaymentMethod === m.id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPlanForCheckout(null)}
                className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCheckoutSubmit}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4" />
                <span>Bayar &amp; Aktifkan</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
