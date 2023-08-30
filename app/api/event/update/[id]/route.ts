import createRouteClient from '@/lib/supabaseRoute';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await req.json();
    const supabase = createRouteClient();
    const { data } = await supabase
      .from('events')
      .update(event)
      .eq('id', params.id);

    return NextResponse.json('Successfully updated event!');
  } catch (e) {
    console.error('Request error', e);
    return NextResponse.json(
      { error: 'Error creating event' },
      { status: 500 }
    );
  }
}
