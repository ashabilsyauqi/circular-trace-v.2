import React from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { Globe } from 'lucide-react';

interface LanguageSwitchProps {
  // 'dark' fits dark admin header / roaster dark shell; 'light' fits clean storefront navbar
  variant?: 'dark' | 'light';
}

/**
 * Compact ID/EN toggle with globe icon, placed directly in the main header next to the Profile badge.
 */
export const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ variant = 'light' }) => {
  const { language, setLanguage } = useCoffee();
  const isDark = variant === 'dark';

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-xl p-0.5 border shadow-2xs shrink-0 select-none transition-all ${
        isDark
          ? 'bg-stone-900/90 border-white/20 text-stone-200'
          : 'bg-white/95 border-stone-200/90 text-stone-700'
      }`}
      role="group"
      aria-label="Switch language / Ganti bahasa"
    >
      <div className="pl-1.5 pr-0.5 flex items-center" title="Pilih Bahasa / Select Language">
        <Globe className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-800'}`} />
      </div>
      <button
        type="button"
        onClick={() => setLanguage('id')}
        className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer whitespace-nowrap ${
          language === 'id'
            ? isDark
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'bg-[#2C1810] text-amber-300 shadow-xs'
            : isDark
            ? 'text-stone-400 hover:text-white'
            : 'text-stone-500 hover:text-stone-900'
        }`}
        title="Bahasa Indonesia (ID)"
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer whitespace-nowrap ${
          language === 'en'
            ? isDark
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'bg-[#2C1810] text-amber-300 shadow-xs'
            : isDark
            ? 'text-stone-400 hover:text-white'
            : 'text-stone-500 hover:text-stone-900'
        }`}
        title="English (EN)"
      >
        EN
      </button>
    </div>
  );
};
