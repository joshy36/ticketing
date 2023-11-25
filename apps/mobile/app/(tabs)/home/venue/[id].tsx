import { useLocalSearchParams } from 'expo-router';
import { trpc } from '../../../../utils/trpc';
import { ImageBackground, ScrollView, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Venue = () => {
  const { id } = useLocalSearchParams();
  const { data: venue, isLoading: venueLoading } = trpc.getVenueById.useQuery({
    id: id! as string,
  });

  return (
    <View className="flex-1 justify-center bg-black">
      <ScrollView>
        <ImageBackground
          style={{ width: '100%', height: 200 }}
          source={{
            // uri: artist?.image!,
            uri: 'https://blog.ticketmaster.com/wp-content/uploads/msg.jpg',
          }}
        >
          <LinearGradient
            colors={['#00000000', '#000000']}
            style={{ height: '100%', width: '100%' }}
          ></LinearGradient>
        </ImageBackground>
        <View className="p-4">
          <Text className="text-5xl text-white text-center font-bold">
            {venue?.name}
          </Text>
          <Text className="text-white py-4 text-2xl">About</Text>
          <Text className="text-xl text-muted-foreground">
            {venue?.description}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
export default Venue;
