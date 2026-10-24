import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import {
  Crown,
  LayoutDashboard,
  Clock,
  Users,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  Award,
  ShieldCheck,
  Store,
  Home,
  LogOut,
  Search,
  Bell,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  Activity,
  Layers,
} from 'lucide-react';
import { UserRole } from '../../types/coffee';
import { ROLE_DETAILS } from '../../constants/roles';

interface SuperAdminDashboardLayoutProps {
  children: React.ReactNode;
}

export const SuperAdminDashboardLayout: React.FC<SuperAdminDashboardLayoutProps> = ({ children }) => {
  const {
    currentUser,
    users,
    superAdminActiveTab,
    setSuperAdminActiveTab,
    superAdminRoleFilter,
    setSuperAdminRoleFilter,
    logout,
    setActiveView,
    navigate,
  } = useCoffee();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Collapsible Services dropdown state
  const [servicesOpen, setServicesOpen] = useState(() => {
    const saved = localStorage.getItem('cct_superadmin_services_open');
    if (saved !== null) return saved === 'true';
    return true; // default open
  });

  const toggleServices = () => {
    setServicesOpen((prev) => {
      const next = !prev;
      localStorage.setItem('cct_superadmin_services_open', String(next));
      return next;
    });
  };

  const isAnyServiceActive =
    superAdminActiveTab === 'directory' &&
    ['petani', 'pengolah', 'gudang', 'roaster', 'cafe', 'verifikator'].includes(superAdminRoleFilter);

  // Collapsible Master Data Users dropdown state
  const [usersMenuOpen, setUsersMenuOpen] = useState(() => {
    const saved = localStorage.getItem('cct_superadmin_users_menu_open');
    if (saved !== null) return saved === 'true';
    return true; // default open
  });

  const toggleUsersMenu = () => {
    setUsersMenuOpen((prev) => {
      const next = !prev;
      localStorage.setItem('cct_superadmin_users_menu_open', String(next));
      return next;
    });
  };

  const isAnyUsersMenuActive =
    superAdminActiveTab === 'approvals' ||
    (superAdminActiveTab === 'directory' && superAdminRoleFilter === 'all');

  const pendingUsersCount = users.filter((u) => u.status === 'pending_approval').length;
  const activeUsersCount = users.filter((u) => !u.status || u.status === 'active').length;

  const navigateToRole = (role: string) => {
    navigate({
      view: 'dashboard',
      subRoute: 'directory',
      service: role,
      userId: null,
    });
    setMobileSidebarOpen(false);
  };

  const navTabClass = (tab: typeof superAdminActiveTab) => {
    const isActive = superAdminActiveTab === tab;
    return `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
      isActive
        ? 'bg-amber-500 text-stone-950 shadow-md font-black'
        : 'text-stone-300 hover:text-white hover:bg-stone-900/80'
    }`;
  };

  const navRoleClass = (role: string) => {
    const isCurrent = superAdminActiveTab === 'directory' && superAdminRoleFilter === role;
    return `w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
      isCurrent
        ? 'bg-stone-850 text-amber-400 font-bold border border-amber-500/30'
        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'
    }`;
  };

  const currentTabLabel = () => {
    switch (superAdminActiveTab) {
      case 'dashboard':
        return 'Dashboard & Ikhtisar Utama';
      case 'approvals':
        return 'Antrean Persetujuan Registrasi (ACC)';
      case 'directory':
        return superAdminRoleFilter !== 'all'
          ? `Direktori Mitra • ${ROLE_DETAILS[superAdminRoleFilter as UserRole]?.label || superAdminRoleFilter}`
          : 'Direktori Semua Mitra Rantai Pasok';
      case 'logs':
        return 'Log Audit & Transaksi Terverifikasi';
      default:
        return 'Pusat Kendali Super Admin';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-stone-900 flex font-sans antialiased overflow-x-hidden">
      {/* ----------------------------------------------------------------- */}
      {/* 1. LEFT SIDEBAR (Standard Admin Panel Navigation)                 */}
      {/* ----------------------------------------------------------------- */}
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-stone-950/70 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-stone-950 text-stone-200 flex flex-col border-r border-stone-850 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Platform Identity */}
        <div className="p-4 border-b border-stone-850/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-stone-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0">
              <Crown className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-white">
                  sangr<span className="text-amber-400">AI</span>
                </span>
                <span className="text-[9px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  OWNER
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-medium">Control Center • Root</p>
            </div>
          </div>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {/* Group 1: Ikhtisar Utama */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Menu Utama
            </p>
            <button
              onClick={() => {
                navigate({ view: 'dashboard', subRoute: 'dashboard', userId: null });
                setMobileSidebarOpen(false);
              }}
              className={navTabClass('dashboard')}
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard (Ikhtisar)</span>
              </span>
            </button>
          </div>

          {/* Group 2: Master Data Users Dropdown Collapse */}
          <div className="space-y-1">
            {/* Dropdown Header Trigger */}
            <button
              type="button"
              onClick={toggleUsersMenu}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-900/60 transition-all cursor-pointer group"
              title="Klik untuk buka/tutup menu Master Data Users"
            >
              <span className="flex items-center gap-2">
                <Users
                  className={`w-3.5 h-3.5 transition-colors ${
                    isAnyUsersMenuActive ? 'text-amber-400' : 'text-stone-500 group-hover:text-amber-400'
                  }`}
                />
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 group-hover:text-white">
                  Master Data Users
                </span>
                <span className="text-[9px] text-stone-500 font-mono bg-stone-900 px-1.5 py-0.5 rounded-md border border-stone-850">
                  {users.length}
                </span>
              </span>

              <span className="flex items-center gap-1.5">
                {pendingUsersCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black animate-pulse">
                    {pendingUsersCount}
                  </span>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-stone-500 group-hover:text-stone-300 transition-transform duration-200 ${
                    usersMenuOpen ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </span>
            </button>

            {/* Collapsible Children List */}
            {usersMenuOpen && (
              <div className="border-l-2 border-stone-850 ml-3.5 pl-2 space-y-0.5 transition-all">
                {/* Antrean ACC */}
                <button
                  onClick={() => {
                    navigate({ view: 'dashboard', subRoute: 'approvals', userId: null });
                    setMobileSidebarOpen(false);
                  }}
                  className={navTabClass('approvals')}
                >
                  <span className="flex items-center gap-2.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Antrean ACC</span>
                  </span>
                  {pendingUsersCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse shadow-xs">
                      {pendingUsersCount}
                    </span>
                  )}
                </button>

                {/* Direktori Semua Mitra */}
                <button
                  onClick={() => {
                    navigate({ view: 'dashboard', subRoute: 'directory', service: 'all', userId: null });
                    setMobileSidebarOpen(false);
                  }}
                  className={navTabClass('directory')}
                >
                  <span className="flex items-center gap-2.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Direktori Mitra</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-stone-400 bg-stone-900 px-2 py-0.5 rounded-full border border-stone-850">
                    {users.length}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Group 3: Services (Stasiun Operasional) Dropdown Collapse */}
          <div className="space-y-1">
            {/* Dropdown Header Trigger */}
            <button
              type="button"
              onClick={toggleServices}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-900/60 transition-all cursor-pointer group"
              title="Klik untuk buka/tutup menu Services"
            >
              <span className="flex items-center gap-2">
                <Layers
                  className={`w-3.5 h-3.5 transition-colors ${
                    isAnyServiceActive ? 'text-amber-400' : 'text-stone-500 group-hover:text-amber-400'
                  }`}
                />
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 group-hover:text-white">
                  Services
                </span>
                <span className="text-[9px] text-stone-500 font-mono bg-stone-900 px-1.5 py-0.5 rounded-md border border-stone-850">
                  6
                </span>
              </span>

              <span className="flex items-center gap-1.5">
                <ChevronDown
                  className={`w-3.5 h-3.5 text-stone-500 group-hover:text-stone-300 transition-transform duration-200 ${
                    servicesOpen ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </span>
            </button>

            {/* Collapsible Children List */}
            {servicesOpen && (
              <div className="border-l-2 border-stone-850 ml-3.5 pl-2 space-y-0.5 transition-all">
                <button onClick={() => navigateToRole('petani')} className={navRoleClass('petani')}>
                  <Sprout className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Petani & Kebun</span>
                </button>

                <button onClick={() => navigateToRole('pengolah')} className={navRoleClass('pengolah')}>
                  <Cog className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Pabrik & Pengolah</span>
                </button>

                <button onClick={() => navigateToRole('gudang')} className={navRoleClass('gudang')}>
                  <Warehouse className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Gudang & Silo</span>
                </button>

                <button onClick={() => navigateToRole('roaster')} className={navRoleClass('roaster')}>
                  <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>Roastery & Batch</span>
                </button>

                <button onClick={() => navigateToRole('cafe')} className={navRoleClass('cafe')}>
                  <Coffee className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                  <span>Cafe & Kedai</span>
                </button>

                <button onClick={() => navigateToRole('verifikator')} className={navRoleClass('verifikator')}>
                  <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Auditor & Verifikator</span>
                </button>
              </div>
            )}
          </div>

          {/* Group 4: Sistem & Navigasi Publik */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Sistem & Navigasi
            </p>

            <button
              onClick={() => {
                navigate({ view: 'dashboard', subRoute: 'logs', userId: null });
                setMobileSidebarOpen(false);
              }}
              className={navTabClass('logs')}
            >
              <span className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Log Audit & Tx</span>
              </span>
            </button>

            <button
              onClick={() => {
                navigate({ view: 'marketplace', userId: null });
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-stone-900/60 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-amber-400" />
                <span>Katalog Publik</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            </button>

            <button
              onClick={() => {
                navigate({ view: 'landing', userId: null });
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-stone-900/60 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-stone-400" />
                <span>Halaman Depan</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            </button>
          </div>
        </div>

        {/* Bottom Sidebar: Owner Profile Card & Logout */}
        <div className="p-3 border-t border-stone-850/80 bg-stone-925/60">
          <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'Novizar'}
                className="w-8 h-8 rounded-lg object-cover border border-amber-500/40 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate flex items-center gap-1">
                  <span>{currentUser?.name || 'Novizar'}</span>
                </p>
                <p className="text-[10px] text-amber-400/90 font-mono truncate">Platform Owner</p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors cursor-pointer"
              title="Keluar dari sesi Novizar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ----------------------------------------------------------------- */}
      {/* 2. RIGHT MAIN WORKSPACE (Topbar + Content Area)                   */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Modern Clean Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shadow-2xs">
          {/* Mobile hamburger & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>Admin Panel</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                <span className="font-semibold text-stone-700 truncate">{currentTabLabel()}</span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-stone-900 truncate">
                {superAdminActiveTab === 'dashboard' && 'Ringkasan Ekosistem & Statistik'}
                {superAdminActiveTab === 'approvals' && 'Antrean Persetujuan Registrasi Mitra'}
                {superAdminActiveTab === 'directory' && 'Direktori & Master Data Mitra'}
                {superAdminActiveTab === 'logs' && 'Log Audit Transaksi & Tata Kelola'}
              </h1>
            </div>
          </div>

          {/* Right Action Icons & Badges */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Quick Notification Pill for Pending ACC */}
            <button
              onClick={() => navigate({ view: 'dashboard', subRoute: 'approvals', userId: null })}
              className={`p-2 rounded-xl border transition-all cursor-pointer relative ${
                pendingUsersCount > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
              title={`${pendingUsersCount} pendaftar baru perlu ACC`}
            >
              <Bell className="w-4 h-4" />
              {pendingUsersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center animate-bounce">
                  {pendingUsersCount}
                </span>
              )}
            </button>

            {/* Public Storefront Shortcut */}
            <button
              onClick={() => navigate({ view: 'marketplace', userId: null })}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Buka Toko</span>
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};