import React from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  LayoutDashboard,
  Sprout,
  Cog,
  Warehouse,
  Store,
  History,
  ShieldCheck,
  Droplets,
  Layers,
} from 'lucide-react';

import { DashboardModule } from './processor/DashboardModule';
import { SourcingModule } from './processor/SourcingModule';
import { BatchesModule } from './processor/BatchesModule';
import { InventoryModule } from './processor/InventoryModule';
import { SellingModule } from './processor/SellingModule';
import { HistoryModule } from './processor/HistoryModule';

export const ProcessorView: React.FC = () => {
  const {
    processorActiveTab,
    setProcessorActiveTab,
    farmerLots,
    processorCherryStock,
    processingBatches,
    processedLots,
    transactions,
  } = useCoffee();

  const availableCherryIntake = farmerLots.filter((l) => l.availableWeightKg > 0);
  const inProgressBatches = processingBatches.filter((b) => b.status === 'in_progress');
  const availableGreenBeanLots = processedLots.filter((l) => l.availableWeightKg > 0);

  const tabs = [
    {
      id: 'dashboard' as const,
      label: '1. Dashboard Wet Mill',
      icon: LayoutDashboard,
      badge: `${processingBatches.length} Total`,
    },
    {
      id: 'sourcing' as const,
      label: '2. Penerimaan Ceri Petani',
      icon: Sprout,
      badge: `${availableCherryIntake.length} Lot Ceri`,
      badgeColor: 'bg-emerald-500/20 text-emerald-800',
    },
    {
      id: 'batches' as const,
      label: '3. Batch Pengolahan (7 Metode)',
      icon: Cog,
      badge: `${inProgressBatches.length} Aktif`,
      badgeColor: 'bg-amber-500/20 text-amber-800 font-bold',
    },
    {
      id: 'inventory' as const,
      label: '4. Gudang Green Bean',
      icon: Warehouse,
      badge: `${availableGreenBeanLots.length} Lot Siap`,
      badgeColor: 'bg-blue-500/20 text-blue-800',
    },
    {
      id: 'selling' as const,
      label: '5. Rilis Pasar / Penjualan',
      icon: Store,
      badge: 'Marketplace',
    },
    {
      id: 'history' as const,
      label: '6. Riwayat Transaksi',
      icon: History,
      badge: `${transactions.length}`,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Navigation Tab Strip (AdminLTE ERP Style) */}
      <div className="bg-white p-1.5 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = processorActiveTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setProcessorActiveTab(tab.id)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs font-black'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-amber-400' : 'text-stone-400'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      tab.badgeColor ||
                      (isActive
                        ? 'bg-amber-500/30 text-amber-200'
                        : 'bg-stone-100 text-stone-600')
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 text-[11px] text-stone-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Stasiun Wet Mill Aktif</span>
        </div>
      </div>

      {/* Tab Module Content */}
      <div>
        {processorActiveTab === 'dashboard' && (
          <DashboardModule onNavigate={(tab) => setProcessorActiveTab(tab)} />
        )}
        {processorActiveTab === 'sourcing' && <SourcingModule />}
        {processorActiveTab === 'batches' && <BatchesModule />}
        {processorActiveTab === 'inventory' && <InventoryModule />}
        {processorActiveTab === 'selling' && <SellingModule />}
        {processorActiveTab === 'history' && <HistoryModule />}
      </div>
    </div>
  );
};
