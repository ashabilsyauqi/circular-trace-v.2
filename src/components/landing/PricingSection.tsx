import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Warehouse,
  Flame,
  Coffee,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Zap,
  HelpCircle,
} from 'lucide-react';

interface PricingPlan {
  id: string;
  role: 'admin_kelompok_tani' | 'gudang' | 'roaster' | 'cafe';
  name: string;
  subtitle: string;
  badge?: string;
  isPopular?: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
  icon: React.ReactNode;
  themeColor: {
    border: string;
    bgAccent: string;
    textAccent: string;
    btn: string;
    badgeBg: string;
  };
  features: string[];
  registerPath: string;
}

interface PricingSectionProps {
  id?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ id = 'pricing' }) => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans: PricingPlan[] = [
    {
      id: 'kelompok_tani',
      role: 'admin_kelompok_tani',
      name: 'Kelompok Tani / Gapoktan',
      subtitle: 'Pilar Hulu Terpadu (Petani, Wet Mill & ICS)',
      badge: 'Bundle 3-in-1',
      monthlyPrice: 250000,
      yearlyPrice: 2500000,
      icon: <Building2 className="w-5 h-5 text-emerald-600" />,
      themeColor: {
        border: 'border-emerald-200 hover:border-emerald-500',
        bgAccent: 'bg-emerald-50/70',
        textAccent: 'text-emerald-700',
        btn: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      },
      features: [
        'Buku Induk & Ledger Petani Binaan (Unlimited)',
        'Pemetaan Poligon Kebun & Patok BPN (Standar EUDR)',
        'Manajemen Stasiun Basah & Kering (Wet/Dry Mill)',
        'Audit Verifikator Lapangan Internal Control System (ICS)',
        'Penerbitan Sertifikat Traceability Digital & QR Panen',
      ],
      registerPath: '/register/kelompok-tani',
    },
    {
      id: 'gudang',
      role: 'gudang',
      name: 'Gudang & QA Logistik',
      subtitle: 'Manajemen Mutu Stok & Green Bean Pergudangan',
      monthlyPrice: 450000,
      yearlyPrice: 4500000,
      icon: <Warehouse className="w-5 h-5 text-sky-600" />,
      themeColor: {
        border: 'border-sky-200 hover:border-sky-500',
        bgAccent: 'bg-sky-50/70',
        textAccent: 'text-sky-700',
        btn: 'bg-sky-700 hover:bg-sky-800 text-white shadow-sky-700/20',
        badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
      },
      features: [
        'Manajemen Inventori Hermetik & Stok Lot Karung',
        'Lembar Uji Fisik SCA (Moisture & Water Activity)',
        'Integrasi Pemantauan Suhu & Kelembaban Gudang',
        'Stempel Verifikasi Mutu & Grading Standar Ekspor',
        'Penerbitan QR Karung Traceability Hijau',
      ],
      registerPath: '/register/gudang',
    },
    {
      id: 'roaster',
      role: 'roaster',
      name: 'Artisan Roastery',
      subtitle: 'Kontrol Mesin Sangrai & Evaluasi Sensori Cupping',
      badge: 'Paling Populer',
      isPopular: true,
      monthlyPrice: 650000,
      yearlyPrice: 6500000,
      icon: <Flame className="w-5 h-5 text-amber-600" />,
      themeColor: {
        border: 'border-amber-400 ring-2 ring-amber-500/30',
        bgAccent: 'bg-amber-50/80',
        textAccent: 'text-amber-800',
        btn: 'bg-amber-600 hover:bg-amber-500 text-stone-950 font-black shadow-amber-600/30',
        badgeBg: 'bg-amber-500 text-stone-950 font-black border-amber-600',
      },
      features: [
        'Pencatatan Profil Mesin Sangrai & Roast Curve Log',
        'Lembar Evaluasi Uji Sensori Cupping SCA 100-Point',
        'Sourcing Green Bean Terverifikasi Asli Hulu Kebun',
        'Penerbitan Paspor QR Kemasan Kopi Retail',
        'Koneksi Otomatis ke Marketplace Pasar Kopi',
      ],
      registerPath: '/register/roaster',
    },
    {
      id: 'cafe',
      role: 'cafe',
      name: 'Coffee Shop & Kafe',
      subtitle: 'Transparansi Meja Kafe & Resep Seduhan Barista',
      monthlyPrice: 350000,
      yearlyPrice: 3500000,
      icon: <Coffee className="w-5 h-5 text-rose-600" />,
      themeColor: {
        border: 'border-rose-200 hover:border-rose-500',
        bgAccent: 'bg-rose-50/70',
        textAccent: 'text-rose-700',
        btn: 'bg-stone-900 hover:bg-stone-800 text-amber-400 shadow-stone-900/20',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
      },
      features: [
        'Paspor QR Meja Kafe (Story Petani ke Cangkir Konsumen)',
        'Katalog Resep Barista (V60, Aeropress, Espresso)',
        'Transparansi Fair Share Margin Petani & Pengolah',
        'Umpan Balik Konsumen & Interaksi Langsung Penikmat',
        'Manajemen Multi-Meja & Akses Staf Barista',
      ],
      registerPath: '/register/coffee-shop',
    },
  ];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    navigate(`${plan.registerPath}?plan=${billingCycle}`);
  };

  return (
    <section id={id} className="py-20 sm:py-28 bg-[#FAF7F2] text-stone-900 relative overflow-hidden border-t border-stone-200">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Paket Langganan Platform Berbayar</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight leading-tight">
            Transparan Tanpa Biaya Tersembunyi
          </h2>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Pilih pilar layanan operasional yang sesuai dengan bisnis Anda. Daftar langsung bayar dengan integrasi gateway pembayaran Midtrans Sandbox yang aman dan instan.
          </p>

          {/* Monthly / Yearly Billing Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="bg-stone-200/80 p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-stone-300/80">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Bayar Bulanan
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'yearly'
                    ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>Bayar Tahunan</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-950 text-amber-400 font-extrabold uppercase tracking-wider">
                  Hemat 2 Bln
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mt-12 sm:mt-16 items-stretch">
          {plans.map((plan) => {
            const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
            const periodLabel = billingCycle === 'yearly' ? '/ tahun' : '/ bulan';

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 ${plan.themeColor.border} ${
                  plan.isPopular ? 'shadow-amber-500/10' : ''
                }`}
              >
                {/* Popular / Bundle Ribbon Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm ${plan.themeColor.badgeBg}`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Card Header & Price */}
                <div className="p-6 sm:p-7 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${plan.themeColor.bgAccent} border border-stone-200/50`}>
                      {plan.icon}
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                      {plan.role.replace('admin_', '')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-stone-900 leading-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 min-h-[32px] leading-snug">
                      {plan.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
                        {formatRupiah(price)}
                      </span>
                      <span className="text-xs font-semibold text-stone-500">
                        {periodLabel}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
                        Setara {formatRupiah(Math.round(plan.yearlyPrice / 12))} / bulan
                      </p>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      Termasuk Fitur:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button Footer */}
                <div className="p-6 sm:p-7 pt-0">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${plan.themeColor.btn}`}
                  >
                    <span>Pilih Paket &amp; Daftar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-center text-stone-400 mt-2">
                    Bayar aman via Midtrans Sandbox
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Midtrans Trust & Payment Channels Banner */}
        <div className="mt-14 max-w-4xl mx-auto bg-stone-900 text-stone-300 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Gerbang Pembayaran Terverifikasi
                </span>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400 text-stone-950">
                  Sandbox Active
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5 max-w-md">
                Didukung oleh <strong>Midtrans Payment Gateway</strong> (QRIS, GoPay, ShopeePay, Virtual Account BCA/Mandiri/BNI/BRI, dan Kartu Kredit).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-[11px] font-bold text-stone-200 flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Multi-Channel Payment</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Instan Aktivasi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
