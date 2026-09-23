import React, { useState, useEffect } from 'react';
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
  Lock,
  Mail,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
  HelpCircle,
  Check,
  RotateCcw,
  UserCheck,
  Award,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { users, login, loginAsUser, requestPasswordReset, verifyResetCode, resetPassword } = useCoffee();

  // Mode: 'credentials' (Email & Password) vs 'quick' (Demo Role Picker)
  const [activeTab, setActiveTab] = useState<'credentials' | 'quick'>('credentials');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

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
    }, 400);
  };

  // Quick fill demo user into form
  const handleSelectDemoUser = (userEmail: string, userPass: string = 'password123') => {
    setEmail(userEmail);
    setPassword(userPass);
    setActiveTab('credentials');
    setLoginError(null);
  };

  // Step 1: Request OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    const res = requestPasswordReset(forgotEmail);
    if (res.success && res.resetCode) {
      setSimulatedOtpNotice(`Kode OTP Verifikasi Demo: ${res.resetCode}`);
      setForgotOtp(res.resetCode); // Pre-fill in demo for maximum user convenience
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
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300',
      icon: <Sprout className="w-5 h-5 text-emerald-600" />,
      duty: 'Kelola kebun & patok BPN, registrasi panen ceri lengkap dengan brix & varietas.',
      marketplaceAction: 'Menjual ceri langsung ke Pengolah (Processor)',
    },
    pengolah: {
      title: 'Pengolah (Mill Station)',
      tier: 'Tahap 2: Pengolahan (Mill)',
      color: 'hover:border-cyan-500 hover:shadow-cyan-50',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300',
      icon: <Cog className="w-5 h-5 text-cyan-600" />,
      duty: 'Beli ceri petani, fermentasi terkontrol, uji kadar air & defect green bean.',
      marketplaceAction: 'Menjual Green Bean olahan ke Gudang',
    },
    gudang: {
      title: 'Gudang (Warehouse & QA)',
      tier: 'Tahap 3: Silo Hermetik',
      color: 'hover:border-indigo-500 hover:shadow-indigo-50',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300',
      icon: <Warehouse className="w-5 h-5 text-indigo-600" />,
      duty: 'Kelola inventaris silo, kontrol suhu & RH, verifikasi mutu ekspor pre-roast.',
      marketplaceAction: 'Menjual Green Bean bergradasi ke Roaster',
    },
    roaster: {
      title: 'Roaster (Roastery ERP)',
      tier: 'Tahap 4: Penyangraian',
      color: 'hover:border-amber-500 hover:shadow-amber-50',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300',
      icon: <Flame className="w-5 h-5 text-amber-600" />,
      duty: 'Penyangraian artisan, profil Agtron, tasting notes, dan perintah produksi ERP.',
      marketplaceAction: 'Menjual Roasted Beans ke Pemilik Kafe',
    },
    cafe: {
      title: 'Pemilik Kafe (Barista & Shop)',
      tier: 'Tahap 5: Hilir (Cup & Retail)',
      color: 'hover:border-stone-600 hover:shadow-stone-50',
      badgeColor: 'bg-stone-200 text-stone-800 border-stone-400 dark:bg-stone-800 dark:text-stone-300',
      icon: <Coffee className="w-5 h-5 text-stone-700" />,
      duty: 'Pilih roasted beans berkualitas, kalkulator racikan, dan sajikan ke pelanggan.',
      marketplaceAction: 'Membeli beans dari Roastery & sajikan ke Konsumen',
    },
    verifikator: {
      title: 'Verifikator & Auditor Kualitas',
      tier: 'Dewan Audit Independen',
      color: 'hover:border-purple-500 hover:shadow-purple-50',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300',
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      duty: 'Audit sertifikasi EUDR, zero-waste mill, silo hermetik, uji cicip cangkir (cupping) SCA, dan terbitkan stempel digital.',
      marketplaceAction: 'Memberi Stempel Mutu Terverifikasi pada Rantai Pasok',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF6F0] via-[#F4EDE2] to-[#EFE7DC] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full pt-4 pb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100/90 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 px-4 py-1.5 rounded-full text-xs font-semibold mb-3 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          Platform Digital Rantai Pasok Kopi Terintegrasi & Terverifikasi
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
          Circular Coffee Trace
        </h1>
        <p className="mt-2 text-stone-600 dark:text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Autentikasi terpusat untuk <strong className="text-emerald-700 dark:text-emerald-400">Petani</strong>,{' '}
          <strong className="text-cyan-700 dark:text-cyan-400">Pengolah</strong>,{' '}
          <strong className="text-indigo-700 dark:text-indigo-400">Gudang</strong>,{' '}
          <strong className="text-amber-700 dark:text-amber-400">Roaster</strong>,{' '}
          <strong className="text-stone-800 dark:text-stone-300">Kafe</strong>, dan{' '}
          <strong className="text-purple-700 dark:text-purple-400">Dewan Verifikator Mutu</strong>.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="max-w-4xl mx-auto w-full mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-stone-200/80 dark:border-slate-800 overflow-hidden">
          {/* Top Switcher Tabs */}
          <div className="flex border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950">
            <button
              onClick={() => setActiveTab('credentials')}
              className={`flex-1 py-4 text-center text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
                activeTab === 'credentials'
                  ? 'border-amber-600 text-amber-900 dark:text-amber-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-800'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Masuk dengan Kredensial (Email & Password)</span>
            </button>
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 py-4 text-center text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
                activeTab === 'quick'
                  ? 'border-amber-600 text-amber-900 dark:text-amber-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Demo Cepat (Pilih Akun Terdaftar)</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* TAB 1: FORM LOGIN RESMI KREDENSIAL */}
            {activeTab === 'credentials' && (
              <div className="max-w-md mx-auto space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                    Masuk ke Akun Anda
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-slate-400">
                    Gunakan email dan kata sandi yang telah terdaftar di sistem.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  {/* Email input */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh: jessica.qgrader@cuppinglab.id"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Password input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 uppercase tracking-wider">
                        Kata Sandi
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setForgotModalOpen(true);
                        }}
                        className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        Lupa kata sandi?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan kata sandi akun..."
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>Ingat email saya di peramban ini</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-stone-900 to-stone-800 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                    >
                      {loginLoading ? (
                        <>
                          <RotateCcw className="w-4 h-4 animate-spin" />
                          <span>Memverifikasi Kredensial...</span>
                        </>
                      ) : (
                        <>
                          <span>Masuk ke Dashboard</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Helper hint for tester */}
                <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Kredensial Demo Cepat:
                  </div>
                  <p>
                    Semua akun menggunakan kata sandi: <strong className="font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-amber-300">password123</strong>
                  </p>
                  <p className="text-stone-500 dark:text-slate-400">
                    Contoh Verifikator Roastery: <code className="text-amber-800 dark:text-amber-400">jessica.qgrader@cuppinglab.id</code>
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: QUICK DEMO ROLE SWITCHER (ALL ROLES INCL. VERIFIKATOR) */}
            {activeTab === 'quick' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                      Pilih Akun Demo Sesuai Rantai Pasok
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-slate-400">
                      Klik salah satu akun untuk langsung masuk atau mengisi kredensial secara otomatis.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-stone-600 dark:text-slate-300 bg-stone-100 dark:bg-slate-800 px-3 py-1 rounded-full w-fit">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Role-Based Access Control
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(Object.keys(roleCardMeta) as UserRole[]).map((roleKey) => {
                    const meta = roleCardMeta[roleKey];
                    const roleUsers = users.filter((u) => u.role === roleKey);

                    return (
                      <div
                        key={roleKey}
                        className={`bg-stone-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 border-2 border-stone-200 dark:border-slate-800 ${meta.color} rounded-3xl p-5 transition-all flex flex-col justify-between shadow-xs`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-700 shadow-xs border border-stone-200 dark:border-slate-600 flex items-center justify-center">
                              {meta.icon}
                            </div>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.badgeColor}`}
                            >
                              {meta.tier}
                            </span>
                          </div>

                          <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">
                            {meta.title}
                          </h3>
                          <p className="text-[11px] text-stone-500 dark:text-slate-400 leading-relaxed mt-1 mb-3">
                            {meta.duty}
                          </p>

                          {/* Accounts List */}
                          <div className="space-y-1.5 mb-3 max-h-48 overflow-y-auto pr-0.5">
                            {roleUsers.map((u) => (
                              <div
                                key={u.id}
                                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700/80 flex items-center justify-between gap-2 text-xs hover:border-amber-400 transition-colors"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-stone-900 dark:text-white truncate">
                                    {u.name}
                                  </div>
                                  <div className="text-[10px] text-stone-500 dark:text-slate-400 truncate">
                                    {u.email || u.organization}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => loginAsUser(u.id)}
                                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-stone-900 dark:bg-slate-700 hover:bg-amber-700 text-white transition-colors shrink-0"
                                >
                                  Masuk
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="text-[10.5px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-2">
                          <span className="font-bold block">Tugas Utama:</span>
                          {meta.marketplaceAction}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MULTI-STEP MODAL */}
      {forgotModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={closeForgotModal}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-slate-800 max-w-md w-full p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto mb-2 border border-amber-200">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                Pemulihan Kata Sandi
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400">
                {forgotStep === 'email' && 'Masukkan alamat email Anda untuk menerima kode verifikasi OTP.'}
                {forgotStep === 'otp' && 'Masukkan 6-digit kode OTP yang telah dikirim ke email Anda.'}
                {forgotStep === 'new_password' && 'Buat kata sandi baru yang kuat untuk akun Anda.'}
                {forgotStep === 'success' && 'Kata sandi akun Anda berhasil diperbarui.'}
              </p>
            </div>

            {/* Error Message */}
            {forgotError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {/* Simulated OTP Notification for Demo Ease */}
            {simulatedOtpNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
                <span>{simulatedOtpNotice}</span>
                <span className="font-mono font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded border">
                  {forgotOtp}
                </span>
              </div>
            )}

            {/* Step 1: Input Email */}
            {forgotStep === 'email' && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Akun Terdaftar
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="contoh: jessica.qgrader@cuppinglab.id"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeForgotModal}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 text-xs font-bold text-stone-600 dark:text-slate-300 hover:bg-stone-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
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
                  <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Kode 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('email')}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 text-xs font-bold text-stone-600 dark:text-slate-300 hover:bg-stone-100"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
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
                  <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
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
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
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
                <p className="text-xs text-stone-600 dark:text-slate-400">
                  Kata sandi Anda telah berhasil diubah. Formulir masuk telah diisi dengan kredensial baru Anda.
                </p>
                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="w-full py-3 rounded-xl bg-stone-900 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Kembali & Masuk Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-stone-500 dark:text-slate-500 pb-2">
        <p>Circular Coffee Trace • End-to-End Traceability & Multi-Stage Quality Certification System</p>
      </footer>
    </div>
  );
};
