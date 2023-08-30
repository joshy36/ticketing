import { NextRequest, NextResponse } from 'next/server';
import createRouteClient from '@/lib/supabaseRoute';

export async function POST(req: NextRequest) {
  try {
    const { name, description, date, location } = await req.json();

    if (!name || !description || !date || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createRouteClient();

    const { data } = await supabase
      .from('events')
      .insert({
        name: name,
        description: description,
        date: date,
        location: location,
        image: null,
      })
      .select();

    return NextResponse.json(data);
  } catch (e) {
    console.error('Request error', e);
    return NextResponse.json(
      { error: 'Error creating event' },
      { status: 500 }
    );
  }
}
