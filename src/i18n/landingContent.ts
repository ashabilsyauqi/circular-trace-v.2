import type { UserRole } from '../types/coffee';

export type LandingLanguage = 'id' | 'en';

interface PipelineStage {
  step: number;
  role: UserRole;
  title: string;
  actor: string;
  badge: string;
  metric: string;
  desc: string;
  color: string;
  tagColor: string;
  lotCode: string;
}

interface ServicePanelRow {
  label: string;
  value: string;
}

interface ServicePanel {
  badge: string;
  title: string;
  desc: string;
  bullets: [string, string, string];
  ctaOpen: string;
  ctaRegister: string;
  previewTitle: string;
  previewRows: ServicePanelRow[];
}

interface AdvantageCard {
  title: string;
  desc: string;
  footer: string;
}

interface BackgroundPillar {
  title: string;
  desc: string;
}

interface CtaRoleCard {
  role: UserRole;
  name: string;
  desc: string;
  registerLabel: string;
}

interface Faq {
  q: string;
  a: string;
}

export interface LandingContent {
  hero: {
    pillLabel: string;
    circularTag: string;
    titlePart1: string;
    titleHighlight: string;
    titlePart2: string;
    subtitlePre: string;
    subtitleStrong1: string;
    subtitleMid: string;
    subtitleStrong2: string;
    subtitleEnd: string;
    ctaRegister: string;
    ctaMarketplace: string;
    ctaLedger: string;
    trust1: string;
    trust2: string;
    trust3: string;
    stats: { value: string; label: string }[];
    pipeline: {
      simulatorLabel: string;
      title: string;
      statusLabel: string;
      statusValue: string;
      stepLabel: (n: number) => string;
      stagePrefix: string;
      accessTitle: string;
      accessSubtitle: string;
      tryPanelPrefix: string;
    };
  };
  pipelineStages: PipelineStage[];
  servicesHeader: {
    badge: string;
    title: string;
    subtitle: string;
  };
  roleTabs: { id: UserRole; label: string }[];
  servicePanels: Record<UserRole, ServicePanel>;
  advantages: {
    badge: string;
    title: string;
    subtitle: string;
    cards: AdvantageCard[];
  };
  background: {
    badge: string;
    title: string;
    para1Pre: string;
    para1Strong: string;
    para1Post: string;
    para2Rest: string;
    pillars: [BackgroundPillar, BackgroundPillar];
    storyTitle: string;
    storyTag: string;
    quote: string;
    statCarbonLabel: string;
    statCarbonValue: string;
    statPartnerLabel: string;
    statPartnerValue: string;
  };
  cta: {
    badge: string;
    title: string;
    subtitle: string;
    roleCards: CtaRoleCard[];
    bannerTitle: string;
    bannerDesc: string;
    bannerBtn: string;
    faqTitle: string;
  };
  faqs: Faq[];
}

const idPipelineStages: PipelineStage[] = [
  {
    step: 1,
    role: 'petani',
    title: 'Panen Ceri Petik Merah',
    actor: 'Pak Asep (Petani Pangalengan)',
    badge: 'Kebun Kopi • 1.550 mdpl',
    metric: 'Brix 22.4°Bx • 98% Petik Merah',
    desc: 'Pencatatan varietas Ateng Super & Sigarar Utang langsung dari lereng timur kebun.',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-300',
    tagColor: 'bg-emerald-500 text-white',
    lotCode: 'LOT-PTN-001',
  },
  {
    step: 2,
    role: 'pengolah',
    title: 'Eco-Processing & Fermentasi',
    actor: 'CV Malabar Wet Mill Station',
    badge: 'Anaerobic Natural • Eco 5.0★',
    metric: 'Kadar Air 11.2% • Aw 0.58',
    desc: 'Fermentasi 72 jam terkontrol dan pemanfaatan 100% limbah pulp menjadi pupuk kompos & cascara.',
    color: 'text-amber-600 bg-amber-50 border-amber-300',
    tagColor: 'bg-amber-500 text-stone-950',
    lotCode: 'LOT-GB-001',
  },
  {
    step: 3,
    role: 'gudang',
    title: 'Warehouse Storage & SCA QA',
    actor: 'PT Nusantara Green Bean Warehouse',
    badge: 'GrainPro Hermetik • 20°C / RH 55%',
    metric: 'SCA Score: 87.25 • Grade 1 Super',
    desc: 'Penyimpanan terstandarisasi untuk menjaga stabilitas organoleptik biji kopi specialty.',
    color: 'text-blue-600 bg-blue-50 border-blue-300',
    tagColor: 'bg-blue-500 text-white',
    lotCode: 'LOT-WH-001',
  },
  {
    step: 4,
    role: 'roaster',
    title: 'Artisan Roasting Intelligence',
    actor: 'Karsa Craft Roastery',
    badge: 'Light-Medium • Agtron 65',
    metric: 'DTR 14.8% • First Crack @ 08:30',
    desc: 'Penyangraian presisi dengan sensoris spider chart 8 parameter dan rekomendasi resting 7 hari.',
    color: 'text-orange-600 bg-orange-50 border-orange-300',
    tagColor: 'bg-orange-500 text-white',
    lotCode: 'LOT-ROAST-001',
  },
  {
    step: 5,
    role: 'cafe',
    title: 'Specialty Cup & QR Story',
    actor: 'Seduh Teduh Specialty Coffee',
    badge: 'Filter V60 • Single Origin',
    metric: '100% Traceability ke Konsumen',
    desc: 'Pelanggan memindai QR Code di cangkir untuk melihat seluruh perjalanan terroir dari kebun Pak Asep.',
    color: 'text-stone-700 bg-stone-100 border-stone-300',
    tagColor: 'bg-stone-900 text-amber-400',
    lotCode: 'CUP-TEDUH-2026',
  },
];

const enPipelineStages: PipelineStage[] = [
  {
    step: 1,
    role: 'petani',
    title: 'Red-Ripe Cherry Harvest',
    actor: "Pak Asep (Pangalengan Farmer)",
    badge: 'Coffee Farm • 1,550 masl',
    metric: '22.4°Bx Brix • 98% Red-Ripe Picking',
    desc: "Recording of Ateng Super & Sigarar Utang varieties straight from the farm's eastern slope.",
    color: 'text-emerald-600 bg-emerald-50 border-emerald-300',
    tagColor: 'bg-emerald-500 text-white',
    lotCode: 'LOT-PTN-001',
  },
  {
    step: 2,
    role: 'pengolah',
    title: 'Eco-Processing & Fermentation',
    actor: 'CV Malabar Wet Mill Station',
    badge: 'Anaerobic Natural • Eco 5.0★',
    metric: '11.2% Moisture • 0.58 Aw',
    desc: '72-hour controlled fermentation with 100% of pulp waste converted into compost fertilizer & cascara.',
    color: 'text-amber-600 bg-amber-50 border-amber-300',
    tagColor: 'bg-amber-500 text-stone-950',
    lotCode: 'LOT-GB-001',
  },
  {
    step: 3,
    role: 'gudang',
    title: 'Warehouse Storage & SCA QA',
    actor: 'PT Nusantara Green Bean Warehouse',
    badge: 'GrainPro Hermetic • 20°C / 55% RH',
    metric: 'SCA Score: 87.25 • Grade 1 Specialty',
    desc: 'Standardized storage to preserve the organoleptic stability of specialty green beans.',
    color: 'text-blue-600 bg-blue-50 border-blue-300',
    tagColor: 'bg-blue-500 text-white',
    lotCode: 'LOT-WH-001',
  },
  {
    step: 4,
    role: 'roaster',
    title: 'Artisan Roasting Intelligence',
    actor: 'Karsa Craft Roastery',
    badge: 'Light-Medium • Agtron 65',
    metric: 'DTR 14.8% • First Crack @ 08:30',
    desc: 'Precision roasting with an 8-parameter sensory spider chart and a 7-day resting recommendation.',
    color: 'text-orange-600 bg-orange-50 border-orange-300',
    tagColor: 'bg-orange-500 text-white',
    lotCode: 'LOT-ROAST-001',
  },
  {
    step: 5,
    role: 'cafe',
    title: 'Specialty Cup & QR Story',
    actor: 'Seduh Teduh Specialty Coffee',
    badge: 'V60 Filter • Single Origin',
    metric: '100% Traceability to the Consumer',
    desc: "Customers scan the QR code on their cup to see the full terroir journey from Pak Asep's farm.",
    color: 'text-stone-700 bg-stone-100 border-stone-300',
    tagColor: 'bg-stone-900 text-amber-400',
    lotCode: 'CUP-TEDUH-2026',
  },
];

const idServicePanels: Record<UserRole, ServicePanel> = {
  petani: {
    badge: 'Pilar 1: Hulu Pertanian & Panen',
    title: 'Digitalisasi Panen Ceri Kopi dari Lereng Kebun',
    desc: 'Petani dapat mendokumentasikan hasil panen dengan parameter ilmiah: elevasi mdpl, varietas pohon (Typica, Ateng, Sigarar Utang), tingkat kemanisan buah (Brix 20°Bx+), serta metode petik merah 98% untuk mendapatkan harga jual optimal.',
    bullets: [
      'Pencatatan batch panen instan dan otomatis terbit ID Lot Unik.',
      'Penjualan langsung ke stasiun pengolah mill tanpa potongan tengkulak.',
      'Cetak kartu barcode fisik untuk ditempel pada karung ceri segar.',
    ],
    ctaOpen: 'Buka Panel Petani',
    ctaRegister: 'Daftar Kelompok Tani',
    previewTitle: 'Preview Kartu Lot Panen Petani',
    previewRows: [
      { label: 'Nama Petani', value: 'Asep Supriatna' },
      { label: 'Lokasi Kebun', value: 'Pangalengan, Gn. Tilu (1.550 mdpl)' },
      { label: 'Varietas Terpilih', value: 'Ateng Super & Sigarar Utang' },
      { label: 'Kadar Gula Buah', value: '22.4 °Brix (Optimal)' },
      { label: 'Kualitas Petik', value: 'Petik Merah Optimal (98%)' },
    ],
  },
  pengolah: {
    badge: 'Pilar 2: Wet & Dry Mill Station',
    title: 'Manajemen Fermentasi & Eco-Processing Sirkular',
    desc: 'Stasiun pengolahan dapat mencatat metode proses (Full Washed, Natural, Honey, Anaerobic, Wine), mengontrol kadar air (10-12%), water activity, defect count, serta mencatat pemanfaatan 100% limbah organik ceri.',
    bullets: [
      'Konversi bobot ceri ke green bean terukur dengan rasio rendemen akurat.',
      'Pencatatan alokasi limbah cascara dan pupuk kompos bersertifikat Zero Waste.',
      'Kalkulasi rating Eco-Rating 5.0 bintang untuk daya tarik pembeli green bean.',
    ],
    ctaOpen: 'Buka Panel Pengolah',
    ctaRegister: 'Daftar Stasiun Mill',
    previewTitle: 'Spesifikasi Green Bean Olahan',
    previewRows: [
      { label: 'Metode Proses', value: 'Anaerobic Natural (72 Jam)' },
      { label: 'Kadar Air & Water Activity', value: '11.2% Moisture • 0.58 Aw' },
      { label: 'Defect Count', value: '0 Defect (Specialty Grade 1)' },
      { label: 'Eco-Rating Sirkular', value: '★★★★★ 5.0 (Zero Waste Standard)' },
      { label: 'Pemanfaatan Limbah', value: 'Teh Cascara & Kompos Organik Kebun' },
    ],
  },
  gudang: {
    badge: 'Pilar 3: Pergudangan & Quality Assurance',
    title: 'Gudang Iklim Terkendali & Sertifikasi Skor Cupping SCA',
    desc: 'Pengelola gudang menjaga integritas green bean dengan monitoring suhu dan kelembaban (RH), kemasan hermetik GrainPro, serta verifikasi skor cupping SCA dan pembagian grade tier komoditas.',
    bullets: [
      'Manajemen stok gudang dengan perlindungan kemasan hermetik GrainPro.',
      'Audit dan verifikasi skor cupping SCA terakreditasi (85+ Specialty).',
      'Penyaluran green bean tersertifikasi langsung ke roastery di seluruh Indonesia.',
    ],
    ctaOpen: 'Buka Panel Gudang',
    ctaRegister: 'Daftar Fasilitas Gudang',
    previewTitle: 'Status Inventaris Gudang',
    previewRows: [
      { label: 'Kondisi Ruang Gudang', value: '20°C Suhu • 55% Kelembaban RH' },
      { label: 'Tipe Kemasan', value: 'GrainPro Hermetic Sealed' },
      { label: 'Skor Cupping SCA Terverifikasi', value: '87.25 (Specialty Grade 1)' },
      { label: 'Tasting Notes Karakteristik', value: 'Bergamot, Peach, Honeycomb' },
      { label: 'Status Ketersediaan', value: 'Ready Stock (Siap Kirim ke Roaster)' },
    ],
  },
  roaster: {
    badge: 'Pilar 4: Artisan Roastery ERP',
    title: 'Presisi Profil Sangrai, Spider Radar, & sangrAI',
    desc: 'Roastery dapat mengelola jadwal Work Order sangrai, menautkan nomor warna Agtron, rasio DTR, sensory spider radar 8 dimensi, serta mendapatkan bantuan formulasi rasa dari asisten cerdas sangrAI.',
    bullets: [
      'Simulator kurva sangrai interaktif (Rate of Rise / RoR & First Crack).',
      'Spider radar sensoris 8 aspek (Fragrance, Flavor, Acidity, Body, dll).',
      'Manajemen kemasan retail 250g / 1kg dan rekomendasi waktu resting seduh.',
    ],
    ctaOpen: 'Buka Panel Roastery',
    ctaRegister: 'Daftar Roastery',
    previewTitle: 'Spesifikasi Batch Sangrai',
    previewRows: [
      { label: 'Tingkat Sangrai (Roast Level)', value: 'Light to Medium (Filter Profile)' },
      { label: 'Agtron Scale & DTR', value: 'Agtron 65 • DTR 14.8%' },
      { label: 'Catatan Rasa Sensoris', value: 'Jasmine, Blueberry, Brown Sugar' },
      { label: 'Rekomendasi Resting', value: '7 - 14 Hari Pasca Sangrai' },
      { label: 'Rekomendasi Metode Seduh', value: 'V60, Origami, Aeropress' },
    ],
  },
  cafe: {
    badge: 'Pilar 5: Cafe, Barista, & Konsumen Akhir',
    title: 'Smart POS, Cetak Label Barcode, & Kisah Asal-Usul Kopi',
    desc: 'Pemilik cafe dapat menyajikan kopi dengan nilai tambah cerita autentik. Barista dapat mencetak label stiker barcode/QR untuk setiap cangkir atau kantong biji kopi ritel yang dipesan pelanggan.',
    bullets: [
      'Generator QR Code cangkir seduh instan untuk edukasi penikmat kopi.',
      'Manajemen stok biji kopi kedai dan ritel beans kemasan konsumen.',
      'Membangun loyalitas pelanggan melalui transparansi direct trade nyata.',
    ],
    ctaOpen: 'Buka Panel Cafe',
    ctaRegister: 'Daftar Kedai Kopi',
    previewTitle: 'Passport QR Cup Konsumen',
    previewRows: [
      { label: 'Menu Minuman', value: 'Manual Brew Filter V60' },
      { label: 'Asal Biji (Single Origin)', value: 'Gunung Tilu Pangalengan' },
      { label: 'Petani & Ketinggian', value: 'Asep Supriatna (1.550 mdpl)' },
      { label: 'Roastery Sangrai', value: 'Karsa Craft Roastery' },
      { label: 'Scan QR Terintegrasi', value: '✓ Siap Ditampilkan ke Ponsel Pelanggan' },
    ],
  },
  verifikator: {
    badge: 'Pilar 6: Dewan Verifikator & Kualitas',
    title: 'Audit Standar Mutu, Cupping Sensori & Stempel Resmi',
    desc: 'Auditor spesialis memverifikasi kepatuhan regulasi EUDR bebas deforestasi lahan, standar eco-processing stasiun mill, penyimpanan gudang hermetik, uji cicip cangkir (cupping) SCA pada biji sangrai, dan menerbitkan stempel sertifikasi ber-tanda tangan kriptografis.',
    bullets: [
      'Audit batas lahan GPS & verifikasi kepatuhan EUDR anti-deforestasi.',
      'Uji cicip sensori cangkir (SCA Cupping Lab) 10 atribut untuk biji sangrai.',
      'Penerbitan sertifikat digital resmi ber-hash tanda tangan SHA-256.',
    ],
    ctaOpen: 'Buka Panel Verifikator',
    ctaRegister: 'Masuk sebagai Auditor',
    previewTitle: 'Sertifikat Verifikasi Mutu',
    previewRows: [
      { label: 'Tipe Audit', value: 'SCA Cupped & Certified Specialty Roast' },
      { label: 'Nomor Sertifikat', value: 'CERT-CQI-QGRADER-2026-8841' },
      { label: 'Hasil Evaluasi', value: '87.50 SCA Score (Specialty Grade)' },
      { label: 'Auditor Penanggung Jawab', value: 'Jessica Tan, CQI Q-Grader' },
      { label: 'Tanda Tangan Digital', value: 'SHA256 Validated • Terotentikasi' },
    ],
  },
};

const enServicePanels: Record<UserRole, ServicePanel> = {
  petani: {
    badge: 'Pillar 1: Upstream Farming & Harvest',
    title: 'Digitizing the Coffee Cherry Harvest from the Farm Slope',
    desc: 'Farmers can document their harvest with scientific parameters: elevation (masl), tree variety (Typica, Ateng, Sigarar Utang), fruit sweetness (20°Bx+ Brix), and 98% red-ripe picking to secure the optimal selling price.',
    bullets: [
      'Instant harvest batch recording with an automatically issued Unique Lot ID.',
      'Direct sales to mill processing stations, with no middleman cut.',
      'Print physical barcode cards to attach to fresh cherry sacks.',
    ],
    ctaOpen: 'Open Farmer Panel',
    ctaRegister: 'Register Farmer Group',
    previewTitle: 'Farmer Harvest Lot Card Preview',
    previewRows: [
      { label: 'Farmer Name', value: 'Asep Supriatna' },
      { label: 'Farm Location', value: 'Pangalengan, Mt. Tilu (1,550 masl)' },
      { label: 'Selected Varieties', value: 'Ateng Super & Sigarar Utang' },
      { label: 'Fruit Sugar Content', value: '22.4 °Brix (Optimal)' },
      { label: 'Picking Quality', value: 'Optimal Red-Ripe Picking (98%)' },
    ],
  },
  pengolah: {
    badge: 'Pillar 2: Wet & Dry Mill Station',
    title: 'Fermentation Management & Circular Eco-Processing',
    desc: 'Processing stations can record the processing method (Full Washed, Natural, Honey, Anaerobic, Wine), control moisture content (10-12%), water activity, defect count, and track 100% utilization of organic cherry waste.',
    bullets: [
      'Accurate cherry-to-green-bean weight conversion with precise yield ratios.',
      'Recording of certified Zero Waste cascara and compost fertilizer allocation.',
      'Automatic 5.0-star Eco-Rating calculation to attract green bean buyers.',
    ],
    ctaOpen: 'Open Processor Panel',
    ctaRegister: 'Register Mill Station',
    previewTitle: 'Processed Green Bean Specification',
    previewRows: [
      { label: 'Processing Method', value: 'Anaerobic Natural (72 Hours)' },
      { label: 'Moisture & Water Activity', value: '11.2% Moisture • 0.58 Aw' },
      { label: 'Defect Count', value: '0 Defects (Specialty Grade 1)' },
      { label: 'Circular Eco-Rating', value: '★★★★★ 5.0 (Zero Waste Standard)' },
      { label: 'Waste Utilization', value: 'Cascara Tea & Farm Organic Compost' },
    ],
  },
  gudang: {
    badge: 'Pillar 3: Warehousing & Quality Assurance',
    title: 'Climate-Controlled Warehouses & SCA Cupping Score Certification',
    desc: 'Warehouse managers preserve green bean integrity through temperature and humidity (RH) monitoring, GrainPro hermetic packaging, and verified SCA cupping scores with commodity grade tiering.',
    bullets: [
      'Warehouse stock management protected by GrainPro hermetic packaging.',
      'Audit and verification of accredited SCA cupping scores (85+ Specialty).',
      'Distribution of certified green beans directly to roasteries across Indonesia.',
    ],
    ctaOpen: 'Open Warehouse Panel',
    ctaRegister: 'Register Warehouse Facility',
    previewTitle: 'Warehouse Inventory Status',
    previewRows: [
      { label: 'Warehouse Room Conditions', value: '20°C Temperature • 55% RH Humidity' },
      { label: 'Packaging Type', value: 'GrainPro Hermetic Sealed' },
      { label: 'Verified SCA Cupping Score', value: '87.25 (Specialty Grade 1)' },
      { label: 'Characteristic Tasting Notes', value: 'Bergamot, Peach, Honeycomb' },
      { label: 'Availability Status', value: 'Ready Stock (Ready to Ship to Roaster)' },
    ],
  },
  roaster: {
    badge: 'Pillar 4: Artisan Roastery ERP',
    title: 'Precision Roast Profiling, Spider Radar & sangrAI',
    desc: 'Roasteries can manage roasting Work Order schedules, log Agtron color numbers, DTR ratios, an 8-dimension sensory spider radar, and get flavor formulation help from the sangrAI smart assistant.',
    bullets: [
      'Interactive roast curve simulator (Rate of Rise / RoR & First Crack).',
      '8-aspect sensory spider radar (Fragrance, Flavor, Acidity, Body, and more).',
      'Retail packaging management (250g / 1kg) and brew resting time recommendations.',
    ],
    ctaOpen: 'Open Roastery Panel',
    ctaRegister: 'Register Roastery',
    previewTitle: 'Roast Batch Specification',
    previewRows: [
      { label: 'Roast Level', value: 'Light to Medium (Filter Profile)' },
      { label: 'Agtron Scale & DTR', value: 'Agtron 65 • DTR 14.8%' },
      { label: 'Sensory Flavor Notes', value: 'Jasmine, Blueberry, Brown Sugar' },
      { label: 'Resting Recommendation', value: '7 - 14 Days Post-Roast' },
      { label: 'Recommended Brew Methods', value: 'V60, Origami, Aeropress' },
    ],
  },
  cafe: {
    badge: 'Pillar 5: Cafe, Barista & End Consumer',
    title: 'Smart POS, Barcode Label Printing & Coffee Origin Stories',
    desc: 'Cafe owners can serve coffee with the added value of an authentic story. Baristas can print barcode/QR stickers for every cup or retail bean bag ordered by customers.',
    bullets: [
      'Instant brew-cup QR code generator to educate coffee lovers.',
      'Inventory management for cafe and retail consumer-packaged beans.',
      'Build customer loyalty through genuine direct-trade transparency.',
    ],
    ctaOpen: 'Open Cafe Panel',
    ctaRegister: 'Register Coffee Shop',
    previewTitle: 'Consumer QR Cup Passport',
    previewRows: [
      { label: 'Drink Menu', value: 'Manual Brew Filter V60' },
      { label: 'Bean Origin (Single Origin)', value: 'Gunung Tilu, Pangalengan' },
      { label: 'Farmer & Elevation', value: 'Asep Supriatna (1,550 masl)' },
      { label: 'Roasted By', value: 'Karsa Craft Roastery' },
      { label: 'Integrated QR Scan', value: "✓ Ready to Show on Customer's Phone" },
    ],
  },
  verifikator: {
    badge: 'Pillar 6: Quality Verification & Audit Board',
    title: 'Quality Standards Audit, Sensory Cupping & Official Stamp',
    desc: 'Specialist auditors verify deforestation-free EUDR farm compliance, zero-waste mill eco-processing standards, hermetic warehouse storage, SCA sensory cup tasting on roasted beans, and issue cryptographically signed digital certification stamps.',
    bullets: [
      'GPS farm boundary audit & anti-deforestation EUDR compliance verification.',
      'Sensory cup tasting (SCA Cupping Lab) evaluating 10 specialty attributes.',
      'Official digital certificate issuance with SHA-256 cryptographic signatures.',
    ],
    ctaOpen: 'Open Verifier Panel',
    ctaRegister: 'Sign In as Auditor',
    previewTitle: 'Quality Certification Certificate',
    previewRows: [
      { label: 'Audit Type', value: 'SCA Cupped & Certified Specialty Roast' },
      { label: 'Certificate Number', value: 'CERT-CQI-QGRADER-2026-8841' },
      { label: 'Evaluation Result', value: '87.50 SCA Score (Specialty Grade)' },
      { label: 'Lead Auditor', value: 'Jessica Tan, CQI Q-Grader' },
      { label: 'Digital Signature', value: 'SHA256 Validated • Authenticated' },
    ],
  },
};

const idAdvantageCards: AdvantageCard[] = [
  {
    title: '1. 100% End-to-End Lot Traceability',
    desc: 'Setiap karung dan cangkir memiliki identitas unik yang dapat dilacak balik hingga ke koordinat kebun, tanggal panen, profil sangrai, dan varietas pohon.',
    footer: 'Transparansi tanpa manipulasi data',
  },
  {
    title: '2. Circular Economy & Eco-Rating',
    desc: 'Modul pelacakan pemanfaatan limbah kulit ceri (pulp) menjadi teh cascara dan pupuk kompos organik, mengurangi emisi karbon dan menjaga kesuburan tanah.',
    footer: 'Audit sertifikat Zero Waste 5.0★',
  },
  {
    title: '3. Sensory Spider Radar 8 Dimensi',
    desc: 'Visualisasi interaktif profil sensori standar SCA (Aroma, Flavor, Acidity, Body, Sweetness, Clean Cup, Balance, Aftertaste) yang langsung tersambung ke setiap lot.',
    footer: 'Standar cupping 100 poin internasional',
  },
  {
    title: '4. Multi-Role B2B Marketplace Terpadu',
    desc: 'Katalog pasar terintegrasi untuk 4 komoditas (Ceri Kopi, Green Bean Mill, Pergudangan Green Bean, & Roasted Bean Sangrai) dengan auto-ledger transaksi instan.',
    footer: 'Perdagangan langsung tanpa perantara gelap',
  },
  {
    title: '5. Kontrol Iklim & Kemasan GrainPro',
    desc: 'Parameter suhu 20°C, kelembaban RH 55%, kadar air 10-12%, dan water activity $A_w \\le 0.60$ dipantau untuk menjaga kesegaran biji kopi hijau hingga 12 bulan.',
    footer: 'Zero mold & zero moisture defect',
  },
  {
    title: '6. sangrAI & Roaster Intelligence',
    desc: 'Asisten AI cerdas untuk menghitung rasio susut (shrinkage), rekomendasi waktu resting beans, formulasi Agtron roast profile, serta panduan seduh presisi.',
    footer: 'Otomatisasi konsistensi batch sangrai',
  },
];

const enAdvantageCards: AdvantageCard[] = [
  {
    title: '1. 100% End-to-End Lot Traceability',
    desc: 'Every sack and cup carries a unique identity that can be traced back to farm coordinates, harvest date, roast profile, and tree variety.',
    footer: 'Transparency with no data manipulation',
  },
  {
    title: '2. Circular Economy & Eco-Rating',
    desc: 'A tracking module that turns cherry skin (pulp) waste into cascara tea and organic compost, cutting carbon emissions and preserving soil fertility.',
    footer: 'Audited Zero Waste 5.0★ certification',
  },
  {
    title: '3. 8-Dimension Sensory Spider Radar',
    desc: 'Interactive visualization of SCA-standard sensory profiles (Aroma, Flavor, Acidity, Body, Sweetness, Clean Cup, Balance, Aftertaste) linked directly to each lot.',
    footer: 'International 100-point cupping standard',
  },
  {
    title: '4. Unified Multi-Role B2B Marketplace',
    desc: 'An integrated market catalog for 4 commodities (Coffee Cherry, Mill Green Bean, Warehouse Green Bean, & Roasted Bean) with instant auto-ledger transactions.',
    footer: 'Direct trade with no hidden middlemen',
  },
  {
    title: '5. Climate Control & GrainPro Packaging',
    desc: 'A 20°C temperature, 55% RH humidity, 10-12% moisture content, and water activity $A_w \\le 0.60$ are monitored to keep green beans fresh for up to 12 months.',
    footer: 'Zero mold & zero moisture defects',
  },
  {
    title: '6. sangrAI & Roaster Intelligence',
    desc: 'A smart AI assistant that calculates shrinkage ratios, recommends bean resting time, formulates Agtron roast profiles, and offers precision brewing guidance.',
    footer: 'Automated consistency across roast batches',
  },
];

const idCtaRoleCards: CtaRoleCard[] = [
  { role: 'petani', name: 'Petani Kopi', desc: 'Upload panen ceri & jual langsung ke mill', registerLabel: 'Daftar Petani' },
  { role: 'pengolah', name: 'Pengolah Mill', desc: 'Fermentasi, uji mutu & kelola limbah sirkular', registerLabel: 'Daftar Pengolah' },
  { role: 'gudang', name: 'Gudang & QA', desc: 'Kelola stok gudang GrainPro & sertifikasi SCA', registerLabel: 'Daftar Gudang' },
  { role: 'roaster', name: 'Artisan Roastery', desc: 'Work order, kurva Agtron & sangrAI', registerLabel: 'Daftar Artisan' },
  { role: 'cafe', name: 'Pemilik Cafe', desc: 'Beli roasted beans & cetak QR cup seduh', registerLabel: 'Daftar Pemilik' },
];

const enCtaRoleCards: CtaRoleCard[] = [
  { role: 'petani', name: 'Coffee Farmer', desc: 'Upload cherry harvests & sell directly to the mill', registerLabel: 'Register as Farmer' },
  { role: 'pengolah', name: 'Mill Processor', desc: 'Fermentation, quality testing & circular waste management', registerLabel: 'Register as Processor' },
  { role: 'gudang', name: 'Warehouse & QA', desc: 'Manage GrainPro warehouse stock & SCA certification', registerLabel: 'Register Warehouse' },
  { role: 'roaster', name: 'Artisan Roastery', desc: 'Work orders, Agtron curves & sangrAI', registerLabel: 'Register as Roastery' },
  { role: 'cafe', name: 'Cafe Owner', desc: 'Buy roasted beans & print QR brew cups', registerLabel: 'Register as Owner' },
];

const idFaqs: Faq[] = [
  {
    q: 'Apa itu sangrAI?',
    a: 'sangrAI adalah platform sistem informasi rantai pasok kopi hulu-ke-hilir yang mengintegrasikan perdagangan B2B, pelacakan lot digital (Lot Traceability), standarisasi sensoris SCA, hingga manajemen limbah sirkular (Zero-Waste Eco-Processing).',
  },
  {
    q: 'Bagaimana cara kerja QR Traceability untuk konsumen cafe?',
    a: 'Setiap lot roasted bean yang diseduh di cafe menghasilkan kode unik. Barista mencetak stiker QR untuk cangkir atau kemasan ritel. Konsumen cukup memindai dengan kamera ponsel untuk membaca riwayat petani, ketinggian kebun, profil fermentasi, kurva sangrai, hingga uji rasa.',
  },
  {
    q: 'Apa manfaat modul Circular Economy & Eco-Rating bagi Pengolah (Mill)?',
    a: 'Modul ini mencatat pengalihan limbah organik ceri kopi (kulit/pulp dan air fermentasi) menjadi produk bernilai tambah seperti teh cascara, briket arang, dan pupuk kompos organik. Sistem secara otomatis menghitung skor Eco-Rating dan estimasi reduksi karbon.',
  },
  {
    q: 'Apakah roastery dapat menggunakan simulator kurva dan formulasi rasa AI?',
    a: 'Ya, modul Roaster ERP kami dilengkapi simulator profil sangrai (Agtron, DTR, RoR), radar sensori 8 parameter SCA, Work Order produksi, serta asisten cerdas sangrAI untuk rekomendasi seduh dan resting.',
  },
  {
    q: 'Bagaimana cara memulai dan mendaftarkan entitas bisnis kopi saya?',
    a: 'Klik tombol "Daftar Akun", pilih peran usaha Anda (Petani, Pengolah, Gudang, Roastery, atau Cafe), dan Anda akan langsung mendapatkan akses ke panel operasional serta katalog marketplace terpadu.',
  },
];

const enFaqs: Faq[] = [
  {
    q: 'What is sangrAI?',
    a: 'sangrAI is an end-to-end coffee supply chain information platform that integrates B2B trading, digital lot traceability, SCA sensory standardization, and circular waste management (Zero-Waste Eco-Processing).',
  },
  {
    q: 'How does QR Traceability work for cafe consumers?',
    a: "Every roasted bean lot brewed at a cafe generates a unique code. Baristas print a QR sticker for the cup or retail package. Consumers simply scan it with their phone camera to read the farmer's history, farm elevation, fermentation profile, roast curve, and tasting notes.",
  },
  {
    q: 'What benefits does the Circular Economy & Eco-Rating module offer Mill Processors?',
    a: 'This module tracks the conversion of organic coffee cherry waste (skin/pulp and fermentation water) into value-added products like cascara tea, charcoal briquettes, and organic compost. The system automatically calculates an Eco-Rating score and estimated carbon reduction.',
  },
  {
    q: 'Can roasteries use the AI curve simulator and flavor formulation tools?',
    a: 'Yes. Our Roaster ERP module includes a roast profile simulator (Agtron, DTR, RoR), an 8-parameter SCA sensory radar, production Work Orders, and the sangrAI smart assistant for brewing and resting recommendations.',
  },
  {
    q: 'How do I get started and register my coffee business?',
    a: 'Click the "Register Account" button, choose your business role (Farmer, Processor, Warehouse, Roastery, or Cafe), and you\'ll get immediate access to your operational panel and the integrated marketplace catalog.',
  },
];

export const landingContent: Record<LandingLanguage, LandingContent> = {
  id: {
    hero: {
      pillLabel: 'Platform Rantai Pasok Kopi Specialty & Traceability #1',
      circularTag: 'CIRCULAR TRACE',
      titlePart1: 'Hubungkan Setiap Biji Kopi:',
      titleHighlight: 'Dari Kebun Petani',
      titlePart2: 'Hingga Secangkir Kopi di Cafe Anda.',
      subtitlePre: 'Ekosistem digital terpadu untuk ',
      subtitleStrong1: 'Petani, Pengolah Mill, Gudang, Artisan Roastery',
      subtitleMid: ', dan ',
      subtitleStrong2: 'Pemilik Cafe',
      subtitleEnd:
        '. Dilengkapi pelacakan 100% QR Traceability, standar cupping SCA, dan integrasi sirkular ramah lingkungan.',
      ctaRegister: 'Daftar Akun / Mulai Demo',
      ctaMarketplace: 'Jelajahi B2B Marketplace',
      ctaLedger: 'Log Transaksi',
      trust1: 'Standar Penilaian SCA 100 Poin',
      trust2: 'Zero Waste Circular Eco-Rating',
      trust3: 'QR Code Tanpa Install Aplikasi',
      stats: [
        { value: '5 Pilar', label: 'Rantai Pasok Terintegrasi Penuh' },
        { value: '100%', label: 'Farm-to-Cup QR Traceability' },
        { value: '87.5+', label: 'Rata-rata Skor Cupping SCA' },
        { value: '0 Calo', label: 'Pasar B2B Langsung & Transparan' },
      ],
      pipeline: {
        simulatorLabel: 'Simulator Alur Fisik & Data Lot (Chain of Custody)',
        title: 'Klik Tahap untuk Melihat Jejak Riwayat Biji Kopi',
        statusLabel: 'Status:',
        statusValue: 'Terverifikasi Real-Time',
        stepLabel: (n: number) => `TAHAP 0${n}`,
        stagePrefix: 'Tahap',
        accessTitle: 'Akses Operasional Peran Ini',
        accessSubtitle: 'Buka simulator & dashboard mandiri',
        tryPanelPrefix: 'Coba Panel',
      },
    },
    pipelineStages: idPipelineStages,
    servicesHeader: {
      badge: 'Layanan & Fitur Komprehensif',
      title: '5 Pilar Ekosistem Kopi sangrAI',
      subtitle:
        'Setiap pemangku kepentingan memiliki modul khusus yang saling tersambung secara otomatis dalam satu basis data terdesentralisasi.',
    },
    roleTabs: [
      { id: 'petani', label: '1. Petani Kopi' },
      { id: 'pengolah', label: '2. Pengolah Mill' },
      { id: 'gudang', label: '3. Gudang & QA' },
      { id: 'roaster', label: '4. Artisan Roastery' },
      { id: 'cafe', label: '5. Pemilik Cafe' },
    ],
    servicePanels: idServicePanels,
    advantages: {
      badge: 'Keunggulan Kompetitif Kami',
      title: 'Mengapa Industri Kopi Memilih sangrAI?',
      subtitle:
        'Menyatukan presisi data teknis, transparansi harga yang adil, serta kepedulian lingkungan hidup dalam satu platform modern.',
      cards: idAdvantageCards,
    },
    background: {
      badge: 'Latar Belakang & Cerita Kami',
      title: 'Membangun Keadilan & Keberlanjutan dalam Setiap Tetesan Kopi',
      para1Pre:
        'Kopi specialty Indonesia diakui di seluruh dunia, namun di balik kelezatan rasa terdapat tantangan besar: ',
      para1Strong:
        'rantai pasok yang terfragmentasi, asimetri harga di tingkat petani, hilangnya riwayat terroir saat sampai ke barista',
      para1Post: ', serta timbunan limbah pengolahan basah yang belum terkelola optimal.',
      para2Rest:
        ' — gabungan "Sangrai" (proses roasting kopi) dan "AI" — lahir sebagai jawaban: sebuah platform yang mengembalikan kehormatan dan transparansi kepada para penanam kopi, memberikan kepastian mutu dan data kepada roaster, serta menyuguhkan integritas cerita kepada setiap penikmat kopi di kedai.',
      pillars: [
        {
          title: 'Keadilan Nilai (Direct Equity)',
          desc: 'Memastikan petani mendapatkan margin yang layak sesuai dedikasi panen petik merah optimal.',
        },
        {
          title: 'Ekonomi Sirkular (Zero Waste)',
          desc: 'Mengolah 100% produk sampingan ceri kopi menjadi pupuk organik dan cascara bernilai tinggi.',
        },
      ],
      storyTitle: 'Filosofi Circular Trace',
      storyTag: 'From Farm Soil back to Farm Soil',
      quote:
        'Kami percaya bahwa secangkir kopi terasa paling nikmat saat mereka yang menanam, mengolah, dan menyangrainya dihargai secara adil pada setiap tegukan. Teknologi kami hadir bukan untuk menggantikan sentuhan pengrajin kopi, melainkan untuk merayakan karya mereka.',
      statCarbonLabel: 'Jejak Karbon',
      statCarbonValue: '-32% Emisi Olahan',
      statPartnerLabel: 'Kemitraan Petani',
      statPartnerValue: '100% Transparan',
    },
    cta: {
      badge: 'Mulai Transformasi Digital Sekarang',
      title: 'Siap Mengembangkan Usaha Kopi Anda Bersama sangrAI?',
      subtitle:
        'Bergabunglah dengan ribuan petani, pengolah mill, pengelola gudang, artisan roastery, dan barista cafe di seluruh Indonesia. Gratis tanpa biaya aktivasi awal.',
      roleCards: idCtaRoleCards,
      bannerTitle: 'Coba Seluruh Fitur Tanpa Komitmen',
      bannerDesc:
        'Pilih peran Anda sekarang untuk menjelajahi simulasi marketplace B2B, manajemen lot, dan generator QR code.',
      bannerBtn: 'Buka Formulir Pendaftaran',
      faqTitle: 'Pertanyaan yang Sering Diajukan (FAQ)',
    },
    faqs: idFaqs,
  },
  en: {
    hero: {
      pillLabel: "Indonesia's #1 Specialty Coffee Supply Chain & Traceability Platform",
      circularTag: 'CIRCULAR TRACE',
      titlePart1: 'Connect Every Coffee Bean:',
      titleHighlight: "From the Farmer's Field",
      titlePart2: 'All the Way to Your Cafe Cup.',
      subtitlePre: 'A unified digital ecosystem for ',
      subtitleStrong1: 'Farmers, Mill Processors, Warehouses, Artisan Roasteries',
      subtitleMid: ', and ',
      subtitleStrong2: 'Cafe Owners',
      subtitleEnd:
        '. Featuring 100% QR traceability, SCA cupping standards, and eco-friendly circular integration.',
      ctaRegister: 'Create Account / Start Demo',
      ctaMarketplace: 'Explore B2B Marketplace',
      ctaLedger: 'Transaction Log',
      trust1: 'SCA 100-Point Scoring Standard',
      trust2: 'Zero Waste Circular Eco-Rating',
      trust3: 'QR Code, No App Install Needed',
      stats: [
        { value: '5 Pillars', label: 'Fully Integrated Supply Chain' },
        { value: '100%', label: 'Farm-to-Cup QR Traceability' },
        { value: '87.5+', label: 'Average SCA Cupping Score' },
        { value: '0 Brokers', label: 'Direct & Transparent B2B Market' },
      ],
      pipeline: {
        simulatorLabel: 'Physical Flow & Lot Data Simulator (Chain of Custody)',
        title: "Click a Stage to Trace the Coffee's Journey",
        statusLabel: 'Status:',
        statusValue: 'Verified in Real Time',
        stepLabel: (n: number) => `STAGE 0${n}`,
        stagePrefix: 'Stage',
        accessTitle: "Access This Role's Workspace",
        accessSubtitle: 'Open the standalone simulator & dashboard',
        tryPanelPrefix: 'Try Panel',
      },
    },
    pipelineStages: enPipelineStages,
    servicesHeader: {
      badge: 'Comprehensive Services & Features',
      title: "sangrAI's 5-Pillar Coffee Ecosystem",
      subtitle:
        'Every stakeholder gets a dedicated module, automatically connected within a single decentralized database.',
    },
    roleTabs: [
      { id: 'petani', label: '1. Coffee Farmer' },
      { id: 'pengolah', label: '2. Mill Processor' },
      { id: 'gudang', label: '3. Warehouse & QA' },
      { id: 'roaster', label: '4. Artisan Roastery' },
      { id: 'cafe', label: '5. Cafe Owner' },
    ],
    servicePanels: enServicePanels,
    advantages: {
      badge: 'Our Competitive Edge',
      title: 'Why the Coffee Industry Chooses sangrAI',
      subtitle:
        'Bringing together technical data precision, fair price transparency, and environmental stewardship in one modern platform.',
      cards: enAdvantageCards,
    },
    background: {
      badge: 'Our Background & Story',
      title: 'Building Fairness & Sustainability into Every Drop of Coffee',
      para1Pre:
        'Indonesian specialty coffee is celebrated worldwide, but behind its exceptional flavor lie major challenges: ',
      para1Strong:
        'a fragmented supply chain, price asymmetry at the farmer level, and lost terroir history by the time coffee reaches the barista',
      para1Post: ', along with untreated wet-processing waste piling up.',
      para2Rest:
        ' — a combination of "Sangrai" (the Indonesian word for coffee roasting) and "AI" — was born as the answer: a platform that restores dignity and transparency to coffee growers, gives roasters quality assurance and data, and brings storytelling integrity to every coffee lover at the counter.',
      pillars: [
        {
          title: 'Value Equity (Direct Equity)',
          desc: 'Ensuring farmers earn a fair margin for their dedication to optimal red-ripe picking.',
        },
        {
          title: 'Circular Economy (Zero Waste)',
          desc: 'Turning 100% of coffee cherry byproducts into high-value organic fertilizer and cascara.',
        },
      ],
      storyTitle: 'The Circular Trace Philosophy',
      storyTag: 'From Farm Soil back to Farm Soil',
      quote:
        "We believe a cup of coffee tastes best when those who grow, process, and roast it are fairly valued with every sip. Our technology isn't here to replace the craftsperson's touch — it's here to celebrate their work.",
      statCarbonLabel: 'Carbon Footprint',
      statCarbonValue: '-32% Processing Emissions',
      statPartnerLabel: 'Farmer Partnerships',
      statPartnerValue: '100% Transparent',
    },
    cta: {
      badge: 'Start Your Digital Transformation Now',
      title: 'Ready to Grow Your Coffee Business with sangrAI?',
      subtitle:
        'Join thousands of farmers, mill processors, warehouse managers, artisan roasteries, and cafe baristas across Indonesia. Free, with no activation fee.',
      roleCards: enCtaRoleCards,
      bannerTitle: 'Try Every Feature, No Commitment',
      bannerDesc:
        'Pick your role now to explore the B2B marketplace simulation, lot management, and QR code generator.',
      bannerBtn: 'Open Registration Form',
      faqTitle: 'Frequently Asked Questions (FAQ)',
    },
    faqs: enFaqs,
  },
};
