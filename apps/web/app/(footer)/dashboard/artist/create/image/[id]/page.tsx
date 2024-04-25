import { serverClient } from '~/app/_trpc/serverClient';
import UploadImage from '~/components/UploadImage';
import { Separator } from '~/components/ui/separator';
import createSupabaseServer from '~/utils/supabaseServer';
import { redirect } from 'next/navigation';

export default async function Home({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/unauthorized');
  }

  const isInOrganization = await serverClient.getUserOrganization.query({
    user_id: session?.user.id,
  });

  if (!isInOrganization) {
    redirect('/unauthorized');
  }

  return (
    <main>
      <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
        <div className='space-y-0.5'>
          <h1 className='pb-2 text-4xl font-light'>Create Artist</h1>
          <p className='text-muted-foreground'>
            Please fill in all the details to create a profile for an artist!
          </p>
        </div>
        <Separator className='my-6' />
        <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className='space-y-6'>
            <div>
              <div className='space-y-2'>
                <h1 className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                  Upload an Image for the Artist Profile
                </h1>
                <UploadImage
                  params={{
                    id: params.id,
                    bucket: 'artists',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
