import { Link, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { trpc } from '../../../utils/trpc';
import { dateToString } from '../../../utils/helpers';

export const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Home = () => {
  const { id } = useLocalSearchParams();
  const { data: event, isLoading: eventLoading } = trpc.getEventById.useQuery({
    // @ts-ignore
    id: id!,
  });

  const { data: artist, isLoading: artistLoading } =
    trpc.getArtistById.useQuery({ id: event?.artist! }, { enabled: !!event });

  const { data: venue, isLoading: venueLoading } = trpc.getVenueById.useQuery(
    {
      id: event?.venue!,
    },
    { enabled: !!event }
  );

  if (!event) {
    return (
      <View>
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center bg-black">
      <ScrollView>
        <View>
          {eventLoading ? (
            <Text className="text-white text-2xl">Loading...</Text>
          ) : (
            <View className="p-4">
              <Image
                style={{ borderRadius: 16 }}
                className="h-64 w-64 self-center items-center"
                source={{ uri: event?.image! }}
                placeholder={blurhash}
                contentFit="fill"
                transition={1000}
              />
              <Text className="text-xl text-white">{'\n'}</Text>
              <Text className="text-4xl text-white">
                {event?.name}
                {'\n'}
              </Text>
              <Text className="text-white text-2xl">Date</Text>
              <Text className="text-gray-400 text-xl">
                {dateToString(event?.date!)}
                {'\n'}
              </Text>
              <Text className="text-white text-2xl">Artist</Text>
              <View className="flex flex-row items-center py-3 ">
                <Image
                  style={{ borderRadius: 24 }}
                  className="h-12 w-12"
                  source={{ uri: artist?.image! }}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={1000}
                />
                <Text className="text-gray-400 pl-2 text-xl">
                  {artist?.name}
                </Text>
                <Link className="ml-auto" href={`/artist/${artist?.id}`}>
                  <Text className="text-white text-2xl">Artist</Text>
                </Link>
              </View>
              <Text className="text-white text-2xl divide-gray-400 divide-solid divide-y">
                Venue
              </Text>
              <Text className="text-gray-400 text-xl">
                {venue?.name}
                {'\n'}
              </Text>
              <Text className="text-white">Description</Text>
              <Text className="text-gray-400 text-xl">
                {event.description}
                {'\n'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
