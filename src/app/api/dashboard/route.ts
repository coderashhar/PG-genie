import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Property from '@/models/Property';
import Booking from '@/models/Booking';

/**
 * GET /api/dashboard
 * Returns aggregated dashboard data for the authenticated student:
 * - user profile info
 * - saved PGs (populated property details)
 * - bookings with property details
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

    // Fetch user with populated saved PGs
    const user = await User.findById(userId)
      .select('-password')
      .populate({
        path: 'savedPgs',
        model: Property,
        select: 'title description location price images status amenities roomTypes views furniture attachedBath waterSupply geyser wifi backupPower cctv washingMachine petFriendly',
      });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch user's bookings with property details
    const bookings = await Booking.find({ studentId: userId })
      .populate({
        path: 'pgId',
        model: Property,
        select: 'title location images price',
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          university: user.university,
        },
        savedPgs: user.savedPgs,
        bookings,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
