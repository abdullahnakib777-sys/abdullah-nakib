import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { UserCheck, RefreshCw, Shield, Store, User, Sparkles, ChevronDown, Check } from 'lucide-react';

export const DemoAccountSwitcher: React.FC = () => {
  const { user, reseller, demoAccounts, loginWithUserId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetData = async () => {
    if (window.confirm('Reset database to clean demo state?')) {
      setIsResetting(true);
      try {
        await api.resetSeedData();
        window.location.reload();
      } catch (err) {
        alert('Failed to reset database');
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="relative inline-block text-left" id="demo-account-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-sm border border-slate-700 transition"
        id="demo-switcher-btn"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="hidden sm:inline text-slate-400">Role:</span>
        <span className="font-bold text-amber-300">
          {user?.isFounder ? '👑 Founder (Admin)' : user?.role === 'ADMIN' ? '🛡️ Admin' : user?.role === 'RESELLER' ? `🔥 ${reseller?.storeName || user.name}` : `🛒 ${user?.name || 'Customer'}`}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Instant Account Switcher
              </p>
              <p className="text-xs text-slate-500">Test all roles & acceptance workflows</p>
            </div>

            <div className="p-1 space-y-1 max-h-72 overflow-y-auto">
              {demoAccounts.map((acc) => {
                const isSelected = user?.id === acc.user.id;
                return (
                  <button
                    key={acc.user.id}
                    onClick={() => {
                      loginWithUserId(acc.user.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-sm overflow-hidden border border-slate-200">
                        {acc.user.avatar ? (
                          <img src={acc.user.avatar} alt="" className="w-full h-full object-cover" />
                        ) : acc.user.role === 'ADMIN' ? (
                          '👑'
                        ) : acc.user.role === 'RESELLER' ? (
                          '💼'
                        ) : (
                          '🛒'
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900">{acc.user.name}</span>
                          {acc.user.isFounder && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 font-bold rounded">
                              FOUNDER
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {acc.reseller ? `Level ${acc.reseller.level} • ${acc.reseller.storeName}` : acc.user.role}
                        </p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <button
                onClick={handleResetData}
                disabled={isResetting}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition font-medium"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                Reset Sample Database
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
