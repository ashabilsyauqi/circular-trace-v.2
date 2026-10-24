import React from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Coffee,
  LogIn,
} from 'lucide-react';
import { ProfileMenu } from './shared/ProfileMenu';
import { LanguageSwitch } from './shared/LanguageSwitch';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    setActiveView,
    t,
  } = useCoffee();

  return (
    <header className="sticky top-0 z-40">
      {/* Main Public Storefront Navigation Bar */}
      <div className="bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-3">
            {/* Left: Brand Identity */}
            <div
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2C1810] to-[#5C3A21] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Coffee className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-lg tracking-tight text-stone-900">
                    sangrAI
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200/80 font-semibold">
                    Circular Trace
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 hidden sm:block">
                  {t('nav.subtitle')}
                </p>
              </div>
            </div>

            {/* Right: Language Switcher beside Profile Badge or Login CTA */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <LanguageSwitch variant="light" />
              {currentUser ? (
                <ProfileMenu variant="light" onOpenLedger={() => setActiveView('transactions')} />
              ) : (
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#23140D] hover:bg-[#362015] text-[#FAF8F5] shadow-xs transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#C89D66]" />
                  <span>{t('navbar.login')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
