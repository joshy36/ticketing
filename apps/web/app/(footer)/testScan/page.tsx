import { serverClient } from '~/app/_trpc/serverClient';
import QRCode from 'react-qr-code';

export default async function Home() {
  const salts = await serverClient.getAllSalts.query();
  console.log(salts);
  return (
    <div className='flex flex-col items-center justify-center py-20'>
      {salts.map((salt) => (
        <div className='py-48' key={salt.id}>
          <div>{`username: ${salt.user_profiles.username}`}</div>
          <div>{`id: ${salt.user_profiles.id}`}</div>
          <QRCode value={salt} bgColor='#000000' fgColor='#FFFFFF' />
        </div>
      ))}
    </div>
  );
}
