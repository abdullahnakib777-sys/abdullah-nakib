import React, { useState, useEffect } from 'react';
import {
  Product,
  Order,
  ResellerProfile,
  AdminResellerItem,
  WithdrawalRequest,
  PlatformSettings,
  AuditLog,
  FraudAlert,
  WeeklyChallenge,
  AcademyLesson,
} from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../common/Badge';
import { triggerLevelUpCelebration } from '../common/ConfettiTrigger';
import { BulkProductUploaderModal } from './BulkProductUploaderModal';
import { AdminNotificationsManager } from './AdminNotificationsManager';
import { AdminBadgesManager } from './AdminBadgesManager';
import {
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Users,
  Wallet,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Truck,
  DollarSign,
  Package,
  Layers,
  Settings,
  RefreshCw,
  X,
  FileText,
  Search,
  Sparkles,
  Trophy,
  Video,
  Play,
  ExternalLink,
  Clock,
  Award,
  Upload,
  FileSpreadsheet,
  Zap,
  Star,
  Check,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Tag,
  Lock,
  KeyRound,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'resellers' | 'products' | 'notifications' | 'badges' | 'challenges' | 'academy' | 'withdrawals' | 'fraud' | 'settings'
  >('overview');

  const [statsData, setStatsData] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [resellers, setResellers] = useState<ResellerProfile[]>([]);
  const [allResellers, setAllResellers] = useState<AdminResellerItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([]);
  const [academyLessons, setAcademyLessons] = useState<AcademyLesson[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Reseller Table Filtering & Search
  const [resellerFilter, setResellerFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'HIGH_XP'>('ALL');
  const [resellerSearchQuery, setResellerSearchQuery] = useState('');
  const [selectedResellerForOrders, setSelectedResellerForOrders] = useState<AdminResellerItem | null>(null);
  const [resellerOrdersStatusFilter, setResellerOrdersStatusFilter] = useState<string>('ALL');

  // Manual Award XP Modal
  const [isAwardXpModalOpen, setIsAwardXpModalOpen] = useState(false);
  const [selectedResellerForXp, setSelectedResellerForXp] = useState<AdminResellerItem | null>(null);
  const [awardXpAmount, setAwardXpAmount] = useState<number>(100);
  const [awardXpReason, setAwardXpReason] = useState<string>('Completed Facebook & TikTok Viral Video Lesson');
  const [customXpReason, setCustomXpReason] = useState<string>('');
  const [isSubmittingXp, setIsSubmittingXp] = useState(false);
  const [awardSuccessBanner, setAwardSuccessBanner] = useState<string | null>(null);

  // Modals / Actions
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<string>('CONFIRMED');
  const [statusNote, setStatusNote] = useState('');

  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [payoutTrxId, setPayoutTrxId] = useState('');

  // Add Product Modal
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isBulkUploaderOpen, setIsBulkUploaderOpen] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState<'ALL' | 'IN_STOCK' | 'STOCK_OUT'>('ALL');

  // Edit / Delete Product Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    nameBn: '',
    productCode: 'MM-1001',
    category: 'Electronics & Gadgets',
    categorySlug: 'gadgets',
    baseCost: 500,
    resellerPrice: 700,
    suggestedSellingPrice: 1100,
    stock: 100,
    isStockOut: false,
    estimatedRestockDays: 3,
    estimatedRestockDate: '',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    description: 'High demand e-commerce product for Bangladesh online stores and resellers.',
    features: ['100% Original factory QC verified', 'Fast nationwide shipping'],
    specifications: { Warranty: '7 Days Replacement Warranty' },
    isTrending: true,
    isBestSeller: false,
    returnRatePercent: 2.5,
  });

  // Add Challenge Modal
  const [isAddChallengeModalOpen, setIsAddChallengeModalOpen] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState<WeeklyChallenge | null>(null);
  const [isDeleteChallengeModalOpen, setIsDeleteChallengeModalOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState<Partial<WeeklyChallenge>>({
    title: 'Daily Super Seller',
    description: 'Deliver 3 orders today to earn instant XP boost and cash bonus!',
    frequency: 'DAILY',
    metric: 'DELIVERIES',
    targetCount: 3,
    rewardXp: 500,
    rewardBonusBdt: 200,
  });

  // Add Academy Video Modal
  const [isAddAcademyModalOpen, setIsAddAcademyModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<AcademyLesson | null>(null);
  const [isDeleteLessonModalOpen, setIsDeleteLessonModalOpen] = useState(false);
  const [newLesson, setNewLesson] = useState<Partial<AcademyLesson>>({
    title: 'TikTok & Facebook Viral Video Selling Blueprint',
    titleBn: 'টিকটক ও ফেসবুক ভিডিও দিয়ে প্রতিদিন ১০+ অর্ডার পাওয়ার উপায়',
    courseId: 'crs-social',
    courseTitle: 'Viral Video Sales Mastery',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationMinutes: 8,
    xpReward: 250,
    description: 'Master practical zero-ad-cost strategies to get consistent daily COD orders.',
    keyTakeaways: [
      'Record 15-second high-engagement product problem/solution videos',
      'Use catchy Bengali hook in the first 3 seconds',
      'Direct interested buyers to WhatsApp for instant order confirmation',
    ],
    actionSteps: [
      'Pick 1 trending gadget from the wholesale catalog',
      'Publish 2 short reels per day using trending audio',
    ],
  });

  // Admin Password & Security Settings
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [showAdminPassFields, setShowAdminPassFields] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passChangeSuccess, setPassChangeSuccess] = useState<string | null>(null);
  const [passChangeError, setPassChangeError] = useState<string | null>(null);

  const handleAdminPasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeError(null);
    setPassChangeSuccess(null);

    if (!newAdminPass || newAdminPass.trim().length < 4) {
      setPassChangeError('New password must be at least 4 characters long.');
      return;
    }

    if (newAdminPass !== confirmAdminPass) {
      setPassChangeError('New password and confirmation do not match.');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await api.adminChangePassword({
        currentPassword: currentAdminPass.trim() || undefined,
        newPassword: newAdminPass.trim(),
        newEmail: newAdminEmail.trim() || undefined,
      });

      setPassChangeSuccess(res.message || 'Admin credentials updated and securely saved in Cloud Firestore!');
      setCurrentAdminPass('');
      setNewAdminPass('');
      setConfirmAdminPass('');
      triggerLevelUpCelebration();
      loadAllAdminData();
    } catch (err: any) {
      setPassChangeError(err.message || 'Failed to update admin credentials. Please verify your current password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  const loadAllAdminData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const results = await Promise.allSettled([
        api.getAdminStats(),
        api.getAdminResellers(),
        api.getOrders(),
        api.getProducts(),
        api.getGamification(),
        api.getAcademyLessons(),
        api.getAuditLogs(),
        api.getFraudAlerts(),
      ]);

      const [stRes, rslRes, ordRes, prRes, gamRes, acaRes, logsRes, alertsRes] = results;

      if (stRes.status === 'fulfilled') {
        setStatsData(stRes.value);
        setResellers(stRes.value?.pendingResellers || []);
        setWithdrawals(stRes.value?.pendingWithdrawals || []);
      }
      if (rslRes.status === 'fulfilled') {
        setAllResellers(rslRes.value?.resellers || []);
      }
      if (ordRes.status === 'fulfilled') {
        setOrders(ordRes.value?.orders || []);
      }
      if (prRes.status === 'fulfilled') {
        setProducts(prRes.value?.products || []);
      }
      if (gamRes.status === 'fulfilled') {
        setChallenges(gamRes.value?.weeklyChallenges || []);
      }
      if (acaRes.status === 'fulfilled') {
        setAcademyLessons(acaRes.value?.lessons || []);
      }
      if (logsRes.status === 'fulfilled') {
        setAuditLogs(logsRes.value?.logs || []);
      }
      if (alertsRes.status === 'fulfilled') {
        setFraudAlerts(alertsRes.value?.alerts || []);
      }

      const allFailed = results.every((r) => r.status === 'rejected');
      if (allFailed) {
        const firstErr = (results[0] as PromiseRejectedResult)?.reason?.message || 'Failed to connect to backend';
        setLoadError(firstErr);
      }
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      setLoadError(err?.message || 'Network connection issue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      await api.updateOrderStatus(selectedOrder.id, newOrderStatus, statusNote);
      if (newOrderStatus === 'DELIVERED') {
        triggerLevelUpCelebration();
      }
      setSelectedOrder(null);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleResellerApproveFree = async (resellerId: string) => {
    try {
      await api.adminApproveResellerFree(resellerId);
      triggerLevelUpCelebration();
      alert('Reseller approved and verified for free!');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to approve reseller');
    }
  };

  const handleResellerVerifyPayment = async (resellerId: string, approved: boolean) => {
    try {
      await api.adminVerifyResellerPayment(resellerId, {
        approved,
        adminNote: approved ? '500 TK payment verified by Admin' : 'Payment verification rejected',
      });
      if (approved) triggerLevelUpCelebration();
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to verify payment');
    }
  };

  const handleOpenAwardXpModal = (reseller: AdminResellerItem) => {
    setSelectedResellerForXp(reseller);
    setAwardXpAmount(100);
    setAwardXpReason('Completed Facebook & TikTok Viral Video Lesson');
    setCustomXpReason('');
    setIsAwardXpModalOpen(true);
  };

  const handleAwardXpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResellerForXp) return;
    setIsSubmittingXp(true);
    try {
      const finalReason = awardXpReason === 'CUSTOM' ? (customXpReason || 'Custom Admin XP Award') : awardXpReason;
      const res = await api.awardResellerXp(selectedResellerForXp.id, {
        amount: Number(awardXpAmount),
        reason: finalReason,
      });

      triggerLevelUpCelebration();
      setAwardSuccessBanner(res.message);
      setIsAwardXpModalOpen(false);
      setSelectedResellerForXp(null);
      await loadAllAdminData();
      setTimeout(() => {
        setAwardSuccessBanner(null);
      }, 6000);
    } catch (err: any) {
      alert(err.message || 'Failed to award XP');
    } finally {
      setIsSubmittingXp(false);
    }
  };

  const handleWithdrawalPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWithdrawal) return;
    try {
      await api.updateWithdrawal(selectedWithdrawal.id, {
        status: 'PAID',
        transactionId: payoutTrxId || `TRX-${Date.now().toString().slice(-6)}`,
        adminNote: `Settled via ${selectedWithdrawal.method}`,
      });
      setSelectedWithdrawal(null);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to disburse payout');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProduct(newProduct);
      setIsAddProductModalOpen(false);
      alert('Product created and published successfully!');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    }
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditProductModalOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await api.updateProduct(editingProduct.id, editingProduct);
      setIsEditProductModalOpen(false);
      setEditingProduct(null);
      alert('Product details, stock status, and restock estimations updated!');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update product');
    }
  };

  const handleOpenDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteProductModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await api.deleteProduct(productToDelete.id);
      setIsDeleteProductModalOpen(false);
      setProductToDelete(null);
      alert('Product deleted successfully from catalog!');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.adminCreateChallenge(newChallenge);
      setIsAddChallengeModalOpen(false);
      triggerLevelUpCelebration();
      alert('Challenge published! Resellers can now complete it to earn XP.');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to create challenge');
    }
  };

  const handleOpenDeleteChallenge = (challenge: WeeklyChallenge) => {
    setChallengeToDelete(challenge);
    setIsDeleteChallengeModalOpen(true);
  };

  const handleDeleteChallenge = async () => {
    if (!challengeToDelete) return;
    try {
      await api.adminDeleteChallenge(challengeToDelete.id);
      setIsDeleteChallengeModalOpen(false);
      setChallengeToDelete(null);
      alert('Challenge deleted successfully!');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete challenge');
    }
  };

  const handleCreateAcademyLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.adminCreateAcademyLesson(newLesson);
      setIsAddAcademyModalOpen(false);
      triggerLevelUpCelebration();
      alert('Academy video lesson added! Resellers can watch and earn XP.');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to add video lesson');
    }
  };

  const handleOpenDeleteAcademyLesson = (lesson: AcademyLesson) => {
    setLessonToDelete(lesson);
    setIsDeleteLessonModalOpen(true);
  };

  const handleDeleteAcademyLesson = async () => {
    if (!lessonToDelete) return;
    try {
      await api.adminDeleteAcademyLesson(lessonToDelete.id);
      setIsDeleteLessonModalOpen(false);
      setLessonToDelete(null);
      alert('Academy lesson deleted successfully!');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete academy lesson');
    }
  };

  const s = statsData?.stats;

  return (
    <div className="space-y-6" id="admin-dashboard">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs uppercase tracking-wider font-bold text-slate-300">
              Master Admin Control Plane (Protected)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Platform Operations Dashboard</h1>
          <p className="text-xs text-slate-300">
            Wholesale & Retail Products, Reseller 500 TK Verification, Daily/Weekly/Monthly Challenges & Academy Videos.
          </p>
        </div>

        <button
          onClick={loadAllAdminData}
          className="self-start md:self-auto px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Error Notice */}
      {loadError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-amber-900 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <p>
              <strong className="font-bold">Sync Notice:</strong> {loadError}. Cached demo records active.
            </p>
          </div>
          <button
            onClick={loadAllAdminData}
            className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 font-bold rounded-lg transition"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* Admin Tab Switcher */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex gap-1 overflow-x-auto no-scrollbar text-xs font-bold">
        {[
          { id: 'overview', label: '📊 Analytics' },
          { id: 'orders', label: `📦 Orders (${orders.length})` },
          { id: 'resellers', label: `👥 Resellers & XP (${allResellers.length > 0 ? allResellers.length : resellers.length})` },
          { id: 'products', label: `🏷️ Products (${products.length})` },
          { id: 'notifications', label: '📢 Notifications & Posters' },
          { id: 'badges', label: '⭐ Badges & Accolades' },
          { id: 'challenges', label: `🏆 Challenges & XP (${challenges.length})` },
          { id: 'academy', label: `📺 Academy Videos (${academyLessons.length})` },
          { id: 'withdrawals', label: `💰 Withdrawals (${withdrawals.length})` },
          { id: 'fraud', label: `🛡️ Anti-Fraud (${fraudAlerts.length})` },
          { id: 'settings', label: '⚙️ Settings & Logs' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && s && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Total Platform Sales</span>
              <p className="text-2xl font-black text-slate-900">৳{(s?.totalRevenueBdt ?? 0).toLocaleString()}</p>
              <p className="text-[11px] text-emerald-600 font-bold">{s?.deliveredOrdersCount ?? 0} delivered orders</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Reseller Profit Paid</span>
              <p className="text-2xl font-black text-emerald-700">৳{(s?.totalResellerProfitBdt ?? 0).toLocaleString()}</p>
              <p className="text-[11px] text-slate-400">Direct wallet disbursements</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Platform Margin</span>
              <p className="text-2xl font-black text-indigo-700">৳{(s?.totalPlatformMarginBdt ?? 0).toLocaleString()}</p>
              <p className="text-[11px] text-indigo-600 font-bold">Wholesale margin</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Return Rate (RTO)</span>
              <p className="text-2xl font-black text-rose-600">{s?.platformReturnRate ?? 0}%</p>
              <p className="text-[11px] text-slate-400">{s?.returnedOrdersCount ?? 0} returned packages</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-3xl flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-sm text-emerald-950">Add Wholesale / Retail Product</h4>
                <p className="text-xs text-emerald-800">Add new products with wholesale buy price and suggested retail price.</p>
              </div>
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 self-start"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-sm text-amber-950">Create Daily / Weekly Challenge</h4>
                <p className="text-xs text-amber-800">Reward active resellers with custom XP and bonus cash.</p>
              </div>
              <button
                onClick={() => setIsAddChallengeModalOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 self-start"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Create Challenge</span>
              </button>
            </div>

            <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-3xl flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-sm text-indigo-950">Add Academy Video (YouTube)</h4>
                <p className="text-xs text-indigo-800">Add YouTube masterclasses with actionable takeaways and XP rewards.</p>
              </div>
              <button
                onClick={() => setIsAddAcademyModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 self-start"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Add Video Lesson</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs animate-in fade-in duration-150">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">All Nationwide Customer Orders</h3>
              <p className="text-xs text-slate-400">Change statuses: Confirmed ➔ Packaging ➔ Shipping ➔ Delivered (Releases Profit)</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer & Location</th>
                  <th className="p-4">Reseller Store</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Reseller Profit</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono">
                      <p className="font-bold text-slate-900">#{order.orderNumber}</p>
                      <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{order.customerName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</p>
                      <p className="text-[11px] text-slate-400">{order.district}, {order.division}</p>
                    </td>
                    <td className="p-4 text-slate-600">
                      {order.resellerId ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
                          {order.resellerId}
                        </span>
                      ) : (
                        <span className="text-slate-400">Direct Retail</span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      ৳{order.total}
                    </td>
                    <td className="p-4 font-bold text-emerald-700">
                      +৳{order.totalResellerProfit}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewOrderStatus(order.status);
                          setStatusNote('');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition"
                      >
                        Change Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RESELLERS DIRECTORY & MANUAL XP MANAGEMENT */}
      {activeTab === 'resellers' && (() => {
        // Derive list from allResellers or fallback to resellers
        const rawList: AdminResellerItem[] = allResellers.length > 0
          ? allResellers
          : (resellers as any[]).map((r) => ({
              id: r.id,
              userId: r.userId,
              storeName: r.storeName || 'Online Mart',
              ownerName: r.userId,
              email: r.userId.includes('@') ? r.userId : '',
              whatsappNumber: r.whatsappNumber || '',
              division: r.division || 'Dhaka',
              district: r.district || 'Dhaka',
              address: r.address || '',
              salesIntent: r.salesIntent || 'Social Media',
              status: r.status,
              verificationFeePaid: r.verificationFeePaid || false,
              adminApprovedFree: r.adminApprovedFree || false,
              verificationPayment: r.verificationPayment,
              balanceBdt: r.balanceBdt || 0,
              totalProfitEarnedBdt: r.totalProfitEarnedBdt || 0,
              level: r.level || 1,
              levelName: r.levelName || 'Novice Reseller',
              xp: r.xp || 0,
              xpToNextLevel: r.xpToNextLevel || 500,
              levelProgressPercent: r.levelProgressPercent || 0,
              deliveredOrdersCount: 0,
              completedLessonsCount: 0,
              referralCode: r.referralCode || 'REF',
              createdAt: r.createdAt || new Date().toISOString(),
            }));

        const filteredList = rawList.filter((r) => {
          // Search query matching
          const q = resellerSearchQuery.toLowerCase().trim();
          const matchesQuery =
            !q ||
            r.storeName?.toLowerCase().includes(q) ||
            r.ownerName?.toLowerCase().includes(q) ||
            r.whatsappNumber?.includes(q) ||
            r.email?.toLowerCase().includes(q) ||
            r.district?.toLowerCase().includes(q) ||
            r.referralCode?.toLowerCase().includes(q);

          if (!matchesQuery) return false;

          if (resellerFilter === 'ACTIVE') {
            return r.status === 'ACTIVE' || r.verificationFeePaid || r.adminApprovedFree;
          }
          if (resellerFilter === 'PENDING') {
            return r.status === 'PENDING' && !r.adminApprovedFree && !r.verificationFeePaid;
          }
          if (resellerFilter === 'HIGH_XP') {
            return (r.level || 1) >= 2 || (r.xp || 0) >= 500;
          }
          return true;
        });

        const activeCount = rawList.filter((r) => r.status === 'ACTIVE' || r.verificationFeePaid || r.adminApprovedFree).length;
        const pendingCount = rawList.filter((r) => r.status === 'PENDING' && !r.adminApprovedFree && !r.verificationFeePaid).length;
        const totalXpInSystem = rawList.reduce((sum, r) => sum + (r.xp || 0), 0);

        return (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Success Toast Notification */}
            {awardSuccessBanner && (
              <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-lg flex items-center justify-between animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <p className="font-black text-sm">Gamification XP Awarded!</p>
                    <p className="text-xs text-emerald-100">{awardSuccessBanner}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAwardSuccessBanner(null)}
                  className="p-1.5 hover:bg-white/20 rounded-lg text-white text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Reseller Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400 font-semibold">Total Resellers</span>
                  <Users className="w-4 h-4 text-indigo-500" />
                </div>
                <p className="text-2xl font-black text-slate-900">{rawList.length}</p>
                <p className="text-[11px] text-slate-500">Registered entrepreneurs</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400 font-semibold">Active & Verified</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
                <p className="text-[11px] text-emerald-700 font-medium">Selling in marketplace</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400 font-semibold">Pending 500৳ Fee</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-2xl font-black text-amber-600">{pendingCount}</p>
                <p className="text-[11px] text-amber-700 font-medium">Awaiting approval / fee</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400 font-semibold">Total Ecosystem XP</span>
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-2xl font-black text-amber-500">{totalXpInSystem.toLocaleString()} XP</p>
                <p className="text-[11px] text-slate-500">Earned via sales & lessons</p>
              </div>
            </div>

            {/* Explainer Banner */}
            <div className="p-5 bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-indigo-500/10 border border-amber-300/80 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-black text-sm text-slate-950 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Reseller Management & Manual XP Distribution</span>
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  As Admin, you can <strong>manually grant XP</strong> to resellers whenever they complete offline lessons, finish video masterclasses, or achieve weekly challenges. You can also verify their 500৳ payment or freely approve them with a 0-fee pass.
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/30 border border-amber-500/40 text-amber-950 font-black text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  Manual XP Level Engine
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by store, owner, phone, district or referral code..."
                  value={resellerSearchQuery}
                  onChange={(e) => setResellerSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { key: 'ALL', label: `All Stores (${rawList.length})` },
                  { key: 'ACTIVE', label: `Active (${activeCount})` },
                  { key: 'PENDING', label: `Pending Fee (${pendingCount})` },
                  { key: 'HIGH_XP', label: '⭐ Level 2+ Top Sellers' },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setResellerFilter(f.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      resellerFilter === f.key
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reseller Directory Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Store & Reseller</th>
                      <th className="p-4">Contact / Location</th>
                      <th className="p-4">Rank & Level</th>
                      <th className="p-4 text-center">Orders Made</th>
                      <th className="p-4 text-right">Money Made (Sales)</th>
                      <th className="p-4 text-right">Money Profited</th>
                      <th className="p-4 text-center">500 TK Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredList.map((r) => {
                      const totalOrders = r.totalOrdersCount || r.deliveredOrdersCount || 0;
                      const deliveredOrders = r.deliveredOrdersCount || totalOrders;
                      const moneyMade = r.totalSalesBdt || r.moneyMadeBdt || Math.round((r.totalProfitEarned || 0) * 3.8);
                      const moneyProfited = r.totalProfitEarned || r.totalProfitEarnedBdt || r.moneyProfitedBdt || 0;
                      const isGoat = r.level === 4 || (r.xp >= 2001 && r.xp <= 5000);

                      return (
                        <tr key={r.id} className="hover:bg-slate-50/80 transition">
                          {/* Store & Owner */}
                          <td className="p-4">
                            <div className="flex items-start gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                                {r.storeName?.charAt(0) || 'R'}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{r.storeName}</span>
                                  {r.adminApprovedFree && (
                                    <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                                      Free Pass
                                    </span>
                                  )}
                                </p>
                                <p className="text-[11px] text-slate-600 font-medium">{r.ownerName || r.userId}</p>
                                {r.email && <p className="text-[10px] text-slate-400 font-mono">{r.email}</p>}
                                <p className="text-[10px] text-indigo-600 font-mono mt-0.5">Code: {r.referralCode}</p>
                              </div>
                            </div>
                          </td>

                          {/* Phone & Location */}
                          <td className="p-4">
                            <p className="font-mono font-bold text-slate-800">{r.whatsappNumber || 'N/A'}</p>
                            <p className="text-[11px] text-slate-500">{r.district}, {r.division}</p>
                            {r.address && <p className="text-[10px] text-slate-400 line-clamp-1 max-w-[150px]">{r.address}</p>}
                          </td>

                          {/* Level & Rank with GOAT Picture support */}
                          <td className="p-4">
                            <div className="space-y-1.5 min-w-[150px]">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border ${
                                  r.level >= 7
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : r.level >= 4
                                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                                    : r.level >= 3
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : 'bg-slate-100 text-slate-800 border-slate-300'
                                }`}>
                                  {isGoat ? (
                                    <img
                                      src="https://images.unsplash.com/photo-1524024973431-2ad916746881?w=80&q=80"
                                      alt="The GOAT"
                                      className="w-3.5 h-3.5 rounded-full object-cover inline-block"
                                    />
                                  ) : (
                                    <Zap className="w-3 h-3 fill-amber-500 text-amber-600" />
                                  )}
                                  <span>Lvl {r.level || 1} • {r.levelName || 'Rookie 🐣'}</span>
                                </span>
                                <span className="font-extrabold text-amber-600 font-mono text-[11px]">
                                  {(r.xp || 0).toLocaleString()} XP
                                </span>
                              </div>

                              {/* Progress bar towards next level */}
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 rounded-full"
                                  style={{ width: `${Math.min(100, Math.max(5, r.levelProgressPercent || 0))}%` }}
                                />
                              </div>
                              <p className="text-[9px] text-slate-400 text-right font-medium">
                                {r.xpToNextLevel || 300} XP to next rank
                              </p>
                            </div>
                          </td>

                          {/* Orders Made */}
                          <td className="p-4 text-center">
                            <button
                              type="button"
                              onClick={() => setSelectedResellerForOrders(r)}
                              className="group inline-flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition cursor-pointer"
                              title="Click to view full order history for this reseller"
                            >
                              <div className="flex items-center gap-1 font-black text-slate-900 group-hover:text-indigo-600 text-xs font-mono">
                                <Package className="w-3.5 h-3.5 text-indigo-500" />
                                <span>{totalOrders.toLocaleString()} Orders</span>
                              </div>
                              <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                                {deliveredOrders} Delivered
                              </span>
                              <span className="text-[9px] text-indigo-600 font-bold underline mt-0.5">
                                View Details ➔
                              </span>
                            </button>
                          </td>

                          {/* Money Made (Sales) */}
                          <td className="p-4 text-right">
                            <div className="space-y-0.5">
                              <p className="font-mono font-black text-slate-900 text-xs">
                                ৳{moneyMade.toLocaleString()}
                              </p>
                              <span className="text-[10px] text-slate-500 font-medium">
                                Gross Sales
                              </span>
                            </div>
                          </td>

                          {/* Money Profited */}
                          <td className="p-4 text-right">
                            <div className="space-y-0.5">
                              <p className="font-mono font-black text-emerald-600 text-xs">
                                +৳{moneyProfited.toLocaleString()}
                              </p>
                              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                                Net Reseller Profit
                              </span>
                            </div>
                          </td>

                          {/* 500 TK Verification */}
                          <td className="p-4 text-center">
                            {r.adminApprovedFree ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Free Pass</span>
                              </span>
                            ) : r.verificationFeePaid || r.verificationPayment ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>৳500 Paid</span>
                                </span>
                                {r.verificationPayment?.trxId && (
                                  <p className="text-[9px] font-mono text-slate-500 mt-1">
                                    Trx: <strong>{r.verificationPayment.trxId}</strong>
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>500৳ Pending</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right space-y-1 sm:space-y-0 sm:space-x-1.5 whitespace-nowrap">
                            {/* View Orders Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedResellerForOrders(r)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-[11px] transition inline-flex items-center gap-1"
                              title="View all customer orders and profit breakdown"
                            >
                              <Package className="w-3 h-3 text-slate-600" />
                              <span>Orders</span>
                            </button>

                            {/* Award XP Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenAwardXpModal(r)}
                              className="px-3 py-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-xl shadow-xs transition inline-flex items-center gap-1 text-[11px]"
                              title="Manually award XP to this reseller"
                            >
                              <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                              <span>Award XP</span>
                            </button>

                            {/* Approval Actions */}
                            <button
                              type="button"
                              onClick={() => handleResellerApproveFree(r.id)}
                              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-[11px] transition inline-block"
                              title="Allow freely without 500 TK payment"
                            >
                              Free Pass
                            </button>

                            <button
                              type="button"
                              onClick={() => handleResellerVerifyPayment(r.id, true)}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-[11px] transition inline-block"
                              title="Approve 500 TK Verification"
                            >
                              Verify 500৳
                            </button>

                            <button
                              type="button"
                              onClick={() => handleResellerVerifyPayment(r.id, false)}
                              className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-semibold text-[11px] transition inline-block"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredList.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-slate-400">
                          <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                          <p className="font-bold text-slate-600">No resellers match your filter criteria.</p>
                          <p className="text-xs text-slate-400 mt-1">Try changing the search query or tab filter.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 4: PRODUCTS MANAGER */}
      {activeTab === 'products' && (() => {
        const filteredProducts = products.filter((p) => {
          // Search filter
          const q = productSearchQuery.toLowerCase().trim();
          const matchesQuery =
            !q ||
            p.name.toLowerCase().includes(q) ||
            (p.nameBn && p.nameBn.toLowerCase().includes(q)) ||
            (p.productCode && p.productCode.toLowerCase().includes(q)) ||
            p.category.toLowerCase().includes(q);

          if (!matchesQuery) return false;

          // Category filter
          if (productCategoryFilter !== 'all' && p.categorySlug !== productCategoryFilter && p.category !== productCategoryFilter) {
            return false;
          }

          // Stock filter
          if (productStockFilter === 'IN_STOCK') {
            return !p.isStockOut && (p.stock > 0);
          }
          if (productStockFilter === 'STOCK_OUT') {
            return p.isStockOut || p.stock <= 0;
          }

          return true;
        });

        const inStockCount = products.filter((p) => !p.isStockOut && p.stock > 0).length;
        const stockOutCount = products.filter((p) => p.isStockOut || p.stock <= 0).length;

        return (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">Wholesale & Normal E-Commerce Catalog</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[11px]">
                    {products.length} Products
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Manage product codes, wholesale & retail prices, stock availability, and restock estimations
                </p>
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsBulkUploaderOpen(true)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Bulk CSV Upload</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by code (#MM-1001), name or category..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Category Dropdown */}
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Categories</option>
                  <option value="gadgets">Electronics & Gadgets</option>
                  <option value="kitchen">Smart Kitchen & Living</option>
                  <option value="fashion">Fashion & Lifestyle</option>
                  <option value="beauty">Health, Beauty & Care</option>
                  <option value="baby">Kids & Baby</option>
                </select>

                {/* Stock Status Buttons */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setProductStockFilter('ALL')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      productStockFilter === 'ALL'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({products.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductStockFilter('IN_STOCK')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      productStockFilter === 'IN_STOCK'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    In Stock ({inStockCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductStockFilter('STOCK_OUT')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      productStockFilter === 'STOCK_OUT'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    Stock Out ({stockOutCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Code</th>
                      <th className="p-4">Product Info</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Factory Cost</th>
                      <th className="p-4">Wholesale</th>
                      <th className="p-4">Customer Catalog</th>
                      <th className="p-4">Margin</th>
                      <th className="p-4">Stock Status & Restock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => {
                      const isOutOfStock = p.isStockOut || p.stock <= 0;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition">
                          {/* Product Code */}
                          <td className="p-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                            <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[11px] text-slate-800">
                              {p.productCode || `#MM-${p.id.slice(-4).toUpperCase()}`}
                            </span>
                          </td>

                          {/* Product Info */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0]}
                                alt=""
                                className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
                                }}
                              />
                              <div className="max-w-xs">
                                <p className="font-bold text-slate-900 truncate">{p.name}</p>
                                <p className="text-[11px] text-slate-400 truncate">{p.nameBn || p.description}</p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="p-4 text-slate-600 whitespace-nowrap">{p.category}</td>

                          {/* Factory Cost */}
                          <td className="p-4 text-slate-500 font-medium">৳{p.baseCost}</td>

                          {/* Reseller Wholesale */}
                          <td className="p-4 font-bold text-indigo-700 font-mono">৳{p.resellerPrice}</td>

                          {/* Customer Catalog */}
                          <td className="p-4">
                            <div className="font-bold text-slate-900 font-mono">৳{p.suggestedSellingPrice}</div>
                            {p.oldPrice && p.oldPrice > p.suggestedSellingPrice && (
                              <div className="text-[10px] text-slate-400 line-through">৳{p.oldPrice}</div>
                            )}
                          </td>

                          {/* Margin */}
                          <td className="p-4 font-bold text-emerald-700 font-mono">
                            +৳{p.suggestedSellingPrice - p.resellerPrice}
                          </td>

                          {/* Stock Status & Restock Estimation */}
                          <td className="p-4">
                            {isOutOfStock ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-200">
                                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                                  <span>Stock Out (0 pcs)</span>
                                </span>
                                <div className="text-[10px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                                  Restock: in <strong>{p.estimatedRestockDays || 3} days</strong>
                                  {p.estimatedRestockDate && (
                                    <span className="block text-[9px] text-slate-500 font-mono">
                                      Date: {p.estimatedRestockDate}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>In Stock ({p.stock} pcs)</span>
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition flex items-center gap-1 text-xs font-bold"
                                title="Edit Product & Stock"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenDeleteProduct(p)}
                                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition flex items-center gap-1 text-xs font-bold"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={9} className="p-12 text-center text-slate-400">
                          <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                          <p className="font-bold text-slate-600">No products match your search or filter.</p>
                          <p className="text-xs text-slate-400 mt-1">Try resetting the category or stock filter.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 4.5: NOTIFICATIONS & MARKETING POSTERS */}
      {activeTab === 'notifications' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <AdminNotificationsManager />
        </div>
      )}

      {/* TAB 4.8: BADGES & ACCOLADES MANAGER */}
      {activeTab === 'badges' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <AdminBadgesManager />
        </div>
      )}

      {/* TAB 5: CHALLENGES & XP REWARDS */}
      {activeTab === 'challenges' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Reseller Gamification Challenges</h3>
              <p className="text-xs text-slate-400">Create Daily, Weekly, and Monthly sales challenges with XP and cash bonuses</p>
            </div>

            <button
              onClick={() => setIsAddChallengeModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Challenge</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      c.frequency === 'DAILY'
                        ? 'bg-amber-100 text-amber-800'
                        : c.frequency === 'MONTHLY'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {c.frequency || 'WEEKLY'} CHALLENGE
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> +{c.rewardXp} XP
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenDeleteChallenge(c)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Delete Challenge"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.description}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Metric:</span>
                    <span className="font-bold text-slate-800">{c.targetCount} {c.metric}</span>
                  </div>
                  {c.rewardBonusBdt > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cash Bonus:</span>
                      <span className="font-bold text-emerald-700">৳{c.rewardBonusBdt} BDT</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ACADEMY VIDEOS (YOUTUBE) */}
      {activeTab === 'academy' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Reseller Academy YouTube Courses</h3>
              <p className="text-xs text-slate-400">Add YouTube masterclasses with embedded video player and XP completion</p>
            </div>

            <button
              onClick={() => setIsAddAcademyModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add YouTube Lesson</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {academyLessons.map((l) => (
              <div key={l.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {l.courseTitle}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> +{l.xpReward} XP
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenDeleteAcademyLesson(l)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Delete Academy Lesson"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">{l.title}</h4>
                  <p className="text-xs text-slate-500">{l.titleBn}</p>

                  {/* YouTube Preview */}
                  {(l.videoEmbedId || l.youtubeUrl) && (
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 mt-2 border border-slate-200">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${l.videoEmbedId || 'dQw4w9WgXcQ'}`}
                        title={l.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  <p className="text-xs text-slate-600 pt-1 line-clamp-2">{l.description || l.contentMarkdown}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {l.durationMinutes} mins
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600">Active in Academy</span>
                    <button
                      type="button"
                      onClick={() => handleOpenDeleteAcademyLesson(l)}
                      className="text-rose-600 hover:text-rose-800 text-[11px] font-bold underline flex items-center gap-0.5"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: WITHDRAWALS */}
      {activeTab === 'withdrawals' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs animate-in fade-in duration-150">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Pending Reseller Profit Withdrawals</h3>
            <p className="text-xs text-slate-400">Settle bKash, Nagad or Bank disbursements</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method & Account</th>
                  <th className="p-4">Reseller</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50">
                    <td className="p-4 text-slate-500 font-mono">{new Date(w.requestedAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-emerald-700 text-sm">৳{w.amount}</td>
                    <td className="p-4 font-mono">
                      <span className="font-bold">{w.method}:</span> {w.accountNumber}
                    </td>
                    <td className="p-4 text-slate-600">{w.resellerId}</td>
                    <td className="p-4"><StatusBadge status={w.status} /></td>
                    <td className="p-4 text-right">
                      {w.status === 'PENDING' && (
                        <button
                          onClick={() => setSelectedWithdrawal(w)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition"
                        >
                          Disburse
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {withdrawals.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No pending withdrawal payout requests.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: FRAUD & RISK */}
      {activeTab === 'fraud' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900">AI Risk & Anti-Fraud Sentry</h3>
            <p className="text-xs text-slate-400">Automatic monitoring of courier RTO anomalies and fake orders</p>
          </div>

          <div className="grid gap-3">
            {fraudAlerts.map((al) => (
              <div
                key={al.id}
                className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start justify-between"
              >
                <div className="flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-rose-950">{al.type}</h4>
                    <p className="text-xs text-rose-800">{al.message}</p>
                    <p className="text-[10px] text-rose-600 mt-1 font-mono">{al.createdAt ? new Date(al.createdAt).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900">
                  {al.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: SETTINGS & LOGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Security & Master Admin Password */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>Master Admin Security & Password</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Cloud Synced
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Change your admin credentials anytime. Changes automatically sync to Firebase Firestore and are protected from public exposure.
                  </p>
                </div>
              </div>

              <div className="text-xs">
                <span className="text-slate-500 font-medium">Active Admin Email: </span>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                  {statsData?.settings?.adminEmail || 'abdullahnakib777@gmail.com'}
                </span>
              </div>
            </div>

            {passChangeSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passChangeSuccess}</span>
              </div>
            )}

            {passChangeError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passChangeError}</span>
              </div>
            )}

            <form onSubmit={handleAdminPasswordChangeSubmit} className="space-y-4 max-w-2xl">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Update Admin Email / Login ID <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder={statsData?.settings?.adminEmail || 'abdullahnakib777@gmail.com'}
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs font-medium bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Current Password <span className="text-slate-400 font-normal">(For verification)</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showAdminPassFields ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={currentAdminPass}
                      onChange={(e) => setCurrentAdminPass(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs font-medium bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassFields(!showAdminPassFields)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      {showAdminPassFields ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    New Admin Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3" />
                    <input
                      type={showAdminPassFields ? 'text' : 'password'}
                      required
                      placeholder="Enter new strong password"
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs font-medium bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3" />
                    <input
                      type={showAdminPassFields ? 'text' : 'password'}
                      required
                      placeholder="Confirm new password"
                      value={confirmAdminPass}
                      onChange={(e) => setConfirmAdminPass(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs font-medium bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2"
                >
                  {isChangingPass ? (
                    <span>Saving to Firebase...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Update & Save Admin Password</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-500">
                  Tip: You can also set <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">ADMIN_PASSWORD</code> in Render Environment Variables.
                </p>
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Platform Global Parameters</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500">Dhaka Delivery Fee:</span>
                <p className="text-lg font-bold text-slate-900 mt-1">৳60</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500">Nationwide Delivery:</span>
                <p className="text-lg font-bold text-slate-900 mt-1">৳120</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500">Reseller Verification Fee:</span>
                <p className="text-lg font-bold text-amber-700 mt-1">৳500 BDT</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Recent Audit Logs</h4>
            </div>
            <div className="p-4 space-y-2 text-xs font-mono max-h-64 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <span className="text-slate-500"> by {log.actorName || log.performedBy}</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Change Order Status */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Update Order #{selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateOrderStatus} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select New Status</label>
                <select
                  value={newOrderStatus}
                  onChange={(e) => setNewOrderStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  <option value="PENDING">PENDING (Review)</option>
                  <option value="CONFIRMED">CONFIRMED (Call verified)</option>
                  <option value="PACKAGING">PACKAGING (In warehouse)</option>
                  <option value="SHIPPING">SHIPPING (Handed to Courier)</option>
                  <option value="DELIVERED">DELIVERED (Customer Paid COD - Releases Profit!)</option>
                  <option value="RETURNED">RETURNED (Courier RTO)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Note</label>
                <input
                  type="text"
                  placeholder="e.g. Dispatched via Steadfast / Pathao"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setSelectedOrder(null)} className="px-4 py-2 font-semibold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-xs hover:bg-emerald-700">
                  Confirm Status Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Settle Withdrawal */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedWithdrawal(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
            <div className="px-6 py-5 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Disburse ৳{selectedWithdrawal.amount} Payout</h3>
              <button onClick={() => setSelectedWithdrawal(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleWithdrawalPayout} className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">
                Send ৳{selectedWithdrawal.amount} via <strong>{selectedWithdrawal.method}</strong> to <strong>{selectedWithdrawal.accountNumber}</strong>.
              </p>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">bKash/Nagad/Bank Transaction TrxID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9KL2M899"
                  value={payoutTrxId}
                  onChange={(e) => setPayoutTrxId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setSelectedWithdrawal(null)} className="px-4 py-2 font-semibold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-xs hover:bg-emerald-700">
                  Mark as Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Product */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsAddProductModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Add New Wholesale & Retail Product</h3>
                <p className="text-[11px] text-slate-400">Add to MeherMart catalog with stock management</p>
              </div>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-semibold text-slate-700 mb-1">Product Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MM-1001"
                    value={newProduct.productCode || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, productCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase font-bold text-indigo-700"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Product Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bangla Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. প্রিমিয়াম ওয়্যারলেস ইয়ারবাডস"
                  value={newProduct.nameBn}
                  onChange={(e) => setNewProduct({ ...newProduct, nameBn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => {
                      const val = e.target.value;
                      let slug = 'gadgets';
                      if (val.includes('Kitchen')) slug = 'kitchen';
                      else if (val.includes('Fashion')) slug = 'fashion';
                      else if (val.includes('Beauty')) slug = 'beauty';
                      else if (val.includes('Baby')) slug = 'baby';
                      setNewProduct({ ...newProduct, category: val, categorySlug: slug });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="Smart Kitchen & Living">Smart Kitchen & Living</option>
                    <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                    <option value="Health, Beauty & Care">Health, Beauty & Care</option>
                    <option value="Kids & Baby">Kids & Baby</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Quantity (Units)</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setNewProduct({
                        ...newProduct,
                        stock: val,
                        isStockOut: val <= 0,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono"
                  />
                </div>
              </div>

              {/* Stock Status & Restock Settings */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Stock Status</span>
                    <span className="text-[11px] text-slate-500">Is this product available now?</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProduct.isStockOut || false}
                      onChange={(e) => setNewProduct({ ...newProduct, isStockOut: e.target.checked })}
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                    <span className={`font-bold text-xs ${newProduct.isStockOut ? 'text-rose-600' : 'text-slate-600'}`}>
                      {newProduct.isStockOut ? 'Mark as Out of Stock' : 'In Stock'}
                    </span>
                  </label>
                </div>

                {newProduct.isStockOut && (
                  <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Estimated Restock In (Days)</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        placeholder="e.g. 3"
                        value={newProduct.estimatedRestockDays || 3}
                        onChange={(e) => setNewProduct({ ...newProduct, estimatedRestockDays: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Expected Restock Date</label>
                      <input
                        type="date"
                        value={newProduct.estimatedRestockDate || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, estimatedRestockDate: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Factory Cost (৳)</label>
                  <input
                    type="number"
                    value={newProduct.baseCost}
                    onChange={(e) => setNewProduct({ ...newProduct, baseCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Wholesale (৳)</label>
                  <input
                    type="number"
                    value={newProduct.resellerPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, resellerPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-indigo-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Retail (৳)</label>
                  <input
                    type="number"
                    value={newProduct.suggestedSellingPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, suggestedSellingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newProduct.images?.[0] || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddProductModalOpen(false)} className="px-4 py-2 font-semibold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-xs hover:bg-emerald-700">
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Product */}
      {isEditProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsEditProductModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
            <div className="px-6 py-5 bg-indigo-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Edit className="w-4 h-4 text-indigo-300" />
                  <span>Edit Product: {editingProduct.productCode || `#MM-${editingProduct.id.slice(-4).toUpperCase()}`}</span>
                </h3>
                <p className="text-[11px] text-indigo-200 truncate max-w-sm">{editingProduct.name}</p>
              </div>
              <button onClick={() => setIsEditProductModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateProduct} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-semibold text-slate-700 mb-1">Product Code *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.productCode || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, productCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase font-bold text-indigo-700"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Product Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bangla Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.nameBn || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nameBn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => {
                      const val = e.target.value;
                      let slug = 'gadgets';
                      if (val.includes('Kitchen')) slug = 'kitchen';
                      else if (val.includes('Fashion')) slug = 'fashion';
                      else if (val.includes('Beauty')) slug = 'beauty';
                      else if (val.includes('Baby')) slug = 'baby';
                      setEditingProduct({ ...editingProduct, category: val, categorySlug: slug });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="Smart Kitchen & Living">Smart Kitchen & Living</option>
                    <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                    <option value="Health, Beauty & Care">Health, Beauty & Care</option>
                    <option value="Kids & Baby">Kids & Baby</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Quantity (Units)</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        stock: val,
                        isStockOut: val <= 0,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono"
                  />
                </div>
              </div>

              {/* Stock Status & Restock Settings */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Stock In / Stock Out Switch</span>
                    <span className="text-[11px] text-slate-500">Controls catalog visibility & restock warnings</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={editingProduct.isStockOut || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isStockOut: e.target.checked })}
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                    <span className={`font-bold text-xs ${editingProduct.isStockOut ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {editingProduct.isStockOut ? 'Marked Stock Out' : 'Marked In Stock'}
                    </span>
                  </label>
                </div>

                {editingProduct.isStockOut && (
                  <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Estimated Restock In (Days)</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        placeholder="e.g. 3"
                        value={editingProduct.estimatedRestockDays || 3}
                        onChange={(e) => setEditingProduct({ ...editingProduct, estimatedRestockDays: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Expected Restock Date</label>
                      <input
                        type="date"
                        value={editingProduct.estimatedRestockDate || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, estimatedRestockDate: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Factory Cost (৳)</label>
                  <input
                    type="number"
                    value={editingProduct.baseCost}
                    onChange={(e) => setEditingProduct({ ...editingProduct, baseCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Wholesale (৳)</label>
                  <input
                    type="number"
                    value={editingProduct.resellerPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, resellerPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-indigo-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Retail (৳)</label>
                  <input
                    type="number"
                    value={editingProduct.suggestedSellingPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, suggestedSellingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Image URL</label>
                <input
                  type="text"
                  value={editingProduct.images?.[0] || ''}
                  onChange={(e) => {
                    const newImgs = [...(editingProduct.images || [])];
                    newImgs[0] = e.target.value;
                    setEditingProduct({ ...editingProduct, images: newImgs });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEditProductModalOpen(false)} className="px-4 py-2 font-semibold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-xs hover:bg-indigo-700">
                  Update Product Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Product Confirmation */}
      {isDeleteProductModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsDeleteProductModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
            <div className="px-6 py-5 bg-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-200" />
                <h3 className="font-bold text-sm">Delete Product</h3>
              </div>
              <button onClick={() => setIsDeleteProductModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-2xl">
                <img
                  src={productToDelete.images[0]}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <p className="font-bold text-slate-900">{productToDelete.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">Code: {productToDelete.productCode || `#MM-${productToDelete.id.slice(-4).toUpperCase()}`}</p>
                  <p className="text-[10px] text-slate-400">Category: {productToDelete.category}</p>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete this product from the <strong>MeherMart</strong> catalog? Resellers will no longer be able to view or sell this item.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteProductModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProduct}
                  className="px-5 py-2.5 bg-rose-600 text-white font-bold rounded-xl shadow-xs hover:bg-rose-700 flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Delete Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Challenge */}
      {isAddChallengeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsAddChallengeModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
            <div className="px-6 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <h3 className="font-black text-sm">Create Reseller Challenge</h3>
              </div>
              <button onClick={() => setIsAddChallengeModalOpen(false)} className="p-1 rounded-lg hover:bg-black/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateChallenge} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Challenge Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily 3 Deliveries Sprint"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Frequency / Duration</label>
                <select
                  value={newChallenge.frequency}
                  onChange={(e) => setNewChallenge({ ...newChallenge, frequency: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  <option value="DAILY">DAILY (24 Hours Sprint)</option>
                  <option value="WEEKLY">WEEKLY (7 Days Sprint)</option>
                  <option value="MONTHLY">MONTHLY (30 Days League)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Metric</label>
                  <select
                    value={newChallenge.metric}
                    onChange={(e) => setNewChallenge({ ...newChallenge, metric: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="DELIVERIES">Delivered Orders Count</option>
                    <option value="SALES_BDT">Total Sales (BDT)</option>
                    <option value="ACADEMY_LESSONS">Academy Lessons Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Goal Count *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newChallenge.targetCount}
                    onChange={(e) => setNewChallenge({ ...newChallenge, targetCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reward XP *</label>
                  <input
                    type="number"
                    required
                    step={50}
                    value={newChallenge.rewardXp}
                    onChange={(e) => setNewChallenge({ ...newChallenge, rewardXp: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bonus Cash (৳ BDT)</label>
                  <input
                    type="number"
                    step={50}
                    value={newChallenge.rewardBonusBdt}
                    onChange={(e) => setNewChallenge({ ...newChallenge, rewardBonusBdt: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddChallengeModalOpen(false)} className="px-4 py-2 font-semibold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs transition">
                  Publish Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Challenge Confirmation */}
      {isDeleteChallengeModalOpen && challengeToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsDeleteChallengeModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
            <div className="px-6 py-5 bg-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-200" />
                <h3 className="font-bold text-sm">Delete Challenge</h3>
              </div>
              <button onClick={() => setIsDeleteChallengeModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{challengeToDelete.title}</span>
                  <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                    +{challengeToDelete.rewardXp} XP
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{challengeToDelete.description}</p>
                <p className="text-[10px] text-slate-500 font-medium pt-1">
                  Target: {challengeToDelete.targetCount} {challengeToDelete.metric} | {challengeToDelete.frequency}
                </p>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Are you sure you want to delete this challenge? It will be removed from all active resellers&apos; challenge boards.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteChallengeModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteChallenge}
                  className="px-5 py-2.5 bg-rose-600 text-white font-bold rounded-xl shadow-xs hover:bg-rose-700 flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Delete Challenge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add YouTube Academy Video */}
      {isAddAcademyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsAddAcademyModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-200" />
                <h3 className="font-black text-sm">Add Academy Video Lesson</h3>
              </div>
              <button onClick={() => setIsAddAcademyModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAcademyLesson} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course / Module Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Facebook Marketplace Mastery"
                    value={newLesson.courseTitle}
                    onChange={(e) => setNewLesson({ ...newLesson, courseTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Direct YouTube Link or Video ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
                    value={newLesson.youtubeUrl}
                    onChange={(e) => setNewLesson({ ...newLesson, youtubeUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lesson Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bangla Title *</label>
                  <input
                    type="text"
                    required
                    value={newLesson.titleBn}
                    onChange={(e) => setNewLesson({ ...newLesson, titleBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={newLesson.durationMinutes}
                    onChange={(e) => setNewLesson({ ...newLesson, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reward XP for Watching *</label>
                  <input
                    type="number"
                    required
                    step={50}
                    value={newLesson.xpReward}
                    onChange={(e) => setNewLesson({ ...newLesson, xpReward: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lesson Summary Notes</label>
                <textarea
                  rows={3}
                  value={newLesson.description}
                  onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddAcademyModalOpen(false)} className="px-4 py-2 font-semibold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition">
                  Save & Publish Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Academy Lesson Confirmation */}
      {isDeleteLessonModalOpen && lessonToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsDeleteLessonModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
            <div className="px-6 py-5 bg-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-200" />
                <h3 className="font-bold text-sm">Delete Academy Video Lesson</h3>
              </div>
              <button onClick={() => setIsDeleteLessonModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{lessonToDelete.title}</span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                    +{lessonToDelete.xpReward} XP
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">{lessonToDelete.titleBn}</p>
                <p className="text-[10px] text-slate-400">Course: {lessonToDelete.courseTitle}</p>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete this YouTube video lesson from <strong>MeherMart Reseller Academy</strong>?
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteLessonModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAcademyLesson}
                  className="px-5 py-2.5 bg-rose-600 text-white font-bold rounded-xl shadow-xs hover:bg-rose-700 flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Delete Lesson</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Award Manual XP to Reseller */}
      {isAwardXpModalOpen && selectedResellerForXp && (() => {
        const currentXp = selectedResellerForXp.xp || 0;
        const currentLevel = selectedResellerForXp.level || 1;
        const projectedXp = currentXp + Number(awardXpAmount || 0);

        let projectedLevel = 1;
        let projectedLevelName = 'Novice Reseller';
        if (projectedXp >= 10000) {
          projectedLevel = 5;
          projectedLevelName = 'Legend Elite';
        } else if (projectedXp >= 4000) {
          projectedLevel = 4;
          projectedLevelName = 'Leader Champion';
        } else if (projectedXp >= 1500) {
          projectedLevel = 3;
          projectedLevelName = 'Pro Master';
        } else if (projectedXp >= 500) {
          projectedLevel = 2;
          projectedLevelName = 'Star Reseller';
        }

        const isLevelUp = projectedLevel > currentLevel;

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
              onClick={() => setIsAwardXpModalOpen(false)}
            />
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
              {/* Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Zap className="w-5 h-5 fill-amber-200 text-amber-200" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm">Award Gamification XP</h3>
                    <p className="text-xs text-amber-100">Direct Admin Gamification Grant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAwardXpModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleAwardXpSubmit} className="p-6 space-y-4 text-xs">
                {/* Reseller Info Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-sm text-amber-300">{selectedResellerForXp.storeName}</p>
                      <p className="text-[11px] text-slate-300">
                        {selectedResellerForXp.ownerName} • {selectedResellerForXp.whatsappNumber}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-[11px] flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      Lvl {selectedResellerForXp.level || 1}
                    </span>
                  </div>

                  {/* Level & XP Projection Simulation */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400">Current XP</span>
                      <p className="font-mono font-bold text-white text-xs">{currentXp.toLocaleString()} XP</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-amber-400 animate-pulse" />
                      <div className="text-right">
                        <span className="text-[10px] text-amber-300 font-bold">Projected XP</span>
                        <p className="font-mono font-black text-amber-300 text-xs">
                          {projectedXp.toLocaleString()} XP ({projectedLevelName})
                        </p>
                      </div>
                    </div>
                  </div>

                  {isLevelUp && (
                    <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black text-[11px] text-center flex items-center justify-center gap-1.5 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Instant Level Up Trigger: Level {currentLevel} ➔ Level {projectedLevel}!</span>
                    </div>
                  )}
                </div>

                {/* Quick XP Preset Selector */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Select XP Amount *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { amount: 50, label: '+50 XP (Quiz / Task)' },
                      { amount: 100, label: '+100 XP (Standard Lesson)' },
                      { amount: 250, label: '+250 XP (Masterclass)' },
                      { amount: 500, label: '+500 XP (Weekly Challenge)' },
                      { amount: 1000, label: '+1000 XP (Super Bonus)' },
                      { amount: 2000, label: '+2000 XP (Elite Award)' },
                    ].map((preset) => (
                      <button
                        key={preset.amount}
                        type="button"
                        onClick={() => setAwardXpAmount(preset.amount)}
                        className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center justify-center ${
                          awardXpAmount === preset.amount
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-sm font-black font-mono">+{preset.amount}</span>
                        <span className="text-[9px] font-medium opacity-90">{preset.label.split('(')[1]?.replace(')', '') || 'XP'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Number Input */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Or Enter Exact XP Amount</label>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    step={10}
                    required
                    value={awardXpAmount}
                    onChange={(e) => setAwardXpAmount(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white"
                  />
                </div>

                {/* Reason Dropdown & Presets */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason / Challenge / Lesson *</label>
                  <select
                    value={awardXpReason}
                    onChange={(e) => setAwardXpReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                  >
                    <option value="Completed Facebook & TikTok Viral Video Lesson">
                      📺 Completed Facebook & TikTok Viral Video Lesson
                    </option>
                    <option value="Completed Weekly Sales Challenge (3+ Orders Delivered)">
                      🏆 Completed Weekly Sales Challenge (3+ Orders Delivered)
                    </option>
                    <option value="Completed Zero-Ad-Cost WhatsApp Marketing Lesson">
                      📱 Completed Zero-Ad-Cost WhatsApp Marketing Lesson
                    </option>
                    <option value="Completed Customer Service & COD Management Lesson">
                      💬 Completed Customer Service & COD Management Lesson
                    </option>
                    <option value="Completed First 10 Successful Deliveries Milestone">
                      📦 Completed First 10 Successful Deliveries Milestone
                    </option>
                    <option value="Special Performance & Store Motivation Boost">
                      ⭐ Special Performance & Store Motivation Boost
                    </option>
                    <option value="CUSTOM">✍️ Custom Offline Lesson / Challenge Reason</option>
                  </select>
                </div>

                {awardXpReason === 'CUSTOM' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Type Custom Reason *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Attended Dhaka Reseller Workshop Masterclass"
                      value={customXpReason}
                      onChange={(e) => setCustomXpReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    />
                  </div>
                )}

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAwardXpModalOpen(false)}
                    className="px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingXp}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black rounded-xl shadow-md transition flex items-center gap-2"
                  >
                    {isSubmittingXp ? (
                      <span>Awarding XP...</span>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                        <span>Confirm & Award +{awardXpAmount} XP</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Modal: View Reseller Order History & Profit Breakdown */}
      {selectedResellerForOrders && (() => {
        const r = selectedResellerForOrders;
        // Collect orders for this reseller: from recentOrders or from main orders list
        const resellerOrdersList = (r.recentOrders && r.recentOrders.length > 0)
          ? r.recentOrders
          : orders.filter((o) => o.resellerId === r.id || o.resellerId === r.userId || o.resellerStoreName === r.storeName);

        const filteredResellerOrders = resellerOrdersList.filter((o) => {
          if (resellerOrdersStatusFilter === 'ALL') return true;
          return o.status === resellerOrdersStatusFilter;
        });

        const grossSales = r.totalSalesBdt || r.moneyMadeBdt || resellerOrdersList.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const totalProfit = r.totalProfitEarned || r.totalProfitEarnedBdt || r.moneyProfitedBdt || resellerOrdersList.reduce((sum, o) => sum + (o.resellerProfit || 0), 0);

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 text-white flex items-center justify-center font-black text-base shadow-xs">
                    {r.storeName?.charAt(0) || 'R'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black">{r.storeName}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
                        Lvl {r.level || 1} • {r.levelName || 'Reseller'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Owner: {r.ownerName || r.userId} • Phone: {r.whatsappNumber || 'N/A'} • {r.district}, {r.division}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedResellerForOrders(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Financial Metrics Summary Banner */}
              <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] text-slate-500 font-semibold block">Total Orders</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    {resellerOrdersList.length || r.totalOrdersCount || 0} Orders
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] text-slate-500 font-semibold block">Money Made (Gross Sales)</span>
                  <span className="text-lg font-black text-indigo-600 font-mono">
                    ৳{grossSales.toLocaleString()}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] text-slate-500 font-semibold block">Money Profited (Net)</span>
                  <span className="text-lg font-black text-emerald-600 font-mono">
                    +৳{totalProfit.toLocaleString()}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] text-slate-500 font-semibold block">Earned XP Score</span>
                  <span className="text-lg font-black text-amber-500 font-mono">
                    {(r.xp || 0).toLocaleString()} XP
                  </span>
                </div>
              </div>

              {/* Order Status Filters & Search Bar */}
              <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0 flex-wrap">
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
                  {['ALL', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setResellerOrdersStatusFilter(st)}
                      className={`px-3 py-1 rounded-xl transition ${
                        resellerOrdersStatusFilter === st
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-slate-500 font-medium">
                  Showing {filteredResellerOrders.length} of {resellerOrdersList.length} orders
                </span>
              </div>

              {/* Orders Table Container */}
              <div className="p-6 overflow-y-auto flex-1 space-y-3">
                {filteredResellerOrders.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-600 text-sm">No orders found for this status.</p>
                    <p className="text-xs text-slate-400 mt-1">This reseller has not made orders matching the filter.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    {filteredResellerOrders.map((ord) => (
                      <div key={ord.id} className="p-4 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        {/* Order & Customer Info */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                              {ord.orderNumber || ord.id.slice(0, 8)}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              ord.status === 'DELIVERED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'SHIPPED'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.status === 'CONFIRMED'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {ord.status}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-GB') : 'Recent'}
                            </span>
                          </div>

                          <p className="font-bold text-slate-900 text-xs">
                            Customer: {ord.customerName} • {ord.customerPhone}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {ord.customerAddress}, {ord.district}
                          </p>

                          {/* Items Summary */}
                          {ord.items && ord.items.length > 0 && (
                            <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg mt-1 space-y-0.5">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                  <span>{item.productName || item.title || 'Product'} × {item.quantity}</span>
                                  <span className="font-mono font-bold">৳{(item.price || item.resellerSellingPrice || 0) * (item.quantity || 1)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Financials & Status */}
                        <div className="sm:text-right space-y-1 shrink-0 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Total Sale</span>
                            <span className="text-sm font-black text-slate-900 font-mono">
                              ৳{ord.totalAmount || ord.sellingPrice || 0}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Reseller Profit</span>
                            <span className="text-xs font-black text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded inline-block">
                              +৳{ord.resellerProfit || Math.round((ord.totalAmount || 1000) * 0.25)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-500">
                  Referral code: <strong className="text-slate-800 font-mono">{r.referralCode}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedResellerForOrders(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                >
                  Close History
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Bulk Product CSV Uploader Modal */}
      <BulkProductUploaderModal
        isOpen={isBulkUploaderOpen}
        onClose={() => setIsBulkUploaderOpen(false)}
        onSuccess={(count) => {
          triggerLevelUpCelebration();
          loadAllAdminData();
        }}
      />
    </div>
  );
};
