import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Warehouse,
  ShoppingCart,
  History,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Award,
  Box,
  Sparkles,
  X,
  Crown,
  Layers,
  TrendingUp,
  Sliders,
  Filter,
  BadgePercent,
  Edit3,
  QrCode,
  Search,
  Thermometer,
  Droplets,
  AlertTriangle,
} from 'lucide-react';
import { ProcessedGreenBeanLot, WarehouseLot, WarehouseGradeTier } from '../types/coffee';
import { WarehouseBarcodeModal } from './WarehouseBarcodeModal';
import { MetricCard } from './admin/MetricCard';

// Konfigurasi Standar Grading Gudang (Dari Super Premium sampai Basic Commercial)
export const GRADE_TIERS_CONFIG: Record<
  WarehouseGradeTier,
  {
    tier: WarehouseGradeTier;
    label: string;
    shortLabel: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    borderColor: string;
    activeRing: string;
    lightBg: string;
    icon: React.ComponentType<{ className?: string }>;
    scaRange: string;
    defaultSca: number;
    defectRange: string;
    defaultDefect: number;
    defaultScreen: string;
    markupPercent: number;
    targetMarket: string;
    characteristics: string;
  }
> = {
  'Grade 1 - Super Premium': {
    tier: 'Grade 1 - Super Premium',
    label: 'Grade 1: Super Premium (Specialty Grade)',
    shortLabel: 'Super Premium',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-950',
    badgeBorder: 'border-amber-300',
    borderColor: 'border-amber-400',
    activeRing: 'ring-amber-500',
    lightBg: 'bg-amber-50/80',
    icon: Crown,
    scaRange: '≥ 85.0 (Specialty)',
    defaultSca: 87.25,
    defectRange: '0 - 5 defect / 350g (Zero Primary)',
    defaultDefect: 2,
    defaultScreen: 'Screen 18+ (Super Screen)',
    markupPercent: 32,
    targetMarket: 'Specialty Coffee Shop, Kompetisi Brewer & Ekspor Pilihan',
    characteristics: 'Kualitas tertinggi tanpa cacat primer, densitas tinggi, notes cita rasa kompleks dan bersih.',
  },
  'Grade 2 - Premium Grade': {
    tier: 'Grade 2 - Premium Grade',
    label: 'Grade 2: Premium Grade (Fine Commercial)',
    shortLabel: 'Premium Grade',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-950',
    badgeBorder: 'border-purple-300',
    borderColor: 'border-purple-400',
    activeRing: 'ring-purple-500',
    lightBg: 'bg-purple-50/80',
    icon: Award,
    scaRange: '83.0 - 84.75',
    defaultSca: 84.5,
    defectRange: '6 - 12 defect / 350g',
    defaultDefect: 8,
    defaultScreen: 'Screen 16-17 (Medium Large)',
    markupPercent: 24,
    targetMarket: 'Artisan Micro-Roastery & Cafe Specialty Menengah',
    characteristics: 'Biji pilihan seragam dengan sedikit cacat sekunder ringan, body stabil, rasa manis seimbang.',
  },
  'Grade 3 - Medium Commercial': {
    tier: 'Grade 3 - Medium Commercial',
    label: 'Grade 3: Medium Commercial (Standard)',
    shortLabel: 'Medium Commercial',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-950',
    badgeBorder: 'border-blue-300',
    borderColor: 'border-blue-400',
    activeRing: 'ring-blue-500',
    lightBg: 'bg-blue-50/80',
    icon: ShieldCheck,
    scaRange: '80.0 - 82.75',
    defaultSca: 81.0,
    defectRange: '13 - 25 defect / 350g',
    defaultDefect: 18,
    defaultScreen: 'Screen 15-16 (Medium)',
    markupPercent: 15,
    targetMarket: 'Commercial Roaster, Daily House Blend & Cafe Chain',
    characteristics: 'Standar komersial untuk konsumsi volume besar harian, ideal untuk blend espresso susu.',
  },
  'Grade 4 - Basic Commercial': {
    tier: 'Grade 4 - Basic Commercial',
    label: 'Grade 4: Basic Commercial (Economy / Off-grade)',
    shortLabel: 'Basic Commercial',
    badgeBg: 'bg-stone-200',
    badgeText: 'text-stone-800',
    badgeBorder: 'border-stone-300',
    borderColor: 'border-stone-400',
    activeRing: 'ring-stone-500',
    lightBg: 'bg-stone-100/80',
    icon: Layers,
    scaRange: '< 80.0 (Commercial)',
    defaultSca: 76.5,
    defectRange: '26 - 45 defect / 350g',
    defaultDefect: 35,
    defaultScreen: 'Screen 14-15 (Small / Mixed)',
    markupPercent: 6,
    targetMarket: 'Industri Kopi Instan, Es Kopi Susu Massal & Pabrik Bubuk',
    characteristics: 'Tingkat dasar ekonomis dengan toleransi cacat lebih longgar, harga murah untuk efisiensi margin.',
  },
};

export const WarehouseView: React.FC = () => {
  const {
    currentUser,
    processedLots,
    warehouseLots,
    buyGreenBeanAndStoreWarehouse,
    updateWarehouseLotGrading,
    transactions,
  } = useCoffee();

  const [activeTab, setActiveTab] = useState<'inventory' | 'marketplace' | 'history'>('inventory');
  const [selectedGreenBeanToBuy, setSelectedGreenBeanToBuy] = useState<ProcessedGreenBeanLot | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | WarehouseGradeTier>('all');

  // Form state for warehouse storage, grading & dynamic pricing
  const [boughtKg, setBoughtKg] = useState<number>(100);
  const [storageLocation, setStorageLocation] = useState('Silo A-03 (Pallet Kayu Pine #14)');
  const [temperatureCelsius, setTemperatureCelsius] = useState<number>(20.4);
  const [humidityPercent, setHumidityPercent] = useState<number>(54);
  const [packagingType, setPackagingType] = useState<WarehouseLot['packagingType']>(
    'GrainPro + Karung Goni 60kg'
  );

  // Grading attributes
  const [gradeTier, setGradeTier] = useState<WarehouseGradeTier>('Grade 1 - Super Premium');
  const [defectCount, setDefectCount] = useState<number>(2);
  const [screenSize, setScreenSize] = useState<string>('Screen 18+ (Super Screen)');
  const [verifiedScaScore, setVerifiedScaScore] = useState<number>(87.25);
  const [targetMarket, setTargetMarket] = useState<string>(
    'Specialty Coffee Shop, Kompetisi Brewer & Ekspor Pilihan'
  );
  const [sellingPricePerKg, setSellingPricePerKg] = useState<number>(165000);
  const [gradingNotes, setGradingNotes] = useState(
    'Hasil inspeksi fisik: Zero primary defect, kadar air 10.9%, densitas seragam.'
  );
  const [notes] = useState('Kemasan kedap udara GrainPro, kontrol suhu stabil.');
  const [successMsg, setSuccessMsg] = useState('');

  // Re-Grading Modal State
  const [editingLotForGrading, setEditingLotForGrading] = useState<WarehouseLot | null>(null);
  const [editGradeTier, setEditGradeTier] = useState<WarehouseGradeTier>('Grade 1 - Super Premium');
  const [editDefectCount, setEditDefectCount] = useState<number>(2);
  const [editScreenSize, setEditScreenSize] = useState<string>('Screen 18+');
  const [editVerifiedScaScore, setEditVerifiedScaScore] = useState<number>(87.0);
  const [editSellingPricePerKg, setEditSellingPricePerKg] = useState<number>(165000);
  const [editTargetMarket, setEditTargetMarket] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [barcodeModalLot, setBarcodeModalLot] = useState<WarehouseLot | null>(null);

  // Data lot & transactions
  const availableGreenBeans = processedLots.filter((lot) => lot.availableWeightKg > 0);
  const myWarehouseLots = warehouseLots.filter(
    (lot) => lot.warehouseId === currentUser?.id || true
  );

  const myWarehouseTransactions = transactions.filter(
    (t) =>
      t.fromName === currentUser?.name ||
      t.toName === currentUser?.name ||
      t.fromRole === 'gudang' ||
      t.toRole === 'gudang'
  );

  const totalStoredKg = myWarehouseLots.reduce((acc, curr) => acc + curr.weightKg, 0);
  const availableStoredKg = myWarehouseLots.reduce((acc, curr) => acc + curr.availableWeightKg, 0);

  const superPremiumKg = myWarehouseLots
    .filter((l) => l.gradeTier === 'Grade 1 - Super Premium')
    .reduce((acc, curr) => acc + curr.availableWeightKg, 0);

  const premiumKg = myWarehouseLots
    .filter((l) => l.gradeTier === 'Grade 2 - Premium Grade')
    .reduce((acc, curr) => acc + curr.availableWeightKg, 0);

  const commercialKg = myWarehouseLots
    .filter(
      (l) =>
        l.gradeTier === 'Grade 3 - Medium Commercial' || l.gradeTier === 'Grade 4 - Basic Commercial'
    )
    .reduce((acc, curr) => acc + curr.availableWeightKg, 0);

  const handleSelectGradeTier = (tier: WarehouseGradeTier, basePrice: number) => {
    setGradeTier(tier);
    const cfg = GRADE_TIERS_CONFIG[tier];
    setDefectCount(cfg.defaultDefect);
    setScreenSize(cfg.defaultScreen);
    setVerifiedScaScore(cfg.defaultSca);
    setTargetMarket(cfg.targetMarket);
    const calculatedPrice = Math.round((basePrice * (1 + cfg.markupPercent / 100)) / 1000) * 1000;
    setSellingPricePerKg(calculatedPrice);
  };

  const handleOpenStorageModal = (lot: ProcessedGreenBeanLot) => {
    setSelectedGreenBeanToBuy(lot);
    const defaultBuy = Math.min(lot.availableWeightKg, 120);
    setBoughtKg(defaultBuy);
    const initialTier: WarehouseGradeTier =
      lot.grade === 'Specialty Grade 1' ? 'Grade 1 - Super Premium' : 'Grade 2 - Premium Grade';
    handleSelectGradeTier(initialTier, lot.pricePerKg);
  };

  const handleConfirmStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGreenBeanToBuy) return;

    buyGreenBeanAndStoreWarehouse(selectedGreenBeanToBuy.id, boughtKg, {
      storageLocation,
      temperatureCelsius: Number(temperatureCelsius),
      humidityPercent: Number(humidityPercent),
      packagingType,
      verifiedScaScore: Number(verifiedScaScore),
      pricePerKg: Number(sellingPricePerKg),
      gradeTier,
      defectCount: Number(defectCount),
      screenSize,
      purchasePricePerKg: selectedGreenBeanToBuy.pricePerKg,
      targetMarket,
      gradingNotes,
      notes,
    });

    setSuccessMsg(
      `Sukses membeli ${boughtKg} kg Green Bean (${selectedGreenBeanToBuy.variety}) dari ${selectedGreenBeanToBuy.processorName}. Lot telah diklasifikasikan sebagai ${gradeTier} dengan harga jual Rp ${sellingPricePerKg.toLocaleString()}/kg!`
    );
    setSelectedGreenBeanToBuy(null);
    setActiveTab('inventory');
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  const handleOpenEditGrading = (lot: WarehouseLot) => {
    setEditingLotForGrading(lot);
    const tier = lot.gradeTier || 'Grade 1 - Super Premium';
    setEditGradeTier(tier);
    setEditDefectCount(lot.defectCount ?? 2);
    setEditScreenSize(lot.screenSize || 'Screen 18+');
    setEditVerifiedScaScore(lot.verifiedScaScore);
    setEditSellingPricePerKg(lot.pricePerKg);
    setEditTargetMarket(lot.targetMarket || GRADE_TIERS_CONFIG[tier].targetMarket);
    setEditNotes(lot.notes || '');
  };

  const handleSelectEditGradeTier = (tier: WarehouseGradeTier, basePurchasePrice: number) => {
    setEditGradeTier(tier);
    const cfg = GRADE_TIERS_CONFIG[tier];
    setEditDefectCount(cfg.defaultDefect);
    setEditScreenSize(cfg.defaultScreen);
    setEditVerifiedScaScore(cfg.defaultSca);
    setEditTargetMarket(cfg.targetMarket);
    const calculatedPrice =
      Math.round((basePurchasePrice * (1 + cfg.markupPercent / 100)) / 1000) * 1000;
    setEditSellingPricePerKg(calculatedPrice);
  };

  const handleSaveEditGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLotForGrading) return;

    updateWarehouseLotGrading(editingLotForGrading.id, {
      gradeTier: editGradeTier,
      defectCount: Number(editDefectCount),
      screenSize: editScreenSize,
      verifiedScaScore: Number(editVerifiedScaScore),
      pricePerKg: Number(editSellingPricePerKg),
      targetMarket: editTargetMarket,
      notes: editNotes,
    });

    setSuccessMsg(
      `Klasifikasi & Harga Jual Lot ${editingLotForGrading.id} berhasil diperbarui menjadi ${editGradeTier} (Rp ${Number(editSellingPricePerKg).toLocaleString()}/kg)!`
    );
    setEditingLotForGrading(null);
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  // Filtered Inventory
  const filteredInventoryLots = myWarehouseLots.filter((lot) => {
    const matchGrade = gradeFilter === 'all' || lot.gradeTier === gradeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      lot.id.toLowerCase().includes(q) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.origin.toLowerCase().includes(q) ||
      lot.storageLocation.toLowerCase().includes(q);
    return matchGrade && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner (Cruip Blue / Indigo Gradient) */}
      <div className="bg-linear-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-blue-900/60">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30 backdrop-blur-xs">
            <Warehouse className="w-4 h-4 text-blue-400" />
            <span>Warehouse & QA Tier 3 • Silo Klimatik & Sertifikasi Mutu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Grading Green Bean & Manajemen Silo Ekspor
          </h1>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
            Pusat inspeksi fisik green bean, sortir defect standar SCA & SNI, pengujian ukuran ayakan screen size, serta penyimpanan klimatik hermetik (suhu & kelembaban terjaga).
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-stone-300 pt-1">
            <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-blue-400" />
              Suhu Rata-rata Silo: <strong className="text-white">20.4°C (Optimal)</strong>
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              Kelembaban RH: <strong className="text-emerald-300">54% (Aman Jamur)</strong>
            </span>
          </div>
        </div>

        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
          <Warehouse className="w-48 h-48" />
        </div>
      </div>

      {/* 4 Cruip-Style Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Stok Tersimpan"
          value={`${availableStoredKg.toLocaleString()} kg`}
          subtitle={`Dari ${totalStoredKg} kg kapasitas`}
          icon={<Box className="w-5 h-5 text-blue-600" />}
          color="blue"
          badge="Silo Aktif"
        />

        <MetricCard
          title="Grade 1: Super Premium"
          value={`${superPremiumKg.toLocaleString()} kg`}
          subtitle="Margin tertinggi (+32%)"
          icon={<Crown className="w-5 h-5 text-amber-600" />}
          color="amber"
          trend={{ value: 'SCA ≥ 85.0', isPositive: true }}
        />

        <MetricCard
          title="Grade 2: Premium Grade"
          value={`${premiumKg.toLocaleString()} kg`}
          subtitle="Margin stabil (+24%)"
          icon={<Award className="w-5 h-5 text-purple-600" />}
          color="purple"
          trend={{ value: 'SCA 83-84.75', isPositive: true }}
        />

        <MetricCard
          title="Grade 3 & 4: Komersial"
          value={`${commercialKg.toLocaleString()} kg`}
          subtitle="Volume & Industri"
          icon={<Layers className="w-5 h-5 text-stone-700" />}
          color="stone"
          badge="House Blend"
        />
      </div>

      {/* Cruip Styled Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'inventory'
              ? 'bg-stone-900 text-white shadow-xs font-black'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Box className="w-4 h-4 text-blue-400" />
          <span>Inventaris Silo & Penilaian Grade</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300">
            {myWarehouseLots.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'marketplace'
              ? 'bg-stone-900 text-white shadow-xs font-black'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Beli Green Bean Pengolah</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700">
            {availableGreenBeans.length} Lot
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
          <span>Log Transaksi Gudang</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700">
            {myWarehouseTransactions.length}
          </span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-300 text-blue-950 text-xs font-bold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-700" />
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

      {/* TAB 1: INVENTARIS STOK GUDANG & GRADING MUTU */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Toolbar Search & Grade Filter */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ID lot, varietas, lokasi silo, atau daerah asal..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-stone-400 font-bold px-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Grade:
              </span>
              <button
                onClick={() => setGradeFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  gradeFilter === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Semua ({myWarehouseLots.length})
              </button>
              <button
                onClick={() => setGradeFilter('Grade 1 - Super Premium')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  gradeFilter === 'Grade 1 - Super Premium'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Crown className="w-3 h-3 text-amber-800" />
                Super Premium ({myWarehouseLots.filter((l) => l.gradeTier === 'Grade 1 - Super Premium').length})
              </button>
              <button
                onClick={() => setGradeFilter('Grade 2 - Premium Grade')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  gradeFilter === 'Grade 2 - Premium Grade'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
                }`}
              >
                <Award className="w-3 h-3 text-purple-800" />
                Premium ({myWarehouseLots.filter((l) => l.gradeTier === 'Grade 2 - Premium Grade').length})
              </button>
              <button
                onClick={() => setGradeFilter('Grade 3 - Medium Commercial')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  gradeFilter === 'Grade 3 - Medium Commercial'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-blue-800" />
                Medium ({myWarehouseLots.filter((l) => l.gradeTier === 'Grade 3 - Medium Commercial').length})
              </button>
            </div>
          </div>

          {/* Inventory Lots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInventoryLots.map((wh) => {
              const cfg = GRADE_TIERS_CONFIG[wh.gradeTier || 'Grade 1 - Super Premium'];
              const TierIcon = cfg.icon;
              const marginRp = wh.pricePerKg - (wh.purchasePricePerKg || wh.pricePerKg * 0.8);
              const marginPercent = Math.round(
                (marginRp / (wh.purchasePricePerKg || wh.pricePerKg * 0.8)) * 100
              );

              return (
                <div
                  key={wh.id}
                  className={`bg-white rounded-2xl border ${cfg.borderColor} overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between`}
                >
                  <div>
                    {/* Header */}
                    <div className={`p-4 ${cfg.lightBg} border-b ${cfg.borderColor} space-y-2`}>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-stone-800 bg-white/90 px-2.5 py-0.5 rounded-md border border-stone-200">
                          {wh.id}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-black bg-stone-900 text-white px-2.5 py-0.5 rounded-lg shadow-xs">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          SCA: {wh.verifiedScaScore}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder} shadow-2xs`}
                        >
                          <TierIcon className="w-3.5 h-3.5" />
                          {wh.gradeTier || 'Grade 1 - Super Premium'}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-stone-900">{wh.variety}</h3>
                        <p className="text-xs text-stone-600">
                          {wh.origin} ({wh.altitude}) • {wh.processMethod}
                        </p>
                      </div>
                    </div>

                    {/* Specs & Target Market */}
                    <div className="p-4 space-y-3">
                      <div className="text-[11px] bg-stone-100 text-stone-700 p-2.5 rounded-xl border border-stone-200/80">
                        <span className="font-bold text-stone-900 block mb-0.5">
                          🎯 Rekomendasi Target Pasar:
                        </span>
                        <span>{wh.targetMarket || cfg.targetMarket}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                        <div>
                          <span className="text-[10px] text-stone-400 block font-semibold">
                            Cacat (Defect):
                          </span>
                          <strong className="text-stone-800">
                            {wh.defectCount ?? cfg.defaultDefect} defect/350g
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-semibold">
                            Ukuran Ayakan:
                          </span>
                          <strong className="text-stone-800 truncate block">
                            {wh.screenSize || cfg.defaultScreen}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-semibold">
                            Lokasi Silo:
                          </span>
                          <strong className="text-stone-800 truncate block">{wh.storageLocation}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-semibold">
                            Suhu & RH:
                          </span>
                          <strong className="text-blue-700 font-mono">
                            {wh.temperatureCelsius}°C / {wh.humidityPercent}% RH
                          </strong>
                        </div>
                      </div>

                      <div className="text-[11px] text-stone-500 space-y-0.5 border-t border-stone-100 pt-2">
                        <div>Petani Asal: <strong>{wh.sourceFarmerName}</strong></div>
                        <div>Stasiun Olah: <strong>{wh.sourceProcessorName}</strong></div>
                        <div>Kemasan: <strong>{wh.packagingType}</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Margins & Actions */}
                  <div className="p-4 bg-stone-50 border-t border-stone-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Modal Beli:</span>
                        <span className="text-xs font-semibold text-stone-600">
                          Rp {(wh.purchasePricePerKg || Math.round(wh.pricePerKg * 0.8)).toLocaleString()}/kg
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block">Harga Jual ke Roaster:</span>
                        <span className="text-sm font-black text-stone-900">
                          Rp {wh.pricePerKg.toLocaleString()}
                          <span className="text-xs font-normal text-stone-500"> / kg</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                      <span className="text-emerald-800 font-semibold flex items-center gap-1">
                        <BadgePercent className="w-3.5 h-3.5" /> Margin Laba:
                      </span>
                      <strong className="text-emerald-950 font-mono">
                        +Rp {marginRp.toLocaleString()} / kg (+{marginPercent}%)
                      </strong>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-stone-500">
                        Stok: <strong>{wh.availableWeightKg}</strong> / {wh.weightKg} kg
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setBarcodeModalLot(wh)}
                          className="px-2.5 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                          title="Cetak Barcode Karung Gudang"
                        >
                          <QrCode className="w-3.5 h-3.5 text-stone-700" />
                          <span className="hidden sm:inline">Barcode</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditGrading(wh)}
                          className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                          Re-Grading
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MARKETPLACE BELI GREEN BEAN PENGOLAH */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Pilih Green Bean dari Stasiun Pengolah untuk Dilakukan Grading & Simpan
              </h2>
              <p className="text-xs text-stone-500">
                Beli green bean hasil sortasi stasiun mill, klasifikasikan grade, dan tentukan harga jual kembali.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableGreenBeans.map((gb) => (
              <div
                key={gb.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
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
                    <div className="absolute top-3 right-3 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                      {gb.processMethod}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                        Pengolah: {gb.processorName}
                      </span>
                      <h3 className="font-bold text-base text-stone-900 mt-1">
                        {gb.variety} ({gb.grade})
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
                        <span className="text-[10px] text-stone-400 block font-semibold">Defect:</span>
                        <span className="font-bold text-stone-800">{gb.defectCount} defect/350g</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block font-semibold">Ayakan Screen:</span>
                        <span className="font-bold text-stone-800 truncate block">{gb.screenSize}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Harga Modal Beli:</span>
                    <span className="text-sm font-black text-stone-900">
                      Rp {gb.pricePerKg.toLocaleString()}
                      <span className="text-xs font-normal text-stone-500"> / kg</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenStorageModal(gb)}
                    className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Beli & Grading
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LOG TRANSAKSI */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Log Transaksi Pergudangan
          </h2>
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
                {myWarehouseTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-800">{trx.id}</td>
                    <td className="py-3 px-4 text-stone-600">{trx.date}</td>
                    <td className="py-3 px-4 font-semibold text-stone-900">{trx.fromName}</td>
                    <td className="py-3 px-4 font-semibold text-stone-900">{trx.toName}</td>
                    <td className="py-3 px-4 text-stone-700">{trx.itemName}</td>
                    <td className="py-3 px-4 font-bold text-blue-800">{trx.quantity}</td>
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
        </div>
      )}

      {/* Modal Beli & Grading Silo */}
      {selectedGreenBeanToBuy && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-linear-to-r from-blue-950 to-stone-900 text-white p-6 relative">
              <button
                onClick={() => setSelectedGreenBeanToBuy(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <Sliders className="w-3.5 h-3.5" />
                Workstation QC Grading & Penyimpanan Silo
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Grading Lot: {selectedGreenBeanToBuy.variety} ({selectedGreenBeanToBuy.sourceOrigin})
              </h2>
            </div>

            <form onSubmit={handleConfirmStore} className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
              {/* Pembelian */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-blue-900 uppercase">1. Kuantitas Pembelian</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Volume Beli (kg) - Maks: {selectedGreenBeanToBuy.availableWeightKg} kg
                    </label>
                    <input
                      type="number"
                      required
                      min="10"
                      max={selectedGreenBeanToBuy.availableWeightKg}
                      value={boughtKg}
                      onChange={(e) => setBoughtKg(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-stone-500">Biaya Pengadaan Modal:</span>
                    <strong className="text-base font-black text-blue-900">
                      Rp {(boughtKg * selectedGreenBeanToBuy.pricePerKg).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Grading Tier Selection */}
              <div>
                <h3 className="font-bold text-stone-800 uppercase mb-3">2. Klasifikasi Grade Mutu</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(GRADE_TIERS_CONFIG) as WarehouseGradeTier[]).map((tierKey) => {
                    const cfg = GRADE_TIERS_CONFIG[tierKey];
                    const isSelected = gradeTier === tierKey;
                    return (
                      <div
                        key={tierKey}
                        onClick={() => handleSelectGradeTier(tierKey, selectedGreenBeanToBuy.pricePerKg)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? `${cfg.borderColor} ${cfg.lightBg} ring-2 ${cfg.activeRing}`
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-stone-900 font-bold">{cfg.shortLabel}</strong>
                          <span className="font-bold text-emerald-700 font-mono">+{cfg.markupPercent}% Margin</span>
                        </div>
                        <p className="text-[11px] text-stone-500 leading-tight">{cfg.targetMarket}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Harga Jual ke Roaster */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <label className="block text-emerald-950 font-bold uppercase mb-1">
                  3. Penetapan Harga Jual ke Roaster per kg (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={sellingPricePerKg}
                  onChange={(e) => setSellingPricePerKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 text-sm font-black bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedGreenBeanToBuy(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold"
                >
                  Simpan & Terbitkan ke Silo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Re-Grading */}
      {editingLotForGrading && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-blue-900 to-stone-900 text-white p-5 relative">
              <button
                onClick={() => setEditingLotForGrading(null)}
                className="absolute top-4 right-4 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-black text-lg">Re-Grading & Penyesuaian Harga Jual</h3>
              <p className="text-xs text-stone-300">Lot: {editingLotForGrading.id} ({editingLotForGrading.variety})</p>
            </div>

            <form onSubmit={handleSaveEditGrading} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Klasifikasi Grade</label>
                <select
                  value={editGradeTier}
                  onChange={(e) =>
                    handleSelectEditGradeTier(
                      e.target.value as WarehouseGradeTier,
                      editingLotForGrading.purchasePricePerKg || 120000
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                >
                  {(Object.keys(GRADE_TIERS_CONFIG) as WarehouseGradeTier[]).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Harga Jual per kg (Rp)</label>
                <input
                  type="number"
                  required
                  value={editSellingPricePerKg}
                  onChange={(e) => setEditSellingPricePerKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-black"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLotForGrading(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold"
                >
                  Simpan Re-Grading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Modal */}
      <WarehouseBarcodeModal
        isOpen={!!barcodeModalLot}
        onClose={() => setBarcodeModalLot(null)}
        lot={barcodeModalLot}
        isNewGrading={false}
      />
    </div>
  );
};
