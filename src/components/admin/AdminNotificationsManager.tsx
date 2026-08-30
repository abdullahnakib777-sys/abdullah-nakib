import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MarketingNotification,
  NotificationTargetType,
  NotificationPriority,
  NotificationDisplayType,
  NotificationActionType,
  ResellerProfile,
  Product,
} from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Megaphone,
  Send,
  Sparkles,
  Flame,
  Users,
  UserCheck,
  Smartphone,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Eye,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  Layers,
  Clock,
  ChevronDown,
  Edit3,
  X,
  Sliders,
  Check,
  Package,
  ShoppingBag,
  Link as LinkIcon,
  ToggleLeft,
  ToggleRight,
  ArrowUpRight,
} from 'lucide-react';

const POSTER_PRESETS = [
  {
    name: 'Smartwatch Mega Campaign (T900 Ultra)',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80',
    titleBn: '🔥 ৫০% বেশি লাভ! T900 Ultra 2 Max মেগা ক্যাম্পেইন',
    titleEn: '🔥 2X Profit Margin: T900 Ultra 2 Max Flash Campaign',
    msgBn: 'প্রতি অর্ডারে অতিরিক্ত ২০০ টাকা প্রফিট মার্জিন বোনাস! আপনার ফেসবুক পেজ ও টিকটকে পোস্টারটি পোস্ট করে দ্রুত কাস্টমার অর্ডার নিন। স্টক সীমিত!',
    msgEn: 'Extra ৳200 bonus profit on every delivered smartwatch! Post this promotional poster to your Facebook & TikTok pages for instant pre-orders.',
    badge: '🔥 HOT CAMPAIGN',
    badgeBn: '🔥 মেগা ক্যাম্পেইন',
    displayType: 'TOP_CAROUSEL' as NotificationDisplayType,
    actionType: 'PRODUCT' as NotificationActionType,
    productId: 'prod-01',
    actionUrl: 'product:prod-01',
    actionLabel: 'Sell T900 Watch Now',
    actionLabelBn: 'এখনই ওয়াচ সেল করুন',
    priority: 'URGENT' as NotificationPriority,
  },
  {
    name: 'Kitchen Chopper & Blender Restock',
    url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=1200&auto=format&fit=crop&q=80',
    titleBn: '🌙 ঈদ স্পেশাল ২-ইন-১ ইলেকট্রিক ফুড চপার রিস্টক',
    titleEn: '🌙 Eid Special 2-in-1 Electric Food Chopper Restock Alert',
    msgBn: 'সবচেয়ে দ্রুত বিক্রি হওয়া ২ লিটার ফুড চপার এবং ইনস্ট্যান্ট গারমেন্ট স্টিমার নতুন স্টক ফ্যাক্টরি থেকে চলে এসেছে। ডেলিভারি টাইম মাত্র ২৪-৪৮ ঘণ্টা!',
    msgEn: 'Top-selling 2L food chopper and garment steamer new batch just arrived from direct manufacturer! Instant 24h delivery.',
    badge: '✨ NEW STOCK',
    badgeBn: '✨ নতুন স্টক',
    displayType: 'TOP_CAROUSEL' as NotificationDisplayType,
    actionType: 'PRODUCT' as NotificationActionType,
    productId: 'prod-03',
    actionUrl: 'product:prod-03',
    actionLabel: 'Sell Electric Chopper',
    actionLabelBn: 'ফুড চপার সেল করুন',
    priority: 'HIGH' as NotificationPriority,
  },
  {
    name: 'Wireless ANC Earbuds Pro Flash Sale',
    url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&auto=format&fit=crop&q=80',
    titleBn: '🎧 আল্ট্রা বাসের ওয়্যারলেস ইয়ারবাডস প্রো ধামাকা অফার',
    titleEn: '🎧 Ultra Bass Wireless Earbuds Pro Super Deal',
    msgBn: 'রিসেলার স্পেশাল রেট মাত্র ৩২০ টাকা! কাস্টমারের কাছে ৭০০-৯০০ টাকায় বিক্রি করে প্রতি পিসে ৪০০+ টাকা নেট প্রফিট করুন।',
    msgEn: 'Wholesale price only ৳320! Resell to retail customers at ৳700-৳900 with ৳400+ net profit margin per piece.',
    badge: '🎧 POPUP ALERT',
    badgeBn: '🎧 স্পেশাল অ্যালার্ট',
    displayType: 'POPUP_ON_LOGIN' as NotificationDisplayType,
    actionType: 'PRODUCT' as NotificationActionType,
    productId: 'prod-02',
    actionUrl: 'product:prod-02',
    actionLabel: 'Sell M10 Earbuds Now',
    actionLabelBn: 'এখনই ইয়ারবাডস সেল করুন',
    priority: 'URGENT' as NotificationPriority,
  },
  {
    name: 'Instant bKash/Nagad Payout Notice',
    url: 'https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=1200&auto=format&fit=crop&q=80',
    titleBn: '💸 বিকাশ ও নগদ ইনস্ট্যান্ট উইথড্রয়াল সেটেলমেন্ট আপডেট',
    titleEn: '💸 Instant bKash & Nagad Withdrawal Updates',
    msgBn: 'সকল অ্যাপ্রুভড অর্ডার উইথড্রয়াল রিকোয়েস্ট প্রতিদিন রাত ৮টার মধ্যে বিকাশ ও নগদে সরাসরি পরিশোধ করা হচ্ছে। আপনার বন্ধুদের রেফার করে জিতে নিন ২০০ টাকা!',
    msgEn: 'All approved reseller withdrawal requests are processed daily by 8 PM via instant bKash & Nagad merchant payouts.',
    badge: '💰 FAST PAYOUT',
    badgeBn: '💰 দ্রুত পেমেন্ট',
    displayType: 'BOTH' as NotificationDisplayType,
    actionType: 'ROUTE' as NotificationActionType,
    productId: '',
    actionUrl: 'wallet',
    actionLabel: 'Check Your Wallet',
    actionLabelBn: 'ওয়ালেট চেক করুন',
    priority: 'NORMAL' as NotificationPriority,
  },
];

export const AdminNotificationsManager: React.FC = () => {
  const toast = useToast();
  const { isBn } = useLanguage();

  const [notifications, setNotifications] = useState<MarketingNotification[]>([]);
  const [resellers, setResellers] = useState<ResellerProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Mode state
  const [editingNotificationId, setEditingNotificationId] = useState<string | null>(null);

  // Table Filter
  const [tableFilter, setTableFilter] = useState<'ALL' | 'CAROUSEL' | 'POPUP' | 'ACTIVE'>('ALL');

  // Form State
  const [targetType, setTargetType] = useState<NotificationTargetType>('ALL');
  const [selectedResellerIds, setSelectedResellerIds] = useState<string[]>([]);
  const [resellerSearchQuery, setResellerSearchQuery] = useState('');

  const [displayType, setDisplayType] = useState<NotificationDisplayType>('TOP_CAROUSEL');
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [messageBn, setMessageBn] = useState('');
  const [messageEn, setMessageEn] = useState('');
  const [posterImage, setPosterImage] = useState(POSTER_PRESETS[0].url);
  const [badge, setBadge] = useState('🔥 HOT CAMPAIGN');
  const [badgeBn, setBadgeBn] = useState('🔥 মেগা ক্যাম্পেইন');
  const [priority, setPriority] = useState<NotificationPriority>('HIGH');
  const [isActive, setIsActive] = useState(true);

  // Action Destination State
  const [actionType, setActionType] = useState<NotificationActionType>('PRODUCT');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-01');
  const [selectedRoute, setSelectedRoute] = useState<string>('products');
  const [customActionUrl, setCustomActionUrl] = useState<string>('');
  const [actionLabelEn, setActionLabelEn] = useState('Sell Now');
  const [actionLabelBn, setActionLabelBn] = useState('এখনই সেল করুন');

  const [previewLanguage, setPreviewLanguage] = useState<'bn' | 'en'>('bn');

  useEffect(() => {
    loadData();
    applyPreset(POSTER_PRESETS[0]);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [notifsRes, resellersRes, productsRes] = await Promise.all([
        api.adminGetNotifications(),
        api.getAdminResellers(),
        api.getProducts(),
      ]);
      setNotifications(notifsRes.notifications || []);
      setResellers(resellersRes.resellers || []);
      setProducts(productsRes.products || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load notifications data');
    } finally {
      setIsLoading(false);
    }
  };

  const applyPreset = (preset: typeof POSTER_PRESETS[0]) => {
    setPosterImage(preset.url);
    setTitleBn(preset.titleBn);
    setTitleEn(preset.titleEn);
    setMessageBn(preset.msgBn);
    setMessageEn(preset.msgEn);
    setBadge(preset.badge);
    setBadgeBn(preset.badgeBn);
    setDisplayType(preset.displayType);
    setActionType(preset.actionType);
    if (preset.actionType === 'PRODUCT') {
      setSelectedProductId(preset.productId || 'prod-01');
    } else {
      setSelectedRoute(preset.actionUrl || 'products');
    }
    setActionLabelEn(preset.actionLabel);
    setActionLabelBn(preset.actionLabelBn);
    setPriority(preset.priority);
  };

  const handleStartEdit = (notif: MarketingNotification) => {
    setEditingNotificationId(notif.id);
    setTitleEn(notif.title || '');
    setTitleBn(notif.titleBn || notif.title || '');
    setMessageEn(notif.message || '');
    setMessageBn(notif.messageBn || notif.message || '');
    setPosterImage(notif.posterImage || '');
    setBadge(notif.badge || 'PROMO');
    setBadgeBn(notif.badgeBn || notif.badge || 'অফার');
    setPriority(notif.priority || 'NORMAL');
    setDisplayType(notif.displayType || (notif.popupOnLogin ? 'POPUP_ON_LOGIN' : 'TOP_CAROUSEL'));
    setTargetType(notif.targetType || 'ALL');
    setSelectedResellerIds(notif.targetResellerIds || []);
    setIsActive(notif.isActive !== false);

    // Parse action type & destination
    if (notif.actionType === 'PRODUCT' || notif.productId || notif.actionUrl?.startsWith('product:')) {
      setActionType('PRODUCT');
      const prodId = notif.productId || notif.actionUrl?.replace('product:', '') || 'prod-01';
      setSelectedProductId(prodId);
    } else if (
      notif.actionUrl &&
      (notif.actionUrl.startsWith('http://') || notif.actionUrl.startsWith('https://'))
    ) {
      setActionType('EXTERNAL_LINK');
      setCustomActionUrl(notif.actionUrl);
    } else {
      setActionType('ROUTE');
      setSelectedRoute(notif.actionUrl || 'products');
    }

    setActionLabelEn(notif.actionLabel || 'Sell Now');
    setActionLabelBn(notif.actionLabelBn || notif.actionLabel || 'এখনই সেল করুন');

    // Scroll smoothly to form
    const formElement = document.getElementById('poster-editor-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    toast.info(isBn ? 'সম্পাদনা মোড সক্রিয় হয়েছে' : 'Editing campaign notification');
  };

  const handleCancelEdit = () => {
    setEditingNotificationId(null);
    applyPreset(POSTER_PRESETS[0]);
    toast.info(isBn ? 'সম্পাদনা বাতিল করা হয়েছে' : 'Edit cancelled');
  };

  const handleToggleActiveStatus = async (notif: MarketingNotification) => {
    const newStatus = notif.isActive === false ? true : false;
    try {
      await api.adminUpdateNotification(notif.id, { isActive: newStatus });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isActive: newStatus } : n))
      );
      toast.success(
        newStatus
          ? (isBn ? 'পোস্টার সক্রিয় করা হয়েছে' : 'Poster activated')
          : (isBn ? 'পোস্টার নিষ্ক্রিয় করা হয়েছে' : 'Poster deactivated')
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle status');
    }
  };

  const handleToggleReseller = (resellerId: string) => {
    setSelectedResellerIds((prev) =>
      prev.includes(resellerId) ? prev.filter((id) => id !== resellerId) : [...prev, resellerId]
    );
  };

  const handleSelectAllFiltered = (filteredIds: string[]) => {
    setSelectedResellerIds((prev) => {
      const combined = new Set([...prev, ...filteredIds]);
      return Array.from(combined);
    });
  };

  const handleDeselectAll = () => {
    setSelectedResellerIds([]);
  };

  // Determine actual action URL
  const computeFinalActionUrl = () => {
    if (actionType === 'PRODUCT') {
      return `product:${selectedProductId}`;
    }
    if (actionType === 'EXTERNAL_LINK') {
      return customActionUrl.trim() || 'https://mehermart.com';
    }
    return selectedRoute || 'products';
  };

  const handleSaveNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleBn.trim() && !titleEn.trim()) {
      toast.error('Please enter notification title in Bangla or English');
      return;
    }
    if (!posterImage.trim()) {
      toast.error('Please provide a marketing poster image URL');
      return;
    }

    if (targetType === 'SELECTED' && selectedResellerIds.length === 0) {
      toast.error('Please select at least one target reseller');
      return;
    }

    if (targetType === 'INDIVIDUAL' && selectedResellerIds.length !== 1) {
      toast.error('Please select exactly one target reseller');
      return;
    }

    const finalActionUrl = computeFinalActionUrl();

    setIsSubmitting(true);
    try {
      const payload: Partial<MarketingNotification> = {
        title: titleEn.trim() || titleBn.trim(),
        titleBn: titleBn.trim() || titleEn.trim(),
        message: messageEn.trim() || messageBn.trim(),
        messageBn: messageBn.trim() || messageEn.trim(),
        posterImage: posterImage.trim(),
        targetType,
        targetResellerIds: targetType === 'ALL' ? [] : selectedResellerIds,
        badge: badge.trim(),
        badgeBn: badgeBn.trim() || badge.trim(),
        displayType,
        actionType,
        productId: actionType === 'PRODUCT' ? selectedProductId : undefined,
        actionUrl: finalActionUrl,
        actionLabel: actionLabelEn.trim() || 'Sell Now',
        actionLabelBn: actionLabelBn.trim() || actionLabelEn.trim() || 'এখনই সেল করুন',
        priority,
        popupOnLogin: displayType === 'POPUP_ON_LOGIN' || displayType === 'BOTH',
        isActive,
      };

      if (editingNotificationId) {
        const res = await api.adminUpdateNotification(editingNotificationId, payload);
        toast.success(res.message || 'Marketing campaign updated successfully!');
        setEditingNotificationId(null);
      } else {
        const res = await api.adminSendNotification(payload);
        toast.success(res.message || 'Notification broadcasted successfully!');
      }

      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save marketing poster');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this marketing notification/poster?')) return;
    try {
      await api.adminDeleteNotification(id);
      toast.success('Notification removed');
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (editingNotificationId === id) {
        setEditingNotificationId(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete notification');
    }
  };

  const filteredResellers = resellers.filter((r) => {
    const q = resellerSearchQuery.toLowerCase();
    return (
      r.storeName?.toLowerCase().includes(q) ||
      (r as any).ownerName?.toLowerCase().includes(q) ||
      r.whatsappNumber?.includes(q) ||
      r.referralCode?.toLowerCase().includes(q) ||
      r.district?.toLowerCase().includes(q)
    );
  });

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Filtered Table List
  const displayedNotifications = notifications.filter((n) => {
    if (tableFilter === 'ACTIVE') return n.isActive !== false;
    if (tableFilter === 'CAROUSEL') return n.displayType === 'TOP_CAROUSEL' || n.displayType === 'BOTH';
    if (tableFilter === 'POPUP') return n.displayType === 'POPUP_ON_LOGIN' || n.displayType === 'BOTH' || n.popupOnLogin;
    return true;
  });

  const previewTitle = previewLanguage === 'bn' ? (titleBn || titleEn || 'শিরোনাম এখানে দেখা যাবে') : (titleEn || titleBn || 'Notification Title Here');
  const previewMessage = previewLanguage === 'bn' ? (messageBn || messageEn || 'বিস্তারিত নোটিশ ও ক্যাম্পেইন অফার বার্তা এখানে দেখা যাবে...') : (messageEn || messageBn || 'Notification details and promotional offer message will appear here...');
  const previewBadge = previewLanguage === 'bn' ? (badgeBn || badge) : (badge || badgeBn);
  const previewAction = previewLanguage === 'bn' ? (actionLabelBn || actionLabelEn) : (actionLabelEn || actionLabelBn);

  return (
    <div className="space-y-8" id="admin-notifications-manager">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-900/60 via-[#1e1540] to-indigo-950/70 border border-purple-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-600 flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.4)]">
              <Megaphone className="w-7 h-7 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Reseller Engagement Engine
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Full CRUD & Live Links
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
                {isBn ? 'মার্কেটিং নোটিফিকেশন ও পোস্টার কন্ট্রোল হাব' : 'Marketing Notification & Sliding Posters Manager'}
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                {isBn
                  ? 'রিসেলার হাবের উপরের স্লাইডিং পোস্টার এবং লগইন পপআপ নোটিফিকেশন তৈরি, এডিট ও কাস্টম প্রোডাক্ট রিডাইরেক্ট লিংক কনফিগার করুন।'
                  : 'Create, edit and manage top sliding campaign posters and login popup notifications with custom product links & Sell Now CTA buttons.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Broadcast & Edit Form (Left 7 Cols) + Live Phone Simulator (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6" id="poster-editor-form">
          <form onSubmit={handleSaveNotification} className="rounded-3xl p-6 bg-slate-900/80 border border-purple-500/30 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                {editingNotificationId ? (
                  <>
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Edit3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-amber-300">
                        {isBn ? 'পোস্টার / নোটিফিকেশন সম্পাদনা' : 'Edit Campaign Poster'}
                      </h3>
                      <p className="text-xs text-slate-400">Editing ID: {editingNotificationId}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">
                        {isBn ? 'নতুন পোস্টার / নোটিফিকেশন তৈরি করুন' : 'Create & Broadcast Notification'}
                      </h3>
                      <p className="text-xs text-purple-300">
                        {isBn ? 'স্লাইডিং পোস্টার বা লগইন পপআপ' : 'Top Sliding Poster or Login Popup'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {editingNotificationId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{isBn ? 'বাতিল' : 'Cancel Edit'}</span>
                </button>
              )}
            </div>

            {/* 1. Placement / Display Type Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300">
                📌 {isBn ? 'প্রদর্শনের ধরন ও স্থান (Display System)' : 'Display Placement & System'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setDisplayType('TOP_CAROUSEL')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    displayType === 'TOP_CAROUSEL'
                      ? 'bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>{isBn ? 'টপ স্লাইডিং পোস্টার' : 'Top Sliding Poster'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    {isBn ? 'হাবের উপরে একটার পর একটা স্লাইড করবে' : 'Slides one by one in top carousel banner'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDisplayType('POPUP_ON_LOGIN')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    displayType === 'POPUP_ON_LOGIN'
                      ? 'bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <Smartphone className="w-4 h-4 text-pink-400" />
                    <span>{isBn ? 'লগইন পপআপ নোটিফিকেশন' : 'Login Popup Alert'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    {isBn ? 'রিসেলার লগইন করলে স্ক্রিনে পপআপ হবে' : 'Full modal alert pops up when reseller logs in'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDisplayType('BOTH')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    displayType === 'BOTH'
                      ? 'bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>{isBn ? 'উভয় স্থানে (Both)' : 'Both (Poster & Popup)'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    {isBn ? 'টপ স্লাইডার ও লগইন পপআপ দুটিতেই থাকবে' : 'Both top carousel & login popup alert'}
                  </p>
                </button>
              </div>
            </div>

            {/* Quick Template Presets (Only if not editing) */}
            {!editingNotificationId && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  ⚡ {isBn ? 'রেডিমেড ক্যাম্পেইন টেমপ্লেট লোড করুন' : 'Load Ready-made Template Preset'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {POSTER_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center gap-2.5 ${
                        posterImage === preset.url
                          ? 'bg-purple-950/60 border-purple-500/60 text-white shadow-[0_0_15px_rgba(147,51,234,0.2)]'
                          : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-10 h-10 rounded-lg object-cover border border-purple-500/20 shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-bold truncate text-white">{preset.name}</p>
                        <span className="text-[10px] text-amber-400 font-semibold">{preset.badge}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Poster Image URL Input with Instant Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                🖼️ {isBn ? 'মার্কেটিং পোস্টার ইমেজ লিংক (Poster Image URL)' : 'Poster Image URL'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={posterImage}
                  onChange={(e) => setPosterImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or any image URL"
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            {/* 2. Titles (Bengali & English) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  🇧🇩 {isBn ? 'নোটিশ / পোস্টার শিরোনাম (বাংলা)' : 'Title (Bangla)'}
                </label>
                <input
                  type="text"
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  placeholder="যেমন: 🔥 ৫০% বেশি লাভ! মেগা ক্যাম্পেইন"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-300 mb-1">
                  🌐 {isBn ? 'নোটিশ / পোস্টার শিরোনাম (English)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. 2X Profit Mega Campaign"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-semibold"
                />
              </div>
            </div>

            {/* Message Description (Bengali & English) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  🇧🇩 {isBn ? 'অফার ও ক্যাপশন বিস্তারিত (বাংলা)' : 'Message / Details (Bangla)'}
                </label>
                <textarea
                  rows={3}
                  value={messageBn}
                  onChange={(e) => setMessageBn(e.target.value)}
                  placeholder="অফারের বিস্তারিত বিবরণ ও সোশ্যাল মিডিয়ায় পোস্ট করার নির্দেশনা..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-300 mb-1">
                  🌐 {isBn ? 'অফার ও ক্যাপশন বিস্তারিত (English)' : 'Message / Details (English)'}
                </label>
                <textarea
                  rows={3}
                  value={messageEn}
                  onChange={(e) => setMessageEn(e.target.value)}
                  placeholder="Promotional details and social media instructions in English..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>
            </div>

            {/* 3. Action Destination & Custom Redirect Link Setup */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <LinkIcon className="w-4 h-4" />
                  <span>{isBn ? 'অ্যাকশন বাটন ও রিডাইরেক্ট লিংক কনফিগারেশন' : 'Sell Button & Redirect Link Configuration'}</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {isBn ? 'বাটনে ক্লিক করলে কোথায় যাবে' : 'Where clicks will redirect'}
                </span>
              </div>

              {/* Action Type Selector: Specific Product vs Route vs External URL */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActionType('PRODUCT')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    actionType === 'PRODUCT'
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>{isBn ? 'নির্দিষ্ট প্রোডাক্ট' : 'Specific Product'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActionType('ROUTE')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    actionType === 'ROUTE'
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isBn ? 'সিস্টেম ট্যাব / পেজ' : 'Platform Tab'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActionType('EXTERNAL_LINK')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    actionType === 'EXTERNAL_LINK'
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isBn ? 'কাস্টম লিংক / URL' : 'Custom URL'}</span>
                </button>
              </div>

              {/* Dynamic Action Input based on Type */}
              {actionType === 'PRODUCT' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    🏷️ {isBn ? 'প্রোডাক্ট নির্বাচন করুন (ক্লিক করলে সরাসরি এই প্রোডাক্ট সেল/শেয়ার ওপেন হবে)' : 'Select Product to Sell / Promote'}
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} • Wholesale: ৳{p.wholesalePrice} (Suggested Retail: ৳{p.retailPrice})
                      </option>
                    ))}
                  </select>

                  {selectedProduct && (
                    <div className="flex items-center gap-3 p-2.5 bg-purple-950/40 rounded-xl border border-purple-500/20 text-xs">
                      <img
                        src={selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                        alt={selectedProduct.name}
                        className="w-10 h-10 rounded-lg object-cover border border-purple-500/30"
                      />
                      <div className="flex-1 truncate">
                        <p className="font-bold text-white truncate">{selectedProduct.name}</p>
                        <p className="text-[11px] text-emerald-400 font-semibold">
                          পাইকারি রেট: ৳{selectedProduct.wholesalePrice} | লাভ মার্জিন: ~৳{(selectedProduct.retailPrice - selectedProduct.wholesalePrice)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {actionType === 'ROUTE' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    📱 {isBn ? 'সিস্টেম ভিউ বা পেজ সিলেক্ট করুন' : 'Select System View / Tab'}
                  </label>
                  <select
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="products">🛍️ Wholesale Catalog (পাইকারি ক্যাটালগ)</option>
                    <option value="wallet">💰 Profit Wallet & Payouts (প্রফিট ওয়ালেট)</option>
                    <option value="orders">📦 Reseller Orders Hub (অর্ডারস হিস্ট্রি)</option>
                    <option value="academy">🎓 Reseller Academy (প্রশিক্ষণ ও কোর্স)</option>
                    <option value="leaderboard">🏆 Reseller Leaderboard (লিডারবোর্ড)</option>
                    <option value="storefront">🏬 Public Marketplace Store (স্টোরফ্রন্ট)</option>
                  </select>
                </div>
              )}

              {actionType === 'EXTERNAL_LINK' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    🌐 {isBn ? 'কাস্টম ওয়েব লিংক দিন (যেমন: WhatsApp গ্রুপ, ফেসবুক পেজ)' : 'Enter Custom Web URL'}
                  </label>
                  <input
                    type="url"
                    value={customActionUrl}
                    onChange={(e) => setCustomActionUrl(e.target.value)}
                    placeholder="https://chat.whatsapp.com/... or https://facebook.com/..."
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}

              {/* Custom Action Button Label */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    🇧🇩 {isBn ? 'বাটনের নাম (বাংলা)' : 'Button Label (Bangla)'}
                  </label>
                  <input
                    type="text"
                    value={actionLabelBn}
                    onChange={(e) => setActionLabelBn(e.target.value)}
                    placeholder="যেমন: এখনই সেল করুন / প্রোডাক্ট দেখুন"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    🌐 {isBn ? 'বাটনের নাম (English)' : 'Button Label (English)'}
                  </label>
                  <input
                    type="text"
                    value={actionLabelEn}
                    onChange={(e) => setActionLabelEn(e.target.value)}
                    placeholder="e.g. Sell Now / Claim Margin"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Badge & Priority & Active Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  🏷️ {isBn ? 'ব্যাজ ট্যাগ (Badge)' : 'Badge Tag'}
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => {
                    setBadge(e.target.value);
                    setBadgeBn(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  ⚡ {isBn ? 'প্রায়োরিটি লেভেল' : 'Priority'}
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as NotificationPriority)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                >
                  <option value="URGENT">🔥 URGENT (Highest Flash)</option>
                  <option value="HIGH">✨ HIGH (Restock / Hot)</option>
                  <option value="NORMAL">📢 NORMAL (Notice)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  🟢 {isBn ? 'সক্রিয় স্ট্যাটাস' : 'Active Status'}
                </label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <span>{isActive ? (isBn ? 'সক্রিয় (Live)' : 'Active (Live)') : (isBn ? 'নিষ্ক্রিয় (Draft)' : 'Inactive (Draft)')}</span>
                  {isActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
                </button>
              </div>
            </div>

            {/* Target Audience Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                🎯 {isBn ? 'প্রাপক নির্বাচন (Target Audience)' : 'Target Audience'}
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTargetType('ALL');
                    setSelectedResellerIds([]);
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                    targetType === 'ALL'
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>{isBn ? 'সকল রিসেলার' : 'All Resellers'}</span>
                  <span className="text-[10px] opacity-80">({resellers.length} verified)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('SELECTED')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                    targetType === 'SELECTED'
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                  <span>{isBn ? 'সিলেক্টেড রিসেলার' : 'Multiple Select'}</span>
                  <span className="text-[10px] opacity-80">({selectedResellerIds.length} chosen)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('INDIVIDUAL')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                    targetType === 'INDIVIDUAL'
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span>{isBn ? 'একক রিসেলার' : 'Single Reseller'}</span>
                  <span className="text-[10px] opacity-80">(1-on-1 direct)</span>
                </button>
              </div>

              {/* Reseller Selection Box if SELECTED or INDIVIDUAL */}
              {(targetType === 'SELECTED' || targetType === 'INDIVIDUAL') && (
                <div className="rounded-2xl border border-purple-500/30 bg-slate-950/80 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={resellerSearchQuery}
                        onChange={(e) => setResellerSearchQuery(e.target.value)}
                        placeholder={isBn ? 'রিসেলার নাম, শপ বা ফোন নম্বর দিয়ে সার্চ...' : 'Search reseller by store, name, phone...'}
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    {targetType === 'SELECTED' && (
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSelectAllFiltered(filteredResellers.map((r) => r.id))}
                          className="px-2.5 py-2 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded-xl text-[11px] font-bold"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={handleDeselectAll}
                          className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[11px]"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-slate-900">
                    {filteredResellers.map((r) => {
                      const isSelected = selectedResellerIds.includes(r.id);
                      return (
                        <div
                          key={r.id}
                          onClick={() => {
                            if (targetType === 'INDIVIDUAL') {
                              setSelectedResellerIds([r.id]);
                            } else {
                              handleToggleReseller(r.id);
                            }
                          }}
                          className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-purple-950/80 border border-purple-500/40 text-white'
                              : 'hover:bg-slate-900 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                isSelected
                                  ? 'bg-purple-600 border-purple-500 text-white'
                                  : 'border-slate-700 bg-slate-800'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div>
                              <p className="font-bold text-xs">{r.storeName}</p>
                              <p className="text-[10px] text-slate-400">
                                {r.whatsappNumber} • Level {r.level} ({r.district})
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono">
                            {r.referralCode}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Broadcast / Update Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 font-black text-sm rounded-2xl shadow-[0_6px_25px_rgba(251,191,36,0.35)] transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{isBn ? 'সংরক্ষণ করা হচ্ছে...' : 'Saving Marketing Poster...'}</span>
                </>
              ) : editingNotificationId ? (
                <>
                  <CheckCircle2 className="w-5 h-5 fill-slate-950" />
                  <span>{isBn ? 'পোস্টার ও নোটিফিকেশন আপডেট করুন' : 'Update Campaign Poster & Notification'}</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 fill-slate-950" />
                  <span>
                    {targetType === 'ALL'
                      ? (isBn ? `🚀 সকল (${resellers.length}) রিসেলারের কাছে ব্রডকাস্ট করুন` : `🚀 Broadcast to All ${resellers.length} Resellers`)
                      : (isBn ? `🚀 নির্বাচিত (${selectedResellerIds.length}) রিসেলারকে পাঠান` : `🚀 Send to ${selectedResellerIds.length} Selected Reseller(s)`)}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Mobile Phone Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span>{isBn ? 'মোবাইল স্ক্রিন লাইভ প্রিভিউ' : 'Live Phone Screen Simulator'}</span>
            </h3>

            {/* Language preview toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setPreviewLanguage('bn')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  previewLanguage === 'bn' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                🇧🇩 বাংলা
              </button>
              <button
                type="button"
                onClick={() => setPreviewLanguage('en')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  previewLanguage === 'en' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                🌐 English
              </button>
            </div>
          </div>

          {/* Smartphone Frame Simulator */}
          <div className="relative mx-auto w-full max-w-[340px] rounded-[42px] border-[8px] border-slate-800 bg-[#0c0d1a] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden p-3 pt-6">
            {/* Phone Speaker Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-full flex items-center justify-center">
              <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
            </div>

            {/* Mock Mobile Screen Content */}
            <div className="space-y-3 pt-2">
              {/* App Bar Header */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="font-bold text-white">MeherMart Hub</span>
                <span className="text-emerald-400 font-semibold">● Live</span>
              </div>

              {/* Notification Poster Card inside Phone View */}
              <div className="rounded-2xl border border-purple-500/40 bg-slate-900/90 overflow-hidden shadow-lg">
                {/* Poster Image */}
                <div className="relative aspect-[4/3] bg-slate-950">
                  <img
                    src={posterImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[9px] shadow">
                    {previewBadge}
                  </div>
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-purple-900/80 text-purple-200 text-[8px] font-bold border border-purple-500/30">
                    {displayType === 'TOP_CAROUSEL'
                      ? 'Sliding Poster'
                      : displayType === 'POPUP_ON_LOGIN'
                      ? 'Popup on Login'
                      : 'Poster & Popup'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 space-y-2">
                  <h4 className="text-xs font-black text-white leading-snug">
                    {previewTitle}
                  </h4>
                  <p className="text-[10px] text-slate-300 leading-relaxed line-clamp-3">
                    {previewMessage}
                  </p>

                  <div className="pt-1 flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      className="flex-1 py-2 bg-gradient-to-r from-amber-400 via-orange-500 to-purple-600 text-slate-950 text-[10px] font-black rounded-xl shadow flex items-center justify-center gap-1"
                    >
                      <span>{previewAction}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      className="px-2.5 py-2 bg-slate-800 text-slate-200 text-[10px] font-bold rounded-xl border border-slate-700"
                    >
                      {isBn ? 'ক্যাপশন কপি' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mock Dashboard Widgets */}
              <div className="grid grid-cols-2 gap-2 opacity-60">
                <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Available Profit</span>
                  <span className="text-xs font-black text-emerald-400">৳ 24,500</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Active Orders</span>
                  <span className="text-xs font-black text-purple-400">18 Delivered</span>
                </div>
              </div>
            </div>

            {/* Phone Bottom Home Bar */}
            <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-4 mb-1"></div>
          </div>
        </div>
      </div>

      {/* Broadcast & Poster Management Table */}
      <div className="rounded-3xl p-6 bg-slate-900/80 border border-purple-500/20 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>{isBn ? 'সকল পোস্টার ও নোটিফিকেশন ম্যানেজমেন্ট' : 'All Posters & Notifications Management'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isBn
                ? 'এখান থেকে যেকোনো পোস্টার এডিট করুন, অ্যাকশন লিংক পরিবর্তন করুন অথবা সক্রিয়/নিষ্ক্রিয় করুন'
                : 'Edit any campaign, update product redirect links, or toggle active status'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTableFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                tableFilter === 'ALL' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setTableFilter('CAROUSEL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                tableFilter === 'CAROUSEL' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📱 Sliding Posters
            </button>
            <button
              onClick={() => setTableFilter('POPUP')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                tableFilter === 'POPUP' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🔔 Login Popups
            </button>
            <button
              onClick={() => setTableFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                tableFilter === 'ACTIVE' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🟢 Active Live
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Poster</th>
                <th className="py-3 px-3">Title & Destination</th>
                <th className="py-3 px-3">Placement</th>
                <th className="py-3 px-3">Target</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Read Rate</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayedNotifications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No marketing campaigns matching this filter.
                  </td>
                </tr>
              ) : (
                displayedNotifications.map((n) => {
                  const readCount = n.readBy?.length || 0;
                  const totalAudience = n.targetType === 'ALL' ? resellers.length : (n.targetResellerIds?.length || 1);
                  const readPercent = Math.min(100, Math.round((readCount / Math.max(1, totalAudience)) * 100));
                  const isCurrentEditing = editingNotificationId === n.id;
                  const isItemActive = n.isActive !== false;

                  return (
                    <tr
                      key={n.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isCurrentEditing ? 'bg-purple-950/40 border-l-4 border-amber-400' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-purple-500/20 shrink-0">
                          <img
                            src={n.posterImage}
                            alt={n.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {n.badge || 'PROMO'}
                          </span>
                          <span className="text-[10px] text-purple-300 font-semibold truncate">
                            Button: "{n.actionLabelBn || n.actionLabel || 'Sell Now'}"
                          </span>
                        </div>
                        <p className="font-bold text-white text-xs line-clamp-1">{n.titleBn || n.title}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          🔗 Link: <span className="font-mono text-cyan-300">{n.actionUrl || 'products'}</span>
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          n.displayType === 'POPUP_ON_LOGIN' || n.popupOnLogin
                            ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                            : n.displayType === 'BOTH'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {n.displayType === 'POPUP_ON_LOGIN'
                            ? '🔔 Popup on Login'
                            : n.displayType === 'BOTH'
                            ? '⭐ Both (Top & Popup)'
                            : '📱 Top Carousel'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 font-semibold text-slate-300 text-[11px]">
                          {n.targetType === 'ALL'
                            ? '🌐 All'
                            : `👥 ${n.targetResellerIds?.length || 0}`}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleActiveStatus(n)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all flex items-center gap-1 ${
                            isItemActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isItemActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                          <span>{isItemActive ? 'Active' : 'Draft'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${readPercent}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-300 font-bold">
                            {readCount} ({readPercent}%)
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEdit(n)}
                            className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-800 text-purple-200 border border-purple-500/30 transition-all"
                            title="Edit campaign & links"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteNotification(n.id)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-700 transition-all"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
