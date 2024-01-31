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
      model: 'dall-e-2',
      prompt: 'chosen pink reindeer in retro space theme',
      n: 1,
      size: '1024x1024',
    });

    const image_url = res.data[0]?.url;
    console.log('img:', image_url);

    return image_url;
  }),
});
