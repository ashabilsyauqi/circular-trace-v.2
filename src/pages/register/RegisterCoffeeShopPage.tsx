import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import {
  Coffee,
  Store,
  QrCode,
  HeartHandshake,
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
  Calculator,
  Award,
} from 'lucide-react';

export const RegisterCoffeeShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser, currentUser } = useCoffee();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/admin/overview');
    }
  }, [currentUser, navigate]);

  // Form states
  const [cafeName, setCafeName] = useState('');
  const [address, setAddress] = useState('');
  const [barBranches, setBarBranches] = useState('1 Bar');
  const [ownerName, setOwnerName] = useState('');
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

    if (!cafeName.trim() || !ownerName.trim() || !address.trim()) {
      setErrorMsg('Mohon lengkapi nama kedai kopi, alamat/kota, dan nama pemilik/manajer.');
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
        const bioText = `Kedai Kopi Specialty ${cafeName.trim()} di ${address.trim()} (${barBranches}). Menghubungkan penikmat kopi langsung dengan kisah ketertelusuran petani lewat paspor QR meja seduh.`;
        const result = await registerUser({
          name: ownerName.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          role: 'cafe',
          organization: cafeName.trim(),
          location: address.trim(),
          phone: phone.trim() || '0812-3456-7890',
          bio: bioText,
        });

        setRegisteredData({
          email: email.trim().toLowerCase(),
          name: ownerName.trim(),
          org: cafeName.trim(),
          verificationToken: result?.verificationToken,
          verificationLink: result?.verificationLink,
        });
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal melakukan pendaftaran akun Coffee Shop.');
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-amber-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
            <span className="h-4 w-px bg-stone-300 hidden sm:inline-block" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-black shadow-xs">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-stone-900 tracking-tight hidden sm:inline">
                CircularCoffee
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Kedai &amp; Seduh Konsumen
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <span className="text-stone-500 hidden md:inline">Sudah memiliki akun?</span>
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Headline Banner */}
      <section className="w-full bg-[#18110D] text-white border-b border-stone-800 relative overflow-hidden py-10 sm:py-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-stone-800/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-amber-950/80 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Hilir: Kedai Kopi, Barista &amp; Konsumen Akhir</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Pendaftaran Kedai Kopi &amp; Coffee Shop
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm lg:text-base leading-relaxed">
              Sajikan setiap cangkir kopi spesialti dengan transparansi penuh dari kebun hingga ke meja seduh konsumen Anda.
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
              <div className="w-20 h-20 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50 shadow-sm">
                <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  Pendaftaran Kedai Kopi Berhasil
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Selamat Datang di CircularCoffee
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Kedai kopi <strong className="text-stone-900">{registeredData.org}</strong> telah terdaftar. Anda dapat langsung sourcing roasted bean dan mencetak QR Code meja seduh.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8F5F0] border border-[#E6DFD5] text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Nama Kedai:</span>
                  <span className="font-bold text-stone-900">{registeredData.org}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Pemilik / Manajer:</span>
                  <span className="font-bold text-stone-900">{registeredData.name}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Email Bisnis:</span>
                  <span className="font-bold text-stone-900 font-mono">{registeredData.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Peran Layanan:</span>
                  <span className="font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    Coffee Shop, Cafe &amp; Barista
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-stone-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Masuk ke Panel Kedai Kopi</span>
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
                      Formulir Akun Kedai Kopi
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Lengkapi data kedai kopi Anda dan penanggung jawab outlet.
                    </p>
                  </div>

                  {/* 1. Nama Kedai Kopi */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Nama Kedai Kopi / Cafe <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Coffee className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={cafeName}
                        onChange={(e) => setCafeName(e.target.value)}
                        placeholder="e.g. Seduh Teduh Specialty Coffee"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* 2. Alamat & Kota Kedai */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Alamat &amp; Kota Kedai <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Jl. Riau No. 45, Bandung"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* 3. Jumlah Bar / Cabang */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Jumlah Bar / Cabang Operasional
                    </label>
                    <div className="relative">
                      <Store className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <select
                        value={barBranches}
                        onChange={(e) => setBarBranches(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all font-medium appearance-none cursor-pointer"
                      >
                        <option value="1 Bar">1 Bar (Single Specialty Outlet)</option>
                        <option value="2 - 3 Cabang">2 - 3 Cabang Kedai</option>
                        <option value="> 3 Cabang">&gt; 3 Cabang (Multi-Chain Specialty Cafe)</option>
                      </select>
                    </div>
                  </div>

                  {/* 4. Nama Pemilik & WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Nama Pemilik / Manajer Kedai <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="e.g. Andika Pratama"
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all font-medium"
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
                          placeholder="e.g. 0812-9988-7766"
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Email Bisnis */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Alamat Email Bisnis Cafe <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. seduh.teduh@circulartrace.id"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all font-medium"
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
                          className="w-full pl-10 pr-10 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all font-medium"
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
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                          <span>Mendaftarkan Kedai Kopi...</span>
                        </>
                      ) : (
                        <>
                          <span>Daftarkan Coffee Shop Anda</span>
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
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-stone-900">
                        Fitur Kedai &amp; Barista
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Transparansi seduh &amp; nilai tambah cangkir
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {/* Feature 1 */}
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                        <Store className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Sourcing B2B Langsung ke Mitra Roaster</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed pl-6">
                        Beli biji sangrai segar (roasted bean) dengan profil rasa terverifikasi dan harga transparan langsung dari produsen sangrai.
                      </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-3.5 rounded-xl bg-stone-100/80 border border-stone-200 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                        <QrCode className="w-4 h-4 text-stone-700 shrink-0" />
                        <span>Paspor QR Digital Meja Konsumen</span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed pl-6">
                        Tampilkan stiker QR di atas meja kafe agar pengunjung dapat membaca asal-usul varietas kopi, nama petani, dan skor cupping-nya.
                      </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                        <HeartHandshake className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Sertifikat Transparansi Fair Price</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed pl-6">
                        Tingkatkan kepercayaan pelanggan dengan sertifikat digital yang membuktikan dukungan harga beli yang adil bagi petani kopi.
                      </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                        <Calculator className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Kalkulator Biaya Seduh (Brewing Cost)</span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed pl-6">
                        Hitung gramatur espresso, rasio manual brew, dan Harga Pokok Penjualan (HPP) per cangkir untuk memaksimalkan profitabilitas kafe.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Consumer Loyalty Trust */}
                <div className="bg-stone-900 text-stone-200 rounded-2xl p-5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Award className="w-4 h-4" />
                    <span>Cerita di Balik Setiap Cangkir Kopi</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Ubah sekadar minum kopi menjadi pengalaman edukatif bernilai tinggi yang memperkuat loyalitas pelanggan kedai kopi Anda.
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
export default RegisterCoffeeShopPage;
