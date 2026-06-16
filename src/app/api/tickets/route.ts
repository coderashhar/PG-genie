import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Ticket from '@/models/Ticket';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Check if user is logged in to associate the ticket
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const ticket = await Ticket.create({
      name,
      email,
      subject,
      message,
      userId: userId || undefined,
    });

    return NextResponse.json(
      { message: 'Support ticket submitted successfully', ticket },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Submit ticket error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
