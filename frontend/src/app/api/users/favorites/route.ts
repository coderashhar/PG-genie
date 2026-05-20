import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

/**
 * POST /api/users/favorites
 * Adds a PG property to the authenticated student's savedPgs list.
 * Body: { pgId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const userId = (session.user as any).id;
    const body = await req.json();
    const { pgId } = body;

    if (!pgId) {
      return NextResponse.json(
        { error: 'Property ID (pgId) is required' },
        { status: 400 }
      );
    }

    // Add to savedPgs using $addToSet to prevent duplicates
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedPgs: pgId } },
      { new: true }
    ).select('savedPgs');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'PG saved to favorites', savedPgs: updatedUser.savedPgs },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
