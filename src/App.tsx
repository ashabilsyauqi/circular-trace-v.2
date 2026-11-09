import { LandingPage } from './components/LandingPage';
import React from 'react';
import { CoffeeProvider, useCoffee } from './context/CoffeeContext';
import { UserRole } from './types/coffee';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { UnifiedMarketplace } from './components/UnifiedMarketplace';
import { ProductDetailPage } from './components/ProductDetailPage';
import { TransactionHistoryView } from './components/TransactionHistoryView';
import { BuyerView } from './components/BuyerView';
import { BuyerCartPage } from './components/buyer/BuyerCartPage';
import { PublicLotScanView } from './components/PublicLotScanView';

// Brand Operational ERP Components
import { AdminLayout } from './components/AdminLayout';
import { FarmerView } from './components/FarmerView';
import { ProcessorView } from './components/ProcessorView';
import { WarehouseView } from './components/WarehouseView';
import { RoasterView } from './components/RoasterView';
import { CafeView } from './components/CafeView';
import { VerifierView } from './components/verifier/VerifierView';
import { SuperAdminView } from './components/SuperAdminView';
import { ManageSubscriptionView } from './components/subscription/ManageSubscriptionView';
import { ImpersonationBanner } from './components/shared/ImpersonationBanner';
import { Lock, Sparkles, Store } from 'lucide-react';
import { getSystemBaseUrl } from './utils/baseUrl';

const MainLayout: React.FC = () => {
  const { currentUser, activeView, setActiveView, route, navigate, hasRoleAccess } = useCoffee();

  // 1. Realtime QR code scan view (/trace, ?lotId=... or ?cupId=...)
  const isScanRoute = route.view === 'scan' || activeView === 'scan';
  const scannedLotId = route.cupId || route.lotId || 'LOT-PTN-001';

  if (isScanRoute) {
    return (
      <PublicLotScanView
        lotId={scannedLotId}
        onContinue={() => {
          navigate({ view: 'marketplace', lotId: null, cupId: null, replace: true });
        }}
      />
    );
  }

  // 2. Sign In / Authentication View
  // Login view eksplisit atau halaman terproteksi yang diakses saat belum login
  if (
    activeView === 'login' ||
    ((activeView === 'dashboard' || activeView === 'buyer' || activeView === 'transactions' || activeView === 'cart') &&
    !currentUser)
  ) {
    return <LoginPage />;
  }

  // 3. Operational Brand & Super Admin Ecosystem Layout
  // Jika user adalah brand (petani, pengolah, gudang, roaster, cafe, verifikator, superadmin) dan berada pada view dashboard
  const isBrandRole = currentUser && currentUser.role !== 'buyer';
  const isDashboardView = activeView === 'dashboard';

  if (isBrandRole && isDashboardView) {
    const isAccessAllowed = hasRoleAccess(currentUser.role, currentUser);

    // PAYWALL GATE: Jika langganan belum ada atau expired, kunci akses dan tampilkan paket langganan
    if (!isAccessAllowed) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
          <div>
            <Navbar />
            <ImpersonationBanner />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
              {/* Paywall Locked Banner */}
              <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-700/50">
                <div className="space-y-2 text-center md:text-left">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider border border-amber-400/30 inline-flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Akses Layanan Brand Terkunci</span>
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Modul Operasional {currentUser.organization || currentUser.name} Memerlukan Paket Langganan Aktif
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-100/80 max-w-2xl leading-relaxed">
                    Untuk membuka pencatatan kebun EUDR, stasiun olah mill, manajemen gudang klimatik, profil sangrai roastery, dan stempel verifikasi silsilah, silakan aktifkan paket langganan brand Anda di bawah ini.
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-400/30 text-amber-300 flex items-center gap-2 text-xs font-bold">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Trial 7 Hari Tersedia</span>
                  </div>
                </div>
              </div>

              {/* Subscription Plans & Checkout Component */}
              <ManageSubscriptionView />
            </main>
          </div>

          <footer className="bg-white text-stone-600 text-xs py-8 border-t border-stone-200 mt-12 shadow-2xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00AA5B]"></span>
                <span className="text-stone-900 font-extrabold tracking-tight">CircularTrace Ecosystem</span>
                <span className="text-stone-300">|</span>
                <span className="text-stone-500">Platform Silsilah &amp; Rantai Pasok Kopi Sirkular</span>
              </div>
              <div className="flex items-center gap-6 text-[11px] text-stone-500">
                <span>Specialty Coffee Standard</span>
                <span>&bull;</span>
                <span>EUDR Compliance</span>
                <span>&bull;</span>
                <span>Farm-to-Cup Ledger</span>
              </div>
            </div>
          </footer>
        </div>
      );
    }

    // Determine target operational workstation: URL route has priority over session role
    const targetService = (route.view === 'dashboard' && route.service) ? route.service.toLowerCase() : currentUser.role;
    const effectiveServiceRole: UserRole = targetService === 'admin' ? 'superadmin' : (targetService as UserRole);

    // AKSES TERBUKA: Render Layout Operasional ERP sesuai Stasiun & Peran
    return (
      <>
        <ImpersonationBanner />
        <AdminLayout>
          {effectiveServiceRole === 'superadmin' && <SuperAdminView />}
          {effectiveServiceRole === 'petani' && <FarmerView />}
          {effectiveServiceRole === 'pengolah' && <ProcessorView />}
          {effectiveServiceRole === 'gudang' && <WarehouseView />}
          {effectiveServiceRole === 'roaster' && <RoasterView />}
          {effectiveServiceRole === 'cafe' && <CafeView />}
          {effectiveServiceRole === 'verifikator' && <VerifierView />}
        </AdminLayout>
      </>
    );
  }

  // 4. Main Marketplace Storefront & Public Buyer Experience
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      <div>
        <Navbar />

        {/* 1. Landing Page Ekosistem Kopi Sirkular (Petani, Pengolah, Gudang, Roaster, Cafe) */}
        {activeView === 'landing' && <LandingPage />}

        {/* 2. E-Commerce Marketplace Catalog (Modul Terpisah / Rencana Domain Khusus) */}
        {activeView === 'marketplace' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
            {/* Domain Separation Notice Banner */}
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <div>
                  <strong className="font-extrabold text-stone-900 block text-sm">
                    Katalog Marketplace Kopi Specialty &amp; Komoditas Petani
                  </strong>
                  <span className="text-stone-600">
                    Modul Perdagangan B2B Mandiri (Direncanakan pada Domain Terpisah). Terbuka untuk pemesanan ceri panen, green bean, dan roasted coffee.
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.location.host.includes('marketplace')) {
                    window.location.href = getSystemBaseUrl();
                  } else {
                    setActiveView('landing');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold shrink-0 transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>← Beralih ke Sistem ERP SangrAI</span>
              </button>
            </div>
            <UnifiedMarketplace />
          </main>
        )}

        {/* Dedicated Full Product Detail Page with Breadcrumb */}
        {activeView === 'product' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
            <ProductDetailPage />
          </main>
        )}

        {/* Dedicated Buyer Portal (HANYA MUNCUL DI MARKETPLACE DOMAIN ATAU JIKA USER BUYER) */}
        {(activeView === 'buyer' || (activeView === 'dashboard' && currentUser?.role === 'buyer')) && (typeof window !== 'undefined' && window.location.host.includes('marketplace') || currentUser?.role === 'buyer') && currentUser && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
            <BuyerView />
          </main>
        )}

        {/* Dedicated Shopping Cart Page with Bundle Payment & Collapsible Tables */}
        {activeView === 'cart' && currentUser && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
            <BuyerCartPage />
          </main>
        )}

        {/* Transaction Ledger View (HANYA MUNCUL JIKA USER SUDAH LOGIN) */}
        {activeView === 'transactions' && currentUser && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <TransactionHistoryView />
          </main>
        )}

        {/* Dedicated Subscription Pricing & Management View */}
        {activeView === 'subscription' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
            <ManageSubscriptionView />
          </main>
        )}
      </div>

      <footer className="bg-white text-stone-600 text-xs py-8 border-t border-stone-200 mt-12 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00AA5B]"></span>
            <span className="text-stone-900 font-extrabold tracking-tight">CircularTrace Marketplace</span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-500">Pasar Kopi Specialty Langsung dari Petani Nusantara</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-stone-500">
            <span>Specialty Coffee Standard</span>
            <span>&bull;</span>
            <span>Traceability Ledger</span>
            <span>&bull;</span>
            <span>Direct Farm to Cup</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <CoffeeProvider>
      <MainLayout />
    </CoffeeProvider>
  );
}

export default App;
