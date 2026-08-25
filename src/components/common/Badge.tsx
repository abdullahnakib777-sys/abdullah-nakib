import React from 'react';
import { OrderStatus, ResellerStatus } from '../../types';

export const StatusBadge: React.FC<{ status: OrderStatus | ResellerStatus | string }> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'DELIVERED':
      case 'ACTIVE':
      case 'PAID':
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SHIPPING':
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONFIRMED':
      case 'PACKAGING':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'PENDING':
      case 'VERIFICATION_REQUIRED':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CANCELLED':
      case 'REJECTED':
      case 'BLOCKED':
      case 'SUSPENDED':
      case 'RETURNED':
      case 'REVERSED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'DELIVERED':
        return 'Delivered 📦';
      case 'SHIPPING':
        return 'On The Way 🚚';
      case 'PACKAGING':
        return 'Packaging 🎁';
      case 'CONFIRMED':
        return 'Confirmed ✅';
      case 'PENDING':
        return 'Pending ⏳';
      case 'RETURNED':
        return 'Returned 🔄';
      case 'CANCELLED':
        return 'Cancelled ❌';
      case 'ACTIVE':
        return 'Active Verified ⭐';
      case 'PAID':
        return 'Paid Settled 💰';
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle()}`}
    >
      {getLabel()}
    </span>
  );
};
