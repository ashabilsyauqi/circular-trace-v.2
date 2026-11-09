import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Flame,
  Award,
  Store,
  Warehouse,
  Sprout,
  Receipt,
  Search,
  Sliders,
  QrCode,
  Crown,
  Coffee,
  ShieldCheck,
} from 'lucide-react';
import { UserRole } from '../../types/coffee';
import { useCoffee } from '../../context/CoffeeContext';

interface AppLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole?: (role: UserRole) => void;
  onNavigateView?: (view: any) => void;
  onSelectModuleTab?: (role: UserRole, moduleTab?: string) => void;
}

interface AppTileItem {
  id: string;
  name: string;
  keywords: string[];
  role?: UserRole;
  view?: string;
  routeTarget: {
    view: 'dashboard' | 'marketplace' | 'transactions' | 'scan' | 'ct4ci' | 'subscription';
    service?: string;
    subRoute?: string;
  };
  icon: React.ElementType;
  iconColor: string;
  bgGlow: string;
  badge?: number;
  badgeLabel?: string;
}

export const AppLauncherModal: React.FC<AppLauncherModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
}) => {
  const {
    currentUser,
    loginAsRole,
    navigate,
    processingBatches,
    purchaseOrders,
    warehouseLots,
    farmerLots,
    processedLots,
    cafeProducts,
  } = useCoffee();

  const [searchQuery, setSearchQuery] = useState('');

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset search query whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const activeBatchesCount = processingBatches.filter((b) => b.status === 'in_progress').length;
  const pendingPOCount = purchaseOrders.filter((p) => p.status === 'pending_approval').length;
  const warehouseLotsCount = warehouseLots.length;
  const farmerLotsCount = farmerLots.length;
  const isSuperAdmin = currentUser?.role === 'superadmin';

  // Dynamic resolution for personal seller panel based on currentUser role
  const getSellerPanelTarget = (role?: string) => {
    switch (role) {
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
      case 'verifikator':
      case 'superadmin':
      default:
        return { view: 'dashboard' as const, service: 'petani', subRoute: 'catalog' };
    }
  };

  // Dynamic resolution for personal ledger based on currentUser role
  const getLedgerTarget = (role?: string) => {
    switch (role) {
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
      case 'verifikator':
      case 'superadmin':
      default:
        return { view: 'dashboard' as const, service: 'petani', subRoute: 'history' };
    }
  };

  // 12 Dedicated App Tiles (matching Gambar 3 Snaprint App Launcher)
  const appTiles: AppTileItem[] = useMemo(
    () => [
      {
        id: 'petani',
        name: 'Petani',
        keywords: ['petani', 'kebun', 'lahan', 'panen', 'ceri', 'poktan'],
        role: 'petani',
        routeTarget: { view: 'dashboard', service: 'petani', subRoute: 'farms' },
        icon: Sprout,
        iconColor: 'text-lime-400',
        bgGlow: 'group-hover:bg-lime-500/20 group-hover:border-lime-400/50',
        badge: farmerLotsCount > 0 ? farmerLotsCount : undefined,
      },
      {
        id: 'pengolah',
        name: 'Pengolah',
        keywords: ['pengolah', 'mill', 'wet', 'dry', 'fermentasi', 'batch'],
        role: 'pengolah',
        routeTarget: { view: 'dashboard', service: 'pengolah', subRoute: 'sourcing' },
        icon: Flame,
        iconColor: 'text-amber-400',
        bgGlow: 'group-hover:bg-amber-500/20 group-hover:border-amber-400/50',
        badge: activeBatchesCount > 0 ? activeBatchesCount : undefined,
      },
      {
        id: 'gudang',
        name: 'Gudang',
        keywords: ['gudang', 'warehouse', 'stok', 'hermetik', 'klimatik'],
        role: 'gudang',
        routeTarget: { view: 'dashboard', service: 'gudang', subRoute: 'inventory' },
        icon: Warehouse,
        iconColor: 'text-amber-300',
        bgGlow: 'group-hover:bg-amber-500/20 group-hover:border-amber-400/50',
        badge: warehouseLotsCount > 0 ? warehouseLotsCount : undefined,
      },
      {
        id: 'roaster',
        name: 'Roaster',
        keywords: ['roaster', 'sangrai', 'cupping', 'spk', 'profil', 'sca'],
        role: 'roaster',
        routeTarget: { view: 'dashboard', service: 'roaster', subRoute: 'purchasing' },
        icon: Coffee,
        iconColor: 'text-amber-500',
        bgGlow: 'group-hover:bg-amber-600/20 group-hover:border-amber-500/50',
        badge: pendingPOCount > 0 ? pendingPOCount : undefined,
      },
      {
        id: 'cafe',
        name: 'Kafe',
        keywords: ['cafe', 'kafe', 'bar', 'espresso', 'menu', 'pos', 'hpp'],
        role: 'cafe',
        routeTarget: { view: 'dashboard', service: 'cafe', subRoute: 'inventory' },
        icon: Store,
        iconColor: 'text-rose-400',
        bgGlow: 'group-hover:bg-rose-500/20 group-hover:border-rose-400/50',
        badge: cafeProducts.length > 0 ? cafeProducts.length : undefined,
      },
      {
        id: 'verifikator',
        name: 'Verifikator',
        keywords: ['verifikator', 'audit', 'eudr', 'stempel', 'sertifikasi', 'mutu'],
        role: 'verifikator',
        routeTarget: { view: 'dashboard', service: 'verifikator', subRoute: 'petani' },
        icon: ShieldCheck,
        iconColor: 'text-emerald-400',
        bgGlow: 'group-hover:bg-emerald-500/20 group-hover:border-emerald-400/50',
      },
      {
        id: 'trace',
        name: 'Paspor QR',
        keywords: ['trace', 'scan', 'paspor', 'qr', 'silsilah', 'lot', 'cangkir'],
        routeTarget: { view: 'scan' },
        icon: QrCode,
        iconColor: 'text-cyan-400',
        bgGlow: 'group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50',
      },
      {
        id: 'seller_panel',
        name: 'Panel Seller',
        keywords: ['seller', 'panel', 'toko', 'katalog', 'jual', 'pasar', 'penjualan', 'ceri', 'greenbean'],
        role: (!currentUser || currentUser.role === 'verifikator' || currentUser.role === 'superadmin') ? 'petani' : (currentUser.role as UserRole),
        routeTarget: getSellerPanelTarget(currentUser?.role),
        icon: Store,
        iconColor: 'text-emerald-400',
        bgGlow: 'group-hover:bg-emerald-500/20 group-hover:border-emerald-400/50',
        badge: farmerLotsCount > 0 ? farmerLotsCount : undefined,
      },
      {
        id: 'transactions',
        name: 'Buku Kas & Ledger',
        keywords: ['transaksi', 'ledger', 'buku kas', 'keuangan', 'history', 'omzet'],
        role: (!currentUser || currentUser.role === 'verifikator' || currentUser.role === 'superadmin') ? 'petani' : (currentUser.role as UserRole),
        routeTarget: getLedgerTarget(currentUser?.role),
        icon: Receipt,
        iconColor: 'text-indigo-400',
        bgGlow: 'group-hover:bg-indigo-500/20 group-hover:border-indigo-400/50',
      },
      {
        id: 'ct4ci',
        name: 'Standar 4C',
        keywords: ['ct4ci', '4c', 'keberlanjutan', 'sertifikasi', 'audit kebun'],
        routeTarget: { view: 'ct4ci' },
        icon: Award,
        iconColor: 'text-yellow-400',
        bgGlow: 'group-hover:bg-yellow-500/20 group-hover:border-yellow-400/50',
      },
      {
        id: 'subscription',
        name: 'Langganan',
        keywords: ['subscription', 'langganan', 'sewa', 'paket', 'billing', 'upgrade'],
        routeTarget: { view: 'subscription' },
        icon: Crown,
        iconColor: 'text-amber-300',
        bgGlow: 'group-hover:bg-amber-400/20 group-hover:border-amber-300/50',
      },
      {
        id: isSuperAdmin ? 'superadmin' : 'profil_mitra',
        name: isSuperAdmin ? 'Admin' : 'Profil Mitra',
        keywords: ['admin', 'profil', 'mitra', 'master data', 'poktan', 'organisasi'],
        routeTarget: isSuperAdmin
          ? { view: 'dashboard', service: 'superadmin', subRoute: 'approvals' }
          : { view: 'dashboard', service: currentUser?.role || 'petani', subRoute: 'farms' },
        icon: Sliders,
        iconColor: 'text-purple-400',
        bgGlow: 'group-hover:bg-purple-500/20 group-hover:border-purple-400/50',
      },
    ],
    [
      farmerLotsCount,
      activeBatchesCount,
      warehouseLotsCount,
      pendingPOCount,
      cafeProducts.length,
      processedLots.length,
      currentUser?.role,
      isSuperAdmin,
    ]
  );

  // Filter tiles based on search query
  const filteredTiles = useMemo(() => {
    if (!searchQuery.trim()) return appTiles;
    const q = searchQuery.toLowerCase().trim();
    return appTiles.filter(
      (tile) =>
        tile.name.toLowerCase().includes(q) ||
        tile.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  }, [appTiles, searchQuery]);

  const handleTileClick = (tile: AppTileItem) => {
    if (tile.role) {
      if (onSelectRole) {
        onSelectRole(tile.role);
      }
      loginAsRole(tile.role);
    }
    navigate(tile.routeTarget);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark Coffee Glass Backdrop */}
      <div
        className="fixed inset-0 bg-[#0E0805]/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Main Container matching Gambar 3 (Snaprint reference) */}
      <div className="relative w-full max-w-3xl bg-[#160E0A] border border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 text-stone-100 flex flex-col items-center">
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/5"
          title="Tutup (ESC)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Center Logo & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-950/60 mb-3 border border-amber-400/30">
            <Coffee className="w-6 h-6 text-stone-950 stroke-[2.2]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 font-['Poppins']">
            <span>Circular</span>
            <span className="text-amber-400">Coffee</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-xs sm:max-w-md font-['Poppins']">
            Panel Stasiun Kerja &amp; Master Data Rantai Pasok Mandiri
          </p>
        </div>

        {/* Center Search Bar (Pill with search icon) */}
        <div className="w-full max-w-md relative mb-8">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Apps... (Ketik nama modul)"
            autoFocus
            className="w-full bg-[#20140E] text-stone-100 placeholder-stone-500 border border-stone-800 focus:border-amber-500/80 focus:bg-[#281A12] rounded-full py-2.5 pl-11 pr-10 text-xs font-medium outline-hidden transition-all shadow-inner font-['Poppins']"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Main Grid of Clean Icon Tiles */}
        <div className="w-full">
          {filteredTiles.length === 0 ? (
            <div className="py-12 text-center text-stone-500 text-xs font-['Poppins']">
              Tidak ada modul yang cocok dengan &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-y-6 gap-x-4 sm:gap-x-6 justify-items-center">
              {filteredTiles.map((tile) => {
                const IconComponent = tile.icon;
                const isCurrentActive =
                  currentUser?.role === tile.role ||
                  (tile.id === 'superadmin' && isSuperAdmin);

                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => handleTileClick(tile)}
                    className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-hidden transition-transform active:scale-95"
                    title={tile.name}
                  >
                    {/* Rounded Square Tile */}
                    <div
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#221610] border transition-all duration-200 flex items-center justify-center shadow-md group-hover:scale-105 ${tile.bgGlow} ${
                        isCurrentActive
                          ? 'border-amber-400/80 bg-[#2C1D15] ring-2 ring-amber-400/30'
                          : 'border-stone-800/80'
                      }`}
                    >
                      <IconComponent
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110 duration-200 ${tile.iconColor}`}
                      />

                      {/* Notification Count Badge */}
                      {tile.badge !== undefined && tile.badge > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black shadow-md border border-stone-950">
                          {tile.badge}
                        </span>
                      )}
                    </div>

                    {/* Clean Label Below */}
                    <span
                      className={`text-xs font-semibold truncate max-w-[85px] text-center transition-colors font-['Poppins'] ${
                        isCurrentActive
                          ? 'text-amber-300 font-bold'
                          : 'text-stone-300 group-hover:text-white'
                      }`}
                    >
                      {tile.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Subtle Footer info */}
        <div className="mt-8 pt-4 border-t border-stone-800/70 w-full flex items-center justify-between text-[11px] text-stone-500 font-['Poppins']">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              Aktif: <strong className="text-stone-300">{currentUser?.name || 'Mitra'}</strong> (
              {currentUser?.organization || currentUser?.role || 'Pengguna'}) &bull; Panel Seller &amp; Master Data Mandiri
            </span>
          </div>
          <span className="hidden sm:inline font-mono text-[10px] text-stone-500">
            ESC untuk menutup
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppLauncherModal;
