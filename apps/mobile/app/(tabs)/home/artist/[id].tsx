import { useLocalSearchParams } from 'expo-router';
import { trpc } from '../../../../utils/trpc';
import { ImageBackground, ScrollView, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Artist = () => {
  const { id } = useLocalSearchParams();
  const { data: artist, isLoading: artistLoading } =
    trpc.getArtistById.useQuery({
      id: id! as string,
    });
  const { data: events, isLoading: eventsLoading } = trpc.getEvents.useQuery();

  return (
    <View className="flex-1 justify-center bg-black">
      <ScrollView>
        <ImageBackground
          style={{ width: '100%', height: 200 }}
          source={{
            // uri: artist?.image!,
            uri: 'https://guitar.com/wp-content/uploads/2020/08/GM385-SRV-Supp-Credit-GETTY-01-HERO@2560x1707.jpg',
          }}
        >
          <LinearGradient
            colors={['#00000000', '#000000']}
            style={{ height: '100%', width: '100%' }}
          ></LinearGradient>
        </ImageBackground>
        <View className="p-4">
          <Text className="text-5xl text-white text-center font-bold">
            {artist?.name}
          </Text>
          <Text className="text-white py-4 text-2xl">About</Text>
          <Text className="text-xl text-muted-foreground">
            {artist?.description}
          </Text>
          <Text className="text-white py-4 text-2xl">Upcoming Events</Text>
        </View>
      </ScrollView>
    </View>
  );
};
export default Artist;
