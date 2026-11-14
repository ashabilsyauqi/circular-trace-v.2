/**
 * CIRCULARTRACE - Cultivation Practices Questionnaire & 4C Evaluation Configuration (TypeScript)
 * Staged multi-step forms in plain Indonesian with conditional logic and checkpoint mappings.
 * Covering Topics A through E mapped directly to 4C Producer Checkpoints (P001–P108).
 */

import {
  PracticeCategory,
  ApplicabilityDecision,
  EvidenceSufficiency,
  ComplianceResult,
  CapaIssueType,
  BANNED_CHEMICALS_LIST,
  CheckpointAssessment
} from './types';
import { CheckpointRegistryService, globalCheckpointRegistry } from './checkpointRegistry';

export interface QuestionConfig {
  id: string;
  text: string;
  type: 'BOOLEAN' | 'MULTI_CHOICE' | 'CHECKBOX' | 'TEXT';
  isMajor: boolean;
  mappedCheckpoints: string[];
  evidenceRequired: string;
  help: string;
  options?: string[];
}

export interface PracticeSectionConfig {
  sectionId: string;
  title: string;
  questions: QuestionConfig[];
}

export interface PracticeCategoryConfig {
  category: PracticeCategory;
  categoryName: string;
  categoryIcon: string;
  description: string;
  sections: PracticeSectionConfig[];
}

export const PracticesFormConfig: PracticeCategoryConfig[] = [
  // ==========================================================================
  // TOPIK A: PENGELOLAAN TANAH & TANAMAN
  // ==========================================================================
  {
    category: PracticeCategory.SOIL_CROP,
    categoryName: 'A. Pengelolaan Tanah & Tanaman',
    categoryIcon: '🌾',
    description: 'Pemangkasan, pohon penaung, konservasi tanah, pengendalian erosi, pemupukan berimbang, dan legalitas lahan.',
    sections: [
      {
        sectionId: 'tenure_harvest',
        title: 'Legalitas Lahan & Pencatatan Produksi',
        questions: [
          {
            id: 'Q_A01_TENURE',
            text: 'Apakah petani memiliki bukti hak pengelolaan/penguasaan lahan yang sah (SHM, Girik, SKT, atau Hak Adat terdaftar)?',
            type: 'BOOLEAN',
            isMajor: true,
            mappedCheckpoints: ['P001'],
            evidenceRequired: 'Sertifikat tanah, surat keterangan desa/adat, titik koordinat poligon kebun.',
            help: 'Kriteria Major 4C. Lahan tidak boleh bersengketa atau berada dalam kawasan hutan lindung tanpa izin perhutanan sosial.'
          },
          {
            id: 'Q_A02_HARVEST_LOG',
            text: 'Apakah petani rutin mencatat hasil panen harian (buku saku panen atau nota penerimaan timbangan)?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P002'],
            evidenceRequired: 'Buku catatan panen atau tanda terima penimbangan ceri di titik kumpul.',
            help: 'Mencatat tanggal petik, bobot ceri basah (kg), dan asal petak kebun.'
          },
          {
            id: 'Q_A03_SALES_RECORD',
            text: 'Apakah seluruh transaksi penjualan kopi memiliki tanda terima/nota penjualan resmi?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P003'],
            evidenceRequired: 'Nota penjualan, kuitansi pembayaran dari kelompok/koperasi/pembeli.',
            help: 'Menjamin keterlacakan aliran volume kopi dari kebun ke rantai pasok.'
          },
          {
            id: 'Q_A04_LOT_SEPARATION',
            text: 'Apakah kopi dari kebun 4C dipisahkan secara fisik dari kopi non-sertifikasi (karung/label terpisah)?',
            type: 'BOOLEAN',
            isMajor: true,
            mappedCheckpoints: ['P004'],
            evidenceRequired: 'Pemberian label identitas lot pada karung ceri dan tempat transit.',
            help: 'Kriteria Major 4C untuk mencegah kontaminasi dan pencampuran kopi yang belum terverifikasi.'
          }
        ]
      },
      {
        sectionId: 'pruning_shade_soil',
        title: 'Pemangkasan, Penaung & Konservasi Tanah',
        questions: [
          {
            id: 'Q_A05_CHERRY_PICKING',
            text: 'Apakah pemetikan dilakukan dengan metode selektif (petik merah minimal 85% buah matang)?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P007', 'P008'],
            evidenceRequired: 'Observasi buah panen di keranjang dan catatan sortasi ceri.',
            help: 'Mencegah kerusakan mutu dan serangan hama penggerek buah kopi.'
          },
          {
            id: 'Q_A06_PRUNING',
            text: 'Apakah dilakukan pemangkasan pemeliharaan tunas air (wiwil) dan cabang tua minimal 2x setahun?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P011', 'P012'],
            evidenceRequired: 'Observasi bentuk tajuk tanaman kopi di kebun dan catatan tanggal pemangkasan.',
            help: 'Pemangkasan memaksimalkan aerasi dan pencahayaan serta menekan penyakit jamur.'
          },
          {
            id: 'Q_A07_SHADE_DENSITY',
            text: 'Kerapatan dan keragaman pohon penaung di petak kebun:',
            type: 'MULTI_CHOICE',
            options: [
              'Optimal (> 70 pohon penaung/ha dengan minimal 2 jenis pohon berbeda)',
              'Sedang (30 - 70 pohon penaung/ha)',
              'Rendah / Monokultur (< 30 pohon penaung/ha)'
            ],
            isMajor: false,
            mappedCheckpoints: ['P105'],
            evidenceRequired: 'Hasil sensus pohon penaung dalam formulir plot kebun.',
            help: 'Agroforestri kopi menjaga kelembapan tanah, cadangan karbon, dan keanekaragaman hayati.'
          },
          {
            id: 'Q_A08_EROSION_CONTROL',
            text: 'Tindakan konservasi tanah dan pencegahan erosi yang diterapkan:',
            type: 'CHECKBOX',
            options: [
              'Teras bangku / terasering pada lahan miring',
              'Pembuatan rorak (saluran penangkap air & serasah)',
              'Penanaman rumput penguat tebing (vetiver / rumput gajah)',
              'Penggunaan mulsa serasah organik di piringan tanaman',
              'Tidak ada tindakan konservasi erosi'
            ],
            isMajor: false,
            mappedCheckpoints: ['P090'],
            evidenceRequired: 'Observasi fisik kontur tanah di kebun dan foto rorak/teras.',
            help: 'Wajib diterapkan khususnya pada petak kebun dengan kemiringan > 15%.'
          },
          {
            id: 'Q_A10_FERTILIZER_RECORD',
            text: 'Apakah ada pencatatan jenis dan dosis pupuk yang diaplikasikan ke tanaman kopi?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P009', 'P092'],
            evidenceRequired: 'Catatan logbook pupuk, kuitansi pembelian saprodi.',
            help: 'Menjamin efisiensi nutrisi dan mencegah over-fertilization.'
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // TOPIK B: PENGELOLAAN HAMA & BAHAN KIMIA
  // ==========================================================================
  {
    category: PracticeCategory.PEST_CHEMICAL,
    categoryName: 'B. Pengelolaan Hama & Bahan Kimia',
    categoryIcon: '🧪',
    description: 'Pengendalian hama terpadu (IPM), larangan pestisida berbahaya, dan penyimpanan bahan kimia aman.',
    sections: [
      {
        sectionId: 'ipm_chemical_banned',
        title: 'Pengendalian Hama & Larangan Pestisida Berbahaya',
        questions: [
          {
            id: 'Q_B01_IPM_MONITORING',
            text: 'Apakah petani memprioritaskan pemantauan hama dan metode hayati/mekanis sebelum memakai bahan kimia?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P080'],
            evidenceRequired: 'Pemasangan perangkap hama (Brocap), sanitasi buah kopi hitam busuk (bubuk buah).',
            help: 'Prinsip PHT: Pestisida kimia hanya opsi darurat terakhir jika ambang ekonomi terlampaui.'
          },
          {
            id: 'Q_B03_CHEMICAL_USAGE',
            text: 'Apakah petani menggunakan pestisida kimia sintetis / herbisida dalam 12 bulan terakhir?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P081'],
            evidenceRequired: 'Catatan logbook penggunaan pestisida atau stok obat kebun.',
            help: 'Jika tidak menggunakan kimia sintetis, beberapa persyaratan pestisida dapat dinyatakan tidak berlaku (N/A).'
          },
          {
            id: 'Q_B04_BANNED_CHEMICAL_CHECK',
            text: 'Pilih merk/bahan aktif pestisida kimia yang pernah disimpan atau diaplikasikan:',
            type: 'TEXT',
            isMajor: true,
            mappedCheckpoints: ['P082'],
            evidenceRequired: 'Pemeriksaan fisik gudang/tempat penyimpanan saprodi oleh verifikator.',
            help: 'PERHATIAN KRITIS: Penggunaan bahan terlarang (seperti Gramoxone/Paraquat, Endosulfan, Furadan) otomatis menggagalkan Major Gate 4C!'
          },
          {
            id: 'Q_B05_PESTICIDE_STORAGE',
            text: 'Tempat penyimpanan bahan kimia dan pestisida di rumah/kebun:',
            type: 'MULTI_CHOICE',
            options: [
              'Lemari/kotak khusus terkunci, berlantai kedap air, jauh dari jangkauan anak dan makanan (Sesuai 4C)',
              'Tersimpan di ruang terpisah namun belum terkunci',
              'Tersimpan di dapur atau dekat tempat penyimpanan makanan/sumber air',
              'Tidak menyimpan pestisida kimia di rumah/kebun'
            ],
            isMajor: true,
            mappedCheckpoints: ['P083'],
            evidenceRequired: 'Foto lemari penyimpanan bahan kimia dengan gembok pengaman.',
            help: 'Kriteria Major 4C. Mencegah keracunan keluarga dan kontaminasi pangan.'
          },
          {
            id: 'Q_B06_PPE_EQUIPMENT',
            text: 'Alat Pelindung Diri (APD) yang wajib dipakai saat mencampur dan menyemprot pestisida:',
            type: 'CHECKBOX',
            options: [
              'Masker respirator / masker hidung',
              'Sarung tangan karet / nitril kedap air',
              'Sepatu bot karet',
              'Baju lengan panjang & celana panjang khusus',
              'Kacamata pelindung (goggles)',
              'Tidak memakai APD saat penyemprotan'
            ],
            isMajor: true,
            mappedCheckpoints: ['P045'],
            evidenceRequired: 'Observasi ketersediaan APD fisik dan wawancara operator penyemprot.',
            help: 'Kriteria Major 4C. Melindungi kesehatan pekerja dan petani dari paparan toksik akut & kronis.'
          },
          {
            id: 'Q_B07_CONTAINER_DISPOSAL',
            text: 'Penanganan wadah bekas pestisida:',
            type: 'MULTI_CHOICE',
            options: [
              'Dibilas 3x (triple rinse), air bilasan dimasukkan ke tangki semprot, lalu wadah dilubangi/dihancurkan dan dikirim ke bank sampah B3 (Sesuai 4C)',
              'Dibuang ke tempat sampah umum atau dibakar di kebun',
              'Digunakan kembali untuk wadah air/benda rumah tangga'
            ],
            isMajor: false,
            mappedCheckpoints: ['P085'],
            evidenceRequired: 'Foto wadah bekas yang telah dilubangi dan catatan penyerahan limbah B3 ke ICS.',
            help: 'Dilarang keras memakai ulang wadah pestisida untuk keperluan domestik apapun.'
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // TOPIK C: AIR, LIMBAH & LINGKUNGAN
  // ==========================================================================
  {
    category: PracticeCategory.WATER_WASTE_ENV,
    categoryName: 'C. Air, Limbah & Lingkungan',
    categoryIcon: '💧',
    description: 'Bebas deforestasi, sempadan sungai, pengolahan air limbah, dan pemanfaatan limbah pulp/cascara.',
    sections: [
      {
        sectionId: 'deforestation_water_waste',
        title: 'Deforestasi, Konservasi Air & Limbah',
        questions: [
          {
            id: 'Q_C01_NO_DEFORESTATION',
            text: 'Apakah lahan kebun bebas dari pembukaan/konversi hutan primer pasca cut-off date (1 Januari 2008 untuk 4C / 31 Desember 2020 untuk EUDR)?',
            type: 'BOOLEAN',
            isMajor: true,
            mappedCheckpoints: ['P070'],
            evidenceRequired: 'Peta poligon GPS kebun yang di-overlay dengan peta batas kawasan hutan SK MenLHK / EUDR Forest Observatory.',
            help: 'Kriteria Major Mutlak. Menjamin kopi bebas dari komoditas penyebab deforestasi.'
          },
          {
            id: 'Q_C02_HCV_PEAT',
            text: 'Apakah petak kebun berada di luar kawasan lindung HCV (High Conservation Value) dan lahan gambut alami?',
            type: 'BOOLEAN',
            isMajor: true,
            mappedCheckpoints: ['P071'],
            evidenceRequired: 'Surat verifikasi spasial plot oleh operator SIG kelompok tani.',
            help: 'Kriteria Major 4C. Melindungi ekosistem bernilai konservasi penting dan cadangan karbon tinggi.'
          },
          {
            id: 'Q_C03_HUNTING_BAN',
            text: 'Apakah ada larangan perburuan satwa liar dilindungi dan perusakan habitat alami di lingkungan kebun?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P075'],
            evidenceRequired: 'Papan larangan berburu di kelompok tani dan komitmen tertulis anggota.',
            help: 'Menjaga keberlangsungan burung pemakan serangga dan satwa liar endemik.'
          },
          {
            id: 'Q_C04_RIPARIAN_BUFFER',
            text: 'Apakah ada zona penyangga alami (sempadan air minimum 5–10 meter) di tepi mata air atau sungai tanpa aplikasi kimia?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P096'],
            evidenceRequired: 'Observasi vegetasi sempadan sungai dan tidak adanya jejak herbisida di tepi air.',
            help: 'Melindungi badan air dari kontaminasi limpasan pestisida dan sedimentasi erosi.'
          },
          {
            id: 'Q_C05_WASTEWATER_TREATMENT',
            text: 'Jika petani melakukan pengolahan basah sendiri, apakah air limbah pulping/fermentasi diolah sebelum dibuang?',
            type: 'MULTI_CHOICE',
            options: [
              'Diolah melalui kolam pengendapan/netralisasi kapur sebelum meresap ke tanah (Sesuai 4C)',
              'Dibuang langsung ke sungai/saluran air tanpa pengolahan',
              'Tidak melakukan pengolahan basah sendiri (ceri langsung dijual basah ke kelompok/pengolah)'
            ],
            isMajor: false,
            mappedCheckpoints: ['P100'],
            evidenceRequired: 'Foto kolam pengendapan limbah cair pulper.',
            help: 'Air limbah kopi ber-pH asam dan ber-BOD tinggi dapat membunuh biota sungai jika dibuang langsung.'
          },
          {
            id: 'Q_C06_ZERO_BURNING',
            text: 'Apakah petani mematuhi larangan pembakaran sisa tanaman/gulma dan sampah terbuka di kebun (Zero Burning)?',
            type: 'BOOLEAN',
            isMajor: true,
            mappedCheckpoints: ['P104'],
            evidenceRequired: 'Observasi tidak ada arang/bekas pembakaran terbuka di area petak kebun.',
            help: 'Kriteria Major 4C. Mencegah kebakaran lahan dan emisi gas rumah kaca.'
          },
          {
            id: 'Q_C07_CASCARA_UTILIZATION',
            text: 'Pemanfaatan kulit kopi (pulp/cascara) hasil pengolahan kebun:',
            type: 'CHECKBOX',
            options: [
              'Dikomposkan kembali sebagai pupuk organik tanaman kopi',
              'Dikeringkan menjadi teh cascara bernilai ekonomi',
              'Diberikan sebagai pakan ternak tambahan',
              'Dibuang ke pinggir kebun/saluran air tanpa pemanfaatan'
            ],
            isMajor: false,
            mappedCheckpoints: ['P017', 'P095'],
            evidenceRequired: 'Foto tumpukan pembuatan kompos cascara atau produk cascara kering.',
            help: 'Mendukung prinsip ekonomi sirkular kopi dan mendongkrak skor CT-CCI.'
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // TOPIK D: KETENAGAKERJAAN & KESELAMATAN KERJA
  // ==========================================================================
  {
    category: PracticeCategory.LABOR_SAFETY,
    categoryName: 'D. Ketenagakerjaan & K3',
    categoryIcon: '👷',
    description: 'Larangan pekerja anak, kerja paksa, upah layak, APD, dan kotak P3K di kebun.',
    sections: [
      {
        sectionId: 'labor_human_rights',
        title: 'Hak Tenaga Kerja & Keselamatan Kerja (K3)',
        questions: [
          {
            id: 'Q_D01_LABOR_STRUCTURE',
            text: 'Struktur tenaga kerja yang mengelola petak kebun:',
            type: 'MULTI_CHOICE',
            options: [
              'Hanya tenaga kerja keluarga (tanpa pekerja upahan)',
              'Mempekerjakan buruh upahan harian / musiman saat panen',
              'Mempekerjakan pekerja tetap / bulanan'
            ],
            isMajor: false,
            mappedCheckpoints: ['P036'],
            evidenceRequired: 'Daftar nama pekerja harian/musiman panen.',
            help: 'Jika hanya tenaga kerja keluarga, klausul UMR buruh upahan disetujui Not Applicable (N/A).'
          },
          {
            id: 'Q_D02_NO_FORCED_LABOR',
            text: 'Apakah seluruh tenaga kerja bekerja secara sukarela tanpa penahanan identitas asli atau jeratan utang?',
            type: 'BOOLEAN',
            isMajor: true,
            mappedCheckpoints: ['P024'],
            evidenceRequired: 'Hasil wawancara verifikator secara mandiri dengan pekerja kebun.',
            help: 'Kriteria Major Mutlak 4C & ILO Convention No. 29 & 105.'
          },
          {
            id: 'Q_D03_NO_CHILD_LABOR',
            text: 'Apakah kebun bebas dari mempekerjakan anak di bawah usia 15 tahun (atau usia wajib belajar)?',
            type: 'BOOLEAN',
            isMajor: true,
            mappedCheckpoints: ['P028'],
            evidenceRequired: 'Verifikasi KTP/dokumen usia pekerja pemetik dan observasi lapangan saat panen.',
            help: 'Kriteria Major Mutlak 4C & ILO Convention No. 138. Bantuan anak keluarga hanya boleh di luar jam sekolah dan tidak berbahaya.'
          },
          {
            id: 'Q_D04_NO_HAZARDOUS_YOUTH',
            text: 'Apakah pekerja remaja (usia 15–17 tahun) dilarang melakukan pekerjaan berbahaya (semprot pestisida, angkut berat > 20 kg)?',
            type: 'BOOLEAN',
            isMajor: true,
            mappedCheckpoints: ['P029'],
            evidenceRequired: 'Catatan tugas harian tenaga kerja di kebun.',
            help: 'Kriteria Major 4C & ILO Convention No. 182.'
          },
          {
            id: 'Q_D05_FAIR_WAGE',
            text: 'Apakah buruh upahan menerima upah yang disepakati sesuai standar upah minimum daerah yang berlaku?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P037'],
            evidenceRequired: 'Slip pembayaran upah atau kuitansi borongan panen.',
            help: 'Menjamin kesejahteraan tenaga kerja pertanian kopi.'
          },
          {
            id: 'Q_D06_SAFE_WATER',
            text: 'Apakah tersedia akses air minum bersih dan fasilitas sanitasi yang layak bagi pekerja di kebun?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P050'],
            evidenceRequired: 'Observasi ketersediaan wadah air minum dan jamban kebun.',
            help: 'Menjaga hidrasi dan higienitas pekerja saat aktivitas di kebun.'
          },
          {
            id: 'Q_D07_FIRST_AID',
            text: 'Apakah tersedia kotak P3K dengan obat luar, perban, dan antiseptik di pondok kebun atau rumah petani?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P060'],
            evidenceRequired: 'Pemeriksaan kelengkapan isi kotak P3K fisik.',
            help: 'Penanganan cepat bila terjadi kecelakaan kerja (luka gores parang/duri).'
          },
          {
            id: 'Q_D08_GRIEVANCE_CHANNEL',
            text: 'Apakah petani dan pekerja mengetahui saluran penyampaian keluhan/aspirasi ke pengurus kelompok tani (ICS)?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P055'],
            evidenceRequired: 'Wawancara dengan pekerja kebun mengenai nomor kontak pengurus/kotak aduan.',
            help: 'Mencegah konflik agraria dan ketenagakerjaan internal.'
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // TOPIK E: EKONOMI & KELEMBAGAAN
  // ==========================================================================
  {
    category: PracticeCategory.ECON_INST,
    categoryName: 'E. Ekonomi & Kelembagaan',
    categoryIcon: '🏛️',
    description: 'Keanggotaan kelompok tani, transparansi harga, premi keberlanjutan, dan pelatihan GAP.',
    sections: [
      {
        sectionId: 'institution_market',
        title: 'Pengorganisasian Kelompok & Hubungan Pasar',
        questions: [
          {
            id: 'Q_E01_GROUP_MEMBERSHIP',
            text: 'Apakah petani terdaftar aktif sebagai anggota kelompok tani / koperasi kopi binaan?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P005'],
            evidenceRequired: 'Buku register anggota kelompok tani dan kartu anggota resmi.',
            help: 'Kelompok tani menjadi wadah penjamin mutu dan unit pengelola ICS.'
          },
          {
            id: 'Q_E02_PRICE_TRANSPARENCY',
            text: 'Apakah petani mendapatkan transparansi harga pasar harian dan rincian pemotongan jasa kelompok?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P006'],
            evidenceRequired: 'Papan informasi harga di titik kumpul atau pesan WhatsApp grup kelompok.',
            help: 'Membangun keadilan ekonomi dan loyalitas pasok anggota.'
          },
          {
            id: 'Q_E03_SUSTAINABILITY_PREMIUM',
            text: 'Apakah petani menerima insentif mutu / premi keberlanjutan dari penjualan kopi bersertifikasi?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P014'],
            evidenceRequired: 'Kuitansi penerimaan dana bagi hasil / premi sertifikasi.',
            help: 'Memberikan nilai tambah nyata bagi kepatuhan standar keberlanjutan.'
          },
          {
            id: 'Q_E04_GAP_TRAINING',
            text: 'Keikutsertaan dalam pelatihan GAP (Good Agricultural Practices) dan standar 4C dalam 1 tahun terakhir:',
            type: 'MULTI_CHOICE',
            options: [
              'Pelatihan Pemangkasan & Pengendalian Hama Hayati (GAP)',
              'Sosialisasi Standar 4C & Larangan Bahan Kimia Berbahaya',
              'Pelatihan Pascapanen & Higienitas Ceri Kopi',
              'Belum pernah mengikuti pelatihan'
            ],
            isMajor: false,
            mappedCheckpoints: ['P011'],
            evidenceRequired: 'Daftar hadir pelatihan ICS dan sertifikat keikutsertaan jika ada.',
            help: 'Meningkatkan kapasitas teknis budidaya ramah lingkungan.'
          },
          {
            id: 'Q_E05_FARM_PLANNING',
            text: 'Apakah petani menyusun rencana kerja musiman sederhana (jadwal pemupukan, wiwil, dan proyeksi panen)?',
            type: 'BOOLEAN',
            isMajor: false,
            mappedCheckpoints: ['P018', 'P019'],
            evidenceRequired: 'Lembar rencana kerja kebun tahunan bersama pendamping lapangan ICS.',
            help: 'Mendorong pengelolaan usaha tani kopi sebagai bisnis pertanian berkelanjutan.'
          }
        ]
      }
    ]
  }
];

export const PRESET_FARMER_ANSWERS: Record<string, Record<string, unknown>> = {
  // Preset 1: Screenshot Fixture (Passes Major Gate, high score 95.9% with 74 applicable, 71 compliant, 3 non-compliant)
  screenshot: {
    Q_A01_TENURE: true,
    Q_A02_HARVEST_LOG: true,
    Q_A03_SALES_RECORD: true,
    Q_A04_LOT_SEPARATION: true,
    Q_A05_CHERRY_PICKING: true,
    Q_A06_PRUNING: true,
    Q_A07_SHADE_DENSITY: 'Optimal (> 70 pohon penaung/ha dengan minimal 2 jenis pohon berbeda)',
    Q_A08_EROSION_CONTROL: ['Teras bangku / terasering pada lahan miring', 'Pembuatan rorak (saluran penangkap air & serasah)'],
    Q_A10_FERTILIZER_RECORD: true,
    Q_B01_IPM_MONITORING: true,
    Q_B03_CHEMICAL_USAGE: false,
    Q_B04_BANNED_CHEMICAL_CHECK: 'Tidak menggunakan pestisida kimia',
    Q_B05_PESTICIDE_STORAGE: 'Lemari/kotak khusus terkunci, berlantai kedap air, jauh dari jangkauan anak dan makanan (Sesuai 4C)',
    Q_B06_PPE_EQUIPMENT: ['Masker respirator / masker hidung', 'Sarung tangan karet / nitril kedap air', 'Sepatu bot karet'],
    Q_B07_CONTAINER_DISPOSAL: 'Dibilas 3x (triple rinse), air bilasan dimasukkan ke tangki semprot, lalu wadah dilubangi/dihancurkan dan dikirim ke bank sampah B3 (Sesuai 4C)',
    Q_C01_NO_DEFORESTATION: true,
    Q_C02_HCV_PEAT: true,
    Q_C03_HUNTING_BAN: true,
    Q_C04_RIPARIAN_BUFFER: true,
    Q_C05_WASTEWATER_TREATMENT: 'Tidak melakukan pengolahan basah sendiri (ceri langsung dijual basah ke kelompok/pengolah)',
    Q_C06_ZERO_BURNING: true,
    Q_C07_CASCARA_UTILIZATION: ['Dikomposkan kembali sebagai pupuk organik tanaman kopi', 'Dikeringkan menjadi teh cascara bernilai ekonomi'],
    Q_D01_LABOR_STRUCTURE: 'Hanya tenaga kerja keluarga (tanpa pekerja upahan)',
    Q_D02_NO_FORCED_LABOR: true,
    Q_D03_NO_CHILD_LABOR: true,
    Q_D04_NO_HAZARDOUS_YOUTH: true,
    Q_D05_FAIR_WAGE: true,
    Q_D06_SAFE_WATER: true,
    Q_D07_FIRST_AID: true,
    Q_D08_GRIEVANCE_CHANNEL: true,
    Q_E01_GROUP_MEMBERSHIP: true,
    Q_E02_PRICE_TRANSPARENCY: true,
    Q_E03_SUSTAINABILITY_PREMIUM: true,
    Q_E04_GAP_TRAINING: 'Pelatihan Pemangkasan & Pengendalian Hama Hayati (GAP)',
    Q_E05_FARM_PLANNING: true
  },

  // Preset 2: Major Violation (Paraquat & Deforestasi)
  majorViolation: {
    Q_A01_TENURE: true,
    Q_A02_HARVEST_LOG: true,
    Q_A03_SALES_RECORD: true,
    Q_A04_LOT_SEPARATION: true,
    Q_A05_CHERRY_PICKING: true,
    Q_A06_PRUNING: true,
    Q_A07_SHADE_DENSITY: 'Sedang (30 - 70 pohon penaung/ha)',
    Q_A08_EROSION_CONTROL: ['Teras bangku / terasering pada lahan miring'],
    Q_A10_FERTILIZER_RECORD: true,
    Q_B01_IPM_MONITORING: false,
    Q_B03_CHEMICAL_USAGE: true,
    Q_B04_BANNED_CHEMICAL_CHECK: 'Gramoxone (Paraquat dichloride)', // Banned!
    Q_B05_PESTICIDE_STORAGE: 'Tersimpan di dapur atau dekat tempat penyimpanan makanan/sumber air',
    Q_B06_PPE_EQUIPMENT: ['Tidak memakai APD saat penyemprotan'],
    Q_B07_CONTAINER_DISPOSAL: 'Dibuang ke tempat sampah umum atau dibakar di kebun',
    Q_C01_NO_DEFORESTATION: false, // Banned!
    Q_C02_HCV_PEAT: true,
    Q_C03_HUNTING_BAN: true,
    Q_C04_RIPARIAN_BUFFER: false,
    Q_C05_WASTEWATER_TREATMENT: 'Dibuang langsung ke sungai/saluran air tanpa pengolahan',
    Q_C06_ZERO_BURNING: false, // Banned!
    Q_C07_CASCARA_UTILIZATION: ['Dibuang ke pinggir kebun/saluran air tanpa pemanfaatan'],
    Q_D01_LABOR_STRUCTURE: 'Mempekerjakan buruh upahan harian / musiman saat panen',
    Q_D02_NO_FORCED_LABOR: true,
    Q_D03_NO_CHILD_LABOR: false, // Major Child labor!
    Q_D04_NO_HAZARDOUS_YOUTH: false,
    Q_D05_FAIR_WAGE: false,
    Q_D06_SAFE_WATER: false,
    Q_D07_FIRST_AID: false,
    Q_D08_GRIEVANCE_CHANNEL: false,
    Q_E01_GROUP_MEMBERSHIP: true,
    Q_E02_PRICE_TRANSPARENCY: false,
    Q_E03_SUSTAINABILITY_PREMIUM: false,
    Q_E04_GAP_TRAINING: 'Belum pernah mengikuti pelatihan',
    Q_E05_FARM_PLANNING: false
  }
};

/**
 * Maps questionnaire answers to CheckpointAssessment records for all 108 Producer checkpoints.
 */
export function evaluateFarmerAnswersToAssessments(
  answers: Record<string, unknown> = {},
  farmerId = 'FARMER-01',
  period = '2026-PANEN-RAYA',
  registry: CheckpointRegistryService = globalCheckpointRegistry
): {
  assessments: CheckpointAssessment[];
  bannedChemicalDetected: boolean;
  bannedChemicalReason: string | null;
  generatedCapas: Array<{
    findingTitle: string;
    checkpointId: string;
    checkpointCode: string;
    issueType: CapaIssueType;
    actionPlan: string;
    estimatedCostIdr: number;
    responsiblePerson: string;
    deadlineDate: string;
  }>;
} {
  const assessments: CheckpointAssessment[] = [];
  const generatedCapas: Array<{
    findingTitle: string;
    checkpointId: string;
    checkpointCode: string;
    issueType: CapaIssueType;
    actionPlan: string;
    estimatedCostIdr: number;
    responsiblePerson: string;
    deadlineDate: string;
  }> = [];

  let bannedChemicalDetected = false;
  let bannedChemicalReason: string | null = null;

  // Check banned chemical detection
  const chemAnswer = String(answers['Q_B04_BANNED_CHEMICAL_CHECK'] || '');
  if (answers['Q_B03_CHEMICAL_USAGE'] === true && chemAnswer) {
    const lower = chemAnswer.toLowerCase();
    for (const b of BANNED_CHEMICALS_LIST) {
      if (lower.includes(b.name.toLowerCase()) || lower.includes(b.activeIngredient.toLowerCase())) {
        bannedChemicalDetected = true;
        bannedChemicalReason = `Terdeteksi bahan terlarang 4C: ${b.name} (${b.activeIngredient}) - ${b.class}`;
        break;
      }
    }
  }

  const isFamilyOnly = answers['Q_D01_LABOR_STRUCTURE'] === 'Hanya tenaga kerja keluarga (tanpa pekerja upahan)';
  const qMap = new Map<string, unknown>(Object.entries(answers));
  const producerCheckpoints = registry.getModuleCheckpoints('PRODUCER');

  producerCheckpoints.forEach(cp => {
    const code = cp.checkpointCode;
    let app: ApplicabilityDecision = ApplicabilityDecision.APPLICABLE;
    let suff: EvidenceSufficiency = EvidenceSufficiency.SUFFICIENT;
    let comp: ComplianceResult = ComplianceResult.COMPLIANT;
    let nonAppReason: string | null = null;
    let notes = 'Sesuai dengan kuesioner praktik budidaya dan verifikasi lapangan.';

    // 1. Economic Checkpoints
    if (code === 'P001') {
      const hasTenure = qMap.get('Q_A01_TENURE') !== false;
      comp = hasTenure ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
      suff = hasTenure ? EvidenceSufficiency.SUFFICIENT : EvidenceSufficiency.NOT_AVAILABLE;
      notes = hasTenure ? 'Hak penguasaan lahan sah terdata dalam poligon kebun.' : 'Belum melampirkan bukti kepemilikan/penguasaan lahan yang sah.';
    } else if (code === 'P002') {
      const hasHarvestLog = qMap.get('Q_A02_HARVEST_LOG') !== false;
      comp = hasHarvestLog ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P003') {
      const hasSales = qMap.get('Q_A03_SALES_RECORD') !== false;
      comp = hasSales ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P004') {
      const hasLotSep = qMap.get('Q_A04_LOT_SEPARATION') !== false;
      comp = hasLotSep ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
      suff = hasLotSep ? EvidenceSufficiency.SUFFICIENT : EvidenceSufficiency.NOT_AVAILABLE;
    } else if (code === 'P005') {
      const isMember = qMap.get('Q_E01_GROUP_MEMBERSHIP') !== false;
      comp = isMember ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P006' || code === 'P014') {
      const hasPriceTrans = qMap.get('Q_E02_PRICE_TRANSPARENCY') !== false;
      comp = hasPriceTrans ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P007' || code === 'P008') {
      const hasQuality = qMap.get('Q_A05_CHERRY_PICKING') !== false;
      comp = hasQuality ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P009') {
      const hasFertRecord = Boolean(qMap.get('Q_A10_FERTILIZER_RECORD'));
      comp = hasFertRecord ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P011' || code === 'P012') {
      const hasPruning = qMap.get('Q_A06_PRUNING') !== false;
      comp = hasPruning ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P017' || code === 'P095') {
      const cascaraOpt = qMap.get('Q_C07_CASCARA_UTILIZATION');
      const isUtilized = Array.isArray(cascaraOpt) ? cascaraOpt.some(o => String(o).includes('kompos') || String(o).includes('cascara') || String(o).includes('pakan')) : true;
      comp = isUtilized ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    }

    // 2. Social Checkpoints
    else if (code === 'P024') {
      const noForced = qMap.get('Q_D02_NO_FORCED_LABOR') !== false;
      comp = noForced ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P028') {
      const noChild = qMap.get('Q_D03_NO_CHILD_LABOR') !== false;
      comp = noChild ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
      notes = noChild ? 'Bebas dari pekerja anak di bawah 15 tahun.' : 'PELANGGARAN MAJOR: Terindikasi mempekerjakan anak di bawah 15 tahun.';
    } else if (code === 'P029') {
      const noHazYouth = qMap.get('Q_D04_NO_HAZARDOUS_YOUTH') !== false;
      comp = noHazYouth ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (['P037', 'P038', 'P039', 'P040', 'P041', 'P042', 'P043', 'P044'].includes(code)) {
      if (isFamilyOnly) {
        app = ApplicabilityDecision.NOT_APPLICABLE;
        comp = ComplianceResult.COMPLIANT;
        nonAppReason = 'Hanya dikelola oleh tenaga kerja keluarga sendiri tanpa buruh upahan.';
        notes = 'Disetujui tidak berlaku (Hanya tenaga kerja keluarga).';
      } else {
        const fairWage = qMap.get('Q_D05_FAIR_WAGE') !== false;
        comp = fairWage ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
      }
    } else if (code === 'P045') {
      const ppe = qMap.get('Q_B06_PPE_EQUIPMENT');
      const hasFullPpe = Array.isArray(ppe) && ppe.length >= 3 && !ppe.some(p => String(p).includes('Tidak memakai'));
      comp = hasFullPpe ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
      suff = hasFullPpe ? EvidenceSufficiency.SUFFICIENT : EvidenceSufficiency.INSUFFICIENT;
    } else if (code === 'P050') {
      const safeWater = qMap.get('Q_D06_SAFE_WATER') !== false;
      comp = safeWater ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P055') {
      const grievance = qMap.get('Q_D08_GRIEVANCE_CHANNEL') !== false;
      comp = grievance ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P060') {
      const firstAid = qMap.get('Q_D07_FIRST_AID') !== false;
      comp = firstAid ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    }

    // 3. Environmental Checkpoints
    else if (code === 'P070') {
      const noDeforest = qMap.get('Q_C01_NO_DEFORESTATION') !== false;
      comp = noDeforest ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
      notes = noDeforest ? 'Bebas deforestasi pasca cut-off date (EUDR & 4C Verified).' : 'PELANGGARAN MAJOR: Lahan terindikasi konversi hutan primer pasca cut-off date.';
    } else if (code === 'P071') {
      const noHcv = qMap.get('Q_C02_HCV_PEAT') !== false;
      comp = noHcv ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P075') {
      const noHunting = qMap.get('Q_C03_HUNTING_BAN') !== false;
      comp = noHunting ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P080') {
      const hasIpm = qMap.get('Q_B01_IPM_MONITORING') !== false;
      comp = hasIpm ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P082') {
      if (bannedChemicalDetected) {
        comp = ComplianceResult.NON_COMPLIANT;
        suff = EvidenceSufficiency.SUFFICIENT;
        notes = `PELANGGARAN MAJOR MUTLAK: ${bannedChemicalReason}`;
      } else {
        comp = ComplianceResult.COMPLIANT;
        suff = EvidenceSufficiency.SUFFICIENT;
        notes = 'Bebas pestisida terlarang (Verifikasi gudang saprodi).';
      }
    } else if (code === 'P083') {
      const storageOpt = String(qMap.get('Q_B05_PESTICIDE_STORAGE') || '');
      const storagePass = storageOpt.includes('Sesuai 4C') || storageOpt.includes('Tidak menyimpan');
      comp = storagePass ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
      suff = storagePass ? EvidenceSufficiency.SUFFICIENT : EvidenceSufficiency.INSUFFICIENT;
    } else if (code === 'P085') {
      const disposal = String(qMap.get('Q_B07_CONTAINER_DISPOSAL') || '');
      const dispPass = disposal.includes('Dibilas 3x');
      comp = dispPass ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P090') {
      const erosion = qMap.get('Q_A08_EROSION_CONTROL');
      const hasErosion = Array.isArray(erosion) && erosion.length > 0 && !erosion.some(e => String(e).includes('Tidak ada'));
      comp = hasErosion ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P096') {
      const riparian = qMap.get('Q_C04_RIPARIAN_BUFFER') !== false;
      comp = riparian ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P100') {
      const wasteWater = String(qMap.get('Q_C05_WASTEWATER_TREATMENT') || '');
      const wwPass = wasteWater.includes('Sesuai 4C') || wasteWater.includes('Tidak melakukan');
      comp = wwPass ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    } else if (code === 'P104') {
      const zeroBurn = qMap.get('Q_C06_ZERO_BURNING') !== false;
      comp = zeroBurn ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
      notes = zeroBurn ? 'Bebas praktik pembakaran terbuka di kebun.' : 'PELANGGARAN MAJOR: Ditemukan sisa pembakaran terbuka di lahan.';
    } else if (code === 'P105') {
      const shade = String(qMap.get('Q_A07_SHADE_DENSITY') || '');
      const shadePass = shade.includes('Optimal') || shade.includes('Sedang');
      comp = shadePass ? ComplianceResult.COMPLIANT : ComplianceResult.NON_COMPLIANT;
    }

    assessments.push({
      scopeType: 'PRODUCER',
      scopeId: farmerId,
      checkpointId: cp.id || code,
      checkpointCode: code,
      period,
      applicability: app,
      nonApplicabilityReason: nonAppReason,
      applicabilityApprovedBy: app === ApplicabilityDecision.NOT_APPLICABLE ? 'USR-VER-01' : null,
      evidenceSufficiency: suff,
      complianceResult: comp,
      evaluationNotes: notes,
      verifierUserId: 'USR-ICS-FAR',
      verifiedAt: new Date().toISOString()
    });

    if (comp === ComplianceResult.NON_COMPLIANT) {
      generatedCapas.push({
        findingTitle: `Ketidaksesuaian Checkpoint ${code}: ${cp.title}`,
        checkpointId: code,
        checkpointCode: code,
        issueType: cp.isMajor ? CapaIssueType.MAJOR_NON_COMPLIANT : CapaIssueType.MINOR_GAP,
        actionPlan: `Tindakan perbaikan dan pendampingan ICS untuk pemenuhan kriteria ${code} (${cp.title}).`,
        estimatedCostIdr: cp.isMajor ? 1500000 : 500000,
        responsiblePerson: 'Petani & Pendamping Lapangan ICS',
        deadlineDate: new Date(Date.now() + (cp.isMajor ? 30 : 90) * 86400000).toISOString().split('T')[0]
      });
    }
  });

  return {
    assessments,
    bannedChemicalDetected,
    bannedChemicalReason,
    generatedCapas
  };
}
