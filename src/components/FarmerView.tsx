import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Sprout,
  PlusCircle,
  Package,
  History,
  TrendingUp,
  MapPin,
  CheckCircle2,
  QrCode,
  Search,
  Filter,
  Layers,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Calculator,
  Receipt,
  Scale,
  DollarSign,
  Droplets,
  Mountain,
  FileText,
  Check,
  Tag,
  Store,
  ChevronRight,
} from 'lucide-react';
import { FarmerHarvestLot } from '../types/coffee';
import { FarmerBarcodeModal } from './FarmerBarcodeModal';
import { MetricCard } from './admin/MetricCard';
import { ControlPanel } from './shared/ControlPanel';
import { StatusPipeline, PipelineStage } from './shared/StatusPipeline';
import { StatButton } from './shared/StatButton';
import { ActivityFeed } from './shared/ActivityFeed';
import { RecordBreadcrumb } from './shared/RecordBreadcrumb';

const FARMER_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'rencana', label: 'Rencana Petik' },
  { id: 'panen', label: 'Panen & Timbang' },
  { id: 'sortasi_brix', label: 'Sortasi & Brix' },
  { id: 'labeling', label: 'Labeling Karung' },
  { id: 'siap_jual', label: 'Siap Jual' },
  { id: 'terjual', label: 'Terjual' },
];

export const FarmerView: React.FC = () => {
  const { currentUser, farmerLots, addFarmerHarvest, seedFarmerLots, transactions } = useCoffee();
  const [activeTab, setActiveTab] = useState<'catalog' | 'upload' | 'history'>('catalog');

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'cards'>('cards');
  const [selectedLotDetail, setSelectedLotDetail] = useState<FarmerHarvestLot | null>(null);

  // Form State for uploading new harvest lot
  const [variety, setVariety] = useState('Typica & Sigarar Utang');
  const [farmLocation, setFarmLocation] = useState(currentUser?.location || 'Pangalengan, Jawa Barat');
  const [altitude, setAltitude] = useState('1.550 mdpl');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [pickingMethod, setPickingMethod] = useState<FarmerHarvestLot['pickingMethod']>(
    'Petik Merah Optimal (95%+)'
  );
  const [brix, setBrix] = useState<number>(21.5);
  const [totalWeightKg, setTotalWeightKg] = useState<number>(500);
  const [pricePerKg, setPricePerKg] = useState<number>(15000);
  const [pickingCostPerKg, setPickingCostPerKg] = useState<number>(3000); // HPP upah petik
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Barcode Modal State
  const [selectedBarcodeLot, setSelectedBarcodeLot] = useState<FarmerHarvestLot | null>(null);
  const [isNewUpload, setIsNewUpload] = useState<boolean>(false);

  // Data lot & transactions
  const myLots = farmerLots.filter((lot) => lot.farmerId === currentUser?.id || true);
  const myTransactions = transactions.filter((t) => t.fromRole === 'petani');

  const totalHarvestedKg = myLots.reduce((acc, curr) => acc + curr.totalWeightKg, 0);
  const availableKg = myLots.reduce((acc, curr) => acc + curr.availableWeightKg, 0);
  const soldKg = totalHarvestedKg - availableKg;
  const totalRevenue = myTransactions.reduce((acc, curr) => acc + curr.totalAmount, 0);

  // Live valuation calculations for Form
  const estimatedGrossRevenue = totalWeightKg * pricePerKg;
  const estimatedHppCost = totalWeightKg * pickingCostPerKg;
  const estimatedNetProfit = estimatedGrossRevenue - estimatedHppCost;
  const profitMarginPercent = Math.round((estimatedNetProfit / estimatedGrossRevenue) * 100) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLot = addFarmerHarvest({
      farmLocation,
      altitude,
      variety,
      harvestDate,
      pickingMethod,
      brix: Number(brix),
      totalWeightKg: Number(totalWeightKg),
      pricePerKg: Number(pricePerKg),
      notes: notes || 'Hasil panen segar petik merah pilihan dari perkebunan lereng bukit.',
      photoUrl: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80',
    });

    setSuccessMessage(`Berhasil mendaftarkan Lot Panen Baru (${totalWeightKg} kg)! Barcode identitas karung telah dibuat.`);
    setActiveTab('catalog');
    setTimeout(() => setSuccessMessage(''), 5000);

    if (newLot) {
      setSelectedBarcodeLot(newLot);
      setIsNewUpload(true);
    }

    setNotes('');
  };

  // Filtered Catalog
  const filteredLots = myLots.filter((lot) => {
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && lot.availableWeightKg > 0) ||
      (statusFilter === 'sold' && lot.availableWeightKg === 0);
    const q = searchQuery.toLowerCase();
    const matchSearch =
      lot.id.toLowerCase().includes(q) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.farmLocation.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const getLotStage = (lot: FarmerHarvestLot) => {
    if (lot.availableWeightKg === 0) return 'terjual';
    return 'siap_jual';
  };

  return (
    <div className="space-y-6">
      {!selectedLotDetail && (
        <>
          {/* Top Banner Hero */}
          <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-emerald-900/60">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30 backdrop-blur-xs">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>Farm Tier 1 • Stasiun Hulu Perkebunan</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Manajemen Panen Ceri & Ketertelusuran Lahan
              </h1>
              <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
                Catat hasil petik merah dengan data ketinggian mdpl dan kadar kemanisan (°Brix). Stasiun pengolah dapat langsung memverifikasi kualitas dan membeli ceri Anda secara transparan.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-stone-300 pt-1">
                <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Sertifikasi EUDR: <strong>Lolos Geolocation 100%</strong>
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs">
                  Elevasi: <strong className="text-amber-300">{currentUser?.location || '1.550 mdpl'}</strong>
                </span>
              </div>
            </div>

            <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
              <Sprout className="w-48 h-48" />
            </div>
          </div>

          {/* 4 Cruip-Style Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Panen Dicatat"
              value={`${totalHarvestedKg.toLocaleString()} kg`}
              subtitle="Cherry merah segar"
              icon={<Package className="w-5 h-5 text-emerald-600" />}
              color="emerald"
              trend={{ value: '18.4%', isPositive: true, label: 'vs musim lalu' }}
            />

            <MetricCard
              title="Stok Ceri Tersedia"
              value={`${availableKg.toLocaleString()} kg`}
              subtitle="Siap dibeli Pengolah"
              icon={<Sprout className="w-5 h-5 text-amber-600" />}
              color="amber"
              badge="Siap Jual"
            />

            <MetricCard
              title="Ceri Terjual"
              value={`${soldKg.toLocaleString()} kg`}
              subtitle="Menuju stasiun mill"
              icon={<CheckCircle2 className="w-5 h-5 text-blue-600" />}
              color="blue"
              trend={{ value: '100% Diserap', isPositive: true }}
            />

            <MetricCard
              title="Total Penjualan"
              value={`Rp ${totalRevenue.toLocaleString()}`}
              subtitle={`Dari ${myTransactions.length} transaksi selesai`}
              icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
              color="emerald"
              trend={{ value: '+24.5%', isPositive: true, label: 'MoM' }}
            />
          </div>

          {/* Feedback Message Banner */}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="bg-white p-1.5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'catalog'
                  ? 'bg-stone-900 text-white shadow-xs font-black'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Katalog Panen Saya</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
                {myLots.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'upload'
                  ? 'bg-stone-900 text-white shadow-xs font-black'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Form Pendaftaran Panen Baru</span>
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
              <span>Buku Kas & Log Penjualan</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700">
                {myTransactions.length}
              </span>
            </button>
          </div>

          {/* TAB 1: FORM PENDAFTARAN PANEN BARU */}
          {activeTab === 'upload' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm max-w-4xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Pendaftaran Komoditas Ceri Kopi
                </div>
                <h2 className="text-xl font-black text-stone-900">
                  Formulir Pendaftaran Hasil Panen Ceri Kopi
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Data yang diunggah akan menjadi basis ketertelusuran (Chain of Custody) saat kopi dibeli dan diproses oleh pengolah.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Varietas Kopi
                    </label>
                    <input
                      type="text"
                      required
                      value={variety}
                      onChange={(e) => setVariety(e.target.value)}
                      placeholder="Contoh: Typica, Sigarar Utang, Ateng Super"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Lokasi Kebun / Blok Lahan
                    </label>
                    <input
                      type="text"
                      required
                      value={farmLocation}
                      onChange={(e) => setFarmLocation(e.target.value)}
                      placeholder="Contoh: Pangalengan Blok Gunung Tilu"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Ketinggian Kebun (mdpl)
                    </label>
                    <input
                      type="text"
                      required
                      value={altitude}
                      onChange={(e) => setAltitude(e.target.value)}
                      placeholder="Contoh: 1.550 mdpl"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Tanggal Panen
                    </label>
                    <input
                      type="date"
                      required
                      value={harvestDate}
                      onChange={(e) => setHarvestDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Metode Petik Ceri
                    </label>
                    <select
                      value={pickingMethod}
                      onChange={(e) =>
                        setPickingMethod(e.target.value as FarmerHarvestLot['pickingMethod'])
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Petik Merah Optimal (95%+)">
                        Petik Merah Optimal (95%+) - Specialty Standard
                      </option>
                      <option value="Petik Campur (Merah & Kuning)">
                        Petik Campur (Merah & Kuning)
                      </option>
                      <option value="Petik Rata">Petik Rata Komersial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Tingkat Kemanisan Buah (°Brix)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={brix}
                      onChange={(e) => setBrix(Number(e.target.value))}
                      placeholder="Contoh: 21.5"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-[11px] text-stone-500">Standar cherry specialty matang: 19° - 24° Brix</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Total Berat Panen (kg)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={totalWeightKg}
                      onChange={(e) => setTotalWeightKg(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Harga Penawaran per kg (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      step="500"
                      value={pricePerKg}
                      onChange={(e) => setPricePerKg(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Interactive Valuation & Profitability Card */}
                <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                      Kalkulator Nilai Lot & Perkiraan Laba Bersih
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="bg-white p-3 rounded-xl border border-emerald-200/60 shadow-2xs">
                      <span className="text-[11px] text-stone-500 block">Estimasi Nilai Lot (Gross):</span>
                      <strong className="text-base font-black text-stone-900 block mt-0.5">
                        Rp {estimatedGrossRevenue.toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-stone-400">
                        {totalWeightKg} kg × Rp {pricePerKg.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-200/60 shadow-2xs">
                      <span className="text-[11px] text-stone-500 block">Estimasi Ongkos Petik (HPP):</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="number"
                          value={pickingCostPerKg}
                          onChange={(e) => setPickingCostPerKg(Number(e.target.value))}
                          className="w-20 px-2 py-0.5 text-xs font-bold border rounded bg-stone-50"
                          title="Biaya upah petik per kg"
                        />
                        <span className="text-xs text-stone-500">/kg</span>
                      </div>
                      <span className="text-[10px] text-stone-400">
                        Total HPP: Rp {estimatedHppCost.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-200/60 shadow-2xs">
                      <span className="text-[11px] text-emerald-700 font-bold block">
                        Estimasi Margin Keuntungan:
                      </span>
                      <strong className="text-base font-black text-emerald-700 block mt-0.5">
                        +Rp {estimatedNetProfit.toLocaleString()} ({profitMarginPercent}%)
                      </strong>
                      <span className="text-[10px] text-emerald-600">Laba bersih petani</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Catatan Karakter Kebun & Pohon
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tuliskan catatan khusus, misalnya: Pemupukan organik kascing, naungan pohon lamtoro, petik pagi cerah..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Daftarkan Hasil Panen ke Sistem & Buat Barcode
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: KATALOG PANEN SAYA (Cruip Table & Filter) */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              {/* Enterprise Control Panel */}
              <ControlPanel
                breadcrumbs={[{ label: 'Katalog Panen Petani' }]}
                primaryActionLabel="+ Daftarkan Panen"
                onPrimaryAction={() => setActiveTab('upload')}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeFilter={statusFilter}
                onFilterChange={(f) => setStatusFilter(f as any)}
                filterOptions={[
                  { id: 'all', label: 'Semua Status' },
                  { id: 'available', label: 'Tersedia' },
                  { id: 'sold', label: 'Terjual' },
                ]}
                viewMode={viewMode === 'cards' ? 'table' : viewMode}
                onViewModeChange={(m) => setViewMode(m as any)}
                recordCount={filteredLots.length}
              />

              {filteredLots.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                  <Sprout className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-stone-800">Belum ada lot panen di katalog</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto mb-4">
                    Katalog panen saat ini kosong. Daftarkan panen baru atau muat data seeder panen petani Nusantara (10 lot).
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Input Panen Baru</span>
                    </button>
                    <button
                      onClick={seedFarmerLots}
                      className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Muat Ulang Seeder Panen (10 Lot)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* VIEW 1: CARDS GRID VIEW */}
                  {viewMode === 'cards' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredLots.map((lot) => {
                    const isAvailable = lot.availableWeightKg > 0;
                    return (
                      <div
                        key={lot.id}
                        onClick={() => setSelectedLotDetail(lot)}
                        className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between cursor-pointer group"
                      >
                        <div>
                          {/* Header Image with Badges */}
                          <div className="relative h-44 bg-stone-100 overflow-hidden">
                            <img
                              src={lot.photoUrl}
                              alt={lot.variety}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md">
                              {lot.id}
                            </div>
                            <div className="absolute top-3 right-3">
                              {isAvailable ? (
                                <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                                  Siap Jual ({lot.availableWeightKg} kg)
                                </span>
                              ) : (
                                <span className="bg-stone-800 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                                  Ludes Terjual
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="p-5 space-y-3">
                            <div>
                              <h3 className="font-bold text-base text-stone-900 leading-tight group-hover:text-emerald-700 transition-colors">
                                {lot.variety}
                              </h3>
                              <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
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
                                <span className="text-[10px] text-stone-400 block font-semibold">Kemanisan:</span>
                                <span className="font-black text-emerald-700">{lot.brix}° Brix</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-stone-400 block font-semibold">Standar Petik:</span>
                                <span className="font-semibold text-stone-800 truncate block">
                                  {lot.pickingMethod.split(' ')[0]}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-stone-400 block font-semibold">Tgl Panen:</span>
                                <span className="font-semibold text-stone-800">{lot.harvestDate}</span>
                              </div>
                            </div>

                            <p className="text-xs text-stone-600 line-clamp-2 italic">
                              "{lot.notes}"
                            </p>
                          </div>
                        </div>

                        {/* Pricing Footer */}
                        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-stone-400 block">Harga Penawaran:</span>
                            <span className="text-sm font-black text-stone-900">
                              Rp {lot.pricePerKg.toLocaleString()}
                              <span className="text-xs font-normal text-stone-500"> / kg</span>
                            </span>
                          </div>

                          <div className="text-right flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                            <span>Detail Lot</span>
                            <ChevronRight className="w-3.5 h-3.5" />
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
                          <th className="py-3.5 px-4">ID Lot Panen</th>
                          <th className="py-3.5 px-4">Varietas & Lokasi Kebun</th>
                          <th className="py-3.5 px-4">Tgl Panen</th>
                          <th className="py-3.5 px-4">Kemanisan Brix</th>
                          <th className="py-3.5 px-4">Stok Tersedia</th>
                          <th className="py-3.5 px-4">Harga Penawaran</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Tindakan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredLots.map((lot) => {
                          const isAvailable = lot.availableWeightKg > 0;
                          return (
                            <tr
                              key={lot.id}
                              onClick={() => setSelectedLotDetail(lot)}
                              className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                            >
                              <td className="py-3 px-4 font-mono font-bold text-stone-900">
                                {lot.id}
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-bold text-stone-900">{lot.variety}</div>
                                <div className="text-[11px] text-stone-500">{lot.farmLocation} • {lot.altitude}</div>
                              </td>
                              <td className="py-3 px-4 text-stone-700 font-medium">
                                {lot.harvestDate}
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-black text-emerald-700">{lot.brix}° Brix</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-bold text-stone-900">{lot.availableWeightKg}</span>
                                <span className="text-stone-400 text-[11px]"> / {lot.totalWeightKg} kg</span>
                              </td>
                              <td className="py-3 px-4 font-bold text-stone-900">
                                Rp {lot.pricePerKg.toLocaleString()} / kg
                              </td>
                              <td className="py-3 px-4">
                                {isAvailable ? (
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                    Siap Jual
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold">
                                    Terjual
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBarcodeLot(lot);
                                    setIsNewUpload(false);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                                >
                                  <QrCode className="w-3 h-3" />
                                  Barcode
                                </button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Column 1: Siap Jual */}
                  <div className="bg-stone-50/70 rounded-2xl p-4 border border-stone-200/80 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                          Tersedia Siap Jual
                        </h4>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                        {filteredLots.filter((l) => l.availableWeightKg > 0).length} Lot
                      </span>
                    </div>

                    <div className="space-y-3">
                      {filteredLots
                        .filter((l) => l.availableWeightKg > 0)
                        .map((lot) => (
                          <div
                            key={lot.id}
                            onClick={() => setSelectedLotDetail(lot)}
                            className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-bold text-stone-900">{lot.id}</span>
                              <span className="font-black text-emerald-700">{lot.brix}° Brix</span>
                            </div>
                            <h5 className="font-bold text-sm text-stone-900 leading-tight">{lot.variety}</h5>
                            <p className="text-[11px] text-stone-500">{lot.farmLocation} • {lot.altitude}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                              <span className="font-bold text-stone-700">{lot.availableWeightKg} kg</span>
                              <span className="font-black text-stone-900">Rp {lot.pricePerKg.toLocaleString()}/kg</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Column 2: Terjual */}
                  <div className="bg-stone-50/70 rounded-2xl p-4 border border-stone-200/80 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-stone-400"></span>
                        <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                          Terjual & Terdistribusi
                        </h4>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 bg-stone-200 text-stone-700 rounded-full">
                        {filteredLots.filter((l) => l.availableWeightKg === 0).length} Lot
                      </span>
                    </div>

                    <div className="space-y-3">
                      {filteredLots
                        .filter((l) => l.availableWeightKg === 0)
                        .map((lot) => (
                          <div
                            key={lot.id}
                            onClick={() => setSelectedLotDetail(lot)}
                            className="bg-white/80 p-4 rounded-xl border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2 opacity-80"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-bold text-stone-600">{lot.id}</span>
                              <span className="text-stone-500 font-semibold">{lot.harvestDate}</span>
                            </div>
                            <h5 className="font-bold text-sm text-stone-800">{lot.variety}</h5>
                            <p className="text-[11px] text-stone-500">{lot.farmLocation}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                              <span className="text-stone-500">{lot.totalWeightKg} kg</span>
                              <span className="font-bold text-stone-700">Ludes Terjual</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

          {/* TAB 3: BUKU KAS & RIWAYAT PENJUALAN */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-emerald-600" />
                    Catatan Penjualan Ceri Kopi ke Pengolah
                  </h2>
                  <p className="text-xs text-stone-500">
                    Log riwayat transaksi hulu yang tercatat secara permanen di buku besar sangrAI.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block font-bold uppercase">Total Penerimaan</span>
                  <span className="text-base font-black text-emerald-700 font-mono">
                    Rp {totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>

              {myTransactions.length === 0 ? (
                <div className="py-14 text-center">
                  <Receipt className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs text-stone-500">Belum ada transaksi penjualan ceri kopi.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myTransactions.map((trx) => (
                    <div
                      key={trx.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl border border-stone-200/90 bg-stone-50/60 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 sm:w-2/5">
                        <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0">
                          <Receipt className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 truncate">
                            <span className="truncate">Dijual ke</span>
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
                          <span className="font-bold text-emerald-700">{trx.quantity}</span>
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

      {/* DOCUMENT DETAIL SHEET VIEW (Petani Harvest Lot) */}
      {selectedLotDetail && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <RecordBreadcrumb
            listLabel="Katalog Panen Petani"
            recordLabel={selectedLotDetail.id}
            onBack={() => setSelectedLotDetail(null)}
          />

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            {/* Header with Title, Badges, and StatusPipeline */}
            <div className="bg-[#FAF7F2] px-6 py-5 border-b border-stone-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-stone-900 font-mono">{selectedLotDetail.id}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {selectedLotDetail.variety}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Kebun: <strong>{selectedLotDetail.farmLocation}</strong> ({selectedLotDetail.altitude}) • Tanggal Panen: {selectedLotDetail.harvestDate}
                  </p>
                </div>
              </div>

              {/* Real-world Supply Chain Pipeline */}
              <StatusPipeline
                stages={FARMER_PIPELINE_STAGES}
                currentStageId={getLotStage(selectedLotDetail)}
              />
            </div>

            {/* Smart Stat Badges Row */}
            <div className="px-6 py-4 bg-white border-b border-stone-100 flex flex-wrap gap-2.5">
              <StatButton
                icon={<Scale className="w-4 h-4" />}
                value={`${selectedLotDetail.availableWeightKg} / ${selectedLotDetail.totalWeightKg} kg`}
                label="Stok Ceri Tersedia"
                color="emerald"
              />
              <StatButton
                icon={<Droplets className="w-4 h-4" />}
                value={`${selectedLotDetail.brix}° Brix`}
                label="Kadar Kemanisan Buah"
                color="purple"
              />
              <StatButton
                icon={<Mountain className="w-4 h-4" />}
                value={selectedLotDetail.altitude}
                label="Ketinggian Lahan"
                color="blue"
              />
              <StatButton
                icon={<DollarSign className="w-4 h-4" />}
                value={`Rp ${selectedLotDetail.pricePerKg.toLocaleString()}`}
                label="Harga Petik / Jual"
                color="amber"
              />
              <StatButton
                icon={<Receipt className="w-4 h-4" />}
                value={`Rp ${(selectedLotDetail.totalWeightKg * selectedLotDetail.pricePerKg).toLocaleString()}`}
                label="Estimasi Valuasi Lot"
                color="stone"
              />
            </div>

            {/* Specifications & Activity Feed */}
            <div className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Spesifikasi Panen */}
                <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-600" /> Spesifikasi Panen Ceri
                  </h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Varietas Kopi</dt>
                      <dd className="font-bold text-stone-900">{selectedLotDetail.variety}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Metode Petik</dt>
                      <dd className="font-bold text-stone-900">{selectedLotDetail.pickingMethod}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Tingkat Kemanisan (°Brix)</dt>
                      <dd className="font-black text-emerald-700">{selectedLotDetail.brix}° Brix (Optimal)</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Tanggal Petik</dt>
                      <dd className="font-bold text-stone-900">{selectedLotDetail.harvestDate}</dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-stone-500">Total Berat Awal</dt>
                      <dd className="font-bold text-stone-900">{selectedLotDetail.totalWeightKg} kg ceri segar</dd>
                    </div>
                  </dl>
                </div>

                {/* Column 2: Lahan & Sertifikasi */}
                <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Lahan Perkebunan & EUDR
                  </h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Petani Penanggung Jawab</dt>
                      <dd className="font-bold text-stone-900">{selectedLotDetail.farmerName}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Lokasi / Blok Kebun</dt>
                      <dd className="font-bold text-stone-900">{selectedLotDetail.farmLocation}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Ketinggian Tempat (Elevasi)</dt>
                      <dd className="font-bold text-stone-900">{selectedLotDetail.altitude}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Status EUDR Geolocation</dt>
                      <dd className="font-bold text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi Bebas Deforestasi
                      </dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-stone-500">Catatan Agronomi</dt>
                      <dd className="font-medium text-stone-800 text-right">{selectedLotDetail.notes || '—'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Dynamic Action Buttons Bar */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-950">
                    Aksi Lembar Dokumen Panen #{selectedLotDetail.id}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBarcodeLot(selectedLotDetail);
                      setIsNewUpload(false);
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" />
                    🏷️ Cetak Stiker Barcode Karung
                  </button>
                </div>
              </div>

              {/* Activity Feed & Internal Chatter */}
              <div className="pt-2 border-t border-stone-200">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" /> Log Aktivitas & Silsilah Kebun
                </h4>
                <ActivityFeed
                  documentTitle={`Lot Panen #${selectedLotDetail.id}`}
                  initialMessages={[
                    {
                      id: 'm1',
                      author: selectedLotDetail.farmerName,
                      type: 'note',
                      content: `Hasil panen didaftarkan dengan varietas ${selectedLotDetail.variety} (${selectedLotDetail.totalWeightKg} kg). Kadar kemanisan terukur ${selectedLotDetail.brix}° Brix pada ketinggian ${selectedLotDetail.altitude}.`,
                      timestamp: selectedLotDetail.harvestDate,
                    },
                    {
                      id: 'm2',
                      author: 'Stasiun Hulu sangrAI',
                      type: 'system',
                      content: 'Barcode ketertelusuran diterbitkan dan status diverifikasi siap dibeli oleh stasiun pengolah (mill).',
                      timestamp: selectedLotDetail.harvestDate,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Barcode Karung */}
      <FarmerBarcodeModal
        isOpen={!!selectedBarcodeLot}
        onClose={() => setSelectedBarcodeLot(null)}
        lot={selectedBarcodeLot}
        isNewUpload={isNewUpload}
      />
    </div>
  );
};
