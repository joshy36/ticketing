import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { RouterOutputs } from '../../../utils/trpc';
import { useCallback, useContext, useState } from 'react';
import { SupabaseContext } from '../../../providers/supabaseProvider';
import TicketsPage from './TicketsPage';
import { Link } from 'expo-router';
import { TicketsContext } from '../../../providers/ticketsProvider';

const Tickets = () => {
  const [refreshing, setRefreshing] = useState(false);

  const { session, user, userProfile } = useContext(SupabaseContext);
  const { tickets, refetchTickets, refetchPush } = useContext(TicketsContext);

  function extractUniqueEvents(
    tickets: RouterOutputs['getTicketsForUser'] | null | undefined,
  ) {
    const uniqueEventsMap = new Map();

    tickets?.tickets?.forEach((ticket) => {
      uniqueEventsMap.set(ticket?.events?.id, ticket.events);
    });

    return Array.from(uniqueEventsMap.values());
  }

  let uniqueEvents = extractUniqueEvents(tickets);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchPush();
    uniqueEvents = extractUniqueEvents(tickets);
    refetchTickets().then(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <View className='flex-1 bg-black pb-36'>
      {session && user ? (
        <View className='flex-1'>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor='white'
              />
            }
          >
            <View>
              {uniqueEvents?.length == 0 && (
                <View>
                  <Text className='pt-20 text-center text-lg font-semibold text-white'>
                    No upcoming events
                  </Text>
                  <Text className='text-center font-light text-muted-foreground'>
                    Check out the events page to explore upcoming events
                  </Text>
                </View>
              )}
            </View>
            <TicketsPage
              userProfile={userProfile}
              uniqueEvents={uniqueEvents}
            />
          </ScrollView>
          <View className='absolute -bottom-10 w-full border-t border-zinc-800'>
            <Link href='/tickets/scanIn' className='flex w-full pt-4'>
              {/* <View className="bg-white rounded-full p-3"> */}
              <Text className='text-center font-semibold text-white'>
                Scan In
              </Text>
              {/* </View> */}
            </Link>
          </View>
        </View>
      ) : (
        <View className='flex-1 items-center justify-center bg-black px-4'>
          <Text className='pb-6 text-3xl font-bold text-white'>
            Sign In to View Tickets
          </Text>
        </View>
      )}
    </View>
  );
};

export default Tickets;
