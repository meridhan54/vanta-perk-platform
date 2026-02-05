
export type UserTier = 'Bronze' | 'Silver' | 'Gold';

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  isVerified: boolean;
  isFirstLogin: boolean;
  companyName: string;
  sector: string;
  jobTitle: string;
  location: string;
  tier: UserTier;
  balance: number;
  totalSpent: number;
}

export type OfferType = 'cashback' | 'coupon' | 'deal' | 'giftcard' | 'trial';

export interface Perk {
  id: string;
  supplierName: string;
  title: string;
  description: string;
  offerType: OfferType;
  value: string; // İndirim oranı veya miktar
  originalPrice?: number;
  discountedPrice?: number;
  category: string;
  validUntil: string;
  redemptionLimit: number;
  currentRedemptions: number;
  rating?: number;
  location?: string;
  imageUrl?: string;
}

export interface UserPurchase {
  id: string;
  perkId: string;
  purchaseDate: string;
  amount: number;
  earnings: number;
  status: 'pending' | 'confirmed' | 'rejected';
  storeName: string;
}

export enum AuthStep {
  Login = 'login',
  Activation = 'activation',
  ChangePassword = 'changePassword',
  ForgotPassword = 'forgotPassword',
  Onboarding = 'onboarding'
}

export enum OnboardingStep {
  Personal = 1,
  Company = 2,
  Verification = 3
}
