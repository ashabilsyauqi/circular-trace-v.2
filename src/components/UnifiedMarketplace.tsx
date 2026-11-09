import React, { useState, useMemo } from 'react';
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
  Plus,
  PackagePlus,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { TraceabilityModal } from './TraceabilityModal';
import { FarmerBarcodeModal } from './FarmerBarcodeModal';
import { ProcessorBarcodeModal } from './ProcessorBarcodeModal';
import { WarehouseBarcodeModal } from './WarehouseBarcodeModal';
import { BuyerTokopediaGateModal } from './buyer/BuyerTokopediaGateModal';
import { TokopediaCartModal, CartItem } from './buyer/TokopediaCartModal';
import { ArrowRight } from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';
import { LaunchToMarketplaceModal } from './marketplace/LaunchToMarketplaceModal';
import { ProcessedGreenBeanLot, WarehouseLot } from '../types/coffee';
import { VerificationStampBadge } from './shared/VerificationStampBadge';
import { WhatsAppIcon, openOrderWhatsApp, getSellerWhatsAppNumber } from '../utils/whatsapp';


export interface CoffeeRegionOption {
  id: string;
  label: string;
  province: string;
  keywords: string[];
}

export const COFFEE_REGIONS: CoffeeRegionOption[] = [
  {
    id: 'pangalengan',
    label: 'Pangalengan (Jawa Barat)',
    province: 'Jawa Barat',
    keywords: ['pangalengan', 'margamukti', 'sukaluyu', 'malabar', 'tilu', 'preanger', 'bandung', 'pasir kunci', 'cukul'],
  },
  {
    id: 'gayo',
    label: 'Aceh Gayo (Sumatera)',
    province: 'Aceh',
    keywords: ['gayo', 'takengon', 'bener meriah', 'pantan musara', 'aceh', 'burni telong', 'pegasing', 'wih pesam'],
  },
  {
    id: 'kintamani',
    label: 'Kintamani (Bali)',
    province: 'Bali',
    keywords: ['kintamani', 'bali', 'ulian', 'belancan', 'bangli', 'batur'],
  },
  {
    id: 'bajawa',
    label: 'Bajawa Flores (NTT)',
    province: 'Nusa Tenggara Timur',
    keywords: ['bajawa', 'flores', 'ngada', 'rowa', 'radabata', 'inerie', 'ntt', 'boawae'],
  },
  {
    id: 'solok',
    label: 'Solok Radjo (Sumatera Barat)',
    province: 'Sumatera Barat',
    keywords: ['solok', 'gumanti', 'aie dingin', 'sumatera barat', 'sumbar'],
  },
];

export function itemMatchesRegion(originStr: string | undefined, regionId: string): boolean {
  if (regionId === 'all') return true;
  if (!originStr) return false;
  const region = COFFEE_REGIONS.find((r) => r.id === regionId);
  if (!region) return originStr.toLowerCase().includes(regionId.toLowerCase());
  const s = originStr.toLowerCase();
  return region.keywords.some((kw) => s.includes(kw));
}

export const UnifiedMarketplace: React.FC = () => {
  const {
    currentUser,
    unifiedMarketplaceItems,
    buyFromUnifiedMarketplace,
    createPOFromMarketplace,
    setActiveView,
    setRoasterActiveTab,
    navigate,
    language,
    t,
    cartItems: globalCartItems,
    addToCart,
  } = useCoffee();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | 'all'>('all');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [minScaScore, setMinScaScore] = useState<number>(0);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [tempMinPrice, setTempMinPrice] = useState('');
  const [tempMaxPrice, setTempMaxPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'sca_desc' | 'stock_desc'>('default');

  // Launch to Marketplace Modal State
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);

  // Modal State for Purchasing
  const [buyingItem, setBuyingItem] = useState<UnifiedMarketplaceItem | null>(null);
  const [buyQuantity, setBuyQuantity] = useState<number>(1);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Tokopedia Buyer Gate & Cart States
  const [gateModalOpen, setGateModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<UnifiedMarketplaceItem | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Traceability Modal State
  const [traceItem, setTraceItem] = useState<any | null>(null);

  // Barcode Lot Modals
  const [barcodeLot, setBarcodeLot] = useState<FarmerHarvestLot | null>(null);
  const [processorBarcodeLot, setProcessorBarcodeLot] = useState<ProcessedGreenBeanLot | null>(null);
  const [warehouseBarcodeLot, setWarehouseBarcodeLot] = useState<WarehouseLot | null>(null);

  // Product Detail Modal State
  const [selectedDetailItem, setSelectedDetailItem] = useState<UnifiedMarketplaceItem | null>(null);

  const isBuyerMember = !!currentUser && (currentUser.role === 'buyer' || currentUser.isSuperAdmin);

  // Selected Origin Label for Display
  const selectedOriginLabel = useMemo(() => {
    if (selectedOrigin === 'all') return 'Semua Origin';
    const region = COFFEE_REGIONS.find((r) => r.id === selectedOrigin);
    return region ? region.label : selectedOrigin;
  }, [selectedOrigin]);

  // Faceted counts: items matching other filters excluding Category
  const itemsMatchingNonCategory = useMemo(() => {
    return unifiedMarketplaceItems.filter((item) => {
      const matchOrigin = selectedOrigin === 'all' || itemMatchesRegion(item.origin, selectedOrigin);
      const matchRole = selectedRole === 'all' || item.sellerRole === selectedRole;
      const isItemVerified = item.verificationStatus === 'verified' || !!item.verificationStamp;
      const matchVerified = !onlyVerified || isItemVerified;
      const matchSca = minScaScore === 0 || ((item.scaScore || 0) >= minScaScore);
      const matchMinPrice = minPrice === null || item.price >= minPrice;
      const matchMaxPrice = maxPrice === null || item.price <= maxPrice;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        item.title.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q) ||
        item.variety.toLowerCase().includes(q) ||
        item.sellerName.toLowerCase().includes(q) ||
        item.tastingNotes.some((t) => t.toLowerCase().includes(q))
      );
      return matchOrigin && matchRole && matchVerified && matchSca && matchMinPrice && matchMaxPrice && matchSearch;
    });
  }, [unifiedMarketplaceItems, selectedOrigin, selectedRole, onlyVerified, minScaScore, minPrice, maxPrice, searchQuery]);

  // Faceted counts: items matching other filters excluding Origin
  const itemsMatchingNonOrigin = useMemo(() => {
    return unifiedMarketplaceItems.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchRole = selectedRole === 'all' || item.sellerRole === selectedRole;
      const isItemVerified = item.verificationStatus === 'verified' || !!item.verificationStamp;
      const matchVerified = !onlyVerified || isItemVerified;
      const matchSca = minScaScore === 0 || ((item.scaScore || 0) >= minScaScore);
      const matchMinPrice = minPrice === null || item.price >= minPrice;
      const matchMaxPrice = maxPrice === null || item.price <= maxPrice;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        item.title.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q) ||
        item.variety.toLowerCase().includes(q) ||
        item.sellerName.toLowerCase().includes(q) ||
        item.tastingNotes.some((t) => t.toLowerCase().includes(q))
      );
      return matchCategory && matchRole && matchVerified && matchSca && matchMinPrice && matchMaxPrice && matchSearch;
    });
  }, [unifiedMarketplaceItems, selectedCategory, selectedRole, onlyVerified, minScaScore, minPrice, maxPrice, searchQuery]);

  const categoryMeta: Record<
    MarketplaceCategory,
    { label: string; icon: React.ReactNode; color: string; badgeClass: string }
  > = {
    cherry: {
      label: 'Ceri Kopi Segar (Panen)',
      icon: <Sprout className="w-4 h-4 text-orange-600" />,
      color: 'border-orange-200 bg-orange-50 text-orange-700',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    green_bean_processor: {
      label: 'Green Bean Olahan (Mill)',
      icon: <Cog className="w-4 h-4 text-emerald-700" />,
      color: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    green_bean_warehouse: {
      label: 'Green Bean Gudang Ekspor',
      icon: <Warehouse className="w-4 h-4 text-emerald-700" />,
      color: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    roasted_bean: {
      label: 'Biji Kopi Sangrai (Roasted)',
      icon: <Flame className="w-4 h-4 text-amber-700" />,
      color: 'border-amber-200 bg-amber-50 text-amber-700',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  };

  const formatUnitDisplay = (unitStr?: string) => {
    if (!unitStr) return '/ kg';
    const clean = unitStr.replace(/^\/+/, '').trim();
    return clean ? `/ ${clean}` : '/ kg';
  };

  const handleAddToCart = (item: UnifiedMarketplaceItem) => {
    if (!isBuyerMember) {
      setPendingItem(item);
      setGateModalOpen(true);
      return;
    }
    setCartItems((prev) => {
      const idx = prev.findIndex((c) => c.item.id === item.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...prev, { item, quantity: 1 }];
    });
    setActionNotice({
      type: 'success',
      message: `${item.title} berhasil ditambahkan ke Keranjang Belanja!`,
    });
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleApplyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const min = tempMinPrice.trim() !== '' ? Number(tempMinPrice) : null;
    const max = tempMaxPrice.trim() !== '' ? Number(tempMaxPrice) : null;
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedRole('all');
    setSelectedOrigin('all');
    setMinScaScore(0);
    setOnlyVerified(false);
    setMinPrice(null);
    setMaxPrice(null);
    setTempMinPrice('');
    setTempMaxPrice('');
    setSearchQuery('');
    setSortBy('default');
  };

  // Filter items
  const filteredItems = unifiedMarketplaceItems.filter((item) => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchRole = selectedRole === 'all' || item.sellerRole === selectedRole;
    const isItemVerified = item.verificationStatus === 'verified' || !!item.verificationStamp;
    const matchVerified = !onlyVerified || isItemVerified;
    const matchOrigin = selectedOrigin === 'all' || itemMatchesRegion(item.origin, selectedOrigin);
    const matchSca = minScaScore === 0 || ((item.scaScore || 0) >= minScaScore);
    const matchMinPrice = minPrice === null || item.price >= minPrice;
    const matchMaxPrice = maxPrice === null || item.price <= maxPrice;

    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.title.toLowerCase().includes(q) ||
      item.origin.toLowerCase().includes(q) ||
      item.variety.toLowerCase().includes(q) ||
      item.sellerName.toLowerCase().includes(q) ||
      item.tastingNotes.some((t) => t.toLowerCase().includes(q));

    return matchCategory && matchRole && matchVerified && matchOrigin && matchSca && matchMinPrice && matchMaxPrice && matchSearch;
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
    if (!isBuyerMember) {
      setPendingItem(item);
      setGateModalOpen(true);
      return;
    }
    setBuyingItem(item);
    if (item.category === 'cherry') {
      setBuyQuantity(Math.min(item.availableStock, 100));
    } else if (item.category === 'green_bean_processor' || item.category === 'green_bean_warehouse') {
      setBuyQuantity(Math.min(item.availableStock, 30));
    } else {
      setBuyQuantity(Math.min(item.availableStock, 5));
    }
  };

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

﻿  return (
    <div className="space-y-5 pb-20">
      {/* Notification banner */}
      {actionNotice && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex flex-wrap items-center justify-between gap-3 border animate-in fade-in ${
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
                className="px-3 py-1.5 rounded-xl bg-stone-900 text-amber-300 hover:bg-stone-800 text-xs font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
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
                className="px-3 py-1.5 rounded-xl bg-stone-900 text-orange-300 hover:bg-stone-800 text-xs font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-orange-400" />
                Tanda Tangani di Purchasing
              </button>
            )}
            <button onClick={() => setActionNotice(null)} className="hover:opacity-75 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TOP SEARCH BAR (NO HERO SECTION - Direct clean search header) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div id="tour-search-bar" className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kopi specialty, varietas (Typica, Bourbon), origin (Solok, Gayo, Kerinci), roastery..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-normal focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Sort Dropdown */}
          <div id="tour-sort-select" className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-2xl border border-stone-200 w-full sm:w-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-stone-800 focus:outline-none cursor-pointer w-full"
              >
                <option value="default">Urutkan: Rekomendasi</option>
                <option value="price_asc">Harga: Termurah</option>
                <option value="price_desc">Harga: Termahal</option>
                <option value="sca_desc">Skor SCA: Tertinggi</option>
                <option value="stock_desc">Stok: Terbanyak</option>
              </select>
            </div>


          </div>
        </div>

        {/* Results Summary & Active Filter Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-stone-100 text-xs">
          <span className="text-stone-500 font-medium">
            Menampilkan <strong className="text-stone-900 font-bold">{sortedItems.length}</strong> produk kopi specialty terdaftar
          </span>

          {/* Active filter chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                <span>{categoryMeta[selectedCategory].label.split(' ')[0]} {categoryMeta[selectedCategory].label.split(' ')[1] || ''}</span>
                <button onClick={() => setSelectedCategory('all')} className="hover:text-red-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedOrigin !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                <span>Asal: {selectedOriginLabel}</span>
                <button onClick={() => setSelectedOrigin('all')} className="hover:text-red-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {minScaScore > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                <span>SCA &ge; {minScaScore}</span>
                <button onClick={() => setMinScaScore(0)} className="hover:text-red-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {onlyVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
                <span>✓ Terverifikasi Audit</span>
                <button onClick={() => setOnlyVerified(false)} className="hover:text-red-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(minPrice !== null || maxPrice !== null) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                <span>Rp {(minPrice || 0).toLocaleString()} - Rp {(maxPrice || 999999).toLocaleString()}</span>
                <button onClick={() => { setMinPrice(null); setMaxPrice(null); setTempMinPrice(''); setTempMaxPrice(''); }} className="hover:text-red-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(selectedCategory !== 'all' || selectedOrigin !== 'all' || minScaScore > 0 || onlyVerified || minPrice !== null || maxPrice !== null || selectedRole !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-red-500 hover:underline font-bold ml-1 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Semua</span>
              </button>
            )}
          </div>
        </div>
      </div>

﻿      {/* MAIN 2-COLUMN LAYOUT: Carded Filter Sidebar (Left) + Products Grid (Right) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">

        {/* SIDEBAR CARDED FILTERS (Just like Tokopedia) */}
        <aside className="w-full lg:w-64 xl:w-72 shrink-0 space-y-3.5">
          {/* Filter Header Box */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span className="font-extrabold text-xs text-stone-900 uppercase tracking-wider">
                Filter Pencarian
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors hover:underline cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* CARD 1: Kategori Produk */}
          <div id="tour-category-filter" className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <h4 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Kategori Komoditas
            </h4>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center justify-between cursor-pointer border-l-4 ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold'
                    : 'border-transparent text-slate-700 hover:bg-slate-50 font-normal'
                }`}
              >
                <span>Semua Kategori</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  selectedCategory === 'all' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {itemsMatchingNonCategory.length}
                </span>
              </button>

              {(Object.keys(categoryMeta) as MarketplaceCategory[]).map((catKey) => {
                const meta = categoryMeta[catKey];
                const count = itemsMatchingNonCategory.filter((i) => i.category === catKey).length;
                const isSelected = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    disabled={count === 0}
                    onClick={() => setSelectedCategory(isSelected ? 'all' : catKey)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center justify-between border-l-4 ${
                      count === 0
                        ? 'border-transparent text-slate-400 opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold cursor-pointer'
                        : 'border-transparent text-slate-700 hover:bg-slate-50 font-normal cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {meta.icon}
                      <span className="truncate">{meta.label}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD 2: Wilayah Origin Nusantara */}
          <div id="tour-origin-filter" className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <h4 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Wilayah Origin Nusantara</span>
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
            </h4>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedOrigin('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center justify-between cursor-pointer border-l-4 ${
                  selectedOrigin === 'all'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold'
                    : 'border-transparent text-slate-700 hover:bg-slate-50 font-normal'
                }`}
              >
                <span>Semua Wilayah</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  selectedOrigin === 'all' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {itemsMatchingNonOrigin.length}
                </span>
              </button>

              {COFFEE_REGIONS.map((region) => {
                const count = itemsMatchingNonOrigin.filter((i) => itemMatchesRegion(i.origin, region.id)).length;
                const isSelected = selectedOrigin === region.id;
                return (
                  <button
                    key={region.id}
                    type="button"
                    disabled={count === 0}
                    onClick={() => setSelectedOrigin(isSelected ? 'all' : region.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center justify-between border-l-4 ${
                      count === 0
                        ? 'border-transparent text-slate-400 opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold cursor-pointer'
                        : 'border-transparent text-slate-700 hover:bg-slate-50 font-normal cursor-pointer'
                    }`}
                  >
                    <span className="truncate">{region.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD 3: Rentang Harga (Rp) */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 pb-1.5 border-b border-stone-100">
              Rentang Harga (Rp)
            </h4>
            <form onSubmit={handleApplyPriceFilter} className="space-y-2">
              <div className="space-y-1">
                <span className="text-[10px] text-stone-400">Harga Minimal</span>
                <input
                  type="number"
                  placeholder="Rp 0"
                  value={tempMinPrice}
                  onChange={(e) => setTempMinPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-none focus:border-[#00AA5B]"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-stone-400">Harga Maksimal</span>
                <input
                  type="number"
                  placeholder="Rp 500.000"
                  value={tempMaxPrice}
                  onChange={(e) => setTempMaxPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-none focus:border-[#00AA5B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Terapkan Harga
              </button>
            </form>
          </div>

          {/* CARD 4: Skor SCA Cupping */}
          <div id="tour-sca-filter" className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 pb-1.5 border-b border-stone-100 flex items-center justify-between">
              <span>Skor Cupping SCA</span>
              <Award className="w-3.5 h-3.5 text-amber-500" />
            </h4>
            <div className="space-y-1.5">
              {[
                { score: 0, label: 'Semua Skor' },
                { score: 86, label: 'SCA 86+ (Specialty Superior)' },
                { score: 84, label: 'SCA 84+ (Specialty Standard)' },
              ].map((s) => (
                <label key={s.score} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="radio"
                    name="scaScoreFilter"
                    checked={minScaScore === s.score}
                    onChange={() => setMinScaScore(s.score)}
                    className="accent-emerald-600"
                  />
                  <span className="font-medium">{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* CARD 5: Sertifikasi & Standar Sirkular */}
          <div id="tour-eudr-filter" className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 pb-1.5 border-b border-stone-100 flex items-center justify-between">
              <span>Sertifikasi Hijau</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </h4>
            <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="accent-emerald-600"
              />
              <span className="font-bold text-emerald-800">
                ✓ Lulus Verifikasi Audit &amp; EUDR
              </span>
            </label>
          </div>

          {/* CARD 6: Peran Penjual / Koperasi */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 pb-1.5 border-b border-stone-100">
              Tipe Penjual
            </h4>
            <div className="space-y-1.5">
              {[
                { id: 'all', label: 'Semua Penjual' },
                { id: 'petani', label: 'Petani (Kebun Mandiri)' },
                { id: 'pengolah', label: 'Pengolah (Mill Basah/Kering)' },
                { id: 'gudang', label: 'Gudang Silo Ekspor' },
                { id: 'roaster', label: 'Roastery Kopi' },
              ].map((r) => (
                <label key={r.id} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="radio"
                    name="sellerRoleFilter"
                    checked={selectedRole === r.id}
                    onChange={() => setSelectedRole(r.id as any)}
                    className="accent-emerald-600"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reset All Button */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 active:scale-98 text-stone-800 text-xs font-extrabold rounded-xl border border-stone-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Semua Filter</span>
          </button>
        </aside>

        {/* RIGHT COLUMN: Products Grid */}
        <section className="flex-1 min-w-0 space-y-4">

      {/* Items Grid */}
      {sortedItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-stone-200 shadow-2xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#00AA5B] flex items-center justify-center mx-auto shadow-2xs">
            <Search className="w-8 h-8 text-[#00AA5B]" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-extrabold text-stone-900 tracking-tight">
              {t('market.empty.title')}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {t('market.empty.desc')}
            </p>
          </div>

          {/* Quick Recovery Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {selectedOrigin !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedOrigin('all')}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#00AA5B] text-xs font-bold border border-emerald-300/80 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <span>Hapus Filter Origin ({selectedOriginLabel})</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#00AA5B] text-xs font-bold border border-emerald-300/80 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <span>Tampilkan Semua Kategori</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-[#00AA5B] hover:bg-[#03AC0E] text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Semua Filter</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {sortedItems.map((item, index) => {
            const meta = categoryMeta[item.category];
            return (
              <div
                id={index === 0 ? 'tour-first-product-card' : undefined}
                key={`${item.category}-${item.id}`}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  navigate({ view: 'product', lotId: item.id });
                }}
                className="group relative bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden h-full cursor-pointer"
              >
                <div>
                  {/* Photo Banner (Aspect Ratio 16:9 Standar Design System) */}
                  <div
                    onClick={() => navigate({ view: 'product', lotId: item.id })}
                    className="relative aspect-video w-full bg-slate-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Top-Left: Commodity Category Pill (Spec Semantic Tokens) */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg shadow-xs backdrop-blur-xs border flex items-center gap-1.5 ${meta.badgeClass}`}
                      >
                        {meta.icon}
                        <span>{meta.label.split(' ')[0]} {meta.label.split(' ')[1] || ''}</span>
                      </span>
                    </div>

                    {/* Top-Right: Verified Stamp */}
                    {(item.verificationStamp || item.verificationStatus === 'verified') && (
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Verified</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2">
                    {/* Row 1: Origin Location & Seller */}
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.origin.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate max-w-[130px]" title={item.sellerName}>
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate text-xs font-medium">{item.sellerName}</span>
                      </div>
                    </div>

                    {/* Row 2: Product Title (text-card-title: 16px, Semibold 600) */}
                    <h3
                      onClick={() => navigate({ view: 'product', lotId: item.id })}
                      className="text-base font-semibold text-slate-900 group-hover:text-emerald-700 leading-snug line-clamp-2 cursor-pointer transition-colors"
                      title={item.title}
                    >
                      {item.title}
                    </h3>

                    {/* Row 3: Metadata Inline (Varietas • Elevasi mdpl Ringkas) */}
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 pt-0.5">
                      <span className="truncate">
                        {[
                          item.variety,
                          item.altitude || (item.specsSummary && item.specsSummary[0]?.value)
                        ].filter(Boolean).join(' • ')}
                      </span>
                      {item.scaScore && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md shrink-0 ml-auto">
                          <Award className="w-3 h-3 text-amber-600" />
                          <span>SCA {item.scaScore}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Clear Price/Stock & Simplified CTA Architecture */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 space-y-3">
                  {/* Price & Stock Row */}
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block mb-0.5">
                        Harga Penawaran
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-slate-900 tracking-tight">
                          Rp {item.price.toLocaleString(language === 'id' ? 'id-ID' : 'en-US')}
                        </span>
                        <span className="text-xs font-normal text-slate-500">
                          {formatUnitDisplay(item.priceUnit)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg shadow-2xs whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        Stok: {item.availableStock.toLocaleString(language === 'id' ? 'id-ID' : 'en-US')} {(item.stockUnit || 'kg').replace(/^\/+/, '').trim()}
                      </span>
                    </div>
                  </div>

                  {/* Actions Row (CTA Architecture: Single wide Beli Langsung + Secondary Cart & WA Icons) */}
                  <div className="flex items-center gap-2 pt-0.5">
                    {/* Secondary WhatsApp */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!isBuyerMember) {
                          setPendingItem(item);
                          setGateModalOpen(true);
                          return;
                        }
                        openOrderWhatsApp({
                          item,
                          quantity: 1,
                          buyerName: currentUser?.name,
                          buyerOrg: currentUser?.organization,
                          buyerRole: currentUser?.role,
                        });
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-emerald-700 transition-colors shadow-2xs shrink-0 cursor-pointer"
                      title="Hubungi Penjual via WhatsApp"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                    </button>

                    {/* Secondary Add to Cart */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-2xs shrink-0 cursor-pointer"
                      title="Tambah ke Keranjang Belanja"
                    >
                      <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    </button>

                    {/* Primary Wide Action: Beli Langsung */}
                    <button
                      type="button"
                      onClick={() => handleOpenBuy(item)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                      title="Beli Langsung Komoditas Ini"
                    >
                      <span>Beli Langsung</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

        </section>
      </div>

      {/* Modal Beli Universal dari Marketplace */}

      {buyingItem && (

        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 relative">
              <button
                onClick={() => setBuyingItem(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <ShoppingCart className="w-3.5 h-3.5" />
                {t('market.orderModal.badge')}
              </div>
              <h2 className="text-xl font-black">{buyingItem.title}</h2>
              <p className="text-xs text-stone-300 mt-1">
                {language === 'en' ? 'Seller:' : 'Penjual:'} {buyingItem.sellerName} ({buyingItem.sellerOrg}) • {buyingItem.origin}
              </p>
            </div>

            <form onSubmit={handleConfirmPurchase} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t('market.orderModal.qtyLabel')} ({buyingItem.stockUnit}) - {t('market.orderModal.available')} {buyingItem.availableStock} {buyingItem.stockUnit}
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
                      Lihat Stiker Barcode & Scan Spesifikasi Lot
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

              {/* WhatsApp Seller Contact Card Preview */}
              {(() => {
                const { phoneDisplay } = getSellerWhatsAppNumber(buyingItem);
                return (
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <WhatsAppIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-emerald-950">
                          Kontak WhatsApp Penjual ({buyingItem.sellerName})
                        </div>
                        <div className="text-[11px] text-emerald-700 font-mono">
                          {phoneDisplay}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        openOrderWhatsApp({
                          item: buyingItem,
                          quantity: buyQuantity,
                          buyerName: currentUser?.name,
                          buyerOrg: currentUser?.organization,
                          buyerRole: currentUser?.role,
                        })
                      }
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                      Chat Penjual
                    </button>
                  </div>
                );
              })()}

              <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setBuyingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  {t('market.orderModal.cancel')}
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openOrderWhatsApp({
                        item: buyingItem,
                        quantity: buyQuantity,
                        buyerName: currentUser?.name,
                        buyerOrg: currentUser?.organization,
                        buyerRole: currentUser?.role,
                      })
                    }
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap cursor-pointer hover:shadow-emerald-600/30"
                    title="Pesan komoditas ini langsung via WhatsApp ke nomor penjual"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    {language === 'en' ? 'Order via WhatsApp' : 'Pesan Lewat WhatsApp'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 active:scale-95 text-white font-extrabold text-xs font-bold transition-colors shadow-md flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isRoasterGreenBeanPurchase
                        ? t('market.orderModal.submitPo')
                        : t('market.orderModal.submitDirect')}
                    </span>
                  </button>
                </div>
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

      {/* Modal Launch / Terbitkan Produk Baru ke Marketplace */}
      <LaunchToMarketplaceModal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        onSuccessNotice={(message) => {
          setActionNotice({ type: 'success', message });
          setTimeout(() => setActionNotice(null), 6000);
        }}
      />

      {/* Floating cart removed per user request */}

      {/* Buyer Member Registration & Verification Gate Modal */}
      <BuyerTokopediaGateModal
        isOpen={gateModalOpen}
        onClose={() => setGateModalOpen(false)}
        pendingBuyItemName={pendingItem?.title}
        onApprovedLogin={(buyer) => {
          if (pendingItem) {
            // Add pending item to cart and open Tokopedia Cart Modal
            setCartItems((prev) => {
              const idx = prev.findIndex((c) => c.item.id === pendingItem.id);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
                return updated;
              }
              return [...prev, { item: pendingItem, quantity: 1 }];
            });
            setTimeout(() => setIsCartOpen(true), 300);
          }
        }}
      />

      {/* Tokopedia Shopping Cart Modal */}
      <TokopediaCartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={(id, qty) =>
          setCartItems((prev) => prev.map((c) => (c.item.id === id ? { ...c, quantity: qty } : c)))
        }
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((c) => c.item.id !== id))}
        onClearCart={() => setCartItems([])}
        onSuccessOrder={() => {
          setActionNotice({
            type: 'success',
            message: 'Pesanan berhasil dibuat! Lihat riwayat transaksi di Portal Pembeli.',
          });
          setTimeout(() => setActionNotice(null), 4000);
        }}
      />
    </div>
  );
};
