import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Users,
  Sprout,
  ShieldCheck,
  ArrowRight,
  X,
  Building2,
  Award,
} from 'lucide-react';
import { AppUser } from '../../types/coffee';

interface WelcomeCelebrationModalProps {
  user: AppUser | null;
  onClose: () => void;
}

export const WelcomeCelebrationModal: React.FC<WelcomeCelebrationModalProps> = ({
  user,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleStartAddingFarmer = () => {
    onClose();
    navigate('/admin/petani/tambah');
  };

  const handleExploreDashboard = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Top Decorative Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-[#07130C] text-white p-6 sm:p-8 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-8 h-8 text-amber-200" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pembayaran Berhasil &amp; Akun Aktif</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Selamat Datang di CircularCoffee!
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 max-w-sm mx-auto">
              Organisasi <strong className="text-emerald-300">{user?.organization || 'Kelompok Tani'}</strong> resmi terdaftar dan aktif.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="space-y-2 text-xs">
            <span className="font-extrabold uppercase tracking-wider text-stone-500 text-[10px] block">
              3 Layanan Terintegrasi yang Siap Anda Gunakan:
            </span>
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-[#F8F5F0] border border-[#E6DFD5] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-stone-900">1. Master Petani &amp; Kebun EUDR</div>
                  <div className="text-[11px] text-stone-500">Input anggota, poligon lahan GPS, dan nomor registrasi KTA.</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F8F5F0] border border-[#E6DFD5] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-stone-900">2. Stasiun Basah (Wet Mill)</div>
                  <div className="text-[11px] text-stone-500">Pencatatan ceri masuk, fermentasi, dan batch green bean.</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F8F5F0] border border-[#E6DFD5] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-stone-900">3. Verifikator Mutu ICS</div>
                  <div className="text-[11px] text-stone-500">Inspeksi internal, audit organik, dan QR Paspor Traceability.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={handleStartAddingFarmer}
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>+ Daftarkan Petani Anggota Pertama</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleExploreDashboard}
              className="w-full py-3 px-5 rounded-2xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold text-xs transition-colors cursor-pointer"
            >
              Jelajahi Dashboard Organisasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
