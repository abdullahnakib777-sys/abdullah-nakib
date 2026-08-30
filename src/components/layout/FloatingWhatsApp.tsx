import React, { useState } from 'react';
import { Phone, MapPin, MessageCircle, X, ChevronUp, ExternalLink, ShieldCheck, Sparkles, Share2, Check, Copy, Gift, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const FloatingWhatsApp: React.FC<{
  onOpenPrivacyPolicy?: () => void;
}> = ({ onOpenPrivacyPolicy }) => {
  const { reseller, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const whatsappNumber = '01333855344';
  const whatsappLink = 'https://wa.me/8801333855344';

  const referralCode = reseller?.referralCode;
  const shareUrl = referralCode
    ? `${window.location.origin}/?ref=${encodeURIComponent(referralCode)}`
    : window.location.origin;

  const handleShareApp = async () => {
    const shareData = referralCode
      ? {
          title: `Join MeherMart via ${reseller?.storeName || 'My Referral'}`,
          text: `🚀 Earn ৳20,000 to ৳50,000+ monthly with 0 investment! Sign up on MeherMart with my referral code "${referralCode}" to start reselling today.`,
          url: shareUrl,
        }
      : {
          title: 'MeherMart - Bangladesh #1 Zero Investment Reselling Platform',
          text: '🚀 Earn ৳20,000 to ৳50,000+ monthly from home with 0 investment! Join MeherMart as an entrepreneur today.',
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

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3" id="floating-whatsapp-widget">
      {/* Expanded Quick Contact Card */}
      {isOpen && (
        <div className="w-84 max-w-[calc(100vw-2rem)] galaxy-glass-card-static rounded-3xl p-5 border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.35)] animate-in fade-in slide-in-from-bottom-4 duration-200 text-slate-200">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm text-white flex items-center gap-1.5">
                  <span>MeherMart Support</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h4>
                <p className="text-[10px] text-emerald-300 font-semibold">Active Official Reseller & Customer Care</p>
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
            <div className="p-3 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Warehouse & Head Office:</span>
                  <span className="font-bold text-white">Savar DOHS, Savar, Dhaka-1344</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-purple-950/40 rounded-2xl border border-purple-500/30 space-y-1.5">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">WhatsApp Helpline:</span>
                  <span className="font-bold text-emerald-300 font-mono text-sm">{whatsappNumber}</span>
                </div>
              </div>
            </div>

            {/* Reseller Unique Referral Code Badge (if logged in as Reseller) */}
            {referralCode && (
              <div className="p-3 bg-gradient-to-r from-amber-950/60 via-purple-950/60 to-indigo-950/60 rounded-2xl border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                    <span>Your Unique Referral Code</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-[10px] font-mono font-black text-amber-300">
                    {referralCode}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Earn <strong className="text-emerald-300 font-bold">+250 XP & ৳100 Bonus</strong> when someone registers with your referral link!
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 px-2.5 py-1.5 rounded-lg bg-black/40 border border-purple-500/30 text-[10px] font-mono text-slate-300 truncate">
                    {shareUrl}
                  </div>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] transition cursor-pointer shrink-0"
                    title="Copy Referral Link"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Share App / Invite Resellers Button */}
            <button
              type="button"
              onClick={handleShareApp}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-black text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] transition flex items-center justify-center gap-2 group cursor-pointer border border-purple-400/30"
              title={referralCode ? 'Share Referral Link with code appended' : 'Share app with friends'}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span className="text-emerald-200">{referralCode ? 'Referral Link Copied! ✓' : 'App Link Copied! ✓'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                  <span>{referralCode ? 'Share App (with Referral Link)' : 'Share App / Invite Friends'}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </>
              )}
            </button>

            <a
              href={whatsappLink}
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
                className="w-full text-center text-[11px] text-slate-400 hover:text-cyan-300 hover:underline transition pt-1 cursor-pointer"
              >
                View Privacy Policy & Terms
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-3.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(16,185,129,0.55)] hover:scale-105 transition-all flex items-center gap-2.5 border border-emerald-300/40"
        title="Chat on WhatsApp / Contact Info"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-current text-slate-950" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-slate-950" />
        </div>
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="font-extrabold text-xs text-slate-950">WhatsApp & Support</span>
          <span className="text-[10px] font-bold text-emerald-950 font-mono">01333855344</span>
        </div>
      </button>
    </div>
  );
};
