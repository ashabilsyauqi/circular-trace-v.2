import React, { useState, useRef } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Coffee,
  Layers,
  QrCode,
  LogIn,
  ShoppingCart,
  Store,
  Receipt,
  User,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Award,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { ProfileMenu } from './shared/ProfileMenu';
import { LanguageSwitch } from './shared/LanguageSwitch';
import { getMarketplaceBaseUrl, getSystemBaseUrl } from '../utils/baseUrl';
import { MarketplaceBubbleTour } from './shared/MarketplaceBubbleTour';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    cartItems,
    navigate,
  } = useCoffee();

  const [isHovered, setIsHovered] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const hoverTimeoutRef = useRef<any>(null);

  const isMarketplaceDomain = typeof window !== 'undefined' && window.location.host.includes('marketplace');
  const isMarketMode = isMarketplaceDomain || activeView === 'marketplace' || activeView === 'product' || activeView === 'cart' || activeView === 'buyer' || activeView === 'transactions';
  const isMarketplaceView = isMarketMode;
  const isSellerRole = currentUser && ['petani', 'pengolah', 'gudang', 'roaster', 'cafe'].includes(currentUser.role);
  const isVerifier = currentUser?.role === 'verifikator';

  const totalCartCount = (cartItems || []).reduce((acc, c) => acc + c.quantity, 0);
  const totalCartPrice = (cartItems || []).reduce((acc, c) => acc + c.item.price * c.quantity, 0);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 250);
  };

  const getSellerPanelTarget = () => {
    switch (currentUser?.role) {
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
      default:
        return { view: 'dashboard' as const, service: currentUser?.role || 'petani', subRoute: 'farms' };
    }
  };

  const getLedgerTarget = () => {
    switch (currentUser?.role) {
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
      default:
        return { view: 'dashboard' as const, service: currentUser?.role || 'petani', subRoute: 'history' };
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs font-['Poppins']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* Left: Brand Logo & Title */}
          <div
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform text-white">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-stone-900">
                  Circular<span className="text-emerald-700">Coffee</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-300">
                  {isMarketplaceDomain ? 'Marketplace' : 'Ecosystem'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                {isMarketplaceDomain 
                  ? 'Pasar Kopi Specialty Langsung dari Petani Nusantara'
                  : 'Platform Rantai Pasok Kopi Sirkular (Petani • Pengolah • Roaster)'}
              </p>
            </div>
          </div>

          {/* Center: Navigation Links (Clean, Sleek single-line, NO flex-wrap) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 flex-nowrap shrink-0 font-['Poppins']">
            {isMarketMode ? (
              /* --- 1. MARKETPLACE EXPERIENCE NAVIGATION --- */
              <>
                {/* 1. Katalog Kopi */}
                <button
                  type="button"
                  onClick={() => setActiveView('marketplace')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'marketplace' || activeView === 'product'
                      ? 'text-emerald-900 bg-emerald-50 border border-emerald-300 shadow-2xs font-black'
                      : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-50'
                  }`}
                  title="Katalog Produk Kopi Specialty Marketplace"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Katalog Kopi</span>
                </button>

                {/* 2. Traceability Paspor Digital */}
                <button
                  type="button"
                  onClick={() => setActiveView('scan')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'scan'
                      ? 'text-emerald-900 bg-emerald-50 border border-emerald-300 shadow-2xs font-black'
                      : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-50'
                  }`}
                  title="Ketertelusuran Silsilah Kopi Sirkular (Farm-to-Cup QR)"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Traceability</span>
                </button>

                {/* 3. Pesanan Saya */}
                <button
                  type="button"
                  onClick={() => setActiveView('buyer')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'buyer' || activeView === 'transactions'
                      ? 'text-emerald-900 bg-emerald-50 border border-emerald-300 shadow-2xs font-black'
                      : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-50'
                  }`}
                  title="Daftar Pesanan & Riwayat Transaksi Belanja"
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pesanan Saya</span>
                </button>

                {/* 4. Portal Partner Dropdown Ringkas */}
                <div className="relative group">
                  <button
                    type="button"
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Layanan Lain</span>
                    <ChevronDown className="w-3 h-3 text-stone-400 group-hover:rotate-180 transition-transform" />
                  </button>
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-1.5 hidden group-hover:block animate-in fade-in zoom-in-95 z-50">
                    <a
                      href={getSystemBaseUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3.5 py-2 text-xs font-bold text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-emerald-600" />
                        <span>Sistem Sangrai ERP</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                    </a>
                    <a
                      href={`${getSystemBaseUrl()}/verifikator/petani`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3.5 py-2 text-xs font-bold text-purple-900 hover:bg-purple-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Verifikator Pihak Ke-3</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                    </a>
                  </div>
                </div>
              </>
            ) : (
              /* --- 2. SISTEM SANGRAI / ECOSYSTEM DOMAIN NAVIGATION --- */
              <>
                <button
                  type="button"
                  onClick={() => setActiveView('landing')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'landing'
                      ? 'text-emerald-900 bg-emerald-50 border border-emerald-300 font-black shadow-2xs'
                      : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-50'
                  }`}
                  title="Beranda Ekosistem CircularCoffee"
                >
                  <Coffee className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ekosistem Kopi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView('scan')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'scan'
                      ? 'text-emerald-900 bg-emerald-50 border border-emerald-300 font-black shadow-2xs'
                      : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-50'
                  }`}
                  title="Sistem Ketertelusuran Silsilah Kopi Sirkular"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Traceability</span>
                </button>

                <a
                  href={getMarketplaceBaseUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-amber-900 hover:bg-amber-50 border border-amber-200"
                  title="Katalog E-Commerce Marketplace (Beda Domain)"
                >
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                  <span>Marketplace</span>
                  <ExternalLink className="w-3 h-3 text-amber-600" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    navigate({ view: 'dashboard', service: 'verifikator', subRoute: 'petani' });
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    isVerifier
                      ? 'text-purple-900 bg-purple-50 border border-purple-300 font-bold'
                      : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50 border border-purple-200/60'
                  }`}
                  title="Portal Auditor Independen Pihak Ketiga"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Verifikator</span>
                  <ExternalLink className="w-3 h-3 text-purple-500" />
                </button>
              </>
            )}
          </nav>

          {/* Right: Cart, Language Switcher, Profile/Login */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* SHOPPING CART ICON & MARKETPLACE TOUR (HANYA MUNCUL DI MODUL MARKETPLACE) */}
            {isMarketplaceView && (
              <>
                <div
                  id="tour-cart-btn"
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Cart Icon Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsHovered(false);
                      setActiveView('cart');
                    }}
                    className={`relative p-2.5 rounded-xl transition-all cursor-pointer ${
                      activeView === 'cart'
                        ? 'text-emerald-700 bg-emerald-50 ring-2 ring-emerald-500/20'
                        : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-100'
                    }`}
                    title="Buka Keranjang Belanja & Bundle Payment"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {totalCartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                        {totalCartCount}
                      </span>
                    )}
                  </button>

                  {/* HOVER DROPDOWN CONTAINER */}
                  {isHovered && (
                    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      
                      {/* Dropdown Header */}
                      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                          <ShoppingCart className="w-4 h-4 text-emerald-600" />
                          <span>Keranjang Belanja ({cartItems.length} Produk)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsHovered(false);
                            setActiveView('cart');
                          }}
                          className="text-emerald-600 hover:text-emerald-700 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Buka Detail</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Dropdown Body: Max 4 Products */}
                      {cartItems.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 space-y-1">
                          <ShoppingCart className="w-8 h-8 mx-auto text-slate-300" />
                          <p className="text-xs font-semibold text-slate-700">Keranjang Belanja Kosong</p>
                          <p className="text-[11px] text-slate-400">Pilih kopi favorit Anda dari katalog.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                          {cartItems.slice(0, 4).map((c) => {
                            const cleanUnit = (c.item.priceUnit || 'kg').replace(/^\/+/, '').trim();
                            return (
                              <div
                                key={c.id}
                                onClick={() => {
                                  setIsHovered(false);
                                  setActiveView('cart');
                                }}
                                className="p-3 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img
                                    src={c.item.photoUrl || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80&auto=format&fit=crop&q=80'}
                                    alt={c.item.title}
                                    className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <h5 className="text-xs font-bold text-slate-900 truncate">
                                      {c.item.title}
                                    </h5>
                                    <div className="text-[11px] text-slate-500 truncate">
                                      {c.quantity} {cleanUnit} &times; Rp {c.item.price.toLocaleString('id-ID')}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="text-xs font-black text-slate-900">
                                    Rp {(c.item.price * c.quantity).toLocaleString('id-ID')}
                                  </span>
                                </div>
                              </div>
                            );
                          })}

                          {/* Text indicator if more than 4 products */}
                          {cartItems.length > 4 && (
                            <div className="p-2.5 bg-slate-50/80 text-center text-[11px] text-slate-500 font-medium">
                              + {cartItems.length - 4} produk lainnya di keranjang
                            </div>
                          )}
                        </div>
                      )}

                      {/* Dropdown Footer with Subtotal & "Lihat Lebih Lengkap" Button */}
                      {cartItems.length > 0 && (
                        <div className="p-3.5 bg-slate-50/90 border-t border-slate-200 space-y-2.5">
                          <div className="flex items-baseline justify-between text-xs">
                            <span className="text-slate-500 font-medium">Total Harga Produk:</span>
                            <span className="font-black text-sm text-slate-900">
                              Rp {totalCartPrice.toLocaleString('id-ID')}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setIsHovered(false);
                              setActiveView('cart');
                            }}
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Lihat Lebih Lengkap &bull; Bayar Bundle</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* PANDUAN FITUR / TUTORIAL BUTTON */}
                <button
                  type="button"
                  id="tour-guide-btn"
                  onClick={() => setIsTourOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-all cursor-pointer shadow-2xs"
                  title="Buka Panduan & Tutorial Marketplace"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden md:inline">Panduan Fitur</span>
                </button>
              </>
            )}

            {/* Tombol Paket Brand di Navbar Ekosistem */}
            {!isMarketplaceDomain && (
              <button
                type="button"
                onClick={() => setActiveView('subscription')}
                className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs ${
                  activeView === 'subscription'
                    ? 'text-amber-950 bg-amber-100 border border-amber-400 font-extrabold'
                    : 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300'
                }`}
                title="Lihat Paket Langganan Brand"
              >
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                <span>Paket Brand</span>
              </button>
            )}

            <LanguageSwitch variant="light" />

            {currentUser ? (
              <ProfileMenu variant="light" onOpenLedger={() => setActiveView('transactions')} />
            ) : (
              <button
                onClick={() => setActiveView('login')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-[#00AA5B] hover:bg-[#03AC0E] text-white shadow-xs transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Akun</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Floating Bubble Chat Tour Directly Pointing to Features */}
      {isMarketplaceView && (
        <MarketplaceBubbleTour
          forceOpen={isTourOpen}
          onClose={() => setIsTourOpen(false)}
        />
      )}
    </header>
  );
};
