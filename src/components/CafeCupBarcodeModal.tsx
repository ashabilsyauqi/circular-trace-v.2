import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Coffee,
  MapPin,
  FileText,
  Grid,
} from 'lucide-react';
import { CafeInventoryItem } from '../types/coffee';

interface CafeCupBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CafeInventoryItem | null;
}

export const CafeCupBarcodeModal: React.FC<CafeCupBarcodeModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [printLayout, setPrintLayout] = useState<'single' | 'grid4' | 'grid8'>('single');

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
        return '10.100.5.87:5173';
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

  // URL for cup barcode scan
  const realtimeScanUrl = item ? `${resolvedBaseUrl}/?cupId=${item.id}` : '';

  useEffect(() => {
    if (item && realtimeScanUrl) {
      QRCode.toDataURL(realtimeScanUrl, {
        width: 260,
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
  }, [item, realtimeScanUrl]);

  if (!isOpen || !item) return null;

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

  // Sticker element component for reusability in single & sheet grid
  const renderCupSticker = (keyIndex?: number) => (
    <div
      key={keyIndex}
      className="border-2 border-stone-800 rounded-2xl p-4 bg-white text-stone-900 shadow-sm relative print:border-stone-900 print:shadow-none print:break-inside-avoid"
    >
      {/* Sticker Header: Cafe Brand + CCT Direct-Trade Stamp */}
      <div className="flex items-center justify-between border-b-2 border-stone-900 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-black text-xs">
            <Coffee className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-black text-xs uppercase tracking-wider block text-stone-900 leading-none">
              {item.cafeName || 'Specialty Coffee Shop'}
            </span>
            <span className="text-[9px] text-amber-800 font-bold block mt-0.5">
              FARM-TO-CUP VERIFIED SPECIALTY
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded border border-emerald-300 flex items-center gap-0.5">
            🌿 Eco ⭐ 4.95
          </span>
          <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
            SCA {item.scaScore}
          </span>
        </div>
      </div>

      {/* Main Sticker Body: QR Code & Tasting Profile */}
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* QR Code */}
        <div className="col-span-5 flex flex-col items-center justify-center p-1.5 bg-stone-50 rounded-xl border border-stone-200">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code ${item.beanName}`}
              className="w-24 h-24 object-contain rounded"
            />
          ) : (
            <div className="w-24 h-24 bg-stone-200 animate-pulse rounded flex items-center justify-center text-[9px] text-stone-400">
              QR...
            </div>
          )}
          <span className="font-mono text-[9px] font-black tracking-wider text-stone-900 mt-1 block text-center">
            {item.id}
          </span>
          <span className="text-[8px] text-stone-500 font-bold block text-center leading-tight">
            📲 Scan Cerita Biji
          </span>
        </div>

        {/* Coffee Info & Tasting Notes */}
        <div className="col-span-7 space-y-1.5 text-left">
          <div>
            <h4 className="font-black text-xs sm:text-sm text-stone-950 leading-tight">
              {item.beanName}
            </h4>
            <p className="text-[10px] text-stone-600 flex items-center gap-1 mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-stone-400 shrink-0" />
              {item.origin} ({item.lineage.altitude})
            </p>
          </div>

          <div className="text-[10px] space-y-0.5">
            <div className="text-stone-700">
              Proses: <strong className="font-bold text-stone-900">{item.processMethod}</strong>
            </div>
            <div className="text-stone-700">
              Sangrai: <strong className="font-bold text-stone-900">{item.roastLevel}</strong>
            </div>
          </div>

          {/* Tasting Notes Chips */}
          <div>
            <span className="text-[8px] font-bold uppercase text-stone-400 block mb-0.5">
              Flavor Notes:
            </span>
            <div className="flex flex-wrap gap-1">
              {item.tastingNotes.slice(0, 3).map((note, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-50 text-amber-950 border border-amber-200"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Lineage Crediting */}
      <div className="mt-2.5 pt-2 border-t border-stone-200 flex items-center justify-between text-[8px] text-stone-500">
        <span className="truncate max-w-[140px]">
          🌱 Petani: <strong>{item.lineage.farmerName.split('(')[0].trim()}</strong>
        </span>
        <span className="truncate max-w-[140px]">
          🔥 Roaster: <strong>{item.roasterName}</strong>
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 relative print:hidden shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Coffee className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Stiker Barcode Gelas Kopi Pelanggan (Cafe Cup Sticker)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            Cetak Stiker Gelas: {item.beanName}
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Tempelkan stiker barcode ini pada gelas seduh (paper cup, ice cup, cup sleeve, atau tumbler) pelanggan Anda. Saat dipindai tamu kedai, langsung memvalidasi keaslian silsilah Farm-to-Cup dan panduan rasa (tanpa menampilkan harga modal biji).
          </p>
        </div>

        {/* IP Setting Toolbar for Smartphone Scanners */}
        {isLoopback && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2 print:hidden shrink-0">
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

        {/* Layout Mode Selector (Print: Hidden) */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-3 flex items-center justify-between gap-3 print:hidden shrink-0">
          <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-stone-500" />
            Format Cetak Stiker:
          </span>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => setPrintLayout('single')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                printLayout === 'single'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              1 Stiker (Gelas)
            </button>
            <button
              type="button"
              onClick={() => setPrintLayout('grid4')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                printLayout === 'grid4'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Grid className="w-3 h-3" />
              Lembar 4x Stiker
            </button>
            <button
              type="button"
              onClick={() => setPrintLayout('grid8')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                printLayout === 'grid8'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Grid className="w-3 h-3" />
              Lembar 8x Stiker A4
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {printLayout === 'single' ? (
            <div className="max-w-md mx-auto">
              {renderCupSticker()}
            </div>
          ) : printLayout === 'grid4' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((idx) => renderCupSticker(idx))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => renderCupSticker(idx))}
            </div>
          )}

          {/* Realtime URL Link & Action Toolbar (Print: Hidden) */}
          <div className="space-y-3 pt-2 print:hidden">
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
                className="px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Layar Tamu</span>
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
                <Printer className="w-4 h-4 text-amber-400" />
                Cetak Stiker Gelas Kopi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
