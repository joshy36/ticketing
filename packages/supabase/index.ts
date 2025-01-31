import type { Database as DB } from './database.types';
import createRouteClient from './supabaseRoute';

export type Database = DB;
export type Events = DB['public']['Tables']['events']['Row'];
export type UserProfile = DB['public']['Tables']['user_profiles']['Row'];
export type Ticket = DB['public']['Tables']['tickets']['Row'];
export type Artist = DB['public']['Tables']['artists']['Row'];
export type Venue = DB['public']['Tables']['venues']['Row'];
export type Organization = DB['public']['Tables']['organizations']['Row'];
export type Reservation = DB['public']['Tables']['reservations']['Row'];
export type Message = DB['public']['Tables']['chat_messages']['Row'];
export type Chat = DB['public']['Tables']['chats']['Row'];
export type Friend = DB['public']['Tables']['friends']['Row'];
export type TicketTransferPushRequest =
  DB['public']['Tables']['ticket_transfer_push_requests']['Row'];

export { createRouteClient };
