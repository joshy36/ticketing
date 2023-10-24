import { View, Text, ScrollView } from 'react-native';
import { trpc } from '../../../utils/trpc';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { dateToString } from '../../../utils/helpers';

export const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Home = () => {
  const { data: events, isLoading: eventsLoading } = trpc.getEvents.useQuery();

  return (
    <View className="flex-1 justify-center bg-black">
      {/* <Text className="text-white text-3xl font-bold">Upcoming Events</Text> */}
      <ScrollView>
        <View>
          {eventsLoading ? (
            <Text className="text-white">Loading...</Text>
          ) : (
            events!.map((event) => (
              <View className="p-4 self-center items-center " key={event.id}>
                <Link href={`/home/${event.id}`}>
                  <Image
                    style={{ borderRadius: 16 }}
                    className="h-64 w-64 "
                    source={{ uri: event.image! }}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={1000}
                  />
                  <Text className="text-4xl text-white">{'\n'}</Text>
                  <Text className="text-4xl text-white font-bold">
                    {event.name}
                    {'\n'}
                  </Text>
                  <Text className="text-gray-400 text-xl">
                    {dateToString(event.date)}
                    {'\n'}
                  </Text>
                  <Text className="text-gray-400 text-xl">
                    {event.venues?.name}
                    {'\n'}
                  </Text>
                </Link>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
