import React from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2, Phone, MapPin, Sparkles } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-[#0c0a1a] text-slate-200 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.25)] overflow-hidden border border-emerald-500/30 my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">MeherMart Privacy & Security Policy</h3>
              <p className="text-xs text-emerald-300">Official Terms of Reselling & Customer Data Protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs max-h-[70vh] overflow-y-auto leading-relaxed">
          {/* Company details badge */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Savar DOHS, Savar, Dhaka-1344</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold">
              <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>WhatsApp: 01333855344</span>
            </div>
          </div>

          <section className="space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>1. Information We Collect & User Privacy</span>
            </h4>
            <p className="text-slate-300">
              At <strong>MeherMart</strong>, we collect only essential information required to fulfill ecommerce orders, verify wholesale resellers, and process cash-on-delivery (COD) disbursements. This includes your name, verified phone number/WhatsApp, delivery addresses, and payment transaction IDs.
            </p>
            <p className="text-slate-300">
              We never sell, rent, or trade your personal or store customer data to third-party marketing companies. All login credentials and PINs are securely stored in the application database.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>2. Reseller Earnings & Wallet Safety</span>
            </h4>
            <p className="text-slate-300">
              Resellers set their own customer retail selling price above the wholesale factory price. Upon successful delivery by courier (Steadfast / Pathao / Paperfly) and COD collection, the net profit margin is instantly credited to the reseller’s wallet.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
              <li>Packaging fee: Flat 30 TK per order handled professionally by our warehouse team.</li>
              <li>Delivery fees: 70 TK (Inside Dhaka) and 130 TK (Outside Dhaka).</li>
              <li>Withdrawals: Instant payout requests via bKash, Nagad, or Bank with zero hidden deductions.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>3. Product Stock & Return Guarantees</span>
            </h4>
            <p className="text-slate-300">
              All items listed on MeherMart are QC checked before dispatch. If an item runs out of stock, estimated restock arrival dates are transparently displayed in the reseller catalog. Damaged or defective items reported within 48 hours of delivery will be replaced or refunded.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>4. Contacting Official Support</span>
            </h4>
            <p className="text-slate-300">
              For any account verification, product stock inquiry, or order assistance, our helpline is open 7 days a week via WhatsApp at <strong>01333855344</strong> or visit our physical office at Savar DOHS, Dhaka.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md transition"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
