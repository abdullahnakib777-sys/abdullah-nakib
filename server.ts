import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db';
import { ProfitEngine } from './server/profitEngine';
import { AIService } from './server/aiService';
import { User } from './src/types';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Simple authentication helper
  const getAuthenticatedUser = (req: Request): User => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const userId = authHeader.split(' ')[1];
      const user = db.getUserById(userId);
      if (user) return user;
    }
    // Default to Founder admin if none provided for convenience in dev
    return db.getUserById('usr-founder') || db.getUsers()[0];
  };

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      time: new Date().toISOString(),
      platform: 'Shadhin Reseller BD',
      database: {
        engine: 'Firebase Cloud Firestore',
        cloudSync: 'Active',
      },
    });
  });

  // Auth: Get demo accounts for instant switching
  app.get('/api/v1/auth/demo-accounts', (req: Request, res: Response) => {
    const users = db.getUsers();
    const resellers = db.getResellers();
    const accounts = users.map((u) => {
      const reseller = resellers.find((r) => r.userId === u.id);
      return {
        user: u,
        reseller,
      };
    });
    res.json({ accounts });
  });

  // Auth: Admin Dedicated Login
  app.post('/api/v1/auth/admin-login', (req: Request, res: Response) => {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({ error: 'Admin ID / Email and Password are required' });
    }

    const cleanId = String(adminId).trim().toLowerCase();
    const cleanPass = String(password).trim();

    // Check single admin ID and password
    const validAdminIds = ['admin', 'abdullahnakib777@gmail.com', 'usr-founder', 'nakib'];
    const validPasswords = ['admin1234', 'admin', 'admin@shadhin2026', 'nakib2026'];

    const isValidId = validAdminIds.includes(cleanId) || cleanId.includes('abdullahnakib');
    const isValidPass = validPasswords.includes(cleanPass) || cleanPass === 'admin1234';

    if (!isValidId || !isValidPass) {
      return res.status(401).json({ error: 'Invalid Admin Credentials. Access Denied.' });
    }

    const adminUser = db.getUserById('usr-founder') || db.getUsers().find((u) => u.role === 'ADMIN');
    if (!adminUser) {
      return res.status(404).json({ error: 'Admin account not initialized' });
    }

    const reseller = db.getResellerByUserId(adminUser.id);
    res.json({
      user: adminUser,
      reseller,
      token: adminUser.id,
      message: 'Master Admin authenticated successfully',
    });
  });

  // Auth: Login / Switch User
  app.post('/api/v1/auth/login', (req: Request, res: Response) => {
    const { emailOrPhone, password, userId } = req.body;

    if (userId) {
      const user = db.getUserById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      const reseller = db.getResellerByUserId(user.id);
      return res.json({ user, reseller, token: user.id });
    }

    if (!emailOrPhone) {
      return res.status(400).json({ error: 'Email, phone number, or referral code is required' });
    }

    const { user, reseller } = db.findUserOrReseller(emailOrPhone);
    if (!user) {
      return res.status(401).json({ error: 'No account found matching this phone number, email, or referral code.' });
    }

    res.json({ user, reseller, token: user.id });
  });

  // Auth: Register Customer
  app.post('/api/v1/auth/register-customer', (req: Request, res: Response) => {
    const { name, email, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and Phone number are required' });
    }

    const existing = db.getUserByPhone(phone);
    if (existing) {
      return res.status(400).json({ error: 'An account with this phone number already exists' });
    }

    const user = db.createCustomer({
      name,
      email: email || `${phone}@customer.shadhin.com`,
      phone,
    });

    res.status(201).json({ user, token: user.id });
  });

  // Auth: Register Reseller
  app.post('/api/v1/auth/register-reseller', (req: Request, res: Response) => {
    const {
      name,
      email,
      phone,
      storeName,
      facebookPage,
      whatsappNumber,
      division,
      district,
      upazila,
      address,
      salesIntent,
      referredBy,
    } = req.body;

    if (!name || !phone || !storeName || !division || !district || !address) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const existing = db.getUserByPhone(phone);
    if (existing) {
      return res.status(400).json({ error: 'An account with this phone number already exists' });
    }

    const { user, reseller } = db.createReseller({
      user: {
        name,
        email: email || `${phone}@reseller.shadhin.com`,
        phone,
      },
      storeName,
      facebookPage,
      whatsappNumber: whatsappNumber || phone,
      division,
      district,
      upazila: upazila || district,
      address,
      salesIntent: salesIntent || 'Facebook & WhatsApp selling',
      referredBy,
    });

    res.status(201).json({ user, reseller, token: user.id });
  });

  // Products: List & Filter
  app.get('/api/v1/products', (req: Request, res: Response) => {
    const { category, search, trending, bestSeller, minPrice, maxPrice, sort } = req.query;
    let products = db.getProducts();

    if (category) {
      products = products.filter(
        (p) => p.categorySlug === category || p.category.toLowerCase() === String(category).toLowerCase()
      );
    }
    if (search) {
      const q = String(search).toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameBn.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (trending === 'true') {
      products = products.filter((p) => p.isTrending);
    }
    if (bestSeller === 'true') {
      products = products.filter((p) => p.isBestSeller);
    }
    if (minPrice) {
      products = products.filter((p) => p.resellerPrice >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p) => p.resellerPrice <= Number(maxPrice));
    }

    if (sort === 'profit_high') {
      products.sort(
        (a, b) => b.suggestedSellingPrice - b.resellerPrice - (a.suggestedSellingPrice - a.resellerPrice)
      );
    } else if (sort === 'price_low') {
      products.sort((a, b) => a.resellerPrice - b.resellerPrice);
    } else if (sort === 'price_high') {
      products.sort((a, b) => b.resellerPrice - a.resellerPrice);
    } else if (sort === 'popularity') {
      products.sort((a, b) => b.successfulSalesCount - a.successfulSalesCount);
    }

    res.json({ products, total: products.length });
  });

  // Products: Get Single Product by ID or Slug
  app.get('/api/v1/products/:idOrSlug', (req: Request, res: Response) => {
    const { idOrSlug } = req.params;
    const product = db.getProductById(idOrSlug) || db.getProductBySlug(idOrSlug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  });

  // Products: Calculate Profit Preview (Server-Side)
  app.post('/api/v1/products/profit-preview', (req: Request, res: Response) => {
    const { productId, sellingPrice, quantity, division } = req.body;
    const product = db.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const settings = db.getSettings();
    const calc = ProfitEngine.calculateOrder({
      baseCost: product.baseCost,
      resellerPrice: product.resellerPrice,
      actualSellingPrice: Number(sellingPrice) || product.suggestedSellingPrice,
      quantity: Number(quantity) || 1,
      division: division || 'Dhaka',
      platformFeePercent: settings.platformFeePercent,
    });

    res.json({
      product,
      calculation: calc,
    });
  });

  // Categories: List
  app.get('/api/v1/categories', (req: Request, res: Response) => {
    const categories = db.getCategories();
    res.json({ categories });
  });

  // Orders: List (with Role Filtering)
  app.get('/api/v1/orders', (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const { resellerId, customerPhone, status } = req.query;

    let orders = db.getOrders();

    if (user.role === 'RESELLER') {
      const reseller = db.getResellerByUserId(user.id);
      if (reseller) {
        orders = orders.filter((o) => o.resellerId === reseller.id);
      }
    } else if (user.role === 'CUSTOMER') {
      orders = orders.filter((o) => o.customerPhone === user.phone || o.customerId === user.id);
    } else if (resellerId) {
      orders = orders.filter((o) => o.resellerId === String(resellerId));
    } else if (customerPhone) {
      orders = orders.filter((o) => o.customerPhone === String(customerPhone));
    }

    if (status) {
      orders = orders.filter((o) => o.status === status);
    }

    res.json({ orders, total: orders.length });
  });

  // Orders: Get by ID or Track by Tracking Number
  app.get('/api/v1/orders/:idOrTracking', (req: Request, res: Response) => {
    const { idOrTracking } = req.params;
    const order =
      db.getOrderById(idOrTracking) ||
      db.getOrders().find(
        (o) =>
          o.trackingNumber.toLowerCase() === idOrTracking.toLowerCase() ||
          o.orderNumber.toLowerCase() === idOrTracking.toLowerCase()
      );

    if (!order) {
      return res.status(404).json({ error: 'Order not found with provided reference' });
    }
    res.json({ order });
  });

  // Orders: Create Order (Manual Reseller or Customer Checkout)
  app.post('/api/v1/orders', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const {
        customerName,
        customerPhone,
        customerEmail,
        division,
        district,
        upazila,
        address,
        postalCode,
        customerNote,
        resellerNote,
        resellerId: explicitResellerId,
        referralCode,
        items,
        paymentMethod,
        courier,
      } = req.body;

      if (!customerName || !customerPhone || !division || !district || !address || !items || !items.length) {
        return res.status(400).json({ error: 'Please provide all mandatory shipping details and order items' });
      }

      let determinedResellerId = explicitResellerId;
      if (!determinedResellerId && user.role === 'RESELLER') {
        const rsl = db.getResellerByUserId(user.id);
        determinedResellerId = rsl?.id;
      } else if (!determinedResellerId && referralCode) {
        const rsl = db.getResellerByReferralCode(referralCode);
        if (rsl) determinedResellerId = rsl.id;
      }

      const newOrder = db.createOrder({
        customerId: user.role === 'CUSTOMER' ? user.id : undefined,
        customerName,
        customerPhone,
        customerEmail,
        division,
        district,
        upazila: upazila || district,
        address,
        postalCode,
        customerNote,
        resellerNote,
        resellerId: determinedResellerId,
        items,
        paymentMethod: paymentMethod || 'COD',
        courier,
      });

      res.status(201).json({ order: newOrder });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create order' });
    }
  });

  // Orders: Update Status (Admin or Staff)
  app.patch('/api/v1/orders/:id/status', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only administrators can update order fulfillment statuses' });
      }

      const { id } = req.params;
      const { status, note } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const updatedOrder = db.updateOrderStatus(id, status, note || `Status set to ${status}`, user);
      res.json({ order: updatedOrder });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update order status' });
    }
  });

  // Wallet: Get Reseller Wallet and Ledger
  app.get('/api/v1/wallet', (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const { resellerId: queryResellerId } = req.query;

    let targetResellerId = queryResellerId ? String(queryResellerId) : undefined;
    if (!targetResellerId && user.role === 'RESELLER') {
      const reseller = db.getResellerByUserId(user.id);
      targetResellerId = reseller?.id;
    } else if (!targetResellerId && user.role === 'ADMIN') {
      targetResellerId = 'rsl-founder';
    }

    if (!targetResellerId) {
      return res.status(400).json({ error: 'Reseller ID required' });
    }

    const wallet = db.getWallet(targetResellerId);
    const transactions = db.getTransactions(targetResellerId);
    const withdrawals = db.getWithdrawals(targetResellerId);

    res.json({ wallet, transactions, withdrawals });
  });

  // Withdrawals: Request New Payout
  app.post('/api/v1/withdrawals/request', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const { amount, method, accountNumber, accountName, bankName, branchName, routingNumber, resellerId: reqResellerId } =
        req.body;

      let targetResellerId = reqResellerId;
      if (!targetResellerId && user.role === 'RESELLER') {
        const rsl = db.getResellerByUserId(user.id);
        targetResellerId = rsl?.id;
      } else if (!targetResellerId && user.role === 'ADMIN') {
        targetResellerId = 'rsl-founder';
      }

      if (!targetResellerId) {
        return res.status(400).json({ error: 'Reseller account required for withdrawal' });
      }

      const withdrawal = db.requestWithdrawal({
        resellerId: targetResellerId,
        amount: Number(amount),
        method: method || 'BKASH',
        accountNumber,
        accountName,
        bankName,
        branchName,
        routingNumber,
      });

      res.status(201).json({ withdrawal });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to submit withdrawal request' });
    }
  });

  // Withdrawals: Admin Update (Approve/Pay/Reject)
  app.patch('/api/v1/withdrawals/:id', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }

      const { id } = req.params;
      const { status, adminNote, transactionId } = req.body;

      const updated = db.updateWithdrawalStatus(id, status, adminNote, transactionId, user);
      res.json({ withdrawal: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update withdrawal' });
    }
  });

  // Leaderboard
  app.get('/api/v1/leaderboard', (req: Request, res: Response) => {
    const { period } = req.query;
    const leaderboard = db.getLeaderboard(period as any);
    res.json({ leaderboard });
  });

  // Gamification: Achievements & Challenges
  app.get('/api/v1/gamification', (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const reseller = db.getResellerByUserId(user.id);
    const resellerId = reseller?.id;

    const achievementsData = db.getAchievements(resellerId);
    const challenges = db.getWeeklyChallenges(resellerId);

    res.json({
      achievements: achievementsData.achievements,
      unlocked: achievementsData.unlocked,
      weeklyChallenges: challenges,
      resellerLevel: reseller ? reseller.level : 1,
      resellerXp: reseller ? reseller.xp : 0,
    });
  });

  // Reseller Academy
  app.get('/api/v1/academy/lessons', (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const reseller = db.getResellerByUserId(user.id);
    const lessons = db.getAcademyLessons(reseller?.id);
    res.json({ lessons });
  });

  app.post('/api/v1/academy/complete-lesson', (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const reseller = db.getResellerByUserId(user.id);
    if (!reseller) {
      return res.status(400).json({ error: 'Only registered resellers can earn academy XP' });
    }

    const { lessonId } = req.body;
    if (!lessonId) return res.status(400).json({ error: 'lessonId is required' });

    const completed = db.markLessonComplete(reseller.id, lessonId);
    res.json({ success: true, completedLessons: completed, updatedXp: reseller.xp, level: reseller.level });
  });

  // Referral: Track Clicks & Stats
  app.post('/api/v1/referrals/track-click', (req: Request, res: Response) => {
    const { code } = req.body;
    const count = db.trackReferralClick(code);
    res.json({ success: true, code, clickCount: count });
  });

  app.get('/api/v1/referrals/stats', (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const reseller = db.getResellerByUserId(user.id);
    if (!reseller) {
      return res.status(400).json({ error: 'Reseller not found' });
    }

    const clicks = db.getReferralClicks(reseller.referralCode);
    const orders = db.getOrdersByReseller(reseller.id);
    const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED');
    const totalEarned = deliveredOrders.reduce((acc, o) => acc + o.totalResellerProfit, 0);

    res.json({
      referralCode: reseller.referralCode,
      referralLink: `${req.protocol}://${req.get('host')}/?ref=${reseller.referralCode}`,
      clicks,
      totalOrders: orders.length,
      deliveredOrders: deliveredOrders.length,
      conversionRate: clicks > 0 ? ((orders.length / clicks) * 100).toFixed(1) : '0.0',
      totalEarned,
    });
  });

  // AI: ResellAI Platform Assistant Chat
  app.post('/api/v1/ai/chat', async (req: Request, res: Response) => {
    try {
      const { message, history, language } = req.body;
      if (!message) return res.status(400).json({ error: 'Message cannot be empty' });

      const products = db.getProducts().map((p) => ({
        id: p.id,
        name: p.name,
        nameBn: p.nameBn,
        category: p.category,
        resellerPrice: p.resellerPrice,
        suggestedSellingPrice: p.suggestedSellingPrice,
        potentialProfit: p.suggestedSellingPrice - p.resellerPrice,
        features: p.features,
        specifications: p.specifications,
        stock: p.stock,
        returnRatePercent: p.returnRatePercent,
      }));

      const user = getAuthenticatedUser(req);
      const result = await AIService.chatWithResellAI({
        message,
        history,
        products,
        userRole: user.role,
        language: language || 'en',
      });

      res.json(result);
    } catch (err: any) {
      console.error('AI chat endpoint error:', err);
      res.status(500).json({
        reply: "I'm here to help with Shadhin Reseller products, pricing, and orders!",
        source: 'fallback',
      });
    }
  });

  // AI: Selling Kit Generator (Facebook captions, WhatsApp pitch, objection handler)
  app.post('/api/v1/ai/selling-kit', async (req: Request, res: Response) => {
    try {
      const { productId } = req.body;
      const product = db.getProductById(productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      const kit = await AIService.generateSellingKit({
        id: product.id,
        name: product.name,
        nameBn: product.nameBn,
        category: product.category,
        resellerPrice: product.resellerPrice,
        suggestedSellingPrice: product.suggestedSellingPrice,
        potentialProfit: product.suggestedSellingPrice - product.resellerPrice,
        features: product.features,
        specifications: product.specifications,
        stock: product.stock,
        returnRatePercent: product.returnRatePercent,
      });

      res.json({ product, kit });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to generate AI selling kit' });
    }
  });

  // Admin: Comprehensive Business KPI Stats & Analytics
  app.get('/api/v1/admin/stats', (req: Request, res: Response) => {
    try {
      const orders = db.getOrders() || [];
      const resellers = db.getResellers() || [];
      const products = db.getProducts() || [];
      const withdrawals = db.getWithdrawals() || [];
      const settings = db.getSettings();

      const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED');
      const totalRevenue = deliveredOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
      const totalResellerProfit = deliveredOrders.reduce((acc, o) => acc + (o.totalResellerProfit || 0), 0);
      const totalPlatformMargin = deliveredOrders.reduce((acc, o) => acc + (o.totalPlatformMargin || 0), 0);
      const pendingWithdrawals = withdrawals.filter((w) => w.status === 'PENDING');
      const pendingResellers = resellers.filter((r) => r.status === 'PENDING');
      const returnedOrders = orders.filter((o) => o.status === 'RETURNED');

      res.json({
        stats: {
          totalOrders: orders.length,
          deliveredOrdersCount: deliveredOrders.length,
          totalRevenueBdt: totalRevenue,
          totalResellerProfitBdt: totalResellerProfit,
          totalPlatformMarginBdt: totalPlatformMargin,
          activeResellersCount: resellers.filter((r) => r.status === 'ACTIVE').length,
          pendingResellerApprovals: pendingResellers.length,
          pendingWithdrawalsCount: pendingWithdrawals.length,
          pendingWithdrawalsBdt: pendingWithdrawals.reduce((acc, w) => acc + (w.amount || 0), 0),
          returnedOrdersCount: returnedOrders.length,
          platformReturnRate: orders.length > 0 ? ((returnedOrders.length / orders.length) * 100).toFixed(1) : '0.0',
        },
        settings,
        recentOrders: orders.slice(0, 10),
        pendingWithdrawals,
        pendingResellers,
      });
    } catch (err: any) {
      console.error('Error fetching admin stats:', err);
      res.status(500).json({ error: 'Failed to retrieve admin stats' });
    }
  });

  // Reseller: Submit 500 TK Verification Fee Payment
  app.post('/api/v1/reseller/submit-fee', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const reseller = db.getResellerByUserId(user.id);
      if (!reseller) {
        return res.status(404).json({ error: 'Reseller profile not found' });
      }

      const { method, senderPhone, trxId, amount } = req.body;
      if (!method || !senderPhone || !trxId) {
        return res.status(400).json({ error: 'Payment method, sender mobile number, and Transaction ID (TrxID) are required' });
      }

      const updated = db.submitResellerFee(reseller.id, {
        method: method || 'BKASH',
        senderPhone,
        trxId,
        amount: Number(amount) || 500,
      });

      res.json({ reseller: updated, message: '500 TK payment submitted for review. Your account will be activated shortly!' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin: Freely Approve Reseller Without Fee
  app.post('/api/v1/admin/resellers/:id/approve-free', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const { id } = req.params;
      const updated = db.approveResellerFree(id, user);
      res.json({ reseller: updated, message: 'Reseller approved and verified for free!' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin: Verify Reseller 500 TK Payment & Approve
  app.post('/api/v1/admin/resellers/:id/verify-payment', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const { id } = req.params;
      const { approved, adminNote } = req.body;
      const updated = db.verifyResellerPayment(id, approved !== false, adminNote || '', user);
      res.json({ reseller: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin: Create Challenge (Daily, Weekly, Monthly) with Custom XP
  app.post('/api/v1/admin/challenges', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }

      const { title, description, frequency, metric, targetCount, rewardXp, rewardBonusBdt, startDate, endDate } = req.body;
      if (!title || !metric || !targetCount || !rewardXp) {
        return res.status(400).json({ error: 'Title, metric, target count, and XP reward are required' });
      }

      const challenge = db.createChallenge({
        title,
        description: description || '',
        frequency: frequency || 'WEEKLY',
        metric: metric || 'DELIVERIES',
        targetCount: Number(targetCount),
        rewardXp: Number(rewardXp),
        rewardBonusBdt: Number(rewardBonusBdt) || 0,
        startDate: startDate || new Date().toISOString(),
        endDate: endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }, user);

      res.status(201).json({ challenge });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin: Create Academy Video Lesson with Direct YouTube Link
  app.post('/api/v1/admin/academy/lessons', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }

      const {
        title,
        titleBn,
        courseId,
        courseTitle,
        description,
        youtubeUrl,
        durationMinutes,
        xpReward,
        contentMarkdown,
        keyTakeaways,
        actionSteps,
        order,
      } = req.body;

      if (!title || !courseTitle || !xpReward) {
        return res.status(400).json({ error: 'Lesson title, course title, and XP reward are required' });
      }

      const lesson = db.createAcademyLesson({
        title,
        titleBn: titleBn || title,
        courseId: courseId || 'crs-general',
        courseTitle,
        description: description || '',
        youtubeUrl: youtubeUrl || '',
        durationMinutes: Number(durationMinutes) || 5,
        xpReward: Number(xpReward),
        contentMarkdown: contentMarkdown || `### ${title}\n\nWatch the full video above to learn practical reselling tactics.`,
        keyTakeaways: Array.isArray(keyTakeaways) && keyTakeaways.length ? keyTakeaways : ['Follow actionable steps in the video'],
        actionSteps: Array.isArray(actionSteps) && actionSteps.length ? actionSteps : ['Apply strategy in your online store'],
        order: Number(order) || 99,
      }, user);

      res.status(201).json({ lesson });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin: Reseller Status Update
  app.patch('/api/v1/admin/resellers/:id/status', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const { id } = req.params;
      const { status } = req.body;
      const updated = db.updateResellerStatus(id, status, user);
      res.json({ reseller: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin: Create New Product
  app.post('/api/v1/admin/products', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }

      const product = db.createProduct(req.body, user);
      res.status(201).json({ product });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin: Bulk Create Products from CSV
  app.post('/api/v1/admin/products/bulk', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }

      const { products, replaceAll } = req.body;
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Please provide an array of products to import' });
      }

      const result = db.bulkCreateProducts(products, user, replaceAll === true);
      res.status(201).json({
        success: true,
        count: result.count,
        totalProducts: result.products.length,
        message: `Successfully imported ${result.count} products into catalog`,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to bulk import products' });
    }
  });

  // Admin: Update Product
  app.patch('/api/v1/admin/products/:id', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const product = db.updateProduct(req.params.id, req.body, user);
      res.json({ product });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin: Settings Update
  app.post('/api/v1/admin/settings', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const settings = db.updateSettings(req.body, user);
      res.json({ settings });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin: Audit Logs & Fraud Alerts
  app.get('/api/v1/admin/audit-logs', (req: Request, res: Response) => {
    res.json({ logs: db.getAuditLogs() });
  });

  app.get('/api/v1/admin/fraud-alerts', (req: Request, res: Response) => {
    res.json({ alerts: db.getFraudAlerts() });
  });

  // Reset Demo Database
  app.post('/api/v1/seed/reset', (req: Request, res: Response) => {
    const data = db.resetToFreshSeed();
    res.json({ success: true, message: 'Database reset to clean demo seed data' });
  });

  // --- Vite / Static Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Shadhin Reseller Server running on port ${PORT}`);
  });
}

startServer();
