import React, { useState, useEffect } from 'react';
import { X, Sparkles, Sprout, Cog, Warehouse, Flame, Plus, Check } from 'lucide-react';
import { MarketplaceCategory } from '../../types/coffee';
import { useCoffee } from '../../context/CoffeeContext';
import { ProductImageField } from '../shared/ProductImageField';

interface LaunchToMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNotice?: (message: string) => void;
}

export const LaunchToMarketplaceModal: React.FC<LaunchToMarketplaceModalProps> = ({
  isOpen,
  onClose,
  onSuccessNotice,
}) => {
  const { currentUser, launchMarketplaceProduct } = useCoffee();

  // Determine initial category according to logged-in user role
  const getInitialCategory = (): MarketplaceCategory => {
    if (!currentUser) return 'cherry';
    if (currentUser.role === 'petani') return 'cherry';
    if (currentUser.role === 'pengolah') return 'green_bean_processor';
    if (currentUser.role === 'gudang') return 'green_bean_warehouse';
    if (currentUser.role === 'roaster') return 'roasted_bean';
    return 'cherry';
  };

  const [category, setCategory] = useState<MarketplaceCategory>(getInitialCategory());
  const [title, setTitle] = useState('');
  const [variety, setVariety] = useState('Typica & Ateng Super');
  const [origin, setOrigin] = useState(currentUser?.location || 'Pangalengan, Jawa Barat');
  const [altitude, setAltitude] = useState('1.550 mdpl');
  const [processMethod, setProcessMethod] = useState('Full Washed');
  const [roastLevel, setRoastLevel] = useState('Medium Roast');
  const [stock, setStock] = useState<number>(100);
  const [price, setPrice] = useState<number>(18000);
  const [tastingNotes, setTastingNotes] = useState('Peach, Citrus, Brown Sugar, Clean Finish');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80'
  );

  // Auto-fill sensible defaults when category switches
  useEffect(() => {
    if (category === 'cherry') {
      setTitle(title ? title : 'Ceri Kopi Segar Petik Merah Optimal');
      setPrice(18000);
      setStock(150);
      setPhotoUrl('https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80');
    } else if (category === 'green_bean_processor') {
      setTitle(title ? title : 'Specialty Green Bean Full Washed Grade 1');
      setPrice(135000);
      setStock(60);
      setPhotoUrl('https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80');
    } else if (category === 'green_bean_warehouse') {
      setTitle(title ? title : 'Green Bean Hermetic Export Quality (Gudang QA)');
      setPrice(150000);
      setStock(120);
      setPhotoUrl('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80');
    } else if (category === 'roasted_bean') {
      setTitle(title ? title : 'Biji Sangrai Artisan 250g Ready-to-Brew');
      setPrice(95000);
      setStock(30);
      setPhotoUrl('https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=600&auto=format&fit=crop&q=80');
    }
  }, [category]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const notesArray = tastingNotes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const result = launchMarketplaceProduct({
      category,
      title: title.trim() || `Produk ${category}`,
      variety,
      origin,
      altitude,
      processMethod,
      roastLevel,
      stock: Number(stock),
      price: Number(price),
      tastingNotes: notesArray,
      photoUrl,
      notes,
    });

    if (result.success) {
      if (onSuccessNotice) {
        onSuccessNotice(result.message);
      }
      onClose();
    }
  };

  const categoryOptions: {
    key: MarketplaceCategory;
    label: string;
    icon: React.ReactNode;
    actor: string;
    stockUnit: string;
    priceHint: string;
  }[] = [
    {
      key: 'cherry',
      label: 'Ceri Segar',
      icon: <Sprout className="w-4 h-4" />,
      actor: 'Petani Kopi',
      stockUnit: 'kg',
      priceHint: 'Rp / kg',
    },
    {
      key: 'green_bean_processor',
      label: 'Green Bean Mill',
      icon: <Cog className="w-4 h-4" />,
      actor: 'Stasiun Pengolah',
      stockUnit: 'kg',
      priceHint: 'Rp / kg',
    },
    {
      key: 'green_bean_warehouse',
      label: 'Green Bean Gudang',
      icon: <Warehouse className="w-4 h-4" />,
      actor: 'Gudang & Ekspor',
      stockUnit: 'kg',
      priceHint: 'Rp / kg',
    },
    {
      key: 'roasted_bean',
      label: 'Biji Sangrai',
      icon: <Flame className="w-4 h-4" />,
      actor: 'Artisan Roastery',
      stockUnit: 'pack (250g)',
      priceHint: 'Rp / pack',
    },
  ];

  const currentCategoryMeta = categoryOptions.find((c) => c.key === category)!;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-linear-to-r from-stone-900 via-amber-950 to-stone-900 text-white px-6 py-5 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Unified Marketplace Launch Form
            </div>
            <h2 className="text-xl font-black tracking-tight">Terbitkan Komoditas ke Marketplace</h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Lengkapi informasi lot, harga, dan masukkan foto produk agar langsung dapat ditemukan oleh mitra dan pembeli.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Step 1: Category Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              1. Pilih Kategori Rantai Pasok Kopi
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categoryOptions.map((opt) => {
                const isSelected = category === opt.key;
                return (
                  <button
                    type="button"
                    key={opt.key}
                    onClick={() => setCategory(opt.key)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500 text-stone-950 shadow-xs'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {opt.icon}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-600 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="font-black text-xs">{opt.label}</div>
                      <div className="text-[10px] text-stone-500">{opt.actor}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Dedicated Photo / Image Field */}
          <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/70 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <label className="text-xs font-black text-stone-800 uppercase tracking-wider">
                2. Field Gambar Produk (Upload / URL / Presets)
              </label>
            </div>
            <ProductImageField
              value={photoUrl}
              onChange={setPhotoUrl}
              label="Foto / Gambar Komoditas"
              categoryHint={
                category === 'cherry'
                  ? 'cherry'
                  : category === 'green_bean_processor' || category === 'green_bean_warehouse'
                  ? 'green_bean'
                  : 'roasted_bean'
              }
            />
          </div>

          {/* Step 3: Product Details */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              3. Detail &amp; Spesifikasi Produk
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama / Judul Listing Marketplace</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Specialty Typica Honey Process 1.550 mdpl"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Varietas Kopi</label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Asal Daerah (Origin)</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Ketinggian Kebun</label>
                  <input
                    type="text"
                    value={altitude}
                    onChange={(e) => setAltitude(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {category === 'roasted_bean' ? 'Profil Sangrai (Roast Level)' : 'Metode Olah / Petik'}
                  </label>
                  {category === 'roasted_bean' ? (
                    <select
                      value={roastLevel}
                      onChange={(e) => setRoastLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Light Roast">Light Roast (Filter & V60)</option>
                      <option value="Medium Roast">Medium Roast (All Rounder)</option>
                      <option value="Medium-Dark Roast">Medium-Dark Roast (Espresso & Milk)</option>
                      <option value="Dark Roast">Dark Roast (Bold & Heavy Body)</option>
                    </select>
                  ) : (
                    <select
                      value={processMethod}
                      onChange={(e) => setProcessMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Full Washed">Full Washed (Clean & Crisp)</option>
                      <option value="Natural / Dry">Natural / Dry (Fruity & Sweet)</option>
                      <option value="Honey (Yellow/Red)">Honey Process (Complex & Sweet)</option>
                      <option value="Anaerobic Natural">Anaerobic Natural (Exotic Ferment)</option>
                      <option value="Wine Process">Wine Process (Intense Fruity)</option>
                      <option value="Wet Hulled (Giling Basah)">Wet Hulled / Giling Basah (Bold)</option>
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Stok ({currentCategoryMeta.stockUnit})
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      min={1}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Harga ({currentCategoryMeta.priceHint})
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      min={100}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Tasting Notes / Karakteristik Rasa (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={tastingNotes}
                  onChange={(e) => setTastingNotes(e.target.value)}
                  placeholder="Contoh: Peach, Citrus, Brown Sugar, Jasmine"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Catatan Tambahan / Deskripsi Lot</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informasi sertifikasi (Organik, EUDR), proses panen, atau pesan khusus untuk pembeli..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Terbitkan ke Marketplace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
