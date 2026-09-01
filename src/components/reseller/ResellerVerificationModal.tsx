import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  CreditCard,
  Phone,
  ArrowRight,
  Clock,
} from 'lucide-react';

interface ResellerVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResellerVerificationModal: React.FC<ResellerVerificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { reseller, submitResellerFee, refreshProfile } = useAuth();
  const [payMethod, setPayMethod] = useState<'BKASH' | 'NAGAD' | 'ROCKET'>('BKASH');
  const [paySenderPhone, setPaySenderPhone] = useState(reseller?.whatsappNumber || '');
  const [payTrxId, setPayTrxId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen || !reseller) return null;

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
      setSuccessMsg('500 TK Verification Fee submitted! Admin will verify and activate your store.');
      setTimeout(() => {
        refreshProfile();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit verification payment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
        <div className="bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-black text-base">Reseller Account Verification (৫০০৳)</h3>
              <p className="text-xs text-amber-100">Store: {reseller.storeName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Status banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Status: {reseller.status === 'PENDING' ? 'Pending Approval' : 'Verification Required'}</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Pay <strong>৳500</strong> verification fee via bKash, Nagad, or Rocket to activate full wholesale access, manual order placements, and profit withdrawals.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Payment instructions */}
          <div className="space-y-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
            <p className="font-bold text-slate-800">Send Money (৳500 BDT) to:</p>
            <div className="space-y-1 pt-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-pink-600">bKash (Personal):</span>
                <span className="font-mono font-black text-slate-900">01333855344</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-orange-600">Nagad (Personal):</span>
                <span className="font-mono font-black text-slate-900">01576443668</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-600">Rocket (Personal):</span>
                <span className="font-mono font-black text-slate-900">01576443668</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitFee} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Sender Mobile Number *</label>
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              {isLoading ? <span>Submitting...</span> : <span>Submit 500 TK Verification</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
