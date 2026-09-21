import React, { useEffect, useRef, useState } from 'react';
import { LogOut, ChevronDown, Globe, Sparkles, LayoutDashboard, UserPlus, ChevronRight, Receipt, Wallet } from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';

interface ProfileMenuProps {
  // 'dark' fits the roaster sidebar (dark background); 'light' fits the top navbar (white bg).
  variant?: 'dark' | 'light';
  compact?: boolean;
  // Extras: when provided, the dropdown also offers a shortcut into the admin panel, the
  // "create account" flow, and the transaction ledger — this is now the ONLY navigation
  // surface for those options since there is no sidebar anymore.
  panelLabel?: string;
  onOpenPanel?: () => void;
  onOpenRegister?: () => void;
  onOpenLedger?: () => void;
}

// Single dropdown that replaces the old "quick role-switch" buttons in the live/production
// look: user identity, language (ID/EN), the Demo Mode switch itself, and logout — all in one
// place instead of scattered across the navbar/sidebar.
export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  variant = 'light',
  compact = false,
  panelLabel,
  onOpenPanel,
  onOpenRegister,
  onOpenLedger,
}) => {
  const { currentUser, logout, language, setLanguage, demoModeEnabled, setDemoModeEnabled, t } = useCoffee();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const isDark = variant === 'dark';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-xl transition-colors ${
          compact
            ? 'p-1'
            : `pl-1.5 pr-2.5 py-1.5 border ${
                isDark
                  ? 'bg-stone-900/60 border-stone-800 hover:bg-stone-800'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
              }`
        }`}
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className={`rounded-full object-cover border shrink-0 ${
            isDark ? 'border-stone-700' : 'border-stone-300'
          } ${compact ? 'w-8 h-8' : 'w-7 h-7'}`}
        />
        {!compact && (
          <div className="text-left min-w-0 hidden lg:block">
            <span className={`text-xs font-bold block leading-none truncate max-w-[120px] ${isDark ? 'text-white' : 'text-stone-900'}`}>
              {currentUser.name}
            </span>
            <span className={`text-[10px] block truncate max-w-[120px] mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              {currentUser.organization}
            </span>
          </div>
        )}
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${isDark ? 'text-stone-400' : 'text-stone-400'}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-stone-200 shadow-xl z-50 overflow-hidden text-stone-900">
          <div className="px-4 py-3 border-b border-stone-100 bg-stone-50">
            <div className="flex items-center gap-2.5">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover border border-stone-300" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-stone-900 block truncate">{currentUser.name}</span>
                <span className="text-[10px] text-stone-500 block truncate">{currentUser.organization}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono font-bold text-emerald-700">
              <Wallet className="w-3 h-3 shrink-0" />
              <span className="truncate">Rp {currentUser.balance.toLocaleString()}</span>
            </div>
          </div>

          {(onOpenPanel || onOpenRegister || onOpenLedger) && (
            <div className="p-2 border-b border-stone-100 space-y-1">
              {onOpenPanel && (
                <button
                  onClick={() => {
                    onOpenPanel();
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span className="flex items-center gap-2 text-xs font-bold">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    {panelLabel || t('navbar.adminPanel')}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              {onOpenLedger && (
                <button
                  onClick={() => {
                    onOpenLedger();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors text-xs font-bold"
                >
                  <Receipt className="w-3.5 h-3.5 text-blue-600" />
                  {t('sidebar.ledger')}
                </button>
              )}
              {onOpenRegister && (
                <button
                  onClick={() => {
                    onOpenRegister();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors text-xs font-bold"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-700" />
                  {t('navbar.register')}
                </button>
              )}
            </div>
          )}

          <div className="p-3 space-y-3">
            {/* Language toggle */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1 mb-1.5">
                <Globe className="w-3 h-3" /> {t('profile.language')}
              </span>
              <div className="flex rounded-lg border border-stone-200 overflow-hidden text-[11px] font-bold">
                <button
                  onClick={() => setLanguage('id')}
                  className={`flex-1 py-1.5 transition-colors ${language === 'id' ? 'bg-orange-500 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'}`}
                >
                  Indonesia
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-1.5 transition-colors border-l border-stone-200 ${language === 'en' ? 'bg-orange-500 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'}`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Demo mode toggle */}
            <button
              onClick={() => setDemoModeEnabled(!demoModeEnabled)}
              className="w-full flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-left">
                  <span className="block">{t('profile.demoMode')}</span>
                  <span className="block text-[10px] text-stone-400 font-normal">{t('profile.demoModeHint')}</span>
                </span>
              </span>
              <span
                className={`w-9 h-5 rounded-full shrink-0 relative transition-colors ${demoModeEnabled ? 'bg-orange-500' : 'bg-stone-300'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${demoModeEnabled ? 'translate-x-4' : 'translate-x-0'}`}
                />
              </span>
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full px-4 py-3 border-t border-stone-100 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t('profile.logout')}
          </button>
        </div>
      )}
    </div>
  );
};
