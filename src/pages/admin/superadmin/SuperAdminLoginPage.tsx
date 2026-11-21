import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCoffee } from '../../../context/CoffeeContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Package,
  Layers,
  AlertCircle,
  Loader2,
  Crown,
  ChevronLeft,
} from 'lucide-react';

export const SuperAdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, login } = useCoffee();

  // If already logged in as super_admin, redirect to package dashboard
  useEffect(() => {
    if (currentUser?.role === 'super_admin') {
      navigate('/admin/superadmin/packages', { replace: true });
    }
  }, [currentUser, navigate]);

  const [email, setEmail] = useState('superadmin@circulartrace.id');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const res = login(email.trim(), password, rememberMe);
        setLoading(false);
        if (res.success && res.user) {
          if (res.user.role === 'super_admin') {
            navigate('/admin/superadmin/packages', { replace: true });
          } else {
            navigate('/admin/overview', { replace: true });
          }
        } else {
          setErrorMsg(res.message || 'Kredensial Super Admin tidak valid.');
        }
      } catch (err: any) {
        setLoading(false);
        setErrorMsg(err?.message || 'Terjadi kesalahan sistem saat otentikasi.');
      }
    }, 350);
  };

  const handleInstantBypass = () => {
    setEmail('superadmin@circulartrace.id');
    setPassword('password123');
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      const res = login('superadmin@circulartrace.id', 'password123', true);
      setLoading(false);
      if (res.success) {
        navigate('/admin/superadmin/packages', { replace: true });
      } else {
        setErrorMsg(res.message || 'Gagal login instan.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col lg:flex-row text-stone-900 selection:bg-amber-600 selection:text-white">
      {/* ============================================================== */}
      {/* COLUMN 1: EXECUTIVE HERO & ARCHITECTURE SHOWCASE (LEFT)        */}
      {/* ============================================================== */}
      <div className="relative lg:w-[52%] xl:w-[56%] min-h-[480px] sm:min-h-[540px] lg:min-h-screen bg-stone-950 flex flex-col justify-between overflow-hidden p-6 sm:p-10 lg:p-12 select-none">
        {/* Background Image: Specialty Roastery & Coffee Quality Lab */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-3000 scale-102"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1600&auto=format&fit=crop&q=85')`,
          }}
        />

        {/* Ambient Warm Coffee & Obsidian Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/98 via-stone-950/80 to-stone-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/40 to-transparent" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header / Executive Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>CircularCoffee</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 uppercase tracking-wider">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Pusat Kendali Eksekutif &amp; Tata Kelola SaaS Multi-Tenant
              </p>
            </div>
          </Link>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-stone-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Root Master Access</span>
          </div>
        </div>

        {/* Center: Mission & Capability Highlights */}
        <div className="relative z-10 my-auto py-8 max-w-xl">
          {/* Badge & Category */}
          <div className="flex items-center gap-2 mb-3.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Platform Owner &amp; Commercial Governance</span>
            </span>
            <span className="text-xs text-stone-400 font-medium hidden sm:inline">
              Tingkat Akses Tertinggi
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mb-3">
            Otoritas Terpusat Rantai Pasok Kopi Terintegrasi
          </h1>

          {/* Description */}
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6">
            Kelola model monetisasi paket langganan komersial, batas kuota pengguna, serta pantau integritas pelacakan Farm-to-Cup dan kepatuhan standar audit EUDR di seluruh jaringan ekosistem kopi.
          </p>

          {/* 3 Executive Architecture Capability Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-stone-200 space-y-1 shadow-xs hover:bg-white/15 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1.5">
                <Package className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-white">5 Paket Layanan SaaS</h2>
              <p className="text-[11px] text-stone-400 leading-snug">
                Starter hingga Enterprise dengan skema billing bulanan &amp; tahunan.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-stone-200 space-y-1 shadow-xs hover:bg-white/15 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-white">9 Peran Stakeholder</h2>
              <p className="text-[11px] text-stone-400 leading-snug">
                Isolasi ruang kerja Petani, Mill, Gudang, Roaster, Kafe, hingga Buyer.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-stone-200 space-y-1 shadow-xs hover:bg-white/15 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-white">Audit &amp; EUDR Validated</h2>
              <p className="text-[11px] text-stone-400 leading-snug">
                Verifikasi poligon geolokasi kebun dan skor kepatuhan bebas deforestasi.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Platform Status Indicators */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-stone-300">Cluster Node: Online &amp; Terenkripsi</span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>Engine: SQLite 3.45</span>
            <span>•</span>
            <span>Enkripsi: TLS 1.3 / AES-256</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* COLUMN 2: EXECUTIVE WORKSTATION AUTHENTICATION (RIGHT)         */}
      {/* ============================================================== */}
      <div className="lg:w-[48%] xl:w-[44%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[#FAF7F2]">
        {/* Top Header Links */}
        <div className="flex items-center justify-between pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-amber-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Marketplace Publik</span>
          </Link>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Root Credential
          </span>
        </div>

        {/* Center: Main Authentication Workstation Card */}
        <div className="my-auto max-w-md w-full mx-auto py-4">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-bold mb-3 shadow-2xs">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Portal Administrator Utama</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Konsol Super Admin
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              Otentikasi kredensial eksekutif pengelola platform CircularCoffee untuk mengontrol paket layanan, lisensi, dan manajemen konsorsium.
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1-Click Instant Master Bypass Card */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300/80 text-stone-800 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                Pintas Akses Cepat (1-Klik):
              </span>
              <span className="text-[10px] font-bold bg-amber-200/80 text-amber-950 border border-amber-300 px-2 py-0.5 rounded-full">
                Auto-Login
              </span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Langsung masuk ke panel manajemen paket layanan SaaS dengan kredensial master terverifikasi:
            </p>

            <button
              type="button"
              onClick={handleInstantBypass}
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 hover:from-amber-700 to-amber-700 hover:to-amber-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengautentikasi Sesi Master...</span>
                </>
              ) : (
                <>
                  <span>⚡ Masuk Cepat ke Konsol SaaS (1-Klik)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-stone-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Atau Masuk dengan Kredensial Manual
            </span>
            <div className="flex-1 h-px bg-stone-300" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input Email */}
            <div>
              <label
                htmlFor="superadmin-email"
                className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5"
              >
                Alamat Email Master
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  id="superadmin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@circulartrace.id"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-2xs font-mono"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="superadmin-password"
                  className="block text-xs font-bold text-stone-800 uppercase tracking-wider"
                >
                  Kata Sandi Master
                </label>
                <span className="text-[11px] text-stone-500 font-mono">
                  Default: password123
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  id="superadmin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi master..."
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-2xs font-mono"
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
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 border-stone-300 cursor-pointer"
                />
                <span>Ingat sesi master ini di peramban ini</span>
              </label>

              <span className="text-[11px] text-stone-400 font-mono font-medium">
                ID: user-super-admin
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses Otorisasi...</span>
                  </>
                ) : (
                  <>
                    <span>Otorisasi &amp; Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Credential Reference Card */}
          <div className="mt-6 p-4 rounded-2xl bg-stone-100/90 border border-stone-200 text-[11px] text-stone-600 space-y-2">
            <div className="font-bold text-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Kredensial Resmi Super Admin:</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Akses Penuh
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-stone-700">
              <div className="bg-white p-2 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Email Akun:</span>
                <span className="font-bold text-stone-900 select-all">superadmin@circulartrace.id</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Kata Sandi:</span>
                <span className="font-bold text-stone-900 select-all">password123</span>
              </div>
            </div>
            <p className="text-[10px] text-stone-500 pt-1 leading-relaxed border-t border-stone-200/80">
              Setelah masuk, Anda akan diarahkan ke konsol konfigurasi paket layanan SaaS di <span className="font-mono text-amber-800 font-semibold">/admin/superadmin/packages</span>.
            </p>
          </div>

          {/* Alternate Navigation */}
          <div className="mt-5 pt-4 border-t border-stone-200 text-center space-y-2 text-xs">
            <div>
              <span className="text-stone-600">Bukan pengelola Super Admin? </span>
              <Link
                to="/login"
                className="font-bold text-amber-700 hover:text-amber-800 hover:underline"
              >
                Masuk sebagai Stakeholder (Petani, Roaster, Kafe) &rarr;
              </Link>
            </div>
            <div>
              <Link
                to="/register"
                className="text-stone-500 hover:text-stone-700 hover:underline text-[11px]"
              >
                Daftar Akun Baru
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-stone-200 text-center text-xs text-stone-500">
          <p>&copy; 2026 CircularCoffee • Platform Rantai Pasok Kopi Terintegrasi Farm-to-Cup</p>
        </div>
      </div>
    </div>
  );
};

