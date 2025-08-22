import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';

// Singleton Supabase admin client with SERVICE_ROLE
class SupabaseAdmin {
  private static instance: SupabaseClient | null = null;

  public static getInstance(): SupabaseClient {
    if (!SupabaseAdmin.instance) {
      if (!config.supabase.url || !config.supabase.serviceRole) {
        throw new Error('Missing Supabase configuration. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE environment variables.');
      }

      SupabaseAdmin.instance = createClient(
        config.supabase.url,
        config.supabase.serviceRole,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );
    }

    return SupabaseAdmin.instance;
  }
}

export const supabaseAdmin = SupabaseAdmin.getInstance();