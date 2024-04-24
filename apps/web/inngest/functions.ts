import { inngest } from './client';
import { ethers } from 'ethers';
import contractAbi from '../../../packages/chain/deployments/base-goerli/Event.json';
import createSupabaseServer from '@/utils/supabaseServer';
import OpenAI from 'openai';
import { serverClient } from '@/app/_trpc/serverClient';

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

export const transferTicketDatabase = inngest.createFunction(
  { id: 'transfer-ticket-database', concurrency: 1 },
  { event: 'ticket/transfer.database' },
  async ({ event }) => {
    const supabase = createSupabaseServer();
    console.log(
      `INNGEST::recieved: ${event.data.transaction_id} ${event.data.purchaser_id} ${event.data.section_id} ${event.data.event_id}`,
    );
    const { data: ticket, error } = await supabase
      .from('tickets')
      .update({
        owner_id: event.data.owner_id,
        purchaser_id: event.data.purchaser_id,
        transaction_id: event.data.transaction_id,
      })
      .is('purchaser_id', null)
      .is('owner_id', null)
      .eq('section_id', event.data.section_id)
      .eq('event_id', event.data.event_id)
      .order('id', { ascending: true })
      .select()
      .limit(1)
      .single();
    console.log(`INNGEST::done: ${ticket}`);
    return ticket;
  },
);

export const transferTicket = inngest.createFunction(
  { id: 'transfer-ticket', concurrency: 1 },
  { event: 'ticket/transfer' },
  async ({ event }) => {
    console.log(`INNGEST::recieved: ${event.data.ticket_id}`);
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
      .eq('id', event.data.user_id)
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
