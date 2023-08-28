import ProfileView from '@/components/ProfileView';

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main>
      <ProfileView params={{ id: params.id }} />
    </main>
  );
}
