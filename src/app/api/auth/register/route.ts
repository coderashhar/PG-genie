import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Otp from '@/models/Otp';
import bcrypt from 'bcryptjs';
import rateLimit, { getIP } from '@/lib/ratelimit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);
    try {
      await limiter.check(5, ip); // 5 requests per minute per IP
    } catch {
      return NextResponse.json({ error: 'Too many requests, please try again later' }, { status: 429 });
    }

    let { name, identifier, otp, role, password } = await req.json();

    if (!name || !identifier || !otp || !role || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
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

    // 1. Verify OTP
    const validOtp = await Otp.findOne({
      identifier,
      otp,
    });

    if (!validOtp) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // OTP is valid, delete it
    await Otp.deleteOne({ _id: validOtp._id });

    // 2. Check if user already exists
    const existingUser = await User.findOne(
      isEmail ? { email: identifier } : { phone: identifier }
    );

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // 3. Create User
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: isEmail ? identifier : `${identifier}@temp.com`,
      phone: !isEmail ? identifier : undefined,
      role,
      password: hashedPassword,
    });

    return NextResponse.json({ success: true, message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
