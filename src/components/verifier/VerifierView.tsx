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
  ListChecks,
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
  VerificationChecklistItem,
} from '../../types/coffee';
import { VERIFICATION_CHECKLIST_TEMPLATES } from '../../constants/verificationChecklists';

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

  // Interactive Verification Checklist state for all auditing flows
  const [auditChecklist, setAuditChecklist] = useState<VerificationChecklistItem[]>([]);

  const handleToggleChecklistItem = (id: string) => {
    setAuditChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleItemNoteChange = (id: string, notes: string) => {
    setAuditChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

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
    if (lot.verificationStamp?.checklist && lot.verificationStamp.checklist.length > 0) {
      setAuditChecklist(lot.verificationStamp.checklist.map((c) => ({ ...c })));
    } else {
      setAuditChecklist(VERIFICATION_CHECKLIST_TEMPLATES.roasted.items.map((c) => ({ ...c, checked: true })));
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
      checklist: auditChecklist,
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
    if (lot.verificationStamp?.checklist && lot.verificationStamp.checklist.length > 0) {
      setAuditChecklist(lot.verificationStamp.checklist.map((c) => ({ ...c })));
    } else {
      setAuditChecklist(VERIFICATION_CHECKLIST_TEMPLATES.harvest.items.map((c) => ({ ...c, checked: true })));
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
      checklist: auditChecklist,
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
    setAuditChecklist(VERIFICATION_CHECKLIST_TEMPLATES[type]?.items.map((c) => ({ ...c, checked: true })) || []);
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
      checklist: auditChecklist,
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
      color: 'from-[#143424] via-[#1B4332] to-[#0E2419]',
    },
    pengolah: {
      title: 'Verifikasi Stasiun Pengolahan (Mill QA)',
      subtitle: 'Audit Zero Waste, Standar Fermentasi, Kadar Air & Sortasi Biji Hijau',
      icon: Award,
      color: 'from-[#2A170E] via-[#432314] to-[#1C100A]',
    },
    gudang: {
      title: 'Verifikasi Gudang & Pergudangan Ekspor',
      subtitle: 'Audit Suhu, RH, Kemasan Hermetik, Green Bean Grading & Standard SCA',
      icon: FileCheck2,
      color: 'from-[#1D242B] via-[#2D3742] to-[#161C22]',
    },
    roaster: {
      title: 'Lab Uji Cicip Sensori SCA & Roastery Audit',
      subtitle: 'Tugas Utama: Mencicipi (Cupping) Biji Sangrai & Menilai 10 Atribut Specialty SCA',
      icon: Coffee,
      color: 'from-[#23120B] via-[#422114] to-[#1A0D07]',
    },
    cafe: {
      title: 'Verifikasi Higienitas & Specialty Bar Kafe',
      subtitle: 'Audit Kalibrasi Ekstraksi Espresso, Manajemen FIFO Biji & Higienitas Bar',
      icon: CheckCircle2,
      color: 'from-[#2E1513] via-[#4A221E] to-[#1E0D0C]',
    },
    all: {
      title: 'Dewan Audit & Verifikasi Nasional',
      subtitle: 'Semua domain rantai pasok kopi dari hulu ke hilir',
      icon: ShieldCheck,
      color: 'from-[#1C120C] via-[#2F1A11] to-[#140D09]',
    },
  };

  const currentDomainInfo = domainInfo[activeDomain === 'history' ? 'all' : (activeDomain as VerifierDomain)] || domainInfo.all;
  const CurrentIcon = currentDomainInfo.icon;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
            notification.type === 'success'
              ? 'bg-emerald-700 text-white border-emerald-600'
              : 'bg-rose-700 text-white border-rose-600'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-bold">{notification.message}</span>
        </div>
      )}

      {/* Verifier Hero Banner (Coffee Espresso Prestige Theme) */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${currentDomainInfo.color} text-white shadow-xl relative overflow-hidden border border-amber-900/40`}>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-wider text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Portal Dewan Verifikator &amp; Auditor Kualitas
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{currentDomainInfo.title}</h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl">{currentDomainInfo.subtitle}</p>

            {currentUser && (
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  Auditor: <strong className="text-white font-bold">{currentUser.name}</strong>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  Lembaga: <strong className="text-white font-bold">{currentUser.organization}</strong>
                </span>
                {currentUser.verifierDomain && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black uppercase text-[10px] shadow-2xs">
                    Spesialis {currentUser.verifierDomain}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Key Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
              <div className="text-2xl font-black text-amber-200">{stats.totalVerified}</div>
              <div className="text-[11px] text-stone-300 font-bold">Lot Terverifikasi</div>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
              <div className="text-2xl font-black text-amber-400">{stats.pendingTotal}</div>
              <div className="text-[11px] text-stone-300 font-bold">Menunggu Uji</div>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
              <div className="text-2xl font-black text-emerald-300">{stats.avgCuppingScore}</div>
              <div className="text-[11px] text-stone-300 font-bold">Rata-rata SCA</div>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
              <div className="text-2xl font-black text-white">{stats.totalStamps}</div>
              <div className="text-[11px] text-stone-300 font-bold">Stempel Sah</div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200/80 pb-3">
        {[
          { id: 'petani', label: '1. Petani & Kebun', icon: MapPin },
          { id: 'pengolah', label: '2. Pengolah (Mill)', icon: Award },
          { id: 'gudang', label: '3. Gudang & Ekspor', icon: FileCheck2 },
          { id: 'roaster', label: '4. Roastery & Lab Cupping', icon: Coffee, highlight: true },
          { id: 'cafe', label: '5. Kafe & Bar', icon: CheckCircle2 },
          { id: 'history', label: 'Riwayat Stempel', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDomain === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setVerifierActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#23140D] text-amber-300 border border-amber-500/50 shadow-xs'
                  : 'bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-stone-200/90'
              } ${tab.highlight && !isActive ? 'ring-1 ring-amber-400/70' : ''}`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : tab.highlight ? 'text-amber-600' : 'text-stone-500'}`} />
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.highlight && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-black uppercase whitespace-nowrap shrink-0 ${
                  isActive ? 'bg-amber-400 text-stone-950' : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  Wajib Cicip
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Cari ID lot, nama kebun, varietas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-pointer"
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
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-[#23140D] text-amber-300 border border-amber-500/40 shadow-xs shrink-0">
                <Coffee className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  Tugas Khusus Q-Grader: Uji Cicip Sensori Biji Kopi Sangrai
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-950 border border-amber-300">
                    SCA Standard
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
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
                    className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-2xs ${
                      isVerified
                        ? 'border-amber-400 ring-1 ring-amber-300/60 shadow-xs'
                        : isPending
                        ? 'border-amber-300 shadow-2xs'
                        : 'border-stone-200/90 hover:border-amber-300'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Image & Header */}
                      <div className="relative h-40 rounded-xl overflow-hidden bg-stone-100">
                        <img
                          src={lot.photoUrl || 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop&q=80'}
                          alt={lot.variety}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <VerificationStampBadge stamp={lot.verificationStamp} status={lot.verificationStatus} size="sm" />
                        </div>
                        <div className="absolute bottom-3 left-3 bg-[#1C120C]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-amber-200 text-xs font-semibold border border-amber-500/20">
                          Agtron #{lot.agtronNumber} • DTR {lot.developmentTimeRatio}%
                        </div>
                      </div>

                      {/* Lot Info */}
                      <div>
                        <div className="flex items-center justify-between text-xs text-stone-500">
                          <span className="font-mono font-bold">{lot.id}</span>
                          <span>Tgl Sangrai: {lot.roastDate}</span>
                        </div>
                        <h4 className="font-bold text-base text-stone-900 mt-1">
                          {lot.origin} - {lot.variety}
                        </h4>
                        <p className="text-xs text-stone-500">
                          Roaster: <strong className="text-stone-800">{lot.roasterName}</strong> ({lot.roasterMachine})
                        </p>
                      </div>

                      {/* Current Score & Notes */}
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-stone-500">Skor Cupping:</span>
                          <span className="font-bold text-sm text-amber-800 font-mono">
                            {lot.scaCuppingScore} SCA Score
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-stone-500">Profil Sangrai:</span>
                          <span className="font-semibold text-stone-800">{lot.roastLevel}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {lot.tastingNotes.map((note, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Cupping Details if Verified */}
                      {lot.verificationStamp?.cuppingEvaluation && (
                        <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/60 text-xs">
                          <div className="flex items-center justify-between text-emerald-800 font-bold mb-1">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Telah Dicicipi &amp; Lulus
                            </span>
                            <span className="font-mono">{lot.verificationStamp.cuppingEvaluation.totalScore} Poin</span>
                          </div>
                          <p className="text-[11px] text-stone-600 line-clamp-2">
                            {lot.verificationStamp.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-2">
                      <button
                        onClick={() => openCuppingModal(lot)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isVerified
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-bold'
                            : 'bg-[#23140D] hover:bg-[#341C11] text-amber-300 border border-amber-500/40 shadow-xs'
                        }`}
                      >
                        <Coffee className="w-4 h-4 text-amber-400" />
                        <span>{isVerified ? 'Evaluasi Ulang Sensori' : 'Cicip Kopi & Isi SCA Sheet'}</span>
                      </button>

                      {isVerified && (
                        <button
                          onClick={() => revokeVerificationStamp('roasted', lot.id)}
                          className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium cursor-pointer"
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
          <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-2xl max-w-md border border-stone-200/80">
            <button
              onClick={() => setFarmerSubSection('harvest')}
              className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                farmerSubSection === 'harvest'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>Hasil Panen Ceri</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  farmerSubSection === 'harvest'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {farmerLots.length}
              </span>
            </button>

            <button
              onClick={() => setFarmerSubSection('farms')}
              className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                farmerSubSection === 'farms'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Lahan &amp; Kebun EUDR</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  farmerSubSection === 'farms'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-200 text-stone-700'
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
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-700 text-white shadow-xs shrink-0">
                    <Sprout className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                      Verifikasi Mutu &amp; Data Panen Ceri Petani
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-200 text-emerald-950 border border-emerald-300">
                        Uji Kemanisan Brix &amp; Petik Merah
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
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
                        className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-2xs ${
                          isVerified
                            ? 'border-emerald-300 ring-1 ring-emerald-300/50 shadow-xs'
                            : isPending
                            ? 'border-amber-200 shadow-2xs'
                            : 'border-stone-200/90 hover:border-emerald-200'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-stone-500">{lot.id}</span>
                            <VerificationStampBadge stamp={lot.verificationStamp} status={lot.verificationStatus} size="sm" />
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-base text-stone-900">{lot.variety}</h4>
                              <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {lot.brix}° Brix
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5">Petani: <strong className="text-stone-800">{lot.farmerName}</strong></p>
                            <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 shrink-0" /> {lot.farmName ? `${lot.farmName} • ` : ''}{lot.farmLocation} ({lot.altitude})
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-stone-500">Tgl Panen:</span>
                              <span className="font-semibold text-stone-800">{lot.harvestDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Standar Petik:</span>
                              <span className="font-semibold text-emerald-700">{lot.pickingMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Berat Panen:</span>
                              <span className="font-semibold text-stone-800">{lot.availableWeightKg} / {lot.totalWeightKg} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Harga Penawaran:</span>
                              <span className="font-bold text-stone-900">Rp {lot.pricePerKg.toLocaleString()} / kg</span>
                            </div>
                            {lot.weatherSnapshot && (
                              <div className="flex justify-between pt-1 border-t border-stone-200/70 text-[11px] text-stone-400">
                                <span>Cuaca Panen:</span>
                                <span>{lot.weatherSnapshot.currentCondition} • {lot.weatherSnapshot.temperatureCelsius}°C</span>
                              </div>
                            )}
                          </div>

                          {/* Verified Stamp Details */}
                          {isVerified && lot.verificationStamp && (
                            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 text-xs">
                              <div className="flex items-center justify-between text-emerald-800 font-bold mb-1">
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  Mutu Panen Sah Terverifikasi
                                </span>
                                <span className="text-[11px] font-mono">{lot.verificationStamp.scoreDisplay}</span>
                              </div>
                              <p className="text-[11px] text-stone-600 line-clamp-2">
                                {lot.verificationStamp.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-2">
                          <button
                            onClick={() => openHarvestModal(lot)}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              isVerified
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold'
                                : 'bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs'
                            }`}
                          >
                            <Sprout className="w-4 h-4" />
                            <span>{isVerified ? 'Perbarui Stempel Mutu Panen' : 'Inspeksi & Beri Stempel Mutu'}</span>
                          </button>

                          {isVerified && (
                            <button
                              onClick={() => revokeVerificationStamp('harvest', lot.id)}
                              className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs cursor-pointer"
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
                        className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-2xs ${
                          isVerified
                            ? 'border-emerald-300 ring-1 ring-emerald-300/50 shadow-xs'
                            : 'border-stone-200/90 hover:border-emerald-200'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="relative h-36 rounded-xl overflow-hidden bg-stone-100">
                            <img src={farm.photoUrl} alt={farm.farmName} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3">
                              <VerificationStampBadge stamp={farm.verificationStamp} status={farm.verificationStatus} size="sm" />
                            </div>
                            <div className="absolute bottom-3 left-3 bg-[#1C120C]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-emerald-200 text-xs font-semibold border border-emerald-500/20">
                              {farm.altitudeDisplay}
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs text-stone-500">
                              <span className="font-mono font-bold">{farm.id}</span>
                              <span>{farm.landAreaHectares} Ha • {farm.totalTreesCount} Pohon</span>
                            </div>
                            <h4 className="font-bold text-base text-stone-900 mt-1">{farm.farmName}</h4>
                            <p className="text-xs text-stone-500">Petani: <strong className="text-stone-800">{farm.farmerName}</strong></p>
                            <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3 shrink-0" /> {farm.location}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-stone-500">Patok Batas:</span>
                              <span className="font-semibold text-stone-800">
                                {farm.patokList ? `${farm.patokList.length} Patok BPN Terdaftar` : 'Standar Radius'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Kepatuhan EUDR:</span>
                              <span className="font-bold text-emerald-700">
                                {farm.eudrCompliant ? 'Bebas Deforestasi 100%' : 'Sedang Verifikasi'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-2">
                          <button
                            onClick={() => openGenericModal('farm', farm.id, farm.farmName, farm.location)}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              isVerified
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold'
                                : 'bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs'
                            }`}
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>{isVerified ? 'Perbarui Stempel EUDR' : 'Audit & Beri Stempel EUDR'}</span>
                          </button>

                          {isVerified && (
                            <button
                              onClick={() => revokeVerificationStamp('farm', farm.id)}
                              className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs cursor-pointer"
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
                  className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-2xs ${
                    isVerified
                      ? 'border-amber-300 ring-1 ring-amber-300/50 shadow-xs'
                      : 'border-stone-200/90 hover:border-amber-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono font-bold text-stone-400">{lot.id}</span>
                        <h4 className="font-bold text-base text-stone-900">
                          {lot.variety} ({lot.processMethod})
                        </h4>
                        <p className="text-xs text-stone-500">Stasiun: <strong className="text-stone-800">{lot.processorName}</strong></p>
                      </div>
                      <VerificationStampBadge stamp={lot.verificationStamp} status={lot.verificationStatus} size="sm" />
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Kadar Air:</span>
                        <span className="font-semibold text-stone-800">{lot.moistureContentPercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Sortasi Defect:</span>
                        <span className="font-semibold text-stone-800">{lot.defectCount} / 350g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Grade Olahan:</span>
                        <span className="font-bold text-amber-800">{lot.grade}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => openGenericModal('processed', lot.id, `Green Bean ${lot.variety}`, lot.processorName)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isVerified
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                          : 'bg-[#2E1A10] hover:bg-[#432314] text-amber-300 border border-amber-500/30 font-bold shadow-xs'
                      }`}
                    >
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{isVerified ? 'Perbarui Stempel Mill QA' : 'Beri Stempel Mill QA'}</span>
                    </button>
                    {isVerified && (
                      <button
                        onClick={() => revokeVerificationStamp('processed', lot.id)}
                        className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs cursor-pointer"
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

      {/* TAB CONTENT: GUDANG (WAREHOUSE QA) */}
      {activeDomain === 'gudang' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouseLots.map((lot) => {
              const isVerified = lot.verificationStatus === 'verified';
              return (
                <div
                  key={lot.id}
                  className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-2xs ${
                    isVerified
                      ? 'border-amber-300 ring-1 ring-amber-300/50 shadow-xs'
                      : 'border-stone-200/90 hover:border-amber-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono font-bold text-stone-400">{lot.id}</span>
                        <h4 className="font-bold text-base text-stone-900">
                          {lot.variety} • {lot.gradeTier || 'Grade 1'}
                        </h4>
                        <p className="text-xs text-stone-500">Gudang: <strong className="text-stone-800">{lot.warehouseName}</strong></p>
                      </div>
                      <VerificationStampBadge stamp={lot.verificationStamp} status={lot.verificationStatus} size="sm" />
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Suhu &amp; RH:</span>
                        <span className="font-semibold text-stone-800">
                          {lot.temperatureCelsius}°C • {lot.humidityPercent}% RH
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Kemasan:</span>
                        <span className="font-semibold text-stone-800">{lot.packagingType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">SCA Pre-Roast:</span>
                        <span className="font-bold text-amber-800 font-mono">{lot.verifiedScaScore} Poin</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-stone-200/70">
                        <span className="text-stone-500">Health Certificate:</span>
                        {lot.hasHealthCertificate ? (
                          <span className="font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                            {lot.healthCertificateNumber || 'HC Certified'}
                          </span>
                        ) : (
                          <span className="font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                            No Health Certificate
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => openGenericModal('warehouse', lot.id, `Lot Gudang ${lot.variety}`, lot.warehouseName)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isVerified
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                          : 'bg-[#1D242B] hover:bg-[#2D3742] text-amber-200 border border-stone-600/40 font-bold shadow-xs'
                      }`}
                    >
                      <FileCheck2 className="w-4 h-4 text-amber-400" />
                      <span>{isVerified ? 'Perbarui Stempel Gudang' : 'Beri Stempel Gudang QA'}</span>
                    </button>
                    {isVerified && (
                      <button
                        onClick={() => revokeVerificationStamp('warehouse', lot.id)}
                        className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs cursor-pointer"
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

      {/* TAB CONTENT: CAFE (BARISTA QA) */}
      {activeDomain === 'cafe' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cafeProducts.map((prod) => {
              const isVerified = prod.verificationStatus === 'verified';
              return (
                <div
                  key={prod.id}
                  className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-2xs ${
                    isVerified
                      ? 'border-amber-300 ring-1 ring-amber-300/50 shadow-xs'
                      : 'border-stone-200/90 hover:border-amber-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono font-bold text-stone-400">{prod.id}</span>
                        <h4 className="font-bold text-base text-stone-900">{prod.name}</h4>
                        <p className="text-xs text-stone-500">Kafe: <strong className="text-stone-800">{prod.cafeName}</strong></p>
                      </div>
                      <VerificationStampBadge stamp={prod.verificationStamp} status={prod.verificationStatus} size="sm" />
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Kemasan:</span>
                        <span className="font-semibold text-stone-800">{prod.packageUnit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Stok:</span>
                        <span className="font-semibold text-stone-800">{prod.availableStock} Unit</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => openGenericModal('cafe', prod.id, prod.name, prod.cafeName)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isVerified
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                          : 'bg-[#2E1513] hover:bg-[#4A221E] text-amber-200 border border-amber-600/30 font-bold shadow-xs'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <span>{isVerified ? 'Perbarui Stempel Barista' : 'Beri Stempel Kafe QA'}</span>
                    </button>
                    {isVerified && (
                      <button
                        onClick={() => revokeVerificationStamp('cafe', prod.id)}
                        className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs cursor-pointer"
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

      {/* TAB CONTENT: HISTORY STEMPEL AUDIT */}
      {activeDomain === 'history' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs">
          <div className="p-5 border-b border-stone-200/80 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                Daftar Seluruh Stempel Digital Diterbitkan
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Log sertifikasi kriptografis yang sah dan terdaftar pada database Circular Coffee Trace.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-950 border border-amber-300">
              {verificationStamps.length} Stempel Aktif
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {verificationStamps.map((stamp) => (
              <div key={stamp.id} className="p-5 hover:bg-stone-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <VerificationStampBadge stamp={stamp} size="sm" />
                    <span className="text-xs font-mono font-bold text-stone-500">#{stamp.certificateNumber}</span>
                    <span className="text-xs text-stone-400">• {stamp.verifiedAt}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">{stamp.title}</h4>
                  <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">{stamp.notes}</p>
                  <div className="text-[11px] text-stone-400 font-mono">
                    Hash: {stamp.digitalSignatureHash}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-stone-800">{stamp.verifierName}</div>
                  <div className="text-[11px] text-stone-500">{stamp.verifierTitle}</div>
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
            className="bg-white rounded-3xl shadow-2xl border border-stone-200/90 max-w-3xl w-full max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Deep Espresso & Warm Amber Theme) */}
            <div className="p-6 bg-gradient-to-r from-[#1C120C] via-[#2F1A11] to-[#1C120C] text-white rounded-t-3xl relative border-b border-amber-500/30">
              <button
                onClick={() => setCuppingModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <XCircle className="w-6 h-6 text-stone-300" />
              </button>

              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
                  <Coffee className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-stone-950 uppercase tracking-wider">
                      Uji Cicip Kopi Sangrai (Cupping Lab)
                    </span>
                    <span className="text-xs text-amber-200/80 font-mono">#{selectedRoastLot.id}</span>
                  </div>
                  <h3 className="text-xl font-bold mt-1 text-white">
                    {selectedRoastLot.origin} - {selectedRoastLot.variety}
                  </h3>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Roaster: <strong className="text-white">{selectedRoastLot.roasterName}</strong> • {selectedRoastLot.roastLevel} • Agtron #{selectedRoastLot.agtronNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Score Display Card */}
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Skor Akhir SCA Specialty Cupping
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black text-stone-900 font-mono">
                      {cuppingForm.totalScore.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold text-stone-500">/ 100 Poin</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {cuppingForm.totalScore >= 85
                      ? '⭐ Kategori Specialty Grade 1 (Excellent / Cup of Excellence standard)'
                      : cuppingForm.totalScore >= 80
                      ? '✓ Kategori Specialty Coffee (Standard SCA)'
                      : 'Commercial Grade (Dibawah 80.00)'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="px-4 py-2 rounded-xl text-sm font-bold bg-[#23140D] text-amber-300 border border-amber-500/40 shadow-xs inline-block">
                    {cuppingForm.roastEvaluation}
                  </span>
                </div>
              </div>

              {/* 10 SCA Attributes Sliders */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
                  <span>Penilaian 10 Parameter Sensori SCA (Rentang 6.00 - 10.00)</span>
                  <span className="text-[11px] text-amber-700 font-bold">Geser untuk mengubah nilai</span>
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
                      <div key={attr.key} className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                        <div className="flex justify-between items-center mb-1.5 text-xs">
                          <span className="font-semibold text-stone-800">{attr.label}</span>
                          <span className="font-bold text-amber-800 font-mono text-sm">
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
                          className="w-full accent-amber-600 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tasting Notes Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Catatan Rasa Spesifik (Tasting Notes)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {cuppingForm.tastingNotes.map((note) => (
                    <span
                      key={note}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200"
                    >
                      {note}
                      <button
                        type="button"
                        onClick={() => handleRemoveTastingNote(note)}
                        className="hover:text-rose-600 ml-0.5 cursor-pointer"
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
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTastingNote}
                    className="px-4 py-2 bg-[#23140D] hover:bg-[#341C11] text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Roast Evaluation & Resting Recommendation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-600">
                    Evaluasi Kualitas Sangrai (Roast Quality)
                  </label>
                  <select
                    value={cuppingForm.roastEvaluation}
                    onChange={(e) =>
                      setCuppingForm((prev) => ({ ...prev, roastEvaluation: e.target.value as any }))
                    }
                    className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="Optimal Specialty">Optimal Specialty (Pengembangan Sempurna)</option>
                    <option value="Underdeveloped">Underdeveloped (Kurang Matang di Inti Biji)</option>
                    <option value="Baked">Baked (Waktu Panggang Terlalu Lambat / Flat)</option>
                    <option value="Overdeveloped">Overdeveloped (Terlalu Gosong / Karamelisasi Berlebih)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600">
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
                      className="w-24 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-center text-stone-900 focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-xs text-stone-500">Hari sebelum diseduh</span>
                  </div>
                </div>
              </div>

              {/* Interactive Data Checked List */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4 text-amber-700" />
                    Data Checked List "Verified"
                  </label>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                    {auditChecklist.filter((c) => c.checked).length} / {auditChecklist.length} Terpenuhi
                  </span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {auditChecklist.map((item) => (
                    <label
                      key={item.id}
                      className="p-2.5 rounded-xl border border-stone-200 bg-white flex items-start gap-2.5 cursor-pointer hover:bg-stone-50 transition"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleToggleChecklistItem(item.id)}
                        className="mt-0.5 w-4 h-4 rounded text-amber-600 accent-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <div className="flex-1 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${item.checked ? 'text-stone-900' : 'text-stone-400 line-through'}`}>
                            {item.label}
                          </span>
                          <span className="text-[9px] uppercase font-bold text-stone-400">{item.category}</span>
                        </div>
                        {item.description && (
                          <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Auditor Notes */}
              <div>
                <label className="text-xs font-semibold text-stone-600">
                  Catatan Resmi Auditor / Q-Grader (Akan tertera di sertifikat)
                </label>
                <textarea
                  rows={3}
                  value={auditorNotes}
                  onChange={(e) => setAuditorNotes(e.target.value)}
                  placeholder="Deskripsikan profil rasa cangkir, kebersihan ekstraksi, dan justifikasi stempel mutu..."
                  className="w-full mt-1 p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-stone-50 border-t border-stone-200 rounded-b-3xl flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCuppingModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-200 rounded-xl cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSubmitCuppingStamp}
                className="px-6 py-2.5 text-xs font-bold text-amber-300 bg-[#23140D] hover:bg-[#341C11] border border-amber-500/40 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Terbitkan Stempel Emas SCA Cupped &amp; Certified</span>
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
            className="bg-white rounded-3xl shadow-2xl border border-stone-200/90 max-w-xl w-full p-6 sm:p-7 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold uppercase tracking-wider mb-1 border border-emerald-300">
                  <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                  Inspeksi Mutu Panen Ceri Petani
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-1">
                  {selectedHarvestLot.variety} &bull; <span className="font-mono text-stone-500 text-base">{selectedHarvestLot.id}</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Petani: <strong className="text-stone-800">{selectedHarvestLot.farmerName}</strong> &bull; Kebun: {selectedHarvestLot.farmLocation}
                </p>
              </div>
              <button
                onClick={() => setHarvestModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Quality Metrics Form */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-emerald-950 text-[11px]">
                    Hasil Uji Laboratorium Mutu Ceri
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-700 text-white">
                    {harvestBrix >= 21 && harvestRipePercent >= 95
                      ? 'Grade A+ Specialty'
                      : harvestBrix >= 19
                      ? 'Grade A Premium'
                      : 'Komersial / Standar'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <label className="text-[11px] font-bold text-stone-800 block mb-1">
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
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono font-black text-emerald-800 text-base focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="font-bold text-stone-400">°Bx</span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">Refraktometer Optik</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <label className="text-[11px] font-bold text-stone-800 block mb-1">
                      Rasio Petik Merah (%)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={harvestRipePercent}
                        onChange={(e) => setHarvestRipePercent(parseInt(e.target.value) || 0)}
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono font-black text-stone-900 text-base focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="font-bold text-stone-400">%</span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">Sortasi Visual 100 butir</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <label className="text-[11px] font-bold text-stone-800 block mb-1">
                      Uji Ambang Floaters (%)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={harvestFloatersPercent}
                        onChange={(e) => setHarvestFloatersPercent(parseInt(e.target.value) || 0)}
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono font-black text-rose-700 text-base focus:ring-2 focus:ring-rose-500"
                      />
                      <span className="font-bold text-stone-400">%</span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">Uji Rendam Air (Maks 2%)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700">Judul Sertifikat Mutu Panen</label>
                <input
                  type="text"
                  value={harvestStampTitle}
                  onChange={(e) => setHarvestStampTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Interactive Data Checked List */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4 text-emerald-700" />
                    Data Checked List "Verified"
                  </label>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                    {auditChecklist.filter((c) => c.checked).length} / {auditChecklist.length} Terpenuhi
                  </span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {auditChecklist.map((item) => (
                    <label
                      key={item.id}
                      className="p-2.5 rounded-xl border border-stone-200 bg-white flex items-start gap-2.5 cursor-pointer hover:bg-stone-50 transition"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleToggleChecklistItem(item.id)}
                        className="mt-0.5 w-4 h-4 rounded text-emerald-700 accent-emerald-700 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div className="flex-1 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${item.checked ? 'text-stone-900' : 'text-stone-400 line-through'}`}>
                            {item.label}
                          </span>
                          <span className="text-[9px] uppercase font-bold text-stone-400">{item.category}</span>
                        </div>
                        {item.description && (
                          <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700">
                  Catatan Resmi Verifikator Mutu Petani (Akan tertera di sertifikat &amp; barcode)
                </label>
                <textarea
                  rows={3}
                  value={harvestNotes}
                  onChange={(e) => setHarvestNotes(e.target.value)}
                  placeholder="Komentar hasil uji laboratorium dan konfirmasi kualitas ceri..."
                  className="w-full mt-1 p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-stone-100 text-[11px] text-stone-600 space-y-1 border border-stone-200/80">
                <div className="flex justify-between">
                  <span>Auditor / Verifikator:</span>
                  <span className="font-bold text-stone-800">{currentUser?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lembaga Penguji:</span>
                  <span className="font-bold text-stone-800">{currentUser?.organization}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanda Tangan Digital Kriptografi:</span>
                  <span className="font-mono text-emerald-700 font-bold">SHA-256 Otomatis Diterbitkan</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end gap-2.5">
              <button
                onClick={() => setHarvestModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitHarvestStamp}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
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
            className="bg-white rounded-3xl shadow-2xl border border-stone-200/90 max-w-lg w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  Penerbitan Stempel Verifikasi
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                  {genericTarget.title}
                </h3>
                <p className="text-xs text-stone-500">{genericTarget.subTitle} ({genericTarget.id})</p>
              </div>
              <button
                onClick={() => setGenericModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700">Judul Sertifikasi / Stempel</label>
                <input
                  type="text"
                  value={genericTitle}
                  onChange={(e) => setGenericTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700">Highlight Skor / Metrik Kepatuhan</label>
                <input
                  type="text"
                  value={genericScoreDisplay}
                  onChange={(e) => setGenericScoreDisplay(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Interactive Data Checked List */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4 text-amber-700" />
                    Data Checked List "Verified"
                  </label>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                    {auditChecklist.filter((c) => c.checked).length} / {auditChecklist.length} Terpenuhi
                  </span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {auditChecklist.map((item) => (
                    <label
                      key={item.id}
                      className="p-2.5 rounded-xl border border-stone-200 bg-white flex items-start gap-2.5 cursor-pointer hover:bg-stone-50 transition"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleToggleChecklistItem(item.id)}
                        className="mt-0.5 w-4 h-4 rounded text-amber-700 accent-amber-700 focus:ring-amber-500 cursor-pointer"
                      />
                      <div className="flex-1 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${item.checked ? 'text-stone-900' : 'text-stone-400 line-through'}`}>
                            {item.label}
                          </span>
                          <span className="text-[9px] uppercase font-bold text-stone-400">{item.category}</span>
                        </div>
                        {item.description && (
                          <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700">Catatan Hasil Pemeriksaan Lapangan</label>
                <textarea
                  rows={3}
                  value={genericNotes}
                  onChange={(e) => setGenericNotes(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-stone-100 text-[11px] text-stone-600 space-y-1 border border-stone-200/80">
                <div className="flex justify-between">
                  <span>Auditor:</span>
                  <span className="font-bold text-stone-800">{currentUser?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lembaga Audit:</span>
                  <span className="font-bold text-stone-800">{currentUser?.organization}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanda Tangan Kripto:</span>
                  <span className="font-mono text-emerald-700 font-bold">SHA-256 Otomatis Dibuat</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button
                onClick={() => setGenericModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitGenericStamp}
                className="px-5 py-2 text-xs font-bold text-amber-300 bg-[#23140D] hover:bg-[#341C11] border border-amber-500/40 rounded-xl shadow-md cursor-pointer"
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
