const { createClient } = require('@supabase/supabase-js');
const { userIds } = require('./loadTestVerifiers/userIds');
require('dotenv').config();

const SUPABASE_URL = process.env.PROD_NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.PROD_NEXT_PUBLIC_SUPABASE_ANON_KEY;

const main = async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  //   test('correct number of tickets', async () => {
  //     const { count: numberOfTickets } = await supabase
  //       .from('tickets')
  //       .select('*', { count: 'exact', head: true })
  //       .eq('event_id', '302cf608-5212-4cd2-9a10-ace1278806ab');
  //     expect(numberOfTickets).toBe(200);
  //   });

  for (let i = 0; i < userIds.length; i++) {
    const { count: numberOfTicketsPurchased } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', '302cf608-5212-4cd2-9a10-ace1278806ab')
      .eq('purchaser_id', userIds[i]);
    const { count: numberOfTicketsOwned } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', '302cf608-5212-4cd2-9a10-ace1278806ab')
      .eq('owner_id', userIds[i]);

    console.log('userIds:', userIds[i]);
    console.log('numberOfTicketsPurchased:', numberOfTicketsPurchased);
    console.log('numberOfTicketsOwned:', numberOfTicketsOwned);
  }
  // wallet address
};

main();
