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
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { MetricCard } from '../admin/MetricCard';
import { RoasterPackagingItem } from '../../types/roasterErp';

export const InventoryModule: React.FC = () => {
  const {
    warehouseLots,
    roastedLots,
    packagingInventory,
    updatePackagingStock,
  } = useCoffee();

  const [activeCategory, setActiveCategory] = useState<'green' | 'roasted' | 'packaging'>('green');
  const [searchQuery, setSearchQuery] = useState('');

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

      {/* Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveCategory('green')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'green'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>Green Coffee ({warehouseLots.length} Lot)</span>
          </button>
          <button
            onClick={() => setActiveCategory('roasted')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'roasted'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Roasted Bulk ({roastedLots.length} SKU)</span>
          </button>
          <button
            onClick={() => setActiveCategory('packaging')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'packaging'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Packaging & Bahan ({packagingInventory.length} Item)</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari item inventaris..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* CATEGORY 1: GREEN COFFEE TABLE */}
      {activeCategory === 'green' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Lot ID</th>
                  <th className="py-3.5 px-4">Origin & Varietas</th>
                  <th className="py-3.5 px-4">Proses & Mutu</th>
                  <th className="py-3.5 px-4">Lokasi Silo / Bay</th>
                  <th className="py-3.5 px-4">Stok Tersedia (Kg)</th>
                  <th className="py-3.5 px-4">HPP Modal (Rp/Kg)</th>
                  <th className="py-3.5 px-4">Total Nilai Aset</th>
                  <th className="py-3.5 px-4 text-right">Status Reorder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {warehouseLots.map((lot) => {
                  const isLow = lot.availableWeightKg < 50;
                  return (
                    <tr key={lot.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{lot.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{lot.origin}</div>
                        <div className="text-[10px] text-stone-400">{lot.variety} • {lot.altitude}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-800">{lot.processMethod}</div>
                        <div className="text-[10px] text-amber-700 font-mono">SCA {lot.verifiedScaScore} (KA: {lot.moistureContentPercent || 11.2}%)</div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">{lot.storageLocation}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-stone-900 text-sm">
                        {lot.availableWeightKg} kg
                      </td>
                      <td className="py-3.5 px-4 text-stone-800">
                        Rp {lot.purchasePricePerKg.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-black text-amber-950">
                        Rp {(lot.availableWeightKg * lot.purchasePricePerKg).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isLow ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300 inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Reorder Needed
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Stok Aman
                          </span>
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
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
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
                {roastedLots.map((rLot) => (
                  <tr key={rLot.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{rLot.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{rLot.origin} ({rLot.variety})</div>
                      <div className="text-[10px] text-stone-400">{rLot.processMethod}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-800">{rLot.roastLevel}</div>
                      <div className="text-[10px] text-amber-700 font-mono">Agtron #{rLot.agtronNumber} (DTR: {rLot.developmentTimeRatio}%)</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">{rLot.roastDate}</td>
                    <td className="py-3.5 px-4 font-mono text-stone-800">{rLot.packageWeightGrams}g Pack</td>
                    <td className="py-3.5 px-4 font-mono font-black text-amber-900 text-sm">
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
          {packagingInventory.map((pack) => {
            const isLow = pack.stockQuantity <= pack.reorderPoint;
            return (
              <div
                key={pack.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {pack.category}
                    </span>
                    {isLow ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Reorder Soon
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                        In Stock
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{pack.name}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{pack.materialSpec}</p>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Biaya Satuan:</span>
                      <strong className="text-stone-800">Rp {pack.unitCost.toLocaleString()} / pcs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Ambang Reorder:</span>
                      <strong className="text-stone-800">{pack.reorderPoint} pcs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Supplier:</span>
                      <span className="text-stone-700 truncate max-w-[140px]">{pack.supplier}</span>
                    </div>
                  </div>
                </div>

                {/* Stock Adjuster */}
                <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Stok Saat Ini:</span>
                    <span className="text-base font-black text-stone-900 font-mono">{pack.stockQuantity} Pcs</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updatePackagingStock(pack.id, -20)}
                      className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-black transition-colors"
                      title="Kurangi 20 pcs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updatePackagingStock(pack.id, 50)}
                      className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-amber-800 text-white flex items-center justify-center font-black transition-colors shadow-xs"
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
    </div>
  );
};
