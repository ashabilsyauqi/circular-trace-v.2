import { VerificationChecklistItem } from '../types/coffee';

export type ServiceDomainType = 'farm' | 'harvest' | 'processed' | 'warehouse' | 'roasted' | 'cafe';

export interface ServiceVerificationTemplate {
  domain: ServiceDomainType;
  title: string;
  roleLabel: string;
  standardsBadge: string;
  items: VerificationChecklistItem[];
}

export const VERIFICATION_CHECKLIST_TEMPLATES: Record<ServiceDomainType, ServiceVerificationTemplate> = {
  farm: {
    domain: 'farm',
    title: 'Checklist Audit Legalitas & EUDR Kebun Petani',
    roleLabel: 'Petani (Lahan & Kebun)',
    standardsBadge: 'EUDR Reg. 2023/1115 & GPS Polygon',
    items: [
      {
        id: 'chk_farm_1',
        category: 'Legalitas & Hutan',
        label: 'Bebas Deforestasi (EUDR Deforestation-Free Post-2020)',
        description: 'Lahan tidak berasal dari perambahan hutan lindung atau kawasan konservasi setelah 31 Des 2020.',
        checked: true,
      },
      {
        id: 'chk_farm_2',
        category: 'Geolokasi & Pemetaan',
        label: 'Verifikasi Koordinat Titik Patok Batas & Poligon GPS',
        description: 'Seluruh titik patok fisik di lapangan terdata dengan akurasi GPS sub-meter.',
        checked: true,
      },
      {
        id: 'chk_farm_3',
        category: 'Agroforestri & Lingkungan',
        label: 'Pohon Naungan (Shade-Grown) & Konservasi Tanah',
        description: 'Terdapat minimal 2 varietas pohon naungan alami (sengon, lamtoro, alpukat) penahan erosi.',
        checked: true,
      },
      {
        id: 'chk_farm_4',
        category: 'Praktik Pertanian',
        label: 'Penerapan GAP (Good Agricultural Practices) & Organik',
        description: 'Bebas pestisida kimia sintetis terlarang, penggunaan pupuk organik kompos/kascing.',
        checked: true,
      },
      {
        id: 'chk_farm_5',
        category: 'Kesejahteraan Petani',
        label: 'Kepatuhan Hak Tenaga Kerja & Tanpa Pekerja Anak',
        description: 'Sistem kerja adil sesuai konvensi ILO dan standar sertifikasi keberlanjutan.',
        checked: true,
      },
    ],
  },
  harvest: {
    domain: 'harvest',
    title: 'Checklist Audit Kualitas Panen Ceri Kopi',
    roleLabel: 'Petani (Hasil Panen Ceri)',
    standardsBadge: 'Standar Mutu Ceri Merah Specialty',
    items: [
      {
        id: 'chk_hrv_1',
        category: 'Kemanisan Ceri',
        label: 'Uji Refraktometer Kadar Brix Ceri (Min. 19.0° - 24.0° Brix)',
        description: 'Kandungan gula buah optimal menjamin potensi sweetness dan kompleksitas asam organik.',
        checked: true,
      },
      {
        id: 'chk_hrv_2',
        category: 'Sortasi Warna',
        label: 'Rasio Petik Merah Optimal (Minimal 95%+ Merah Matang)',
        description: 'Bebas ceri hijau (unripe) atau buah busuk (overripe) yang menurunkan mutu.',
        checked: true,
      },
      {
        id: 'chk_hrv_3',
        category: 'Uji Rambang',
        label: 'Uji Apung Rambang Air Bersih (Zero Floaters < 2%)',
        description: 'Ceri lolos uji densitas air; buah berongga atau kopong telah dipisahkan.',
        checked: true,
      },
      {
        id: 'chk_hrv_4',
        category: 'Penanganan Pasca Panen',
        label: 'Waktu Transit Cepat ke Stasiun Pengolahan (< 12 Jam)',
        description: 'Ceri segera dikirim ke mill dalam wadah berventilasi tanpa terjadi fermentasi liar prematur.',
        checked: true,
      },
      {
        id: 'chk_hrv_5',
        category: 'Ketertelusuran',
        label: 'Barcode Identitas Lot Karung Ditempel & Tervalidasi',
        description: 'Label karung goni fisik memuat nomor lot, blok kebun, dan tanggal petik yang valid.',
        checked: true,
      },
    ],
  },
  processed: {
    domain: 'processed',
    title: 'Checklist Audit Pengolahan Basah/Kering (Mill QA)',
    roleLabel: 'Stasiun Pengolah (Wet & Dry Mill)',
    standardsBadge: 'Zero-Waste & SCA Green Coffee Protocol',
    items: [
      {
        id: 'chk_prc_1',
        category: 'Kadar Air Biji',
        label: 'Kadar Air Green Bean Terkalibrasi (10.5% - 12.0%)',
        description: 'Uji moisture meter akurat; biji kering merata pada raised bed / solar dryer.',
        checked: true,
      },
      {
        id: 'chk_prc_2',
        category: 'Aktivitas Air',
        label: 'Water Activity (aW) Aman di Bawah 0.60 aW',
        description: 'Mencegah pertumbuhan jamur ochratoxin A dan mempertahankan stabilitas rasa selama transit.',
        checked: true,
      },
      {
        id: 'chk_prc_3',
        category: 'Defek Biji Hijau',
        label: 'Sortasi Fisik Bebas Cacat Primer (Specialty Grade 1)',
        description: 'Total defect count < 5 per 350 gram sampel biji hijau sesuai standar SCA / SNI.',
        checked: true,
      },
      {
        id: 'chk_prc_4',
        category: 'Sirkularitas Limbah',
        label: 'Pengelolaan Limbah Sirkular (Eco-Processing Zero Waste)',
        description: 'Pulp kulit ceri dikomposkan / diolah cascara; air limbah dinetralkan di kolam fitoremediasi.',
        checked: true,
      },
      {
        id: 'chk_prc_5',
        category: 'Higienitas Mesin',
        label: 'Sanitasi Mesin Pulper, Huller & Lantai Penjemuran',
        description: 'Peralatan dibersihkan rutin dari sisa lendir fermentasi lama untuk mencegah kontaminasi fenol.',
        checked: true,
      },
    ],
  },
  warehouse: {
    domain: 'warehouse',
    title: 'Checklist Audit Pergudangan & Ekspor (Silo QA)',
    roleLabel: 'Gudang & Eksportir Kopi',
    standardsBadge: 'SCA Grading Tier & Hermetic Storage',
    items: [
      {
        id: 'chk_wh_1',
        category: 'Pengemasan Hermetik',
        label: 'Kemasan Penghalang Oksigen (GrainPro / Vacuum / Hermetic)',
        description: 'Green bean disegel kedap udara dengan kantong khusus pencegah penuaan dini biji.',
        checked: true,
      },
      {
        id: 'chk_wh_2',
        category: 'Klimatologi Gudang',
        label: 'Suhu Gudang Terkontrol (18°C - 22°C) & Kelembaban RH 55-65%',
        description: 'Sensor hygrometer & termometer aktif memantau kondisi ruangan selama penyimpanan.',
        checked: true,
      },
      {
        id: 'chk_wh_3',
        category: 'Klasifikasi Ukuran',
        label: 'Verifikasi Ukuran Ayakan (Screen Size 16-18+ Uniformity)',
        description: 'Keseragaman screen size teruji ayakan standar industri untuk konsistensi sangrai optimal.',
        checked: true,
      },
      {
        id: 'chk_wh_4',
        category: 'Sanitasi & Pallet',
        label: 'Penyimpanan di Atas Pallet Kayu Bersertifikasi (ISPM 15)',
        description: 'Jarak dari dinding dan lantai terjaga, bebas kutu gudang (araecerus fasciculatus) dan kapang.',
        checked: true,
      },
      {
        id: 'chk_wh_5',
        category: 'Legalitas Ekspor',
        label: 'Kelengkapan Surat Karantina & Sertifikasi Mutu QA',
        description: 'Memiliki nomor grading resmi dan sertifikat bebas hama untuk jaminan kepuasan roastery.',
        checked: true,
      },
    ],
  },
  roasted: {
    domain: 'roasted',
    title: 'Checklist Audit Sangrai Artisan & Cupping (Roaster QA)',
    roleLabel: 'Artisan Micro-Roastery',
    standardsBadge: 'SCA Cupping 80+ Specialty Certified',
    items: [
      {
        id: 'chk_rst_1',
        category: 'Skor Sensori SCA',
        label: 'SCA Cupping Score Minimal 80.0+ (Specialty Grade)',
        description: '10 atribut sensori (Aroma, Flavor, Aftertaste, Acidity, Body, Balance, Clean, Sweet) teruji.',
        checked: true,
      },
      {
        id: 'chk_rst_2',
        category: 'Keseragaman Warna',
        label: 'Tingkat Kematangan Biji Terkalibrasi (Agtron Gourmet / Commercial)',
        description: 'Warna luar dan dalam biji selaras tanpa cacat baking, tipping, atau facing.',
        checked: true,
      },
      {
        id: 'chk_rst_3',
        category: 'Waktu Pengembangan',
        label: 'Development Time Ratio (DTR) Ideal (12% - 18%)',
        description: 'Profil kurva RoR (Rate of Rise) mulus menghasilkan profil rasa optimal tanpa rasa grassy.',
        checked: true,
      },
      {
        id: 'chk_rst_4',
        category: 'Kemasan & Degassing',
        label: 'Kemasan Standar Aluminium Foil dengan Katup One-Way Valve',
        description: 'Melindungi biji dari sinar UV dan oksidasi sambil memfasilitasi pelepasan gas CO2.',
        checked: true,
      },
      {
        id: 'chk_rst_5',
        category: 'Petunjuk Seduh',
        label: 'Rekomendasi Resting (Hari) & Profil Seduhan Jelas',
        description: 'Konsumen diberikan panduan tanggal sangrai, masa resting, dan metode seduh terbaik.',
        checked: true,
      },
    ],
  },
  cafe: {
    domain: 'cafe',
    title: 'Checklist Audit Barista & Penyajian Kedai (Cafe QA)',
    roleLabel: 'Cafe & Kedai Kopi',
    standardsBadge: 'Food Safety & Barista Extraction Standards',
    items: [
      {
        id: 'chk_cfe_1',
        category: 'Kalibrasi Seduh',
        label: 'Kalibrasi Dialing-In Espresso & Rasio Seduh Harian',
        description: 'Suhu air 92-96°C, tekanan 9 bar, dan yield rasio ekstraksi terukur refractometer TDS.',
        checked: true,
      },
      {
        id: 'chk_cfe_2',
        category: 'Kualitas Air',
        label: 'Kimia Air Seduhan Terfiltrasi (TDS 100-150 ppm, pH Netral)',
        description: 'Sistem reverse osmosis / mineral filter menjaga keseimbangan ekstraksi asam dan manis.',
        checked: true,
      },
      {
        id: 'chk_cfe_3',
        category: 'Kesegaran Biji',
        label: 'Rotasi Biji FIFO (First-In, First-Out) 7 - 45 Hari Pasca Sangrai',
        description: 'Biji kopi berada pada puncak rasa terbaik (peak freshness), tidak tengik.',
        checked: true,
      },
      {
        id: 'chk_cfe_4',
        category: 'Keamanan Pangan',
        label: 'Sanitasi Mesin Kopi, Steam Wand & Kebersihan Bar',
        description: 'Pembersihan kimia food-grade berkala untuk mencegah residu minyak kopi basi dan susu.',
        checked: true,
      },
      {
        id: 'chk_cfe_5',
        category: 'Transparansi Pelanggan',
        label: 'Akses Barcode Silsilah Kopi di Meja / Gelas Pengunjung',
        description: 'Pelanggan dapat men-scan stiker cangkir untuk melihat petani dan sejarah biji yang diminum.',
        checked: true,
      },
    ],
  },
};
