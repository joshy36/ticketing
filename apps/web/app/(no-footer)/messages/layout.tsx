import { serverClient } from '~/app/_trpc/serverClient';
import createSupabaseServer from '~/utils/supabaseServer';
import { redirect } from 'next/navigation';
import RenderChats from './[id]/RenderChats';

export default async function MessagesLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/unauthenticated');
  }

  const userProfile = await serverClient.getUserProfile.query({
    id: session.user.id,
  });

  return (
    <div>
      <div className='mx-auto -mt-16 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover'
        ></meta>
        <div className='lg:flex lg:h-screen lg:border-x'>
          <div className='hidden border-r lg:block lg:w-[500px]'>
            <RenderChats userProfile={userProfile!} />
          </div>
          <div className='lg:flex lg:w-full lg:justify-center'>{children}</div>
        </div>
      </div>
    </div>
  );
}
