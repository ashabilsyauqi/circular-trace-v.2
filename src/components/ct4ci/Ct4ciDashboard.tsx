import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  ListTodo,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import {
  ComplianceLevel,
  Ct4ciAuditMetrics,
} from '../../types/ct4ci';
import { CT4CI_MASTER_108 } from '../../data/ct4ciMaster108';

interface Ct4ciDashboardProps {
  metrics: Ct4ciAuditMetrics;
  complianceLevel: ComplianceLevel;
  onLevelChange: (lvl: ComplianceLevel) => void;
  onNavigateTab: (tab: 'registration' | 'field_form' | 'ics_validation' | 'cap') => void;
}

export const Ct4ciDashboard: React.FC<Ct4ciDashboardProps> = ({
  metrics,
  complianceLevel,
  onLevelChange,
  onNavigateTab,
}) => {
  // Count by dimension
  const dim1Total = CT4CI_MASTER_108.filter(c => c.dimension.includes('Economic')).length;
  const dim2Total = CT4CI_MASTER_108.filter(c => c.dimension.includes('Social')).length;
  const dim3Total = CT4CI_MASTER_108.filter(c => c.dimension.includes('Environmental')).length;

  const isGatePassed = metrics.majorGateStatus === 'PASSED';
  const isGateFailed = metrics.majorGateStatus === 'FAILED';

  return (
    <div className="space-y-6">
      {/* Header Banner & Level Selector */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-800/30">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>4C Code of Conduct v4.1 • BP Producer Standard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Dashboard Kesiapan Audit CT-4CI Farm
            </h1>
            <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Pemantauan pra-audit internal 108 checkpoint produsen kopi berkelanjutan, verifikasi bukti lapangan, dan validasi kepatuhan gerbang Major.
            </p>
          </div>

          {/* Level Switcher */}
          <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-700/60 backdrop-blur-sm self-start lg:self-auto min-w-[280px]">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-2 flex items-center justify-between">
              <span>Target Compliance Level</span>
              <span className="text-amber-400 font-bold">Level {complianceLevel}</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800">
              {(['1', '2', '3+'] as ComplianceLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onLevelChange(lvl)}
                  className={`py-2 text-xs font-bold rounded-md transition-all flex flex-col items-center ${
                    complianceLevel === lvl
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <span>Level {lvl}</span>
                  <span className="text-[10px] font-normal opacity-75">
                    {lvl === '1' ? 'Entry' : lvl === '2' ? 'Progres' : 'Lanjut'}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-400 mt-2 flex items-center gap-1">
              <Info className="w-3 h-3 text-amber-400 shrink-0" />
              Klasifikasi Major/Minor berubah dinamis per level.
            </p>
          </div>
        </div>
      </div>

      {/* Status Gate Notification Bar */}
      <div className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
        isGatePassed
          ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-200'
          : isGateFailed
          ? 'bg-rose-950/40 border-rose-600/40 text-rose-200'
          : 'bg-amber-950/40 border-amber-600/40 text-amber-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg shrink-0 ${
            isGatePassed
              ? 'bg-emerald-600 text-white'
              : isGateFailed
              ? 'bg-rose-600 text-white'
              : 'bg-amber-600 text-white'
          }`}>
            {isGatePassed ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
              Hasil Pra-Audit Gerbang Major (Major Gate)
            </div>
            <div className="text-base sm:text-lg font-bold">
              {metrics.auditReadinessStatus}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {metrics.unfulfilledMajorCount > 0 && (
            <button
              onClick={() => onNavigateTab('cap')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <ListTodo className="w-4 h-4" />
              <span>Lihat {metrics.unfulfilledMajorCount} Temuan Major</span>
            </button>
          )}
          <button
            onClick={() => onNavigateTab('ics_validation')}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-lg border border-stone-600 transition-colors"
          >
            Review Validasi ICS
          </button>
        </div>
      </div>

      {/* 4 Main Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Checkpoint & Applicability */}
        <div className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs font-medium">
            <span>TOTAL CHECKPOINT</span>
            <Layers className="w-4 h-4 text-stone-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-white">
              {metrics.totalCheckpoints}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">Resmi 4C v4.1</span>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs space-y-1.5 text-stone-600 dark:text-stone-300">
            <div className="flex justify-between">
              <span>Berlaku (Applicable):</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{metrics.applicableCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Tidak Berlaku (NA Smallholder):</span>
              <span className="font-semibold text-stone-500">{metrics.naCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Belum Diputuskan:</span>
              <span className={`font-semibold ${metrics.undecidedApplicabilityCount > 0 ? 'text-amber-500' : 'text-stone-400'}`}>
                {metrics.undecidedApplicabilityCount}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Bukti Terverifikasi */}
        <div className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs font-medium">
            <span>CAKUPAN BUKTI (EVIDENCE)</span>
            <FileCheck2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-white">
              {metrics.evidenceCoveragePercent}%
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              ({metrics.verifiedEvidenceCount}/{metrics.applicableCount || metrics.totalCheckpoints})
            </span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.evidenceCoveragePercent}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">
              Bukti foto/dokumen lapangan yang sudah diverifikasi ICS.
            </p>
          </div>
        </div>

        {/* Card 3: Readiness Score */}
        <div className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs font-medium">
            <span>SKOR KESIAPAN AUDIT</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${
              metrics.readinessScorePercent >= 80 ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {metrics.readinessScorePercent}%
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">Baseline</span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  metrics.readinessScorePercent >= 80 ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
                style={{ width: `${metrics.readinessScorePercent}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">
              Formula: Sesuai & Bukti Valid / Checkpoint Berlaku.
            </p>
          </div>
        </div>

        {/* Card 4: Major Gate / Ketidaksesuaian */}
        <div className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs font-medium">
            <span>MAJOR BELUM TERPENUHI</span>
            <ShieldCheck className={`w-4 h-4 ${isGatePassed ? 'text-emerald-600' : 'text-rose-600'}`} />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${
              metrics.unfulfilledMajorCount === 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {metrics.unfulfilledMajorCount}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              dari Level {complianceLevel}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs space-y-1.5 text-stone-600 dark:text-stone-300">
            <div className="flex justify-between">
              <span>Ketidaksesuaian Tercatat:</span>
              <span className="font-semibold text-rose-500">{metrics.nonConformityCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Status Gate Major:</span>
              <span className={`font-bold ${isGatePassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                {metrics.majorGateStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Dimensions Breakdown */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
        <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Distribusi Checkpoint Berdasarkan 3 Dimensi 4C</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dimensi 1: Economic */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase">
              1. Economic Dimension
            </div>
            <div className="text-xl font-extrabold text-stone-900 dark:text-white mt-1">
              {dim1Total} Checkpoints
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Ketelusuran lot, pemisahan fisik 4C, pembukuan kas kebun, anti-korupsi, dan kontrak kerja.
            </p>
          </div>

          {/* Dimensi 2: Social */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase">
              2. Social Dimension
            </div>
            <div className="text-xl font-extrabold text-stone-900 dark:text-white mt-1">
              {dim2Total} Checkpoints
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Hak buruh, upah layak, larangan pekerja anak, K3 (APD), fasilitas medis, dan kebebasan berserikat.
            </p>
          </div>

          {/* Dimensi 3: Environmental */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase">
              3. Environmental Dimension
            </div>
            <div className="text-xl font-extrabold text-stone-900 dark:text-white mt-1">
              {dim3Total} Checkpoints
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Perlindungan hutan/HCV, konservasi tanah/air, pengelolaan limbah kopi, dan pestisida terlarang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
