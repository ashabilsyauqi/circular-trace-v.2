import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCoffee } from '../../../context/CoffeeContext';
import { SellerOrder, MarketplaceCategory, UserRole } from '../../../types/coffee';
import {
  History,
  Receipt,
  Search,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers,
  Download,
  Printer,
  Eye,
  Store,
  Truck,
  ShieldCheck,
  Package,
  X,
} from 'lucide-react';
import { getScopedTenantData } from '../../../utils/tenantScoping';

export const BukuTransaksiPage: React.FC = () => {
  const { currentUser, users, sellerOrders } = useCoffee();

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const [scopeFilter, setScopeFilter] = useState<'my' | 'all'>('my');

  // Scoped members for multi-tenant isolation
  const { scopedFarmers, scopedProcessors } = useMemo(() => {
    return getScopedTenantData(currentUser, { users });
  }, [currentUser, users]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'this_month' | 'last_30_days'>('all');
  const [statusViewMode, setStatusViewMode] = useState<'selesai_only' | 'all'>('selesai_only');

  // Modal Detail Nota / Slip Bukti Transaksi
  const [selectedSlipOrder, setSelectedSlipOrder] = useState<SellerOrder | null>(null);

  // Modal Cetak Laporan Rekapitulasi A4
  const [isPrintReportModalOpen, setIsPrintReportModalOpen] = useState(false);

  // Filter orders by status (default is completed successful sales)
  const baseOrders = useMemo(() => {
    if (statusViewMode === 'selesai_only') {
      return sellerOrders.filter((o) => o.status === 'selesai');
    }
    return sellerOrders;
  }, [sellerOrders, statusViewMode]);

  // Filter by user / tenant involvement
  const scopedOrders = useMemo(() => {
    if (scopeFilter === 'all' && isSuperAdmin) {
      return baseOrders;
    }
    if (!currentUser) return [];

    const userOrg = (currentUser.organization || currentUser.kelompokTaniName || '').toLowerCase();
    const userName = (currentUser.name || '').toLowerCase();

    return baseOrders.filter((o) => {
      const isSeller =
        o.sellerId === currentUser.id ||
        o.sellerRole === currentUser.role ||
        (o.sellerName && (o.sellerName.toLowerCase().includes(userName) || (userOrg && o.sellerName.toLowerCase().includes(userOrg)))) ||
        (o.sellerOrganization && userOrg && o.sellerOrganization.toLowerCase().includes(userOrg)) ||
        scopedFarmers.some((f) => f.id === o.sellerId || (o.sellerName && f.name.toLowerCase() === o.sellerName.toLowerCase())) ||
        scopedProcessors.some((p) => p.id === o.sellerId || (o.sellerName && p.name.toLowerCase() === o.sellerName.toLowerCase()));

      const isBuyer =
        o.buyerId === currentUser.id ||
        o.buyerRole === currentUser.role ||
        (o.buyerName && (o.buyerName.toLowerCase().includes(userName) || (userOrg && o.buyerName.toLowerCase().includes(userOrg)))) ||
        (o.buyerOrganization && userOrg && o.buyerOrganization.toLowerCase().includes(userOrg));

      return isSeller || isBuyer;
    });
  }, [baseOrders, scopeFilter, currentUser, isSuperAdmin, scopedFarmers, scopedProcessors]);

  // Filter by search, category, and date
  const filteredOrders = useMemo(() => {
    return scopedOrders.filter((order) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q) ||
        order.productTitle.toLowerCase().includes(q) ||
        order.sellerName.toLowerCase().includes(q) ||
        (order.sellerOrganization && order.sellerOrganization.toLowerCase().includes(q)) ||
        order.buyerName.toLowerCase().includes(q) ||
        (order.buyerOrganization && order.buyerOrganization.toLowerCase().includes(q)) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(q)) ||
        (order.shippingAddress && order.shippingAddress.toLowerCase().includes(q));

      // 2. Category
      const matchCategory =
        categoryFilter === 'all' || order.category === categoryFilter;

      // 3. Date
      let matchDate = true;
      if (dateFilter === 'this_month') {
        const orderDate = new Date(order.date);
        const now = new Date();
        matchDate =
          orderDate.getFullYear() === now.getFullYear() &&
          orderDate.getMonth() === now.getMonth();
      } else if (dateFilter === 'last_30_days') {
        const orderDate = new Date(order.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        matchDate = orderDate >= thirtyDaysAgo;
      }

      return matchQuery && matchCategory && matchDate;
    });
  }, [scopedOrders, searchQuery, categoryFilter, dateFilter]);

  // Aggregate KPI Metrics
  const metrics = useMemo(() => {
    const completedList = filteredOrders.filter((o) => o.status === 'selesai');
    const totalGmv = completedList.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const totalProfit = completedList.reduce((acc, o) => acc + (o.grossProfit || 0), 0);
    const totalUnits = completedList.reduce((acc, o) => acc + (o.quantity || 0), 0);
    const avgOrderValue = completedList.length > 0 ? Math.round(totalGmv / completedList.length) : 0;
    const avgMarginPercent = totalGmv > 0 ? (totalProfit / totalGmv) * 100 : 0;

    return {
      totalGmv,
      totalProfit,
      totalUnits,
      avgOrderValue,
      avgMarginPercent,
      completedCount: completedList.length,
      totalCount: filteredOrders.length,
    };
  }, [filteredOrders]);

  // Helper formatting category label & color
  const getCategoryBadge = (cat: MarketplaceCategory) => {
    switch (cat) {
      case 'cherry':
        return {
          label: 'Ceri Kopi (Petani)',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'green_bean_wetmill':
        return {
          label: 'Green Bean (Wet Mill)',
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'green_bean_warehouse':
        return {
          label: 'Green Bean (Gudang)',
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
        };
      case 'roasted_bean':
        return {
          label: 'Roasted Bean (Roastery)',
          bg: 'bg-orange-100 text-orange-800 border-orange-300',
        };
      case 'cafe_retail':
        return {
          label: 'Retail & Cafe',
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
        };
      default:
        return {
          label: cat,
          bg: 'bg-stone-100 text-stone-800 border-stone-300',
        };
    }
  };

  // Helper formatting role badge
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'petani':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pengolah':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'gudang':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'roaster':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'cafe':
        return 'bg-stone-900 text-amber-200 border-stone-700';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (filteredOrders.length === 0) {
      alert('Tidak ada data transaksi untuk diekspor.');
      return;
    }

    const headers = [
      'No. Pesanan',
      'Tanggal',
      'Status',
      'Kategori',
      'Produk',
      'Lot Sumber',
      'Penjual',
      'Role Penjual',
      'Organisasi Penjual',
      'Pembeli',
      'Role Pembeli',
      'Organisasi Pembeli',
      'Kuantitas',
      'Kemasan',
      'Harga Satuan (Rp)',
      'HPP Modal (Rp)',
      'Total Omzet (Rp)',
      'Laba Bersih (Rp)',
      'Margin (%)',
      'Kurir Logistik',
      'No. Resi AWB',
      'Alamat Pengiriman',
    ];

    const rows = filteredOrders.map((o) => [
      `"${o.orderNumber || o.id}"`,
      `"${o.date}"`,
      `"${o.status}"`,
      `"${o.category}"`,
      `"${o.productTitle.replace(/"/g, '""')}"`,
      `"${o.sourceLotId}"`,
      `"${o.sellerName}"`,
      `"${o.sellerRole}"`,
      `"${o.sellerOrganization || '-'}"`,
      `"${o.buyerName}"`,
      `"${o.buyerRole}"`,
      `"${o.buyerOrganization || '-'}"`,
      o.quantity,
      `"${o.packageWeight}"`,
      o.unitPrice,
      o.unitHpp,
      o.totalAmount,
      o.grossProfit,
      o.marginPercent.toFixed(1),
      `"${o.courierName || '-'}"`,
      `"${o.trackingNumber || '-'}"`,
      `"${(o.shippingAddress || '-').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Rekap_Buku_Transaksi_Marketplace_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Action Center */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                Buku Transaksi &amp; Rekapitulasi Marketplace
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Panel LTE
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Buku besar pencatatan riwayat transaksi dan rekapitulasi penjualan yang berhasil diselesaikan di marketplace rantai pasok kopi CircularTrace.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tombol Cetak Laporan Rekapitulasi A4 */}
          <button
            type="button"
            onClick={() => setIsPrintReportModalOpen(true)}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-bold rounded-md shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Cetak format laporan rekapitulasi penjualan resmi siap cetak (A4)"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>Cetak Rekap A4</span>
          </button>

          {/* Tombol Ekspor CSV */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Unduh data tabel transaksi sebagai file CSV / Excel"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>

          {/* Tombol Buka Seller Panel */}
          <Link
            to="/admin/seller"
            className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-1.5 transition-all"
            title="Buka Seller Panel untuk memproses pesanan aktif"
          >
            <Store className="w-4 h-4" />
            <span>Seller Hub</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Summary Cards (AdminLTE Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Omzet Penjualan Selesai */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider block">
              Omzet Penjualan Berhasil
            </span>
            <div className="text-xl sm:text-2xl font-black text-stone-900 mt-1 font-mono">
              Rp {metrics.totalGmv.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{metrics.completedCount} transaksi lunas &amp; selesai</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Laba Bersih / Margin */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center justify-between border-l-4 border-l-amber-500">
          <div>
            <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider block">
              Total Laba Kotor / Margin
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-900 mt-1 font-mono">
              Rp {metrics.totalProfit.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-amber-800 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-amber-600" />
              <span>Rata-rata margin: {metrics.avgMarginPercent.toFixed(1)}%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Total Transaksi Selesai */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center justify-between border-l-4 border-l-blue-500">
          <div>
            <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider block">
              Transaksi Terverifikasi
            </span>
            <div className="text-xl sm:text-2xl font-black text-blue-900 mt-1 font-mono">
              {metrics.completedCount}{' '}
              <span className="text-sm font-semibold text-stone-500">Transaksi</span>
            </div>
            <div className="text-[11px] text-blue-700 font-medium mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>Paspor digital EUDR &amp; QR</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Rata-Rata Nilai Transaksi */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center justify-between border-l-4 border-l-purple-500">
          <div>
            <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider block">
              Rata-Rata Order (AOV)
            </span>
            <div className="text-xl sm:text-2xl font-black text-purple-900 mt-1 font-mono">
              Rp {metrics.avgOrderValue.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-purple-700 font-medium mt-1 flex items-center gap-1">
              <Receipt className="w-3 h-3 text-purple-600" />
              <span>Total {metrics.totalUnits} unit/paket terjual</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Filter Navigation & Scope Selector */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 space-y-4">
        {/* Top Filter Row: Scope Tabs & Status View */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider mr-1">
              Lingkup:
            </span>
            <button
              type="button"
              onClick={() => setScopeFilter('my')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                scopeFilter === 'my'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Penjualan Akun ({currentUser?.name?.split(' ')[0] || 'Unit'})
            </button>
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => setScopeFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  scopeFilter === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Semua Penjualan Platform (Super Admin)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-stone-500">Filter Status:</span>
            <button
              type="button"
              onClick={() => setStatusViewMode('selesai_only')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                statusViewMode === 'selesai_only'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              ✓ Hanya Berhasil (Selesai)
            </button>
            <button
              type="button"
              onClick={() => setStatusViewMode('all')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                statusViewMode === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              Semua Siklus Pesanan
            </button>
          </div>
        </div>

        {/* Bottom Filter Row: Search & Category Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari No. Pesanan, Produk, Pembeli, Penjual, Resi Kurir..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-300 rounded-md text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="md:col-span-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-md text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden font-medium"
            >
              <option value="all">Semua Komoditas / Kategori</option>
              <option value="cherry">Ceri Kopi Petik Merah (Petani)</option>
              <option value="green_bean_wetmill">Green Bean Hulling (Wet Mill)</option>
              <option value="green_bean_warehouse">Green Bean Silo (Gudang)</option>
              <option value="roasted_bean">Roasted Bean Artisan (Roastery)</option>
              <option value="cafe_retail">Retail &amp; Drip Bag (Cafe)</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="md:col-span-3">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-md text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden font-medium"
            >
              <option value="all">Semua Rentang Waktu</option>
              <option value="this_month">Bulan Ini</option>
              <option value="last_30_days">30 Hari Terakhir</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Tabel Buku Transaksi (AdminLTE 3 Styled Card) */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#d2d6de] bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-stone-800">
              Daftar Rekap Transaksi Penjualan Berhasil ({filteredOrders.length})
            </h2>
          </div>
          <span className="text-[11px] text-stone-500">
            Terhubung langsung dengan ledger smart contract &amp; paspor komoditas
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-stone-800">Tidak ada riwayat transaksi yang cocok</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
              {searchQuery || categoryFilter !== 'all'
                ? 'Coba atur ulang kata kunci pencarian atau filter kategori Anda.'
                : 'Belum ada transaksi penjualan berstatus selesai pada filter yang dipilih.'}
            </p>
            {(searchQuery || categoryFilter !== 'all' || dateFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setDateFilter('all');
                }}
                className="mt-3 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-md"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100/80 text-stone-600 border-b border-stone-200 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">No. Pesanan / Tanggal</th>
                  <th className="py-3 px-4">Komoditas &amp; Lot</th>
                  <th className="py-3 px-4">Penjual</th>
                  <th className="py-3 px-4">Pembeli</th>
                  <th className="py-3 px-4 text-right">Kuantitas</th>
                  <th className="py-3 px-4 text-right">Nilai Transaksi (Rp)</th>
                  <th className="py-3 px-4 text-right">Laba Bersih</th>
                  <th className="py-3 px-4">Logistik &amp; Resi</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredOrders.map((order) => {
                  const catBadge = getCategoryBadge(order.category);
                  const isFinished = order.status === 'selesai';
                  const isCurrentSeller =
                    order.sellerId === currentUser?.id || order.sellerRole === currentUser?.role;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-amber-50/40 transition-colors group"
                    >
                      {/* No. Pesanan & Tanggal */}
                      <td className="py-3.5 px-4 align-top font-mono">
                        <div className="font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                          {order.orderNumber || order.id}
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>{order.date}</span>
                        </div>
                        {isCurrentSeller && (
                          <span className="mt-1 inline-block text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            Toko Saya
                          </span>
                        )}
                      </td>

                      {/* Komoditas & Lot */}
                      <td className="py-3.5 px-4 align-top max-w-[220px]">
                        <div className="flex items-start gap-2.5">
                          {order.productImage ? (
                            <img
                              src={order.productImage}
                              alt={order.productTitle}
                              className="w-10 h-10 rounded-md object-cover border border-stone-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-stone-100 flex items-center justify-center shrink-0 text-stone-400">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-bold text-stone-900 block leading-tight line-clamp-2">
                              {order.productTitle}
                            </span>
                            <div className="flex flex-wrap items-center gap-1 mt-1">
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded-sm border font-semibold ${catBadge.bg}`}
                              >
                                {catBadge.label}
                              </span>
                              {order.sourceLotId && (
                                <span className="text-[9px] px-1 py-0.2 bg-stone-100 text-stone-600 rounded font-mono font-medium">
                                  #{order.sourceLotId}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Penjual */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-semibold text-stone-900">
                          {order.sellerName}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate max-w-[150px]">
                          {order.sellerOrganization || '-'}
                        </div>
                        <span
                          className={`mt-1 inline-block text-[9px] px-1.5 py-0.2 rounded-sm border font-bold uppercase ${getRoleBadge(
                            order.sellerRole
                          )}`}
                        >
                          {order.sellerRole}
                        </span>
                      </td>

                      {/* Pembeli */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-semibold text-stone-900">
                          {order.buyerName}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate max-w-[150px]">
                          {order.buyerOrganization || '-'}
                        </div>
                        <span
                          className={`mt-1 inline-block text-[9px] px-1.5 py-0.2 rounded-sm border font-bold uppercase ${getRoleBadge(
                            order.buyerRole
                          )}`}
                        >
                          {order.buyerRole}
                        </span>
                      </td>

                      {/* Kuantitas */}
                      <td className="py-3.5 px-4 align-top text-right font-mono">
                        <div className="font-bold text-stone-900">
                          {order.quantity} x
                        </div>
                        <div className="text-[10px] text-stone-500 font-sans">
                          {order.packageWeight}
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          @Rp {order.unitPrice.toLocaleString('id-ID')}
                        </div>
                      </td>

                      {/* Nilai Transaksi */}
                      <td className="py-3.5 px-4 align-top text-right font-mono">
                        <div className="text-sm font-black text-emerald-800">
                          Rp {order.totalAmount.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          HPP: Rp {order.totalHpp.toLocaleString('id-ID')}
                        </div>
                      </td>

                      {/* Margin Laba */}
                      <td className="py-3.5 px-4 align-top text-right font-mono">
                        <div className="font-bold text-amber-900">
                          +Rp {order.grossProfit.toLocaleString('id-ID')}
                        </div>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                          {order.marginPercent.toFixed(1)}%
                        </span>
                      </td>

                      {/* Logistik & Resi */}
                      <td className="py-3.5 px-4 align-top max-w-[160px]">
                        <div className="flex items-center gap-1 font-semibold text-stone-800 truncate">
                          <Truck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="truncate">{order.courierName || 'Armada Mandiri'}</span>
                        </div>
                        {order.trackingNumber && (
                          <div className="text-[10px] font-mono text-stone-600 truncate mt-0.5">
                            Resi: {order.trackingNumber}
                          </div>
                        )}
                        {order.shippingAddress && (
                          <div className="text-[10px] text-stone-400 truncate mt-0.5">
                            {order.shippingAddress}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 align-top text-center">
                        {isFinished ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Selesai &amp; Lunas</span>
                          </span>
                        ) : order.status === 'dikirim' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                            <Truck className="w-3 h-3 text-blue-600" />
                            <span>Dalam Kirim</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <span>{order.status}</span>
                          </span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 align-top text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedSlipOrder(order)}
                          className="px-2.5 py-1.5 rounded-md bg-stone-100 hover:bg-emerald-600 hover:text-white text-stone-700 text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1 mx-auto cursor-pointer"
                          title="Lihat Slip Nota Digital & Bukti Transaksi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Slip Nota</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Summary Info */}
        <div className="p-4 border-t border-[#d2d6de] bg-stone-50/50 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <div>
            Menampilkan <strong className="text-stone-800">{filteredOrders.length}</strong> transaksi dari total {sellerOrders.length} pesanan marketplace terdaftar.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Semua transaksi telah tersertifikasi EUDR &amp; lolos uji traceability.</span>
          </div>
        </div>
      </div>

      {/* 5. MODAL SLIP NOTA DIGITAL / BUKTI TRANSAKSI */}
      {selectedSlipOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-black">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold leading-tight">
                    Bukti &amp; Slip Transaksi Marketplace
                  </h3>
                  <span className="text-[11px] text-stone-400 font-mono">
                    #{selectedSlipOrder.orderNumber || selectedSlipOrder.id}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlipOrder(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700 font-sans">
              {/* Slip Official Badge & Status */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Status Pembayaran &amp; Transaksi
                  </span>
                  <span className="text-sm font-black text-emerald-900 flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>LUNAS &amp; SELESAI DIVERIFIKASI</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block font-mono">
                    Tanggal Transaksi
                  </span>
                  <span className="font-bold text-stone-800 font-mono">
                    {selectedSlipOrder.date}
                  </span>
                </div>
              </div>

              {/* Penjual & Pembeli Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">
                    Pihak Penjual (Seller)
                  </span>
                  <div className="font-bold text-stone-900 mt-1">
                    {selectedSlipOrder.sellerName}
                  </div>
                  <div className="text-[11px] text-stone-600">
                    {selectedSlipOrder.sellerOrganization || '-'}
                  </div>
                  <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-stone-200 text-stone-800 font-bold uppercase">
                    Role: {selectedSlipOrder.sellerRole}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">
                    Pihak Pembeli (Buyer)
                  </span>
                  <div className="font-bold text-stone-900 mt-1">
                    {selectedSlipOrder.buyerName}
                  </div>
                  <div className="text-[11px] text-stone-600">
                    {selectedSlipOrder.buyerOrganization || '-'}
                  </div>
                  <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-stone-200 text-stone-800 font-bold uppercase">
                    Role: {selectedSlipOrder.buyerRole}
                  </span>
                </div>
              </div>

              {/* Rincian Komoditas / Barang */}
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <div className="bg-stone-100 px-4 py-2 font-bold text-stone-800 text-[11px] flex justify-between">
                  <span>Rincian Komoditas Pesanan</span>
                  <span>Nilai Subtotal</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-stone-900 text-sm">
                        {selectedSlipOrder.productTitle}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Kuantitas: {selectedSlipOrder.quantity} x {selectedSlipOrder.packageWeight}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                        Lot Paspor Traceability: #{selectedSlipOrder.sourceLotId}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-stone-900">
                        Rp {selectedSlipOrder.totalAmount.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        @Rp {selectedSlipOrder.unitPrice.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-stone-200 pt-3 space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-stone-600">
                      <span>Harga Pokok Penjualan (HPP):</span>
                      <span className="font-mono">Rp {selectedSlipOrder.totalHpp.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-amber-900 bg-amber-50 p-2 rounded-lg">
                      <span>Laba Bersih / Margin Realisasi:</span>
                      <span className="font-mono">
                        Rp {selectedSlipOrder.grossProfit.toLocaleString('id-ID')} ({selectedSlipOrder.marginPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistik & Pengiriman */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">
                  Informasi Ekspedisi &amp; Alamat Kirim
                </span>
                <div className="flex justify-between">
                  <span className="text-stone-600">Kurir / Ekspedisi:</span>
                  <span className="font-bold text-stone-800">{selectedSlipOrder.courierName || 'Armada Pick-up'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Nomor Resi / AWB:</span>
                  <span className="font-mono font-bold text-emerald-700">{selectedSlipOrder.trackingNumber || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Tujuan:</span>
                  <span className="text-stone-800 text-right max-w-xs">{selectedSlipOrder.shippingAddress || '-'}</span>
                </div>
              </div>

              {/* Riwayat Status Timeline */}
              {selectedSlipOrder.statusHistory && selectedSlipOrder.statusHistory.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block mb-2">
                    Jejak Waktu Siklus Pesanan
                  </span>
                  <div className="space-y-2 border-l-2 border-emerald-500 pl-3">
                    {selectedSlipOrder.statusHistory.map((step, idx) => (
                      <div key={idx} className="relative">
                        <div className="w-2 h-2 rounded-full bg-emerald-600 absolute -left-[17px] top-1"></div>
                        <div className="font-bold text-stone-800 text-[11px] capitalize">
                          {step.status.replace(/_/g, ' ')}
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono">
                          {step.timestamp} {step.updatedBy ? `• Oleh ${step.updatedBy}` : ''}
                        </div>
                        {step.notes && (
                          <div className="text-[10px] text-stone-500 italic mt-0.5">
                            "{step.notes}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Nota Slip</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedSlipOrder(null)}
                className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL CETAK LAPORAN REKAPITULASI RESMI A4 */}
      {isPrintReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">
                  Laporan Rekapitulasi Penjualan Marketplace (Format Cetak A4)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPrintReportModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-stone-800 bg-white" id="printable-rekap">
              {/* Kop Laporan Resmi */}
              <div className="border-b-2 border-stone-900 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-stone-950 uppercase">
                    CircularCoffee • Ekosistem Kopi
                  </h2>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Laporan Rekapitulasi Perdagangan &amp; Penjualan Marketplace Terpadu
                  </p>
                  <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                    Periode Cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300">
                    TERVERIFIKASI
                  </span>
                  <div className="text-[10px] text-stone-400 mt-1 font-mono">
                    Doc ID: REP-TRX-{new Date().toISOString().slice(0, 10)}
                  </div>
                </div>
              </div>

              {/* Ringkasan Finansial */}
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 text-[10px] uppercase font-bold block">
                    Total Omzet Penjualan
                  </span>
                  <span className="text-base font-black text-emerald-800 font-mono">
                    Rp {metrics.totalGmv.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 text-[10px] uppercase font-bold block">
                    Total Laba Kotor / Margin
                  </span>
                  <span className="text-base font-black text-amber-800 font-mono">
                    Rp {metrics.totalProfit.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 text-[10px] uppercase font-bold block">
                    Total Transaksi Selesai
                  </span>
                  <span className="text-base font-black text-stone-900 font-mono">
                    {metrics.completedCount} Transaksi
                  </span>
                </div>
              </div>

              {/* Tabel Ringkas Transaksi */}
              <table className="w-full text-left text-[11px] border-collapse border border-stone-300">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-300 font-bold">
                    <th className="p-2 border-r border-stone-300">No. Pesanan</th>
                    <th className="p-2 border-r border-stone-300">Tanggal</th>
                    <th className="p-2 border-r border-stone-300">Produk / Komoditas</th>
                    <th className="p-2 border-r border-stone-300">Penjual &rarr; Pembeli</th>
                    <th className="p-2 border-r border-stone-300 text-right">Kuantitas</th>
                    <th className="p-2 text-right">Total Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredOrders.map((o) => (
                    <tr key={o.id}>
                      <td className="p-2 border-r border-stone-300 font-mono">{o.orderNumber || o.id}</td>
                      <td className="p-2 border-r border-stone-300">{o.date}</td>
                      <td className="p-2 border-r border-stone-300 font-medium">{o.productTitle}</td>
                      <td className="p-2 border-r border-stone-300">
                        {o.sellerName} &rarr; {o.buyerName}
                      </td>
                      <td className="p-2 border-r border-stone-300 text-right font-mono">
                        {o.quantity} {o.packageWeight}
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-emerald-800">
                        Rp {o.totalAmount.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Kolom Tanda Tangan Resmi */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
                <div>
                  <p className="text-stone-500">Dibuat &amp; Dicatat Oleh,</p>
                  <p className="font-bold text-stone-900 mt-1">{currentUser?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-stone-400">{currentUser?.organization || 'Kelompok Tani'}</p>
                  <div className="h-16 border-b border-stone-300 w-48 mx-auto mt-2"></div>
                  <p className="text-[10px] text-stone-400 mt-1">Tanda Tangan &amp; Cap</p>
                </div>
                <div>
                  <p className="text-stone-500">Mengetahui &amp; Memverifikasi,</p>
                  <p className="font-bold text-stone-900 mt-1">Pengurus Internal Control System (ICS)</p>
                  <p className="text-[10px] text-stone-400">Verifikator Mutu Rantai Pasok</p>
                  <div className="h-16 border-b border-stone-300 w-48 mx-auto mt-2"></div>
                  <p className="text-[10px] text-stone-400 mt-1">Tanda Tangan &amp; Cap</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar A4</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPrintReportModalOpen(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BukuTransaksiPage;
