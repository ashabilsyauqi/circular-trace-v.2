import React, { useState } from 'react';
import { Store, Package, QrCode, ArrowRight, TrendingUp, Search } from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { RoastedBeanLot } from '../../types/coffee';
import { RoasterBarcodeModal } from './RoasterBarcodeModal';

// Selling, wired to the same Unified Marketplace the other supply-chain actors already sell
// through: a roaster's published RoastedBeanLot (created via Production/Work Orders →
// "Jual ke Marketplace") shows up there automatically once availablePacks > 0. This module
// is a management view over that real inventory + real sales, not a disconnected CRM form.
export const SellingModule: React.FC = () => {
  const { currentUser, roastedLots, transactions, setActiveView } = useCoffee();
  const [searchQuery, setSearchQuery] = useState('');
  const [qrLot, setQrLot] = useState<RoastedBeanLot | null>(null);

  const myLots = roastedLots.filter((r) => r.roasterId === currentUser?.id);
  const filteredLots = myLots.filter(
    (r) =>
      r.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const salesHistory = transactions.filter(
    (t) => t.fromRole === 'roaster' && t.fromName === (currentUser?.organization || currentUser?.name)
  );

  const totalListed = myLots.filter((r) => r.availablePacks > 0).length;
  const totalStockPacks = myLots.reduce((acc, r) => acc + r.availablePacks, 0);
  const totalRevenue = salesHistory.reduce((acc, t) => acc + t.totalAmount, 0);

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
            Listing Aktif
          </span>
          <span className="text-xl font-bold text-slate-900">{totalListed}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
            Stok Tersedia
          </span>
          <span className="text-xl font-bold text-slate-900">{totalStockPacks} pack</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
            Total Penjualan
          </span>
          <span className="text-xl font-bold text-slate-900">Rp {totalRevenue.toLocaleString()}</span>
        </div>
      </div>

      {/* Listings */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 gap-3 flex-wrap">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-orange-500" />
            Produk Anda di Unified Marketplace
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari lot..."
                className="pl-7 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-40"
              />
            </div>
            <button
              onClick={() => setActiveView('marketplace')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold"
            >
              Buka Marketplace <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {filteredLots.length === 0 ? (
          <div className="py-14 text-center px-4">
            <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">Belum ada produk yang dipublikasikan</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Selesaikan sebuah Work Order sangrai, lalu klik "Jual ke Marketplace" pada tab Work Orders — produk akan
              otomatis tampil di sini dan di Unified Marketplace.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Lot</th>
                  <th className="py-2.5 px-4">Origin / Varietas</th>
                  <th className="py-2.5 px-4">Roast</th>
                  <th className="py-2.5 px-4">Harga / Pack</th>
                  <th className="py-2.5 px-4">Stok</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLots.map((lot) => (
                  <tr key={lot.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-700">{lot.id}</td>
                    <td className="py-2.5 px-4 text-slate-900 font-semibold">
                      {lot.origin} — {lot.variety}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{lot.roastLevel}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">Rp {lot.pricePerPack.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-slate-700">
                      {lot.availablePacks}/{lot.totalPacks} pack
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          lot.availablePacks > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {lot.availablePacks > 0 ? 'Tersedia' : 'Habis'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => setQrLot(lot)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-[11px] font-bold"
                      >
                        <QrCode className="w-3.5 h-3.5" /> QR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sales history (real transactions, not manual entries) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            Riwayat Penjualan
          </h3>
        </div>
        {salesHistory.length === 0 ? (
          <p className="text-xs text-slate-400 py-10 text-center">Belum ada penjualan tercatat.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Tanggal</th>
                  <th className="py-2.5 px-4">Pembeli</th>
                  <th className="py-2.5 px-4">Item</th>
                  <th className="py-2.5 px-4">Total</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salesHistory.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 text-slate-600">{t.date}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{t.toName}</td>
                    <td className="py-2.5 px-4 text-slate-700">{t.itemName}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">Rp {t.totalAmount.toLocaleString()}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RoasterBarcodeModal isOpen={!!qrLot} onClose={() => setQrLot(null)} lot={qrLot} />
    </div>
  );
};
