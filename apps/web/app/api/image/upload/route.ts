import { NextRequest, NextResponse } from 'next/server';
import createRouteClient from '../../../../utils/supabaseRoute';

export async function POST(req: NextRequest) {
  const supabase = createRouteClient();

  const array = new Uint32Array(10);
  crypto.getRandomValues(array);
  const randomNumber = array[0];

  const formData = await req.formData();
  const file = formData.get('file');
  const fileName = formData.get('fileName');
  const location = formData.get('location') + '?v=' + randomNumber;
  const bucket = String(formData.get('bucket'));

  const fileType = String(fileName).split('.')[1];

  console.log('file', file);
  console.log('filename', fileName);
  console.log('location', location);
  console.log('filetype', fileType);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(location, file!, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/' + fileType,
    });

  if (error) {
    console.log('Error uploading file:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  } else {
    console.log('Successfully uploaded file:', { location });
    return NextResponse.json({ location });
  }
}
