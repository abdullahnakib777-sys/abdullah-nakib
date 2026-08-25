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

  let filtered = products.filter((p) => {
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

  return (
    <div className="space-y-6" id="reseller-products-view">
      {/* Search & Filter Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search products by title, Bangla name, category (e.g. Smartwatch, T-shirt)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterTrending(!filterTrending)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                filterTrending
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Trending</span>
            </button>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="profit">Highest Profit First</option>
              <option value="popularity">Most Popular / Best Seller</option>
              <option value="price_low">Wholesale Price: Low to High</option>
              <option value="price_high">Wholesale Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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

          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Container */}
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
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black shadow-sm">
                    +৳{profit} Profit
                  </span>
                </div>

                {/* Details */}
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

                  {/* Price Comparison Box */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Wholesale Cost:</span>
                      <span className="font-bold text-indigo-900">৳{product.resellerPrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Suggested Retail:</span>
                      <span className="font-semibold text-slate-900">৳{product.suggestedSellingPrice}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-1 flex justify-between items-center font-bold text-emerald-700">
                      <span>Your Profit Margin:</span>
                      <span>৳{profit} ({marginPercent}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Stock: {product.stock} units</span>
                    <span>Return rate: {product.returnRatePercent}%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 space-y-2">
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

                <button
                  onClick={() => onOpenAiKit(product)}
                  className="w-full py-1.5 text-[11px] font-bold text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>Generate Facebook & WhatsApp Copy</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-700 text-sm">No products found matching criteria</h4>
          <p className="text-xs text-slate-400">Try changing your search term or category filters</p>
        </div>
      )}
    </div>
  );
};
