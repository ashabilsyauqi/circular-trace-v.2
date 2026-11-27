import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import { RegisterPaymentPlanBox } from '../../components/register/RegisterPaymentPlanBox';
import { requestSnapToken, triggerSnapCheckout } from '../../services/midtransService';
import {
  Warehouse,
  Thermometer,
  FileCheck,
  Truck,
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
  Scale,
  ShieldCheck,
  PackageCheck,
  CreditCard,
  Clock,
  Zap,
} from 'lucide-react';

import { InlineSandboxPaymentSection } from '../../components/register/InlineSandboxPaymentSection';

export const RegisterGudangPage: React.FC = () => {
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
  const [warehouseName, setWarehouseName] = useState('');
  const [location, setLocation] = useState('');
  const [capacityTon, setCapacityTon] = useState('50');
  const [managerName, setManagerName] = useState('');
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
    redirectUrl?: string;
    isPaid?: boolean;
    billingCycle?: 'monthly' | 'yearly';
    amount?: number;
    verificationToken?: string;
    verificationLink?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!warehouseName.trim() || !managerName.trim() || !location.trim()) {
      setErrorMsg('Mohon lengkapi nama gudang, lokasi, dan nama kepala gudang / QC.');
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
        const bioText = `Fasilitas pergudangan dan kontrol mutu green bean ${warehouseName.trim()} di ${location.trim()}. Kapasitas penyimpanan sekitar ${capacityTon} Ton dengan standar hermetik & grading SCA.`;
        const result = await registerUser({
          name: managerName.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          role: 'gudang',
          organization: warehouseName.trim(),
          location: location.trim(),
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
            userName: managerName.trim(),
            userPhone: phone.trim() || '0812-3456-7890',
            serviceRole: 'gudang',
            billingCycle: billingCycle,
          });

          orderId = snapRes.orderId;
          snapToken = snapRes.snapToken;
          redirectUrl = snapRes.redirectUrl || '';
        } catch (snapErr) {
          console.warn('Gagal memproses sesi token Midtrans:', snapErr);
          orderId = `CCT-GDG-${Date.now()}`;
        }

        const calculatedAmount = billingCycle === 'yearly' ? 4500000 : 450000;

        setRegisteredData({
          email: email.trim().toLowerCase(),
          password: password,
          name: managerName.trim(),
          org: warehouseName.trim(),
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
      setErrorMsg(err?.message || 'Gagal melakukan pendaftaran akun Mitra Gudang.');
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
      navigate('/admin/gudang/inventory');
    } catch (e) {
      console.error('Error on auto-login after payment:', e);
      navigate('/admin/gudang/inventory');
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-blue-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
            <span className="h-4 w-px bg-stone-300 hidden sm:inline-block" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
                <Warehouse className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-stone-900 tracking-tight hidden sm:inline">
                CircularCoffee
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                Logistik &amp; QA Green Bean
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <span className="text-stone-500 hidden md:inline">Sudah memiliki akun?</span>
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-blue-700 text-white font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Headline Banner */}
      <section className="w-full bg-[#0C1523] text-white border-b border-stone-800 relative overflow-hidden py-10 sm:py-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-950/80 text-blue-300 border border-blue-500/30 px-3.5 py-1 rounded-full text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Logistik &amp; Mutu Green Bean Specialty</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Pendaftaran Mitra Gudang &amp; Warehouse QA
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm lg:text-base leading-relaxed">
              Kelola pergudangan klimatik hermetik, uji mutu grading green bean fisik, dan integrasi rantai pasok ke artisan roastery.
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
              orderId={registeredData.orderId || `CCT-GDG-${Date.now()}`}
              snapToken={registeredData.snapToken}
              redirectUrl={registeredData.redirectUrl}
              planRole="gudang"
              planName="Gudang & QA Logistik Green Bean"
              billingCycle={registeredData.billingCycle || 'monthly'}
              amount={registeredData.amount || 450000}
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

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E6DFD5] shadow-xs p-6 sm:p-8 space-y-5">
                  <div className="pb-3 border-b border-stone-100">
                    <h2 className="text-base sm:text-lg font-black text-stone-900">
                      Formulir Akun Mitra Gudang
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Informasi fasilitas penyimpanan green bean dan penanggung jawab mutu.
                    </p>
                  </div>

                  {/* 1. Nama Fasilitas Gudang */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Nama Fasilitas Gudang / Perusahaan <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Warehouse className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={warehouseName}
                        onChange={(e) => setWarehouseName(e.target.value)}
                        placeholder="e.g. PT Sentra Kopi Priangan Storage"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* 2. Lokasi / Kota Gudang & Estimasi Kapasitas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Lokasi / Kota Gudang <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Gedebage, Kota Bandung"
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Estimasi Kapasitas Gudang (Ton) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Scale className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                        <input
                          type="number"
                          required
                          min="1"
                          value={capacityTon}
                          onChange={(e) => setCapacityTon(e.target.value)}
                          placeholder="e.g. 50"
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Nama Kepala Gudang / QC & WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Nama Kepala Gudang / QC Manager <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={managerName}
                          onChange={(e) => setManagerName(e.target.value)}
                          placeholder="e.g. Budi Hartono, S.T."
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium"
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
                          placeholder="e.g. 0813-9876-5432"
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Email Bisnis */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Alamat Email Bisnis Gudang <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. gudang.priangan@circulartrace.id"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium"
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
                          className="w-full pl-10 pr-10 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium"
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
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 7. Pilihan Siklus Pembayaran & Midtrans Plan Box */}
                  <div className="pt-2">
                    <RegisterPaymentPlanBox
                      role="gudang"
                      billingCycle={billingCycle}
                      onChangeCycle={setBillingCycle}
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                      <PackageCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-stone-900">
                        Modul Logistik &amp; QA
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Standar pergudangan green bean specialty
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {/* Feature 1 */}
                    <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-950">
                        <Thermometer className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Kontrol Iklim Hermetik GrainPro</span>
                      </div>
                      <p className="text-[11px] text-blue-800 leading-relaxed pl-6">
                        Pemantauan suhu ruangan (18–22°C) dan kelembapan relatif (RH 55–65%) untuk menjaga kesegaran kadar air green bean.
                      </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <FileCheck className="w-4 h-4 text-slate-600 shrink-0" />
                        <span>Lembar Sortasi Fisik Standar SCA</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed pl-6">
                        Pencatatan defect count primer/sekunder, uji kadar air (moisture meter), water activity (Aw), dan grading screen size.
                      </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                        <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>Inbound dari Stasiun Olah &amp; Outbound Roastery</span>
                      </div>
                      <p className="text-[11px] text-indigo-800 leading-relaxed pl-6">
                        Penerimaan batch olahan dari wet mill dan transfer kepemilikan lot ke artisan roastery dengan tanda terima digital.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Assurance Card */}
                <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Kesiapan Audit Fitosanitari &amp; Karantina</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sistem siap mengekspor dokumen Surat Keterangan Asal (SKA), manifest karantina tumbuhan, dan sertifikat lot untuk kebutuhan buyer ekspor.
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
export default RegisterGudangPage;
