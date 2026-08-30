import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Trophy, Medal, Award, Flame, Crown, CheckCircle2, TrendingUp, Sparkles, RefreshCw, Search, ShieldCheck, Zap } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { reseller, user } = useAuth();
  const { isBn, t } = useLanguage();
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'allTime'>('allTime');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeaderboard = (p = period) => {
    setIsLoading(true);
    api
      .getLeaderboard(p)
      .then((res) => {
        setLeaderboard(res.leaderboard || []);
      })
      .catch((err) => {
        console.error('Failed to load leaderboard:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period]);

  const filteredLeaderboard = leaderboard.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.storeName && item.storeName.toLowerCase().includes(q)) ||
      (item.userName && item.userName.toLowerCase().includes(q)) ||
      (item.ownerName && item.ownerName.toLowerCase().includes(q)) ||
      (item.displayName && item.displayName.toLowerCase().includes(q))
    );
  });

  // Find logged-in reseller rank
  const myRankEntry = reseller ? leaderboard.find((item) => item.resellerId === reseller.id) : null;

  return (
    <div className="space-y-6" id="leaderboard-view">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-200" />
            <span className="text-xs uppercase tracking-wider font-bold text-amber-100">
              {isBn ? 'লাইভ সিঙ্কড জাতীয় লিডারবোর্ড' : 'Live Synced National Rankings'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-400/30 border border-emerald-300/40 text-[10px] font-bold text-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" /> {isBn ? 'লাইভ' : 'Live'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            {isBn ? 'শীর্ষ রিসেলার চ্যাম্পিয়নদের তালিকা' : 'Top Reseller Champions'}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl">
            {isBn
              ? 'ভেরিফাইড অর্ডার, ডেলিভারিকৃত পার্সেল ও অর্জিত মোট নিট মুনাফার উপর ভিত্তি করে সরাসরি র‍্যাঙ্কিং নির্ধারিত হয়।'
              : 'Live rankings calculated from verified orders, delivered parcels, and settled net reseller profits. Top performers receive weekly cash rewards!'}
          </p>
        </div>

        {/* Period Switcher & Refresh Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="p-1 bg-black/20 backdrop-blur-md rounded-2xl flex gap-1 border border-white/20">
            {(['allTime', 'monthly', 'weekly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition capitalize cursor-pointer ${
                  period === p
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {p === 'allTime' ? (isBn ? 'সর্বমোট' : 'All Time') : p === 'monthly' ? (isBn ? 'এই মাসে' : 'This Month') : (isBn ? 'এই সপ্তাহে' : 'This Week')}
              </button>
            ))}
          </div>
          <button
            onClick={() => fetchLeaderboard(period)}
            disabled={isLoading}
            className="p-2.5 rounded-2xl bg-black/20 hover:bg-black/30 text-white border border-white/20 transition cursor-pointer disabled:opacity-50"
            title={isBn ? 'রিফ্রেশ করুন' : 'Refresh Leaderboard'}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Logged-in Reseller Standings Card (if authenticated) */}
      {reseller && myRankEntry && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-cyan-900/60 border border-purple-400/40 shadow-lg text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
              #{myRankEntry.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-cyan-300">
                  {isBn ? 'আপনার বর্তমান র‍্যাঙ্ক' : 'Your Current Standings'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-400/30 text-purple-200 font-bold border border-purple-300/30">
                  {isBn ? 'লেভেল' : 'Level'} {myRankEntry.level} • {myRankEntry.levelTitle}
                </span>
              </div>
              <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>{myRankEntry.storeName}</span>
                <span className="text-xs text-slate-300 font-normal">({myRankEntry.userName})</span>
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0 w-full sm:w-auto justify-around sm:justify-end text-xs">
            <div>
              <p className="text-slate-300 text-[11px]">{isBn ? 'ডেলিভারিকৃত' : 'Delivered'}</p>
              <p className="font-bold text-white text-sm">{(myRankEntry.deliveredOrders ?? 0).toLocaleString()} {isBn ? 'অর্ডার' : 'orders'}</p>
            </div>
            <div>
              <p className="text-slate-300 text-[11px]">{isBn ? 'নিট প্রফিট' : 'Net Profit'}</p>
              <p className="font-bold text-emerald-300 text-sm">৳{(myRankEntry.totalProfit ?? 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-300 text-[11px]">{isBn ? 'মোট এক্সপি' : 'Total XP'}</p>
              <p className="font-bold text-amber-300 text-sm">{(myRankEntry.xp ?? 0).toLocaleString()} XP</p>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium Cards */}
      {leaderboard.length >= 3 && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* #2 Silver */}
          <div className="order-2 md:order-1 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3 relative overflow-hidden">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1">
              <Medal className="w-3.5 h-3.5 text-slate-400" /> #2 {isBn ? 'সিলভার' : 'Silver'}
            </span>
            <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-xl font-bold text-slate-700 shadow-inner">
              🥈
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">{leaderboard[1]?.storeName}</h3>
              <p className="text-xs text-slate-500">{leaderboard[1]?.userName || leaderboard[1]?.ownerName}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {isBn ? 'লেভেল' : 'Level'} {leaderboard[1]?.level} ({leaderboard[1]?.levelTitle})
                </span>
              </div>
            </div>
            <div className="w-full pt-2 border-t border-slate-100 flex justify-around text-xs">
              <div>
                <p className="text-slate-400 text-[11px]">{isBn ? 'ডেলিভারি' : 'Delivered'}</p>
                <p className="font-bold text-slate-900">{(leaderboard[1]?.deliveredOrders ?? leaderboard[1]?.deliveredOrdersCount ?? 0).toLocaleString()} {isBn ? 'অর্ডার' : 'orders'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px]">{isBn ? 'প্রফিট' : 'Profit'}</p>
                <p className="font-bold text-emerald-700">৳{(leaderboard[1]?.totalProfit ?? leaderboard[1]?.profitAmount ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* #1 Gold */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white p-6 rounded-3xl border-2 border-amber-400 shadow-md flex flex-col items-center text-center space-y-3 relative transform md:-translate-y-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-xs flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> #1 {isBn ? 'চ্যাম্পিয়ন' : 'Champion'}
            </span>
            <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-2xl font-black text-amber-700 shadow-inner">
              👑
            </div>
            <div>
              <div className="flex items-center gap-1 justify-center">
                <h3 className="font-black text-base text-slate-900">{leaderboard[0]?.storeName}</h3>
                {leaderboard[0]?.isFounder && (
                  <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                    {isBn ? 'প্রতিষ্ঠাতা' : 'FOUNDER'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{leaderboard[0]?.userName || leaderboard[0]?.ownerName}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                  {isBn ? 'লেভেল' : 'Level'} {leaderboard[0]?.level} ({leaderboard[0]?.levelTitle})
                </span>
              </div>
            </div>
            <div className="w-full pt-2 border-t border-amber-200 flex justify-around text-xs">
              <div>
                <p className="text-slate-500 text-[11px]">{isBn ? 'ডেলিভারি' : 'Delivered'}</p>
                <p className="font-black text-slate-900">{(leaderboard[0]?.deliveredOrders ?? leaderboard[0]?.deliveredOrdersCount ?? 0).toLocaleString()} {isBn ? 'অর্ডার' : 'orders'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[11px]">{isBn ? 'প্রফিট' : 'Profit'}</p>
                <p className="font-black text-emerald-700 text-sm">৳{(leaderboard[0]?.totalProfit ?? leaderboard[0]?.profitAmount ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* #3 Bronze */}
          <div className="order-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3 relative overflow-hidden">
            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-800 text-xs font-bold border border-orange-200 flex items-center gap-1">
              <Medal className="w-3.5 h-3.5 text-amber-600" /> #3 {isBn ? 'ব্রোঞ্জ' : 'Bronze'}
            </span>
            <div className="w-16 h-16 rounded-full bg-orange-50 border-2 border-amber-300 flex items-center justify-center text-xl font-bold text-amber-800 shadow-inner">
              🥉
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">{leaderboard[2]?.storeName}</h3>
              <p className="text-xs text-slate-500">{leaderboard[2]?.userName || leaderboard[2]?.ownerName}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold">
                  {isBn ? 'লেভেল' : 'Level'} {leaderboard[2]?.level} ({leaderboard[2]?.levelTitle})
                </span>
              </div>
            </div>
            <div className="w-full pt-2 border-t border-slate-100 flex justify-around text-xs">
              <div>
                <p className="text-slate-400 text-[11px]">{isBn ? 'ডেলিভারি' : 'Delivered'}</p>
                <p className="font-bold text-slate-900">{(leaderboard[2]?.deliveredOrders ?? leaderboard[2]?.deliveredOrdersCount ?? 0).toLocaleString()} {isBn ? 'অর্ডার' : 'orders'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px]">{isBn ? 'প্রফিট' : 'Profit'}</p>
                <p className="font-bold text-emerald-700">৳{(leaderboard[2]?.totalProfit ?? leaderboard[2]?.profitAmount ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? 'রিসেলার শপ বা নাম খুঁজুন...' : 'Search reseller store or name...'}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {isBn
            ? `${leaderboard.length} জন শীর্ষ রিসেলারের মধ্যে ${filteredLeaderboard.length} জন দেখানো হচ্ছে`
            : `Showing ${filteredLeaderboard.length} of ${leaderboard.length} top performing resellers`}
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">{isBn ? 'র‍্যাঙ্ক' : 'Rank'}</th>
                <th className="p-4">{isBn ? 'রিসেলার শপ' : 'Reseller Store'}</th>
                <th className="p-4">{isBn ? 'লেভেল টায়ার' : 'Level Tier'}</th>
                <th className="p-4">{isBn ? 'ডেলিভারিকৃত অর্ডার' : 'Delivered Orders'}</th>
                <th className="p-4">{isBn ? 'মোট বিক্রয়' : 'Total Revenue'}</th>
                <th className="p-4">{isBn ? 'মোট অর্জিত প্রফিট' : 'Total Net Profit'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    {isBn ? `"${searchQuery}" এর সাথে কোনো রিসেলার পাওয়া যায়নি` : `No resellers found matching "${searchQuery}"`}
                  </td>
                </tr>
              ) : (
                filteredLeaderboard.map((item) => (
                  <tr
                    key={item.resellerId}
                    className={`hover:bg-slate-50/60 transition ${
                      reseller && reseller.id === item.resellerId ? 'bg-amber-50/50 font-medium' : ''
                    }`}
                  >
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-xs ${
                          item.rank === 1
                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                            : item.rank === 2
                            ? 'bg-slate-300 text-slate-800'
                            : item.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.rank}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                          {item.avatar ? (
                            <img src={item.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            item.storeName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900">{item.storeName}</span>
                            {item.isFounder && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-900 font-bold rounded">
                                {isBn ? 'প্রতিষ্ঠাতা' : 'FOUNDER'}
                              </span>
                            )}
                            {reseller && reseller.id === item.resellerId && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-purple-100 text-purple-900 font-bold rounded">
                                {isBn ? 'আপনি' : 'YOU'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">{item.userName || item.ownerName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {isBn ? 'লেভেল' : 'Level'} {item.level}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                          {item.levelTitle}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-slate-900">
                      {(item.deliveredOrders ?? item.deliveredOrdersCount ?? item.salesCount ?? 0).toLocaleString()} {isBn ? 'অর্ডার' : 'orders'}
                    </td>

                    <td className="p-4 text-slate-700 font-medium">
                      ৳{(item.totalRevenue ?? item.totalSalesBdt ?? 0).toLocaleString()}
                    </td>

                    <td className="p-4 font-bold text-emerald-700 text-sm">
                      ৳{(item.totalProfit ?? item.profitAmount ?? 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
