import { View, Text, Button, Alert } from 'react-native';
import EventsList from '../components/EventsList';

const Home = () => {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="py-6 text-white">Hi Whats up everyone??</Text>
      <Button
        onPress={() => Alert.alert('Button pressed')}
        title="Learn More"
      ></Button>
      <EventsList />
    </View>
  );
};

export default Home;
