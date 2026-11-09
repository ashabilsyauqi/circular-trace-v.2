import {
  Ct4ciProducerProfile,
  Ct4ciAnswerItem,
  Ct4ciCapItem,
  ComplianceLevel,
  Ct4ciAuditMetrics,
} from '../types/ct4ci';
import { CT4CI_MASTER_108 } from './ct4ciMaster108';

export const INITIAL_PRODUCER_PROFILE: Ct4ciProducerProfile = {
  id: 'CT4CI-PROD-2026-001',
  unitId4C: '4C-UNIT-IDN-SUMUT-089',
  producerId: 'BP-PROD-PLW-01',
  farmId: 'FARM-PLW-MALABAR-A',
  farmerId: 'FARMER-001',
  farmerName: 'Pak Joko Subagyo',
  cooperative: 'Koperasi Kopi Berkelanjutan Malabar Lestari',
  village: 'Pangalengan',
  district: 'Pangalengan',
  regency: 'Bandung',
  province: 'Jawa Barat',
  farmAreaHa: 2.85,
  coffeeVariety: 'Arabika Typica & Sigarar Utang',
  plantingYear: 2018,
  mainGpsCoordinates: '-7.1754, 107.5621',
  farmPolygonId: 'POLY-MALABAR-01',
  landTenureStatus: 'Hak Milik (SHM No. 4412/PGL)',
  farmerCategory: 'Smallholder (< 5 Ha)',
  workerCount: {
    permanent: 2,
    seasonal: 6,
  },
  visitDate: '2026-11-02',
  enumeratorName: 'Deni Kurniawan (Field Enumerator)',
  icsVerifierName: 'Novizar Verifier (Lead ICS Inspector)',
};

export const INITIAL_CAP_LIST: Ct4ciCapItem[] = [
  {
    id: 'CAP-2026-001',
    checkpointId: 'P 5',
    producerId: 'BP-PROD-PLW-01',
    farmId: 'FARM-PLW-MALABAR-A',
    finding: 'Buku kas pencatatan biaya dan pendapatan kopi baru dicatat sebagian di buku tulis dan belum lengkap per kuartal.',
    category: 'Major',
    correctiveAction: 'Sediakan buku kas terstandar 4C dan rekap nota pembelian pupuk serta penjualan ceri kopi selama 3 bulan terakhir.',
    pic: 'Pak Joko Subagyo (Petani) dibimbing Deni Kurniawan',
    deadline: '2026-11-20',
    status: 'IN_PROGRESS',
  },
  {
    id: 'CAP-2026-002',
    checkpointId: 'P 11',
    producerId: 'BP-PROD-PLW-01',
    farmId: 'FARM-PLW-MALABAR-A',
    finding: 'Tanda pemisah fisik antara karung ceri bersertifikat 4C dan konvensional di area pengeringan belum dipasang papan nama jelas.',
    category: 'Major',
    correctiveAction: 'Pasang label barcode dan pembatas fisik kayu bernomor batch untuk lot 4C bersertifikat.',
    pic: 'Mandor Kebun / Gudang Petani',
    deadline: '2026-11-15',
    status: 'OPEN',
  },
  {
    id: 'CAP-2026-003',
    checkpointId: 'P 4',
    producerId: 'BP-PROD-PLW-01',
    farmId: 'FARM-PLW-MALABAR-A',
    finding: 'Perjanjian kerja lisan dengan buruh petik musiman belum mencantumkan klausul keselamatan kerja dan larangan pekerja anak.',
    category: 'Minor',
    correctiveAction: 'Buat surat pernyataan kepatuhan sederhana untuk pekerja lepas musiman saat panen raya.',
    pic: 'Pak Joko Subagyo',
    deadline: '2026-11-30',
    status: 'OPEN',
  },
];

export function getInitialAnswerStore(): Record<string, Ct4ciAnswerItem> {
  const store: Record<string, Ct4ciAnswerItem> = {};

  CT4CI_MASTER_108.forEach((cp, idx) => {
    // Skenario realistis awal agar pra-audit langsung informatif
    if (idx === 0) {
      // P 1
      store[cp.id] = {
        checkpointId: cp.id,
        fieldAnswer: 'Sesuai',
        observationNotes: 'Struktur kepengurusan kelompok tani dan penanggung jawab mutu kopi sudah ditunjuk (Pak Rudi).',
        evidenceFiles: [
          {
            id: 'EV-001',
            name: 'SK_PenanggungJawab_Mutu_4C.jpg',
            url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
            type: 'image/jpeg',
            timestamp: '2026-11-02 09:30',
          },
        ],
        needFollowUp: false,
        applicability: 'Berlaku',
        naReason: '',
        officialResult: 'Sesuai',
        evidenceVerified: 'Sudah',
        verifierNotes: 'Dokumen SK internal kelompok tani valid dan terverifikasi.',
        correctiveActionRequired: '',
        deadline: '',
      };
    } else if (idx === 1) {
      // P 2 Anti Bribery
      store[cp.id] = {
        checkpointId: cp.id,
        fieldAnswer: 'Sesuai',
        observationNotes: 'Petani menandatangani komitmen anti-penyuapan dan integritas transaksi kopi.',
        evidenceFiles: [
          {
            id: 'EV-002',
            name: 'Pakta_Integritas_Petani_AntiSuap.pdf',
            url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
            type: 'application/pdf',
            timestamp: '2026-11-02 09:45',
          },
        ],
        needFollowUp: false,
        applicability: 'Berlaku',
        naReason: '',
        officialResult: 'Sesuai',
        evidenceVerified: 'Sudah',
        verifierNotes: 'Tanda tangan pakta integritas lengkap bermaterai kelompok.',
        correctiveActionRequired: '',
        deadline: '',
      };
    } else if (idx === 2) {
      // P 3 Legalitas
      store[cp.id] = {
        checkpointId: cp.id,
        fieldAnswer: 'Sesuai',
        observationNotes: 'Lahan tidak berada dalam kawasan lindung / cagar alam, bibit legal bersertifikat.',
        evidenceFiles: [
          {
            id: 'EV-003',
            name: 'Peta_Status_Kawasan_BPN.jpg',
            url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
            type: 'image/jpeg',
            timestamp: '2026-11-02 10:00',
          },
        ],
        needFollowUp: false,
        applicability: 'Berlaku',
        naReason: '',
        officialResult: 'Sesuai',
        evidenceVerified: 'Sudah',
        verifierNotes: 'Polygon kebun klop dengan data SHM dan peta tata ruang desa.',
        correctiveActionRequired: '',
        deadline: '',
      };
    } else if (idx === 3) {
      // P 4 Subkontraktor
      store[cp.id] = {
        checkpointId: cp.id,
        fieldAnswer: 'Tidak sesuai',
        observationNotes: 'Pekerja musiman petik kopi belum memiliki perjanjian kerja tertulis terkait standar 4C.',
        evidenceFiles: [],
        needFollowUp: true,
        applicability: 'Berlaku',
        naReason: '',
        officialResult: 'Tidak sesuai',
        evidenceVerified: 'Belum',
        verifierNotes: 'Temuan minor: belum ada surat pernyataan buruh petik musiman.',
        correctiveActionRequired: 'Buat surat pernyataan standar kepatuhan 4C untuk buruh harian lepas.',
        deadline: '2026-11-30',
      };
    } else if (idx === 4) {
      // P 5 Buku kas
      store[cp.id] = {
        checkpointId: cp.id,
        fieldAnswer: 'Tidak sesuai',
        observationNotes: 'Pencatatan kas operasional masih campur dengan belanja rumah tangga.',
        evidenceFiles: [],
        needFollowUp: true,
        applicability: 'Berlaku',
        naReason: '',
        officialResult: 'Tidak sesuai',
        evidenceVerified: 'Belum',
        verifierNotes: 'Temuan Major: rekam jejak biaya pupuk dan hasil panen belum tertib.',
        correctiveActionRequired: 'Gunakan template buku kas petani 4C format sederhana.',
        deadline: '2026-11-20',
      };
    } else if (idx === 10) {
      // P 11 Pemisahan fisik 4C
      store[cp.id] = {
        checkpointId: cp.id,
        fieldAnswer: 'Tidak sesuai',
        observationNotes: 'Area penyimpanan belum diberi tanda segregasi fisik antara ceri 4C dan non-4C.',
        evidenceFiles: [],
        needFollowUp: true,
        applicability: 'Berlaku',
        naReason: '',
        officialResult: 'Tidak sesuai',
        evidenceVerified: 'Belum',
        verifierNotes: 'Temuan Major: segregation procedure wajib diterapkan di tingkat petani.',
        correctiveActionRequired: 'Pasang label pemisah dan papan identitas lot 4C di gudang ceri.',
        deadline: '2026-11-15',
      };
    } else if (idx === 11) {
      // P 12 Produksi plot (Smallholder NA)
      store[cp.id] = {
        checkpointId: cp.id,
        fieldAnswer: 'Sesuai',
        observationNotes: 'Petani swadaya skala kecil (<5 Ha), rekam jejak panen dicatat secara lisan / rekap nota.',
        evidenceFiles: [],
        needFollowUp: false,
        applicability: 'Tidak Berlaku (NA Smallholder)',
        naReason: 'Pengecualian resmi 4C Audit Checklist v4.1: not applicable for smallholders (cukup laporan verbal/rekap nota).',
        officialResult: 'Sesuai',
        evidenceVerified: 'Sudah',
        verifierNotes: 'NA Smallholder valid sesuai aturan 4C.',
        correctiveActionRequired: '',
        deadline: '',
      };
    } else {
      // Default: Belum dinilai / Belum ditentukan
      store[cp.id] = {
        checkpointId: cp.id,
        fieldAnswer: 'Belum dinilai',
        observationNotes: '',
        evidenceFiles: [],
        needFollowUp: false,
        applicability: 'Belum ditentukan',
        naReason: '',
        officialResult: 'Belum dinilai',
        evidenceVerified: 'Belum',
        verifierNotes: '',
        correctiveActionRequired: '',
        deadline: '',
      };
    }
  });

  return store;
}

export function calculateAuditMetrics(
  answers: Record<string, Ct4ciAnswerItem>,
  complianceLevel: ComplianceLevel
): Ct4ciAuditMetrics {
  const totalCheckpoints = CT4CI_MASTER_108.length;
  let applicableCount = 0;
  let naCount = 0;
  let undecidedApplicabilityCount = 0;
  let verifiedEvidenceCount = 0;
  let compliantWithVerifiedEvidenceCount = 0;
  let unfulfilledMajorCount = 0;
  let nonConformityCount = 0;

  CT4CI_MASTER_108.forEach((cp) => {
    const ans = answers[cp.id];
    if (!ans) return;

    if (ans.applicability === 'Belum ditentukan') {
      undecidedApplicabilityCount++;
    } else if (ans.applicability === 'Berlaku') {
      applicableCount++;

      // Check evidence
      if (ans.evidenceVerified === 'Sudah') {
        verifiedEvidenceCount++;
      }

      // Check compliance + evidence
      if (ans.officialResult === 'Sesuai' && ans.evidenceVerified === 'Sudah') {
        compliantWithVerifiedEvidenceCount++;
      } else if (ans.officialResult === 'Tidak sesuai') {
        nonConformityCount++;
      }

      // Check Major gate based on selected level
      const weight =
        complianceLevel === '1'
          ? cp.level1
          : complianceLevel === '2'
          ? cp.level2
          : cp.level3Plus;

      if (weight === 'Major') {
        const isSatisfied =
          ans.officialResult === 'Sesuai' && ans.evidenceVerified === 'Sudah';
        if (!isSatisfied) {
          unfulfilledMajorCount++;
        }
      }
    } else {
      // NA
      naCount++;
    }
  });

  const evidenceCoveragePercent =
    applicableCount > 0
      ? Math.round((verifiedEvidenceCount / applicableCount) * 100)
      : 0;

  const readinessScorePercent =
    applicableCount > 0
      ? Math.round((compliantWithVerifiedEvidenceCount / applicableCount) * 100)
      : 0;

  let majorGateStatus: 'PASSED' | 'FAILED' | 'PENDING' = 'PASSED';
  let auditReadinessStatus = 'SIAP AUDIT EKSTERNAL 4C';

  if (undecidedApplicabilityCount > 0) {
    majorGateStatus = 'PENDING';
    auditReadinessStatus = `APPLICABILITY BELUM LENGKAP (${undecidedApplicabilityCount} Checkpoint Belum Diputuskan)`;
  } else if (unfulfilledMajorCount > 0) {
    majorGateStatus = 'FAILED';
    auditReadinessStatus = `BELUM SIAP (Terganjal ${unfulfilledMajorCount} Checkpoint Major)`;
  } else if (readinessScorePercent < 80) {
    majorGateStatus = 'FAILED';
    auditReadinessStatus = `BELUM SIAP (Skor Kesiapan ${readinessScorePercent}% < Standar 80%)`;
  }

  return {
    complianceLevel,
    totalCheckpoints,
    applicableCount,
    naCount,
    undecidedApplicabilityCount,
    verifiedEvidenceCount,
    compliantWithVerifiedEvidenceCount,
    evidenceCoveragePercent,
    readinessScorePercent,
    unfulfilledMajorCount,
    nonConformityCount,
    majorGateStatus,
    auditReadinessStatus,
  };
}
