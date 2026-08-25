import {
  User,
  ResellerProfile,
  Product,
  ProductCategory,
  Order,
  Wallet,
  WalletTransaction,
  WithdrawalRequest,
  LeaderboardEntry,
  Achievement,
  UserAchievement,
  WeeklyChallenge,
  AcademyLesson,
  PlatformSettings,
  AuditLog,
  FraudAlert,
} from '../types';

let currentAuthToken = 'usr-founder';

export const setApiAuthToken = (token: string) => {
  currentAuthToken = token;
};

export const getApiAuthToken = () => currentAuthToken;

async function apiFetch<T>(endpoint: string, options: RequestInit = {}, retries = 2): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (currentAuthToken) {
    headers.set('Authorization', `Bearer ${currentAuthToken}`);
  }

  try {
    const res = await fetch(endpoint, {
      ...options,
      headers,
    });

    let data: any;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!res.ok) {
      throw new Error(data?.error || data?.message || `HTTP error ${res.status}`);
    }
    return data as T;
  } catch (err: any) {
    if (retries > 0 && (!options.method || options.method === 'GET')) {
      await new Promise((r) => setTimeout(r, 400));
      return apiFetch<T>(endpoint, options, retries - 1);
    }
    throw err;
  }
}

export const api = {
  // Auth
  getDemoAccounts: () =>
    apiFetch<{ accounts: { user: User; reseller?: ResellerProfile }[] }>('/api/v1/auth/demo-accounts'),

  loginAdmin: (body: { adminId: string; password?: string }) =>
    apiFetch<{ user: User; reseller?: ResellerProfile; token: string; message: string }>('/api/v1/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { emailOrPhone?: string; password?: string; userId?: string }) =>
    apiFetch<{ user: User; reseller?: ResellerProfile; token: string }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  registerCustomer: (body: { name: string; email?: string; phone: string }) =>
    apiFetch<{ user: User; token: string }>('/api/v1/auth/register-customer', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  registerReseller: (body: {
    name: string;
    email?: string;
    phone: string;
    storeName: string;
    facebookPage?: string;
    whatsappNumber: string;
    division: string;
    district: string;
    upazila?: string;
    address: string;
    salesIntent: string;
    referredBy?: string;
  }) =>
    apiFetch<{ user: User; reseller: ResellerProfile; token: string }>('/api/v1/auth/register-reseller', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Products
  getProducts: (params?: {
    category?: string;
    search?: string;
    trending?: boolean;
    bestSeller?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') searchParams.set(k, String(v));
      });
    }
    const qs = searchParams.toString();
    return apiFetch<{ products: Product[]; total: number }>(`/api/v1/products${qs ? `?${qs}` : ''}`);
  },

  getProduct: (idOrSlug: string) =>
    apiFetch<{ product: Product }>(`/api/v1/products/${idOrSlug}`),

  getProfitPreview: (body: {
    productId: string;
    sellingPrice?: number;
    quantity?: number;
    division?: string;
  }) =>
    apiFetch<{
      product: Product;
      calculation: {
        quantity: number;
        totalBaseCost: number;
        totalResellerCost: number;
        totalCustomerPrice: number;
        deliveryFee: number;
        platformFee: number;
        grossResellerProfit: number;
        netResellerProfit: number;
        platformMargin: number;
        isProfitable: boolean;
      };
    }>('/api/v1/products/profit-preview', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getCategories: () =>
    apiFetch<{ categories: ProductCategory[] }>('/api/v1/categories'),

  // Orders
  getOrders: (params?: { resellerId?: string; customerPhone?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) searchParams.set(k, v);
      });
    }
    const qs = searchParams.toString();
    return apiFetch<{ orders: Order[]; total: number }>(`/api/v1/orders${qs ? `?${qs}` : ''}`);
  },

  getOrder: (idOrTracking: string) =>
    apiFetch<{ order: Order }>(`/api/v1/orders/${idOrTracking}`),

  createOrder: (body: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    division: string;
    district: string;
    upazila?: string;
    address: string;
    postalCode?: string;
    customerNote?: string;
    resellerNote?: string;
    resellerId?: string;
    referralCode?: string;
    items: {
      productId: string;
      quantity: number;
      unitSellingPrice?: number;
    }[];
    paymentMethod?: string;
    courier?: string;
  }) =>
    apiFetch<{ order: Order }>('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateOrderStatus: (orderId: string, status: string, note?: string) =>
    apiFetch<{ order: Order }>(`/api/v1/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    }),

  // Wallet
  getWallet: (resellerId?: string) => {
    const qs = resellerId ? `?resellerId=${resellerId}` : '';
    return apiFetch<{
      wallet: Wallet;
      transactions: WalletTransaction[];
      withdrawals: WithdrawalRequest[];
    }>(`/api/v1/wallet${qs}`);
  },

  requestWithdrawal: (body: {
    resellerId?: string;
    amount: number;
    method: 'BKASH' | 'NAGAD' | 'BANK';
    accountNumber: string;
    accountName?: string;
    bankName?: string;
    branchName?: string;
    routingNumber?: string;
  }) =>
    apiFetch<{ withdrawal: WithdrawalRequest }>('/api/v1/withdrawals/request', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateWithdrawal: (
    id: string,
    body: { status: string; adminNote?: string; transactionId?: string }
  ) =>
    apiFetch<{ withdrawal: WithdrawalRequest }>(`/api/v1/withdrawals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  // Leaderboard & Gamification
  getLeaderboard: (period: 'weekly' | 'monthly' | 'allTime' = 'allTime') =>
    apiFetch<{ leaderboard: LeaderboardEntry[] }>(`/api/v1/leaderboard?period=${period}`),

  getGamification: () =>
    apiFetch<{
      achievements: Achievement[];
      unlocked: UserAchievement[];
      weeklyChallenges: WeeklyChallenge[];
      resellerLevel: number;
      resellerXp: number;
    }>('/api/v1/gamification'),

  // Academy
  getAcademyLessons: () =>
    apiFetch<{ lessons: AcademyLesson[] }>('/api/v1/academy/lessons'),

  completeAcademyLesson: (lessonId: string) =>
    apiFetch<{ success: boolean; completedLessons: string[]; updatedXp: number; level: number }>(
      '/api/v1/academy/complete-lesson',
      {
        method: 'POST',
        body: JSON.stringify({ lessonId }),
      }
    ),

  // Referral
  trackReferralClick: (code: string) =>
    apiFetch<{ success: boolean; code: string; clickCount: number }>('/api/v1/referrals/track-click', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  getReferralStats: () =>
    apiFetch<{
      referralCode: string;
      referralLink: string;
      clicks: number;
      totalOrders: number;
      deliveredOrders: number;
      conversionRate: string;
      totalEarned: number;
    }>('/api/v1/referrals/stats'),

  // AI
  chatResellAI: (body: { message: string; history?: any[]; language?: 'en' | 'bn' }) =>
    apiFetch<{ reply: string; source: 'gemini' | 'fallback' }>('/api/v1/ai/chat', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  generateSellingKit: (productId: string) =>
    apiFetch<{
      product: Product;
      kit: {
        facebookCaption: string;
        whatsappPitch: string;
        bulletBenefits: string[];
        objectionHandling: { objection: string; response: string }[];
        marketingAngles: string[];
      };
    }>('/api/v1/ai/selling-kit', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),

  // Admin
  getAdminStats: () =>
    apiFetch<{
      stats: {
        totalOrders: number;
        deliveredOrdersCount: number;
        totalRevenueBdt: number;
        totalResellerProfitBdt: number;
        totalPlatformMarginBdt: number;
        activeResellersCount: number;
        pendingResellerApprovals: number;
        pendingWithdrawalsCount: number;
        pendingWithdrawalsBdt: number;
        returnedOrdersCount: number;
        platformReturnRate: string;
      };
      settings: PlatformSettings;
      recentOrders: Order[];
      pendingWithdrawals: WithdrawalRequest[];
      pendingResellers: ResellerProfile[];
    }>('/api/v1/admin/stats'),

  updateResellerStatus: (id: string, status: string) =>
    apiFetch<{ reseller: ResellerProfile }>(`/api/v1/admin/resellers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  createProduct: (body: Partial<Product>) =>
    apiFetch<{ product: Product }>('/api/v1/admin/products', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  bulkCreateProducts: (body: { products: Array<Partial<Product>>; replaceAll?: boolean }) =>
    apiFetch<{ success: boolean; count: number; totalProducts: number; message: string }>('/api/v1/admin/products/bulk', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateProduct: (id: string, body: Partial<Product>) =>
    apiFetch<{ product: Product }>(`/api/v1/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  updateSettings: (body: Partial<PlatformSettings>) =>
    apiFetch<{ settings: PlatformSettings }>('/api/v1/admin/settings', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getAuditLogs: () =>
    apiFetch<{ logs: AuditLog[] }>('/api/v1/admin/audit-logs'),

  getFraudAlerts: () =>
    apiFetch<{ alerts: FraudAlert[] }>('/api/v1/admin/fraud-alerts'),

  submitResellerFee: (body: { method: string; senderPhone: string; trxId: string; amount?: number }) =>
    apiFetch<{ reseller: ResellerProfile; message: string }>('/api/v1/reseller/submit-fee', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  adminApproveResellerFree: (id: string) =>
    apiFetch<{ reseller: ResellerProfile; message: string }>(`/api/v1/admin/resellers/${id}/approve-free`, {
      method: 'POST',
    }),

  adminVerifyResellerPayment: (id: string, body: { approved: boolean; adminNote?: string }) =>
    apiFetch<{ reseller: ResellerProfile }>(`/api/v1/admin/resellers/${id}/verify-payment`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  adminCreateChallenge: (body: Partial<WeeklyChallenge>) =>
    apiFetch<{ challenge: WeeklyChallenge }>('/api/v1/admin/challenges', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  adminCreateAcademyLesson: (body: Partial<AcademyLesson>) =>
    apiFetch<{ lesson: AcademyLesson }>('/api/v1/admin/academy/lessons', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  resetSeedData: () =>
    apiFetch<{ success: boolean; message: string }>('/api/v1/seed/reset', {
      method: 'POST',
    }),
};
