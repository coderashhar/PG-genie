import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';

/**
 * POST /api/properties/[id]/view
 * Increments the view count for a property.
 * Also updates the monthlyViews array for the current month.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    // Try to increment existing monthly entry
    const result = await Property.findOneAndUpdate(
      {
        _id: id,
        'monthlyViews.month': currentMonth,
        'monthlyViews.year': currentYear,
      },
      {
        $inc: { views: 1, 'monthlyViews.$.count': 1 },
      },
      { new: true }
    );

    if (!result) {
      // No existing entry for this month — push a new one
      const property = await Property.findByIdAndUpdate(
        id,
        {
          $inc: { views: 1 },
          $push: {
            monthlyViews: { month: currentMonth, year: currentYear, count: 1 },
          },
        },
        { new: true }
      );

      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }

      return NextResponse.json({ views: property.views }, { status: 200 });
    }

    return NextResponse.json({ views: result.views }, { status: 200 });
  } catch (error: any) {
    console.error('Error tracking view:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
