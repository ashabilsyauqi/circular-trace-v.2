import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
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
  const navigate = useNavigate();
  const { registerUser, users } = useCoffee();
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

  const registerableRoles: UserRole[] = [
    'admin_kelompok_tani',
    'gudang',
    'roaster',
    'cafe',
    'verifikator',
  ];

  const resolvedInitialRole: UserRole = (() => {
    if (initialRole === 'petani' || initialRole === 'pengolah' || initialRole === 'ict') {
      return 'admin_kelompok_tani';
    }
    if (registerableRoles.includes(initialRole)) {
      return initialRole;
    }
    return 'admin_kelompok_tani';
  })();

  const [selectedRole, setSelectedRole] = useState<UserRole>(resolvedInitialRole);
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
    role: UserRole;
    verificationToken?: string;
    verificationLink?: string;
  } | null>(null);

  const handleClose = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setErrorMsg(null);
    setOrg('');
    setLocation('');
    setPhone('');
    setBio('');
    setSelectedKelompokTaniId(kelompokTaniList[0]?.id || '');
    setIsSuccess(false);
    setIsSubmitting(false);
    setRegisteredData(null);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const roleConfigs: Record<
    UserRole,
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
      desc: 'Manajemen gudang GrainPro, kontrol suhu/kelembaban, sertifikasi skor SCA, dan supply ke roaster.',
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
      badgeText: 'Pendaftaran Mandiri',
      desc: 'Beli roasted bean berkualitas, cetak label barcode/QR jejak asal-usul untuk setiap cangkir konsumen.',
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
      desc: 'Audit kepatuhan EUDR, inspeksi stasiun pengolah, sertifikasi gudang, uji sensori cupping SCA, dan terbitkan stempel resmi.',
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
      desc: 'Verifikasi NIK/KTA data petani, validasi koordinat GPS & patok batas poligon EUDR lahan kebun, serta inspeksi mutu brix panen ceri.',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-500 ring-blue-500/20',
      bgBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      defaultOrgExample: 'e.g. Tim ICS Gapoktan Kopi Mandiri',
      defaultLocExample: 'e.g. Pangalengan, Jawa Barat',
    },
    super_admin: {
      title: 'Super Admin CircularTrace',
      tier: 'Platform Owner',
      badgeText: 'Platform Owner',
      desc: 'Pusat operasional manajemen paket komersial, tarif layanan, dan lisensi ekosistem.',
      icon: <Building2 className="w-5 h-5 text-purple-700" />,
      color: 'border-purple-500 ring-purple-500/20',
      bgBadge: 'bg-purple-50 text-purple-900 border-purple-300',
      defaultOrgExample: 'e.g. PT Circular Trace Global',
      defaultLocExample: 'e.g. Bandung HQ',
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
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal melakukan pendaftaran akun.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Top Header Background */}
        <div className="bg-[#1C120C] text-stone-200 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-700 rounded-full transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Aktivasi Instan Ekosistem CircularCoffee
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Registrasi &amp; Akses Platform
          </h2>
          <p className="mt-1 text-sm text-stone-300">
            Bergabunglah dengan ekosistem rantai pasok kopi sirkular digital. Pilih peran bisnis Anda untuk membuka panel operasional terdedikasi.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="py-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 shadow-sm">
                <Mail className="w-10 h-10 stroke-[2.2]" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Pendaftaran Berhasil Dikirim
                </span>
                <h3 className="text-2xl font-black text-stone-900 tracking-tight">
                  Periksa Kotak Masuk Email Anda!
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  Kami telah mengirimkan email berisi tautan verifikasi akun resmi ke:
                </p>
                <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200 px-4 py-2 rounded-xl text-xs font-bold text-stone-900 shadow-2xs">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span>{registeredData?.email || email}</span>
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-600 max-w-lg mx-auto text-left space-y-2.5 leading-relaxed">
                <p>
                  Silakan buka email Anda dan klik tombol <strong>Verifikasi Akun</strong> untuk mengaktifkan akun dan langsung masuk ke dashboard operasional secara realtime.
                </p>
                <div className="text-[11px] text-stone-500 bg-white p-3 rounded-xl border border-stone-200 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Tautan aktivasi berlaku selama <strong>24 jam</strong>. Jika email belum muncul di kotak masuk utama dalam 1-2 menit, mohon periksa folder <strong>Spam</strong> atau <strong>Promosi</strong>.
                  </span>
                </div>
              </div>

              {/* Dev Simulation Shortcut */}
              {(registeredData?.verificationToken || registeredData?.verificationLink) && (
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 rounded-2xl text-left max-w-lg mx-auto space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Mode Pengujian Dev (Instan Bypass):
                    </span>
                    <span className="text-[10px] font-bold bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-md">
                      Simulasi Lokal
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Untuk kemudahan pengujian tanpa membuka inbox email fisik, Anda dapat mengklik tombol di bawah untuk langsung mengaktifkan akun dan auto-login:
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const tokenToUse = registeredData.verificationToken;
                      handleClose();
                      navigate(`/verify-email?token=${tokenToUse}`);
                    }}
                    className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Aktifkan Akun &amp; Buka Dashboard Sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2 max-w-lg mx-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Tutup Modal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    navigate('/login');
                  }}
                  className="py-2.5 px-3 bg-stone-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Ke Halaman Login
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5">
                  1. Pilih Peran Bisnis Anda dalam Rantai Pasok:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {registerableRoles.map((roleKey) => {
                    const cfg = roleConfigs[roleKey];
                    const isSelected = selectedRole === roleKey;
                    return (
                      <button
                        type="button"
                        key={roleKey}
                        onClick={() => setSelectedRole(roleKey)}
                        className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between relative cursor-pointer ${
                          isSelected
                            ? `${cfg.color} bg-amber-50/40 shadow-sm ring-2`
                            : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/80 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-2xs">
                            {cfg.icon}
                          </div>
                          <div className="flex items-center gap-1">
                            {cfg.badgeText && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                                cfg.badgeText.includes('Penaung')
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-stone-100 text-stone-600 border border-stone-200'
                              }`}>
                                {cfg.badgeText}
                              </span>
                            )}
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-black shadow-xs">
                                ✓
                              </span>
                            )}
                          </div>
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

                {/* Info Callout for Roles Under Kelompok Tani */}
                <div className="mt-2.5 p-3 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-950 leading-relaxed shadow-2xs">
                  <Building2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-950 font-bold mb-0.5">Informasi Struktur Keanggotaan Hulu:</strong>
                    <span>
                      Peran <strong>Petani Kopi</strong>, <strong>Stasiun Pengolah (Wet/Dry Mill)</strong>, dan <strong>Petugas Auditor ICS</strong> telah tercakup langsung (<em>included</em>) di dalam akun <strong>Kelompok Tani / Koperasi</strong>. Pendaftaran dan penugasan akun anggota dikelola langsung oleh pengurus melalui portal Kelompok Tani setelah terdaftar.
                    </span>
                  </div>
                </div>

                {/* Selected Role Description Banner */}
                <div className="mt-2.5 p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-start gap-2.5 text-xs text-stone-600">
                  <div className="mt-0.5">{roleConfigs[selectedRole].icon}</div>
                  <p className="leading-relaxed">{roleConfigs[selectedRole].desc}</p>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-3.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  2. Informasi Profil &amp; Usaha Kopi:
                </label>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {(selectedRole === 'petani' || selectedRole === 'pengolah') && (
                    <div className="sm:col-span-2 bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-amber-700" />
                          Pilih Kelompok Tani / Gapoktan Penaung *
                        </label>
                        <span className="text-[10px] font-bold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-md">
                          Wajib untuk {selectedRole === 'petani' ? 'Petani' : 'Pengolah'}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Akun Anda akan diverifikasi oleh Pengurus / Ketua Kelompok Tani yang Anda pilih agar hasil {selectedRole === 'petani' ? 'panen' : 'pengolahan'} dan sertifikasi Anda tercatat resmi dalam rantai pasok.
                      </p>
                      <select
                        value={selectedKelompokTaniId}
                        onChange={(e) => {
                          setSelectedKelompokTaniId(e.target.value);
                          const kt = kelompokTaniList.find((k) => k.id === e.target.value);
                          if (kt && (!org || kelompokTaniList.some((item) => item.name === org))) {
                            setOrg(kt.name);
                          }
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
                      >
                        {kelompokTaniList.map((kt) => (
                          <option key={kt.id} value={kt.id}>
                            {kt.name} — {kt.location}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

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
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errorMsg) setErrorMsg(null);
                        }}
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
                        onChange={(e) => {
                          setOrg(e.target.value);
                          if (errorMsg) setErrorMsg(null);
                        }}
                        placeholder={roleConfigs[selectedRole].defaultOrgExample}
                        className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Alamat Email Akun *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMsg) setErrorMsg(null);
                        }}
                        placeholder="e.g. raditya@perusahaan.com"
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

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Kata Sandi *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errorMsg) setErrorMsg(null);
                        }}
                        placeholder="Minimal 6 karakter"
                        className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                        title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Konfirmasi Kata Sandi *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errorMsg) setErrorMsg(null);
                        }}
                        placeholder="Ulangi kata sandi"
                        className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
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
              <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                      <span>Mendaftarkan Akun...</span>
                    </>
                  ) : (
                    <>
                      <span>Daftar Akun Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
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
