import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

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
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const amenities = searchParams.get('amenities');
    const sort = searchParams.get('sort');
    const gender = searchParams.get('gender');
    
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
      const booleanMap: Record<string, string> = {
        'furniture': 'furniture',
        'attachedbath': 'attachedBath',
        'watersupply': 'waterSupply',
        'geyser': 'geyser',
        'wifi': 'wifi',
        'backuppower': 'backupPower',
        'cctv': 'cctv',
        'washingmachine': 'washingMachine',
        'petfriendly': 'petFriendly'
      };
      
      const stringAmenities: string[] = [];
      
      amenitiesList.forEach(a => {
        const key = a.toLowerCase();
        if (booleanMap[key]) {
          query[booleanMap[key]] = true;
        } else {
          stringAmenities.push(a);
        }
      });

      if (stringAmenities.length > 0) {
        query.amenities = { $all: stringAmenities.map(a => new RegExp(a, 'i')) };
      }
    }

    if (gender) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { title: new RegExp(gender, 'i') },
          { description: new RegExp(gender, 'i') }
        ]
      });
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const skip = (page - 1) * limit;

    let sortObj: any = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };
    else if (sort === 'popular') sortObj = { views: -1 };

    const [total, properties] = await Promise.all([
      Property.countDocuments(query),
      Property.find(query).sort(sortObj).skip(skip).limit(limit).lean()
    ]);

    return NextResponse.json({ 
      properties,
      total,
      page,
      limit,
      hasMore: skip + properties.length < total
    }, { status: 200 });
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
