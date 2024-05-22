import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { useContext, useState } from 'react';
import { UserProfile } from 'supabase';
import { trpc } from '../../../../utils/trpc';
import ProfileCard from '../../../components/ProfileCard';
import { SupabaseContext } from '../../../../providers/supabaseProvider';
import { useLocalSearchParams } from 'expo-router';
import UsersListSingle from '@/app/components/UsersListSingle';
import { TicketsContext } from '../../../../providers/ticketsProvider';

export default function Modal() {
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>('');
  const { userProfile } = useContext(SupabaseContext);
  const { refetchTickets } = useContext(TicketsContext);
  const { id } = useLocalSearchParams();

  const handleInputChange = (input: string) => {
    setUserSearch(input);
  };

  const {
    data: users,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = trpc.getTotalFriendsForUser.useQuery({
    username: userProfile?.username!,
  });

  const { data: selectedTicket } = trpc.getTicketById.useQuery({
    id: id as string,
  });

  const requestTransfer = trpc.requestTransferTicketPush.useMutation({
    onSettled: async (data, error) => {
      await refetchTickets();
      await refetchUsers();
      if (error) {
        // toast.error(`Error requesting transfer: ${error.message}`);
        console.error('Error requesting transfer: ', error);
      } else {
        // toast.success('Ticket transfer request sent!');
      }
      setIsLoading(false);
      setSelectedUsers(null);
      router.back();
    },
  });

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack();
  return (
    <View className="flex-1 justify-center bg-black pt-4">
      {!isPresented && (
        <Link href="../" className="text-white">
          <Text className="text-white"> Dismiss</Text>
        </Link>
      )}
      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
      <StatusBar style="light" />
      <View className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Text className="text-center text-muted-foreground">
            Select a user to transfer the ticket to.
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
                requestTransfer.mutate({
                  to: selectedUsers![0]!.id,
                  ticket_id: id as string,
                });
              }}
            >
              <View className="flex flex-row">
                {isLoading && <ActivityIndicator className="pr-2" />}
                <Text className="font-semibold">Transfer</Text>
              </View>
            </TouchableOpacity>
          </View>

          <UsersListSingle
            users={users
              ?.filter(
                (user) =>
                  !user.tickets.some(
                    (ticket) => ticket.event_id === selectedTicket?.event_id
                  ) &&
                  !user.ticket_transfer_push_requests.some(
                    (request) =>
                      request.status === 'pending' &&
                      request?.tickets?.event_id === selectedTicket?.event_id
                  )
              )
              .map((user) => user.profile)}
            usersLoading={usersLoading}
            userProfile={userProfile!}
            userSearch={userSearch}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        </ScrollView>
      </View>
    </View>
  );
}
