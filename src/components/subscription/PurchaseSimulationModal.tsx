import React, { useState, useEffect } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { SUBSCRIPTION_PLANS } from '../../data/mockSubscriptions';
import { SubscriptionTierId, SubscriptionPlan, SubscriptionInvoice, UserSubscription } from '../../types/subscription';
import { UserRole } from '../../types/coffee';
import { INDONESIAN_PROVINCES_BY_REGION } from '../../constants/provinces';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  Copy,
  Check,
  Printer,
  ArrowRight,
  RotateCcw,
  Receipt,
  Calendar,
  UserCheck,
  X,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  Award,
  Layers,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  FileText,
  BadgeCheck,
} from 'lucide-react';

export interface PurchaseSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: SubscriptionTierId | null;
  onCompleted?: (sub: UserSubscription, invoice: SubscriptionInvoice) => void;
}

interface LiveTenantFormData {
  name: string;
  organization: string;
  email: string;
  phone: string;
  province: string;
  cityAddress: string;
  role: UserRole;
  taxId: string;
}

export const PurchaseSimulationModal: React.FC<PurchaseSimulationModalProps> = ({
  isOpen,
  onClose,
  initialPlanId = '3_months',
  onCompleted,
}) => {
  const {
    currentUser,
    subscribeUser,
    setActiveView,
  } = useCoffee();

  const [activePlanId, setActivePlanId] = useState<SubscriptionTierId>(initialPlanId || '3_months');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_transfer' | 'wallet' | 'credit_card'>('qris');
  const [selectedBank, setSelectedBank] = useState<'bca' | 'mandiri' | 'bri' | 'bsi'>('bca');
  const [step, setStep] = useState<'config' | 'payment' | 'processing' | 'receipt'>('config');
  const [isCopied, setIsCopied] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(895); // 14:55 countdown
  const [lastCreatedSub, setLastCreatedSub] = useState<UserSubscription | null>(null);
  const [lastCreatedInvoice, setLastCreatedInvoice] = useState<SubscriptionInvoice | null>(null);

  // Live registration & billing form data
  const [formData, setFormData] = useState<LiveTenantFormData>({
    name: currentUser?.name || 'Novizar Arifin',
    organization: currentUser?.organization || 'Koperasi Kopi Minang Mandiri',
    email: currentUser?.email || 'novizar@kopiminang.id',
    phone: currentUser?.phone || '0812-6789-0123',
    province: 'Sumatera Barat',
    cityAddress: 'Kabupaten Solok, Alahan Panjang',
    role: currentUser?.role || 'petani',
    taxId: '01.889.332.1-014.000',
  });

  // Sync initialPlanId if prop changes
  useEffect(() => {
    if (initialPlanId) {
      setActivePlanId(initialPlanId);
      setStep('config');
    }
  }, [initialPlanId, isOpen]);

  // Timer countdown for payment screen
  useEffect(() => {
    if (step !== 'payment') return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  if (!isOpen) return null;

  const currentPlan: SubscriptionPlan =
    SUBSCRIPTION_PLANS.find((p) => p.id === activePlanId) ||
    (activePlanId === '7_days_trial'
      ? {
          id: '7_days_trial',
          name: 'Free Trial 7 Hari (Full Access)',
          badge: 'Free Trial 100% Gratis',
          tagline: 'Uji coba seluruh 6 modul ekosistem dari hulu ke hilir tanpa komitmen dan tanpa biaya.',
          durationDays: 7,
          durationLabel: '7 Hari',
          totalPrice: 0,
          monthlyEquivalent: 0,
          pricePerMonth: 0,
          pricePerYear: 0,
          allowedRoles: ['petani', 'pengolah', 'gudang', 'roaster', 'cafe', 'verifikator', 'buyer'],
          features: [
            'Akses Penuh 6 Layanan Rantai Pasok',
            'Pencatatan 10 Transaksi Panen & Roasting',
            'Sertifikasi & QR Passport Traceability',
          ],
          colorScheme: 'amber',
        }
      : SUBSCRIPTION_PLANS[0]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyVaNumber = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Preset quick fill helpers for demonstration
  const handleApplyPreset = (preset: {
    name: string;
    organization: string;
    email: string;
    phone: string;
    province: string;
    cityAddress: string;
    role: UserRole;
    taxId: string;
  }) => {
    setFormData(preset);
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.organization || !formData.email || !formData.phone) {
      alert('Mohon lengkapi data penanggung jawab dan nama bisnis Anda.');
      return;
    }

    if (activePlanId === '7_days_trial' || currentPlan.totalPrice === 0) {
      executeSubscriptionProcess();
    } else {
      setStep('payment');
    }
  };

  const executeSubscriptionProcess = () => {
    setStep('processing');

    setTimeout(() => {
      let cycle: 'monthly' | 'yearly' = 'monthly';
      if (currentPlan.id === '1_year') cycle = 'yearly';

      const res = subscribeUser({
        userId: currentUser?.id || 'new_subscriber',
        tierId: activePlanId,
        billingCycle: cycle,
        paymentMethod: activePlanId === '7_days_trial' ? 'free_trial' : paymentMethod,
        tenantData: formData,
      });

      if (res.success && res.subscription) {
        setLastCreatedSub(res.subscription);
        const inv = res.subscription.invoices && res.subscription.invoices[0]
          ? res.subscription.invoices[0]
          : {
              id: 'INV-' + Date.now().toString().slice(-6),
              invoiceNumber: 'INV/2026/11/CCT-' + Math.floor(1000 + Math.random() * 9000),
              date: new Date().toISOString().split('T')[0],
              dueDate: res.subscription.expiryDate,
              amount: res.subscription.pricePaid,
              tierId: currentPlan.id,
              tierName: currentPlan.name,
              status: 'paid' as const,
              paymentMethod: (activePlanId === '7_days_trial' ? 'free_trial' : paymentMethod) as any,
              receiptNumber: 'REC-' + Date.now().toString().slice(-8),
            };
        setLastCreatedInvoice(inv);
        setStep('receipt');
        if (onCompleted) onCompleted(res.subscription, inv);
      } else {
        alert(res.message || 'Gagal memproses transaksi');
        setStep('config');
      }
    }, 800);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleFinishAndNavigate = (targetView: 'subscription' | 'dashboard') => {
    onClose();
    setActiveView(targetView);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 bg-[#1C120C] text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-amber-400">
                <Sparkles className="w-3 h-3" />
                <span>Aktivasi Paket Layanan &bull; Formulir Pendaftaran Resmi</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {currentPlan.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS TABS */}
        <div className="bg-stone-100 px-6 py-2.5 border-b border-stone-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 'config'
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              1
            </span>
            <span className={`font-bold ${step === 'config' ? 'text-stone-900' : 'text-stone-500'}`}>
              Input Data &amp; Penagihan
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 'payment'
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : step === 'receipt'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-300 text-stone-600'
              }`}
            >
              2
            </span>
            <span className={`font-bold ${step === 'payment' ? 'text-stone-900' : 'text-stone-500'}`}>
              Gateway Pembayaran
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 'receipt' ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-600'
              }`}
            >
              3
            </span>
            <span className={`font-bold ${step === 'receipt' ? 'text-stone-900' : 'text-stone-500'}`}>
              Faktur Resmi &amp; Lunas
            </span>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto space-y-6">

          {/* ============================================================== */}
          {/* STEP 1: LIVE FORM INPUT & BILLING REGISTRATION                 */}
          {/* ============================================================== */}
          {step === 'config' && (
            <form onSubmit={handleStartPayment} className="space-y-6">
              {/* Plan Switcher Pills inside Modal */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Pilih Paket Bundle yang Akan Disewa:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
                  {[
                    { id: '1_month', label: '1 Bulan' },
                    { id: '3_months', label: '3 Bulan (Panen)' },
                    { id: '6_months', label: '6 Bulan (Semester)' },
                    { id: '1_year', label: '1 Tahun (Lengkap)' },
                    { id: '7_days_trial', label: 'Trial 7 Hari' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActivePlanId(p.id as any)}
                      className={`px-2.5 py-2 rounded-xl font-bold border transition-all cursor-pointer text-center ${
                        activePlanId === p.id
                          ? 'bg-amber-500 border-amber-600 text-stone-950 shadow-xs ring-1 ring-amber-600'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Package Summary Header Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-850 text-white border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                    {currentPlan.badge}
                  </span>
                  <h4 className="text-base font-black text-white mt-1">{currentPlan.name}</h4>
                  <p className="text-xs text-stone-300">{currentPlan.tagline}</p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-2xl font-black text-amber-400">
                    Rp {currentPlan.totalPrice.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Durasi: {currentPlan.durationLabel}
                  </div>
                  {currentPlan.savingsNote && (
                    <span className="inline-block mt-0.5 px-2 py-0.2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold rounded-full">
                      {currentPlan.savingsNote}
                    </span>
                  )}
                </div>
              </div>

              {/* LIVE FORM SECTION */}
              <div className="p-5 rounded-3xl bg-amber-50/50 border border-amber-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wider">
                      <FileText className="w-4 h-4 text-amber-700" />
                      <span>Formulir Data Penagihan &amp; Registrasi Tenant (Live Experience)</span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Masukkan data identitas penanggung jawab dan bisnis kopi yang akan didaftarkan pada sistem:
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-full shrink-0">
                    Real Data Input
                  </span>
                </div>

                {/* Preset Fast Autofill Chips */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Preset Cepat (Klik untuk Isi Otomatis):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset({
                          name: 'Novizar Arifin',
                          organization: 'Koperasi Kopi Minang Mandiri',
                          email: 'novizar@kopiminang.id',
                          phone: '0812-6789-0123',
                          province: 'Sumatera Barat',
                          cityAddress: 'Solok Selatan, Lembah Gumanti',
                          role: 'petani',
                          taxId: '01.889.332.1-014.000',
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-stone-800 font-bold text-[11px] cursor-pointer transition-all flex items-center gap-1 shadow-2xs"
                    >
                      <span>☕ Om Novizar (Koperasi Minang - Sumbar)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset({
                          name: 'Pak Slamet Supriadi',
                          organization: 'Poktan Rahayu Kopi Malabar',
                          email: 'slamet@poktan-malabar.id',
                          phone: '0813-4455-6677',
                          province: 'Jawa Barat',
                          cityAddress: 'Pangalengan, Kab. Bandung',
                          role: 'petani',
                          taxId: '32.102.948.3-441.000',
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-[11px] cursor-pointer transition-all flex items-center gap-1 shadow-2xs"
                    >
                      <span>🌾 Pak Slamet (Kelompok Tani)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset({
                          name: 'Budi Santoso, S.T.',
                          organization: 'CV Malabar Wet & Dry Mill Station',
                          email: 'budi@malabarmill.id',
                          phone: '0812-3456-7890',
                          province: 'Jawa Barat',
                          cityAddress: 'Kec. Pangalengan, Kab. Bandung',
                          role: 'pengolah',
                          taxId: '02.998.112.5-442.000',
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-[11px] cursor-pointer transition-all flex items-center gap-1 shadow-2xs"
                    >
                      <span>⚙️ Budi Santoso (CV Mill)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset({
                          name: 'Eko Prasetyo',
                          organization: 'Senja Artisan Coffee Roasters',
                          email: 'eko@senjaroasters.com',
                          phone: '0817-8899-0011',
                          province: 'D.I. Yogyakarta',
                          cityAddress: 'Sleman, D.I. Yogyakarta',
                          role: 'roaster',
                          taxId: '34.221.094.2-541.000',
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-[11px] cursor-pointer transition-all flex items-center gap-1 shadow-2xs"
                    >
                      <span>🔥 Eko (Artisan Roastery)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset({
                          name: 'Dimas Wicaksono',
                          organization: 'PT Nusantara Specialty Coffee Trading',
                          email: 'dimas@nusantaracoffee.com',
                          phone: '0811-2233-4455',
                          province: 'DKI Jakarta',
                          cityAddress: 'Kebayoran Baru, Jakarta Selatan',
                          role: 'buyer',
                          taxId: '01.332.994.8-012.000',
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-[11px] cursor-pointer transition-all flex items-center gap-1 shadow-2xs"
                    >
                      <span>🛒 Dimas (B2B Buyer)</span>
                    </button>
                  </div>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Field 1: Nama PIC */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Nama Lengkap Penanggung Jawab (PIC) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Novizar Arifin"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium text-stone-900"
                    />
                  </div>

                  {/* Field 2: Nama Bisnis */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Nama Usaha / Kelompok Tani / Koperasi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Contoh: Koperasi Kopi Minang Mandiri"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium text-stone-900"
                    />
                  </div>

                  {/* Field 3: Email Resmi */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Alamat Email Resmi Penagihan <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@bisnisanda.id"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium text-stone-900"
                      />
                    </div>
                  </div>

                  {/* Field 4: WhatsApp / No HP */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Nomor WhatsApp / HP Aktif <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0812-xxxx-xxxx"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium text-stone-900"
                      />
                    </div>
                  </div>

                  {/* Field 5: Provinsi */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Provinsi Wilayah Kebun / Operasional <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium text-stone-900"
                    >
                      {INDONESIAN_PROVINCES_BY_REGION.map((reg) => (
                        <optgroup key={reg.region} label={reg.region}>
                          {reg.provinces.map((prov) => (
                            <option key={prov} value={prov}>
                              {prov}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Field 6: Kota & Alamat */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Kabupaten / Kota &amp; Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.cityAddress}
                        onChange={(e) => setFormData({ ...formData, cityAddress: e.target.value })}
                        placeholder="Contoh: Solok Selatan / Pangalengan"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium text-stone-900"
                      />
                    </div>
                  </div>

                  {/* Field 7: Sektor / Peran Utama */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Sektor / Fokus Bisnis Utama <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium text-stone-900"
                      >
                        <option value="petani">1. Hulu Kebun &amp; Kelompok Tani</option>
                        <option value="pengolah">2. Stasiun Olah Ceri Mill (Wet &amp; Dry)</option>
                        <option value="gudang">3. Gudang Konsinyasi &amp; Ekspor</option>
                        <option value="roaster">4. Artisan Roastery Profil Sangrai</option>
                        <option value="cafe">5. Kedai Kopi &amp; Smart POS Kafe</option>
                        <option value="buyer">6. Pembeli B2B Komoditas (Buyer)</option>
                      </select>
                    </div>
                  </div>

                  {/* Field 8: NPWP / NIK Usaha */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      NPWP / NIK Usaha (Untuk Faktur Pajak Resmi)
                    </label>
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      placeholder="16 Digit NIK / NPWP Badan (Opsional)"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium text-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              {activePlanId !== '7_days_trial' && currentPlan.totalPrice > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Pilih Saluran Pembayaran:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      {
                        id: 'qris',
                        label: 'QRIS Real-Time',
                        sub: 'BCA, GoPay, OVO, ShopeePay',
                        icon: <QrCode className="w-4 h-4 text-emerald-600" />,
                      },
                      {
                        id: 'bank_transfer',
                        label: 'Virtual Account (VA)',
                        sub: 'BCA, Mandiri, BRI, BSI',
                        icon: <Building2 className="w-4 h-4 text-blue-600" />,
                      },
                      {
                        id: 'wallet',
                        label: 'Saldo E-Wallet sangrAI',
                        sub: 'Potong Saldo Akun Instan',
                        icon: <Wallet className="w-4 h-4 text-amber-600" />,
                      },
                      {
                        id: 'credit_card',
                        label: 'Kartu Kredit / Debit',
                        sub: 'Visa, Mastercard, JCB',
                        icon: <CreditCard className="w-4 h-4 text-purple-600" />,
                      },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          paymentMethod === m.id
                            ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold ring-1 ring-emerald-500'
                            : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">{m.icon}</div>
                        <div>
                          <div className="font-bold">{m.label}</div>
                          <div className="text-[10px] text-stone-500">{m.sub}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {activePlanId === '7_days_trial' ? (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Daftarkan &amp; Aktifkan Trial 7 Hari (Gratis) &rarr;</span>
                    </>
                  ) : (
                    <>
                      <span>Lanjut ke Gateway Pembayaran (Rp {currentPlan.totalPrice.toLocaleString()})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* STEP 2: REALISTIC PAYMENT GATEWAY SIMULATOR                    */}
          {/* ============================================================== */}
          {step === 'payment' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    Gateway Pembayaran &bull; Tagihan Resmi
                  </span>
                  <h4 className="text-base font-black text-stone-900">
                    Selesaikan Pembayaran: Rp {currentPlan.totalPrice.toLocaleString()}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-mono font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>
              </div>

              {/* Verified Billing Target Box */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Penanggung Jawab (PIC):</span>
                  <span className="font-bold text-stone-900">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Nama Bisnis / Entitas:</span>
                  <span className="font-bold text-stone-900">{formData.organization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Email &amp; WhatsApp:</span>
                  <span className="font-medium text-stone-700">{formData.email} &bull; {formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Wilayah Operasional:</span>
                  <span className="font-medium text-stone-700">{formData.cityAddress}, {formData.province}</span>
                </div>
              </div>

              {/* 1. GATEWAY QRIS */}
              {paymentMethod === 'qris' && (
                <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4 text-center">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QRIS Dinamis Standar Nasional (ASPI)</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl shadow-md border-2 border-stone-800 relative">
                    <svg
                      className="w-44 h-44 sm:w-48 sm:h-48"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="5" y="5" width="26" height="26" rx="4" fill="#1C120C" />
                      <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
                      <rect x="13" y="13" width="10" height="10" rx="1" fill="#1C120C" />

                      <rect x="69" y="5" width="26" height="26" rx="4" fill="#1C120C" />
                      <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
                      <rect x="77" y="13" width="10" height="10" rx="1" fill="#1C120C" />

                      <rect x="5" y="69" width="26" height="26" rx="4" fill="#1C120C" />
                      <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
                      <rect x="13" y="77" width="10" height="10" rx="1" fill="#1C120C" />

                      <rect x="36" y="8" width="5" height="5" fill="#1C120C" />
                      <rect x="46" y="8" width="5" height="5" fill="#1C120C" />
                      <rect x="56" y="8" width="5" height="5" fill="#1C120C" />
                      <rect x="36" y="18" width="5" height="5" fill="#1C120C" />
                      <rect x="46" y="24" width="5" height="5" fill="#1C120C" />
                      <rect x="56" y="18" width="5" height="5" fill="#1C120C" />

                      <rect x="8" y="36" width="5" height="5" fill="#1C120C" />
                      <rect x="18" y="36" width="5" height="5" fill="#1C120C" />
                      <rect x="28" y="36" width="5" height="5" fill="#1C120C" />
                      <rect x="8" y="48" width="5" height="5" fill="#1C120C" />
                      <rect x="22" y="54" width="5" height="5" fill="#1C120C" />

                      <circle cx="50" cy="50" r="14" fill="#FAF7F2" stroke="#1C120C" strokeWidth="2" />
                      <path d="M44 48C44 45 47 43 50 43C53 43 56 45 56 48C56 53 44 53 44 57H56" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="50" cy="62" r="1.5" fill="#B45309" />

                      <rect x="68" y="38" width="5" height="5" fill="#1C120C" />
                      <rect x="78" y="44" width="5" height="5" fill="#1C120C" />
                      <rect x="88" y="38" width="5" height="5" fill="#1C120C" />
                      <rect x="68" y="54" width="5" height="5" fill="#1C120C" />
                      <rect x="82" y="58" width="5" height="5" fill="#1C120C" />

                      <rect x="36" y="68" width="5" height="5" fill="#1C120C" />
                      <rect x="48" y="74" width="5" height="5" fill="#1C120C" />
                      <rect x="56" y="84" width="5" height="5" fill="#1C120C" />
                      <rect x="42" y="88" width="5" height="5" fill="#1C120C" />
                      <rect x="74" y="74" width="5" height="5" fill="#1C120C" />
                      <rect x="86" y="82" width="5" height="5" fill="#1C120C" />
                    </svg>

                    <div className="text-[10px] font-mono font-bold text-stone-500 mt-2">
                      NMID: ID1029384756192
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-stone-800">
                      Buka aplikasi BCA Mobile, GoPay, OVO, DANA, atau ShopeePay Anda
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Pindai QR Code di atas sebesar nominal <strong>Rp {currentPlan.totalPrice.toLocaleString()}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* 2. GATEWAY VIRTUAL ACCOUNT */}
              {paymentMethod === 'bank_transfer' && (
                <div className="space-y-4 p-5 rounded-3xl bg-stone-50 border border-stone-200">
                  <div className="flex gap-2">
                    {[
                      { id: 'bca', name: 'BCA VA' },
                      { id: 'mandiri', name: 'Mandiri VA' },
                      { id: 'bri', name: 'BRI VA' },
                      { id: 'bsi', name: 'BSI VA' },
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBank(b.id as any)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedBank === b.id
                            ? 'bg-blue-600 border-blue-700 text-white shadow-xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                      Nomor Virtual Account {selectedBank.toUpperCase()}:
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg sm:text-xl font-mono font-black text-stone-900 tracking-wider">
                        8809 1082 3948 {selectedBank === 'bca' ? '1192' : '4421'}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          copyVaNumber(`880910823948${selectedBank === 'bca' ? '1192' : '4421'}`)
                        }
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 space-y-1 pl-1">
                    <div className="font-bold text-stone-800">Petunjuk Transfer:</div>
                    <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-stone-500">
                      <li>Buka m-Banking atau ATM bank Anda.</li>
                      <li>Pilih menu <strong>Transfer &rarr; Virtual Account</strong>.</li>
                      <li>Masukkan nomor VA di atas dan pastikan nama penerima <strong>sangrAI Circular Trace</strong>.</li>
                      <li>Konfirmasi pembayaran sebesar Rp {currentPlan.totalPrice.toLocaleString()}.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* 3. GATEWAY E-WALLET */}
              {paymentMethod === 'wallet' && (
                <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-amber-700" />
                      <span className="font-bold text-stone-900 text-xs sm:text-sm">Saldo sangrAI Pay Anda</span>
                    </div>
                    <span className="text-base font-black text-emerald-700">Rp 25.000.000</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-2 text-xs">
                    <div className="flex justify-between text-stone-500">
                      <span>Tagihan Paket:</span>
                      <span className="font-bold text-stone-900">Rp {currentPlan.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-stone-500 pt-1 border-t border-stone-100">
                      <span>Sisa Saldo Setelah Transaksi:</span>
                      <span className="font-bold text-emerald-700">
                        Rp {(25000000 - currentPlan.totalPrice).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500">
                    Sistem akan langsung memotong saldo sangrAI Pay Anda secara real-time tanpa biaya admin tambahan.
                  </p>
                </div>
              )}

              {/* 4. GATEWAY CREDIT CARD */}
              {paymentMethod === 'credit_card' && (
                <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Nomor Kartu Kredit / Debit:</label>
                    <input
                      type="text"
                      readOnly
                      value="4111 2222 3333 4444 (Visa Platinum)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-mono font-bold text-stone-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Masa Berlaku:</label>
                      <input
                        type="text"
                        readOnly
                        value="12 / 28"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-mono text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">CVV:</label>
                      <input
                        type="text"
                        readOnly
                        value="888"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-mono text-stone-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons for Step 2 */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('config')}
                  className="px-4 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 cursor-pointer"
                >
                  &larr; Ganti Data / Metode
                </button>

                <button
                  type="button"
                  onClick={executeSubscriptionProcess}
                  className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Konfirmasi Pembayaran Selesai &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP PROCESSING LOADING STATE                                  */}
          {/* ============================================================== */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900">
                  Memverifikasi Pembayaran &amp; Mendaftarkan Lisensi Tenant...
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Menerbitkan hash SHA-256 kuitansi resmi atas nama <strong>{formData.organization}</strong> dan membuka 6 modul ekosistem rantai pasok.
                </p>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 3: OFFICIAL INVOICE & LUNAS RECEIPT                       */}
          {/* ============================================================== */}
          {step === 'receipt' && lastCreatedSub && (
            <div className="space-y-6 animate-in fade-in zoom-in-95">
              {/* Green Success Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                    Registrasi Tenant Sah &bull; Lisensi Langganan Aktif
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-emerald-950">
                    Paket {lastCreatedSub.tierName} Berhasil Diaktifkan!
                  </h4>
                  <p className="text-xs text-emerald-900">
                    Selamat <strong>{formData.name}</strong> ({formData.organization}). Seluruh 6 modul ekosistem dari Hulu Petani hingga Hilir Cafe &amp; Audit kini terbuka 100%.
                  </p>
                </div>
              </div>

              {/* Printable Official E-Receipt */}
              <div
                id="printable-receipt"
                className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-stone-200 shadow-sm space-y-4 relative overflow-hidden"
              >
                {/* Diagonal Stamp LUNAS */}
                <div className="absolute top-6 right-6 pointer-events-none select-none">
                  <div className="rotate-[-12deg] border-2 border-emerald-600 text-emerald-700 px-3 py-1 rounded-xl text-xs sm:text-sm font-mono font-black uppercase tracking-widest shadow-xs bg-emerald-50/80">
                    &bull; LUNAS / PAID &bull;
                  </div>
                </div>

                <div className="flex items-center gap-2.5 border-b border-stone-200 pb-3">
                  <Receipt className="w-5 h-5 text-amber-700" />
                  <div>
                    <h5 className="font-serif font-black text-sm text-stone-900">
                      FAKTUR RESMI &bull; sangrAI CIRCULAR TRACE
                    </h5>
                    <p className="text-[10px] text-stone-400 font-mono">
                      PT Sinergi Sirkular Kopi Indonesia &bull; NPWP: 01.889.332.1-014.000
                    </p>
                  </div>
                </div>

                {/* Details Grid populated with user input */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      Nomor Faktur / Invoice:
                    </span>
                    <span className="font-mono font-bold text-stone-800">
                      {lastCreatedInvoice?.invoiceNumber || 'INV/2026/11/CCT-8492'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      Nomor Resi / Receipt:
                    </span>
                    <span className="font-mono font-bold text-stone-800">
                      {lastCreatedInvoice?.receiptNumber || 'REC-83920192'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      Nama Penanggung Jawab (PIC):
                    </span>
                    <span className="font-bold text-stone-900">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      Nama Entitas / Usaha / Koperasi:
                    </span>
                    <span className="font-bold text-stone-900">{formData.organization}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      Email &amp; No. WhatsApp:
                    </span>
                    <span className="font-medium text-stone-800">{formData.email} &bull; {formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      Wilayah Operasional &amp; Domisili:
                    </span>
                    <span className="font-medium text-stone-800">{formData.cityAddress}, {formData.province}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      NPWP / NIK Terdaftar:
                    </span>
                    <span className="font-mono font-medium text-stone-800">{formData.taxId || 'Non-PKP / UMKM Pribadi'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      Waktu Transaksi Real-Time:
                    </span>
                    <span className="font-bold text-stone-800">
                      {lastCreatedSub.startDate} (Real-Time)
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      Masa Aktif Layanan:
                    </span>
                    <span className="font-bold text-stone-900">
                      {lastCreatedSub.startDate} s/d {lastCreatedSub.expiryDate}
                    </span>
                    <span className="text-[10px] text-emerald-700 block font-bold">
                      {lastCreatedSub.durationDays} Hari Penuh ({lastCreatedSub.daysRemaining} hari tersisa)
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      Metode Pembayaran:
                    </span>
                    <span className="font-bold uppercase text-stone-800">
                      {lastCreatedSub.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Pricing Line Items */}
                <div className="pt-3 border-t border-stone-100 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-600">
                      Sewa Lisensi Ekosistem: {lastCreatedSub.tierName}
                    </span>
                    <span className="font-mono font-bold text-stone-900">
                      Rp {lastCreatedSub.pricePaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-500">
                    <span>PPN 11% (Termasuk):</span>
                    <span className="font-mono">Rp 0 (All-in)</span>
                  </div>
                  <div className="flex justify-between font-black text-sm pt-2 border-t border-stone-200 text-stone-900">
                    <span>TOTAL DIBAYAR:</span>
                    <span className="text-emerald-700 text-base font-mono">
                      Rp {lastCreatedSub.pricePaid.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[10px] font-mono text-stone-500 flex items-center justify-between">
                  <span>SHA-256 Stamp Hash: 8f9b2c3a...e4d1</span>
                  <span className="text-emerald-700 font-bold">&check; Terverifikasi Sah &bull; Kemenkumham RI</span>
                </div>
              </div>

              {/* Action Buttons for Receipt */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-stone-600" />
                  <span>Cetak / Unduh Kuitansi</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('config');
                    setActivePlanId('1_year');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-stone-600" />
                  <span>Pilih Paket Lain</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFinishAndNavigate('dashboard')}
                  className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-emerald-200" />
                  <span>Masuk ke Dashboard Admin Saya (6 Layanan) &rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFinishAndNavigate('subscription')}
                  className="py-2.5 px-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kelola Langganan</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
