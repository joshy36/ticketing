import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { ipAddress } from './helpers';

let supabaseUrl;

if (process.env.EXPO_PUBLIC_ENV === 'prod') {
  supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
} else {
  supabaseUrl = `http://${ipAddress}:54321`;
}

const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const ExpoSecureStoreAdapter = {
  getItem: (key: any) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: any, value: any) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: any) => {
    SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
