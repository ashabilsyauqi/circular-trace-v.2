import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCoffee } from '../context/CoffeeContext';
import { UserRole } from '../types/coffee';
import { ROLE_DETAILS } from '../constants/roles';
import {
  Coffee,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  User,
  Check,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ChevronLeft,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerUser, users, currentUser } = useCoffee();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/admin/overview');
    }
  }, [currentUser, navigate]);

  const initialRoleParam = searchParams.get('role') as UserRole | null;
  const registerableRoles: Exclude<UserRole, 'super_admin' | 'verifikator'>[] = [
    'admin_kelompok_tani',
    'gudang',
    'roaster',
    'cafe',
  ];

  // Redirect verifikator to dedicated registration portal
  useEffect(() => {
    if (initialRoleParam === 'verifikator') {
      navigate('/register-verifikator', { replace: true });
    }
  }, [initialRoleParam, navigate]);

  const defaultRole: Exclude<UserRole, 'super_admin'> = (() => {
    if (!initialRoleParam) return 'admin_kelompok_tani';
    if (initialRoleParam === 'petani' || initialRoleParam === 'pengolah' || initialRoleParam === 'ict') {
      return 'admin_kelompok_tani';
    }
    if (registerableRoles.includes(initialRoleParam as any)) {
      return initialRoleParam as Exclude<UserRole, 'super_admin'>;
    }
    return 'admin_kelompok_tani';
  })();

  const availableKelompokTani = (users || [])
    .filter((u) => u.role === 'admin_kelompok_tani')
    .map((u) => ({
      id: u.id,
      name: u.kelompokTaniName || u.organization || u.name,
      location: u.location || 'Jawa Barat',
    }));

  const kelompokTaniList =
    availableKelompokTani.length > 0
      ? availableKelompokTani
      : [
          { id: 'user-admin-gapoktan', name: 'Gapoktan Kopi Mandiri Nusantara', location: 'Pangalengan, Jawa Barat' },
          { id: 'kt-02', name: 'Kelompok Tani Kopi Tilu Lestari', location: 'Bandung Selatan, Jawa Barat' },
          { id: 'kt-03', name: 'Koperasi Petani Malabar Preanger', location: 'Malabar, Jawa Barat' },
          { id: 'kt-04', name: 'Gapoktan Priangan Lestari', location: 'Garut, Jawa Barat' },
        ];

  const [selectedRole, setSelectedRole] = useState<Exclude<UserRole, 'super_admin'>>(defaultRole);
  const [selectedKelompokTaniId, setSelectedKelompokTaniId] = useState(kelompokTaniList[0]?.id || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [org, setOrg] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredData, setRegisteredData] = useState<{
    email: string;
    name: string;
    role: Exclude<UserRole, 'super_admin'>;
    verificationToken?: string;
    verificationLink?: string;
  } | null>(null);

  // Sync role from query param if changed
  useEffect(() => {
    if (initialRoleParam) {
      if (initialRoleParam === 'petani' || initialRoleParam === 'pengolah' || initialRoleParam === 'ict') {
        setSelectedRole('admin_kelompok_tani');
      } else if (registerableRoles.includes(initialRoleParam as any)) {
        setSelectedRole(initialRoleParam as Exclude<UserRole, 'super_admin'>);
      }
    }
  }, [initialRoleParam]);

  const roleConfigs: Record<
    Exclude<UserRole, 'super_admin'>,
    {
      title: string;
      tier: string;
      badgeText: string;
      desc: string;
      icon: React.ReactNode;
      color: string;
      bgBadge: string;
      defaultOrgExample: string;
      defaultLocExample: string;
    }
  > = {
    admin_kelompok_tani: {
      title: 'Kelompok Tani / Koperasi (Petani, Pengolah & ICS)',
      tier: 'Penaung Ekosistem Hulu Terpadu',
      badgeText: 'Penaung Ekosistem',
      desc: 'Menaungi kebun petani anggota, stasiun pengolah ceri (wet/dry mill), dan audit kepatuhan ICS internal.',
      icon: <Building2 className="w-5 h-5 text-amber-700" />,
      color: 'border-amber-500 ring-amber-500/20',
      bgBadge: 'bg-amber-50 text-amber-900 border-amber-300',
      defaultOrgExample: 'e.g. Gapoktan Kopi Mandiri Nusantara / Koperasi Petani',
      defaultLocExample: 'e.g. Pangalengan, Jawa Barat',
    },
    gudang: {
      title: 'Gudang & QA (Warehouse)',
      tier: 'Pergudangan & Grading SCA',
      badgeText: 'Pendaftaran Mandiri',
      desc: 'Manajemen gudang hermetik, kontrol suhu/RH, sertifikasi kadar air & mutu SCA, dan pasokan ke roaster.',
      icon: <Warehouse className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-500 ring-blue-500/20',
      bgBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      defaultOrgExample: 'e.g. PT Nusantara Coffee Warehouse & QA',
      defaultLocExample: 'e.g. Gedebage, Kota Bandung',
    },
    roaster: {
      title: 'Artisan Roastery',
      tier: 'Penyangraian & Profiling',
      badgeText: 'Pendaftaran Mandiri',
      desc: 'Kelola kurva sangrai Agtron, sensory spider chart SCA, perintah produksi, kemasan retail & formulasi profil.',
      icon: <Flame className="w-5 h-5 text-orange-600" />,
      color: 'border-orange-500 ring-orange-500/20',
      bgBadge: 'bg-orange-50 text-orange-700 border-orange-200',
      defaultOrgExample: 'e.g. Karsa Craft Roastery & Lab',
      defaultLocExample: 'e.g. Dago Atas, Bandung',
    },
    cafe: {
      title: 'Pemilik Cafe & Barista',
      tier: 'Hilir: Kedai & Konsumen',
      badgeText: 'Pendaftaran Mandiri',
      desc: 'Beli roasted bean specialty, cetak barcode jejak asal-usul (farm-to-cup) untuk setiap cangkir konsumen.',
      icon: <Coffee className="w-5 h-5 text-amber-700" />,
      color: 'border-stone-700 ring-stone-700/20',
      bgBadge: 'bg-stone-100 text-stone-800 border-stone-300',
      defaultOrgExample: 'e.g. Seduh Teduh Specialty Coffee',
      defaultLocExample: 'e.g. Jl. Riau, Kota Bandung',
    },
    verifikator: {
      title: 'Verifikator Mutu (Auditor)',
      tier: 'Dewan Audit & Q-Grader',
      badgeText: 'Pendaftaran Mandiri',
      desc: 'Audit kepatuhan EUDR, inspeksi mill pengolah, sertifikasi gudang, uji sensori cupping SCA, & terbitkan stempel resmi.',
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      color: 'border-purple-500 ring-purple-500/20',
      bgBadge: 'bg-purple-50 text-purple-700 border-purple-200',
      defaultOrgExample: 'e.g. Dewan Sertifikasi Kopi Specialty & Q-Grader Lab',
      defaultLocExample: 'e.g. Jakarta / Bandung',
    },
    petani: {
      title: 'Petani Kopi (Farmer)',
      tier: 'Hulu: Kebun Kopi',
      badgeText: 'Binaan Kelompok Tani',
      desc: 'Catat hasil panen, varietas, brix ceri, ketinggian mdpl, koordinat EUDR, & jual langsung ke stasiun pengolah.',
      icon: <Sprout className="w-5 h-5 text-emerald-600" />,
      color: 'border-emerald-500 ring-emerald-500/20',
      bgBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      defaultOrgExample: 'e.g. Kelompok Tani Kopi Tilu Jaya',
      defaultLocExample: 'e.g. Pangalengan, Bandung (1.550 mdpl)',
    },
    pengolah: {
      title: 'Pengolah (Wet/Dry Mill)',
      tier: 'Pengolahan & Fermentasi',
      badgeText: 'Binaan Kelompok Tani',
      desc: 'Beli ceri petani, catat fermentasi (Washed, Natural, Anaerobic), uji defect & kelola limbah sirkular.',
      icon: <Cog className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-500 ring-amber-500/20',
      bgBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      defaultOrgExample: 'e.g. CV Malabar Mill & Solar Dome',
      defaultLocExample: 'e.g. Pangalengan, Jawa Barat',
    },
    ict: {
      title: 'Petugas ICS (Internal Control System)',
      tier: 'Internal Kelompok Tani',
      badgeText: 'Internal Kelompok Tani',
      desc: 'Verifikasi NIK/KTA data petani, validasi koordinat GPS & patok poligon EUDR lahan kebun, serta inspeksi mutu brix panen ceri.',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-500 ring-blue-500/20',
      bgBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      defaultOrgExample: 'e.g. Tim ICS Gapoktan Kopi Mandiri',
      defaultLocExample: 'e.g. Pangalengan, Jawa Barat',
    },
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !org.trim()) {
      setErrorMsg('Mohon isi nama lengkap dan nama usaha/organisasi Anda.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg('Format alamat email tidak valid.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal harus 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    let ktName: string | undefined = undefined;
    if (selectedRole === 'petani' || selectedRole === 'pengolah') {
      const matchedKt = kelompokTaniList.find((k) => k.id === selectedKelompokTaniId);
      ktName = matchedKt ? matchedKt.name : kelompokTaniList[0]?.name;
    }

    setIsSubmitting(true);
    try {
      if (registerUser) {
        const result = await registerUser({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          role: selectedRole,
          organization: org.trim(),
          location: location.trim() || roleConfigs[selectedRole].defaultLocExample.replace('e.g. ', ''),
          phone: phone.trim() || '0812-3456-7890',
          bio: bio.trim() || `Akun ${ROLE_DETAILS[selectedRole].label} baru terdaftar di platform CircularCoffee.`,
          kelompokTaniId: (selectedRole === 'petani' || selectedRole === 'pengolah') ? selectedKelompokTaniId : undefined,
          kelompokTaniName: ktName,
        });

        setRegisteredData({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          role: selectedRole,
          verificationToken: result?.verificationToken,
          verificationLink: result?.verificationLink,
        });
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal melakukan pendaftaran akun.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-stone-600">
            <span>Sudah memiliki akun?</span>
            <Link
              to="/login"
              className="font-bold text-amber-700 hover:text-amber-800 hover:underline"
            >
              Masuk ke Sistem
            </Link>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#1C120C] text-white p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 block">
                    CircularCoffee Registration
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Pendaftaran Akun Ekosistem Kopi
                  </h1>
                </div>
              </div>
              <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Pilih peran Anda dalam rantai pasok kopi terintegrasi. Akses dasbor operasional, pencatatan ketertelusuran farm-to-cup ber-QR, dan pasar kopi B2B.
              </p>
            </div>
          </div>

          {/* Form Content / Success View */}
          <div className="p-6 sm:p-10">
            {isSuccess && registeredData ? (
              <div className="py-8 text-center space-y-6 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                    Pendaftaran Berhasil!
                  </span>
                  <h2 className="text-2xl font-black text-stone-900">
                    Selamat Datang di CircularCoffee
                  </h2>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Akun Anda dengan peran{' '}
                    <strong className="text-stone-900">{roleConfigs[registeredData.role].title}</strong>{' '}
                    telah berhasil didaftarkan ke sistem.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="text-stone-500">Nama Pengguna:</span>
                    <span className="font-bold text-stone-900">{registeredData.name}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="text-stone-500">Alamat Email:</span>
                    <span className="font-bold text-stone-900 font-mono">{registeredData.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Peran Sistem:</span>
                    <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {roleConfigs[registeredData.role].title}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Masuk ke Akun Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link
                    to="/"
                    className="py-3.5 px-6 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold text-sm transition-all"
                  >
                    Ke Beranda
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-8">
                {/* 1. Pilih Peran Organisasi */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-black">
                        1
                      </span>
                      <span>Pilih Peran Stakeholder Anda di Rantai Pasok:</span>
                    </label>
                    <span className="text-[11px] text-stone-500">
                      Aktif: <strong className="text-amber-800">{roleConfigs[selectedRole].title}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {registerableRoles.map((r) => {
                      const cfg = roleConfigs[r];
                      const isSelected = selectedRole === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setSelectedRole(r);
                            setErrorMsg(null);
                          }}
                          className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-md scale-101'
                              : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="p-2 rounded-xl bg-white border border-stone-200 shadow-2xs">
                                {cfg.icon}
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bgBadge}`}>
                                {cfg.badgeText}
                              </span>
                            </div>
                            <h3 className="font-black text-xs text-stone-900 leading-tight">
                              {cfg.title}
                            </h3>
                            <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                              {cfg.desc}
                            </p>
                          </div>

                          {isSelected && (
                            <div className="mt-3 pt-2 border-t border-amber-200/80 flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                              <Check className="w-3.5 h-3.5 text-amber-600" />
                              <span>Peran Terpilih</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Callout Info: Petani, Pengolah & ICS sudah included dalam Kelompok Tani */}
                  <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
                    <Building2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-amber-950 block">
                        Informasi Struktur Keanggotaan Hulu:
                      </span>
                      <p className="text-[11px] text-amber-900 leading-relaxed">
                        Peran <strong>Petani Kopi</strong>, <strong>Stasiun Pengolah (Wet/Dry Mill)</strong>, dan <strong>Petugas Auditor ICS</strong> telah tercakup langsung (<em>included</em>) di bawah manajemen <strong>Kelompok Tani / Koperasi</strong>. Penugasan akun anggota dilakukan oleh pengurus melalui portal Kelompok Tani setelah terdaftar.
                      </p>
                    </div>
                  </div>

                  {/* Hook Khusus untuk Verifikator / Q-Grader */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/60 to-purple-50/80 border border-purple-200 text-xs text-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-black text-purple-950 block">
                          Anda Seorang Verifikator Mutu atau Q-Grader Independen?
                        </span>
                        <p className="text-[11px] text-purple-800 leading-relaxed">
                          Pendaftaran Verifikator &amp; Auditor memerlukan formulir khusus pengisian nomor lisensi, instansi sertifikasi, dan lingkup audit kepatuhan EUDR / SCA.
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/register-verifikator"
                      className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs shrink-0 transition-colors shadow-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Buka Form Verifikator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Pemberitahuan khusus untuk petani dan pengolah binaan */}
                {(selectedRole === 'petani' || selectedRole === 'pengolah') && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-3 animate-in fade-in">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Pemberitahuan Peran Binaan Kelompok Tani:</strong>
                        <p className="mt-0.5 text-stone-600">
                          Untuk <strong>Petani Kopi</strong> dan <strong>Stasiun Pengolah</strong>, operasional dan alokasi akun berada di bawah naungan <strong>Kelompok Tani / Gapoktan</strong> pembina.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        Pilih Kelompok Tani / Gapoktan Penaung *
                      </label>
                      <select
                        value={selectedKelompokTaniId}
                        onChange={(e) => setSelectedKelompokTaniId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-xs text-stone-900 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                      >
                        {kelompokTaniList.map((kt) => (
                          <option key={kt.id} value={kt.id}>
                            {kt.name} — {kt.location}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* 2. Informasi Akun & Bisnis */}
                <div className="space-y-4 pt-2 border-t border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-black">
                      2
                    </span>
                    <label className="text-xs font-black uppercase tracking-wider text-stone-800">
                      Informasi Profil &amp; Usaha Kopi:
                    </label>
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nama Lengkap */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Nama Lengkap / Penanggung Jawab *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Raditya Pratama"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Nama Usaha / Entitas */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Nama Usaha / Kelompok / Entitas *
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={org}
                          onChange={(e) => setOrg(e.target.value)}
                          placeholder={roleConfigs[selectedRole].defaultOrgExample}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Alamat Email Akun *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nama@organisasi.id"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Nomor WhatsApp */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Nomor WhatsApp / Kontak
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0812-3456-7890"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Kata Sandi *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimal 6 karakter"
                          className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Konfirmasi Password */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Konfirmasi Kata Sandi *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Lokasi */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Lokasi / Domisili Operasional
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder={roleConfigs[selectedRole].defaultLocExample}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Profil Singkat / Spesialisasi
                      </label>
                      <input
                        type="text"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="e.g. Fokus pengolahan Arabika Washed & Honey Micro-lot"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Data terenkripsi dan terhubung ke paspor ketertelusuran kopi.</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link
                      to="/"
                      className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs font-bold text-center"
                    >
                      Batal
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none px-7 py-3 rounded-xl bg-stone-900 hover:bg-amber-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mendaftarkan Akun...</span>
                        </>
                      ) : (
                        <>
                          <span>Daftar Akun Baru Sekarang</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
