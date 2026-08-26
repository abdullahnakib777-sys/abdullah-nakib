import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ResellerProfile } from '../types';
import { api, setApiAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  reseller: ResellerProfile | null;
  isLoading: boolean;
  demoAccounts: { user: User; reseller?: ResellerProfile }[];
  loginWithCredentials: (emailOrPhone: string, password?: string) => Promise<void>;
  resetPin: (phoneOrEmail: string, newPin: string) => Promise<void>;
  loginAdmin: (adminId: string, password?: string) => Promise<void>;
  loginWithUserId: (userId: string) => Promise<void>;
  registerCustomer: (name: string, phone: string, email?: string, password?: string) => Promise<void>;
  registerReseller: (data: {
    name: string;
    email?: string;
    phone: string;
    password?: string;
    storeName: string;
    facebookPage?: string;
    whatsappNumber: string;
    division: string;
    district: string;
    upazila?: string;
    address: string;
    salesIntent: string;
    referredBy?: string;
  }) => Promise<void>;
  submitResellerFee: (data: {
    method: 'BKASH' | 'NAGAD' | 'ROCKET';
    senderPhone: string;
    trxId: string;
    amount?: number;
  }) => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [reseller, setReseller] = useState<ResellerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demoAccounts, setDemoAccounts] = useState<{ user: User; reseller?: ResellerProfile }[]>([]);

  const loadDemoAccounts = async () => {
    try {
      const res = await api.getDemoAccounts();
      setDemoAccounts(res.accounts || []);
      return res.accounts;
    } catch (err) {
      console.error('Failed to fetch demo accounts:', err);
      return [];
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await loadDemoAccounts();
      const savedUserId = localStorage.getItem('shadhin_user_id');

      if (savedUserId) {
        try {
          const res = await api.login({ userId: savedUserId });
          setUser(res.user);
          setReseller(res.reseller || null);
          setApiAuthToken(res.token);
          localStorage.setItem('shadhin_user_id', res.user.id);
        } catch {
          localStorage.removeItem('shadhin_user_id');
          setUser(null);
          setReseller(null);
        }
      } else {
        // Guest mode by default: Normal E-Commerce visitor
        setUser(null);
        setReseller(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const loginWithCredentials = async (emailOrPhone: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ emailOrPhone, password });
      setUser(res.user);
      setReseller(res.reseller || null);
      setApiAuthToken(res.token);
      localStorage.setItem('shadhin_user_id', res.user.id);
      await loadDemoAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  const resetPin = async (phoneOrEmail: string, newPin: string) => {
    setIsLoading(true);
    try {
      const res = await api.resetPin({ phoneOrEmail, newPin });
      setUser(res.user);
      setReseller(res.reseller || null);
      setApiAuthToken(res.token);
      localStorage.setItem('shadhin_user_id', res.user.id);
      await loadDemoAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = async (adminId: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.loginAdmin({ adminId, password });
      setUser(res.user);
      setReseller(res.reseller || null);
      setApiAuthToken(res.token);
      localStorage.setItem('shadhin_user_id', res.user.id);
      await loadDemoAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithUserId = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ userId });
      setUser(res.user);
      setReseller(res.reseller || null);
      setApiAuthToken(res.token);
      localStorage.setItem('shadhin_user_id', res.user.id);
      await loadDemoAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  const registerCustomer = async (name: string, phone: string, email?: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.registerCustomer({ name, phone, email, password });
      setUser(res.user);
      setReseller(null);
      setApiAuthToken(res.token);
      localStorage.setItem('shadhin_user_id', res.user.id);
      await loadDemoAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  const registerReseller = async (data: {
    name: string;
    email?: string;
    phone: string;
    password?: string;
    storeName: string;
    facebookPage?: string;
    whatsappNumber: string;
    division: string;
    district: string;
    upazila?: string;
    address: string;
    salesIntent: string;
    referredBy?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.registerReseller(data);
      setUser(res.user);
      setReseller(res.reseller);
      setApiAuthToken(res.token);
      localStorage.setItem('shadhin_user_id', res.user.id);
      await loadDemoAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  const submitResellerFee = async (data: {
    method: 'BKASH' | 'NAGAD' | 'ROCKET';
    senderPhone: string;
    trxId: string;
    amount?: number;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.submitResellerFee(data);
      setReseller(res.reseller);
      await refreshProfile();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      const res = await api.login({ userId: user.id });
      setUser(res.user);
      setReseller(res.reseller || null);
    }
  };

  const logout = () => {
    setUser(null);
    setReseller(null);
    localStorage.removeItem('shadhin_user_id');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        reseller,
        isLoading,
        demoAccounts,
        loginWithCredentials,
        resetPin,
        loginAdmin,
        loginWithUserId,
        registerCustomer,
        registerReseller,
        submitResellerFee,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
