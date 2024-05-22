import { View } from 'react-native';
import { useContext } from 'react';
import { SupabaseContext } from '../../providers/supabaseProvider';
import UserSignInForm from '../components/UserSignInForm';
import ProfilePage from '../components/ProfilePage';

const Profile = () => {
  const supabaseContext = useContext(SupabaseContext);
  const { session, user } = supabaseContext;

  return (
    <View className="flex-1 bg-black">
      {session && user ? <ProfilePage /> : <UserSignInForm />}
    </View>
  );
};

export default Profile;
