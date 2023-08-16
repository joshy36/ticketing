import Image from 'next/image';

const products = [
  {
    id: 1,
    name: 'Earthen Bottle',
    href: '#',
    price: '$48',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    imageAlt:
      'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
  {
    id: 2,
    name: 'Nomad Tumbler',
    href: '#',
    price: '$35',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt:
      'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 3,
    name: 'Focus Paper Refill',
    href: '#',
    price: '$89',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
    imageAlt:
      'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 4,
    name: 'Machined Mechanical Pencil',
    href: '#',
    price: '$35',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt:
      'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
  // More products...
];

async function getEvents() {
  try {
    const baseUrl = process.env.BASE_URL;
    const res = await fetch(baseUrl + `/api/event`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch events');
    }

    const events = await res.json();
    return events.events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function EventsList() {
  const data = await getEvents();

  if (!data || data.length === 0) {
    return <div>Error: Failed to fetch events</div>;
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Events</h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {data.map((event) => (
            <a key={event.id} href={`/event/${event.id}`} className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-background xl:aspect-h-8 xl:aspect-w-7">
                <Image
                  src={event.image}
                  alt={event.description}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-accent-foreground">
                {event.name}
              </h3>
              <p className="mt-1 text-sm font-sm text-accent-foreground">
                {`Location: ${event.location}`}
              </p>
              <p className="mt-1 text-sm font-sm text-accent-foreground">
                {`Date: ${event.date.toLocaleString()}`}
              </p>
              <p className="mt-1 text-lg font-medium text-accent-foreground">
                {event.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
