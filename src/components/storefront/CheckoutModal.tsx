import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BANGLADESH_DIVISIONS } from '../../data/bangladeshGeo';
import { api } from '../../services/api';
import { triggerSaleCelebration } from '../common/ConfettiTrigger';
import { ShoppingBag, Truck, CheckCircle2, ShieldCheck, X, AlertCircle, Sparkles } from 'lucide-react';

export const CheckoutModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderNumber: string) => void;
}> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { items, subtotal, clearCart, referralCode } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Mirpur');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BKASH' | 'NAGAD'>('COD');
  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || items.length === 0) return null;

  const deliveryFee = division === 'Dhaka' ? 60 : 120;
  const grandTotal = subtotal + deliveryFee;

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
    if (!customerName || !customerPhone || !address) {
      setError('Please provide your name, phone number, and complete delivery address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.createOrder({
        customerName,
        customerPhone,
        division,
        district,
        upazila,
        address,
        customerNote,
        referralCode: referralCode || undefined,
        items: items.map((it) => ({
          productId: it.product.id,
          quantity: it.quantity,
          unitSellingPrice: it.selectedPrice,
        })),
        paymentMethod,
      });

      triggerSaleCelebration();
      toast.success(`Order placed successfully! Tracking ID #${res.order.orderNumber}`, 'Order Confirmed 🚀');
      clearCart();
      onOrderSuccess(res.order.orderNumber);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" id="checkout-modal">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Secure Cash-on-Delivery Checkout</h3>
              <p className="text-xs text-emerald-100">Pay cash to courier upon receiving your package</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Delivery Details */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Shipping & Recipient Details
            </h4>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Active Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Delivery Address *</label>
              <textarea
                rows={2}
                required
                placeholder="House #, Road #, Sector / Landmark details for courier rider"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-xl border text-center transition ${
                  paymentMethod === 'COD'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Truck className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                <span className="text-xs block">Cash On Delivery</span>
                <span className="text-[10px] text-slate-500">Pay to rider</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('BKASH')}
                className={`p-3 rounded-xl border text-center transition ${
                  paymentMethod === 'BKASH'
                    ? 'border-pink-600 bg-pink-50 text-pink-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-5 h-5 mx-auto mb-1 text-pink-600 font-bold text-xs flex items-center justify-center">
                  bK
                </div>
                <span className="text-xs block">bKash</span>
                <span className="text-[10px] text-slate-500">Instant / On Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NAGAD')}
                className={`p-3 rounded-xl border text-center transition ${
                  paymentMethod === 'NAGAD'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-5 h-5 mx-auto mb-1 text-amber-600 font-bold text-xs flex items-center justify-center">
                  NG
                </div>
                <span className="text-xs block">Nagad</span>
                <span className="text-[10px] text-slate-500">Instant / On Delivery</span>
              </button>
            </div>
          </div>

          {/* Order Bill Summary */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Items Total ({items.length} items):</span>
              <span>৳{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Courier Delivery ({division}):</span>
              <span>৳{deliveryFee}</span>
            </div>
            <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-base text-emerald-400">
              <span>Total Payable:</span>
              <span>৳{grandTotal}</span>
            </div>
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
              className="px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Placing Order...' : 'Confirm Order & Ship 📦'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
