import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Otp from '@/models/Otp';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    let { identifier, otp, newPassword } = await req.json();

    if (!identifier || !otp || !newPassword) {
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

    // 2. Check if user exists
    const user = await User.findOne(
      isEmail ? { email: identifier } : { phone: identifier }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // OTP is valid, delete it
    await Otp.deleteOne({ _id: validOtp._id });

    // 3. Update Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ success: true, message: 'Password reset successfully' }, { status: 200 });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
