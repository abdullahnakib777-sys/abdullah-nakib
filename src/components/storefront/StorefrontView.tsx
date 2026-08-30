import React, { useState } from 'react';
import { Product, ProductCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { EarningsCalculator } from './EarningsCalculator';
import { EmptyState } from '../common/EmptyState';
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
  Zap,
  Wallet,
  Coins,
  Bot,
  BadgePercent,
  X,
  Eye,
  ArrowUpDown,
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
  const { t, isBn, getProductName, getProductDesc, getCategoryName } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrending, setFilterTrending] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'trending'>('trending');

  const isResellerOrAdmin = user?.role === 'RESELLER' || user?.role === 'ADMIN';

  let filtered = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory && p.category !== selectedCategory) {
      return false;
    }
    if (filterTrending && !p.isTrending) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.nameBn.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.productCode && p.productCode.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Apply sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'price_low') {
      return a.suggestedSellingPrice - b.suggestedSellingPrice;
    } else if (sortBy === 'price_high') {
      return b.suggestedSellingPrice - a.suggestedSellingPrice;
    } else if (sortBy === 'newest') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    } else if (sortBy === 'trending') {
      return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    }
    return 0;
  });

  // Cosmic Highlights / Stories for Mobile
  const cosmicStories = [
    {
      id: 'zero-inv',
      title: isBn ? '০৳ ইনভেস্টমেন্ট' : '৳0 Investment',
      subtitle: isBn ? 'ফ্রি পাইকারি' : 'Free Wholesale',
      icon: Zap,
      gradient: 'from-amber-400 to-orange-500',
      action: !isResellerOrAdmin ? onOpenBecomeReseller : () => onNavigateTab('products'),
    },
    {
      id: 'cod-districts',
      title: isBn ? '৬৪ জেলা COD' : '64 District COD',
      subtitle: 'Steadfast/Pathao',
      icon: Truck,
      gradient: 'from-cyan-400 to-blue-500',
      action: () => {},
    },
    {
      id: 'ai-copilot',
      title: isBn ? 'ResellAI কপিরাইটার' : 'ResellAI Copilot',
      subtitle: '1-Click Sell Kit',
      icon: Bot,
      gradient: 'from-purple-400 to-pink-500',
      action: () => {},
    },
    {
      id: 'instant-payout',
      title: isBn ? 'বিকাশ/নগদ পে-আউট' : 'bKash/Nagad Payout',
      subtitle: isBn ? '২৪ ঘণ্টায় প্রফিট' : 'Instant Profit',
      icon: Wallet,
      gradient: 'from-emerald-400 to-teal-500',
      action: !isResellerOrAdmin ? onOpenBecomeReseller : () => onNavigateTab('wallet'),
    },
    {
      id: 'high-margin',
      title: isBn ? 'উচ্চ মার্জিন ৳' : 'High Profit ৳',
      subtitle: '৳200-৳1500 Profit',
      icon: Coins,
      gradient: 'from-rose-400 to-red-500',
      action: () => {
        const el = document.getElementById('earnings-calculator');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <div className="space-y-8 sm:space-y-12 pb-24 sm:pb-12" id="storefront-view">
      {/* Mobile Floating Cosmic Story Capsules Carousel */}
      <div className="sm:hidden -mx-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-3 py-1">
        {cosmicStories.map((story) => {
          const IconComp = story.icon;
          return (
            <button
              key={story.id}
              onClick={story.action}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 group text-center focus:outline-none cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl p-[1.5px] bg-gradient-to-tr ${story.gradient} shadow-[0_0_15px_rgba(168,85,247,0.35)] group-active:scale-95 transition-transform`}>
                <div className="w-full h-full rounded-[14px] bg-[#0c0a1a]/90 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-[#15122a] transition">
                  <IconComp className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-200 tracking-tight leading-none max-w-[70px] truncate">
                {story.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hero Banner with Cosmic Galaxy Aesthetic */}
      <div className="relative rounded-3xl p-6 sm:p-12 shadow-[0_0_50px_rgba(99,102,241,0.25)] overflow-hidden border border-purple-500/30 bg-gradient-to-r from-[#131127]/80 via-[#1f1938]/80 to-[#121829]/80 backdrop-blur-xl">
        {/* Cosmic Nebulae background glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-gradient-to-br from-cyan-500/25 via-purple-600/30 to-pink-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-purple-900/60 text-cyan-300 text-xs font-bold border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span className="text-[11px] sm:text-xs">{t('hero_badge', "✨ Bangladesh's #1 Galaxy Reselling Platform")}</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            {t('hero_title_1', 'Start Your Online Business with')}{' '}
            <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-cyan-300 bg-clip-text text-transparent">
              {isBn ? '০ টাকা ইনভেস্টমেন্টে' : '0 Taka Investment'}
            </span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
            {t('hero_subtitle', 'Sell 500+ trending products from factory warehouses. We handle packaging, courier dispatch (Steadfast/Pathao), and Cash-on-Delivery nationwide. You keep 100% of your profit!')}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
            {!isResellerOrAdmin ? (
              <button
                onClick={onOpenBecomeReseller}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-[0_0_25px_rgba(251,191,36,0.45)] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{t('join_reseller_btn', 'Become a Reseller (৳500)')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => onNavigateTab('reseller_hub')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm transition shadow-[0_0_25px_rgba(6,182,212,0.45)] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>{t('reseller_dashboard', 'Open Reseller Dashboard')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <button
              onClick={() => {
                const el = document.getElementById('earnings-calculator');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-purple-950/50 hover:bg-purple-900/60 text-cyan-200 font-bold text-xs sm:text-sm backdrop-blur-md transition border border-purple-500/30 hover:border-cyan-400/50 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Coins className="w-4 h-4 text-amber-300" />
              <span>{isBn ? 'আপনার সম্ভাব্য লাভ হিসাব করুন ৳' : 'Calculate Your Profit ৳'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Step Process Section with Glassmorphism */}
      <div className="galaxy-glass-card-static p-5 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <p className="text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? 'সহজ ৪-স্টেপ বিজনেস মডেল' : 'Simple 4-Step Model'}</span>
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isBn ? 'মেহেরমার্ট রিসেলিং যেভাবে কাজ করে' : 'How MeherMart Reseller Works'}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="galaxy-glass p-3.5 sm:p-5 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 space-y-1.5 sm:space-y-2 transition-all hover:-translate-y-1 animate-float-gentle">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              01
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white">
              {isBn ? 'প্রোডাক্ট পছন্দ করুন' : 'Select Product'}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-tight">
              {isBn ? '৫০০+ ফ্যাক্টরি রেটের ভেরিফাইড আইটেম ব্রাউজ করুন।' : 'Browse 500+ verified factory items at wholesale pricing.'}
            </p>
          </div>

          <div className="galaxy-glass p-3.5 sm:p-5 rounded-2xl border border-indigo-500/30 hover:border-indigo-400/60 space-y-1.5 sm:space-y-2 transition-all hover:-translate-y-1 animate-float-gentle-delayed">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_0_10px_rgba(99,102,241,0.3)]">
              02
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white">
              {isBn ? 'এআই দিয়ে শেয়ার করুন' : 'Share with AI'}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-tight">
              {isBn ? 'ফেসবুকে ১-ক্লিকে আকর্ষণীয় বাংলা ক্যাপশন ও ছবি পোস্ট করুন।' : 'Post to Facebook Marketplace with 1-click Bangla copy.'}
            </p>
          </div>

          <div className="galaxy-glass p-3.5 sm:p-5 rounded-2xl border border-purple-500/30 hover:border-purple-400/60 space-y-1.5 sm:space-y-2 transition-all hover:-translate-y-1 animate-float-gentle-slow">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              03
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white">
              {isBn ? 'আমরা হোম ডেলিভারি দিব' : 'We Ship COD'}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-tight">
              {isBn ? 'স্টিডফাস্ট ও পাঠাও দিয়ে কাস্টমারের দরজায় পৌঁছে যাবে।' : 'Steadfast/Pathao delivers to customer door.'}
            </p>
          </div>

          <div className="galaxy-glass p-3.5 sm:p-5 rounded-2xl border border-amber-500/30 hover:border-amber-400/60 space-y-1.5 sm:space-y-2 transition-all hover:-translate-y-1 animate-float-gentle">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_0_10px_rgba(251,191,36,0.3)]">
              04
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white">
              {isBn ? 'প্রফিট বুঝে নিন' : 'Collect Profit'}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-tight">
              {isBn ? 'লাভ সরাসরি আপনার বিকাশ বা নগদ ওয়ালেটে পাঠানো হবে।' : 'Profit sent to your bKash / Nagad wallet.'}
            </p>
          </div>
        </div>
      </div>

      {/* Catalog Search, Filter & Sorting Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{isBn ? 'ট্রেন্ডিং হোলসেল ক্যাটালগ' : 'Trending Cosmic Catalog'}</span>
              <span className="text-xs bg-purple-900/60 text-cyan-300 px-2.5 py-0.5 rounded-full border border-purple-500/40">
                ⭐ {products.length}+ {isBn ? 'টি প্রোডাক্ট' : 'Items'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {isBn
                ? 'সরাসরি পাইকারি রেট • সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা'
                : 'Factory direct prices with Cash On Delivery & Instant Delivery'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Cosmic Search Bar */}
            <div className="relative flex-1 sm:w-64 md:w-72">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder={t('search_placeholder', 'Search products, SKU or category...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-xs galaxy-glass-input rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-purple-900/60 transition cursor-pointer"
                  title={isBn ? 'সার্চ মুছে ফেলুন' : 'Clear search'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-8 pr-7 py-2 text-xs galaxy-glass-input rounded-xl cursor-pointer appearance-none bg-purple-950/80 border border-purple-500/30 text-slate-200 focus:border-cyan-400 focus:outline-hidden font-medium"
                aria-label="Sort catalog products"
              >
                <option value="trending" className="bg-[#0f0e26] text-slate-200">🔥 {t('sort_trending', 'Trending')}</option>
                <option value="newest" className="bg-[#0f0e26] text-slate-200">✨ {t('sort_newest', 'Newest First')}</option>
                <option value="price_low" className="bg-[#0f0e26] text-slate-200">💰 {t('sort_price_low', 'Price: Low to High')}</option>
                <option value="price_high" className="bg-[#0f0e26] text-slate-200">💎 {t('sort_price_high', 'Price: High to Low')}</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Trending Quick Toggle */}
            <button
              onClick={() => setFilterTrending(!filterTrending)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                filterTrending
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  : 'galaxy-glass text-slate-300 hover:text-white border border-purple-500/30'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBn ? 'হট ট্রেন্ডিং' : 'Trending'}</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold transition shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'galaxy-glass text-slate-300 hover:text-white border border-purple-500/30'
            }`}
          >
            {t('all_categories', 'All Categories')} ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold transition shrink-0 cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'galaxy-glass text-slate-300 hover:text-white border border-purple-500/30'
              }`}
            >
              {getCategoryName(cat)} ({cat.productCount})
            </button>
          ))}
        </div>

        {/* Products Responsive Grid or Empty State */}
        {filtered.length === 0 ? (
          <EmptyState
            title={t('no_products_found', 'No Products Found')}
            description={
              searchQuery
                ? isBn
                  ? `"${searchQuery}" এর সাথে মিলে এমন কোনো প্রোডাক্ট পাওয়া যায়নি। অন্য কি-ওয়ার্ড দিয়ে খুঁজুন বা ফিল্টার রিসেট করুন।`
                  : `No products matched "${searchQuery}". Try searching with another keyword or resetting filters.`
                : isBn
                ? 'এই ক্যাটাগরিতে বর্তমানে কোনো প্রোডাক্ট নেই।'
                : 'No products are currently available in this category.'
            }
            actionLabel={t('clear_filters', 'Reset Search & Filters')}
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilterTrending(false);
            }}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {filtered.map((product) => {
              const profit = product.suggestedSellingPrice - product.resellerPrice;
              const displayName述 = isBn ? (product.nameBn || product.name) : product.name;
              const secondaryName = isBn ? (product.name !== product.nameBn ? product.name : '') : (product.nameBn || '');

              return (
                <div
                  key={product.id}
                  className="galaxy-glass-card rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between group border border-purple-500/20 hover:border-cyan-400/50 hover:shadow-[0_10px_30px_rgba(6,182,212,0.2)] hover:-translate-y-1.5"
                >
                  <div>
                    {/* Product Image with Quick View scale-up & Glassmorphism Overlay */}
                    <div
                      className="aspect-square relative overflow-hidden bg-slate-900/60 cursor-pointer group/img"
                      onClick={() => onOpenProductDetail(product)}
                    >
                      <img
                        src={product.images[0]}
                        alt={displayName述}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover/img:scale-110 group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      {/* Dark gradient base overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c1f] via-transparent to-transparent opacity-60 pointer-events-none" />

                      {/* Glassmorphism Quick-View Overlay on Hover */}
                      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
                        <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-400/50 text-cyan-300 text-[11px] sm:text-xs font-black shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <Eye className="w-3.5 h-3.5 text-cyan-300" />
                          <span>{isBn ? 'কুইক ভিউ' : 'Quick View'}</span>
                        </span>
                      </div>

                      {product.isTrending && (
                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] sm:text-[10px] font-bold shadow-[0_0_10px_rgba(244,63,94,0.5)] flex items-center gap-1 z-10">
                          <Flame className="w-2.5 h-2.5 fill-current text-amber-300" />
                          <span>{isBn ? 'হট' : 'Hot'}</span>
                        </span>
                      )}

                      {isResellerOrAdmin && (
                        <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[9px] sm:text-[11px] font-black shadow-[0_0_12px_rgba(16,185,129,0.5)] flex items-center gap-0.5 z-10">
                          <Sparkles className="w-2.5 h-2.5 text-slate-950" />
                          <span>{isBn ? `+৳${profit} লাভ` : `+৳${profit} Profit`}</span>
                        </span>
                      )}
                    </div>

                    <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-cyan-400 truncate max-w-[120px]">
                          {product.category}
                        </span>
                        {product.sku && (
                          <span className="hidden sm:inline text-[9px] font-mono text-slate-400 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/20">
                            {product.sku}
                          </span>
                        )}
                      </div>
                      
                      <h3
                        onClick={() => onOpenProductDetail(product)}
                        className="font-bold text-xs sm:text-sm text-white line-clamp-1 hover:text-cyan-300 cursor-pointer transition"
                      >
                        {displayName述}
                      </h3>
                      {secondaryName && (
                        <p className="text-[11px] sm:text-xs text-slate-300 font-medium line-clamp-1">{secondaryName}</p>
                      )}

                      <div className="flex items-baseline justify-between pt-0.5 sm:pt-1">
                        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                          <span className="text-sm sm:text-base font-black text-cyan-300">৳{product.suggestedSellingPrice}</span>
                          {product.oldPrice && product.oldPrice > product.suggestedSellingPrice && (
                            <span className="text-[10px] sm:text-xs text-slate-500 line-through">৳{product.oldPrice}</span>
                          )}
                        </div>
                        {(product.discountAmount || (product.oldPrice && product.oldPrice > product.suggestedSellingPrice)) && (
                          <span className="text-[8px] sm:text-[10px] font-black text-amber-300 bg-amber-950/60 border border-amber-500/30 px-1 py-0.5 rounded shadow-xs">
                            ৳{product.discountAmount || (product.oldPrice! - product.suggestedSellingPrice)} {isBn ? 'ছাড়' : 'Off'}
                          </span>
                        )}
                      </div>

                      {isResellerOrAdmin ? (
                        <div className="p-1.5 sm:p-2 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-[10px] sm:text-xs flex justify-between font-bold">
                          <span className="text-slate-300">{isBn ? 'পাইকারি:' : 'Wholesale:'} <strong className="text-white">৳{product.resellerPrice}</strong></span>
                          <span className="text-emerald-400">{isBn ? `৳${profit} লাভ` : `৳${profit} Profit`}</span>
                        </div>
                      ) : (
                        <p className="text-[10px] sm:text-[11px] text-teal-300 font-semibold flex items-center gap-1 truncate">
                          <Truck className="w-3 h-3 text-cyan-400 shrink-0" /> {isBn ? 'সারাদেশে ক্যাশ অন ডেলিভারি' : 'COD Available'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 pt-0 space-y-1.5 sm:space-y-2">
                    {isResellerOrAdmin ? (
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        <button
                          onClick={() => onOpenManualOrder(product)}
                          className="py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-[10px] sm:text-xs shadow-[0_0_12px_rgba(16,185,129,0.3)] transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>{isBn ? 'সেল করুন' : 'Sell'}</span>
                        </button>

                        <button
                          onClick={() => onOpenShareModal(product)}
                          className="py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-cyan-300 border border-purple-500/30 font-bold text-[10px] sm:text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>{isBn ? 'শেয়ার' : 'Share'}</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="w-full py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-[10px] sm:text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{isBn ? `অর্ডার করুন (৳${product.suggestedSellingPrice})` : `Order (৳${product.suggestedSellingPrice})`}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Simulator Section */}
      <EarningsCalculator onStartSelling={!isResellerOrAdmin ? onOpenBecomeReseller : () => onNavigateTab('reseller_hub')} />
    </div>
  );
};
