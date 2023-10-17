import { registerRootComponent } from 'expo';
import { Link } from 'expo-router';
import { Text, View, Button, Alert, Pressable } from 'react-native';
import { TRPCProvider } from '../utils/trpc';

import EventsList from './EventsList';

export default function App() {
  // const router = useRouter();

  return (
    <TRPCProvider>
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="py-6 text-white">Hi Whats up everyone??</Text>
        <Button
          onPress={() => Alert.alert('Button pressed')}
          title="Learn More"
        ></Button>
        <EventsList />

        <Link href="/profile" asChild>
          <Pressable>
            <Text className="py-10 text-white">Profile</Text>
          </Pressable>
        </Link>
      </View>
    </TRPCProvider>
  );
}

registerRootComponent(App);
