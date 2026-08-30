import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useResellerCart } from '../../context/ResellerCartContext';
import { useLanguage } from '../../context/LanguageContext';
import { AuthTabType } from '../auth/AuthModal';
import {
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Truck,
  User,
  Shield,
} from 'lucide-react';

interface MobileNavigationDockProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAiDrawer: () => void;
  onOpenTrackingModal: () => void;
  onOpenAuthModal: (tab?: AuthTabType) => void;
}

export const MobileNavigationDock: React.FC<MobileNavigationDockProps> = ({
  currentView,
  onNavigate,
  onOpenAiDrawer,
  onOpenTrackingModal,
  onOpenAuthModal,
}) => {
  const { user, reseller } = useAuth();
  const { t } = useLanguage();
  const { itemCount: customerCartCount, setIsCartOpen: setCustomerCartOpen } = useCart();
  const { itemCount: resellerCartCount, setIsCartOpen: setResellerCartOpen } = useResellerCart();

  const isReseller = user?.role === 'RESELLER';
  const isAdmin = user?.role === 'ADMIN';
  const isResellerVerified = !!(isReseller && reseller && (reseller.isVerified || reseller.status === 'ACTIVE' || reseller.adminApprovedFree));

  const isResellerHubView = ['reseller_hub', 'products', 'orders', 'wallet', 'academy', 'gamification'].includes(currentView);
  const activeCartCount = isResellerHubView && isReseller ? resellerCartCount : customerCartCount;

  const handleCartClick = () => {
    if (isResellerHubView && isReseller) {
      setResellerCartOpen(true);
    } else {
      setCustomerCartOpen(true);
    }
  };

  return (
    <div className="md:hidden fixed bottom-3 inset-x-0 z-50 px-3 pointer-events-none">
      <nav
        aria-label="Mobile Dock Navigation"
        className="max-w-md mx-auto pointer-events-auto cosmic-crystal-dock rounded-3xl p-1.5 flex items-center justify-between gap-1 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(168,85,247,0.25)] border border-purple-500/30"
      >
        {/* 1. Storefront Button */}
        <button
          onClick={() => onNavigate('storefront')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 relative group cursor-pointer ${
            currentView === 'storefront'
              ? 'bg-gradient-to-b from-purple-500/30 to-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.35)] border border-cyan-400/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag
            className={`w-4 h-4 transition-transform duration-300 ${
              currentView === 'storefront' ? 'scale-110 text-cyan-300' : 'group-hover:scale-105'
            }`}
          />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">{t('dock_store', 'Store')}</span>
          {currentView === 'storefront' && (
            <span className="absolute -top-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
          )}
        </button>

        {/* 2. Reseller Hub or Register */}
        {isReseller ? (
          <button
            onClick={() => onNavigate('reseller_hub')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 relative group cursor-pointer ${
              isResellerHubView
                ? isResellerVerified
                  ? 'bg-gradient-to-b from-emerald-500/30 to-teal-500/20 text-emerald-300 shadow-[0_0_15px_rgba(160,185,129,0.35)] border border-emerald-400/40'
                  : 'bg-gradient-to-b from-amber-500/30 to-orange-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.35)] border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Store
              className={`w-4 h-4 transition-transform duration-300 ${
                isResellerHubView
                  ? isResellerVerified
                    ? 'scale-110 text-emerald-300'
                    : 'scale-110 text-amber-300'
                  : 'group-hover:scale-105'
              }`}
            />
            <span className="text-[10px] font-bold mt-0.5 tracking-tight">{t('dock_hub', 'Hub')}</span>
            {isResellerHubView && (
              <span className={`absolute -top-1 w-2 h-2 rounded-full ${isResellerVerified ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'} animate-pulse`} />
            )}
          </button>
        ) : isAdmin ? (
          <button
            onClick={() => onNavigate('admin')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 relative group cursor-pointer ${
              currentView === 'admin'
                ? 'bg-indigo-600/40 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield
              className={`w-4 h-4 transition-transform duration-300 ${
                currentView === 'admin' ? 'scale-110 text-indigo-300' : 'group-hover:scale-105'
              }`}
            />
            <span className="text-[10px] font-bold mt-0.5 tracking-tight">{t('dock_admin', 'Admin')}</span>
            {currentView === 'admin' && (
              <span className="absolute -top-1 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8] animate-pulse" />
            )}
          </button>
        ) : (
          <button
            onClick={() => onOpenAuthModal('reseller_register')}
            className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-amber-300 hover:text-amber-200 transition-all duration-300 group cursor-pointer"
          >
            <div className="relative">
              <Store className="w-4 h-4 group-hover:scale-110 transition-transform text-amber-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24] animate-ping" />
            </div>
            <span className="text-[10px] font-bold mt-0.5 tracking-tight">{t('dock_join', 'Join (৳500)')}</span>
          </button>
        )}

        {/* 3. Center Special AI Assistant Pulsing Capsule */}
        <button
          onClick={onOpenAiDrawer}
          className="relative -top-3 px-3.5 py-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.6),0_0_12px_rgba(6,182,212,0.5)] border border-cyan-300/40 transition-transform active:scale-95 group cursor-pointer"
          aria-label="Open ResellAI Copilot"
        >
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span className="text-[11px] font-black tracking-wider text-white">{t('dock_ai', 'AI')}</span>
          </div>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-cyan-400/80 rounded-full blur-xs" />
        </button>

        {/* 4. Track Order Button */}
        <button
          onClick={onOpenTrackingModal}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-slate-400 hover:text-cyan-300 transition-all duration-300 relative group cursor-pointer"
        >
          <Truck className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">{t('dock_track', 'Track')}</span>
        </button>

        {/* 5. Cart Button with Neon Badge */}
        <button
          onClick={handleCartClick}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-slate-400 hover:text-cyan-300 transition-all duration-300 relative group cursor-pointer"
          aria-label="Open Cart"
        >
          <div className="relative">
            {isResellerHubView && isReseller ? (
              <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform text-cyan-300" />
            ) : (
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            {activeCartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-[9px] flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.9)] animate-bounce">
                {activeCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">{t('dock_cart', 'Cart')}</span>
        </button>

        {/* 6. Account / Login */}
        <button
          onClick={() => {
            if (user) {
              if (isReseller) onNavigate('wallet');
              else if (isAdmin) onNavigate('admin');
              else onNavigate('storefront');
            } else {
              onOpenAuthModal('reseller_login');
            }
          }}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-slate-400 hover:text-slate-200 transition-all duration-300 relative group cursor-pointer"
        >
          {user ? (
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-[0_0_6px_rgba(6,182,212,0.5)]">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
          )}
          <span className="text-[10px] font-bold mt-0.5 tracking-tight truncate max-w-[42px]">
            {user ? t('dock_account', 'Account') : t('login', 'Login')}
          </span>
        </button>
      </nav>
    </div>
  );
};

