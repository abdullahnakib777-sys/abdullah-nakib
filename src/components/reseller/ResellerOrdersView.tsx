import React, { useState } from 'react';
import { Order, ResellerProfile } from '../../types';
import { useResellerCart } from '../../context/ResellerCartContext';
import { StatusBadge } from '../common/Badge';
import { Search, Filter, Package, Truck, CheckCircle2, Clock, MapPin, Eye, ExternalLink, Plus, ShoppingCart } from 'lucide-react';

export const ResellerOrdersView: React.FC<{
  orders: Order[];
  reseller: ResellerProfile;
  onOpenManualOrder: () => void;
  onOpenTrackingModal: (orderNumber: string) => void;
}> = ({ orders, reseller, onOpenManualOrder, onOpenTrackingModal }) => {
  const { itemCount, setIsCartOpen } = useResellerCart();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = orders.filter((o) => {
    if (filterStatus !== 'ALL' && o.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.trackingNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  const countByStatus = (st: string) => (st === 'ALL' ? orders.length : orders.filter((o) => o.status === st).length);

  return (
    <div className="space-y-6" id="reseller-orders-view">
      {/* Header & Controls */}
      <div className="galaxy-glass-card-static p-5 rounded-3xl border border-purple-500/30 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Order #, Courier Tracking #, or Customer Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm galaxy-glass-input rounded-xl font-mono"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center justify-center gap-1.5 shrink-0"
              title="Open Reseller Multi-Item Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Reseller Cart</span>
              {itemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 text-[11px] font-black flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenManualOrder}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] transition flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Order</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'CONFIRMED', label: 'Confirmed' },
            { id: 'PACKAGING', label: 'Packaging' },
            { id: 'SHIPPING', label: 'In Transit' },
            { id: 'DELIVERED', label: 'Delivered (Settled)' },
            { id: 'RETURNED', label: 'Returned' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-full font-bold transition shrink-0 flex items-center gap-1.5 ${
                filterStatus === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'galaxy-glass text-slate-300 hover:text-white border border-purple-500/30'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-80 font-mono">({countByStatus(tab.id)})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="galaxy-glass-card-static rounded-3xl border border-purple-500/30 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#120f26]/80 text-cyan-300 font-semibold border-b border-purple-500/30">
              <tr>
                <th className="p-4">Order / Tracking</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Products</th>
                <th className="p-4">Amount & COD</th>
                <th className="p-4">Your Net Profit</th>
                <th className="p-4">Courier Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/20">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-purple-950/30 transition">
                  <td className="p-4">
                    <p className="font-mono font-bold text-white">{order.orderNumber}</p>
                    <p className="text-[11px] text-cyan-300/80 font-mono mt-0.5">
                      {order.courier}: {order.trackingNumber}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>

                  <td className="p-4">
                    <p className="font-semibold text-slate-200">{order.customerName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{order.customerPhone}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {order.district}, {order.division}
                    </p>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="text-slate-300">
                          <span className="font-semibold text-cyan-300">{it.quantity}x</span> {it.productName}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-white">৳{order.totalAmount}</p>
                    <p className="text-[10px] text-slate-400">
                      Incl. ৳{order.deliveryFee} delivery {order.packagingFee ? `+ ৳${order.packagingFee} pack` : ''}
                    </p>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded inline-block shadow-xs">
                        +৳{order.totalResellerProfit}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {order.status === 'DELIVERED' ? 'Settled in Wallet' : 'In Pending'}
                      </p>
                    </div>
                  </td>

                  <td className="p-4">
                    <StatusBadge status={order.status} />
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => onOpenTrackingModal(order.orderNumber)}
                      className="px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-cyan-300 font-semibold text-xs transition inline-flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
