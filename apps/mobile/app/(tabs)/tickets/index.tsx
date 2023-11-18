import { View, ScrollView, RefreshControl } from 'react-native';
import { trpc } from '../../../utils/trpc';
import { useCallback, useContext, useState } from 'react';
import { SupabaseContext } from '../../../utils/supabaseProvider';
import TicketsPage from '../../components/TicketsPage';
import UserSignInForm from '../../components/UserSignInForm';

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
        <UserSignInForm />
      )}
    </View>
  );
};

export default Tickets;
