import { RouterOutputs } from 'api';
import { UserProfile } from 'supabase';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dispatch, SetStateAction } from 'react';

export default function RenderChats({
  userProfile,
  chats,
  chatsLoading,
  router,
  setCurrentChat,
}: {
  userProfile: UserProfile;
  chats: RouterOutputs['getUserChats'];
  chatsLoading: boolean;
  router: AppRouterInstance;
  setCurrentChat: Dispatch<SetStateAction<string>>;
}) {
  const getRandomUserFromChat = (index: number) => {
    return chats![index]!.chat_members.find(
      (user) => user.user_id != userProfile.id,
    )?.user_profiles;
  };

  return (
    <div>
      {chats?.length === 0 && (
        <p className='pt-8 text-center'>No messages yet.</p>
      )}
      {chats?.map((chat, index) => {
        return (
          <button
            key={chat.id}
            className='flex w-full border-b py-4 pl-4'
            onClick={() => {
              setCurrentChat(chat.id);
              router.push(`/messages/?chat=${chat.id}`);
            }}
          >
            {chat.chat_type === 'dm' ? (
              <div className='flex flex-row items-center gap-2'>
                <Avatar>
                  {getRandomUserFromChat(index)?.profile_image ? (
                    <AvatarImage
                      src={getRandomUserFromChat(index)?.profile_image!}
                      alt='pfp'
                    />
                  ) : (
                    <AvatarFallback></AvatarFallback>
                  )}
                </Avatar>

                <div className='flex flex-col justify-between'>
                  <div className='flex'>
                    {getRandomUserFromChat(index)?.first_name && (
                      <p className='font-medium'>
                        {getRandomUserFromChat(index)?.first_name}
                      </p>
                    )}
                    {getRandomUserFromChat(index)?.last_name && (
                      <p className='ml-1 font-medium'>
                        {getRandomUserFromChat(index)?.last_name}
                      </p>
                    )}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {`@${getRandomUserFromChat(index)?.username}`}
                  </div>
                </div>
              </div>
            ) : (
              <div>Group Message</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
