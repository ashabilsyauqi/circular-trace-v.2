import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import {
  Package,
  ArrowLeft,
  QrCode,
  Store,
  Warehouse,
  CheckCircle2,
  TreePine,
  MapPin,
  Mountain,
  Sparkles,
  Scale,
  Calendar,
  Users,
  ShieldCheck,
  Send,
  Printer,
  Cloud,
  Thermometer,
  Droplets,
} from 'lucide-react';
import { FarmerBarcodeModal } from '../../components/FarmerBarcodeModal';

export const MasterPanenDetailPage: React.FC = () => {
  const { lotId } = useParams<{ lotId?: string }>();
  const {
    farmerLots,
    coffeeFarms,
    toggleReleaseHarvestLotToMarketplace,
    sendHarvestLotToProcessor,
  } = useCoffee();

  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);

  const lot = farmerLots.find((l) => l.id === lotId);

  if (!lot) {
    return <Navigate to="/admin/panen" replace />;
  }

  const relatedFarm = coffeeFarms.find((f) => f.id === lot.farmId);
  const isReleased = Boolean(lot.isReleasedToMarketplace);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header & Navigation Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/admin/panen"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-emerald-700 bg-white px-3 py-2 rounded-md border border-[#d2d6de] shadow-2xs transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Data Hasil Panen</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Quick Toggle Distribution Button */}
          <button
            type="button"
            onClick={() => toggleReleaseHarvestLotToMarketplace(lot.id)}
            className={`px-3 py-2 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors ${
              isReleased
                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                : 'bg-stone-800 text-white hover:bg-stone-900'
            }`}
          >
            {isReleased ? <Store className="w-3.5 h-3.5" /> : <Warehouse className="w-3.5 h-3.5" />}
            <span>{isReleased ? 'Pindahkan ke Gudang' : 'Rilis ke Marketplace'}</span>
          </button>

          {/* Barcode QR Print Modal */}
          <button
            type="button"
            onClick={() => setBarcodeModalOpen(true)}
            className="px-3 py-2 bg-white border border-[#d2d6de] hover:bg-stone-50 text-stone-800 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <QrCode className="w-3.5 h-3.5 text-stone-600" />
            <span>Barcode & QR Paspor</span>
          </button>
        </div>
      </div>

      {/* 2. Top Info Banner */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xl font-black text-stone-900">{lot.id}</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                isReleased
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-stone-100 text-stone-700 border-stone-300'
              }`}
            >
              {isReleased ? <Store className="w-3 h-3" /> : <Warehouse className="w-3 h-3" />}
              <span>{isReleased ? 'Rilis Langsung ke Marketplace' : 'Keep di Gudang Petani (Inventory)'}</span>
            </span>

            {lot.sentToProcessor && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Terkirim ke Pengolah
              </span>
            )}
          </div>

          <p className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-2">
            <span className="text-stone-800 font-semibold flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              {lot.farmerName}
            </span>
            <span>•</span>
            <span className="text-stone-600 flex items-center gap-1">
              <TreePine className="w-3.5 h-3.5 text-amber-600" />
              {lot.farmName || lot.farmLocation}
            </span>
            <span>•</span>
            <span className="text-stone-600 flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              {lot.harvestDate}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold block">Timbangan Netto</span>
            <span className="text-2xl font-black text-stone-900 font-mono">
              {lot.totalWeightKg.toLocaleString()} <span className="text-xs font-normal">kg</span>
            </span>
          </div>
          <div className="pl-4 border-l border-stone-200">
            <span className="text-[10px] text-stone-400 uppercase font-bold block">Uji Brix</span>
            <span className="text-2xl font-black text-amber-600 font-mono">
              {lot.brix ? `${lot.brix}°` : '22.0°'}{' '}
              <span className="text-xs font-normal text-stone-500">Bx</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. 4-Stage Traceability Journey Stepper */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-5">
        <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Alur Penelusuran Traceability Rantai Pasok (Stage 1 - 4)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Stage 1 */}
          <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div className="flex items-center justify-between text-emerald-800 font-bold text-xs">
              <span>1. Kebun & Panen</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-[11px] text-stone-700">
              {lot.farmName || 'Blok Kebun'} ({lot.altitude || '1.550 mdpl'})
            </div>
            <div className="text-[10px] text-stone-500">
              {lot.variety} • {lot.pickingMethod || 'Petik Merah 95%+'}
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div className="flex items-center justify-between text-emerald-800 font-bold text-xs">
              <span>2. Sortasi & Brix</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-[11px] text-stone-700 font-mono font-bold">
              {lot.brix ? `${lot.brix}° Brix` : '22.0° Brix'}
            </div>
            <div className="text-[10px] text-stone-500">
              Sortasi apung lolos • Bebas cacat serangga
            </div>
          </div>

          {/* Stage 3 */}
          <div
            className={`p-3.5 rounded-lg border space-y-1 ${
              isReleased
                ? 'bg-amber-50/70 border-amber-300 text-amber-900'
                : 'bg-stone-50 border-stone-200 text-stone-800'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-xs">
              <span>3. Distribusi</span>
              <CheckCircle2 className={`w-4 h-4 ${isReleased ? 'text-amber-600' : 'text-stone-500'}`} />
            </div>
            <div className="text-[11px] font-bold">
              {isReleased ? 'Tayang di Marketplace' : 'Disimpan di Gudang Petani'}
            </div>
            <div className="text-[10px] opacity-80">
              {isReleased
                ? 'Dapat dipesan langsung oleh pengolah'
                : 'Inventaris internal kelompok tani'}
            </div>
          </div>

          {/* Stage 4 */}
          <div
            className={`p-3.5 rounded-lg border space-y-1 ${
              lot.sentToProcessor
                ? 'bg-blue-50/70 border-blue-300 text-blue-900'
                : 'bg-stone-50 border-stone-200 text-stone-400'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-xs">
              <span>4. Pengolah Wet Mill</span>
              {lot.sentToProcessor ? (
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              ) : (
                <span className="text-[10px] bg-stone-200 px-1.5 py-0.2 rounded text-stone-600">
                  Antrean
                </span>
              )}
            </div>
            <div className="text-[11px] font-semibold">
              {lot.sentToProcessor ? 'Diterima Stasiun Olah' : 'Menunggu Pengiriman'}
            </div>
            <div className="text-[10px]">
              {lot.sentToProcessor ? 'Siap pulping & fermentasi' : 'Belum ditransfer'}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Detailed Agronomic & Origin Sheet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: Asal Kebun & Cuaca */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-5 space-y-4">
          <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-stone-200 pb-2">
            <TreePine className="w-4 h-4 text-amber-600" />
            <span>Spesifikasi Asal Lahan Kebun & Iklim</span>
          </h4>

          <div className="space-y-2.5 text-xs text-stone-700">
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-400">Nama Blok Kebun:</span>
              <span className="font-bold text-stone-900">{lot.farmName || 'Blok Kebun Pasir Kunci'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-400">Lokasi Wilayah:</span>
              <span className="font-semibold text-stone-800">{lot.farmLocation}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-400">Elevasi Ketinggian:</span>
              <span className="font-mono font-bold text-stone-900">{lot.altitude}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-400">Jenis Tanah:</span>
              <span>{lot.soilType || relatedFarm?.soilType || 'Andosol Vulkanik'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-400">Pohon Penaung (Shade):</span>
              <span>
                {Array.isArray(lot.shadeTrees)
                  ? lot.shadeTrees.join(', ')
                  : relatedFarm?.shadeTrees?.join(', ') || 'Lamtoro, Sengon, Alpukat'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Karakteristik Ceri & Nilai */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-5 space-y-4">
          <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-stone-200 pb-2">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>Data Ceri, Timbangan & Penjualan</span>
          </h4>

          <div className="space-y-2.5 text-xs text-stone-700">
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-400">Varietas Kopi:</span>
              <span className="font-bold text-stone-900">{lot.variety}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-400">Metode Petik:</span>
              <span className="font-semibold text-stone-800">{lot.pickingMethod || 'Petik Merah'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-400">Harga per Kg:</span>
              <span className="font-mono font-bold text-emerald-700">
                Rp {(lot.pricePerKg || 15000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-400">Total Nilai Panen:</span>
              <span className="font-mono font-black text-stone-900">
                Rp {((lot.totalWeightKg || 0) * (lot.pricePerKg || 15000)).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-400">Kepatuhan EUDR:</span>
              <span className="px-2 py-0.2 rounded bg-teal-100 text-teal-800 font-bold text-[10px]">
                Deforestation-Free Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barcode Modal */}
      {barcodeModalOpen && (
        <FarmerBarcodeModal
          isOpen={true}
          lot={lot}
          onClose={() => setBarcodeModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MasterPanenDetailPage;
