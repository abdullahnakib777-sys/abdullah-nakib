import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { AuthTabType } from '../auth/AuthModal';
import {
  ShoppingBag,
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
  const { itemCount, setIsCartOpen } = useCart();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isReseller = user?.role === 'RESELLER';
  const isAdmin = user?.role === 'ADMIN';
  const isResellerVerified = isReseller && reseller && (reseller.isVerified || reseller.status === 'ACTIVE' || reseller.adminApprovedFree);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('storefront')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                <span>স্বাধীন</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base text-slate-900 tracking-tight">Shadhin</span>
                  <span className="font-bold text-base text-emerald-600">E-Commerce</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    BD 🇧🇩
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Nationwide Wholesale & Reselling</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600">
            <button
              onClick={() => onNavigate('storefront')}
              className={`px-3 py-1.5 rounded-xl transition ${
                currentView === 'storefront'
                  ? 'bg-slate-100 text-slate-900'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              Public Catalog
            </button>

            {isReseller && (
              <>
                <button
                  onClick={() => onNavigate('reseller_hub')}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                    currentView === 'reseller_hub'
                      ? isResellerVerified
                        ? 'bg-emerald-50 text-emerald-900 font-bold'
                        : 'bg-amber-50 text-amber-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Store className={`w-3.5 h-3.5 ${isResellerVerified ? 'text-emerald-600' : 'text-amber-500'}`} />
                  <span>Reseller Hub</span>
                  {!isResellerVerified && (
                    <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      Pending
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onNavigate('leaderboard')}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                    currentView === 'leaderboard'
                      ? 'bg-slate-100 text-slate-900'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Leaderboard</span>
                </button>

                <button
                  onClick={() => onNavigate('academy')}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                    currentView === 'academy'
                      ? 'bg-slate-100 text-slate-900'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                  <span>Academy</span>
                </button>
              </>
            )}

            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'bg-indigo-600 text-white font-black shadow-xs'
                    : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Admin Operations</span>
              </button>
            )}

            <button
              onClick={onOpenTrackingModal}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-50 text-slate-600 transition flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5 text-slate-400" />
              <span>Track Order</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* AI Assistant */}
            <button
              onClick={onOpenAiDrawer}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs hover:shadow-md hover:scale-105 transition"
              id="resell-ai-nav-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">ResellAI</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              id="nav-cart-btn"
              title="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>

            {/* "Join as Reseller" Button (Prominent) */}
            {!isReseller && !isAdmin && (
              <button
                onClick={() => onOpenAuthModal('reseller_register')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-sm transition transform hover:scale-[1.02]"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Join as Reseller (৫০০৳)</span>
              </button>
            )}

            {/* Guest / User Profile / Admin Pass Button */}
            {!user ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuthModal('reseller_login')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition flex items-center gap-1"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Reseller Login</span>
                  <span className="sm:hidden">Login</span>
                </button>

                <button
                  onClick={() => onOpenAuthModal('customer_login')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1 hidden md:flex"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Customer</span>
                </button>

                <button
                  onClick={() => onOpenAuthModal('admin_login')}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-xs font-bold transition"
                  title="Admin Access"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] sm:max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{user.phone || user.email}</p>
                      <div className="mt-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          user.role === 'ADMIN'
                            ? 'bg-indigo-100 text-indigo-800'
                            : user.role === 'RESELLER'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {user.role} ACCOUNT
                        </span>
                      </div>
                    </div>

                    <div className="py-1 text-xs font-semibold text-slate-700">
                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => {
                            onNavigate('admin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4 text-indigo-600" />
                          <span>Admin Control Center</span>
                        </button>
                      )}

                      {user.role === 'RESELLER' && (
                        <>
                          <button
                            onClick={() => {
                              onNavigate('reseller_hub');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Store className="w-4 h-4 text-emerald-600" />
                            <span>Reseller Dashboard</span>
                          </button>
                          <button
                            onClick={() => {
                              onNavigate('wallet');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>Wallet & Withdrawals</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          onOpenTrackingModal();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Truck className="w-4 h-4 text-slate-500" />
                        <span>Track My Orders</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                          onNavigate('storefront');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-700 flex items-center gap-2 border-t border-slate-100 mt-1"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Log Out</span>
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
