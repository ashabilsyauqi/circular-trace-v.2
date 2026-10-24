import React from 'react';
import { CoffeeProvider, useCoffee } from './context/CoffeeContext';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { AdminLayout } from './components/AdminLayout';
import { UnifiedMarketplace } from './components/UnifiedMarketplace';
import { TransactionHistoryView } from './components/TransactionHistoryView';
import { FarmerView } from './components/FarmerView';
import { ProcessorView } from './components/ProcessorView';
import { WarehouseView } from './components/WarehouseView';
import { RoasterView } from './components/RoasterView';
import { CafeView } from './components/CafeView';
import { VerifierView } from './components/verifier/VerifierView';
import { SuperAdminView } from './components/SuperAdminView';
import { PublicLotScanView } from './components/PublicLotScanView';
import { LandingPage } from './components/LandingPage';
import { ImpersonationBanner } from './components/shared/ImpersonationBanner';

const MainLayout: React.FC = () => {
  const { currentUser, activeView, route, navigate } = useCoffee();

  // 1. Realtime QR code scan view (?lotId=... or ?cupId=...)
  const isScanRoute = route.view === 'scan' || Boolean(route.lotId || route.cupId);
  const scannedLotId = route.cupId || route.lotId || null;

  if (isScanRoute && scannedLotId) {
    return (
      <PublicLotScanView
        lotId={scannedLotId}
        onContinue={() => {
          navigate({ view: 'marketplace', lotId: null, cupId: null, replace: true });
        }}
      />
    );
  }

  // 2. Dedicated Admin Panel View (Admin Layout dengan Sidebar Profesional)
  if (activeView === 'dashboard') {
    if (!currentUser) {
      return <LoginPage />;
    }
    return (
      <>
        <ImpersonationBanner />
        <AdminLayout>
        {currentUser.role === 'superadmin' && <SuperAdminView />}
        {currentUser.role === 'petani' && <FarmerView />}
        {currentUser.role === 'pengolah' && <ProcessorView />}
        {currentUser.role === 'gudang' && <WarehouseView />}
        {currentUser.role === 'roaster' && <RoasterView />}
        {currentUser.role === 'cafe' && <CafeView />}
        {currentUser.role === 'verifikator' && <VerifierView />}
      </AdminLayout>
      </>
    );
  }

  // 3. Base Utama Website: Landing Page, E-Commerce Storefront, atau Transaksi
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between text-stone-900">
      <div>
        <ImpersonationBanner />
        <Navbar />
        {/* Landing Page (Base URL Marketing) */}
        {activeView === 'landing' && <LandingPage />}

        {/* E-Commerce Marketplace Catalog (Katalog Terpadu 5 Aktor) */}
        {activeView === 'marketplace' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UnifiedMarketplace />
          </main>
        )}

        {/* Transaction Ledger View */}
        {activeView === 'transactions' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <TransactionHistoryView />
          </main>
        )}
      </div>

      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-white font-bold tracking-tight">sangrAI Ecosystem</span>
            <span className="text-stone-600">|</span>
            <span>E-Commerce Terpadu & Panel Admin Mandiri</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-stone-500">
            <span>Specialty Coffee Standard</span>
            <span>•</span>
            <span>Traceability Ledger</span>
            <span>•</span>
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
