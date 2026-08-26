import React, { useMemo } from 'react';

export const GalaxyBackground: React.FC = () => {
  // Generate a deterministic array of twinkling stars
  const stars = useMemo(() => {
    const starList = [];
    const count = 75;
    for (let i = 0; i < count; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = Math.random() * 2.5 + 1; // 1px to 3.5px
      const duration = Math.random() * 3 + 2; // 2s to 5s
      const delay = Math.random() * 5;
      const color =
        i % 5 === 0
          ? '#38bdf8' // cyan
          : i % 7 === 0
          ? '#c084fc' // violet
          : i % 11 === 0
          ? '#f472b6' // pink
          : '#ffffff'; // white

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
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-[#0b0c10] via-[#131124] to-[#1a172e]"
      style={{
        backgroundImage: `
          radial-gradient(circle at 15% 20%, rgba(139, 92, 246, 0.18) 0%, transparent 45%),
          radial-gradient(circle at 85% 30%, rgba(6, 182, 212, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 50% 85%, rgba(217, 70, 239, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 75% 80%, rgba(59, 130, 246, 0.12) 0%, transparent 45%)
        `,
      }}
    >
      {/* Nebula Glowing Dust Orbs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl"
        style={{ animation: 'galaxyNebulaPulse 12s ease-in-out infinite' }}
      />
      <div
        className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-cyan-500/10 blur-3xl"
        style={{ animation: 'galaxyNebulaPulse 16s ease-in-out infinite 3s' }}
      />
      <div
        className="absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] rounded-full bg-pink-500/10 blur-3xl"
        style={{ animation: 'galaxyNebulaPulse 14s ease-in-out infinite 6s' }}
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
            boxShadow: `0 0 6px ${star.color}`,
            animation: `galaxyTwinkle ${star.duration} ease-in-out infinite ${star.delay}`,
          }}
        />
      ))}

      {/* Intermittent Realistic Shooting Stars / Meteors */}
      {/* Shooting Star 1 */}
      <div
        className="absolute"
        style={{
          top: '8%',
          right: '12%',
          width: '140px',
          height: '2px',
          background: 'linear-gradient(90deg, rgba(255,255,255,1), rgba(56,189,248,0.8), transparent)',
          boxShadow: '0 0 10px #38bdf8',
          animation: 'galaxyShootingStar 7s linear infinite 1.5s',
        }}
      />
      {/* Shooting Star 2 */}
      <div
        className="absolute"
        style={{
          top: '30%',
          right: '5%',
          width: '180px',
          height: '2px',
          background: 'linear-gradient(90deg, rgba(255,255,255,1), rgba(192,132,252,0.8), transparent)',
          boxShadow: '0 0 12px #c084fc',
          animation: 'galaxyShootingStarAlt 9s linear infinite 5s',
        }}
      />
      {/* Shooting Star 3 */}
      <div
        className="absolute"
        style={{
          top: '60%',
          right: '25%',
          width: '120px',
          height: '2px',
          background: 'linear-gradient(90deg, rgba(255,255,255,1), rgba(244,114,182,0.8), transparent)',
          boxShadow: '0 0 8px #f472b6',
          animation: 'galaxyShootingStar 11s linear infinite 8s',
        }}
      />

      {/* Cute Floating Anime Characters in Background Margins / Corners */}
      {/* Anime Mascot 1: Star Chibi Astronaut in Top Right Margin */}
      <div
        className="hidden lg:block absolute top-20 right-8 w-28 h-28 opacity-65 hover:opacity-90 transition-opacity"
        style={{ animation: 'galaxyFloatSlow 6s ease-in-out infinite' }}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
          {/* Subtle Starlight Halo */}
          <circle cx="60" cy="55" r="45" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="60" cy="55" r="32" fill="url(#spaceGlow)" />
          
          {/* Chibi Astronaut Helmet */}
          <ellipse cx="60" cy="50" rx="28" ry="26" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Visor */}
          <ellipse cx="60" cy="50" rx="22" ry="18" fill="url(#visorGrad)" stroke="#c084fc" strokeWidth="1.5" />
          {/* Cute Eyes Reflection inside Visor */}
          <ellipse cx="53" cy="48" rx="3.5" ry="5" fill="#ffffff" />
          <circle cx="54" cy="46" r="1.5" fill="#38bdf8" />
          <ellipse cx="67" cy="48" rx="3.5" ry="5" fill="#ffffff" />
          <circle cx="68" cy="46" r="1.5" fill="#38bdf8" />
          {/* Anime Blush */}
          <ellipse cx="49" cy="54" rx="3" ry="1.5" fill="#f472b6" opacity="0.8" />
          <ellipse cx="71" cy="54" rx="3" ry="1.5" fill="#f472b6" opacity="0.8" />
          
          {/* Chibi Body */}
          <path d="M46 72 Q60 65 74 72 L72 92 Q60 98 48 92 Z" fill="#312e81" stroke="#38bdf8" strokeWidth="2" />
          <rect x="52" y="76" width="16" height="10" rx="3" fill="#4338ca" stroke="#c084fc" strokeWidth="1" />
          <circle cx="56" cy="81" r="1.5" fill="#38bdf8" />
          <circle cx="64" cy="81" r="1.5" fill="#f43f5e" />
          
          {/* Star Wand in Hand */}
          <line x1="72" y1="78" x2="88" y2="62" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
          <polygon points="88,52 92,60 100,61 94,67 96,75 88,70 80,75 82,67 76,61 84,60" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
          <circle cx="88" cy="63" r="12" fill="rgba(251,191,36,0.25)" />

          <defs>
            <radialGradient id="spaceGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="visorGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Anime Mascot 2: Cute Cosmic Cat / Celestial Spirit in Bottom Left Margin */}
      <div
        className="hidden lg:block absolute bottom-16 left-6 w-24 h-24 opacity-60 hover:opacity-90 transition-opacity"
        style={{ animation: 'galaxyFloatGentle 7s ease-in-out infinite 1s' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
          {/* Orbital Ring */}
          <ellipse cx="50" cy="55" rx="38" ry="12" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" transform="rotate(-15 50 55)" />
          
          {/* Cute Celestial Spirit Sphere */}
          <circle cx="50" cy="50" r="24" fill="url(#spiritGrad)" stroke="#c084fc" strokeWidth="2" />
          
          {/* Cat / Spirit Ears */}
          <polygon points="32,36 38,18 46,30" fill="#6366f1" stroke="#c084fc" strokeWidth="1.5" />
          <polygon points="68,36 62,18 54,30" fill="#6366f1" stroke="#c084fc" strokeWidth="1.5" />
          <polygon points="35,32 39,22 43,30" fill="#f472b6" />
          <polygon points="65,32 61,22 57,30" fill="#f472b6" />
          
          {/* Big Anime Eyes */}
          <circle cx="42" cy="48" r="4.5" fill="#0f172a" />
          <circle cx="41" cy="46" r="1.8" fill="#ffffff" />
          <circle cx="58" cy="48" r="4.5" fill="#0f172a" />
          <circle cx="57" cy="46" r="1.8" fill="#ffffff" />
          
          {/* Sweet smile */}
          <path d="M47 54 Q50 57 53 54" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
          {/* Cheeks */}
          <circle cx="37" cy="53" r="2.5" fill="#f472b6" opacity="0.8" />
          <circle cx="63" cy="53" r="2.5" fill="#f472b6" opacity="0.8" />

          {/* Mini floating star beside it */}
          <polygon points="76,32 78,36 82,36 79,39 80,43 76,40 72,43 73,39 70,36 74,36" fill="#38bdf8" />

          <defs>
            <linearGradient id="spiritGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4338ca" />
              <stop offset="60%" stopColor="#312e81" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
