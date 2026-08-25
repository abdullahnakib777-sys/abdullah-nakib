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
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/40 hover:bg-slate-900/60 text-white backdrop-blur-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left Gallery */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between space-y-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs relative">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isTrending && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold shadow-md flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
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
                      activeImageIdx === idx ? 'border-emerald-600 shadow-sm' : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Assurance badges */}
            <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Next-day courier dispatch (Steadfast / Pathao / RedX)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Verified QC before dispatch • Zero return risk on defective items</span>
              </div>
            </div>
          </div>

          {/* Right Product Specs & Reseller Box */}
          <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {product.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{product.name}</h2>
                {product.nameBn && (
                  <p className="text-sm font-medium text-slate-600 mt-0.5">{product.nameBn}</p>
                )}
              </div>

              {/* Pricing Cards */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Retail Customer Price</span>
                  <div className="flex items-center gap-2">
                    {product.oldPrice && product.oldPrice > product.suggestedSellingPrice && (
                      <span className="text-sm text-slate-400 line-through font-medium">৳{product.oldPrice}</span>
                    )}
                    <span className="text-2xl font-black text-slate-900">৳{product.suggestedSellingPrice}</span>
                    {(product.discountAmount || (product.oldPrice && product.oldPrice > product.suggestedSellingPrice)) && (
                      <span className="text-xs font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">
                        ৳{product.discountAmount || (product.oldPrice! - product.suggestedSellingPrice)} ছাড়
                      </span>
                    )}
                  </div>
                </div>

                {isReseller ? (
                  <>
                    <div className="flex items-baseline justify-between border-t border-slate-200 pt-2">
                      <span className="text-xs text-slate-500">Your Reseller Wholesale Price:</span>
                      <span className="text-lg font-black text-indigo-700">৳{product.resellerPrice}</span>
                    </div>
                    <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl flex items-center justify-between font-bold text-xs">
                      <span>Potential Profit:</span>
                      <span className="text-sm">৳{profit} / item ({((profit / product.suggestedSellingPrice) * 100).toFixed(0)}% margin)</span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-500">
                    Pay on delivery across all 64 districts in Bangladesh with standard cash on delivery.
                  </p>
                )}
              </div>

              {/* Description & Features */}
              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>{product.description}</p>
                <div className="space-y-1 pt-2">
                  <h4 className="font-bold text-slate-800">Highlights:</h4>
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              {isReseller ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenManualOrder) onOpenManualOrder(product);
                    }}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Sell & Order Now</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenShareModal) onOpenShareModal(product);
                    }}
                    className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share & Sell Link</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenAiKit) onOpenAiKit(product);
                    }}
                    className="col-span-2 py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Generate AI Facebook / WhatsApp Copy</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    addToCart(product, 1);
                    onClose();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
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
