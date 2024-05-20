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
import { SupabaseContext } from '../../../../utils/supabaseProvider';
import { useLocalSearchParams } from 'expo-router';
import UsersListSingle from '@/app/components/UsersListSingle';
import { TicketsContext } from '../../../../providers/ticketsProvider';

export default function Modal() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { userProfile } = useContext(SupabaseContext);
  const { refetchTickets } = useContext(TicketsContext);
  const { id } = useLocalSearchParams();

  const cancelRequestTransfer = trpc.cancelTicketTransferPush.useMutation({
    onSettled: async (data, error) => {
      await refetchTickets();
      //   await refetchUsers();
      if (error) {
        // toast.error(`Error requesting transfer: ${error.message}`);
        console.error('Error requesting transfer: ', error);
      } else {
        // toast.success('Ticket transfer request sent!');
      }
      setIsLoading(false);
      router.back();
    },
  });

  return (
    <View className="flex-1 bg-black pt-4 px-2">
      <Text className="text-white text-lg pt-4">
        Are you sure you want to cancel this transfer request?
      </Text>
      <View className="flex flex-row justify-end pt-8 gap-4">
        <TouchableOpacity
          className="bg-zinc-800 rounded-full p-4 w-1/3"
          onPress={() => router.back()}
        >
          <View className="flex flex-row justify-center">
            <Text className="text-white font-semibold">No</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white rounded-full p-4 w-1/3"
          onPress={() => {
            setIsLoading(true);
            cancelRequestTransfer.mutate({
              ticket_id: id as string,
            });
          }}
        >
          <View className="flex flex-row justify-center">
            {isLoading && <ActivityIndicator className="pr-2" />}
            <Text className="font-semibold">Yes</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
