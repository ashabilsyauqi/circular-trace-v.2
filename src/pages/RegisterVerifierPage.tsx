import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCoffee } from '../context/CoffeeContext';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Award,
  FileCheck,
  Scale,
  MapPin,
  Phone,
  User,
  Building,
  ExternalLink,
} from 'lucide-react';

export const RegisterVerifierPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser, currentUser } = useCoffee();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'verifikator') {
        navigate('/admin/verifikator');
      } else {
        navigate('/admin/overview');
      }
    }
  }, [currentUser, navigate]);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState('2 - 5 Tahun');
  const [coverageArea, setCoverageArea] = useState('Jawa Barat & Banten');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([
    'eudr',
    'greenbean',
    'cupping',
  ]);
  const [integrityPledge, setIntegrityPledge] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredData, setRegisteredData] = useState<{
    email: string;
    name: string;
    verificationToken?: string;
    verificationLink?: string;
  } | null>(null);

  const availableSpecializations = [
    {
      id: 'eudr',
      label: 'Audit Kepatuhan EUDR 2023/1115 (Deforestation-Free & GPS Poligon Lahan)',
      desc: 'Verifikasi batas petak kebun, bebas deforestasi pasca 2020, dan legalitas izin lahan BPN.',
    },
    {
      id: 'mill',
      label: 'Inspeksi Standarisasi Stasiun Pengolah (Wet & Dry Mill Fermentation)',
      desc: 'Pemeriksaan sanitasi tangki, pH fermentasi, dan kendali mutu 7 metode olah sirkular.',
    },
    {
      id: 'greenbean',
      label: 'Analisis Fisik Mutu Green Bean (Kadar Air, Aw & Triase Defect SNI/SCA)',
      desc: 'Pengukuran moisture meter (10-12%), water activity Aw, dan klasifikasi defect primer/sekunder.',
    },
    {
      id: 'cupping',
      label: 'Evaluasi Sensori SCA Cupping 10-Atribut (Specialty Coffee Q-Grading)',
      desc: 'Penilaian skor specialty (80+), radar spider chart aroma/flavor, dan rilis uji cita rasa.',
    },
    {
      id: 'storage',
      label: 'Standarisasi Gudang Hermetik & Sertifikasi Karantina Tumbuhan (KT-9)',
      desc: 'Audit klimatisasi ruang simpan hermetik GrainPro, kelembaban RH, dan dokumen ekspor.',
    },
  ];

  const toggleSpecialization = (id: string) => {
    setSpecializations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Mohon isi nama lengkap beserta gelar / akreditasi Anda.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg('Format alamat email resmi tidak valid.');
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

    if (!organization.trim()) {
      setErrorMsg('Mohon cantumkan nama instansi / lembaga sertifikasi atau lab Anda.');
      return;
    }

    if (!licenseNumber.trim()) {
      setErrorMsg('Mohon cantumkan nomor lisensi / registrasi auditor / sertifikat Q-Grader Anda.');
      return;
    }

    if (specializations.length === 0) {
      setErrorMsg('Pilih minimal 1 bidang spesialisasi verifikasi mutu.');
      return;
    }

    if (!integrityPledge) {
      setErrorMsg('Anda wajib menyetujui Pakta Integritas Independensi Auditor untuk melanjutkan.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (registerUser) {
        const specSummary = specializations
          .map((id) => availableSpecializations.find((s) => s.id === id)?.label.split('(')[0].trim())
          .filter(Boolean)
          .join(', ');

        const bioContent = `Verifikator Mutu Terakreditasi • Lisensi: ${licenseNumber.trim()} • Lembaga: ${organization.trim()} • Wilayah: ${coverageArea} • Spesialisasi: ${specSummary}`;

        const result = await registerUser({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          role: 'verifikator',
          organization: organization.trim(),
          location: coverageArea,
          phone: phone.trim() || '0812-9988-7766',
          bio: bioContent,
        });

        setRegisteredData({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          verificationToken: result?.verificationToken,
          verificationLink: result?.verificationLink,
        });
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal melakukan pendaftaran akun verifikator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Navigation */}
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
              className="font-bold text-purple-700 hover:text-purple-800 hover:underline"
            >
              Masuk Portal Verifikator
            </Link>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-[#120824] via-[#1a0e33] to-[#25124a] text-white p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Dewan Auditor &amp; Verifikasi Mutu Kopi Specialty</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Pendaftaran Verifikator &amp; Auditor Independen
              </h1>

              <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Bergabunglah sebagai dewan penilai independen dalam ekosistem Circular Coffee Trace.
                Miliki otoritas audit kepatuhan EUDR, akreditasi wet mill, dan penerbitan stempel sensori cupping SCA resmi.
              </p>

              {/* Key Highlights */}
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-purple-200">
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Q-Grader &amp; SCA Standard
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Audit EUDR 2023/1115
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <Scale className="w-3.5 h-3.5 text-blue-400" />
                  Stempel Verifikasi Digital Resmi
                </span>
              </div>
            </div>
          </div>

          {/* Form Content / Success View */}
          <div className="p-6 sm:p-10">
            {isSuccess && registeredData ? (
              <div className="py-8 text-center space-y-6 max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-200">
                <div className="w-20 h-20 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-purple-50 shadow-sm">
                  <Mail className="w-10 h-10 stroke-[2.2]" />
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-purple-800 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    Pendaftaran Auditor Berhasil
                  </span>
                  <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                    Periksa Email Verifikasi Anda
                  </h2>
                  <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                    Kami telah mengirimkan tautan aktivasi akun resmi ke alamat email verifikator:
                  </p>
                  <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200 px-4 py-2 rounded-xl text-xs font-bold text-stone-900 shadow-2xs">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span>{registeredData.email}</span>
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-600 text-left space-y-2.5 leading-relaxed">
                  <p>
                    Silakan klik tombol <strong>Verifikasi Akun</strong> pada email Anda untuk mengaktifkan kredensial auditor Anda dan langsung mengakses <strong>Lembar Kerja Verifikasi Mutu</strong> secara realtime.
                  </p>
                  <div className="text-[11px] text-stone-500 bg-white p-3 rounded-xl border border-stone-200 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>
                      Tautan berlaku 24 jam. Periksa juga folder <strong>Spam</strong> atau <strong>Promosi</strong> jika email belum sampai dalam 1-2 menit.
                    </span>
                  </div>
                </div>

                {/* Dev Simulation Shortcut */}
                {(registeredData.verificationToken || registeredData.verificationLink) && (
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50/60 border border-purple-200 rounded-2xl text-left space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        Mode Pengujian Dev (Instan Bypass):
                      </span>
                      <span className="text-[10px] font-bold bg-purple-200 text-purple-950 px-2 py-0.5 rounded-md">
                        Simulasi Lokal
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-800 leading-relaxed">
                      Untuk kemudahan pengujian tanpa membuka email fisik, klik tombol di bawah untuk langsung memverifikasi akun dan membuka portal verifikator:
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/verify-email?token=${registeredData.verificationToken}`);
                      }}
                      className="w-full py-2.5 px-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <span>Aktifkan Akun &amp; Buka Lembar Verifikasi Sekarang</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/"
                    className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition-colors block text-center"
                  >
                    Ke Beranda
                  </Link>
                  <Link
                    to="/login"
                    className="py-3 px-4 bg-stone-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-colors block text-center"
                  >
                    Masuk ke Sistem
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-8">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-red-700 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* 1. Identitas Personal & Akun Auditor */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <h3 className="text-sm font-bold text-stone-900">
                      Identitas Auditor &amp; Kredensial Login
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Nama Lengkap &amp; Gelar / Akreditasi *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Hendra Gunawan, S.P., Q-Grader"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                        />
                      </div>
                      <span className="text-[10px] text-stone-500 mt-1 block">
                        Nama ini akan tercantum resmi pada sertifikat audit dan stempel digital lot kopi.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Alamat Email Resmi *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="auditor@scai.org / hendra@lab.id"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Nomor Telepon / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 0812-3456-7890"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Kata Sandi Akun *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimal 6 karakter"
                          className="w-full pl-10 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Konfirmasi Kata Sandi *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Lembaga & Kredensial Lisensi */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <h3 className="text-sm font-bold text-stone-900">
                      Kredensial Lisensi &amp; Lembaga Sertifikasi
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Instansi / Lembaga Sertifikasi / Lab Penguji *
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="text"
                          required
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="e.g. CQI / Specialty Coffee Association / Lab Mutu"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Nomor Lisensi Q-Grader / Registrasi Auditor *
                      </label>
                      <div className="relative">
                        <Award className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="text"
                          required
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          placeholder="e.g. CQI-QG-2024-8841 / SNI-AUD-092"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Pengalaman Bidang Audit &amp; Cupping
                      </label>
                      <select
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs cursor-pointer font-medium"
                      >
                        <option value="< 2 Tahun">&lt; 2 Tahun Pengalaman</option>
                        <option value="2 - 5 Tahun">2 - 5 Tahun Pengalaman</option>
                        <option value="5 - 10 Tahun">5 - 10 Tahun Pengalaman</option>
                        <option value="> 10 Tahun / Senior Lead Auditor">&gt; 10 Tahun / Senior Lead Auditor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Wilayah Jangkauan Audit Utama
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <select
                          value={coverageArea}
                          onChange={(e) => setCoverageArea(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs cursor-pointer font-medium"
                        >
                          <option value="Nasional (Seluruh Indonesia)">Nasional (Seluruh Indonesia)</option>
                          <option value="Jawa Barat & Banten">Jawa Barat &amp; Banten (Preanger / Puntang / Malabar)</option>
                          <option value="Jawa Tengah & Jawa Timur">Jawa Tengah &amp; Jawa Timur (Ijen / Merapi / Temanggung)</option>
                          <option value="Sumatera & Aceh">Sumatera &amp; Aceh (Gayo / Mandheling / Kerinci)</option>
                          <option value="Sulawesi">Sulawesi (Toraja / Enrekang / Mamasa)</option>
                          <option value="Bali & Nusa Tenggara">Bali &amp; Nusa Tenggara (Kintamani / Bajawa Flores)</option>
                          <option value="Papua">Papua (Wamena / Moanemani)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Bidang Spesialisasi & Otoritas */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">
                        Bidang Spesialisasi &amp; Lingkup Audit
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Pilih lingkup tugas pengujian mutu yang dapat Anda verifikasi:
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {availableSpecializations.map((spec) => {
                      const isChecked = specializations.includes(spec.id);
                      return (
                        <label
                          key={spec.id}
                          className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer ${
                            isChecked
                              ? 'border-purple-500 bg-purple-50/50 shadow-2xs'
                              : 'border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSpecialization(spec.id)}
                            className="mt-1 w-4 h-4 text-purple-600 rounded border-stone-300 focus:ring-purple-500"
                          />
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-stone-900 block">
                              {spec.label}
                            </span>
                            <span className="text-[11px] text-stone-500 block leading-snug">
                              {spec.desc}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Berkas Portofolio & Pakta Integritas */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <h3 className="text-sm font-bold text-stone-900">
                      Tautan Portofolio &amp; Pakta Integritas
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Tautan Berkas Sertifikat / Lisensi Auditor (Google Drive / Cloud URL)
                    </label>
                    <div className="relative">
                      <ExternalLink className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://drive.google.com/... (Sertifikat Q-Grader / SK Auditor)"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                      />
                    </div>
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      Opsional: Menyertakan tautan lisensi mempercepat penugasan audit komersial dari mitra ekspor.
                    </span>
                  </div>

                  {/* Pakta Integritas Independensi */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/50 to-stone-50 border border-purple-200 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <Scale className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-xs font-black text-purple-950 block">
                          Pakta Integritas &amp; Independensi Auditor
                        </strong>
                        <p className="text-[11px] text-purple-900/90 mt-1 leading-relaxed">
                          Seluruh data verifikasi, koordinat patok EUDR, parameter moisture content, dan skor cupping SCA yang Anda input akan menjadi basis paspor digital komoditas kopi dan dapat diaudit oleh pembeli ekspor internasional.
                        </p>
                      </div>
                    </div>

                    <label className="flex items-start gap-2.5 pt-2 border-t border-purple-200/70 cursor-pointer text-xs font-semibold text-stone-800">
                      <input
                        type="checkbox"
                        required
                        checked={integrityPledge}
                        onChange={(e) => setIntegrityPledge(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-purple-600 rounded border-stone-300 focus:ring-purple-500"
                      />
                      <span className="leading-snug">
                        Saya menyatakan bahwa seluruh proses verifikasi, inspeksi mutu, dan penilaian cupping akan dilaksanakan secara <strong>objektif, independen, transparan, dan bebas dari benturan kepentingan</strong> (*conflict of interest*). *
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Link
                    to="/register"
                    className="text-xs font-bold text-stone-500 hover:text-stone-800"
                  >
                    &larr; Bukan Verifikator? Daftar Peran Rantai Pasok Umum
                  </Link>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-xs sm:text-sm shadow-xl shadow-purple-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mendaftarkan Kredensial...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim Pendaftaran Verifikator Resmi</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterVerifierPage;
