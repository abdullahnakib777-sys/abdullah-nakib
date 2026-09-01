import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db';
import { ProfitEngine } from './server/profitEngine';
import { AIService } from './server/aiService';
import { User } from './src/types';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

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

    const cleanId = String(adminId).trim();
    const cleanPass = String(password).trim();

    const isValid = db.verifyAdminCredentials(cleanId, cleanPass);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid Admin Email or Password. Access Denied.' });
    }

    const adminUser = db.getUsers().find((u) => u.role === 'ADMIN') || db.getUserById('usr-founder');
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

  // Admin: Change Admin Password & Email
  app.post('/api/v1/admin/change-password', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required to change admin credentials' });
      }

      const { currentPassword, newPassword, newEmail } = req.body;
      if (!newPassword || newPassword.trim().length < 4) {
        return res.status(400).json({ error: 'New password must be at least 4 characters long' });
      }

      const result = db.updateAdminCredentials({
        currentPassword,
        newPassword,
        newEmail,
        actor: user,
      });

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update admin credentials' });
    }
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

    const { user, reseller, passwordMismatch } = (db.findUserOrReseller(emailOrPhone, password) as any);
    if (passwordMismatch) {
      return res.status(401).json({ error: 'Incorrect PIN or password. If you want to reset your PIN, click "Reset PIN".' });
    }
    if (!user) {
      return res.status(401).json({ error: 'No account found matching this phone number, email, or referral code.' });
    }

    res.json({ user, reseller, token: user.id });
  });

  // Auth: Reset / Update PIN
  app.post('/api/v1/auth/reset-pin', (req: Request, res: Response) => {
    const { phoneOrEmail, newPin } = req.body;
    if (!phoneOrEmail || !newPin) {
      return res.status(400).json({ error: 'Phone number and new PIN are required' });
    }
    try {
      const { user, reseller } = db.resetUserPinByPhone(phoneOrEmail, String(newPin).trim());
      res.json({
        user,
        reseller,
        token: user.id,
        message: 'PIN has been updated successfully! You are now logged in.',
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to reset PIN' });
    }
  });

  // Auth: Register Customer
  app.post('/api/v1/auth/register-customer', (req: Request, res: Response) => {
    const { name, email, phone, password } = req.body;
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
      password: password || undefined,
    });

    res.status(201).json({ user, token: user.id });
  });

  // Auth: Register Reseller
  app.post('/api/v1/auth/register-reseller', (req: Request, res: Response) => {
    const {
      name,
      email,
      phone,
      password,
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
        password: password || undefined,
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
      password: password || undefined,
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
      packagingFee: settings.packagingChargeBdt ?? 30,
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
      claimedXpBonus: reseller ? ((reseller as any).claimedXpBonus || 0) : 0,
    });
  });

  // Gamification: Claim XP to BDT Bonus to Wallet Balance (Ultra Better rank 701+ XP required)
  app.post('/api/v1/gamification/claim-xp-bonus', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const reseller = db.getResellerByUserId(user.id);
      if (!reseller) {
        return res.status(400).json({ error: 'Reseller account required to claim XP bonus' });
      }

      const result = db.claimXpBonusToWallet(reseller.id, user);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to claim XP bonus' });
    }
  });

  // Admin: Get Achievements / Badges List
  app.get('/api/v1/admin/achievements', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const data = db.getAchievements();
      res.json({ achievements: data.achievements });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin: Create Badge / Achievement
  app.post('/api/v1/admin/achievements', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const { title, titleBn, description, icon, category, xpReward, badgeReward, conditionType, threshold } = req.body;
      if (!title || !xpReward) {
        return res.status(400).json({ error: 'Title and XP reward are required' });
      }

      const ach = db.createAchievement({
        title,
        titleBn: titleBn || title,
        description: description || '',
        icon: icon || 'Award',
        category: category || 'SALES',
        xpReward: Number(xpReward),
        badgeReward: badgeReward || '⭐ Star Reseller',
        conditionType: conditionType || 'SALES_COUNT',
        threshold: Number(threshold) || 1,
      }, user);

      res.status(201).json({ achievement: ach, message: 'Badge created successfully!' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin: Update Badge / Achievement
  app.patch('/api/v1/admin/achievements/:id', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const { id } = req.params;
      const updated = db.updateAchievement(id, req.body, user);
      res.json({ achievement: updated, message: 'Badge updated successfully!' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin: Delete Badge / Achievement
  app.delete('/api/v1/admin/achievements/:id', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const { id } = req.params;
      const result = db.deleteAchievement(id, user);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin: Reset Badges to Default
  app.post('/api/v1/admin/achievements/reset', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const list = db.resetAchievementsToDefaults(user);
      res.json({ achievements: list, message: 'Badges reset to default system list!' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
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

  // Admin: Get All Resellers with Full Details
  app.get('/api/v1/admin/resellers', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const detailedResellers = db.getAllResellersWithDetails();
      res.json({ resellers: detailedResellers });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch resellers list' });
    }
  });

  // Admin: Update Reseller Details, Metrics & Profit
  app.patch('/api/v1/admin/resellers/:id', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const { id } = req.params;
      const updated = db.updateResellerAdmin(id, req.body, user);
      res.json({ reseller: updated, message: 'Reseller profile and metrics updated successfully!' });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update reseller' });
    }
  });

  // Admin: Award or Set Manual XP to Reseller
  app.post('/api/v1/admin/resellers/:id/award-xp', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const { id } = req.params;
      const { amount, reason, mode } = req.body;

      if (amount === undefined || isNaN(Number(amount))) {
        return res.status(400).json({ error: 'Valid XP amount is required' });
      }

      const awardResult = db.awardResellerXpManual(
        id,
        Number(amount),
        reason || 'Manual Admin XP Award',
        user,
        mode || 'ADD'
      );

      res.json({
        success: true,
        ...awardResult,
        message: mode === 'SET' 
          ? `Successfully set exact XP to ${awardResult.newXp} for ${awardResult.reseller.storeName}! (Level: ${awardResult.newLevel})`
          : mode === 'DEDUCT'
          ? `Successfully deducted -${amount} XP from ${awardResult.reseller.storeName}! (New XP: ${awardResult.newXp}, Level: ${awardResult.newLevel})`
          : `Successfully awarded +${amount} XP to ${awardResult.reseller.storeName}! (New XP: ${awardResult.newXp}, Level: ${awardResult.newLevel})`,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to award XP' });
    }
  });

  // Admin: Get Leaderboard Data & Full Overrides Configuration
  app.get('/api/v1/admin/leaderboard', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const { period } = req.query;
      const data = db.getLeaderboardAdmin((period as any) || 'allTime');
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to fetch admin leaderboard' });
    }
  });

  // Admin: Update/Set Leaderboard Override for a Reseller
  app.post('/api/v1/admin/leaderboard/override', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const { resellerId, overrides } = req.body;
      if (!resellerId) {
        return res.status(400).json({ error: 'resellerId is required' });
      }
      const result = db.updateLeaderboardOverride(resellerId, overrides || {}, user);
      res.json({
        ...result,
        message: 'Leaderboard override saved successfully!',
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update leaderboard override' });
    }
  });

  // Admin: Delete Leaderboard Override for a Reseller (Reset to auto)
  app.delete('/api/v1/admin/leaderboard/override/:resellerId', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const { resellerId } = req.params;
      const result = db.deleteLeaderboardOverride(resellerId, user);
      res.json({
        ...result,
        message: 'Leaderboard override removed and reset to default calculation.',
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to delete leaderboard override' });
    }
  });

  // Admin: Add Custom Showcase Reseller / VIP Entry
  app.post('/api/v1/admin/leaderboard/custom-entry', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const entry = req.body;
      if (!entry.storeName) {
        return res.status(400).json({ error: 'Store name is required' });
      }
      const result = db.addCustomLeaderboardEntry(entry, user);
      res.status(201).json({
        entry: result,
        message: 'Custom leaderboard showcase entry added successfully!',
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to add custom leaderboard entry' });
    }
  });

  // Admin: Delete Custom Showcase Entry
  app.delete('/api/v1/admin/leaderboard/custom-entry/:id', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const { id } = req.params;
      const result = db.deleteCustomLeaderboardEntry(id, user);
      res.json({
        ...result,
        message: 'Custom entry deleted successfully.',
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to delete custom entry' });
    }
  });

  // Admin: Save Leaderboard Global Configuration
  app.put('/api/v1/admin/leaderboard/config', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const config = db.saveLeaderboardConfig(req.body, user);
      res.json({
        config,
        message: 'Leaderboard settings saved successfully!',
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update leaderboard config' });
    }
  });

  // Admin: Get All Registered Users
  app.get('/api/v1/admin/users', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const users = db.getUsers();
      res.json({ users });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch users' });
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

  // Admin: Delete Challenge
  app.delete('/api/v1/admin/challenges/:id', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }

      const result = db.deleteChallenge(req.params.id, user);
      res.json(result);
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

  // Admin: Delete Academy Video Lesson
  app.delete('/api/v1/admin/academy/lessons/:id', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }

      const result = db.deleteAcademyLesson(req.params.id, user);
      res.json(result);
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

  app.put('/api/v1/admin/products/:id', (req: Request, res: Response) => {
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

  // Admin: Delete Product
  app.delete('/api/v1/admin/products/:id', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin permissions required' });
      }
      const result = db.deleteProduct(req.params.id, user);
      res.json(result);
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

  // --- Marketing Notifications & Broadcasts API ---

  // Reseller / User: Get notifications
  app.get('/api/v1/notifications', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const queryResellerId = req.query.resellerId ? String(req.query.resellerId) : undefined;
      const reseller = user ? db.getResellerByUserId(user.id) : undefined;
      const resellerId = queryResellerId || reseller?.id || (user?.role === 'RESELLER' ? user.id : undefined);
      const notifications = db.getNotifications(resellerId);
      const unreadCount = notifications.filter(
        (n) => !resellerId || !n.readBy || !n.readBy.includes(resellerId)
      ).length;

      res.json({ notifications, unreadCount });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch notifications' });
    }
  });

  // Admin: Get all notifications with full recipient metrics
  app.get('/api/v1/admin/notifications', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      const notifications = db.getAllNotificationsAdmin();
      res.json({ notifications });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch admin notifications' });
    }
  });

  // Admin: Send / Broadcast new notification with marketing poster
  app.post('/api/v1/admin/notifications', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const {
        title,
        titleBn,
        message,
        messageBn,
        posterImage,
        targetType,
        targetResellerIds,
        badge,
        badgeBn,
        displayType,
        actionType,
        productId,
        actionUrl,
        actionLabel,
        actionLabelBn,
        priority,
        popupOnLogin,
        isActive,
      } = req.body;

      if (!title || !posterImage) {
        return res.status(400).json({ error: 'Notification title and marketing poster image URL are required' });
      }

      const notification = db.createNotification(
        {
          title,
          titleBn,
          message,
          messageBn,
          posterImage,
          targetType: targetType || 'ALL',
          targetResellerIds: Array.isArray(targetResellerIds) ? targetResellerIds : [],
          badge,
          badgeBn,
          displayType: displayType || (popupOnLogin ? 'POPUP_ON_LOGIN' : 'TOP_CAROUSEL'),
          actionType,
          productId,
          actionUrl,
          actionLabel,
          actionLabelBn,
          priority: priority || 'NORMAL',
          popupOnLogin: Boolean(popupOnLogin),
          isActive: isActive !== undefined ? Boolean(isActive) : true,
        },
        user
      );

      res.status(201).json({
        success: true,
        notification,
        message: targetType === 'ALL'
          ? 'Marketing poster broadcasted to all resellers successfully!'
          : `Marketing poster sent to ${targetResellerIds?.length || 1} targeted reseller(s) successfully!`,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create notification' });
    }
  });

  // Admin: Update existing notification / marketing poster
  app.put('/api/v1/admin/notifications/:id', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const updated = db.updateNotification(req.params.id, req.body, user);
      if (!updated) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      res.json({
        success: true,
        notification: updated,
        message: 'Notification / poster updated successfully!',
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update notification' });
    }
  });

  // Reseller: Mark single notification as read
  app.post('/api/v1/notifications/:id/read', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const reseller = user ? db.getResellerByUserId(user.id) : undefined;
      const resellerId = req.body?.resellerId || reseller?.id || (user?.role === 'RESELLER' ? user.id : 'rsl-founder');
      const success = db.markNotificationRead(req.params.id, resellerId);
      res.json({ success });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Reseller: Mark all notifications as read
  app.post('/api/v1/notifications/mark-all-read', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const reseller = user ? db.getResellerByUserId(user.id) : undefined;
      const resellerId = req.body?.resellerId || reseller?.id || (user?.role === 'RESELLER' ? user.id : 'rsl-founder');
      const success = db.markAllNotificationsRead(resellerId);
      res.json({ success });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin: Delete notification
  app.delete('/api/v1/admin/notifications/:id', (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      const success = db.deleteNotification(req.params.id, user);
      res.json({ success, message: 'Notification removed successfully' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
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
