import React from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { UserRole } from '../../types/coffee';
import { Lock, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface SubscriptionGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: UserRole;
}

export const SubscriptionGateModal: React.FC<SubscriptionGateModalProps> = ({
  isOpen,
  onClose,
  targetRole,
}) => {
  const { setActiveView } = useCoffee();

  if (!isOpen) return null;

  const roleNameMap: Record<UserRole, { name: string; planName: string }> = {
    petani: { name: 'Manajemen Kebun Petani & EUDR', planName: 'Kelompok Tani & Mill' },
    pengolah: { name: 'Stasiun Olah Ceri Mill', planName: 'Kelompok Tani & Mill' },
    gudang: { name: 'Gudang Konsinyasi & Ekspor', planName: 'Commercial Chain (Trace Pro)' },
    roaster: { name: 'Artisan Roastery & QC Cupping', planName: 'Starter Roastery' },
    cafe: { name: 'Kedai Kopi & POS QR Cangkir', planName: 'Commercial Chain (Trace Pro)' },
    verifikator: { name: 'Dewan Audit Mutu & CT-4CI 108 Checkpoints', planName: 'Enterprise 360° Circular' },
    buyer: { name: 'Portal Pembeli & Marketplace', planName: 'Bebas Akses' },
    superadmin: { name: 'Super Admin Governance', planName: 'Owner Only' },
  };

  const targetInfo = roleNameMap[targetRole] || { name: 'Layanan Ekosistem', planName: 'Paket Langganan' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center border border-amber-300 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] uppercase tracking-wider">
            Fitur Memerlukan Paket Langganan Aktif
          </span>
          <h3 className="text-xl font-black text-stone-900 tracking-tight">
            Akses Layanan {targetInfo.name} Terkunci
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Untuk menggunakan modul ini, akun Anda perlu memiliki paket langganan minimal{' '}
            <strong className="text-stone-800">{targetInfo.planName}</strong>.
          </p>
        </div>

        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-2">
          <div className="font-bold text-stone-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Keunggulan Setelah Berlangganan:
          </div>
          <ul className="space-y-1.5 text-stone-600 text-[11px]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Akses penuh seluruh lembar kerja hulu-ke-hilir</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Sertifikasi QR Code &amp; EUDR Deforestation-Free</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Buku Besar Mutasi Finansial Terenkripsi</span>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              setActiveView('subscription');
            }}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Buka Halaman Manage Subscription</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 font-bold text-xs cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};
