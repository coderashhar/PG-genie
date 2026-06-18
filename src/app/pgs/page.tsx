import React, { Suspense } from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getProperties, PropertyQueryParams } from '@/lib/property-queries';
import FilterSidebar from '@/components/FilterSidebar';
import PropertyFeed from '@/components/PropertyFeed';

// Define the type for the searchParams prop
export interface PgsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function PgsPage({ searchParams }: PgsPageProps) {
  const resolvedParams = await searchParams;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading PGs...</div>}>
      <PgsContent resolvedParams={resolvedParams} />
    </Suspense>
  );
}

async function PgsContent({ resolvedParams }: { resolvedParams: { [key: string]: string | undefined } }) {
  // 1. Fetch properties using shared query logic
  const queryParams: PropertyQueryParams = {
    city: resolvedParams.city,
    minPrice: resolvedParams.minPrice,
    maxPrice: resolvedParams.maxPrice,
    search: resolvedParams.search,
    amenities: resolvedParams.amenities,
    sort: resolvedParams.sort,
    gender: resolvedParams.gender,
    page: 1, // Always fetch page 1 on server
    limit: 6,
  };

  const { properties, hasMore } = await getProperties(queryParams);

  // 2. Fetch user session and saved PGs
  const session = await getServerSession(authOptions);
  let savedPgIds: string[] = [];

  if (session?.user) {
    await connectToDatabase();
    const userId = (session.user as any).id;
    const user = await User.findById(userId).select('savedPgs').lean();
    if (user && user.savedPgs) {
      savedPgIds = user.savedPgs.map((id: any) => id.toString());
    }
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-stack-lg flex flex-col md:flex-row gap-stack-lg">
        {/* Left Sidebar: Filters */}
        <FilterSidebar />

        {/* Right Content Area: Infinite Scroll Feed */}
        <PropertyFeed 
          initialProperties={properties} 
          initialHasMore={hasMore} 
          initialSavedPgIds={savedPgIds}
        />
      </main>
    </div>
  );
}
