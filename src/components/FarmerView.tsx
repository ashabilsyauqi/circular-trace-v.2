import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Sprout,
  PlusCircle,
  Package,
  History,
  TrendingUp,
  MapPin,
  CheckCircle2,
  QrCode,
} from 'lucide-react';
import { FarmerHarvestLot } from '../types/coffee';
import { FarmerBarcodeModal } from './FarmerBarcodeModal';

export const FarmerView: React.FC = () => {
  const { currentUser, farmerLots, addFarmerHarvest, transactions } = useCoffee();
  const [activeTab, setActiveTab] = useState<'upload' | 'catalog' | 'history'>('catalog');

  // Form State for uploading new harvest lot
  const [variety, setVariety] = useState('Typica & Sigarar Utang');
  const [farmLocation, setFarmLocation] = useState(currentUser?.location || 'Pangalengan, Jawa Barat');
  const [altitude, setAltitude] = useState('1.550 mdpl');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [pickingMethod, setPickingMethod] = useState<FarmerHarvestLot['pickingMethod']>(
    'Petik Merah Optimal (95%+)'
  );
  const [brix, setBrix] = useState<number>(21.5);
  const [totalWeightKg, setTotalWeightKg] = useState<number>(500);
  const [pricePerKg, setPricePerKg] = useState<number>(15000);
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Barcode & Sack Label Modal State
  const [selectedBarcodeLot, setSelectedBarcodeLot] = useState<FarmerHarvestLot | null>(null);
  const [isNewUpload, setIsNewUpload] = useState<boolean>(false);

  // Filter lots uploaded by this farmer (or all for demo simplicity)
  const myLots = farmerLots.filter((lot) => lot.farmerId === currentUser?.id || true);
  const myTransactions = transactions.filter((t) => t.fromRole === 'petani');

  const totalHarvestedKg = myLots.reduce((acc, curr) => acc + curr.totalWeightKg, 0);
  const availableKg = myLots.reduce((acc, curr) => acc + curr.availableWeightKg, 0);
  const soldKg = totalHarvestedKg - availableKg;
  const totalRevenue = myTransactions.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLot = addFarmerHarvest({
      farmLocation,
      altitude,
      variety,
      harvestDate,
      pickingMethod,
      brix: Number(brix),
      totalWeightKg: Number(totalWeightKg),
      pricePerKg: Number(pricePerKg),
      notes: notes || 'Hasil panen segar petik merah pilihan dari perkebunan lereng bukit.',
      photoUrl: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80',
    });

    setSuccessMessage(`Berhasil mendaftarkan Lot Panen Baru (${totalWeightKg} kg)! Barcode identitas karung telah dibuat.`);
    setActiveTab('catalog');
    setTimeout(() => setSuccessMessage(''), 5000);

    if (newLot) {
      setSelectedBarcodeLot(newLot);
      setIsNewUpload(true);
    }

    // Reset some form values
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-linear-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <Sprout className="w-4 h-4 text-emerald-400" />
            Dasbor Petani Kopi • Rantai Hulu (Farm Tier)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Manajemen Panen & Penjualan Cherry
          </h1>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
            Upload spesifikasi hasil panen Anda ke pasar digital. Pengolah kopi (mill station) dapat langsung melihat standar mutu ceri, ketinggian kebun, brix, dan membelinya secara langsung.
          </p>
        </div>

        {/* Decorative background badge */}
        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
          <Sprout className="w-48 h-48" />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Total Panen Dicatat</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{totalHarvestedKg.toLocaleString()} kg</div>
          <span className="text-[11px] text-emerald-600 font-medium">Cherry merah segar</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Stok Cherry Tersedia</span>
            <Sprout className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{availableKg.toLocaleString()} kg</div>
          <span className="text-[11px] text-amber-600 font-medium">Siap dibeli Pengolah</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Cherry Terjual</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{soldKg.toLocaleString()} kg</div>
          <span className="text-[11px] text-blue-600 font-medium">Menuju stasiun olah</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Total Penjualan</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            Rp {totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-stone-500 font-medium">Dari {myTransactions.length} transaksi</span>
        </div>
      </div>

      {/* Feedback message banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'catalog'
              ? 'border-emerald-600 text-emerald-900 bg-emerald-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          Katalog Hasil Panen Saya ({myLots.length})
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'upload'
              ? 'border-emerald-600 text-emerald-900 bg-emerald-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Upload Hasil Panen Baru
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'history'
              ? 'border-emerald-600 text-emerald-900 bg-emerald-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <History className="w-4 h-4" />
          Riwayat Penjualan ke Pengolah ({myTransactions.length})
        </button>
      </div>

      {/* Tab 1: Upload Panen Baru */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm max-w-4xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              Formulir Pendaftaran Hasil Panen Ceri Kopi
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Data yang diunggah akan menjadi basis traceability (silsilah) saat kopi dibeli dan diproses oleh pengolah.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Varietas Kopi
                </label>
                <input
                  type="text"
                  required
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="Contoh: Typica, Sigarar Utang, Kartika, Ateng Super"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Lokasi Kebun / Blok Lahan
                </label>
                <input
                  type="text"
                  required
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  placeholder="Contoh: Pangalengan Blok Gunung Tilu"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Ketinggian Kebun (mdpl)
                </label>
                <input
                  type="text"
                  required
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                  placeholder="Contoh: 1.500 - 1.650 mdpl"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Tanggal Panen
                </label>
                <input
                  type="date"
                  required
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Metode Petik Ceri
                </label>
                <select
                  value={pickingMethod}
                  onChange={(e) =>
                    setPickingMethod(e.target.value as FarmerHarvestLot['pickingMethod'])
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="Petik Merah Optimal (95%+)">
                    Petik Merah Optimal (95%+) - Specialty Standard
                  </option>
                  <option value="Petik Campur (Merah & Kuning)">
                    Petik Campur (Merah & Kuning)
                  </option>
                  <option value="Petik Rata">Petik Rata Komersial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Tingkat Kemanisan (°Brix)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={brix}
                  onChange={(e) => setBrix(Number(e.target.value))}
                  placeholder="Contoh: 21.5"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <span className="text-[11px] text-stone-500">Standar cherry matang: 19 - 24 °Brix</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Total Berat Panen (kg)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={totalWeightKg}
                  onChange={(e) => setTotalWeightKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Harga Penawaran per kg (Rp)
                </label>
                <input
                  type="number"
                  required
                  step="500"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <span className="text-[11px] text-emerald-700 font-medium">
                  Estimasi Nilai Lot: Rp {(totalWeightKg * pricePerKg).toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Catatan Karakter Kebun & Pohon
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tuliskan catatan khusus, misalnya: Pemupukan organik kascing, naungan pohon lamtoro, cuaca saat pemetikan..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Daftarkan Hasil Panen ke Sistem
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Katalog Panen Saya */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              Daftar Lot Panen Terdaftar ({myLots.length})
            </h2>
            <button
              onClick={() => setActiveTab('upload')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 bg-emerald-100/70 px-3 py-1.5 rounded-lg border border-emerald-300"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Tambah Panen
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myLots.map((lot) => {
              const isAvailable = lot.availableWeightKg > 0;
              return (
                <div
                  key={lot.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Header card */}
                    <div className="relative h-40 overflow-hidden bg-stone-100">
                      <img
                        src={lot.photoUrl}
                        alt={lot.variety}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md">
                        {lot.id}
                      </div>
                      <div className="absolute top-3 right-3">
                        {isAvailable ? (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                            Siap Dijual ({lot.availableWeightKg} kg)
                          </span>
                        ) : (
                          <span className="bg-stone-800 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                            Ludes Terjual
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-base text-stone-900 leading-tight">
                          {lot.variety}
                        </h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          {lot.farmLocation}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                        <div>
                          <span className="text-[11px] text-stone-400 block">Ketinggian:</span>
                          <span className="font-semibold text-stone-700">{lot.altitude}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-stone-400 block">Kemanisan Brix:</span>
                          <span className="font-semibold text-emerald-700">{lot.brix}° Brix</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-stone-400 block">Standar Petik:</span>
                          <span className="font-semibold text-stone-700 truncate block">
                            {lot.pickingMethod.split(' ')[0]}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-stone-400 block">Tanggal Panen:</span>
                          <span className="font-semibold text-stone-700">{lot.harvestDate}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 italic">
                        "{lot.notes}"
                      </p>

                      {/* Action to view & print barcode sticker */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBarcodeLot(lot);
                          setIsNewUpload(false);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-emerald-200 mt-2"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                        🏷️ Cetak Stiker Barcode Karung
                      </button>
                    </div>
                  </div>

                  {/* Pricing footer */}
                  <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Harga Penawaran:</span>
                      <span className="text-sm font-black text-stone-900">
                        Rp {lot.pricePerKg.toLocaleString()}
                        <span className="text-xs font-normal text-stone-500"> / kg</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block">Tersedia untuk Pengolah:</span>
                      <span className="text-xs font-bold text-emerald-700">
                        {lot.availableWeightKg} / {lot.totalWeightKg} kg
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Riwayat Penjualan */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            Catatan Penjualan Cherry ke Pengolah (Processor)
          </h2>

          {myTransactions.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">
              Belum ada transaksi penjualan ceri kopi.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">No. TRX</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Pembeli (Pengolah)</th>
                    <th className="py-3 px-4">Komoditas</th>
                    <th className="py-3 px-4">Volume</th>
                    <th className="py-3 px-4">Total Nilai</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {myTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-stone-800">{trx.id}</td>
                      <td className="py-3 px-4 text-stone-600">{trx.date}</td>
                      <td className="py-3 px-4 font-semibold text-stone-900">{trx.toName}</td>
                      <td className="py-3 px-4 text-stone-700">{trx.itemName}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">{trx.quantity}</td>
                      <td className="py-3 px-4 font-black text-stone-900">
                        Rp {trx.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Barcode & Stiker Karung */}
      <FarmerBarcodeModal
        isOpen={!!selectedBarcodeLot}
        onClose={() => setSelectedBarcodeLot(null)}
        lot={selectedBarcodeLot}
        isNewUpload={isNewUpload}
      />
    </div>
  );
};
