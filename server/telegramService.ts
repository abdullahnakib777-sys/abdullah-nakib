import { db } from './db';
import { Order, ResellerProfile } from '../src/types';

function escapeHtml(text: string | number | undefined | null): string {
  if (text === undefined || text === null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export class TelegramService {
  private static getEffectiveConfig(customToken?: string, customChatId?: string) {
    const settings = db.getSettings();
    const token = customToken || settings.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN || '';
    const chatId = customChatId || settings.telegramChatId || process.env.TELEGRAM_CHAT_ID || '';
    const enabled = settings.telegramNotificationsEnabled !== false;

    return { token: token.trim(), chatId: chatId.trim(), enabled, settings };
  }

  /**
   * Send a raw HTML formatted message to Telegram Bot
   */
  public static async sendMessage(
    htmlMessage: string,
    customToken?: string,
    customChatId?: string
  ): Promise<{ success: boolean; messageId?: number; error?: string }> {
    const { token, chatId, enabled } = this.getEffectiveConfig(customToken, customChatId);

    if (!token || !chatId) {
      return {
        success: false,
        error: 'Telegram Bot Token or Chat ID is missing. Please configure them in Admin Settings or .env.',
      };
    }

    if (!customToken && !customChatId && !enabled) {
      return {
        success: false,
        error: 'Telegram notifications are currently disabled in platform settings.',
      };
    }

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: htmlMessage,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        console.error('Telegram API error:', data);
        return {
          success: false,
          error: data?.description || `Telegram HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        messageId: data.result?.message_id,
      };
    } catch (err: any) {
      console.error('Failed to send Telegram notification:', err);
      return {
        success: false,
        error: err.message || 'Network error communicating with Telegram API',
      };
    }
  }

  /**
   * Send test connection ping
   */
  public static async sendTestMessage(
    token?: string,
    chatId?: string
  ): Promise<{ success: boolean; message: string; error?: string }> {
    const timeNow = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Dhaka',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const text = [
      `🔔 <b>TELEGRAM NOTIFICATION CONNECTED!</b> ✅`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Your <b>MeherMart &amp; Shadhin Reseller</b> Telegram alert bridge is now fully operational and linked!`,
      ``,
      `📌 <b>Active Configuration:</b>`,
      `• <b>Chat ID:</b> <code>${escapeHtml(chatId || '(Configured)')}</code>`,
      `• <b>Server Time:</b> ${escapeHtml(timeNow)} (BD Time)`,
      ``,
      `🚀 <b>You will now receive automatic alerts for:</b>`,
      `1️⃣ <b>New Reseller Registrations</b> (Store details, contact &amp; location)`,
      `2️⃣ <b>New Customer Orders</b> (Items, selling price &amp; profit)`,
      `3️⃣ <b>Daily Business &amp; Sales Summary</b> (Automated nightly recap)`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `✨ <i>Shadhin Reseller BD Master Admin Notification Service</i>`,
    ].join('\n');

    const res = await this.sendMessage(text, token, chatId);
    if (res.success) {
      return {
        success: true,
        message: 'Test message sent successfully to your Telegram chat!',
      };
    } else {
      return {
        success: false,
        message: res.error || 'Failed to send test message.',
        error: res.error,
      };
    }
  }

  /**
   * Send alert when a new reseller joins
   */
  public static async notifyNewReseller(data: {
    name: string;
    email?: string;
    phone: string;
    storeName: string;
    whatsappNumber?: string;
    division?: string;
    district?: string;
    upazila?: string;
    address?: string;
    salesIntent?: string;
    referralCode: string;
    referredBy?: string;
  }): Promise<{ success: boolean; error?: string }> {
    const settings = db.getSettings();
    if (settings.telegramNotifyOnNewReseller === false) {
      return { success: true };
    }

    const timeNow = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Dhaka',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const text = [
      `🚀 <b>NEW RESELLER REGISTERED!</b> 🆕`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏪 <b>Store Name:</b> <b>${escapeHtml(data.storeName)}</b>`,
      `👤 <b>Owner Name:</b> ${escapeHtml(data.name)}`,
      `📱 <b>Phone:</b> <code>${escapeHtml(data.phone)}</code>`,
      `💬 <b>WhatsApp:</b> <code>${escapeHtml(data.whatsappNumber || data.phone)}</code>`,
      `📍 <b>Location:</b> ${escapeHtml(data.district || 'Dhaka')}, ${escapeHtml(data.division || 'Dhaka')}`,
      data.address ? `🏠 <b>Address:</b> ${escapeHtml(data.address)}` : '',
      `🎯 <b>Sales Channel:</b> ${escapeHtml(data.salesIntent || 'Social Media & WhatsApp')}`,
      `🎟️ <b>Store Referral Code:</b> <code>${escapeHtml(data.referralCode)}</code>`,
      data.referredBy ? `🤝 <b>Referred By:</b> <code>${escapeHtml(data.referredBy)}</code> (+250 XP bonus applied)` : `🤝 <b>Referred By:</b> <i>Direct Registration</i>`,
      `🕒 <b>Joined:</b> ${escapeHtml(timeNow)} (BD Time)`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `👉 <i>Log in to Admin Panel to verify and manage this reseller.</i>`,
    ]
      .filter(Boolean)
      .join('\n');

    return this.sendMessage(text);
  }

  /**
   * Send alert when an order is placed
   */
  public static async notifyNewOrder(
    order: Order,
    reseller?: ResellerProfile
  ): Promise<{ success: boolean; error?: string }> {
    const settings = db.getSettings();
    if (settings.telegramNotifyOnNewOrder === false) {
      return { success: true };
    }

    const timeNow = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Dhaka',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const itemsSummary = (order.items || [])
      .map((item, idx) => {
        const itemProfit = (item.resellerProfit || 0) * (item.quantity || 1);
        return `  ${idx + 1}. <b>${escapeHtml(item.productName)}</b> × ${item.quantity} (৳${item.unitSellingPrice || item.resellerPrice || 0}${itemProfit > 0 ? `, Profit: +৳${itemProfit}` : ''})`;
      })
      .join('\n');

    const text = [
      `🛒 <b>NEW ORDER RECEIVED!</b> 📦`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🔢 <b>Order No:</b> <code>${escapeHtml(order.orderNumber || order.id)}</code>`,
      `🏪 <b>Reseller Store:</b> <b>${escapeHtml(order.resellerStoreName || reseller?.storeName || 'Direct')}</b>`,
      `👤 <b>Customer:</b> ${escapeHtml(order.customerName)} (<code>${escapeHtml(order.customerPhone)}</code>)`,
      `📍 <b>Delivery Address:</b> ${escapeHtml(order.address || order.district)}, ${escapeHtml(order.district)}`,
      ``,
      `🛍️ <b>Ordered Items (${order.items?.length || 1}):</b>`,
      itemsSummary,
      ``,
      `💵 <b>Total Customer Bill:</b> <b>৳${(order.totalAmount || 0).toLocaleString()}</b>`,
      `💰 <b>Reseller Profit:</b> <span class="tg-spoiler"><b>+৳${(order.totalResellerProfit || 0).toLocaleString()}</b></span>`,
      `🚚 <b>Courier / Payment:</b> ${escapeHtml(order.courier || 'STEADFAST')} • ${escapeHtml(order.paymentMethod || 'COD')}`,
      `🕒 <b>Time:</b> ${escapeHtml(timeNow)} (BD Time)`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📦 <i>Fulfill packaging and dispatch via courier dashboard.</i>`,
    ]
      .filter(Boolean)
      .join('\n');

    return this.sendMessage(text);
  }

  /**
   * Generate and send the daily business report
   */
  public static async sendDailyReport(): Promise<{ success: boolean; reportSummary?: any; error?: string }> {
    const settings = db.getSettings();
    const orders = db.getOrders();
    const resellers = db.getAllResellersWithDetails();
    const withdrawals = db.getWithdrawals();
    const users = db.getUsers();

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const dateFormatted = now.toLocaleDateString('en-GB', {
      timeZone: 'Asia/Dhaka',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Calculate today's orders
    const todayOrders = orders.filter((o) => {
      if (!o.createdAt) return false;
      const orderDate = new Date(o.createdAt).toISOString().slice(0, 10);
      return orderDate === todayStr;
    });

    const todayDelivered = todayOrders.filter((o) => o.status === 'DELIVERED');
    const todaySales = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const todayResellerProfit = todayOrders.reduce((sum, o) => sum + (o.totalResellerProfit || 0), 0);
    const todayPlatformMargin = todayOrders.reduce((sum, o) => sum + (o.totalPlatformMargin || 0), 0);

    // Reseller metrics
    const todayNewResellers = resellers.filter((r) => {
      if (!r.createdAt) return false;
      return new Date(r.createdAt).toISOString().slice(0, 10) === todayStr;
    });

    const activeResellers = resellers.filter((r) => r.status === 'ACTIVE');

    // Pending withdrawals
    const pendingWithdrawals = withdrawals.filter((w) => w.status === 'PENDING');
    const pendingWithdrawalAmount = pendingWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

    // Top selling products today (or recent)
    const productCountMap: Record<string, { name: string; count: number; revenue: number }> = {};
    (todayOrders.length > 0 ? todayOrders : orders.slice(0, 20)).forEach((ord) => {
      (ord.items || []).forEach((item) => {
        const key = item.productId || item.productName;
        if (!productCountMap[key]) {
          productCountMap[key] = { name: item.productName, count: 0, revenue: 0 };
        }
        productCountMap[key].count += item.quantity || 1;
        productCountMap[key].revenue += (item.unitSellingPrice || 0) * (item.quantity || 1);
      });
    });

    const topProducts = Object.values(productCountMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const topProductsText = topProducts.length > 0
      ? topProducts.map((p, i) => `  ${i + 1}. <b>${escapeHtml(p.name)}</b> (${p.count} pcs • ৳${p.revenue.toLocaleString()})`).join('\n')
      : '  <i>No item sales recorded today yet.</i>';

    const text = [
      `📊 <b>DAILY BUSINESS &amp; SALES REPORT</b> 📈`,
      `📅 <b>${escapeHtml(dateFormatted)}</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `💰 <b>Today's Financial Performance:</b>`,
      `• 🛒 Total Orders Placed: <b>${todayOrders.length} orders</b>`,
      `• 📦 Delivered / Completed: <b>${todayDelivered.length} orders</b>`,
      `• 💵 Gross Sales Volume: <b>৳${todaySales.toLocaleString()} BDT</b>`,
      `• 💸 Reseller Profit Margin: <b>+৳${todayResellerProfit.toLocaleString()} BDT</b>`,
      `• 🏢 Platform Net Revenue: <b>৳${todayPlatformMargin.toLocaleString()} BDT</b>`,
      ``,
      `👥 <b>Reseller Network Growth:</b>`,
      `• 🆕 New Resellers Today: <b>+${todayNewResellers.length} members</b>`,
      `• 🏬 Total Registered Resellers: <b>${resellers.length} stores</b>`,
      `• ⭐ Active Verified Stores: <b>${activeResellers.length}</b>`,
      ``,
      `🔥 <b>Top Moving Catalog Items:</b>`,
      topProductsText,
      ``,
      `💳 <b>Financial Settlement Status:</b>`,
      `• ⏳ Pending Reseller Withdrawals: <b>${pendingWithdrawals.length} requests</b> (৳${pendingWithdrawalAmount.toLocaleString()} BDT)`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🤖 <i>Automated Daily Nightly Dispatch • MeherMart / Shadhin Reseller BD</i>`,
    ].join('\n');

    const res = await this.sendMessage(text);

    if (res.success) {
      // Record last sent timestamp in settings
      settings.telegramLastDailyReportSentAt = new Date().toISOString();
      db.save();
    }

    return {
      success: res.success,
      reportSummary: {
        date: todayStr,
        todayOrdersCount: todayOrders.length,
        todaySales,
        todayResellerProfit,
        todayNewResellersCount: todayNewResellers.length,
        totalResellersCount: resellers.length,
        pendingWithdrawalsCount: pendingWithdrawals.length,
      },
      error: res.error,
    };
  }
}
