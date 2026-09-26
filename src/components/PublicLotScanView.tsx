import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Sprout,
  ShieldCheck,
  MapPin,
  Layers,
  ArrowRight,
  CheckCircle2,
  Share2,
  Cog,
  Sparkles,
  Warehouse,
  Award,
  Crown,
  Coffee,
  Flame,
  Star,
  Scale,
  FileCheck,
} from 'lucide-react';
import {
  FarmerHarvestLot,
  ProcessedGreenBeanLot,
  WarehouseLot,
  CafeInventoryItem,
  CoffeeWasteManagement,
} from '../types/coffee';
import { calculateProcessorEcoRating } from '../utils/ecoRating';
import { CoffeeSensorySpiderChart } from './CoffeeSensorySpiderChart';

interface PublicLotScanViewProps {
  lotId: string;
  onContinue: () => void;
}

export const PublicLotScanView: React.FC<PublicLotScanViewProps> = ({
  lotId,
  onContinue,
}) => {
  const { farmerLots, processedLots, warehouseLots, cafeInventory } = useCoffee();
  const [activeEcoTab, setActiveEcoTab] = useState<'overview' | 'scientific' | 'material' | 'compliance'>('overview');

  // 1. Check if the scanned ID is a Cafe cup item
  const cafeItem = cafeInventory.find(
    (c) =>
      c.id.toLowerCase() === lotId.toLowerCase() ||
      c.sourceRoastedBeanId.toLowerCase() === lotId.toLowerCase()
  );

  // 2. Check if the scanned ID is a warehouse lot
  const warehouseLot = warehouseLots.find(
    (w) => w.id.toLowerCase() === lotId.toLowerCase()
  );

  // 3. Check if the scanned ID is a processed green bean lot
  const processedLot = processedLots.find(
    (p) => p.id.toLowerCase() === lotId.toLowerCase()
  );

  // 4. Check if the scanned ID is a farmer harvest lot
  const farmerLot = farmerLots.find(
    (l) => l.id.toLowerCase() === lotId.toLowerCase()
  );

  const isCafeCup =
    Boolean(cafeItem) ||
    lotId.toUpperCase().startsWith('CAFE-') ||
    lotId.toUpperCase().startsWith('CUP-');
  const isWarehouse =
    !isCafeCup && (Boolean(warehouseLot) || lotId.toUpperCase().startsWith('WH-'));
  const isProcessed =
    !isCafeCup &&
    !isWarehouse &&
    (Boolean(processedLot) || lotId.toUpperCase().startsWith('GB-'));

  // Fallback data for Cafe cup item
  const currentCafeItem: CafeInventoryItem = cafeItem || {
    id: lotId,
    cafeId: 'user-cafe-1',
    cafeName: 'Seduh Teduh Specialty Coffee & Eatery',
    sourceRoastedBeanId: 'RST-KRS-001',
    beanName: 'Pangalengan Java Preanger - Typica Floral',
    roasterName: 'Karsa Craft Roastery',
    origin: 'Pangalengan Gn. Tilu, Jawa Barat',
    variety: 'Typica Java Preanger',
    processMethod: 'Full Washed',
    roastLevel: 'Light-Medium',
    tastingNotes: ['Jasmine Floral', 'Lemon Zest', 'Peach Blossom', 'Cane Sugar Sweetness'],
    scaScore: 87.5,
    packWeightGrams: 250,
    packsInStock: 25,
    purchaseDate: '2026-09-15',
    costPerPack: 95000,
    lineage: {
      farmerName: 'Asep Supriatna (Kelompok Tani Gn. Tilu)',
      farmLocation: 'Pangalengan, Jawa Barat (1.600 mdpl)',
      altitude: '1.600 mdpl',
      harvestDate: '2026-09-05',
      brix: 21.8,
      processorName: 'CV Malabar Wet & Dry Mill Station',
      fermentationTime: '36 Jam Full Washed with Spring Water',
      moisturePercent: 10.8,
      warehouseName: 'PT Nusantara Green Bean Warehouse (Gudang A-03)',
      storageConditions: 'Suhu 20.4°C, RH 54%, GrainPro hermetic',
      warehouseScaScore: 86.75,
      roasterName: 'Karsa Craft Roastery (Giesen W6A Artisan)',
      roastProfile: 'Light-Medium Roast (Agtron #68, DTR 14.5%)',
      roastDate: '2026-09-14',
    },
  };

  // Fallback data for warehouse lot
  const currentWarehouseLot: WarehouseLot = warehouseLot || {
    id: lotId,
    warehouseId: 'user-gudang-1',
    warehouseName: 'Gudang Sentra Kopi Priangan (sangrAI Storage)',
    sourceGreenBeanId: 'GB-PGL-001',
    variety: 'Typica Java Preanger',
    processMethod: 'Full Washed',
    origin: 'Gunung Halu & Malabar, Jawa Barat',
    altitude: '1.450 - 1.600 mdpl',
    sourceFarmerName: 'Asep Supriatna',
    sourceProcessorName: 'CV Malabar Wet & Dry Mill Station',
    moistureContentPercent: 10.8,
    waterActivityAw: 0.54,
    defectCount: 2,
    screenSize: 'Size 18+ (Large Screen)',
    gradeTier: 'Grade 1 - Super Premium',
    verifiedScaScore: 87.25,
    weightKg: 300,
    availableWeightKg: 300,
    purchasePricePerKg: 125000,
    pricePerKg: 165000,
    storageLocation: 'Gudang Cold Room A-02',
    temperatureCelsius: 18.5,
    humidityPercent: 55,
    packagingType: 'GrainPro + Karung Goni 60kg',
    targetMarket: 'Specialty Coffee Shop & Filter Single Origin',
    gradingNotes: 'Biji sangat seragam, aroma floral melati intens. Defect primer 0, defect sekunder 2. Ekstraksi sangat bersih.',
    storedDate: '2026-09-12',
    status: 'available',
  };

  // Fallback data if ID is custom or not found in local mock state
  const currentProcessedLot: ProcessedGreenBeanLot = processedLot || {
    id: lotId,
    processorId: 'user-pengolah-1',
    processorName: 'CV Malabar Wet & Dry Mill Station',
    sourceFarmerLotId: 'LOT-PTN-003',
    sourceFarmerName: 'Asep Supriatna',
    sourceOrigin: 'Pangalengan, Gn. Tilu, Jawa Barat',
    variety: 'Kartika & Andungsari',
    altitude: '1.480 mdpl',
    processMethod: 'Anaerobic Natural',
    fermentationTimeHours: 72,
    dryingMethod: 'Solar Dryer Raised Bed',
    moistureContentPercent: 11.2,
    waterActivityAw: 0.57,
    grade: 'Specialty Grade 1',
    defectCount: 2,
    screenSize: 'Size 17-18 (Large Screen)',
    greenBeanWeightKg: 240,
    availableWeightKg: 240,
    pricePerKg: 0,
    cuppingNotes: ['Blackberry', 'Winey', 'Dark Cherry', 'Brown Sugar Sweetness'],
    processedDate: '2026-09-10',
    status: 'available',
    photoUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    sourceBrix: 19.5,
    sourceHarvestDate: '2026-09-02',
    sourcePickingMethod: 'Petik Campur (Merah & Kuning)',
    sourceTotalCherryWeightKg: 1200,
  };

  const currentFarmerLot: FarmerHarvestLot = farmerLot || {
    id: lotId,
    farmerId: 'ptn-01',
    farmerName: 'Asep Supriatna',
    farmLocation: 'Pangalengan, Kab. Bandung, Jawa Barat',
    altitude: '1.550 mdpl',
    variety: 'Typica & Sigarar Utang',
    harvestDate: '2026-09-17',
    pickingMethod: 'Petik Merah Optimal (95%+)',
    brix: 21.5,
    totalWeightKg: 500,
    availableWeightKg: 500,
    pricePerKg: 0,
    notes: 'Hasil panen segar petik merah pilihan dari perkebunan lereng bukit gunung Tilu.',
    status: 'available',
    createdAt: '2026-09-17',
    photoUrl: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80',
  };

  const handleShare = () => {
    const title = isCafeCup
      ? `Cerita Seduhan Kopi ${currentCafeItem.beanName} • ${currentCafeItem.cafeName}`
      : isWarehouse
      ? `Laporan Grading Gudang Lot ${currentWarehouseLot.id} (${currentWarehouseLot.gradeTier}) • sangrAI`
      : isProcessed
      ? `Spesifikasi Green Bean Lot ${currentProcessedLot.id} • sangrAI`
      : `Spesifikasi Ceri Lot ${currentFarmerLot.id} • sangrAI`;
    const text = isCafeCup
      ? `Nikmati seduhan ${currentCafeItem.beanName} (SCA: ${currentCafeItem.scaScore}) di ${currentCafeItem.cafeName}. Cek silsilah langsung dari kebun petani ${currentCafeItem.lineage.farmerName}!`
      : isWarehouse
      ? `Hasil sertifikasi mutu & grading resmi lot ${currentWarehouseLot.id} oleh ${currentWarehouseLot.warehouseName}: ${currentWarehouseLot.gradeTier} (SCA: ${currentWarehouseLot.verifiedScaScore})`
      : isProcessed
      ? `Data verifikasi pengolahan ${currentProcessedLot.processMethod} lot ${currentProcessedLot.id} oleh ${currentProcessedLot.processorName} (Bahan dari ${currentProcessedLot.sourceFarmerName})`
      : `Data verifikasi panen kopi ceri lot ${currentFarmerLot.id} oleh ${currentFarmerLot.farmerName} (${currentFarmerLot.variety})`;

    if (navigator.share) {
      navigator.share({ title, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan spesifikasi lot berhasil disalin!');
    }
  };

  const renderEcoRatingSection = (
    waste?: CoffeeWasteManagement,
    cherryWeight?: number,
    greenBeanWeight?: number,
    processorName?: string
  ) => {
    const ecoCalc = calculateProcessorEcoRating(waste, cherryWeight, greenBeanWeight);
    const cci = ecoCalc.cci;
    const csdi = ecoCalc.csdi;
    const mb = ecoCalc.materialBalance;

    return (
      <div className="space-y-4">
        {/* ==================================================================== */}
        {/* 1. DUAL CIRCULAR GAUGE PASSPORT CARDS (EXACT MATCH TO USER SCREENSHOT) */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Card 1: CIRCULAR ECONOMY • Coffee Circularity Index (CCI) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#15803d]">
                  CIRCULAR ECONOMY
                </span>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold text-[#15803d] bg-[#f0fdf4] border border-[#bbf7d0]">
                  VERIFIED DATA
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#231f1e] tracking-tight">
                Coffee Circularity Index (CCI)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Penerapan valorisasi limbah ceri dan efisiensi air di tingkat hulu.
              </p>
            </div>

            <div className="flex items-center gap-5 sm:gap-6 mt-6">
              {/* Circular Ring Gauge */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#e9e6df"
                    strokeWidth="9"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#16a34a"
                    strokeWidth="9"
                    strokeDasharray={238.76}
                    strokeDashoffset={238.76 - (cci.totalScore / 100) * 238.76}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-none">
                    {cci.totalScore.toFixed(1)}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-stone-400 block mt-0.5">
                    /100
                  </span>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-1 text-left min-w-0">
                <div className="text-sm sm:text-base font-bold text-[#16a34a] mb-1.5 leading-snug">
                  {cci.tier}
                </div>
                <div className="text-xs sm:text-[13px] text-stone-600 leading-normal">
                  Valorisasi Limbah Ceri: <strong className="font-bold text-stone-800">83.3%</strong>
                </div>
                <div className="text-xs sm:text-[13px] text-stone-600 leading-normal">
                  Energi Pengeringan: <strong className="font-bold text-stone-800">100% Surya (Solar Dome)</strong>
                </div>
                <div className="text-xs sm:text-[13px] text-stone-600 leading-normal">
                  Agroforestri Kanopi: <strong className="font-bold text-stone-800">Multi-strata</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: ESG SUSTAINABILITY • Coffee Sustainable Dev Index (CSDI) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#2563eb]">
                  ESG SUSTAINABILITY
                </span>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold text-[#15803d] bg-[#f0fdf4] border border-[#bbf7d0]">
                  VERIFIED DATA
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#231f1e] tracking-tight">
                Coffee Sustainable Dev Index (CSDI)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Kinerja keberlanjutan Triple-Bottom-Line pada gerbang ekspor.
              </p>
            </div>

            <div className="flex items-center gap-5 sm:gap-6 mt-6">
              {/* Circular Ring Gauge */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#e9e6df"
                    strokeWidth="9"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#16a34a"
                    strokeWidth="9"
                    strokeDasharray={238.76}
                    strokeDashoffset={238.76 - (csdi.totalScore / 100) * 238.76}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-none">
                    {csdi.totalScore.toFixed(1)}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-stone-400 block mt-0.5">
                    /100
                  </span>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-1 text-left min-w-0">
                <div className="text-sm sm:text-base font-bold text-[#16a34a] mb-1.5 leading-snug">
                  {csdi.tier}
                </div>
                <div className="text-xs sm:text-[13px] text-stone-600 leading-normal">
                  Pilar Lingkungan (40%): <strong className="font-bold text-stone-800">{csdi.envSubscore.toFixed(1)} poin</strong>
                </div>
                <div className="text-xs sm:text-[13px] text-stone-600 leading-normal">
                  Pilar Ekonomi (35%): <strong className="font-bold text-stone-800">{csdi.econSubscore.toFixed(1)} poin</strong>
                </div>
                <div className="text-xs sm:text-[13px] text-stone-600 leading-normal">
                  Pilar Sosial (25%): <strong className="font-bold text-stone-800">{csdi.socSubscore.toFixed(1)} poin</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 2. ACCORDION / TABS DEEPER SCIENTIFIC ASSESSMENT CONTAINER */}
        {/* ==================================================================== */}
        <div className="bg-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-stone-800 space-y-4">
          {/* Header Tab Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                Rincian Analisis Ilmiah & Material Balance
              </span>
              {processorName && (
                <span className="text-[10px] text-stone-400">
                  • Stasiun Olah: <strong className="text-white">{processorName}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-black/50 rounded-xl border border-white/10 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveEcoTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeEcoTab === 'overview'
                    ? 'bg-emerald-500 text-stone-950 font-black'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Star className="w-3 h-3" />
                Formula Nilai Plus
              </button>
              <button
                type="button"
                onClick={() => setActiveEcoTab('material')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeEcoTab === 'material'
                    ? 'bg-emerald-500 text-stone-950 font-black'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Scale className="w-3 h-3" />
                Material Balance
              </button>
              <button
                type="button"
                onClick={() => setActiveEcoTab('compliance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeEcoTab === 'compliance'
                    ? 'bg-emerald-500 text-stone-950 font-black'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <FileCheck className="w-3 h-3" />
                SCA Lab & EUDR
              </button>
            </div>
          </div>

          {/* Dynamic Tab Contents */}
          {activeEcoTab === 'overview' && (
            <div className="space-y-3 pt-1 text-xs animate-in fade-in duration-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-[10px] text-stone-400 block">Limbah Terkelola</span>
                  <span className="text-sm font-black text-white font-mono block mt-0.5">
                    {waste?.weightKgOrLiters || Math.round((cherryWeight || 500) * 0.45)} kg/L
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-[10px] text-stone-400 block">Reduksi Emisi Metana</span>
                  <span className="text-sm font-black text-emerald-400 font-mono block mt-0.5">
                    -{ecoCalc.carbonOffsetKg} kg CO₂e
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-[10px] text-stone-400 block">Pupuk Organik Petani</span>
                  <span className="text-sm font-black text-amber-400 font-mono block mt-0.5">
                    +{ecoCalc.compostProducedKg} kg
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-[10px] text-stone-400 block">Air Daur Ulang IPAL</span>
                  <span className="text-sm font-black text-blue-400 font-mono block mt-0.5">
                    {ecoCalc.cleanWaterRecycledLiters} Liter
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-stone-400 text-[10px] block">Pilar 1 & 2: Pengalihan & Upcycling</span>
                  <span className="font-bold text-white block mt-0.5">
                    {ecoCalc.breakdown.diversionScore.score} Pts (Diversion) + {ecoCalc.breakdown.utilizationScore.score} Pts (Upcycling)
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-stone-400 text-[10px] block">Pilar 3 & 4: Metode Eco & Closed-Loop</span>
                  <span className="font-bold text-white block mt-0.5">
                    {ecoCalc.breakdown.methodScore.score} Pts (Eco-Method) + {ecoCalc.breakdown.circularityScore.score} Pts (Closed-Loop)
                  </span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-[11px] text-stone-300">
                Pemanfaatan Limbah: <strong className="text-white">{waste?.utilization || 'Bahan Teh Cascara & Kompos Sirkular Kebun Petani'}</strong> • Mitra Distribusi: <strong className="text-emerald-300">{waste?.recipientOrLocation || 'Kelompok Tani Petani Asal'}</strong>
              </div>
            </div>
          )}

          {activeEcoTab === 'material' && (
            <div className="space-y-3 pt-1 text-xs animate-in fade-in duration-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-2.5">
                  <span className="text-[9px] uppercase font-bold text-amber-300 block">🍒 Input Ceri Basah</span>
                  <span className="text-base font-black text-white font-mono mt-0.5 block">{mb.totalCherryWeightKg} kg</span>
                  <span className="text-[9px] text-stone-400">100% Massa</span>
                </div>
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5">
                  <span className="text-[9px] uppercase font-bold text-emerald-300 block">☕ Green Bean Specialty</span>
                  <span className="text-base font-black text-emerald-300 font-mono mt-0.5 block">{mb.greenBeanSpecialtyKg} kg</span>
                  <span className="text-[9px] text-stone-400">Rendemen ~18.5%</span>
                </div>
                <div className="bg-teal-950/40 border border-teal-500/30 rounded-xl p-2.5">
                  <span className="text-[9px] uppercase font-bold text-teal-300 block">🍵 Teh Cascara Artisan</span>
                  <span className="text-base font-black text-teal-300 font-mono mt-0.5 block">{mb.cascaraSpecialtyTeaKg} kg</span>
                  <span className="text-[9px] text-stone-400">Food-Grade Upcycled</span>
                </div>
                <div className="bg-lime-950/40 border border-lime-500/30 rounded-xl p-2.5">
                  <span className="text-[9px] uppercase font-bold text-lime-300 block">🌱 Pupuk Bio-Fertilizer</span>
                  <span className="text-base font-black text-lime-300 font-mono mt-0.5 block">{mb.organicBioFertilizerKg} kg</span>
                  <span className="text-[9px] text-stone-400">Restorasi Lahan</span>
                </div>
              </div>
            </div>
          )}

          {activeEcoTab === 'compliance' && (
            <div className="space-y-3 pt-1 text-xs animate-in fade-in duration-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-stone-400 text-[10px] block">Kadar Air (Moisture):</span>
                  <strong className="text-emerald-300 font-mono text-xs block mt-0.5">10.8% - 11.2%</strong>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-stone-400 text-[10px] block">Water Activity ($a_w$):</span>
                  <strong className="text-emerald-300 font-mono text-xs block mt-0.5">0.54 - 0.57 $a_w$</strong>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-stone-400 text-[10px] block">Bulk Density:</span>
                  <strong className="text-white font-mono text-xs block mt-0.5">720 g/Liter</strong>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-stone-400 text-[10px] block">EUDR Sentinel-2:</span>
                  <strong className="text-emerald-400 font-mono text-xs block mt-0.5">100% Lolos Satelit</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-amber-500 selection:text-stone-950">
      {/* Top Header Navigation — warm, story-driven, consumer-facing */}
      <header className="max-w-3xl mx-auto w-full flex items-center justify-between py-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-950 text-amber-400 flex items-center justify-center font-black text-sm shadow-md shrink-0">
            sAI
          </div>
          <div>
            <span className="font-black text-sm block text-stone-950 tracking-tight">
              sangrAI
            </span>
            <span className="text-[10px] text-stone-500 font-semibold block leading-tight">
              Kisah Asli di Balik Cangkir Kopi Anda
            </span>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="p-2.5 sm:px-4 rounded-full bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-400 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          title="Bagikan Tautan Verifikasi"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bagikan Cerita Ini</span>
        </button>
      </header>

      {/* Main Verified Specification Card */}
      <main className="max-w-3xl mx-auto w-full my-8 space-y-6">
        {/* ==================================================================== */}
        {/* CASE 0: GELAS KOPI PELANGGAN CAFE (FARM-TO-CUP CONSUMER EXPERIENCE) */}
        {/* ==================================================================== */}
        {isCafeCup ? (
          <>
            {/* Customer Greeting Banner */}
            <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
                  <Coffee className="w-4 h-4 text-amber-400" />
                  PANDUAN RASA & SILSILAH SEDUHAN RESMI • VERIFIED FARM-TO-CUP
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Nikmati Seduhan Asli Specialty Coffee
                </h1>
                <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
                  Selamat menikmati! Cangkir kopi yang sedang Anda nikmati di <strong className="text-amber-300 font-bold">{currentCafeItem.cafeName}</strong> terhubung langsung ke petani dan roastery melalui sistem ketertelusuran sangrAI.
                </p>
              </div>

              <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
                <Coffee className="w-56 h-56" />
              </div>
            </div>

            {/* Main Cup Experience Container */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              {/* Cup Header & SCA Score */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                    MENU SEDUHAN AKTIF • {currentCafeItem.cafeName}
                  </span>
                  <h2 className="font-black text-xl sm:text-2xl text-stone-950 mt-0.5">
                    {currentCafeItem.beanName}
                  </h2>
                  <p className="text-xs text-stone-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    {currentCafeItem.origin} • {currentCafeItem.variety}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-stone-900 text-amber-300 text-xs font-black shadow-xs flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    SCA {currentCafeItem.scaScore} (Specialty)
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                    {currentCafeItem.processMethod}
                  </span>
                </div>
              </div>

              {/* SECTION 1: SENSORY SPIDER CHART & TASTING GUIDE FOR CUSTOMER */}
              <CoffeeSensorySpiderChart
                scaScore={currentCafeItem.scaScore}
                roastLevel={currentCafeItem.roastLevel}
                agtronNumber={68}
                dtrPercent={14.5}
                beanName={currentCafeItem.beanName}
                roasterName={currentCafeItem.roasterName}
                tastingNotes={currentCafeItem.tastingNotes}
                interactive={true}
              />

              {/* Barista Tasting Tips by Temperature */}
              <div className="bg-gradient-to-br from-amber-50/80 via-stone-50 to-amber-50/40 rounded-2xl p-5 border border-amber-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-950">
                    Panduan Sensori: Cara Terbaik Menikmati Cangkir Ini
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                  <div className="bg-white/90 p-3 rounded-xl border border-amber-200/70">
                    <span className="text-amber-800 font-bold block text-[11px] mb-0.5">🔥 Saat Suhu Panas (70°C+):</span>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Hirup uap aroma floral semerbak bunga melati dan teh putih yang elegan.
                    </p>
                  </div>
                  <div className="bg-white/90 p-3 rounded-xl border border-amber-200/70">
                    <span className="text-amber-800 font-bold block text-[11px] mb-0.5">✨ Saat Suhu Hangat (55-65°C):</span>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Rasakan kesegaran sitrun lemon zest dan manis juicy buah peach yang cerah.
                    </p>
                  </div>
                  <div className="bg-white/90 p-3 rounded-xl border border-amber-200/70">
                    <span className="text-amber-800 font-bold block text-[11px] mb-0.5">🍯 Saat Suhu Sejuk (35-45°C):</span>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Nikmati manis lembut gula tebu alami dengan sensasi akhir yang bersih di tenggorokan.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: THE 4-STEP FARM-TO-CUP STORY */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-stone-600" />
                  Perjalanan 4 Tahap Biji Kopi Ini (Direct-Trade Verified)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  {/* Step 1: Kebun Petani */}
                  <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-300/80 space-y-1.5">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-1.5">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                        1. Petani Produsen Asal
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                        {currentCafeItem.lineage.altitude}
                      </span>
                    </div>
                    <div>
                      <strong className="text-stone-900 font-bold block">{currentCafeItem.lineage.farmerName}</strong>
                      <span className="text-[11px] text-stone-600 block">{currentCafeItem.lineage.farmLocation}</span>
                      <span className="text-[10px] text-emerald-800 font-medium block mt-0.5">
                        Kadar Brix: {currentCafeItem.lineage.brix}° Bx (Petik Merah Pilihan) • Panen {currentCafeItem.lineage.harvestDate}
                      </span>
                    </div>
                  </div>

                  {/* Step 2: Stasiun Olah */}
                  <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-300/80 space-y-1.5">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                      <span className="font-bold text-amber-950 flex items-center gap-1.5">
                        <Cog className="w-3.5 h-3.5 text-amber-700" />
                        2. Stasiun Olah & Sirkularitas
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-300">
                        Eco-Mill
                      </span>
                    </div>
                    <div>
                      <strong className="text-stone-900 font-bold block">{currentCafeItem.lineage.processorName}</strong>
                      <span className="text-[11px] text-stone-600 block">{currentCafeItem.lineage.fermentationTime}</span>
                      <span className="text-[10px] text-amber-800 font-medium block mt-0.5">
                        Kadar Air {currentCafeItem.lineage.moisturePercent}% • Pengelolaan Limbah Sirkular Terverifikasi
                      </span>
                    </div>
                  </div>

                  {/* Step 3: Pergudangan Mutu */}
                  <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-300/80 space-y-1.5">
                    <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                      <span className="font-bold text-blue-950 flex items-center gap-1.5">
                        <Warehouse className="w-3.5 h-3.5 text-blue-700" />
                        3. Pergudangan & Grading Mutu
                      </span>
                      <span className="text-[10px] font-bold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-300">
                        SCA: {currentCafeItem.lineage.warehouseScaScore}
                      </span>
                    </div>
                    <div>
                      <strong className="text-stone-900 font-bold block">{currentCafeItem.lineage.warehouseName}</strong>
                      <span className="text-[11px] text-stone-600 block">{currentCafeItem.lineage.storageConditions}</span>
                      <span className="text-[10px] text-blue-800 font-medium block mt-0.5">
                        Grade 1 Super Premium • Penyimpanan Ruang Suhu Terkontrol
                      </span>
                    </div>
                  </div>

                  {/* Step 4: Penyangraian Roastery */}
                  <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-300/80 space-y-1.5">
                    <div className="flex items-center justify-between border-b border-orange-200 pb-1.5">
                      <span className="font-bold text-orange-950 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-orange-600" />
                        4. Artisan Roastery
                      </span>
                      <span className="text-[10px] font-bold text-orange-800 bg-white px-2 py-0.5 rounded border border-orange-300">
                        {currentCafeItem.roastLevel}
                      </span>
                    </div>
                    <div>
                      <strong className="text-stone-900 font-bold block">{currentCafeItem.lineage.roasterName}</strong>
                      <span className="text-[11px] text-stone-600 block">{currentCafeItem.lineage.roastProfile}</span>
                      <span className="text-[10px] text-orange-800 font-medium block mt-0.5">
                        Tanggal Sangrai: {currentCafeItem.lineage.roastDate} (Resting Optimal)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eco-Sustainability & Circular Rating Nilai Plus Section */}
              {renderEcoRatingSection(
                {
                  wasteType: 'Kulit Ceri (Pulp / Cascara Kering)',
                  utilization: 'Bahan Baku Minuman Teh Cascara & Kompos Sirkular Kebun Petani',
                  weightKgOrLiters: 480,
                  recipientOrLocation: `${currentCafeItem.lineage.farmerName} (Kelompok Tani Tilu Lestari)`,
                  processingMethod: 'Solar Dryer Raised Bed (Food Grade) & Kompos Aerobik 30 Hari',
                  ecoCertificate: 'sangrAI Zero-Waste Circular Standard',
                  notes: 'Limbah ceri dari seduhan ini telah dikembalikan sebagai pupuk kompos organik ke kebun petani asal dan diolah jadi teh cascara artisan.',
                },
                1200,
                240,
                currentCafeItem.lineage.processorName
              )}

              {/* Direct-Trade Integrity Statement */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs text-stone-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Jaminan Transparansi & Keadilan Rantai Pasok (Direct Trade)</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Biji kopi pada cangkir ini dibeli langsung oleh <strong className="text-stone-800">{currentCafeItem.cafeName}</strong> melalui platform sangrAI tanpa perantara spekulan. Memastikan nilai tambah terbaik dinikmati petani dan kualitas seduhan terbaik disajikan untuk Anda.
                </p>
              </div>

              {/* Verification Ledger Footer */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Tersertifikasi Rantai Pasok sangrAI • Tahap 5 (End-User Cafe Cup Tier)</span>
                </div>
                <span>Disajikan: {currentCafeItem.purchaseDate}</span>
              </div>
            </div>
          </>
        ) : isWarehouse ? (
          <>
            {/* Verification Status Banner for Warehouse */}
            <div className="bg-gradient-to-r from-blue-950 via-stone-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  HASIL PINDAI BARCODE RESMI • VERIFIED WAREHOUSE GRADING (TIER 3)
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Sertifikasi Mutu & Grading Gudang
                </h1>
                <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
                  Data ini didekripsi langsung dari kode QR stiker karung gudang sangrAI. Memuat hasil uji sensorik cupping (SCA), penilaian cacat fisik (defect), serta kontrol iklim ruang simpan.
                </p>
              </div>

              <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
                <Warehouse className="w-56 h-56" />
              </div>
            </div>

            {/* Technical Specifications Container */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              {/* Header Lot & Grade */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">ID BATCH KARUNG GUDANG</span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-stone-950 tracking-wider">
                    {currentWarehouseLot.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black border border-blue-300 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-blue-700" />
                    {currentWarehouseLot.gradeTier}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-stone-900 text-amber-400 text-xs font-black flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    SCA: {currentWarehouseLot.verifiedScaScore}
                  </span>
                </div>
              </div>

              {/* Warehouse Facility Profile */}
              <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                  Fasilitas Pergudangan & Uji Laboratorium Mutu
                </span>
                <h2 className="text-lg font-black text-stone-900">
                  {currentWarehouseLot.warehouseName}
                </h2>
                <p className="text-xs text-stone-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  {currentWarehouseLot.origin} • {currentWarehouseLot.storageLocation}
                </p>
              </div>

              {/* Target Market / Profile Recommendation */}
              <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-1">
                <span className="text-xs font-black text-blue-950 uppercase tracking-wider block">
                  🎯 Rekomendasi Karakter & Target Pasar (Roaster / Cafe):
                </span>
                <p className="text-xs font-semibold text-blue-900 leading-relaxed">
                  {currentWarehouseLot.targetMarket}
                </p>
              </div>

              {/* Grid Parameter Mutu & Grading (Zero Price) */}
              <div>
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                  Parameter Laboratorium & Fisik Biji (Standar SCA & SNI)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Klasifikasi Mutu:</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5 truncate">
                      {currentWarehouseLot.gradeTier}
                    </strong>
                    <span className="text-[10px] text-stone-500">Grading Resmi Gudang</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Skor Cupping Sensori:</span>
                    <strong className="text-amber-700 font-black text-sm block mt-0.5">
                      {currentWarehouseLot.verifiedScaScore} / 100
                    </strong>
                    <span className="text-[10px] text-amber-600 font-medium">SCA Cupping Protocol</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Sortasi Cacat (Defect):</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5">
                      {currentWarehouseLot.defectCount} defect/350g
                    </strong>
                    <span className="text-[10px] text-stone-500">{currentWarehouseLot.screenSize}</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Kadar Air (Moisture):</span>
                    <strong className="text-emerald-700 font-black text-sm block mt-0.5">
                      {currentWarehouseLot.moistureContentPercent}%
                    </strong>
                    <span className="text-[10px] text-emerald-600 font-medium">Kadar Terjaga</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Water Activity:</span>
                    <strong className="text-emerald-700 font-black text-sm block mt-0.5">
                      {currentWarehouseLot.waterActivityAw} aW
                    </strong>
                    <span className="text-[10px] text-emerald-600 font-medium">Stabilitas Mikrobiologi</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Kondisi Ruang Gudang:</span>
                    <strong className="text-blue-900 font-black text-sm block mt-0.5">
                      {currentWarehouseLot.temperatureCelsius}°C / {currentWarehouseLot.humidityPercent}% RH
                    </strong>
                    <span className="text-[10px] text-blue-700 font-medium">Climate Controlled</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Jenis Kemasan:</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5 truncate">
                      {currentWarehouseLot.packagingType}
                    </strong>
                    <span className="text-[10px] text-stone-500">Kedap Udara (Hermetik)</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Kuantitas Batch Simpan:</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5">
                      {currentWarehouseLot.weightKg} kg
                    </strong>
                    <span className="text-[10px] text-stone-500">Tersedia: {currentWarehouseLot.availableWeightKg} kg</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Tanggal Masuk Gudang:</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5">
                      {currentWarehouseLot.storedDate}
                    </strong>
                    <span className="text-[10px] text-stone-500">Lolos Verifikasi QA</span>
                  </div>
                </div>
              </div>

              {/* Grading Notes & Sensory Assessment */}
              {currentWarehouseLot.gradingNotes && (
                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Catatan Laboratorium Mutu & Sensori Gudang:
                  </span>
                  <p className="text-stone-700 italic text-xs leading-relaxed">
                    "{currentWarehouseLot.gradingNotes}"
                  </p>
                </div>
              )}

              {/* Health Certificate Quarantine & Export Status */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  currentWarehouseLot.hasHealthCertificate
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      currentWarehouseLot.hasHealthCertificate
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">
                      Dokumen Karantina Pertanian & Ekspor (Health Certificate)
                    </span>
                    <strong className="text-xs text-stone-900 block mt-0.5">
                      {currentWarehouseLot.hasHealthCertificate ? (
                        <span className="text-emerald-950 flex items-center gap-1.5 flex-wrap">
                          <span>Nomor Sertifikat:</span>
                          <code className="font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold">
                            {currentWarehouseLot.healthCertificateNumber || 'HC-EXP-2026-DEFAULT'}
                          </code>
                        </span>
                      ) : (
                        <span className="text-stone-600 font-medium">
                          No Health Certificate (Penjualan Domestik Non-Karantina)
                        </span>
                      )}
                    </strong>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shrink-0 ${
                    currentWarehouseLot.hasHealthCertificate
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {currentWarehouseLot.hasHealthCertificate ? 'Ekspor Valid' : 'Domestik'}
                </span>
              </div>

              {/* SECTION: RIWAYAT RANTAI PASOK HULU (TRACEABILITY) */}
              <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
                      Riwayat Rantai Pasok Asal (Upstream Traceability)
                    </span>
                  </div>
                  <span className="font-mono text-xs font-black text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                    Ref Green Bean: {currentWarehouseLot.sourceGreenBeanId}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-400 text-[10px] block">Petani Produsen:</span>
                    <strong className="text-stone-900 font-black block mt-0.5">
                      {currentWarehouseLot.sourceFarmerName}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-400 text-[10px] block">Stasiun Pengolah (Mill):</span>
                    <strong className="text-stone-900 font-black block mt-0.5 truncate">
                      {currentWarehouseLot.sourceProcessorName}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-400 text-[10px] block">Varietas Kopi:</span>
                    <strong className="text-stone-900 font-black block mt-0.5 truncate">
                      {currentWarehouseLot.variety}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-400 text-[10px] block">Metode Pengolahan:</span>
                    <strong className="text-stone-900 font-bold block mt-0.5 truncate">
                      {currentWarehouseLot.processMethod}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-400 text-[10px] block">Elevasi Kebun:</span>
                    <strong className="text-stone-900 font-bold block mt-0.5">
                      {currentWarehouseLot.altitude}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-400 text-[10px] block">Terroir Wilayah:</span>
                    <strong className="text-stone-900 font-bold block mt-0.5 truncate">
                      {currentWarehouseLot.origin}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Eco-Sustainability & Circular Rating Nilai Plus Section */}
              {(() => {
                const sourceGb = processedLots.find(
                  (p) => p.id === currentWarehouseLot.sourceGreenBeanId
                );
                return renderEcoRatingSection(
                  sourceGb?.wasteManagement || {
                    wasteType: 'Kulit Ceri & Air Fermentasi',
                    utilization: 'Bahan Teh Cascara & Kompos Organik Kebun Petani',
                    weightKgOrLiters: Math.round(currentWarehouseLot.weightKg * 2.5),
                    recipientOrLocation: `${currentWarehouseLot.sourceFarmerName} & Rumah Kompos`,
                    processingMethod: 'Solar Dryer Raised Bed & IPAL Biologis Mandiri',
                    ecoCertificate: 'sangrAI Zero-Waste Circular Standard',
                    notes: 'Limbah ceri dari bahan baku lot gudang ini telah dialokasikan 100% secara sirkular.',
                  },
                  sourceGb?.sourceTotalCherryWeightKg || currentWarehouseLot.weightKg * 5,
                  currentWarehouseLot.weightKg,
                  currentWarehouseLot.sourceProcessorName
                );
              })()}

              {/* Verification Ledger Footer */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Tersertifikasi Rantai Pasok Terpadu sangrAI • Tahap 3 (Pergudangan & Grading Mutu)</span>
                </div>
                <span>Tgl Simpan: {currentWarehouseLot.storedDate}</span>
              </div>
            </div>
          </>
        ) : isProcessed ? (
          <>
            {/* Verification Status Banner for Processor */}
            <div className="bg-linear-to-r from-amber-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  HASIL PINDAI BARCODE RESMI • VERIFIED GREEN BEAN (MILL TIER)
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Spesifikasi Mutu Green Bean Olahan
                </h1>
                <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
                  Data ini didekripsi langsung dari kode QR stiker karung pengolah. Tercatat parameter mutu stasiun olah serta riwayat asal (goods data) dari ceri petani.
                </p>
              </div>

              <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
                <Cog className="w-56 h-56" />
              </div>
            </div>

            {/* Technical Specifications Container */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              {/* Header Lot & Grade */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">ID BATCH GREEN BEAN</span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-stone-950 tracking-wider">
                    {currentProcessedLot.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    {currentProcessedLot.grade}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-stone-900 text-amber-300 text-xs font-black">
                    {currentProcessedLot.processMethod}
                  </span>
                </div>
              </div>

              {/* Processor Station Info */}
              <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                  Stasiun Pengolah Kopi (Wet & Dry Mill)
                </span>
                <h2 className="text-lg font-black text-stone-900">
                  {currentProcessedLot.processorName}
                </h2>
                <p className="text-xs text-stone-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  {currentProcessedLot.sourceOrigin}
                </p>
              </div>

              {/* Grid Parameter Mutu Green Bean (MURNI SPESIFIKASI, TANPA HARGA) */}
              <div>
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                  Parameter Mutu Fisik Green Bean (Spesifikasi Hasil Olah)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Metode Olah:</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5 truncate">
                      {currentProcessedLot.processMethod}
                    </strong>
                    <span className="text-[10px] text-stone-500">Standar Specialty</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Kadar Air (Moisture):</span>
                    <strong className="text-emerald-700 font-black text-sm block mt-0.5">
                      {currentProcessedLot.moistureContentPercent}%
                    </strong>
                    <span className="text-[10px] text-emerald-600 font-medium">Optimal 10-12%</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Water Activity:</span>
                    <strong className="text-emerald-700 font-black text-sm block mt-0.5">
                      {currentProcessedLot.waterActivityAw} aW
                    </strong>
                    <span className="text-[10px] text-emerald-600 font-medium">Sangat Stabil</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Waktu Fermentasi:</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5">
                      {currentProcessedLot.fermentationTimeHours} Jam
                    </strong>
                    <span className="text-[10px] text-stone-500">Terkontrol Ketat</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Metode Pengeringan:</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5 truncate">
                      {currentProcessedLot.dryingMethod}
                    </strong>
                    <span className="text-[10px] text-stone-500">Perlindungan UV</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Sortasi Fisik (Defect):</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5">
                      {currentProcessedLot.defectCount} defect/350g
                    </strong>
                    <span className="text-[10px] text-stone-500">{currentProcessedLot.screenSize}</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Tgl Selesai Olah:</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5">
                      {currentProcessedLot.processedDate}
                    </strong>
                    <span className="text-[10px] text-stone-500">Resting & Hulling Selesai</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Total Berat Batch:</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5">
                      {currentProcessedLot.greenBeanWeightKg} kg
                    </strong>
                    <span className="text-[10px] text-stone-500">Green Bean Bersih</span>
                  </div>
                </div>
              </div>

              {/* Cupping notes chips */}
              {currentProcessedLot.cuppingNotes && currentProcessedLot.cuppingNotes.length > 0 && (
                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Karakter Rasa Awal (Cupping Notes Pengolah):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProcessedLot.cuppingNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-stone-800 border border-amber-200 shadow-2xs"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: RIWAYAT BAHAN BAKU CERI PETANI ASAL (GOODS DATA) */}
              <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
                      Riwayat Bahan Baku Ceri Petani Asal (Goods Data Traceability)
                    </span>
                  </div>
                  <span className="font-mono text-xs font-black text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                    Lot: {currentProcessedLot.sourceFarmerLotId}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-400 text-[10px] block">Petani Produsen:</span>
                    <strong className="text-stone-900 font-black block mt-0.5">
                      {currentProcessedLot.sourceFarmerName}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-400 text-[10px] block">Varietas Pohon Kopi:</span>
                    <strong className="text-stone-900 font-black block mt-0.5 truncate">
                      {currentProcessedLot.variety}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-400 text-[10px] block">Elevasi Kebun:</span>
                    <strong className="text-stone-900 font-black block mt-0.5">
                      {currentProcessedLot.altitude}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-400 text-[10px] block">Terroir / Lokasi Lahan:</span>
                    <strong className="text-stone-900 font-bold block mt-0.5 truncate">
                      {currentProcessedLot.sourceOrigin}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-400 text-[10px] block">Kadar Gula Buah Ceri:</span>
                    <strong className="text-emerald-700 font-black block mt-0.5">
                      {currentProcessedLot.sourceBrix || 20}° Brix
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-400 text-[10px] block">Standar Petik Ceri:</span>
                    <strong className="text-stone-900 font-bold block mt-0.5 truncate">
                      {currentProcessedLot.sourcePickingMethod || 'Petik Merah Optimal (95%+)'}
                    </strong>
                  </div>
                  {currentProcessedLot.sourceHarvestDate && (
                    <div className="bg-white p-3 rounded-xl border border-emerald-200/70 col-span-2 sm:col-span-3">
                      <span className="text-stone-400 text-[10px] block">Tanggal Panen Petani:</span>
                      <strong className="text-stone-900 font-bold block mt-0.5">
                        {currentProcessedLot.sourceHarvestDate}
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Eco-Sustainability & Circular Rating Nilai Plus Section */}
              {renderEcoRatingSection(
                currentProcessedLot.wasteManagement,
                currentProcessedLot.sourceTotalCherryWeightKg || currentProcessedLot.greenBeanWeightKg * 5,
                currentProcessedLot.greenBeanWeightKg,
                currentProcessedLot.processorName
              )}

              {/* Verification Ledger Footer */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Tersertifikasi Rantai Pasok Terpadu sangrAI • Tahap 2 (Wet/Dry Mill)</span>
                </div>
                <span>Tgl Selesai: {currentProcessedLot.processedDate}</span>
              </div>
            </div>
          </>
        ) : (
          /* ==================================================================== */
          /* CASE B: PETANI CHERRY HARVEST LOT */
          /* ==================================================================== */
          <>
            {/* Verification Status Banner for Farmer */}
            <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  HASIL PINDAI BARCODE RESMI • VERIFIED LOT (PETANI)
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Spesifikasi Mutu Lot Panen Ceri
                </h1>
                <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
                  Data berikut didekripsi langsung dari kode QR resmi pada stiker karung panen petani. Data tercatat secara transparan di buku besar rantai pasok sangrAI.
                </p>
              </div>

              <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
                <Sprout className="w-56 h-56" />
              </div>
            </div>

            {/* Technical Specifications Container */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              {/* Header Lot & Farmer */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">ID BATCH / LOT KARUNG</span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-stone-950 tracking-wider">
                    {currentFarmerLot.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Standar Specialty Ceri
                  </span>
                </div>
              </div>

              {/* Producer / Farm Profile */}
              <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                  Petani Produsen & Terroir Kebun
                </span>
                <h2 className="text-lg font-black text-stone-900">
                  {currentFarmerLot.farmerName}
                </h2>
                <p className="text-xs text-stone-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  {currentFarmerLot.farmLocation}
                </p>
              </div>

              {/* Grid of Technical Specifications (MURNI SPESIFIKASI, TANPA HARGA) */}
              <div>
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                  Parameter Mutu Fisik Kopi (Spesifikasi Teknis)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Varietas Kopi:</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5 truncate">
                      {currentFarmerLot.variety}
                    </strong>
                    <span className="text-[10px] text-stone-500">Arabika Unggulan</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Ketinggian Kebun:</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5">
                      {currentFarmerLot.altitude}
                    </strong>
                    <span className="text-[10px] text-stone-500">Elevasi Dingin</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Kadar Gula Buah:</span>
                    <strong className="text-emerald-700 font-black text-sm block mt-0.5">
                      {currentFarmerLot.brix}° Brix
                    </strong>
                    <span className="text-[10px] text-emerald-600 font-medium">Matang Optimal</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Standar Petik:</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5 truncate">
                      {currentFarmerLot.pickingMethod.split(' ')[0]} {currentFarmerLot.pickingMethod.split(' ')[1] || ''}
                    </strong>
                    <span className="text-[10px] text-stone-500">Sortasi Pohon Ketat</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Tanggal Panen:</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5">
                      {currentFarmerLot.harvestDate}
                    </strong>
                    <span className="text-[10px] text-stone-500">Pemetikan Terjadwal</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Total Berat Panen:</span>
                    <strong className="text-stone-900 font-black text-sm block mt-0.5">
                      {currentFarmerLot.totalWeightKg} kg
                    </strong>
                    <span className="text-[10px] text-stone-500">Kuantitas Karung Ceri</span>
                  </div>
                </div>
              </div>

              {/* Farm notes */}
              {currentFarmerLot.notes && (
                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs space-y-1">
                  <span className="font-bold text-amber-900 block">Catatan Perawatan Kebun:</span>
                  <p className="text-stone-700 italic">"{currentFarmerLot.notes}"</p>
                </div>
              )}

              {/* Verification Ledger Footer */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Tersertifikasi Asli oleh Jaringan sangrAI Traceability</span>
                </div>
                <span>Timestamp: {currentFarmerLot.createdAt}</span>
              </div>
            </div>
          </>
        )}

        {/* Closing Trust Statement + Action Button to Open sangrAI Platform */}
        <div className="bg-gradient-to-br from-stone-950 via-amber-950 to-stone-950 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Transparan, dari Kebun hingga Cangkir
          </div>
          <p className="text-white/90 text-sm sm:text-base font-semibold max-w-lg mx-auto leading-relaxed">
            Ingin menjelajahi lebih banyak kopi bersertifikat serupa, atau melihat bagaimana platform sangrAI menghubungkan petani, pengolah, gudang, roaster, dan kedai kopi?
          </p>
          <button
            onClick={onContinue}
            className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <Layers className="w-4 h-4" />
            Jelajahi Marketplace & Ekosistem sangrAI
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto w-full text-center py-6 border-t border-stone-200 text-xs text-stone-500">
        sangrAI Traceability • Standar Label Karung Fisik Terverifikasi
      </footer>
    </div>
  );
};
