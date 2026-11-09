import { UserRole } from './coffee';

export type SubscriptionTierId =
  | '1_month'
  | '3_months'
  | '6_months'
  | '1_year'
  | '7_days_trial'
  // Backward compatibility tier keys
  | 'starter_roaster'
  | 'farmer_mill'
  | 'trace_pro'
  | 'enterprise_360';

export type SubscriptionStatus =
  | 'active'
  | 'expiring_soon' // H-7 sebelum jatuh tempo
  | 'expired'
  | 'trial';

export interface SubscriptionPlan {
  id: SubscriptionTierId;
  name: string;
  badge: string;
  tagline: string;
  durationDays?: number;
  durationLabel: string;
  totalPrice: number;
  monthlyEquivalent: number;
  savingsNote?: string;
  pricePerMonth: number;
  pricePerYear: number;
  allowedRoles: UserRole[];
  features: string[];
  limitations?: string[];
  isPopular?: boolean;
  isBestValue?: boolean;
  colorScheme: 'amber' | 'emerald' | 'blue' | 'purple';
}

export interface SubscriptionInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  tierId: SubscriptionTierId;
  tierName: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: 'qris' | 'bank_transfer' | 'credit_card' | 'wallet';
  receiptNumber: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  organization: string;
  location?: string;
  tierId: SubscriptionTierId;
  tierName: string;
  status: SubscriptionStatus;
  startDate: string; // ISO date YYYY-MM-DD
  expiryDate: string; // ISO date YYYY-MM-DD (Tenggat)
  daysRemaining: number;
  durationDays: number;
  billingCycle: 'monthly' | 'yearly' | 'quarterly' | 'semester';
  pricePaid: number;
  paymentMethod: 'qris' | 'bank_transfer' | 'credit_card' | 'wallet';
  allowedRoles: UserRole[];
  autoRenew: boolean;
  notes?: string;
  invoices?: SubscriptionInvoice[];
}
