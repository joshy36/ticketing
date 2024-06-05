import { View, Text, ScrollView } from 'react-native';
import { trpc } from '../../../utils/trpc';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { dateToString, replaceLocalhostWithIP } from '../../../utils/helpers';
import { blurhash } from '../../../utils/helpers';

const Home = () => {
  const { data: events, isLoading: eventsLoading } = trpc.getEvents.useQuery();

  return (
    <View className='flex-1 justify-center bg-black'>
      {/* <Text className="text-white text-3xl font-bold">Upcoming Events</Text> */}
      <ScrollView>
        <View className='pb-24'>
          {eventsLoading ? (
            <Text className='text-white'>Loading...</Text>
          ) : (
            events?.map((event: any) => (
              <View
                className='border-b border-zinc-800 px-2 pb-3'
                key={event.id}
              >
                <Link href={`/home/${event.id}`}>
                  <View className='flex flex-row items-center gap-4 pb-3'>
                    <View>
                      <Image
                        style={{ borderRadius: 16 }}
                        className='h-20 w-20'
                        source={{
                          uri: replaceLocalhostWithIP(event).image,
                        }}
                        placeholder={blurhash}
                        contentFit='cover'
                        transition={1000}
                      />
                    </View>
                    <View className='flex flex-col gap-1'>
                      <View>
                        <Text className='pl-2 text-2xl font-semibold text-white'>
                          {event.name}
                        </Text>
                      </View>
                      <View>
                        <Text className='pl-2 text-muted-foreground'>
                          {dateToString(event.date)}
                        </Text>
                      </View>
                      <View>
                        <Text className='pl-2 text-muted-foreground'>
                          {event.artists?.name}
                        </Text>
                      </View>
                      <View>
                        <Text className='pl-2 text-muted-foreground'>
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
