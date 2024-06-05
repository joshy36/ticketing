import { useLocalSearchParams } from 'expo-router';
import { trpc } from '../../../../utils/trpc';
import { ImageBackground, ScrollView, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { replaceLocalhostWithIP } from '@/utils/helpers';

const Artist = () => {
  const { id } = useLocalSearchParams();
  const { data: artist, isLoading: artistLoading } =
    trpc.getArtistById.useQuery({
      id: id! as string,
    });
  const { data: events, isLoading: eventsLoading } = trpc.getEvents.useQuery();

  return (
    <View className='flex-1 justify-center bg-black'>
      <ScrollView>
        <View className='pb-24'>
          <ImageBackground
            style={{ width: '100%', height: 200 }}
            source={{
              uri: replaceLocalhostWithIP(artist)?.image,
            }}
          >
            <LinearGradient
              colors={['#00000000', '#000000']}
              style={{ height: '100%', width: '100%' }}
            ></LinearGradient>
          </ImageBackground>
          <View className='p-4'>
            <Text className='pb-8 text-center text-5xl font-bold text-white'>
              {artist?.name}
            </Text>
            <Text className='text-base text-muted-foreground'>
              {artist?.description}
            </Text>
            <Text className='py-4 text-2xl font-bold text-white'>
              Upcoming Events
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default Artist;
