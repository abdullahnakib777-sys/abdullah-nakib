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
   * Sanitizes and normalizes the Supabase URL, auto-correcting .supabase.com typos to .supabase.co
   */
  public static getFormattedUrl(): string {
    let url = (process.env.SUPABASE_URL || '').trim();
    if (!url) {
      return DEFAULT_SUPABASE_URL;
    }
    // Remove trailing slashes
    url = url.replace(/\/+$/, '');
    // Correct common typo: Supabase project API endpoints end in .supabase.co, not .supabase.com
    if (url.includes('.supabase.com')) {
      url = url.replace('.supabase.com', '.supabase.co');
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    return url;
  }

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
      const url = this.getFormattedUrl();
      const key = (process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)!.trim();

      try {
        client = createClient(url, key, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        });
      } catch (err) {
        console.warn('[Supabase] Client initialization error:', err);
        return null;
      }
    }

    return client;
  }

  /**
   * Returns current synchronization health & status
   */
  public static getStatus() {
    const configured = this.isConfigured();
    const url = this.getFormattedUrl();
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
        if (error.code === 'PGRST116') {
          console.log('[Supabase] Initial app_state snapshot row not found yet (will be created on first sync)');
        } else if (error.message?.includes('fetch failed')) {
          console.warn('[Supabase] Note: Network connection to Supabase endpoint was unavailable; using local persistence.');
        } else {
          console.log('[Supabase] Note on load:', error.message);
        }
        return null;
      }

      if (data?.payload) {
        const parsed = typeof data.payload === 'string' ? JSON.parse(data.payload) : data.payload;
        console.log('[Supabase] Successfully loaded cloud state snapshot from Supabase');
        lastSyncStatus = 'SUCCESS';
        lastSyncError = null;
        lastSyncTime = new Date().toISOString();
        return parsed as DatabaseSchema;
      }

      return null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('fetch failed')) {
        console.warn('[Supabase] Network notice: Supabase endpoint unreachable; fallback to local storage active.');
      } else {
        console.warn('[Supabase] Error loading snapshot from Supabase:', msg);
      }
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
