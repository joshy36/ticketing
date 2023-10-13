import UploadImage from '@/components/UploadImage';
import { Separator } from '@/components/ui/separator';
import createServerClient from '../../../../../utils/supabaseServer';
import { redirect } from 'next/navigation';

export default async function Home({ params }: { params: { id: string } }) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/unauthorized');
  }

  return (
    <main>
      <div className='lg:px-80'>
        <div className=' space-y-6 p-10 pb-16 sm:block'>
          <div className='space-y-0.5'>
            <h2 className='text-2xl font-bold tracking-tight'>Create Artist</h2>
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
      </div>
    </main>
  );
}
