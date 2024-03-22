import {
  ScrollView,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { useContext, useState } from 'react';
import { UserProfile } from 'supabase';
import { trpc } from '../../../utils/trpc';
import ProfileCard from '../../components/ProfileCard';
import { SupabaseContext } from '../../../utils/supabaseProvider';
import UsersList from '../../components/UsersLists';

export default function Modal() {
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>('');
  const supabaseContext = useContext(SupabaseContext);
  const { user } = supabaseContext;

  const handleInputChange = (input: string) => {
    setUserSearch(input);
  };

  const { data: users, isLoading: usersLoading } = trpc.getAllUsers.useQuery();

  const { data: userProfile, isLoading: profileLoading } =
    trpc.getUserProfile.useQuery(
      {
        id: user?.id!,
      },
      { enabled: !!user }
    );

  const createChat = trpc.createChat.useMutation({
    onSettled(data, error) {
      if (error) {
        console.error(error);
        if (error.message === 'User is already in an organization') {
          // toast.error('User already in organization', {
          //   description: 'Please try a different username',
          // });
        } else {
          // toast.error('Error', {
          //   description: error.message,
          // });
        }
      } else if (data) {
        console.log(data);

        router.replace(`/messages/${data}`);
        // setDialogOpen(false);
        setSelectedUsers(null);
        setUserSearch('');
      }
      setIsLoading(false);
    },
  });
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack();
  return (
    <View className="flex-1 justify-center bg-black pt-4">
      {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
      {!isPresented && (
        <Link href="../" className="text-white">
          Dismiss
        </Link>
      )}
      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
      <StatusBar style="light" />

      <View className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Text className="text-center text-muted-foreground">
            Select users to start a chat with.
          </Text>
          <View className="flex flex-col">
            {selectedUsers?.map((user) => {
              return (
                <View
                  key={user.id}
                  className="mx-4 my-2 rounded-full border border-zinc-800 p-2"
                >
                  <ProfileCard userProfile={user} />
                </View>
              );
            })}
          </View>
          <View className="flex w-full flex-row space-x-2 pt-8 pb-8 justify-center">
            <TextInput
              placeholder="username"
              className="rounded-full flex-1 py-3 px-6 items-center text-muted-foreground border border-zinc-800"
              onChangeText={handleInputChange}
            />
            <TouchableOpacity
              disabled={isLoading || !selectedUsers?.length}
              className="w-28 rounded-full bg-white p-3 items-center justify-center"
              onPress={() => {
                setIsLoading(true);
                createChat.mutate({
                  usernames: selectedUsers?.map((user) => user.username!)!,
                });
              }}
            >
              <Text className="font-semibold"> Start Chat</Text>
            </TouchableOpacity>
          </View>

          <UsersList
            users={users}
            usersLoading={usersLoading}
            userProfile={userProfile!}
            maxUsers={6}
            userSearch={userSearch}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        </ScrollView>
      </View>
    </View>
  );
}
