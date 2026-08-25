import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  writeBatch,
  DocumentData,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { DatabaseSchema } from './db';

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
      // console.log('Successfully committed snapshot to Cloud Firestore');
    } catch (err) {
      console.warn('Error saving to Cloud Firestore:', err);
    } finally {
      this.isSyncing = false;
    }
  }
}
