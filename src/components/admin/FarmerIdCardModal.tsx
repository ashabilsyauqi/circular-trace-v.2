import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  CheckCircle2,
  Sprout,
  ShieldCheck,
  Copy,
  Check,
  Building2,
  Calendar,
  MapPin,
  Phone,
  Download,
} from 'lucide-react';
import { AppUser } from '../../types/coffee';
import { getNetworkHost, getPublicBaseUrl } from '../../utils/baseUrl';

interface FarmerIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: AppUser | null;
}

export const FarmerIdCardModal: React.FC<FarmerIdCardModalProps> = ({
  isOpen,
  onClose,
  farmer,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const networkHost = getNetworkHost();
  const resolvedBaseUrl = getPublicBaseUrl(networkHost);
  const farmerVerifyUrl = farmer ? `${resolvedBaseUrl}/?farmerId=${farmer.id}` : '';

  useEffect(() => {
    if (farmer && farmerVerifyUrl) {
      QRCode.toDataURL(farmerVerifyUrl, {
        width: 200,
        margin: 1.5,
        color: {
          dark: '#1e3a1f',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [farmer, farmerVerifyUrl]);

  if (!isOpen || !farmer) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(farmerVerifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR-Biodata-${farmer.name.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Modal Top Action Bar */}
        <div className="bg-[#343a40] text-white p-4 flex items-center justify-between border-b border-[#4f5962]">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">
              Cetak Barcode &amp; Kartu Identitas Petani
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <p className="text-xs text-stone-500">
            Berikut adalah kartu identitas resmi anggota <strong>Kelompok Tani</strong> berstandar <em>Circular Coffee Trace</em>. Barcode QR di bawah dapat di-scan langsung di lapangan untuk memeriksa biodata, kepemilikan kebun, dan sertifikasi mutu petani.
          </p>

          {/* Printable ID Card (AdminLTE / Official Cooperative Style) */}
          <div
            ref={cardRef}
            className="bg-linear-to-b from-stone-900 via-stone-800 to-stone-900 rounded-xl p-5 text-white shadow-xl border-2 border-amber-500/50 relative overflow-hidden print:m-0 print:border-none print:shadow-none"
          >
            {/* Watermark Logo Decoration */}
            <Sprout className="w-48 h-48 text-emerald-500/5 absolute -bottom-10 -right-10 pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-stone-700/80 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-black shadow-xs">
                  <Building2 className="w-4 h-4 text-stone-950" />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm tracking-wide text-white uppercase leading-tight">
                    {farmer.organization || 'Gapoktan Kopi Mandiri Nusantara'}
                  </h4>
                  <p className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
                    Kartu Tanda Anggota Petani Kopi Resmi
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Terdaftar Resmi
                </span>
              </div>
            </div>

            {/* Card Main Info: Photo, Biodata, QR Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Photo & Status */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="relative">
                  <img
                    src={farmer.avatar}
                    alt={farmer.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border-2 border-amber-400 shadow-md"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 sm:left-2 sm:translate-x-0 bg-emerald-700 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 whitespace-nowrap">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Petani Aktif</span>
                  </div>
                </div>
              </div>

              {/* Biodata Fields */}
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">
                    Nama Petani
                  </span>
                  <span className="text-sm font-extrabold text-white block">
                    {farmer.name}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">
                    No. Anggota / NIK
                  </span>
                  <span className="font-mono text-[11px] text-amber-300 font-bold block">
                    {farmer.farmerCardNumber || 'KPT-PGL-2026-001'}
                  </span>
                  <span className="font-mono text-[10px] text-stone-400 block">
                    NIK: {farmer.nik || '3204311508820003'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">
                    Wilayah &amp; Luas Lahan
                  </span>
                  <span className="text-[11px] text-stone-200 block truncate">
                    {farmer.village || farmer.location}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold block">
                    Garapan: {farmer.totalLandAreaHa || 2.4} Hektar
                  </span>
                </div>
              </div>

              {/* Barcode / QR Code Box */}
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white text-stone-900 shadow-sm border border-stone-300 shrink-0">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code Biodata ${farmer.name}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-stone-100 flex items-center justify-center text-xs text-stone-400">
                    Memuat...
                  </div>
                )}
                <span className="text-[9px] font-mono font-bold text-stone-600 mt-1">
                  ID: {farmer.id}
                </span>
                <span className="text-[8px] text-stone-400 uppercase tracking-wider font-semibold">
                  Scan Biodata
                </span>
              </div>
            </div>

            {/* Card Footer Security Line */}
            <div className="mt-4 pt-3 border-t border-stone-700/80 flex items-center justify-between text-[10px] text-stone-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Terverifikasi Rantai Pasok Sirkular</span>
              </span>
              <span>Gapoktan Mandiri • CCT ID-2026</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link Biodata</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadQr}
                className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-600" />
                <span>Unduh Gambar QR</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-lg bg-[#343a40] hover:bg-stone-900 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer ml-auto"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak Kartu Tanda Anggota (Print A4)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
