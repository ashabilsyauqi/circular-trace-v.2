import React from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { UserRole } from '../types/coffee';
import { ROLE_DETAILS } from '../constants/roles';
import {
  Coffee,
  RotateCcw,
  UserCheck,
  Store,
  Home,
} from 'lucide-react';
import { RegisterModal } from './RegisterModal';
import { ProfileMenu } from './shared/ProfileMenu';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    loginAsRole,
    resetToDefaultData,
    activeView,
    setActiveView,
    unifiedMarketplaceItems,
    demoModeEnabled,
    t,
  } = useCoffee();

  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
  const currentRoleInfo = currentUser ? ROLE_DETAILS[currentUser.role] : null;

  return (
    <>
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Demo Bar to easily switch between roles — hidden when Demo Mode is off */}
      {demoModeEnabled && (
      <div className="bg-[#2B1810] text-stone-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {t('navbar.demoSwitcher')}
            </span>
            <span className="text-stone-400 hidden sm:inline">
              {t('navbar.demoSwitcherHint')}
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
              {t('navbar.reset')}
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Main E-Commerce & Landing Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & E-Commerce Title */}
          <div
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group min-w-0 shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-stone-900 group-hover:bg-amber-900 flex items-center justify-center text-amber-400 shadow-sm shrink-0 transition-colors">
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-base sm:text-lg text-stone-900 truncate">
                  sangrAI
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 shadow-2xs shrink-0">
                  Circular Trace
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden md:block leading-tight truncate">
                Ekosistem Kopi Specialty • Hulu ke Hilir & Traceability
              </p>
            </div>
          </div>

          {/* Center Navigation Buttons — Log Transaksi lives inside the admin panel sidebar now */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 shrink-0">
            {/* 1. Beranda / Landing */}
            <button
              onClick={() => setActiveView('landing')}
              className={`px-2.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'landing'
                  ? 'bg-stone-900 text-amber-400 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{t('navbar.home')}</span>
            </button>

            {/* 2. Marketplace */}
            <button
              onClick={() => setActiveView('marketplace')}
              className={`px-2.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'marketplace'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">{t('navbar.catalog')}</span>
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
          </div>

          {/* Right Action: everything (register, panel entry, language, demo mode, logout) lives in one Profile dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            {currentUser ? (
              <ProfileMenu
                variant="light"
                panelLabel={`${t('navbar.adminPanel')} ${currentRoleInfo?.label.split(' ')[0] || ''}`.trim()}
                onOpenPanel={() => setActiveView('dashboard')}
                onOpenRegister={() => setIsRegisterOpen(true)}
              />
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-300 transition-all cursor-pointer"
                  title="Daftar Akun Baru"
                >
                  <span>{t('navbar.register')}</span>
                </button>
                <button
                  onClick={() => loginAsRole('petani')}
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs whitespace-nowrap"
                >
                  {t('navbar.login')}
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
