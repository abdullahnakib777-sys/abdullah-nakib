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
    level: 5,
    xp: 18500,
    isAnonymousOnLeaderboard: false,
    createdAt: '2026-04-04T09:00:00.000Z',
  };
  resellers.push(founderReseller);
  wallets[founderReseller.id] = {
    resellerId: founderReseller.id,
    availableBalance: 34500,
    pendingBalance: 4200,
    totalEarned: 52000,
    totalWithdrawn: 17500,
    updatedAt: '2026-08-20T12:00:00.000Z',
  };

  // 2. Generate 212 additional resellers (Total = 213)
  const TOTAL_RESELLERS = 213;

  for (let i = 1; i < TOTAL_RESELLERS; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 3 + 7) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;

    const storePrefix = STORE_PREFIXES[(i * 2 + 3) % STORE_PREFIXES.length];
    const storeSuffix = STORE_SUFFIXES[(i * 5 + 1) % STORE_SUFFIXES.length];
    const storeName = `${storePrefix} ${storeSuffix} ${i <= 30 ? 'BD' : ''}`.trim();

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

    // Realistic Performance Segmentation
    let level = 1;
    let xp = 100;
    let status: ResellerProfile['status'] = 'ACTIVE';
    let isVerified = true;
    let verificationFeePaid = true;
    let adminApprovedFree = i % 7 === 0;
    let deliveredOrdersCount = 0;
    let totalProfitEarned = 0;

    if (i <= 18) {
      // TOP PERFORMERS: ~1,800 to 2,150 orders, 21,000+ TK profit
      level = i <= 6 ? 5 : 4;
      deliveredOrdersCount = Math.floor(1800 + ((i * 19) % 350));
      totalProfitEarned = Math.floor(21000 + ((i * 850) % 24000));
      xp = Math.floor(8500 + ((i * 550) % 10000));
      isVerified = true;
      verificationFeePaid = true;
      status = 'ACTIVE';
    } else if (i <= 65) {
      // HIGH PERFORMERS: 400 - 1,100 orders, ৳6,500 - ৳18,000 profit
      level = i <= 35 ? 4 : 3;
      deliveredOrdersCount = Math.floor(400 + ((i * 15) % 700));
      totalProfitEarned = Math.floor(6500 + ((i * 240) % 11500));
      xp = Math.floor(3200 + ((i * 120) % 4800));
      isVerified = true;
      verificationFeePaid = true;
      status = 'ACTIVE';
    } else if (i <= 145) {
      // MEDIUM PERFORMERS: 60 - 380 orders, ৳1,200 - ৳5,800 profit
      level = i <= 95 ? 3 : 2;
      deliveredOrdersCount = Math.floor(60 + ((i * 7) % 320));
      totalProfitEarned = Math.floor(1200 + ((i * 75) % 4600));
      xp = Math.floor(900 + ((i * 45) % 2200));
      isVerified = true;
      verificationFeePaid = i % 8 !== 0;
      status = 'ACTIVE';
    } else {
      // LOW / NEWBIE PERFORMERS: 0 - 45 orders, ৳0 - ৳850 profit
      level = 1;
      deliveredOrdersCount = i % 3 === 0 ? Math.floor(i % 15) : 0;
      totalProfitEarned = deliveredOrdersCount * 65;
      xp = Math.floor(100 + (deliveredOrdersCount * 25));
      
      // Some pending fees for realistic admin verification queue
      if (i >= 195) {
        status = 'PENDING';
        isVerified = false;
        verificationFeePaid = i % 2 === 0;
        adminApprovedFree = false;
      }
    }

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
      isAnonymousOnLeaderboard: false,
      createdAt: joinedAt,
    };
    resellers.push(profile);

    // Wallet entity
    const availableBalance = Math.round(totalProfitEarned * 0.7);
    const pendingBalance = Math.round(totalProfitEarned * 0.15);
    const totalWithdrawn = Math.max(0, totalProfitEarned - availableBalance - pendingBalance);

    wallets[resellerId] = {
      resellerId,
      availableBalance,
      pendingBalance,
      totalEarned: totalProfitEarned,
      totalWithdrawn,
      updatedAt: '2026-08-20T16:00:00.000Z',
    };
  }

  // 3. Seed Realistic Orders Starting from #3001
  const orderCount = 28;
  const statuses: Order['status'][] = [
    'DELIVERED', 'DELIVERED', 'SHIPPING', 'PACKAGING', 'CONFIRMED', 'DELIVERED', 'PENDING'
  ];

  for (let idx = 0; idx < orderCount; idx++) {
    const orderNumInt = 3001 + idx; // #3001, #3002, #3003...
    const orderNumber = `#${orderNumInt}`;
    const orderId = `ord-${orderNumInt}`;
    const rsl = resellers[idx % resellers.length];
    const loc = BANGLADESH_LOCATIONS[(idx * 3 + 2) % BANGLADESH_LOCATIONS.length];
    const customerName = `${FIRST_NAMES[(idx * 2) % FIRST_NAMES.length]} ${LAST_NAMES[(idx * 4) % LAST_NAMES.length]}`;
    const customerPhone = `017${String(10000000 + idx * 76543).slice(0, 8)}`;
    const status = statuses[idx % statuses.length];
    const isDhaka = loc.division.toLowerCase() === 'dhaka';
    const deliveryFee = isDhaka ? 60 : 120;
    const packagingFee = 30; // 30 TK standard packaging fee
    const subtotal = 999 + ((idx * 250) % 1500);
    const profit = Math.round(subtotal * 0.3);

    orders.push({
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
          productId: 'prod-01',
          productCode: 'MM-1001',
          productName: 'T900 Ultra 2 Max Smartwatch (Dual Strap)',
          productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
          quantity: 1,
          baseCost: 520,
          resellerPrice: 650,
          unitSellingPrice: subtotal,
          resellerProfit: profit,
          platformMargin: 130,
        }
      ],
      itemCount: 1,
      subtotal,
      packagingFee,
      deliveryFee,
      platformFee: 0,
      totalAmount: subtotal + deliveryFee + packagingFee,
      totalResellerProfit: profit,
      totalPlatformMargin: 130,
      profitStatus: status === 'DELIVERED' ? 'AVAILABLE' : 'PENDING',
      paymentMethod: 'COD',
      paymentStatus: status === 'DELIVERED' ? 'PAID' : 'UNPAID',
      courier: 'STEADFAST',
      trackingNumber: `STDF-881${idx}90`,
      status,
      statusHistory: [
        {
          status: 'PENDING',
          timestamp: '2026-08-15T10:00:00.000Z',
          note: `Order placed via ${rsl.storeName}`,
          updatedBy: rsl.storeName,
        },
        ...(status === 'DELIVERED' ? [{
          status: 'DELIVERED' as const,
          timestamp: '2026-08-18T14:30:00.000Z',
          note: 'Customer received parcel and paid in cash',
          updatedBy: 'Steadfast Courier API',
        }] : [])
      ],
      createdAt: '2026-08-15T10:00:00.000Z',
      deliveredAt: status === 'DELIVERED' ? '2026-08-18T14:30:00.000Z' : undefined,
      isDirectCustomerOrder: false,
    });
  }

  return { users, resellers, wallets, orders };
}
