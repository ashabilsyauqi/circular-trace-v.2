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
} from 'lucide-react';
import { ProcessedGreenBeanLot, WarehouseLot, WarehouseGradeTier } from '../types/coffee';
import { WarehouseBarcodeModal } from './WarehouseBarcodeModal';

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
    markupPercent: number; // Pengaruh persentase margin keuntungan terhadap harga jual
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

  const [activeTab, setActiveTab] = useState<'marketplace' | 'inventory' | 'history'>('marketplace');
  const [selectedGreenBeanToBuy, setSelectedGreenBeanToBuy] = useState<ProcessedGreenBeanLot | null>(null);

  // Filter grade di inventaris gudang
  const [gradeFilter, setGradeFilter] = useState<'all' | WarehouseGradeTier>('all');

  // Form state for warehouse storage, grading & dynamic pricing
  const [boughtKg, setBoughtKg] = useState<number>(100);
  const [storageLocation, setStorageLocation] = useState('Silo A-03 (Pallet Kayu Pine #14)');
  const [temperatureCelsius, setTemperatureCelsius] = useState<number>(20.4);
  const [humidityPercent, setHumidityPercent] = useState<number>(55);
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

  // Re-Grading Modal State for existing inventory
  const [editingLotForGrading, setEditingLotForGrading] = useState<WarehouseLot | null>(null);
  const [editGradeTier, setEditGradeTier] = useState<WarehouseGradeTier>('Grade 1 - Super Premium');
  const [editDefectCount, setEditDefectCount] = useState<number>(2);
  const [editScreenSize, setEditScreenSize] = useState<string>('Screen 18+');
  const [editVerifiedScaScore, setEditVerifiedScaScore] = useState<number>(87.0);
  const [editSellingPricePerKg, setEditSellingPricePerKg] = useState<number>(165000);
  const [editTargetMarket, setEditTargetMarket] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [barcodeModalLot, setBarcodeModalLot] = useState<WarehouseLot | null>(null);

  // Available green bean lots from processors
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

  // Grade breakdowns for metrics
  const superPremiumKg = myWarehouseLots
    .filter((l) => l.gradeTier === 'Grade 1 - Super Premium')
    .reduce((acc, curr) => acc + curr.availableWeightKg, 0);


  const commercialAndBasicKg = myWarehouseLots
    .filter(
      (l) =>
        l.gradeTier === 'Grade 3 - Medium Commercial' || l.gradeTier === 'Grade 4 - Basic Commercial'
    )
    .reduce((acc, curr) => acc + curr.availableWeightKg, 0);

  // Handle select Grade Tier when buying/storing
  const handleSelectGradeTier = (tier: WarehouseGradeTier, basePrice: number) => {
    setGradeTier(tier);
    const cfg = GRADE_TIERS_CONFIG[tier];
    setDefectCount(cfg.defaultDefect);
    setScreenSize(cfg.defaultScreen);
    setVerifiedScaScore(cfg.defaultSca);
    setTargetMarket(cfg.targetMarket);
    // Dynamic price calculation: base purchase price * (1 + markup%)
    const calculatedPrice = Math.round((basePrice * (1 + cfg.markupPercent / 100)) / 1000) * 1000;
    setSellingPricePerKg(calculatedPrice);
  };

  // Open modal for storing and grading
  const handleOpenStorageModal = (lot: ProcessedGreenBeanLot) => {
    setSelectedGreenBeanToBuy(lot);
    const defaultBuy = Math.min(lot.availableWeightKg, 120);
    setBoughtKg(defaultBuy);
    // Initial grading: auto-detect from processor grade or default to Grade 1
    const initialTier: WarehouseGradeTier =
      lot.grade === 'Specialty Grade 1' ? 'Grade 1 - Super Premium' : 'Grade 2 - Premium Grade';
    handleSelectGradeTier(initialTier, lot.pricePerKg);
  };

  // Confirm store and grading
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

  // Open Re-Grading Modal for existing lot
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

  // Handle select Grade Tier during Re-Grading
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

  // Save Re-Grading
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

  // Filtered inventory lots
  const filteredInventoryLots = myWarehouseLots.filter((lot) => {
    if (gradeFilter === 'all') return true;
    return lot.gradeTier === gradeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <Warehouse className="w-4 h-4 text-blue-400" />
            Dasbor Pergudangan Kopi • Klasifikasi Mutu & Manajemen Stok
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Grading Green Bean: Dari Premium hingga Basic
          </h1>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
            Fokus utama stasiun gudang adalah melakukan inspeksi fisik, sortir cacat (defect count), uji ayakan biji (screen size), dan klasifikasi grade (Grade 1 Super Premium s/d Grade 4 Basic) yang secara langsung menentukan kelayakan harga jual kembali ke roastery.
          </p>
        </div>

        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
          <Warehouse className="w-48 h-48" />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Stok di Pengolah</span>
            <ShoppingCart className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {availableGreenBeans.reduce((a, b) => a + b.availableWeightKg, 0).toLocaleString()} kg
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Bisa dibeli untuk grading</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Total Stok Gudang</span>
            <Box className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{availableStoredKg.toLocaleString()} kg</div>
          <span className="text-[11px] text-blue-600 font-medium">Dari {totalStoredKg} kg tersimpan</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/70 bg-amber-50/30 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 text-xs mb-1">
            <span className="font-bold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-600" /> Super Premium
            </span>
            <span className="text-[10px] bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-mono">
              Grade 1
            </span>
          </div>
          <div className="text-2xl font-black text-amber-950">{superPremiumKg.toLocaleString()} kg</div>
          <span className="text-[11px] text-amber-700 font-medium">Margin tertinggi (+32%)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-600 text-xs mb-1">
            <span className="font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-stone-600" /> Commercial & Basic
            </span>
            <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-700 font-mono">
              Grade 3-4
            </span>
          </div>
          <div className="text-2xl font-black text-stone-900">
            {commercialAndBasicKg.toLocaleString()} kg
          </div>
          <span className="text-[11px] text-stone-500 font-medium">Komersial & volume massal</span>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-blue-100 border border-blue-300 text-blue-950 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-700" />
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'marketplace'
              ? 'border-blue-600 text-blue-900 bg-blue-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Beli Green Bean Pengolah ({availableGreenBeans.length} Lot)
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'inventory'
              ? 'border-blue-600 text-blue-900 bg-blue-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Box className="w-4 h-4" />
          Inventaris Stok Gudang & Penilaian Grade ({myWarehouseLots.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-900 bg-blue-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <History className="w-4 h-4" />
          Log Transaksi Pergudangan ({myWarehouseTransactions.length})
        </button>
      </div>

      {/* Tab 1: Marketplace Green Bean Pengolah */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Pilih Green Bean dari Pengolah untuk Dilakukan Grading
              </h2>
              <p className="text-xs text-stone-500">
                Beli green bean dari stasiun pengolah, tentukan klasifikasi grade (Premium s/d Basic), dan tetapkan harga jual kembali ke roastery.
              </p>
            </div>
          </div>

          {availableGreenBeans.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
              <Sparkles className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">
                Belum ada green bean yang siap dibeli dari stasiun pengolah
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Silakan ganti peran ke akun Pengolah untuk memproses ceri menjadi green bean.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableGreenBeans.map((gb) => (
                <div
                  key={gb.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-stone-100">
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
                        <div className="text-[11px] text-emerald-800 font-medium mt-1">
                          Petani Asal: {gb.sourceFarmerName} ({gb.sourceFarmerLotId})
                        </div>
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
                          <span className="text-[11px] text-stone-400 block">Ukuran Ayakan:</span>
                          <span className="font-semibold text-stone-800 truncate block">{gb.screenSize}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {gb.cuppingNotes.map((note, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 text-stone-800 border border-stone-200"
                          >
                            {note}
                          </span>
                        ))}
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
                      className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      Beli & Grading
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Inventaris Stok Gudang & Penilaian Grade */}
      {activeTab === 'inventory' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Inventaris Stok Gudang & Klasifikasi Mutu ({myWarehouseLots.length})
              </h2>
              <p className="text-xs text-stone-500">
                Stok green bean diklasifikasikan dari Super Premium hingga Basic Commercial yang mempengaruhi margin dan harga jual ke roaster.
              </p>
            </div>

            {/* Filter Tabs by Grade */}
            <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-xs">
              <span className="text-stone-400 text-[11px] font-bold px-2 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter Grade:
              </span>
              <button
                onClick={() => setGradeFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  gradeFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua ({myWarehouseLots.length})
              </button>
              <button
                onClick={() => setGradeFilter('Grade 1 - Super Premium')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  gradeFilter === 'Grade 1 - Super Premium'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-amber-900'
                }`}
              >
                <Crown className="w-3 h-3 text-amber-800" />
                Super Premium (
                {myWarehouseLots.filter((l) => l.gradeTier === 'Grade 1 - Super Premium').length})
              </button>
              <button
                onClick={() => setGradeFilter('Grade 2 - Premium Grade')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  gradeFilter === 'Grade 2 - Premium Grade'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-purple-900'
                }`}
              >
                <Award className="w-3 h-3" />
                Premium (
                {myWarehouseLots.filter((l) => l.gradeTier === 'Grade 2 - Premium Grade').length})
              </button>
              <button
                onClick={() => setGradeFilter('Grade 3 - Medium Commercial')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  gradeFilter === 'Grade 3 - Medium Commercial'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-blue-900'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                Medium (
                {myWarehouseLots.filter((l) => l.gradeTier === 'Grade 3 - Medium Commercial').length})
              </button>
              <button
                onClick={() => setGradeFilter('Grade 4 - Basic Commercial')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  gradeFilter === 'Grade 4 - Basic Commercial'
                    ? 'bg-stone-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3 h-3" />
                Basic (
                {myWarehouseLots.filter((l) => l.gradeTier === 'Grade 4 - Basic Commercial').length})
              </button>
            </div>
          </div>

          {filteredInventoryLots.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
              <Box className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">
                Tidak ada lot stok untuk kategori grade ini
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Silakan pilih filter grade lain atau beli green bean baru untuk dilakukan grading.
              </p>
            </div>
          ) : (
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
                    className={`bg-white rounded-2xl border ${cfg.borderColor} overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between`}
                  >
                    <div>
                      {/* Card Header with Grade Banner */}
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
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder} shadow-xs`}
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

                      {/* Physical Specs & Grading Details */}
                      <div className="p-4 space-y-3">
                        {/* Target Market Pill */}
                        <div className="text-[11px] bg-stone-100 text-stone-700 p-2 rounded-xl border border-stone-200/80">
                          <span className="font-bold text-stone-900 block mb-0.5">
                            🎯 Rekomendasi Penggunaan / Pasar:
                          </span>
                          <span>{wh.targetMarket || cfg.targetMarket}</span>
                        </div>

                        {/* Grading Specs Matrix */}
                        <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">
                              Sortasi Cacat (Defect):
                            </span>
                            <strong className="text-stone-800">
                              {wh.defectCount ?? cfg.defaultDefect} defect/350g
                            </strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">
                              Ukuran Biji:
                            </span>
                            <strong className="text-stone-800 truncate block">
                              {wh.screenSize || cfg.defaultScreen}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">
                              Lokasi Rak / Silo:
                            </span>
                            <strong className="text-stone-800 truncate block">{wh.storageLocation}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">
                              Suhu / RH Silo:
                            </span>
                            <strong className="text-blue-700">
                              {wh.temperatureCelsius}°C / {wh.humidityPercent}% RH
                            </strong>
                          </div>
                        </div>

                        <div className="text-[11px] text-stone-500 space-y-0.5 border-t border-stone-100 pt-2">
                          <div>Petani Asal: <strong>{wh.sourceFarmerName}</strong></div>
                          <div>Pengolah: <strong>{wh.sourceProcessorName}</strong></div>
                          <div>Kemasan: <strong>{wh.packagingType}</strong></div>
                        </div>

                        {wh.notes && (
                          <p className="text-[11px] text-stone-600 italic line-clamp-2">
                            "{wh.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Financial Comparison & Actions */}
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

                      {/* Margin Badge */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                        <span className="text-emerald-800 font-semibold flex items-center gap-1">
                          <BadgePercent className="w-3.5 h-3.5" /> Margin Laba:
                        </span>
                        <strong className="text-emerald-950">
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
                            title="Lihat & Cetak Barcode Karung Gudang"
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
                            Re-Grading & Ubah Harga
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Log Transaksi Pergudangan */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Log Transaksi Gudang Logistik
          </h2>

          {myWarehouseTransactions.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">
              Belum ada log transaksi masuk atau keluar gudang.
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
                  {myWarehouseTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-stone-50/50">
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
          )}
        </div>
      )}

      {/* Modal: Beli, Simpan di Gudang & Penilaian Grading */}
      {selectedGreenBeanToBuy && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-blue-950 via-stone-900 to-indigo-950 text-white p-6 relative">
              <button
                onClick={() => setSelectedGreenBeanToBuy(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <Sliders className="w-3.5 h-3.5" />
                Prosedur Masuk Gudang & Evaluasi Grading Mutu
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Beli & Grading: {selectedGreenBeanToBuy.variety} ({selectedGreenBeanToBuy.processMethod})
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                Stasiun Pengolah: {selectedGreenBeanToBuy.processorName} • Petani Asal: {selectedGreenBeanToBuy.sourceFarmerName}
              </p>
            </div>

            <form onSubmit={handleConfirmStore} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Bagian 1: Pembelian dari Pengolah */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> 1. Transaksi Pembelian Green Bean dari Pengolah
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Volume Beli (kg) - Maks: {selectedGreenBeanToBuy.availableWeightKg} kg
                    </label>
                    <input
                      type="number"
                      required
                      min="10"
                      max={selectedGreenBeanToBuy.availableWeightKg}
                      value={boughtKg}
                      onChange={(e) => setBoughtKg(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white font-bold"
                    />
                  </div>
                  <div className="flex flex-col justify-center bg-white p-3 rounded-xl border border-blue-200">
                    <span className="text-xs text-stone-500">Total Biaya Modal Beli:</span>
                    <span className="text-lg font-black text-blue-950">
                      Rp {(boughtKg * selectedGreenBeanToBuy.pricePerKg).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      (Rp {selectedGreenBeanToBuy.pricePerKg.toLocaleString()}/kg)
                    </span>
                  </div>
                </div>
              </div>

              {/* Bagian 2: Evaluasi Mutu & Grading Standar Gudang (FOKUS UTAMA) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-600" /> 2. Klasifikasi Grade Mutu Biji (Fokus Gudang)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Pilih kategori grade mutu yang sesuai. Grading ini secara otomatis merekomendasikan harga jual kembali ke roaster.
                    </p>
                  </div>
                </div>

                {/* 4 Grade Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(Object.keys(GRADE_TIERS_CONFIG) as WarehouseGradeTier[]).map((tierKey) => {
                    const cfg = GRADE_TIERS_CONFIG[tierKey];
                    const TierIcon = cfg.icon;
                    const isSelected = gradeTier === tierKey;
                    const estPrice = Math.round(
                      (selectedGreenBeanToBuy.pricePerKg * (1 + cfg.markupPercent / 100)) / 1000
                    ) * 1000;

                    return (
                      <button
                        key={tierKey}
                        type="button"
                        onClick={() => handleSelectGradeTier(tierKey, selectedGreenBeanToBuy.pricePerKg)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? `${cfg.borderColor} ${cfg.lightBg} shadow-md ring-2 ${cfg.activeRing}`
                            : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center ${cfg.badgeBg} ${cfg.badgeText}`}
                            >
                              <TierIcon className="w-4 h-4" />
                            </span>
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? `${cfg.badgeBg} ${cfg.badgeText}`
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              +{cfg.markupPercent}%
                            </span>
                          </div>

                          <h4 className="font-black text-xs text-stone-900 leading-snug">
                            {cfg.shortLabel}
                          </h4>
                          <span className="text-[10px] text-stone-500 block mt-0.5">
                            {cfg.scaRange}
                          </span>
                          <span className="text-[10px] text-stone-600 block mt-1">
                            {cfg.defectRange}
                          </span>
                        </div>

                        <div className="mt-3 pt-2 border-t border-stone-200/70">
                          <span className="text-[9px] text-stone-400 uppercase font-bold block">
                            Rekomendasi Jual:
                          </span>
                          <span className="text-xs font-black text-stone-900">
                            Rp {estPrice.toLocaleString()}/kg
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Live Grading Inspection Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Jumlah Cacat (Defect / 350g)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={defectCount}
                      onChange={(e) => setDefectCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <span className="text-[10px] text-stone-500">Standar SCA / SNI</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Ukuran Ayakan (Screen Size)
                    </label>
                    <input
                      type="text"
                      required
                      value={screenSize}
                      onChange={(e) => setScreenSize(e.target.value)}
                      placeholder="Contoh: Screen 18+ (Super)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <span className="text-[10px] text-stone-500">Ukuran lubang ayakan</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Verifikasi Cupping Score (SCA)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      required
                      value={verifiedScaScore}
                      onChange={(e) => setVerifiedScaScore(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white font-bold"
                    />
                    <span className="text-[10px] text-stone-500">Skor sensori cupping</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Target Segmen Pembeli
                    </label>
                    <input
                      type="text"
                      required
                      value={targetMarket}
                      onChange={(e) => setTargetMarket(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <span className="text-[10px] text-stone-500">Pasar sasaran roastery</span>
                  </div>
                </div>

                {/* Dynamic Price & Profit Margin Engine */}
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300/80 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-700" /> Pengaruh Grading ke Harga Jual & Margin
                    </span>
                    <span className="text-xs text-emerald-800 font-semibold">
                      Klasifikasi: <strong>{gradeTier}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="bg-white p-3.5 rounded-xl border border-emerald-200">
                      <span className="text-[11px] text-stone-500 block">Harga Modal Beli:</span>
                      <span className="text-base font-black text-stone-800">
                        Rp {selectedGreenBeanToBuy.pricePerKg.toLocaleString()} / kg
                      </span>
                      <span className="text-[10px] text-stone-400">Dari stasiun pengolah</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-800 mb-1">
                        Harga Jual ke Roaster per kg (Rp)
                      </label>
                      <input
                        type="number"
                        required
                        step="1000"
                        value={sellingPricePerKg}
                        onChange={(e) => setSellingPricePerKg(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-400 text-base font-black text-emerald-950 focus:ring-2 focus:ring-emerald-500 bg-white shadow-xs"
                      />
                      <span className="text-[10px] text-stone-500">Dapat disesuaikan secara fleksibel</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-emerald-200">
                      <span className="text-[11px] text-emerald-800 font-semibold block">
                        Keuntungan Bersih Gudang:
                      </span>
                      <span className="text-base font-black text-emerald-700">
                        +Rp {(sellingPricePerKg - selectedGreenBeanToBuy.pricePerKg).toLocaleString()} / kg
                      </span>
                      <span className="text-[10px] text-emerald-800 block mt-0.5">
                        ROI Margin: +
                        {(
                          ((sellingPricePerKg - selectedGreenBeanToBuy.pricePerKg) /
                            selectedGreenBeanToBuy.pricePerKg) *
                          100
                        ).toFixed(1)}
                        % | Total Laba: Rp{' '}
                        {(
                          (sellingPricePerKg - selectedGreenBeanToBuy.pricePerKg) *
                          boughtKg
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian 3: Parameter Fasilitas Gudang & Kemasan */}
              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Warehouse className="w-4 h-4 text-blue-600" /> 3. Fasilitas Penyimpanan & Kemasan Hermetik
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Lokasi Silo / Rak Pallet
                    </label>
                    <input
                      type="text"
                      required
                      value={storageLocation}
                      onChange={(e) => setStorageLocation(e.target.value)}
                      placeholder="Contoh: Silo A-03 Pallet Kayu Pine #14"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Jenis Kemasan Hermetik
                    </label>
                    <select
                      value={packagingType}
                      onChange={(e) =>
                        setPackagingType(e.target.value as WarehouseLot['packagingType'])
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="GrainPro + Karung Goni 60kg">GrainPro Hermetic + Karung Goni 60kg</option>
                      <option value="Vacuum Bag 30kg">Vacuum Sealed Bag 30kg</option>
                      <option value="Ecotact Hermetic 50kg">Ecotact Multi-Layer Hermetic 50kg</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Kontrol Iklim (Suhu / RH)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={temperatureCelsius}
                        onChange={(e) => setTemperatureCelsius(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-blue-500"
                        placeholder="°C"
                      />
                      <input
                        type="number"
                        required
                        value={humidityPercent}
                        onChange={(e) => setHumidityPercent(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-blue-500"
                        placeholder="% RH"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Catatan Inspeksi Grading & QA Gudang
                </label>
                <textarea
                  rows={2}
                  value={gradingNotes}
                  onChange={(e) => setGradingNotes(e.target.value)}
                  placeholder="Catatan hasil sortir fisik, densitas biji, keseragaman ayakan..."
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedGreenBeanToBuy(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Konfirmasi Masuk Gudang & Buka Penjualan ({gradeTier})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Re-Grading & Penyesuaian Harga Lot yang Ada */}
      {editingLotForGrading && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-stone-900 via-blue-950 to-stone-900 text-white p-6 relative">
              <button
                onClick={() => setEditingLotForGrading(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <Edit3 className="w-3.5 h-3.5" />
                Penilaian Ulang Mutu (Re-Grading) & Penyesuaian Harga
              </div>
              <h2 className="text-xl font-black">
                Re-Grading: {editingLotForGrading.id} ({editingLotForGrading.variety})
              </h2>
              <p className="text-xs text-stone-300 mt-0.5">
                Ubah klasifikasi grade berdasarkan uji sortir lanjutan, uji cupping ulang, atau penyesuaian strategi harga jual ke roaster.
              </p>
            </div>

            <form onSubmit={handleSaveEditGrading} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Pilih Klasifikasi Grade Baru:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {(Object.keys(GRADE_TIERS_CONFIG) as WarehouseGradeTier[]).map((tierKey) => {
                    const cfg = GRADE_TIERS_CONFIG[tierKey];
                    const TierIcon = cfg.icon;
                    const isSelected = editGradeTier === tierKey;
                    const purchasePrice =
                      editingLotForGrading.purchasePricePerKg ||
                      Math.round(editingLotForGrading.pricePerKg * 0.8);
                    const suggestedPrice =
                      Math.round((purchasePrice * (1 + cfg.markupPercent / 100)) / 1000) * 1000;

                    return (
                      <button
                        key={tierKey}
                        type="button"
                        onClick={() => handleSelectEditGradeTier(tierKey, purchasePrice)}
                        className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? `${cfg.borderColor} ${cfg.lightBg} shadow-sm ring-2 ${cfg.activeRing}`
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <TierIcon className="w-4 h-4 text-stone-800" />
                            <span className="text-[10px] font-mono font-bold text-stone-600">
                              +{cfg.markupPercent}%
                            </span>
                          </div>
                          <span className="font-bold text-xs text-stone-900 block">
                            {cfg.shortLabel}
                          </span>
                          <span className="text-[10px] text-stone-500 block">{cfg.scaRange}</span>
                        </div>
                        <span className="text-[10px] font-black text-stone-800 mt-2 block border-t border-stone-200/80 pt-1">
                          Rp {suggestedPrice.toLocaleString()}/kg
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Defect (Cacat / 350g)
                  </label>
                  <input
                    type="number"
                    required
                    value={editDefectCount}
                    onChange={(e) => setEditDefectCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Ukuran Biji (Screen Size)
                  </label>
                  <input
                    type="text"
                    required
                    value={editScreenSize}
                    onChange={(e) => setEditScreenSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Verifikasi Skor SCA
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    required
                    value={editVerifiedScaScore}
                    onChange={(e) => setEditVerifiedScaScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-bold"
                  />
                </div>
              </div>

              {/* Price adjustment */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-700" /> Penyesuaian Harga Jual ke Roaster
                  </span>
                  <span className="text-xs text-stone-600">
                    Modal: Rp{' '}
                    {(
                      editingLotForGrading.purchasePricePerKg ||
                      Math.round(editingLotForGrading.pricePerKg * 0.8)
                    ).toLocaleString()}
                    /kg
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Harga Jual Baru per kg (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      step="1000"
                      value={editSellingPricePerKg}
                      onChange={(e) => setEditSellingPricePerKg(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-400 text-base font-black text-emerald-950 bg-white"
                    />
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs">
                    <span className="text-stone-500 block">Margin Laba Baru:</span>
                    <span className="text-base font-black text-emerald-700">
                      +Rp{' '}
                      {(
                        editSellingPricePerKg -
                        (editingLotForGrading.purchasePricePerKg ||
                          Math.round(editingLotForGrading.pricePerKg * 0.8))
                      ).toLocaleString()}{' '}
                      / kg
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Target Pasar & Rekomendasi Roastery
                </label>
                <input
                  type="text"
                  required
                  value={editTargetMarket}
                  onChange={(e) => setEditTargetMarket(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Catatan Tambahan Re-Grading
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Catatan inspeksi ulang mutu..."
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingLotForGrading(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simpan Re-Grading & Perbarui Harga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Barcode Karung Gudang */}
      <WarehouseBarcodeModal
        isOpen={Boolean(barcodeModalLot)}
        onClose={() => setBarcodeModalLot(null)}
        lot={barcodeModalLot}
        isNewGrading={false}
      />
    </div>
  );
};
