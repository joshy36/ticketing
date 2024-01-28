import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerStyle: { backgroundColor: '#000000' },
        headerTintColor: '#FFFFFF',
        headerTitle: 'Messages',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'Message',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
};
export default Layout;
