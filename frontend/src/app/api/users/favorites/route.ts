import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Property from '@/models/Property'; // Required for populate

/**
 * GET /api/users/favorites
 * Returns the authenticated user's saved PGs with populated property details.
 */
export async function GET(req: NextRequest) {
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

    // Ensure the Property model is registered before populate
    // (the import above handles this)
    const user = await User.findById(userId)
      .select('savedPgs')
      .populate({
        path: 'savedPgs',
        model: Property,
        select: 'title description location price images status roomTypes amenities',
      });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { favorites: user.savedPgs },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

/**
 * DELETE /api/users/favorites
 * Removes a PG property from the authenticated student's savedPgs list.
 * Body: { pgId: string }
 */
export async function DELETE(req: NextRequest) {
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

    // Remove from savedPgs using $pull
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedPgs: pgId } },
      { new: true }
    ).select('savedPgs');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'PG removed from favorites', savedPgs: updatedUser.savedPgs },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

