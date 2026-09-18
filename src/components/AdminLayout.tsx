import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { UserRole } from '../types/coffee';
import { ROLE_DETAILS } from '../constants/roles';
import {
  Coffee,
  Store,
  LayoutDashboard,
  Package,
  QrCode,
  Receipt,
  LogOut,
  ChevronRight,
  Menu,
  X,
  UserCheck,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    currentUser,
    loginAsRole,
    logout,
    activeView,
    setActiveView,
    farmerLots,
    processedLots,
    warehouseLots,
    roastedLots,
  } = useCoffee();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!currentUser) return null;

  const currentRoleInfo = ROLE_DETAILS[currentUser.role];

  // Count active stock/items according to user's role
  const getRoleInventoryCount = () => {
    switch (currentUser.role) {
      case 'petani':
        return farmerLots.length;
      case 'pengolah':
        return processedLots.length;
      case 'gudang':
        return warehouseLots.length;
      case 'roaster':
        return roastedLots.length;
      case 'cafe':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col lg:flex-row font-sans antialiased">
      {/* ==================================================================== */}
      {/* 1. SIDEBAR ADMIN (DESKTOP & MOBILE DRAWER) */}
      {/* ==================================================================== */}
      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-stone-900 text-stone-200 flex flex-col justify-between border-r border-stone-800 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header in Sidebar */}
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-stone-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-md">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight block">
                  CCT-Coffee
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Admin Panel • Supply Chain
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Role Indicator Pill */}
          <div className="px-5 pt-4 pb-2">
            <div className="bg-stone-800/90 rounded-2xl p-3 border border-stone-700/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                  Akses Panel Aktif
                </span>
                <span className="text-xs font-black text-amber-400 block mt-0.5">
                  {currentRoleInfo.label}
                </span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>

          {/* CRITICAL BUTTON: KEMBALI KE TOKO / E-COMMERCE */}
          <div className="px-5 py-3">
            <button
              onClick={() => {
                setActiveView('marketplace');
                setMobileSidebarOpen(false);
              }}
              className="w-full group py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all shadow-md hover:shadow-amber-500/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-stone-950" />
                <span>Lihat Toko / E-Commerce</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-900 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Main Navigation Menu */}
          <nav className="px-4 py-2 space-y-1">
            <div className="px-3 pb-1.5 text-[10px] uppercase font-bold text-stone-500 tracking-wider">
              Menu Pengelolaan
            </div>

            <button
              onClick={() => {
                setActiveView('dashboard');
                setMobileSidebarOpen(false);
              }}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeView === 'dashboard'
                  ? 'bg-stone-800 text-white border border-stone-700 shadow-xs'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Dashboard & Operasional</span>
              </div>
              <span className="text-[10px] bg-stone-700/80 text-stone-300 font-mono px-1.5 py-0.5 rounded">
                Aktif
              </span>
            </button>

            <button
              onClick={() => {
                setActiveView('dashboard');
                setMobileSidebarOpen(false);
              }}
              className="w-full py-2.5 px-3.5 rounded-xl text-xs font-bold text-stone-400 hover:text-white hover:bg-stone-800/50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-amber-400" />
                <span>Katalog & Stok Komoditas</span>
              </div>
              <span className="text-[10px] bg-stone-700/80 text-amber-300 font-mono px-1.5 py-0.5 rounded">
                {getRoleInventoryCount()}
              </span>
            </button>

            {(currentUser.role === 'petani' || currentUser.role === 'pengolah') && (
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setMobileSidebarOpen(false);
                }}
                className="w-full py-2.5 px-3.5 rounded-xl text-xs font-bold text-stone-400 hover:text-white hover:bg-stone-800/50 transition-all flex items-center gap-2.5"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Barcode & Stiker Karung</span>
              </button>
            )}

            <button
              onClick={() => {
                setActiveView('transactions');
                setMobileSidebarOpen(false);
              }}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeView === 'transactions'
                  ? 'bg-stone-800 text-white border border-stone-700 shadow-xs'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <Receipt className="w-4 h-4 text-amber-400" />
              <span>Buku Besar Transaksi</span>
            </button>
          </nav>

          {/* Scope Switcher / Demo Role Switcher */}
          <div className="px-5 pt-4 pb-2">
            <div className="border-t border-stone-800/80 pt-3">
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-2 px-1">
                Pindah Panel Akun (Demo Switcher):
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(ROLE_DETAILS) as UserRole[]).map((roleKey) => {
                  const isActive = currentUser.role === roleKey;
                  return (
                    <button
                      key={roleKey}
                      onClick={() => loginAsRole(roleKey)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                          : 'bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{ROLE_DETAILS[roleKey].label.split(' ')[0]}</span>
                      {isActive && <UserCheck className="w-3 h-3 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer: User Card & Logout */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/40">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/60 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-stone-400 block truncate">
                {currentUser.organization}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-0.5">
                <Wallet className="w-3 h-3" />
                <span>Rp {currentUser.balance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full py-2 px-3 rounded-xl bg-stone-800/70 hover:bg-stone-800 text-stone-400 hover:text-red-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* 2. MAIN ADMIN CONTENT CONTAINER */}
      {/* ==================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Top Header */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Left: Mobile hamburger & breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span>Panel Admin</span>
                  <span>/</span>
                  <span className="font-bold text-stone-900">{currentRoleInfo.label}</span>
                </div>
                <h2 className="text-sm sm:text-base font-black text-stone-900 leading-tight">
                  {currentUser.organization}
                </h2>
              </div>
            </div>

            {/* Right: Quick actions & Toko Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Node CCT Terverifikasi</span>
              </div>

              {/* Kembali ke E-Commerce shortcut button */}
              <button
                onClick={() => setActiveView('marketplace')}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all shadow-xs flex items-center gap-1.5"
              >
                <Store className="w-4 h-4" />
                <span className="hidden sm:inline">Ke Toko / E-Commerce</span>
                <span className="sm:hidden">Toko</span>
              </button>
            </div>
          </div>
        </header>

        {/* Admin Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
