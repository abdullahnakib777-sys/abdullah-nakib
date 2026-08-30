import React from 'react';

interface MeherMartLogoProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'icon' | 'compact' | 'hero';
  theme?: 'dark' | 'light' | 'auto';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showTagline?: boolean;
}

export const MeherMartLogo: React.FC<MeherMartLogoProps> = ({
  className = '',
  variant = 'horizontal',
  theme = 'dark',
  size = 'md',
  showTagline = true,
}) => {
  // Majestic luxury botanical insignia with golden filigree, royal crown starburst, and midnight sapphire filaments
  const MonogramIcon = ({ iconSize = 44 }: { iconSize?: number }) => (
    <div
      className="relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
      style={{ width: iconSize, height: iconSize }}
    >
      {/* Ambient Radial Golden Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-yellow-400/15 to-amber-600/20 blur-md -z-10 group-hover:opacity-100 opacity-70 transition-opacity duration-300" />
      
      <svg
        viewBox="0 0 240 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_14px_rgba(234,179,8,0.35)]"
      >
        <defs>
          {/* Midnight Sapphire Gradient */}
          <linearGradient id="mmNavyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="35%" stopColor="#1e3a8a" />
            <stop offset="85%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* 24K Luxury Imperial Gold Gradient */}
          <linearGradient id="mmGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff2c2" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="85%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          {/* High Shimmer Platinum Gold */}
          <linearGradient id="mmGoldBright" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          {/* Radial Light Halo */}
          <radialGradient id="mmGlowHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#d97706" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Halo Behind Monogram */}
        <circle cx="120" cy="110" r="95" fill="url(#mmGlowHalo)" />

        {/* Outer Circular Filigree Accent Ring */}
        <circle
          cx="120"
          cy="110"
          r="92"
          stroke="url(#mmGoldGradient)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          strokeOpacity="0.45"
        />

        {/* 1. TOP BOTANICAL ROYAL CROWN & STARBURST */}
        {/* Central Star Diamond */}
        <path
          d="M 120 6 L 123 16 L 133 19 L 123 22 L 120 32 L 117 22 L 107 19 L 117 16 Z"
          fill="url(#mmGoldBright)"
          filter="drop-shadow(0 0 4px #fbbf24)"
        />
        {/* Central Crown Petal */}
        <path
          d="M 120 22 C 114 34 110 42 120 56 C 130 42 126 34 120 22 Z"
          fill="url(#mmGoldBright)"
          stroke="#92400e"
          strokeWidth="0.8"
        />
        {/* Left Crown Petal */}
        <path
          d="M 112 40 C 96 32 90 42 102 54 C 110 50 112 44 112 40 Z"
          fill="url(#mmGoldGradient)"
          stroke="#92400e"
          strokeWidth="0.8"
        />
        {/* Right Crown Petal */}
        <path
          d="M 128 40 C 144 32 150 42 138 54 C 130 50 128 44 128 40 Z"
          fill="url(#mmGoldGradient)"
          stroke="#92400e"
          strokeWidth="0.8"
        />
        {/* Crown Jewel Nodes */}
        <circle cx="104" cy="56" r="2.5" fill="url(#mmGoldBright)" />
        <circle cx="136" cy="56" r="2.5" fill="url(#mmGoldBright)" />

        {/* 2. LEFT CALLIGRAPHIC 'M' FLOURISH (Midnight Royal Sapphire & Indigo) */}
        <path
          d="M 50 148 C 50 140, 62 142, 72 139 C 72 108, 75 75, 84 48 C 91 58, 103 82, 116 108 C 104 128, 90 142, 74 148 C 62 152, 52 150, 50 148 Z"
          fill="url(#mmNavyGradient)"
          stroke="url(#mmGoldGradient)"
          strokeWidth="0.8"
        />
        {/* Outer Left Botanical Swirl */}
        <path
          d="M 64 56 C 53 58, 40 72, 43 88 C 45 105, 56 114, 58 128 C 51 128, 44 120, 41 106 C 38 84, 49 64, 65 52 C 71 48, 76 52, 64 56 Z"
          fill="url(#mmNavyGradient)"
        />

        {/* 3. CENTER BOTANICAL LEAF & GOLDEN FILIGREE */}
        {/* Left Leaf Contour */}
        <path
          d="M 88 88 C 80 94 77 108 85 120 C 96 116 100 102 96 92 C 92 88 89 88 88 88 Z"
          fill="#f8fafc"
          stroke="url(#mmNavyGradient)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M 86 106 C 91 103 94 98 94 94"
          stroke="url(#mmNavyGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 85 113 C 89 111 92 108 92 105"
          stroke="url(#mmNavyGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Central Golden Botanical Teardrop */}
        <path
          d="M 120 90 C 111 106 111 124 120 138 C 129 124 129 106 120 90 Z"
          fill="url(#mmGoldGradient)"
        />
        <circle cx="120" cy="115" r="5" fill="#ffffff" stroke="url(#mmNavyGradient)" strokeWidth="2.5" />

        {/* Golden Flourish Swirl Ribbon */}
        <path
          d="M 121 130 C 136 142, 154 136, 161 118 C 166 100, 153 85, 138 88 C 128 90, 126 100, 133 105 C 140 108, 146 103, 143 97"
          fill="none"
          stroke="url(#mmGoldGradient)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* 4. RIGHT CALLIGRAPHIC 'M' LEG & SWEPT TAIL */}
        <path
          d="M 124 108 C 137 82, 149 58, 156 48 C 165 75, 168 108, 168 139 C 176 142, 188 140, 188 148 C 186 150, 178 152, 166 148 C 150 142, 136 128, 124 108 Z"
          fill="url(#mmNavyGradient)"
          stroke="url(#mmGoldGradient)"
          strokeWidth="0.8"
        />
        {/* Right Sweeping Crest Wing */}
        <path
          d="M 163 50 C 174 42, 190 54, 195 72 C 200 90, 192 112, 184 128 C 189 114, 194 96, 190 80 C 185 68, 175 58, 163 50 Z"
          fill="url(#mmNavyGradient)"
        />

        {/* 5. BASE HARMONIZING CREST PEDESTAL */}
        <path
          d="M 58 154 C 80 148, 105 153, 120 158 C 135 153, 160 148, 182 154"
          stroke="url(#mmGoldGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="120" cy="158" r="4" fill="url(#mmGoldBright)" />
        <circle cx="58" cy="154" r="2" fill="url(#mmGoldBright)" />
        <circle cx="182" cy="154" r="2" fill="url(#mmGoldBright)" />
      </svg>
    </div>
  );

  const sizeClasses = {
    sm: {
      icon: 34,
      title: 'text-[16px]',
      tagline: 'text-[7px] tracking-[0.32em]',
      gap: 'gap-2.5',
    },
    md: {
      icon: 44,
      title: 'text-[21px]',
      tagline: 'text-[8.5px] tracking-[0.36em]',
      gap: 'gap-3',
    },
    lg: {
      icon: 58,
      title: 'text-[28px]',
      tagline: 'text-[10.5px] tracking-[0.40em]',
      gap: 'gap-3.5',
    },
    xl: {
      icon: 78,
      title: 'text-[36px]',
      tagline: 'text-[13px] tracking-[0.44em]',
      gap: 'gap-4',
    },
    '2xl': {
      icon: 112,
      title: 'text-[48px]',
      tagline: 'text-[16px] tracking-[0.48em]',
      gap: 'gap-5',
    },
  }[size];

  // Visual text color styles with metallic gold gradient shimmer
  const isLight = theme === 'light';

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
        <MonogramIcon iconSize={Math.round(sizeClasses.icon * 1.35)} />
        <div className="mt-3 flex flex-col items-center">
          <h1
            style={{ fontFamily: "'Cinzel Decorative', 'Cinzel', serif" }}
            className={`${sizeClasses.title} font-black tracking-[0.22em] uppercase leading-none select-none bg-gradient-to-r ${
              isLight
                ? 'from-[#0f172a] via-[#1e3a8a] to-[#0f172a]'
                : 'from-[#fef08a] via-[#f59e0b] to-[#fbbf24]'
            } bg-clip-text text-transparent drop-shadow-sm`}
          >
            MEHERMART
          </h1>
          {showTagline && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[6px] text-amber-500">✦</span>
              <p
                style={{ fontFamily: "'Outfit', 'Montserrat', sans-serif" }}
                className={`${sizeClasses.tagline} font-extrabold uppercase text-[#d97706] dark:text-[#fbbf24] leading-none select-none`}
              >
                CURATED FOR EVERYHOME
              </p>
              <span className="text-[6px] text-amber-500">✦</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center text-center p-8 rounded-3xl bg-gradient-to-b from-[#111827]/90 to-[#030712]/95 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] text-slate-100 ${className}`}>
        <MonogramIcon iconSize={110} />
        <div className="mt-5 flex flex-col items-center">
          <h1
            style={{ fontFamily: "'Cinzel Decorative', 'Cinzel', serif" }}
            className="text-4xl md:text-5xl font-black tracking-[0.24em] uppercase leading-none select-none bg-gradient-to-r from-[#fffbeb] via-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(245,158,11,0.4)]"
          >
            MEHERMART
          </h1>
          {showTagline && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-amber-400">✦</span>
              <p
                style={{ fontFamily: "'Outfit', 'Montserrat', sans-serif" }}
                className="text-xs md:text-sm font-black uppercase text-[#fbbf24] tracking-[0.45em] leading-none select-none"
              >
                CURATED FOR EVERYHOME
              </p>
              <span className="text-xs text-amber-400">✦</span>
            </div>
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
          style={{ fontFamily: "'Cinzel Decorative', 'Cinzel', serif" }}
          className={`${sizeClasses.title} font-black tracking-[0.20em] uppercase select-none bg-gradient-to-r ${
            isLight
              ? 'from-[#0f172a] via-[#1e3a8a] to-[#0f172a]'
              : 'from-[#fffbeb] via-[#fbbf24] to-[#f59e0b]'
          } bg-clip-text text-transparent`}
        >
          MEHERMART
        </span>
      </div>
    );
  }

  // Default: Horizontal Brand Identity (Icon + Typography Stack)
  return (
    <div className={`inline-flex items-center ${sizeClasses.gap} ${className} group cursor-pointer`}>
      <MonogramIcon iconSize={sizeClasses.icon} />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span
            style={{ fontFamily: "'Cinzel Decorative', 'Cinzel', serif" }}
            className={`${sizeClasses.title} font-black tracking-[0.18em] uppercase leading-tight select-none bg-gradient-to-r ${
              isLight
                ? 'from-[#0f172a] via-[#1e3a8a] to-[#0f172a]'
                : 'from-[#fffbeb] via-[#fbbf24] to-[#f59e0b]'
            } bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.25)] group-hover:brightness-110 transition-all duration-300`}
          >
            MEHERMART
          </span>
        </div>
        {showTagline && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[5.5px] text-amber-400">✦</span>
            <span
              style={{ fontFamily: "'Outfit', 'Montserrat', sans-serif" }}
              className={`${sizeClasses.tagline} font-black uppercase text-[#d97706] dark:text-[#fbbf24] leading-none select-none opacity-90 group-hover:opacity-100 transition-opacity`}
            >
              CURATED FOR EVERYHOME
            </span>
            <span className="text-[5.5px] text-amber-400">✦</span>
          </div>
        )}
      </div>
    </div>
  );
};

