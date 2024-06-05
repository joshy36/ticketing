import { Check } from 'lucide-react';
import ProfileCard from './ProfileCard';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { RouterOutputs } from 'api';
import { UserProfile } from 'supabase';
import { Dispatch, SetStateAction } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
// import { toast } from 'sonner';

export default function UsersListSingle({
  users,
  usersLoading,
  userProfile,
  userSearch,
  selectedUsers,
  setSelectedUsers,
}: {
  users: RouterOutputs['getAllUsers'] | null | undefined;
  usersLoading: boolean;
  userProfile: UserProfile;
  userSearch: string;
  selectedUsers: UserProfile[] | null;
  setSelectedUsers: Dispatch<SetStateAction<UserProfile[] | null>>;
}) {
  return (
    <View>
      {usersLoading ? (
        <View>
          <Text className='text-white'>Loading...</Text>
        </View>
      ) : (
        <ScrollView>
          {users?.length === 0 && (
            <Text className='pt-8 text-center text-sm font-light text-muted-foreground'>
              No users found.
            </Text>
          )}
          {users
            ?.filter(
              (user) =>
                user?.id !== userProfile.id && // Exclude currently signed-in user
                (user?.username
                  ?.toLowerCase()
                  .includes(userSearch.toLowerCase()) ||
                  user?.first_name
                    ?.toLowerCase()
                    .includes(userSearch.toLowerCase()) ||
                  user?.last_name
                    ?.toLowerCase()
                    .includes(userSearch.toLowerCase()) ||
                  `${user.first_name} ${user.last_name}`
                    .toLowerCase()
                    .includes(userSearch.toLowerCase())),
            )
            .slice(0, 10)
            .map((user) => {
              return (
                <TouchableOpacity
                  key={user.id}
                  className='flex w-full justify-between border-b border-zinc-800 px-2 py-2'
                  onPress={() => {
                    // if user is not selected add them
                    if (!selectedUsers?.find((u) => u.id === user.id)) {
                      if (selectedUsers?.length === 1) {
                        setSelectedUsers([user]);
                      } else {
                        setSelectedUsers([...(selectedUsers || []), user]);
                      }
                    } else {
                      // if user is selected remove them
                      setSelectedUsers(
                        selectedUsers?.filter((u) => u.id !== user.id),
                      );
                    }
                  }}
                >
                  <View className='flex flex-row items-center justify-between'>
                    <ProfileCard userProfile={user} />
                    {selectedUsers?.find((u) => u.id === user.id) && (
                      <Ionicons
                        name={'checkmark-outline'}
                        size={25}
                        color={'white'}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      )}
    </View>
  );
}
