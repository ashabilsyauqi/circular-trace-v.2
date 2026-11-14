/**
 * CIRCULARTRACE - CT-4CI & ICS Types & Constants (TypeScript)
 * Based on 4C Code of Conduct v4.1, Prof. Dr. Novizar Nazir's Methodology, and CT-IDSM
 */

export const DimensionType = {
  ECONOMIC: 'ECONOMIC',
  SOCIAL: 'SOCIAL',
  ENVIRONMENTAL: 'ENVIRONMENTAL',
  GOVERNANCE: 'GOVERNANCE',
} as const;
export type DimensionType = (typeof DimensionType)[keyof typeof DimensionType];

export const ApplicabilityDecision = {
  APPLICABLE: 'APPLICABLE',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  UNDECIDED: 'UNDECIDED',
} as const;
export type ApplicabilityDecision = (typeof ApplicabilityDecision)[keyof typeof ApplicabilityDecision];

export const EvidenceSufficiency = {
  NOT_AVAILABLE: 'NOT_AVAILABLE',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  INSUFFICIENT: 'INSUFFICIENT',
  SUFFICIENT: 'SUFFICIENT',
  NEEDS_REVIEW: 'NEEDS_REVIEW',
} as const;
export type EvidenceSufficiency = (typeof EvidenceSufficiency)[keyof typeof EvidenceSufficiency];

export const ComplianceResult = {
  COMPLIANT: 'COMPLIANT',
  NON_COMPLIANT: 'NON_COMPLIANT',
  UNDETERMINED: 'UNDETERMINED',
} as const;
export type ComplianceResult = (typeof ComplianceResult)[keyof typeof ComplianceResult];

export const MajorGateStatus = {
  PASSED: 'PASSED',
  UNRESOLVED: 'UNRESOLVED',
} as const;
export type MajorGateStatus = (typeof MajorGateStatus)[keyof typeof MajorGateStatus];

export const CalculationResultStatus = {
  CALCULATED: 'CALCULATED',
  PROVISIONAL: 'PROVISIONAL',
  CANNOT_CALCULATE: 'CANNOT_CALCULATE',
} as const;
export type CalculationResultStatus = (typeof CalculationResultStatus)[keyof typeof CalculationResultStatus];

export const PracticeCategory = {
  SOIL_CROP: 'SOIL_CROP',
  PEST_CHEMICAL: 'PEST_CHEMICAL',
  WATER_WASTE_ENV: 'WATER_WASTE_ENV',
  LABOR_SAFETY: 'LABOR_SAFETY',
  ECON_INST: 'ECON_INST',
} as const;
export type PracticeCategory = (typeof PracticeCategory)[keyof typeof PracticeCategory];

export const CapaStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  CLOSED: 'CLOSED',
  REJECTED: 'REJECTED',
} as const;
export type CapaStatus = (typeof CapaStatus)[keyof typeof CapaStatus];

export const CapaIssueType = {
  MAJOR_NON_COMPLIANT: 'MAJOR_NON_COMPLIANT',
  MAJOR_INSUFFICIENT_EVIDENCE: 'MAJOR_INSUFFICIENT_EVIDENCE',
  MINOR_GAP: 'MINOR_GAP',
  DATA_QUALITY: 'DATA_QUALITY',
} as const;
export type CapaIssueType = (typeof CapaIssueType)[keyof typeof CapaIssueType];

export const IdsmRuleId = {
  DQ_01: 'DQ-01',
  DQ_02: 'DQ-02',
  EV_01: 'EV-01',
  CF_01: 'CF-01',
  CF_02: 'CF-02',
  MB_01: 'MB-01',
  OP_01: 'OP-01',
  OP_02: 'OP-02',
} as const;
export type IdsmRuleId = (typeof IdsmRuleId)[keyof typeof IdsmRuleId];

export const IdsmRuleStatus = {
  TRIGGERED: 'TRIGGERED',
  NOT_TRIGGERED: 'NOT_TRIGGERED',
  NOT_EVALUABLE: 'NOT_EVALUABLE',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
} as const;
export type IdsmRuleStatus = (typeof IdsmRuleStatus)[keyof typeof IdsmRuleStatus];

export interface BannedChemical {
  name: string;
  activeIngredient: string;
  class: string;
  effectiveDate: string;
  commonProducts: string[];
}

export const BANNED_CHEMICALS_LIST: BannedChemical[] = [
  { name: 'Paraquat', activeIngredient: 'Paraquat dichloride', class: 'WHO Class II / GCP Banned', effectiveDate: '2020-01-01', commonProducts: ['Gramoxone', 'Noxone'] },
  { name: 'Endosulfan', activeIngredient: 'Endosulfan', class: 'Stockholm POPs / 4C Banned', effectiveDate: '2015-01-01', commonProducts: ['Thiodan', 'Decis Mix'] },
  { name: 'Methyl Parathion', activeIngredient: 'Methyl parathion', class: 'WHO Class Ia / Rotterdam PIC', effectiveDate: '2010-01-01', commonProducts: ['Folidol', 'Metacide'] },
  { name: 'Monocrotophos', activeIngredient: 'Monocrotophos', class: 'WHO Class Ib', effectiveDate: '2012-01-01', commonProducts: ['Azodrin', 'Nuvacron'] },
  { name: 'Carbofuran', activeIngredient: 'Carbofuran', class: 'WHO Class Ib', effectiveDate: '2018-01-01', commonProducts: ['Furadan cair', 'Curaterr'] },
  { name: 'Glyphosate near riparian', activeIngredient: 'Glyphosate in buffer zone', class: 'Riparian buffer restriction', effectiveDate: '2022-01-01', commonProducts: ['Roundup di sempadan'] }
];

export interface Checkpoint {
  id?: string;
  checkpointCode: string;
  module: 'PRODUCER' | 'MANAGING_ENTITY' | 'SERVICE_PROVIDER';
  dimension: DimensionType;
  title: string;
  description?: string;
  isMajor: boolean;
  officialRef?: string;
  notes?: string;
  defaultApplicability?: ApplicabilityDecision;
}

export interface CheckpointAssessment {
  id?: string;
  scopeType: 'PRODUCER' | 'FARM' | 'PLOT';
  scopeId: string;
  checkpointId?: string;
  checkpointCode: string;
  period: string;
  applicability: ApplicabilityDecision;
  nonApplicabilityReason?: string | null;
  applicabilityApprovedBy?: string | null;
  evidenceSufficiency: EvidenceSufficiency;
  complianceResult: ComplianceResult;
  evaluationNotes?: string | null;
  verifierUserId?: string | null;
  verifiedAt?: string | null;
  evidenceRefs?: string[];
}

export interface DimensionStats {
  totalCheckpoints: number;
  applicableCount: number;
  sufficientEvidenceCount: number;
  compliantCount: number;
  nonCompliantCount: number;
  majorNonCompliantCount: number;
  readinessScore: number | null;
  evidenceCoveragePct: number | null;
}

export interface Ct4ciCalculationResult {
  module: string;
  totalInventory: number;
  applicableCount: number;
  approvedNotApplicableCount: number;
  undecidedApplicabilityCount: number;
  sufficientEvidenceCount: number;
  compliantWithSufficientEvidenceCount: number;
  nonCompliantCount: number;
  insufficientEvidenceCount: number;
  ct4ciScore: number | null;
  evidenceCoveragePct: number | null;
  calculationStatus: CalculationResultStatus;
  cannotCalculateReason?: string | null;
  majorGateStatus: MajorGateStatus;
  majorStats: {
    total: number;
    applicable: number;
    nonCompliant: number;
    insufficientEvidence: number;
    undecidedApplicability: number;
    isUnresolved: boolean;
  };
  dimensionResults: Record<string, DimensionStats>;
  details: Array<{
    checkpointCode: string;
    dimension: DimensionType;
    title: string;
    isMajor: boolean;
    Ai: number;
    Vi: number;
    Ci: number;
    product: number;
    applicabilityStatus: ApplicabilityDecision;
    evidenceSufficiency: EvidenceSufficiency;
    complianceResult: ComplianceResult;
    notes?: string | null;
  }>;
  calculatedAt: string;
  engineVersion: string;
}

export interface CapaItem {
  id: string;
  capaCode: string;
  checkpointId: string;
  checkpointCode?: string;
  findingTitle: string;
  findingDescription?: string;
  issueType: CapaIssueType;
  severity: 'MAJOR' | 'MINOR' | 'OBSERVATION';
  scopeId: string; // farmId or farmerId
  actionPlan: string;
  responsiblePerson: string;
  deadlineDate: string;
  estimatedCostIdr: number;
  actualCostIdr?: number;
  status: CapaStatus;
  completionProofRef?: string;
  verifierUserId?: string;
  closureNotes?: string;
  closedAt?: string;
  createdAt: string;
}

export interface IdsmEvaluationRuleResult {
  ruleId: IdsmRuleId;
  ruleName: string;
  status: IdsmRuleStatus;
  reason: string;
  recommendations: string;
  details?: unknown;
}

export interface CtCertificationSnapshot {
  farmId: string;
  farmName: string;
  farmerId: string;
  farmerName: string;
  period: string;
  ct4ciScore: number;
  evidenceCoveragePct: number;
  majorGateStatus: MajorGateStatus;
  calculationStatus: CalculationResultStatus;
  cciScore?: number;
  sdiScore?: number;
  totalCheckpoints: number;
  applicableCount: number;
  compliantCount: number;
  openCapasCount: number;
  dimensionBreakdown: Record<string, DimensionStats>;
  verifiedAt: string;
  verifierName: string;
  verifierId: string;
  certificateNumber: string;
  digitalSignatureHash: string;
}
