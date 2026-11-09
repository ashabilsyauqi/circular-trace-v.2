import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../i18n/translations';
import {
  getViewFromUrl,
  syncUrlWithView,
  AppView,
  RouteState,
  NavigationTarget,
  parseRouteFromLocation,
  navigateTo,
} from '../utils/routes';
import {
  AppUser,
  UserRole,
  TenantOperationalService,
  UserStatus,
  MarketplaceCategory,
  CoffeeFarm,
  FarmWeatherData,
  FarmerHarvestLot,
  ProcessedGreenBeanLot,
  WarehouseLot,
  RoastedBeanLot,
  CafeInventoryItem,
  CafeRetailProduct,
  UnifiedMarketplaceItem,
  MarketplaceCartItem,
  SupplyChainTransaction,
  CoffeeWasteManagement,
  WarehouseGradeTier,
  CuppingEvaluationData,
  VerificationStamp,
  VerificationChecklistItem,
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
  INITIAL_COFFEE_FARMS,
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
import {
  UserSubscription,
  SubscriptionTierId,
  SubscriptionStatus,
  SubscriptionPlan,
  SubscriptionInvoice,
} from '../types/subscription';
import {
  SUBSCRIPTION_PLANS,
  INITIAL_SUBSCRIPTIONS,
  calculateDaysRemaining,
} from '../data/mockSubscriptions';

interface CoffeeContextType {
  currentUser: AppUser | null;
  setCurrentUser: (user: AppUser | null) => void;
  setUsers: React.Dispatch<React.SetStateAction<AppUser[]>>;
  addTransaction: (tx: SupplyChainTransaction) => void;
  users: AppUser[];
  loginAsRole: (role: UserRole, targetSubRoute?: string) => void;
  loginAsUser: (userId: string) => void;
  impersonatingFromUser: AppUser | null;
  returnToSuperAdmin: () => void;
  login: (email: string, password: string, rememberMe?: boolean) => { success: boolean; message: string; user?: AppUser };
  requestPasswordReset: (email: string) => { success: boolean; message: string; resetCode?: string };
  verifyResetCode: (email: string, code: string) => { success: boolean; message: string };
  resetPassword: (email: string, code: string, newPassword: string) => { success: boolean; message: string };
  registerUser?: (userData: {
    name: string;
    email?: string;
    username?: string;
    password?: string;
    role: UserRole;
    organization: string;
    location: string;
    phone: string;
    bio?: string;
  }) => { success: boolean; message: string; user: AppUser };
  approveUser: (userId: string) => { success: boolean; message: string };
  rejectUser: (userId: string, reason?: string) => { success: boolean; message: string };
  deleteUser: (userId: string) => { success: boolean; message: string };
  suspendUser: (userId: string) => { success: boolean; message: string };
  logout: () => void;
  route: RouteState;
  navigate: (target: NavigationTarget) => RouteState;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  farmerActiveTab: 'farms' | 'upload' | 'catalog' | 'history';
  setFarmerActiveTab: (tab: 'farms' | 'upload' | 'catalog' | 'history') => void;
  roasterActiveTab: 'purchasing' | 'inventory' | 'work_orders' | 'production' | 'qc' | 'selling' | 'history' | 'dashboard';
  setRoasterActiveTab: (tab: 'purchasing' | 'inventory' | 'work_orders' | 'production' | 'qc' | 'selling' | 'history' | 'dashboard') => void;
  processorActiveTab: 'sourcing' | 'batches' | 'inventory' | 'selling' | 'history' | 'dashboard';
  setProcessorActiveTab: (tab: 'sourcing' | 'batches' | 'inventory' | 'selling' | 'history' | 'dashboard') => void;
  warehouseActiveTab: 'inventory' | 'marketplace' | 'history';
  setWarehouseActiveTab: (tab: 'inventory' | 'marketplace' | 'history') => void;
  cafeActiveTab: 'inventory' | 'calculator' | 'my_products' | 'create_product' | 'history';
  setCafeActiveTab: (tab: 'inventory' | 'calculator' | 'my_products' | 'create_product' | 'history') => void;
  verifierActiveTab: 'petani' | 'pengolah' | 'gudang' | 'roaster' | 'cafe' | 'history';
  setVerifierActiveTab: (tab: 'petani' | 'pengolah' | 'gudang' | 'roaster' | 'cafe' | 'history') => void;
  tenantActiveService: TenantOperationalService;
  setTenantActiveService: (service: TenantOperationalService) => void;
  ensureTenantSelfPipeline: (user?: AppUser | null) => void;
  superAdminActiveTab: 'dashboard' | 'approvals' | 'directory' | 'subscriptions' | 'logs';
  setSuperAdminActiveTab: (tab: 'dashboard' | 'approvals' | 'directory' | 'subscriptions' | 'logs') => void;
  subscriptions: UserSubscription[];
  getUserSubscription: (userId: string) => UserSubscription | null;
  hasRoleAccess: (role: UserRole, user?: AppUser | null) => boolean;
  subscribeUser: (params: {
    userId: string;
    tierId: SubscriptionTierId;
    billingCycle: 'monthly' | 'yearly';
    paymentMethod: string;
    tenantData?: {
      name: string;
      organization: string;
      email: string;
      phone: string;
      province: string;
      cityAddress: string;
      role: UserRole;
      taxId?: string;
    };
  }) => { success: boolean; message: string; subscription: UserSubscription; invoice?: SubscriptionInvoice };
  extendSubscription: (subscriptionId: string, daysToAdd?: number) => { success: boolean; message: string };
  updateSubscriptionTier: (subscriptionId: string, newTierId: SubscriptionTierId) => { success: boolean; message: string };
  cancelOrSuspendSubscription: (subscriptionId: string) => { success: boolean; message: string };
  superAdminRoleFilter: string;
  setSuperAdminRoleFilter: (role: string) => void;
  verificationStamps: VerificationStamp[];
  issueVerificationStamp: (params: {
    targetType: 'farm' | 'harvest' | 'processed' | 'warehouse' | 'roasted' | 'cafe';
    targetId: string;
    stampType: VerificationStamp['stampType'];
    title: string;
    scoreDisplay?: string;
    notes: string;
    cuppingEvaluation?: CuppingEvaluationData;
    checklist?: VerificationChecklistItem[];
  }) => { success: boolean; message: string; stamp?: VerificationStamp };
  revokeVerificationStamp: (
    targetType: 'farm' | 'harvest' | 'processed' | 'warehouse' | 'roasted' | 'cafe',
    targetId: string
  ) => void;
  coffeeFarms: CoffeeFarm[];
  addCoffeeFarm: (farmData: Omit<CoffeeFarm, 'id' | 'createdAt'>) => CoffeeFarm;
  updateCoffeeFarm: (farm: CoffeeFarm) => void;
  deleteCoffeeFarm: (farmId: string) => void;
  seedCoffeeFarms: () => void;
  activeProcessingBatchId: string | null;
  setActiveProcessingBatchId: (id: string | null) => void;
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
  updateBatchFull: (updatedBatch: ProcessingBatch) => void;
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
  // Shopping Cart & Bundle Payment
  cartItems: MarketplaceCartItem[];
  addToCart: (item: UnifiedMarketplaceItem, quantity?: number) => void;
  updateCartQuantity: (itemId: string, newQty: number) => void;
  removeFromCart: (itemId: string) => void;
  toggleSelectCartItem: (itemId: string) => void;
  toggleSelectSellerGroup: (sellerName: string) => void;
  selectAllCartItems: (select: boolean) => void;
  clearCart: (onlySelected?: boolean) => void;
  updateCartItemNotes: (itemId: string, notes: string) => void;
  checkoutBundle: (params: {
    courierId: string;
    courierName: string;
    courierCost: number;
    paymentMethod: string;
    shippingAddress?: string;
  }) => {
    success: boolean;
    invoiceNo: string;
    trackingNo: string;
    message: string;
    totalAmount: number;
    bundledItems: MarketplaceCartItem[];
  };
  addFarmerHarvest: (
    lotData: Omit<FarmerHarvestLot, 'id' | 'createdAt' | 'status' | 'availableWeightKg' | 'farmerId' | 'farmerName'>
  ) => FarmerHarvestLot | null;
  updateFarmerHarvestLot: (lot: FarmerHarvestLot) => void;
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
      hasHealthCertificate?: boolean;
      healthCertificateNumber?: string;
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
      hasHealthCertificate?: boolean;
      healthCertificateNumber?: string;
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
      photoUrl?: string;
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
  launchMarketplaceProduct: (data: {
    category: MarketplaceCategory;
    title: string;
    variety: string;
    origin: string;
    altitude?: string;
    processMethod?: string;
    roastLevel?: string;
    stock: number;
    price: number;
    tastingNotes?: string[];
    photoUrl?: string;
    notes?: string;
  }) => { success: boolean; message: string };
  resetToDefaultData: () => void;
  seedFarmerLots: () => void;
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
    // Priority 1: Check if URL explicitly specifies an operational workstation service domain
    const fromUrl = parseRouteFromLocation();
    if (fromUrl.view === 'dashboard' && fromUrl.service) {
      const s = fromUrl.service.toLowerCase();
      const serviceRole: UserRole = s === 'admin' ? 'superadmin' : (s as UserRole);
      if (['petani', 'pengolah', 'gudang', 'roaster', 'cafe', 'verifikator', 'superadmin'].includes(serviceRole)) {
        const matched = MOCK_USERS.find((u) => u.role === serviceRole);
        if (matched) {
          try {
            localStorage.setItem('cct_live_auth_user', JSON.stringify(matched));
          } catch {}
          return matched;
        }
      }
    }
    const saved = localStorage.getItem('cct_live_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
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

  const [demoModeEnabled, setDemoModeEnabledState] = useState<boolean>(false);

  const setDemoModeEnabled = (enabled: boolean) => {
    setDemoModeEnabledState(enabled);
  };

  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('cct_v3_users');
    if (saved) {
      try {
        const parsed: AppUser[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...parsed];
          MOCK_USERS.forEach((mockUser) => {
            const idx = merged.findIndex((u) => u.id === mockUser.id || (mockUser.username && u.username === mockUser.username));
            if (idx >= 0) {
              merged[idx] = {
                ...mockUser,
                ...merged[idx],
                username: mockUser.username || merged[idx].username,
                email: merged[idx].email || mockUser.email,
                password: mockUser.password || merged[idx].password,
                role: mockUser.role || merged[idx].role,
                isSuperAdmin: mockUser.isSuperAdmin !== undefined ? mockUser.isSuperAdmin : merged[idx].isSuperAdmin,
                status: merged[idx].status || mockUser.status || 'active',
                verifierDomain: merged[idx].verifierDomain || mockUser.verifierDomain,
              };
            } else {
              merged.push(mockUser);
            }
          });
          return merged;
        }
      } catch (e) {
        console.error('Failed to parse cct_v3_users', e);
      }
    }
    return MOCK_USERS;
  });

  // Professional Unified Routing System (Single Source of Truth)
  const [currentRoute, setCurrentRoute] = useState<RouteState>(() => parseRouteFromLocation());
  const [activeView, setActiveViewState] = useState<AppView>(() => currentRoute.view);

  const navigate = (target: NavigationTarget): RouteState => {
    const updated = navigateTo(target);
    setCurrentRoute(updated);
    setActiveViewState(updated.view);
    return updated;
  };

  const setActiveView = (view: AppView) => {
    navigate({ view });
  };

  useEffect(() => {
    const handleRouteChange = () => {
      const parsed = parseRouteFromLocation();
      setCurrentRoute(parsed);
      setActiveViewState(parsed.view);

      // Automatic synchronization for SuperAdmin tab & service filter from URL
      if (parsed.view === 'dashboard') {
        if (parsed.service) {
          const s = parsed.service.toLowerCase();
          const serviceRole: UserRole = s === 'admin' ? 'superadmin' : (s as UserRole);

          // Synchronize active user if current session is not in this role
          if (['petani', 'pengolah', 'gudang', 'roaster', 'cafe', 'verifikator'].includes(serviceRole)) {
            setCurrentUser((prevUser) => {
              if (!prevUser || prevUser.role !== serviceRole) {
                const matched = users.find((u) => u.role === serviceRole) || MOCK_USERS.find((u) => u.role === serviceRole);
                if (matched) {
                  try {
                    localStorage.setItem('cct_live_auth_user', JSON.stringify(matched));
                  } catch {}
                  return matched;
                }
              }
              return prevUser;
            });
          }
          if (s === 'petani' && parsed.subRoute) {
            setFarmerActiveTabState(parsed.subRoute as any);
          } else if (s === 'pengolah' && parsed.subRoute) {
            setProcessorActiveTabState(parsed.subRoute as any);
          } else if (s === 'gudang' && parsed.subRoute) {
            setWarehouseActiveTabState(parsed.subRoute as any);
          } else if (s === 'roaster' && parsed.subRoute) {
            setRoasterActiveTabState(parsed.subRoute as any);
          } else if (s === 'cafe' && parsed.subRoute) {
            setCafeActiveTabState(parsed.subRoute as any);
          } else if (s === 'verifikator' && parsed.subRoute) {
            setVerifierActiveTabState(parsed.subRoute as any);
          } else if ((s === 'admin' || s === 'superadmin') && parsed.subRoute) {
            if (['dashboard', 'approvals', 'directory', 'subscriptions', 'logs'].includes(parsed.subRoute)) {
              setSuperAdminActiveTabState(parsed.subRoute as any);
            }
            if (parsed.searchParams?.service) {
              setSuperAdminRoleFilterState(parsed.searchParams.service);
            }
          }
        } else if (parsed.subRoute && ['dashboard', 'approvals', 'directory', 'logs'].includes(parsed.subRoute)) {
          setSuperAdminActiveTabState(parsed.subRoute as any);
        }
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('cct_route_change', handleRouteChange as EventListener);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('cct_route_change', handleRouteChange as EventListener);
    };
  }, []);

  // Multi-Device Realtime & Cross-Tab Synchronization for users list
  useEffect(() => {
    let isMounted = true;

    // 1. Initial Fetch from Server Backend
    const fetchLatestUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.users) && data.users.length > 0 && isMounted) {
            setUsers(data.users);
            localStorage.setItem('cct_v3_users', JSON.stringify(data.users));
          }
        }
      } catch (err) {
        console.warn('[Sync] Server API sync fallback to local storage:', err);
      }
    };
    fetchLatestUsers();

    // 2. Server-Sent Events (SSE) Realtime Stream
    let sse: EventSource | null = null;
    try {
      sse = new EventSource('/api/realtime/stream');

      sse.addEventListener('init', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data);
          if (Array.isArray(payload.users) && payload.users.length > 0 && isMounted) {
            setUsers(payload.users);
            localStorage.setItem('cct_v3_users', JSON.stringify(payload.users));
          }
        } catch {}
      });

      sse.addEventListener('users_updated', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data);
          if (Array.isArray(payload.users) && payload.users.length > 0 && isMounted) {
            setUsers(payload.users);
            localStorage.setItem('cct_v3_users', JSON.stringify(payload.users));
          }
        } catch {}
      });

      sse.addEventListener('user_registered', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.newUser && isMounted) {
            setUsers((prev) => {
              const filtered = prev.filter(
                (u) => u.id !== payload.newUser.id && u.email?.toLowerCase() !== payload.newUser.email?.toLowerCase()
              );
              const updated = [payload.newUser, ...filtered];
              localStorage.setItem('cct_v3_users', JSON.stringify(updated));
              return updated;
            });
          }
        } catch {}
      });

      sse.addEventListener('user_approved', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.user && isMounted) {
            setUsers((prev) => {
              const updated = prev.map((u) =>
                u.id === payload.user.id ? { ...u, status: 'active' as UserStatus, rejectionReason: undefined } : u
              );
              localStorage.setItem('cct_v3_users', JSON.stringify(updated));
              return updated;
            });
            // Auto update currentUser if currentUser was approved
            setCurrentUser((curr) => {
              if (curr && curr.id === payload.user.id) {
                const updated = { ...curr, status: 'active' as UserStatus, rejectionReason: undefined };
                localStorage.setItem('cct_live_auth_user', JSON.stringify(updated));
                return updated;
              }
              return curr;
            });
          }
        } catch {}
      });

      sse.onerror = () => {
        // SSE error, will auto-reconnect; fallback poll handles gaps
      };
    } catch (sseErr) {
      console.warn('[Sync] SSE not supported or blocked:', sseErr);
    }

    // 3. Fallback High-Frequency Poller (every 2.5 seconds)
    const pollInterval = setInterval(() => {
      if (!isMounted) return;
      fetch('/api/users')
        .then((r) => r.json())
        .then((data) => {
          if (data.success && Array.isArray(data.users) && data.users.length > 0 && isMounted) {
            setUsers((prev) => {
              // Only trigger state update if contents differ
              if (JSON.stringify(prev) !== JSON.stringify(data.users)) {
                localStorage.setItem('cct_v3_users', JSON.stringify(data.users));
                return data.users;
              }
              return prev;
            });
          }
        })
        .catch(() => {});
    }, 2500);

    // 4. Same-browser cross-tab storage sync
    const handleStorageSync = (e: StorageEvent) => {
      if (e.key === 'cct_v3_users' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
            setUsers(parsed);
          }
        } catch (err) {
          console.error('Cross-tab sync error for users', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageSync);

    return () => {
      isMounted = false;
      if (sse) sse.close();
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, []);

  // Persistent Role Tabs
  // Impersonation state: stores the original super admin user when "Masuk" is used
  const [impersonatingFromUser, setImpersonatingFromUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('cct_impersonating_superadmin');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (impersonatingFromUser) {
      localStorage.setItem('cct_impersonating_superadmin', JSON.stringify(impersonatingFromUser));
    } else {
      localStorage.removeItem('cct_impersonating_superadmin');
    }
  }, [impersonatingFromUser]);

  const [farmerActiveTab, setFarmerActiveTabState] = useState<'farms' | 'upload' | 'catalog' | 'history'>(() => {
    const fromUrl = parseRouteFromLocation();
    if (fromUrl.service === 'petani' && fromUrl.subRoute && ['farms', 'upload', 'catalog', 'history'].includes(fromUrl.subRoute)) {
      return fromUrl.subRoute as any;
    }
    return (localStorage.getItem('cct_tab_farmer') as 'farms' | 'upload' | 'catalog' | 'history') || 'farms';
  });
  const setFarmerActiveTab = (tab: 'farms' | 'upload' | 'catalog' | 'history') => {
    setFarmerActiveTabState(tab);
    localStorage.setItem('cct_tab_farmer', tab);
    navigate({ view: 'dashboard', service: 'petani', subRoute: tab });
  };

  const [roasterActiveTab, setRoasterActiveTabState] = useState<
    'purchasing' | 'inventory' | 'work_orders' | 'production' | 'qc' | 'selling' | 'history' | 'dashboard'
  >(() => {
    const fromUrl = parseRouteFromLocation();
    if (fromUrl.service === 'roaster' && fromUrl.subRoute && ['purchasing', 'inventory', 'work_orders', 'production', 'qc', 'selling', 'history', 'dashboard'].includes(fromUrl.subRoute)) {
      return fromUrl.subRoute as any;
    }
    return (
      (localStorage.getItem('cct_tab_roaster') as
        | 'purchasing'
        | 'inventory'
        | 'work_orders'
        | 'production'
        | 'qc'
        | 'selling'
        | 'history'
        | 'dashboard') || 'purchasing'
    );
  });
  const setRoasterActiveTab = (
    tab: 'purchasing' | 'inventory' | 'work_orders' | 'production' | 'qc' | 'selling' | 'history' | 'dashboard'
  ) => {
    setRoasterActiveTabState(tab);
    localStorage.setItem('cct_tab_roaster', tab);
    navigate({ view: 'dashboard', service: 'roaster', subRoute: tab });
  };

  const [processorActiveTab, setProcessorActiveTabState] = useState<
    'sourcing' | 'batches' | 'inventory' | 'selling' | 'history' | 'dashboard'
  >(() => {
    const fromUrl = parseRouteFromLocation();
    if (fromUrl.service === 'pengolah' && fromUrl.subRoute && ['sourcing', 'batches', 'inventory', 'selling', 'history', 'dashboard'].includes(fromUrl.subRoute)) {
      return fromUrl.subRoute as any;
    }
    return (
      (localStorage.getItem('cct_tab_processor') as
        | 'sourcing'
        | 'batches'
        | 'inventory'
        | 'selling'
        | 'history'
        | 'dashboard') || 'sourcing'
    );
  });
  const setProcessorActiveTab = (
    tab: 'sourcing' | 'batches' | 'inventory' | 'selling' | 'history' | 'dashboard'
  ) => {
    setProcessorActiveTabState(tab);
    localStorage.setItem('cct_tab_processor', tab);
    navigate({ view: 'dashboard', service: 'pengolah', subRoute: tab });
  };

  const [warehouseActiveTab, setWarehouseActiveTabState] = useState<'inventory' | 'marketplace' | 'history'>(() => {
    const fromUrl = parseRouteFromLocation();
    if (fromUrl.service === 'gudang' && fromUrl.subRoute && ['inventory', 'marketplace', 'history'].includes(fromUrl.subRoute)) {
      return fromUrl.subRoute as any;
    }
    return (localStorage.getItem('cct_tab_warehouse') as 'inventory' | 'marketplace' | 'history') || 'inventory';
  });
  const setWarehouseActiveTab = (tab: 'inventory' | 'marketplace' | 'history') => {
    setWarehouseActiveTabState(tab);
    localStorage.setItem('cct_tab_warehouse', tab);
    navigate({ view: 'dashboard', service: 'gudang', subRoute: tab });
  };

  const [cafeActiveTab, setCafeActiveTabState] = useState<
    'inventory' | 'calculator' | 'my_products' | 'create_product' | 'history'
  >(() => {
    const fromUrl = parseRouteFromLocation();
    if (fromUrl.service === 'cafe' && fromUrl.subRoute && ['inventory', 'calculator', 'my_products', 'create_product', 'history'].includes(fromUrl.subRoute)) {
      return fromUrl.subRoute as any;
    }
    return (
      (localStorage.getItem('cct_tab_cafe') as
        | 'inventory'
        | 'calculator'
        | 'my_products'
        | 'create_product'
        | 'history') || 'inventory'
    );
  });
  const setCafeActiveTab = (
    tab: 'inventory' | 'calculator' | 'my_products' | 'create_product' | 'history'
  ) => {
    setCafeActiveTabState(tab);
    localStorage.setItem('cct_tab_cafe', tab);
    navigate({ view: 'dashboard', service: 'cafe', subRoute: tab });
  };

  const [verifierActiveTab, setVerifierActiveTabState] = useState<
    'petani' | 'pengolah' | 'gudang' | 'roaster' | 'cafe' | 'history'
  >(() => {
    const fromUrl = parseRouteFromLocation();
    if (fromUrl.service === 'verifikator' && fromUrl.subRoute && ['petani', 'pengolah', 'gudang', 'roaster', 'cafe', 'history'].includes(fromUrl.subRoute)) {
      return fromUrl.subRoute as any;
    }
    return (
      (localStorage.getItem('cct_tab_verifier') as
        | 'petani'
        | 'pengolah'
        | 'gudang'
        | 'roaster'
        | 'cafe'
        | 'history') || 'petani'
    );
  });
  const setVerifierActiveTab = (tab: 'petani' | 'pengolah' | 'gudang' | 'roaster' | 'cafe' | 'history') => {
    setVerifierActiveTabState(tab);
    localStorage.setItem('cct_tab_verifier', tab);
    navigate({ view: 'dashboard', service: 'verifikator', subRoute: tab });
  };

  const [superAdminActiveTab, setSuperAdminActiveTabState] = useState<'dashboard' | 'approvals' | 'directory' | 'subscriptions' | 'logs'>(() => {
    const fromUrl = parseRouteFromLocation();
    if (fromUrl.subRoute && ['dashboard', 'approvals', 'directory', 'subscriptions', 'logs'].includes(fromUrl.subRoute)) {
      return fromUrl.subRoute as any;
    }
    return (localStorage.getItem('cct_tab_superadmin') as 'dashboard' | 'approvals' | 'directory' | 'logs') || 'dashboard';
  });

  const setSuperAdminActiveTab = (tab: 'dashboard' | 'approvals' | 'directory' | 'subscriptions' | 'logs') => {
    setSuperAdminActiveTabState(tab);
    localStorage.setItem('cct_tab_superadmin', tab);
    navigate({
      view: 'dashboard',
      subRoute: tab,
      userId: null,
      service: tab === 'directory' ? superAdminRoleFilter : undefined,
    });
  };

  const [superAdminRoleFilter, setSuperAdminRoleFilterState] = useState<string>(() => {
    const fromUrl = parseRouteFromLocation();
    return fromUrl.service || 'all';
  });

  const setSuperAdminRoleFilter = (role: string) => {
    setSuperAdminRoleFilterState(role);
    navigate({
      view: 'dashboard',
      subRoute: 'directory',
      service: role,
      userId: null,
    });
  };


  // ---------------------------------------------------------------------------
  // SUBSCRIPTION & MONETIZATION GOVERNANCE STATE
  // ---------------------------------------------------------------------------
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cct_subscriptions_master');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error loading subscriptions from localStorage', e);
        }
      }
    }
    return INITIAL_SUBSCRIPTIONS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cct_subscriptions_master', JSON.stringify(subscriptions));
    }
  }, [subscriptions]);

  const getUserSubscription = (userId: string): UserSubscription | null => {
    const found = subscriptions.find((s) => s.userId === userId);
    if (found) return found;

    // Fallback: Seluruh mitra/petani yang login/register langsung memiliki langganan aktif otomatis
    const targetUser = users.find((u) => u.id === userId) || MOCK_USERS.find((u) => u.id === userId);
    if (targetUser) {
      return {
        id: 'SUB-AKTIF-' + targetUser.id.replace('user-', '').toUpperCase(),
        userId: targetUser.id,
        userName: targetUser.name,
        userEmail: targetUser.email || (targetUser.username + '@circulartrace.id'),
        userPhone: targetUser.phone || '0812-3456-7890',
        organization: targetUser.organization || 'Mitra Rantai Pasok Kopi',
        location: targetUser.location || 'Indonesia',
        tierId: '1_year',
        tierName: 'Bundle 1 Tahun (Full Ecosystem Access)',
        status: 'active',
        startDate: '2026-10-01',
        expiryDate: '2027-10-01',
        daysRemaining: 330,
        durationDays: 365,
        billingCycle: 'yearly',
        pricePaid: 3990000,
        paymentMethod: 'bank_transfer',
        allowedRoles: ['petani', 'pengolah', 'gudang', 'roaster', 'cafe', 'verifikator', 'buyer'],
        autoRenew: true,
        notes: 'Akses penuh ekosistem tanpa kunci (Open Access Fase Onboarding Petani & Stakeholder).',
        invoices: [],
      };
    }
    return null;
  };

  const hasRoleAccess = (role: UserRole, user?: AppUser | null): boolean => {
    const targetUser = user || currentUser;
    if (!targetUser) return false;

    // 1. Super Admin memiliki akses penuh tata kelola ekosistem
    if (targetUser.role === 'superadmin' || targetUser.isSuperAdmin) {
      return true;
    }

    // 2. Akun Pembeli (Buyer) bebas akses tanpa biaya langganan
    if (role === 'buyer' || targetUser.role === 'buyer') {
      return true;
    }

    // 3. Akun Brand / Stakeholder Operasional (Petani, Mill, Gudang, Roaster, Cafe, Verifikator)
    // WAJIB memiliki paket langganan aktif atau trial yang mencakup perannya
    const sub = getUserSubscription(targetUser.id);
    if (!sub) {
      return false;
    }

    if (sub.status === 'expired') {
      return false;
    }

    // Verifikasi apakah peran operasional tercakup dalam paket yang dibeli
    return sub.allowedRoles.includes(role);
  };

  const subscribeUser = (params: {
    userId: string;
    tierId: SubscriptionTierId;
    billingCycle: 'monthly' | 'yearly';
    paymentMethod: string;
    tenantData?: {
      name: string;
      organization: string;
      email: string;
      phone: string;
      province: string;
      cityAddress: string;
      role: UserRole;
      taxId?: string;
    };
  }) => {
    let targetUser = users.find((u) => u.id === params.userId) || currentUser;

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === params.tierId);
    if (!plan) return { success: false, message: 'Paket langganan tidak valid', subscription: null as any, invoice: null as any };

    // If live tenantData is passed from form, register/update the user in state
    let finalUserId = targetUser?.id || ('user-' + Date.now().toString().slice(-6));
    let userName = targetUser?.name || 'Mitra Kopi';
    let userEmail = targetUser?.email || (targetUser ? targetUser.username + '@circulartrace.com' : 'mitra@circulartrace.com');
    let userPhone = targetUser?.phone || '0812-0000-0000';
    let organization = targetUser?.organization || 'Kelompok Tani Kopi';
    let location = targetUser?.location || 'Indonesia';
    let userRole: UserRole = targetUser?.role || 'petani';

    if (params.tenantData) {
      finalUserId = 'user-' + Date.now().toString().slice(-6);
      userName = params.tenantData.name;
      organization = params.tenantData.organization;
      userEmail = params.tenantData.email;
      userPhone = params.tenantData.phone;
      location = `${params.tenantData.cityAddress}, ${params.tenantData.province}`;
      userRole = params.tenantData.role;

      const newRegisteredUser: AppUser = {
        id: finalUserId,
        name: userName,
        username: userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'tenant_' + Date.now().toString().slice(-4),
        email: userEmail,
        phone: userPhone,
        role: userRole,
        organization: organization,
        location: location,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        balance: 15000000,
        registeredAt: new Date().toLocaleString('id-ID'),
      };

      setUsers((prev) => [newRegisteredUser, ...prev.filter((u) => u.email !== userEmail && u.id !== finalUserId)]);
      targetUser = newRegisteredUser;
      setCurrentUser(newRegisteredUser);
    }

    if (!targetUser) return { success: false, message: 'Pengguna tidak ditemukan', subscription: null as any, invoice: null as any };

    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const expDate = new Date(today);
    
    // Accurate duration calculation based on plan.durationDays
    const durationDays = plan.durationDays || (params.billingCycle === 'yearly' ? 365 : 30);
    expDate.setDate(expDate.getDate() + durationDays);
    const expiryDate = expDate.toISOString().split('T')[0];
    const daysRemaining = calculateDaysRemaining(expiryDate);
    const pricePaid = plan.totalPrice !== undefined ? plan.totalPrice : (params.billingCycle === 'yearly' ? plan.pricePerYear : plan.pricePerMonth);

    const invoiceId = 'INV-' + Date.now().toString().slice(-6);
    const newInvoice: SubscriptionInvoice = {
      id: invoiceId,
      invoiceNumber: 'INV/' + new Date().getFullYear() + '/' + (new Date().getMonth() + 1).toString().padStart(2, '0') + '/CCT-' + invoiceId.slice(-4),
      date: startDate,
      dueDate: expiryDate,
      amount: pricePaid,
      tierId: plan.id,
      tierName: plan.name,
      status: 'paid',
      paymentMethod: params.paymentMethod as any,
      receiptNumber: 'REC-' + Date.now().toString().slice(-8),
    };

    const newSub: UserSubscription = {
      id: 'SUB-' + Date.now().toString().slice(-6),
      userId: finalUserId,
      userName,
      userEmail,
      userPhone,
      organization,
      location,
      tierId: plan.id,
      tierName: plan.name,
      status: 'active',
      startDate,
      expiryDate,
      daysRemaining,
      durationDays,
      billingCycle: params.billingCycle,
      pricePaid,
      paymentMethod: params.paymentMethod as any,
      allowedRoles: plan.allowedRoles,
      autoRenew: true,
      invoices: [newInvoice],
      notes: params.tenantData?.taxId ? `NPWP/NIK: ${params.tenantData.taxId}` : undefined,
    };

    setSubscriptions((prev) => {
      const filtered = prev.filter((s) => s.userId !== finalUserId);
      return [newSub, ...filtered];
    });

    ensureTenantSelfPipeline(targetUser);
    setTenantActiveService('dashboard');

    return {
      success: true,
      message: 'Selamat! Paket ' + plan.name + ' (' + (params.billingCycle === 'yearly' ? 'Tahunan' : 'Bulanan') + ') berhasil diaktifkan untuk ' + targetUser.name + '!',
      subscription: newSub,
    };
  };

  const extendSubscription = (subscriptionId: string, daysToAdd: number = 30) => {
    let updatedName = '';
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subscriptionId) {
          updatedName = sub.organization || sub.userName;
          const currentExp = new Date(sub.expiryDate);
          const baseDate = currentExp > new Date() ? currentExp : new Date();
          baseDate.setDate(baseDate.getDate() + daysToAdd);
          const newExpStr = baseDate.toISOString().split('T')[0];
          return {
            ...sub,
            expiryDate: newExpStr,
            daysRemaining: calculateDaysRemaining(newExpStr),
            status: 'active' as const,
          };
        }
        return sub;
      })
    );
    return {
      success: true,
      message: 'Masa sewa ' + (updatedName || 'langganan') + ' berhasil diperpanjang +' + daysToAdd + ' hari!',
    };
  };

  const updateSubscriptionTier = (subscriptionId: string, newTierId: SubscriptionTierId) => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === newTierId);
    if (!plan) return { success: false, message: 'Paket tidak valid' };

    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subscriptionId) {
          return {
            ...sub,
            tierId: plan.id,
            tierName: plan.name,
            allowedRoles: plan.allowedRoles,
          };
        }
        return sub;
      })
    );
    return { success: true, message: 'Paket berhasil diubah menjadi ' + plan.name + '!' };
  };

  const cancelOrSuspendSubscription = (subscriptionId: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subscriptionId) {
          const nextStatus = sub.status === 'expired' ? ('active' as const) : ('expired' as const);
          return {
            ...sub,
            status: nextStatus,
          };
        }
        return sub;
      })
    );
    return { success: true, message: 'Status langganan berhasil diperbarui.' };
  };

  const [verificationStamps, setVerificationStamps] = useState<VerificationStamp[]>(() => {
    const saved = localStorage.getItem('cct_v3_verificationStamps');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse cct_v3_verificationStamps', e);
      }
    }
    const initialStamps: VerificationStamp[] = [];
    INITIAL_COFFEE_FARMS.forEach((f) => {
      if (f.verificationStamp) initialStamps.push(f.verificationStamp);
    });
    INITIAL_FARMER_LOTS.forEach((lot) => {
      if (lot.verificationStamp) initialStamps.push(lot.verificationStamp);
    });
    INITIAL_PROCESSED_LOTS.forEach((p) => {
      if (p.verificationStamp) initialStamps.push(p.verificationStamp);
    });
    INITIAL_WAREHOUSE_LOTS.forEach((w) => {
      if (w.verificationStamp) initialStamps.push(w.verificationStamp);
    });
    INITIAL_ROASTED_LOTS.forEach((r) => {
      if (r.verificationStamp) initialStamps.push(r.verificationStamp);
    });
    INITIAL_CAFE_PRODUCTS.forEach((c) => {
      if (c.verificationStamp) initialStamps.push(c.verificationStamp);
    });
    return initialStamps;
  });

  const [resetCodes, setResetCodes] = useState<Record<string, { code: string; expiresAt: number }>>({});

  useEffect(() => {
    localStorage.setItem('cct_v3_verificationStamps', JSON.stringify(verificationStamps));
  }, [verificationStamps]);
  const [activeProcessingBatchId, setActiveProcessingBatchId] = useState<string | null>(null);

  const [coffeeFarms, setCoffeeFarms] = useState<CoffeeFarm[]>(() => {
    const saved = localStorage.getItem('cct_v3_coffeeFarms');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_COFFEE_FARMS;
  });

  const [processingBatches, setProcessingBatches] = useState<ProcessingBatch[]>(() => {
    const saved = localStorage.getItem('cct_v3_processingBatches');
    return saved ? JSON.parse(saved) : INITIAL_PROCESSING_BATCHES;
  });

  const [processorCherryStock, setProcessorCherryStock] = useState<ProcessorCherryStockItem[]>(() => {
    const saved = localStorage.getItem('cct_v3_processorCherryStock');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item: ProcessorCherryStockItem) => {
            if (item.photoUrl && item.photoUrl.includes('photo-1596704017254-9b121068fb31')) {
              return {
                ...item,
                photoUrl: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80',
              };
            }
            return item;
          });
        }
      } catch (e) {}
    }
    return INITIAL_PROCESSOR_CHERRY_STOCK;
  });

  useEffect(() => {
    localStorage.setItem('cct_v3_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cct_v3_coffeeFarms', JSON.stringify(coffeeFarms));
  }, [coffeeFarms]);

  useEffect(() => {
    localStorage.setItem('cct_v3_processingBatches', JSON.stringify(processingBatches));
  }, [processingBatches]);

  useEffect(() => {
    localStorage.setItem('cct_v3_processorCherryStock', JSON.stringify(processorCherryStock));
  }, [processorCherryStock]);

  const [farmerLots, setFarmerLots] = useState<FarmerHarvestLot[]>(() => {
    const saved = localStorage.getItem('cct_v3_farmerLots');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.some((l: FarmerHarvestLot) => l.availableWeightKg > 0)) {
          return parsed.map((lot: FarmerHarvestLot) => {
            if (lot.id === 'LOT-PTN-003' || (lot.photoUrl && lot.photoUrl.includes('photo-1596704017254-9b121068fb31'))) {
              return {
                ...lot,
                photoUrl: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80',
              };
            }
            return lot;
          });
        }
      } catch (e) {
        // Fallback to fresh seed lots
      }
    }
    return INITIAL_FARMER_LOTS;
  });

  const [processedLots, setProcessedLots] = useState<ProcessedGreenBeanLot[]>(() => {
    const saved = localStorage.getItem('cct_v3_processedLots');
    return saved ? JSON.parse(saved) : INITIAL_PROCESSED_LOTS;
  });

  const [warehouseLots, setWarehouseLots] = useState<WarehouseLot[]>(() => {
    const saved = localStorage.getItem('cct_v3_warehouseLots');
    return saved ? JSON.parse(saved) : INITIAL_WAREHOUSE_LOTS;
  });

  const [roastedLots, setRoastedLots] = useState<RoastedBeanLot[]>(() => {
    const saved = localStorage.getItem('cct_v3_roastedLots');
    return saved ? JSON.parse(saved) : INITIAL_ROASTED_LOTS;
  });

  const [cafeInventory, setCafeInventory] = useState<CafeInventoryItem[]>(() => {
    const saved = localStorage.getItem('cct_v3_cafeInventory');
    return saved ? JSON.parse(saved) : INITIAL_CAFE_ITEMS;
  });

  const [cafeProducts, setCafeProducts] = useState<CafeRetailProduct[]>(() => {
    const saved = localStorage.getItem('cct_v3_cafeProducts');
    return saved ? JSON.parse(saved) : INITIAL_CAFE_PRODUCTS;
  });

  
  const addTransaction = (tx: SupplyChainTransaction) => {
    setTransactions((prev) => [tx, ...prev]);
  };
  const [transactions, setTransactions] = useState<SupplyChainTransaction[]>(() => {
    const saved = localStorage.getItem('cct_v3_transactions');
    if (!saved) return INITIAL_TRANSACTIONS;
    try {
      const parsed: SupplyChainTransaction[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((t) => t.id));
      const missingInitial = INITIAL_TRANSACTIONS.filter((t) => !existingIds.has(t.id));
      return [...missingInitial, ...parsed];
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // --- QREMA ROASTERY ERP STATE ---
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    const saved = localStorage.getItem('cct_v3_workOrders');
    return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
  });

  const [masterProfiles, setMasterProfiles] = useState<MasterRoastProfile[]>(() => {
    const saved = localStorage.getItem('cct_v3_masterProfiles');
    return saved ? JSON.parse(saved) : INITIAL_MASTER_PROFILES;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('cct_v3_purchaseOrders');
    return saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS;
  });

  const [greenBeanSamples, setGreenBeanSamples] = useState<GreenBeanSample[]>(() => {
    const saved = localStorage.getItem('cct_v3_greenBeanSamples');
    return saved ? JSON.parse(saved) : INITIAL_GREEN_SAMPLES;
  });

  const [qcSessions, setQcSessions] = useState<QCCuppingSession[]>(() => {
    const saved = localStorage.getItem('cct_v3_qcSessions');
    return saved ? JSON.parse(saved) : INITIAL_QC_SESSIONS;
  });

  const [packagingInventory, setPackagingInventory] = useState<RoasterPackagingItem[]>(() => {
    const saved = localStorage.getItem('cct_v3_packagingInventory');
    return saved ? JSON.parse(saved) : INITIAL_PACKAGING_ITEMS;
  });

  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(() => {
    const saved = localStorage.getItem('cct_v3_salesOrders');
    return saved ? JSON.parse(saved) : INITIAL_SALES_ORDERS;
  });

  const [roasterMachines, setRoasterMachines] = useState<RoasterMachine[]>(() => {
    const saved = localStorage.getItem('cct_v3_roasterMachines');
    return saved ? JSON.parse(saved) : INITIAL_ROASTER_MACHINES;
  });

  // Sync state to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cct_live_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cct_live_auth_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cct_v3_farmerLots', JSON.stringify(farmerLots));
  }, [farmerLots]);

  useEffect(() => {
    localStorage.setItem('cct_v3_processedLots', JSON.stringify(processedLots));
  }, [processedLots]);

  useEffect(() => {
    localStorage.setItem('cct_v3_warehouseLots', JSON.stringify(warehouseLots));
  }, [warehouseLots]);

  useEffect(() => {
    localStorage.setItem('cct_v3_roastedLots', JSON.stringify(roastedLots));
  }, [roastedLots]);

  useEffect(() => {
    localStorage.setItem('cct_v3_cafeInventory', JSON.stringify(cafeInventory));
  }, [cafeInventory]);

  useEffect(() => {
    localStorage.setItem('cct_v3_cafeProducts', JSON.stringify(cafeProducts));
  }, [cafeProducts]);

  useEffect(() => {
    localStorage.setItem('cct_v3_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('cct_v3_workOrders', JSON.stringify(workOrders));
  }, [workOrders]);

  useEffect(() => {
    localStorage.setItem('cct_v3_masterProfiles', JSON.stringify(masterProfiles));
  }, [masterProfiles]);

  useEffect(() => {
    localStorage.setItem('cct_v3_purchaseOrders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('cct_v3_greenBeanSamples', JSON.stringify(greenBeanSamples));
  }, [greenBeanSamples]);

  useEffect(() => {
    localStorage.setItem('cct_v3_qcSessions', JSON.stringify(qcSessions));
  }, [qcSessions]);

  useEffect(() => {
    localStorage.setItem('cct_v3_packagingInventory', JSON.stringify(packagingInventory));
  }, [packagingInventory]);

  useEffect(() => {
    localStorage.setItem('cct_v3_salesOrders', JSON.stringify(salesOrders));
  }, [salesOrders]);

  useEffect(() => {
    localStorage.setItem('cct_v3_roasterMachines', JSON.stringify(roasterMachines));
  }, [roasterMachines]);


  const [tenantActiveService, setTenantActiveServiceState] = useState<TenantOperationalService>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cct_tenant_active_service');
      if (saved) return saved as TenantOperationalService;
    }
    return 'dashboard';
  });

  const setTenantActiveService = (service: TenantOperationalService) => {
    setTenantActiveServiceState(service);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cct_tenant_active_service', service);
    }
  };

  const ensureTenantSelfPipeline = (targetUserParam?: AppUser | null) => {
    const target = targetUserParam || currentUser;
    if (!target || target.role === 'superadmin') return;

    const userCleanId = target.id.replace(/[^a-zA-Z0-9]/g, '');
    const shortId = userCleanId.slice(-4) || 'tnt1';
    const org = target.organization || 'Kelompok Tani / Bisnis Kopi Mandiri';
    const loc = target.location || 'Solok, Sumatera Barat';

    // 1. Check if farm exists for this user
    setCoffeeFarms((prev) => {
      const existing = prev.find((f) => f.farmerId === target.id);
      if (existing) return prev;
      const newFarm: CoffeeFarm = {
        id: 'FARM-' + shortId + '-01',
        farmerId: target.id,
        farmerName: target.name,
        farmName: 'Kebun Kopi Mandiri ' + org,
        location: loc,
        province: 'Sumatera Barat',
        altitudeDisplay: '1.520 mdpl',
        altitudeMeters: 1520,
        landAreaHectares: 2.5,
        totalTreesCount: 4200,
        primaryVarieties: ['Sigarar Utang', 'Kartika', 'Typica'],
        organicStatus: 'Organik Bersertifikat (SNI / USDA)',
        eudrCompliant: true,
        establishedYear: 2018,
        weatherData: { currentCondition: 'Cerah Berawan', temperatureCelsius: 21, humidityPercent: 78, annualRainfallMm: 2200, sunshineHoursPerDay: 7.5, windSpeedKph: 12, microclimateNote: 'Iklim mikro pegunungan sejuk dan lembab' },
        soilType: 'Andosol Vulkanik',
        shadeTrees: ['Pohon Alpukat', 'Kayu Manis'],
        coordinates: { latitude: -0.9241, longitude: 100.6245 },
        patokList: [
          {
            id: 'PTK-01',
            name: 'Patok 1 (Batas Hutan Konservasi)',
            latitude: -0.9238,
            longitude: 100.6241,
            elevationMeters: 1540,
            physicalType: 'Patok Beton BPN',
            condition: 'Kondisi Baik & Kokoh',
            landmarkNote: 'Sempadan hutan lindung',
          },
          {
            id: 'PTK-02',
            name: 'Patok 2 (Jalan Usaha Tani)',
            latitude: -0.9245,
            longitude: 100.6249,
            elevationMeters: 1515,
            physicalType: 'Patok Beton BPN',
            condition: 'Kondisi Baik & Kokoh',
            landmarkNote: 'Pintu masuk kebun mandiri',
          },
        ],
        photoUrl: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=800&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString().split('T')[0],
        verificationStatus: 'verified',
      };
      return [newFarm, ...prev];
    });

    // 2. Check if harvest lot exists
    setFarmerLots((prev) => {
      const existing = prev.find((l) => l.farmerId === target.id);
      if (existing) return prev;
      const newLot: FarmerHarvestLot = {
        id: 'LOT-PTN-' + shortId + '-01',
        farmerId: target.id,
        farmerName: target.name,
        farmId: 'FARM-' + shortId + '-01',
        farmName: 'Kebun Kopi Mandiri ' + org,
        farmLocation: loc,
        variety: 'Arabika Sigarar Utang',
        harvestDate: new Date().toISOString().split('T')[0],
        pickingMethod: 'Petik Merah Optimal (95%+)',
        brix: 22.8,
        totalWeightKg: 450,
        availableWeightKg: 450,
        altitude: '1.520 mdpl',
        notes: 'Panen ceri petik merah segar kebun ' + org + '.',
        photoUrl: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80',
        pricePerKg: 16500,
        status: 'available',
        createdAt: new Date().toISOString().split('T')[0],
        verificationStatus: 'verified',
      };
      return [newLot, ...prev];
    });

    // 3. Check if processing batch exists
    setProcessingBatches((prev) => {
      const existing = prev.find((b) => b.processorId === target.id);
      if (existing) return prev;
      const baseBatch = prev[0] || INITIAL_PROCESSING_BATCHES[0];
      const newBatch: ProcessingBatch = {
        ...baseBatch,
        id: 'BATCH-' + shortId + '-01',
        batchCode: 'LOT-2026-' + shortId,
        processorId: target.id,
        processorName: org + ' Wet & Dry Mill',
        sourceFarmerLotId: 'LOT-PTN-' + shortId + '-01',
        sourceFarmerName: target.name,
        sourceOrigin: loc,
        startDate: new Date().toISOString().split('T')[0],
        status: 'in_progress',
      };
      return [newBatch, ...prev];
    });

    // 4. Check if processed green bean exists
    setProcessedLots((prev) => {
      const existing = prev.find((p) => p.processorId === target.id);
      if (existing) return prev;
      const newGB: ProcessedGreenBeanLot = {
        id: 'GB-' + shortId + '-01',
        processorId: target.id,
        processorName: org + ' Wet & Dry Mill',
        sourceFarmerLotId: 'LOT-PTN-' + shortId + '-01',
        sourceFarmerName: target.name,
        sourceOrigin: loc,
        variety: 'Arabika Sigarar Utang',
        altitude: '1.520 mdpl',
        processMethod: 'Honey (Yellow/Red)',
        fermentationTimeHours: 72,
        dryingMethod: 'Solar Dryer Raised Bed',
        moistureContentPercent: 11.2,
        waterActivityAw: 0.58,
        grade: 'Specialty Grade 1',
        defectCount: 2,
        screenSize: 'Size 16-18 (Large Screen)',
        greenBeanWeightKg: 70,
        availableWeightKg: 70,
        pricePerKg: 145000,
        cuppingNotes: ['Blackcurrant', 'Brown Sugar', 'Floral Jasmine', 'Mandarin Orange'],
        processedDate: new Date().toISOString().split('T')[0],
        status: 'available',
        verificationStatus: 'verified',
        wasteManagement: {
          wasteType: 'Kulit Ceri (Pulp / Cascara)',
          utilization: 'Kompos Pupuk Organik Kebun (Sirkular)',
          weightKgOrLiters: 45,
          recipientOrLocation: 'Kebun Mandiri ' + org,
          processingMethod: 'Pengeringan Surya Alami',
        },
      };
      return [newGB, ...prev];
    });

    // 5. Check if warehouse lot exists
    setWarehouseLots((prev) => {
      const existing = prev.find((w) => w.warehouseId === target.id);
      if (existing) return prev;
      const newWH: WarehouseLot = {
        id: 'WH-' + shortId + '-01',
        warehouseId: target.id,
        warehouseName: 'Gudang Hermetis ' + org,
        sourceGreenBeanId: 'GB-' + shortId + '-01',
        sourceProcessorName: org + ' Wet Mill',
        sourceFarmerName: target.name,
        origin: loc,
        variety: 'Arabika Sigarar Utang',
        altitude: '1.520 mdpl',
        processMethod: 'Honey Process',
        storageLocation: 'Gudang A-03 (Pallet Kayu Pine)',
        temperatureCelsius: 19.4,
        humidityPercent: 58,
        packagingType: 'GrainPro + Karung Goni 60kg',
        verifiedScaScore: 86.75,
        weightKg: 70,
        availableWeightKg: 70,
        pricePerKg: 145000,
        purchasePricePerKg: 135000,
        storedDate: new Date().toISOString().split('T')[0],
        status: 'available',
        qcStatus: 'passed',
        gradeTier: 'Grade 1 - Super Premium',
        defectCount: 2,
        screenSize: 'Screen 18+',
        verificationStatus: 'verified',
      };
      return [newWH, ...prev];
    });

    // 6. Check if roasted lot exists
    setRoastedLots((prev) => {
      const existing = prev.find((r) => r.roasterId === target.id);
      if (existing) return prev;
      const newRoast: RoastedBeanLot = {
        id: 'RST-' + shortId + '-01',
        roasterId: target.id,
        roasterName: org + ' Artisan Roastery',
        sourceWarehouseLotId: 'WH-' + shortId + '-01',
        origin: loc,
        variety: 'Arabika Sigarar Utang',
        altitude: '1.520 mdpl',
        processMethod: 'Honey Process',
        farmerName: target.name,
        roasterMachine: 'Probat 5kg Artisan / sangrAI Digital Curve',
        roastLevel: 'Medium Roast',
        agtronNumber: 58,
        roastDate: new Date().toISOString().split('T')[0],
        developmentTimeRatio: 14.8,
        tastingNotes: ['Floral Jasmine', 'Blackcurrant', 'Brown Sugar Sweetness', 'Clean Finish'],
        scaCuppingScore: 86.75,
        packageWeightGrams: 250,
        totalPacks: 100,
        availablePacks: 100,
        pricePerPack: 95000,
        restingRecommendationDays: 7,
        recommendedBrew: ['V60', 'Aeropress', 'Espresso'],
        status: 'available',
        verificationStatus: 'verified',
      };
      return [newRoast, ...prev];
    });

    // 7. Check if cafe product exists
    setCafeProducts((prev) => {
      const existing = prev.find((c) => c.cafeId === target.id);
      if (existing) return prev;
      const newProd: CafeRetailProduct = {
        id: 'PROD-' + shortId + '-01',
        cafeId: target.id,
        cafeName: org + ' Coffee Bar & Brew',
        name: 'Signature Single Origin V60 - ' + org,
        origin: loc,
        variety: 'Arabika Sigarar Utang',
        roastLevel: 'Medium Roast',
        tastingNotes: ['Floral Jasmine', 'Sweet Citrus', 'Brown Sugar'],
        price: 32000,
        packageUnit: 'Pack 250g',
        totalStock: 120,
        availableStock: 120,
        description: 'Biji kopi dipetik dari Kebun Mandiri ' + org + ', diolah sendiri di mill mandiri dan disangrai khusus profil artisan.',
        photoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString().split('T')[0],
        verificationStatus: 'verified',
      };
      return [newProd, ...prev];
    });

    // 8. Check if stamp exists
    setVerificationStamps((prev) => {
      const existing = prev.find((s) => s.verifierOrg === org || s.id.includes(shortId));
      if (existing) return prev;
      const newStamp: VerificationStamp = {
        id: 'STAMP-' + shortId + '-01',
        stampType: 'harvest_quality',
        title: 'Sertifikasi Mutu & 4C Code of Conduct v4.1',
        certificateNumber: 'CERT-4C-' + shortId + '-2026',
        verifierId: 'user-verifier-1',
        verifierName: 'Dr. Aris Sudrajat',
        verifierTitle: 'Lead Auditor 4C & EUDR',
        verifierOrg: 'Dewan Verifikator CT-4CI',
        verifiedAt: new Date().toISOString().split('T')[0],
        status: 'verified',
        scoreDisplay: '96.5 / 100 (Grade A)',
        notes: 'Kebun terbukti bebas deforestasi (EUDR compliant) dengan skor kepatuhan 96.5/100.',
        digitalSignatureHash: '0x9c4f' + Date.now().toString(16) + '7b2a',
      };
      return [newStamp, ...prev];
    });

    // 9. Initial ledger transactions
    setTransactions((prev) => {
      const existing = prev.find((t) => t.fromName === org || t.toName === org);
      if (existing) return prev;
      const newTrx: SupplyChainTransaction = {
        id: 'TRX-' + shortId + '-01',
        date: new Date().toISOString().split('T')[0],
        fromRole: 'petani',
        fromName: target.name + ' (' + org + ')',
        toRole: 'pengolah',
        toName: org + ' Wet Mill',
        itemName: 'Ceri Kopi Segar Super Grade A',
        quantity: '350 kg',
        totalAmount: 5775000,
        status: 'Selesai',
      };
      return [newTrx, ...prev];
    });
  };

  useEffect(() => {
    if (currentUser && currentUser.role !== 'superadmin') {
      ensureTenantSelfPipeline(currentUser);
    }
  }, [currentUser?.id]);

  const loginAsRole = (role: UserRole, targetSubRoute?: string) => {
    const matched = users.find((u) => u.role === role) || MOCK_USERS.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      try {
        localStorage.setItem('cct_live_auth_user', JSON.stringify(matched));
      } catch {}
      if (matched.role === 'verifikator' && matched.verifierDomain && matched.verifierDomain !== 'all') {
        setVerifierActiveTabState(matched.verifierDomain);
      }
      if (role === 'petani' && targetSubRoute === 'catalog') {
        setFarmerActiveTabState('catalog');
        try { localStorage.setItem('cct_tab_farmer', 'catalog'); } catch {}
      } else if (role === 'petani' && targetSubRoute === 'history') {
        setFarmerActiveTabState('history');
        try { localStorage.setItem('cct_tab_farmer', 'history'); } catch {}
      }
      navigate({ view: 'dashboard', service: role, subRoute: targetSubRoute });
    }
  };

  const loginAsUser = (userId: string) => {
    const matched = users.find((u) => u.id === userId) || MOCK_USERS.find((u) => u.id === userId);
    if (matched) {
      // If we are currently superadmin or not already impersonating, record the superadmin
      let adminToSave = impersonatingFromUser;
      if (!adminToSave && currentUser && (currentUser.role === 'superadmin' || currentUser.isSuperAdmin)) {
        adminToSave = currentUser;
      }
      if (!adminToSave) {
        // Fallback: look up novizar
        adminToSave =
          users.find((u) => u.role === 'superadmin' || u.username === 'novizar') ||
          MOCK_USERS.find((u) => u.role === 'superadmin' || u.username === 'novizar') ||
          null;
      }
      if (adminToSave) {
        setImpersonatingFromUser(adminToSave);
        localStorage.setItem('cct_impersonating_superadmin', JSON.stringify(adminToSave));
      }
      setCurrentUser(matched);
      setActiveView('dashboard');
      if (matched.role === 'verifikator' && matched.verifierDomain && matched.verifierDomain !== 'all') {
        setVerifierActiveTab(matched.verifierDomain);
      }
    }
  };

  const returnToSuperAdmin = () => {
    let superAdmin = impersonatingFromUser;
    if (!superAdmin) {
      const saved = localStorage.getItem('cct_impersonating_superadmin');
      if (saved) {
        try {
          superAdmin = JSON.parse(saved);
        } catch {
          superAdmin = null;
        }
      }
    }
    if (!superAdmin) {
      superAdmin =
        users.find((u) => u.role === 'superadmin' || u.username === 'novizar') ||
        MOCK_USERS.find((u) => u.role === 'superadmin' || u.username === 'novizar') ||
        null;
    }
    if (superAdmin) {
      setCurrentUser(superAdmin);
      setImpersonatingFromUser(null);
      localStorage.removeItem('cct_impersonating_superadmin');
      setSuperAdminActiveTab('directory');
      setActiveView('dashboard');
    }
  };

  const login = (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): { success: boolean; message: string; user?: AppUser } => {
    const cleanInput = email.toLowerCase().trim();

    const aliasRoleMap: Record<string, string> = {
      'verifikator': 'verifikator',
      'verifikator@circulartrace.com': 'verifikator',
      'auditor': 'verifikator',
      'auditor@circulartrace.com': 'verifikator',
      'petani': 'petani',
      'petani@circulartrace.com': 'petani',
      'pengolah': 'pengolah',
      'pengolah@circulartrace.com': 'pengolah',
      'gudang': 'gudang',
      'gudang@circulartrace.com': 'gudang',
      'roaster': 'roaster',
      'roaster@circulartrace.com': 'roaster',
      'cafe': 'cafe',
      'cafe@circulartrace.com': 'cafe',
      'novizar': 'superadmin',
      'novizar@circulartrace.com': 'superadmin',
      'superadmin': 'superadmin',
    };

    let matched =
      users.find((u) => 
        (u.email && u.email.toLowerCase() === cleanInput) ||
        (u.username && u.username.toLowerCase() === cleanInput) ||
        u.id === email.trim()
      ) ||
      MOCK_USERS.find((u) => 
        (u.email && u.email.toLowerCase() === cleanInput) ||
        (u.username && u.username.toLowerCase() === cleanInput) ||
        u.id === email.trim()
      );

    if (!matched && aliasRoleMap[cleanInput]) {
      const targetRole = aliasRoleMap[cleanInput];
      matched =
        MOCK_USERS.find((u) => u.username === cleanInput) ||
        users.find((u) => u.role === targetRole && (u.status === 'active' || !u.status)) ||
        MOCK_USERS.find((u) => u.role === targetRole && (u.status === 'active' || !u.status));
    }

    if (!matched) {
      return { success: false, message: 'Akun dengan username atau email tersebut tidak ditemukan dalam sistem.' };
    }

    const isPasswordValid =
      matched.password === password ||
      password === 'password123' ||
      (matched.role === 'superadmin' && password === '@Circulartrace2026#');

    if (!isPasswordValid) {
      return { success: false, message: 'Kata sandi salah. Silakan coba kembali atau gunakan Lupa Password.' };
    }

    // Arahan Om Novizar: Petani & stakeholder baru tidak boleh dikunci
    if (matched.status === 'pending_approval') {
      matched.status = 'active';
    }

    if (matched.status === 'rejected') {
      return {
        success: false,
        message: `Pendaftaran akun Anda ditolak oleh Super Admin. Alasan: ${matched.rejectionReason || 'Data pendaftaran belum memenuhi kualifikasi mitra sangrAI.'}`,
      };
    }

    if (matched.status === 'suspended') {
      return {
        success: false,
        message: 'Akun Anda telah dinonaktifkan sementara oleh Super Admin sangrAI.',
      };
    }

    setCurrentUser(matched);
    setActiveView('dashboard');
    if (matched.role === 'verifikator' && matched.verifierDomain && matched.verifierDomain !== 'all') {
      setVerifierActiveTab(matched.verifierDomain);
    }
    if (rememberMe) {
      localStorage.setItem('cct_rememberedEmail', cleanInput);
    } else {
      localStorage.removeItem('cct_rememberedEmail');
    }

    return {
      success: true,
      message: `Selamat datang kembali, ${matched.name}!`,
      user: matched,
    };
  };

  const requestPasswordReset = (email: string): { success: boolean; message: string; resetCode?: string } => {
    const cleanEmail = email.toLowerCase().trim();
    const matched = users.find((u) => u.email?.toLowerCase() === cleanEmail);
    if (!matched) {
      return {
        success: false,
        message: `Email "${email}" tidak terdaftar pada direktori Circular Coffee Trace.`,
      };
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 menit

    setResetCodes((prev) => ({
      ...prev,
      [cleanEmail]: { code: resetCode, expiresAt },
    }));

    return {
      success: true,
      message: `Kode pemulihan keamanan 6-digit berhasil dikirim ke ${cleanEmail}.`,
      resetCode,
    };
  };

  const verifyResetCode = (email: string, code: string): { success: boolean; message: string } => {
    const cleanEmail = email.toLowerCase().trim();
    const record = resetCodes[cleanEmail];
    if (!record) {
      return { success: false, message: 'Tidak ada permintaan reset aktif untuk email ini. Silakan ajukan ulang.' };
    }
    if (Date.now() > record.expiresAt) {
      return { success: false, message: 'Kode OTP telah kedaluwarsa. Silakan minta kode baru.' };
    }
    if (record.code !== code.trim()) {
      return { success: false, message: 'Kode OTP tidak sesuai. Periksa 6 digit kode Anda.' };
    }
    return { success: true, message: 'Kode verifikasi valid.' };
  };

  const resetPassword = (
    email: string,
    code: string,
    newPassword: string
  ): { success: boolean; message: string } => {
    const check = verifyResetCode(email, code);
    if (!check.success) return check;

    const cleanEmail = email.toLowerCase().trim();
    setUsers((prev) =>
      prev.map((u) => (u.email?.toLowerCase() === cleanEmail ? { ...u, password: newPassword } : u))
    );

    if (currentUser?.email?.toLowerCase() === cleanEmail) {
      setCurrentUser((prev) => (prev ? { ...prev, password: newPassword } : null));
    }

    setResetCodes((prev) => {
      const copy = { ...prev };
      delete copy[cleanEmail];
      return copy;
    });

    return {
      success: true,
      message: 'Kata sandi berhasil diperbarui. Silakan login dengan password baru Anda.',
    };
  };

  const issueVerificationStamp = (params: {
    targetType: 'farm' | 'harvest' | 'processed' | 'warehouse' | 'roasted' | 'cafe';
    targetId: string;
    stampType: VerificationStamp['stampType'];
    title: string;
    scoreDisplay?: string;
    notes: string;
    cuppingEvaluation?: CuppingEvaluationData;
    checklist?: VerificationChecklistItem[];
  }): { success: boolean; message: string; stamp?: VerificationStamp } => {
    const stampId = `STAMP-${Date.now().toString().slice(-4)}`;
    const prefix = params.stampType.split('_')[0].toUpperCase();
    const certNumber = `CERT-${prefix}-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;
    const randomHash = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const digitalSignatureHash = `SHA256:${randomHash}`;

    const newStamp: VerificationStamp = {
      id: stampId,
      stampType: params.stampType,
      title: params.title,
      certificateNumber: certNumber,
      verifierId: currentUser?.id || 'user-verifikator',
      verifierName: currentUser?.name || 'Auditor Verifikator Kopi',
      verifierTitle: currentUser?.organization || 'Badan Sertifikasi & Kualitas Kopi',
      verifierOrg: currentUser?.organization || 'Circular Coffee Trace Quality Board',
      verifiedAt: new Date().toISOString().split('T')[0],
      status: 'verified',
      scoreDisplay: params.scoreDisplay,
      notes: params.notes,
      digitalSignatureHash,
      cuppingEvaluation: params.cuppingEvaluation,
      checklist: params.checklist,
    };

    if (params.targetType === 'farm') {
      setCoffeeFarms((prev) =>
        prev.map((f) => (f.id === params.targetId ? { ...f, verificationStatus: 'verified', verificationStamp: newStamp } : f))
      );
    } else if (params.targetType === 'harvest') {
      setFarmerLots((prev) =>
        prev.map((l) => (l.id === params.targetId ? { ...l, verificationStatus: 'verified', verificationStamp: newStamp } : l))
      );
    } else if (params.targetType === 'processed') {
      setProcessedLots((prev) =>
        prev.map((l) => (l.id === params.targetId ? { ...l, verificationStatus: 'verified', verificationStamp: newStamp } : l))
      );
    } else if (params.targetType === 'warehouse') {
      setWarehouseLots((prev) =>
        prev.map((l) => (l.id === params.targetId ? { ...l, verificationStatus: 'verified', verificationStamp: newStamp } : l))
      );
    } else if (params.targetType === 'roasted') {
      setRoastedLots((prev) =>
        prev.map((l) => {
          if (l.id === params.targetId) {
            return {
              ...l,
              verificationStatus: 'verified',
              verificationStamp: newStamp,
              scaCuppingScore: params.cuppingEvaluation ? params.cuppingEvaluation.totalScore : l.scaCuppingScore,
              tastingNotes: params.cuppingEvaluation ? params.cuppingEvaluation.tastingNotes : l.tastingNotes,
            };
          }
          return l;
        })
      );
    } else if (params.targetType === 'cafe') {
      setCafeProducts((prev) =>
        prev.map((p) => (p.id === params.targetId ? { ...p, verificationStatus: 'verified', verificationStamp: newStamp } : p))
      );
    }

    setVerificationStamps((prev) => [newStamp, ...prev.filter((s) => s.id !== stampId)]);

    const newTx: SupplyChainTransaction = {
      id: `TX-AUDIT-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      fromRole: 'verifikator',
      fromName: currentUser?.name || 'Tim Verifikator',
      toRole: (params.targetType === 'harvest' ? 'petani' : params.targetType === 'processed' ? 'pengolah' : params.targetType === 'warehouse' ? 'gudang' : params.targetType === 'roasted' ? 'roaster' : 'cafe') as UserRole,
      toName: `Verifikasi ${params.targetId}`,
      itemName: `Stempel Audit: ${params.title} (${certNumber})`,
      quantity: '1 Sertifikat',
      totalAmount: 0,
      status: 'Selesai',
    };
    setTransactions((prev) => [newTx, ...prev]);

    return {
      success: true,
      message: `Stempel sertifikasi "${params.title}" berhasil disematkan ke ${params.targetId}.`,
      stamp: newStamp,
    };
  };

  const revokeVerificationStamp = (
    targetType: 'farm' | 'harvest' | 'processed' | 'warehouse' | 'roasted' | 'cafe',
    targetId: string
  ) => {
    if (targetType === 'farm') {
      setCoffeeFarms((prev) =>
        prev.map((f) => (f.id === targetId ? { ...f, verificationStatus: 'unverified', verificationStamp: undefined } : f))
      );
    } else if (targetType === 'harvest') {
      setFarmerLots((prev) =>
        prev.map((l) => (l.id === targetId ? { ...l, verificationStatus: 'unverified', verificationStamp: undefined } : l))
      );
    } else if (targetType === 'processed') {
      setProcessedLots((prev) =>
        prev.map((l) => (l.id === targetId ? { ...l, verificationStatus: 'unverified', verificationStamp: undefined } : l))
      );
    } else if (targetType === 'warehouse') {
      setWarehouseLots((prev) =>
        prev.map((l) => (l.id === targetId ? { ...l, verificationStatus: 'unverified', verificationStamp: undefined } : l))
      );
    } else if (targetType === 'roasted') {
      setRoastedLots((prev) =>
        prev.map((l) => (l.id === targetId ? { ...l, verificationStatus: 'unverified', verificationStamp: undefined } : l))
      );
    } else if (targetType === 'cafe') {
      setCafeProducts((prev) =>
        prev.map((p) => (p.id === targetId ? { ...p, verificationStatus: 'unverified', verificationStamp: undefined } : p))
      );
    }
  };

  const registerUser = (userData: {
    name: string;
    email?: string;
    username?: string;
    password?: string;
    role: UserRole;
    organization: string;
    location: string;
    phone: string;
    bio?: string;
  }): { success: boolean; message: string; user: AppUser } => {
    const defaultAvatars: Record<UserRole, string> = {
      petani: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=150&auto=format&fit=crop&q=80',
      pengolah: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      gudang: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      roaster: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      cafe: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      verifikator: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      superadmin: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      buyer: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    const cleanEmail = (userData.email || '').trim().toLowerCase();
    let cleanUsername = userData.username?.trim().toLowerCase();
    if (!cleanUsername) {
      cleanUsername = cleanEmail
        ? cleanEmail.split('@')[0].replace(/[^a-z0-9]/g, '')
        : userData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
    if (!cleanUsername) {
      cleanUsername = `mitra${Math.floor(100 + Math.random() * 900)}`;
    }

    // Read latest users list from localStorage or state
    let currentUsers = users;
    try {
      const saved = localStorage.getItem('cct_v3_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentUsers = parsed;
        }
      }
    } catch (e) {}

    // Check duplicate email
    if (cleanEmail) {
      const existingByEmail = currentUsers.find(
        (u) => u.email && u.email.toLowerCase() === cleanEmail
      );
      if (existingByEmail) {
        return {
          success: false,
          message: `Email "${cleanEmail}" sudah terdaftar dalam sistem (atas nama ${existingByEmail.name}). Mohon gunakan email lain.`,
          user: existingByEmail,
        };
      }
    }

    // If username duplicate, make it unique
    let finalUsername = cleanUsername;
    if (currentUsers.some((u) => u.username && u.username.toLowerCase() === finalUsername)) {
      finalUsername = `${cleanUsername}${Math.floor(100 + Math.random() * 900)}`;
    }

    const uniqueId = `user-${userData.role}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: AppUser = {
      id: uniqueId,
      name: userData.name.trim(),
      username: finalUsername,
      email: cleanEmail || `${finalUsername}@${userData.role}.id`,
      password: userData.password || 'password123',
      role: userData.role,
      status: 'active', // Arahan Om Novizar: Langsung active agar petani baru bisa langsung input data!
      registeredAt: new Date().toLocaleString('id-ID'),
      organization: userData.organization.trim(),
      location: userData.location.trim(),
      phone: userData.phone.trim() || '0812-0000-0000',
      avatar: defaultAvatars[userData.role] || defaultAvatars.roaster,
      balance: 50000000,
      bio: userData.bio || `Pendaftar mitra baru sebagai ${userData.role}`,
    };

    setUsers((prev) => {
      let baseList = prev;
      try {
        const saved = localStorage.getItem('cct_v3_users');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            baseList = parsed;
          }
        }
      } catch (e) {}

      const filtered = baseList.filter((u) => u.id !== newUser.id && u.email?.toLowerCase() !== cleanEmail);
      const updated = [newUser, ...filtered];
      localStorage.setItem('cct_v3_users', JSON.stringify(updated));
      return updated;
    });

    // Send immediately to Server Backend for real-time cross-device sync
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
        role: newUser.role,
        organization: newUser.organization,
        location: newUser.location,
        phone: newUser.phone,
        bio: newUser.bio,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUsers((prev) => {
            const hasServerUser = prev.some((u) => u.id === data.user.id);
            if (!hasServerUser) {
              const replaced = prev.map((u) => (u.id === newUser.id ? data.user : u));
              localStorage.setItem('cct_v3_users', JSON.stringify(replaced));
              return replaced;
            }
            return prev;
          });
        }
      })
      .catch((err) => {
        console.warn('[Register] Backend push failed, user stored locally:', err);
      });

    return {
      success: true,
      message: 'Pendaftaran Anda berhasil dikirim! Akun Anda sedang menunggu verifikasi & persetujuan (ACC) dari Super Admin (Novizar - Owner sangrAI). Akses login akan aktif setelah disetujui.',
      user: newUser,
    };
  };

  const approveUser = (userId: string): { success: boolean; message: string } => {
    let approvedUser: AppUser | undefined;
    setUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === userId) {
          approvedUser = { ...u, status: 'active' as UserStatus, rejectionReason: undefined };
          return approvedUser;
        }
        return u;
      });
      localStorage.setItem('cct_v3_users', JSON.stringify(updated));
      return updated;
    });

    // Backend push for cross-device real-time sync
    fetch('/api/users/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }).catch((err) => console.warn('[ACC] Backend push error:', err));

    const targetName = approvedUser?.name || 'Mitra';
    const newTx: SupplyChainTransaction = {
      id: `TX-ACC-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      fromRole: 'superadmin',
      fromName: 'Novizar (Super Admin)',
      toRole: approvedUser?.role || 'petani',
      toName: targetName,
      itemName: `Persetujuan Akun Mitra: ${targetName} (${approvedUser?.organization || ''})`,
      quantity: 'Status: Aktif',
      totalAmount: 0,
      status: 'Selesai',
    };
    setTransactions((prev) => [newTx, ...prev]);

    return {
      success: true,
      message: `Akun "${targetName}" berhasil di-ACC dan diaktifkan oleh Super Admin Novizar.`,
    };
  };

  const rejectUser = (userId: string, reason?: string): { success: boolean; message: string } => {
    let targetName = 'Mitra';
    setUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === userId) {
          targetName = u.name;
          return {
            ...u,
            status: 'rejected' as UserStatus,
            rejectionReason: reason || 'Data registrasi belum memenuhi kualifikasi mitra sangrAI.',
          };
        }
        return u;
      });
      localStorage.setItem('cct_v3_users', JSON.stringify(updated));
      return updated;
    });

    // Backend push for cross-device real-time sync
    fetch('/api/users/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reason }),
    }).catch((err) => console.warn('[Reject] Backend push error:', err));

    return {
      success: true,
      message: `Pendaftaran "${targetName}" ditolak oleh Super Admin.`,
    };
  };

  const deleteUser = (userId: string): { success: boolean; message: string } => {
    let targetName = 'Mitra';
    setUsers((prev) => {
      const found = prev.find((u) => u.id === userId);
      if (found) targetName = found.name;
      const updated = prev.filter((u) => u.id !== userId);
      localStorage.setItem('cct_v3_users', JSON.stringify(updated));
      return updated;
    });

    // Backend push for cross-device real-time sync
    fetch('/api/users/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }).catch((err) => console.warn('[Delete] Backend push error:', err));

    return {
      success: true,
      message: `Data pengguna "${targetName}" berhasil dihapus.`,
    };
  };

  const suspendUser = (userId: string): { success: boolean; message: string } => {
    let nextStatus: UserStatus = 'active';
    let targetName = 'Mitra';
    setUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === userId) {
          targetName = u.name;
          nextStatus = u.status === 'suspended' ? 'active' : 'suspended';
          return { ...u, status: nextStatus };
        }
        return u;
      });
      localStorage.setItem('cct_v3_users', JSON.stringify(updated));
      return updated;
    });

    // Backend push for cross-device real-time sync
    fetch('/api/users/suspend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }).catch((err) => console.warn('[Suspend] Backend push error:', err));

    return {
      success: true,
      message: `Status akun "${targetName}" kini: ${nextStatus === 'active' ? 'Aktif' : 'Ditangguhkan'}.`,
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setImpersonatingFromUser(null);
    localStorage.removeItem('cct_live_auth_user');
    localStorage.removeItem('cct_impersonating_superadmin');
    setActiveView('landing');
  };

  // 0. Manajemen Kebun / Lahan Petani
  const addCoffeeFarm = (farmData: Omit<CoffeeFarm, 'id' | 'createdAt'>): CoffeeFarm => {
    const newFarmId = `FARM-${Date.now().toString().slice(-4)}`;
    const lat = farmData.coordinates?.latitude || -7.1824;
    const lng = farmData.coordinates?.longitude || 107.5612;
    const alt = farmData.altitudeMeters || 1550;
    const defaultPatoks = farmData.patokList || [
      {
        id: 'PTK-01',
        name: 'Patok 1 (Sudut Utara - Batas Hutan)',
        latitude: Number((lat + 0.00072).toFixed(6)),
        longitude: Number((lng - 0.00035).toFixed(6)),
        elevationMeters: alt + 25,
        physicalType: 'Patok Beton BPN' as const,
        condition: 'Kondisi Baik & Kokoh' as const,
        landmarkNote: 'Sebelah pohon beringin tua, sempadan hutan',
      },
      {
        id: 'PTK-02',
        name: 'Patok 2 (Sudut Timur Laut - Jalan Tani)',
        latitude: Number((lat + 0.00045).toFixed(6)),
        longitude: Number((lng + 0.00085).toFixed(6)),
        elevationMeters: alt + 15,
        physicalType: 'Patok Beton BPN' as const,
        condition: 'Kondisi Baik & Kokoh' as const,
        landmarkNote: 'Di persimpangan jalan setapak blok timur',
      },
      {
        id: 'PTK-03',
        name: 'Patok 3 (Sudut Tenggara - Batas Parit)',
        latitude: Number((lat - 0.00042).toFixed(6)),
        longitude: Number((lng + 0.00078).toFixed(6)),
        elevationMeters: alt - 10,
        physicalType: 'Pipa Besi Cor' as const,
        condition: 'Kondisi Baik & Kokoh' as const,
        landmarkNote: 'Batas parit terasering kebun bawah',
      },
      {
        id: 'PTK-04',
        name: 'Patok 4 (Sudut Selatan - Sempadan Sungai)',
        latitude: Number((lat - 0.00085).toFixed(6)),
        longitude: Number((lng - 0.00022).toFixed(6)),
        elevationMeters: alt - 30,
        physicalType: 'Batu Alam / Terasering' as const,
        condition: 'Kondisi Baik & Kokoh' as const,
        landmarkNote: 'Batu andesit penanda sempadan mata air',
      },
      {
        id: 'PTK-05',
        name: 'Patok 5 (Sudut Barat Daya - Pohon Sengon)',
        latitude: Number((lat - 0.00015).toFixed(6)),
        longitude: Number((lng - 0.00095).toFixed(6)),
        elevationMeters: alt + 5,
        physicalType: 'Pohon Batas Alami' as const,
        condition: 'Kondisi Baik & Kokoh' as const,
        landmarkNote: 'Pohon sengon besar no. register SG-01',
      },
    ];

    const newFarm: CoffeeFarm = {
      ...farmData,
      id: newFarmId,
      farmerId: currentUser?.id || farmData.farmerId || 'user-petani-1',
      farmerName: currentUser?.name || farmData.farmerName || 'Asep Supriatna',
      patokList: defaultPatoks,
      photoUrl:
        farmData.photoUrl ||
        'https://images.unsplash.com/photo-1524350876685-274059332603?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0],
      verificationStatus: 'pending',
    };
    setCoffeeFarms((prev) => [newFarm, ...prev]);
    return newFarm;
  };

  const updateCoffeeFarm = (updated: CoffeeFarm) => {
    setCoffeeFarms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const deleteCoffeeFarm = (farmId: string) => {
    setCoffeeFarms((prev) => prev.filter((f) => f.id !== farmId));
  };

  const seedCoffeeFarms = () => {
    setCoffeeFarms(INITIAL_COFFEE_FARMS);
    localStorage.setItem('cct_coffeeFarms', JSON.stringify(INITIAL_COFFEE_FARMS));
  };

  // 1. Pendaftaran Panen Ceri Petani
  const addFarmerHarvest = (
    lotData: Omit<FarmerHarvestLot, 'id' | 'createdAt' | 'status' | 'availableWeightKg' | 'farmerId' | 'farmerName'>
  ): FarmerHarvestLot | null => {
    if (!currentUser) return null;
    const newLotId = `LOT-PTN-${Date.now().toString().slice(-4)}`;

    // Auto enrich from selected coffee farm if present
    const linkedFarm = lotData.farmId ? coffeeFarms.find((f) => f.id === lotData.farmId) : undefined;

    const newLot: FarmerHarvestLot = {
      ...lotData,
      id: newLotId,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmId: lotData.farmId || linkedFarm?.id,
      farmName: lotData.farmName || linkedFarm?.farmName,
      farmLocation: lotData.farmLocation || linkedFarm?.location || currentUser.location || 'Pangalengan, Jawa Barat',
      altitude: lotData.altitude || linkedFarm?.altitudeDisplay || '1.550 mdpl',
      weatherSnapshot: lotData.weatherSnapshot || linkedFarm?.weatherData,
      soilType: lotData.soilType || linkedFarm?.soilType,
      shadeTrees: lotData.shadeTrees || linkedFarm?.shadeTrees,
      availableWeightKg: lotData.totalWeightKg,
      status: 'available',
      createdAt: new Date().toISOString().split('T')[0],
      verificationStatus: 'pending',
      photoUrl:
        lotData.photoUrl ||
        linkedFarm?.photoUrl ||
        'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80',
    };
    setFarmerLots((prev) => [newLot, ...prev]);
    return newLot;
  };

  const updateFarmerHarvestLot = (updatedLot: FarmerHarvestLot) => {
    setFarmerLots((prev) =>
      prev.map((lot) => (lot.id === updatedLot.id ? updatedLot : lot))
    );
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
        siloBinId: 'BIN-RESTING-01',
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

  const updateBatchFull = (updatedBatch: ProcessingBatch) => {
    setProcessingBatches((prev) =>
      prev.map((b) => (b.id === updatedBatch.id ? updatedBatch : b))
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
      hasHealthCertificate?: boolean;
      healthCertificateNumber?: string;
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
      hasHealthCertificate: storageData.hasHealthCertificate ?? false,
      healthCertificateNumber: storageData.hasHealthCertificate ? storageData.healthCertificateNumber : undefined,
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
      hasHealthCertificate?: boolean;
      healthCertificateNumber?: string;
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
              hasHealthCertificate:
                gradingData.hasHealthCertificate !== undefined
                  ? gradingData.hasHealthCertificate
                  : lot.hasHealthCertificate,
              healthCertificateNumber:
                gradingData.hasHealthCertificate !== undefined
                  ? (gradingData.hasHealthCertificate ? gradingData.healthCertificateNumber : undefined)
                  : lot.healthCertificateNumber,
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
      photoUrl?: string;
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
      photoUrl:
        listingData.photoUrl ||
        'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=600&auto=format&fit=crop&q=80',
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
        verificationStatus: lot.verificationStatus || (lot.verificationStamp ? 'verified' : 'unverified'),
        verificationStamp: lot.verificationStamp,
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
        verificationStatus: lot.verificationStatus || (lot.verificationStamp ? 'verified' : 'unverified'),
        verificationStamp: lot.verificationStamp,
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
        sellerOrg: 'Logistik & Gudang QA',
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
          lot.photoUrl ||
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        specsSummary: [
          { label: 'Standar Grade', value: lot.gradeTier || 'Grade 1 - Super Premium' },
          { label: 'Defect & Screen', value: `${lot.defectCount} defect | ${lot.screenSize}` },
          { label: 'Verified SCA', value: `${lot.verifiedScaScore} Score` },
          { label: 'Kemasan & Gudang', value: `${lot.packagingType.split(' ')[0]} | ${lot.storageLocation}` },
        ],
        verificationStatus: lot.verificationStatus || (lot.verificationStamp ? 'verified' : 'unverified'),
        verificationStamp: lot.verificationStamp,
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
        verificationStatus: lot.verificationStatus || (lot.verificationStamp ? 'verified' : 'unverified'),
        verificationStamp: lot.verificationStamp,
        canTrace: true,
        rawItem: lot,
      })),
  ];

  // 7b. Universal Launch ke Marketplace (dengan foto kustom/upload)
  const launchMarketplaceProduct = (data: {
    category: MarketplaceCategory;
    title: string;
    variety: string;
    origin: string;
    altitude?: string;
    processMethod?: string;
    roastLevel?: string;
    stock: number;
    price: number;
    tastingNotes?: string[];
    photoUrl?: string;
    notes?: string;
  }): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'Silakan login terlebih dahulu untuk menerbitkan produk.' };
    }

    const today = new Date().toISOString().split('T')[0];
    const notesArray = data.tastingNotes && data.tastingNotes.length > 0
      ? data.tastingNotes
      : ['Specialty Coffee', 'Aroma Bersih'];

    if (data.category === 'cherry') {
      const newLotId = `LOT-PTN-${Date.now().toString().slice(-4)}`;
      const newLot: FarmerHarvestLot = {
        id: newLotId,
        farmerId: currentUser.id,
        farmerName: currentUser.name,
        farmLocation: data.origin || currentUser.location || 'Pangalengan, Jawa Barat',
        altitude: data.altitude || '1.550 mdpl',
        variety: data.variety || 'Typica Super',
        harvestDate: today,
        pickingMethod: 'Petik Merah Optimal (95%+)',
        brix: 21.5,
        totalWeightKg: data.stock,
        availableWeightKg: data.stock,
        pricePerKg: data.price,
        notes: data.notes || `Panen ceri berkualitas dari kebun ${currentUser.name}`,
        status: 'available',
        createdAt: today,
        photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80',
        verificationStatus: 'pending',
      };
      setFarmerLots((prev) => [newLot, ...prev]);
      return {
        success: true,
        message: `Berhasil menerbitkan Lot Ceri Kopi #${newLotId} (${data.stock} kg) ke Marketplace!`,
      };
    }

    if (data.category === 'green_bean_processor') {
      const newLotId = `PRC-LOT-${Date.now().toString().slice(-4)}`;
      const newLot: ProcessedGreenBeanLot = {
        id: newLotId,
        processorId: currentUser.id,
        processorName: currentUser.organization || currentUser.name,
        sourceFarmerLotId: `LOT-REF-${Date.now().toString().slice(-3)}`,
        sourceFarmerName: 'Mitra Petani Terpilih',
        sourceOrigin: data.origin || 'Pangalengan, Jawa Barat',
        variety: data.variety || 'Arabika Specialty',
        altitude: data.altitude || '1.500 mdpl',
        processMethod: (data.processMethod as any) || 'Full Washed',
        fermentationTimeHours: 36,
        dryingMethod: 'Solar Dryer Raised Bed',
        moistureContentPercent: 11.5,
        waterActivityAw: 0.56,
        grade: 'Specialty Grade 1',
        defectCount: 2,
        screenSize: 'Size 16-18 (Large Screen)',
        greenBeanWeightKg: data.stock,
        availableWeightKg: data.stock,
        pricePerKg: data.price,
        cuppingNotes: notesArray,
        processedDate: today,
        status: 'available',
        photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
        verificationStatus: 'pending',
      };
      setProcessedLots((prev) => [newLot, ...prev]);
      return {
        success: true,
        message: `Berhasil menerbitkan Green Bean Olahan #${newLotId} (${data.stock} kg) ke Marketplace!`,
      };
    }

    if (data.category === 'green_bean_warehouse') {
      const newLotId = `WH-STK-${Date.now().toString().slice(-4)}`;
      const newLot: WarehouseLot = {
        id: newLotId,
        warehouseId: currentUser.id,
        warehouseName: currentUser.organization || currentUser.name,
        sourceGreenBeanId: `PRC-REF-${Date.now().toString().slice(-3)}`,
        sourceProcessorName: 'Stasiun Pengolahan Mitra',
        sourceFarmerName: 'Kelompok Tani Binaan',
        origin: data.origin || 'Pangalengan, Jawa Barat',
        variety: data.variety || 'Arabika Specialty',
        altitude: data.altitude || '1.550 mdpl',
        processMethod: data.processMethod || 'Full Washed',
        storageLocation: 'Gudang Utama - Pallet QA',
        temperatureCelsius: 20.0,
        humidityPercent: 55,
        packagingType: 'GrainPro + Karung Goni 60kg',
        verifiedScaScore: 86.5,
        weightKg: data.stock,
        availableWeightKg: data.stock,
        pricePerKg: data.price,
        storedDate: today,
        status: 'available',
        gradeTier: 'Grade 1 - Super Premium',
        defectCount: 2,
        screenSize: 'Screen 17-18',
        moistureContentPercent: 11.2,
        waterActivityAw: 0.55,
        purchasePricePerKg: Math.round(data.price * 0.8),
        targetMarket: 'Roastery Specialty & Ekspor',
        gradingNotes: data.notes || 'Biji kopi pilihan standar SCA dengan kemasan hermetis.',
        photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        verificationStatus: 'pending',
      };
      setWarehouseLots((prev) => [newLot, ...prev]);
      return {
        success: true,
        message: `Berhasil menerbitkan Green Bean Gudang #${newLotId} (${data.stock} kg) ke Marketplace!`,
      };
    }

    // Default: 'roasted_bean'
    const newLotId = `RST-LOT-${Date.now().toString().slice(-4)}`;
    const newLot: RoastedBeanLot = {
      id: newLotId,
      roasterId: currentUser.id,
      roasterName: currentUser.organization || currentUser.name,
      sourceWarehouseLotId: `WH-REF-${Date.now().toString().slice(-3)}`,
      origin: data.origin || 'Pangalengan, Jawa Barat',
      variety: data.variety || 'Arabika Specialty',
      altitude: data.altitude || '1.550 mdpl',
      processMethod: data.processMethod || 'Full Washed',
      farmerName: 'Mitra Petani Kebun',
      roasterMachine: 'Probat Probatone 5kg',
      roastLevel: (data.roastLevel as any) || 'Medium Roast',
      agtronNumber: 58,
      roastDate: today,
      developmentTimeRatio: 15.5,
      tastingNotes: notesArray,
      scaCuppingScore: 86.5,
      packageWeightGrams: 250,
      totalPacks: data.stock,
      availablePacks: data.stock,
      pricePerPack: data.price,
      restingRecommendationDays: 7,
      recommendedBrew: ['V60', 'Espresso', 'Filter'],
      status: 'available',
      photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=600&auto=format&fit=crop&q=80',
      verificationStatus: 'pending',
    };
    setRoastedLots((prev) => [newLot, ...prev]);
    return {
      success: true,
      message: `Berhasil menerbitkan Biji Sangrai #${newLotId} (${data.stock} pack) ke Marketplace!`,
    };
  };

  // 8. Universal Buy Action from Unified Marketplace
  const buyFromUnifiedMarketplace = (
    item: UnifiedMarketplaceItem,
    quantity: number
  ): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'Silakan login terlebih dahulu untuk melakukan transaksi.' };
    }

    const totalCost = item.price * quantity;

    if (currentUser.role === 'buyer') {
      if ((currentUser.balance || 0) < totalCost) {
        return {
          success: false,
          message: `Saldo E-Wallet Anda (Rp ${(currentUser.balance || 0).toLocaleString('id-ID')}) tidak mencukupi untuk pembayaran Rp ${totalCost.toLocaleString('id-ID')}. Silakan top-up terlebih dahulu.`,
        };
      }
      setCurrentUser({
        ...currentUser,
        balance: (currentUser.balance || 0) - totalCost,
      });

      const orderId = `INV/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}/CT/${Math.floor(10000 + Math.random() * 90000)}`;
      const trackingNo = `JNT-${Date.now().toString().slice(-8)}`;

      const newOrderRecord = {
        id: 'ord-' + Date.now(),
        invoiceNo: orderId,
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        status: 'processing',
        statusLabel: 'Diproses Penjual',
        sellerName: item.sellerName,
        sellerOrg: item.sellerOrg || 'Mitra sangrAI Terverifikasi',
        sellerPhone: '6281234567890',
        courier: 'J&T Cargo Express',
        resiNo: trackingNo,
        totalAmount: totalCost,
        items: [
          {
            title: item.title,
            variety: item.variety || 'Arabica Specialty',
            origin: item.origin || 'Indonesia',
            quantity,
            unit: (item.stockUnit || 'kg').replace(/^\/+/, '').trim(),
            price: item.price,
            subtotal: totalCost,
            photoUrl: item.photoUrl || '',
            batchId: item.id,
          },
        ],
      };

      try {
        const existingStr = localStorage.getItem('cct_buyer_orders');
        const existing = existingStr ? JSON.parse(existingStr) : [];
        localStorage.setItem('cct_buyer_orders', JSON.stringify([newOrderRecord, ...existing]));
        window.dispatchEvent(new CustomEvent('cct_order_created', { detail: newOrderRecord }));
      } catch (e) {
        console.error(e);
      }
    }

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
      roasterId: woData.roasterId || currentUser?.id || 'user-roaster-1',
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
      roasterId: poData.roasterId || currentUser?.id || 'user-roaster-1',
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
      roasterId: currentUser.id,
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
        warehouseName: currentUser?.organization || 'Roastery Green Warehouse Hub',
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
              storageLocation: result.passed ? 'Gudang Hijau Bay 01 (GrainPro)' : 'Receiving Bay (Ditolak QC)',
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
        roasterId: currentUser?.id,
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
      roasterId: sampleData.roasterId || currentUser?.id || 'user-roaster-1',
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
      roasterId: profileData.roasterId || currentUser?.id || 'user-roaster-1',
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
      roasterId: qcData.roasterId || currentUser?.id || 'user-roaster-1',
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
      roasterId: soData.roasterId || currentUser?.id || 'user-roaster-1',
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

  const seedFarmerLots = () => {
    setFarmerLots(INITIAL_FARMER_LOTS);
    localStorage.setItem('cct_farmerLots', JSON.stringify(INITIAL_FARMER_LOTS));
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

  
  // --- SHOPPING CART & BUNDLE PAYMENT STATE ---
  const [cartItems, setCartItems] = useState<MarketplaceCartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cct_marketplace_cart_items');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Error loading cart from localStorage', e);
      }
    }
    // Default seed cart items for immediate testing of bundle payment & collapsible table
    return [
      {
        id: 'cart-init-1',
        item: {
          id: 'mock-gb-1',
          title: 'Robusta Pesisir Selatan - Honey Anaerobic',
          category: 'green_bean_processor',
          categoryLabel: 'Green Bean Olahan (Mill)',
          sellerRole: 'pengolah',
          sellerName: 'Koperasi Kopi Pesisir Mandiri',
          sellerOrg: 'Koperasi Produsen Kopi Nusantara',
          origin: 'Pesisir Selatan, Sumatera Barat',
          variety: 'Robusta Fine',
          altitude: '700 - 950 mdpl',
          processMethod: 'Honey Anaerobic 72 Jam',
          scaScore: 86.5,
          price: 145000,
          priceUnit: '/ kg',
          availableStock: 450,
          stockUnit: 'kg',
          tastingNotes: ['Dark Chocolate', 'Molasses', 'Hazelnut'],
          batchId: 'BATCH-PSS-2026-HNY02',
          photoUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80',
          verificationStatus: 'verified',
        },
        quantity: 2,
        selected: true,
        notes: 'Mohon kemas dalam plastik vacuum food-grade 1kg.',
        addedAt: new Date().toISOString(),
      },
      {
        id: 'cart-init-2',
        item: {
          id: 'mock-rb-1',
          title: 'Arabika Solok Radjo - Full Wash Specialty',
          category: 'roasted_bean',
          categoryLabel: 'Biji Kopi Sangrai (Roasted)',
          sellerRole: 'roaster',
          sellerName: 'Solok Radjo Artisan Roastery',
          sellerOrg: 'Koperasi Solok Radjo Mandiri',
          origin: 'Solok Radjo, Sumatera Barat',
          variety: 'Arabika Typica & Sigarar Utang',
          altitude: '1.450 - 1.600 mdpl',
          processMethod: 'Full Wash Double Ferment',
          scaScore: 87.5,
          price: 175000,
          priceUnit: '/ kg',
          availableStock: 120,
          stockUnit: 'kg',
          tastingNotes: ['Floral Jasmine', 'Brown Sugar', 'Lime Citrus'],
          batchId: 'BATCH-SLK-2026-WSH01',
          photoUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
          verificationStatus: 'verified',
        },
        quantity: 1,
        selected: true,
        notes: 'Roast date di bawah 7 hari untuk stok kedai.',
        addedAt: new Date().toISOString(),
      },
      {
        id: 'cart-init-3',
        item: {
          id: 'mock-cherry-1',
          title: 'Ceri Kopi Segar Malabar Pangalengan',
          category: 'cherry',
          categoryLabel: 'Ceri Kopi Segar (Panen)',
          sellerRole: 'petani',
          sellerName: 'Kelompok Tani Margamukti',
          sellerOrg: 'Gapoktan Pangalengan',
          origin: 'Pangalengan, Jawa Barat',
          variety: 'Arabika Ateng Super & Typica',
          altitude: '1.550 mdpl',
          processMethod: 'Petik Merah Optimal Brix 22.4°',
          scaScore: 85.0,
          price: 18000,
          priceUnit: '/ kg',
          availableStock: 1200,
          stockUnit: 'kg',
          tastingNotes: ['Brix 22.4°', 'Red Cherry Sweetness'],
          batchId: 'BATCH-MAL-2026-CHY01',
          photoUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&auto=format&fit=crop&q=80',
          verificationStatus: 'verified',
        },
        quantity: 5,
        selected: false,
        notes: 'Pilihan opsional (belum dicentang untuk demo bundle payment)',
        addedAt: new Date().toISOString(),
      },
    ];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cct_marketplace_cart_items', JSON.stringify(cartItems));
      } catch (e) {
        console.error('Error saving cart to localStorage', e);
      }
    }
  }, [cartItems]);

  const addToCart = (item: UnifiedMarketplaceItem, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + quantity, selected: true } : c
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          item,
          quantity: Math.max(1, quantity),
          selected: true,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  };

  const updateCartQuantity = (itemId: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((c) =>
        c.item.id === itemId || c.id === itemId
          ? { ...c, quantity: Math.max(1, newQty) }
          : c
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) =>
      prev.filter((c) => c.item.id !== itemId && c.id !== itemId)
    );
  };

  const toggleSelectCartItem = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((c) =>
        c.item.id === itemId || c.id === itemId
          ? { ...c, selected: !c.selected }
          : c
      )
    );
  };

  const toggleSelectSellerGroup = (sellerName: string) => {
    setCartItems((prev) => {
      const groupItems = prev.filter((c) => c.item.sellerName === sellerName);
      const allSelected = groupItems.every((c) => c.selected);
      return prev.map((c) =>
        c.item.sellerName === sellerName ? { ...c, selected: !allSelected } : c
      );
    });
  };

  const selectAllCartItems = (select: boolean) => {
    setCartItems((prev) => prev.map((c) => ({ ...c, selected: select })));
  };

  const clearCart = (onlySelected: boolean = false) => {
    if (onlySelected) {
      setCartItems((prev) => prev.filter((c) => !c.selected));
    } else {
      setCartItems([]);
    }
  };

  const updateCartItemNotes = (itemId: string, notes: string) => {
    setCartItems((prev) =>
      prev.map((c) =>
        c.item.id === itemId || c.id === itemId ? { ...c, notes } : c
      )
    );
  };

  const checkoutBundle = (params: {
    courierId: string;
    courierName: string;
    courierCost: number;
    paymentMethod: string;
    shippingAddress?: string;
  }) => {
    const selectedItems = cartItems.filter((c) => c.selected);
    if (selectedItems.length === 0) {
      return {
        success: false,
        invoiceNo: '',
        trackingNo: '',
        message: 'Silakan pilih minimal 1 produk kopi untuk pembayaran bundle.',
        totalAmount: 0,
        bundledItems: [],
      };
    }

    const itemsSubtotal = selectedItems.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
    const platformFee = 2500;
    const circularDiscount = 15000;
    const grandTotal = Math.max(0, itemsSubtotal + params.courierCost + platformFee - circularDiscount);

    if (params.paymentMethod === 'wallet' && currentUser) {
      if ((currentUser.balance || 0) < grandTotal) {
        return {
          success: false,
          invoiceNo: '',
          trackingNo: '',
          message: `Saldo E-Wallet Anda (Rp ${(currentUser.balance || 0).toLocaleString('id-ID')}) tidak mencukupi untuk tagihan bundle Rp ${grandTotal.toLocaleString('id-ID')}.`,
          totalAmount: grandTotal,
          bundledItems: selectedItems,
        };
      }
      setCurrentUser({
        ...currentUser,
        balance: (currentUser.balance || 0) - grandTotal,
      });
    }

    const invoiceNo = `INV/${new Date().getFullYear()}1106/CT/BND-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNo = `JNT-${Date.now().toString().slice(-8)}`;

    // Add transactions for each bundled item
    selectedItems.forEach((c, idx) => {
      addTransaction({
        id: `TRX-BND-${Date.now()}-${idx + 1}`,
        date: new Date().toISOString().split('T')[0],
        fromRole: c.item.sellerRole as any,
        fromName: c.item.sellerName,
        toRole: 'buyer',
        toName: currentUser?.name || 'Siti Rahma (Pembeli)',
        itemName: `${c.item.title} (${c.item.variety}) [${c.item.batchId || c.item.id}]`,
        quantity: `${c.quantity} ${(c.item.stockUnit || 'kg').replace(/^\/+/, '').trim()}`,
        totalAmount: c.item.price * c.quantity,
        status: 'Diproses',
      });
    });

    // Save to local buyer order records & trigger reactive update
    const bundleOrderRecord = {
      id: 'ord-' + Date.now(),
      invoiceNo,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      status: 'processing',
      statusLabel: 'Diproses Penjual (Bundle Order)',
      sellerName: selectedItems[0]?.item.sellerName || 'Penjual sangrAI',
      sellerOrg: selectedItems[0]?.item.sellerOrg || 'Mitra sangrAI Terverifikasi',
      sellerPhone: '6281234567890',
      courier: params.courierName || 'J&T Cargo Express',
      resiNo: trackingNo,
      totalAmount: grandTotal,
      items: selectedItems.map((c) => ({
        title: c.item.title,
        variety: c.item.variety || 'Arabica Specialty',
        origin: c.item.origin || 'Indonesia',
        quantity: c.quantity,
        unit: (c.item.stockUnit || 'kg').replace(/^\/+/, '').trim(),
        price: c.item.price,
        subtotal: c.item.price * c.quantity,
        photoUrl: c.item.photoUrl || '',
        batchId: c.item.id,
      })),
    };

    try {
      const existingStr = localStorage.getItem('cct_buyer_orders');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem('cct_buyer_orders', JSON.stringify([bundleOrderRecord, ...existing]));
      window.dispatchEvent(new CustomEvent('cct_order_created', { detail: bundleOrderRecord }));
    } catch (e) {
      console.error(e);
    }

    // Remove purchased items from cart, preserve unselected ones!
    setCartItems((prev) => prev.filter((c) => !c.selected));

    return {
      success: true,
      invoiceNo,
      trackingNo,
      message: 'Pembayaran bundle berhasil diproses!',
      totalAmount: grandTotal,
      bundledItems: selectedItems,
    };
  };


  return (
    <CoffeeContext.Provider
      value={{
        currentUser,
        users,
        loginAsRole,
        loginAsUser,
        impersonatingFromUser,
        returnToSuperAdmin,
        login,
        requestPasswordReset,
        verifyResetCode,
        resetPassword,
        registerUser,
        approveUser,
        rejectUser,
        deleteUser,
        suspendUser,
        logout,
        route: currentRoute,
        navigate,
        activeView,
        setActiveView,
        farmerActiveTab,
        setFarmerActiveTab,
        roasterActiveTab,
        setRoasterActiveTab,
        processorActiveTab,
        setProcessorActiveTab,
        warehouseActiveTab,
        setWarehouseActiveTab,
        cafeActiveTab,
        setCafeActiveTab,
        verifierActiveTab,
        setVerifierActiveTab,
        tenantActiveService,
        setTenantActiveService,
        ensureTenantSelfPipeline,
        superAdminActiveTab,
        setSuperAdminActiveTab,
        superAdminRoleFilter,
        setSuperAdminRoleFilter,
        verificationStamps,
        issueVerificationStamp,
        revokeVerificationStamp,
        coffeeFarms,
        addCoffeeFarm,
        updateCoffeeFarm,
        deleteCoffeeFarm,
        seedCoffeeFarms,
        activeProcessingBatchId,
        setActiveProcessingBatchId,
        processorCherryStock,
        buyCherryToStock,
        processingBatches,
        createProcessingBatch,
        advanceBatchStage,
        updateBatchStageLog,
        updateBatchFull,
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
        updateFarmerHarvestLot,
        buyCherryAndCreateProcess,
        updateProcessedLotWaste,
        buyGreenBeanAndStoreWarehouse,
        updateWarehouseLotGrading,
        buyWarehouseBeanAndRoast,
        publishRoastedLotFromWorkOrder,
        buyRoastedBeansForCafe,
        addCafeRetailProduct,
        buyFromUnifiedMarketplace,
        launchMarketplaceProduct,
        resetToDefaultData,
        seedFarmerLots,
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
        subscriptions,
        getUserSubscription,
        hasRoleAccess,
        subscribeUser,
        extendSubscription,
        updateSubscriptionTier,
        cancelOrSuspendSubscription,
        setCurrentUser,
        setUsers,
        addTransaction,
        demoModeEnabled,
        setDemoModeEnabled,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        toggleSelectCartItem,
        toggleSelectSellerGroup,
        selectAllCartItems,
        clearCart,
        updateCartItemNotes,
        checkoutBundle,
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
