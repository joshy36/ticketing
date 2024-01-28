import { Link, useLocalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { trpc } from '../../../utils/trpc';

const Home = () => {
  const { id } = useLocalSearchParams();
  console.log('id:', id);

  const { data: message } = trpc.getMessageById.useQuery({
    message_id: id as string,
  });
  console.log('message: ', message);

  return (
    <View className="flex-1 bg-black">
      <Text className="text-white">{message?.message}</Text>
      <View className="flex flex-row justify-between px-2 pt-20 items-center">
        <Link href={`/messages`} asChild>
          <TouchableOpacity className="border border-red-700 py-3 px-4 rounded-full flex flex-row items-center">
            <Ionicons name="trash-outline" color="red" size={20} />
            <Text className="text-red-700 text-center font-bold">Delete</Text>
          </TouchableOpacity>
        </Link>
        <Link href={`/home`} asChild>
          <TouchableOpacity className="bg-white py-3 px-4 rounded-full flex flex-row items-center">
            <Text className="text-black text-center font-bold">View Event</Text>
            <Ionicons name="chevron-forward-outline" color="black" size={20} />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default Home;
