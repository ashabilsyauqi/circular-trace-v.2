import React from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { UserRole } from '../types/coffee';
import { ROLE_DETAILS } from '../constants/roles';
import {
  Coffee,
  LogOut,
  RotateCcw,
  UserCheck,
  LayoutDashboard,
  History,
  Store,
  ChevronRight,
  Home,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { RegisterModal } from './RegisterModal';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    loginAsRole,
    logout,
    resetToDefaultData,
    activeView,
    setActiveView,
    unifiedMarketplaceItems,
  } = useCoffee();

  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
  const currentRoleInfo = currentUser ? ROLE_DETAILS[currentUser.role] : null;

  return (
    <>
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Demo Bar to easily switch between roles */}
      <div className="bg-[#2B1810] text-stone-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Peralihan Akun Demo (Scope Switcher):
            </span>
            <span className="text-stone-400 hidden sm:inline">
              Pilih peran untuk membuka akses panel admin:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(Object.keys(ROLE_DETAILS) as UserRole[]).map((roleKey) => {
              const isActive = currentUser?.role === roleKey;
              return (
                <button
                  key={roleKey}
                  onClick={() => loginAsRole(roleKey)}
                  className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-xs scale-105'
                      : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white'
                  }`}
                  title={ROLE_DETAILS[roleKey].description}
                >
                  {ROLE_DETAILS[roleKey].label.split(' ')[0]}
                  {isActive && <UserCheck className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}

            <button
              onClick={() => {
                if (window.confirm('Reset semua data kembali ke default simulasi?')) {
                  resetToDefaultData();
                }
              }}
              className="ml-2 text-stone-400 hover:text-red-400 p-1 rounded transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
              title="Reset data demo ke awal"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main E-Commerce & Landing Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo & E-Commerce Title */}
          <div
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-900 group-hover:bg-amber-900 flex items-center justify-center text-amber-400 shadow-sm shrink-0 transition-colors">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-lg text-stone-900">
                  CCT-Coffee
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 shadow-2xs">
                  Circular Trace
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden md:block leading-tight">
                Ekosistem Kopi Specialty • Hulu ke Hilir & Traceability
              </p>
            </div>
          </div>

          {/* Center Navigation Buttons */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200">
            {/* 1. Beranda / Landing */}
            <button
              onClick={() => setActiveView('landing')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'landing'
                  ? 'bg-stone-900 text-amber-400 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </button>

            {/* 2. Marketplace B2B */}
            <button
              onClick={() => setActiveView('marketplace')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'marketplace'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Katalog B2B</span>
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

            {/* 3. Log Transaksi */}
            <button
              onClick={() => setActiveView('transactions')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all hidden sm:flex items-center gap-1.5 cursor-pointer ${
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-300 transition-all cursor-pointer"
              title="Daftar Akun Baru"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-700" />
              <span>Daftar Akun</span>
            </button>
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
                  onClick={() => loginAsRole('petani')}
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
    <RegisterModal
      isOpen={isRegisterOpen}
      onClose={() => setIsRegisterOpen(false)}
    />
    </>
  );
};
