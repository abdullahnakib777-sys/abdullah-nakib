import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  isBn: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  formatPrice: (amount: number) => string;
  getProductName: (product: { name: string; nameBn?: string }) => string;
  getProductDesc: (product: { description: string; descriptionBn?: string }) => string;
  getCategoryName: (cat: { name: string; nameBn?: string }) => string;
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  bn: {
    // Navbar & Header
    public_catalog: 'মার্কেটপ্লেস ক্যাটালগ',
    storefront: 'মার্কেটপ্লেস',
    reseller_hub: 'রিসেলার হাব',
    leaderboard: 'লিডারবোর্ড',
    academy: 'রিসেলার একাডেমি',
    admin_operations: 'অ্যাডমিন পোর্টাল',
    track_order: 'অর্ডার ট্র্যাকিং',
    join_reseller_btn: 'রিসেলার জয়েন করুন (৫০০৳)',
    reseller_login: 'রিসেলার লগইন',
    customer_login: 'কাস্টমার লগইন',
    admin_access: 'অ্যাডমিন লগইন',
    account: 'একাউন্ট',
    login: 'লগইন',
    logout: 'লগআউট',
    cart: 'কার্ট',
    pending_approval: 'পেন্ডিং ভেরিফিকেশন',
    switch_to_en: 'Switch to English',
    switch_to_bn: 'বাংলা ভাষায় পরিবর্তন',
    resell_ai: 'রিসেল এআই',

    // Mobile Dock
    dock_store: 'স্টোর',
    dock_hub: 'রিসেলার হাব',
    dock_admin: 'অ্যাডমিন',
    dock_join: 'জয়েন (৳৫০০)',
    dock_ai: 'এআই',
    dock_track: 'ট্র্যাক',
    dock_cart: 'কার্ট',
    dock_account: 'একাউন্ট',

    // Storefront Hero & Value Props
    hero_badge: '🔥 বাংলাদেশের #১ জিরো ইনভেস্টমেন্ট রিসেলিং ও ড্রপশিপিং প্ল্যাটফর্ম',
    hero_title_1: 'ঘরে বসেই নিজের ব্যবসা শুরু করুন,',
    hero_title_2: 'জিরো ইনভেস্টমেন্টে লাভ করুন মাসে ২০,০০০-৫০,০০০+ ৳',
    hero_subtitle: 'পণ্য স্টক করা বা ডেলিভারির ঝামেলা ছাড়াই আমাদের পাইকারি মূল্যে পণ্য নিয়ে আপনার ফেসবুক পেইজ ও সোশ্যাল মিডিয়ায় বিক্রি করুন। আমরা সরাসরি আপনার কাস্টমারের ঠিকানায় ক্যাশ অন ডেলিভারিতে পৌঁছে দিব এবং লাভ আপনার একাউন্টে পাঠিয়ে দিব।',
    cta_become_reseller: '🚀 ফ্রি রিসেলার একাউন্ট খুলুন',
    cta_browse_products: '📦 পাইকারি প্রোডাক্ট ক্যাটালগ দেখুন',
    cta_view_leaderboard: '🏆 জাতীয় টপ আর্নারস লিডারবোর্ড',
    zero_inv_title: '০৳ ইনভেস্টমেন্ট',
    zero_inv_desc: 'পণ্য স্টক বা অগ্রিম মূলধন ছাড়াই ব্যবসা',
    wholesale_price_title: 'সরাসরি পাইকারি রেট',
    wholesale_price_desc: 'সর্বোচ্চ প্রফিট মার্জিন ও ফ্যাক্টরি রেট',
    nationwide_cod_title: 'সারাদেশে ক্যাশ অন ডেলিভারি',
    nationwide_cod_desc: '৬৪ জেলায় স্টিডফাস্ট ও পাঠাও হোম ডেলিভারি',
    instant_payout_title: '২৪ ঘণ্টায় প্রফিট উইথড্র',
    instant_payout_desc: 'বিকাশ, নগদ ও ব্যাংক একাউন্টে অটো পেমেন্ট',

    // Storefront Search, Categories & Filters
    search_placeholder: 'প্রোডাক্টের নাম, মডেল বা কোড দিয়ে খুঁজুন...',
    all_categories: 'সব ক্যাটাগরি',
    trending_only: '🔥 ট্রেন্ডিং ও বেস্টসেলার',
    sort_by: 'সর্ট করুন',
    sort_trending: 'জনপ্রিয় ও ট্রেন্ডিং',
    sort_newest: 'নতুন কালেকশন',
    sort_price_low: 'দাম: কম থেকে বেশি',
    sort_price_high: 'দাম: বেশি থেকে কম',
    showing_products: 'টি প্রোডাক্ট প্রদর্শিত হচ্ছে',
    no_products_found: 'কোন প্রোডাক্ট পাওয়া যায়নি',
    clear_filters: 'ফিল্টার রিসেট করুন',

    // Product Card & Details
    suggested_price: 'খুচরা বিক্রয় মূল্য:',
    wholesale_price: 'রিসেলার পাইকারি রেট:',
    profit_margin: 'আপনার সম্ভাব্য লাভ:',
    reseller_profit_badge: 'রিসেলার প্রফিট',
    in_stock: 'স্টকে আছে',
    out_of_stock: 'স্টক শেষ',
    sell_now_btn: '📦 এখনই সেল করুন',
    add_to_cart_btn: 'কার্টে যোগ করুন',
    buy_now_btn: 'সরাসরি কিনুন',
    view_details_btn: 'বিস্তারিত দেখুন',
    ai_kit_btn: '✨ এআই মার্কেটিং কিট',
    copy_caption_btn: 'ক্যাপশন কপি',
    download_images_btn: 'ছবি ডাউনলোড',
    product_code: 'প্রোডাক্ট কোড',
    warranty: 'ওয়ারেন্টি',
    delivery_charge_dhaka: 'ঢাকার ভেতরে ডেলিভারি: ৭০৳',
    delivery_charge_outside: 'ঢাকার বাইরে ডেলিভারি: ১৩০৳',

    // Reseller Hub & Dashboard
    reseller_dashboard: 'রিসেলার ড্যাশবোর্ড',
    welcome_back: 'স্বাগতম,',
    reseller_tier: 'রিসেলার লেভেল',
    total_earnings: 'মোট প্রফিট আয়',
    available_balance: 'উত্তোলনযোগ্য ব্যালেন্স',
    delivered_orders: 'সফল ডেলিভারি',
    pending_orders: 'প্রক্রিয়াধীন অর্ডার',
    total_sales_volume: 'মোট বিক্রয় ভলিউম',
    withdraw_btn: '💰 ব্যালেন্স উত্তোলন (bKash/Nagad)',
    create_manual_order: '➕ কাস্টমারের জন্য নতুন অর্ডার দিন',
    my_orders: 'আমার অর্ডার সমূহ',
    referral_program: 'রেফারেল প্রোগ্রাম',
    referral_code: 'আপনার রেফারেল কোড',
    copy_link: 'রেফারেল লিংক কপি',
    referral_bonus_desc: 'আপনার রেফারেল কোড ব্যবহার করে কেউ জয়েন করলে আপনি পাবেন +250 XP ও ৳100 স্পন্সর বোনাস!',
    copied_success: 'ক্লিপবোর্ডে কপি করা হয়েছে!',

    // Leaderboard
    leaderboard_title: 'জাতীয় রিসেলার লিডারবোর্ড',
    leaderboard_subtitle: 'বাংলাদেশের শীর্ষ সফল উদ্যোক্তা ও মাসিক সর্বোচ্চ প্রফিট অর্জনকারী রিসেলারগণ',
    all_time: 'সর্বমোট রেকর্ড',
    this_month: 'চলতি মাস',
    this_week: 'এই সপ্তাহ',
    rank: 'র‍্যাঙ্ক',
    reseller: 'রিসেলার ও শপ',
    orders_delivered: 'ডেলিভার্ড অর্ডার',
    net_profit: 'মোট প্রফিট',
    tier: 'লেভেল / ব্যাজ',
    your_ranking: 'আপনার বর্তমান অবস্থান',

    // Reseller Academy
    academy_title: 'মেহেরমার্ট রিসেলার একাডেমি',
    academy_subtitle: 'ঘরে বসে ফেসবুক ও অনলাইনে সফলভাবে রিসেলিং ব্যবসা করার পূর্ণাঙ্গ এ-টু-জেড ভিডিও ও গাইডলাইন',
    start_course: 'কোর্স শুরু করুন',
    lesson: 'লেসন',
    quizzes: 'কুইজ ও টেস্ট',
    get_certificate: 'সার্টিফিকেট ডাউনলোড',

    // Order Tracking Modal
    track_order_title: 'কুরিয়ার ডেলিভারি ট্র্যাকিং',
    track_order_subtitle: 'আপনার অর্ডার নম্বর অথবা কাস্টমারের মোবাইল নম্বর দিয়ে ডেলিভারি স্ট্যাটাস চেক করুন',
    tracking_input_placeholder: 'অর্ডার আইডি অথবা ফোন নম্বর (যেমন: 017xxxxxxxx)',
    track_now_btn: 'ট্র্যাক করুন',
    status_pending: 'অর্ডার কনফার্মড',
    status_processing: 'প্যাকেজিং চলছে',
    status_shipped: 'কুরিয়ারে হস্তান্তর হয়েছে',
    status_delivered: 'সফলভাবে ডেলিভার্ড',
    status_returned: 'রিটার্ন হয়েছে',
    courier_consignment_id: 'কুরিয়ার ট্র্যাকিং আইডি',
    live_courier_tracking: 'কুরিয়ার লাইভ পোর্টালে দেখুন',

    // Cart & Checkout
    customer_shopping_cart: 'শপিং কার্ট',
    reseller_multi_cart: 'রিসেলার মাল্টি-প্রোডাক্ট অর্ডার কার্ট',
    empty_cart_msg: 'আপনার কার্ট বর্তমানে খালি আছে',
    browse_products_btn: 'প্রোডাক্ট খুঁজুন',
    item_singular: 'টি আইটেম',
    item_plural: 'টি আইটেম',
    subtotal: 'সাবটোটাল',
    delivery_charge: 'ডেলিভারি চার্জ',
    packaging_fee: 'প্যাকেজিং ফি',
    total_amount: 'সর্বমোট প্রদেয়',
    your_net_profit: 'আপনার নিট প্রফিট:',
    recipient_info: 'ডেলিভারি ঠিকানা ও প্রাপকের তথ্য',
    recipient_name: 'কাস্টমারের নাম *',
    recipient_phone: 'কাস্টমারের মোবাইল নম্বর *',
    select_division: 'বিভাগ নির্বাচন করুন *',
    select_district: 'জেলা নির্বাচন করুন *',
    select_upazila: 'থানা / উপজেলা *',
    full_address: 'পূর্ণ ঠিকানা (বাসা/রোড/এলাকা) *',
    customer_selling_price: 'কাস্টমারের কাছে বিক্রি মূল্য (৳) *',
    advance_courier_paid: 'অগ্রিম ডেলিভারি চার্জ নিয়েছেন?',
    place_order_btn: 'অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)',

    // Auth & Modals
    auth_reseller_login: 'রিসেলার একাউন্টে লগইন',
    auth_customer_login: 'কাস্টমার একাউন্ট লগইন',
    auth_reseller_register: 'নতুন রিসেলার রেজিস্ট্রেশন',
    auth_admin_login: 'অ্যাডমিন পোর্টাল লগইন',
    phone_number: 'মোবাইল নম্বর',
    password: 'পাসওয়ার্ড',
    full_name: 'আপনার নাম',
    store_name: 'আপনার অনলাইন দোকানের নাম',
    sponsor_code_optional: 'স্পন্সর রেফারেল কোড (ঐচ্ছিক)',
    submit_login: 'লগইন করুন',
    submit_register: 'রেজিস্ট্রেশন সম্পন্ন করুন',
    already_registered: 'আগে থেকেই একাউন্ট আছে? লগইন করুন',
    new_to_mehermart: 'নতুন রিসেলার? ফ্রি একাউন্ট খুলুন',

    // Footer & Logistics
    nationwide_courier: 'দেশজুড়ে বিশ্বস্ত কুরিয়ার',
    nationwide_courier_sub: 'স্টিডফাস্ট, পাঠাও ও রেডএক্স ক্যাশ অন ডেলিভারি',
    quality_checked: '১০০% কোয়ালিটি চ্যাকড',
    quality_checked_sub: 'ফ্যাক্টরি ভেরিফাইড অরিজিনাল প্রোডাক্ট',
    instant_payouts: 'দ্রুত প্রফিট উইথড্র',
    instant_payouts_sub: 'বিকাশ ও নগদে ঝামেলাহীন পেমেন্ট',
    transparent_margins: 'স্বচ্ছ কমিশন ও লাভ',
    transparent_margins_sub: '৩০৳ ফ্ল্যাট প্যাকেজিং • ০% কমিশন কর্তন',
    footer_desc: 'বাংলাদেশের শীর্ষ পাইকারি ড্রপশিপিং ও রিসেলিং প্ল্যাটফর্ম। কোনো ইনভেস্টমেন্ট ছাড়াই নিজের অনলাইন ব্যবসা শুরু করুন।',
    copyright: '© ২০২৬ মেহেরমার্ট বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।',
    built_for_bangladesh: 'ডিজিটাল কমার্স উদ্যোক্তাদের জন্য বিশ্বস্ত প্ল্যাটফর্ম 🇧🇩',

    // Floating WhatsApp & Contact
    whatsapp_hub_title: 'মেহেরমার্ট লাইভ সাপোর্ট ও শেয়ার',
    whatsapp_hub_subtitle: 'সরাসরি রিসেলার কেয়ার ও হেল্পলাইন',
    share_whatsapp: 'হোয়াটসঅ্যাপে শেয়ার',
    share_facebook: 'ফেসবুকে শেয়ার',
    head_office_address: 'সাভার ডিওএইচএস, সাভার, ঢাকা-১৩৪৪',
    direct_chat: 'সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন',
    privacy_terms: 'প্রাইভেসি পলিসি ও রিসেলার শর্তাবলী',
  },
  en: {
    // Navbar & Header
    public_catalog: 'Public Catalog',
    storefront: 'Storefront',
    reseller_hub: 'Reseller Hub',
    leaderboard: 'Leaderboard',
    academy: 'Academy',
    admin_operations: 'Admin Portal',
    track_order: 'Track Order',
    join_reseller_btn: 'Join Reseller (৳500)',
    reseller_login: 'Reseller Login',
    customer_login: 'Customer Login',
    admin_access: 'Admin Access',
    account: 'Account',
    login: 'Login',
    logout: 'Logout',
    cart: 'Cart',
    pending_approval: 'Pending Verification',
    switch_to_en: 'Switch to English',
    switch_to_bn: 'বাংলা ভাষায় পরিবর্তন',
    resell_ai: 'ResellAI',

    // Mobile Dock
    dock_store: 'Store',
    dock_hub: 'Hub',
    dock_admin: 'Admin',
    dock_join: 'Join (৳500)',
    dock_ai: 'AI',
    dock_track: 'Track',
    dock_cart: 'Cart',
    dock_account: 'Account',

    // Storefront Hero & Value Props
    hero_badge: "🔥 Bangladesh's #1 Zero Investment Reselling & Dropshipping Ecosystem",
    hero_title_1: 'Start Your Online Business from Home,',
    hero_title_2: 'Earn ৳20,000 to ৳50,000+ Monthly with 0 Investment',
    hero_subtitle: 'Sell trending wholesale products on your Facebook page and social media without holding any inventory. We handle packaging, Cash on Delivery across 64 districts, and disburse your profit directly to your bKash or Nagad wallet.',
    cta_become_reseller: '🚀 Join as Free Reseller',
    cta_browse_products: '📦 Explore Wholesale Catalog',
    cta_view_leaderboard: '🏆 View National Leaderboard',
    zero_inv_title: '৳0 Investment',
    zero_inv_desc: 'Zero inventory holding or upfront capital needed',
    wholesale_price_title: 'Direct Wholesale Rates',
    wholesale_price_desc: 'Maximum profit margin & factory-direct pricing',
    nationwide_cod_title: 'Nationwide Cash on Delivery',
    nationwide_cod_desc: 'Doorstep delivery across all 64 districts via Steadfast & Pathao',
    instant_payout_title: 'Fast 24-Hour Profit Payouts',
    instant_payout_desc: 'Instant disbursements to bKash, Nagad & Bank Accounts',

    // Storefront Search, Categories & Filters
    search_placeholder: 'Search products by name, code, model...',
    all_categories: 'All Categories',
    trending_only: '🔥 Trending & Bestsellers',
    sort_by: 'Sort By',
    sort_trending: 'Popular & Trending',
    sort_newest: 'Newest Arrivals',
    sort_price_low: 'Price: Low to High',
    sort_price_high: 'Price: High to Low',
    showing_products: 'products found',
    no_products_found: 'No matching products found',
    clear_filters: 'Reset Filters',

    // Product Card & Details
    suggested_price: 'Retail Selling Price:',
    wholesale_price: 'Reseller Wholesale Rate:',
    profit_margin: 'Your Potential Profit:',
    reseller_profit_badge: 'Reseller Profit',
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    sell_now_btn: '📦 Sell This Product',
    add_to_cart_btn: 'Add to Cart',
    buy_now_btn: 'Buy Directly',
    view_details_btn: 'View Details',
    ai_kit_btn: '✨ AI Marketing Kit',
    copy_caption_btn: 'Copy Caption',
    download_images_btn: 'Download Images',
    product_code: 'Product Code',
    warranty: 'Warranty',
    delivery_charge_dhaka: 'Inside Dhaka Delivery: ৳70',
    delivery_charge_outside: 'Outside Dhaka Delivery: ৳130',

    // Reseller Hub & Dashboard
    reseller_dashboard: 'Reseller Hub & Dashboard',
    welcome_back: 'Welcome back,',
    reseller_tier: 'Reseller Tier',
    total_earnings: 'Total Profit Earned',
    available_balance: 'Available Balance',
    delivered_orders: 'Delivered Orders',
    pending_orders: 'Orders in Transit',
    total_sales_volume: 'Total Sales Volume',
    withdraw_btn: '💰 Withdraw Profit (bKash/Nagad)',
    create_manual_order: '➕ Place New Order for Customer',
    my_orders: 'My Orders History',
    referral_program: 'Referral Sponsor Program',
    referral_code: 'Your Referral Code',
    copy_link: 'Copy Referral Link',
    referral_bonus_desc: 'Earn +250 XP and ৳100 Sponsor Bonus whenever an entrepreneur registers with your referral link!',
    copied_success: 'Copied to clipboard!',

    // Leaderboard
    leaderboard_title: 'National Reseller Leaderboard',
    leaderboard_subtitle: "Bangladesh's Top Performing Digital Entrepreneurs & Monthly Profit Achievers",
    all_time: 'All Time Records',
    this_month: 'This Month',
    this_week: 'This Week',
    rank: 'Rank',
    reseller: 'Reseller & Store',
    orders_delivered: 'Delivered Orders',
    net_profit: 'Net Profit Earned',
    tier: 'Tier / Badge',
    your_ranking: 'Your Current Standing',

    // Reseller Academy
    academy_title: 'MeherMart Reseller Academy',
    academy_subtitle: 'Master the art of social commerce, Facebook marketing, and high-profit dropshipping in Bangladesh',
    start_course: 'Start Course',
    lesson: 'Lesson',
    quizzes: 'Quizzes & Tests',
    get_certificate: 'Download Certificate',

    // Order Tracking Modal
    track_order_title: 'Courier Delivery Tracking',
    track_order_subtitle: 'Enter your order ID or registered customer phone number to trace live courier status',
    tracking_input_placeholder: 'Order ID or Phone Number (e.g. 017xxxxxxxx)',
    track_now_btn: 'Track Order',
    status_pending: 'Order Confirmed',
    status_processing: 'Packaging in Progress',
    status_shipped: 'Handed to Courier',
    status_delivered: 'Delivered Successfully',
    status_returned: 'Order Returned',
    courier_consignment_id: 'Courier Consignment ID',
    live_courier_tracking: 'View on Courier Portal',

    // Cart & Checkout
    customer_shopping_cart: 'Shopping Cart',
    reseller_multi_cart: 'Reseller Multi-Item Order Cart',
    empty_cart_msg: 'Your cart is currently empty',
    browse_products_btn: 'Explore Products',
    item_singular: 'Item',
    item_plural: 'Items',
    subtotal: 'Subtotal',
    delivery_charge: 'Delivery Charge',
    packaging_fee: 'Packaging Fee',
    total_payable: 'Total Payable',
    your_net_profit: 'Your Net Profit:',
    recipient_info: 'Customer Shipping & Delivery Information',
    recipient_name: 'Customer Name *',
    recipient_phone: 'Customer Phone Number *',
    select_division: 'Select Division *',
    select_district: 'Select District *',
    select_upazila: 'Select Thana / Upazila *',
    full_address: 'Full Street Address (House / Road / Area) *',
    customer_selling_price: 'Selling Price to Customer (৳) *',
    advance_courier_paid: 'Collected Courier Advance?',
    place_order_btn: 'Confirm Order (Cash on Delivery)',

    // Auth & Modals
    auth_reseller_login: 'Reseller Login',
    auth_customer_login: 'Customer Login',
    auth_reseller_register: 'New Reseller Registration',
    auth_admin_login: 'Admin Portal Login',
    phone_number: 'Phone Number',
    password: 'Password',
    full_name: 'Full Name',
    store_name: 'Online Store Name',
    sponsor_code_optional: 'Sponsor Referral Code (Optional)',
    submit_login: 'Login',
    submit_register: 'Complete Registration',
    already_registered: 'Already have an account? Login',
    new_to_mehermart: 'New Reseller? Create Free Account',

    // Footer & Logistics
    nationwide_courier: 'Nationwide Courier',
    nationwide_courier_sub: 'Steadfast, Pathao & RedX COD',
    quality_checked: 'Quality Checked',
    quality_checked_sub: 'Direct factory verified stocks',
    instant_payouts: 'Instant Payouts',
    instant_payouts_sub: 'bKash, Nagad & Bank Transfer',
    transparent_margins: 'Transparent Margins',
    transparent_margins_sub: '30৳ Flat Packaging • 0% Cut',
    footer_desc: "Bangladesh’s premier wholesale dropshipping & reseller commerce ecosystem. Empowering thousands to launch online businesses with zero inventory holding.",
    copyright: '© 2026 MeherMart Bangladesh. All rights reserved.',
    built_for_bangladesh: 'Built with pride for digital commerce entrepreneurs in Bangladesh 🇧🇩',

    // Floating WhatsApp & Contact
    whatsapp_hub_title: 'MeherMart Live Support & Hub',
    whatsapp_hub_subtitle: 'Active Reseller Care & Hotline',
    share_whatsapp: 'Share on WhatsApp',
    share_facebook: 'Share on Facebook',
    head_office_address: 'Savar DOHS, Savar, Dhaka-1344',
    direct_chat: 'Chat Directly on WhatsApp',
    privacy_terms: 'Privacy Policy & Terms of Service',
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
    return 'bn'; // Default to Bangla for Bangladeshi audience
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
      document.documentElement.lang = language;
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
    if (DICTIONARY.en[key]) return DICTIONARY.en[key];
    return fallback || key;
  };

  const isBn = language === 'bn';

  const formatPrice = (amount: number): string => {
    if (typeof amount !== 'number' || isNaN(amount)) return '৳0';
    return `৳${amount.toLocaleString('en-US')}`;
  };

  const getProductName = (product: { name: string; nameBn?: string }): string => {
    if (isBn && product.nameBn) return product.nameBn;
    return product.name;
  };

  const getProductDesc = (product: { description: string; descriptionBn?: string }): string => {
    if (isBn && product.descriptionBn) return product.descriptionBn;
    return product.description;
  };

  const getCategoryName = (cat: { name: string; nameBn?: string }): string => {
    if (isBn && cat.nameBn) return cat.nameBn;
    return cat.name;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isBn,
        setLanguage,
        toggleLanguage,
        t,
        formatPrice,
        getProductName,
        getProductDesc,
        getCategoryName,
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

