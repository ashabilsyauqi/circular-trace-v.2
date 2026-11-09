import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Printer,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Award,
  Leaf,
  Sprout,
  Truck,
  Coffee,
  CheckCircle2,
  Calendar,
  MapPin,
  Building2,
  Sparkles,
} from 'lucide-react';
import { BuyerOrderRecord } from '../BuyerView';

interface BuyerPassportQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: BuyerOrderRecord | null;
}

export const BuyerPassportQrModal: React.FC<BuyerPassportQrModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedBatch, setCopiedBatch] = useState<boolean>(false);

  const item = order?.items[0];
  const batchId = item?.batchId || 'BATCH-PSS-2026-HNY02';
  const certNumber = 'CERT-EUDR-2026-' + (order?.invoiceNo.replace(/[^0-9]/g, '').slice(-6) || '86540');
  const auditHash = 'SHA256:4b19c288f01a37bc9910d8a90184bced';

  // Live URL for public scan
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3036';
  const realtimeScanUrl = `${originUrl}/trace?lotId=${batchId}`;

  useEffect(() => {
    if (isOpen && order) {
      QRCode.toDataURL(realtimeScanUrl, {
        width: 240,
        margin: 1.5,
        color: {
          dark: '#0B2418',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [isOpen, order, realtimeScanUrl]);

  if (!isOpen || !order) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(realtimeScanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyBatch = () => {
    navigator.clipboard.writeText(batchId);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0C2016] via-[#133223] to-[#0A1A11] text-white flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Traceability Passport</span>
              </span>
              <span className="text-[10px] bg-white/10 text-stone-300 px-2 py-0.5 rounded-md font-mono">
                {order.invoiceNo}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>Paspor Digital &amp; Barcode Kopi</span>
            </h3>
            <p className="text-xs text-stone-300">
              Sertifikat Asal-Usul Kebun, Mutu SCA Specialty &amp; Kepatuhan Bebas Deforestasi (EUDR)
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY (PRINTABLE AREA) */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[78vh] overflow-y-auto" id="printable-passport-area">

          {/* ITEM SUMMARY CARD */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {item?.photoUrl && (
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="w-14 h-14 rounded-xl object-cover border border-stone-200 shadow-2xs shrink-0"
                />
              )}
              <div>
                <h4 className="font-extrabold text-sm text-stone-900 leading-tight">
                  {item?.title || 'Kopi Specialty Terverifikasi'}
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Varietas: <strong>{item?.variety || 'Arabika / Robusta'}</strong> &bull; Asal: <strong>{item?.origin || 'Indonesia'}</strong>
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-stone-400" />
                    <span>{order.sellerName}</span>
                  </span>
                  <span>&bull;</span>
                  <span>Resi: {order.resiNo}</span>
                </div>
              </div>
            </div>

            <div className="text-right sm:border-l sm:pl-4 sm:border-stone-200 shrink-0">
              <span className="text-[10px] text-stone-400 uppercase font-black block">Status Paspor</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Terverifikasi Sah</span>
              </span>
            </div>
          </div>

          {/* BARCODE & QR CODE VISUAL SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. REAL QR CODE CANVAS */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col items-center justify-between text-center space-y-3">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">
                  QR Code Paspor Silsilah
                </span>
                <span className="text-xs text-stone-500">Scan via Kamera Smartphone</span>
              </div>

              {/* QR Image */}
              <div className="p-2.5 bg-white rounded-2xl border-2 border-dashed border-emerald-300 shadow-xs flex items-center justify-center">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code Paspor Kopi" className="w-40 h-40 object-contain" />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center bg-stone-100 rounded-xl">
                    <QrCode className="w-8 h-8 text-stone-400 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Action Button: Buka Halaman Scan Publik */}
              <a
                href={realtimeScanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-[#00AA5B] border border-emerald-300/80 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Tampilan Scan Publik</span>
              </a>
            </div>

            {/* 2. REALISTIC CODE 128 BARCODE STRIP */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-stone-600 block">
                  Barcode Lot Komoditas (GS1-128)
                </span>
                <span className="text-xs text-stone-500">Nomor Registrasi Batch Rantai Pasok</span>
              </div>

              {/* Barcode Visual Representation (Code 128 SVG) */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/90 flex flex-col items-center justify-center space-y-1">
                {/* SVG Code 128 Stripes */}
                <svg className="w-full h-14" viewBox="0 0 280 60" preserveAspectRatio="none">
                  {/* Guard Bars */}
                  <rect x="10" y="0" width="3" height="52" fill="#1C1917" />
                  <rect x="15" y="0" width="1.5" height="52" fill="#1C1917" />
                  <rect x="19" y="0" width="4.5" height="48" fill="#1C1917" />
                  <rect x="26" y="0" width="1.5" height="48" fill="#1C1917" />
                  <rect x="30" y="0" width="3" height="48" fill="#1C1917" />
                  <rect x="36" y="0" width="6" height="48" fill="#1C1917" />
                  <rect x="45" y="0" width="1.5" height="48" fill="#1C1917" />
                  <rect x="49" y="0" width="3" height="48" fill="#1C1917" />
                  <rect x="55" y="0" width="4.5" height="48" fill="#1C1917" />
                  <rect x="62" y="0" width="1.5" height="48" fill="#1C1917" />
                  <rect x="66" y="0" width="6" height="48" fill="#1C1917" />
                  <rect x="75" y="0" width="3" height="48" fill="#1C1917" />
                  <rect x="81" y="0" width="1.5" height="48" fill="#1C1917" />
                  <rect x="85" y="0" width="4.5" height="48" fill="#1C1917" />
                  <rect x="92" y="0" width="3" height="48" fill="#1C1917" />
                  <rect x="98" y="0" width="1.5" height="48" fill="#1C1917" />
                  <rect x="102" y="0" width="6" height="48" fill="#1C1917" />
                  <rect x="111" y="0" width="3" height="48" fill="#1C1917" />
                  <rect x="117" y="0" width="4.5" height="48" fill="#1C1917" />
                  <rect x="124" y="0" width="1.5" height="48" fill="#1C1917" />
                  <rect x="128" y="0" width="6" height="48" fill="#1C1917" />
                  <rect x="137" y="0" width="3" height="48" fill="#1C1917" />
                  <rect x="143" y="0" width="1.5" height="48" fill="#1C1917" />
                  <rect x="147" y="0" width="4.5" height="48" fill="#1C1917" />
                  <rect x="154" y="0" width="3" height="48" fill="#1C1917" />
                  <rect x="160" y="0" width="6" height="48" fill="#1C1917" />
                  <rect x="169" y="0" width="1.5" height="48" fill="#1C1917" />
                  <rect x="173" y="0" width="4.5" height="48" fill="#1C1917" />
                  <rect x="180" y="0" width="1.5" height="48" fill="#1C1917" />
                  <rect x="184" y="0" width="6" height="48" fill="#1C1917" />
                  <rect x="193" y="0" width="3" height="48" fill="#1C1917" />
                  <rect x="199" y="0" width="4.5" height="48" fill="#1C1917" />
                  <rect x="206" y="0" width="1.5" height="48" fill="#1C1917" />
                  <rect x="210" y="0" width="6" height="48" fill="#1C1917" />
                  <rect x="219" y="0" width="3" height="48" fill="#1C1917" />
                  <rect x="225" y="0" width="1.5" height="48" fill="#1C1917" />
                  <rect x="229" y="0" width="4.5" height="48" fill="#1C1917" />
                  <rect x="236" y="0" width="6" height="48" fill="#1C1917" />
                  <rect x="245" y="0" width="1.5" height="48" fill="#1C1917" />
                  <rect x="249" y="0" width="3" height="48" fill="#1C1917" />
                  <rect x="255" y="0" width="4.5" height="48" fill="#1C1917" />
                  <rect x="262" y="0" width="1.5" height="52" fill="#1C1917" />
                  <rect x="266" y="0" width="3" height="52" fill="#1C1917" />
                </svg>
                {/* Human Readable GS1 Text */}
                <p className="font-mono text-[10px] text-stone-700 tracking-wider font-bold">
                  (01) 899723456789 (10) {batchId}
                </p>
              </div>

              {/* Batch ID Card with Copy Button */}
              <div className="flex items-center justify-between gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200">
                <div className="truncate">
                  <span className="text-[9px] text-stone-400 font-bold uppercase block">ID Batch Lot:</span>
                  <span className="font-mono text-xs font-bold text-stone-900 truncate block">{batchId}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBatch}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  title="Salin ID Batch"
                >
                  {copiedBatch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                  <span>{copiedBatch ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>

              {/* Quick specs pill */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] text-amber-800 font-bold block">Skor Cupping SCA</span>
                  <span className="text-sm font-black text-amber-950 font-mono">87.5 (Specialty)</span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-bold block">Jejak Karbon Terhindar</span>
                  <span className="text-sm font-black text-emerald-950 font-mono">4.8 kg CO₂e</span>
                </div>
              </div>
            </div>

          </div>

          {/* OFFICIAL AUDITOR VERIFICATION STAMP */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-stone-50 border-2 border-emerald-500/40 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#00AA5B] text-white flex items-center justify-center font-black shadow-xs shrink-0">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                    Sertifikat Kepatuhan Hijau &amp; Asal Kebun
                  </h4>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Sistem Penjaminan Mutu &amp; Ketertelusuran Rantai Pasok Kopi Sirkular
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider shrink-0 shadow-2xs">
                ✓ Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1 border-t border-emerald-200/60">
              <div>
                <span className="text-[10px] text-stone-500 block">Diverifikasi Oleh:</span>
                <p className="font-extrabold text-stone-900">Prof. Novizar Nazir</p>
                <p className="text-[10px] text-stone-600">Teknologi Pertanian (TPHP UNAND) &amp; Auditor Rantai Pasok</p>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 block">Nomor Sertifikat:</span>
                <p className="font-mono font-bold text-stone-900">{certNumber}</p>
                <p className="text-[10px] text-stone-600">Standar: EUDR Deforestation-Free &bull; Zero Waste</p>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-white/80 border border-emerald-200 font-mono text-[9px] text-emerald-900 break-all">
              <span className="font-bold text-stone-500 block mb-0.5">Kriptografi Audit Hash:</span>
              <span>{auditHash}</span>
            </div>
          </div>

          {/* 4-STEP SUPPLY CHAIN TRACEABILITY LINEAGE */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-[#00AA5B]" />
              <span>Silsilah Rantai Pasok (Farm-to-Cup Traceability)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              
              {/* Step 1: Kebun */}
              <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-[11px]">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1. Kebun Hulu</span>
                </div>
                <p className="font-bold text-stone-900 text-xs truncate">{order.sellerName}</p>
                <p className="text-[10px] text-stone-500">{item?.origin || 'Indonesia'}</p>
                <p className="text-[10px] text-emerald-700 font-medium">Brix 22.4&deg; &bull; Petik Merah</p>
              </div>

              {/* Step 2: Pengolahan */}
              <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-[11px]">
                  <Leaf className="w-3.5 h-3.5 text-amber-600" />
                  <span>2. Pascapanen</span>
                </div>
                <p className="font-bold text-stone-900 text-xs truncate">{order.sellerOrg}</p>
                <p className="text-[10px] text-stone-500">Honey Anaerobic</p>
                <p className="text-[10px] text-amber-700 font-medium">Kadar Air 11.5%</p>
              </div>

              {/* Step 3: Gudang & QA */}
              <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-blue-800 font-extrabold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>3. QA &amp; Sortasi</span>
                </div>
                <p className="font-bold text-stone-900 text-xs">Specialty Grade 1</p>
                <p className="text-[10px] text-stone-500">Defect: &le; 3/350g</p>
                <p className="text-[10px] text-blue-700 font-medium font-mono">SCA 87.5 Score</p>
              </div>

              {/* Step 4: Pembeli */}
              <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#00AA5B] font-extrabold text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-[#00AA5B]" />
                  <span>4. Pembeli &amp; Logistik</span>
                </div>
                <p className="font-bold text-stone-900 text-xs">{order.courier}</p>
                <p className="text-[10px] text-stone-500">Resi: {order.resiNo}</p>
                <p className="text-[10px] text-emerald-700 font-medium truncate">{order.statusLabel}</p>
              </div>

            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
              <span>{copied ? 'Tautan Tersalin!' : 'Salin Tautan'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>Cetak Paspor</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#00AA5B] hover:bg-[#03AC0E] text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
