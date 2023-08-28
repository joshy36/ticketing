import { NextRequest, NextResponse } from 'next/server';
import createRouteClient from '@/lib/supabaseRoute';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await req.json();
    const supabase = createRouteClient();
    const { error } = await supabase
      .from('user_profiles')
      .update(user)
      .eq('id', params.id);
    return NextResponse.json('Successfully updated profile!');
  } catch (e) {
    console.error('Request error', e);
    return NextResponse.json(
      { error: 'Error updating user profile' },
      { status: 500 }
    );
  }
}
