import { ProcessingBatch, MassBalanceReport } from '../types/processorErp';

export interface DetailedMassBalance {
  inputCherryKg: number;
  greenBeanOutputKg: number;
  pulpCascaraKg: number;
  huskSekamKg: number;
  waterEvaporationKg: number;
  actualYieldPercent: number;
  benchmarkYieldRange: { min: number; max: number };
  yieldStatus: 'optimal' | 'below_benchmark' | 'above_benchmark' | 'anomaly';
  totalBalanceSumKg: number;
  massDiscrepancyKg: number;
  notes: string;
  breakdownShares: {
    greenBeanPercent: number;
    pulpPercent: number;
    huskPercent: number;
    evaporationPercent: number;
  };
  circularityMetrics: {
    wasteDivertedKg: number;
    organicCompostPotentialKg: number;
    cascaraSpecialtyTeaKg: number;
    carbonOffsetCo2eKg: number;
  };
}

/**
 * Calculates comprehensive Mass Balance & Yield (Rendemen) Integrity
 * for Coffee Post-Harvest Processing.
 */
export function calculateBatchMassBalance(
  batch: Partial<ProcessingBatch> | {
    cherryWeightKg: number;
    greenBeanWeightKg?: number;
    pulpWeightKg?: number;
    huskWeightKg?: number;
    variety?: string;
  }
): DetailedMassBalance {
  let cherryKg = 0;
  let greenKg = 0;
  let pulpKg = 0;
  let huskKg = 0;
  let variety = 'Arabica Typica';

  if ('intakeLog' in batch && batch.intakeLog) {
    cherryKg = Number(batch.intakeLog.cherryWeightKg) || 0;
    variety = batch.variety || 'Arabica';
    
    // Check if stage reached milling or packing
    if (batch.packingLog?.finalGreenBeanWeightKg) {
      greenKg = Number(batch.packingLog.finalGreenBeanWeightKg);
    } else if (batch.millingLog?.outputGreenBeanWeightKg) {
      greenKg = Number(batch.millingLog.outputGreenBeanWeightKg);
    } else {
      // Estimated yield based on standard Arabica 16%
      greenKg = Math.round(cherryKg * 0.16);
    }

    if (batch.millingLog?.outputHuskWeightKg) {
      huskKg = Number(batch.millingLog.outputHuskWeightKg);
    } else {
      huskKg = Math.round(cherryKg * 0.05); // ~5% of original cherry weight is dry parchment husk
    }

    if (batch.wasteManagement?.weightKgOrLiters) {
      pulpKg = Number(batch.wasteManagement.weightKgOrLiters);
    } else {
      pulpKg = Math.round(cherryKg * 0.42); // ~42% is wet pulp / cascara
    }
  } else if ('cherryWeightKg' in batch) {
    cherryKg = Number(batch.cherryWeightKg) || 500;
    greenKg = Number(batch.greenBeanWeightKg) || Math.round(cherryKg * 0.16);
    pulpKg = Number(batch.pulpWeightKg) || Math.round(cherryKg * 0.42);
    huskKg = Number(batch.huskWeightKg) || Math.round(cherryKg * 0.05);
    variety = batch.variety || 'Arabica';
  }

  // Determine benchmark range based on coffee species
  const isRobusta = variety.toLowerCase().includes('robusta');
  const benchmarkYieldRange = isRobusta
    ? { min: 20.0, max: 22.5 }
    : { min: 14.0, max: 18.5 };

  // Calculate actual yield
  const actualYieldPercent = cherryKg > 0 ? Number(((greenKg / cherryKg) * 100).toFixed(2)) : 0;

  // Water evaporation accounts for remainder
  const otherSolidMass = greenKg + pulpKg + huskKg;
  let waterEvaporationKg = cherryKg > otherSolidMass ? cherryKg - otherSolidMass : Math.round(cherryKg * 0.37);
  waterEvaporationKg = Math.max(0, waterEvaporationKg);

  const totalBalanceSumKg = greenKg + pulpKg + huskKg + waterEvaporationKg;
  const massDiscrepancyKg = Math.abs(cherryKg - totalBalanceSumKg);

  // Determine Yield Status
  let yieldStatus: 'optimal' | 'below_benchmark' | 'above_benchmark' | 'anomaly' = 'optimal';
  let notes = 'Rendemen olah berada dalam rentang optimal specialty.';

  if (actualYieldPercent < 10.0 || actualYieldPercent > 26.0) {
    yieldStatus = 'anomaly';
    notes = `Peringatan: Rendemen ${actualYieldPercent}% menunjukkan anomali signifikan dari norma konversi ceri. Cek kadar air atau susut timbangan.`;
  } else if (actualYieldPercent < benchmarkYieldRange.min) {
    yieldStatus = 'below_benchmark';
    notes = `Rendemen ${actualYieldPercent}% sedikit di bawah benchmark (${benchmarkYieldRange.min}% - ${benchmarkYieldRange.max}%). Kemungkinan fraksi floater atau susut kulit tinggi.`;
  } else if (actualYieldPercent > benchmarkYieldRange.max) {
    yieldStatus = 'above_benchmark';
    notes = `Rendemen ${actualYieldPercent}% sangat tinggi. Pastikan kadar air biji telah benar-benar mencapai ambang aman <= 12.5%.`;
  }

  const greenBeanPercent = cherryKg > 0 ? Number(((greenKg / cherryKg) * 100).toFixed(1)) : 0;
  const pulpPercent = cherryKg > 0 ? Number(((pulpKg / cherryKg) * 100).toFixed(1)) : 0;
  const huskPercent = cherryKg > 0 ? Number(((huskKg / cherryKg) * 100).toFixed(1)) : 0;
  const evaporationPercent = cherryKg > 0 ? Number(((waterEvaporationKg / cherryKg) * 100).toFixed(1)) : 0;

  // Circular metrics
  const wasteDivertedKg = pulpKg + huskKg;
  const organicCompostPotentialKg = Math.round(pulpKg * 0.45);
  const cascaraSpecialtyTeaKg = Math.round(pulpKg * 0.55);
  const carbonOffsetCo2eKg = Number((wasteDivertedKg * 0.45).toFixed(2));

  return {
    inputCherryKg: cherryKg,
    greenBeanOutputKg: greenKg,
    pulpCascaraKg: pulpKg,
    huskSekamKg: huskKg,
    waterEvaporationKg,
    actualYieldPercent,
    benchmarkYieldRange,
    yieldStatus,
    totalBalanceSumKg,
    massDiscrepancyKg,
    notes,
    breakdownShares: {
      greenBeanPercent,
      pulpPercent,
      huskPercent,
      evaporationPercent,
    },
    circularityMetrics: {
      wasteDivertedKg,
      organicCompostPotentialKg,
      cascaraSpecialtyTeaKg,
      carbonOffsetCo2eKg,
    },
  };
}
