import React from 'react';
import { useCoffee } from '../../context/CoffeeContext';

interface LanguageSwitchProps {
  // 'dark' fits the roaster sidebar/footer (dark background); 'light' fits white navbars.
  variant?: 'dark' | 'light';
}

// Compact ID/EN toggle, always visible directly in the navbar — not tucked inside the Profile
// dropdown, so switching language is a one-click action from anywhere in the app.
export const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ variant = 'light' }) => {
  const { language, setLanguage } = useCoffee();
  const isDark = variant === 'dark';

  return (
    <div
      className={`flex items-center rounded-lg border overflow-hidden text-[11px] font-bold shrink-0 ${
        isDark ? 'border-stone-700' : 'border-stone-200'
      }`}
      role="group"
      aria-label="Switch language / Ganti bahasa"
    >
      <button
        type="button"
        onClick={() => setLanguage('id')}
        className={`px-2 py-1.5 transition-colors ${
          language === 'id'
            ? 'bg-amber-500 text-stone-950'
            : isDark
            ? 'bg-stone-900 text-stone-400 hover:text-white'
            : 'bg-white text-stone-500 hover:text-stone-900'
        }`}
        title="Bahasa Indonesia"
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2 py-1.5 transition-colors border-l ${
          isDark ? 'border-stone-700' : 'border-stone-200'
        } ${
          language === 'en'
            ? 'bg-amber-500 text-stone-950'
            : isDark
            ? 'bg-stone-900 text-stone-400 hover:text-white'
            : 'bg-white text-stone-500 hover:text-stone-900'
        }`}
        title="English"
      >
        EN
      </button>
    </div>
  );
};
