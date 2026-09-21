import React from 'react';
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
  Grid,
  ArrowRight,
  ArrowDown,
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

  // Ordered to match the real end-to-end supply chain flow (petani → pengolah → gudang →
  // roaster beli → sangrai → QC → jual), so the launcher doubles as a process map, not just
  // an alphabetical app grid. Arrows are drawn between consecutive cards below.
  const FLOW_APPS = [
    {
      id: 'farmer',
      title: 'Agriculture (Kebun)',
      subtitle: 'Harvest Lots & Farm HPP',
      icon: <Sprout className="w-8 h-8 text-lime-600" />,
      bg: 'bg-gradient-to-br from-lime-500/10 to-lime-600/20 text-lime-600 border-lime-500/30',
      role: 'petani' as UserRole,
      badge: 'Harvest',
    },
    {
      id: 'processor',
      title: 'Processing Mill',
      subtitle: 'Fermentation & Bio-Circular',
      icon: <Cpu className="w-8 h-8 text-cyan-600" />,
      bg: 'bg-gradient-to-br from-cyan-500/10 to-cyan-600/20 text-cyan-600 border-cyan-500/30',
      role: 'pengolah' as UserRole,
      badge: 'Eco Mill',
    },
    {
      id: 'inventory',
      title: 'Inventory & Silo',
      subtitle: 'Green Coffee & FIFO Lots',
      icon: <Warehouse className="w-8 h-8 text-emerald-500" />,
      bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 text-emerald-600 border-emerald-500/30',
      role: 'gudang' as UserRole,
      badge: 'Stock QA',
    },
    {
      id: 'purchasing',
      title: 'Purchase & Sourcing',
      subtitle: 'PO, Suppliers & Samples',
      icon: <ShoppingCart className="w-8 h-8 text-blue-500" />,
      bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/20 text-blue-600 border-blue-500/30',
      role: 'roaster' as UserRole,
      badge: 'Procurement',
    },
    {
      id: 'roaster',
      title: 'Roastery MRP',
      subtitle: 'Manufacturing & Work Orders',
      icon: <Flame className="w-8 h-8 text-amber-500" />,
      bg: 'bg-gradient-to-br from-amber-500/10 to-amber-600/20 text-amber-600 border-amber-500/30',
      role: 'roaster' as UserRole,
      badge: 'ERP Core',
    },
    {
      id: 'quality',
      title: 'Quality Control (QC)',
      subtitle: 'SCA 100-pt Cupping Lab',
      icon: <Award className="w-8 h-8 text-purple-500" />,
      bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/20 text-purple-600 border-purple-500/30',
      role: 'roaster' as UserRole,
      badge: 'Q-Grader',
    },
    {
      id: 'selling',
      title: 'Sales & Wholesale',
      subtitle: 'B2B Customers & Orders',
      icon: <Store className="w-8 h-8 text-orange-500" />,
      bg: 'bg-gradient-to-br from-orange-500/10 to-orange-600/20 text-orange-600 border-orange-500/30',
      role: 'roaster' as UserRole,
      badge: 'CRM',
    },
    {
      id: 'cafe',
      title: 'Point of Sale (Cafe)',
      subtitle: 'Barista Bar & Retail Pack',
      icon: <Store className="w-8 h-8 text-teal-500" />,
      bg: 'bg-gradient-to-br from-teal-500/10 to-teal-600/20 text-teal-600 border-teal-500/30',
      role: 'cafe' as UserRole,
      badge: 'POS',
    },
  ];

  // Cross-cutting tools that sit outside the linear flow — usable from any point in the chain.
  const TOOL_APPS = [
    {
      id: 'marketplace',
      title: 'Marketplace Hub',
      subtitle: 'Unified Supply Chain Exchange',
      icon: <ShoppingCart className="w-7 h-7 text-rose-500" />,
      bg: 'bg-gradient-to-br from-rose-500/10 to-rose-600/20 text-rose-600 border-rose-500/30',
      action: 'marketplace' as const,
      badge: 'E-Commerce',
    },
    {
      id: 'ledger',
      title: 'Blockchain Ledger',
      subtitle: 'Supply Chain Audit Trail',
      icon: <Receipt className="w-7 h-7 text-indigo-500" />,
      bg: 'bg-gradient-to-br from-indigo-500/10 to-indigo-600/20 text-indigo-600 border-indigo-500/30',
      action: 'transactions' as const,
      badge: 'Ledger',
    },
  ];

  const handleFlowClick = (role: UserRole) => {
    onSelectRole(role);
    onNavigateView('dashboard');
    onClose();
  };

  const handleToolClick = (action: 'marketplace' | 'transactions') => {
    onNavigateView(action);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2C1D27]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-stone-200/90 overflow-hidden my-8 p-6 sm:p-8">
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
                  sangrAI Enterprise Ecosystem
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

        {/* Supply Chain Flow: Farm -> Mill -> Warehouse -> Purchasing -> Roastery -> QC -> Sales -> Cafe */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider">
            Alur Rantai Pasok (Hulu → Hilir)
          </span>
          <span className="h-px flex-1 bg-stone-100"></span>
        </div>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-4">
          {FLOW_APPS.map((app, idx) => (
            <React.Fragment key={app.id}>
              <button
                onClick={() => handleFlowClick(app.role)}
                className="group relative flex flex-col items-center text-center p-4 rounded-2xl border border-stone-200/70 bg-[#F8F9FA] hover:bg-white hover:shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-[#714B67]/30 w-[132px] sm:w-[140px] shrink-0"
              >
                {/* Flow step number */}
                <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] font-black flex items-center justify-center shadow-sm border-2 border-white">
                  {idx + 1}
                </span>

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

              {/* Flow arrow to the next step (hidden after the last card) */}
              {idx < FLOW_APPS.length - 1 && (
                <ArrowRight className="w-4 h-4 text-stone-300 shrink-0 hidden sm:block" />
              )}
              {idx < FLOW_APPS.length - 1 && (
                <ArrowDown className="w-4 h-4 text-stone-300 shrink-0 sm:hidden mx-auto" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Cross-cutting tools: usable from any point in the flow, not part of the linear sequence */}
        <div className="mt-7 mb-2 flex items-center gap-2">
          <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider">
            Alat Lintas Rantai Pasok
          </span>
          <span className="h-px flex-1 bg-stone-100"></span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md">
          {TOOL_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => handleToolClick(app.action)}
              className="group relative flex flex-col items-center text-center p-4 rounded-2xl border border-stone-200/70 bg-[#F8F9FA] hover:bg-white hover:shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-[#714B67]/30"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-200 group-hover:scale-105 shadow-xs mb-3 ${app.bg}`}
              >
                {app.icon}
              </div>
              <h4 className="font-bold text-xs text-stone-900 leading-tight group-hover:text-[#714B67] transition-colors">
                {app.title}
              </h4>
              <p className="text-[10px] text-stone-400 mt-1 line-clamp-1">
                {app.subtitle}
              </p>
              <span className="mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-stone-600 border border-stone-200 shadow-2xs">
                {app.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>Pengguna Aktif: <strong className="text-stone-900">{currentUser?.name}</strong> ({currentUser?.organization})</span>
          <span className="text-[11px] text-[#714B67] font-semibold">Odoo 19 ERP Edition • sangrAI Traceability Engine</span>
        </div>
      </div>
    </div>
  );
};
