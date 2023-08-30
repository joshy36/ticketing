import { NextRequest, NextResponse } from 'next/server';
import createRouteClient from '@/lib/supabaseRoute';

export async function POST(req: NextRequest) {
  const supabase = createRouteClient();

  const formData = await req.formData();
  const file = formData.get('file');
  const fileName = formData.get('fileName');
  const location = formData.get('location');

  const fileType = String(fileName).split('.')[1];
  // const uuid = crypto.randomUUID();
  // const nameWithUuid = fileName + '-' + uuid;
  // const fullRoute = location + nameWithUuid;
  const fullRoute = location + 'event_photo.jpeg';

  const { data, error } = await supabase.storage
    .from('events') // change to events
    .upload(fullRoute, file!, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/' + fileType,
    });

  console.log('DATA: ', data);

  if (error) {
    console.log('Error uploading file:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  } else {
    console.log('Successfully uploaded file:', { fullRoute });
    return NextResponse.json({ fullRoute });
  }
}
