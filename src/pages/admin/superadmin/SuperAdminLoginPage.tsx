import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCoffee } from '../../../context/CoffeeContext';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Building2,
  Package,
  Layers,
  Home,
  LogIn,
  AlertCircle,
  Loader2,
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

    try {
      const res = login(email.trim(), password, rememberMe);
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
      setErrorMsg(err?.message || 'Terjadi kesalahan sistem saat otentikasi.');
    } finally {
      setLoading(false);
    }
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
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0C0806] text-stone-100 flex flex-col justify-between selection:bg-purple-600 selection:text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-700/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-900/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="border-b border-purple-950/60 bg-[#120B08]/80 backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-amber-600 p-0.5 shadow-lg shadow-purple-900/30">
              <div className="w-full h-full bg-[#120B08] rounded-[14px] flex items-center justify-center text-purple-400 group-hover:text-amber-400 transition-colors">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight">
                  CircularCoffee
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-purple-950 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-md">
                  Super Admin
                </span>
              </div>
              <span className="text-[11px] text-stone-400 font-medium block">
                Platform Owner &amp; Commercial Executive Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 font-bold"
            >
              <LogIn className="w-3.5 h-3.5 text-stone-400" />
              <span>Login Publik</span>
            </Link>
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 font-bold"
            >
              <Home className="w-3.5 h-3.5 text-amber-500" />
              <span>Beranda</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-lg bg-[#160E0A] rounded-3xl border border-purple-900/40 shadow-2xl shadow-purple-950/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-purple-950/50 via-[#1C120C] to-[#120B08] border-b border-purple-950/60 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/50 text-purple-300 text-xs font-bold mb-3 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Khusus Pemilik &amp; Pengelola Platform CircularTrace</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Konsol Eksekutif Super Admin</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-stone-400 leading-relaxed">
              Akses kendali penuh paket langganan komersial SaaS, lisensi modul ekosistem, penetapan tarif, dan manajemen akun stakeholder hulu-hilir.
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-950/60 border border-red-800/80 rounded-2xl flex items-start gap-3 text-xs text-red-200 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick 1-Click Access Button */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-purple-900/40 to-amber-950/30 border border-purple-700/50 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Pintas Akses Cepat (1-Klik):
                </span>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-md">
                  Root Admin
                </span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Langsung masuk ke panel Super Admin menggunakan kredensial master terverifikasi:
              </p>
              <button
                type="button"
                onClick={handleInstantBypass}
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 hover:from-purple-500 to-amber-600 hover:to-amber-500 active:from-purple-700 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Mengautentikasi Sesi...</span>
                  </>
                ) : (
                  <>
                    <span>⚡ Masuk Cepat ke Konsol SaaS (Auto-Login)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-stone-800"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                Atau Masuk Manual
              </span>
              <div className="flex-1 h-px bg-stone-800"></div>
            </div>

            {/* Standard Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  Alamat Email Master *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="superadmin@circulartrace.id"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0F0A07] border border-stone-800 text-xs sm:text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  Kata Sandi Akses *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#0F0A07] border border-stone-800 text-xs sm:text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-stone-400 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-stone-700 bg-stone-900 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <span>Ingat sesi master ini</span>
                </label>

                <span className="text-[11px] text-purple-400 font-medium">
                  ID: user-super-admin
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Memproses Autentikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Otorisasi &amp; Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Credential summary card for reference */}
            <div className="p-3.5 rounded-xl bg-[#0F0A07] border border-stone-800/80 text-[11px] text-stone-400 space-y-1.5 font-mono">
              <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-500">
                Informasi Akses Super Admin:
              </div>
              <div className="flex items-center justify-between">
                <span>Email:</span>
                <span className="text-amber-400 font-bold">superadmin@circulartrace.id</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Kata Sandi:</span>
                <span className="text-amber-400 font-bold">password123</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Dasbor Tujuan:</span>
                <span className="text-purple-300">/admin/superadmin/packages</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-950/60 bg-[#120B08]/80 py-4 text-center text-xs text-stone-500 relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CircularTrace Platform Owner Console © {new Date().getFullYear()}</span>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Sesi Terenkripsi End-to-End
            </span>
            <span>•</span>
            <span>Root Master Access Level</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
