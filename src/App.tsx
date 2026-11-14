import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useSearchParams,
  useNavigate,
  Outlet,
} from 'react-router-dom';
import { CoffeeProvider } from './context/CoffeeContext';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { AdminLTELayout } from './components/adminlte/AdminLTELayout';
import { ExternalLink } from 'lucide-react';
import { TransactionHistoryView } from './components/TransactionHistoryView';
import { FarmerView } from './components/FarmerView';
import { ProcessorView } from './components/ProcessorView';
import { WarehouseView } from './components/WarehouseView';
import { RoasterView } from './components/RoasterView';
import { CafeView } from './components/CafeView';
import { PublicLotScanView } from './components/PublicLotScanView';
import { LandingPage } from './components/LandingPage';
import { KelompokTaniDashboard } from './components/admin/KelompokTaniDashboard';
import { MasterUsersView } from './components/admin/MasterUsersView';
import { MasterPetaniPage } from './pages/admin/MasterPetaniPage';
import { MasterPetaniFormPage } from './pages/admin/MasterPetaniFormPage';
import { MasterKebunPage } from './pages/admin/MasterKebunPage';
import { MasterKebunFormPage } from './pages/admin/MasterKebunFormPage';
import { MasterKebunMapPage } from './pages/admin/MasterKebunMapPage';
import { MasterPanenPage } from './pages/admin/MasterPanenPage';
import { MasterPanenFormPage } from './pages/admin/MasterPanenFormPage';
import { MasterPanenDetailPage } from './pages/admin/MasterPanenDetailPage';
import { FarmerLedgerPage } from './pages/admin/FarmerLedgerPage';
import { IctVerificationPage } from './pages/admin/IctVerificationPage';
import { IcsAuditSheetPage } from './pages/admin/IcsAuditSheetPage';
import { CtFarmCertificationDashboardPage } from './pages/admin/ict/CtFarmCertificationDashboardPage';
import { WarehouseInventoryPage } from './pages/admin/gudang/WarehouseInventoryPage';
import { WarehouseSortingSheetPage } from './pages/admin/gudang/WarehouseSortingSheetPage';
import { WarehouseSourcingPage } from './pages/admin/gudang/WarehouseSourcingPage';
import { RoasterInventoryPage } from './pages/admin/roaster/RoasterInventoryPage';
import { RoasterProductionPage } from './pages/admin/roaster/RoasterProductionPage';
import { RoasterCuppingSheetPage } from './pages/admin/roaster/RoasterCuppingSheetPage';
import { RoasterSourcingPage } from './pages/admin/roaster/RoasterSourcingPage';
import { MarketplaceSellerPanelPage } from './pages/admin/seller/MarketplaceSellerPanelPage';

/**
 * Public Layout holding top Navbar + Outlet + bottom Footer
 */
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between text-stone-900">
      <div>
        <Navbar />
        <Outlet />
      </div>

      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-white font-bold tracking-tight">sangrAI Ecosystem</span>
            <span className="text-stone-600">|</span>
            <span>E-Commerce Terpadu &amp; Panel Admin Kelompok Tani</span>
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

/**
 * Root Landing Route which also checks for ?cupId= / ?lotId= / ?scan= QR scan parameters
 */
const HomeOrScanRoute: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scannedLotId =
    searchParams.get('cupId') || searchParams.get('lotId') || searchParams.get('scan');

  if (scannedLotId) {
    return (
      <PublicLotScanView
        lotId={scannedLotId}
        onContinue={() => {
          navigate('/');
        }}
      />
    );
  }

  return <LandingPage />;
};

/**
 * Public QR Code Traceability Route: /trace/:lotId?
 */
const PublicTraceRoute: React.FC = () => {
  const { lotId } = useParams<{ lotId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeLotId =
    lotId ||
    searchParams.get('cupId') ||
    searchParams.get('lotId') ||
    searchParams.get('scan') ||
    'LOT-2025-001';

  return (
    <PublicLotScanView
      lotId={activeLotId}
      onContinue={() => navigate('/')}
    />
  );
};

const MarketplaceRedirect: React.FC = () => {
  React.useEffect(() => {
    window.location.replace('https://marketplace.circulartrace.id/');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
      <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
      <h2 className="text-xl font-bold text-stone-800">Membuka Marketplace CircularTrace...</h2>
      <p className="text-sm text-stone-500 mt-1">Mengalihkan secara otomatis ke https://marketplace.circulartrace.id</p>
      <a
        href="https://marketplace.circulartrace.id/"
        className="mt-4 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold transition inline-flex items-center gap-2 shadow-md shadow-amber-600/20"
      >
        <span>Buka Marketplace Sekarang</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
};

/**
 * All Application Routes
 */
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Front-Facing Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomeOrScanRoute />} />
        <Route
          path="/marketplace"
          element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <MarketplaceRedirect />
            </main>
          }
        />
        <Route
          path="/transactions"
          element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <TransactionHistoryView />
            </main>
          }
        />
      </Route>

      {/* 2. Standalone Public Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/trace/:lotId?" element={<PublicTraceRoute />} />

      {/* 3. Admin Panel (AdminLTE 3 Layout Style) */}
      <Route path="/admin" element={<AdminLTELayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<KelompokTaniDashboard />} />
        <Route path="users" element={<MasterUsersView />} />

        {/* Layanan Petani: Standalone Pages & Dedicated Routes */}
        <Route path="petani" element={<MasterPetaniPage />} />
        <Route path="petani/tambah" element={<MasterPetaniFormPage />} />
        <Route path="petani/edit/:farmerId" element={<MasterPetaniFormPage />} />

        <Route path="kebun" element={<MasterKebunPage />} />
        <Route path="kebun/tambah" element={<MasterKebunFormPage />} />
        <Route path="kebun/edit/:farmId" element={<MasterKebunFormPage />} />
        <Route path="kebun/peta/:farmId" element={<MasterKebunMapPage />} />

        <Route path="panen" element={<MasterPanenPage />} />
        <Route path="panen/tambah" element={<MasterPanenFormPage />} />
        <Route path="panen/detail/:lotId" element={<MasterPanenDetailPage />} />

        <Route path="ledger" element={<FarmerLedgerPage />} />

        {/* Pusat Audit & Verifikasi ICT Kelompok Tani */}
        <Route path="ict" element={<IctVerificationPage />} />
        <Route path="ict/ct-dashboard" element={<CtFarmCertificationDashboardPage />} />
        <Route path="ict/ct-dashboard/:farmId" element={<CtFarmCertificationDashboardPage />} />
        <Route path="ict/audit" element={<IcsAuditSheetPage />} />
        <Route path="ict/audit/:targetType/:targetId" element={<IcsAuditSheetPage />} />

        {/* Layanan Stasiun Operasional Lainnya */}
        <Route path="pengolah" element={<ProcessorView />} />

        {/* Layanan Gudang (Warehouse QA): Standalone Pages & Dedicated Routes */}
        <Route path="gudang" element={<WarehouseInventoryPage />} />
        <Route path="gudang/inventory" element={<WarehouseInventoryPage />} />
        <Route path="gudang/pengadaan" element={<WarehouseSourcingPage />} />
        <Route path="gudang/sortir" element={<WarehouseSortingSheetPage />} />
        <Route path="gudang/sortir/:lotId" element={<WarehouseSortingSheetPage />} />

        {/* Layanan Roaster (Roastery ERP): Standalone Pages & Dedicated Routes */}
        <Route path="roaster" element={<RoasterInventoryPage />} />
        <Route path="roaster/inventory" element={<RoasterInventoryPage />} />
        <Route path="roaster/production" element={<RoasterProductionPage />} />
        <Route path="roaster/cupping" element={<RoasterCuppingSheetPage />} />
        <Route path="roaster/cupping/:lotId" element={<RoasterCuppingSheetPage />} />
        <Route path="roaster/pengadaan" element={<RoasterSourcingPage />} />
        <Route path="roaster/legacy" element={<RoasterView />} />

        {/* Marketplace Seller Panel & Monitoring Penjualan */}
        <Route path="seller" element={<MarketplaceSellerPanelPage />} />

        <Route path="cafe" element={<CafeView />} />
      </Route>

      {/* 4. Legacy Aliases & Fallbacks */}
      <Route path="/dashboard" element={<Navigate to="/admin/overview" replace />} />
      <Route path="/admin-kelompok" element={<Navigate to="/admin/overview" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <CoffeeProvider>
        <AppRoutes />
      </CoffeeProvider>
    </BrowserRouter>
  );
}

export default App;
