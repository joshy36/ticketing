import { View, Text, ScrollView } from 'react-native';
import { trpc } from '../../../utils/trpc';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { dateToString } from '../../../utils/helpers';
import { blurhash } from '../../../utils/helpers';

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
            events!.map((event: any) => (
              <View className="px-2 " key={event.id}>
                <Link href={`/home/${event.id}`}>
                  <View className="flex flex-row items-center py-3 ">
                    <View>
                      <Image
                        style={{ borderRadius: 16 }}
                        className="h-20 w-20"
                        source={{ uri: event.image! }}
                        placeholder={blurhash}
                        contentFit="cover"
                        transition={1000}
                      />
                    </View>
                    <View className="flex flex-col">
                      <View>
                        <Text className="text-white pl-2 text-2xl text-bold">
                          {event.name}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-muted-foreground pl-2">
                          {dateToString(event.date)}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-muted-foreground pl-2">
                          {event.venues?.name}
                        </Text>
                      </View>
                    </View>
                  </View>
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
