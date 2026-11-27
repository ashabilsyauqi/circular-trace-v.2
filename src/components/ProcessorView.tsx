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
  Printer,
} from 'lucide-react';

import { DashboardModule } from './processor/DashboardModule';
import { SourcingModule } from './processor/SourcingModule';
import { BatchesModule } from './processor/BatchesModule';
import { InventoryModule } from './processor/InventoryModule';
import { SellingModule } from './processor/SellingModule';
import { HistoryModule } from './processor/HistoryModule';

export const ProcessorView: React.FC = () => {
  const {
    currentUser,
    users,
    processorActiveTab,
    setProcessorActiveTab,
    farmerLots,
    processorCherryStock,
    processingBatches,
    processedLots,
    transactions,
    openBlankoModal,
  } = useCoffee();

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const userKtId = (currentUser?.kelompokTaniId || currentUser?.id || '').trim().toLowerCase();

  // Scoped farmer cherry intake for this tenant/processor
  const scopedCherryIntake = farmerLots.filter((lot) => {
    if (lot.availableWeightKg <= 0) return false;
    if (isSuperAdmin) return true;

    if (currentUser?.role === 'admin_kelompok_tani') {
      const lotKtId = (lot.kelompokTaniId || '').trim().toLowerCase();
      const isSameKtId = Boolean(userKtId && lotKtId && userKtId === lotKtId);

      const userOrg = (currentUser?.organization || currentUser?.kelompokTaniName || '').trim().toLowerCase();
      const lotOrg = (lot.organization || lot.kelompokTaniName || '').trim().toLowerCase();
      const isSameOrg = Boolean(
        userOrg && lotOrg && (
          lotOrg === userOrg ||
          (userOrg.length > 5 && lotOrg.includes(userOrg)) ||
          (lotOrg.length > 5 && userOrg.includes(lotOrg))
        )
      );

      const isMyFarmer = users.some((u) => {
        if (u.id !== lot.farmerId) return false;
        const farmerKtId = (u.kelompokTaniId || '').trim().toLowerCase();
        return Boolean(userKtId && farmerKtId && userKtId === farmerKtId);
      });

      return isSameKtId || isSameOrg || isMyFarmer;
    }

    if (currentUser?.role === 'pengolah') {
      if (currentUser.kelompokTaniId) return lot.kelompokTaniId === currentUser.kelompokTaniId;
      if (currentUser.id === 'user-pengolah-1') return lot.farmerId === 'user-petani-1' || lot.farmerName?.includes('Asep');
      return false;
    }
    return true;
  });

  // Scoped batches for this processor
  const myBatches = processingBatches.filter((b) => {
    if (isSuperAdmin) return true;
    return b.processorId === currentUser?.id || (currentUser?.kelompokTaniId && b.processorId === currentUser?.kelompokTaniId);
  });
  const inProgressBatches = myBatches.filter((b) => b.status === 'in_progress');

  // Scoped processed green bean lots
  const myProcessedLots = processedLots.filter((l) => {
    if (isSuperAdmin) return true;
    return l.processorId === currentUser?.id || (currentUser?.kelompokTaniId && l.processorId === currentUser?.kelompokTaniId);
  });
  const availableGreenBeanLots = myProcessedLots.filter((l) => l.availableWeightKg > 0);

  // Scoped sales transactions
  const myTransactions = transactions.filter((t) => {
    if (isSuperAdmin) return true;
    return (
      t.fromName === currentUser?.name ||
      t.toName === currentUser?.name ||
      t.fromName === currentUser?.organization ||
      t.toName === currentUser?.organization
    );
  });

  const tabs = [
    {
      id: 'dashboard' as const,
      label: '1. Dashboard Wet Mill',
      icon: LayoutDashboard,
      badge: `${myBatches.length} Total`,
    },
    {
      id: 'sourcing' as const,
      label: '2. Penerimaan Ceri Petani',
      icon: Sprout,
      badge: `${scopedCherryIntake.length} Lot Ceri`,
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
      badge: `${myTransactions.length}`,
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

        <div className="flex items-center gap-2">
          {/* Tombol Blanko Form Pengolah (A4) */}
          <button
            type="button"
            onClick={() => openBlankoModal('pengolah')}
            className="py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-all cursor-pointer shadow-2xs shrink-0"
            title="Cetak & Download Blanko Formulir Pengolah / Wet Mill (A4) untuk Pengisian Lapangan"
          >
            <Printer className="w-3.5 h-3.5 text-amber-600" />
            <span>Blanko Form Pengolah (A4)</span>
          </button>

          <div className="hidden lg:flex items-center gap-2 px-3 text-[11px] text-stone-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Stasiun Wet Mill Aktif</span>
          </div>
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
