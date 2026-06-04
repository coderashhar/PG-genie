import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import Notification from '@/models/Notification';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const notifications = await Notification.find({ user: (session.user as any).id })
      .sort({ createdAt: -1 })
      .limit(50); // Get latest 50 notifications

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { notificationId } = body;

    await connectToDatabase();

    if (notificationId) {
      // Mark specific notification as read
      const updated = await Notification.findOneAndUpdate(
        { _id: notificationId, user: (session.user as any).id },
        { isRead: true },
        { new: true }
      );
      if (!updated) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, notification: updated }, { status: 200 });
    } else {
      // Mark all as read
      await Notification.updateMany(
        { user: (session.user as any).id, isRead: false },
        { isRead: true }
      );
      return NextResponse.json({ success: true, message: 'All marked as read' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
