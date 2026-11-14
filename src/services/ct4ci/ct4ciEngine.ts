/**
 * CIRCULARTRACE - CT-4CI Calculation Engine (TypeScript)
 * Mathematical implementation of 4C Readiness Index (CT-4CI) & Evidence Coverage (EC)
 * Reference: CircularTrace Paper Section 3.11 & 3.12, Equations (7) & (8).
 *
 * Formula:
 *   CT-4CI = 100 * Σ(Ai * Ci * Vi) / ΣAi
 *   Evidence Coverage = 100 * Σ(Ai * Vi) / ΣAi
 *
 * Invariant: CT-4CI <= Evidence Coverage
 */

import {
  ApplicabilityDecision,
  EvidenceSufficiency,
  ComplianceResult,
  CalculationResultStatus,
  DimensionType,
  MajorGateStatus,
  CheckpointAssessment,
  Ct4ciCalculationResult,
  DimensionStats
} from './types';
import { globalCheckpointRegistry, CheckpointRegistryService } from './checkpointRegistry';

export class Ct4ciEngine {
  /**
   * Calculate CT-4CI and Evidence Coverage for an assessment dataset
   */
  static calculate(
    assessments: CheckpointAssessment[] = [],
    options: { registry?: CheckpointRegistryService; module?: string } = {}
  ): Ct4ciCalculationResult {
    const registry = options.registry || globalCheckpointRegistry;
    const moduleType = options.module || 'PRODUCER';
    const checkpoints = registry.getModuleCheckpoints(moduleType);

    // Build assessment lookup map by checkpointCode
    const assessmentMap = new Map<string, CheckpointAssessment>();
    for (const a of assessments) {
      const code = a.checkpointCode;
      if (code) {
        assessmentMap.set(code, a);
      }
    }

    const totalInventory = checkpoints.length;
    let applicableCount = 0;
    let approvedNotApplicableCount = 0;
    let undecidedCount = 0;

    let numeratorCt4ci = 0;     // Σ(Ai * Ci * Vi)
    let numeratorCoverage = 0;  // Σ(Ai * Vi)
    let denominator = 0;        // ΣAi

    let compliantCount = 0;
    let nonCompliantCount = 0;
    let sufficientEvidenceCount = 0;
    let insufficientEvidenceCount = 0;

    let majorTotal = 0;
    let majorApplicable = 0;
    let majorNonCompliant = 0;
    let majorInsufficient = 0;
    let majorUndecided = 0;

    // Dimension breakdown trackers
    const dimStats: Record<string, {
      total: number;
      sumA: number;
      sumACV: number;
      sumAV: number;
      compliant: number;
      nonCompliant: number;
      majorNonCompliant: number;
    }> = {
      [DimensionType.ECONOMIC]: { total: 0, sumA: 0, sumACV: 0, sumAV: 0, compliant: 0, nonCompliant: 0, majorNonCompliant: 0 },
      [DimensionType.SOCIAL]: { total: 0, sumA: 0, sumACV: 0, sumAV: 0, compliant: 0, nonCompliant: 0, majorNonCompliant: 0 },
      [DimensionType.ENVIRONMENTAL]: { total: 0, sumA: 0, sumACV: 0, sumAV: 0, compliant: 0, nonCompliant: 0, majorNonCompliant: 0 }
    };

    const details: Ct4ciCalculationResult['details'] = [];

    for (const cp of checkpoints) {
      const dim = cp.dimension;
      if (dimStats[dim]) dimStats[dim].total++;
      if (cp.isMajor) majorTotal++;

      const ass = assessmentMap.get(cp.checkpointCode);

      // Determine Ai (Applicability)
      let Ai = 1;
      let appStatus: ApplicabilityDecision = ApplicabilityDecision.APPLICABLE;

      if (!ass) {
        // Missing assessment record -> treat as UNDECIDED candidate
        appStatus = ApplicabilityDecision.UNDECIDED;
        Ai = 1;
        undecidedCount++;
        if (cp.isMajor) majorUndecided++;
      } else if (ass.applicability === ApplicabilityDecision.NOT_APPLICABLE) {
        // Must have recorded reason and verifier approval
        if (ass.nonApplicabilityReason && ass.applicabilityApprovedBy) {
          appStatus = ApplicabilityDecision.NOT_APPLICABLE;
          Ai = 0;
          approvedNotApplicableCount++;
        } else {
          // Unapproved not-applicable cannot be excluded from denominator!
          appStatus = ApplicabilityDecision.UNDECIDED;
          Ai = 1;
          undecidedCount++;
          if (cp.isMajor) majorUndecided++;
        }
      } else if (ass.applicability === ApplicabilityDecision.UNDECIDED) {
        appStatus = ApplicabilityDecision.UNDECIDED;
        Ai = 1;
        undecidedCount++;
        if (cp.isMajor) majorUndecided++;
      } else {
        appStatus = ApplicabilityDecision.APPLICABLE;
        Ai = 1;
        applicableCount++;
      }

      // Determine Vi (Evidence Sufficiency)
      let Vi = 0;
      const suffStatus: EvidenceSufficiency = ass?.evidenceSufficiency || EvidenceSufficiency.NOT_AVAILABLE;
      if (Ai === 1) {
        if (suffStatus === EvidenceSufficiency.SUFFICIENT) {
          Vi = 1;
          sufficientEvidenceCount++;
        } else {
          Vi = 0;
          insufficientEvidenceCount++;
          if (cp.isMajor) majorInsufficient++;
        }
      }

      // Determine Ci (Conformity / Compliance)
      let Ci = 0;
      const compStatus: ComplianceResult = ass?.complianceResult || ComplianceResult.UNDETERMINED;
      if (Ai === 1) {
        if (compStatus === ComplianceResult.COMPLIANT) {
          Ci = 1;
          compliantCount++;
        } else if (compStatus === ComplianceResult.NON_COMPLIANT) {
          Ci = 0;
          nonCompliantCount++;
          if (cp.isMajor) majorNonCompliant++;
        } else {
          Ci = 0;
        }
      }

      // Accumulate numerators and denominator
      if (Ai === 1) {
        denominator += 1;
        numeratorCoverage += Vi;
        numeratorCt4ci += (Ci * Vi);

        if (cp.isMajor) majorApplicable++;

        if (dimStats[dim]) {
          dimStats[dim].sumA += 1;
          dimStats[dim].sumAV += Vi;
          dimStats[dim].sumACV += (Ci * Vi);
          if (compStatus === ComplianceResult.COMPLIANT && Vi === 1) dimStats[dim].compliant++;
          if (compStatus === ComplianceResult.NON_COMPLIANT) {
            dimStats[dim].nonCompliant++;
            if (cp.isMajor) dimStats[dim].majorNonCompliant++;
          }
        }
      }

      details.push({
        checkpointCode: cp.checkpointCode,
        dimension: cp.dimension,
        title: cp.title,
        isMajor: cp.isMajor,
        Ai,
        Vi,
        Ci,
        product: Ai * Ci * Vi,
        applicabilityStatus: appStatus,
        evidenceSufficiency: suffStatus,
        complianceResult: compStatus,
        notes: ass?.evaluationNotes || cp.notes || null
      });
    }

    // Calculation result handling
    let ct4ciScore: number | null = null;
    let evidenceCoveragePct: number | null = null;
    let calculationStatus: CalculationResultStatus = CalculationResultStatus.CALCULATED;
    let cannotCalculateReason: string | null = null;

    if (denominator === 0) {
      calculationStatus = CalculationResultStatus.CANNOT_CALCULATE;
      cannotCalculateReason = 'Seluruh checkpoint disetujui tidak berlaku atau tidak ada inventori relevan (Denominator = 0).';
    } else {
      ct4ciScore = Math.round((100 * numeratorCt4ci / denominator) * 10) / 10;
      evidenceCoveragePct = Math.round((100 * numeratorCoverage / denominator) * 10) / 10;

      // Invariant: CT-4CI <= Evidence Coverage
      if (ct4ciScore > evidenceCoveragePct) {
        ct4ciScore = evidenceCoveragePct;
      }

      // If any applicability is undecided, flag PROVISIONAL
      if (undecidedCount > 0) {
        calculationStatus = CalculationResultStatus.PROVISIONAL;
      }
    }

    // Evaluate Major Gate
    const isMajorGateUnresolved = (majorNonCompliant > 0) || (majorInsufficient > 0) || (majorUndecided > 0);
    const majorGateStatus: MajorGateStatus = isMajorGateUnresolved ? MajorGateStatus.UNRESOLVED : MajorGateStatus.PASSED;

    // Build dimension breakdown scores
    const dimensionResults: Record<string, DimensionStats> = {};
    for (const [dimKey, d] of Object.entries(dimStats)) {
      const dimReadiness = d.sumA > 0 ? Math.round((100 * d.sumACV / d.sumA) * 10) / 10 : null;
      const dimCoverage = d.sumA > 0 ? Math.round((100 * d.sumAV / d.sumA) * 10) / 10 : null;
      dimensionResults[dimKey] = {
        totalCheckpoints: d.total,
        applicableCount: d.sumA,
        sufficientEvidenceCount: d.sumAV,
        compliantCount: d.compliant,
        nonCompliantCount: d.nonCompliant,
        majorNonCompliantCount: d.majorNonCompliant,
        readinessScore: dimReadiness,
        evidenceCoveragePct: dimCoverage
      };
    }

    return {
      module: moduleType,
      totalInventory,
      applicableCount: denominator,
      approvedNotApplicableCount,
      undecidedApplicabilityCount: undecidedCount,
      sufficientEvidenceCount,
      compliantWithSufficientEvidenceCount: numeratorCt4ci,
      nonCompliantCount,
      insufficientEvidenceCount,
      ct4ciScore,
      evidenceCoveragePct,
      calculationStatus,
      cannotCalculateReason,
      majorGateStatus,
      majorStats: {
        total: majorTotal,
        applicable: majorApplicable,
        nonCompliant: majorNonCompliant,
        insufficientEvidence: majorInsufficient,
        undecidedApplicability: majorUndecided,
        isUnresolved: isMajorGateUnresolved
      },
      dimensionResults,
      details,
      calculatedAt: new Date().toISOString(),
      engineVersion: 'CT-4CI-v1.0'
    };
  }

  /**
   * Aggregate Multi-Plot Assessments for a Producer
   * A producer is COMPLIANT for a PER_PLOT checkpoint if and only if ALL plots are COMPLIANT.
   * If any plot is NON_COMPLIANT, producer is NON_COMPLIANT.
   */
  static aggregateProducerFromPlots(plotAssessments: CheckpointAssessment[] = []): CheckpointAssessment[] {
    const grouped = new Map<string, CheckpointAssessment[]>();
    for (const pa of plotAssessments) {
      const code = pa.checkpointCode;
      if (!grouped.has(code)) grouped.set(code, []);
      grouped.get(code)!.push(pa);
    }

    const producerAssessments: CheckpointAssessment[] = [];
    for (const [code, items] of grouped.entries()) {
      const hasAnyNonCompliant = items.some(i => i.complianceResult === ComplianceResult.NON_COMPLIANT);
      const allCompliant = items.every(i => i.complianceResult === ComplianceResult.COMPLIANT);
      const allSufficient = items.every(i => i.evidenceSufficiency === EvidenceSufficiency.SUFFICIENT);
      const anyUndecided = items.some(i => i.applicability === ApplicabilityDecision.UNDECIDED);
      const allNotApplicable = items.every(i => i.applicability === ApplicabilityDecision.NOT_APPLICABLE);

      let app: ApplicabilityDecision = ApplicabilityDecision.APPLICABLE;
      if (allNotApplicable) app = ApplicabilityDecision.NOT_APPLICABLE;
      else if (anyUndecided) app = ApplicabilityDecision.UNDECIDED;

      const suff: EvidenceSufficiency = allSufficient ? EvidenceSufficiency.SUFFICIENT : EvidenceSufficiency.INSUFFICIENT;
      let comp: ComplianceResult = ComplianceResult.UNDETERMINED;
      if (hasAnyNonCompliant) comp = ComplianceResult.NON_COMPLIANT;
      else if (allCompliant && allSufficient) comp = ComplianceResult.COMPLIANT;

      producerAssessments.push({
        scopeType: 'PRODUCER',
        scopeId: items[0]?.scopeId || 'PRODUCER',
        checkpointCode: code,
        period: items[0]?.period || 'CURRENT',
        applicability: app,
        evidenceSufficiency: suff,
        complianceResult: comp,
        evaluationNotes: `Agregasi lintas petak (${items.length} petak). ${hasAnyNonCompliant ? 'Ditemukan petak yang tidak sesuai.' : (allCompliant ? 'Seluruh petak sesuai.' : 'Menunggu bukti lengkap seluruh petak.')}`
      });
    }

    return producerAssessments;
  }
}
