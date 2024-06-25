import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'supabase';

export async function incrementArtistPointsForUser(
  supabase: SupabaseClient<Database>,
  user_id: string,
  artist_id: string,
  points: number
) {
  const { data: artistPoints } = await supabase
    .from('artist_points')
    .select()
    .eq('user_id', user_id)
    .eq('artist_id', artist_id)
    .single();

  if (!artistPoints) {
    await supabase.from('artist_points').insert({
      artist_id: artist_id,
      user_id: user_id,
      points: points,
    });
  } else {
    await supabase
      .from('artist_points')
      .update({
        points: artistPoints?.points! + points,
      })
      .eq('user_id', user_id)
      .eq('artist_id', artist_id);
  }
}

export async function incrementVenuePointsForUser(
  supabase: SupabaseClient<Database>,
  user_id: string,
  venue_id: string,
  points: number
) {
  const { data: venuePoints } = await supabase
    .from('venue_points')
    .select()
    .eq('user_id', user_id)
    .eq('venue_id', venue_id)
    .single();

  if (!venuePoints) {
    await supabase.from('venue_points').insert({
      venue_id: venue_id,
      user_id: user_id,
      points: points,
    });
  } else {
    await supabase
      .from('venue_points')
      .update({
        points: venuePoints?.points! + points,
      })
      .eq('user_id', user_id)
      .eq('venue_id', venue_id);
  }
}

export async function incrementPlatformPointsForUser(
  supabase: SupabaseClient<Database>,
  user_id: string,
  points: number
) {
  const { data: platformPoints } = await supabase
    .from('platform_points')
    .select()
    .eq('user_id', user_id)
    .single();

  if (!platformPoints) {
    await supabase.from('platform_points').insert({
      user_id: user_id,
      points: points,
    });
  } else {
    await supabase
      .from('platform_points')
      .update({
        points: platformPoints?.points! + points,
      })
      .eq('user_id', user_id);
  }
}
