import React from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { History } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600" />
            Log Aktivitas Transaksi Stasiun Pengolahan
          </h2>
          <p className="text-xs text-stone-500">
            Catatan pembelian ceri dari petani dan penjualan green bean ke gudang.
          </p>
        </div>
      </div>

      {myProcessorTransactions.length === 0 ? (
        <p className="text-xs text-stone-500 py-8 text-center">
          Belum ada log transaksi stasiun pengolahan.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">No. TRX</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Pengirim</th>
                <th className="py-3 px-4">Penerima</th>
                <th className="py-3 px-4">Barang</th>
                <th className="py-3 px-4">Volume</th>
                <th className="py-3 px-4">Total Nilai</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {myProcessorTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-stone-800">{trx.id}</td>
                  <td className="py-3 px-4 text-stone-600">{trx.date}</td>
                  <td className="py-3 px-4 font-semibold text-stone-900">{trx.fromName}</td>
                  <td className="py-3 px-4 font-semibold text-stone-900">{trx.toName}</td>
                  <td className="py-3 px-4 text-stone-700">{trx.itemName}</td>
                  <td className="py-3 px-4 font-bold text-amber-800">{trx.quantity}</td>
                  <td className="py-3 px-4 font-black text-stone-900">
                    Rp {trx.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
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
  );
};
