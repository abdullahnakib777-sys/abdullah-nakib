import React from 'react';
import { X, ShieldCheck, FileText, Lock, Building2, Phone, Mail, MapPin } from 'lucide-react';

export const PrivacyPolicyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" id="privacy-policy-modal">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0e0c1f] text-slate-100 rounded-3xl shadow-[0_0_60px_rgba(99,102,241,0.35)] overflow-hidden border border-purple-500/40 my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-950/90 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">MeherMart.com - Privacy Policy</h3>
              <p className="text-xs text-cyan-300">Privacy, Security & Data Protection Commitment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-4 bg-purple-950/40 rounded-2xl border border-purple-500/30 space-y-2">
            <p className="font-semibold text-white">
              Welcome to <span className="text-cyan-300 font-bold">MeherMart.com</span>. This Privacy Policy describes how we collect, use, and protect your information when you visit our website, register as a customer or reseller, or use our e-commerce and reselling services in Bangladesh.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-black">1</span>
              <span>Information We Collect</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                <strong className="text-slate-100">Personal Identification Information:</strong> Name, Phone number, Email address, Physical shipping and billing address.
              </li>
              <li>
                <strong className="text-slate-100">Reseller Store & Financial Data:</strong> Store name, social media/Facebook page links, mobile financial service details (bKash/Nagad/Rocket/Bank account number) for processing profit withdrawals.
              </li>
              <li>
                <strong className="text-slate-100">Order & Transaction Data:</strong> Ordered items, recipient contact and address details, parcel tracking numbers, payment method, delivery charges, packaging fees, and profit margins.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-black">2</span>
              <span>How We Use Your Information</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Order fulfillment, nationwide courier dispatch, Cash on Delivery (COD) processing, and delivery status notifications.</li>
              <li>Reseller profit calculations, weekly challenge milestones, gamification XP rewards, and withdrawal payouts.</li>
              <li>Customer support and communication via WhatsApp (01333855344) and email.</li>
              <li>Fraud prevention, account verification, and security protection.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-black">3</span>
              <span>Data Protection & Sharing</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>We do not sell your personal data to third parties.</li>
              <li>Data is only shared with authorized logistics partners (e.g., Steadfast, Pathao Courier) strictly for parcel delivery.</li>
              <li>All communications and passwords are encrypted and protected.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="p-4 bg-[#14122b] rounded-2xl border border-purple-500/40 space-y-3">
            <h4 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Contact & Physical Headquarters</span>
            </h4>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Headquarters Address:</p>
                  <p className="text-slate-300">Savar DOHS, Savar, Dhaka-1344</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">WhatsApp / Support Line:</p>
                  <a href="https://wa.me/8801333855344" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-mono font-bold">
                    01333855344
                  </a>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-purple-500/20">
              By using MeherMart.com or registering on our platform, you acknowledge and agree to the terms outlined in this Privacy Policy.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0a0817] border-t border-purple-500/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
