import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { FarmerHarvestLot } from '../../types/coffee';
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  QrCode,
  Store,
  ArrowRight,
  Printer,
  CheckCircle2,
  Trash2,
  Edit2,
  TrendingUp,
  Scale,
  Sparkles,
  Droplets,
  Calendar,
  DollarSign,
  Users,
  TreePine,
  Check,
  X,
  AlertCircle,
  Flame,
  Cog,
  Eye,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
} from 'lucide-react';
import { FarmerBarcodeModal } from '../FarmerBarcodeModal';

export const MasterHasilPanenTab: React.FC = () => {
  const {
    users,
    coffeeFarms,
    farmerLots,
    addFarmerHarvest,
    updateFarmerHarvestLot,
    toggleReleaseHarvestLotToMarketplace,
    sendHarvestLotToProcessor,
  } = useCoffee();

  const allFarmers = users.filter((u) => u.role === 'petani' || u.assignedService === 'petani');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmerFilter, setSelectedFarmerFilter] = useState<string>('all');
  const [selectedStageFilter, setSelectedStageFilter] = useState<
    'all' | 'inventory' | 'released' | 'processor'
  >('all');

  // In-Page View State: 'list' (tabel & kartu), 'form' (halaman wizard catat panen), 'detail' (halaman lembar detail lot)
  const [currentView, setCurrentView] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedBarcodeLot, setSelectedBarcodeLot] = useState<FarmerHarvestLot | null>(null);
  const [selectedDetailLot, setSelectedDetailLot] = useState<FarmerHarvestLot | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // 3-Step Wizard for Add Harvest Form
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(
    allFarmers.length > 0 ? allFarmers[0].id : ''
  );
  const farmsOfSelectedFarmer = coffeeFarms.filter((f) => f.farmerId === selectedFarmerId);
  const [selectedFarmId, setSelectedFarmId] = useState<string>(
    farmsOfSelectedFarmer.length > 0 ? farmsOfSelectedFarmer[0].id : ''
  );
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalWeightKg, setTotalWeightKg] = useState<number>(500);
  const [brix, setBrix] = useState<number>(22.0);
  const [pickingMethod, setPickingMethod] = useState<FarmerHarvestLot['pickingMethod']>(
    'Petik Merah Optimal (95%+)'
  );
  const [pricePerKg, setPricePerKg] = useState<number>(15000);
  const [distributionTarget, setDistributionTarget] = useState<'marketplace' | 'inventory'>('marketplace');
  const [notes, setNotes] = useState('');

  // When farmer changes in form, auto-reset selected farm
  const handleFarmerChange = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    const relatedFarms = coffeeFarms.filter((f) => f.farmerId === farmerId);
    setSelectedFarmId(relatedFarms.length > 0 ? relatedFarms[0].id : '');
  };

  const handleOpenAddHarvestPage = () => {
    const initialFarmer = allFarmers.length > 0 ? allFarmers[0].id : '';
    setSelectedFarmerId(initialFarmer);
    const related = coffeeFarms.filter((f) => f.farmerId === initialFarmer);
    setSelectedFarmId(related.length > 0 ? related[0].id : '');
    setHarvestDate(new Date().toISOString().split('T')[0]);
    setTotalWeightKg(500);
    setBrix(22.0);
    setPickingMethod('Petik Merah Optimal (95%+)');
    setPricePerKg(15000);
    setDistributionTarget('marketplace');
    setNotes('');
    setFormError(null);
    setWizardStep(1);
    setCurrentView('form');
  };

  const handleSaveHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalWeightKg <= 0) {
      setFormError('Berat panen ceri harus lebih dari 0 kg.');
      return;
    }

    const chosenFarmer = allFarmers.find((u) => u.id === selectedFarmerId);
    const chosenFarm = coffeeFarms.find((f) => f.id === selectedFarmId);

    // Opsi hanya ada 2: Rilis Langsung ke Marketplace atau Keep ke Gudang Petani (Inventory)
    const isReleased = distributionTarget === 'marketplace';

    const created = addFarmerHarvest({
      farmerId: chosenFarmer?.id || selectedFarmerId,
      farmerName: chosenFarmer?.name || 'Petani Anggota',
      farmId: chosenFarm?.id || undefined,
      farmName: chosenFarm?.farmName || 'Kebun Kopi Anggota',
      farmLocation: chosenFarm?.location || chosenFarmer?.village || 'Pangalengan, Jawa Barat',
      altitude: chosenFarm?.altitudeDisplay || '1.550 mdpl',
      variety: chosenFarm ? chosenFarm.primaryVarieties.join(', ') : 'Sigarar Utang & Typica',
      harvestDate,
      totalWeightKg: Number(totalWeightKg),
      pricePerKg: Number(pricePerKg),
      pickingMethod,
      brix: Number(brix),
      notes: notes || 'Ceri petik merah segar hasil panen kelompok tani.',
      isReleasedToMarketplace: isReleased,
      marketplacePricePerKg: Number(pricePerKg),
      sentToProcessor: false,
      photoUrl: chosenFarm?.photoUrl,
    });

    if (created) {
      setCurrentView('list');
    }
  };

  // Filtered Harvest Lots by Search, Farmer, and Stage
  const filteredLots = farmerLots
    .filter((lot) => {
      if (selectedFarmerFilter === 'all') return true;
      return lot.farmerId === selectedFarmerFilter;
    })
    .filter((lot) => {
      if (selectedStageFilter === 'all') return true;
      if (selectedStageFilter === 'inventory') return !(lot.isReleasedToMarketplace ?? true) && !lot.sentToProcessor;
      if (selectedStageFilter === 'released') return (lot.isReleasedToMarketplace ?? true) && !lot.sentToProcessor;
      if (selectedStageFilter === 'processor') return lot.sentToProcessor === true;
      return true;
    })
    .filter((lot) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        lot.id.toLowerCase().includes(q) ||
        lot.farmerName.toLowerCase().includes(q) ||
        (lot.farmName && lot.farmName.toLowerCase().includes(q)) ||
        lot.variety.toLowerCase().includes(q) ||
        lot.farmLocation.toLowerCase().includes(q)
      );
    });

  const totalCherryHarvestKg = farmerLots.reduce((acc, l) => acc + (l.totalWeightKg || 0), 0);
  const totalCherryInventoryKg = farmerLots
    .filter((l) => !(l.isReleasedToMarketplace ?? true) && !l.sentToProcessor)
    .reduce((acc, l) => acc + (l.availableWeightKg || 0), 0);
  const totalCherryInventoryLots = farmerLots.filter(
    (l) => !(l.isReleasedToMarketplace ?? true) && !l.sentToProcessor
  ).length;
  const totalCherryReleased = farmerLots.filter(
    (l) => (l.isReleasedToMarketplace ?? true) && !l.sentToProcessor
  ).length;
  const totalCherryToProcessor = farmerLots.filter((l) => l.sentToProcessor === true).length;

  // =========================================================================
  // VIEW MODE 1: FORMULIR WIZARD DEDIKASI IN-PAGE (BUKAN POP-UP MODAL)
  // =========================================================================
  if (currentView === 'form') {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Breadcrumb & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('list')}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Lot Panen</span>
            </button>
            <div>
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <span>Pencatatan Hasil Panen Ceri Terpadu (3-Step Guided Wizard)</span>
              </h3>
              <p className="text-[11px] text-stone-500">
                Pilih Petani Pemilik &rarr; Pilih Kebun Terdaftar &rarr; Input Kuantitas, Mutu Brix &amp; Saluran Distribusi.
              </p>
            </div>
          </div>
        </div>

        {/* Dedicated AdminLTE Card Body */}
        <div className="bg-white rounded-lg border border-stone-200 border-t-4 border-t-emerald-600 shadow-sm overflow-hidden">
          {/* 3-Step Visual Progress Bar */}
          <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            {[
              { step: 1, title: '1. Petani Pemilik', desc: 'Pilih petani anggota pemanen' },
              { step: 2, title: '2. Lahan Kebun Asal', desc: 'Blok kebun terverifikasi EUDR' },
              { step: 3, title: '3. Mutu & Distribusi', desc: 'Timbang, Brix & Opsi Distribusi' },
            ].map((s) => (
              <div
                key={s.step}
                className={`flex items-center gap-3 text-xs font-bold ${
                  wizardStep === s.step
                    ? 'text-emerald-700'
                    : wizardStep > s.step
                    ? 'text-stone-700'
                    : 'text-stone-400'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    wizardStep === s.step
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : wizardStep > s.step
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {wizardStep > s.step ? '✓' : s.step}
                </span>
                <div className="hidden sm:block">
                  <span className="block">{s.title}</span>
                  <span className="text-[10px] text-stone-400 font-normal">{s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSaveHarvest} className="p-6 space-y-6 text-xs">
            {formError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* STEP 1: PILIH PETANI ANGGOTA */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div className="pb-2 border-b border-stone-100">
                  <h4 className="font-bold text-stone-900 text-sm">
                    Langkah 1: Tentukan Petani Pemilik Panen
                  </h4>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Pilih petani terdaftar dalam keanggotaan kelompok tani yang memanen ceri kopi.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {allFarmers.map((farmer) => {
                    const isSelected = selectedFarmerId === farmer.id;
                    const farmCount = coffeeFarms.filter((f) => f.farmerId === farmer.id).length;

                    return (
                      <div
                        key={farmer.id}
                        onClick={() => handleFarmerChange(farmer.id)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={farmer.avatar}
                            alt={farmer.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-stone-200"
                          />
                          <div>
                            <strong className="text-stone-900 font-bold block text-sm">
                              {farmer.name}
                            </strong>
                            <span className="text-[11px] text-stone-500 block">
                              NIK: {farmer.nik || '3204...'} &bull; {farmer.village || farmer.location}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-mono font-bold block mt-0.5">
                              {farmer.farmerCardNumber || farmer.id}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 block">
                            {farmCount} Blok Kebun
                          </span>
                          <span className="text-xs text-emerald-700 font-bold block mt-2">
                            {isSelected ? '✓ Terpilih' : 'Pilih'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-stone-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Lanjut Langkah 2: Pilih Kebun Milik Petani</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PILIH KEBUN MILIK PETANI */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <div className="pb-2 border-b border-stone-100">
                  <h4 className="font-bold text-stone-900 text-sm">
                    Langkah 2: Pilih Blok Lahan Kebun Asal Panen
                  </h4>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Menampilkan hanya kebun yang dimiliki oleh petani{' '}
                    <strong>{allFarmers.find((f) => f.id === selectedFarmerId)?.name}</strong>.
                  </p>
                </div>

                {farmsOfSelectedFarmer.length === 0 ? (
                  <div className="p-8 text-center bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-2">
                    <TreePine className="w-10 h-10 text-amber-600 mx-auto" />
                    <p className="font-bold text-sm">Belum ada blok kebun terdaftar untuk petani ini.</p>
                    <p className="text-xs text-amber-700 max-w-md mx-auto">
                      Silakan daftarkan lahan di menu "2. Data Master Kebun" terlebih dahulu agar dapat dicatat hasil panennya.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                    {farmsOfSelectedFarmer.map((farm) => {
                      const isSelected = selectedFarmId === farm.id;
                      return (
                        <div
                          key={farm.id}
                          onClick={() => setSelectedFarmId(farm.id)}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                            isSelected
                              ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                              <TreePine className="w-6 h-6 text-amber-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <strong className="text-stone-900 font-bold block text-sm truncate">
                                {farm.farmName}
                              </strong>
                              <span className="text-[11px] text-stone-500 block truncate">
                                {farm.location}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono">
                                  {farm.altitudeDisplay}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                                  EUDR Ready
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-[11px]">
                            <span className="text-stone-500 truncate">Varietas: {farm.primaryVarieties.join(', ')}</span>
                            <span className="text-xs text-amber-800 font-bold shrink-0">
                              {isSelected ? '✓ Terpilih' : 'Pilih Lahan Ini'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Kembali ke Pilih Petani</span>
                  </button>

                  <button
                    type="button"
                    disabled={farmsOfSelectedFarmer.length === 0}
                    onClick={() => setWizardStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Lanjut Langkah 3: Timbang &amp; Mutu</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: TIMBANG, MUTU BRIX & TEPAT 2 OPSI DISTRIBUSI */}
            {wizardStep === 3 && (
              <div className="space-y-5">
                <div className="pb-2 border-b border-stone-100">
                  <h4 className="font-bold text-stone-900 text-sm">
                    Langkah 3: Spesifikasi Kuantitas, Mutu &amp; Saluran Distribusi
                  </h4>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Masukkan data timbangan panen dan tentukan langsung apakah akan dirilis ke marketplace atau disimpan ke inventory petani.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Tanggal Panen Petik *
                    </label>
                    <input
                      type="date"
                      required
                      value={harvestDate}
                      onChange={(e) => setHarvestDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Total Berat Ceri Merah (Kg) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={totalWeightKg}
                      onChange={(e) => setTotalWeightKg(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 font-bold bg-white text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Kadar Kemanisan Brix (° Brix)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={brix}
                      onChange={(e) => setBrix(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 font-mono font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Harga Penjualan Ceri (Rp / Kg) *
                    </label>
                    <input
                      type="number"
                      step="500"
                      min={1000}
                      value={pricePerKg}
                      onChange={(e) => setPricePerKg(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 font-mono font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Metode Petik Ceri
                    </label>
                    <select
                      value={pickingMethod}
                      onChange={(e) => setPickingMethod(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 font-bold bg-white cursor-pointer"
                    >
                      <option value="Petik Merah Optimal (95%+)">Petik Merah Optimal (95%+)</option>
                      <option value="Petik Campur (80-90% Merah)">Petik Campur (80-90% Merah)</option>
                      <option value="Petik Selektif Specialty">Petik Selektif Specialty</option>
                    </select>
                  </div>
                </div>

                {/* Saluran Distribusi Pilihan - TEPAT 2 OPSI */}
                <div>
                  <label className="font-bold text-stone-800 block mb-2 text-xs">
                    Pilih Tujuan Distribusi Panen (Tepat 2 Pilihan):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Opsi 1: Rilis Langsung ke Marketplace */}
                    <div
                      onClick={() => setDistributionTarget('marketplace')}
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                        distributionTarget === 'marketplace'
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            <Store className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold text-stone-900">
                            Rilis Langsung ke Marketplace
                          </span>
                        </div>
                        {distributionTarget === 'marketplace' && (
                          <span className="text-[11px] bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full">
                            ✓ Terpilih
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Ceri kopi langsung tayang aktif di katalog marketplace publik dan siap dibeli pembeli / roastery.
                      </p>
                      <span className="text-[11px] text-emerald-700 font-black block mt-3">
                        Status: Live di Marketplace E-Commerce
                      </span>
                    </div>

                    {/* Opsi 2: Keep ke Gudang Petani (Inventory) */}
                    <div
                      onClick={() => setDistributionTarget('inventory')}
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                        distributionTarget === 'inventory'
                          ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                            <Package className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold text-stone-900">
                            Keep ke Gudang Petani (Inventory)
                          </span>
                        </div>
                        {distributionTarget === 'inventory' && (
                          <span className="text-[11px] bg-amber-600 text-white font-bold px-2.5 py-0.5 rounded-full">
                            ✓ Terpilih
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Disimpan di inventory internal petani/kelompok tani. Dapat di-klik kapan saja untuk langsung dirilis ke marketplace.
                      </p>
                      <span className="text-[11px] text-amber-800 font-black block mt-3">
                        Status: Keep di Inventory Internal
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Kembali ke Pilih Kebun</span>
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Lot Panen &amp; Terbitkan Barcode</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE 2: LEMBAR DETAIL LOT TRACEABILITY IN-PAGE
  // =========================================================================
  if (currentView === 'detail' && selectedDetailLot) {
    const lot = selectedDetailLot;
    const isReleased = lot.isReleasedToMarketplace ?? true;
    const isSentToProcessor = lot.sentToProcessor ?? false;

    const stages = [
      {
        id: 'harvest',
        number: '01',
        title: 'Petik & Timbang',
        subtitle: `${lot.totalWeightKg} kg Ceri Merah`,
        status: 'completed',
        date: lot.harvestDate,
      },
      {
        id: 'brix',
        number: '02',
        title: 'Uji Kematangan Brix',
        subtitle: `${lot.brix || 21.5}° Brix (Sangat Manis)`,
        status: 'completed',
        date: lot.harvestDate,
      },
      {
        id: 'barcode',
        number: '03',
        title: 'Label Barcode Karung',
        subtitle: `ID: ${lot.id}`,
        status: 'completed',
        date: 'QR Verifikasi Aktif',
      },
      {
        id: 'distribution',
        number: '04',
        title: 'Distribusi Ceri',
        subtitle: isSentToProcessor
          ? 'Diserahkan ke Wet Mill Pengolah'
          : isReleased
          ? 'Live di Marketplace Publik'
          : 'Keep di Gudang Petani (Inventory)',
        status: isSentToProcessor || isReleased ? 'completed' : 'current',
        badge: isSentToProcessor ? 'Wet Mill' : isReleased ? 'Marketplace' : 'Inventory',
      },
    ];

    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('list')}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Lot Panen</span>
            </button>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  {lot.id}
                </span>
                <span className="text-xs text-stone-500 font-medium">Lembar Detail Traceability Lot Panen</span>
              </div>
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <span>{lot.variety || 'Arabica Specialty'} • {lot.farmerName}</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedBarcodeLot(lot)}
              className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200"
            >
              <QrCode className="w-4 h-4" />
              <span>Cetak Barcode Karung</span>
            </button>
          </div>
        </div>

        {/* Dedicated AdminLTE Card Body */}
        <div className="bg-white rounded-lg border border-stone-200 border-t-4 border-t-emerald-600 shadow-sm p-6 space-y-6 text-xs">
          {/* 4-Stage Lifecycle Progress Tracker */}
          <div className="bg-stone-50 p-5 rounded-xl border border-stone-200">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Alur Tahapan Hidup Komoditas Ceri (Lifecycle Stage)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stages.map((st) => (
                <div
                  key={st.id}
                  className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono mb-1">
                      <span>STAGE {st.number}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <strong className="text-xs text-stone-900 block font-bold">
                      {st.title}
                    </strong>
                    <span className="text-[11px] text-stone-500 block mt-0.5 truncate">
                      {st.subtitle}
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-stone-100 text-[10px] text-emerald-700 font-bold flex items-center justify-between">
                    <span>{st.date || 'Selesai'}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Asal Usul & Kualitas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
              <h5 className="text-xs font-bold text-stone-800 uppercase flex items-center gap-1.5">
                <TreePine className="w-3.5 h-3.5 text-emerald-600" />
                <span>Asal Usul Lahan &amp; Petani</span>
              </h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Petani Pemilik:</span>
                  <strong className="text-stone-900">{lot.farmerName}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Blok Kebun:</span>
                  <strong className="text-stone-900">{lot.farmName || 'Plot Pangalengan'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Elevasi Ketinggian:</span>
                  <strong className="text-amber-800">{lot.altitude || '1.550 mdpl'}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Lokasi / Desa:</span>
                  <strong className="text-stone-900 truncate max-w-[220px]">{lot.farmLocation}</strong>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
              <h5 className="text-xs font-bold text-stone-800 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Karakteristik Kualitas Ceri</span>
              </h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Kadar Gula Alami:</span>
                  <span className="font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {lot.brix || 21.5}° Brix
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Metode Petik:</span>
                  <strong className="text-stone-900">{lot.pickingMethod || 'Petik Merah Optimal (95%+)'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Berat Total Panen:</span>
                  <strong className="text-emerald-700 font-bold">{lot.totalWeightKg.toLocaleString()} kg</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Harga Satuan Ceri:</span>
                  <strong className="text-stone-900">Rp {lot.pricePerKg.toLocaleString()} / kg</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Action Distribution Controls */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-black uppercase text-emerald-950 block">
                Eksekusi Distribusi Ceri Kelompok Tani
              </span>
              <p className="text-xs text-emerald-800 mt-0.5">
                Status saat ini:{' '}
                <strong>
                  {isSentToProcessor
                    ? 'Diserahkan ke Wet Mill'
                    : isReleased
                    ? 'Live di Marketplace E-Commerce'
                    : 'Keep di Gudang Petani (Inventory)'}
                </strong>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  toggleReleaseHarvestLotToMarketplace(lot.id);
                  setSelectedDetailLot({
                    ...lot,
                    isReleasedToMarketplace: !isReleased,
                  });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isReleased
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>{isReleased ? 'Tarik ke Inventory' : 'Rilis ke Marketplace'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      `Serahkan ${lot.availableWeightKg} kg ceri lot "${lot.id}" ke Stasiun Pengolah (Processor)?`
                    )
                  ) {
                    sendHarvestLotToProcessor(lot.id);
                    setSelectedDetailLot({
                      ...lot,
                      sentToProcessor: true,
                      availableWeightKg: 0,
                    });
                    alert(`Ceri lot ${lot.id} berhasil diserahkan ke Stasiun Pengolah!`);
                  }
                }}
                disabled={isSentToProcessor || lot.availableWeightKg <= 0}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#343a40] hover:bg-stone-900 disabled:opacity-50 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Cog className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSentToProcessor ? 'Sudah di Pengolah' : 'Serahkan ke Pengolah'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Cetak Barcode Karung Panen */}
        <FarmerBarcodeModal
          isOpen={Boolean(selectedBarcodeLot)}
          onClose={() => setSelectedBarcodeLot(null)}
          lot={selectedBarcodeLot}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE 3: DAFTAR LOT HASIL PANEN (DEFAULT)
  // =========================================================================
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Summary KPI Small-Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-stone-200 border-t-4 border-t-emerald-600 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Total Panen Ceri Kopi
            </span>
            <span className="text-2xl font-black text-stone-900 mt-1 block">
              {totalCherryHarvestKg.toLocaleString()} <span className="text-xs font-normal text-stone-500">kg</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-stone-200 border-t-4 border-t-amber-600 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Keep di Gudang Petani (Inventory)
            </span>
            <span className="text-2xl font-black text-stone-900 mt-1 block">
              {totalCherryInventoryKg.toLocaleString()}{' '}
              <span className="text-xs font-normal text-stone-500">kg ({totalCherryInventoryLots} Lot)</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-stone-200 border-t-4 border-t-blue-600 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Live di Marketplace
            </span>
            <span className="text-2xl font-black text-stone-900 mt-1 block">
              {totalCherryReleased} <span className="text-xs font-normal text-stone-500">Lot Aktif</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-stone-200 border-t-4 border-t-stone-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Diserahkan ke Wet Mill
            </span>
            <span className="text-2xl font-black text-stone-900 mt-1 block">
              {totalCherryToProcessor} <span className="text-xs font-normal text-stone-500">Lot Olah</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
            <Cog className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Top Controls & Interactive Stage Filter Strip */}
      <div className="bg-white rounded-lg p-4 border border-stone-200 shadow-sm space-y-3">
        {/* Row 1: Search & Farmer Filter & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ID Lot, nama petani, kebun, varietas..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Filter Petani */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-stone-400 font-bold flex items-center gap-1 text-[11px]">
                <Users className="w-3.5 h-3.5" /> Petani:
              </span>
              <select
                value={selectedFarmerFilter}
                onChange={(e) => setSelectedFarmerFilter(e.target.value)}
                className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-lg px-2.5 py-2 font-medium focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="all">Semua Petani ({allFarmers.length})</option>
                {allFarmers.map((farmer) => (
                  <option key={farmer.id} value={farmer.id}>
                    {farmer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tombol Input Panen Baru - Buka Halaman Form */}
          <button
            onClick={handleOpenAddHarvestPage}
            className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Catat Panen Baru (Buka Halaman Form)</span>
          </button>
        </div>

        {/* Row 2: Visual Stage Filter Pills */}
        <div className="pt-2 border-t border-stone-100 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <span className="text-[11px] text-stone-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Stage Lot:
          </span>

          <button
            onClick={() => setSelectedStageFilter('all')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
              selectedStageFilter === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Semua Lot ({farmerLots.length})
          </button>

          <button
            onClick={() => setSelectedStageFilter('inventory')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedStageFilter === 'inventory'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Keep di Inventory</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/15 font-mono">
              {totalCherryInventoryLots}
            </span>
          </button>

          <button
            onClick={() => setSelectedStageFilter('released')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedStageFilter === 'released'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Live di Marketplace</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/15 font-mono">
              {totalCherryReleased}
            </span>
          </button>

          <button
            onClick={() => setSelectedStageFilter('processor')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedStageFilter === 'processor'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200'
            }`}
          >
            <Cog className="w-3.5 h-3.5" />
            <span>Diserahkan ke Wet Mill</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/15 font-mono">
              {totalCherryToProcessor}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Tabel Data Master Hasil Panen (AdminLTE Table Style with Visual Stage Trackers) */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 bg-stone-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800">
              Daftar Lot Hasil Panen Ceri Terdaftar
            </h3>
          </div>
          <span className="text-[11px] text-stone-500">
            {filteredLots.length} Lot Tercatat (Petani &rarr; Kebun &rarr; Panen &rarr; Distribusi)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[1000px]">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">
                <th className="py-3.5 px-4 whitespace-nowrap">Lot ID &amp; Tanggal</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Petani &amp; Kebun Asal</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Mutu Kualitas Ceri</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Berat &amp; Harga</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status Alur Stage (Lifecycle)</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Aksi &amp; Distribusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLots.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-medium text-xs">Tidak ada data hasil panen yang cocok dengan filter.</p>
                  </td>
                </tr>
              ) : (
                filteredLots.map((lot) => {
                  const isReleased = (lot.isReleasedToMarketplace ?? true) && !lot.sentToProcessor;
                  const isSent = lot.sentToProcessor ?? false;

                  return (
                    <tr key={lot.id} className="hover:bg-emerald-50/30 transition-colors">
                      {/* Lot ID & Date */}
                      <td className="py-3.5 px-4 space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDetailLot(lot);
                            setCurrentView('detail');
                          }}
                          className="font-mono text-xs font-black text-stone-900 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer text-left"
                          title="Klik untuk membuka lembar detail stage"
                        >
                          <span>{lot.id}</span>
                          <Eye className="w-3.5 h-3.5 text-stone-400 hover:text-emerald-600" />
                        </button>
                        <span className="text-[11px] text-stone-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>{lot.harvestDate}</span>
                        </span>
                      </td>

                      {/* Petani + Kebun */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="flex items-center gap-1 font-bold text-stone-900 text-xs">
                          <Users className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{lot.farmerName}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 truncate">
                          <TreePine className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate">{lot.farmName || 'Kebun Kopi Petani'}</span>
                        </div>
                        <span className="text-[10px] text-stone-400 block truncate">
                          {lot.farmLocation}
                        </span>
                      </td>

                      {/* Specs: Brix, Picking method, Variety */}
                      <td className="py-3.5 px-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10.5px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                            {lot.brix || 21.5}° Brix
                          </span>
                          <span className="text-[10.5px] text-emerald-700 font-bold">
                            {lot.pickingMethod.split(' ')[0]}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-600 block truncate">
                          {lot.variety} • {lot.altitude}
                        </span>
                      </td>

                      {/* Weight & Price */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <span className="font-black text-stone-900 text-sm block">
                          {lot.availableWeightKg.toLocaleString()} <span className="text-xs font-normal">kg</span>
                        </span>
                        <span className="text-[11px] text-amber-700 font-bold block">
                          Rp {lot.pricePerKg.toLocaleString()} / kg
                        </span>
                      </td>

                      {/* Lifecycle Stage Visual Tracker */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isSent ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#343a40] text-amber-300 border border-stone-600 shadow-2xs whitespace-nowrap shrink-0">
                            <Cog className="w-3 h-3 text-amber-400 animate-spin shrink-0" />
                            <span>Di Stasiun Wet Mill</span>
                          </span>
                        ) : isReleased ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs whitespace-nowrap shrink-0">
                            <Store className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Live di Marketplace</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 whitespace-nowrap shrink-0">
                            <Package className="w-3 h-3 text-amber-700 shrink-0" />
                            <span>Gudang Petani (Inventory)</span>
                          </span>
                        )}
                      </td>

                      {/* Actions: Rilis Toggle, Kirim ke Pengolah, Cetak Barcode */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Toggle Rilis ke Marketplace atau Tarik ke Inventory */}
                          <button
                            type="button"
                            onClick={() => toggleReleaseHarvestLotToMarketplace(lot.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs ${
                              isReleased
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                            }`}
                            title={isReleased ? 'Tarik dari Marketplace ke Inventory' : 'Rilis Langsung ke Marketplace Publik'}
                          >
                            <Store className="w-3 h-3" />
                            <span>{isReleased ? 'Tarik ke Inventory' : 'Rilis ke Marketplace'}</span>
                          </button>

                          {/* Serahkan ke Stasiun Pengolah (Processor) */}
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Serahkan ${lot.availableWeightKg} kg ceri lot "${lot.id}" ke Stasiun Pengolah (Processor)?`
                                )
                              ) {
                                sendHarvestLotToProcessor(lot.id);
                                alert(`Ceri lot ${lot.id} berhasil diserahkan ke Stasiun Pengolah!`);
                              }
                            }}
                            disabled={isSent || lot.availableWeightKg <= 0}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer border ${
                              isSent
                                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                                : 'bg-stone-800 hover:bg-stone-900 text-white border-stone-700'
                            }`}
                            title={isSent ? 'Sudah diserahkan ke pengolah' : 'Serahkan ke Stasiun Pengolah'}
                          >
                            <Cog className="w-3 h-3 text-amber-400" />
                            <span>{isSent ? 'Di Pengolah' : 'Kirim Pengolah'}</span>
                          </button>

                          {/* Cetak Barcode Karung */}
                          <button
                            type="button"
                            onClick={() => setSelectedBarcodeLot(lot)}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer border border-stone-200"
                            title="Cetak Barcode Karung Lot Panen"
                          >
                            <QrCode className="w-4 h-4 text-stone-700" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cetak Barcode Karung Panen */}
      <FarmerBarcodeModal
        isOpen={Boolean(selectedBarcodeLot)}
        onClose={() => setSelectedBarcodeLot(null)}
        lot={selectedBarcodeLot}
      />
    </div>
  );
};
