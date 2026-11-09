import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Coffee,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Award,
  Truck,
  Check,
  X,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Store,
  Crown,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { getMarketplaceBaseUrl, getSystemBaseUrl } from '../utils/baseUrl';

export const LoginPage: React.FC = () => {
  const {
    login,
    registerUser,
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
    setActiveView,
    navigate,
    users,
  } = useCoffee();

  // Detect domain context
  const isMarketplaceDomain =
    typeof window !== 'undefined' && window.location.host.includes('marketplace');
  const isErpDomain = !isMarketplaceDomain;

  // Active Tab: 'login' (Masuk Akun) or 'register' (Daftar Baru)
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Credentials Login State
  const [emailInput, setEmailInput] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cct_rememberedEmail');
      if (saved) return saved;
    }
    return isErpDomain ? 'novizar@circulartrace.com' : 'buyer@circulartrace.com';
  });
  const [passwordInput, setPasswordInput] = useState<string>(() => {
    return isErpDomain ? '@Circulartrace2026#' : 'password123';
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Register Buyer State (for Marketplace domain)
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regLocation, setRegLocation] = useState<string>('');
  const [regAgreeTerms, setRegAgreeTerms] = useState<boolean>(true);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState<boolean>(false);
  const [resetStep, setResetStep] = useState<'request_email' | 'verify_otp' | 'new_password' | 'done'>('request_email');
  const [resetEmail, setResetEmail] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [resetStatusMsg, setResetStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const marketplaceUrl = getMarketplaceBaseUrl();
  const systemUrl = getSystemBaseUrl();

  // 1. Handle Form Credential Login
  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);
    setIsSubmitting(true);

    if (!emailInput.trim()) {
      setLoginError('Mohon masukkan alamat email atau username akun Anda.');
      setIsSubmitting(false);
      return;
    }
    if (!passwordInput) {
      setLoginError('Mohon masukkan kata sandi akun Anda.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = login(emailInput.trim(), passwordInput, rememberMe);
      if (!res.success || !res.user) {
        setLoginError(res.message || 'Email atau kata sandi tidak sesuai.');
        setIsSubmitting(false);
        return;
      }

      setLoginSuccess(`Selamat datang kembali, ${res.user.name}! Mengarahkan...`);

      setTimeout(() => {
        if (isErpDomain) {
          if (res.user?.role === 'buyer') {
            setActiveView('buyer');
          } else {
            const serviceKey = res.user?.role === 'superadmin' ? 'admin' : res.user?.role;
            navigate({ view: 'dashboard', service: serviceKey });
            setActiveView('dashboard');
          }
        } else {
          if (res.user?.role !== 'buyer') {
            setActiveView('marketplace');
          } else {
            setActiveView('buyer');
          }
        }
      }, 500);
    } catch (err: any) {
      setLoginError(err?.message || 'Terjadi kesalahan saat masuk akun.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Quick 1-Click Role Logins for Testing & Demos
  const handleQuickRoleLogin = (email: string, pass: string, role: string) => {
    setLoginError(null);
    setLoginSuccess(null);
    setIsSubmitting(true);
    setEmailInput(email);
    setPasswordInput(pass);

    const res = login(email, pass, true);
    if (res.success && res.user) {
      setLoginSuccess(`Login Berhasil! Mengalihkan ke stasiun ${res.user.organization || res.user.name}...`);
      setTimeout(() => {
        if (role === 'buyer') {
          setActiveView('buyer');
        } else {
          const serviceKey = role === 'superadmin' ? 'admin' : role;
          navigate({ view: 'dashboard', service: serviceKey });
          setActiveView('dashboard');
        }
      }, 400);
    } else {
      setLoginError(res.message);
      setIsSubmitting(false);
    }
  };

  // 3. Handle Buyer Registration (on Marketplace domain)
  const handleRegisterBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regName.trim()) {
      setRegError('Mohon lengkapi Nama Lengkap Anda.');
      return;
    }
    if (!regPhone.trim()) {
      setRegError('Mohon masukkan nomor WhatsApp / HP aktif.');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Mohon masukkan alamat email aktif.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setRegError('Kata sandi minimal 6 karakter demi keamanan akun Anda.');
      return;
    }
    if (!regLocation.trim()) {
      setRegError('Mohon cantumkan Kota / Kabupaten domisili untuk pengiriman.');
      return;
    }
    if (!regAgreeTerms) {
      setRegError('Mohon setujui Syarat & Ketentuan Pembeli.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!registerUser) {
        setRegError('Modul registrasi sedang disinkronkan, silakan gunakan login akun demo.');
        setIsSubmitting(false);
        return;
      }

      const res = registerUser({
        role: 'buyer',
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        location: regLocation.trim(),
        organization: 'Pembeli Terdaftar',
        password: regPassword,
        bio: 'Akun pembeli resmi di CircularTrace Marketplace.',
      });

      if (!res.success) {
        setRegError(res.message);
        setIsSubmitting(false);
        return;
      }

      setRegSuccess('Pendaftaran berhasil! Sedang masuk ke dashboard...');

      setTimeout(() => {
        login(regEmail.trim(), regPassword, true);
        setActiveView('buyer');
      }, 600);
    } catch (err: any) {
      setRegError(err?.message || 'Gagal mendaftarkan akun pembeli.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Forgot Password Handlers
  const openForgotModal = () => {
    setResetEmail(emailInput || (isErpDomain ? 'novizar@circulartrace.com' : 'buyer@circulartrace.com'));
    setResetStep('request_email');
    setOtpInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setResetStatusMsg(null);
    setForgotModalOpen(true);
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const res = requestPasswordReset(resetEmail);
    if (!res.success) {
      setResetStatusMsg({ type: 'error', text: res.message });
      return;
    }
    setOtpInput(res.resetCode || '');
    setResetStatusMsg({
      type: 'success',
      text: res.message + ' Kode OTP: ' + res.resetCode,
    });
    setResetStep('verify_otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const res = verifyResetCode(resetEmail, otpInput);
    if (!res.success) {
      setResetStatusMsg({ type: 'error', text: res.message });
      return;
    }
    setResetStatusMsg({ type: 'info', text: 'Kode OTP terverifikasi. Silakan buat kata sandi baru.' });
    setResetStep('new_password');
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.length < 6) {
      setResetStatusMsg({ type: 'error', text: 'Kata sandi baru minimal 6 karakter.' });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setResetStatusMsg({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok.' });
      return;
    }

    const res = resetPassword(resetEmail, otpInput, newPasswordInput);
    if (!res.success) {
      setResetStatusMsg({ type: 'error', text: res.message });
      return;
    }

    setResetStatusMsg({ type: 'success', text: res.message });
    setResetStep('done');
    setEmailInput(resetEmail);
    setPasswordInput(newPasswordInput);
  };

  // ERP SANGRAI STATIONS QUICK ACCESS LIST (7 CORE ROLES)
  const ERP_QUICK_ROLES = [
    {
      role: 'superadmin',
      name: 'Novizar',
      title: 'Super Administrator & Owner',
      org: 'sangrAI Platform Governance',
      email: 'novizar@circulartrace.com',
      pass: '@Circulartrace2026#',
      badge: 'Owner',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: <Crown className="w-4 h-4 text-amber-400" />,
    },
    {
      role: 'petani',
      name: 'Asep Supriatna',
      title: 'Kelompok Tani Gunung Tilu',
      org: 'Pangalengan, 1.550 mdpl (Poligon GPS)',
      email: 'asep@petani.id',
      pass: 'password123',
      badge: 'Petani',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: <Sprout className="w-4 h-4 text-emerald-400" />,
    },
    {
      role: 'pengolah',
      name: 'Dedi Kurniawan',
      title: 'Stasiun Mill Kopi Gayo',
      org: 'Pantan Cuaca (Wet/Dry & Anaerobik)',
      email: 'dedi@wetmill-gayo.id',
      pass: 'password123',
      badge: 'Pengolah',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: <Cog className="w-4 h-4 text-amber-400" />,
    },
    {
      role: 'gudang',
      name: 'Budi Sentosa',
      title: 'Central Warehouse Logistics',
      org: 'Gudang Klimatik & Kontrol Hermetik',
      email: 'gudang@circulartrace.com',
      pass: 'password123',
      badge: 'Gudang',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: <Warehouse className="w-4 h-4 text-blue-400" />,
    },
    {
      role: 'roaster',
      name: 'Rian Pratama',
      title: 'Sentosa Specialty Roastery',
      org: 'Artisan Batch & Kurva Agtron (Probat UG15)',
      email: 'rian@kopisentosa.com',
      pass: 'password123',
      badge: 'Roaster',
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      icon: <Flame className="w-4 h-4 text-orange-400" />,
    },
    {
      role: 'cafe',
      name: 'Rian Teduh',
      title: 'Teduh Coffee Space',
      org: 'Farm-to-Cup POS & Resep HPP',
      email: 'cafe@circulartrace.com',
      pass: 'password123',
      badge: 'Kafe',
      badgeColor: 'bg-stone-500/20 text-stone-200 border-stone-500/40',
      icon: <Coffee className="w-4 h-4 text-stone-300" />,
    },
    {
      role: 'verifikator',
      name: 'Prof. Novizar Nazir',
      title: 'Ketua TPHP Universitas Andalas',
      org: 'Auditor Ketertelusuran EUDR Resmi',
      email: 'verifikator@circulartrace.com',
      pass: 'password123',
      badge: 'Verifikator',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      icon: <ShieldCheck className="w-4 h-4 text-teal-400" />,
    },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#FAF7F2] text-[#1C1410] font-['Poppins']">
      
      {/* COLUMN 1 (LEFT 5 COLS): EDITORIAL BRAND HERO */}
      <div
        className={`lg:col-span-5 relative flex flex-col justify-between p-8 sm:p-12 lg:p-14 text-white overflow-hidden min-h-[420px] lg:min-h-screen ${
          isErpDomain
            ? 'bg-gradient-to-br from-[#120D0A] via-[#1E130D] to-[#120D0A]'
            : 'bg-[#0D1812]'
        }`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 transition-transform duration-1000 pointer-events-none"
          style={{
            backgroundImage: isErpDomain
              ? "url('https://images.unsplash.com/photo-1521302200778-33500795e128?w=1600&auto=format&fit=crop&q=85')"
              : "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&auto=format&fit=crop&q=85')",
          }}
        />
        <div
          className={`absolute inset-0 pointer-events-none ${
            isErpDomain
              ? 'bg-gradient-to-t from-[#120D0A] via-[#1E130D]/80 to-[#120D0A]/60'
              : 'bg-gradient-to-t from-[#0A130E] via-[#0E1E16]/80 to-[#0A130E]/60'
          }`}
        />

        <div className="relative z-10 flex items-center justify-between">
          <div
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md text-white group-hover:scale-105 transition-transform ${
                isErpDomain ? 'bg-amber-600' : 'bg-[#00AA5B]'
              }`}
            >
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Circular<span className={isErpDomain ? 'text-amber-400' : 'text-[#00AA5B]'}>Trace</span>
                </span>
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md font-extrabold border ${
                    isErpDomain
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-[#00AA5B]/20 text-emerald-300 border-[#00AA5B]/40'
                  }`}
                >
                  {isErpDomain ? 'ERP Ecosystem' : 'Buyer Portal'}
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                {isErpDomain
                  ? 'Platform Rantai Pasok Kopi Sirkular (Petani • Roaster)'
                  : 'Pasar Kopi Specialty Langsung dari Hulu'}
              </p>
            </div>
          </div>

          {isErpDomain ? (
            <a
              href={marketplaceUrl}
              target={marketplaceUrl.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-amber-200 hover:text-white transition-all cursor-pointer backdrop-blur-xs"
              title="Buka Marketplace Terpadu di Domain Terpisah"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Buka Marketplace</span>
              <ExternalLink className="w-3 h-3 text-amber-300" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setActiveView('marketplace')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-stone-200 hover:text-white transition-all cursor-pointer backdrop-blur-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Katalog</span>
            </button>
          )}
        </div>

        <div className="relative z-10 space-y-6 pt-12 lg:pt-0">
          <div className="space-y-3">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                isErpDomain
                  ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                  : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isErpDomain
                  ? 'Workstation Sistem Terpadu'
                  : 'Direct Farm-to-Cup Marketplace'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug text-white">
              {isErpDomain
                ? 'Workstation Operasional Rantai Pasok Kopi Sirkular'
                : 'Beli Biji Kopi Specialty Langsung dari Petani Nusantara'}
            </h1>

            <p className="text-sm text-stone-300 font-light leading-relaxed">
              {isErpDomain
                ? 'Portal mandiri untuk Kelompok Tani (poligon GPS & panen), Stasiun Olah Mill (batch fermentasi), Gudang Klimatik, Artisan Roastery, dan Kafe Farm-to-Cup dengan verifikasi audit EUDR.'
                : 'Dapatkan pasokan biji kopi hijau (green bean) dan sangrai (roasted bean) berskor SCA 80+ langsung dari kelompok tani terverifikasi. Transparan, adil, dan dilengkapi paspor digital ketertelusuran lengkap.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {isErpDomain ? (
              <>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Audit Lahan &amp; Kepatuhan EUDR</p>
                    <p className="text-[11px] text-stone-400">Pencatatan poligon batas kebun GPS bebas deforestasi.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Roasting Agtron &amp; Uji Mutu SCA</p>
                    <p className="text-[11px] text-stone-400">Manajemen batch sangrai, kurva suhu, dan evaluasi sensori Q-Grader.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Master Data, Finansial &amp; Silsilah QR</p>
                    <p className="text-[11px] text-stone-400">Kalkulasi HPP, omzet, margin laba, dan paspor digital farm-to-cup.</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">100% Petani &amp; Prosesor Terverifikasi</p>
                    <p className="text-[11px] text-stone-400">Data origin asli, bukan kopi oplosan pedagang perantara.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Skor Cupping SCA 80+ &amp; Uji Sensorik</p>
                    <p className="text-[11px] text-stone-400">Dilengkapi spider radar cita rasa, kadar air, dan grading defect.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Pengiriman Aman &amp; Checkout Bundle</p>
                    <p className="text-[11px] text-stone-400">Konfirmasi pemesanan mudah dan langsung terhubung dengan admin logistik.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
          <span>&copy; 2026 CircularTrace Ecosystem</span>
          <span>{isErpDomain ? 'Enterprise Edition' : '100% Gratis - Akun Pembeli'}</span>
        </div>
      </div>

      {/* COLUMN 2 (RIGHT 7 COLS): AUTHENTICATION FORM & QUICK ROLE STATIONS */}
      <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 max-w-2xl mx-auto w-full">
        <div className="space-y-6">

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {isErpDomain ? 'Masuk ke Workstation Sistem' : 'Masuk ke Akun Pembeli'}
              </h2>
              {isErpDomain ? (
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold">
                  Sistem ERP SangrAI
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
                  Akun Pembeli Bebas
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              {isErpDomain
                ? 'Akses workstation operasional untuk mengelola master data kebun, batch olahan, roastery, dan verifikasi silsilah kopi.'
                : 'Akses keranjang belanja, status pesanan pengiriman, dan buku alamat Anda. 100% gratis tanpa biaya apapun.'}
            </p>
          </div>

          {loginError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-semibold">{loginError}</div>
            </div>
          )}

          {loginSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-semibold">{loginSuccess}</div>
            </div>
          )}

          {/* CREDENTIALS LOGIN FORM */}
          <form onSubmit={handleCredentialLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {isErpDomain ? 'Email atau Username Mitra / Admin' : 'Email atau Username Pembeli'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={isErpDomain ? 'novizar@circulartrace.com / asep@petani.id' : 'buyer@circulartrace.com'}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm font-medium text-stone-900 placeholder:text-stone-400 bg-white shadow-2xs transition-all outline-none"
                  autoComplete="username"
                  required
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={openForgotModal}
                  className="text-xs text-amber-700 hover:text-amber-800 font-bold hover:underline cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm font-medium text-stone-900 placeholder:text-stone-400 bg-white shadow-2xs transition-all outline-none font-mono"
                  autoComplete="current-password"
                  required
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-stone-400 hover:text-stone-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 font-medium select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 cursor-pointer"
                />
                <span>Ingat akun saya di peramban ini</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-6 rounded-2xl text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isErpDomain
                  ? 'bg-amber-600 hover:bg-amber-700 active:scale-[0.99]'
                  : 'bg-[#00AA5B] hover:bg-[#03AC0E] active:scale-[0.99]'
              }`}
            >
              <span>{isSubmitting ? 'Memverifikasi...' : isErpDomain ? 'Masuk ke Workstation Sistem' : 'Masuk sebagai Pembeli'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* QUICK ACCESS STATIONS (1-CLICK TESTING) */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {isErpDomain
                    ? 'Akses Cepat Pengujian Stasiun Kerja (1-Klik)'
                    : 'Akses Cepat Pengujian Akun Pembeli (1-Klik)'}
                </span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                Ready Demo
              </span>
            </div>

            {isErpDomain ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {ERP_QUICK_ROLES.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleQuickRoleLogin(r.email, r.pass, r.role)}
                    className="p-3 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-amber-400 text-left transition-all cursor-pointer shadow-2xs flex items-center justify-between gap-2.5 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 border border-stone-800 group-hover:scale-105 transition-transform">
                        {r.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {r.name}
                          </h4>
                          <span
                            className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border truncate ${r.badgeColor}`}
                          >
                            {r.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 truncate">
                          {r.title}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  handleQuickRoleLogin('buyer@circulartrace.com', 'password123', 'buyer')
                }
                className="w-full p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 text-left transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#00AA5B] text-white flex items-center justify-center font-bold shrink-0">
                    SR
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-stone-900">Siti Rahma</h4>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 border border-emerald-400">
                        Akun Pembeli
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      buyer@circulartrace.com &bull; E-Wallet Rp 25.000.000 Aktif
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#00AA5B] group-hover:translate-x-0.5 transition-transform">
                  <span>Masuk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-stone-500 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveView('landing')}
              className="hover:text-stone-900 font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>&larr; Beranda Ekosistem Kopi</span>
            </button>

            {isErpDomain ? (
              <a
                href={marketplaceUrl}
                target={marketplaceUrl.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="text-amber-800 hover:text-amber-900 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Buka Marketplace Publik</span>
                <ExternalLink className="w-3 h-3 text-amber-700" />
              </a>
            ) : (
              <a
                href={systemUrl}
                target={systemUrl.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="text-emerald-800 hover:text-emerald-900 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Masuk ke Workstation Sistem ERP</span>
                <ExternalLink className="w-3 h-3 text-emerald-700" />
              </a>
            )}
          </div>

        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden my-8 p-6 text-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">
                Pemulihan Kata Sandi Akun
              </h3>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetStatusMsg && (
              <div
                className={`p-3 rounded-2xl text-xs font-semibold ${
                  resetStatusMsg.type === 'error'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {resetStatusMsg.text}
              </div>
            )}

            {resetStep === 'request_email' && (
              <form onSubmit={handleRequestOtp} className="space-y-3">
                <p className="text-xs text-stone-600">
                  Masukkan email akun mitra atau pembeli Anda untuk menerima kode OTP simulasi reset password.
                </p>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="email@circulartrace.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-medium outline-none focus:border-amber-600"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                >
                  Kirim Kode OTP
                </button>
              </form>
            )}

            {resetStep === 'verify_otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <p className="text-xs text-stone-600">
                  Masukkan 6 digit kode OTP yang telah dikirimkan ke email Anda.
                </p>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-mono font-bold text-center tracking-widest outline-none focus:border-amber-600"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                >
                  Verifikasi OTP
                </button>
              </form>
            )}

            {resetStep === 'new_password' && (
              <form onSubmit={handleSaveNewPassword} className="space-y-3">
                <p className="text-xs text-stone-600">
                  Silakan tentukan kata sandi baru untuk akun Anda (minimal 6 karakter).
                </p>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Kata Sandi Baru"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-medium outline-none focus:border-amber-600 font-mono"
                  required
                />
                <input
                  type="password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Konfirmasi Kata Sandi Baru"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-medium outline-none focus:border-amber-600 font-mono"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                >
                  Simpan Kata Sandi Baru
                </button>
              </form>
            )}

            {resetStep === 'done' && (
              <div className="space-y-3 text-center">
                <p className="text-xs text-emerald-800 font-bold">
                  Kata sandi baru berhasil disimpan! Silakan masuk dengan kata sandi baru Anda.
                </p>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Kembali ke Form Masuk
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
