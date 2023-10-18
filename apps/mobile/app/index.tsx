import { registerRootComponent } from 'expo';
import { Redirect } from 'expo-router';

export default function App() {
  return <Redirect href="home" />;
}

registerRootComponent(App);
