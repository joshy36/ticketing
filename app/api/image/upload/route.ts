import { NextRequest, NextResponse } from 'next/server';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  console.log('test');
  const supabase = createServerActionClient(
    { cookies },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
  );

  console.log('test2');
  const formData = await req.formData();
  const file = formData.get('file');
  const fileName = formData.get('fileName');
  const location = formData.get('location');

  const fileType = String(fileName).split('.')[1];
  const uuid = crypto.randomUUID();
  const nameWithUuid = fileName + '-' + uuid;
  const fullRoute = location + nameWithUuid;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(fullRoute, file!, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'image/' + fileType,
    });
  if (error) {
    console.log('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error fetching event' },
      { status: 500 }
    );
  } else {
    console.log('Successfully uploaded file:', data);
    return NextResponse.json({ fullRoute });
  }
}
