import React, { useState } from 'react';
import { Calculator, TrendingUp, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export const EarningsCalculator: React.FC<{ onStartSelling?: () => void }> = ({ onStartSelling }) => {
  const [salesPerDay, setSalesPerDay] = useState(5);
  const [avgProfitPerItem, setAvgProfitPerItem] = useState(250);

  const dailyProfit = salesPerDay * avgProfitPerItem;
  const monthlyProfit = dailyProfit * 30;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-indigo-800/40 relative overflow-hidden" id="earnings-calculator">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
        {/* Left Interactive Sliders */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Calculator className="w-3.5 h-3.5" />
              <span>Interactive Profit Simulator</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              How Much Can You Earn?
            </h3>
            <p className="text-slate-300 text-sm">
              Discover your potential profit based on realistic sales volumes across Bangladesh.
            </p>
          </div>

          <div className="space-y-5 bg-white/5 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10">
            {/* Slider 1: Sales per day */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-200">Customer Sales Per Day</span>
                <span className="px-3 py-1 rounded-lg bg-indigo-500/30 text-indigo-200 font-bold border border-indigo-400/30">
                  {salesPerDay} {salesPerDay === 1 ? 'sale' : 'sales'} / day
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={salesPerDay}
                onChange={(e) => setSalesPerDay(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1 sale</span>
                <span>10 sales</span>
                <span>20 sales</span>
                <span>30 sales</span>
              </div>
            </div>

            {/* Slider 2: Average profit per item */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-200">Average Profit Margin Per Product</span>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/30 text-emerald-200 font-bold border border-emerald-400/30">
                  ৳{avgProfitPerItem} / item
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="600"
                step="25"
                value={avgProfitPerItem}
                onChange={(e) => setAvgProfitPerItem(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>৳100</span>
                <span>৳250 (Typical)</span>
                <span>৳450</span>
                <span>৳600 (High Profit)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Cards */}
        <div className="lg:col-span-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/20 space-y-5">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Estimated Daily Profit</p>
              <p className="text-3xl font-extrabold text-white mt-0.5">
                ৳{(dailyProfit ?? 0).toLocaleString()}
              </p>
            </div>

            <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl">
              <p className="text-xs uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Estimated 30-Day Profit</span>
              </p>
              <p className="text-4xl font-black text-emerald-400 mt-1">
                ৳{(monthlyProfit ?? 0).toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-200/80 mt-1">
                Directly withdrawable to bKash, Nagad or Bank account.
              </p>
            </div>
          </div>

          {/* Mandatory Transparent Disclaimer */}
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-white/10 text-[11px] text-slate-400 leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Transparent Profit Policy</span>
            </div>
            <p>
              These are potential earnings calculated from the selected assumptions. Actual income depends on successful customer orders, returns, cancellations, pricing, and platform rules. We never make false income guarantees.
            </p>
          </div>

          {onStartSelling && (
            <button
              onClick={onStartSelling}
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm transition shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Start Selling & Earn ৳{(monthlyProfit ?? 0).toLocaleString()}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
