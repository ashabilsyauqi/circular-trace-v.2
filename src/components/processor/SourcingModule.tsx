import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import {
  Cog,
  MapPin,
  Sparkles,
  X,
  Recycle,
  CheckCircle2,
} from 'lucide-react';
import { FarmerHarvestLot, ProcessedGreenBeanLot, CoffeeWasteManagement } from '../../types/coffee';
import { ProcessorBarcodeModal } from '../ProcessorBarcodeModal';

// Sourcing step of the processor pipeline: browse fresh cherry lots straight from farmers and
// buy + convert them into a green bean lot (with circular waste allocation) in one guided form.
export const SourcingModule: React.FC = () => {
  const { farmerLots, buyCherryAndCreateProcess } = useCoffee();

  const [selectedLotToProcess, setSelectedLotToProcess] = useState<FarmerHarvestLot | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

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

    if (newLot) {
      setSelectedLotForBarcode(newLot);
      setIsNewProcess(true);
      setBarcodeModalOpen(true);
    }

    setTimeout(() => setSuccessMsg(''), 6000);
  };

  return (
    <div className="space-y-4">
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

      {availableFarmerLots.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <Sparkles className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">Belum ada ceri yang tersedia saat ini</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Silakan ganti peran ke akun Petani untuk mendaftarkan hasil panen baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {availableFarmerLots.map((lot) => (
            <div
              key={lot.id}
              className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-stone-100 overflow-hidden">
                  <img src={lot.photoUrl} alt={lot.variety} className="w-full h-full object-cover" />
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
                    <h3 className="font-bold text-base text-stone-900 mt-1">{lot.variety}</h3>
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
                  onClick={() => handleOpenProcessModal(lot)}
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Cog className="w-3.5 h-3.5" />
                  Beli & Olah Cherry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Proses Cherry ke Green Bean */}
      {selectedLotToProcess && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-linear-to-r from-amber-900 to-stone-900 text-white p-6 relative">
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
                      required
                      min="10"
                      max={selectedLotToProcess.availableWeightKg}
                      value={boughtCherryKg}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setBoughtCherryKg(val);
                        setGreenBeanYieldKg(Math.round(val * 0.2));
                        setWasteWeight(Math.round(val * 0.45));
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs text-stone-500">Total Biaya Pembelian Cherry:</span>
                    <span className="text-base font-black text-amber-900">
                      Rp {(boughtCherryKg * selectedLotToProcess.pricePerKg).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      (Rp {selectedLotToProcess.pricePerKg.toLocaleString()}/kg ke Petani)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                  2. Parameter Pengolahan & Pengeringan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Metode Pengolahan</label>
                    <select
                      value={processMethod}
                      onChange={(e) => setProcessMethod(e.target.value as ProcessedGreenBeanLot['processMethod'])}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Full Washed">Full Washed (Clean & Crisp)</option>
                      <option value="Natural / Dry">Natural / Dry (Sweet & Fruity)</option>
                      <option value="Honey (Yellow/Red)">Honey Process</option>
                      <option value="Anaerobic Natural">Anaerobic Natural (Complex & Winey)</option>
                      <option value="Wine Process">Wine Process</option>
                      <option value="Wet Hulled (Giling Basah)">Wet Hulled (Giling Basah)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Waktu Fermentasi (Jam)</label>
                    <input
                      type="number"
                      required
                      value={fermentationHours}
                      onChange={(e) => setFermentationHours(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Metode Penjemuran</label>
                    <select
                      value={dryingMethod}
                      onChange={(e) => setDryingMethod(e.target.value as ProcessedGreenBeanLot['dryingMethod'])}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Solar Dryer Raised Bed">Solar Dryer Raised Bed (Higienis)</option>
                      <option value="Patio Penjemuran">Patio Penjemuran</option>
                      <option value="Mechanical Controlled Dryer">Mechanical Controlled Dryer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Target Kadar Air (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={moisturePercent}
                      onChange={(e) => setMoisturePercent(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-stone-500">Standar aman simpan: 10% - 12%</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Water Activity (aw)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={waterActivityAw}
                      onChange={(e) => setWaterActivityAw(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-stone-500">Standar SCA: aw &lt; 0.60</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Jumlah Cacat (Defect / 350g)
                    </label>
                    <input
                      type="number"
                      required
                      value={defectCount}
                      onChange={(e) => setDefectCount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                  3. Hasil Green Bean & Penawaran ke Gudang
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Estimasi Rendemen Green Bean (kg)
                    </label>
                    <input
                      type="number"
                      required
                      value={greenBeanYieldKg}
                      onChange={(e) => setGreenBeanYieldKg(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-stone-500">
                      Rendemen rata-rata ~{Math.round((greenBeanYieldKg / (boughtCherryKg || 1)) * 100)}% dari ceri segar
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Harga Jual Green Bean per kg (Rp)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      required
                      value={sellingPricePerKg}
                      onChange={(e) => setSellingPricePerKg(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-teal-50/90 border border-teal-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Recycle className="w-4 h-4 text-teal-700" />
                    4. Alokasi Limbah Sirkular (Eco-Processing)
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    Sertifikasi sangrAI Zero-Waste
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-teal-900 mb-1">Alur Pemanfaatan Limbah</label>
                    <input
                      type="text"
                      required
                      value={wasteUtilization}
                      onChange={(e) => setWasteUtilization(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-teal-300 text-xs bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-teal-900 mb-1">Penerima / Lokasi Alokasi</label>
                    <input
                      type="text"
                      required
                      value={wasteRecipient}
                      onChange={(e) => setWasteRecipient(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-teal-300 text-xs bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Karakter Cupping Notes
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={cuppingNoteInput}
                    onChange={(e) => setCuppingNoteInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNote();
                      }
                    }}
                    placeholder="Ketik aroma (misal: Blackberry, Jasmine)..."
                    className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-900 transition-colors"
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
                  Konfirmasi Proses & Buat Green Bean
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Processor Barcode Modal (opens right after a successful buy+process) */}
      <ProcessorBarcodeModal
        isOpen={barcodeModalOpen}
        onClose={() => setBarcodeModalOpen(false)}
        lot={selectedLotForBarcode}
        isNewProcess={isNewProcess}
      />
    </div>
  );
};
