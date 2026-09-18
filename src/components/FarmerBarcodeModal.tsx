import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  CheckCircle2,
  Sprout,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { FarmerHarvestLot } from '../types/coffee';

interface FarmerBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: FarmerHarvestLot | null;
  isNewUpload?: boolean;
}

export const FarmerBarcodeModal: React.FC<FarmerBarcodeModalProps> = ({
  isOpen,
  onClose,
  lot,
  isNewUpload = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Detect loopback (localhost/127.0.0.1) to automatically provide LAN IP for mobile scanners
  const isLoopback = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  const [networkHost, setNetworkHost] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cct_network_host');
      if (saved) return saved;
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return '10.100.5.87:5173'; // Mac Wi-Fi IP address
      }
      return window.location.host;
    }
    return '10.100.5.87:5173';
  });

  const [tempHost, setTempHost] = useState(networkHost);
  const [isEditingHost, setIsEditingHost] = useState(false);

  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
  const resolvedBaseUrl = isLoopback
    ? `${protocol}//${networkHost}`
    : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');

  const realtimeScanUrl = lot ? `${resolvedBaseUrl}/?lotId=${lot.id}` : '';

  useEffect(() => {
    if (lot && realtimeScanUrl) {
      // Encode realtime URL directly into QR code
      QRCode.toDataURL(realtimeScanUrl, {
        width: 280,
        margin: 1.5,
        color: {
          dark: '#2B1810',
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white p-6 relative print:hidden">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            {isNewUpload ? 'Upload Berhasil! Stiker Barcode Siap Ditempel' : 'Stiker Barcode & Spesifikasi Lot Karung'}
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Barcode Identitas Lot: {lot.id}
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Tempelkan stiker ini pada karung ceri kopi Anda. Pengolah (Processor) atau pembeli dapat langsung men-scan kode QR dengan kamera smartphone untuk verifikasi spesifikasi.
          </p>
        </div>

        {/* Printable Sticker View */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* The Actual Printable Physical Sticker Box */}
          <div
            id="printable-lot-sticker"
            className="bg-[#FCFAF7] border-3 border-stone-800 rounded-2xl p-5 sm:p-6 text-stone-900 shadow-md relative overflow-hidden"
          >
            {/* Header Label */}
            <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-black text-sm">
                  CCT
                </div>
                <div>
                  <span className="font-black text-xs uppercase tracking-wider block">
                    Coffee Chain Traceability (CCT)
                  </span>
                  <span className="text-[10px] text-stone-600 font-bold">
                    LOT SACK LABEL • TAHAP 1 (FARM HARVEST)
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">ID BATCH / LOT</span>
                <span className="font-mono text-base font-black text-stone-950 tracking-wider">
                  {lot.id}
                </span>
              </div>
            </div>

            {/* Main Content: Info Specs on Left, Realtime QR Code on Right */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="sm:col-span-2 space-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    Nama Petani & Kebun
                  </span>
                  <span className="text-sm font-black text-stone-900 block">
                    {lot.farmerName}
                  </span>
                  <span className="text-stone-600 text-[11px]">
                    {lot.farmLocation}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-white/80 p-2.5 rounded-xl border border-stone-300 text-[11px]">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Varietas:</span>
                    <strong className="text-stone-900 block truncate">{lot.variety}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Ketinggian:</span>
                    <strong className="text-stone-900 block">{lot.altitude}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Kadar Gula (Brix):</span>
                    <strong className="text-emerald-700 block">{lot.brix}° Brix (Optimal)</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Standar Petik:</span>
                    <strong className="text-stone-900 block truncate">{lot.pickingMethod.split(' ')[0]}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-200">
                  <span>Tanggal Panen: <strong>{lot.harvestDate}</strong></span>
                  <span className="font-black text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300">
                    Berat: {lot.totalWeightKg} kg
                  </span>
                </div>
              </div>

              {/* QR Code Container with Realtime Scan URL */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border-2 border-dashed border-stone-300 text-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code ${lot.id}`}
                    className="w-36 h-36 object-contain"
                  />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center text-xs text-stone-400">
                    Membuat QR...
                  </div>
                )}
                <span className="text-[9px] font-bold text-stone-700 mt-1 uppercase tracking-wider block">
                  SCAN DENGAN KAMERA HP
                </span>
                <span className="text-[8px] font-mono text-stone-500 truncate max-w-[130px] block mt-0.5">
                  {isLoopback ? networkHost : (typeof window !== 'undefined' ? window.location.host : '')}/?lotId={lot.id}
                </span>
              </div>
            </div>

            {/* Fake 1D Barcode Pattern Graphic at Bottom */}
            <div className="mt-4 pt-3 border-t-2 border-stone-800 flex flex-col items-center">
              <div className="flex items-center gap-[2px] h-9 w-full max-w-sm justify-center px-4">
                {[3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 1, 3, 4, 2, 1, 3, 2, 1, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1].map((w, i) => (
                  <span
                    key={i}
                    className="bg-stone-900 h-full inline-block"
                    style={{ width: `${w * 1.8}px` }}
                  />
                ))}
              </div>
              <span className="font-mono text-xs font-bold tracking-widest text-stone-800 mt-1">
                *{lot.id.replace(/[^A-Z0-9]/gi, '')}*
              </span>
            </div>
          </div>

          {/* Realtime URL & Wi-Fi IP Info Box */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-2 print:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Host Scan HP: <strong className="font-mono text-emerald-900">{resolvedBaseUrl}</strong></span>
              </div>
              {isLoopback && (
                <button
                  type="button"
                  onClick={() => setIsEditingHost(!isEditingHost)}
                  className="text-[11px] text-emerald-800 hover:text-emerald-950 underline font-bold"
                >
                  {isEditingHost ? 'Tutup' : 'Ubah IP / Host'}
                </button>
              )}
            </div>

            {isEditingHost && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={tempHost}
                  onChange={(e) => setTempHost(e.target.value)}
                  placeholder="Contoh: 10.100.5.87:5173"
                  className="px-3 py-1.5 rounded-lg border border-emerald-300 text-xs bg-white text-stone-900 flex-1 font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    setNetworkHost(tempHost);
                    localStorage.setItem('cct_network_host', tempHost);
                    setIsEditingHost(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                >
                  Terapkan
                </button>
              </div>
            )}

            <p className="text-stone-600 text-[11px] leading-relaxed">
              💡 <strong>Petunjuk Pindai Kamera HP:</strong> Kode QR di atas otomatis diarahkan ke alamat IP Wi-Fi lokal laptop Anda (<code className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-bold font-mono">10.100.5.87:5173</code>). Pastikan HP Anda terhubung ke <strong>jaringan Wi-Fi yang sama</strong> agar kamera HP dapat membuka halaman spesifikasi lot.
            </p>
          </div>

          {/* Print & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
            <div className="text-xs text-stone-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Stiker siap diprint untuk ditempel di karung goni fisik.</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3.5 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Tersalin!' : 'Salin URL Barcode'}
              </button>

              <button
                type="button"
                onClick={handleOpenLiveUrl}
                className="px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-100/70 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-colors flex items-center gap-1.5"
                title="Buka Halaman Hasil Scan Spek"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                Uji Buka URL Spek
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                Cetak Stiker Karung (Print)
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 border-t border-stone-200 p-4 sm:p-5 flex items-center justify-between print:hidden">
          <span className="text-xs text-stone-500">
            Sistem Barcode & Label Karung Petani Kopi CCT.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
