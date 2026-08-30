export interface BDDistrict {
  name: string;
  nameBn: string;
  upazilas: string[];
}

export interface BDDivision {
  name: string;
  nameBn: string;
  districts: Record<string, BDDistrict>;
}

export const BANGLADESH_DIVISIONS: Record<string, BDDivision> = {
  Dhaka: {
    name: 'Dhaka',
    nameBn: 'ঢাকা',
    districts: {
      Dhaka: {
        name: 'Dhaka',
        nameBn: 'ঢাকা',
        upazilas: [
          'Dhanmondi',
          'Gulshan',
          'Banani',
          'Mirpur',
          'Uttara',
          'Mohammadpur',
          'Badda',
          'Motijheel',
          'Old Dhaka',
          'Khilgaon',
          'Rampura',
          'Savar',
          'Keraniganj',
          'Dhamrai',
        ],
      },
      Gazipur: {
        name: 'Gazipur',
        nameBn: 'গাজীপুর',
        upazilas: ['Gazipur Sadar', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj', 'Tongi'],
      },
      Narayanganj: {
        name: 'Narayanganj',
        nameBn: 'নারায়ণগঞ্জ',
        upazilas: ['Narayanganj Sadar', 'Bandar', 'Rupganj', 'Sonargaon', 'Araihazar'],
      },
      Tangail: {
        name: 'Tangail',
        nameBn: 'টাঙ্গাইল',
        upazilas: ['Tangail Sadar', 'Mirzapur', 'Ghatail', 'Madhupur', 'Kalihati', 'Sakhipur'],
      },
      Narsingdi: {
        name: 'Narsingdi',
        nameBn: 'নরসিংদী',
        upazilas: ['Narsingdi Sadar', 'Palash', 'Shibpur', 'Monohardi', 'Raipura', 'Belabo'],
      },
      Manikganj: {
        name: 'Manikganj',
        nameBn: 'মানিকগঞ্জ',
        upazilas: ['Manikganj Sadar', 'Singair', 'Saturia', 'Shivalaya', 'Ghior'],
      },
      Faridpur: {
        name: 'Faridpur',
        nameBn: 'ফরিদপুর',
        upazilas: ['Faridpur Sadar', 'Boalmari', 'Bhanga', 'Madhukhali', 'Nagarkanda'],
      },
    },
  },
  Chittagong: {
    name: 'Chittagong',
    nameBn: 'চট্টগ্রাম',
    districts: {
      Chittagong: {
        name: 'Chittagong',
        nameBn: 'চট্টগ্রাম',
        upazilas: [
          'Panchlaish',
          'Kotwali',
          'Agrabad',
          'Khulshi',
          'Halishahar',
          'Sitakunda',
          'Mirsharai',
          'Hathazari',
          'Patiya',
          'Raozan',
        ],
      },
      CoxsBazar: {
        name: 'Cox\'s Bazar',
        nameBn: 'কক্সবাজার',
        upazilas: ['Cox\'s Bazar Sadar', 'Teknaf', 'Ukhia', 'Chakaria', 'Ramu', 'Maheshkhali'],
      },
      Comilla: {
        name: 'Cumilla',
        nameBn: 'কুমিল্লা',
        upazilas: ['Cumilla Adarsha Sadar', 'Laksam', 'Daudkandi', 'Debidwar', 'Burichang', 'Chandina'],
      },
      Feni: {
        name: 'Feni',
        nameBn: 'ফেনী',
        upazilas: ['Feni Sadar', 'Daganbhuiyan', 'Chhagalnaiya', 'Parshuram', 'Sonagazi'],
      },
      Brahmanbaria: {
        name: 'Brahmanbaria',
        nameBn: 'ব্রাহ্মণবাড়িয়া',
        upazilas: ['Brahmanbaria Sadar', 'Kasba', 'Nabinagar', 'Ashuganj', 'Sarail'],
      },
      Noakhali: {
        name: 'Noakhali',
        nameBn: 'নোয়াখালী',
        upazilas: ['Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Companyganj', 'Senbagh'],
      },
    },
  },
  Rajshahi: {
    name: 'Rajshahi',
    nameBn: 'রাজশাহী',
    districts: {
      Rajshahi: {
        name: 'Rajshahi',
        nameBn: 'রাজশাহী',
        upazilas: ['Boalia', 'Motihar', 'Rajpara', 'Paba', 'Godagari', 'Tanore', 'Bagha', 'Charghat'],
      },
      Bogra: {
        name: 'Bogura',
        nameBn: 'বগুড়া',
        upazilas: ['Bogura Sadar', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Gabtali', 'Dhunat'],
      },
      Pabna: {
        name: 'Pabna',
        nameBn: 'পাবনা',
        upazilas: ['Pabna Sadar', 'Ishwardi', 'Chatmohar', 'Bera', 'Santhia'],
      },
      Sirajganj: {
        name: 'Sirajganj',
        nameBn: 'সিরাজগঞ্জ',
        upazilas: ['Sirajganj Sadar', 'Ullapara', 'Shahjadpur', 'Belkuchi', 'Kazipur'],
      },
      Naogaon: {
        name: 'Naogaon',
        nameBn: 'নওগাঁ',
        upazilas: ['Naogaon Sadar', 'Patnitala', 'Manda', 'Mohadevpur', 'Niamatpur'],
      },
    },
  },
  Khulna: {
    name: 'Khulna',
    nameBn: 'খুলনা',
    districts: {
      Khulna: {
        name: 'Khulna',
        nameBn: 'খুলনা',
        upazilas: ['Khulna Sadar', 'Sonadanga', 'Daulatpur', 'Khalishpur', 'Dumuria', 'Rupsha', 'Phultala'],
      },
      Jessore: {
        name: 'Jashore',
        nameBn: 'যশোর',
        upazilas: ['Jashore Sadar', 'Jhikargachha', 'Manirampur', 'Bagherpara', 'Abhaynagar'],
      },
      Kushtia: {
        name: 'Kushtia',
        nameBn: 'কুষ্টিয়া',
        upazilas: ['Kushtia Sadar', 'Kumarkhali', 'Mirpur', 'Bheramara', 'Khoksa'],
      },
      Satkhira: {
        name: 'Satkhira',
        nameBn: 'সাতক্ষীরা',
        upazilas: ['Satkhira Sadar', 'Kalaroa', 'Tala', 'Shyamnagar', 'Assasuni'],
      },
    },
  },
  Sylhet: {
    name: 'Sylhet',
    nameBn: 'সিলেট',
    districts: {
      Sylhet: {
        name: 'Sylhet',
        nameBn: 'সিলেট',
        upazilas: ['Kotwali', 'Shah Paran', 'South Surma', 'Golapganj', 'Beanibazar', 'Osmani Nagar'],
      },
      Moulvibazar: {
        name: 'Moulvibazar',
        nameBn: 'মৌলভীবাজার',
        upazilas: ['Moulvibazar Sadar', 'Sreemangal', 'Kulaura', 'Barlekha', 'Kamalganj'],
      },
      Habiganj: {
        name: 'Habiganj',
        nameBn: 'হবিগঞ্জ',
        upazilas: ['Habiganj Sadar', 'Nabiganj', 'Madhabpur', 'Chunarughat', 'Bahubal'],
      },
    },
  },
  Barisal: {
    name: 'Barishal',
    nameBn: 'বরিশাল',
    districts: {
      Barisal: {
        name: 'Barishal',
        nameBn: 'বরিশাল',
        upazilas: ['Kotwali', 'Airport', 'Kawnia', 'Babuganj', 'Bakerganj', 'Gournadi', 'Uzirpur'],
      },
      Patuakhali: {
        name: 'Patuakhali',
        nameBn: 'পটুয়াখালী',
        upazilas: ['Patuakhali Sadar', 'Kalapara', 'Galachipa', 'Bauphal', 'Dumki'],
      },
      Bhola: {
        name: 'Bhola',
        nameBn: 'ভোলা',
        upazilas: ['Bhola Sadar', 'Borhanuddin', 'Char Fasson', 'Lalmohan', 'Daulatkhan'],
      },
    },
  },
  Rangpur: {
    name: 'Rangpur',
    nameBn: 'রংপুর',
    districts: {
      Rangpur: {
        name: 'Rangpur',
        nameBn: 'রংপুর',
        upazilas: ['Rangpur Sadar', 'Pirganj', 'Mithapukur', 'Badarganj', 'Gangachara', 'Kaunia'],
      },
      Dinajpur: {
        name: 'Dinajpur',
        nameBn: 'দিনাজপুর',
        upazilas: ['Dinajpur Sadar', 'Birganj', 'Parbatipur', 'Phulbari', 'Birol'],
      },
      Kurigram: {
        name: 'Kurigram',
        nameBn: 'কুড়িগ্রাম',
        upazilas: ['Kurigram Sadar', 'Nageshwari', 'Ulipur', 'Chilmari', 'Rajarhat'],
      },
    },
  },
  Mymensingh: {
    name: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    districts: {
      Mymensingh: {
        name: 'Mymensingh',
        nameBn: 'ময়মনসিংহ',
        upazilas: ['Kotwali', 'Muktagachha', 'Trishal', 'Bhaluka', 'Fulbaria', 'Gafargaon', 'Ishwarganj'],
      },
      Jamalpur: {
        name: 'Jamalpur',
        nameBn: 'জামালপুর',
        upazilas: ['Jamalpur Sadar', 'Sarishabari', 'Melandaha', 'Islampur', 'Madarganj'],
      },
      Netrokona: {
        name: 'Netrokona',
        nameBn: 'নেত্রকোণা',
        upazilas: ['Netrokona Sadar', 'Durgapur', 'Kendua', 'Kalmakanda', 'Mohanganj'],
      },
    },
  },
};

export const COURIER_PROVIDERS = [
  { id: 'STEADFAST', name: 'Steadfast Courier', logo: '🚚', deliveryRateDhaka: 60, deliveryRateOutside: 120, avgDays: 2 },
  { id: 'PATHAO', name: 'Pathao Courier', logo: '🛵', deliveryRateDhaka: 70, deliveryRateOutside: 130, avgDays: 2 },
  { id: 'REDX', name: 'RedX Delivery', logo: '📦', deliveryRateDhaka: 65, deliveryRateOutside: 125, avgDays: 3 },
  { id: 'PAPERFLY', name: 'Paperfly Doorstep', logo: '⚡', deliveryRateDhaka: 60, deliveryRateOutside: 120, avgDays: 3 },
];

export const PAYMENT_METHODS = [
  { id: 'COD', name: 'Cash on Delivery (ক্যাশ অন ডেলিভারি)', desc: 'Pay with cash upon receipt anywhere in Bangladesh', badge: 'Popular' },
  { id: 'BKASH', name: 'bKash (বিকাশ)', desc: 'Instant merchant payment via bKash wallet', badge: 'Instant' },
  { id: 'NAGAD', name: 'Nagad (নগদ)', desc: 'Instant digital payment via Nagad', badge: 'Instant' },
  { id: 'BANK', name: 'Bank Transfer (ব্যাংক ট্রান্সফার)', desc: 'Direct corporate account transfer (City Bank, EBL, Brac Bank)', badge: 'B2B' },
];

export interface ResellerRankTier {
  level: number;
  rankKey: string;
  name: string;
  nameBn: string;
  title: string;
  titleBn: string;
  badge: string;
  image?: string;
  minXp: number;
  maxXp: number;
  minOrders: number;
  minProfit: number;
  canWithdrawXpBonus: boolean;
  color: string;
  accentColor: string;
  bgGradient: string;
  borderClass: string;
  perks: string[];
  perksBn: string[];
}

export const RESELLER_RANKS: ResellerRankTier[] = [
  {
    level: 1,
    rankKey: 'ROOKIE',
    name: 'Rookie',
    nameBn: 'রুকি',
    title: 'Rookie',
    titleBn: 'রুকি',
    badge: '🐣',
    minXp: 0,
    maxXp: 300,
    minOrders: 0,
    minProfit: 0,
    canWithdrawXpBonus: false,
    color: 'emerald',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950/80 to-slate-900',
    borderClass: 'border-emerald-500/40',
    perks: ['Public Catalog Sharing', 'Standard Reseller Profit Margins', '৳1 Bonus per XP (Locked)'],
    perksBn: ['পাবলিক ক্যাটালগ শেয়ারিং', 'স্ট্যান্ডার্ড রিসেলার প্রফিট মার্জিন', 'প্রতি XP তে ১৳ বোনাস (লকড)'],
  },
  {
    level: 2,
    rankKey: 'BETTER',
    name: 'Better',
    nameBn: 'বেটার',
    title: 'Better',
    titleBn: 'বেটার',
    badge: '⚡',
    minXp: 301,
    maxXp: 700,
    minOrders: 5,
    minProfit: 2500,
    canWithdrawXpBonus: false,
    color: 'cyan',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-950/80 to-slate-900',
    borderClass: 'border-cyan-500/40',
    perks: ['ResellAI Copywriting Assistant', 'Priority Packaging & Dispatch', '৳1 Bonus per XP (Locked)'],
    perksBn: ['ResellAI কপিরাইটিং অ্যাসিস্ট্যান্ট', 'অগ্রাধিকার প্যাকেজিং ও ডিসপ্যাচ', 'প্রতি XP তে ১৳ বোনাস (লকড)'],
  },
  {
    level: 3,
    rankKey: 'ULTRA_BETTER',
    name: 'Ultra Better',
    nameBn: 'আল্ট্রা বেটার',
    title: 'Ultra Better',
    titleBn: 'আল্ট্রা বেটার',
    badge: '🔥',
    minXp: 701,
    maxXp: 2000,
    minOrders: 15,
    minProfit: 8000,
    canWithdrawXpBonus: true, // UNLOCKED XP WITHDRAWAL
    color: 'amber',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950/80 to-slate-900',
    borderClass: 'border-amber-500/50',
    perks: ['🔓 UNLOCKED XP Bonus Money Direct Cashout (1 XP = ৳1)', 'Wholesale Rebate (-2%)', 'VIP WhatsApp Support Line'],
    perksBn: ['🔓 আনলকড XP বোনাস টাকা সরাসরি ক্যাশআউট (১ XP = ১৳)', 'হোলসেল রিবেট (-২%)', 'ভিআইপি হোয়াটসঅ্যাপ সাপোর্ট'],
  },
  {
    level: 4,
    rankKey: 'THE_GOAT',
    name: 'The GOAT',
    nameBn: 'দ্য গোট (G.O.A.T)',
    title: 'The GOAT',
    titleBn: 'দ্য গোট',
    badge: '🐐',
    image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=400&auto=format&fit=crop&q=80', // Real Goat Photo
    minXp: 2001,
    maxXp: 5000,
    minOrders: 40,
    minProfit: 25000,
    canWithdrawXpBonus: true,
    color: 'purple',
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950/90 to-slate-900',
    borderClass: 'border-purple-500/60',
    perks: ['🐐 Official GOAT Hall of Fame Badge', 'Instant bKash/Nagad Payouts (0 Min)', 'Factory VIP Wholesale (-4%)', 'Dedicated Key Account Manager'],
    perksBn: ['🐐 অফিশিয়াল গোট হল অব ফেম ব্যাজ', 'ইনস্ট্যান্ট বিকাশ/নগদ পেআউট (০ মিনিট)', 'ফ্যাক্টরি ভিআইপি হোলসেল (-৪%)', 'ডেডিকেটেড একাউন্ট ম্যানেজার'],
  },
  {
    level: 5,
    rankKey: 'MONSTER',
    name: 'Monster',
    nameBn: 'মনস্টার',
    title: 'Monster',
    titleBn: 'মনস্টার',
    badge: '👹',
    minXp: 5001,
    maxXp: 10000,
    minOrders: 100,
    minProfit: 60000,
    canWithdrawXpBonus: true,
    color: 'rose',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-950/90 to-slate-900',
    borderClass: 'border-rose-500/60',
    perks: ['Monster Commerce Power Club', 'Custom Subdomain Reseller Website', 'Zero Verification Requirements', '৳100 Free Logistics Bonus / Order'],
    perksBn: ['মনস্টার কমার্স পাওয়ার ক্লাব', 'কাস্টম সাবডোমেইন ওয়েবসাইট', 'জিরো ভেরিফিকেশন রিকোয়ারমেন্ট', '৳১০০ ফ্রি ডেলিভারি বোনাস / অর্ডার'],
  },
  {
    level: 6,
    rankKey: 'ULTRA_MONSTER',
    name: 'Ultra Monster',
    nameBn: 'আল্ট্রা মনস্টার',
    title: 'Ultra Monster',
    titleBn: 'আল্ট্রা মনস্টার',
    badge: '👾',
    minXp: 10001,
    maxXp: 20000,
    minOrders: 250,
    minProfit: 150000,
    canWithdrawXpBonus: true,
    color: 'indigo',
    accentColor: '#6366f1',
    bgGradient: 'from-indigo-950/90 to-slate-900',
    borderClass: 'border-indigo-500/60',
    perks: ['Ultra Monster Direct Factory Direct Import Access (-6%)', 'Unlimited Instant Cashout Disbursals', 'Zero Return Penalties Guarantee'],
    perksBn: ['আল্ট্রা মনস্টার সরাসরি ফ্যাক্টরি ইমপোর্ট রেট (-৬%)', 'আনলিমিটেড ইনস্ট্যান্ট ক্যাশআউট', 'জিরো রিটার্ন পেনাল্টি গ্যারান্টি'],
  },
  {
    level: 7,
    rankKey: 'LEGEND',
    name: 'Legend',
    nameBn: 'লেজেন্ড',
    title: 'Legend',
    titleBn: 'লেজেন্ড',
    badge: '👑',
    minXp: 20001,
    maxXp: 999999999,
    minOrders: 500,
    minProfit: 300000,
    canWithdrawXpBonus: true,
    color: 'amber',
    accentColor: '#fbbf24',
    bgGradient: 'from-amber-950/90 via-purple-950/80 to-slate-900',
    borderClass: 'border-amber-400',
    perks: ['👑 Lifetime National Legend Status', 'Lowest Factory Import Price in Bangladesh (-8%)', 'Annual All-Expenses Paid Luxury Vacation', 'Exclusive Profit Share Pool Bonus'],
    perksBn: ['👑 আজীবন ন্যাশনাল লেজেন্ড স্ট্যাটাস', 'বাংলাদেশে সর্বনিম্ন ফ্যাক্টরি রেট (-৮%)', 'বাৎসরিক অল-এক্সপেন্সেস পেইড ট্যুর', 'বার্ষিক প্রফিট শেয়ার পুল বোনাস'],
  },
];

export const RESELLER_LEVELS = RESELLER_RANKS;

export const RESELLER_LEVEL_TIERS: Record<number, { name: string; nameBn: string; badge: string; image?: string; minOrders: number; minProfit: number; minXp: number; maxXp: number; canWithdrawXpBonus: boolean }> = {
  1: { name: 'Rookie', nameBn: 'রুকি', badge: '🐣', minOrders: 0, minProfit: 0, minXp: 0, maxXp: 300, canWithdrawXpBonus: false },
  2: { name: 'Better', nameBn: 'বেটার', badge: '⚡', minOrders: 5, minProfit: 2500, minXp: 301, maxXp: 700, canWithdrawXpBonus: false },
  3: { name: 'Ultra Better', nameBn: 'আল্ট্রা বেটার', badge: '🔥', minOrders: 15, minProfit: 8000, minXp: 701, maxXp: 2000, canWithdrawXpBonus: true },
  4: { name: 'The GOAT', nameBn: 'দ্য গোট', badge: '🐐', image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=400&auto=format&fit=crop&q=80', minOrders: 40, minProfit: 25000, minXp: 2001, maxXp: 5000, canWithdrawXpBonus: true },
  5: { name: 'Monster', nameBn: 'মনস্টার', badge: '👹', minOrders: 100, minProfit: 60000, minXp: 5001, maxXp: 10000, canWithdrawXpBonus: true },
  6: { name: 'Ultra Monster', nameBn: 'আল্ট্রা মনস্টার', badge: '👾', minOrders: 250, minProfit: 150000, minXp: 10001, maxXp: 20000, canWithdrawXpBonus: true },
  7: { name: 'Legend', nameBn: 'লেজেন্ড', badge: '👑', minOrders: 500, minProfit: 300000, minXp: 20001, maxXp: 999999999, canWithdrawXpBonus: true },
};

export function getRankForXp(xp: number): ResellerRankTier {
  const cleanXp = Math.max(0, Number(xp) || 0);
  const found = RESELLER_RANKS.find((l) => cleanXp >= l.minXp && cleanXp <= l.maxXp);
  return found || RESELLER_RANKS[RESELLER_RANKS.length - 1];
}

export function getLevelForXp(xp: number): ResellerRankTier {
  return getRankForXp(xp);
}

export function canWithdrawXpBonus(xp: number): boolean {
  return (Number(xp) || 0) >= 701; // Ultra Better Rank (701+ XP)
}

export function getXpBonusBdt(xp: number): number {
  return Math.max(0, Math.floor(Number(xp) || 0)); // 1 XP = ৳1
}
