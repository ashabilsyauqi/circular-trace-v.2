import React from 'react';
import {
  X,
  Flame,
  ShoppingCart,
  Layers,
  Award,
  Store,
  Warehouse,
  Sprout,
  Cpu,
  Receipt,
  Sparkles,
  Bot,
  Activity,
  ShieldCheck,
  Grid,
} from 'lucide-react';
import { UserRole } from '../../types/coffee';
import { useCoffee } from '../../context/CoffeeContext';

interface OdooAppSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  onNavigateView: (view: 'dashboard' | 'marketplace' | 'transactions') => void;
}

export const OdooAppSwitcherModal: React.FC<OdooAppSwitcherModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  onNavigateView,
}) => {
  const { currentUser } = useCoffee();

  if (!isOpen) return null;

  const APPS = [
    {
      id: 'roaster',
      title: 'Roastery MRP',
      subtitle: 'Manufacturing & Work Orders',
      icon: <Flame className="w-8 h-8 text-amber-500" />,
      bg: 'bg-gradient-to-br from-amber-500/10 to-amber-600/20 text-amber-600 border-amber-500/30',
      glow: 'group-hover:ring-amber-400',
      role: 'roaster' as UserRole,
      badge: 'ERP Core',
    },
    {
      id: 'purchasing',
      title: 'Purchase & Sourcing',
      subtitle: 'PO, Suppliers & Samples',
      icon: <ShoppingCart className="w-8 h-8 text-blue-500" />,
      bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/20 text-blue-600 border-blue-500/30',
      glow: 'group-hover:ring-blue-400',
      role: 'roaster' as UserRole,
      badge: 'Procurement',
    },
    {
      id: 'inventory',
      title: 'Inventory & Silo',
      subtitle: 'Green Coffee & FIFO Lots',
      icon: <Warehouse className="w-8 h-8 text-emerald-500" />,
      bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 text-emerald-600 border-emerald-500/30',
      glow: 'group-hover:ring-emerald-400',
      role: 'gudang' as UserRole,
      badge: 'Stock QA',
    },
    {
      id: 'quality',
      title: 'Quality Control (QC)',
      subtitle: 'SCA 100-pt Cupping Lab',
      icon: <Award className="w-8 h-8 text-purple-500" />,
      bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/20 text-purple-600 border-purple-500/30',
      glow: 'group-hover:ring-purple-400',
      role: 'roaster' as UserRole,
      badge: 'Q-Grader',
    },
    {
      id: 'selling',
      title: 'Sales & Wholesale',
      subtitle: 'B2B Customers & Orders',
      icon: <Store className="w-8 h-8 text-orange-500" />,
      bg: 'bg-gradient-to-br from-orange-500/10 to-orange-600/20 text-orange-600 border-orange-500/30',
      glow: 'group-hover:ring-orange-400',
      role: 'roaster' as UserRole,
      badge: 'CRM',
    },
    {
      id: 'cafe',
      title: 'Point of Sale (Cafe)',
      subtitle: 'Barista Bar & Retail Pack',
      icon: <Store className="w-8 h-8 text-teal-500" />,
      bg: 'bg-gradient-to-br from-teal-500/10 to-teal-600/20 text-teal-600 border-teal-500/30',
      glow: 'group-hover:ring-teal-400',
      role: 'cafe' as UserRole,
      badge: 'POS',
    },
    {
      id: 'farmer',
      title: 'Agriculture (Kebun)',
      subtitle: 'Harvest Lots & Farm HPP',
      icon: <Sprout className="w-8 h-8 text-lime-600" />,
      bg: 'bg-gradient-to-br from-lime-500/10 to-lime-600/20 text-lime-600 border-lime-500/30',
      glow: 'group-hover:ring-lime-400',
      role: 'petani' as UserRole,
      badge: 'Harvest',
    },
    {
      id: 'processor',
      title: 'Processing Mill',
      subtitle: 'Fermentation & Bio-Circular',
      icon: <Cpu className="w-8 h-8 text-cyan-600" />,
      bg: 'bg-gradient-to-br from-cyan-500/10 to-cyan-600/20 text-cyan-600 border-cyan-500/30',
      glow: 'group-hover:ring-cyan-400',
      role: 'pengolah' as UserRole,
      badge: 'Eco Mill',
    },
    {
      id: 'marketplace',
      title: 'Marketplace Hub',
      subtitle: 'Unified Supply Chain Exchange',
      icon: <ShoppingCart className="w-8 h-8 text-rose-500" />,
      bg: 'bg-gradient-to-br from-rose-500/10 to-rose-600/20 text-rose-600 border-rose-500/30',
      glow: 'group-hover:ring-rose-400',
      action: 'marketplace',
      badge: 'E-Commerce',
    },
    {
      id: 'ledger',
      title: 'Blockchain Ledger',
      subtitle: 'Supply Chain Audit Trail',
      icon: <Receipt className="w-8 h-8 text-indigo-500" />,
      bg: 'bg-gradient-to-br from-indigo-500/10 to-indigo-600/20 text-indigo-600 border-indigo-500/30',
      glow: 'group-hover:ring-indigo-400',
      action: 'transactions',
      badge: 'Ledger',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2C1D27]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200/90 overflow-hidden my-8 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#714B67] text-white flex items-center justify-center font-black shadow-md">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-stone-900">Odoo 19 App Launcher</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#714B67]/10 text-[#714B67] text-[10px] font-bold border border-[#714B67]/20">
                  CCT Enterprise Ecosystem
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Pilih modul aplikasi untuk beralih konteks operasional secara instan.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Apps Grid Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                if (app.action === 'marketplace') {
                  onNavigateView('marketplace');
                } else if (app.action === 'transactions') {
                  onNavigateView('transactions');
                } else if (app.role) {
                  onSelectRole(app.role);
                  onNavigateView('dashboard');
                }
                onClose();
              }}
              className="group relative flex flex-col items-center text-center p-4 rounded-2xl border border-stone-200/70 bg-[#F8F9FA] hover:bg-white hover:shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-[#714B67]/30"
            >
              {/* App Icon Squircle */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-200 group-hover:scale-105 shadow-xs mb-3 ${app.bg}`}
              >
                {app.icon}
              </div>

              {/* Title & Subtitle */}
              <h4 className="font-bold text-xs text-stone-900 leading-tight group-hover:text-[#714B67] transition-colors">
                {app.title}
              </h4>
              <p className="text-[10px] text-stone-400 mt-1 line-clamp-1">
                {app.subtitle}
              </p>

              {/* Pill badge */}
              <span className="mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-stone-600 border border-stone-200 shadow-2xs">
                {app.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>Pengguna Aktif: <strong className="text-stone-900">{currentUser?.name}</strong> ({currentUser?.organization})</span>
          <span className="text-[11px] text-[#714B67] font-semibold">Odoo 19 ERP Edition • CCT Traceability Engine</span>
        </div>
      </div>
    </div>
  );
};
