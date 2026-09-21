import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { Search, Filter, MapPin, Recycle, Star, Printer, X } from 'lucide-react';
import { ProcessedGreenBeanLot, CoffeeWasteManagement } from '../../types/coffee';
import { ProcessorBarcodeModal } from '../ProcessorBarcodeModal';
import { calculateProcessorEcoRating } from '../../utils/ecoRating';

// Catalog step: the processor's own green bean lots, their circular-waste allocation, and the
// barcode/label printing action — everything downstream of a successful Sourcing purchase.
export const InventoryModule: React.FC = () => {
  const { currentUser, processedLots, updateProcessedLotWaste } = useCoffee();

  const [searchQuery, setSearchQuery] = useState('');
  const [processMethodFilter, setProcessMethodFilter] = useState<string>('all');

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
      {successMsg && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold flex items-center justify-between shadow-2xs">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-stone-400 hover:text-stone-700 text-xs font-bold">
            Tutup
          </button>
        </div>
      )}

      {/* Toolbar Search & Method Filter */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID green bean, varietas, petani asal, atau metode olah..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Metode:
          </span>
          <select
            value={processMethodFilter}
            onChange={(e) => setProcessMethodFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Semua Metode</option>
            <option value="Full Washed">Full Washed</option>
            <option value="Natural / Dry">Natural / Dry</option>
            <option value="Honey (Yellow/Red)">Honey</option>
            <option value="Anaerobic Natural">Anaerobic Natural</option>
            <option value="Wine Process">Wine Process</option>
          </select>
        </div>
      </div>

      {/* Green Bean Lots Grid */}
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
              className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-stone-100 overflow-hidden">
                  <img src={gb.photoUrl} alt={gb.variety} className="w-full h-full object-cover" />
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
                    <h3 className="font-bold text-base text-stone-900">
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

                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Stok Gudang:</span>
                  <span className="text-xs font-bold text-amber-800">
                    {gb.availableWeightKg} / {gb.greenBeanWeightKg} kg
                  </span>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1 bg-stone-50 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditWaste(gb)}
                  className="py-2 px-2 rounded-xl border border-teal-300 bg-white hover:bg-teal-50 text-teal-950 font-bold text-[11px] transition-colors flex items-center justify-center gap-1 shadow-2xs"
                  title="Perbarui data alokasi limbah"
                >
                  <Recycle className="w-3.5 h-3.5 text-teal-700" />
                  <span>Alokasi Limbah</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLotForBarcode(gb);
                    setBarcodeModalOpen(true);
                  }}
                  className="py-2 px-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 hover:text-amber-200 font-bold text-[11px] transition-colors flex items-center justify-center gap-1 shadow-xs"
                  title="Cetak label karung ber-barcode"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cetak Barcode</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

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
