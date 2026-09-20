export type WorkOrderStatus =
  | 'draft'
  | 'scheduled'
  | 'in_production'
  | 'roasting'
  | 'qc_pending'
  | 'completed'
  | 'cancelled';

export interface RoastCurvePoint {
  timeSeconds: number; // e.g. 0, 60, 120...
  beanTemp: number; // BT (°C)
  envTemp: number; // ET (°C)
  rateOfRise: number; // RoR (°C/min)
}

export interface WorkOrderBatch {
  batchNumber: number; // e.g. 1, 2, 3
  greenWeightKg: number;
  roastedWeightKg: number;
  chargeTemp: number; // e.g. 200°C
  turningPointTemp: number; // e.g. 98°C
  yellowingTemp: number; // e.g. 150°C
  firstCrackTime: string; // e.g. "08:45"
  firstCrackTemp: number; // e.g. 196°C
  dropTemp: number; // e.g. 212°C
  totalRoastTime: string; // e.g. "10:30"
  dtrPercent: number; // Development Time Ratio %, e.g. 16.5%
  weightLossPercent: number; // e.g. 14.2%
  executedAt: string;
  roasterOperator: string;
  notes?: string;
  curveData?: RoastCurvePoint[];
}

export interface WorkOrder {
  id: string;
  woNumber: string; // e.g. "WO-2024-001"
  scheduledDate: string;
  dueDate: string;
  status: WorkOrderStatus;
  greenLotId: string;
  greenBeanName: string;
  origin: string;
  variety: string;
  processMethod: string;
  targetGreenKg: number;
  actualGreenKg: number;
  targetRoastedKg: number;
  actualRoastedKg: number;
  weightLossPercent: number; // Average weight loss %
  masterProfileId: string;
  masterProfileName: string;
  targetRoastLevel: string; // e.g. "Light-Medium Roast (Filter)"
  targetAgtron: number; // e.g. 65
  targetDtr: number; // e.g. 15.0%
  assignedMachine: string; // e.g. "Giesen W6A Artisan"
  assignedRoaster: string; // e.g. "Budi Roastmaster"
  batches: WorkOrderBatch[];
  salesOrderId?: string; // Optional link to made-to-order Sales Order
  customerName?: string;
  notes?: string;
  createdAt: string;
}

export interface MasterRoastProfile {
  id: string;
  name: string;
  targetRoastLevel: 'Light Roast' | 'Light-Medium' | 'Medium Roast' | 'Medium-Dark' | 'Dark Roast';
  agtronGourmet: number; // SCA Gourmet Scale (e.g. 75)
  agtronCommercial: number; // SCA Commercial Scale (e.g. 62)
  targetDtr: number; // Target Development Time Ratio (e.g. 15.2%)
  chargeTemp: number; // e.g. 205°C
  turningPointTemp: number; // e.g. 96°C
  yellowingTemp: number; // e.g. 152°C
  firstCrackTemp: number; // e.g. 195°C
  firstCrackTimeSeconds: number; // e.g. 510s (08:30)
  dropTemp: number; // e.g. 210°C
  totalTimeSeconds: number; // e.g. 620s (10:20)
  recommendedBrew: string[];
  flavorProfile: string[];
  description: string;
}

export type PurchaseOrderStatus = 'draft' | 'ordered' | 'in_transit' | 'received' | 'cancelled';

export interface POItem {
  id: string;
  greenBeanName: string;
  origin: string;
  variety: string;
  processMethod: string;
  bagCount: number;
  weightPerBagKg: number;
  totalWeightKg: number;
  pricePerKg: number;
  totalPrice: number;
  lotReference?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. "PO-2024-001"
  supplierName: string;
  supplierRole: 'petani' | 'pengolah' | 'gudang';
  orderDate: string;
  expectedDeliveryDate: string;
  status: PurchaseOrderStatus;
  items: POItem[];
  subtotal: number;
  freightCost: number;
  totalAmount: number;
  paymentStatus: 'unpaid' | 'paid' | 'partial';
  notes?: string;
}

export interface GreenBeanSample {
  id: string;
  sampleCode: string; // e.g. "SMP-082"
  sampleName: string;
  supplierName: string;
  origin: string;
  variety: string;
  processMethod: string;
  altitude: string;
  sampleCuppingScore: number;
  moisturePercent: number;
  screenSize: string;
  receivedDate: string;
  status: 'pending_evaluation' | 'approved_to_buy' | 'rejected';
  evaluationNotes: string;
  cuppingNotes: string[];
}

export interface QCCuppingSession {
  id: string;
  sessionCode: string; // e.g. "QC-2024-001"
  sessionName: string;
  date: string;
  workOrderId?: string;
  batchNumber?: number;
  beanName: string;
  origin: string;
  roastDate: string;
  cupperName: string;
  // SCA 10-Criteria Protocol
  fragranceScore: number; // 6.0 - 10.0
  flavorScore: number;
  aftertasteScore: number;
  acidityScore: number;
  bodyScore: number;
  balanceScore: number;
  cleanCupScore: number; // 6.0 - 10.0
  sweetnessScore: number;
  uniformityScore: number; // 10.0 default
  overallScore: number;
  defectsPenalty: number; // 0, -2, -4...
  totalScaScore: number; // Sum of scores - defects
  tastingNotes: string[];
  // Physical & Agtron QC
  moisturePercent: number; // Roasted moisture (1.0% - 2.5%)
  waterActivityAw: number;
  agtronWhole: number; // Whole bean color
  agtronGround: number; // Ground color
  status: 'approved_specialty' | 'approved_commercial' | 'quarantine' | 're_roast';
  notes?: string;
}

export type PackagingCategory =
  | 'bag_200g'
  | 'bag_250g'
  | 'bag_500g'
  | 'bag_1kg'
  | 'tin_can'
  | 'shipping_box'
  | 'valve_label';

export interface RoasterPackagingItem {
  id: string;
  name: string;
  category: PackagingCategory;
  stockQuantity: number;
  reorderPoint: number;
  unitCost: number;
  supplier: string;
  materialSpec: string; // e.g. "Matte Black Foil + One-Way Valve"
}

export type SalesOrderStatus =
  | 'draft'
  | 'confirmed'
  | 'in_production'
  | 'packed'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export interface SOItem {
  id: string;
  productName: string;
  roastLevel: string;
  packageSize: string; // e.g. "250g Pack", "1kg Bag"
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  workOrderId?: string;
}

export interface WholesaleCustomer {
  id: string;
  name: string;
  businessName: string; // e.g. "Kopi Kenangan Senopati"
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  tier: 'tier_1_vip' | 'tier_2_regular' | 'retail';
  discountPercent: number;
}

export interface SalesOrder {
  id: string;
  soNumber: string; // e.g. "SO-2024-001"
  customerId: string;
  customerName: string;
  orderDate: string;
  dueDate: string;
  status: SalesOrderStatus;
  items: SOItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  paymentStatus: 'unpaid' | 'paid' | 'credit_30d';
  associatedWorkOrderId?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface RoasterMachine {
  id: string;
  name: string; // e.g. "Giesen W6A"
  model: string;
  capacityKg: number; // e.g. 6.0
  heatSource: 'Gas Burner' | 'Hot Air Convection' | 'Electric Infrared';
  artisanConnected: boolean;
  status: 'ready' | 'roasting' | 'maintenance';
  lastMaintenanceDate: string;
  totalBatchesRoasted: number;
}
