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
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col font-sans">
      {/* ============================================================== */}
      {/* 1. FULL-WIDTH TOP NAVIGATION BAR                               */}
      {/* ============================================================== */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-amber-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Beranda</span>
            </Link>

            <span className="h-4 w-px bg-stone-300 hidden sm:inline-block" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 border border-amber-400/40 flex items-center justify-center font-black">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-stone-900 tracking-tight hidden md:inline">
                CircularCoffee
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                Pendaftaran Akun
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-stone-500 hidden sm:inline">Sudah memiliki akun?</span>
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-amber-700 text-white font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Masuk ke Sistem</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. FULL-WIDTH HERO HEADER SECTION (EDGE-TO-EDGE)               */}
      {/* ============================================================== */}
      <section className="w-full bg-[#160F0B] text-white border-b border-stone-800 relative overflow-hidden py-10 sm:py-14">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Multi-Stakeholder Rantai Pasok Kopi Terintegrasi</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Pendaftaran Akun Ekosistem Kopi
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm lg:text-base leading-relaxed">
              Pilih peran Anda dalam rantai pasok kopi terintegrasi. Akses ruang kerja operasional terisolasi, pencatatan ketertelusuran farm-to-cup ber-QR, audit kepatuhan EUDR, dan pasar kopi specialty B2B.
            </p>

            {/* Trust Highlights */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-stone-200">
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-xs font-medium">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>9 Peran Rantai Pasok Terintegrasi</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Kepatuhan Regulasi EUDR &amp; ICS</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-xs font-medium">
                <Coffee className="w-4 h-4 text-orange-400" />
                <span>Paspor Digital QR Farm-to-Cup</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. FULL-WIDTH MAIN CONTENT AREA WITH 2-COLUMN ENTERPRISE GRID  */}
      {/* ============================================================== */}
      <main className="w-full bg-[#FAF7F2] py-8 sm:py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isSuccess && registeredData ? (
            /* Success State */
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-12 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 shadow-sm">
                <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Pendaftaran Berhasil
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Selamat Datang di CircularCoffee
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Akun Anda dengan peran{' '}
                  <strong className="text-stone-900">{roleConfigs[registeredData.role].title}</strong>{' '}
                  telah berhasil didaftarkan ke sistem.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2.5 text-xs">
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
                  <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    {roleConfigs[registeredData.role].title}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Masuk ke Akun Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/"
                  className="py-3.5 px-6 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold text-xs sm:text-sm transition-all block text-center"
                >
                  Ke Beranda
                </Link>
              </div>
            </div>
          ) : (
            /* Main Form View with 2-Column Responsive Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: REGISTRATION FORM (8 OF 12 COLS) */}
              <div className="lg:col-span-8 space-y-6">
                {errorMsg && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-rose-800 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                  {/* CARD 1: PILIH PERAN ORGANISASI */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 sm:p-8 space-y-5">
                    <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black shadow-2xs">
                          1
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-stone-900">
                            Pilih Peran Stakeholder Anda
                          </h2>
                          <p className="text-xs text-stone-500">
                            Pilih posisi peran operasional usaha Anda di dalam rantai pasok kopi terintegrasi.
                          </p>
                        </div>
                      </div>

                      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        {roleConfigs[selectedRole].title}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
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
                                ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-sm scale-101'
                                : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/70'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2.5">
                                <div className="p-2.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
                                  {cfg.icon}
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bgBadge}`}>
                                  {cfg.badgeText}
                                </span>
                              </div>
                              <h3 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                                {cfg.title}
                              </h3>
                              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed line-clamp-2">
                                {cfg.desc}
                              </p>
                            </div>

                            {isSelected && (
                              <div className="mt-3.5 pt-2 border-t border-amber-200 flex items-center gap-1.5 text-xs font-bold text-amber-800">
                                <Check className="w-3.5 h-3.5 text-amber-600" />
                                <span>Peran Terpilih</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Callout Info: Petani, Pengolah & ICS */}
                    <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
                      <Building2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-bold text-amber-950 block">
                          Informasi Struktur Keanggotaan Hulu:
                        </span>
                        <p className="text-xs text-amber-900 leading-relaxed">
                          Peran <strong>Petani Kopi</strong>, <strong>Stasiun Pengolah (Wet/Dry Mill)</strong>, dan <strong>Petugas Auditor ICS</strong> telah tercakup langsung (<em>included</em>) di bawah naungan <strong>Kelompok Tani / Koperasi</strong>. Penugasan akun anggota kebun dilakukan oleh pengurus melalui portal Kelompok Tani setelah terdaftar.
                        </p>
                      </div>
                    </div>

                    {/* Hook Khusus untuk Verifikator / Q-Grader */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs sm:text-sm text-white block">
                            Anda Seorang Verifikator Mutu atau Q-Grader Independen?
                          </span>
                          <p className="text-xs text-stone-300 leading-relaxed">
                            Pendaftaran Verifikator &amp; Auditor memerlukan formulir khusus pengisian nomor lisensi, instansi sertifikasi, dan lingkup audit kepatuhan EUDR / SCA.
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/register-verifikator"
                        className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shrink-0 transition-colors shadow-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Buka Form Verifikator</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Pemberitahuan khusus untuk petani dan pengolah binaan */}
                  {(selectedRole === 'petani' || selectedRole === 'pengolah') && (
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-3 animate-in fade-in">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs font-bold text-amber-950">Pemberitahuan Peran Binaan Kelompok Tani:</strong>
                          <p className="mt-0.5 text-stone-600 leading-relaxed">
                            Untuk <strong>Petani Kopi</strong> dan <strong>Stasiun Pengolah</strong>, operasional dan alokasi akun berada di bawah naungan <strong>Kelompok Tani / Gapoktan</strong> pembina.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-900 mb-1.5 uppercase tracking-wider">
                          Pilih Kelompok Tani / Gapoktan Penaung *
                        </label>
                        <select
                          value={selectedKelompokTaniId}
                          onChange={(e) => setSelectedKelompokTaniId(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
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

                  {/* CARD 2: INFORMASI AKUN & BISNIS */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 sm:p-8 space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black shadow-2xs">
                        2
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-stone-900">
                          Informasi Profil &amp; Usaha Kopi
                        </h2>
                        <p className="text-xs text-stone-500">
                          Data identitas penanggung jawab, nama usaha / organisasi, dan kontak resmi.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 pt-1">
                      {/* Nama Lengkap */}
                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
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
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
                          />
                        </div>
                      </div>

                      {/* Nama Usaha / Entitas */}
                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
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
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
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
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
                          />
                        </div>
                      </div>

                      {/* Nomor WhatsApp */}
                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                          Nomor WhatsApp / Kontak
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0812-3456-7890"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
                          />
                        </div>
                      </div>

                      {/* Lokasi */}
                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                          Lokasi / Domisili Operasional
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder={roleConfigs[selectedRole].defaultLocExample}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
                          />
                        </div>
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                          Profil Singkat / Spesialisasi
                        </label>
                        <input
                          type="text"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="e.g. Fokus pengolahan Arabika Washed &amp; Honey Micro-lot"
                          className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: KREDENSIAL KEAMANAN AKUN */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 sm:p-8 space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black shadow-2xs">
                        3
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-stone-900">
                          Kredensial Keamanan Akun
                        </h2>
                        <p className="text-xs text-stone-500">
                          Tentukan kata sandi yang kuat untuk melindungi akun kerja Anda.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 pt-1">
                      {/* Password */}
                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                          Kata Sandi *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimal 6 karakter"
                            className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Konfirmasi Password */}
                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                          Konfirmasi Kata Sandi *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Ulangi kata sandi akun"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FORM ACTION & SUBMIT BUTTON */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Data terenkripsi dan terintegrasi ke paspor ketertelusuran kopi.</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Link
                        to="/"
                        className="flex-1 sm:flex-none px-6 py-4 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-bold text-center transition-colors"
                      >
                        Batal
                      </Link>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none px-8 py-4 rounded-xl bg-stone-900 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
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
              </div>

              {/* RIGHT COLUMN: STICKY STAKEHOLDER BENEFIT & ECOSYSTEM RAIL (4 OF 12 COLS) */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                {/* Panel 1: Dynamic Role Benefit Card */}
                <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-200">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-amber-700 tracking-wider block">
                        Peran yang Anda Pilih:
                      </span>
                      <h3 className="text-sm font-bold text-stone-900 mt-0.5">
                        {roleConfigs[selectedRole].title}
                      </h3>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                      {roleConfigs[selectedRole].icon}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {roleConfigs[selectedRole].desc}
                  </p>

                  <div className="pt-2 border-t border-stone-100 space-y-2.5">
                    <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider block">
                      Fasilitas Kerja yang Didapat:
                    </span>
                    <ul className="space-y-2 text-xs text-stone-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Dasbor operasional real-time sesuai modul peran</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Paspor digital ketertelusuran kopi QR Farm-to-Cup</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Koneksi transaksi B2B terverifikasi ke seluruh stakeholder</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Panel 2: 4 Pilar Rantai Pasok */}
                <div className="bg-stone-100/90 rounded-2xl border border-stone-200 p-6 space-y-3.5 text-xs text-stone-600">
                  <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-stone-700" />
                    <span>Integritas Rantai Pasok</span>
                  </h3>
                  <div className="space-y-2">
                    <p>
                      CircularCoffee menghubungkan hulu kebun, pengolah, gudang, roastery, verifikator, hingga kafe konsumen secara transparan dan akuntabel.
                    </p>
                  </div>
                </div>

                {/* Panel 3: Kontak Bantuan */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 p-5 space-y-2 text-xs text-stone-700">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Butuh Konsultasi Organisasi?</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-600">
                    Bagi gabungan kelompok tani (Gapoktan) atau konsorsium ekspor yang memerlukan pendampingan integrasi data kebun, hubungi tim kami di <a href="mailto:support@circulartrace.id" className="font-bold text-amber-800 underline">support@circulartrace.id</a>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ============================================================== */}
      {/* 4. FULL-WIDTH ENTERPRISE FOOTER                                */}
      {/* ============================================================== */}
      <footer className="w-full bg-white border-t border-stone-200 py-8 px-4 sm:px-6 lg:px-8 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">CircularCoffee</span>
            <span>•</span>
            <span>Rantai Pasok Kopi Terintegrasi Farm-to-Cup</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Enkripsi TLS 1.3 Terverifikasi</span>
            <span>•</span>
            <span>Audit EUDR 2023/1115 &amp; SCA Specialty Grade</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
