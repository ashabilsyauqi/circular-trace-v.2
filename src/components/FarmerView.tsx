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
  ShieldCheck,
  Calendar,
  Sparkles,
  Calculator,
} from 'lucide-react';
import { FarmerHarvestLot } from '../types/coffee';
import { FarmerBarcodeModal } from './FarmerBarcodeModal';
import { MetricCard } from './admin/MetricCard';

export const FarmerView: React.FC = () => {
  const { currentUser, farmerLots, addFarmerHarvest, transactions } = useCoffee();
  const [activeTab, setActiveTab] = useState<'catalog' | 'upload' | 'history'>('catalog');

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>('all');

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

  return (
    <div className="space-y-6">
      {/* Top Banner Hero (Cruip Slate/Emerald Gradient) */}
      <div className="bg-linear-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-emerald-900/60">
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

      {/* Cruip Styled Navigation Tabs */}
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

            {/* Cruip Interactive Valuation & Profitability Card */}
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
          {/* Toolbar Search & Status Filter */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari varietas, ID lot, atau lokasi kebun..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Semua Status ({myLots.length})</option>
                <option value="available">Tersedia ({myLots.filter((l) => l.availableWeightKg > 0).length})</option>
                <option value="sold">Terjual ({myLots.filter((l) => l.availableWeightKg === 0).length})</option>
              </select>

              <button
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Tambah Panen
              </button>
            </div>
          </div>

          {/* Lots Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLots.map((lot) => {
              const isAvailable = lot.availableWeightKg > 0;
              return (
                <div
                  key={lot.id}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header Image with Badges */}
                    <div className="relative h-44 bg-stone-100 overflow-hidden">
                      <img
                        src={lot.photoUrl}
                        alt={lot.variety}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md">
                        {lot.id}
                      </div>
                      <div className="absolute top-3 right-3">
                        {isAvailable ? (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                            Siap Dijual ({lot.availableWeightKg} kg)
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
                        <h3 className="font-bold text-base text-stone-900 leading-tight">
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

                      {/* Barcode Sticker Print Trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBarcodeLot(lot);
                          setIsNewUpload(false);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-emerald-200 mt-2"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                        🏷️ Cetak Stiker Barcode Karung
                      </button>
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

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block">Stok Tersedia:</span>
                      <span className="text-xs font-bold text-emerald-700">
                        {lot.availableWeightKg} / {lot.totalWeightKg} kg
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
                Log riwayat transaksi hulu yang tercatat secara permanen di buku besar CCT.
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
            <p className="text-xs text-stone-500 py-8 text-center">
              Belum ada transaksi penjualan ceri kopi.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">No. TRX</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Pembeli (Pengolah)</th>
                    <th className="py-3 px-4">Komoditas</th>
                    <th className="py-3 px-4">Volume</th>
                    <th className="py-3 px-4">Total Nilai</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {myTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-stone-800">{trx.id}</td>
                      <td className="py-3 px-4 text-stone-600">{trx.date}</td>
                      <td className="py-3 px-4 font-semibold text-stone-900">{trx.toName}</td>
                      <td className="py-3 px-4 text-stone-700">{trx.itemName}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">{trx.quantity}</td>
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
