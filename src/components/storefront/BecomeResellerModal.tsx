import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BANGLADESH_DIVISIONS } from '../../data/bangladeshGeo';
import { triggerLevelUpCelebration } from '../common/ConfettiTrigger';
import { Store, ShieldCheck, Sparkles, X, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const BecomeResellerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { registerReseller } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [storeName, setStoreName] = useState('');
  const [facebookPage, setFacebookPage] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Mirpur');
  const [address, setAddress] = useState('');
  const [salesIntent, setSalesIntent] = useState('Facebook & WhatsApp Online Selling');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [referredBy, setReferredBy] = useState(() => {
    try {
      return localStorage.getItem('mehermart_referral_code') || '';
    } catch {
      return '';
    }
  });

  if (!isOpen) return null;

  const currentDistricts = BANGLADESH_DIVISIONS[division]?.districts || {};
  const currentUpazilas = currentDistricts[district]?.upazilas || [district];

  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const divData = BANGLADESH_DIVISIONS[newDiv];
    if (divData) {
      const firstDistKey = Object.keys(divData.districts)[0];
      setDistrict(firstDistKey);
      const firstUpazila = divData.districts[firstDistKey]?.upazilas[0] || firstDistKey;
      setUpazila(firstUpazila);
    }
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const divData = BANGLADESH_DIVISIONS[division];
    const upazilas = divData?.districts[newDist]?.upazilas || [newDist];
    setUpazila(upazilas[0] || newDist);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !storeName || !address) {
      setError('Please fill in your name, phone, store name, and address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await registerReseller({
        name,
        phone,
        email,
        storeName,
        facebookPage,
        whatsappNumber: whatsappNumber || phone,
        division,
        district,
        upazila,
        address,
        salesIntent,
        referredBy: referredBy.trim() || undefined,
      });

      triggerLevelUpCelebration();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to register as reseller');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" id="become-reseller-modal">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Store className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Start Zero-Investment Reselling</h3>
              <p className="text-xs text-emerald-100">
                Join 500+ top earning entrepreneurs across Bangladesh!
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Nusrat Jahan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
              <input
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Online Store / Brand Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Trendy Cart BD"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook Page / Profile Link</label>
              <input
                type="text"
                placeholder="facebook.com/yourpage (optional)"
                value={facebookPage}
                onChange={(e) => setFacebookPage(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Division</label>
              <select
                value={division}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-xl"
              >
                {Object.keys(BANGLADESH_DIVISIONS).map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-xl"
              >
                {Object.keys(currentDistricts).map((dist) => (
                  <option key={dist} value={dist}>
                    {currentDistricts[dist].name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Upazila / Area</label>
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-xl"
              >
                {currentUpazilas.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Present Address *</label>
            <input
              type="text"
              required
              placeholder="House, Road, Area for verification"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Referral / Sponsor Code <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. RSL-BD100"
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl font-mono uppercase"
            />
            {referredBy && (
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                ✓ Sponsor referral code detected: +250 XP bonus unlocked!
              </p>
            )}
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>What You Get As A MeherMart Reseller:</span>
            </div>
            <p>• Access to factory wholesale pricing on 500+ verified trending items</p>
            <p>• Automated courier packaging & Cash-on-Delivery nationwide</p>
            <p>• Guaranteed wallet profit settlements to bKash / Nagad with 0% hidden fees</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Registering...' : 'Create Reseller Account 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
