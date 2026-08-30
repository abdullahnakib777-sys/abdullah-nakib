import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useResellerCart } from '../../context/ResellerCartContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { AuthTabType } from '../auth/AuthModal';
import { MeherMartLogo } from '../common/MeherMartLogo';
import {
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Truck,
  Layers,
  Award,
  BookOpen,
  Shield,
  Search,
  User as UserIcon,
  LogOut,
  Lock,
  ChevronDown,
  Phone,
  CheckCircle2,
  Sun,
  Moon,
  Languages,
} from 'lucide-react';

export const Navbar: React.FC<{
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAiDrawer: () => void;
  onOpenTrackingModal: () => void;
  onOpenAuthModal: (tab?: AuthTabType) => void;
}> = ({
  currentView,
  onNavigate,
  onOpenAiDrawer,
  onOpenTrackingModal,
  onOpenAuthModal,
}) => {
  const { user, reseller, logout } = useAuth();
  const { itemCount: customerCartCount, setIsCartOpen: setCustomerCartOpen } = useCart();
  const { itemCount: resellerCartCount, setIsCartOpen: setResellerCartOpen } = useResellerCart();
  const { theme, isDay, toggleTheme } = useTheme();
  const { isBn, setLanguage, toggleLanguage, t } = useLanguage();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isReseller = user?.role === 'RESELLER';
  const isAdmin = user?.role === 'ADMIN';
  const isResellerVerified = isReseller && reseller && (reseller.isVerified || reseller.status === 'ACTIVE' || reseller.adminApprovedFree);

  // In reseller hub views or for reseller user, we can show reseller cart if they have items or in reseller views
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
    <header className="sticky top-0 z-40 bg-[#0c0d1a]/80 backdrop-blur-xl border-b border-purple-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.6)]" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('storefront')}
              className="flex items-center text-left group"
            >
              <MeherMartLogo size="md" variant="horizontal" theme={isDay ? 'light' : 'dark'} showTagline={true} />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-300">
            <button
              onClick={() => onNavigate('storefront')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                currentView === 'storefront'
                  ? 'bg-purple-600/30 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'hover:bg-purple-950/40 hover:text-white text-slate-300'
              }`}
            >
              {t('public_catalog', 'Public Catalog')}
            </button>

            {isReseller && (
              <>
                <button
                  onClick={() => onNavigate('reseller_hub')}
                  className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                    currentView === 'reseller_hub'
                      ? isResellerVerified
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'hover:bg-purple-950/40 hover:text-white text-slate-300'
                  }`}
                >
                  <Store className={`w-3.5 h-3.5 ${isResellerVerified ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <span>{t('reseller_hub', 'Reseller Hub')}</span>
                  {!isResellerVerified && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      {t('pending_approval', 'Pending')}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onNavigate('leaderboard')}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                    currentView === 'leaderboard'
                      ? 'bg-purple-600/30 text-amber-300 border border-amber-500/40'
                      : 'hover:bg-purple-950/40 hover:text-white text-slate-300'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('leaderboard', 'Leaderboard')}</span>
                </button>

                <button
                  onClick={() => onNavigate('academy')}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                    currentView === 'academy'
                      ? 'bg-purple-600/30 text-cyan-300 border border-cyan-500/40'
                      : 'hover:bg-purple-950/40 hover:text-white text-slate-300'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('academy', 'Academy')}</span>
                </button>
              </>
            )}

            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'bg-indigo-600 text-white font-black shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400'
                    : 'bg-indigo-950/50 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/60'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t('admin_operations', 'Admin Operations')}</span>
              </button>
            )}

            <button
              onClick={onOpenTrackingModal}
              className="px-3 py-1.5 rounded-xl hover:bg-purple-950/40 text-slate-300 hover:text-cyan-300 transition flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('track_order', 'Track Order')}</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* AI Assistant */}
            <button
              onClick={onOpenAiDrawer}
              className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_22px_rgba(6,182,212,0.6)] hover:scale-105 transition"
              id="resell-ai-nav-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">{t('resell_ai', 'ResellAI')}</span>
            </button>

            {/* Language Toggle: English vs বাংলা Segmented Switch */}
            <div
              className="p-0.5 rounded-xl bg-purple-950/80 border border-purple-500/40 shadow-xs flex items-center gap-0.5"
              id="language-toggle-wrapper"
            >
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-2 py-1 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                  isBn
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="বাংলায় দেখুন"
              >
                <span>বাংলা</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                  !isBn
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="View in English"
              >
                <span>EN</span>
              </button>
            </div>

            {/* Theme Toggle Button: Cosmic Night vs Crystalline Day */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 hover:border-cyan-400/50 hover:bg-purple-900/60 text-slate-200 hover:text-cyan-300 transition flex items-center justify-center group cursor-pointer"
              title={isDay ? 'Switch to Cosmic Night theme' : 'Switch to Crystalline Day theme'}
              aria-label="Toggle Cosmic Theme"
              id="theme-toggle-btn"
            >
              {isDay ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-300 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              className="relative p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 hover:border-cyan-400/50 hover:bg-purple-900/60 text-slate-200 hover:text-cyan-300 transition cursor-pointer"
              id="nav-cart-btn"
              title={isResellerHubView && isReseller ? 'View Reseller Multi-Item Cart' : 'View Shopping Cart'}
            >
              {isResellerHubView && isReseller ? (
                <ShoppingCart className="w-4 h-4 text-cyan-300" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
              {activeCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-[10px] font-black flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                  {activeCartCount}
                </span>
              )}
            </button>

            {/* "Join as Reseller" Button */}
            {!isReseller && !isAdmin && (
              <button
                onClick={() => onOpenAuthModal('reseller_register')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.4)] transition transform hover:scale-105 cursor-pointer"
              >
                <Store className="w-3.5 h-3.5" />
                <span>{t('join_reseller_btn', 'Join Reseller (৳500)')}</span>
              </button>
            )}

            {/* Guest / User Profile / Admin Pass Button */}
            {!user ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuthModal('reseller_login')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{t('reseller_login', 'Reseller Login')}</span>
                  <span className="sm:hidden">{t('login', 'Login')}</span>
                </button>

                <button
                  onClick={() => onOpenAuthModal('customer_login')}
                  className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 hover:border-purple-400/60 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1 hidden md:flex cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('customer_login', 'Customer')}</span>
                </button>

                <button
                  onClick={() => onOpenAuthModal('admin_login')}
                  className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 hover:border-indigo-400 hover:text-indigo-300 text-slate-400 text-xs font-bold transition cursor-pointer"
                  title="Admin Access"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 hover:border-cyan-400/50 text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] sm:max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 galaxy-glass-card-static rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-purple-500/20">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{user.phone || user.email}</p>
                      <div className="mt-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          user.role === 'ADMIN'
                            ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                            : user.role === 'RESELLER'
                            ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          ⭐ {user.role} {t('account', 'ACCOUNT')}
                        </span>
                      </div>
                    </div>

                    <div className="py-1 text-xs font-semibold text-slate-300">
                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => {
                            onNavigate('admin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-950/60 hover:text-cyan-300 flex items-center gap-2 cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-indigo-400" />
                          <span>{t('admin_operations', 'Admin Control Center')}</span>
                        </button>
                      )}

                      {user.role === 'RESELLER' && (
                        <>
                          <button
                            onClick={() => {
                              onNavigate('reseller_hub');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-purple-950/60 hover:text-cyan-300 flex items-center gap-2 cursor-pointer"
                          >
                            <Store className="w-4 h-4 text-emerald-400" />
                            <span>{t('reseller_dashboard', 'Reseller Dashboard')}</span>
                          </button>
                          <button
                            onClick={() => {
                              onNavigate('wallet');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-purple-950/60 hover:text-cyan-300 flex items-center gap-2 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>{t('withdraw_btn', 'Wallet & Withdrawals')}</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          onOpenTrackingModal();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-purple-950/60 hover:text-cyan-300 flex items-center gap-2 cursor-pointer"
                      >
                        <Truck className="w-4 h-4 text-cyan-400" />
                        <span>{t('track_order', 'Track My Orders')}</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                          onNavigate('storefront');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-950/60 text-rose-400 flex items-center gap-2 border-t border-purple-500/20 mt-1 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>{t('logout', 'Log Out')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

