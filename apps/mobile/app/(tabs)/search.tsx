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
import ProfileCard from '../components/ProfileCard';

const Search = () => {
  const { data: events, isLoading: eventsLoading } = trpc.getEvents.useQuery();
  const { data: artists, isLoading: artistsLoading } =
    trpc.getArtists.useQuery();
  const { data: venues, isLoading: venuesLoading } = trpc.getVenues.useQuery();
  const { data: users, isLoading: usersLoading } = trpc.getAllUsers.useQuery();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<typeof events>([]);
  const [filteredArtists, setFilteredArtists] = useState<typeof artists>([]);
  const [filteredVenues, setFilteredVenues] = useState<typeof venues>([]);
  const [filteredUsers, setFilteredUsers] = useState<typeof users>([]);

  const handleSearch = (text: any) => {
    setSearchQuery(text);

    if (text.length !== 0) {
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

      const filteredUsers = users?.filter((user) => {
        const fullName = `${user.first_name?.toLowerCase() || ''} ${user.last_name?.toLowerCase() || ''}`;
        return (
          fullName.includes(text.toLowerCase()) ||
          (user.username &&
            user.username.toLowerCase().includes(text.toLowerCase()))
        );
      });
      setFilteredUsers(filteredUsers);
    } else {
      setFilteredEvents([]);
      setFilteredArtists([]);
      setFilteredVenues([]);
      setFilteredUsers([]);
    }
  };

  return (
    <View className="pt-14 px-5 flex-1 justify-start bg-black">
      <TextInput
        className="h-12 border-2 rounded-full mb-2 text-muted-foreground pl-4 bg-zinc-900"
        placeholder="Search events, artists, venues, users"
        placeholderTextColor="#6B7280"
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <ScrollView>
        <View className="pb-24">
          {filteredEvents?.length === 0 &&
          filteredArtists?.length === 0 &&
          filteredVenues?.length === 0 &&
          filteredUsers?.length === 0 &&
          searchQuery.length !== 0 ? (
            <Text className="text-white text-2xl text-center pt-24 ">
              No results found.
            </Text>
          ) : null}

          {filteredEvents?.length !== 0 && (
            <View>
              <Text className="text-white text-xl font-bold">Events</Text>
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
            </View>
          )}
          {searchQuery.length === 0 && (
            <View>
              <Text className="text-white text-xl font-bold">
                Recommended Events
              </Text>
              {events?.map((event) => (
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
            </View>
          )}

          {filteredArtists?.length !== 0 && (
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

          {filteredVenues?.length !== 0 && (
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

          {filteredUsers?.length !== 0 && (
            <Text className="text-white text-xl font-bold">Users</Text>
          )}
          {filteredUsers?.map((user) => (
            <Text key={user.id} className="text-white text-xl">
              <Link href={`/home/user/${user.id}`}>
                <View className="flex flex-row items-center py-3">
                  <ProfileCard userProfile={user} />
                </View>
              </Link>
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Search;
