import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BANGLADESH_DIVISIONS } from '../../data/bangladeshGeo';
import {
  X,
  UserCheck,
  ShieldCheck,
  Store,
  Lock,
  Phone,
  Mail,
  User as UserIcon,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  CreditCard,
  Building2,
  Zap,
} from 'lucide-react';

export type AuthTabType =
  | 'reseller_login'
  | 'customer_login'
  | 'customer_register'
  | 'reseller_register'
  | 'admin_login';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: AuthTabType;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'reseller_login',
  onSuccess,
}) => {
  const { loginWithCredentials, loginAdmin, loginWithUserId, registerCustomer, registerReseller, submitResellerFee, demoAccounts } =
    useAuth();

  const [activeTab, setActiveTab] = useState<AuthTabType>(initialTab);

  // Unified login field for Reseller & Customer
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');

  // Customer registration fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Reseller registration fields
  const [rName, setRName] = useState('');
  const [rPhone, setRPhone] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rStoreName, setRStoreName] = useState('');
  const [rFacebook, setRFacebook] = useState('');
  const [rDivision, setRDivision] = useState('Dhaka');
  const [rDistrict, setRDistrict] = useState('Dhaka');
  const [rAddress, setRAddress] = useState('');
  const [rSalesIntent, setRSalesIntent] = useState('Facebook Marketplace & WhatsApp');

  // Reseller 500 TK step
  const [resellerStep, setResellerStep] = useState<'form' | 'payment'>('form');
  const [payMethod, setPayMethod] = useState<'BKASH' | 'NAGAD' | 'ROCKET'>('BKASH');
  const [paySenderPhone, setPaySenderPhone] = useState('');
  const [payTrxId, setPayTrxId] = useState('');

  // Admin login fields
  const [adminId, setAdminId] = useState('abdullahnakib777@gmail.com');
  const [adminPass, setAdminPass] = useState('admin1234');

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent, roleHint: 'RESELLER' | 'CUSTOMER') => {
    e.preventDefault();
    setErrorMsg(null);
    if (!phoneOrEmail) {
      setErrorMsg('Please enter your phone number, email, or Referral Code');
      return;
    }
    setIsLoading(true);
    try {
      await loginWithCredentials(phoneOrEmail, password);
      setSuccessMsg(`Welcome back! Logged into your ${roleHint === 'RESELLER' ? 'Reseller' : 'Customer'} account.`);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your phone number or referral code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (userId: string, name: string) => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await loginWithUserId(userId);
      setSuccessMsg(`Logged in as ${name}!`);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 400);
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!customerName || !customerPhone) {
      setErrorMsg('Name and Phone number are required');
      return;
    }
    setIsLoading(true);
    try {
      await registerCustomer(customerName, customerPhone, customerEmail);
      setSuccessMsg('Account created successfully!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResellerRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!rName || !rPhone || !rStoreName || !rAddress) {
      setErrorMsg('Please fill in all mandatory fields');
      return;
    }
    setIsLoading(true);
    try {
      await registerReseller({
        name: rName,
        phone: rPhone,
        email: rEmail,
        storeName: rStoreName,
        facebookPage: rFacebook,
        whatsappNumber: rPhone,
        division: rDivision,
        district: rDistrict,
        address: rAddress,
        salesIntent: rSalesIntent,
      });

      // Move to 500 TK verification step
      setPaySenderPhone(rPhone);
      setResellerStep('payment');
      setSuccessMsg('Registration submitted! Complete 500 TK verification to activate your reseller account.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Reseller registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResellerPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!paySenderPhone || !payTrxId) {
      setErrorMsg('Please provide your sender mobile number and Transaction ID (TrxID)');
      return;
    }
    setIsLoading(true);
    try {
      await submitResellerFee({
        method: payMethod,
        senderPhone: paySenderPhone,
        trxId: payTrxId,
        amount: 500,
      });
      setSuccessMsg('500 TK Verification Fee submitted! Admin will verify and activate your store.');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit payment verification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!adminId || !adminPass) {
      setErrorMsg('Admin ID and Password are required');
      return;
    }
    setIsLoading(true);
    try {
      await loginAdmin(adminId, adminPass);
      setSuccessMsg('Master Admin authenticated successfully!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Access Denied. Invalid Admin Credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifiedResellerDemos = demoAccounts.filter(
    (a) => a.user.role === 'RESELLER' && (a.reseller?.isVerified || a.reseller?.status === 'ACTIVE')
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Dialog Card */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8 transition-all">
        {/* Header Tabs */}
        <div className="bg-slate-900 text-white px-6 pt-5 pb-3">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-base">
                স্বাধীন
              </span>
              <div>
                <h3 className="font-black text-lg text-white">Shadhin E-Commerce & Reselling</h3>
                <p className="text-[11px] text-slate-400">Bangladesh Multi-Vendor Wholesale & Retail Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sub-tabs */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800 overflow-x-auto text-xs font-bold scrollbar-none">
            {/* 1. Reseller Login */}
            <button
              onClick={() => {
                setActiveTab('reseller_login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'reseller_login'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                  : 'text-emerald-300 hover:text-emerald-100 hover:bg-emerald-950/40'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Reseller Login</span>
            </button>

            {/* 2. Customer Login */}
            <button
              onClick={() => {
                setActiveTab('customer_login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                activeTab === 'customer_login'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Customer Login
            </button>

            {/* 3. Reseller Registration */}
            <button
              onClick={() => {
                setActiveTab('reseller_register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'reseller_register'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-amber-300 hover:text-amber-200 hover:bg-amber-400/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join as Reseller (৫০০৳)</span>
            </button>

            {/* 4. Customer Registration */}
            <button
              onClick={() => {
                setActiveTab('customer_register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`px-3 py-2 rounded-xl transition whitespace-nowrap ${
                activeTab === 'customer_register'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              New Customer
            </button>

            {/* 5. Admin Pass */}
            <button
              onClick={() => {
                setActiveTab('admin_login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`px-2.5 py-2 rounded-xl transition flex items-center gap-1 whitespace-nowrap ml-auto ${
                activeTab === 'admin_login'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-indigo-300 hover:text-indigo-200 hover:bg-indigo-900/30'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: RESELLER LOGIN (FIRST CLASS) */}
          {activeTab === 'reseller_login' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200/80">
                <div className="flex items-center gap-2 text-emerald-900 font-black text-sm mb-1">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span>Reseller Hub & Wholesale Login</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Log in to access your wholesale factory rates, ResellAI selling kits, customer order management, and bKash/Nagad wallet withdrawals.
                </p>
              </div>

              <form onSubmit={(e) => handleLoginSubmit(e, 'RESELLER')} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Registered Mobile / WhatsApp / Email / Referral Code *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 01812345678, email, or RSL-SABBIR88"
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Enter the phone number or store code you used when registering your reseller account.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Password / PIN <span className="text-slate-400 font-normal">(Optional for phone/code login)</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      placeholder="Enter password or leave blank for instant login"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span>Verifying Reseller Account...</span>
                  ) : (
                    <>
                      <Store className="w-4 h-4" />
                      <span>Log In to Reseller Hub</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Verified Demo Reseller Quick Logins */}
              {verifiedResellerDemos.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>Quick Login as Active Verified Reseller:</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {verifiedResellerDemos.slice(0, 2).map((acc) => (
                      <button
                        key={acc.user.id}
                        type="button"
                        onClick={() => handleQuickDemoLogin(acc.user.id, acc.user.name)}
                        className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-left transition flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{acc.reseller?.storeName || acc.user.name}</p>
                          <p className="text-[10px] text-emerald-800 font-mono">
                            {acc.user.phone} &bull; <span className="font-bold text-emerald-600">Verified ✓</span>
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Footers */}
              <div className="pt-2 text-center border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('reseller_register')}
                  className="font-bold text-amber-600 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Not a reseller yet? Join (৫০০৳)</span>
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('customer_login')}
                  className="font-bold text-slate-600 hover:text-slate-900 hover:underline"
                >
                  Sign in as Customer
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOMER LOGIN */}
          {activeTab === 'customer_login' && (
            <form onSubmit={(e) => handleLoginSubmit(e, 'CUSTOMER')} className="space-y-4">
              <div className="text-center pb-2">
                <h4 className="text-base font-black text-slate-900">Welcome Customer</h4>
                <p className="text-xs text-slate-500">Log in to track your retail orders and shopping cart</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number / Email *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="01XXXXXXXXX or email"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password / PIN (Optional)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="Enter password or leave blank for instant login"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>Log In as Customer</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-3 text-center border-t border-slate-100 flex items-center justify-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('reseller_login')}
                  className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Are you a Reseller? Sign In Here</span>
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('customer_register')}
                  className="font-bold text-slate-600 hover:underline"
                >
                  New Customer
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CUSTOMER REGISTER */}
          {activeTab === 'customer_register' && (
            <form onSubmit={handleCustomerRegister} className="space-y-4">
              <div className="text-center pb-2">
                <h4 className="text-base font-black text-slate-900">Create Customer Account</h4>
                <p className="text-xs text-slate-500">Quick sign-up to enjoy Cash on Delivery e-commerce shopping</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Phone (Bangladeshi) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address (Optional)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                {isLoading ? <span>Creating Account...</span> : <span>Create Account & Continue</span>}
              </button>

              <div className="pt-2 text-center text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('customer_login')}
                  className="font-bold text-slate-600 hover:underline"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: JOIN AS RESELLER (500 TK FEE FLOW) */}
          {activeTab === 'reseller_register' && (
            <div>
              {resellerStep === 'form' ? (
                <form onSubmit={handleResellerRegisterSubmit} className="space-y-4">
                  {/* Reseller Perks Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-300/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Reseller Program & Verification</span>
                      </span>
                      <span className="text-[11px] font-extrabold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                        Fee: ৫০০৳ TK
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Join 1,200+ active online entrepreneurs. Sell 500+ factory wholesale items with ৳200–৳1,000 profit margin per order. Nationwide COD, courier packaging, and instant wallet payouts included.
                    </p>
                    <div className="text-[10px] text-emerald-800 font-semibold bg-emerald-100/60 p-2 rounded-xl flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Note: You can pay 500 TK via bKash/Nagad or request free approval by platform admin!</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Abdullah Nakib"
                        value={rName}
                        onChange={(e) => setRName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="01XXXXXXXXX"
                        value={rPhone}
                        onChange={(e) => setRPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Store / Page Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Trendy BD Mart"
                        value={rStoreName}
                        onChange={(e) => setRStoreName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Facebook Page / Link (Optional)</label>
                      <input
                        type="text"
                        placeholder="facebook.com/yourpage"
                        value={rFacebook}
                        onChange={(e) => setRFacebook(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Division *</label>
                      <select
                        value={rDivision}
                        onChange={(e) => {
                          const newDiv = e.target.value;
                          setRDivision(newDiv);
                          const divData = BANGLADESH_DIVISIONS[newDiv];
                          if (divData) {
                            const firstDist = Object.keys(divData.districts)[0] || newDiv;
                            setRDistrict(firstDist);
                          }
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                      >
                        {Object.keys(BANGLADESH_DIVISIONS).map((divKey) => (
                          <option key={divKey} value={divKey}>
                            {BANGLADESH_DIVISIONS[divKey].name} ({BANGLADESH_DIVISIONS[divKey].nameBn})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">District *</label>
                      <select
                        value={rDistrict}
                        onChange={(e) => setRDistrict(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                      >
                        {Object.keys(BANGLADESH_DIVISIONS[rDivision]?.districts || {}).map((distKey) => (
                          <option key={distKey} value={distKey}>
                            {BANGLADESH_DIVISIONS[rDivision].districts[distKey].name} ({BANGLADESH_DIVISIONS[rDivision].districts[distKey].nameBn})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Present Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Road / House / Area, Upazila"
                      value={rAddress}
                      onChange={(e) => setRAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <span>Register & Proceed to Verification (৫০০৳)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab('reseller_login')}
                      className="font-bold text-emerald-700 hover:underline"
                    >
                      Already registered as a Reseller? Click here to Log In
                    </button>
                  </div>
                </form>
              ) : (
                /* Payment Verification Step */
                <form onSubmit={handleResellerPaymentSubmit} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span>500 TK Verification Fee Payment</span>
                      <span className="text-base font-black text-emerald-700">৳500 BDT</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Send <strong>৳500</strong> to any of our official merchant / personal numbers below using <strong>Send Money</strong>:
                    </p>
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-emerald-200 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-pink-600">bKash (Personal):</span>
                        <span className="font-mono font-bold text-slate-900">01712-345678</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-orange-600">Nagad (Personal):</span>
                        <span className="font-mono font-bold text-slate-900">01812-345678</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-600">Rocket:</span>
                        <span className="font-mono font-bold text-slate-900">01912-345678-9</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Payment Method *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['BKASH', 'NAGAD', 'ROCKET'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setPayMethod(m)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                            payMethod === m
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {m === 'BKASH' ? 'bKash' : m === 'NAGAD' ? 'Nagad' : 'Rocket'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Sender Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={paySenderPhone}
                      onChange={(e) => setPaySenderPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Transaction ID (TrxID) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9K72LM8Q"
                      value={payTrxId}
                      onChange={(e) => setPayTrxId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden uppercase"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    {isLoading ? <span>Submitting...</span> : <span>Submit 500 TK Verification</span>}
                  </button>

                  <p className="text-center text-[11px] text-slate-400">
                    Admin can also freely approve your store without fee from the admin portal.
                  </p>
                </form>
              )}
            </div>
          )}

          {/* TAB 5: MASTER ADMIN LOGIN */}
          {activeTab === 'admin_login' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-indigo-900">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Restricted Founder / Admin Access</span>
                </div>
                <p className="text-[11px] text-indigo-800/80 leading-relaxed">
                  Only authorized admin ID & password can access the central operations control panel, manage wholesale products, create challenges, and upload academy lessons.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Admin ID / Email *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="admin or abdullahnakib777@gmail.com"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Secret Master Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter Admin Password (e.g. admin1234)"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Access Admin Panel</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
