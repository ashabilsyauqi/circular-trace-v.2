export type UserRole = 'petani' | 'pengolah' | 'gudang' | 'roaster' | 'cafe';

export type MarketplaceCategory =
  | 'cherry'               // 1. Ceri Kopi Segar / Panen Petani
  | 'green_bean_processor' // 2. Green Bean Hasil Olahan (Mill)
  | 'green_bean_warehouse' // 3. Green Bean Pergudangan & Ekspor (Silo QA)
  | 'roasted_bean';        // 4. Biji Kopi Sangrai Artisan (Roaster)

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  organization: string;
  location: string;
  avatar: string;
  phone: string;
  balance: number;
  bio?: string;
}

// 1. LOT HASIL PANEN PETANI (Cherry Segar / Gabah Kopi)
export interface FarmerHarvestLot {
  id: string;
  farmerId: string;
  farmerName: string;
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
}

// Model Pengelolaan & Pemanfaatan Limbah Kopi
export interface CoffeeWasteManagement {
  wasteType: string; // e.g. 'Kulit Ceri (Pulp / Cascara)', 'Air Limbah Fermentasi', 'Kulit Tanduk (Husk)'
  utilization: string; // e.g. 'Bahan Baku Minuman Teh Cascara', 'Kompos Pupuk Organik Kebun (Sirkular)', 'Briket Biomassa'
  weightKgOrLiters: number; // Volume / berat limbah yang terkelola
  recipientOrLocation: string; // Penerima / lokasi pemanfaatan limbah
  processingMethod: string; // Metode olah ramah lingkungan
  ecoCertificate?: string; // e.g. 'CCT Zero-Waste Circular Standard'
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
  storageLocation: string; // e.g., "Silo A-03 (Pallet Kayu Pine)"
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
  // Grading & Quality Assessment (Fokus Utama Gudang)
  gradeTier: WarehouseGradeTier;
  defectCount: number; // Nilai cacat per 350 gram (Standar SCA / SNI)
  screenSize: string; // Ukuran ayakan biji (Screen 18+, 16-17, 14-15, Asalan)
  moistureContentPercent?: number; // Kadar air (%)
  waterActivityAw?: number; // Aktivitas air (aW)
  purchasePricePerKg: number; // Harga beli modal dari pengolah untuk analisis margin
  targetMarket?: string; // Rekomendasi target pembeli (Roastery Specialty / Cafe / Industri)
  gradingNotes?: string;
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
}

// 7. STANDARDIZED ITEM UNTUK 1 MARKETPLACE TERPADU
export interface UnifiedMarketplaceItem {
  id: string;
  title: string;
  category: MarketplaceCategory;
  categoryLabel: string;
  sellerRole: UserRole;
  sellerName: string;
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
