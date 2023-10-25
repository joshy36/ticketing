import { Link, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { trpc } from '../../../utils/trpc';
import { dateToString } from '../../../utils/helpers';
import Separator from '../../components/Separator';
import { blurhash } from '../../../utils/helpers';

const Home = () => {
  const { id } = useLocalSearchParams();
  const { data: event, isLoading: eventLoading } = trpc.getEventById.useQuery({
    // @ts-ignore
    id: id!,
  });

  const data = [
    { column1: 'Data 1', column2: 'Data 2', column3: 'Data 3' },
    { column1: 'Data 1', column2: 'Data 2', column3: 'Data 3' },

    // Add more data objects as needed
  ];

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
              <Text className="text-white text-2xl divide-gray-400 divide-solid divide-y">
                Venue
              </Text>
              <Text className="text-muted-foreground text-xl">
                {venue?.name}
              </Text>
              <Separator />
              <Text className="text-white text-2xl">Description</Text>
              <Text className="text-muted-foreground text-xl pb-4">
                {event.description}
              </Text>
              <View style={styles.table}>
                <View style={styles.row}>
                  <Text style={styles.cell}>Seat</Text>
                  <Text style={styles.cell}>Price</Text>
                  <Text style={styles.cell}>Purchase</Text>
                </View>
                {data.map((rowData, index) => (
                  <View key={index} style={styles.row}>
                    <Text style={styles.cell}>{rowData.column1}</Text>
                    <Text style={styles.cell}>{rowData.column2}</Text>
                    <Pressable
                      style={styles.button}
                      onPress={() => alert('Purchase!')}
                    >
                      <Text style={styles.buttonText}>{rowData.column3}</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    color: 'white',
    flex: 1,
    borderWidth: 1,
    borderColor: 'white',
    padding: 8,
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
