/**
 * CIRCULARTRACE - CT-IDSM Rule-Based Decision Support Engine (TypeScript)
 * Implements the 8 Explainable Rules: DQ-01, DQ-02, EV-01, CF-01, CF-02, MB-01, OP-01, OP-02
 * Reference: CircularTrace Paper Section 3.12
 */

import {
  IdsmRuleId,
  IdsmRuleStatus,
  IdsmEvaluationRuleResult,
  Ct4ciCalculationResult,
  CapaItem
} from './types';

export interface IdsmContext {
  farmer?: {
    fullName?: string;
    groupId?: string;
    province?: string;
    district?: string;
    subDistrict?: string;
    village?: string;
    dataConsentGiven?: boolean;
  };
  plots?: Array<{
    plotCode: string;
    areaHa: number;
    latitude?: number | null;
    longitude?: number | null;
    isDuplicateFlagged?: boolean;
  }>;
  ct4ciResult?: Ct4ciCalculationResult;
  capas?: CapaItem[];
  massBalance?: {
    isResidualExceeded?: boolean;
    residualPct?: number;
    tolerancePct?: number;
  };
  budget?: {
    allocatedIdr?: number;
  };
}

export class CtIdsmEngine {
  /**
   * Evaluate all 8 CT-IDSM rules for an assessment context
   */
  static evaluate(context: IdsmContext = {}): IdsmEvaluationRuleResult[] {
    const {
      farmer,
      plots = [],
      ct4ciResult,
      capas = [],
      massBalance,
      budget
    } = context;

    const rules: IdsmEvaluationRuleResult[] = [];

    // ------------------------------------------------------------------------
    // RULE DQ-01: Data Wajib Hilang / Tidak Valid
    // ------------------------------------------------------------------------
    const missingFields: string[] = [];
    if (!farmer?.fullName) missingFields.push('Nama Petani');
    if (!farmer?.groupId) missingFields.push('Kelompok Tani');
    if (!farmer?.province || !farmer?.district) missingFields.push('Lokasi Administratif (Provinsi / Kabupaten)');

    for (const plot of plots) {
      if (!plot.areaHa || plot.areaHa <= 0) missingFields.push(`Luas Petak (${plot.plotCode})`);
      if (plot.latitude === null || plot.latitude === undefined || plot.longitude === null || plot.longitude === undefined) {
        missingFields.push(`Koordinat Geografis (${plot.plotCode})`);
      }
    }

    if (missingFields.length > 0) {
      rules.push({
        ruleId: IdsmRuleId.DQ_01,
        ruleName: 'Data Wajib Hilang / Tidak Valid',
        status: IdsmRuleStatus.TRIGGERED,
        reason: `Ditemukan ${missingFields.length} data wajib yang belum lengkap: ${missingFields.join(', ')}.`,
        recommendations: 'Lengkapi isian data dasar sebelum memfinalisasi penilaian kesiapan kebun.',
        details: { missingFields }
      });
    } else {
      rules.push({
        ruleId: IdsmRuleId.DQ_01,
        ruleName: 'Data Wajib Hilang / Tidak Valid',
        status: IdsmRuleStatus.NOT_TRIGGERED,
        reason: 'Seluruh data wajib petani dan petak kebun lengkap dan valid.',
        recommendations: 'Data dasar lengkap, proses verifikasi dapat dilanjutkan.'
      });
    }

    // ------------------------------------------------------------------------
    // RULE DQ-02: Transaksi / Petak Duplikat atau Konflik Alokasi
    // ------------------------------------------------------------------------
    const duplicatePlots = plots.filter(p => p.isDuplicateFlagged);
    if (duplicatePlots.length > 0) {
      rules.push({
        ruleId: IdsmRuleId.DQ_02,
        ruleName: 'Duplikasi atau Konflik Alokasi Data Plot',
        status: IdsmRuleStatus.TRIGGERED,
        reason: `Terdeteksi ${duplicatePlots.length} petak berpotensi tumpang tindih jarak < 15 meter: ${duplicatePlots.map(p => p.plotCode).join(', ')}.`,
        recommendations: 'Lakukan rekonsiliasi koordinat GPS poligon kebun untuk mencegah klaim ganda.',
        details: { duplicatePlots }
      });
    } else {
      rules.push({
        ruleId: IdsmRuleId.DQ_02,
        ruleName: 'Duplikasi atau Konflik Alokasi Data Plot',
        status: IdsmRuleStatus.NOT_TRIGGERED,
        reason: 'Tidak terdeteksi tumpang tindih koordinat atau duplikasi petak kebun.',
        recommendations: 'Integritas spasial poligon kebun terjamin.'
      });
    }

    // ------------------------------------------------------------------------
    // RULE EV-01: Applicability atau Bukti Belum Selesai (Pending)
    // ------------------------------------------------------------------------
    if (!ct4ciResult) {
      rules.push({
        ruleId: IdsmRuleId.EV_01,
        ruleName: 'Penyelesaian Applicability & Kecukupan Bukti',
        status: IdsmRuleStatus.NOT_EVALUABLE,
        reason: 'Hasil perhitungan CT-4CI belum tersedia.',
        recommendations: 'Jalankan evaluasi kuesioner terlebih dahulu.'
      });
    } else if (ct4ciResult.undecidedApplicabilityCount > 0 || ct4ciResult.insufficientEvidenceCount > 0) {
      rules.push({
        ruleId: IdsmRuleId.EV_01,
        ruleName: 'Penyelesaian Applicability & Kecukupan Bukti',
        status: IdsmRuleStatus.TRIGGERED,
        reason: `Terdapat ${ct4ciResult.undecidedApplicabilityCount} checkpoint belum diputuskan status keberlakuannya dan ${ct4ciResult.insufficientEvidenceCount} checkpoint belum cukup bukti fisik.`,
        recommendations: 'Verifikator wajib memvalidasi kecukupan bukti sebelum sertifikasi difinalisasi.',
        details: {
          undecidedCount: ct4ciResult.undecidedApplicabilityCount,
          insufficientCount: ct4ciResult.insufficientEvidenceCount
        }
      });
    } else {
      rules.push({
        ruleId: IdsmRuleId.EV_01,
        ruleName: 'Penyelesaian Applicability & Kecukupan Bukti',
        status: IdsmRuleStatus.NOT_TRIGGERED,
        reason: 'Seluruh applicability terselesaikan dan seluruh bukti fisik terpenuhi (Evidence Coverage 100%).',
        recommendations: 'Cakupan bukti lengkap.'
      });
    }

    // ------------------------------------------------------------------------
    // RULE CF-01: Major Terbukti Tidak Sesuai (Non-Compliant)
    // ------------------------------------------------------------------------
    const majorNonCompliantCount = ct4ciResult?.majorStats?.nonCompliant || 0;
    if (majorNonCompliantCount > 0) {
      rules.push({
        ruleId: IdsmRuleId.CF_01,
        ruleName: 'Major Terbukti Tidak Sesuai (Wajib Tindakan Perbaikan)',
        status: IdsmRuleStatus.TRIGGERED,
        reason: `Ditemukan ${majorNonCompliantCount} checkpoint Major terbukti tidak sesuai (Non-Compliant). Major Gate DITAHAN (UNRESOLVED).`,
        recommendations: 'Wajib menerbitkan Rencana Tindakan Perbaikan (CAPA) dengan tenggat tegas dan penanggung jawab.',
        details: { majorNonCompliantCount }
      });
    } else {
      rules.push({
        ruleId: IdsmRuleId.CF_01,
        ruleName: 'Major Terbukti Tidak Sesuai (Wajib Tindakan Perbaikan)',
        status: IdsmRuleStatus.NOT_TRIGGERED,
        reason: 'Tidak ada checkpoint Major yang terbukti tidak sesuai.',
        recommendations: 'Tidak ada pelanggaran Major terbukti.'
      });
    }

    // ------------------------------------------------------------------------
    // RULE CF-02: Major Belum Terbukti Sesuai (Belum Lengkap Bukti)
    // ------------------------------------------------------------------------
    const majorInsufficientCount = ct4ciResult?.majorStats?.insufficientEvidence || 0;
    const majorUndecidedCount = ct4ciResult?.majorStats?.undecidedApplicability || 0;
    if (majorInsufficientCount > 0 || majorUndecidedCount > 0) {
      rules.push({
        ruleId: IdsmRuleId.CF_02,
        ruleName: 'Major Belum Terbukti Sesuai (Bukti / Status Pending)',
        status: IdsmRuleStatus.TRIGGERED,
        reason: `Terdapat ${majorInsufficientCount} Major belum cukup bukti dan ${majorUndecidedCount} Major status applicability belum diputuskan. Major Gate DITAHAN (UNRESOLVED).`,
        recommendations: 'Lakukan inspeksi lapangan lanjutan untuk melengkapi bukti verifikasi kriteria Major.',
        details: { majorInsufficientCount, majorUndecidedCount }
      });
    } else {
      rules.push({
        ruleId: IdsmRuleId.CF_02,
        ruleName: 'Major Belum Terbukti Sesuai (Bukti / Status Pending)',
        status: IdsmRuleStatus.NOT_TRIGGERED,
        reason: 'Seluruh checkpoint Major telah terbukti sesuai dengan bukti memadai.',
        recommendations: 'Syarat Major terpenuhi penuh.'
      });
    }

    // ------------------------------------------------------------------------
    // RULE MB-01: Residual Neraca Bahan Kering (Mass Balance Residual)
    // ------------------------------------------------------------------------
    if (!massBalance) {
      rules.push({
        ruleId: IdsmRuleId.MB_01,
        ruleName: 'Residual Neraca Bahan Kering Kopi',
        status: IdsmRuleStatus.NOT_APPLICABLE,
        reason: 'Modul neraca massa / rendemen dihitung pada stasiun fasilitas pengolah (Processor).',
        recommendations: 'Evaluasi neraca massa berlaku pada unit fasilitas pengolah.'
      });
    } else if (massBalance.isResidualExceeded) {
      rules.push({
        ruleId: IdsmRuleId.MB_01,
        ruleName: 'Residual Neraca Bahan Kering Kopi',
        status: IdsmRuleStatus.TRIGGERED,
        reason: `Residual neraca bahan kering (${massBalance.residualPct}%) melebihi ambang toleransi (${massBalance.tolerancePct}%).`,
        recommendations: 'Lakukan audit rekonsiliasi timbangan ceri, penyusutan kadar air, dan stok cascara.',
        details: massBalance
      });
    } else {
      rules.push({
        ruleId: IdsmRuleId.MB_01,
        ruleName: 'Residual Neraca Bahan Kering Kopi',
        status: IdsmRuleStatus.NOT_TRIGGERED,
        reason: 'Aliran neraca bahan kering dalam batas toleransi wajar.',
        recommendations: 'Aliran massa terverifikasi seimbang.'
      });
    }

    // ------------------------------------------------------------------------
    // RULE OP-01: Biaya Tindakan Wajib Melebihi Anggaran (Funding Gap)
    // ------------------------------------------------------------------------
    const mandatoryCapas = capas.filter(c => c.status !== 'CLOSED' && (c.issueType === 'MAJOR_NON_COMPLIANT' || c.issueType === 'MAJOR_INSUFFICIENT_EVIDENCE'));
    const totalMandatoryCost = mandatoryCapas.reduce((sum, c) => sum + (c.estimatedCostIdr || 0), 0);
    const allocatedBudget = budget?.allocatedIdr || 10000000; // default 10jt alokasi kas perbaikan

    if (totalMandatoryCost > allocatedBudget) {
      const gap = totalMandatoryCost - allocatedBudget;
      rules.push({
        ruleId: IdsmRuleId.OP_01,
        ruleName: 'Analisis Kesenjangan Dana Tindakan Wajib (Funding Gap)',
        status: IdsmRuleStatus.TRIGGERED,
        reason: `Estimasi biaya perbaikan wajib (Rp ${totalMandatoryCost.toLocaleString('id-ID')}) melebihi pagu anggaran tersedia (Rp ${allocatedBudget.toLocaleString('id-ID')}). Terdapat celah pendanaan Rp ${gap.toLocaleString('id-ID')}.`,
        recommendations: 'Ajukan alokasi dana talangan kelompok tani atau susun skala prioritas perbaikan.',
        details: { totalMandatoryCost, allocatedBudget, fundingGap: gap }
      });
    } else {
      rules.push({
        ruleId: IdsmRuleId.OP_01,
        ruleName: 'Analisis Kesenjangan Dana Tindakan Wajib (Funding Gap)',
        status: IdsmRuleStatus.NOT_TRIGGERED,
        reason: `Pagu anggaran kelompok (Rp ${allocatedBudget.toLocaleString('id-ID')}) mencukupi estimasi kebutuhan tindakan perbaikan wajib (Rp ${totalMandatoryCost.toLocaleString('id-ID')}).`,
        recommendations: 'Kelayakan operasional dan pendanaan terjamin.'
      });
    }

    // ------------------------------------------------------------------------
    // RULE OP-02: Validitas Estimasi Biaya dan Kelayakan Anggaran
    // ------------------------------------------------------------------------
    const invalidCostCapas = mandatoryCapas.filter(c => c.estimatedCostIdr === null || c.estimatedCostIdr === undefined || isNaN(c.estimatedCostIdr) || c.estimatedCostIdr <= 0);
    if (mandatoryCapas.length > 0 && invalidCostCapas.length > 0) {
      rules.push({
        ruleId: IdsmRuleId.OP_02,
        ruleName: 'Validitas Estimasi Biaya Rencana Aksi',
        status: IdsmRuleStatus.TRIGGERED,
        reason: `Terdapat ${invalidCostCapas.length} rencana tindakan perbaikan yang belum mencantumkan estimasi biaya yang valid.`,
        recommendations: 'Lengkapi estimasi Rencana Anggaran Biaya (RAB) per tindakan untuk menentukan kelayakan pelaksanaan.',
        details: { invalidCostCapas: invalidCostCapas.map(c => c.capaCode || c.findingTitle) }
      });
    } else {
      rules.push({
        ruleId: IdsmRuleId.OP_02,
        ruleName: 'Validitas Estimasi Biaya Rencana Aksi',
        status: IdsmRuleStatus.NOT_TRIGGERED,
        reason: 'Seluruh tindakan perbaikan wajib telah memiliki rincian estimasi biaya yang valid.',
        recommendations: 'Estimasi biaya lengkap.'
      });
    }

    return rules;
  }
}
