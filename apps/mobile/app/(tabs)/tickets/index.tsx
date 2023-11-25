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
import TicketsPage from '../../components/TicketsPage';
import UserSignInForm from '../../components/UserSignInForm';
import { Link } from 'expo-router';

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
    data: tickets,
    isLoading: ticketsLoading,
    refetch,
  } = trpc.getTicketsForUser.useQuery({ user_id: user?.id! });

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
          <TicketsPage tickets={tickets} ticketsLoading={ticketsLoading} />
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center bg-black px-4">
          <Text className="text-white font-bold text-3xl pb-6">
            Sign In to View tickets
          </Text>

          {/* <View className="py-2 w-full">
            <Link href="/profile">
              <TouchableOpacity className="bg-white py-3 rounded-xl">
                <Text className="text-black text-center font-bold">
                  Sign In Page
                </Text>
              </TouchableOpacity>
            </Link>
          </View> */}
        </View>
      )}
    </View>
  );
};

export default Tickets;
