import React, { useState, useEffect } from 'react';
import { Product, ResellerProfile } from '../../types';
import { BANGLADESH_DIVISIONS, COURIER_PROVIDERS } from '../../data/bangladeshGeo';
import { api } from '../../services/api';
import { triggerSaleCelebration } from '../common/ConfettiTrigger';
import { X, CheckCircle2, ShoppingBag, Truck, DollarSign, AlertCircle, Sparkles } from 'lucide-react';

export const ManualOrderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialProduct?: Product | null;
  reseller: ResellerProfile | null;
  onOrderCreated?: () => void;
}> = ({ isOpen, onClose, products, initialProduct, reseller, onOrderCreated }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProduct?.id || products[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [sellingPrice, setSellingPrice] = useState<number>(
    initialProduct?.suggestedSellingPrice || products[0]?.suggestedSellingPrice || 999
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Mirpur');
  const [address, setAddress] = useState('');
  const [resellerNote, setResellerNote] = useState('');
  const [courier, setCourier] = useState('STEADFAST');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profit calculation preview
  const [profitPreview, setProfitPreview] = useState<{
    totalCustomerPrice: number;
    totalResellerCost: number;
    netResellerProfit: number;
    deliveryFee: number;
    packagingFee: number;
    platformMargin: number;
  } | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  useEffect(() => {
    if (initialProduct) {
      setSelectedProductId(initialProduct.id);
      setSellingPrice(initialProduct.suggestedSellingPrice);
    }
  }, [initialProduct]);

  useEffect(() => {
    if (selectedProduct) {
      // Keep selling price at least product reseller price
      if (sellingPrice < selectedProduct.resellerPrice) {
        setSellingPrice(selectedProduct.suggestedSellingPrice);
      }
      api
        .getProfitPreview({
          productId: selectedProduct.id,
          sellingPrice,
          quantity,
          division,
        })
        .then((res) => {
          setProfitPreview(res.calculation);
        })
        .catch(() => {});
    }
  }, [selectedProductId, sellingPrice, quantity, division]);

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
      setError('Please provide customer name, active mobile number, and delivery address');
      return;
    }

    if (sellingPrice < selectedProduct.resellerPrice) {
      setError(`Selling price cannot be lower than wholesale cost (৳${selectedProduct.resellerPrice})`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.createOrder({
        customerName,
        customerPhone,
        division,
        district,
        upazila,
        address,
        resellerNote,
        resellerId: reseller?.id,
        items: [
          {
            productId: selectedProduct.id,
            quantity,
            unitSellingPrice: Number(sellingPrice),
          },
        ],
        paymentMethod: 'COD',
        courier,
      });

      triggerSaleCelebration();
      if (onOrderCreated) onOrderCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentDistricts = BANGLADESH_DIVISIONS[division]?.districts || {};
  const currentUpazilas = currentDistricts[district]?.upazilas || [district];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" id="manual-order-modal">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Create Customer Order</h3>
              <p className="text-xs text-emerald-100">
                Submit order for your customer. We pick, pack, test & deliver nationwide with COD!
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Product & Pricing Grid */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">1. Product & Custom Profit</h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  const pid = e.target.value;
                  setSelectedProductId(pid);
                  const p = products.find((x) => x.id === pid);
                  if (p) setSellingPrice(p.suggestedSellingPrice);
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Wholesale: ৳{p.resellerPrice} | Suggested: ৳{p.suggestedSellingPrice})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct?.stock || 50}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Wholesale Cost <span className="text-slate-400">(Fixed)</span>
                </label>
                <div className="px-3 py-2 text-sm font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-xl">
                  ৳{selectedProduct ? selectedProduct.resellerPrice * quantity : 0}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-emerald-800 mb-1">
                  Your Selling Price (৳)
                </label>
                <input
                  type="number"
                  min={selectedProduct?.resellerPrice || 0}
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold text-emerald-950 bg-emerald-50/50 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Live Profit Banner */}
            {profitPreview && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-600">Customer Bill: </span>
                  <span className="font-bold text-slate-900">৳{profitPreview.totalCustomerPrice} + ৳{profitPreview.deliveryFee} delivery</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Your Net Profit: ৳{profitPreview.netResellerProfit}</span>
                </div>
              </div>
            )}
          </div>

          {/* Customer & Delivery Form */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">2. Customer Information</h4>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Full Name *</label>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Mobile Number *</label>
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
                      {div} ({BANGLADESH_DIVISIONS[div].nameBn})
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
                placeholder="House #, Road #, Sector/Area details for courier rider"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Courier Partner</label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                >
                  {COURIER_PROVIDERS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({division === 'Dhaka' ? `৳${c.deliveryRateDhaka}` : `৳${c.deliveryRateOutside}`})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Note to Warehouse / Courier</label>
                <input
                  type="text"
                  placeholder="e.g. Call before delivery"
                  value={resellerNote}
                  onChange={(e) => setResellerNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Transparency Summary */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Customer Selling Price ({quantity}x):</span>
              <span className="font-bold text-white">৳{sellingPrice * quantity}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Wholesale Base Cost:</span>
              <span>-৳{selectedProduct ? selectedProduct.resellerPrice * quantity : 0}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Courier Delivery Fee ({division}):</span>
              <span>৳{profitPreview?.deliveryFee || 60} (Paid by customer on COD)</span>
            </div>
            <div className="flex justify-between text-cyan-300">
              <span>Standard Order Packaging Charge:</span>
              <span className="font-bold">৳{profitPreview?.packagingFee || 30}</span>
            </div>
            <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-sm">
              <span className="text-emerald-400">Your Guaranteed Profit:</span>
              <span className="text-emerald-400">৳{profitPreview?.netResellerProfit || 0}</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              * Profit will appear in Pending balance immediately and release to Available once delivered by courier.
            </p>
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
              {isSubmitting ? 'Submitting Order...' : 'Submit & Ship Order 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
