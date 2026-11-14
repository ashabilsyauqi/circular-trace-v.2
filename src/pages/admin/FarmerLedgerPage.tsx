import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import {
  History,
  Receipt,
  Search,
  Filter,
  DollarSign,
  Scale,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Users,
  ChevronRight,
  Printer,
} from 'lucide-react';

export const FarmerLedgerPage: React.FC = () => {
  const { transactions, currentUser, users } = useCoffee();

  const [searchQuery, setSearchQuery] = useState('');

  // Transactions relating to farmers (either sold from farmer or purchase of cherry)
  const cherryTransactions = transactions.filter(
    (t) =>
      t.itemName.toLowerCase().includes('ceri') ||
      t.itemName.toLowerCase().includes('cherry') ||
      t.fromRole === 'petani' ||
      t.toRole === 'pengolah'
  );

  const displayTransactions = cherryTransactions.length > 0 ? cherryTransactions : transactions;

  const filteredTransactions = displayTransactions.filter((trx) => {
    const q = searchQuery.toLowerCase();
    return (
      trx.id.toLowerCase().includes(q) ||
      trx.itemName.toLowerCase().includes(q) ||
      trx.toName.toLowerCase().includes(q) ||
      trx.fromName.toLowerCase().includes(q)
    );
  });

  const totalRevenue = displayTransactions.reduce((acc, t) => acc + (t.totalAmount || 0), 0);
  const totalVolume = displayTransactions.reduce((acc, t) => {
    const numericWeight = parseFloat(t.quantity?.replace(/[^\d.]/g, '') || '0');
    return acc + numericWeight;
  }, 0);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">
              Buku Kas & Ledger Penjualan Petani
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Pencatatan riwayat transaksi penjualan ceri kopi dari petani ke stasiun pengolah (wet mill) dan pembeli rantai pasok.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
            Total Perputaran Kas
          </span>
          <span className="text-2xl font-black text-emerald-700 font-mono">
            Rp {totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 2. KPI Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              Total Penerimaan Kas
            </span>
            <div className="text-xl font-black text-stone-900 font-mono leading-tight">
              Rp {totalRevenue.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Buku Kas Resmi</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              Total Volume Terjual
            </span>
            <div className="text-xl font-black text-stone-900 leading-tight">
              {totalVolume.toLocaleString()}{' '}
              <span className="text-xs font-normal text-stone-500">kg</span>
            </div>
            <span className="text-[10px] text-amber-600 font-medium">Ceri Segar Terdistribusi</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              Transaksi Tercatat
            </span>
            <div className="text-xl font-black text-stone-900 leading-tight">
              {displayTransactions.length}{' '}
              <span className="text-xs font-normal text-stone-500">Invoice</span>
            </div>
            <span className="text-[10px] text-blue-600 font-medium">Semua Lunas Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* 3. Transactions Table */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] overflow-hidden">
        <div className="p-4 border-b border-[#e3e6f0] bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>Riwayat Transaksi Penjualan Ceri ({filteredTransactions.length})</span>
          </h3>

          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi, ID, pembeli..."
              className="w-full bg-white text-xs border border-stone-300 rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 font-medium text-stone-800 placeholder-stone-400"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-[#f4f6f9] text-stone-600 border-b border-[#d2d6de] font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">
                <th className="py-3 px-4 whitespace-nowrap">Invoice / ID</th>
                <th className="py-3 px-4 whitespace-nowrap">Tanggal Transaksi</th>
                <th className="py-3 px-4 whitespace-nowrap">Komoditas &amp; Varietas</th>
                <th className="py-3 px-4 whitespace-nowrap">Pihak Pembeli</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Volume (kg)</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Total Nilai</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-400 text-xs">
                    Belum ada riwayat transaksi yang tercatat.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900 whitespace-nowrap">{trx.id}</td>
                    <td className="py-3 px-4 text-stone-600 whitespace-nowrap">{trx.date}</td>
                    <td className="py-3 px-4 font-semibold text-stone-800 whitespace-nowrap">{trx.itemName}</td>
                    <td className="py-3 px-4 text-stone-700 whitespace-nowrap">{trx.toName}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-800 whitespace-nowrap">
                      {trx.quantity}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-stone-900 whitespace-nowrap">
                      Rp {trx.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap shrink-0">
                        {trx.status || 'Lunas'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FarmerLedgerPage;
