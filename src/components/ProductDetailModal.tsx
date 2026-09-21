import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  ShoppingCart,
  Award,
  MapPin,
  Building2,
  Sparkles,
  CheckCircle2,
  QrCode,
  Flame,
  Sprout,
  Cog,
  Warehouse,
  ShieldCheck,
  ChevronRight,
  Info,
  Recycle,
  Crown,
  Star,
} from 'lucide-react';
import {
  UnifiedMarketplaceItem,
  FarmerHarvestLot,
  ProcessedGreenBeanLot,
  WarehouseLot,
} from '../types/coffee';
import { calculateProcessorEcoRating } from '../utils/ecoRating';
import { CoffeeSensorySpiderChart } from './CoffeeSensorySpiderChart';
import { getNetworkHost, getPublicBaseUrl, isLoopbackHost } from '../utils/baseUrl';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: UnifiedMarketplaceItem | null;
  onBuy: (item: UnifiedMarketplaceItem) => void;
  onOpenBarcode?: (lot: FarmerHarvestLot) => void;
  onOpenProcessorBarcode?: (lot: ProcessedGreenBeanLot) => void;
  onOpenWarehouseBarcode?: (lot: WarehouseLot) => void;
  onOpenTraceability?: (rawItem: any) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  onBuy,
  onOpenBarcode,
  onOpenProcessorBarcode,
  onOpenWarehouseBarcode,
  onOpenTraceability,
}) => {
  const [miniQrUrl, setMiniQrUrl] = useState<string>('');

  // Base URL for the QR link: VITE_PUBLIC_BASE_URL when set, otherwise the browser's own
  // origin (a deployed VPS/domain resolves automatically), falling back to a LAN host override
  // only during local dev — see src/utils/baseUrl.ts.
  const isLoopback = isLoopbackHost();
  const networkHost = getNetworkHost();
  const resolvedBaseUrl = getPublicBaseUrl(networkHost);

  const realtimeScanUrl = item ? `${resolvedBaseUrl}/?lotId=${item.id}` : '';

  useEffect(() => {
    if (
      item &&
      (item.category === 'cherry' ||
        item.category === 'green_bean_processor' ||
        item.category === 'green_bean_warehouse') &&
      realtimeScanUrl
    ) {
      QRCode.toDataURL(realtimeScanUrl, {
        width: 160,
        margin: 1,
        color: { dark: '#1c1917', light: '#ffffff' },
      })
        .then((url) => setMiniQrUrl(url))
        .catch((err) => console.error('Mini QR generation error:', err));
    }
  }, [item, realtimeScanUrl]);

  if (!isOpen || !item) return null;

  const raw = item.rawItem as any;
  const isCherry = item.category === 'cherry';
  const isProcessed = item.category === 'green_bean_processor';
  const isWarehouse = item.category === 'green_bean_warehouse';
  const isRoasted = item.category === 'roasted_bean';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Sticky Header with Close Button */}
        <div className="relative h-64 sm:h-72 bg-stone-900 shrink-0 overflow-hidden">
          <img
            src={item.photoUrl}
            alt={item.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/40 to-black/60" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white flex items-center justify-center backdrop-blur-xs transition-colors border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on Top Left */}
          <div className="absolute top-5 left-5 z-10 flex flex-wrap items-center gap-2">
            <span className="bg-black/70 backdrop-blur-xs text-white text-xs font-mono px-3 py-1 rounded-lg border border-white/20">
              ID: {item.id}
            </span>

            {item.category === 'cherry' && (
              <span className="bg-emerald-600/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg flex items-center gap-1.5 border border-emerald-400/40">
                <Sprout className="w-3.5 h-3.5" />
                Ceri Segar Petani
              </span>
            )}

            {item.category === 'green_bean_processor' && (
              <span className="bg-amber-600/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg flex items-center gap-1.5 border border-amber-400/40">
                <Cog className="w-3.5 h-3.5" />
                Green Bean Stasiun Olah
              </span>
            )}

            {item.category === 'green_bean_warehouse' && (
              <span className="bg-blue-600/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg flex items-center gap-1.5 border border-blue-400/40">
                <Warehouse className="w-3.5 h-3.5" />
                Green Bean Gudang & Ekspor
              </span>
            )}

            {item.category === 'roasted_bean' && (
              <span className="bg-orange-600/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg flex items-center gap-1.5 border border-orange-400/40">
                <Flame className="w-3.5 h-3.5" />
                Biji Sangrai Artisan
              </span>
            )}

            {item.scaScore && (
              <span className="bg-amber-400 text-stone-950 font-black text-xs px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <Award className="w-3.5 h-3.5" />
                SCA: {item.scaScore}
              </span>
            )}
          </div>

          {/* Hero Bottom Information */}
          <div className="absolute bottom-5 left-5 right-5 z-10 text-white">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {item.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-stone-200">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                {item.origin}
              </span>
              <span>•</span>
              <span className="font-semibold text-amber-300">{item.variety}</span>
              {item.altitude && (
                <>
                  <span>•</span>
                  <span>{item.altitude}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Seller / Creator Banner */}
          <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-black text-base shadow-sm">
                {item.sellerRole === 'petani' && <Sprout className="w-6 h-6 text-emerald-400" />}
                {item.sellerRole === 'pengolah' && <Cog className="w-6 h-6 text-amber-400" />}
                {item.sellerRole === 'gudang' && <Warehouse className="w-6 h-6 text-blue-400" />}
                {item.sellerRole === 'roaster' && <Flame className="w-6 h-6 text-orange-400" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-stone-900 text-sm sm:text-base">
                    {item.sellerName}
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                    {item.sellerRole}
                  </span>
                </div>
                <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-stone-400" />
                  {item.sellerOrg} • {item.origin}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Terverifikasi Rantai sangrAI</span>
            </div>
          </div>

          {/* Section: Khusus Petani - Barcode & Stiker Karung */}
          {isCherry && (
            <div className="bg-linear-to-br from-emerald-950 via-stone-900 to-emerald-900 text-white rounded-3xl p-5 sm:p-6 border border-emerald-800/60 shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-0.5 rounded-full text-xs font-bold">
                    <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                    Stiker Identitas Karung & Barcode Ceri
                  </div>
                  <h3 className="text-lg font-black text-white">
                    Label Fisik Karung Siap Pindai & Cetak
                  </h3>
                  <p className="text-xs text-stone-300 max-w-lg leading-relaxed">
                    Setiap lot ceri yang diunggah petani dilengkapi stiker fisik dengan kode QR dan barcode untuk ditempel di karung goni. Pengolah (pembeli) dapat men-scan kode ini untuk memverifikasi elevasi, brix, dan tanggal panen secara instan.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => onOpenBarcode && onOpenBarcode(item.rawItem as FarmerHarvestLot)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      Lihat Desain Stiker Karung
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open(realtimeScanUrl, '_blank')}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-white/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Uji Buka URL Spek
                    </button>
                  </div>
                </div>

                {/* Mini Preview Box */}
                <div className="bg-[#FCFAF7] text-stone-900 p-3 rounded-2xl border-2 border-stone-700 shadow-md text-center shrink-0 w-36">
                  <div className="text-[9px] font-black uppercase tracking-wider text-stone-500 border-b border-stone-300 pb-1 mb-1.5">
                    LOT LABEL
                  </div>
                  {miniQrUrl ? (
                    <img src={miniQrUrl} alt="QR Code" className="w-28 h-28 mx-auto object-contain" />
                  ) : (
                    <div className="w-28 h-28 flex items-center justify-center text-[10px] text-stone-400">
                      QR Code
                    </div>
                  )}
                  <span className="font-mono text-[9px] font-black block mt-1 text-stone-800 truncate">
                    {item.id}
                  </span>
                  <span className="text-[8px] font-mono text-stone-500 block truncate">
                    {isLoopback ? networkHost : (typeof window !== 'undefined' ? window.location.host : '')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Section: Khusus Pengolah - Barcode & Stiker Karung Green Bean */}
          {isProcessed && (
            <div className="bg-linear-to-br from-amber-950 via-stone-900 to-amber-900 text-white rounded-3xl p-5 sm:p-6 border border-amber-800/60 shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-0.5 rounded-full text-xs font-bold">
                    <QrCode className="w-3.5 h-3.5 text-amber-400" />
                    Stiker Karung Green Bean & Riwayat Ceri
                  </div>
                  <h3 className="text-lg font-black text-white">
                    Label Karung Pengolah dengan Riwayat Asal Ceri Petani
                  </h3>
                  <p className="text-xs text-stone-300 max-w-lg leading-relaxed">
                    Setiap lot green bean hasil olahan mill dilengkapi label karung siap cetak dengan kode QR aktif. Memuat parameter olahan fisik (kadar air, aW, defect) serta riwayat asal bahan baku ceri petani yang dibeli.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    {onOpenProcessorBarcode && (
                      <button
                        type="button"
                        onClick={() => onOpenProcessorBarcode(item.rawItem as ProcessedGreenBeanLot)}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Lihat Stiker Karung Pengolah
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => window.open(realtimeScanUrl, '_blank')}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-white/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      Uji Buka URL Spek
                    </button>
                  </div>
                </div>

                {/* Mini Preview Box */}
                <div className="bg-[#FCFAF7] text-stone-900 p-3 rounded-2xl border-2 border-stone-700 shadow-md text-center shrink-0 w-36">
                  <div className="text-[9px] font-black uppercase tracking-wider text-stone-500 border-b border-stone-300 pb-1 mb-1.5">
                    MILL LABEL
                  </div>
                  {miniQrUrl ? (
                    <img src={miniQrUrl} alt="QR Code" className="w-28 h-28 mx-auto object-contain" />
                  ) : (
                    <div className="w-28 h-28 flex items-center justify-center text-[10px] text-stone-400">
                      QR Code
                    </div>
                  )}
                  <span className="font-mono text-[9px] font-black block mt-1 text-stone-800 truncate">
                    {item.id}
                  </span>
                  <span className="text-[8px] font-mono text-stone-500 block truncate">
                    {isLoopback ? networkHost : (typeof window !== 'undefined' ? window.location.host : '')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Section: Khusus Gudang - Barcode & Stiker Karung Grading Gudang */}
          {isWarehouse && (
            <div className="bg-gradient-to-br from-blue-950 via-stone-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 border border-blue-800/60 shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-0.5 rounded-full text-xs font-bold">
                    <QrCode className="w-3.5 h-3.5 text-blue-400" />
                    Stiker Karung Gudang & Sertifikasi Grading
                  </div>
                  <h3 className="text-lg font-black text-white">
                    Label Karung Fisik Grading Gudang (Standar SCA & SNI)
                  </h3>
                  <p className="text-xs text-stone-300 max-w-lg leading-relaxed">
                    Setiap lot green bean di gudang telah melalui inspeksi grading mutu (Super Premium hingga Basic) dan disimpan dalam suhu terkontrol hermetik. Kode QR karung memverifikasi skor SCA, cacat fisik, dan asal hulu secara instan (tanpa menampilkan harga).
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    {onOpenWarehouseBarcode && (
                      <button
                        type="button"
                        onClick={() => onOpenWarehouseBarcode(item.rawItem as WarehouseLot)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Lihat Stiker Karung Gudang
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => window.open(realtimeScanUrl, '_blank')}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-white/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      Uji Buka URL Spek
                    </button>
                  </div>
                </div>

                {/* Mini Preview Box */}
                <div className="bg-[#FCFAF7] text-stone-900 p-3 rounded-2xl border-2 border-stone-700 shadow-md text-center shrink-0 w-36">
                  <div className="text-[9px] font-black uppercase tracking-wider text-stone-500 border-b border-stone-300 pb-1 mb-1.5">
                    WAREHOUSE QA
                  </div>
                  {miniQrUrl ? (
                    <img src={miniQrUrl} alt="QR Code" className="w-28 h-28 mx-auto object-contain" />
                  ) : (
                    <div className="w-28 h-28 flex items-center justify-center text-[10px] text-stone-400">
                      QR Code
                    </div>
                  )}
                  <span className="font-mono text-[9px] font-black block mt-1 text-stone-800 truncate">
                    {item.id}
                  </span>
                  <span className="text-[8px] font-mono text-stone-500 block truncate">
                    {isLoopback ? networkHost : (typeof window !== 'undefined' ? window.location.host : '')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Specifications Grid */}
          <div>
            <h2 className="text-base font-black text-stone-900 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600" />
              Spesifikasi Teknis & Parameter Mutu Lengkap
            </h2>

            {/* A. Cherry Farmer Specs */}
            {isCherry && raw && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Varietas Kopi:</span>
                  <span className="font-bold text-sm text-stone-900">{raw.variety}</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Ketinggian Kebun:</span>
                  <span className="font-bold text-sm text-stone-900">{raw.altitude}</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Kadar Gula Buah:</span>
                  <span className="font-bold text-sm text-emerald-700">{raw.brix}° Brix (Matang Optimal)</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Metode Petik:</span>
                  <span className="font-bold text-sm text-stone-900">{raw.pickingMethod}</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Tanggal Panen:</span>
                  <span className="font-bold text-sm text-stone-900">{raw.harvestDate}</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Total Panen Batch:</span>
                  <span className="font-bold text-sm text-stone-900">{raw.totalWeightKg} kg</span>
                </div>
              </div>
            )}

            {/* B. Processed Green Bean Specs */}
            {isProcessed && raw && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Metode Olah:</span>
                  <span className="font-bold text-sm text-amber-900">{raw.processMethod}</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Waktu Fermentasi:</span>
                  <span className="font-bold text-sm text-stone-900">{raw.fermentationTimeHours} Jam Terkontrol</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Metode Pengeringan:</span>
                  <span className="font-bold text-sm text-stone-900">{raw.dryingMethod}</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Kadar Air (Moisture):</span>
                  <span className="font-bold text-sm text-emerald-700">{raw.moistureContentPercent}% (Standar Ekspor)</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Water Activity (aW):</span>
                  <span className="font-bold text-sm text-stone-900">{raw.waterActivityAw} aw</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Grade Biji & Defect:</span>
                  <span className="font-bold text-sm text-stone-900">{raw.grade} ({raw.defectCount} defect)</span>
                </div>

                {/* Riwayat Asal Bahan Baku Ceri Petani */}
                <div className="col-span-2 sm:col-span-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 mt-1">
                  <span className="text-[10px] uppercase font-black text-emerald-900 flex items-center gap-1.5 mb-2.5">
                    <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                    Riwayat Bahan Baku Ceri Petani Asal (Chain of Custody)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/60">
                      <span className="text-stone-400 text-[10px] block">Petani Produsen:</span>
                      <strong className="text-stone-900 font-bold block mt-0.5">{raw.sourceFarmerName}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/60">
                      <span className="text-stone-400 text-[10px] block">ID Lot Ceri:</span>
                      <strong className="font-mono text-stone-900 font-bold block mt-0.5">{raw.sourceFarmerLotId}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/60">
                      <span className="text-stone-400 text-[10px] block">Elevasi Terroir:</span>
                      <strong className="text-stone-900 font-bold block mt-0.5">{raw.altitude}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/60">
                      <span className="text-stone-400 text-[10px] block">Kadar Gula Buah:</span>
                      <strong className="text-emerald-700 font-black block mt-0.5">{raw.sourceBrix || 20}° Brix</strong>
                    </div>
                  </div>
                </div>

                {/* Data Pengelolaan & Alokasi Limbah Kopi dengan Eco-Rating */}
                {(() => {
                  const ecoRating = calculateProcessorEcoRating(
                    raw.wasteManagement,
                    raw.sourceTotalCherryWeightKg || raw.greenBeanWeightKg * 5,
                    raw.greenBeanWeightKg
                  );
                  return (
                    <div className="col-span-2 sm:col-span-3 bg-teal-50/80 border border-teal-200 rounded-2xl p-4 mt-1 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-black text-teal-900 flex items-center gap-1.5">
                          <Recycle className="w-3.5 h-3.5 text-teal-700" />
                          Pengelolaan Limbah Sirkular (Eco-Processing)
                        </span>
                        <span className="font-bold text-[10px] text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                          ⭐ {ecoRating.starRating} / 5.00 ({ecoRating.ecoScore} Pts • {ecoRating.tierLabel.split('(')[0].trim()})
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                        <div className="bg-white p-2.5 rounded-xl border border-teal-200/60">
                          <span className="text-stone-400 text-[10px] block">Kategori Limbah:</span>
                          <strong className="text-stone-900 font-bold block mt-0.5 truncate">
                            {raw.wasteManagement?.wasteType || 'Kulit Ceri (Pulp / Cascara)'}
                          </strong>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-teal-200/60">
                          <span className="text-stone-400 text-[10px] block">Alur Pemanfaatan:</span>
                          <strong className="text-teal-800 font-black block mt-0.5 truncate">
                            {raw.wasteManagement?.utilization || 'Teh Cascara & Kompos Sirkular'}
                          </strong>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-teal-200/60">
                          <span className="text-stone-400 text-[10px] block">Volume Terkelola:</span>
                          <strong className="text-stone-900 font-bold block mt-0.5">
                            {raw.wasteManagement?.weightKgOrLiters || Math.round(raw.greenBeanWeightKg * 2.2)} kg/L
                          </strong>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-teal-200/60">
                          <span className="text-stone-400 text-[10px] block">Reduksi Jejak Karbon:</span>
                          <strong className="text-emerald-700 font-bold block mt-0.5 truncate">
                            -{ecoRating.carbonOffsetKg} kg CO₂e
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* C. Warehouse Silo Specs */}
            {isWarehouse && raw && (
              <div className="space-y-3">
                {/* Grade Classification Banner */}
                <div className="bg-gradient-to-r from-blue-900 via-stone-900 to-indigo-950 text-white p-4 rounded-2xl border border-blue-800 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black">
                      <Crown className="w-5 h-5 text-stone-950" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block">
                        Klasifikasi Mutu Gudang
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-white">
                        {raw.gradeTier || 'Grade 1 - Super Premium'}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-300 block">Skor Cupping SCA</span>
                    <span className="text-sm font-black text-amber-400">
                      {raw.verifiedScaScore} Score
                    </span>
                  </div>
                </div>

                {/* Target Market */}
                {raw.targetMarket && (
                  <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-xs">
                    <span className="text-stone-400 text-[10px] font-bold block mb-0.5">
                      🎯 Rekomendasi Target Pasar & Penggunaan:
                    </span>
                    <strong className="text-stone-800">{raw.targetMarket}</strong>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Sortir Cacat (Defect):</span>
                    <span className="font-bold text-sm text-stone-900">
                      {raw.defectCount ?? 2} defect / 350g
                    </span>
                  </div>
                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Ukuran Biji:</span>
                    <span className="font-bold text-sm text-stone-900">
                      {raw.screenSize || 'Screen 17-18'}
                    </span>
                  </div>
                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Suhu & Kelembaban:</span>
                    <span className="font-bold text-sm text-blue-900">
                      {raw.temperatureCelsius}°C / {raw.humidityPercent}% RH
                    </span>
                  </div>
                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Tipe Kemasan Hermetik:</span>
                    <span className="font-bold text-sm text-stone-900">{raw.packagingType}</span>
                  </div>
                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Lokasi Rak Silo:</span>
                    <span className="font-bold text-sm text-stone-900">{raw.storageLocation}</span>
                  </div>
                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 block">Petani Asal:</span>
                    <span className="font-bold text-sm text-stone-900">{raw.sourceFarmerName}</span>
                  </div>
                </div>
              </div>
            )}

            {/* D. Roasted Bean Specs */}
            {isRoasted && raw && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Profil Sangrai:</span>
                  <span className="font-bold text-sm text-orange-900">{raw.roastLevel}</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Warna Agtron & DTR:</span>
                  <span className="font-bold text-sm text-stone-900">#{raw.agtronNumber} (DTR {raw.developmentTimeRatio}%)</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Mesin Sangrai:</span>
                  <span className="font-bold text-sm text-stone-900">{raw.roasterMachine}</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Tanggal Roasting:</span>
                  <span className="font-bold text-sm text-stone-900">{raw.roastDate}</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Rekomendasi Resting:</span>
                  <span className="font-bold text-sm text-stone-900">{raw.restingRecommendationDays} Hari</span>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] text-stone-400 block">Cupping Score SCA:</span>
                  <span className="font-bold text-sm text-amber-700">{raw.scaCuppingScore}</span>
                </div>
              </div>
            )}
          </div>

          {/* Coffee Sensory Spider Chart & Tasting Radar (Roasted & Specialty Lots) */}
          {(isRoasted || isWarehouse || item.category === 'roasted_bean' || (item.tastingNotes && item.tastingNotes.length > 0)) && (
            <div className="pt-2">
              <CoffeeSensorySpiderChart
                scaScore={item.scaScore || (raw?.scaCuppingScore ?? raw?.verifiedScaScore ?? 87.5)}
                roastLevel={raw?.roastLevel || 'Medium Roast'}
                agtronNumber={raw?.agtronNumber || 68}
                dtrPercent={raw?.developmentTimeRatio || 14.5}
                beanName={item.title}
                roasterName={item.sellerName}
                tastingNotes={item.tastingNotes}
                interactive={true}
              />
            </div>
          )}

          {/* Tasting Notes & Sensory Wheel */}
          {item.tastingNotes.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                Atribut Rasa & Karakteristik Sensory (Tasting Notes)
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.tastingNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-950 text-xs font-bold border border-amber-200 shadow-2xs"
                  >
                    ✨ {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Traceability Trigger (if available) */}
          {item.canTrace && (
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-bold text-sm text-amber-950 flex items-center gap-1.5 justify-center sm:justify-start">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Silsilah Lengkap Transparansi (Farm-to-Cup)
                </h4>
                <p className="text-xs text-stone-600 max-w-md leading-relaxed">
                  Telusuri perjalanan komoditas ini secara transparan mulai dari kebun petani, stasiun cuci (mill), gudang kontrol iklim, hingga profil sangrai.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenTraceability && onOpenTraceability(item.rawItem)}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-800 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-2 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Buka Silsilah Lengkap
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer: Price, Stock, Buy Action */}
        <div className="p-5 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="text-xs text-stone-500 flex items-center gap-2">
              <span>Stok Tersedia:</span>
              <strong className="text-stone-900 font-bold">
                {item.availableStock} {item.stockUnit}
              </strong>
            </div>
            <div className="text-2xl font-black text-stone-900 mt-0.5">
              Rp {item.price.toLocaleString()}
              <span className="text-xs font-normal text-stone-500"> {item.priceUnit}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onBuy(item);
              }}
              className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-amber-800 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              Beli Komoditas Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
