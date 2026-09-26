import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Warehouse,
  Award,
  Crown,
  Thermometer,
  Boxes,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { WarehouseLot, WarehouseGradeTier } from '../types/coffee';
import { getNetworkHost, getPublicBaseUrl, isLoopbackHost, saveNetworkHost } from '../utils/baseUrl';

interface WarehouseBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: WarehouseLot | null;
  isNewGrading?: boolean;
}

const GRADE_STYLES: Record<WarehouseGradeTier, {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  headerBg: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  'Grade 1 - Super Premium': {
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-950',
    badgeBorder: 'border-amber-400',
    headerBg: 'from-amber-950 via-stone-900 to-amber-950',
    icon: Crown,
  },
  'Grade 2 - Premium Grade': {
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-950',
    badgeBorder: 'border-indigo-400',
    headerBg: 'from-indigo-950 via-stone-900 to-indigo-950',
    icon: Award,
  },
  'Grade 3 - Medium Commercial': {
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-950',
    badgeBorder: 'border-sky-400',
    headerBg: 'from-slate-900 via-blue-950 to-slate-900',
    icon: Boxes,
  },
  'Grade 4 - Basic Commercial': {
    badgeBg: 'bg-stone-200',
    badgeText: 'text-stone-900',
    badgeBorder: 'border-stone-400',
    headerBg: 'from-stone-900 via-zinc-900 to-stone-900',
    icon: Boxes,
  },
};

export const WarehouseBarcodeModal: React.FC<WarehouseBarcodeModalProps> = ({
  isOpen,
  onClose,
  lot,
  isNewGrading = false,
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
      QRCode.toDataURL(realtimeScanUrl, {
        width: 280,
        margin: 1.5,
        color: {
          dark: '#0f172a',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [lot, realtimeScanUrl]);

  if (!isOpen || !lot) return null;

  const currentGradeTier: WarehouseGradeTier = lot.gradeTier || 'Grade 1 - Super Premium';
  const styleCfg = GRADE_STYLES[currentGradeTier] || GRADE_STYLES['Grade 1 - Super Premium'];
  const TierIcon = styleCfg.icon;

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
        <div className={`bg-gradient-to-r ${styleCfg.headerBg} text-white p-6 relative print:hidden`}>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Warehouse className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              {isNewGrading ? 'Grading & Storing Selesai' : 'Stiker Barcode Mutu Gudang'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            Barcode Stiker Karung Gudang: {lot.id}
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Tempelkan stiker barcode ini pada karung GrainPro/goni di ruang penyimpanan. Saat dipindai, langsung memvalidasi sertifikasi grading, skor SCA, dan spesifikasi tanpa menampilkan harga.
          </p>
        </div>

        {/* IP Setting Toolbar for Smartphone Scanners */}
        {isLoopback && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2 print:hidden">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="font-bold">Akses Scan HP (Jaringan Lokal):</span>
              {!isEditingHost ? (
                <code className="bg-amber-100 px-2 py-0.5 rounded font-mono font-bold text-amber-900">
                  {networkHost}
                </code>
              ) : (
                <div className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    value={tempHost}
                    onChange={(e) => setTempHost(e.target.value)}
                    placeholder="Contoh: 192.168.1.15:5173"
                    className="px-2 py-0.5 rounded border border-amber-300 font-mono text-xs bg-white text-stone-900"
                  />
                  <button
                    onClick={() => {
                      setNetworkHost(tempHost);
                      localStorage.setItem('cct_network_host', tempHost);
                      setIsEditingHost(false);
                    }}
                    className="px-2 py-0.5 bg-amber-600 text-white font-bold rounded text-[11px]"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => {
                      setTempHost(networkHost);
                      setIsEditingHost(false);
                    }}
                    className="px-2 py-0.5 bg-stone-200 text-stone-700 rounded text-[11px]"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>

            {!isEditingHost && (
              <button
                onClick={() => {
                  setTempHost(networkHost);
                  setIsEditingHost(true);
                }}
                className="text-[11px] font-bold text-amber-800 underline hover:text-amber-950"
              >
                Ganti IP Komputer
              </button>
            )}
          </div>
        )}

        {/* Printable Area - Physical Sack Label */}
        <div className="p-6 sm:p-8 space-y-6">
          <div
            id="printable-warehouse-barcode-sticker"
            className="border-2 border-dashed border-stone-800 rounded-3xl p-6 bg-white relative print:border-solid print:p-4 print:m-0"
          >
            {/* Top Label Header */}
            <div className="flex items-center justify-between border-b-2 border-stone-900 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-900 text-blue-400 flex items-center justify-center font-black text-sm">
                  sAI
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-wider uppercase text-stone-900">
                    sangrAI WAREHOUSE & LOGISTICS QA
                  </h3>
                  <p className="text-[10px] text-stone-500 font-semibold">
                    Standard Laboratorium Mutu, Grading & Penyimpanan Terkontrol
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold font-mono uppercase bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded">
                Tier 3: Warehouse
              </span>
            </div>

            {/* Middle Layout: QR Code + Grading Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* QR Code Container */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-stone-50 rounded-2xl border border-stone-200">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code ${lot.id}`}
                    className="w-48 h-48 object-contain rounded-lg shadow-2xs"
                  />
                ) : (
                  <div className="w-48 h-48 bg-stone-200 animate-pulse rounded-lg flex items-center justify-center text-xs text-stone-400">
                    Membuat QR...
                  </div>
                )}
                <span className="font-mono text-xs font-black tracking-widest text-stone-900 mt-2 block">
                  {lot.id}
                </span>
                <span className="text-[10px] text-stone-500 text-center font-medium mt-0.5">
                  Pindai untuk melihat sertifikasi grading & mutu lengkap
                </span>
              </div>

              {/* Technical Specifications (Zero Price) */}
              <div className="sm:col-span-7 space-y-2.5">
                {/* Grade Tier Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border ${styleCfg.badgeBg} ${styleCfg.badgeText} ${styleCfg.badgeBorder}`}
                  >
                    <TierIcon className="w-4 h-4" />
                    {lot.gradeTier}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-lg bg-stone-900 text-white font-mono text-xs font-black flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    SCA: {lot.verifiedScaScore}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-base text-stone-950 leading-tight">
                    {lot.variety}
                  </h4>
                  <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                    {lot.origin} • {lot.processMethod}
                  </p>
                </div>

                {/* Target Market Box */}
                <div className="p-2 bg-stone-50 rounded-xl border border-stone-200 text-[11px]">
                  <span className="font-bold text-stone-800 block">🎯 Target Pasar:</span>
                  <span className="text-stone-600">{lot.targetMarket}</span>
                </div>

                {/* Technical Specs 2-Col Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Cacat Fisik:</span>
                    <strong className="text-stone-900 font-bold">{lot.defectCount} defect/350g</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Ukuran Biji:</span>
                    <strong className="text-stone-900 font-bold">{lot.screenSize}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Kadar Air / aW:</span>
                    <strong className="text-emerald-700 font-bold">{lot.moistureContentPercent}% / {lot.waterActivityAw} aW</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Ruang Simpan:</span>
                    <strong className="text-blue-900 font-bold">{lot.storageLocation}</strong>
                  </div>
                </div>

                {/* Storage Conditions & Upstream Source */}
                <div className="text-[10px] text-stone-500 space-y-1 border-t border-stone-200 pt-2">
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-blue-600" />
                    <span>Iklim Gudang: <strong>{lot.temperatureCelsius}°C / {lot.humidityPercent}% RH</strong> ({lot.packagingType})</span>
                  </div>
                  <div>
                    Pengolah: <strong>{lot.sourceProcessorName}</strong> • Petani: <strong>{lot.sourceFarmerName}</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1 font-semibold text-stone-600">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Health Certificate:
                    </span>
                    {lot.hasHealthCertificate ? (
                      <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                        {lot.healthCertificateNumber || 'HC Certified'}
                      </span>
                    ) : (
                      <span className="font-medium text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded text-[10px]">
                        No Health Certificate
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-[9px] text-stone-400 font-medium">
              <span>*Label resmi fisik karung gudang sangrAI (Zero Price Policy / Tanpa Harga)</span>
              <span>Diperiksa & Disimpan: {lot.storedDate}</span>
            </div>
          </div>

          {/* Realtime URL Link & Actions */}
          <div className="space-y-3 print:hidden">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] font-mono text-stone-600 truncate flex-1 pl-1">
                {realtimeScanUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin URL</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleOpenLiveUrl}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-blue-400" />
                Cetak Stiker Karung Gudang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
