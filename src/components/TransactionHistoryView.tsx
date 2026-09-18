import React from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { History, CheckCircle2 } from 'lucide-react';

export const TransactionHistoryView: React.FC = () => {
  const { currentUser, transactions } = useCoffee();

  const myTransactions = transactions.filter(
    (t) =>
      t.fromName === currentUser?.name ||
      t.toName === currentUser?.name ||
      t.toName === currentUser?.organization ||
      t.fromRole === currentUser?.role ||
      t.toRole === currentUser?.role ||
      true
  );

  const totalTrxAmount = myTransactions.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            Audit Trail & Log Buku Besar Rantai Pasok
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            Riwayat Transaksi & Perdagangan Kopi
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Catatan permanen seluruh aktivitas jual-beli antar pelaku dari hulu hingga hilir.
          </p>
        </div>

        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-right">
          <span className="text-[10px] text-stone-400 block font-bold uppercase">Total Nilai Perdagangan</span>
          <span className="text-xl font-black text-emerald-800">
            Rp {totalTrxAmount.toLocaleString()}
          </span>
          <span className="text-[11px] text-stone-500 block">Dari {myTransactions.length} transaksi selesai</span>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">ID TRX</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Pihak Penjual</th>
                <th className="py-3 px-4">Pihak Pembeli</th>
                <th className="py-3 px-4">Komoditas / Produk</th>
                <th className="py-3 px-4">Kuantitas</th>
                <th className="py-3 px-4">Total Biaya</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {myTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-800">{trx.id}</td>
                    <td className="py-3.5 px-4 text-stone-600">{trx.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-900 block">{trx.fromName}</span>
                      <span className="text-[10px] uppercase font-bold text-stone-400">{trx.fromRole}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-900 block">{trx.toName}</span>
                      <span className="text-[10px] uppercase font-bold text-stone-400">{trx.toRole}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-800">{trx.itemName}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-800">{trx.quantity}</td>
                    <td className="py-3.5 px-4 font-black text-stone-900">
                      Rp {trx.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
