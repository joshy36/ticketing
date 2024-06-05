import { View, Text } from 'react-native';
import { trpc } from '../../../utils/trpc';
import { SupabaseContext } from '../../../providers/supabaseProvider';
import RenderChats from './RenderChats';
import { useContext } from 'react';

const Tickets = () => {
  const supabaseContext = useContext(SupabaseContext);
  const { session, user } = supabaseContext;

  const { data: userProfile, isLoading: profileLoading } =
    trpc.getUserProfile.useQuery({
      id: user?.id!,
    });

  return (
    <View className='flex-1 bg-black'>
      {session && user ? (
        <View className='flex-1'>
          <RenderChats userProfile={userProfile!} />
        </View>
      ) : (
        <View className='flex-1 items-center justify-center bg-black px-4'>
          <Text className='pb-6 text-3xl font-bold text-white'>
            Sign In to View Messages
          </Text>
        </View>
      )}
    </View>
  );
};

export default Tickets;
