import React from 'react';
import { Truck, ShieldCheck, CreditCard, Lock, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC<{
  onNavigate: (view: string) => void;
  onOpenTrackingModal: () => void;
  onOpenBecomeReseller: () => void;
}> = ({ onNavigate, onOpenTrackingModal, onOpenBecomeReseller }) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 mt-16" id="main-footer">
      {/* Bangladesh Logistics & Trust Badges Strip */}
      <div className="border-b border-slate-900 bg-slate-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Nationwide Courier</p>
                <p className="text-[11px] text-slate-400">Steadfast, Pathao & RedX COD</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Quality Checked</p>
                <p className="text-[11px] text-slate-400">Direct factory verified stocks</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Instant Payouts</p>
                <p className="text-[11px] text-slate-400">bKash, Nagad & Bank Transfer</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Transparent Margin</p>
                <p className="text-[11px] text-slate-400">0% hidden charges or fee cuts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                স্বা
              </div>
              <span className="font-black text-lg tracking-tight text-white">
                Shadhin Reseller <span className="text-emerald-400">BD</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering 100,000+ Bangladeshi students, homemakers, and small business owners to start online commerce with zero initial inventory investment.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">Reseller Hub</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onNavigate('reseller_hub')} className="hover:text-emerald-400 transition">
                  Wholesale Products Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('leaderboard')} className="hover:text-emerald-400 transition">
                  National Reseller Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('academy')} className="hover:text-emerald-400 transition">
                  Free Facebook Sales Academy
                </button>
              </li>
              <li>
                <button onClick={onOpenBecomeReseller} className="hover:text-emerald-400 transition font-bold text-emerald-400">
                  Register as New Reseller
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={onOpenTrackingModal} className="hover:text-emerald-400 transition">
                  Track Delivery (Steadfast / Pathao)
                </button>
              </li>
              <li>
                <span className="text-slate-500">Dhaka Hotline: +880 1711-998877</span>
              </li>
              <li>
                <span className="text-slate-500">WhatsApp Support: +880 1811-223344</span>
              </li>
              <li>
                <span className="text-slate-500">COD Available in all 64 Districts</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">Payment & Courier Partners</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 font-mono text-[11px] border border-slate-800">
                bKash
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 font-mono text-[11px] border border-slate-800">
                Nagad
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 font-mono text-[11px] border border-slate-800">
                Steadfast Courier
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 font-mono text-[11px] border border-slate-800">
                Pathao Courier
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 font-mono text-[11px] border border-slate-800">
                RedX Delivery
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Dhaka Delivery: ৳60 • Nationwide Outside Dhaka: ৳120
            </p>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Shadhin Reseller Bangladesh. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with pride for digital commerce entrepreneurs in Bangladesh 🇧🇩
          </p>
        </div>
      </div>
    </footer>
  );
};
