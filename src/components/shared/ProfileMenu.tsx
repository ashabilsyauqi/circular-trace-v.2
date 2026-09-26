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
    users,
    logout,
    loginAsRole,
    loginAsUser,
    demoModeEnabled,
    setDemoModeEnabled,
    language,
    setLanguage,
    t,
  } = useCoffee();
  const [open, setOpen] = useState(false);
  const [expandedRole, setExpandedRole] = useState<UserRole | null>(currentUser?.role || 'petani');
  const [timeStr, setTimeStr] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Synchronize expanded role when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setExpandedRole(currentUser.role);
    }
  }, [currentUser?.role]);

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
            ? 'p-1 hover:bg-white/10'
            : `pl-1.5 pr-2.5 py-1 border shadow-2xs ${
                isDark
                  ? 'bg-stone-900/80 border-stone-700/80 hover:bg-stone-800 text-white'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`
        }`}
        title="Menu Profil & Ganti Stasiun"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className={`rounded-full object-cover border shrink-0 ${
            isDark ? 'border-amber-400/60' : 'border-amber-400'
          } ${compact ? 'w-8 h-8' : 'w-6 h-6'}`}
        />
        {!compact && (
          <div className="text-left min-w-0 hidden md:block">
            <span className="text-xs font-extrabold block leading-none truncate max-w-[110px] text-white">
              {currentUser.name}
            </span>
            <span className="text-[9.5px] block truncate max-w-[110px] text-amber-200/80 mt-0.5 font-medium">
              {currentRoleMeta.label.split(' ')[0]}
            </span>
          </div>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-white/70 ${
            open ? 'rotate-180' : ''
          }`}
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

          {/* Section: Multi-Account Station Selector */}
          <div className="p-3 border-b border-stone-100 bg-stone-50/70 overflow-y-auto max-h-72">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-amber-600" />
                Ganti Akun & Stasiun
              </span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                {users.length} Akun Terdaftar
              </span>
            </div>

            <div className="space-y-1.5">
              {(
                [
                  { role: 'petani' as UserRole, label: 'Petani (Kebun & Ceri)', icon: '👨‍🌾' },
                  { role: 'pengolah' as UserRole, label: 'Pengolah (Mill Station)', icon: '⚙️' },
                  { role: 'gudang' as UserRole, label: 'Gudang (Pergudangan & QA)', icon: '🏢' },
                  { role: 'roaster' as UserRole, label: 'Roaster (Artisan Roastery)', icon: '🔥' },
                  { role: 'cafe' as UserRole, label: 'Cafe (Retail & Brew Bar)', icon: '☕' },
                  { role: 'verifikator' as UserRole, label: 'Verifikator (Dewan Audit Mutu)', icon: '🛡️' },
                ]
              ).map((roleGroup) => {
                const isRoleActive = currentUser.role === roleGroup.role;
                const isExpanded = expandedRole === roleGroup.role;
                const roleUsers = users.filter((u) => u.role === roleGroup.role);

                return (
                  <div
                    key={roleGroup.role}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isRoleActive
                        ? 'border-amber-400/80 bg-amber-50/50 shadow-2xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    {/* Role Accordion Header */}
                    <button
                      type="button"
                      onClick={() => setExpandedRole(isExpanded ? null : roleGroup.role)}
                      className={`w-full px-2.5 py-2 text-left flex items-center justify-between text-xs font-bold cursor-pointer transition-colors ${
                        isRoleActive ? 'text-amber-950 bg-amber-100/60' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate text-[11px]">
                        <span>{roleGroup.icon}</span>
                        <span className="truncate">{roleGroup.label}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono bg-stone-200/80 text-stone-600">
                          {roleUsers.length}
                        </span>
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 shrink-0 ${
                          isExpanded ? 'rotate-180 text-amber-700' : ''
                        }`}
                      />
                    </button>

                    {/* Role Users Sub-List */}
                    {isExpanded && (
                      <div className="p-1.5 space-y-1 bg-white/80 border-t border-stone-100">
                        {roleUsers.map((user) => {
                          const isCurrentUser = currentUser.id === user.id;
                          return (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => {
                                loginAsUser(user.id);
                                setOpen(false);
                              }}
                              className={`w-full text-left p-1.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                                isCurrentUser
                                  ? 'bg-amber-600 text-white font-bold shadow-2xs'
                                  : 'hover:bg-amber-50/80 text-stone-800'
                              }`}
                            >
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className={`w-7 h-7 rounded-full object-cover shrink-0 border ${
                                  isCurrentUser ? 'border-white' : 'border-amber-300'
                                }`}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[11px] font-bold truncate block">{user.name}</span>
                                  {isCurrentUser && (
                                    <span className="text-[8px] bg-white text-amber-800 font-extrabold px-1 rounded-sm shrink-0">
                                      Aktif
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={`text-[9.5px] truncate block ${
                                    isCurrentUser ? 'text-amber-100' : 'text-stone-500'
                                  }`}
                                >
                                  {user.organization}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Shortcuts & Quick Controls */}
          <div className="p-2.5 border-b border-stone-100 space-y-1.5 text-xs">
            {/* Language Switch Row */}
            <div className="flex items-center justify-between px-2 py-1 bg-stone-50 rounded-xl">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-stone-700">
                <Globe className="w-3.5 h-3.5 text-stone-500" />
                Bahasa Sistem
              </span>
              <div className="flex items-center rounded-lg border border-stone-200 overflow-hidden text-[10.5px] font-bold bg-white">
                <button
                  type="button"
                  onClick={() => setLanguage('id')}
                  className={`px-2 py-0.5 transition-colors cursor-pointer ${
                    language === 'id'
                      ? 'bg-amber-500 text-stone-950 font-black'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  ID 🇮🇩
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 transition-colors border-l border-stone-200 cursor-pointer ${
                    language === 'en'
                      ? 'bg-amber-500 text-stone-950 font-black'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  EN 🇬🇧
                </button>
              </div>
            </div>

            {/* Demo mode toggle */}
            <button
              type="button"
              onClick={() => setDemoModeEnabled(!demoModeEnabled)}
              className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('profile.demoMode')}</span>
              </span>
              <span
                className={`w-8 h-4.5 rounded-full shrink-0 relative transition-colors ${
                  demoModeEnabled ? 'bg-amber-500' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform ${
                    demoModeEnabled ? 'translate-x-3.5' : 'translate-x-0'
                  }`}
                />
              </span>
            </button>

            {/* Live Clock / Server Status */}
            <div className="flex items-center justify-between px-2 py-1 text-[10.5px] text-stone-400 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" /> Waktu Sistem:
              </span>
              <span className="font-bold text-stone-700">{timeStr || '--:--:-- WIB'}</span>
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

