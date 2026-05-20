import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

/**
 * GET /api/users/[id]/public
 * Returns a public-facing profile view for any user.
 * Only exposes non-sensitive information: name, image, role, bio, university.
 * No authentication required.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(id).select(
      'name image role bio university businessName createdAt'
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build public profile response based on role
    const publicProfile: Record<string, any> = {
      id: user._id,
      name: user.name,
      image: user.image,
      role: user.role,
      bio: user.bio,
      memberSince: user.createdAt,
    };

    // Include role-specific public fields
    if (user.role === 'student' && user.university) {
      publicProfile.university = user.university;
    }

    if (user.role === 'owner' && user.businessName) {
      publicProfile.businessName = user.businessName;
    }

    return NextResponse.json({ profile: publicProfile }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching public profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
