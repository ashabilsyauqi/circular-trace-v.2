import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { UserRole } from '../types/coffee';
import {
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { users, loginAsUser, setActiveView } = useCoffee();
  const [selectedRole, setSelectedRole] = useState<UserRole>('petani');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleCardMeta: Record<
    UserRole,
    {
      title: string;
      tier: string;
      color: string;
      badgeColor: string;
      icon: React.ReactNode;
      duty: string;
      marketplaceAction: string;
    }
  > = {
    petani: {
      title: 'Petani Kopi',
      tier: 'Tahap 1: Hulu (Farm)',
      color: 'hover:border-emerald-500 hover:shadow-emerald-50',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: <Sprout className="w-6 h-6 text-emerald-600" />,
      duty: 'Pencatatan hasil panen ceri, elevasi kebun, kadar brix, dan sertifikasi lot.',
      marketplaceAction: 'Menjual ceri ke Pengolah (Mill)',
    },
    pengolah: {
      title: 'Pengolah (Mill Station)',
      tier: 'Tahap 2: Pengolahan (Mill)',
      color: 'hover:border-amber-500 hover:shadow-amber-50',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: <Cog className="w-6 h-6 text-amber-600" />,
      duty: 'Pengolahan ceri basah ke green bean, kontrol fermentasi, dan manajemen limbah sirkular.',
      marketplaceAction: 'Menjual Green Bean ke Gudang',
    },
    gudang: {
      title: 'Gudang (Warehouse & QA)',
      tier: 'Tahap 3: Penyimpanan (Storage)',
      color: 'hover:border-blue-500 hover:shadow-blue-50',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: <Warehouse className="w-6 h-6 text-blue-600" />,
      duty: 'Grading mutu SNI/SCA, kontrol suhu & kelembaban hermetik, dan penentuan harga jual.',
      marketplaceAction: 'Menjual Green Bean ke Roaster',
    },
    roaster: {
      title: 'Roaster (Roastery)',
      tier: 'Tahap 4: Penyangraian (Roast)',
      color: 'hover:border-orange-500 hover:shadow-orange-50',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: <Flame className="w-6 h-6 text-orange-600" />,
      duty: 'Profiling sangrai, Agtron, DTR, uji sensori cupping, dan packaging ritel.',
      marketplaceAction: 'Menjual Roasted Beans ke Pemilik Cafe',
    },
    cafe: {
      title: 'Pemilik Cafe (Barista Bar)',
      tier: 'Tahap 5: Hilir (Cup & Barista)',
      color: 'hover:border-stone-600 hover:shadow-stone-50',
      badgeColor: 'bg-stone-200 text-stone-800 border-stone-400',
      icon: <Coffee className="w-6 h-6 text-stone-700" />,
      duty: 'Manajemen inventaris bar, pencetakan barcode cup, dan penyajian kopi otentik.',
      marketplaceAction: 'Menyajikan ke Pelanggan Kedai',
    },
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Find matching user for role or default to primary user
    const matched = users.find((u) => u.role === selectedRole) || users[0];
    setTimeout(() => {
      loginAsUser(matched.id);
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FAF6F0] to-[#EFE7DC] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header Info */}
      <div className="max-w-6xl mx-auto w-full pt-4 pb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100/80 text-amber-900 border border-amber-300/80 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Portal Masuk Resmi • Rantai Pasok Digital CCT-Coffee
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
          CCT Coffee Supply Chain
        </h1>
        <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-2xl mx-auto">
          Sistem masuk terisolasi berbasis peran untuk <strong className="text-emerald-700">Petani</strong> $\rightarrow${' '}
          <strong className="text-amber-700">Pengolah</strong> $\rightarrow${' '}
          <strong className="text-blue-700">Gudang</strong> $\rightarrow${' '}
          <strong className="text-orange-700">Roaster</strong> $\rightarrow${' '}
          <strong className="text-stone-800">Pemilik Cafe</strong>.
        </p>
      </div>

      {/* Main Login Form Area */}
      <div className="max-w-4xl mx-auto w-full mb-8">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden p-6 sm:p-10">
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-black text-stone-800 uppercase tracking-wider">
                  1. Pilih Peran / Departemen Akun Anda:
                </label>
                <span className="inline-flex items-center gap-1 text-xs text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Role-Based Workspace
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(Object.keys(roleCardMeta) as UserRole[]).map((roleKey) => {
                  const isSel = selectedRole === roleKey;
                  return (
                    <button
                      type="button"
                      key={roleKey}
                      onClick={() => setSelectedRole(roleKey)}
                      className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                        isSel
                          ? 'bg-amber-50/80 border-amber-600 text-stone-950 shadow-md ring-2 ring-amber-500/20'
                          : 'bg-stone-50/70 border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {roleCardMeta[roleKey].icon}
                        {isSel && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                      </div>
                      <div>
                        <span className="font-bold text-xs block leading-tight text-stone-900">
                          {roleCardMeta[roleKey].title}
                        </span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          {roleCardMeta[roleKey].tier.split(':')[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role detail highlight */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-black text-amber-950 block">
                  Lingkup Kerja: {roleCardMeta[selectedRole].title}
                </span>
                <p className="text-stone-600 text-[11px] mt-0.5">
                  {roleCardMeta[selectedRole].duty}
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-amber-900 border border-amber-300 shrink-0">
                {roleCardMeta[selectedRole].tier}
              </span>
            </div>

            {/* Credential Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Email / Nama Pengguna Terdaftar
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={`Contoh: ${users.find(u => u.role === selectedRole)?.name || 'admin@cct.id'}`}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Kata Sandi (Password)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-stone-900 hover:bg-amber-700 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Memverifikasi...' : `Masuk ke Panel ${roleCardMeta[selectedRole].title}`}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setActiveView('marketplace')}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
              >
                Jelajahi E-Commerce Publik
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-stone-500 pb-2">
        <p>CCT Coffee Supply Chain System • Dedicated Role-Based Workspace Architecture</p>
      </footer>
    </div>
  );
};
