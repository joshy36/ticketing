import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { trpc } from '../../../utils/trpc';
import { useCallback, useContext, useState } from 'react';
import { SupabaseContext } from '../../../utils/supabaseProvider';
import TicketsPage from './TicketsPage';
import { Link } from 'expo-router';
import { TicketsContext } from '../../../providers/ticketsProvider';

const Tickets = () => {
  const [refreshing, setRefreshing] = useState(false);

  const { session, user, userProfile } = useContext(SupabaseContext);
  const { upcomingEvents, refetchTickets, refetchUpcomingEvents, refetchPush } =
    useContext(TicketsContext);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchUpcomingEvents();
    await refetchPush();
    refetchTickets().then(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <View className="flex-1 bg-black pb-36">
      {session && user ? (
        <View className="flex-1">
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
            <TicketsPage userProfile={userProfile} />
          </ScrollView>
          <View className="-bottom-10 absolute w-full border-t border-zinc-800">
            <Link href="/tickets/scanIn" className="flex w-full pt-4">
              {/* <View className="bg-white rounded-full p-3"> */}
              <Text className="text-center text-white font-semibold">
                Scan In
              </Text>
              {/* </View> */}
            </Link>
          </View>
        </View>
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
