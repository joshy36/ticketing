const { createClient } = require('@supabase/supabase-js');
const { userIds } = require('./userIds');
require('dotenv').config();

const SUPABASE_URL = process.env.PROD_NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.PROD_NEXT_PUBLIC_SUPABASE_ANON_KEY;

const main = async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  test('correct number of tickets', async () => {
    const { count: numberOfTickets } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', '2de555d2-311d-4e6d-a0c5-35a829edb543');
    expect(numberOfTickets).toBe(200);
  });

  for (let i = 0; i < userIds.length; i++) {
    test(`correct number of tickets for ${userIds[i]}`, async () => {
      const { count: numberOfTicketsPurchased } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', '2de555d2-311d-4e6d-a0c5-35a829edb543')
        .eq('purchaser_id', userIds[i]);
      const { count: numberOfTicketsOwned } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', '2de555d2-311d-4e6d-a0c5-35a829edb543')
        .eq('owner_id', userIds[i]);
      expect(numberOfTicketsPurchased).toBe(0);
      expect(numberOfTicketsOwned).toBe(0);
    });
  }

  // based on eventId we want to
  // confirm purchaser Id was updated
  // conrifm ownerId was updated
  // confirm wallet address was updated
};

main();
