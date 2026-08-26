import React from 'react';

interface MeherMartLogoProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'icon' | 'compact';
  theme?: 'dark' | 'light' | 'auto';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const MeherMartLogo: React.FC<MeherMartLogoProps> = ({
  className = '',
  variant = 'horizontal',
  theme = 'dark',
  size = 'md',
  showTagline = true,
}) => {
  // SVG Monogram Icon matching the uploaded MeherMart floral 'M' insignia
  const MonogramIcon = ({ iconSize = 40 }: { iconSize?: number }) => (
    <div
      className="relative flex items-center justify-center shrink-0 rounded-2xl p-1 transition-transform group-hover:scale-105"
      style={{ width: iconSize, height: iconSize }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_10px_rgba(212,175,55,0.35)]"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9E79F" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#AA771C" />
            <stop offset="100%" stopColor="#F39C12" />
          </linearGradient>
          <linearGradient id="navyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0B1E36" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer subtle shield aura */}
        <circle cx="100" cy="100" r="92" fill={theme === 'light' ? '#F8F9FA' : '#0F172A'} stroke="url(#goldGradient)" strokeWidth="3" strokeOpacity="0.6" />

        {/* Top Fleur-de-lis / Crown Petal (Gold) */}
        <path
          d="M 100 28 C 96 42, 92 48, 100 62 C 108 48, 104 42, 100 28 Z"
          fill="url(#goldGradient)"
        />
        <path
          d="M 94 45 C 84 40, 78 48, 86 58 C 92 56, 94 50, 94 45 Z"
          fill="url(#goldGradient)"
        />
        <path
          d="M 106 45 C 116 40, 122 48, 114 58 C 108 56, 106 50, 106 45 Z"
          fill="url(#goldGradient)"
        />

        {/* Main Serif Navy 'M' Left Wing & Leg */}
        <path
          d="M 44 146 C 44 140, 52 142, 60 140 C 60 115, 62 82, 70 58 C 76 66, 86 86, 96 108 C 88 126, 76 138, 62 142 C 54 144, 46 142, 44 146 Z"
          fill={theme === 'light' ? '#0F2744' : '#E2E8F0'}
        />
        <path
          d="M 52 64 C 44 66, 36 78, 38 92 C 40 108, 48 116, 50 128 C 44 128, 38 122, 36 108 C 34 88, 44 70, 56 60 Z"
          fill="url(#navyGradient)"
        />

        {/* Center Floral Leaf Stem & Swirls (Gold & Navy filigree) */}
        {/* Left inner leaf */}
        <path
          d="M 72 90 C 66 94, 64 104, 70 112 C 78 110, 82 100, 78 92 C 75 90, 73 90, 72 90 Z"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 70 102 C 74 100, 76 96, 76 94"
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
        />

        {/* Central golden teardrop / swirl petal */}
        <path
          d="M 100 98 C 92 110, 92 124, 100 134 C 108 124, 108 110, 100 98 Z"
          fill="url(#goldGradient)"
        />
        <circle cx="100" cy="116" r="4.5" fill={theme === 'light' ? '#0F2744' : '#0B132B'} />

        {/* Center-Right Floral Scroll */}
        <path
          d="M 102 128 C 114 136, 128 132, 134 118 C 138 104, 128 92, 116 94 C 108 96, 106 104, 112 108 C 118 110, 122 106, 120 102"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Right Serif Navy 'M' Leg & Arc */}
        <path
          d="M 104 108 C 114 86, 124 66, 130 58 C 138 82, 140 115, 140 140 C 148 142, 156 140, 156 146 C 154 142, 146 144, 138 142 C 124 138, 112 126, 104 108 Z"
          fill={theme === 'light' ? '#0F2744' : '#E2E8F0'}
        />
        <path
          d="M 136 60 C 146 54, 158 64, 162 78 C 166 94, 160 112, 154 126 C 158 114, 162 98, 158 84 C 154 74, 146 66, 136 60 Z"
          fill="url(#navyGradient)"
        />

        {/* Decorative flourishes around base */}
        <path
          d="M 50 148 C 65 144, 85 148, 100 152 C 115 148, 135 144, 150 148"
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="100" cy="152" r="3" fill="url(#goldGradient)" />
      </svg>
    </div>
  );

  const sizeClasses = {
    sm: {
      icon: 32,
      title: 'text-sm font-black',
      tagline: 'text-[8px] tracking-[0.2em]',
      gap: 'gap-2',
    },
    md: {
      icon: 42,
      title: 'text-lg font-black',
      tagline: 'text-[9px] tracking-[0.25em]',
      gap: 'gap-2.5',
    },
    lg: {
      icon: 56,
      title: 'text-2xl font-black',
      tagline: 'text-[11px] tracking-[0.28em]',
      gap: 'gap-3.5',
    },
    xl: {
      icon: 76,
      title: 'text-3xl font-black',
      tagline: 'text-xs tracking-[0.32em]',
      gap: 'gap-4',
    },
  }[size];

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <MonogramIcon iconSize={sizeClasses.icon} />
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <MonogramIcon iconSize={sizeClasses.icon * 1.3} />
        <div className="mt-2">
          <h1
            className={`${sizeClasses.title} uppercase tracking-[0.12em] font-serif ${
              theme === 'light' ? 'text-[#0F2744]' : 'text-white'
            } leading-tight`}
          >
            MEHERMART
          </h1>
          {showTagline && (
            <p className={`${sizeClasses.tagline} font-semibold uppercase text-[#D4AF37] mt-0.5`}>
              CURATED FOR EVERYHOME
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center ${sizeClasses.gap} ${className}`}>
        <MonogramIcon iconSize={sizeClasses.icon} />
        <span
          className={`${sizeClasses.title} uppercase tracking-[0.1em] font-serif ${
            theme === 'light' ? 'text-[#0F2744]' : 'text-white'
          }`}
        >
          MEHER<span className="text-[#D4AF37]">MART</span>
        </span>
      </div>
    );
  }

  // Default: Horizontal Logo
  return (
    <div className={`inline-flex items-center ${sizeClasses.gap} ${className}`}>
      <MonogramIcon iconSize={sizeClasses.icon} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`${sizeClasses.title} uppercase tracking-[0.14em] font-serif ${
              theme === 'light' ? 'text-[#0F2744]' : 'text-white'
            } leading-none`}
          >
            MEHER<span className="text-[#D4AF37]">MART</span>
          </span>
          <span className="text-[9px] bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold px-1.5 py-0.5 rounded-full shadow-xs">
            Official
          </span>
        </div>
        {showTagline && (
          <span className={`${sizeClasses.tagline} font-semibold uppercase text-[#D4AF37] mt-0.5 leading-none`}>
            CURATED FOR EVERYHOME
          </span>
        )}
      </div>
    </div>
  );
};
