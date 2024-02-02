import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SupabaseContext } from '../../utils/supabaseProvider';
import { Link } from 'expo-router';
import { useContext, useState } from 'react';

const UserSignInForm = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const supabaseContext = useContext(SupabaseContext);
  const { signInWithPassword } = supabaseContext;

  return (
    <View className="flex-1 items-center justify-center bg-black px-4">
      <Text className="text-white font-bold text-3xl">Sign In</Text>
      <Text className="text-muted-foreground pt-2">
        Enter your email below to sign in.
      </Text>
      <View className="py-2 w-full">
        <Text className="text-white">Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="name@example.com"
          autoCapitalize={'none'}
        />
      </View>
      <View className="py-2 w-full">
        <Text className="text-white">Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          autoCapitalize={'none'}
        />
      </View>
      <View className="py-2 w-full">
        <TouchableOpacity
          className="bg-white py-3 rounded-xl"
          disabled={loading}
          onPress={() => signInWithPassword(email, password)}
        >
          <Text className="text-black text-center font-bold">
            Sign In with Email
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-muted-foreground pt-4">Don't have an account?</Text>
      <Link
        href="https://www.jupiter-tickets.com/sign-up"
        className=" text-muted-foreground underline underline-offset-4 hover:text-primary"
      >
        Sign up.
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    color: 'white', // Text color
    borderBottomColor: 'white', // Bottom border color
    borderBottomWidth: 1, // Bottom border width
    paddingHorizontal: 10, // Horizontal padding
    paddingVertical: 8, // Vertical padding
    fontSize: 16, // Font size
  },
});

export default UserSignInForm;
