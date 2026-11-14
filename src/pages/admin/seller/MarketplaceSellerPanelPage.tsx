import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCoffee } from '../../../context/CoffeeContext';
import {
  SellerOrder,
  SellerOrderStatus,
  MarketplaceCategory,
  RoastedBeanLot,
  WarehouseLot,
  ProcessedGreenBeanLot,
  FarmerHarvestLot,
} from '../../../types/coffee';
import {
  Store,
  DollarSign,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  Upload,
  QrCode,
  Eye,
  ExternalLink,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Award,
  Layers,
  Flame,
  Building2,
  Calendar,
  Check,
  Send,
  RefreshCw,
  Tag,
  ShieldCheck,
  Boxes,
} from 'lucide-react';
import { UploadProductModal } from '../../../components/seller/UploadProductModal';

export const MarketplaceSellerPanelPage: React.FC = () => {
  const {
    currentUser,
    sellerOrders,
    acceptSellerOrder,
    shipSellerOrder,
    completeSellerOrder,
    cancelSellerOrder,
    unifiedMarketplaceItems,
    roastedLots,
    warehouseLots,
    processedLots,
    farmerLots,
    toggleReleaseRoastedLotToMarketplace,
    toggleReleaseWarehouseLotToMarketplace,
  } = useCoffee();

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'active_listings' | 'ready_queue' | 'margin_analysis'>('orders');

  // Filter Status Orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<SellerOrderStatus | 'all'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Modals State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadPreselectedLotId, setUploadPreselectedLotId] = useState<string | undefined>(undefined);
  const [uploadPreselectedCategory, setUploadPreselectedCategory] = useState<MarketplaceCategory | undefined>(undefined);

  // Ship Order Modal
  const [shippingOrder, setShippingOrder] = useState<SellerOrder | null>(null);
  const [courierNameInput, setCourierNameInput] = useState('JNE Trucking (JTR)');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  // Order Detail / History Modal
  const [detailOrder, setDetailOrder] = useState<SellerOrder | null>(null);

  // Cancel Modal
  const [cancelingOrder, setCancelingOrder] = useState<SellerOrder | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState('Stok kemasan tidak mencukupi / gagal QC');

  // Filter orders that belong to the current user (or show all if admin)
  const userOrders = useMemo(() => {
    if (!currentUser || currentUser.role === 'admin_kelompok_tani') {
      return sellerOrders;
    }
    return sellerOrders.filter(
      (o) =>
        o.sellerId === currentUser.id ||
        o.sellerRole === currentUser.role ||
        (o.sellerName && o.sellerName.toLowerCase().includes(currentUser.name.toLowerCase()))
    );
  }, [sellerOrders, currentUser]);

  // Tab filtered orders
  const displayedOrders = useMemo(() => {
    return userOrders.filter((order) => {
      const matchStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      const q = orderSearchQuery.toLowerCase();
      const matchSearch =
        order.orderNumber.toLowerCase().includes(q) ||
        order.buyerName.toLowerCase().includes(q) ||
        (order.buyerOrganization && order.buyerOrganization.toLowerCase().includes(q)) ||
        order.productTitle.toLowerCase().includes(q) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [userOrders, orderStatusFilter, orderSearchQuery]);

  // Active listings belonging to this seller
  const activeListings = useMemo(() => {
    if (!currentUser || currentUser.role === 'admin_kelompok_tani') {
      return unifiedMarketplaceItems;
    }
    return unifiedMarketplaceItems.filter(
      (item) =>
        item.sellerRole === currentUser.role ||
        (item.sellerName && item.sellerName.toLowerCase().includes(currentUser.name.toLowerCase()))
    );
  }, [unifiedMarketplaceItems, currentUser]);

  // Internal lots ready for release / Deploy Ready Drafts
  const readyDeployLots = useMemo(() => {
    const list: {
      id: string;
      category: MarketplaceCategory;
      title: string;
      variety: string;
      origin: string;
      availableStockDisplay: string;
      pricePerUnit: number;
      qualityScoreDisplay: string;
      isAlreadyLive: boolean;
      photoUrl: string;
    }[] = [];

    // Roaster lots
    if (!currentUser || currentUser.role === 'admin_kelompok_tani' || currentUser.role === 'roaster') {
      roastedLots.forEach((l) => {
        if (l.roastStatus !== 'cupping_pending' && (l.availablePacks || 0) > 0) {
          list.push({
            id: l.id,
            category: 'roasted_bean',
            title: l.marketplaceTitle || `[Artisan Roast] ${l.origin} - ${l.variety} (${l.roastLevel})`,
            variety: l.variety,
            origin: l.origin,
            availableStockDisplay: `${l.availablePacks} pack (${l.packageWeightGrams}g)`,
            pricePerUnit: l.pricePerPack,
            qualityScoreDisplay: `SCA ${(l.scaCuppingScore || 85).toFixed(2)}`,
            isAlreadyLive: Boolean(l.isReleasedToMarketplace),
            photoUrl: l.photoUrl || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
          });
        }
      });
    }

    // Warehouse lots
    if (!currentUser || currentUser.role === 'admin_kelompok_tani' || currentUser.role === 'gudang') {
      warehouseLots.forEach((l) => {
        if (l.sortingStatus !== 'pending_sorting' && (l.availableWeightKg || 0) > 0) {
          list.push({
            id: l.id,
            category: 'green_bean_warehouse',
            title: l.marketplaceTitle || `[${l.gradeTier ? l.gradeTier.split(' - ')[1] : 'Grade 1'}] Green Bean ${l.variety}`,
            variety: l.variety,
            origin: l.origin,
            availableStockDisplay: `${l.availableWeightKg} kg`,
            pricePerUnit: l.pricePerKg,
            qualityScoreDisplay: `SCA ${l.verifiedScaScore} • ${l.gradeTier}`,
            isAlreadyLive: Boolean(l.isReleasedToMarketplace),
            photoUrl: l.photoUrl || 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=600',
          });
        }
      });
    }

    // Processor lots
    if (!currentUser || currentUser.role === 'admin_kelompok_tani' || currentUser.role === 'pengolah') {
      processedLots.forEach((l) => {
        if ((l.availableWeightKg || 0) > 0) {
          list.push({
            id: l.id,
            category: 'green_bean_processor',
            title: l.marketplaceTitle || `Green Bean Olahan ${l.variety} (${l.processMethod})`,
            variety: l.variety,
            origin: l.sourceOrigin,
            availableStockDisplay: `${l.availableWeightKg} kg`,
            pricePerUnit: l.pricePerKg,
            qualityScoreDisplay: `Grade ${l.grade}`,
            isAlreadyLive: l.status === 'available',
            photoUrl: l.photoUrl || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
          });
        }
      });
    }

    // Farmer lots (for KT admin or farmer)
    if (!currentUser || currentUser.role === 'admin_kelompok_tani' || currentUser.role === 'petani') {
      farmerLots.forEach((l) => {
        if ((l.availableWeightKg || 0) > 0) {
          list.push({
            id: l.id,
            category: 'cherry',
            title: l.marketplaceTitle || `Ceri Kopi ${l.variety} (${l.farmLocation})`,
            variety: l.variety,
            origin: l.farmLocation,
            availableStockDisplay: `${l.availableWeightKg} kg`,
            pricePerUnit: l.marketplacePricePerKg || l.pricePerKg || 16500,
            qualityScoreDisplay: `Brix ${l.brix}°`,
            isAlreadyLive: Boolean(l.isReleasedToMarketplace),
            photoUrl: l.photoUrl || 'https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&q=80&w=600',
          });
        }
      });
    }

    return list;
  }, [roastedLots, warehouseLots, processedLots, farmerLots, currentUser]);

  // ==============================================================
  // FINANCIAL & SALES KPI CALCULATIONS
  // ==============================================================
  // 1. Realisasi Pemasukan Sah (Omset dari pesanan berstatus 'selesai')
  const completedOrders = userOrders.filter((o) => o.status === 'selesai');
  const totalRealizedRevenue = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0);

  // 2. Estimasi Revenue Berjalan (Inflow pesanan 'menunggu_konfirmasi', 'diproses', 'dikirim')
  const pendingOrders = userOrders.filter(
    (o) => o.status === 'menunggu_konfirmasi' || o.status === 'diproses' || o.status === 'dikirim'
  );
  const totalEstimatedRevenue = pendingOrders.reduce((acc, o) => acc + o.totalAmount, 0);

  // 3. Realisasi Margin / Laba Bersih (Hanya dari pesanan 'selesai')
  const totalRealizedProfit = completedOrders.reduce((acc, o) => acc + o.grossProfit, 0);
  const averageMarginPercent =
    totalRealizedRevenue > 0
      ? Number(((totalRealizedProfit / totalRealizedRevenue) * 100).toFixed(1))
      : 0;

  // 4. Stok Aktif di Pasar
  const totalActiveStockUnits = activeListings.reduce((acc, item) => acc + item.availableStock, 0);

  // 5. Pesanan Perlu Tindakan Segera
  const needsActionCount = userOrders.filter(
    (o) => o.status === 'menunggu_konfirmasi' || o.status === 'diproses'
  ).length;

  // Handle Ship Submit
  const handleConfirmShip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingOrder || !trackingNumberInput.trim()) return;

    shipSellerOrder(shippingOrder.id, courierNameInput, trackingNumberInput.trim());
    setShippingOrder(null);
    setTrackingNumberInput('');
  };

  // Handle Cancel Submit
  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelingOrder) return;

    cancelSellerOrder(cancelingOrder.id, cancelReasonInput);
    setCancelingOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. AdminLTE Content Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="font-bold text-stone-700">
              {currentUser?.organization || 'Karsa Craft Roastery'}
            </span>
            <span>/</span>
            <span className="text-orange-600 font-bold">Seller Panel &amp; Monitoring Penjualan</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Store className="w-7 h-7 text-orange-600" />
            <span>Marketplace Seller Panel &amp; Kendali Penjualan</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitoring pesanan masuk, realisasi omset, estimasi revenue, analisis margin laba bersih, dan peluncuran produk ber-QR.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2">
          <a
            href="https://marketplace.circulartrace.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Eye className="w-4 h-4 text-stone-500" />
            <span>Lihat Etalase Publik</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </a>

          <button
            type="button"
            onClick={() => {
              setUploadPreselectedLotId(undefined);
              setIsUploadModalOpen(true);
            }}
            className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-black text-xs flex items-center gap-2 transition-all shadow-md shadow-orange-600/20 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>+ Upload Produk Baru</span>
          </button>
        </div>
      </div>

      {/* 2. Top 5 Small-Boxes / Metric Cards (AdminLTE 3 Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Realisasi Pemasukan Sah */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-100 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Realisasi Pemasukan</span>
              <DollarSign className="w-4 h-4 text-emerald-200" />
            </div>
            <div className="text-xl font-black font-mono tracking-tight leading-tight">
              Rp {totalRealizedRevenue.toLocaleString()}
            </div>
            <p className="text-[10px] text-emerald-100/90 mt-1">
              {completedOrders.length} pesanan berstatus selesai &amp; dana cair
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-500/50 flex items-center justify-between text-[10px] text-emerald-100 font-bold">
            <span>Transaksi Sukses</span>
            <span>100% Sah</span>
          </div>
        </div>

        {/* KPI 2: Estimasi Revenue Berjalan */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-blue-100 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Estimasi Revenue</span>
              <Clock className="w-4 h-4 text-blue-200" />
            </div>
            <div className="text-xl font-black font-mono tracking-tight leading-tight">
              Rp {totalEstimatedRevenue.toLocaleString()}
            </div>
            <p className="text-[10px] text-blue-100/90 mt-1">
              {pendingOrders.length} pesanan sedang dalam proses &amp; logistik
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-blue-500/50 flex items-center justify-between text-[10px] text-blue-100 font-bold">
            <span>Inflow Berjalan</span>
            <span>Menunggu Selesai</span>
          </div>
        </div>

        {/* KPI 3: Laba Bersih & Margin (%) */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-purple-100 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Realisasi Margin Laba</span>
              <TrendingUp className="w-4 h-4 text-purple-200" />
            </div>
            <div className="text-xl font-black font-mono tracking-tight leading-tight">
              Rp {totalRealizedProfit.toLocaleString()}
            </div>
            <p className="text-[10px] text-purple-100/90 mt-1">
              Rata-rata Margin Bersih: <strong>{averageMarginPercent}%</strong>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-purple-500/50 flex items-center justify-between text-[10px] text-purple-100 font-bold">
            <span>Gross Profit Sah</span>
            <span>Bebas HPP</span>
          </div>
        </div>

        {/* KPI 4: Stok Aktif di Pasar */}
        <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-amber-100 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Stok Aktif di Pasar</span>
              <Package className="w-4 h-4 text-amber-200" />
            </div>
            <div className="text-xl font-black font-mono tracking-tight leading-tight">
              {totalActiveStockUnits.toLocaleString()}
            </div>
            <p className="text-[10px] text-amber-100/90 mt-1">
              {activeListings.length} SKU produk live di etalase
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-amber-500/50 flex items-center justify-between text-[10px] text-amber-100 font-bold">
            <span>Siap Dipesan Cafe</span>
            <span>Etalase Aktif</span>
          </div>
        </div>

        {/* KPI 5: Tindakan Pesanan Diperlukan */}
        <div className="bg-gradient-to-br from-rose-600 to-rose-700 text-white rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-rose-100 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Perlu Diproses</span>
              <AlertCircle className="w-4 h-4 text-rose-200 animate-pulse" />
            </div>
            <div className="text-xl font-black font-mono tracking-tight leading-tight">
              {needsActionCount} Pesanan
            </div>
            <p className="text-[10px] text-rose-100/90 mt-1">
              Menunggu konfirmasi / pengiriman resi
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-rose-500/50 flex items-center justify-between text-[10px] text-rose-100 font-bold">
            <span>SLA Penjual</span>
            <span>Prioritas Kirim</span>
          </div>
        </div>
      </div>

      {/* 3. AdminLTE Card Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-xs border border-stone-200 overflow-hidden">
        {/* Tab Headers */}
        <div className="p-3 border-b border-stone-200 bg-stone-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'orders', label: '📋 Kelola Pesanan Masuk', count: userOrders.length, color: 'text-orange-600' },
              { id: 'active_listings', label: '🏷️ Produk Tayang & Stok', count: activeListings.length, color: 'text-emerald-600' },
              { id: 'ready_queue', label: '📦 Antrean Siap Rilis (Drafts)', count: readyDeployLots.length, color: 'text-blue-600' },
              { id: 'margin_analysis', label: '📊 Analisis HPP & Margin', count: null, color: 'text-purple-600' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#343a40] text-white shadow-xs'
                      : 'bg-white hover:bg-stone-200 text-stone-600 border border-stone-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-orange-500 text-stone-950' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-orange-600" />
            <span>Digital Certificate QR Passport Terhubung</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: KELOLA PESANAN MASUK (ORDER LIFECYCLE MANAGEMENT)       */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="p-4 space-y-4">
            {/* Search & Status Pill Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'Semua Status' },
                  { id: 'menunggu_konfirmasi', label: '⏳ Menunggu Konfirmasi' },
                  { id: 'diproses', label: '⚙️ Diproses' },
                  { id: 'dikirim', label: '🚚 Dikirim' },
                  { id: 'selesai', label: '✓ Selesai' },
                  { id: 'dibatalkan', label: '✕ Dibatalkan' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setOrderStatusFilter(st.id as any)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                      orderStatusFilter === st.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Cari No. Order, nama pembeli, produk..."
                  className="w-full text-xs pl-8.5 pr-3 py-1.5 rounded-md border border-stone-300 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Orders Table */}
            {displayedOrders.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200 space-y-2">
                <ShoppingBag className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-xs font-bold text-stone-700">Tidak ada pesanan pada filter ini.</p>
                <p className="text-[11px] text-stone-500">
                  Pesanan yang dibuat oleh pembeli melalui Marketplace akan otomatis masuk ke sini.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-stone-200 rounded-lg">
                <table className="w-full text-left text-xs min-w-[1050px]">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px] whitespace-nowrap">
                    <tr>
                      <th className="py-3 px-3.5 whitespace-nowrap">No. Order &amp; Tanggal</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">Pembeli &amp; Lokasi</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">Komoditas &amp; Varian</th>
                      <th className="py-3 px-3.5 text-center whitespace-nowrap">Qty &amp; Nilai</th>
                      <th className="py-3 px-3.5 text-center whitespace-nowrap">HPP &amp; Margin</th>
                      <th className="py-3 px-3.5 text-center whitespace-nowrap">Status Pesanan</th>
                      <th className="py-3 px-3.5 text-center whitespace-nowrap">Aksi Tahapan Penjual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {displayedOrders.map((order) => {
                      const isPending = order.status === 'menunggu_konfirmasi';
                      const isProcessing = order.status === 'diproses';
                      const isShipped = order.status === 'dikirim';
                      const isCompleted = order.status === 'selesai';
                      const isCancelled = order.status === 'dibatalkan';

                      return (
                        <tr key={order.id} className="hover:bg-orange-50/30 transition-colors">
                          {/* 1. No Order & Tanggal */}
                          <td className="py-3 px-3.5">
                            <div className="font-mono font-bold text-stone-900">{order.orderNumber}</div>
                            <div className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-stone-400" />
                              <span>{order.date}</span>
                            </div>
                          </td>

                          {/* 2. Pembeli */}
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-stone-900">
                              {order.buyerOrganization || order.buyerName}
                            </div>
                            <div className="text-[10px] text-stone-500 mt-0.5 truncate max-w-[180px]">
                              {order.shippingAddress || 'Alamat Terdaftar'}
                            </div>
                          </td>

                          {/* 3. Komoditas */}
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-stone-900">{order.productTitle}</div>
                            <div className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1.5">
                              <span className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-700 border border-stone-200">
                                Kemasan: {order.packageWeight}
                              </span>
                              <span className="font-mono text-stone-400">{order.sourceLotId}</span>
                            </div>
                          </td>

                          {/* 4. Qty & Nilai */}
                          <td className="py-3 px-3.5 text-center">
                            <div className="font-black text-stone-900 text-sm">
                              {order.quantity} <span className="text-xs font-normal text-stone-500">unit</span>
                            </div>
                            <div className="font-bold text-stone-800 text-[11px] mt-0.5">
                              Rp {order.totalAmount.toLocaleString()}
                            </div>
                            <div className="text-[9px] text-stone-400">
                              (Rp {order.unitPrice.toLocaleString()}/unit)
                            </div>
                          </td>

                          {/* 5. HPP & Margin */}
                          <td className="py-3 px-3.5 text-center">
                            <div className="font-black text-emerald-700 text-xs">
                              + Rp {order.grossProfit.toLocaleString()}
                            </div>
                            <div className="text-[10px] font-bold text-amber-700 mt-0.5">
                              Margin {order.marginPercent}%
                            </div>
                            <div className="text-[9px] text-stone-400">
                              HPP: Rp {order.unitHpp.toLocaleString()}
                            </div>
                          </td>

                          {/* 6. Status Pesanan */}
                          <td className="py-3 px-3.5 text-center whitespace-nowrap">
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300 whitespace-nowrap shrink-0">
                                <Clock className="w-3 h-3 text-amber-600 animate-spin shrink-0" />
                                <span>Menunggu Konfirmasi</span>
                              </span>
                            )}
                            {isProcessing && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-950 border border-blue-300 whitespace-nowrap shrink-0">
                                <Boxes className="w-3 h-3 text-blue-600 shrink-0" />
                                <span>Sedang Diproses</span>
                              </span>
                            )}
                            {isShipped && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100 text-purple-950 border border-purple-300 whitespace-nowrap shrink-0">
                                <Truck className="w-3 h-3 text-purple-600 shrink-0" />
                                <span>Sedang Dikirim {order.trackingNumber ? `(${order.trackingNumber})` : ''}</span>
                              </span>
                            )}
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300 whitespace-nowrap shrink-0">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>Pesanan Selesai</span>
                              </span>
                            )}
                            {isCancelled && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-950 border border-rose-300 whitespace-nowrap shrink-0">
                                <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
                                <span>Dibatalkan</span>
                              </span>
                            )}
                          </td>

                          {/* 7. Aksi Penjual Berdasarkan Status */}
                          <td className="py-3 px-3.5 text-center whitespace-nowrap">
                            <div className="inline-flex items-center justify-center gap-1.5 flex-nowrap shrink-0">
                              {/* Action: Terima Pesanan */}
                              {isPending && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => acceptSellerOrder(order.id)}
                                    className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Terima pesanan dan mulai siapkan kemasan"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Terima</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setCancelingOrder(order)}
                                    className="px-2 py-1 rounded-md bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-700 border border-stone-200 text-[11px] font-bold transition-colors cursor-pointer"
                                    title="Tolak / batalkan pesanan ini"
                                  >
                                    <span>Tolak</span>
                                  </button>
                                </>
                              )}

                              {/* Action: Kirim Pesanan (Input Resi) */}
                              {isProcessing && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShippingOrder(order);
                                    setTrackingNumberInput(`EXP-${Date.now().toString().slice(-6)}`);
                                  }}
                                  className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                                  title="Masukkan nomor resi ekspedisi dan kirim paket"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Kirim Paket</span>
                                </button>
                              )}

                              {/* Action: Selesaikan Pesanan */}
                              {isShipped && (
                                <button
                                  type="button"
                                  onClick={() => completeSellerOrder(order.id)}
                                  className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                                  title="Konfirmasi bahwa pembeli telah menerima pesanan dan cairkan dana"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Konfirmasi Selesai</span>
                                </button>
                              )}

                              {/* Action: Selesai */}
                              {isCompleted && (
                                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                  Dana Dicairkan
                                </span>
                              )}

                              {/* Button: Timeline History Detail */}
                              <button
                                type="button"
                                onClick={() => setDetailOrder(order)}
                                className="p-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-300 transition-colors cursor-pointer"
                                title="Lihat rincian & riwayat status pesanan"
                              >
                                <Eye className="w-3.5 h-3.5 text-stone-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PRODUK TAYANG & STOK DI ETALASE                         */}
        {/* ============================================================== */}
        {activeTab === 'active_listings' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  Daftar Produk Aktif di Marketplace ({activeListings.length} Listing)
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Produk yang saat ini sedang tampil di etalase publik dan dapat dibeli langsung oleh mitra.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUploadPreselectedLotId(undefined);
                  setIsUploadModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>+ Upload Produk Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-orange-300 transition-all"
                >
                  <div>
                    <div className="relative h-36 bg-stone-100 overflow-hidden">
                      <img
                        src={item.photoUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/80 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                        <Tag className="w-3 h-3 text-amber-400" />
                        <span>{item.categoryLabel}</span>
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                        🟢 Live
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-stone-900 text-xs line-clamp-1">{item.title}</h4>
                      <div className="text-[11px] text-stone-500">
                        {item.origin} • {item.variety}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                        <div>
                          <span className="text-[10px] text-stone-400 block">Harga Jual:</span>
                          <strong className="text-orange-600 font-bold">
                            Rp {item.price.toLocaleString()} {item.priceUnit}
                          </strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 block">Stok Tersedia:</span>
                          <strong className="text-stone-800 font-black">
                            {item.availableStock} {item.stockUnit}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                    <Link
                      to={`/trace/${item.id}`}
                      target="_blank"
                      className="text-[11px] text-stone-600 hover:text-orange-600 font-bold flex items-center gap-1 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5 text-orange-600" />
                      <span>Passport QR</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        if (item.category === 'roasted_bean') {
                          toggleReleaseRoastedLotToMarketplace(item.id);
                        } else if (item.category === 'green_bean_warehouse') {
                          toggleReleaseWarehouseLotToMarketplace(item.id);
                        }
                      }}
                      className="px-2.5 py-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-[10px] transition-colors cursor-pointer"
                    >
                      Tarik dari Etalase
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ANTREAN SIAP RILIS (DEPLOY READY DRAFTS)                */}
        {/* ============================================================== */}
        {activeTab === 'ready_queue' && (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                Lot Internal Siap Rilis (*Deploy Ready Queue*) ({readyDeployLots.length} Lot)
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Lot internal yang telah menyelesaikan lembar kerja mutu (cupping / sortir) dan siap dibuatkan formulir komersialnya.
              </p>
            </div>

            <div className="overflow-x-auto border border-stone-200 rounded-lg">
              <table className="w-full text-left text-xs min-w-[950px]">
                <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 whitespace-nowrap">ID Lot &amp; Komoditas</th>
                    <th className="py-3 px-4 whitespace-nowrap">Kategori &amp; Asal</th>
                    <th className="py-3 px-4 whitespace-nowrap">Kualitas &amp; Skor Evaluasi</th>
                    <th className="py-3 px-4 whitespace-nowrap">Stok Internal</th>
                    <th className="py-3 px-4 whitespace-nowrap">Status Marketplace</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap">Aksi Peluncuran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {readyDeployLots.map((lot) => (
                    <tr key={lot.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={lot.photoUrl}
                            alt={lot.title}
                            className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0 shadow-2xs"
                          />
                          <div>
                            <div className="font-mono font-bold text-stone-900">{lot.id}</div>
                            <div className="text-[11px] font-bold text-stone-800 mt-0.5 line-clamp-1">{lot.title}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-stone-700 capitalize">
                          {lot.category.replace(/_/g, ' ')}
                        </span>
                        <div className="text-[10px] text-stone-500 mt-0.5">{lot.origin} • {lot.variety}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded inline-block text-[11px] whitespace-nowrap shrink-0">
                          {lot.qualityScoreDisplay}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-black text-stone-900">{lot.availableStockDisplay}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {lot.isAlreadyLive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Sudah Tayang di Etalase</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                            <Clock className="w-3 h-3 text-blue-600 shrink-0" />
                            <span>Deploy Ready (Draft)</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setUploadPreselectedLotId(lot.id);
                            setUploadPreselectedCategory(lot.category);
                            setIsUploadModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] shadow-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Upload className="w-3.5 h-3.5 shrink-0" />
                          <span>{lot.isAlreadyLive ? 'Ubah Listing' : '+ Upload Produk Ini'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: ANALISIS FINANSIAL & MARGIN HPP                         */}
        {/* ============================================================== */}
        {activeTab === 'margin_analysis' && (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                Analisis Struktur Biaya, HPP &amp; Margin Keuntungan Komoditas
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Evaluasi kelayakan laba kotor terhadap beban modal green bean, susut sangrai, dan biaya kemasan ritel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Rumus HPP Roastery Rekomendasi
                </span>
                <div className="font-mono text-xs bg-white p-2.5 rounded border border-stone-200 text-stone-800">
                  HPP = (Harga Beli GB / (1 - 16% Susut)) × 0.25kg + Packaging Valve Pouch (Rp 5.000)
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Menjamin perhitungan akurat pada setiap gram biji matang yang menyusut saat melewati tahap First &amp; Second Crack.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Rumus HPP Gudang Ekspor Rekomendasi
                </span>
                <div className="font-mono text-xs bg-white p-2.5 rounded border border-stone-200 text-stone-800">
                  HPP = Harga Beli Pengolah + Biaya Sortasi &amp; Kemasan GrainPro Hermetik (Rp 3.000/kg)
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Memperhitungkan proteksi kadar air $H_2O$ 10-12% dan Water Activity ($a_w$) dalam karung hermetik.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Kriteria Margin Sehat Industri Kopi
                </span>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-emerald-700 font-bold">
                    <span>Specialty Artisan Roastery:</span>
                    <span>&gt; 45%</span>
                  </div>
                  <div className="flex items-center justify-between text-blue-700 font-bold">
                    <span>Green Bean Grosir / Gudang:</span>
                    <span>20% - 30%</span>
                  </div>
                  <div className="flex items-center justify-between text-amber-700 font-bold">
                    <span>Ceri Merah Petik (Petani):</span>
                    <span>30% - 40%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Riwayat Margin per Pesanan Selesai */}
            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <div className="p-3 bg-stone-50 border-b border-stone-200 font-bold text-xs text-stone-800 flex items-center justify-between">
                <span>Rincian Realisasi Laba per Transaksi Penjualan</span>
                <span className="text-emerald-700 font-black">
                  Total Laba Bersih: Rp {totalRealizedProfit.toLocaleString()}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[750px]">
                  <thead className="bg-white text-stone-500 font-bold border-b border-stone-200 text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3 whitespace-nowrap">No. Order</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Produk</th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">Harga Jual / Unit</th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">HPP Modal / Unit</th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">Laba Bersih Total</th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">Margin %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {completedOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-emerald-50/20">
                        <td className="py-2.5 px-3 font-mono font-bold text-stone-900 whitespace-nowrap">{o.orderNumber}</td>
                        <td className="py-2.5 px-3 font-medium text-stone-800 whitespace-nowrap">{o.productTitle} ({o.quantity} unit)</td>
                        <td className="py-2.5 px-3 text-center font-mono whitespace-nowrap">Rp {o.unitPrice.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-stone-500 whitespace-nowrap">Rp {o.unitHpp.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-black text-emerald-700 whitespace-nowrap">
                          + Rp {o.grossProfit.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded font-black text-[10px] bg-emerald-100 text-emerald-800 whitespace-nowrap shrink-0">
                            {o.marginPercent}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: UPLOAD PRODUK MODAL                                   */}
      {/* ============================================================== */}
      <UploadProductModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        preSelectedLotId={uploadPreselectedLotId}
        preSelectedCategory={uploadPreselectedCategory}
        onSuccess={() => {
          setActiveTab('active_listings');
        }}
      />

      {/* ============================================================== */}
      {/* MODAL 2: SHIP ORDER MODAL (INPUT NOMOR RESI)                   */}
      {/* ============================================================== */}
      {shippingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-[#343a40] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Kirim Pesanan #{shippingOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setShippingOrder(null)}
                className="w-7 h-7 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-stone-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmShip} className="p-5 space-y-4 text-xs text-stone-700">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 space-y-1">
                <div className="font-bold text-blue-900">{shippingOrder.productTitle}</div>
                <div className="text-blue-800">
                  Pembeli: <strong>{shippingOrder.buyerOrganization || shippingOrder.buyerName}</strong> ({shippingOrder.quantity} unit)
                </div>
                <div className="text-[11px] text-blue-700">{shippingOrder.shippingAddress}</div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Pilih Ekspedisi / Kurir Logistik:</label>
                <select
                  value={courierNameInput}
                  onChange={(e) => setCourierNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 font-bold"
                  required
                >
                  <option value="JNE Trucking (JTR)">JNE Trucking (JTR)</option>
                  <option value="SiCepat Cargo">SiCepat Cargo</option>
                  <option value="Lalamove Pick Up Box">Lalamove Pick Up Box (Same Day)</option>
                  <option value="Deliveree Truk">Deliveree Truk</option>
                  <option value="Kurir Internal Roastery">Kurir Internal Roastery</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Nomor Resi / AWB:</label>
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="Contoh: JNE-992817263"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 font-mono font-bold"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShippingOrder(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Konfirmasi Pengiriman</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: ORDER DETAIL & STATUS TIMELINE MODAL                  */}
      {/* ============================================================== */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-[#343a40] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                  Rincian Pesanan Penjualan
                </span>
                <h3 className="font-bold text-sm text-white">{detailOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setDetailOrder(null)}
                className="w-7 h-7 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-stone-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-stone-700 max-h-[75vh] overflow-y-auto">
              {/* Product Card */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <div className="font-bold text-stone-900 text-sm">{detailOrder.productTitle}</div>
                <div className="text-stone-500 flex items-center gap-2">
                  <span>Kemasan: <strong>{detailOrder.packageWeight}</strong></span>
                  <span>•</span>
                  <span>Jumlah: <strong>{detailOrder.quantity} unit</strong></span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between font-mono">
                  <span>Total Nilai Pesanan:</span>
                  <strong className="text-stone-900 text-sm">Rp {detailOrder.totalAmount.toLocaleString()}</strong>
                </div>
                <div className="flex items-center justify-between font-mono text-emerald-700">
                  <span>Laba Bersih (Margin {detailOrder.marginPercent}%):</span>
                  <strong>+ Rp {detailOrder.grossProfit.toLocaleString()}</strong>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <h4 className="font-bold text-stone-800 text-xs mb-2">Riwayat Timeline Pesanan:</h4>
                <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-stone-200">
                  {detailOrder.statusHistory.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-orange-600 text-white font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <strong className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                            {item.status.replace(/_/g, ' ')}
                          </strong>
                          <span className="text-[10px] font-mono text-stone-400">{item.timestamp}</span>
                        </div>
                        {item.notes && (
                          <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed bg-stone-50 p-2 rounded border border-stone-100">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Details */}
              <div className="p-3 bg-stone-100 rounded-lg text-[11px] space-y-1">
                <div>Alamat Kirim: <strong>{detailOrder.shippingAddress}</strong></div>
                {detailOrder.courierName && (
                  <div>Ekspedisi: <strong>{detailOrder.courierName}</strong> (Resi: {detailOrder.trackingNumber})</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: CANCEL MODAL                                          */}
      {/* ============================================================== */}
      {cancelingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-rose-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Tolak / Batalkan Pesanan</h3>
              <button
                onClick={() => setCancelingOrder(null)}
                className="w-7 h-7 rounded-full bg-rose-800 hover:bg-rose-700 flex items-center justify-center text-rose-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmCancel} className="p-5 space-y-4 text-xs text-stone-700">
              <p className="text-stone-600">
                Apakah Anda yakin ingin membatalkan pesanan <strong>#{cancelingOrder.orderNumber}</strong>?
                Stok sebanyak <strong>{cancelingOrder.quantity} unit</strong> akan otomatis dikembalikan ke inventaris lot internal Anda.
              </p>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Alasan Pembatalan:</label>
                <textarea
                  rows={2}
                  value={cancelReasonInput}
                  onChange={(e) => setCancelReasonInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCancelingOrder(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Ya, Batalkan Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Icon for standard modal close
const X: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className || 'w-4 h-4'}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
