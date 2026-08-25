import React from 'react';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, X } from 'lucide-react';

export const CartDrawer: React.FC<{ onOpenCheckout: () => void }> = ({ onOpenCheckout }) => {
  const { items, itemCount, subtotal, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, referralCode } =
    useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="customer-cart-drawer">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsCartOpen(false)} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-base">Your Shopping Cart</h3>
                <p className="text-xs text-slate-300">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Referral Banner if present */}
          {referralCode && (
            <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs flex items-center justify-between font-medium">
              <span>Attributed to Reseller Partner:</span>
              <span className="font-mono font-bold bg-emerald-200/70 px-2 py-0.5 rounded">{referralCode}</span>
            </div>
          )}

          {/* Items */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-600 font-semibold text-sm">Your cart is currently empty</p>
                <p className="text-xs text-slate-400">Add trending products from our collection</p>
              </div>
            ) : (
              items.map((it) => (
                <div
                  key={it.product.id}
                  className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 items-center"
                >
                  <img
                    src={it.product.images[0]}
                    alt=""
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{it.product.name}</h4>
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">৳{it.selectedPrice}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(it.product.id, it.quantity - 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded-l-lg"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold">{it.quantity}</span>
                        <button
                          onClick={() => updateQuantity(it.product.id, it.quantity + 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded-r-lg"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(it.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between font-semibold text-sm text-slate-900">
                  <span>Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery (Calculated at checkout)</span>
                  <span>৳60 - ৳120</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
