import React, { useState, useEffect } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { ROLE_DETAILS } from '../../constants/roles';
import { UserRole } from '../../types/coffee';
import {
  ShieldCheck,
  Store,
  Bell,
  Search,
  Wallet,
  Package,
  Layers,
  Sparkles,
  Grid,
  LayoutDashboard,
  ShoppingCart,
  Warehouse,
  Flame,
  Sliders,
  Award,
  History,
  Recycle,
  ChevronDown,
  Clock,
  Building2,
  Check,
  ExternalLink,
} from 'lucide-react';
import { AppLauncherModal } from '../shared/AppLauncherModal';
import { ProfileMenu } from '../shared/ProfileMenu';
import { LanguageSwitch } from '../shared/LanguageSwitch';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  const {
    currentUser,
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
    processorActiveTab,
    setProcessorActiveTab,
    farmerLots,
    processedLots,
    processingBatches,
    t,
  } = useCoffee();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  // Live Real-Time Clock (WIB - Asia/Jakarta)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeFormatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setTimeStr(timeFormatter.format(now) + ' WIB');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentUser) return null;

  const currentRoleInfo = ROLE_DETAILS[currentUser.role];
  const recentTransactions = transactions.slice(0, 4);

  const pendingApprovalPOCount = purchaseOrders.filter((p) => p.status === 'pending_approval').length;
  const pendingIncomingQcCount = warehouseLots.filter((l) => l.qcStatus === 'pending_qc').length;
  const myRoasterTransactionsCount = transactions.filter(
    (trx) =>
      trx.fromRole === 'roaster' ||
      trx.toRole === 'roaster' ||
      trx.fromName === currentUser.name ||
      trx.toName === currentUser.name
  ).length;

  const roasterTabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: 0 },
    { id: 'purchasing', label: '1. Pengadaan PO', icon: ShoppingCart, badge: pendingApprovalPOCount },
    { id: 'inventory', label: '2. Gudang Green Bean', icon: Warehouse, badge: pendingIncomingQcCount },
    { id: 'work_orders', label: '3. Roasting MRP', icon: Flame, badge: workOrders.filter((w) => w.status !== 'completed').length },
    { id: 'production', label: '4. Profil Sangrai', icon: Sliders, badge: masterProfiles.length },
    { id: 'qc', label: '5. Cupping Lab QC', icon: Award, badge: qcSessions.length },
    { id: 'selling', label: '6. Penjualan B2B', icon: Store, badge: salesOrders.filter((s) => s.status !== 'dispatched').length },
    { id: 'history', label: '7. Audit Ledger', icon: History, badge: myRoasterTransactionsCount },
  ];

  const availableFarmerCherryLots = farmerLots.filter((l) => l.availableWeightKg > 0).length;
  const activeProcessingBatchesCount = processingBatches.filter((b) => b.status === 'in_progress').length;
  const myProcessedLotsCount = processedLots.filter((l) => l.processorId === currentUser.id || true).length;
  const myProcessorTransactionsCount = transactions.filter(
    (trx) =>
      trx.fromName === currentUser.name ||
      trx.toName === currentUser.name ||
      trx.fromRole === 'pengolah' ||
      trx.toRole === 'pengolah'
  ).length;

  const processorTabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: 0 },
    { id: 'sourcing', label: '1. Sourcing Ceri', icon: ShoppingCart, badge: availableFarmerCherryLots },
    { id: 'batches', label: '2. Lembar Kerja Batch', icon: Flame, badge: activeProcessingBatchesCount },
    { id: 'inventory', label: '3. Gudang & Limbah', icon: Recycle, badge: myProcessedLotsCount },
    { id: 'selling', label: '4. Panel Marketplace', icon: Store, badge: processedLots.filter((l) => l.availableWeightKg > 0).length },
    { id: 'history', label: '5. Buku Besar Ledger', icon: History, badge: myProcessorTransactionsCount },
  ];

  const moduleTabs: { id: string; label: string; icon: React.ElementType; badge: number }[] | null =
    currentUser.role === 'roaster'
      ? roasterTabs
      : currentUser.role === 'pengolah'
      ? processorTabs
      : null;
  const activeModuleTab = currentUser.role === 'roaster' ? roasterActiveTab : processorActiveTab;
  const onSelectModuleTab = (id: string) => {
    if (currentUser.role === 'roaster') {
      setRoasterActiveTab(id as typeof roasterActiveTab);
    } else if (currentUser.role === 'pengolah') {
      setProcessorActiveTab(id as typeof processorActiveTab);
    }
  };

  const totalPendingNotifications =
    currentUser.role === 'pengolah'
      ? activeProcessingBatchesCount
      : currentUser.role === 'roaster'
      ? pendingApprovalPOCount + pendingIncomingQcCount
      : 0;

  return (
    <>
      {/* Odoo / Skripsi ERP Main Top Navbar (Circular Coffee Warm Deep Roast) */}
      <nav className="o_main_navbar sticky top-0 z-40">
        <div className="flex items-center h-full gap-2 sm:gap-2.5 min-w-0">
          {/* App Switcher Matrix 3x3 Button */}
          <button
            onClick={() => setAppSwitcherOpen(true)}
            className="text-white hover:bg-white/10 px-2 h-full flex items-center justify-center transition-colors cursor-pointer relative rounded-sm group shrink-0"
            title="App Switcher Matrix (Home)"
          >
            <Grid className="w-5 h-5 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
            {totalPendingNotifications > 0 && (
              <>
                <span className="absolute top-2.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="absolute top-2.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
              </>
            )}
          </button>

          {/* Brand Logo & Active Role Identifier */}
          <div className="flex items-center gap-2 border-r border-white/15 pr-2.5 mr-0.5 h-6 shrink-0">
            <span className="font-extrabold tracking-tight text-white text-xs sm:text-sm flex items-center gap-1">
              <span className="text-amber-400">Circular</span>Trace
            </span>
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-200 border border-amber-500/30">
              {currentRoleInfo.label.split(' ')[0]}
            </span>
          </div>

          {/* Direct Navbar Module Navigation Links */}
          {moduleTabs && (
            <div className="hidden lg:flex items-center h-full overflow-x-auto no-scrollbar">
              {moduleTabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeModuleTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectModuleTab(tab.id)}
                    className={`o_nav_link ${isActive ? 'active' : ''} relative`}
                  >
                    <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-300'}`} />
                    <span>{tab.label}</span>
                    {tab.badge > 0 && (
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-amber-400 text-stone-950' : 'bg-white/20 text-white'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right side System Tray: Live Clock, Search, Notifications, Role Switcher, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 h-full shrink-0">
          {/* Live Real-Time Clock (WIB) */}
          <div
            className="hidden xl:flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md text-amber-200/90 text-[11px] font-mono select-none transition border border-white/10"
            title="Waktu Nyata Sistem (WIB - Asia/Jakarta)"
          >
            <Clock className="w-3 h-3 text-amber-400" />
            <span className="font-bold tracking-wide">{timeStr || '--:--:-- WIB'}</span>
          </div>

          {/* Quick Search Button (⌘K) */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/90 text-xs font-medium border border-white/10 transition-all cursor-pointer"
            title="Pencarian Cepat (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden 2xl:inline text-[11px]">Cari...</span>
            <kbd className="hidden sm:inline text-[9px] font-mono bg-white/15 text-amber-200 px-1 py-0.5 rounded border border-white/15">
              ⌘K
            </kbd>
          </button>

          {/* Station / Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="text-white hover:bg-white/10 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
              title="Ganti Stasiun Kerja / Role"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline truncate max-w-[120px]">{currentUser.name}</span>
              <ChevronDown className="w-3 h-3 text-white/60" />
            </button>

            {roleMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-stone-800">
                  <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold text-stone-400 border-b border-stone-100 flex items-center justify-between">
                    <span>Ganti Stasiun Rantai Pasok</span>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[9px]">Verified</span>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {(['pengolah', 'petani', 'gudang', 'roaster', 'cafe'] as UserRole[]).map((r) => {
                      const isSelected = currentUser.role === r;
                      const roleMeta = ROLE_DETAILS[r];
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            loginAsRole(r);
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-amber-700 text-white font-bold'
                              : 'text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <span>{roleMeta.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="text-white hover:bg-white/10 p-1.5 rounded-md relative transition-colors cursor-pointer"
              title="Notifikasi Aktivitas"
            >
              <Bell className="w-4 h-4 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </button>

            {notificationOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotificationOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-stone-800">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-stone-900">Log Ledger Transaksi</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Live Ledger
                    </span>
                  </div>

                  <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto my-2">
                    {recentTransactions.map((trx) => (
                      <div key={trx.id} className="py-2.5 px-1 space-y-1 hover:bg-stone-50 rounded-lg transition-colors">
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
                    Buka Semua Buku Besar Transaksi →
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Marketplace Storefront Link */}
          <button
            onClick={() => setActiveView('marketplace')}
            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Buka Toko E-Commerce Publik"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Toko Publik</span>
          </button>

          {/* Language Switch */}
          <LanguageSwitch variant="light" />

          {/* Profile Menu */}
          <ProfileMenu variant="light" onOpenLedger={() => setActiveView('transactions')} />
        </div>
      </nav>

      {/* Sub-Header Bar (Mobile & Tablet Module Tabs) */}
      {moduleTabs && (
        <div className="lg:hidden border-b border-stone-200 bg-white shadow-2xs px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {moduleTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeModuleTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectModuleTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                  isActive
                    ? 'bg-amber-700 text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className={`text-[9px] px-1 rounded-full ${
                    isActive ? 'bg-white text-amber-900' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

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
            }
          }
        }}
      />
    </>
  );
};
