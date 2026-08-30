import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BANGLADESH_DIVISIONS } from '../../data/bangladeshGeo';
import { PrivacyPolicyModal } from '../legal/PrivacyPolicyModal';
import { MeherMartLogo } from '../common/MeherMartLogo';
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
  Eye,
  EyeOff,
  KeyRound,
  RotateCcw,
} from 'lucide-react';

export type AuthTabType =
  | 'reseller_login'
  | 'customer_login'
  | 'customer_register'
  | 'reseller_register'
  | 'admin_login'
  | 'reset_pin';

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
  const { loginWithCredentials, resetPin, loginAdmin, loginWithUserId, registerCustomer, registerReseller, submitResellerFee, demoAccounts } =
    useAuth();

  const [activeTab, setActiveTab] = useState<AuthTabType>(initialTab);

  // Unified login field for Reseller & Customer
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Reset PIN fields
  const [resetPhone, setResetPhone] = useState('');
  const [newPin, setNewPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);

  // Customer registration fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');

  // Reseller registration fields
  const [rName, setRName] = useState('');
  const [rPhone, setRPhone] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPassword, setRPassword] = useState('');
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
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // Privacy Policy modal state
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

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

  const handleResetPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const targetPhone = resetPhone.trim() || phoneOrEmail.trim();
    if (!targetPhone) {
      setErrorMsg('Please enter your registered mobile number or email');
      return;
    }
    if (!newPin || newPin.trim().length < 3) {
      setErrorMsg('Please enter a new PIN or password (minimum 3 characters)');
      return;
    }
    setIsLoading(true);
    try {
      await resetPin(targetPhone, newPin.trim());
      setSuccessMsg('Your new PIN has been set and verified! Welcome to your Reseller account.');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update PIN. Please verify your phone number.');
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
      await registerCustomer(customerName, customerPhone, customerEmail, customerPassword);
      setSuccessMsg('Account created successfully and saved in Cloud Firestore!');
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
        password: rPassword,
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
      {/* Backdrop with cosmic blur */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Floating Central Glass Card with Glowing Violet/Cyan Border */}
      <div className="relative w-full max-w-xl galaxy-glass-card-static rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.35)] overflow-hidden border border-purple-500/40 my-8 transition-all">
        {/* Header Tabs */}
        <div className="bg-[#0f0d22]/90 text-white px-6 pt-5 pb-3 border-b border-purple-500/25">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2.5">
              <MeherMartLogo size="md" variant="horizontal" theme="dark" showTagline={true} />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sub-tabs */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-purple-500/20 overflow-x-auto text-xs font-bold scrollbar-none">
            {/* 1. Reseller Login */}
            <button
              onClick={() => {
                setActiveTab('reseller_login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'reseller_login'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'text-emerald-300 hover:text-white hover:bg-purple-950/40'
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
                  ? 'bg-purple-600/40 text-cyan-300 border border-cyan-400/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/40'
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
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.5)] font-black'
                  : 'text-amber-300 hover:text-amber-100 hover:bg-amber-400/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join Reseller (৫০০৳)</span>
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
                  ? 'bg-purple-600/40 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/40'
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
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                  : 'text-indigo-300 hover:text-white hover:bg-indigo-900/40'
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
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs font-semibold flex flex-col gap-2 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
              {(errorMsg.toLowerCase().includes('pin') || errorMsg.toLowerCase().includes('password')) && activeTab !== 'reset_pin' && (
                <div className="pt-1 border-t border-rose-500/30 flex items-center justify-between">
                  <span className="text-[11px] text-rose-300">Forgot or want to change your PIN?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setResetPhone(phoneOrEmail);
                      setActiveTab('reset_pin');
                      setErrorMsg(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-white font-bold text-[11px] transition flex items-center gap-1 border border-rose-400/30"
                  >
                    <KeyRound className="w-3 h-3 text-amber-300" />
                    <span>Reset PIN Now</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(160,185,129,0.2)]">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: RESELLER LOGIN */}
          {activeTab === 'reseller_login' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-purple-950/40 to-cyan-950/40 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-300 font-black text-sm mb-1">
                  <Store className="w-4 h-4 text-emerald-400" />
                  <span>Reseller Hub & Wholesale Login</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Log in to access your wholesale factory rates, ResellAI selling kits, customer order management, and bKash/Nagad wallet withdrawals.
                </p>
              </div>

              <form onSubmit={(e) => handleLoginSubmit(e, 'RESELLER')} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Registered Mobile / WhatsApp / Email / Referral Code *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 01333855344, email, or RSL-SABBIR88"
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Enter the phone number or store code you used when registering your reseller account.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Password / PIN <span className="text-slate-400 font-normal">(Optional for instant phone login)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetPhone(phoneOrEmail);
                        setActiveTab('reset_pin');
                        setErrorMsg(null);
                      }}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold hover:underline flex items-center gap-1"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Forgot / Reset PIN?</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your PIN or leave blank for instant login"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] transition flex items-center justify-center gap-2"
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
                <div className="pt-3 border-t border-purple-500/20">
                  <p className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Quick Login as Active Verified Reseller:</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {verifiedResellerDemos.slice(0, 2).map((acc) => (
                      <button
                        key={acc.user.id}
                        type="button"
                        onClick={() => handleQuickDemoLogin(acc.user.id, acc.user.name)}
                        className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-left transition flex items-center justify-between shadow-xs"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{acc.reseller?.storeName || acc.user.name}</p>
                          <p className="text-[10px] text-emerald-300 font-mono">
                            {acc.user.phone} &bull; <span className="font-bold text-cyan-300">Verified ✓</span>
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Footers */}
              <div className="pt-2 text-center border-t border-purple-500/20 flex flex-wrap items-center justify-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('reseller_register')}
                  className="font-bold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Not a reseller yet? Join (৫০০৳)</span>
                </button>
                <span className="text-purple-500/40">•</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('customer_login')}
                  className="font-bold text-cyan-300 hover:text-white hover:underline"
                >
                  Sign in as Customer
                </button>
              </div>
            </div>
          )}

          {/* TAB: RESET PIN */}
          {activeTab === 'reset_pin' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-purple-950/50 to-indigo-950/50 border border-cyan-500/30">
                <div className="flex items-center gap-2 text-cyan-300 font-black text-sm mb-1">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  <span>Set / Reset Your Reseller PIN</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter your registered mobile number (such as <span className="font-mono text-cyan-300 font-bold">01333855344</span>) and your new PIN to instantly update your credentials and access your dashboard.
                </p>
              </div>

              <form onSubmit={handleResetPinSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Registered Mobile Number / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 01333855344"
                      value={resetPhone || phoneOrEmail}
                      onChange={(e) => {
                        setResetPhone(e.target.value);
                        setPhoneOrEmail(e.target.value);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    New PIN / Password * <span className="text-slate-400 font-normal">(e.g. 4-6 digits or text)</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                    <input
                      type={showNewPin ? 'text' : 'password'}
                      required
                      placeholder="Enter new PIN (e.g. 1234 or your secret PIN)"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPin(!showNewPin)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-0.5"
                    >
                      {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    This will immediately become your official login PIN for this mobile number.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span>Saving New PIN...</span>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Save New PIN & Log In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center border-t border-purple-500/20">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('reseller_login');
                      setErrorMsg(null);
                    }}
                    className="text-xs font-bold text-slate-300 hover:text-white hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <span>&larr; Back to Reseller Login</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: CUSTOMER LOGIN */}
          {activeTab === 'customer_login' && (
            <form onSubmit={(e) => handleLoginSubmit(e, 'CUSTOMER')} className="space-y-4">
              <div className="text-center pb-2">
                <h4 className="text-base font-black text-white">Welcome Customer</h4>
                <p className="text-xs text-slate-400">Log in to track your retail orders and shopping cart</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Mobile Number / Email *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="01XXXXXXXXX or email"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Password / PIN (Optional)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="Enter password or leave blank for instant login"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.4)] transition flex items-center justify-center gap-2"
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

              <div className="pt-3 text-center border-t border-purple-500/20 flex items-center justify-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('reseller_login')}
                  className="font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Are you a Reseller? Sign In Here</span>
                </button>
                <span className="text-purple-500/40">•</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('customer_register')}
                  className="font-bold text-cyan-300 hover:underline"
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
                <h4 className="text-base font-black text-white">Create Customer Account</h4>
                <p className="text-xs text-slate-400">Quick sign-up to enjoy Cash on Delivery e-commerce shopping</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Mobile Phone (Bangladeshi) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address (Optional)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Create Password / PIN *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Set a password (e.g. 123456)"
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                  />
                </div>
                <p className="text-[10px] text-emerald-300 mt-1">
                  ☁️ Securely remembered in database — log back in anytime with your Phone & Password!
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center justify-center gap-2"
              >
                {isLoading ? <span>Creating Account...</span> : <span>Create Account & Continue</span>}
              </button>

              <p className="text-[10px] text-center text-slate-400">
                By registering, you agree to MeherMart's{' '}
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="text-cyan-300 underline font-semibold hover:text-cyan-200"
                >
                  Privacy & Terms Policy
                </button>
              </p>

              <div className="pt-1 text-center text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('customer_login')}
                  className="font-bold text-cyan-300 hover:underline"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: JOIN AS RESELLER */}
          {activeTab === 'reseller_register' && (
            <div>
              {resellerStep === 'form' ? (
                <form onSubmit={handleResellerRegisterSubmit} className="space-y-4">
                  {/* Reseller Perks Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-cyan-500/15 border border-amber-400/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span>Reseller Program & Verification</span>
                      </span>
                      <span className="text-[11px] font-extrabold text-amber-950 bg-gradient-to-r from-amber-300 to-amber-400 px-2.5 py-0.5 rounded-full shadow-xs">
                        Fee: ৫০০৳ TK
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Join 1,200+ active online entrepreneurs. Sell 500+ factory wholesale items with ৳200–৳1,000 profit margin per order. Nationwide COD, courier packaging, and instant wallet payouts included.
                    </p>
                    <div className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/60 border border-emerald-500/30 p-2 rounded-xl flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Note: You can pay 500 TK via bKash/Nagad or request free approval by platform admin!</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Abdullah Nakib"
                        value={rName}
                        onChange={(e) => setRName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="01XXXXXXXXX"
                        value={rPhone}
                        onChange={(e) => setRPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Store / Page Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Trendy BD Mart"
                        value={rStoreName}
                        onChange={(e) => setRStoreName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Facebook Page / Link (Optional)</label>
                      <input
                        type="text"
                        placeholder="facebook.com/yourpage"
                        value={rFacebook}
                        onChange={(e) => setRFacebook(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Division *</label>
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
                        className="w-full px-3.5 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium bg-[#141226]"
                      >
                        {Object.keys(BANGLADESH_DIVISIONS).map((divKey) => (
                          <option key={divKey} value={divKey} className="bg-[#141226] text-white">
                            {BANGLADESH_DIVISIONS[divKey].name} ({BANGLADESH_DIVISIONS[divKey].nameBn})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">District *</label>
                      <select
                        value={rDistrict}
                        onChange={(e) => setRDistrict(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium bg-[#141226]"
                      >
                        {Object.keys(BANGLADESH_DIVISIONS[rDivision]?.districts || {}).map((distKey) => (
                          <option key={distKey} value={distKey} className="bg-[#141226] text-white">
                            {BANGLADESH_DIVISIONS[rDivision].districts[distKey].name} ({BANGLADESH_DIVISIONS[rDivision].districts[distKey].nameBn})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Full Present Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="Road / House / Area, Upazila"
                        value={rAddress}
                        onChange={(e) => setRAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Create Password / PIN *</label>
                      <input
                        type="password"
                        required
                        placeholder="Set password for your store"
                        value={rPassword}
                        onChange={(e) => setRPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium border-emerald-500/40"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(251,191,36,0.4)] transition flex items-center justify-center gap-2"
                  >
                    <span>Register & Proceed to Verification (৫০০৳)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-center text-slate-400">
                    By registering as a Reseller, you agree to MeherMart's{' '}
                    <button
                      type="button"
                      onClick={() => setIsPrivacyModalOpen(true)}
                      className="text-amber-300 underline font-semibold hover:text-amber-200"
                    >
                      Reseller Terms & Privacy Policy
                    </button>
                  </p>

                  <div className="pt-1 text-center text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab('reseller_login')}
                      className="font-bold text-emerald-400 hover:underline"
                    >
                      Already registered as a Reseller? Click here to Log In
                    </button>
                  </div>
                </form>
              ) : (
                /* Payment Verification Step */
                <form onSubmit={handleResellerPaymentSubmit} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-950/50 border border-purple-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>500 TK Verification Fee Payment</span>
                      <span className="text-base font-black text-amber-400">৳500 BDT</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Send <strong>৳500</strong> to any of our official merchant / personal numbers below using <strong>Send Money</strong>:
                    </p>
                    <div className="space-y-1.5 bg-[#0e0c1f] p-3 rounded-xl border border-purple-500/30 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-pink-400">bKash (Personal):</span>
                        <span className="font-mono font-bold text-cyan-300">01712-345678</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-orange-400">Nagad (Personal):</span>
                        <span className="font-mono font-bold text-cyan-300">01812-345678</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-400">Rocket:</span>
                        <span className="font-mono font-bold text-cyan-300">01912-345678-9</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Payment Method *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['BKASH', 'NAGAD', 'ROCKET'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setPayMethod(m)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                            payMethod === m
                              ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                              : 'border-purple-500/30 bg-purple-950/30 hover:bg-purple-900/40 text-slate-300'
                          }`}
                        >
                          {m === 'BKASH' ? 'bKash' : m === 'NAGAD' ? 'Nagad' : 'Rocket'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Your Sender Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={paySenderPhone}
                      onChange={(e) => setPaySenderPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Transaction ID (TrxID) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9K72LM8Q"
                      value={payTrxId}
                      onChange={(e) => setPayTrxId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl galaxy-glass-input text-xs font-mono font-bold uppercase tracking-wider"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] transition flex items-center justify-center gap-2"
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
              <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 text-indigo-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-indigo-300">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Restricted Founder / Admin Access</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Only authorized admin ID & password can access the central operations control panel, manage wholesale products, create challenges, and upload academy lessons.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Admin ID / Email *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter authorized Admin email or ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Secret Master Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter Admin Password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl galaxy-glass-input text-xs font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(99,102,241,0.5)] transition flex items-center justify-center gap-2"
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

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
};
