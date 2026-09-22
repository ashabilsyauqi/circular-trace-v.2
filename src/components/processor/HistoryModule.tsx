import React from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { History, ArrowRight, Receipt, DollarSign } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Top Stat Button */}
      <div className="flex justify-end">
        <div className="o_stat_button bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <div>
            <span className="o_stat_value">Rp {totalValue.toLocaleString()}</span>
            <span className="o_stat_text">Total Nilai Tercatat ({myProcessorTransactions.length} Log)</span>
          </div>
        </div>
      </div>

      <div className="o_form_sheet overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              Buku Besar Log Aktivitas Stasiun Pengolahan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Catatan historis pembelian ceri dari petani dan penjualan green bean ke gudang &amp; roastery.
            </p>
          </div>
        </div>

        {myProcessorTransactions.length === 0 ? (
          <div className="py-14 text-center">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Belum ada log transaksi stasiun pengolahan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="o_list_table">
              <thead>
                <tr>
                  <th className="!pl-5">ID Transaksi</th>
                  <th>Tanggal</th>
                  <th>Pengirim &rarr; Penerima</th>
                  <th>Produk / Komoditas</th>
                  <th className="text-right">Volume</th>
                  <th className="text-right">Total Tagihan</th>
                  <th className="!pr-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {myProcessorTransactions.map((trx) => (
                  <tr key={trx.id}>
                    <td className="!pl-5 font-mono font-bold text-slate-900">{trx.id}</td>
                    <td className="text-slate-500">{trx.date}</td>
                    <td>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                        <span>{trx.fromName}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span>{trx.toName}</span>
                      </div>
                    </td>
                    <td className="font-medium text-slate-800">{trx.itemName}</td>
                    <td className="text-right font-mono font-bold text-slate-900">{trx.quantity}</td>
                    <td className="text-right font-mono font-bold text-emerald-800">
                      Rp {trx.totalAmount.toLocaleString()}
                    </td>
                    <td className="!pr-5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
