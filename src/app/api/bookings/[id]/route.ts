import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    if ((session.user as any).role !== 'owner') {
      return NextResponse.json({ error: 'Only owners can update booking status' }, { status: 403 });
    }

    await connectToDatabase();

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.ownerId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: 'Not authorized to update this booking' }, { status: 403 });
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    return NextResponse.json({ message: 'Booking updated successfully', booking: updatedBooking }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Only the student who created the booking can delete/cancel it
    if (booking.studentId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: 'Not authorized to delete this booking' }, { status: 403 });
    }

    // Only allow deletion if status is still pending (optional business logic, but good practice)
    if (booking.status !== 'pending') {
      return NextResponse.json({ error: 'Cannot cancel an application that is already processed' }, { status: 400 });
    }

    await Booking.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Booking cancelled successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
