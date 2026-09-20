import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Flame,
  ShoppingCart,
  History,
  Award,
  Sliders,
  Store,
  Warehouse,
  ArrowRight,
  LayoutDashboard,
} from 'lucide-react';
import { RoastedBeanLot } from '../types/coffee';
import { WorkOrder } from '../types/roasterErp';
import { TraceabilityModal } from './TraceabilityModal';

// Roastery ERP Modules
import { DashboardModule } from './roaster/DashboardModule';
import { WorkOrdersModule } from './roaster/WorkOrdersModule';
import { PurchasingModule } from './roaster/PurchasingModule';
import { ProductionModule } from './roaster/ProductionModule';
import { QCModule } from './roaster/QCModule';
import { InventoryModule } from './roaster/InventoryModule';
import { SellingModule } from './roaster/SellingModule';
import { CircularTraceAssistant } from './assistant/CircularTraceAssistant';

export const RoasterView: React.FC = () => {
  const {
    currentUser,
    transactions,
    setActiveView,
    roasterActiveTab,
    setRoasterActiveTab,
  } = useCoffee();

  const [selectedQcWO, setSelectedQcWO] = useState<WorkOrder | null>(null);
  const [traceModalLot, setTraceModalLot] = useState<RoastedBeanLot | null>(null);

  const myRoasterTransactions = transactions.filter(
    (t) =>
      t.fromName === currentUser?.name ||
      t.toName === currentUser?.name ||
      t.fromRole === 'roaster' ||
      t.toRole === 'roaster'
  );

  const TAB_TITLES: Record<string, { title: string; subtitle: string; icon: any }> = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Ringkasan bisnis roastery Anda',
      icon: LayoutDashboard,
    },
    work_orders: {
      title: 'Work Orders',
      subtitle: 'Penjadwalan batch sangrai, susut bobot, dan telemetri Artisan',
      icon: Flame,
    },
    purchasing: {
      title: 'Purchasing',
      subtitle: 'Penerbitan PO ke petani/pengolah/gudang dan evaluasi sampel',
      icon: ShoppingCart,
    },
    production: {
      title: 'Production',
      subtitle: 'Master profil sangrai dan armada mesin terkalibrasi',
      icon: Sliders,
    },
    qc: {
      title: 'Quality Control',
      subtitle: 'Validasi sensori SCA cupping dan uji instrumen Agtron',
      icon: Award,
    },
    inventory: {
      title: 'Inventory',
      subtitle: 'Stok green coffee, roasted beans, dan kemasan',
      icon: Warehouse,
    },
    selling: {
      title: 'Selling',
      subtitle: 'Terbitkan roasted bean ke Unified Marketplace & pantau penjualan',
      icon: Store,
    },
    history: {
      title: 'Report',
      subtitle: 'Riwayat transaksi roastery',
      icon: History,
    },
  };

  const currentTabMeta = TAB_TITLES[roasterActiveTab] || TAB_TITLES.dashboard;
  const CurrentTabIcon = currentTabMeta.icon;

  return (
    <div className="space-y-5">
      {/* RENDER ACTIVE ERP MODULE ACCORDING TO SIDEBAR SELECTION */}
      {roasterActiveTab === 'dashboard' && (
        <DashboardModule onNavigate={(tab) => setRoasterActiveTab(tab)} />
      )}

      {roasterActiveTab === 'work_orders' && (
        <WorkOrdersModule
          onNavigateToQC={(wo) => {
            setSelectedQcWO(wo);
            setRoasterActiveTab('qc');
          }}
        />
      )}

      {roasterActiveTab === 'purchasing' && <PurchasingModule />}

      {roasterActiveTab === 'production' && <ProductionModule />}

      {roasterActiveTab === 'qc' && <QCModule initialWorkOrder={selectedQcWO} />}

      {roasterActiveTab === 'inventory' && <InventoryModule />}

      {roasterActiveTab === 'selling' && <SellingModule />}

      {roasterActiveTab === 'history' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Report — Riwayat Transaksi Roastery</h3>
            <span className="text-xs text-slate-500 font-medium">
              Total Transaksi: <strong className="text-slate-900">{myRoasterTransactions.length} Rekam</strong>
            </span>
          </div>

          {myRoasterTransactions.length === 0 ? (
            <p className="text-xs text-slate-500 py-12 text-center">Belum ada riwayat transaksi.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">No. TRX</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Pengirim / Penjual</th>
                    <th className="py-3 px-4">Penerima / Pembeli</th>
                    <th className="py-3 px-4">Komoditas</th>
                    <th className="py-3 px-4">Volume</th>
                    <th className="py-3 px-4">Total Biaya</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myRoasterTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{trx.id}</td>
                      <td className="py-3 px-4 text-slate-600">{trx.date}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{trx.fromName}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{trx.toName}</td>
                      <td className="py-3 px-4 text-slate-700">{trx.itemName}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{trx.quantity}</td>
                      <td className="py-3 px-4 font-black text-slate-900">
                        Rp {trx.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Silsilah Traceability Modal */}
      <TraceabilityModal
        isOpen={!!traceModalLot}
        onClose={() => setTraceModalLot(null)}
        data={traceModalLot}
      />

      {/* CircularTrace Floating Pop-up Chat Bubble Assistant */}
      <CircularTraceAssistant
        onTriggerCreateWO={() => setRoasterActiveTab('work_orders')}
      />
    </div>
  );
};
