import React, { useState, useEffect } from 'react';
import { Product, Order, Wallet, ResellerProfile, MarketingNotification } from '../../types';
import { RESELLER_LEVEL_TIERS } from '../../data/bangladeshGeo';
import { StatusBadge } from '../common/Badge';
import { ResellerSalesChart } from './ResellerSalesChart';
import { ResellerNotificationCarousel } from './ResellerNotificationCarousel';
import { ResellerPopupPosterModal } from './ResellerPopupPosterModal';
import { ResellerNotificationsHubModal } from './ResellerNotificationsHubModal';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import {
  TrendingUp,
  ShoppingBag,
  Wallet as WalletIcon,
  Package,
  Award,
  Sparkles,
  ArrowRight,
  Plus,
  Share2,
  BookOpen,
  Truck,
  ShieldCheck,
  Bell,
  Megaphone,
} from 'lucide-react';

export const ResellerDashboard: React.FC<{
  reseller: ResellerProfile;
  orders: Order[];
  wallet: Wallet | null;
  products: Product[];
  onNavigateTab: (tab: string) => void;
  onOpenManualOrder: (product?: Product) => void;
  onOpenWithdrawalModal: () => void;
  onOpenAiChat: () => void;
}> = ({
  reseller,
  orders,
  wallet,
  products,
  onNavigateTab,
  onOpenManualOrder,
  onOpenWithdrawalModal,
  onOpenAiChat,
}) => {
  const { isBn } = useLanguage();
  const [notifications, setNotifications] = useState<MarketingNotification[]>([]);
  const [activePopupNotification, setActivePopupNotification] = useState<MarketingNotification | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isNotificationsHubOpen, setIsNotificationsHubOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [reseller?.id]);

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications(reseller?.id);
      const list = res.notifications || [];
      setNotifications(list);

      // Check if there is an unread popup notification that needs to be shown on login
      const unreadPopup = list.find(
        (n: MarketingNotification) =>
          n.isActive !== false &&
          (n.displayType === 'POPUP_ON_LOGIN' || n.displayType === 'BOTH' || n.popupOnLogin) &&
          (!n.readBy || !n.readBy.includes(reseller?.id))
      );

      if (unreadPopup) {
        setActivePopupNotification(unreadPopup);
        setIsPopupOpen(true);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const handleActionRedirect = (actionUrl?: string) => {
    if (!actionUrl) return;

    if (actionUrl.startsWith('http://') || actionUrl.startsWith('https://')) {
      window.open(actionUrl, '_blank');
      return;
    }

    if (actionUrl.startsWith('product:')) {
      const prodId = actionUrl.replace('product:', '');
      const product = products.find((p) => p.id === prodId);
      if (product && onOpenManualOrder) {
        onOpenManualOrder(product);
        return;
      }
      onNavigateTab('products');
      return;
    }

    if (actionUrl.startsWith('prod-')) {
      const product = products.find((p) => p.id === actionUrl);
      if (product && onOpenManualOrder) {
        onOpenManualOrder(product);
        return;
      }
      onNavigateTab('products');
      return;
    }

    onNavigateTab(actionUrl);
  };

  const handleMarkAsRead = async (id: string) => {
    if (!reseller?.id) return;
    try {
      await api.markNotificationRead(id, reseller.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, readBy: Array.from(new Set([...(n.readBy || []), reseller.id])) }
            : n
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!reseller?.id) return;
    for (const notif of notifications) {
      if (!notif.readBy?.includes(reseller.id)) {
        await handleMarkAsRead(notif.id);
      }
    }
  };

  const unreadCount = notifications.filter(
    (n) => !n.readBy || !n.readBy.includes(reseller?.id)
  ).length;

  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED');
  const totalResellerProfit = deliveredOrders.reduce((acc, o) => acc + o.totalResellerProfit, 0);
  const pendingOrders = orders.filter((o) => ['PENDING', 'CONFIRMED', 'PACKAGING', 'SHIPPING'].includes(o.status));
  const pendingProfit = pendingOrders.reduce((acc, o) => acc + o.totalResellerProfit, 0);

  const levelInfo = RESELLER_LEVEL_TIERS[reseller.level] || RESELLER_LEVEL_TIERS[1];
  const nextLevelInfo = RESELLER_LEVEL_TIERS[reseller.level + 1];
  const xpProgress = nextLevelInfo
    ? Math.min(100, Math.round(((reseller.xp - levelInfo.minOrders * 10) / ((nextLevelInfo.minOrders - levelInfo.minOrders) * 10 || 100)) * 100))
    : 100;

  return (
    <div className="space-y-8" id="reseller-dashboard">
      {/* Welcome & Level Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl">👋</span>
              <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                {isBn ? 'রিসেলার হাব' : 'Reseller Hub'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {reseller.storeName}
              </span>

              {/* Notifications Button with unread badge */}
              <button
                onClick={() => setIsNotificationsHubOpen(true)}
                className="relative px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{isBn ? 'নোটিশ ও পোস্টার' : 'Campaigns'}</span>
                {unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isBn ? `স্বাগতম, ${reseller.storeName}!` : `Welcome back, ${reseller.storeName}!`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {isBn ? 'র‍্যাংক:' : 'Rank:'} <span className="font-bold text-amber-300">{levelInfo.name} (Level {reseller.level})</span> • {isBn ? 'রেফারেল কোড:' : 'Referral Code:'} <span className="font-mono font-bold text-emerald-400">{reseller.referralCode}</span>
            </p>
          </div>

          {/* Level Progress Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 min-w-[260px] space-y-2 animate-float-gentle">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-200">Level {reseller.level} ({levelInfo.badge})</span>
              <span className="text-amber-300 font-bold">{reseller.xp} XP</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(10, xpProgress)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-300">
              {nextLevelInfo
                ? `${nextLevelInfo.minOrders - reseller.totalDeliveredOrders} more delivered orders to Level ${reseller.level + 1}`
                : 'Maximum tier achieved! 👑'}
            </p>
          </div>
        </div>
      </div>

      {/* Official Marketing Poster Carousel (Auto-rotating on phone & desktop) */}
      <ResellerNotificationCarousel
        notifications={notifications}
        resellerId={reseller.id}
        onNavigateToAction={handleActionRedirect}
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isBn ? 'উইথড্রয়াল ব্যালেন্স' : 'Available Payout'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <WalletIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            ৳{(wallet?.availableBalance ?? 0).toLocaleString()}
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-emerald-600 font-bold">
              {isBn ? 'উত্তোলনযোগ্য' : 'Ready to withdraw'}
            </span>
            <button
              onClick={onOpenWithdrawalModal}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
            >
              {isBn ? 'উইথড্র করুন' : 'Withdraw'}
            </button>
          </div>
        </div>

        {/* Pending Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isBn ? 'পেন্ডিং মার্জিন' : 'Pending Margin'}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600">
            ৳{(wallet?.pendingBalance ?? pendingProfit ?? 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">
            {isBn ? 'ডেলিভারি সম্পন্ন হলে যুক্ত হবে' : 'Releases upon courier delivery'}
          </p>
        </div>

        {/* Total Delivered Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isBn ? 'ডেলিভার্ড অর্ডার' : 'Delivered Orders'}
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {reseller?.totalDeliveredOrders ?? 0}{' '}
            <span className="text-xs font-normal text-slate-400">
              / {orders.length} {isBn ? 'মোট' : 'total'}
            </span>
          </p>
          <p className="text-[11px] text-indigo-600 font-bold">
            {isBn ? 'সফলতার হার:' : 'Success Rate:'}{' '}
            {orders.length > 0
              ? (((reseller?.totalDeliveredOrders ?? 0) / orders.length) * 100).toFixed(0)
              : 100}
            %
          </p>
        </div>

        {/* Total Earned */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isBn ? 'মোট প্রফিট আয়' : 'Lifetime Profit'}
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-900">
            ৳{(wallet?.lifetimeEarnings ?? totalResellerProfit ?? 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">
            {isBn ? '০% হিডেন ফি' : '0% hidden fees deducted'}
          </p>
        </div>
      </div>

      {/* Sales Performance Line Chart */}
      <ResellerSalesChart orders={orders} />

      {/* Quick Action Hub */}
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {isBn ? 'রিসেলার অপারেশন হাব' : 'Reseller Operations Hub'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onOpenManualOrder()}
            className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-left transition shadow-sm space-y-2 group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-bold text-xs">{isBn ? 'অর্ডার দিন' : 'Create Order'}</p>
              <p className="text-[10px] text-emerald-100">{isBn ? 'কাস্টমারের জন্য সাবমিট' : 'Submit for customer'}</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('products')}
            className="p-4 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl text-left border border-slate-200 transition shadow-xs space-y-2"
          >
            <Package className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="font-bold text-xs">{isBn ? 'প্রোডাক্ট ক্যাটালগ' : 'Browse Products'}</p>
              <p className="text-[10px] text-slate-400">{isBn ? '৫০০+ ফ্যাক্টরি আইটেম' : '500+ factory items'}</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('wallet')}
            className="p-4 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl text-left border border-slate-200 transition shadow-xs space-y-2"
          >
            <WalletIcon className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-bold text-xs">{isBn ? 'ওয়ালেট ও পেমেন্ট' : 'Wallet & Payouts'}</p>
              <p className="text-[10px] text-slate-400">bKash / Nagad / Bank</p>
            </div>
          </button>

          <button
            onClick={onOpenAiChat}
            className="p-4 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl text-left transition shadow-sm space-y-2 group"
          >
            <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <div>
              <p className="font-bold text-xs">ResellAI</p>
              <p className="text-[10px] text-purple-100">{isBn ? 'মার্কেটিং ও সেলস হেল্প' : 'Marketing & Sales help'}</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('leaderboard')}
            className="p-4 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl text-left border border-slate-200 transition shadow-xs space-y-2"
          >
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <p className="font-bold text-xs">{isBn ? 'লিডারবোর্ড' : 'Leaderboard'}</p>
              <p className="text-[10px] text-slate-400">{isBn ? 'র‍্যাংকিং ও রিওয়ার্ড' : 'Rankings & Rewards'}</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('academy')}
            className="p-4 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl text-left border border-slate-200 transition shadow-xs space-y-2"
          >
            <BookOpen className="w-5 h-5 text-teal-600" />
            <div>
              <p className="font-bold text-xs">{isBn ? 'রিসেলার একাডেমি' : 'Reseller Academy'}</p>
              <p className="text-[10px] text-slate-400">{isBn ? 'ভিডিও টিউটোরিয়াল' : 'Master Facebook sales'}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              {isBn ? 'সাম্প্রতিক কাস্টমার অর্ডার' : 'Your Recent Customer Orders'}
            </h3>
            <p className="text-xs text-slate-400">
              {isBn ? 'লাইভ কুরিয়ার ট্র্যাকিং ও প্রফিট স্ট্যাটাস' : 'Live courier tracking and profit settlement status'}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>{isBn ? `সকল দেখুন (${orders.length})` : `View All (${orders.length})`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">{isBn ? 'অর্ডার / ট্র্যাকিং' : 'Order / Tracking'}</th>
                <th className="p-4">{isBn ? 'কাস্টমার ও শহর' : 'Customer & City'}</th>
                <th className="p-4">{isBn ? 'আইটেম' : 'Items'}</th>
                <th className="p-4">{isBn ? 'বিক্রয় মূল্য' : 'Selling Total'}</th>
                <th className="p-4">{isBn ? 'আপনার লাভ' : 'Your Profit'}</th>
                <th className="p-4">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4">
                    <p className="font-mono font-bold text-slate-900">{order.orderNumber}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {order.courier}: {order.trackingNumber}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{order.customerName}</p>
                    <p className="text-[11px] text-slate-400">
                      {order.district}, {order.division}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-700">{order.items.map((i) => i.productName).join(', ')}</p>
                  </td>
                  <td className="p-4 font-bold text-slate-900">৳{order.totalAmount}</td>
                  <td className="p-4">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      +৳{order.totalResellerProfit}
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    {isBn
                      ? 'এখনও কোন অর্ডার পাওয়া যায়নি। প্রথম কাস্টমার অর্ডার তৈরি করে আয় শুরু করুন!'
                      : 'No orders placed yet. Create your first customer order to start earning!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Login Popup Poster Modal */}
      <ResellerPopupPosterModal
        isOpen={isPopupOpen}
        notification={activePopupNotification}
        onClose={() => setIsPopupOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        onNavigateToAction={handleActionRedirect}
      />

      {/* Reseller Notifications Hub Modal */}
      <ResellerNotificationsHubModal
        isOpen={isNotificationsHubOpen}
        onClose={() => setIsNotificationsHubOpen(false)}
        notifications={notifications}
        resellerId={reseller.id}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onNavigateToAction={handleActionRedirect}
      />
    </div>
  );
};
