import { useLocalSearchParams } from 'expo-router';
import { trpc } from '../../../../utils/trpc';
import { ImageBackground, ScrollView, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { replaceLocalhostWithIP } from '@/utils/helpers';

const Venue = () => {
  const { id } = useLocalSearchParams();
  const { data: venue, isLoading: venueLoading } = trpc.getVenueById.useQuery({
    id: id! as string,
  });

  return (
    <View className="flex-1 justify-center bg-black">
      <ScrollView>
        <View className="pb-24">
          <ImageBackground
            style={{ width: '100%', height: 200 }}
            source={{
              uri: replaceLocalhostWithIP(venue)?.image,
              // uri: 'https://blog.ticketmaster.com/wp-content/uploads/msg.jpg',
            }}
          >
            <LinearGradient
              colors={['#00000000', '#000000']}
              style={{ height: '100%', width: '100%' }}
            ></LinearGradient>
          </ImageBackground>
          <View className="p-4">
            <Text className="text-5xl text-white text-center font-bold pb-8">
              {venue?.name}
            </Text>
            <Text className="text-base text-muted-foreground">
              {venue?.description}
            </Text>
            <Text className="text-white py-4 text-2xl font-bold">
              Upcoming Events
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default Venue;
