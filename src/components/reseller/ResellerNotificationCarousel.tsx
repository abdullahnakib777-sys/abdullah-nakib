import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MarketingNotification } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Copy,
  ExternalLink,
  Flame,
  CheckCircle2,
  Clock,
  Eye,
  Megaphone,
  Bell,
} from 'lucide-react';

interface ResellerNotificationCarouselProps {
  notifications: MarketingNotification[];
  resellerId?: string;
  onMarkAsRead?: (id: string) => void;
  onNavigateToAction?: (actionUrl: string) => void;
}

export const ResellerNotificationCarousel: React.FC<ResellerNotificationCarouselProps> = ({
  notifications,
  resellerId,
  onMarkAsRead,
  onNavigateToAction,
}) => {
  const { isBn, t } = useLanguage();
  const toast = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const activeList = notifications.filter((n) => !n.dismissedBy?.includes(resellerId || ''));

  // Auto slide effect every 5 seconds if not paused
  useEffect(() => {
    if (activeList.length <= 1 || isPaused) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeList.length);
    }, 5500);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [activeList.length, isPaused]);

  if (activeList.length === 0) {
    return null;
  }

  const currentItem = activeList[currentIndex] || activeList[0];
  const isUnread = resellerId ? !currentItem.readBy?.includes(resellerId) : true;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeList.length) % activeList.length);
  };

  const handleCopyCaption = (item: MarketingNotification) => {
    const titleText = isBn ? (item.titleBn || item.title) : item.title;
    const msgText = isBn ? (item.messageBn || item.message) : item.message;
    const caption = `🔥 ${titleText}\n\n${msgText}\n\n📦 অর্ডার করতে ইনবক্স করুন অথবা হোয়াটসঅ্যাপে যোগাযোগ করুন!\n✅ ১০০% অরিজিনাল প্রোডাক্ট | ক্যাশ অন ডেলিভারি সুবিধা`;
    
    navigator.clipboard.writeText(caption);
    setCopiedId(item.id);
    toast.success(isBn ? 'মার্কেটিং ক্যাপশন কপি হয়েছে!' : 'Promo caption copied to clipboard!');
    if (onMarkAsRead && resellerId) {
      onMarkAsRead(item.id);
    }
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleShare = (item: MarketingNotification) => {
    const titleText = isBn ? (item.titleBn || item.title) : item.title;
    const shareUrl = window.location.origin;
    if (navigator.share) {
      navigator.share({
        title: titleText,
        text: isBn ? (item.messageBn || item.message) : item.message,
        url: shareUrl,
      }).catch(() => {});
    } else {
      handleCopyCaption(item);
    }
  };

  const handleDownloadPoster = (url: string) => {
    window.open(url, '_blank');
    toast.info(isBn ? 'হাই-রেজুলেশন পোস্টার খোলা হচ্ছে' : 'Opening high-res poster image');
  };

  const title = isBn ? (currentItem.titleBn || currentItem.title) : currentItem.title;
  const message = isBn ? (currentItem.messageBn || currentItem.message) : currentItem.message;
  const badge = isBn ? (currentItem.badgeBn || currentItem.badge || '📢 নোটিশ') : (currentItem.badge || '📢 NOTICE');
  const actionLabel = isBn ? (currentItem.actionLabelBn || currentItem.actionLabel || 'বিস্তারিত দেখুন') : (currentItem.actionLabel || 'View Details');

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-slate-900/90 via-[#111227]/90 to-purple-950/40 shadow-[0_8px_32px_rgba(112,0,255,0.15)] mb-6 backdrop-blur-xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      id="reseller-notification-carousel"
    >
      {/* Top Header Strip */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-purple-950/40 border-b border-purple-500/20 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-purple-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Megaphone className="w-3.5 h-3.5 text-amber-400" />
            {isBn ? 'মার্কেটিং পোস্টার ও ক্যাম্পেইন হাব' : 'Marketing Campaign & Poster Hub'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Slide Indicator counter */}
          <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
            {currentIndex + 1} / {activeList.length}
          </span>
          
          {/* Pause / Live indicator */}
          <span className="text-[10px] text-purple-300 hidden sm:inline-block">
            {isPaused ? (isBn ? '⏸ সাময়িক বিরতি' : '⏸ Paused') : (isBn ? '⚡ অটো-চেঞ্জিং' : '⚡ Auto-changing')}
          </span>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="p-4 sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
          >
            {/* Poster Image (scales responsively for mobile and desktop screens) */}
            <div className="md:col-span-5 relative group overflow-hidden rounded-xl border border-purple-500/30 bg-slate-950 aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] max-h-64 sm:max-h-72 shadow-lg">
              <img
                src={currentItem.posterImage}
                alt={title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

              {/* Priority & Badge Tag */}
              <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 text-[11px] font-extrabold rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-slate-950" />
                  {badge}
                </span>
                {isUnread && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-slate-950 shadow animate-pulse">
                    {isBn ? 'নতুন' : 'NEW'}
                  </span>
                )}
              </div>

              {/* Poster Action Overlay button */}
              <button
                onClick={() => handleDownloadPoster(currentItem.posterImage)}
                className="absolute bottom-2.5 right-2.5 px-2.5 py-1 text-[11px] font-semibold bg-slate-900/90 hover:bg-purple-600 text-white rounded-lg backdrop-blur-md border border-white/10 shadow transition-all flex items-center gap-1.5"
                title={isBn ? 'পোস্টার ডাউনলোড' : 'Download Poster'}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isBn ? 'ডাউনলোড' : 'Download'}</span>
              </button>
            </div>

            {/* Notification Content and Quick Reseller Action Tools */}
            <div className="md:col-span-7 flex flex-col justify-between h-full space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-purple-300/80 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {new Date(currentItem.createdAt).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {currentItem.createdBy && (
                    <span className="text-slate-400">• {currentItem.createdBy}</span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
                  {title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 line-clamp-3">
                  {message}
                </p>
              </div>

              {/* Action Buttons for Reseller */}
              <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Primary CTA (View products, wallet, etc.) */}
                {currentItem.actionUrl && onNavigateToAction && (
                  <button
                    onClick={() => {
                      if (onMarkAsRead && resellerId) onMarkAsRead(currentItem.id);
                      onNavigateToAction(currentItem.actionUrl!);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-[0_4px_16px_rgba(147,51,234,0.4)] transition-all flex items-center gap-2 transform active:scale-95"
                  >
                    <span>{actionLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Copy Caption Button */}
                <button
                  onClick={() => handleCopyCaption(currentItem)}
                  className="px-3 py-2 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                  title={isBn ? 'সোশ্যাল ক্যাপশন কপি করুন' : 'Copy Caption'}
                >
                  {copiedId === currentItem.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{isBn ? 'কপি হয়েছে!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-purple-400" />
                      <span>{isBn ? 'ক্যাপশন কপি' : 'Copy Caption'}</span>
                    </>
                  )}
                </button>

                {/* Share Button */}
                <button
                  onClick={() => handleShare(currentItem)}
                  className="px-3 py-2 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                  title={isBn ? 'সোশ্যাল মিডিয়ায় শেয়ার' : 'Share'}
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isBn ? 'শেয়ার' : 'Share'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation Bar with Carousel Dots and Arrows */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/60 border-t border-purple-500/10">
        {/* Carousel Dots */}
        <div className="flex items-center gap-1.5">
          {activeList.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-gradient-to-r from-amber-400 to-purple-500'
                  : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Carousel Prev / Next Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="p-1 rounded-lg bg-slate-800 hover:bg-purple-900/60 text-slate-300 hover:text-white transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded-lg bg-slate-800 hover:bg-purple-900/60 text-slate-300 hover:text-white transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
