import React, { useState } from 'react';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  ShoppingBag,
  Share2,
  Sparkles,
  Truck,
  ShieldCheck,
  CheckCircle2,
  X,
  Package,
  Layers,
  Flame,
  ArrowRight,
} from 'lucide-react';

export const ProductDetailModal: React.FC<{
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenManualOrder?: (product: Product) => void;
  onOpenShareModal?: (product: Product) => void;
  onOpenAiKit?: (product: Product) => void;
}> = ({
  product,
  isOpen,
  onClose,
  onOpenManualOrder,
  onOpenShareModal,
  onOpenAiKit,
}) => {
  const { user, reseller } = useAuth();
  const { addToCart } = useCart();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!isOpen || !product) return null;

  const isReseller = user?.role === 'RESELLER' || user?.role === 'ADMIN';
  const profit = product.suggestedSellingPrice - product.resellerPrice;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" id="product-detail-modal">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-3xl galaxy-glass-card-static rounded-3xl shadow-[0_0_60px_rgba(139,92,246,0.35)] overflow-hidden border border-purple-500/40 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-slate-200 backdrop-blur-md transition shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left Gallery */}
          <div className="p-6 bg-[#0c0a1a]/80 flex flex-col justify-between space-y-4 border-b md:border-b-0 md:border-r border-purple-500/25">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-900/80 border border-purple-500/30 shadow-inner relative">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isTrending && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-[0_0_12px_rgba(244,63,94,0.6)] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current text-amber-300" />
                  <span>Trending in BD</span>
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                      activeImageIdx === idx ? 'border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'border-purple-500/30 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Assurance badges */}
            <div className="p-3.5 galaxy-glass rounded-2xl border border-purple-500/30 text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Next-day courier dispatch (Steadfast / Pathao / RedX)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified QC before dispatch • Zero return risk on defective items</span>
              </div>
            </div>
          </div>

          {/* Right Product Specs & Reseller Box */}
          <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between bg-[#110e24]/70">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 bg-purple-900/60 border border-purple-500/40 px-2.5 py-1 rounded-md">
                  {product.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-2">{product.name}</h2>
                {product.nameBn && (
                  <p className="text-sm font-medium text-slate-300 mt-0.5">{product.nameBn}</p>
                )}
              </div>

              {/* Pricing Cards */}
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Retail Customer Price</span>
                  <div className="flex items-center gap-2">
                    {product.oldPrice && product.oldPrice > product.suggestedSellingPrice && (
                      <span className="text-sm text-slate-500 line-through font-medium">৳{product.oldPrice}</span>
                    )}
                    <span className="text-2xl font-black text-cyan-300">৳{product.suggestedSellingPrice}</span>
                    {(product.discountAmount || (product.oldPrice && product.oldPrice > product.suggestedSellingPrice)) && (
                      <span className="text-xs font-black text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded-md">
                        ৳{product.discountAmount || (product.oldPrice! - product.suggestedSellingPrice)} ছাড়
                      </span>
                    )}
                  </div>
                </div>

                {isReseller ? (
                  <>
                    <div className="flex items-baseline justify-between border-t border-purple-500/20 pt-2">
                      <span className="text-xs text-slate-400">Your Reseller Wholesale Price:</span>
                      <span className="text-lg font-black text-emerald-400">৳{product.resellerPrice}</span>
                    </div>
                    <div className="p-2.5 bg-emerald-950/60 text-emerald-200 border border-emerald-500/30 rounded-xl flex items-center justify-between font-bold text-xs">
                      <span>Potential Profit:</span>
                      <span className="text-sm text-cyan-300 font-black">৳{profit} / item ({((profit / product.suggestedSellingPrice) * 100).toFixed(0)}% margin)</span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-400">
                    Pay on delivery across all 64 districts in Bangladesh with standard cash on delivery.
                  </p>
                )}
              </div>

              {/* Description & Features */}
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>{product.description}</p>
                <div className="space-y-1.5 pt-2">
                  <h4 className="font-bold text-white">Highlights:</h4>
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-purple-500/20">
              {isReseller ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenManualOrder) onOpenManualOrder(product);
                    }}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Sell & Order Now</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenShareModal) onOpenShareModal(product);
                    }}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(147,51,234,0.4)] transition flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share & Sell Link</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenAiKit) onOpenAiKit(product);
                    }}
                    className="col-span-2 py-2.5 px-4 rounded-xl bg-purple-950/60 hover:bg-purple-900/70 text-cyan-300 border border-purple-500/40 font-bold text-xs transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span>Generate AI Facebook / WhatsApp Copy</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    addToCart(product, 1);
                    onClose();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.5)] transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart (৳{product.suggestedSellingPrice})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
