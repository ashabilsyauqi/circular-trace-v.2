import { FairtradeCoopData, FairtradeReadinessResult, FairtradeStatusBadge } from './types';

/**
 * CIRCULARTRACE - Fairtrade Readiness Index (FRI) Engine
 *
 * Menghitung Fairtrade Readiness Index (FRI) untuk entitas rantai pasok kopi di CircularTrace.
 *
 * 4 Pilar Asesmen (Bobot masing-masing 25%):
 * 1. Pilar Ekonomi (Economic Criteria): Distribusi premi demokratis (0.5), Transparansi harga (0.5)
 * 2. Pilar Sosial & Ketenagakerjaan: Bebas pekerja anak/paksa (0.4), K3 & APD (0.3), Upah layak & kontrak (0.3)
 * 3. Pilar Lingkungan & Sirkularitas: Valorisasi limbah terhubung CCI (0.5), Bebas konversi hutan (0.3), Pengurangan bahan kimia (0.2)
 * 4. Pilar Tata Kelola & Keterlacakan: Pemetaan plot koordinat lengkap (0.5), Segregasi fisik stok (0.5)
 */

export function calculateFairtradeReadiness(coopData: FairtradeCoopData = {}): FairtradeReadinessResult {
  // 1. Pilar Ekonomi (Economic Criteria)
  // Parameter: Distribusi premi demokratis (0/1), pencatatan harga minimum (0/1)
  const eScore =
    ((coopData.democratic_premium_mgmt ? 1.0 : 0.0) * 0.5 +
      (coopData.transparent_pricing ? 1.0 : 0.0) * 0.5) *
    100;

  // 2. Pilar Sosial & Ketenagakerjaan (Social & Labor Criteria)
  // Parameter: Kepatuhan anti-child/forced labor (0.4), kepemilikan K3/APD (0.3), kontrak & upah layak (0.3)
  const sScore =
    ((coopData.no_child_forced_labor ? 1.0 : 0.0) * 0.4 +
      (coopData.ohs_ppe_compliance ? 1.0 : 0.0) * 0.3 +
      (coopData.fair_wages_contracts ? 1.0 : 0.0) * 0.3) *
    100;

  // 3. Pilar Lingkungan & Sirkularitas (Environmental & CCI Integration)
  // Parameter: Pengelolaan limbah pulping/kulit kopi (terhubung CCI) (0.5), perlindungan ekosistem (0.3), pengurangan kimia (0.2)
  const envScore =
    ((coopData.waste_valorization_cci ? 1.0 : 0.0) * 0.5 +
      (coopData.no_forest_conversion ? 1.0 : 0.0) * 0.3 +
      (coopData.reduced_chemical_use ? 1.0 : 0.0) * 0.2) *
    100;

  // 4. Pilar Tata Kelola & Keterlacakan (Governance & Traceability)
  // Parameter: Keterlacakan plot berbasis koordinat (0.5), pemisahan fisik (segregasi stok) (0.5)
  const gScore =
    ((coopData.plot_mapping_complete ? 1.0 : 0.0) * 0.5 +
      (coopData.physical_segregation ? 1.0 : 0.0) * 0.5) *
    100;

  // Total Fairtrade Readiness Index (FRI) dengan bobot masing-masing 25%
  const friTotal = eScore * 0.25 + sScore * 0.25 + envScore * 0.25 + gScore * 0.25;

  // Penentuan Status Kesiapan
  let status = '';
  let statusBadge: FairtradeStatusBadge = 'PROGRESSING';
  if (friTotal >= 85) {
    status = 'Ready for Certification (Sangat Siap)';
    statusBadge = 'READY';
  } else if (friTotal >= 60) {
    status = 'Progressing (Dalam Proses / Perlu Perbaikan Minor)';
    statusBadge = 'PROGRESSING';
  } else {
    status = 'Needs Major Improvement (Belum Siap / Butuh Pendampingan)';
    statusBadge = 'NEEDS_IMPROVEMENT';
  }

  // Identifikasi Kesenjangan (Gaps) untuk Rekomendasi Otomatis
  const gaps: string[] = [];
  if (!coopData.democratic_premium_mgmt) {
    gaps.push('Sistem manajemen premi koperasi belum sepenuhnya demokratis.');
  }
  if (!coopData.transparent_pricing) {
    gaps.push('Pencatatan harga minimum dan transparansi potongan harga belum terdokumentasi.');
  }
  if (!coopData.no_child_forced_labor) {
    gaps.push('Terdapat risiko atau belum ada bukti tertulis perlindungan dari pekerja anak dan kerja paksa.');
  }
  if (!coopData.ohs_ppe_compliance) {
    gaps.push('Penerapan K3 dan penyediaan APD bagi petani/pekerja masih kurang.');
  }
  if (!coopData.fair_wages_contracts) {
    gaps.push('Sistem upah layak dan kesepakatan kerja tertulis belum terpenuhi secara menyeluruh.');
  }
  if (!coopData.waste_valorization_cci) {
    gaps.push('Pengelolaan limbah pascapanen belum terintegrasi secara optimal dengan indikator sirkularitas (CCI).');
  }
  if (!coopData.no_forest_conversion) {
    gaps.push('Belum ada bukti legalitas nol konversi hutan (EUDR/cut-off 2020).');
  }
  if (!coopData.reduced_chemical_use) {
    gaps.push('Penggunaan pestisida sintetik belum ditekan atau masih menggunakan bahan berisiko tinggi.');
  }
  if (!coopData.plot_mapping_complete) {
    gaps.push('Pemetaan koordinat lahan petani belum lengkap dalam sistem CircularTrace.');
  }
  if (!coopData.physical_segregation) {
    gaps.push('Sistem pemisahan fisik (segregasi karung & lot) kopi bersertifikasi belum terpasang.');
  }

  return {
    fairtrade_readiness_index: Math.round(friTotal * 100) / 100,
    status,
    statusBadge,
    pillar_scores: {
      economic: Math.round(eScore * 100) / 100,
      social: Math.round(sScore * 100) / 100,
      environmental: Math.round(envScore * 100) / 100,
      governance: Math.round(gScore * 100) / 100,
    },
    raw_inputs: { ...coopData },
    identified_gaps: gaps,
  };
}

/**
 * Otomatis mengekstrak input kriteria Fairtrade dari jawaban kuesioner praktik lapangan (Topik A-E),
 * data poligon kebun, dan status checkpoint 4C.
 */
export function deriveCoopDataFromPractices(
  practicesAnswers: Record<string, unknown> = {},
  farmData?: { hasCoordinates?: boolean; eudrCompliant?: boolean }
): FairtradeCoopData {
  const democraticPremiumMgmt = practicesAnswers['Q_E03_SUSTAINABILITY_PREMIUM'] === true;
  const transparentPricing = practicesAnswers['Q_E02_PRICE_TRANSPARENCY'] === true;

  const noChildForcedLabor =
    practicesAnswers['Q_D02_NO_FORCED_LABOR'] === true &&
    practicesAnswers['Q_D03_NO_CHILD_LABOR'] === true;

  const ppeArray = practicesAnswers['Q_B06_PPE_EQUIPMENT'];
  const ohsPpeCompliance = Array.isArray(ppeArray) && ppeArray.length >= 3;

  const fairWagesContracts =
    practicesAnswers['Q_D05_FAIR_WAGE'] === true ||
    practicesAnswers['Q_D01_LABOR_STRUCTURE'] === 'Hanya tenaga kerja keluarga (tanpa pekerja upahan)';

  const cascaraArray = practicesAnswers['Q_C07_CASCARA_UTILIZATION'];
  const wasteValorizationCci =
    (Array.isArray(cascaraArray) && cascaraArray.length > 0) ||
    practicesAnswers['Q_A09_ORGANIC_FERTILIZER'] === true;

  const noForestConversion =
    practicesAnswers['Q_C01_NO_DEFORESTATION'] === true || farmData?.eudrCompliant === true;

  const bannedChem = String(practicesAnswers['Q_B04_BANNED_CHEMICAL_CHECK'] || '').toLowerCase();
  const reducedChemicalUse =
    practicesAnswers['Q_B03_CHEMICAL_USAGE'] === false ||
    (!bannedChem.includes('paraquat') && !bannedChem.includes('endosulfan'));

  const plotMappingComplete = farmData?.hasCoordinates ?? true;
  const physicalSegregation = practicesAnswers['Q_A04_LOT_SEPARATION'] === true;

  return {
    democratic_premium_mgmt: Boolean(democraticPremiumMgmt),
    transparent_pricing: Boolean(transparentPricing),
    no_child_forced_labor: Boolean(noChildForcedLabor),
    ohs_ppe_compliance: Boolean(ohsPpeCompliance),
    fair_wages_contracts: Boolean(fairWagesContracts),
    waste_valorization_cci: Boolean(wasteValorizationCci),
    no_forest_conversion: Boolean(noForestConversion),
    reduced_chemical_use: Boolean(reducedChemicalUse),
    plot_mapping_complete: Boolean(plotMappingComplete),
    physical_segregation: Boolean(physicalSegregation),
  };
}
