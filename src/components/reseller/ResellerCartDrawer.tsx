import React, { useState, useEffect } from 'react';
import { useResellerCart } from '../../context/ResellerCartContext';
import { ResellerProfile } from '../../types';
import { BANGLADESH_DIVISIONS, COURIER_PROVIDERS } from '../../data/bangladeshGeo';
import { api } from '../../services/api';
import { triggerSaleCelebration } from '../common/ConfettiTrigger';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  X,
  Sparkles,
  Package,
  Truck,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export const ResellerCartDrawer: React.FC<{
  reseller: ResellerProfile | null;
  onOrderCreated?: () => void;
}> = ({ reseller, onOrderCreated }) => {
  const {
    items,
    itemCount,
    totalWholesaleCost,
    totalCustomerPrice,
    grossProfit,
    packagingFee,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    updateSellingPrice,
    clearCart,
  } = useResellerCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
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

  const deliveryFee = division.trim().toLowerCase() === 'dhaka' ? 60 : 120;
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

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !address) {
      setError('Please fill in customer name, active mobile number, and delivery address');
      return;
    }

    // Validate prices
    for (const it of items) {
      if (it.unitSellingPrice < it.product.resellerPrice) {
        setError(`Selling price for "${it.product.name}" cannot be below wholesale cost (৳${it.product.resellerPrice})`);
        return;
      }
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
        items: items.map((it) => ({
          productId: it.product.id,
          quantity: it.quantity,
          unitSellingPrice: Number(it.unitSellingPrice),
        })),
        paymentMethod: 'COD',
        courier,
      });

      triggerSaleCelebration();
      clearCart();
      setIsCheckingOut(false);
      setIsCartOpen(false);
      if (onOrderCreated) onOrderCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to submit reseller order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="reseller-cart-drawer">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isSubmitting) {
            setIsCartOpen(false);
            setIsCheckingOut(false);
          }
        }}
      />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#0e0c1f] text-slate-100 shadow-[0_0_50px_rgba(139,92,246,0.3)] border-l border-purple-500/30 flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 bg-[#141029] border-b border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  {isCheckingOut ? 'Reseller Multi-Item Checkout' : 'Reseller Order Cart'}
                </h3>
                <p className="text-xs text-cyan-300">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} selected • Fixed 30৳ Packaging
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (!isSubmitting) {
                  setIsCartOpen(false);
                  setIsCheckingOut(false);
                }
              }}
              className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 text-slate-300 hover:text-white border border-purple-500/30 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Cart Content */}
          {!isCheckingOut ? (
            <>
              {/* Product list */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {items.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <ShoppingBag className="w-14 h-14 text-purple-400/40 mx-auto" />
                    <h4 className="font-bold text-slate-200 text-base">Your Reseller Cart is Empty</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Click "Add to Cart" on any product in the catalog to bundle multiple items into a single customer shipment.
                    </p>
                  </div>
                ) : (
                  items.map((it) => {
                    const itemProfit = (it.unitSellingPrice - it.product.resellerPrice) * it.quantity;

                    return (
                      <div
                        key={it.product.id}
                        className="p-4 bg-purple-950/30 rounded-2xl border border-purple-500/30 space-y-3"
                      >
                        <div className="flex gap-3 items-start">
                          <img
                            src={it.product.images[0]}
                            alt=""
                            className="w-16 h-16 object-cover rounded-xl border border-purple-500/40 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-white line-clamp-1">{it.product.name}</h4>
                            <div className="flex items-center gap-2 mt-1 text-[11px]">
                              <span className="text-slate-400">Wholesale:</span>
                              <span className="font-mono font-bold text-emerald-400">৳{it.product.resellerPrice}</span>
                            </div>

                            {/* Quantity buttons */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center border border-purple-500/40 rounded-lg bg-purple-950/60">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(it.product.id, it.quantity - 1)}
                                  className="p-1 hover:bg-purple-900 text-slate-300 rounded-l-lg"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 text-xs font-bold font-mono text-white">{it.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(it.product.id, it.quantity + 1)}
                                  className="p-1 hover:bg-purple-900 text-slate-300 rounded-r-lg"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(it.product.id)}
                                className="p-1 text-slate-400 hover:text-rose-400 transition"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Custom Selling Price Control */}
                        <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block">
                              Unit Price for Customer (৳)
                            </label>
                            <input
                              type="number"
                              min={it.product.resellerPrice}
                              value={it.unitSellingPrice}
                              onChange={(e) => updateSellingPrice(it.product.id, Math.max(0, Number(e.target.value)))}
                              className="w-28 mt-0.5 px-2.5 py-1 text-xs font-bold text-cyan-300 bg-purple-950/60 border border-purple-500/40 rounded-lg focus:ring-1 focus:ring-cyan-400"
                            />
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Item Profit</span>
                            <span className="font-bold text-emerald-400 text-xs">+৳{itemProfit}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Cart Footer Summary */}
              {items.length > 0 && (
                <div className="p-6 bg-[#130f2b] border-t border-purple-500/30 space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Total Customer Products Amount:</span>
                      <span className="font-bold text-white font-mono">৳{totalCustomerPrice}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Total Wholesale Cost:</span>
                      <span className="text-slate-400 font-mono">-৳{totalWholesaleCost}</span>
                    </div>
                    <div className="flex justify-between text-cyan-300 font-medium">
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Fixed Packaging Charge (Per Order):</span>
                      </span>
                      <span className="font-mono font-bold">৳{packagingFee}</span>
                    </div>
                    <div className="p-2.5 bg-emerald-950/50 border border-emerald-500/30 rounded-xl flex justify-between items-center text-xs">
                      <span className="text-emerald-300 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Estimated Reseller Profit:</span>
                      </span>
                      <span className="text-emerald-300 font-black text-sm font-mono">+৳{grossProfit}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] transition flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Shipping Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs text-cyan-300 hover:underline flex items-center gap-1 font-semibold"
                  >
                    ← Back to Cart Items
                  </button>
                  <span className="text-xs font-mono text-slate-400">{itemCount} items in bundle</span>
                </div>

                {/* Customer Information */}
                <div className="p-4 bg-purple-950/30 rounded-2xl border border-purple-500/30 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Customer Details</h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-purple-950/60 border border-purple-500/40 rounded-xl text-white focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-purple-950/60 border border-purple-500/40 rounded-xl text-white font-mono focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Division</label>
                      <select
                        value={division}
                        onChange={(e) => handleDivisionChange(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs bg-purple-950/60 border border-purple-500/40 rounded-xl text-white"
                      >
                        {Object.keys(BANGLADESH_DIVISIONS).map((div) => (
                          <option key={div} value={div} className="bg-slate-900 text-white">
                            {div}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">District</label>
                      <select
                        value={district}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs bg-purple-950/60 border border-purple-500/40 rounded-xl text-white"
                      >
                        {Object.keys(currentDistricts).map((dist) => (
                          <option key={dist} value={dist} className="bg-slate-900 text-white">
                            {currentDistricts[dist].name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Upazila / Area</label>
                      <select
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs bg-purple-950/60 border border-purple-500/40 rounded-xl text-white"
                      >
                        {currentUpazilas.map((u) => (
                          <option key={u} value={u} className="bg-slate-900 text-white">
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Delivery Address *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="House #, Road #, Sector/Area details for courier rider"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-purple-950/60 border border-purple-500/40 rounded-xl text-white focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Courier Partner</label>
                      <select
                        value={courier}
                        onChange={(e) => setCourier(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs bg-purple-950/60 border border-purple-500/40 rounded-xl text-white"
                      >
                        {COURIER_PROVIDERS.map((c) => (
                          <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                            {c.name} ({division.toLowerCase() === 'dhaka' ? `৳${c.deliveryRateDhaka}` : `৳${c.deliveryRateOutside}`})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Reseller Note</label>
                      <input
                        type="text"
                        placeholder="e.g. Call before delivery"
                        value={resellerNote}
                        onChange={(e) => setResellerNote(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-purple-950/60 border border-purple-500/40 rounded-xl text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Final Order Ledger */}
                <div className="p-4 bg-[#141029] rounded-2xl border border-purple-500/30 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Customer Bill (Subtotal):</span>
                    <span className="font-bold text-white font-mono">৳{totalCustomerPrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Delivery Charge ({division}):</span>
                    <span className="font-mono">৳{deliveryFee} (Paid on COD)</span>
                  </div>
                  <div className="flex justify-between text-cyan-300 font-semibold">
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Packaging Charge:</span>
                    </span>
                    <span className="font-mono font-bold">৳{packagingFee}</span>
                  </div>
                  <div className="border-t border-purple-500/20 pt-2 flex justify-between font-bold text-sm">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      <span>Your Profit (Released on Delivery):</span>
                    </span>
                    <span className="text-emerald-400 font-mono text-base">+৳{grossProfit}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="p-6 bg-[#130f2b] border-t border-purple-500/30 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="px-4 py-3 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Order...</span>
                  ) : (
                    <>
                      <span>Confirm & Dispatch Multi-Product Order 🚀</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
