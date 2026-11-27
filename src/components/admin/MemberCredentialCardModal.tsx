import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  Copy,
  Check,
  Building2,
  Phone,
  Mail,
  Key,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sprout,
  Factory,
  Coffee,
  Sparkles,
  QrCode,
  MapPin,
  Lock,
} from 'lucide-react';
import { AppUser } from '../../types/coffee';

interface MemberCredentialCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AppUser | null;
  onCopySuccess?: (name: string) => void;
}

export const formatWhatsAppCredentialMessage = (user: AppUser): string => {
  const roleName =
    user.role === 'admin_kelompok_tani'
      ? 'Pengurus / Admin Kelompok Tani'
      : user.role === 'petani'
      ? 'Petani Kopi (Mitra Kelompok Tani)'
      : user.role === 'pengolah'
      ? 'Operator Pengolah (Wet Mill)'
      : user.role === 'ict'
      ? 'Petugas Lapangan / Internal Control System (ICS)'
      : user.role;

  const poktanName = user.kelompokTaniName || user.organization || 'Kelompok Tani Mandiri (Ashabil)';
  const email = user.email || `${user.id}@petani.id`;
  const password = user.password || 'password123';
  const loginUrl = 'https://circularcoffee.circulartrace.id/login';

  return `*INFORMASI AKUN RESMI CIRCULARTRACE*
Halo Bapak/Ibu *${user.name}*,
Berikut adalah akun akses resmi Anda untuk sistem pelacakan kopi terpadu CircularTrace:

👤 *Nama Anggota:* ${user.name}
🏢 *Kelompok Tani:* ${poktanName}
🏷️ *Posisi / Peran:* ${roleName}${user.nik ? `\n🪪 *NIK:* ${user.nik}` : ''}${user.farmerCardNumber ? `\n🔖 *No. KTA:* ${user.farmerCardNumber}` : ''}
📧 *Email Login:* ${email}
🔑 *Password:* ${password}
🌐 *Tautan Login:* ${loginUrl}

_Petunjuk: Buka tautan di atas melalui browser HP Anda, lalu masukkan Email dan Password untuk masuk ke portal layanan Anda._`;
};

export const MemberCredentialCardModal: React.FC<MemberCredentialCardModalProps> = ({
  isOpen,
  onClose,
  user,
  onCopySuccess,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const email = user?.email || (user ? `${user.id}@petani.id` : '');
  const password = user?.password || 'password123';
  const loginTargetUrl = `https://circularcoffee.circulartrace.id/login?email=${encodeURIComponent(email)}`;

  useEffect(() => {
    if (user && loginTargetUrl) {
      QRCode.toDataURL(loginTargetUrl, {
        width: 240,
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
  }, [user, loginTargetUrl]);

  if (!isOpen || !user) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWa = () => {
    const text = formatWhatsAppCredentialMessage(user);
    navigator.clipboard.writeText(text);
    setCopiedWa(true);
    if (onCopySuccess) onCopySuccess(user.name);
    setTimeout(() => setCopiedWa(false), 3000);
  };

  const handleCopyField = (val: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(val);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR-Login-${user.name.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  const getRoleMeta = () => {
    if (user.role === 'admin_kelompok_tani') {
      return {
        label: 'Admin Kelompok Tani',
        sublabel: 'Pusat Kendali Ekosistem Terpadu',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        icon: <Building2 className="w-4 h-4 text-amber-700" />,
      };
    }
    if (user.role === 'ict' || (user.assignedService as unknown) === 'ict') {
      return {
        label: 'Petugas ICS (Internal Control)',
        sublabel: 'Inspeksi Kebun EUDR & Verifikasi Mutu',
        badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
        icon: <ShieldCheck className="w-4 h-4 text-blue-700" />,
      };
    }
    if (user.role === 'pengolah' || user.assignedService === 'pengolah') {
      return {
        label: 'Operator Pengolah (Wet Mill)',
        sublabel: 'Pengolahan Ceri, Fermentasi, & Drying',
        badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
        icon: <Factory className="w-4 h-4 text-orange-700" />,
      };
    }
    return {
      label: 'Petani Kopi (Hulu)',
      sublabel: 'Budidaya Kebun, Petik Ceri, & Setor Panen',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: <Sprout className="w-4 h-4 text-emerald-700" />,
    };
  };

  const meta = getRoleMeta();

  return (
    <>
      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #member-credential-slip, #member-credential-slip * {
            visibility: visible !important;
          }
          #member-credential-slip {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 640px !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            box-shadow: none !important;
            border: 2px solid #292524 !important;
            background: #ffffff !important;
            z-index: 999999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
        <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6">
          {/* Modal Header */}
          <div className="bg-[#343a40] text-white px-5 py-4 flex items-center justify-between border-b border-[#4f5962] no-print">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-100">
                  Slip &amp; Kartu Kredensial Akun Anggota
                </h3>
                <p className="text-[11px] text-stone-400">
                  Cetak fisik atau bagikan informasi login resmi kepada anggota kelompok tani
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-5 bg-stone-50/50">
            {/* Quick Share Action Buttons Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl bg-white border border-stone-200 shadow-2xs no-print">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyWa}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="Salin pesan WA siap kirim"
                >
                  {copiedWa ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedWa ? 'Pesan WA Disalin!' : 'Salin Kredensial WA (1 Klik)'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="Cetak slip dokumen fisik (Ctrl+P)"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cetak Slip / Print</span>
                </button>
              </div>

              {qrDataUrl && (
                <button
                  onClick={handleDownloadQr}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                  title="Unduh QR Code sebagai gambar PNG"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh QR</span>
                </button>
              )}
            </div>

            {/* PRINTABLE CARD SLIP */}
            <div
              id="member-credential-slip"
              className="bg-white rounded-2xl border-2 border-stone-800 p-5 sm:p-6 shadow-md relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-emerald-600 to-amber-700" />

              {/* Card Header: Brand & Title */}
              <div className="flex items-start justify-between border-b border-stone-200 pb-4 pt-1 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Coffee className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        CircularTrace ID
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        ID: {user.id}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight leading-tight mt-0.5">
                      KARTU KREDENSIAL ANGGOTA KELOMPOK TANI
                    </h2>
                    <p className="text-[11px] text-stone-500">
                      {user.kelompokTaniName || user.organization || 'Kelompok Tani Mandiri (Ashabil)'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black border ${meta.badgeBg}`}>
                    {meta.icon}
                    <span>{meta.label}</span>
                  </span>
                </div>
              </div>

              {/* Card Content Grid: Member Info & QR Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
                {/* Member Profile Details (2 Cols) */}
                <div className="sm:col-span-2 space-y-3.5">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-stone-300 shadow-2xs shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="min-w-0">
                      <h4 className="text-base font-black text-stone-900 truncate">
                        {user.name}
                      </h4>
                      <p className="text-xs text-stone-600 font-medium truncate">
                        {meta.sublabel}
                      </p>
                      {user.nik && (
                        <div className="text-[11px] text-stone-500 mt-0.5 font-mono">
                          NIK: <strong className="text-stone-800">{user.nik}</strong>
                          {user.farmerCardNumber && (
                            <span className="ml-2">| KTA: {user.farmerCardNumber}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location & Contact Info */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Wilayah / Lokasi:</span>
                      <span className="text-stone-800 font-semibold truncate block">
                        {user.location || user.village || 'Kintamani, Bangli, Bali'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">No. WhatsApp / HP:</span>
                      <span className="text-stone-800 font-semibold truncate block">
                        {user.phone || '-'}
                      </span>
                    </div>
                  </div>

                  {/* Credential Access Box (Highlight) */}
                  <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-amber-900 font-black text-[11px] uppercase tracking-wide">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Akses Login Resmi Sistem</span>
                      </div>
                      <span className="text-[10px] font-normal text-amber-800 lowercase">
                        portal.circulartrace.id
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {/* Email */}
                      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2 truncate">
                          <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="text-stone-500 font-medium text-[11px]">Email Login:</span>
                          <span className="font-mono font-bold text-stone-900 truncate">{email}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyField(email, setCopiedEmail)}
                          className="text-stone-400 hover:text-amber-800 p-1 cursor-pointer no-print"
                          title="Salin Email"
                        >
                          {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Password */}
                      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2">
                          <Key className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="text-stone-500 font-medium text-[11px]">Password:</span>
                          <span className="font-mono font-bold text-amber-900">
                            {showPassword ? password : '••••••••••••'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 no-print">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[10px] text-stone-500 hover:text-stone-800 px-1 py-0.5 cursor-pointer font-bold"
                          >
                            {showPassword ? 'Tutup' : 'Lihat'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyField(password, setCopiedPassword)}
                            className="text-stone-400 hover:text-amber-800 p-1 cursor-pointer"
                            title="Salin Password"
                          >
                            {copiedPassword ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Section (1 Col) */}
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-stone-700" />
                    <span>Scan Login HP</span>
                  </span>

                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="QR Code Login"
                      className="w-36 h-36 bg-white p-1.5 rounded-lg border border-stone-300 shadow-2xs"
                    />
                  ) : (
                    <div className="w-36 h-36 bg-stone-200 rounded-lg animate-pulse" />
                  )}

                  <p className="text-[9px] text-stone-500 mt-2 leading-tight">
                    Arahkan kamera HP ke kode QR di atas untuk membuka formulir login akun secara langsung.
                  </p>
                </div>
              </div>

              {/* Card Footer: Validation Note */}
              <div className="mt-4 pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-stone-500 gap-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Diterbitkan resmi oleh Pengurus Kelompok Tani Mandiri (Ashabil)</span>
                </div>
                <div className="font-mono text-stone-400">
                  Dicetak: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Bottom Footer Actions */}
          <div className="bg-white px-6 py-4 border-t border-stone-200 flex items-center justify-between no-print">
            <span className="text-xs text-stone-500">
              Slip ini dapat disimpan sebagai PDF atau dicetak menggunakan kertas A4 / KTA.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50 transition-colors cursor-pointer text-xs"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors cursor-pointer text-xs shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Slip Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
