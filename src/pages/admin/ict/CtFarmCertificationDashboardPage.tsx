import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCoffee } from '../../../context/CoffeeContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sprout,
  TreePine,
  Award,
  Sparkles,
  RefreshCw,
  FileText,
  Layers,
  Scale,
  Clock,
  Printer,
  Search,
  Filter,
  Check,
  X,
  ChevronRight,
  Info,
  Calendar,
  Building2,
  MapPin,
  RotateCcw,
  Droplets,
  Zap,
  Recycle,
  HelpCircle,
  ArrowLeft,
  Upload,
} from 'lucide-react';
import {
  ApplicabilityDecision,
  EvidenceSufficiency,
  ComplianceResult,
  MajorGateStatus,
  CalculationResultStatus,
  DimensionType,
  CapaStatus,
  IdsmRuleStatus,
  CheckpointAssessment,
  Ct4ciCalculationResult,
  CapaItem,
  CtCertificationSnapshot,
} from '../../../services/ct4ci/types';
import { globalCheckpointRegistry } from '../../../services/ct4ci/checkpointRegistry';
import { Ct4ciEngine } from '../../../services/ct4ci/ct4ciEngine';
import {
  PracticesFormConfig,
  PRESET_FARMER_ANSWERS,
  evaluateFarmerAnswersToAssessments,
} from '../../../services/ct4ci/practicesConfig';
import { CtIdsmEngine } from '../../../services/ct4ci/idsmEngine';
import { globalCapaManager } from '../../../services/ct4ci/capaManager';
import { LiteEngine } from '../../../services/ct4ci/liteEngine';

export const CtFarmCertificationDashboardPage: React.FC = () => {
  const { farmId: routeFarmId } = useParams<{ farmId?: string }>();
  const navigate = useNavigate();
  const { coffeeFarms, users, currentUser, certifyFarmWithCtIndex } = useCoffee();

  // Selected farm selection
  const [selectedFarmId, setSelectedFarmId] = useState<string>(
    routeFarmId || coffeeFarms[0]?.id || ''
  );

  const selectedFarm = useMemo(() => {
    return coffeeFarms.find((f) => f.id === selectedFarmId) || coffeeFarms[0];
  }, [coffeeFarms, selectedFarmId]);

  const selectedFarmer = useMemo(() => {
    if (!selectedFarm) return null;
    return users.find((u) => u.id === selectedFarm.farmerId || u.name === selectedFarm.farmerName);
  }, [users, selectedFarm]);

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'practices' | 'checkpoints' | 'capa' | 'certificate'>('overview');

  // Audit Period
  const [auditPeriod, setAuditPeriod] = useState('2026-PANEN-RAYA');

  // Answers State
  const [answers, setAnswers] = useState<Record<string, unknown>>({ ...PRESET_FARMER_ANSWERS.screenshot });

  // Assessments State for 108 Checkpoints
  const [assessments, setAssessments] = useState<CheckpointAssessment[]>([]);

  // Capa List
  const [capasList, setCapasList] = useState<CapaItem[]>([]);

  // Banned chemical banner flag
  const [bannedAlert, setBannedAlert] = useState<{ detected: boolean; reason: string | null }>({
    detected: false,
    reason: null,
  });

  // Filter Checkpoint Matrix
  const [checkpointDimensionFilter, setCheckpointDimensionFilter] = useState<'ALL' | DimensionType>('ALL');
  const [checkpointSearch, setCheckpointSearch] = useState('');
  const [onlyMajorFilter, setOnlyMajorFilter] = useState(false);

  // Success alert on certification
  const [certSuccessBanner, setCertSuccessBanner] = useState<string | null>(null);

  // Load / Evaluate answers into assessments whenever farm or preset answers change
  const runEvaluation = (customAnswers: Record<string, unknown> = answers) => {
    if (!selectedFarm) return;
    const res = evaluateFarmerAnswersToAssessments(
      customAnswers,
      selectedFarm.farmerId,
      auditPeriod,
      globalCheckpointRegistry
    );

    setAssessments(res.assessments);
    setBannedAlert({
      detected: res.bannedChemicalDetected,
      reason: res.bannedChemicalReason,
    });

    // Populate CAPAs
    const newCapas: CapaItem[] = res.generatedCapas.map((c) =>
      globalCapaManager.createCapa(
        {
          findingTitle: c.findingTitle,
          checkpointId: c.checkpointId,
          checkpointCode: c.checkpointCode,
          issueType: c.issueType,
          actionPlan: c.actionPlan,
          estimatedCostIdr: c.estimatedCostIdr,
          responsiblePerson: c.responsiblePerson,
          deadlineDate: c.deadlineDate,
          scopeId: selectedFarm.id,
        },
        { userId: currentUser?.id, role: currentUser?.role }
      )
    );
    setCapasList(newCapas);
  };

  useEffect(() => {
    runEvaluation();
  }, [selectedFarmId, auditPeriod]);

  // Calculation Result via Ct4ciEngine
  const ct4ciResult: Ct4ciCalculationResult = useMemo(() => {
    return Ct4ciEngine.calculate(assessments, {
      registry: globalCheckpointRegistry,
      module: 'PRODUCER',
    });
  }, [assessments]);

  // Dual Indices Lite
  const cciBreakdown = useMemo(() => {
    const hasCompost = answers['Q_C07_CASCARA_UTILIZATION'] ? 90 : 45;
    return LiteEngine.calculateCci({
      cmi: 46.7,
      bvc: hasCompost,
      wc: 30.0,
      re: 25.0,
    });
  }, [answers]);

  const sdiBreakdown = useMemo(() => {
    return LiteEngine.calculateSdi();
  }, []);

  // IDSM 8 Rules Evaluation
  const idsmRules = useMemo(() => {
    return CtIdsmEngine.evaluate({
      farmer: {
        fullName: selectedFarm?.farmerName || selectedFarmer?.name || 'Petani Kopi Binaan',
        groupId: 'GROUP-KOP-01',
        province: selectedFarm?.province || 'Jawa Barat',
        district: selectedFarm?.location || 'Bandung',
      },
      plots: [
        {
          plotCode: selectedFarm?.id || 'PLOT-01',
          areaHa: selectedFarm?.landAreaHectares || 1.5,
          latitude: selectedFarm?.coordinates?.latitude ?? -7.15,
          longitude: selectedFarm?.coordinates?.longitude ?? 107.58,
          isDuplicateFlagged: false,
        },
      ],
      ct4ciResult,
      capas: capasList,
      budget: {
        allocatedIdr: 15000000,
      },
    });
  }, [selectedFarm, selectedFarmer, ct4ciResult, capasList]);

  // Preset Handlers
  const applyPreset = (presetKey: 'screenshot' | 'perfect100' | 'majorViolation') => {
    if (presetKey === 'screenshot') {
      const pAnswers = { ...PRESET_FARMER_ANSWERS.screenshot };
      setAnswers(pAnswers);
      runEvaluation(pAnswers);
    } else if (presetKey === 'perfect100') {
      const allCheckpoints = globalCheckpointRegistry.getModuleCheckpoints('PRODUCER');
      const perfectAssessments: CheckpointAssessment[] = allCheckpoints.map((cp) => ({
        scopeType: 'PRODUCER',
        scopeId: selectedFarm?.farmerId || 'FARMER-01',
        checkpointId: cp.checkpointCode,
        checkpointCode: cp.checkpointCode,
        period: auditPeriod,
        applicability: ApplicabilityDecision.APPLICABLE,
        evidenceSufficiency: EvidenceSufficiency.SUFFICIENT,
        complianceResult: ComplianceResult.COMPLIANT,
        evaluationNotes: 'Kepatuhan 100% sempurna terverifikasi bukti lapangan.',
        verifierUserId: currentUser?.id || 'VERIFIER-01',
        verifiedAt: new Date().toISOString(),
      }));
      setAssessments(perfectAssessments);
      setBannedAlert({ detected: false, reason: null });
      setCapasList([]);
    } else if (presetKey === 'majorViolation') {
      const pAnswers = { ...PRESET_FARMER_ANSWERS.majorViolation };
      setAnswers(pAnswers);
      runEvaluation(pAnswers);
    }
  };

  // Toggle Checkpoint Decision in Matrix
  const updateCheckpointDecision = (
    code: string,
    field: 'applicability' | 'evidenceSufficiency' | 'complianceResult',
    value: unknown
  ) => {
    setAssessments((prev) =>
      prev.map((a) => {
        if (a.checkpointCode === code) {
          return {
            ...a,
            [field]: value,
            verifierUserId: currentUser?.id,
            verifiedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
  };

  // Handle Certification Issuance
  const handleIssueCertification = () => {
    if (!selectedFarm) return;

    const certNumber = `CT-4CI-${new Date().getFullYear()}-${selectedFarm.id}-${Math.floor(1000 + Math.random() * 9000)}`;
    const signatureHash = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const snapshot: CtCertificationSnapshot = {
      farmId: selectedFarm.id,
      farmName: selectedFarm.farmName,
      farmerId: selectedFarm.farmerId,
      farmerName: selectedFarm.farmerName,
      period: auditPeriod,
      ct4ciScore: ct4ciResult.ct4ciScore ?? 0,
      evidenceCoveragePct: ct4ciResult.evidenceCoveragePct ?? 0,
      majorGateStatus: ct4ciResult.majorGateStatus,
      calculationStatus: ct4ciResult.calculationStatus,
      cciScore: cciBreakdown.totalScore,
      sdiScore: sdiBreakdown.totalScore,
      totalCheckpoints: ct4ciResult.totalInventory,
      applicableCount: ct4ciResult.applicableCount,
      compliantCount: ct4ciResult.compliantWithSufficientEvidenceCount,
      openCapasCount: capasList.filter((c) => c.status !== CapaStatus.CLOSED).length,
      dimensionBreakdown: ct4ciResult.dimensionResults,
      verifiedAt: new Date().toISOString(),
      verifierName: currentUser?.name || 'Verifikator Tim ICT / Lead Auditor',
      verifierId: currentUser?.id || 'VERIFIER-01',
      certificateNumber: certNumber,
      digitalSignatureHash: signatureHash,
    };

    certifyFarmWithCtIndex(selectedFarm.id, snapshot);
    setCertSuccessBanner(`Sertifikasi Kesiapan CT-4CI berhasil diterbitkan untuk "${selectedFarm.farmName}" dengan Nomor Sertifikat ${certNumber}. Status kebun kini diperbarui di seluruh ekosistem!`);

    setTimeout(() => {
      setCertSuccessBanner(null);
    }, 8000);
  };

  // Filtered Checkpoints for Matrix
  const filteredCheckpoints = useMemo(() => {
    const list = globalCheckpointRegistry.getModuleCheckpoints('PRODUCER');
    const aMap = new Map<string, CheckpointAssessment>(assessments.map((a) => [a.checkpointCode, a]));

    return list.filter((cp) => {
      if (checkpointDimensionFilter !== 'ALL' && cp.dimension !== checkpointDimensionFilter) return false;
      if (onlyMajorFilter && !cp.isMajor) return false;
      if (checkpointSearch.trim()) {
        const q = checkpointSearch.toLowerCase();
        const matchCode = cp.checkpointCode.toLowerCase().includes(q);
        const matchTitle = cp.title.toLowerCase().includes(q);
        const matchRef = cp.officialRef?.toLowerCase().includes(q) || false;
        if (!matchCode && !matchTitle && !matchRef) return false;
      }
      return true;
    }).map((cp) => {
      const ass = aMap.get(cp.checkpointCode);
      return {
        ...cp,
        assessment: ass,
      };
    });
  }, [assessments, checkpointDimensionFilter, onlyMajorFilter, checkpointSearch]);

  const isMajorPassed = ct4ciResult.majorGateStatus === MajorGateStatus.PASSED;

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Navigation Controls */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link
                to="/admin/ict"
                className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Pusat Verifikasi ICT</span>
              </Link>
              <span className="text-stone-300">•</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                CircularTrace Integrated Index Engine (CT-4CI / CCI / SDI)
              </span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
              <span>Audit &amp; Sertifikasi Kesiapan Kebun Kopi</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                4C Code of Conduct v4.1
              </span>
            </h1>
            <p className="text-xs text-stone-500 mt-1 max-w-3xl">
              Panel verifikator independen untuk menilai kepatuhan 108 checkpoint kebun kopi, menguji 5 kriteria pengaman non-kompensasi, dan menerbitkan stempel sertifikasi kesiapan digital.
            </p>
          </div>

          {/* Farm Selector */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 flex items-center gap-3">
              <TreePine className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                  Pilih Kebun yang Diaudit:
                </label>
                <select
                  value={selectedFarmId}
                  onChange={(e) => {
                    setSelectedFarmId(e.target.value);
                    navigate(`/admin/ict/ct-dashboard/${e.target.value}`);
                  }}
                  className="bg-transparent font-bold text-sm text-stone-900 focus:outline-none cursor-pointer"
                >
                  {coffeeFarms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.farmName} ({farm.farmerName} - {farm.landAreaHectares} Ha)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                  Musim Panen:
                </label>
                <select
                  value={auditPeriod}
                  onChange={(e) => setAuditPeriod(e.target.value)}
                  className="bg-transparent font-bold text-xs text-stone-800 focus:outline-none cursor-pointer"
                >
                  <option value="2026-PANEN-RAYA">Musim Panen Raya 2026</option>
                  <option value="2026-SEMESTER-1">Semester 1 - 2026</option>
                  <option value="2025-TAHUNAN">Musim Panen 2025</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Farm Quick Meta Bar */}
        {selectedFarm && (
          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 font-semibold text-stone-900">
                <Sprout className="w-4 h-4 text-emerald-600" />
                {selectedFarm.farmerName}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {selectedFarm.location}
              </span>
              <span>•</span>
              <span>Elevasi: <strong>{selectedFarm.altitudeMeters} mdpl</strong></span>
              <span>•</span>
              <span>Varietas: <strong>{selectedFarm.primaryVarieties.join(', ')}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              {selectedFarm.ctCertificationSnapshot ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Sertifikat Terbit: {selectedFarm.ctCertificationSnapshot.ct4ciScore}% ({selectedFarm.ctCertificationSnapshot.majorGateStatus})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  Menunggu Audit Lapangan
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Success Banner if newly issued */}
      {certSuccessBanner && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 text-emerald-900 flex items-start justify-between gap-3 shadow-md animate-fade-in">
          <div className="flex items-start gap-3">
            <Award className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-black block">Sertifikasi Berhasil Diterbitkan!</strong>
              <p className="text-xs text-emerald-800 mt-0.5">{certSuccessBanner}</p>
            </div>
          </div>
          <button
            onClick={() => setCertSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 text-sm font-bold p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Preset Buttons for Rapid Testing & Verifier Simulation */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-bold">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Skenario Simulasi Verifikasi Cepat:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('screenshot')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 font-bold text-[11px] transition shadow-2xs"
          >
            📸 1. Skenario Standar (95.9% CT-4CI, 100% EC)
          </button>
          <button
            onClick={() => applyPreset('perfect100')}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-2xs"
          >
            ✅ 2. Kesiapan Sempurna 100% (Passed)
          </button>
          <button
            onClick={() => applyPreset('majorViolation')}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition shadow-2xs"
          >
            🚨 3. Pelanggaran Kritis (Paraquat / Deforestasi)
          </button>
          <button
            onClick={() => runEvaluation()}
            className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-[11px] transition inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Kuesioner</span>
          </button>
        </div>
      </div>

      {/* Banned Chemical Alert Banner if triggered */}
      {bannedAlert.detected && (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 text-rose-950 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="text-sm font-black text-rose-900 block uppercase tracking-wide">
              Peringatan Pelanggaran Major: Bahan Kimia Terlarang Terdeteksi!
            </strong>
            <p className="mt-0.5 font-medium text-rose-800">
              {bannedAlert.reason}. Berdasarkan kriteria non-kompensasi standar 4C, penggunaan zat ini otomatis menggagalkan Major Gate (*Major Gate = UNRESOLVED*) dan menahan klaim sertifikasi publik.
            </p>
          </div>
        </div>
      )}

      {/* 2. Major Gate Status Banner */}
      <div
        className={`rounded-2xl p-4 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm transition-colors ${
          isMajorPassed ? 'bg-gradient-to-r from-emerald-600 to-teal-700' : 'bg-gradient-to-r from-rose-600 to-amber-700'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            {isMajorPassed ? (
              <CheckCircle2 className="w-7 h-7 text-white" />
            ) : (
              <XCircle className="w-7 h-7 text-white" />
            )}
          </div>
          <div>
            <div className="text-[11px] uppercase font-bold tracking-wider text-white/80">
              Status Major Gate 4C (Non-Compensating Safeguards)
            </div>
            <div className="text-xl font-black tracking-tight">
              {isMajorPassed ? 'MEMENUHI SYARAT (PASSED)' : 'DITAHAN: TERDAPAT TEMUAN KRITIS (UNRESOLVED)'}
            </div>
          </div>
        </div>

        <div className="text-right text-xs bg-black/15 px-4 py-2 rounded-xl border border-white/10 self-stretch md:self-auto flex md:flex-col justify-between items-center md:items-end">
          <span className="font-semibold text-white/90">Kriteria Kritis Terbukti Gagal:</span>
          <span className="font-black text-sm">
            {ct4ciResult.majorStats.nonCompliant} Gagal • {ct4ciResult.majorStats.insufficientEvidence} Kurang Bukti
          </span>
        </div>
      </div>

      {/* 3. The 4 Big Gauge Cards (CT-4CI, Evidence Coverage, CT-CCI, CT-SDI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: CT-4CI Readiness */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Kesiapan Sertifikasi 4C
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-stone-900 tracking-tight">
              {ct4ciResult.ct4ciScore !== null ? ct4ciResult.ct4ciScore : 0}%
            </span>
            <span className="text-xs font-bold text-stone-400">CT-4CI</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isMajorPassed ? 'bg-emerald-600' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, ct4ciResult.ct4ciScore || 0)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 font-medium">
            <span>{ct4ciResult.compliantWithSufficientEvidenceCount} dari {ct4ciResult.applicableCount} Sesuai</span>
            <span className={isMajorPassed ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
              {isMajorPassed ? 'Gate Passed' : 'Gate Blocked'}
            </span>
          </div>
        </div>

        {/* Card 2: Evidence Coverage (EC) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Cakupan Bukti Lapangan
            </span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-blue-900 tracking-tight">
              {ct4ciResult.evidenceCoveragePct !== null ? ct4ciResult.evidenceCoveragePct : 0}%
            </span>
            <span className="text-xs font-bold text-stone-400">EC</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ct4ciResult.evidenceCoveragePct || 0)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 font-medium">
            <span>{ct4ciResult.sufficientEvidenceCount} Bukti Terverifikasi</span>
            <span className="text-blue-700 font-bold">Invarian: CT-4CI ≤ EC</span>
          </div>
        </div>

        {/* Card 3: CT-CCI-Lite Circularity */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Sirkularitas Kopi (CT-CCI)
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Recycle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-900 tracking-tight">
              {cciBreakdown.totalScore}
            </span>
            <span className="text-xs font-bold text-stone-400">/ 100</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-amber-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, cciBreakdown.totalScore)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 font-medium">
            <span>BVC Cascara: {cciBreakdown.bvc}%</span>
            <span>CMI: {cciBreakdown.cmi}%</span>
          </div>
        </div>

        {/* Card 4: CT-SDI-Lite Sustainability */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Keberlanjutan (CT-SDI)
            </span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Scale className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-teal-900 tracking-tight">
              {sdiBreakdown.totalScore}
            </span>
            <span className="text-xs font-bold text-stone-400">/ 100</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, sdiBreakdown.totalScore)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 font-medium">
            <span>4 Dimensi SAFA (E/S/Ec/G)</span>
            <span className="text-teal-700 font-bold">25% Bobot Rata</span>
          </div>
        </div>
      </div>

      {/* 4. Tab Navigation Menu */}
      <div className="border-b border-stone-200 flex items-center gap-1 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 font-bold text-xs border-b-2 transition flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Ringkasan &amp; Aturan IDSM ({idsmRules.length} Aturan)</span>
        </button>

        <button
          onClick={() => setActiveTab('practices')}
          className={`px-4 py-3 font-bold text-xs border-b-2 transition flex items-center gap-2 ${
            activeTab === 'practices'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>2. Kuesioner Praktik Budidaya (Topik A–E)</span>
        </button>

        <button
          onClick={() => setActiveTab('checkpoints')}
          className={`px-4 py-3 font-bold text-xs border-b-2 transition flex items-center gap-2 ${
            activeTab === 'checkpoints'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Matriks 108 Checkpoint 4C</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 text-stone-800 font-bold">
            {ct4ciResult.totalInventory}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('capa')}
          className={`px-4 py-3 font-bold text-xs border-b-2 transition flex items-center gap-2 ${
            activeTab === 'capa'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>4. Temuan &amp; CAPA</span>
          {capasList.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800 font-bold">
              {capasList.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('certificate')}
          className={`px-4 py-3 font-bold text-xs border-b-2 transition flex items-center gap-2 ${
            activeTab === 'certificate'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>5. Terbitkan Sertifikat &amp; Stempel Digital</span>
        </button>
      </div>

      {/* 5. TAB PANELS */}

      {/* TAB 1: OVERVIEW & IDSM RULES */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Dimension Breakdown Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <h3 className="text-base font-black text-stone-900 mb-4 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-600" />
              <span>Rincian Kesiapan per Dimensi Standar 4C Producer</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Economic */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
                  <span>1. Dimensi Ekonomi (P001–P019)</span>
                  <span className="text-amber-800 font-black text-sm">
                    {ct4ciResult.dimensionResults[DimensionType.ECONOMIC]?.readinessScore ?? 0}%
                  </span>
                </div>
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-amber-600 rounded-full"
                    style={{ width: `${ct4ciResult.dimensionResults[DimensionType.ECONOMIC]?.readinessScore ?? 0}%` }}
                  />
                </div>
                <div className="text-[11px] text-stone-500 space-y-1">
                  <div>Checkpoint Sesuai: <strong>{ct4ciResult.dimensionResults[DimensionType.ECONOMIC]?.compliantCount ?? 0} / 19</strong></div>
                  <div>Cakupan Bukti: <strong>{ct4ciResult.dimensionResults[DimensionType.ECONOMIC]?.evidenceCoveragePct ?? 0}%</strong></div>
                </div>
              </div>

              {/* Social */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
                  <span>2. Dimensi Sosial (P020–P069)</span>
                  <span className="text-blue-800 font-black text-sm">
                    {ct4ciResult.dimensionResults[DimensionType.SOCIAL]?.readinessScore ?? 0}%
                  </span>
                </div>
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${ct4ciResult.dimensionResults[DimensionType.SOCIAL]?.readinessScore ?? 0}%` }}
                  />
                </div>
                <div className="text-[11px] text-stone-500 space-y-1">
                  <div>Checkpoint Sesuai: <strong>{ct4ciResult.dimensionResults[DimensionType.SOCIAL]?.compliantCount ?? 0} / 50</strong></div>
                  <div>Cakupan Bukti: <strong>{ct4ciResult.dimensionResults[DimensionType.SOCIAL]?.evidenceCoveragePct ?? 0}%</strong></div>
                </div>
              </div>

              {/* Environmental */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
                  <span>3. Dimensi Lingkungan (P070–P108)</span>
                  <span className="text-emerald-800 font-black text-sm">
                    {ct4ciResult.dimensionResults[DimensionType.ENVIRONMENTAL]?.readinessScore ?? 0}%
                  </span>
                </div>
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${ct4ciResult.dimensionResults[DimensionType.ENVIRONMENTAL]?.readinessScore ?? 0}%` }}
                  />
                </div>
                <div className="text-[11px] text-stone-500 space-y-1">
                  <div>Checkpoint Sesuai: <strong>{ct4ciResult.dimensionResults[DimensionType.ENVIRONMENTAL]?.compliantCount ?? 0} / 39</strong></div>
                  <div>Cakupan Bukti: <strong>{ct4ciResult.dimensionResults[DimensionType.ENVIRONMENTAL]?.evidenceCoveragePct ?? 0}%</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* IDSM Rules 8 Cards */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Evaluasi 8 Aturan Pendukung Keputusan Otomatis (CT-IDSM Rules)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Mesin berbasis aturan eksplanatif untuk menjamin keabsahan data, kepatuhan batas poligon, dan kelayakan pembiayaan perbaikan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {idsmRules.map((rule) => {
                const isTriggered = rule.status === IdsmRuleStatus.TRIGGERED;
                const isPass = rule.status === IdsmRuleStatus.NOT_TRIGGERED;

                return (
                  <div
                    key={rule.ruleId}
                    className={`border rounded-xl p-4 transition ${
                      isTriggered
                        ? 'border-rose-300 bg-rose-50/40 text-rose-950'
                        : isPass
                        ? 'border-emerald-200 bg-emerald-50/30 text-stone-800'
                        : 'border-stone-200 bg-stone-50/50 text-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-white border border-stone-200 shadow-2xs">
                        {rule.ruleId}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isTriggered
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : isPass
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {rule.status}
                      </span>
                    </div>
                    <div className="font-bold text-xs mb-1 text-stone-900">{rule.ruleName}</div>
                    <div className="text-[11px] leading-relaxed text-stone-600 mb-2">{rule.reason}</div>
                    <div className="text-[10px] font-semibold text-stone-500 bg-white/70 p-2 rounded-lg border border-stone-100">
                      💡 Rekomendasi: {rule.recommendations}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRACTICES QUESTIONNAIRE (TOPICS A-E) */}
      {activeTab === 'practices' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-black text-stone-900">
                  Formulir Kuesioner Praktik Budidaya Kopi (Topik A s/d E)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Isian evaluasi lapangan oleh petugas ICS/Verifikator yang otomatis terpetakan ke 108 checkpoint 4C Producer.
                </p>
              </div>

              <button
                onClick={() => runEvaluation()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simpan &amp; Hitung Kesiapan</span>
              </button>
            </div>

            <div className="space-y-6">
              {PracticesFormConfig.map((category) => (
                <div key={category.category} className="border border-stone-200 rounded-2xl p-5 bg-stone-50/30">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xl">{category.categoryIcon}</span>
                    <h4 className="font-black text-sm text-stone-900">{category.categoryName}</h4>
                  </div>
                  <p className="text-xs text-stone-500 mb-4">{category.description}</p>

                  <div className="space-y-4">
                    {category.sections.flatMap((s) => s.questions).map((q) => {
                      const val = answers[q.id];

                      return (
                        <div key={q.id} className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <label className="text-xs font-bold text-stone-800 leading-snug">
                              {q.text}
                            </label>
                            {q.isMajor && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-800 border border-rose-300 shrink-0">
                                MAJOR
                              </span>
                            )}
                          </div>

                          {/* Control Types */}
                          {q.type === 'BOOLEAN' && (
                            <div className="flex items-center gap-3 mt-2">
                              <label className="inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                                <input
                                  type="radio"
                                  name={q.id}
                                  checked={val === true}
                                  onChange={() => {
                                    const next = { ...answers, [q.id]: true };
                                    setAnswers(next);
                                  }}
                                  className="text-emerald-600"
                                />
                                <span className={val === true ? 'text-emerald-700' : 'text-stone-600'}>Ya / Sesuai</span>
                              </label>

                              <label className="inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                                <input
                                  type="radio"
                                  name={q.id}
                                  checked={val === false}
                                  onChange={() => {
                                    const next = { ...answers, [q.id]: false };
                                    setAnswers(next);
                                  }}
                                  className="text-rose-600"
                                />
                                <span className={val === false ? 'text-rose-700' : 'text-stone-600'}>Tidak / Belum</span>
                              </label>
                            </div>
                          )}

                          {q.type === 'MULTI_CHOICE' && (
                            <select
                              value={String(val || '')}
                              onChange={(e) => {
                                const next = { ...answers, [q.id]: e.target.value };
                                setAnswers(next);
                              }}
                              className="mt-2 w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
                            >
                              <option value="">-- Pilih opsi observasi --</option>
                              {q.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          )}

                          {q.type === 'TEXT' && (
                            <input
                              type="text"
                              value={String(val || '')}
                              onChange={(e) => {
                                const next = { ...answers, [q.id]: e.target.value };
                                setAnswers(next);
                              }}
                              placeholder="Masukkan nama bahan kimia / catatan..."
                              className="mt-2 w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
                            />
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-stone-100 text-[10px] text-stone-500">
                            <span>Mapped Checkpoint: <strong>{q.mappedCheckpoints.join(', ')}</strong></span>
                            <span>Bukti: <em>{q.evidenceRequired}</em></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => runEvaluation()}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Seluruh Isian &amp; Jalankan Engine Kalkulasi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CHECKPOINT MATRIX (108 Checkpoints) */}
      {activeTab === 'checkpoints' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-black text-stone-900">
                  Matriks 108 Checkpoint 4C Code of Conduct v4.1
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Tinjau dan sesuaikan keputusan Ai (Keberlakuan), Vi (Kecukupan Bukti), dan Ci (Kepatuhan) per butir kriteria.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-initial">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari kode (P070), kata kunci..."
                    value={checkpointSearch}
                    onChange={(e) => setCheckpointSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 w-full md:w-48 focus:outline-none"
                  />
                </div>

                <select
                  value={checkpointDimensionFilter}
                  onChange={(e) => setCheckpointDimensionFilter(e.target.value as 'ALL' | DimensionType)}
                  className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-stone-800 focus:outline-none"
                >
                  <option value="ALL">Semua Dimensi</option>
                  <option value={DimensionType.ECONOMIC}>Ekonomi (19)</option>
                  <option value={DimensionType.SOCIAL}>Sosial (50)</option>
                  <option value={DimensionType.ENVIRONMENTAL}>Lingkungan (39)</option>
                </select>

                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyMajorFilter}
                    onChange={(e) => setOnlyMajorFilter(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span>Hanya Major</span>
                </label>
              </div>
            </div>

            {/* Checkpoints Table with strict horizontal scroll & unwrapped cells */}
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-left text-xs min-w-[950px]">
                <thead className="bg-stone-50 text-stone-700 uppercase font-black text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-3 whitespace-nowrap">Kode</th>
                    <th className="py-3 px-3 whitespace-nowrap">Dimensi</th>
                    <th className="py-3 px-4 whitespace-nowrap">Kriteria Checkpoint</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">Ai (Berlaku)</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">Vi (Bukti Cukup)</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">Ci (Kepatuhan)</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">Status Produk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredCheckpoints.map((cp) => {
                    const ass = cp.assessment;
                    const isMajor = cp.isMajor;
                    const Ai = ass?.applicability === ApplicabilityDecision.NOT_APPLICABLE ? 0 : 1;
                    const Vi = ass?.evidenceSufficiency === EvidenceSufficiency.SUFFICIENT ? 1 : 0;
                    const Ci = ass?.complianceResult === ComplianceResult.COMPLIANT ? 1 : 0;
                    const product = Ai * Vi * Ci;

                    return (
                      <tr key={cp.checkpointCode} className="hover:bg-stone-50/70 transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-stone-900 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span>{cp.checkpointCode}</span>
                            {isMajor && (
                              <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-rose-100 text-rose-800 border border-rose-200 shrink-0">
                                M
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              cp.dimension === DimensionType.ECONOMIC
                                ? 'bg-amber-100 text-amber-800'
                                : cp.dimension === DimensionType.SOCIAL
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {cp.dimension}
                          </span>
                        </td>

                        <td className="py-2.5 px-4">
                          <div className="font-bold text-stone-900 leading-snug">{cp.title}</div>
                          <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{cp.description}</div>
                        </td>

                        {/* Ai Selector */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <select
                            value={ass?.applicability || ApplicabilityDecision.APPLICABLE}
                            onChange={(e) =>
                              updateCheckpointDecision(cp.checkpointCode, 'applicability', e.target.value)
                            }
                            className={`text-[11px] font-bold px-2 py-1 rounded-md border focus:outline-none ${
                              ass?.applicability === ApplicabilityDecision.NOT_APPLICABLE
                                ? 'bg-stone-100 text-stone-600 border-stone-300'
                                : 'bg-white text-stone-800 border-stone-300'
                            }`}
                          >
                            <option value={ApplicabilityDecision.APPLICABLE}>Ai = 1 (Berlaku)</option>
                            <option value={ApplicabilityDecision.NOT_APPLICABLE}>Ai = 0 (N/A)</option>
                            <option value={ApplicabilityDecision.UNDECIDED}>Ai = 1 (Pending)</option>
                          </select>
                        </td>

                        {/* Vi Selector */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <select
                            value={ass?.evidenceSufficiency || EvidenceSufficiency.NOT_AVAILABLE}
                            onChange={(e) =>
                              updateCheckpointDecision(cp.checkpointCode, 'evidenceSufficiency', e.target.value)
                            }
                            className={`text-[11px] font-bold px-2 py-1 rounded-md border focus:outline-none ${
                              ass?.evidenceSufficiency === EvidenceSufficiency.SUFFICIENT
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            <option value={EvidenceSufficiency.SUFFICIENT}>Vi = 1 (Cukup)</option>
                            <option value={EvidenceSufficiency.INSUFFICIENT}>Vi = 0 (Kurang)</option>
                            <option value={EvidenceSufficiency.NOT_AVAILABLE}>Vi = 0 (Belum Ada)</option>
                          </select>
                        </td>

                        {/* Ci Selector */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <select
                            value={ass?.complianceResult || ComplianceResult.UNDETERMINED}
                            onChange={(e) =>
                              updateCheckpointDecision(cp.checkpointCode, 'complianceResult', e.target.value)
                            }
                            className={`text-[11px] font-bold px-2 py-1 rounded-md border focus:outline-none ${
                              ass?.complianceResult === ComplianceResult.COMPLIANT
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            <option value={ComplianceResult.COMPLIANT}>Ci = 1 (Sesuai)</option>
                            <option value={ComplianceResult.NON_COMPLIANT}>Ci = 0 (Gagal)</option>
                            <option value={ComplianceResult.UNDETERMINED}>Ci = 0 (Pending)</option>
                          </select>
                        </td>

                        {/* Product */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              product === 1
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            {product === 1 ? '✓ Kredit (1)' : '— (0)'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TEMUAN & CAPA */}
      {activeTab === 'capa' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-black text-stone-900">
                  Rencana Tindakan Korektif &amp; Pencegahan (CAPA Plan)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Daftar ketidaksesuaian yang membutuhkan bukti tindakan perbaikan sebelum kriteria dapat ditutup.
                </p>
              </div>

              <div className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl">
                Total Terbuka: <strong className="text-rose-700">{capasList.filter((c) => c.status !== CapaStatus.CLOSED).length} Temuan</strong>
              </div>
            </div>

            {capasList.length === 0 ? (
              <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-stone-800">Tidak Ada Temuan Ketidaksesuaian (CAPA Bersih)</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Seluruh kriteria checkpoint telah terbukti sesuai dan didukung bukti fisik yang memadai.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-stone-200 rounded-xl">
                <table className="w-full text-left text-xs min-w-[900px]">
                  <thead className="bg-stone-50 text-stone-700 uppercase font-black text-[10px] tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-3 whitespace-nowrap">Kode CAPA</th>
                      <th className="py-3 px-3 whitespace-nowrap">Severity</th>
                      <th className="py-3 px-4 whitespace-nowrap">Uraian Temuan &amp; Rencana Aksi</th>
                      <th className="py-3 px-3 whitespace-nowrap">Tenggat</th>
                      <th className="py-3 px-3 text-right whitespace-nowrap">Est. Biaya (RAB)</th>
                      <th className="py-3 px-3 text-center whitespace-nowrap">Status</th>
                      <th className="py-3 px-3 text-right whitespace-nowrap">Aksi Verifikator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {capasList.map((capa) => (
                      <tr key={capa.id} className="hover:bg-stone-50/70 transition">
                        <td className="py-3 px-3 font-mono font-bold text-stone-900 whitespace-nowrap">
                          {capa.capaCode}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-black ${
                              capa.severity === 'MAJOR'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {capa.severity}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900 leading-snug">{capa.findingTitle}</div>
                          <div className="text-[11px] text-stone-600 mt-1">{capa.actionPlan}</div>
                          {capa.completionProofRef && (
                            <div className="text-[10px] text-blue-700 font-semibold mt-1">
                              📎 Bukti: {capa.completionProofRef}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-3 text-stone-600 whitespace-nowrap">
                          {capa.deadlineDate}
                        </td>

                        <td className="py-3 px-3 text-right font-bold text-stone-900 whitespace-nowrap">
                          Rp {capa.estimatedCostIdr.toLocaleString('id-ID')}
                        </td>

                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              capa.status === CapaStatus.CLOSED
                                ? 'bg-emerald-100 text-emerald-800'
                                : capa.status === CapaStatus.PENDING_VERIFICATION
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {capa.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {capa.status !== CapaStatus.CLOSED ? (
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => {
                                  globalCapaManager.submitCompletionProof(capa.id, 'Bukti_Perbaikan_Lapangan_2026.jpg', capa.estimatedCostIdr);
                                  globalCapaManager.verifyClosure(capa.id, {
                                    accepted: true,
                                    verifierId: currentUser?.id || 'VERIFIER-01',
                                    notes: 'Telah diaudit fisik dan disetujui memenuhi standar 4C.',
                                  });
                                  setCapasList([...globalCapaManager.getAll().filter((c) => c.scopeId === selectedFarm?.id)]);
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition shadow-2xs"
                              >
                                Verifikasi &amp; Tutup
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-stone-400 font-bold">Ditutup ✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: CERTIFICATE PREVIEW & DIGITAL STAMP ISSUANCE */}
      {activeTab === 'certificate' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
            <div className="max-w-2xl mx-auto border-4 border-double border-amber-800/30 p-8 rounded-3xl bg-[#FFFDF9] relative">
              {/* Watermark Logo */}
              <div className="text-center pb-6 border-b-2 border-stone-200">
                <div className="w-14 h-14 bg-amber-600 rounded-2xl text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  ☕
                </div>
                <div className="text-[11px] uppercase tracking-widest font-black text-amber-900">
                  CircularTrace Global Certification Platform
                </div>
                <h2 className="text-2xl font-black text-stone-900 mt-1">
                  Surat Keterangan Kesiapan Sertifikasi Kopi
                </h2>
                <div className="text-xs text-stone-500 font-medium">
                  Merujuk pada Standar 4C Code of Conduct v4.1 &amp; Coffee Traceability Index
                </div>
              </div>

              {/* Certificate Details */}
              <div className="py-6 space-y-4 text-xs">
                <p className="text-stone-700 leading-relaxed text-center">
                  Dengan ini diterangkan bahwa petak kebun kopi di bawah ini telah diaudit dan dinilai kesiapannya oleh Tim Pengendali Internal (ICS) / Verifikator Resmi:
                </p>

                <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-2.5 shadow-2xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-medium">Nama Kebun:</span>
                    <strong className="text-stone-900">{selectedFarm?.farmName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-medium">Pemilik / Petani:</span>
                    <strong className="text-stone-900">{selectedFarm?.farmerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-medium">Lokasi Geografis:</span>
                    <span className="text-stone-800">{selectedFarm?.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-medium">Luas Lahan / Elevasi:</span>
                    <span className="text-stone-800">{selectedFarm?.landAreaHectares} Ha • {selectedFarm?.altitudeMeters} mdpl</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-medium">Musim Penilaian:</span>
                    <span className="text-stone-800">{auditPeriod}</span>
                  </div>
                </div>

                {/* Score Summary Box */}
                <div className="grid grid-cols-3 gap-3 text-center pt-2">
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase">CT-4CI Readiness</div>
                    <div className="text-2xl font-black text-emerald-900">{ct4ciResult.ct4ciScore ?? 0}%</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                    <div className="text-[10px] font-bold text-blue-800 uppercase">Evidence Coverage</div>
                    <div className="text-2xl font-black text-blue-900">{ct4ciResult.evidenceCoveragePct ?? 0}%</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                    <div className="text-[10px] font-bold text-amber-800 uppercase">Major Gate</div>
                    <div className={`text-base font-black ${isMajorPassed ? 'text-emerald-800' : 'text-rose-700'}`}>
                      {ct4ciResult.majorGateStatus}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                  <div>
                    <div>Diverifikasi oleh: <strong>{currentUser?.name || 'Lead Auditor Tim ICT'}</strong></div>
                    <div>Tanggal Audit: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</div>
                  </div>

                  <div className="text-right font-mono text-[10px] text-stone-400">
                    <div>DIGITAL SIGNATURE HASH</div>
                    <div>0x8f2a...c817c</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Lembar Sertifikat</span>
                </button>

                <button
                  onClick={handleIssueCertification}
                  disabled={!isMajorPassed}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-md ${
                    isMajorPassed
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Terbitkan Stempel Sertifikasi Resmi</span>
                </button>
              </div>

              {!isMajorPassed && (
                <p className="text-[11px] text-rose-600 text-center mt-3 font-semibold">
                  ⚠️ Penerbitan stempel resmi diblokir karena terdapat kriteria Major yang belum terpenuhi atau melanggar pengaman kritis.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CtFarmCertificationDashboardPage;
