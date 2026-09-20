import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { UserRole } from '../types/coffee';
import { ROLE_DETAILS } from '../constants/roles';
import {
  X,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  User,
  Check,
} from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'roaster',
}) => {
  const { registerUser, loginAsRole } = useCoffee();
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const roleConfigs: Record<
    UserRole,
    {
      title: string;
      tier: string;
      desc: string;
      icon: React.ReactNode;
      color: string;
      bgBadge: string;
      defaultOrgExample: string;
      defaultLocExample: string;
    }
  > = {
    petani: {
      title: 'Petani Kopi (Farmer)',
      tier: 'Hulu: Kebun Kopi',
      desc: 'Catat hasil panen, varietas, brix ceri, ketinggian mdpl, dan jual langsung ke stasiun pengolah.',
      icon: <Sprout className="w-5 h-5 text-emerald-600" />,
      color: 'border-emerald-500 ring-emerald-500/20',
      bgBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      defaultOrgExample: 'e.g. Kelompok Tani Kopi Tilu Jaya',
      defaultLocExample: 'e.g. Pangalengan, Bandung (1.550 mdpl)',
    },
    pengolah: {
      title: 'Pengolah (Wet/Dry Mill)',
      tier: 'Pengolahan & Fermentasi',
      desc: 'Beli ceri petani, catat fermentasi (Washed, Natural, Anaerobic), uji defect & kelola limbah sirkular.',
      icon: <Cog className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-500 ring-amber-500/20',
      bgBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      defaultOrgExample: 'e.g. CV Malabar Mill & Solar Dome',
      defaultLocExample: 'e.g. Pangalengan, Jawa Barat',
    },
    gudang: {
      title: 'Gudang & Silo QA (Warehouse)',
      tier: 'Pergudangan & Grading SCA',
      desc: 'Manajemen silo GrainPro, kontrol suhu/kelembaban, sertifikasi skor SCA, dan supply ke roaster.',
      icon: <Warehouse className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-500 ring-blue-500/20',
      bgBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      defaultOrgExample: 'e.g. PT Nusantara Coffee Silo & QA',
      defaultLocExample: 'e.g. Gedebage, Kota Bandung',
    },
    roaster: {
      title: 'Artisan Roastery',
      tier: 'Penyangraian & Profiling',
      desc: 'Kelola kurva sangrai Agtron, sensoris spider radar, Work Orders, kemasan retail, dan formulasi AI.',
      icon: <Flame className="w-5 h-5 text-orange-600" />,
      color: 'border-orange-500 ring-orange-500/20',
      bgBadge: 'bg-orange-50 text-orange-700 border-orange-200',
      defaultOrgExample: 'e.g. Karsa Craft Roastery & Lab',
      defaultLocExample: 'e.g. Dago Atas, Bandung',
    },
    cafe: {
      title: 'Pemilik Cafe & Barista',
      tier: 'Hilir: Kedai & Konsumen',
      desc: 'Beli roasted bean berkualitas, cetak label barcode/QR jejak asal-usul untuk setiap cangkir konsumen.',
      icon: <Coffee className="w-5 h-5 text-amber-700" />,
      color: 'border-stone-700 ring-stone-700/20',
      bgBadge: 'bg-stone-100 text-stone-800 border-stone-300',
      defaultOrgExample: 'e.g. Seduh Teduh Specialty Coffee',
      defaultLocExample: 'e.g. Jl. Riau, Kota Bandung',
    },
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !org.trim()) {
      alert('Mohon isi nama lengkap dan nama usaha/organisasi Anda.');
      return;
    }

    if (registerUser) {
      registerUser({
        name: name.trim(),
        role: selectedRole,
        organization: org.trim(),
        location: location.trim() || roleConfigs[selectedRole].defaultLocExample.replace('e.g. ', ''),
        phone: phone.trim() || '0812-3456-7890',
        bio: bio.trim() || `Akun ${ROLE_DETAILS[selectedRole].label} baru terdaftar di platform CCT-Coffee.`,
      });
    } else {
      loginAsRole(selectedRole);
    }

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
    }, 1000);
  };

  const handleQuickDemo = (role: UserRole) => {
    loginAsRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Top Header Background */}
        <div className="bg-[#1C120C] text-stone-200 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-700 rounded-full transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Aktivasi Instan Ekosistem CCT-Coffee
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Registrasi & Akses Platform
          </h2>
          <p className="mt-1 text-sm text-stone-300">
            Bergabunglah dengan ekosistem rantai pasok kopi sirkular digital. Pilih peran bisnis Anda untuk membuka panel operasional terdedikasi.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-black text-stone-900">Registrasi Berhasil!</h3>
              <p className="text-sm text-stone-600 max-w-sm mx-auto">
                Akun bisnis Anda siap digunakan. Mengalihkan Anda langsung ke Panel Admin Operasional...
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5">
                  1. Pilih Peran Bisnis Anda dalam Rantai Pasok:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {(Object.keys(roleConfigs) as UserRole[]).map((roleKey) => {
                    const cfg = roleConfigs[roleKey];
                    const isSelected = selectedRole === roleKey;
                    return (
                      <button
                        type="button"
                        key={roleKey}
                        onClick={() => setSelectedRole(roleKey)}
                        className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between relative ${
                          isSelected
                            ? `${cfg.color} bg-amber-50/40 shadow-sm ring-2`
                            : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/80 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-2xs">
                            {cfg.icon}
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-black shadow-xs">
                              ✓
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-black text-stone-900 block leading-tight">
                            {cfg.title}
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium block mt-0.5 leading-snug">
                            {cfg.tier}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Role Description Banner */}
                <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-start gap-2.5 text-xs text-stone-600">
                  <div className="mt-0.5">{roleConfigs[selectedRole].icon}</div>
                  <p className="leading-relaxed">{roleConfigs[selectedRole].desc}</p>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-3.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  2. Informasi Profil & Usaha Kopi:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Nama Lengkap / Penanggung Jawab *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Raditya Pratama"
                        className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Nama Usaha / Kelompok / Entitas *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={org}
                        onChange={(e) => setOrg(e.target.value)}
                        placeholder={roleConfigs[selectedRole].defaultOrgExample}
                        className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Lokasi / Domisili Operasional
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder={roleConfigs[selectedRole].defaultLocExample}
                        className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Nomor WhatsApp / Kontak
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 0812-8899-0011"
                        className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Bio / Catatan Usaha (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Ceritakan fokus varietas kopi, kapasitas sangrai/panen, atau metode seduh spesifik usaha Anda..."
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickDemo(selectedRole)}
                  className="w-full sm:w-auto text-xs font-bold text-stone-600 hover:text-stone-900 py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Masuk Mode Demo Cepat
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Daftar & Buka Panel Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Badge */}
              <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-center gap-4 text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Keamanan Data Terenkripsi
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  100% Akses Simulator Komprehensif
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
