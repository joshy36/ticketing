import ProfileView from './ProfileView';

export default function Home({ params }: { params: { username: string } }) {
  return (
    <main>
      <ProfileView params={{ username: params.username }} />
    </main>
  );
}
