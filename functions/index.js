/**
 * Firebase Cloud Functions (v2) for Shadhin Reseller & MeherMart
 * Automatically triggers Telegram alerts when new Resellers join or new Orders are placed in Firestore.
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

function escapeHtml(text) {
  if (text === undefined || text === null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendTelegramMessage(htmlMessage) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram Bot Token or Chat ID not configured in functions environment.');
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const result = await res.json();
    if (!res.ok || !result.ok) {
      console.error('Telegram API error:', result);
    }
  } catch (err) {
    console.error('Failed to send Telegram message from Cloud Function:', err);
  }
}

/**
 * Trigger: On New Reseller Document Created in Firestore ('resellers/{resellerId}')
 */
exports.onResellerCreated = onDocumentCreated('resellers/{resellerId}', async (event) => {
  const snap = event.data;
  if (!snap) return;

  const data = snap.data();
  const timeNow = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Dhaka',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const text = [
    `🚀 <b>NEW RESELLER REGISTERED! (Cloud Function Trigger)</b> 🆕`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🏪 <b>Store Name:</b> <b>${escapeHtml(data.storeName || 'New Store')}</b>`,
    `👤 <b>Owner Name:</b> ${escapeHtml(data.name || data.storeName)}`,
    `📱 <b>Phone:</b> <code>${escapeHtml(data.phone || 'N/A')}</code>`,
    `💬 <b>WhatsApp:</b> <code>${escapeHtml(data.whatsappNumber || data.phone || 'N/A')}</code>`,
    `📍 <b>Location:</b> ${escapeHtml(data.district || 'Dhaka')}, ${escapeHtml(data.division || 'Dhaka')}`,
    data.address ? `🏠 <b>Address:</b> ${escapeHtml(data.address)}` : '',
    `🎯 <b>Sales Channel:</b> ${escapeHtml(data.salesIntent || 'Online Store')}`,
    `🎟️ <b>Store Referral Code:</b> <code>${escapeHtml(data.referralCode || snap.id)}</code>`,
    data.referredBy ? `🤝 <b>Referred By:</b> <code>${escapeHtml(data.referredBy)}</code>` : `🤝 <b>Referred By:</b> <i>Direct Registration</i>`,
    `🕒 <b>Joined:</b> ${escapeHtml(timeNow)} (BD Time)`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👉 <i>Log in to Admin Panel to verify and manage this reseller.</i>`,
  ]
    .filter(Boolean)
    .join('\n');

  await sendTelegramMessage(text);
});

/**
 * Trigger: On New User Document Created in Firestore ('users/{userId}')
 */
exports.onUserCreated = onDocumentCreated('users/{userId}', async (event) => {
  const snap = event.data;
  if (!snap) return;

  const data = snap.data();
  if (data.role !== 'RESELLER') return; // Only notify for reseller account signups

  const timeNow = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Dhaka',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const text = [
    `👤 <b>NEW USER SIGNUP (Cloud Function Trigger)</b> 🆕`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 <b>Name:</b> ${escapeHtml(data.name)}`,
    `📧 <b>Email:</b> ${escapeHtml(data.email || 'N/A')}`,
    `📱 <b>Phone:</b> <code>${escapeHtml(data.phone || 'N/A')}</code>`,
    `🛡️ <b>Role:</b> <b>${escapeHtml(data.role)}</b>`,
    `🕒 <b>Time:</b> ${escapeHtml(timeNow)} (BD Time)`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
  ].join('\n');

  await sendTelegramMessage(text);
});

/**
 * Trigger: On New Order Document Created in Firestore ('orders/{orderId}')
 */
exports.onOrderCreated = onDocumentCreated('orders/{orderId}', async (event) => {
  const snap = event.data;
  if (!snap) return;

  const order = snap.data();
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
    `🛒 <b>NEW ORDER RECEIVED! (Cloud Function Trigger)</b> 📦`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🔢 <b>Order No:</b> <code>${escapeHtml(order.orderNumber || snap.id)}</code>`,
    `🏪 <b>Reseller Store:</b> <b>${escapeHtml(order.storeName || order.resellerStoreName || 'Direct')}</b>`,
    `👤 <b>Customer:</b> ${escapeHtml(order.customerName || 'Customer')} (<code>${escapeHtml(order.customerPhone || 'N/A')}</code>)`,
    `📍 <b>Delivery Address:</b> ${escapeHtml(order.customerAddress || order.address || order.district || 'Dhaka')}, ${escapeHtml(order.district || 'Dhaka')}`,
    ``,
    `🛍️ <b>Ordered Items (${order.items?.length || 1}):</b>`,
    itemsSummary || '  <i>Standard item details</i>',
    ``,
    `💵 <b>Total Customer Bill:</b> <b>৳${(order.totalCustomerPrice || order.totalAmount || 0).toLocaleString()}</b>`,
    `💰 <b>Reseller Profit:</b> <span class="tg-spoiler"><b>+৳${(order.resellerProfit || order.totalResellerProfit || 0).toLocaleString()}</b></span>`,
    `🚚 <b>Courier / Payment:</b> ${escapeHtml(order.courierName || order.courier || 'STEADFAST')} • ${escapeHtml(order.paymentMethod || 'COD')}`,
    `🕒 <b>Time:</b> ${escapeHtml(timeNow)} (BD Time)`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📦 <i>Fulfill packaging and dispatch via courier dashboard.</i>`,
  ]
    .filter(Boolean)
    .join('\n');

  await sendTelegramMessage(text);
});
