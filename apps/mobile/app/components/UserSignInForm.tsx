import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SupabaseContext } from '../../providers/supabaseProvider';
import { Link } from 'expo-router';
import { useContext, useState } from 'react';

const UserSignInForm = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const supabaseContext = useContext(SupabaseContext);
  const { signInWithPassword } = supabaseContext;

  return (
    <View className='flex-1 items-center justify-center bg-black px-4'>
      <Text className='text-3xl font-bold text-white'>Sign In</Text>
      <Text className='pt-2 text-muted-foreground'>
        Enter your email below to sign in.
      </Text>
      <View className='w-full py-2'>
        <Text className='text-white'>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder='name@example.com'
          autoCapitalize={'none'}
        />
      </View>
      <View className='w-full py-2'>
        <Text className='text-white'>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          autoCapitalize={'none'}
        />
      </View>
      <View className='w-full py-2'>
        <TouchableOpacity
          className='rounded-xl bg-white py-3'
          disabled={loading}
          onPress={() => signInWithPassword(email, password)}
        >
          <Text className='text-center font-bold text-black'>
            Sign In with Email
          </Text>
        </TouchableOpacity>
      </View>
      <Text className='pt-4 text-muted-foreground'>Don't have an account?</Text>
      <Link
        href='https://www.jupiter-tickets.com/sign-up'
        className='text-muted-foreground underline underline-offset-4 hover:text-primary'
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
