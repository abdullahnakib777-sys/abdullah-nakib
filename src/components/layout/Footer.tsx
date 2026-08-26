import React from 'react';
import { Truck, ShieldCheck, CreditCard, Lock, Sparkles, Phone, MapPin } from 'lucide-react';
import { MeherMartLogo } from '../common/MeherMartLogo';

export const Footer: React.FC<{
  onNavigate: (view: string) => void;
  onOpenTrackingModal: () => void;
  onOpenBecomeReseller: () => void;
  onOpenPrivacyPolicy?: () => void;
}> = ({ onNavigate, onOpenTrackingModal, onOpenBecomeReseller, onOpenPrivacyPolicy }) => {
  return (
    <footer className="relative z-10 bg-[#0a0a14]/90 backdrop-blur-xl text-slate-200 border-t border-purple-500/20 mt-16" id="main-footer">
      {/* Bangladesh Logistics & Trust Badges Strip */}
      <div className="border-b border-purple-500/15 bg-purple-950/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Nationwide Courier</p>
                <p className="text-[11px] text-slate-400">Steadfast, Pathao & RedX COD</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Quality Checked</p>
                <p className="text-[11px] text-slate-400">Direct factory verified stocks</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_12px_rgba(251,191,36,0.2)]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Instant Payouts</p>
                <p className="text-[11px] text-slate-400">bKash, Nagad & Bank Transfer</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Transparent Margins</p>
                <p className="text-[11px] text-slate-400">30৳ Flat Packaging • 0% Cut</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <MeherMartLogo size="md" variant="horizontal" theme="dark" showTagline={true} />
            <p className="text-xs text-slate-400 leading-relaxed">
              Bangladesh’s premier wholesale dropshipping & reseller commerce ecosystem. Empowering thousands to launch online businesses with zero inventory holding.
            </p>
            <div className="text-[11px] text-slate-400 space-y-1 pt-1">
              <p className="flex items-start gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>Savar DOHS, Savar, Dhaka-1344</span>
              </p>
              <p className="flex items-center gap-1.5 text-emerald-300 font-mono">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>WhatsApp: 01333855344</span>
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reseller Hub</span>
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onNavigate('reseller_hub')} className="hover:text-cyan-300 transition">
                  Wholesale Products Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('leaderboard')} className="hover:text-amber-300 transition">
                  National Reseller Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('academy')} className="hover:text-cyan-300 transition">
                  Free Reseller Sales Academy
                </button>
              </li>
              <li>
                <button onClick={onOpenBecomeReseller} className="hover:text-amber-300 transition font-bold text-amber-400">
                  Register as New Reseller (৫০০৳)
                </button>
              </li>
              {onOpenPrivacyPolicy && (
                <li>
                  <button onClick={onOpenPrivacyPolicy} className="hover:text-emerald-300 transition">
                    Privacy Policy & Reseller Terms
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">Customer Care & Support</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={onOpenTrackingModal} className="hover:text-cyan-300 transition">
                  Track Delivery (Steadfast / Pathao)
                </button>
              </li>
              <li>
                <a href="https://wa.me/8801333855344" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">
                  WhatsApp Support: 01333855344
                </a>
              </li>
              <li>
                <span className="text-slate-400">Office: Savar DOHS, Savar, Dhaka-1344</span>
              </li>
              <li>
                <span className="text-slate-400">COD Available in all 64 Districts</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">Payment & Courier Logistics</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 text-cyan-300 font-mono text-[11px] border border-purple-500/30">
                bKash
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 text-orange-300 font-mono text-[11px] border border-purple-500/30">
                Nagad
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 text-purple-300 font-mono text-[11px] border border-purple-500/30">
                Rocket
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 text-slate-300 font-mono text-[11px] border border-purple-500/30">
                Steadfast Courier
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 text-slate-300 font-mono text-[11px] border border-purple-500/30">
                Pathao Courier
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Delivery: ৳70 (Dhaka) • ৳130 (Outside Dhaka) • Packaging: ৳30
            </p>
          </div>
        </div>

        <div className="border-t border-purple-500/20 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 MeherMart Bangladesh. Wholesale & Retail Commerce Ecosystem.</p>
          <p className="flex items-center gap-1">
            Built with pride for digital commerce entrepreneurs in Bangladesh 🇧🇩
          </p>
        </div>
      </div>
    </footer>
  );
};
