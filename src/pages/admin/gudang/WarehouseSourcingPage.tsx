import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCoffee } from '../../../context/CoffeeContext';
import { ProcessedGreenBeanLot } from '../../../types/coffee';
import {
  ShoppingCart,
  Warehouse,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronLeft,
  Cog,
  Droplets,
  Scale,
  Sparkles,
  MapPin,
  ShieldCheck,
  Tag,
  DollarSign,
  AlertCircle,
  X,
} from 'lucide-react';

export const WarehouseSourcingPage: React.FC = () => {
  const {
    processedLots,
    currentUser,
    buyGreenBeanAndStoreWarehouse,
  } = useCoffee();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [selectedLot, setSelectedLot] = useState<ProcessedGreenBeanLot | null>(null);

  // Buy Modal Form State
  const [boughtKg, setBoughtKg] = useState<number>(100);
  const [storageLocation, setStorageLocation] = useState<string>('Gudang Sementara (Silo Transit Inbound A-0)');
  const [tempCelsius, setTempCelsius] = useState<number>(20.5);
  const [humidity, setHumidity] = useState<number>(55);
  const [packagingType, setPackagingType] = useState<'GrainPro + Karung Goni 60kg' | 'Vacuum Bag 30kg' | 'Ecotact Hermetic 50kg'>('GrainPro + Karung Goni 60kg');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Filter available processed lots
  const availableLots = processedLots.filter((lot) => lot.availableWeightKg > 0);

  const filteredLots = availableLots.filter((lot) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      lot.id.toLowerCase().includes(q) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.processorName.toLowerCase().includes(q) ||
      lot.sourceOrigin.toLowerCase().includes(q);

    const matchMethod = methodFilter === 'all' || lot.processMethod === methodFilter;
    return matchSearch && matchMethod;
  });

  const handleOpenBuyModal = (lot: ProcessedGreenBeanLot) => {
    setSelectedLot(lot);
    setBoughtKg(Math.min(100, lot.availableWeightKg));
    setStorageLocation('Gudang Sementara (Silo Transit Inbound A-0)');
    setSuccessNotice(null);
  };

  const handleConfirmPurchase = () => {
    if (!selectedLot) return;

    buyGreenBeanAndStoreWarehouse(selectedLot.id, boughtKg, {
      storageLocation,
      temperatureCelsius: tempCelsius,
      humidityPercent: humidity,
      packagingType,
      verifiedScaScore: 85.0, // Initial provisional score before sorting
      pricePerKg: Math.round(selectedLot.pricePerKg * 1.25), // Initial estimated price
      notes: `Inbound baru dibeli dari ${selectedLot.processorName}. Menunggu lembar kerja penyortiran.`,
    });

    setSuccessNotice(
      `Berhasil membeli ${boughtKg} kg ${selectedLot.variety} dari ${selectedLot.processorName}! Lot otomatis masuk ke GUDANG SEMENTARA.`
    );

    setSelectedLot(null);

    setTimeout(() => {
      navigate('/admin/gudang/inventory');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* 1. AdminLTE Content Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <Link to="/admin/overview" className="hover:text-amber-600">Pusat Kendali</Link>
            <span>/</span>
            <Link to="/admin/gudang/inventory" className="hover:text-amber-600">Layanan Gudang</Link>
            <span>/</span>
            <span className="font-bold text-stone-800">Pengadaan Green Bean</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <ShoppingCart className="w-7 h-7 text-amber-600" />
            <span>Pengadaan Green Bean dari Pengolah &amp; Marketplace</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Beli biji hijau olahan dari stasiun pengolah (wet mill). Pembelian otomatis masuk ke <strong>Gudang Sementara</strong> sebelum masuk ke lembar kerja penyortiran.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/gudang/inventory"
            className="px-3.5 py-2 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-stone-300"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Ke Inventaris Gudang</span>
          </Link>
        </div>
      </div>

      {/* Notice Banner */}
      {successNotice && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* 2. Info Banner: Alur Gudang Sementara */}
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-300 text-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-amber-950">
              Alur Mutu Inbound: Beli &rarr; Gudang Sementara &rarr; Lembar Kerja Sortir
            </h4>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Setiap lot green bean yang Anda beli dari pengolah tidak langsung tayang di marketplace. Stok akan ditampung di Silo Transit Inbound sampai auditor QA menyelesaikan lembar kerja penyortiran.
            </p>
          </div>
        </div>

        <Link
          to="/admin/gudang/inventory"
          className="text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-md transition-colors shrink-0"
        >
          Lihat Gudang Sementara &rarr;
        </Link>
      </div>

      {/* 3. Filter & Search Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari varietas, pengolah, origin terroir..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-md border border-stone-300 bg-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">Semua Metode Olah</option>
            <option value="Full Washed">Full Washed</option>
            <option value="Natural / Dry">Natural / Dry</option>
            <option value="Anaerobic Natural">Anaerobic Natural</option>
            <option value="Honey (Yellow/Red)">Honey Process</option>
            <option value="Carbonic Maceration">Carbonic Maceration</option>
            <option value="Wine Process">Wine Process</option>
          </select>
        </div>
      </div>

      {/* 4. Grid Catalog of Available Green Beans from Processors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLots.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg p-12 text-center border border-stone-200">
            <Cog className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-stone-800">Tidak ada lot green bean yang sesuai</h4>
            <p className="text-xs text-stone-500 mt-1">Coba sesuaikan kata kunci pencarian atau metode olahan.</p>
          </div>
        ) : (
          filteredLots.map((lot) => (
            <div
              key={lot.id}
              className="bg-white rounded-lg border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Header Card */}
                <div className="p-4 border-b border-stone-100 bg-stone-50/60 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-stone-500 block">{lot.id}</span>
                    <h3 className="font-black text-stone-900 text-sm mt-0.5">{lot.variety}</h3>
                    <p className="text-[11px] text-stone-600 mt-0.5">{lot.sourceOrigin}</p>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                    {lot.processMethod}
                  </span>
                </div>

                {/* Specs Body */}
                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-stone-50 p-2 rounded">
                      <span className="text-[10px] text-stone-400 block">Kadar Air:</span>
                      <strong className="text-stone-800">{lot.moistureContentPercent}%</strong>
                    </div>

                    <div className="bg-stone-50 p-2 rounded">
                      <span className="text-[10px] text-stone-400 block">Defect Fisik:</span>
                      <strong className="text-stone-800">{lot.defectCount} / 350g</strong>
                    </div>

                    <div className="bg-stone-50 p-2 rounded">
                      <span className="text-[10px] text-stone-400 block">Ukuran Ayakan:</span>
                      <strong className="text-stone-800">{lot.screenSize}</strong>
                    </div>

                    <div className="bg-stone-50 p-2 rounded">
                      <span className="text-[10px] text-stone-400 block">Grade Mill:</span>
                      <strong className="text-stone-800">{lot.grade}</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-500">
                    Stasiun Pengolah: <strong className="text-stone-800">{lot.processorName}</strong>
                  </div>

                  {lot.cuppingNotes && lot.cuppingNotes.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {lot.cuppingNotes.slice(0, 3).map((note, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-medium">
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-4 border-t border-stone-100 bg-stone-50/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block">Harga Pengolah:</span>
                  <div className="font-black text-sm text-emerald-700">
                    Rp {lot.pricePerKg.toLocaleString()} <span className="text-[10px] text-stone-500 font-normal">/kg</span>
                  </div>
                  <span className="text-[10px] text-stone-500 block">
                    Stok Tersedia: <strong>{lot.availableWeightKg} kg</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenBuyModal(lot)}
                  className="px-3.5 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Beli ke Silo Transit</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Purchase Confirmation Modal */}
      {selectedLot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-200 bg-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <h3 className="font-bold text-sm">Pengadaan Green Bean Inbound</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLot(null)}
                className="text-white/80 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                <div className="font-bold text-stone-900 text-sm">{selectedLot.variety}</div>
                <div className="text-stone-600">{selectedLot.sourceOrigin} • {selectedLot.processMethod}</div>
                <div className="text-[11px] text-stone-500">
                  Stasiun Pengolah: <strong>{selectedLot.processorName}</strong> • Stok: {selectedLot.availableWeightKg} kg
                </div>
              </div>

              {/* Volume Input */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-stone-800">
                  <label>Volume yang Dipesan (kg):</label>
                  <span className="text-amber-700">Maksimal: {selectedLot.availableWeightKg} kg</span>
                </div>
                <input
                  type="number"
                  min="10"
                  max={selectedLot.availableWeightKg}
                  value={boughtKg}
                  onChange={(e) => setBoughtKg(Math.min(selectedLot.availableWeightKg, Math.max(1, parseInt(e.target.value) || 0)))}
                  className="w-full text-base font-bold py-2 px-3 rounded border border-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Silo Location */}
              <div className="space-y-1">
                <label className="font-bold text-stone-800 block">Lokasi Silo Penyimpanan Sementara:</label>
                <input
                  type="text"
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  className="w-full font-bold py-2 px-3 rounded border border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-stone-400">
                  Stok akan masuk ke Gudang Sementara (Menunggu Sortir) sebelum lembar kerja sortir dibuat.
                </span>
              </div>

              {/* Packaging Type */}
              <div className="space-y-1">
                <label className="font-bold text-stone-800 block">Kemasan Hermetik Penerimaan:</label>
                <select
                  value={packagingType}
                  onChange={(e) => setPackagingType(e.target.value as any)}
                  className="w-full py-2 px-3 rounded border border-stone-300 bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="GrainPro + Karung Goni 60kg">GrainPro + Karung Goni 60kg</option>
                  <option value="Ecotact Hermetic 50kg">Ecotact Hermetic 50kg</option>
                  <option value="Vacuum Bag 30kg">Vacuum Bag 30kg</option>
                </select>
              </div>

              {/* Financial Summary */}
              <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-800 block">Total Nilai Pembelian:</span>
                  <div className="text-base font-black text-amber-950">
                    Rp {(boughtKg * selectedLot.pricePerKg).toLocaleString()}
                  </div>
                </div>

                <div className="text-right text-[11px] text-amber-800">
                  <div>Harga: <strong>Rp {selectedLot.pricePerKg.toLocaleString()}/kg</strong></div>
                  <div>Volume: <strong>{boughtKg} kg</strong></div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedLot(null)}
                className="px-4 py-2 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmPurchase}
                className="px-5 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Konfirmasi Masuk Gudang Sementara</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseSourcingPage;
