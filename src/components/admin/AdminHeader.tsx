import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { ROLE_DETAILS } from '../../constants/roles';
import {
  Menu,
  ShieldCheck,
  Store,
  Bell,
  Search,
  Wallet,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  title,
  subtitle,
}) => {
  const { currentUser, setActiveView, transactions } = useCoffee();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) return null;

  const currentRoleInfo = ROLE_DETAILS[currentUser.role];
  const recentTransactions = transactions.slice(0, 4);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors shrink-0"
              title="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium truncate">
                <span>Panel Admin</span>
                <span>/</span>
                <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
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
              <span className="hidden md:inline">Node CCT Terverifikasi</span>
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
                              {trx.fromName} $\rightarrow$ {trx.toName}
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
                      Buka Semua Buku Besar Transaksi $\rightarrow$
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
              <span className="hidden sm:inline">Ke Toko E-Commerce</span>
              <span className="sm:hidden">Toko</span>
            </button>
          </div>
        </div>
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
                <span className="text-xs text-amber-700 font-bold">Buka $\rightarrow$</span>
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
                <span className="text-xs text-blue-700 font-bold">Buka $\rightarrow$</span>
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
                <span className="text-xs text-emerald-700 font-bold">Buka $\rightarrow$</span>
              </div>
            </div>

            <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500">
              Tekan <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border">ESC</kbd> untuk menutup
            </div>
          </div>
        </div>
      )}
    </>
  );
};
