import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { trpc } from '../../../utils/trpc';
import { useCallback, useContext, useState } from 'react';
import { SupabaseContext } from '../../../utils/supabaseProvider';
import TicketsPage from './TicketsPage';

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
          <View>
            {upcomingEvents?.length == 0 && (
              <View>
                <Text className="text-white font-semibold text-lg text-center pt-20">
                  No upcoming events
                </Text>
                <Text className="text-muted-foreground font-light text-center">
                  Check out the events page to explore upcoming events
                </Text>
              </View>
            )}
          </View>
          <TicketsPage
            upcomingEvents={upcomingEvents}
            upcomingEventsLoading={upcomingEventsLoading}
          />
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center bg-black px-4">
          <Text className="text-white font-bold text-3xl pb-6">
            Sign In to View Tickets
          </Text>
        </View>
      )}
    </View>
  );
};

export default Tickets;
