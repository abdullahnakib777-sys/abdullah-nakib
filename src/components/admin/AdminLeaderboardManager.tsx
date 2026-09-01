import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, LeaderboardOverride, LeaderboardConfig, ResellerProfile } from '../../types';
import { api } from '../../services/api';
import { triggerLevelUpCelebration } from '../common/ConfettiTrigger';
import {
  Trophy,
  Star,
  Pin,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Zap,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Shield,
  Sliders,
  Settings,
  Save,
  Crown,
  Medal,
  Award,
  Users,
  Search,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

export const AdminLeaderboardManager: React.FC = () => {
  const [period, setPeriod] = useState<'allTime' | 'monthly' | 'weekly'>('allTime');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [allResellers, setAllResellers] = useState<ResellerProfile[]>([]);
  const [config, setConfig] = useState<LeaderboardConfig>({
    manualOverrides: {},
    customEntries: [],
    sortBy: 'custom',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'overrides' | 'custom' | 'settings'>('leaderboard');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Edit Override Modal
  const [editingResellerId, setEditingResellerId] = useState<string | null>(null);
  const [overrideForm, setOverrideForm] = useState<Partial<LeaderboardOverride>>({});
  const [isSavingOverride, setIsSavingOverride] = useState(false);

  // Add Custom Showcase Entry Modal
  const [isAddCustomModalOpen, setIsAddCustomModalOpen] = useState(false);
  const [customEntryForm, setCustomEntryForm] = useState<Partial<LeaderboardEntry>>({
    storeName: '',
    ownerName: '',
    totalProfit: 15000,
    deliveredOrders: 45,
    xp: 500,
    level: 3,
    levelTitle: 'Ultra Better 🔥',
    isPinned: false,
    pinnedRank: 1,
    badges: ['⭐ Top Earner', '⚡ Verified'],
  });
  const [isSavingCustom, setIsSavingCustom] = useState(false);

  // Global Config form
  const [globalSortBy, setGlobalSortBy] = useState<'custom' | 'xp' | 'orders'>('custom');
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminLeaderboard(period);
      setLeaderboard(res.leaderboard || []);
      setAllResellers(res.allResellers || []);
      if (res.config) {
        setConfig(res.config);
        setGlobalSortBy(res.config.sortBy || 'custom');
      }
    } catch (err: any) {
      console.error('Failed to load admin leaderboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);

  const showSuccess = (msg: string) => {
    setSuccessBanner(msg);
    triggerLevelUpCelebration();
    setTimeout(() => {
      setSuccessBanner(null);
    }, 5000);
  };

  const handleOpenEditOverride = (resellerId: string) => {
    const existing = config.manualOverrides?.[resellerId] || {};
    const currentEntry = leaderboard.find((e) => e.resellerId === resellerId);
    const rProfile = allResellers.find((r) => r.id === resellerId);

    setEditingResellerId(resellerId);
    setOverrideForm({
      resellerId,
      isPinned: existing.isPinned || false,
      pinnedRank: existing.pinnedRank || currentEntry?.rank || 1,
      isHidden: existing.isHidden || false,
      customStoreName: existing.customStoreName || currentEntry?.storeName || rProfile?.storeName || '',
      customOwnerName: existing.customOwnerName || currentEntry?.ownerName || rProfile?.ownerName || '',
      customXp: existing.customXp !== undefined ? existing.customXp : (currentEntry?.xp || rProfile?.xp || 100),
      customLevel: existing.customLevel !== undefined ? existing.customLevel : (currentEntry?.level || rProfile?.level || 1),
      customDeliveredOrders: existing.customDeliveredOrders !== undefined ? existing.customDeliveredOrders : (currentEntry?.deliveredOrders || rProfile?.deliveredOrdersCount || 0),
      customTotalProfit: existing.customTotalProfit !== undefined ? existing.customTotalProfit : (currentEntry?.totalProfit || rProfile?.totalProfitEarned || 0),
      customTotalSales: existing.customTotalSales !== undefined ? existing.customTotalSales : (currentEntry?.totalRevenue || (rProfile as any)?.totalSalesBdt || 0),
      customBadges: existing.customBadges || currentEntry?.badges || ['⭐ Verified'],
      isAnonymous: existing.isAnonymous || false,
    });
  };

  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResellerId) return;

    setIsSavingOverride(true);
    try {
      const res = await api.adminOverrideLeaderboard({
        resellerId: editingResellerId,
        overrides: {
          ...overrideForm,
          pinnedRank: overrideForm.isPinned ? Number(overrideForm.pinnedRank) : undefined,
          customXp: overrideForm.customXp !== undefined ? Number(overrideForm.customXp) : undefined,
          customLevel: overrideForm.customLevel !== undefined ? Number(overrideForm.customLevel) : undefined,
          customDeliveredOrders: overrideForm.customDeliveredOrders !== undefined ? Number(overrideForm.customDeliveredOrders) : undefined,
          customTotalProfit: overrideForm.customTotalProfit !== undefined ? Number(overrideForm.customTotalProfit) : undefined,
          customTotalSales: overrideForm.customTotalSales !== undefined ? Number(overrideForm.customTotalSales) : undefined,
        },
      });

      showSuccess(res.message || 'Leaderboard override saved successfully!');
      setEditingResellerId(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save leaderboard override');
    } finally {
      setIsSavingOverride(false);
    }
  };

  const handleDeleteOverride = async (resellerId: string) => {
    if (!window.confirm('Reset this reseller to automated calculation based on actual orders and XP?')) return;
    try {
      const res = await api.adminDeleteLeaderboardOverride(resellerId);
      showSuccess(res.message || 'Override removed successfully!');
      if (editingResellerId === resellerId) setEditingResellerId(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete override');
    }
  };

  const handleSaveCustomEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEntryForm.storeName) return;

    setIsSavingCustom(true);
    try {
      const res = await api.adminAddCustomLeaderboardEntry({
        ...customEntryForm,
        rank: customEntryForm.pinnedRank || 1,
        salesCount: Number(customEntryForm.deliveredOrders) || 0,
        deliveredOrders: Number(customEntryForm.deliveredOrders) || 0,
        deliveredOrdersCount: Number(customEntryForm.deliveredOrders) || 0,
        successfulDeliveries: Number(customEntryForm.deliveredOrders) || 0,
        profitAmount: Number(customEntryForm.totalProfit) || 0,
        totalProfit: Number(customEntryForm.totalProfit) || 0,
        totalRevenue: (Number(customEntryForm.totalProfit) || 0) * 3,
        totalSalesBdt: (Number(customEntryForm.totalProfit) || 0) * 3,
        xp: Number(customEntryForm.xp) || 500,
        level: Number(customEntryForm.level) || 3,
        levelTitle: customEntryForm.levelTitle || 'Ultra Better 🔥',
        isPinned: Boolean(customEntryForm.isPinned),
        pinnedRank: customEntryForm.isPinned ? Number(customEntryForm.pinnedRank) : undefined,
        badges: customEntryForm.badges || ['👑 Legend', '⭐ Verified'],
      });

      showSuccess(res.message || 'Custom showcase entry saved!');
      setIsAddCustomModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add custom entry');
    } finally {
      setIsSavingCustom(false);
    }
  };

  const handleDeleteCustomEntry = async (id: string) => {
    if (!window.confirm('Delete this custom showcase entry?')) return;
    try {
      const res = await api.adminDeleteCustomLeaderboardEntry(id);
      showSuccess(res.message || 'Custom entry deleted.');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete custom entry');
    }
  };

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      const res = await api.adminSaveLeaderboardConfig({
        sortBy: globalSortBy,
      });
      showSuccess(res.message || 'Leaderboard settings updated!');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save configuration');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const filteredLeaderboard = leaderboard.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.storeName.toLowerCase().includes(q) ||
      item.ownerName?.toLowerCase().includes(q) ||
      item.userName?.toLowerCase().includes(q) ||
      item.resellerId?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-black tracking-wide">
              <Crown className="w-3.5 h-3.5" />
              <span>SUPER ADMIN LEADERBOARD & XP MASTER CONTROL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Leaderboard & Rank Controller
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Take full manual control over public reseller rankings. Pin top performers, override ranks, customize display profits, XP scores, and award levels directly from this panel.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsAddCustomModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-500/20 text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Showcase Entry</span>
            </button>
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-white transition flex items-center justify-center cursor-pointer"
              title="Refresh Leaderboard"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Period Selector & Quick Metrics */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center bg-black/40 p-1.5 rounded-2xl border border-white/10">
            {(['allTime', 'monthly', 'weekly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  period === p
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {p === 'allTime' ? '🏆 All-Time Rankings' : p === 'monthly' ? '📅 Monthly Leaderboard' : '⚡ Weekly Sprints'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
            <span>Total Listed: <strong className="text-white font-mono">{leaderboard.length}</strong></span>
            <span>•</span>
            <span>Manual Overrides: <strong className="text-amber-400 font-mono">{Object.keys(config.manualOverrides || {}).length}</strong></span>
            <span>•</span>
            <span>Custom Showcases: <strong className="text-indigo-300 font-mono">{(config.customEntries || []).length}</strong></span>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="font-black text-sm text-emerald-900">{successBanner}</p>
              <p className="text-xs text-emerald-700">Public leaderboard and reseller profile state updated immediately.</p>
            </div>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="p-1 text-emerald-700 hover:text-emerald-950"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Live Rankings View ({leaderboard.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('overrides')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'overrides'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>All Resellers ({allResellers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'custom'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Custom Showcase Entries ({(config.customEntries || []).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>Leaderboard Settings</span>
        </button>
      </div>

      {/* TAB 1: Live Leaderboard Table with Controls */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search store name, owner, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium self-end sm:self-auto">
              Showing <strong className="text-slate-900">{filteredLeaderboard.length}</strong> ranked sellers
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5 text-center w-16">Rank</th>
                  <th className="px-4 py-3.5">Store & Reseller</th>
                  <th className="px-4 py-3.5 text-center">Level & XP</th>
                  <th className="px-4 py-3.5 text-center">Delivered Orders</th>
                  <th className="px-4 py-3.5 text-right">Total Profit</th>
                  <th className="px-4 py-3.5 text-center">Badges & Tags</th>
                  <th className="px-4 py-3.5 text-center">Status / Override</th>
                  <th className="px-4 py-3.5 text-right w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredLeaderboard.map((entry) => {
                  const isTop3 = entry.rank <= 3;
                  const rankBg =
                    entry.rank === 1
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : entry.rank === 2
                      ? 'bg-slate-300 text-slate-900 font-black shadow-xs'
                      : entry.rank === 3
                      ? 'bg-amber-700 text-white font-black shadow-xs'
                      : 'bg-slate-100 text-slate-700 font-bold';

                  const override = config.manualOverrides?.[entry.resellerId];

                  return (
                    <tr
                      key={entry.resellerId}
                      className={`hover:bg-indigo-50/40 transition ${
                        entry.isPinned ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Rank Position */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex items-center justify-center">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-sm ${rankBg}`}>
                            {entry.rank === 1 ? '🥇 1' : entry.rank === 2 ? '🥈 2' : entry.rank === 3 ? '🥉 3' : `#${entry.rank}`}
                          </span>
                        </div>
                      </td>

                      {/* Store & Owner Info */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                            {entry.storeName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-black text-slate-900 text-sm">
                                {entry.storeName}
                              </span>
                              {entry.isFounder && (
                                <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-black">
                                  👑 FOUNDER
                                </span>
                              )}
                              {entry.isPinned && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-black flex items-center gap-0.5">
                                  <Pin className="w-2.5 h-2.5" /> PINNED #{entry.pinnedRank || entry.rank}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {entry.ownerName || entry.userName || 'Reseller'} • <span className="font-mono text-slate-400">{entry.resellerId}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Level & XP */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-extrabold text-[11px] border border-amber-200">
                            {entry.levelTitle || `Level ${entry.level}`}
                          </span>
                          <span className="text-[11px] font-mono font-black text-slate-800 mt-0.5">
                            {entry.xp.toLocaleString()} XP
                          </span>
                        </div>
                      </td>

                      {/* Delivered Orders */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                          {entry.deliveredOrders.toLocaleString()} Orders
                        </span>
                      </td>

                      {/* Profit Amount */}
                      <td className="px-4 py-3.5 text-right">
                        <span className="font-mono font-black text-sm text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60 inline-block">
                          ৳{entry.totalProfit.toLocaleString()}
                        </span>
                      </td>

                      {/* Badges */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1 flex-wrap max-w-xs mx-auto">
                          {(entry.badges || []).slice(0, 3).map((b, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status / Override Tag */}
                      <td className="px-4 py-3.5 text-center">
                        {override ? (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black border border-indigo-200 flex items-center justify-center gap-1 w-fit mx-auto">
                            <Zap className="w-3 h-3 text-indigo-600" /> Manual Override
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                            Auto Computed
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditOverride(entry.resellerId)}
                          className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black rounded-xl text-xs transition inline-flex items-center gap-1 cursor-pointer"
                          title="Edit this reseller's position, XP, profit, badges"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        {override && (
                          <button
                            type="button"
                            onClick={() => handleDeleteOverride(entry.resellerId)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition inline-flex items-center cursor-pointer"
                            title="Reset to Auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredLeaderboard.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-500 font-bold">
                      No leaderboard entries found matching "{searchQuery}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: All Resellers Directory for Quick Ranking Control */}
      {activeTab === 'overrides' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-base">All Registered Resellers</h3>
              <p className="text-xs text-slate-500">
                Select any registered reseller to pin them to the top of the leaderboard, change their rank, or override their stats.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
              {allResellers.length} Resellers
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {allResellers.map((r) => {
              const hasOverride = Boolean(config.manualOverrides?.[r.id]);
              const ov = config.manualOverrides?.[r.id];

              return (
                <div
                  key={r.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-black text-base flex items-center justify-center shrink-0">
                      {r.storeName?.charAt(0) || 'R'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-slate-900 text-sm">{r.storeName}</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                          Lvl {r.level || 1} • {r.xp || 100} XP
                        </span>
                        {hasOverride && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" /> OVERRIDE ACTIVE
                          </span>
                        )}
                        {ov?.isPinned && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black flex items-center gap-1">
                            <Pin className="w-2.5 h-2.5" /> PINNED #{ov.pinnedRank || 1}
                          </span>
                        )}
                        {ov?.isHidden && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black flex items-center gap-1">
                            <EyeOff className="w-2.5 h-2.5" /> HIDDEN
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Owner: <strong>{r.ownerName}</strong> • Phone: {r.whatsappNumber} • {r.district}, {r.division} • {r.deliveredOrdersCount || 0} Delivered
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleOpenEditOverride(r.id)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{hasOverride ? 'Edit Override' : 'Configure Leaderboard'}</span>
                    </button>
                    {hasOverride && (
                      <button
                        type="button"
                        onClick={() => handleDeleteOverride(r.id)}
                        className="px-3 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-bold rounded-xl text-xs transition cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Custom Showcase / VIP Entries */}
      {activeTab === 'custom' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Custom Showcase / VIP Leaderboard Entries</h3>
              <p className="text-xs text-slate-500">
                Showcase fictional VIP top sellers, high-volume master partners, or special demo benchmark accounts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddCustomModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New VIP / Showcase Entry</span>
            </button>
          </div>

          {(config.customEntries || []).length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Trophy className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-slate-700 text-sm">No custom showcase entries created yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                You can create custom top performer benchmarks to motivate sellers.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(config.customEntries || []).map((ce) => (
                <div
                  key={ce.resellerId}
                  className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-xs relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-900 font-black text-base flex items-center justify-center">
                        👑
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">{ce.storeName}</h4>
                        <p className="text-xs text-slate-500">
                          {ce.ownerName || 'VIP Seller'} • Level {ce.level} ({ce.levelTitle || 'Ultra Better 🔥'})
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteCustomEntry(ce.resellerId)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                      title="Delete Custom Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">Profit</span>
                      <span className="text-xs font-black text-emerald-600 font-mono">৳{ce.totalProfit?.toLocaleString()}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">Orders</span>
                      <span className="text-xs font-black text-slate-900 font-mono">{ce.deliveredOrders}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">XP Score</span>
                      <span className="text-xs font-black text-amber-600 font-mono">{ce.xp?.toLocaleString()} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Global Leaderboard Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 max-w-2xl space-y-6">
          <div>
            <h3 className="font-black text-slate-900 text-lg">Leaderboard Global Settings</h3>
            <p className="text-xs text-slate-500">
              Configure sorting priorities and default algorithmic behavior.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-800 text-xs mb-1.5">
                Default Public Sorting Algorithm
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'custom', label: '💰 Net Profit', desc: 'Highest Profit First' },
                  { id: 'xp', label: '⚡ XP Score', desc: 'Highest XP First' },
                  { id: 'orders', label: '📦 Delivered Orders', desc: 'Most Deliveries First' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGlobalSortBy(opt.id as any)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      globalSortBy === opt.id
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-black text-slate-900 text-xs block">{opt.label}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={isSavingConfig}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingConfig ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Edit Reseller Leaderboard Override */}
      {editingResellerId && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">Edit Leaderboard Override</h3>
                  <p className="text-xs text-slate-300">
                    Target Reseller: <span className="font-mono text-amber-300">{overrideForm.customStoreName || editingResellerId}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingResellerId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOverride} className="p-6 space-y-4 text-xs">
              {/* Pin & Visibility Controls */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 font-black text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(overrideForm.isPinned)}
                      onChange={(e) => setOverrideForm({ ...overrideForm, isPinned: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span>📌 Pin to Exact Rank Position</span>
                  </label>
                  {overrideForm.isPinned && (
                    <div className="mt-2">
                      <span className="text-[11px] text-slate-500 font-bold block mb-1">Pinned Rank (1 = Top Spot):</span>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={overrideForm.pinnedRank || 1}
                        onChange={(e) => setOverrideForm({ ...overrideForm, pinnedRank: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold font-mono"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 font-black text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(overrideForm.isHidden)}
                      onChange={(e) => setOverrideForm({ ...overrideForm, isHidden: e.target.checked })}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span>👁️ Hide from Leaderboard</span>
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1">
                    If checked, this reseller will not appear publicly on rankings.
                  </p>
                </div>
              </div>

              {/* Display Store Name & Owner Name Override */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Store Name Override</label>
                  <input
                    type="text"
                    value={overrideForm.customStoreName || ''}
                    onChange={(e) => setOverrideForm({ ...overrideForm, customStoreName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Owner Name Override</label>
                  <input
                    type="text"
                    value={overrideForm.customOwnerName || ''}
                    onChange={(e) => setOverrideForm({ ...overrideForm, customOwnerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white"
                  />
                </div>
              </div>

              {/* Stats Override: XP, Level, Delivered Orders, Net Profit */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">XP Score</label>
                  <input
                    type="number"
                    min={0}
                    value={overrideForm.customXp ?? 100}
                    onChange={(e) => setOverrideForm({ ...overrideForm, customXp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Level (1 - 7)</label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={overrideForm.customLevel ?? 1}
                    onChange={(e) => setOverrideForm({ ...overrideForm, customLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Delivered Orders</label>
                  <input
                    type="number"
                    min={0}
                    value={overrideForm.customDeliveredOrders ?? 0}
                    onChange={(e) => setOverrideForm({ ...overrideForm, customDeliveredOrders: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Net Profit (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={overrideForm.customTotalProfit ?? 0}
                    onChange={(e) => setOverrideForm({ ...overrideForm, customTotalProfit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono text-emerald-700"
                  />
                </div>
              </div>

              {/* Custom Badges (Comma Separated) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Custom Badges & Titles (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="👑 Legend, ⭐ Top Earner, ⚡ Elite"
                  value={Array.isArray(overrideForm.customBadges) ? overrideForm.customBadges.join(', ') : ''}
                  onChange={(e) =>
                    setOverrideForm({
                      ...overrideForm,
                      customBadges: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDeleteOverride(editingResellerId)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-bold transition cursor-pointer"
                >
                  Reset to Auto
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingResellerId(null)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingOverride}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingOverride ? 'Saving Override...' : 'Save Override'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Custom Showcase Entry */}
      {isAddCustomModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/30 text-slate-950 flex items-center justify-center font-black">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black">Create Custom Showcase Entry</h3>
                  <p className="text-xs text-slate-900/80">Add a custom VIP top seller benchmark</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddCustomModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-950 hover:bg-black/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomEntry} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Store / Shop Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka Glamour BD"
                    value={customEntryForm.storeName || ''}
                    onChange={(e) => setCustomEntryForm({ ...customEntryForm, storeName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Tanvir Ahmed"
                    value={customEntryForm.ownerName || ''}
                    onChange={(e) => setCustomEntryForm({ ...customEntryForm, ownerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Net Profit (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={customEntryForm.totalProfit || 15000}
                    onChange={(e) => setCustomEntryForm({ ...customEntryForm, totalProfit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Delivered Orders</label>
                  <input
                    type="number"
                    min={0}
                    value={customEntryForm.deliveredOrders || 45}
                    onChange={(e) => setCustomEntryForm({ ...customEntryForm, deliveredOrders: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">XP Score</label>
                  <input
                    type="number"
                    min={0}
                    value={customEntryForm.xp || 500}
                    onChange={(e) => setCustomEntryForm({ ...customEntryForm, xp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Level (1 - 7)</label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={customEntryForm.level || 3}
                    onChange={(e) => setCustomEntryForm({ ...customEntryForm, level: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Level Title</label>
                  <input
                    type="text"
                    value={customEntryForm.levelTitle || 'Ultra Better 🔥'}
                    onChange={(e) => setCustomEntryForm({ ...customEntryForm, levelTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <input
                  type="checkbox"
                  id="pinCustom"
                  checked={Boolean(customEntryForm.isPinned)}
                  onChange={(e) => setCustomEntryForm({ ...customEntryForm, isPinned: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <label htmlFor="pinCustom" className="font-bold text-slate-900 cursor-pointer">
                  Pin to Rank Position:
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={customEntryForm.pinnedRank || 1}
                  onChange={(e) => setCustomEntryForm({ ...customEntryForm, pinnedRank: Number(e.target.value) })}
                  className="w-20 px-2.5 py-1 bg-white border border-amber-300 rounded-xl font-bold font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCustomModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCustom}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSavingCustom ? 'Adding...' : 'Add to Leaderboard'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
