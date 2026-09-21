import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import {
  Search,
  Filter,
  MapPin,
  Recycle,
  Star,
  Printer,
  X,
  Package,
  Scale,
  DollarSign,
  Award,
  Droplets,
  CheckCircle2,
  FileText,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { ProcessedGreenBeanLot, CoffeeWasteManagement } from '../../types/coffee';
import { ProcessorBarcodeModal } from '../ProcessorBarcodeModal';
import { calculateProcessorEcoRating } from '../../utils/ecoRating';
import { RecordBreadcrumb } from '../shared/RecordBreadcrumb';
import { StatusPipeline, PipelineStage } from '../shared/StatusPipeline';
import { StatButton } from '../shared/StatButton';
import { ControlPanel } from '../shared/ControlPanel';
import { ActivityFeed } from '../shared/ActivityFeed';

const GREEN_BEAN_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'olah_baru', label: 'Olah Baru' },
  { id: 'qc_moisture', label: 'QC Kadar Air' },
  { id: 'alokasi_limbah', label: 'Limbah Sirkular' },
  { id: 'labeling_karung', label: 'Label Karung' },
  { id: 'siap_jual', label: 'Siap Jual' },
  { id: 'terjual', label: 'Terjual' },
];

export const InventoryModule: React.FC = () => {
  const { currentUser, processedLots, updateProcessedLotWaste } = useCoffee();

  const [searchQuery, setSearchQuery] = useState('');
  const [processMethodFilter, setProcessMethodFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'cards'>('cards');

  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [selectedLotForBarcode, setSelectedLotForBarcode] = useState<ProcessedGreenBeanLot | null>(null);

  const [editingWasteLot, setEditingWasteLot] = useState<ProcessedGreenBeanLot | null>(null);
  const [editWasteUtilization, setEditWasteUtilization] = useState<string>('');
  const [editWasteWeight, setEditWasteWeight] = useState<number>(0);
  const [editWasteRecipient, setEditWasteRecipient] = useState<string>('');
  const [editWasteProcessingMethod, setEditWasteProcessingMethod] = useState<string>('');
  const [editWasteNotes, setEditWasteNotes] = useState<string>('');
  const [editWasteType, setEditWasteType] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState('');
  const [detailLot, setDetailLot] = useState<ProcessedGreenBeanLot | null>(null);

  const myProcessedLots = processedLots.filter((lot) => lot.processorId === currentUser?.id || true);

  const filteredProcessedLots = myProcessedLots.filter((lot) => {
    const matchMethod = processMethodFilter === 'all' || lot.processMethod === processMethodFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      lot.id.toLowerCase().includes(q) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.sourceFarmerName.toLowerCase().includes(q) ||
      lot.processMethod.toLowerCase().includes(q);
    return matchMethod && matchSearch;
  });

  const getStageForLot = (lot: ProcessedGreenBeanLot) => {
    if (lot.availableWeightKg === 0) return 'terjual';
    return 'siap_jual';
  };

  const handleOpenEditWaste = (lot: ProcessedGreenBeanLot) => {
    setEditingWasteLot(lot);
    setEditWasteType(lot.wasteManagement?.wasteType || 'Kulit Ceri (Pulp / Cascara)');
    setEditWasteUtilization(lot.wasteManagement?.utilization || 'Bahan Baku Minuman Teh Cascara & Kompos Sirkular');
    setEditWasteWeight(lot.wasteManagement?.weightKgOrLiters || Math.round(lot.greenBeanWeightKg * 2.2));
    setEditWasteRecipient(lot.wasteManagement?.recipientOrLocation || 'Kelompok Tani Tilu Lestari & Rumah Kompos');
    setEditWasteProcessingMethod(lot.wasteManagement?.processingMethod || 'Solar Dryer Raised Bed & Kompos Aerobik 30 Hari');
    setEditWasteNotes(lot.wasteManagement?.notes || '');
  };

  const handleSaveEditWaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWasteLot) return;

    const updatedWaste: CoffeeWasteManagement = {
      wasteType: editWasteType,
      utilization: editWasteUtilization,
      weightKgOrLiters: Number(editWasteWeight),
      recipientOrLocation: editWasteRecipient,
      processingMethod: editWasteProcessingMethod,
      ecoCertificate: 'sangrAI Zero-Waste Circular Standard',
      notes: editWasteNotes,
    };

    updateProcessedLotWaste(editingWasteLot.id, updatedWaste);
    setSuccessMsg(`Data alokasi limbah untuk lot ${editingWasteLot.id} berhasil diperbarui!`);
    setEditingWasteLot(null);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-4">
      {!detailLot && (
        <>
          {successMsg && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold flex items-center justify-between shadow-2xs">
              <span>{successMsg}</span>
              <button onClick={() => setSuccessMsg('')} className="text-stone-400 hover:text-stone-700 text-xs font-bold">
                Tutup
              </button>
            </div>
          )}

          {/* Enterprise Control Panel */}
          <ControlPanel
            breadcrumbs={[{ label: 'Katalog Green Bean Stasiun' }]}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={processMethodFilter}
            onFilterChange={setProcessMethodFilter}
            filterOptions={[
              { id: 'all', label: 'Semua Metode' },
              { id: 'Full Washed', label: 'Full Washed' },
              { id: 'Natural / Dry', label: 'Natural / Dry' },
              { id: 'Honey (Yellow/Red)', label: 'Honey' },
              { id: 'Anaerobic Natural', label: 'Anaerobic Natural' },
              { id: 'Wine Process', label: 'Wine Process' },
            ]}
            viewMode={viewMode === 'cards' ? 'table' : viewMode}
            onViewModeChange={(m) => setViewMode(m as any)}
            recordCount={filteredProcessedLots.length}
          />

          {/* VIEW 1: CARDS GRID VIEW */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProcessedLots.map((gb) => {
                const isAvailable = gb.availableWeightKg > 0;
                const ecoRating = calculateProcessorEcoRating(
                  gb.wasteManagement,
                  gb.sourceTotalCherryWeightKg || gb.greenBeanWeightKg * 5,
                  gb.greenBeanWeightKg
                );

                return (
                  <div
                    key={gb.id}
                    onClick={() => setDetailLot(gb)}
                    className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="relative h-44 bg-stone-100 overflow-hidden">
                        <img src={gb.photoUrl} alt={gb.variety} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md">
                          {gb.id}
                        </div>
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <span className="bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                            {gb.processMethod}
                          </span>
                          {isAvailable ? (
                            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs">
                              Stok: {gb.availableWeightKg} kg
                            </span>
                          ) : (
                            <span className="bg-stone-800 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs">
                              Terjual
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div>
                          <div className="flex items-center gap-1 text-[11px] text-stone-500 mb-1">
                            <span>Asal Ceri:</span>
                            <strong className="text-stone-800">{gb.sourceFarmerName}</strong>
                            <span>({gb.sourceFarmerLotId})</span>
                          </div>
                          <h3 className="font-bold text-base text-stone-900 group-hover:text-amber-800 transition-colors">
                            {gb.variety} - {gb.grade}
                          </h3>
                          <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            {gb.sourceOrigin} ({gb.altitude})
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Kadar Air:</span>
                            <span className="font-bold text-stone-800">{gb.moistureContentPercent}%</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Water Activity:</span>
                            <span className="font-bold text-stone-800">{gb.waterActivityAw} aW</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Defect Biji:</span>
                            <span className="font-bold text-stone-800">{gb.defectCount} defect/350g</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Fermentasi:</span>
                            <span className="font-bold text-stone-800">{gb.fermentationTimeHours} Jam</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {gb.cuppingNotes.map((note, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200"
                            >
                              {note}
                            </span>
                          ))}
                        </div>

                        <div className="mt-2 p-2.5 rounded-xl bg-teal-50/90 border border-teal-200 text-teal-950 text-[11px] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Recycle className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                              <span className="font-bold truncate text-teal-950">
                                {gb.wasteManagement?.utilization || 'Dikomposkan Jadi Pupuk Kebun'}
                              </span>
                            </div>
                            <span className="font-bold text-[10px] text-emerald-800 shrink-0 bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-300 flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                              ⭐ {ecoRating.starRating} ({ecoRating.ecoScore} Pts)
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-teal-800/80 border-t border-teal-200/60 pt-1">
                            <span>Limbah: {gb.wasteManagement?.weightKgOrLiters || Math.round(gb.greenBeanWeightKg * 2.2)} kg</span>
                            <span className="text-emerald-700 font-semibold">-{ecoRating.carbonOffsetKg} kg CO₂e</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Harga Green Bean:</span>
                        <span className="text-sm font-black text-stone-900">
                          Rp {gb.pricePerKg.toLocaleString()}
                          <span className="text-xs font-normal text-stone-500"> / kg</span>
                        </span>
                      </div>

                      <div className="text-right flex items-center gap-1 text-xs font-bold text-amber-800 group-hover:translate-x-1 transition-transform">
                        <span>Detail Lot</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW 2: TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">ID Green Bean</th>
                      <th className="py-3.5 px-4">Varietas & Metode Olah</th>
                      <th className="py-3.5 px-4">Petani & Origin</th>
                      <th className="py-3.5 px-4">Kadar Air & aW</th>
                      <th className="py-3.5 px-4">Stok Tersedia</th>
                      <th className="py-3.5 px-4">Grade & Eco</th>
                      <th className="py-3.5 px-4">Harga / kg</th>
                      <th className="py-3.5 px-4 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProcessedLots.map((gb) => (
                      <tr
                        key={gb.id}
                        onClick={() => setDetailLot(gb)}
                        className="hover:bg-amber-50/40 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">{gb.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900">{gb.variety}</div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                            {gb.processMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-stone-800">{gb.sourceFarmerName}</div>
                          <div className="text-[11px] text-stone-400">{gb.sourceOrigin}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900">{gb.moistureContentPercent}%</div>
                          <div className="text-[11px] text-stone-500">{gb.waterActivityAw} aW</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          {gb.availableWeightKg} / {gb.greenBeanWeightKg} kg
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900">{gb.grade}</div>
                          <div className="text-[11px] text-teal-700 font-semibold">Zero Waste Eco</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          Rp {gb.pricePerKg.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLotForBarcode(gb);
                              setBarcodeModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3" />
                            Barcode
                          </button>
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
                    Green Bean Tersedia di Stasiun
                  </h4>
                  <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                    {filteredProcessedLots.filter((l) => l.availableWeightKg > 0).length} Lot
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredProcessedLots
                    .filter((l) => l.availableWeightKg > 0)
                    .map((gb) => (
                      <div
                        key={gb.id}
                        onClick={() => setDetailLot(gb)}
                        className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-stone-900">{gb.id}</span>
                          <span className="font-bold text-amber-800">{gb.processMethod}</span>
                        </div>
                        <h5 className="font-bold text-sm text-stone-900">{gb.variety} - {gb.grade}</h5>
                        <p className="text-[11px] text-stone-500">{gb.sourceFarmerName} • {gb.sourceOrigin}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                          <span className="font-bold text-stone-700">{gb.availableWeightKg} kg</span>
                          <span className="font-black text-amber-900">Rp {gb.pricePerKg.toLocaleString()}/kg</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-stone-50/70 rounded-2xl p-4 border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-400"></span>
                    Green Bean Terjual / Diserap
                  </h4>
                  <span className="text-xs font-bold px-2 py-0.5 bg-stone-200 text-stone-700 rounded-full">
                    {filteredProcessedLots.filter((l) => l.availableWeightKg === 0).length} Lot
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredProcessedLots
                    .filter((l) => l.availableWeightKg === 0)
                    .map((gb) => (
                      <div
                        key={gb.id}
                        onClick={() => setDetailLot(gb)}
                        className="bg-white/80 p-4 rounded-xl border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2 opacity-80"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-stone-600">{gb.id}</span>
                          <span className="font-bold text-stone-500">{gb.processMethod}</span>
                        </div>
                        <h5 className="font-bold text-sm text-stone-800">{gb.variety}</h5>
                        <p className="text-[11px] text-stone-500">{gb.sourceFarmerName}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                          <span className="text-stone-500">{gb.greenBeanWeightKg} kg</span>
                          <span className="font-bold text-stone-700">Ludes Terdistribusi</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* GREEN BEAN LOT DOCUMENT DETAIL SHEET VIEW */}
      {detailLot && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <RecordBreadcrumb
            listLabel="Katalog Green Bean Stasiun"
            recordLabel={detailLot.id}
            onBack={() => setDetailLot(null)}
          />

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="bg-[#FAF7F2] px-6 py-5 border-b border-stone-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-stone-900 font-mono">{detailLot.id}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                      {detailLot.processMethod}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {detailLot.sourceOrigin} — {detailLot.variety} ({detailLot.altitude}) • Diolah: {detailLot.processedDate}
                  </p>
                </div>
              </div>

              <StatusPipeline
                stages={GREEN_BEAN_PIPELINE_STAGES}
                currentStageId={getStageForLot(detailLot)}
              />
            </div>

            <div className="px-6 py-4 bg-white border-b border-stone-100 flex flex-wrap gap-2.5">
              <StatButton
                icon={<Scale className="w-4 h-4" />}
                value={`${detailLot.availableWeightKg} / ${detailLot.greenBeanWeightKg} kg`}
                label="Stok Green Bean Tersedia"
                color="emerald"
              />
              <StatButton
                icon={<DollarSign className="w-4 h-4" />}
                value={`Rp ${detailLot.pricePerKg.toLocaleString()}`}
                label="Harga Green Bean / kg"
                color="amber"
              />
              <StatButton
                icon={<Award className="w-4 h-4" />}
                value={detailLot.grade}
                label="Grade Mutu"
                color="purple"
              />
              <StatButton
                icon={<Droplets className="w-4 h-4" />}
                value={`${detailLot.moistureContentPercent}% • ${detailLot.waterActivityAw} aW`}
                label="Kadar Air / aW"
                color="blue"
              />
              <StatButton
                icon={<Star className="w-4 h-4" />}
                value={`${calculateProcessorEcoRating(
                  detailLot.wasteManagement,
                  detailLot.sourceTotalCherryWeightKg || detailLot.greenBeanWeightKg * 5,
                  detailLot.greenBeanWeightKg
                ).starRating} ⭐`}
                label="Eco Rating Limbah"
                color="stone"
              />
            </div>

            <div className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-700" /> Spesifikasi Olahan &amp; Lab Fisik
                  </h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Metode Proses</dt>
                      <dd className="font-bold text-stone-900">{detailLot.processMethod}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Waktu Fermentasi</dt>
                      <dd className="font-bold text-stone-900">{detailLot.fermentationTimeHours} jam</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Metode Pengeringan</dt>
                      <dd className="font-bold text-stone-900">{detailLot.dryingMethod}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Kadar Air &amp; Water Activity</dt>
                      <dd className="font-bold text-stone-900">
                        {detailLot.moistureContentPercent}% • {detailLot.waterActivityAw} aW
                      </dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-stone-500">Defect &amp; Ukuran Biji</dt>
                      <dd className="font-bold text-stone-900">
                        {detailLot.defectCount} defect • {detailLot.screenSize}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-700" /> Silsilah Ceri &amp; Limbah Sirkular
                  </h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Petani Sumber</dt>
                      <dd className="font-bold text-stone-900">{detailLot.sourceFarmerName}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Lot Ceri Asal</dt>
                      <dd className="font-bold text-stone-900">{detailLot.sourceFarmerLotId}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Asal Lahan &amp; Elevasi</dt>
                      <dd className="font-bold text-stone-900">{detailLot.sourceOrigin} • {detailLot.altitude}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Alokasi Limbah Sirkular</dt>
                      <dd className="font-bold text-teal-800 text-right">
                        {detailLot.wasteManagement?.utilization || 'Dikomposkan Jadi Pupuk Kebun'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-stone-500">Cupping Notes</dt>
                      <dd className="font-bold text-stone-900 text-right">{detailLot.cuppingNotes.join(', ')}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Dynamic Action Buttons Bar */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-800" />
                  <span className="text-xs font-bold text-amber-950">
                    Aksi Lembar Dokumen Green Bean #{detailLot.id}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleOpenEditWaste(detailLot)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    <Recycle className="w-4 h-4" /> Perbarui Alokasi Limbah
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLotForBarcode(detailLot);
                      setBarcodeModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs transition-all shadow-xs"
                  >
                    <Printer className="w-4 h-4" /> 🏷️ Cetak Barcode Karung
                  </button>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="pt-2 border-t border-stone-200">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-700" /> Log Aktivitas &amp; Pengujian Batch
                </h4>
                <ActivityFeed
                  documentTitle={`Green Bean Lot #${detailLot.id}`}
                  initialMessages={[
                    {
                      id: 'm1',
                      author: 'Stasiun Pengolah',
                      type: 'note',
                      content: `Lot diolah dengan metode ${detailLot.processMethod} (fermentasi ${detailLot.fermentationTimeHours} jam) dan pengeringan ${detailLot.dryingMethod}.`,
                      timestamp: detailLot.processedDate,
                    },
                    {
                      id: 'm2',
                      author: 'QC Laboratorium Fisik',
                      type: 'system',
                      content: `Uji kadar air tuntas: ${detailLot.moistureContentPercent}%, aW: ${detailLot.waterActivityAw}, defect: ${detailLot.defectCount} (${detailLot.grade}).`,
                      timestamp: detailLot.processedDate,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Alokasi Limbah */}
      {editingWasteLot && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-teal-900 to-stone-900 text-white p-5 relative">
              <button
                onClick={() => setEditingWasteLot(null)}
                className="absolute top-4 right-4 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-black text-lg">Perbarui Alokasi Limbah Sirkular</h3>
              <p className="text-xs text-stone-300">Lot: {editingWasteLot.id} ({editingWasteLot.variety})</p>
            </div>

            <form onSubmit={handleSaveEditWaste} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Pemanfaatan / Produk Olahan Limbah
                </label>
                <input
                  type="text"
                  required
                  value={editWasteUtilization}
                  onChange={(e) => setEditWasteUtilization(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Penerima / Lokasi Alokasi Kompos
                </label>
                <input
                  type="text"
                  required
                  value={editWasteRecipient}
                  onChange={(e) => setEditWasteRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Volume / Bobot Limbah Terkelola (kg/L)
                </label>
                <input
                  type="number"
                  required
                  value={editWasteWeight}
                  onChange={(e) => setEditWasteWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingWasteLot(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-bold"
                >
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ProcessorBarcodeModal
        isOpen={barcodeModalOpen}
        onClose={() => setBarcodeModalOpen(false)}
        lot={selectedLotForBarcode}
        isNewProcess={false}
      />
    </div>
  );
};

