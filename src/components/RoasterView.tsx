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
  Zap,
} from 'lucide-react';
import { WarehouseLot, RoastedBeanLot } from '../types/coffee';
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
      {/* Odoo 19 Roastery MRP Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#5A3950] via-[#714B67] to-[#3B2234] rounded-3xl border border-[#714B67]/30 p-6 lg:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-3 backdrop-blur-sm">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-bold tracking-wide">CCT ERP 19 • Roastery Manufacturing Suite</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A09D] animate-pulse" />
          </div>

          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
            Pusat Operasional & Komando Roastery
          </h1>
          <p className="mt-2 text-stone-200 text-xs lg:text-sm leading-relaxed">
            Kelola alur kerja sangrai presisi dari pengadaan green bean, penjadwalan <em>Work Orders</em>, sinkronisasi kurva suhu Artisan, uji mutu <em>SCA Cupping Lab</em>, hingga pemenuhan <em>Sales Orders</em> ke kedai kopi mitra.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('work_orders')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00A09D] hover:bg-[#008986] text-white font-bold text-xs transition-all shadow-md shadow-[#00A09D]/30 active:scale-95"
            >
              <Flame className="w-4 h-4" />
              Buka Work Orders ({activeWOsCount} Aktif)
            </button>
            <button
              onClick={() => setActiveView('marketplace')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all backdrop-blur-sm"
            >
              <ShoppingCart className="w-4 h-4 text-amber-300" />
              Marketplace Biji Kopi
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ambient Decorative Background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 opacity-10 pointer-events-none text-white">
          <Flame className="w-96 h-96" />
        </div>
      </div>

      {/* AI Assistant Command Palette */}
      <QremaAIAssistant
        onNavigateTab={(tab) => setActiveTab(tab as any)}
        onTriggerCreateWO={() => setActiveTab('work_orders')}
      />

      {/* Odoo 19 Master ERP Navigation Tabs Bar */}
      <div className="bg-white rounded-2xl p-1.5 border border-stone-200/90 shadow-xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('work_orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'work_orders'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Flame className={`w-4 h-4 ${activeTab === 'work_orders' ? 'text-amber-300' : 'text-amber-500'}`} />
          <span>Work Orders ({workOrders.length})</span>
          {activeWOsCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === 'work_orders' ? 'bg-[#00A09D] text-white' : 'bg-amber-100 text-amber-900'
            }`}>
              {activeWOsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('purchasing')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'purchasing'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ShoppingCart className={`w-4 h-4 ${activeTab === 'purchasing' ? 'text-blue-300' : 'text-blue-500'}`} />
          <span>Purchasing ({purchaseOrders.length})</span>
          {activePOsCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === 'purchasing' ? 'bg-blue-400 text-stone-900' : 'bg-blue-100 text-blue-900'
            }`}>
              {activePOsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('production')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'production'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Sliders className={`w-4 h-4 ${activeTab === 'production' ? 'text-orange-300' : 'text-orange-500'}`} />
          <span>Productions ({masterProfiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('qc')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'qc'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Award className={`w-4 h-4 ${activeTab === 'qc' ? 'text-purple-300' : 'text-purple-500'}`} />
          <span>Quality Control ({activeQcCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Warehouse className={`w-4 h-4 ${activeTab === 'inventory' ? 'text-emerald-300' : 'text-emerald-500'}`} />
          <span>Inventory ({warehouseLots.length} Lot)</span>
        </button>

        <button
          onClick={() => setActiveTab('selling')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'selling'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Store className={`w-4 h-4 ${activeTab === 'selling' ? 'text-amber-300' : 'text-amber-500'}`} />
          <span>Selling Wholesale ({salesOrders.length})</span>
          {activeSalesCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === 'selling' ? 'bg-[#00A09D] text-white' : 'bg-emerald-100 text-emerald-900'
            }`}>
              {activeSalesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-[#714B67] text-white shadow-xs'
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
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <History className="w-5 h-5 text-[#714B67]" />
              Buku Kas & Riwayat Transaksi Roastery
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              Total Transaksi: <strong className="text-stone-900">{myRoasterTransactions.length} Rekam</strong>
            </span>
          </div>

          {myRoasterTransactions.length === 0 ? (
            <p className="text-xs text-stone-500 py-12 text-center">Belum ada riwayat transaksi.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F9FA] text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
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
                    <tr key={trx.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#714B67]">{trx.id}</td>
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
