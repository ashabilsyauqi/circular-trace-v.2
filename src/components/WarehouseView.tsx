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
  ArrowRight,
  Receipt,
} from 'lucide-react';
import { ProcessedGreenBeanLot, WarehouseLot, WarehouseGradeTier } from '../types/coffee';
import { WarehouseBarcodeModal } from './WarehouseBarcodeModal';
import { MetricCard } from './admin/MetricCard';
import { RecordBreadcrumb } from './shared/RecordBreadcrumb';
import { StatusPipeline, PipelineStage } from './shared/StatusPipeline';
import { StatButton } from './shared/StatButton';
import { ActivityFeed } from './shared/ActivityFeed';
import { ControlPanel } from './shared/ControlPanel';
import { Scale, DollarSign, Percent, FileText, Check, Tag } from 'lucide-react';

const WAREHOUSE_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'inbound', label: 'Penerimaan Inbound' },
  { id: 'qc_lab', label: 'Lab SCA & Defect' },
  { id: 'grading', label: 'Penetapan Grade' },
  { id: 'silo_storage', label: 'Silo Hermetik' },
  { id: 'siap_jual', label: 'Siap Jual' },
  { id: 'terjual', label: 'Terjual' },
];

const getWarehouseStage = (lot: WarehouseLot) => {
  if (lot.availableWeightKg === 0) return 'terjual';
  return 'siap_jual';
};

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
    badgeBg: 'bg-stone-200',
    badgeText: 'text-stone-900',
    badgeBorder: 'border-stone-300',
    borderColor: 'border-stone-400',
    activeRing: 'ring-stone-500',
    lightBg: 'bg-stone-100',
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
    warehouseActiveTab,
    setWarehouseActiveTab,
  } = useCoffee();

  const activeTab = warehouseActiveTab || 'inventory';
  const setActiveTab = setWarehouseActiveTab;
  const [selectedGreenBeanToBuy, setSelectedGreenBeanToBuy] = useState<ProcessedGreenBeanLot | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | WarehouseGradeTier>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'cards'>('table');

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

  // Health Certificate state (Inbound Buy: 1. Number of Health Certificate, 2. No Health Certificate)
  const [hasHealthCertificate, setHasHealthCertificate] = useState<boolean>(true);
  const [healthCertificateNumber, setHealthCertificateNumber] = useState<string>('HC-EXP-2026-08819');

  // Re-Grading Modal State
  const [editingLotForGrading, setEditingLotForGrading] = useState<WarehouseLot | null>(null);
  const [editGradeTier, setEditGradeTier] = useState<WarehouseGradeTier>('Grade 1 - Super Premium');
  const [editDefectCount, setEditDefectCount] = useState<number>(2);
  const [editScreenSize, setEditScreenSize] = useState<string>('Screen 18+');
  const [editVerifiedScaScore, setEditVerifiedScaScore] = useState<number>(87.0);
  const [editSellingPricePerKg, setEditSellingPricePerKg] = useState<number>(165000);
  const [editTargetMarket, setEditTargetMarket] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editHasHealthCert, setEditHasHealthCert] = useState<boolean>(false);
  const [editHealthCertNumber, setEditHealthCertNumber] = useState<string>('');
  const [barcodeModalLot, setBarcodeModalLot] = useState<WarehouseLot | null>(null);
  const [detailLot, setDetailLot] = useState<WarehouseLot | null>(null);

  // Data lot & transactions
  const availableGreenBeans = processedLots.filter((lot) => lot.availableWeightKg > 0);
  const myWarehouseLots = warehouseLots.filter(
    (lot) => !lot.warehouseId || lot.warehouseId === currentUser?.id
  );

  const myWarehouseTransactions = transactions.filter(
    (t) =>
      t.fromName === currentUser?.name ||
      t.toName === currentUser?.name ||
      t.fromName === (currentUser?.organization || currentUser?.name) ||
      t.toName === (currentUser?.organization || currentUser?.name)
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
    setHasHealthCertificate(true);
    setHealthCertificateNumber(`HC-EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
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
      hasHealthCertificate,
      healthCertificateNumber: hasHealthCertificate ? healthCertificateNumber : undefined,
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
    setEditHasHealthCert(lot.hasHealthCertificate ?? false);
    setEditHealthCertNumber(lot.healthCertificateNumber || `HC-EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
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
      hasHealthCertificate: editHasHealthCert,
      healthCertificateNumber: editHasHealthCert ? editHealthCertNumber : undefined,
    });

    setSuccessMsg(
      `Klasifikasi & Data Lot ${editingLotForGrading.id} berhasil diperbarui!`
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
      {!detailLot && (
      <>
      {/* Top Banner (Circular Coffee Warm Roast Gradient) */}
      <div className="bg-gradient-to-r from-[#18110D] via-[#291B13] to-[#1F140E] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-[#382419]">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-semibold mb-3 border border-amber-400/30 backdrop-blur-xs">
            <Warehouse className="w-4 h-4 text-amber-300" />
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
              <Thermometer className="w-3.5 h-3.5 text-amber-300" />
              Suhu Rata-rata Silo: <strong className="text-white">20.4°C (Optimal)</strong>
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-emerald-300" />
              Kelembaban RH: <strong className="text-emerald-300">54% (Aman Jamur)</strong>
            </span>
          </div>
        </div>

        <div className="absolute right-4 -bottom-6 opacity-10 text-amber-500 pointer-events-none">
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
          {/* Enterprise Control Panel */}
          <ControlPanel
            breadcrumbs={[{ label: 'Inventaris Silo & Mutu Gudang' }]}
            primaryActionLabel="+ Beli Green Bean"
            onPrimaryAction={() => setActiveTab('marketplace')}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={gradeFilter}
            onFilterChange={(f) => setGradeFilter(f as any)}
            filterOptions={[
              { id: 'all', label: 'Semua Grade' },
              { id: 'Grade 1 - Super Premium', label: 'Grade 1: Super Premium' },
              { id: 'Grade 2 - Premium Grade', label: 'Grade 2: Premium Grade' },
              { id: 'Grade 3 - Medium Commercial', label: 'Grade 3: Medium Commercial' },
              { id: 'Grade 4 - Basic Commercial', label: 'Grade 4: Basic Commercial' },
            ]}
            viewMode={viewMode === 'cards' ? 'table' : viewMode}
            onViewModeChange={(m) => setViewMode(m as any)}
            recordCount={filteredInventoryLots.length}
          />

          {/* VIEW 1: CARDS GRID VIEW */}
          {viewMode === 'cards' && (
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
                    onClick={() => setDetailLot(wh)}
                    className={`bg-white rounded-2xl border ${cfg.borderColor} overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer`}
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

                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder} shadow-2xs`}
                          >
                            <TierIcon className="w-3.5 h-3.5" />
                            {wh.gradeTier || 'Grade 1 - Super Premium'}
                          </span>
                          {wh.hasHealthCertificate ? (
                            <span
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
                              title={`Nomor HC: ${wh.healthCertificateNumber || 'Tersertifikasi'}`}
                            >
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              HC: {wh.healthCertificateNumber ? wh.healthCertificateNumber.split('-').slice(-1)[0] : 'Aktif'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200">
                              No HC
                            </span>
                          )}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setBarcodeModalLot(wh);
                            }}
                            className="px-2.5 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                            title="Cetak Barcode Karung Gudang"
                          >
                            <QrCode className="w-3.5 h-3.5 text-stone-700" />
                            <span className="hidden sm:inline">Barcode</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditGrading(wh);
                            }}
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
          )}

          {/* VIEW 2: TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">ID Lot Silo</th>
                      <th className="py-3.5 px-4">Varietas & Daerah Asal</th>
                      <th className="py-3.5 px-4">Klasifikasi Grade</th>
                      <th className="py-3.5 px-4">Health Certificate</th>
                      <th className="py-3.5 px-4">Skor SCA</th>
                      <th className="py-3.5 px-4">Defect / Screen</th>
                      <th className="py-3.5 px-4">Lokasi Silo</th>
                      <th className="py-3.5 px-4">Stok Tersedia</th>
                      <th className="py-3.5 px-4">Harga Jual / Kg</th>
                      <th className="py-3.5 px-4 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredInventoryLots.map((wh) => {
                      const cfg = GRADE_TIERS_CONFIG[wh.gradeTier || 'Grade 1 - Super Premium'];
                      const TierIcon = cfg.icon;
                      return (
                        <tr
                          key={wh.id}
                          onClick={() => setDetailLot(wh)}
                          className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-4 font-mono font-bold text-stone-900">
                            {wh.id}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900">{wh.variety}</div>
                            <div className="text-[11px] text-stone-500">{wh.origin} • {wh.processMethod}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}>
                              <TierIcon className="w-3 h-3" />
                              {cfg.shortLabel}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {wh.hasHealthCertificate ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  HC Certified
                                </span>
                                <div className="text-[10px] font-mono text-stone-500 mt-0.5">
                                  {wh.healthCertificateNumber || 'HC-EXP'}
                                </div>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-stone-500 bg-stone-100 border border-stone-200">
                                No HC
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              {wh.verifiedScaScore}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-stone-700 font-medium">
                            <div>{wh.defectCount ?? cfg.defaultDefect} defect</div>
                            <div className="text-[10px] text-stone-400">{wh.screenSize || cfg.defaultScreen}</div>
                          </td>
                          <td className="py-3 px-4 text-stone-700">
                            <div className="font-semibold">{wh.storageLocation}</div>
                            <div className="text-[10px] text-blue-600 font-mono">{wh.temperatureCelsius}°C • {wh.humidityPercent}% RH</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-stone-900">{wh.availableWeightKg}</span>
                            <span className="text-stone-400 text-[11px]"> / {wh.weightKg} kg</span>
                          </td>
                          <td className="py-3 px-4 font-bold text-stone-900">
                            Rp {wh.pricePerKg.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBarcodeModalLot(wh);
                                }}
                                className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-blue-100 text-stone-700 hover:text-blue-800 text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                              >
                                <QrCode className="w-3 h-3" />
                                Barcode
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditGrading(wh);
                                }}
                                className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" />
                                Re-Grade
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
          )}

          {/* VIEW 3: KANBAN VIEW */}
          {viewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Column 1: Grade 1 Super Premium */}
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-600" />
                    <h4 className="font-bold text-xs text-amber-950 uppercase tracking-wider">
                      Grade 1 - Super Premium
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                    {filteredInventoryLots.filter((l) => l.gradeTier === 'Grade 1 - Super Premium').length} Lot
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredInventoryLots
                    .filter((l) => l.gradeTier === 'Grade 1 - Super Premium')
                    .map((wh) => (
                      <div
                        key={wh.id}
                        onClick={() => setDetailLot(wh)}
                        className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-stone-900">{wh.id}</span>
                          <span className="font-black text-amber-700">SCA {wh.verifiedScaScore}</span>
                        </div>
                        <h5 className="font-bold text-sm text-stone-900 leading-tight">{wh.variety}</h5>
                        <div className="flex items-center justify-between text-[11px] gap-2">
                          <p className="text-stone-500 truncate">{wh.origin} • {wh.storageLocation}</p>
                          {wh.hasHealthCertificate ? (
                            <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              HC
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded">
                              No HC
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                          <span className="font-bold text-stone-700">{wh.availableWeightKg} kg</span>
                          <span className="font-black text-stone-900">Rp {wh.pricePerKg.toLocaleString()}/kg</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Column 2: Grade 2 Premium Grade */}
              <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-200/80 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-purple-200">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <h4 className="font-bold text-xs text-purple-950 uppercase tracking-wider">
                      Grade 2 - Premium Grade
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 bg-purple-100 text-purple-900 rounded-full">
                    {filteredInventoryLots.filter((l) => l.gradeTier === 'Grade 2 - Premium Grade').length} Lot
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredInventoryLots
                    .filter((l) => l.gradeTier === 'Grade 2 - Premium Grade')
                    .map((wh) => (
                      <div
                        key={wh.id}
                        onClick={() => setDetailLot(wh)}
                        className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs hover:shadow-md hover:border-purple-400 transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-stone-900">{wh.id}</span>
                          <span className="font-black text-purple-700">SCA {wh.verifiedScaScore}</span>
                        </div>
                        <h5 className="font-bold text-sm text-stone-900 leading-tight">{wh.variety}</h5>
                        <div className="flex items-center justify-between text-[11px] gap-2">
                          <p className="text-stone-500 truncate">{wh.origin} • {wh.storageLocation}</p>
                          {wh.hasHealthCertificate ? (
                            <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              HC
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded">
                              No HC
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                          <span className="font-bold text-stone-700">{wh.availableWeightKg} kg</span>
                          <span className="font-black text-stone-900">Rp {wh.pricePerKg.toLocaleString()}/kg</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Column 3: Grade 3 & 4 Commercial */}
              <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-200/80 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-xs text-blue-950 uppercase tracking-wider">
                      Grade 3 & 4 Komersial
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded-full">
                    {filteredInventoryLots.filter((l) => l.gradeTier === 'Grade 3 - Medium Commercial' || l.gradeTier === 'Grade 4 - Basic Commercial').length} Lot
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredInventoryLots
                    .filter((l) => l.gradeTier === 'Grade 3 - Medium Commercial' || l.gradeTier === 'Grade 4 - Basic Commercial')
                    .map((wh) => (
                      <div
                        key={wh.id}
                        onClick={() => setDetailLot(wh)}
                        className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-stone-900">{wh.id}</span>
                          <span className="font-black text-blue-700">SCA {wh.verifiedScaScore}</span>
                        </div>
                        <h5 className="font-bold text-sm text-stone-900 leading-tight">{wh.variety}</h5>
                        <div className="flex items-center justify-between text-[11px] gap-2">
                          <p className="text-stone-500 truncate">{wh.origin} • {wh.storageLocation}</p>
                          {wh.hasHealthCertificate ? (
                            <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              HC
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded">
                              No HC
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                          <span className="font-bold text-stone-700">{wh.availableWeightKg} kg</span>
                          <span className="font-black text-stone-900">Rp {wh.pricePerKg.toLocaleString()}/kg</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
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
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              Log Transaksi Pergudangan
            </h2>
            <div className="text-right bg-blue-50 border border-blue-200 rounded-2xl px-4 py-2">
              <span className="text-[10px] font-bold uppercase text-blue-700 block">Total Nilai Tercatat</span>
              <span className="text-lg font-black text-blue-900 font-mono">
                Rp {myWarehouseTransactions.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}
              </span>
            </div>
          </div>

          {myWarehouseTransactions.length === 0 ? (
            <div className="py-14 text-center">
              <Receipt className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500">Belum ada log transaksi pergudangan.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {myWarehouseTransactions.map((trx) => (
                <div
                  key={trx.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl border border-stone-200/90 bg-stone-50/60 hover:bg-blue-50/50 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 sm:w-2/5">
                    <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0">
                      <Receipt className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 truncate">
                        <span className="truncate">{trx.fromName}</span>
                        <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">{trx.toName}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        {trx.itemName} • {trx.date} • <span className="font-mono">{trx.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:flex-1">
                    <div className="text-xs">
                      <span className="text-stone-400">Volume: </span>
                      <span className="font-bold text-blue-800">{trx.quantity}</span>
                    </div>
                    <div className="text-sm font-black text-stone-900 font-mono">
                      Rp {trx.totalAmount.toLocaleString()}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold whitespace-nowrap">
                      {trx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </>
      )}

      {/* WAREHOUSE LOT DETAIL PAGE */}
      {detailLot && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <RecordBreadcrumb
            listLabel="Inventaris Silo & Penilaian Grade"
            recordLabel={detailLot.id}
            onBack={() => setDetailLot(null)}
          />

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            {/* Top Header with Icon, ID, Badges, and StatusPipeline */}
            <div className="bg-[#FAF7F2] px-6 py-5 border-b border-stone-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
                  <Warehouse className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-stone-900 font-mono">{detailLot.id}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                      {detailLot.gradeTier}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {detailLot.origin} — <strong>{detailLot.variety}</strong> • Tanggal Simpan Silo: {detailLot.storedDate}
                  </p>
                </div>
              </div>

              {/* Real Supply Chain Pipeline */}
              <StatusPipeline
                stages={WAREHOUSE_PIPELINE_STAGES}
                currentStageId={getWarehouseStage(detailLot)}
              />
            </div>

            {/* Smart Metric Stat Buttons Row */}
            <div className="px-6 py-4 bg-white border-b border-stone-100 flex flex-wrap gap-2.5">
              <StatButton
                icon={<Scale className="w-4 h-4" />}
                value={`${detailLot.availableWeightKg} / ${detailLot.weightKg} kg`}
                label="Stok Tersisa di Silo"
                color="blue"
              />
              <StatButton
                icon={<DollarSign className="w-4 h-4" />}
                value={`Rp ${detailLot.pricePerKg.toLocaleString()}`}
                label="Harga Jual ke Roaster / Kg"
                color="amber"
              />
              <StatButton
                icon={<Award className="w-4 h-4" />}
                value={detailLot.verifiedScaScore}
                label="Skor SCA Terverifikasi"
                color="purple"
              />
              <StatButton
                icon={<Crown className="w-4 h-4" />}
                value={detailLot.gradeTier.split(' - ')[0]}
                label="Klasifikasi Mutu"
                color="emerald"
              />
              <StatButton
                icon={<Percent className="w-4 h-4" />}
                value={`+Rp ${(detailLot.pricePerKg - (detailLot.purchasePricePerKg || Math.round(detailLot.pricePerKg * 0.8))).toLocaleString()} / kg`}
                label="Margin Keuntungan Gudang"
                color="stone"
              />
            </div>

            {/* Specifications & Activity Feed */}
            <div className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Spesifikasi Fisik & Mutu Cupping */}
                <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Spesifikasi Fisik & Mutu Cupping
                  </h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Origin / Varietas</dt>
                      <dd className="font-bold text-stone-900">{detailLot.origin} • {detailLot.variety}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Metode Pengolahan</dt>
                      <dd className="font-bold text-stone-900">{detailLot.processMethod}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Hasil Uji Cacat (Defect)</dt>
                      <dd className="font-bold text-stone-900">{detailLot.defectCount} defect / 350g</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Ukuran Ayakan (Screen Size)</dt>
                      <dd className="font-bold text-stone-900">{detailLot.screenSize}</dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-stone-500">Rekomendasi Target Pasar</dt>
                      <dd className="font-bold text-stone-900 text-right">{detailLot.targetMarket}</dd>
                    </div>
                  </dl>
                </div>

                {/* Column 2: Parameter Silo Klimatik & Silsilah Asal */}
                <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-blue-600" /> Parameter Silo Klimatik & Asal
                  </h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Lokasi Silo / Pallet</dt>
                      <dd className="font-bold text-stone-900">{detailLot.storageLocation}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Suhu & Kelembaban (RH)</dt>
                      <dd className="font-bold text-blue-700 font-mono">
                        {detailLot.temperatureCelsius}°C • {detailLot.humidityPercent}% RH
                      </dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Petani / Stasiun Asal</dt>
                      <dd className="font-bold text-stone-900 text-right">
                        {detailLot.sourceFarmerName} • {detailLot.sourceProcessorName}
                      </dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Kemasan Penyimpanan</dt>
                      <dd className="font-bold text-stone-900 text-right">{detailLot.packagingType}</dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-stone-500">Catatan QA Inspeksi</dt>
                      <dd className="font-medium text-stone-800 text-right">{detailLot.notes || '—'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Health Certificate Section in Lot Detail */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  detailLot.hasHealthCertificate
                    ? 'bg-emerald-50/80 border-emerald-200'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      detailLot.hasHealthCertificate
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold tracking-wider text-stone-600">
                        Dokumen Karantina / Ekspor
                      </span>
                      {detailLot.hasHealthCertificate ? (
                        <span className="text-[10px] font-black uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          Health Certificate Valid
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full">
                          Tanpa Sertifikat (No HC)
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      {detailLot.hasHealthCertificate ? (
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="text-stone-600">Nomor Sertifikat Kesehatan:</span>
                          <code className="font-mono text-xs font-bold text-emerald-950 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                            {detailLot.healthCertificateNumber || 'HC-EXP-2026-DEFAULT'}
                          </code>
                        </div>
                      ) : (
                        <p className="text-xs text-stone-500">
                          Lot penyimpanan ini didaftarkan dengan status <strong>No Health Certificate</strong> (Penjualan domestik reguler).
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-stone-500 sm:text-right shrink-0">
                  <span className="block text-[10px] uppercase font-semibold text-stone-400">Kepatuhan Ekspor</span>
                  <strong className="text-stone-800">
                    {detailLot.hasHealthCertificate ? 'Standar Ekspor Internasional' : 'Distribusi Pasar Lokal'}
                  </strong>
                </div>
              </div>

              {/* Dynamic Action Buttons Bar */}
              <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-blue-700" />
                  <span className="text-xs font-bold text-blue-950">
                    Aksi Lembar Dokumen Lot Silo #{detailLot.id}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditGrading(detailLot)}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4" />
                    🛠️ Re-Grading & Penyesuaian Harga
                  </button>
                  <button
                    type="button"
                    onClick={() => setBarcodeModalLot(detailLot)}
                    className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4 text-stone-700" />
                    🏷️ Cetak Barcode Karung Silo
                  </button>
                </div>
              </div>

              {/* Activity Feed & Internal Chatter */}
              <div className="pt-2 border-t border-stone-200">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" /> Log Aktivitas QA & Silo Gudang
                </h4>
                <ActivityFeed
                  documentTitle={`Lot Silo #${detailLot.id}`}
                  initialMessages={[
                    {
                      id: 'm1',
                      author: detailLot.warehouseName,
                      type: 'system',
                      content: `Lot inbound diterima dari stasiun pengolah ${detailLot.sourceProcessorName} sebanyak ${detailLot.weightKg} kg. Disimpan pada ${detailLot.storageLocation}.`,
                      timestamp: detailLot.storedDate,
                    },
                    {
                      id: 'm2',
                      author: 'QA & Cupping Lab',
                      type: 'note',
                      content: `Uji fisik & cupping selesai: Skor SCA ${detailLot.verifiedScaScore}, ${detailLot.defectCount} defect/350g, ukuran ${detailLot.screenSize}. Diklasifikasikan sebagai ${detailLot.gradeTier}.`,
                      timestamp: detailLot.storedDate,
                    },
                    {
                      id: 'm3',
                      author: 'Silo Climate Monitor',
                      type: 'system',
                      content: `Sensor klimatik mencatat suhu stabil ${detailLot.temperatureCelsius}°C dan kelembaban ${detailLot.humidityPercent}% RH dalam kemasan ${detailLot.packagingType}. Lot siap didistribusikan ke roastery.`,
                      timestamp: detailLot.storedDate,
                    },
                  ]}
                />
              </div>
            </div>
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

              {/* 4. Sertifikat Kesehatan Karantina / Ekspor (Health Certificate) */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 uppercase">
                    4. Sertifikat Kesehatan Karantina / Ekspor (Health Certificate)
                  </h3>
                  <span className="text-[11px] font-semibold text-stone-500">
                    Pilihan Karantina Gudang
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Pilih status kelengkapan dokumen karantina / ekspor untuk lot penyimpanan ini:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Number of Health Certificate */}
                  <div
                    onClick={() => setHasHealthCertificate(true)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      hasHealthCertificate
                        ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-200'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        id="inbound-hc-yes"
                        name="inbound-health-cert"
                        checked={hasHealthCertificate}
                        onChange={() => setHasHealthCertificate(true)}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor="inbound-hc-yes" className="cursor-pointer">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <strong className="text-stone-900 font-bold text-xs">
                            1. Number of Health Certificate
                          </strong>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-1">
                          Pakai Sertifikat Kesehatan resmi (Karantina Pertanian & Ekspor Internasional).
                        </p>
                      </label>
                    </div>

                    {hasHealthCertificate && (
                      <div className="mt-3 pt-2.5 border-t border-emerald-200">
                        <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                          Nomor Health Certificate (Karantina):
                        </label>
                        <input
                          type="text"
                          required={hasHealthCertificate}
                          value={healthCertificateNumber}
                          onChange={(e) => setHealthCertificateNumber(e.target.value)}
                          placeholder="Contoh: HC-EXP-2026-08819"
                          className="w-full px-3 py-2 rounded-lg border border-emerald-300 text-xs font-mono font-bold bg-white text-stone-900 focus:outline-emerald-600"
                        />
                      </div>
                    )}
                  </div>

                  {/* Option 2: No Health Certificate */}
                  <div
                    onClick={() => setHasHealthCertificate(false)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      !hasHealthCertificate
                        ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-300'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        id="inbound-hc-no"
                        name="inbound-health-cert"
                        checked={!hasHealthCertificate}
                        onChange={() => setHasHealthCertificate(false)}
                        className="mt-0.5 text-stone-600 focus:ring-stone-400"
                      />
                      <label htmlFor="inbound-hc-no" className="cursor-pointer">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center text-[10px] font-bold">
                            ✕
                          </span>
                          <strong className="text-stone-900 font-bold text-xs">
                            2. No Health Certificate
                          </strong>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-1">
                          Tanpa Sertifikat Kesehatan (Penjualan domestik reguler / non-karantina).
                        </p>
                      </label>
                    </div>

                    {!hasHealthCertificate && (
                      <div className="mt-3 pt-2 border-t border-stone-200 text-[10px] text-stone-500 italic">
                        Lot ini akan disimpan tanpa dokumen Health Certificate.
                      </div>
                    )}
                  </div>
                </div>
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

              {/* Sertifikat Kesehatan Karantina / Ekspor (Health Certificate) */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <label className="block font-bold text-stone-700 uppercase">
                  Sertifikat Kesehatan Karantina / Ekspor (Health Certificate)
                </label>
                <div className="space-y-2">
                  <div
                    onClick={() => setEditHasHealthCert(true)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      editHasHealthCert
                        ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-300'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="edit-health-cert"
                        checked={editHasHealthCert}
                        onChange={() => setEditHasHealthCert(true)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <strong className="text-stone-900 text-xs">1. Number of Health Certificate</strong>
                      </div>
                    </label>

                    {editHasHealthCert && (
                      <div className="mt-2.5 pl-6">
                        <label className="block text-[10px] font-bold text-stone-600 mb-1">
                          Nomor Health Certificate:
                        </label>
                        <input
                          type="text"
                          required={editHasHealthCert}
                          value={editHealthCertNumber}
                          onChange={(e) => setEditHealthCertNumber(e.target.value)}
                          placeholder="Contoh: HC-EXP-2026-08819"
                          className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 text-xs font-mono font-bold bg-white text-stone-900"
                        />
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => setEditHasHealthCert(false)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      !editHasHealthCert
                        ? 'border-stone-400 bg-stone-100 ring-1 ring-stone-300'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="edit-health-cert"
                        checked={!editHasHealthCert}
                        onChange={() => setEditHasHealthCert(false)}
                        className="text-stone-600 focus:ring-stone-400"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center text-[9px] font-bold">
                          ✕
                        </span>
                        <strong className="text-stone-900 text-xs">2. No Health Certificate</strong>
                      </div>
                    </label>
                  </div>
                </div>
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
