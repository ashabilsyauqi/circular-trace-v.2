import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  MarketplaceCategory,
  UnifiedMarketplaceItem,
  UserRole,
  FarmerHarvestLot,
} from '../types/coffee';
import {
  Search,
  Filter,
  ShoppingCart,
  Sparkles,
  Award,
  CheckCircle2,
  X,
  Layers,
  ArrowUpDown,
  Building2,
  MapPin,
  Flame,
  Sprout,
  Cog,
  Warehouse,
  QrCode,
  Eye,
  Coffee,
} from 'lucide-react';
import { TraceabilityModal } from './TraceabilityModal';
import { FarmerBarcodeModal } from './FarmerBarcodeModal';
import { ProcessorBarcodeModal } from './ProcessorBarcodeModal';
import { WarehouseBarcodeModal } from './WarehouseBarcodeModal';
import { ProductDetailModal } from './ProductDetailModal';
import { ProcessedGreenBeanLot, WarehouseLot } from '../types/coffee';

export const UnifiedMarketplace: React.FC = () => {
  const {
    currentUser,
    unifiedMarketplaceItems,
    buyFromUnifiedMarketplace,
    createPOFromMarketplace,
    setActiveView,
    setRoasterActiveTab,
  } = useCoffee();

  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | 'all'>('all');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'sca_desc' | 'stock_desc'>('default');

  // Modal State for Purchasing
  const [buyingItem, setBuyingItem] = useState<UnifiedMarketplaceItem | null>(null);
  const [buyQuantity, setBuyQuantity] = useState<number>(1);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Traceability Modal State
  const [traceItem, setTraceItem] = useState<any | null>(null);

  // Farmer Barcode Modal State
  const [barcodeLot, setBarcodeLot] = useState<FarmerHarvestLot | null>(null);

  // Processor Barcode Modal State
  const [processorBarcodeLot, setProcessorBarcodeLot] = useState<ProcessedGreenBeanLot | null>(null);

  // Warehouse Barcode Modal State
  const [warehouseBarcodeLot, setWarehouseBarcodeLot] = useState<WarehouseLot | null>(null);

  // Product Detail Modal State
  const [selectedDetailItem, setSelectedDetailItem] = useState<UnifiedMarketplaceItem | null>(null);

  const categoryMeta: Record<
    MarketplaceCategory,
    { label: string; icon: React.ReactNode; color: string; badgeClass: string }
  > = {
    cherry: {
      label: 'Ceri Kopi Segar (Panen)',
      icon: <Sprout className="w-4 h-4 text-emerald-600" />,
      color: 'border-emerald-300 bg-emerald-50 text-emerald-900',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    green_bean_processor: {
      label: 'Green Bean Olahan (Mill)',
      icon: <Cog className="w-4 h-4 text-amber-600" />,
      color: 'border-amber-300 bg-amber-50 text-amber-900',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    green_bean_warehouse: {
      label: 'Green Bean Gudang & Ekspor',
      icon: <Warehouse className="w-4 h-4 text-blue-600" />,
      color: 'border-blue-300 bg-blue-50 text-blue-900',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    roasted_bean: {
      label: 'Biji Sangrai Artisan (Roaster)',
      icon: <Flame className="w-4 h-4 text-orange-600" />,
      color: 'border-orange-300 bg-orange-50 text-orange-900',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    },
  };

  // Filter items
  const filteredItems = unifiedMarketplaceItems.filter((item) => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchRole = selectedRole === 'all' || item.sellerRole === selectedRole;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.title.toLowerCase().includes(q) ||
      item.origin.toLowerCase().includes(q) ||
      item.variety.toLowerCase().includes(q) ||
      item.sellerName.toLowerCase().includes(q) ||
      item.tastingNotes.some((t) => t.toLowerCase().includes(q));

    return matchCategory && matchRole && matchSearch;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'sca_desc') return (b.scaScore || 0) - (a.scaScore || 0);
    if (sortBy === 'stock_desc') return b.availableStock - a.availableStock;
    return 0;
  });

  const handleOpenBuy = (item: UnifiedMarketplaceItem) => {
    setBuyingItem(item);
    // default quantity
    if (item.category === 'cherry') {
      setBuyQuantity(Math.min(item.availableStock, 100));
    } else if (item.category === 'green_bean_processor' || item.category === 'green_bean_warehouse') {
      setBuyQuantity(Math.min(item.availableStock, 30));
    } else {
      setBuyQuantity(Math.min(item.availableStock, 5));
    }
  };

  // A roaster buying a green bean listing creates a Purchase Order (goes through digital
  // signature approval + incoming QC before it becomes usable stock) instead of an instantly
  // completed transaction — same "beli langsung" click, different result under the hood.
  const isRoasterGreenBeanPurchase =
    !!buyingItem &&
    currentUser?.role === 'roaster' &&
    (buyingItem.category === 'green_bean_processor' || buyingItem.category === 'green_bean_warehouse');

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyingItem) return;

    const res = isRoasterGreenBeanPurchase
      ? createPOFromMarketplace(buyingItem, buyQuantity)
      : buyFromUnifiedMarketplace(buyingItem, buyQuantity);

    if (res.success) {
      setActionNotice({ type: 'success', message: res.message });
      setBuyingItem(null);
      setTimeout(() => setActionNotice(null), 6000);
    } else {
      setActionNotice({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Marketplace Header Hero */}
      <div className="bg-linear-to-r from-stone-950 via-amber-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Pasar Bersama Lintas Rantai Pasok Kopi (Unified Coffee Market)
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            1 Marketplace untuk Semua Aktor Kopi
          </h1>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
            Petani, Pengolah, Gudang/Eksportir, Roaster, dan Coffee Shop Owner berkumpul dalam satu pasar bersama. Anda dapat membeli langsung dari sumber hulu, mengamankan stok green bean, maupun memesan roasted bean dan retail pack dengan transparansi penuh.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-stone-300">
            <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs">
              Total Komoditas: <strong className="text-amber-400">{unifiedMarketplaceItems.length} Listing</strong>
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs">
              Pengguna Aktif: <strong className="text-emerald-400">{currentUser?.name}</strong> ({currentUser?.organization})
            </span>
          </div>
        </div>

        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
          <ShoppingCart className="w-56 h-56" />
        </div>
      </div>

      {/* Notification banner */}
      {actionNotice && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex flex-wrap items-center justify-between gap-3 border ${
            actionNotice.type === 'success'
              ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
              : 'bg-red-100 border-red-300 text-red-950'
          }`}
        >
          <div className="flex items-center gap-2 flex-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{actionNotice.message}</span>
          </div>

          <div className="flex items-center gap-2">
            {currentUser?.role === 'cafe' && actionNotice.type === 'success' && (
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-3 py-1.5 rounded-xl bg-stone-900 text-amber-300 hover:bg-stone-800 text-xs font-black transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                Buka Bar & Cetak Stiker Gelas
              </button>
            )}
            {currentUser?.role === 'roaster' && actionNotice.type === 'success' && (
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setRoasterActiveTab('purchasing');
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-900 text-orange-300 hover:bg-stone-800 text-xs font-black transition-all flex items-center gap-1.5 shadow-xs"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-orange-400" />
                Tanda Tangani di Purchasing
              </button>
            )}
            <button onClick={() => setActionNotice(null)} className="hover:opacity-75 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Category Filter Pills (5 Utama) */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Semua Kategori ({unifiedMarketplaceItems.length})
          </button>

          {(Object.keys(categoryMeta) as MarketplaceCategory[]).map((catKey) => {
            const meta = categoryMeta[catKey];
            const isSelected = selectedCategory === catKey;
            const count = unifiedMarketplaceItems.filter((i) => i.category === catKey).length;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs font-black'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {meta.icon}
                {meta.label}
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-stone-950 text-white' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Secondary Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari varietas (Typica, Gayo), asal kebun, tasting notes (Peach, Floral), atau penjual..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>

        {/* Filter Seller Role */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Penjual:
          </span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole | 'all')}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Semua Penjual</option>
            <option value="petani">Petani Kopi</option>
            <option value="pengolah">Stasiun Pengolah</option>
            <option value="gudang">Gudang / Eksportir</option>
            <option value="roaster">Artisan Roastery</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Urutan:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="default">Rekomendasi Rantai Pasok</option>
            <option value="price_asc">Harga Terendah</option>
            <option value="price_desc">Harga Tertinggi</option>
            <option value="sca_desc">Skor SCA Tertinggi</option>
            <option value="stock_desc">Stok Tersedia Terbanyak</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {sortedItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <ShoppingCart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">
            Tidak ada komoditas yang cocok dengan kriteria pencarian
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Coba ganti filter kategori, kosongkan kata kunci pencarian, atau tambahkan produk baru dari dashboard masing-masing akun.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedItems.map((item) => {
            const meta = categoryMeta[item.category];
            return (
              <div
                key={`${item.category}-${item.id}`}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Category Banner (Clickable to view detail) */}
                  <div
                    onClick={() => setSelectedDetailItem(item)}
                    className="relative h-44 bg-stone-900 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-0.5 rounded-md">
                      {item.id}
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-xs ${meta.badgeClass}`}
                      >
                        {meta.label.split(' ')[0]} {meta.label.split(' ')[1] || ''}
                      </span>
                    </div>

                    {item.scaScore && (
                      <div className="absolute bottom-3 left-3 bg-amber-400 text-stone-950 px-2 py-0.5 rounded-lg text-xs font-black flex items-center gap-1 shadow-sm">
                        <Award className="w-3.5 h-3.5" />
                        SCA: {item.scaScore}
                      </div>
                    )}

                    {item.gradeTier && (
                      <div className="absolute bottom-3 right-3 bg-stone-900/90 backdrop-blur-xs text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-sm">
                        <span>✨ {item.gradeTier.split(' - ')[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    {/* Seller Details */}
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
                      <div className="flex items-center gap-1.5 text-stone-600">
                        <Building2 className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-semibold text-stone-800 truncate max-w-[170px]">
                          {item.sellerName}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                        {item.sellerRole}
                      </span>
                    </div>

                    {/* Title & Origin */}
                    <div>
                      <h3
                        onClick={() => setSelectedDetailItem(item)}
                        className="font-bold text-base text-stone-900 leading-snug group-hover:text-amber-800 transition-colors cursor-pointer"
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        {item.origin}
                      </p>
                    </div>

                    {/* Technical Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-2 bg-stone-50/80 rounded-xl p-2.5 border border-stone-100">
                      {item.specsSummary.map((spec, idx) => (
                        <div key={idx}>
                          <span className="text-[10px] text-stone-400 block">{spec.label}:</span>
                          <span className="font-semibold text-stone-800 truncate block">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tasting notes */}
                    {item.tastingNotes.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 block mb-1">
                          Flavor / Atribut:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {item.tastingNotes.map((note, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Traceability Trigger */}
                    {item.canTrace && (
                      <button
                        onClick={() => setTraceItem(item.rawItem)}
                        className="w-full py-2 px-3 rounded-xl bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-amber-200/80"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Lihat Silsilah Traceability (Farm-to-Cup)
                      </button>
                    )}

                    {/* Farmer Cherry Barcode & Spec Trigger */}
                    {item.category === 'cherry' && (
                      <button
                        type="button"
                        onClick={() => setBarcodeLot(item.rawItem as FarmerHarvestLot)}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-50/90 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-emerald-200 shadow-2xs"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                        🏷️ Barcode Karung (Scan Spek)
                      </button>
                    )}

                    {/* Processor Green Bean Barcode & Spec Trigger */}
                    {item.category === 'green_bean_processor' && (
                      <button
                        type="button"
                        onClick={() => setProcessorBarcodeLot(item.rawItem as ProcessedGreenBeanLot)}
                        className="w-full py-2 px-3 rounded-xl bg-amber-50/90 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-amber-200 shadow-2xs"
                      >
                        <QrCode className="w-3.5 h-3.5 text-amber-800" />
                        🏷️ Barcode Mutu & Limbah (Scan Spek)
                      </button>
                    )}

                    {/* Warehouse Green Bean Barcode & Grading Trigger */}
                    {item.category === 'green_bean_warehouse' && (
                      <button
                        type="button"
                        onClick={() => setWarehouseBarcodeLot(item.rawItem as WarehouseLot)}
                        className="w-full py-2 px-3 rounded-xl bg-blue-50/90 hover:bg-blue-100 text-blue-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-blue-200 shadow-2xs"
                      >
                        <QrCode className="w-3.5 h-3.5 text-blue-800" />
                        🏷️ Barcode Grading Gudang (Scan Spek)
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Footer: Pricing & Buy Action */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block">
                      Stok: {item.availableStock} {item.stockUnit}
                    </span>
                    <span className="text-base font-black text-stone-900">
                      Rp {item.price.toLocaleString()}
                      <span className="text-xs font-normal text-stone-500"> {item.priceUnit}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDetailItem(item)}
                      className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors flex items-center gap-1 border border-stone-200"
                      title="Lihat Detail Lengkap"
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-600" />
                      Detail
                    </button>

                    <button
                      onClick={() => handleOpenBuy(item)}
                      className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Beli
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Beli Universal dari Marketplace */}
      {buyingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-linear-to-r from-stone-900 to-amber-950 text-white p-6 relative">
              <button
                onClick={() => setBuyingItem(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <ShoppingCart className="w-3.5 h-3.5" />
                Formulir Pemesanan Marketplace Bersama
              </div>
              <h2 className="text-xl font-black">{buyingItem.title}</h2>
              <p className="text-xs text-stone-300 mt-1">
                Penjual: {buyingItem.sellerName} ({buyingItem.sellerOrg}) • {buyingItem.origin}
              </p>
            </div>

            <form onSubmit={handleConfirmPurchase} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Jumlah yang Dipesan ({buyingItem.stockUnit}) - Tersedia: {buyingItem.availableStock} {buyingItem.stockUnit}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={buyingItem.availableStock}
                  value={buyQuantity}
                  onChange={(e) => setBuyQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Cost Calculation Summary */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2">
                <div className="flex justify-between text-stone-600">
                  <span>Harga Satuan:</span>
                  <span>
                    Rp {buyingItem.price.toLocaleString()} {buyingItem.priceUnit}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Kuantitas Pembelian:</span>
                  <span>
                    {buyQuantity} {buyingItem.stockUnit}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Pembeli:</span>
                  <span className="font-semibold text-stone-800">
                    {currentUser?.name} ({currentUser?.organization})
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Transaksi:</span>
                  <span className="text-amber-900">
                    Rp {(buyQuantity * buyingItem.price).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Context Hint & Barcode Preview */}
              {buyingItem.category === 'cherry' && (
                <div className="space-y-2">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                    💡 <strong>Info Pengolah:</strong> Setelah ceri ini dibeli, Anda dapat langsung mengolahnya menjadi Green Bean di tab <em>Dashboard Pengolah</em>.
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setBarcodeLot(buyingItem.rawItem as FarmerHarvestLot)}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1.5 underline underline-offset-2"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      Lihat Stiker Barcode & Pratinjau Spesifikasi Lot
                    </button>
                  </div>
                </div>
              )}

              {buyingItem.category === 'roasted_bean' && currentUser?.role === 'cafe' && (
                <div className="p-3 bg-stone-100 border border-stone-300 rounded-xl text-[11px] text-stone-800">
                  💡 <strong>Info Coffee Shop:</strong> Roasted beans yang dibeli akan langsung masuk ke <em>Barista Bar</em> di dashboard Anda dan siap disajikan ke pelanggan.
                </div>
              )}

              {isRoasterGreenBeanPurchase && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-[11px] text-orange-900">
                  💡 <strong>Info Roaster:</strong> Pembelian ini akan dibuat sebagai Purchase Order berstatus
                  "Menunggu Persetujuan". Tanda tangani secara digital di modul <em>Purchasing</em> agar barang bisa
                  diterima &amp; masuk antrean QC di Inventory.
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setBuyingItem(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-800 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isRoasterGreenBeanPurchase ? 'Beli & Ajukan PO' : 'Konfirmasi Pembelian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Silsilah Traceability Modal */}
      <TraceabilityModal
        isOpen={!!traceItem}
        onClose={() => setTraceItem(null)}
        data={traceItem}
      />

      {/* Farmer Barcode & Stiker Karung Modal */}
      <FarmerBarcodeModal
        isOpen={!!barcodeLot}
        onClose={() => setBarcodeLot(null)}
        lot={barcodeLot}
        isNewUpload={false}
      />

      {/* Processor Barcode & Stiker Karung Green Bean Modal */}
      <ProcessorBarcodeModal
        isOpen={!!processorBarcodeLot}
        onClose={() => setProcessorBarcodeLot(null)}
        lot={processorBarcodeLot}
        isNewProcess={false}
      />

      {/* Warehouse Barcode & Stiker Karung Grading Modal */}
      <WarehouseBarcodeModal
        isOpen={!!warehouseBarcodeLot}
        onClose={() => setWarehouseBarcodeLot(null)}
        lot={warehouseBarcodeLot}
        isNewGrading={false}
      />

      {/* Modal Detail Produk Terpadu */}
      <ProductDetailModal
        isOpen={!!selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        item={selectedDetailItem}
        onBuy={(item) => handleOpenBuy(item)}
        onOpenBarcode={(lot) => setBarcodeLot(lot)}
        onOpenProcessorBarcode={(lot) => setProcessorBarcodeLot(lot)}
        onOpenWarehouseBarcode={(lot) => setWarehouseBarcodeLot(lot)}
        onOpenTraceability={(rawItem) => setTraceItem(rawItem)}
      />
    </div>
  );
};
