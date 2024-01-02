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
import { dateToString } from '../../../utils/helpers';
import Separator from '../../components/Separator';
import { blurhash } from '../../../utils/helpers';
import { SupabaseContext } from '../../../utils/supabaseProvider';
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
};

const Home = () => {
  const supabaseContext = useContext(SupabaseContext);
  const { user } = supabaseContext;
  const { id } = useLocalSearchParams();

  const { data: event, isLoading: eventLoading } = trpc.getEventById.useQuery({
    id: id! as string,
  });

  const { data: artist, isLoading: artistLoading } =
    trpc.getArtistById.useQuery({ id: event?.artist! }, { enabled: !!event });

  const { data: venue, isLoading: venueLoading } = trpc.getVenueById.useQuery(
    {
      id: event?.venue!,
    },
    { enabled: !!event }
  );

  const { data: isScanner, isLoading: isScannerLoading } =
    trpc.isScannerForEvent.useQuery(
      {
        user_id: user?.id!,
        event_id: event?.id!,
      },
      { enabled: !!event && !!user }
    );

  const { data: sections, isLoading: sectionsLoading } =
    trpc.getSectionsForVenue.useQuery(
      { id: event?.venue! },
      { enabled: !!event }
    );

  const { data: sectionPrices, isLoading: sectionPricesLoading } =
    trpc.getSectionPriceByEvent.useQuery(
      { event_id: event?.id! },
      { enabled: !!event }
    );

  return (
    <View className="flex-1 justify-center bg-black">
      <ScrollView>
        <View>
          {eventLoading ? (
            <Text className="text-white text-2xl">Loading...</Text>
          ) : (
            <View>
              <ImageBackground
                style={{ width: '100%', height: 200 }}
                source={{
                  uri: 'https://i.scdn.co/image/ab6761610000517431f6ab67e6025de876475814',
                }}
                // blurRadius={20}
              >
                <LinearGradient
                  colors={['#00000000', '#000000']}
                  style={{ height: '100%', width: '100%' }}
                ></LinearGradient>
              </ImageBackground>
              <View className="p-4">
                <Text className="text-5xl text-white text-center font-bold">
                  {event?.name}
                </Text>
                <Text className="text-muted-foreground text-xl font-light text-center pb-4">
                  {dateToString(event?.date!)}
                </Text>

                <View className="border p-6 rounded-xl bg-black border-zinc-800 shadow-2xl shadow-zinc-900">
                  <Text className="text-white text-3xl font-bold pb-2">
                    Buy Tickets
                  </Text>
                  {event?.etherscan_link ? (
                    <TicketSection
                      event={event!}
                      sections={sections!}
                      user={user}
                      sectionPrices={sectionPrices}
                    />
                  ) : (
                    <View></View>
                  )}
                </View>

                <Text className="text-white text-2xl font-semibold py-6">
                  Artist
                </Text>
                <Link className="py-2" href={`/home/artist/${artist?.id}`}>
                  <View className="flex flex-row items-center">
                    <Image
                      style={{ borderRadius: 24 }}
                      className="h-12 w-12"
                      source={{ uri: artist?.image! }}
                      placeholder={blurhash}
                      contentFit="cover"
                      transition={1000}
                    />
                    <Text className="text-muted-foreground pl-2 text-xl font-light">
                      {artist?.name}
                    </Text>
                  </View>
                </Link>
                <Separator />
                <Text className="text-white text-2xl font-semibold pt-4">
                  Venue
                </Text>
                <Link className="py-4" href={`/home/venue/${venue?.id}`}>
                  <Text className="text-muted-foreground font-light text-xl">
                    {venue?.name}
                  </Text>
                </Link>
                <Separator />
                <Text className="text-white text-2xl font-semibold pt-4">
                  Description
                </Text>
                <Text className="text-muted-foreground text-xl font-light py-4">
                  {event?.description}
                </Text>
                {event?.etherscan_link ? (
                  <View>
                    <A href={`${event.etherscan_link}`}>
                      <View className="flex flex-row items-center space-x-1.5">
                        <View className="relative flex h-3 w-3">
                          <View className="relative inline-flex h-3 w-3 rounded-full bg-green-600 "></View>
                        </View>
                        <Text className="text-muted-foreground">
                          Contract live
                        </Text>
                      </View>
                    </A>
                  </View>
                ) : (
                  <View className="flex flex-row items-center space-x-1.5">
                    <View className="relative flex h-3 w-3">
                      <View className="relative inline-flex h-3 w-3 rounded-full bg-yellow-500 "></View>
                    </View>
                    <Text className="text-muted-foreground">
                      Contract pending deployment
                    </Text>
                  </View>
                )}
                {isScanner ? (
                  <Link href={`/home/scan/${event?.id}`} asChild>
                    <TouchableOpacity className="bg-white py-3 rounded-full flex">
                      <Text className="text-black text-center font-bold">
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
