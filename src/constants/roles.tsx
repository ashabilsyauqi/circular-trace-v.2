import React from 'react';
import { UserRole } from '../types/coffee';
import {
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
} from 'lucide-react';

export const ROLE_DETAILS: Record<
  UserRole,
  { label: string; badgeClass: string; icon: React.ReactNode; description: string }
> = {
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
};
