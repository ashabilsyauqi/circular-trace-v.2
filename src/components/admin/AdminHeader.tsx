import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { ROLE_DETAILS } from '../../constants/roles';
import { UserRole } from '../../types/coffee';
import {
  ShieldCheck,
  Store,
  Bell,
  Search,
  Package,
  Layers,
  Sparkles,
  Grid,
  ShoppingCart,
  Warehouse,
  Flame,
  Sliders,
  Award,
  History,
  Recycle,
  ChevronDown,
  Check,
  CheckCircle2,
  Sprout,
  PlusCircle,
  FileSpreadsheet,
  Coffee,
  Clock,
  Users,
  Crown,
  Home,
} from 'lucide-react';
import { AppLauncherModal } from '../shared/AppLauncherModal';
import { ProfileMenu } from '../shared/ProfileMenu';
import { LanguageSwitch } from '../shared/LanguageSwitch';
import { StakeholderFormsModal } from '../forms/StakeholderFormsModal';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

interface PipelineStageItem {
  id: string;
  stepNumber: number;
  label: string;
  subtitle: string;
  icon: React.ElementType;
  badge: number;
  badgeLabel?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = () => {
  const {
    currentUser,
    route,
    getUserSubscription,
    users,
    setActiveView,
    loginAsRole,
    transactions,
    roasterActiveTab,
    setRoasterActiveTab,
    workOrders,
    purchaseOrders,
    warehouseLots,
    masterProfiles,
    qcSessions,
    salesOrders,
    farmerActiveTab,
    setFarmerActiveTab,
    coffeeFarms,
    processorActiveTab,
    setProcessorActiveTab,
    farmerLots,
    processedLots,
    processingBatches,
    warehouseActiveTab,
    setWarehouseActiveTab,
    cafeActiveTab,
    setCafeActiveTab,
    cafeInventory,
    cafeProducts,
    roastedLots,
    verifierActiveTab,
    setVerifierActiveTab,
    verificationStamps,
    tenantActiveService,
    setTenantActiveService,
    impersonatingFromUser,
    returnToSuperAdmin,
  } = useCoffee();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
  const [moduleDropdownOpen, setModuleDropdownOpen] = useState(false);
  const [formsModalOpen, setFormsModalOpen] = useState(false);

  if (!currentUser) return null;

  const effectiveRole: UserRole =
    route.view === 'dashboard' && route.service && ['petani', 'pengolah', 'gudang', 'roaster', 'cafe', 'verifikator', 'superadmin', 'admin'].includes(route.service)
      ? (route.service === 'admin' ? 'superadmin' : (route.service as UserRole))
      : (currentUser.role !== 'superadmin' && tenantActiveService && tenantActiveService !== 'dashboard' ? (tenantActiveService as UserRole) : currentUser.role);

  const activeStationUser = (currentUser.role === effectiveRole)
    ? currentUser
    : (users.find(u => u.role === effectiveRole) || currentUser);

  const currentRoleInfo = ROLE_DETAILS[effectiveRole] || ROLE_DETAILS[currentUser.role];
  const recentTransactions = transactions.slice(0, 4);
  const currentSub = currentUser ? getUserSubscription(currentUser.id) : null;

  // Roaster metrics
  const pendingApprovalPOCount = purchaseOrders.filter(
    (p) => (!p.roasterId || p.roasterId === currentUser.id) && p.status === 'pending_approval'
  ).length;
  const pendingIncomingQcCount = warehouseLots.filter((l) => l.qcStatus === 'pending_qc').length;
  const activeWorkOrdersCount = workOrders.filter(
    (w) => (!w.roasterId || w.roasterId === currentUser.id) && w.status !== 'completed'
  ).length;
  const activeSalesOrdersCount = salesOrders.filter(
    (s) => (!s.roasterId || s.roasterId === currentUser.id) && s.status !== 'dispatched'
  ).length;
  const myRoasterTransactionsCount = transactions.filter(
    (trx) =>
      trx.fromName === currentUser.name ||
      trx.toName === currentUser.name ||
      trx.fromName === currentUser.organization ||
      trx.toName === currentUser.organization
  ).length;

  // Processor metrics
  const availableFarmerCherryLots = farmerLots.filter((l) => l.availableWeightKg > 0).length;
  const activeProcessingBatchesCount = processingBatches.filter(
    (b) => (!b.processorId || b.processorId === currentUser.id) && b.status === 'in_progress'
  ).length;
  const myProcessedLotsCount = processedLots.filter(
    (l) => !l.processorId || l.processorId === currentUser.id
  ).length;
  const readyToSellProcessedLotsCount = processedLots.filter(
    (l) => (!l.processorId || l.processorId === currentUser.id) && l.availableWeightKg > 0
  ).length;
  const myProcessorTransactionsCount = transactions.filter(
    (trx) =>
      trx.fromName === currentUser.name ||
      trx.toName === currentUser.name ||
      trx.fromName === currentUser.organization ||
      trx.toName === currentUser.organization
  ).length;

  // Farmer metrics
  const myFarmerFarmsCount = coffeeFarms.filter((f) => f.farmerId === currentUser.id).length;
  const myFarmerLotsCount = farmerLots.filter((l) => l.farmerId === currentUser.id).length;
  const myFarmerTransactionsCount = transactions.filter(
    (trx) =>
      trx.fromName === currentUser.name ||
      trx.toName === currentUser.name ||
      trx.fromName === currentUser.organization ||
      trx.toName === currentUser.organization
  ).length;

  // Warehouse metrics
  const myWarehouseLotsCount = warehouseLots.filter(
    (l) => !l.warehouseId || l.warehouseId === currentUser.id
  ).length;
  const myWarehouseTransactionsCount = transactions.filter(
    (t) =>
      t.fromName === currentUser.name ||
      t.toName === currentUser.name ||
      t.fromName === currentUser.organization ||
      t.toName === currentUser.organization
  ).length;

  // Cafe metrics
  const myCafeInventoryCount = cafeInventory.filter(
    (i) => !i.cafeId || i.cafeId === currentUser.id
  ).length;
  const myCafeProductsCount = cafeProducts.filter(
    (p) => !p.cafeId || p.cafeId === currentUser.id
  ).length;
  const myCafeTransactionsCount = transactions.filter(
    (t) =>
      t.fromName === currentUser.name ||
      t.toName === currentUser.name ||
      t.fromName === currentUser.organization ||
      t.toName === currentUser.organization
  ).length;

  // Define operational pipeline stages for each role
  const farmerStages: PipelineStageItem[] = [
    {
      id: 'farms',
      stepNumber: 1,
      label: 'Lahan & Kebun',
      subtitle: 'Profil Lahan, Elevasi, Cuaca & Patok BPN',
      icon: Sprout,
      badge: myFarmerFarmsCount,
      badgeLabel: `${myFarmerFarmsCount} Kebun`,
    },
    {
      id: 'upload',
      stepNumber: 2,
      label: 'Panen Baru',
      subtitle: 'Pencatatan Ceri Merah, Brix & Sortasi',
      icon: PlusCircle,
      badge: 0,
    },
    {
      id: 'catalog',
      stepNumber: 3,
      label: 'Panel Seller Ceri',
      subtitle: 'Katalog Penjualan Ceri Pribadi ke Mill',
      icon: Store,
      badge: myFarmerLotsCount,
      badgeLabel: `${myFarmerLotsCount} Lot`,
    },
    {
      id: 'history',
      stepNumber: 4,
      label: 'Buku Kas & Ledger',
      subtitle: 'Riwayat Transaksi Penjualan & Keuangan',
      icon: History,
      badge: myFarmerTransactionsCount,
      badgeLabel: `${myFarmerTransactionsCount} Rekam`,
    },
  ];

  const processorStages: PipelineStageItem[] = [
    {
      id: 'sourcing',
      stepNumber: 1,
      label: 'Sourcing Ceri',
      subtitle: 'Pembelian Ceri Kopi dari Petani Lokal',
      icon: ShoppingCart,
      badge: availableFarmerCherryLots,
      badgeLabel: `${availableFarmerCherryLots} Lot Ceri`,
    },
    {
      id: 'batches',
      stepNumber: 2,
      label: 'Batch Olahan',
      subtitle: 'Proses Washed, Natural, Honey & Dry Mill',
      icon: Flame,
      badge: activeProcessingBatchesCount,
      badgeLabel: `${activeProcessingBatchesCount} Batch Aktif`,
    },
    {
      id: 'inventory',
      stepNumber: 3,
      label: 'Green Bean & Limbah',
      subtitle: 'Inventaris Green Bean & Sirkular Kompos/Cascara',
      icon: Recycle,
      badge: myProcessedLotsCount,
      badgeLabel: `${myProcessedLotsCount} Lot GB`,
    },
    {
      id: 'selling',
      stepNumber: 4,
      label: 'Panel Seller Mill',
      subtitle: 'Katalog Penjualan Green Bean ke Roaster',
      icon: Store,
      badge: readyToSellProcessedLotsCount,
      badgeLabel: `${readyToSellProcessedLotsCount} Siap Jual`,
    },
    {
      id: 'history',
      stepNumber: 5,
      label: 'Buku Kas & Ledger',
      subtitle: 'Buku Besar Keuangan Pengolahan',
      icon: History,
      badge: myProcessorTransactionsCount,
      badgeLabel: `${myProcessorTransactionsCount} Rekam`,
    },
  ];

  const roasterStages: PipelineStageItem[] = [
    {
      id: 'purchasing',
      stepNumber: 1,
      label: 'Pengadaan PO',
      subtitle: 'Purchase Order Biji Hijau dari Gudang / Mill',
      icon: ShoppingCart,
      badge: pendingApprovalPOCount,
      badgeLabel: pendingApprovalPOCount > 0 ? `${pendingApprovalPOCount} Pending` : undefined,
    },
    {
      id: 'inventory',
      stepNumber: 2,
      label: 'Gudang Biji & QC',
      subtitle: 'Verifikasi Fisik & Mutu Green Bean Masuk',
      icon: Warehouse,
      badge: pendingIncomingQcCount,
      badgeLabel: pendingIncomingQcCount > 0 ? `${pendingIncomingQcCount} Butuh QC` : undefined,
    },
    {
      id: 'work_orders',
      stepNumber: 3,
      label: 'Roasting & SPK',
      subtitle: 'Perencanaan Jadwal Sangrai & Eksekusi Batch',
      icon: Flame,
      badge: activeWorkOrdersCount,
      badgeLabel: `${activeWorkOrdersCount} WO Aktif`,
    },
    {
      id: 'production',
      stepNumber: 4,
      label: 'Profil Sangrai',
      subtitle: 'Kurva Roasting, Agtron SCA & DTR Ratio',
      icon: Sliders,
      badge: masterProfiles.length,
      badgeLabel: `${masterProfiles.length} Profil`,
    },
    {
      id: 'qc',
      stepNumber: 5,
      label: 'Cupping Lab',
      subtitle: 'Uji Cita Rasa Sensori, Skor SCA & Tasting Notes',
      icon: Award,
      badge: qcSessions.length,
      badgeLabel: `${qcSessions.length} Sesi`,
    },
    {
      id: 'selling',
      stepNumber: 6,
      label: 'Panel Seller B2B',
      subtitle: 'Katalog Penjualan Biji Sangrai ke Kedai',
      icon: Store,
      badge: activeSalesOrdersCount,
      badgeLabel: `${activeSalesOrdersCount} Order Aktif`,
    },
    {
      id: 'history',
      stepNumber: 7,
      label: 'Buku Kas & Ledger',
      subtitle: 'Pembukuan Finansial, HPP & Laba Rugi',
      icon: History,
      badge: myRoasterTransactionsCount,
      badgeLabel: `${myRoasterTransactionsCount} Rekam`,
    },
  ];

  const warehouseStages: PipelineStageItem[] = [
    {
      id: 'inventory',
      stepNumber: 1,
      label: 'Penerimaan & Stok',
      subtitle: 'Penyimpanan Hermetik, Suhu & RH Gudang',
      icon: Warehouse,
      badge: myWarehouseLotsCount,
      badgeLabel: `${myWarehouseLotsCount} Lot Gudang`,
    },
    {
      id: 'marketplace',
      stepNumber: 2,
      label: 'Beli Green Bean',
      subtitle: 'Sourcing Biji Hijau dari Mill untuk Grading',
      icon: Store,
      badge: readyToSellProcessedLotsCount,
      badgeLabel: `${readyToSellProcessedLotsCount} Lot Siap`,
    },
    {
      id: 'history',
      stepNumber: 3,
      label: 'Buku Kas & Ledger',
      subtitle: 'Catatan Pembelian & Penjualan Gudang',
      icon: History,
      badge: myWarehouseTransactionsCount,
      badgeLabel: `${myWarehouseTransactionsCount} Rekam`,
    },
  ];

  const cafeStages: PipelineStageItem[] = [
    {
      id: 'inventory',
      stepNumber: 1,
      label: 'Inventaris Biji',
      subtitle: 'Biji Kopi Siap Seduh & Rest Period',
      icon: Package,
      badge: myCafeInventoryCount,
      badgeLabel: `${myCafeInventoryCount} Bean`,
    },
    {
      id: 'calculator',
      stepNumber: 2,
      label: 'Kalkulator HPP',
      subtitle: 'Hitung Dosis, Rasio Espresso & Margin Cangkir',
      icon: Sliders,
      badge: 0,
    },
    {
      id: 'my_products',
      stepNumber: 3,
      label: 'Panel Toko & Menu',
      subtitle: 'Katalog Menu Minuman & Retail Kafe',
      icon: Store,
      badge: myCafeProductsCount,
      badgeLabel: `${myCafeProductsCount} Menu`,
    },
    {
      id: 'create_product',
      stepNumber: 4,
      label: 'Tambah Menu',
      subtitle: 'Formulir Rilis Produk Retail & Kemasan Baru',
      icon: PlusCircle,
      badge: 0,
    },
    {
      id: 'history',
      stepNumber: 5,
      label: 'Buku Kas & Ledger',
      subtitle: 'Riwayat Belanja Bahan & Omzet Kasir',
      icon: History,
      badge: myCafeTransactionsCount,
      badgeLabel: `${myCafeTransactionsCount} Rekam`,
    },
  ];

  const verifierStages: PipelineStageItem[] = [
    {
      id: 'petani',
      stepNumber: 1,
      label: 'Audit Petani EUDR',
      subtitle: 'Geolokasi Patok BPN & Uji Bebas Deforestasi',
      icon: Sprout,
      badge: coffeeFarms.filter((f) => f.verificationStatus === 'verified').length,
      badgeLabel: `${coffeeFarms.filter((f) => f.verificationStatus === 'verified').length} Sah`,
    },
    {
      id: 'pengolah',
      stepNumber: 2,
      label: 'Audit Pengolah (Mill)',
      subtitle: 'Zero Waste, Mutu Fermentasi & Sortasi',
      icon: Award,
      badge: processedLots.filter((p) => p.verificationStatus === 'verified').length,
      badgeLabel: `${processedLots.filter((p) => p.verificationStatus === 'verified').length} Sah`,
    },
    {
      id: 'gudang',
      stepNumber: 3,
      label: 'Audit Gudang & Ekspor',
      subtitle: 'Suhu, RH, Kemasan Hermetik & Grading',
      icon: Warehouse,
      badge: warehouseLots.filter((w) => w.verificationStatus === 'verified').length,
      badgeLabel: `${warehouseLots.filter((w) => w.verificationStatus === 'verified').length} Sah`,
    },
    {
      id: 'roaster',
      stepNumber: 4,
      label: 'Lab Cupping SCA',
      subtitle: 'Cicip Kopi Sangrai, Skor SCA & Stempel Emas',
      icon: Coffee,
      badge: roastedLots.filter((r) => r.verificationStatus === 'pending').length,
      badgeLabel: `${roastedLots.filter((r) => r.verificationStatus === 'pending').length} Menunggu Uji`,
    },
    {
      id: 'cafe',
      stepNumber: 5,
      label: 'Audit Bar & Kafe',
      subtitle: 'Standar Ekstraksi, FIFO & Food Safety',
      icon: CheckCircle2,
      badge: cafeProducts.filter((c) => c.verificationStatus === 'verified').length,
      badgeLabel: `${cafeProducts.filter((c) => c.verificationStatus === 'verified').length} Sah`,
    },
    {
      id: 'history',
      stepNumber: 6,
      label: 'Riwayat Stempel',
      subtitle: 'Daftar Kriptografis Seluruh Stempel Sah',
      icon: History,
      badge: verificationStamps.length,
      badgeLabel: `${verificationStamps.length} Stempel`,
    },
  ];

  const pendingRegistrationsCount = users.filter((u) => u.status === 'pending_approval').length;
  const superAdminStages: PipelineStageItem[] = [
    {
      id: 'approvals',
      stepNumber: 1,
      label: 'Antrean Persetujuan Registrasi Mitra',
      subtitle: 'Tinjau & ACC Pendaftar Stasiun Rantai Pasok',
      icon: Clock,
      badge: pendingRegistrationsCount,
      badgeLabel: pendingRegistrationsCount > 0 ? `${pendingRegistrationsCount} Menunggu ACC` : undefined,
    },
    {
      id: 'directory',
      stepNumber: 2,
      label: 'Direktori Semua Mitra',
      subtitle: 'Kelola Seluruh Pengguna & Hak Akses',
      icon: Users,
      badge: users.length,
      badgeLabel: `${users.length} Akun`,
    },
    {
      id: 'logs',
      stepNumber: 3,
      label: 'Audit Log & Transaksi',
      subtitle: 'Riwayat Persetujuan & Ledger Rantai Pasok',
      icon: ShieldCheck,
      badge: transactions.length,
      badgeLabel: `${transactions.length} Tx`,
    },
  ];

  // Resolve active stages list and current active tab
  let roleStages: PipelineStageItem[] = [];
  let currentActiveTabId = '';

  if (effectiveRole === 'petani') {
    roleStages = farmerStages;
    currentActiveTabId = farmerActiveTab || 'farms';
  } else if (effectiveRole === 'pengolah') {
    roleStages = processorStages;
    currentActiveTabId = processorActiveTab || 'sourcing';
  } else if (effectiveRole === 'roaster') {
    roleStages = roasterStages;
    currentActiveTabId = roasterActiveTab || 'purchasing';
  } else if (effectiveRole === 'gudang') {
    roleStages = warehouseStages;
    currentActiveTabId = warehouseActiveTab || 'inventory';
  } else if (effectiveRole === 'cafe') {
    roleStages = cafeStages;
    currentActiveTabId = cafeActiveTab || 'inventory';
  } else if (effectiveRole === 'verifikator') {
    roleStages = verifierStages;
    currentActiveTabId = verifierActiveTab || 'petani';
  } else if (currentUser.role === 'superadmin') {
    roleStages = superAdminStages;
    currentActiveTabId = 'approvals';
  }

  const currentActiveStage =
    roleStages.find((s) => s.id === currentActiveTabId) || roleStages[0];

  const handleSelectStage = (stageId: string) => {
    if (effectiveRole === 'petani') {
      setFarmerActiveTab(stageId as typeof farmerActiveTab);
    } else if (effectiveRole === 'pengolah') {
      setProcessorActiveTab(stageId as typeof processorActiveTab);
    } else if (effectiveRole === 'roaster') {
      setRoasterActiveTab(stageId as typeof roasterActiveTab);
    } else if (effectiveRole === 'gudang') {
      setWarehouseActiveTab(stageId as typeof warehouseActiveTab);
    } else if (effectiveRole === 'cafe') {
      setCafeActiveTab(stageId as typeof cafeActiveTab);
    } else if (effectiveRole === 'verifikator') {
      setVerifierActiveTab(stageId as typeof verifierActiveTab);
    }
    setModuleDropdownOpen(false);
  };

  const totalPendingNotifications =
    currentUser.role === 'pengolah'
      ? activeProcessingBatchesCount
      : currentUser.role === 'roaster'
      ? pendingApprovalPOCount + pendingIncomingQcCount
      : 0;

  const ActiveStageIcon = currentActiveStage?.icon || FileSpreadsheet;

  return (
    <>
      {/* Odoo / Skripsi ERP Main Top Navbar (Circular Coffee Warm Deep Roast) */}
      <nav className="o_main_navbar sticky top-0 z-40 px-2 sm:px-4 flex items-center justify-between">
        {/* Left Side: App Launcher Icon + Brand + Breadcrumb */}
        <div className="flex items-center h-full gap-2 sm:gap-3 min-w-0">
          {/* App Switcher Matrix 3x3 Button */}
          <button
            onClick={() => setAppSwitcherOpen(true)}
            className="text-white hover:bg-white/10 px-2.5 py-1.5 h-9 flex items-center justify-center transition-all cursor-pointer relative rounded-xl group shrink-0 border border-white/10 hover:border-amber-400/40"
            title="Buka Grid Layanan & Stasiun Kerja"
          >
            <Grid className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
            {totalPendingNotifications > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
              </>
            )}
          </button>

          {/* Brand Logo & Active Role Badge */}
          <div className="flex items-center gap-2 border-r border-white/15 pr-3 mr-0.5 h-6 shrink-0">
            <span className="font-extrabold tracking-tight text-white text-xs sm:text-sm flex items-center gap-1 font-['Poppins']">
              <span className="text-amber-400 font-black">Circular</span>Coffee
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/90 text-amber-200 border border-amber-500/40 font-['Poppins']">
              {currentRoleInfo.label.split(' ')[0]}
            </span>
          </div>

          {/* Clean Stage Breadcrumb Dropdown */}
          {roleStages.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setModuleDropdownOpen(!moduleDropdownOpen)}
                className="group px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer shadow-2xs font-['Poppins']"
                title="Pilih Tahap Alur Kerja"
              >
                <div className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                  <ActiveStageIcon className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1.5 truncate text-left">
                  <span className="text-stone-300 font-medium truncate max-w-[140px] sm:max-w-[200px] lg:max-w-[260px]">
                    {currentActiveStage?.label}
                  </span>
                </div>
                {currentActiveStage?.badge && currentActiveStage.badge > 0 ? (
                  <span className="hidden sm:inline-flex text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-950 shadow-2xs">
                    {currentActiveStage.badge}
                  </span>
                ) : null}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300 transition-transform duration-200 shrink-0 ${
                    moduleDropdownOpen ? 'rotate-180 text-amber-300' : ''
                  }`}
                />
              </button>

              {/* Pipeline Stages Popover Menu */}
              {moduleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setModuleDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-[#18110D] rounded-3xl shadow-2xl border border-amber-900/40 p-3 sm:p-3.5 z-50 text-stone-100 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md font-['Poppins']">
                    {/* Header Banner */}
                    <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 block">
                          Tahapan Operasional &amp; Lembar Kerja
                        </span>
                        <span className="text-xs font-bold text-white">
                          {currentRoleInfo.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                        {roleStages.length} Tahap
                      </span>
                    </div>

                    {/* Stages List */}
                    <div className="space-y-1 mt-2 max-h-[70vh] overflow-y-auto no-scrollbar pr-0.5">
                      {roleStages.map((stage) => {
                        const StageIcon = stage.icon;
                        const isActive = stage.id === currentActiveTabId;
                        return (
                          <button
                            key={stage.id}
                            type="button"
                            onClick={() => handleSelectStage(stage.id)}
                            className={`w-full text-left p-2.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-2.5 group ${
                              isActive
                                ? 'bg-amber-500/20 text-amber-200 border border-amber-400/60 shadow-2xs font-bold'
                                : 'text-stone-300 hover:bg-white/5 hover:text-white border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Step Number Badge */}
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-transform group-hover:scale-105 ${
                                  isActive
                                    ? 'bg-amber-500 text-stone-950 shadow-2xs'
                                    : 'bg-white/10 text-stone-300 border border-white/10'
                                }`}
                              >
                                {stage.stepNumber}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <StageIcon
                                    className={`w-3.5 h-3.5 shrink-0 ${
                                      isActive ? 'text-amber-400' : 'text-stone-400 group-hover:text-amber-300'
                                    }`}
                                  />
                                  <span className="text-xs font-bold truncate">
                                    {stage.label}
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-stone-400 truncate mt-0.5">
                                  {stage.subtitle}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {stage.badgeLabel && (
                                <span
                                  className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold ${
                                    isActive
                                      ? 'bg-amber-400/30 text-amber-200 border border-amber-400/50'
                                      : 'bg-white/5 text-stone-400 border border-white/10'
                                  }`}
                                >
                                  {stage.badgeLabel}
                                </span>
                              )}
                              {isActive && (
                                <Check className="w-4 h-4 text-amber-400 stroke-[3]" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick Footer hint */}
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400 px-2">
                      <span>Pilih lembar kerja untuk dieksekusi</span>
                      <span className="font-mono text-[10px] text-amber-400 font-semibold">
                        ESC to close
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Return to Novizar (if impersonating) + Blanko + Bell + Language + Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 h-full shrink-0">
          {/* Impersonation Return Button for Super Admin Novizar */}
          {Boolean(
            impersonatingFromUser ||
              (typeof window !== 'undefined' && localStorage.getItem('cct_impersonating_superadmin'))
          ) && (
            <button
              type="button"
              onClick={() => returnToSuperAdmin()}
              className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 border border-amber-500 animate-pulse font-['Poppins']"
              title="Kembali ke Panel Kendali Super Admin Novizar"
            >
              <Crown className="w-4 h-4 text-stone-950" />
              <span className="hidden sm:inline">Kembali ke Novizar</span>
            </button>
          )}

          {/* Printable Physical Blank Forms Button (Field Workstations only) */}
          {currentUser.role !== 'superadmin' && (
            <button
              type="button"
              onClick={() => setFormsModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 hover:border-amber-400/40 font-semibold text-xs transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0 font-['Poppins']"
              title="Cetak & Download Blanko Formulir Fisik Lapangan"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Blanko</span>
            </button>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="text-stone-300 hover:text-white hover:bg-white/10 p-2 rounded-xl relative transition-colors cursor-pointer border border-transparent hover:border-white/10"
              title="Notifikasi Aktivitas & Buku Kas"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </button>

            {notificationOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotificationOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-stone-800 font-['Poppins']">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-stone-900">Log Transaksi Rantai Pasok</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Live Ledger
                    </span>
                  </div>

                  <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto my-2">
                    {recentTransactions.map((trx) => (
                      <div key={trx.id} className="py-2.5 px-2 space-y-1 hover:bg-stone-50 rounded-xl transition-colors">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-stone-900 truncate">
                            {trx.fromName} → {trx.toName}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">{trx.date}</span>
                        </div>
                        <p className="text-[11px] text-stone-600 truncate">{trx.itemName}</p>
                        <div className="flex items-center justify-between text-[10px] pt-0.5">
                          <span className="font-mono text-emerald-700 font-bold">
                            Rp {trx.totalAmount.toLocaleString()}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                            {trx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setNotificationOpen(false);
                      setActiveView('transactions');
                    }}
                    className="w-full mt-2 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors text-center block"
                  >
                    Buka Semua Buku Kas Transaksi →
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Language Switcher beside Profile Menu */}
          <LanguageSwitch variant="dark" />
          <ProfileMenu variant="dark" onOpenLedger={() => setActiveView('transactions')} />
        </div></nav>

      {/* Global Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-start justify-center p-4 sm:pt-20 animate-in fade-in duration-150">
          <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden">
            {/* Search Input Box */}
            <div className="p-4 border-b border-stone-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-amber-600 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik varietas kopi, ID lot, atau nama stasiun..."
                className="w-full text-sm font-medium focus:outline-hidden text-stone-900 placeholder-stone-400"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 text-xs font-bold"
              >
                ESC
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="p-4 max-h-80 overflow-y-auto space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
                Pintasan Cepat Operasional
              </span>

              <div
                onClick={() => {
                  setSearchModalOpen(false);
                  setActiveView('dashboard');
                }}
                className="p-3 rounded-xl hover:bg-amber-50/60 border border-transparent hover:border-amber-200 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">
                      Katalog &amp; Inventaris Komoditas
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Buka stok komoditas dan kelola ketersediaan
                    </span>
                  </div>
                </div>
                <span className="text-xs text-amber-700 font-bold">Buka →</span>
              </div>

              <div
                onClick={() => {
                  setSearchModalOpen(false);
                  setActiveView('transactions');
                }}
                className="p-3 rounded-xl hover:bg-amber-50/60 border border-transparent hover:border-amber-200 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">
                      Buku Besar Transaksi
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Audit trail dan log transaksi antar-stakeholder
                    </span>
                  </div>
                </div>
                <span className="text-xs text-amber-700 font-bold">Buka →</span>
              </div>

              <div
                onClick={() => {
                  setSearchModalOpen(false);
                  setActiveView('marketplace');
                }}
                className="p-3 rounded-xl hover:bg-emerald-50/60 border border-transparent hover:border-emerald-200 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">
                      Marketplace Bersama
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Buka etalase perdagangan lintas rantai pasok
                    </span>
                  </div>
                </div>
                <span className="text-xs text-emerald-700 font-bold">Buka →</span>
              </div>
            </div>

            <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500">
              Tekan <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border">ESC</kbd> untuk menutup
            </div>
          </div>
        </div>
      )}

      {/* App Launcher Modal */}
      <AppLauncherModal
        isOpen={appSwitcherOpen}
        onClose={() => setAppSwitcherOpen(false)}
        onSelectRole={(role) => loginAsRole(role)}
        onNavigateView={(view) => setActiveView(view)}
        onSelectModuleTab={(role, moduleTab) => {
          if (moduleTab) {
            if (role === 'roaster') {
              setRoasterActiveTab(moduleTab as typeof roasterActiveTab);
            } else if (role === 'pengolah') {
              setProcessorActiveTab(moduleTab as typeof processorActiveTab);
            } else if (role === 'petani') {
              setFarmerActiveTab(moduleTab as typeof farmerActiveTab);
            } else if (role === 'gudang') {
              setWarehouseActiveTab(moduleTab as typeof warehouseActiveTab);
            } else if (role === 'cafe') {
              setCafeActiveTab(moduleTab as typeof cafeActiveTab);
            }
          }
        }}
      />

      {/* Stakeholder Physical Blank Forms Modal */}
      <StakeholderFormsModal
        isOpen={formsModalOpen}
        onClose={() => setFormsModalOpen(false)}
        initialForm={
          currentUser?.role === 'pengolah'
            ? 'pengolah'
            : currentUser?.role === 'gudang'
            ? 'gudang'
            : currentUser?.role === 'roaster'
            ? 'roastery'
            : 'petani'
        }
      />
    </>
  );
};

