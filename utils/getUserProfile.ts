import { cookies } from 'next/headers';

export default async function getUserProfile(id: string): Promise<UserProfile> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(baseUrl + `/api/user/${id}`, {
    headers: {
      cookie: cookies().toString(),
    },
    cache: 'no-store',
  });
  const user = await res.json();

  return user;
}
