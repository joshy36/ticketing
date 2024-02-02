import { NextRequest, NextResponse } from 'next/server';
import {
  VerifySignatureConfig,
  verifySignatureAppRouter,
} from '@upstash/qstash/dist/nextjs';
import { serverClient } from '@/app/_trpc/serverClient';

async function handler(req: NextRequest) {
  const body = await req.json();

  console.log('qstash-callback-dalle');
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ body: 'Invalid id' }, { status: 400 });
  }

  const decodedBody = JSON.parse(atob(body.body));
  console.log('decodedBody: ', decodedBody);
  const image_url = decodedBody.data[0].url;
  const bucket = 'users';
  const formData = new FormData();
  console.log('starting fetch');

  await fetch(image_url!)
    .then((response) => response.blob())
    .then(async (blob) => {
      console.log('fetch');
      console.log('file: ', blob);
      formData.append('file', blob);
      formData.append('fileName', 'profile.png');
      formData.append('location', `/${id}/profile.png`);
      formData.append('bucket', bucket);
      formData.append('id', id);

      console.log('formData:', formData);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const resImage = await fetch(baseUrl + `/api/image/upload`, {
        method: 'POST',
        body: formData,
        cache: 'no-store',
      });

      const fileName = await resImage.json();

      await serverClient.updateUser.mutate({
        id: id,
        profile_image:
          process.env.NEXT_PUBLIC_BUCKET_BASE_URL +
          '/' +
          bucket +
          fileName.location,
      });
    })
    .catch((error) => console.error('Error:', error));

  return NextResponse.json({ body: 'Success' }, { status: 200 });
}

const config: VerifySignatureConfig = {
  clockTolerance: 10,
};

export const POST = verifySignatureAppRouter(handler, config);
