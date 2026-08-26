import fs from 'fs';
import path from 'path';
import {
  User,
  ResellerProfile,
  Product,
  ProductCategory,
  Order,
  Wallet,
  WalletTransaction,
  WithdrawalRequest,
  Achievement,
  UserAchievement,
  WeeklyChallenge,
  AcademyLesson,
  PlatformSettings,
  AuditLog,
  FraudAlert,
  LeaderboardEntry,
} from '../src/types';
import { ProfitEngine } from './profitEngine';
import { FirebaseSyncService } from './firebaseSync';
import { generateRealisticResellersDataset } from './seedResellers';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  users: User[];
  resellers: ResellerProfile[];
  categories: ProductCategory[];
  products: Product[];
  orders: Order[];
  wallets: Record<string, Wallet>;
  transactions: WalletTransaction[];
  withdrawals: WithdrawalRequest[];
  achievements: Achievement[];
  userAchievements: Record<string, UserAchievement[]>;
  weeklyChallenges: WeeklyChallenge[];
  academyLessons: AcademyLesson[];
  userLessonProgress: Record<string, string[]>; // resellerId -> lessonId[]
  settings: PlatformSettings;
  auditLogs: AuditLog[];
  fraudAlerts: FraudAlert[];
  referralClicks: Record<string, number>;
}

// Initial Database Seeding
const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 'cat-gadgets',
    name: 'Smart Gadgets & Audio',
    nameBn: 'স্মার্ট গ্যাজেট ও অডিও',
    slug: 'gadgets',
    icon: 'Headphones',
    itemCount: 6,
  },
  {
    id: 'cat-kitchen',
    name: 'Kitchen & Home Appliance',
    nameBn: 'কিচেন ও হোম অ্যাপ্লায়েন্স',
    slug: 'kitchen',
    icon: 'UtensilsCrossed',
    itemCount: 4,
  },
  {
    id: 'cat-beauty',
    name: 'Skin Care & Grooming',
    nameBn: 'স্কিন কেয়ার ও গ্রুমিং',
    slug: 'beauty',
    icon: 'Sparkles',
    itemCount: 4,
  },
  {
    id: 'cat-fashion',
    name: 'Fashion & Bags',
    nameBn: 'ফ্যাশন ও ব্যাগ',
    slug: 'fashion',
    icon: 'ShoppingBag',
    itemCount: 3,
  },
  {
    id: 'cat-lifestyle',
    name: 'Workplace & Lifestyle',
    nameBn: 'ওয়ার্কপ্লেস ও লাইফস্টাইল',
    slug: 'lifestyle',
    icon: 'Laptop',
    itemCount: 3,
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    productCode: 'MM-1001',
    name: 'T900 Ultra 2 Max Smartwatch (Dual Strap + Wireless Charge)',
    nameBn: 'টি৯০০ আল্ট্রা ২ ম্যাক্স স্মার্টওয়াচ (ডুয়াল স্ট্র্যাপ)',
    slug: 't900-ultra-2-max-smartwatch',
    category: 'Smart Gadgets & Audio',
    categorySlug: 'gadgets',
    description:
      'The #1 top-selling budget smartwatch in Bangladesh. Features real Bluetooth calling, full-screen AMOLED borderless display, IP68 water resistance, heart rate tracking, and 2 interchangeable straps.',
    features: [
      'HD 2.19-inch Infinite Display',
      'Crisp Bluetooth Calling & WhatsApp Notification',
      'Dual Straps Included (Ocean Loop + Silicon)',
      'Wireless Magnetic Fast Charger',
      '3-4 Days Long Battery Standby',
    ],
    specifications: {
      Display: '2.19 inch HD Display',
      Battery: '380mAh Polymer Lithium',
      Compatibility: 'Android 5.0+ / iOS 9.0+',
      Waterproof: 'IP68 Daily Water Resistance',
      Warranty: '7 Days Replacement Guarantee',
    },
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 145,
    isStockOut: false,
    estimatedRestockDays: 3,
    estimatedRestockDate: 'In 3-5 days',
    baseCost: 520,
    resellerPrice: 650,
    suggestedSellingPrice: 999,
    minSellingPrice: 799,
    maxSellingPrice: 1299,
    isTrending: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 328,
    successfulSalesCount: 1840,
    returnRatePercent: 1.8,
    deliveryDaysMin: 1,
    deliveryDaysMax: 3,
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'prod-02',
    productCode: 'MM-1002',
    name: 'M10 TWS Dual Earbuds with 2000mAh Powerbank Case',
    nameBn: 'এম১০ টিডব্লিউএস ডুয়াল ইয়ারবাডস ও পাওয়ারব্যাঙ্ক',
    slug: 'm10-tws-dual-earbuds',
    category: 'Smart Gadgets & Audio',
    categorySlug: 'gadgets',
    description:
      'Bangladesh’s legendary wireless earbud. Features deep 9D heavy bass, digital LED percentage display, and a heavy emergency 2000mAh case that can even charge your phone.',
    features: [
      'Super 9D Bass Sound & CVC 8.0 Noise Cancelling',
      'Digital LED Battery Percentage Indicator',
      '2000mAh Charging Case (Emergency Phone Charger)',
      'IPX7 Sweat & Splash Resistance',
      'Touch Control for Volume & Song Switching',
    ],
    specifications: {
      Bluetooth: 'V5.3 Ultra Stable',
      PlayTime: '4-5 Hours Continuous Playback',
      CaseBattery: '2000mAh Powerbank',
      ChargingPort: 'Micro-USB Fast Charge',
    },
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 220,
    isStockOut: false,
    estimatedRestockDays: 2,
    estimatedRestockDate: 'In 2-3 days',
    baseCost: 240,
    resellerPrice: 320,
    suggestedSellingPrice: 499,
    minSellingPrice: 399,
    maxSellingPrice: 699,
    isTrending: true,
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 512,
    successfulSalesCount: 3420,
    returnRatePercent: 2.1,
    deliveryDaysMin: 1,
    deliveryDaysMax: 2,
    createdAt: '2026-08-02T00:00:00.000Z',
  },
  {
    id: 'prod-03',
    productCode: 'MM-1003',
    name: 'High-Power Electric Meat & Vegetable Food Chopper (2L Stainless Steel)',
    nameBn: 'ইলেকট্রিক ফুড চপার ২ লিটার স্টেইনলেস স্টিল',
    slug: 'electric-food-chopper-2l',
    category: 'Kitchen & Home Appliance',
    categorySlug: 'kitchen',
    description:
      'Chop meat, garlic, onions, chilies, ginger and vegetables in just 6 seconds! Heavy duty pure copper motor with 4-blade surgical sharp stainless steel blades.',
    features: [
      '4-Blade 3D Fast Slicing Technology',
      'Pure Copper 300W High Torque Motor',
      '2L Large Unbreakable Stainless Steel Bowl',
      'Dual Speed Gear System (Soft & Hard Foods)',
      'Easy To Wash & Odor-Proof',
    ],
    specifications: {
      Capacity: '2.0 Liters',
      Power: '300W Pure Copper',
      Voltage: '220V 50Hz',
      Material: 'Food Grade 304 Stainless Steel',
    },
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 90,
    isStockOut: false,
    estimatedRestockDays: 3,
    estimatedRestockDate: 'In 3-5 days',
    baseCost: 780,
    resellerPrice: 950,
    suggestedSellingPrice: 1450,
    minSellingPrice: 1200,
    maxSellingPrice: 1750,
    isTrending: true,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 142,
    successfulSalesCount: 910,
    returnRatePercent: 1.2,
    deliveryDaysMin: 1,
    deliveryDaysMax: 3,
    createdAt: '2026-08-03T00:00:00.000Z',
  },
  {
    id: 'prod-04',
    productCode: 'MM-1004',
    name: 'Cordless Portable Garment Steamer & Hijab Iron',
    nameBn: 'পোর্টেবল হ্যান্ডহেল্ড গারমেন্ট স্টিমার',
    slug: 'portable-garment-steamer',
    category: 'Kitchen & Home Appliance',
    categorySlug: 'kitchen',
    description:
      'Fast 15-second instant steam iron for wrinkle-free sarees, shirts, panjabis, and hijabs. Compact foldable design for home and travel.',
    features: [
      '15-Second Fast Heat-Up Ceramic Plate',
      'High-Pressure Continuous Dry Steam Flow',
      'Foldable Handle for Easy Travel Storage',
      'Safe for Silk, Cotton, Georgette, and Linen',
    ],
    specifications: {
      Power: '1000W Fast Steam',
      WaterTank: '150ml Detachable Tank',
      Weight: '620 grams',
    },
    images: [
      'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 0,
    isStockOut: true,
    estimatedRestockDays: 4,
    estimatedRestockDate: 'In 4-5 Days (30 Aug)',
    baseCost: 850,
    resellerPrice: 1050,
    suggestedSellingPrice: 1590,
    minSellingPrice: 1350,
    maxSellingPrice: 1890,
    isTrending: false,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 98,
    successfulSalesCount: 650,
    returnRatePercent: 1.5,
    deliveryDaysMin: 2,
    deliveryDaysMax: 3,
    createdAt: '2026-08-04T00:00:00.000Z',
  },
  {
    id: 'prod-05',
    productCode: 'MM-1005',
    name: 'KUMKUMADI Organic 24K Saffron Glow Face Oil (30ml)',
    nameBn: 'কুমকুমাদি অর্গানিক ২৪কে জাফরান গ্লো ফেস অয়েল',
    slug: 'kumkumadi-saffron-glow-oil',
    category: 'Skin Care & Grooming',
    categorySlug: 'beauty',
    description:
      'Pure Kashmiri Saffron and herbal root extracts for radiant glass-skin glow, removing dark spots, pigmentation, and acne blemishes naturally.',
    features: [
      'Infused with 100% Pure Kashmiri Red Saffron',
      'Reduces Melasma & Dark Spots Visible in 14 Days',
      'Non-Sticky, Lightweight Fast-Absorbing Formula',
      'BSTI & Lab Tested Safe for Sensitive Skin',
    ],
    specifications: {
      Volume: '30 ml Dropper Bottle',
      SkinType: 'All Skin Types (Unisex)',
      ShelfLife: '24 Months',
    },
    images: [
      'https://images.unsplash.com/photo-1608248597359-5489f666f7f3?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 310,
    isStockOut: false,
    estimatedRestockDays: 3,
    estimatedRestockDate: 'In 3-5 days',
    baseCost: 280,
    resellerPrice: 380,
    suggestedSellingPrice: 650,
    minSellingPrice: 499,
    maxSellingPrice: 850,
    isTrending: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 420,
    successfulSalesCount: 2890,
    returnRatePercent: 0.9,
    deliveryDaysMin: 1,
    deliveryDaysMax: 2,
    createdAt: '2026-08-05T00:00:00.000Z',
  },
  {
    id: 'prod-06',
    productCode: 'MM-1006',
    name: 'VGR V-030 Professional Zero-Trim Hair & Beard Trimmer',
    nameBn: 'ভিজিআর প্রফেশনাল জিরো কাট হেয়ার ও বিয়ার্ড ট্রিমার',
    slug: 'vgr-v030-beard-trimmer',
    category: 'Skin Care & Grooming',
    categorySlug: 'beauty',
    description:
      'Sleek vintage carved metal body with self-sharpening T-blade. Clean 0mm close shaving and edge detailing with 5 guide combs.',
    features: [
      'Titanium Stainless Steel Zero-Gapped T-Blade',
      'Heavy 1200mAh USB Rechargeable Battery (120 Mins Run)',
      'Ultra Quiet High Speed Magnetic Motor',
      'Includes 5 Guide Limit Combs (1/2/3/4/5mm)',
    ],
    specifications: {
      RunTime: '120 Minutes Non-stop',
      ChargeTime: '2 Hours USB',
      Body: 'Zinc Metal Antique Engraved',
    },
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 130,
    isStockOut: false,
    estimatedRestockDays: 3,
    estimatedRestockDate: 'In 3-5 days',
    baseCost: 650,
    resellerPrice: 800,
    suggestedSellingPrice: 1190,
    minSellingPrice: 990,
    maxSellingPrice: 1450,
    isTrending: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 180,
    successfulSalesCount: 1200,
    returnRatePercent: 1.4,
    deliveryDaysMin: 1,
    deliveryDaysMax: 3,
    createdAt: '2026-08-06T00:00:00.000Z',
  },
  {
    id: 'prod-07',
    productCode: 'MM-1007',
    name: 'Anti-Theft Waterproof Laptop Backpack with USB Charging Port',
    nameBn: 'ওয়াটারপ্রুফ অ্যান্টি-থেফট ল্যাপটপ ব্যাকপ্যাক',
    slug: 'anti-theft-laptop-backpack',
    category: 'Fashion & Bags',
    categorySlug: 'fashion',
    description:
      'Premium Oxford fabric, hidden zipper security pocket, padded 15.6-inch laptop compartment, and external USB passthrough port for powerbanks.',
    features: [
      'Scratch & Water Repellent High-Density Oxford',
      'Dedicated Shockproof 15.6" Laptop Sleeve',
      'External Integrated USB Fast-Charging Port',
      'Ergonomic Breathable Honeycomb Shoulder Straps',
    ],
    specifications: {
      Dimensions: '46cm x 31cm x 15cm',
      Weight: '750 grams',
      Capacity: '25-30 Liters',
    },
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 80,
    isStockOut: false,
    estimatedRestockDays: 4,
    estimatedRestockDate: 'In 4-5 days',
    baseCost: 720,
    resellerPrice: 890,
    suggestedSellingPrice: 1390,
    minSellingPrice: 1150,
    maxSellingPrice: 1650,
    isTrending: false,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 75,
    successfulSalesCount: 430,
    returnRatePercent: 1.1,
    deliveryDaysMin: 2,
    deliveryDaysMax: 3,
    createdAt: '2026-08-07T00:00:00.000Z',
  },
  {
    id: 'prod-08',
    productCode: 'MM-1008',
    name: 'Ergonomic 360° Rotating Aluminum Laptop & Tablet Stand',
    nameBn: 'অ্যালুমিনিয়াম ৩৬০ ডিগ্রি রোটেটিং ল্যাপটপ স্ট্যান্ড',
    slug: 'rotating-aluminum-laptop-stand',
    category: 'Workplace & Lifestyle',
    categorySlug: 'lifestyle',
    description:
      'Solid aircraft-grade aluminum stand with clicking 360-degree rotation base. Eliminates neck and back fatigue during long office or freelancing work.',
    features: [
      'Satisfying Mechanical 360° Click Rotation Base',
      'Heavy Dual Damping Shafts (Holds up to 10kg)',
      'Hollow Cooling Plate for Airflow & Heat Dissipation',
      'Anti-Slip Thick Silicone Pads',
    ],
    specifications: {
      Material: 'Sandblasted Anodized Aluminum Alloy',
      Compatibility: 'All Laptops 10 to 17.3 inches',
      Weight: '920 grams',
    },
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 110,
    isStockOut: false,
    estimatedRestockDays: 3,
    estimatedRestockDate: 'In 3-5 days',
    baseCost: 680,
    resellerPrice: 850,
    suggestedSellingPrice: 1290,
    minSellingPrice: 1050,
    maxSellingPrice: 1550,
    isTrending: true,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 160,
    successfulSalesCount: 880,
    returnRatePercent: 0.8,
    deliveryDaysMin: 1,
    deliveryDaysMax: 3,
    createdAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'prod-09',
    productCode: 'MM-1009',
    name: '12-inch RGB LED Ring Light with 7ft Heavy Tripod Stand',
    nameBn: '১২ ইঞ্চি আরজিবি রিং লাইট ও ৭ ফুট ট্রাইপড স্ট্যান্ড',
    slug: '12-inch-rgb-ring-light-tripod',
    category: 'Smart Gadgets & Audio',
    categorySlug: 'gadgets',
    description:
      'The essential setup for Facebook live sellers, TikTok creators, and video content makers in Bangladesh. 26 RGB vibrant color modes plus 3 natural light shades.',
    features: [
      '26 RGB Color Magic Modes + Warm/Cool/Natural Light',
      'Heavy Metal 2.1m (7ft) Height Adjustable Tripod',
      '360° Rotatable Universal Mobile Phone Clamp',
      'USB Powered with In-line Controller + Wireless Remote',
    ],
    specifications: {
      Diameter: '30cm / 12 inches',
      LEDCount: '168 High Lumens Beads',
      TripodHeight: 'Max 210cm (7 feet)',
    },
    images: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 95,
    isStockOut: false,
    estimatedRestockDays: 2,
    estimatedRestockDate: 'In 2-3 days',
    baseCost: 580,
    resellerPrice: 720,
    suggestedSellingPrice: 1099,
    minSellingPrice: 899,
    maxSellingPrice: 1350,
    isTrending: true,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 230,
    successfulSalesCount: 1540,
    returnRatePercent: 1.6,
    deliveryDaysMin: 1,
    deliveryDaysMax: 3,
    createdAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'prod-10',
    productCode: 'MM-1010',
    name: 'Automatic Rechargeable Water Dispenser Pump for 20L Bottles',
    nameBn: 'রিচার্জেবল অটোমেটিক ওয়াটার পাম্প',
    slug: 'rechargeable-water-dispenser-pump',
    category: 'Kitchen & Home Appliance',
    categorySlug: 'kitchen',
    description:
      'Say goodbye to heavy lifting of 20L water jars. One-touch automatic suction pump with USB rechargeable battery and food-grade silicone pipe.',
    features: [
      'One Button Simple Operation',
      'BPA-Free Food Grade Silicone Hose & 304 Stainless Steel Spout',
      'Built-in 1200mAh USB Battery (Pumps 6-8 Full 20L Jars per Charge)',
      'Fits Standard 5 Gallon (20L) Water Barrels',
    ],
    specifications: {
      Battery: '1200mAh Lithium Ion',
      Material: 'ABS Plastic + 304 Stainless Steel',
      Charging: 'Micro USB (Cable Included)',
    },
    images: [
      'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 260,
    isStockOut: false,
    estimatedRestockDays: 3,
    estimatedRestockDate: 'In 3-5 days',
    baseCost: 190,
    resellerPrice: 260,
    suggestedSellingPrice: 420,
    minSellingPrice: 350,
    maxSellingPrice: 550,
    isTrending: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 390,
    successfulSalesCount: 2450,
    returnRatePercent: 1.3,
    deliveryDaysMin: 1,
    deliveryDaysMax: 2,
    createdAt: '2026-08-10T00:00:00.000Z',
  },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-01',
    title: 'First Sale Hero',
    titleBn: 'প্রথম অর্ডারের নায়ক',
    description: 'Generated your very first successfully delivered customer order on Shadhin Reseller.',
    icon: 'Rocket',
    category: 'SALES',
    xpReward: 300,
    badgeReward: '🌱 First Spark',
    conditionType: 'DELIVERIES',
    threshold: 1,
  },
  {
    id: 'ach-02',
    title: 'Ten Delivered Club',
    titleBn: '১০টি সফল ডেলিভারি',
    description: 'Completed 10 successful customer deliveries with zero fraud.',
    icon: 'PackageCheck',
    category: 'DELIVERY',
    xpReward: 600,
    badgeReward: '🔥 Consistent Hustler',
    conditionType: 'DELIVERIES',
    threshold: 10,
  },
  {
    id: 'ach-03',
    title: '50 Delivered Champion',
    titleBn: '৫০টি সফল ডেলিভারি চ্যাম্পিয়ন',
    description: 'Delivered 50 products across Bangladesh with top customer reviews.',
    icon: 'ShieldCheck',
    category: 'DELIVERY',
    xpReward: 1500,
    badgeReward: '⚡ High Volume Pro',
    conditionType: 'DELIVERIES',
    threshold: 50,
  },
  {
    id: 'ach-04',
    title: '৳5,000 Pure Profit',
    titleBn: '৳৫,০০০ নিট প্রফিট ক্লাব',
    description: 'Accumulated over ৳5,000 in net withdrawable reseller profits.',
    icon: 'Coins',
    category: 'PROFIT',
    xpReward: 800,
    badgeReward: '💰 Profit Maker',
    conditionType: 'PROFIT',
    threshold: 5000,
  },
  {
    id: 'ach-05',
    title: '7-Day Selling Streak',
    titleBn: 'টানা ৭ দিনের সেল স্ট্রিক',
    description: 'Made at least one sale every day for 7 consecutive days.',
    icon: 'Flame',
    category: 'STREAK',
    xpReward: 1000,
    badgeReward: '🔥 Unstoppable Streak',
    conditionType: 'STREAK',
    threshold: 7,
  },
  {
    id: 'ach-06',
    title: 'Academy Master Graduate',
    titleBn: 'একাডেমি গ্র্যাজুয়েট',
    description: 'Completed all core modules of the Reseller Academy.',
    icon: 'GraduationCap',
    category: 'ACADEMY',
    xpReward: 500,
    badgeReward: '🎓 Certified Reseller',
    conditionType: 'ACADEMY',
    threshold: 5,
  },
];

const INITIAL_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'chal-01',
    title: 'Dhaka Speed Rush 🚀',
    description: 'Complete 5 successful delivered customer orders this week.',
    targetCount: 5,
    metric: 'DELIVERIES',
    rewardXp: 500,
    rewardBonusBdt: 250,
    startDate: '2026-08-20T00:00:00.000Z',
    endDate: '2026-08-27T23:59:59.000Z',
  },
  {
    id: 'chal-02',
    title: 'Gadget Mania 🎧',
    description: 'Generate ৳5,000+ total customer order value in Smart Gadgets & Audio.',
    targetCount: 5000,
    metric: 'SALES_BDT',
    rewardXp: 800,
    rewardBonusBdt: 400,
    startDate: '2026-08-20T00:00:00.000Z',
    endDate: '2026-08-27T23:59:59.000Z',
  },
];

const INITIAL_ACADEMY_LESSONS: AcademyLesson[] = [
  {
    id: 'les-01',
    courseId: 'crs-01',
    courseTitle: 'Reselling 101: Zero Inventory Selling',
    title: 'How Shadhin Reseller Works (The 5-Step Loop)',
    titleBn: 'কিভাবে স্বাধীন রিসেলার কাজ করে (৫টি ধাপ)',
    description:
      'Learn how to discover high-profit products, set your retail margin, share links, and let Shadhin handle quality check, packaging, and nationwide COD fulfillment.',
    durationMinutes: 6,
    xpReward: 100,
    order: 1,
    contentMarkdown: `### The Zero-Risk Commerce Loop

Reselling with Shadhin Reseller eliminates 100% of the traditional inventory and warehousing risks:

1. **Discover**: Browse our verified catalog with wholesale prices and transparent margins.
2. **Set Your Price**: Keep our suggested retail price or adjust according to your target audience.
3. **Share & Sell**: Post on Facebook Pages, WhatsApp groups, Marketplace, or TikTok.
4. **We Fulfill**: When you submit the customer's name, phone, and address, our team picks, packs, tests, and ships via Steadfast/Pathao courier with Cash on Delivery.
5. **Get Paid**: As soon as the customer accepts the parcel and pays the courier, your profit is instantly released into your wallet.`,
    keyTakeaways: [
      'No upfront inventory investment required',
      'Full Cash On Delivery (COD) supported nationwide',
      'Profits are guaranteed and withdrawable via bKash/Nagad/Bank',
    ],
    actionSteps: [
      'Pick 1 trending product from the catalog',
      'Generate your unique Share & Sell link',
      'Post on your personal or business page',
    ],
  },
  {
    id: 'les-02',
    courseId: 'crs-01',
    courseTitle: 'Reselling 101: Zero Inventory Selling',
    title: 'Mastering Facebook Marketplace & Groups in Bangladesh',
    titleBn: 'ফেসবুক মার্কেটপ্লেস ও গ্রুপ থেকে দিনে ৫টি অর্ডার পাওয়ার কৌশল',
    description:
      'Practical tips on writing engaging captions, choosing attractive cover photos, and responding to inbox leads within 3 minutes to maximize conversions.',
    durationMinutes: 8,
    xpReward: 120,
    order: 2,
    contentMarkdown: `### 3 Golden Rules of Facebook Selling in Bangladesh

- **Visual Clarity**: Always use 1:1 square, well-lit photos. Highlight that Cash On Delivery is available.
- **Speed of Reply**: 78% of Bangladeshi buyers purchase from the seller who replies first within 5 minutes.
- **Clear Price & Delivery Info**: Mention the exact price (e.g. ৳999) and delivery fee (৳60 in Dhaka, ৳120 outside Dhaka) upfront to build instant trust.`,
    keyTakeaways: [
      'Reply to Messenger/WhatsApp inquiries in under 5 minutes',
      'Use ResellAI to generate catchy Bangla captions with emojis',
      'Always reassure the customer about 7 days replacement guarantee',
    ],
    actionSteps: [
      'Use the AI Selling Assistant to generate a Facebook Caption',
      'Create 1 post on your Facebook page or Marketplace',
    ],
  },
  {
    id: 'les-03',
    courseId: 'crs-02',
    courseTitle: 'Customer Psychology & Return Prevention',
    title: 'How to Prevent Courier Returns & Customer Cancellations',
    titleBn: 'কুরিয়ার রিটার্ন ও অর্ডার ক্যানসেলেশন কমানোর উপায়',
    description:
      'Returns hurt profitability. Learn the exact phone verification script to confirm real customer intent before submitting an order.',
    durationMinutes: 7,
    xpReward: 150,
    order: 3,
    contentMarkdown: `### The 30-Second Confirmation Call Script

Before placing a customer order into the Shadhin system, call them:
> "আসসালামু আলাইকুম [Customer Name] ভাই/আপু, আপনার [Product Name] অর্ডারের জন্য ধন্যবাদ। আপনার টোটাল বিল ৳[Amount] (ক্যাশ অন ডেলিভারি)। কুরিয়ার পার্সেলটি নিয়ে আগামী [1-2] দিনের মধ্যে আপনার সাথে যোগাযোগ করবে। আপনি কি লোকেশনে রিসিভ করতে পারবেন?"

This single call reduces return rates from 15% down to under 2%!`,
    keyTakeaways: [
      'Always verify customer phone numbers with a quick 30-second call',
      'Reconfirm exact address, district, and upazila',
      'Provide courier tracking number to the customer via SMS or WhatsApp',
    ],
    actionSteps: [
      'Save the confirmation call script on your phone notes',
      'Practice with your next customer inquiry',
    ],
  },
  {
    id: 'les-04',
    courseId: 'crs-02',
    courseTitle: 'Customer Psychology & Return Prevention',
    title: 'Understanding Profit Calculations, Wallet & Settlements',
    titleBn: 'প্রফিট হিসাব, ওয়ালেট সেটেলমেন্ট ও উত্তোলন নিয়ম',
    description:
      'Deep dive into gross profit, platform margins, settlement timeline, and how bKash/Nagad withdrawals work.',
    durationMinutes: 5,
    xpReward: 100,
    order: 4,
    contentMarkdown: `### Transparent Ledger Architecture

- **Reseller Gross Profit** = (Customer Selling Price - Wholesale Reseller Price).
- **Pending Balance**: Profit is held in pending status while the package is being delivered.
- **Available Balance**: As soon as courier marks parcel DELIVERED, profit moves to Available immediately.
- **Withdrawal**: Minimum ৳500. Free of charge, processed within 12-24 hours to bKash, Nagad, or Bank.`,
    keyTakeaways: [
      'Profits are settled upon successful courier delivery',
      'All transactions are recorded immutably in your Wallet Ledger',
      'Zero hidden fees or surprise deductions',
    ],
    actionSteps: ['Check your Wallet tab', 'Set your preferred bKash/Nagad number'],
  },
];

const INITIAL_USERS: User[] = [
  {
    id: 'usr-founder',
    name: 'Nakib Abdullah (FOUNDER)',
    email: 'abdullahnakib777@gmail.com',
    phone: '01711223344',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-07-01T00:00:00.000Z',
    isFounder: true,
  },
  {
    id: 'usr-reseller-01',
    name: 'Sabbir Ahmed',
    email: 'sabbir@example.com',
    phone: '01812345678',
    role: 'RESELLER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-07-15T00:00:00.000Z',
  },
  {
    id: 'usr-reseller-02',
    name: 'Nusrat Jahan',
    email: 'nusrat@example.com',
    phone: '01923456789',
    role: 'RESELLER',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'usr-customer-01',
    name: 'Tanvir Hossain',
    email: 'tanvir@gmail.com',
    phone: '01633445566',
    role: 'CUSTOMER',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01T00:00:00.000Z',
  },
];

const INITIAL_RESELLERS: ResellerProfile[] = [
  {
    id: 'rsl-founder',
    userId: 'usr-founder',
    storeName: 'Nakib Commerce (Official Founder Store)',
    facebookPage: 'https://facebook.com/nakibofficial',
    whatsappNumber: '01711223344',
    referralCode: 'FOUNDER-NAKIB',
    status: 'ACTIVE',
    isVerified: true,
    verificationFeePaid: true,
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Dhanmondi',
    address: 'Road 7/A, Dhanmondi, Dhaka',
    salesIntent: 'Selling smart gadgets and kitchen appliances via Facebook Live',
    level: 4,
    xp: 5400,
    isAnonymousOnLeaderboard: false,
    createdAt: '2026-07-01T00:00:00.000Z',
  },
  {
    id: 'rsl-01',
    userId: 'usr-reseller-01',
    storeName: 'Sabbir Smart Mart',
    facebookPage: 'https://facebook.com/sabbirgadgets',
    whatsappNumber: '01812345678',
    referralCode: 'RSL-SABBIR88',
    status: 'ACTIVE',
    isVerified: true,
    verificationFeePaid: true,
    division: 'Chittagong',
    district: 'Chittagong',
    upazila: 'Agrabad',
    address: 'CDA Avenue, Agrabad, Chittagong',
    salesIntent: 'Facebook Marketplace and TikTok tech unboxings',
    level: 3,
    xp: 2850,
    isAnonymousOnLeaderboard: false,
    createdAt: '2026-07-15T00:00:00.000Z',
  },
  {
    id: 'rsl-02',
    userId: 'usr-reseller-02',
    storeName: 'Nusrat Organic & Lifestyle',
    facebookPage: 'https://facebook.com/nusratorganic',
    whatsappNumber: '01923456789',
    referralCode: 'RSL-NUSRAT99',
    status: 'ACTIVE',
    isVerified: true,
    verificationFeePaid: true,
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Uttara',
    address: 'Sector 4, Uttara, Dhaka',
    salesIntent: 'Selling organic skincare to university students',
    level: 2,
    xp: 1200,
    isAnonymousOnLeaderboard: false,
    createdAt: '2026-07-20T00:00:00.000Z',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-2026-8801',
    customerId: 'usr-customer-01',
    customerName: 'Tanvir Hossain',
    customerPhone: '01633445566',
    customerEmail: 'tanvir@gmail.com',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Mirpur',
    address: 'House 12, Road 4, Section 10, Mirpur, Dhaka',
    resellerId: 'rsl-01',
    resellerStoreName: 'Sabbir Smart Mart',
    resellerReferralCode: 'RSL-SABBIR88',
    items: [
      {
        productId: 'prod-01',
        productName: 'T900 Ultra 2 Max Smartwatch (Dual Strap + Wireless Charge)',
        productImage:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        quantity: 1,
        baseCost: 520,
        resellerPrice: 650,
        unitSellingPrice: 999,
        resellerProfit: 349,
        platformMargin: 130,
      },
    ],
    itemCount: 1,
    subtotal: 999,
    deliveryFee: 60,
    platformFee: 0,
    totalAmount: 1059,
    totalResellerProfit: 349,
    totalPlatformMargin: 130,
    profitStatus: 'AVAILABLE',
    paymentMethod: 'COD',
    paymentStatus: 'PAID',
    courier: 'STEADFAST',
    trackingNumber: 'STDF-8812903',
    status: 'DELIVERED',
    statusHistory: [
      { status: 'PENDING', timestamp: '2026-08-20T10:00:00Z', note: 'Order placed by reseller', updatedBy: 'Sabbir Ahmed' },
      { status: 'CONFIRMED', timestamp: '2026-08-20T11:30:00Z', note: 'Customer confirmed via call', updatedBy: 'Admin Team' },
      { status: 'PACKAGING', timestamp: '2026-08-20T14:00:00Z', note: 'QA passed and bubble wrapped', updatedBy: 'Warehouse' },
      { status: 'SHIPPING', timestamp: '2026-08-21T09:00:00Z', note: 'Handed to Steadfast Courier', updatedBy: 'Warehouse' },
      { status: 'DELIVERED', timestamp: '2026-08-22T16:45:00Z', note: 'Customer accepted parcel and paid COD', updatedBy: 'Steadfast Sync' },
    ],
    createdAt: '2026-08-20T10:00:00.000Z',
    deliveredAt: '2026-08-22T16:45:00.000Z',
    settledAt: '2026-08-22T16:45:00.000Z',
    isDirectCustomerOrder: false,
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-2026-8802',
    customerName: 'Ayesha Siddiqua',
    customerPhone: '01788990011',
    division: 'Chittagong',
    district: 'Chittagong',
    upazila: 'Panchlaish',
    address: 'Apartment 4B, Nasirabad Housing, Panchlaish, Chittagong',
    resellerId: 'rsl-01',
    resellerStoreName: 'Sabbir Smart Mart',
    resellerReferralCode: 'RSL-SABBIR88',
    items: [
      {
        productId: 'prod-02',
        productName: 'M10 TWS Dual Earbuds with 2000mAh Powerbank Case',
        productImage:
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
        quantity: 2,
        baseCost: 240,
        resellerPrice: 320,
        unitSellingPrice: 499,
        resellerProfit: 358,
        platformMargin: 160,
      },
    ],
    itemCount: 2,
    subtotal: 998,
    deliveryFee: 120,
    platformFee: 0,
    totalAmount: 1118,
    totalResellerProfit: 358,
    totalPlatformMargin: 160,
    profitStatus: 'PENDING',
    paymentMethod: 'COD',
    paymentStatus: 'UNPAID',
    courier: 'PATHAO',
    trackingNumber: 'PTHO-772910',
    status: 'SHIPPING',
    statusHistory: [
      { status: 'PENDING', timestamp: '2026-08-23T12:00:00Z', note: 'Created via Share link', updatedBy: 'System' },
      { status: 'CONFIRMED', timestamp: '2026-08-23T14:15:00Z', note: 'Customer confirmed', updatedBy: 'Admin' },
      { status: 'PACKAGING', timestamp: '2026-08-24T10:00:00Z', note: 'Packed', updatedBy: 'Warehouse' },
      { status: 'SHIPPING', timestamp: '2026-08-24T16:00:00Z', note: 'Dispatched to Pathao Chittagong Hub', updatedBy: 'Courier Ops' },
    ],
    createdAt: '2026-08-23T12:00:00.000Z',
    isDirectCustomerOrder: true,
  },
  {
    id: 'ord-103',
    orderNumber: 'ORD-2026-8803',
    customerName: 'Mahmudul Hasan',
    customerPhone: '01511223355',
    division: 'Rajshahi',
    district: 'Rajshahi',
    upazila: 'Boalia',
    address: 'Holding 45, Shaheb Bazar, Boalia, Rajshahi',
    resellerId: 'rsl-founder',
    resellerStoreName: 'Nakib Commerce (Official Founder Store)',
    resellerReferralCode: 'FOUNDER-NAKIB',
    items: [
      {
        productId: 'prod-03',
        productName: 'High-Power Electric Meat & Vegetable Food Chopper (2L Stainless Steel)',
        productImage:
          'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
        quantity: 1,
        baseCost: 780,
        resellerPrice: 950,
        unitSellingPrice: 1450,
        resellerProfit: 500,
        platformMargin: 170,
      },
    ],
    itemCount: 1,
    subtotal: 1450,
    deliveryFee: 120,
    platformFee: 0,
    totalAmount: 1570,
    totalResellerProfit: 500,
    totalPlatformMargin: 170,
    profitStatus: 'AVAILABLE',
    paymentMethod: 'COD',
    paymentStatus: 'PAID',
    courier: 'STEADFAST',
    trackingNumber: 'STDF-9930214',
    status: 'DELIVERED',
    statusHistory: [
      { status: 'PENDING', timestamp: '2026-08-21T09:00:00Z', note: 'Created by Founder Reseller', updatedBy: 'Nakib' },
      { status: 'DELIVERED', timestamp: '2026-08-23T15:00:00Z', note: 'Delivered successfully in Rajshahi', updatedBy: 'Courier' },
    ],
    createdAt: '2026-08-21T09:00:00.000Z',
    deliveredAt: '2026-08-23T15:00:00.000Z',
    settledAt: '2026-08-23T15:00:00.000Z',
    isDirectCustomerOrder: false,
  },
];

const INITIAL_WALLETS: Record<string, Wallet> = {
  'rsl-founder': {
    resellerId: 'rsl-founder',
    availableBalance: 2850,
    pendingBalance: 0,
    totalEarned: 5850,
    totalWithdrawn: 3000,
    updatedAt: '2026-08-24T12:00:00.000Z',
  },
  'rsl-01': {
    resellerId: 'rsl-01',
    availableBalance: 1740,
    pendingBalance: 358,
    totalEarned: 2740,
    totalWithdrawn: 1000,
    updatedAt: '2026-08-24T12:00:00.000Z',
  },
  'rsl-02': {
    resellerId: 'rsl-02',
    availableBalance: 850,
    pendingBalance: 0,
    totalEarned: 850,
    totalWithdrawn: 0,
    updatedAt: '2026-08-24T12:00:00.000Z',
  },
};

const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-01',
    resellerId: 'rsl-01',
    type: 'SALE_PROFIT',
    amount: 349,
    balanceAfter: 1740,
    currency: 'BDT',
    referenceType: 'ORDER',
    referenceId: 'ord-101',
    status: 'COMPLETED',
    description: 'Profit credited for delivered Order #ORD-2026-8801 (T900 Smartwatch)',
    createdAt: '2026-08-22T16:45:00.000Z',
  },
  {
    id: 'tx-02',
    resellerId: 'rsl-01',
    type: 'WITHDRAWAL',
    amount: -1000,
    balanceAfter: 1391,
    currency: 'BDT',
    referenceType: 'WITHDRAWAL',
    referenceId: 'wd-01',
    status: 'COMPLETED',
    description: 'Withdrawal payout to bKash (01812345678) [TrxID: 9HB788Q]',
    createdAt: '2026-08-18T14:30:00.000Z',
  },
  {
    id: 'tx-03',
    resellerId: 'rsl-founder',
    type: 'SALE_PROFIT',
    amount: 500,
    balanceAfter: 2850,
    currency: 'BDT',
    referenceType: 'ORDER',
    referenceId: 'ord-103',
    status: 'COMPLETED',
    description: 'Profit credited for delivered Order #ORD-2026-8803 (Electric Food Chopper)',
    createdAt: '2026-08-23T15:00:00.000Z',
  },
];

const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wd-01',
    resellerId: 'rsl-01',
    resellerName: 'Sabbir Ahmed',
    resellerStoreName: 'Sabbir Smart Mart',
    amount: 1000,
    method: 'BKASH',
    accountNumber: '01812345678',
    status: 'PAID',
    requestedAt: '2026-08-18T10:00:00.000Z',
    approvedAt: '2026-08-18T12:00:00.000Z',
    paidAt: '2026-08-18T14:30:00.000Z',
    transactionId: '9HB788Q',
    adminNote: 'Sent via bKash Merchant Payout API',
  },
];

const INITIAL_SETTINGS: PlatformSettings = {
  isVerificationRequired: true,
  verificationFeeBdt: 0, // Free verification by default
  isVerificationPaymentMandatory: false,
  minWithdrawalAmountBdt: 500,
  standardDeliveryFeeDhaka: 60,
  standardDeliveryFeeOutsideDhaka: 120,
  packagingChargeBdt: 30, // 30 TK flat packaging charge
  platformFeePercent: 0,
  referralRewardBdt: 50,
  autoApproveResellers: false,
  supportPhone: '01333855344',
  supportWhatsapp: '01333855344',
  supportEmail: 'support@mehermart.com',
  supportAddress: 'Savar DOHS, Savar, Dhaka-1344',
  founderResellerId: 'rsl-founder',
};

class Database {
  private data: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.data = this.getDefaultData();
    this.load();
  }

  private getDefaultData(): DatabaseSchema {
    const seed = generateRealisticResellersDataset();

    return {
      users: seed.users,
      resellers: seed.resellers,
      categories: [...INITIAL_CATEGORIES],
      products: [...INITIAL_PRODUCTS],
      orders: seed.orders,
      wallets: seed.wallets,
      transactions: [...INITIAL_TRANSACTIONS],
      withdrawals: [...INITIAL_WITHDRAWALS],
      achievements: [...INITIAL_ACHIEVEMENTS],
      userAchievements: {
        'rsl-01': [
          { achievementId: 'ach-01', unlockedAt: '2026-08-20T16:45:00Z', claimed: true },
        ],
        'rsl-founder': [
          { achievementId: 'ach-01', unlockedAt: '2026-08-20T16:45:00Z', claimed: true },
          { achievementId: 'ach-02', unlockedAt: '2026-08-23T15:00:00Z', claimed: true },
        ],
      },
      weeklyChallenges: [...INITIAL_CHALLENGES],
      academyLessons: [...INITIAL_ACADEMY_LESSONS],
      userLessonProgress: {
        'rsl-01': ['les-01', 'les-02'],
        'rsl-founder': ['les-01', 'les-02', 'les-03'],
      },
      settings: { ...INITIAL_SETTINGS },
      auditLogs: [
        {
          id: 'log-01',
          action: 'SYSTEM_BOOT',
          actorId: 'system',
          actorName: 'System Engine',
          actorRole: 'ADMIN',
          targetType: 'SYSTEM',
          targetId: '0',
          details: 'Initialized MeherMart platform database schema and 213 verified demo resellers',
          timestamp: new Date().toISOString(),
        },
      ],
      fraudAlerts: [],
      referralClicks: {
        'FOUNDER-MEHER': 342,
        'MM-SMAR101': 210,
        'MM-ELIT102': 95,
      },
    };
  }

  private load() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        const defaults = this.getDefaultData();

        // Ensure resellers dataset is complete with all 213 realistic entries
        let finalResellers = defaults.resellers.map((defReseller) => {
          if (defReseller.id === 'rsl-founder') {
            // Keep existing founder store intact
            const existingFounder = (parsed.resellers || []).find((r: ResellerProfile) => r.id === 'rsl-founder');
            return existingFounder || defReseller;
          }
          // For demo resellers, incorporate the updated demo orders, profits, xp and status
          const existing = (parsed.resellers || []).find((r: ResellerProfile) => r.id === defReseller.id);
          if (existing) {
            return {
              ...defReseller,
              ...existing,
              deliveredOrdersCount: defReseller.deliveredOrdersCount,
              totalOrdersCount: defReseller.totalOrdersCount,
              totalProfitEarned: defReseller.totalProfitEarned,
              totalProfitEarnedBdt: defReseller.totalProfitEarnedBdt,
              level: defReseller.level,
              xp: defReseller.xp,
              status: defReseller.status,
              isVerified: defReseller.isVerified,
              verificationFeePaid: defReseller.verificationFeePaid,
            };
          }
          return defReseller;
        });

        let finalUsers = defaults.users.map((defUser) => {
          if (defUser.id === 'usr-founder') {
            const existingFounderUser = (parsed.users || []).find((u: User) => u.id === 'usr-founder');
            return existingFounderUser || defUser;
          }
          const existing = (parsed.users || []).find((u: User) => u.id === defUser.id);
          return existing ? { ...defUser, ...existing } : defUser;
        });

        let finalWallets = { ...defaults.wallets };
        if (parsed.wallets && parsed.wallets['rsl-founder']) {
          finalWallets['rsl-founder'] = parsed.wallets['rsl-founder'];
        }

        // Ensure products have productCode, stock status, restock estimates
        const mergedProducts = (parsed.products && parsed.products.length > 0 ? parsed.products : defaults.products).map((p: Product, idx: number) => ({
          ...p,
          productCode: p.productCode || `MM-${1001 + idx}`,
          isStockOut: p.isStockOut !== undefined ? p.isStockOut : (p.stock !== undefined && p.stock <= 0),
          estimatedRestockDays: p.estimatedRestockDays || 3,
          estimatedRestockDate: p.estimatedRestockDate || 'In 3-5 days',
        }));

        this.data = {
          ...defaults,
          ...parsed,
          users: finalUsers,
          resellers: finalResellers,
          products: mergedProducts,
          wallets: finalWallets,
          settings: { ...defaults.settings, ...(parsed.settings || {}) },
        };
      } else {
        this.save();
      }
      this.isLoaded = true;

      // Attempt async cloud hydration in background
      FirebaseSyncService.loadFromCloud()
        .then((cloudData) => {
          if (cloudData) {
            this.data = {
              ...this.getDefaultData(),
              ...cloudData,
              wallets: { ...this.getDefaultData().wallets, ...(cloudData.wallets || {}) },
              settings: { ...this.getDefaultData().settings, ...(cloudData.settings || {}) },
            };
            this.saveLocal();
            console.log('Database synced and hydrated with Cloud Firestore');
          }
        })
        .catch((err) => {
          console.warn('Firebase initial cloud sync skipped:', err);
        });
    } catch (err) {
      console.error('Error loading database file, using fallback defaults:', err);
      this.data = this.getDefaultData();
    }
  }

  private saveLocal() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving local database:', err);
    }
  }

  public save() {
    this.saveLocal();
    // Non-blocking sync to Firebase Cloud Firestore
    FirebaseSyncService.saveToCloud(this.data).catch((err) => {
      console.warn('Background sync to Cloud Firestore skipped:', err);
    });
  }

  public resetToFreshSeed() {
    this.data = this.getDefaultData();
    this.save();
    return this.data;
  }

  // --- Users & Resellers ---
  public getUsers() {
    return this.data.users;
  }

  public getUserById(id: string) {
    return this.data.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserByPhone(phone: string) {
    if (!phone) return undefined;
    const clean = phone.replace(/[^0-9]/g, '');
    return this.data.users.find((u) => {
      if (!u.phone) return false;
      const uClean = u.phone.replace(/[^0-9]/g, '');
      return u.phone === phone || uClean === clean || (clean.length >= 10 && uClean.endsWith(clean.slice(-10)));
    });
  }

  public findUserOrReseller(query: string, password?: string) {
    if (!query) return { user: undefined, reseller: undefined };
    const qTrim = query.trim().toLowerCase();
    const cleanDigits = query.replace(/[^0-9]/g, '');

    // 1. Check exact email
    let user = this.data.users.find((u) => u.email && u.email.toLowerCase() === qTrim);

    // 2. Check phone
    if (!user && cleanDigits.length >= 7) {
      user = this.data.users.find((u) => {
        if (!u.phone) return false;
        const uClean = u.phone.replace(/[^0-9]/g, '');
        return uClean === cleanDigits || (cleanDigits.length >= 10 && uClean.endsWith(cleanDigits.slice(-10)));
      });
    }

    // 3. Check reseller by referral code
    let reseller = user ? this.getResellerByUserId(user.id) : undefined;
    if (!user) {
      reseller = this.data.resellers.find(
        (r) =>
          r.referralCode.toLowerCase() === qTrim ||
          r.storeName.toLowerCase() === qTrim ||
          (r.whatsappNumber && cleanDigits.length >= 7 && r.whatsappNumber.replace(/[^0-9]/g, '').endsWith(cleanDigits.slice(-10)))
      );
      if (reseller) {
        user = this.getUserById(reseller.userId);
      }
    }

    if (user && !reseller) {
      reseller = this.getResellerByUserId(user.id);
    }

    // If password provided and user has a stored password, check if it matches
    if (user && password && user.password && user.password.trim() !== '') {
      if (user.password !== password) {
        // Return null user if password mismatch
        return { user: undefined, reseller: undefined, passwordMismatch: true };
      }
    } else if (user && password && (!user.password || user.password === '')) {
      // Save password if user previously had none
      user.password = password;
      this.save();
    }

    return { user, reseller };
  }

  public getResellers() {
    return this.data.resellers;
  }

  public getAllResellersWithDetails() {
    const orders = this.data.orders || [];
    return this.data.resellers.map((r) => {
      const user = this.getUserById(r.userId);
      const resellerOrders = orders.filter((o) => o.resellerId === r.id);
      const delivered = resellerOrders.filter((o) => o.status === 'DELIVERED');
      const orderCount = delivered.length > 0 ? delivered.length : (r.deliveredOrdersCount || r.totalOrdersCount || 0);
      const totalProfitFromOrders = delivered.reduce((acc, o) => acc + (o.totalResellerProfit || 0), 0);
      const wallet = this.data.wallets[r.id];
      const totalProfit = totalProfitFromOrders > 0 ? totalProfitFromOrders : (r.totalProfitEarned || wallet?.totalEarned || r.totalProfitEarnedBdt || 0);
      const completedLessons = this.data.userLessonProgress[r.id] || [];

      // Calculate level details
      const levelNames: Record<number, string> = {
        1: 'Novice',
        2: 'Hustler',
        3: 'Seller',
        4: 'Pro Seller',
        5: 'Elite Master',
      };

      const xp = r.xp || 100;
      let nextLevelXp = 500;
      let prevLevelXp = 0;
      if (r.level === 2) { prevLevelXp = 500; nextLevelXp = 1500; }
      else if (r.level === 3) { prevLevelXp = 1500; nextLevelXp = 4000; }
      else if (r.level === 4) { prevLevelXp = 4000; nextLevelXp = 10000; }
      else if (r.level >= 5) { prevLevelXp = 10000; nextLevelXp = 25000; }

      const levelProgressPercent = Math.min(100, Math.max(5, Math.round(((xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100)));
      const xpToNextLevel = Math.max(0, nextLevelXp - xp);

      return {
        ...r,
        user,
        ownerName: user?.name || r.storeName,
        email: user?.email || '',
        levelName: levelNames[r.level || 1] || 'Novice',
        levelProgressPercent,
        xpToNextLevel,
        deliveredOrdersCount: orderCount,
        totalOrdersCount: orderCount,
        totalProfitEarned: totalProfit,
        totalProfitEarnedBdt: totalProfit,
        completedLessonsCount: completedLessons.length || (r.level >= 4 ? 3 : r.level >= 2 ? 2 : 1),
      };
    });
  }

  public getResellerById(id: string) {
    return this.data.resellers.find((r) => r.id === id);
  }

  public getResellerByUserId(userId: string) {
    return this.data.resellers.find((r) => r.userId === userId);
  }

  public getResellerByReferralCode(code: string) {
    if (!code) return undefined;
    return this.data.resellers.find(
      (r) => r.referralCode.trim().toLowerCase() === code.trim().toLowerCase()
    );
  }

  public createCustomer(user: Omit<User, 'id' | 'role' | 'createdAt'> & { password?: string }) {
    const id = `usr-cust-${Date.now()}`;
    const newUser: User = {
      ...user,
      id,
      role: 'CUSTOMER',
      password: user.password || undefined,
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public createReseller(data: {
    user: Omit<User, 'id' | 'role' | 'createdAt'> & { password?: string };
    storeName: string;
    facebookPage?: string;
    whatsappNumber: string;
    division: string;
    district: string;
    upazila: string;
    address: string;
    salesIntent: string;
    referredBy?: string;
    password?: string;
  }) {
    const userId = `usr-rsl-${Date.now()}`;
    const resellerId = `rsl-${Date.now().toString(36)}`;
    const referralCode = `RSL-${data.storeName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'BD'}${Math.floor(100 + Math.random() * 900)}`;

    const userPassword = data.password || data.user.password;

    const newUser: User = {
      ...data.user,
      id: userId,
      role: 'RESELLER',
      password: userPassword,
      createdAt: new Date().toISOString(),
    };

    const initialStatus = this.data.settings.autoApproveResellers ? 'ACTIVE' : 'PENDING';

    const newReseller: ResellerProfile = {
      id: resellerId,
      userId,
      storeName: data.storeName,
      facebookPage: data.facebookPage,
      whatsappNumber: data.whatsappNumber || data.user.phone,
      referralCode,
      status: initialStatus,
      isVerified: this.data.settings.autoApproveResellers,
      verificationFeePaid: false,
      password: userPassword,
      division: data.division,
      district: data.district,
      upazila: data.upazila,
      address: data.address,
      salesIntent: data.salesIntent,
      referredBy: data.referredBy,
      level: 1,
      xp: 100, // Welcome XP
      isAnonymousOnLeaderboard: false,
      createdAt: new Date().toISOString(),
    };

    // Initialize empty wallet
    this.data.wallets[resellerId] = {
      resellerId,
      availableBalance: 0,
      pendingBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      updatedAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);
    this.data.resellers.push(newReseller);

    // Audit log
    this.logAudit({
      action: 'RESELLER_REGISTER',
      actorId: userId,
      actorName: newUser.name,
      actorRole: 'RESELLER',
      targetType: 'RESELLER',
      targetId: resellerId,
      details: `Registered store "${data.storeName}" with referral code ${referralCode}`,
    });

    this.save();
    return { user: newUser, reseller: newReseller };
  }

  public updateResellerStatus(resellerId: string, status: ResellerProfile['status'], actor: User) {
    const reseller = this.getResellerById(resellerId);
    if (!reseller) throw new Error('Reseller not found');

    const prevStatus = reseller.status;
    reseller.status = status;
    if (status === 'ACTIVE') {
      reseller.isVerified = true;
    }

    this.logAudit({
      action: 'UPDATE_RESELLER_STATUS',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'RESELLER',
      targetId: resellerId,
      details: `Changed reseller status from ${prevStatus} to ${status}`,
    });

    this.save();
    return reseller;
  }

  // --- Products & Categories ---
  public getCategories() {
    return this.data.categories;
  }

  public getProducts() {
    return this.data.products;
  }

  public getProductById(id: string) {
    return this.data.products.find((p) => p.id === id);
  }

  public getProductBySlug(slug: string) {
    return this.data.products.find((p) => p.slug === slug);
  }

  public createProduct(product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'successfulSalesCount' | 'returnRatePercent'>, actor: User) {
    const id = `prod-${Date.now()}`;
    const productCode = product.productCode || `MM-${1001 + this.data.products.length}`;
    const newProduct: Product = {
      ...product,
      id,
      productCode,
      isStockOut: product.isStockOut || (product.stock !== undefined && product.stock <= 0),
      estimatedRestockDays: product.estimatedRestockDays || 3,
      estimatedRestockDate: product.estimatedRestockDate || 'In 3-5 days',
      rating: 5.0,
      reviewCount: 0,
      successfulSalesCount: 0,
      returnRatePercent: 0,
      createdAt: new Date().toISOString(),
    };
    this.data.products.unshift(newProduct);

    this.logAudit({
      action: 'CREATE_PRODUCT',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'PRODUCT',
      targetId: id,
      details: `Created product "${newProduct.name}" (${newProduct.productCode}) at wholesale ৳${newProduct.resellerPrice}`,
    });

    this.save();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>, actor: User) {
    const product = this.getProductById(id);
    if (!product) throw new Error('Product not found');

    Object.assign(product, updates);

    if (updates.stock !== undefined && updates.isStockOut === undefined) {
      product.isStockOut = updates.stock <= 0;
    }

    this.logAudit({
      action: 'UPDATE_PRODUCT',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'PRODUCT',
      targetId: id,
      details: `Updated product "${product.name}" (${product.productCode || id}) details/stock/pricing`,
    });

    this.save();
    return product;
  }

  public deleteProduct(id: string, actor: User) {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');

    const removed = this.data.products.splice(index, 1)[0];

    this.logAudit({
      action: 'DELETE_PRODUCT',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'PRODUCT',
      targetId: id,
      details: `Deleted product "${removed.name}" (Code: ${removed.productCode || id})`,
    });

    this.save();
    return { success: true, deletedId: id, product: removed };
  }

  public bulkCreateProducts(productsList: Array<Partial<Product>>, actor: User, replaceAll = false) {
    const inferCategory = (name: string): { category: string; slug: string } => {
      const lower = name.toLowerCase();
      if (lower.includes('ac ') || lower.includes('inverter') || lower.includes('refrigerator') || lower.includes('tv') || lower.includes('fan') || lower.includes('heater') || lower.includes('torch') || lower.includes('light') || lower.includes('camera') || lower.includes('headphone') || lower.includes('ear bud') || lower.includes('watch') || lower.includes('power bank') || lower.includes('speaker') || lower.includes('nebulizer') || lower.includes('usb')) {
        return { category: 'Electronics & Gadgets', slug: 'gadgets' };
      }
      if (lower.includes('grinder') || lower.includes('blender') || lower.includes('cooker') || lower.includes('kettle') || lower.includes('chopper') || lower.includes('slicer') || lower.includes('kitchen') || lower.includes('rack') || lower.includes('storage') || lower.includes('bottle') || lower.includes('box') || lower.includes('pot') || lower.includes('peeler') || lower.includes('egg') || lower.includes('dispenser')) {
        return { category: 'Kitchen & Dining', slug: 'kitchen' };
      }
      if (lower.includes('shaver') || lower.includes('trimmer') || lower.includes('massager') || lower.includes('hair') || lower.includes('facial') || lower.includes('face') || lower.includes('skin') || lower.includes('cream') || lower.includes('shampoo') || lower.includes('soap') || lower.includes('pedicure') || lower.includes('manicure') || lower.includes('spa') || lower.includes('oil') || lower.includes('therapy')) {
        return { category: 'Health & Beauty', slug: 'beauty' };
      }
      if (lower.includes('bag') || lower.includes('backpack') || lower.includes('wallet') || lower.includes('locket') || lower.includes('bracelet') || lower.includes('necklace') || lower.includes('ring') || lower.includes('umbrella') || lower.includes('shoe') || lower.includes('towel') || lower.includes('earring')) {
        return { category: 'Fashion & Accessories', slug: 'fashion' };
      }
      if (lower.includes('cleaner') || lower.includes('tape') || lower.includes('glue') || lower.includes('tool') || lower.includes('wrench') || lower.includes('screwdriver') || lower.includes('mop') || lower.includes('brush') || lower.includes('spray') || lower.includes('hook') || lower.includes('mat') || lower.includes('lock') || lower.includes('pipe') || lower.includes('patch')) {
        return { category: 'Home Improvement & Tools', slug: 'tools' };
      }
      if (lower.includes('baby') || lower.includes('kids') || lower.includes('toy') || lower.includes('potty') || lower.includes('bouncer') || lower.includes('diaper') || lower.includes('stroller')) {
        return { category: 'Baby & Kids', slug: 'kids' };
      }
      return { category: 'Home & Living', slug: 'home' };
    };

    const formattedProducts: Product[] = productsList.map((p, idx) => {
      const id = p.id || `prod-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
      const productCode = p.productCode || `MM-${1001 + idx}`;
      const resellerPrice = Math.round(Number(p.resellerPrice) || 0);
      const suggestedSellingPrice = Math.round(Number(p.suggestedSellingPrice) || (resellerPrice > 0 ? Math.round(resellerPrice * 1.5) : 500));
      const baseCost = Math.round(Number(p.baseCost) || Math.round(resellerPrice * 0.85));
      const oldPrice = p.oldPrice ? Math.round(Number(p.oldPrice)) : undefined;
      const discountAmount = p.discountAmount
        ? Math.round(Number(p.discountAmount))
        : (oldPrice && oldPrice > suggestedSellingPrice ? oldPrice - suggestedSellingPrice : undefined);

      const catInfo = inferCategory(p.name || '');
      const category = p.category || catInfo.category;
      const categorySlug = p.categorySlug || catInfo.slug;

      const slug = (p.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;

      const stock = p.stock !== undefined ? Number(p.stock) : 100;
      const isStockOut = p.isStockOut !== undefined ? p.isStockOut : stock <= 0;

      return {
        id,
        productCode,
        name: p.name || 'Unnamed Product',
        nameBn: p.nameBn || p.name || '',
        slug: p.slug || slug,
        category,
        categorySlug,
        baseCost,
        resellerPrice,
        suggestedSellingPrice,
        oldPrice,
        discountAmount,
        minSellingPrice: p.minSellingPrice || resellerPrice + 50,
        maxSellingPrice: p.maxSellingPrice || Math.round(suggestedSellingPrice * 1.5),
        stock,
        isStockOut,
        estimatedRestockDays: p.estimatedRestockDays || 3,
        estimatedRestockDate: p.estimatedRestockDate || 'In 3-5 days',
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
        description: p.description || '',
        features: Array.isArray(p.features) && p.features.length > 0
          ? p.features
          : ['১০০% অরিজিনাল ও প্রিমিয়াম কোয়ালিটি', 'সারাদেশে হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি', '৭ দিনের রিটার্ন ও রিপ্লেসমেন্ট গ্যারান্টি'],
        specifications: p.specifications || {
          'ডেলিভারি মাধ্যম': 'ক্যাশ অন ডেলিভারি (Steadfast / Pathao)',
          'ওয়ারেন্টি': '৭ দিনের চেক ও রিপ্লেসমেন্ট ওয়ারেন্টি',
        },
        rating: p.rating || 5.0,
        reviewCount: p.reviewCount || Math.floor(Math.random() * 25) + 5,
        successfulSalesCount: p.successfulSalesCount || Math.floor(Math.random() * 50) + 12,
        returnRatePercent: p.returnRatePercent || 1.2,
        isTrending: p.isTrending !== undefined ? p.isTrending : Math.random() > 0.65,
        isBestSeller: p.isBestSeller !== undefined ? p.isBestSeller : Math.random() > 0.7,
        deliveryDaysMin: p.deliveryDaysMin || 2,
        deliveryDaysMax: p.deliveryDaysMax || 4,
        createdAt: p.createdAt || new Date().toISOString(),
      };
    });

    if (replaceAll) {
      this.data.products = formattedProducts;
    } else {
      this.data.products = [...formattedProducts, ...this.data.products];
    }

    // Refresh Category counts
    const categoryMap = new Map<string, { count: number; slug: string }>();
    this.data.products.forEach((p) => {
      const current = categoryMap.get(p.category) || { count: 0, slug: p.categorySlug };
      current.count += 1;
      categoryMap.set(p.category, current);
    });

    this.data.categories = Array.from(categoryMap.entries()).map(([name, val], index) => {
      const existing = this.data.categories.find((c) => c.name === name);
      return {
        id: existing?.id || `cat-${index + 1}`,
        name,
        nameBn: existing?.nameBn || name,
        slug: val.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: existing?.icon || 'Package',
        itemCount: val.count,
      };
    });

    this.logAudit({
      action: 'BULK_CREATE_PRODUCTS',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'PRODUCT',
      targetId: `bulk-${formattedProducts.length}`,
      details: `${replaceAll ? 'Replaced catalog with' : 'Imported'} ${formattedProducts.length} products via bulk CSV uploader`,
    });

    this.save();
    return { count: formattedProducts.length, products: this.data.products };
  }

  // --- Orders & Profit Engine ---
  public getOrders() {
    return this.data.orders;
  }

  public getOrderById(id: string) {
    return this.data.orders.find((o) => o.id === id);
  }

  public getOrdersByReseller(resellerId: string) {
    return this.data.orders.filter((o) => o.resellerId === resellerId);
  }

  public getOrdersByCustomer(phone: string) {
    return this.data.orders.filter((o) => o.customerPhone === phone);
  }

  /**
   * Create an order (from Reseller manual order creation or customer storefront)
   */
  public createOrder(input: {
    customerId?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    division: string;
    district: string;
    upazila: string;
    address: string;
    postalCode?: string;
    customerNote?: string;
    resellerNote?: string;
    resellerId?: string;
    items: {
      productId: string;
      quantity: number;
      unitSellingPrice?: number; // Custom retail price chosen by reseller
    }[];
    paymentMethod: Order['paymentMethod'];
    courier?: Order['courier'];
  }) {
    const orderId = `ord-${Date.now()}`;
    const nextOrderNum = 3001 + this.data.orders.length;
    const orderNumber = `#${nextOrderNum}`;

    let reseller: ResellerProfile | undefined;
    if (input.resellerId) {
      reseller = this.getResellerById(input.resellerId);
    }

    const deliveryFee = ProfitEngine.getDeliveryFee(input.division);
    const packagingFee = this.data.settings.packagingChargeBdt ?? 30;
    const orderItems: Order['items'] = [];
    let subtotal = 0;
    let totalResellerProfit = 0;
    let totalPlatformMargin = 0;

    for (const itemInput of input.items) {
      const product = this.getProductById(itemInput.productId);
      if (!product) throw new Error(`Product ${itemInput.productId} not found`);

      const qty = Math.max(1, itemInput.quantity);
      // Selling price default to product suggested selling price if not provided
      const unitSellingPrice = itemInput.unitSellingPrice && itemInput.unitSellingPrice >= product.resellerPrice
        ? itemInput.unitSellingPrice
        : product.suggestedSellingPrice;

      const calc = ProfitEngine.calculateItemProfit(
        product.baseCost,
        product.resellerPrice,
        unitSellingPrice,
        qty,
        this.data.settings.platformFeePercent
      );

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productImage: product.images[0] || '',
        quantity: qty,
        baseCost: product.baseCost,
        resellerPrice: product.resellerPrice,
        unitSellingPrice,
        resellerProfit: calc.netResellerProfit,
        platformMargin: calc.platformMargin,
      });

      subtotal += calc.totalCustomerPrice;
      totalResellerProfit += calc.netResellerProfit;
      totalPlatformMargin += calc.platformMargin;
    }

    const totalAmount = subtotal + deliveryFee + packagingFee;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerId: input.customerId,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      division: input.division,
      district: input.district,
      upazila: input.upazila,
      address: input.address,
      postalCode: input.postalCode,
      customerNote: input.customerNote,
      resellerNote: input.resellerNote,
      resellerId: reseller?.id,
      resellerStoreName: reseller?.storeName,
      resellerReferralCode: reseller?.referralCode,
      items: orderItems,
      itemCount: orderItems.reduce((acc, it) => acc + it.quantity, 0),
      subtotal,
      deliveryFee,
      packagingFee,
      platformFee: 0,
      totalAmount,
      totalResellerProfit,
      totalPlatformMargin,
      profitStatus: reseller ? 'PENDING' : 'NONE',
      paymentMethod: input.paymentMethod || 'COD',
      paymentStatus: 'UNPAID',
      courier: input.courier || 'STEADFAST',
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'PENDING',
      statusHistory: [
        {
          status: 'PENDING',
          timestamp: new Date().toISOString(),
          note: reseller ? `Manual order submitted by reseller (${reseller.storeName})` : 'Direct customer storefront checkout',
          updatedBy: reseller?.storeName || input.customerName,
        },
      ],
      createdAt: new Date().toISOString(),
      isDirectCustomerOrder: !reseller,
    };

    this.data.orders.unshift(newOrder);

    // If order has a reseller, increase reseller's pending wallet balance
    if (reseller && totalResellerProfit > 0) {
      const wallet = this.getWallet(reseller.id);
      wallet.pendingBalance += totalResellerProfit;
      wallet.updatedAt = new Date().toISOString();
    }

    // Check potential fraud alerts
    const recentOrdersWithPhone = this.data.orders.filter(
      (o) => o.customerPhone === input.customerPhone && o.id !== orderId
    );
    if (recentOrdersWithPhone.length >= 3) {
      this.data.fraudAlerts.unshift({
        id: `fa-${Date.now()}`,
        severity: 'MEDIUM',
        type: 'RAPID_ORDERS',
        resellerId: reseller?.id,
        orderId,
        message: `Phone number ${input.customerPhone} placed ${recentOrdersWithPhone.length + 1} orders recently. Please verify before shipping.`,
        createdAt: new Date().toISOString(),
        status: 'PENDING_REVIEW',
      });
    }

    this.save();
    return newOrder;
  }

  /**
   * Update Order Status through Fulfillment Lifecycle
   * When DELIVERED -> Profit becomes AVAILABLE in wallet, adds XP, records transaction ledger
   * When RETURNED / CANCELLED -> Reverses pending/available profit safely
   */
  public updateOrderStatus(orderId: string, newStatus: Order['status'], note: string, actor: User) {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error('Order not found');

    const prevStatus = order.status;
    if (prevStatus === newStatus) return order;

    order.status = newStatus;
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated from ${prevStatus} to ${newStatus}`,
      updatedBy: actor.name,
    });

    const now = new Date().toISOString();

    // Handling DELIVERED status transition
    if (newStatus === 'DELIVERED') {
      order.deliveredAt = now;
      order.settledAt = now;
      order.paymentStatus = 'PAID';

      if (order.resellerId && order.totalResellerProfit > 0 && order.profitStatus !== 'AVAILABLE') {
        order.profitStatus = 'AVAILABLE';
        const wallet = this.getWallet(order.resellerId);

        // Move from pending to available
        wallet.pendingBalance = Math.max(0, wallet.pendingBalance - order.totalResellerProfit);
        wallet.availableBalance += order.totalResellerProfit;
        wallet.totalEarned += order.totalResellerProfit;
        wallet.updatedAt = now;

        // Create immutable transaction ledger record
        const tx: WalletTransaction = {
          id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          resellerId: order.resellerId,
          type: 'SALE_PROFIT',
          amount: order.totalResellerProfit,
          balanceAfter: wallet.availableBalance,
          currency: 'BDT',
          referenceType: 'ORDER',
          referenceId: order.id,
          status: 'COMPLETED',
          description: `Profit credited for delivered Order #${order.orderNumber}`,
          createdAt: now,
        };
        this.data.transactions.unshift(tx);

        // Reward Reseller XP
        this.awardResellerXp(order.resellerId, 250, 'Successful Delivered Order');

        // Increment successful sales count on products
        for (const item of order.items) {
          const product = this.getProductById(item.productId);
          if (product) {
            product.successfulSalesCount += item.quantity;
          }
        }
      }
    }

    // Handling RETURNED status transition
    if (newStatus === 'RETURNED') {
      if (order.resellerId && order.totalResellerProfit > 0) {
        const wallet = this.getWallet(order.resellerId);
        const profit = order.totalResellerProfit;

        if (order.profitStatus === 'AVAILABLE') {
          // Reverse from available balance
          wallet.availableBalance = Math.max(0, wallet.availableBalance - profit);
          wallet.totalEarned = Math.max(0, wallet.totalEarned - profit);

          const tx: WalletTransaction = {
            id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            resellerId: order.resellerId,
            type: 'RETURN_REVERSAL',
            amount: -profit,
            balanceAfter: wallet.availableBalance,
            currency: 'BDT',
            referenceType: 'ORDER',
            referenceId: order.id,
            status: 'COMPLETED',
            description: `Reversal for returned Order #${order.orderNumber}`,
            createdAt: now,
          };
          this.data.transactions.unshift(tx);
        } else if (order.profitStatus === 'PENDING') {
          wallet.pendingBalance = Math.max(0, wallet.pendingBalance - profit);
        }

        order.profitStatus = 'REVERSED';
        wallet.updatedAt = now;
      }
    }

    // Handling CANCELLED status transition
    if (newStatus === 'CANCELLED') {
      if (order.resellerId && order.totalResellerProfit > 0 && order.profitStatus === 'PENDING') {
        const wallet = this.getWallet(order.resellerId);
        wallet.pendingBalance = Math.max(0, wallet.pendingBalance - order.totalResellerProfit);
        order.profitStatus = 'REVERSED';
        wallet.updatedAt = now;
      }
    }

    this.logAudit({
      action: 'UPDATE_ORDER_STATUS',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'ORDER',
      targetId: orderId,
      details: `Moved order #${order.orderNumber} to ${newStatus}. Note: ${note}`,
    });

    this.save();
    return order;
  }

  // --- Wallet & Withdrawals ---
  public getWallet(resellerId: string): Wallet {
    if (!this.data.wallets[resellerId]) {
      this.data.wallets[resellerId] = {
        resellerId,
        availableBalance: 0,
        pendingBalance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        updatedAt: new Date().toISOString(),
      };
    }
    return this.data.wallets[resellerId];
  }

  public getTransactions(resellerId?: string) {
    if (resellerId) {
      return this.data.transactions.filter((t) => t.resellerId === resellerId);
    }
    return this.data.transactions;
  }

  public getWithdrawals(resellerId?: string) {
    if (resellerId) {
      return this.data.withdrawals.filter((w) => w.resellerId === resellerId);
    }
    return this.data.withdrawals;
  }

  public requestWithdrawal(input: {
    resellerId: string;
    amount: number;
    method: 'BKASH' | 'NAGAD' | 'BANK';
    accountNumber: string;
    accountName?: string;
    bankName?: string;
    branchName?: string;
    routingNumber?: string;
  }) {
    const reseller = this.getResellerById(input.resellerId);
    if (!reseller) throw new Error('Reseller not found');

    const wallet = this.getWallet(input.resellerId);
    const minAmount = this.data.settings.minWithdrawalAmountBdt;

    if (input.amount < minAmount) {
      throw new Error(`Minimum withdrawal amount is ৳${minAmount}`);
    }

    if (input.amount > wallet.availableBalance) {
      throw new Error(`Insufficient available balance. You have ৳${wallet.availableBalance}`);
    }

    const withdrawalId = `wd-${Date.now()}`;
    const newWithdrawal: WithdrawalRequest = {
      id: withdrawalId,
      resellerId: input.resellerId,
      resellerName: reseller.storeName,
      resellerStoreName: reseller.storeName,
      amount: input.amount,
      method: input.method,
      accountNumber: input.accountNumber,
      accountName: input.accountName,
      bankName: input.bankName,
      branchName: input.branchName,
      routingNumber: input.routingNumber,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
    };

    // Deduct available balance immediately into pending withdrawal
    wallet.availableBalance -= input.amount;
    wallet.updatedAt = new Date().toISOString();

    this.data.withdrawals.unshift(newWithdrawal);

    this.logAudit({
      action: 'REQUEST_WITHDRAWAL',
      actorId: reseller.userId,
      actorName: reseller.storeName,
      actorRole: 'RESELLER',
      targetType: 'WITHDRAWAL',
      targetId: withdrawalId,
      details: `Requested ৳${input.amount} payout via ${input.method} to ${input.accountNumber}`,
    });

    this.save();
    return newWithdrawal;
  }

  public updateWithdrawalStatus(
    withdrawalId: string,
    status: WithdrawalRequest['status'],
    adminNote: string,
    transactionId: string | undefined,
    actor: User
  ) {
    const withdrawal = this.data.withdrawals.find((w) => w.id === withdrawalId);
    if (!withdrawal) throw new Error('Withdrawal request not found');

    const wallet = this.getWallet(withdrawal.resellerId);
    const now = new Date().toISOString();

    withdrawal.status = status;
    withdrawal.adminNote = adminNote;
    if (transactionId) withdrawal.transactionId = transactionId;

    if (status === 'PAID') {
      withdrawal.paidAt = now;
      wallet.totalWithdrawn += withdrawal.amount;
      wallet.updatedAt = now;

      // Add immutable ledger entry
      const tx: WalletTransaction = {
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        resellerId: withdrawal.resellerId,
        type: 'WITHDRAWAL',
        amount: -withdrawal.amount,
        balanceAfter: wallet.availableBalance,
        currency: 'BDT',
        referenceType: 'WITHDRAWAL',
        referenceId: withdrawal.id,
        status: 'COMPLETED',
        description: `Withdrawal payout to ${withdrawal.method} (${withdrawal.accountNumber}) ${transactionId ? `[TrxID: ${transactionId}]` : ''}`,
        createdAt: now,
      };
      this.data.transactions.unshift(tx);
    } else if (status === 'REJECTED' || status === 'CANCELLED') {
      // Refund balance back to available
      wallet.availableBalance += withdrawal.amount;
      wallet.updatedAt = now;
    }

    this.logAudit({
      action: 'UPDATE_WITHDRAWAL',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'WITHDRAWAL',
      targetId: withdrawalId,
      details: `Updated withdrawal ৳${withdrawal.amount} to ${status}. Note: ${adminNote}`,
    });

    this.save();
    return withdrawal;
  }

  // --- Gamification, Leaderboard & Academy ---
  public awardResellerXp(resellerId: string, amount: number, reason: string) {
    const reseller = this.getResellerById(resellerId);
    if (!reseller) return;

    reseller.xp += amount;
    // Calculate Level
    if (reseller.xp >= 10000) reseller.level = 5;
    else if (reseller.xp >= 4000) reseller.level = 4;
    else if (reseller.xp >= 1500) reseller.level = 3;
    else if (reseller.xp >= 500) reseller.level = 2;
    else reseller.level = 1;

    this.save();
    return reseller;
  }

  public awardResellerXpManual(resellerId: string, amount: number, reason: string, actor: User) {
    const reseller = this.getResellerById(resellerId);
    if (!reseller) throw new Error('Reseller not found');

    const prevXp = reseller.xp;
    const prevLevel = reseller.level;

    reseller.xp += amount;
    if (reseller.xp < 0) reseller.xp = 0;

    // Calculate Level
    if (reseller.xp >= 10000) reseller.level = 5;
    else if (reseller.xp >= 4000) reseller.level = 4;
    else if (reseller.xp >= 1500) reseller.level = 3;
    else if (reseller.xp >= 500) reseller.level = 2;
    else reseller.level = 1;

    const leveledUp = reseller.level > prevLevel;

    this.logAudit({
      action: 'AWARD_MANUAL_XP',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'RESELLER',
      targetId: resellerId,
      details: `Awarded +${amount} XP to ${reseller.storeName} (${reason}). New XP: ${reseller.xp}, Level: ${reseller.level}`,
    });

    this.save();
    return {
      reseller,
      prevXp,
      newXp: reseller.xp,
      prevLevel,
      newLevel: reseller.level,
      leveledUp,
      amount,
      reason,
    };
  }

  public getLeaderboard(period: 'weekly' | 'monthly' | 'allTime' = 'allTime'): LeaderboardEntry[] {
    const deliveredOrders = this.data.orders.filter((o) => o.status === 'DELIVERED' && o.resellerId);
    const resellerStats: Record<string, { sales: number; profit: number; deliveries: number }> = {};

    for (const r of this.data.resellers) {
      const defaultProfit = r.totalProfitEarned || this.data.wallets[r.id]?.totalEarned || 0;
      const defaultDeliveries = r.deliveredOrdersCount || (r.level >= 4 ? 650 : r.level >= 2 ? 150 : 25);
      const defaultSales = Math.round(defaultProfit * 3.8);
      resellerStats[r.id] = { sales: defaultSales, profit: defaultProfit, deliveries: defaultDeliveries };
    }

    for (const order of deliveredOrders) {
      if (order.resellerId && resellerStats[order.resellerId]) {
        resellerStats[order.resellerId].sales += order.subtotal;
        resellerStats[order.resellerId].profit += order.totalResellerProfit;
        resellerStats[order.resellerId].deliveries += 1;
      }
    }

    const entries: LeaderboardEntry[] = this.data.resellers.map((r) => {
      const user = this.getUserById(r.userId);
      const stats = resellerStats[r.id] || { sales: 0, profit: 0, deliveries: 0 };
      const levelTitles = ['', 'Beginner 🌱', 'Hustler 🔥', 'Seller ⚡', 'Pro Seller 🚀', 'Elite Master 👑'];

      return {
        rank: 1,
        resellerId: r.id,
        displayName: r.isAnonymousOnLeaderboard ? 'Anonymous Seller' : r.storeName,
        storeName: r.storeName,
        avatar: user?.avatar,
        salesCount: stats.deliveries,
        profitAmount: stats.profit,
        successfulDeliveries: stats.deliveries,
        level: r.level,
        levelTitle: levelTitles[r.level] || 'Seller',
        xp: r.xp,
        isFounder: user?.isFounder || r.id === 'rsl-founder',
        streakDays: Math.min(14, Math.max(1, Math.floor(stats.deliveries / 50) + 1)),
        badges: r.level >= 4 ? ['⚡ Top Seller', '⭐ Verified', '🏆 500+ Orders'] : r.level >= 3 ? ['⚡ Top Seller', '⭐ Verified'] : ['🌱 Active Reseller'],
      };
    });

    // Sort strictly by profit then sales
    entries.sort((a, b) => b.profitAmount - a.profitAmount || b.salesCount - a.salesCount || b.xp - a.xp);

    entries.forEach((e, idx) => {
      e.rank = idx + 1;
    });

    return entries;
  }

  public getAchievements(resellerId?: string) {
    const list = this.data.achievements;
    if (!resellerId) return { achievements: list, unlocked: [] };

    const userUnlocked = this.data.userAchievements[resellerId] || [];
    return {
      achievements: list,
      unlocked: userUnlocked,
    };
  }

  public getWeeklyChallenges(resellerId?: string) {
    const challenges = this.data.weeklyChallenges;
    if (!resellerId) return challenges;

    const resellerOrders = this.data.orders.filter(
      (o) => o.resellerId === resellerId && o.status === 'DELIVERED'
    );

    return challenges.map((c) => {
      let progress = 0;
      if (c.metric === 'DELIVERIES') {
        progress = resellerOrders.length;
      } else if (c.metric === 'SALES_BDT') {
        progress = resellerOrders.reduce((acc, o) => acc + o.subtotal, 0);
      }
      return {
        ...c,
        currentProgress: progress,
        isCompleted: progress >= c.targetCount,
      };
    });
  }

  public createChallenge(
    challengeInput: Omit<WeeklyChallenge, 'id' | 'currentProgress' | 'isCompleted'>,
    actor: User
  ) {
    const id = `chal-${Date.now()}`;
    const newChallenge: WeeklyChallenge = {
      ...challengeInput,
      id,
    };
    this.data.weeklyChallenges.unshift(newChallenge);

    this.logAudit({
      action: 'CREATE_CHALLENGE',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'CHALLENGE',
      targetId: id,
      details: `Created ${challengeInput.frequency || 'Weekly'} challenge: "${challengeInput.title}" with +${challengeInput.rewardXp} XP reward`,
    });

    this.save();
    return newChallenge;
  }

  public deleteChallenge(challengeId: string, actor: User) {
    const index = this.data.weeklyChallenges.findIndex((c) => c.id === challengeId);
    if (index === -1) {
      throw new Error('Challenge not found');
    }
    const [deleted] = this.data.weeklyChallenges.splice(index, 1);

    this.logAudit({
      action: 'DELETE_CHALLENGE',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'CHALLENGE',
      targetId: challengeId,
      details: `Deleted challenge "${deleted.title}" (Reward: +${deleted.rewardXp} XP)`,
    });

    this.save();
    return { success: true, message: 'Challenge deleted successfully', deletedChallenge: deleted };
  }

  public getAcademyLessons(resellerId?: string) {
    const lessons = this.data.academyLessons;
    const completedIds = resellerId ? this.data.userLessonProgress[resellerId] || [] : [];

    return lessons.map((l) => ({
      ...l,
      isCompleted: completedIds.includes(l.id),
    }));
  }

  public createAcademyLesson(
    lessonInput: Omit<AcademyLesson, 'id' | 'isCompleted'>,
    actor: User
  ) {
    const id = `les-${Date.now()}`;
    // Extract YouTube embed ID if youtubeUrl is provided
    let videoEmbedId = lessonInput.videoEmbedId;
    if (lessonInput.youtubeUrl && !videoEmbedId) {
      const match = lessonInput.youtubeUrl.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
      );
      videoEmbedId = match ? match[1] : lessonInput.youtubeUrl;
    }

    const newLesson: AcademyLesson = {
      ...lessonInput,
      id,
      videoEmbedId,
      videoUrl: lessonInput.youtubeUrl || lessonInput.videoUrl,
    };

    this.data.academyLessons.push(newLesson);

    this.logAudit({
      action: 'CREATE_ACADEMY_LESSON',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'ACADEMY',
      targetId: id,
      details: `Added new Academy video lesson: "${newLesson.title}" (${newLesson.courseTitle}) with +${newLesson.xpReward} XP reward`,
    });

    this.save();
    return newLesson;
  }

  public deleteAcademyLesson(lessonId: string, actor: User) {
    const index = this.data.academyLessons.findIndex((l) => l.id === lessonId);
    if (index === -1) {
      throw new Error('Academy lesson not found');
    }
    const [deleted] = this.data.academyLessons.splice(index, 1);

    // Clean user lesson progress
    for (const resellerId in this.data.userLessonProgress) {
      this.data.userLessonProgress[resellerId] = this.data.userLessonProgress[resellerId].filter(
        (id) => id !== lessonId
      );
    }

    this.logAudit({
      action: 'DELETE_ACADEMY_LESSON',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'ACADEMY',
      targetId: lessonId,
      details: `Deleted Academy lesson "${deleted.title}" (${deleted.courseTitle})`,
    });

    this.save();
    return { success: true, message: 'Academy lesson deleted successfully', deletedLesson: deleted };
  }

  public submitResellerFee(
    resellerId: string,
    payment: {
      method: 'BKASH' | 'NAGAD' | 'ROCKET';
      senderPhone: string;
      trxId: string;
      amount: number;
    }
  ) {
    const reseller = this.getResellerById(resellerId);
    if (!reseller) throw new Error('Reseller not found');

    reseller.verificationPayment = {
      ...payment,
      submittedAt: new Date().toISOString(),
    };
    reseller.status = 'PENDING';
    reseller.verificationFeePaid = true;

    this.logAudit({
      action: 'SUBMIT_RESELLER_FEE',
      actorId: reseller.userId,
      actorName: reseller.storeName,
      actorRole: 'RESELLER',
      targetType: 'RESELLER',
      targetId: reseller.id,
      details: `Submitted 500 TK verification fee via ${payment.method} (TrxID: ${payment.trxId})`,
    });

    this.save();
    return reseller;
  }

  public approveResellerFree(resellerId: string, actor: User) {
    const reseller = this.getResellerById(resellerId);
    if (!reseller) throw new Error('Reseller not found');

    reseller.status = 'ACTIVE';
    reseller.isVerified = true;
    reseller.adminApprovedFree = true;

    this.logAudit({
      action: 'APPROVE_RESELLER_FREE',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'RESELLER',
      targetId: reseller.id,
      details: `Admin freely verified & activated reseller "${reseller.storeName}" with 0 fee requirement`,
    });

    this.save();
    return reseller;
  }

  public verifyResellerPayment(
    resellerId: string,
    approved: boolean,
    adminNote: string,
    actor: User
  ) {
    const reseller = this.getResellerById(resellerId);
    if (!reseller) throw new Error('Reseller not found');

    if (approved) {
      reseller.status = 'ACTIVE';
      reseller.isVerified = true;
      reseller.verificationFeePaid = true;
      if (reseller.verificationPayment) {
        reseller.verificationPayment.verifiedAt = new Date().toISOString();
        reseller.verificationPayment.adminNote = adminNote || 'Verified 500 TK payment received';
      }
    } else {
      reseller.status = 'VERIFICATION_REQUIRED';
      if (reseller.verificationPayment) {
        reseller.verificationPayment.adminNote = adminNote || 'Payment verification failed / invalid TrxID';
      }
    }

    this.logAudit({
      action: approved ? 'VERIFY_PAYMENT_APPROVE' : 'VERIFY_PAYMENT_REJECT',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'RESELLER',
      targetId: reseller.id,
      details: `${approved ? 'Approved' : 'Rejected'} 500 TK payment verification. Note: ${adminNote}`,
    });

    this.save();
    return reseller;
  }

  public markLessonComplete(resellerId: string, lessonId: string) {
    if (!this.data.userLessonProgress[resellerId]) {
      this.data.userLessonProgress[resellerId] = [];
    }
    if (!this.data.userLessonProgress[resellerId].includes(lessonId)) {
      this.data.userLessonProgress[resellerId].push(lessonId);
      const lesson = this.data.academyLessons.find((l) => l.id === lessonId);
      if (lesson) {
        this.awardResellerXp(resellerId, lesson.xpReward, `Completed lesson: ${lesson.title}`);
      }
      this.save();
    }
    return this.data.userLessonProgress[resellerId];
  }

  // --- Referrals & Clicks ---
  public trackReferralClick(code: string) {
    if (!code) return 0;
    const clean = code.trim().toUpperCase();
    this.data.referralClicks[clean] = (this.data.referralClicks[clean] || 0) + 1;
    this.save();
    return this.data.referralClicks[clean];
  }

  public getReferralClicks(code: string) {
    return this.data.referralClicks[code.trim().toUpperCase()] || 0;
  }

  // --- Settings & Audit ---
  public getSettings() {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<PlatformSettings>, actor: User) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.logAudit({
      action: 'UPDATE_SETTINGS',
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      targetType: 'SETTINGS',
      targetId: 'platform_settings',
      details: `Updated platform configurations`,
    });
    this.save();
    return this.data.settings;
  }

  public getAuditLogs() {
    return this.data.auditLogs;
  }

  public getFraudAlerts() {
    return this.data.fraudAlerts;
  }

  public logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(newLog);
    // Keep max 200 logs in file
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    }
  }
}

export const db = new Database();
