import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import Otp from '@/models/Otp';
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import rateLimit, { getIP } from '@/lib/ratelimit';

const limiter = rateLimit({
  interval: 3 * 60 * 60 * 1000, // 3 hours
  uniqueTokenPerInterval: 500,
});

const awsRegion = process.env.AWS_REGION || 'ap-south-1';
const awsAccessKey = process.env.AWS_ACCESS_KEY_ID || '';
const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY || '';

// Configure clients only if credentials exist
const hasAwsCredentials = awsAccessKey && awsSecretKey;

const snsClient = hasAwsCredentials ? new SNSClient({
  region: awsRegion,
  credentials: { accessKeyId: awsAccessKey, secretAccessKey: awsSecretKey }
}) : null;

const sesClient = hasAwsCredentials ? new SESClient({
  region: awsRegion,
  credentials: { accessKeyId: awsAccessKey, secretAccessKey: awsSecretKey }
}) : null;

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);
    try {
      await limiter.check(3, ip); // Limit to 3 OTP requests per 3 hours per IP
    } catch {
      return NextResponse.json({ error: 'please try after sometime' }, { status: 429 });
    }

    let { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json({ error: 'Please provide an email or phone number' }, { status: 400 });
    }

    // Normalize identifier
    identifier = identifier.trim();
    const isEmail = identifier.includes('@');
    if (!isEmail) {
      identifier = identifier.replace(/\s+/g, '');
      if (identifier.length === 10 && /^\d{10}$/.test(identifier)) {
        identifier = '+91' + identifier;
      } else if (identifier.startsWith('91') && identifier.length === 12) {
        identifier = '+' + identifier;
      }
    }

    await connectToDatabase();

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to database (upsert to prevent spamming multiple records)
    await Otp.findOneAndUpdate(
      { identifier },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Fallback to console if AWS is not configured yet
    if (!hasAwsCredentials) {
      console.log(`\n========================================`);
      console.log(`🔑 [AWS NOT CONFIGURED] OTP for ${identifier}: ${otp}`);
      console.log(`========================================\n`);
      return NextResponse.json({ success: true, message: 'OTP sent (Check Console)' }, { status: 200 });
    }

    // Send via AWS
    if (isEmail) {
      // Send Email via SES
      const senderEmail = process.env.AWS_SES_FROM_EMAIL || 'support@pggenie.com';
      const emailCommand = new SendEmailCommand({
        Source: senderEmail,
        Destination: { ToAddresses: [identifier] },
        Message: {
          Subject: { Data: "Your PG Genie Verification Code", Charset: "UTF-8" },
          Body: {
            Html: {
              Data: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                  <h2 style="color: #4C1D95;">PG Genie</h2>
                  <p style="font-size: 16px; color: #333;">Hello,</p>
                  <p style="font-size: 16px; color: #333;">Your verification code is:</p>
                  <div style="background-color: #F3F4F6; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <h1 style="margin: 0; letter-spacing: 5px; color: #111;">${otp}</h1>
                  </div>
                  <p style="font-size: 14px; color: #666;">This code will expire in 5 minutes. If you did not request this code, please ignore this email.</p>
                </div>
              `,
              Charset: "UTF-8",
            },
            Text: {
              Data: `Your PG Genie verification code is: ${otp}`,
              Charset: "UTF-8",
            }
          }
        }
      });
      console.log(`[DEBUG] Attempting to send SES email from ${senderEmail} to ${identifier}`);
      const sesResponse = await sesClient!.send(emailCommand);
      console.log(`[DEBUG] SES Send Response:`, JSON.stringify(sesResponse, null, 2));

    } else {
      // Send SMS via SNS
      const smsCommand = new PublishCommand({
        PhoneNumber: identifier,
        Message: `Your PG Genie verification code is: ${otp}. It is valid for 5 minutes.`,
        MessageAttributes: {
          'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional'
          }
        }
      });
      console.log(`[DEBUG] Attempting to send SNS SMS to ${identifier}`);
      const snsResponse = await snsClient!.send(smsCommand);
      console.log(`[DEBUG] SNS Send Response:`, JSON.stringify(snsResponse, null, 2));
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    // Determine if it's an AWS Sandbox/Verification error
    if (error.name === 'MessageRejected' || error.name === 'InvalidParameterException') {
      return NextResponse.json({ error: 'Failed to send. Number/Email might not be verified in AWS Sandbox.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error while sending OTP' }, { status: 500 });
  }
}
