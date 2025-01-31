import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { UserProfile } from 'supabase';

export function UserNav({
  user,
  userProfile,
}: {
  user: User | null;
  userProfile: UserProfile | null;
}) {
  // const router = useRouter();

  // const handleSignOut = async () => {
  //   await supabase.auth.signOut();
  //   router.refresh();
  //   router.push('/');
  // };

  return (
    <Link href={`/${userProfile?.username}/`}>
      <Button variant='ghost' className='h-10 w-10 items-center rounded-full'>
        <Avatar>
          {userProfile?.profile_image ? (
            <AvatarImage src={userProfile?.profile_image!} alt='pfp' />
          ) : (
            <AvatarFallback></AvatarFallback>
          )}
        </Avatar>
      </Button>
    </Link>
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Link href={`/${userProfile?.username}/`}>
    //       <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
    //         <Avatar className='h-8 w-8'>
    //           {userProfile?.profile_image ? (
    //             <AvatarImage src={userProfile?.profile_image!} alt='pfp' />
    //           ) : (
    //             <AvatarFallback></AvatarFallback>
    //           )}
    //         </Avatar>
    //       </Button>
    //     </Link>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent className='w-56' align='end' forceMount>
    //     <DropdownMenuLabel className='font-normal'>
    //       <div className='flex flex-col space-y-1'>
    //         <p className='text-sm font-medium leading-none'>{`${userProfile?.username}`}</p>
    //         <p className='text-xs leading-none text-muted-foreground'>
    //           {user?.email}
    //         </p>
    //       </div>
    //     </DropdownMenuLabel>
    //     <DropdownMenuSeparator />
    //     <DropdownMenuGroup>
    //       <DropdownMenuItem>
    //         <Link href={`/${userProfile?.username}/`}>Profile</Link>
    //       </DropdownMenuItem>
    //     </DropdownMenuGroup>
    //     <DropdownMenuSeparator />
    //     <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
}
