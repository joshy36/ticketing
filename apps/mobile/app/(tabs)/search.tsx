import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, ScrollView } from 'react-native';
import { trpc } from '../../utils/trpc';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import {
  blurhash,
  dateToString,
  replaceLocalhostWithIP,
} from '../../utils/helpers';

const Search = () => {
  const { data: events, isLoading: eventsLoading } = trpc.getEvents.useQuery();
  const { data: artists, isLoading: artistsLoading } =
    trpc.getArtists.useQuery();
  const { data: venues, isLoading: venuesLoading } = trpc.getVenues.useQuery();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<typeof events>([]);
  const [filteredArtists, setFilteredArtists] = useState<typeof artists>([]);
  const [filteredVenues, setFilteredVenues] = useState<typeof venues>([]);

  const handleSearch = (text: any) => {
    setSearchQuery(text);

    const filteredEvents = events?.filter((event) =>
      event.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredEvents(filteredEvents);

    const filteredArtists = artists?.filter((artist) =>
      artist.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredArtists(filteredArtists);

    const filteredVenues = venues?.filter((venue) =>
      venue.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredVenues(filteredVenues);
  };

  return (
    <View className="pt-14 px-5 flex-1 justify-start bg-black">
      <TextInput
        className="h-12 border-2 rounded-full mb-2 text-muted-foreground pl-4 bg-zinc-900"
        placeholder="Search events, artists, venues"
        placeholderTextColor="#6B7280"
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <ScrollView>
        {filteredEvents?.length === 0 &&
        filteredArtists?.length === 0 &&
        filteredVenues?.length === 0 &&
        searchQuery.length !== 0 ? (
          <Text className="text-white text-2xl text-center pt-24 ">
            No results found.
          </Text>
        ) : null}

        {filteredEvents?.length === 0 ? null : (
          <Text className="text-white text-xl font-bold">Events</Text>
        )}
        {filteredEvents?.map((event) => (
          <View className="" key={event.id}>
            <Link href={`/home/${event.id}`}>
              <View className="flex flex-row items-center py-3 ">
                <View>
                  <Image
                    style={{ borderRadius: 16 }}
                    className="h-20 w-20"
                    source={{ uri: replaceLocalhostWithIP(event).image }}
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
        ))}

        {filteredArtists?.length === 0 ? null : (
          <Text className="text-white text-xl font-bold">Artists</Text>
        )}
        {filteredArtists?.map((artist) => (
          <Text key={artist.id} className="text-white text-xl">
            <Link href={`/home/artist/${artist.id}`}>
              <View className="flex flex-row items-center py-3 ">
                <View>
                  <Image
                    style={{ borderRadius: 16 }}
                    className="h-20 w-20"
                    source={{ uri: artist.image! }}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={1000}
                  />
                </View>
                <View className="flex flex-col">
                  <View>
                    <Text className="text-white text-xl pl-2">
                      {artist.name}
                    </Text>
                  </View>
                </View>
              </View>
            </Link>
          </Text>
        ))}

        {filteredVenues?.length === 0 ? null : (
          <Text className="text-white text-xl font-bold">Venues</Text>
        )}
        {filteredVenues?.map((venue) => (
          <Text key={venue.id} className="text-white text-xl">
            <Link href={`/home/venue/${venue.id}`}>
              <View className="flex flex-row items-center py-3 ">
                <View>
                  <Image
                    style={{ borderRadius: 16 }}
                    className="h-20 w-20"
                    source={{ uri: venue.image! }}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={1000}
                  />
                </View>
                <View className="flex flex-col">
                  <View>
                    <Text className="text-white text-xl pl-2">
                      {venue.name}
                    </Text>
                  </View>
                </View>
              </View>
            </Link>
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

export default Search;
