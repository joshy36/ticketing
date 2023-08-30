import { NextRequest, NextResponse } from 'next/server';
import createRouteClient from '@/lib/supabaseRoute';

export async function POST(req: NextRequest) {
  const supabase = createRouteClient();

  const formData = await req.formData();
  const file = formData.get('file');
  const fileName = formData.get('fileName');
  const location = formData.get('location');
  const bucket = String(formData.get('bucket'));

  const fileType = String(fileName).split('.')[1];

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(String(location), file!, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/' + fileType,
    });

  console.log('DATA: ', data);

  if (error) {
    console.log('Error uploading file:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  } else {
    console.log('Successfully uploaded file:', { location });
    return NextResponse.json({ location });
  }
}
