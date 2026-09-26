import React, { useState, useMemo } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { VerificationStampBadge } from '../shared/VerificationStampBadge';
import {
  ShieldCheck,
  Award,
  Coffee,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sliders,
  Sparkles,
  Search,
  Filter,
  Layers,
  MapPin,
  Calendar,
  Building,
  UserCheck,
  TrendingUp,
  FileCheck2,
  Compass,
  Check,
  RefreshCw,
  Eye,
  Plus,
  Sprout,
  Droplets,
  Scale,
} from 'lucide-react';
import {
  CoffeeFarm,
  FarmerHarvestLot,
  ProcessedGreenBeanLot,
  WarehouseLot,
  RoastedBeanLot,
  CafeRetailProduct,
  CuppingEvaluationData,
  VerifierDomain,
} from '../../types/coffee';

export const VerifierView: React.FC = () => {
  const {
    currentUser,
    verifierActiveTab,
    setVerifierActiveTab,
    coffeeFarms,
    farmerLots,
    processedLots,
    warehouseLots,
    roastedLots,
    cafeProducts,
    verificationStamps,
    issueVerificationStamp,
    revokeVerificationStamp,
  } = useCoffee();

  // Active sub-tab inside verifier view
  const activeDomain = verifierActiveTab;

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'unverified'>('all');

  // Interactive Cupping Modal state
  const [cuppingModalOpen, setCuppingModalOpen] = useState(false);
  const [selectedRoastLot, setSelectedRoastLot] = useState<RoastedBeanLot | null>(null);

  // Cupping form inputs (10 SCA attributes)
  const [cuppingForm, setCuppingForm] = useState<CuppingEvaluationData>({
    fragranceAroma: 8.5,
    flavor: 8.5,
    aftertaste: 8.25,
    acidity: 8.5,
    body: 8.25,
    balance: 8.5,
    cleanCup: 10.0,
    sweetness: 10.0,
    uniformity: 10.0,
    overall: 8.5,
    totalScore: 89.0,
    tastingNotes: ['Jasmine Floral', 'Peach Blossom', 'Cane Sugar Sweetness', 'Citrus Acidity'],
    defectDeduction: 0,
    defectNotes: '',
    roastEvaluation: 'Optimal Specialty',
    recommendationRestDays: 10,
  });

  const [auditorNotes, setAuditorNotes] = useState('');
  const [newNoteInput, setNewNoteInput] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Harvest Lot Verification States (Petani Domain)
  const [farmerSubSection, setFarmerSubSection] = useState<'harvest' | 'farms'>('harvest');
  const [harvestModalOpen, setHarvestModalOpen] = useState(false);
  const [selectedHarvestLot, setSelectedHarvestLot] = useState<FarmerHarvestLot | null>(null);
  const [harvestBrix, setHarvestBrix] = useState<number>(22.0);
  const [harvestRipePercent, setHarvestRipePercent] = useState<number>(98);
  const [harvestFloatersPercent, setHarvestFloatersPercent] = useState<number>(0);
  const [harvestStampTitle, setHarvestStampTitle] = useState('Standar Mutu Petik Merah & Brix Terverifikasi');
  const [harvestNotes, setHarvestNotes] = useState('');

  // General Stamp Issuance Modal (for non-roast domains: Petani, Pengolah, Gudang, Cafe)
  const [genericModalOpen, setGenericModalOpen] = useState(false);
  const [genericTarget, setGenericTarget] = useState<{
    type: 'farm' | 'harvest' | 'processed' | 'warehouse' | 'cafe';
    id: string;
    title: string;
    subTitle: string;
  } | null>(null);
  const [genericTitle, setGenericTitle] = useState('');
  const [genericScoreDisplay, setGenericScoreDisplay] = useState('');
  const [genericNotes, setGenericNotes] = useState('');

  // Calculate total cupping score reactively
  const calculateTotalScore = (form: CuppingEvaluationData) => {
    const raw =
      form.fragranceAroma +
      form.flavor +
      form.aftertaste +
      form.acidity +
      form.body +
      form.balance +
      form.cleanCup +
      form.sweetness +
      form.uniformity +
      form.overall -
      (form.defectDeduction || 0);
    return Number(Math.max(0, Math.min(100, raw)).toFixed(2));
  };

  const handleAttributeChange = (key: keyof CuppingEvaluationData, val: number) => {
    setCuppingForm((prev) => {
      const updated = { ...prev, [key]: val };
      updated.totalScore = calculateTotalScore(updated);
      return updated;
    });
  };

  const openCuppingModal = (lot: RoastedBeanLot) => {
    setSelectedRoastLot(lot);
    const existing = lot.verificationStamp?.cuppingEvaluation;
    if (existing) {
      setCuppingForm(existing);
      setAuditorNotes(lot.verificationStamp?.notes || '');
    } else {
      setCuppingForm({
        fragranceAroma: 8.5,
        flavor: 8.5,
        aftertaste: 8.25,
        acidity: 8.5,
        body: 8.25,
        balance: 8.5,
        cleanCup: 10.0,
        sweetness: 10.0,
        uniformity: 10.0,
        overall: 8.5,
        totalScore: 89.0,
        tastingNotes: lot.tastingNotes.length > 0 ? [...lot.tastingNotes] : ['Jasmine Floral', 'Peach Blossom', 'Cane Sugar'],
        defectDeduction: 0,
        defectNotes: '',
        roastEvaluation: 'Optimal Specialty',
        recommendationRestDays: 10,
      });
      setAuditorNotes(
        `Hasil uji cicip sensori independen oleh ${currentUser?.name || 'Q-Grader'}. Profil sangrai merata, ekstraksi optimal dengan body halus dan keasaman seimbang.`
      );
    }
    setCuppingModalOpen(true);
  };

  const handleAddTastingNote = () => {
    if (newNoteInput.trim() && !cuppingForm.tastingNotes.includes(newNoteInput.trim())) {
      setCuppingForm((prev) => ({
        ...prev,
        tastingNotes: [...prev.tastingNotes, newNoteInput.trim()],
      }));
      setNewNoteInput('');
    }
  };

  const handleRemoveTastingNote = (noteToRemove: string) => {
    setCuppingForm((prev) => ({
      ...prev,
      tastingNotes: prev.tastingNotes.filter((n) => n !== noteToRemove),
    }));
  };

  const handleSubmitCuppingStamp = () => {
    if (!selectedRoastLot) return;

    const res = issueVerificationStamp({
      targetType: 'roasted',
      targetId: selectedRoastLot.id,
      stampType: 'roast_cupping',
      title: 'SCA Cupped & Certified Specialty Roast',
      scoreDisplay: `${cuppingForm.totalScore} SCA Cupping Score (${
        cuppingForm.totalScore >= 85 ? 'Specialty Grade 1' : 'Specialty Grade'
      })`,
      notes: auditorNotes,
      cuppingEvaluation: cuppingForm,
    });

    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setCuppingModalOpen(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Harvest Quality Audit Modal Handler
  const openHarvestModal = (lot: FarmerHarvestLot) => {
    setSelectedHarvestLot(lot);
    setHarvestBrix(lot.brix || 22.0);
    setHarvestRipePercent(98);
    setHarvestFloatersPercent(0);
    setHarvestStampTitle('Standar Mutu Petik Merah & Brix Terverifikasi');
    if (lot.verificationStamp?.notes) {
      setHarvestNotes(lot.verificationStamp.notes);
    } else {
      setHarvestNotes(
        `Hasil inspeksi lapangan oleh ${currentUser?.name || 'Verifikator Mutu Petani'}. Tingkat kemanisan ceri teruji refraktometer ${lot.brix}° Brix. Rasio petik merah 98%, zero floaters, memenuhi standar specialty coffee.`
      );
    }
    setHarvestModalOpen(true);
  };

  const handleSubmitHarvestStamp = () => {
    if (!selectedHarvestLot) return;

    const gradeText =
      harvestBrix >= 21 && harvestRipePercent >= 95
        ? 'Grade A+'
        : harvestBrix >= 19
        ? 'Grade A'
        : 'Standard';

    const res = issueVerificationStamp({
      targetType: 'harvest',
      targetId: selectedHarvestLot.id,
      stampType: 'harvest_quality',
      title: harvestStampTitle,
      scoreDisplay: `Brix ${harvestBrix.toFixed(1)}° • ${harvestRipePercent}% Petik Merah (${gradeText})`,
      notes: harvestNotes,
    });

    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setHarvestModalOpen(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const openGenericModal = (
    type: 'farm' | 'harvest' | 'processed' | 'warehouse' | 'cafe',
    id: string,
    title: string,
    subTitle: string
  ) => {
    setGenericTarget({ type, id, title, subTitle });
    if (type === 'farm') {
      setGenericTitle('EUDR & Geolocation Verified');
      setGenericScoreDisplay('100% Deforestation-Free & GPS Polygon Mapped');
      setGenericNotes(
        'Lahan terverifikasi bebas deforestasi pasca 2020 sesuai regulasi EUDR Regulation (EU) 2023/1115. Koordinat patok batas BPN akurat dan valid.'
      );
    } else if (type === 'harvest') {
      setGenericTitle('Standar Mutu Petik Merah & Brix Terverifikasi');
      setGenericScoreDisplay('Brix 22.0° • 98% Petik Merah (Grade A+)');
      setGenericNotes(
        'Kualitas ceri segar terverifikasi dengan tingkat kemanisan optimal, pemilahan petik merah specialty, dan bebas cacat buah.'
      );
    } else if (type === 'processed') {
      setGenericTitle('Zero-Waste Mill & Quality Verified');
      setGenericScoreDisplay('Eco-Rating 95/100 (A+) Zero Effluent');
      setGenericNotes(
        'Stasiun pengolahan basah dan kering menerapkan daur ulang limbah pulp organik dan kolam filtrasi anaerobik berstandar lingkungan.'
      );
    } else if (type === 'warehouse') {
      setGenericTitle('Warehouse QA & Hermetic Storage Certified');
      setGenericScoreDisplay('Grade 1 Super Premium • Hermetic Seal Validated');
      setGenericNotes(
        'Fasilitas gudang menjaga kelembaban optimal 60-65% RH dan suhu 18-20°C dengan kemasan hermetik bebas kutu dan jamur.'
      );
    } else if (type === 'cafe') {
      setGenericTitle('Specialty Bar & Food Safety Certified');
      setGenericScoreDisplay('SCA Barista Standards Passed • Hygiene Grade A');
      setGenericNotes(
        'Peralatan seduh, air filter mineralisasi terkalibrasi, serta rotasi FIFO biji sangrai terverifikasi sesuai protokol specialty.'
      );
    }
    setGenericModalOpen(true);
  };

  const handleSubmitGenericStamp = () => {
    if (!genericTarget) return;

    const stampTypeMap: Record<string, any> = {
      farm: 'eudr_farm',
      harvest: 'harvest_quality',
      processed: 'processing_mill',
      warehouse: 'warehouse_silo',
      cafe: 'cafe_safety',
    };

    const res = issueVerificationStamp({
      targetType: genericTarget.type,
      targetId: genericTarget.id,
      stampType: stampTypeMap[genericTarget.type] || 'eudr_farm',
      title: genericTitle,
      scoreDisplay: genericScoreDisplay,
      notes: genericNotes,
    });

    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setGenericModalOpen(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Quick stats calculation
  const stats = useMemo(() => {
    const verifiedFarms = coffeeFarms.filter((f) => f.verificationStatus === 'verified').length;
    const verifiedHarvests = farmerLots.filter((h) => h.verificationStatus === 'verified').length;
    const verifiedMills = processedLots.filter((p) => p.verificationStatus === 'verified').length;
    const verifiedWarehouses = warehouseLots.filter((w) => w.verificationStatus === 'verified').length;
    const verifiedRoasts = roastedLots.filter((r) => r.verificationStatus === 'verified').length;
    const verifiedCafes = cafeProducts.filter((c) => c.verificationStatus === 'verified').length;

    const pendingRoasts = roastedLots.filter((r) => r.verificationStatus === 'pending').length;
    const pendingFarms = coffeeFarms.filter((f) => f.verificationStatus === 'pending').length;
    const pendingHarvests = farmerLots.filter((h) => h.verificationStatus === 'pending').length;

    const roastScores = roastedLots
      .filter((r) => r.verificationStamp?.cuppingEvaluation)
      .map((r) => r.verificationStamp!.cuppingEvaluation!.totalScore);
    const avgCuppingScore =
      roastScores.length > 0 ? (roastScores.reduce((a, b) => a + b, 0) / roastScores.length).toFixed(1) : '87.5';

    return {
      totalVerified: verifiedFarms + verifiedHarvests + verifiedMills + verifiedWarehouses + verifiedRoasts + verifiedCafes,
      pendingTotal: pendingRoasts + pendingFarms + pendingHarvests,
      avgCuppingScore,
      totalStamps: verificationStamps.length,
    };
  }, [coffeeFarms, processedLots, warehouseLots, roastedLots, cafeProducts, verificationStamps]);

  // Auditor domain badge / header info
  const domainInfo: Record<
    VerifierDomain,
    { title: string; subtitle: string; icon: any; color: string }
  > = {
    petani: {
      title: 'Verifikasi Lahan & Kebun Petani (EUDR)',
      subtitle: 'Audit Geolokasi, 100% Bebas Deforestasi & Good Agricultural Practices (GAP)',
      icon: MapPin,
      color: 'from-emerald-600 to-teal-700',
    },
    pengolah: {
      title: 'Verifikasi Stasiun Pengolahan (Mill QA)',
      subtitle: 'Audit Zero Waste, Standar Fermentasi, Kadar Air & Sortasi Biji Hijau',
      icon: Award,
      color: 'from-cyan-600 to-blue-700',
    },
    gudang: {
      title: 'Verifikasi Gudang & Pergudangan Ekspor',
      subtitle: 'Audit Suhu, RH, Kemasan Hermetik, Green Bean Grading & Standard SCA',
      icon: FileCheck2,
      color: 'from-indigo-600 to-purple-700',
    },
    roaster: {
      title: 'Lab Uji Cicip Sensori SCA & Roastery Audit',
      subtitle: 'Tugas Utama: Mencicipi (Cupping) Biji Sangrai & Menilai 10 Atribut Specialty SCA',
      icon: Coffee,
      color: 'from-amber-600 to-amber-800',
    },
    cafe: {
      title: 'Verifikasi Higienitas & Specialty Bar Kafe',
      subtitle: 'Audit Kalibrasi Ekstraksi Espresso, Manajemen FIFO Biji & Higienitas Bar',
      icon: CheckCircle2,
      color: 'from-rose-600 to-pink-700',
    },
    all: {
      title: 'Dewan Audit & Verifikasi Nasional',
      subtitle: 'Semua domain rantai pasok kopi dari hulu ke hilir',
      icon: ShieldCheck,
      color: 'from-purple-600 to-indigo-800',
    },
  };

  const currentDomainInfo = domainInfo[activeDomain === 'history' ? 'all' : (activeDomain as VerifierDomain)] || domainInfo.all;
  const CurrentIcon = currentDomainInfo.icon;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-rose-600 text-white border-rose-500'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Verifier Hero Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-r ${currentDomainInfo.color} text-white shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              Portal Dewan Verifikator & Auditor Kualitas
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{currentDomainInfo.title}</h1>
            <p className="text-white/90 text-sm max-w-2xl">{currentDomainInfo.subtitle}</p>

            {currentUser && (
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-white/80">
                <span className="flex items-center gap-1.5 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                  Auditor: <strong className="text-white">{currentUser.name}</strong>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Building className="w-3.5 h-3.5 text-amber-300" />
                  Lembaga: <strong className="text-white">{currentUser.organization}</strong>
                </span>
                {currentUser.verifierDomain && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-bold uppercase text-[10px]">
                    Spesialis {currentUser.verifierDomain}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Key Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 text-center">
              <div className="text-2xl font-black text-white">{stats.totalVerified}</div>
              <div className="text-[11px] text-white/80 font-medium">Lot Terverifikasi</div>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 text-center">
              <div className="text-2xl font-black text-amber-300">{stats.pendingTotal}</div>
              <div className="text-[11px] text-white/80 font-medium">Menunggu Uji</div>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 text-center">
              <div className="text-2xl font-black text-emerald-300">{stats.avgCuppingScore}</div>
              <div className="text-[11px] text-white/80 font-medium">Rata-rata SCA</div>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 text-center">
              <div className="text-2xl font-black text-white">{stats.totalStamps}</div>
              <div className="text-[11px] text-white/80 font-medium">Stempel Sah</div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'petani', label: '1. Petani & Lahan EUDR', icon: MapPin },
          { id: 'pengolah', label: '2. Stasiun Pengolah (Mill)', icon: Award },
          { id: 'gudang', label: '3. Pergudangan & Ekspor', icon: FileCheck2 },
          { id: 'roaster', label: '4. Roastery & Cupping Lab (Cicip Kopi)', icon: Coffee, highlight: true },
          { id: 'cafe', label: '5. Kafe & Barista Bar', icon: CheckCircle2 },
          { id: 'history', label: 'Riwayat Seluruh Stempel', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDomain === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setVerifierActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              } ${tab.highlight && !isActive ? 'ring-1 ring-amber-400/60 dark:ring-amber-500/50' : ''}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.highlight ? 'text-amber-500' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.highlight && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400 text-slate-900 uppercase">
                  Wajib Cicip
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari ID lot, nama kebun, varietas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Semua Status Audit</option>
            <option value="pending">Menunggu Audit</option>
            <option value="verified">Sudah Terverifikasi</option>
            <option value="unverified">Belum Diverifikasi</option>
          </select>
        </div>
      </div>

      {/* TAB CONTENT: ROASTERY & CUPPING LAB (SPECIALTY TASTING) */}
      {activeDomain === 'roaster' && (
        <div className="space-y-6">
          {/* Roaster Verifier Highlight Callout */}
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 shrink-0">
                <Coffee className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  Tugas Khusus Q-Grader: Uji Cicip Sensori Biji Kopi Sangrai
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                    SCA Standard
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
                  Sesuai mandat standar specialty, verifikator roastery wajib mencicipi langsung (cupping) seduhan kopi dari setiap batch sangrai. Anda mengisi lembar penilaian 10 atribut sensori SCA (Aroma, Keasaman, Aftertaste, Body, Sweetness, dll) sebelum memberikan stempel verifikasi emas resmi.
                </p>
              </div>
            </div>
          </div>

          {/* List of Roasted Lots for Cupping */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roastedLots
              .filter((lot) => {
                const matchesSearch =
                  lot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  lot.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  lot.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  lot.roasterName.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus =
                  filterStatus === 'all' ||
                  (filterStatus === 'verified' && lot.verificationStatus === 'verified') ||
                  (filterStatus === 'pending' && lot.verificationStatus === 'pending') ||
                  (filterStatus === 'unverified' && (!lot.verificationStatus || lot.verificationStatus === 'unverified'));
                return matchesSearch && matchesStatus;
              })
              .map((lot) => {
                const isVerified = lot.verificationStatus === 'verified';
                const isPending = lot.verificationStatus === 'pending';
                return (
                  <div
                    key={lot.id}
                    className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                      isVerified
                        ? 'border-amber-300 dark:border-amber-700/60 shadow-md'
                        : isPending
                        ? 'border-amber-200 dark:border-amber-800 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Image & Header */}
                      <div className="relative h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={lot.photoUrl || 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop&q=80'}
                          alt={lot.variety}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <VerificationStampBadge stamp={lot.verificationStamp} status={lot.verificationStatus} size="sm" />
                        </div>
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-semibold">
                          Agtron #{lot.agtronNumber} • DTR {lot.developmentTimeRatio}%
                        </div>
                      </div>

                      {/* Lot Info */}
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>{lot.id}</span>
                          <span>Tgl Sangrai: {lot.roastDate}</span>
                        </div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                          {lot.origin} - {lot.variety}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Roaster: <strong className="text-slate-700 dark:text-slate-300">{lot.roasterName}</strong> ({lot.roasterMachine})
                        </p>
                      </div>

                      {/* Current Score & Notes */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Skor Cupping:</span>
                          <span className="font-bold text-sm text-amber-600 dark:text-amber-400">
                            {lot.scaCuppingScore} SCA Score
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Profil Sangrai:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{lot.roastLevel}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {lot.tastingNotes.map((note, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Cupping Details if Verified */}
                      {lot.verificationStamp?.cuppingEvaluation && (
                        <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/30 dark:bg-emerald-950/20 text-xs">
                          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 font-bold mb-1">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              Telah Dicicipi & Lulus
                            </span>
                            <span>{lot.verificationStamp.cuppingEvaluation.totalScore} Poin</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                            {lot.verificationStamp.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => openCuppingModal(lot)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          isVerified
                            ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-100 border border-amber-300 dark:border-amber-700'
                            : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md shadow-amber-600/30'
                        }`}
                      >
                        <Coffee className="w-4 h-4" />
                        <span>{isVerified ? 'Evaluasi Ulang Sensori' : 'Cicip Kopi & Isi SCA Sheet'}</span>
                      </button>

                      {isVerified && (
                        <button
                          onClick={() => revokeVerificationStamp('roasted', lot.id)}
                          className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium"
                          title="Cabut Sertifikat Stempel"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PETANI (HASIL PANEN CERI & LAHAN EUDR) */}
      {activeDomain === 'petani' && (
        <div className="space-y-6">
          {/* Sub-tab Switcher: Panen Ceri vs Lahan Kebun */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-md">
            <button
              onClick={() => setFarmerSubSection('harvest')}
              className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                farmerSubSection === 'harvest'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>Hasil Panen Ceri</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  farmerSubSection === 'harvest'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {farmerLots.length}
              </span>
            </button>

            <button
              onClick={() => setFarmerSubSection('farms')}
              className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                farmerSubSection === 'farms'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Lahan & Kebun EUDR</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  farmerSubSection === 'farms'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {coffeeFarms.length}
              </span>
            </button>
          </div>

          {/* SUB-SECTION 1: HASIL PANEN CERI PETANI */}
          {farmerSubSection === 'harvest' && (
            <div className="space-y-6">
              {/* Highlight Banner */}
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 shrink-0">
                    <Sprout className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                      Verifikasi Mutu & Data Panen Ceri Petani
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                        Uji Kemanisan Brix & Petik Merah
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
                      Semua data panen yang diinput petani diaudit oleh verifikator: kalibrasi refraktometer kadar gula ceri (°Brix), rasio petik merah selective hand-picking, uji floaters, serta kesesuaian koordinat kebun sebelum ceri diserahkan ke stasiun pengolah.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid of Farmer Harvest Lots */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmerLots
                  .filter((lot) => {
                    const matchesSearch =
                      lot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      lot.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      lot.farmLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      lot.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (lot.farmName && lot.farmName.toLowerCase().includes(searchTerm.toLowerCase()));
                    const matchesStatus =
                      filterStatus === 'all' ||
                      (filterStatus === 'verified' && lot.verificationStatus === 'verified') ||
                      (filterStatus === 'pending' && lot.verificationStatus === 'pending') ||
                      (filterStatus === 'unverified' && (!lot.verificationStatus || lot.verificationStatus === 'unverified'));
                    return matchesSearch && matchesStatus;
                  })
                  .map((lot) => {
                    const isVerified = lot.verificationStatus === 'verified';
                    const isPending = lot.verificationStatus === 'pending';
                    return (
                      <div
                        key={lot.id}
                        className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                          isVerified
                            ? 'border-emerald-300 dark:border-emerald-700/60 shadow-md'
                            : isPending
                            ? 'border-amber-200 dark:border-amber-800/80 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 shadow-sm'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">{lot.id}</span>
                            <VerificationStampBadge stamp={lot.verificationStamp} status={lot.verificationStatus} size="sm" />
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-base text-slate-900 dark:text-white">{lot.variety}</h4>
                              <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                                {lot.brix}° Brix
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Petani: <strong className="text-slate-700 dark:text-slate-300">{lot.farmerName}</strong></p>
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 shrink-0" /> {lot.farmName ? `${lot.farmName} • ` : ''}{lot.farmLocation} ({lot.altitude})
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Tgl Panen:</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">{lot.harvestDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Standar Petik:</span>
                              <span className="font-semibold text-emerald-700 dark:text-emerald-300">{lot.pickingMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Berat Panen:</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">{lot.availableWeightKg} / {lot.totalWeightKg} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Harga Penawaran:</span>
                              <span className="font-semibold text-slate-900 dark:text-white">Rp {lot.pricePerKg.toLocaleString()} / kg</span>
                            </div>
                            {lot.weatherSnapshot && (
                              <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-400">
                                <span>Cuaca Panen:</span>
                                <span>{lot.weatherSnapshot.currentCondition} • {lot.weatherSnapshot.temperatureCelsius}°C</span>
                              </div>
                            )}
                          </div>

                          {/* Verified Stamp Details */}
                          {isVerified && lot.verificationStamp && (
                            <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-xs">
                              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 font-bold mb-1">
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  Mutu Panen Sah Terverifikasi
                                </span>
                                <span className="text-[11px]">{lot.verificationStamp.scoreDisplay}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                                {lot.verificationStamp.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                          <button
                            onClick={() => openHarvestModal(lot)}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                              isVerified
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                            }`}
                          >
                            <Sprout className="w-4 h-4" />
                            <span>{isVerified ? 'Perbarui Stempel Mutu Panen' : 'Inspeksi & Beri Stempel Mutu'}</span>
                          </button>

                          {isVerified && (
                            <button
                              onClick={() => revokeVerificationStamp('harvest', lot.id)}
                              className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs"
                              title="Cabut Stempel Mutu"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* SUB-SECTION 2: LAHAN & KEBUN EUDR */}
          {farmerSubSection === 'farms' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coffeeFarms
                  .filter((farm) => {
                    const matchesSearch =
                      farm.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      farm.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      farm.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      farm.location.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesStatus =
                      filterStatus === 'all' ||
                      (filterStatus === 'verified' && farm.verificationStatus === 'verified') ||
                      (filterStatus === 'pending' && farm.verificationStatus === 'pending') ||
                      (filterStatus === 'unverified' && (!farm.verificationStatus || farm.verificationStatus === 'unverified'));
                    return matchesSearch && matchesStatus;
                  })
                  .map((farm) => {
                    const isVerified = farm.verificationStatus === 'verified';
                    return (
                      <div
                        key={farm.id}
                        className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                          isVerified
                            ? 'border-emerald-300 dark:border-emerald-700/60 shadow-md'
                            : 'border-slate-200 dark:border-slate-800 shadow-sm'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100">
                            <img src={farm.photoUrl} alt={farm.farmName} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3">
                              <VerificationStampBadge stamp={farm.verificationStamp} status={farm.verificationStatus} size="sm" />
                            </div>
                            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs">
                              {farm.altitudeDisplay}
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>{farm.id}</span>
                              <span>{farm.landAreaHectares} Ha • {farm.totalTreesCount} Pohon</span>
                            </div>
                            <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">{farm.farmName}</h4>
                            <p className="text-xs text-slate-500">Petani: {farm.farmerName}</p>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3 shrink-0" /> {farm.location}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Patok Batas:</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {farm.patokList ? `${farm.patokList.length} Patok BPN Terdaftar` : 'Standar Radius'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Kepatuhan EUDR:</span>
                              <span className="font-semibold text-emerald-600">
                                {farm.eudrCompliant ? 'Bebas Deforestasi 100%' : 'Sedang Verifikasi'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                          <button
                            onClick={() => openGenericModal('farm', farm.id, farm.farmName, farm.location)}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                              isVerified
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                            }`}
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>{isVerified ? 'Perbarui Stempel EUDR' : 'Audit & Beri Stempel EUDR'}</span>
                          </button>

                          {isVerified && (
                            <button
                              onClick={() => revokeVerificationStamp('farm', farm.id)}
                              className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs"
                              title="Cabut Stempel"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: PENGOLAH (MILL QA) */}
      {activeDomain === 'pengolah' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedLots.map((lot) => {
              const isVerified = lot.verificationStatus === 'verified';
              return (
                <div
                  key={lot.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                    isVerified
                      ? 'border-cyan-300 dark:border-cyan-700/60 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono text-slate-400">{lot.id}</span>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">
                          {lot.variety} ({lot.processMethod})
                        </h4>
                        <p className="text-xs text-slate-500">Stasiun: {lot.processorName}</p>
                      </div>
                      <VerificationStampBadge stamp={lot.verificationStamp} status={lot.verificationStatus} size="sm" />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Kadar Air:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{lot.moistureContentPercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sortasi Defect:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{lot.defectCount} / 350g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Grade Olahan:</span>
                        <span className="font-bold text-cyan-600">{lot.grade}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => openGenericModal('processed', lot.id, `Green Bean ${lot.variety}`, lot.processorName)}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md"
                    >
                      <Award className="w-4 h-4" />
                      <span>{isVerified ? 'Perbarui Stempel Mill QA' : 'Beri Stempel Mill QA'}</span>
                    </button>
                    {isVerified && (
                      <button
                        onClick={() => revokeVerificationStamp('processed', lot.id)}
                        className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: GUDANG (WAREHOUSE QA) */}
      {activeDomain === 'gudang' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouseLots.map((lot) => {
              const isVerified = lot.verificationStatus === 'verified';
              return (
                <div
                  key={lot.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                    isVerified
                      ? 'border-indigo-300 dark:border-indigo-700/60 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono text-slate-400">{lot.id}</span>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">
                          {lot.variety} • {lot.gradeTier || 'Grade 1'}
                        </h4>
                        <p className="text-xs text-slate-500">Gudang: {lot.warehouseName}</p>
                      </div>
                      <VerificationStampBadge stamp={lot.verificationStamp} status={lot.verificationStatus} size="sm" />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Suhu & RH:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {lot.temperatureCelsius}°C • {lot.humidityPercent}% RH
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Kemasan:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{lot.packagingType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">SCA Pre-Roast:</span>
                        <span className="font-bold text-indigo-600">{lot.verifiedScaScore} Poin</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                        <span className="text-slate-500">Health Certificate:</span>
                        {lot.hasHealthCertificate ? (
                          <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-[11px] border border-emerald-200 dark:border-emerald-800">
                            {lot.healthCertificateNumber || 'HC Certified'}
                          </span>
                        ) : (
                          <span className="font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                            No Health Certificate
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => openGenericModal('warehouse', lot.id, `Lot Gudang ${lot.variety}`, lot.warehouseName)}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-md"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      <span>{isVerified ? 'Perbarui Stempel Gudang' : 'Beri Stempel Gudang QA'}</span>
                    </button>
                    {isVerified && (
                      <button
                        onClick={() => revokeVerificationStamp('warehouse', lot.id)}
                        className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CAFE (BARISTA QA) */}
      {activeDomain === 'cafe' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cafeProducts.map((prod) => {
              const isVerified = prod.verificationStatus === 'verified';
              return (
                <div
                  key={prod.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                    isVerified
                      ? 'border-rose-300 dark:border-rose-700/60 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono text-slate-400">{prod.id}</span>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">{prod.name}</h4>
                        <p className="text-xs text-slate-500">Kafe: {prod.cafeName}</p>
                      </div>
                      <VerificationStampBadge stamp={prod.verificationStamp} status={prod.verificationStatus} size="sm" />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Kemasan:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{prod.packageUnit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Stok:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{prod.availableStock} Unit</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => openGenericModal('cafe', prod.id, prod.name, prod.cafeName)}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-700 text-white shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isVerified ? 'Perbarui Stempel Barista' : 'Beri Stempel Kafe QA'}</span>
                    </button>
                    {isVerified && (
                      <button
                        onClick={() => revokeVerificationStamp('cafe', prod.id)}
                        className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: HISTORY STEMPEL AUDIT */}
      {activeDomain === 'history' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Daftar Seluruh Stempel Digital Diterbitkan
              </h3>
              <p className="text-xs text-slate-500">
                Log sertifikasi kriptografis yang sah dan terdaftar pada database Circular Coffee Trace.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200">
              {verificationStamps.length} Stempel Aktif
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {verificationStamps.map((stamp) => (
              <div key={stamp.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <VerificationStampBadge stamp={stamp} size="sm" />
                    <span className="text-xs font-mono text-slate-500">#{stamp.certificateNumber}</span>
                    <span className="text-xs text-slate-400">• {stamp.verifiedAt}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{stamp.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl">{stamp.notes}</p>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Hash: {stamp.digitalSignatureHash}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{stamp.verifierName}</div>
                  <div className="text-[11px] text-slate-500">{stamp.verifierTitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: INTERACTIVE SCA CUPPING LAB FOR ROASTED COFFEE */}
      {cuppingModalOpen && selectedRoastLot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
          onClick={() => setCuppingModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-white rounded-t-3xl relative">
              <button
                onClick={() => setCuppingModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20">
                  <Coffee className="w-8 h-8 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                      Uji Cicip Kopi Sangrai (Cupping Lab)
                    </span>
                    <span className="text-xs text-white/80">#{selectedRoastLot.id}</span>
                  </div>
                  <h3 className="text-xl font-bold mt-1 text-white">
                    {selectedRoastLot.origin} - {selectedRoastLot.variety}
                  </h3>
                  <p className="text-xs text-white/80">
                    Roaster: {selectedRoastLot.roasterName} • {selectedRoastLot.roastLevel} • Agtron #{selectedRoastLot.agtronNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Score Display Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/80 dark:from-amber-950/50 dark:to-amber-900/30 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    Skor Akhir SCA Specialty Cupping
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                      {cuppingForm.totalScore.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">/ 100 Poin</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {cuppingForm.totalScore >= 85
                      ? '⭐ Kategori Specialty Grade 1 (Excellent / Cup of Excellence standard)'
                      : cuppingForm.totalScore >= 80
                      ? '✓ Kategori Specialty Coffee (Standard SCA)'
                      : 'Commercial Grade (Dibawah 80.00)'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="px-4 py-2 rounded-xl text-sm font-bold bg-amber-500 text-white shadow-md inline-block">
                    {cuppingForm.roastEvaluation}
                  </span>
                </div>
              </div>

              {/* 10 SCA Attributes Sliders */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Penilaian 10 Parameter Sensori SCA (Rentang 6.00 - 10.00)</span>
                  <span className="text-[11px] text-amber-600">Geser untuk mengubah nilai</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'fragranceAroma', label: '1. Fragrance / Aroma (Kering & Basah)' },
                    { key: 'flavor', label: '2. Flavor (Karakter Rasa Utama)' },
                    { key: 'aftertaste', label: '3. Aftertaste (Kesan Akhir di Tenggorokan)' },
                    { key: 'acidity', label: '4. Acidity (Tingkat & Kualitas Keasaman)' },
                    { key: 'body', label: '5. Body (Ketebalan & Tekstur di Lidah)' },
                    { key: 'balance', label: '6. Balance (Keseimbangan Seluruh Parameter)' },
                    { key: 'cleanCup', label: '7. Clean Cup (Kebersihan Rasa, Zero Defect)' },
                    { key: 'sweetness', label: '8. Sweetness (Kemanisan Alami Biji)' },
                    { key: 'uniformity', label: '9. Uniformity (Keseragaman Rasa Tiap Cangkir)' },
                    { key: 'overall', label: '10. Overall (Penilaian Menyeluruh Q-Grader)' },
                  ].map((attr) => {
                    const val = (cuppingForm as any)[attr.key] as number;
                    return (
                      <div key={attr.key} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
                        <div className="flex justify-between items-center mb-1.5 text-xs">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{attr.label}</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400 font-mono text-sm">
                            {val.toFixed(2)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="6.00"
                          max="10.00"
                          step="0.25"
                          value={val}
                          onChange={(e) => handleAttributeChange(attr.key as any, parseFloat(e.target.value))}
                          className="w-full accent-amber-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tasting Notes Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Catatan Rasa Spesifik (Tasting Notes)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {cuppingForm.tastingNotes.map((note) => (
                    <span
                      key={note}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
                    >
                      {note}
                      <button
                        type="button"
                        onClick={() => handleRemoveTastingNote(note)}
                        className="hover:text-rose-600 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tambah catatan rasa (contoh: Bergamot, Melati, Dark Chocolate)..."
                    value={newNoteInput}
                    onChange={(e) => setNewNoteInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTastingNote())}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTastingNote}
                    className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Roast Evaluation & Resting Recommendation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Evaluasi Kualitas Sangrai (Roast Quality)
                  </label>
                  <select
                    value={cuppingForm.roastEvaluation}
                    onChange={(e) =>
                      setCuppingForm((prev) => ({ ...prev, roastEvaluation: e.target.value as any }))
                    }
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                  >
                    <option value="Optimal Specialty">Optimal Specialty (Pengembangan Sempurna)</option>
                    <option value="Underdeveloped">Underdeveloped (Kurang Matang di Inti Biji)</option>
                    <option value="Baked">Baked (Waktu Panggang Terlalu Lambat / Flat)</option>
                    <option value="Overdeveloped">Overdeveloped (Terlalu Gosong / Karamelisasi Berlebih)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Rekomendasi Resting Biji (Degassing)
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={cuppingForm.recommendationRestDays}
                      onChange={(e) =>
                        setCuppingForm((prev) => ({
                          ...prev,
                          recommendationRestDays: parseInt(e.target.value) || 7,
                        }))
                      }
                      className="w-24 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-center"
                    />
                    <span className="text-xs text-slate-500">Hari sebelum diseduh</span>
                  </div>
                </div>
              </div>

              {/* Auditor Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Catatan Resmi Auditor / Q-Grader (Akan tertera di sertifikat)
                </label>
                <textarea
                  rows={3}
                  value={auditorNotes}
                  onChange={(e) => setAuditorNotes(e.target.value)}
                  placeholder="Deskripsikan profil rasa cangkir, kebersihan ekstraksi, dan justifikasi stempel mutu..."
                  className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 rounded-b-3xl flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCuppingModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSubmitCuppingStamp}
                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-200" />
                <span>Terbitkan Stempel Emas SCA Cupped & Certified</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HARVEST QUALITY INSPECTION & STAMP ISSUANCE */}
      {harvestModalOpen && selectedHarvestLot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setHarvestModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 sm:p-7 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sprout className="w-3.5 h-3.5" />
                  Inspeksi Mutu Panen Ceri Petani
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedHarvestLot.variety} &bull; {selectedHarvestLot.id}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Petani: <strong className="text-slate-700 dark:text-slate-300">{selectedHarvestLot.farmerName}</strong> &bull; Kebun: {selectedHarvestLot.farmLocation}
                </p>
              </div>
              <button
                onClick={() => setHarvestModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Quality Metrics Form */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200 text-[11px]">
                    Hasil Uji Laboratorium Mutu Ceri
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white">
                    {harvestBrix >= 21 && harvestRipePercent >= 95
                      ? 'Grade A+ Specialty'
                      : harvestBrix >= 19
                      ? 'Grade A Premium'
                      : 'Komersial / Standar'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Kemanisan Brix (°Brix)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.1"
                        min="10"
                        max="32"
                        value={harvestBrix}
                        onChange={(e) => setHarvestBrix(parseFloat(e.target.value) || 0)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-black text-emerald-700 dark:text-emerald-400 text-base"
                      />
                      <span className="font-bold text-slate-400">°Bx</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Refraktometer Optik</span>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Rasio Petik Merah (%)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={harvestRipePercent}
                        onChange={(e) => setHarvestRipePercent(parseInt(e.target.value) || 0)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-black text-slate-900 dark:text-white text-base"
                      />
                      <span className="font-bold text-slate-400">%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Sortasi Visual 100 butir</span>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Uji Ambang Floaters (%)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={harvestFloatersPercent}
                        onChange={(e) => setHarvestFloatersPercent(parseInt(e.target.value) || 0)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-black text-rose-600 dark:text-rose-400 text-base"
                      />
                      <span className="font-bold text-slate-400">%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Uji Rendam Air (Maks 2%)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Judul Sertifikat Mutu Panen</label>
                <input
                  type="text"
                  value={harvestStampTitle}
                  onChange={(e) => setHarvestStampTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Catatan Resmi Verifikator Mutu Petani (Akan tertera di sertifikat & barcode)
                </label>
                <textarea
                  rows={3}
                  value={harvestNotes}
                  onChange={(e) => setHarvestNotes(e.target.value)}
                  placeholder="Komentar hasil uji laboratorium dan konfirmasi kualitas ceri..."
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Auditor / Verifikator:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUser?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lembaga Penguji:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUser?.organization}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanda Tangan Digital Kriptografi:</span>
                  <span className="font-mono text-emerald-600">SHA-256 Otomatis Diterbitkan</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2.5">
              <button
                onClick={() => setHarvestModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitHarvestStamp}
                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-emerald-200" />
                <span>Terbitkan Stempel Mutu Panen Sah</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GENERIC AUDIT STAMP ISSUANCE (PETANI / PENGOLAH / GUDANG / CAFE) */}
      {genericModalOpen && genericTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setGenericModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  Penerbitan Stempel Verifikasi
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {genericTarget.title}
                </h3>
                <p className="text-xs text-slate-500">{genericTarget.subTitle} ({genericTarget.id})</p>
              </div>
              <button
                onClick={() => setGenericModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Judul Sertifikasi / Stempel</label>
                <input
                  type="text"
                  value={genericTitle}
                  onChange={(e) => setGenericTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Highlight Skor / Metrik Kepatuhan</label>
                <input
                  type="text"
                  value={genericScoreDisplay}
                  onChange={(e) => setGenericScoreDisplay(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Catatan Hasil Pemeriksaan Lapangan</label>
                <textarea
                  rows={3}
                  value={genericNotes}
                  onChange={(e) => setGenericNotes(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Auditor:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUser?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lembaga Audit:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUser?.organization}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanda Tangan Kripto:</span>
                  <span className="font-mono text-emerald-600">SHA-256 Otomatis Dibuat</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setGenericModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitGenericStamp}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
              >
                Terbitkan Stempel Resmi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
