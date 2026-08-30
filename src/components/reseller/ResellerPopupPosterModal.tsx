import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MarketingNotification } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Sparkles,
  Flame,
  Download,
  Share2,
  Copy,
  ExternalLink,
  CheckCircle2,
  Megaphone,
} from 'lucide-react';

interface ResellerPopupPosterModalProps {
  notification: MarketingNotification | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onNavigateToAction?: (actionUrl: string) => void;
}

export const ResellerPopupPosterModal: React.FC<ResellerPopupPosterModalProps> = ({
  notification,
  isOpen,
  onClose,
  onMarkAsRead,
  onNavigateToAction,
}) => {
  const { isBn } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !notification) return null;

  const title = isBn ? (notification.titleBn || notification.title) : notification.title;
  const message = isBn ? (notification.messageBn || notification.message) : notification.message;
  const badge = isBn ? (notification.badgeBn || notification.badge || '🔥 মেগা ক্যাম্পেইন') : (notification.badge || '🔥 MEGA CAMPAIGN');
  const actionLabel = isBn ? (notification.actionLabelBn || notification.actionLabel || 'এখনই শুরু করুন') : (notification.actionLabel || 'Get Started Now');

  const handleCopyCaption = () => {
    const caption = `🔥 ${title}\n\n${message}\n\n📦 দ্রুত অর্ডার করতে যোগাযোগ করুন!\n✅ ক্যাশ অন ডেলিভারি | ১০০% অরিজিনাল`;
    navigator.clipboard.writeText(caption);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDismiss = () => {
    onMarkAsRead(notification.id);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 pt-3 sm:pt-8 md:pt-12 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: -40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-[#19193d] via-[#101128] to-[#0a0b18] border border-purple-400/50 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.35),0_0_80px_rgba(236,72,153,0.18),0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden my-1 sm:my-auto max-h-[calc(100vh-24px)] flex flex-col"
          id="reseller-popup-poster-modal"
        >
          {/* Animated Ambient Glowing Aura Ring behind modal */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-purple-600/40 to-pink-500/30 rounded-3xl blur-xl animate-pulse -z-10 pointer-events-none" />

          {/* Close button with high-contrast glowing border */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 z-30 p-2 rounded-full bg-slate-900/90 hover:bg-purple-600 text-slate-200 hover:text-white border border-purple-400/40 backdrop-blur-md transition-all shadow-[0_0_15px_rgba(0,0,0,0.6)] hover:scale-105"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Header Banner Tag with glowing gradient & shimmer */}
          <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 px-4 py-2 flex items-center justify-between text-slate-950 font-black text-xs shrink-0 shadow-md">
            <div className="flex items-center gap-1.5 uppercase tracking-wider">
              <Megaphone className="w-4 h-4 fill-slate-950 animate-bounce" />
              <span>{isBn ? 'অফিশিয়াল স্পেশাল ক্যাম্পেইন' : 'Official Special Campaign'}</span>
            </div>
            <span className="bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-amber-400/40 shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
              <span>{badge}</span>
            </span>
          </div>

          {/* Scrollable Container for small screens */}
          <div className="overflow-y-auto flex-1">
            {/* Full Screen Responsive Poster Graphic with hover shimmer */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-slate-950 overflow-hidden group">
              <img
                src={notification.posterImage}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#19193d] via-transparent to-black/30" />

              {/* Glowing Download Button overlay */}
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={() => window.open(notification.posterImage, '_blank')}
                  className="px-3 py-1.5 text-xs font-bold bg-slate-900/90 hover:bg-purple-600 text-white rounded-xl backdrop-blur-md border border-purple-400/40 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all flex items-center gap-1.5 hover:scale-105"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isBn ? 'হাই-রেজুলেশন পোস্টার' : 'Save HD Poster'}</span>
                </button>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                  <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{isBn ? 'হট আর্নিং অফার' : 'Hot Reseller Earning Opportunity'}</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white leading-snug tracking-tight">
                  {title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
                  {message}
                </p>
              </div>

              {/* Quick Reseller Action Buttons with glowing shine */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                {notification.actionUrl && onNavigateToAction && (
                  <button
                    onClick={() => {
                      handleDismiss();
                      onNavigateToAction(notification.actionUrl!);
                    }}
                    className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-amber-400 via-orange-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 font-black text-sm rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:shadow-[0_0_35px_rgba(251,191,36,0.7)] transition-all flex items-center justify-center gap-2 transform active:scale-95 group"
                  >
                    <span>{actionLabel}</span>
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                )}

                <button
                  onClick={handleCopyCaption}
                  className="w-full sm:w-auto py-3 px-4 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-2xl border border-purple-500/30 transition-all flex items-center justify-center gap-2 hover:border-purple-400"
                >
                  {isCopied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">{isBn ? 'ক্যাপশন কপি হয়েছে!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-purple-400" />
                      <span>{isBn ? 'ক্যাপশন কপি করুন' : 'Copy Promo Caption'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Footer dismissal */}
              <div className="text-center pt-1">
                <button
                  onClick={handleDismiss}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline"
                >
                  {isBn ? 'বুঝেছি, নোটিফিকেশন বন্ধ করুন' : 'Got it, dismiss notification'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
