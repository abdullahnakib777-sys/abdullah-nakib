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
  // Ultra-precise vector recreation of the royal/botanical luxury MeherMart insignia from the brand image:
  // Navy blue curved Serif 'M' intertwining with golden filigree leaf, central teardrop droplet, floral crest, and right swirl.
  const MonogramIcon = ({ iconSize = 44 }: { iconSize?: number }) => (
    <div
      className="relative flex items-center justify-center shrink-0 transition-all duration-300"
      style={{ width: iconSize, height: iconSize }}
    >
      <svg
        viewBox="0 0 240 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_12px_rgba(201,162,77,0.3)]"
      >
        <defs>
          {/* Royal Heritage Deep Navy / Midnight Blue */}
          <linearGradient id="mmNavyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a63" />
            <stop offset="40%" stopColor="#122744" />
            <stop offset="100%" stopColor="#0a1728" />
          </linearGradient>

          {/* Luxury Warm Antique Gold Gradient */}
          <linearGradient id="mmGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#edd89f" />
            <stop offset="35%" stopColor="#cf9f48" />
            <stop offset="70%" stopColor="#b8832a" />
            <stop offset="100%" stopColor="#e3ba63" />
          </linearGradient>

          {/* Highlight Gold */}
          <linearGradient id="mmGoldBright" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#faeaae" />
            <stop offset="100%" stopColor="#c59239" />
          </linearGradient>
        </defs>

        {/* 1. TOP BOTANICAL CREST & PETALS (GOLD) */}
        {/* Central Crown Petal */}
        <path
          d="M 120 18 C 114 30 110 38 120 54 C 130 38 126 30 120 18 Z"
          fill="url(#mmGoldBright)"
          stroke="#97691b"
          strokeWidth="0.8"
        />
        {/* Left Crown Petal */}
        <path
          d="M 112 36 C 98 28 92 38 102 50 C 110 46 112 40 112 36 Z"
          fill="url(#mmGoldGradient)"
          stroke="#97691b"
          strokeWidth="0.8"
        />
        {/* Right Crown Petal */}
        <path
          d="M 128 36 C 142 28 148 38 138 50 C 130 46 128 40 128 36 Z"
          fill="url(#mmGoldGradient)"
          stroke="#97691b"
          strokeWidth="0.8"
        />
        {/* Small Base Crown Nodes */}
        <circle cx="106" cy="54" r="2" fill="url(#mmGoldBright)" />
        <circle cx="134" cy="54" r="2" fill="url(#mmGoldBright)" />

        {/* 2. LEFT FLOURISHED NAVY 'M' ARM (Calligraphic Serif) */}
        <path
          d="M 52 144 C 52 138, 64 140, 72 137 C 72 108, 75 75, 84 48 C 91 58, 103 82, 116 108 C 104 128, 90 142, 74 146 C 62 149, 54 146, 52 144 Z"
          fill="url(#mmNavyGradient)"
        />
        {/* Outer Left Calligraphic Hook Swirl */}
        <path
          d="M 64 56 C 53 58, 42 72, 45 88 C 47 105, 57 114, 59 128 C 52 128, 45 120, 42 106 C 39 84, 50 64, 66 52 C 72 48, 77 52, 64 56 Z"
          fill="url(#mmNavyGradient)"
        />

        {/* 3. CENTER BOTANICAL MOTIFS & LEAVES */}
        {/* Left Organic Leaf Contour & Vein (Navy & Gold) */}
        <path
          d="M 88 88 C 80 94 77 108 85 120 C 96 116 100 102 96 92 C 92 88 89 88 88 88 Z"
          fill="#faf7f0"
          stroke="url(#mmNavyGradient)"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        {/* Leaf Internal Rib/Vein */}
        <path
          d="M 86 106 C 91 103 94 98 94 94"
          stroke="url(#mmNavyGradient)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M 85 113 C 89 111 92 108 92 105"
          stroke="url(#mmNavyGradient)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Central Golden Botanical Filigree & Teardrop Droplet */}
        <path
          d="M 120 90 C 111 106 111 124 120 138 C 129 124 129 106 120 90 Z"
          fill="url(#mmGoldGradient)"
        />
        <circle cx="120" cy="115" r="5" fill="#faf7f0" stroke="url(#mmNavyGradient)" strokeWidth="2.5" />

        {/* Golden Flourish Swirl Arc (Right of center) */}
        <path
          d="M 121 130 C 136 142, 154 136, 161 118 C 166 100, 153 85, 138 88 C 128 90, 126 100, 133 105 C 140 108, 146 103, 143 97"
          fill="none"
          stroke="url(#mmGoldGradient)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* 4. RIGHT NAVY 'M' LEG & MAJESTIC CREST SWIRL */}
        <path
          d="M 124 108 C 137 82, 149 58, 156 48 C 165 75, 168 108, 168 137 C 176 140, 188 138, 188 144 C 186 146, 178 149, 166 146 C 150 142, 136 128, 124 108 Z"
          fill="url(#mmNavyGradient)"
        />
        {/* Right Outer Sweeping Curved Tail */}
        <path
          d="M 163 50 C 174 42, 190 54, 195 72 C 200 90, 192 112, 184 128 C 189 114, 194 96, 190 80 C 185 68, 175 58, 163 50 Z"
          fill="url(#mmNavyGradient)"
        />

        {/* 5. BASE DECORATIVE SPREAD (Tying the letters with gold balance) */}
        <path
          d="M 60 149 C 80 144, 105 149, 120 154 C 135 149, 160 144, 180 149"
          stroke="url(#mmGoldGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="120" cy="154" r="3.5" fill="url(#mmGoldBright)" />
      </svg>
    </div>
  );

  // High contrast typography matching the uploaded image exactly:
  // "MEHERMART" in refined luxury high-contrast serif with flared junctions
  // "CURATED FOR EVERYHOME" in clean, tracked golden sans-serif/serif
  const sizeClasses = {
    sm: {
      icon: 32,
      title: 'text-[15px]',
      tagline: 'text-[7.5px] tracking-[0.24em]',
      gap: 'gap-2.5',
    },
    md: {
      icon: 42,
      title: 'text-[19px]',
      tagline: 'text-[8.5px] tracking-[0.28em]',
      gap: 'gap-3',
    },
    lg: {
      icon: 58,
      title: 'text-[26px]',
      tagline: 'text-[10px] tracking-[0.32em]',
      gap: 'gap-3.5',
    },
    xl: {
      icon: 78,
      title: 'text-[34px]',
      tagline: 'text-[12px] tracking-[0.36em]',
      gap: 'gap-4',
    },
    '2xl': {
      icon: 110,
      title: 'text-[46px]',
      tagline: 'text-[15px] tracking-[0.4em]',
      gap: 'gap-5',
    },
  }[size];

  // Visual text color tokens
  const titleColor =
    theme === 'light'
      ? 'text-[#0d2238]'
      : 'text-slate-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]';

  const taglineColor = 'text-[#c69a4e]';

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
            style={{ fontFamily: "'Cinzel', 'Cormorant Garamond', serif" }}
            className={`${sizeClasses.title} font-extrabold tracking-[0.16em] uppercase ${titleColor} leading-none select-none`}
          >
            MEHERMART
          </h1>
          {showTagline && (
            <p
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              className={`${sizeClasses.tagline} font-bold uppercase ${taglineColor} mt-1.5 leading-none select-none`}
            >
              CURATED FOR EVERYHOME
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center text-center p-6 rounded-3xl bg-[#faf7f2]/95 border border-[#e4d7bc] shadow-xl text-[#0d2238] ${className}`}>
        <MonogramIcon iconSize={100} />
        <div className="mt-4 flex flex-col items-center">
          <h1
            style={{ fontFamily: "'Cinzel', 'Cormorant Garamond', serif" }}
            className="text-4xl md:text-5xl font-black tracking-[0.18em] uppercase text-[#0e243c] leading-none select-none"
          >
            MEHERMART
          </h1>
          {showTagline && (
            <p
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              className="text-xs md:text-sm font-bold uppercase text-[#be903b] tracking-[0.36em] mt-2.5 leading-none select-none"
            >
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
          style={{ fontFamily: "'Cinzel', 'Cormorant Garamond', serif" }}
          className={`${sizeClasses.title} font-extrabold tracking-[0.14em] uppercase ${titleColor} select-none`}
        >
          MEHERMART
        </span>
      </div>
    );
  }

  // Default: Horizontal Brand Identity (Icon + Typography Stack)
  return (
    <div className={`inline-flex items-center ${sizeClasses.gap} ${className} group`}>
      <MonogramIcon iconSize={sizeClasses.icon} />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span
            style={{ fontFamily: "'Cinzel', 'Cormorant Garamond', serif" }}
            className={`${sizeClasses.title} font-black tracking-[0.15em] uppercase ${titleColor} leading-tight select-none`}
          >
            MEHERMART
          </span>
        </div>
        {showTagline && (
          <span
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            className={`${sizeClasses.tagline} font-bold uppercase ${taglineColor} mt-0.5 leading-none select-none`}
          >
            CURATED FOR EVERYHOME
          </span>
        )}
      </div>
    </div>
  );
};
