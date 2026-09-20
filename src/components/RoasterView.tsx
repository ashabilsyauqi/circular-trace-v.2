import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Flame,
  ShoppingCart,
  Layers,
  History,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  X,
  Coffee,
  Crown,
  ShieldCheck,
  Filter,
  Search,
  Sliders,
  Calendar,
  Store,
  Warehouse,
  PlusCircle,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { WarehouseLot, RoastedBeanLot, WarehouseGradeTier } from '../types/coffee';
import { WorkOrder } from '../types/roasterErp';
import { TraceabilityModal } from './TraceabilityModal';
import { CoffeeSensorySpiderChart } from './CoffeeSensorySpiderChart';
import { MetricCard } from './admin/MetricCard';

// Qrema Roastery ERP Modules
import { WorkOrdersModule } from './roaster/WorkOrdersModule';
import { PurchasingModule } from './roaster/PurchasingModule';
import { ProductionModule } from './roaster/ProductionModule';
import { QCModule } from './roaster/QCModule';
import { InventoryModule } from './roaster/InventoryModule';
import { SellingModule } from './roaster/SellingModule';
import { QremaAIAssistant } from './roaster/QremaAIAssistant';

export const RoasterView: React.FC = () => {
  const {
    currentUser,
    workOrders,
    purchaseOrders,
    masterProfiles,
    qcSessions,
    warehouseLots,
    roastedLots,
    salesOrders,
    transactions,
    setActiveView,
  } = useCoffee();

  const [activeTab, setActiveTab] = useState<
    'work_orders' | 'purchasing' | 'production' | 'qc' | 'inventory' | 'selling' | 'marketplace' | 'history'
  >('work_orders');

  const [selectedQcWO, setSelectedQcWO] = useState<WorkOrder | null>(null);
  const [traceModalLot, setTraceModalLot] = useState<RoastedBeanLot | null>(null);

  // Badge Counters
  const activeWOsCount = workOrders.filter((w) => w.status !== 'completed').length;
  const activePOsCount = purchaseOrders.filter((p) => p.status !== 'received').length;
  const activeQcCount = qcSessions.length;
  const activeSalesCount = salesOrders.filter((s) => s.status !== 'dispatched').length;

  const myRoasterTransactions = transactions.filter(
    (t) =>
      t.fromName === currentUser?.name ||
      t.toName === currentUser?.name ||
      t.fromRole === 'roaster' ||
      t.toRole === 'roaster'
  );

  return (
    <div className="space-y-6">
      {/* Qrema Header Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-3xl border border-stone-800 p-6 lg:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3 backdrop-blur-sm">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Qrema Specialty Coffee Roastery ERP Suite</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
            Pusat Operasional & Komando Roastery
          </h1>
          <p className="mt-2 text-stone-300 text-xs lg:text-sm leading-relaxed">
            Kelola alur kerja sangrai presisi dari pengadaan green bean, penjadwalan <em>Work Orders</em>, sinkronisasi kurva suhu Artisan, uji mutu <em>SCA Cupping Lab</em>, hingga pemenuhan <em>Sales Orders</em> ke kedai kopi mitra.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('work_orders')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95"
            >
              <Flame className="w-4 h-4 fill-current" />
              Buka Work Orders ({activeWOsCount} Aktif)
            </button>
            <button
              onClick={() => setActiveView('marketplace')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-amber-300" />
              Marketplace Pengadaan Biji
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ambient Decorative Background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 opacity-10 pointer-events-none text-white">
          <Flame className="w-96 h-96" />
        </div>
      </div>

      {/* Qrema AI Assistant Command Palette */}
      <QremaAIAssistant
        onNavigateTab={(tab) => setActiveTab(tab as any)}
        onTriggerCreateWO={() => setActiveTab('work_orders')}
      />

      {/* Master ERP Navigation Tabs Bar */}
      <div className="bg-white rounded-2xl p-1.5 border border-stone-200 shadow-xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('work_orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'work_orders'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Work Orders ({workOrders.length})</span>
          {activeWOsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black">
              {activeWOsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('purchasing')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'purchasing'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4 text-blue-400" />
          <span>Purchasing ({purchaseOrders.length})</span>
          {activePOsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-blue-500 text-white text-[10px] font-black">
              {activePOsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('production')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'production'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Sliders className="w-4 h-4 text-orange-400" />
          <span>Productions ({masterProfiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('qc')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'qc'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" />
          <span>Quality Control ({activeQcCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Warehouse className="w-4 h-4 text-emerald-400" />
          <span>Inventory ({warehouseLots.length} Lot)</span>
        </button>

        <button
          onClick={() => setActiveTab('selling')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'selling'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Store className="w-4 h-4 text-amber-300" />
          <span>Selling Wholesale ({salesOrders.length})</span>
          {activeSalesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-black">
              {activeSalesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Buku Kas ({myRoasterTransactions.length})</span>
        </button>
      </div>

      {/* RENDER ACTIVE ERP MODULE */}
      {activeTab === 'work_orders' && (
        <WorkOrdersModule
          onNavigateToQC={(wo) => {
            setSelectedQcWO(wo);
            setActiveTab('qc');
          }}
        />
      )}

      {activeTab === 'purchasing' && <PurchasingModule />}

      {activeTab === 'production' && <ProductionModule />}

      {activeTab === 'qc' && <QCModule initialWorkOrder={selectedQcWO} />}

      {activeTab === 'inventory' && <InventoryModule />}

      {activeTab === 'selling' && <SellingModule />}

      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <History className="w-5 h-5 text-stone-800" />
              Buku Kas & Riwayat Transaksi Roastery
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              Total Transaksi: <strong>{myRoasterTransactions.length} Rekam</strong>
            </span>
          </div>

          {myRoasterTransactions.length === 0 ? (
            <p className="text-xs text-stone-500 py-12 text-center">Belum ada riwayat transaksi.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
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
                <tbody className="divide-y divide-stone-100">
                  {myRoasterTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-stone-800">{trx.id}</td>
                      <td className="py-3 px-4 text-stone-600">{trx.date}</td>
                      <td className="py-3 px-4 font-semibold text-stone-900">{trx.fromName}</td>
                      <td className="py-3 px-4 font-semibold text-stone-900">{trx.toName}</td>
                      <td className="py-3 px-4 text-stone-700">{trx.itemName}</td>
                      <td className="py-3 px-4 font-bold text-stone-800">{trx.quantity}</td>
                      <td className="py-3 px-4 font-black text-stone-900">
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
    </div>
  );
};
