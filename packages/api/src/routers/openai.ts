import { authedProcedure, publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { Inngest } from 'inngest';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'my-app' });

export const openAiRouter = router({
  generatePfpForUser: publicProcedure
    .input(z.object({ id: z.string(), prompt: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const prompt =
        input.prompt.replace(/_/g, ' ') +
        ' in space retro theme profile picture';

      await inngest.send({
        name: 'user/generate.pfp',
        data: {
          prompt: prompt,
          id: input.id,
        },
      });
    }),
});
