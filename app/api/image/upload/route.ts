import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_API_KEY!
  );

  const formData = await req.formData();
  const file = formData.get('file');
  const fileName = formData.get('fileName');
  const fileType = String(fileName).split('.')[1];

  const { data, error } = await supabase.storage
    .from('images')
    .upload('/' + fileName, file!, {
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
    return NextResponse.json({ data });
  }
}
