import React from 'react';
import { UserRole } from '../types/coffee';
import {
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  ShieldCheck,
  Crown,
  ShoppingCart,
} from 'lucide-react';

export const ROLES_ORDER: UserRole[] = [
  'petani',
  'pengolah',
  'gudang',
  'roaster',
  'cafe',
  'verifikator',
  'buyer',
];

export const REGISTRABLE_ROLES: UserRole[] = [
  'petani',
  'pengolah',
  'gudang',
  'roaster',
  'cafe',
  'buyer',
];

export const ROLE_DETAILS: Record<
  UserRole,
  { label: string; badgeClass: string; icon: React.ReactNode; description: string }
> = {
  petani: {
    label: 'Kelompok Tani (Kebun)',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: <Sprout className="w-4 h-4 text-emerald-600" />,
    description: 'Kelompok Tani: Kelola kebun, panen ceri, sertifikasi 4C/EUDR, & pasok ke mill',
  },
  pengolah: {
    label: 'Pengolah Mill',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: <Cog className="w-4 h-4 text-amber-600" />,
    description: 'Beli cherry, olah jadi Green Bean, & jual ke Gudang',
  },
  gudang: {
    label: 'Gudang Silo',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
    icon: <Warehouse className="w-4 h-4 text-blue-600" />,
    description: 'Beli green bean, simpan klimatik, & jual ke Roaster',
  },
  roaster: {
    label: 'Roastery',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    icon: <Flame className="w-4 h-4 text-orange-600" />,
    description: 'Beli green bean, input profil sangrai, & jual ke Cafe',
  },
  cafe: {
    label: 'Cafe & Kedai',
    badgeClass: 'bg-stone-200 text-stone-800 border-stone-400',
    icon: <Coffee className="w-4 h-4 text-stone-700" />,
    description: 'Beli roasted beans & sajikan dengan Farm-to-Cup Traceability',
  },
  verifikator: {
    label: 'Verifikator QA',
    badgeClass: 'bg-amber-100 text-amber-950 border-amber-300 font-bold',
    icon: <ShieldCheck className="w-4 h-4 text-amber-600" />,
    description: 'Audit lahan EUDR, sertifikasi olahan, uji gudang, cupping sensori roast, & stempel mutu resmi',
  },
  superadmin: {
    label: 'Super Admin',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-400 font-bold',
    icon: <Crown className="w-4 h-4 text-amber-600" />,
    description: 'Owner & Pemilik Sistem sangrAI - Approval & Pengawasan Seluruh Ekosistem',
  },
  buyer: {
    label: 'Pembeli (Buyer)',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold',
    icon: <ShoppingCart className="w-4 h-4 text-emerald-600" />,
    description: 'Konsumen & Pembeli Komoditas Kopi (Dapat membeli langsung Ceri, Green Bean, Roasted Bean, hingga Seduhan Kafe)',
  },
};
