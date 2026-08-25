import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { api } from './services/api';
import { Product, ProductCategory, Order, Wallet } from './types';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Views
import { StorefrontView } from './components/storefront/StorefrontView';
import { ResellerDashboard } from './components/reseller/ResellerDashboard';
import { ResellerProductsView } from './components/reseller/ResellerProductsView';
import { ResellerOrdersView } from './components/reseller/ResellerOrdersView';
import { WalletView } from './components/reseller/WalletView';
import { LeaderboardView } from './components/reseller/LeaderboardView';
import { AcademyView } from './components/reseller/AcademyView';
import { GamificationView } from './components/reseller/GamificationView';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Modals & Drawers
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { ManualOrderModal } from './components/reseller/ManualOrderModal';
import { ShareAndSellModal } from './components/reseller/ShareAndSellModal';
import { AISellKitModal } from './components/ai/AISellKitModal';
import { ResellAIAssistantDrawer } from './components/ai/ResellAIAssistantDrawer';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { OrderTrackingModal } from './components/storefront/OrderTrackingModal';
import { AuthModal, AuthTabType } from './components/auth/AuthModal';
import { ResellerVerificationModal } from './components/reseller/ResellerVerificationModal';
import { ResellerVerificationGate } from './components/reseller/ResellerVerificationGate';
import { AlertCircle, Sparkles, Store, Shield } from 'lucide-react';

function MainAppContent() {
  const { user, reseller, isLoading: authLoading } = useAuth();
  const { setIsCartOpen } = useCart();

  // Navigation tab
  const [currentView, setCurrentView] = useState<string>('storefront');

  // Shared Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAiKitOpen, setIsAiKitOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('');

  // Auth & Verification Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthTabType>('reseller_login');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Load products & categories on startup
  const loadPlatformData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([api.getProducts(), api.getCategories()]);
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  // Load user-specific orders and wallet
  const loadUserData = async () => {
    if (!user) return;
    try {
      const ordRes = await api.getOrders();
      setOrders(ordRes.orders || []);

      if (user.role === 'RESELLER' || user.role === 'ADMIN') {
        const walRes = await api.getWallet(reseller?.id);
        setWallet(walRes.wallet || null);
      }
    } catch (err) {
      console.error('Failed to load user orders/wallet:', err);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData();
      // Auto redirect to role view if appropriate
      if (user.role === 'ADMIN' && currentView === 'storefront') {
        setCurrentView('admin');
      } else if (user.role === 'RESELLER' && currentView === 'storefront') {
        setCurrentView('reseller_hub');
      }
    }
  }, [user?.id, user?.role, reseller?.id]);

  const handleOpenAuthModal = (tab: AuthTabType = 'reseller_login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  // Handler helpers
  const handleOpenProductDetail = (p: Product) => {
    setSelectedProduct(p);
    setIsProductDetailOpen(true);
  };

  const handleOpenManualOrder = (p?: Product) => {
    if (p) setSelectedProduct(p);
    setIsManualOrderOpen(true);
  };

  const handleOpenShareModal = (p: Product) => {
    setSelectedProduct(p);
    setIsShareModalOpen(true);
  };

  const handleOpenAiKit = (p: Product) => {
    setSelectedProduct(p);
    setIsAiKitOpen(true);
  };

  const handleOrderSuccess = (orderNumber: string) => {
    setTrackingOrderNumber(orderNumber);
    setIsTrackingOpen(true);
    loadUserData();
  };

  const handleOpenTracking = (orderNum?: string) => {
    if (orderNum) setTrackingOrderNumber(orderNum);
    setIsTrackingOpen(true);
  };

  const isReseller = user?.role === 'RESELLER';
  const isAdmin = user?.role === 'ADMIN';
  const isResellerVerified = !!(isReseller && reseller && (reseller.isVerified || reseller.status === 'ACTIVE' || reseller.adminApprovedFree));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Banner for Pending Resellers */}
      {isReseller && !isResellerVerified && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
              <span>
                {reseller?.verificationPayment || reseller?.verificationFeePaid
                  ? 'Reseller Account Verification Pending: Your ৳500 payment is under admin review. Wholesale catalog & order features will unlock once approved.'
                  : 'Reseller Account Pending Verification: Complete ৳500 BDT verification fee (or wait for admin free waiver) to unlock full Reseller Hub & wholesale catalog!'}
              </span>
            </div>
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="px-3.5 py-1 bg-slate-950 text-amber-400 hover:bg-slate-900 rounded-lg text-xs font-black transition shrink-0"
            >
              {reseller?.verificationPayment || reseller?.verificationFeePaid ? 'Check / Edit Payment' : 'Submit 500 TK Fee'}
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
        onOpenTrackingModal={() => handleOpenTracking()}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Sub Navigation Bar for Resellers & Admin */}
      {user && (isReseller || isAdmin) && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs font-bold">
              {[
                { id: 'storefront', label: '🛍️ Public Store' },
                ...(isReseller
                  ? isResellerVerified
                    ? [
                        { id: 'reseller_hub', label: '📊 Reseller Hub' },
                        { id: 'products', label: '🏷️ Wholesale Catalog' },
                        { id: 'orders', label: `📦 Orders (${orders.length})` },
                        { id: 'wallet', label: `💰 Wallet (৳${(wallet?.availableBalance ?? 0).toLocaleString()})` },
                        { id: 'leaderboard', label: '🏆 Leaderboard' },
                        { id: 'academy', label: '🎓 Academy (+XP)' },
                        { id: 'gamification', label: '⭐ Badges & Levels' },
                      ]
                    : [
                        { id: 'reseller_hub', label: '🔒 Reseller Hub (Verification Required ৳৫০০)' },
                        { id: 'leaderboard', label: '🏆 Leaderboard' },
                      ]
                  : [
                      { id: 'admin', label: '🛡️ Admin Operations' },
                      { id: 'leaderboard', label: '🏆 Leaderboard' },
                    ]),
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl transition whitespace-nowrap ${
                    currentView === tab.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'storefront' && (
          <StorefrontView
            products={products}
            categories={categories}
            onOpenProductDetail={handleOpenProductDetail}
            onOpenManualOrder={handleOpenManualOrder}
            onOpenShareModal={handleOpenShareModal}
            onOpenAiKit={handleOpenAiKit}
            onOpenBecomeReseller={() => handleOpenAuthModal('reseller_register')}
            onNavigateTab={setCurrentView}
          />
        )}

        {/* Reseller Hub Route */}
        {currentView === 'reseller_hub' && (
          isResellerVerified && reseller ? (
            <ResellerDashboard
              reseller={reseller}
              orders={orders}
              wallet={wallet}
              products={products}
              onNavigateTab={setCurrentView}
              onOpenManualOrder={handleOpenManualOrder}
              onOpenWithdrawalModal={() => setCurrentView('wallet')}
              onOpenAiChat={() => setIsAiDrawerOpen(true)}
            />
          ) : (
            <ResellerVerificationGate
              onOpenAuthModal={handleOpenAuthModal}
              onNavigateTab={setCurrentView}
            />
          )
        )}

        {/* Wholesale Products Route */}
        {currentView === 'products' && (
          isResellerVerified && reseller ? (
            <ResellerProductsView
              products={products}
              categories={categories}
              reseller={reseller}
              onOpenProductDetail={handleOpenProductDetail}
              onOpenManualOrder={handleOpenManualOrder}
              onOpenShareModal={handleOpenShareModal}
              onOpenAiKit={handleOpenAiKit}
            />
          ) : (
            <ResellerVerificationGate
              onOpenAuthModal={handleOpenAuthModal}
              onNavigateTab={setCurrentView}
            />
          )
        )}

        {/* Reseller Orders Route */}
        {currentView === 'orders' && (
          isResellerVerified && reseller ? (
            <ResellerOrdersView
              orders={orders}
              reseller={reseller}
              onOpenManualOrder={() => handleOpenManualOrder()}
              onOpenTrackingModal={handleOpenTracking}
            />
          ) : (
            <ResellerVerificationGate
              onOpenAuthModal={handleOpenAuthModal}
              onNavigateTab={setCurrentView}
            />
          )
        )}

        {/* Reseller Wallet Route */}
        {currentView === 'wallet' && (
          isResellerVerified && reseller ? (
            <WalletView
              reseller={reseller}
              wallet={wallet}
              onRefreshWallet={loadUserData}
            />
          ) : (
            <ResellerVerificationGate
              onOpenAuthModal={handleOpenAuthModal}
              onNavigateTab={setCurrentView}
            />
          )
        )}

        {/* Public / Shared Leaderboard Route */}
        {currentView === 'leaderboard' && <LeaderboardView />}

        {/* Academy Route */}
        {currentView === 'academy' && (
          isResellerVerified && reseller ? (
            <AcademyView reseller={reseller} />
          ) : (
            <ResellerVerificationGate
              onOpenAuthModal={handleOpenAuthModal}
              onNavigateTab={setCurrentView}
            />
          )
        )}

        {/* Gamification Route */}
        {currentView === 'gamification' && (
          isResellerVerified && reseller ? (
            <GamificationView reseller={reseller} />
          ) : (
            <ResellerVerificationGate
              onOpenAuthModal={handleOpenAuthModal}
              onNavigateTab={setCurrentView}
            />
          )
        )}

        {/* Admin Route */}
        {currentView === 'admin' && user?.role === 'ADMIN' && (
          <AdminDashboard />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={setCurrentView}
        onOpenTrackingModal={() => handleOpenTracking()}
        onOpenBecomeReseller={() => handleOpenAuthModal('reseller_register')}
      />

      {/* Interactive Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        onSuccess={() => {
          loadUserData();
        }}
      />

      <ResellerVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
        onOpenManualOrder={handleOpenManualOrder}
        onOpenShareModal={handleOpenShareModal}
        onOpenAiKit={handleOpenAiKit}
      />

      <ManualOrderModal
        isOpen={isManualOrderOpen}
        onClose={() => setIsManualOrderOpen(false)}
        products={products}
        initialProduct={selectedProduct}
        reseller={reseller}
        onOrderCreated={loadUserData}
      />

      <ShareAndSellModal
        product={selectedProduct}
        reseller={reseller}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenAiKit={handleOpenAiKit}
      />

      <AISellKitModal
        product={selectedProduct}
        isOpen={isAiKitOpen}
        onClose={() => setIsAiKitOpen(false)}
        onOpenShareModal={handleOpenShareModal}
      />

      <ResellAIAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />

      <CartDrawer
        onOpenCheckout={() => {
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderNumber={trackingOrderNumber}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainAppContent />
      </CartProvider>
    </AuthProvider>
  );
}
