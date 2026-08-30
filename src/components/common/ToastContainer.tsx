import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast, ToastItem } from '../../context/ToastContext';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Sparkles,
  X,
} from 'lucide-react';

const ToastIcon: React.FC<{ type: ToastItem['type'] }> = ({ type }) => {
  switch (type) {
    case 'success':
      return (
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      );
    case 'error':
      return (
        <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(244,63,94,0.4)]">
          <XCircle className="w-4 h-4" />
        </div>
      );
    case 'warning':
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
          <AlertTriangle className="w-4 h-4" />
        </div>
      );
    case 'cosmic':
      return (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600/40 to-cyan-500/40 text-cyan-300 border border-cyan-400/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      );
    case 'info':
    default:
      return (
        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
          <Info className="w-4 h-4" />
        </div>
      );
  }
};

const getToastBorderClass = (type: ToastItem['type']) => {
  switch (type) {
    case 'success':
      return 'border-emerald-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.25)]';
    case 'error':
      return 'border-rose-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(244,63,94,0.25)]';
    case 'warning':
      return 'border-amber-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(245,158,11,0.25)]';
    case 'cosmic':
      return 'border-purple-500/50 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_25px_rgba(168,85,247,0.35)]';
    case 'info':
    default:
      return 'border-cyan-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.25)]';
  }
};

const getProgressBarGradient = (type: ToastItem['type']) => {
  switch (type) {
    case 'success':
      return 'bg-gradient-to-r from-emerald-400 to-teal-300';
    case 'error':
      return 'bg-gradient-to-r from-rose-500 to-pink-500';
    case 'warning':
      return 'bg-gradient-to-r from-amber-400 to-orange-400';
    case 'cosmic':
      return 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400';
    case 'info':
    default:
      return 'bg-gradient-to-r from-cyan-400 to-blue-500';
  }
};

const SingleToast: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const duration = toast.duration ?? 4000;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.92, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.9, y: -15, filter: 'blur(4px)' }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`relative overflow-hidden rounded-2xl p-4 bg-[#0e0c1f]/85 backdrop-blur-2xl border ${getToastBorderClass(
        toast.type
      )} max-w-sm sm:max-w-md w-full flex items-start gap-3 pointer-events-auto`}
    >
      <ToastIcon type={toast.type} />

      <div className="flex-1 min-w-0 pr-1">
        {toast.title && (
          <h4 className="text-xs font-black tracking-wide text-white mb-0.5">
            {toast.title}
          </h4>
        )}
        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          {toast.message}
        </p>

        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              onDismiss(toast.id);
            }}
            className="mt-2 text-[11px] font-black text-cyan-300 hover:text-cyan-200 underline underline-offset-2 transition"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition shrink-0"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Shrinking bottom progress timer line */}
      {duration > 0 && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`absolute bottom-0 left-0 right-0 h-[2px] origin-left ${getProgressBarGradient(
            toast.type
          )}`}
        />
      )}
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-3 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <SingleToast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
