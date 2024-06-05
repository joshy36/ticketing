import { Link, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Image } from 'expo-image';
import { trpc } from '../../../utils/trpc';
import { dateToString, replaceLocalhostWithIP } from '../../../utils/helpers';
import Separator from '../../components/Separator';
import { blurhash } from '../../../utils/helpers';
import { SupabaseContext } from '../../../providers/supabaseProvider';
import { useContext } from 'react';
import TicketSection from '../../components/TicketSection';
import { A } from '@expo/html-elements';
import { LinearGradient } from 'expo-linear-gradient';

export type Section = {
  created_at: string;
  id: string;
  name: string | null;
  number_of_rows: number | null;
  seats_per_row: number | null;
  updated_at: string | null;
  venue_id: string | null;
  price: number | undefined;
};

const Home = () => {
  const supabaseContext = useContext(SupabaseContext);
  const { user } = supabaseContext;
  const { id } = useLocalSearchParams();

  console.log('ied: ', id);

  const { data: event, isLoading: eventLoading } = trpc.getEventById.useQuery({
    id: id! as string,
  });

  const { data: artist, isLoading: artistLoading } =
    trpc.getArtistById.useQuery({ id: event?.artist! }, { enabled: !!event });

  const { data: venue, isLoading: venueLoading } = trpc.getVenueById.useQuery(
    {
      id: event?.venue!,
    },
    { enabled: !!event },
  );

  const { data: isScanner, isLoading: isScannerLoading } =
    trpc.isScannerForEvent.useQuery(
      {
        user_id: user?.id!,
        event_id: event?.id!,
      },
      { enabled: !!event && !!user },
    );

  const { data: sections, isLoading: sectionsLoading } =
    trpc.getSectionsForVenueWithPrices.useQuery(
      { id: event?.venue!, event_id: event?.id! },
      { enabled: !!event },
    );

  const {
    data: eventTickets,
    isLoading: loading,
    refetch,
  } = trpc.getAvailableTicketsForEvent.useQuery(
    {
      event_id: event?.id!,
    },
    { enabled: !!event },
  );

  return (
    <View className='flex-1 justify-center bg-black'>
      <ScrollView>
        <View>
          {eventLoading ? (
            <Text className='text-2xl text-white'>Loading...</Text>
          ) : (
            <View>
              {event?.image && (
                <ImageBackground
                  style={{ width: '100%', height: 200 }}
                  source={{
                    uri: replaceLocalhostWithIP(event)?.image,
                  }}
                  // blurRadius={20}
                >
                  <LinearGradient
                    colors={['#00000000', '#000000']}
                    style={{ height: '100%', width: '100%' }}
                  ></LinearGradient>
                </ImageBackground>
              )}
              <View className='p-4'>
                <Text className='text-center text-5xl font-bold text-white'>
                  {event?.name}
                </Text>
                <Text className='pb-4 text-center text-xl font-light text-muted-foreground'>
                  {dateToString(event?.date!)}
                </Text>

                <View className='rounded-xl border border-zinc-800 bg-black p-6 shadow-2xl shadow-zinc-900'>
                  <Text className='pb-2 text-3xl font-bold text-white'>
                    Buy Tickets
                  </Text>
                  {event?.etherscan_link ? (
                    <TicketSection
                      event={event!}
                      sections={sections!}
                      user={user}
                      tickets={eventTickets!}
                      refetch={refetch}
                    />
                  ) : (
                    <View className='flex flex-row items-center space-x-1.5'>
                      <View className='relative flex h-3 w-3'>
                        <View className='relative inline-flex h-3 w-3 rounded-full bg-yellow-500'></View>
                      </View>
                      <Text className='text-muted-foreground'>
                        Contract pending deployment
                      </Text>
                    </View>
                  )}
                </View>

                <Text className='py-4 text-2xl font-semibold text-white'>
                  Artist
                </Text>
                <Link className='py-2' href={`/home/artist/${artist?.id}`}>
                  <View className='flex flex-row items-center gap-2'>
                    <Image
                      className='h-12 w-12 rounded-xl'
                      source={{
                        uri: replaceLocalhostWithIP(artist)?.image,
                      }}
                      placeholder={blurhash}
                      contentFit='cover'
                      transition={1000}
                    />
                    <Text className='pl-2 text-base text-muted-foreground'>
                      {artist?.name}
                    </Text>
                  </View>
                </Link>
                <Separator />
                <Text className='py-4 text-2xl font-semibold text-white'>
                  Venue
                </Text>
                <Link className='py-2' href={`/home/venue/${venue?.id}`}>
                  <View className='flex flex-row items-center gap-2'>
                    <Image
                      className='h-12 w-12 rounded-xl'
                      source={{
                        uri: replaceLocalhostWithIP(venue)?.image,
                      }}
                      placeholder={blurhash}
                      contentFit='cover'
                      transition={1000}
                    />
                    <Text className='pl-2 text-base text-muted-foreground'>
                      {venue?.name}
                    </Text>
                  </View>
                </Link>
                <Separator />
                <Text className='pt-4 text-2xl font-semibold text-white'>
                  Description
                </Text>
                <Text className='py-4 text-base text-muted-foreground'>
                  {event?.description}
                </Text>
                {isScanner ? (
                  <Link href={`/home/scan/${event?.id}`} asChild>
                    <TouchableOpacity className='mb-20 flex rounded-full bg-white py-3'>
                      <Text className='text-center font-bold text-black'>
                        Scan Tickets
                      </Text>
                    </TouchableOpacity>
                  </Link>
                ) : (
                  <View></View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
