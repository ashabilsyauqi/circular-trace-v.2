import { CoffeeWasteManagement } from './coffee';

export type ProcessingStageId =
  | 'intake_sorting'
  | 'fermentation'
  | 'drying'
  | 'conditioning'
  | 'milling'
  | 'grading_qc'
  | 'packing_closure';

// Raw Material Cherry in Processor's Warehouse/Cold Storage
export interface ProcessorCherryStockItem {
  id: string; // e.g. STK-CHR-001
  processorId: string;
  sourceFarmerLotId: string;
  farmerName: string;
  origin: string;
  variety: string;
  altitude: string;
  harvestDate: string;
  pickingMethod: string;
  brix: number;
  totalWeightKg: number;
  availableWeightKg: number;
  purchasePricePerKg: number;
  purchaseDate: string;
  notes?: string;
  photoUrl?: string;
}

export type ProcessingMethod =
  | 'Full Washed'
  | 'Natural / Dry'
  | 'Honey (Yellow/Red)'
  | 'Honey (Yellow/Red/Black)'
  | 'Anaerobic Natural'
  | 'Anaerobic Washed'
  | 'Wet Hulled (Giling Basah)'
  | 'Wine Process';

export type DryingMethod =
  | 'Solar Dryer Raised Bed'
  | 'Greenhouse Solar Dome'
  | 'Patio Penjemuran'
  | 'Mechanical Controlled Dryer';

// 1. Stage 1: Intake & Sorting Log
export interface IntakeSortingLog {
  cherryWeightKg: number; // Total red cherry received
  floatersWeightKg: number; // Kambang / cacat ringan
  sinkersWeightKg: number; // Tenggelam / dense optimal
  brix: number; // °Bx refractometer reading (e.g. 21.5)
  sortingDate: string;
  destoned: boolean;
  visualQualityGrade: 'A (95%+ Petik Merah)' | 'B (85-94% Merah)' | 'C (Campur)';
  operatorName: string;
  notes: string;
}

// 2. Stage 2: Fermentation Log
export interface FermentationLog {
  tankId: string; // e.g. TANK-ANAEROB-02
  method: ProcessingMethod;
  startTime: string;
  endTime: string;
  durationHours: number;
  startPh: number; // e.g. 5.8
  endPh: number; // e.g. 4.1
  slurryTempCelsius: number; // e.g. 19.5
  ambientTempCelsius: number; // e.g. 22.0
  inoculumYeast: string; // e.g. "Lalcafe Intenso Yeast" or "Native Wild Flora"
  washWaterLiters: number;
  operatorName: string;
  notes: string;
}

// 3. Stage 3: Drying Log (with daily moisture tracking)
export interface DryingDayLog {
  dayNumber: number;
  date: string;
  moisturePercent: number; // tracked down from ~55% to 10.5-12.0%
  ambientTempCelsius: number;
  rhPercent: number; // Relative humidity %
  turningFrequency: string; // e.g. "Tiap 2 Jam"
  notes?: string;
}

export interface DryingLog {
  bedId: string; // e.g. RAISED-BED-A07
  dryingMethod: DryingMethod;
  startDate: string;
  endDate?: string;
  finalMoisturePercent: number; // target <= 12.5%
  dailyLogs: DryingDayLog[];
  targetMoisturePassed: boolean; // Quality Gate: true if finalMoisturePercent <= 12.5%
  operatorName: string;
  notes?: string;
}

// 4. Stage 4: Resting / Conditioning Log (Pemeraman Gabah Kering)
export interface ConditioningLog {
  siloBinId: string; // e.g. GABAH-BIN-04
  packagingType: 'GrainPro Hermetic 50kg' | 'Ecotact 50kg' | 'Wooden Bin (Pine)';
  startDate: string;
  targetRestingDays: number; // Standard 30 to 60 days
  completedDays: number;
  ambientTempCelsius: number; // e.g. 20.0
  ambientRhPercent: number; // e.g. 55%
  moistureStabilizedPercent: number; // e.g. 11.2%
  waterActivityAw: number; // e.g. 0.56
  operatorName: string;
  notes?: string;
}

// 5. Stage 5: Dry Milling / Hulling Log (Pengupasan Kulit Tanduk)
export interface MillingLog {
  millingDate: string;
  machineId: string; // e.g. Pinhalense Dry Huller DH-500
  inputParchmentWeightKg: number; // Gabah kering / dried pods
  outputGreenBeanWeightKg: number; // Green bean recovery
  outputHuskWeightKg: number; // Kulit tanduk / sekam
  outputDustWeightKg: number; // Debu / impuritas
  millingEfficiencyPercent: number; // e.g. 78% of parchment
  operatorName: string;
  notes?: string;
}

// 6. Stage 6: Grading & Quality Control (QC)
export interface ScreenSizeDistribution {
  screen18PlusKg: number; // Screen 18+ (Large)
  screen16_17Kg: number; // Screen 16-17 (Medium)
  screen14_15Kg: number; // Screen 14-15 (Small)
  peaberryKg: number; // Lanang
}

export interface DefectCountDetail {
  primaryDefects: number; // Black, sour, pod, moldy (0 for Specialty)
  secondaryDefects: number; // Broken, immature, insect, husk (<= 5 for Specialty)
  totalScoreValue: number;
}

export interface QCAssessment {
  assessmentDate: string;
  inspectorName: string;
  sampleWeightGrams: number; // Standard 350g
  defects: DefectCountDetail;
  screenDistribution: ScreenSizeDistribution;
  finalMoisturePercent: number; // 10.0 - 12.0%
  waterActivityAw: number; // 0.50 - 0.60
  densityGramsPerLiter: number; // e.g. 720 g/L
  calculatedGrade: 'Specialty Grade 1' | 'Grade 2 (Premium)' | 'Grade 3 (Commercial Fine)' | 'Grade 4 (Asalan)';
  scaCuppingScore: number; // e.g. 87.5
  cuppingNotes: string[];
  notes?: string;
}

// 7. Stage 7: Packing & Lot Closure
export interface PackingClosureLog {
  closureDate: string;
  finalGreenBeanWeightKg: number;
  baggingType: 'GrainPro 60kg + Karung Goni' | 'Ecotact 30kg' | 'Vacuum Bag 20kg' | 'Jute Bag 60kg Standard';
  totalBags: number;
  assignedLotNumber: string; // e.g. GB-LOT-202609-ARB-001
  qrCodeUrl: string;
  eudrComplianceVerified: boolean;
  closedBy: string;
  finalStatus: 'siap_gudang' | 'siap_jual_marketplace' | 'terkirim';
  notes?: string;
}

// Master Processing Batch
export interface ProcessingBatch {
  id: string; // e.g. LOT-202609-ARB-001 or PROC-202609-001
  batchCode: string;
  processorId: string;
  processorName: string;
  sourceFarmerLotId: string;
  sourceFarmerName: string;
  sourceOrigin: string;
  variety: string;
  altitude: string;
  currentStage: ProcessingStageId;
  status: 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  completedDate?: string;
  
  // 7 Stage Sub-Logs
  intakeLog: IntakeSortingLog;
  fermentationLog: FermentationLog;
  dryingLog: DryingLog;
  conditioningLog: ConditioningLog;
  millingLog: MillingLog;
  qcAssessment: QCAssessment;
  packingLog: PackingClosureLog;
  
  // Waste & Circular Economy
  wasteManagement: CoffeeWasteManagement;
  
  targetMarketplacePricePerKg: number;
  photoUrl?: string;
}

// Mass Balance Calculation Result
export interface MassBalanceReport {
  inputCherryKg: number;
  greenBeanOutputKg: number;
  pulpCascaraKg: number;
  huskSekamKg: number;
  waterEvaporationKg: number;
  actualYieldPercent: number; // (greenBean / cherry) * 100
  benchmarkYieldRange: { min: number; max: number }; // Arabica 14-18%, Robusta 20-22%
  yieldStatus: 'optimal' | 'below_benchmark' | 'above_benchmark' | 'anomaly';
  totalBalanceSumKg: number;
  massDiscrepancyKg: number;
  notes: string;
}

// Quality Gate Validation Result
export interface QualityGateValidation {
  stageId: ProcessingStageId;
  canAdvance: boolean;
  blockingErrors: string[];
  warnings: string[];
  passedChecks: string[];
}
