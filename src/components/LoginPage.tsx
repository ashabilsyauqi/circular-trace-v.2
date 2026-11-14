import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCoffee } from '../context/CoffeeContext';
import {
  Sprout,
  Warehouse,
  Flame,
  Coffee,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  KeyRound,
  AlertCircle,
  Check,
  RotateCcw,
} from 'lucide-react';

interface CoffeeSlide {
  id: string;
  category: string;
  roleTitle: string;
  badge: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  highlightStat: string;
  imageUrl: string;
}

const COFFEE_SLIDES: CoffeeSlide[] = [
  {
    id: 'kelompok-tani',
    category: 'Tahap 1 • Hulu',
    roleTitle: 'Kelompok Tani',
    badge: 'Hulu & Perkebunan',
    icon: <Sprout className="w-5 h-5 text-emerald-400" />,
    title: 'Harmoni Perkebunan & Panen Petik Merah',
    description:
      'Pencatatan poligon kebun, kepastian varietas unggul, verifikasi elevasi mdpl, dan kepatuhan audit geolokasi EUDR untuk menjamin integritas kopi sejak awal.',
    highlightStat: 'Elevasi 1.400–1.650 mdpl • 98% Petik Merah Terstandar',
    imageUrl:
      'https://images.unsplash.com/photo-1524350876685-274059332603?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'gudang',
    category: 'Tahap 2 & 3 • Penyimpanan',
    roleTitle: 'Gudang & QA',
    badge: 'Gudang Hermetik',
    icon: <Warehouse className="w-5 h-5 text-blue-400" />,
    title: 'Kontrol Mutu Hermetik & Standarisasi Green Bean',
    description:
      'Penyimpanan karung hermetik dengan sensor suhu dan kelembaban ruangan (RH) terkontrol, pengujian kadar air pre-roast, dan validasi standar mutu ekspor.',
    highlightStat: 'Kadar Air Presisi 11–12% • Akreditasi SCA Q-Grader',
    imageUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'roaster',
    category: 'Tahap 4 • Penyangraian',
    roleTitle: 'Roaster ERP',
    badge: 'Roastery Artisan',
    icon: <Flame className="w-5 h-5 text-amber-400" />,
    title: 'Eksplorasi Profil Rasa & Konsistensi Kurva Roasting',
    description:
      'Perintah kerja penyangraian terintegrasi, kalibrasi nilai Agtron, rasio DTR, dan sensory spider chart untuk menghasilkan karakter seduh terbaik.',
    highlightStat: 'Specialty Grade • Agtron Gourmet Scale Terkalibrasi',
    imageUrl:
      'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'coffee-shop',
    category: 'Tahap 5 • Hilir',
    roleTitle: 'Coffee Shop',
    badge: 'Barista & Retail',
    icon: <Coffee className="w-5 h-5 text-stone-300" />,
    title: 'Sajian Cangkir Autentik dengan Narasi Farm-to-Cup',
    description:
      'Menyajikan seduhan kopi premium dengan transparansi penuh. Cetak kartu traceability digital agar pelanggan dapat menelusuri kisah petani di setiap cangkir.',
    highlightStat: 'Farm-to-Cup Transparency • Paspor Digital QR Trace',
    imageUrl:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&auto=format&fit=crop&q=85',
  },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, login, requestPasswordReset, verifyResetCode, resetPassword } = useCoffee();

  // If already logged in, redirect to intended target or user's workstation
  useEffect(() => {
    if (currentUser) {
      const fromPath = (location.state as any)?.from?.pathname;
      if (fromPath) {
        navigate(fromPath, { replace: true });
      } else {
        const dest = currentUser.role === 'admin_kelompok_tani'
          ? '/admin/overview'
          : currentUser.role === 'roaster'
          ? '/admin/roaster/inventory'
          : currentUser.role === 'gudang'
          ? '/admin/gudang/inventory'
          : `/admin/${currentUser.role}`;
        navigate(dest, { replace: true });
      }
    }
  }, [currentUser, location, navigate]);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Carousel states
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Forgot password flow states
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'new_password' | 'success'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState<string | null>(null);

  // Restore remembered email on mount
  useEffect(() => {
    const remembered = localStorage.getItem('cct_rememberedEmail');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  // Slide navigation
  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % COFFEE_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + COFFEE_SLIDES.length) % COFFEE_SLIDES.length);
  }, []);

  // Automatic carousel rotation (every 5.5 seconds, pauses when hovered)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    setTimeout(() => {
      const res = login(email, password, rememberMe);
      setLoginLoading(false);
      if (!res.success) {
        setLoginError(res.message);
      }
    }, 450);
  };

  // Step 1: Request OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    const res = requestPasswordReset(forgotEmail);
    if (res.success && res.resetCode) {
      setSimulatedOtpNotice(`Kode OTP Verifikasi: ${res.resetCode}`);
      setForgotOtp(res.resetCode);
      setForgotStep('otp');
    } else {
      setForgotError(res.message);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    const res = verifyResetCode(forgotEmail, forgotOtp);
    if (res.success) {
      setForgotStep('new_password');
    } else {
      setForgotError(res.message);
    }
  };

  // Step 3: Set New Password
  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (newPassword.length < 6) {
      setForgotError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const res = resetPassword(forgotEmail, forgotOtp, newPassword);
    if (res.success) {
      setForgotStep('success');
      setPassword(newPassword);
      setEmail(forgotEmail);
    } else {
      setForgotError(res.message);
    }
  };

  const closeForgotModal = () => {
    setForgotModalOpen(false);
    setForgotStep('email');
    setForgotEmail('');
    setForgotOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotError(null);
    setSimulatedOtpNotice(null);
  };

  const activeSlide = COFFEE_SLIDES[currentSlideIndex];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col lg:flex-row">
      {/* ============================================================== */}
      {/* COLUMN 1: WELCOME & INTERACTIVE COFFEE SLIDESHOW (LEFT)        */}
      {/* ============================================================== */}
      <div
        className="relative lg:w-[54%] xl:w-[58%] min-h-[480px] sm:min-h-[540px] lg:min-h-screen bg-stone-950 flex flex-col justify-between overflow-hidden p-6 sm:p-10 lg:p-12 select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Images with smooth opacity crossfade */}
        {COFFEE_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            } transform transition-transform duration-3000`}
            style={{
              backgroundImage: `url(${slide.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}

        {/* Ambient Dark/Warm Gradient Overlays for optimal readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-stone-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-stone-950/40" />

        {/* Top Header / Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>sangrAI</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 uppercase tracking-wider">
                  Supply Chain
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Platform Rantai Pasok Kopi Terintegrasi Farm-to-Cup
              </p>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-stone-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multi-Stakeholder Architecture</span>
          </div>
        </div>

        {/* Center / Bottom: Narrative & Showcase Content for Current Slide */}
        <div className="relative z-10 my-auto py-8 max-w-xl">
          {/* Badge & Category */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-bold">
              {activeSlide.icon}
              <span>{activeSlide.badge}</span>
            </span>
            <span className="text-xs text-stone-400 font-medium">
              {activeSlide.category}
            </span>
          </div>

          {/* Slide Headline */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mb-3">
            {activeSlide.title}
          </h2>

          {/* Slide Description */}
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-4">
            {activeSlide.description}
          </p>

          {/* Key Metric Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-amber-200 font-semibold shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{activeSlide.highlightStat}</span>
          </div>
        </div>

        {/* Bottom Controls: Stakeholder Pills & Navigation */}
        <div className="relative z-10 pt-4 border-t border-white/15 space-y-4">
          {/* 4 Interactive Stakeholder Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {COFFEE_SLIDES.map((slide, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 shadow-md scale-102'
                      : 'bg-white/10 hover:bg-white/20 text-stone-300 border border-white/10'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{slide.roleTitle}</span>
                </button>
              );
            })}
          </div>

          {/* Slider Controls: Dots + Prev / Next */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {COFFEE_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  aria-label={`Buka slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentSlideIndex
                      ? 'w-8 bg-amber-400'
                      : 'w-2 bg-stone-600 hover:bg-stone-400'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Slide sebelumnya"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Slide berikutnya"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* COLUMN 2: PURE LOGIN FORM (RIGHT)                              */}
      {/* ============================================================== */}
      <div className="lg:w-[46%] xl:w-[42%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[#FAF7F2]">
        {/* Top Link */}
        <div className="flex items-center justify-between pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-amber-800 transition-colors"
          >
            <span>&larr; Kembali ke Marketplace Publik</span>
          </Link>
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Portal Kredensial
          </span>
        </div>

        {/* Center: Main Login Form Card */}
        <div className="my-auto max-w-md w-full mx-auto py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-bold mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Portal Akses Sistem</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Masuk ke Akun Anda
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              Silakan masukkan email dan kata sandi akun Anda untuk mengakses ruang kerja terisolasi sistem kopi terintegrasi.
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4.5">
            {/* Input Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5"
              >
                Alamat Email Akun
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@organisasi.id"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold text-stone-800 uppercase tracking-wider"
                >
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotModalOpen(true);
                  }}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun..."
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-2xs"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 border-stone-300"
                />
                <span>Ingat akun saya di peramban ini</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-amber-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
              >
                {loginLoading ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Kredensial...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Supported Stakeholder Scope Card */}
          <div className="mt-8 p-4 rounded-2xl bg-stone-100/80 border border-stone-200/80 text-[11px] text-stone-600 space-y-2">
            <div className="font-bold text-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Lingkup Pengguna Sistem Terdaftar:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-stone-700 font-medium">
              <div className="flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>1. Kelompok Tani</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Warehouse className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>2. Gudang &amp; QA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>3. Roaster (Roastery)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                <span>4. Coffee Shop (Kafe)</span>
              </div>
            </div>
            <p className="text-[10px] text-stone-500 pt-1 leading-relaxed border-t border-stone-200/60">
              Hak akses dan dasbor kerja Anda akan otomatis disesuaikan dengan peran organisasi terverifikasi.
            </p>

            {/* Registered demo accounts helper */}
            <div className="pt-2 border-t border-stone-200/60 text-[10px] space-y-1.5">
              <span className="font-bold text-stone-700 block">Kredensial Akun Pengguna Terdaftar (Sandi: password123):</span>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-stone-600">
                <button
                  type="button"
                  onClick={() => { setEmail('admin.gapoktan@sangrai.id'); setPassword('password123'); }}
                  className="text-left hover:text-amber-800 transition-colors cursor-pointer truncate"
                  title="Klik untuk mengisi formulir login sebagai Admin Kelompok Tani"
                >
                  • Admin: admin.gapoktan@sangrai.id
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('reza@roaster.id'); setPassword('password123'); }}
                  className="text-left hover:text-amber-800 transition-colors cursor-pointer truncate"
                  title="Klik untuk mengisi formulir login sebagai Roaster"
                >
                  • Roaster: reza@roaster.id
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('gudang.bandung@gudang.id'); setPassword('password123'); }}
                  className="text-left hover:text-amber-800 transition-colors cursor-pointer truncate"
                  title="Klik untuk mengisi formulir login sebagai Gudang & QA"
                >
                  • Gudang: gudang.bandung@gudang.id
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('budi@pengolah.id'); setPassword('password123'); }}
                  className="text-left hover:text-amber-800 transition-colors cursor-pointer truncate"
                  title="Klik untuk mengisi formulir login sebagai Stasiun Pengolah"
                >
                  • Pengolah: budi@pengolah.id
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('asep@petani.id'); setPassword('password123'); }}
                  className="text-left hover:text-amber-800 transition-colors cursor-pointer truncate"
                  title="Klik untuk mengisi formulir login sebagai Petani"
                >
                  • Petani: asep@petani.id
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('maya@cafe.id'); setPassword('password123'); }}
                  className="text-left hover:text-amber-800 transition-colors cursor-pointer truncate"
                  title="Klik untuk mengisi formulir login sebagai Coffee Shop"
                >
                  • Cafe: maya@cafe.id
                </button>
              </div>
              <p className="text-[9px] text-stone-400 italic">Klik salah satu akun di atas untuk mengisi formulir, lalu klik Masuk ke Sistem.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-stone-200 text-center text-xs text-stone-500">
          <p>&copy; 2026 sangrAI • Rantai Pasok Kopi Terintegrasi Farm-to-Cup</p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* FORGOT PASSWORD MODAL (MULTI-STEP OTP)                         */}
      {/* ============================================================== */}
      {forgotModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={closeForgotModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2 border border-amber-200">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Pemulihan Kata Sandi
              </h3>
              <p className="text-xs text-stone-600">
                {forgotStep === 'email' && 'Masukkan alamat email Anda untuk menerima kode verifikasi OTP.'}
                {forgotStep === 'otp' && 'Masukkan 6-digit kode OTP yang telah dikirim ke email Anda.'}
                {forgotStep === 'new_password' && 'Buat kata sandi baru yang kuat untuk akun Anda.'}
                {forgotStep === 'success' && 'Kata sandi akun Anda berhasil diperbarui.'}
              </p>
            </div>

            {/* Error Message */}
            {forgotError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {/* Simulated OTP Notice */}
            {simulatedOtpNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                <span>{simulatedOtpNotice}</span>
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
                  {forgotOtp}
                </span>
              </div>
            )}

            {/* Step 1: Input Email */}
            {forgotStep === 'email' && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Email Akun Terdaftar
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="contoh: akun@organisasi.id"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeForgotModal}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Kirim Kode OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Input OTP */}
            {forgotStep === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Kode 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('email')}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Verifikasi Kode</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {forgotStep === 'new_password' && (
              <form onSubmit={handleSetNewPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Simpan Kata Sandi Baru</span>
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Success */}
            {forgotStep === 'success' && (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-xs text-stone-600">
                  Kata sandi Anda telah berhasil diubah. Formulir masuk telah siap dengan kata sandi baru Anda.
                </p>
                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="w-full py-3 rounded-xl bg-stone-900 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Masuk Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
