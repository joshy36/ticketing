import { View, ScrollView, Text } from 'react-native';
import { trpc } from '../../../utils/trpc';
import { useContext } from 'react';
import { SupabaseContext } from '../../../utils/supabaseProvider';

import RenderChats from './RenderChats';

const Tickets = () => {
  const supabaseContext = useContext(SupabaseContext);
  const { session, user } = supabaseContext;

  const { data: userProfile, isLoading: profileLoading } =
    trpc.getUserProfile.useQuery({
      id: user?.id!,
    });

  return (
    <View className="flex-1 bg-black">
      {session && user ? (
        <ScrollView>
          {/* <MessagePage messages={messages!} refetch={refetch} /> */}
          <RenderChats userProfile={userProfile!} />
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
