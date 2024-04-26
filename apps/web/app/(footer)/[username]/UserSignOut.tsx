'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { UserProfile } from 'supabase';
import { trpc } from '~/app/_trpc/client';
import { toast } from 'sonner';

export default function UserSignOut({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const router = useRouter();

  const signOut = trpc.signOut.useMutation({
    onSettled(error) {
      if (error) {
        toast.error('Error signing out', {
          description: 'Please try again',
        });
      } else {
        router.push('/');
        router.refresh();
      }
    },
  });

  const handleSignOut = async () => {
    signOut.mutate();
  };

  return (
    <div className='flex flex-col items-center gap-4 pt-4'>
      <Link href={`/${userProfile.username}/edit/`}>
        <Button variant='default' className='w-[120px]'>
          Edit Profile
        </Button>
      </Link>
      <Button variant='outline' className='w-[120px]' onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
}
