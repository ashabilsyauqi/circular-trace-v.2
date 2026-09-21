import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import {
  Cog,
  MapPin,
  Sparkles,
  X,
  Recycle,
  CheckCircle2,
  Cherry,
  Scale,
  DollarSign,
  Droplets,
  Mountain,
  ChevronRight,
  FileText,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { FarmerHarvestLot, ProcessedGreenBeanLot, CoffeeWasteManagement } from '../../types/coffee';
import { ProcessorBarcodeModal } from '../ProcessorBarcodeModal';
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
  const { farmerLots, buyCherryAndCreateProcess } = useCoffee();

  const [selectedLotToProcess, setSelectedLotToProcess] = useState<FarmerHarvestLot | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [detailLot, setDetailLot] = useState<FarmerHarvestLot | null>(null);

  // ControlPanel & View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'cards'>('cards');

  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [selectedLotForBarcode, setSelectedLotForBarcode] = useState<ProcessedGreenBeanLot | null>(null);
  const [isNewProcess, setIsNewProcess] = useState(false);

  const [boughtCherryKg, setBoughtCherryKg] = useState<number>(500);
  const [processMethod, setProcessMethod] = useState<ProcessedGreenBeanLot['processMethod']>('Anaerobic Natural');
  const [fermentationHours, setFermentationHours] = useState<number>(72);
  const [dryingMethod, setDryingMethod] = useState<ProcessedGreenBeanLot['dryingMethod']>('Solar Dryer Raised Bed');
  const [moisturePercent, setMoisturePercent] = useState<number>(11.2);
  const [waterActivityAw, setWaterActivityAw] = useState<number>(0.57);
  const [grade, setGrade] = useState<ProcessedGreenBeanLot['grade']>('Specialty Grade 1');
  const [defectCount, setDefectCount] = useState<number>(2);
  const [screenSize] = useState('Size 17-18 (Large Screen)');
  const [greenBeanYieldKg, setGreenBeanYieldKg] = useState<number>(100);
  const [sellingPricePerKg, setSellingPricePerKg] = useState<number>(125000);
  const [cuppingNoteInput, setCuppingNoteInput] = useState('');
  const [cuppingNotes, setCuppingNotes] = useState<string[]>(['Floral', 'Citrus', 'Brown Sugar']);

  const [wasteType] = useState<string>('Kulit Ceri (Pulp / Cascara)');
  const [wasteUtilization, setWasteUtilization] = useState<string>('Bahan Baku Minuman Teh Cascara & Kompos Sirkular');
  const [wasteWeight, setWasteWeight] = useState<number>(225);
  const [wasteRecipient, setWasteRecipient] = useState<string>('Kelompok Tani Tilu Lestari & Rumah Kompos Organik');
  const [wasteProcessingMethod] = useState<string>('Solar Dryer Raised Bed (Food Grade) & Kompos Aerobik 30 Hari');
  const [wasteNotes] = useState<string>('Kulit ceri disortir higienis untuk teh cascara, lendir dan ampas difermentasi jadi pupuk kompos kebun.');

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

  const handleOpenProcessModal = (lot: FarmerHarvestLot) => {
    setSelectedLotToProcess(lot);
    const defaultBuy = Math.min(lot.availableWeightKg, 500);
    setBoughtCherryKg(defaultBuy);
    setGreenBeanYieldKg(Math.round(defaultBuy * 0.2));
    setWasteWeight(Math.round(defaultBuy * 0.45));
  };

  const handleAddNote = () => {
    if (cuppingNoteInput.trim() && !cuppingNotes.includes(cuppingNoteInput.trim())) {
      setCuppingNotes([...cuppingNotes, cuppingNoteInput.trim()]);
      setCuppingNoteInput('');
    }
  };

  const handleRemoveNote = (noteToRemove: string) => {
    setCuppingNotes(cuppingNotes.filter((n) => n !== noteToRemove));
  };

  const handleConfirmProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLotToProcess) return;

    const wasteData: CoffeeWasteManagement = {
      wasteType,
      utilization: wasteUtilization,
      weightKgOrLiters: Number(wasteWeight),
      recipientOrLocation: wasteRecipient,
      processingMethod: wasteProcessingMethod,
      ecoCertificate: 'sangrAI Zero-Waste Circular Standard',
      notes: wasteNotes,
    };

    const newLot = buyCherryAndCreateProcess(
      selectedLotToProcess.id,
      boughtCherryKg,
      {
        processMethod,
        fermentationTimeHours: Number(fermentationHours),
        dryingMethod,
        moistureContentPercent: Number(moisturePercent),
        waterActivityAw: Number(waterActivityAw),
        grade,
        defectCount: Number(defectCount),
        screenSize,
        greenBeanWeightKg: Number(greenBeanYieldKg),
        pricePerKg: Number(sellingPricePerKg),
        cuppingNotes: cuppingNotes.length > 0 ? cuppingNotes : ['Clean Cup', 'Sweet Caramel'],
      },
      wasteData
    );

    setSuccessMsg(
      `Sukses membeli ${boughtCherryKg} kg cherry dari ${selectedLotToProcess.farmerName} dan berhasil mengolah menjadi ${greenBeanYieldKg} kg Green Bean (${processMethod}) dengan data pemanfaatan limbah sirkular!`
    );
    setSelectedLotToProcess(null);
    setDetailLot(null);

    if (newLot) {
      setSelectedLotForBarcode(newLot);
      setIsNewProcess(true);
      setBarcodeModalOpen(true);
    }

    setTimeout(() => setSuccessMsg(''), 6000);
  };

  return (
    <div className="space-y-4">
      {!detailLot && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Pilih Ceri Segar Petani untuk Diolah di Stasiun Anda
              </h2>
              <p className="text-xs text-stone-500">
                Cek kadar kemanisan Brix, elevasi, dan metode petik sebelum membeli dan mengonversi menjadi green bean.
              </p>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
                <span>{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg('')} className="text-stone-400 hover:text-stone-700 text-xs font-bold">
                Tutup
              </button>
            </div>
          )}

          {/* Control Panel */}
          <ControlPanel
            breadcrumbs={[{ label: 'Pengadaan Ceri Petani' }]}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode === 'cards' ? 'table' : viewMode}
            onViewModeChange={(m) => setViewMode(m as any)}
            recordCount={filteredLots.length}
          />

          {filteredLots.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
              <Sparkles className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">Belum ada ceri yang sesuai filter</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Silakan ubah kata kunci pencarian atau daftarkan panen baru melalui peran Petani.
              </p>
            </div>
          ) : (
            <>
              {/* VIEW 1: CARDS GRID VIEW */}
              {viewMode === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredLots.map((lot) => (
                    <div
                      key={lot.id}
                      onClick={() => setDetailLot(lot)}
                      className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between cursor-pointer group"
                    >
                      <div>
                        <div className="relative h-44 bg-stone-100 overflow-hidden">
                          <img src={lot.photoUrl} alt={lot.variety} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
                            <h3 className="font-bold text-base text-stone-900 mt-1 group-hover:text-amber-800 transition-colors">{lot.variety}</h3>
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

                      <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-400 block">Harga Cherry:</span>
                          <span className="text-sm font-black text-stone-900">
                            Rp {lot.pricePerKg.toLocaleString()}
                            <span className="text-xs font-normal text-stone-500"> / kg</span>
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenProcessModal(lot);
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5"
                        >
                          <Cog className="w-3.5 h-3.5" />
                          Beli & Olah
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* VIEW 2: TABLE VIEW */}
              {viewMode === 'table' && (
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3.5 px-4">ID Lot Ceri</th>
                          <th className="py-3.5 px-4">Petani & Varietas</th>
                          <th className="py-3.5 px-4">Lokasi & Elevasi</th>
                          <th className="py-3.5 px-4">Kemanisan Brix</th>
                          <th className="py-3.5 px-4">Stok Ceri</th>
                          <th className="py-3.5 px-4">Harga / kg</th>
                          <th className="py-3.5 px-4 text-right">Tindakan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredLots.map((lot) => (
                          <tr
                            key={lot.id}
                            onClick={() => setDetailLot(lot)}
                            className="hover:bg-amber-50/40 cursor-pointer transition-colors"
                          >
                            <td className="py-3 px-4 font-mono font-bold text-stone-900">{lot.id}</td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-stone-900">{lot.variety}</div>
                              <div className="text-[11px] text-stone-500">Petani: {lot.farmerName}</div>
                            </td>
                            <td className="py-3 px-4 text-stone-700">
                              <div>{lot.farmLocation}</div>
                              <div className="text-[11px] text-stone-400">{lot.altitude}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-black text-emerald-700">{lot.brix}° Brix</span>
                            </td>
                            <td className="py-3 px-4 font-bold text-stone-900">
                              {lot.availableWeightKg} kg
                            </td>
                            <td className="py-3 px-4 font-bold text-stone-900">
                              Rp {lot.pricePerKg.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenProcessModal(lot);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                              >
                                <Cog className="w-3 h-3" />
                                Beli & Olah
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
                        Ceri Siap Diolah (High Brix &gt; 20°)
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
                            onClick={() => setDetailLot(lot)}
                            className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-bold text-stone-900">{lot.id}</span>
                              <span className="font-black text-emerald-700">{lot.brix}° Brix</span>
                            </div>
                            <h5 className="font-bold text-sm text-stone-900">{lot.variety}</h5>
                            <p className="text-[11px] text-stone-500">{lot.farmerName} • {lot.altitude}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                              <span className="font-bold text-stone-700">{lot.availableWeightKg} kg</span>
                              <span className="font-black text-amber-900">Rp {lot.pricePerKg.toLocaleString()}/kg</span>
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
                            onClick={() => setDetailLot(lot)}
                            className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-bold text-stone-900">{lot.id}</span>
                              <span className="font-bold text-amber-700">{lot.brix}° Brix</span>
                            </div>
                            <h5 className="font-bold text-sm text-stone-900">{lot.variety}</h5>
                            <p className="text-[11px] text-stone-500">{lot.farmerName} • {lot.altitude}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                              <span className="font-bold text-stone-700">{lot.availableWeightKg} kg</span>
                              <span className="font-black text-amber-900">Rp {lot.pricePerKg.toLocaleString()}/kg</span>
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

      {/* CHERRY LOT DOCUMENT DETAIL SHEET VIEW */}
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
                color="blue"
              />
              <StatButton
                icon={<DollarSign className="w-4 h-4" />}
                value={`Rp ${detailLot.pricePerKg.toLocaleString()}`}
                label="Harga Ceri / kg"
                color="amber"
              />
              <StatButton
                icon={<Package className="w-4 h-4" />}
                value={`~${Math.round(detailLot.availableWeightKg * 0.2)} kg`}
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
                      <dt className="text-stone-500">Total Berat Awal</dt>
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

              {/* Action Bar */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Cog className="w-4 h-4 text-amber-800" />
                  <span className="text-xs font-bold text-amber-950">
                    Konversi Lot Ceri #{detailLot.id} ke Green Bean Stasiun Pengolah
                  </span>
                </div>

                {detailLot.availableWeightKg > 0 && (
                  <button
                    onClick={() => handleOpenProcessModal(detailLot)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    <Cog className="w-4 h-4" /> Beli & Mulai Olah Green Bean
                  </button>
                )}
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
                      content: 'Lot terdaftar di sistem pengadaan mill dan siap diproses ke tangki fermentasi.',
                      timestamp: 'Hari ini',
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Proses Cherry ke Green Bean */}
      {selectedLotToProcess && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-amber-900 to-stone-900 text-white p-6 relative">
              <button
                onClick={() => setSelectedLotToProcess(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <Cog className="w-3.5 h-3.5" />
                Workstation Pengolahan Ceri → Green Bean
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Beli & Konversi Lot: {selectedLotToProcess.variety}
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                Petani: {selectedLotToProcess.farmerName} • Asal: {selectedLotToProcess.farmLocation} ({selectedLotToProcess.altitude})
              </p>
            </div>

            <form onSubmit={handleConfirmProcess} className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  1. Volume Pembelian Cherry
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Beli Cherry (kg) - Maks: {selectedLotToProcess.availableWeightKg} kg
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedLotToProcess.availableWeightKg}
                      value={boughtCherryKg}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setBoughtCherryKg(val);
                        setGreenBeanYieldKg(Math.round(val * 0.2));
                        setWasteWeight(Math.round(val * 0.45));
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[11px] text-stone-500">Estimasi Total Biaya Pembelian:</span>
                    <strong className="text-base font-black text-amber-950 font-mono">
                      Rp {(boughtCherryKg * selectedLotToProcess.pricePerKg).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  2. Parameter Pasca-Panen & Pengolahan
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Metode Proses Olahan
                    </label>
                    <select
                      value={processMethod}
                      onChange={(e) =>
                        setProcessMethod(e.target.value as ProcessedGreenBeanLot['processMethod'])
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Anaerobic Natural">Anaerobic Natural (Slow Ferment)</option>
                      <option value="Full Washed">Full Washed (Clean & Crisp)</option>
                      <option value="Natural / Dry">Natural / Dry (Fruity Body)</option>
                      <option value="Honey (Yellow/Red)">Honey (Sweet Balance)</option>
                      <option value="Wine Process">Wine Process (Extended Ferment)</option>
                      <option value="Wet Hulled (Giling Basah)">Wet Hulled (Giling Basah Tradisional)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Waktu Fermentasi (Jam)
                    </label>
                    <input
                      type="number"
                      value={fermentationHours}
                      onChange={(e) => setFermentationHours(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Metode Pengeringan
                    </label>
                    <select
                      value={dryingMethod}
                      onChange={(e) =>
                        setDryingMethod(e.target.value as ProcessedGreenBeanLot['dryingMethod'])
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Solar Dryer Raised Bed">Solar Dryer Raised Bed (Dome UV)</option>
                      <option value="Patio Penjemuran">Patio Penjemuran Terbuka</option>
                      <option value="Mechanical Controlled Dryer">Mechanical Controlled Dryer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Target Kadar Air (%) - Standar: 10 - 12%
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={moisturePercent}
                      onChange={(e) => setMoisturePercent(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Water Activity (aW) - Standar: 0.53 - 0.60
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={waterActivityAw}
                      onChange={(e) => setWaterActivityAw(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Defect Biji Fisik per 350g
                    </label>
                    <input
                      type="number"
                      value={defectCount}
                      onChange={(e) => setDefectCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Grade Mutu Green Bean
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as ProcessedGreenBeanLot['grade'])}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Specialty Grade 1">Specialty Grade 1 (&lt; 5 defect)</option>
                      <option value="Grade 2">Premium Grade 2 (6-12 defect)</option>
                      <option value="Commercial Fine">Commercial Fine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Hasil Green Bean Siap Jual (kg)
                    </label>
                    <input
                      type="number"
                      value={greenBeanYieldKg}
                      onChange={(e) => setGreenBeanYieldKg(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-amber-950 focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[10px] text-stone-400 mt-0.5 block">
                      Rendemen rata-rata ~{Math.round((greenBeanYieldKg / (boughtCherryKg || 1)) * 100)}% dari ceri segar
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Harga Jual Green Bean per kg (Rp)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      value={sellingPricePerKg}
                      onChange={(e) => setSellingPricePerKg(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-amber-950 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cita Rasa / Cupping Notes
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={cuppingNoteInput}
                      onChange={(e) => setCuppingNoteInput(e.target.value)}
                      placeholder="Ketik aroma (misal: Floral, Blackberry)..."
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
                    >
                      Tambah
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cuppingNotes.map((n) => (
                      <span
                        key={n}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300"
                      >
                        {n}
                        <button
                          type="button"
                          onClick={() => handleRemoveNote(n)}
                          className="hover:text-red-700 ml-1 font-bold"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sirkular Waste Management */}
              <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-teal-700" />
                  <div>
                    <h3 className="text-xs font-bold text-teal-950 uppercase tracking-wider">
                      3. Alokasi Limbah Sirkular &amp; Eco-Credit (Zero Waste)
                    </h3>
                    <p className="text-[11px] text-teal-800">
                      Kulit ceri (pulp), lendir, dan ampas wajib dialokasikan secara sirkular untuk jejak karbon hijau.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Pemanfaatan / Produk Olahan Limbah
                    </label>
                    <select
                      value={wasteUtilization}
                      onChange={(e) => setWasteUtilization(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      <option value="Bahan Baku Minuman Teh Cascara & Kompos Sirkular">
                        Bahan Baku Minuman Teh Cascara &amp; Kompos Sirkular
                      </option>
                      <option value="Dekomposisi Pupuk Organik Cair & Padat Kebun">
                        Dekomposisi Pupuk Organik Cair &amp; Padat Kebun
                      </option>
                      <option value="Pakan Ternak & Bahan Briket Arang Biomassa">
                        Pakan Ternak &amp; Bahan Briket Arang Biomassa
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Estimasi Berat Limbah Dikelola (kg)
                    </label>
                    <input
                      type="number"
                      value={wasteWeight}
                      onChange={(e) => setWasteWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-teal-950 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Kelompok Penerima / Lokasi Rumah Kompos
                    </label>
                    <input
                      type="text"
                      value={wasteRecipient}
                      onChange={(e) => setWasteRecipient(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedLotToProcess(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Konfirmasi Proses &amp; Buat Green Bean
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Processor Barcode Modal */}
      <ProcessorBarcodeModal
        isOpen={barcodeModalOpen}
        onClose={() => setBarcodeModalOpen(false)}
        lot={selectedLotForBarcode}
        isNewProcess={isNewProcess}
      />
    </div>
  );
};
