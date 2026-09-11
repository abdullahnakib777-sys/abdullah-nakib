import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseSchema } from './db';

const DEFAULT_SUPABASE_URL = 'https://otxnivolxzxrrtvklegj.supabase.co';

let client: SupabaseClient | null = null;
let isSyncing = false;
let lastSyncTime: string | null = null;
let lastSyncStatus: 'IDLE' | 'SUCCESS' | 'ERROR' = 'IDLE';
let lastSyncError: string | null = null;

export class SupabaseService {
  /**
   * Returns true if Supabase URL and Key are configured in environment variables
   */
  public static isConfigured(): boolean {
    const key = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    return Boolean(key && key.trim().length > 0);
  }

  /**
   * Lazy-initializes and returns the Supabase client
   */
  public static getClient(): SupabaseClient | null {
    if (!this.isConfigured()) {
      return null;
    }

    if (!client) {
      const url = process.env.SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL;
      const key = (process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)!.trim();

      client = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    }

    return client;
  }

  /**
   * Returns current synchronization health & status
   */
  public static getStatus() {
    const configured = this.isConfigured();
    const url = process.env.SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL;
    return {
      configured,
      url,
      lastSyncTime,
      lastSyncStatus: configured ? lastSyncStatus : 'AWAITING_API_KEY',
      lastSyncError,
    };
  }

  /**
   * Attempts to load database state from Supabase app_state table
   */
  public static async loadFromSupabase(): Promise<DatabaseSchema | null> {
    const sb = this.getClient();
    if (!sb) return null;

    try {
      const { data, error } = await sb
        .from('app_state')
        .select('payload')
        .eq('id', 'global_v1')
        .single();

      if (error) {
        // Table might not exist yet or no row found
        console.log('[Supabase] Note on load:', error.message);
        return null;
      }

      if (data?.payload) {
        const parsed = typeof data.payload === 'string' ? JSON.parse(data.payload) : data.payload;
        console.log('[Supabase] Successfully loaded cloud state snapshot from Supabase');
        return parsed as DatabaseSchema;
      }

      return null;
    } catch (err) {
      console.warn('[Supabase] Error loading snapshot from Supabase:', err instanceof Error ? err.message : err);
      return null;
    }
  }

  /**
   * Synchronizes complete application state to Supabase
   */
  public static async saveToSupabase(data: DatabaseSchema): Promise<boolean> {
    const sb = this.getClient();
    if (!sb || isSyncing) return false;

    isSyncing = true;
    try {
      const { error } = await sb
        .from('app_state')
        .upsert(
          {
            id: 'global_v1',
            payload: data,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (error) {
        lastSyncStatus = 'ERROR';
        if (error.message.includes('Could not find the table') || error.code === 'PGRST205') {
          lastSyncError = 'Table "app_state" not created yet. Please run the SQL in supabase_schema.sql inside your Supabase SQL Editor.';
        } else {
          lastSyncError = error.message;
        }
        console.warn('[Supabase] Sync notice:', lastSyncError);
        return false;
      }

      lastSyncStatus = 'SUCCESS';
      lastSyncError = null;
      lastSyncTime = new Date().toISOString();
      return true;
    } catch (err) {
      lastSyncStatus = 'ERROR';
      lastSyncError = err instanceof Error ? err.message : String(err);
      console.warn('[Supabase] Save exception:', lastSyncError);
      return false;
    } finally {
      isSyncing = false;
    }
  }
}
