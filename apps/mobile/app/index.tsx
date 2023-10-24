import { registerRootComponent } from 'expo';
import { Redirect, router } from 'expo-router';
import { useEffect } from 'react';
import createClientClient from '../utils/supabaseClient';

export default function App() {
  // useEffect(() => {
  //   const supabase = createClientClient();
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     if (session) {
  //       router.replace('/(tabs)/home');
  //     } else {
  //       console.log('no user');
  //     }
  //   });

  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     if (session) {
  //       router.replace('/(tabs)/home/');
  //     } else {
  //       console.log('no user');
  //       router.replace('/(auth)/login');
  //     }
  //   });
  // }, []);

  return <Redirect href="home" />;
}

registerRootComponent(App);
