import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  isBn: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  bn: {
    // Navigation & General
    storefront: 'মার্কেটপ্লেস',
    reseller_hub: 'রিসেলার হাব',
    products: 'প্রোডাক্ট ক্যাটালগ',
    orders: 'আমার অর্ডারস',
    wallet: 'প্রফিট ওয়ালেট',
    academy: 'রিসেলার একাডেমি',
    admin_portal: 'অ্যাডমিন পোর্টাল',
    notifications: 'নোটিফিকেশন ও অফার',
    hot_campaigns: 'হট ক্যাম্পেইন পোস্টার',
    unread: 'নতুন',
    mark_all_read: 'সব পড়া হয়েছে মার্ক করুন',
    no_notifications: 'কোন নতুন নোটিফিকেশন নেই',
    urgent: 'জরুরি নোটিশ',
    high_priority: 'গুরুত্বপূর্ণ',
    normal: 'সাধারণ',
    view_details: 'বিস্তারিত দেখুন',
    download_poster: 'পোস্টার ডাউনলোড',
    copy_caption: 'ক্যাপশন কপি করুন',
    share_social: 'সোশ্যাল মিডিয়ায় শেয়ার',
    send_notification: 'নতুন নোটিফিকেশন পাঠান',
    target_audience: 'প্রাপক নির্বাচন',
    all_resellers: 'সকল ভেরিফায়েড রিসেলার (সবার কাছে যাবে)',
    specific_resellers: 'নির্দিষ্ট রিসেলার সিলেক্ট করুন',
    single_reseller: 'একক রিসেলারকে পাঠান',
    poster_image_url: 'মার্কেটিং পোস্টার ইমেজ URL',
    notification_title: 'নোটিশ শিরোনাম',
    notification_message: 'নোটিশ বার্তা / অফার বিস্তারিত',
    priority: 'গুরুত্ব লেভেল',
    popup_alert: 'লগইন করার সাথে সাথে পপআপ দেখান',
    broadcast_btn: '🚀 পোস্টার নোটিফিকেশন সম্প্রচার করুন',
    success_sent: 'নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!',
    delete_confirm: 'আপনি কি নিশ্চিত এই নোটিফিকেশনটি মুছে ফেলতে চান?',
    switch_lang: 'English',
  },
  en: {
    // Navigation & General
    storefront: 'Storefront',
    reseller_hub: 'Reseller Hub',
    products: 'Product Catalog',
    orders: 'My Orders',
    wallet: 'Profit Wallet',
    academy: 'Reseller Academy',
    admin_portal: 'Admin Portal',
    notifications: 'Notifications & Offers',
    hot_campaigns: 'Campaign Posters',
    unread: 'New',
    mark_all_read: 'Mark all as read',
    no_notifications: 'No new notifications right now',
    urgent: 'Urgent Campaign',
    high_priority: 'High Priority',
    normal: 'Notice',
    view_details: 'View Details',
    download_poster: 'Download Poster',
    copy_caption: 'Copy Promo Caption',
    share_social: 'Share to Socials',
    send_notification: 'Send Notification / Poster',
    target_audience: 'Target Audience',
    all_resellers: 'All Resellers (Broadcast to Everyone)',
    specific_resellers: 'Select Specific Resellers',
    single_reseller: 'Send to Single Reseller',
    poster_image_url: 'Marketing Poster Image URL',
    notification_title: 'Notification Title',
    notification_message: 'Notification Message / Details',
    priority: 'Priority Level',
    popup_alert: 'Auto-Popup to Reseller on Login',
    broadcast_btn: '🚀 Broadcast Poster Notification',
    success_sent: 'Notification sent successfully!',
    delete_confirm: 'Are you sure you want to delete this notification?',
    switch_lang: 'বাংলা',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'mehermart_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'bn') {
        return saved;
      }
    } catch (e) {
      console.warn('Could not read language from localStorage', e);
    }
    return 'bn'; // Default to Bangla as requested for BD commerce
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch (e) {
      console.warn('Could not save language to localStorage', e);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const t = (key: string, fallback?: string): string => {
    const dict = DICTIONARY[language] || DICTIONARY.en;
    if (dict[key]) return dict[key];
    return fallback || key;
  };

  const isBn = language === 'bn';

  return (
    <LanguageContext.Provider
      value={{
        language,
        isBn,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
