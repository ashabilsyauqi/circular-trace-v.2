import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useCoffee } from '../context/CoffeeContext';
import {
  ChevronRight,
  Home,
  Store,
  ArrowLeft,
  ShoppingCart,
  MapPin,
  Building2,
  Award,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Plus,
  Minus,
  Sparkles,
  Coffee,
  X,
  Share2,
  Check,
} from 'lucide-react';
import {
  MarketplaceCategory,
  UnifiedMarketplaceItem,
  FarmerHarvestLot,
  ProcessedGreenBeanLot,
  WarehouseLot,
} from '../types/coffee';
import { CoffeeSensorySpiderChart } from './CoffeeSensorySpiderChart';
import { TraceabilityModal } from './TraceabilityModal';
import { FarmerBarcodeModal } from './FarmerBarcodeModal';
import { ProcessorBarcodeModal } from './ProcessorBarcodeModal';
import { WarehouseBarcodeModal } from './WarehouseBarcodeModal';
import { BuyerTokopediaGateModal } from './buyer/BuyerTokopediaGateModal';
import { TokopediaCartModal, CartItem } from './buyer/TokopediaCartModal';
import { WhatsAppIcon, openOrderWhatsApp, getSellerWhatsAppNumber } from '../utils/whatsapp';
import { getNetworkHost, getPublicBaseUrl } from '../utils/baseUrl';
import { VERIFICATION_CHECKLIST_TEMPLATES } from '../constants/verificationChecklists';

export const ProductDetailPage: React.FC = () => {
  const {
    route,
    navigate,
    unifiedMarketplaceItems,
    currentUser,
    buyFromUnifiedMarketplace,
    createPOFromMarketplace,
    language,
    t,
  } = useCoffee();

  // Find product by lotId in route, or fallback to first item
  const selectedLotId = route.lotId || '';
  const item: UnifiedMarketplaceItem | undefined =
    unifiedMarketplaceItems.find((i) => i.id === selectedLotId) ||
    unifiedMarketplaceItems[0];

  // Quantity state
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals state
  const [isBuyingModalOpen, setIsBuyingModalOpen] = useState(false);
  const [traceItem, setTraceItem] = useState<any | null>(null);
  const [barcodeLot, setBarcodeLot] = useState<FarmerHarvestLot | null>(null);
  const [processorBarcodeLot, setProcessorBarcodeLot] = useState<ProcessedGreenBeanLot | null>(null);
  const [warehouseBarcodeLot, setWarehouseBarcodeLot] = useState<WarehouseLot | null>(null);

  // Cart & Gate
  const [gateModalOpen, setGateModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // QR Code URL
  const [miniQrUrl, setMiniQrUrl] = useState<string>('');
  const networkHost = getNetworkHost();
  const resolvedBaseUrl = getPublicBaseUrl(networkHost);
  const realtimeScanUrl = item ? `${resolvedBaseUrl}/trace?lotId=${item.id}` : '';

  const isBuyerMember = !!currentUser && (currentUser.role === 'buyer' || currentUser.isSuperAdmin);

  useEffect(() => {
    if (item && realtimeScanUrl) {
      QRCode.toDataURL(realtimeScanUrl, {
        width: 180,
        margin: 1,
        color: { dark: '#1c1917', light: '#ffffff' },
      })
        .then((url) => setMiniQrUrl(url))
        .catch((err) => console.error('Mini QR generation error:', err));
    }
    if (item) {
      if (item.category === 'cherry') {
        setQuantity(Math.min(item.availableStock, 10));
      } else if (item.category === 'green_bean_processor' || item.category === 'green_bean_warehouse') {
        setQuantity(Math.min(item.availableStock, 5));
      } else {
        setQuantity(1);
      }
    }
  }, [item, realtimeScanUrl]);

  if (!item) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-xl mx-auto my-12 shadow-xs">
        <ShoppingCart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h3 className="text-lg font-extrabold text-stone-800">Produk Tidak Ditemukan</h3>
        <p className="text-xs text-stone-500 mt-1 mb-6">
          Komoditas kopi yang Anda cari mungkin sudah habis terjual atau tautan lot tidak valid.
        </p>
        <button
          onClick={() => navigate({ view: 'marketplace' })}
          className="px-5 py-2.5 rounded-xl bg-[#00AA5B] hover:bg-[#03AC0E] text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer"
        >
          Kembali ke Katalog Kopi
        </button>
      </div>
    );
  }

  const categoryMeta: Record<
    MarketplaceCategory,
    { label: string; icon: React.ReactNode; badgeClass: string }
  > = {
    cherry: {
      label: 'Ceri Kopi Segar (Panen)',
      icon: <Sprout className="w-4 h-4 text-emerald-600" />,
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    green_bean_processor: {
      label: 'Green Bean Olahan (Mill)',
      icon: <Cog className="w-4 h-4 text-amber-600" />,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    green_bean_warehouse: {
      label: 'Green Bean Gudang Ekspor',
      icon: <Warehouse className="w-4 h-4 text-blue-600" />,
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    roasted_bean: {
      label: 'Biji Kopi Sangrai (Roasted)',
      icon: <Flame className="w-4 h-4 text-orange-600" />,
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    },
  };

  const meta = categoryMeta[item.category] || categoryMeta.cherry;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleAddToCart = () => {
    if (!isBuyerMember) {
      setGateModalOpen(true);
      return;
    }
    setCartItems((prev) => {
      const idx = prev.findIndex((c) => c.item.id === item.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
        return updated;
      }
      return [...prev, { item, quantity }];
    });
    setActionNotice({
      type: 'success',
      message: `${quantity} ${item.stockUnit} ${item.title} berhasil ditambahkan ke Keranjang!`,
    });
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleOpenBuy = () => {
    if (!isBuyerMember) {
      setGateModalOpen(true);
      return;
    }
    setIsBuyingModalOpen(true);
  };

  const isRoasterGreenBeanPurchase =
    currentUser?.role === 'roaster' &&
    (item.category === 'green_bean_processor' || item.category === 'green_bean_warehouse');

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const res = isRoasterGreenBeanPurchase
      ? createPOFromMarketplace(item, quantity)
      : buyFromUnifiedMarketplace(item, quantity);

    if (res.success) {
      setActionNotice({ type: 'success', message: res.message });
      setIsBuyingModalOpen(false);
      setTimeout(() => setActionNotice(null), 6000);
    } else {
      setActionNotice({ type: 'error', message: res.message });
    }
  };

  const getProductChecklist = () => {
    if (item.verificationStamp?.checklist && item.verificationStamp.checklist.length > 0) {
      return item.verificationStamp.checklist;
    }
    const mapping: Record<string, keyof typeof VERIFICATION_CHECKLIST_TEMPLATES> = {
      cherry: 'harvest',
      green_bean_processor: 'processed',
      green_bean_warehouse: 'warehouse',
      roasted_bean: 'roasted',
    };
    const key = mapping[item.category] || 'harvest';
    const tmpl = VERIFICATION_CHECKLIST_TEMPLATES[key] || VERIFICATION_CHECKLIST_TEMPLATES.harvest;
    return tmpl?.items || [];
  };

  const productChecklist = getProductChecklist();
  const isItemVerified = item.verificationStatus === 'verified' || !!item.verificationStamp;

  // Filter specsSummary to eliminate duplicates already shown
  const filteredSpecs = (item.specsSummary || []).filter((spec) => {
    const lbl = spec.label.toLowerCase();
    return (
      !lbl.includes('ketinggian') &&
      !lbl.includes('altitude') &&
      !lbl.includes('varietas') &&
      !lbl.includes('metode') &&
      !lbl.includes('sangrai') &&
      !lbl.includes('roast')
    );
  });


  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-2 sm:px-4">
      {/* BREADCRUMB NAVIGATION */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl px-4 py-3 border border-stone-200 dark:border-stone-800 shadow-2xs">
        <nav className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 flex-wrap">
          <button
            onClick={() => navigate({ view: 'landing' })}
            className="hover:text-[#00AA5B] font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-stone-400" />
            <span>Beranda</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />

          <button
            onClick={() => navigate({ view: 'marketplace' })}
            className="hover:text-[#00AA5B] font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-stone-400" />
            <span>Katalog Kopi</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />

          <button
            onClick={() => navigate({ view: 'marketplace' })}
            className="hover:text-[#00AA5B] font-semibold text-stone-700 dark:text-stone-300 cursor-pointer transition-colors"
          >
            {meta.label}
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />

          <span className="font-extrabold text-stone-900 dark:text-white truncate max-w-xs sm:max-w-md">
            {item.title}
          </span>
        </nav>
      </div>

      {/* BACK BUTTON & TOP CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate({ view: 'marketplace' })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-[#00AA5B] text-stone-700 dark:text-stone-300 hover:text-[#00AA5B] text-xs font-extrabold transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Kopi</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 text-stone-700 dark:text-stone-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Salin Tautan Produk"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00AA5B]" />
                <span className="text-[#00AA5B]">Tautan Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-stone-500" />
                <span>Bagikan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* NOTIFICATION NOTICE */}
      {actionNotice && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 border animate-in fade-in ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/80 dark:border-emerald-700 dark:text-emerald-200 shadow-2xs'
              : 'bg-red-50 border-red-300 text-red-950 dark:bg-red-950/80 dark:border-red-700 dark:text-red-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-300 shrink-0" />
            <span>{actionNotice.message}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="hover:opacity-75 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MAIN 2-COLUMN HERO SHOWCASE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Visuals & Digital Identity Karung (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Photo Card */}
          <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm aspect-[16/11]">
            <img
              src={item.photoUrl}
              alt={item.title}
              className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
            />

            {/* Top-Left Category Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-xs backdrop-blur-md border flex items-center gap-1.5 bg-white/95 dark:bg-stone-900/95 ${meta.badgeClass}`}
              >
                {meta.icon}
                <span>{meta.label}</span>
              </span>
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-mono px-2.5 py-1.5 rounded-xl border border-white/20">
                {item.id}
              </span>
            </div>

            {/* Top-Right Verified Badge */}
            {isItemVerified && (
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-950 bg-emerald-400 border border-emerald-500 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                  <span>Verified Audit &amp; EUDR Ready</span>
                </span>
              </div>
            )}
          </div>

          {/* QR Code, Barcode Stickers & Traceability Actions */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-stone-900 dark:text-white pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#00AA5B]" />
              <span>Traceability &amp; Digital Identity Karung</span>
            </h4>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {miniQrUrl && (
                <div className="p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl shrink-0 text-center shadow-2xs">
                  <img src={miniQrUrl} alt="QR Code Lot" className="w-28 h-28 mx-auto rounded-lg" />
                  <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 block mt-1.5 font-bold">
                    Scan via Kamera HP
                  </span>
                </div>
              )}

              <div className="flex-1 space-y-2.5 w-full">
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Lot komoditas ini tercatat secara transparan pada rantai pasok sirkular dengan nomor identifikasi{' '}
                  <strong className="text-stone-900 dark:text-white font-mono font-bold">{item.id}</strong>. Anda dapat
                  mencetak barcode stiker karung resmi atau memeriksa histori jejak pohon hingga cangkir.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {item.category === 'cherry' && (
                    <button
                      type="button"
                      onClick={() => setBarcodeLot(item.rawItem as FarmerHarvestLot)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Stiker Barcode Panen Petani</span>
                    </button>
                  )}

                  {item.category === 'green_bean_processor' && (
                    <button
                      type="button"
                      onClick={() => setProcessorBarcodeLot(item.rawItem as ProcessedGreenBeanLot)}
                      className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-amber-600" />
                      <span>Stiker Barcode Green Bean Mill</span>
                    </button>
                  )}

                  {item.category === 'green_bean_warehouse' && (
                    <button
                      type="button"
                      onClick={() => setWarehouseBarcodeLot(item.rawItem as WarehouseLot)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-blue-600" />
                      <span>Stiker Karung Silo Gudang Ekspor</span>
                    </button>
                  )}

                  {item.canTrace && (
                    <button
                      type="button"
                      onClick={() => setTraceItem(item.rawItem)}
                      className="px-3.5 py-2 rounded-xl bg-[#00AA5B] hover:bg-[#03AC0E] text-white font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>Lihat Silsilah Farm-to-Cup Trace</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Pricing, Supplier & Specs (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-5 sticky top-20">
          {/* Main Purchase Box */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
            {/* Supplier Origin Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 font-bold shrink-0">
                  <Building2 className="w-5 h-5 text-stone-500" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-stone-900 dark:text-white flex items-center gap-1.5">
                    <span>{item.sellerName}</span>
                    <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                      {item.sellerRole}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{item.origin}</span>
                  </div>
                </div>
              </div>

              {item.scaScore && (
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Skor SCA</span>
                  <span className="text-base font-black text-amber-600">⭐ {item.scaScore}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-snug">
                {item.title}
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-medium">
                Varietas: <strong className="text-stone-800 dark:text-stone-200">{item.variety || 'Specialty'}</strong> &bull; Asal:{' '}
                <strong className="text-stone-800 dark:text-stone-200">{item.origin.split(',')[0]}</strong>
              </p>
            </div>

            {/* Price & Stock Display Box */}
            <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Harga Penawaran Transaksi
              </span>
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                    Rp {item.price.toLocaleString(language === 'id' ? 'id-ID' : 'en-US')}
                  </span>
                  <span className="text-xs font-normal text-slate-500"> / {(item.priceUnit || "kg").replace(/^\/+/, "").trim()}</span>
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-3 py-1 rounded-xl shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Stok: {item.availableStock.toLocaleString(language === 'id' ? 'id-ID' : 'en-US')} {item.stockUnit}
                </span>
              </div>
            </div>

            {/* Quantity Selector & Live Calculation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                <span>Atur Kuantitas Pembelian ({item.stockUnit}):</span>
                <span className="text-stone-500 font-normal">Min. 1 {item.stockUnit}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl bg-white dark:bg-stone-800 overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={item.availableStock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.min(item.availableStock, Math.max(1, Number(e.target.value))))
                    }
                    className="w-16 text-center text-sm font-black text-stone-900 dark:text-white bg-transparent focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(item.availableStock, q + 1))}
                    className="p-2.5 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 text-right">
                  <span className="text-[11px] text-stone-400 block font-medium">Subtotal Estimasi:</span>
                  <span className="text-lg font-black text-[#00AA5B] font-mono">
                    Rp {(quantity * item.price).toLocaleString(language === 'id' ? 'id-ID' : 'en-US')}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: WhatsApp + Cart + Buy */}
            <div className="space-y-2.5 pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={handleOpenBuy}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#00AA5B] hover:bg-[#03AC0E] active:scale-98 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:shadow-emerald-600/30"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Beli Langsung Sekarang</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="tour-product-add-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 active:scale-98 text-[#00AA5B] border-2 border-[#00AA5B] font-extrabold text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-[#00AA5B]" />
                  <span>+ Keranjang Belanja</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openOrderWhatsApp({
                      item,
                      quantity,
                      buyerName: currentUser?.name,
                      buyerOrg: currentUser?.organization,
                      buyerRole: currentUser?.role,
                    });
                  }}
                  className="py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white font-extrabold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title="Hubungi &amp; Pesan via WhatsApp Resmi"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Chat WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Technical Specifications Table (Clean & No Duplicates) */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3.5">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-stone-900 dark:text-white pb-2 border-b border-stone-100 dark:border-stone-800">
              Lembar Spesifikasi Teknis Komoditas
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-500 font-medium">Varietas Tanaman:</span>
                <strong className="text-stone-900 dark:text-white font-bold">{item.variety || 'Typica & Sigarar Utang'}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-500 font-medium">Ketinggian Kebun (Altitude):</span>
                <strong className="text-stone-900 dark:text-white font-bold">{item.altitude || '1.600 mdpl'}</strong>
              </div>

              {item.processMethod && (
                <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                  <span className="text-stone-500 font-medium">Metode Pasca Panen:</span>
                  <strong className="text-stone-900 dark:text-white font-bold">{item.processMethod}</strong>
                </div>
              )}

              {item.roastLevel && (
                <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                  <span className="text-stone-500 font-medium">Tingkat Sangrai:</span>
                  <strong className="text-stone-900 dark:text-white font-bold">{item.roastLevel}</strong>
                </div>
              )}

              {filteredSpecs.map((spec, i) => {
                let displayVal = spec.value;
                if (spec.label.toLowerCase().includes('petik') && displayVal === 'Petik') {
                  displayVal = 'Petik Merah Optimal (95%+)';
                }
                return (
                  <div key={i} className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500 font-medium">{spec.label}:</span>
                    <strong className="text-stone-900 dark:text-white font-bold">{displayVal}</strong>
                  </div>
                );
              })}

              <div className="flex justify-between py-1">
                <span className="text-stone-500 font-medium">Stempel Audit:</span>
                <span className="font-extrabold text-emerald-600">✓ Lolos Uji Rantai Pasok Sirkular</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* FULL-WIDTH SECTION 1: PROFIL SENSORI CUPPING & RADAR RASA SCA */}
      <div className="w-full">
        {(() => {
          const raw = item.rawItem as any;
          return (
            <CoffeeSensorySpiderChart
              scaScore={item.scaScore || (raw?.scaCuppingScore ?? raw?.verifiedScaScore ?? 87.5)}
              roastLevel={item.roastLevel || raw?.roastLevel || 'Medium Roast'}
              agtronNumber={raw?.agtronNumber || 68}
              dtrPercent={raw?.developmentTimeRatio || 14.5}
              beanName={item.title}
              roasterName={item.sellerName}
              tastingNotes={item.tastingNotes}
              interactive={true}
            />
          );
        })()}
      </div>

      {/* FULL-WIDTH SECTION 2: KEPATUHAN STANDAR HIJAU & AUDIT EUDR */}
      <div className="bg-emerald-50/50 dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-emerald-200 dark:border-stone-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-200/80 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
                EUDR Verified
              </span>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                108 Best Practices Standard
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white flex items-center gap-2 mt-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Kepatuhan Standar Hijau, Legalitas Lahan &amp; Audit EUDR</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Komoditas ini telah diverifikasi melalui protokol audit rantai pasok sirkular bebas deforestasi dan berkeadilan sosial.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-black text-emerald-800 dark:text-emerald-200 bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 px-3.5 py-1.5 rounded-xl shadow-2xs inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Status Audit: Lolos Validasi</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productChecklist.slice(0, 6).map((chk: any, idx: number) => {
            const title = chk.label || chk.title || 'Kepatuhan Standar Mutu';
            const desc = chk.description || chk.desc || 'Telah diverifikasi sesuai standar sertifikasi kopi sirkular.';
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-emerald-200/80 dark:border-stone-700 shadow-2xs flex items-start gap-3 hover:border-emerald-400 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  {chk.category && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/60 inline-block">
                      {chk.category}
                    </span>
                  )}
                  <h5 className="font-bold text-stone-900 dark:text-white text-xs leading-snug">
                    {title}
                  </h5>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL BELI / DIRECT CHECKOUT */}
      {isBuyingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 relative">
              <button
                onClick={() => setIsBuyingModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Pemesanan Komoditas Kopi</span>
              </div>
              <h2 className="text-xl font-black">{item.title}</h2>
              <p className="text-xs text-emerald-100 mt-1">
                Penjual: {item.sellerName} ({item.sellerOrg}) &bull; {item.origin}
              </p>
            </div>

            <form onSubmit={handleConfirmPurchase} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Kuantitas Pembelian ({item.stockUnit}) - Tersedia: {item.availableStock} {item.stockUnit}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={item.availableStock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00AA5B] focus:border-[#00AA5B] focus:outline-none"
                />
              </div>

              <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs space-y-2">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Harga Satuan:</span>
                  <span className="font-bold text-stone-800 dark:text-white font-mono">
                    Rp {item.price.toLocaleString()} {item.priceUnit}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Kuantitas:</span>
                  <span className="font-bold text-stone-800 dark:text-white font-mono">
                    {quantity} {item.stockUnit}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Pembeli:</span>
                  <span className="font-semibold text-stone-800 dark:text-white">
                    {currentUser?.name || 'Tamu / Pembeli Terverifikasi'} ({currentUser?.organization || 'Umum'})
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-stone-900 dark:text-white pt-2 border-t border-stone-200 dark:border-stone-700">
                  <span>Total Transaksi:</span>
                  <span className="text-[#00AA5B] font-mono">
                    Rp {(quantity * item.price).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsBuyingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#00AA5B] hover:bg-[#03AC0E] active:scale-95 text-white text-xs font-extrabold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi Pembelian</span>
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

      {/* Farmer Barcode Modal */}
      <FarmerBarcodeModal
        isOpen={!!barcodeLot}
        onClose={() => setBarcodeLot(null)}
        lot={barcodeLot}
        isNewUpload={false}
      />

      {/* Processor Barcode Modal */}
      <ProcessorBarcodeModal
        isOpen={!!processorBarcodeLot}
        onClose={() => setProcessorBarcodeLot(null)}
        lot={processorBarcodeLot}
        isNewProcess={false}
      />

      {/* Warehouse Barcode Modal */}
      <WarehouseBarcodeModal
        isOpen={!!warehouseBarcodeLot}
        onClose={() => setWarehouseBarcodeLot(null)}
        lot={warehouseBarcodeLot}
        isNewGrading={false}
      />

      {/* Buyer Gate Modal */}
      <BuyerTokopediaGateModal
        isOpen={gateModalOpen}
        onClose={() => setGateModalOpen(false)}
        pendingBuyItemName={item.title}
        onApprovedLogin={() => {
          setCartItems((prev) => [...prev, { item, quantity }]);
          setTimeout(() => setIsCartOpen(true), 300);
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

export default ProductDetailPage;
