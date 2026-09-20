import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Cog,
  ShoppingCart,
  Layers,
  History,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Sparkles,
  X,
  Printer,
  Recycle,
  Leaf,
  Star,
  Search,
  Filter,
  ArrowRight,
  Calculator,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { FarmerHarvestLot, ProcessedGreenBeanLot, CoffeeWasteManagement } from '../types/coffee';
import { ProcessorBarcodeModal } from './ProcessorBarcodeModal';
import { calculateProcessorEcoRating } from '../utils/ecoRating';
import { MetricCard } from './admin/MetricCard';

export const ProcessorView: React.FC = () => {
  const {
    currentUser,
    farmerLots,
    processedLots,
    buyCherryAndCreateProcess,
    updateProcessedLotWaste,
    transactions,
  } = useCoffee();

  const [activeTab, setActiveTab] = useState<'marketplace' | 'catalog' | 'history'>('marketplace');
  const [selectedLotToProcess, setSelectedLotToProcess] = useState<FarmerHarvestLot | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [processMethodFilter, setProcessMethodFilter] = useState<string>('all');

  // Barcode modal state for processed green bean lots
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [selectedLotForBarcode, setSelectedLotForBarcode] = useState<ProcessedGreenBeanLot | null>(null);
  const [isNewProcess, setIsNewProcess] = useState(false);

  // Form state for processing
  const [boughtCherryKg, setBoughtCherryKg] = useState<number>(500);
  const [processMethod, setProcessMethod] = useState<ProcessedGreenBeanLot['processMethod']>('Anaerobic Natural');
  const [fermentationHours, setFermentationHours] = useState<number>(72);
  const [dryingMethod, setDryingMethod] = useState<ProcessedGreenBeanLot['dryingMethod']>('Solar Dryer Raised Bed');
  const [moisturePercent, setMoisturePercent] = useState<number>(11.2);
  const [waterActivityAw, setWaterActivityAw] = useState<number>(0.57);
  const [grade, setGrade] = useState<ProcessedGreenBeanLot['grade']>('Specialty Grade 1');
  const [defectCount, setDefectCount] = useState<number>(2);
  const [screenSize, setScreenSize] = useState('Size 17-18 (Large Screen)');
  const [greenBeanYieldKg, setGreenBeanYieldKg] = useState<number>(100);
  const [sellingPricePerKg, setSellingPricePerKg] = useState<number>(125000);
  const [cuppingNoteInput, setCuppingNoteInput] = useState('');
  const [cuppingNotes, setCuppingNotes] = useState<string[]>(['Floral', 'Citrus', 'Brown Sugar']);
  const [successMsg, setSuccessMsg] = useState('');

  // Form state for coffee waste management
  const [wasteType, setWasteType] = useState<string>('Kulit Ceri (Pulp / Cascara)');
  const [wasteUtilization, setWasteUtilization] = useState<string>('Bahan Baku Minuman Teh Cascara & Kompos Sirkular');
  const [wasteWeight, setWasteWeight] = useState<number>(225);
  const [wasteRecipient, setWasteRecipient] = useState<string>('Kelompok Tani Tilu Lestari & Rumah Kompos Organik');
  const [wasteProcessingMethod, setWasteProcessingMethod] = useState<string>('Solar Dryer Raised Bed (Food Grade) & Kompos Aerobik 30 Hari');
  const [wasteNotes, setWasteNotes] = useState<string>('Kulit ceri disortir higienis untuk teh cascara, lendir dan ampas difermentasi jadi pupuk kompos kebun.');

  // Modal state for editing existing lot's waste
  const [editingWasteLot, setEditingWasteLot] = useState<ProcessedGreenBeanLot | null>(null);
  const [editWasteType, setEditWasteType] = useState<string>('');
  const [editWasteUtilization, setEditWasteUtilization] = useState<string>('');
  const [editWasteWeight, setEditWasteWeight] = useState<number>(0);
  const [editWasteRecipient, setEditWasteRecipient] = useState<string>('');
  const [editWasteProcessingMethod, setEditWasteProcessingMethod] = useState<string>('');
  const [editWasteNotes, setEditWasteNotes] = useState<string>('');

  // Available harvest lots from farmers
  const availableFarmerLots = farmerLots.filter((lot) => lot.availableWeightKg > 0);
  const myProcessedLots = processedLots.filter(
    (lot) => lot.processorId === currentUser?.id || true
  );

  const myProcessorTransactions = transactions.filter(
    (t) =>
      t.fromName === currentUser?.name ||
      t.toName === currentUser?.name ||
      t.fromRole === 'pengolah' ||
      t.toRole === 'pengolah'
  );

  const totalProcessedKg = myProcessedLots.reduce((acc, curr) => acc + curr.greenBeanWeightKg, 0);
  const availableGreenBeanKg = myProcessedLots.reduce((acc, curr) => acc + curr.availableWeightKg, 0);

  // Eco-Sustainability & Circular Rating Calculations
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
      ? Number(
          (
            myEcoRatings.reduce((acc, curr) => acc + curr.starRating, 0) / myEcoRatings.length
          ).toFixed(2)
        )
      : 4.92;

  const totalWasteManagedKg = myProcessedLots.reduce(
    (acc, curr) =>
      acc +
      (curr.wasteManagement?.weightKgOrLiters || Math.round(curr.greenBeanWeightKg * 2.2)),
    0
  );

  const totalCarbonOffsetKg = Number(
    myEcoRatings.reduce((acc, curr) => acc + curr.carbonOffsetKg, 0).toFixed(1)
  );

  const handleOpenProcessModal = (lot: FarmerHarvestLot) => {
    setSelectedLotToProcess(lot);
    const defaultBuy = Math.min(lot.availableWeightKg, 500);
    setBoughtCherryKg(defaultBuy);
    setGreenBeanYieldKg(Math.round(defaultBuy * 0.2));
    setWasteWeight(Math.round(defaultBuy * 0.45));
  };

  const handleAddNote = () => {
    if (cuppingNoteInput.trim() && !cuppingNotes.includes(cuppingNoteInput.trim())) {
      setCuppingNotes([...cuppingNotes, cuppingNoteInput.trim()]);
      setCuppingNoteInput('');
    }
  };

  const handleRemoveNote = (noteToRemove: string) => {
    setCuppingNotes(cuppingNotes.filter((n) => n !== noteToRemove));
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
      ecoCertificate: 'CCT Zero-Waste Circular Standard',
      notes: editWasteNotes,
    };

    updateProcessedLotWaste(editingWasteLot.id, updatedWaste);
    setSuccessMsg(`Data alokasi limbah untuk lot ${editingWasteLot.id} berhasil diperbarui!`);
    setEditingWasteLot(null);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleConfirmProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLotToProcess) return;

    const wasteData: CoffeeWasteManagement = {
      wasteType,
      utilization: wasteUtilization,
      weightKgOrLiters: Number(wasteWeight),
      recipientOrLocation: wasteRecipient,
      processingMethod: wasteProcessingMethod,
      ecoCertificate: 'CCT Zero-Waste Circular Standard',
      notes: wasteNotes,
    };

    const newLot = buyCherryAndCreateProcess(
      selectedLotToProcess.id,
      boughtCherryKg,
      {
        processMethod,
        fermentationTimeHours: Number(fermentationHours),
        dryingMethod,
        moistureContentPercent: Number(moisturePercent),
        waterActivityAw: Number(waterActivityAw),
        grade,
        defectCount: Number(defectCount),
        screenSize,
        greenBeanWeightKg: Number(greenBeanYieldKg),
        pricePerKg: Number(sellingPricePerKg),
        cuppingNotes: cuppingNotes.length > 0 ? cuppingNotes : ['Clean Cup', 'Sweet Caramel'],
      },
      wasteData
    );

    setSuccessMsg(
      `Sukses membeli ${boughtCherryKg} kg cherry dari ${selectedLotToProcess.farmerName} dan berhasil mengolah menjadi ${greenBeanYieldKg} kg Green Bean (${processMethod}) dengan data pemanfaatan limbah sirkular!`
    );
    setSelectedLotToProcess(null);
    setActiveTab('catalog');

    if (newLot) {
      setSelectedLotForBarcode(newLot);
      setIsNewProcess(true);
      setBarcodeModalOpen(true);
    }

    setTimeout(() => setSuccessMsg(''), 6000);
  };

  // Filtered Processed Lots
  const filteredProcessedLots = myProcessedLots.filter((lot) => {
    const matchMethod = processMethodFilter === 'all' || lot.processMethod === processMethodFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      lot.id.toLowerCase().includes(q) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.sourceFarmerName.toLowerCase().includes(q) ||
      lot.processMethod.toLowerCase().includes(q);
    return matchMethod && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner (Cruip Amber / Slate Gradient) */}
      <div className="bg-linear-to-r from-amber-950 via-stone-900 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-amber-900/60">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30 backdrop-blur-xs">
            <Cog className="w-4 h-4 text-amber-400" />
            <span>Mill Tier 2 • Stasiun Pengolahan Kopi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Workstation Pengolahan Ceri & Penjualan Green Bean
          </h1>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
            Beli ceri segar langsung dari petani, kontrol fermentasi & kadar air secara presisi, alokasikan limbah ceri ke produk bernilai tambah, dan jual beras kopi specialty ke gudang logistik.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-stone-300 pt-1">
            <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Rating Sirkular: <strong>{avgStarRating} / 5.00 ⭐ ({avgEcoScore} Pts)</strong>
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs">
              Limbah Terkelola: <strong className="text-emerald-300">{totalWasteManagedKg.toLocaleString()} kg</strong>
            </span>
          </div>
        </div>

        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
          <Cog className="w-48 h-48" />
        </div>
      </div>

      {/* 4 Cruip-Style Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Ceri Tersedia di Petani"
          value={`${farmerLots.reduce((a, b) => a + b.availableWeightKg, 0).toLocaleString()} kg`}
          subtitle="Bahan baku siap dibeli"
          icon={<ShoppingCart className="w-5 h-5 text-emerald-600" />}
          color="emerald"
          badge="Marketplace"
        />

        <MetricCard
          title="Total Green Bean Diolah"
          value={`${totalProcessedKg.toLocaleString()} kg`}
          subtitle="Beras kopi specialty"
          icon={<Layers className="w-5 h-5 text-amber-600" />}
          color="amber"
          trend={{ value: '+14.2%', isPositive: true, label: 'vs target' }}
        />

        <MetricCard
          title="Green Bean Siap Jual"
          value={`${availableGreenBeanKg.toLocaleString()} kg`}
          subtitle="Tersedia untuk Gudang"
          icon={<CheckCircle2 className="w-5 h-5 text-blue-600" />}
          color="blue"
          badge="Siap Kirim"
        />

        <MetricCard
          title="Log Transaksi Mill"
          value={`${myProcessorTransactions.length} Log`}
          subtitle="Beli cherry & jual green bean"
          icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
          color="purple"
          trend={{ value: '100% Tercatat', isPositive: true }}
        />
      </div>

      {/* Cruip Styled Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'marketplace'
              ? 'bg-stone-900 text-white shadow-xs font-black'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Marketplace Ceri Petani</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300">
            {availableFarmerLots.length} Lot
          </span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'catalog'
              ? 'bg-stone-900 text-white shadow-xs font-black'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Katalog Green Bean Saya</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700">
            {myProcessedLots.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'history'
              ? 'bg-stone-900 text-white shadow-xs font-black'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Log Transaksi Mill</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700">
            {myProcessorTransactions.length}
          </span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-700" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg('')}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* TAB 1: MARKETPLACE BELI CERI PETANI */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Pilih Ceri Segar Petani untuk Diolah di Stasiun Anda
              </h2>
              <p className="text-xs text-stone-500">
                Cek kadar kemanisan Brix, elevasi, dan metode petik sebelum membeli dan mengonversi menjadi green bean.
              </p>
            </div>
          </div>

          {availableFarmerLots.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
              <Sparkles className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">
                Belum ada ceri yang tersedia saat ini
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Silakan ganti peran ke akun Petani untuk mendaftarkan hasil panen baru.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableFarmerLots.map((lot) => (
                <div
                  key={lot.id}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-stone-100 overflow-hidden">
                      <img
                        src={lot.photoUrl}
                        alt={lot.variety}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md">
                        {lot.id}
                      </div>
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                        Tersedia {lot.availableWeightKg} kg
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Petani: {lot.farmerName}
                        </span>
                        <h3 className="font-bold text-base text-stone-900 mt-1">
                          {lot.variety}
                        </h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          {lot.farmLocation}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                        <div>
                          <span className="text-[10px] text-stone-400 block font-semibold">Elevasi:</span>
                          <span className="font-semibold text-stone-800">{lot.altitude}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-semibold">Brix:</span>
                          <span className="font-black text-emerald-700">{lot.brix}° Brix</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-semibold">Petik:</span>
                          <span className="font-semibold text-stone-800 truncate block">
                            {lot.pickingMethod.split(' ')[0]}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-semibold">Panen:</span>
                          <span className="font-semibold text-stone-800">{lot.harvestDate}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 italic">
                        "{lot.notes}"
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Harga Cherry:</span>
                      <span className="text-sm font-black text-stone-900">
                        Rp {lot.pricePerKg.toLocaleString()}
                        <span className="text-xs font-normal text-stone-500"> / kg</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenProcessModal(lot)}
                      className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <Cog className="w-3.5 h-3.5" />
                      Beli & Olah Cherry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: KATALOG GREEN BEAN SAYA */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Toolbar Search & Method Filter */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ID green bean, varietas, petani asal, atau metode olah..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Metode:
              </span>
              <select
                value={processMethodFilter}
                onChange={(e) => setProcessMethodFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Semua Metode</option>
                <option value="Full Washed">Full Washed</option>
                <option value="Natural / Dry">Natural / Dry</option>
                <option value="Honey (Yellow/Red)">Honey</option>
                <option value="Anaerobic Natural">Anaerobic Natural</option>
                <option value="Wine Process">Wine Process</option>
              </select>
            </div>
          </div>

          {/* Green Bean Lots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProcessedLots.map((gb) => {
              const isAvailable = gb.availableWeightKg > 0;
              const ecoRating = calculateProcessorEcoRating(
                gb.wasteManagement,
                gb.sourceTotalCherryWeightKg || gb.greenBeanWeightKg * 5,
                gb.greenBeanWeightKg
              );

              return (
                <div
                  key={gb.id}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-stone-100 overflow-hidden">
                      <img
                        src={gb.photoUrl}
                        alt={gb.variety}
                        className="w-full h-full object-cover"
                      />
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
                        <h3 className="font-bold text-base text-stone-900">
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

                      {/* Cupping Notes */}
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

                      {/* Eco-Sustainability Card */}
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
                        <div className="flex items-center justify-between text-[10px] text-teal-800/80 border-t border-teal-200/60 pt-1">
                          <span>Limbah: {gb.wasteManagement?.weightKgOrLiters || Math.round(gb.greenBeanWeightKg * 2.2)} kg</span>
                          <span className="text-emerald-700 font-semibold">-{ecoRating.carbonOffsetKg} kg CO₂e</span>
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

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block">Stok Gudang:</span>
                      <span className="text-xs font-bold text-amber-800">
                        {gb.availableWeightKg} / {gb.greenBeanWeightKg} kg
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 pb-4 pt-1 bg-stone-50 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditWaste(gb)}
                      className="py-2 px-2 rounded-xl border border-teal-300 bg-white hover:bg-teal-50 text-teal-950 font-bold text-[11px] transition-colors flex items-center justify-center gap-1 shadow-2xs"
                      title="Perbarui data alokasi limbah"
                    >
                      <Recycle className="w-3.5 h-3.5 text-teal-700" />
                      <span>Alokasi Limbah</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLotForBarcode(gb);
                        setIsNewProcess(false);
                        setBarcodeModalOpen(true);
                      }}
                      className="py-2 px-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 hover:text-amber-200 font-bold text-[11px] transition-colors flex items-center justify-center gap-1 shadow-xs"
                      title="Cetak label karung ber-barcode"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cetak Barcode</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: LOG TRANSAKSI */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <History className="w-5 h-5 text-amber-600" />
                Log Aktivitas Transaksi Stasiun Pengolahan
              </h2>
              <p className="text-xs text-stone-500">
                Catatan pembelian ceri dari petani dan penjualan green bean ke gudang.
              </p>
            </div>
          </div>

          {myProcessorTransactions.length === 0 ? (
            <p className="text-xs text-stone-500 py-8 text-center">
              Belum ada log transaksi stasiun pengolahan.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">No. TRX</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Pengirim</th>
                    <th className="py-3 px-4">Penerima</th>
                    <th className="py-3 px-4">Barang</th>
                    <th className="py-3 px-4">Volume</th>
                    <th className="py-3 px-4">Total Nilai</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {myProcessorTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-stone-800">{trx.id}</td>
                      <td className="py-3 px-4 text-stone-600">{trx.date}</td>
                      <td className="py-3 px-4 font-semibold text-stone-900">{trx.fromName}</td>
                      <td className="py-3 px-4 font-semibold text-stone-900">{trx.toName}</td>
                      <td className="py-3 px-4 text-stone-700">{trx.itemName}</td>
                      <td className="py-3 px-4 font-bold text-amber-800">{trx.quantity}</td>
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

      {/* Modal: Proses Cherry ke Green Bean */}
      {selectedLotToProcess && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-linear-to-r from-amber-900 to-stone-900 text-white p-6 relative">
              <button
                onClick={() => setSelectedLotToProcess(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <Cog className="w-3.5 h-3.5" />
                Workstation Pengolahan Ceri $\rightarrow$ Green Bean
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Beli & Konversi Lot: {selectedLotToProcess.variety}
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                Petani: {selectedLotToProcess.farmerName} • Asal: {selectedLotToProcess.farmLocation} ({selectedLotToProcess.altitude})
              </p>
            </div>

            <form onSubmit={handleConfirmProcess} className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Bagian 1: Pembelian Cherry */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  1. Volume Pembelian Cherry
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Beli Cherry (kg) - Maks: {selectedLotToProcess.availableWeightKg} kg
                    </label>
                    <input
                      type="number"
                      required
                      min="10"
                      max={selectedLotToProcess.availableWeightKg}
                      value={boughtCherryKg}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setBoughtCherryKg(val);
                        setGreenBeanYieldKg(Math.round(val * 0.2));
                        setWasteWeight(Math.round(val * 0.45));
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs text-stone-500">Total Biaya Pembelian Cherry:</span>
                    <span className="text-base font-black text-amber-900">
                      Rp {(boughtCherryKg * selectedLotToProcess.pricePerKg).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      (Rp {selectedLotToProcess.pricePerKg.toLocaleString()}/kg ke Petani)
                    </span>
                  </div>
                </div>
              </div>

              {/* Bagian 2: Spesifikasi Pengolahan */}
              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                  2. Parameter Pengolahan & Pengeringan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Metode Pengolahan
                    </label>
                    <select
                      value={processMethod}
                      onChange={(e) =>
                        setProcessMethod(e.target.value as ProcessedGreenBeanLot['processMethod'])
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Full Washed">Full Washed (Clean & Crisp)</option>
                      <option value="Natural / Dry">Natural / Dry (Sweet & Fruity)</option>
                      <option value="Honey (Yellow/Red)">Honey Process</option>
                      <option value="Anaerobic Natural">Anaerobic Natural (Complex & Winey)</option>
                      <option value="Wine Process">Wine Process</option>
                      <option value="Wet Hulled (Giling Basah)">Wet Hulled (Giling Basah)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Waktu Fermentasi (Jam)
                    </label>
                    <input
                      type="number"
                      required
                      value={fermentationHours}
                      onChange={(e) => setFermentationHours(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Metode Penjemuran
                    </label>
                    <select
                      value={dryingMethod}
                      onChange={(e) =>
                        setDryingMethod(e.target.value as ProcessedGreenBeanLot['dryingMethod'])
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Solar Dryer Raised Bed">Solar Dryer Raised Bed (Higienis)</option>
                      <option value="Patio Penjemuran">Patio Penjemuran</option>
                      <option value="Mechanical Controlled Dryer">Mechanical Controlled Dryer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Target Kadar Air (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={moisturePercent}
                      onChange={(e) => setMoisturePercent(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-stone-500">Standar aman simpan: 10% - 12%</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Water Activity ($a_w$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={waterActivityAw}
                      onChange={(e) => setWaterActivityAw(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-stone-500">Standar SCA: aw &lt; 0.60</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Jumlah Cacat (Defect / 350g)
                    </label>
                    <input
                      type="number"
                      required
                      value={defectCount}
                      onChange={(e) => setDefectCount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 3: Hasil Olah & Harga Jual */}
              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                  3. Hasil Green Bean & Penawaran ke Gudang
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Estimasi Rendemen Green Bean (kg)
                    </label>
                    <input
                      type="number"
                      required
                      value={greenBeanYieldKg}
                      onChange={(e) => setGreenBeanYieldKg(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-stone-500">
                      Rendemen rata-rata ~{Math.round((greenBeanYieldKg / (boughtCherryKg || 1)) * 100)}% dari ceri segar
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Harga Jual Green Bean per kg (Rp)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      required
                      value={sellingPricePerKg}
                      onChange={(e) => setSellingPricePerKg(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 4: Alokasi Limbah Sirkular */}
              <div className="bg-teal-50/90 border border-teal-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Recycle className="w-4 h-4 text-teal-700" />
                    4. Alokasi Limbah Sirkular (Eco-Processing)
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    Sertifikasi CCT Zero-Waste
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-teal-900 mb-1">
                      Alur Pemanfaatan Limbah
                    </label>
                    <input
                      type="text"
                      required
                      value={wasteUtilization}
                      onChange={(e) => setWasteUtilization(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-teal-300 text-xs bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-teal-900 mb-1">
                      Penerima / Lokasi Alokasi
                    </label>
                    <input
                      type="text"
                      required
                      value={wasteRecipient}
                      onChange={(e) => setWasteRecipient(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-teal-300 text-xs bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Tasting Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Karakter Cupping Notes
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={cuppingNoteInput}
                    onChange={(e) => setCuppingNoteInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNote();
                      }
                    }}
                    placeholder="Ketik aroma (misal: Blackberry, Jasmine)..."
                    className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-900 transition-colors"
                  >
                    Tambah
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cuppingNotes.map((n) => (
                    <span
                      key={n}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300"
                    >
                      {n}
                      <button
                        type="button"
                        onClick={() => handleRemoveNote(n)}
                        className="hover:text-red-700 ml-1 font-bold"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedLotToProcess(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Konfirmasi Proses & Buat Green Bean
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Alokasi Limbah */}
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
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold"
                >
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
        isNewProcess={isNewProcess}
      />
    </div>
  );
};
