import React, { useState } from 'react';
import { Store, Package, QrCode, ArrowRight, TrendingUp, Search, Coffee, Scale, DollarSign, Award } from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { RoastedBeanLot } from '../../types/coffee';
import { RoasterBarcodeModal } from './RoasterBarcodeModal';
import { RecordBreadcrumb } from '../shared/RecordBreadcrumb';
import { StatusPipeline, PipelineStage } from '../shared/StatusPipeline';
import { StatButton } from '../shared/StatButton';

// Selling, wired to the same Unified Marketplace the other supply-chain actors already sell
// through: a roaster's published RoastedBeanLot (created via Production/Work Orders →
// "Jual ke Marketplace") shows up there automatically once availablePacks > 0. This module
// is a management view over that real inventory + real sales, not a disconnected CRM form.

// A listing's real lifecycle is just its stock level, so the pipeline mirrors that honestly
// instead of inventing workflow steps that don't exist in the data: Tersedia (full stock) ->
// Terjual Sebagian (some packs sold) -> Habis Terjual (sold out).
const LOT_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'available', label: 'Tersedia' },
  { id: 'partial', label: 'Terjual Sebagian' },
  { id: 'sold', label: 'Habis Terjual' },
];

export const SellingModule: React.FC = () => {
  const { currentUser, roastedLots, transactions, setActiveView } = useCoffee();
  const [searchQuery, setSearchQuery] = useState('');
  const [qrLot, setQrLot] = useState<RoastedBeanLot | null>(null);
  const [detailLot, setDetailLot] = useState<RoastedBeanLot | null>(null);

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

  // Best-effort match: transactions don't carry a lot id, but itemName is built from
  // "{variety} {roastLevel} (...)" at creation time, so this is a reasonable proxy for
  // "sales that came from this specific lot" on the detail page below.
  const salesForLot = (lot: RoastedBeanLot) =>
    salesHistory.filter((t) => t.itemName.includes(lot.variety) && t.itemName.includes(lot.roastLevel));

  return (
    <div className="space-y-5">
      {!detailLot && (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-stone-200 p-4">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block mb-1">
                Listing Aktif
              </span>
              <span className="text-xl font-bold text-stone-900">{totalListed}</span>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 p-4">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block mb-1">
                Stok Tersedia
              </span>
              <span className="text-xl font-bold text-stone-900">{totalStockPacks} pack</span>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 p-4">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block mb-1">
                Total Penjualan
              </span>
              <span className="text-xl font-bold text-stone-900">Rp {totalRevenue.toLocaleString()}</span>
            </div>
          </div>

          {/* Listings */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 gap-3 flex-wrap">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-orange-500" />
                Produk Anda di Unified Marketplace
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari lot..."
                    className="pl-7 pr-3 py-1.5 rounded-lg border border-stone-300 text-xs w-40"
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
                <Package className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-stone-600">Belum ada produk yang dipublikasikan</p>
                <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                  Selesaikan sebuah Work Order sangrai, lalu klik "Jual ke Marketplace" pada tab Work Orders — produk akan
                  otomatis tampil di sini dan di Unified Marketplace.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Lot</th>
                      <th className="py-3 px-4">Origin / Varietas</th>
                      <th className="py-3 px-4">Roast</th>
                      <th className="py-3 px-4">Harga / Pack</th>
                      <th className="py-3 px-4">Stok</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredLots.map((lot) => (
                      <tr
                        key={lot.id}
                        onClick={() => setDetailLot(lot)}
                        className="hover:bg-amber-50/60 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-stone-700">{lot.id}</td>
                        <td className="py-3 px-4 text-stone-900 font-semibold">
                          {lot.origin} — {lot.variety}
                        </td>
                        <td className="py-3 px-4 text-stone-600">{lot.roastLevel}</td>
                        <td className="py-3 px-4 font-bold text-stone-900">Rp {lot.pricePerPack.toLocaleString()}</td>
                        <td className="py-3 px-4 text-stone-700">
                          {lot.availablePacks}/{lot.totalPacks} pack
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              lot.availablePacks > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {lot.availablePacks > 0 ? 'Tersedia' : 'Habis'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQrLot(lot);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-[11px] font-bold"
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
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                Riwayat Penjualan
              </h3>
            </div>
            {salesHistory.length === 0 ? (
              <p className="text-xs text-stone-400 py-10 text-center">Belum ada penjualan tercatat.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Tanggal</th>
                      <th className="py-3 px-4">Pembeli</th>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {salesHistory.map((t) => (
                      <tr key={t.id} className="hover:bg-stone-50">
                        <td className="py-3 px-4 text-stone-600">{t.date}</td>
                        <td className="py-3 px-4 font-semibold text-stone-900">{t.toName}</td>
                        <td className="py-3 px-4 text-stone-700">{t.itemName}</td>
                        <td className="py-3 px-4 font-bold text-stone-900">Rp {t.totalAmount.toLocaleString()}</td>
                        <td className="py-3 px-4">
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
        </>
      )}

      {/* PRODUCT DETAIL PAGE (breadcrumb + stage pipeline + full spec, matching the Work
          Orders / Purchase Orders record-detail pattern) */}
      {detailLot && (
        <div>
          <RecordBreadcrumb
            listLabel="Produk & Penjualan"
            recordLabel={detailLot.id}
            onBack={() => setDetailLot(null)}
          />

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
            <div className="bg-[#FAF7F2] px-6 py-5 border-b border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-600">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 font-mono">{detailLot.id}</h3>
                  <p className="text-[10px] text-stone-500">
                    {detailLot.origin} — {detailLot.variety} • Sangrai: {detailLot.roastDate}
                  </p>
                </div>
              </div>

              <StatusPipeline stages={LOT_PIPELINE_STAGES} currentStageId={detailLot.status} />
            </div>

            {/* Smart Stat Buttons */}
            <div className="px-6 py-3 bg-white border-b border-stone-100 flex flex-wrap gap-2">
              <StatButton
                icon={<Scale className="w-4 h-4" />}
                value={`${detailLot.availablePacks}/${detailLot.totalPacks} pack`}
                label="Stok Tersisa"
                color="emerald"
              />
              <StatButton
                icon={<DollarSign className="w-4 h-4" />}
                value={`Rp ${detailLot.pricePerPack.toLocaleString()}`}
                label="Harga / Pack"
                color="amber"
              />
              <StatButton
                icon={<Award className="w-4 h-4" />}
                value={detailLot.scaCuppingScore}
                label="Skor Cupping SCA"
                color="purple"
              />
              <StatButton
                icon={<Package className="w-4 h-4" />}
                value={`${detailLot.packageWeightGrams} g`}
                label="Berat / Pack"
                color="blue"
              />
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-[11px] font-black uppercase text-stone-500 tracking-wider mb-3 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5" /> Spesifikasi Produk
                </h4>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Origin / Varietas</dt>
                    <dd className="font-bold text-stone-900">{detailLot.origin} • {detailLot.variety}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Metode Proses</dt>
                    <dd className="font-bold text-stone-900">{detailLot.processMethod}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Tingkat Sangrai</dt>
                    <dd className="font-bold text-stone-900">{detailLot.roastLevel}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-stone-500">Agtron / DTR</dt>
                    <dd className="font-bold text-stone-900">
                      {detailLot.agtronNumber} • {detailLot.developmentTimeRatio}%
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase text-stone-500 tracking-wider mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Rekomendasi & Petani
                </h4>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Petani Sumber</dt>
                    <dd className="font-bold text-stone-900">{detailLot.farmerName}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Mesin Roaster</dt>
                    <dd className="font-bold text-stone-900">{detailLot.roasterMachine}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Rekomendasi Resting</dt>
                    <dd className="font-bold text-stone-900">{detailLot.restingRecommendationDays} hari</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-stone-500">Metode Seduh</dt>
                    <dd className="font-bold text-stone-900 text-right">{detailLot.recommendedBrew.join(', ')}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="px-6 pb-6 flex flex-wrap gap-3">
              <button
                onClick={() => setQrLot(detailLot)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                <QrCode className="w-4 h-4" /> Cetak / Lihat QR Produk
              </button>
              <button
                onClick={() => setActiveView('marketplace')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs transition-all"
              >
                <Store className="w-4 h-4" /> Lihat di Marketplace
              </button>
            </div>
          </div>

          {/* List of sales tied to this specific product */}
          <div className="mt-5 bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                Riwayat Penjualan Produk Ini
              </h3>
            </div>
            {salesForLot(detailLot).length === 0 ? (
              <p className="text-xs text-stone-400 py-10 text-center">Belum ada penjualan untuk produk ini.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Tanggal</th>
                      <th className="py-3 px-4">Pembeli</th>
                      <th className="py-3 px-4">Jumlah</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {salesForLot(detailLot).map((t) => (
                      <tr key={t.id} className="hover:bg-stone-50">
                        <td className="py-3 px-4 text-stone-600">{t.date}</td>
                        <td className="py-3 px-4 font-semibold text-stone-900">{t.toName}</td>
                        <td className="py-3 px-4 text-stone-700">{t.quantity}</td>
                        <td className="py-3 px-4 font-bold text-stone-900">Rp {t.totalAmount.toLocaleString()}</td>
                        <td className="py-3 px-4">
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
        </div>
      )}

      <RoasterBarcodeModal isOpen={!!qrLot} onClose={() => setQrLot(null)} lot={qrLot} />
    </div>
  );
};
