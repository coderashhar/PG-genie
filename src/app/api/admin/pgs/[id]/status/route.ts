import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';
import Notification from '@/models/Notification';
import { cookies } from 'next/headers';

const isAdmin = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return !!session;
};

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    
    const { status, message } = await req.json();
    const { id } = await params;

    if (!['active', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    property.status = status;
    await property.save();

    // Create a notification for the owner
    const notificationTitle = status === 'active' 
      ? 'PG Listing Approved!' 
      : 'PG Listing Rejected';
      
    const notificationMessage = status === 'active'
      ? `Your listing "${property.title}" has been approved and is now live.`
      : `Your listing "${property.title}" was rejected. ${message ? `Reason: ${message}` : 'Please review our guidelines and update your listing.'}`;

    await Notification.create({
      user: property.ownerId,
      title: notificationTitle,
      message: notificationMessage,
      type: 'system',
      isRead: false,
    });

    return NextResponse.json({ 
      message: `Property successfully marked as ${status}`,
      property 
    });
  } catch (error) {
    console.error('Error updating property status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
