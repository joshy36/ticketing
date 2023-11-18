import { Link, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { trpc } from '../../../utils/trpc';
import { dateToString } from '../../../utils/helpers';
import Separator from '../../components/Separator';
import { blurhash } from '../../../utils/helpers';
import { SupabaseContext } from '../../../utils/supabaseProvider';
import { useContext } from 'react';
import TicketSection from '../../components/TicketSection';
import { A } from '@expo/html-elements';

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
            <View className="p-4">
              {isScanner ? (
                <Link href={`/home/scan/${event?.id}`} asChild>
                  <TouchableOpacity className="bg-white py-3 rounded-xl flex">
                    <Text className="text-black text-center font-bold">
                      Scan Tickets
                    </Text>
                  </TouchableOpacity>
                </Link>
              ) : (
                <View></View>
              )}
              <Image
                style={{ borderRadius: 16 }}
                className="h-64 w-64 self-center items-center"
                source={{ uri: event?.image! }}
                placeholder={blurhash}
                contentFit="fill"
                transition={1000}
              />
              <Text className="text-xl text-white">{'\n'}</Text>
              <Text className="text-4xl text-white font-bold">
                {event?.name}
              </Text>
              <Separator />
              <Text className="text-white text-2xl">Date</Text>
              <Text className="text-muted-foreground text-xl">
                {dateToString(event?.date!)}
              </Text>
              <Separator />
              <Text className="text-white text-xl">Artist</Text>
              <View className="flex flex-row items-center py-3 ">
                <Image
                  style={{ borderRadius: 24 }}
                  className="h-12 w-12"
                  source={{ uri: artist?.image! }}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={1000}
                />
                <Text className="text-muted-foreground pl-2 text-xl">
                  {artist?.name}
                </Text>
                {/* <Link className="ml-auto" href={`/artist/${artist?.id}`}>
                  <Text className="text-white text-xl underline">Artist</Text>
                </Link> */}
              </View>
              <Separator />
              <Text className="text-white text-2xl Viewide-gray-400 Viewide-solid Viewide-y">
                Venue
              </Text>
              <Text className="text-muted-foreground text-xl">
                {venue?.name}
              </Text>
              <Separator />
              <Text className="text-white text-2xl">Description</Text>
              <Text className="text-muted-foreground text-xl pb-4">
                {event?.description}
              </Text>
              <Separator />
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
                  <TicketSection
                    event={event!}
                    sections={sections!}
                    user={user}
                    sectionPrices={sectionPrices}
                  />
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
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
