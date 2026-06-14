import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
      console.error('Admin credentials not set in .env.local');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (username === validUsername && password === validPassword) {
      // Create a response
      const response = NextResponse.json(
        { success: true },
        { status: 200 }
      );

      // Set the admin session cookie
      // In production, you'd want this to be a secure, signed JWT. 
      // For this simple implementation, a simple token suffices since it's checked by middleware
      response.cookies.set({
        name: 'admin_session',
        value: 'authenticated_admin_token',
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax',
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
