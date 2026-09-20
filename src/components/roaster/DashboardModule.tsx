import React from 'react';
import {
  Activity,
  Wallet,
  TrendingUp,
  TrendingDown,
  Sprout,
  Coffee,
  Package,
  ShoppingCart,
  Flame,
  Store,
  PlusCircle,
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';

interface DashboardModuleProps {
  onNavigate: (tab: 'work_orders' | 'purchasing' | 'selling' | 'inventory') => void;
}

// Flat, Qrema-style overview dashboard: a handful of honest numbers pulled straight from
// context state (no decorative gradients, no invented metrics) plus quick-action shortcuts.
export const DashboardModule: React.FC<DashboardModuleProps> = ({ onNavigate }) => {
  const { currentUser, transactions, roastedLots, workOrders, purchaseOrders } = useCoffee();

  const myRoastedLots = roastedLots.filter((r) => r.roasterId === currentUser?.id);

  const revenue = transactions
    .filter((t) => t.fromRole === 'roaster' && t.fromName === (currentUser?.organization || currentUser?.name))
    .reduce((acc, t) => acc + t.totalAmount, 0);

  const expenses = transactions
    .filter((t) => t.toRole === 'roaster' && t.toName === (currentUser?.organization || currentUser?.name))
    .reduce((acc, t) => acc + t.totalAmount, 0);

  const netProfit = revenue - expenses;

  const greenBeanKgInProgress = workOrders
    .filter((w) => w.status !== 'completed' && w.status !== 'cancelled')
    .reduce((acc, w) => acc + (w.targetGreenKg || 0), 0);

  const roastedKgAvailable = myRoastedLots.reduce(
    (acc, r) => acc + (r.availablePacks * r.packageWeightGrams) / 1000,
    0
  );

  const finishedValue = myRoastedLots.reduce((acc, r) => acc + r.availablePacks * r.pricePerPack, 0);

  const lowStockLots = myRoastedLots.filter((r) => r.availablePacks > 0 && r.availablePacks <= 5);
  const openPOs = purchaseOrders.filter((p) => p.status !== 'received' && p.status !== 'cancelled');

  const metricCard = (
    icon: React.ReactNode,
    label: string,
    value: string,
    tone: 'up' | 'down' | 'neutral' = 'neutral'
  ) => (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-start justify-between">
      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">{label}</span>
        <span className="text-xl font-bold text-slate-900">{value}</span>
      </div>
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          tone === 'up'
            ? 'bg-emerald-50 text-emerald-600'
            : tone === 'down'
              ? 'bg-red-50 text-red-600'
              : 'bg-slate-100 text-slate-600'
        }`}
      >
        {icon}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-xs text-slate-500 mt-0.5">Ringkasan operasional roastery Anda.</p>
      </div>

      {/* Financial overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {metricCard(<Wallet className="w-4 h-4" />, 'Revenue', `Rp ${revenue.toLocaleString()}`, 'up')}
        {metricCard(<TrendingDown className="w-4 h-4" />, 'Expenses', `Rp ${expenses.toLocaleString()}`, 'down')}
        {metricCard(
          <TrendingUp className="w-4 h-4" />,
          'Net Profit',
          `Rp ${netProfit.toLocaleString()}`,
          netProfit >= 0 ? 'up' : 'down'
        )}
      </div>

      {/* Inventory value */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Inventory Value</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Green Bean (in progress)</span>
              <strong className="text-sm text-slate-900">{greenBeanKgInProgress.toFixed(1)} kg</strong>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Roasted (tersedia)</span>
              <strong className="text-sm text-slate-900">{roastedKgAvailable.toFixed(1)} kg</strong>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Nilai Stok Jadi</span>
              <strong className="text-sm text-slate-900">Rp {finishedValue.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('purchasing')}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-start gap-2 hover:border-orange-400 transition-colors text-left"
          >
            <ShoppingCart className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-bold text-slate-900">Create PO</span>
          </button>
          <button
            onClick={() => onNavigate('work_orders')}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-start gap-2 hover:border-orange-400 transition-colors text-left"
          >
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-bold text-slate-900">Create WO</span>
          </button>
          <button
            onClick={() => onNavigate('selling')}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-start gap-2 hover:border-orange-400 transition-colors text-left"
          >
            <Store className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-bold text-slate-900">Selling</span>
          </button>
          <button
            onClick={() => onNavigate('inventory')}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-start gap-2 hover:border-orange-400 transition-colors text-left"
          >
            <PlusCircle className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-bold text-slate-900">Inventory</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Low Stock Roasted Lots
          </h3>
          {lowStockLots.length === 0 ? (
            <p className="text-xs text-slate-400 py-3">Tidak ada lot roasted dengan stok menipis.</p>
          ) : (
            <ul className="space-y-1.5">
              {lowStockLots.map((l) => (
                <li key={l.id} className="text-xs text-slate-700 flex items-center justify-between">
                  <span>{l.origin} — {l.variety}</span>
                  <strong className="text-red-600">{l.availablePacks} pack</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" /> Purchase Order Berjalan
          </h3>
          {openPOs.length === 0 ? (
            <p className="text-xs text-slate-400 py-3">Tidak ada PO yang sedang berjalan.</p>
          ) : (
            <ul className="space-y-1.5">
              {openPOs.slice(0, 5).map((p) => (
                <li key={p.id} className="text-xs text-slate-700 flex items-center justify-between">
                  <span>{p.poNumber} — {p.supplierName}</span>
                  <span className="text-slate-500">{p.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
