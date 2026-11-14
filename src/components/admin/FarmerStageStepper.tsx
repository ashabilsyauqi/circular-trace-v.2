import React from 'react';
import {
  Users,
  TreePine,
  Package,
  History,
  Store,
  Printer,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { FarmerTab } from '../../context/CoffeeContext';

interface FarmerStageStepperProps {
  activeTab: FarmerTab;
  onSelectTab: (tab: FarmerTab) => void;
  farmerCount: number;
  farmCount: number;
  lotCount: number;
  releasedCount: number;
  transactionCount: number;
  onOpenFormsModal: () => void;
}

export const FarmerStageStepper: React.FC<FarmerStageStepperProps> = ({
  activeTab,
  onSelectTab,
  farmerCount,
  farmCount,
  lotCount,
  releasedCount,
  transactionCount,
  onOpenFormsModal,
}) => {
  const stages: {
    id: FarmerTab;
    stepNumber: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
    badgeColor?: string;
  }[] = [
    {
      id: 'master_petani',
      stepNumber: '01',
      title: 'Data Master Petani',
      subtitle: 'Biodata, NIK & Cetak KTA Barcode',
      icon: Users,
      badge: `${farmerCount} Petani`,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'master_kebun',
      stepNumber: '02',
      title: 'Data Master Kebun',
      subtitle: 'Plot Lahan & Peta Geolocation EUDR',
      icon: TreePine,
      badge: `${farmCount} Kebun`,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'master_panen',
      stepNumber: '03',
      title: 'Data Hasil Panen',
      subtitle: 'Input Ceri, Brix & Barcode Karung',
      icon: Package,
      badge: `${lotCount} Lot Ceri`,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      id: 'history',
      stepNumber: '04',
      title: 'Buku Kas & Ledger',
      subtitle: 'Catatan Penjualan Ceri & Mutasi Kas',
      icon: History,
      badge: `${transactionCount} Transaksi`,
      badgeColor: 'bg-stone-100 text-stone-700 border-stone-300',
    },
  ];

  return (
    <div className="space-y-3">
      {/* Top Bar with Stage Title & Printable Forms Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950">
              Alur Tahapan Terpadu Layanan Petani (Hulu Kelompok Tani)
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Ikuti 4 tahapan berantai: Daftarkan Petani &rarr; Petakan Kebun Milik Petani &rarr; Catat Hasil Panen &rarr; Rilis ke Pasar / Kirim ke Pengolah.
          </p>
        </div>

        {/* Action Button: Cetak Blanko A4 Fisik */}
        <button
          type="button"
          onClick={onOpenFormsModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-all cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
          title="Cetak & Download Blanko Formulir Petani (A4)"
        >
          <Printer className="w-4 h-4 text-amber-600" />
          <span>Blanko Form Petani (A4)</span>
        </button>
      </div>

      {/* Visual Horizontal Stage Stepper Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isActive =
            activeTab === stage.id ||
            (stage.id === 'master_kebun' && activeTab === 'farms') ||
            (stage.id === 'master_panen' && (activeTab === 'catalog' || activeTab === 'upload'));

          return (
            <button
              key={stage.id}
              onClick={() => onSelectTab(stage.id)}
              className={`relative text-left p-4 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col justify-between overflow-hidden ${
                isActive
                  ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs'
              }`}
            >
              {/* Active Glow Accent Bar on top */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400" />
              )}

              <div>
                {/* Header: Step Number & Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md font-mono ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}
                    >
                      TAHAP {stage.stepNumber}
                    </span>
                    {isActive && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md">
                        <Sparkles className="w-2.5 h-2.5" /> Sedang Aktif
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isActive
                        ? 'bg-white/10 text-stone-200 border-white/20'
                        : stage.badgeColor || 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {stage.badge}
                  </span>
                </div>

                {/* Title and Icon */}
                <div className="flex items-center gap-2.5 mt-1">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-emerald-500 text-stone-950 font-black shadow-sm'
                        : 'bg-stone-100 text-stone-700 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={`font-black text-sm tracking-tight truncate ${
                        isActive ? 'text-white' : 'text-stone-900 group-hover:text-emerald-800'
                      }`}
                    >
                      {stage.title}
                    </h3>
                    <p
                      className={`text-[11px] truncate mt-0.5 ${
                        isActive ? 'text-stone-300' : 'text-stone-500'
                      }`}
                    >
                      {stage.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Footer indicator */}
              <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] font-bold">
                <span
                  className={
                    isActive ? 'text-emerald-400' : 'text-stone-400 group-hover:text-emerald-700'
                  }
                >
                  {isActive ? 'Sedang Dikelola' : 'Buka Tahap Ini'}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                    isActive ? 'text-emerald-400' : 'text-stone-400'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
