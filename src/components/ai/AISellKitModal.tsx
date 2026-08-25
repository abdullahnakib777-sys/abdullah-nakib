import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { api } from '../../services/api';
import { Sparkles, Copy, Check, Share2, X, MessageSquare, Facebook, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AISellKitModal: React.FC<{
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenShareModal?: (product: Product) => void;
}> = ({ product, isOpen, onClose, onOpenShareModal }) => {
  const [kit, setKit] = useState<{
    facebookCaption: string;
    whatsappPitch: string;
    bulletBenefits: string[];
    objectionHandling: { objection: string; response: string }[];
    marketingAngles: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      setIsLoading(true);
      api
        .generateSellingKit(product.id)
        .then((res) => {
          setKit(res.kit);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, product]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" id="ai-sell-kit-modal">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">AI Selling Assistant</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold">
                  Instant Sales Kit
                </span>
              </div>
              <p className="text-xs text-purple-100">
                Grounded copy for Facebook, WhatsApp & Marketplace for {product.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
              <p className="text-slate-700 font-semibold text-sm">
                Generating high-converting Bangla Facebook & WhatsApp copy...
              </p>
              <p className="text-xs text-slate-400">Analyzing product specs, target hooks & pricing</p>
            </div>
          ) : kit ? (
            <>
              {/* Product mini banner */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <img
                  src={product.images[0]}
                  alt=""
                  className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-slate-500">Wholesale: ৳{product.resellerPrice}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-900 font-bold">Suggested: ৳{product.suggestedSellingPrice}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      Profit: ৳{product.suggestedSellingPrice - product.resellerPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Facebook Caption Box */}
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span>Facebook Post / Marketplace Caption</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(kit.facebookCaption, 'fb')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs transition"
                  >
                    {copiedKey === 'fb' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Caption</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {kit.facebookCaption}
                </div>
              </div>

              {/* WhatsApp Pitch */}
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <Send className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp / Direct Message Close Pitch</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(kit.whatsappPitch, 'wa')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs transition"
                  >
                    {copiedKey === 'wa' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Pitch</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {kit.whatsappPitch}
                </div>
              </div>

              {/* Objection Handling */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Customer Objection Busters</span>
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {kit.objectionHandling.map((item, idx) => (
                    <div key={idx} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs space-y-1">
                      <p className="font-bold text-indigo-950">❓ "{item.objection}"</p>
                      <p className="text-slate-600">{item.response}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
          >
            Close
          </button>
          {onOpenShareModal && product && (
            <button
              onClick={() => {
                onClose();
                onOpenShareModal(product);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Open Share & Sell Hub</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
