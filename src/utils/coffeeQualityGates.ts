import { ProcessingBatch, ProcessingStageId, QualityGateValidation, QCAssessment } from '../types/processorErp';

export const PROCESSOR_7_STAGES: { id: ProcessingStageId; label: string; shortLabel: string; description: string; stepNumber: number }[] = [
  {
    id: 'intake_sorting',
    label: '1. Penerimaan & Sortasi Ceri',
    shortLabel: 'Intake & Sortasi',
    description: 'Penerimaan ceri segar, uji apung (floaters vs sinkers), dan pengukuran refraktometer Brix.',
    stepNumber: 1,
  },
  {
    id: 'fermentation',
    label: '2. Pengolahan & Fermentasi',
    shortLabel: 'Fermentasi',
    description: 'Proses pengolahan basah/kering, pemantauan kurva pH, suhu adukan, dan inokulasi ragi.',
    stepNumber: 2,
  },
  {
    id: 'drying',
    label: '3. Penjemuran & Pengeringan',
    shortLabel: 'Penjemuran',
    description: 'Pengeringan di solar dome/raised bed, pembalikan berkala, dan log kadar air harian (Gate <= 12.5%).',
    stepNumber: 3,
  },
  {
    id: 'conditioning',
    label: '4. Pemeraman (Resting Gabah)',
    shortLabel: 'Resting Gabah',
    description: 'Stabilisasi kadar air dan aktivitas air (aw) di gudang/kemasan hermetik selama 30-60 hari.',
    stepNumber: 4,
  },
  {
    id: 'milling',
    label: '5. Dry Milling & Hulling',
    shortLabel: 'Hulling Mill',
    description: 'Pengupasan kulit tanduk gabah kering menjadi green bean dan pemisahan limbah sekam.',
    stepNumber: 5,
  },
  {
    id: 'grading_qc',
    label: '6. Grading & Quality Control',
    shortLabel: 'Grading & QC',
    description: 'Sortasi ukuran ayakan (Screen 14-18+), hitung nilai cacat SCA 350g, dan auto-penentuan Grade.',
    stepNumber: 6,
  },
  {
    id: 'packing_closure',
    label: '7. Pengemasan & Penutupan Lot',
    shortLabel: 'Packing & Rilis',
    description: 'Pengemasan GrainPro + karung goni 60kg, stiker QR traceability digital, dan rilis ke marketplace.',
    stepNumber: 7,
  },
];

/**
 * Validates whether a batch satisfies all quality gates to advance to the target stage.
 */
export function validateStageQualityGate(
  batch: ProcessingBatch,
  targetStage: ProcessingStageId
): QualityGateValidation {
  const blockingErrors: string[] = [];
  const warnings: string[] = [];
  const passedChecks: string[] = [];

  const currentStageIndex = PROCESSOR_7_STAGES.findIndex((s) => s.id === batch.currentStage);
  const targetStageIndex = PROCESSOR_7_STAGES.findIndex((s) => s.id === targetStage);

  // Validate Stage 1: Intake & Sorting
  if (targetStageIndex > 0) {
    if (!batch.intakeLog || batch.intakeLog.cherryWeightKg <= 0) {
      blockingErrors.push('Berat ceri segar masuk harus lebih dari 0 kg.');
    } else {
      passedChecks.push(`Bobot ceri terdaftar: ${batch.intakeLog.cherryWeightKg} kg.`);
    }

    if (batch.intakeLog.brix < 18.0) {
      warnings.push(`Kadar gula buah ceri (${batch.intakeLog.brix}° Brix) di bawah standar optimal 18-24° Brix.`);
    } else {
      passedChecks.push(`Kadar kemanisan ceri optimal: ${batch.intakeLog.brix}° Brix.`);
    }

    if (batch.intakeLog.sinkersWeightKg <= 0) {
      warnings.push('Data pemisahan ceri tenggelam (sinkers) belum tercatat.');
    } else {
      passedChecks.push(`Uji apung sinkers terverifikasi (${batch.intakeLog.sinkersWeightKg} kg dense ripe).`);
    }
  }

  // Validate Stage 2: Fermentation
  if (targetStageIndex > 1) {
    if (batch.fermentationLog.durationHours <= 0) {
      blockingErrors.push('Durasi fermentasi harus tercatat lebih dari 0 jam.');
    } else {
      passedChecks.push(`Durasi fermentasi terdata: ${batch.fermentationLog.durationHours} jam.`);
    }

    if (batch.fermentationLog.startPh && batch.fermentationLog.endPh) {
      if (batch.fermentationLog.endPh >= batch.fermentationLog.startPh) {
        warnings.push('pH akhir fermentasi tidak menunjukkan penurunan keasaman alami (asidifikasi).');
      } else {
        passedChecks.push(`Kurva pH fermentasi valid: pH ${batch.fermentationLog.startPh} -> ${batch.fermentationLog.endPh}.`);
      }
    }
  }

  // Validate Stage 3: Drying (STRICT QUALITY GATE)
  if (targetStageIndex > 2) {
    const finalMoisture = batch.dryingLog.finalMoisturePercent;
    if (finalMoisture > 12.5) {
      blockingErrors.push(
        `Kadar air (${finalMoisture}%) melebihi batas aman maksimal 12.5%. Lanjutkan pengeringan agar kopi tidak berjamur saat disimpan.`
      );
    } else if (finalMoisture < 9.5) {
      warnings.push(`Kadar air (${finalMoisture}%) terlalu rendah (over-dried < 9.5%), berpotensi menurunkan mutu sensori.`);
    } else {
      passedChecks.push(`Quality Gate Kadar Air LULUS: ${finalMoisture}% (Target Standar 10.0% - 12.0%).`);
    }
  }

  // Validate Stage 4: Conditioning / Resting
  if (targetStageIndex > 3) {
    if (batch.conditioningLog.completedDays < 14) {
      warnings.push(`Masa resting (${batch.conditioningLog.completedDays} hari) kurang dari standar optimal (30-60 hari). Mutu rasa mungkin belum stabil.`);
    } else {
      passedChecks.push(`Pemeraman gabah terdata: ${batch.conditioningLog.completedDays} hari di ${batch.conditioningLog.siloBinId}.`);
    }
  }

  // Validate Stage 5: Milling
  if (targetStageIndex > 4) {
    if (batch.millingLog.outputGreenBeanWeightKg <= 0) {
      blockingErrors.push('Berat output Green Bean hasil hulling belum diinput.');
    } else {
      passedChecks.push(`Hasil hulling terverifikasi: ${batch.millingLog.outputGreenBeanWeightKg} kg Green Bean.`);
    }
  }

  // Validate Stage 6: Grading & QC
  if (targetStageIndex > 5) {
    if (batch.qcAssessment.sampleWeightGrams <= 0) {
      blockingErrors.push('Uji mutu sampel fisik 350g belum dilakukan.');
    } else {
      passedChecks.push(`Hasil QC SCA terdaftar: ${batch.qcAssessment.calculatedGrade} (${batch.qcAssessment.defects.totalScoreValue} defect).`);
    }
  }

  const canAdvance = blockingErrors.length === 0;

  return {
    stageId: targetStage,
    canAdvance,
    blockingErrors,
    warnings,
    passedChecks,
  };
}

/**
 * Evaluates SCA & SNI Green Coffee Grade based on Defect Count, Moisture, and Water Activity.
 */
export function autoCalculateCoffeeGrade(
  primaryDefects: number,
  secondaryDefects: number,
  moisturePercent: number,
  waterActivityAw: number
): {
  grade: 'Specialty Grade 1' | 'Grade 2 (Premium)' | 'Grade 3 (Commercial Fine)' | 'Grade 4 (Asalan)';
  totalDefectScore: number;
  gradeDescription: string;
  isSpecialtyCompliant: boolean;
} {
  const totalDefectScore = primaryDefects * 1.0 + secondaryDefects * 0.2;

  let grade: 'Specialty Grade 1' | 'Grade 2 (Premium)' | 'Grade 3 (Commercial Fine)' | 'Grade 4 (Asalan)' = 'Specialty Grade 1';
  let gradeDescription = 'Mutu tertinggi SCA (Zero Primary Defect, Maks 5 Full Defect Sekunder, Kadar Air 10-12%).';
  let isSpecialtyCompliant = true;

  if (moisturePercent > 12.5 || primaryDefects > 5 || totalDefectScore > 20) {
    grade = 'Grade 4 (Asalan)';
    gradeDescription = 'Kadar cacat tinggi atau kadar air di luar ambang aman.';
    isSpecialtyCompliant = false;
  } else if (primaryDefects > 2 || totalDefectScore > 8) {
    grade = 'Grade 3 (Commercial Fine)';
    gradeDescription = 'Kategori komersial fine untuk konsumsi massal atau cold brew RTD.';
    isSpecialtyCompliant = false;
  } else if (primaryDefects > 0 || totalDefectScore > 5) {
    grade = 'Grade 2 (Premium)';
    gradeDescription = 'Grade Premium dengan toleransi cacat sekunder minimal.';
    isSpecialtyCompliant = false;
  } else {
    grade = 'Specialty Grade 1';
    gradeDescription = 'Memenuhi standar Specialty Grade 1 internasional SCA.';
    isSpecialtyCompliant = true;
  }

  return {
    grade,
    totalDefectScore: Number(totalDefectScore.toFixed(1)),
    gradeDescription,
    isSpecialtyCompliant,
  };
}
