import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { trpc } from '../../../utils/trpc';
import { useCallback, useContext, useState } from 'react';
import { SupabaseContext } from '../../../utils/supabaseProvider';
import MessagePage from './MessagePage';
import { useFocusEffect } from 'expo-router';

const Tickets = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
    });
  }, []);
  const supabaseContext = useContext(SupabaseContext);
  const { session, user } = supabaseContext;

  const {
    data: messages,
    isLoading: messagesLoading,
    refetch,
  } = trpc.getMessagesForUser.useQuery();

  // useFocusEffect(
  //   useCallback(() => {
  //     // Do something when the screen is focused
  //     console.log('focused');
  //     refetch();
  //     console.log('refetched');
  //     return async () => {
  //       // Do something when the screen is unfocused
  //       refetch();
  //     };
  //   }, [])
  // );

  return (
    <View className="flex-1 bg-black">
      {session && user ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="white"
            />
          }
        >
          <MessagePage messages={messages!} refetch={refetch} />
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center bg-black px-4">
          <Text className="text-white font-bold text-3xl pb-6">
            Sign In to View Messages
          </Text>
        </View>
      )}
    </View>
  );
};

export default Tickets;
