import { UserRole } from './coffee';

export type SuperAdminServiceId =
  | 'admin_kelompok_tani'
  | 'gudang'
  | 'roaster'
  | 'cafe'
  | 'verifikator';

export type ServiceStatus = 'active' | 'maintenance' | 'invite_only' | 'disabled';

export interface ServiceFeatureToggle {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'traceability' | 'commercial' | 'ai' | 'compliance';
  enabled: boolean;
  isPremium?: boolean;
}

export interface ServiceQuotaSettings {
  maxUsersPerOrg: number;
  maxOrganizationsInPlatform: number;
  currentUsersCount: number;
  currentOrgsCount: number;
  allowPublicRegistration: boolean;
  requireManualVerification: boolean;
  maxLotsPerMonthPerOrg: number | string;
  maxQrTagsPerMonthPerOrg: number | string;
}

export interface ServicePricingSettings {
  defaultPackageId: string;
  defaultPackageName: string;
  baseMonthlyPrice: number;
  additionalSeatPriceMonthly: number;
  marketplaceFeePercent: number; // e.g. 1.5%
  customDomainAddonPrice: number;
  supportLevel: 'community' | 'standard' | 'priority_sla_24_7';
}

export interface ServiceConfig {
  id: SuperAdminServiceId;
  name: string;
  shortLabel: string;
  tierSubtitle: string;
  description: string;
  iconName: string;
  colorScheme: {
    primary: string;
    bgBadge: string;
    textBadge: string;
    border: string;
    gradient: string;
  };
  status: ServiceStatus;
  quota: ServiceQuotaSettings;
  pricing: ServicePricingSettings;
  features: ServiceFeatureToggle[];
  updatedAt: string;
}

export type SubscriptionStatus = 'active' | 'trial' | 'past_due' | 'suspended' | 'cancelled';
export type BillingCycle = 'monthly' | 'yearly';

export interface SubscribedOrganization {
  id: string;
  organizationName: string;
  picName: string;
  email: string;
  phone: string;
  location: string;
  serviceId: SuperAdminServiceId;
  packageId: string;
  packageName: string;
  billingCycle: BillingCycle;
  pricePerCycle: number;
  mrrContribution: number;
  status: SubscriptionStatus;
  userSeatsUsed: number;
  userSeatsLimit: number;
  lotsQuotaUsed: number;
  lotsQuotaLimit: number | string;
  startDate: string;
  renewalDate: string;
  autoRenew: boolean;
  lastPaymentDate?: string;
  lastPaymentMethod?: string;
  notes?: string;
}

export interface EcosystemTelemetryData {
  totalTracedVolumeKg: number;
  totalCherryVolumeKg: number;
  totalGreenBeanVolumeKg: number;
  totalRoastedBeanVolumeKg: number;
  totalFarmToCupQrScans: number;
  totalGeofencedFarmsCount: number;
  totalGeofencedHectares: number;
  eudrComplianceRatePercent: number;
  totalCircularWasteDivertedKg: number; // cascara, silverskin, compost
  circularityScoreAverage: number; // e.g. 94.2
  totalMonthlyRecurringRevenue: number;
  annualRunRate: number;
  totalSubscribedOrgs: number;
  activePlatformUsers: number;
  serverUptimePercent: number;
}

export interface SaaSInvoiceRecord {
  id: string;
  invoiceNumber: string;
  organizationName: string;
  serviceId: SuperAdminServiceId;
  packageName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paymentMethod?: string;
}
