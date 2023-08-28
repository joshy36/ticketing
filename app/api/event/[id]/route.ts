import { NextRequest, NextResponse } from 'next/server';
import createRouteClient from '@/lib/supabaseRoute';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteClient();
    const { data } = await supabase.from('events').select().eq('id', params.id);
    return NextResponse.json(data![0]);
  } catch (e) {
    console.error('Request error', e);
    return NextResponse.json(
      { error: 'Error fetching event' },
      { status: 500 }
    );
  }
}
