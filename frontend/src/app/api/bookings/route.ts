import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;
    
    let query = {};
    if (userRole === 'owner') {
      query = { ownerId: userId };
    } else {
      query = { studentId: userId };
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Usually students apply, so we check if they are students
    if ((session.user as any).role !== 'student') {
      return NextResponse.json({ error: 'Only students can create bookings' }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { pgId, message, visitDate } = body;

    if (!pgId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const property = await Property.findById(pgId);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const existingBooking = await Booking.findOne({
      studentId: (session.user as any).id,
      pgId: pgId
    });

    if (existingBooking) {
      return NextResponse.json({ error: 'You have already applied for this PG' }, { status: 400 });
    }

    const newBooking = await Booking.create({
      studentId: (session.user as any).id,
      pgId,
      ownerId: property.ownerId,
      message,
      visitDate
    });

    return NextResponse.json({ message: 'Booking created successfully', booking: newBooking }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
