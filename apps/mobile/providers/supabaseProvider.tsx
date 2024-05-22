import { Session, User } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from 'react';
import { ExpoSecureStoreAdapter, supabase } from '../utils/supabaseExpo';
import { Alert } from 'react-native';
import { trpc } from '../utils/trpc';
import { UserProfile } from 'supabase';

type SupabaseContextProps = {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null | undefined;
  userProfileLoading: boolean;
  initialized?: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

type SupabaseProviderProps = {
  children: React.ReactNode;
};

export const SupabaseContext = createContext<SupabaseContextProps>({
  user: null,
  session: null,
  userProfile: null,
  userProfileLoading: false,
  initialized: false,
  signUp: async () => {},
  signInWithPassword: async () => {},
  signOut: async () => {},
});

// https://github.com/FlemingVincent/expo-supabase-starter/blob/main/context/SupabaseProvider.tsx

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<
    UserProfile | null | undefined
  >(null);

  const {
    data: profile,
    isLoading: userProfileLoading,
    refetch,
  } = trpc.getUserProfile.useQuery(
    {
      id: user?.id,
    },
    { enabled: !!user }
  );

  useEffect(() => {
    setUserProfile(profile);
  }, [profile]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) {
      throw error;
    }
  };

  useEffect(() => {
    // Listen for changes to authentication state
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      ExpoSecureStoreAdapter.setItem('mobile-session', JSON.stringify(session));
      setSession(session);
      setUser(session ? session.user : null);
      refetch();
      setInitialized(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider
      value={{
        user,
        userProfile,
        userProfileLoading,
        session,
        initialized,
        signUp,
        signInWithPassword,
        signOut,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};
