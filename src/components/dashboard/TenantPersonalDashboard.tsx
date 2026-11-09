import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import {
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  Award,
  CreditCard,
  Grid,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Sparkles,
  QrCode,
  Package,
  Layers,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Sliders,
  DollarSign,
  Activity,
} from 'lucide-react';
import { AppLauncherModal } from '../shared/AppLauncherModal';

export const TenantPersonalDashboard: React.FC = () => {
  const {
    currentUser,
    subscriptions,
    getUserSubscription,
    setActiveView,
    tenantActiveService,
    setTenantActiveService,
    farmerLots,
    coffeeFarms,
    processingBatches,
    processedLots,
    warehouseLots,
    roastedLots,
    cafeProducts,
    transactions,
    verificationStamps,
    setFarmerActiveTab,
    setProcessorActiveTab,
    setWarehouseActiveTab,
    setRoasterActiveTab,
    setCafeActiveTab,
    setVerifierActiveTab,
    ensureTenantSelfPipeline,
  } = useCoffee();

  const [launcherOpen, setLauncherOpen] = useState(false);

  if (!currentUser) return null;

  const userSub = getUserSubscription(currentUser.id) || subscriptions.find((s) => s.userId === currentUser.id) || {
    id: 'SUB-LIVE-' + currentUser.id.slice(-4),
    tierName: 'Paket Bundle All-In-One Full Access (1 Tahun)',
    status: 'active' as const,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    daysRemaining: 365,
    pricePaid: 29990000,
    allowedRoles: ['petani', 'pengolah', 'gudang', 'roaster', 'cafe', 'verifikator'],
  };

  // 1. Data Isolasi Tenant: Ambil data spesifik milik tenant ini
  const myFarms = coffeeFarms.filter((f) => f.farmerId === currentUser.id);
  const myHarvestLots = farmerLots.filter((l) => l.farmerId === currentUser.id);
  const myBatches = processingBatches.filter((b) => !b.processorId || b.processorId === currentUser.id);
  const myProcessedLots = processedLots.filter((p) => !p.processorId || p.processorId === currentUser.id);
  const myWarehouseLots = warehouseLots.filter((w) => !w.warehouseId || w.warehouseId === currentUser.id);
  const myRoastedLots = roastedLots.filter((r) => !r.roasterId || r.roasterId === currentUser.id);
  const myCafeProducts = cafeProducts.filter((c) => !c.cafeId || c.cafeId === currentUser.id);
  const myStamps = verificationStamps.filter(
    (s) => s.verifierOrg === currentUser.organization || s.id.includes(currentUser.id.slice(-4))
  );

  const myTransactions = transactions.filter(
    (t) =>
      t.fromName === currentUser.name ||
      t.toName === currentUser.name ||
      t.fromName === currentUser.organization ||
      t.toName === currentUser.organization ||
      t.fromRole === currentUser.role
  );

  // Perhitungan Metrik Tenant
  const totalFarmHectares = myFarms.reduce((acc, f) => acc + (f.landAreaHectares || 1.5), 0);
  const totalHarvestKg = myHarvestLots.reduce((acc, l) => acc + l.totalWeightKg, 0);
  const totalGreenBeanKg = myProcessedLots.reduce((acc, l) => acc + l.greenBeanWeightKg, 0);
  const totalWarehouseKg = myWarehouseLots.reduce((acc, l) => acc + l.weightKg, 0);
  const totalRoastedKg = myRoastedLots.reduce((acc, l) => acc + (l.availablePacks * (l.packageWeightGrams / 1000) || 25), 0);
  const totalCafeCups = myCafeProducts.reduce((acc, p) => acc + (p.availableStock || p.totalStock || 50), 0);

  const handleOpenService = (service: 'petani' | 'pengolah' | 'gudang' | 'roaster' | 'cafe' | 'verifikator', tab?: string) => {
    setTenantActiveService(service);
    if (tab) {
      if (service === 'petani') setFarmerActiveTab(tab as any);
      if (service === 'pengolah') setProcessorActiveTab(tab as any);
      if (service === 'gudang') setWarehouseActiveTab(tab as any);
      if (service === 'roaster') setRoasterActiveTab(tab as any);
      if (service === 'cafe') setCafeActiveTab(tab as any);
      if (service === 'verifikator') setVerifierActiveTab(tab as any);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Profil Tenant & Status Lisensi Bundle */}
      <div className="bg-gradient-to-br from-[#1C130E] via-[#2A1B14] to-[#18100B] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-amber-900/40 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Tenant PIC & Organization Info */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                STATUS SEWA: AKTIF
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Bundle 6 Layanan Terpadu
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono text-stone-400 bg-white/5 border border-white/10">
                Lisensi: {userSub.id}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                {currentUser.organization || 'Kelompok Tani / Bisnis Kopi Mandiri'}
              </h1>
              <p className="text-stone-300 text-sm mt-1 flex flex-wrap items-center gap-2">
                <span>PIC Penyewa: <strong className="text-amber-300">{currentUser.name}</strong></span>
                <span>•</span>
                <span className="text-stone-400">{currentUser.location || 'Solok, Sumatera Barat'}</span>
                <span>•</span>
                <span className="text-amber-200/90 font-medium">{userSub.tierName}</span>
              </p>
            </div>

            {/* License validity progress */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-stone-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Masa Aktif: <strong className="text-white">{userSub.startDate}</strong> s/d <strong className="text-white">{userSub.expiryDate}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Sisa Waktu: <strong className="text-emerald-300 font-bold">{userSub.daysRemaining} Hari</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Tombol Kotak di Pojok Kanan & Kelola Langganan */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            {/* TOMBOL KOTAK UTAMA (Pilih Module & 6 Service) */}
            <button
              type="button"
              onClick={() => setLauncherOpen(true)}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2.5 border border-amber-300 group"
              title="Buka Pilihan Modul & 6 Layanan (Tombol Kotak Pojok Kanan)"
            >
              <div className="w-6 h-6 rounded-lg bg-stone-950/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                <Grid className="w-4 h-4 text-stone-950" />
              </div>
              <span>PILIH MODULE (6 SERVICES)</span>
            </button>

            {/* Kelola Langganan Button */}
            <button
              type="button"
              onClick={() => setActiveView('subscription')}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white font-bold text-xs border border-white/15 transition-all cursor-pointer flex items-center justify-center gap-2"
              title="Buka Detail Faktur & Perpanjangan Langganan"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Kelola Langganan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Visualisasi Rantai Pasok Mandiri (Interactive Self-Pipeline 6-Tahap) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                Self-Pipeline Rantai Pasok Mandiri ({currentUser.organization})
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Alur kopi Anda bergerak secara tertutup (close-loop) dari kebun hingga ke cangkir seduh konsumen dengan data terisolasi.
            </p>
          </div>
          <button
            type="button"
            onClick={() => ensureTenantSelfPipeline(currentUser)}
            className="text-xs text-stone-500 hover:text-amber-700 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            title="Sinkronisasi Data Alur Mandiri"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sinkron Data Mandiri</span>
          </button>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Step 1: Kebun Petani */}
          <div
            onClick={() => handleOpenService('petani', 'farms')}
            className="group relative p-3.5 rounded-2xl bg-stone-50 hover:bg-lime-50/80 border border-stone-200/80 hover:border-lime-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-stone-400 group-hover:text-lime-700 tracking-wider">Tahap 1</span>
                <div className="w-7 h-7 rounded-xl bg-lime-600 text-white flex items-center justify-center shadow-xs">
                  <Sprout className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-black text-xs text-stone-900 leading-snug group-hover:text-lime-900">1. Kebun & Panen</h4>
              <p className="text-[11px] text-stone-500 mt-1 font-mono font-bold text-lime-700">
                {myHarvestLots.length} Lot ({totalHarvestKg.toLocaleString()} kg)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-bold text-stone-500 group-hover:text-lime-800">
              <span>Buka Kebun</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Step 2: Mill Pengolahan */}
          <div
            onClick={() => handleOpenService('pengolah', 'batches')}
            className="group relative p-3.5 rounded-2xl bg-stone-50 hover:bg-blue-50/80 border border-stone-200/80 hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-stone-400 group-hover:text-blue-700 tracking-wider">Tahap 2</span>
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Cog className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-black text-xs text-stone-900 leading-snug group-hover:text-blue-900">2. Mill & Fermentasi</h4>
              <p className="text-[11px] text-stone-500 mt-1 font-mono font-bold text-blue-700">
                {myBatches.length} Batch ({totalGreenBeanKg.toLocaleString()} kg GB)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-bold text-stone-500 group-hover:text-blue-800">
              <span>Buka Mill</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Step 3: Gudang Hermetik */}
          <div
            onClick={() => handleOpenService('gudang', 'inventory')}
            className="group relative p-3.5 rounded-2xl bg-stone-50 hover:bg-slate-50/80 border border-stone-200/80 hover:border-slate-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-stone-400 group-hover:text-slate-700 tracking-wider">Tahap 3</span>
                <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-xs">
                  <Warehouse className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-black text-xs text-stone-900 leading-snug group-hover:text-slate-900">3. Gudang Hermetis</h4>
              <p className="text-[11px] text-stone-500 mt-1 font-mono font-bold text-slate-800">
                {myWarehouseLots.length} Lot ({totalWarehouseKg.toLocaleString()} kg)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-bold text-stone-500 group-hover:text-slate-900">
              <span>Buka Gudang</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Step 4: Roastery Artisan */}
          <div
            onClick={() => handleOpenService('roaster', 'inventory')}
            className="group relative p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50/80 border border-stone-200/80 hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-stone-400 group-hover:text-amber-700 tracking-wider">Tahap 4</span>
                <div className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-black text-xs text-stone-900 leading-snug group-hover:text-amber-900">4. Artisan Roastery</h4>
              <p className="text-[11px] text-stone-500 mt-1 font-mono font-bold text-amber-700">
                {myRoastedLots.length} Batch ({totalRoastedKg.toLocaleString()} kg Sangrai)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-bold text-stone-500 group-hover:text-amber-800">
              <span>Buka Roastery</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Step 5: Smart POS Cafe */}
          <div
            onClick={() => handleOpenService('cafe', 'calculator')}
            className="group relative p-3.5 rounded-2xl bg-stone-50 hover:bg-orange-50/80 border border-stone-200/80 hover:border-orange-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-stone-400 group-hover:text-orange-700 tracking-wider">Tahap 5</span>
                <div className="w-7 h-7 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
                  <Coffee className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-black text-xs text-stone-900 leading-snug group-hover:text-orange-900">5. POS & Cangkir</h4>
              <p className="text-[11px] text-stone-500 mt-1 font-mono font-bold text-orange-700">
                {myCafeProducts.length} Menu ({totalCafeCups} Cup)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-bold text-stone-500 group-hover:text-orange-800">
              <span>Buka POS Cafe</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Step 6: Verifikator 4C */}
          <div
            onClick={() => handleOpenService('verifikator', 'petani')}
            className="group relative p-3.5 rounded-2xl bg-stone-50 hover:bg-purple-50/80 border border-stone-200/80 hover:border-purple-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-stone-400 group-hover:text-purple-700 tracking-wider">Tahap 6</span>
                <div className="w-7 h-7 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-black text-xs text-stone-900 leading-snug group-hover:text-purple-900">6. Verifikasi CT-4CI</h4>
              <p className="text-[11px] text-stone-500 mt-1 font-mono font-bold text-purple-700">
                Skor 96.5% (Grade A)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-bold text-stone-500 group-hover:text-purple-800">
              <span>Buka Audit</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Kartu Hub 6 Layanan Terpadu (Command Center 6 Services) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-stone-900 tracking-tight flex items-center gap-2">
              <Grid className="w-5 h-5 text-amber-600" />
              6 Layanan Stasiun Kerja Ekosistem Mandiri
            </h3>
            <p className="text-xs text-stone-500">
              Setiap layanan langsung membuka modul operasional stasiun kerja lengkap dengan data mandiri Anda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* SERVICE 1: HULU PETANI */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-lime-600 to-emerald-700 text-white flex items-center justify-center shadow-md">
                  <Sprout className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-lime-100 text-lime-900 border border-lime-300">
                  Service 1
                </span>
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 group-hover:text-lime-800 transition-colors">
                  🌿 1. Hulu Kebun & Panen Petani
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Pemetaan blok kebun, batas koordinat BPN, input timbang panen ceri merah, sortasi brix, dan cetak barcode lot karung.
                </p>
              </div>

              {/* Metrics Pill */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-100 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Lahan / Kebun</span>
                  <span className="text-sm font-black text-stone-800">{myFarms.length} Blok ({totalFarmHectares} Ha)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Panen Ceri</span>
                  <span className="text-sm font-black text-lime-700">{totalHarvestKg.toLocaleString()} kg</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenService('petani', 'farms')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-lime-700 hover:bg-lime-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Buka Stasiun Petani</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleOpenService('petani', 'upload')}
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                title="Input Panen Baru Langsung"
              >
                + Panen
              </button>
            </div>
          </div>

          {/* SERVICE 2: PENGOLAH / MILL */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-800 text-white flex items-center justify-center shadow-md">
                  <Cog className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300">
                  Service 2
                </span>
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 group-hover:text-blue-800 transition-colors">
                  ⚙️ 2. Stasiun Pengolahan Ceri (Mill)
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Worksheet 7-Stage Intake, proses olah basah/kering, fermentasi anaerobik, uji kadar air, dan pemanfaatan limbah cascara.
                </p>
              </div>

              {/* Metrics Pill */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-100 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Batch Fermentasi</span>
                  <span className="text-sm font-black text-stone-800">{myBatches.length} Aktif</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Stok Green Bean</span>
                  <span className="text-sm font-black text-blue-700">{totalGreenBeanKg.toLocaleString()} kg</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenService('pengolah', 'batches')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Buka Stasiun Pengolah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleOpenService('pengolah', 'sourcing')}
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                title="Sourcing Ceri Segar"
              >
                Sourcing
              </button>
            </div>
          </div>

          {/* SERVICE 3: GUDANG KONSINYASI */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-md">
                  <Warehouse className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-900 border border-slate-300">
                  Service 3
                </span>
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 group-hover:text-slate-900 transition-colors">
                  🏢 3. Gudang Konsinyasi & Logistik
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Penyimpanan hermetik karung GrainPro, monitoring sensor suhu/RH, QC grading specialty, dan pallet barcode pengiriman ekspor.
                </p>
              </div>

              {/* Metrics Pill */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-100 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Lot Hermetis</span>
                  <span className="text-sm font-black text-stone-800">{myWarehouseLots.length} Lot</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Stok Gudang</span>
                  <span className="text-sm font-black text-slate-800">{totalWarehouseKg.toLocaleString()} kg</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenService('gudang', 'inventory')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Buka Stasiun Gudang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SERVICE 4: ARTISAN ROASTERY */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-700 text-white flex items-center justify-center shadow-md">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                  Service 4
                </span>
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 group-hover:text-amber-800 transition-colors">
                  🔥 4. Artisan Roastery & Profil Sangrai
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Work Order sangrai digital, approval PO Green Bean, kurva Agtron specialty, dan manajemen kemasan bag roasted bean ber-QR.
                </p>
              </div>

              {/* Metrics Pill */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-100 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Batch Sangrai</span>
                  <span className="text-sm font-black text-stone-800">{myRoastedLots.length} Batch</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Stok Biji Sangrai</span>
                  <span className="text-sm font-black text-amber-700">{totalRoastedKg.toLocaleString()} kg</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenService('roaster', 'inventory')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Buka Stasiun Roastery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleOpenService('roaster', 'production')}
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                title="Input Kurva Sangrai"
              >
                Profil
              </button>
            </div>
          </div>

          {/* SERVICE 5: SMART POS & CAFE */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-700 text-white flex items-center justify-center shadow-md">
                  <Coffee className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-900 border border-orange-300">
                  Service 5
                </span>
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 group-hover:text-orange-800 transition-colors">
                  ☕ 5. Kedai Kafe & Smart POS
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Aplikasi kasir cepat, pembayaran QRIS, kalkulator resep seduh manual brew, dan cetak QR Code cangkir jejak kebun ke konsumen.
                </p>
              </div>

              {/* Metrics Pill */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-100 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Menu Aktif</span>
                  <span className="text-sm font-black text-stone-800">{myCafeProducts.length} Resep</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Kapasitas Saji</span>
                  <span className="text-sm font-black text-orange-700">{totalCafeCups} Cangkir</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenService('cafe', 'calculator')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Buka Smart POS Cafe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SERVICE 6: AUDIT CT-4CI */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-900 text-white flex items-center justify-center shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                  Service 6
                </span>
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 group-hover:text-purple-800 transition-colors">
                  📋 6. Dewan Verifikator CT-4CI
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Sertifikasi 108 checkpoint 4C Code of Conduct v4.1, verifikasi EUDR anti-deforestasi, dan stempel digital kriptografi sah.
                </p>
              </div>

              {/* Metrics Pill */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-100 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Kepatuhan 4C</span>
                  <span className="text-sm font-black text-stone-800">96.5% (Grade A)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Status EUDR</span>
                  <span className="text-sm font-black text-purple-700">Verified Legal</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenService('verifikator', 'petani')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Buka Stasiun Verifikator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Buku Log Transaksi Mandiri (Self-Pipeline Ledger) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="font-black text-sm text-stone-900">
              Log Pergerakan Komoditas Mandiri ({currentUser.organization})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-stone-400">
            {myTransactions.length} Aktivitas Rantai Pasok
          </span>
        </div>

        {myTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Stasiun Pengirim</th>
                  <th className="py-2.5 px-3">Stasiun Penerima</th>
                  <th className="py-2.5 px-3">Komoditas & Varietas</th>
                  <th className="py-2.5 px-3 text-right">Nilai / Berat</th>
                  <th className="py-2.5 px-3 text-center">Status Ledger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {myTransactions.slice(0, 5).map((trx) => (
                  <tr key={trx.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-stone-500">{trx.date}</td>
                    <td className="py-3 px-3 font-semibold text-stone-900">{trx.fromName}</td>
                    <td className="py-3 px-3 font-semibold text-stone-900">{trx.toName}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-stone-800">{trx.itemName}</span>
                      <span className="block text-[10px] text-stone-400 font-mono">Jumlah: {trx.quantity}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                      Rp {trx.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl">
            Belum ada pergerakan transaksi mandiri. Mulai dengan mencatat panen ceri baru di Stasiun Petani!
          </div>
        )}
      </div>

      {/* App Launcher Modal (Dibuka melalui Tombol Kotak Pojok Kanan) */}
      <AppLauncherModal
        isOpen={launcherOpen}
        onClose={() => setLauncherOpen(false)}
        onSelectRole={() => {}}
        onNavigateView={(view) => setActiveView(view)}
        onSelectModuleTab={(role, tab) => {
          handleOpenService(role as any, tab);
        }}
      />
    </div>
  );
};
