import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Printer, Copy, Check, ExternalLink, Flame, MapPin, ShieldCheck } from 'lucide-react';
import { RoastedBeanLot } from '../../types/coffee';

interface RoasterBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: RoastedBeanLot | null;
}

// QR/traceability sticker for a roasted bean lot, styled to match the flat "simple ERP"
// look (solid colors, no heavy gradients) rather than the ornate warehouse/processor tickets.
export const RoasterBarcodeModal: React.FC<RoasterBarcodeModalProps> = ({ isOpen, onClose, lot }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const isLoopback =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const [networkHost] = useState<string>(() => {
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

  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
  const resolvedBaseUrl = isLoopback
    ? `${protocol}//${networkHost}`
    : typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:5173';

  const realtimeScanUrl = lot ? `${resolvedBaseUrl}/?lotId=${lot.id}` : '';

  useEffect(() => {
    if (lot && realtimeScanUrl) {
      QRCode.toDataURL(realtimeScanUrl, {
        width: 260,
        margin: 1.5,
        color: { dark: '#111827', light: '#FFFFFF' },
        errorCorrectionLevel: 'M',
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [lot, realtimeScanUrl]);

  if (!isOpen || !lot) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(realtimeScanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Flat header, single accent color, no gradient */}
        <div className="bg-[#1E2333] text-white px-6 py-5 flex items-start justify-between print:hidden">
          <div>
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5" />
              Roasted Lot Diterbitkan
            </div>
            <h2 className="text-lg font-bold">Barcode Lot: {lot.id}</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              QR ini menautkan konsumen ke riwayat penelusuran lot dari petani sampai roaster.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5" id="printable-roaster-barcode-sticker">
          <div className="flex flex-col sm:flex-row gap-5 items-center border border-slate-200 rounded-xl p-4">
            <div className="shrink-0 flex flex-col items-center gap-2">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt={`QR ${lot.id}`} className="w-40 h-40 object-contain" />
              ) : (
                <div className="w-40 h-40 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-[11px] text-slate-400">
                  Membuat QR...
                </div>
              )}
              <span className="font-mono text-[11px] font-bold text-slate-900">{lot.id}</span>
            </div>

            <div className="flex-1 space-y-2 text-sm w-full">
              <h3 className="font-bold text-slate-900">{lot.origin} — {lot.variety}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {lot.processMethod} • {lot.roastLevel}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                <div>
                  <span className="text-slate-400 block">SCA Score</span>
                  <strong className="text-slate-900">{lot.scaCuppingScore}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Agtron</span>
                  <strong className="text-slate-900">#{lot.agtronNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Roast Date</span>
                  <strong className="text-slate-900">{lot.roastDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Stok</span>
                  <strong className="text-slate-900">{lot.availablePacks}/{lot.totalPacks} pack</strong>
                </div>
              </div>
              <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Sudah tampil di Unified Marketplace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 print:hidden">
            <span className="text-[11px] font-mono text-slate-600 truncate flex-1 pl-1">{realtimeScanUrl}</span>
            <button
              onClick={handleCopyUrl}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Tersalin' : 'Salin URL'}
            </button>
            <button
              onClick={() => window.open(realtimeScanUrl, '_blank')}
              className="px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 text-xs font-bold flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Buka
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 print:hidden">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
            >
              Tutup
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-[#1E2333] text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Cetak Stiker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
