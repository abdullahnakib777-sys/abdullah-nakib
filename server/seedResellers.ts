import { User, ResellerProfile, Wallet, Order } from '../src/types';

// Authentic Bangladeshi naming pools
const FIRST_NAMES = [
  'Tanvir', 'Sabrina', 'Mehedi', 'Farzana', 'Sazzad', 'Nabila', 'Rashedul', 'Sumaiya',
  'Arif', 'Shahnaz', 'Al-Amin', 'Mahfuzur', 'Jannatul', 'Shakil', 'Sadia', 'Shahriar',
  'Tamanna', 'Nazmul', 'Fahmida', 'Imtiaz', 'Rubaiya', 'Enamul', 'Afroza', 'Kawsar',
  'Tanjila', 'Hasibul', 'Mim', 'Mustafizur', 'Nusrat', 'Towhid', 'Shamima', 'Golam',
  'Fatema', 'Robiul', 'Umme', 'Zahid', 'Laila', 'Ashiqur', 'Runa', 'Mizanur',
  'Tasnia', 'Shohel', 'Priyanka', 'Monir', 'Mousumi', 'Kamrul', 'Nahid', 'Sayema'
];

const LAST_NAMES = [
  'Ahmed', 'Hasan', 'Rahman', 'Islam', 'Chowdhury', 'Khan', 'Hossain', 'Akter',
  'Begum', 'Karim', 'Sultana', 'Sheikh', 'Ferdous', 'Kabir', 'Yasmin', 'Haque',
  'Sharmin', 'Talukdar', 'Miah', 'Siddique', 'Bhuiyan', 'Molla', 'Majumder', 'Patwary'
];

const STORE_PREFIXES = [
  'Meher', 'Smart', 'Elite', 'Royal', 'Prime', 'Trendz', 'Metro', 'Urban', 'Express',
  'NextGen', 'Quick', 'Apex', 'Nova', 'Direct', 'Daily', 'Touch', 'Luxe', 'Modern',
  'Pro', 'Easy', 'Galaxy', 'Spark', 'Zenith', 'Crown', 'Golden', 'Pure'
];

const STORE_SUFFIXES = [
  'Mart', 'Gadgets', 'Store', 'Lifestyle', 'Deals', 'Hub', 'Bazaar', 'Collection',
  'Cart', 'Commerce', 'Zone', 'Shop', 'Outfit', 'Fashion', 'Corner', 'World',
  'Express', 'Point', 'Empire', 'Outlet', 'Center'
];

interface LocationInfo {
  division: string;
  district: string;
  upazila: string;
  address: string;
}

const BANGLADESH_LOCATIONS: LocationInfo[] = [
  { division: 'Dhaka', district: 'Dhaka', upazila: 'Dhanmondi', address: 'Road 7/A, Dhanmondi, Dhaka' },
  { division: 'Dhaka', district: 'Dhaka', upazila: 'Uttara', address: 'Sector 4, Jashimuddin Ave, Uttara' },
  { division: 'Dhaka', district: 'Dhaka', upazila: 'Mirpur', address: 'Section 10, Mirpur, Dhaka' },
  { division: 'Dhaka', district: 'Dhaka', upazila: 'Gulshan', address: 'Gulshan 2 Pink City, Dhaka' },
  { division: 'Dhaka', district: 'Dhaka', upazila: 'Savar', address: 'Savar DOHS, Savar, Dhaka-1344' },
  { division: 'Dhaka', district: 'Gazipur', upazila: 'Joydebpur', address: 'Chourasta, Joydebpur, Gazipur' },
  { division: 'Dhaka', district: 'Narayanganj', upazila: 'Sadar', address: 'Chashara Bus Stand, Narayanganj' },
  { division: 'Dhaka', district: 'Narsingdi', upazila: 'Sadar', address: 'Station Road, Narsingdi' },
  { division: 'Dhaka', district: 'Tangail', upazila: 'Sadar', address: 'Victoria Road, Tangail' },
  { division: 'Chittagong', district: 'Chittagong', upazila: 'Agrabad', address: 'CDA Avenue, Agrabad Commercial Area' },
  { division: 'Chittagong', district: 'Chittagong', upazila: 'GEC', address: 'GEC Circle, Nasirabad, Chittagong' },
  { division: 'Chittagong', district: 'Comilla', upazila: 'Kandirpar', address: 'Kandirpar Main Road, Comilla' },
  { division: 'Chittagong', district: 'Cox\'s Bazar', upazila: 'Sadar', address: 'Laboni Beach Road, Cox\'s Bazar' },
  { division: 'Chittagong', district: 'Feni', upazila: 'Sadar', address: 'Trunk Road, Feni' },
  { division: 'Sylhet', district: 'Sylhet', upazila: 'Zindabazar', address: 'Shukria Market, Zindabazar, Sylhet' },
  { division: 'Sylhet', district: 'Sylhet', upazila: 'Amberkhana', address: 'Amberkhana Point, Sylhet' },
  { division: 'Sylhet', district: 'Moulvibazar', upazila: 'Sadar', address: 'Chowmuhani, Sreemangal Road, Moulvibazar' },
  { division: 'Rajshahi', district: 'Rajshahi', upazila: 'Boalia', address: 'Shaheb Bazar Zero Point, Rajshahi' },
  { division: 'Rajshahi', district: 'Bogura', upazila: 'Sadar', address: 'Sathmatha, Bogura Sadar' },
  { division: 'Rajshahi', district: 'Pabna', upazila: 'Sadar', address: 'Abdul Hamid Road, Pabna' },
  { division: 'Khulna', district: 'Khulna', upazila: 'Sonadanga', address: 'Moylapota Square, Sonadanga, Khulna' },
  { division: 'Khulna', district: 'Jessore', upazila: 'Kotwali', address: 'MK Road, Jessore Sadar' },
  { division: 'Khulna', district: 'Kushtia', upazila: 'Sadar', address: 'NS Road, Kushtia' },
  { division: 'Barisal', district: 'Barisal', upazila: 'Kotwali', address: 'Sadargat Road, Barisal' },
  { division: 'Rangpur', district: 'Rangpur', upazila: 'Kotwali', address: 'Jahaj Company Mor, Rangpur' },
  { division: 'Rangpur', district: 'Dinajpur', upazila: 'Sadar', address: 'Nimtola Mor, Dinajpur' },
  { division: 'Mymensingh', district: 'Mymensingh', upazila: 'Sadar', address: 'Ganginar Par, Mymensingh' },
];

/**
 * Generates a realistic date between 4 April 2026 and 20 August 2026
 */
function getRealisticDate(index: number, total: number): string {
  const startMs = new Date('2026-04-04T09:00:00.000Z').getTime();
  const endMs = new Date('2026-08-20T18:00:00.000Z').getTime();
  
  // Distribute with slight organic jitter while preserving chronological progression
  const step = (endMs - startMs) / total;
  const targetMs = startMs + index * step + (Math.sin(index * 17) * 86400000 * 1.5);
  const clampedMs = Math.max(startMs, Math.min(endMs, targetMs));
  return new Date(clampedMs).toISOString();
}

export interface SeedDataset {
  users: User[];
  resellers: ResellerProfile[];
  wallets: Record<string, Wallet>;
  orders: Order[];
}

// Helper to accurately map XP to 7-rank Level
function calculate7RankLevel(xp: number): number {
  if (xp >= 20001) return 7; // Legend 👑
  if (xp >= 10001) return 6; // Ultra Monster 👾
  if (xp >= 5001) return 5;  // Monster 👹
  if (xp >= 2001) return 4;  // The GOAT 🐐
  if (xp >= 701) return 3;   // Ultra Better 🔥
  if (xp >= 301) return 2;   // Better ⚡
  return 1;                  // Rookie 🐣
}

export function generateRealisticResellersDataset(): SeedDataset {
  const users: User[] = [];
  const resellers: ResellerProfile[] = [];
  const wallets: Record<string, Wallet> = {};
  const orders: Order[] = [];

  // 1. Founder User & Reseller
  const founderUser: User = {
    id: 'usr-founder',
    name: 'Nakib Abdullah (FOUNDER)',
    email: 'abdullahnakib777@gmail.com',
    phone: '01333855344',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-04-04T09:00:00.000Z',
    isFounder: true,
  };
  users.push(founderUser);

  const founderReseller: ResellerProfile = {
    id: 'rsl-founder',
    userId: 'usr-founder',
    storeName: 'MeherMart Central (Founder Store)',
    facebookPage: 'https://facebook.com/mehermart.bd',
    whatsappNumber: '01333855344',
    referralCode: 'FOUNDER-MEHER',
    status: 'ACTIVE',
    isVerified: true,
    verificationFeePaid: true,
    adminApprovedFree: true,
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Savar',
    address: 'Savar DOHS, Savar, Dhaka-1344',
    salesIntent: 'Official central distribution and flagship catalog testing',
    level: 7, // Legend rank
    xp: 26500,
    deliveredOrdersCount: 420,
    totalOrdersCount: 435,
    totalProfitEarned: 98500,
    totalProfitEarnedBdt: 98500,
    isAnonymousOnLeaderboard: false,
    createdAt: '2026-04-04T09:00:00.000Z',
  };
  resellers.push(founderReseller);
  wallets[founderReseller.id] = {
    resellerId: founderReseller.id,
    availableBalance: 48500,
    pendingBalance: 4200,
    totalEarned: 98500,
    totalWithdrawn: 45800,
    updatedAt: '2026-08-20T12:00:00.000Z',
  };

  // 2. Generate 212 additional resellers (Total = 213) across 7 ranks
  const TOTAL_RESELLERS = 213;

  for (let i = 1; i < TOTAL_RESELLERS; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 3 + 7) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;

    const storePrefix = STORE_PREFIXES[(i * 2 + 3) % STORE_PREFIXES.length];
    const storeSuffix = STORE_SUFFIXES[(i * 5 + 1) % STORE_SUFFIXES.length];
    let storeName = `${storePrefix} ${storeSuffix} ${i <= 30 ? 'BD' : ''}`.trim();

    const loc = BANGLADESH_LOCATIONS[i % BANGLADESH_LOCATIONS.length];
    const phonePrefixes = ['017', '018', '019', '013', '016', '015'];
    const phonePrefix = phonePrefixes[i % phonePrefixes.length];
    const phoneSuffix = String(10000000 + ((i * 87654) % 8999999)).slice(0, 8);
    const phone = `${phonePrefix}${phoneSuffix}`;

    const joinedAt = getRealisticDate(i, TOTAL_RESELLERS);
    const userId = `usr-rsl-${String(i).padStart(3, '0')}`;
    const resellerId = `rsl-${String(i).padStart(3, '0')}`;
    const codeClean = storePrefix.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 4);
    const referralCode = `MM-${codeClean}${String(100 + i)}`;

    let xp = 100;
    let status: ResellerProfile['status'] = 'ACTIVE';
    let isVerified = true;
    let verificationFeePaid = true;
    let adminApprovedFree = i % 7 === 0;
    let deliveredOrdersCount = 0;
    let totalProfitEarned = 0;

    const isActiveMember = i <= 204; // Exactly 204 active members excluding founder store

    if (i === 1) {
      // Specifically Configure Trendz Bazar BD (rsl-001) as requested by user
      storeName = 'Trendz Bazar BD';
      xp = 11720;
      deliveredOrdersCount = 305;
      totalProfitEarned = 64900;
      status = 'ACTIVE';
      isVerified = true;
      verificationFeePaid = true;
      adminApprovedFree = true;
    } else if (i === 2) {
      // Specifically Configure Urban Shop BD (rsl-002) as requested by user
      storeName = 'Urban Shop BD';
      xp = 12440;
      deliveredOrdersCount = 330;
      totalProfitEarned = 71000;
      status = 'ACTIVE';
      isVerified = true;
      verificationFeePaid = true;
      adminApprovedFree = true;
    } else if (isActiveMember) {
      // Create rich, tiered distribution across the 7 ranks
      if (i <= 5) {
        // Rank 7: Legend 👑 (20,001+ XP)
        xp = 21000 + ((i * 1850) % 12000);
        deliveredOrdersCount = 550 + ((i * 45) % 350);
        totalProfitEarned = Math.round(deliveredOrdersCount * 230 + ((i * 1234) % 15000));
      } else if (i <= 18) {
        // Rank 6: Ultra Monster 👾 (10,001 - 20,000 XP)
        xp = 11000 + ((i * 720) % 8500);
        deliveredOrdersCount = 280 + ((i * 25) % 200);
        totalProfitEarned = Math.round(deliveredOrdersCount * 210 + ((i * 850) % 10000));
      } else if (i <= 45) {
        // Rank 5: Monster 👹 (5,001 - 10,000 XP)
        xp = 5200 + ((i * 410) % 4500);
        deliveredOrdersCount = 130 + ((i * 15) % 120);
        totalProfitEarned = Math.round(deliveredOrdersCount * 195 + ((i * 550) % 6000));
      } else if (i <= 90) {
        // Rank 4: The GOAT 🐐 (2,001 - 5,000 XP)
        xp = 2150 + ((i * 190) % 2700);
        deliveredOrdersCount = 55 + ((i * 8) % 65);
        totalProfitEarned = Math.round(deliveredOrdersCount * 180 + ((i * 350) % 4000));
      } else if (i <= 145) {
        // Rank 3: Ultra Better 🔥 (701 - 2,000 XP)
        xp = 750 + ((i * 95) % 1150);
        deliveredOrdersCount = 20 + ((i * 4) % 30);
        totalProfitEarned = Math.round(deliveredOrdersCount * 170 + ((i * 180) % 2000));
      } else if (i <= 185) {
        // Rank 2: Better ⚡ (301 - 700 XP)
        xp = 320 + ((i * 35) % 360);
        deliveredOrdersCount = 8 + ((i * 2) % 10);
        totalProfitEarned = Math.round(deliveredOrdersCount * 160 + ((i * 90) % 1000));
      } else {
        // Rank 1: Rookie 🐣 (0 - 300 XP)
        xp = 50 + ((i * 22) % 240);
        deliveredOrdersCount = 1 + (i % 5);
        totalProfitEarned = Math.round(deliveredOrdersCount * 150 + ((i * 40) % 500));
      }
      status = 'ACTIVE';
      isVerified = true;
      verificationFeePaid = true;
    } else {
      // Pending 8 members (i = 205 to 212) awaiting verification
      xp = 10;
      deliveredOrdersCount = 0;
      totalProfitEarned = 0;
      status = 'PENDING';
      isVerified = false;
      verificationFeePaid = i % 2 === 0;
      adminApprovedFree = false;
    }

    const level = calculate7RankLevel(xp);

    // User entity
    const user: User = {
      id: userId,
      name: fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`,
      phone,
      role: 'RESELLER',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + (i * 234567) % 99999999}?w=200&auto=format&fit=crop&q=80`,
      createdAt: joinedAt,
    };
    users.push(user);

    const calculatedSalesBdt = i === 1 ? 227150 : i === 2 ? 248500 : Math.round(totalProfitEarned * 3.5);

    // Reseller profile entity
    const profile: ResellerProfile = {
      id: resellerId,
      userId,
      storeName,
      facebookPage: `https://facebook.com/${storePrefix.toLowerCase()}.${storeSuffix.toLowerCase()}.${i}`,
      whatsappNumber: phone,
      referralCode,
      status,
      isVerified,
      verificationFeePaid,
      adminApprovedFree,
      verificationPayment: verificationFeePaid ? {
        method: i % 2 === 0 ? 'BKASH' : 'NAGAD',
        senderPhone: phone,
        trxId: `TRX${9000000000 + i * 3421}`,
        amount: 500,
        submittedAt: joinedAt,
        verifiedAt: isVerified ? joinedAt : undefined,
      } : undefined,
      division: loc.division,
      district: loc.district,
      upazila: loc.upazila,
      address: loc.address,
      salesIntent: i % 2 === 0 ? 'Selling trending gadgets on Facebook & TikTok' : 'Supplying home & kitchen items to local community',
      level,
      xp,
      deliveredOrdersCount,
      totalOrdersCount: deliveredOrdersCount + (status === 'ACTIVE' ? Math.floor(i % 4) + 2 : 0),
      totalProfitEarned,
      totalProfitEarnedBdt: totalProfitEarned,
      isAnonymousOnLeaderboard: false,
      createdAt: joinedAt,
    };
    (profile as any).totalSalesBdt = calculatedSalesBdt;
    (profile as any).moneyMadeBdt = calculatedSalesBdt;
    (profile as any).moneyProfitedBdt = totalProfitEarned;
    resellers.push(profile);

    // Wallet entity
    let availableBalance = Math.round(totalProfitEarned * 0.65);
    let pendingBalance = status === 'ACTIVE' ? Math.round(totalProfitEarned * 0.08) + 350 : 0;
    let totalWithdrawn = Math.max(0, totalProfitEarned - availableBalance);

    if (i === 1) {
      // Exact wallet matching Admin input for Trendz Bazar BD
      availableBalance = 42185;
      pendingBalance = 5542;
      totalWithdrawn = 22715;
    } else if (i === 2) {
      // Exact wallet matching Admin input for Urban Shop BD
      availableBalance = 46150;
      pendingBalance = 6030;
      totalWithdrawn = 24850;
    }

    wallets[resellerId] = {
      resellerId,
      availableBalance,
      pendingBalance,
      totalEarned: totalProfitEarned,
      totalWithdrawn,
      updatedAt: new Date().toISOString(),
    };
  }

  // 3. Seed Comprehensive Realistic Orders Mapped Across Active Resellers with Real Dynamic Dates
  const CATALOG_PRODUCTS = [
    { id: 'prod-01', code: 'MM-1001', name: 'T900 Ultra 2 Max Smartwatch (Dual Strap)', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', cost: 520, resPrice: 650, sellPrice: 999, profit: 349, margin: 130 },
    { id: 'prod-02', code: 'MM-1002', name: 'M10 TWS Dual Earbuds with 2000mAh Powerbank', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80', cost: 240, resPrice: 320, sellPrice: 499, profit: 179, margin: 80 },
    { id: 'prod-03', code: 'MM-1003', name: 'High-Power Electric Meat & Vegetable Food Chopper (2L)', img: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80', cost: 780, resPrice: 950, sellPrice: 1450, profit: 500, margin: 170 },
    { id: 'prod-04', code: 'MM-1004', name: 'Rechargeable Portable Handheld Garment Steamer', img: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&q=80', cost: 680, resPrice: 850, sellPrice: 1299, profit: 449, margin: 170 },
    { id: 'prod-05', code: 'MM-1005', name: 'Rice Raw Silk Glow Brightening Serum (100ml)', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80', cost: 210, resPrice: 280, sellPrice: 450, profit: 170, margin: 70 },
    { id: 'prod-06', code: 'MM-1006', name: 'Dr. Rashel Vitamin C Whitening & Anti-Aging Face Wash', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80', cost: 190, resPrice: 250, sellPrice: 399, profit: 149, margin: 60 },
    { id: 'prod-09', code: 'MM-1009', name: '12-inch RGB LED Ring Light with 7ft Tripod Stand', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80', cost: 580, resPrice: 720, sellPrice: 1099, profit: 379, margin: 140 },
    { id: 'prod-10', code: 'MM-1010', name: 'Automatic Rechargeable Water Dispenser Pump', img: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&q=80', cost: 190, resPrice: 260, sellPrice: 420, profit: 160, margin: 70 },
  ];

  const couriers: Order['courier'][] = ['STEADFAST', 'PATHAO', 'REDX', 'STEADFAST'];
  let currentOrderSequence = 3001;

  // Helper to create order objects with customizable dates and statuses
  const createOrderObject = (
    rsl: ResellerProfile,
    daysAgo: number,
    statusOverride?: Order['status'],
    prodIndex = 0,
    qty = 1
  ): Order => {
    const orderNumInt = currentOrderSequence++;
    const orderNumber = `#${orderNumInt}`;
    const orderId = `ord-${orderNumInt}`;
    const loc = BANGLADESH_LOCATIONS[(orderNumInt * 3 + 2) % BANGLADESH_LOCATIONS.length];
    const customerName = `${FIRST_NAMES[(orderNumInt * 2) % FIRST_NAMES.length]} ${LAST_NAMES[(orderNumInt * 4) % LAST_NAMES.length]}`;
    const customerPhone = `017${String(10000000 + orderNumInt * 76543).slice(0, 8)}`;
    
    let status: Order['status'] = statusOverride || (daysAgo === 0 ? 'PENDING' : daysAgo <= 2 ? 'SHIPPING' : 'DELIVERED');
    const courier = couriers[orderNumInt % couriers.length];
    const isDhaka = loc.division.toLowerCase() === 'dhaka';
    const deliveryFee = isDhaka ? 60 : 120;
    const packagingFee = 30; // 30 TK standard packaging fee

    const prod = CATALOG_PRODUCTS[prodIndex % CATALOG_PRODUCTS.length];
    const unitSellingPrice = prod.sellPrice;
    const subtotal = unitSellingPrice * qty;
    const totalResellerProfit = prod.profit * qty;
    const totalPlatformMargin = prod.margin * qty;
    const totalAmount = subtotal + deliveryFee + packagingFee;

    const createdAtDate = new Date(Date.now() - (daysAgo * 86400000) - ((orderNumInt % 12) * 3600000));
    const createdAt = createdAtDate.toISOString();
    const deliveredAt = status === 'DELIVERED' ? new Date(createdAtDate.getTime() + (2 * 86400000)).toISOString() : undefined;

    return {
      id: orderId,
      orderNumber,
      customerName,
      customerPhone,
      customerEmail: `${customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      division: loc.division,
      district: loc.district,
      upazila: loc.upazila,
      address: loc.address,
      resellerId: rsl.id,
      resellerStoreName: rsl.storeName,
      resellerReferralCode: rsl.referralCode,
      items: [
        {
          productId: prod.id,
          productCode: prod.code,
          productName: prod.name,
          productImage: prod.img,
          quantity: qty,
          baseCost: prod.cost,
          resellerPrice: prod.resPrice,
          unitSellingPrice,
          resellerProfit: totalResellerProfit,
          platformMargin: totalPlatformMargin,
        }
      ],
      itemCount: qty,
      subtotal,
      packagingFee,
      deliveryFee,
      platformFee: 0,
      totalAmount,
      totalResellerProfit,
      totalPlatformMargin,
      profitStatus: status === 'DELIVERED' ? 'AVAILABLE' : 'PENDING',
      paymentMethod: 'COD',
      paymentStatus: status === 'DELIVERED' ? 'PAID' : 'UNPAID',
      courier,
      trackingNumber: `${courier.slice(0, 4)}-${880000 + orderNumInt * 137}`,
      status,
      statusHistory: [
        {
          status: 'PENDING',
          timestamp: createdAt,
          note: `Order placed via ${rsl.storeName}`,
          updatedBy: rsl.storeName,
        },
        {
          status: 'CONFIRMED',
          timestamp: new Date(createdAtDate.getTime() + 1800000).toISOString(),
          note: 'Customer confirmed via automated call center',
          updatedBy: 'Admin Ops',
        },
        ...(status === 'DELIVERED' || status === 'SHIPPING' ? [{
          status: 'SHIPPING' as const,
          timestamp: new Date(createdAtDate.getTime() + 43200000).toISOString(),
          note: `Dispatched to ${courier} Courier Hub`,
          updatedBy: 'Warehouse Hub',
        }] : []),
        ...(status === 'DELIVERED' ? [{
          status: 'DELIVERED' as const,
          timestamp: deliveredAt || new Date().toISOString(),
          note: 'Customer received parcel and paid COD in full',
          updatedBy: `${courier} Courier Sync`,
        }] : [])
      ],
      createdAt,
      deliveredAt,
      settledAt: deliveredAt,
      isDirectCustomerOrder: false,
    };
  };

  // 3A. Dedicated Orders for Urban Shop BD (rsl-002) - 40 realistic orders across 0 to 90 days
  const urbanShopReseller = resellers.find((r) => r.id === 'rsl-002') || resellers[2];
  const urbanShopDaysAgo = [
    0, 0, 1, 1, 2, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 17, 19, 21, 23, 25, 28, 30, 34, 38, 42, 47, 52, 58, 65, 72, 80, 88, 95, 105, 115, 130
  ];
  urbanShopDaysAgo.forEach((daysAgo, i) => {
    let st: Order['status'] = 'DELIVERED';
    if (daysAgo === 0) st = i % 2 === 0 ? 'CONFIRMED' : 'PENDING';
    else if (daysAgo === 1) st = 'SHIPPING';
    else if (daysAgo === 2 && i % 2 === 0) st = 'PACKAGING';
    orders.push(createOrderObject(urbanShopReseller, daysAgo, st, i % CATALOG_PRODUCTS.length, (i % 5 === 0) ? 2 : 1));
  });

  // 3B. Dedicated Orders for Trendz Bazar BD (rsl-001) - 38 realistic orders across 0 to 90 days
  const trendzBazarReseller = resellers.find((r) => r.id === 'rsl-001') || resellers[1];
  const trendzBazarDaysAgo = [
    0, 1, 1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 16, 18, 20, 22, 24, 27, 29, 32, 36, 40, 45, 50, 56, 62, 70, 78, 85, 92, 100, 110, 120, 135
  ];
  trendzBazarDaysAgo.forEach((daysAgo, i) => {
    let st: Order['status'] = 'DELIVERED';
    if (daysAgo === 0) st = 'PENDING';
    else if (daysAgo === 1) st = 'SHIPPING';
    else if (daysAgo === 2) st = 'PACKAGING';
    orders.push(createOrderObject(trendzBazarReseller, daysAgo, st, (i + 2) % CATALOG_PRODUCTS.length, (i % 6 === 0) ? 2 : 1));
  });

  // 3C. Dedicated Orders for Founder Store (rsl-founder) - 45 realistic orders
  const founderResellerObj = resellers.find((r) => r.id === 'rsl-founder') || founderReseller;
  const founderDaysAgo = [
    0, 0, 1, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 17, 19, 21, 23, 26, 28, 31, 35, 39, 43, 48, 54, 60, 67, 74, 82, 90, 98, 108, 118, 128, 140, 150, 160, 170, 180
  ];
  founderDaysAgo.forEach((daysAgo, i) => {
    let st: Order['status'] = 'DELIVERED';
    if (daysAgo === 0) st = 'CONFIRMED';
    else if (daysAgo === 1) st = 'SHIPPING';
    orders.push(createOrderObject(founderResellerObj, daysAgo, st, (i + 4) % CATALOG_PRODUCTS.length, (i % 4 === 0) ? 2 : 1));
  });

  // 3D. Spread additional realistic orders across other top 40 active resellers
  const otherActiveResellers = resellers.filter((r) => r.id !== 'rsl-001' && r.id !== 'rsl-002' && r.id !== 'rsl-founder' && r.status === 'ACTIVE').slice(0, 40);
  otherActiveResellers.forEach((rsl, rIdx) => {
    const count = 3 + (rIdx % 5);
    for (let c = 0; c < count; c++) {
      const daysAgo = (c * 3 + (rIdx % 10)) % 60;
      const st: Order['status'] = daysAgo <= 1 ? 'SHIPPING' : 'DELIVERED';
      orders.push(createOrderObject(rsl, daysAgo, st, (rIdx + c) % CATALOG_PRODUCTS.length, 1));
    }
  });

  return { users, resellers, wallets, orders };
}
