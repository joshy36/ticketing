import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';

export const eventsRouter = router({
  getEvents: publicProcedure.query(async (opts) => {
    const supabase = opts.ctx.supabase;
    const { data } = await supabase.from('events').select(`*, venues (name)`);

    return data;
  }),

  getEventById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('events')
        .select()
        .eq('id', opts.input.id)
        .limit(1)
        .single();
      return data;
    }),

  createEvent: authedProcedure
    .input(
      z.object({
        name: z.string(),
        artist: z.string(),
        venue: z.string(),
        description: z.string(),
        ga_tickets: z.number(),
        ga_price: z.number(),
        rows: z.number().optional(),
        seats_per_row: z.number().optional(),
        date: z.date(),
        image: z.string().nullable(),
      })
    )
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;

      let ticketsRemaining = opts.input.ga_tickets;
      if (
        opts.input.rows &&
        opts.input.rows > 0 &&
        opts.input.seats_per_row &&
        opts.input.seats_per_row > 0
      ) {
        ticketsRemaining += opts.input.rows * opts.input.seats_per_row;
      }

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          name: opts.input.name,
          artist: opts.input.artist,
          venue: opts.input.venue,
          description: opts.input.description,
          ga_tickets: opts.input.ga_tickets,
          ga_price: opts.input.ga_price,
          rows: opts.input.rows,
          seats_per_row: opts.input.seats_per_row,
          tickets_remaining: ticketsRemaining,
          date: opts.input.date,
          created_by: opts.ctx.user?.id!,
          image: opts.input.image ?? null,
        })
        .select()
        .limit(1)
        .single();

      const tickets = Array(opts.input.ga_tickets).fill({
        event_id: eventData?.id,
        price: opts.input.ga_price,
        seat: 'GA',
      });

      if (opts.input.rows && opts.input.seats_per_row) {
        const names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let row = 1; row <= opts.input.rows; row++) {
          for (let seat = 0; seat < opts.input.seats_per_row; seat++) {
            tickets.push({
              event_id: eventData?.id,
              price: opts.input.ga_price,
              seat: String(row) + names[seat],
            });
          }
        }
      }

      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .insert(tickets);

      return eventData;
    }),

  updateEvent: publicProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
      })
    )
    .mutation(async (opts) => {
      const supabase = opts.ctx.supabase;
      const { data } = await supabase
        .from('events')
        .update(opts.input)
        .eq('id', opts.input.id)
        .select()
        .single();

      return data;
    }),
});
