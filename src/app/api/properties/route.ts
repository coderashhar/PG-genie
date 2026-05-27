import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const amenities = searchParams.get('amenities');
    const sort = searchParams.get('sort');
    
    // Build query object
    let query: any = { status: 'active' };
    
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') }
      ];
    }

    if (amenities) {
      const amenitiesList = amenities.split(',');
      query.amenities = { $all: amenitiesList.map(a => new RegExp(a, 'i')) };
    }

    let sortObj: any = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };
    else if (sort === 'popular') sortObj = { views: -1 };

    const properties = await Property.find(query).sort(sortObj);

    return NextResponse.json({ properties }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Ensure user is logged in
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Ensure user is an owner
    if ((session.user as any).role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden. Only owners can create properties.' }, { status: 403 });
    }

    await connectToDatabase();
    
    const body = await req.json();
    
    // Add the ownerId from the session
    const propertyData = {
      ...body,
      ownerId: (session.user as any).id,
    };
    
    const newProperty = await Property.create(propertyData);

    return NextResponse.json(
      { message: 'Property created successfully', property: newProperty },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
