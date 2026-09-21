import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { ROLE_DETAILS } from '../../constants/roles';
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
} from 'lucide-react';
import { OdooAppSwitcherModal } from '../odoo/OdooAppSwitcherModal';
import { ProfileMenu } from '../shared/ProfileMenu';

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
    t,
  } = useCoffee();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);

  if (!currentUser) return null;

  const currentRoleInfo = ROLE_DETAILS[currentUser.role];
  const recentTransactions = transactions.slice(0, 4);

  // The roaster role is the only one with real, stateful sub-navigation (roasterActiveTab,
  // held in CoffeeContext) — the other roles render as a single page. So the second header
  // row (module tab strip) only appears for the roaster, replacing what the old sidebar did.
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
    { id: 'dashboard', label: t('sidebar.dashboard.title'), icon: LayoutDashboard, badge: 0 },
    { id: 'purchasing', label: t('sidebar.purchasing.title'), icon: ShoppingCart, badge: pendingApprovalPOCount },
    { id: 'inventory', label: t('sidebar.inventory.title'), icon: Warehouse, badge: pendingIncomingQcCount },
    { id: 'work_orders', label: t('sidebar.workOrders.title'), icon: Flame, badge: workOrders.filter((w) => w.status !== 'completed').length },
    { id: 'production', label: t('sidebar.production.title'), icon: Sliders, badge: masterProfiles.length },
    { id: 'qc', label: t('sidebar.qc.title'), icon: Award, badge: qcSessions.length },
    { id: 'selling', label: t('sidebar.selling.title'), icon: Store, badge: salesOrders.filter((s) => s.status !== 'dispatched').length },
    { id: 'history', label: t('sidebar.history.title'), icon: History, badge: myRoasterTransactionsCount },
  ];

  // Pengolah (Processor) has its own, different pipeline: sourcing cherry from farmers ->
  // processing/waste catalog -> transaction history. Its own tab strip, own state
  // (processorActiveTab), separate from the roaster's.
  const availableFarmerCherryLots = farmerLots.filter((l) => l.availableWeightKg > 0).length;
  const myProcessedLotsCount = processedLots.filter((l) => l.processorId === currentUser.id || true).length;
  const myProcessorTransactionsCount = transactions.filter(
    (trx) =>
      trx.fromName === currentUser.name ||
      trx.toName === currentUser.name ||
      trx.fromRole === 'pengolah' ||
      trx.toRole === 'pengolah'
  ).length;

  const processorTabs = [
    { id: 'dashboard', label: t('sidebar.dashboard.title'), icon: LayoutDashboard, badge: 0 },
    { id: 'sourcing', label: t('sidebar.processorSourcing'), icon: ShoppingCart, badge: availableFarmerCherryLots },
    { id: 'inventory', label: t('sidebar.processorInventory'), icon: Recycle, badge: myProcessedLotsCount },
    { id: 'history', label: t('sidebar.history.title'), icon: History, badge: myProcessorTransactionsCount },
  ];

  // Each role gets its own pipeline tab strip — different steps, same interaction pattern.
  // Only roles with real, stateful sub-navigation (held in CoffeeContext) get a second row;
  // roles that still render as a single page (petani, gudang, cafe) get none for now.
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

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Odoo 19 App Switcher 9-Dots & Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Odoo 19 9-Dots App Switcher Button — now the primary way to move between modules */}
            <button
              onClick={() => setAppSwitcherOpen(true)}
              className="p-2 rounded-xl bg-[#714B67]/10 hover:bg-[#714B67]/20 text-[#714B67] transition-all shrink-0 flex items-center justify-center border border-[#714B67]/20 group"
              title="Buka Odoo 19 App Launcher"
            >
              <Grid className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium truncate">
                <span className="font-bold text-[#714B67] hidden sm:inline">sangrAI ERP 19</span>
                <span className="hidden sm:inline">/</span>
                <span className="font-bold text-[#714B67] bg-[#714B67]/10 px-2 py-0.5 rounded-md border border-[#714B67]/20">
                  {currentRoleInfo.label}
                </span>
                {subtitle && (
                  <>
                    <span className="hidden sm:inline">/</span>
                    <span className="hidden sm:inline text-stone-600 truncate">{subtitle}</span>
                  </>
                )}
              </div>
              <h1 className="text-sm sm:text-base font-black text-stone-900 leading-tight truncate mt-0.5">
                {title || currentUser.organization}
              </h1>
            </div>
          </div>

          {/* Center / Right: Quick search, notifications, verified node & back to store button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Search Button (Cruip ⌘K style) */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-600 text-xs font-medium border border-stone-200 transition-all"
              title="Pencarian Cepat (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <span>Cari lot / transaksi...</span>
              <kbd className="text-[10px] font-mono bg-white text-stone-500 px-1.5 py-0.5 rounded border border-stone-200 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Verified Node Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Node sangrAI Terverifikasi</span>
              <span className="md:hidden">Verified</span>
            </div>

            {/* Notification Popover Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                title="Notifikasi Aktivitas Rantai Pasok"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              </button>

              {notificationOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                          Log Aktivitas Terbaru
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Live Ledger
                      </span>
                    </div>

                    <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto my-2">
                      {recentTransactions.map((trx) => (
                        <div key={trx.id} className="py-2.5 px-1 space-y-1 hover:bg-stone-50/80 rounded-lg transition-colors">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-stone-900 truncate">
                              {trx.fromName} → {trx.toName}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {trx.date}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 truncate">
                            {trx.itemName}
                          </p>
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

            {/* Wallet Balance Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-900 text-amber-400 text-xs font-mono font-bold shadow-xs">
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span>Rp {currentUser.balance.toLocaleString()}</span>
            </div>

            {/* Toko / E-Commerce Shortcut Button */}
            <button
              onClick={() => setActiveView('marketplace')}
              className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-xs transition-all shadow-xs flex items-center gap-1.5"
            >
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">{t('sidebar.storeCta')}</span>
              <span className="sm:hidden">Toko</span>
            </button>

            {/* Profile menu: identity, language, demo mode, ledger shortcut & logout — no sidebar needed */}
            <ProfileMenu
              variant="light"
              onOpenLedger={() => setActiveView('transactions')}
            />
          </div>
        </div>

        {/* Second row: this role's own pipeline module tabs. Each role has its own module
            steps (roaster differs from processor, etc.) driven by its own context state.
            Roles that still render as a single page get no second row here. */}
        {moduleTabs && (
          <div className="border-t border-stone-100 bg-stone-50/70">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
              <div className="flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-thin scrollbar-thumb-stone-300 [-ms-overflow-style:none] [scrollbar-width:thin]">
                {moduleTabs.map((tabItem, idx) => {
                  const TabIcon = tabItem.icon;
                  const isActive = activeModuleTab === tabItem.id;
                  return (
                    <button
                      key={tabItem.id}
                      onClick={() => onSelectModuleTab(tabItem.id)}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-stone-900 text-amber-400 shadow-xs'
                          : 'text-stone-600 hover:bg-white hover:text-stone-900'
                      }`}
                      title={tabItem.label}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                          isActive ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <TabIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{tabItem.label}</span>
                      {tabItem.badge > 0 && (
                        <span
                          className={`ml-0.5 text-[9px] font-black px-1.5 py-0.2 rounded-full shrink-0 ${
                            isActive ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-white'
                          }`}
                        >
                          {tabItem.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal (Cruip Style) */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-start justify-center p-4 sm:pt-20 animate-in fade-in duration-150">
          <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden">
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
                className="p-3 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">
                      Katalog & Inventaris Komoditas
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
                className="p-3 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
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
                <span className="text-xs text-blue-700 font-bold">Buka →</span>
              </div>

              <div
                onClick={() => {
                  setSearchModalOpen(false);
                  setActiveView('marketplace');
                }}
                className="p-3 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 cursor-pointer transition-colors flex items-center justify-between"
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

      {/* Odoo 19 App Switcher Modal (9-Dots Launcher) */}
      <OdooAppSwitcherModal
        isOpen={appSwitcherOpen}
        onClose={() => setAppSwitcherOpen(false)}
        onSelectRole={(role) => loginAsRole(role)}
        onNavigateView={(view) => setActiveView(view)}
      />
    </>
  );
};
