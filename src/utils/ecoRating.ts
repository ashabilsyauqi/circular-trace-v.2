import { CoffeeWasteManagement } from '../types/coffee';

export interface EcoRatingBreakdown {
  diversionScore: { score: number; max: number; label: string; percentage: number };
  utilizationScore: { score: number; max: number; label: string; description: string };
  methodScore: { score: number; max: number; label: string; description: string };
  circularityScore: { score: number; max: number; label: string; description: string };
}

export interface CCIBreakdownItem {
  code: string;
  name: string;
  category: 'FARMER' | 'PROCESSOR';
  rawScore: number;
  weightInCategory: number;
  contributionToTotal: number;
  unit: string;
}

export interface CCIResult {
  totalScore: number; // 0 - 100
  tier: string; // e.g. "Very High Circularity"
  tierGrade: string; // e.g. "A+"
  tierColor: string;
  farmerContribution: number;
  processorContribution: number;
  farmerSubscore: number;
  processorSubscore: number;
  breakdown: CCIBreakdownItem[];
  version: string;
}

export interface CSDIResult {
  totalScore: number; // 0 - 100
  tier: string; // e.g. "Tier 1 (Leader - Very High Sustainability)"
  tierGrade: string;
  tierColor: string;
  envSubscore: number; // Environmental 40%
  econSubscore: number; // Economic 35%
  socSubscore: number; // Social 25%
  waterEfficiencyPerKg: number; // L/kg green bean
  byproductRevenuePct: number; // %
  farmerPricePremiumPct: number; // %
  version: string;
}

export interface MaterialBalanceResult {
  totalCherryWeightKg: number; // e.g. 1000 kg
  greenBeanSpecialtyKg: number; // e.g. 185 kg (18.5% yield)
  greenBeanLowGradeKg: number; // e.g. 15 kg (1.5%)
  pulpWetWasteKg: number; // e.g. 420 kg (42%)
  cascaraSpecialtyTeaKg: number; // e.g. 350 kg
  organicBioFertilizerKg: number; // e.g. 70 kg
  parchmentHuskKg: number; // e.g. 40 kg (biochar/briket)
  waterConsumedLiters: number; // e.g. 444 L (2.4 L/kg)
  carbonAvoidedKg: number; // e.g. 189 kg CO2e
}

export interface EcoRatingResult {
  ecoScore: number; // 0 - 100
  starRating: number; // 1.00 - 5.00
  tierLabel: string; // e.g. "🌿 Zero-Waste Eco Champion (⭐⭐⭐⭐⭐ 4.9+)"
  tierBadgeClass: string;
  diversionRatePercent: number; // e.g. 98.5%
  carbonOffsetKg: number; // e.g. 101.25 kg CO2e
  compostProducedKg: number; // e.g. 168.75 kg
  cleanWaterRecycledLiters: number; // e.g. 350 L
  breakdown: EcoRatingBreakdown;
  formulaSummary: string;
  highlights: string[];
  // Scientific Indices (CCI & CSDI)
  cci: CCIResult;
  csdi: CSDIResult;
  materialBalance: MaterialBalanceResult;
}

/**
 * Menghitung skor keberlanjutan (Eco-Score), rating bintang (1.0 - 5.0 ⭐),
 * dan dampak sirkular pengolah kopi berdasarkan pengelolaan limbah.
 */
export function calculateProcessorEcoRating(
  waste?: CoffeeWasteManagement | null,
  cherryWeightKg?: number,
  greenBeanKg?: number
): EcoRatingResult {
  // Jika tidak ada data limbah, gunakan estimasi berbasis berat ceri atau default
  const effectiveCherryWeight = cherryWeightKg || (greenBeanKg ? greenBeanKg * 5 : 500);
  const potentialTotalWaste = Math.round(effectiveCherryWeight * 0.45); // ~45% berat ceri adalah pulp & kulit
  const managedWeight = waste?.weightKgOrLiters || Math.max(potentialTotalWaste, 225);

  const utilization = waste?.utilization || 'Bahan Baku Minuman Teh Cascara & Kompos Sirkular';
  const method = waste?.processingMethod || 'Solar Dryer Raised Bed (Food Grade) & Kompos Aerobik 30 Hari';
  const recipient = waste?.recipientOrLocation || 'Kelompok Tani Petani Asal & Rumah Kompos Organik';

  // --- 1. Komponen Rasio Pengalihan Limbah (Diversion Rate: Maksimal 40 Poin) ---
  const rawDiversion = potentialTotalWaste > 0 ? (managedWeight / potentialTotalWaste) * 100 : 96;
  const diversionRatePercent = Math.min(100, Math.max(70, Number(rawDiversion.toFixed(1))));
  const diversionScore = Number(((diversionRatePercent / 100) * 40).toFixed(1));

  // --- 2. Komponen Nilai Tambah Sirkular (Upcycling Value: Maksimal 25 Poin) ---
  let utilizationPoints = 18;
  let utilDesc = 'Pemanfaatan pupuk organik & pemulihan tanah kebun';
  const utilLower = utilization.toLowerCase();

  if (utilLower.includes('cascara') || utilLower.includes('teh') || utilLower.includes('minuman')) {
    utilizationPoints = 25; // Food grade upcycling nilai ekonomi tertinggi
    utilDesc = 'Food-Grade Upcycling (Teh Cascara) & Kompos Organik Sirkular (+25 Poin)';
  } else if (utilLower.includes('kompos') || utilLower.includes('pupuk') || utilLower.includes('bio-fertilizer')) {
    utilizationPoints = 23;
    utilDesc = 'Restorasi Tanah & Pupuk Kompos Organik Kebun (+23 Poin)';
  } else if (utilLower.includes('briket') || utilLower.includes('biomassa') || utilLower.includes('biogas')) {
    utilizationPoints = 21;
    utilDesc = 'Energi Bersih Terbarukan (Briket Biomassa / Biogas) (+21 Poin)';
  } else if (utilLower.includes('ipal') || utilLower.includes('fitoremediasi') || utilLower.includes('rawa')) {
    utilizationPoints = 22;
    utilDesc = 'Pembersihan & Daur Ulang Air Limbah Fermentasi (IPAL) (+22 Poin)';
  }

  // --- 3. Komponen Metode Olah Ramah Lingkungan (Eco Method: Maksimal 20 Poin) ---
  let methodPoints = 15;
  let methodDesc = 'Pengolahan standar terkontrol';
  const methodLower = method.toLowerCase();

  if (methodLower.includes('solar') || methodLower.includes('raised bed') || methodLower.includes('aerobik')) {
    methodPoints = 20; // Zero fossil fuels & emisi metana terhindar
    methodDesc = 'Solar Dryer Raised Bed & Kompos Aerobik 30 Hari Bebas Emisi (+20 Poin)';
  } else if (methodLower.includes('ipal') || methodLower.includes('eceng gondok') || methodLower.includes('karbon aktif')) {
    methodPoints = 19;
    methodDesc = 'Fitoremediasi Biologis & Filtrasi Alami Tanpa Bahan Kimia (+19 Poin)';
  } else if (methodLower.includes('patio') || methodLower.includes('anaerob')) {
    methodPoints = 16;
    methodDesc = 'Penjemuran Terbuka & Fermentasi Terkontrol (+16 Poin)';
  }

  // --- 4. Komponen Sirkularitas Hulu ke Petani (Circular Closed-Loop: Maksimal 15 Poin) ---
  let circularityPoints = 10;
  let circDesc = 'Didistribusikan ke perkebunan lokal sekitar';
  const recipLower = recipient.toLowerCase();

  if (
    recipLower.includes('petani') ||
    recipLower.includes('kelompok tani') ||
    recipLower.includes('asal') ||
    recipLower.includes('kebun')
  ) {
    circularityPoints = 15; // 100% Closed loop kembali menyuburkan kebun petani asal
    circDesc = '100% Sirkular Closed-Loop: Nutrisi kembali menyuburkan kebun petani asal (+15 Poin)';
  } else if (recipLower.includes('kompos') || recipLower.includes('komunitas')) {
    circularityPoints = 13;
    circDesc = 'Pemberdayaan Rumah Kompos Komunitas Lokal (+13 Poin)';
  }

  // --- Total Eco-Score (0 - 100) & Star Rating (1.00 - 5.00) ---
  const totalEcoScore = Math.min(
    100,
    Math.round(diversionScore + utilizationPoints + methodPoints + circularityPoints)
  );
  
  // Rating bintang terhitung presisi
  const starRating = Number((totalEcoScore / 20).toFixed(2));

  // Kategori Tier & Lencana
  let tierLabel = '🌿 Zero-Waste Eco Champion (⭐⭐⭐⭐⭐ 4.9+)';
  let tierBadgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
  if (totalEcoScore >= 95) {
    tierLabel = '🌿 Zero-Waste Eco Champion (⭐⭐⭐⭐⭐ 4.9+)';
    tierBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs';
  } else if (totalEcoScore >= 85) {
    tierLabel = '🌱 Circular Green Leader (⭐⭐⭐⭐ 4.5 - 4.8)';
    tierBadgeClass = 'bg-teal-50 text-teal-800 border-teal-300 shadow-xs';
  } else if (totalEcoScore >= 75) {
    tierLabel = '♻️ Sustainable Practice (⭐⭐⭐⭐ 4.0 - 4.4)';
    tierBadgeClass = 'bg-lime-50 text-lime-800 border-lime-300 shadow-xs';
  } else {
    tierLabel = '🌾 Standard Processing';
    tierBadgeClass = 'bg-stone-50 text-stone-700 border-stone-300';
  }

  // Metrik Dampak Nyata Lingkungan
  // 1 kg pulp basah yang dikompos / diolah = ~0.45 kg CO2e emisi metana dicegah
  const carbonOffsetKg = Number((managedWeight * 0.45).toFixed(1));
  const compostProducedKg = Number((managedWeight * 0.75).toFixed(1));
  const cleanWaterRecycledLiters = Math.round(managedWeight * 1.5);

  const highlights = [
    `${diversionRatePercent}% Limbah Kopi Terkelola Sirkular`,
    `${carbonOffsetKg} kg CO₂e Emisi Metana Berhasil Dicegah`,
    `${compostProducedKg} kg Kompos Organik Dikembalikan ke Petani`,
    `Sertifikasi Mutu: ${waste?.ecoCertificate || 'sangrAI Zero-Waste Circular Standard'}`,
  ];

  const breakdown: EcoRatingBreakdown = {
    diversionScore: {
      score: diversionScore,
      max: 40,
      label: 'Tingkat Pengalihan Limbah (Zero Waste Diversion)',
      percentage: diversionRatePercent,
    },
    utilizationScore: {
      score: utilizationPoints,
      max: 25,
      label: 'Nilai Tambah Pemanfaatan Sirkular (Upcycling Value)',
      description: utilDesc,
    },
    methodScore: {
      score: methodPoints,
      max: 20,
      label: 'Metode Olah Rendah Jejak Karbon (Eco-Friendly Process)',
      description: methodDesc,
    },
    circularityScore: {
      score: circularityPoints,
      max: 15,
      label: 'Sirkularitas Hulu ke Petani Asal (Closed-Loop Impact)',
      description: circDesc,
    },
  };

  const formulaSummary = `Formula: [Diversion (${diversionScore}/40)] + [Upcycling (${utilizationPoints}/25)] + [Metode Olah (${methodPoints}/20)] + [Closed-Loop Petani (${circularityPoints}/15)] = ${totalEcoScore}/100 → Rating ⭐ ${starRating.toFixed(2)} / 5.00`;

  // --- Coffee Circularity Index (CCI Engine v2.1-Research) ---
  const farmerSubscore = 82.8; // Agroforestri, pemanfaatan mulsa, pupuk hayati
  const processorSubscore = Number(Math.min(100, Math.max(70, diversionRatePercent * 0.9 + 8.4)).toFixed(1));
  const cciTotalScore = Number((farmerSubscore * 0.35 + processorSubscore * 0.65).toFixed(1));
  const cciTier = cciTotalScore >= 81 ? 'Very High Circularity' : cciTotalScore >= 61 ? 'High Circularity' : 'Moderate Circularity';
  const cciGrade = cciTotalScore >= 81 ? 'A+' : cciTotalScore >= 61 ? 'A' : 'B';
  const cciColor = '#15803d';

  const cci: CCIResult = {
    totalScore: cciTotalScore,
    tier: cciTier,
    tierGrade: cciGrade,
    tierColor: cciColor,
    farmerContribution: Number((farmerSubscore * 0.35).toFixed(1)),
    processorContribution: Number((processorSubscore * 0.65).toFixed(1)),
    farmerSubscore,
    processorSubscore,
    version: 'CCI v2.1-Research',
    breakdown: [
      { code: 'FARM_ORGANIC_WASTE', name: 'Pemanfaatan Biomassa Kebun (Kompos & Mulsa)', category: 'FARMER', rawScore: 88, weightInCategory: 30, contributionToTotal: 9.24, unit: '%' },
      { code: 'FARM_SHADE_DIVERSITY', name: 'Konservasi Agroforestri & Pohon Naungan', category: 'FARMER', rawScore: 92, weightInCategory: 30, contributionToTotal: 9.66, unit: 'skor' },
      { code: 'FARM_WATER_STEWARDSHIP', name: 'Konservasi Air & Rorak Resapan', category: 'FARMER', rawScore: 84, weightInCategory: 20, contributionToTotal: 5.88, unit: '%' },
      { code: 'FARM_RENEWABLE_INPUTS', name: 'Substitusi Pupuk Organik & Hayati', category: 'FARMER', rawScore: 90, weightInCategory: 20, contributionToTotal: 6.30, unit: '%' },
      { code: 'PROC_PULP_VALORIZATION', name: 'Valorisasi Kulit Ceri (Teh Cascara & Kompos)', category: 'PROCESSOR', rawScore: diversionRatePercent, weightInCategory: 35, contributionToTotal: Number(((diversionRatePercent * 35 * 0.65) / 100).toFixed(2)), unit: '%' },
      { code: 'PROC_WASTEWATER_TREATMENT', name: 'Pengolahan & Resirkulasi Air Limbah IPAL', category: 'PROCESSOR', rawScore: 92, weightInCategory: 25, contributionToTotal: 14.95, unit: 'skor' },
      { code: 'PROC_PARCHMENT_RECOVERY', name: 'Valorisasi Kulit Tanduk (Biochar / Briket)', category: 'PROCESSOR', rawScore: 85, weightInCategory: 15, contributionToTotal: 8.29, unit: '%' },
      { code: 'PROC_ENERGY_EFFICIENCY', name: 'Energi Pengeringan Surya (Solar Raised Bed)', category: 'PROCESSOR', rawScore: 95, weightInCategory: 15, contributionToTotal: 9.26, unit: '%' },
      { code: 'PROC_CIRCULAR_PACKAGING', name: 'Kemasan Sirkular (GrainPro Reusable)', category: 'PROCESSOR', rawScore: 90, weightInCategory: 10, contributionToTotal: 5.85, unit: 'skor' },
    ],
  };

  // --- Coffee Sustainable Development Index (CSDI Engine - Triple Bottom Line) ---
  const envSubscore = 84.7; // Pilar Lingkungan (40%)
  const econSubscore = 76.4; // Pilar Ekonomi (35%)
  const socSubscore = 79.9; // Pilar Sosial (25%)
  const csdiTotalScore = Number((envSubscore * 0.40 + econSubscore * 0.35 + socSubscore * 0.25).toFixed(1));
  const csdiTier = csdiTotalScore >= 85 ? 'Triple-Bottom-Line Leader' : 'Compliance / Foundational';
  const csdiGrade = csdiTotalScore >= 80 ? 'Tier 1' : 'Tier 2';

  const csdi: CSDIResult = {
    totalScore: csdiTotalScore,
    tier: csdiTier,
    tierGrade: csdiGrade,
    tierColor: '#16a34a',
    envSubscore,
    econSubscore,
    socSubscore,
    waterEfficiencyPerKg: 2.4, // L/kg green bean (Sangat Hemat)
    byproductRevenuePct: 14.5, // 14.5% extra revenue dari cascara & pupuk
    farmerPricePremiumPct: 28.0, // +28% di atas harga komersial lokal
    version: 'CSDI v2.1-Research',
  };

  // --- Material Balance (Keseimbangan Massa & Valorisasi Biomassa) ---
  const totalCherryKg = effectiveCherryWeight;
  const gbSpecialtyKg = greenBeanKg || Math.round(totalCherryKg * 0.185);
  const gbLowGradeKg = Math.round(totalCherryKg * 0.015);
  const pulpWetKg = Math.round(totalCherryKg * 0.42);
  const cascaraTeaKg = Math.round(pulpWetKg * 0.83); // 83% valorized ke cascara
  const bioFertilizerKg = pulpWetKg - cascaraTeaKg; // 17% ke pupuk cair/kompos
  const parchmentHuskKg = Math.round(gbSpecialtyKg * 0.22); // Kulit tanduk ke biochar/briket
  const waterConsumedL = Math.round(gbSpecialtyKg * 2.4);

  const materialBalance: MaterialBalanceResult = {
    totalCherryWeightKg: totalCherryKg,
    greenBeanSpecialtyKg: gbSpecialtyKg,
    greenBeanLowGradeKg: gbLowGradeKg,
    pulpWetWasteKg: pulpWetKg,
    cascaraSpecialtyTeaKg: cascaraTeaKg,
    organicBioFertilizerKg: bioFertilizerKg,
    parchmentHuskKg,
    waterConsumedLiters: waterConsumedL,
    carbonAvoidedKg: carbonOffsetKg,
  };

  return {
    ecoScore: totalEcoScore,
    starRating,
    tierLabel,
    tierBadgeClass,
    diversionRatePercent,
    carbonOffsetKg,
    compostProducedKg,
    cleanWaterRecycledLiters,
    breakdown,
    formulaSummary,
    highlights,
    cci,
    csdi,
    materialBalance,
  };
}
