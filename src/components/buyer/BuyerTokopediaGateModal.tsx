import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { ALL_INDONESIAN_PROVINCES } from '../../constants/provinces';
import { AppUser, UserRole } from '../../types/coffee';
import {
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  X,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Lock,
  Tag,
  ArrowRight,
  Sparkles,
  Store,
  CreditCard,
  Check
} from 'lucide-react';

export interface BuyerTokopediaGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingBuyItemName?: string;
  onApprovedLogin?: (buyerUser: AppUser) => void;
}

export const BuyerTokopediaGateModal: React.FC<BuyerTokopediaGateModalProps> = ({
  isOpen,
  onClose,
  pendingBuyItemName,
  onApprovedLogin,
}) => {
  const { setCurrentUser, users, setUsers } = useCoffee();
  const [activeTab, setActiveTab] = useState<'register' | 'quick_login'>('register');

  // Form State
  const [name, setName] = useState('');
  const [buyerType, setBuyerType] = useState<'cafe' | 'roaster' | 'personal' | 'b2b'>('cafe');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('password123');
  const [province, setProvince] = useState('Sumatera Barat');
  const [city, setCity] = useState('Kota Padang');
  const [address, setAddress] = useState('Jl. Khatib Sulaiman No. 42');
  const [membershipTier, setMembershipTier] = useState<'free_per_trx' | 'verified_member'>('verified_member');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successUser, setSuccessUser] = useState<AppUser | null>(null);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address) {
      alert('Mohon lengkapi semua kolom pendaftaran akun pembeli.');
      return;
    }

    const orgName = organization || (buyerType === 'cafe' ? `${name} Coffee Bar` : buyerType === 'roaster' ? `${name} Roastery` : 'Penikmat Kopi Mandiri');
    const newBuyerId = 'buyer-' + Date.now().toString().slice(-6);

    const newBuyerUser: AppUser = {
      id: newBuyerId,
      name: name,
      username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'buyer_' + Date.now().toString().slice(-4),
      email: email,
      phone: phone,
      password: password,
      role: 'buyer' as UserRole,
      status: 'active', // Approved by Circular Trace
      organization: orgName,
      location: `${city}, ${province}`,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      balance: 15000000, // 15 Juta Starter E-Wallet Balance
      registeredAt: new Date().toLocaleString('id-ID'),
      bio: `Member Pembeli Terverifikasi Circular Trace • ${orgName} • Domisili ${province}.`,
    };

    setUsers((prev: AppUser[]) => [newBuyerUser, ...prev.filter((u: AppUser) => u.email !== email && u.id !== newBuyerId)]);
    setCurrentUser(newBuyerUser);
    setSuccessUser(newBuyerUser);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      if (onApprovedLogin) onApprovedLogin(newBuyerUser);
    }, 1400);
  };

  const handleQuickLogin = (existingUserId: string) => {
    let found = users.find((u) => u.id === existingUserId);
    if (!found) {
      found = {
        id: 'user-buyer-1',
        name: 'Siti Rahma',
        username: 'buyer',
        email: 'buyer@circulartrace.com',
        password: 'password123',
        role: 'buyer' as UserRole,
        status: 'active',
        organization: 'Komunitas Penikmat Kopi Nusantara (Buyer)',
        location: 'Padang / Solok, Sumatera Barat',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        phone: '0812-9988-7711',
        balance: 25000000,
        bio: 'Akun pembeli e-commerce disetujui Circular Trace.',
      };
      setUsers((prev: AppUser[]) => [found!, ...prev.filter((u: AppUser) => u.id !== 'user-buyer-1')]);
    }
    setCurrentUser(found);
    setSuccessUser(found);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      if (onApprovedLogin) onApprovedLogin(found!);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Tokopedia-Style Green Accent Top Bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-[#00AA5B] to-teal-700 text-white p-5 sm:p-6 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Akun Pembeli Resmi &bull; Circular Trace Gate</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Daftar / Masuk Akun Member Pembeli (Buyer)</span>
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm">
                Sesuai standar verifikasi Circular Trace, hanya <strong>Member Pembeli Terdaftar</strong> yang dapat membeli komoditas kopi dari petani &amp; pengolah.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pending Buy Item Info Notice */}
          {pendingBuyItemName && (
            <div className="mt-3 p-2.5 rounded-xl bg-black/20 border border-white/20 text-xs text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                Anda hendak memesan: <strong className="text-amber-200">{pendingBuyItemName}</strong>. Silakan masuk atau daftarkan akun pembeli untuk melanjutkan.
              </span>
            </div>
          )}
        </div>

        {/* Tab Switcher: Register vs Quick Login */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 p-2 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 shadow-xs border border-stone-200 dark:border-stone-700'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1. Daftar Akun Member Pembeli Baru</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quick_login')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'quick_login'
                ? 'bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 shadow-xs border border-stone-200 dark:border-stone-700'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>2. Sudah Punya Akun? Masuk Cepat</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* SUCCESS BANNER OVERLAY */}
          {isSuccess && successUser && (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-base font-black text-emerald-950">
                Akun Pembeli Berhasil Diverifikasi &amp; Disetujui!
              </h3>
              <p className="text-xs text-emerald-800">
                Selamat berbelanja, <strong>{successUser.name}</strong> ({successUser.organization}). Mengarahkan ke transaksi produk Anda...
              </p>
            </div>
          )}

          {!isSuccess && activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              
              {/* Buyer Type Selection (Radio Pills) */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Tipe Pembeli / Kategori Usaha Anda:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'cafe', label: '☕ Cafe & Kedai', sub: 'Biji Sangrai & Menu' },
                    { id: 'roaster', label: '🔥 Artisan Roaster', sub: 'Green Bean Karung' },
                    { id: 'personal', label: '🏡 Penikmat Rumah', sub: 'Kemasan Ritel 250gr' },
                    { id: 'b2b', label: '📦 B2B / Eksportir', sub: 'Partai Besar EUDR' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setBuyerType(t.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        buyerType === t.id
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-bold'
                          : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <div className="font-extrabold text-[11px]">{t.label}</div>
                      <div className="text-[10px] opacity-80">{t.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Identity Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Nama Lengkap PIC / Pembeli *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Hendra Pratama"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Nama Usaha / Toko / Komunitas
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Contoh: Kopi Ranah Minang Cafe"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Email Aktif *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="email"
                      required
                      placeholder="hendra@kopiranah.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Nomor WhatsApp / HP (Untuk Resi) *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="tel"
                      required
                      placeholder="0812-9876-5432"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address Row (Tokopedia Delivery Address) */}
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-black">
                  <MapPin className="w-4 h-4" />
                  <span>Alamat Pengiriman Utama</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-600 dark:text-stone-400 mb-1">
                      Provinsi Domisili Pengiriman:
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-medium"
                    >
                      {ALL_INDONESIAN_PROVINCES.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-600 dark:text-stone-400 mb-1">
                      Kota / Kabupaten:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kota Padang / Solok"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-600 dark:text-stone-400 mb-1">
                    Detail Alamat &amp; Patokan Pengantaran:
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Nama jalan, nomor ruko/cafe, RT/RW, dan instruksi kurir pengantaran..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-medium"
                  />
                </div>
              </div>

              {/* Platform Charge Selection (Om Novizar: "Buyer kena charge juga") */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-700" />
                    <span>Ketentuan Biaya Layanan &amp; Verifikasi Pembeli (Circular Trace)</span>
                  </span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                    Resmi Platform
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                  Sesuai ketentuan, pembeli komoditas dikenakan biaya layanan untuk operasional sistem pelacakan (traceability) dan jaminan keaslian sertifikasi:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div
                    onClick={() => setMembershipTier('free_per_trx')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      membershipTier === 'free_per_trx'
                        ? 'border-amber-600 bg-white dark:bg-stone-900 shadow-xs ring-2 ring-amber-500/20'
                        : 'border-amber-200 hover:bg-white/50'
                    }`}
                  >
                    <div className="font-extrabold text-stone-900 dark:text-white">Gratis Registrasi</div>
                    <div className="text-amber-800 font-bold">Biaya Layanan Rp 2.500 / Transaksi</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Dipotong otomatis saat Anda checkout pesanan kopi.</div>
                  </div>

                  <div
                    onClick={() => setMembershipTier('verified_member')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      membershipTier === 'verified_member'
                        ? 'border-emerald-600 bg-white dark:bg-stone-900 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-amber-200 hover:bg-white/50'
                    }`}
                  >
                    <div className="font-extrabold text-stone-900 dark:text-white flex items-center justify-between">
                      <span>Member Verified Circular Trace</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-black">Rekomendasi</span>
                    </div>
                    <div className="text-emerald-700 font-bold">Rp 25.000 (Akses Penuh Seumur Hidup)</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Bebas biaya layanan platform + prioritas pengiriman.</div>
                  </div>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-stone-600 dark:text-stone-400 text-[11px] cursor-pointer">
                  Saya setuju dengan <strong>Syarat &amp; Ketentuan Transaksi</strong> dan persetujuan akun resmi Circular Trace.
                </label>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={!agreeTerms}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#00AA5B] hover:bg-[#03AC0E] active:bg-[#008f4c] text-white font-black text-sm shadow-lg shadow-emerald-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Daftar Akun Member Pembeli &amp; Lanjut Beli</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: QUICK LOGIN (FOR INSTANT PRESENTATION TO OM NOVIZAR) */}
          {!isSuccess && activeTab === 'quick_login' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs">
                <p className="text-stone-600 dark:text-stone-300">
                  Untuk keperluan presentasi langsung ke <strong>Om Novizar</strong>, Anda dapat memilih akun member pembeli yang sudah terdaftar &amp; disetujui di bawah ini:
                </p>
              </div>

              <div className="space-y-2.5">
                {/* 1. Siti Rahma (Default Buyer) */}
                <div
                  onClick={() => handleQuickLogin('user-buyer-1')}
                  className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/60 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                      alt="Siti Rahma"
                      className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500"
                    />
                    <div>
                      <div className="font-black text-stone-900 dark:text-white flex items-center gap-2">
                        <span>Siti Rahma</span>
                        <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                          Disetujui Circular Trace
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">Komunitas Penikmat Kopi Nusantara &bull; Padang / Solok, Sumatera Barat</p>
                      <p className="text-[11px] font-mono text-emerald-700 font-bold mt-0.5">Saldo Belanja E-Wallet: Rp 25.000.000</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleQuickLogin('user-buyer-1'); }} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs group-hover:scale-105 transition-transform cursor-pointer"
                  >
                    Masuk Akun &rarr;
                  </button>
                </div>

                {/* 2. Dedi Kurniawan (Pengolah) / Other roles */}
                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-600 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-800">Butuh Akun Buyer Baru untuk Kota Lain?</span>
                    <p className="text-[11px] text-stone-500">Silakan gunakan Tab 1 untuk mendaftarkan nama cafe / kedai baru Anda secara instan.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="px-3 py-1.5 bg-stone-900 text-white font-bold text-xs rounded-lg hover:bg-stone-800"
                  >
                    Buka Form &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
          <span>&copy; 2026 sangrAI &bull; Circular Trace Coffee Commerce Gate</span>
          <span className="text-emerald-700 font-bold">Verifikasi Sah Kemenkumham RI</span>
        </div>
      </div>
    </div>
  );
};
