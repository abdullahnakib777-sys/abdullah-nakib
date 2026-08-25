import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthTabType } from '../auth/AuthModal';
import {
  ShieldAlert,
  Sparkles,
  Lock,
  Store,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Building2,
  Package,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react';

interface ResellerVerificationGateProps {
  onOpenAuthModal?: (tab: AuthTabType) => void;
  onNavigateTab?: (tab: string) => void;
}

export const ResellerVerificationGate: React.FC<ResellerVerificationGateProps> = ({
  onOpenAuthModal,
  onNavigateTab,
}) => {
  const { user, reseller, submitResellerFee, refreshProfile } = useAuth();
  const [payMethod, setPayMethod] = useState<'BKASH' | 'NAGAD' | 'ROCKET'>('BKASH');
  const [paySenderPhone, setPaySenderPhone] = useState(reseller?.whatsappNumber || reseller?.phone || '');
  const [payTrxId, setPayTrxId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showResubmit, setShowResubmit] = useState(false);

  // If user is not logged in at all or is only a customer
  if (!user || user.role !== 'RESELLER' || !reseller) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Reseller Hub Access Restricted
            </h2>
            <p className="text-sm text-slate-600">
              The Reseller Hub, wholesale pricing catalog, and AI selling tools are exclusively available to registered & verified Shadhin Resellers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <Package className="w-5 h-5 text-emerald-600 mb-1.5" />
              <h4 className="text-xs font-bold text-slate-900">Wholesale Factory Rates</h4>
              <p className="text-[11px] text-slate-500">Buy at factory rates, sell at your desired profit margins.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <TrendingUp className="w-5 h-5 text-amber-500 mb-1.5" />
              <h4 className="text-xs font-bold text-slate-900">Automated COD Delivery</h4>
              <p className="text-[11px] text-slate-500">Nationwide courier delivery with direct profit payouts.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <Sparkles className="w-5 h-5 text-purple-600 mb-1.5" />
              <h4 className="text-xs font-bold text-slate-900">ResellAI Selling Kits</h4>
              <p className="text-[11px] text-slate-500">Bangla ad captions & sales pitches generated automatically.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuthModal?.('reseller_login')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>Sign In as Verified Reseller</span>
            </button>
            <button
              onClick={() => onOpenAuthModal?.('reseller_register')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs shadow-md transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Join as Reseller (৫০০৳)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user is a reseller but not verified
  const hasSubmittedPayment = !!reseller.verificationPayment || reseller.verificationFeePaid;

  const handleSubmitFee = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!paySenderPhone || !payTrxId) {
      setErrorMsg('Please enter your sender mobile number and Transaction ID (TrxID)');
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
      setSuccessMsg('500 TK Verification Fee submitted successfully! Our verification team will review and activate your Reseller Hub within 1-2 hours.');
      setShowResubmit(false);
      await refreshProfile();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit verification payment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Header */}
        <div className="bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black text-amber-200">
                <Lock className="w-3.5 h-3.5" />
                <span>Verification Required</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Reseller Hub Locked &bull; Verification Pending
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100">
                Store: <strong>{reseller.storeName}</strong> &bull; Owner: {user.name} ({reseller.division}, {reseller.district})
              </p>
            </div>
            <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
              <p className="text-[10px] uppercase font-bold text-amber-200">Verification Fee</p>
              <p className="text-2xl font-black text-white">৳৫০০ <span className="text-xs font-normal">BDT</span></p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Status Alert */}
          {hasSubmittedPayment && !showResubmit ? (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-amber-950">
                      Payment Submitted &bull; Verification in Progress
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                      ADMIN REVIEWING
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    We received your verification submission for <strong>৳500 BDT</strong> via{' '}
                    <strong>{reseller.verificationPayment?.method || 'Mobile Banking'}</strong> (Sender: {reseller.verificationPayment?.senderPhone || reseller.whatsappNumber}, TrxID: <span className="font-mono font-bold text-slate-900">{reseller.verificationPayment?.trxId || 'Submitted'}</span>).
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Our admin team verifies transactions 24/7. Once verified, your full Reseller Hub, wholesale pricing, AI selling kits, and order placement features will unlock automatically!
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-200 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => refreshProfile()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Check Verification Status</span>
                </button>

                <button
                  onClick={() => setShowResubmit(true)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
                >
                  Edit / Re-submit Payment Info
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>Complete ৳500 Verification Fee to Unlock Wholesale & Reseller Hub</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                To maintain a high-trust network of genuine retail entrepreneurs and prevent automated spam, Shadhin E-Commerce requires a one-time <strong>৳500 BDT</strong> verification fee. This grants lifetime access to wholesale rates, automated COD dropshipping, and instant bKash/Nagad profit withdrawals.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form & Payment Method */}
          {(!hasSubmittedPayment || showResubmit) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              {/* Instructions */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>1. Send ৳500 BDT via Mobile Banking</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-pink-100 shadow-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-pink-600">
                      <span>bKash (Send Money - Personal)</span>
                      <span className="font-mono text-slate-900 text-sm">01712-345678</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Go to bKash App &gt; Send Money &gt; Enter 500 TK</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-orange-100 shadow-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-orange-600">
                      <span>Nagad (Send Money - Personal)</span>
                      <span className="font-mono text-slate-900 text-sm">01812-345678</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Go to Nagad App &gt; Send Money &gt; Enter 500 TK</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-purple-100 shadow-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-purple-600">
                      <span>Rocket (Send Money - Personal)</span>
                      <span className="font-mono text-slate-900 text-sm">01912-345678-9</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Go to Rocket App &gt; Send Money &gt; Enter 500 TK</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-[11px] font-medium border border-emerald-200">
                  ⚡ <strong>Fast Verification:</strong> Transactions are verified promptly by our automated admin ledger.
                </div>
              </div>

              {/* Submission Form */}
              <form onSubmit={handleSubmitFee} className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>2. Submit Payment Details</span>
                </h3>

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
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span>Verifying & Submitting...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit ৳500 Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Benefits Grid */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
              Included with ৳500 Verification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Factory Wholesale Prices</p>
                  <p className="text-[10px] text-slate-500">Uncapped profit margins on top trending items.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Automated COD Delivery</p>
                  <p className="text-[10px] text-slate-500">RedX, Steadfast, Pathao & Paperfly courier network.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Instant Profit Payouts</p>
                  <p className="text-[10px] text-slate-500">Withdraw earnings directly to bKash/Nagad.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">ResellAI & Academy</p>
                  <p className="text-[10px] text-slate-500">Bangla copywriting tools & sales courses.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
