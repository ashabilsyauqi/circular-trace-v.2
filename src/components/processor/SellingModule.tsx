import React, { useState } from 'react';
import {
  Store,
  QrCode,
  TrendingUp,
  Coffee,
  Scale,
  DollarSign,
  Award,
  ChevronRight,
  CheckCircle2,
  Calendar,
  MapPin,
  FileSpreadsheet,
  Building2,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { ProcessedGreenBeanLot } from '../../types/coffee';
import { ProcessorBarcodeModal } from '../ProcessorBarcodeModal';
import { ControlPanel } from '../shared/ControlPanel';
import { StatButton } from '../shared/StatButton';
import { RecordBreadcrumb } from '../shared/RecordBreadcrumb';

export const SellingModule: React.FC = () => {
  const {
    currentUser,
    processedLots,
    processingBatches,
    transactions,
    setActiveView,
  } = useCoffee();

  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'orders' | 'profitability'>('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProcess, setFilterProcess] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'kanban'>('table');
  const [selectedLotForDetail, setSelectedLotForDetail] = useState<ProcessedGreenBeanLot | null>(null);
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [selectedLotForBarcode, setSelectedLotForBarcode] = useState<ProcessedGreenBeanLot | null>(null);

  // My Processed Green Bean Lots
  const myGreenLots = processedLots.filter(
    (lot) => lot.processorId === currentUser?.id || true
  );

  // Filtered Green Bean Lots
  const filteredLots = myGreenLots.filter((lot) => {
    const matchesSearch =
      lot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.sourceFarmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.sourceOrigin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProcess = filterProcess === 'all' || lot.processMethod === filterProcess;
    return matchesSearch && matchesProcess;
  });

  // Sales Transactions where Processor is seller
  const mySalesTransactions = transactions.filter(
    (t) =>
      t.fromRole === 'pengolah' ||
      t.fromName === (currentUser?.organization || currentUser?.name)
  );

  // Filtered transactions
  const filteredTransactions = mySalesTransactions.filter((t) => {
    return (
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.toName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Executive Metrics
  const totalActiveLots = myGreenLots.filter((l) => (l.availableWeightKg || 0) > 0).length;
  const totalAvailableStockKg = myGreenLots.reduce((acc, l) => acc + (l.availableWeightKg || 0), 0);
  const totalProducedKg = myGreenLots.reduce((acc, l) => acc + (l.greenBeanWeightKg || 0), 0);
  const totalSoldKg = Math.max(0, totalProducedKg - totalAvailableStockKg);
  const totalRevenue = mySalesTransactions.reduce((acc, t) => acc + t.totalAmount, 0);
  const potentialInventoryValue = myGreenLots.reduce(
    (acc, l) => acc + (l.availableWeightKg || 0) * (l.pricePerKg || 125000),
    0
  );

  // Batch Profitability Report items (connecting batch intake to green bean sales value)
  const completedBatches = processingBatches.filter(
    (b) => b.status === 'completed' || b.currentStage === 'packing_closure'
  );

  const handleOpenBarcode = (lot: ProcessedGreenBeanLot) => {
    setSelectedLotForBarcode(lot);
    setBarcodeModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* ----------------------------------------------------------------- */}
      {/* MODE 1: LIST / DASHBOARD VIEW                                     */}
      {/* ----------------------------------------------------------------- */}
      {!selectedLotForDetail ? (
        <>
          {/* Executive KPI Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Penjualan</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-stone-900 font-mono">
                Rp {totalRevenue.toLocaleString()}
              </span>
              <span className="text-[11px] text-stone-400 block mt-1">
                {mySalesTransactions.length} transaksi selesai
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Green Bean Siap Jual</span>
                <Store className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-stone-900 font-mono">
                {totalAvailableStockKg.toLocaleString()} <span className="text-sm font-normal text-stone-500">kg</span>
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                {totalActiveLots} Lot aktif di marketplace
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Volume Terjual</span>
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-stone-900 font-mono">
                {totalSoldKg.toLocaleString()} <span className="text-sm font-normal text-stone-500">kg</span>
              </span>
              <span className="text-[11px] text-stone-400 block mt-1">
                Dari {totalProducedKg.toLocaleString()} kg total produksi
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Estimasi Nilai Stok</span>
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-stone-900 font-mono">
                Rp {potentialInventoryValue.toLocaleString()}
              </span>
              <span className="text-[11px] text-purple-700 font-semibold block mt-1">
                Katalog Green Bean Specialty
              </span>
            </div>
          </div>

          {/* Sub Navigation Strip */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-1.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveSubTab('listings')}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  activeSubTab === 'listings'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Katalog Green Bean di Marketplace ({filteredLots.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('orders')}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  activeSubTab === 'orders'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Transaksi &amp; Pesanan Masuk ({filteredTransactions.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('profitability')}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  activeSubTab === 'profitability'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Laporan Finansial &amp; Margin Batch ({completedBatches.length})</span>
              </button>
            </div>

            <button
              onClick={() => setActiveView('marketplace')}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ml-auto"
            >
              <span>Buka Storefront Marketplace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Control Panel: Filters & View Switcher */}
          <ControlPanel
            breadcrumbs={[{ label: 'Processor Mill' }, { label: 'Marketplace & Sales Dashboard' }]}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={filterProcess}
            onFilterChange={setFilterProcess}
            filterOptions={[
              { id: 'all', label: 'Semua Metode Olah' },
              { id: 'Natural / Dry', label: 'Natural / Dry' },
              { id: 'Full Washed', label: 'Full Washed' },
              { id: 'Honey (Yellow/Red)', label: 'Honey' },
              { id: 'Anaerobic Natural', label: 'Anaerobic Natural' },
              { id: 'Wine Process', label: 'Wine Process' },
              { id: 'Wet Hulled (Giling Basah)', label: 'Wet Hulled' },
            ]}
            viewMode={viewMode === 'cards' ? 'kanban' : viewMode}
            onViewModeChange={(mode) => setViewMode(mode === 'table' ? 'table' : 'cards')}
            recordCount={
              activeSubTab === 'listings'
                ? filteredLots.length
                : activeSubTab === 'orders'
                ? filteredTransactions.length
                : completedBatches.length
            }
          />

          {/* ----------------------------------------------------------------- */}
          {/* SUB-TAB 1: KATALOG GREEN BEAN SIAP JUAL DI MARKETPLACE           */}
          {/* ----------------------------------------------------------------- */}
          {activeSubTab === 'listings' && (
            <>
              {filteredLots.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                  <Store className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-stone-800">Belum ada lot green bean yang dirilis</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto mb-4">
                    Selesaikan batch pengolahan di modul Lembar Kerja Batch dan klik &quot;Rilis Green Bean ke Marketplace&quot; untuk menampilkan listing di sini.
                  </p>
                </div>
              ) : viewMode === 'table' ? (
                /* DEFAULT VIEW: RICH ERP DATA TABLE / LIST */
                <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-stone-700">
                      <thead className="bg-[#FAF7F2] text-[11px] font-bold uppercase tracking-wider text-stone-600 border-b border-stone-200">
                        <tr>
                          <th className="px-5 py-3.5">ID Lot &amp; Varietas</th>
                          <th className="px-4 py-3.5">Petani Asal &amp; Elevasi</th>
                          <th className="px-4 py-3.5">Metode Olah</th>
                          <th className="px-4 py-3.5">Grade &amp; SCA Score</th>
                          <th className="px-4 py-3.5 text-right">Stok Tersedia</th>
                          <th className="px-4 py-3.5 text-right">Harga / kg</th>
                          <th className="px-4 py-3.5">Status Listing</th>
                          <th className="px-5 py-3.5 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredLots.map((lot) => {
                          const isAvailable = (lot.availableWeightKg || 0) > 0;
                          return (
                            <tr
                              key={lot.id}
                              onClick={() => setSelectedLotForDetail(lot)}
                              className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800 font-bold group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                    <Coffee className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="font-mono font-bold text-stone-900 block group-hover:text-amber-800 transition-colors">
                                      {lot.id}
                                    </span>
                                    <span className="font-semibold text-stone-600">{lot.variety}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="px-4 py-4">
                                <span className="font-bold text-stone-900 block">{lot.sourceFarmerName}</span>
                                <span className="text-stone-500 text-[11px] flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-stone-400" />
                                  {lot.sourceOrigin} ({lot.altitude})
                                </span>
                              </td>

                              <td className="px-4 py-4">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">
                                  {lot.processMethod}
                                </span>
                              </td>

                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                    {lot.grade}
                                  </span>
                                  <span className="font-mono font-bold text-emerald-700 text-xs">
                                    {lot.defectCount !== undefined ? `Def: ${lot.defectCount}` : 'SCA 87+'}
                                  </span>
                                </div>
                              </td>

                              <td className="px-4 py-4 text-right">
                                <span className="font-mono font-bold text-stone-900 block">
                                  {lot.availableWeightKg || 0} kg
                                </span>
                                <span className="text-[10px] text-stone-400">
                                  dari {lot.greenBeanWeightKg || 0} kg
                                </span>
                              </td>

                              <td className="px-4 py-4 text-right">
                                <span className="font-mono font-black text-amber-900 block">
                                  Rp {(lot.pricePerKg || 125000).toLocaleString()}
                                </span>
                                <span className="text-[10px] text-stone-400">/ kilogram</span>
                              </td>

                              <td className="px-4 py-4">
                                {isAvailable ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                    Siap Jual (Marketplace)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
                                    Habis Terjual
                                  </span>
                                )}
                              </td>

                              <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenBarcode(lot)}
                                    title="Cetak Stiker QR Barcode"
                                    className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                                  >
                                    <QrCode className="w-3.5 h-3.5 text-stone-600" />
                                  </button>
                                  <button
                                    onClick={() => setSelectedLotForDetail(lot)}
                                    className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <span>Detail</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* OPTIONAL CARDS / GRID VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredLots.map((lot) => {
                    return (
                      <div
                        key={lot.id}
                        onClick={() => setSelectedLotForDetail(lot)}
                        className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="p-4 bg-gradient-to-r from-stone-900 to-amber-950 text-white flex items-center justify-between">
                            <span className="font-mono font-bold text-amber-300 text-xs">{lot.id}</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-600 text-white">
                              {lot.processMethod}
                            </span>
                          </div>

                          <div className="p-5 space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                                <span>Petani: <strong className="text-stone-800">{lot.sourceFarmerName}</strong></span>
                                <span className="font-bold text-purple-700">{lot.grade}</span>
                              </div>
                              <h3 className="font-bold text-base text-stone-900 group-hover:text-amber-800 transition-colors">
                                {lot.variety}
                              </h3>
                              <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                {lot.sourceOrigin} ({lot.altitude})
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                              <div>
                                <span className="text-[10px] text-stone-400 block font-semibold">Stok Tersedia:</span>
                                <span className="font-bold text-stone-900 font-mono">{lot.availableWeightKg} kg</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-stone-400 block font-semibold">Harga Jual:</span>
                                <span className="font-bold text-amber-800 font-mono">
                                  Rp {(lot.pricePerKg || 125000).toLocaleString()}/kg
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenBarcode(lot);
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>QR Code</span>
                          </button>
                          <button
                            onClick={() => setSelectedLotForDetail(lot)}
                            className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>Detail Lot</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* SUB-TAB 2: TRANSAKSI & PESANAN PENJUALAN MASUK                    */}
          {/* ----------------------------------------------------------------- */}
          {activeSubTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
              <div className="p-4 bg-[#FAF7F2] border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                    Buku Pesanan Penjualan Green Bean (Sales Orders)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Daftar order pembelian dari Roastery, Cafe, dan Warehouse melalui Unified Marketplace.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Total Nilai: Rp {totalRevenue.toLocaleString()}
                </span>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="p-12 text-center text-stone-500">
                  <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="font-bold text-stone-700">Belum ada transaksi penjualan tercatat</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Pesanan dari roaster/gudang yang membeli produk green bean Anda akan otomatis muncul di sini.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-600 border-b border-stone-200">
                      <tr>
                        <th className="px-5 py-3">No Transaksi</th>
                        <th className="px-4 py-3">Tanggal</th>
                        <th className="px-4 py-3">Pembeli (Buyer)</th>
                        <th className="px-4 py-3">Produk Green Bean</th>
                        <th className="px-4 py-3 text-right">Volume</th>
                        <th className="px-4 py-3 text-right">Total Tagihan</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredTransactions.map((trx) => (
                        <tr key={trx.id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="px-5 py-3.5 font-mono font-bold text-stone-900">
                            {trx.id}
                          </td>
                          <td className="px-4 py-3.5 text-stone-500 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            {trx.date}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-stone-900 block">{trx.toName}</span>
                            <span className="text-[10px] text-stone-400 uppercase font-bold">{trx.toRole}</span>
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-stone-800">
                            {trx.itemName}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono font-bold text-stone-900">
                            {trx.quantity}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono font-black text-emerald-800">
                            Rp {trx.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
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

          {/* ----------------------------------------------------------------- */}
          {/* SUB-TAB 3: LAPORAN FINANSIAL & PROFITABILITAS BATCH                */}
          {/* ----------------------------------------------------------------- */}
          {activeSubTab === 'profitability' && (
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
              <div className="p-4 bg-[#FAF7F2] border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    Laporan Kinerja &amp; Margin Keuntungan Batch Olahan
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Analisis konversi bahan baku ceri, biaya pengadaan, hasil rendemen green bean, dan margin penjualan.
                  </p>
                </div>
              </div>

              {completedBatches.length === 0 ? (
                <div className="p-12 text-center text-stone-500">
                  <FileSpreadsheet className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="font-bold text-stone-700">Belum ada batch olahan yang selesai</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Setelah batch menyelesaikan 7 tahap pengolahan, rekapitulasi margin akan dikalkulasi otomatis di sini.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-600 border-b border-stone-200">
                      <tr>
                        <th className="px-5 py-3">Batch Code</th>
                        <th className="px-4 py-3">Petani &amp; Metode</th>
                        <th className="px-4 py-3 text-right">Ceri Masuk</th>
                        <th className="px-4 py-3 text-right">Rendemen</th>
                        <th className="px-4 py-3 text-right">Green Bean (kg)</th>
                        <th className="px-4 py-3 text-right">Harga Jual / kg</th>
                        <th className="px-4 py-3 text-right">Potensi Omzet</th>
                        <th className="px-4 py-3 text-right">Estimasi Biaya Ceri</th>
                        <th className="px-5 py-3 text-right">Gross Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {completedBatches.map((b) => {
                        const cherryKg = b.intakeLog.cherryWeightKg || 100;
                        const greenKg = b.millingLog?.outputGreenBeanWeightKg || b.packingLog.finalGreenBeanWeightKg || Math.round(cherryKg * 0.16);
                        const yieldPercent = ((greenKg / cherryKg) * 100).toFixed(1);
                        const priceKg = b.targetMarketplacePricePerKg || 135000;
                        const totalSalesPotential = greenKg * priceKg;
                        // Estimate cherry cost ~ Rp 15,000/kg
                        const estimatedCherryCost = cherryKg * 15000;
                        const grossProfit = totalSalesPotential - estimatedCherryCost;
                        const marginPercent = totalSalesPotential > 0 ? ((grossProfit / totalSalesPotential) * 100).toFixed(1) : '0';

                        return (
                          <tr key={b.id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="px-5 py-3.5 font-mono font-bold text-stone-900">
                              {b.batchCode}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="font-bold text-stone-900 block">{b.sourceFarmerName}</span>
                              <span className="text-[10px] text-amber-800 font-bold uppercase">{b.fermentationLog.method}</span>
                            </td>
                            <td className="px-4 py-3.5 text-right font-mono font-bold text-stone-800">
                              {cherryKg} kg
                            </td>
                            <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-700">
                              {yieldPercent}%
                            </td>
                            <td className="px-4 py-3.5 text-right font-mono font-black text-stone-900">
                              {greenKg} kg
                            </td>
                            <td className="px-4 py-3.5 text-right font-mono font-semibold text-stone-800">
                              Rp {priceKg.toLocaleString()}
                            </td>
                            <td className="px-4 py-3.5 text-right font-mono font-black text-stone-900">
                              Rp {totalSalesPotential.toLocaleString()}
                            </td>
                            <td className="px-4 py-3.5 text-right font-mono text-stone-500">
                              Rp {estimatedCherryCost.toLocaleString()}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <span className="font-mono font-black text-emerald-700 block">
                                Rp {grossProfit.toLocaleString()}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                                +{marginPercent}% Margin
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* ----------------------------------------------------------------- */
        /* MODE 2: DETAIL DRAWER VIEW UNTUK GREEN BEAN LOT                  */
        /* ----------------------------------------------------------------- */
        <div className="space-y-4 animate-in fade-in duration-200">
          <RecordBreadcrumb
            listLabel="Daftar Green Bean Siap Jual"
            recordLabel={selectedLotForDetail.id}
            onBack={() => setSelectedLotForDetail(null)}
          />

          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-[#FAF7F2] p-6 border-b border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-amber-600 text-white shadow-xs">
                  <Store className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-stone-900 font-mono tracking-tight">
                      {selectedLotForDetail.id}
                    </h2>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase bg-stone-900 text-amber-400">
                      {selectedLotForDetail.grade}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Varietas: <strong className="text-stone-800">{selectedLotForDetail.variety}</strong> • Petani:{' '}
                    <strong className="text-stone-800">{selectedLotForDetail.sourceFarmerName}</strong> ({selectedLotForDetail.sourceOrigin})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenBarcode(selectedLotForDetail)}
                  className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-stone-600" />
                  <span>Cetak Stiker QR</span>
                </button>
                <button
                  onClick={() => setActiveView('marketplace')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Lihat di Storefront</span>
                </button>
              </div>
            </div>

            {/* Stat row */}
            <div className="px-6 py-4 bg-white border-b border-stone-100 flex flex-wrap gap-2">
              <StatButton
                icon={<Coffee className="w-4 h-4" />}
                value={`${selectedLotForDetail.availableWeightKg || 0} kg`}
                label="Stok Tersedia"
                color="amber"
              />
              <StatButton
                icon={<Scale className="w-4 h-4" />}
                value={`${selectedLotForDetail.greenBeanWeightKg || 0} kg`}
                label="Total Batch Output"
                color="stone"
              />
              <StatButton
                icon={<DollarSign className="w-4 h-4" />}
                value={`Rp ${(selectedLotForDetail.pricePerKg || 125000).toLocaleString()}`}
                label="Harga / kg"
                color="emerald"
              />
              <StatButton
                icon={<Award className="w-4 h-4" />}
                value={selectedLotForDetail.grade}
                label="SCA Grade"
                color="purple"
              />
            </div>

            {/* Detailed specifications */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-200 pb-2">
                  <Coffee className="w-4 h-4 text-amber-600" /> Parameter Pasca Panen &amp; Mutu Fisik
                </h4>
                <div className="grid grid-cols-2 gap-3 text-stone-700">
                  <div>
                    <span className="text-stone-400 block font-semibold text-[10px]">Metode Pengolahan</span>
                    <strong className="text-stone-900">{selectedLotForDetail.processMethod}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-semibold text-[10px]">Kadar Air (Moisture)</span>
                    <strong className="text-emerald-700">{selectedLotForDetail.moistureContentPercent}%</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-semibold text-[10px]">Ukuran Ayakan (Screen)</span>
                    <strong className="text-stone-900">{selectedLotForDetail.screenSize || 'Screen 16-18+'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-semibold text-[10px]">Cacat Fisik (Defect)</span>
                    <strong className="text-stone-900">{selectedLotForDetail.defectCount || 0} nilai cacat</strong>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-200 pb-2">
                  <Building2 className="w-4 h-4 text-emerald-600" /> Profil Rasa &amp; Catatan Cupping
                </h4>
                <div>
                  <span className="text-stone-400 block font-semibold text-[10px] mb-1.5">Flavor Notes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedLotForDetail.cuppingNotes || ['Brown Sugar', 'Orange Blossom', 'Caramel']).map(
                      (note, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-amber-100/80 text-amber-900 font-bold text-[11px] border border-amber-200"
                        >
                          ✦ {note}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barcode & Traceability Modal */}
      {barcodeModalOpen && selectedLotForBarcode && (
        <ProcessorBarcodeModal
          isOpen={barcodeModalOpen}
          lot={selectedLotForBarcode}
          onClose={() => {
            setBarcodeModalOpen(false);
            setSelectedLotForBarcode(null);
          }}
        />
      )}
    </div>
  );
};
