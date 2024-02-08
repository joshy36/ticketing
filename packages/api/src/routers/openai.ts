import { authedProcedure, publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { qstashClient } from '../job-queue/utils';

export const openAiRouter = router({
  generatePfpForUser: publicProcedure
    .input(z.object({ id: z.string(), prompt: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const prompt =
        input.prompt.replace(/_/g, ' ') +
        ' in space retro theme profile picture';
      const openaiApiKey = process.env.OPEN_AI_API_KEY;

      console.log('generating image from openai');
      const res = await qstashClient.publishJSON({
        url: 'https://api.openai.com/v1/images/generations',
        callback: `${process.env.UPSTASH_URL}/api/qstash-callback-dalle?id=${input.id}`,
        headers: {
          'upstash-forward-Authorization': `Bearer ${openaiApiKey}`,
        },
        body: {
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
        },
      });
    }),
});
