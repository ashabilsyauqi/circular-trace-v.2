import React, { useState, useEffect } from 'react';
import {
  X,
  Flame,
  ShoppingCart,
  Award,
  Store,
  Warehouse,
  Sprout,
  Cpu,
  Receipt,
  Search,
  CheckCircle2,
  Sliders,
  Layers,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../../types/coffee';
import { useCoffee } from '../../context/CoffeeContext';

interface AppLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  onNavigateView: (view: 'dashboard' | 'marketplace' | 'transactions') => void;
  onSelectModuleTab?: (role: UserRole, moduleTab?: string) => void;
}

export const AppLauncherModal: React.FC<AppLauncherModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  onNavigateView,
  onSelectModuleTab,
}) => {
  const { currentUser, processingBatches, purchaseOrders, warehouseLots, farmerLots, processedLots } = useCoffee();
  const [searchQuery, setSearchQuery] = useState('');

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const inProgressBatchesCount = processingBatches.filter((b) => b.status === 'in_progress').length;
  const pendingPOCount = purchaseOrders.filter((p) => p.status === 'pending_approval').length;
  const pendingWarehouseQCCount = warehouseLots.filter((l) => l.qcStatus === 'pending_qc').length;
  const availableFarmerLotsCount = farmerLots.filter((l) => l.availableWeightKg > 0).length;
  const availableGreenBeanCount = processedLots.filter((l) => l.availableWeightKg > 0).length;

  const ALL_APPS = [
    {
      id: 'processor_batches',
      name: '2. Lembar Kerja Batch (7-Stage)',
      category: 'Processing & Mill',
      subtitle: 'Worksheet 7-Stage Intake, Fermentasi, Penjemuran & Olah',
      icon: Cpu,
      gradient: 'from-blue-600 to-indigo-800',
      role: 'pengolah' as UserRole,
      moduleTab: 'batches',
      badge: inProgressBatchesCount > 0 ? `${inProgressBatchesCount} Aktif` : undefined,
    },
    {
      id: 'processor_sourcing',
      name: '1. Sourcing Ceri Petani',
      category: 'Processing & Mill',
      subtitle: 'Pengadaan & Pembelian Ceri Merah Petani',
      icon: ShoppingCart,
      gradient: 'from-amber-600 to-orange-700',
      role: 'pengolah' as UserRole,
      moduleTab: 'sourcing',
      badge: availableFarmerLotsCount > 0 ? `${availableFarmerLotsCount} Lot` : undefined,
    },
    {
      id: 'processor_selling',
      name: '4. Panel Marketplace Pengolah',
      category: 'Processing & Mill',
      subtitle: 'Katalog Green Bean, Pesanan & Laporan Margin',
      icon: Store,
      gradient: 'from-emerald-600 to-teal-800',
      role: 'pengolah' as UserRole,
      moduleTab: 'selling',
      badge: availableGreenBeanCount > 0 ? `${availableGreenBeanCount} Siap Jual` : undefined,
    },
    {
      id: 'processor_inventory',
      name: '3. Gudang & Sirkularitas Limbah',
      category: 'Processing & Mill',
      subtitle: 'Stok Green Bean & Pengolahan Limbah Cascara/Pulp',
      icon: Warehouse,
      gradient: 'from-cyan-600 to-blue-700',
      role: 'pengolah' as UserRole,
      moduleTab: 'inventory',
    },
    {
      id: 'roaster_work_orders',
      name: 'Roastery MRP (Sangrai)',
      category: 'Roasting & Manufaktur',
      subtitle: 'Work Orders Sangrai, Roast Profil & Batch Schedule',
      icon: Flame,
      gradient: 'from-amber-500 to-orange-600',
      role: 'roaster' as UserRole,
      moduleTab: 'work_orders',
    },
    {
      id: 'roaster_qc',
      name: 'Quality Control (Cupping Lab)',
      category: 'Roasting & Manufaktur',
      subtitle: 'SCA 100-pt Cupping Evaluation & Fragrance Radar',
      icon: Award,
      gradient: 'from-purple-600 to-pink-700',
      role: 'roaster' as UserRole,
      moduleTab: 'qc',
    },
    {
      id: 'roaster_purchasing',
      name: 'Pengadaan PO Roastery',
      category: 'Roasting & Manufaktur',
      subtitle: 'Purchase Orders & Pembelian Green Bean',
      icon: ShoppingCart,
      gradient: 'from-blue-600 to-sky-700',
      role: 'roaster' as UserRole,
      moduleTab: 'purchasing',
      badge: pendingPOCount > 0 ? `${pendingPOCount} Pending` : undefined,
    },
    {
      id: 'farmer_hub',
      name: 'Kebun & Pertanian (Farmer)',
      category: 'Hulu (Farm & Harvest)',
      subtitle: 'Pencatatan Panen Ceri, HPP Kebun & QR Traceability',
      icon: Sprout,
      gradient: 'from-lime-600 to-emerald-700',
      role: 'petani' as UserRole,
    },
    {
      id: 'warehouse_hub',
      name: 'Gudang Logistik & Silo Hub',
      category: 'Supply Chain QA',
      subtitle: 'Inspeksi Masuk, FIFO Silo & Kontrol Kelembaban',
      icon: Warehouse,
      gradient: 'from-slate-700 to-slate-900',
      role: 'gudang' as UserRole,
      badge: pendingWarehouseQCCount > 0 ? `${pendingWarehouseQCCount} QC` : undefined,
    },
    {
      id: 'cafe_pos',
      name: 'Point of Sale & Cafe Barista',
      category: 'Hilir (Retail & Cafe)',
      subtitle: 'Terminal Kasir POS, Barista Brew Log & Penjualan Retail',
      icon: Store,
      gradient: 'from-rose-600 to-red-700',
      role: 'cafe' as UserRole,
    },
    {
      id: 'marketplace_public',
      name: 'Marketplace Bersama',
      category: 'Cross-Chain Trade',
      subtitle: 'Etalase Perdagangan Komoditas Kopi Lintas Stakeholder',
      icon: Sparkles,
      gradient: 'from-emerald-500 to-green-700',
      action: 'marketplace' as const,
    },
    {
      id: 'ledger_public',
      name: 'Buku Besar Blockchain Ledger',
      category: 'Audit & Compliance',
      subtitle: 'Audit Trail Transaksi & Pelacakan Sirkularitas',
      icon: Receipt,
      gradient: 'from-indigo-700 to-purple-900',
      action: 'transactions' as const,
    },
  ];

  const filteredApps = ALL_APPS.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(q) ||
      app.subtitle.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q)
    );
  });

  const handleAppClick = (app: (typeof ALL_APPS)[0]) => {
    if (app.action) {
      onNavigateView(app.action);
    } else if (app.role) {
      onSelectRole(app.role);
      onNavigateView('dashboard');
      if (app.moduleTab) {
        onSelectModuleTab?.(app.role, app.moduleTab);
      }
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 p-4 sm:p-8 flex flex-col items-center justify-start overflow-y-auto"
      style={{
        background: 'linear-gradient(135deg, #140D09 0%, #24160E 50%, #18100B 100%)',
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-5 right-5 text-amber-100/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors cursor-pointer border border-white/15 shadow-lg z-50"
        title="Tutup Menu (ESC)"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header: Logo & Subtitle */}
      <div className="text-center mt-4 sm:mt-8 mb-4 max-w-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 backdrop-blur-md text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-2xl">
          <Cpu className="w-9 h-9" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
          <span className="text-amber-400">Circular</span>Trace ERP
        </h2>
        <p className="text-amber-200/80 text-xs sm:text-sm mt-1 font-medium">
          Sistem Terintegrasi Rantai Pasok Kopi &amp; Lembar Kerja Pengolahan Sirkular
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-lg mb-8 relative">
        <Search className="w-5 h-5 text-amber-200/50 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          autoFocus
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Apps... (Ketik nama modul, e.g. Lembar Kerja, Roasting, Sourcing)"
          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-amber-500/20 rounded-2xl text-white text-sm placeholder-amber-100/40 focus:bg-white/15 focus:outline-hidden focus:ring-2 focus:ring-amber-400 transition-all shadow-xl"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-200/60 hover:text-white text-xs font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* App Grid Matrix */}
      <div className="max-w-5xl w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 pb-12">
        {filteredApps.map((app) => {
          const IconComp = app.icon;
          return (
            <button
              key={app.id}
              onClick={() => handleAppClick(app)}
              className="group relative flex flex-col items-center text-center p-5 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
            >
              {/* Tile Icon with Vibrant Gradient */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${app.gradient} text-white flex items-center justify-center shadow-lg mb-3 transition-transform group-hover:scale-110`}
              >
                <IconComp className="w-7 h-7" />
              </div>

              {/* Title & Category */}
              <span className="text-[10px] uppercase font-bold text-amber-400/80 tracking-wider mb-0.5">
                {app.category}
              </span>
              <h3 className="font-bold text-sm text-white leading-tight group-hover:text-amber-300 transition-colors">
                {app.name}
              </h3>
              <p className="text-[11px] text-stone-300/70 mt-1 leading-snug line-clamp-2">
                {app.subtitle}
              </p>

              {/* Badge */}
              {app.badge && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white shadow-xs">
                  {app.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-auto py-3 text-center text-xs text-amber-200/60 font-mono">
        Tekan <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-white text-[10px]">ESC</kbd> untuk kembali ke aplikasi &bull; Logged as <strong>{currentUser?.name}</strong> ({currentUser?.role})
      </div>
    </div>
  );
};

