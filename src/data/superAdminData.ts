import {
  ServiceConfig,
  SubscribedOrganization,
  EcosystemTelemetryData,
  SaaSInvoiceRecord,
  SuperAdminServiceId,
} from '../types/superAdminTypes';

export const DEFAULT_SERVICE_CONFIGS: Record<SuperAdminServiceId, ServiceConfig> = {
  admin_kelompok_tani: {
    id: 'admin_kelompok_tani',
    name: 'Kelompok Tani & Koperasi (Penaung Hulu)',
    shortLabel: 'Kelompok Tani',
    tierSubtitle: 'Penaung Ekosistem Hulu: Kebun, Wet/Dry Mill & Tim ICS',
    description: 'Mengelola kebun petani anggota binaan, stasiun penerimaan ceri basah/kering, kepatuhan poligon EUDR, dan audit internal ICS.',
    iconName: 'Building2',
    colorScheme: {
      primary: 'amber',
      bgBadge: 'bg-amber-100 text-amber-900 border-amber-300',
      textBadge: 'text-amber-800',
      border: 'border-amber-400',
      gradient: 'from-amber-600 to-yellow-600',
    },
    status: 'active',
    quota: {
      maxUsersPerOrg: 50, // 1 Gapoktan bisa memiliki hingga 50 sub-petani/pengolah binaan
      maxOrganizationsInPlatform: 150,
      currentUsersCount: 16,
      currentOrgsCount: 6,
      allowPublicRegistration: true,
      requireManualVerification: false,
      maxLotsPerMonthPerOrg: 'Unlimited',
      maxQrTagsPerMonthPerOrg: '2,500 Tag/Bulan',
    },
    pricing: {
      defaultPackageId: 'PKG-GAPOKTAN-PRO',
      defaultPackageName: 'Paket Gapoktan Mandiri & Ekspor Pro',
      baseMonthlyPrice: 799000,
      additionalSeatPriceMonthly: 25000,
      marketplaceFeePercent: 1.5, // 1.5% komisi penjualan ceri/green bean
      customDomainAddonPrice: 150000,
      supportLevel: 'priority_sla_24_7',
    },
    features: [
      { id: 'feat_eudr_polygon', name: 'Pemetaan Poligon GPS & Sertifikasi EUDR', description: 'Ekspor poligon GeoJSON/KML kebun bebas deforestasi sesuai regulasi Uni Eropa', category: 'compliance', enabled: true, isPremium: false },
      { id: 'feat_ics_audit', name: 'Audit Kepatuhan Internal ICS (4C Standard)', description: 'Pemeriksaan NIK petani, SOP pupuk organik, dan checklist kelayakan kebun', category: 'compliance', enabled: true, isPremium: false },
      { id: 'feat_brix_cherry', name: 'Pencatatan Refraktometer Brix Ceri Kopi', description: 'Input kadar kematangan ceri panen dan estimasi rendemen green bean', category: 'traceability', enabled: true, isPremium: false },
      { id: 'feat_wetdry_mill', name: 'Manajemen Stasiun Olah Ceri (Wet/Dry Mill)', description: 'Batch fermentasi (Washed, Natural, Honey, Anaerobic) dan penjemuran solar dome', category: 'core', enabled: true, isPremium: false },
      { id: 'feat_buku_kas_petani', name: 'Buku Kas & Pembayaran Talangan Petani', description: 'Pencatatan nota timbang ceri dan transfer bagi hasil panen petani anggota', category: 'commercial', enabled: true, isPremium: true },
      { id: 'feat_cascara_compost', name: 'Manajemen Limbah Sirkular (Cascara & Kompos)', description: 'Pelacakan konversi kulit ceri menjadi pupuk organik dan cascara tea', category: 'core', enabled: true, isPremium: false },
    ],
    updatedAt: '2026-11-21 07:00:00',
  },

  gudang: {
    id: 'gudang',
    name: 'Gudang Hermetik & QA Lab (Warehouse)',
    shortLabel: 'Gudang & QA',
    tierSubtitle: 'Pergudangan Standar SCA, Grading Fisik & Storing Ekspor',
    description: 'Manajemen stok green bean dalam karung hermetik GrainPro, monitoring suhu & kelembapan ruang (RH), dan penerbitan surat jalan.',
    iconName: 'Warehouse',
    colorScheme: {
      primary: 'blue',
      bgBadge: 'bg-blue-100 text-blue-900 border-blue-300',
      textBadge: 'text-blue-800',
      border: 'border-blue-400',
      gradient: 'from-blue-600 to-indigo-600',
    },
    status: 'active',
    quota: {
      maxUsersPerOrg: 15,
      maxOrganizationsInPlatform: 50,
      currentUsersCount: 5,
      currentOrgsCount: 3,
      allowPublicRegistration: true,
      requireManualVerification: true, // Butuh verifikasi kelayakan fasilitas gudang
      maxLotsPerMonthPerOrg: 'Unlimited',
      maxQrTagsPerMonthPerOrg: '5,000 Tag/Bulan',
    },
    pricing: {
      defaultPackageId: 'PKG-WAREHOUSE-HUB',
      defaultPackageName: 'Paket Pergudangan Hermetik & QA Hub',
      baseMonthlyPrice: 599000,
      additionalSeatPriceMonthly: 35000,
      marketplaceFeePercent: 2.0, // 2.0% komisi green bean marketplace
      customDomainAddonPrice: 200000,
      supportLevel: 'standard',
    },
    features: [
      { id: 'feat_grainpro_tracking', name: 'Pelacakan Batch Karung Hermetik (GrainPro)', description: 'Pencatatan lot masuk, kode palet, dan nomor karung penyimpanan kedap udara', category: 'core', enabled: true, isPremium: false },
      { id: 'feat_moisture_aw', name: 'Uji Kadar Air (MC) & Aktivitas Air (Aw)', description: 'Pencatatan moisture meter dan water activity untuk menjaga kesegaran specialty', category: 'compliance', enabled: true, isPremium: false },
      { id: 'feat_sca_defect_grading', name: 'Grading Fisik SCA Green Coffee Defect (350g)', description: 'Pemisahan defect primer dan sekunder untuk sertifikasi Grade 1 Specialty', category: 'compliance', enabled: true, isPremium: false },
      { id: 'feat_warehouse_surat_jalan', name: 'Penerbitan Surat Jalan Digital & QR Dispatch', description: 'Surat jalan resmi pengiriman green bean ke roastery dengan kode segel unik', category: 'commercial', enabled: true, isPremium: false },
      { id: 'feat_iot_temp_rh', name: 'Integrasi Sensor IoT Suhu & RH Realtime', description: 'Alert otomatis jika suhu ruangan > 24°C atau kelembapan udara > 65%', category: 'ai', enabled: false, isPremium: true },
    ],
    updatedAt: '2026-11-21 07:00:00',
  },

  roaster: {
    id: 'roaster',
    name: 'Artisan Roastery & Sensory Lab',
    shortLabel: 'Roastery',
    tierSubtitle: 'Penyangraian, Profiling Agtron & Produksi Retail',
    description: 'Pencatatan kurva sangrai, skor sensory cupping SCA, work orders batch sangrai, cetak kemasan retail ber-QR, dan formulasi blend.',
    iconName: 'Flame',
    colorScheme: {
      primary: 'orange',
      bgBadge: 'bg-orange-100 text-orange-900 border-orange-300',
      textBadge: 'text-orange-800',
      border: 'border-orange-400',
      gradient: 'from-orange-600 to-red-600',
    },
    status: 'active',
    quota: {
      maxUsersPerOrg: 10,
      maxOrganizationsInPlatform: 80,
      currentUsersCount: 8,
      currentOrgsCount: 4,
      allowPublicRegistration: true,
      requireManualVerification: false,
      maxLotsPerMonthPerOrg: 'Unlimited',
      maxQrTagsPerMonthPerOrg: '10,000 Tag/Bulan',
    },
    pricing: {
      defaultPackageId: 'PKG-ROASTERY-SCALE',
      defaultPackageName: 'Paket Roastery Artisan & Micro-Mill',
      baseMonthlyPrice: 499000,
      additionalSeatPriceMonthly: 30000,
      marketplaceFeePercent: 2.5, // 2.5% penjualan roasted bean b2b
      customDomainAddonPrice: 150000,
      supportLevel: 'priority_sla_24_7',
    },
    features: [
      { id: 'feat_agtron_profiling', name: 'Kurva Sangrai & Nilai Warna Agtron Gourmet', description: 'Catat RoR (Rate of Rise), First Crack, Drop Temp, dan Development Time Ratio (DTR)', category: 'core', enabled: true, isPremium: false },
      { id: 'feat_cupping_spider_chart', name: 'Spider Chart Sensori SCA 10 Atribut', description: 'Diagram radar interaktif: Aroma, Flavour, Aftertaste, Acidity, Body, Sweetness, dll', category: 'traceability', enabled: true, isPremium: false },
      { id: 'feat_work_order_roast', name: 'Work Orders & Perintah Produksi Batch', description: 'Kalkulasi susut bobot sangrai (weight loss %) dan alokasi stok green bean', category: 'core', enabled: true, isPremium: false },
      { id: 'feat_retail_packaging_qr', name: 'Label Kemasan Retail & Farm-to-Cup QR', description: 'Cetak stiker kemasan 200g/250g/1kg dengan silsilah lengkap asal kebun', category: 'traceability', enabled: true, isPremium: false },
      { id: 'feat_silverskin_circular', name: 'Pencatatan Limbah Chaff / Silverskin', description: 'Rekapitulasi abu/kulit ari sangrai untuk media tanam jamur & kompos sirkular', category: 'core', enabled: true, isPremium: false },
    ],
    updatedAt: '2026-11-21 07:00:00',
  },

  cafe: {
    id: 'cafe',
    name: 'Specialty Coffee Shop & Brew Bar',
    shortLabel: 'Cafe & Kedai',
    tierSubtitle: 'Hilir Konsumen: Seduhan Cangkir, Menu Digital & Retail',
    description: 'Pencatatan inventaris roasted bean, kalkulator biaya seduh per cangkir (HPP), menu digital farm-to-cup, dan penjualan merchandise.',
    iconName: 'Coffee',
    colorScheme: {
      primary: 'stone',
      bgBadge: 'bg-stone-200 text-stone-900 border-stone-400',
      textBadge: 'text-stone-800',
      border: 'border-stone-400',
      gradient: 'from-stone-700 to-stone-900',
    },
    status: 'active',
    quota: {
      maxUsersPerOrg: 8,
      maxOrganizationsInPlatform: 120,
      currentUsersCount: 6,
      currentOrgsCount: 4,
      allowPublicRegistration: true,
      requireManualVerification: false,
      maxLotsPerMonthPerOrg: 'Unlimited',
      maxQrTagsPerMonthPerOrg: '1,500 Tag/Bulan',
    },
    pricing: {
      defaultPackageId: 'PKG-CAFE-BOUTIQUE',
      defaultPackageName: 'Paket Specialty Cafe & Brew Bar',
      baseMonthlyPrice: 199000,
      additionalSeatPriceMonthly: 20000,
      marketplaceFeePercent: 0.0, // Bebas fee beli roasted bean
      customDomainAddonPrice: 100000,
      supportLevel: 'standard',
    },
    features: [
      { id: 'feat_costing_calculator', name: 'Kalkulator Biaya Seduh (Brewing Costing)', description: 'Hitung HPP per cangkir (V60, Espresso, Cold Brew) otomatis berdasarkan gramatur', category: 'commercial', enabled: true, isPremium: false },
      { id: 'feat_cup_to_farm_menu', name: 'Menu Digital Asal Usul (Farm-to-Cup QR)', description: 'Tamu kedai scan barcode meja untuk membaca biodata petani yang menanam biji kopi', category: 'traceability', enabled: true, isPremium: false },
      { id: 'feat_retail_pack_sales', name: 'Penjualan Retail Roasted Bean Binaan', description: 'Jual beans specialty kemasan ke konsumen kedai dengan silsilah lengkap', category: 'core', enabled: true, isPremium: false },
      { id: 'feat_coffee_grounds_compost', name: 'Pengumpulan Ampas Kopi Kedai (Spent Grounds)', description: 'Catat berat ampas kopi yang disalurkan kembali ke kebun sebagai kompos organik', category: 'core', enabled: true, isPremium: false },
    ],
    updatedAt: '2026-11-21 07:00:00',
  },

  verifikator: {
    id: 'verifikator',
    name: 'Verifikator Mutu & Auditor Ekosistem',
    shortLabel: 'Verifikator',
    tierSubtitle: 'Dewan Auditor Independen, Q-Grader & Inspeksi Kepatuhan',
    description: 'Pemeriksaan kebun EUDR, verifikasi fasilitas gudang, validasi cupping sensori SCA, dan penerbitan stempel digital CT4CI ber-SHA256.',
    iconName: 'ShieldCheck',
    colorScheme: {
      primary: 'purple',
      bgBadge: 'bg-purple-100 text-purple-900 border-purple-300',
      textBadge: 'text-purple-800',
      border: 'border-purple-400',
      gradient: 'from-purple-700 to-indigo-800',
    },
    status: 'active',
    quota: {
      maxUsersPerOrg: 5,
      maxOrganizationsInPlatform: 20,
      currentUsersCount: 3,
      currentOrgsCount: 2,
      allowPublicRegistration: false, // Hanya via undangan/approval ketat Super Admin
      requireManualVerification: true,
      maxLotsPerMonthPerOrg: 'Unlimited',
      maxQrTagsPerMonthPerOrg: 'Unlimited',
    },
    pricing: {
      defaultPackageId: 'PKG-ENTERPRISE-ALL',
      defaultPackageName: 'Lisensi Verifikator Mutu & Dewan Auditor',
      baseMonthlyPrice: 1499000,
      additionalSeatPriceMonthly: 50000,
      marketplaceFeePercent: 0.0,
      customDomainAddonPrice: 250000,
      supportLevel: 'priority_sla_24_7',
    },
    features: [
      { id: 'feat_digital_sha256_stamp', name: 'Penerbitan Stempel Verifikasi Digital SHA-256', description: 'Stempel anti-manipulasi kriptografis yang disematkan pada sertifikat lot', category: 'compliance', enabled: true, isPremium: false },
      { id: 'feat_eudr_field_audit', name: 'Formulir Inspeksi Lapangan EUDR & 4C', description: 'Checklist audit on-site tutupan lahan, status kawasan hutan, dan ketenagakerjaan', category: 'compliance', enabled: true, isPremium: false },
      { id: 'feat_qgrader_official_score', name: 'Lembar Skor Resmi Q-Grader SCA', description: 'Pemberian skor resmi Specialty (80+) dan penetapan Grade sertifikasi', category: 'traceability', enabled: true, isPremium: false },
      { id: 'feat_revoke_suspension', name: 'Otoritas Pembekuan & Revokasi Sertifikat', description: 'Hak menolak atau mencabut stempel jika ditemukan pelanggaran mutu/deforestasi', category: 'compliance', enabled: true, isPremium: false },
    ],
    updatedAt: '2026-11-21 07:00:00',
  },
};

export const DEFAULT_SUBSCRIBED_ORGANIZATIONS: SubscribedOrganization[] = [
  {
    id: 'SUB-001',
    organizationName: 'Gapoktan Kopi Mandiri Nusantara',
    picName: 'Haji Suryana (Ketua Gapoktan)',
    email: 'admin.gapoktan@circulartrace.id',
    phone: '0812-9876-5432',
    location: 'Pangalengan, Kab. Bandung',
    serviceId: 'admin_kelompok_tani',
    packageId: 'PKG-GAPOKTAN-PRO',
    packageName: 'Paket Gapoktan Mandiri & Ekspor Pro',
    billingCycle: 'yearly',
    pricePerCycle: 7990000,
    mrrContribution: 665833,
    status: 'active',
    userSeatsUsed: 14,
    userSeatsLimit: 30,
    lotsQuotaUsed: 42,
    lotsQuotaLimit: 'Unlimited',
    startDate: '2026-01-15',
    renewalDate: '2027-01-15',
    autoRenew: true,
    lastPaymentDate: '2026-01-15',
    lastPaymentMethod: 'Bank Transfer (BCA Corporate)',
    notes: 'Gapoktan binaan utama percontohan EUDR 4C',
  },
  {
    id: 'SUB-002',
    organizationName: 'Karsa Craft Roastery & Lab',
    picName: 'Kresna Pratama (Head Roaster)',
    email: 'karsa.roastery@circulartrace.id',
    phone: '0813-2211-4455',
    location: 'Dago Atas, Kota Bandung',
    serviceId: 'roaster',
    packageId: 'PKG-ROASTERY-SCALE',
    packageName: 'Paket Roastery Artisan & Micro-Mill',
    billingCycle: 'monthly',
    pricePerCycle: 499000,
    mrrContribution: 499000,
    status: 'active',
    userSeatsUsed: 6,
    userSeatsLimit: 10,
    lotsQuotaUsed: 28,
    lotsQuotaLimit: 'Unlimited',
    startDate: '2026-02-01',
    renewalDate: '2026-12-01',
    autoRenew: true,
    lastPaymentDate: '2026-11-01',
    lastPaymentMethod: 'Virtual Account Mandiri',
  },
  {
    id: 'SUB-003',
    organizationName: 'PT Nusantara Coffee Warehouse & QA',
    picName: 'Hendro Gunawan (Logistics QA Manager)',
    email: 'gudang.nusantara@circulartrace.id',
    phone: '0811-3344-5566',
    location: 'Gedebage, Kota Bandung',
    serviceId: 'gudang',
    packageId: 'PKG-WAREHOUSE-HUB',
    packageName: 'Paket Pergudangan Hermetik & QA Hub',
    billingCycle: 'monthly',
    pricePerCycle: 599000,
    mrrContribution: 599000,
    status: 'active',
    userSeatsUsed: 4,
    userSeatsLimit: 15,
    lotsQuotaUsed: 19,
    lotsQuotaLimit: 'Unlimited',
    startDate: '2026-03-10',
    renewalDate: '2026-12-10',
    autoRenew: true,
    lastPaymentDate: '2026-11-10',
    lastPaymentMethod: 'QRIS Dinamis',
  },
  {
    id: 'SUB-004',
    organizationName: 'Seduh Teduh Specialty Coffee',
    picName: 'Clarissa Amanda (Store Manager)',
    email: 'seduh.teduh@circulartrace.id',
    phone: '0818-7766-5544',
    location: 'Jl. Riau, Kota Bandung',
    serviceId: 'cafe',
    packageId: 'PKG-CAFE-BOUTIQUE',
    packageName: 'Paket Specialty Cafe & Brew Bar',
    billingCycle: 'monthly',
    pricePerCycle: 199000,
    mrrContribution: 199000,
    status: 'active',
    userSeatsUsed: 5,
    userSeatsLimit: 8,
    lotsQuotaUsed: 12,
    lotsQuotaLimit: 'Unlimited',
    startDate: '2026-04-05',
    renewalDate: '2026-12-05',
    autoRenew: true,
    lastPaymentDate: '2026-11-05',
    lastPaymentMethod: 'Kartu Kredit (Visa)',
  },
  {
    id: 'SUB-005',
    organizationName: 'Dewan Sertifikasi Kopi Specialty & Q-Grader Lab',
    picName: 'Ahmad Faisal, S.P., Q-Grader',
    email: 'verifikator@circulartrace.id',
    phone: '0812-4455-6677',
    location: 'Jakarta & Bandung',
    serviceId: 'verifikator',
    packageId: 'PKG-ENTERPRISE-ALL',
    packageName: 'Paket Konsorsium Enterprise Ekosistem',
    billingCycle: 'yearly',
    pricePerCycle: 14990000,
    mrrContribution: 1249166,
    status: 'active',
    userSeatsUsed: 3,
    userSeatsLimit: 20,
    lotsQuotaUsed: 65,
    lotsQuotaLimit: 'Unlimited',
    startDate: '2026-01-01',
    renewalDate: '2027-01-01',
    autoRenew: true,
    lastPaymentDate: '2026-01-01',
    lastPaymentMethod: 'Invoice Perusahaan (BNI)',
  },
  {
    id: 'SUB-006',
    organizationName: 'Koperasi Petani Malabar Preanger',
    picName: 'Asep Ridwan (Sekretaris Koperasi)',
    email: 'malabar.preanger@circulartrace.id',
    phone: '0852-3344-5566',
    location: 'Gunung Tilu, Pangalengan',
    serviceId: 'admin_kelompok_tani',
    packageId: 'PKG-GAPOKTAN-STARTER',
    packageName: 'Paket Starter Gapoktan & Petani',
    billingCycle: 'monthly',
    pricePerCycle: 299000,
    mrrContribution: 299000,
    status: 'trial',
    userSeatsUsed: 4,
    userSeatsLimit: 10,
    lotsQuotaUsed: 9,
    lotsQuotaLimit: 50,
    startDate: '2026-11-10',
    renewalDate: '2026-11-24', // 3 hari tersisa trial
    autoRenew: false,
    notes: 'Masa trial 14 hari pendaftaran baru',
  },
  {
    id: 'SUB-007',
    organizationName: 'Parijs Van Java Roastery',
    picName: 'Rian Firmansyah',
    email: 'pvj.roastery@circulartrace.id',
    phone: '0819-2233-4455',
    location: 'Sukajadi, Kota Bandung',
    serviceId: 'roaster',
    packageId: 'PKG-ROASTERY-SCALE',
    packageName: 'Paket Roastery Artisan & Micro-Mill',
    billingCycle: 'monthly',
    pricePerCycle: 499000,
    mrrContribution: 499000,
    status: 'past_due',
    userSeatsUsed: 5,
    userSeatsLimit: 10,
    lotsQuotaUsed: 22,
    lotsQuotaLimit: 'Unlimited',
    startDate: '2026-05-15',
    renewalDate: '2026-11-15', // Jatuh tempo 6 hari lalu
    autoRenew: true,
    notes: 'Menunggu konfirmasi transfer perpanjangan',
  },
  {
    id: 'SUB-008',
    organizationName: 'Kopi Barista Garut Juara',
    picName: 'Yayan Mulyana',
    email: 'barista.garut@circulartrace.id',
    phone: '0878-1122-3344',
    location: 'Tarogong, Garut',
    serviceId: 'cafe',
    packageId: 'PKG-CAFE-BOUTIQUE',
    packageName: 'Paket Specialty Cafe & Brew Bar',
    billingCycle: 'monthly',
    pricePerCycle: 199000,
    mrrContribution: 199000,
    status: 'suspended',
    userSeatsUsed: 2,
    userSeatsLimit: 8,
    lotsQuotaUsed: 3,
    lotsQuotaLimit: 'Unlimited',
    startDate: '2026-06-01',
    renewalDate: '2026-10-01',
    autoRenew: false,
    notes: 'Dibekukan sementara karena renovasi kedai',
  },
];

export const DEFAULT_ECOSYSTEM_TELEMETRY: EcosystemTelemetryData = {
  totalTracedVolumeKg: 148750, // 148.75 Ton
  totalCherryVolumeKg: 85400,
  totalGreenBeanVolumeKg: 42150,
  totalRoastedBeanVolumeKg: 21200,
  totalFarmToCupQrScans: 41920,
  totalGeofencedFarmsCount: 342,
  totalGeofencedHectares: 512.4,
  eudrComplianceRatePercent: 98.4,
  totalCircularWasteDivertedKg: 19850, // 19.85 Ton Cascara & Kompos
  circularityScoreAverage: 95.8,
  totalMonthlyRecurringRevenue: 54203000,
  annualRunRate: 650436000,
  totalSubscribedOrgs: 97,
  activePlatformUsers: 348,
  serverUptimePercent: 99.98,
};

export const DEFAULT_SAAS_INVOICES: SaaSInvoiceRecord[] = [
  {
    id: 'INV-2026-0112',
    invoiceNumber: 'INV/CCT/202611/0112',
    organizationName: 'Karsa Craft Roastery & Lab',
    serviceId: 'roaster',
    packageName: 'Paket Roastery Artisan (Bulan November 2026)',
    amount: 499000,
    issueDate: '2026-11-01',
    dueDate: '2026-11-08',
    paidDate: '2026-11-02',
    status: 'paid',
    paymentMethod: 'Mandiri Virtual Account',
  },
  {
    id: 'INV-2026-0113',
    invoiceNumber: 'INV/CCT/202611/0113',
    organizationName: 'PT Nusantara Coffee Warehouse & QA',
    serviceId: 'gudang',
    packageName: 'Paket Pergudangan Hermetik (Bulan November 2026)',
    amount: 599000,
    issueDate: '2026-11-10',
    dueDate: '2026-11-17',
    paidDate: '2026-11-10',
    status: 'paid',
    paymentMethod: 'QRIS Dinamis',
  },
  {
    id: 'INV-2026-0114',
    invoiceNumber: 'INV/CCT/202611/0114',
    organizationName: 'Parijs Van Java Roastery',
    serviceId: 'roaster',
    packageName: 'Paket Roastery Artisan (Bulan November 2026)',
    amount: 499000,
    issueDate: '2026-11-15',
    dueDate: '2026-11-22',
    status: 'pending',
    paymentMethod: 'Manual Transfer',
  },
  {
    id: 'INV-2026-0115',
    invoiceNumber: 'INV/CCT/202611/0115',
    organizationName: 'Seduh Teduh Specialty Coffee',
    serviceId: 'cafe',
    packageName: 'Paket Specialty Cafe & Brew Bar (Bulan November 2026)',
    amount: 199000,
    issueDate: '2026-11-05',
    dueDate: '2026-11-12',
    paidDate: '2026-11-05',
    status: 'paid',
    paymentMethod: 'Credit Card (Visa)',
  },
];

// LocalStorage Persistence Helpers
const STORAGE_SERVICES_KEY = 'cct_superadmin_services_config';
const STORAGE_SUBSCRIPTIONS_KEY = 'cct_superadmin_subscriptions';
const STORAGE_TELEMETRY_KEY = 'cct_superadmin_telemetry';

export function getSavedServiceConfigs(): Record<SuperAdminServiceId, ServiceConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_SERVICES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_SERVICE_CONFIGS, ...parsed };
      }
    }
  } catch (_) {}
  return DEFAULT_SERVICE_CONFIGS;
}

export function saveServiceConfig(serviceId: SuperAdminServiceId, updates: Partial<ServiceConfig>): Record<SuperAdminServiceId, ServiceConfig> {
  const current = getSavedServiceConfigs();
  const existing = current[serviceId] || DEFAULT_SERVICE_CONFIGS[serviceId];
  const updated: ServiceConfig = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  const next = { ...current, [serviceId]: updated };
  try {
    localStorage.setItem(STORAGE_SERVICES_KEY, JSON.stringify(next));
  } catch (_) {}
  return next;
}

export function getSavedSubscriptions(): SubscribedOrganization[] {
  try {
    const raw = localStorage.getItem(STORAGE_SUBSCRIPTIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}
  return DEFAULT_SUBSCRIBED_ORGANIZATIONS;
}

export function saveSubscriptions(subscriptions: SubscribedOrganization[]): void {
  try {
    localStorage.setItem(STORAGE_SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
  } catch (_) {}
}

export function updateSubscriptionRecord(subId: string, updates: Partial<SubscribedOrganization>): SubscribedOrganization[] {
  const list = getSavedSubscriptions();
  const next = list.map((item) => (item.id === subId ? { ...item, ...updates } : item));
  saveSubscriptions(next);
  return next;
}

export function getSavedTelemetry(): EcosystemTelemetryData {
  try {
    const raw = localStorage.getItem(STORAGE_TELEMETRY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_ECOSYSTEM_TELEMETRY, ...parsed };
      }
    }
  } catch (_) {}
  return DEFAULT_ECOSYSTEM_TELEMETRY;
}
