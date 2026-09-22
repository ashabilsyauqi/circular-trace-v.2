import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import {
  Search,
  Filter,
  MapPin,
  Recycle,
  Star,
  Printer,
  X,
  Package,
  Scale,
  DollarSign,
  Award,
  Droplets,
  CheckCircle2,
  FileText,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Flame,
  Cherry,
  ArrowRight,
  Clock,
  AlertTriangle,
  Warehouse,
  Sparkles,
  Store,
  Sliders,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { ProcessedGreenBeanLot, CoffeeWasteManagement } from '../../types/coffee';
import { ProcessorCherryStockItem, ProcessingMethod } from '../../types/processorErp';
import { ProcessorBarcodeModal } from '../ProcessorBarcodeModal';
import { calculateProcessorEcoRating } from '../../utils/ecoRating';
import { RecordBreadcrumb } from '../shared/RecordBreadcrumb';
import { StatusPipeline, PipelineStage } from '../shared/StatusPipeline';
import { StatButton } from '../shared/StatButton';
import { ControlPanel } from '../shared/ControlPanel';
import { ActivityFeed } from '../shared/ActivityFeed';
import { MetricCard } from '../admin/MetricCard';

const CHERRY_STOCK_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'available', label: 'Tersedia di Gudang' },
  { id: 'partial', label: 'Diolah Sebagian' },
  { id: 'exhausted', label: 'Habis Diolah' },
];

const GREEN_BEAN_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'siap_jual', label: 'Siap Jual di Gudang' },
  { id: 'terjual', label: 'Ludes Terjual' },
];

export const InventoryModule: React.FC = () => {
  const {
    currentUser,
    processedLots,
    processorCherryStock,
    updateProcessedLotWaste,
    createProcessingBatch,
    setActiveProcessingBatchId,
    setProcessorActiveTab,
    setActiveView,
  } = useCoffee();

  const [activeCategory, setActiveCategory] = useState<'cherry' | 'green_bean' | 'waste'>('cherry');
  const [searchQuery, setSearchQuery] = useState('');
  const [processMethodFilter, setProcessMethodFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Detail Sheet States
  const [detailCherryItem, setDetailCherryItem] = useState<ProcessorCherryStockItem | null>(null);
  const [detailGreenBeanLot, setDetailGreenBeanLot] = useState<ProcessedGreenBeanLot | null>(null);

  // Detail Sheet Form State for Cherry Processing
  const [detailProcessKg, setDetailProcessKg] = useState<number>(500);
  const [detailProcessMethod, setDetailProcessMethod] = useState<ProcessingMethod>('Natural / Dry');

  // Modals
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [selectedLotForBarcode, setSelectedLotForBarcode] = useState<ProcessedGreenBeanLot | null>(null);

  // Edit Waste Modal
  const [editingWasteLot, setEditingWasteLot] = useState<ProcessedGreenBeanLot | null>(null);
  const [editWasteUtilization, setEditWasteUtilization] = useState<string>('');
  const [editWasteWeight, setEditWasteWeight] = useState<number>(0);
  const [editWasteRecipient, setEditWasteRecipient] = useState<string>('');
  const [editWasteProcessingMethod, setEditWasteProcessingMethod] = useState<string>('');
  const [editWasteNotes, setEditWasteNotes] = useState<string>('');
  const [editWasteType, setEditWasteType] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState('');

  // Computations
  const totalCherryKg = processorCherryStock.reduce((acc, curr) => acc + curr.availableWeightKg, 0);
  const totalCherryValue = processorCherryStock.reduce((acc, curr) => acc + (curr.availableWeightKg * curr.purchasePricePerKg), 0);

  const myProcessedLots = processedLots.filter((lot) => lot.processorId === currentUser?.id || true);
  const totalGreenKg = myProcessedLots.reduce((acc, curr) => acc + curr.availableWeightKg, 0);
  const totalGreenValue = myProcessedLots.reduce((acc, curr) => acc + (curr.availableWeightKg * curr.pricePerKg), 0);

  const grandTotalValue = totalCherryValue + totalGreenValue;
  const totalWasteKg = myProcessedLots.reduce((acc, curr) => acc + (curr.wasteManagement?.weightKgOrLiters || Math.round(curr.greenBeanWeightKg * 2.2)), 0);

  // Filterings
  const filteredCherryStock = processorCherryStock.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.id.toLowerCase().includes(q) ||
      item.variety.toLowerCase().includes(q) ||
      item.farmerName.toLowerCase().includes(q) ||
      item.origin.toLowerCase().includes(q)
    );
  });

  const filteredGreenBeans = myProcessedLots.filter((lot) => {
    const matchMethod = processMethodFilter === 'all' || lot.processMethod === processMethodFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      lot.id.toLowerCase().includes(q) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.sourceFarmerName.toLowerCase().includes(q) ||
      lot.processMethod.toLowerCase().includes(q);
    return matchMethod && matchSearch;
  });

  const handleOpenDetailCherry = (item: ProcessorCherryStockItem) => {
    setDetailCherryItem(item);
    setDetailProcessKg(item.availableWeightKg);
    setDetailProcessMethod('Natural / Dry');
  };

  // Direct 1-click create processing batch from cherry warehouse stock & open interactive Lembar Kerja
  const handleDirectStart7StageFromStock = (
    item: ProcessorCherryStockItem,
    kg?: number,
    method?: ProcessingMethod
  ) => {
    const amount = kg || item.availableWeightKg;
    const chosenMethod = method || 'Natural / Dry';

    const newBatch = createProcessingBatch({
      sourceCherryStockId: item.id,
      boughtCherryKg: Number(amount),
      method: chosenMethod,
      dryingMethod: 'Solar Dryer Raised Bed',
      operatorName: 'Budi Santoso (Mill Master)',
      notes: `Batch pengolahan metode ${chosenMethod} dari stok ceri segar gudang (${item.variety} - ${item.origin}).`,
    });

    if (detailCherryItem) setDetailCherryItem(null);

    if (newBatch) {
      setActiveProcessingBatchId(newBatch.id);
      setProcessorActiveTab('batches');
    }
  };

  const handleOpenEditWaste = (lot: ProcessedGreenBeanLot) => {
    setEditingWasteLot(lot);
    setEditWasteType(lot.wasteManagement?.wasteType || 'Kulit Ceri (Pulp / Cascara)');
    setEditWasteUtilization(lot.wasteManagement?.utilization || 'Bahan Baku Minuman Teh Cascara & Kompos Sirkular');
    setEditWasteWeight(lot.wasteManagement?.weightKgOrLiters || Math.round(lot.greenBeanWeightKg * 2.2));
    setEditWasteRecipient(lot.wasteManagement?.recipientOrLocation || 'Kelompok Tani Tilu Lestari & Rumah Kompos');
    setEditWasteProcessingMethod(lot.wasteManagement?.processingMethod || 'Solar Dryer Raised Bed & Kompos Aerobik 30 Hari');
    setEditWasteNotes(lot.wasteManagement?.notes || '');
  };

  const handleSaveEditWaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWasteLot) return;

    const updatedWaste: CoffeeWasteManagement = {
      wasteType: editWasteType,
      utilization: editWasteUtilization,
      weightKgOrLiters: Number(editWasteWeight),
      recipientOrLocation: editWasteRecipient,
      processingMethod: editWasteProcessingMethod,
      ecoCertificate: 'sangrAI Zero-Waste Circular Standard',
      notes: editWasteNotes,
    };

    updateProcessedLotWaste(editingWasteLot.id, updatedWaste);
    setSuccessMsg(`Data alokasi limbah untuk lot ${editingWasteLot.id} berhasil diperbarui!`);
    setEditingWasteLot(null);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-stone-400 hover:text-stone-700 text-xs font-bold">
            Tutup
          </button>
        </div>
      )}

      {!detailCherryItem && !detailGreenBeanLot && (
        <>
          {/* 1. Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Nilai Total Aset Gudang"
              value={`Rp ${grandTotalValue.toLocaleString()}`}
              subtitle="Valuasi Ceri Segar + Green Bean"
              trend={{ value: 'Audit FIFO Valid', isPositive: true }}
              icon={<DollarSign className="w-5 h-5 text-amber-600" />}
              color="amber"
            />
            <MetricCard
              title="Stok Bahan Baku Ceri"
              value={`${totalCherryKg.toLocaleString()} kg`}
              subtitle={`Nilai Rp ${totalCherryValue.toLocaleString()}`}
              trend={{ value: `${processorCherryStock.length} Lot Siap Olah`, isPositive: true }}
              icon={<Cherry className="w-5 h-5 text-rose-600" />}
              color="rose"
            />
            <MetricCard
              title="Stok Green Bean Siap Jual"
              value={`${totalGreenKg.toLocaleString()} kg`}
              subtitle={`Nilai Rp ${totalGreenValue.toLocaleString()}`}
              trend={{ value: `${myProcessedLots.length} Lot Siap Pasar`, isPositive: true }}
              icon={<Package className="w-5 h-5 text-emerald-600" />}
              color="emerald"
            />
            <MetricCard
              title="Limbah Sirkular Terkelola"
              value={`${totalWasteKg.toLocaleString()} kg`}
              subtitle="Cascara, Kompos & Bio-Pellet"
              trend={{ value: 'Zero-Waste 5.0 ⭐', isPositive: true }}
              icon={<Recycle className="w-5 h-5 text-teal-600" />}
              color="purple"
            />
          </div>

          {/* Quick Notice Banner if Raw Cherry is Available */}
          {totalCherryKg > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5 text-amber-900">
                <Clock className="w-4.5 h-4.5 text-amber-700 shrink-0" />
                <p className="text-xs font-semibold">
                  Terdapat <strong className="text-amber-950">{totalCherryKg.toLocaleString()} kg ceri segar</strong> di gudang penyimpanan Anda yang siap dikirim ke lembar kerja <strong>Processing 7-Stage</strong>.
                </p>
              </div>
              <button
                onClick={() => setActiveCategory('cherry')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 shadow-xs transition-colors"
              >
                Lihat Stok Ceri →
              </button>
            </div>
          )}

          {/* 2. Subtab Switcher */}
          <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
            <button
              onClick={() => setActiveCategory('cherry')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeCategory === 'cherry'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Cherry className="w-4 h-4" />
              <span>Stok Bahan Baku Ceri ({processorCherryStock.length} Lot)</span>
            </button>

            <button
              onClick={() => setActiveCategory('green_bean')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeCategory === 'green_bean'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Stok Barang Jadi Green Bean ({myProcessedLots.length} Lot)</span>
            </button>

            <button
              onClick={() => setActiveCategory('waste')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeCategory === 'waste'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Recycle className="w-4 h-4" />
              <span>Pengelolaan Limbah Sirkular</span>
            </button>
          </div>

          {/* 3. Control Panel Toolbar */}
          <ControlPanel
            breadcrumbs={[
              { label: 'Gudang & Inventaris Pengolah' },
              {
                label:
                  activeCategory === 'cherry'
                    ? 'Bahan Baku Ceri Kopi'
                    : activeCategory === 'green_bean'
                    ? 'Green Bean Siap Pasar'
                    : 'Pengelolaan Limbah',
              },
            ]}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeCategory === 'green_bean' ? processMethodFilter : undefined}
            onFilterChange={activeCategory === 'green_bean' ? setProcessMethodFilter : undefined}
            filterOptions={
              activeCategory === 'green_bean'
                ? [
                    { id: 'all', label: 'Semua Metode Olah' },
                    { id: 'Natural / Dry', label: '1. Natural (Dry)' },
                    { id: 'Full Washed', label: '2. Washed (Wet)' },
                    { id: 'Honey (Yellow/Red)', label: '3. Honey (Pulped Natural)' },
                    { id: 'Wet Hulled (Giling Basah)', label: '4. Wet Hulled (Giling Basah)' },
                    { id: 'Anaerobic Natural', label: 'Anaerobic Natural' },
                    { id: 'Wine Process', label: 'Wine Process' },
                  ]
                : undefined
            }
            viewMode={viewMode}
            onViewModeChange={(m) => setViewMode(m === 'table' ? 'table' : 'kanban')}
            recordCount={
              activeCategory === 'cherry'
                ? filteredCherryStock.length
                : activeCategory === 'green_bean'
                ? filteredGreenBeans.length
                : myProcessedLots.length
            }
          />

          {/* ======================================================== */}
          {/* TAB 1: STOK BAHAN BAKU CERI (CHERRY RAW MATERIAL)       */}
          {/* ======================================================== */}
          {activeCategory === 'cherry' && (
            <>
              {filteredCherryStock.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                  <Cherry className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-stone-800">Belum ada stok ceri di gudang</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto mb-4">
                    Beli ceri segar dari Petani atau melalui Marketplace untuk mengisi stok bahan baku stasiun Anda.
                  </p>
                  <button
                    onClick={() => setProcessorActiveTab('sourcing')}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Cherry className="w-4 h-4" />
                    <span>Beli Ceri dari Petani →</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Cards View */}
                  {viewMode === 'kanban' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredCherryStock.map((item) => {
                        const isAvailable = item.availableWeightKg > 0;

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleOpenDetailCherry(item)}
                            className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between cursor-pointer group"
                          >
                            <div>
                              <div className="relative h-44 bg-stone-100 overflow-hidden">
                                <img
                                  src={item.photoUrl || 'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80'}
                                  alt={item.variety}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md">
                                  {item.id}
                                </div>
                                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                  <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                                    <Cherry className="w-3 h-3" /> Ceri Segar
                                  </span>
                                  {isAvailable ? (
                                    <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs">
                                      Stok: {item.availableWeightKg} kg
                                    </span>
                                  ) : (
                                    <span className="bg-stone-800 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs">
                                      Habis Diolah
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="p-5 space-y-3">
                                <div>
                                  <div className="flex items-center gap-1 text-[11px] text-stone-500 mb-1">
                                    <span>Petani Sumber:</span>
                                    <strong className="text-stone-800">{item.farmerName}</strong>
                                    <span>({item.sourceFarmerLotId})</span>
                                  </div>
                                  <h3 className="font-bold text-base text-stone-900 group-hover:text-amber-800 transition-colors">
                                    {item.variety}
                                  </h3>
                                  <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                    {item.origin} ({item.altitude})
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                                  <div>
                                    <span className="text-[10px] text-stone-400 block font-semibold">Kadar Brix:</span>
                                    <span className="font-black text-emerald-700">{item.brix}° Brix</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-stone-400 block font-semibold">Metode Petik:</span>
                                    <span className="font-semibold text-stone-800 truncate block">{item.pickingMethod.split(' ')[0]}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-stone-400 block font-semibold">HPP Beli Modal:</span>
                                    <span className="font-bold text-stone-800">Rp {item.purchasePricePerKg.toLocaleString()}/kg</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-stone-400 block font-semibold">Tgl Masuk Gudang:</span>
                                    <span className="font-semibold text-stone-800">{item.purchaseDate}</span>
                                  </div>
                                </div>

                                <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 text-xs flex items-center justify-between">
                                  <span className="text-amber-900 font-medium">Total Nilai Aset:</span>
                                  <strong className="text-amber-950 font-black font-mono">
                                    Rp {(item.availableWeightKg * item.purchasePricePerKg).toLocaleString()}
                                  </strong>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-stone-400 block font-medium">Stok Tersedia:</span>
                                <span className="text-sm font-black text-stone-900 font-mono">
                                  {item.availableWeightKg} <span className="text-xs font-normal text-stone-500">/ {item.totalWeightKg} kg</span>
                                </span>
                              </div>

                              {isAvailable && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDirectStart7StageFromStock(item);
                                  }}
                                  className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Flame className="w-3.5 h-3.5" />
                                  <span>Mulai Olah (7-Stage) →</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Table View */}
                  {viewMode === 'table' && (
                    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#FAF7F2] text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                            <tr>
                              <th className="py-4 px-5">ID Stok</th>
                              <th className="py-4 px-5">Varietas & Petani</th>
                              <th className="py-4 px-5">Origin & Elevasi</th>
                              <th className="py-4 px-5">Brix Kemanisan</th>
                              <th className="py-4 px-5">Stok Tersedia (kg)</th>
                              <th className="py-4 px-5">HPP Modal (Rp/kg)</th>
                              <th className="py-4 px-5">Total Nilai Aset</th>
                              <th className="py-4 px-5 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {filteredCherryStock.map((item) => (
                              <tr
                                key={item.id}
                                onClick={() => handleOpenDetailCherry(item)}
                                className="hover:bg-amber-50/60 cursor-pointer transition-colors"
                              >
                                <td className="py-4 px-5 font-mono font-bold text-sm text-stone-900">{item.id}</td>
                                <td className="py-4 px-5">
                                  <div className="font-bold text-stone-900">{item.variety}</div>
                                  <div className="text-[10px] text-stone-400">Petani: {item.farmerName}</div>
                                </td>
                                <td className="py-4 px-5">
                                  <div className="font-semibold text-stone-800">{item.origin}</div>
                                  <div className="text-[10px] text-stone-400">{item.altitude}</div>
                                </td>
                                <td className="py-4 px-5">
                                  <span className="font-black text-emerald-700 font-mono text-sm">{item.brix}° Brix</span>
                                </td>
                                <td className="py-4 px-5 font-mono font-black text-stone-900 text-sm">
                                  {item.availableWeightKg} kg
                                </td>
                                <td className="py-4 px-5 text-stone-800 font-mono">
                                  Rp {item.purchasePricePerKg.toLocaleString()}
                                </td>
                                <td className="py-4 px-5 font-black text-stone-900 font-mono">
                                  Rp {(item.availableWeightKg * item.purchasePricePerKg).toLocaleString()}
                                </td>
                                <td className="py-4 px-5 text-right">
                                  {item.availableWeightKg > 0 ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDirectStart7StageFromStock(item);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] transition-colors shadow-xs ml-auto cursor-pointer"
                                    >
                                      <Flame className="w-3.5 h-3.5" /> Mulai Olah →
                                    </button>
                                  ) : (
                                    <span className="text-stone-400 text-[11px]">Habis</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ======================================================== */}
          {/* TAB 2: STOK BARANG JADI GREEN BEAN (FINISHED GOODS)     */}
          {/* ======================================================== */}
          {activeCategory === 'green_bean' && (
            <>
              {filteredGreenBeans.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                  <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-stone-800">Belum ada Green Bean siap jual</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto mb-4">
                    Selesaikan batch pengolahan 7-Stage untuk menghasilkan green bean specialty bersertifikat.
                  </p>
                  <button
                    onClick={() => setProcessorActiveTab('batches')}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Ke Modul 7-Stage Processing →</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Cards View */}
                  {viewMode === 'kanban' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredGreenBeans.map((gb) => {
                        const isAvailable = gb.availableWeightKg > 0;
                        const ecoRating = calculateProcessorEcoRating(
                          gb.wasteManagement,
                          gb.sourceTotalCherryWeightKg || gb.greenBeanWeightKg * 5,
                          gb.greenBeanWeightKg
                        );

                        return (
                          <div
                            key={gb.id}
                            onClick={() => setDetailGreenBeanLot(gb)}
                            className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between cursor-pointer group"
                          >
                            <div>
                              <div className="relative h-44 bg-stone-100 overflow-hidden">
                                <img src={gb.photoUrl} alt={gb.variety} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md">
                                  {gb.id}
                                </div>
                                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                  <span className="bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                                    {gb.processMethod}
                                  </span>
                                  {isAvailable ? (
                                    <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs">
                                      Stok: {gb.availableWeightKg} kg
                                    </span>
                                  ) : (
                                    <span className="bg-stone-800 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs">
                                      Terjual
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="p-5 space-y-3">
                                <div>
                                  <div className="flex items-center gap-1 text-[11px] text-stone-500 mb-1">
                                    <span>Asal Ceri:</span>
                                    <strong className="text-stone-800">{gb.sourceFarmerName}</strong>
                                    <span>({gb.sourceFarmerLotId})</span>
                                  </div>
                                  <h3 className="font-bold text-base text-stone-900 group-hover:text-amber-800 transition-colors">
                                    {gb.variety} - {gb.grade}
                                  </h3>
                                  <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                    {gb.sourceOrigin} ({gb.altitude})
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                                  <div>
                                    <span className="text-[10px] text-stone-400 block font-semibold">Kadar Air:</span>
                                    <span className="font-bold text-stone-800">{gb.moistureContentPercent}%</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-stone-400 block font-semibold">Water Activity:</span>
                                    <span className="font-bold text-stone-800">{gb.waterActivityAw} aW</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-stone-400 block font-semibold">Defect Biji:</span>
                                    <span className="font-bold text-stone-800">{gb.defectCount} defect/350g</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-stone-400 block font-semibold">Fermentasi:</span>
                                    <span className="font-bold text-stone-800">{gb.fermentationTimeHours} Jam</span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-1 pt-1">
                                  {gb.cuppingNotes.map((note, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200"
                                    >
                                      {note}
                                    </span>
                                  ))}
                                </div>

                                <div className="mt-2 p-2.5 rounded-xl bg-teal-50/90 border border-teal-200 text-teal-950 text-[11px] space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <Recycle className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                                      <span className="font-bold truncate text-teal-950">
                                        {gb.wasteManagement?.utilization || 'Dikomposkan Jadi Pupuk Kebun'}
                                      </span>
                                    </div>
                                    <span className="font-bold text-[10px] text-emerald-800 shrink-0 bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-300 flex items-center gap-0.5">
                                      <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                                      ⭐ {ecoRating.starRating} ({ecoRating.ecoScore} Pts)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-stone-400 block">Harga Green Bean:</span>
                                <span className="text-sm font-black text-stone-900">
                                  Rp {gb.pricePerKg.toLocaleString()}
                                  <span className="text-xs font-normal text-stone-500"> / kg</span>
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLotForBarcode(gb);
                                    setBarcodeModalOpen(true);
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors"
                                  title="Cetak Barcode Karung"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveView('marketplace');
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs transition-colors flex items-center gap-1"
                                >
                                  <Store className="w-3.5 h-3.5" />
                                  <span>Marketplace</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Table View */}
                  {viewMode === 'table' && (
                    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#FAF7F2] text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                            <tr>
                              <th className="py-4 px-5">ID Green Bean</th>
                              <th className="py-4 px-5">Varietas & Metode Olah</th>
                              <th className="py-4 px-5">Petani & Origin</th>
                              <th className="py-4 px-5">Kadar Air & aW</th>
                              <th className="py-4 px-5">Stok Tersedia</th>
                              <th className="py-4 px-5">Grade & Eco</th>
                              <th className="py-4 px-5">Harga / kg</th>
                              <th className="py-4 px-5 text-right">Tindakan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {filteredGreenBeans.map((gb) => (
                              <tr
                                key={gb.id}
                                onClick={() => setDetailGreenBeanLot(gb)}
                                className="hover:bg-amber-50/60 cursor-pointer transition-colors"
                              >
                                <td className="py-4 px-5 font-mono font-bold text-stone-900">{gb.id}</td>
                                <td className="py-4 px-5">
                                  <div className="font-bold text-stone-900">{gb.variety}</div>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                                    {gb.processMethod}
                                  </span>
                                </td>
                                <td className="py-4 px-5">
                                  <div className="font-medium text-stone-800">{gb.sourceFarmerName}</div>
                                  <div className="text-[11px] text-stone-400">{gb.sourceOrigin}</div>
                                </td>
                                <td className="py-4 px-5">
                                  <div className="font-bold text-stone-900">{gb.moistureContentPercent}%</div>
                                  <div className="text-[11px] text-stone-500">{gb.waterActivityAw} aW</div>
                                </td>
                                <td className="py-4 px-5 font-bold text-stone-900">
                                  {gb.availableWeightKg} / {gb.greenBeanWeightKg} kg
                                </td>
                                <td className="py-4 px-5">
                                  <div className="font-bold text-stone-900">{gb.grade}</div>
                                  <div className="text-[11px] text-teal-700 font-semibold">Zero Waste Eco</div>
                                </td>
                                <td className="py-4 px-5 font-bold text-stone-900">
                                  Rp {gb.pricePerKg.toLocaleString()}
                                </td>
                                <td className="py-4 px-5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedLotForBarcode(gb);
                                        setBarcodeModalOpen(true);
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                                    >
                                      <Printer className="w-3 h-3" /> Barcode
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ======================================================== */}
          {/* TAB 3: PENGELOLAAN LIMBAH SIRKULAR (CIRCULAR WASTE)      */}
          {/* ======================================================== */}
          {activeCategory === 'waste' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myProcessedLots.map((gb) => {
                const wasteWeight = gb.wasteManagement?.weightKgOrLiters || Math.round(gb.greenBeanWeightKg * 2.2);
                const eco = calculateProcessorEcoRating(gb.wasteManagement, gb.sourceTotalCherryWeightKg || gb.greenBeanWeightKg * 5, gb.greenBeanWeightKg);

                return (
                  <div
                    key={gb.id}
                    className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
                          {gb.wasteManagement?.wasteType || 'Kulit Ceri (Cascara)'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ⭐ {eco.starRating} ({eco.ecoScore} Pts)
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-stone-900">Lot {gb.id} - {gb.variety}</h4>
                        <p className="text-xs text-stone-500 mt-0.5">{gb.wasteManagement?.utilization || 'Bahan Baku Minuman Teh Cascara & Kompos Sirkular'}</p>
                      </div>

                      <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-stone-200/80 text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Volume Terkelola:</span>
                          <strong className="text-stone-800 font-mono">{wasteWeight} kg</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Penerima Alokasi:</span>
                          <span className="text-stone-700 truncate max-w-[150px]">{gb.wasteManagement?.recipientOrLocation || 'Kelompok Tani Mitra'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Carbon Offset:</span>
                          <span className="text-emerald-700 font-bold font-mono">-{eco.carbonOffsetKg} kg CO₂e</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenEditWaste(gb)}
                      className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Recycle className="w-3.5 h-3.5" />
                      <span>Perbarui Alokasi Limbah</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ======================================================== */}
      {/* CHERRY STOCK DETAIL SHEET VIEW                          */}
      {/* ======================================================== */}
      {detailCherryItem && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <RecordBreadcrumb
            listLabel="Stok Bahan Baku Ceri"
            recordLabel={detailCherryItem.id}
            onBack={() => setDetailCherryItem(null)}
          />

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="bg-[#FAF7F2] px-6 py-5 border-b border-stone-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-100 text-rose-700">
                  <Cherry className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-stone-900 font-mono">{detailCherryItem.id}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-bold">
                      Ceri Segar
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Petani: <strong>{detailCherryItem.farmerName}</strong> • {detailCherryItem.origin} ({detailCherryItem.altitude}) • Masuk Gudang: {detailCherryItem.purchaseDate}
                  </p>
                </div>
              </div>

              <StatusPipeline
                stages={CHERRY_STOCK_PIPELINE_STAGES}
                currentStageId={detailCherryItem.availableWeightKg === 0 ? 'exhausted' : 'available'}
              />
            </div>

            <div className="px-6 py-4 bg-white border-b border-stone-100 flex flex-wrap gap-2.5">
              <StatButton
                icon={<Scale className="w-4 h-4" />}
                value={`${detailCherryItem.availableWeightKg} / ${detailCherryItem.totalWeightKg} kg`}
                label="Stok Ceri Tersisa"
                color="emerald"
              />
              <StatButton
                icon={<Droplets className="w-4 h-4" />}
                value={`${detailCherryItem.brix}° Brix`}
                label="Kemanisan Buah"
                color="purple"
              />
              <StatButton
                icon={<DollarSign className="w-4 h-4" />}
                value={`Rp ${detailCherryItem.purchasePricePerKg.toLocaleString()}`}
                label="HPP Modal / kg"
                color="amber"
              />
              <StatButton
                icon={<Warehouse className="w-4 h-4" />}
                value={`Rp ${(detailCherryItem.availableWeightKg * detailCherryItem.purchasePricePerKg).toLocaleString()}`}
                label="Total Nilai Aset"
                color="blue"
              />
            </div>

            <div className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Cherry className="w-4 h-4 text-rose-700" /> Spesifikasi Panen & Fisik
                  </h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Varietas Kopi</dt>
                      <dd className="font-bold text-stone-900">{detailCherryItem.variety}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Kadar Gula Buah (°Bx)</dt>
                      <dd className="font-black text-emerald-700">{detailCherryItem.brix}° Brix</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Metode Petik</dt>
                      <dd className="font-bold text-stone-900">{detailCherryItem.pickingMethod}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Tanggal Panen Petani</dt>
                      <dd className="font-bold text-stone-900">{detailCherryItem.harvestDate}</dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-stone-500">Estimasi Output Green Bean</dt>
                      <dd className="font-bold text-amber-900">~{Math.round(detailCherryItem.availableWeightKg * 0.16)} kg (Rendemen ~16%)</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-700" /> Traceability Asal Petani
                  </h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Petani Sumber</dt>
                      <dd className="font-bold text-stone-900">{detailCherryItem.farmerName}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Lot Panen Petani</dt>
                      <dd className="font-bold text-stone-900">{detailCherryItem.sourceFarmerLotId}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Lahan Asal & Elevasi</dt>
                      <dd className="font-bold text-stone-900">{detailCherryItem.origin} • {detailCherryItem.altitude}</dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-stone-500">Catatan Penyimpanan</dt>
                      <dd className="font-medium text-stone-800 text-right">{detailCherryItem.notes || '—'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* ERP Workstation Action Box */}
              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/40 border-2 border-amber-300 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-700" />
                    <div>
                      <h4 className="text-sm font-black text-amber-950 uppercase tracking-wider">
                        Workstation Inisiasi Pengolahan 7-Stage
                      </h4>
                      <p className="text-[11px] text-stone-600">
                        Kirim stok ceri segar langsung ke lembar kerja manufaktur stasiun pengolah.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-950 font-mono font-bold text-xs">
                    Tersedia {detailCherryItem.availableWeightKg} kg
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Volume yang Diolah (kg)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={detailCherryItem.availableWeightKg}
                      value={detailProcessKg}
                      onChange={(e) => setDetailProcessKg(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-mono font-black text-sm text-amber-950 focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      Estimasi Yield Green Bean: ~<strong>{Math.round(detailProcessKg * 0.16)} kg</strong> (rendemen ~16%)
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Pilihan Metode Pengolahan
                    </label>
                    <select
                      value={detailProcessMethod}
                      onChange={(e) => setDetailProcessMethod(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Natural / Dry">1. Natural (Dry) — Ceri Utuh Langsung Jemur</option>
                      <option value="Full Washed">2. Washed (Wet) — Depulper, Tangki Fermentasi & Cuci</option>
                      <option value="Honey (Yellow/Red)">3. Honey (Pulped Natural) — Depulper, Sisakan Lendir</option>
                      <option value="Wet Hulled (Giling Basah)">4. Wet Hulled (Giling Basah) — Hulling Lembek</option>
                      <option value="Anaerobic Natural">Anaerobic Natural — Sealed Tank Ferment</option>
                      <option value="Wine Process">Wine Process — Extended Ferment</option>
                    </select>
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      Metode dapat disesuaikan di Lembar Kerja.
                    </span>
                  </div>

                  <div className="flex flex-col justify-center bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
                    <span className="text-[10px] text-stone-500 font-semibold uppercase">Nilai Aset Bahan Baku:</span>
                    <strong className="text-lg font-black text-amber-950 font-mono mt-0.5">
                      Rp {(detailProcessKg * detailCherryItem.purchasePricePerKg).toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      ✓ Kemanisan {detailCherryItem.brix}° Brix
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-amber-200/80">
                  <button
                    type="button"
                    onClick={() => handleDirectStart7StageFromStock(detailCherryItem, detailProcessKg, detailProcessMethod)}
                    className="px-6 py-3 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Mulai Olah 7-Stage Lembar Kerja →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GREEN BEAN DETAIL SHEET VIEW                            */}
      {/* ======================================================== */}
      {detailGreenBeanLot && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <RecordBreadcrumb
            listLabel="Stok Barang Jadi Green Bean"
            recordLabel={detailGreenBeanLot.id}
            onBack={() => setDetailGreenBeanLot(null)}
          />

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="bg-[#FAF7F2] px-6 py-5 border-b border-stone-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-stone-900 font-mono">{detailGreenBeanLot.id}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                      {detailGreenBeanLot.processMethod}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {detailGreenBeanLot.sourceOrigin} — {detailGreenBeanLot.variety} ({detailGreenBeanLot.altitude}) • Diolah: {detailGreenBeanLot.processedDate}
                  </p>
                </div>
              </div>

              <StatusPipeline
                stages={GREEN_BEAN_PIPELINE_STAGES}
                currentStageId={detailGreenBeanLot.availableWeightKg === 0 ? 'terjual' : 'siap_jual'}
              />
            </div>

            <div className="px-6 py-4 bg-white border-b border-stone-100 flex flex-wrap gap-2.5">
              <StatButton
                icon={<Scale className="w-4 h-4" />}
                value={`${detailGreenBeanLot.availableWeightKg} / ${detailGreenBeanLot.greenBeanWeightKg} kg`}
                label="Stok Green Bean Tersedia"
                color="emerald"
              />
              <StatButton
                icon={<DollarSign className="w-4 h-4" />}
                value={`Rp ${detailGreenBeanLot.pricePerKg.toLocaleString()}`}
                label="Harga Green Bean / kg"
                color="amber"
              />
              <StatButton
                icon={<Award className="w-4 h-4" />}
                value={detailGreenBeanLot.grade}
                label="Grade Mutu"
                color="purple"
              />
              <StatButton
                icon={<Droplets className="w-4 h-4" />}
                value={`${detailGreenBeanLot.moistureContentPercent}% • ${detailGreenBeanLot.waterActivityAw} aW`}
                label="Kadar Air / aW"
                color="blue"
              />
            </div>

            <div className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-700" /> Spesifikasi Olahan &amp; Lab Fisik
                  </h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Metode Proses</dt>
                      <dd className="font-bold text-stone-900">{detailGreenBeanLot.processMethod}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Waktu Fermentasi</dt>
                      <dd className="font-bold text-stone-900">{detailGreenBeanLot.fermentationTimeHours} jam</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Metode Pengeringan</dt>
                      <dd className="font-bold text-stone-900">{detailGreenBeanLot.dryingMethod}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Kadar Air &amp; aW</dt>
                      <dd className="font-bold text-stone-900">
                        {detailGreenBeanLot.moistureContentPercent}% • {detailGreenBeanLot.waterActivityAw} aW
                      </dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-stone-500">Defect &amp; Ukuran Biji</dt>
                      <dd className="font-bold text-stone-900">
                        {detailGreenBeanLot.defectCount} defect • {detailGreenBeanLot.screenSize}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-700" /> Silsilah Ceri &amp; Limbah Sirkular
                  </h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Petani Sumber</dt>
                      <dd className="font-bold text-stone-900">{detailGreenBeanLot.sourceFarmerName}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Lot Ceri Asal</dt>
                      <dd className="font-bold text-stone-900">{detailGreenBeanLot.sourceFarmerLotId}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Asal Lahan &amp; Elevasi</dt>
                      <dd className="font-bold text-stone-900">{detailGreenBeanLot.sourceOrigin} • {detailGreenBeanLot.altitude}</dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-stone-500">Cupping Notes</dt>
                      <dd className="font-bold text-stone-900 text-right">{detailGreenBeanLot.cuppingNotes.join(', ')}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-800" />
                  <span className="text-xs font-bold text-amber-950">
                    Aksi Lembar Dokumen Green Bean #{detailGreenBeanLot.id}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedLotForBarcode(detailGreenBeanLot);
                      setBarcodeModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs transition-all shadow-xs"
                  >
                    <Printer className="w-4 h-4" /> 🏷️ Cetak Barcode Karung
                  </button>
                  <button
                    onClick={() => setActiveView('marketplace')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs"
                  >
                    <Store className="w-4 h-4" /> Pasarkan di Marketplace →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* MODAL: EDIT ALOKASI LIMBAH SIRKULAR */}
      {editingWasteLot && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-teal-900 to-stone-900 text-white p-5 relative">
              <button
                onClick={() => setEditingWasteLot(null)}
                className="absolute top-4 right-4 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-black text-lg">Perbarui Alokasi Limbah Sirkular</h3>
              <p className="text-xs text-stone-300">Lot: {editingWasteLot.id} ({editingWasteLot.variety})</p>
            </div>

            <form onSubmit={handleSaveEditWaste} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Pemanfaatan / Produk Olahan Limbah
                </label>
                <input
                  type="text"
                  required
                  value={editWasteUtilization}
                  onChange={(e) => setEditWasteUtilization(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Penerima / Lokasi Alokasi Kompos
                </label>
                <input
                  type="text"
                  required
                  value={editWasteRecipient}
                  onChange={(e) => setEditWasteRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Volume / Bobot Limbah Terkelola (kg/L)
                </label>
                <input
                  type="number"
                  required
                  value={editWasteWeight}
                  onChange={(e) => setEditWasteWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingWasteLot(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-bold"
                >
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Processor Barcode Modal */}
      <ProcessorBarcodeModal
        isOpen={barcodeModalOpen}
        onClose={() => setBarcodeModalOpen(false)}
        lot={selectedLotForBarcode}
        isNewProcess={false}
      />
    </div>
  );
};

