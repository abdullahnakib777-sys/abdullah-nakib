import React from 'react';
import { LucideIcon, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  titleBn?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = ShoppingBag,
  title,
  titleBn,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon = ArrowRight,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`galaxy-glass-card-static rounded-3xl p-8 sm:p-12 text-center border border-purple-500/25 relative overflow-hidden my-4 ${className}`}
    >
      {/* Background ambient glow */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-purple-600/20 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Cosmic Shimmer Ribbon Header */}
      <div className="w-24 h-1 mx-auto rounded-full cosmic-shimmer mb-8" />

      {/* Central Floating Icon Badge */}
      <div className="relative inline-flex items-center justify-center mb-6 animate-float-gentle">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-purple-950/80 via-indigo-950/70 to-slate-900/80 border border-purple-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.35)] relative group">
          <Icon className="w-9 h-9 sm:w-11 sm:h-11 text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]" />

          {/* Starlight badge */}
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.6)] border border-amber-200/50">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          </div>
        </div>
      </div>

      {/* Title & Bangla Subtitle */}
      <div className="max-w-md mx-auto space-y-2 mb-6">
        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
          {title}
        </h3>
        {titleBn && (
          <p className="text-xs sm:text-sm font-semibold text-cyan-300">
            {titleBn}
          </p>
        )}
        {description && (
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-1">
            {description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-[0_0_18px_rgba(6,182,212,0.45)] hover:shadow-[0_0_24px_rgba(168,85,247,0.6)] transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>{actionLabel}</span>
              {ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
            </button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl galaxy-glass hover:bg-purple-950/60 text-slate-300 hover:text-white font-semibold text-xs border border-purple-500/30 transition flex items-center justify-center gap-1.5"
            >
              <span>{secondaryActionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
