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
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-stone-900 tracking-tight hidden md:inline">
                CircularCoffee
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                Auditor Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-stone-500 hidden sm:inline">Sudah memiliki akun?</span>
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-amber-700 text-white font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Masuk Portal</span>
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
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Dewan Auditor &amp; Verifikasi Mutu Kopi Specialty</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Pendaftaran Verifikator &amp; Auditor Independen
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm lg:text-base leading-relaxed">
              Bergabunglah sebagai dewan penilai independen dalam ekosistem Circular Coffee Trace.
              Miliki otoritas audit kepatuhan EUDR, akreditasi stasiun mill, evaluasi green bean, dan penerbitan stempel sensori cupping SCA resmi.
            </p>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-stone-200">
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-xs font-medium">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Q-Grader &amp; SCA Standard</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-xs font-medium">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Audit Regulasi EUDR 2023/1115</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-xs font-medium">
                <Scale className="w-4 h-4 text-blue-400" />
                <span>Stempel Verifikasi Paspor Kopi Digital</span>
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
              <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50 shadow-sm">
                <Mail className="w-10 h-10 stroke-[2.2]" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Pendaftaran Auditor Berhasil
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Periksa Email Verifikasi Anda
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Kami telah mengirimkan tautan aktivasi akun resmi ke alamat email verifikator:
                </p>
                <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-900 shadow-2xs">
                  <Mail className="w-4 h-4 text-amber-700" />
                  <span>{registeredData.email}</span>
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-xs text-stone-600 text-left space-y-2.5 leading-relaxed">
                <p>
                  Silakan klik tombol <strong>Verifikasi Akun</strong> pada email Anda untuk mengaktifkan kredensial auditor Anda dan langsung mengakses <strong>Lembar Kerja Verifikasi Mutu</strong> secara realtime.
                </p>
                <div className="text-[11px] text-stone-500 bg-white p-3 rounded-xl border border-stone-200 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    Tautan berlaku 24 jam. Periksa juga folder <strong>Spam</strong> atau <strong>Promosi</strong> jika email belum sampai dalam 1-2 menit.
                  </span>
                </div>
              </div>

              {/* Dev Simulation Shortcut */}
              {(registeredData.verificationToken || registeredData.verificationLink) && (
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl text-left space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                      Mode Pengujian Dev (Instan Bypass):
                    </span>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md">
                      Simulasi Lokal
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Untuk kemudahan pengujian tanpa membuka email fisik, klik tombol di bawah untuk langsung memverifikasi akun dan membuka portal verifikator:
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/verify-email?token=${registeredData.verificationToken}`);
                    }}
                    className="w-full py-2.5 px-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
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
                  className="py-3 px-4 bg-stone-900 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors block text-center"
                >
                  Masuk ke Sistem
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
                  {/* CARD 1: IDENTITAS AUDITOR & KREDENSIAL LOGIN */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 sm:p-8 space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black shadow-2xs">
                        1
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-stone-900">
                          Identitas Auditor &amp; Kredensial Login
                        </h2>
                        <p className="text-xs text-stone-500">
                          Informasi data pribadi dan akses login resmi akun verifikator Anda.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 pt-1">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
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
                            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
                          />
                        </div>
                        <span className="text-[11px] text-stone-500 mt-1 block">
                          Nama ini akan tercantum secara resmi pada sertifikat audit dan stempel digital lot kopi.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
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
                            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
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
                            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
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
                            className="w-full pl-10 pr-11 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
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

                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
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
                            placeholder="Ulangi kata sandi akun"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: KREDENSIAL LISENSI & LEMBAGA SERTIFIKASI */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 sm:p-8 space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black shadow-2xs">
                        2
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-stone-900">
                          Kredensial Lisensi &amp; Lembaga Sertifikasi
                        </h2>
                        <p className="text-xs text-stone-500">
                          Legalitas lembaga afiliasi, lisensi akreditasi, dan wilayah operasional inspeksi.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
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
                            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
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
                            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                          Pengalaman Bidang Audit &amp; Cupping
                        </label>
                        <select
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs cursor-pointer font-medium"
                        >
                          <option value="< 2 Tahun">&lt; 2 Tahun Pengalaman</option>
                          <option value="2 - 5 Tahun">2 - 5 Tahun Pengalaman</option>
                          <option value="5 - 10 Tahun">5 - 10 Tahun Pengalaman</option>
                          <option value="> 10 Tahun / Senior Lead Auditor">&gt; 10 Tahun / Senior Lead Auditor</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                          Wilayah Jangkauan Audit Utama
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                          <select
                            value={coverageArea}
                            onChange={(e) => setCoverageArea(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs cursor-pointer font-medium"
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

                  {/* CARD 3: BIDANG SPESIALISASI & LINGKUP AUDIT */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 sm:p-8 space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black shadow-2xs">
                        3
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-stone-900">
                          Bidang Spesialisasi &amp; Lingkup Audit
                        </h2>
                        <p className="text-xs text-stone-500">
                          Pilih lingkup tugas pengujian mutu dan kepatuhan yang dapat Anda verifikasi:
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-1">
                      {availableSpecializations.map((spec) => {
                        const isChecked = specializations.includes(spec.id);
                        return (
                          <label
                            key={spec.id}
                            className={`p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 cursor-pointer ${
                              isChecked
                                ? 'border-amber-600 bg-amber-50/50 shadow-2xs'
                                : 'border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSpecialization(spec.id)}
                              className="mt-1 w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer"
                            />
                            <div className="space-y-1">
                              <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                                {spec.label}
                              </span>
                              <span className="text-xs text-stone-600 block leading-relaxed">
                                {spec.desc}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* CARD 4: PORTOFOLIO & PAKTA INTEGRITAS */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 sm:p-8 space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black shadow-2xs">
                        4
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-stone-900">
                          Tautan Portofolio &amp; Pakta Integritas
                        </h2>
                        <p className="text-xs text-stone-500">
                          Pemberkasan bukti kompetensi dan komitmen etika dewan auditor independen.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                          Tautan Berkas Sertifikat / Lisensi Auditor (Google Drive / Cloud URL)
                        </label>
                        <div className="relative">
                          <ExternalLink className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type="url"
                            value={portfolioUrl}
                            onChange={(e) => setPortfolioUrl(e.target.value)}
                            placeholder="https://drive.google.com/... (Sertifikat Q-Grader / SK Auditor)"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs transition-all"
                          />
                        </div>
                        <span className="text-[11px] text-stone-500 mt-1 block">
                          Opsional: Menyertakan tautan lisensi mempercepat penugasan audit komersial dari mitra ekspor.
                        </span>
                      </div>

                      {/* Pakta Integritas Independensi */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/60 to-stone-50 border border-amber-300/80 space-y-3 shadow-2xs">
                        <div className="flex items-start gap-3">
                          <Scale className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-xs sm:text-sm font-bold text-amber-950 block">
                              Pakta Integritas &amp; Independensi Auditor
                            </strong>
                            <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                              Seluruh data verifikasi, koordinat patok EUDR, parameter moisture content, dan skor cupping SCA yang Anda input akan menjadi basis paspor digital komoditas kopi dan dapat diaudit oleh pembeli ekspor internasional.
                            </p>
                          </div>
                        </div>

                        <label className="flex items-start gap-3 pt-3 border-t border-amber-200/80 cursor-pointer text-xs font-semibold text-stone-800 select-none">
                          <input
                            type="checkbox"
                            required
                            checked={integrityPledge}
                            onChange={(e) => setIntegrityPledge(e.target.checked)}
                            className="mt-0.5 w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer"
                          />
                          <span className="leading-snug">
                            Saya menyatakan bahwa seluruh proses verifikasi, inspeksi mutu, dan penilaian cupping akan dilaksanakan secara <strong>objektif, independen, transparan, dan bebas dari benturan kepentingan</strong> (*conflict of interest*). *
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* FORM ACTION & SUBMIT BUTTON */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link
                      to="/register"
                      className="text-xs font-bold text-stone-600 hover:text-amber-800 inline-flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Bukan Verifikator? Daftar Peran Rantai Pasok Umum</span>
                    </Link>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-900 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mendaftarkan Kredensial Auditor...</span>
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
              </div>

              {/* RIGHT COLUMN: STICKY AUDITOR GOVERNANCE & BENEFITS (4 OF 12 COLS) */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                {/* Panel 1: Hak Akses & Kewenangan */}
                <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 space-y-4">
                  <div className="flex items-center gap-2 text-stone-900">
                    <Award className="w-5 h-5 text-amber-600" />
                    <h2 className="text-sm font-bold tracking-tight">
                      Hak Akses &amp; Otoritas Dewan Auditor
                    </h2>
                  </div>
                  <ul className="space-y-3 text-xs text-stone-600">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Lembar Kerja Verifikasi Real-time:</strong> Input uji kadar air, defect green bean, dan cupping SCA 10-atribut.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Stempel Digital Resmi:</strong> Penerbitan cap verifikasi mutu terdesentralisasi pada paspor lot kopi digital.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Audit Poligon Lahan EUDR:</strong> Validasi batas kebun petani untuk kepatuhan pasar Uni Eropa.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Rekapitulasi Honorarium:</strong> Monitoring penugasan audit dan transparansi kompensasi jasa penilai.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Panel 2: Alur Aktivasi Akun */}
                <div className="bg-stone-100/90 rounded-2xl border border-stone-200 p-6 space-y-3.5 text-xs text-stone-600">
                  <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-stone-700" />
                    <span>Tahapan Verifikasi Akun</span>
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        1
                      </span>
                      <span>Kirim formulir pendaftaran beserta nomor lisensi resmi.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        2
                      </span>
                      <span>Buka email Anda dan klik tautan verifikasi aktivasi (24 jam).</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        3
                      </span>
                      <span>Kredensial aktif, login ke workstation verifikator mutu.</span>
                    </div>
                  </div>
                </div>

                {/* Panel 3: Bantuan Layanan */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 p-5 space-y-2 text-xs text-stone-700">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Butuh Bantuan Lisensi?</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-600">
                    Jika lembaga atau lab Anda ingin bermitra sebagai entitas verifikasi resmi konsorsium, hubungi tim compliance kami di <a href="mailto:compliance@circulartrace.id" className="font-bold text-amber-800 underline">compliance@circulartrace.id</a>.
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
            <span>Rantai Pasok Kopi Terintegrasi Farm-to-Cup &amp; Standar Mutu SCA</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Enkripsi TLS 1.3 Terverifikasi</span>
            <span>•</span>
            <span>EUDR Regulation (EU) 2023/1115</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegisterVerifierPage;
