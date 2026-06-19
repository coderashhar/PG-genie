import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/properties/[id]
 * Fetches the complete details of a single property.
 * Includes populated owner details.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid property ID format' }, { status: 400 });
    }
    
    // Fetch property by ID and populate owner details (restrict to public fields only)
    const property = await Property.findById(id).populate('ownerId', 'name image').lean();
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ property }, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching property:`, error);
    
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

/**
 * PUT /api/properties/[id]
 * Allows owners to edit property details (price, amenities, etc.).
 * Requires authentication and ownership verification.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid property ID format' }, { status: 400 });
    }

    const body = await req.json();

    if (body.images !== undefined && (!Array.isArray(body.images) || body.images.length === 0)) {
      return NextResponse.json({ error: 'At least one image is required.' }, { status: 400 });
    }

    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Verify ownership
    if (property.ownerId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden: You do not own this property' }, { status: 403 });
    }

    // Prevent updating reserved fields
    delete body.ownerId;
    delete body._id;
    delete body.createdAt;
    delete body.updatedAt;

    // Force status back to pending so admins can review the updated changes,
    // UNLESS the owner is simply toggling the status (Filled/Available) from the dashboard.
    const updatedKeys = Object.keys(body);
    const isOnlyStatusUpdate = updatedKeys.length === 1 && updatedKeys[0] === 'status';
    
    if (!isOnlyStatusUpdate) {
      body.status = 'pending';
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ message: 'Property updated successfully', property: updatedProperty }, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating property:`, error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/properties/[id]
 * Removes a property listing if it is no longer available.
 * Requires authentication and ownership verification.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const resolvedParams = await params;
    const { id } = resolvedParams;

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
    console.error(`Error deleting property:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
