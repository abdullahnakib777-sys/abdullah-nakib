import React, { useState, useEffect } from 'react';
import { Achievement, WeeklyChallenge, ResellerProfile } from '../../types';
import { RESELLER_LEVEL_TIERS } from '../../data/bangladeshGeo';
import { api } from '../../services/api';
import { Award, Trophy, Target, Sparkles, CheckCircle2, Shield, Crown, Flame, Zap } from 'lucide-react';

export const GamificationView: React.FC<{ reseller: ResellerProfile }> = ({ reseller }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([]);

  useEffect(() => {
    api.getGamification().then((res) => {
      setAchievements(res.achievements || []);
      setUnlockedIds((res.unlocked || []).map((u) => u.achievementId));
      setChallenges(res.weeklyChallenges || []);
    });
  }, [reseller.id]);

  const currentLevel = reseller.level || 1;
  const levelInfo = RESELLER_LEVEL_TIERS[currentLevel];

  return (
    <div className="space-y-8" id="gamification-view">
      {/* Tier Roadmap Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-300" />
              <span className="text-xs uppercase tracking-wider font-bold text-purple-200">
                Reseller Level Progression
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Current Rank: {levelInfo.name} (Level {currentLevel})
            </h2>
          </div>
          <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
            <span className="text-xs text-purple-200 block">Total Experience</span>
            <span className="text-2xl font-black text-amber-300">{reseller.xp} XP</span>
          </div>
        </div>

        {/* 5-Level Progress Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {Object.entries(RESELLER_LEVEL_TIERS).map(([lvlStr, tier]) => {
            const lvl = Number(lvlStr);
            const isUnlocked = currentLevel >= lvl;
            const isCurrent = currentLevel === lvl;

            return (
              <div
                key={lvl}
                className={`p-3.5 rounded-2xl border transition text-center space-y-1 ${
                  isCurrent
                    ? 'bg-amber-400/20 border-amber-400 text-white shadow-lg'
                    : isUnlocked
                    ? 'bg-white/10 border-white/20 text-slate-200'
                    : 'bg-white/5 border-white/5 text-slate-500 opacity-60'
                }`}
              >
                <div className="text-xl">{tier.badge}</div>
                <p className="text-xs font-bold">{tier.name}</p>
                <p className="text-[10px] text-slate-300">Level {lvl}</p>
                <p className="text-[9px] text-amber-300/90 font-mono">
                  {tier.minOrders === 0 ? 'Starter' : `${tier.minOrders}+ delivered`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Active Challenges */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-base text-slate-900">Weekly Performance Challenges</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((ch) => {
            const pct = Math.min(100, Math.round((ch.currentCount / ch.targetCount) * 100));
            return (
              <div
                key={ch.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    Active Challenge
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Reward: {ch.rewardBdt ? `৳${ch.rewardBdt} Bonus + ` : ''}{ch.rewardXp} XP
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{ch.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{ch.description}</p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-slate-900">
                      {ch.currentCount} / {ch.targetCount} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-base text-slate-900">Badges & Accolades</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-5 rounded-3xl border transition flex gap-3.5 items-start ${
                  isUnlocked
                    ? 'bg-white border-emerald-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked ? 'bg-amber-100 border border-amber-300 shadow-xs' : 'bg-slate-200 grayscale'
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-slate-900">{ach.title}</h4>
                    {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{ach.description}</p>
                  <span className="inline-block text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    +{ach.xpReward} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
