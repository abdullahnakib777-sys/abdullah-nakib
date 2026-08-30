import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MarketingNotification } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import {
  X,
  Bell,
  CheckCircle2,
  Download,
  Copy,
  ExternalLink,
  Flame,
  Sparkles,
  Filter,
  Megaphone,
  Check,
} from 'lucide-react';

interface ResellerNotificationsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: MarketingNotification[];
  resellerId?: string;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigateToAction?: (actionUrl: string) => void;
}

export const ResellerNotificationsHubModal: React.FC<ResellerNotificationsHubModalProps> = ({
  isOpen,
  onClose,
  notifications,
  resellerId,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateToAction,
}) => {
  const { isBn, t } = useLanguage();
  const toast = useToast();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'CAMPAIGNS'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = notifications.filter((item) => {
    const isUnread = resellerId ? !item.readBy?.includes(resellerId) : false;
    if (activeFilter === 'UNREAD') return isUnread;
    if (activeFilter === 'CAMPAIGNS') return item.priority === 'URGENT' || item.priority === 'HIGH';
    return true;
  });

  const unreadCount = notifications.filter(
    (n) => !resellerId || !n.readBy || !n.readBy.includes(resellerId)
  ).length;

  const handleCopy = (item: MarketingNotification) => {
    const titleText = isBn ? (item.titleBn || item.title) : item.title;
    const msgText = isBn ? (item.messageBn || item.message) : item.message;
    const caption = `🔥 ${titleText}\n\n${msgText}\n\n📦 অর্ডার করতে যোগাযোগ করুন!\n✅ ১০০% অরিজিনাল কোয়ালিটি | ক্যাশ অন ডেলিভারি`;

    navigator.clipboard.writeText(caption);
    setCopiedId(item.id);
    toast.success(isBn ? 'ক্যাপশন কপি হয়েছে!' : 'Caption copied!');
    if (onMarkAsRead && resellerId) onMarkAsRead(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#151630] to-[#0d0e1c] border border-purple-500/30 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden my-auto max-h-[90vh] flex flex-col"
          id="reseller-notifications-hub-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-purple-950/40 border-b border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>{isBn ? 'নোটিফিকেশন ও মার্কেটিং পোস্টার' : 'Notifications & Promo Posters'}</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-black bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950 rounded-full">
                      {unreadCount} {isBn ? 'নতুন' : 'New'}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400">
                  {isBn
                    ? 'অ্যাডমিন থেকে পাঠানো সকল অফার, পোস্টার ও জরুরি নোটিশ'
                    : 'Official campaign posters and announcements saved in your hub'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar & Mark All Read */}
          <div className="px-5 py-3 bg-slate-950/40 border-b border-purple-500/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeFilter === 'ALL'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isBn ? 'সকল নোটিশ' : 'All'} ({notifications.length})
              </button>
              <button
                onClick={() => setActiveFilter('UNREAD')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeFilter === 'UNREAD'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isBn ? 'নতুন / অপঠিত' : 'Unread'} ({unreadCount})
              </button>
              <button
                onClick={() => setActiveFilter('CAMPAIGNS')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeFilter === 'CAMPAIGNS'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isBn ? '🔥 মেগা ক্যাম্পেইন' : '🔥 Campaigns'}
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs font-semibold text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isBn ? 'সব পড়া হয়েছে মার্ক করুন' : 'Mark all as read'}</span>
              </button>
            )}
          </div>

          {/* Notification List Scrollable Area */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Megaphone className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-60" />
                <p className="text-sm font-semibold">{isBn ? 'কোন নোটিফিকেশন পাওয়া যায়নি' : 'No notifications found'}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn ? 'অ্যাডমিন থেকে নতুন নোটিশ পাঠালে এখানে দেখতে পাবেন' : 'New notifications will appear here'}
                </p>
              </div>
            ) : (
              filtered.map((item) => {
                const isUnread = resellerId ? !item.readBy?.includes(resellerId) : false;
                const title = isBn ? (item.titleBn || item.title) : item.title;
                const message = isBn ? (item.messageBn || item.message) : item.message;
                const badge = isBn ? (item.badgeBn || item.badge || '📢 নোটিশ') : (item.badge || '📢 NOTICE');
                const actionLabel = isBn ? (item.actionLabelBn || item.actionLabel || 'দেখুন') : (item.actionLabel || 'View');

                return (
                  <div
                    key={item.id}
                    className={`relative rounded-2xl border transition-all p-4 ${
                      isUnread
                        ? 'bg-purple-950/30 border-purple-500/40 shadow-[0_4px_20px_rgba(112,0,255,0.1)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-purple-500/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Thumbnail Poster */}
                      <div className="sm:w-36 h-36 sm:h-28 rounded-xl overflow-hidden bg-slate-950 border border-purple-500/20 shrink-0 relative group">
                        <img
                          src={item.posterImage}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          onClick={() => window.open(item.posterImage, '_blank')}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          {isBn ? 'ডাউনলোড' : 'HD Poster'}
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950">
                              {badge}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(item.createdAt).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                            {title}
                          </h4>
                          <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                            {message}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {item.actionUrl && onNavigateToAction && (
                            <button
                              onClick={() => {
                                if (onMarkAsRead && resellerId) onMarkAsRead(item.id);
                                onClose();
                                onNavigateToAction(item.actionUrl!);
                              }}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                            >
                              <span>{actionLabel}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}

                          <button
                            onClick={() => handleCopy(item)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-1"
                          >
                            {copiedId === item.id ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">{isBn ? 'কপি হয়েছে' : 'Copied'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-purple-400" />
                                <span>{isBn ? 'ক্যাপশন' : 'Caption'}</span>
                              </>
                            )}
                          </button>

                          {isUnread && onMarkAsRead && (
                            <button
                              onClick={() => onMarkAsRead(item.id)}
                              className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 text-xs rounded-lg transition-all"
                            >
                              {isBn ? 'পড়া হয়েছে' : 'Mark Read'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
