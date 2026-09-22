import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../i18n/translations';
import {
  AppUser,
  UserRole,
  MarketplaceCategory,
  FarmerHarvestLot,
  ProcessedGreenBeanLot,
  WarehouseLot,
  RoastedBeanLot,
  CafeInventoryItem,
  CafeRetailProduct,
  UnifiedMarketplaceItem,
  SupplyChainTransaction,
  CoffeeWasteManagement,
  WarehouseGradeTier,
} from '../types/coffee';
import {
  WorkOrder,
  WorkOrderStatus,
  WorkOrderBatch,
  MasterRoastProfile,
  PurchaseOrder,
  POItem,
  GreenBeanSample,
  QCCuppingSession,
  RoasterPackagingItem,
  SalesOrder,
  RoasterMachine,
} from '../types/roasterErp';
import {
  ProcessingBatch,
  ProcessingStageId,
  DryingDayLog,
  ProcessorCherryStockItem,
} from '../types/processorErp';
import {
  MOCK_USERS,
  INITIAL_FARMER_LOTS,
  INITIAL_PROCESSED_LOTS,
  INITIAL_WAREHOUSE_LOTS,
  INITIAL_ROASTED_LOTS,
  INITIAL_CAFE_ITEMS,
  INITIAL_CAFE_PRODUCTS,
  INITIAL_TRANSACTIONS,
} from '../data/mockData';
import {
  INITIAL_WORK_ORDERS,
  INITIAL_MASTER_PROFILES,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_GREEN_SAMPLES,
  INITIAL_QC_SESSIONS,
  INITIAL_PACKAGING_ITEMS,
  INITIAL_SALES_ORDERS,
  INITIAL_ROASTER_MACHINES,
} from '../data/mockRoasterErpData';
import {
  INITIAL_PROCESSING_BATCHES,
  INITIAL_PROCESSOR_CHERRY_STOCK,
} from '../data/mockProcessorErpData';
import { calculateProcessorEcoRating } from '../utils/ecoRating';
import { validateStageQualityGate } from '../utils/coffeeQualityGates';

interface CoffeeContextType {
  currentUser: AppUser | null;
  users: AppUser[];
  loginAsRole: (role: UserRole) => void;
  loginAsUser: (userId: string) => void;
  registerUser?: (userData: {
    name: string;
    role: UserRole;
    organization: string;
    location: string;
    phone: string;
    bio?: string;
  }) => AppUser;
  logout: () => void;
  activeView: 'landing' | 'dashboard' | 'marketplace' | 'transactions';
  setActiveView: (view: 'landing' | 'dashboard' | 'marketplace' | 'transactions') => void;
  roasterActiveTab: 'dashboard' | 'work_orders' | 'purchasing' | 'production' | 'qc' | 'inventory' | 'selling' | 'marketplace' | 'history';
  setRoasterActiveTab: (tab: 'dashboard' | 'work_orders' | 'purchasing' | 'production' | 'qc' | 'inventory' | 'selling' | 'marketplace' | 'history') => void;
  processorActiveTab: 'dashboard' | 'sourcing' | 'batches' | 'inventory' | 'history';
  setProcessorActiveTab: (tab: 'dashboard' | 'sourcing' | 'batches' | 'inventory' | 'history') => void;
  processorCherryStock: ProcessorCherryStockItem[];
  buyCherryToStock: (farmerLotId: string, boughtKg: number) => ProcessorCherryStockItem | null;
  processingBatches: ProcessingBatch[];
  createProcessingBatch: (params: {
    sourceFarmerLotId?: string;
    sourceCherryStockId?: string;
    boughtCherryKg: number;
    method: ProcessingBatch['fermentationLog']['method'];
    dryingMethod: ProcessingBatch['dryingLog']['dryingMethod'];
    operatorName: string;
    notes?: string;
    wasteData?: CoffeeWasteManagement;
  }) => ProcessingBatch | null;
  advanceBatchStage: (batchId: string, nextStage: ProcessingStageId) => { success: boolean; message: string; errors?: string[] };
  updateBatchStageLog: (batchId: string, stageId: ProcessingStageId, logData: any) => void;
  addDryingDayLog: (batchId: string, dayLog: DryingDayLog) => void;
  finalizeBatchAndPublish: (
    batchId: string,
    packingData: {
      baggingType: ProcessingBatch['packingLog']['baggingType'];
      pricePerKg: number;
      cuppingNotes: string[];
      grade: ProcessedGreenBeanLot['grade'];
      notes?: string;
    }
  ) => ProcessedGreenBeanLot | null;
  farmerLots: FarmerHarvestLot[];
  processedLots: ProcessedGreenBeanLot[];
  warehouseLots: WarehouseLot[];
  roastedLots: RoastedBeanLot[];
  cafeInventory: CafeInventoryItem[];
  cafeProducts: CafeRetailProduct[];
  transactions: SupplyChainTransaction[];
  unifiedMarketplaceItems: UnifiedMarketplaceItem[];
  addFarmerHarvest: (
    lotData: Omit<FarmerHarvestLot, 'id' | 'createdAt' | 'status' | 'availableWeightKg' | 'farmerId' | 'farmerName'>
  ) => FarmerHarvestLot | null;
  buyCherryAndCreateProcess: (
    farmerLotId: string,
    boughtKg: number,
    processData: {
      processMethod: ProcessedGreenBeanLot['processMethod'];
      fermentationTimeHours: number;
      dryingMethod: ProcessedGreenBeanLot['dryingMethod'];
      moistureContentPercent: number;
      waterActivityAw: number;
      grade: ProcessedGreenBeanLot['grade'];
      defectCount: number;
      screenSize: string;
      greenBeanWeightKg: number;
      pricePerKg: number;
      cuppingNotes: string[];
    },
    wasteData?: CoffeeWasteManagement
  ) => ProcessedGreenBeanLot | null;
  updateProcessedLotWaste: (lotId: string, wasteData: CoffeeWasteManagement) => void;
  buyGreenBeanAndStoreWarehouse: (
    processedLotId: string,
    boughtKg: number,
    storageData: {
      storageLocation: string;
      temperatureCelsius: number;
      humidityPercent: number;
      packagingType: WarehouseLot['packagingType'];
      verifiedScaScore: number;
      pricePerKg: number;
      notes?: string;
      gradeTier?: WarehouseGradeTier;
      defectCount?: number;
      screenSize?: string;
      purchasePricePerKg?: number;
      targetMarket?: string;
      gradingNotes?: string;
    }
  ) => void;
  updateWarehouseLotGrading: (
    lotId: string,
    gradingData: {
      gradeTier: WarehouseGradeTier;
      defectCount: number;
      screenSize: string;
      verifiedScaScore: number;
      pricePerKg: number;
      targetMarket?: string;
      notes?: string;
    }
  ) => void;
  buyWarehouseBeanAndRoast: (
    warehouseLotId: string,
    boughtKg: number,
    roastData: {
      roasterMachine: string;
      roastLevel: RoastedBeanLot['roastLevel'];
      agtronNumber: number;
      developmentTimeRatio: number;
      tastingNotes: string[];
      scaCuppingScore: number;
      packageWeightGrams: number;
      totalPacks: number;
      pricePerPack: number;
      restingRecommendationDays: number;
      recommendedBrew: string[];
    }
  ) => void;
  publishRoastedLotFromWorkOrder: (
    workOrderId: string,
    listingData: {
      tastingNotes: string[];
      scaCuppingScore: number;
      packageWeightGrams: number;
      totalPacks: number;
      pricePerPack: number;
      restingRecommendationDays: number;
      recommendedBrew: string[];
    }
  ) => RoastedBeanLot | null;
  buyRoastedBeansForCafe: (roastedLotId: string, packCount: number) => void;
  addCafeRetailProduct: (
    productData: Omit<CafeRetailProduct, 'id' | 'cafeId' | 'cafeName' | 'createdAt' | 'availableStock'>
  ) => void;
  buyFromUnifiedMarketplace: (
    item: UnifiedMarketplaceItem,
    quantity: number
  ) => { success: boolean; message: string };
  resetToDefaultData: () => void;
  getTraceabilityForRoastedLot: (roastedLotId: string) => {
    farmerLot?: FarmerHarvestLot;
    processedLot?: ProcessedGreenBeanLot;
    warehouseLot?: WarehouseLot;
    roastedLot?: RoastedBeanLot;
  };
  // --- QREMA ROASTERY ERP STATE & METHODS ---
  workOrders: WorkOrder[];
  masterProfiles: MasterRoastProfile[];
  purchaseOrders: PurchaseOrder[];
  greenBeanSamples: GreenBeanSample[];
  qcSessions: QCCuppingSession[];
  packagingInventory: RoasterPackagingItem[];
  salesOrders: SalesOrder[];
  roasterMachines: RoasterMachine[];
  createWorkOrder: (
    woData: Omit<WorkOrder, 'id' | 'woNumber' | 'createdAt' | 'batches' | 'actualRoastedKg' | 'actualGreenKg' | 'weightLossPercent'>
  ) => WorkOrder;
  updateWorkOrderStatus: (id: string, status: WorkOrderStatus) => void;
  executeRoastBatch: (woId: string, batchData: Omit<WorkOrderBatch, 'executedAt'>) => void;
  createPurchaseOrder: (poData: Omit<PurchaseOrder, 'id' | 'poNumber'>) => PurchaseOrder;
  createPOFromMarketplace: (item: UnifiedMarketplaceItem, quantityKg: number) => { success: boolean; message: string };
  submitPurchaseOrderForApproval: (poId: string) => void;
  approvePurchaseOrder: (poId: string, signedByName: string) => void;
  rejectPurchaseOrder: (poId: string) => void;
  receivePurchaseOrder: (poId: string) => void;
  submitIncomingQC: (
    lotId: string,
    result: { passed: boolean; scaScore: number; moisturePercent: number; notes: string; checkedBy: string }
  ) => void;
  createGreenBeanSample: (sampleData: Omit<GreenBeanSample, 'id' | 'sampleCode' | 'receivedDate'>) => GreenBeanSample;
  updateGreenBeanSample: (id: string, status: GreenBeanSample['status'], evaluationNotes?: string) => void;
  createMasterProfile: (profileData: Omit<MasterRoastProfile, 'id'>) => MasterRoastProfile;
  createCuppingSession: (qcData: Omit<QCCuppingSession, 'id' | 'sessionCode' | 'date'>) => QCCuppingSession;
  createSalesOrder: (soData: Omit<SalesOrder, 'id' | 'soNumber' | 'orderDate'>) => SalesOrder;
  dispatchSalesOrder: (soId: string) => void;
  updatePackagingStock: (id: string, qtyDelta: number) => void;
  // App shell settings: language (ID/EN) and whether the demo role-switcher shows in the
  // navbar/sidebar. Both persist to localStorage like everything else here.
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  demoModeEnabled: boolean;
  setDemoModeEnabled: (enabled: boolean) => void;
}

const CoffeeContext = createContext<CoffeeContextType | undefined>(undefined);

export const CoffeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('cct_currentUser');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_USERS[0];
      }
    }
    return MOCK_USERS[0];
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('cct_language');
    return saved === 'en' || saved === 'id' ? saved : 'id';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cct_language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] ?? translations.id[key] ?? key;
  };

  const [demoModeEnabled, setDemoModeEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('cct_demoMode');
    return saved === null ? true : saved === 'true';
  });

  const setDemoModeEnabled = (enabled: boolean) => {
    setDemoModeEnabledState(enabled);
    localStorage.setItem('cct_demoMode', String(enabled));
  };

  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('cct_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'marketplace' | 'transactions'>('landing');
  const [roasterActiveTab, setRoasterActiveTab] = useState<
    'dashboard' | 'work_orders' | 'purchasing' | 'production' | 'qc' | 'inventory' | 'selling' | 'marketplace' | 'history'
  >('dashboard');
  const [processorActiveTab, setProcessorActiveTab] = useState<
    'dashboard' | 'sourcing' | 'batches' | 'inventory' | 'history'
  >('dashboard');

  const [processingBatches, setProcessingBatches] = useState<ProcessingBatch[]>(() => {
    const saved = localStorage.getItem('cct_processingBatches');
    return saved ? JSON.parse(saved) : INITIAL_PROCESSING_BATCHES;
  });

  const [processorCherryStock, setProcessorCherryStock] = useState<ProcessorCherryStockItem[]>(() => {
    const saved = localStorage.getItem('cct_processorCherryStock');
    return saved ? JSON.parse(saved) : INITIAL_PROCESSOR_CHERRY_STOCK;
  });

  useEffect(() => {
    localStorage.setItem('cct_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cct_processingBatches', JSON.stringify(processingBatches));
  }, [processingBatches]);

  useEffect(() => {
    localStorage.setItem('cct_processorCherryStock', JSON.stringify(processorCherryStock));
  }, [processorCherryStock]);

  const [farmerLots, setFarmerLots] = useState<FarmerHarvestLot[]>(() => {
    const saved = localStorage.getItem('cct_farmerLots');
    return saved ? JSON.parse(saved) : INITIAL_FARMER_LOTS;
  });

  const [processedLots, setProcessedLots] = useState<ProcessedGreenBeanLot[]>(() => {
    const saved = localStorage.getItem('cct_processedLots');
    return saved ? JSON.parse(saved) : INITIAL_PROCESSED_LOTS;
  });

  const [warehouseLots, setWarehouseLots] = useState<WarehouseLot[]>(() => {
    const saved = localStorage.getItem('cct_warehouseLots');
    return saved ? JSON.parse(saved) : INITIAL_WAREHOUSE_LOTS;
  });

  const [roastedLots, setRoastedLots] = useState<RoastedBeanLot[]>(() => {
    const saved = localStorage.getItem('cct_roastedLots');
    return saved ? JSON.parse(saved) : INITIAL_ROASTED_LOTS;
  });

  const [cafeInventory, setCafeInventory] = useState<CafeInventoryItem[]>(() => {
    const saved = localStorage.getItem('cct_cafeInventory');
    return saved ? JSON.parse(saved) : INITIAL_CAFE_ITEMS;
  });

  const [cafeProducts, setCafeProducts] = useState<CafeRetailProduct[]>(() => {
    const saved = localStorage.getItem('cct_cafeProducts');
    return saved ? JSON.parse(saved) : INITIAL_CAFE_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<SupplyChainTransaction[]>(() => {
    const saved = localStorage.getItem('cct_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // --- QREMA ROASTERY ERP STATE ---
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    const saved = localStorage.getItem('cct_workOrders');
    return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
  });

  const [masterProfiles, setMasterProfiles] = useState<MasterRoastProfile[]>(() => {
    const saved = localStorage.getItem('cct_masterProfiles');
    return saved ? JSON.parse(saved) : INITIAL_MASTER_PROFILES;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('cct_purchaseOrders');
    return saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS;
  });

  const [greenBeanSamples, setGreenBeanSamples] = useState<GreenBeanSample[]>(() => {
    const saved = localStorage.getItem('cct_greenBeanSamples');
    return saved ? JSON.parse(saved) : INITIAL_GREEN_SAMPLES;
  });

  const [qcSessions, setQcSessions] = useState<QCCuppingSession[]>(() => {
    const saved = localStorage.getItem('cct_qcSessions');
    return saved ? JSON.parse(saved) : INITIAL_QC_SESSIONS;
  });

  const [packagingInventory, setPackagingInventory] = useState<RoasterPackagingItem[]>(() => {
    const saved = localStorage.getItem('cct_packagingInventory');
    return saved ? JSON.parse(saved) : INITIAL_PACKAGING_ITEMS;
  });

  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(() => {
    const saved = localStorage.getItem('cct_salesOrders');
    return saved ? JSON.parse(saved) : INITIAL_SALES_ORDERS;
  });

  const [roasterMachines, setRoasterMachines] = useState<RoasterMachine[]>(() => {
    const saved = localStorage.getItem('cct_roasterMachines');
    return saved ? JSON.parse(saved) : INITIAL_ROASTER_MACHINES;
  });

  // Sync state to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cct_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cct_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cct_farmerLots', JSON.stringify(farmerLots));
  }, [farmerLots]);

  useEffect(() => {
    localStorage.setItem('cct_processedLots', JSON.stringify(processedLots));
  }, [processedLots]);

  useEffect(() => {
    localStorage.setItem('cct_warehouseLots', JSON.stringify(warehouseLots));
  }, [warehouseLots]);

  useEffect(() => {
    localStorage.setItem('cct_roastedLots', JSON.stringify(roastedLots));
  }, [roastedLots]);

  useEffect(() => {
    localStorage.setItem('cct_cafeInventory', JSON.stringify(cafeInventory));
  }, [cafeInventory]);

  useEffect(() => {
    localStorage.setItem('cct_cafeProducts', JSON.stringify(cafeProducts));
  }, [cafeProducts]);

  useEffect(() => {
    localStorage.setItem('cct_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('cct_workOrders', JSON.stringify(workOrders));
  }, [workOrders]);

  useEffect(() => {
    localStorage.setItem('cct_masterProfiles', JSON.stringify(masterProfiles));
  }, [masterProfiles]);

  useEffect(() => {
    localStorage.setItem('cct_purchaseOrders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('cct_greenBeanSamples', JSON.stringify(greenBeanSamples));
  }, [greenBeanSamples]);

  useEffect(() => {
    localStorage.setItem('cct_qcSessions', JSON.stringify(qcSessions));
  }, [qcSessions]);

  useEffect(() => {
    localStorage.setItem('cct_packagingInventory', JSON.stringify(packagingInventory));
  }, [packagingInventory]);

  useEffect(() => {
    localStorage.setItem('cct_salesOrders', JSON.stringify(salesOrders));
  }, [salesOrders]);

  useEffect(() => {
    localStorage.setItem('cct_roasterMachines', JSON.stringify(roasterMachines));
  }, [roasterMachines]);

  const loginAsRole = (role: UserRole) => {
    const matched = users.find((u) => u.role === role) || MOCK_USERS.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      setActiveView('dashboard');
    }
  };

  const loginAsUser = (userId: string) => {
    const matched = users.find((u) => u.id === userId) || MOCK_USERS.find((u) => u.id === userId);
    if (matched) {
      setCurrentUser(matched);
      setActiveView('dashboard');
    }
  };

  const registerUser = (userData: {
    name: string;
    role: UserRole;
    organization: string;
    location: string;
    phone: string;
    bio?: string;
  }): AppUser => {
    const defaultAvatars: Record<UserRole, string> = {
      petani: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=150&auto=format&fit=crop&q=80',
      pengolah: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      gudang: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      roaster: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      cafe: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    const newUser: AppUser = {
      id: `user-${userData.role}-${Date.now().toString().slice(-4)}`,
      name: userData.name,
      role: userData.role,
      organization: userData.organization,
      location: userData.location,
      phone: userData.phone,
      avatar: defaultAvatars[userData.role] || defaultAvatars.roaster,
      balance: 50000000,
      bio: userData.bio || `Pengguna terdaftar baru sebagai ${userData.role}`,
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setActiveView('dashboard');
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addFarmerHarvest = (
    lotData: Omit<FarmerHarvestLot, 'id' | 'createdAt' | 'status' | 'availableWeightKg' | 'farmerId' | 'farmerName'>
  ): FarmerHarvestLot | null => {
    if (!currentUser) return null;
    const newLotId = `LOT-PTN-${Date.now().toString().slice(-4)}`;
    const newLot: FarmerHarvestLot = {
      ...lotData,
      id: newLotId,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      availableWeightKg: lotData.totalWeightKg,
      status: 'available',
      createdAt: new Date().toISOString().split('T')[0],
      photoUrl:
        lotData.photoUrl ||
        'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80',
    };
    setFarmerLots((prev) => [newLot, ...prev]);
    return newLot;
  };

  // 2. Pengolah konversi cherry ke Green Bean
  const buyCherryAndCreateProcess = (
    farmerLotId: string,
    boughtKg: number,
    processData: {
      processMethod: ProcessedGreenBeanLot['processMethod'];
      fermentationTimeHours: number;
      dryingMethod: ProcessedGreenBeanLot['dryingMethod'];
      moistureContentPercent: number;
      waterActivityAw: number;
      grade: ProcessedGreenBeanLot['grade'];
      defectCount: number;
      screenSize: string;
      greenBeanWeightKg: number;
      pricePerKg: number;
      cuppingNotes: string[];
    },
    wasteData?: CoffeeWasteManagement
  ): ProcessedGreenBeanLot | null => {
    if (!currentUser) return null;
    const sourceFarmerLot = farmerLots.find((l) => l.id === farmerLotId);
    if (!sourceFarmerLot) return null;

    const remainingKg = Math.max(0, sourceFarmerLot.availableWeightKg - boughtKg);
    setFarmerLots((prev) =>
      prev.map((lot) =>
        lot.id === farmerLotId
          ? {
              ...lot,
              availableWeightKg: remainingKg,
              status: remainingKg === 0 ? 'sold' : 'partial',
            }
          : lot
      )
    );

    const totalTrx = boughtKg * sourceFarmerLot.pricePerKg;
    const newTrx: SupplyChainTransaction = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      fromRole: 'petani',
      fromName: sourceFarmerLot.farmerName,
      toRole: 'pengolah',
      toName: currentUser.name,
      itemName: `Cherry ${sourceFarmerLot.variety} (${boughtKg} kg)`,
      quantity: `${boughtKg} kg`,
      totalAmount: totalTrx,
      status: 'Selesai',
    };
    setTransactions((prev) => [newTrx, ...prev]);

    const newGreenBeanId = `GB-PGL-${Date.now().toString().slice(-4)}`;
    const newGreenBean: ProcessedGreenBeanLot = {
      id: newGreenBeanId,
      processorId: currentUser.id,
      processorName: currentUser.organization || currentUser.name,
      sourceFarmerLotId: sourceFarmerLot.id,
      sourceFarmerName: sourceFarmerLot.farmerName,
      sourceOrigin: sourceFarmerLot.farmLocation,
      variety: sourceFarmerLot.variety,
      altitude: sourceFarmerLot.altitude,
      processMethod: processData.processMethod,
      fermentationTimeHours: processData.fermentationTimeHours,
      dryingMethod: processData.dryingMethod,
      moistureContentPercent: processData.moistureContentPercent,
      waterActivityAw: processData.waterActivityAw,
      grade: processData.grade,
      defectCount: processData.defectCount,
      screenSize: processData.screenSize,
      greenBeanWeightKg: processData.greenBeanWeightKg,
      availableWeightKg: processData.greenBeanWeightKg,
      pricePerKg: processData.pricePerKg,
      cuppingNotes: processData.cuppingNotes,
      processedDate: new Date().toISOString().split('T')[0],
      status: 'available',
      photoUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
      sourceBrix: sourceFarmerLot.brix,
      sourceHarvestDate: sourceFarmerLot.harvestDate,
      sourcePickingMethod: sourceFarmerLot.pickingMethod,
      sourceTotalCherryWeightKg: boughtKg,
      wasteManagement: (() => {
        const rawWaste = wasteData || {
          wasteType: 'Kulit Ceri (Pulp / Cascara)',
          utilization: 'Bahan Baku Minuman Teh Cascara & Kompos Sirkular',
          weightKgOrLiters: Math.round(boughtKg * 0.45),
          recipientOrLocation: 'Kelompok Tani Lestari & Rumah Olah Kompos',
          processingMethod: 'Solar Dryer Raised Bed & Kompos Aerobik 30 Hari',
          ecoCertificate: 'sangrAI Zero-Waste Circular Standard',
          notes: 'Pulp ceri dialokasikan untuk teh cascara dan pupuk organik.',
        };
        const ratingCalc = calculateProcessorEcoRating(rawWaste, boughtKg, processData.greenBeanWeightKg);
        return {
          ...rawWaste,
          ecoRating: ratingCalc.starRating,
          ecoScore: ratingCalc.ecoScore,
          diversionRatePercent: ratingCalc.diversionRatePercent,
          carbonOffsetKg: ratingCalc.carbonOffsetKg,
        };
      })(),
    };
    setProcessedLots((prev) => [newGreenBean, ...prev]);
    return newGreenBean;
  };

  const updateProcessedLotWaste = (lotId: string, wasteData: CoffeeWasteManagement) => {
    setProcessedLots((prev) =>
      prev.map((lot) => {
        if (lot.id !== lotId) return lot;
        const ratingCalc = calculateProcessorEcoRating(
          wasteData,
          lot.sourceTotalCherryWeightKg || lot.greenBeanWeightKg * 5,
          lot.greenBeanWeightKg
        );
        const enrichedWaste: CoffeeWasteManagement = {
          ...wasteData,
          ecoRating: ratingCalc.starRating,
          ecoScore: ratingCalc.ecoScore,
          diversionRatePercent: ratingCalc.diversionRatePercent,
          carbonOffsetKg: ratingCalc.carbonOffsetKg,
        };
        return { ...lot, wasteManagement: enrichedWaste };
      })
    );
  };

  // --- COFFEE POST-HARVEST PROCESSING & MANUFACTURING 7-STAGE METHODS ---

  const buyCherryToStock = (farmerLotId: string, boughtKg: number): ProcessorCherryStockItem | null => {
    if (!currentUser) return null;
    const sourceFarmerLot = farmerLots.find((l) => l.id === farmerLotId);
    if (!sourceFarmerLot || sourceFarmerLot.availableWeightKg < boughtKg) return null;

    const remainingKg = Math.max(0, sourceFarmerLot.availableWeightKg - boughtKg);

    setFarmerLots((prev) =>
      prev.map((lot) =>
        lot.id === farmerLotId
          ? {
              ...lot,
              availableWeightKg: remainingKg,
              status: remainingKg === 0 ? 'sold' : 'partial',
            }
          : lot
      )
    );

    const totalCost = boughtKg * sourceFarmerLot.pricePerKg;
    const newTrx: SupplyChainTransaction = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      fromRole: 'petani',
      fromName: sourceFarmerLot.farmerName,
      toRole: 'pengolah',
      toName: currentUser.organization || currentUser.name,
      itemName: `Cherry Segar ${sourceFarmerLot.variety} (${boughtKg} kg)`,
      quantity: `${boughtKg} kg`,
      totalAmount: totalCost,
      status: 'Selesai',
    };
    setTransactions((prev) => [newTrx, ...prev]);

    const newStockItem: ProcessorCherryStockItem = {
      id: `STK-CHR-${Date.now().toString().slice(-4)}`,
      processorId: currentUser.id,
      sourceFarmerLotId: sourceFarmerLot.id,
      farmerName: sourceFarmerLot.farmerName,
      origin: sourceFarmerLot.farmLocation,
      variety: sourceFarmerLot.variety,
      altitude: sourceFarmerLot.altitude,
      harvestDate: sourceFarmerLot.harvestDate,
      pickingMethod: sourceFarmerLot.pickingMethod,
      brix: sourceFarmerLot.brix,
      totalWeightKg: boughtKg,
      availableWeightKg: boughtKg,
      purchasePricePerKg: sourceFarmerLot.pricePerKg,
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: `Stok ceri segar dari petani ${sourceFarmerLot.farmerName} (${sourceFarmerLot.farmLocation}).`,
      photoUrl: sourceFarmerLot.photoUrl,
    };

    setProcessorCherryStock((prev) => [newStockItem, ...prev]);
    return newStockItem;
  };

  const createProcessingBatch = (params: {
    sourceFarmerLotId?: string;
    sourceCherryStockId?: string;
    boughtCherryKg: number;
    method: ProcessingBatch['fermentationLog']['method'];
    dryingMethod: ProcessingBatch['dryingLog']['dryingMethod'];
    operatorName: string;
    notes?: string;
    wasteData?: CoffeeWasteManagement;
  }): ProcessingBatch | null => {
    if (!currentUser) return null;

    // Check if sourcing from processorCherryStock
    let cherryStock = params.sourceCherryStockId
      ? processorCherryStock.find((s) => s.id === params.sourceCherryStockId)
      : processorCherryStock.find((s) => s.sourceFarmerLotId === params.sourceFarmerLotId && s.availableWeightKg >= params.boughtCherryKg);

    let sourceFarmerLot = farmerLots.find((l) => l.id === (cherryStock?.sourceFarmerLotId || params.sourceFarmerLotId));

    if (!cherryStock && !sourceFarmerLot) return null;

    const boughtKg = params.boughtCherryKg;

    if (cherryStock) {
      // Deduct from cherry stock in processor's warehouse
      const remainingStock = Math.max(0, cherryStock.availableWeightKg - boughtKg);
      setProcessorCherryStock((prev) =>
        prev.map((s) =>
          s.id === cherryStock!.id
            ? { ...s, availableWeightKg: remainingStock }
            : s
        )
      );
    } else if (sourceFarmerLot) {
      // Fallback: direct deduct from farmer lot
      const remainingKg = Math.max(0, sourceFarmerLot.availableWeightKg - boughtKg);
      setFarmerLots((prev) =>
        prev.map((lot) =>
          lot.id === sourceFarmerLot!.id
            ? {
                ...lot,
                availableWeightKg: remainingKg,
                status: remainingKg === 0 ? 'sold' : 'partial',
              }
            : lot
        )
      );

      const totalTrx = boughtKg * sourceFarmerLot.pricePerKg;
      const newTrx: SupplyChainTransaction = {
        id: `TRX-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        fromRole: 'petani',
        fromName: sourceFarmerLot.farmerName,
        toRole: 'pengolah',
        toName: currentUser.name,
        itemName: `Cherry Segar ${sourceFarmerLot.variety} (${boughtKg} kg)`,
        quantity: `${boughtKg} kg`,
        totalAmount: totalTrx,
        status: 'Selesai',
      };
      setTransactions((prev) => [newTrx, ...prev]);
    }

    const farmerName = cherryStock?.farmerName || sourceFarmerLot?.farmerName || 'Petani Mitra';
    const origin = cherryStock?.origin || sourceFarmerLot?.farmLocation || 'Pangalengan, Jawa Barat';
    const variety = cherryStock?.variety || sourceFarmerLot?.variety || 'Arabica Typica';
    const altitude = cherryStock?.altitude || sourceFarmerLot?.altitude || '1.550 mdpl';
    const brix = cherryStock?.brix || sourceFarmerLot?.brix || 21.5;
    const sourceLotId = cherryStock?.sourceFarmerLotId || sourceFarmerLot?.id || params.sourceFarmerLotId || 'LOT-PTN-001';

    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '').slice(0, 6);
    const randomSuffix = Date.now().toString().slice(-3);
    const newBatchId = `PROC-${dateStr}-${randomSuffix}`;
    const batchCode = `LOT-${dateStr}-ARB-${randomSuffix}`;

    const estGreenKg = Math.round(boughtKg * 0.16);
    const estParchmentKg = Math.round(boughtKg * 0.20);
    const estHuskKg = Math.round(boughtKg * 0.04);

    const rawWaste = params.wasteData || {
      wasteType: 'Kulit Ceri (Pulp / Cascara)',
      utilization: 'Bahan Baku Minuman Teh Cascara & Kompos Sirkular',
      weightKgOrLiters: Math.round(boughtKg * 0.45),
      recipientOrLocation: 'Kelompok Tani Petani Asal & Rumah Kompos Organik',
      processingMethod: 'Solar Dryer Raised Bed (Food Grade) & Kompos Aerobik 30 Hari',
      ecoCertificate: 'sangrAI Zero-Waste Circular Standard',
      notes: 'Kulit ceri disortir higienis untuk teh cascara dan ampas dikomposkan.',
    };

    const ratingCalc = calculateProcessorEcoRating(rawWaste, boughtKg, estGreenKg);
    const finalWaste: CoffeeWasteManagement = {
      ...rawWaste,
      ecoRating: ratingCalc.starRating,
      ecoScore: ratingCalc.ecoScore,
      diversionRatePercent: ratingCalc.diversionRatePercent,
      carbonOffsetKg: ratingCalc.carbonOffsetKg,
    };

    const newBatch: ProcessingBatch = {
      id: newBatchId,
      batchCode,
      processorId: currentUser.id,
      processorName: currentUser.organization || currentUser.name,
      sourceFarmerLotId: sourceLotId,
      sourceFarmerName: farmerName,
      sourceOrigin: origin,
      variety,
      altitude,
      currentStage: 'intake_sorting',
      status: 'in_progress',
      startDate: new Date().toISOString().split('T')[0],
      intakeLog: {
        cherryWeightKg: boughtKg,
        floatersWeightKg: Math.round(boughtKg * 0.04),
        sinkersWeightKg: Math.round(boughtKg * 0.96),
        brix,
        sortingDate: new Date().toISOString().split('T')[0],
        destoned: true,
        visualQualityGrade: 'A (95%+ Petik Merah)',
        operatorName: params.operatorName || 'Petugas Intake Stasiun',
        notes: params.notes || `Penerimaan ${boughtKg} kg ceri varietas ${variety} dari ${farmerName}.`,
      },
      fermentationLog: {
        tankId: `TANK-${params.method.includes('Anaerobic') ? 'ANAEROB' : 'FERM'}-01`,
        method: params.method,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 72 * 3600000).toISOString(),
        durationHours: 72,
        startPh: 5.8,
        endPh: 4.1,
        slurryTempCelsius: 19.5,
        ambientTempCelsius: 22.0,
        inoculumYeast: 'Lalcafe Intenso Yeast',
        washWaterLiters: params.method === 'Full Washed' ? Math.round(boughtKg * 1.2) : 0,
        operatorName: params.operatorName || currentUser.name,
        notes: 'Inokulasi fermentasi awal terstandarisasi.',
      },
      dryingLog: {
        bedId: 'RAISED-BED-A01',
        dryingMethod: params.dryingMethod,
        startDate: new Date().toISOString().split('T')[0],
        finalMoisturePercent: 52.0,
        targetMoisturePassed: false,
        dailyLogs: [
          {
            dayNumber: 1,
            date: new Date().toISOString().split('T')[0],
            moisturePercent: 52.0,
            ambientTempCelsius: 29.5,
            rhPercent: 58,
            turningFrequency: 'Tiap 2 Jam',
            notes: 'Mulai proses penjemuran ceri/gabah basah.',
          },
        ],
        operatorName: params.operatorName || currentUser.name,
        notes: 'Target pengeringan hingga kadar air <= 12.0%.',
      },
      conditioningLog: {
        siloBinId: 'SILO-RESTING-01',
        packagingType: 'GrainPro Hermetic 50kg',
        startDate: new Date().toISOString().split('T')[0],
        targetRestingDays: 30,
        completedDays: 0,
        ambientTempCelsius: 20.0,
        ambientRhPercent: 55,
        moistureStabilizedPercent: 11.2,
        waterActivityAw: 0.56,
        operatorName: params.operatorName || currentUser.name,
        notes: 'Menunggu proses penjemuran selesai.',
      },
      millingLog: {
        millingDate: new Date().toISOString().split('T')[0],
        machineId: 'Pinhalense DH-500 Dry Huller',
        inputParchmentWeightKg: estParchmentKg,
        outputGreenBeanWeightKg: estGreenKg,
        outputHuskWeightKg: estHuskKg,
        outputDustWeightKg: 5,
        millingEfficiencyPercent: 50.0,
        operatorName: params.operatorName || currentUser.name,
        notes: 'Hulling pasca resting.',
      },
      qcAssessment: {
        assessmentDate: new Date().toISOString().split('T')[0],
        inspectorName: 'Q-Grader Stasiun',
        sampleWeightGrams: 350,
        defects: {
          primaryDefects: 0,
          secondaryDefects: 2,
          totalScoreValue: 0.4,
        },
        screenDistribution: {
          screen18PlusKg: Math.round(estGreenKg * 0.7),
          screen16_17Kg: Math.round(estGreenKg * 0.25),
          screen14_15Kg: Math.round(estGreenKg * 0.05),
          peaberryKg: 0,
        },
        finalMoisturePercent: 11.2,
        waterActivityAw: 0.56,
        densityGramsPerLiter: 720,
        calculatedGrade: 'Specialty Grade 1',
        scaCuppingScore: 87.5,
        cuppingNotes: ['Floral', 'Citrus', 'Brown Sugar'],
        notes: 'Evaluasi mutu fisik & sensori.',
      },
      packingLog: {
        closureDate: new Date().toISOString().split('T')[0],
        finalGreenBeanWeightKg: estGreenKg,
        baggingType: 'GrainPro 60kg + Karung Goni',
        totalBags: Math.max(1, Math.ceil(estGreenKg / 60)),
        assignedLotNumber: `GB-${batchCode}`,
        qrCodeUrl: `https://cct-coffee.dutaglobaltech.com/scan/${newBatchId}`,
        eudrComplianceVerified: true,
        closedBy: currentUser.name,
        finalStatus: 'siap_jual_marketplace',
        notes: 'Kemas hermetik GrainPro + karung goni.',
      },
      wasteManagement: finalWaste,
      targetMarketplacePricePerKg: 125000,
      photoUrl: sourceFarmerLot?.photoUrl || cherryStock?.photoUrl || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    };

    setProcessingBatches((prev) => [newBatch, ...prev]);
    return newBatch;
  };

  const advanceBatchStage = (
    batchId: string,
    nextStage: ProcessingStageId
  ): { success: boolean; message: string; errors?: string[] } => {
    const batch = processingBatches.find((b) => b.id === batchId);
    if (!batch) return { success: false, message: 'Batch tidak ditemukan.' };

    const validation = validateStageQualityGate(batch, nextStage);
    if (!validation.canAdvance) {
      return {
        success: false,
        message: validation.blockingErrors.join(' '),
        errors: validation.blockingErrors,
      };
    }

    setProcessingBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              currentStage: nextStage,
              status: nextStage === 'packing_closure' ? 'completed' : 'in_progress',
              completedDate: nextStage === 'packing_closure' ? new Date().toISOString().split('T')[0] : b.completedDate,
            }
          : b
      )
    );

    return {
      success: true,
      message: `Batch ${batch.batchCode} berhasil melaju ke tahap "${nextStage}".`,
    };
  };

  const updateBatchStageLog = (batchId: string, stageId: ProcessingStageId, logData: any) => {
    setProcessingBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        if (stageId === 'intake_sorting') return { ...b, intakeLog: { ...b.intakeLog, ...logData } };
        if (stageId === 'fermentation') return { ...b, fermentationLog: { ...b.fermentationLog, ...logData } };
        if (stageId === 'drying') return { ...b, dryingLog: { ...b.dryingLog, ...logData } };
        if (stageId === 'conditioning') return { ...b, conditioningLog: { ...b.conditioningLog, ...logData } };
        if (stageId === 'milling') return { ...b, millingLog: { ...b.millingLog, ...logData } };
        if (stageId === 'grading_qc') return { ...b, qcAssessment: { ...b.qcAssessment, ...logData } };
        if (stageId === 'packing_closure') return { ...b, packingLog: { ...b.packingLog, ...logData } };
        return b;
      })
    );
  };

  const addDryingDayLog = (batchId: string, dayLog: DryingDayLog) => {
    setProcessingBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        const updatedDaily = [...b.dryingLog.dailyLogs, dayLog];
        const latestMoisture = dayLog.moisturePercent;
        const passed = latestMoisture <= 12.5;

        return {
          ...b,
          dryingLog: {
            ...b.dryingLog,
            dailyLogs: updatedDaily,
            finalMoisturePercent: latestMoisture,
            targetMoisturePassed: passed,
          },
        };
      })
    );
  };

  const finalizeBatchAndPublish = (
    batchId: string,
    packingData: {
      baggingType: ProcessingBatch['packingLog']['baggingType'];
      pricePerKg: number;
      cuppingNotes: string[];
      grade: ProcessedGreenBeanLot['grade'];
      notes?: string;
    }
  ): ProcessedGreenBeanLot | null => {
    if (!currentUser) return null;
    const batch = processingBatches.find((b) => b.id === batchId);
    if (!batch) return null;

    const finalGreenKg = batch.millingLog?.outputGreenBeanWeightKg || batch.packingLog.finalGreenBeanWeightKg || Math.round(batch.intakeLog.cherryWeightKg * 0.16);

    // Update batch to completed
    setProcessingBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              currentStage: 'packing_closure',
              status: 'completed',
              completedDate: new Date().toISOString().split('T')[0],
              targetMarketplacePricePerKg: packingData.pricePerKg,
              packingLog: {
                ...b.packingLog,
                finalGreenBeanWeightKg: finalGreenKg,
                baggingType: packingData.baggingType,
                totalBags: Math.max(1, Math.ceil(finalGreenKg / 60)),
                notes: packingData.notes || b.packingLog.notes,
                finalStatus: 'siap_jual_marketplace',
              },
            }
          : b
      )
    );

    // Create Green Bean Lot in Catalog & Marketplace
    const newLotId = `GB-${batch.batchCode.replace('LOT-', '')}`;
    const newGreenBean: ProcessedGreenBeanLot = {
      id: newLotId,
      processorId: currentUser.id,
      processorName: currentUser.organization || currentUser.name,
      sourceFarmerLotId: batch.sourceFarmerLotId,
      sourceFarmerName: batch.sourceFarmerName,
      sourceOrigin: batch.sourceOrigin,
      variety: batch.variety,
      altitude: batch.altitude,
      processMethod: batch.fermentationLog.method as ProcessedGreenBeanLot['processMethod'],
      fermentationTimeHours: batch.fermentationLog.durationHours,
      dryingMethod: batch.dryingLog.dryingMethod as ProcessedGreenBeanLot['dryingMethod'],
      moistureContentPercent: batch.qcAssessment.finalMoisturePercent || batch.dryingLog.finalMoisturePercent,
      waterActivityAw: batch.qcAssessment.waterActivityAw,
      grade: packingData.grade || (batch.qcAssessment.calculatedGrade as any),
      defectCount: batch.qcAssessment.defects.primaryDefects + batch.qcAssessment.defects.secondaryDefects,
      screenSize: `Screen 18+ (${batch.qcAssessment.screenDistribution.screen18PlusKg}kg)`,
      greenBeanWeightKg: finalGreenKg,
      availableWeightKg: finalGreenKg,
      pricePerKg: packingData.pricePerKg,
      cuppingNotes: packingData.cuppingNotes.length > 0 ? packingData.cuppingNotes : batch.qcAssessment.cuppingNotes,
      processedDate: new Date().toISOString().split('T')[0],
      status: 'available',
      photoUrl: batch.photoUrl || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
      sourceBrix: batch.intakeLog.brix,
      sourceHarvestDate: batch.startDate,
      sourcePickingMethod: batch.intakeLog.visualQualityGrade,
      sourceTotalCherryWeightKg: batch.intakeLog.cherryWeightKg,
      wasteManagement: batch.wasteManagement,
    };

    setProcessedLots((prev) => [newGreenBean, ...prev]);
    return newGreenBean;
  };

  // 3. Gudang simpan green bean & buka penjualan
  const buyGreenBeanAndStoreWarehouse = (
    processedLotId: string,
    boughtKg: number,
    storageData: {
      storageLocation: string;
      temperatureCelsius: number;
      humidityPercent: number;
      packagingType: WarehouseLot['packagingType'];
      verifiedScaScore: number;
      pricePerKg: number;
      notes?: string;
      gradeTier?: WarehouseGradeTier;
      defectCount?: number;
      screenSize?: string;
      purchasePricePerKg?: number;
      targetMarket?: string;
      gradingNotes?: string;
    }
  ) => {
    if (!currentUser) return;
    const sourceGB = processedLots.find((g) => g.id === processedLotId);
    if (!sourceGB) return;

    const remainingKg = Math.max(0, sourceGB.availableWeightKg - boughtKg);
    setProcessedLots((prev) =>
      prev.map((g) =>
        g.id === processedLotId
          ? {
              ...g,
              availableWeightKg: remainingKg,
              status: remainingKg === 0 ? 'sold' : 'available',
            }
          : g
      )
    );

    const newTrx: SupplyChainTransaction = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      fromRole: 'pengolah',
      fromName: sourceGB.processorName,
      toRole: 'gudang',
      toName: currentUser.organization || currentUser.name,
      itemName: `Green Bean ${sourceGB.variety} ${sourceGB.processMethod} (${boughtKg} kg)`,
      quantity: `${boughtKg} kg`,
      totalAmount: boughtKg * sourceGB.pricePerKg,
      status: 'Selesai',
    };
    setTransactions((prev) => [newTrx, ...prev]);

    const newWarehouseId = `WH-GDG-${Date.now().toString().slice(-4)}`;
    const newWarehouseLot: WarehouseLot = {
      id: newWarehouseId,
      warehouseId: currentUser.id,
      warehouseName: currentUser.organization || currentUser.name,
      sourceGreenBeanId: sourceGB.id,
      sourceProcessorName: sourceGB.processorName,
      sourceFarmerName: sourceGB.sourceFarmerName,
      origin: sourceGB.sourceOrigin,
      variety: sourceGB.variety,
      altitude: sourceGB.altitude,
      processMethod: sourceGB.processMethod,
      storageLocation: storageData.storageLocation,
      temperatureCelsius: storageData.temperatureCelsius,
      humidityPercent: storageData.humidityPercent,
      packagingType: storageData.packagingType,
      verifiedScaScore: storageData.verifiedScaScore,
      weightKg: boughtKg,
      availableWeightKg: boughtKg,
      pricePerKg: storageData.pricePerKg,
      storedDate: new Date().toISOString().split('T')[0],
      status: 'available',
      notes: storageData.notes,
      gradeTier: storageData.gradeTier || 'Grade 1 - Super Premium',
      defectCount: storageData.defectCount ?? sourceGB.defectCount ?? 2,
      screenSize: storageData.screenSize || sourceGB.screenSize || 'Screen 17-18 (Large)',
      moistureContentPercent: sourceGB.moistureContentPercent,
      waterActivityAw: sourceGB.waterActivityAw,
      purchasePricePerKg: storageData.purchasePricePerKg || sourceGB.pricePerKg,
      targetMarket: storageData.targetMarket || 'Specialty Roastery & Cafe',
      gradingNotes: storageData.gradingNotes || storageData.notes,
    };
    setWarehouseLots((prev) => [newWarehouseLot, ...prev]);
  };

  // Re-Grading & Penyesuaian Harga Jual Lot Gudang
  const updateWarehouseLotGrading = (
    lotId: string,
    gradingData: {
      gradeTier: WarehouseGradeTier;
      defectCount: number;
      screenSize: string;
      verifiedScaScore: number;
      pricePerKg: number;
      targetMarket?: string;
      notes?: string;
    }
  ) => {
    setWarehouseLots((prev) =>
      prev.map((lot) =>
        lot.id === lotId
          ? {
              ...lot,
              gradeTier: gradingData.gradeTier,
              defectCount: gradingData.defectCount,
              screenSize: gradingData.screenSize,
              verifiedScaScore: gradingData.verifiedScaScore,
              pricePerKg: gradingData.pricePerKg,
              targetMarket: gradingData.targetMarket || lot.targetMarket,
              notes: gradingData.notes !== undefined ? gradingData.notes : lot.notes,
            }
          : lot
      )
    );
  };

  // 4. Roaster sangrai green bean & jual roasted bean
  const buyWarehouseBeanAndRoast = (
    warehouseLotId: string,
    boughtKg: number,
    roastData: {
      roasterMachine: string;
      roastLevel: RoastedBeanLot['roastLevel'];
      agtronNumber: number;
      developmentTimeRatio: number;
      tastingNotes: string[];
      scaCuppingScore: number;
      packageWeightGrams: number;
      totalPacks: number;
      pricePerPack: number;
      restingRecommendationDays: number;
      recommendedBrew: string[];
    }
  ) => {
    if (!currentUser) return;
    const sourceWH = warehouseLots.find((w) => w.id === warehouseLotId);
    if (!sourceWH) return;

    const remainingKg = Math.max(0, sourceWH.availableWeightKg - boughtKg);
    setWarehouseLots((prev) =>
      prev.map((w) =>
        w.id === warehouseLotId
          ? {
              ...w,
              availableWeightKg: remainingKg,
              status: remainingKg === 0 ? 'sold' : 'partial',
            }
          : w
      )
    );

    const newTrx: SupplyChainTransaction = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      fromRole: 'gudang',
      fromName: sourceWH.warehouseName,
      toRole: 'roaster',
      toName: currentUser.organization || currentUser.name,
      itemName: `Green Bean Grade 1 ${sourceWH.variety} (${boughtKg} kg)`,
      quantity: `${boughtKg} kg`,
      totalAmount: boughtKg * sourceWH.pricePerKg,
      status: 'Selesai',
    };
    setTransactions((prev) => [newTrx, ...prev]);

    const newRoastedId = `RST-CRF-${Date.now().toString().slice(-4)}`;
    const newRoastedBean: RoastedBeanLot = {
      id: newRoastedId,
      roasterId: currentUser.id,
      roasterName: currentUser.organization || currentUser.name,
      sourceWarehouseLotId: sourceWH.id,
      origin: sourceWH.origin,
      variety: sourceWH.variety,
      altitude: sourceWH.altitude,
      processMethod: sourceWH.processMethod,
      farmerName: sourceWH.sourceFarmerName,
      roasterMachine: roastData.roasterMachine,
      roastLevel: roastData.roastLevel,
      agtronNumber: roastData.agtronNumber,
      roastDate: new Date().toISOString().split('T')[0],
      developmentTimeRatio: roastData.developmentTimeRatio,
      tastingNotes: roastData.tastingNotes,
      scaCuppingScore: roastData.scaCuppingScore,
      packageWeightGrams: roastData.packageWeightGrams,
      totalPacks: roastData.totalPacks,
      availablePacks: roastData.totalPacks,
      pricePerPack: roastData.pricePerPack,
      restingRecommendationDays: roastData.restingRecommendationDays,
      recommendedBrew: roastData.recommendedBrew,
      status: 'available',
      photoUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop&q=80',
    };
    setRoastedLots((prev) => [newRoastedBean, ...prev]);
  };

  // 4b. Roaster mempublikasikan hasil Work Order (MRP) yang sudah completed ke Marketplace
  // Ini menjembatani modul Production/Work Orders (internal MRP) dengan Unified Marketplace,
  // sekaligus mengurangi stok green bean gudang & membuat Roasted Bean Lot yang bisa dipindai QR-nya.
  const publishRoastedLotFromWorkOrder = (
    workOrderId: string,
    listingData: {
      tastingNotes: string[];
      scaCuppingScore: number;
      packageWeightGrams: number;
      totalPacks: number;
      pricePerPack: number;
      restingRecommendationDays: number;
      recommendedBrew: string[];
    }
  ): RoastedBeanLot | null => {
    if (!currentUser) return null;
    const wo = workOrders.find((w) => w.id === workOrderId);
    if (!wo) return null;

    // Sudah pernah dipublikasikan sebelumnya? jangan duplikat.
    const alreadyPublished = roastedLots.find((r) => r.sourceWorkOrderId === wo.id);
    if (alreadyPublished) return alreadyPublished;

    const sourceWH = warehouseLots.find((w) => w.id === wo.greenLotId);

    // Kurangi stok gudang sesuai green bean yang benar-benar terpakai di WO ini (konsistensi rantai pasok)
    if (sourceWH) {
      const consumedKg = wo.actualGreenKg || wo.targetGreenKg;
      const remainingKg = Math.max(0, sourceWH.availableWeightKg - consumedKg);
      setWarehouseLots((prev) =>
        prev.map((w) =>
          w.id === sourceWH.id
            ? { ...w, availableWeightKg: remainingKg, status: remainingKg === 0 ? 'sold' : 'partial' }
            : w
        )
      );

      const newTrx: SupplyChainTransaction = {
        id: `TRX-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        fromRole: 'gudang',
        fromName: sourceWH.warehouseName,
        toRole: 'roaster',
        toName: currentUser.organization || currentUser.name,
        itemName: `Green Bean ${sourceWH.variety} untuk ${wo.woNumber} (${wo.actualGreenKg || wo.targetGreenKg} kg)`,
        quantity: `${wo.actualGreenKg || wo.targetGreenKg} kg`,
        totalAmount: (wo.actualGreenKg || wo.targetGreenKg) * sourceWH.pricePerKg,
        status: 'Selesai',
      };
      setTransactions((prev) => [newTrx, ...prev]);
    }

    const newRoastedId = `RST-CRF-${Date.now().toString().slice(-4)}`;
    const newRoastedBean: RoastedBeanLot = {
      id: newRoastedId,
      roasterId: currentUser.id,
      roasterName: currentUser.organization || currentUser.name,
      sourceWarehouseLotId: wo.greenLotId,
      origin: wo.origin,
      variety: wo.variety,
      altitude: sourceWH?.altitude || '-',
      processMethod: wo.processMethod,
      farmerName: sourceWH?.sourceFarmerName || 'Mitra Petani',
      roasterMachine: wo.assignedMachine,
      roastLevel: (wo.targetRoastLevel as RoastedBeanLot['roastLevel']) || 'Medium Roast',
      agtronNumber: wo.targetAgtron,
      roastDate: new Date().toISOString().split('T')[0],
      developmentTimeRatio: wo.targetDtr,
      tastingNotes: listingData.tastingNotes,
      scaCuppingScore: listingData.scaCuppingScore,
      packageWeightGrams: listingData.packageWeightGrams,
      totalPacks: listingData.totalPacks,
      availablePacks: listingData.totalPacks,
      pricePerPack: listingData.pricePerPack,
      restingRecommendationDays: listingData.restingRecommendationDays,
      recommendedBrew: listingData.recommendedBrew,
      status: 'available',
      photoUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop&q=80',
      sourceWorkOrderId: wo.id,
    };
    setRoastedLots((prev) => [newRoastedBean, ...prev]);
    return newRoastedBean;
  };

  // 5. Cafe beli roasted bean
  const buyRoastedBeansForCafe = (roastedLotId: string, packCount: number) => {
    if (!currentUser) return;
    const roastedBean = roastedLots.find((r) => r.id === roastedLotId);
    if (!roastedBean) return;

    const remainingPacks = Math.max(0, roastedBean.availablePacks - packCount);
    setRoastedLots((prev) =>
      prev.map((r) =>
        r.id === roastedLotId
          ? {
              ...r,
              availablePacks: remainingPacks,
              status: remainingPacks === 0 ? 'sold' : 'partial',
            }
          : r
      )
    );

    const totalTrx = packCount * roastedBean.pricePerPack;
    const newTrx: SupplyChainTransaction = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      fromRole: 'roaster',
      fromName: roastedBean.roasterName,
      toRole: 'cafe',
      toName: currentUser.organization || currentUser.name,
      itemName: `${roastedBean.variety} ${roastedBean.roastLevel} (${packCount} pack)`,
      quantity: `${packCount} pack (${(packCount * roastedBean.packageWeightGrams) / 1000} kg)`,
      totalAmount: totalTrx,
      status: 'Selesai',
    };
    setTransactions((prev) => [newTrx, ...prev]);

    const whLot = warehouseLots.find((w) => w.id === roastedBean.sourceWarehouseLotId);
    const gbLot = whLot ? processedLots.find((g) => g.id === whLot.sourceGreenBeanId) : undefined;
    const farmerLot = gbLot ? farmerLots.find((f) => f.id === gbLot.sourceFarmerLotId) : undefined;

    const newItem: CafeInventoryItem = {
      id: `CAFE-ITEM-${Date.now().toString().slice(-4)}`,
      cafeId: currentUser.id,
      cafeName: currentUser.organization || currentUser.name,
      sourceRoastedBeanId: roastedBean.id,
      beanName: `${roastedBean.origin} - ${roastedBean.variety}`,
      roasterName: roastedBean.roasterName,
      origin: roastedBean.origin,
      variety: roastedBean.variety,
      processMethod: roastedBean.processMethod,
      roastLevel: roastedBean.roastLevel,
      tastingNotes: roastedBean.tastingNotes,
      scaScore: roastedBean.scaCuppingScore,
      packWeightGrams: roastedBean.packageWeightGrams,
      packsInStock: packCount,
      purchaseDate: new Date().toISOString().split('T')[0],
      costPerPack: roastedBean.pricePerPack,
      lineage: {
        farmerName: farmerLot?.farmerName || roastedBean.farmerName || 'Kelompok Tani Mitra',
        farmLocation: farmerLot?.farmLocation || roastedBean.origin,
        altitude: farmerLot?.altitude || roastedBean.altitude,
        harvestDate: farmerLot?.harvestDate || '2026-09-01',
        brix: farmerLot?.brix || 21.0,
        processorName: gbLot?.processorName || whLot?.sourceProcessorName || 'Processor Station',
        fermentationTime: gbLot ? `${gbLot.fermentationTimeHours} Jam ${gbLot.processMethod}` : 'Fermentasi Terkontrol',
        moisturePercent: gbLot?.moistureContentPercent || 11.0,
        warehouseName: whLot?.warehouseName || 'Warehouse Partner',
        storageConditions: whLot ? `Suhu ${whLot.temperatureCelsius}°C, RH ${whLot.humidityPercent}%, ${whLot.packagingType}` : 'Climate Controlled',
        warehouseScaScore: whLot?.verifiedScaScore || roastedBean.scaCuppingScore,
        roasterName: `${roastedBean.roasterName} (${roastedBean.roasterMachine})`,
        roastProfile: `${roastedBean.roastLevel} (Agtron #${roastedBean.agtronNumber}, DTR ${roastedBean.developmentTimeRatio}%)`,
        roastDate: roastedBean.roastDate,
      },
    };

    setCafeInventory((prev) => [newItem, ...prev]);
  };

  // 6. Cafe upload produk retail / house blend ke marketplace
  const addCafeRetailProduct = (
    productData: Omit<CafeRetailProduct, 'id' | 'cafeId' | 'cafeName' | 'createdAt' | 'availableStock'>
  ) => {
    if (!currentUser) return;
    const newProdId = `PROD-CF-${Date.now().toString().slice(-4)}`;
    const newProduct: CafeRetailProduct = {
      ...productData,
      id: newProdId,
      cafeId: currentUser.id,
      cafeName: currentUser.organization || currentUser.name,
      availableStock: productData.totalStock,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCafeProducts((prev) => [newProduct, ...prev]);
  };

  // 7. Standardized Items for Unified Marketplace
  const unifiedMarketplaceItems: UnifiedMarketplaceItem[] = [
    // A. Ceri Petani
    ...farmerLots
      .filter((lot) => lot.availableWeightKg > 0)
      .map((lot) => ({
        id: lot.id,
        title: `Cherry Kopi: ${lot.variety}`,
        category: 'cherry' as MarketplaceCategory,
        categoryLabel: 'Ceri Kopi Segar (Panen)',
        sellerRole: 'petani' as UserRole,
        sellerName: lot.farmerName,
        sellerOrg: 'Kelompok Tani Kebun',
        origin: lot.farmLocation,
        variety: lot.variety,
        altitude: lot.altitude,
        tastingNotes: [`Brix ${lot.brix}°`, lot.pickingMethod.split(' ')[0]],
        price: lot.pricePerKg,
        priceUnit: '/ kg',
        availableStock: lot.availableWeightKg,
        stockUnit: 'kg',
        photoUrl:
          lot.photoUrl ||
          'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80',
        specsSummary: [
          { label: 'Ketinggian', value: lot.altitude },
          { label: 'Kemanisan', value: `${lot.brix}° Brix` },
          { label: 'Standar Petik', value: lot.pickingMethod.split(' ')[0] },
          { label: 'Tanggal Panen', value: lot.harvestDate },
        ],
        canTrace: false,
        rawItem: lot,
      })),

    // B. Green Bean Pengolah
    ...processedLots
      .filter((lot) => lot.availableWeightKg > 0)
      .map((lot) => ({
        id: lot.id,
        title: `Green Bean: ${lot.variety} (${lot.processMethod})`,
        category: 'green_bean_processor' as MarketplaceCategory,
        categoryLabel: 'Green Bean Olahan (Mill)',
        sellerRole: 'pengolah' as UserRole,
        sellerName: lot.processorName,
        sellerOrg: 'Stasiun Pengolahan Kopi',
        origin: lot.sourceOrigin,
        variety: lot.variety,
        processMethod: lot.processMethod,
        altitude: lot.altitude,
        tastingNotes: lot.cuppingNotes,
        price: lot.pricePerKg,
        priceUnit: '/ kg',
        availableStock: lot.availableWeightKg,
        stockUnit: 'kg',
        photoUrl:
          lot.photoUrl ||
          'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
        specsSummary: [
          { label: 'Metode Olah', value: lot.processMethod },
          { label: 'Kadar Air', value: `${lot.moistureContentPercent}%` },
          { label: 'Sortasi Defect', value: `${lot.defectCount} defect/350g` },
          { label: 'Grade Biji', value: lot.grade },
        ],
        canTrace: true,
        rawItem: lot,
      })),

    // C. Green Bean Gudang & Ekspor
    ...warehouseLots
      .filter((lot) => lot.availableWeightKg > 0)
      .map((lot) => ({
        id: lot.id,
        title: `[${lot.gradeTier ? lot.gradeTier.split(' - ')[1] : 'Grade 1'}] Green Bean ${lot.variety}`,
        category: 'green_bean_warehouse' as MarketplaceCategory,
        categoryLabel: 'Green Bean Gudang & Ekspor',
        sellerRole: 'gudang' as UserRole,
        sellerName: lot.warehouseName,
        sellerOrg: 'Logistik & Silo QA',
        origin: lot.origin,
        variety: lot.variety,
        processMethod: lot.processMethod,
        altitude: lot.altitude,
        scaScore: lot.verifiedScaScore,
        gradeTier: lot.gradeTier,
        tastingNotes: [
          lot.gradeTier || 'Grade 1',
          `SCA ${lot.verifiedScaScore}`,
          `Defect ${lot.defectCount}/350g`,
        ],
        price: lot.pricePerKg,
        priceUnit: '/ kg',
        availableStock: lot.availableWeightKg,
        stockUnit: 'kg',
        photoUrl:
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        specsSummary: [
          { label: 'Standar Grade', value: lot.gradeTier || 'Grade 1 - Super Premium' },
          { label: 'Defect & Screen', value: `${lot.defectCount} defect | ${lot.screenSize}` },
          { label: 'Verified SCA', value: `${lot.verifiedScaScore} Score` },
          { label: 'Kemasan & Silo', value: `${lot.packagingType.split(' ')[0]} | ${lot.storageLocation}` },
        ],
        canTrace: true,
        rawItem: lot,
      })),

    // D. Roasted Beans Roaster
    ...roastedLots
      .filter((lot) => lot.availablePacks > 0)
      .map((lot) => ({
        id: lot.id,
        title: `Biji Sangrai: ${lot.origin} - ${lot.variety}`,
        category: 'roasted_bean' as MarketplaceCategory,
        categoryLabel: 'Biji Sangrai Artisan (Roaster)',
        sellerRole: 'roaster' as UserRole,
        sellerName: lot.roasterName,
        sellerOrg: 'Artisan Micro-Roastery',
        origin: lot.origin,
        variety: lot.variety,
        processMethod: lot.processMethod,
        roastLevel: lot.roastLevel,
        scaScore: lot.scaCuppingScore,
        altitude: lot.altitude,
        tastingNotes: lot.tastingNotes,
        price: lot.pricePerPack,
        priceUnit: `/ pack (${lot.packageWeightGrams}g)`,
        availableStock: lot.availablePacks,
        stockUnit: 'pack',
        photoUrl:
          lot.photoUrl ||
          'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop&q=80',
        specsSummary: [
          { label: 'Profil Sangrai', value: lot.roastLevel },
          { label: 'Warna Agtron', value: `#${lot.agtronNumber} (DTR ${lot.developmentTimeRatio}%)` },
          { label: 'Mesin Sangrai', value: lot.roasterMachine },
          { label: 'SCA Score', value: `${lot.scaCuppingScore}` },
        ],
        canTrace: true,
        rawItem: lot,
      })),
  ];

  // 8. Universal Buy Action from Unified Marketplace
  const buyFromUnifiedMarketplace = (
    item: UnifiedMarketplaceItem,
    quantity: number
  ): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'Silakan login terlebih dahulu untuk melakukan transaksi.' };
    }

    const totalCost = item.price * quantity;

    // A. Beli Ceri Petani
    if (item.category === 'cherry') {
      const sourceLot = farmerLots.find((l) => l.id === item.id);
      if (!sourceLot || sourceLot.availableWeightKg < quantity) {
        return { success: false, message: 'Stok ceri tidak mencukupi.' };
      }

      const remaining = Math.max(0, sourceLot.availableWeightKg - quantity);
      setFarmerLots((prev) =>
        prev.map((l) =>
          l.id === item.id
            ? { ...l, availableWeightKg: remaining, status: remaining === 0 ? 'sold' : 'partial' }
            : l
        )
      );

      const newTrx: SupplyChainTransaction = {
        id: `TRX-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        fromRole: 'petani',
        fromName: item.sellerName,
        toRole: currentUser.role,
        toName: currentUser.organization || currentUser.name,
        itemName: `${item.title} (${quantity} kg)`,
        quantity: `${quantity} kg`,
        totalAmount: totalCost,
        status: 'Selesai',
      };
      setTransactions((prev) => [newTrx, ...prev]);

      // If Pengolah buys cherry, automatically put it in their raw material cherry stock!
      if (currentUser.role === 'pengolah') {
        const newStockItem: ProcessorCherryStockItem = {
          id: `STK-CHR-${Date.now().toString().slice(-4)}`,
          processorId: currentUser.id,
          sourceFarmerLotId: sourceLot.id,
          farmerName: sourceLot.farmerName,
          origin: sourceLot.farmLocation,
          variety: sourceLot.variety,
          altitude: sourceLot.altitude,
          harvestDate: sourceLot.harvestDate,
          pickingMethod: sourceLot.pickingMethod,
          brix: sourceLot.brix,
          totalWeightKg: quantity,
          availableWeightKg: quantity,
          purchasePricePerKg: sourceLot.pricePerKg,
          purchaseDate: new Date().toISOString().split('T')[0],
          notes: `Beli dari Marketplace (${sourceLot.farmerName} - ${sourceLot.farmLocation}).`,
          photoUrl: sourceLot.photoUrl,
        };
        setProcessorCherryStock((prev) => [newStockItem, ...prev]);
      }

      return {
        success: true,
        message: `Sukses membeli ${quantity} kg ceri dari ${item.sellerName} senilai Rp ${totalCost.toLocaleString()}! Stok masuk ke Gudang Ceri Anda.`,
      };
    }

    // B. Beli Green Bean Pengolah
    if (item.category === 'green_bean_processor') {
      const sourceLot = processedLots.find((l) => l.id === item.id);
      if (!sourceLot || sourceLot.availableWeightKg < quantity) {
        return { success: false, message: 'Stok green bean tidak mencukupi.' };
      }

      const remaining = Math.max(0, sourceLot.availableWeightKg - quantity);
      setProcessedLots((prev) =>
        prev.map((l) =>
          l.id === item.id
            ? { ...l, availableWeightKg: remaining, status: remaining === 0 ? 'sold' : 'available' }
            : l
        )
      );

      const newTrx: SupplyChainTransaction = {
        id: `TRX-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        fromRole: 'pengolah',
        fromName: item.sellerName,
        toRole: currentUser.role,
        toName: currentUser.organization || currentUser.name,
        itemName: `${item.title} (${quantity} kg)`,
        quantity: `${quantity} kg`,
        totalAmount: totalCost,
        status: 'Selesai',
      };
      setTransactions((prev) => [newTrx, ...prev]);

      return {
        success: true,
        message: `Sukses membeli ${quantity} kg Green Bean dari ${item.sellerName} senilai Rp ${totalCost.toLocaleString()}!`,
      };
    }

    // C. Beli Green Bean Gudang
    if (item.category === 'green_bean_warehouse') {
      const sourceLot = warehouseLots.find((l) => l.id === item.id);
      if (!sourceLot || sourceLot.availableWeightKg < quantity) {
        return { success: false, message: 'Stok green bean gudang tidak mencukupi.' };
      }

      const remaining = Math.max(0, sourceLot.availableWeightKg - quantity);
      setWarehouseLots((prev) =>
        prev.map((l) =>
          l.id === item.id
            ? { ...l, availableWeightKg: remaining, status: remaining === 0 ? 'sold' : 'partial' }
            : l
        )
      );

      const newTrx: SupplyChainTransaction = {
        id: `TRX-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        fromRole: 'gudang',
        fromName: item.sellerName,
        toRole: currentUser.role,
        toName: currentUser.organization || currentUser.name,
        itemName: `${item.title} (${quantity} kg)`,
        quantity: `${quantity} kg`,
        totalAmount: totalCost,
        status: 'Selesai',
      };
      setTransactions((prev) => [newTrx, ...prev]);

      return {
        success: true,
        message: `Sukses membeli ${quantity} kg Green Bean Gudang dari ${item.sellerName} senilai Rp ${totalCost.toLocaleString()}!`,
      };
    }

    // D. Beli Biji Sangrai Roaster
    if (item.category === 'roasted_bean') {
      const sourceLot = roastedLots.find((l) => l.id === item.id);
      if (!sourceLot || sourceLot.availablePacks < quantity) {
        return { success: false, message: 'Stok roasted bean tidak mencukupi.' };
      }

      const remaining = Math.max(0, sourceLot.availablePacks - quantity);
      setRoastedLots((prev) =>
        prev.map((l) =>
          l.id === item.id
            ? { ...l, availablePacks: remaining, status: remaining === 0 ? 'sold' : 'partial' }
            : l
        )
      );

      const newTrx: SupplyChainTransaction = {
        id: `TRX-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        fromRole: 'roaster',
        fromName: item.sellerName,
        toRole: currentUser.role,
        toName: currentUser.organization || currentUser.name,
        itemName: `${item.title} (${quantity} pack)`,
        quantity: `${quantity} pack`,
        totalAmount: totalCost,
        status: 'Selesai',
      };
      setTransactions((prev) => [newTrx, ...prev]);

      // If buyer is Cafe, automatically add to Cafe Inventory!
      if (currentUser.role === 'cafe') {
        const whLot = warehouseLots.find((w) => w.id === sourceLot.sourceWarehouseLotId);
        const gbLot = whLot ? processedLots.find((g) => g.id === whLot.sourceGreenBeanId) : undefined;
        const farmerLot = gbLot ? farmerLots.find((f) => f.id === gbLot.sourceFarmerLotId) : undefined;

        const newItem: CafeInventoryItem = {
          id: `CAFE-ITEM-${Date.now().toString().slice(-4)}`,
          cafeId: currentUser.id,
          cafeName: currentUser.organization || currentUser.name,
          sourceRoastedBeanId: sourceLot.id,
          beanName: `${sourceLot.origin} - ${sourceLot.variety}`,
          roasterName: sourceLot.roasterName,
          origin: sourceLot.origin,
          variety: sourceLot.variety,
          processMethod: sourceLot.processMethod,
          roastLevel: sourceLot.roastLevel,
          tastingNotes: sourceLot.tastingNotes,
          scaScore: sourceLot.scaCuppingScore,
          packWeightGrams: sourceLot.packageWeightGrams,
          packsInStock: quantity,
          purchaseDate: new Date().toISOString().split('T')[0],
          costPerPack: sourceLot.pricePerPack,
          lineage: {
            farmerName: farmerLot?.farmerName || sourceLot.farmerName || 'Kelompok Tani Mitra',
            farmLocation: farmerLot?.farmLocation || sourceLot.origin,
            altitude: farmerLot?.altitude || sourceLot.altitude,
            harvestDate: farmerLot?.harvestDate || '2026-09-01',
            brix: farmerLot?.brix || 21.0,
            processorName: gbLot?.processorName || whLot?.sourceProcessorName || 'Processor Station',
            fermentationTime: gbLot ? `${gbLot.fermentationTimeHours} Jam ${gbLot.processMethod}` : 'Fermentasi Terkontrol',
            moisturePercent: gbLot?.moistureContentPercent || 11.0,
            warehouseName: whLot?.warehouseName || 'Warehouse Partner',
            storageConditions: whLot ? `Suhu ${whLot.temperatureCelsius}°C, RH ${whLot.humidityPercent}%, ${whLot.packagingType}` : 'Climate Controlled',
            warehouseScaScore: whLot?.verifiedScaScore || sourceLot.scaCuppingScore,
            roasterName: `${sourceLot.roasterName} (${sourceLot.roasterMachine})`,
            roastProfile: `${sourceLot.roastLevel} (Agtron #${sourceLot.agtronNumber}, DTR ${sourceLot.developmentTimeRatio}%)`,
            roastDate: sourceLot.roastDate,
          },
        };
        setCafeInventory((prev) => [newItem, ...prev]);
      }

      return {
        success: true,
        message: `Sukses membeli ${quantity} pack ${item.title} senilai Rp ${totalCost.toLocaleString()}!`,
      };
    }

    return { success: false, message: 'Kategori produk tidak dikenali.' };
  };

  const getTraceabilityForRoastedLot = (roastedLotId: string) => {
    const roastedLot = roastedLots.find((r) => r.id === roastedLotId);
    if (!roastedLot) return {};
    const warehouseLot = warehouseLots.find((w) => w.id === roastedLot.sourceWarehouseLotId);
    const processedLot = warehouseLot ? processedLots.find((g) => g.id === warehouseLot.sourceGreenBeanId) : undefined;
    const farmerLot = processedLot ? farmerLots.find((f) => f.id === processedLot.sourceFarmerLotId) : undefined;
    return {
      roastedLot,
      warehouseLot,
      processedLot,
      farmerLot,
    };
  };

  // --- QREMA ROASTERY ERP ACTIONS ---
  const createWorkOrder = (
    woData: Omit<WorkOrder, 'id' | 'woNumber' | 'createdAt' | 'batches' | 'actualRoastedKg' | 'actualGreenKg' | 'weightLossPercent'>
  ): WorkOrder => {
    const newId = `wo-${Date.now().toString().slice(-4)}`;
    const newWoNumber = `WO-2026-${(workOrders.length + 1).toString().padStart(3, '0')}`;
    const newWo: WorkOrder = {
      ...woData,
      id: newId,
      woNumber: newWoNumber,
      actualGreenKg: 0,
      actualRoastedKg: 0,
      weightLossPercent: 0,
      batches: [],
      createdAt: new Date().toISOString(),
    };
    setWorkOrders((prev) => [newWo, ...prev]);
    return newWo;
  };

  const updateWorkOrderStatus = (id: string, status: WorkOrderStatus) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === id ? { ...wo, status } : wo))
    );
  };

  const executeRoastBatch = (woId: string, batchData: Omit<WorkOrderBatch, 'executedAt'>) => {
    const executedBatch: WorkOrderBatch = {
      ...batchData,
      executedAt: new Date().toISOString(),
    };

    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id !== woId) return wo;
        const updatedBatches = [...wo.batches, executedBatch];
        const totalActualGreen = updatedBatches.reduce((acc, b) => acc + b.greenWeightKg, 0);
        const totalActualRoasted = updatedBatches.reduce((acc, b) => acc + b.roastedWeightKg, 0);
        const avgWeightLoss = totalActualGreen > 0 ? ((totalActualGreen - totalActualRoasted) / totalActualGreen) * 100 : 14.5;
        const newStatus: WorkOrderStatus = totalActualGreen >= wo.targetGreenKg ? 'qc_pending' : 'in_production';

        return {
          ...wo,
          batches: updatedBatches,
          actualGreenKg: Number(totalActualGreen.toFixed(1)),
          actualRoastedKg: Number(totalActualRoasted.toFixed(1)),
          weightLossPercent: Number(avgWeightLoss.toFixed(1)),
          status: newStatus,
        };
      })
    );

    // Also deduct green bean inventory from warehouse lots if applicable
    const targetWo = workOrders.find((w) => w.id === woId);
    if (targetWo) {
      setWarehouseLots((prev) =>
        prev.map((lot) => {
          if (lot.id === targetWo.greenLotId) {
            const remaining = Math.max(0, lot.availableWeightKg - batchData.greenWeightKg);
            return {
              ...lot,
              availableWeightKg: remaining,
              status: remaining === 0 ? 'sold' : 'partial',
            };
          }
          return lot;
        })
      );
    }
  };

  const createPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber'>): PurchaseOrder => {
    const newId = `po-${Date.now().toString().slice(-4)}`;
    const newPoNumber = `PO-2026-${(purchaseOrders.length + 1).toString().padStart(3, '0')}`;
    const newPo: PurchaseOrder = {
      ...poData,
      id: newId,
      poNumber: newPoNumber,
    };
    setPurchaseOrders((prev) => [newPo, ...prev]);
    return newPo;
  };

  // Direct "beli" action from the Unified Marketplace itself — same storefront every other
  // role buys/sells through, no separate supplier-picker screen in Purchasing. A roaster
  // picking a green bean listing here creates a Purchase Order straight at "pending_approval"
  // (this click *is* the submit-for-approval step) — it still needs a digital signature in
  // Purchasing before stock is actually deducted from the seller and goods can be received.
  const createPOFromMarketplace = (
    item: UnifiedMarketplaceItem,
    quantityKg: number
  ): { success: boolean; message: string } => {
    if (!currentUser || currentUser.role !== 'roaster') {
      return { success: false, message: 'Hanya akun Roaster yang dapat membuat Purchase Order dari listing ini.' };
    }
    if (item.category !== 'green_bean_processor' && item.category !== 'green_bean_warehouse') {
      return { success: false, message: 'Kategori produk ini tidak dapat dibeli lewat Purchase Order.' };
    }
    if (quantityKg <= 0 || quantityKg > item.availableStock) {
      return { success: false, message: 'Kuantitas melebihi stok yang tersedia pada listing ini.' };
    }

    const pricePerKg = item.price;
    const itemTotal = quantityKg * pricePerKg;
    const estimatedFreight = Math.round(quantityKg * 2500);

    const newItem: POItem = {
      id: `poi-${Date.now().toString().slice(-4)}`,
      greenBeanName: item.title,
      origin: item.origin,
      variety: item.variety,
      processMethod: item.processMethod || '-',
      bagCount: Math.max(1, Math.ceil(quantityKg / 60)),
      weightPerBagKg: 60,
      totalWeightKg: quantityKg,
      pricePerKg,
      totalPrice: itemTotal,
      lotReference: item.id,
      sourceMarketplaceId: item.id,
      sourceMarketplaceCategory: item.category as 'green_bean_processor' | 'green_bean_warehouse',
    };

    const newPo = createPurchaseOrder({
      supplierName: item.sellerOrg || item.sellerName,
      supplierRole: item.sellerRole as 'petani' | 'pengolah' | 'gudang',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: 'draft',
      items: [newItem],
      subtotal: itemTotal,
      freightCost: estimatedFreight,
      totalAmount: itemTotal + estimatedFreight,
      paymentStatus: 'unpaid',
      notes: `Dibeli langsung dari Unified Marketplace (${item.sellerOrg || item.sellerName}).`,
    });

    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === newPo.id ? { ...p, status: 'pending_approval' } : p))
    );

    return {
      success: true,
      message: `PO ${newPo.poNumber} diajukan ke ${item.sellerOrg || item.sellerName} senilai Rp ${(
        itemTotal + estimatedFreight
      ).toLocaleString()}. Tanda tangani persetujuan di modul Purchasing untuk melanjutkan.`,
    };
  };

  // Draft -> Pending Approval (submitted, awaiting a digital signature from an authorized user)
  const submitPurchaseOrderForApproval = (poId: string) => {
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === poId && p.status === 'draft' ? { ...p, status: 'pending_approval' } : p))
    );
  };

  // Pending Approval -> Approved, gated by a digital signature (typed full name confirmation).
  // This is also the moment the purchase is actually committed against the real seller: for
  // any item picked straight from the Unified Marketplace, the seller's own listing stock is
  // deducted here and a real SupplyChainTransaction is logged — mirroring buyFromUnifiedMarketplace
  // so Purchasing stays tied to the same marketplace stock everyone else sells through.
  const approvePurchaseOrder = (poId: string, signedByName: string) => {
    const targetPo = purchaseOrders.find((p) => p.id === poId);
    if (!targetPo || targetPo.status !== 'pending_approval') return;

    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === poId
          ? {
              ...p,
              status: 'approved',
              approvalSignedBy: signedByName,
              approvalSignedAt: new Date().toISOString(),
            }
          : p
      )
    );

    targetPo.items.forEach((item) => {
      if (!item.sourceMarketplaceId || !item.sourceMarketplaceCategory) return;

      if (item.sourceMarketplaceCategory === 'green_bean_processor') {
        setProcessedLots((prev) =>
          prev.map((l) =>
            l.id === item.sourceMarketplaceId
              ? {
                  ...l,
                  availableWeightKg: Math.max(0, l.availableWeightKg - item.totalWeightKg),
                  status: l.availableWeightKg - item.totalWeightKg <= 0 ? 'sold' : 'available',
                }
              : l
          )
        );
      } else if (item.sourceMarketplaceCategory === 'green_bean_warehouse') {
        setWarehouseLots((prev) =>
          prev.map((l) =>
            l.id === item.sourceMarketplaceId
              ? {
                  ...l,
                  availableWeightKg: Math.max(0, l.availableWeightKg - item.totalWeightKg),
                  status: l.availableWeightKg - item.totalWeightKg <= 0 ? 'sold' : 'partial',
                }
              : l
          )
        );
      }

      const newTrx: SupplyChainTransaction = {
        id: `TRX-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        fromRole: targetPo.supplierRole,
        fromName: targetPo.supplierName,
        toRole: currentUser?.role || 'roaster',
        toName: currentUser?.organization || currentUser?.name || 'Roastery',
        itemName: `${item.greenBeanName} (${item.totalWeightKg} kg) — ${targetPo.poNumber}`,
        quantity: `${item.totalWeightKg} kg`,
        totalAmount: item.totalPrice,
        status: 'Diproses',
      };
      setTransactions((prev) => [newTrx, ...prev]);
    });
  };

  // Approval rejected / sent back to draft for revision
  const rejectPurchaseOrder = (poId: string) => {
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === poId ? { ...p, status: 'draft', approvalSignedBy: undefined, approvalSignedAt: undefined } : p))
    );
  };

  const receivePurchaseOrder = (poId: string) => {
    const targetPo = purchaseOrders.find((p) => p.id === poId);
    if (!targetPo || targetPo.status !== 'approved') return;

    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === poId ? { ...p, status: 'received', paymentStatus: 'paid' } : p))
    );

    // Create a new Warehouse Lot for Roaster's Green Coffee inventory. Goods arrive as
    // 'pending_qc' — they are visible in Inventory immediately, but only usable by the
    // roaster (Work Orders) once incoming QC marks them 'passed'.
    targetPo.items.forEach((item) => {
      const newLot: WarehouseLot = {
        id: `WH-LOT-${Date.now().toString().slice(-4)}`,
        warehouseId: currentUser?.id || 'roaster-warehouse-1',
        warehouseName: currentUser?.organization || 'Roastery Green Silo Hub',
        sourceGreenBeanId: item.lotReference || `GB-${Date.now().toString().slice(-3)}`,
        sourceProcessorName: targetPo.supplierName,
        sourceFarmerName: 'Petani Mitra Direct Trade',
        origin: item.origin,
        variety: item.variety,
        altitude: '1.400 - 1.650 mdpl',
        processMethod: item.processMethod,
        storageLocation: 'Receiving Bay (Menunggu QC Masuk)',
        temperatureCelsius: 20.0,
        humidityPercent: 56,
        packagingType: 'GrainPro + Karung Goni 60kg',
        verifiedScaScore: 0,
        weightKg: item.totalWeightKg,
        availableWeightKg: item.totalWeightKg,
        pricePerKg: item.pricePerKg,
        purchasePricePerKg: item.pricePerKg,
        storedDate: new Date().toISOString().split('T')[0],
        status: 'available',
        qcStatus: 'pending_qc',
        gradeTier: 'Grade 1 - Super Premium',
        defectCount: 0,
        screenSize: 'Screen 17-18',
        moistureContentPercent: undefined,
        waterActivityAw: 0.55,
      };
      setWarehouseLots((prev) => [newLot, ...prev]);
    });
  };

  // Incoming QC gate: inspect a just-received green bean lot before the roaster can use it.
  const submitIncomingQC = (
    lotId: string,
    result: { passed: boolean; scaScore: number; moisturePercent: number; notes: string; checkedBy: string }
  ) => {
    const targetLot = warehouseLots.find((l) => l.id === lotId);

    setWarehouseLots((prev) =>
      prev.map((lot) =>
        lot.id === lotId
          ? {
              ...lot,
              qcStatus: result.passed ? 'passed' : 'rejected',
              qcNotes: result.notes,
              qcCheckedBy: result.checkedBy,
              qcCheckedAt: new Date().toISOString(),
              verifiedScaScore: result.scaScore,
              moistureContentPercent: result.moisturePercent,
              storageLocation: result.passed ? 'Green Silo Bay 01 (GrainPro)' : 'Receiving Bay (Ditolak QC)',
              status: result.passed ? lot.status : 'sold',
              availableWeightKg: result.passed ? lot.availableWeightKg : 0,
            }
          : lot
      )
    );

    // A lot that just cleared QC is ready to roast — auto-queue a Work Order for it right
    // away (status 'scheduled') instead of leaving the roaster to click "+ Work Order" and
    // re-pick the same lot from a dropdown. Best-guess profile/machine are pre-filled from
    // whatever's already configured in Production; the roaster can still adjust before
    // executing the first batch.
    const alreadyQueued = workOrders.some((w) => w.greenLotId === lotId);
    if (result.passed && targetLot && !alreadyQueued && targetLot.availableWeightKg > 0) {
      const defaultProfile = masterProfiles[0];
      const readyMachine = roasterMachines.find((m) => m.status === 'ready') || roasterMachines[0];

      createWorkOrder({
        scheduledDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        status: 'scheduled',
        greenLotId: targetLot.id,
        greenBeanName: `${targetLot.origin} - ${targetLot.variety}`,
        origin: targetLot.origin,
        variety: targetLot.variety,
        processMethod: targetLot.processMethod,
        targetGreenKg: targetLot.availableWeightKg,
        targetRoastedKg: Number((targetLot.availableWeightKg * 0.855).toFixed(1)),
        masterProfileId: defaultProfile?.id || '',
        masterProfileName: defaultProfile?.name || 'Belum Dipilih',
        targetRoastLevel: defaultProfile?.targetRoastLevel || 'Belum Ditentukan',
        targetAgtron: defaultProfile?.agtronGourmet || 0,
        targetDtr: defaultProfile?.targetDtr || 0,
        assignedMachine: readyMachine?.name || 'Belum Ditentukan',
        assignedRoaster: currentUser?.name || 'Roastmaster',
        notes: `Auto-dijadwalkan setelah lot ${targetLot.id} lulus QC Masuk. Cek profil sangrai & mesin sebelum eksekusi batch.`,
      });
    }
  };

  const createGreenBeanSample = (
    sampleData: Omit<GreenBeanSample, 'id' | 'sampleCode' | 'receivedDate'>
  ): GreenBeanSample => {
    const newId = `smp-${Date.now().toString().slice(-4)}`;
    const newCode = `SMP-${(greenBeanSamples.length + 80).toString().padStart(3, '0')}`;
    const newSample: GreenBeanSample = {
      ...sampleData,
      id: newId,
      sampleCode: newCode,
      receivedDate: new Date().toISOString().split('T')[0],
    };
    setGreenBeanSamples((prev) => [newSample, ...prev]);
    return newSample;
  };

  const updateGreenBeanSample = (
    id: string,
    status: GreenBeanSample['status'],
    evaluationNotes?: string
  ) => {
    setGreenBeanSamples((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, evaluationNotes: evaluationNotes || s.evaluationNotes } : s))
    );
  };

  const createMasterProfile = (profileData: Omit<MasterRoastProfile, 'id'>): MasterRoastProfile => {
    const newId = `prof-${Date.now().toString().slice(-4)}`;
    const newProf: MasterRoastProfile = {
      ...profileData,
      id: newId,
    };
    setMasterProfiles((prev) => [newProf, ...prev]);
    return newProf;
  };

  const createCuppingSession = (
    qcData: Omit<QCCuppingSession, 'id' | 'sessionCode' | 'date'>
  ): QCCuppingSession => {
    const newId = `qc-${Date.now().toString().slice(-4)}`;
    const newCode = `QC-2026-${(qcSessions.length + 1).toString().padStart(3, '0')}`;
    const newQc: QCCuppingSession = {
      ...qcData,
      id: newId,
      sessionCode: newCode,
      date: new Date().toISOString().split('T')[0],
    };
    setQcSessions((prev) => [newQc, ...prev]);

    // If linked to work order and status is approved, update WO to completed
    if (qcData.workOrderId && qcData.status.startsWith('approved')) {
      updateWorkOrderStatus(qcData.workOrderId, 'completed');
    }
    return newQc;
  };

  const createSalesOrder = (soData: Omit<SalesOrder, 'id' | 'soNumber' | 'orderDate'>): SalesOrder => {
    const newId = `so-${Date.now().toString().slice(-4)}`;
    const newSoNumber = `SO-2026-${(salesOrders.length + 1).toString().padStart(3, '0')}`;
    const newSo: SalesOrder = {
      ...soData,
      id: newId,
      soNumber: newSoNumber,
      orderDate: new Date().toISOString().split('T')[0],
    };
    setSalesOrders((prev) => [newSo, ...prev]);
    return newSo;
  };

  const dispatchSalesOrder = (soId: string) => {
    const targetSo = salesOrders.find((s) => s.id === soId);
    if (!targetSo) return;

    setSalesOrders((prev) =>
      prev.map((s) => (s.id === soId ? { ...s, status: 'dispatched' } : s))
    );

    // Create a supply chain transaction
    const newTrx: SupplyChainTransaction = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      fromRole: 'roaster',
      fromName: currentUser?.organization || currentUser?.name || 'Roaster HQ',
      toRole: 'cafe',
      toName: targetSo.customerName,
      itemName: `${targetSo.items.map((i) => i.productName).join(', ')}`,
      quantity: `${targetSo.items.reduce((acc, i) => acc + i.quantity, 0)} Items`,
      totalAmount: targetSo.totalAmount,
      status: 'Terkirim',
    };
    setTransactions((prev) => [newTrx, ...prev]);
  };

  const updatePackagingStock = (id: string, qtyDelta: number) => {
    setPackagingInventory((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockQuantity: Math.max(0, p.stockQuantity + qtyDelta) } : p))
    );
  };

  const resetToDefaultData = () => {
    setFarmerLots(INITIAL_FARMER_LOTS);
    setProcessedLots(INITIAL_PROCESSED_LOTS);
    setWarehouseLots(INITIAL_WAREHOUSE_LOTS);
    setRoastedLots(INITIAL_ROASTED_LOTS);
    setCafeInventory(INITIAL_CAFE_ITEMS);
    setCafeProducts(INITIAL_CAFE_PRODUCTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setProcessingBatches(INITIAL_PROCESSING_BATCHES);
    setProcessorCherryStock(INITIAL_PROCESSOR_CHERRY_STOCK);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setMasterProfiles(INITIAL_MASTER_PROFILES);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setGreenBeanSamples(INITIAL_GREEN_SAMPLES);
    setQcSessions(INITIAL_QC_SESSIONS);
    setPackagingInventory(INITIAL_PACKAGING_ITEMS);
    setSalesOrders(INITIAL_SALES_ORDERS);
    setRoasterMachines(INITIAL_ROASTER_MACHINES);
    localStorage.clear();
  };

  return (
    <CoffeeContext.Provider
      value={{
        currentUser,
        users,
        loginAsRole,
        loginAsUser,
        registerUser,
        logout,
        activeView,
        setActiveView,
        roasterActiveTab,
        setRoasterActiveTab,
        processorActiveTab,
        setProcessorActiveTab,
        processorCherryStock,
        buyCherryToStock,
        processingBatches,
        createProcessingBatch,
        advanceBatchStage,
        updateBatchStageLog,
        addDryingDayLog,
        finalizeBatchAndPublish,
        farmerLots,
        processedLots,
        warehouseLots,
        roastedLots,
        cafeInventory,
        cafeProducts,
        transactions,
        unifiedMarketplaceItems,
        addFarmerHarvest,
        buyCherryAndCreateProcess,
        updateProcessedLotWaste,
        buyGreenBeanAndStoreWarehouse,
        updateWarehouseLotGrading,
        buyWarehouseBeanAndRoast,
        publishRoastedLotFromWorkOrder,
        buyRoastedBeansForCafe,
        addCafeRetailProduct,
        buyFromUnifiedMarketplace,
        resetToDefaultData,
        getTraceabilityForRoastedLot,
        // --- QREMA ROASTERY ERP ---
        workOrders,
        masterProfiles,
        purchaseOrders,
        greenBeanSamples,
        qcSessions,
        packagingInventory,
        salesOrders,
        roasterMachines,
        createWorkOrder,
        updateWorkOrderStatus,
        executeRoastBatch,
        createPurchaseOrder,
        createPOFromMarketplace,
        submitPurchaseOrderForApproval,
        approvePurchaseOrder,
        rejectPurchaseOrder,
        receivePurchaseOrder,
        submitIncomingQC,
        createGreenBeanSample,
        updateGreenBeanSample,
        createMasterProfile,
        createCuppingSession,
        createSalesOrder,
        dispatchSalesOrder,
        updatePackagingStock,
        language,
        setLanguage,
        t,
        demoModeEnabled,
        setDemoModeEnabled,
      }}
    >
      {children}
    </CoffeeContext.Provider>
  );
};

export const useCoffee = () => {
  const context = useContext(CoffeeContext);
  if (!context) {
    throw new Error('useCoffee must be used within a CoffeeProvider');
  }
  return context;
};
