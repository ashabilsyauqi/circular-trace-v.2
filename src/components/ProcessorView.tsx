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
} from 'lucide-react';
import { FarmerHarvestLot, ProcessedGreenBeanLot, CoffeeWasteManagement } from '../types/coffee';
import { ProcessorBarcodeModal } from './ProcessorBarcodeModal';
import { calculateProcessorEcoRating } from '../utils/ecoRating';

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
    (t) => t.fromName === currentUser?.name || t.toName === currentUser?.name || t.fromRole === 'pengolah' || t.toRole === 'pengolah'
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

  // Live calculation for Process Cherry Modal
  const liveProcessRating = calculateProcessorEcoRating(
    {
      wasteType,
      utilization: wasteUtilization,
      weightKgOrLiters: Number(wasteWeight),
      recipientOrLocation: wasteRecipient,
      processingMethod: wasteProcessingMethod,
      notes: wasteNotes,
    },
    boughtCherryKg,
    greenBeanYieldKg
  );

  // Live calculation for Edit Waste Modal
  const liveEditWasteRating = calculateProcessorEcoRating(
    {
      wasteType: editWasteType,
      utilization: editWasteUtilization,
      weightKgOrLiters: Number(editWasteWeight),
      recipientOrLocation: editWasteRecipient,
      processingMethod: editWasteProcessingMethod,
      notes: editWasteNotes,
    },
    editingWasteLot?.sourceTotalCherryWeightKg ||
      (editingWasteLot?.greenBeanWeightKg ? editingWasteLot.greenBeanWeightKg * 5 : 500),
    editingWasteLot?.greenBeanWeightKg || 100
  );

  const handleOpenProcessModal = (lot: FarmerHarvestLot) => {
    setSelectedLotToProcess(lot);
    const defaultBuy = Math.min(lot.availableWeightKg, 500);
    setBoughtCherryKg(defaultBuy);
    // Standard cherry to green bean yield is approximately 18-20%
    setGreenBeanYieldKg(Math.round(defaultBuy * 0.2));
    // Standard cherry pulp waste is approximately 45%
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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-amber-900 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <Cog className="w-4 h-4 text-amber-400" />
            Dasbor Pengolah Kopi • Stasiun Olah (Mill Tier)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Workstation Pengolahan Ceri & Penjualan Green Bean
          </h1>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
            Beli ceri segar pilihan dari petani, lakukan pengolahan basah/kering terstandarisasi, input data parameter kadar air & defect, lalu jual green bean berkualitas ke gudang logistik.
          </p>
        </div>

        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
          <Cog className="w-48 h-48" />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Ceri Tersedia di Petani</span>
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {farmerLots.reduce((a, b) => a + b.availableWeightKg, 0).toLocaleString()} kg
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Bahan baku siap dibeli</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Total Green Bean Diolah</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{totalProcessedKg.toLocaleString()} kg</div>
          <span className="text-[11px] text-amber-600 font-medium">Beras kopi specialty</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Green Bean Siap Jual</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{availableGreenBeanKg.toLocaleString()} kg</div>
          <span className="text-[11px] text-blue-600 font-medium">Tersedia untuk Gudang</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Riwayat Transaksi</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {myProcessorTransactions.length} Log
          </div>
          <span className="text-[11px] text-stone-500 font-medium">Beli cherry & jual green bean</span>
        </div>
      </div>

      {/* Eco-Processor Sustainability & Star Rating Highlight Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
            <Recycle className="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                Rating Pengolah: {avgStarRating} / 5.00 ({avgEcoScore} Poin)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-200 text-[10px] font-semibold border border-teal-400/30">
                🌿 Zero-Waste Eco Champion
              </span>
            </div>
            <h2 className="text-lg font-black tracking-tight text-white">
              Sertifikasi Pengelolaan Limbah & Peringkat Sirkular Tinggi
            </h2>
            <p className="text-xs text-stone-300 max-w-xl mt-1 leading-relaxed">
              Karena stasiun pengolahan ini aktif mengolah kulit ceri menjadi bahan baku teh cascara dan pupuk kompos untuk dikembalikan ke kebun petani, sistem CCT memberikan <strong>Rating Tertinggi (⭐⭐⭐⭐⭐ {avgStarRating})</strong> yang tampil di seluruh barcode QR pembeli kopi sebagai <em>Nilai Plus / USP</em>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 w-full md:w-auto shrink-0">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
            <span className="text-[10px] text-emerald-200 block">Limbah Terkelola</span>
            <span className="text-lg font-black text-emerald-300">{totalWasteManagedKg.toLocaleString()} kg/L</span>
            <span className="text-[9px] text-stone-300 block">100% dialihkan dari TPA</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
            <span className="text-[10px] text-teal-200 block">Pencegahan CO₂e</span>
            <span className="text-lg font-black text-teal-300">-{totalCarbonOffsetKg} kg</span>
            <span className="text-[9px] text-stone-300 block">Emisi metana ditekan</span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-amber-100 border border-amber-300 text-amber-950 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-700" />
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'marketplace'
              ? 'border-amber-600 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Marketplace Ceri Petani ({availableFarmerLots.length} Lot)
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'catalog'
              ? 'border-amber-600 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Katalog Green Bean Saya ({myProcessedLots.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'history'
              ? 'border-amber-600 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <History className="w-4 h-4" />
          Log Pembelian & Penjualan ({myProcessorTransactions.length})
        </button>
      </div>

      {/* Tab 1: Marketplace Beli Ceri Petani */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Katalog Ceri Segar dari Petani
              </h2>
              <p className="text-xs text-stone-500">
                Pilih ceri petani berdasarkan varietas, elevasi mdpl, dan tingkat Brix untuk diolah di stasiun Anda.
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
                Silakan ganti peran ke akun Petani untuk mengunggah hasil panen baru.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableFarmerLots.map((lot) => (
                <div
                  key={lot.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-stone-100">
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
                          <span className="text-[11px] text-stone-400 block">Ketinggian:</span>
                          <span className="font-semibold text-stone-800">{lot.altitude}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-stone-400 block">Kadar Gula Brix:</span>
                          <span className="font-semibold text-emerald-700">{lot.brix}° Brix</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-stone-400 block">Standar Petik:</span>
                          <span className="font-semibold text-stone-800 truncate block">
                            {lot.pickingMethod.split(' ')[0]}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-stone-400 block">Tanggal Panen:</span>
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
                      className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
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

      {/* Tab 2: Katalog Green Bean Pengolah */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Katalog Green Bean Siap Dijual ke Gudang ({myProcessedLots.length})
              </h2>
              <p className="text-xs text-stone-500">
                Green bean yang telah selesai fermentasi, drying, dan sortasi fisik.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myProcessedLots.map((gb) => {
              const isAvailable = gb.availableWeightKg > 0;
              return (
                <div
                  key={gb.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 bg-stone-100">
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
                          <strong className="text-stone-700">{gb.sourceFarmerName}</strong>
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
                          <span className="text-[11px] text-stone-400 block">Kadar Air:</span>
                          <span className="font-semibold text-stone-800">{gb.moistureContentPercent}%</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-stone-400 block">Water Activity:</span>
                          <span className="font-semibold text-stone-800">{gb.waterActivityAw} aW</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-stone-400 block">Sortasi Defect:</span>
                          <span className="font-semibold text-stone-800">{gb.defectCount} defect/350g</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-stone-400 block">Fermentasi:</span>
                          <span className="font-semibold text-stone-800">{gb.fermentationTimeHours} Jam</span>
                        </div>
                      </div>

                      {/* Cupping notes chips */}
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

                      {/* Eco-Processing Waste Management & Star Rating Badge */}
                      {(() => {
                        const lotRating = calculateProcessorEcoRating(
                          gb.wasteManagement,
                          gb.sourceTotalCherryWeightKg || gb.greenBeanWeightKg * 5,
                          gb.greenBeanWeightKg
                        );
                        return (
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
                                ⭐ {lotRating.starRating} ({lotRating.ecoScore} Pts)
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-teal-800/80 border-t border-teal-200/60 pt-1">
                              <span>Limbah: {gb.wasteManagement?.weightKgOrLiters || Math.round(gb.greenBeanWeightKg * 2.2)} kg ({lotRating.diversionRatePercent}% Sirkular)</span>
                              <span className="text-emerald-700 font-semibold">-{lotRating.carbonOffsetKg} kg CO₂e</span>
                            </div>
                          </div>
                        );
                      })()}
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
                      <span className="text-[10px] text-stone-400 block">Stok untuk Gudang:</span>
                      <span className="text-xs font-bold text-amber-800">
                        {gb.availableWeightKg} / {gb.greenBeanWeightKg} kg
                      </span>
                    </div>
                  </div>

                  {/* Actions: Edit Waste & Print Barcode */}
                  <div className="px-4 pb-4 pt-1 bg-stone-50 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditWaste(gb)}
                      className="py-2 px-2 rounded-xl border border-teal-300 bg-white hover:bg-teal-50 text-teal-950 font-bold text-[11px] transition-colors flex items-center justify-center gap-1 shadow-2xs"
                      title="Perbarui data pemanfaatan limbah"
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

      {/* Tab 3: Log Transaksi */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600" />
            Log Aktivitas Transaksi Stasiun Pengolahan
          </h2>

          {myProcessorTransactions.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">
              Belum ada log transaksi pembelian cherry atau penjualan green bean.
            </p>
          ) : (
            <div className="overflow-x-auto">
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
                    <tr key={trx.id} className="hover:bg-stone-50/50">
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
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
                Petani Asal: {selectedLotToProcess.farmerName} • Lokasi: {selectedLotToProcess.farmLocation} ({selectedLotToProcess.altitude})
              </p>
            </div>

            <form onSubmit={handleConfirmProcess} className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Bagian 1: Pembelian Cherry */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-3">
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
                        // Auto-calculate expected yield ~20%
                        setGreenBeanYieldKg(Math.round(val * 0.2));
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
                  2. Spesifikasi Pengolahan & Parameter Lab
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
                      <option value="Full Washed">Full Washed (Wet Process)</option>
                      <option value="Natural / Dry">Natural / Dry Process</option>
                      <option value="Honey (Yellow/Red)">Honey (Yellow / Red / Black Honey)</option>
                      <option value="Anaerobic Natural">Anaerobic Natural (Controlled Ferment)</option>
                      <option value="Wine Process">Wine Process (Extended Maceration)</option>
                      <option value="Wet Hulled (Giling Basah)">Wet Hulled (Giling Basah Tradisional)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Durasi Fermentasi (Jam)
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
                      Metode Pengeringan (Drying)
                    </label>
                    <select
                      value={dryingMethod}
                      onChange={(e) =>
                        setDryingMethod(e.target.value as ProcessedGreenBeanLot['dryingMethod'])
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Solar Dryer Raised Bed">Solar Dryer Raised Bed (Greenhouse)</option>
                      <option value="Patio Penjemuran">Patio Penjemuran Matahari Langsung</option>
                      <option value="Mechanical Controlled Dryer">Mechanical Controlled Low-Temp Dryer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Kadar Air Akhir (% Moisture)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={moisturePercent}
                      onChange={(e) => setMoisturePercent(Number(e.target.value))}
                      placeholder="11.2"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-stone-500">Standar SCA: 10.0% - 12.0%</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Water Activity (aW)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={waterActivityAw}
                      onChange={(e) => setWaterActivityAw(Number(e.target.value))}
                      placeholder="0.57"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-stone-500">Optimal aW: &lt; 0.60</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Grade Green Bean
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as ProcessedGreenBeanLot['grade'])}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Specialty Grade 1">Specialty Grade 1 (Defect &le; 5)</option>
                      <option value="Grade 2">Grade 2 (Defect 6 - 15)</option>
                      <option value="Commercial Fine">Commercial Fine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Ukuran Ayakan (Screen Size)
                    </label>
                    <input
                      type="text"
                      required
                      value={screenSize}
                      onChange={(e) => setScreenSize(e.target.value)}
                      placeholder="Size 17-18 (Large Screen)"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Defect Fisik (per 350g)
                    </label>
                    <input
                      type="number"
                      required
                      value={defectCount}
                      onChange={(e) => setDefectCount(Number(e.target.value))}
                      placeholder="2"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-stone-500">Grade 1: &le; 5 cacat fisik</span>
                  </div>
                </div>
              </div>

              {/* Bagian 3: Hasil Green Bean & Harga Jual ke Gudang */}
              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                  3. Rendemen Green Bean & Penawaran ke Gudang
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Hasil Berat Bersih Green Bean (kg)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={greenBeanYieldKg}
                      onChange={(e) => setGreenBeanYieldKg(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-stone-500">
                      Rendemen: {((greenBeanYieldKg / boughtCherryKg) * 100).toFixed(1)}% dari ceri
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Harga Jual Green Bean per kg ke Gudang (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      step="1000"
                      value={sellingPricePerKg}
                      onChange={(e) => setSellingPricePerKg(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-amber-800 font-bold">
                      Total Nilai Green Bean: Rp {(greenBeanYieldKg * sellingPricePerKg).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bagian 4: Cupping Notes Tag Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Karakteristik Rasa Awal (Cupping Notes)
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
                    placeholder="Ketik aroma (misal: Blackberry, Jasmine, Honey)..."
                    className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-colors"
                  >
                    Tambah
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cuppingNotes.map((note) => (
                    <span
                      key={note}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-900 border border-amber-300"
                    >
                      {note}
                      <button
                        type="button"
                        onClick={() => handleRemoveNote(note)}
                        className="hover:text-red-700 ml-1"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bagian 5: Pengelolaan & Pemanfaatan Limbah Kopi (Zero-Waste Circularity) */}
              <div className="bg-teal-50/80 border-2 border-teal-300/80 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-teal-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Recycle className="w-4 h-4 text-teal-700" />
                    <h3 className="text-xs font-black text-teal-950 uppercase tracking-wider">
                      5. Pengelolaan & Pemanfaatan Limbah Kopi (Eco-Circularity Trace)
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold bg-white text-teal-900 px-2 py-0.5 rounded-full border border-teal-300 flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-600" />
                    Tercatat di Barcode
                  </span>
                </div>
                <p className="text-xs text-teal-900 leading-relaxed">
                  Setiap proses pengupasan ceri menghasilkan limbah padat (kulit ceri/pulp/husk) dan limbah cair. Masukkan rencana alur pemanfaatan limbah ini agar tercatat secara transparan di barcode label karung green bean.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Kategori Limbah yang Dihasilkan
                    </label>
                    <select
                      value={wasteType}
                      onChange={(e) => setWasteType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      <option value="Kulit Ceri (Pulp / Cascara)">Kulit Ceri (Pulp / Cascara Kering)</option>
                      <option value="Kulit Tanduk (Husk / Parchment)">Kulit Tanduk (Husk / Parchment Kering)</option>
                      <option value="Air Limbah Fermentasi & Pencucian">Air Limbah Fermentasi & Pencucian</option>
                      <option value="Mucilage (Lendir Kopi)">Mucilage (Lendir Terfermentasi)</option>
                      <option value="Limbah Terpadu (Pulp & Cairan)">Limbah Terpadu (Pulp + Air Cucian)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Alur Pemanfaatan / Mau Dikemanakan
                    </label>
                    <select
                      value={wasteUtilization}
                      onChange={(e) => setWasteUtilization(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-500 bg-white font-semibold text-teal-900"
                    >
                      <option value="Bahan Baku Minuman Teh Cascara & Kompos Sirkular">Bahan Minuman Teh Cascara Artisan & Kompos</option>
                      <option value="Kompos Pupuk Organik untuk Kebun Petani (Sirkular)">Kompos Pupuk Organik untuk Kebun Petani (Sirkular)</option>
                      <option value="Briket Energi Bahan Bakar Biomassa">Briket Energi Bahan Bakar Biomassa Ramah Lingkungan</option>
                      <option value="Pakan Ternak Terfermentasi Silase">Pakan Ternak Terfermentasi Silase</option>
                      <option value="Netralisasi IPAL Biologis Mandiri">Netralisasi IPAL Biologis Mandiri (Zero Polusi)</option>
                      <option value="Pemanfaatan Khusus Industri Terkait">Pemanfaatan Khusus Industri Terkait</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Estimasi Kuantitas Limbah (kg atau Liter)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={wasteWeight}
                      onChange={(e) => setWasteWeight(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                    <span className="text-[10px] text-stone-500">
                      Rata-rata limbah padat ceri: ~40-50% dari total berat ceri
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Pihak / Mitra Penerima Limbah
                    </label>
                    <input
                      type="text"
                      required
                      value={wasteRecipient}
                      onChange={(e) => setWasteRecipient(e.target.value)}
                      placeholder="Contoh: Kelompok Tani Tilu & Rumah Kompos Organik"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Metode Pengolahan Ramah Lingkungan
                    </label>
                    <input
                      type="text"
                      required
                      value={wasteProcessingMethod}
                      onChange={(e) => setWasteProcessingMethod(e.target.value)}
                      placeholder="Contoh: Pengeringan Solar Raised Bed (Food Grade) & Kompos Aerobik 30 Hari"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Catatan Sirkularitas & Pengolahan Limbah
                    </label>
                    <textarea
                      rows={2}
                      value={wasteNotes}
                      onChange={(e) => setWasteNotes(e.target.value)}
                      placeholder="Catatan tambahan alur pengolahan limbah..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                  </div>
                </div>

                {/* Live Eco-Rating & Circular Score Preview Box */}
                <div className="bg-white/95 rounded-2xl p-4 border border-teal-300 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                      <span className="text-xs font-black text-stone-900">
                        Kalkulasi Proyeksi Eco-Rating Pengolah:
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                      ⭐ {liveProcessRating.starRating} / 5.00 ({liveProcessRating.ecoScore} Poin)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                    <div className="bg-teal-50/70 p-2 rounded-xl border border-teal-200/60">
                      <span className="text-stone-500 block">Pengalihan Limbah</span>
                      <span className="font-bold text-teal-900 text-xs">{liveProcessRating.breakdown.diversionScore.score} / 40 Pts</span>
                      <span className="text-[9px] text-teal-700 block">({liveProcessRating.diversionRatePercent}%)</span>
                    </div>
                    <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-200/60">
                      <span className="text-stone-500 block">Nilai Upcycling</span>
                      <span className="font-bold text-emerald-900 text-xs">{liveProcessRating.breakdown.utilizationScore.score} / 25 Pts</span>
                      <span className="text-[9px] text-emerald-700 block">Cascara / Pupuk</span>
                    </div>
                    <div className="bg-blue-50/70 p-2 rounded-xl border border-blue-200/60">
                      <span className="text-stone-500 block">Metode Rendah Emisi</span>
                      <span className="font-bold text-blue-900 text-xs">{liveProcessRating.breakdown.methodScore.score} / 20 Pts</span>
                      <span className="text-[9px] text-blue-700 block">Solar Raised Bed</span>
                    </div>
                    <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200/60">
                      <span className="text-stone-500 block">Closed-Loop Petani</span>
                      <span className="font-bold text-amber-900 text-xs">{liveProcessRating.breakdown.circularityScore.score} / 15 Pts</span>
                      <span className="text-[9px] text-amber-700 block">Kembali ke Hulu</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-[11px] flex items-center justify-between">
                    <span className="font-medium">
                      🌿 <strong>Dampak:</strong> Mencegah ~{liveProcessRating.carbonOffsetKg} kg emisi CO₂e & menghasilkan ~{liveProcessRating.compostProducedKg} kg pupuk organik.
                    </span>
                    <span className="font-bold text-[10px] text-emerald-800 shrink-0 ml-2">Nilai Plus Terkunci ✓</span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedLotToProcess(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Konfirmasi Pembelian & Terbitkan Green Bean
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Existing Waste Allocation Modal */}
      {editingWasteLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 animate-fadeIn">
            <div className="p-6 bg-gradient-to-r from-teal-900 via-emerald-900 to-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                  <Recycle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    Alokasi & Sirkularitas Limbah Kopi
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-500/30 text-teal-200 border border-teal-400/30">
                      {editingWasteLot.id}
                    </span>
                  </h3>
                  <p className="text-xs text-teal-200/80">
                    Perbarui data pemanfaatan limbah agar tercatat otomatis pada barcode QR sirkular
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingWasteLot(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditWaste} className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 text-xs flex items-center gap-3">
                <Leaf className="w-5 h-5 text-teal-700 shrink-0" />
                <span>
                  Informasi ini akan terintegrasi langsung ke <strong>Pillar ke-3 Barcode QR & Label Fisik</strong> Green Bean untuk membuktikan komitmen <em>Zero-Waste Circular Economy</em>.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Jenis Limbah Kopi
                  </label>
                  <select
                    value={editWasteType}
                    onChange={(e) => setEditWasteType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Kulit Ceri (Pulp / Cascara)">Kulit Ceri (Pulp / Cascara)</option>
                    <option value="Lendir & Air Limbah Kupas (Mucilage & Wastewater)">Lendir & Air Limbah Kupas (Mucilage & Wastewater)</option>
                    <option value="Kulit Tanduk (Parchment / Husk)">Kulit Tanduk (Parchment / Husk)</option>
                    <option value="Kopi Cacat Sortasi Kering / Rambang">Kopi Cacat Sortasi Kering / Rambang</option>
                    <option value="Campuran Limbah Padat & Organik">Campuran Limbah Padat & Organik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Tujuan Alokasi / Pemanfaatan
                  </label>
                  <select
                    value={editWasteUtilization}
                    onChange={(e) => setEditWasteUtilization(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Bahan Baku Minuman Teh Cascara & Kompos Sirkular">Bahan Baku Minuman Teh Cascara & Kompos Sirkular</option>
                    <option value="Kompos Organik & Bio-Fertilizer untuk Perkebunan">Kompos Organik & Bio-Fertilizer untuk Perkebunan</option>
                    <option value="Briket Biomassa Bahan Bakar Alternatif">Briket Biomassa Bahan Bakar Alternatif</option>
                    <option value="Pakan Ternak Fermentasi Probiotik">Pakan Ternak Fermentasi Probiotik</option>
                    <option value="Biogas & Energi Terbarukan">Biogas & Energi Terbarukan</option>
                    <option value="Filtrasi IPAL & Air Siram Tanaman">Filtrasi IPAL & Air Siram Tanaman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Estimasi Bobot / Volume (kg atau Liter)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editWasteWeight}
                    onChange={(e) => setEditWasteWeight(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Pihak Penerima / Mitra Sirkularitas
                  </label>
                  <input
                    type="text"
                    required
                    value={editWasteRecipient}
                    onChange={(e) => setEditWasteRecipient(e.target.value)}
                    placeholder="Contoh: Kelompok Tani Tilu & Rumah Kompos Organik"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Metode Pengolahan Ramah Lingkungan
                  </label>
                  <input
                    type="text"
                    required
                    value={editWasteProcessingMethod}
                    onChange={(e) => setEditWasteProcessingMethod(e.target.value)}
                    placeholder="Contoh: Solar Dryer Raised Bed (Food Grade) & Kompos Aerobik 30 Hari"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Catatan Alokasi & Sirkularitas
                  </label>
                  <textarea
                    rows={2}
                    value={editWasteNotes}
                    onChange={(e) => setEditWasteNotes(e.target.value)}
                    placeholder="Catatan tambahan alur pengolahan limbah..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>

              {/* Live Eco-Rating Preview in Edit Modal */}
              <div className="bg-teal-50/90 rounded-2xl p-4 border border-teal-300 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span className="text-xs font-black text-teal-950">
                      Proyeksi Rating Pengolah Setelah Pembaruan:
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white text-emerald-900 border border-emerald-300">
                    ⭐ {liveEditWasteRating.starRating} / 5.00 ({liveEditWasteRating.ecoScore} Poin)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="bg-white p-2 rounded-xl border border-teal-200/60">
                    <span className="text-stone-500 block">Pengalihan Limbah</span>
                    <span className="font-bold text-teal-900 text-xs">{liveEditWasteRating.breakdown.diversionScore.score} / 40</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-200/60">
                    <span className="text-stone-500 block">Nilai Upcycling</span>
                    <span className="font-bold text-emerald-900 text-xs">{liveEditWasteRating.breakdown.utilizationScore.score} / 25</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-200/60">
                    <span className="text-stone-500 block">Metode Olah</span>
                    <span className="font-bold text-blue-900 text-xs">{liveEditWasteRating.breakdown.methodScore.score} / 20</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-amber-200/60">
                    <span className="text-stone-500 block">Closed-Loop Petani</span>
                    <span className="font-bold text-amber-900 text-xs">{liveEditWasteRating.breakdown.circularityScore.score} / 15</span>
                  </div>
                </div>

                <div className="text-[11px] text-teal-900 flex items-center justify-between">
                  <span>
                    🌿 Mencegah <strong>~{liveEditWasteRating.carbonOffsetKg} kg CO₂e</strong> emisi & menghasilkan <strong>~{liveEditWasteRating.compostProducedKg} kg kompos</strong>.
                  </span>
                  <span className="font-bold text-[10px] text-teal-800">Transparansi QR ✓</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingWasteLot(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simpan Perubahan Limbah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Processor Green Bean Barcode & Traceability Modal */}
      <ProcessorBarcodeModal
        isOpen={barcodeModalOpen}
        onClose={() => setBarcodeModalOpen(false)}
        lot={selectedLotForBarcode}
        isNewProcess={isNewProcess}
      />
    </div>
  );
};
