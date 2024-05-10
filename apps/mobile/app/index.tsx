import { registerRootComponent } from 'expo';
import { Redirect } from 'expo-router';
import 'react-native-reanimated';

import '../nativewind-output.js';

export default function App() {
  return <Redirect href="home" />;
}

registerRootComponent(App);
