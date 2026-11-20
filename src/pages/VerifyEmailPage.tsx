import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useCoffee } from '../context/CoffeeContext';
import { AppUser } from '../types/coffee';
import { ROLE_DETAILS } from '../constants/roles';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Mail,
  Home,
  LogIn,
  Sparkles,
} from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmailToken } = useCoffee();

  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState<string>('Memvalidasi token verifikasi...');
  const [verifiedUser, setVerifiedUser] = useState<AppUser | null>(null);
  const [countdown, setCountdown] = useState<number>(4);

  useEffect(() => {
    let isMounted = true;

    if (!token) {
      setStatus('error');
      setMessage('Token verifikasi tidak ditemukan. Pastikan Anda mengklik tautan lengkap dari email Anda.');
      return;
    }

    const executeVerification = async () => {
      try {
        const result = await verifyEmailToken(token);
        if (!isMounted) return;

        if (result.success) {
          setStatus('success');
          setMessage(result.message || 'Alamat email Anda berhasil diverifikasi!');
          if (result.user) {
            setVerifiedUser(result.user);
          }
        } else {
          setStatus('error');
          setMessage(result.message || 'Token verifikasi tidak valid atau telah kedaluwarsa.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        setStatus('error');
        setMessage(err?.message || 'Terjadi kesalahan sistem saat memverifikasi email.');
      }
    };

    executeVerification();

    return () => {
      isMounted = false;
    };
  }, [token, verifyEmailToken]);

  // Handle countdown & auto-redirect on success
  useEffect(() => {
    if (status !== 'success') return;

    if (countdown <= 0) {
      handleGoToDashboard();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status, countdown]);

  const handleGoToDashboard = () => {
    if (verifiedUser?.role === 'admin_kelompok_tani') {
      navigate('/admin/overview');
    } else if (verifiedUser?.role === 'roaster') {
      navigate('/admin/roaster/inventory');
    } else if (verifiedUser?.role === 'gudang') {
      navigate('/admin/gudang/inventory');
    } else if (verifiedUser?.role === 'pengolah') {
      navigate('/admin/pengolah');
    } else if (verifiedUser?.role === 'cafe') {
      navigate('/admin/cafe');
    } else if (verifiedUser?.role === 'petani') {
      navigate('/admin/petani');
    } else if (verifiedUser?.role === 'verifikator') {
      navigate('/admin/verifikator');
    } else if (verifiedUser?.role === 'ict') {
      navigate('/admin/ict');
    } else {
      navigate('/admin/overview');
    }
  };

  const roleLabel = verifiedUser ? ROLE_DETAILS[verifiedUser.role]?.label || verifiedUser.role : '';

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between text-stone-900">
      {/* Top branding bar */}
      <div className="bg-[#1C120C] text-stone-200 border-b border-amber-950/40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-white text-base tracking-tight block">
                CircularCoffee
              </span>
              <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-medium">
                Email Authentication Portal
              </span>
            </div>
          </Link>

          <Link
            to="/login"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            Ke Halaman Login
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Card Top Banner */}
          <div className="bg-gradient-to-br from-stone-900 to-[#1C120C] p-6 text-white text-center relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Sistem Otentikasi Terpadu
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Aktivasi Akun CircularCoffee
            </h1>
            <p className="text-xs text-stone-300 mt-1">
              Verifikasi kepemilikan email untuk menjamin keamanan rantai pasok digital.
            </p>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8">
            {status === 'verifying' && (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-stone-900">
                    Memvalidasi Token Verifikasi...
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Mohon tunggu beberapa saat selagi kami memverifikasi token dan menyiapkan sesi login Anda.
                  </p>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="py-4 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Verifikasi Realtime Berhasil
                  </span>
                  <h2 className="text-2xl font-black text-stone-900 mt-2">
                    Akun Anda Berhasil Aktif!
                  </h2>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                    {message}
                  </p>
                </div>

                {/* Verified User Details Card */}
                {verifiedUser && (
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left space-y-2.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={verifiedUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={verifiedUser.name}
                        className="w-11 h-11 rounded-full object-cover border border-amber-500/30"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-stone-900 truncate">
                          {verifiedUser.name}
                        </div>
                        <div className="text-xs text-stone-500 flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{verifiedUser.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-bold uppercase">Peran / Role</span>
                        <span className="font-bold text-amber-900 capitalize">{roleLabel}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block font-bold uppercase">Organisasi / Usaha</span>
                        <span className="font-bold text-stone-800 truncate block">
                          {verifiedUser.organization || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleGoToDashboard}
                    className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 transition-all cursor-pointer"
                  >
                    <span>Masuk ke Dashboard Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-stone-500">
                    Mengalihkan otomatis dalam <span className="font-bold text-amber-700">{countdown}</span> detik...
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="py-4 text-center space-y-6">
                <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50 animate-in zoom-in duration-300">
                  <AlertCircle className="w-10 h-10 stroke-[2.5]" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                    Aktivasi Gagal
                  </span>
                  <h2 className="text-2xl font-black text-stone-900 mt-2">
                    Tautan Tidak Valid atau Kedaluwarsa
                  </h2>
                  <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3 max-w-sm mx-auto leading-relaxed">
                    {message}
                  </p>
                </div>

                <div className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                  Tautan aktivasi berlaku selama 24 jam sejak email dikirimkan demi keamanan akun Anda. Silakan login jika akun sudah aktif sebelumnya, atau lakukan registrasi ulang.
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/"
                    className="py-3 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Beranda</span>
                  </Link>

                  <Link
                    to="/login"
                    className="py-3 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-900/10 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Ke Halaman Login</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="text-center text-xs text-stone-400 py-6 border-t border-stone-200">
        Circular Coffee Traceability Platform © {new Date().getFullYear()} — Dilengkapi Kepatuhan EUDR &amp; Standar SCA
      </div>
    </div>
  );
};
