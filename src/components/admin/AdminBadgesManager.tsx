import React, { useState, useEffect } from 'react';
import { Achievement } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Award,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Search,
  Sparkles,
  ShieldCheck,
  PackageCheck,
  Trophy,
  Flame,
  GraduationCap,
  Crown,
  Users,
  Zap,
  Truck,
  MapPin,
  Coins,
  Gem,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';

const ICON_OPTIONS = [
  'ShieldCheck',
  'Sparkles',
  'PackageCheck',
  'Trophy',
  'Flame',
  'GraduationCap',
  'Award',
  'Crown',
  'Users',
  'Zap',
  'Truck',
  'MapPin',
  'Coins',
  'Gem',
];

const CATEGORY_OPTIONS = [
  { value: 'SALES', label: 'Sales & Orders' },
  { value: 'DELIVERY', label: 'Deliveries & Logistics' },
  { value: 'STREAK', label: 'Daily Selling Streaks' },
  { value: 'ACADEMY', label: 'Academy & Learning' },
  { value: 'PROFIT', label: 'Profits & Earnings' },
  { value: 'VERIFICATION', label: 'Account Verification' },
  { value: 'REFERRAL', label: 'Affiliate & Referrals' },
  { value: 'SPECIAL', label: 'Special & Milestones' },
];

const CONDITION_OPTIONS = [
  { value: 'LOGIN_VERIFIED', label: 'Account Verified & Logged In' },
  { value: 'SALES_COUNT', label: 'Total Sales / Orders Count' },
  { value: 'DELIVERIES', label: 'Successful Deliveries' },
  { value: 'STREAK_DAYS', label: 'Consecutive Days Selling Streak' },
  { value: 'ACADEMY_LESSONS', label: 'Academy Video Lessons Completed' },
  { value: 'XP_THRESHOLD', label: 'Total Experience XP Milestone' },
  { value: 'PROFIT_BDT', label: 'Total Net Profit Earned (BDT)' },
  { value: 'DHAKA_DELIVERIES', label: 'Inside Dhaka Express Deliveries' },
  { value: 'OUTSIDE_DELIVERIES', label: 'Outside Dhaka / Nationwide Deliveries' },
  { value: 'REFERRAL_SALES', label: 'Referrals First Delivered Order' },
];

export const AdminBadgesManager: React.FC = () => {
  const toast = useToast();
  const [badges, setBadges] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBadge, setNewBadge] = useState<Partial<Achievement>>({
    title: '',
    titleBn: '',
    description: '',
    icon: 'Award',
    category: 'SALES',
    xpReward: 10,
    badgeReward: '⭐ Star Reseller',
    conditionType: 'SALES_COUNT',
    threshold: 1,
  });

  // Edit Modal
  const [editingBadge, setEditingBadge] = useState<Achievement | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete Modal
  const [badgeToDelete, setBadgeToDelete] = useState<Achievement | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchBadges = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminAchievements();
      setBadges(res.achievements || []);
    } catch (err) {
      console.error('Failed to load badges:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadge.title || !newBadge.xpReward) {
      toast.showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Badge title and XP reward are required.',
      });
      return;
    }

    try {
      const res = await api.createAchievement(newBadge);
      toast.showToast({
        type: 'success',
        title: 'Badge Created',
        message: `Successfully created "${res.achievement.title}" with +${res.achievement.xpReward} XP reward!`,
      });
      setIsCreateModalOpen(false);
      setNewBadge({
        title: '',
        titleBn: '',
        description: '',
        icon: 'Award',
        category: 'SALES',
        xpReward: 10,
        badgeReward: '⭐ Star Reseller',
        conditionType: 'SALES_COUNT',
        threshold: 1,
      });
      fetchBadges();
    } catch (err: any) {
      toast.showToast({
        type: 'error',
        title: 'Creation Failed',
        message: err.message || 'Could not create badge.',
      });
    }
  };

  const handleUpdateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBadge) return;

    try {
      await api.updateAchievement(editingBadge.id, editingBadge);
      toast.showToast({
        type: 'success',
        title: 'Badge Updated',
        message: `Successfully updated badge "${editingBadge.title}"!`,
      });
      setIsEditModalOpen(false);
      setEditingBadge(null);
      fetchBadges();
    } catch (err: any) {
      toast.showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update badge.',
      });
    }
  };

  const handleDeleteBadge = async () => {
    if (!badgeToDelete) return;
    try {
      await api.deleteAchievement(badgeToDelete.id);
      toast.showToast({
        type: 'success',
        title: 'Badge Deleted',
        message: `Deleted "${badgeToDelete.title}" successfully.`,
      });
      setIsDeleteModalOpen(false);
      setBadgeToDelete(null);
      fetchBadges();
    } catch (err: any) {
      toast.showToast({
        type: 'error',
        title: 'Deletion Failed',
        message: err.message || 'Could not delete badge.',
      });
    }
  };

  const handleResetToDefaults = async () => {
    if (
      !window.confirm(
        'Are you sure you want to reset all badges & accolades to the factory default list?'
      )
    ) {
      return;
    }
    try {
      await api.resetAchievements();
      toast.showToast({
        type: 'success',
        title: 'Badges Reset',
        message: 'Badges have been reset to default preset list.',
      });
      fetchBadges();
    } catch (err: any) {
      toast.showToast({
        type: 'error',
        title: 'Reset Failed',
        message: err.message || 'Failed to reset badges.',
      });
    }
  };

  // Filtered Badges
  const filteredBadges = badges.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.titleBn || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.badgeReward || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" id="admin-badges-manager">
      {/* Top Header & Overview Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Badges & Accolades Manager
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure reseller badges, milestone thresholds, and XP rewards (1 XP = ৳1 BDT bonus)
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleResetToDefaults}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Badge</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total Badges</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{badges.length}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Max Badge XP</span>
          <span className="text-2xl font-black text-amber-500 font-mono">
            +{Math.max(0, ...badges.map((b) => b.xpReward || 0))} XP
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">XP Bonus Rate</span>
          <span className="text-2xl font-black text-emerald-500 font-mono">৳1 = 1 XP</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Cashout Unlock Rank</span>
          <span className="text-sm font-black text-purple-600 dark:text-purple-400 mt-1 block">
            Ultra Better (701+ XP)
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search badges by title, description or reward..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300"
        >
          <option value="ALL">All Categories</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center font-bold text-amber-600 dark:text-amber-400 text-sm">
                    {badge.icon || '⭐'}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                      {badge.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {badge.titleBn}
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 font-mono font-black text-xs shrink-0">
                  +{badge.xpReward} XP
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {badge.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap pt-1 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                  {badge.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-bold">
                  {badge.badgeReward}
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-mono">
                  Req: {badge.threshold} ({badge.conditionType})
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setEditingBadge(badge);
                  setIsEditModalOpen(true);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition"
                title="Edit Badge"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setBadgeToDelete(badge);
                  setIsDeleteModalOpen(true);
                }}
                className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 transition"
                title="Delete Badge"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Badge */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            <div className="px-6 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <h3 className="font-black text-sm">Create New Badge / Accolade</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBadge} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Badge Title (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 Sells Titan"
                    value={newBadge.title}
                    onChange={(e) => setNewBadge({ ...newBadge, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bangla Title</label>
                  <input
                    type="text"
                    placeholder="e.g. ৫০০ সেলস টাইটান"
                    value={newBadge.titleBn}
                    onChange={(e) => setNewBadge({ ...newBadge, titleBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">XP Reward (+XP) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newBadge.xpReward}
                    onChange={(e) => setNewBadge({ ...newBadge, xpReward: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-amber-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Badge Reward Name / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. 👑 500 Orders Hero"
                    value={newBadge.badgeReward}
                    onChange={(e) => setNewBadge({ ...newBadge, badgeReward: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newBadge.category}
                    onChange={(e) => setNewBadge({ ...newBadge, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Icon Style</label>
                  <select
                    value={newBadge.icon}
                    onChange={(e) => setNewBadge({ ...newBadge, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  >
                    {ICON_OPTIONS.map((ico) => (
                      <option key={ico} value={ico}>
                        {ico}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Unlock Condition Type</label>
                  <select
                    value={newBadge.conditionType}
                    onChange={(e) => setNewBadge({ ...newBadge, conditionType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  >
                    {CONDITION_OPTIONS.map((cond) => (
                      <option key={cond.value} value={cond.value}>
                        {cond.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Requirement Threshold</label>
                  <input
                    type="number"
                    min={1}
                    value={newBadge.threshold}
                    onChange={(e) => setNewBadge({ ...newBadge, threshold: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newBadge.description}
                  onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                  placeholder="Explain how resellers can unlock this badge..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-xs transition"
                >
                  Save & Publish Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Badge */}
      {isEditModalOpen && editingBadge && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            <div className="px-6 py-5 bg-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-300" />
                <h3 className="font-black text-sm">Edit Badge: {editingBadge.title}</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateBadge} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Badge Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingBadge.title}
                    onChange={(e) => setEditingBadge({ ...editingBadge, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bangla Title</label>
                  <input
                    type="text"
                    value={editingBadge.titleBn || ''}
                    onChange={(e) => setEditingBadge({ ...editingBadge, titleBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">XP Reward (+XP) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingBadge.xpReward}
                    onChange={(e) => setEditingBadge({ ...editingBadge, xpReward: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-amber-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Badge Reward Name</label>
                  <input
                    type="text"
                    value={editingBadge.badgeReward || ''}
                    onChange={(e) => setEditingBadge({ ...editingBadge, badgeReward: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={editingBadge.category}
                    onChange={(e) => setEditingBadge({ ...editingBadge, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Icon Style</label>
                  <select
                    value={editingBadge.icon}
                    onChange={(e) => setEditingBadge({ ...editingBadge, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  >
                    {ICON_OPTIONS.map((ico) => (
                      <option key={ico} value={ico}>
                        {ico}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingBadge.description}
                  onChange={(e) => setEditingBadge({ ...editingBadge, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {isDeleteModalOpen && badgeToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            <div className="px-6 py-5 bg-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-200" />
                <h3 className="font-bold text-sm">Delete Badge</h3>
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Are you sure you want to permanently delete the badge <strong>"{badgeToDelete.title}"</strong>? Resellers will no longer be able to unlock it.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteBadge}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition"
                >
                  Yes, Delete Badge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
