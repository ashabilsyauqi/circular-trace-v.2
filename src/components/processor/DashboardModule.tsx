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
  Warehouse,
  Package,
  Store,
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { calculateProcessorEcoRating } from '../../utils/ecoRating';
import { MetricCard } from '../admin/MetricCard';

interface DashboardModuleProps {
  onNavigate: (tab: 'sourcing' | 'batches' | 'inventory' | 'selling' | 'history') => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ onNavigate }) => {
  const { currentUser, farmerLots, processedLots, processingBatches, processorCherryStock, transactions } = useCoffee();

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

  const totalCherryStockKg = processorCherryStock.reduce((acc, curr) => acc + curr.availableWeightKg, 0);
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
    tab: 'sourcing' | 'batches' | 'inventory' | 'selling' | 'history';
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
      tab: 'inventory',
      icon: Warehouse,
      label: '2. Gudang & Silo Stok',
      hint: `${totalCherryStockKg.toLocaleString()} kg ceri, ${availableGreenBeanKg.toLocaleString()} kg GB`,
      color: 'bg-teal-500/10 text-teal-700 border-teal-200',
    },
    {
      tab: 'batches',
      icon: Flame,
      label: '3. Lembar Kerja 7-Stage',
      hint: `${inProgressBatches.length} batch aktif berjalan`,
      color: 'bg-orange-500/10 text-orange-700 border-orange-200',
    },
    {
      tab: 'selling',
      icon: Store,
      label: '4. Marketplace & Penjualan',
      hint: `${myProcessedLots.length} lot green bean siap jual`,
      color: 'bg-amber-500/10 text-amber-700 border-amber-200',
    },
    {
      tab: 'history',
      icon: History,
      label: '5. Riwayat Ledger',
      hint: `${myProcessorTransactions.length} rekam transaksi`,
      color: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#1D4ED8] text-white rounded-2xl p-6 sm:p-7 shadow-md relative overflow-hidden border border-blue-900/60">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/30 backdrop-blur-xs">
            <Cog className="w-4 h-4 text-blue-300" />
            <span>Mill Tier 2 • Stasiun Pengolahan Kopi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Workstation Pengolahan Ceri &amp; 7-Stage Post-Harvest ERP
          </h1>
          <p className="mt-2 text-slate-200 text-xs sm:text-sm leading-relaxed">
            Inisiasi pengadaan ceri segar petani, pantau kurva fermentasi &amp; kadar air harian, kelola rendemen (mass balance) tanpa susut anomali, dan alokasikan limbah sirkular bernilai tambah.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-200 pt-1">
            <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Rating Sirkular: <strong>{avgStarRating} / 5.00 ⭐ ({avgEcoScore} Pts)</strong>
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
              Limbah Terkelola: <strong className="text-emerald-300">{totalWasteManagedKg.toLocaleString()} kg</strong>
            </span>
          </div>
        </div>

        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
          <Cog className="w-48 h-48" />
        </div>
      </div>

      {/* 4 Metric Cards (Skripsi Odoo ERP Stat Buttons) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="o_stat_button !w-full !justify-start !p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <div className="p-2 rounded-lg bg-rose-50 text-rose-700">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <span className="o_stat_value !text-base text-slate-900 font-mono">
              {totalCherryStockKg.toLocaleString()} <span className="text-xs font-normal text-slate-500">kg</span>
            </span>
            <span className="o_stat_text text-slate-500 block">Stok Ceri di Gudang</span>
          </div>
        </div>

        <div className="o_stat_button !w-full !justify-start !p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="o_stat_value !text-base text-slate-900 font-mono">
              {inProgressBatches.length} <span className="text-xs font-normal text-slate-500">Batch</span>
            </span>
            <span className="o_stat_text text-slate-500 block">Batch Aktif di Stasiun</span>
          </div>
        </div>

        <div className="o_stat_button !w-full !justify-start !p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="o_stat_value !text-base text-slate-900 font-mono">
              {availableGreenBeanKg.toLocaleString()} <span className="text-xs font-normal text-slate-500">kg</span>
            </span>
            <span className="o_stat_text text-slate-500 block">Green Bean Siap Jual</span>
          </div>
        </div>

        <div className="o_stat_button !w-full !justify-start !p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="o_stat_value !text-base text-slate-900 font-mono">
              {myProcessorTransactions.length} <span className="text-xs font-normal text-slate-500">Log</span>
            </span>
            <span className="o_stat_text text-slate-500 block">Buku Besar Transaksi</span>
          </div>
        </div>
      </div>

      {/* Quick Actions into the 4 Processor Pipeline Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {quickActions.map((action) => {
          const ActionIcon = action.icon;
          return (
            <button
              key={action.tab}
              onClick={() => onNavigate(action.tab)}
              className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-[#1E3A8A] hover:shadow-md transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center border border-blue-100 shrink-0 group-hover:bg-[#1E3A8A] group-hover:text-white transition-colors">
                  <ActionIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-slate-900 block truncate group-hover:text-[#1E3A8A] transition-colors">{action.label}</span>
                  <span className="text-[11px] text-slate-500 block truncate">{action.hint}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#1E3A8A] transition-all shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
