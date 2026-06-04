import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Otp from '@/models/Otp';

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json({ error: 'Please provide an email or phone number' }, { status: 400 });
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

    // Simulate sending OTP (Email/SMS)
    console.log(`\n========================================`);
    console.log(`🔑 OTP for ${identifier}: ${otp}`);
    console.log(`========================================\n`);

    return NextResponse.json({ success: true, message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
