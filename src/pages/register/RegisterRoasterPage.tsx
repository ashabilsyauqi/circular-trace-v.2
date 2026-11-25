import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import {
  Flame,
  Activity,
  Award,
  QrCode,
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
  MapPin,
  Phone,
  User,
  Sliders,
  Coffee,
} from 'lucide-react';

export const RegisterRoasterPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser, currentUser } = useCoffee();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/admin/overview');
    }
  }, [currentUser, navigate]);

  // Form states
  const [roasteryName, setRoasteryName] = useState('');
  const [location, setLocation] = useState('');
  const [roasterMachine, setRoasterMachine] = useState('');
  const [headRoasterName, setHeadRoasterName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredData, setRegisteredData] = useState<{
    email: string;
    name: string;
    org: string;
    verificationToken?: string;
    verificationLink?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!roasteryName.trim() || !headRoasterName.trim() || !location.trim()) {
      setErrorMsg('Mohon lengkapi nama roastery, kota, dan nama penanggung jawab sangrai.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg('Format alamat email bisnis tidak valid.');
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

    setIsSubmitting(true);
    try {
      if (registerUser) {
        const bioText = `Artisan Roastery ${roasteryName.trim()} berbasis di ${location.trim()}. Mesin utama: ${roasterMachine.trim() || 'Custom Drum Roaster'}. Fokus pada profil sangrai presisi, evaluasi sensori cupping SCA, dan kemasan retail tertelusur.`;
        const result = await registerUser({
          name: headRoasterName.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          role: 'roaster',
          organization: roasteryName.trim(),
          location: location.trim(),
          phone: phone.trim() || '0812-3456-7890',
          bio: bioText,
        });

        setRegisteredData({
          email: email.trim().toLowerCase(),
          name: headRoasterName.trim(),
          org: roasteryName.trim(),
          verificationToken: result?.verificationToken,
          verificationLink: result?.verificationLink,
        });
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal melakukan pendaftaran akun Roastery.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-stone-900 flex flex-col font-sans">
      {/* 1. Header Bar */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-[#E6DFD5] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-orange-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
            <span className="h-4 w-px bg-stone-300 hidden sm:inline-block" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black shadow-xs">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-stone-900 tracking-tight hidden sm:inline">
                CircularCoffee
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300">
                Penyangraian &amp; Lab Cupping
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <span className="text-stone-500 hidden md:inline">Sudah memiliki akun?</span>
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-orange-700 text-white font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Headline Banner */}
      <section className="w-full bg-[#1C0F08] text-white border-b border-stone-800 relative overflow-hidden py-10 sm:py-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-orange-950/80 text-orange-300 border border-orange-500/30 px-3.5 py-1 rounded-full text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>ERP Roastery &amp; Artisan Lab Cupping</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Pendaftaran Artisan Roastery
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm lg:text-base leading-relaxed">
              Akses software manajemen kurva sangrai, spider chart cupping SCA, dan integrasi label paspor QR digital kemasan retail.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Main Form & Side Showcase Grid */}
      <main className="w-full py-8 sm:py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isSuccess && registeredData ? (
            /* Success State */
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#E6DFD5] shadow-lg p-8 sm:p-12 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-orange-50 shadow-sm">
                <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-orange-800 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                  Pendaftaran Roastery Berhasil
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Selamat Datang di CircularCoffee
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Brand roastery <strong className="text-stone-900">{registeredData.org}</strong> telah siap beroperasi. Anda dapat membuat profil sangrai, perintah produksi, dan cupping sheet.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8F5F0] border border-[#E6DFD5] text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Nama Roastery:</span>
                  <span className="font-bold text-stone-900">{registeredData.org}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Head Roaster:</span>
                  <span className="font-bold text-stone-900">{registeredData.name}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Email Bisnis:</span>
                  <span className="font-bold text-stone-900 font-mono">{registeredData.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Peran Layanan:</span>
                  <span className="font-bold text-orange-800 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                    Artisan Roastery ERP &amp; Cupping Lab
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Masuk ke Panel Roastery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/"
                  className="py-3.5 px-6 rounded-xl border border-stone-300 text-stone-700 hover:bg-white font-bold text-xs sm:text-sm transition-all block text-center"
                >
                  Ke Beranda
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: FORM INPUTS (7 OF 12) */}
              <div className="lg:col-span-7 space-y-6">
                {errorMsg && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-rose-800 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E6DFD5] shadow-xs p-6 sm:p-8 space-y-5">
                  <div className="pb-3 border-b border-stone-100">
                    <h2 className="text-base sm:text-lg font-black text-stone-900">
                      Formulir Akun Artisan Roastery
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Informasi profil sangrai, penanggung jawab produksi, dan mesin roasting.
                    </p>
                  </div>

                  {/* 1. Nama Brand Roastery */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Nama Brand Roastery / Lab Sangrai <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Flame className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={roasteryName}
                        onChange={(e) => setRoasteryName(e.target.value)}
                        placeholder="e.g. Karsa Craft Roastery & Lab"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-600/30 focus:border-orange-600 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* 2. Kota Lokasi & Tipe Mesin Roasting */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Kota / Lokasi Roastery <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Bandung"
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-600/30 focus:border-orange-600 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Tipe Mesin Roasting Utama
                      </label>
                      <div className="relative">
                        <Sliders className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={roasterMachine}
                          onChange={(e) => setRoasterMachine(e.target.value)}
                          placeholder="e.g. Giesen W6A, Probat UG22, Berto"
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-600/30 focus:border-orange-600 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Nama Head Roaster & WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Nama Head Roaster / PIC <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={headRoasterName}
                          onChange={(e) => setHeadRoasterName(e.target.value)}
                          placeholder="e.g. Reza Pratama"
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-600/30 focus:border-orange-600 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 0811-2233-4455"
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-600/30 focus:border-orange-600 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Email Bisnis */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Alamat Email Bisnis Roastery <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. roastery.karsa@circulartrace.id"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-600/30 focus:border-orange-600 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* 5. Kata Sandi & Konfirmasi */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Kata Sandi <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimal 6 karakter"
                          className="w-full pl-10 pr-10 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-600/30 focus:border-orange-600 transition-all font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Konfirmasi Sandi <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi"
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-600/30 focus:border-orange-600 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-md shadow-orange-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mendaftarkan Akun Roastery...</span>
                        </>
                      ) : (
                        <>
                          <span>Mulai Akun Roastery</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-stone-500 text-center mt-2.5">
                      Dengan mendaftar, Anda menyetujui Ketentuan Layanan &amp; Kebijakan Privasi CircularCoffee.
                    </p>
                  </div>
                </form>
              </div>

              {/* RIGHT COLUMN: RANGKUMAN FITUR & VALUE ADDED (5 OF 12) */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-white rounded-2xl border border-[#E6DFD5] shadow-xs p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-stone-900">
                        Fitur Artisan Roastery
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        ERP Penyangraian &amp; Sains Kurva RoR
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {/* Feature 1 */}
                    <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/80 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-orange-950">
                        <Activity className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>Work Orders &amp; Kalibrasi Kurva RoR</span>
                      </div>
                      <p className="text-[11px] text-orange-800 leading-relaxed pl-6">
                        Jadwal batch sangrai, DTR (Development Time Ratio), Agtron roast tone, dan pencatatan susut bobot biji secara presisi.
                      </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                        <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Spider Chart Uji Sensori SCA</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed pl-6">
                        Lembar penilaian cupping digital 10 atribut SCA (Fragrance, Flavor, Acidity, Body, Clean Cup, hingga Balance &amp; Overall).
                      </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-3.5 rounded-xl bg-stone-100/80 border border-stone-200 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                        <QrCode className="w-4 h-4 text-stone-700 shrink-0" />
                        <span>Cetak Label QR Traceability Kemasan</span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed pl-6">
                        Cetak label kemasan kantong retail yang memuat paspor QR digital langsung terhubung ke profil petani dan kebun asal.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Sourcing Trust */}
                <div className="bg-stone-900 text-stone-200 rounded-2xl p-5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                    <Award className="w-4 h-4" />
                    <span>Akses Green Bean Terverifikasi SCA &amp; EUDR</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Langsung terhubung dengan kelompok tani dan gudang terverifikasi, memberikan transparansi harga beli yang adil tanpa perantara spekulatif.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default RegisterRoasterPage;
