import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import { RegisterPaymentPlanBox } from '../../components/register/RegisterPaymentPlanBox';
import { requestSnapToken, triggerSnapCheckout } from '../../services/midtransService';
import {
  Building2,
  Sprout,
  Cog,
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
  MapPin,
  Phone,
  User,
  Layers,
  Award,
  Compass,
  CreditCard,
  Clock,
  Zap,
} from 'lucide-react';

import { InlineSandboxPaymentSection } from '../../components/register/InlineSandboxPaymentSection';

export const RegisterKelompokTaniPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPlan = searchParams.get('plan') === 'yearly' ? 'yearly' : 'monthly';
  const { registerUser, activateUserSubscription, currentUser, login } = useCoffee();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/admin/overview');
    }
  }, [currentUser, navigate]);

  // Form states
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(initialPlan);
  const [kelompokTaniName, setKelompokTaniName] = useState('');
  const [sentraRegion, setSentraRegion] = useState('');
  const [farmerCountEstimate, setFarmerCountEstimate] = useState('20 - 50');
  const [leaderName, setLeaderName] = useState('');
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
    password: string;
    name: string;
    org: string;
    orderId?: string;
    snapToken?: string;
    isPaid?: boolean;
    billingCycle?: 'monthly' | 'yearly';
    amount?: number;
    verificationToken?: string;
    verificationLink?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!kelompokTaniName.trim() || !leaderName.trim() || !sentraRegion.trim()) {
      setErrorMsg('Mohon lengkapi nama kelompok tani, wilayah kebun, dan nama ketua.');
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

    setIsSubmitting(true);
    try {
      if (registerUser) {
        const bioText = `Organisasi Kelompok Tani / Gapoktan resmi di ${sentraRegion.trim()} dengan estimasi ${farmerCountEstimate} petani binaan. Menaungi hulu perkebunan kopi, stasiun basah (wet mill), dan dewan verifikator ICS.`;
        const result = await registerUser({
          name: leaderName.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          role: 'admin_kelompok_tani',
          organization: kelompokTaniName.trim(),
          location: sentraRegion.trim(),
          phone: phone.trim() || '0812-3456-7890',
          bio: bioText,
        });

        let orderId = '';
        let snapToken = '';
        let redirectUrl = '';

        try {
          const snapRes = await requestSnapToken({
            userId: result?.user?.id,
            userEmail: email.trim().toLowerCase(),
            userName: leaderName.trim(),
            userPhone: phone.trim() || '0812-3456-7890',
            serviceRole: 'admin_kelompok_tani',
            billingCycle: billingCycle,
          });

          orderId = snapRes.orderId;
          snapToken = snapRes.snapToken;
          redirectUrl = snapRes.redirectUrl || '';
        } catch (snapErr) {
          console.warn('Gagal memproses sesi token Midtrans:', snapErr);
          orderId = `CCT-KEL-${Date.now()}`;
        }

        const calculatedAmount = billingCycle === 'yearly' ? 2500000 : 250000;

        setRegisteredData({
          email: email.trim().toLowerCase(),
          password: password,
          name: leaderName.trim(),
          org: kelompokTaniName.trim(),
          orderId: orderId,
          snapToken: snapToken,
          redirectUrl: redirectUrl,
          billingCycle: billingCycle,
          amount: calculatedAmount,
          verificationToken: result?.verificationToken,
          verificationLink: result?.verificationLink,
        });
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal melakukan pendaftaran akun Kelompok Tani.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!registeredData) return;
    try {
      if (activateUserSubscription && registeredData.email) {
        await activateUserSubscription(registeredData.email, registeredData.orderId);
      }
      try {
        sessionStorage.setItem('cct_show_welcome_modal', 'true');
      } catch (_) {}

      if (login) {
        const loginRes = login(registeredData.email, registeredData.password);
        if (loginRes.success) {
          return;
        }
      }
      navigate('/admin/overview');
    } catch (e) {
      console.error('Error on auto-login after payment:', e);
      navigate('/admin/overview');
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
            <span className="h-4 w-px bg-stone-300 hidden sm:inline-block" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-stone-900 tracking-tight hidden sm:inline">
                CircularCoffee
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Pilar Hulu Terpadu
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <span className="text-stone-500 hidden md:inline">Sudah memiliki akun?</span>
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Headline Banner */}
      <section className="w-full bg-[#07130C] text-white border-b border-stone-800 relative overflow-hidden py-10 sm:py-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bundle 3 Layanan Terpadu (Petani, Pengolah, Verifikator)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Pendaftaran Kelompok Tani / Gapoktan / Koperasi
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm lg:text-base leading-relaxed">
              Mendaftarkan organisasi induk perkebunan kopi terpadu beserta 3 pilar layanan operasional (Petani, Pengolah Wet Mill, dan Verifikator Mutu ICS).
            </p>
          </div>
        </div>
      </section>

      {/* 3. Main Form & Side Showcase Grid */}
      <main className="w-full py-8 sm:py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isSuccess && registeredData ? (
            /* Inline Midtrans Sandbox Payment Step (NO POPUPS) */
            <InlineSandboxPaymentSection
              userEmail={registeredData.email}
              userName={registeredData.name}
              organizationName={registeredData.org}
              orderId={registeredData.orderId || `CCT-KEL-${Date.now()}`}
              snapToken={registeredData.snapToken}
              redirectUrl={registeredData.redirectUrl}
              planRole="admin_kelompok_tani"
              planName="Bundle 3-in-1 Kelompok Tani"
              billingCycle={registeredData.billingCycle || 'monthly'}
              amount={registeredData.amount || 250000}
              onPaymentSuccess={handlePaymentSuccess}
              onBackToForm={() => setIsSuccess(false)}
            />
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

                {/* Bundle Callout Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 text-emerald-950 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Bundle 3 Layanan Termasuk Otomatis</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Dengan mendaftarkan Kelompok Tani, akun Anda otomatis memiliki hak mengalokasikan akun bagi <strong>Petani anggota kebun</strong>, <strong>Operator stasiun basah/mill</strong>, dan <strong>Petugas verifikator ICS</strong> melalui panel admin Anda.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E6DFD5] shadow-xs p-6 sm:p-8 space-y-5">
                  <div className="pb-3 border-b border-stone-100">
                    <h2 className="text-base sm:text-lg font-black text-stone-900">
                      Formulir Registrasi Kelompok Tani
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Lengkapi data kelembagaan tani dan kontak resmi pengurus.
                    </p>
                  </div>

                  {/* 1. Nama Kelompok Tani */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Nama Kelompok Tani / Koperasi / Gapoktan <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={kelompokTaniName}
                        onChange={(e) => setKelompokTaniName(e.target.value)}
                        placeholder="e.g. Gapoktan Kopi Mandiri Nusantara"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* 2. Wilayah Sentra Kebun */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Wilayah Sentra Kebun (Kecamatan, Kabupaten, Provinsi) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={sentraRegion}
                        onChange={(e) => setSentraRegion(e.target.value)}
                        placeholder="e.g. Pangalengan, Kab. Bandung, Jawa Barat"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* 3. Estimasi Petani Binaan Awal */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Perkiraan Jumlah Petani Binaan Awal
                    </label>
                    <div className="relative">
                      <Layers className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <select
                        value={farmerCountEstimate}
                        onChange={(e) => setFarmerCountEstimate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all font-medium appearance-none cursor-pointer"
                      >
                        <option value="< 20">&lt; 20 Petani Anggota</option>
                        <option value="20 - 50">20 - 50 Petani Anggota (Rekomendasi Awal)</option>
                        <option value="50 - 100">50 - 100 Petani Anggota</option>
                        <option value="> 100">&gt; 100 Petani Anggota (Skala Gapoktan Besar)</option>
                      </select>
                    </div>
                  </div>

                  {/* 4. Nama Ketua & WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Nama Lengkap Ketua / Pengurus <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={leaderName}
                          onChange={(e) => setLeaderName(e.target.value)}
                          placeholder="e.g. H. Dedi Suryadi"
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all font-medium"
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
                          placeholder="e.g. 0812-3456-7890"
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Email Resmi */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Alamat Email Resmi Organisasi <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. gapoktan.mandiri@circulartrace.id"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* 6. Kata Sandi & Konfirmasi */}
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
                          className="w-full pl-10 pr-10 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all font-medium"
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
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 7. Pilihan Siklus Pembayaran & Midtrans Plan Box */}
                  <div className="pt-2">
                    <RegisterPaymentPlanBox
                      role="admin_kelompok_tani"
                      billingCycle={billingCycle}
                      onChangeCycle={setBillingCycle}
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mempersiapkan Pembayaran Midtrans...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Daftar &amp; Bayar Sekarang (Midtrans Snap)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-stone-500 text-center mt-2.5">
                      Transaksi diproses langsung secara instan &amp; aman melalui <strong>Midtrans Sandbox</strong>.
                    </p>
                  </div>
                </form>
              </div>

              {/* RIGHT COLUMN: RANGKUMAN FITUR & VALUE ADDED (5 OF 12) */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-white rounded-2xl border border-[#E6DFD5] shadow-xs p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-stone-900">
                        Apa yang Anda Dapatkan?
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Solusi terintegrasi tanpa perlu berlangganan terpisah
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {/* Unit 1: Petani */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                        <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>1. Unit Petani Kopi (Farmer Management)</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed pl-6">
                        Pendataan profil petani, luas hektar, poligon batas kebun anti-deforestasi EUDR, dan pencatatan panen ceri petik merah.
                      </p>
                    </div>

                    {/* Unit 2: Pengolah */}
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                        <Cog className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>2. Unit Pengolah (Wet Mill &amp; Fermentasi)</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed pl-6">
                        Penerimaan ceri, 7 metode olah/fermentasi, pencatatan rendemen &amp; pengelolaan limbah sirkular bernilai ekonomi.
                      </p>
                    </div>

                    {/* Unit 3: Verifikator */}
                    <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-950">
                        <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>3. Unit Verifikator Mutu (ICS Internal)</span>
                      </div>
                      <p className="text-[11px] text-purple-800 leading-relaxed pl-6">
                        Tim audit internal kebun, uji brix ceri di pohon, inspeksi GAP, dan penerbitan stempel resmi mutu kelompok tani.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust Card */}
                <div className="bg-stone-900 text-stone-200 rounded-2xl p-5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Award className="w-4 h-4" />
                    <span>Kepatuhan Regulasi Ekspor Internasional</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Setiap lot kopi yang dipanen oleh kelompok tani Anda terverifikasi koordinat GPS poligon kebun untuk memenuhi standar anti-deforestasi EUDR Uni Eropa 2023/1115.
                  </p>
                  <div className="pt-1 flex items-center gap-2 text-[11px] text-stone-400">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Geofencing &amp; Kriptografi SHA-256 Otomatis</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default RegisterKelompokTaniPage;
