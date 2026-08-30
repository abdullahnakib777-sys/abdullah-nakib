import React, { useState } from 'react';
import { Product, ProductCategory, ResellerProfile } from '../../types';
import { useResellerCart } from '../../context/ResellerCartContext';
import { EmptyState } from '../common/EmptyState';
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
  ShoppingCart,
  Eye,
  X,
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
  const { addToCart, items: cartItems, itemCount, setIsCartOpen } = useResellerCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'profit' | 'price_low' | 'price_high' | 'popularity' | 'newest'>('profit');
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
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.nameBn.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.productCode && p.productCode.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q))
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
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
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
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm galaxy-glass-input rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-purple-900/60 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
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

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="pl-7 pr-7 py-2 text-xs galaxy-glass border border-purple-500/30 rounded-xl font-semibold text-cyan-300 focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
              >
                <option value="profit" className="bg-[#110e24] text-slate-200">💰 Highest Profit First</option>
                <option value="newest" className="bg-[#110e24] text-slate-200">✨ Newest First</option>
                <option value="popularity" className="bg-[#110e24] text-slate-200">🔥 Best Seller / Popular</option>
                <option value="price_low" className="bg-[#110e24] text-slate-200">📉 Wholesale: Low to High</option>
                <option value="price_high" className="bg-[#110e24] text-slate-200">📈 Wholesale: High to Low</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 absolute left-2 top-2.5 pointer-events-none" />
            </div>

            {/* Reseller Multi-Product Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center gap-1.5 shrink-0"
              title="Open Reseller Multi-Product Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Reseller Cart</span>
              {itemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 text-[11px] font-black flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>
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
      {filtered.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description={
            stockFilter === 'IN_STOCK'
              ? 'No in-stock products matched your filters. Switch to "All Products" to view upcoming restocks.'
              : 'No reseller products matched your search or category filter.'
          }
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setFilterTrending(false);
            setStockFilter('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => {
            const profit = product.suggestedSellingPrice - product.resellerPrice;
            const marginPercent = ((profit / product.suggestedSellingPrice) * 100).toFixed(0);
            const isOut = product.isStockOut || product.stock <= 0;

            return (
              <div
                key={product.id}
                className={`galaxy-glass-card rounded-3xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between group hover:border-cyan-400/50 hover:shadow-[0_10px_30px_rgba(6,182,212,0.2)] hover:-translate-y-1.5 ${
                  isOut ? 'border-amber-500/30 bg-amber-950/10' : ''
                }`}
              >
                <div>
                  {/* Image Container with Quick-View hover overlay */}
                  <div
                    className="aspect-square relative overflow-hidden bg-slate-900/60 cursor-pointer group/img"
                    onClick={() => onOpenProductDetail(product)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className={`w-full h-full object-cover group-hover/img:scale-110 group-hover:scale-105 transition-transform duration-500 ease-out ${
                        isOut ? 'opacity-70 grayscale-30' : ''
                      }`}
                    />

                    {/* Quick View glass overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
                      <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-400/50 text-cyan-300 text-xs font-black shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Quick View</span>
                      </span>
                    </div>
                    
                    {/* Product Code Badge */}
                    <div className="absolute top-3 left-3 bg-[#0d0920]/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-purple-500/30 flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-300 shadow-md z-10">
                      <Tag className="w-3 h-3 text-cyan-400" />
                      <span>{product.productCode || product.sku}</span>
                    </div>

                    {/* Stock status or trending badge */}
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-1 z-10">
                      {isOut ? (
                        <span className="px-2.5 py-1 rounded-xl bg-amber-500/90 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-md">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Out of Stock</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/80 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-md">
                          <CheckCircle2 className="w-3 h-3 text-slate-950" />
                          <span>{product.stock} in stock</span>
                        </span>
                      )}

                      {product.isTrending && (
                        <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-[10px] flex items-center gap-1 shadow-[0_0_10px_rgba(244,63,94,0.6)]">
                          <Flame className="w-3 h-3 text-amber-300 fill-current" />
                          <span>Hot</span>
                        </span>
                      )}
                    </div>

                    {isOut && product.restockEta && (
                      <div className="absolute bottom-0 inset-x-0 bg-amber-950/90 backdrop-blur-xs py-1 px-3 text-[10px] text-amber-300 font-bold flex items-center justify-center gap-1 border-t border-amber-500/40 z-10">
                        <Clock className="w-3 h-3" />
                        <span>Restocking: {product.restockEta}</span>
                      </div>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                        {product.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        Sold: {product.successfulSalesCount} units
                      </span>
                    </div>

                    <h3
                      onClick={() => onOpenProductDetail(product)}
                      className="font-bold text-sm text-white line-clamp-1 hover:text-cyan-300 cursor-pointer transition"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium line-clamp-1">{product.nameBn}</p>

                    {/* Price Breakdown Matrix */}
                    <div className="p-2.5 bg-purple-950/40 rounded-2xl border border-purple-500/20 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Wholesale Price:</span>
                        <span className="font-bold text-cyan-300">৳{product.resellerPrice}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Retail Price:</span>
                        <span className="font-bold text-slate-300">৳{product.suggestedSellingPrice}</span>
                      </div>
                      <div className="pt-1 border-t border-purple-500/20 flex justify-between text-xs items-center">
                        <span className="text-emerald-400 font-bold">Your Profit:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-emerald-300 text-sm">৳{profit}</span>
                          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            {marginPercent}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenManualOrder(product)}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-[0_0_12px_rgba(16,185,129,0.4)] transition flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Place Order</span>
                    </button>

                    <button
                      onClick={() => addToCart(product, 1)}
                      className="py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs transition flex items-center justify-center gap-1.5"
                      title="Add to Reseller Multi-Order Cart"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>+ Cart</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenShareModal(product)}
                      className="py-2 px-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-slate-200 hover:text-white border border-purple-500/30 font-bold text-xs transition flex items-center justify-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Link</span>
                    </button>

                    <button
                      onClick={() => onOpenAiKit(product)}
                      className="py-2 px-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-300 hover:text-cyan-300 font-bold text-xs transition flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>AI Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

