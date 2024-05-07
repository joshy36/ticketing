import { trpc } from '../../../utils/trpc';
import ProfileCard from '../../components/ProfileCard';
import { useContext } from 'react';
import { FriendRequestContext } from './friendRequestsProvider';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ToastManager, { Toast } from 'toastify-react-native';

export default function Requests() {
  const { friendRequests, setFriendRequests, friendRequestsLoading } =
    useContext(FriendRequestContext);

  const rejectRequest = trpc.rejectFriendRequest.useMutation({
    onMutate(data) {
      const newRequests = friendRequests?.filter(
        (request) => request.from.id !== data.from
      );
      setFriendRequests(newRequests!);
      Toast.success('Request rejected!');
      //   toast.success('Request rejected!');
    },
  });

  const acceptRequest = trpc.acceptFriendRequest.useMutation({
    onMutate(data) {
      const newRequests = friendRequests?.filter(
        (request) => request.from.id !== data.from
      );
      setFriendRequests(newRequests!);
      //   toast.success('Request accepted!');
      Toast.success('Request accepted!');
    },
  });

  return (
    <View className="flex-1 bg-black">
      <View className="flex w-full flex-col">
        {friendRequests?.length === 0 && !friendRequestsLoading ? (
          <View className="flex h-64 flex-col items-center justify-center">
            <Text className="text-muted-foreground">
              No new friend requests.
            </Text>
          </View>
        ) : (
          <View>
            {friendRequests?.map((request) => {
              return (
                <View
                  key={request.id}
                  className="flex flex-row justify-between border-b border-zinc-800 p-4"
                >
                  <ProfileCard userProfile={request.from!} />
                  <View className="flex flex-row gap-3">
                    <TouchableOpacity
                      className="p-3 rounded-full border border-zinc-800 bg-red-800 flex items-center"
                      onPress={() => {
                        rejectRequest.mutate({ from: request.from.id });
                      }}
                    >
                      <Feather name="x" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="p-3 rounded-full border border-zinc-800 flex items-center"
                      onPress={() => {
                        acceptRequest.mutate({ from: request.from.id });
                      }}
                    >
                      <Feather name="check" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}
