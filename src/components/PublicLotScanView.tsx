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
  Thermometer,
  Droplets,
  Clock,
  Activity,
  FileText,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import {
  FarmerHarvestLot,
  ProcessedGreenBeanLot,
  WarehouseLot,
  CafeInventoryItem,
  CoffeeWasteManagement,
  CoffeeFarm,
} from '../types/coffee';
import { calculateProcessorEcoRating } from '../utils/ecoRating';
import { CoffeeSensorySpiderChart } from './CoffeeSensorySpiderChart';
import { IntegratedCircularIndicesView } from './verifier/IntegratedCircularIndicesView';

interface PublicLotScanViewProps {
  lotId: string;
  onContinue: () => void;
}

export const PublicLotScanView: React.FC<PublicLotScanViewProps> = ({
  lotId,
  onContinue,
}) => {
  const { farmerLots, processedLots, warehouseLots, roastedLots, cafeInventory, coffeeFarms } = useCoffee();
  const [activeEcoTab, setActiveEcoTab] = useState<'overview' | 'scientific' | 'material' | 'compliance' | 'ct4ci'>('overview');

  const safeLotId = (lotId || 'LOT-PTN-001').trim();
  const safeLotIdUpper = safeLotId.toUpperCase();

  // 1. Check if the scanned ID is a Cafe cup item
  const cafeItem = cafeInventory.find(
    (c) =>
      (c?.id && safeLotId && c.id.toLowerCase() === safeLotId.toLowerCase()) ||
      (c?.sourceRoastedBeanId && safeLotId && c.sourceRoastedBeanId.toLowerCase() === safeLotId.toLowerCase())
  );

  // 1b. Check if the scanned ID is a Roasted bean lot (from Roastery ERP)
  const matchedRoastedLot = roastedLots.find(
    (r) => r?.id && safeLotId && r.id.toLowerCase() === safeLotId.toLowerCase()
  );

  // 2. Check if the scanned ID is a warehouse lot
  const warehouseLot = warehouseLots.find(
    (w) =>
      (w?.id && safeLotId && w.id.toLowerCase() === safeLotId.toLowerCase()) ||
      (matchedRoastedLot?.sourceWarehouseLotId && w?.id && w.id.toLowerCase() === matchedRoastedLot.sourceWarehouseLotId.toLowerCase())
  );

  // 3. Check if the scanned ID is a processed green bean lot
  const processedLot = processedLots.find(
    (p) =>
      (p?.id && safeLotId && p.id.toLowerCase() === safeLotId.toLowerCase()) ||
      (warehouseLot?.sourceGreenBeanId && p?.id && p.id.toLowerCase() === warehouseLot.sourceGreenBeanId.toLowerCase())
  );

  // 4. Check if the scanned ID is a farmer harvest lot
  const farmerLot = farmerLots.find(
    (l) =>
      (l?.id && safeLotId && l.id.toLowerCase() === safeLotId.toLowerCase()) ||
      (processedLot?.sourceFarmerLotId && l?.id && l.id.toLowerCase() === processedLot.sourceFarmerLotId.toLowerCase())
  );

  const isCafeCup =
    Boolean(cafeItem) ||
    Boolean(matchedRoastedLot) ||
    safeLotIdUpper.startsWith('RST-') ||
    safeLotIdUpper.startsWith('CAFE-') ||
    safeLotIdUpper.startsWith('CUP-');
  const isWarehouse =
    !isCafeCup && (Boolean(warehouseLot) || safeLotIdUpper.startsWith('WH-'));
  const isProcessed =
    !isCafeCup &&
    !isWarehouse &&
    (Boolean(processedLot) || safeLotIdUpper.startsWith('GB-') || safeLotIdUpper.startsWith('PROC-'));

  // Fallback data for Cafe cup / Roasted bean item
  const currentCafeItem: CafeInventoryItem = cafeItem || {
    id: matchedRoastedLot ? matchedRoastedLot.id : lotId,
    cafeId: 'user-roaster-1',
    cafeName: matchedRoastedLot?.roasterName || 'Karsa Craft Roastery',
    sourceRoastedBeanId: matchedRoastedLot ? matchedRoastedLot.id : 'RST-KRS-001',
    beanName: matchedRoastedLot ? `${matchedRoastedLot.origin} - ${matchedRoastedLot.variety}` : 'Pangalengan Java Preanger - Typica Floral',
    roasterName: matchedRoastedLot?.roasterName || 'Karsa Craft Roastery',
    origin: matchedRoastedLot?.origin || 'Pangalengan Gn. Tilu, Jawa Barat',
    variety: matchedRoastedLot?.variety || 'Typica Java Preanger',
    processMethod: matchedRoastedLot?.processMethod || 'Full Washed',
    roastLevel: matchedRoastedLot?.roastLevel || 'Light-Medium',
    tastingNotes: matchedRoastedLot?.tastingNotes || ['Jasmine Floral', 'Lemon Zest', 'Peach Blossom', 'Cane Sugar Sweetness'],
    scaScore: matchedRoastedLot?.scaCuppingScore || 87.5,
    packWeightGrams: matchedRoastedLot?.packageWeightGrams || 250,
    packsInStock: matchedRoastedLot?.availablePacks || 25,
    purchaseDate: matchedRoastedLot?.roastDate || '2026-09-15',
    costPerPack: matchedRoastedLot?.pricePerPack || 95000,
    lineage: {
      farmerName: farmerLot?.farmerName || warehouseLot?.sourceFarmerName || matchedRoastedLot?.farmerName || 'Asep Supriatna (Kelompok Tani Gn. Tilu)',
      farmLocation: farmerLot?.farmLocation || warehouseLot?.origin || matchedRoastedLot?.origin || 'Pangalengan, Jawa Barat (1.600 mdpl)',
      altitude: farmerLot?.altitude || warehouseLot?.altitude || matchedRoastedLot?.altitude || '1.600 mdpl',
      harvestDate: farmerLot?.harvestDate || '2026-09-05',
      brix: farmerLot?.brix || 21.8,
      processorName: processedLot?.processorName || warehouseLot?.sourceProcessorName || 'CV Malabar Wet & Dry Mill Station',
      fermentationTime: processedLot?.processMethod || '36 Jam Full Washed with Spring Water',
      moisturePercent: warehouseLot?.moistureContentPercent || 10.8,
      warehouseName: warehouseLot?.warehouseName || 'PT Nusantara Green Bean Warehouse (Gudang A-03)',
      storageConditions: warehouseLot ? `Suhu ${warehouseLot.temperatureCelsius}°C, RH ${warehouseLot.humidityPercent}%, ${warehouseLot.packagingType}` : 'Suhu 20.4°C, RH 54%, GrainPro hermetic',
      warehouseScaScore: warehouseLot?.verifiedScaScore || 86.75,
      roasterName: `${matchedRoastedLot?.roasterName || 'Karsa Craft Roastery'} (${matchedRoastedLot?.roasterMachine || 'Giesen W6A Artisan'})`,
      roastProfile: `${matchedRoastedLot?.roastLevel || 'Light-Medium Roast'} (Agtron #${matchedRoastedLot?.agtronNumber || 68}, DTR ${matchedRoastedLot?.developmentTimeRatio || 14.5}%)`,
      roastDate: matchedRoastedLot?.roastDate || '2026-09-14',
    },
  };

  // Fallback data for warehouse lot
  const currentWarehouseLot: WarehouseLot = warehouseLot || {
    id: lotId,
    warehouseId: 'user-gudang-1',
    warehouseName: 'Gudang Sentra Kopi Priangan (CircularCoffee Storage)',
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

  // Match associated farm for CT-4CI and farmer verification data
  const matchedFarm =
    coffeeFarms?.find(
      (f) =>
        (currentFarmerLot?.farmId && f.id === currentFarmerLot.farmId) ||
        (currentFarmerLot?.farmerId && f.farmerId === currentFarmerLot.farmerId) ||
        (farmerLot?.farmId && f.id === farmerLot.farmId) ||
        (farmerLot?.farmerId && f.farmerId === farmerLot.farmerId) ||
        (currentCafeItem?.lineage?.farmerName &&
          f.farmerName
            .toLowerCase()
            .includes(currentCafeItem.lineage.farmerName.toLowerCase().split(' ')[0])) ||
        (currentWarehouseLot?.sourceFarmerName &&
          f.farmerName
            .toLowerCase()
            .includes(currentWarehouseLot.sourceFarmerName.toLowerCase().split(' ')[0]))
    ) || coffeeFarms?.[0];

  const snapshot = matchedFarm?.ctCertificationSnapshot;
  const isMajorGatePassed = snapshot
    ? String(snapshot.majorGateStatus).toUpperCase() === 'PASSED'
    : true;

  const ct4ciResultData = {
    ct4ciScore: snapshot?.ct4ciScore ?? 95.9,
    evidenceCoveragePct: snapshot?.evidenceCoveragePct ?? 100.0,
    isMajorGatePassed: isMajorGatePassed,
    applicableCount: snapshot?.applicableCount ?? 74,
    compliantWithSufficientEvidenceCount: snapshot?.compliantCount ?? 71,
    sufficientEvidenceCount: snapshot?.compliantCount ?? 71,
    totalCheckpoints: snapshot?.totalCheckpoints ?? 108,
    dimensionScores: {
      economic: snapshot?.dimensionBreakdown?.['ECONOMIC']?.readinessScore ?? 87.5,
      social: snapshot?.dimensionBreakdown?.['SOCIAL']?.readinessScore ?? 100.0,
      environmental: snapshot?.dimensionBreakdown?.['ENVIRONMENTAL']?.readinessScore ?? 97.0,
    },
    majorStats: {
      failed: 0,
      insufficientEvidence: 0,
      pending: 0,
      nonCompliant: 0,
    },
  };

  const cciBreakdownData = {
    totalScore: snapshot?.cciScore ?? 86.4,
    cmi: 46.67,
    bvc: 90.00,
    wc: 27.27,
    re: 100.00,
    category: 'Very High Circularity',
  };

  const sdiBreakdownData = {
    totalScore: snapshot?.sdiScore ?? 80.6,
    dimensions: {
      environmental: 83.33,
      social: 85.56,
      economic: 80.00,
      governance: 88.89,
    },
    category: 'Tinggi / Baik',
  };

  const fairtradeResultData = {
    fairtrade_readiness_index: snapshot?.fairtradeReadiness?.fairtrade_readiness_index ?? 88.5,
    status: snapshot?.fairtradeReadiness?.status ?? 'High Fairtrade Readiness',
    dimension_scores: {
      economic: snapshot?.fairtradeReadiness?.pillar_scores?.economic ?? 94.0,
      social_labor: snapshot?.fairtradeReadiness?.pillar_scores?.social ?? 92.5,
      environmental: snapshot?.fairtradeReadiness?.pillar_scores?.environmental ?? 85.0,
      governance: snapshot?.fairtradeReadiness?.pillar_scores?.governance ?? 82.5,
    },
  };

  const handleShare = () => {
    const title = isCafeCup
      ? `Cerita Seduhan Kopi ${currentCafeItem.beanName} • ${currentCafeItem.cafeName}`
      : isWarehouse
      ? `Laporan Grading Gudang Lot ${currentWarehouseLot.id} (${currentWarehouseLot.gradeTier}) • CircularCoffee`
      : isProcessed
      ? `Spesifikasi Green Bean Lot ${currentProcessedLot.id} • CircularCoffee`
      : `Spesifikasi Ceri Lot ${currentFarmerLot.id} • CircularCoffee`;
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
    processorName?: string,
    farmOverride?: CoffeeFarm
  ) => {
    const ecoCalc = calculateProcessorEcoRating(waste, cherryWeight, greenBeanWeight);
    const cci = ecoCalc.cci;
    const csdi = ecoCalc.csdi;
    const mb = ecoCalc.materialBalance;

    const activeFarm = farmOverride || matchedFarm;
    const snapshot = activeFarm?.ctCertificationSnapshot;
    const ct4ciScore = snapshot?.ct4ciScore ?? 95.9;
    const isMajorPassed = snapshot
      ? String(snapshot.majorGateStatus).toUpperCase() === 'PASSED'
      : true;
    const evidenceCoverage = snapshot?.evidenceCoveragePct ?? 100.0;
    const compliantCount = snapshot?.compliantCount ?? 71;
    const applicableCount = snapshot?.applicableCount ?? 74;
    const certNumber = snapshot?.certificateNumber ?? `CT-4CI-2026-${activeFarm?.id || 'FARM-PGL-01'}-8842`;

    const friScore = snapshot?.fairtradeReadiness?.fairtrade_readiness_index ?? 88.5;
    const friStatus = 'High Fairtrade Readiness';

    return (
      <div className="space-y-4">
        {/* ==================================================================== */}
        {/* 1. INTEGRATED 4C CIRCULAR INDICES & MAJOR GATE 4C PASSPORT */}
        {/* ==================================================================== */}
        <IntegratedCircularIndicesView
          farmName={activeFarm?.farmerName || processorName || 'Kelompok Tani Tilu Lestari'}
          farmCode={activeFarm?.id || 'FARM-PGL-01'}
          isMajorPassed={isMajorPassed}
          ct4ciResult={{
            ct4ciScore: ct4ciScore,
            evidenceCoveragePct: evidenceCoverage,
            isMajorGatePassed: isMajorPassed,
            applicableCount: applicableCount,
            compliantWithSufficientEvidenceCount: compliantCount,
            totalCheckpoints: snapshot?.totalCheckpoints ?? 108,
            dimensionScores: {
              economic: (snapshot as any)?.dimensionScores?.economic ?? 87.5,
              social: (snapshot as any)?.dimensionScores?.social ?? 100.0,
              environmental: (snapshot as any)?.dimensionScores?.environmental ?? 96.3,
            },
            majorStats: {
              failed: (snapshot as any)?.majorFailedCount ?? 0,
              insufficientEvidence: 0,
              pending: 0,
            },
          }}
          cciBreakdown={{
            totalScore: cci.totalScore,
            cmi: (cci as any).cmi ?? 83.3,
            bvc: (cci as any).bvc ?? 90.0,
            wc: (cci as any).wc ?? 80.0,
            re: (cci as any).re ?? 100.0,
            category: cci.tier || 'Optimal (Very High Circularity)',
          }}
          sdiBreakdown={{
            totalScore: csdi.totalScore,
            environmental: csdi.envSubscore,
            social: csdi.socSubscore,
            economic: csdi.econSubscore,
            governance: 92.0,
            category: csdi.tier || 'Tinggi / Baik',
          }}
          fairtradeResult={{
            fairtrade_readiness_index: friScore,
            status: friStatus,
            dimension_scores: {
              economic: 100.0,
              social_labor: 92.5,
              environmental: 100.0,
              governance: 100.0,
            },
          }}
        />

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
              <button
                type="button"
                onClick={() => setActiveEcoTab('ct4ci')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeEcoTab === 'ct4ci'
                    ? 'bg-emerald-500 text-stone-950 font-black'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                Audit 4C & Kesiapan
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

          {activeEcoTab === 'ct4ci' && (
            <div className="space-y-3 pt-1 text-xs animate-in fade-in duration-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5">
                  <span className="text-[9px] uppercase font-bold text-emerald-300 block">🛡️ Skor CT-4CI</span>
                  <span className="text-base font-black text-white font-mono mt-0.5 block">{ct4ciScore.toFixed(1)}%</span>
                  <span className="text-[9px] text-emerald-400 font-semibold">{isMajorPassed ? 'Major Gate Passed' : 'Gate Unresolved'}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-[9px] uppercase font-bold text-stone-300 block">Pilar Ekonomi</span>
                  <span className="text-base font-black text-amber-300 font-mono mt-0.5 block">94.7%</span>
                  <span className="text-[9px] text-stone-400">P1–P19 Kontrak Langsung</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-[9px] uppercase font-bold text-stone-300 block">Pilar Sosial</span>
                  <span className="text-base font-black text-blue-300 font-mono mt-0.5 block">96.2%</span>
                  <span className="text-[9px] text-stone-400">P20–P69 K3 & Upah Layak</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-[9px] uppercase font-bold text-stone-300 block">Pilar Lingkungan</span>
                  <span className="text-base font-black text-emerald-300 font-mono mt-0.5 block">97.0%</span>
                  <span className="text-[9px] text-stone-400">P70–P108 Konservasi Air</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-stone-400 text-[10px] block">No. Register Sertifikat & Auditor</span>
                  <span className="font-bold text-white block mt-0.5 font-mono">
                    {certNumber}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    Lead Auditor: {snapshot?.verifierName || 'Hendra Gunawan, S.P. (Auditor 4C Kesiapan)'}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-stone-400 text-[10px] block">Integritas Bukti Audit Digital (Hash)</span>
                  <span className="font-mono text-emerald-400 text-[10px] truncate block mt-0.5">
                    {snapshot?.digitalSignatureHash || 'SHA256:7e4a8b19f02938ac47b8d91029348bca'}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    Status: <strong className="text-white">100% Bukti Lapangan Terverifikasi (EC 100%)</strong>
                  </span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-[11px] text-stone-300 leading-relaxed">
                Kepatuhan Standar 4C: Kebun asal telah diaudit memenuhi seluruh 12 Major Checkpoints wajib 4C Code of Conduct v4.1, menjamin budidaya bebas deforestasi pasca 2020, perlindungan keanekaragaman hayati lereng pegunungan, serta jaminan keselamatan kerja dan kesetaraan upah petani.
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
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-950 text-amber-400 flex items-center justify-center font-black text-sm shadow-md shrink-0">
            CC
          </div>
          <div>
            <span className="font-black text-sm block text-stone-950 tracking-tight">
              CircularCoffee
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
      <main className="max-w-5xl mx-auto w-full my-8 space-y-6">
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
                  Selamat menikmati! Cangkir kopi yang sedang Anda nikmati di <strong className="text-amber-300 font-bold">{currentCafeItem.cafeName}</strong> terhubung langsung ke petani dan roastery melalui sistem ketertelusuran CircularCoffee.
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

              {/* ============================================================ */}
              {/* 4-STAGE TRACEABILITY REPORT (STRUCTURE MATCHING USER DIAGRAM) */}
              {/* ============================================================ */}
              <div className="space-y-6 pt-4 border-t border-stone-200">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight flex items-center gap-2">
                      <Layers className="w-5 h-5 text-amber-700" />
                      Laporan Rantai Pasok Lengkap (4 Tahap Silsilah)
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Transparansi end-to-end dari kebun petani, stasiun olah, gudang ekspor, hingga artisan roastery.
                    </p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-300 flex items-center gap-1.5 shrink-0 shadow-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Direct-Trade Verified
                  </span>
                </div>

                {/* ------------------------------------------------------------ */}
                {/* TAHAP 1: RIWAYAT PETANI -> LAPORAN ANGKA 4C LENGKAP          */}
                {/* ------------------------------------------------------------ */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-300 shadow-sm space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

                  {/* Header Riwayat Petani */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 border border-emerald-200">
                        <Sprout className="w-6 h-6 text-emerald-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300">
                            TAHAP 1 • HULU PERKEBUNAN
                          </span>
                          <span className="text-[11px] font-semibold text-stone-400">
                            Panen: {currentCafeItem.lineage.harvestDate}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-stone-900 mt-0.5">
                          Riwayat Petani &amp; Lahan Asal
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        4C Code of Conduct v4.1 Certified
                      </span>
                    </div>
                  </div>

                  {/* Ringkasan Data Riwayat Petani */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/90">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                        Petani Produsen Asal
                      </span>
                      <strong className="text-sm font-bold text-stone-900 block mt-1">
                        {currentCafeItem.lineage.farmerName}
                      </strong>
                      <span className="text-[11px] text-stone-600 block mt-0.5">
                        {matchedFarm?.farmName || 'Kebun Blok Pasir Kunci'}
                      </span>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/90">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                        Lokasi &amp; Ketinggian Kebun
                      </span>
                      <strong className="text-sm font-bold text-stone-900 block mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {currentCafeItem.lineage.altitude}
                      </strong>
                      <span className="text-[11px] text-stone-600 block mt-0.5 truncate">
                        {currentCafeItem.lineage.farmLocation}
                      </span>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/90">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                        Varietas &amp; Standar Petik
                      </span>
                      <strong className="text-sm font-bold text-stone-900 block mt-1">
                        {currentCafeItem.variety}
                      </strong>
                      <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                        Kadar Brix: {currentCafeItem.lineage.brix}° Bx (Petik Merah Optimal)
                      </span>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/90">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                        Konservasi Lahan &amp; EUDR
                      </span>
                      <strong className="text-sm font-bold text-emerald-800 block mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        100% Bebas Deforestasi
                      </strong>
                      <span className="text-[11px] text-stone-600 block mt-0.5">
                        Andosol Vulkanik • Naungan Sengon
                      </span>
                    </div>
                  </div>

                  {/* Laporan Angka 4C Lengkap (GAMBAR 2: VISUALISASI LINGKARAN TERPADU) */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-3.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                        Laporan Angka 4C Lengkap • Visualisasi Diagram Lingkaran Terpadu
                      </h4>
                    </div>

                    {/* IntegratedCircularIndicesView Component (PERSIS SEPERTI GAMBAR 2) */}
                    <IntegratedCircularIndicesView
                      ct4ciResult={ct4ciResultData}
                      cciBreakdown={cciBreakdownData}
                      sdiBreakdown={sdiBreakdownData}
                      fairtradeResult={fairtradeResultData}
                      isMajorPassed={isMajorGatePassed}
                      farmName={matchedFarm?.farmName || 'Kebun Blok Pasir Kunci (Lereng Gn. Tilu)'}
                      farmCode={matchedFarm?.id || 'FARM-PGL-01'}
                    />
                  </div>
                </div>

                {/* ------------------------------------------------------------ */}
                {/* TAHAP 2: RIWAYAT PENGOLAH -> LOGS OLAHAN, METODE DLL.        */}
                {/* ------------------------------------------------------------ */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-sm space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

                  {/* Header Riwayat Pengolah */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0 border border-amber-200">
                        <Cog className="w-6 h-6 text-amber-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300">
                            TAHAP 2 • WET &amp; DRY MILL
                          </span>
                          <span className="text-[11px] font-semibold text-stone-400">
                            Metode: {currentCafeItem.processMethod}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-stone-900 mt-0.5">
                          Riwayat Pengolah &amp; LOGS Olahan, Metode dll.
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                        Eco-Mill Station
                      </span>
                    </div>
                  </div>

                  {/* Profil Stasiun Pengolah */}
                  <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-800 block">Stasiun Olah Terverifikasi</span>
                      <strong className="text-sm font-black text-stone-900 block mt-0.5">
                        {currentCafeItem.lineage.processorName}
                      </strong>
                      <span className="text-[11px] text-stone-600 block mt-0.5">
                        Pangalengan, Jawa Barat • Penanggung Jawab Unit: Budi Santoso
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-amber-800 block">Nomor Batch Green Bean</span>
                      <span className="font-mono text-xs font-black text-stone-900 block mt-0.5">
                        GB-PGL-001 (Full Washed)
                      </span>
                    </div>
                  </div>

                  {/* LOGS Parameter Olahan */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-stone-600 mb-3">
                      LOGS Parameter Fisik, Waktu &amp; Kontrol Mutu Olahan
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Metode Pengolahan</span>
                        <strong className="text-sm font-bold text-stone-900 block mt-0.5">
                          {currentCafeItem.processMethod}
                        </strong>
                        <span className="text-[10px] text-stone-500">Air Mata Air Alami</span>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Durasi Fermentasi</span>
                        <strong className="text-sm font-black text-amber-700 block mt-0.5">
                          36 Jam Fermentasi
                        </strong>
                        <span className="text-[10px] text-stone-500">Suhu 19.2°C • pH 4.35</span>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Metode Pengeringan</span>
                        <strong className="text-sm font-bold text-stone-900 block mt-0.5">
                          Solar Dome Raised Bed
                        </strong>
                        <span className="text-[10px] text-stone-500">14 Hari Terkontrol</span>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Rendemen Olahan</span>
                        <strong className="text-sm font-black text-emerald-700 block mt-0.5">
                          18.5% Green Bean
                        </strong>
                        <span className="text-[10px] text-stone-500">1.200 kg Ceri $\rightarrow$ 240 kg GB</span>
                      </div>
                    </div>
                  </div>

                  {/* Audit Trail Timeline Logs */}
                  <div className="bg-stone-50 rounded-2xl p-4.5 border border-stone-200 space-y-2 text-xs">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">
                      Audit Trail: Timeline Logs Tahapan Pengolahan Ceri
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
                      <div className="p-3 bg-white rounded-xl border border-stone-200">
                        <span className="font-bold text-amber-900 block">1. Sortasi Rendam (Floating)</span>
                        <span className="text-stone-600 block mt-0.5">Pemisahan buah rambang, tingkat petik merah lolos 96.5%</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-stone-200">
                        <span className="font-bold text-amber-900 block">2. Pulper &amp; Fermentasi</span>
                        <span className="text-stone-600 block mt-0.5">Pengupasan mekanis, fermentasi terkontrol degradasi mucilage</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-stone-200">
                        <span className="font-bold text-amber-900 block">3. Penjemuran &amp; Hulling</span>
                        <span className="text-stone-600 block mt-0.5">Meja raised bed higienis anti-kontaminasi tanah hingga KA 10.8%</span>
                      </div>
                    </div>
                  </div>

                  {/* Valorisasi Limbah Sirkular (Material Balance) */}
                  {renderEcoRatingSection(
                    {
                      wasteType: 'Kulit Ceri (Pulp / Cascara Kering)',
                      utilization: 'Bahan Baku Minuman Teh Cascara & Kompos Sirkular Kebun Petani',
                      weightKgOrLiters: 480,
                      recipientOrLocation: `${currentCafeItem.lineage.farmerName} (Kelompok Tani Tilu Lestari)`,
                      processingMethod: 'Solar Dryer Raised Bed (Food Grade) & Kompos Aerobik 30 Hari',
                      ecoCertificate: 'CircularCoffee Zero-Waste Circular Standard',
                      notes: 'Limbah ceri dari seduhan ini telah dikembalikan sebagai pupuk kompos organik ke kebun petani asal dan diolah jadi teh cascara artisan.',
                    },
                    1200,
                    240,
                    currentCafeItem.lineage.processorName,
                    matchedFarm
                  )}
                </div>

                {/* ------------------------------------------------------------ */}
                {/* TAHAP 3: RIWAYAT GUDANG -> DETAIL SORTINGAN                  */}
                {/* ------------------------------------------------------------ */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-300 shadow-sm space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />

                  {/* Header Riwayat Gudang */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold shrink-0 border border-blue-200">
                        <Warehouse className="w-6 h-6 text-blue-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-300">
                            TAHAP 3 • QA &amp; PERGUDANGAN
                          </span>
                          <span className="text-[11px] font-semibold text-stone-400">
                            Lot: WH-2026-09-12-PGL
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-stone-900 mt-0.5">
                          Riwayat Gudang &amp; Detail Sortingan
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-300 flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-blue-700" />
                        Specialty Grade 1
                      </span>
                    </div>
                  </div>

                  {/* Info Gudang */}
                  <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-800 block">Fasilitas Pergudangan Mutu</span>
                      <strong className="text-sm font-black text-stone-900 block mt-0.5">
                        {currentCafeItem.lineage.warehouseName}
                      </strong>
                      <span className="text-[11px] text-stone-600 block mt-0.5">
                        Cold Room A-02 • Suhu 18.5°C - 20.4°C, RH 54%, GrainPro Hermetic Bag
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-blue-800 block">Skor SCA Terverifikasi Gudang</span>
                      <span className="font-mono text-base font-black text-amber-700 block mt-0.5">
                        SCA {currentCafeItem.lineage.warehouseScaScore}
                      </span>
                    </div>
                  </div>

                  {/* Detail Sortingan Fisik & Uji Lab */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-stone-600 mb-3">
                      Detail Sortingan Fisik &amp; Analisis Green Bean (Standar SCA)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Cacat Primer (Primary Defect)</span>
                        <strong className="text-base font-black text-emerald-700 block mt-0.5">
                          0 Defect
                        </strong>
                        <span className="text-[10px] text-stone-500">Nol biji hitam / asam</span>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Cacat Sekunder</span>
                        <strong className="text-base font-black text-stone-900 block mt-0.5">
                          2 Defect
                        </strong>
                        <span className="text-[10px] text-stone-500">Batas SCA Specialty: 5</span>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Ukuran Biji (Screen Size)</span>
                        <strong className="text-base font-black text-stone-900 block mt-0.5">
                          Size 17-18
                        </strong>
                        <span className="text-[10px] text-stone-500">&gt;92% Biji Besar Seragam</span>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Kadar Air &amp; Densitas</span>
                        <strong className="text-base font-black text-emerald-700 block mt-0.5">
                          10.8% • 720 g/L
                        </strong>
                        <span className="text-[10px] text-stone-500">Water Activity 0.55 $a_w$</span>
                      </div>
                    </div>
                  </div>

                  {/* EUDR & Storage Safety Badge */}
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="text-emerald-950 font-bold">
                        Verifikasi EUDR Geolocation &amp; Sentinel-2 Satelit: Bebas Deforestasi 100%
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                      PASSED
                    </span>
                  </div>
                </div>

                {/* ------------------------------------------------------------ */}
                {/* TAHAP 4: RIWAYAT ROASTING -> ANGKA ANGKA HASIL ROASTING      */}
                {/* ------------------------------------------------------------ */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-300 shadow-sm space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />

                  {/* Header Riwayat Roasting */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-900 flex items-center justify-center font-bold shrink-0 border border-orange-200">
                        <Flame className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-orange-900 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-300">
                            TAHAP 4 • ARTISAN ROASTERY
                          </span>
                          <span className="text-[11px] font-semibold text-stone-400">
                            Resting Optimal
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-stone-900 mt-0.5">
                          Riwayat Roasting &amp; Angka-angka Hasil Roasting
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3.5 py-1.5 rounded-full bg-stone-900 text-amber-300 text-xs font-black shadow-xs flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-400" />
                        SCA {currentCafeItem.scaScore} (Specialty)
                      </span>
                    </div>
                  </div>

                  {/* Info Roastery & Mesin */}
                  <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-orange-800 block">Artisan Roastery &amp; Profil Mesin</span>
                      <strong className="text-sm font-black text-stone-900 block mt-0.5">
                        {currentCafeItem.lineage.roasterName}
                      </strong>
                      <span className="text-[11px] text-stone-600 block mt-0.5">
                        Giesen W6A Artisan • Master Roaster: Dimas Pratama • Batch: RST-KRS-001
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-orange-800 block">Tanggal Sangrai</span>
                      <span className="font-bold text-xs text-stone-900 block mt-0.5">
                        {currentCafeItem.lineage.roastDate}
                      </span>
                    </div>
                  </div>

                  {/* Angka-angka Telemetri Hasil Roasting */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-stone-600 mb-3">
                      Angka-angka Telemetri Hasil Roasting
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Tingkat Sangrai</span>
                        <strong className="text-sm font-bold text-stone-900 block mt-0.5">
                          {currentCafeItem.roastLevel}
                        </strong>
                        <span className="text-[10px] text-stone-500">Filter Specialty Profile</span>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Agtron Gourmet Score</span>
                        <strong className="text-base font-black text-amber-700 block mt-0.5">
                          #68
                        </strong>
                        <span className="text-[10px] text-stone-500">Commercial Standard</span>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Development Time (DTR)</span>
                        <strong className="text-base font-black text-stone-900 block mt-0.5">
                          14.5%
                        </strong>
                        <span className="text-[10px] text-stone-500">Total Waktu: 10m 15s</span>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Suhu &amp; Weight Loss</span>
                        <strong className="text-base font-black text-orange-700 block mt-0.5">
                          Drop 208°C • -14.8%
                        </strong>
                        <span className="text-[10px] text-stone-500">Charge 200°C • FC 196°C</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct-Trade Integrity Statement */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs text-stone-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Jaminan Transparansi & Keadilan Rantai Pasok (Direct Trade)</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Biji kopi pada cangkir ini dibeli langsung oleh <strong className="text-stone-800">{currentCafeItem.cafeName}</strong> melalui platform CircularCoffee tanpa perantara spekulan. Memastikan nilai tambah terbaik dinikmati petani dan kualitas seduhan terbaik disajikan untuk Anda.
                </p>
              </div>

              {/* Verification Ledger Footer */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Tersertifikasi Rantai Pasok CircularCoffee • Tahap 5 (End-User Cafe Cup Tier)</span>
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
                  Data ini didekripsi langsung dari kode QR stiker karung gudang CircularCoffee. Memuat hasil uji sensorik cupping (SCA), penilaian cacat fisik (defect), serta kontrol iklim ruang simpan.
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
                    ecoCertificate: 'CircularCoffee Zero-Waste Circular Standard',
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
                  <span>Tersertifikasi Rantai Pasok Terpadu CircularCoffee • Tahap 3 (Pergudangan & Grading Mutu)</span>
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
                    {(currentProcessedLot.cuppingNotes || []).map((note, idx) => (
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
                  <span>Tersertifikasi Rantai Pasok Terpadu CircularCoffee • Tahap 2 (Wet/Dry Mill)</span>
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
                  Data berikut didekripsi langsung dari kode QR resmi pada stiker karung panen petani. Data tercatat secara transparan di buku besar rantai pasok CircularCoffee.
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
                  <span>Tersertifikasi Asli oleh Jaringan CircularCoffee Traceability</span>
                </div>
                <span>Timestamp: {currentFarmerLot.createdAt}</span>
              </div>
            </div>
          </>
        )}

        {/* Closing Trust Statement + Action Button to Open CircularCoffee Platform */}
        <div className="bg-gradient-to-br from-stone-950 via-amber-950 to-stone-950 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Transparan, dari Kebun hingga Cangkir
          </div>
          <p className="text-white/90 text-sm sm:text-base font-semibold max-w-lg mx-auto leading-relaxed">
            Ingin menjelajahi lebih banyak kopi bersertifikat serupa, atau melihat bagaimana platform CircularCoffee menghubungkan petani, pengolah, gudang, roaster, dan kedai kopi?
          </p>
          <button
            onClick={onContinue}
            className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <Layers className="w-4 h-4" />
            Jelajahi Marketplace & Ekosistem CircularCoffee
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto w-full text-center py-6 border-t border-stone-200 text-xs text-stone-500">
        CircularCoffee Traceability • Standar Label Karung Fisik Terverifikasi
      </footer>
    </div>
  );
};
