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
} from 'lucide-react';
import { UserRole } from '../../types/coffee';
import { useCoffee } from '../../context/CoffeeContext';

interface AppLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  onNavigateView: (view: 'dashboard' | 'marketplace' | 'transactions') => void;
  // Optional: for roles with their own internal module tabs (roaster, pengolah), jump straight
  // to the specific module that was clicked instead of just landing on the role's dashboard.
  onSelectModuleTab?: (role: UserRole, moduleTab?: string) => void;
}

export const AppLauncherModal: React.FC<AppLauncherModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  onNavigateView,
  onSelectModuleTab,
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
      moduleTab: undefined,
      badge: 'Harvest',
    },
    {
      id: 'processor',
      title: 'Processing Mill',
      subtitle: 'Fermentation & Bio-Circular',
      icon: <Cpu className="w-8 h-8 text-cyan-600" />,
      bg: 'bg-gradient-to-br from-cyan-500/10 to-cyan-600/20 text-cyan-600 border-cyan-500/30',
      role: 'pengolah' as UserRole,
      moduleTab: 'sourcing',
      badge: 'Eco Mill',
    },
    {
      id: 'inventory',
      title: 'Inventory & Silo',
      subtitle: 'Green Coffee & FIFO Lots',
      icon: <Warehouse className="w-8 h-8 text-emerald-500" />,
      bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 text-emerald-600 border-emerald-500/30',
      role: 'gudang' as UserRole,
      moduleTab: undefined,
      badge: 'Stock QA',
    },
    {
      id: 'purchasing',
      title: 'Purchase & Sourcing',
      subtitle: 'PO, Suppliers & Samples',
      icon: <ShoppingCart className="w-8 h-8 text-blue-500" />,
      bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/20 text-blue-600 border-blue-500/30',
      role: 'roaster' as UserRole,
      moduleTab: 'purchasing',
      badge: 'Procurement',
    },
    {
      id: 'roaster',
      title: 'Roastery MRP',
      subtitle: 'Manufacturing & Work Orders',
      icon: <Flame className="w-8 h-8 text-amber-500" />,
      bg: 'bg-gradient-to-br from-amber-500/10 to-amber-600/20 text-amber-600 border-amber-500/30',
      role: 'roaster' as UserRole,
      moduleTab: 'work_orders',
      badge: 'ERP Core',
    },
    {
      id: 'quality',
      title: 'Quality Control (QC)',
      subtitle: 'SCA 100-pt Cupping Lab',
      icon: <Award className="w-8 h-8 text-purple-500" />,
      bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/20 text-purple-600 border-purple-500/30',
      role: 'roaster' as UserRole,
      moduleTab: 'qc',
      badge: 'Q-Grader',
    },
    {
      id: 'selling',
      title: 'Sales & Wholesale',
      subtitle: 'B2B Customers & Orders',
      icon: <Store className="w-8 h-8 text-orange-500" />,
      bg: 'bg-gradient-to-br from-orange-500/10 to-orange-600/20 text-orange-600 border-orange-500/30',
      role: 'roaster' as UserRole,
      moduleTab: 'selling',
      badge: 'CRM',
    },
    {
      id: 'cafe',
      title: 'Point of Sale (Cafe)',
      subtitle: 'Barista Bar & Retail Pack',
      icon: <Store className="w-8 h-8 text-teal-500" />,
      bg: 'bg-gradient-to-br from-teal-500/10 to-teal-600/20 text-teal-600 border-teal-500/30',
      role: 'cafe' as UserRole,
      moduleTab: undefined,
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

  // Only show the modules that belong to the logged-in user's own role — e.g. a roaster only
  // sees their purchase -> roast -> QC -> sell flow, not the farmer's or the cafe's modules.
  const visibleFlowApps = currentUser
    ? FLOW_APPS.filter((app) => app.role === currentUser.role)
    : FLOW_APPS;

  const handleFlowClick = (role: UserRole, moduleTab?: string) => {
    onSelectRole(role);
    onNavigateView('dashboard');
    onSelectModuleTab?.(role, moduleTab);
    onClose();
  };

  const handleToolClick = (action: 'marketplace' | 'transactions') => {
    onNavigateView(action);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF7F2] rounded-[2rem] max-w-3xl w-full shadow-2xl border border-stone-200/90 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 sm:px-8 pt-6 sm:pt-7 pb-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-stone-950 text-amber-400 flex items-center justify-center shadow-md shrink-0">
              <Grid className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-black text-stone-900 leading-tight">Modul Kamu</h2>
              <p className="text-xs text-stone-500 mt-0.5 truncate">
                Pilih modul untuk mulai bekerja, {currentUser?.name?.split(' ')[0] || 'halo'}.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-stone-100 text-stone-500 hover:text-stone-800 border border-stone-200 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="px-6 sm:px-8 pb-6 sm:pb-8 max-h-[75vh] overflow-y-auto">
          {/* Your modules: big, friendly cards — role-filtered, so this is a short, clear list */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {visibleFlowApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleFlowClick(app.role, app.moduleTab)}
                className="group flex flex-col items-start text-left p-4 rounded-3xl border border-stone-200/80 bg-white hover:shadow-lg hover:border-amber-300 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-200 group-hover:scale-105 shadow-xs mb-3 ${app.bg}`}
                >
                  {app.icon}
                </div>
                <h4 className="font-bold text-sm text-stone-900 leading-tight group-hover:text-amber-700 transition-colors">
                  {app.title}
                </h4>
                <p className="text-[11px] text-stone-500 mt-1 leading-snug line-clamp-2">
                  {app.subtitle}
                </p>
              </button>
            ))}
          </div>

          {/* Cross-cutting tools: usable from any point in the flow, not part of the linear sequence */}
          <div className="mt-7 mb-3 flex items-center gap-2">
            <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider">
              Alat Lainnya
            </span>
            <span className="h-px flex-1 bg-stone-200/80"></span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md">
            {TOOL_APPS.map((app) => (
              <button
                key={app.id}
                onClick={() => handleToolClick(app.action)}
                className="group flex items-center gap-3 text-left p-3.5 rounded-2xl border border-stone-200/80 bg-white hover:shadow-md hover:border-amber-300 transition-all duration-200"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-200 group-hover:scale-105 ${app.bg}`}
                >
                  {app.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-stone-900 leading-tight group-hover:text-amber-700 transition-colors truncate">
                    {app.title}
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5 leading-snug line-clamp-1">
                    {app.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 sm:px-8 py-3.5 border-t border-stone-200/70 bg-stone-100/60 flex items-center justify-between text-[11px] text-stone-500">
          <span>Masuk sebagai <strong className="text-stone-800">{currentUser?.name}</strong> · {currentUser?.organization}</span>
          <span className="hidden sm:inline text-stone-400">sangrAI Supply Chain</span>
        </div>
      </div>
    </div>
  );
};
