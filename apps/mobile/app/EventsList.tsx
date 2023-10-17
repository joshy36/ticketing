import { View, Text, StyleSheet } from 'react-native';

import { trpc } from '../utils/trpc';
import { Image } from 'expo-image';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function EventsList() {
  const { data: events, isLoading: eventsLoading } = trpc.getEvents.useQuery();

  return (
    <View>
      {eventsLoading ? (
        <Text className="text-white">Loading...</Text>
      ) : (
        events!.map((event) => (
          <View key={event.id}>
            <Text className="text-white">{event.name}</Text>
            {/* <Image
              style={styles.image}
              source={event.image}
              placeholder={blurhash}
              contentFit="cover"
              transition={1000}
            /> */}
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0553',
  },
});
