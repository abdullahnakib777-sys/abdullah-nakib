import React, { useState, useEffect } from 'react';
import {
  Product,
  Order,
  ResellerProfile,
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
import {
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Users,
  Wallet,
  AlertTriangle,
  Plus,
  Edit,
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
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'resellers' | 'products' | 'challenges' | 'academy' | 'withdrawals' | 'fraud' | 'settings'
  >('overview');

  const [statsData, setStatsData] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [resellers, setResellers] = useState<ResellerProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([]);
  const [academyLessons, setAcademyLessons] = useState<AcademyLesson[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modals / Actions
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<string>('CONFIRMED');
  const [statusNote, setStatusNote] = useState('');

  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [payoutTrxId, setPayoutTrxId] = useState('');

  // Add Product Modal
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    nameBn: '',
    category: 'Electronics & Gadgets',
    categorySlug: 'gadgets',
    baseCost: 500,
    resellerPrice: 700,
    suggestedSellingPrice: 1100,
    stock: 100,
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

  const loadAllAdminData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const results = await Promise.allSettled([
        api.getAdminStats(),
        api.getOrders(),
        api.getProducts(),
        api.getGamification(),
        api.getAcademyLessons(),
        api.getAuditLogs(),
        api.getFraudAlerts(),
      ]);

      const [stRes, ordRes, prRes, gamRes, acaRes, logsRes, alertsRes] = results;

      if (stRes.status === 'fulfilled') {
        setStatsData(stRes.value);
        setResellers(stRes.value?.pendingResellers || []);
        setWithdrawals(stRes.value?.pendingWithdrawals || []);
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
          { id: 'resellers', label: `👥 Reseller Approvals (${resellers.length})` },
          { id: 'products', label: `🏷️ Products (${products.length})` },
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

      {/* TAB 3: RESELLERS & 500 TK VERIFICATION */}
      {activeTab === 'resellers' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-5 bg-amber-500/10 border border-amber-300 rounded-3xl flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-slate-950">Reseller Verification Policy (৫০০৳ Fee)</h3>
              <p className="text-xs text-slate-700">
                Resellers register and submit 500 TK via bKash / Nagad / Rocket. As Admin, you can verify their 500 TK TrxID or <strong>freely approve them with 0 fee waiver</strong> at any time.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Store & Reseller</th>
                    <th className="p-4">WhatsApp & Location</th>
                    <th className="p-4">500 TK Payment Status</th>
                    <th className="p-4">Submitted TrxID</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {resellers.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{r.storeName}</p>
                        <p className="text-[11px] text-slate-500">{r.address || r.userId}</p>
                        {r.adminApprovedFree && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm">
                            Admin Free Pass Granted
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="font-mono text-slate-900">{r.whatsappNumber}</p>
                        <p className="text-[11px] text-slate-400">{r.district}, {r.division}</p>
                      </td>
                      <td className="p-4">
                        {r.verificationFeePaid || r.verificationPayment ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            ৳500 Submitted ({r.verificationPayment?.method || 'bKash'})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                            Fee Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-800">
                        {r.verificationPayment?.trxId ? (
                          <div>
                            <span>{r.verificationPayment.trxId}</span>
                            <p className="text-[10px] text-slate-400 font-normal">Sender: {r.verificationPayment.senderPhone}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-normal">None</span>
                        )}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleResellerApproveFree(r.id)}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] transition"
                          title="Allow freely without 500 TK payment"
                        >
                          Approve Free
                        </button>
                        <button
                          onClick={() => handleResellerVerifyPayment(r.id, true)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition"
                        >
                          Verify 500৳
                        </button>
                        <button
                          onClick={() => handleResellerVerifyPayment(r.id, false)}
                          className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold text-[11px] transition"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                  {resellers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No pending reseller verification applications.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Wholesale & Normal E-Commerce Catalog</h3>
              <p className="text-xs text-slate-400">Set factory cost, reseller wholesale price, and standard retail price</p>
            </div>

            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Factory Cost</th>
                    <th className="p-4">Wholesale Price (Reseller)</th>
                    <th className="p-4">Suggested Retail (Customer)</th>
                    <th className="p-4">Margin</th>
                    <th className="p-4">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <p className="text-[11px] text-slate-400">{p.nameBn}</p>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{p.category}</td>
                      <td className="p-4 text-slate-500">৳{p.baseCost}</td>
                      <td className="p-4 font-bold text-indigo-700">৳{p.resellerPrice}</td>
                      <td className="p-4 font-bold text-slate-900">৳{p.suggestedSellingPrice}</td>
                      <td className="p-4 font-bold text-emerald-700">+৳{p.suggestedSellingPrice - p.resellerPrice}</td>
                      <td className="p-4 font-mono">{p.stock} pcs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
              <div key={c.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
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
                  <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> +{c.rewardXp} XP
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.description}</p>
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
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> +{l.xpReward} XP
                    </span>
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
                  <span className="font-bold text-indigo-600">Active in Academy</span>
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
              <h3 className="font-bold text-sm">Add New Wholesale & Retail Product</h3>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bangla Title *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.nameBn}
                    onChange={(e) => setNewProduct({ ...newProduct, nameBn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
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
                  <label className="block font-semibold text-slate-700 mb-1">Initial Stock (Units)</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Factory Cost (৳)</label>
                  <input
                    type="number"
                    value={newProduct.baseCost}
                    onChange={(e) => setNewProduct({ ...newProduct, baseCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Wholesale Price (৳)</label>
                  <input
                    type="number"
                    value={newProduct.resellerPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, resellerPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-indigo-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Suggested Retail (৳)</label>
                  <input
                    type="number"
                    value={newProduct.suggestedSellingPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, suggestedSellingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-700"
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
    </div>
  );
};
