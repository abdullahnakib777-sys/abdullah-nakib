export type UserRole = 'CUSTOMER' | 'RESELLER' | 'ADMIN';

export type ResellerStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'VERIFICATION_REQUIRED'
  | 'SUSPENDED'
  | 'REJECTED'
  | 'BLOCKED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  isFounder?: boolean;
}

export interface ResellerProfile {
  id: string;
  userId: string;
  storeName: string;
  facebookPage?: string;
  whatsappNumber: string;
  referralCode: string;
  status: ResellerStatus;
  isVerified: boolean;
  verificationFeePaid: boolean;
  verificationPayment?: {
    method: 'BKASH' | 'NAGAD' | 'ROCKET';
    senderPhone: string;
    trxId: string;
    amount: number;
    submittedAt: string;
    verifiedAt?: string;
    adminNote?: string;
  };
  adminApprovedFree?: boolean;
  division: string;
  district: string;
  upazila: string;
  address: string;
  salesIntent: string;
  referredBy?: string;
  level: number;
  xp: number;
  isAnonymousOnLeaderboard: boolean;
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  icon: string;
  itemCount: number;
  bannerImage?: string;
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  stock: number;
  // Financial units in BDT
  baseCost: number; // Cost to platform
  resellerPrice: number; // Wholesale price to reseller
  suggestedSellingPrice: number; // Recommended retail price
  oldPrice?: number; // Original strikethrough price for customers
  discountAmount?: number; // Discount amount (oldPrice - suggestedSellingPrice)
  minSellingPrice: number;
  maxSellingPrice: number;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewCount: number;
  successfulSalesCount: number;
  returnRatePercent: number;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  createdAt: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKAGING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'PAID'
  | 'CANCELLED'
  | 'RETURNED'
  | 'PARTIAL_DELIVERY'
  | 'LOST'
  | 'EXCHANGED';

export type CourierProvider = 'STEADFAST' | 'PATHAO' | 'REDX' | 'PAPERFLY';
export type PaymentMethod = 'COD' | 'BKASH' | 'NAGAD' | 'BANK';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  baseCost: number;
  resellerPrice: number;
  unitSellingPrice: number;
  resellerProfit: number;
  platformMargin: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ORD-2026-8891
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  postalCode?: string;
  customerNote?: string;
  resellerNote?: string;
  resellerId?: string;
  resellerStoreName?: string;
  resellerReferralCode?: string;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  totalAmount: number;
  totalResellerProfit: number;
  totalPlatformMargin: number;
  profitStatus: 'PENDING' | 'AVAILABLE' | 'REVERSED' | 'NONE';
  paymentMethod: PaymentMethod;
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
  courier: CourierProvider;
  trackingNumber: string;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
    updatedBy: string;
  }[];
  createdAt: string;
  deliveredAt?: string;
  settledAt?: string;
  isDirectCustomerOrder: boolean;
}

export type TransactionType =
  | 'SALE_PROFIT'
  | 'WITHDRAWAL'
  | 'REFUND'
  | 'RETURN_REVERSAL'
  | 'VERIFICATION_PAYMENT'
  | 'REFERRAL_REWARD'
  | 'BONUS'
  | 'ADJUSTMENT';

export interface WalletTransaction {
  id: string;
  resellerId: string;
  type: TransactionType;
  amount: number; // in BDT (positive for credits, negative for debits)
  balanceAfter: number;
  currency: 'BDT';
  referenceType: 'ORDER' | 'WITHDRAWAL' | 'VERIFICATION' | 'BONUS' | 'ADMIN';
  referenceId: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REVERSED';
  description: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface Wallet {
  resellerId: string;
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  updatedAt: string;
}

export type WithdrawalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'PROCESSING'
  | 'PAID'
  | 'REJECTED'
  | 'CANCELLED';

export interface WithdrawalRequest {
  id: string;
  resellerId: string;
  resellerName: string;
  resellerStoreName: string;
  amount: number;
  method: 'BKASH' | 'NAGAD' | 'BANK';
  accountNumber: string;
  accountName?: string;
  bankName?: string;
  branchName?: string;
  routingNumber?: string;
  status: WithdrawalStatus;
  requestedAt: string;
  approvedAt?: string;
  paidAt?: string;
  transactionId?: string;
  adminNote?: string;
}

export interface LeaderboardEntry {
  rank: number;
  resellerId: string;
  displayName: string;
  storeName: string;
  avatar?: string;
  salesCount: number;
  profitAmount: number;
  successfulDeliveries: number;
  level: number;
  levelTitle: string;
  xp: number;
  isFounder?: boolean;
  streakDays: number;
  badges: string[];
}

export interface Achievement {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  icon: string;
  category: 'SALES' | 'DELIVERY' | 'PROFIT' | 'STREAK' | 'ACADEMY';
  xpReward: number;
  badgeReward: string;
  conditionType: string;
  threshold: number;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: string;
  claimed: boolean;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  targetCount: number;
  metric: 'DELIVERIES' | 'SALES_BDT' | 'NEW_CUSTOMERS' | 'ACADEMY_LESSONS';
  rewardXp: number;
  rewardBonusBdt: number;
  startDate: string;
  endDate: string;
  currentProgress?: number;
  isCompleted?: boolean;
}

export interface AcademyLesson {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  titleBn: string;
  description: string;
  durationMinutes: number;
  xpReward: number;
  videoUrl?: string;
  youtubeUrl?: string;
  videoEmbedId?: string;
  contentMarkdown: string;
  keyTakeaways: string[];
  actionSteps: string[];
  order: number;
  isCompleted?: boolean;
}

export interface PlatformSettings {
  isVerificationRequired: boolean;
  verificationFeeBdt: number;
  isVerificationPaymentMandatory: boolean;
  minWithdrawalAmountBdt: number;
  standardDeliveryFeeDhaka: number;
  standardDeliveryFeeOutsideDhaka: number;
  platformFeePercent: number;
  referralRewardBdt: number;
  autoApproveResellers: boolean;
  supportPhone: string;
  supportWhatsapp: string;
  supportEmail: string;
  founderResellerId: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface FraudAlert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  type: 'DUPLICATE_ORDER' | 'SELF_REFERRAL' | 'RAPID_ORDERS' | 'SUSPICIOUS_WITHDRAWAL';
  resellerId?: string;
  orderId?: string;
  message: string;
  createdAt: string;
  status: 'PENDING_REVIEW' | 'DISMISSED' | 'ACTION_TAKEN';
}
