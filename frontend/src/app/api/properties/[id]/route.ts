import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid property ID format' }, { status: 400 });
    }
    
    // Fetch property by ID and populate owner details
    const property = await Property.findById(id).populate('ownerId', 'name email phone image');
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ property }, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching property ${params.id}:`, error);
    
    // Check if it's a cast error (invalid ObjectId)
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid property ID format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid property ID format' }, { status: 400 });
    }

    const body = await req.json();

    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Verify ownership
    if (property.ownerId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden: You do not own this property' }, { status: 403 });
    }

    // Don't allow changing ownerId
    delete body.ownerId;

    const updatedProperty = await Property.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ message: 'Property updated successfully', property: updatedProperty }, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating property ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid property ID format' }, { status: 400 });
    }

    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Verify ownership
    if (property.ownerId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden: You do not own this property' }, { status: 403 });
    }

    await Property.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Property deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`Error deleting property ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
