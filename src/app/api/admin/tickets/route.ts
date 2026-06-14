import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Ticket from '@/models/Ticket';
import { cookies } from 'next/headers';

// Helper to verify admin
const isAdmin = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return !!session;
};

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectToDatabase();
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    return NextResponse.json({ tickets });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
