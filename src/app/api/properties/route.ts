import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { getProperties } from '@/lib/property-queries';

const propertySchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().max(2000).optional().or(z.literal('')),
  location: z.object({
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    zipCode: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  price: z.number().min(500),
  roomTypes: z.array(z.string()).min(1),
  amenities: z.array(z.string()),
  furniture: z.boolean().optional(),
  attachedBath: z.boolean().optional(),
  waterSupply: z.boolean().optional(),
  geyser: z.boolean().optional(),
  wifi: z.boolean().optional(),
  backupPower: z.boolean().optional(),
  cctv: z.boolean().optional(),
  washingMachine: z.boolean().optional(),
  petFriendly: z.boolean().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const params = {
      city: searchParams.get('city'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      search: searchParams.get('search'),
      amenities: searchParams.get('amenities'),
      sort: searchParams.get('sort'),
      gender: searchParams.get('gender'),
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '6')
    };

    const data = await getProperties(params);

    return NextResponse.json(data, { status: 200 });
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
    
    const result = propertySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input data', details: result.error.format() }, { status: 400 });
    }
    
    const validatedBody = result.data;
    
    // Add the ownerId from the session
    const propertyData = {
      ...validatedBody,
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
