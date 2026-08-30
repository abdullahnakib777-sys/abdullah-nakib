import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const GalaxyBackground: React.FC = () => {
  const { isDay } = useTheme();

  // Generate a deterministic array of twinkling stars
  const stars = useMemo(() => {
    const starList = [];
    const count = 90;
    for (let i = 0; i < count; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = Math.random() * 2.8 + 1; // 1px to 3.8px
      const duration = Math.random() * 3 + 2; // 2s to 5s
      const delay = Math.random() * 5;
      const color = isDay
        ? i % 4 === 0
          ? '#0284c7' // sky blue
          : i % 6 === 0
          ? '#7c3aed' // royal violet
          : i % 9 === 0
          ? '#ec4899' // rose crystal
          : i % 13 === 0
          ? '#f59e0b' // sunbeam gold
          : '#3b82f6' // azure
        : i % 4 === 0
          ? '#38bdf8' // vibrant cyan
          : i % 6 === 0
          ? '#c084fc' // cosmic violet
          : i % 9 === 0
          ? '#f472b6' // rose nebula
          : i % 13 === 0
          ? '#fbbf24' // warm starlight gold
          : '#ffffff'; // pure white

      starList.push({
        id: i,
        top: `${top}%`,
        left: `${left}%`,
        size: `${size}px`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        color,
      });
    }
    return starList;
  }, [isDay]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-500 ${
        isDay
          ? 'bg-gradient-to-b from-[#f0f4fd] via-[#e6eefc] to-[#edf2f7]'
          : 'bg-gradient-to-b from-[#06070c] via-[#0e0c1f] to-[#14122b]'
      }`}
      style={{
        backgroundImage: isDay
          ? `
            radial-gradient(circle at 20% 15%, rgba(147, 197, 253, 0.4) 0%, transparent 45%),
            radial-gradient(circle at 80% 25%, rgba(192, 132, 252, 0.3) 0%, transparent 42%),
            radial-gradient(circle at 50% 70%, rgba(244, 114, 182, 0.2) 0%, transparent 48%),
            radial-gradient(circle at 10% 85%, rgba(96, 165, 250, 0.3) 0%, transparent 45%),
            radial-gradient(circle at 90% 85%, rgba(251, 191, 36, 0.25) 0%, transparent 40%)
          `
          : `
            radial-gradient(circle at 20% 15%, rgba(139, 92, 246, 0.25) 0%, transparent 45%),
            radial-gradient(circle at 80% 25%, rgba(6, 182, 212, 0.22) 0%, transparent 42%),
            radial-gradient(circle at 50% 70%, rgba(217, 70, 239, 0.18) 0%, transparent 48%),
            radial-gradient(circle at 10% 85%, rgba(59, 130, 246, 0.18) 0%, transparent 45%),
            radial-gradient(circle at 90% 85%, rgba(245, 158, 11, 0.12) 0%, transparent 40%)
          `,
      }}
    >
      {/* Nebula Glowing Dust Orbs with smooth breathing animations */}
      <div
        className={`absolute -top-24 -left-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-3xl ${
          isDay ? 'bg-purple-300/30' : 'bg-purple-600/20'
        }`}
        style={{ animation: 'galaxyNebulaPulse 10s ease-in-out infinite' }}
      />
      <div
        className={`absolute top-1/4 -right-24 w-72 sm:w-[30rem] h-72 sm:h-[30rem] rounded-full blur-3xl ${
          isDay ? 'bg-sky-300/35' : 'bg-cyan-500/18'
        }`}
        style={{ animation: 'galaxyNebulaPulse 14s ease-in-out infinite 2s' }}
      />
      <div
        className={`absolute top-2/3 left-1/12 w-64 sm:w-[28rem] h-64 sm:h-[28rem] rounded-full blur-3xl ${
          isDay ? 'bg-pink-300/25' : 'bg-pink-500/15'
        }`}
        style={{ animation: 'galaxyNebulaPulse 12s ease-in-out infinite 4s' }}
      />
      <div
        className={`absolute -bottom-24 right-1/4 w-80 h-80 rounded-full blur-3xl ${
          isDay ? 'bg-indigo-300/30' : 'bg-indigo-600/20'
        }`}
        style={{ animation: 'galaxyNebulaPulse 16s ease-in-out infinite 6s' }}
      />

      {/* Twinkling Star Field */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            boxShadow: `0 0 8px ${star.color}`,
            animation: `galaxyTwinkle ${star.duration} ease-in-out infinite ${star.delay}`,
            opacity: isDay ? 0.6 : 0.9,
          }}
        />
      ))}

      {/* Intermittent Realistic Shooting Stars / Meteors across viewport */}
      {/* Shooting Star 1 - High streak */}
      <div
        className="absolute"
        style={{
          top: '12%',
          right: '15%',
          width: '150px',
          height: '2px',
          background: isDay
            ? 'linear-gradient(90deg, rgba(2,132,199,1), rgba(59,130,246,0.9), transparent)'
            : 'linear-gradient(90deg, rgba(255,255,255,1), rgba(56,189,248,0.9), transparent)',
          boxShadow: isDay ? '0 0 10px #0284c7' : '0 0 12px #38bdf8',
          animation: 'galaxyShootingStar 6.5s linear infinite 1s',
        }}
      />
      {/* Shooting Star 2 - Mid streak */}
      <div
        className="absolute"
        style={{
          top: '38%',
          right: '8%',
          width: '180px',
          height: '2px',
          background: isDay
            ? 'linear-gradient(90deg, rgba(124,58,237,1), rgba(168,85,247,0.9), transparent)'
            : 'linear-gradient(90deg, rgba(255,255,255,1), rgba(192,132,252,0.9), transparent)',
          boxShadow: isDay ? '0 0 12px #7c3aed' : '0 0 14px #c084fc',
          animation: 'galaxyShootingStarAlt 8.5s linear infinite 4s',
        }}
      />
      {/* Shooting Star 3 - Lower streak */}
      <div
        className="absolute"
        style={{
          top: '65%',
          right: '28%',
          width: '130px',
          height: '2px',
          background: isDay
            ? 'linear-gradient(90deg, rgba(236,72,153,1), rgba(244,114,182,0.9), transparent)'
            : 'linear-gradient(90deg, rgba(255,255,255,1), rgba(244,114,182,0.9), transparent)',
          boxShadow: isDay ? '0 0 10px #ec4899' : '0 0 10px #f472b6',
          animation: 'galaxyShootingStar 9.5s linear infinite 7s',
        }}
      />

      {/* Cute Floating Cosmic Spirit Mascot in Background */}
      <div
        className="hidden md:block absolute top-24 right-8 w-24 h-24 opacity-60 hover:opacity-90 transition-opacity"
        style={{ animation: 'galaxyFloatSlow 7s ease-in-out infinite' }}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
          <circle cx="60" cy="55" r="45" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="60" cy="55" r="32" fill="url(#spaceGlow)" />
          
          {/* Chibi Helmet */}
          <ellipse cx="60" cy="50" rx="28" ry="26" fill={isDay ? '#3b82f6' : '#1e1b4b'} stroke="#38bdf8" strokeWidth="2.5" />
          <ellipse cx="60" cy="50" rx="22" ry="18" fill="url(#visorGrad)" stroke="#c084fc" strokeWidth="1.5" />
          <ellipse cx="53" cy="48" rx="3.5" ry="5" fill="#ffffff" />
          <circle cx="54" cy="46" r="1.5" fill="#38bdf8" />
          <ellipse cx="67" cy="48" rx="3.5" ry="5" fill="#ffffff" />
          <circle cx="68" cy="46" r="1.5" fill="#38bdf8" />
          <ellipse cx="49" cy="54" rx="3" ry="1.5" fill="#f472b6" opacity="0.8" />
          <ellipse cx="71" cy="54" rx="3" ry="1.5" fill="#f472b6" opacity="0.8" />
          
          <path d="M46 72 Q60 65 74 72 L72 92 Q60 98 48 92 Z" fill={isDay ? '#6366f1' : '#312e81'} stroke="#38bdf8" strokeWidth="2" />
          <rect x="52" y="76" width="16" height="10" rx="3" fill={isDay ? '#8b5cf6' : '#4338ca'} stroke="#c084fc" strokeWidth="1" />
          
          <line x1="72" y1="78" x2="88" y2="62" stroke={isDay ? '#334155' : '#e2e8f0'} strokeWidth="2" strokeLinecap="round" />
          <polygon points="88,52 92,60 100,61 94,67 96,75 88,70 80,75 82,67 76,61 84,60" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
          <circle cx="88" cy="63" r="12" fill="rgba(251,191,36,0.25)" />

          <defs>
            <radialGradient id="spaceGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="visorGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={isDay ? '#0284c7' : '#0f172a'} />
              <stop offset="50%" stopColor={isDay ? '#4f46e5' : '#1e1b4b'} />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

