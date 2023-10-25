import { useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { trpc } from '../../../utils/trpc';
import { blurhash } from '../../../utils/helpers';

const Profile = () => {
  const { id } = useLocalSearchParams();
  const { data: ticket, isLoading: ticketLoading } =
    trpc.getTicketById.useQuery({
      // @ts-ignore
      id: id!,
    });

  return (
    <View className="flex-1 bg-black px-4 pt-24 items-center ">
      {ticketLoading ? (
        <Text className="text-white">Loading...</Text>
      ) : (
        <View>
          <Image
            style={{ borderRadius: 16 }}
            className="h-40 w-40 flex justify-center items-center pb-8"
            source={{ uri: ticket.events?.image! }}
            placeholder={blurhash}
            contentFit="cover"
            transition={1000}
          />
          <View className="flex flex-col py-4">
            <View>
              <Text className="text-white pl-2 text-2xl text-bold">
                {ticket.events?.name}
              </Text>
            </View>
            <View>
              <Text className="text-muted-foreground pl-2">
                {`Seat: ${ticket.seat}`}
              </Text>
            </View>
          </View>
          <Pressable
            className="bg-white py-3 rounded-xl flex w-24 justify-end"
            onPress={() => alert('Test')}
          >
            <Text className="text-black text-center font-bold">Activate</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Profile;
