import React, { useState } from 'react';
import {
  Package,
  Layers,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Coffee,
  Plus,
  Minus,
  ArrowRight,
  TrendingDown,
  Warehouse,
  Flame,
  ClipboardCheck,
  Clock,
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { MetricCard } from '../admin/MetricCard';
import { RoasterPackagingItem } from '../../types/roasterErp';
import { WarehouseLot } from '../../types/coffee';
import { OdooControlPanel } from '../odoo/OdooControlPanel';
import { OdooSmartStatButton } from '../odoo/OdooSmartStatButton';
import { IncomingQCModal } from './IncomingQCModal';

export const InventoryModule: React.FC = () => {
  const {
    warehouseLots,
    roastedLots,
    packagingInventory,
    updatePackagingStock,
  } = useCoffee();

  const [activeCategory, setActiveCategory] = useState<'green' | 'roasted' | 'packaging'>('green');
  const [searchQuery, setSearchQuery] = useState('');
  const [qcModalLot, setQcModalLot] = useState<WarehouseLot | null>(null);

  const pendingQcCount = warehouseLots.filter((l) => l.qcStatus === 'pending_qc').length;

  // Valuation Computations
  const totalGreenKg = warehouseLots.reduce((acc, curr) => acc + curr.availableWeightKg, 0);
  const totalGreenValue = warehouseLots.reduce(
    (acc, curr) => acc + curr.availableWeightKg * curr.purchasePricePerKg,
    0
  );

  const totalRoastedPacks = roastedLots.reduce((acc, curr) => acc + curr.availablePacks, 0);
  const totalRoastedValue = roastedLots.reduce(
    (acc, curr) => acc + curr.availablePacks * curr.pricePerPack,
    0
  );

  const totalPackagingPcs = packagingInventory.reduce((acc, curr) => acc + curr.stockQuantity, 0);
  const totalPackagingValue = packagingInventory.reduce(
    (acc, curr) => acc + curr.stockQuantity * curr.unitCost,
    0
  );

  const grandTotalValue = totalGreenValue + totalRoastedValue + totalPackagingValue;

  const filteredWarehouseLots = warehouseLots.filter((l) =>
    l.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRoastedLots = roastedLots.filter((r) =>
    r.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.roastLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPackaging = packagingInventory.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Nilai Total Aset Inventaris"
          value={`Rp ${grandTotalValue.toLocaleString()}`}
          subtitle="Valuasi Green + Roasted + Packaging"
          trend={{ value: 'Audit FIFO Valid', isPositive: true }}
          icon={<DollarSign className="w-5 h-5" />}
          color="amber"
        />
        <MetricCard
          title="Stok Green Coffee Silo"
          value={`${totalGreenKg} kg`}
          subtitle={`Nilai Rp ${totalGreenValue.toLocaleString()}`}
          trend={{ value: `${warehouseLots.length} Lot Siap Sangrai`, isPositive: true }}
          icon={<Warehouse className="w-5 h-5" />}
          color="emerald"
        />
        <MetricCard
          title="Stok Biji Sangrai (Ready)"
          value={`${totalRoastedPacks} Pack`}
          subtitle={`Nilai Rp ${totalRoastedValue.toLocaleString()}`}
          trend={{ value: 'Siap Distribusi Cafe', isPositive: true }}
          icon={<Coffee className="w-5 h-5" />}
          color="stone"
        />
        <MetricCard
          title="Bahan Kemasan & Valve"
          value={`${totalPackagingPcs} Pcs`}
          subtitle={`Nilai Rp ${totalPackagingValue.toLocaleString()}`}
          trend={{ value: 'Pouch & Tin Can OK', isPositive: true }}
          icon={<Package className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Incoming QC alert banner */}
      {pendingQcCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 text-amber-800">
            <Clock className="w-4 h-4 shrink-0" />
            <p className="text-xs font-semibold">
              {pendingQcCount} lot green coffee baru datang dari Purchasing dan menunggu QC Masuk sebelum bisa
              diolah roaster.
            </p>
          </div>
          <button
            onClick={() => setActiveCategory('green')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold shrink-0"
          >
            Lihat Lot
          </button>
        </div>
      )}

      {/* Subtab Toggle Buttons */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveCategory('green')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeCategory === 'green'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Warehouse className="w-4 h-4" />
          <span>Green Coffee Silo ({warehouseLots.length} Lot)</span>
        </button>

        <button
          onClick={() => setActiveCategory('roasted')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeCategory === 'roasted'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Roasted Bulk Coffee ({roastedLots.length} SKU)</span>
        </button>

        <button
          onClick={() => setActiveCategory('packaging')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeCategory === 'packaging'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Packaging & Consumables ({packagingInventory.length} Item)</span>
        </button>
      </div>

      {/* Odoo 19 Control Panel */}
      <OdooControlPanel
        breadcrumbs={[
          { label: 'Gudang & Inventaris' },
          {
            label:
              activeCategory === 'green'
                ? 'Green Coffee Silo'
                : activeCategory === 'roasted'
                ? 'Roasted Beans Ready'
                : 'Packaging & Valves',
          },
        ]}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        recordCount={
          activeCategory === 'green'
            ? filteredWarehouseLots.length
            : activeCategory === 'roasted'
            ? filteredRoastedLots.length
            : filteredPackaging.length
        }
      />

      {/* CATEGORY 1: GREEN COFFEE TABLE */}
      {activeCategory === 'green' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Lot ID</th>
                  <th className="py-3.5 px-4">Origin & Varietas</th>
                  <th className="py-3.5 px-4">Proses & Mutu</th>
                  <th className="py-3.5 px-4">Lokasi Silo / Bay</th>
                  <th className="py-3.5 px-4">Stok Tersedia (Kg)</th>
                  <th className="py-3.5 px-4">HPP Modal (Rp/Kg)</th>
                  <th className="py-3.5 px-4">Total Nilai Aset</th>
                  <th className="py-3.5 px-4">Status Stok</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredWarehouseLots.map((lot) => {
                  // Reorder is about how much of THIS lot has actually been used up, not an
                  // absolute kg floor — otherwise a freshly received, untouched 30kg lot gets
                  // flagged "Reorder Needed" the instant it clears QC, which makes no sense.
                  const isLow = lot.weightKg > 0 && lot.availableWeightKg / lot.weightKg < 0.2;
                  const qc = lot.qcStatus ?? 'passed';
                  return (
                    <tr key={lot.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1E2333]">{lot.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{lot.origin}</div>
                        <div className="text-[10px] text-stone-400">{lot.variety} • {lot.altitude}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-800">{lot.processMethod}</div>
                        <div className="text-[10px] text-amber-800 font-mono font-bold">
                          {qc === 'pending_qc' ? 'Menunggu skor QC' : `SCA ${lot.verifiedScaScore} (KA: ${lot.moistureContentPercent || 11.2}%)`}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">{lot.storageLocation}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-stone-900 text-sm">
                        {lot.availableWeightKg} kg
                      </td>
                      <td className="py-3.5 px-4 text-stone-800">
                        Rp {lot.purchasePricePerKg.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-black text-[#1E2333]">
                        Rp {(lot.availableWeightKg * lot.purchasePricePerKg).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        {qc === 'pending_qc' && (
                          <span className="inline-flex items-center gap-1 whitespace-nowrap px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                            <Clock className="w-3 h-3 shrink-0" /> Menunggu QC
                          </span>
                        )}
                        {qc === 'rejected' && (
                          <span className="inline-flex items-center gap-1 whitespace-nowrap px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300">
                            <AlertTriangle className="w-3 h-3 shrink-0" /> Ditolak QC
                          </span>
                        )}
                        {qc === 'passed' && isLow && (
                          <span className="inline-flex items-center gap-1 whitespace-nowrap px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300">
                            <AlertTriangle className="w-3 h-3 shrink-0" /> Stok Menipis
                          </span>
                        )}
                        {qc === 'passed' && !isLow && (
                          <span className="inline-flex items-center gap-1 whitespace-nowrap px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 shrink-0" /> Stok Aman
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {qc === 'pending_qc' ? (
                          <button
                            onClick={() => setQcModalLot(lot)}
                            className="inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] transition-colors shadow-xs ml-auto"
                          >
                            <ClipboardCheck className="w-3.5 h-3.5 shrink-0" /> QC Masuk
                          </button>
                        ) : (
                          <span className="text-stone-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORY 2: ROASTED BULK COFFEE TABLE */}
      {activeCategory === 'roasted' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Lot Sangrai</th>
                  <th className="py-3.5 px-4">Nama Produk & Asal</th>
                  <th className="py-3.5 px-4">Roast Level & Agtron</th>
                  <th className="py-3.5 px-4">Tanggal Sangrai</th>
                  <th className="py-3.5 px-4">Format Pack</th>
                  <th className="py-3.5 px-4">Stok Pack Tersedia</th>
                  <th className="py-3.5 px-4">Harga Jual / Pack</th>
                  <th className="py-3.5 px-4 text-right">Total Nilai Retail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRoastedLots.map((rLot) => (
                  <tr key={rLot.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#714B67]">{rLot.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{rLot.origin} ({rLot.variety})</div>
                      <div className="text-[10px] text-stone-400">{rLot.processMethod}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-800">{rLot.roastLevel}</div>
                      <div className="text-[10px] text-amber-800 font-mono font-bold">
                        Agtron #{rLot.agtronNumber} (DTR: {rLot.developmentTimeRatio}%)
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">{rLot.roastDate}</td>
                    <td className="py-3.5 px-4 font-mono text-stone-800">{rLot.packageWeightGrams}g Pack</td>
                    <td className="py-3.5 px-4 font-mono font-black text-[#714B67] text-sm">
                      {rLot.availablePacks} / {rLot.totalPacks} Pack
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      Rp {rLot.pricePerPack.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-stone-950">
                      Rp {(rLot.availablePacks * rLot.pricePerPack).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORY 3: PACKAGING & CONSUMABLES */}
      {activeCategory === 'packaging' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPackaging.map((pack) => {
            const isLow = pack.stockQuantity <= pack.reorderPoint;
            return (
              <div
                key={pack.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="whitespace-nowrap text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {pack.category}
                    </span>
                    {isLow ? (
                      <span className="whitespace-nowrap px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300 inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" /> Reorder Soon
                      </span>
                    ) : (
                      <span className="whitespace-nowrap px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                        In Stock
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{pack.name}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{pack.materialSpec}</p>
                  </div>

                  <div className="bg-[#F8F9FA] p-3 rounded-2xl border border-stone-200/80 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Biaya Satuan:</span>
                      <strong className="text-stone-800 font-mono">Rp {pack.unitCost.toLocaleString()} / pcs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Ambang Reorder:</span>
                      <strong className="text-stone-800 font-mono">{pack.reorderPoint} pcs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Supplier:</span>
                      <span className="text-stone-700 truncate max-w-[140px]">{pack.supplier}</span>
                    </div>
                  </div>
                </div>

                {/* Stock Adjuster */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Stok Saat Ini:</span>
                    <span className="text-base font-black text-[#714B67] font-mono">{pack.stockQuantity} Pcs</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updatePackagingStock(pack.id, -20)}
                      className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-black transition-colors"
                      title="Kurangi 20 pcs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updatePackagingStock(pack.id, 50)}
                      className="w-8 h-8 rounded-xl bg-[#714B67] hover:bg-[#5A3950] text-white flex items-center justify-center font-black transition-colors shadow-2xs"
                      title="Tambah 50 pcs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <IncomingQCModal isOpen={!!qcModalLot} onClose={() => setQcModalLot(null)} lot={qcModalLot} />
    </div>
  );
};
