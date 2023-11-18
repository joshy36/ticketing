import React, { useState } from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';
import { trpc } from '../../utils/trpc';

const Search = () => {
  const { data: events, isLoading: eventsLoading } = trpc.getEvents.useQuery();
  const { data: artists, isLoading: artistsLoading } =
    trpc.getArtists.useQuery();
  const { data: venues, isLoading: venuesLoading } = trpc.getVenues.useQuery();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<(typeof events)[]>([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);

  const handleSearch = (text: any) => {
    setSearchQuery(text);

    // Filter events
    const filteredEvents = events?.filter((event) =>
      event.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredEvents(filteredEvents);

    // Filter artists
    const filteredArtists = artists?.filter((artist) =>
      artist.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredArtists(filteredArtists);

    // Filter venues
    const filteredVenues = venues?.filter((venue) =>
      venue.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredVenues(filteredVenues);
  };

  return (
    <View className="p-5 pt-20 flex-1 justify-center bg-black">
      <TextInput
        className="h-10 border-2 rounded-full mb-2 text-white pl-4 bg-gray-900"
        placeholder="Search..."
        onChangeText={handleSearch}
        value={searchQuery}
      />

      {filteredEvents?.map((event) => (
        <Text key={event.id} className="text-white text-xl">
          {event.name}
        </Text>
      ))}
      {filteredArtists?.map((artist) => (
        <Text key={artist.id} className="text-white text-xl">
          {artist.name}
        </Text>
      ))}
      {filteredVenues?.map((venue) => (
        <Text key={venue.id} className="text-white text-xl">
          {venue.name}
        </Text>
      ))}
    </View>
  );
};

export default Search;
