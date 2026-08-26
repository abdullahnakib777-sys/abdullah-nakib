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
      {/* Hero Banner with Cosmic Galaxy Aesthetic */}
      <div className="relative rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(99,102,241,0.25)] overflow-hidden border border-purple-500/30 bg-gradient-to-r from-[#131127]/90 via-[#1f1938]/90 to-[#121829]/90 backdrop-blur-xl">
        {/* Cosmic Nebulae background glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-purple-600/25 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/60 text-cyan-300 text-xs font-bold border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>✨ Bangladesh's #1 Galaxy Reselling Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Start Your Online Business with{' '}
            <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-cyan-300 bg-clip-text text-transparent">
              0 Taka Investment
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Sell 500+ trending products from factory warehouses. We handle packaging, courier dispatch (Steadfast/Pathao), and Cash-on-Delivery nationwide. You keep 100% of your profit!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!isResellerOrAdmin ? (
              <button
                onClick={onOpenBecomeReseller}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm transition shadow-[0_0_25px_rgba(251,191,36,0.45)] flex items-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Become a Reseller</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => onNavigateTab('reseller_hub')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-sm transition shadow-[0_0_25px_rgba(6,182,212,0.45)] flex items-center gap-2 group"
              >
                <Store className="w-4 h-4" />
                <span>Open Reseller Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <button
              onClick={() => {
                const el = document.getElementById('earnings-calculator');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3.5 rounded-2xl bg-purple-950/50 hover:bg-purple-900/60 text-cyan-200 font-bold text-sm backdrop-blur-md transition border border-purple-500/30 hover:border-cyan-400/50 shadow-xs"
            >
              Calculate Your Profit ৳
            </button>
          </div>
        </div>
      </div>

      {/* 4-Step Process Section with Glassmorphism */}
      <div className="galaxy-glass-card-static p-8 rounded-3xl border border-purple-500/30 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <p className="text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple 4-Step Model</span>
          </p>
          <h2 className="text-2xl font-black text-white">How MeherMart Reseller Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="galaxy-glass p-5 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 space-y-2 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-black text-sm shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              01
            </div>
            <h3 className="font-bold text-sm text-white">Select Factory Product</h3>
            <p className="text-xs text-slate-300">
              Browse 500+ verified items at wholesale pricing with high profit margins.
            </p>
          </div>

          <div className="galaxy-glass p-5 rounded-2xl border border-indigo-500/30 hover:border-indigo-400/60 space-y-2 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-black text-sm shadow-[0_0_10px_rgba(99,102,241,0.3)]">
              02
            </div>
            <h3 className="font-bold text-sm text-white">Share with Customer</h3>
            <p className="text-xs text-slate-300">
              Post to Facebook Marketplace, WhatsApp groups, or your page with AI generated Bangla copy.
            </p>
          </div>

          <div className="galaxy-glass p-5 rounded-2xl border border-purple-500/30 hover:border-purple-400/60 space-y-2 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-black text-sm shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              03
            </div>
            <h3 className="font-bold text-sm text-white">We Pack & Ship COD</h3>
            <p className="text-xs text-slate-300">
              Our warehouse packs with QC and ships via Steadfast/Pathao. Customer pays cash on delivery.
            </p>
          </div>

          <div className="galaxy-glass p-5 rounded-2xl border border-amber-500/30 hover:border-amber-400/60 space-y-2 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-black text-sm shadow-[0_0_10px_rgba(251,191,36,0.3)]">
              04
            </div>
            <h3 className="font-bold text-sm text-white">Collect 100% Profit</h3>
            <p className="text-xs text-slate-300">
              Your profit is automatically credited to your wallet and sent to your bKash / Nagad.
            </p>
          </div>
        </div>
      </div>

      {/* Catalog Search & Filter Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span>Trending Cosmic Catalog</span>
              <span className="text-xs bg-purple-900/60 text-cyan-300 px-2.5 py-1 rounded-full border border-purple-500/40">
                ⭐ 500+ Items
              </span>
            </h2>
            <p className="text-xs text-slate-400">Factory direct prices with Cash On Delivery & Instant Delivery</p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search products in Bangla or English..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs galaxy-glass-input rounded-xl"
              />
            </div>

            <button
              onClick={() => setFilterTrending(!filterTrending)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                filterTrending
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  : 'galaxy-glass text-slate-300 hover:text-white border border-purple-500/30'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
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
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'galaxy-glass text-slate-300 hover:text-white border border-purple-500/30'
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
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'galaxy-glass text-slate-300 hover:text-white border border-purple-500/30'
              }`}
            >
              {cat.name} ({cat.productCount})
            </button>
          ))}
        </div>

        {/* Products Grid with Glassmorphic Cards & Hover Glow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => {
            const profit = product.suggestedSellingPrice - product.resellerPrice;

            return (
              <div
                key={product.id}
                className="galaxy-glass-card rounded-3xl overflow-hidden shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    className="aspect-square relative overflow-hidden bg-slate-900/60 cursor-pointer"
                    onClick={() => onOpenProductDetail(product)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Dark gradient overlay for starry vibe */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c1f] via-transparent to-transparent opacity-60 pointer-events-none" />

                    {product.isTrending && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold shadow-[0_0_10px_rgba(244,63,94,0.5)] flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-current text-amber-300" />
                        <span>Trending</span>
                      </span>
                    )}

                    {isResellerOrAdmin && (
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[11px] font-black shadow-[0_0_12px_rgba(16,185,129,0.5)] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-slate-950" />
                        <span>+৳{profit} Profit</span>
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                        {product.category}
                      </span>
                      {product.sku && (
                        <span className="text-[9px] font-mono text-slate-400 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/20">
                          {product.sku}
                        </span>
                      )}
                    </div>
                    
                    <h3
                      onClick={() => onOpenProductDetail(product)}
                      className="font-bold text-xs sm:text-sm text-white line-clamp-1 hover:text-cyan-300 cursor-pointer transition"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium line-clamp-1">{product.nameBn}</p>

                    <div className="flex items-baseline justify-between pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-base font-black text-cyan-300">৳{product.suggestedSellingPrice}</span>
                        {product.oldPrice && product.oldPrice > product.suggestedSellingPrice && (
                          <span className="text-xs text-slate-500 line-through">৳{product.oldPrice}</span>
                        )}
                      </div>
                      {(product.discountAmount || (product.oldPrice && product.oldPrice > product.suggestedSellingPrice)) && (
                        <span className="text-[10px] font-black text-amber-300 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded-sm shadow-xs">
                          ৳{product.discountAmount || (product.oldPrice! - product.suggestedSellingPrice)} ছাড়
                        </span>
                      )}
                    </div>

                    {isResellerOrAdmin ? (
                      <div className="p-2 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-xs flex justify-between font-bold">
                        <span className="text-slate-300">Wholesale: <strong className="text-white">৳{product.resellerPrice}</strong></span>
                        <span className="text-emerald-400">Profit: ৳{profit}</span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-teal-300 font-semibold flex items-center gap-1">
                        <Truck className="w-3 h-3 text-cyan-400" /> Cash on Delivery Available
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-2">
                  {isResellerOrAdmin ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onOpenManualOrder(product)}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Sell Now</span>
                      </button>

                      <button
                        onClick={() => onOpenShareModal(product)}
                        className="py-2.5 px-3 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-cyan-300 border border-purple-500/30 font-bold text-xs transition flex items-center justify-center gap-1"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Link</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center justify-center gap-1.5"
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
