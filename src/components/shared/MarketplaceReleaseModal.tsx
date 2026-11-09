import React, { useState, useEffect } from 'react';
import {
  Store,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  ChevronRight,
  DollarSign,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Droplets,
  Eye,
  RefreshCw,
  Tag,
  Scale,
  Calendar,
  MapPin,
  Check,
  Building2,
  Info,
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { FarmerHarvestLot } from '../../types/coffee';

interface MarketplaceReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot?: FarmerHarvestLot | null;
  availableLots?: FarmerHarvestLot[];
  onSuccess?: (msg: string) => void;
}

const PRESET_PHOTOS = [
  {
    label: 'Ceri Merah Pohon',
    url: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Panen Ceri Segar',
    url: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Sortasi Meja Ceri',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Green Bean Siap Olah',
    url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
  },
];

export const MarketplaceReleaseModal: React.FC<MarketplaceReleaseModalProps> = ({
  isOpen,
  onClose,
  lot: initialLot,
  availableLots = [],
  onSuccess,
}) => {
  const {
    currentUser,
    farmerLots,
    publishLotToMarketplace,
    unpublishLotFromMarketplace,
    addFarmerHarvest,
  } = useCoffee();

  const [selectedLotId, setSelectedLotId] = useState<string>('');
  const [distributionMode, setDistributionMode] = useState<'marketplace' | 'pipeline'>('marketplace');

  // Form Fields
  const [productTitle, setProductTitle] = useState('');
  const [pricePerKg, setPricePerKg] = useState<number>(15000);
  const [allocatedStockKg, setAllocatedStockKg] = useState<number>(500);
  const [minOrderKg, setMinOrderKg] = useState<number>(5);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [pipelineNotes, setPipelineNotes] = useState('');

  // New lot fields (if creating new lot)
  const [newVariety, setNewVariety] = useState('Arabika Ateng Super');
  const [newOrigin, setNewOrigin] = useState('Pangalengan, Jawa Barat');
  const [newAltitude, setNewAltitude] = useState('1.550 mdpl');
  const [newBrix, setNewBrix] = useState<number>(22.0);
  const [newTotalWeight, setNewTotalWeight] = useState<number>(1000);

  // Status feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const currentLot =
    selectedLotId === 'new_lot'
      ? null
      : farmerLots.find((l) => l.id === selectedLotId) || initialLot || (farmerLots.length > 0 ? farmerLots[0] : null);

  useEffect(() => {
    if (isOpen) {
      setFeedback(null);
      if (initialLot) {
        setSelectedLotId(initialLot.id);
        populateFromLot(initialLot);
      } else if (availableLots.length > 0) {
        setSelectedLotId(availableLots[0].id);
        populateFromLot(availableLots[0]);
      } else if (farmerLots.length > 0) {
        setSelectedLotId(farmerLots[0].id);
        populateFromLot(farmerLots[0]);
      } else {
        setSelectedLotId('new_lot');
      }
    }
  }, [isOpen, initialLot]);

  const populateFromLot = (targetLot: FarmerHarvestLot) => {
    const isReady = targetLot.isMarketplaceReady === true;
    setDistributionMode(isReady ? 'marketplace' : 'pipeline');
    setProductTitle(targetLot.marketplaceTitle || `Ceri Kopi Arabika ${targetLot.variety} (Brix ${targetLot.brix}°)`);
    setPricePerKg(targetLot.marketplacePrice || targetLot.pricePerKg || 14500);
    setAllocatedStockKg(targetLot.marketplaceStock ?? targetLot.availableWeightKg ?? targetLot.totalWeightKg ?? 500);
    setMinOrderKg(5);
    setPhotoUrl(targetLot.marketplacePhotoUrl || targetLot.photoUrl || PRESET_PHOTOS[0].url);
    setDescription(
      targetLot.marketplaceNotes ||
        targetLot.notes ||
        `Ceri merah optimal petik pagi dari kebun ${targetLot.farmName || targetLot.farmLocation}. Kadar gula buah brix ${targetLot.brix}°, elevasi ${targetLot.altitude}, verifikasi bebas deforestasi (EUDR Compliant).`
    );
    setPipelineNotes('Stok siap dialirkan ke Stasiun Pengolahan Kopi (Wet & Dry Mill) untuk proses pulping dan fermentasi.');
  };

  const handleLotSelect = (id: string) => {
    setSelectedLotId(id);
    setFeedback(null);
    if (id === 'new_lot') {
      setProductTitle('Ceri Kopi Arabika Specialty Baru');
      setPricePerKg(15000);
      setAllocatedStockKg(500);
      setPhotoUrl(PRESET_PHOTOS[0].url);
      setDescription('Panen ceri kopi segar petik merah pilihan siap rilis ke pasar atau olahan lanjutan.');
    } else {
      const found = farmerLots.find((l) => l.id === id);
      if (found) populateFromLot(found);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (selectedLotId === 'new_lot') {
      const today = new Date().toISOString().split('T')[0];
      const newLot = addFarmerHarvest({
        farmLocation: newOrigin,
        altitude: newAltitude,
        variety: newVariety,
        harvestDate: today,
        pickingMethod: 'Petik Merah Optimal (95%+)',
        brix: Number(newBrix),
        totalWeightKg: Number(newTotalWeight),
        pricePerKg: Number(pricePerKg),
        notes: description,
        photoUrl: photoUrl || PRESET_PHOTOS[0].url,
        isMarketplaceReady: distributionMode === 'marketplace',
        marketplaceTitle: productTitle,
        marketplacePrice: Number(pricePerKg),
        marketplaceStock: Number(allocatedStockKg),
        marketplaceNotes: description,
        marketplacePhotoUrl: photoUrl || PRESET_PHOTOS[0].url,
      });

      const msg =
        distributionMode === 'marketplace'
          ? `Berhasil menerbitkan komoditas baru (#${newLot ? newLot.id : 'BARU'}) ke Marketplace Publik seharga Rp ${Number(pricePerKg).toLocaleString()}/kg!` : `Berhasil mendaftarkan komoditas baru (#${newLot ? newLot.id : 'BARU'}) ke Pipeline Olah Lanjutan Stasiun Pengolah!`;

      setFeedback({ type: 'success', message: msg });
      if (onSuccess) onSuccess(msg);
      setTimeout(() => onClose(), 1200);
      return;
    }

    if (!currentLot) return;

    if (distributionMode === 'marketplace') {
      const res = publishLotToMarketplace({
        lotId: currentLot.id,
        category: 'cherry',
        marketplaceTitle: productTitle,
        marketplacePrice: Number(pricePerKg),
        marketplaceStock: Number(allocatedStockKg),
        marketplaceNotes: description,
        marketplacePhotoUrl: photoUrl,
      });

      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        if (onSuccess) onSuccess(res.message);
        setTimeout(() => onClose(), 1200);
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } else {
      const res = unpublishLotFromMarketplace(currentLot.id);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Lot #${currentLot.id} dialokasikan ke Pipeline Olah Lanjutan (Rantai Pasok Internal) dan ditarik dari etalase publik.`,
        });
        if (onSuccess) onSuccess(`Lot #${currentLot.id} berhasil disimpan untuk olah lanjutan di stasiun berikutnya.`);
        setTimeout(() => onClose(), 1200);
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    }
  };

  const isCurrentlyInMarketplace = currentLot?.isMarketplaceReady === true;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-['Poppins']">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-950 via-[#1C140E] to-stone-900 text-white p-5 sm:p-6 relative flex items-center justify-between border-b border-amber-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Panel Seller • Distribusi Komoditas
                </span>
                {isCurrentlyInMarketplace && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Sedang Aktif di Marketplace
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                Form Rilis Produk & Alokasi Pasokan
              </h3>
              <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">
                Tentukan jalur: Rilis ke Marketplace publik atau simpan untuk olah lanjutan di stasiun pengolah.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Feedback alert */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-50 text-rose-900 border border-rose-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Step 1: Pilih Sumber Komoditas / Lot */}
          <div className="space-y-2">
            <label className="text-xs font-black text-stone-800 uppercase tracking-wider block">
              1. Pilih Lot Panen / Produk Siap
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={selectedLotId}
                onChange={(e) => handleLotSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <optgroup label="Lot Panen Tersedia di Kebun">
                  {farmerLots.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.id} • {l.variety} ({l.availableWeightKg} kg) - {l.isMarketplaceReady ? '🛒 Di Marketplace' : '⚙️ Pipeline Olah'}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Opsi Lain">
                  <option value="new_lot">+ Upload & Daftarkan Komoditas Baru</option>
                </optgroup>
              </select>

              {/* Lot Info Badge */}
              {currentLot && (
                <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-stone-900">{currentLot.id}</span>
                    <span className="text-[11px] text-stone-500 block">
                      {currentLot.variety} • {currentLot.farmLocation.split(',')[0]}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-700">{currentLot.brix}° Brix</span>
                    <span className="text-[10px] text-stone-500 block">
                      Stok: {currentLot.availableWeightKg} kg
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* New Lot Fields if 'new_lot' */}
          {selectedLotId === 'new_lot' && (
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Informasi Hasil Panen Baru</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">Varietas</label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-medium text-stone-800"
                    placeholder="e.g. Typica Java Preanger"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">Lokasi Kebun</label>
                  <input
                    type="text"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-medium text-stone-800"
                    placeholder="e.g. Pangalengan, Jawa Barat"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">Kemanisan Brix</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBrix}
                    onChange={(e) => setNewBrix(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-medium text-stone-800"
                    placeholder="e.g. 22.0"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: PILIHAN JALUR DISTRIBUSI (DUAL-CHOICE SELECTOR) */}
          <div className="space-y-2">
            <label className="text-xs font-black text-stone-800 uppercase tracking-wider block">
              2. Pilih Jalur Distribusi Komoditas
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option A: Rilis ke Marketplace Publik */}
              <div
                onClick={() => setDistributionMode('marketplace')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  distributionMode === 'marketplace'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        distributionMode === 'marketplace'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-stone-900 block">
                        Rilis ke Marketplace Publik
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                        Jual ke Pembeli & Kafe Umum
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      distributionMode === 'marketplace'
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-stone-300'
                    }`}
                  >
                    {distributionMode === 'marketplace' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-[11px] text-stone-600 mt-2.5 leading-relaxed font-normal">
                  Komoditas terbit di katalog Marketplace publik. Pembeli umum, penikmat kopi, atau coffee shop dapat langsung melihat etalase, memesan, dan checkout.
                </p>
              </div>

              {/* Option B: Simpan untuk Olah Lanjutan (Pipeline Internal) */}
              <div
                onClick={() => setDistributionMode('pipeline')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  distributionMode === 'pipeline'
                    ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        distributionMode === 'pipeline'
                          ? 'bg-stone-900 text-amber-400'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-stone-900 block">
                        Simpan untuk Olah Lanjutan
                      </span>
                      <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                        Rantai Pasok Internal (Mill)
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      distributionMode === 'pipeline'
                        ? 'border-stone-900 bg-stone-900 text-amber-400'
                        : 'border-stone-300'
                    }`}
                  >
                    {distributionMode === 'pipeline' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-[11px] text-stone-600 mt-2.5 leading-relaxed font-normal">
                  Komoditas TIDAK dirilis ke publik. Stok dialirkan secara otomatis ke stasiun proses berikutnya (Stasiun Pengolah / Wet Mill untuk fermentasi & pengeringan).
                </p>
              </div>
            </div>
          </div>

          {/* Step 3A: FORM CONFIGURATION FOR MARKETPLACE */}
          {distributionMode === 'marketplace' ? (
            <div className="space-y-4 bg-emerald-50/30 p-4 sm:p-5 rounded-2xl border border-emerald-200/60">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600" />
                  Konfigurasi Penjualan di Marketplace
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Etalase Terbuka
                </span>
              </div>

              {/* Product Title */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Judul Produk di Katalog Marketplace
                </label>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Ceri Kopi Arabika Java Preanger (Brix 22.4°)"
                  required
                />
              </div>

              {/* Price & Stock Allocation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Harga Jual (Rp / kg)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">Rp</span>
                    <input
                      type="number"
                      value={pricePerKg}
                      onChange={(e) => setPricePerKg(Number(e.target.value))}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      min={1000}
                      step={500}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Alokasi Stok Dijual (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={allocatedStockKg}
                      onChange={(e) => setAllocatedStockKg(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      min={1}
                      max={currentLot?.availableWeightKg || 10000}
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-bold">kg</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Min. Pemesanan (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={minOrderKg}
                      onChange={(e) => setMinOrderKg(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      min={1}
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-bold">kg</span>
                  </div>
                </div>
              </div>

              {/* Photo Selector */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Foto Produk Marketplace
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shrink-0 shadow-xs">
                    <img
                      src={photoUrl || PRESET_PHOTOS[0].url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PRESET_PHOTOS[0].url;
                      }}
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="Masukkan URL foto produk..."
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs font-medium text-stone-800"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_PHOTOS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPhotoUrl(p.url)}
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                            photoUrl === p.url
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Deskripsi & Catatan Kualitas
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ceritakan keunggulan ceri, rasa, aroma, atau metode panen..."
                />
              </div>

              {/* Quality & Traceability Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Bebas Deforestasi (EUDR Ready)
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  100% Petik Merah Optimal
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  <Droplets className="w-3 h-3 text-blue-600" />
                  Kemanisan Brix Teruji
                </span>
              </div>
            </div>
          ) : (
            /* Step 3B: PIPELINE OLAH LANJUTAN (INTERNAL SUPPLY CHAIN) */
            <div className="space-y-4 bg-amber-50/30 p-4 sm:p-5 rounded-2xl border border-amber-200/60">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  Alur Pemrosesan Rantai Pasok Internal
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  ERP Terintegrasi
                </span>
              </div>

              {/* Supply Chain Flow Visualization */}
              <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs space-y-3">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Alur Stasiun Pengolahan Berikutnya
                </div>
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <div className="px-3 py-1.5 rounded-xl bg-stone-900 text-white font-bold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Petani (Panen Ceri)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold flex items-center gap-1.5 shadow-sm">
                    <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '6s' }} />
                    <span>Stasiun Pengolah (Wet & Dry Mill)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                  <div className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-600 font-bold flex items-center gap-1.5">
                    <span>Roastery & Gudang</span>
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Stok ceri kopi ini (<span className="font-bold text-stone-900">{currentLot?.availableWeightKg || newTotalWeight} kg</span>) akan langsung tersedia di modul <strong>Sourcing Ceri Stasiun Pengolah</strong> untuk dibeli dan diubah menjadi Green Bean Specialty (Full Wash, Honey, atau Anaerobic Natural).
                </p>
              </div>

              {/* Downstream Instructions */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Catatan Rekomendasi Olah untuk Tim Pengolah (Mill)
                </label>
                <textarea
                  value={pipelineNotes}
                  onChange={(e) => setPipelineNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. Disarankan proses Anaerobic Natural 72 jam karena brix tinggi..."
                />
              </div>

              <div className="bg-amber-100/60 p-3 rounded-xl border border-amber-300/60 flex items-start gap-2.5 text-xs text-amber-900">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Dengan memilih opsi ini, produk <strong>tidak akan muncul</strong> di katalog pembeli publik marketplace. Anda dapat merilisnya ke marketplace sewaktu-waktu jika menginginkan.
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Batal / Tutup
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {isCurrentlyInMarketplace && distributionMode === 'marketplace' && (
                <button
                  type="button"
                  onClick={() => {
                    if (currentLot) {
                      const res = unpublishLotFromMarketplace(currentLot.id);
                      if (res.success) {
                        setFeedback({ type: 'success', message: res.message });
                        setTimeout(() => onClose(), 1200);
                      }
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Tarik dari Marketplace
                </button>
              )}

              <button
                type="submit"
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold shadow-md inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  distributionMode === 'marketplace'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-emerald-500/20'
                    : 'bg-stone-900 hover:bg-stone-800 text-amber-400 shadow-stone-900/20'
                }`}
              >
                {distributionMode === 'marketplace' ? (
                  <>
                    <Store className="w-4 h-4" />
                    <span>Terbitkan ke Marketplace Sekarang</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Simpan untuk Olah Lanjutan (Pipeline)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
