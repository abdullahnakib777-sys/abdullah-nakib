import React, { useState } from 'react';
import { Product, ResellerProfile } from '../../types';
import { Share2, Copy, Check, MessageSquare, Facebook, Send, Download, Sparkles, X, ExternalLink } from 'lucide-react';

export const ShareAndSellModal: React.FC<{
  product: Product | null;
  reseller: ResellerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAiKit?: (product: Product) => void;
}> = ({ product, reseller, isOpen, onClose, onOpenAiKit }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  if (!isOpen || !product) return null;

  const referralCode = reseller?.referralCode || 'RSL-TOP10';
  const shareUrl = `${window.location.origin}/?ref=${referralCode}&product=${product.slug}`;

  const defaultCaption = `🔥 ${product.nameBn || product.name} 🔥\n\n✨ স্পেশাল প্রাইস: মাত্র ৳${product.suggestedSellingPrice}/-\n🚚 সারাদেশে ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন)\n\n👉 অর্ডার করতে ক্লিক করুন: ${shareUrl}\nঅথবা ইনবক্সে নাম, ঠিকানা ও ফোন নাম্বার পাঠান!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(defaultCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(defaultCaption);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleFacebookShare = () => {
    const u = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${u}`, '_blank');
  };

  const profit = product.suggestedSellingPrice - product.resellerPrice;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" id="share-and-sell-modal">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Share & Sell Hub</h3>
              <p className="text-xs text-emerald-100">
                Attribution Code: <span className="font-mono font-bold text-amber-300">{referralCode}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Card Preview */}
          <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <img
              src={product.images[0]}
              alt=""
              className="w-20 h-20 object-cover rounded-xl border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-slate-900 line-clamp-2">{product.name}</h4>
              <div className="flex items-center gap-2 mt-1.5 text-xs">
                <span className="font-bold text-slate-900">Retail: ৳{product.suggestedSellingPrice}</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  Your Profit: ৳{profit} / sale
                </span>
              </div>
            </div>
          </div>

          {/* Direct Share Buttons */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">1-Click Share to Channels</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition"
              >
                <Send className="w-4 h-4" />
                <span>Share to WhatsApp</span>
              </button>
              <button
                onClick={handleFacebookShare}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
              >
                <Facebook className="w-4 h-4" />
                <span>Share to Facebook</span>
              </button>
            </div>
          </div>

          {/* Tracking Link Box */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Your Unique Referral Tracking Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-600"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              When buyers click this link and complete an order, the sale and profit are automatically credited to your wallet.
            </p>
          </div>

          {/* Quick Caption Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">Ready-Made Bangla Sales Caption</label>
              <button
                onClick={handleCopyCaption}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                {copiedCaption ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCaption ? 'Copied!' : 'Copy Caption'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={4}
              value={defaultCaption}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-700 leading-relaxed"
            />
          </div>

          {/* AI Selling Assistant Callout */}
          {onOpenAiKit && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-purple-950">Need more creative Facebook / WhatsApp copy?</h5>
                  <p className="text-[11px] text-purple-700">Generate 5 angles & objection busters with AI</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenAiKit(product);
                }}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                Open AI Kit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
