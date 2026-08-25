import React, { useState } from 'react';
import { Order } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../common/Badge';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, X, AlertCircle, Phone, ArrowRight } from 'lucide-react';

export const OrderTrackingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}> = ({ isOpen, onClose, initialOrderNumber = '' }) => {
  const [query, setQuery] = useState(initialOrderNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getOrder(query.trim());
      setOrder(res.order);
    } catch (err: any) {
      setError(err.message || 'No order found with that order number or tracking ID');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const STEPS: { status: Order['status']; label: string; icon: any }[] = [
    { status: 'PENDING', label: 'Order Placed', icon: Clock },
    { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
    { status: 'PACKAGING', label: 'Packaging', icon: Package },
    { status: 'SHIPPING', label: 'In Transit (Courier)', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered (COD Paid)', icon: CheckCircle2 },
  ];

  const getStepStatus = (stepStatus: Order['status'], currentStatus: Order['status']) => {
    const orderFlow = ['PENDING', 'CONFIRMED', 'PACKAGING', 'SHIPPING', 'DELIVERED'];
    const currentIndex = orderFlow.indexOf(currentStatus);
    const stepIndex = orderFlow.indexOf(stepStatus);

    if (currentStatus === 'RETURNED' || currentStatus === 'CANCELLED') {
      return stepIndex === 0 ? 'completed' : 'cancelled';
    }

    if (currentIndex >= stepIndex && currentIndex !== -1) {
      return 'completed';
    }
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" id="order-tracking-modal">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Truck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Live Order & Courier Tracking</h3>
              <p className="text-xs text-slate-300">Track Steadfast, Pathao & RedX deliveries across Bangladesh</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Enter Order # (e.g. ORD-2026-8801) or Tracking #"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {order && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Order summary card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-900">{order.orderNumber}</span>
                    <p className="text-[11px] text-slate-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-500">Customer: </span>
                    <span className="font-semibold text-slate-900">{order.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Courier: </span>
                    <span className="font-semibold text-slate-900">{order.courier} ({order.trackingNumber})</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Destination: </span>
                    <span className="font-semibold text-slate-900">{order.district}, {order.division}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Total COD Amount: </span>
                    <span className="font-bold text-emerald-700">৳{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Stepper */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Shipment Timeline</h4>
                <div className="space-y-3">
                  {STEPS.map((step, idx) => {
                    const stepState = getStepStatus(step.status, order.status);
                    const isCompleted = stepState === 'completed';
                    const Icon = step.icon;

                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.label}
                          </p>
                          {order.statusHistory.find((h) => h.status === step.status) && (
                            <p className="text-[11px] text-slate-500">
                              {order.statusHistory.find((h) => h.status === step.status)?.note} (
                              {new Date(
                                order.statusHistory.find((h) => h.status === step.status)!.timestamp
                              ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              )
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
