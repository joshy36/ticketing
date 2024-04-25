import { Check } from 'lucide-react';
import ProfileCard from './ProfileCard';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { RouterOutputs } from '~/app/_trpc/client';
import { UserProfile } from 'supabase';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

export default function UsersList({
  users,
  usersLoading,
  userProfile,
  userSearch,
  maxUsers,
  selectedUsers,
  setSelectedUsers,
}: {
  users: RouterOutputs['getAllUsers'] | null | undefined;
  usersLoading: boolean;
  userProfile: UserProfile;
  userSearch: string;
  maxUsers: number;
  selectedUsers: UserProfile[] | null;
  setSelectedUsers: Dispatch<SetStateAction<UserProfile[] | null>>;
}) {
  return (
    <div>
      {usersLoading ? (
        <div>Loading...</div>
      ) : (
        <ScrollArea className='h-[200px] w-full'>
          {users
            ?.filter(
              (user) =>
                user?.id !== userProfile.id && // Exclude currently signed-in user
                (user?.username
                  ?.toLowerCase()
                  .includes(userSearch.toLowerCase()) ||
                  user?.first_name
                    ?.toLowerCase()
                    .includes(userSearch.toLowerCase()) ||
                  user?.last_name
                    ?.toLowerCase()
                    .includes(userSearch.toLowerCase()) ||
                  `${user.first_name} ${user.last_name}`
                    .toLowerCase()
                    .includes(userSearch.toLowerCase())),
            )
            .slice(0, 10)
            .map((user) => {
              return (
                <Button
                  key={user.id}
                  className='my-1 flex h-full w-full justify-between rounded-full bg-black/80 px-2 hover:bg-zinc-700/20'
                  onClick={() => {
                    // if user is not selected add them
                    if (!selectedUsers?.find((u) => u.id === user.id)) {
                      if (selectedUsers?.length === maxUsers) {
                        toast.error('Maximum users reached', {
                          description: `Maximum of ${maxUsers} users.`,
                        });
                        return;
                      }
                      setSelectedUsers([...(selectedUsers || []), user]);
                    } else {
                      // if user is selected remove them
                      setSelectedUsers(
                        selectedUsers?.filter((u) => u.id !== user.id),
                      );
                    }
                  }}
                >
                  <ProfileCard userProfile={user} />
                  {selectedUsers?.find((u) => u.id === user.id) && (
                    <Check className='text-white' />
                  )}
                </Button>
              );
            })}
        </ScrollArea>
      )}
    </div>
  );
}
