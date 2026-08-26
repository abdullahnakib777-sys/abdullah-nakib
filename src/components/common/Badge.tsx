import React from 'react';
import { OrderStatus, ResellerStatus } from '../../types';

export const StatusBadge: React.FC<{ status: OrderStatus | ResellerStatus | string }> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'DELIVERED':
      case 'ACTIVE':
      case 'PAID':
      case 'COMPLETED':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
      case 'SHIPPING':
      case 'PROCESSING':
        return 'bg-cyan-950/70 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]';
      case 'CONFIRMED':
      case 'PACKAGING':
        return 'bg-purple-950/70 text-purple-300 border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]';
      case 'PENDING':
      case 'VERIFICATION_REQUIRED':
        return 'bg-amber-950/70 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(251,191,36,0.3)]';
      case 'CANCELLED':
      case 'REJECTED':
      case 'BLOCKED':
      case 'SUSPENDED':
      case 'RETURNED':
      case 'REVERSED':
        return 'bg-rose-950/70 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]';
      default:
        return 'bg-slate-900/70 text-slate-300 border-slate-700';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'DELIVERED':
        return 'Delivered 📦';
      case 'SHIPPING':
        return 'In Transit 🚀';
      case 'PACKAGING':
        return 'Packaging 🎁';
      case 'CONFIRMED':
        return 'Confirmed ✨';
      case 'PENDING':
        return 'Pending ⏳';
      case 'RETURNED':
        return 'Returned 🔄';
      case 'CANCELLED':
        return 'Cancelled ❌';
      case 'ACTIVE':
        return 'Verified Reseller ⭐';
      case 'PAID':
        return 'Paid Settled 💎';
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md transition-all ${getStyle()}`}
    >
      {getLabel()}
    </span>
  );
};
