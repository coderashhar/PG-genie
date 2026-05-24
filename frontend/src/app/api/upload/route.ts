import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Filename and content type are required.' },
        { status: 400 }
      );
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    
    if (!bucketName) {
      console.error('AWS_S3_BUCKET_NAME is missing');
      return NextResponse.json(
        { error: 'Server misconfiguration.' },
        { status: 500 }
      );
    }

    // Generate unique file name
    const uniqueFileName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFileName,
      ContentType: contentType,
    });

    // Create the presigned URL with a 5-minute expiration
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    // The direct URL to access the image after upload
    // For buckets without a custom domain, the URL format is generally:
    // https://[bucket-name].s3.[region].amazonaws.com/[key]
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${uniqueFileName}`;

    return NextResponse.json({ signedUrl, fileUrl });
  } catch (error) {
    console.error('Error generating pre-signed URL', error);
    return NextResponse.json(
      { error: 'Failed to generate pre-signed URL' },
      { status: 500 }
    );
  }
}
