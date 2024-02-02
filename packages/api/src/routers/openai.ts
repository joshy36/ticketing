import { serverClient } from '@/app/_trpc/serverClient';
import { authedProcedure, publicProcedure, router } from '../trpc';
import OpenAI from 'openai';

export const openAiRouter = router({
  generateImage: publicProcedure.mutation(async ({ ctx, input }) => {
    // const supabase = ctx.supabase;
    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY,
    });

    console.log('hit');
    const res = await openai.images.generate({
      model: 'dall-e-3',
      prompt: 'imperial apricot wren in space retro theme',
      n: 1,
      size: '1024x1024',
    });

    const image_url = res.data[0]?.url;
    console.log('img:', image_url);
    const bucket = 'users';
    const formData = new FormData();

    fetch(image_url!)
      .then((response) => response.blob())
      .then(async (blob) => {
        const file = new File([blob], 'filename.png', { type: blob.type });
        console.log(file);
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append(
          'location',
          `/699d0320-769b-4999-a232-3f7517c8ff2a/profile.png`
        );
        formData.append('bucket', bucket);
        formData.append('id', '699d0320-769b-4999-a232-3f7517c8ff2a');

        console.log('formData:', formData);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const resImage = await fetch(baseUrl + `/api/image/upload`, {
          method: 'POST',
          body: formData,
          cache: 'no-store',
        });

        const fileName = await resImage.json();

        await serverClient.updateUser.mutate({
          id: '699d0320-769b-4999-a232-3f7517c8ff2a',
          profile_image:
            process.env.NEXT_PUBLIC_BUCKET_BASE_URL +
            '/' +
            bucket +
            fileName.location,
        });
      })
      .catch((error) => console.error('Error:', error));

    return image_url;
  }),
});
