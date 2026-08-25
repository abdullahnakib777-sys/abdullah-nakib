import React, { useState } from 'react';
import { Order, ResellerProfile } from '../../types';
import { StatusBadge } from '../common/Badge';
import { Search, Filter, Package, Truck, CheckCircle2, Clock, MapPin, Eye, ExternalLink, Plus } from 'lucide-react';

export const ResellerOrdersView: React.FC<{
  orders: Order[];
  reseller: ResellerProfile;
  onOpenManualOrder: () => void;
  onOpenTrackingModal: (orderNumber: string) => void;
}> = ({ orders, reseller, onOpenManualOrder, onOpenTrackingModal }) => {
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
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Order #, Courier Tracking #, or Customer Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <button
            onClick={onOpenManualOrder}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Order</span>
          </button>
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
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-80 font-mono">({countByStatus(tab.id)})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4">
                    <p className="font-mono font-bold text-slate-900">{order.orderNumber}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {order.courier}: {order.trackingNumber}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>

                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{order.customerName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {order.district}, {order.division}
                    </p>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="text-slate-700">
                          <span className="font-semibold">{it.quantity}x</span> {it.productName}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-slate-900">৳{order.totalAmount}</p>
                    <p className="text-[10px] text-slate-400">
                      Incl. ৳{order.deliveryFee} delivery ({order.paymentMethod})
                    </p>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
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
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition inline-flex items-center gap-1"
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
