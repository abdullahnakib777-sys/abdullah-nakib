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

export const RESELLER_LEVELS = [
  { level: 1, title: 'Beginner', titleBn: 'শিক্ষানবিস', icon: '🌱', minXp: 0, maxXp: 499, perks: ['Basic Storefront Link', 'Standard Reseller Margins'] },
  { level: 2, title: 'Hustler', titleBn: 'হাস্টলার', icon: '🔥', minXp: 500, maxXp: 1499, perks: ['AI Selling Assistant Access', 'Priority Support'] },
  { level: 3, title: 'Seller', titleBn: 'সেলার', icon: '⚡', minXp: 1500, maxXp: 3999, perks: ['Custom Storefront Subdomain', 'Fast 12-hr Payouts', '5% Bonus on Weekly Challenges'] },
  { level: 4, title: 'Pro Seller', titleBn: 'প্রো সেলার', icon: '🚀', minXp: 4000, maxXp: 9999, perks: ['Exclusive Wholesale Prices (-3%)', 'Dedicated Account Manager', 'Early Access to Hot Products'] },
  { level: 5, title: 'Elite Master', titleBn: 'এলিট মাস্টার', icon: '👑', minXp: 10000, maxXp: 999999, perks: ['Highest Margin Tier (-6%)', 'Zero Verification & Instant Cashout', 'Leaderboard Fame & Master Badge'] },
];

export const RESELLER_LEVEL_TIERS: Record<number, { name: string; badge: string; minOrders: number; minProfit: number }> = {
  1: { name: 'Starter Seller', badge: '🌱', minOrders: 0, minProfit: 0 },
  2: { name: 'Active Reseller', badge: '🔥', minOrders: 5, minProfit: 2500 },
  3: { name: 'Pro Merchant', badge: '⚡', minOrders: 20, minProfit: 10000 },
  4: { name: 'Commerce Champion', badge: '🚀', minOrders: 50, minProfit: 30000 },
  5: { name: 'Elite Founder', badge: '👑', minOrders: 100, minProfit: 75000 },
};

export function getLevelForXp(xp: number) {
  return RESELLER_LEVELS.find((l) => xp >= l.minXp && xp <= l.maxXp) || RESELLER_LEVELS[0];
}
