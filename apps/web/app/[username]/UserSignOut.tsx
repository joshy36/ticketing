'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserProfile } from 'supabase';
import createClientClient from '@/utils/supabaseClient';

export default function UserSignOut({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const router = useRouter();
  const supabase = createClientClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  };

  return (
    <div className='flex flex-row items-center gap-4 pt-4'>
      <Link href={`/${userProfile.username}/edit/`}>
        <Button variant='default'>Edit Profile</Button>
      </Link>
      <Button variant='outline' onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
}
