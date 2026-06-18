import React, { Suspense } from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';
import User from '@/models/User';
import PgGallery from '@/components/PgGallery';
import PgActionButtons from '@/components/PgActionButtons';
import PgMapContainer from '@/components/PgMapContainer';

// --- Amenity icon map ---
const amenityIconMap: Record<string, string> = {
  WiFi: 'wifi',
  'High-Speed WiFi': 'wifi',
  'Fiber Internet': 'wifi',
  'Basic WiFi': 'wifi',
  AC: 'ac_unit',
  'Central AC': 'ac_unit',
  Laundry: 'local_laundry_service',
  Meals: 'restaurant',
  'Premium Meals': 'restaurant',
  '3 Meals/Day': 'restaurant',
  Gym: 'fitness_center',
  'Gym Access': 'fitness_center',
  Garden: 'park',
  'Power Backup': 'bolt',
  CCTV: 'videocam',
  'Study Room': 'menu_book',
  'Study Zone': 'menu_book',
  Parking: 'local_parking',
  'Shuttle to Campus': 'directions_bus',
  'Daily Cleaning': 'cleaning_services',
  Furniture: 'chair',
  'Attached Bath': 'bathtub',
  'Water Supply': 'water_drop',
  Geyser: 'heat_pump',
  'Backup Power': 'battery_charging_full',
  'Washing Machine': 'local_laundry_service',
  'Pet Friendly': 'pets',
};

// --- Skeleton Loader ---
export function PgDetailSkeleton() {
  return (
    <div className="bg-background min-h-screen flex flex-col font-body-md animate-pulse">
      <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-stack-md">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-32 bg-surface-container rounded mb-stack-sm" />
        
        {/* Gallery Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-stack-lg h-[300px] md:h-[500px] rounded-2xl overflow-hidden">
          <div className="md:col-span-3 bg-surface-container h-full" />
          <div className="hidden md:flex flex-col gap-2 h-full">
            <div className="flex-1 bg-surface-container" />
            <div className="flex-1 bg-surface-container" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
          <div className="lg:col-span-2 space-y-stack-lg">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start">
                <div className="space-y-3 w-3/4">
                  <div className="h-10 bg-surface-container rounded w-full" />
                  <div className="h-5 bg-surface-container rounded w-2/3" />
                </div>
                <div className="h-10 w-10 bg-surface-container rounded-full" />
              </div>
            </div>

            <hr className="border-outline-variant/30" />

            {/* About */}
            <div className="space-y-3">
              <div className="h-8 bg-surface-container rounded w-1/4" />
              <div className="h-4 bg-surface-container rounded w-full" />
              <div className="h-4 bg-surface-container rounded w-full" />
              <div className="h-4 bg-surface-container rounded w-5/6" />
            </div>

            {/* Amenities Grid */}
            <div className="space-y-4">
              <div className="h-8 bg-surface-container rounded w-1/4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-surface-container rounded-xl" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Pricing Card Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container h-64 flex flex-col gap-4">
              <div className="h-6 bg-surface-container rounded w-1/3" />
              <div className="h-12 bg-surface-container rounded w-1/2" />
              <div className="mt-auto flex gap-3">
                <div className="h-12 flex-1 bg-surface-container rounded-lg" />
                <div className="h-12 flex-1 bg-surface-container rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default async function PgDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<PgDetailSkeleton />}>
      <PgDetailContent id={id} />
    </Suspense>
  );
}

async function PgDetailContent({ id }: { id: string }) {
  await connectToDatabase();
  
  const propertyObj = await Property.findById(id).populate('ownerId', 'name phone email').lean();
  
  if (!propertyObj) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="bg-error-container text-on-error-container p-6 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <p>Property not found</p>
        </div>
        <Link href="/pgs" className="text-primary hover:underline">Go Back to Search</Link>
      </div>
    );
  }

  // Convert Mongoose _id to string for Client Components
  const property = JSON.parse(JSON.stringify(propertyObj));

  const session = await getServerSession(authOptions);
  let isSaved = false;

  if (session?.user) {
    const userId = (session.user as any).id;
    const user = await User.findById(userId).select('savedPgs').lean();
    if (user && user.savedPgs) {
      isSaved = user.savedPgs.some((savedId: any) => savedId.toString() === id);
    }
  }

  // Parse booleans into uniqueAmenities array
  const booleanAmenitiesList = [
    { key: 'wifi', label: 'WiFi' },
    { key: 'furniture', label: 'Furniture' },
    { key: 'attachedBath', label: 'Attached Bath' },
    { key: 'waterSupply', label: 'Water Supply' },
    { key: 'geyser', label: 'Geyser' },
    { key: 'backupPower', label: 'Backup Power' },
    { key: 'cctv', label: 'CCTV' },
    { key: 'washingMachine', label: 'Washing Machine' },
    { key: 'petFriendly', label: 'Pet Friendly' },
  ];
  const activeBooleans = booleanAmenitiesList
    .filter(a => property[a.key])
    .map(a => a.label);
  const uniqueAmenities = Array.from(new Set([...(property.amenities || []), ...activeBooleans]));

  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col">

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-stack-md">
        {/* Breadcrumb & Back */}
        <div className="mb-stack-sm flex items-center gap-2">
          <Link className="text-on-surface-variant hover:text-primary font-label-sm text-label-sm flex items-center gap-1 transition-colors" href="/pgs">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Search
          </Link>
        </div>

        {/* Bento Grid Gallery */}
        <PgGallery images={property.images || []} />

        {/* Main Layout: Content + Sticky Sidebar */}
        <div className="flex flex-col lg:flex-row gap-gutter relative">
          {/* Left Column: Details */}
          <div className="flex-1 flex flex-col gap-stack-lg">
            {/* Header Info */}
            <div>
              <div className="flex flex-wrap justify-between items-start gap-stack-sm mb-stack-sm">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Verified Partner
                    </span>
                  </div>
                  <h1 className="font-h1 text-h1 text-on-surface">{property.title}</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[18px]">location_on</span> {property.location?.address}, {property.location?.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-h1 text-primary">₹{property.price?.toLocaleString('en-IN')}<span className="font-body-sm text-body-sm text-on-surface-variant font-normal">/mo</span></p>
                  <p className="font-label-sm text-label-sm text-secondary flex items-center justify-end gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px] fill-current" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span> Filling Fast
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-outline-variant" />

            {/* Facilities */}
            <div>
              <h2 className="font-h2 text-h2 text-on-surface mb-stack-sm">Premium Facilities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uniqueAmenities.map((amenity: string, idx: number) => (
                  <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/10 hover:shadow-md hover:border-primary/30 transition-all text-center gap-2">
                    <span className="material-symbols-outlined text-[32px] text-primary">{amenityIconMap[amenity] || 'check_circle'}</span>
                    <span className="font-label-sm text-label-sm text-on-surface">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <hr className="border-outline-variant" />

            {/* Description */}
            <div>
              <h2 className="font-h2 text-h2 text-on-surface mb-stack-sm">About the Property</h2>
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <p className="font-body-md text-body-md text-on-surface-variant mb-4 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
                <Link href={`/owner/profile`} className="flex items-center gap-4 bg-surface-container-low p-4 rounded-lg hover:bg-surface-container transition-colors group cursor-pointer w-full sm:w-fit pr-10 mt-6">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-h2 text-h2 group-hover:scale-105 transition-transform">
                    {property.ownerId?.name?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface mb-1">Managed by</p>
                    <p className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1">{property.ownerId?.name || 'Owner'} <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span></p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-outline-variant" />

            {/* Map Section */}
            <PgMapContainer 
              lat={property.location?.lat}
              lng={property.location?.lng}
              address={`${property.location?.address || ''}, ${property.location?.city || ''}, ${property.location?.state || ''}`}
              title={property.title}
            />
          </div>

          {/* Right Column: Sticky Action Sidebar */}
          <PgActionButtons 
            propertyId={property._id}
            price={property.price}
            ownerPhone={property.ownerId?.phone}
            initialIsSaved={isSaved}
          />
        </div>
      </main>
    </div>
  );
}
