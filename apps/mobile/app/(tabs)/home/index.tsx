import { View, Text, ScrollView } from 'react-native';
import { trpc } from '../../../utils/trpc';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { dateToString, replaceLocalhostWithIP } from '../../../utils/helpers';
import { blurhash } from '../../../utils/helpers';

const Home = () => {
  const { data: events, isLoading: eventsLoading } = trpc.getEvents.useQuery();

  return (
    <View className="flex-1 justify-center bg-black">
      {/* <Text className="text-white text-3xl font-bold">Upcoming Events</Text> */}
      <ScrollView>
        <View className="pb-24">
          {eventsLoading ? (
            <Text className="text-white">Loading...</Text>
          ) : (
            events?.map((event: any) => (
              <View
                className="px-2 pb-3 border-b border-zinc-800"
                key={event.id}
              >
                <Link href={`/home/${event.id}`}>
                  <View className="flex flex-row items-center pb-3 gap-4">
                    <View>
                      <Image
                        style={{ borderRadius: 16 }}
                        className="h-20 w-20"
                        source={{
                          uri: replaceLocalhostWithIP(event).image,
                        }}
                        placeholder={blurhash}
                        contentFit="cover"
                        transition={1000}
                      />
                    </View>
                    <View className="flex flex-col gap-1">
                      <View>
                        <Text className="text-white pl-2 text-2xl font-semibold">
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
                          {event.artists?.name}
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
