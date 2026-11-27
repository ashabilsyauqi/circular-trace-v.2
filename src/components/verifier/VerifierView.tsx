import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import { getScopedTenantData } from '../../utils/tenantScoping';
import { VerificationStampBadge } from '../shared/VerificationStampBadge';
import {
  ShieldCheck,
  Award,
  Coffee,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Layers,
  MapPin,
  Calendar,
  Building,
  UserCheck,
  FileCheck2,
  Users,
  Printer,
  ClipboardCheck,
  BadgeCheck,
  Sprout,
  Truck,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import {
  FarmerHarvestLot,
  RoastedBeanLot,
  CuppingEvaluationData,
  VerifierDomain,
} from '../../types/coffee';
import { IntegratedCircularIndicesView } from './IntegratedCircularIndicesView';

export const VerifierView: React.FC = () => {
  const {
    currentUser,
    verifierActiveTab,
    setVerifierActiveTab,
    users,
    coffeeFarms,
    farmerLots,
    processedLots,
    warehouseLots,
    roastedLots,
    cafeProducts,
    verificationStamps,
    issueVerificationStamp,
    revokeVerificationStamp,
    verifyFarmer,
    openBlankoModal,
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

  const {
    scopedFarmers,
    scopedFarms,
    scopedLots,
  } = useMemo(
    () =>
      getScopedTenantData(currentUser, {
        users,
        coffeeFarms,
        farmerLots,
        processedLots,
        verificationStamps,
      }),
    [currentUser, users, coffeeFarms, farmerLots, processedLots, verificationStamps]
  );

  // Harvest & Farmer Verification States (Petani Domain)
  const [farmerSubSection, setFarmerSubSection] = useState<'farmers' | 'harvest' | 'farms'>('farmers');
  const farmersList = scopedFarmers;
  const targetFarms = scopedFarms;
  const targetLots = scopedLots;
  const [harvestModalOpen, setHarvestModalOpen] = useState(false);
  const [selectedHarvestLot, setSelectedHarvestLot] = useState<FarmerHarvestLot | null>(null);
  const [harvestBrix, setHarvestBrix] = useState<number>(22.0);
  const [harvestRipePercent, setHarvestRipePercent] = useState<number>(98);
  const [harvestFloatersPercent, setHarvestFloatersPercent] = useState<number>(0);
  const [harvestStampTitle, setHarvestStampTitle] = useState('Standar Mutu Petik Merah & Brix Terverifikasi');
  const [harvestNotes, setHarvestNotes] = useState('');
  const [selectedVerifierFarmId, setSelectedVerifierFarmId] = useState<string>('');
  const [showCircularIndicesPanel, setShowCircularIndicesPanel] = useState<boolean>(true);

  const activeSelectedFarm = useMemo(() => {
    return targetFarms.find((f) => f.id === selectedVerifierFarmId) || targetFarms[0];
  }, [targetFarms, selectedVerifierFarmId]);

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

  const handleAttributeChange = (key: keyof CuppingEvaluationData, value: number) => {
    const updated = { ...cuppingForm, [key]: value };
    const newTotal = calculateTotalScore(updated);
    let evaluation: CuppingEvaluationData['roastEvaluation'] = 'Optimal Specialty';
    if (newTotal >= 90) evaluation = 'Optimal Specialty';
    else if (newTotal >= 85) evaluation = 'Optimal Specialty';
    else if (newTotal >= 80) evaluation = 'Optimal Specialty';
    else evaluation = 'Baked';

    setCuppingForm({
      ...updated,
      totalScore: newTotal,
      roastEvaluation: evaluation,
    });
  };

  const handleAddTastingNote = () => {
    if (!newNoteInput.trim()) return;
    if (!cuppingForm.tastingNotes.includes(newNoteInput.trim())) {
      setCuppingForm({
        ...cuppingForm,
        tastingNotes: [...cuppingForm.tastingNotes, newNoteInput.trim()],
      });
    }
    setNewNoteInput('');
  };

  const handleRemoveTastingNote = (noteToRemove: string) => {
    setCuppingForm({
      ...cuppingForm,
      tastingNotes: cuppingForm.tastingNotes.filter((n) => n !== noteToRemove),
    });
  };

  const openCuppingModal = (lot: RoastedBeanLot) => {
    setSelectedRoastLot(lot);
    if (lot.verificationStamp?.cuppingEvaluation) {
      setCuppingForm(lot.verificationStamp.cuppingEvaluation);
      setAuditorNotes(lot.verificationStamp.notes || '');
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
        tastingNotes: lot.tastingNotes || ['Floral', 'Brown Sugar'],
        defectDeduction: 0,
        defectNotes: '',
        roastEvaluation: 'Optimal Specialty',
        recommendationRestDays: 7,
      });
      setAuditorNotes(`Hasil cupping evaluasi sensori lot ${lot.id}. Biji sangrai optimal specialty.`);
    }
    setCuppingModalOpen(true);
  };

  const handleSubmitCuppingStamp = () => {
    if (!selectedRoastLot) return;

    const res = issueVerificationStamp({
      targetType: 'roasted',
      targetId: selectedRoastLot.id,
      stampType: 'roast_cupping',
      title: `Specialty Q-Grader Cupped (${cuppingForm.totalScore.toFixed(2)} Poin)`,
      scoreDisplay: `${cuppingForm.totalScore.toFixed(2)} SCA Score`,
      notes: auditorNotes || `Terverifikasi specialty dengan profil rasa: ${cuppingForm.tastingNotes.join(', ')}`,
      cuppingEvaluation: cuppingForm,
    });

    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setCuppingModalOpen(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const openHarvestModal = (lot: FarmerHarvestLot) => {
    setSelectedHarvestLot(lot);
    setHarvestBrix(lot.brix || 21.5);
    setHarvestRipePercent(98);
    setHarvestFloatersPercent(0);
    setHarvestStampTitle('Standar Mutu Petik Merah & Brix Terverifikasi');
    setHarvestNotes(`Lot panen ${lot.id} lolos uji kadar kemanisan brix dan rasio petik merah 98%.`);
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
    const verifiedFarms = targetFarms.filter((f) => f.verificationStatus === 'verified').length;
    const verifiedHarvests = targetLots.filter((h) => h.verificationStatus === 'verified').length;
    const verifiedMills = processedLots.filter((p) => p.verificationStatus === 'verified').length;
    const verifiedWarehouses = warehouseLots.filter((w) => w.verificationStatus === 'verified').length;
    const verifiedRoasts = roastedLots.filter((r) => r.verificationStatus === 'verified').length;
    const verifiedCafes = cafeProducts.filter((c) => c.verificationStatus === 'verified').length;

    const pendingRoasts = roastedLots.filter((r) => r.verificationStatus === 'pending').length;
    const pendingFarms = targetFarms.filter((f) => f.verificationStatus === 'pending').length;
    const pendingHarvests = targetLots.filter((h) => h.verificationStatus === 'pending').length;

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
  }, [targetFarms, targetLots, processedLots, warehouseLots, roastedLots, cafeProducts, verificationStamps]);

  // Auditor domain badge / header info
  const domainInfo: Record<
    VerifierDomain,
    { title: string; subtitle: string; icon: any }
  > = {
    petani: {
      title: 'Verifikasi Lahan & Kebun Petani (EUDR)',
      subtitle: 'Audit Geolokasi, 100% Bebas Deforestasi & Good Agricultural Practices (GAP)',
      icon: MapPin,
    },
    pengolah: {
      title: 'Verifikasi Stasiun Pengolahan (Mill QA)',
      subtitle: 'Audit Zero Waste, Standar Fermentasi, Kadar Air & Sortasi Biji Hijau',
      icon: Award,
    },
    gudang: {
      title: 'Verifikasi Gudang & Pergudangan Ekspor',
      subtitle: 'Audit Suhu, RH, Kemasan Hermetik, Green Bean Grading & Standard SCA',
      icon: FileCheck2,
    },
    roaster: {
      title: 'Lab Uji Cicip Sensori SCA & Roastery Audit',
      subtitle: 'Tugas Utama: Mencicipi (Cupping) Biji Sangrai & Menilai 10 Atribut Specialty SCA',
      icon: Coffee,
    },
    cafe: {
      title: 'Verifikasi Higienitas & Specialty Bar Kafe',
      subtitle: 'Audit Kalibrasi Ekstraksi Espresso, Manajemen FIFO Biji & Higienitas Bar',
      icon: CheckCircle2,
    },
    all: {
      title: 'Dewan Audit & Verifikasi Nasional',
      subtitle: 'Semua domain rantai pasok kopi dari hulu ke hilir',
      icon: ShieldCheck,
    },
  };

  const currentDomainInfo = domainInfo[activeDomain === 'history' ? 'all' : (activeDomain as VerifierDomain)] || domainInfo.all;

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3 border ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-rose-600 text-white border-rose-500'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* 1. AdminLTE Box Header Banner */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                {currentDomainInfo.title}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Auditor &amp; Verifikator Mutu
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 max-w-2xl">
              {currentDomainInfo.subtitle}
            </p>
            {currentUser && (
              <div className="pt-1.5 flex flex-wrap items-center gap-3 text-xs text-stone-600">
                <span className="flex items-center gap-1 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Auditor: <strong className="text-stone-900">{currentUser.name}</strong>
                </span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Building className="w-3.5 h-3.5 text-stone-400" />
                  Komite Verifikasi &amp; Sertifikasi Kebun CT-4CI
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/ict/ct-dashboard"
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            title="Buka Dashboard Sertifikasi Kebun CT Index Engine"
          >
            <Award className="w-4 h-4 text-amber-700" />
            <span>Sertifikasi Kebun (CT Index)</span>
          </Link>

          <Link
            to="/admin/ict/audit"
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            title="Lembar Kerja Audit ICS Lapangan"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Lembar Kerja ICS</span>
          </Link>

          <button
            type="button"
            onClick={() => openBlankoModal('petani')}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Cetak formulir blanko fisik A4"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>Blanko Form (A4)</span>
          </button>
        </div>
      </div>

      {/* 2. AdminLTE Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider block">
              Lot &amp; Lahan Terverifikasi
            </span>
            <div className="text-xl sm:text-2xl font-black text-stone-900 mt-1 font-mono">
              {stats.totalVerified} <span className="text-sm font-semibold text-stone-500">Lot</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Memenuhi kualifikasi paspor kopi</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center justify-between border-l-4 border-l-amber-500">
          <div>
            <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider block">
              Menunggu Audit / Verifikasi
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-900 mt-1 font-mono">
              {stats.pendingTotal} <span className="text-sm font-semibold text-stone-500">Antrean</span>
            </div>
            <div className="text-[11px] text-amber-800 font-medium mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Menunggu tindakan auditor</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center justify-between border-l-4 border-l-blue-500">
          <div>
            <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider block">
              Rata-Rata Skor Cupping SCA
            </span>
            <div className="text-xl sm:text-2xl font-black text-blue-900 mt-1 font-mono">
              {stats.avgCuppingScore} <span className="text-sm font-semibold text-stone-500">Poin</span>
            </div>
            <div className="text-[11px] text-blue-700 font-medium mt-1 flex items-center gap-1">
              <Coffee className="w-3 h-3 text-blue-600" />
              <span>Standar Specialty Coffee</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Coffee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center justify-between border-l-4 border-l-purple-500">
          <div>
            <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider block">
              Stempel Sah Diterbitkan
            </span>
            <div className="text-xl sm:text-2xl font-black text-purple-900 mt-1 font-mono">
              {stats.totalStamps} <span className="text-sm font-semibold text-stone-500">Stempel</span>
            </div>
            <div className="text-[11px] text-purple-700 font-medium mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-purple-600" />
              <span>Tercatat permanen di blockchain</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Domain Tabs & Search Filter Card */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 space-y-4">
        {/* Domain Navigation Tabs (AdminLTE Pill Style) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
          {[
            { id: 'petani', label: '1. Petani & Lahan EUDR', icon: MapPin },
            { id: 'pengolah', label: '2. Stasiun Pengolah (Mill)', icon: Award },
            { id: 'gudang', label: '3. Pergudangan & Ekspor', icon: FileCheck2 },
            { id: 'roaster', label: '4. Roastery & Cupping Lab', icon: Coffee, highlight: true },
            { id: 'cafe', label: '5. Kafe & Barista Bar', icon: CheckCircle2 },
            { id: 'history', label: 'Riwayat Seluruh Stempel', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDomain === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setVerifierActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
                {tab.highlight && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                      isActive ? 'bg-amber-400 text-stone-950' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Wajib Cicip
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari ID lot, nama kebun, varietas, petani..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="py-2 px-3 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
            >
              <option value="all">Semua Status Audit</option>
              <option value="pending">Menunggu Audit</option>
              <option value="verified">Sudah Terverifikasi</option>
              <option value="unverified">Belum Diverifikasi</option>
            </select>
          </div>
        </div>
      </div>

      {/* TAB CONTENT: ROASTERY & CUPPING LAB (SPECIALTY TASTING) */}
      {activeDomain === 'roaster' && (
        <div className="space-y-6">
          {/* Roaster Verifier Highlight Callout */}
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-600 text-white shrink-0">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  Tugas Khusus Q-Grader: Uji Cicip Sensori Biji Kopi Sangrai
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                    SCA Standard
                  </span>
                </h3>
                <p className="text-xs text-stone-600 mt-0.5 max-w-3xl">
                  Sesuai mandat standar specialty, verifikator roastery wajib mencicipi langsung (cupping) seduhan kopi dari setiap batch sangrai. Anda mengisi lembar penilaian 10 atribut sensori SCA (Aroma, Keasaman, Aftertaste, Body, Sweetness, dll) sebelum memberikan stempel verifikasi emas resmi.
                </p>
              </div>
            </div>
          </div>

          {/* List of Roasted Lots for Cupping */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    className={`bg-white rounded-lg border transition-all p-4 flex flex-col justify-between shadow-xs ${
                      isVerified
                        ? 'border-amber-300'
                        : isPending
                        ? 'border-amber-200'
                        : 'border-[#d2d6de] hover:border-amber-500'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Image & Header */}
                      <div className="relative h-40 rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                        <img
                          src={
                            lot.photoUrl ||
                            'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop&q=80'
                          }
                          alt={lot.variety}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 right-2.5">
                          <VerificationStampBadge stamp={lot.verificationStamp} status={lot.verificationStatus} size="sm" />
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 bg-black/70 px-2 py-0.5 rounded text-white text-[10px] font-bold">
                          Agtron #{lot.agtronNumber} • DTR {lot.developmentTimeRatio}%
                        </div>
                      </div>

                      {/* Lot Info */}
                      <div>
                        <div className="flex items-center justify-between text-xs text-stone-500">
                          <span className="font-mono">{lot.id}</span>
                          <span>Tgl Sangrai: {lot.roastDate}</span>
                        </div>
                        <h4 className="font-bold text-sm text-stone-900 mt-0.5">
                          {lot.origin} - {lot.variety}
                        </h4>
                        <p className="text-xs text-stone-500">
                          Roaster: <strong className="text-stone-800">{lot.roasterName}</strong> ({lot.roasterMachine})
                        </p>
                      </div>

                      {/* Current Score & Notes */}
                      <div className="p-3 rounded-md bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-stone-500">Skor Cupping:</span>
                          <span className="font-bold text-sm text-amber-700 font-mono">
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
                              className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Cupping Details if Verified */}
                      {lot.verificationStamp?.cuppingEvaluation && (
                        <div className="p-2.5 rounded-md border border-emerald-200 bg-emerald-50/50 text-xs">
                          <div className="flex items-center justify-between text-emerald-800 font-bold mb-0.5">
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
                    <div className="pt-3 mt-3 border-t border-stone-200 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openCuppingModal(lot)}
                        className={`flex-1 py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isVerified
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                            : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                        }`}
                      >
                        <Coffee className="w-4 h-4" />
                        <span>{isVerified ? 'Evaluasi Ulang Sensori' : 'Cicip Kopi & Isi SCA Sheet'}</span>
                      </button>

                      {isVerified && (
                        <button
                          type="button"
                          onClick={() => revokeVerificationStamp('roasted', lot.id)}
                          className="p-2 rounded-md border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-medium cursor-pointer"
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
          {/* Sub-tab Switcher: Master Petani vs Lahan Kebun vs Panen Ceri */}
          <div className="flex flex-wrap items-center gap-2 p-1 bg-stone-100 rounded-lg border border-stone-200 max-w-xl">
            <button
              type="button"
              onClick={() => setFarmerSubSection('farmers')}
              className={`flex-1 min-w-[130px] py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                farmerSubSection === 'farmers'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Master Petani (KTA)</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  farmerSubSection === 'farmers'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {farmersList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFarmerSubSection('farms')}
              className={`flex-1 min-w-[130px] py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                farmerSubSection === 'farms'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Lahan &amp; Kebun EUDR</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  farmerSubSection === 'farms'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {targetFarms.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFarmerSubSection('harvest')}
              className={`flex-1 min-w-[130px] py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                farmerSubSection === 'harvest'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Hasil Panen Ceri</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  farmerSubSection === 'harvest'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {targetLots.length}
              </span>
            </button>
          </div>

          {/* SUB-SECTION 0: MASTER DATA PETANI (IDENTITAS & KTA) */}
          {farmerSubSection === 'farmers' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-600 text-white shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      Verifikasi Identitas Resmi &amp; Nomor KTA Petani
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                        Legalitas Kependudukan &amp; KTA Gapoktan
                      </span>
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5 max-w-3xl">
                      Audit keabsahan identitas petani anggota mencakup validasi NIK terdaftar, nomor Kartu Petani (KTA), alamat domisili desa, serta luas lahan binaan sebelum data panen dan kebun dipublikasikan ke ekosistem.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid of Farmers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {farmersList
                  .filter((f) => {
                    const matchesSearch =
                      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (f.nik && f.nik.toLowerCase().includes(searchTerm.toLowerCase())) ||
                      (f.farmerCardNumber && f.farmerCardNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
                      (f.village && f.village.toLowerCase().includes(searchTerm.toLowerCase())) ||
                      f.location.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesStatus =
                      filterStatus === 'all' ||
                      (filterStatus === 'verified' && f.verificationStatus === 'verified') ||
                      (filterStatus === 'pending' && f.verificationStatus === 'pending') ||
                      (filterStatus === 'unverified' && (!f.verificationStatus || f.verificationStatus === 'unverified'));
                    return matchesSearch && matchesStatus;
                  })
                  .map((farmer) => {
                    const isVerified = farmer.verificationStatus === 'verified';
                    return (
                      <div
                        key={farmer.id}
                        className={`bg-white rounded-lg border transition-all p-4 flex flex-col justify-between shadow-xs ${
                          isVerified
                            ? 'border-emerald-300'
                            : 'border-[#d2d6de] hover:border-emerald-500'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={farmer.avatar}
                              alt={farmer.name}
                              className="w-12 h-12 rounded-lg object-cover border border-stone-300 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-sm text-stone-900 truncate">
                                {farmer.name}
                              </h4>
                              <p className="text-xs text-stone-500 truncate">{farmer.organization}</p>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                                isVerified
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {isVerified ? 'Terverifikasi' : 'Belum Diverifikasi'}
                            </span>
                          </div>

                          <div className="p-3 rounded-md bg-stone-50 border border-stone-200 space-y-1.5 text-xs text-stone-700">
                            <div className="flex justify-between">
                              <span className="text-stone-500">No. KTA:</span>
                              <span className="font-mono font-bold text-stone-900">
                                {farmer.farmerCardNumber || '-'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">NIK:</span>
                              <span className="font-mono text-stone-800">
                                {farmer.nik || '-'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Desa / Domisili:</span>
                              <span className="text-stone-800 truncate max-w-[160px]">
                                {farmer.village || farmer.location}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Luas Lahan:</span>
                              <span className="font-bold text-emerald-700">
                                {farmer.totalLandAreaHa ? `${farmer.totalLandAreaHa} Ha` : 'Tersambung ke Peta'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-stone-200 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              verifyFarmer(farmer.id, 'Data KTA & NIK terverifikasi sah oleh Auditor');
                              setNotification({
                                type: 'success',
                                message: `Petani ${farmer.name} berhasil diverifikasi!`,
                              });
                              setTimeout(() => setNotification(null), 4000);
                            }}
                            className={`flex-1 py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              isVerified
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            }`}
                          >
                            <BadgeCheck className="w-4 h-4" />
                            <span>{isVerified ? 'Perbarui Verifikasi' : 'Verifikasi KTA & NIK'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* SUB-SECTION 1: HASIL PANEN CERI PETANI */}
          {farmerSubSection === 'harvest' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-600 text-white shrink-0">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      Verifikasi Mutu &amp; Data Panen Ceri Petani
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                        Uji Kemanisan Brix &amp; Petik Merah
                      </span>
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5 max-w-3xl">
                      Semua data panen yang diinput petani diaudit oleh verifikator: kalibrasi refraktometer kadar gula ceri (°Brix), rasio petik merah selective hand-picking, uji floaters, serta kesesuaian koordinat kebun sebelum ceri diserahkan ke stasiun pengolah.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid of Farmer Harvest Lots */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        className={`bg-white rounded-lg border transition-all p-4 flex flex-col justify-between shadow-xs ${
                          isVerified
                            ? 'border-emerald-300'
                            : isPending
                            ? 'border-amber-300'
                            : 'border-[#d2d6de] hover:border-emerald-500'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-stone-500">{lot.id}</span>
                            <VerificationStampBadge stamp={lot.verificationStamp} status={lot.verificationStatus} size="sm" />
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-sm text-stone-900">{lot.variety}</h4>
                              <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                {lot.brix}° Brix
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5">
                              Petani: <strong className="text-stone-800">{lot.farmerName}</strong>
                            </p>
                            <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 shrink-0" /> {lot.farmName ? `${lot.farmName} • ` : ''}{lot.farmLocation} ({lot.altitude})
                            </p>
                          </div>

                          <div className="p-3 rounded-md bg-stone-50 border border-stone-200 space-y-1 text-xs">
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
                              <span className="font-semibold text-stone-900">Rp {lot.pricePerKg.toLocaleString()} / kg</span>
                            </div>
                          </div>

                          {isVerified && lot.verificationStamp && (
                            <div className="p-2.5 rounded-md border border-emerald-200 bg-emerald-50/50 text-xs">
                              <div className="flex items-center justify-between text-emerald-800 font-bold mb-0.5">
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

                        <div className="pt-3 mt-3 border-t border-stone-200 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openHarvestModal(lot)}
                            className={`flex-1 py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              isVerified
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            }`}
                          >
                            <Sprout className="w-4 h-4" />
                            <span>{isVerified ? 'Perbarui Stempel Mutu' : 'Inspeksi & Beri Stempel Mutu'}</span>
                          </button>

                          {isVerified && (
                            <button
                              type="button"
                              onClick={() => revokeVerificationStamp('harvest', lot.id)}
                              className="p-2 rounded-md border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs cursor-pointer"
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
            <div className="space-y-4">
              {/* TOP VISUALIZER: HASIL VERIFIKASI DIAGRAM LINGKARAN TERPADU */}
              <div className="bg-white rounded-lg p-5 border border-[#d2d6de] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Hasil Verifikasi &amp; Sertifikasi Kebun (CT-3 Tri-Index)</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Visualisasi resmi lembar kerja verifikator dengan 4 pilar indeks sirkularitas, keberlanjutan, dan kesiapan sertifikasi mandiri.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-semibold text-stone-500">Pilih Kebun:</span>
                      <select
                        value={activeSelectedFarm?.id || ''}
                        onChange={(e) => setSelectedVerifierFarmId(e.target.value)}
                        className="font-bold bg-stone-50 border border-stone-300 rounded-md px-2.5 py-1.5 text-stone-800 text-xs"
                      >
                        {targetFarms.map((farm) => (
                          <option key={farm.id} value={farm.id}>
                            {farm.farmName} ({farm.farmerName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <Link
                      to={`/admin/ict/ct-dashboard/${activeSelectedFarm?.id || ''}`}
                      className="px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center gap-1"
                    >
                      <span>Lembar Audit Detail</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setShowCircularIndicesPanel(!showCircularIndicesPanel)}
                      className="px-3 py-1.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-all cursor-pointer"
                    >
                      {showCircularIndicesPanel ? 'Sembunyikan' : 'Tampilkan Diagram'}
                    </button>
                  </div>
                </div>

                {showCircularIndicesPanel && (
                  <IntegratedCircularIndicesView
                    farmName={activeSelectedFarm?.farmName}
                    farmCode={activeSelectedFarm?.id}
                    isMajorPassed={activeSelectedFarm?.verificationStatus === 'verified' || true}
                  />
                )}
              </div>

              {/* FARM LIST TITLE & SUMMARY */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">
                    Daftar Plot Kebun &amp; Lahan Terdaftar EUDR
                  </h4>
                  <p className="text-xs text-stone-500">
                    Plot kebun terhubung dengan data patok BPN dan koordinat GPS poligon.
                  </p>
                </div>
                <span className="text-xs font-bold text-stone-600 bg-stone-100 border border-stone-200 px-3 py-1 rounded-full">
                  Total {targetFarms.length} Lahan
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {targetFarms
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
                    const isSelectedInView = activeSelectedFarm?.id === farm.id;
                    return (
                      <div
                        key={farm.id}
                        className={`bg-white rounded-lg border transition-all p-4 flex flex-col justify-between shadow-xs ${
                          isSelectedInView
                            ? 'ring-2 ring-emerald-500 border-emerald-400'
                            : isVerified
                            ? 'border-emerald-300'
                            : 'border-[#d2d6de] hover:border-emerald-500'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="relative h-36 rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                            <img src={farm.photoUrl} alt={farm.farmName} className="w-full h-full object-cover" />
                            <div className="absolute top-2.5 right-2.5">
                              <VerificationStampBadge stamp={farm.verificationStamp} status={farm.verificationStatus} size="sm" />
                            </div>
                            <div className="absolute bottom-2.5 left-2.5 bg-black/70 px-2 py-0.5 rounded text-white text-[10px] font-bold">
                              {farm.altitudeDisplay}
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs text-stone-500">
                              <span className="font-mono">{farm.id}</span>
                              <span>{farm.landAreaHectares} Ha • {farm.totalTreesCount} Pohon</span>
                            </div>
                            <h4 className="font-bold text-sm text-stone-900 mt-0.5">{farm.farmName}</h4>
                            <p className="text-xs text-stone-500">Petani: {farm.farmerName}</p>
                            <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 shrink-0" /> {farm.location}
                            </p>
                          </div>

                          <div className="p-3 rounded-md bg-stone-50 border border-stone-200 space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-stone-500">Patok Batas:</span>
                              <span className="font-semibold text-stone-800">
                                {farm.patokList ? `${farm.patokList.length} Patok BPN Terdaftar` : 'Standar Radius'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Kepatuhan EUDR:</span>
                              <span className="font-semibold text-emerald-700">
                                {farm.eudrCompliant ? 'Bebas Deforestasi 100%' : 'Sedang Verifikasi'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-stone-200 space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVerifierFarmId(farm.id);
                              setShowCircularIndicesPanel(true);
                              window.scrollTo({ top: 380, behavior: 'smooth' });
                            }}
                            className={`w-full py-1.5 px-3 rounded-md border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              isSelectedInView
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'border-stone-300 hover:bg-stone-50 text-stone-700'
                            }`}
                            title="Tampilkan Diagram Lingkaran Kebun Ini"
                          >
                            <span>⭕</span>
                            <span>{isSelectedInView ? '✓ Sedang Tampil di Diagram' : 'Lihat Diagram Lingkaran'}</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openGenericModal('farm', farm.id, farm.farmName, farm.location)}
                              className={`flex-1 py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                isVerified
                                  ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              }`}
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span>{isVerified ? 'Perbarui Stempel EUDR' : 'Audit & Beri Stempel EUDR'}</span>
                            </button>

                            {isVerified && (
                              <button
                                type="button"
                                onClick={() => revokeVerificationStamp('farm', farm.id)}
                                className="p-2 rounded-md border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs cursor-pointer"
                                title="Cabut Stempel"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedLots.map((lot) => {
              const isVerified = lot.verificationStatus === 'verified';
              return (
                <div
                  key={lot.id}
                  className={`bg-white rounded-lg border transition-all p-4 flex flex-col justify-between shadow-xs ${
                    isVerified
                      ? 'border-blue-300'
                      : 'border-[#d2d6de] hover:border-blue-500'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono text-stone-400">{lot.id}</span>
                        <h4 className="font-bold text-sm text-stone-900">
                          {lot.variety} ({lot.processMethod})
                        </h4>
                        <p className="text-xs text-stone-500">Stasiun: {lot.processorName}</p>
                      </div>
                      <VerificationStampBadge stamp={lot.verificationStamp} status={lot.verificationStatus} size="sm" />
                    </div>

                    <div className="p-3 rounded-md bg-stone-50 border border-stone-200 space-y-1 text-xs">
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
                        <span className="font-bold text-blue-700">{lot.grade}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-200 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openGenericModal('processed', lot.id, `Green Bean ${lot.variety}`, lot.processorName)}
                      className="flex-1 py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>{isVerified ? 'Perbarui Stempel Mill QA' : 'Beri Stempel Mill QA'}</span>
                    </button>
                    {isVerified && (
                      <button
                        type="button"
                        onClick={() => revokeVerificationStamp('processed', lot.id)}
                        className="p-2 rounded-md border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs cursor-pointer"
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warehouseLots.map((lot) => {
              const isVerified = lot.verificationStatus === 'verified';
              return (
                <div
                  key={lot.id}
                  className={`bg-white rounded-lg border transition-all p-4 flex flex-col justify-between shadow-xs ${
                    isVerified
                      ? 'border-indigo-300'
                      : 'border-[#d2d6de] hover:border-indigo-500'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono text-stone-400">{lot.id}</span>
                        <h4 className="font-bold text-sm text-stone-900">
                          {lot.variety} • {lot.gradeTier || 'Grade 1'}
                        </h4>
                        <p className="text-xs text-stone-500">Gudang: {lot.warehouseName}</p>
                      </div>
                      <VerificationStampBadge stamp={lot.verificationStamp} status={lot.verificationStatus} size="sm" />
                    </div>

                    <div className="p-3 rounded-md bg-stone-50 border border-stone-200 space-y-1 text-xs">
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
                        <span className="font-bold text-indigo-700">{lot.verifiedScaScore} Poin</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-stone-200">
                        <span className="text-stone-500">Health Certificate:</span>
                        {lot.hasHealthCertificate ? (
                          <span className="font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-300">
                            {lot.healthCertificateNumber || 'HC Certified'}
                          </span>
                        ) : (
                          <span className="font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded text-[10px]">
                            No Health Certificate
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-200 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openGenericModal('warehouse', lot.id, `Lot Gudang ${lot.variety}`, lot.warehouseName)}
                      className="flex-1 py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      <span>{isVerified ? 'Perbarui Stempel Gudang' : 'Beri Stempel Gudang QA'}</span>
                    </button>
                    {isVerified && (
                      <button
                        type="button"
                        onClick={() => revokeVerificationStamp('warehouse', lot.id)}
                        className="p-2 rounded-md border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs cursor-pointer"
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cafeProducts.map((prod) => {
              const isVerified = prod.verificationStatus === 'verified';
              return (
                <div
                  key={prod.id}
                  className={`bg-white rounded-lg border transition-all p-4 flex flex-col justify-between shadow-xs ${
                    isVerified
                      ? 'border-purple-300'
                      : 'border-[#d2d6de] hover:border-purple-500'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono text-stone-400">{prod.id}</span>
                        <h4 className="font-bold text-sm text-stone-900">{prod.name}</h4>
                        <p className="text-xs text-stone-500">Kafe: {prod.cafeName}</p>
                      </div>
                      <VerificationStampBadge stamp={prod.verificationStamp} status={prod.verificationStatus} size="sm" />
                    </div>

                    <div className="p-3 rounded-md bg-stone-50 border border-stone-200 space-y-1 text-xs">
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

                  <div className="pt-3 mt-3 border-t border-stone-200 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openGenericModal('cafe', prod.id, prod.name, prod.cafeName)}
                      className="flex-1 py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isVerified ? 'Perbarui Stempel Barista' : 'Beri Stempel Kafe QA'}</span>
                    </button>
                    {isVerified && (
                      <button
                        type="button"
                        onClick={() => revokeVerificationStamp('cafe', prod.id)}
                        className="p-2 rounded-md border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs cursor-pointer"
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
        <div className="bg-white rounded-lg border border-[#d2d6de] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#d2d6de] bg-stone-50/70 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Daftar Seluruh Stempel Digital Diterbitkan
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Log sertifikasi kriptografis yang sah dan terdaftar pada database Circular Coffee Trace.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {verificationStamps.length} Stempel Aktif
            </span>
          </div>

          <div className="divide-y divide-stone-200">
            {verificationStamps.map((stamp) => (
              <div
                key={stamp.id}
                className="p-4 hover:bg-stone-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <VerificationStampBadge stamp={stamp} size="sm" />
                    <span className="text-xs font-mono font-bold text-stone-600">#{stamp.certificateNumber}</span>
                    <span className="text-xs text-stone-400">• {stamp.verifiedAt}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">{stamp.title}</h4>
                  <p className="text-xs text-stone-600 max-w-3xl">{stamp.notes}</p>
                  <div className="text-[10px] text-stone-400 font-mono">
                    Hash: {stamp.digitalSignatureHash}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-stone-900">{stamp.verifierName}</div>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setCuppingModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-3xl w-full max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-stone-900 text-white rounded-t-2xl relative">
              <button
                type="button"
                onClick={() => setCuppingModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-black">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-stone-950 uppercase tracking-wider">
                      Uji Cicip Kopi Sangrai (Cupping Lab)
                    </span>
                    <span className="text-xs text-stone-400 font-mono">#{selectedRoastLot.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedRoastLot.origin} - {selectedRoastLot.variety}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Roaster: {selectedRoastLot.roasterName} • {selectedRoastLot.roastLevel} • Agtron #{selectedRoastLot.agtronNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-stone-800">
              {/* Score Display Card */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Skor Akhir SCA Specialty Cupping
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-stone-900 font-mono">
                      {cuppingForm.totalScore.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">/ 100 Poin</span>
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
                  <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 text-white shadow-xs inline-block">
                    {cuppingForm.roastEvaluation}
                  </span>
                </div>
              </div>

              {/* 10 SCA Attributes Sliders */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
                  <span>Penilaian 10 Parameter Sensori SCA (Rentang 6.00 - 10.00)</span>
                  <span className="text-[11px] text-amber-700">Geser untuk mengubah nilai</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      <div key={attr.key} className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <span className="font-semibold text-stone-800">{attr.label}</span>
                          <span className="font-bold text-amber-700 font-mono text-sm">
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
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200"
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
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddTastingNote}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-bold transition cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Roast Evaluation & Resting Recommendation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700">
                    Evaluasi Kualitas Sangrai (Roast Quality)
                  </label>
                  <select
                    value={cuppingForm.roastEvaluation}
                    onChange={(e) =>
                      setCuppingForm((prev) => ({ ...prev, roastEvaluation: e.target.value as any }))
                    }
                    className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900 font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
                  >
                    <option value="Optimal Specialty">Optimal Specialty (Pengembangan Sempurna)</option>
                    <option value="Underdeveloped">Underdeveloped (Kurang Matang di Inti Biji)</option>
                    <option value="Baked">Baked (Waktu Panggang Terlalu Lambat / Flat)</option>
                    <option value="Overdeveloped">Overdeveloped (Terlalu Gosong / Karamelisasi Berlebih)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700">
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
                      className="w-24 px-3 py-2 bg-stone-50 border border-stone-300 rounded-md text-xs font-semibold text-center text-stone-900"
                    />
                    <span className="text-xs text-stone-500">Hari sebelum diseduh</span>
                  </div>
                </div>
              </div>

              {/* Auditor Notes */}
              <div>
                <label className="text-xs font-semibold text-stone-700">
                  Catatan Resmi Auditor / Q-Grader (Akan tertera di sertifikat)
                </label>
                <textarea
                  rows={3}
                  value={auditorNotes}
                  onChange={(e) => setAuditorNotes(e.target.value)}
                  placeholder="Deskripsikan profil rasa cangkir, kebersihan ekstraksi, dan justifikasi stempel mutu..."
                  className="w-full mt-1 p-3 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 rounded-b-2xl flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCuppingModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200 rounded-md cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSubmitCuppingStamp}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-md shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <Award className="w-4 h-4 text-amber-200" />
                <span>Terbitkan Stempel Emas SCA Cupped &amp; Certified</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HARVEST QUALITY INSPECTION & STAMP ISSUANCE */}
      {harvestModalOpen && selectedHarvestLot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setHarvestModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-xl w-full p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sprout className="w-3.5 h-3.5" />
                  Inspeksi Mutu Panen Ceri Petani
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  {selectedHarvestLot.variety} &bull; {selectedHarvestLot.id}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Petani: <strong className="text-stone-800">{selectedHarvestLot.farmerName}</strong> &bull; Kebun: {selectedHarvestLot.farmLocation}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHarvestModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-800">
              {/* Quality Metrics Form */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-emerald-900 text-[11px]">
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
                  <div className="bg-white p-3 rounded-lg border border-emerald-200">
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
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
                        className="w-full p-2 bg-stone-50 border border-stone-300 rounded-md font-mono font-black text-emerald-700 text-base"
                      />
                      <span className="font-bold text-stone-400">°Bx</span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">Refraktometer Optik</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-emerald-200">
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Rasio Petik Merah (%)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={harvestRipePercent}
                        onChange={(e) => setHarvestRipePercent(parseInt(e.target.value) || 0)}
                        className="w-full p-2 bg-stone-50 border border-stone-300 rounded-md font-mono font-black text-stone-900 text-base"
                      />
                      <span className="font-bold text-stone-400">%</span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">Sortasi 100 butir</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-emerald-200">
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Uji Ambang Floaters (%)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={harvestFloatersPercent}
                        onChange={(e) => setHarvestFloatersPercent(parseInt(e.target.value) || 0)}
                        className="w-full p-2 bg-stone-50 border border-stone-300 rounded-md font-mono font-black text-rose-600 text-base"
                      />
                      <span className="font-bold text-stone-400">%</span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">Uji Rendam Air</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700">Judul Sertifikat Mutu Panen</label>
                <input
                  type="text"
                  value={harvestStampTitle}
                  onChange={(e) => setHarvestStampTitle(e.target.value)}
                  className="w-full mt-1 p-2 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900"
                />
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
                  className="w-full mt-1 p-2 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900"
                />
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-500 space-y-1">
                <div className="flex justify-between">
                  <span>Auditor / Verifikator:</span>
                  <span className="font-semibold text-stone-800">{currentUser?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lembaga Penguji:</span>
                  <span className="font-semibold text-stone-800">{currentUser?.organization}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanda Tangan Digital Kriptografi:</span>
                  <span className="font-mono text-emerald-700">SHA-256 Otomatis Diterbitkan</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setHarvestModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-md cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmitHarvestStamp}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Terbitkan Stempel Mutu Ceri Sah</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GENERIC STAMP ISSUANCE */}
      {genericModalOpen && genericTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setGenericModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
                  <Award className="w-3.5 h-3.5" />
                  Verifikasi Sah Rantai Pasok
                </span>
                <h3 className="text-base font-bold text-stone-900">{genericTarget.title}</h3>
                <p className="text-xs text-stone-500">{genericTarget.subTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setGenericModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-800">
              <div>
                <label className="font-semibold text-stone-700">Judul Stempel Verifikasi</label>
                <input
                  type="text"
                  value={genericTitle}
                  onChange={(e) => setGenericTitle(e.target.value)}
                  className="w-full mt-1 p-2 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700">Indikator Nilai / Score Display</label>
                <input
                  type="text"
                  value={genericScoreDisplay}
                  onChange={(e) => setGenericScoreDisplay(e.target.value)}
                  className="w-full mt-1 p-2 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700">Catatan Resmi Verifikator</label>
                <textarea
                  rows={3}
                  value={genericNotes}
                  onChange={(e) => setGenericNotes(e.target.value)}
                  className="w-full mt-1 p-2 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setGenericModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-md cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmitGenericStamp}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Terbitkan Stempel Resmi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifierView;
