import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';
import { cookies } from 'next/headers';

const isAdmin = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return !!session;
};

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    // Simple search by name or owner email/name
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: 'i' } };
    }

    const properties = await Property.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ properties });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
