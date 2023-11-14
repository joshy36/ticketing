import { View, Text, ScrollView } from 'react-native';
import { trpc } from '../../../utils/trpc';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { dateToString } from '../../../utils/helpers';
import { blurhash } from '../../../utils/helpers';
import { useContext } from 'react';
import { SupabaseContext } from '../../../utils/supabaseProvider';
import TicketsPage from '../../components/TicketsPage';
import UserSignInForm from '../../components/UserSignInForm';

const Tickets = () => {
  const supabaseContext = useContext(SupabaseContext);
  const { session, user } = supabaseContext;

  const { data: tickets, isLoading: ticketsLoading } =
    trpc.getTicketsForUser.useQuery({ user_id: user?.id! });

  return (
    <View className="flex-1 bg-black">
      {session && user ? (
        <TicketsPage tickets={tickets} ticketsLoading={ticketsLoading} />
      ) : (
        <UserSignInForm />
      )}
    </View>
  );
};

export default Tickets;
