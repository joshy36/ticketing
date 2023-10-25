import { registerRootComponent } from 'expo';
import { Redirect } from 'expo-router';

import '../nativewind-output.js';

export default function App() {
  return <Redirect href="home" />;
}

registerRootComponent(App);
