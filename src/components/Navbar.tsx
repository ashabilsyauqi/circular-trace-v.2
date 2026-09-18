import React from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { ROLE_DETAILS } from '../constants/roles';
import {
  Coffee,
  LogOut,
  LayoutDashboard,
  History,
  Store,
  ChevronRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    logout,
    activeView,
    setActiveView,
    unifiedMarketplaceItems,
  } = useCoffee();

  const currentRoleInfo = currentUser ? ROLE_DETAILS[currentUser.role] : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Main E-Commerce Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo & E-Commerce Title */}
          <div
            onClick={() => setActiveView('marketplace')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-900 flex items-center justify-center text-amber-200 shadow-sm shrink-0">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-lg text-stone-900">
                  CCT-Coffee
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 shadow-2xs">
                  E-Commerce Store
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden md:block leading-tight">
                Pasar Kopi Terpadu • Ceri Petani $\rightarrow$ Green Bean Mill $\rightarrow$ Silo $\rightarrow$ Roaster
              </p>
            </div>
          </div>

          {/* Center Navigation Buttons */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200">
            <button
              onClick={() => setActiveView('marketplace')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'marketplace'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Katalog E-Commerce</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  activeView === 'marketplace'
                    ? 'bg-stone-950 text-white'
                    : 'bg-amber-200/80 text-amber-950'
                }`}
              >
                {unifiedMarketplaceItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveView('transactions')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all hidden sm:flex items-center gap-1.5 ${
                activeView === 'transactions'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <History className="w-4 h-4 text-stone-600" />
              <span>Log Transaksi</span>
            </button>
          </div>

          {/* Right Action: Admin Panel Entry Button & User Profile */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <>
                {/* HIGH PRIORITY BUTTON: BUKA PANEL ADMIN */}
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="group py-2 px-3.5 sm:px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 hover:text-amber-300 font-bold text-xs transition-all shadow-md flex items-center gap-2 border border-stone-700"
                  title="Masuk ke Panel Admin Operasional"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Panel Admin {currentRoleInfo?.label.split(' ')[0]}</span>
                  <span className="sm:hidden">Admin</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Profile Pill */}
                <div className="hidden lg:flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-stone-300 shadow-xs"
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold text-stone-900 leading-none block">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-stone-500 truncate block max-w-[120px]">
                      {currentUser.organization}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-stone-100 rounded-lg transition-colors"
                  title="Keluar Akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs"
                >
                  Masuk Panel Admin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
