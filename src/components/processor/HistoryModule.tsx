import React from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { History, ArrowRight, Receipt } from 'lucide-react';

// Transaction ledger scoped to the processor role: cherry purchases from farmers and green
// bean sales to warehouses/roasters.
export const HistoryModule: React.FC = () => {
  const { currentUser, transactions } = useCoffee();

  const myProcessorTransactions = transactions.filter(
    (trx) =>
      trx.fromName === currentUser?.name ||
      trx.toName === currentUser?.name ||
      trx.fromRole === 'pengolah' ||
      trx.toRole === 'pengolah'
  );

  const totalValue = myProcessorTransactions.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600" />
            Log Aktivitas Stasiun Pengolahan
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Catatan pembelian ceri dari petani dan penjualan green bean ke gudang.
          </p>
        </div>
        <div className="text-right bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2">
          <span className="text-[10px] font-bold uppercase text-amber-700 block">Total Nilai Tercatat</span>
          <span className="text-lg font-black text-amber-900 font-mono">Rp {totalValue.toLocaleString()}</span>
        </div>
      </div>

      {myProcessorTransactions.length === 0 ? (
        <div className="py-14 text-center">
          <Receipt className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-xs text-stone-500">Belum ada log transaksi stasiun pengolahan.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {myProcessorTransactions.map((trx) => (
            <div
              key={trx.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl border border-stone-200/90 bg-stone-50/60 hover:bg-amber-50/50 hover:border-amber-200 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 sm:w-2/5">
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0">
                  <Receipt className="w-4 h-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 truncate">
                    <span className="truncate">{trx.fromName}</span>
                    <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="truncate">{trx.toName}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">
                    {trx.itemName} • {trx.date} • <span className="font-mono">{trx.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 sm:flex-1">
                <div className="text-xs">
                  <span className="text-stone-400">Volume: </span>
                  <span className="font-bold text-amber-800">{trx.quantity}</span>
                </div>
                <div className="text-sm font-black text-stone-900 font-mono">
                  Rp {trx.totalAmount.toLocaleString()}
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold whitespace-nowrap">
                  {trx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
