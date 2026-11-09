import React, { useState, useMemo } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { MarketplaceCartItem } from '../../types/coffee';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  MapPin,
  Truck,
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  Receipt,
  Printer,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  Leaf,
  Store,
  Clock,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { BuyerPassportQrModal } from './BuyerPassportQrModal';

export const BuyerCartPage: React.FC = () => {
  const {
    currentUser,
    cartItems,
    updateCartQuantity,
    removeFromCart,
    toggleSelectCartItem,
    toggleSelectSellerGroup,
    selectAllCartItems,
    clearCart,
    updateCartItemNotes,
    checkoutBundle,
    navigate,
    setActiveView,
  } = useCoffee();

  // Collapsed items state (set of cart item ids that are expanded)
  const [expandedItemIds, setExpandedItemIds] = useState<Record<string, boolean>>({
    'cart-init-1': true, // Open first item by default for great discoverability
  });

  // Courier state
  const [selectedCourier, setSelectedCourier] = useState<'jnt_cargo' | 'jne_reg' | 'sicepat'>('jnt_cargo');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'qris' | 'va'>('wallet');

  // Checkout Success State
  const [checkoutResult, setCheckoutResult] = useState<{
    invoiceNo: string;
    trackingNo: string;
    totalAmount: number;
    bundledItems: MarketplaceCartItem[];
  } | null>(null);

  // Trace Passport Modal State
  const [traceOrder, setTraceOrder] = useState<any | null>(null);

  // Toast / Notice
  const [notice, setNotice] = useState<string | null>(null);
  const [copiedBatch, setCopiedBatch] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedItemIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const courierOptions = {
    jnt_cargo: { name: 'J&T Cargo (Spesialis Kopi & Karung Goni)', cost: 25000, etd: '2-3 Hari Kerja' },
    jne_reg: { name: 'JNE Reguler Express', cost: 18000, etd: '1-2 Hari Kerja' },
    sicepat: { name: 'SiCepat Cargo B2B Nusantara', cost: 22000, etd: '2-3 Hari Kerja' },
  };

  const courierInfo = courierOptions[selectedCourier];

  // Selected items calculation (Bundle Payment depending on checked products)
  const selectedItems = useMemo(() => {
    return cartItems.filter((c) => c.selected);
  }, [cartItems]);

  const allSelected = cartItems.length > 0 && cartItems.every((c) => c.selected);
  const someSelected = selectedItems.length > 0 && !allSelected;

  const selectedSubtotal = useMemo(() => {
    return selectedItems.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
  }, [selectedItems]);

  const selectedTotalWeight = useMemo(() => {
    return selectedItems.reduce((acc, c) => acc + c.quantity, 0);
  }, [selectedItems]);

  const shippingCost = selectedItems.length > 0 ? courierInfo.cost : 0;
  const platformFee = selectedItems.length > 0 ? 2500 : 0;
  const circularDiscount = selectedItems.length > 0 ? 15000 : 0;
  const bundleGrandTotal = Math.max(0, selectedSubtotal + shippingCost + platformFee - circularDiscount);

  // Group items by Seller Name
  const sellerGroups = useMemo(() => {
    const groups: Record<string, MarketplaceCartItem[]> = {};
    cartItems.forEach((c) => {
      const seller = c.item.sellerName || 'Penjual Kopi Terdaftar';
      if (!groups[seller]) groups[seller] = [];
      groups[seller].push(c);
    });
    return groups;
  }, [cartItems]);

  const handleCopyBatch = (batchId: string) => {
    navigator.clipboard.writeText(batchId);
    setCopiedBatch(batchId);
    setTimeout(() => setCopiedBatch(null), 2500);
  };

  const handleDoCheckout = () => {
    if (selectedItems.length === 0) {
      setNotice('Silakan centang minimal 1 produk kopi untuk diproses dalam pembayaran bundle.');
      setTimeout(() => setNotice(null), 4000);
      return;
    }

    const res = checkoutBundle({
      courierId: selectedCourier,
      courierName: courierInfo.name,
      courierCost: shippingCost,
      paymentMethod,
    });

    if (res.success) {
      setCheckoutResult({
        invoiceNo: res.invoiceNo,
        trackingNo: res.trackingNo,
        totalAmount: res.totalAmount,
        bundledItems: res.bundledItems,
      });
    } else {
      setNotice(res.message);
      setTimeout(() => setNotice(null), 5000);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in">
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <button
              onClick={() => setActiveView('marketplace')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Katalog Kopi
            </button>
            <span>/</span>
            <span className="text-emerald-700 font-bold">Keranjang Belanja</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingCart className="w-6 h-6 text-emerald-600" />
            <span>Keranjang Belanja Pembeli &bull; Bundle Payment</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Centang produk komoditas yang ingin Anda bayar secara bundle. Rincian silsilah dan spesifikasi mutu lot dapat dibuka melalui tabel collapse per produk.
          </p>
        </div>

        {/* Clear Action: Navigasi ke Riwayat Transaksi */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveView('transactions')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-200/80 shadow-2xs"
          >
            <Receipt className="w-4 h-4 text-slate-600" />
            <span>Lihat Riwayat Transaksi</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* NOTIFICATION TOAST */}
      {notice && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="hover:opacity-75 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. MAIN 2-COLUMN LAYOUT: CART ITEMS (LEFT) + BUNDLE SUMMARY (RIGHT) */}
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Keranjang Belanja Anda Kosong</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Belum ada komoditas kopi yang ditambahkan ke keranjang belanja. Jelajahi katalog kopi petani specialty di marketplace terpadu.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('marketplace')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Jelajahi Katalog Marketplace</span>
            </button>
            <button
              onClick={() => setActiveView('transactions')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-2 cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-slate-500" />
              <span>Buka Riwayat Transaksi</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: LIST OF PRODUCTS WITH CHECKBOXES & COLLAPSE TABLES */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* MASTER SELECTION BAR */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => selectAllCartItems(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  Pilih Semua ({cartItems.length} Produk)
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  &bull; {selectedItems.length} terpilih untuk bundle
                </span>
              </label>

              <div className="flex items-center gap-3">
                {selectedItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearCart(true)}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Produk Terpilih ({selectedItems.length})</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => clearCart(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 font-medium hover:underline cursor-pointer"
                >
                  Kosongkan Semua
                </button>
              </div>
            </div>

            {/* SELLER GROUPS */}
            {Object.entries(sellerGroups).map(([sellerName, items]) => {
              const allGroupSelected = items.every((i) => i.selected);
              const someGroupSelected = items.some((i) => i.selected) && !allGroupSelected;

              return (
                <div
                  key={sellerName}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden"
                >
                  {/* GROUP HEADER: STORE / SELLER */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={allGroupSelected}
                        onChange={() => toggleSelectSellerGroup(sellerName)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                      />
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {sellerName}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Produsen Terverifikasi</span>
                        </span>
                      </div>
                    </label>

                    <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
                      Asal: {items[0]?.item.origin.split(',')[0] || 'Indonesia'}
                    </span>
                  </div>

                  {/* ITEMS IN THIS SELLER GROUP */}
                  <div className="divide-y divide-slate-100">
                    {items.map((cartItem) => {
                      const { id, item, quantity, selected, notes } = cartItem;
                      const isExpanded = !!expandedItemIds[id];
                      const itemSubtotal = item.price * quantity;
                      const cleanUnit = (item.priceUnit || 'kg').replace(/^\/+/, '').trim();

                      return (
                        <div key={id} className="p-4 sm:p-5 space-y-3.5 transition-colors">
                          {/* PRIMARY ITEM ROW */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Left: Checkbox + Photo + Info */}
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              {/* Checkbox for Bundle inclusion */}
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => toggleSelectCartItem(id)}
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 mt-2 shrink-0 cursor-pointer"
                                title="Centang untuk sertakan dalam pembayaran bundle"
                              />

                              {/* Photo Banner with Aspect Ratio */}
                              <img
                                src={item.photoUrl || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&auto=format&fit=crop&q=80'}
                                alt={item.title}
                                className="w-20 h-16 sm:w-24 sm:h-18 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                              />

                              {/* Titles & Specs */}
                              <div className="min-w-0 space-y-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                    {item.variety}
                                  </span>
                                  {item.scaScore && (
                                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                      <Award className="w-3 h-3 text-amber-600" />
                                      <span>SCA {item.scaScore}</span>
                                    </span>
                                  )}
                                </div>

                                <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                                  {item.title}
                                </h4>

                                <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{item.origin}</span>
                                </p>

                                <div className="text-xs font-medium text-slate-900 pt-0.5">
                                  <span className="font-bold">Rp {item.price.toLocaleString('id-ID')}</span>
                                  <span className="text-slate-500 font-normal"> / {cleanUnit}</span>
                                </div>
                              </div>
                            </div>

                            {/* Right: Quantity Stepper, Item Subtotal & Actions */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pl-7 sm:pl-0">
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                                  Subtotal Item
                                </span>
                                <span className="text-sm sm:text-base font-black text-slate-900">
                                  Rp {itemSubtotal.toLocaleString('id-ID')}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Quantity Stepper */}
                                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => updateCartQuantity(id, Math.max(1, quantity - 1))}
                                    className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                                    title="Kurangi kuantitas"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-9 text-center text-xs font-bold text-slate-900">
                                    {quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateCartQuantity(id, quantity + 1)}
                                    className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                                    title="Tambah kuantitas"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Remove Button */}
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(id)}
                                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus komoditas dari keranjang"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* TOGGLE BUTTON FOR COLLAPSIBLE SPECIFICATION TABLE */}
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => toggleExpand(id)}
                              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors cursor-pointer group"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4 text-emerald-600 transition-transform" />
                                  <span>Sembunyikan Rincian Silsilah &amp; Spesifikasi Batch</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4 text-emerald-600 transition-transform group-hover:translate-y-0.5" />
                                  <span>Lihat Tabel Rincian Silsilah &amp; Spesifikasi Batch (SCA, EUDR, Brix)</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* COLLAPSIBLE TABLE SECTION */}
                          {isExpanded && (
                            <div className="mt-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3 animate-in fade-in duration-150">
                              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                  <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                                    Tabel Silsilah Rantai Pasok &amp; Data Komoditas
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                  ID Lot: {item.batchId || item.id}
                                </span>
                              </div>

                              {/* THE SPECIFICATIONS TABLE */}
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left border-collapse">
                                  <thead>
                                    <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                      <th className="py-1.5 pr-3">Parameter Rantai Pasok</th>
                                      <th className="py-1.5 px-3">Data Silsilah Batch</th>
                                      <th className="py-1.5 pl-3">Verifikasi &amp; Standar</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200/60 font-medium text-slate-700">
                                    <tr>
                                      <td className="py-2 pr-3 text-slate-500">Nomor Lot Komoditas</td>
                                      <td className="py-2 px-3 font-mono font-bold text-slate-900 flex items-center gap-1.5">
                                        <span>{item.batchId || 'BATCH-' + item.id}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleCopyBatch(item.batchId || item.id)}
                                          className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                                          title="Salin nomor batch"
                                        >
                                          {copiedBatch === (item.batchId || item.id) ? (
                                            <Check className="w-3 h-3 text-emerald-600" />
                                          ) : (
                                            <Copy className="w-3 h-3" />
                                          )}
                                        </button>
                                      </td>
                                      <td className="py-2 pl-3 text-emerald-700 font-semibold">
                                        Format Barcode GS1-128 Sah
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 pr-3 text-slate-500">Varietas &amp; Elevasi</td>
                                      <td className="py-2 px-3 text-slate-900">
                                        {item.variety} &bull; {item.altitude || '1.500 mdpl'}
                                      </td>
                                      <td className="py-2 pl-3 text-slate-600">
                                        {item.origin}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 pr-3 text-slate-500">Metode Pascapanen</td>
                                      <td className="py-2 px-3 text-slate-900">
                                        {item.processMethod || 'Honey Anaerobic 72 Jam'}
                                      </td>
                                      <td className="py-2 pl-3 text-slate-600">
                                        Brix 22.4&deg; &bull; Kadar Air &le; 12%
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 pr-3 text-slate-500">Skor Mutu Cupping SCA</td>
                                      <td className="py-2 px-3 text-amber-900 font-bold">
                                        SCA {item.scaScore || 87.5}
                                      </td>
                                      <td className="py-2 pl-3 text-slate-600">
                                        Specialty Grade 1 (Defect &le; 3/350g)
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 pr-3 text-slate-500">Kepatuhan EUDR</td>
                                      <td className="py-2 px-3 text-emerald-800 font-bold">
                                        Zero-Deforestation Compliant
                                      </td>
                                      <td className="py-2 pl-3 text-emerald-700 font-semibold">
                                        Terverifikasi Prof. Novizar Nazir (UNAND)
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 pr-3 text-slate-500">Kalkulasi Tagihan Item</td>
                                      <td className="py-2 px-3 text-slate-900 font-bold">
                                        {quantity} {cleanUnit} &times; Rp {item.price.toLocaleString('id-ID')}
                                      </td>
                                      <td className="py-2 pl-3 font-bold text-slate-900">
                                        = Rp {itemSubtotal.toLocaleString('id-ID')}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>

                              {/* OPTIONAL BUYER NOTES INPUT */}
                              <div className="pt-2 border-t border-slate-200/70">
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                  Catatan Khusus untuk Penjual (Opsional):
                                </label>
                                <input
                                  type="text"
                                  value={notes || ''}
                                  onChange={(e) => updateCartItemNotes(id, e.target.value)}
                                  placeholder="Contoh: Tolong kemas vacuum pack 1kg, lampirkan sertifikat fisik..."
                                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 placeholder:text-slate-400"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: STICKY BUNDLE CHECKOUT & SUMMARY CARD */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
            
            {/* DELIVERY ADDRESS BOX */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Alamat Pengiriman Pembeli</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  Utama
                </span>
              </div>
              <div className="text-xs text-slate-700">
                <strong>{currentUser?.name || 'Siti Rahma'}</strong> ({currentUser?.phone || '0812-3456-7890'})
                <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                  {currentUser?.location || 'Jl. Khatib Sulaiman No. 42, Kota Padang, Sumatera Barat'}
                </p>
              </div>
            </div>

            {/* BUNDLE SUMMARY CARD */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="space-y-1 pb-3 border-b border-slate-100">
                <h3 className="font-black text-base text-slate-900 flex items-center justify-between">
                  <span>Ringkasan Pembayaran Bundle</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono">
                    {selectedItems.length} Produk
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Total tagihan dihitung secara otomatis berdasarkan produk yang dicentang.
                </p>
              </div>

              {/* COURIER SELECTOR */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pilihan Ekspedisi Pengiriman:</span>
                </label>
                <div className="space-y-1.5">
                  {(Object.keys(courierOptions) as Array<keyof typeof courierOptions>).map((key) => {
                    const c = courierOptions[key];
                    const isSelected = selectedCourier === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedCourier(key)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold ring-1 ring-emerald-500/30'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold truncate">{c.name}</div>
                          <div className="text-[10px] text-slate-500">{c.etd}</div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 shrink-0">
                          Rp {c.cost.toLocaleString('id-ID')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PAYMENT METHOD SELECTOR */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Metode Pembayaran:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'wallet'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Wallet className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
                    <div className="text-[11px] font-bold">E-Wallet</div>
                    <div className="text-[9px] text-slate-500 truncate">
                      Rp {(currentUser?.balance || 0).toLocaleString('id-ID')}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'qris'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
                    <div className="text-[11px] font-bold">QRIS Instant</div>
                    <div className="text-[9px] text-slate-500">Scan Real-Time</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('va')}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'va'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
                    <div className="text-[11px] font-bold">Virtual Account</div>
                    <div className="text-[9px] text-slate-500">BCA/Mandiri</div>
                  </button>
                </div>
              </div>

              {/* COST BREAKDOWN ACCORDING TO CHECKED ITEMS */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Komoditas Terpilih ({selectedTotalWeight} kg):</span>
                  <span className="font-bold text-slate-900">
                    Rp {selectedSubtotal.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Ongkos Kirim ({courierInfo.name.split(' ')[0]}):</span>
                  <span className="font-bold text-slate-900">
                    Rp {shippingCost.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Biaya Layanan Pembeli:</span>
                  <span className="font-bold text-slate-900">
                    Rp {platformFee.toLocaleString('id-ID')}
                  </span>
                </div>

                {circularDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Diskon Kopi Sirkular:</span>
                    <span>- Rp {circularDiscount.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-2.5 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Total Tagihan Bundle
                    </span>
                    <span className="text-xs text-slate-500">
                      ({selectedItems.length} produk terpilih)
                    </span>
                  </div>
                  <span className="text-lg sm:text-xl font-black text-emerald-800 tracking-tight">
                    Rp {bundleGrandTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* CHECKOUT BUNDLE BUTTON */}
              <button
                type="button"
                disabled={selectedItems.length === 0}
                onClick={handleDoCheckout}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  selectedItems.length > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>
                  {selectedItems.length > 0
                    ? `Bayar Bundle (${selectedItems.length} Produk) • Rp ${bundleGrandTotal.toLocaleString('id-ID')}`
                    : 'Pilih Produk untuk Checkout Bundle'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {selectedItems.length === 0 && (
                <p className="text-[11px] text-amber-700 text-center font-medium">
                  Centang minimal 1 produk kopi di sebelah kiri untuk mengaktifkan pembayaran bundle.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. SUCCESS CHECKOUT INVOICE MODAL */}
      {checkoutResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 flex items-start justify-between">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                  Pembayaran Bundle Berhasil
                </span>
                <h3 className="text-lg font-black text-white">
                  Faktur Pembelian &amp; Resi Pengiriman
                </h3>
                <p className="text-xs text-emerald-100">
                  Nomor Faktur: <strong className="font-mono">{checkoutResult.invoiceNo}</strong>
                </p>
              </div>

              <button
                onClick={() => setCheckoutResult(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Resi Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    Nomor Resi {courierInfo.name.split(' ')[0]}
                  </span>
                  <span className="text-base font-black font-mono text-emerald-950">
                    {checkoutResult.trackingNo}
                  </span>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Estimasi tiba: {courierInfo.etd}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Diproses</span>
                </span>
              </div>

              {/* Bundled Items Summary */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Komoditas yang Dibayar ({checkoutResult.bundledItems.length} Produk):
                </span>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {checkoutResult.bundledItems.map((c) => (
                    <div key={c.id} className="p-3 bg-white flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{c.item.title}</div>
                        <div className="text-[11px] text-slate-500">
                          {c.quantity} {(c.item.stockUnit || 'kg').replace(/^\/+/, '').trim()} &bull; Penjual: {c.item.sellerName}
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">
                        Rp {(c.item.price * c.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Paid */}
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-medium text-slate-600">Total Dibayar ({paymentMethod.toUpperCase()}):</span>
                <span className="font-black text-sm text-emerald-800">
                  Rp {checkoutResult.totalAmount.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const firstItem = checkoutResult.bundledItems[0]?.item;
                    setTraceOrder({
                      id: checkoutResult.invoiceNo,
                      invoiceNo: checkoutResult.invoiceNo,
                      date: new Date().toISOString().split('T')[0],
                      sellerName: firstItem?.sellerName || 'Koperasi Produsen',
                      sellerOrg: firstItem?.sellerOrg || 'CircularTrace Official',
                      sellerPhone: '0812-9876-5432',
                      totalAmount: checkoutResult.totalAmount,
                      status: 'paid',
                      statusLabel: 'Lunas & Diproses',
                      resiNo: checkoutResult.trackingNo,
                      courierName: courierInfo.name,
                      items: [
                        {
                          id: firstItem?.id || 'item-1',
                          title: firstItem?.title || 'Kopi Specialty',
                          variety: firstItem?.variety || 'Arabika',
                          origin: firstItem?.origin || 'Sumatera',
                          batchId: firstItem?.batchId || 'BATCH-PSS-2026-HNY02',
                          quantity: 2,
                          unitPrice: firstItem?.price || 145000,
                          photoUrl: firstItem?.photoUrl,
                        },
                      ],
                    });
                  }}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Lacak QR Trace Paspor</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCheckoutResult(null);
                    setActiveView('transactions');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Buka Riwayat Transaksi</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutResult(null);
                    setActiveView('marketplace');
                  }}
                  className="text-xs text-slate-500 hover:text-emerald-700 font-semibold cursor-pointer"
                >
                  &larr; Lanjut Belanja di Katalog Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PASSPORT & BARCODE MODAL */}
      <BuyerPassportQrModal
        isOpen={!!traceOrder}
        onClose={() => setTraceOrder(null)}
        order={traceOrder}
      />
    </div>
  );
};
