import { SupabaseContext } from '@/providers/supabaseProvider';
import { useContext } from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { blurhash, replaceLocalhostWithIP } from '@/utils/helpers';
import QRCode from 'react-qr-code';
import { trpc } from '@/utils/trpc';
import Separator from '@/app/components/Separator';

const ScanIn = () => {
  const { userProfile } = useContext(SupabaseContext);
  const { data: userSalt, isLoading: saltLoading } = trpc.getUserSalt.useQuery({
    user_id: userProfile?.id!,
  });

  return (
    <View className='flex-1 bg-black px-8'>
      <View className='mt-10 flex items-center justify-center rounded-2xl border border-zinc-800 p-4'>
        {userProfile && (
          <Image
            className='flex h-64 w-64 items-center justify-center rounded-full'
            source={{
              uri: replaceLocalhostWithIP(userProfile).profile_image,
            }}
            placeholder={blurhash}
            contentFit='cover'
            transition={1000}
          />
        )}

        {userSalt && (
          <View className='flex items-center justify-center p-4'>
            <QRCode
              bgColor='#000000'
              fgColor='#FFFFFF'
              value={userSalt.salt!}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default ScanIn;
