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
    t,
  } = useCoffee();

  const [selectedQcWO, setSelectedQcWO] = useState<WorkOrder | null>(null);
  const [traceModalLot, setTraceModalLot] = useState<RoastedBeanLot | null>(null);

  const myRoasterTransactions = transactions.filter(
    (trx) =>
      trx.fromName === currentUser?.name ||
      trx.toName === currentUser?.name ||
      trx.fromRole === 'roaster' ||
      trx.toRole === 'roaster'
  );

  const TAB_TITLES: Record<string, { title: string; subtitle: string; icon: any }> = {
    dashboard: {
      title: t('module.dashboard.title'),
      subtitle: t('module.dashboard.subtitle'),
      icon: LayoutDashboard,
    },
    work_orders: {
      title: t('module.workOrders.title'),
      subtitle: t('module.workOrders.subtitle'),
      icon: Flame,
    },
    purchasing: {
      title: t('module.purchasing.title'),
      subtitle: t('module.purchasing.subtitle'),
      icon: ShoppingCart,
    },
    production: {
      title: t('module.production.title'),
      subtitle: t('module.production.subtitle'),
      icon: Sliders,
    },
    qc: {
      title: t('module.qc.title'),
      subtitle: t('module.qc.subtitle'),
      icon: Award,
    },
    inventory: {
      title: t('module.inventory.title'),
      subtitle: t('module.inventory.subtitle'),
      icon: Warehouse,
    },
    selling: {
      title: t('module.selling.title'),
      subtitle: t('module.selling.subtitle'),
      icon: Store,
    },
    history: {
      title: t('module.history.title'),
      subtitle: t('module.history.subtitle'),
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
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-[#FAF7F2]">
            <div>
              <h3 className="text-base font-bold text-stone-900">Riwayat Transaksi Roastery</h3>
              <p className="text-xs text-stone-500 mt-0.5">Semua transaksi masuk &amp; keluar yang melibatkan roastery Anda.</p>
            </div>
            <span className="text-xs text-stone-500 font-medium bg-white border border-stone-200 rounded-xl px-3 py-1.5">
              Total: <strong className="text-stone-900">{myRoasterTransactions.length} Rekam</strong>
            </span>
          </div>

          {myRoasterTransactions.length === 0 ? (
            <p className="text-xs text-stone-500 py-16 text-center">Belum ada riwayat transaksi.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-5">No. TRX</th>
                    <th className="py-4 px-5">Tanggal</th>
                    <th className="py-4 px-5">Pengirim / Penjual</th>
                    <th className="py-4 px-5">Penerima / Pembeli</th>
                    <th className="py-4 px-5">Komoditas</th>
                    <th className="py-4 px-5">Volume</th>
                    <th className="py-4 px-5">Total Biaya</th>
                    <th className="py-4 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {myRoasterTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-sm text-stone-700">{trx.id}</td>
                      <td className="py-4 px-5 text-stone-600">{trx.date}</td>
                      <td className="py-4 px-5 font-semibold text-stone-900">{trx.fromName}</td>
                      <td className="py-4 px-5 font-semibold text-stone-900">{trx.toName}</td>
                      <td className="py-4 px-5 text-stone-700">{trx.itemName}</td>
                      <td className="py-4 px-5 font-bold text-stone-800">{trx.quantity}</td>
                      <td className="py-4 px-5 font-black text-sm text-stone-900">
                        Rp {trx.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
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
