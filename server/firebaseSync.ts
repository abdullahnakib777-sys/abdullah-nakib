import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  writeBatch,
  onSnapshot,
  query,
  where,
  DocumentData,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { DatabaseSchema, db } from './db';
import { TelegramService } from './telegramService';
import { Order, ResellerProfile } from '../src/types';

let firestoreInstance: ReturnType<typeof getFirestore> | null = null;

export function getFirestoreDb() {
  if (!firestoreInstance) {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
  }
  return firestoreInstance;
}

const GLOBAL_STATE_DOC = 'global_v1';

/**
 * Deeply strips `undefined` keys and values from objects and arrays
 * so Firestore WriteBatch / setDoc does not throw "Unsupported field value: undefined"
 */
export function cleanForFirestore<T>(data: T): any {
  if (data === null || data === undefined) {
    return null;
  }

  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => cleanForFirestore(item));
  }

  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = cleanForFirestore(value);
      }
    }
    return cleaned;
  }

  return data;
}

export class FirebaseSyncService {
  private static isSyncing = false;
  private static processedOrderIds = new Set<string>();
  private static processedResellerIds = new Set<string>();
  private static isListenersInitialized = false;

  /**
   * Loads persisted database snapshot from Cloud Firestore
   */
  public static async loadFromCloud(): Promise<DatabaseSchema | null> {
    try {
      const fsDb = getFirestoreDb();
      const stateDocRef = doc(fsDb, 'app_state', GLOBAL_STATE_DOC);
      const snap = await getDoc(stateDocRef);

      if (snap.exists()) {
        const data = snap.data();
        if (data && data.payload) {
          const parsed = JSON.parse(data.payload) as DatabaseSchema;
          console.log('Successfully synced data from Cloud Firestore');
          return parsed;
        }
      }
      return null;
    } catch (err) {
      console.warn('Could not load initial state from Cloud Firestore (will use local fallback):', err);
      return null;
    }
  }

  /**
   * Initializes real-time Firestore watchers for new Orders and new Resellers
   * Dispatches automated Telegram notifications when events occur in Cloud Firestore
   */
  public static startFirestoreListeners(): void {
    if (this.isListenersInitialized) return;
    this.isListenersInitialized = true;

    try {
      const fsDb = getFirestoreDb();
      console.log('⚡ Initializing real-time Firestore triggers for Telegram notifications...');

      // Seed initial known IDs from memory so existing records don't re-trigger alerts on boot
      db.getOrders().forEach((o) => this.processedOrderIds.add(o.id));
      db.getAllResellersWithDetails().forEach((r) => this.processedResellerIds.add(r.id));

      // 1. Watch for new Orders in Firestore
      const ordersCol = collection(fsDb, 'orders');
      onSnapshot(ordersCol, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const orderData = change.doc.data() as any;
            const orderId = change.doc.id || orderData.id;

            if (orderId && !this.processedOrderIds.has(orderId)) {
              this.processedOrderIds.add(orderId);

              // Check if recent (within last 30 minutes)
              const createdAt = orderData.createdAt ? new Date(orderData.createdAt).getTime() : Date.now();
              const isRecent = Date.now() - createdAt < 30 * 60 * 1000;

              if (isRecent) {
                console.log(`[Firestore Trigger] New Order detected: ${orderId}. Sending Telegram alert...`);
                const items = orderData.items || [];
                const orderObj: Order = {
                  id: orderId,
                  orderNumber: orderData.orderNumber || orderId,
                  resellerId: orderData.resellerId || '',
                  resellerStoreName: orderData.storeName || orderData.resellerStoreName,
                  customerId: orderData.customerId || '',
                  customerName: orderData.customerName || 'Customer',
                  customerPhone: orderData.customerPhone || '',
                  division: orderData.division || 'Dhaka',
                  district: orderData.district || 'Dhaka',
                  upazila: orderData.upazila || orderData.district || 'Dhaka',
                  address: orderData.customerAddress || orderData.address || '',
                  items,
                  itemCount: items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0),
                  subtotal: orderData.subtotal || orderData.totalAmount || 0,
                  deliveryFee: orderData.deliveryFee || 0,
                  platformFee: orderData.platformFee || 0,
                  totalAmount: orderData.totalCustomerPrice || orderData.totalAmount || 0,
                  totalResellerProfit: orderData.resellerProfit || orderData.totalResellerProfit || 0,
                  totalPlatformMargin: orderData.platformMargin || 0,
                  profitStatus: orderData.profitStatus || 'PENDING',
                  status: orderData.orderStatus || orderData.status || 'PENDING',
                  paymentMethod: orderData.paymentMethod || 'COD',
                  paymentStatus: orderData.paymentStatus || 'UNPAID',
                  courier: orderData.courierName || orderData.courier || 'STEADFAST',
                  trackingNumber: orderData.courierTrackingCode || orderData.trackingNumber || '',
                  statusHistory: orderData.statusHistory || [],
                  createdAt: orderData.createdAt || new Date().toISOString(),
                  isDirectCustomerOrder: Boolean(orderData.isDirectCustomerOrder),
                };

                TelegramService.notifyNewOrder(orderObj).catch((err) =>
                  console.error('[Firestore Trigger] Error notifying order to Telegram:', err)
                );
              }
            }
          }
        });
      }, (err) => {
        console.warn('[Firestore Trigger] Orders listener warning:', err.message);
      });

      // 2. Watch for new Resellers in Firestore
      const resellersCol = collection(fsDb, 'resellers');
      onSnapshot(resellersCol, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const resData = change.doc.data() as any;
            const resellerId = change.doc.id || resData.id;

            if (resellerId && !this.processedResellerIds.has(resellerId)) {
              this.processedResellerIds.add(resellerId);

              const createdAt = resData.joinedAt || resData.createdAt
                ? new Date(resData.joinedAt || resData.createdAt).getTime()
                : Date.now();
              const isRecent = Date.now() - createdAt < 30 * 60 * 1000;

              if (isRecent) {
                console.log(`[Firestore Trigger] New Reseller detected: ${resellerId}. Sending Telegram alert...`);
                TelegramService.notifyNewReseller({
                  name: resData.storeName || 'New Reseller',
                  email: resData.email,
                  phone: resData.phone || '',
                  storeName: resData.storeName || 'Shadhin Store',
                  whatsappNumber: resData.whatsappNumber || resData.phone,
                  division: resData.division || 'Dhaka',
                  district: resData.district || 'Dhaka',
                  upazila: resData.upazila || resData.district || 'Dhaka',
                  address: resData.address,
                  salesIntent: resData.salesIntent || 'Online Store',
                  referralCode: resData.referralCode || resellerId,
                  referredBy: resData.referredBy,
                }).catch((err) =>
                  console.error('[Firestore Trigger] Error notifying reseller to Telegram:', err)
                );
              }
            }
          }
        });
      }, (err) => {
        console.warn('[Firestore Trigger] Resellers listener warning:', err.message);
      });

    } catch (err) {
      console.warn('Failed to start Firestore real-time listeners:', err);
    }
  }

  /**
   * Asynchronously syncs state to Cloud Firestore document collections and global snapshot
   */
  public static async saveToCloud(data: DatabaseSchema): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const fsDb = getFirestoreDb();

      // 1. Save global snapshot for fast atomic restoration
      const stateDocRef = doc(fsDb, 'app_state', GLOBAL_STATE_DOC);
      await setDoc(stateDocRef, {
        id: GLOBAL_STATE_DOC,
        payload: JSON.stringify(data),
        updatedAt: new Date().toISOString(),
      });

      // 2. Also mirror primary queryable collections into Firestore collections
      const batch = writeBatch(fsDb);

      // Save users (resellers & customers)
      data.users.slice(0, 50).forEach((user) => {
        const ref = doc(fsDb, 'users', user.id);
        batch.set(ref, cleanForFirestore(user), { merge: true });
      });

      // Save resellers
      data.resellers.slice(0, 50).forEach((reseller) => {
        const ref = doc(fsDb, 'resellers', reseller.id);
        batch.set(ref, cleanForFirestore(reseller), { merge: true });
      });

      // Save top products
      data.products.slice(0, 50).forEach((prod) => {
        const ref = doc(fsDb, 'products', prod.id);
        batch.set(ref, cleanForFirestore(prod), { merge: true });
      });

      // Save orders
      data.orders.slice(0, 50).forEach((order) => {
        const ref = doc(fsDb, 'orders', order.id);
        batch.set(ref, cleanForFirestore(order), { merge: true });
      });

      // Save wallets
      Object.values(data.wallets).forEach((wallet) => {
        const ref = doc(fsDb, 'wallets', wallet.resellerId);
        batch.set(ref, cleanForFirestore(wallet), { merge: true });
      });

      // Save withdrawals
      data.withdrawals.forEach((w) => {
        const ref = doc(fsDb, 'withdrawals', w.id);
        batch.set(ref, cleanForFirestore(w), { merge: true });
      });

      await batch.commit();
    } catch (err) {
      console.warn('Error saving to Cloud Firestore:', err);
    } finally {
      this.isSyncing = false;
    }
  }
}

