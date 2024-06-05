import { UserProfile } from 'supabase';
import { Feather } from '@expo/vector-icons';
import { trpc } from '../../../../utils/trpc';
import { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

export default function FriendRequest({
  userProfile,
  relationship,
  refetchRelationship,
}: {
  userProfile: UserProfile;
  relationship: 'accepted' | 'rejected' | 'requested' | 'none';
  refetchRelationship: () => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const requestFriend = trpc.requestFriend.useMutation({
    onSettled(data, error) {
      if (error) {
        // toast.error('Error sending request');
      } else {
        // toast.success('Request sent!');
      }
      refetchRelationship();
      setIsLoading(false);
    },
  });
  console.log('relationship: ', relationship);

  return (
    <TouchableOpacity
      onPress={() => {
        setIsLoading(true);
        requestFriend.mutate({ to: userProfile.id });
      }}
      disabled={isLoading || relationship !== 'none'}
      className='mt-4 flex w-1/2 flex-row items-center justify-center rounded-full border border-zinc-800 px-4 py-2'
    >
      {/* {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} */}
      {relationship === 'none' && (
        <View className='flex flex-row items-center gap-2'>
          <Text className='text-white'>Add friend</Text>
          <Feather name='user-plus' size={16} color='white' />
        </View>
      )}
      {relationship === 'requested' && (
        <Text className='flex flex-row items-center gap-2 text-muted-foreground'>
          Request Pending
        </Text>
      )}
      {relationship === 'rejected' && (
        <Text className='flex flex-row items-center gap-2 text-muted-foreground'>
          Request Rejected
        </Text>
      )}
      {relationship === 'accepted' && (
        <Text className='flex flex-row items-center gap-2 text-muted-foreground'>
          Friends
        </Text>
      )}
    </TouchableOpacity>
  );
}
