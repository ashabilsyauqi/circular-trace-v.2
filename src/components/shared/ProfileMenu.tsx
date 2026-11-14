import React, { useEffect, useRef, useState } from 'react';
import {
  LogOut,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  UserPlus,
  ChevronRight,
  Receipt,
  Wallet,
  Check,
  Building2,
  Globe,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { ROLE_DETAILS } from '../../constants/roles';
import { UserRole } from '../../types/coffee';

interface ProfileMenuProps {
  // 'dark' fits the roaster sidebar (dark background); 'light' fits the top navbar (white bg).
  variant?: 'dark' | 'light';
  compact?: boolean;
  panelLabel?: string;
  onOpenPanel?: () => void;
  onOpenRegister?: () => void;
  onOpenLedger?: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  variant = 'light',
  compact = false,
  panelLabel,
  onOpenPanel,
  onOpenRegister,
  onOpenLedger,
}) => {
  const {
    currentUser,
    logout,
    language,
    setLanguage,
    t,
  } = useCoffee();
  const [open, setOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Live Real-Time Clock (WIB)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeFormatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setTimeStr(timeFormatter.format(now) + ' WIB');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const isDark = variant === 'dark';
  const currentRoleMeta = ROLE_DETAILS[currentUser.role];

  return (
    <div className="relative" ref={ref}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-xl transition-all cursor-pointer ${
          compact
            ? isDark
              ? 'p-1 hover:bg-white/10 text-white'
              : 'p-1 hover:bg-stone-100 text-stone-700'
            : `pl-1.5 pr-2.5 py-1 border shadow-2xs ${
                isDark
                  ? 'bg-white/10 hover:bg-white/15 active:bg-white/20 border-white/15 text-white'
                  : 'bg-stone-100 hover:bg-stone-200/80 active:bg-stone-200 border-stone-200 text-stone-900'
              }`
        }`}
        title="Menu Profil & Ganti Stasiun"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className={`rounded-full object-cover border shrink-0 ${
            isDark ? 'border-amber-400/80' : 'border-amber-500'
          } ${compact ? 'w-8 h-8' : 'w-6 h-6'}`}
        />
        {!compact && (
          <div className="text-left min-w-0 hidden md:block">
            <span
              className={`text-xs font-extrabold block leading-none truncate max-w-[110px] ${
                isDark ? 'text-white' : 'text-stone-900'
              }`}
            >
              {currentUser.name}
            </span>
            <span
              className={`text-[9.5px] block truncate max-w-[110px] mt-0.5 font-bold ${
                isDark ? 'text-amber-300' : 'text-amber-800'
              }`}
            >
              {currentRoleMeta.label.split(' ')[0]}
            </span>
          </div>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
            isDark ? 'text-white/70' : 'text-stone-500'
          } ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Popover Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-84 max-w-[calc(100vw-1.5rem)] bg-white rounded-3xl border border-stone-200 shadow-2xl z-50 overflow-hidden text-stone-900 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] flex flex-col">
          {/* Header Profile Info */}
          <div className="px-4 py-3 bg-gradient-to-br from-[#18110D] to-[#291B13] text-white shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shrink-0 shadow-md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white truncate block">{currentUser.name}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-900/90 text-emerald-300 text-[8.5px] font-bold border border-emerald-500/30">
                    Aktif
                  </span>
                </div>
                <span className="text-[10px] text-stone-300 block truncate">{currentUser.organization}</span>
                <span className="text-[9.5px] font-bold text-amber-400 block mt-0.5">
                  {currentRoleMeta.label}
                </span>
              </div>
            </div>

            {/* Wallet Balance Pill */}
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-[11px]">
              <span className="text-stone-300 text-[10px] flex items-center gap-1">
                <Wallet className="w-3 h-3 text-amber-400" /> Saldo Dompet:
              </span>
              <span className="font-mono font-bold text-emerald-300">
                Rp {currentUser.balance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Server Status & Clock */}
          <div className="p-3 border-b border-stone-100 bg-stone-50/70">
            <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-stone-700 font-sans font-semibold">Sesi Terautentikasi</span>
              </span>
              <span>{timeStr || '--:--:-- WIB'}</span>
            </div>
          </div>

          {/* Extra shortcuts if present */}
          {(onOpenPanel || onOpenRegister || onOpenLedger) && (
            <div className="p-2 border-b border-stone-100 space-y-1">
              {onOpenPanel && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenPanel();
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    {panelLabel || t('navbar.adminPanel')}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              {onOpenLedger && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenLedger();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-stone-700 hover:bg-stone-50 transition-colors text-xs font-bold cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5 text-blue-600" />
                  {t('sidebar.ledger')}
                </button>
              )}
              {onOpenRegister && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenRegister();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-stone-700 hover:bg-stone-50 transition-colors text-xs font-bold cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-700" />
                  {t('navbar.register')}
                </button>
              )}
            </div>
          )}

          {/* Logout Button */}
          <button
            type="button"
            onClick={logout}
            className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t('profile.logout')}
          </button>
        </div>
      )}
    </div>
  );
};

