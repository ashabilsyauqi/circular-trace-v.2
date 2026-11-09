export type ComplianceLevel = '1' | '2' | '3+';

export type CheckpointDimension =
  | '1. Economic Dimension'
  | '2. Social Dimension'
  | '3. Environmental Dimension';

export type CheckpointTheme = string;

export type FieldAnswerOption =
  | 'Belum dinilai'
  | 'Sesuai'
  | 'Tidak sesuai'
  | 'Tidak diketahui';

export type ApplicabilityOption =
  | 'Belum ditentukan'
  | 'Berlaku'
  | 'Tidak Berlaku (NA Smallholder)'
  | 'Tidak Berlaku (Lainnya)';

export type ValidationResultOption =
  | 'Belum dinilai'
  | 'Sesuai'
  | 'Tidak sesuai';

export type EvidenceVerificationOption = 'Belum' | 'Sudah';

export interface Ct4ciCheckpoint {
  id: string;
  dimension: string;
  criteria: string;
  officialTextEn: string;
  verificationGuidanceEn: string;
  level1: 'Major' | 'Minor';
  level2: 'Major' | 'Minor';
  level3Plus: 'Major' | 'Minor';
  smallholderNotes: string;
  theme: CheckpointTheme;
  fieldQuestionId: string;
  checkMethod: string;
  defaultInitialAnswer: FieldAnswerOption;
}

export interface Ct4ciEvidenceFile {
  id: string;
  name: string;
  url: string;
  type: string;
  timestamp: string;
  isSensitive?: boolean;
}

export interface Ct4ciAnswerItem {
  checkpointId: string;
  fieldAnswer: FieldAnswerOption;
  observationNotes: string;
  evidenceFiles: Ct4ciEvidenceFile[];
  needFollowUp: boolean;
  applicability: ApplicabilityOption;
  naReason: string;
  officialResult: ValidationResultOption;
  evidenceVerified: EvidenceVerificationOption;
  verifierNotes: string;
  correctiveActionRequired: string;
  deadline: string;
}

export interface Ct4ciProducerProfile {
  id: string;
  unitId4C: string;
  producerId: string;
  farmId: string;
  farmerId: string;
  farmerName: string;
  cooperative: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  farmAreaHa: number;
  coffeeVariety: string;
  plantingYear: number;
  mainGpsCoordinates: string;
  farmPolygonId: string;
  landTenureStatus: string;
  farmerCategory: string;
  workerCount: {
    permanent: number;
    seasonal: number;
  };
  visitDate: string;
  enumeratorName: string;
  icsVerifierName: string;
}

export interface Ct4ciAuditMetrics {
  complianceLevel: ComplianceLevel;
  totalCheckpoints: number;
  applicableCount: number;
  naCount: number;
  undecidedApplicabilityCount: number;
  verifiedEvidenceCount: number;
  compliantWithVerifiedEvidenceCount: number;
  evidenceCoveragePercent: number;
  readinessScorePercent: number;
  unfulfilledMajorCount: number;
  nonConformityCount: number;
  majorGateStatus: 'PASSED' | 'FAILED' | 'PENDING';
  auditReadinessStatus: string;
}

export interface Ct4ciCapItem {
  id: string;
  checkpointId: string;
  producerId: string;
  farmId: string;
  finding: string;
  category: 'Major' | 'Minor';
  correctiveAction: string;
  pic: string;
  deadline: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RE_VERIFIED' | 'CLOSED';
}
