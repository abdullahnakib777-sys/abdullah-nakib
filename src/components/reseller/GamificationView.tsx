import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Achievement, WeeklyChallenge, ResellerProfile } from '../../types';
import {
  RESELLER_RANKS,
  ResellerRankTier,
  getRankForXp,
  canWithdrawXpBonus,
  getXpBonusBdt,
} from '../../data/bangladeshGeo';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { triggerLevelUpCelebration } from '../common/ConfettiTrigger';
import {
  Award,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
  Lock,
  Crown,
  Flame,
  Zap,
  DollarSign,
  ChevronRight,
  Gift,
  ShieldCheck,
  PackageCheck,
  Truck,
  MapPin,
  GraduationCap,
  Users,
  Coins,
  Gem,
  Info,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const BADGE_ICONS: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
  Sparkles: <Sparkles className="w-6 h-6 text-amber-400" />,
  PackageCheck: <PackageCheck className="w-6 h-6 text-cyan-400" />,
  Trophy: <Trophy className="w-6 h-6 text-yellow-400" />,
  Flame: <Flame className="w-6 h-6 text-orange-400" />,
  GraduationCap: <GraduationCap className="w-6 h-6 text-indigo-400" />,
  Award: <Award className="w-6 h-6 text-purple-400" />,
  Crown: <Crown className="w-6 h-6 text-amber-400" />,
  Users: <Users className="w-6 h-6 text-teal-400" />,
  Zap: <Zap className="w-6 h-6 text-yellow-400" />,
  Truck: <Truck className="w-6 h-6 text-blue-400" />,
  MapPin: <MapPin className="w-6 h-6 text-rose-400" />,
  Coins: <Coins className="w-6 h-6 text-amber-400" />,
  Gem: <Gem className="w-6 h-6 text-pink-400" />,
};

export const GamificationView: React.FC<{ reseller: ResellerProfile }> = ({ reseller: initialReseller }) => {
  const toast = useToast();
  const [reseller, setReseller] = useState<ResellerProfile>(initialReseller);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([]);
  const [claimedXpBonus, setClaimedXpBonus] = useState<number>(0);
  const [selectedRankDetail, setSelectedRankDetail] = useState<ResellerRankTier | null>(null);
  const [activeBadgeCategory, setActiveBadgeCategory] = useState<string>('ALL');
  const [isClaimingBonus, setIsClaimingBonus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGamificationData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getGamification();
      setAchievements(res.achievements || []);
      setUnlockedIds((res.unlocked || []).map((u) => u.achievementId));
      setChallenges(res.weeklyChallenges || []);
      if (res.claimedXpBonus !== undefined) {
        setClaimedXpBonus(res.claimedXpBonus);
      }
      if (res.resellerXp !== undefined) {
        setReseller((prev) => ({
          ...prev,
          xp: res.resellerXp,
          level: res.resellerLevel || prev.level,
        }));
      }
    } catch (err) {
      console.error('Failed to load gamification data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGamificationData();
  }, [initialReseller.id]);

  const currentXp = reseller.xp || 0;
  const currentRank = getRankForXp(currentXp);
  const isEligibleForCashout = canWithdrawXpBonus(currentXp);
  const claimableXp = Math.max(0, currentXp - claimedXpBonus);
  const claimableBdt = claimableXp * 1; // 1 XP = ৳1 BDT

  const handleClaimBonus = async () => {
    if (!isEligibleForCashout) {
      toast.showToast({
        type: 'warning',
        title: 'Rank Too Low for XP Cashout',
        message: `You must reach Ultra Better rank (701+ XP) to withdraw your XP bonus. You need ${701 - currentXp} XP more!`,
      });
      return;
    }

    if (claimableXp <= 0) {
      toast.showToast({
        type: 'info',
        title: 'Already Claimed',
        message: 'All your earned XP bonuses have already been converted to your wallet balance.',
      });
      return;
    }

    try {
      setIsClaimingBonus(true);
      const res = await api.claimXpBonus();
      triggerLevelUpCelebration();
      toast.showToast({
        type: 'success',
        title: '🎉 XP Bonus Transferred to Wallet!',
        message: `Successfully converted ${res.convertedXp} XP into ৳${res.bonusBdt} withdrawable wallet balance!`,
      });
      setClaimedXpBonus(res.totalClaimedXp);
      fetchGamificationData();
    } catch (err: any) {
      toast.showToast({
        type: 'error',
        title: 'Conversion Failed',
        message: err.message || 'Could not claim XP bonus.',
      });
    } finally {
      setIsClaimingBonus(false);
    }
  };

  // Badge Category Filtering
  const filteredBadges = achievements.filter((ach) => {
    if (activeBadgeCategory === 'ALL') return true;
    if (activeBadgeCategory === 'SALES') return ach.category === 'SALES' || ach.conditionType === 'SALES_COUNT';
    if (activeBadgeCategory === 'DELIVERY') return ach.category === 'DELIVERY' || ach.conditionType === 'DELIVERIES';
    if (activeBadgeCategory === 'ACADEMY') return ach.category === 'ACADEMY';
    if (activeBadgeCategory === 'STREAK') return ach.category === 'STREAK';
    if (activeBadgeCategory === 'SPECIAL') return ach.category === 'SPECIAL' || ach.category === 'VERIFICATION' || ach.category === 'REFERRAL';
    return true;
  });

  return (
    <div className="space-y-8" id="gamification-view">
      {/* Top Banner: Rank + XP Balance + 1 XP = ৳1 Cashout System */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-white">
        {/* Glow backdrop aura */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Rank & Profile Header */}
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Reseller Rank System (7 Tiers)</span>
            </div>

            <div className="flex items-center gap-4">
              {currentRank.image ? (
                <img
                  src={currentRank.image}
                  alt={currentRank.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-lg shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-800 to-indigo-600 border-2 border-purple-400 flex items-center justify-center text-3xl shadow-lg shrink-0">
                  {currentRank.badge}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentRank.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black">
                    Rank {currentRank.level} of 7
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                  {currentRank.nameBn} • {currentRank.minXp} - {currentRank.maxXp > 100000 ? '∞' : currentRank.maxXp} XP Range
                </p>
              </div>
            </div>

            {/* Progress to next level bar */}
            {currentRank.level < 7 && (() => {
              const nextRank = RESELLER_RANKS[currentRank.level];
              const xpInCurrentLevel = currentXp - currentRank.minXp;
              const totalXpInLevel = nextRank.minXp - currentRank.minXp;
              const pct = Math.min(100, Math.max(5, Math.round((xpInCurrentLevel / totalXpInLevel) * 100)));
              const xpNeeded = Math.max(0, nextRank.minXp - currentXp);

              return (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>Progress to {nextRank.name} ({nextRank.badge})</span>
                    <span className="text-amber-300 font-mono font-bold">{xpNeeded} XP needed</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/60">
                    <div
                      className="bg-gradient-to-r from-purple-500 via-indigo-400 to-amber-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* XP to BDT Bonus Cashout Card */}
          <div className="bg-slate-950/80 border border-purple-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4 min-w-[280px] lg:max-w-xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-300 font-bold uppercase tracking-wide flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  XP Bonus Vault
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-black">
                  1 XP = ৳1 BDT
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-400 font-mono">{currentXp}</span>
                <span className="text-xs text-slate-400 font-bold">Total XP Earned</span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Total Cash Value: <strong className="text-emerald-400">৳{getXpBonusBdt(currentXp)} BDT</strong>
              </p>
            </div>

            {/* Cashout Eligibility Indicator */}
            {isEligibleForCashout ? (
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Claimable Cashout:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">৳{claimableBdt} BDT</span>
                </div>
                <button
                  onClick={handleClaimBonus}
                  disabled={isClaimingBonus || claimableBdt <= 0}
                  className={`w-full py-2.5 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                    claimableBdt > 0
                      ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 hover:brightness-110 shadow-amber-500/20 cursor-pointer animate-pulse'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isClaimingBonus
                      ? 'Converting to Wallet...'
                      : claimableBdt > 0
                      ? `Withdraw ৳${claimableBdt} to Wallet`
                      : 'All XP Bonuses Claimed'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[11px] text-amber-200/90 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Cashout Unlocks at Ultra Better</span>
                </div>
                <p className="text-[10px] leading-relaxed text-slate-300">
                  Reach <strong>Ultra Better (701+ XP)</strong> to unlock ৳1/XP bonus withdrawals! Need only{' '}
                  <strong className="text-amber-300 font-mono">{701 - currentXp} XP</strong> more.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7-Tier Reseller Rank Roadmap Carousel / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              7 Reseller Rank Tiers & Perks
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            Click any rank to view VIP privileges & commission rates
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {RESELLER_RANKS.map((tier) => {
            const isUnlocked = currentXp >= tier.minXp;
            const isCurrent = currentRank.level === tier.level;

            return (
              <button
                key={tier.level}
                onClick={() => setSelectedRankDetail(tier)}
                className={`text-left p-3.5 rounded-2xl border transition relative flex flex-col justify-between group cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/15 border-amber-400 text-slate-900 dark:text-white shadow-md ring-2 ring-amber-400/30'
                    : isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 text-slate-400 dark:text-slate-600 opacity-75 hover:opacity-100'
                }`}
              >
                {/* Status Indicator Pill */}
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Lvl {tier.level}
                  </span>
                  {isCurrent ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-950 uppercase tracking-tighter">
                      Current
                    </span>
                  ) : isUnlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>

                {/* Badge Icon or Real Goat Photo */}
                <div className="flex flex-col items-center text-center my-1">
                  {tier.level === 4 && tier.image ? (
                    <div className="relative mb-1">
                      <img
                        src={tier.image}
                        alt="The GOAT"
                        className="w-12 h-12 rounded-xl object-cover border border-amber-400 shadow-xs"
                      />
                      <span className="absolute -bottom-1 -right-1 text-xs">🐐</span>
                    </div>
                  ) : (
                    <span className="text-3xl mb-1">{tier.badge}</span>
                  )}
                  <h3 className="font-black text-xs text-slate-900 dark:text-white truncate w-full">
                    {tier.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {tier.minXp} - {tier.maxXp > 100000 ? '∞' : tier.maxXp} XP
                  </p>
                </div>

                {/* Cashout Tag */}
                <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 w-full text-center">
                  {tier.canWithdrawXpBonus ? (
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" /> ৳1/XP Cashout
                    </span>
                  ) : (
                    <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                      Locked Cashout
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rank Detail Modal */}
      {selectedRankDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                {selectedRankDetail.image ? (
                  <img
                    src={selectedRankDetail.image}
                    alt={selectedRankDetail.name}
                    className="w-12 h-12 rounded-xl object-cover border border-amber-400"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-2xl">
                    {selectedRankDetail.badge}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black">{selectedRankDetail.name} (Rank {selectedRankDetail.level})</h3>
                  <p className="text-xs text-purple-200">{selectedRankDetail.nameBn} • {selectedRankDetail.minXp} - {selectedRankDetail.maxXp > 100000 ? 'Unlimited' : selectedRankDetail.maxXp} XP</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRankDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">XP Range</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                    {selectedRankDetail.minXp} - {selectedRankDetail.maxXp > 100000 ? '∞' : selectedRankDetail.maxXp} XP
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">XP Money Cashout</span>
                  <span className={`text-sm font-black ${selectedRankDetail.canWithdrawXpBonus ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    {selectedRankDetail.canWithdrawXpBonus ? '✓ Unlocked (1 XP = ৳1)' : '🔒 Locked (Need Rank 3+)'}
                  </span>
                </div>
              </div>

              {/* VIP Perks */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">
                  Exclusive Privileges & Perks:
                </h4>
                <ul className="space-y-2">
                  {selectedRankDetail.perks.map((perk, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-slate-800 dark:text-slate-200"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">{perk}</span>
                        {selectedRankDetail.perksBn?.[idx] && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {selectedRankDetail.perksBn[idx]}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setSelectedRankDetail(null)}
                className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold rounded-xl transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Performance Challenges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Active Weekly Challenges
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Complete to win cash bonuses + XP boosts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((ch) => {
            const current = ch.currentProgress || ch.currentCount || 0;
            const target = ch.targetCount || 1;
            const pct = Math.min(100, Math.round((current / target) * 100));

            return (
              <div
                key={ch.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
                    {ch.frequency || 'Weekly'} Challenge
                  </span>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50 flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-amber-500" />
                    Reward: {ch.rewardBonusBdt || ch.rewardBdt ? `৳${ch.rewardBonusBdt || ch.rewardBdt} + ` : ''}+{ch.rewardXp} XP
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{ch.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {ch.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500 dark:text-slate-400">Progress</span>
                    <span className="text-slate-900 dark:text-white font-mono font-bold">
                      {current} / {target} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Accolades Section (9 User Milestones + Rich Badges) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Badges & Accolades
            </h2>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['ALL', 'SALES', 'DELIVERY', 'STREAK', 'ACADEMY', 'SPECIAL'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveBadgeCategory(cat)}
                className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
                  activeBadgeCategory === cat
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL'
                  ? 'All Badges'
                  : cat === 'SALES'
                  ? 'Sales'
                  : cat === 'DELIVERY'
                  ? 'Deliveries'
                  : cat === 'STREAK'
                  ? 'Streaks'
                  : cat === 'ACADEMY'
                  ? 'Academy'
                  : 'Special'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBadges.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);
            const iconElement = BADGE_ICONS[ach.icon] || <Award className="w-6 h-6 text-amber-400" />;

            return (
              <div
                key={ach.id}
                className={`p-5 rounded-3xl border transition flex gap-4 items-start relative ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-700/60 shadow-xs'
                    : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                }`}
              >
                {/* Badge Icon Frame */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-600/50 shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 grayscale opacity-60'
                  }`}
                >
                  {iconElement}
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                        {ach.title}
                      </h3>
                      {ach.titleBn && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {ach.titleBn}
                        </p>
                      )}
                    </div>
                    {isUnlocked ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-[10px] font-black shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold shrink-0 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ach.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-md font-mono">
                      +{ach.xpReward} XP
                    </span>
                    {ach.badgeReward && (
                      <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md">
                        {ach.badgeReward}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
