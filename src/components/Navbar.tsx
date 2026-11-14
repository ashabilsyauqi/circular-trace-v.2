import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCoffee } from '../context/CoffeeContext';
import { UserRole } from '../types/coffee';
import { ROLE_DETAILS } from '../constants/roles';
import {
  Coffee,
  Store,
  Home,
  ExternalLink,
} from 'lucide-react';
import { RegisterModal } from './RegisterModal';
import { ProfileMenu } from './shared/ProfileMenu';
import { LanguageSwitch } from './shared/LanguageSwitch';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    unifiedMarketplaceItems,
    t,
  } = useCoffee();

  const navigate = useNavigate();
  const location = useLocation();

  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
  const currentRoleInfo = currentUser ? ROLE_DETAILS[currentUser.role] : null;

  return (
    <>
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Main E-Commerce & Landing Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & E-Commerce Title */}
          <Link
            to="/"
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
                Ekosistem Kopi Specialty • Hulu ke Hilir &amp; Traceability
              </p>
            </div>
          </Link>

          {/* Center Navigation Buttons */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 shrink-0">
            {/* 1. Beranda / Landing */}
            <Link
              to="/"
              className={`px-2.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                location.pathname === '/'
                  ? 'bg-stone-900 text-amber-400 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{t('navbar.home')}</span>
            </Link>

            {/* 2. Marketplace */}
            <a
              href="https://marketplace.circulartrace.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer text-stone-700 hover:text-amber-800 hover:bg-stone-100"
              title="Kunjungi Marketplace CircularTrace"
            >
              <Store className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Pasar Kopi (Marketplace)</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitch variant="light" />
            {currentUser ? (
              <ProfileMenu
                variant="light"
                panelLabel={`${t('navbar.adminPanel')} ${currentRoleInfo?.label.split(' ')[0] || ''}`.trim()}
                onOpenPanel={() => navigate('/admin/overview')}
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
                <Link
                  to="/login"
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs whitespace-nowrap"
                >
                  {t('navbar.login')}
                </Link>
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
