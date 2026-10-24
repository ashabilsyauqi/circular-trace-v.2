import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import {
  Crown,
  ShieldCheck,
  Clock,
  Users,
  Search,
  Store,
  Bell,
  Grid,
  ChevronDown,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileText,
  Activity,
  Layers,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { AppLauncherModal } from '../shared/AppLauncherModal';
import { ProfileMenu } from '../shared/ProfileMenu';

export const SuperAdminNavbar: React.FC = () => {
  const {
    currentUser,
    users,
    transactions,
    setActiveView,
    superAdminActiveTab,
    setSuperAdminActiveTab,
    loginAsRole,
  } = useCoffee();

  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pendingUsersCount = users.filter((u) => u.status === 'pending_approval').length;
  const activePartnersCount = users.filter((u) => !u.status || u.status === 'active').length;

  return (
    <>
      {/* Micro Top Accent Gradient Line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 z-50 sticky top-0" />

      {/* Main Executive Super Admin Header */}
      <header className="sticky top-[2.5px] z-40 w-full bg-stone-950/95 backdrop-blur-md border-b border-amber-500/25 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 h-14 flex items-center justify-between gap-3">
          
          {/* ------------------------------------------------------------- */}
          {/* LEFT: Super Admin Identity & Platform Root Brand               */}
          {/* ------------------------------------------------------------- */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* App Matrix Button (Cross-Chain Access) */}
            <button
              onClick={() => setAppSwitcherOpen(true)}
              className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-amber-400 hover:text-amber-300 border border-stone-800 transition-all cursor-pointer relative group"
              title="Akses Seluruh Modul Rantai Pasok (App Switcher)"
            >
              <Grid className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              {pendingUsersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse border-2 border-stone-950" />
              )}
            </button>

            {/* Brand Logo & Root Crown */}
            <div className="flex items-center gap-2 border-r border-stone-800 pr-3 mr-0.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
                <Crown className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-black text-sm tracking-tight text-white">
                    sangr<span className="text-amber-400">AI</span>
                  </span>
                  <span className="text-[9px] font-mono font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    SUPER ADMIN
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-medium">
                  Owner Governance Panel
                </span>
              </div>
            </div>

            {/* Platform Owner Session Pill */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Owner: <strong className="text-white">Novizar</strong></span>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* CENTER: Direct Executive Governance Navigation Tabs            */}
          {/* ------------------------------------------------------------- */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-900/90 p-1 rounded-2xl border border-stone-800/90 shadow-inner">
            {/* Tab 1: Antrean ACC */}
            <button
              type="button"
              onClick={() => setSuperAdminActiveTab('approvals')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                superAdminActiveTab === 'approvals'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Antrean ACC</span>
              {pendingUsersCount > 0 ? (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse ${
                    superAdminActiveTab === 'approvals'
                      ? 'bg-stone-950 text-amber-400'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {pendingUsersCount}
                </span>
              ) : (
                <span className="text-[10px] opacity-60">0</span>
              )}
            </button>

            {/* Tab 2: Direktori Semua Mitra */}
            <button
              type="button"
              onClick={() => setSuperAdminActiveTab('directory')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                superAdminActiveTab === 'directory'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Direktori Mitra</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-800 text-stone-300 font-bold">
                {users.length}
              </span>
            </button>

            {/* Tab 3: Audit Log & Transaksi */}
            <button
              type="button"
              onClick={() => setSuperAdminActiveTab('logs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                superAdminActiveTab === 'logs'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audit Log &amp; Tx</span>
            </button>
          </nav>

          {/* ------------------------------------------------------------- */}
          {/* RIGHT: Executive Utilities, Marketplace & Profile Menu        */}
          {/* ------------------------------------------------------------- */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Storefront Link (Toko Publik) */}
            <button
              type="button"
              onClick={() => setActiveView('marketplace')}
              className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-200 border border-stone-800 hover:border-amber-400/40 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Buka Halaman Marketplace Publik"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Toko Publik</span>
            </button>

            {/* Quick Search Shortcut */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
              title="Cari Cepat Mitra atau Lot Kopi (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <kbd className="hidden sm:inline text-[9px] font-mono bg-stone-800 text-amber-200 px-1 py-0.5 rounded border border-stone-700">
                ⌘K
              </kbd>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800 transition-colors cursor-pointer relative"
                title="Log Audit & Notifikasi Sistem"
              >
                <Bell className="w-4 h-4 text-stone-300" />
                {pendingUsersCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              {/* Notification Popover */}
              {notificationOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-stone-950 rounded-2xl shadow-2xl border border-stone-800 p-4 z-50 text-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        Notifikasi Super Admin
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                        {pendingUsersCount} Pending ACC
                      </span>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {pendingUsersCount > 0 ? (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
                          <p className="font-bold text-amber-300 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Pendaftaran Mitra Perlu Ditinjau
                          </p>
                          <p className="text-[11px] text-stone-300">
                            Terdapat {pendingUsersCount} permohonan pendaftaran mitra baru yang menunggu persetujuan (ACC) dari Anda.
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 text-center">
                          Tidak ada antrean pendaftaran baru saat ini.
                        </div>
                      )}

                      {transactions.slice(0, 3).map((tx) => (
                        <div
                          key={tx.id}
                          className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800/80 space-y-0.5 text-stone-300"
                        >
                          <p className="font-semibold text-white truncate">{tx.itemName}</p>
                          <p className="text-[10px] text-stone-500">
                            {tx.fromName} &rarr; {tx.toName} &bull; {tx.date}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Menu (Novizar Owner) */}
            <ProfileMenu variant="dark" />
          </div>

        </div>
      </header>

      {/* App Switcher Matrix Modal */}
      <AppLauncherModal
        isOpen={appSwitcherOpen}
        onClose={() => setAppSwitcherOpen(false)}
        onSelectRole={(role) => loginAsRole(role)}
        onNavigateView={(view) => setActiveView(view)}
      />

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-stone-950/80 backdrop-blur-xs">
          <div className="bg-stone-950 rounded-2xl max-w-lg w-full border border-stone-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
              <Search className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Cari mitra, email, lot, atau stasiun..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-stone-500 focus:outline-hidden"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-stone-400 hover:text-white text-xs font-bold px-2 py-1 rounded bg-stone-900 cursor-pointer"
              >
                ESC
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 text-xs">
              {users
                .filter((u) => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    u.name.toLowerCase().includes(q) ||
                    (u.email || '').toLowerCase().includes(q) ||
                    u.organization.toLowerCase().includes(q)
                  );
                })
                .slice(0, 5)
                .map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      setSearchModalOpen(false);
                      setSuperAdminActiveTab('directory');
                    }}
                    className="p-3 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-[11px] text-stone-400">{u.organization} &bull; {u.email}</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      {u.role}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
