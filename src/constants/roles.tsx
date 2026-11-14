import React from 'react';
import { UserRole, OperationalService } from '../types/coffee';
import {
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const ACTIVE_OPERATIONAL_SERVICES: OperationalService[] = [
  'petani',
  'pengolah',
  'gudang',
  'roaster',
  'cafe',
];

export const ROLE_DETAILS: Record<
  UserRole,
  { label: string; badgeClass: string; icon: React.ReactNode; description: string }
> = {
  admin_kelompok_tani: {
    label: 'Admin Kelompok Tani',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: <Building2 className="w-4 h-4 text-amber-700" />,
    description: 'Control Tower pengelola ekosistem terpadu 5 layanan & penugasan akun anggota',
  },
  petani: {
    label: 'Petani Kopi',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: <Sprout className="w-4 h-4 text-emerald-600" />,
    description: 'Upload hasil panen cherry & jual ke Pengolah',
  },
  pengolah: {
    label: 'Pengolah (Mill Station)',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: <Cog className="w-4 h-4 text-amber-600" />,
    description: 'Beli cherry, olah jadi Green Bean, & jual ke Gudang',
  },
  gudang: {
    label: 'Gudang (Warehouse QA)',
    badgeClass: 'bg-stone-200 text-stone-900 border-stone-300',
    icon: <Warehouse className="w-4 h-4 text-stone-700" />,
    description: 'Beli green bean, simpan klimatik, & jual ke Roaster',
  },
  roaster: {
    label: 'Roaster (Roastery)',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    icon: <Flame className="w-4 h-4 text-orange-600" />,
    description: 'Beli green bean, input profil sangrai, & jual ke Cafe',
  },
  cafe: {
    label: 'Pemilik Cafe (End User)',
    badgeClass: 'bg-stone-200 text-stone-800 border-stone-400',
    icon: <Coffee className="w-4 h-4 text-stone-700" />,
    description: 'Beli roasted beans & sajikan dengan Farm-to-Cup Traceability',
  },
  verifikator: {
    label: 'Verifikator (Non-aktif)',
    badgeClass: 'bg-slate-100 text-slate-500 border-slate-300 opacity-60',
    icon: <ShieldCheck className="w-4 h-4 text-slate-400" />,
    description: 'Layanan audit & sertifikasi mutu eksternal (sementara dinonaktifkan)',
  },
  ict: {
    label: 'Petugas ICT (Verifikator)',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
    icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
    description: 'Tim ICT Kelompok Tani: Verifikasi data petani, peta lahan kebun EUDR, & hasil panen ceri',
  },
};
