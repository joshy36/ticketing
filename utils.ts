import AWS from 'aws-sdk';
import fs from 'fs';

export default async function uploadFile(filePath: string, fileName: string) {
  const s3 = new AWS.S3({
    accessKeyId: 'YOUR_AWS_ACCESS_KEY',
    secretAccessKey: 'YOUR_AWS_SECRET_KEY',
    region: 'YOUR_AWS_REGION',
  });

  // https://www.youtube.com/watch?v=NZElg91l_ms&ab_channel=SamMeech-Ward

  const fileContent = fs.readFileSync(filePath);

  console.log('test');

  const uploadParams = {
    Bucket: 'jb-tickets',
    Key: fileName,
    Body: fileContent,
  };

  const upload = await s3.upload(uploadParams).promise();
  return upload;
}
