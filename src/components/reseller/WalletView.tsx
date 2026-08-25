import React, { useState, useEffect } from 'react';
import { Wallet, WalletTransaction, WithdrawalRequest, ResellerProfile } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../common/Badge';
import {
  Wallet as WalletIcon,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  RefreshCw,
  X,
  CreditCard,
  Building,
  Smartphone,
} from 'lucide-react';

export const WalletView: React.FC<{
  reseller: ResellerProfile;
  wallet: Wallet | null;
  onRefreshWallet: () => void;
}> = ({ reseller, wallet, onRefreshWallet }) => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Form states
  const [amount, setAmount] = useState<number>(500);
  const [method, setMethod] = useState<'BKASH' | 'NAGAD' | 'BANK'>('BKASH');
  const [accountNumber, setAccountNumber] = useState(reseller.whatsappNumber || '');
  const [accountName, setAccountName] = useState(reseller.storeName || '');
  const [bankName, setBankName] = useState('BRAC Bank PLC');
  const [branchName, setBranchName] = useState('Dhaka Main');
  const [routingNumber, setRoutingNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await api.getWallet(reseller.id);
      setTransactions(res.transactions || []);
      setWithdrawals(res.withdrawals || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [reseller.id]);

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 100) {
      setError('Minimum withdrawal amount is ৳100');
      return;
    }
    if (!accountNumber) {
      setError('Account number is required');
      return;
    }
    if (wallet && amount > wallet.availableBalance) {
      setError(`Requested amount exceeds available balance (৳${wallet.availableBalance})`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await api.requestWithdrawal({
        resellerId: reseller.id,
        amount,
        method,
        accountNumber,
        accountName,
        bankName: method === 'BANK' ? bankName : undefined,
        branchName: method === 'BANK' ? branchName : undefined,
        routingNumber: method === 'BANK' ? routingNumber : undefined,
      });

      setSuccessMsg('Withdrawal request submitted! Payout will be sent within 24 hours via ' + method);
      setIsWithdrawModalOpen(false);
      onRefreshWallet();
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to submit withdrawal request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" id="reseller-wallet-view">
      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-900 font-bold">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Available Balance Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider text-emerald-100 font-bold">
              Available For Withdrawal
            </span>
            <div className="p-2 bg-white/15 rounded-xl backdrop-blur-md">
              <WalletIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black">
              ৳{(wallet?.availableBalance ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-emerald-100/90 mt-1">
              Guaranteed settled profits from delivered customer orders
            </p>
          </div>
          <button
            onClick={() => {
              setError(null);
              setIsWithdrawModalOpen(true);
            }}
            disabled={!wallet || wallet.availableBalance < 100}
            className="w-full py-3 px-4 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs transition shadow-md disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Withdraw to bKash / Nagad / Bank</span>
          </button>
        </div>

        {/* Pending Balance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Pending Profit
            </span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600">
            ৳{(wallet?.pendingBalance ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Reserved earnings for orders in packaging or courier transit. Released instantly upon successful delivery.
          </p>
        </div>

        {/* Lifetime Earnings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Lifetime Earnings
            </span>
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            ৳{(wallet?.lifetimeEarnings ?? 0).toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>0% Platform Withdrawal Surcharge</span>
          </div>
        </div>
      </div>

      {/* Withdrawals List */}
      {withdrawals.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Your Withdrawal Payout Requests</h3>
            <span className="text-xs text-slate-400">{withdrawals.length} requests</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method & Account</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Trx ID / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50">
                    <td className="p-4 text-slate-500">{w.requestedAt ? new Date(w.requestedAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4 font-bold text-slate-900">৳{(w.amount ?? 0).toLocaleString()}</td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800">{w.method}</span> • {w.accountNumber}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={w.status} />
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-[11px]">
                      {w.transactionId || w.adminNote || 'Processing'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Immutable Ledger Transactions */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Wallet Transaction Ledger</h3>
            <p className="text-xs text-slate-400">Complete audit log of profit releases and payouts</p>
          </div>
          <button
            onClick={loadData}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Type</th>
                <th className="p-4">Description</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => {
                const isCredit = tx.type === 'PROFIT_RELEASE' || tx.type === 'BONUS' || tx.type === 'REFUND';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/50">
                    <td className="p-4 text-slate-500">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4">
                      <span className="font-mono text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700">{tx.description}</td>
                    <td className="p-4 font-bold">
                      <span className={isCredit ? 'text-emerald-700' : 'text-slate-900'}>
                        {isCredit ? '+' : '-'}৳{(tx.amount ?? 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900">
                      ৳{(tx.balanceAfter ?? 0).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No transactions recorded yet. Delivered orders will credit your wallet balance here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Request Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsWithdrawModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WalletIcon className="w-5 h-5 text-white" />
                <h3 className="font-bold text-base">Request Profit Payout</h3>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawalSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Withdrawal Amount (৳)
                </label>
                <input
                  type="number"
                  min="100"
                  max={wallet?.availableBalance || 100000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-base font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Available: ৳{(wallet?.availableBalance ?? 0).toLocaleString()} (Min: ৳100)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payout Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('BKASH')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition ${
                      method === 'BKASH'
                        ? 'border-pink-600 bg-pink-50 text-pink-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    bKash
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('NAGAD')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition ${
                      method === 'NAGAD'
                        ? 'border-amber-600 bg-amber-50 text-amber-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Nagad
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('BANK')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition ${
                      method === 'BANK'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Bank
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {method === 'BANK' ? 'Bank Account Number *' : `${method} Personal / Merchant Number *`}
                </label>
                <input
                  type="text"
                  required
                  placeholder="01XXXXXXXXX"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl"
                />
              </div>

              {method === 'BANK' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
