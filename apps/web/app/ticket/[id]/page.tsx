import { serverClient } from '@/app/_trpc/serverClient';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function Home({ params }: { params: { id: string } }) {
  const ticket = await serverClient.getTicketById({ id: params.id });

  if (!ticket) {
    notFound();
  }

  return (
    <main>
      <div className='bg-background p-2 '>
        {ticket.events?.image ? (
          <Image
            src={ticket.events?.image}
            alt='Ticket Image'
            width={500}
            height={500}
            className=''
          />
        ) : (
          <Image
            src='/fallback.jpeg'
            alt='image'
            width={500}
            height={500}
            className='h-full w-full object-cover object-center group-hover:opacity-75'
          />
        )}
      </div>
      <h1 className='mt-4 text-lg text-accent-foreground'>
        {ticket.events?.name}
      </h1>
      <p className='font-sm mt-1 text-sm text-muted-foreground'>
        {`Seat: ${ticket.seat}`}
      </p>
      <Button>Activate</Button>
    </main>
  );
}
