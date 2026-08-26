import React, { useState } from 'react';
import { Product, ProductCategory, ResellerProfile } from '../../types';
import {
  Search,
  Filter,
  Flame,
  ShoppingBag,
  Share2,
  Sparkles,
  Layers,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Tag,
  Check,
} from 'lucide-react';

export const ResellerProductsView: React.FC<{
  products: Product[];
  categories: ProductCategory[];
  reseller: ResellerProfile;
  onOpenProductDetail: (product: Product) => void;
  onOpenManualOrder: (product: Product) => void;
  onOpenShareModal: (product: Product) => void;
  onOpenAiKit: (product: Product) => void;
}> = ({
  products,
  categories,
  reseller,
  onOpenProductDetail,
  onOpenManualOrder,
  onOpenShareModal,
  onOpenAiKit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'profit' | 'price_low' | 'price_high' | 'popularity'>('profit');
  const [filterTrending, setFilterTrending] = useState(false);
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK'>('ALL');

  let filtered = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory && p.category !== selectedCategory) {
      return false;
    }
    if (filterTrending && !p.isTrending) return false;
    if (stockFilter === 'IN_STOCK') {
      if (p.isStockOut || p.stock <= 0) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.nameBn.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.productCode && p.productCode.toLowerCase().includes(q))
      );
    }
    return true;
  });

  if (sortBy === 'profit') {
    filtered.sort(
      (a, b) => b.suggestedSellingPrice - b.resellerPrice - (a.suggestedSellingPrice - a.resellerPrice)
    );
  } else if (sortBy === 'price_low') {
    filtered.sort((a, b) => a.resellerPrice - b.resellerPrice);
  } else if (sortBy === 'price_high') {
    filtered.sort((a, b) => b.resellerPrice - a.resellerPrice);
  } else if (sortBy === 'popularity') {
    filtered.sort((a, b) => b.successfulSalesCount - a.successfulSalesCount);
  }

  const inStockCount = products.filter((p) => !p.isStockOut && p.stock > 0).length;

  return (
    <div className="space-y-6" id="reseller-products-view">
      {/* Search & Filter Header */}
      <div className="galaxy-glass-card-static p-5 rounded-3xl border border-purple-500/30 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by code (e.g. MM-1001), name, Bangla title, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm galaxy-glass-input rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            {/* Stock Filter Toggle: All vs In Stock */}
            <div className="flex items-center bg-[#130f2c]/80 p-1 rounded-xl border border-purple-500/30">
              <button
                onClick={() => setStockFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  stockFilter === 'ALL'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>All Products</span>
                <span className="text-[10px] opacity-75">({products.length})</span>
              </button>
              <button
                onClick={() => setStockFilter('IN_STOCK')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  stockFilter === 'IN_STOCK'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Check className="w-3 h-3 text-emerald-300" />
                <span>In Stock Only</span>
                <span className="text-[10px] opacity-75">({inStockCount})</span>
              </button>
            </div>

            <button
              onClick={() => setFilterTrending(!filterTrending)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                filterTrending
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                  : 'galaxy-glass text-slate-300 hover:text-white border border-purple-500/30'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Trending</span>
            </button>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs galaxy-glass border border-purple-500/30 rounded-xl font-semibold text-cyan-300 focus:ring-2 focus:ring-purple-500"
            >
              <option value="profit" className="bg-[#110e24] text-slate-200">Highest Profit First</option>
              <option value="popularity" className="bg-[#110e24] text-slate-200">Most Popular / Best Seller</option>
              <option value="price_low" className="bg-[#110e24] text-slate-200">Wholesale Price: Low to High</option>
              <option value="price_high" className="bg-[#110e24] text-slate-200">Wholesale Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'galaxy-glass text-slate-300 hover:text-white border border-purple-500/30'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full font-bold transition shrink-0 flex items-center gap-1.5 ${
                selectedCategory === cat.slug
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'galaxy-glass text-slate-300 hover:text-white border border-purple-500/30'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-70">({cat.productCount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((product) => {
          const profit = product.suggestedSellingPrice - product.resellerPrice;
          const marginPercent = ((profit / product.suggestedSellingPrice) * 100).toFixed(0);
          const isOut = product.isStockOut || product.stock <= 0;

          return (
            <div
              key={product.id}
              className={`galaxy-glass-card rounded-3xl overflow-hidden shadow-lg transition-all flex flex-col justify-between group ${
                isOut ? 'border-amber-500/30 bg-amber-950/10' : ''
              }`}
            >
              <div>
                {/* Image Container */}
                <div
                  className="aspect-square relative overflow-hidden bg-slate-900/60 cursor-pointer"
                  onClick={() => onOpenProductDetail(product)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                      isOut ? 'opacity-70 grayscale-30' : ''
                    }`}
                  />
                  
                  {/* Product Code Badge */}
                  {product.productCode && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/40 shadow-xs">
                      #{product.productCode}
                    </span>
                  )}

                  {/* Stock Status Badge */}
                  {isOut ? (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-black shadow-[0_0_12px_rgba(225,29,72,0.6)] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Stock Out</span>
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 text-[11px] font-black shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                      +৳{profit} Profit
                    </span>
                  )}

                  {product.isTrending && !isOut && (
                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold shadow-[0_0_12px_rgba(244,63,94,0.6)] flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-current text-amber-300" />
                      <span>Trending</span>
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/80">
                      {product.category}
                    </span>
                    {product.productCode && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {product.productCode}
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => onOpenProductDetail(product)}
                    className="font-bold text-xs sm:text-sm text-white line-clamp-1 hover:text-cyan-300 cursor-pointer transition"
                  >
                    {product.name}
                  </h3>

                  {/* Stock Notice for Stocked Out Items */}
                  {isOut ? (
                    <div className="p-2.5 bg-rose-950/40 rounded-xl border border-rose-500/30 text-[11px] text-rose-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Currently Stocked Out</span>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        Estimated Restock: <span className="font-bold text-amber-300">{product.estimatedRestockDate || (product.estimatedRestockDays ? `In ~${product.estimatedRestockDays} days` : 'Within 3-5 days')}</span>
                      </p>
                    </div>
                  ) : (
                    /* Price Comparison Box */
                    <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/30 space-y-1 text-xs">
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Wholesale Cost:</span>
                        <span className="font-bold text-emerald-400">৳{product.resellerPrice}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Suggested Retail:</span>
                        <span className="font-semibold text-slate-200">৳{product.suggestedSellingPrice}</span>
                      </div>
                      <div className="border-t border-purple-500/20 pt-1 flex justify-between items-center font-bold text-cyan-300">
                        <span>Your Profit Margin:</span>
                        <span>৳{profit} ({marginPercent}%)</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className={isOut ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {isOut ? 'Stock: 0 pcs' : `Stock: ${product.stock} units`}
                    </span>
                    <span>Return rate: {product.returnRatePercent}%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenManualOrder(product)}
                    disabled={isOut}
                    className={`py-2.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1 ${
                      isOut
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isOut ? 'Restocking' : 'Sell Now'}</span>
                  </button>

                  <button
                    onClick={() => onOpenShareModal(product)}
                    className="py-2.5 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-cyan-300 font-bold text-xs transition flex items-center justify-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Link</span>
                  </button>
                </div>

                <button
                  onClick={() => onOpenAiKit(product)}
                  className="w-full py-1.5 text-[11px] font-bold text-purple-300 hover:text-cyan-300 hover:bg-purple-950/40 rounded-lg transition flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Generate Facebook & WhatsApp Copy</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center space-y-3 galaxy-glass-card-static rounded-3xl border border-purple-500/30">
          <Layers className="w-12 h-12 text-purple-400/50 mx-auto" />
          <h4 className="font-bold text-slate-200 text-sm">No products found matching criteria</h4>
          <p className="text-xs text-slate-400">
            {stockFilter === 'IN_STOCK' ? 'Try switching to "All Products" to see restock schedules' : 'Try changing your search term or category filters'}
          </p>
        </div>
      )}
    </div>
  );
};
