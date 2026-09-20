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
import { RoastedBeanLot } from '../types/coffee';
import { WorkOrder } from '../types/roasterErp';
import { TraceabilityModal } from './TraceabilityModal';

// Roastery ERP Modules
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
    workOrders,
    purchaseOrders,
    masterProfiles,
    qcSessions,
    warehouseLots,
    roastedLots,
    salesOrders,
    transactions,
    setActiveView,
    roasterActiveTab,
    setRoasterActiveTab,
  } = useCoffee();

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

  const TAB_TITLES: Record<string, { title: string; subtitle: string; icon: any }> = {
    work_orders: {
      title: 'Work Orders MRP (Antrean Sangrai)',
      subtitle: 'Penjadwalan batch sangrai presisi, pelacakan susut bobot, dan telemetri Artisan',
      icon: Flame,
    },
    purchasing: {
      title: 'Purchasing & Pengadaan Biji Hijau',
      subtitle: 'Penerbitan PO resmi ke petani/pengolah/gudang dan evaluasi sampel lab',
      icon: ShoppingCart,
    },
    production: {
      title: 'Productions, Master Profil & Armada Mesin',
      subtitle: 'Formulasi resep kurva RoR sangrai dan monitoring mesin terkalibrasi',
      icon: Sliders,
    },
    qc: {
      title: 'Quality Control Lab (SCA Cupping & Agtron)',
      subtitle: 'Validasi sensori 10 atribut SCA 100-point dan uji instrumen fisik rilis specialty',
      icon: Award,
    },
    inventory: {
      title: 'Gudang Silo & Manajemen Inventaris',
      subtitle: 'Stok green coffee silo, roasted beans kemasan, dan valve pouch (Audit FIFO)',
      icon: Warehouse,
    },
    selling: {
      title: 'Selling Wholesale & CRM Mitra Cafe',
      subtitle: 'Distribusi biji sangrai rutin ke kedai kopi partner dengan QR silsilah',
      icon: Store,
    },
    history: {
      title: 'Buku Kas & Riwayat Transaksi Roastery',
      subtitle: 'Catatan keuangan digital tersinkronisasi ke buku besar rantai pasok kopi',
      icon: History,
    },
  };

  const currentTabMeta = TAB_TITLES[roasterActiveTab] || TAB_TITLES.work_orders;
  const CurrentTabIcon = currentTabMeta.icon;

  return (
    <div className="space-y-6">
      {/* Odoo 19 Roastery MRP Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#5A3950] via-[#714B67] to-[#3B2234] rounded-3xl border border-[#714B67]/30 p-6 lg:p-7 text-white shadow-xl">
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

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setRoasterActiveTab('work_orders')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                roasterActiveTab === 'work_orders'
                  ? 'bg-amber-400 text-stone-950 font-black shadow-amber-400/20'
                  : 'bg-[#00A09D] hover:bg-[#008986] text-white shadow-[#00A09D]/30'
              }`}
            >
              <Flame className="w-4 h-4" />
              Work Orders ({activeWOsCount} Aktif)
            </button>

            <button
              onClick={() => setActiveView('marketplace')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all backdrop-blur-sm"
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

      {/* Active Module Indicator Banner */}
      <div className="bg-white rounded-2xl px-5 py-3.5 border border-stone-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#714B67]/10 text-[#714B67]">
            <CurrentTabIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 leading-tight">
              {currentTabMeta.title}
            </h2>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {currentTabMeta.subtitle}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500 font-medium bg-[#F8F9FA] px-3 py-1.5 rounded-xl border border-stone-200/80">
          <span className="text-[10px] text-stone-400 uppercase font-bold">Navigasi Aktif:</span>
          <span className="font-bold text-[#714B67] capitalize font-mono">
            sidebar / {roasterActiveTab.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* RENDER ACTIVE ERP MODULE ACCORDING TO SIDEBAR SELECTION */}
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

      {/* CircularTrace Floating Pop-up Chat Bubble Assistant */}
      <CircularTraceAssistant
        onTriggerCreateWO={() => setRoasterActiveTab('work_orders')}
      />
    </div>
  );
};
