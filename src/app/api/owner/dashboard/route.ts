import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Property from '@/models/Property';
import Booking from '@/models/Booking';

/**
 * GET /api/owner/dashboard
 * Returns aggregated dashboard data for the authenticated owner:
 * - owner profile
 * - their property listings with view stats
 * - recent inquiries (bookings from students)
 * - computed stats (total listings, active leads, views this month)
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

    if ((session.user as any).role !== 'owner') {
      return NextResponse.json(
        { error: 'Forbidden. Owner access only.' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const userId = (session.user as any).id;

    // Fetch owner profile, listings, and inquiries in parallel
    const [owner, listings, inquiries] = await Promise.all([
      User.findById(userId).select('-password').lean(),
      Property.find({ ownerId: userId }).sort({ createdAt: -1 }).lean(),
      Booking.find({ ownerId: userId })
        .populate({
          path: 'studentId',
          model: User,
          select: 'name email image phone',
        })
        .populate({
          path: 'pgId',
          model: Property,
          select: 'title',
        })
        .sort({ createdAt: -1 })
        .lean()
    ]);

    if (!owner) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get property IDs for this owner
    const propertyIds = listings.map((p: any) => p._id);

    // Compute stats
    const totalListings = listings.length;
    const activeLeads = inquiries.filter((b) => b.status === 'pending').length;

    // Views this month
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    let viewsThisMonth = 0;
    let viewsLastMonth = 0;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    for (const property of listings) {
      for (const mv of property.monthlyViews || []) {
        if (mv.month === currentMonth && mv.year === currentYear) {
          viewsThisMonth += mv.count;
        }
        if (mv.month === lastMonth && mv.year === lastMonthYear) {
          viewsLastMonth += mv.count;
        }
      }
    }

    // Compute percentage change
    const viewsChangePercent =
      viewsLastMonth > 0
        ? Math.round(((viewsThisMonth - viewsLastMonth) / viewsLastMonth) * 100)
        : viewsThisMonth > 0
        ? 100
        : 0;

    // Count new listings this month
    const newListingsThisMonth = listings.filter((l) => {
      const created = new Date(l.createdAt);
      return created.getMonth() + 1 === currentMonth && created.getFullYear() === currentYear;
    }).length;

    // Unread inquiries (pending from last 48 hours)
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const unreadInquiries = inquiries.filter(
      (b) => b.status === 'pending' && new Date(b.createdAt) >= twoDaysAgo
    ).length;

    return NextResponse.json(
      {
        owner: {
          id: owner._id,
          name: owner.name,
          email: owner.email,
          image: owner.image,
          businessName: owner.businessName,
        },
        listings,
        inquiries,
        stats: {
          totalListings,
          activeLeads,
          unreadInquiries,
          viewsThisMonth,
          viewsChangePercent,
          newListingsThisMonth,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching owner dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
