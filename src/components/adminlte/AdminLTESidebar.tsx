import React, { useState, useMemo } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import { getScopedTenantData } from '../../utils/tenantScoping';
import {
  Building2,
  Users,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  LayoutDashboard,
  Search,
  Globe,
  Store,
  History,
  Circle,
  ChevronRight,
  ChevronDown,
  ShieldAlert,
  ShieldCheck,
  ClipboardCheck,
  TreePine,
  Package,
  ShoppingCart,
  Award,
  ExternalLink,
  Printer,
  CreditCard,
  Activity,
} from 'lucide-react';
import { ROLE_DETAILS } from '../../constants/roles';

interface AdminLTESidebarProps {
  isCollapsed: boolean;
}

export const AdminLTESidebar: React.FC<AdminLTESidebarProps> = ({ isCollapsed }) => {
  const {
    currentUser,
    users,
    farmerLots,
    coffeeFarms,
    processedLots,
    warehouseLots,
    roastedLots,
    farmerActiveTab,
    setFarmerActiveTab,
    processorActiveTab,
    setProcessorActiveTab,
    openBlankoModal,
  } = useCoffee();
  const location = useLocation();
  const [filterQuery, setFilterQuery] = useState('');
  
  const isPetaniSectionActive =
    location.pathname.startsWith('/admin/petani') ||
    location.pathname.startsWith('/admin/kebun') ||
    location.pathname.startsWith('/admin/panen') ||
    location.pathname.startsWith('/admin/ledger');

  const isGudangSectionActive = location.pathname.startsWith('/admin/gudang');
  const isRoasterSectionActive = location.pathname.startsWith('/admin/roaster');

  const [petaniOpen, setPetaniOpen] = useState(true);
  const [pengolahOpen, setPengolahOpen] = useState<boolean>(true);
  const [gudangOpen, setGudangOpen] = useState<boolean>(true);
  const [roasterOpen, setRoasterOpen] = useState<boolean>(true);
  const [icsOpen, setIcsOpen] = useState<boolean>(true);

  const currentRoleInfo = currentUser ? ROLE_DETAILS[currentUser.role] : null;
  const userRole = currentUser?.role;
  const isAdminKelompok = userRole === 'admin_kelompok_tani';
  const isVerifikator = userRole === 'verifikator';
  const isSuperAdmin = userRole === 'super_admin';

  // Role-based visibility gates: outside Kelompok Tani only see their specific service
  // Scope Kelompok Tani HANYA terdiri dari: 1. Petani, 2. Pengolah, 3. Petugas ICS
  const canSeePusatKendali = isAdminKelompok;
  const canSeePetani = (isAdminKelompok || userRole === 'petani' || userRole === 'ict') && !isVerifikator && !isSuperAdmin;
  const canSeePengolah = (isAdminKelompok || userRole === 'pengolah') && !isVerifikator && !isSuperAdmin;
  const canSeeGudang = userRole === 'gudang';
  const canSeeRoaster = userRole === 'roaster';
  const canSeeCafe = userRole === 'cafe';
  const canSeeIct = (isAdminKelompok || userRole === 'ict') && !isVerifikator && !isSuperAdmin;
  const canSeeVerifikator = isVerifikator;
  const canSeeSeller = (isAdminKelompok || userRole === 'roaster' || userRole === 'gudang' || userRole === 'pengolah' || userRole === 'petani') && !isVerifikator && !isSuperAdmin;

  // User counts per service for Super Admin badges
  const kelompokTaniUsersCount = (users || []).filter((u) => u.role === 'admin_kelompok_tani' || u.role === 'petani' || u.role === 'pengolah' || u.role === 'ict').length;
  const gudangUsersCount = (users || []).filter((u) => u.role === 'gudang').length;
  const roasterUsersCount = (users || []).filter((u) => u.role === 'roaster').length;
  const cafeUsersCount = (users || []).filter((u) => u.role === 'cafe').length;
  const verifikatorUsersCount = (users || []).filter((u) => u.role === 'verifikator').length;

  // Scoped multi-tenant pipeline per Kelompok Tani
  const {
    scopedFarmers,
    scopedFarms,
    scopedLots,
    scopedProcessors,
    scopedProcessedLots,
    scopedIctOfficers,
  } = useMemo(
    () =>
      getScopedTenantData(currentUser, {
        users,
        coffeeFarms,
        farmerLots,
        processedLots,
      }),
    [currentUser, users, coffeeFarms, farmerLots, processedLots]
  );

  // Scoped members count for Kelompok Tani (excludes other tenants)
  const poktanMembersCount = isSuperAdmin
    ? kelompokTaniUsersCount
    : scopedFarmers.length + (scopedProcessors?.length || 0) + (scopedIctOfficers?.length || 0) + 1;

  const getHomePath = () => {
    switch (userRole) {
      case 'super_admin':
        return '/admin/superadmin/dashboard';
      case 'roaster':
        return '/admin/roaster/inventory';
      case 'gudang':
        return '/admin/gudang/inventory';
      case 'pengolah':
        return '/admin/pengolah';
      case 'cafe':
        return '/admin/cafe';
      case 'petani':
        return '/admin/petani';
      case 'ict':
        return '/admin/ict';
      case 'verifikator':
        return '/admin/verifikator';
      default:
        return '/admin/overview';
    }
  };

  const getBrandSubtitle = () => {
    if (isSuperAdmin) {
      return 'Super Admin / Platform Owner';
    }
    if (isAdminKelompok) {
      return 'Admin Kelompok Tani';
    }
    return currentUser?.organization || currentRoleInfo?.label || 'CircularCoffee Platform';
  };

  const getBrandIcon = () => {
    switch (userRole) {
      case 'super_admin':
        return <ShieldAlert className="w-5 h-5 text-stone-950" />;
      case 'roaster':
        return <Flame className="w-5 h-5 text-stone-950" />;
      case 'gudang':
        return <Warehouse className="w-5 h-5 text-stone-950" />;
      case 'pengolah':
        return <Cog className="w-5 h-5 text-stone-950" />;
      case 'cafe':
        return <Coffee className="w-5 h-5 text-stone-950" />;
      case 'petani':
        return <Sprout className="w-5 h-5 text-stone-950" />;
      case 'ict':
      case 'verifikator':
        return <ShieldCheck className="w-5 h-5 text-stone-950" />;
      default:
        return <Building2 className="w-5 h-5 text-stone-950" />;
    }
  };

  const getSectionTitle = () => {
    switch (userRole) {
      case 'super_admin':
        return 'PORTAL SUPER ADMIN SAAS';
      case 'roaster':
        return 'Layanan Roastery';
      case 'gudang':
        return 'Layanan Gudang (QA)';
      case 'pengolah':
        return 'Layanan Pengolah (Mill)';
      case 'cafe':
        return 'Layanan Coffee Shop & Cafe';
      case 'petani':
        return 'Layanan Petani Kopi';
      case 'ict':
        return 'Petugas ICS (Internal Control)';
      case 'verifikator':
        return 'Verifikasi Mutu & Sertifikasi CT';
      case 'admin_kelompok_tani':
        return 'SCOPE KELOMPOK TANI / GAPOKTAN';
      default:
        return 'SCOPE KELOMPOK TANI / GAPOKTAN';
    }
  };

  return (
    <aside
      className={`bg-[#0B0D0E] text-stone-300 border-r border-[#1C1F22] transition-all duration-300 flex flex-col shrink-0 select-none z-40 h-full max-h-screen ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* 1. Brand Logo Header */}
      <Link
        to={getHomePath()}
        className="h-14 bg-[#090A0B] border-b border-[#1C1F22] flex items-center px-4 gap-3 text-white transition-colors hover:text-amber-400 overflow-hidden shrink-0"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
          {getBrandIcon()}
        </div>
        {!isCollapsed && (
          <div className="leading-tight truncate">
            <span className="font-bold text-sm tracking-wide text-white block">
              Circular<span className="text-amber-400">Coffee</span>
            </span>
            <span className="text-[10px] text-stone-400 font-medium block truncate">
              {getBrandSubtitle()}
            </span>
          </div>
        )}
      </Link>

      {/* 2. User Info Panel (Clean Slate Minimalist) */}
      {currentUser && (
        <div className="px-3.5 py-2.5 bg-[#0E1113] border-b border-[#1C1F22] flex items-center gap-2.5 overflow-hidden shrink-0">
          <div className="relative shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-[#282D32]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0E1113] rounded-full" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1 leading-snug">
              <span className="font-semibold text-xs text-stone-100 block truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-stone-400 block truncate">
                {currentRoleInfo?.label || currentUser.organization || 'Admin'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 3. Search Bar */}
      {!isCollapsed && (
        <div className="p-2.5 shrink-0">
          <div className="relative">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Cari Menu..."
              className="w-full bg-[#14171A] text-xs text-stone-200 placeholder-stone-500 rounded-lg px-3 py-1.5 pl-8 border border-[#22272C] focus:outline-none focus:border-stone-500 transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      )}

      {/* 4. Sidebar Navigation Menus */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-4 text-xs font-medium cct-sidebar-scroll">
        {/* SECTION: KHUSUS SUPER ADMIN / PLATFORM OWNER */}
        {isSuperAdmin && (
          <div className="space-y-4">
            {/* Group 1: Platform Owner SaaS */}
            <div>
              {!isCollapsed && (
                <div className="px-3 py-1.5 text-[10px] font-black text-stone-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Platform Super Admin</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                    SaaS Owner
                  </span>
                </div>
              )}

              <div className="space-y-1 mt-1">
                {/* 0. Dashboard Super Admin */}
                <NavLink
                  to="/admin/superadmin/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md shadow-amber-950/30'
                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                    }`
                  }
                  title="Dashboard Utama Super Admin"
                >
                  {({ isActive }) => (
                    <>
                      <LayoutDashboard className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                      {!isCollapsed && <span className="flex-1 truncate">Dashboard Utama</span>}
                      {!isCollapsed && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-stone-950/20 text-stone-950 font-black'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        }`}>
                          Live
                        </span>
                      )}
                    </>
                  )}
                </NavLink>

                {/* 1. Paket Layanan & Harga */}
                <NavLink
                  to="/admin/superadmin/packages"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md shadow-amber-950/30'
                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                    }`
                  }
                  title="Master Paket Layanan & Harga"
                >
                  {({ isActive }) => (
                    <>
                      <Package className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                      {!isCollapsed && <span className="flex-1 truncate">Paket Layanan &amp; Harga</span>}
                      {!isCollapsed && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-stone-950/20 text-stone-950 font-black'
                            : 'bg-stone-800 text-amber-300 border border-amber-500/20'
                        }`}>
                          Komersial
                        </span>
                      )}
                    </>
                  )}
                </NavLink>

                {/* 2. Subscribed Users (Point 3) */}
                <NavLink
                  to="/admin/superadmin/subscriptions"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md shadow-amber-950/30'
                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                    }`
                  }
                  title="Pelanggan Berlangganan (Subscribed Users)"
                >
                  {({ isActive }) => (
                    <>
                      <CreditCard className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                      {!isCollapsed && <span className="flex-1 truncate">Subscribed Users</span>}
                      {!isCollapsed && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-stone-950/20 text-stone-950' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                        }`}>
                          Billing
                        </span>
                      )}
                    </>
                  )}
                </NavLink>

                {/* 3. Master Users */}
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md shadow-amber-950/30'
                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                    }`
                  }
                  title="Master Pengguna Platform"
                >
                  {({ isActive }) => (
                    <>
                      <Users className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                      {!isCollapsed && <span className="flex-1 truncate">Master Users</span>}
                      {!isCollapsed && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-stone-950/20 text-stone-950' : 'bg-emerald-700/80 text-emerald-100'
                        }`}>
                          {users.length}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>

                {/* 4. Buku Transaksi */}
                <NavLink
                  to="/admin/transaksi"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md shadow-amber-950/30'
                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                    }`
                  }
                  title="Buku Transaksi Marketplace"
                >
                  {({ isActive }) => (
                    <>
                      <History className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                      {!isCollapsed && <span className="flex-1 truncate">Buku Transaksi</span>}
                    </>
                  )}
                </NavLink>
              </div>
            </div>

            {/* Group 2: SETTING MASING-MASING SERVICE (USER REQUEST POINT 1 & 2) */}
            <div>
              {!isCollapsed && (
                <div className="px-3 py-1.5 text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center justify-between border-t border-stone-800 pt-3">
                  <span>Settingan Services</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-400 font-mono">
                    5 Pilar
                  </span>
                </div>
              )}

              <div className="space-y-1 mt-1">
                {/* Service 1: Kelompok Tani */}
                <NavLink
                  to="/admin/superadmin/services/admin_kelompok_tani"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md shadow-amber-950/30'
                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                    }`
                  }
                  title="Setting Service Kelompok Tani & Hulu"
                >
                  {({ isActive }) => (
                    <>
                      <Building2 className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                      {!isCollapsed && <span className="flex-1 truncate">Kelompok Tani &amp; Hulu</span>}
                      {!isCollapsed && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-stone-950/20 text-stone-950 font-black' : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        }`}>
                          {kelompokTaniUsersCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>

                {/* Service 2: Gudang & QA */}
                <NavLink
                  to="/admin/superadmin/services/gudang"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md shadow-amber-950/30'
                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                    }`
                  }
                  title="Setting Service Gudang & QA"
                >
                  {({ isActive }) => (
                    <>
                      <Warehouse className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-blue-400'}`} />
                      {!isCollapsed && <span className="flex-1 truncate">Gudang &amp; QA</span>}
                      {!isCollapsed && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-stone-950/20 text-stone-950 font-black' : 'bg-blue-950 text-blue-300 border border-blue-800/60'
                        }`}>
                          {gudangUsersCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>

                {/* Service 3: Roastery */}
                <NavLink
                  to="/admin/superadmin/services/roaster"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md shadow-amber-950/30'
                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                    }`
                  }
                  title="Setting Service Artisan Roastery"
                >
                  {({ isActive }) => (
                    <>
                      <Flame className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-orange-400'}`} />
                      {!isCollapsed && <span className="flex-1 truncate">Artisan Roastery</span>}
                      {!isCollapsed && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-stone-950/20 text-stone-950 font-black' : 'bg-orange-950 text-orange-300 border border-orange-800/60'
                        }`}>
                          {roasterUsersCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>

                {/* Service 4: Cafe & Kedai */}
                <NavLink
                  to="/admin/superadmin/services/cafe"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md shadow-amber-950/30'
                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                    }`
                  }
                  title="Setting Service Cafe & Kedai"
                >
                  {({ isActive }) => (
                    <>
                      <Coffee className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-stone-300'}`} />
                      {!isCollapsed && <span className="flex-1 truncate">Cafe &amp; Kedai</span>}
                      {!isCollapsed && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-stone-950/20 text-stone-950 font-black' : 'bg-stone-800 text-stone-300 border border-stone-700'
                        }`}>
                          {cafeUsersCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>

                {/* Service 5: Verifikator Mutu */}
                <NavLink
                  to="/admin/superadmin/services/verifikator"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md shadow-amber-950/30'
                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                    }`
                  }
                  title="Setting Service Verifikator Mutu"
                >
                  {({ isActive }) => (
                    <>
                      <ShieldCheck className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                      {!isCollapsed && <span className="flex-1 truncate">Verifikator Mutu</span>}
                      {!isCollapsed && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-stone-950/20 text-stone-950 font-black' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                        }`}>
                          {verifikatorUsersCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </div>
            </div>

            {/* Group 3: DATA & METRIK EKOSISTEM (USER REQUEST POINT 4) */}
            <div>
              {!isCollapsed && (
                <div className="px-3 py-1.5 text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center justify-between border-t border-stone-800 pt-3">
                  <span>Data &amp; Telemetri</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono">
                    Impact
                  </span>
                </div>
              )}

              <div className="space-y-1 mt-1">
                {/* 1. Telemetri & Dampak Sirkular */}
                <NavLink
                  to="/admin/superadmin/telemetry"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black shadow-md shadow-cyan-950/30'
                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                    }`
                  }
                  title="Telemetri & Dampak Sirkular"
                >
                  {({ isActive }) => (
                    <>
                      <Activity className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                      {!isCollapsed && <span className="flex-1 truncate">Telemetri &amp; Sirkular</span>}
                    </>
                  )}
                </NavLink>

                {/* 2. Control Tower */}
                <NavLink
                  to="/admin/overview"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md shadow-amber-950/30'
                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                    }`
                  }
                  title="Control Tower Ekosistem"
                >
                  {({ isActive }) => (
                    <>
                      <LayoutDashboard className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                      {!isCollapsed && <span className="flex-1 truncate">Control Tower (Pusat)</span>}
                    </>
                  )}
                </NavLink>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: UTAMA (KHUSUS ADMIN KELOMPOK TANI) */}
        {canSeePusatKendali && (
          <div>
            {!isCollapsed && (
              <div className="px-3 py-1.5 text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                Pusat Kendali
              </div>
            )}

            <div className="space-y-0.5 mt-0.5">
              <NavLink
                to="/admin/overview"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                    isActive
                      ? 'bg-white/[0.08] text-white font-medium border-l-2 border-amber-400 pl-2.5'
                      : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                  }`
                }
                title="Control Tower"
              >
                {({ isActive }) => (
                  <>
                    <LayoutDashboard className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                    {!isCollapsed && <span className="flex-1 truncate">Control Tower</span>}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/admin/forms"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                    isActive
                      ? 'bg-white/[0.08] text-white font-medium border-l-2 border-amber-400 pl-2.5'
                      : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                  }`
                }
                title="Blanko Formulir Fisik Lapangan (A4)"
              >
                {({ isActive }) => (
                  <>
                    <Printer className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                    {!isCollapsed && <span className="flex-1 truncate">Blanko Formulir (A4)</span>}
                  </>
                )}
              </NavLink>
            </div>
          </div>
        )}

        {/* SECTION: LAYANAN OPERASIONAL */}
        <div>
          {!isCollapsed && (
            <div className="px-3 py-1.5 text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
              {getSectionTitle()}
            </div>
          )}

          <div className="space-y-1 mt-0.5">
            {/* MASTER ANGGOTA & AKUN POKTAN (USER REQUEST Q1: A) */}
            {(isAdminKelompok || isSuperAdmin) && (
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors mb-1.5 ${
                    isActive || location.pathname === '/admin/anggota'
                      ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-2xs'
                      : 'text-stone-300 hover:bg-white/[0.04] hover:text-white'
                  }`
                }
                title="Data Master Anggota & Akun Kelompok Tani"
              >
                <Users className="w-4 h-4 shrink-0 text-amber-400" />
                {!isCollapsed && <span className="flex-1 truncate">Master Anggota &amp; Akun</span>}
                {!isCollapsed && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-amber-300 border border-stone-700">
                    {poktanMembersCount}
                  </span>
                )}
              </NavLink>
            )}

            {/* 1. LAYANAN PETANI (COLLAPSIBLE DROPDOWN) */}
            {canSeePetani && (
              <div>
                <div
                  onClick={() => setPetaniOpen(!petaniOpen)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer select-none ${
                    isPetaniSectionActive
                      ? 'bg-white/[0.05] text-stone-100 font-semibold'
                      : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                  }`}
                >
                  <Link
                    to="/admin/petani"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPetaniOpen(true);
                    }}
                    className="flex items-center gap-2.5 flex-1 min-w-0"
                  >
                    <Sprout className={`w-4 h-4 shrink-0 ${isPetaniSectionActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                    {!isCollapsed && (
                      <span className="truncate">
                        {isAdminKelompok ? '1. Layanan Petani' : 'Layanan Petani Kopi'}
                      </span>
                    )}
                  </Link>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPetaniOpen(!petaniOpen);
                        }}
                        className="p-1 text-stone-500 hover:text-stone-200"
                      >
                        {petaniOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-menu Dropdown Items */}
                {petaniOpen && !isCollapsed && (
                  <div className="pl-3.5 pr-1 py-1 space-y-0.5 mt-0.5 border-l border-white/[0.08] ml-3.5">
                    {[
                      {
                        to: '/admin/petani',
                        label: 'Data Master Petani',
                        icon: Users,
                        count: scopedFarmers.length,
                        isActive: location.pathname.startsWith('/admin/petani'),
                      },
                      {
                        to: '/admin/kebun',
                        label: 'Data Master Kebun',
                        icon: TreePine,
                        count: scopedFarms.length,
                        isActive: location.pathname.startsWith('/admin/kebun'),
                      },
                      {
                        to: '/admin/panen',
                        label: 'Data Hasil Panen',
                        icon: Package,
                        count: scopedLots.length,
                        isActive: location.pathname.startsWith('/admin/panen'),
                      },
                      {
                        to: '/admin/ledger',
                        label: 'Buku Kas & Ledger',
                        icon: History,
                        isActive: location.pathname.startsWith('/admin/ledger'),
                      },
                      {
                        to: '/admin/petani/blanko',
                        label: 'Form Blanko Petani (A4)',
                        icon: Printer,
                        isActive: location.pathname === '/admin/petani/blanko',
                      },
                    ].map((sub: any) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                            sub.isActive
                              ? 'bg-white/[0.08] text-white font-medium border-l-2 border-emerald-500 pl-2'
                              : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <SubIcon className={`w-3.5 h-3.5 shrink-0 ${sub.isActive ? 'text-emerald-400' : 'text-stone-500'}`} />
                            <span className="truncate">{sub.label}</span>
                          </span>
                          {sub.count !== undefined && (
                            <span className="text-[11px] font-mono text-stone-500 shrink-0 ml-2">
                              {sub.count}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. LAYANAN PENGOLAH (COLLAPSIBLE DROPDOWN) */}
            {canSeePengolah && (
              <div>
                <div
                  onClick={() => setPengolahOpen(!pengolahOpen)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer select-none ${
                    location.pathname === '/admin/pengolah'
                      ? 'bg-white/[0.05] text-stone-100 font-semibold'
                      : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                  }`}
                >
                  <Link
                    to="/admin/pengolah"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPengolahOpen(true);
                    }}
                    className="flex items-center gap-2.5 flex-1 min-w-0"
                  >
                    <Cog className={`w-4 h-4 shrink-0 ${location.pathname === '/admin/pengolah' ? 'text-amber-400' : 'text-stone-400'}`} />
                    {!isCollapsed && (
                      <span className="truncate">
                        {isAdminKelompok ? '2. Layanan Pengolah' : 'Layanan Pengolah (Wet Mill)'}
                      </span>
                    )}
                  </Link>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPengolahOpen(!pengolahOpen);
                        }}
                        className="p-1 text-stone-500 hover:text-stone-200"
                      >
                        {pengolahOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-menu Dropdown Items */}
                {pengolahOpen && !isCollapsed && (
                  <div className="pl-3.5 pr-1 py-1 space-y-0.5 mt-0.5 border-l border-white/[0.08] ml-3.5">
                    {[
                      { id: 'dashboard' as const, label: 'Dashboard Wet Mill', icon: LayoutDashboard },
                      { id: 'sourcing' as const, label: 'Penerimaan Ceri (Sourcing)', icon: Sprout },
                      { id: 'batches' as const, label: 'Batch Olah (7 Metode)', icon: Cog },
                      { id: 'inventory' as const, label: 'Gudang Green Bean', icon: Warehouse },
                      { id: 'selling' as const, label: 'Rilis Pasar / Penjualan', icon: Store },
                      { id: 'history' as const, label: 'Riwayat Transaksi', icon: History },
                    ].map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive =
                        location.pathname === '/admin/pengolah' && processorActiveTab === sub.id;

                      return (
                        <Link
                          key={sub.id}
                          to="/admin/pengolah"
                          onClick={() => setProcessorActiveTab(sub.id)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                            isSubActive
                              ? 'bg-white/[0.08] text-white font-medium border-l-2 border-amber-400 pl-2'
                              : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-amber-400' : 'text-stone-500'}`} />
                            <span className="truncate">{sub.label}</span>
                          </span>
                        </Link>
                      );
                    })}

                    {/* Blanko Form Pengolah */}
                    <Link
                      to="/admin/pengolah/blanko"
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                        location.pathname === '/admin/pengolah/blanko'
                          ? 'bg-white/[0.08] text-white font-medium border-l-2 border-amber-400 pl-2'
                          : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Printer className="w-3.5 h-3.5 shrink-0 text-stone-500" />
                        <span className="truncate">Form Blanko Pengolah (A4)</span>
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 3. LAYANAN GUDANG (COLLAPSIBLE DROPDOWN) */}
            {canSeeGudang && (
              <div>
                <div
                  onClick={() => setGudangOpen(!gudangOpen)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer select-none ${
                    isGudangSectionActive
                      ? 'bg-white/[0.05] text-stone-100 font-semibold'
                      : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                  }`}
                >
                  <Link
                    to="/admin/gudang/inventory"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGudangOpen(true);
                    }}
                    className="flex items-center gap-2.5 flex-1 min-w-0"
                  >
                    <Warehouse className={`w-4 h-4 shrink-0 ${isGudangSectionActive ? 'text-amber-400' : 'text-stone-400'}`} />
                    {!isCollapsed && (
                      <span className="truncate">
                        {isAdminKelompok ? '3. Layanan Gudang (QA)' : 'Layanan Gudang (QA)'}
                      </span>
                    )}
                  </Link>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] font-mono text-stone-500">
                        {warehouseLots.length}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGudangOpen(!gudangOpen);
                        }}
                        className="p-1 text-stone-500 hover:text-stone-200"
                      >
                        {gudangOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-menu Dropdown Items */}
                {gudangOpen && !isCollapsed && (
                  <div className="pl-3.5 pr-1 py-1 space-y-0.5 mt-0.5 border-l border-white/[0.08] ml-3.5">
                    {[
                      {
                        to: '/admin/gudang/inventory',
                        label: 'Stok & Gudang Sementara',
                        icon: Warehouse,
                        count: warehouseLots.length,
                        isActive: location.pathname === '/admin/gudang' || location.pathname === '/admin/gudang/inventory',
                      },
                      {
                        to: '/admin/gudang/pengadaan',
                        label: 'Pengadaan Green Bean',
                        icon: ShoppingCart,
                        isActive: location.pathname === '/admin/gudang/pengadaan',
                      },
                      {
                        to: '/admin/gudang/sortir',
                        label: 'Lembar Kerja Sortir',
                        icon: ClipboardCheck,
                        count: warehouseLots.filter((l) => l.sortingStatus === 'pending_sorting').length || undefined,
                        isActive: location.pathname.startsWith('/admin/gudang/sortir'),
                      },
                      {
                        to: '/admin/gudang/blanko',
                        label: 'Form Blanko Gudang (A4)',
                        icon: Printer,
                        isActive: location.pathname === '/admin/gudang/blanko',
                      },
                    ].map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                            sub.isActive
                              ? 'bg-white/[0.08] text-white font-medium border-l-2 border-amber-400 pl-2'
                              : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <SubIcon className={`w-3.5 h-3.5 shrink-0 ${sub.isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                            <span className="truncate">{sub.label}</span>
                          </span>
                          {sub.count !== undefined && (
                            <span className="text-[11px] font-mono text-stone-500 shrink-0 ml-2">
                              {sub.count}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 4. LAYANAN ROASTER (ROASTERY ERP - COLLAPSIBLE DROPDOWN) */}
            {canSeeRoaster && (
              <div>
                <div
                  onClick={() => setRoasterOpen(!roasterOpen)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer select-none ${
                    isRoasterSectionActive
                      ? 'bg-white/[0.05] text-stone-100 font-semibold'
                      : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                  }`}
                >
                  <Link
                    to="/admin/roaster/inventory"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRoasterOpen(true);
                    }}
                    className="flex items-center gap-2.5 flex-1 min-w-0"
                  >
                    <Flame className={`w-4 h-4 shrink-0 ${isRoasterSectionActive ? 'text-orange-400' : 'text-stone-400'}`} />
                    {!isCollapsed && (
                      <span className="truncate">
                        {isAdminKelompok ? '4. Layanan Roastery' : 'Layanan Roastery'}
                      </span>
                    )}
                  </Link>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] font-mono text-stone-500">
                        {roastedLots.length}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRoasterOpen(!roasterOpen);
                        }}
                        className="p-1 text-stone-500 hover:text-stone-200"
                      >
                        {roasterOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-menu Dropdown Items */}
                {roasterOpen && !isCollapsed && (
                  <div className="pl-3.5 pr-1 py-1 space-y-0.5 mt-0.5 border-l border-white/[0.08] ml-3.5">
                    {[
                      {
                        to: '/admin/roaster/inventory',
                        label: 'Stok Roasted Beans',
                        icon: Warehouse,
                        count: roastedLots.length,
                        isActive:
                          location.pathname === '/admin/roaster' ||
                          location.pathname === '/admin/roaster/inventory',
                      },
                      {
                        to: '/admin/roaster/production',
                        label: 'Jadwal & Artisan Roasting',
                        icon: Flame,
                        isActive: location.pathname === '/admin/roaster/production',
                      },
                      {
                        to: '/admin/roaster/cupping',
                        label: 'Lembar Kerja Cupping SCA',
                        icon: Award,
                        count: roastedLots.filter((r) => r.roastStatus === 'cupping_pending').length || undefined,
                        isActive: location.pathname.startsWith('/admin/roaster/cupping'),
                      },
                      {
                        to: '/admin/roaster/pengadaan',
                        label: 'Pengadaan Green Beans',
                        icon: ShoppingCart,
                        isActive: location.pathname === '/admin/roaster/pengadaan',
                      },
                      {
                        to: '/admin/seller',
                        label: 'Toko & Monitoring Penjualan',
                        icon: Store,
                        isActive: location.pathname === '/admin/seller',
                      },
                      {
                        to: '/admin/roaster/blanko',
                        label: 'Form Blanko Roastery (A4)',
                        icon: Printer,
                        isActive: location.pathname === '/admin/roaster/blanko',
                      },
                    ].map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                            sub.isActive
                              ? 'bg-white/[0.08] text-white font-medium border-l-2 border-orange-400 pl-2'
                              : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <SubIcon className={`w-3.5 h-3.5 shrink-0 ${sub.isActive ? 'text-orange-400' : 'text-stone-500'}`} />
                            <span className="truncate">{sub.label}</span>
                          </span>
                          {sub.count !== undefined && (
                            <span className="text-[11px] font-mono text-stone-500 shrink-0 ml-2">
                              {sub.count}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 5. LAYANAN COFFEE SHOP / CAFE */}
            {canSeeCafe && (
              <div>
                <NavLink
                  to="/admin/cafe"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'bg-white/[0.08] text-white font-medium border-l-2 border-amber-400 pl-2.5'
                        : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                    }`
                  }
                  title="Coffee Shop & Cafe"
                >
                  {({ isActive }) => (
                    <>
                      <Coffee className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                      {!isCollapsed && (
                        <span className="flex-1 truncate">
                          {isAdminKelompok ? '5. Layanan Coffee Shop' : 'Layanan Coffee Shop & Cafe'}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </div>
            )}

            {/* 3. PETUGAS ICS (INTERNAL CONTROL SYSTEM) */}
            {canSeeIct && (
              <div>
                <div
                  onClick={() => setIcsOpen(!icsOpen)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer select-none ${
                    location.pathname.startsWith('/admin/ict')
                      ? 'bg-white/[0.05] text-stone-100 font-semibold'
                      : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                  }`}
                >
                  <Link
                    to="/admin/ict"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIcsOpen(true);
                    }}
                    className="flex items-center gap-2.5 flex-1 min-w-0"
                  >
                    <ShieldCheck className={`w-4 h-4 shrink-0 ${location.pathname.startsWith('/admin/ict') ? 'text-sky-400' : 'text-stone-400'}`} />
                    {!isCollapsed && (
                      <span className="truncate">
                        {isAdminKelompok ? '3. Petugas ICS' : 'Petugas ICS (Verifikator)'}
                      </span>
                    )}
                  </Link>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIcsOpen(!icsOpen);
                        }}
                        className="p-1 text-stone-500 hover:text-stone-200"
                      >
                        {icsOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-menu Dropdown Items */}
                {icsOpen && !isCollapsed && (
                  <div className="pl-3.5 pr-1 py-1 space-y-0.5 mt-0.5 border-l border-white/[0.08] ml-3.5">
                    {[
                      {
                        to: '/admin/ict',
                        label: 'Dashboard Verifikasi ICS',
                        icon: ShieldCheck,
                        isActive: location.pathname === '/admin/ict',
                      },
                      {
                        to: '/admin/ict/ct-dashboard',
                        label: 'Sertifikasi Kebun (CT)',
                        icon: Award,
                        isActive: location.pathname === '/admin/ict/ct-dashboard',
                      },
                      {
                        to: '/admin/ict/audit',
                        label: 'Lembar Kerja Audit Lapangan',
                        icon: ClipboardCheck,
                        isActive: location.pathname === '/admin/ict/audit',
                      },
                      {
                        to: '/admin/ict/audit-olahan',
                        label: 'Verifikasi Olahan Green Bean',
                        icon: Coffee,
                        count: scopedProcessedLots.filter((p) => !p.ics_verification_status || p.ics_verification_status === 'pending' || p.ics_verification_status === 'unverified').length || undefined,
                        isActive: location.pathname === '/admin/ict/audit-olahan' || location.pathname === '/admin/ict/olahan',
                      },
                      {
                        to: '/admin/ict/blanko',
                        label: 'Form Blanko ICS (A4)',
                        icon: Printer,
                        isActive: location.pathname === '/admin/ict/blanko',
                      },
                    ].map((sub: any) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                            sub.isActive
                              ? 'bg-white/[0.08] text-white font-medium border-l-2 border-sky-400 pl-2'
                              : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <SubIcon className={`w-3.5 h-3.5 shrink-0 ${sub.isActive ? 'text-sky-400' : 'text-stone-500'}`} />
                            <span className="truncate">{sub.label}</span>
                          </span>
                          {sub.count !== undefined && (
                            <span className="text-[11px] font-mono text-stone-500 shrink-0 ml-2">
                              {sub.count}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 7. PORTAL LEMBAR KERJA VERIFIKATOR & AUDITOR MUTU */}
            {canSeeVerifikator && (
              <div className="space-y-0.5">
                <NavLink
                  to="/admin/verifikator"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'bg-white/[0.08] text-white font-medium border-l-2 border-emerald-500 pl-2.5'
                        : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                    }`
                  }
                  title="Lembar Kerja Verifikasi Mutu (Tab Petani, Pengolah, Gudang, Roaster, Cafe, Riwayat Stempel)"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  {!isCollapsed && <span className="flex-1 truncate">Lembar Kerja Verifikasi</span>}
                </NavLink>

                <NavLink
                  to="/admin/ict/ct-dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ml-2 ${
                      isActive
                        ? 'bg-white/[0.08] text-white font-medium border-l-2 border-amber-400 pl-2'
                        : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                    }`
                  }
                  title="Sertifikasi Kebun (CircularTrace Index Engine: CT-4CI / CCI / SDI / Fairtrade)"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {!isCollapsed && <span className="flex-1 truncate">Sertifikasi Kebun (CT)</span>}
                </NavLink>

                <NavLink
                  to="/admin/ict/audit"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ml-2 ${
                      isActive
                        ? 'bg-white/[0.08] text-white font-medium border-l-2 border-sky-400 pl-2'
                        : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                    }`
                  }
                  title="Lembar Kerja Audit ICS"
                >
                  <ClipboardCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  {!isCollapsed && <span className="flex-1 truncate">Lembar Kerja ICS</span>}
                </NavLink>

                <NavLink
                  to="/admin/ict/blanko"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ml-2 ${
                      isActive
                        ? 'bg-white/[0.08] text-white font-medium border-l-2 border-amber-400 pl-2'
                        : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                    }`
                  }
                  title="Formulir Blanko Fisik Audit Lapangan (A4)"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Printer className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    {!isCollapsed && <span className="truncate">Form Blanko ICS (A4)</span>}
                  </span>
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* SECTION: EKSTERNAL / PUBLIK */}
        <div>
          {!isCollapsed && (
            <div className="px-3 py-1 text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
              Portal Terhubung
            </div>
          )}

          <div className="space-y-1 mt-1">
            <a
              href="https://marketplace.circulartrace.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-stone-400 hover:bg-white/[0.04] hover:text-stone-200 transition-colors"
              title="Katalog Marketplace"
            >
              <Store className="w-4 h-4 shrink-0 text-amber-400" />
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span>Marketplace Kopi</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </div>
              )}
            </a>

            {canSeeSeller && (
              <NavLink
                to="/admin/seller"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                    isActive
                      ? 'bg-white/[0.08] text-white font-medium border-l-2 border-amber-400 pl-2.5'
                      : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                  }`
                }
                title="Admin Seller Panel & Monitoring Penjualan"
              >
                <Store className="w-4 h-4 text-amber-400 shrink-0" />
                {!isCollapsed && <span className="flex-1 truncate">Seller Panel &amp; Penjualan</span>}
              </NavLink>
            )}

            <NavLink
              to="/admin/transaksi"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                  isActive
                    ? 'bg-white/[0.08] text-white font-medium border-l-2 border-emerald-500 pl-2.5'
                    : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                }`
              }
              title="Buku Transaksi & Rekapitulasi Penjualan Marketplace"
            >
              {({ isActive }) => (
                <>
                  <History className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                  {!isCollapsed && <span className="flex-1 truncate">Buku Transaksi</span>}
                </>
              )}
            </NavLink>

            {/* Blanko Formulir Fisik Lapangan A4 */}
            <NavLink
              to="/admin/forms"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                  isActive
                    ? 'bg-white/[0.08] text-white font-medium border-l-2 border-amber-400 pl-2.5'
                    : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                }`
              }
              title="Cetak & Download Blanko Formulir Fisik Lapangan (Petani, Pengolah, Gudang, Roastery)"
            >
              {({ isActive }) => (
                <>
                  <Printer className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1 truncate">
                      <span>Blanko Form (A4)</span>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          </div>
        </div>
      </div>

      {/* 5. Bottom Brand Footnote */}
      {!isCollapsed && (
        <div className="p-3 border-t border-[#1C1F22] text-[10px] text-stone-500 text-center font-medium shrink-0 bg-[#090A0B]">
          CircularCoffee OS • Enterprise Coffee Platform
        </div>
      )}
    </aside>
  );
};
