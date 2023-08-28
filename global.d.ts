import type { Database as DB } from './database.types';

declare global {
  type Database = DB;
  type Events = DB['public']['Tables']['events']['Row'];
  type UserProfile = DB['public']['Tables']['user_profiles']['Row'];
}
