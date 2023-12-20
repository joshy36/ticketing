import UploadImage from '@/components/UploadImage';
import { Separator } from '@/components/ui/separator';
import createSupabaseServer from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';

export default async function Home({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // event creator must match id
  if (!session?.user) {
    redirect('/unauthorized');
  }

  return (
    <main>
      <div className='lg:px-80'>
        <div className=' space-y-6 p-10 pb-16 sm:block'>
          <div className='space-y-0.5'>
            <h2 className='text-2xl font-bold tracking-tight'>Create Event</h2>
            <p className='text-muted-foreground'>
              Please fill in all the details to create your event!
            </p>
          </div>
          <Separator className='my-6' />
          <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
            <div className='space-y-6'>
              <div>
                <div className='space-y-2'>
                  <h1 className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    Upload an Image for the Event
                  </h1>
                  <UploadImage
                    params={{
                      id: params.id,
                      bucket: 'events',
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
