import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MarketingNotification, NotificationTargetType, NotificationPriority, ResellerProfile } from '../../types';
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
    actionUrl: 'products',
    actionLabel: 'Sell Now',
    actionLabelBn: 'এখনই সেল করুন',
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
    actionUrl: 'products',
    actionLabel: 'View Products',
    actionLabelBn: 'প্রোডাক্ট দেখুন',
    priority: 'HIGH' as NotificationPriority,
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
    actionUrl: 'wallet',
    actionLabel: 'Open Wallet',
    actionLabelBn: 'ওয়ালেট চেক করুন',
    priority: 'NORMAL' as NotificationPriority,
  },
  {
    name: 'Wireless ANC Earbuds Pro Flash Sale',
    url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&auto=format&fit=crop&q=80',
    titleBn: '🎧 আল্ট্রা বাসের ওয়্যারলেস ইয়ারবাডস প্রো ধামাকা অফার',
    titleEn: '🎧 Ultra Bass Wireless Earbuds Pro Super Deal',
    msgBn: 'রিসেলার স্পেশাল রেট মাত্র ৬৫০ টাকা! কাস্টমারের কাছে ১২০০-১৪০০ টাকায় বিক্রি করে প্রতি পিসে ৬০০+ টাকা নেট প্রফিট করুন।',
    msgEn: 'Wholesale price only ৳650! Resell to retail customers at ৳1200-৳1400 with ৳600+ net profit margin per piece.',
    badge: '🎧 BEST SELLER',
    badgeBn: '🎧 বেস্ট সেলার',
    actionUrl: 'products',
    actionLabel: 'Grab Stock',
    actionLabelBn: 'স্টক নিন',
    priority: 'HIGH' as NotificationPriority,
  },
];

export const AdminNotificationsManager: React.FC = () => {
  const toast = useToast();
  const { isBn } = useLanguage();

  const [notifications, setNotifications] = useState<MarketingNotification[]>([]);
  const [resellers, setResellers] = useState<ResellerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [targetType, setTargetType] = useState<NotificationTargetType>('ALL');
  const [selectedResellerIds, setSelectedResellerIds] = useState<string[]>([]);
  const [resellerSearchQuery, setResellerSearchQuery] = useState('');

  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [messageBn, setMessageBn] = useState('');
  const [messageEn, setMessageEn] = useState('');
  const [posterImage, setPosterImage] = useState(POSTER_PRESETS[0].url);
  const [badge, setBadge] = useState('🔥 HOT CAMPAIGN');
  const [badgeBn, setBadgeBn] = useState('🔥 মেগা ক্যাম্পেইন');
  const [priority, setPriority] = useState<NotificationPriority>('HIGH');
  const [actionUrl, setActionUrl] = useState('products');
  const [actionLabelEn, setActionLabelEn] = useState('Sell Now');
  const [actionLabelBn, setActionLabelBn] = useState('এখনই সেল করুন');
  const [popupOnLogin, setPopupOnLogin] = useState(true);

  const [previewLanguage, setPreviewLanguage] = useState<'bn' | 'en'>('bn');

  useEffect(() => {
    loadData();
    // Default form to first preset
    applyPreset(POSTER_PRESETS[0]);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [notifsRes, resellersRes] = await Promise.all([
        api.adminGetNotifications(),
        api.adminGetAllResellers(),
      ]);
      setNotifications(notifsRes.notifications || []);
      setResellers(resellersRes.resellers || []);
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
    setActionUrl(preset.actionUrl);
    setActionLabelEn(preset.actionLabel);
    setActionLabelBn(preset.actionLabelBn);
    setPriority(preset.priority);
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

  const handleSendNotification = async (e: React.FormEvent) => {
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
        badge,
        badgeBn,
        actionUrl,
        actionLabel: actionLabelEn,
        actionLabelBn,
        priority,
        popupOnLogin,
      };

      const res = await api.adminSendNotification(payload);
      toast.success(res.message || 'Notification broadcasted successfully!');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to broadcast notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this marketing notification?')) return;
    try {
      await api.adminDeleteNotification(id);
      toast.success('Notification removed');
      setNotifications((prev) => prev.filter((n) => n.id !== id));
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
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live & Persistent in Hub
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
                {isBn ? 'মার্কেটিং নোটিফিকেশন ও পোস্টার ব্রডকাস্ট হাব' : 'Marketing Notifications & Poster Broadcast Hub'}
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                {isBn
                  ? 'সকল রিসেলারকে একসাথে বা নির্দিষ্ট সিলেক্টেড রিসেলারদের কাছে ইনস্ট্যান্ট মার্কেটিং পোস্টার ও অফার নোটিফিকেশন পাঠান। তাদের ফোন স্ক্রিনে অটো-চেঞ্জিং পোস্টার হিসেবে প্রদর্শিত হবে।'
                  : 'Broadcast high-impact marketing poster banners and targeted notifications to all resellers or selected individuals. Auto-adapts to mobile screens and saves in their hub.'}
              </p>
            </div>
          </div>

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

      {/* Main Grid: Broadcast Form (Left 7 Cols) + Live Phone Simulator (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSendNotification} className="rounded-3xl p-6 bg-slate-900/80 border border-purple-500/30 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-400" />
                <span>{isBn ? 'নতুন পোস্টার নোটিফিকেশন তৈরি করুন' : 'Create & Broadcast Notification'}</span>
              </h3>
              <span className="text-xs font-semibold text-purple-300">
                {isBn ? 'দ্বিভাষিক (বাংলা ও ইংরেজি)' : 'Bilingual Support (BN & EN)'}
              </span>
            </div>

            {/* Quick Template Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                ⚡ {isBn ? 'রেডিমেড ক্যাম্পেইন টেমপ্লেট নির্বাচন করুন' : 'Select Ready-made Preset Template'}
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
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleSelectAllFiltered(filteredResellers.map((r) => r.id))}
                          className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 text-[11px] font-bold rounded-xl border border-slate-700"
                        >
                          {isBn ? 'সব সিলেক্ট' : 'Select All'}
                        </button>
                        <button
                          type="button"
                          onClick={handleDeselectAll}
                          className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px] font-bold rounded-xl border border-slate-700"
                        >
                          {isBn ? 'মুছুন' : 'Clear'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                    {filteredResellers.length === 0 ? (
                      <p className="text-center py-4 text-xs text-slate-500">
                        {isBn ? 'কোন রিসেলার পাওয়া যায়নি' : 'No resellers matching query'}
                      </p>
                    ) : (
                      filteredResellers.map((r) => {
                        const isChecked = selectedResellerIds.includes(r.id);
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
                            className={`p-2 rounded-xl border cursor-pointer text-xs flex items-center justify-between transition-all ${
                              isChecked
                                ? 'bg-purple-950/60 border-purple-500 text-white'
                                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type={targetType === 'INDIVIDUAL' ? 'radio' : 'checkbox'}
                                checked={isChecked}
                                onChange={() => {}}
                                className="text-purple-600 rounded bg-slate-950 border-slate-700"
                              />
                              <div>
                                <span className="font-bold text-white">{r.storeName}</span>
                                <span className="text-slate-400 ml-1.5 text-[11px]">({r.whatsappNumber || (r as any).phone})</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-purple-300">
                              Lvl {r.level || 1} • {r.district || 'BD'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Poster Image URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                🖼️ {isBn ? 'মার্কেটিং পোস্টার ইমেজ URL' : 'Marketing Poster Image URL'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={posterImage}
                  onChange={(e) => setPosterImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or cloud image URL"
                  required
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Title (Bengali & English) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  🇧🇩 {isBn ? 'নোটিশ শিরোনাম (বাংলা)' : 'Title (Bangla)'} *
                </label>
                <input
                  type="text"
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  placeholder="যেমন: 🔥 ৫০% বেশি লাভ! মেগা অফার"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-300 mb-1">
                  🌐 {isBn ? 'নোটিশ শিরোনাম (English)' : 'Title (English)'}
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

            {/* Badge & Priority & Action Button */}
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
                  🔗 {isBn ? 'ক্লিক অ্যাকশন লিংক' : 'Action Destination'}
                </label>
                <select
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                >
                  <option value="products">🛍️ Product Catalog (প্রোডাক্টস)</option>
                  <option value="wallet">💰 Profit Wallet (ওয়ালেট)</option>
                  <option value="orders">📦 Orders Hub (অর্ডারস)</option>
                  <option value="academy">🎓 Academy (একাডেমি)</option>
                  <option value="storefront">🏬 Storefront (মার্কেটপ্লেস)</option>
                </select>
              </div>
            </div>

            {/* Auto Popup on Login Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20">
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>{isBn ? 'রিসেলার লগইন করলে স্বয়ংক্রিয় পপআপ দেখান' : 'Auto-Popup on Reseller Login'}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isBn
                    ? 'রিসেলার অ্যাপ বা হাব ওপেন করার সাথে সাথে মোবাইল স্ক্রিনে পুরো পোস্টার পপআপ হিসেবে আসবে'
                    : 'Shows full-screen marketing modal as soon as the targeted reseller opens their hub'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={popupOnLogin}
                  onChange={(e) => setPopupOnLogin(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Broadcast Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 font-black text-sm rounded-2xl shadow-[0_6px_25px_rgba(251,191,36,0.35)] transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{isBn ? 'নোটিফিকেশন পাঠানো হচ্ছে...' : 'Broadcasting Poster Notification...'}</span>
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
                  {popupOnLogin && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-purple-900/80 text-purple-200 text-[8px] font-bold border border-purple-500/30">
                      Popup Alert
                    </div>
                  )}
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
                      className="flex-1 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold rounded-lg shadow"
                    >
                      {previewAction}
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1.5 bg-slate-800 text-slate-200 text-[10px] font-bold rounded-lg border border-slate-700"
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

      {/* Broadcast History Table */}
      <div className="rounded-3xl p-6 bg-slate-900/80 border border-purple-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>{isBn ? 'সম্প্রচারিত নোটিফিকেশন হিস্ট্রি' : 'Broadcasted Notifications History'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isBn
                ? 'পূর্বে প্রেরিত সকল পোস্টার, প্রাপক সংখ্যা ও রিসেলারদের পড়ার স্ট্যাটাস'
                : 'Manage past campaigns, view read metrics and remove expired posters'}
            </p>
          </div>
          <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-slate-300">
            {notifications.length} {isBn ? 'টি নোটিফিকেশন' : 'Total Campaigns'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Poster</th>
                <th className="py-3 px-3">Title & Message</th>
                <th className="py-3 px-3">Target Audience</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Read Rate</th>
                <th className="py-3 px-3">Sent At</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No marketing notifications broadcasted yet.
                  </td>
                </tr>
              ) : (
                notifications.map((n) => {
                  const readCount = n.readBy?.length || 0;
                  const totalAudience = n.targetType === 'ALL' ? resellers.length : (n.targetResellerIds?.length || 1);
                  const readPercent = Math.min(100, Math.round((readCount / Math.max(1, totalAudience)) * 100));

                  return (
                    <tr key={n.id} className="hover:bg-slate-800/30 transition-colors">
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
                        </div>
                        <p className="font-bold text-white text-xs line-clamp-1">{n.titleBn || n.title}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{n.messageBn || n.message}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 font-semibold text-slate-300 text-[11px]">
                          {n.targetType === 'ALL'
                            ? '🌐 All Resellers'
                            : `👥 ${n.targetResellerIds?.length || 0} Resellers`}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          n.priority === 'URGENT'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : n.priority === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {n.priority}
                        </span>
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
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {new Date(n.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteNotification(n.id)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-700 transition-all"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
