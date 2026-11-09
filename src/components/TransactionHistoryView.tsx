import { BuyerPassportQrModal } from './buyer/BuyerPassportQrModal';
import React from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { History, CheckCircle2, ArrowRight, Receipt, TrendingUp, Layers, ShoppingCart } from 'lucide-react';

const roleAccent: Record<string, string> = {
  petani: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  pengolah: 'bg-amber-100 text-amber-800 border-amber-200',
  gudang: 'bg-blue-100 text-blue-800 border-blue-200',
  roaster: 'bg-orange-100 text-orange-800 border-orange-200',
  cafe: 'bg-stone-800 text-amber-200 border-stone-700',
};

export const TransactionHistoryView: React.FC = () => {
  const { currentUser, transactions, setActiveView } = useCoffee();
  const [activeTab, setActiveTab] = React.useState<'orders' | 'ledger'>('orders');
  const [selectedTraceOrder, setSelectedTraceOrder] = React.useState<any | null>(null);

  const myTransactions = transactions.filter(
    (t) =>
      !currentUser ||
      currentUser.role === 'superadmin' ||
      t.fromName === currentUser.name ||
      t.toName === currentUser.name ||
      t.fromName === currentUser.organization ||
      t.toName === currentUser.organization ||
      t.fromRole === currentUser.role ||
      t.toRole === currentUser.role
  );

  const totalTrxAmount = myTransactions.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const avgTrxAmount = myTransactions.length > 0 ? Math.round(totalTrxAmount / myTransactions.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-stone-950 via-amber-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold mb-3">
            <History className="w-3.5 h-3.5" />
            Audit Trail & Buku Besar Rantai Pasok
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Riwayat Transaksi & Perdagangan Kopi
          </h1>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
            Catatan permanen seluruh aktivitas jual-beli antar pelaku rantai pasok, dari hulu petani hingga hilir kedai kopi.
          </p>
        </div>
        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
          <Receipt className="w-56 h-56" />
        </div>
      </div>

      {/* Summary Stat Cards */}
            {/* TABS NAVIGATION & CART SHORTCUT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Pesanan Saya &amp; Lacak Paspor QR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ledger'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Buku Besar Transaksi Rantai Pasok</span>
          </button>
        </div>

        {/* Clear Action: Shortcut ke Keranjang Belanja */}
        <button
          type="button"
          onClick={() => setActiveView('cart')}
          className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all border border-emerald-200 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <ShoppingCart className="w-4 h-4 text-emerald-600" />
          <span>Buka Keranjang Belanja</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 text-stone-400 text-[11px] font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Total Nilai Perdagangan
          </div>
          <span className="text-xl sm:text-2xl font-black text-stone-900">
            Rp {totalTrxAmount.toLocaleString()}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 text-stone-400 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            Total Transaksi Selesai
          </div>
          <span className="text-xl sm:text-2xl font-black text-stone-900">
            {myTransactions.length} <span className="text-sm font-semibold text-stone-500">transaksi</span>
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 text-stone-400 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Receipt className="w-3.5 h-3.5" />
            Rata-Rata Nilai / Transaksi
          </div>
          <span className="text-xl sm:text-2xl font-black text-amber-800">
            Rp {avgTrxAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Transaction List */}
      {myTransactions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <Receipt className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">Belum ada transaksi tercatat</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Riwayat jual-beli Anda di marketplace bersama akan muncul di sini secara otomatis.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-sm font-black text-stone-900">Log Transaksi Terverifikasi</h2>
            <span className="text-[10px] text-stone-400 font-mono">{myTransactions.length} entri</span>
          </div>

          {/* Mobile: friendly stacked cards */}
          <div className="divide-y divide-stone-100 sm:hidden">
            {myTransactions.map((trx) => (
              <div key={trx.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-stone-500">{trx.id}</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {trx.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-stone-900 truncate block">{trx.fromName}</span>
                    <span
                      className={`inline-block mt-0.5 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full border ${
                        roleAccent[trx.fromRole] || 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {trx.fromRole}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                  <div className="flex-1 min-w-0 text-right">
                    <span className="font-bold text-stone-900 truncate block">{trx.toName}</span>
                    <span
                      className={`inline-block mt-0.5 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full border ${
                        roleAccent[trx.toRole] || 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {trx.toRole}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <span className="text-stone-600">
                    {trx.itemName} <span className="text-amber-800 font-bold">· {trx.quantity}</span>
                  </span>
                  <span className="font-black text-stone-900">Rp {trx.totalAmount.toLocaleString()}</span>
                </div>
                <span className="text-[10px] text-stone-400">{trx.date}</span>
              </div>
            ))}
          </div>

          {/* Desktop: softened table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap min-w-[850px]">
              <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-5 whitespace-nowrap">ID Transaksi</th>
                  <th className="py-3 px-5 whitespace-nowrap">Tanggal</th>
                  <th className="py-3 px-5 whitespace-nowrap">Penjual</th>
                  <th className="py-3 px-5 whitespace-nowrap">Pembeli</th>
                  <th className="py-3 px-5 whitespace-nowrap">Komoditas</th>
                  <th className="py-3 px-5 whitespace-nowrap">Kuantitas</th>
                  <th className="py-3 px-5 whitespace-nowrap">Total Biaya</th>
                  <th className="py-3 px-5 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {myTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-stone-700 whitespace-nowrap">{trx.id}</td>
                    <td className="py-4 px-5 text-stone-500 whitespace-nowrap">{trx.date}</td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="font-semibold text-stone-900 block whitespace-nowrap">{trx.fromName}</span>
                      <span
                        className={`inline-block mt-1 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full border whitespace-nowrap ${
                          roleAccent[trx.fromRole] || 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                      >
                        {trx.fromRole}
                      </span>
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="font-semibold text-stone-900 block whitespace-nowrap">{trx.toName}</span>
                      <span
                        className={`inline-block mt-1 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full border whitespace-nowrap ${
                          roleAccent[trx.toRole] || 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                      >
                        {trx.toRole}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-medium text-stone-800 whitespace-nowrap">{trx.itemName}</td>
                    <td className="py-4 px-5 font-bold text-amber-800 whitespace-nowrap">{trx.quantity}</td>
                    <td className="py-4 px-5 font-black text-stone-900 whitespace-nowrap">
                      Rp {trx.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 w-fit whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="whitespace-nowrap">{trx.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
