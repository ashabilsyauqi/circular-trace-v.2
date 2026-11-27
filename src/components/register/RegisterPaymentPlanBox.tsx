import React from 'react';
import { CreditCard, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

interface RegisterPaymentPlanBoxProps {
  role: 'admin_kelompok_tani' | 'gudang' | 'roaster' | 'cafe';
  billingCycle: 'monthly' | 'yearly';
  onChangeCycle: (cycle: 'monthly' | 'yearly') => void;
}

export const RegisterPaymentPlanBox: React.FC<RegisterPaymentPlanBoxProps> = ({
  role,
  billingCycle,
  onChangeCycle,
}) => {
  const planDetails: Record<
    string,
    {
      name: string;
      roleLabel: string;
      monthly: number;
      yearly: number;
      features: string[];
      badge?: string;
      color: string;
    }
  > = {
    admin_kelompok_tani: {
      name: 'Kelompok Tani / Gapoktan',
      roleLabel: 'Pilar Hulu Terpadu',
      badge: 'Bundle 3-in-1',
      monthly: 250000,
      yearly: 2500000,
      color: 'emerald',
      features: [
        'Petani Binaan & Ledger Panen',
        'Peta Poligon Lahan EUDR & Patok BPN',
        'Stasiun Basah (Wet Mill) & Audit ICS',
      ],
    },
    gudang: {
      name: 'Gudang & QA Logistik',
      roleLabel: 'Logistik Green Bean',
      monthly: 450000,
      yearly: 4500000,
      color: 'sky',
      features: [
        'Manajemen Lot Hermetik & Karung',
        'Uji Fisik SCA & Sensor Gudang',
        'Stempel QA & QR Karung Ekspor',
      ],
    },
    roaster: {
      name: 'Artisan Roastery',
      roleLabel: 'Produksi Sangrai & Sensori',
      badge: 'Paling Populer',
      monthly: 650000,
      yearly: 6500000,
      color: 'amber',
      features: [
        'Profil Sangrai & Roast Log Curve',
        'Evaluasi Sensori Cupping SCA 100-pt',
        'Paspor QR Kemasan Kopi Retail',
      ],
    },
    cafe: {
      name: 'Coffee Shop & Kafe',
      roleLabel: 'Meja Kafe & Barista',
      monthly: 350000,
      yearly: 3500000,
      color: 'rose',
      features: [
        'Paspor QR Meja Storytelling',
        'Katalog Resep Barista Manual Brew',
        'Fair Share Transparansi Petani',
      ],
    },
  };

  const current = planDetails[role] || planDetails.roaster;
  const price = billingCycle === 'yearly' ? current.yearly : current.monthly;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-stone-900">
              Paket Langganan {current.name}
            </h4>
            <p className="text-[11px] text-stone-500">{current.roleLabel}</p>
          </div>
        </div>

        {current.badge && (
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            {current.badge}
          </span>
        )}
      </div>

      {/* Cycle Toggle */}
      <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1 border border-stone-200">
        <button
          type="button"
          onClick={() => onChangeCycle('monthly')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
            billingCycle === 'monthly'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Bulanan
        </button>
        <button
          type="button"
          onClick={() => onChangeCycle('yearly')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            billingCycle === 'yearly'
              ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <span>Tahunan</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-900 text-amber-400 font-black uppercase">
            Hemat 2 Bln
          </span>
        </button>
      </div>

      {/* Price Summary */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            {formatRupiah(price)}
          </span>
          <span className="text-xs font-semibold text-stone-500 ml-1">
            /{billingCycle === 'yearly' ? 'tahun' : 'bulan'}
          </span>
        </div>
        <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Akses Penuh Layanan</span>
        </div>
      </div>

      {/* Features preview */}
      <div className="pt-2 border-t border-stone-100 space-y-1.5">
        {current.features.map((feat, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-stone-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{feat}</span>
          </div>
        ))}
      </div>

      {/* Midtrans Trust Badge */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Gateway: <strong>Midtrans Sandbox</strong></span>
        </span>
        <span className="font-semibold text-stone-600">QRIS • VA • CC • GoPay</span>
      </div>
    </div>
  );
};
