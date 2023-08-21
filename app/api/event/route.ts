import { NextRequest, NextResponse } from 'next/server';
import createRouteClient from '@/lib/supabaseRoute';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteClient();
    const { data } = await supabase.from('events').select();
    return NextResponse.json(data);
  } catch (e) {
    console.error('Request error', e);
    return NextResponse.json(
      { error: 'Error fetching event' },
      { status: 500 }
    );
  }
}
