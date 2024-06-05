import { Artist, Venue } from 'supabase';
import { Image } from 'expo-image';
import {
  blurhash,
  replaceLocalhostWithIP,
  truncate,
} from '../../../utils/helpers';
import { View, Text } from 'react-native';

export default function OrgCard({
  artist,
  venue,
  mostRecentMessage,
}: {
  artist: Artist | null | undefined;
  venue: Venue | null | undefined;
  mostRecentMessage: string | null | undefined;
}) {
  const artistOrVenue = artist || venue;
  return (
    <View className='flex flex-row items-center gap-5'>
      {artistOrVenue?.image && (
        <Image
          style={{ borderRadius: 16 }}
          className='flex h-12 w-12 items-center justify-center'
          source={{ uri: replaceLocalhostWithIP(artistOrVenue).image }}
          placeholder={blurhash}
          contentFit='cover'
          transition={1000}
        />
      )}
      <View className='flex max-w-[225px] flex-col justify-between'>
        <View className='flex'>
          <Text className='text-base font-medium text-white'>
            {artistOrVenue?.name}
          </Text>
        </View>
        <View>
          <Text className='text-sm font-light text-muted-foreground'>
            {truncate(mostRecentMessage, 60)}
          </Text>
        </View>
      </View>
    </View>
  );
}
