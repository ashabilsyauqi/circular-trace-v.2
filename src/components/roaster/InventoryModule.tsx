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
  Scale,
  Award,
  MapPin,
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { MetricCard } from '../admin/MetricCard';
import { RoasterPackagingItem } from '../../types/roasterErp';
import { WarehouseLot, RoastedBeanLot } from '../../types/coffee';
import { ControlPanel } from '../shared/ControlPanel';
import { StatButton } from '../shared/StatButton';
import { RecordBreadcrumb } from '../shared/RecordBreadcrumb';
import { StatusPipeline, PipelineStage } from '../shared/StatusPipeline';
import { IncomingQCModal } from './IncomingQCModal';

// Same honest stock-level pipeline used across the app for the `available -> partial -> sold`
// status shape (WarehouseLot and RoastedBeanLot both use it) — no invented workflow steps.
const STOCK_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'available', label: 'Tersedia' },
  { id: 'partial', label: 'Terjual Sebagian' },
  { id: 'sold', label: 'Habis Terjual' },
];

export const InventoryModule: React.FC = () => {
  const {
    currentUser,
    warehouseLots,
    roastedLots,
    packagingInventory,
    updatePackagingStock,
  } = useCoffee();

  const myRoastedLots = roastedLots.filter((r) => !r.roasterId || r.roasterId === currentUser?.id);
  const myPackagingInventory = packagingInventory.filter((p) => !p.roasterId || p.roasterId === currentUser?.id);

  const [activeCategory, setActiveCategory] = useState<'green' | 'roasted' | 'packaging'>('green');
  const [searchQuery, setSearchQuery] = useState('');
  const [qcModalLot, setQcModalLot] = useState<WarehouseLot | null>(null);
  const [detailGreenLot, setDetailGreenLot] = useState<WarehouseLot | null>(null);
  const [detailRoastedLot, setDetailRoastedLot] = useState<RoastedBeanLot | null>(null);

  const pendingQcCount = warehouseLots.filter((l) => l.qcStatus === 'pending_qc').length;

  // Valuation Computations
  const totalGreenKg = warehouseLots.reduce((acc, curr) => acc + curr.availableWeightKg, 0);
  const totalGreenValue = warehouseLots.reduce(
    (acc, curr) => acc + curr.availableWeightKg * curr.purchasePricePerKg,
    0
  );

  const totalRoastedPacks = myRoastedLots.reduce((acc, curr) => acc + curr.availablePacks, 0);
  const totalRoastedValue = myRoastedLots.reduce(
    (acc, curr) => acc + curr.availablePacks * curr.pricePerPack,
    0
  );

  const totalPackagingPcs = myPackagingInventory.reduce((acc, curr) => acc + curr.stockQuantity, 0);
  const totalPackagingValue = myPackagingInventory.reduce(
    (acc, curr) => acc + curr.stockQuantity * curr.unitCost,
    0
  );

  const grandTotalValue = totalGreenValue + totalRoastedValue + totalPackagingValue;

  const filteredWarehouseLots = warehouseLots.filter((l) =>
    l.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRoastedLots = myRoastedLots.filter((r) =>
    r.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.roastLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPackaging = myPackagingInventory.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {!detailGreenLot && !detailRoastedLot && (
      <>
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
              ? 'bg-[#EA580C] text-white shadow-xs'
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
              ? 'bg-[#EA580C] text-white shadow-xs'
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
              ? 'bg-[#EA580C] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Packaging & Consumables ({packagingInventory.length} Item)</span>
        </button>
      </div>

      {/* Toolbar / Control Panel */}
      <ControlPanel
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
              <thead className="bg-[#FAF7F2] text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-5">Lot ID</th>
                  <th className="py-4 px-5">Origin & Varietas</th>
                  <th className="py-4 px-5">Proses & Mutu</th>
                  <th className="py-4 px-5">Lokasi Silo / Bay</th>
                  <th className="py-4 px-5">Stok Tersedia (Kg)</th>
                  <th className="py-4 px-5">HPP Modal (Rp/Kg)</th>
                  <th className="py-4 px-5">Total Nilai Aset</th>
                  <th className="py-4 px-5">Status Stok</th>
                  <th className="py-4 px-5 text-right">Aksi</th>
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
                    <tr
                      key={lot.id}
                      onClick={() => setDetailGreenLot(lot)}
                      className="hover:bg-amber-50/60 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-5 font-mono font-bold text-sm text-stone-900">{lot.id}</td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-stone-900">{lot.origin}</div>
                        <div className="text-[10px] text-stone-400">{lot.variety} • {lot.altitude}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-semibold text-stone-800">{lot.processMethod}</div>
                        <div className="text-[10px] text-amber-800 font-mono font-bold">
                          {qc === 'pending_qc' ? 'Menunggu skor QC' : `SCA ${lot.verifiedScaScore} (KA: ${lot.moistureContentPercent || 11.2}%)`}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-stone-600">{lot.storageLocation}</td>
                      <td className="py-4 px-5 font-mono font-black text-stone-900 text-sm">
                        {lot.availableWeightKg} kg
                      </td>
                      <td className="py-4 px-5 text-stone-800">
                        Rp {lot.purchasePricePerKg.toLocaleString()}
                      </td>
                      <td className="py-4 px-5 font-black text-sm text-stone-900">
                        Rp {(lot.availableWeightKg * lot.purchasePricePerKg).toLocaleString()}
                      </td>
                      <td className="py-4 px-5">
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
                      <td className="py-4 px-5 text-right">
                        {qc === 'pending_qc' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQcModalLot(lot);
                            }}
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
              <thead className="bg-[#FAF7F2] text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-5">Lot Sangrai</th>
                  <th className="py-4 px-5">Nama Produk & Asal</th>
                  <th className="py-4 px-5">Roast Level & Agtron</th>
                  <th className="py-4 px-5">Tanggal Sangrai</th>
                  <th className="py-4 px-5">Format Pack</th>
                  <th className="py-4 px-5">Stok Pack Tersedia</th>
                  <th className="py-4 px-5">Harga Jual / Pack</th>
                  <th className="py-4 px-5 text-right">Total Nilai Retail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRoastedLots.map((rLot) => (
                  <tr
                    key={rLot.id}
                    onClick={() => setDetailRoastedLot(rLot)}
                    className="hover:bg-amber-50/60 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-5 font-mono font-bold text-sm text-[#EA580C]">{rLot.id}</td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-stone-900">{rLot.origin} ({rLot.variety})</div>
                      <div className="text-[10px] text-stone-400">{rLot.processMethod}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-stone-800">{rLot.roastLevel}</div>
                      <div className="text-[10px] text-amber-800 font-mono font-bold">
                        Agtron #{rLot.agtronNumber} (DTR: {rLot.developmentTimeRatio}%)
                      </div>
                    </td>
                    <td className="py-4 px-5 text-stone-600">{rLot.roastDate}</td>
                    <td className="py-4 px-5 font-mono text-stone-800">{rLot.packageWeightGrams}g Pack</td>
                    <td className="py-4 px-5 font-mono font-black text-[#EA580C] text-sm">
                      {rLot.availablePacks} / {rLot.totalPacks} Pack
                    </td>
                    <td className="py-4 px-5 font-bold text-stone-900">
                      Rp {rLot.pricePerPack.toLocaleString()}
                    </td>
                    <td className="py-4 px-5 text-right font-black text-stone-950">
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

                  <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-stone-200/80 text-xs space-y-1.5">
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
                    <span className="text-base font-black text-[#EA580C] font-mono">{pack.stockQuantity} Pcs</span>
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
                      className="w-8 h-8 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white flex items-center justify-center font-black transition-colors shadow-2xs"
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
      </>
      )}

      {/* GREEN COFFEE LOT DETAIL PAGE */}
      {detailGreenLot && (
        <div>
          <RecordBreadcrumb
            listLabel="Green Coffee Silo"
            recordLabel={detailGreenLot.id}
            onBack={() => setDetailGreenLot(null)}
          />
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
            <div className="bg-[#FAF7F2] px-6 py-5 border-b border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-600">
                  <Warehouse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 font-mono">{detailGreenLot.id}</h3>
                  <p className="text-[10px] text-stone-500">
                    {detailGreenLot.origin} — {detailGreenLot.variety} • Disimpan: {detailGreenLot.storedDate}
                  </p>
                </div>
              </div>
              <StatusPipeline stages={STOCK_PIPELINE_STAGES} currentStageId={detailGreenLot.status} />
            </div>

            <div className="px-6 py-3 bg-white border-b border-stone-100 flex flex-wrap gap-2">
              <StatButton
                icon={<Scale className="w-4 h-4" />}
                value={`${detailGreenLot.availableWeightKg}/${detailGreenLot.weightKg} kg`}
                label="Stok Tersisa"
                color="emerald"
              />
              <StatButton
                icon={<DollarSign className="w-4 h-4" />}
                value={`Rp ${detailGreenLot.purchasePricePerKg.toLocaleString()}`}
                label="HPP Modal / Kg"
                color="amber"
              />
              <StatButton
                icon={<Award className="w-4 h-4" />}
                value={detailGreenLot.verifiedScaScore}
                label="Skor SCA Terverifikasi"
                color="purple"
              />
              <StatButton
                icon={<MapPin className="w-4 h-4" />}
                value={detailGreenLot.storageLocation}
                label="Lokasi Silo / Bay"
                color="blue"
              />
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-[11px] font-black uppercase text-stone-500 tracking-wider mb-3 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5" /> Spesifikasi & Mutu
                </h4>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Origin / Varietas</dt>
                    <dd className="font-bold text-stone-900">{detailGreenLot.origin} • {detailGreenLot.variety}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Metode Proses</dt>
                    <dd className="font-bold text-stone-900">{detailGreenLot.processMethod}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Grade Tier</dt>
                    <dd className="font-bold text-stone-900">{detailGreenLot.gradeTier}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Screen Size / Defect</dt>
                    <dd className="font-bold text-stone-900">{detailGreenLot.screenSize} • {detailGreenLot.defectCount} cacat</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-stone-500">Status QC Masuk</dt>
                    <dd className="font-bold text-stone-900">{detailGreenLot.qcStatus ?? 'passed'}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase text-stone-500 tracking-wider mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Asal & Penyimpanan
                </h4>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Petani Sumber</dt>
                    <dd className="font-bold text-stone-900">{detailGreenLot.sourceFarmerName}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Pengolah Sumber</dt>
                    <dd className="font-bold text-stone-900">{detailGreenLot.sourceProcessorName}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Gudang Pemasok</dt>
                    <dd className="font-bold text-stone-900">{detailGreenLot.warehouseName}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Suhu / Kelembapan</dt>
                    <dd className="font-bold text-stone-900">{detailGreenLot.temperatureCelsius}°C • {detailGreenLot.humidityPercent}%</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-stone-500">Kemasan</dt>
                    <dd className="font-bold text-stone-900 text-right">{detailGreenLot.packagingType}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROASTED LOT DETAIL PAGE */}
      {detailRoastedLot && (
        <div>
          <RecordBreadcrumb
            listLabel="Roasted Bulk Coffee"
            recordLabel={detailRoastedLot.id}
            onBack={() => setDetailRoastedLot(null)}
          />
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
            <div className="bg-[#FAF7F2] px-6 py-5 border-b border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-600">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 font-mono">{detailRoastedLot.id}</h3>
                  <p className="text-[10px] text-stone-500">
                    {detailRoastedLot.origin} — {detailRoastedLot.variety} • Sangrai: {detailRoastedLot.roastDate}
                  </p>
                </div>
              </div>
              <StatusPipeline stages={STOCK_PIPELINE_STAGES} currentStageId={detailRoastedLot.status} />
            </div>

            <div className="px-6 py-3 bg-white border-b border-stone-100 flex flex-wrap gap-2">
              <StatButton
                icon={<Scale className="w-4 h-4" />}
                value={`${detailRoastedLot.availablePacks}/${detailRoastedLot.totalPacks} pack`}
                label="Stok Tersisa"
                color="emerald"
              />
              <StatButton
                icon={<DollarSign className="w-4 h-4" />}
                value={`Rp ${detailRoastedLot.pricePerPack.toLocaleString()}`}
                label="Harga / Pack"
                color="amber"
              />
              <StatButton
                icon={<Award className="w-4 h-4" />}
                value={detailRoastedLot.scaCuppingScore}
                label="Skor Cupping SCA"
                color="purple"
              />
              <StatButton
                icon={<Package className="w-4 h-4" />}
                value={`${detailRoastedLot.packageWeightGrams} g`}
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
                    <dd className="font-bold text-stone-900">{detailRoastedLot.origin} • {detailRoastedLot.variety}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Metode Proses</dt>
                    <dd className="font-bold text-stone-900">{detailRoastedLot.processMethod}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Tingkat Sangrai</dt>
                    <dd className="font-bold text-stone-900">{detailRoastedLot.roastLevel}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-stone-500">Agtron / DTR</dt>
                    <dd className="font-bold text-stone-900">
                      {detailRoastedLot.agtronNumber} • {detailRoastedLot.developmentTimeRatio}%
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase text-stone-500 tracking-wider mb-3 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Produksi & Rekomendasi
                </h4>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Petani Sumber</dt>
                    <dd className="font-bold text-stone-900">{detailRoastedLot.farmerName}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Mesin Roaster</dt>
                    <dd className="font-bold text-stone-900">{detailRoastedLot.roasterMachine}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <dt className="text-stone-500">Rekomendasi Resting</dt>
                    <dd className="font-bold text-stone-900">{detailRoastedLot.restingRecommendationDays} hari</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-stone-500">Metode Seduh</dt>
                    <dd className="font-bold text-stone-900 text-right">{detailRoastedLot.recommendedBrew.join(', ')}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      <IncomingQCModal isOpen={!!qcModalLot} onClose={() => setQcModalLot(null)} lot={qcModalLot} />
    </div>
  );
};
