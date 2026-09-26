export type UserRole = 'petani' | 'pengolah' | 'gudang' | 'roaster' | 'cafe' | 'verifikator';

export type VerifierDomain = 'petani' | 'pengolah' | 'gudang' | 'roaster' | 'cafe' | 'all';

export type MarketplaceCategory =
  | 'cherry'               // 1. Ceri Kopi Segar / Panen Petani
  | 'green_bean_processor' // 2. Green Bean Hasil Olahan (Mill)
  | 'green_bean_warehouse' // 3. Green Bean Pergudangan & Ekspor (Gudang QA)
  | 'roasted_bean';        // 4. Biji Kopi Sangrai Artisan (Roaster)

export interface AppUser {
  id: string;
  name: string;
  email?: string;
  password?: string;
  role: UserRole;
  verifierDomain?: VerifierDomain;
  organization: string;
  location: string;
  avatar: string;
  phone: string;
  balance: number;
  bio?: string;
}

// Evaluasi Uji Sensori Cupping SCA oleh Verifikator / Q-Grader
export interface CuppingEvaluationData {
  fragranceAroma: number;   // 6.00 - 10.00
  flavor: number;           // 6.00 - 10.00
  aftertaste: number;       // 6.00 - 10.00
  acidity: number;          // 6.00 - 10.00
  body: number;             // 6.00 - 10.00
  balance: number;          // 6.00 - 10.00
  cleanCup: number;         // 6.00 - 10.00
  sweetness: number;        // 6.00 - 10.00
  uniformity: number;       // 6.00 - 10.00
  overall: number;          // 6.00 - 10.00
  totalScore: number;       // 60 - 100
  tastingNotes: string[];   // e.g. ["Floral Jasmine", "Bergamot", "Peach", "Brown Sugar"]
  defectDeduction?: number; // nilai penalti cacat
  defectNotes?: string;
  roastEvaluation: 'Optimal Specialty' | 'Underdeveloped' | 'Baked' | 'Overdeveloped';
  recommendationRestDays: number;
}

// Stempel Digital Resmi yang Diterbitkan Verifikator
export interface VerificationStamp {
  id: string;
  stampType: 'eudr_farm' | 'harvest_quality' | 'processing_mill' | 'warehouse_silo' | 'roast_cupping' | 'cafe_safety';
  title: string;
  certificateNumber: string;
  verifierId: string;
  verifierName: string;
  verifierTitle: string;
  verifierOrg: string;
  verifiedAt: string;
  status: 'verified' | 'rejected';
  scoreDisplay?: string;
  notes: string;
  digitalSignatureHash: string;
  cuppingEvaluation?: CuppingEvaluationData;
}

// 0. REGISTRASI & MANAJEMEN LAHAN / KEBUN KOPI PETANI
export interface FarmWeatherData {
  currentCondition: 'Cerah Berawan' | 'Hujan Ringan' | 'Berkabut Tebal' | 'Cerah Terik' | 'Hujan Lebat' | 'Sejuk Berangin';
  temperatureCelsius: number; // e.g. 19.5 °C
  humidityPercent: number; // e.g. 78% RH
  annualRainfallMm: number; // e.g. 2200 mm/tahun
  sunshineHoursPerDay: number; // e.g. 6.5 jam/hari
  windSpeedKph: number; // e.g. 11 km/jam
  microclimateNote: string; // Catatan iklim mikro pegunungan
}

export type PhysicalPatokType =
  | 'Patok Beton BPN'
  | 'Pipa Besi Cor'
  | 'Pohon Batas Alami'
  | 'Batu Alam / Terasering'
  | 'Patok Kayu Ulin'
  | 'Titik Virtual GPS';

export type PatokCondition =
  | 'Kondisi Baik & Kokoh'
  | 'Perlu Perbaikan'
  | 'Tertutup Semak'
  | 'Titik Baru';

export interface FarmPatok {
  id: string; // e.g. "PTK-01"
  name: string; // e.g. "Patok 1 (Sudut Utara - Batas Hutan)"
  latitude: number;
  longitude: number;
  elevationMeters?: number; // e.g. 1575 (mdpl)
  physicalType?: PhysicalPatokType;
  condition?: PatokCondition;
  landmarkNote?: string; // e.g. "Dekat pohon beringin tua, 10m dari aliran air"
  verifiedDate?: string; // e.g. "2026-08-15"
  photoUrl?: string;
}

export interface FarmPolygonPoint {
  id: string; // e.g. "PT-01"
  label: string; // e.g. "Titik Sudut Utara (A)"
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  physicalType?: PhysicalPatokType;
  condition?: PatokCondition;
  landmarkNote?: string;
}

export interface FarmPlotBoundary {
  polygonPoints?: FarmPolygonPoint[];
  patokList?: FarmPatok[];
  perimeterMeters: number; // e.g. 640m
  geofenceRadiusMeters: number; // e.g. 250m
  plotShapeName?: string; // e.g. "Blok Kontur Lereng Timur"
  calculatedAreaHectares?: number;
}

export interface CoffeeFarm {
  id: string; // e.g. "FARM-PGL-01"
  farmerId: string;
  farmerName: string;
  farmName: string; // e.g. "Kebun Blok Pasir Kunci (Lereng Gunung Tilu)"
  location: string; // e.g. "Desa Margamukti, Kec. Pangalengan, Kab. Bandung"
  province: string; // e.g. "Jawa Barat"
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  plotBoundary?: FarmPlotBoundary;
  patokList?: FarmPatok[];
  rangeRadiusMeters?: number;
  altitudeMeters: number; // e.g. 1550 (mdpl)
  altitudeDisplay: string; // e.g. "1.500 - 1.620 mdpl"
  landAreaHectares: number; // e.g. 2.4 Ha
  totalTreesCount: number; // e.g. 3.200 Pohon Kopi
  primaryVarieties: string[]; // e.g. ["Sigarar Utang", "Typica", "Kartika", "Ateng Super"]
  soilType: 'Andosol Vulkanik' | 'Latosol Humus' | 'Regosol Pegunungan' | 'Humus Aluvial';
  shadeTrees: string[]; // e.g. ["Pohon Sengon", "Lamtoro", "Alpukat", "Jeruk Kintamani", "Kayu Manis"]
  organicStatus: 'Organik Bersertifikat (SNI / USDA)' | 'Transisi Menuju Organik' | 'GAP (Good Agricultural Practices)';
  eudrCompliant: boolean; // European Deforestation Regulation Geolocation Verified
  weatherData: FarmWeatherData;
  photoUrl: string;
  establishedYear: number;
  notes?: string;
  createdAt: string;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationStamp?: VerificationStamp;
}

// 1. LOT HASIL PANEN PETANI (Cherry Segar / Gabah Kopi)
export interface FarmerHarvestLot {
  id: string;
  farmerId: string;
  farmerName: string;
  farmId?: string; // Terhubung ke Lahan/Kebun terdaftar
  farmName?: string;
  farmLocation: string;
  altitude: string; // e.g., "1.450 - 1.600 mdpl"
  variety: string; // e.g., "Sigarar Utang, Ateng Super"
  harvestDate: string;
  pickingMethod: 'Petik Merah Optimal (95%+)' | 'Petik Campur (Merah & Kuning)' | 'Petik Rata';
  brix: number; // Kadar gula buah cherry, e.g. 21.5
  totalWeightKg: number;
  availableWeightKg: number;
  pricePerKg: number;
  notes: string;
  status: 'available' | 'sold' | 'partial';
  createdAt: string;
  photoUrl?: string;
  weatherSnapshot?: FarmWeatherData;
  soilType?: string;
  shadeTrees?: string[];
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationStamp?: VerificationStamp;
}

// 2. LOT GREEN BEAN PENGOLAH (Hasil Proses Wet/Dry Mill)
export interface ProcessedGreenBeanLot {
  id: string;
  processorId: string;
  processorName: string;
  sourceFarmerLotId: string;
  sourceFarmerName: string;
  sourceOrigin: string;
  variety: string;
  altitude: string;
  processMethod: 'Full Washed' | 'Natural / Dry' | 'Honey (Yellow/Red)' | 'Anaerobic Natural' | 'Wine Process' | 'Wet Hulled (Giling Basah)';
  fermentationTimeHours: number;
  dryingMethod: 'Solar Dryer Raised Bed' | 'Patio Penjemuran' | 'Mechanical Controlled Dryer';
  moistureContentPercent: number; // Kadar air, standar 10-12%
  waterActivityAw: number; // e.g. 0.55 - 0.60
  grade: 'Specialty Grade 1' | 'Grade 2' | 'Commercial Fine';
  defectCount: number; // Jumlah cacat fisik per 350g
  screenSize: string; // e.g. "Size 16-18 (Large Screen)"
  greenBeanWeightKg: number;
  availableWeightKg: number;
  pricePerKg: number;
  cuppingNotes: string[];
  processedDate: string;
  status: 'available' | 'sold' | 'in_warehouse';
  photoUrl?: string;
  // Goods data / riwayat ceri dari petani asal
  sourceBrix?: number;
  sourceHarvestDate?: string;
  sourcePickingMethod?: string;
  sourceTotalCherryWeightKg?: number;
  // Pengelolaan & Alokasi Limbah Olahan Kopi (Eco-Processing / Circular Economy)
  wasteManagement?: CoffeeWasteManagement;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationStamp?: VerificationStamp;
}

// Model Pengelolaan & Pemanfaatan Limbah Kopi
export interface CoffeeWasteManagement {
  wasteType: string; // e.g. 'Kulit Ceri (Pulp / Cascara)', 'Air Limbah Fermentasi', 'Kulit Tanduk (Husk)'
  utilization: string; // e.g. 'Bahan Baku Minuman Teh Cascara', 'Kompos Pupuk Organik Kebun (Sirkular)', 'Briket Biomassa'
  weightKgOrLiters: number; // Volume / berat limbah yang terkelola
  recipientOrLocation: string; // Penerima / lokasi pemanfaatan limbah
  processingMethod: string; // Metode olah ramah lingkungan
  ecoCertificate?: string; // e.g. 'sangrAI Zero-Waste Circular Standard'
  notes?: string;
  ecoRating?: number; // Rating bintang 1.0 - 5.0 ⭐
  ecoScore?: number; // Skor total 0 - 100
  diversionRatePercent?: number; // % pengalihan limbah
  carbonOffsetKg?: number; // Reduksi karbon CO2e (kg)
}

// Grading Standar Gudang (Dari Premium hingga Basic Commercial)
export type WarehouseGradeTier =
  | 'Grade 1 - Super Premium'
  | 'Grade 2 - Premium Grade'
  | 'Grade 3 - Medium Commercial'
  | 'Grade 4 - Basic Commercial';

// 3. LOT PENYIMPANAN GUDANG (Warehouse Inventory & QA)
export interface WarehouseLot {
  id: string;
  warehouseId: string;
  warehouseName: string;
  sourceGreenBeanId: string;
  sourceProcessorName: string;
  sourceFarmerName: string;
  origin: string;
  variety: string;
  altitude: string;
  processMethod: string;
  storageLocation: string; // e.g., "Gudang A-03 (Pallet Kayu Pine)"
  temperatureCelsius: number; // e.g., 20.5
  humidityPercent: number; // e.g., 55
  packagingType: 'GrainPro + Karung Goni 60kg' | 'Vacuum Bag 30kg' | 'Ecotact Hermetic 50kg';
  verifiedScaScore: number; // e.g., 86.75
  weightKg: number;
  availableWeightKg: number;
  pricePerKg: number;
  storedDate: string;
  status: 'available' | 'sold' | 'partial';
  notes?: string;
  // Incoming QC gate: goods received from an approved Purchase Order start as 'pending_qc' and
  // are only selectable by the roaster (Work Orders) once QC marks them 'passed'.
  qcStatus?: 'pending_qc' | 'passed' | 'rejected';
  qcNotes?: string;
  qcCheckedBy?: string;
  qcCheckedAt?: string;
  // Grading & Quality Assessment (Fokus Utama Gudang)
  gradeTier: WarehouseGradeTier;
  defectCount: number; // Nilai cacat per 350 gram (Standar SCA / SNI)
  screenSize: string; // Ukuran ayakan biji (Screen 18+, 16-17, 14-15, Asalan)
  moistureContentPercent?: number; // Kadar air (%)
  waterActivityAw?: number; // Aktivitas air (aW)
  purchasePricePerKg: number; // Harga beli modal dari pengolah untuk analisis margin
  targetMarket?: string; // Rekomendasi target pembeli (Roastery Specialty / Cafe / Industri)
  gradingNotes?: string;
  // Health Certificate (Karantina / Ekspor Gudang)
  hasHealthCertificate?: boolean; // Pilihan: Pakai sertifikat atau tidak
  healthCertificateNumber?: string; // Nomor Sertifikat Kesehatan (Health Certificate) jika ada
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationStamp?: VerificationStamp;
}

// 4. LOT BIJI SANGRAI ROASTER (Roasted Coffee Ready for Brew)
export interface RoastedBeanLot {
  id: string;
  roasterId: string;
  roasterName: string;
  sourceWarehouseLotId: string;
  origin: string;
  variety: string;
  altitude: string;
  processMethod: string;
  farmerName: string;
  roasterMachine: string; // e.g., "Giesen W6A" or "Probat UG15"
  roastLevel: 'Light Roast' | 'Light-Medium' | 'Medium Roast' | 'Medium-Dark' | 'Dark Roast';
  agtronNumber: number; // e.g., 68 (SCA Agtron Tile)
  roastDate: string;
  developmentTimeRatio: number; // DTR %, e.g., 14.8
  tastingNotes: string[]; // e.g., ["Bergamot", "Jasmine", "Sweet Orange", "Brown Sugar"]
  scaCuppingScore: number; // e.g., 87.5
  packageWeightGrams: number; // e.g., 200, 250, 1000
  totalPacks: number;
  availablePacks: number;
  pricePerPack: number;
  restingRecommendationDays: number; // e.g., 10 hari
  recommendedBrew: string[]; // e.g., ["V60", "Aeropress", "Espresso", "Japanese Drip"]
  status: 'available' | 'sold' | 'partial';
  photoUrl?: string;
  // Referensi asal Work Order MRP (jika dipublikasikan dari modul Production/Work Orders)
  sourceWorkOrderId?: string;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationStamp?: VerificationStamp;
}

// 5. INVENTARIS CAFE & PESANAN PEMILIK CAFE
export interface CafeInventoryItem {
  id: string;
  cafeId: string;
  cafeName: string;
  sourceRoastedBeanId: string;
  beanName: string;
  roasterName: string;
  origin: string;
  variety: string;
  processMethod: string;
  roastLevel: string;
  tastingNotes: string[];
  scaScore: number;
  packWeightGrams: number;
  packsInStock: number;
  purchaseDate: string;
  costPerPack: number;
  lineage: {
    farmerName: string;
    farmLocation: string;
    altitude: string;
    harvestDate: string;
    brix: number;
    processorName: string;
    fermentationTime: string;
    moisturePercent: number;
    warehouseName: string;
    storageConditions: string;
    warehouseScaScore: number;
    roasterName: string;
    roastProfile: string;
    roastDate: string;
  };
}

// 6. PRODUK RETAIL / HOUSE BLEND YANG DIJUAL OLEH COFFEE SHOP DI MARKETPLACE
export interface CafeRetailProduct {
  id: string;
  cafeId: string;
  cafeName: string;
  name: string;
  origin: string;
  variety: string;
  roastLevel: string;
  tastingNotes: string[];
  price: number;
  packageUnit: string; // e.g., "Pack 250g", "Box (5 Drip Bags)", "Botol 500ml"
  totalStock: number;
  availableStock: number;
  description: string;
  photoUrl: string;
  createdAt: string;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationStamp?: VerificationStamp;
}

// 7. STANDARDIZED ITEM UNTUK 1 MARKETPLACE TERPADU
export interface UnifiedMarketplaceItem {
  id: string;
  title: string;
  category: MarketplaceCategory;
  categoryLabel: string;
  sellerRole: UserRole;
  sellerName: string;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationStamp?: VerificationStamp;
  sellerOrg: string;
  origin: string;
  variety: string;
  processMethod?: string;
  roastLevel?: string;
  scaScore?: number;
  altitude?: string;
  tastingNotes: string[];
  price: number;
  priceUnit: string;
  availableStock: number;
  stockUnit: string;
  photoUrl: string;
  specsSummary: { label: string; value: string }[];
  gradeTier?: WarehouseGradeTier | string;
  canTrace: boolean;
  rawItem: FarmerHarvestLot | ProcessedGreenBeanLot | WarehouseLot | RoastedBeanLot | CafeRetailProduct;
}

export interface SupplyChainTransaction {
  id: string;
  date: string;
  fromRole: UserRole;
  fromName: string;
  toRole: UserRole;
  toName: string;
  itemName: string;
  quantity: string;
  totalAmount: number;
  status: 'Selesai' | 'Diproses' | 'Terkirim';
}
