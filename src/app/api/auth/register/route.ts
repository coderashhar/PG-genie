import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { name, emailOrPhone, password, role } = await req.json();

    if (!name || !emailOrPhone || !password) {
      return NextResponse.json(
        { error: 'Please provide all required fields (name, email/phone, password)' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const isEmail = emailOrPhone.includes('@');
    const query = isEmail ? { email: emailOrPhone } : { phone: emailOrPhone };

    // Check if user already exists
    const existingUser = await User.findOne(query);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email/phone' },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email: isEmail ? emailOrPhone : undefined,
      phone: !isEmail ? emailOrPhone : undefined,
      password: hashedPassword,
      role: role && ['student', 'owner'].includes(role) ? role : 'student',
    });

    return NextResponse.json(
      { message: 'User created successfully', userId: newUser._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
