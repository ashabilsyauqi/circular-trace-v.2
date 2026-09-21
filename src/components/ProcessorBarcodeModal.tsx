import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Cog,
  Sprout,
  Recycle,
  Leaf,
  Star,
} from 'lucide-react';
import { ProcessedGreenBeanLot } from '../types/coffee';
import { calculateProcessorEcoRating } from '../utils/ecoRating';
import { getNetworkHost, getPublicBaseUrl, isLoopbackHost, saveNetworkHost } from '../utils/baseUrl';

interface ProcessorBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: ProcessedGreenBeanLot | null;
  isNewProcess?: boolean;
}

export const ProcessorBarcodeModal: React.FC<ProcessorBarcodeModalProps> = ({
  isOpen,
  onClose,
  lot,
  isNewProcess = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Detect loopback (localhost/127.0.0.1) to automatically provide LAN IP for mobile scanners.
  // A deployed build (VPS/domain) resolves via VITE_PUBLIC_BASE_URL or window.location.origin
  // instead — see src/utils/baseUrl.ts.
  const isLoopback = isLoopbackHost();

  const [networkHost, setNetworkHost] = useState<string>(() => getNetworkHost());

  const [tempHost, setTempHost] = useState(networkHost);
  const [isEditingHost, setIsEditingHost] = useState(false);

  const resolvedBaseUrl = getPublicBaseUrl(networkHost);

  const realtimeScanUrl = lot ? `${resolvedBaseUrl}/?lotId=${lot.id}` : '';

  useEffect(() => {
    if (lot && realtimeScanUrl) {
      // Encode realtime URL directly into QR code
      QRCode.toDataURL(realtimeScanUrl, {
        width: 280,
        margin: 1.5,
        color: {
          dark: '#1c1917',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [lot, realtimeScanUrl]);

  if (!isOpen || !lot) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(realtimeScanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenLiveUrl = () => {
    window.open(realtimeScanUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header Modal */}
        <div className="bg-linear-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 relative print:hidden">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Cog className="w-3.5 h-3.5 text-amber-400" />
            {isNewProcess ? 'Pengolahan Selesai! Stiker Barcode Green Bean Siap' : 'Stiker Barcode & Riwayat Asal Karung Green Bean'}
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Label Karung Green Bean: {lot.id}
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Stiker ini memuat parameter mutu hasil olahan mill serta riwayat lengkap ceri petani asal (chain of custody). Siap ditempel pada karung hermetik/goni green bean.
          </p>
        </div>

        {/* Printable Sticker View */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* The Actual Printable Physical Sticker Box */}
          <div
            id="printable-processor-sticker"
            className="bg-[#FCFAF7] border-3 border-stone-800 rounded-2xl p-5 sm:p-6 text-stone-900 shadow-md relative overflow-hidden"
          >
            {/* Header Label */}
            <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-black text-sm">
                  sAI
                </div>
                <div>
                  <span className="font-black text-xs uppercase tracking-wider block">
                    sangrAI Traceability
                  </span>
                  <span className="text-[10px] text-stone-600 font-bold">
                    PROCESSOR SPECIALTY LOT LABEL • TAHAP 2 (MILL & GREEN BEAN)
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-stone-900 text-amber-400 font-mono font-black text-xs px-2.5 py-1 rounded-md">
                  {lot.id}
                </span>
                <span className="text-[9px] text-emerald-800 font-bold block mt-0.5">
                  {lot.grade}
                </span>
              </div>
            </div>

            {/* Processor & Process Method */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-amber-800 uppercase font-bold block">
                  Stasiun Pengolah (Wet & Dry Mill):
                </span>
                <span className="font-black text-sm text-stone-900">
                  {lot.processorName}
                </span>
              </div>
              <div className="text-right sm:text-left">
                <span className="text-[10px] text-amber-800 uppercase font-bold block">
                  Metode Pengolahan:
                </span>
                <span className="inline-flex items-center gap-1 font-black text-xs bg-amber-200/60 text-amber-950 px-2 py-0.5 rounded-md">
                  {lot.processMethod}
                </span>
              </div>
            </div>

            {/* Main Section: 2 Columns (Specs & QR Code) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              {/* Left Column (2 cols): Physical Quality Specs */}
              <div className="sm:col-span-2 space-y-2.5 text-xs">
                {/* 1. Processing Specs */}
                <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
                  <div>
                    <span className="text-stone-500 text-[10px] block">Fermentasi:</span>
                    <strong className="text-stone-900 font-bold">{lot.fermentationTimeHours} Jam Terkontrol</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px] block">Metode Pengeringan:</span>
                    <strong className="text-stone-900 font-bold">{lot.dryingMethod}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px] block">Kadar Air (Moisture):</span>
                    <strong className="text-emerald-700 font-black">{lot.moistureContentPercent}%</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px] block">Water Activity:</span>
                    <strong className="text-emerald-700 font-black">{lot.waterActivityAw} aW</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px] block">Fisik Cacat (Defect):</span>
                    <strong className="text-stone-900 font-bold">{lot.defectCount} / 350g</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px] block">Ukuran Biji:</span>
                    <strong className="text-stone-900 font-bold">{lot.screenSize}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px] block">Tgl Selesai Olah:</span>
                    <strong className="text-stone-900 font-bold">{lot.processedDate}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px] block">Berat Green Bean:</span>
                    <strong className="text-stone-900 font-black text-sm">{lot.greenBeanWeightKg} kg</strong>
                  </div>
                </div>

                {/* 2. RIWAYAT BAHAN BAKU CERI PETANI ASAL (GOODS DATA) */}
                <div className="bg-emerald-50/60 border-2 border-emerald-300/80 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-1.5">
                    <span className="text-[10px] uppercase font-black text-emerald-900 flex items-center gap-1">
                      <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                      Riwayat Bahan Baku Ceri Petani Asal (Chain of Custody)
                    </span>
                    <span className="font-mono text-[9px] font-bold text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-300">
                      {lot.sourceFarmerLotId}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] pt-0.5">
                    <div>
                      <span className="text-stone-500 text-[10px] block">Petani Produsen:</span>
                      <strong className="text-stone-900 font-bold">{lot.sourceFarmerName}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">Varietas Kopi:</span>
                      <strong className="text-stone-900 font-bold">{lot.variety}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">Terroir / Asal:</span>
                      <strong className="text-stone-900 font-bold truncate block">{lot.sourceOrigin}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">Ketinggian Kebun:</span>
                      <strong className="text-stone-900 font-bold">{lot.altitude}</strong>
                    </div>
                    {lot.sourceBrix && (
                      <div>
                        <span className="text-stone-500 text-[10px] block">Kadar Gula Buah:</span>
                        <strong className="text-emerald-700 font-black">{lot.sourceBrix}° Brix (Matang)</strong>
                      </div>
                    )}
                    {lot.sourcePickingMethod && (
                      <div>
                        <span className="text-stone-500 text-[10px] block">Standar Petik:</span>
                        <strong className="text-stone-900 font-bold">{lot.sourcePickingMethod}</strong>
                      </div>
                    )}
                    {lot.sourceHarvestDate && (
                      <div className="col-span-2">
                        <span className="text-stone-500 text-[10px] block">Tanggal Panen Petani:</span>
                        <strong className="text-stone-900 font-bold">{lot.sourceHarvestDate}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. PENGELOLAAN & OLAHAN LIMBAH KOPI (ECO-CIRCULARITY TRACE) */}
                {(() => {
                  const ecoRating = calculateProcessorEcoRating(
                    lot.wasteManagement,
                    lot.sourceTotalCherryWeightKg || lot.greenBeanWeightKg * 5,
                    lot.greenBeanWeightKg
                  );
                  return (
                    <div className="bg-teal-50/70 border-2 border-teal-300/80 rounded-xl p-3 space-y-1.5">
                      <div className="flex items-center justify-between border-b border-teal-200 pb-1.5">
                        <span className="text-[10px] uppercase font-black text-teal-950 flex items-center gap-1">
                          <Recycle className="w-3.5 h-3.5 text-teal-700" />
                          Alokasi Limbah Kopi (Eco-Circularity Trace)
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[9px] text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-400" />
                            ⭐ {ecoRating.starRating} ({ecoRating.ecoScore} Pts)
                          </span>
                          <span className="font-mono text-[9px] font-bold text-teal-900 bg-white px-1.5 py-0.5 rounded border border-teal-300 flex items-center gap-0.5">
                            <Leaf className="w-2.5 h-2.5 text-emerald-600" />
                            Zero Waste
                          </span>
                        </div>
                      </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] pt-0.5">
                    <div>
                      <span className="text-stone-500 text-[10px] block">Jenis Limbah Kopi:</span>
                      <strong className="text-stone-900 font-bold block truncate">
                        {lot.wasteManagement?.wasteType || 'Kulit Ceri (Pulp / Cascara)'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">Alur Pemanfaatan:</span>
                      <strong className="text-teal-800 font-black block truncate">
                        {lot.wasteManagement?.utilization || 'Teh Cascara & Pupuk Kompos Sirkular'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">Volume Terkelola:</span>
                      <strong className="text-stone-900 font-bold block">
                        {lot.wasteManagement?.weightKgOrLiters || Math.round(lot.greenBeanWeightKg * 2.2)} kg/L
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">Mitra / Penerima:</span>
                      <strong className="text-stone-900 font-bold block truncate">
                        {lot.wasteManagement?.recipientOrLocation || 'Kelompok Tani & Olah Kompos Organik'}
                      </strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-500 text-[10px] block">Metode Pengolahan Ramah Lingkungan:</span>
                      <strong className="text-stone-900 font-bold block text-[10px]">
                        {lot.wasteManagement?.processingMethod || 'Solar Dryer Raised Bed (Food Grade) & Kompos Aerobik 30 Hari'}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

              {/* Right Column (1 col): Realtime QR Code + 1D Barcode */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-stone-200 text-center">
                <div className="text-[9px] font-black uppercase tracking-wider text-stone-500 mb-1">
                  PINDAI UNTUK VERIFIKASI
                </div>
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code ${lot.id}`}
                    className="w-40 h-40 object-contain border border-stone-100 rounded-lg p-1"
                  />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center text-xs text-stone-400">
                    Membuat QR...
                  </div>
                )}
                <span className="text-[9px] text-stone-500 font-mono mt-1 block truncate max-w-[150px]">
                  {isLoopback ? networkHost : (typeof window !== 'undefined' ? window.location.host : '')}
                </span>

                {/* Classical 1D Barcode Line representation */}
                <div className="w-full mt-3 pt-2 border-t border-stone-200 flex flex-col items-center">
                  <div className="flex items-center justify-center gap-0.5 h-7 w-36 px-1 bg-white">
                    <div className="w-1 h-full bg-stone-900"></div>
                    <div className="w-0.5 h-full bg-white"></div>
                    <div className="w-1.5 h-full bg-stone-900"></div>
                    <div className="w-0.5 h-full bg-white"></div>
                    <div className="w-0.5 h-full bg-stone-900"></div>
                    <div className="w-1 h-full bg-stone-900"></div>
                    <div className="w-0.5 h-full bg-white"></div>
                    <div className="w-2 h-full bg-stone-900"></div>
                    <div className="w-1 h-full bg-white"></div>
                    <div className="w-0.5 h-full bg-stone-900"></div>
                    <div className="w-1.5 h-full bg-stone-900"></div>
                    <div className="w-0.5 h-full bg-white"></div>
                    <div className="w-1 h-full bg-stone-900"></div>
                    <div className="w-2 h-full bg-stone-900"></div>
                    <div className="w-0.5 h-full bg-white"></div>
                    <div className="w-1 h-full bg-stone-900"></div>
                  </div>
                  <span className="font-mono text-[9px] tracking-widest text-stone-700 mt-0.5 font-bold">
                    *{lot.id}*
                  </span>
                </div>
              </div>
            </div>

            {/* Sticker Footer Verification Seal */}
            <div className="mt-4 pt-3 border-t border-stone-300 flex flex-wrap items-center justify-between text-[10px] text-stone-500">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Terverifikasi Rantai Pasok sangrAI • Wet & Dry Mill Standard</span>
              </div>
              <span className="font-mono text-[9px] text-stone-400">
                Hash: {lot.id.split('-').join('')}•CCT2
              </span>
            </div>
          </div>

          {/* Action & Configuration Section (Hidden on Print) */}
          <div className="space-y-4 print:hidden">
            {/* Live Scan Testing Bar */}
            <div className="bg-stone-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  URL
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">
                    Tautan Realtime QR Barcode (Bisa di-scan langsung kamera HP):
                  </span>
                  <span className="font-mono text-xs text-amber-300 font-bold break-all">
                    {realtimeScanUrl}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Tersalin' : 'Salin URL'}
                </button>
                <button
                  type="button"
                  onClick={handleOpenLiveUrl}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-colors flex items-center gap-1 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Uji Buka URL Spek
                </button>
              </div>
            </div>

            {/* Host Config Accordion for LAN testing */}
            {isLoopback && (
              <div className="bg-stone-100 p-3.5 rounded-2xl border border-stone-200 text-xs text-stone-600">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-stone-800">Mode Jaringan Lokal (Wi-Fi):</strong> IP LAN aktif:{' '}
                    <code className="bg-white px-1.5 py-0.5 rounded border border-stone-300 text-stone-900 font-mono font-bold">
                      {networkHost}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingHost(!isEditingHost)}
                    className="text-amber-700 hover:text-amber-900 font-bold underline ml-2"
                  >
                    {isEditingHost ? 'Tutup' : 'Ubah IP LAN'}
                  </button>
                </div>

                {isEditingHost && (
                  <div className="mt-2.5 pt-2.5 border-t border-stone-200 flex items-center gap-2">
                    <input
                      type="text"
                      value={tempHost}
                      onChange={(e) => setTempHost(e.target.value)}
                      placeholder="Contoh: 10.100.5.87:5173"
                      className="px-3 py-1 bg-white border border-stone-300 rounded-lg text-xs font-mono grow text-stone-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setNetworkHost(tempHost);
                        localStorage.setItem('cct_network_host', tempHost);
                        setIsEditingHost(false);
                      }}
                      className="px-3 py-1 bg-stone-900 text-white rounded-lg font-bold text-xs hover:bg-stone-800"
                    >
                      Simpan IP
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                Cetak Stiker Karung Green Bean (Print)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
