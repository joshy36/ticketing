import { inngest } from './client';
import { ethers } from 'ethers';
import contractAbi from '../../../packages/chain/deployments/base-goerli/Event.json';
import createSupabaseServer from '~/utils/supabaseServer';
import OpenAI from 'openai';
import { serverClient } from '~/app/_trpc/serverClient';
import Replicate from 'replicate';
import { createRouteClient } from 'supabase';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world', concurrency: 1 },
  { event: 'test/hello.world' },
  async ({ event }) => {
    console.log('Sleeping for 10s');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await new Promise((resolve) => setTimeout(resolve, 2000));
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Done sleeping');
    return { event, body: 'Hello, World!' };
  },
);

export const generatePfpForUser = inngest.createFunction(
  { id: 'generate-pfp-for-user', concurrency: 5 },
  { event: 'user/generate.pfp' },
  async ({ event }) => {
    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY,
    });

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: event.data.prompt,
      n: 1,
      size: '1024x1024',
    });

    const image_url = response.data[0]?.url;
    console.log(image_url);
    const bucket = 'users';
    const formData = new FormData();
    await fetch(image_url!)
      .then((response) => response.blob())
      .then(async (blob) => {
        formData.append('file', blob);
        formData.append('fileName', 'profile.png');
        formData.append('location', `/${event.data.id}/profile.png`);
        formData.append('bucket', bucket);
        formData.append('id', event.data.id);

        console.log('formData:', formData);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const resImage = await fetch(baseUrl + `/api/image/upload`, {
          method: 'POST',
          body: formData,
          cache: 'no-store',
        });

        const fileName = await resImage.json();

        await serverClient.updateUser.mutate({
          id: event.data.id,
          profile_image:
            process.env.NEXT_PUBLIC_BUCKET_BASE_URL +
            '/' +
            bucket +
            fileName.location,
        });
      })
      .catch((error) => console.error('Error:', error));
  },
);

export const transferTicket = inngest.createFunction(
  { id: 'transfer-ticket', concurrency: 1 },
  { event: 'ticket/transfer' },
  async ({ event }) => {
    console.log(
      `INNGEST::transferTicket: ${event.data.ticket_id} ${event.data.event_id} ${event.data.owner_id}`,
    );
    const supabase = createSupabaseServer();
    const { data: eventSupabase } = await supabase
      .from('events')
      .select()
      .eq('id', event.data.event_id)
      .limit(1)
      .single();

    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select()
      .eq('id', event.data.ticket_id)
      .limit(1)
      .single();

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select()
      .eq('id', event.data.owner_id)
      .limit(1)
      .single();

    if (ticketError?.code == 'PGRST116') {
      throw new Error('Ticket not found');
    }

    const link = eventSupabase?.etherscan_link?.split('/');
    if (!link) {
      throw new Error('No etherscan link found for event');
    }

    const address = link[link.length - 1]!;
    const provider = new ethers.JsonRpcProvider(
      process.env.ALCHEMY_SEPOLIA_URL!,
    );

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const eventContract = new ethers.Contract(address, contractAbi.abi, signer);

    // @ts-ignore
    let tx = await eventContract.safeTransferFrom(
      signer.address,
      userProfile?.wallet_address,
      ticket?.token_id,
    );

    console.log(
      `Token transferred! Check it out at: https://base-sepolia.blockscout.com/tx/${tx.hash}`,
    );

    await supabase
      .from('tickets')
      .update({
        current_wallet_address: userProfile?.wallet_address,
      })
      .eq('id', event.data.ticket_id);
  },
);

export const generateImages = inngest.createFunction(
  { id: 'generate-images', concurrency: 500 },
  { event: 'image/generate' },
  async ({ event }) => {
    const supabase = createRouteClient();

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const input = {
      prompt: event.data.prompt,
      scheduler: 'K_EULER',
      num_outputs: 1,
    };

    const output = await replicate.run(
      'stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
      { input },
    );

    console.log(output);

    // @ts-ignore
    await fetch(output[0])
      .then((response) => response.blob())
      .then(async (blob) => {
        const { data, error } = await supabase.storage
          .from('events')
          .upload(
            `${event.data.event_id}/${event.data.collectiblesOrSbts}/${event.data.token_id}.png`,
            blob,
            {
              contentType: 'image/png',
              upsert: true,
            },
          );

        const url =
          process.env.NEXT_PUBLIC_BUCKET_BASE_URL +
          `/events/${event.data.event_id}/${event.data.collectiblesOrSbts}/${event.data.token_id}.png`;

        if (event.data.collectiblesOrSbts === 'collectibles') {
          const { data: tokens, error: tokenError } = await supabase
            .from('collectibles')
            .select(`*, tickets(*)`)
            .eq('event_id', event.data.event_id)
            .eq('tickets.token_id', event.data.token_id);

          // get token where tickets field is not null
          const token = tokens?.find((token) => token.tickets);

          if (!token) {
            console.error('Token not found');
            return;
          }

          const { data: updatedToken, error: updateError } = await supabase
            .from('collectibles')
            .update({ image: url })
            .eq('id', token.id);
        } else if (event.data.collectiblesOrSbts === 'sbts') {
          const { data: tokens, error: tokenError } = await supabase
            .from('sbts')
            .select(`*, tickets(*)`)
            .eq('event_id', event.data.event_id)
            .eq('tickets.token_id', event.data.token_id);

          // get token where tickets field is not null
          const token = tokens?.find((token) => token.tickets);

          if (!token) {
            console.error('Token not found');
            return;
          }

          const { data: updatedToken, error: updateError } = await supabase
            .from('sbts')
            .update({ image: url })
            .eq('id', token.id);
        }
      });

    return output;
  },
);
