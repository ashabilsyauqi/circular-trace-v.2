import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import {
  MapPin,
  Sparkles,
  CheckCircle2,
  Cherry,
  Scale,
  DollarSign,
  Droplets,
  Mountain,
  Package,
  Flame,
  FileText,
  Warehouse,
} from 'lucide-react';
import { FarmerHarvestLot } from '../../types/coffee';
import { ProcessingMethod } from '../../types/processorErp';
import { RecordBreadcrumb } from '../shared/RecordBreadcrumb';
import { StatusPipeline, PipelineStage } from '../shared/StatusPipeline';
import { StatButton } from '../shared/StatButton';
import { ControlPanel } from '../shared/ControlPanel';
import { ActivityFeed } from '../shared/ActivityFeed';

const SOURCING_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'penerimaan', label: 'Penerimaan Ceri' },
  { id: 'uji_brix', label: 'Sortasi & Brix' },
  { id: 'fermentasi', label: 'Tangki Fermentasi' },
  { id: 'penjemuran', label: 'Penjemuran Solar' },
  { id: 'hulling', label: 'Hulling Mill' },
  { id: 'siap_green', label: 'Green Bean Siap' },
];

export const SourcingModule: React.FC = () => {
  const {
    farmerLots,
    buyCherryToStock,
    createProcessingBatch,
    setActiveProcessingBatchId,
    setProcessorActiveTab,
    seedFarmerLots,
  } = useCoffee();

  const [successMsg, setSuccessMsg] = useState<{ title: string; desc: string } | null>(null);
  const [detailLot, setDetailLot] = useState<FarmerHarvestLot | null>(null);

  // Detail Sheet Form State
  const [detailBuyKg, setDetailBuyKg] = useState<number>(500);
  const [detailMethod, setDetailMethod] = useState<ProcessingMethod>('Natural / Dry');

  // ControlPanel & View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'cards'>('table');

  const availableFarmerLots = farmerLots.filter((lot) => lot.availableWeightKg > 0);

  const filteredLots = availableFarmerLots.filter((lot) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      lot.id.toLowerCase().includes(q) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.farmerName.toLowerCase().includes(q) ||
      lot.farmLocation.toLowerCase().includes(q);
    return matchesSearch;
  });

  const handleOpenDetail = (lot: FarmerHarvestLot) => {
    setDetailLot(lot);
    setDetailBuyKg(lot.availableWeightKg);
    setDetailMethod('Natural / Dry');
  };

  // Direct 1-click buy to raw materials warehouse stock
  const handleDirectBuyToStock = (lot: FarmerHarvestLot, buyKg?: number) => {
    const amount = buyKg || lot.availableWeightKg;
    const stockItem = buyCherryToStock(lot.id, amount);

    if (stockItem) {
      setSuccessMsg({
        title: `Sukses Membeli ${amount} kg Ceri Segar!`,
        desc: `Ceri dari petani ${lot.farmerName} (${lot.variety}) senilai Rp ${(amount * lot.pricePerKg).toLocaleString()} telah masuk ke Gudang Bahan Baku Anda.`,
      });
      if (detailLot) setDetailLot(null);
      setTimeout(() => setSuccessMsg(null), 6000);
    }
  };

  // Direct 1-click create 7-stage processing batch & navigate directly into interactive Lembar Kerja
  const handleDirectStart7Stage = (lot: FarmerHarvestLot, buyKg?: number, method?: ProcessingMethod) => {
    const amount = buyKg || lot.availableWeightKg;
    const chosenMethod = method || 'Natural / Dry';

    const newBatch = createProcessingBatch({
      sourceFarmerLotId: lot.id,
      boughtCherryKg: Number(amount),
      method: chosenMethod,
      dryingMethod: 'Solar Dryer Raised Bed',
      operatorName: 'Budi Santoso (Mill Master)',
      notes: `Batch pengolahan metode ${chosenMethod} dari panen ceri segar petani ${lot.farmerName} (${lot.farmLocation}).`,
    });

    if (detailLot) setDetailLot(null);

    if (newBatch) {
      setActiveProcessingBatchId(newBatch.id);
      setProcessorActiveTab('batches');
    }
  };

  const totalAvailableCherryKg = availableFarmerLots.reduce((acc, lot) => acc + lot.availableWeightKg, 0);
  const avgBrix = availableFarmerLots.length > 0 ? (availableFarmerLots.reduce((acc, l) => acc + l.brix, 0) / availableFarmerLots.length).toFixed(1) : '21.5';
  const estTotalCherryValue = availableFarmerLots.reduce((acc, lot) => acc + (lot.availableWeightKg * lot.pricePerKg), 0);

  return (
    <div className="space-y-4">
      {!detailLot && (
        <>
          {/* Top Stat Buttons (Skripsi ERP Executive Header) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
            <div className="o_stat_button bg-white shadow-2xs border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Cherry className="w-5 h-5" />
              </div>
              <div>
                <div className="o_stat_value text-amber-900">{availableFarmerLots.length} Lot Panen</div>
                <div className="o_stat_text text-slate-500">Tersedia di Petani</div>
              </div>
            </div>

            <div className="o_stat_button bg-white shadow-2xs border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="o_stat_value text-emerald-900">{totalAvailableCherryKg.toLocaleString()} kg</div>
                <div className="o_stat_text text-slate-500">Total Pasokan Ceri</div>
              </div>
            </div>

            <div className="o_stat_button bg-white shadow-2xs border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <div className="o_stat_value text-purple-900">{avgBrix}° Brix</div>
                <div className="o_stat_text text-slate-500">Rata-rata Kemanisan</div>
              </div>
            </div>

            <div className="o_stat_button bg-white shadow-2xs border border-stone-200 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="o_stat_value text-stone-900">Rp {(estTotalCherryValue / 1000000).toFixed(1)} jt</div>
                <div className="o_stat_text text-stone-500">Est. Nilai Pengadaan</div>
              </div>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-start justify-between shadow-2xs animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-black text-emerald-900">{successMsg.title}</div>
                  <div className="text-emerald-800 mt-0.5">{successMsg.desc}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setProcessorActiveTab('inventory')}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Buka Gudang →
                </button>
                <button
                  onClick={() => setSuccessMsg(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold px-1 cursor-pointer"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          {/* Control Panel */}
          <ControlPanel
            breadcrumbs={[{ label: 'Processing Mill' }, { label: '1. Sourcing Ceri Petani' }]}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode === 'cards' ? 'kanban' : 'table'}
            onViewModeChange={(m) => setViewMode(m === 'table' ? 'table' : 'cards')}
            recordCount={filteredLots.length}
          />

          {filteredLots.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
              <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">Belum ada ceri petani yang tersedia</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto mb-4">
                Semua lot panen petani telah dibeli atau tersaring. Klik tombol di bawah untuk memuat 10 data seeder panen petani Nusantara.
              </p>
              <button
                onClick={seedFarmerLots}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Muat Ulang Seeder Panen Petani (10 Lot)</span>
              </button>
            </div>
          ) : (
            <>
              {/* VIEW 1: CARDS GRID VIEW */}
              {viewMode === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredLots.map((lot) => (
                    <div
                      key={lot.id}
                      onClick={() => handleOpenDetail(lot)}
                      className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between cursor-pointer group"
                    >
                      <div>
                        <div className="relative h-44 bg-stone-100 overflow-hidden">
                          <img
                            src={lot.photoUrl}
                            alt={lot.variety}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md">
                            {lot.id}
                          </div>
                          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                            Tersedia {lot.availableWeightKg} kg
                          </div>
                        </div>

                        <div className="p-5 space-y-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Petani: {lot.farmerName}
                            </span>
                            <h3 className="font-bold text-base text-stone-900 mt-1 group-hover:text-amber-800 transition-colors">
                              {lot.variety}
                            </h3>
                            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-stone-400" />
                              {lot.farmLocation}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                            <div>
                              <span className="text-[10px] text-stone-400 block font-semibold">Elevasi:</span>
                              <span className="font-semibold text-stone-800">{lot.altitude}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-stone-400 block font-semibold">Brix:</span>
                              <span className="font-black text-emerald-700">{lot.brix}° Brix</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-stone-400 block font-semibold">Petik:</span>
                              <span className="font-semibold text-stone-800 truncate block">
                                {lot.pickingMethod.split(' ')[0]}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-stone-400 block font-semibold">Panen:</span>
                              <span className="font-semibold text-stone-800">{lot.harvestDate}</span>
                            </div>
                          </div>

                          <p className="text-xs text-stone-600 line-clamp-2 italic">"{lot.notes}"</p>
                        </div>
                      </div>

                      <div className="p-4 bg-stone-50 border-t border-stone-100 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-stone-400 font-semibold uppercase">Harga Ceri:</span>
                          <span className="text-sm font-black text-stone-900 font-mono">
                            Rp {lot.pricePerKg.toLocaleString()}
                            <span className="text-xs font-normal text-stone-500 font-sans"> / kg</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDirectBuyToStock(lot);
                            }}
                            className="w-full py-2 px-2.5 rounded-xl border border-stone-300 hover:border-emerald-500 hover:bg-emerald-50 text-stone-800 hover:text-emerald-950 font-bold text-[11px] transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                            title="Beli ceri dan simpan ke gudang bahan baku"
                          >
                            <Warehouse className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Beli ke Gudang</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDirectStart7Stage(lot);
                            }}
                            className="w-full py-2 px-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] transition-colors shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                            title="Beli ceri dan langsung mulai lembar kerja pengolahan 7-stage"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>Olah 7-Stage →</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* VIEW 2: ODOO ERP LIST TABLE */}
              {viewMode === 'table' && (
                <div className="o_form_sheet p-0 overflow-hidden bg-white border border-stone-200 rounded-2xl shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="o_list_table w-full text-left text-xs text-stone-700">
                      <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3.5 px-4">ID Lot Ceri</th>
                          <th className="py-3.5 px-4">Petani &amp; Varietas</th>
                          <th className="py-3.5 px-4">Lokasi &amp; Elevasi</th>
                          <th className="py-3.5 px-4">Kemanisan Brix</th>
                          <th className="py-3.5 px-4">Stok Ceri</th>
                          <th className="py-3.5 px-4">Harga / kg</th>
                          <th className="py-3.5 px-4 text-right">Tindakan Cepat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredLots.map((lot) => (
                          <tr
                            key={lot.id}
                            onClick={() => handleOpenDetail(lot)}
                            className="hover:bg-amber-50/40 cursor-pointer transition-colors"
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{lot.id}</td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-stone-900">{lot.variety}</div>
                              <div className="text-[11px] text-stone-500">Petani: {lot.farmerName}</div>
                            </td>
                            <td className="py-3.5 px-4 text-stone-700">
                              <div>{lot.farmLocation}</div>
                              <div className="text-[11px] text-stone-400">{lot.altitude}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-black text-emerald-700 font-mono text-sm">{lot.brix}° Brix</span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-stone-900 font-mono">
                              {lot.availableWeightKg} kg
                            </td>
                            <td className="py-3.5 px-4 font-bold text-stone-900 font-mono">
                              Rp {lot.pricePerKg.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDirectBuyToStock(lot);
                                  }}
                                  className="btn-odoo-secondary text-xs py-1 px-2.5"
                                >
                                  <Warehouse className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Beli ke Gudang</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDirectStart7Stage(lot);
                                  }}
                                  className="btn-odoo-primary text-xs py-1 px-3"
                                >
                                  <Flame className="w-3.5 h-3.5" />
                                  <span>Olah 7-Stage →</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 3: KANBAN VIEW */}
              {viewMode === 'kanban' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-stone-50/70 rounded-2xl p-4 border border-stone-200/80 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                      <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        Ceri Siap Diolah (High Brix ≥ 20°)
                      </h4>
                      <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                        {filteredLots.filter((l) => l.brix >= 20).length} Lot
                      </span>
                    </div>
                    <div className="space-y-3">
                      {filteredLots
                        .filter((l) => l.brix >= 20)
                        .map((lot) => (
                          <div
                            key={lot.id}
                            onClick={() => handleOpenDetail(lot)}
                            className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer space-y-3"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-bold text-stone-900">{lot.id}</span>
                              <span className="font-black text-emerald-700 font-mono">{lot.brix}° Brix</span>
                            </div>
                            <div>
                              <h5 className="font-bold text-sm text-stone-900">{lot.variety}</h5>
                              <p className="text-[11px] text-stone-500">{lot.farmerName} • {lot.altitude}</p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                              <span className="font-bold text-stone-700 font-mono">{lot.availableWeightKg} kg</span>
                              <span className="font-black text-amber-900 font-mono">Rp {lot.pricePerKg.toLocaleString()}/kg</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDirectBuyToStock(lot);
                                }}
                                className="w-full py-1.5 rounded-lg border border-stone-300 hover:bg-emerald-50 text-stone-800 text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                Beli ke Gudang
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDirectStart7Stage(lot);
                                }}
                                className="w-full py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                Olah 7-Stage →
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-stone-50/70 rounded-2xl p-4 border border-stone-200/80 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                      <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        Ceri Standar (&lt; 20° Brix)
                      </h4>
                      <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                        {filteredLots.filter((l) => l.brix < 20).length} Lot
                      </span>
                    </div>
                    <div className="space-y-3">
                      {filteredLots
                        .filter((l) => l.brix < 20)
                        .map((lot) => (
                          <div
                            key={lot.id}
                            onClick={() => handleOpenDetail(lot)}
                            className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer space-y-3"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-bold text-stone-900">{lot.id}</span>
                              <span className="font-bold text-amber-700 font-mono">{lot.brix}° Brix</span>
                            </div>
                            <div>
                              <h5 className="font-bold text-sm text-stone-900">{lot.variety}</h5>
                              <p className="text-[11px] text-stone-500">{lot.farmerName} • {lot.altitude}</p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                              <span className="font-bold text-stone-700 font-mono">{lot.availableWeightKg} kg</span>
                              <span className="font-black text-amber-900 font-mono">Rp {lot.pricePerKg.toLocaleString()}/kg</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDirectBuyToStock(lot);
                                }}
                                className="w-full py-1.5 rounded-lg border border-stone-300 hover:bg-emerald-50 text-stone-800 text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                Beli ke Gudang
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDirectStart7Stage(lot);
                                }}
                                className="w-full py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                Olah 7-Stage →
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ======================================================== */}
      {/* CHERRY LOT DOCUMENT DETAIL SHEET VIEW                    */}
      {/* ======================================================== */}
      {detailLot && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <RecordBreadcrumb
            listLabel="Pengadaan Ceri Petani"
            recordLabel={detailLot.id}
            onBack={() => setDetailLot(null)}
          />

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="bg-[#FAF7F2] px-6 py-5 border-b border-stone-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
                  <Cherry className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-stone-900 font-mono">{detailLot.id}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                      {detailLot.variety}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Petani: <strong>{detailLot.farmerName}</strong> • Asal: {detailLot.farmLocation} ({detailLot.altitude}) • Panen: {detailLot.harvestDate}
                  </p>
                </div>
              </div>

              <StatusPipeline stages={SOURCING_PIPELINE_STAGES} currentStageId="penerimaan" />
            </div>

            <div className="px-6 py-4 bg-white border-b border-stone-100 flex flex-wrap gap-2.5">
              <StatButton
                icon={<Scale className="w-4 h-4" />}
                value={`${detailLot.availableWeightKg} / ${detailLot.totalWeightKg} kg`}
                label="Stok Ceri Tersedia"
                color="emerald"
              />
              <StatButton
                icon={<Droplets className="w-4 h-4" />}
                value={`${detailLot.brix}° Brix`}
                label="Kadar Gula Buah"
                color="purple"
              />
              <StatButton
                icon={<Mountain className="w-4 h-4" />}
                value={detailLot.altitude}
                label="Elevasi Kebun"
                color="stone"
              />
              <StatButton
                icon={<DollarSign className="w-4 h-4" />}
                value={`Rp ${detailLot.pricePerKg.toLocaleString()}`}
                label="Harga Ceri / kg"
                color="amber"
              />
              <StatButton
                icon={<Package className="w-4 h-4" />}
                value={`~${Math.round(detailLot.availableWeightKg * 0.16)} kg`}
                label="Estimasi Yield Green Bean"
                color="stone"
              />
            </div>

            <div className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Cherry className="w-4 h-4 text-amber-700" /> Spesifikasi Panen Petani
                  </h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Varietas Ceri</dt>
                      <dd className="font-bold text-stone-900">{detailLot.variety}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Metode Petik</dt>
                      <dd className="font-bold text-stone-900">{detailLot.pickingMethod}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Kadar Gula (°Brix)</dt>
                      <dd className="font-black text-emerald-700">{detailLot.brix}° Brix</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Tanggal Panen</dt>
                      <dd className="font-bold text-stone-900">{detailLot.harvestDate}</dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-stone-500">Total Berat Panen Awal</dt>
                      <dd className="font-bold text-stone-900">{detailLot.totalWeightKg} kg</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-700" /> Petani & Lokasi Lahan
                  </h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Nama Petani</dt>
                      <dd className="font-bold text-stone-900">{detailLot.farmerName}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Lokasi Kebun</dt>
                      <dd className="font-bold text-stone-900">{detailLot.farmLocation}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Elevasi Kebun</dt>
                      <dd className="font-bold text-stone-900">{detailLot.altitude}</dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-stone-500">Catatan Petani</dt>
                      <dd className="font-medium text-stone-800 text-right">{detailLot.notes || '—'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* ERP Workstation Action Box */}
              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/40 border-2 border-amber-300 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-700" />
                    <div>
                      <h4 className="text-sm font-black text-amber-950 uppercase tracking-wider">
                        Workstation Transaksi &amp; Inisiasi Pengolahan Ceri
                      </h4>
                      <p className="text-[11px] text-stone-600">
                        Pilih volume dan tindakan yang ingin dilakukan tanpa pop-up.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-950 font-mono font-bold text-xs">
                    Maks {detailLot.availableWeightKg} kg
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Volume Beli Ceri (kg)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={detailLot.availableWeightKg}
                      value={detailBuyKg}
                      onChange={(e) => setDetailBuyKg(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-mono font-black text-sm text-amber-950 focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      Estimasi Yield Green Bean: ~<strong>{Math.round(detailBuyKg * 0.16)} kg</strong> (rendemen ~16%)
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Rencana Metode Olah
                    </label>
                    <select
                      value={detailMethod}
                      onChange={(e) => setDetailMethod(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Natural / Dry">1. Natural (Dry) — Ceri Utuh Langsung Jemur</option>
                      <option value="Full Washed">2. Washed (Wet) — Depulper, Fermentasi Tangki & Cuci</option>
                      <option value="Honey (Yellow/Red)">3. Honey (Pulped Natural) — Depulper, Sisakan Lendir</option>
                      <option value="Wet Hulled (Giling Basah)">4. Wet Hulled (Giling Basah) — Hulling Lembek</option>
                      <option value="Anaerobic Natural">Anaerobic Natural — Sealed Tank Ferment</option>
                      <option value="Wine Process">Wine Process — Extended Ferment</option>
                    </select>
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      Metode dapat disesuaikan lagi di Lembar Kerja.
                    </span>
                  </div>

                  <div className="flex flex-col justify-center bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
                    <span className="text-[10px] text-stone-500 font-semibold uppercase">Total Nilai Transaksi:</span>
                    <strong className="text-lg font-black text-amber-950 font-mono mt-0.5">
                      Rp {(detailBuyKg * detailLot.pricePerKg).toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      ✓ Petik Merah Brix {detailLot.brix}°
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-amber-200/80">
                  <button
                    type="button"
                    onClick={() => handleDirectBuyToStock(detailLot, detailBuyKg)}
                    className="px-5 py-3 rounded-2xl border-2 border-emerald-600 bg-white hover:bg-emerald-50 text-emerald-950 font-black text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Warehouse className="w-4 h-4 text-emerald-700" />
                    <span>1. Beli Masuk Stok Gudang (Bahan Baku)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectStart7Stage(detailLot, detailBuyKg, detailMethod)}
                    className="px-6 py-3 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Flame className="w-4 h-4" />
                    <span>2. Beli &amp; Mulai Lembar Kerja (7-Stage) →</span>
                  </button>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="pt-2 border-t border-stone-200">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-700" /> Log Penerimaan & Verifikasi Ceri
                </h4>
                <ActivityFeed
                  documentTitle={`Pengadaan Ceri #${detailLot.id}`}
                  initialMessages={[
                    {
                      id: 'm1',
                      author: detailLot.farmerName,
                      type: 'note',
                      content: `Ceri petik merah ${detailLot.variety} tersedia dengan Brix ${detailLot.brix}° dari lahan ${detailLot.farmLocation}.`,
                      timestamp: detailLot.harvestDate,
                    },
                    {
                      id: 'm2',
                      author: 'Stasiun Pengolah',
                      type: 'system',
                      content: 'Lot terdaftar di sistem pengadaan mill dan siap diproses ke tangki fermentasi atau disimpan ke gudang.',
                      timestamp: 'Hari ini',
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
