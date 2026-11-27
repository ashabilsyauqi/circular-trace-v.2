import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCoffee } from '../context/CoffeeContext';
import { ROLE_DETAILS } from '../constants/roles';
import {
  Coffee,
  Store,
  ExternalLink,
  Layers,
  ChevronDown,
  Building2,
  Warehouse,
  Flame,
  Sprout,
  CreditCard,
  Menu,
  X,
  LogIn,
} from 'lucide-react';
import { ProfileMenu } from './shared/ProfileMenu';
import { LanguageSwitch } from './shared/LanguageSwitch';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    t,
  } = useCoffee();

  const navigate = useNavigate();
  const location = useLocation();
  const currentRoleInfo = currentUser ? ROLE_DETAILS[currentUser.role] : null;

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const registerDropdownRef = useRef<HTMLDivElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const servicesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close all mobile & desktop dropdowns on route or hash navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    setIsRegisterOpen(false);
  }, [location.pathname, location.hash]);

  const handleServicesMouseEnter = () => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
      servicesTimeoutRef.current = null;
    }
    setIsServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
    }
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    };
  }, []);

  // Track scroll position for adaptive transparent-to-solid navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        registerDropdownRef.current &&
        !registerDropdownRef.current.contains(event.target as Node)
      ) {
        setIsRegisterOpen(false);
      }
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavSectionClick = (sectionId: string) => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
      servicesTimeoutRef.current = null;
    }
    setIsServicesOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${sectionId}`);
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleServicesClick = () => {
    handleNavSectionClick('services');
  };

  const isHome = location.pathname === '/' && !location.hash;
  const isDarkNav = isHome && !isScrolled;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isDarkNav
          ? 'bg-[#0a160f]/95 backdrop-blur-md border-b border-stone-800/80 shadow-md'
          : 'bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs'
      }`}
    >
      {/* Main E-Commerce & Landing Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand Identity (Clicking logo returns to top of Beranda) */}
          <Link
            to="/"
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group min-w-0 shrink-0"
            title="CircularCoffee - Beranda"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-stone-900 group-hover:bg-amber-900 flex items-center justify-center text-amber-400 shadow-sm shrink-0 transition-colors border border-stone-800/60">
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`font-black tracking-tight text-base sm:text-lg truncate transition-colors ${
                    isDarkNav ? 'text-white' : 'text-stone-900'
                  }`}
                >
                  CircularCoffee
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 shadow-2xs shrink-0">
                  Circular Trace
                </span>
              </div>
              <p
                className={`text-[11px] hidden md:block leading-tight truncate transition-colors ${
                  isDarkNav ? 'text-stone-300' : 'text-stone-500'
                }`}
              >
                Ekosistem Kopi Specialty • Hulu ke Hilir &amp; Traceability
              </p>
            </div>
          </Link>

          {/* Center Navigation Buttons: Clean, Flat Modern Minimalism (Hidden on mobile, shown on lg+) */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-2">
            {/* 1. Layanan Dropdown with direct links to #sec-kebun, #sec-gudang, #sec-roastery, #sec-cafe */}
            <div
              className="relative"
              ref={servicesDropdownRef}
              onMouseEnter={handleServicesMouseEnter}
              onMouseLeave={handleServicesMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleNavSectionClick('services')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isDarkNav
                    ? 'text-stone-200 hover:text-white hover:bg-white/10'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
                title="Lihat 4 Solusi Ekosistem Layanan"
              >
                <Layers className={`w-4 h-4 ${isDarkNav ? 'text-amber-400' : 'text-amber-600'}`} />
                <span>Layanan</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isDarkNav ? 'text-stone-300' : 'text-stone-500'
                  } ${isServicesOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isServicesOpen && (
                <div className="absolute left-0 top-full pt-1.5 w-76 sm:w-84 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-white rounded-2xl border border-[#E6DFD5] shadow-2xl p-2 text-left">
                  <div className="px-3 py-1.5 border-b border-stone-100 mb-1 flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                      Cakupan Rantai Pasok Kopi
                    </p>
                    <a
                      href="#services"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavSectionClick('services');
                      }}
                      className="text-[10px] font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
                    >
                      Semua Layanan
                    </a>
                  </div>

                  <div className="space-y-1">
                    {/* 1. Hulu / Kelompok Tani */}
                    <a
                      href="#sec-kebun"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavSectionClick('sec-kebun');
                      }}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-emerald-50 text-stone-800 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Sprout className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-900">
                            1. Hulu &amp; Kelompok Tani
                          </span>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-sm bg-emerald-100 text-emerald-800">
                            Petik Merah
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 leading-tight">
                          Audit Lahan EUDR, Uji Brix Ceri &amp; Pascapanen
                        </div>
                      </div>
                    </a>

                    {/* 2. Gudang & QA Logistik */}
                    <a
                      href="#sec-gudang"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavSectionClick('sec-gudang');
                      }}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-sky-50 text-stone-800 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                        <Warehouse className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900 group-hover:text-sky-900">
                            2. Gudang &amp; QA Logistik
                          </span>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-sm bg-sky-100 text-sky-800">
                            Green Bean
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 leading-tight">
                          Grading Mutu Fisik SCA, Kadar Air &amp; QR Karung
                        </div>
                      </div>
                    </a>

                    {/* 3. Artisan Roastery */}
                    <a
                      href="#sec-roastery"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavSectionClick('sec-roastery');
                      }}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-amber-50 text-stone-800 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900 group-hover:text-amber-900">
                            3. Artisan Roastery
                          </span>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-sm bg-amber-100 text-amber-800">
                            Sangrai
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 leading-tight">
                          Log Profil Sangrai, Cupping Lab &amp; QR Kemasan
                        </div>
                      </div>
                    </a>

                    {/* 4. Coffee Shop & Konsumen */}
                    <a
                      href="#sec-cafe"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavSectionClick('sec-cafe');
                      }}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-rose-50 text-stone-800 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                        <Coffee className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900 group-hover:text-rose-900">
                            4. Coffee Shop &amp; Meja
                          </span>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-sm bg-rose-100 text-rose-800">
                            Cangkir Seduh
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 leading-tight">
                          Paspor QR Meja Kafe, Resep Barista &amp; Fair Share
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* Dropdown footer with overview anchor */}
                  <div className="pt-1.5 mt-1 border-t border-stone-100">
                    <a
                      href="#services"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavSectionClick('services');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-900 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      <span>Lihat Ikhtisar 4 Layanan Terintegrasi</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

            {/* 2. Marketplace Pasar Kopi */}
            <a
              href="https://marketplace.circulartrace.id/"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isDarkNav
                  ? 'text-stone-200 hover:text-white hover:bg-white/10'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
              title="Kunjungi Marketplace CircularTrace"
            >
              <Store className={`w-4 h-4 ${isDarkNav ? 'text-amber-400' : 'text-amber-600'}`} />
              <span className="hidden md:inline">Pasar Kopi</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>

            {/* 3. Pricing / Paket & Biaya */}
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                handleNavSectionClick('pricing');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isDarkNav
                  ? 'text-stone-200 hover:text-white hover:bg-white/10'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
              title="Lihat Paket Langganan & Biaya Layanan"
            >
              <CreditCard className={`w-4 h-4 ${isDarkNav ? 'text-amber-400' : 'text-amber-600'}`} />
              <span>Pricing</span>
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitch variant={isDarkNav ? 'dark' : 'light'} />
            {currentUser ? (
              <ProfileMenu
                variant={isDarkNav ? 'dark' : 'light'}
                panelLabel={`${t('navbar.adminPanel')} ${currentRoleInfo?.label.split(' ')[0] || ''}`.trim()}
                onOpenPanel={() => navigate('/admin/overview')}
                onOpenRegister={handleServicesClick}
              />
            ) : (
              <div className="flex items-center gap-2">
                {/* Dropdown 4 Pilihan Pendaftaran */}
                <div className="relative" ref={registerDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(!isRegisterOpen)}
                    className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isDarkNav
                        ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                    }`}
                    title="Pilih Layanan Pendaftaran Akun"
                  >
                    <span>Daftar Akun</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isDarkNav ? 'text-stone-300' : 'text-stone-500'
                      } ${isRegisterOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isRegisterOpen && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-[#E6DFD5] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-stone-100 mb-1">
                        <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                          Pilih Layanan Ekosistem
                        </p>
                      </div>
                      <div className="space-y-1">
                        {/* 1. Kelompok Tani */}
                        <Link
                          to="/register/kelompok-tani"
                          onClick={() => setIsRegisterOpen(false)}
                          className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-emerald-50 text-stone-800 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-900">
                              Kelompok Tani / Gapoktan
                            </div>
                            <div className="text-[10px] text-stone-500 leading-tight">
                              Bundle Petani, Pengolah &amp; Verifikator
                            </div>
                          </div>
                        </Link>

                        {/* 2. Gudang & QA */}
                        <Link
                          to="/register/gudang"
                          onClick={() => setIsRegisterOpen(false)}
                          className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-blue-50 text-stone-800 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Warehouse className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900 group-hover:text-blue-900">
                              Gudang &amp; QA
                            </div>
                            <div className="text-[10px] text-stone-500 leading-tight">
                              Logistik &amp; Grading Green Bean SCA
                            </div>
                          </div>
                        </Link>

                        {/* 3. Artisan Roastery */}
                        <Link
                          to="/register/roaster"
                          onClick={() => setIsRegisterOpen(false)}
                          className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-orange-50 text-stone-800 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <Flame className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900 group-hover:text-orange-900">
                              Artisan Roastery
                            </div>
                            <div className="text-[10px] text-stone-500 leading-tight">
                              Profil Sangrai, Lab Cupping &amp; Batch Lot
                            </div>
                          </div>
                        </Link>

                        {/* 4. Coffee Shop & Kedai */}
                        <Link
                          to="/register/coffee-shop"
                          onClick={() => setIsRegisterOpen(false)}
                          className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-amber-50 text-stone-800 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-600 group-hover:text-stone-950 transition-colors">
                            <Coffee className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">
                              Coffee Shop &amp; Barista
                            </div>
                            <div className="text-[10px] text-stone-500 leading-tight">
                              Sourcing B2B &amp; QR Meja Farm-to-Cup
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/login"
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-xs whitespace-nowrap transition-all"
                >
                  {t('navbar.login')}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle Button (Visible on <lg) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                isDarkNav
                  ? 'border-white/20 text-stone-100 hover:bg-white/10'
                  : 'border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
              aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E6DFD5]/80 bg-white/98 dark:bg-stone-950/98 backdrop-blur-xl px-4 py-4 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          <div className="space-y-3">
            {/* Cakupan Layanan Header */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 px-1 mb-1.5">
                Cakupan 4 Layanan Terintegrasi
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <a
                  href="#sec-kebun"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    handleNavSectionClick('sec-kebun');
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-stone-800 dark:text-stone-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-white">1. Hulu &amp; Kelompok Tani</div>
                    <div className="text-[10px] text-stone-500">Ceri Brix, Petani &amp; EUDR</div>
                  </div>
                </a>

                <a
                  href="#sec-gudang"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    handleNavSectionClick('sec-gudang');
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/30 text-stone-800 dark:text-stone-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <Warehouse className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-white">2. Gudang &amp; QA Logistik</div>
                    <div className="text-[10px] text-stone-500">Kadar Air &amp; Defect Green Bean</div>
                  </div>
                </a>

                <a
                  href="#sec-roastery"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    handleNavSectionClick('sec-roastery');
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 text-stone-800 dark:text-stone-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-white">3. Roastery &amp; Processing</div>
                    <div className="text-[10px] text-stone-500">Roast Profile &amp; Cupping Q-Grader</div>
                  </div>
                </a>

                <a
                  href="#sec-cafe"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    handleNavSectionClick('sec-cafe');
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-stone-800 dark:text-stone-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-white">4. Coffee Shop &amp; Kedai</div>
                    <div className="text-[10px] text-stone-500">QR Cup Paspor Digital Meja</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Main Nav Links: Pasar Kopi & Pricing */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 gap-2">
              <a
                href="https://marketplace.circulartrace.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs font-bold text-stone-800 dark:text-stone-200"
              >
                <Store className="w-4 h-4 text-amber-600" />
                <span>Pasar Kopi</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>

              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  handleNavSectionClick('pricing');
                }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs font-bold text-stone-800 dark:text-stone-200"
              >
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Pricing</span>
              </a>
            </div>

            {/* Auth / Register Actions */}
            {!currentUser && (
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 px-1">
                  Daftar Sebagai Pengguna Baru
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-left">
                  <Link
                    to="/register/kelompok-tani"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5"
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Kelompok Tani</span>
                  </Link>
                  <Link
                    to="/register/gudang"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5"
                  >
                    <Warehouse className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">Gudang &amp; QA</span>
                  </Link>
                  <Link
                    to="/register/roastery"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">Roastery</span>
                  </Link>
                  <Link
                    to="/register/coffee-shop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5"
                  >
                    <Coffee className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span className="truncate">Coffee Shop</span>
                  </Link>
                </div>

                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full mt-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Akun Anda</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
