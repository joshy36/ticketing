'use client';
import useSWR from 'swr';

const fetcher = (arg, ...args) => fetch(arg, ...args).then((res) => res.json());

export default function Events() {
  const { data, error } = useSWR('/api/data', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {data.map((event) => (
        <li key={event.id} className="flex justify-between gap-x-6 py-5">
          <div className="flex gap-x-4">
            <img
              className="h-12 w-12 flex-none rounded-full bg-gray-50"
              src={event.imageUrl}
              alt=""
            />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {event.name}
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                {event.description}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex sm:flex-col sm:items-end">
            <p className="text-sm leading-6 text-gray-900">{event.date}</p>
            {/* {event.lastSeen ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                    Last updated <time dateTime={event.updatedAt}>{event.lastSeen}</time>
                </p>
                ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
                )} */}
          </div>
        </li>
      ))}
    </ul>
  );
}
