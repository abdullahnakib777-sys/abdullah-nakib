import React, { useState } from 'react';
import { Phone, MapPin, MessageCircle, X, ExternalLink, ShieldCheck, Sparkles, Share2, Check, Copy, Gift, Award, Send, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const FloatingWhatsApp: React.FC<{
  onOpenPrivacyPolicy?: () => void;
}> = ({ onOpenPrivacyPolicy }) => {
  const { reseller, user } = useAuth();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const whatsappNumber = '01333855344';
  
  // Reseller Referral Code extraction
  const referralCode = reseller?.referralCode;
  const storeName = reseller?.storeName || user?.name || 'MeherMart Reseller';
  
  // Construct URL with referral code appended if logged in as reseller
  const shareUrl = referralCode
    ? `${window.location.origin}/?ref=${encodeURIComponent(referralCode)}`
    : window.location.origin;

  // Pre-formatted viral invite message in Bangla and English
  const viralShareText = referralCode
    ? `🔥 ঘরে বসেই মাসে ২০,০০০ থেকে ৫০,০০০+ টাকা ইনকাম করুন জিরো ইনভেস্টমেন্টে!\n\n✨ মেহেরমার্ট (MeherMart) বাংলাদেশের শীর্ষ ড্রপশিপিং ও পাইকারি রিসেলিং প্ল্যাটফর্ম।\n\n🎁 আমার স্পনসর রেফারেল কোড: "${referralCode}" ব্যবহার করে আজই ফ্রিতে রেজিস্ট্রেশন করে +250 XP এবং স্পেশাল ৳100 বোনাস রিওয়ার্ড লুফে নিন!\n\n👉 জয়েন করতে ক্লিক করুন:\n${shareUrl}`
    : `🔥 ঘরে বসেই মাসে ২০,০০০ থেকে ৫০,০০০+ টাকা ইনকাম করুন জিরো ইনভেস্টমেন্টে!\n\n✨ মেহেরমার্ট (MeherMart) বাংলাদেশের শীর্ষ পাইকারি রিসেলিং প্ল্যাটফর্ম।\n\n👉 এখনই ফ্রি একাউন্ট খুলে ব্যবসা শুরু করুন:\n${shareUrl}`;

  // WhatsApp Support chat link with reseller credentials pre-filled if logged in
  const supportInquiryText = referralCode
    ? `হ্যালো মেহেরমার্ট সাপোর্ট! আমি রিসেলার ${storeName} (রেফারেল কোড: ${referralCode}, ফোন: ${user?.phone || 'N/A'})। আমার কিছু সহযোগিতা প্রয়োজন:`
    : `হ্যালো মেহেরমার্ট সাপোর্ট টিম! আমি মেহেরমার্ট প্ল্যাটফর্ম সম্পর্কে কিছু জানতে চাই:`;

  const whatsappSupportUrl = `https://wa.me/8801333855344?text=${encodeURIComponent(supportInquiryText)}`;

  const handleShareApp = async () => {
    const shareData = {
      title: referralCode ? `Join MeherMart via ${storeName} (Referral: ${referralCode})` : 'MeherMart - Zero Investment Reselling Platform',
      text: viralShareText,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(viralShareText);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  const handleFacebookShare = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
  };

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.show(
        referralCode
          ? `Unique referral link (${referralCode}) copied to clipboard!`
          : 'MeherMart link copied to clipboard!',
        'success'
      );
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3" id="floating-whatsapp-widget">
      {/* Expanded Quick Contact & Share Card */}
      {isOpen && (
        <div className="w-88 max-w-[calc(100vw-2rem)] galaxy-glass-card-static rounded-3xl p-5 border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.35)] animate-in fade-in slide-in-from-bottom-4 duration-200 text-slate-200">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm text-white flex items-center gap-1.5">
                  <span>MeherMart WhatsApp & Hub</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h4>
                <p className="text-[10px] text-emerald-300 font-semibold">Live Reseller Care & Referral Engine</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-950/40 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Reseller Unique Referral Code Card (if logged in as Reseller) */}
            {referralCode ? (
              <div className="p-3.5 bg-gradient-to-r from-amber-950/70 via-purple-950/70 to-indigo-950/70 rounded-2xl border border-amber-500/50 space-y-2.5 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-400 animate-bounce" />
                    <span>Your Unique Referral Sponsor Link</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/60 text-[11px] font-mono font-black text-amber-300">
                    {referralCode}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-300 leading-tight">
                  Share your link: When new entrepreneurs register, you automatically earn <strong className="text-emerald-300 font-bold">+250 XP & ৳100 Sponsor Bonus</strong>!
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 px-2.5 py-1.5 rounded-xl bg-black/50 border border-purple-500/40 text-[10px] font-mono text-cyan-300 truncate select-all">
                    {shareUrl}
                  </div>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer shrink-0 shadow-sm"
                    title="Copy Referral Link"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* 1-Click Multi-Channel Share Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    title="Send via WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Share on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFacebookShare}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    title="Share on Facebook"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Non-reseller or Guest share invite */
              <div className="p-3 bg-gradient-to-r from-purple-950/60 to-indigo-950/60 rounded-2xl border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Invite Friends & Earn</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Share MeherMart with your network to unlock dropshipping supplies and business wholesale pricing.
                </p>
                <button
                  type="button"
                  onClick={handleShareApp}
                  className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{isCopied ? 'Link Copied! ✓' : 'Share MeherMart Platform'}</span>
                </button>
              </div>
            )}

            {/* Official Head Office Address */}
            <div className="p-2.5 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 space-y-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Warehouse & Head Office:</span>
                  <span className="font-bold text-white text-[11px]">Savar DOHS, Savar, Dhaka-1344</span>
                </div>
              </div>
            </div>

            {/* Helpline Phone */}
            <div className="p-2.5 bg-purple-950/40 rounded-2xl border border-purple-500/30 space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Official Helpline / WhatsApp:</span>
                  <span className="font-bold text-emerald-300 font-mono text-xs">{whatsappNumber}</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Live Chat */}
            <a
              href={whatsappSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-slate-950 fill-current" />
              <span>Start WhatsApp Live Chat</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {onOpenPrivacyPolicy && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenPrivacyPolicy();
                }}
                className="w-full text-center text-[10.5px] text-slate-400 hover:text-cyan-300 hover:underline transition pt-0.5 cursor-pointer"
              >
                View Privacy Policy & Terms of Service
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-3.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(16,185,129,0.55)] hover:scale-105 transition-all flex items-center gap-2.5 border border-emerald-300/40 cursor-pointer"
        title="Chat on WhatsApp / Share Referral"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-current text-slate-950" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-slate-950" />
        </div>
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="font-extrabold text-xs text-slate-950">WhatsApp & Share</span>
          <span className="text-[10px] font-bold text-emerald-950 font-mono">{whatsappNumber}</span>
        </div>
      </button>
    </div>
  );
};
