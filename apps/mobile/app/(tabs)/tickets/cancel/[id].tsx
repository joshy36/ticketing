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
    <View className='flex-1 bg-black px-2 pt-4'>
      <Text className='pt-4 text-lg text-white'>
        Are you sure you want to cancel this transfer request?
      </Text>
      <View className='flex flex-row justify-end gap-4 pt-8'>
        <TouchableOpacity
          className='w-1/3 rounded-full bg-zinc-800 p-4'
          onPress={() => router.back()}
        >
          <View className='flex flex-row justify-center'>
            <Text className='font-semibold text-white'>No</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className='w-1/3 rounded-full bg-white p-4'
          onPress={() => {
            setIsLoading(true);
            cancelRequestTransfer.mutate({
              ticket_id: id as string,
            });
          }}
        >
          <View className='flex flex-row justify-center'>
            {isLoading && <ActivityIndicator className='pr-2' />}
            <Text className='font-semibold'>Yes</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
