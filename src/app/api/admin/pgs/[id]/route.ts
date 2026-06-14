import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';
import User from '@/models/User';
import { cookies } from 'next/headers';

const isAdmin = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return !!session;
};

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectToDatabase();
    const propertyId = params.id;

    const property = await Property.findByIdAndDelete(propertyId);
    
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Also remove this property from any user's savedPgs list
    await User.updateMany(
      { savedPgs: propertyId },
      { $pull: { savedPgs: propertyId } }
    );

    return NextResponse.json({ success: true, message: 'Listing permanently deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
