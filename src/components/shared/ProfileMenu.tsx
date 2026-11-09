import React, { useState, useEffect } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import {
  ChevronDown,
  MapPin,
  Phone,
  Wallet,
  Clock,
  LogOut,
  Receipt,
  User,
  ShieldCheck,
  Mail,
  Store,
  Crown,
  ExternalLink,
  Sprout,
  Flame,
  Coffee,
  Warehouse,
  Sliders,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { ROLE_DETAILS } from '../../constants/roles';
import { getMarketplaceBaseUrl, getSystemBaseUrl } from '../../utils/baseUrl';

interface ProfileMenuProps {
  variant?: 'dark' | 'light';
  onOpenLedger?: () => void;
}

const roleIconMap: Record<string, React.ElementType> = {
  petani: Sprout,
  pengolah: Flame,
  gudang: Warehouse,
  roaster: Coffee,
  cafe: Store,
  verifikator: ShieldCheck,
  superadmin: Crown,
  buyer: User,
};

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ variant = 'light', onOpenLedger }) => {
  const {
    currentUser,
    loginAsRole,
    logout,
    setActiveView,
    navigate,
    language,
    getUserSubscription,
  } = useCoffee();

  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) return null;

  const isDark = variant === 'dark';
  const isErpMode = isDark || currentUser.role !== 'buyer';
  const roleInfo = ROLE_DETAILS[currentUser.role] || { label: 'Mitra Sistem', color: 'emerald' };
  const RoleIcon = roleIconMap[currentUser.role] || User;
  const currentSub = getUserSubscription ? getUserSubscription(currentUser.id) : null;
  const marketplaceUrl = getMarketplaceBaseUrl();
  const systemUrl = getSystemBaseUrl();

  const handleSignOut = () => {
    setOpen(false);
    logout();
    if (isErpMode) {
      window.location.href = '/';
    } else {
      setActiveView('marketplace');
    }
  };

  const getSellerPanelPath = () => {
    switch (currentUser.role) {
      case 'petani':
        return { view: 'dashboard' as const, service: 'petani', subRoute: 'catalog' };
      case 'pengolah':
        return { view: 'dashboard' as const, service: 'pengolah', subRoute: 'selling' };
      case 'gudang':
        return { view: 'dashboard' as const, service: 'gudang', subRoute: 'marketplace' };
      case 'roaster':
        return { view: 'dashboard' as const, service: 'roaster', subRoute: 'selling' };
      case 'cafe':
        return { view: 'dashboard' as const, service: 'cafe', subRoute: 'my_products' };
      case 'verifikator':
      case 'superadmin':
      default:
        return { view: 'dashboard' as const, service: 'petani', subRoute: 'catalog' };
    }
  };

  const getLedgerPath = () => {
    switch (currentUser.role) {
      case 'petani':
        return { view: 'dashboard' as const, service: 'petani', subRoute: 'history' };
      case 'pengolah':
        return { view: 'dashboard' as const, service: 'pengolah', subRoute: 'history' };
      case 'gudang':
        return { view: 'dashboard' as const, service: 'gudang', subRoute: 'history' };
      case 'roaster':
        return { view: 'dashboard' as const, service: 'roaster', subRoute: 'history' };
      case 'cafe':
        return { view: 'dashboard' as const, service: 'cafe', subRoute: 'history' };
      case 'verifikator':
        return { view: 'dashboard' as const, service: 'verifikator', subRoute: 'history' };
      case 'superadmin':
      default:
        return { view: 'dashboard' as const, service: 'superadmin', subRoute: 'logs' };
    }
  };

  return (
    <div className="relative shrink-0 font-['Poppins']">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer select-none shrink-0 ${
          isDark
            ? open
              ? 'bg-white/15 border-amber-400 text-white shadow-xs'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-stone-200'
            : open
            ? 'bg-amber-50 border-amber-500 text-stone-900 shadow-xs'
            : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
        }`}
        aria-label="Menu Profil Akun"
        aria-expanded={open}
      >
        {/* Avatar with Role Badge */}
        <div className="relative shrink-0">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className={`w-7 h-7 rounded-lg object-cover border ${
              isErpMode ? 'border-amber-400/60' : 'border-[#00AA5B]/40'
            }`}
          />
          <div
            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] border border-white text-stone-950 font-black ${
              isErpMode ? 'bg-amber-400' : 'bg-[#00AA5B] text-white'
            }`}
            title={roleInfo.label}
          >
            {isErpMode ? '✓' : '✓'}
          </div>
        </div>

        {/* Name and Organization Preview */}
        <div className="text-left hidden md:block max-w-[130px] lg:max-w-[160px] truncate leading-tight">
          <p
            className={`text-xs font-bold truncate leading-none ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}
          >
            {currentUser.name}
          </p>
          <p
            className={`text-[10px] truncate leading-none mt-0.5 font-semibold ${
              isDark ? 'text-amber-300' : 'text-stone-500'
            }`}
          >
            {currentUser.organization || roleInfo.label.split(' ')[0]}
          </p>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
            open
              ? isDark
                ? 'rotate-180 text-amber-400'
                : 'rotate-180 text-[#00AA5B]'
              : 'text-stone-400'
          }`}
        />
      </button>

      {/* Popover Dropdown Card */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[95vw] rounded-3xl bg-white border border-stone-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-stone-800"
            role="menu"
          >
            {/* ============================================================== */}
            {/* 1. HEADER CARD: ERP STASIUN KERJA / BUYER IDENTITY            */}
            {/* ============================================================== */}
            {isErpMode ? (
              // ERP STASIUN PROFILE HEADER (Deep Roasted Espresso with Warm Amber)
              <div className="p-4 bg-gradient-to-br from-[#18110D] via-[#241710] to-[#140C08] text-white border-b border-amber-950/60">
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400/60 shadow-md"
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-amber-500 text-stone-950 border-2 border-[#18110D] shadow-xs"
                      title={roleInfo.label}
                    >
                      <RoleIcon className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4
                        className="font-bold text-sm text-white truncate max-w-[190px]"
                        title={currentUser.name}
                      >
                        {currentUser.name}
                      </h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-amber-200 border border-amber-400/40 bg-amber-950/80 whitespace-nowrap">
                        <CheckCircle2 className="w-2.5 h-2.5 text-amber-400" />
                        {roleInfo.label.split(' ')[0]}
                      </span>
                    </div>

                    {currentUser.organization && (
                      <p className="text-[11px] text-amber-300 font-semibold truncate mt-0.5">
                        {currentUser.organization}
                      </p>
                    )}

                    <div className="flex items-center gap-1 text-[11px] text-stone-300 mt-1 truncate">
                      <Mail className="w-3 h-3 shrink-0 text-amber-400" />
                      <span className="truncate">{currentUser.email}</span>
                    </div>

                    {currentUser.location && (
                      <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 shrink-0 text-amber-400" />
                        <span className="truncate">{currentUser.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stasiun Kerja & Lisensi Status Card (Bukan Saldo E-Wallet!) */}
                <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                      <Crown className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-stone-400 block whitespace-nowrap font-medium">
                        Status Stasiun Mandiri
                      </span>
                      <span className="text-xs font-black text-amber-300">
                        {currentSub ? `${currentSub.tierName} (${currentSub.daysRemaining} Hari)` : 'Lisensi Aktif'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setActiveView('subscription');
                    }}
                    className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-[11px] font-black transition-all cursor-pointer shadow-xs"
                  >
                    Langganan
                  </button>
                </div>
              </div>
            ) : (
              // MARKETPLACE BUYER PROFILE HEADER
              <div className="p-4 bg-gradient-to-br from-[#0F2016] via-[#153424] to-[#0A1810] text-white">
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-400/60 shadow-xs"
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] border-2 border-[#0F2016] bg-[#00AA5B] text-white font-bold"
                      title="Akun Pembeli"
                    >
                      ✓
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-sm text-white truncate max-w-[200px]" title={currentUser.name}>
                        {currentUser.name}
                      </h4>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-emerald-300 border border-emerald-400/40 bg-emerald-950/60 whitespace-nowrap">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                        Buyer
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-stone-300 mt-1 truncate">
                      <Mail className="w-3 h-3 shrink-0 text-emerald-400" />
                      <span className="truncate">{currentUser.email}</span>
                    </div>

                    {currentUser.location && (
                      <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 shrink-0 text-emerald-400" />
                        <span className="truncate">{currentUser.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Saldo Belanja E-Wallet Widget (Hanya di Marketplace) */}
                <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                      <Wallet className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-stone-400 block whitespace-nowrap">
                        Saldo Belanja E-Wallet
                      </span>
                      <span className="text-xs font-black text-emerald-300">
                        Rp {(currentUser.balance || 25000000).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setActiveView('buyer');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#00AA5B] hover:bg-[#03AC0E] text-white text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Top Up
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* 2. MENU NAVIGATION LINKS                                      */}
            {/* ============================================================== */}
            <div className="p-2 space-y-1">
              {currentUser.role === 'verifikator' ? (
                <>
                  {/* Verifikator Pihak Ketiga Menus */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate({ view: 'dashboard', service: 'verifikator', subRoute: 'petani' });
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl hover:bg-purple-50 text-purple-950 transition-colors text-xs font-bold text-left cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <div className="flex-1">
                      <span>Audit Lapangan Petani &amp; Kebun</span>
                      <p className="text-[10px] text-stone-400 font-normal">
                        Uji Brix, rasio petik merah &amp; kepatuhan EUDR
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate({ view: 'dashboard', service: 'verifikator', subRoute: 'history' });
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl hover:bg-purple-50 text-purple-950 transition-colors text-xs font-bold text-left cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-purple-600 shrink-0" />
                    <div className="flex-1">
                      <span>Buku Log Riwayat Stempel Mutu</span>
                      <p className="text-[10px] text-stone-400 font-normal">
                        Daftar 25+ stempel digital SHA-256 yang sah
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setActiveView('ct4ci');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl hover:bg-yellow-50 text-yellow-950 transition-colors text-xs font-bold text-left cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-yellow-600 shrink-0" />
                    <div className="flex-1">
                      <span>Standar Mutu CT-4CI Farm v4.1</span>
                      <p className="text-[10px] text-stone-400 font-normal">
                        108 Checkpoints 4C Code of Conduct
                      </p>
                    </div>
                  </button>
                </>
              ) : isErpMode ? (
                <>
                  {/* Master Data Stasiun */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate({ view: 'dashboard', service: currentUser.role });
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl hover:bg-stone-50 text-stone-800 hover:text-amber-800 transition-colors text-xs font-bold text-left cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-amber-700 shrink-0" />
                    <div className="flex-1">
                      <span>Profil &amp; Master Data Stasiun</span>
                      <p className="text-[10px] text-stone-400 font-normal">
                        Kelola data kebun, patok lahan GPS &amp; legalitas
                      </p>
                    </div>
                  </button>

                  {/* Panel Seller / Katalog Jual */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      if (currentUser.role === 'verifikator' || currentUser.role === 'superadmin') {
                        loginAsRole('petani', 'catalog');
                      } else {
                        navigate(getSellerPanelPath());
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl hover:bg-stone-50 text-stone-800 hover:text-emerald-800 transition-colors text-xs font-bold text-left cursor-pointer"
                  >
                    <Store className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="flex-1">
                      <span>Panel Seller &amp; Penjualan</span>
                      <p className="text-[10px] text-stone-400 font-normal">
                        Katalog lot kopi siap jual, harga penawaran &amp; stok
                      </p>
                    </div>
                  </button>

                  {/* Buku Kas & Finansial */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      if (currentUser.role === 'verifikator' || currentUser.role === 'superadmin') {
                        loginAsRole('petani', 'history');
                      } else {
                        navigate(getLedgerPath());
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl hover:bg-stone-50 text-stone-800 hover:text-indigo-800 transition-colors text-xs font-bold text-left cursor-pointer"
                  >
                    <Receipt className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="flex-1">
                      <span>Buku Kas &amp; Finansial Stasiun</span>
                      <p className="text-[10px] text-stone-400 font-normal">
                        Omzet, HPP produksi, margin laba &amp; arus kas
                      </p>
                    </div>
                  </button>

                  {/* Tautan Keluar ke Marketplace Terpadu */}
                  <a
                    href={marketplaceUrl}
                    target={marketplaceUrl.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-stone-900 border border-amber-300/60 transition-colors text-xs font-bold text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Store className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>Buka Marketplace Publik</span>
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-amber-200 text-amber-950 border border-amber-400">
                            Beda Domain
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-normal">
                          marketplace-circulartrace.dutaglobaltech.com
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  </a>
                </>
              ) : (
                <>
                  {/* Buyer Navigation Links on Marketplace */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setActiveView('buyer');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-50 text-stone-700 hover:text-[#00AA5B] transition-colors text-xs font-bold text-left cursor-pointer"
                  >
                    <User className="w-4 h-4 text-stone-400" />
                    <div className="flex-1">
                      <span>Dashboard Pembeli &amp; Pesanan</span>
                      <p className="text-[10px] text-stone-400 font-normal">Lacak pesanan, alamat, dan profil</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setActiveView('transactions');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-50 text-stone-700 hover:text-[#00AA5B] transition-colors text-xs font-bold text-left cursor-pointer"
                  >
                    <Receipt className="w-4 h-4 text-stone-400" />
                    <div className="flex-1">
                      <span>Riwayat Transaksi Belanja</span>
                      <p className="text-[10px] text-stone-400 font-normal">Faktur pembayaran &amp; invoice e-commerce</p>
                    </div>
                  </button>

                  {/* Switch to Seller Panel in System ERP */}
                  <a
                    href={systemUrl}
                    target={systemUrl.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 transition-colors text-xs font-bold text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Coffee className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>Beralih ke Panel Seller (Sistem ERP)</span>
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-emerald-200 text-emerald-950 border border-emerald-400">
                            ERP ↗
                          </span>
                        </div>
                        <p className="text-[10px] text-emerald-700/80 font-normal">
                          sangrai-circulartrace.dutaglobaltech.com
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  </a>
                </>
              )}
            </div>

            {/* ============================================================== */}
            {/* 3. FOOTER: Jam Kerja & Sign Out                               */}
            {/* ============================================================== */}
            <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  {currentTime.toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  WIB
                </span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Keluar Akun</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;
