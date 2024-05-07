import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { trpc } from '../../../utils/trpc';
import { useContext } from 'react';
import { SupabaseContext } from '../../../utils/supabaseProvider';
import { FriendRequestContext } from './friendRequestsProvider';
import { Feather } from '@expo/vector-icons';
import RenderChats from './RenderChats';
import { Link } from 'expo-router';

const Tickets = () => {
  const supabaseContext = useContext(SupabaseContext);
  const { session, user } = supabaseContext;
  const { friendRequests } = useContext(FriendRequestContext);

  const { data: userProfile, isLoading: profileLoading } =
    trpc.getUserProfile.useQuery({
      id: user?.id!,
    });

  return (
    <View className="flex-1 bg-black">
      {session && user ? (
        <ScrollView>
          <Link href="/messages/requests" asChild>
            <TouchableOpacity className="flex flex-row w-full items-center justify-between border-b border-zinc-800 px-4 py-6 font-medium hover:bg-zinc-800/50 focus:bg-secondary">
              <View className="flex flex-row gap-4 items-center">
                <Feather name="users" color="white" size={20} />
                <Text className="text-white font-bold text-lg">
                  Friend Requests
                </Text>
              </View>
              {friendRequests && friendRequests?.length > 0 && (
                <View className="flex pr-2">
                  <View className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-700 text-xs font-light">
                    <Text className="text-white text-xs">
                      {friendRequests?.length}
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </Link>
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
