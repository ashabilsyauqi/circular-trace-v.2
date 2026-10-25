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
} from 'lucide-react';
import { RegisterModal } from './RegisterModal';

export const LoginPage: React.FC = () => {
  const {
    login,
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
    setActiveView,
  } = useCoffee();

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Credentials Login State
  const [emailInput, setEmailInput] = useState<string>(() => {
    return localStorage.getItem('cct_rememberedEmail') || '';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState<boolean>(false);
  const [resetStep, setResetStep] = useState<'request_email' | 'verify_otp' | 'new_password' | 'done'>('request_email');
  const [resetEmail, setResetEmail] = useState<string>('');
  const [generatedOtpCode, setGeneratedOtpCode] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [resetStatusMsg, setResetStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(
    null
  );

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);

    if (!emailInput.trim()) {
      setLoginError('Mohon masukkan alamat email akun Anda.');
      return;
    }
    if (!passwordInput) {
      setLoginError('Mohon masukkan kata sandi Anda.');
      return;
    }

    const res = login(emailInput, passwordInput, rememberMe);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setLoginSuccess(res.message);
    }
  };

  const openForgotModal = () => {
    setResetEmail(emailInput || 'asep@petani.id');
    setResetStep('request_email');
    setGeneratedOtpCode('');
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
    setGeneratedOtpCode(res.resetCode || '');
    setOtpInput(res.resetCode || '');
    setResetStatusMsg({
      type: 'success',
      text: `${res.message} Kode OTP: ${res.resetCode}`,
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

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FAF8F5] text-[#1C1410]">
      {/* ===================================================================== */}
      {/* COLUMN 1 (LEFT): MINIMALIST EDITORIAL SPECIALTY COFFEE HERO           */}
      {/* ===================================================================== */}
      <div className="relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-[#160F0B] text-[#FAF8F5] overflow-hidden min-h-[380px] lg:min-h-screen">
        {/* Atmospheric Specialty Coffee Photography */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&auto=format&fit=crop&q=85')",
          }}
        />
        {/* Smooth Espresso Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120B07] via-[#160F0B]/70 to-[#120B07]/50 pointer-events-none" />

        {/* Top Navigation: Minimal Brand & Back Link */}
        <div className="relative z-10 flex items-center justify-between">
          <div
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#C89D66]/20 border border-[#C89D66]/40 flex items-center justify-center backdrop-blur-xs">
              <Coffee className="w-4 h-4 text-[#E5C185]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg font-semibold tracking-tight text-white">
                sangrAI
              </span>
              <span className="text-[11px] tracking-widest uppercase text-[#C89D66]">
                Circular Trace
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveView('landing')}
            className="inline-flex items-center gap-2 text-xs text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </button>
        </div>

        {/* Bottom Editorial Typography */}
        <div className="relative z-10 max-w-lg space-y-6 pt-16 lg:pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#C89D66]" />
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#E5C185]">
                Origin to Cup Ecosystem
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight leading-[1.18] text-white">
              Ketertelusuran Kopi Specialty, dari Hulu ke Cangkir.
            </h1>

            <p className="text-sm sm:text-base text-stone-300/85 font-light leading-relaxed">
              Satu ekosistem terpadu yang menghubungkan kebun, prosesor pascapanen, gudang kualitas, roastery, dan kafe secara transparan.
            </p>
          </div>

          {/* Minimalist Horizontal Supply Chain Strip */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
            <div className="flex flex-wrap items-center gap-2.5 tracking-wide text-[11px] text-stone-300/90">
              <span>Kebun</span>
              <span className="text-[#C89D66]">&bull;</span>
              <span>Pengolah</span>
              <span className="text-[#C89D66]">&bull;</span>
              <span>Gudang QA</span>
              <span className="text-[#C89D66]">&bull;</span>
              <span>Roastery</span>
              <span className="text-[#C89D66]">&bull;</span>
              <span>Kafe</span>
              <span className="text-[#C89D66]">&bull;</span>
              <span>Verifikator</span>
            </div>
            <span className="text-[11px] text-stone-500">&copy; 2026 sangrAI</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* COLUMN 2 (RIGHT): CLEAN MODERN MINIMALIST LOGIN FORM                  */}
      {/* ===================================================================== */}
      <div className="flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-20 bg-[#FAF8F5]">
        <div className="w-full max-w-[380px] space-y-8">
          {/* Minimalist Form Heading */}
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#1C1410]">
              Masuk ke Akun
            </h2>
            <p className="text-sm text-stone-500">
              Masukkan email dan kata sandi stasiun kerja Anda.
            </p>
          </div>

          {/* Error Alert */}
          {loginError && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                loginError.includes('menunggu persetujuan')
                  ? 'bg-amber-50/90 border-amber-300 text-amber-900'
                  : 'bg-red-50/80 border-red-200/80 text-red-800'
              }`}
            >
              <AlertCircle
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  loginError.includes('menunggu persetujuan') ? 'text-amber-600' : 'text-red-600'
                }`}
              />
              <span className="leading-relaxed">{loginError}</span>
            </div>
          )}

          {/* Success Alert */}
          {loginSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{loginSuccess}</span>
            </div>
          )}

          {/* Main Credentials Form */}
          <form onSubmit={handleCredentialLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-700">
                Username atau Email
              </label>
              <input
                type="text"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Username atau nama@organisasi.id"
                className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200/90 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-[#2C1810] focus:ring-1 focus:ring-[#2C1810] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-stone-700">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={openForgotModal}
                  className="text-xs text-stone-500 hover:text-[#2C1810] transition-colors cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-white border border-stone-200/90 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-[#2C1810] focus:ring-1 focus:ring-[#2C1810] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                  title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-stone-300 text-[#23140D] focus:ring-[#23140D]"
                />
                <span className="text-xs text-stone-600">Ingat saya</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-xl bg-[#23140D] hover:bg-[#362015] text-[#FAF8F5] font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs group"
            >
              <span>Masuk</span>
              <ArrowRight className="w-4 h-4 text-[#C89D66] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Quick Demo Credentials Bar for Testing */}
          <div className="pt-3 border-t border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                ⚡ Akun Uji Coba (Klik untuk Isi Cepat):
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setEmailInput('verifikator@circulartrace.com');
                  setPasswordInput('password123');
                }}
                className="p-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-semibold text-left transition-all cursor-pointer flex items-center justify-between group"
                title="Login sebagai Auditor / Verifikator"
              >
                <div>
                  <span className="block text-[11px] font-black text-amber-950">🛡️ Verifikator (Audit)</span>
                  <span className="block text-[10px] text-amber-800 font-mono">verifikator</span>
                </div>
                <span className="text-[10px] text-amber-600 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmailInput('petani@circulartrace.com');
                  setPasswordInput('password123');
                }}
                className="p-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-semibold text-left transition-all cursor-pointer flex items-center justify-between group"
                title="Login sebagai Petani Kopi"
              >
                <div>
                  <span className="block text-[11px] font-black text-emerald-900">🌱 Petani (Kebun)</span>
                  <span className="block text-[10px] text-emerald-700 font-mono">petani</span>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmailInput('pengolah@circulartrace.com');
                  setPasswordInput('password123');
                }}
                className="p-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-950 font-semibold text-left transition-all cursor-pointer flex items-center justify-between group"
                title="Login sebagai Stasiun Pengolah (Mill)"
              >
                <div>
                  <span className="block text-[11px] font-black text-amber-900">⚙️ Pengolah (Mill)</span>
                  <span className="block text-[10px] text-amber-700 font-mono">pengolah</span>
                </div>
                <span className="text-[10px] text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmailInput('gudang@circulartrace.com');
                  setPasswordInput('password123');
                }}
                className="p-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-950 font-semibold text-left transition-all cursor-pointer flex items-center justify-between group"
                title="Login sebagai Gudang & Logistik"
              >
                <div>
                  <span className="block text-[11px] font-black text-blue-900">🏢 Gudang (Logistik)</span>
                  <span className="block text-[10px] text-blue-700 font-mono">gudang</span>
                </div>
                <span className="text-[10px] text-blue-500 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmailInput('roaster@circulartrace.com');
                  setPasswordInput('password123');
                }}
                className="p-2 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-950 font-semibold text-left transition-all cursor-pointer flex items-center justify-between group"
                title="Login sebagai Roaster"
              >
                <div>
                  <span className="block text-[11px] font-black text-orange-900">🔥 Roaster (Sangrai)</span>
                  <span className="block text-[10px] text-orange-700 font-mono">roaster</span>
                </div>
                <span className="text-[10px] text-orange-500 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmailInput('cafe@circulartrace.com');
                  setPasswordInput('password123');
                }}
                className="p-2 rounded-xl border border-stone-200 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold text-left transition-all cursor-pointer flex items-center justify-between group"
                title="Login sebagai Kafe & Barista"
              >
                <div>
                  <span className="block text-[11px] font-black text-stone-900">☕ Kafe (Seduh)</span>
                  <span className="block text-[10px] text-stone-600 font-mono">cafe</span>
                </div>
                <span className="text-[10px] text-stone-500 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </div>
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setEmailInput('novizar@circulartrace.com');
                  setPasswordInput('@Circulartrace2026#');
                }}
                className="text-[11px] text-stone-500 hover:text-amber-800 underline underline-offset-2 cursor-pointer font-medium"
              >
                👑 Isi Kredensial Super Admin (Novizar)
              </button>
            </div>
          </div>

          {/* Minimalist Footer Links */}
          <div className="pt-4 border-t border-stone-200/70 flex flex-col items-center gap-3 text-xs text-stone-500">
            <p>
              Belum memiliki akun mitra?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="font-semibold text-[#23140D] hover:underline underline-offset-4 cursor-pointer"
              >
                Daftar sekarang
              </button>
            </p>
            <div className="flex items-center gap-4 text-[11px] text-stone-400">
              <button
                type="button"
                onClick={() => setActiveView('marketplace')}
                className="hover:text-stone-700 transition-colors cursor-pointer"
              >
                Lihat Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FORGOT PASSWORD MODAL                                                 */}
      {/* ===================================================================== */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200/80 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif font-semibold text-lg text-stone-900">Pemulihan Kata Sandi</h3>
                <p className="text-xs text-stone-500 mt-0.5">Verifikasi kode OTP akun Anda</p>
              </div>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-medium px-2 py-1"
              >
                Tutup
              </button>
            </div>

            {resetStatusMsg && (
              <div
                className={`p-3 rounded-xl text-xs border ${
                  resetStatusMsg.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : resetStatusMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-stone-50 border-stone-200 text-stone-800'
                }`}
              >
                {resetStatusMsg.text}
              </div>
            )}

            {resetStep === 'request_email' && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Email Terdaftar
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="nama@organisasi.id"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-[#2C1810]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#23140D] hover:bg-[#362015] text-white font-medium text-xs cursor-pointer transition-colors"
                >
                  Kirim Kode Verifikasi
                </button>
              </form>
            )}

            {resetStep === 'verify_otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Kode OTP 6-Digit
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-center font-mono text-base font-semibold tracking-widest focus:outline-hidden focus:border-[#2C1810]"
                  />
                  {generatedOtpCode && (
                    <p className="text-[11px] text-stone-500 mt-1.5">
                      Kode OTP: <strong className="font-mono text-stone-800">{generatedOtpCode}</strong>
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#23140D] hover:bg-[#362015] text-white font-medium text-xs cursor-pointer transition-colors"
                >
                  Verifikasi Kode
                </button>
              </form>
            )}

            {resetStep === 'new_password' && (
              <form onSubmit={handleSaveNewPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">Kata Sandi Baru</label>
                  <input
                    type="password"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-[#2C1810]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">Konfirmasi Kata Sandi</label>
                  <input
                    type="password"
                    required
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-[#2C1810]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#23140D] hover:bg-[#362015] text-white font-medium text-xs cursor-pointer transition-colors"
                >
                  Simpan Kata Sandi
                </button>
              </form>
            )}

            {resetStep === 'done' && (
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#23140D] text-white font-medium text-xs cursor-pointer"
              >
                Kembali ke Login
              </button>
            )}
          </div>
        </div>
      )}

      {/* Register Modal */}
      <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </div>
  );
};
