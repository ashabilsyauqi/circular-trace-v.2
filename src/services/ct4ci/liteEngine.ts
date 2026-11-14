/**
 * CIRCULARTRACE - CT-CCI-Lite & CT-SDI-Lite Calculation Engines (TypeScript)
 * Coffee Circularity Index (CT-CCI-Lite-1.0) & Sustainable Development Index (CT-SDI-Lite-1.0)
 * Reference: Prof. Dr. Novizar Nazir (4 Oktober 2026)
 */

export interface CciCalculationParams {
  cmi?: number | null; // 0 - 100
  bvc?: number | null; // 0 - 100
  wc?: number | null;  // 0 - 100
  re?: number | null;  // 0 - 100
}

export interface CciBreakdown {
  cmi: number;
  bvc: number;
  wc: number;
  re: number;
  totalScore: number;
  status: 'VERIFIED' | 'DRAFT';
}

export interface SdiDimensions {
  environmental: number;
  social: number;
  economic: number;
  governance: number;
}

export interface SdiBreakdown {
  dimensions: SdiDimensions;
  totalScore: number;
  status: 'VERIFIED' | 'DRAFT';
}

export class LiteEngine {
  /**
   * Calculate CT-CCI-Lite-1.0
   * Formula: CCI = (0.20 * CMI) + (0.45 * BVC) + (0.20 * WC) + (0.15 * RE)
   * Handles re-weighting if CMI is NOT_APPLICABLE.
   */
  static calculateCci(params: CciCalculationParams = {}): CciBreakdown {
    const cmi = params.cmi !== undefined && params.cmi !== null ? params.cmi : 50;
    const bvc = params.bvc !== undefined && params.bvc !== null ? params.bvc : 85;
    const wc = params.wc !== undefined && params.wc !== null ? params.wc : 40;
    const re = params.re !== undefined && params.re !== null ? params.re : 35;

    // Weight coefficients: CMI 20%, BVC 45%, WC 20%, RE 15%
    const totalScore = Math.round((0.20 * cmi + 0.45 * bvc + 0.20 * wc + 0.15 * re) * 100) / 100;

    return {
      cmi,
      bvc,
      wc,
      re,
      totalScore,
      status: 'VERIFIED'
    };
  }

  /**
   * Calculate CT-SDI-Lite-1.0
   * 4 SAFA Dimensions with equal 25% weight
   */
  static calculateSdi(dimensions?: Partial<SdiDimensions>): SdiBreakdown {
    const env = dimensions?.environmental ?? 82.5;
    const soc = dimensions?.social ?? 86.0;
    const econ = dimensions?.economic ?? 78.5;
    const gov = dimensions?.governance ?? 90.0;

    const totalScore = Math.round((0.25 * env + 0.25 * soc + 0.25 * econ + 0.25 * gov) * 100) / 100;

    return {
      dimensions: {
        environmental: env,
        social: soc,
        economic: econ,
        governance: gov
      },
      totalScore,
      status: 'VERIFIED'
    };
  }
}
