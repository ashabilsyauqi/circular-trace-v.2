import React from 'react';
import {
  Cog,
  ShoppingCart,
  Layers,
  CheckCircle2,
  TrendingUp,
  Star,
  ChevronRight,
  History,
  Flame,
  Scale,
  Droplets,
  Award,
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { calculateProcessorEcoRating } from '../../utils/ecoRating';
import { MetricCard } from '../admin/MetricCard';

interface DashboardModuleProps {
  onNavigate: (tab: 'sourcing' | 'batches' | 'inventory' | 'history') => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ onNavigate }) => {
  const { currentUser, farmerLots, processedLots, processingBatches, transactions } = useCoffee();

  const availableFarmerLots = farmerLots.filter((lot) => lot.availableWeightKg > 0);
  const myProcessedLots = processedLots.filter((lot) => lot.processorId === currentUser?.id || true);
  const inProgressBatches = processingBatches.filter((b) => b.status === 'in_progress');
  const myProcessorTransactions = transactions.filter(
    (trx) =>
      trx.fromName === currentUser?.name ||
      trx.toName === currentUser?.name ||
      trx.fromRole === 'pengolah' ||
      trx.toRole === 'pengolah'
  );

  const totalProcessedKg = myProcessedLots.reduce((acc, curr) => acc + curr.greenBeanWeightKg, 0);
  const availableGreenBeanKg = myProcessedLots.reduce((acc, curr) => acc + curr.availableWeightKg, 0);

  const myEcoRatings = myProcessedLots.map((lot) =>
    calculateProcessorEcoRating(
      lot.wasteManagement,
      lot.sourceTotalCherryWeightKg || lot.greenBeanWeightKg * 5,
      lot.greenBeanWeightKg
    )
  );

  const avgEcoScore =
    myEcoRatings.length > 0
      ? Math.round(myEcoRatings.reduce((acc, curr) => acc + curr.ecoScore, 0) / myEcoRatings.length)
      : 98;

  const avgStarRating =
    myEcoRatings.length > 0
      ? Number((myEcoRatings.reduce((acc, curr) => acc + curr.starRating, 0) / myEcoRatings.length).toFixed(2))
      : 4.92;

  const totalWasteManagedKg = myProcessedLots.reduce(
    (acc, curr) => acc + (curr.wasteManagement?.weightKgOrLiters || Math.round(curr.greenBeanWeightKg * 2.2)),
    0
  );

  const quickActions: {
    tab: 'sourcing' | 'batches' | 'inventory' | 'history';
    icon: React.ElementType;
    label: string;
    hint: string;
    color: string;
  }[] = [
    {
      tab: 'sourcing',
      icon: ShoppingCart,
      label: '1. Sourcing Ceri Petani',
      hint: `${availableFarmerLots.length} lot ceri siap dibeli`,
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    },
    {
      tab: 'batches',
      icon: Flame,
      label: '2. Batch Processing (7 Stages)',
      hint: `${inProgressBatches.length} batch aktif berjalan`,
      color: 'bg-orange-500/10 text-orange-700 border-orange-200',
    },
    {
      tab: 'inventory',
      icon: Layers,
      label: '3. Katalog & Limbah Sirkular',
      hint: `${myProcessedLots.length} lot green bean`,
      color: 'bg-amber-500/10 text-amber-700 border-amber-200',
    },
    {
      tab: 'history',
      icon: History,
      label: '4. Riwayat Transaksi Ledger',
      hint: `${myProcessorTransactions.length} rekam transaksi`,
      color: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-amber-900/60">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30 backdrop-blur-xs">
            <Cog className="w-4 h-4 text-amber-400" />
            <span>Mill Tier 2 • Stasiun Pengolahan Kopi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Workstation Pengolahan Ceri &amp; 7-Stage Post-Harvest ERP
          </h1>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
            Inisiasi pengadaan ceri segar petani, pantau kurva fermentasi &amp; kadar air harian, kelola rendemen (mass balance) tanpa susut anomali, dan alokasikan limbah sirkular bernilai tambah.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-stone-300 pt-1">
            <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Rating Sirkular: <strong>{avgStarRating} / 5.00 ⭐ ({avgEcoScore} Pts)</strong>
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs">
              Limbah Terkelola: <strong className="text-emerald-300">{totalWasteManagedKg.toLocaleString()} kg</strong>
            </span>
          </div>
        </div>

        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
          <Cog className="w-48 h-48" />
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Ceri Tersedia di Petani"
          value={`${farmerLots.reduce((a, b) => a + b.availableWeightKg, 0).toLocaleString()} kg`}
          subtitle="Bahan baku siap dibeli"
          icon={<ShoppingCart className="w-5 h-5 text-emerald-600" />}
          color="emerald"
          trend={{ value: 'Stok Baru', isPositive: true }}
        />

        <MetricCard
          title="Batch Aktif di Stasiun"
          value={`${inProgressBatches.length} Batch`}
          subtitle="Tahap 1-7 terkontrol"
          icon={<Flame className="w-5 h-5 text-amber-600" />}
          color="amber"
          trend={{ value: 'Live Work Order', isPositive: true }}
        />

        <MetricCard
          title="Green Bean Siap Jual"
          value={`${availableGreenBeanKg.toLocaleString()} kg`}
          subtitle="Tersedia untuk Gudang/Roastery"
          icon={<CheckCircle2 className="w-5 h-5 text-blue-600" />}
          color="blue"
          badge="Siap Kirim"
        />

        <MetricCard
          title="Buku Besar Transaksi"
          value={`${myProcessorTransactions.length} Log`}
          subtitle="Beli ceri &amp; jual green bean"
          icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
          color="purple"
          trend={{ value: '100% Tercatat', isPositive: true }}
        />
      </div>

      {/* Quick Actions into the 4 Processor Pipeline Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const ActionIcon = action.icon;
          return (
            <button
              key={action.tab}
              onClick={() => onNavigate(action.tab)}
              className={`group flex items-center justify-between gap-3 p-4 rounded-2xl border bg-white hover:shadow-md transition-all text-left ${action.color}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-current/20 shrink-0">
                  <ActionIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-stone-900 block truncate">{action.label}</span>
                  <span className="text-[11px] text-stone-500 block truncate">{action.hint}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
