const { createClient } = require('@supabase/supabase-js');
const { userIds } = require('./userIds');
require('dotenv').config();

const SUPABASE_URL = process.env.PROD_NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.PROD_NEXT_PUBLIC_SUPABASE_ANON_KEY;

const main = async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  //   test('correct number of tickets', async () => {
  //     const { count: numberOfTickets } = await supabase
  //       .from('tickets')
  //       .select('*', { count: 'exact', head: true })
  //       .eq('event_id', 'd1325166-23e1-4990-9478-d893fbcc7a8f');
  //     expect(numberOfTickets).toBe(200);
  //   });

  for (let i = 0; i < userIds.length; i++) {
    // test(`correct number of tickets for ${userIds[i]}`, async () => {
    const { count: numberOfTicketsPurchased } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', 'd1325166-23e1-4990-9478-d893fbcc7a8f')
      .eq('purchaser_id', userIds[i]);
    const { count: numberOfTicketsOwned } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', 'd1325166-23e1-4990-9478-d893fbcc7a8f')
      .eq('owner_id', userIds[i]);
    console.log('userIds:', userIds[i]);
    console.log('numberOfTicketsPurchased:', numberOfTicketsPurchased);
    console.log('numberOfTicketsOwned:', numberOfTicketsOwned);
    //   expect(numberOfTicketsPurchased).toBe(2);
    //   expect(numberOfTicketsOwned).toBe(1);
    // });
  }
  // wallet address
};

main();
