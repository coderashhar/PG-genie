import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Ticket from '@/models/Ticket';
import { cookies } from 'next/headers';

const isAdmin = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return !!session;
};

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectToDatabase();
    const { status } = await req.json();

    if (!['open', 'in_progress', 'resolved'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const ticket = await Ticket.findByIdAndUpdate(params.id, { status }, { new: true });
    
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
