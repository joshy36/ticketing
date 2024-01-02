import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { trpc } from '../../../utils/trpc';
import { useCallback, useContext, useState } from 'react';
import { SupabaseContext } from '../../../utils/supabaseProvider';
import TicketsPage from '../../components/TicketsPage';

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
    data: upcomingEvents,
    isLoading: upcomingEventsLoading,
    refetch,
  } = trpc.getUpcomingEventsForUser.useQuery({
    user_id: user?.id!,
  });

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
          <TicketsPage
            upcomingEvents={upcomingEvents}
            upcomingEventsLoading={upcomingEventsLoading}
          />
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center bg-black px-4">
          <Text className="text-white font-bold text-3xl pb-6">
            Sign In to View tickets
          </Text>
        </View>
      )}
    </View>
  );
};

export default Tickets;
