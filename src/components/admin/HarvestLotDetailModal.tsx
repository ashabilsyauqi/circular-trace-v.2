import React from 'react';
import {
  X,
  Package,
  Calendar,
  MapPin,
  Mountain,
  Scale,
  Sparkles,
  Droplets,
  Store,
  Cog,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Tag,
  TreePine,
  Users,
} from 'lucide-react';
import { FarmerHarvestLot } from '../../types/coffee';

interface HarvestLotDetailModalProps {
  lot: FarmerHarvestLot | null;
  onClose: () => void;
  onToggleRelease: (lotId: string, customPrice?: number) => void;
  onSendToProcessor: (lotId: string, quantityKg?: number) => void;
  onOpenBarcode: (lot: FarmerHarvestLot) => void;
}

export const HarvestLotDetailModal: React.FC<HarvestLotDetailModalProps> = ({
  lot,
  onClose,
  onToggleRelease,
  onSendToProcessor,
  onOpenBarcode,
}) => {
  if (!lot) return null;

  const isReleased = lot.isReleasedToMarketplace ?? true;
  const isSentToProcessor = lot.sentToProcessor ?? false;

  const stages = [
    {
      id: 'harvest',
      number: '01',
      title: 'Petik & Timbang',
      subtitle: `${lot.totalWeightKg} kg Ceri Merah`,
      status: 'completed',
      date: lot.harvestDate,
    },
    {
      id: 'brix',
      number: '02',
      title: 'Uji Kematangan Brix',
      subtitle: `${lot.brix || 21.5}° Brix (Sangat Manis)`,
      status: 'completed',
      date: lot.harvestDate,
    },
    {
      id: 'barcode',
      number: '03',
      title: 'Label Barcode Karung',
      subtitle: `ID: ${lot.id}`,
      status: 'completed',
      date: 'QR Verifikasi Aktif',
    },
    {
      id: 'distribution',
      number: '04',
      title: 'Distribusi Ceri',
      subtitle: isSentToProcessor
        ? 'Diserahkan ke Wet Mill Pengolah'
        : isReleased
        ? 'Live di Marketplace Publik'
        : 'Keep di Gudang Petani (Inventory)',
      status: isSentToProcessor || isReleased ? 'completed' : 'current',
      badge: isSentToProcessor ? 'Wet Mill' : isReleased ? 'Marketplace' : 'Inventory',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 p-5 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Lembar Detail Traceability Lot Panen
              </span>
              <span className="text-xs text-stone-300 font-mono font-bold">
                {lot.id}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400" />
              <span>{lot.variety || 'Arabica Specialty'}</span>
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              Petani: <strong className="text-white">{lot.farmerName}</strong> &bull; Kebun:{' '}
              <strong className="text-white">{lot.farmName || lot.farmLocation}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Stage Lifecycle Progress Tracker */}
        <div className="bg-stone-50 p-5 border-b border-stone-200">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Alur Tahapan Hidup Komoditas Ceri (Lifecycle Stage)</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {stages.map((st) => (
              <div
                key={st.id}
                className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono mb-1">
                    <span>STAGE {st.number}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <strong className="text-xs text-stone-900 block font-bold">
                    {st.title}
                  </strong>
                  <span className="text-[11px] text-stone-500 block mt-0.5 truncate">
                    {st.subtitle}
                  </span>
                </div>
                <div className="mt-2 pt-1.5 border-t border-stone-100 text-[10px] text-emerald-700 font-bold flex items-center justify-between">
                  <span>{st.date || 'Selesai'}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Body: Spesifikasi & Asal Usul */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Box Asal Usul Kebun */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
              <h5 className="text-xs font-bold text-stone-800 uppercase flex items-center gap-1.5">
                <TreePine className="w-3.5 h-3.5 text-emerald-600" />
                <span>Asal Usul Lahan &amp; Petani</span>
              </h5>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Petani Pemilik:</span>
                  <strong className="text-stone-900">{lot.farmerName}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Blok Kebun:</span>
                  <strong className="text-stone-900">{lot.farmName || 'Plot Pangalengan'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Elevasi Ketinggian:</span>
                  <strong className="text-amber-800">{lot.altitude || '1.550 mdpl'}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Lokasi / Desa:</span>
                  <strong className="text-stone-900 truncate max-w-[180px]">{lot.farmLocation}</strong>
                </div>
              </div>
            </div>

            {/* Box Kualitas Panen */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
              <h5 className="text-xs font-bold text-stone-800 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Karakteristik Kualitas Ceri</span>
              </h5>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Kadar Gula Alami:</span>
                  <span className="font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {lot.brix || 21.5}° Brix
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Metode Petik:</span>
                  <strong className="text-stone-900">{lot.pickingMethod || 'Petik Merah Optimal (95%+)'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Berat Total Panen:</span>
                  <strong className="text-emerald-700 font-bold">{lot.totalWeightKg.toLocaleString()} kg</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Sisa Stok Siap Olah:</span>
                  <strong className="text-stone-900">{lot.availableWeightKg.toLocaleString()} kg</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Action Distribution Controls */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-black uppercase text-emerald-950 block">
                Eksekusi Distribusi Ceri Kelompok Tani
              </span>
              <p className="text-xs text-emerald-800 mt-0.5">
                Pilih apakah lot ceri ini dirilis ke marketplace publik atau langsung diserahkan ke stasiun pengolah.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Toggle Rilis Marketplace */}
              <button
                type="button"
                onClick={() => onToggleRelease(lot.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isReleased
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>{isReleased ? 'Tarik ke Inventory' : 'Rilis ke Marketplace'}</span>
              </button>

              {/* Kirim ke Pengolah */}
              <button
                type="button"
                onClick={() => onSendToProcessor(lot.id, lot.availableWeightKg)}
                disabled={isSentToProcessor || lot.availableWeightKg <= 0}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#343a40] hover:bg-stone-900 disabled:opacity-50 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Cog className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSentToProcessor ? 'Sudah di Pengolah' : 'Serahkan ke Pengolah'}</span>
              </button>

              {/* Cetak Barcode */}
              <button
                type="button"
                onClick={() => onOpenBarcode(lot)}
                className="p-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 transition-colors cursor-pointer"
                title="Cetak Barcode Karung"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-mono">
            Sertifikasi EUDR: Lolos Geolocation 100%
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
