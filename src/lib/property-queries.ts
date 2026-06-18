import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';

export interface PropertyQueryParams {
  city?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  search?: string | null;
  amenities?: string | null;
  sort?: string | null;
  gender?: string | null;
  page?: number;
  limit?: number;
}

export async function getProperties(params: PropertyQueryParams) {
  await connectToDatabase();

  const { city, minPrice, maxPrice, search, amenities, sort, gender, page = 1, limit = 6 } = params;

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

  return {
    properties: JSON.parse(JSON.stringify(properties)), // Serialize for Server Components
    total,
    page,
    limit,
    hasMore: skip + properties.length < total
  };
}
