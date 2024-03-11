'use client';
import { useContext } from 'react';
import RenderChats from './[id]/RenderChats';
import { MessagesContext } from 'providers';

export default function Home() {
  const { userProfile } = useContext(MessagesContext);
  return (
    <div className='lg:flex'>
      <div className='hidden items-center justify-center lg:flex'>
        <div className='flex flex-col'>
          <h1 className='text-4xl font-bold'>Select a message</h1>
          <p className='font-light text-muted-foreground'>
            Choose an existing conversation to view or start a new one.
          </p>
        </div>
      </div>
      <div className='pt-8 lg:hidden'>
        <RenderChats userProfile={userProfile!} />
      </div>
    </div>
  );
}
