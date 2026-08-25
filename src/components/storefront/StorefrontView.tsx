import React, { useState } from 'react';
import { Product, ProductCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { EarningsCalculator } from './EarningsCalculator';
import {
  ShoppingBag,
  Share2,
  Sparkles,
  Flame,
  Search,
  Truck,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Layers,
  CheckCircle2,
  Store,
} from 'lucide-react';

export const StorefrontView: React.FC<{
  products: Product[];
  categories: ProductCategory[];
  onOpenProductDetail: (product: Product) => void;
  onOpenManualOrder: (product: Product) => void;
  onOpenShareModal: (product: Product) => void;
  onOpenAiKit: (product: Product) => void;
  onOpenBecomeReseller: () => void;
  onNavigateTab: (tab: string) => void;
}> = ({
  products,
  categories,
  onOpenProductDetail,
  onOpenManualOrder,
  onOpenShareModal,
  onOpenAiKit,
  onOpenBecomeReseller,
  onNavigateTab,
}) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrending, setFilterTrending] = useState(false);

  const isResellerOrAdmin = user?.role === 'RESELLER' || user?.role === 'ADMIN';

  const filtered = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory && p.category !== selectedCategory) {
      return false;
    }
    if (filterTrending && !p.isTrending) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.nameBn.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-12" id="storefront-view">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-indigo-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-bold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Bangladesh's #1 Reselling Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Start Your Online Business with{' '}
            <span className="text-amber-300">0 Taka Investment</span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Sell 500+ trending products from factory warehouses. We handle packaging, courier dispatch (Steadfast/Pathao), and Cash-on-Delivery nationwide. You keep 100% of your profit!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!isResellerOrAdmin ? (
              <button
                onClick={onOpenBecomeReseller}
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition shadow-lg flex items-center gap-2 group"
              >
                <span>Become a Reseller</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => onNavigateTab('reseller_hub')}
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition shadow-lg flex items-center gap-2 group"
              >
                <span>Open Reseller Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <button
              onClick={() => {
                const el = document.getElementById('earnings-calculator');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md transition border border-white/20"
            >
              Calculate Your Profit ৳
            </button>
          </div>
        </div>
      </div>

      {/* 4-Step Process Section */}
      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <p className="text-xs uppercase tracking-wider text-emerald-700 font-bold">Simple 4-Step Model</p>
          <h2 className="text-2xl font-black text-slate-900">How Shadhin Reseller Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
              01
            </div>
            <h3 className="font-bold text-sm text-slate-900">Select Factory Product</h3>
            <p className="text-xs text-slate-500">
              Browse 500+ verified items at wholesale pricing with high profit margins.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black text-sm">
              02
            </div>
            <h3 className="font-bold text-sm text-slate-900">Share with Customer</h3>
            <p className="text-xs text-slate-500">
              Post to Facebook Marketplace, WhatsApp groups, or your page with AI generated Bangla copy.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-sm">
              03
            </div>
            <h3 className="font-bold text-sm text-slate-900">We Pack & Ship COD</h3>
            <p className="text-xs text-slate-500">
              Our warehouse packs with QC and ships via Steadfast/Pathao. Customer pays cash on delivery.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
              04
            </div>
            <h3 className="font-bold text-sm text-slate-900">Collect 100% Profit</h3>
            <p className="text-xs text-slate-500">
              Your profit is automatically credited to your wallet and sent to your bKash / Nagad.
            </p>
          </div>
        </div>
      </div>

      {/* Catalog Search & Filter Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Trending Product Catalog</h2>
            <p className="text-xs text-slate-500">Factory direct prices with Cash On Delivery</p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={() => setFilterTrending(!filterTrending)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                filterTrending ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Trending</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full font-bold transition shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full font-bold transition shrink-0 ${
                selectedCategory === cat.slug
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name} ({cat.productCount})
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => {
            const profit = product.suggestedSellingPrice - product.resellerPrice;

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    className="aspect-square relative overflow-hidden bg-slate-100 cursor-pointer"
                    onClick={() => onOpenProductDetail(product)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isTrending && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-sm flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-current" />
                        <span>Trending</span>
                      </span>
                    )}

                    {isResellerOrAdmin && (
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black shadow-sm">
                        +৳{profit} Profit
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => onOpenProductDetail(product)}
                      className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 hover:text-emerald-700 cursor-pointer transition"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">{product.nameBn}</p>

                    <div className="flex items-baseline justify-between pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-base font-black text-slate-900">৳{product.suggestedSellingPrice}</span>
                        {product.oldPrice && product.oldPrice > product.suggestedSellingPrice && (
                          <span className="text-xs text-slate-400 line-through">৳{product.oldPrice}</span>
                        )}
                      </div>
                      {(product.discountAmount || (product.oldPrice && product.oldPrice > product.suggestedSellingPrice)) && (
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-sm">
                          ৳{product.discountAmount || (product.oldPrice! - product.suggestedSellingPrice)} ছাড়
                        </span>
                      )}
                    </div>

                    {isResellerOrAdmin ? (
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex justify-between font-bold">
                        <span className="text-slate-600">Wholesale: ৳{product.resellerPrice}</span>
                        <span className="text-emerald-700">Profit: ৳{profit}</span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Truck className="w-3 h-3" /> Cash on Delivery Available
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-2">
                  {isResellerOrAdmin ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onOpenManualOrder(product)}
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Sell Now</span>
                      </button>

                      <button
                        onClick={() => onOpenShareModal(product)}
                        className="py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs transition flex items-center justify-center gap-1"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Link</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order (৳{product.suggestedSellingPrice})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulator Section */}
      <EarningsCalculator onStartSelling={!isResellerOrAdmin ? onOpenBecomeReseller : () => onNavigateTab('reseller_hub')} />
    </div>
  );
};
