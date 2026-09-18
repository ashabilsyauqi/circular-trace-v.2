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
  const { users, loginAsRole, loginAsUser } = useCoffee();
  const [activeTab, setActiveTab] = useState<'quick' | 'custom'>('quick');
  const [selectedRole, setSelectedRole] = useState<UserRole>('petani');
  const [customName, setCustomName] = useState('');
  const [customOrg, setCustomOrg] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsRole(selectedRole);
  };

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
      duty: 'Upload hasil panen cherry lengkap dengan varietas, ketinggian mdpl, brix, dan metode petik.',
      marketplaceAction: 'Menjual cherry langsung ke Pengolah (Processor)',
    },
    pengolah: {
      title: 'Pengolah (Mill Station)',
      tier: 'Tahap 2: Pengolahan (Mill)',
      color: 'hover:border-amber-500 hover:shadow-amber-50',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: <Cog className="w-6 h-6 text-amber-600" />,
      duty: 'Beli cherry petani, lakukan proses (Washed, Natural, Honey, Anaerobic), uji kadar air & defect.',
      marketplaceAction: 'Menjual Green Bean terstandarisasi ke Gudang',
    },
    gudang: {
      title: 'Gudang (Warehouse & QA)',
      tier: 'Tahap 3: Penyimpanan (Storage)',
      color: 'hover:border-blue-500 hover:shadow-blue-50',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: <Warehouse className="w-6 h-6 text-blue-600" />,
      duty: 'Kelola inventaris silo, kontrol suhu & kelembaban ruangan, verifikasi SCA cupping score.',
      marketplaceAction: 'Menjual Green Bean tersertifikasi ke Roaster',
    },
    roaster: {
      title: 'Roaster (Roastery)',
      tier: 'Tahap 4: Penyangraian (Roast)',
      color: 'hover:border-orange-500 hover:shadow-orange-50',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: <Flame className="w-6 h-6 text-orange-600" />,
      duty: 'Sangrai biji kopi, tentukan profil Agtron, tasting notes, rasio DTR, dan rekomendasi resting.',
      marketplaceAction: 'Menjual Roasted Beans ke Pemilik Cafe',
    },
    cafe: {
      title: 'Pemilik Cafe (End User)',
      tier: 'Tahap 5: Hilir (Cup & Barista)',
      color: 'hover:border-stone-600 hover:shadow-stone-50',
      badgeColor: 'bg-stone-200 text-stone-800 border-stone-400',
      icon: <Coffee className="w-6 h-6 text-stone-700" />,
      duty: 'Pilih roasted beans berkualitas untuk disajikan di kedai, cetak kartu traceability asal-usul.',
      marketplaceAction: 'Membeli beans dari Roastery & sajikan ke Konsumen',
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FAF6F0] to-[#EFE7DC] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header Info */}
      <div className="max-w-6xl mx-auto w-full pt-4 pb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100/80 text-amber-900 border border-amber-300/80 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Platform Digital Rantai Pasok Kopi Terintegrasi
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
          CCT Coffee Supply Chain
        </h1>
        <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-2xl mx-auto">
          Menghubungkan rantai pasok kopi dari <strong className="text-emerald-700">Petani</strong> $\rightarrow${' '}
          <strong className="text-amber-700">Pengolah</strong> $\rightarrow${' '}
          <strong className="text-blue-700">Gudang</strong> $\rightarrow${' '}
          <strong className="text-orange-700">Roaster</strong> $\rightarrow${' '}
          <strong className="text-stone-800">Pemilik Cafe</strong> dengan isolasi lingkup kerja dan transparansi penuh.
        </p>

        {/* Visual Flow Indicator */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-stone-700">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5" /> 1. Petani
          </span>
          <span className="text-stone-400 font-bold">$\rightarrow$</span>
          <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
            <Cog className="w-3.5 h-3.5" /> 2. Pengolah
          </span>
          <span className="text-stone-400 font-bold">$\rightarrow$</span>
          <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1.5">
            <Warehouse className="w-3.5 h-3.5" /> 3. Gudang
          </span>
          <span className="text-stone-400 font-bold">$\rightarrow$</span>
          <span className="px-3 py-1 rounded-lg bg-orange-100 text-orange-800 border border-orange-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" /> 4. Roaster
          </span>
          <span className="text-stone-400 font-bold">$\rightarrow$</span>
          <span className="px-3 py-1 rounded-lg bg-stone-200 text-stone-800 border border-stone-400 flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5" /> 5. Pemilik Cafe
          </span>
        </div>
      </div>

      {/* Main Login Card Area */}
      <div className="max-w-5xl mx-auto w-full mb-8">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-stone-200 bg-stone-50">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 py-4 text-center text-sm font-bold transition-all border-b-2 ${
                activeTab === 'quick'
                  ? 'border-amber-600 text-stone-900 bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Masuk Cepat Demo (Pilih Peran Akun)
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-4 text-center text-sm font-bold transition-all border-b-2 ${
                activeTab === 'custom'
                  ? 'border-amber-600 text-stone-900 bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Masuk Manual (Kredensial Sendiri)
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'quick' ? (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">
                      Pilih Akun untuk Masuk ke Lingkup Kerjanya
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Setiap akun akan langsung masuk ke dasbor dan katalog terisolasi sesuai perannya.
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Scope-Based Access Control
                  </span>
                </div>

                {/* 5 Role Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map((user) => {
                    const meta = roleCardMeta[user.role];
                    return (
                      <div
                        key={user.id}
                        onClick={() => loginAsUser(user.id)}
                        className={`group relative bg-stone-50/70 hover:bg-white border-2 border-stone-200 ${meta.color} rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-stone-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                              {meta.icon}
                            </div>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.badgeColor}`}
                            >
                              {meta.tier}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                            {meta.title}
                          </h3>
                          <div className="text-xs font-semibold text-stone-700 mt-0.5">
                            {user.name}
                          </div>
                          <div className="text-[11px] text-stone-500 mb-3 truncate">
                            {user.organization}
                          </div>

                          <p className="text-xs text-stone-600 leading-relaxed mb-3">
                            {meta.duty}
                          </p>
                        </div>

                        <div>
                          <div className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200/60 rounded-lg p-2 mb-3">
                            <span className="font-semibold block">Marketplace:</span>
                            {meta.marketplaceAction}
                          </div>

                          <button className="w-full py-2 px-3 rounded-xl bg-stone-900 text-white group-hover:bg-amber-700 transition-colors text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs">
                            Masuk sebagai {meta.title.split(' ')[0]}
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <form onSubmit={handleCustomLogin} className="max-w-lg mx-auto space-y-5 py-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Pilih Peran Akun (Role Scope)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(Object.keys(roleCardMeta) as UserRole[]).map((roleKey) => (
                      <button
                        type="button"
                        key={roleKey}
                        onClick={() => setSelectedRole(roleKey)}
                        className={`p-3 rounded-xl text-left border text-xs font-bold transition-all flex flex-col gap-1 ${
                          selectedRole === roleKey
                            ? 'bg-amber-50 border-amber-600 text-stone-900 ring-2 ring-amber-500/20'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          {roleCardMeta[roleKey].icon}
                          {selectedRole === roleKey && (
                            <CheckCircle2 className="w-4 h-4 text-amber-600" />
                          )}
                        </div>
                        <span className="mt-1">{roleCardMeta[roleKey].title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Nama Pengguna / Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Contoh: Andi Wijaya"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Nama Usaha / Organisasi
                  </label>
                  <input
                    type="text"
                    required
                    value={customOrg}
                    onChange={(e) => setCustomOrg(e.target.value)}
                    placeholder="Contoh: Koperasi Tani Java / Roastery Kita"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-amber-700 text-white font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    Masuk ke Lingkup {roleCardMeta[selectedRole].title}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-stone-500 pb-2">
        <p>CCT Coffee Supply Chain System • Dedicated Role-Based Workspace Architecture</p>
      </footer>
    </div>
  );
};
