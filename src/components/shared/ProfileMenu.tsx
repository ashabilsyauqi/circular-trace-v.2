import React, { useState, useEffect } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { ROLE_DETAILS } from '../../constants/roles';
import { UserRole } from '../../types/coffee';
import {
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  Award,
  ChevronDown,
  MapPin,
  Phone,
  Wallet,
  Clock,
  LogOut,
  History,
  LayoutDashboard,
  ShieldCheck,
  Mail,
  Crown,
} from 'lucide-react';

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  petani: <Sprout className="w-3.5 h-3.5" />,
  pengolah: <Cog className="w-3.5 h-3.5" />,
  gudang: <Warehouse className="w-3.5 h-3.5" />,
  roaster: <Flame className="w-3.5 h-3.5" />,
  cafe: <Coffee className="w-3.5 h-3.5" />,
  verifikator: <Award className="w-3.5 h-3.5" />,
  superadmin: <Crown className="w-3.5 h-3.5 text-amber-500" />,
};

interface ProfileMenuProps {
  variant?: 'dark' | 'light';
  onOpenLedger?: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ variant = 'dark', onOpenLedger }) => {
  const {
    currentUser,
    logout,
    setActiveView,
    language,
    t,
    impersonatingFromUser,
    returnToSuperAdmin,
  } = useCoffee();

  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) return null;

  const roleInfo = ROLE_DETAILS[currentUser.role];
  const isDark = variant === 'dark';

  const handleSignOutAndRelogin = () => {
    setOpen(false);
    logout();
    setActiveView('dashboard');
  };

  return (
    <div className="relative shrink-0">
      {/* Trigger: User avatar / Pill button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer select-none shrink-0 ${
          isDark
            ? open
              ? 'bg-white/15 border-amber-400/50 text-white shadow-xs'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-stone-200'
            : open
            ? 'bg-stone-100 border-amber-600/40 text-stone-900 shadow-xs'
            : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
        }`}
        aria-label="Menu Pengguna / User Profile"
        aria-expanded={open}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-7 h-7 rounded-lg object-cover border border-amber-400/40"
          />
          <div
            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] border border-stone-900 ${roleInfo.badgeClass}`}
            title={roleInfo.label}
          >
            {ROLE_ICONS[currentUser.role]}
          </div>
        </div>

        {/* Name & Role preview (hidden on very small mobile) */}
        <div className="text-left hidden md:block max-w-[130px] lg:max-w-[160px] truncate leading-tight">
          <p className="text-xs font-bold truncate leading-none">{currentUser.name}</p>
          <p
            className={`text-[10px] truncate leading-none mt-0.5 ${
              isDark ? 'text-stone-400' : 'text-stone-500'
            }`}
          >
            {currentUser.organization}
          </p>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
            open ? 'rotate-180 text-amber-500' : isDark ? 'text-stone-400' : 'text-stone-500'
          }`}
        />
      </button>

      {/* Popover Dropdown Card */}
      {open && (
        <>
          {/* Backdrop click dismiss */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div
            className="absolute right-0 top-full mt-2 w-88 sm:w-[420px] max-w-[95vw] rounded-2xl bg-white border border-stone-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            role="menu"
          >
            {/* 1. Header Card: Identity & Station Info */}
            <div className="p-4 bg-gradient-to-br from-[#1C120C] via-[#2C1810] to-[#3D2214] text-white">
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400/60 shadow-xs"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] border-2 border-[#1C120C] ${roleInfo.badgeClass}`}
                    title={roleInfo.label}
                  >
                    {ROLE_ICONS[currentUser.role]}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-bold text-sm text-white truncate max-w-[200px]" title={currentUser.name}>
                      {currentUser.name}
                    </h4>
                    <span
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-amber-300 border border-amber-400/40 bg-amber-950/60 whitespace-nowrap"
                    >
                      <Crown className="w-2.5 h-2.5 text-amber-400" />
                      {roleInfo.label.split(' ')[0]}
                    </span>
                  </div>

                  <p className="text-[11px] text-amber-200/90 font-medium truncate mt-0.5" title={currentUser.organization}>
                    {currentUser.organization}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-stone-300 mt-1 truncate">
                    <Mail className="w-2.5 h-2.5 shrink-0 text-amber-400" />
                    <span className="truncate">{currentUser.email}</span>
                  </div>

                  {currentUser.location && (
                    <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-0.5 truncate">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{currentUser.location}</span>
                    </div>
                  )}

                  {currentUser.phone && (
                    <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-0.5">
                      <Phone className="w-2.5 h-2.5 shrink-0" />
                      <span className="whitespace-nowrap">{currentUser.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Partner Identity & Quick Actions (Zero Text Wrapping) */}
              <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 block whitespace-nowrap">
                      {t('profile.stationOrg')}
                    </span>
                    <span className="text-xs font-semibold text-stone-200 truncate block max-w-[130px] sm:max-w-[180px]" title={currentUser.organization}>
                      {currentUser.organization}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setActiveView('dashboard');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-[11px] font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-2xs active:scale-95"
                    title="Buka Dasbor Stasiun Saya"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap font-black">{t('profile.myPanel')}</span>
                  </button>
                  {onOpenLedger && (
                    <button
                      onClick={() => {
                        setOpen(false);
                        onOpenLedger();
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 text-[11px] font-bold flex items-center gap-1 border border-white/15 transition-all cursor-pointer whitespace-nowrap shrink-0"
                      title="Buku Besar & Riwayat Mutasi"
                    >
                      <History className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="whitespace-nowrap">{t('profile.ledger')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Impersonation Return Button if active */}
            {Boolean(
              impersonatingFromUser ||
                (typeof window !== 'undefined' && localStorage.getItem('cct_impersonating_superadmin'))
            ) && (
              <div className="p-3 bg-amber-50 border-b border-amber-200">
                <button
                  onClick={() => {
                    setOpen(false);
                    returnToSuperAdmin();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border border-amber-600/30 whitespace-nowrap"
                >
                  <Crown className="w-4 h-4 text-stone-950 shrink-0" />
                  <span className="whitespace-nowrap">{t('profile.returnSuperAdmin')}</span>
                </button>
              </div>
            )}

            {/* 2. Security & Session Info */}
            <div className="p-3.5 bg-stone-50/70 border-b border-stone-100">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-950 text-[11px] whitespace-nowrap">{t('profile.sessionActive')}</p>
                  <p className="text-[10.5px] text-emerald-800/90 leading-snug mt-0.5">
                    {t('profile.sessionHint')}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Footer: System Time + Logout Action */}
            <div className="p-3 bg-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono whitespace-nowrap shrink-0">
                <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>
                  {currentTime.toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  {language === 'id' ? 'WIB' : 'UTC+7'}
                </span>
              </div>

              <button
                onClick={handleSignOutAndRelogin}
                className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">{t('profile.logout')}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
