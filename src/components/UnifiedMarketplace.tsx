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
  Plus,
  PackagePlus,
  ShieldCheck,
} from 'lucide-react';
import { TraceabilityModal } from './TraceabilityModal';
import { FarmerBarcodeModal } from './FarmerBarcodeModal';
import { ProcessorBarcodeModal } from './ProcessorBarcodeModal';
import { WarehouseBarcodeModal } from './WarehouseBarcodeModal';
import { ProductDetailModal } from './ProductDetailModal';
import { LaunchToMarketplaceModal } from './marketplace/LaunchToMarketplaceModal';
import { ProcessedGreenBeanLot, WarehouseLot } from '../types/coffee';
import { VerificationStampBadge } from './shared/VerificationStampBadge';
import { WhatsAppIcon, openOrderWhatsApp, getSellerWhatsAppNumber } from '../utils/whatsapp';

export const UnifiedMarketplace: React.FC = () => {
  const {
    currentUser,
    unifiedMarketplaceItems,
    buyFromUnifiedMarketplace,
    createPOFromMarketplace,
    setActiveView,
    setRoasterActiveTab,
    language,
    t,
  } = useCoffee();

  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | 'all'>('all');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'sca_desc' | 'stock_desc'>('default');
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Launch to Marketplace Modal State
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);

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
      label: t('market.cat.cherry'),
      icon: <Sprout className="w-4 h-4 text-emerald-600" />,
      color: 'border-emerald-300 bg-emerald-50 text-emerald-900',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    green_bean_processor: {
      label: t('market.cat.green_bean_processor'),
      icon: <Cog className="w-4 h-4 text-amber-600" />,
      color: 'border-amber-300 bg-amber-50 text-amber-900',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    green_bean_warehouse: {
      label: t('market.cat.green_bean_warehouse'),
      icon: <Warehouse className="w-4 h-4 text-blue-600" />,
      color: 'border-blue-300 bg-blue-50 text-blue-900',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    roasted_bean: {
      label: t('market.cat.roasted_bean'),
      icon: <Flame className="w-4 h-4 text-orange-600" />,
      color: 'border-orange-300 bg-orange-50 text-orange-900',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    },
  };

  // Filter items
  const filteredItems = unifiedMarketplaceItems.filter((item) => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchRole = selectedRole === 'all' || item.sellerRole === selectedRole;
    const isItemVerified = item.verificationStatus === 'verified' || !!item.verificationStamp;
    const matchVerified = !onlyVerified || isItemVerified;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.title.toLowerCase().includes(q) ||
      item.origin.toLowerCase().includes(q) ||
      item.variety.toLowerCase().includes(q) ||
      item.sellerName.toLowerCase().includes(q) ||
      item.tastingNotes.some((t) => t.toLowerCase().includes(q));

    return matchCategory && matchRole && matchVerified && matchSearch;
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
            {t('market.hero.tag')}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('market.hero.title')}
          </h1>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
            {t('market.hero.desc')}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-stone-300">
            <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs">
              {t('market.hero.total')} <strong className="text-amber-400">{unifiedMarketplaceItems.length} Listing</strong>
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs">
              {t('market.hero.activeUser')} <strong className="text-emerald-400">{currentUser?.name}</strong> ({currentUser?.organization})
            </span>
            <button
              onClick={() => setIsLaunchModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer ml-auto sm:ml-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              {t('market.hero.launchBtn')}
            </button>
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
            {t('market.cat.all')} ({unifiedMarketplaceItems.length})
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
            placeholder={t('market.search.placeholder')}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>

        {/* Filter Seller Role */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> {t('market.filter.seller')}
          </span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole | 'all')}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">{t('market.filter.allSellers')}</option>
            <option value="petani">{t('market.filter.farmer')}</option>
            <option value="pengolah">{t('market.filter.processor')}</option>
            <option value="gudang">{t('market.filter.warehouse')}</option>
            <option value="roaster">{t('market.filter.roaster')}</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> {t('market.sort.label')}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="default">{t('market.sort.default')}</option>
            <option value="price_asc">{t('market.sort.priceAsc')}</option>
            <option value="price_desc">{t('market.sort.priceDesc')}</option>
            <option value="sca_desc">{t('market.sort.scaDesc')}</option>
            <option value="stock_desc">{t('market.sort.stockDesc')}</option>
          </select>
        </div>

        {/* Verified Only Filter Toggle */}
        <button
          type="button"
          onClick={() => setOnlyVerified(!onlyVerified)}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
            onlyVerified
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-emerald-50'
          }`}
          title="Tampilkan hanya produk yang telah lulus verifikasi auditor"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-current" />
          <span>{onlyVerified ? t('market.filter.verifiedActive') : t('market.filter.verifiedOnly')}</span>
        </button>

        {/* Launch Button in Toolbar */}
        <button
          onClick={() => setIsLaunchModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer transition-all ml-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          {t('market.hero.launchBtnShort')}
        </button>
      </div>

      {/* Items Grid */}
      {sortedItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <ShoppingCart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">
            {t('market.empty.title')}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {t('market.empty.desc')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => {
            const meta = categoryMeta[item.category];
            return (
              <div
                key={`${item.category}-${item.id}`}
                className="group relative bg-white rounded-3xl border border-stone-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Photo & Category Banner (Clickable to view detail) */}
                  <div
                    onClick={() => setSelectedDetailItem(item)}
                    className="relative h-52 bg-stone-900 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-95"
                    />

                    {/* Gradient overlays for readability */}
                    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Left: Category Badge & ID */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs backdrop-blur-md border flex items-center gap-1 ${meta.badgeClass}`}
                      >
                        {meta.icon}
                        <span>{meta.label.split(' ')[0]} {meta.label.split(' ')[1] || ''}</span>
                      </span>
                      <span className="bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-mono px-2 py-1 rounded-lg border border-white/10">
                        {item.id}
                      </span>
                    </div>

                    {/* Top Right: Verified Badge (Hanya tampil jika sudah verified / ada stempel audit sah) */}
                    {(item.verificationStamp || item.verificationStatus === 'verified') && (
                      <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
                        {item.verificationStamp ? (
                          <VerificationStampBadge stamp={item.verificationStamp} size="sm" />
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-950 bg-emerald-400 border border-emerald-500 px-2.5 py-1 rounded-full shadow-sm backdrop-blur-xs">
                            <CheckCircle2 className="w-3 h-3 text-emerald-950" />
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bottom Left: SCA Score */}
                    {item.scaScore && (
                      <div className="absolute bottom-3 left-3 z-10 bg-amber-400 text-stone-950 px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 shadow-md">
                        <Award className="w-3.5 h-3.5 text-stone-950" />
                        <span>SCA {item.scaScore}</span>
                      </div>
                    )}

                    {/* Bottom Right: Grade Tier / Hover Indicator */}
                    {item.gradeTier ? (
                      <div className="absolute bottom-3 right-3 z-10 bg-stone-950/80 backdrop-blur-md text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-sm">
                        <span>✨ {item.gradeTier.split(' - ')[0]}</span>
                      </div>
                    ) : (
                      <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-md text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-stone-600" />
                        <span>{t('market.card.details')}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3.5">
                    {/* Seller Details & Origin */}
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
                      <div className="flex items-center gap-1.5 text-stone-700 min-w-0">
                        <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="font-bold text-stone-800 truncate">
                          {item.sellerName}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded shrink-0">
                          {item.sellerRole}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 shrink-0 ml-2">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate max-w-[110px]">{item.origin.split(',')[0]}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3
                        onClick={() => setSelectedDetailItem(item)}
                        className="font-bold text-base text-stone-900 leading-snug group-hover:text-amber-800 transition-colors cursor-pointer line-clamp-2"
                        title={item.title}
                      >
                        {item.title}
                      </h3>
                    </div>

                    {/* Technical Specs Grid (Compact & Crisp) */}
                    <div className="grid grid-cols-2 gap-2 text-xs p-2.5 bg-stone-50/80 rounded-2xl border border-stone-100">
                      {item.specsSummary.slice(0, 4).map((spec, idx) => (
                        <div key={idx} className="min-w-0">
                          <span className="text-[10px] text-stone-400 font-medium block truncate">
                            {spec.label}:
                          </span>
                          <span className="font-bold text-stone-800 truncate block text-xs">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tasting Notes */}
                    {item.tastingNotes.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-stone-400 mr-0.5">{t('market.card.notes')}</span>
                        {item.tastingNotes.slice(0, 3).map((note, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs"
                          >
                            {note}
                          </span>
                        ))}
                        {item.tastingNotes.length > 3 && (
                          <span className="text-[10px] font-bold text-stone-400">
                            +{item.tastingNotes.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Quick Barcode & Traceability Strip */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      {item.category === 'cherry' && (
                        <button
                          type="button"
                          onClick={() => setBarcodeLot(item.rawItem as FarmerHarvestLot)}
                          className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{t('market.card.barcodeCherry')}</span>
                        </button>
                      )}
                      {item.category === 'green_bean_processor' && (
                        <button
                          type="button"
                          onClick={() => setProcessorBarcodeLot(item.rawItem as ProcessedGreenBeanLot)}
                          className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{t('market.card.barcodeProcessor')}</span>
                        </button>
                      )}
                      {item.category === 'green_bean_warehouse' && (
                        <button
                          type="button"
                          onClick={() => setWarehouseBarcodeLot(item.rawItem as WarehouseLot)}
                          className="text-[11px] font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{t('market.card.barcodeWarehouse')}</span>
                        </button>
                      )}
                      {item.category === 'roasted_bean' && (
                        <span className="text-[11px] font-semibold text-orange-800 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span>{t('market.card.roastedBadge')}</span>
                        </span>
                      )}

                      {item.canTrace && (
                        <button
                          type="button"
                          onClick={() => setTraceItem(item.rawItem)}
                          className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 transition-colors cursor-pointer ml-auto"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>{t('market.card.trace')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Clean Price & Dual Action Engine */}
                <div className="p-4 bg-stone-50/90 border-t border-stone-200/80 space-y-3">
                  {/* Row 1: Price and Stock (No Awkward Wrapping) */}
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                        {t('market.card.offerPrice')}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-stone-900 tracking-tight">
                          Rp {item.price.toLocaleString(language === 'id' ? 'id-ID' : 'en-US')}
                        </span>
                        <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">
                          {item.priceUnit}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        {t('market.card.stock')} {item.availableStock.toLocaleString(language === 'id' ? 'id-ID' : 'en-US')} {item.stockUnit}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Action Buttons (WhatsApp + Beli + Detail Icon) */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        openOrderWhatsApp({
                          item,
                          quantity: 1,
                          buyerName: currentUser?.name,
                          buyerOrg: currentUser?.organization,
                          buyerRole: currentUser?.role,
                        })
                      }
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow-emerald-600/30 whitespace-nowrap"
                      title="Pesan komoditas ini langsung via WhatsApp"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                      <span>{t('market.card.orderWa')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenBuy(item)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-amber-900 active:bg-stone-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow-stone-900/30 whitespace-nowrap"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{t('market.card.buyDirect')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDetailItem(item)}
                      className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs transition-colors border border-stone-200 shadow-2xs flex items-center justify-center cursor-pointer shrink-0"
                      title="Lihat Detail & Sertifikat Lengkap"
                    >
                      <Eye className="w-4 h-4 text-stone-600" />
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
                      Lihat Stiker Barcode & Simulasi Scan Spesifikasi Lot
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
                    className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-800 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
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
    </div>
  );
};
