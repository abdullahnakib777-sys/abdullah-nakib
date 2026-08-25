import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../../types';
import { api } from '../../services/api';
import { Trophy, Medal, Award, Flame, Crown, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'allTime'>('allTime');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    api
      .getLeaderboard(period)
      .then((res) => {
        setLeaderboard(res.leaderboard || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [period]);

  return (
    <div className="space-y-6" id="leaderboard-view">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-200" />
            <span className="text-xs uppercase tracking-wider font-bold text-amber-100">National Rankings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Top Reseller Champions</h2>
          <p className="text-xs sm:text-sm text-amber-100/90">
            Top performers receive weekly cash bonuses and priority factory access!
          </p>
        </div>

        {/* Period Switcher */}
        <div className="p-1 bg-black/20 backdrop-blur-md rounded-2xl flex gap-1 self-start md:self-auto border border-white/20">
          {(['allTime', 'monthly', 'weekly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
                period === p
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {p === 'allTime' ? 'All Time' : p === 'monthly' ? 'This Month' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* #2 Silver */}
          <div className="order-2 md:order-1 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3 relative overflow-hidden">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1">
              <Medal className="w-3.5 h-3.5 text-slate-400" /> #2 Silver
            </span>
            <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-xl font-bold text-slate-700">
              🥈
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">{leaderboard[1].storeName}</h3>
              <p className="text-xs text-slate-500">{leaderboard[1].userName}</p>
            </div>
            <div className="w-full pt-2 border-t border-slate-100 flex justify-around text-xs">
              <div>
                <p className="text-slate-400 text-[11px]">Delivered</p>
                <p className="font-bold text-slate-900">{leaderboard[1].deliveredOrders} orders</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px]">Profit</p>
                <p className="font-bold text-emerald-700">৳{(leaderboard[1]?.totalProfit ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* #1 Gold */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white p-6 rounded-3xl border-2 border-amber-400 shadow-md flex flex-col items-center text-center space-y-3 relative transform md:-translate-y-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-xs flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> #1 Champion
            </span>
            <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-2xl font-black text-amber-700 shadow-inner">
              👑
            </div>
            <div>
              <div className="flex items-center gap-1 justify-center">
                <h3 className="font-black text-base text-slate-900">{leaderboard[0]?.storeName}</h3>
                {leaderboard[0]?.isFounder && (
                  <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                    FOUNDER
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{leaderboard[0]?.userName}</p>
            </div>
            <div className="w-full pt-2 border-t border-amber-200 flex justify-around text-xs">
              <div>
                <p className="text-slate-500 text-[11px]">Delivered</p>
                <p className="font-black text-slate-900">{leaderboard[0]?.deliveredOrders ?? 0} orders</p>
              </div>
              <div>
                <p className="text-slate-500 text-[11px]">Profit</p>
                <p className="font-black text-emerald-700 text-sm">৳{(leaderboard[0]?.totalProfit ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* #3 Bronze */}
          <div className="order-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3 relative overflow-hidden">
            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-800 text-xs font-bold border border-orange-200 flex items-center gap-1">
              <Medal className="w-3.5 h-3.5 text-amber-600" /> #3 Bronze
            </span>
            <div className="w-16 h-16 rounded-full bg-orange-50 border-2 border-amber-300 flex items-center justify-center text-xl font-bold text-amber-800">
              🥉
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">{leaderboard[2]?.storeName}</h3>
              <p className="text-xs text-slate-500">{leaderboard[2]?.userName}</p>
            </div>
            <div className="w-full pt-2 border-t border-slate-100 flex justify-around text-xs">
              <div>
                <p className="text-slate-400 text-[11px]">Delivered</p>
                <p className="font-bold text-slate-900">{leaderboard[2]?.deliveredOrders ?? 0} orders</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px]">Profit</p>
                <p className="font-bold text-emerald-700">৳{(leaderboard[2]?.totalProfit ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Reseller Store</th>
                <th className="p-4">Level Tier</th>
                <th className="p-4">Delivered Orders</th>
                <th className="p-4">Total Revenue</th>
                <th className="p-4">Total Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboard.map((item) => (
                <tr key={item.resellerId} className="hover:bg-slate-50/60 transition">
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                        item.rank === 1
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : item.rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : item.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {item.rank}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{item.storeName}</span>
                          {item.isFounder && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-900 font-bold rounded">
                              FOUNDER
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{item.userName}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                      Level {item.level}
                    </span>
                  </td>

                  <td className="p-4 font-bold text-slate-900">
                    {item.deliveredOrders} orders
                  </td>

                  <td className="p-4 text-slate-700">
                    ৳{(item.totalRevenue ?? 0).toLocaleString()}
                  </td>

                  <td className="p-4 font-bold text-emerald-700 text-sm">
                    ৳{(item.totalProfit ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
